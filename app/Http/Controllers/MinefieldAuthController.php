<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class MinefieldAuthController extends Controller
{
    public function current(Request $request): JsonResponse
    {
        if ($user = $request->user()) {
            return response()->json($this->userPayload($user));
        }

        return response()->json($request->session()->get('minefield.guest')
            ? ['username' => null, 'displayName' => 'Khách', 'role' => 'guest', 'guest' => true, 'coins' => 0, 'equippedBoardSkin' => 'classic', 'equippedFlagSkin' => 'classic']
            : null);
    }

    public function signup(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username' => ['required', 'regex:/^[A-Za-z0-9_]{3,20}$/', 'unique:users,username'],
            'displayName' => ['nullable', 'string', 'max:24'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = User::create([
            'username' => $data['username'],
            'display_name' => trim($data['displayName'] ?? '') ?: $data['username'],
            'password' => Hash::make($data['password']),
        ]);

        $request->session()->forget('minefield.guest');
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json($this->userPayload($user), 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt(['username' => trim($data['username']), 'password' => $data['password']])) {
            throw ValidationException::withMessages(['username' => ['Tên đăng nhập hoặc mật khẩu không chính xác.']]);
        }

        $request->session()->forget('minefield.guest');
        $request->session()->regenerate();
        $user = $request->user();

        if ($user->role === 'admin') {
            Auth::logout();
            throw ValidationException::withMessages(['username' => ['Tên đăng nhập hoặc mật khẩu không chính xác.']]);
        }

        if ($user->is_locked) {
            Auth::logout();
            throw ValidationException::withMessages(['username' => ['Tài khoản này đã bị khóa.']]);
        }

        return response()->json($this->userPayload($user));
    }

    public function adminLogin(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt(['username' => trim($data['username']), 'password' => $data['password']])) {
            throw ValidationException::withMessages(['username' => ['Tên đăng nhập hoặc mật khẩu quản trị không chính xác.']]);
        }

        $user = $request->user();
        if ($user->role !== 'admin' || $user->is_locked) {
            Auth::logout();
            throw ValidationException::withMessages(['username' => ['Yêu cầu quyền quản trị viên.']]);
        }

        $request->session()->forget('minefield.guest');
        $request->session()->regenerate();

        return response()->json($this->userPayload($user));
    }

    public function guest(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->regenerate();
        $request->session()->put('minefield.guest', true);

        return response()->json(['username' => null, 'displayName' => 'Khách', 'role' => 'guest', 'guest' => true, 'coins' => 0, 'equippedBoardSkin' => 'classic', 'equippedFlagSkin' => 'classic']);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['loggedOut' => true]);
    }

    private function userPayload(User $user): array
    {
        return [
            'username' => $user->username,
            'displayName' => $user->display_name,
            'role' => $user->role,
            'guest' => false,
            'coins' => (int) $user->coins,
            'equippedBoardSkin' => $user->equipped_board_skin ?: 'classic',
            'equippedFlagSkin' => $user->equipped_flag_skin ?: 'classic',
        ];
    }
}