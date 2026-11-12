<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccountIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is(
            '/',
            'api/signup',
            'api/login',
            'api/admin/login',
            'api/guest',
            'api/logout'
        )) {
            return $next($request);
        }

        if ($request->user()?->is_locked) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($request->expectsJson()) {
                return response()->json(['message' => 'This account is locked.'], 423);
            }

            return redirect('/')->withErrors(['username' => 'This account is locked.']);
        }

        return $next($request);
    }
}
