<?php

namespace App\Http\Controllers;

use App\Models\UserSkin;
use App\Services\SkinCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class MinefieldShopController extends Controller
{
    public function catalog(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            $coins = (int) $user->coins;
            $equipped = [
                'board' => $user->equipped_board_skin ?: 'classic',
                'flag' => $user->equipped_flag_skin ?: 'classic',
            ];
            $unlocked = $user->skins()->pluck('skin_id')->push('classic')->unique()->values()->all();
        } else {
            $coins = 0;
            $equipped = [
                'board' => 'classic',
                'flag' => 'classic',
            ];
            $unlocked = ['classic'];
        }

        return response()->json([
            'coins' => $coins,
            'equipped' => $equipped,
            'unlocked' => $unlocked,
            'catalog' => [
                'boards' => SkinCatalog::getBoards(),
                'flags' => SkinCatalog::getFlags(),
            ],
        ]);
    }

    public function buy(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user !== null, 401, 'Vui lòng đăng nhập để mua trang phục.');

        $data = $request->validate([
            'skin_id' => ['required', 'string', 'max:50'],
            'type' => ['required', Rule::in(['board', 'flag'])],
        ]);

        $skin = SkinCatalog::getSkin($data['type'], $data['skin_id']);
        if (! $skin) {
            throw ValidationException::withMessages(['skin_id' => ['Không tìm thấy trang phục trong cửa hàng.']]);
        }

        if ($skin['price'] <= 0 || $user->hasSkin($data['skin_id'])) {
            throw ValidationException::withMessages(['skin_id' => ['Bạn đã sở hữu trang phục này rồi.']]);
        }

        DB::transaction(function () use ($user, $data, $skin): void {
            $user->lockForUpdate();
            if ($user->coins < $skin['price']) {
                throw ValidationException::withMessages(['coins' => ['Không đủ xu để mua trang phục này. Hãy thắng thêm nhiều ván để kiếm xu!']]);
            }

            $user->decrement('coins', $skin['price']);

            UserSkin::firstOrCreate([
                'user_id' => $user->id,
                'skin_id' => $data['skin_id'],
                'skin_type' => $data['type'],
            ]);

            // Auto-equip upon purchase
            if ($data['type'] === 'board') {
                $user->equipped_board_skin = $data['skin_id'];
            } else {
                $user->equipped_flag_skin = $data['skin_id'];
            }
            $user->save();
        });

        $user->refresh();

        return response()->json([
            'success' => true,
            'coins' => (int) $user->coins,
            'equipped' => [
                'board' => $user->equipped_board_skin ?: 'classic',
                'flag' => $user->equipped_flag_skin ?: 'classic',
            ],
            'unlocked' => $user->skins()->pluck('skin_id')->push('classic')->unique()->values()->all(),
        ]);
    }

    public function equip(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user !== null, 401, 'Vui lòng đăng nhập để trang bị trang phục.');

        $data = $request->validate([
            'skin_id' => ['required', 'string', 'max:50'],
            'type' => ['required', Rule::in(['board', 'flag'])],
        ]);

        $skin = SkinCatalog::getSkin($data['type'], $data['skin_id']);
        if (! $skin) {
            throw ValidationException::withMessages(['skin_id' => ['Không tìm thấy trang phục trong cửa hàng.']]);
        }

        if (! $user->hasSkin($data['skin_id'])) {
            throw ValidationException::withMessages(['skin_id' => ['Bạn chưa sở hữu trang phục này.']]);
        }

        if ($data['type'] === 'board') {
            $user->equipped_board_skin = $data['skin_id'];
        } else {
            $user->equipped_flag_skin = $data['skin_id'];
        }
        $user->save();

        return response()->json([
            'success' => true,
            'equipped' => [
                'board' => $user->equipped_board_skin ?: 'classic',
                'flag' => $user->equipped_flag_skin ?: 'classic',
            ],
        ]);
    }
}

