<?php

namespace App\Http\Controllers;

use App\Models\Difficulty;
use App\Models\Game;
use App\Models\GameMode;
use App\Models\Record;
use App\Models\User;
use App\Services\SkinCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MinefieldGameController extends Controller
{
    private const TIME_TOLERANCE_MS = 2500;

    private const MIN_PLAUSIBLE_TIME_MS = 200;

    private const HINT_COST_COINS = 100;

    public function start(Request $request): JsonResponse
    {
        $data = $request->validate([
            'mode' => ['required', 'exists:game_modes,code'],
            'difficulty' => ['required', 'exists:difficulties,code'],
        ]);
        $mode = GameMode::findByCodeCached($data['mode']) ?? abort(404, 'Không tìm thấy chế độ chơi.');
        $difficulty = Difficulty::findByCodeCached($data['difficulty']) ?? abort(404, 'Không tìm thấy độ khó.');
        $token = (string) Str::uuid();
        $startedAt = now();

        if ($user = $request->user()) {
            Game::create([
                'token' => $token,
                'user_id' => $user->id,
                'mode_id' => $mode->id,
                'difficulty_id' => $difficulty->id,
                'status' => 'playing',
                'started_at' => $startedAt,
            ]);
        } else {
            $request->session()->put("minefield.games.{$token}", [
                'started_at' => $startedAt->getTimestampMs(),
                'mode' => $mode->code,
                'difficulty' => $difficulty->code,
            ]);
        }

        return response()->json([
            'token' => $token,
            'mode' => $mode->code,
            'difficulty' => $difficulty->code,
            'rows' => $difficulty->board_rows,
            'cols' => $difficulty->board_cols,
            'mines' => $difficulty->mine_count,
        ]);
    }

    /**
     * Xác thực và trừ 100 xu trong cơ sở dữ liệu khi người chơi dùng gợi ý (Hint).
     * Logic tìm ô mìn biên giới và cắm cờ chạy trực tiếp tại engine JS phía client.
     */
    public function hint(Request $request, string $token): JsonResponse
    {
        $hintCost = self::HINT_COST_COINS;

        if (! $authUser = $request->user()) {
            $sessionGame = $request->session()->get("minefield.games.{$token}");
            abort_unless($sessionGame !== null, 404, 'Không tìm thấy phiên chơi.');

            return response()->json([
                'success' => true,
                'cost' => $hintCost,
            ]);
        }

        $outcome = DB::transaction(function () use ($authUser, $token, $hintCost): array {
            $user = User::whereKey($authUser->id)->lockForUpdate()->firstOrFail();
            $game = Game::where('token', $token)->where('user_id', $user->id)->lockForUpdate()->firstOrFail();
            abort_if($game->status !== 'playing', 409, 'Phiên chơi này đã kết thúc.');

            if ($user->coins < $hintCost) {
                return [
                    'status' => 422,
                    'payload' => [
                        'success' => false,
                        'message' => 'Bạn không đủ xu! Cần ' . $hintCost . ' xu để sử dụng gợi ý (Số dư hiện tại: ' . $user->coins . ' xu). Hãy thắng thêm ván để nhận xu!',
                    ],
                ];
            }

            $user->decrement('coins', $hintCost);
            $user->refresh();

            return [
                'status' => 200,
                'payload' => [
                    'success' => true,
                    'coins' => (int) $user->coins,
                    'cost' => $hintCost,
                ],
            ];
        });

        return response()->json($outcome['payload'], $outcome['status']);
    }

    public function win(Request $request, string $token): JsonResponse
    {
        $data = $request->validate([
            'mode' => ['required', 'exists:game_modes,code'],
            'difficulty' => ['required', 'exists:difficulties,code'],
            'timeMs' => ['required', 'integer', 'min:1', 'max:2147483647'],
        ]);

        if (! $authUser = $request->user()) {
            $game = $request->session()->pull("minefield.games.{$token}");
            abort_unless($game !== null, 404, 'Không tìm thấy phiên chơi.');
            $this->verifyGamePayload($game['mode'], $game['difficulty'], $data);
            $this->verifyTime((int) $data['timeMs'], (int) $game['started_at']);

            $difficulty = Difficulty::findByCodeCached($data['difficulty']) ?? abort(404, 'Không tìm thấy độ khó.');
            $mode = GameMode::findByCodeCached($data['mode']) ?? abort(404, 'Không tìm thấy chế độ chơi.');

            return response()->json($this->finalizeGuestWin($difficulty, $mode, (int) $data['timeMs']));
        }

        $result = DB::transaction(function () use ($data, $token, $authUser): array {
            $user = User::whereKey($authUser->id)->lockForUpdate()->firstOrFail();
            $game = Game::with(['mode', 'difficulty'])->where('token', $token)->where('user_id', $user->id)->lockForUpdate()->first();
            abort_unless($game !== null, 404, 'Không tìm thấy phiên chơi.');
            abort_if($game->status !== 'playing', 409, 'Phiên chơi này đã kết thúc.');

            $modeModel = $game->mode;
            $difficultyModel = $game->difficulty;

            $this->verifyGamePayload($modeModel->code, $difficultyModel->code, $data);
            $startedAtMs = (int) $game->started_at->format('Uv');
            $this->verifyTime((int) $data['timeMs'], $startedAtMs);

            $finishedAt = now();
            $timeMs = (int) $data['timeMs'];

            return $this->finalizePlayerWin($game, $user, $difficultyModel, $modeModel, $timeMs, $finishedAt);
        });

        return response()->json($result);
    }

    /**
     * Finalize a won game for an authenticated player:
     * - Record status, time, and finished_at
     * - Award base coins and speed bonus (<30s: 100, <60s: 50, <100s: 25, >=100s: 0)
     * - Update personal best record and calculate leaderboard rank
     */
    private function finalizePlayerWin(Game $game, User $user, Difficulty $difficulty, GameMode $mode, int $timeMs, \DateTimeInterface $finishedAt): array
    {
        $game->status = 'won';
        $game->finished_at = $finishedAt;
        $game->time_ms = $timeMs;
        $game->save();

        $breakdown = SkinCatalog::getRewardBreakdown($difficulty, $mode, $timeMs);
        $coinsEarned = $breakdown['total'];
        $user->increment('coins', $coinsEarned);

        $record = Record::where('user_id', $user->id)
            ->where('mode_id', $game->mode_id)
            ->where('difficulty_id', $game->difficulty_id)
            ->lockForUpdate()
            ->first();

        $isBest = ! $record || $timeMs < $record->best_time_ms;
        if ($isBest) {
            $record ??= new Record([
                'user_id' => $user->id,
                'mode_id' => $game->mode_id,
                'difficulty_id' => $game->difficulty_id,
            ]);
            $record->fill([
                'game_id' => $game->id,
                'best_time_ms' => $timeMs,
                'achieved_at' => $finishedAt,
            ])->save();
        }

        $rank = Record::where('mode_id', $game->mode_id)
            ->where('difficulty_id', $game->difficulty_id)
            ->where(function ($query) use ($record): void {
                $query->where('best_time_ms', '<', $record->best_time_ms)
                    ->orWhere(function ($tie) use ($record): void {
                        $tie->where('best_time_ms', $record->best_time_ms)
                            ->where('achieved_at', '<', $record->achieved_at->format('Y-m-d H:i:s.v'));
                    });
            })->count() + 1;

        $user->refresh();

        return [
            'saved' => true,
            'isBest' => $isBest,
            'rank' => $rank,
            'timeMs' => $timeMs,
            'coinsEarned' => $coinsEarned,
            'baseCoins' => $breakdown['base'],
            'speedBonus' => $breakdown['speedBonus'],
            'coins' => (int) $user->coins,
        ];
    }

    /**
     * Finalize reward data for guest session player.
     */
    private function finalizeGuestWin(Difficulty $difficulty, GameMode $mode, int $timeMs): array
    {
        $breakdown = SkinCatalog::getRewardBreakdown($difficulty, $mode, $timeMs);

        return [
            'saved' => false,
            'timeMs' => $timeMs,
            'coinsEarned' => $breakdown['total'],
            'baseCoins' => $breakdown['base'],
            'speedBonus' => $breakdown['speedBonus'],
        ];
    }

    public function loss(Request $request, string $token): JsonResponse
    {
        if (! $user = $request->user()) {
            $request->session()->forget("minefield.games.{$token}");

            return response()->json(['saved' => false]);
        }

        $game = Game::where('token', $token)->where('user_id', $user->id)->firstOrFail();
        if ($game->status === 'playing') {
            $game->update(['status' => 'lost', 'finished_at' => now()]);
        }

        return response()->json(['saved' => true]);
    }

    public function leaderboard(Request $request): JsonResponse
    {
        $data = $request->validate([
            'mode' => ['required', 'exists:game_modes,code'],
            'difficulty' => ['required', 'exists:difficulties,code'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);
        $mode = GameMode::findByCodeCached($data['mode']) ?? abort(404, 'Không tìm thấy chế độ chơi.');
        $difficulty = Difficulty::findByCodeCached($data['difficulty']) ?? abort(404, 'Không tìm thấy độ khó.');

        $records = Record::query()
            ->join('users', 'users.id', '=', 'records.user_id')
            ->where('records.mode_id', $mode->id)
            ->where('records.difficulty_id', $difficulty->id)
            ->orderBy('records.best_time_ms')
            ->orderBy('records.achieved_at')
            ->limit($data['limit'] ?? 10)
            ->get([
                'users.username', 'users.display_name', 'records.best_time_ms', 'records.achieved_at',
            ]);

        return response()->json($records->values()->map(fn ($record, $index): array => [
            'rank' => $index + 1,
            'username' => $record->username,
            'displayName' => $record->display_name,
            'timeMs' => $record->best_time_ms,
            'at' => Carbon::parse($record->achieved_at)->getTimestampMs(),
        ]));
    }

    public function bestTime(Request $request): JsonResponse
    {
        $data = $request->validate([
            'mode' => ['required', 'exists:game_modes,code'],
            'difficulty' => ['required', 'exists:difficulties,code'],
        ]);
        $mode = GameMode::findByCodeCached($data['mode']) ?? abort(404, 'Không tìm thấy chế độ chơi.');
        $difficulty = Difficulty::findByCodeCached($data['difficulty']) ?? abort(404, 'Không tìm thấy độ khó.');

        $time = Record::query()
            ->where('mode_id', $mode->id)
            ->where('difficulty_id', $difficulty->id)
            ->min('best_time_ms');

        return response()->json(['timeMs' => $time]);
    }

    private function verifyGamePayload(string $mode, string $difficulty, array $data): void
    {
        if ($mode !== $data['mode'] || $difficulty !== $data['difficulty']) {
            throw ValidationException::withMessages(['token' => ['Thiết lập trò chơi không khớp với phiên này.']]);
        }
    }

    private function verifyTime(int $reportedMs, int $startedAtMs): void
    {
        $elapsedMs = max(0, now()->getTimestampMs() - $startedAtMs);
        if ($reportedMs < self::MIN_PLAUSIBLE_TIME_MS || $reportedMs + self::TIME_TOLERANCE_MS < $elapsedMs) {
            throw ValidationException::withMessages(['timeMs' => ['Thời gian bị từ chối bởi hệ thống kiểm tra máy chủ.']]);
        }
    }
}
