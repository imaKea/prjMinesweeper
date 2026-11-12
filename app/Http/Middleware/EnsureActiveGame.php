<?php

namespace App\Http\Middleware;

use App\Models\Game;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveGame
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->route('token');
        if (! $token) {
            return response()->json(['message' => 'Mã phiên chơi không hợp lệ.'], 400);
        }

        if ($user = $request->user()) {
            $game = Game::where('token', $token)->where('user_id', $user->id)->first();
            if (! $game) {
                return response()->json(['message' => 'Không tìm thấy phiên chơi.'], 404);
            }
            $request->attributes->set('game', $game);
        } else {
            $sessionGame = $request->session()->get("minefield.games.{$token}");
            if (! $sessionGame) {
                return response()->json(['message' => 'Không tìm thấy phiên chơi của khách.'], 404);
            }
            $request->attributes->set('session_game', $sessionGame);
        }

        return $next($request);
    }
}
