<?php

namespace App\Http\Controllers;

use App\Models\Difficulty;
use App\Models\Game;
use App\Models\GameMode;
use App\Models\Record;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class MinefieldAdminController extends Controller
{
    public function index(Request $request): View
    {
        $this->ensureAdmin($request);

        $records = Record::query()
            ->join('users', 'users.id', '=', 'records.user_id')
            ->join('game_modes', 'game_modes.id', '=', 'records.mode_id')
            ->join('difficulties', 'difficulties.id', '=', 'records.difficulty_id')
            ->orderByDesc('records.achieved_at')
            ->paginate(25, [
                'records.id as record_id',
                'users.username',
                'game_modes.name as mode_name',
                'difficulties.name as difficulty_name',
                'records.best_time_ms',
                'records.achieved_at',
            ], 'records_page');

        $gameStats = GameMode::query()
            ->leftJoin('games', 'games.mode_id', '=', 'game_modes.id')
            ->select('game_modes.id', 'game_modes.name')
            ->selectRaw("SUM(CASE WHEN games.status = 'won' THEN 1 ELSE 0 END) as wins")
            ->selectRaw("SUM(CASE WHEN games.status = 'lost' THEN 1 ELSE 0 END) as losses")
            ->groupBy('game_modes.id', 'game_modes.name')
            ->orderBy('game_modes.name')
            ->get()
            ->map(static function ($mode): array {
                $wins = (int) $mode->wins;
                $losses = (int) $mode->losses;
                $completed = $wins + $losses;

                return [
                    'name' => $mode->name,
                    'wins' => $wins,
                    'losses' => $losses,
                    'completed' => $completed,
                    'winRate' => $completed === 0 ? 0 : round($wins * 100 / $completed, 1),
                ];
            });
        $completedGames = (int) $gameStats->sum('completed');
        $wonGames = (int) $gameStats->sum('wins');

        return view('minefield.admin', [
            'users' => User::query()->orderBy('username')->paginate(25, ['*'], 'users_page'),
            'accountOptions' => User::query()->orderBy('username')->get(['id', 'username']),
            'records' => $records,
            'modes' => GameMode::query()->orderBy('name')->get(),
            'difficulties' => Difficulty::query()->orderBy('name')->get(),
            'userCount' => User::count(),
            'recordCount' => Record::count(),
            'gameStats' => $gameStats,
            'completedGames' => $completedGames,
            'overallWinRate' => $completedGames === 0 ? 0 : round($wonGames * 100 / $completedGames, 1),
        ]);
    }

    public function storeUser(Request $request): RedirectResponse
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'username' => ['required', 'regex:/^[A-Za-z0-9_]{3,20}$/', 'unique:users,username'],
            'display_name' => ['required', 'string', 'max:24'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', Rule::in(['user', 'admin'])],
        ]);

        $user = User::create([
            'username' => $data['username'],
            'display_name' => $data['display_name'],
            'password' => $data['password'],
        ]);
        $user->forceFill(['role' => $data['role']])->save();

        return back()->with('admin_success', "Đã tạo tài khoản {$user->username} thành công!");
    }

    public function updateUser(Request $request, User $user): RedirectResponse
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'username' => ['required', 'regex:/^[A-Za-z0-9_]{3,20}$/', Rule::unique('users', 'username')->ignore($user->id)],
            'display_name' => ['required', 'string', 'max:24'],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['required', Rule::in(['user', 'admin'])],
            'coins' => ['nullable', 'integer', 'min:0'],
        ]);

        $user->fill([
            'username' => $data['username'],
            'display_name' => $data['display_name'],
        ]);
        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }
        if (isset($data['coins'])) {
            $user->coins = (int) $data['coins'];
        }
        abort_if($request->user()->is($user) && $data['role'] !== 'admin', 422);
        $user->forceFill(['role' => $data['role']])->save();

        return back()->with('admin_success', "Đã cập nhật thông tin tài khoản {$user->username}!");
    }

    public function giveCoins(Request $request, ?User $user = null): RedirectResponse|JsonResponse
    {
        $this->ensureAdmin($request);
        $targetUser = $user ?? $request->user();

        $amount = $request->input('amount');
        if ($amount !== null && is_numeric($amount) && (int) $amount > 0) {
            $addCoins = (int) $amount;
            $targetUser->coins = min(2147483647, (int) $targetUser->coins + $addCoins);
            $message = 'Đã cộng +' . number_format($addCoins) . ' xu cho ' . $targetUser->username . '!';
        } else {
            $targetUser->coins = 999999;
            $message = 'Đã cấp 999,999 xu cho ' . $targetUser->username . '!';
        }
        $targetUser->save();

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'userId' => $targetUser->id,
                'username' => $targetUser->username,
                'coins' => (int) $targetUser->coins,
                'message' => $message,
            ]);
        }

        return back()->with('admin_success', $message);
    }

    public function infiniteCoins(Request $request, ?User $user = null): RedirectResponse|JsonResponse
    {
        return $this->giveCoins($request, $user);
    }

    public function deleteUser(Request $request, User $user): RedirectResponse
    {
        $this->ensureAdmin($request);
        abort_if($request->user()->is($user), 422);
        abort_if($user->role === 'admin' && User::where('role', 'admin')->count() <= 1, 422);

        $name = $user->username;
        $user->delete();

        return back()->with('admin_success', "Đã xóa tài khoản {$name}!");
    }

    public function toggleUserLock(Request $request, User $user): RedirectResponse|JsonResponse
    {
        $this->ensureAdmin($request);
        abort_if($user->role !== 'user' || $request->user()->is($user), 422);

        $user->forceFill(['is_locked' => ! $user->is_locked])->save();

        $message = $user->is_locked
            ? "Đã khóa tài khoản {$user->username}!"
            : "Đã mở khóa tài khoản {$user->username}!";

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'userId' => $user->id,
                'username' => $user->username,
                'is_locked' => (bool) $user->is_locked,
                'message' => $message,
            ]);
        }

        return back()->with('admin_success', $message);
    }

    public function deleteRecord(Request $request, Record $record): RedirectResponse
    {
        $this->ensureAdmin($request);
        $record->delete();

        return back()->with('admin_success', 'Đã xóa kỷ lục thành công!');
    }

    public function storeRecord(Request $request): RedirectResponse
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'mode_id' => ['required', 'exists:game_modes,id'],
            'difficulty_id' => ['required', 'exists:difficulties,id'],
            'best_time_ms' => ['required', 'integer', 'min:1', 'max:2147483647'],
            'achieved_at' => ['required', 'date'],
        ]);

        $alreadyExists = Record::where('user_id', $data['user_id'])
            ->where('mode_id', $data['mode_id'])
            ->where('difficulty_id', $data['difficulty_id'])
            ->exists();
        if ($alreadyExists) {
            return back()->withErrors(['user_id' => 'That player already has a record for this mode and difficulty.']);
        }

        Record::create([
            ...$data,
            'game_id' => null,
            'achieved_at' => Carbon::parse($data['achieved_at']),
        ]);

        return back()->with('admin_success', 'Đã thêm kỷ lục mới thành công!');
    }

    public function updateRecord(Request $request, Record $record): RedirectResponse
    {
        $this->ensureAdmin($request);
        $data = $request->validate([
            'best_time_ms' => ['required', 'integer', 'min:1', 'max:2147483647'],
            'achieved_at' => ['required', 'date'],
        ]);

        $record->update([
            'best_time_ms' => $data['best_time_ms'],
            'achieved_at' => Carbon::parse($data['achieved_at']),
            'game_id' => null,
        ]);

        return back()->with('admin_success', 'Đã lưu thay đổi kỷ lục!');
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === 'admin', 403);
    }
}
