<?php

use App\Http\Controllers\MinefieldAuthController;
use App\Http\Controllers\MinefieldAdminController;
use App\Http\Controllers\MinefieldGameController;
use App\Http\Controllers\MinefieldShopController;
use App\Http\Middleware\EnsureActiveGame;
use Illuminate\Support\Facades\Route;

Route::view('/', 'minefield.login')->name('login');
Route::view('/admin/login', 'minefield.admin-login')->name('admin.login');
Route::view('/modes', 'minefield.modes')->name('minefield.modes');
Route::view('/game', 'minefield.game')->name('minefield.game');
Route::view('/shop', 'minefield.shop')->name('minefield.shop');
Route::middleware('auth')->group(function (): void {
    Route::get('/admin', [MinefieldAdminController::class, 'index'])->name('admin');
    Route::post('/admin/users', [MinefieldAdminController::class, 'storeUser'])->name('admin.users.store');
    Route::put('/admin/users/{user}', [MinefieldAdminController::class, 'updateUser'])->name('admin.users.update');
    Route::delete('/admin/users/{user}', [MinefieldAdminController::class, 'deleteUser'])->name('admin.users.delete');
    Route::post('/admin/users/{user}/lock', [MinefieldAdminController::class, 'toggleUserLock'])->name('admin.users.lock');
    Route::post('/admin/users/{user}/give-coins', [MinefieldAdminController::class, 'giveCoins'])->name('admin.users.coins');
    Route::post('/admin/users/{user}/infinite-coins', [MinefieldAdminController::class, 'giveCoins']);
    Route::post('/admin/give-coins', [MinefieldAdminController::class, 'giveCoins'])->name('admin.coins');
    Route::post('/admin/infinite-coins', [MinefieldAdminController::class, 'giveCoins']);
    Route::post('/admin/records', [MinefieldAdminController::class, 'storeRecord'])->name('admin.records.store');
    Route::put('/admin/records/{record}', [MinefieldAdminController::class, 'updateRecord'])->name('admin.records.update');
    Route::delete('/admin/records/{record}', [MinefieldAdminController::class, 'deleteRecord'])->name('admin.records.delete');
});

Route::prefix('api')->group(function (): void {
    Route::get('/session', [MinefieldAuthController::class, 'current']);
    Route::post('/signup', [MinefieldAuthController::class, 'signup'])->middleware('throttle:10,1');
    Route::post('/login', [MinefieldAuthController::class, 'login'])->middleware('throttle:10,1');
    Route::post('/admin/login', [MinefieldAuthController::class, 'adminLogin'])->middleware('throttle:10,1');
    Route::post('/guest', [MinefieldAuthController::class, 'guest']);
    Route::post('/logout', [MinefieldAuthController::class, 'logout']);
    Route::post('/games', [MinefieldGameController::class, 'start']);
    Route::post('/games/{token}/hint', [MinefieldGameController::class, 'hint'])->middleware(EnsureActiveGame::class);
    Route::post('/games/{token}/win', [MinefieldGameController::class, 'win']);
    Route::post('/games/{token}/loss', [MinefieldGameController::class, 'loss']);
    Route::get('/leaderboard', [MinefieldGameController::class, 'leaderboard']);
    Route::get('/best-time', [MinefieldGameController::class, 'bestTime']);
    Route::get('/shop', [MinefieldShopController::class, 'catalog']);
    Route::post('/shop/buy', [MinefieldShopController::class, 'buy']);
    Route::post('/shop/equip', [MinefieldShopController::class, 'equip']);
    Route::post('/admin/give-coins', [MinefieldAdminController::class, 'giveCoins']);
    Route::post('/admin/infinite-coins', [MinefieldAdminController::class, 'giveCoins']);
    Route::post('/admin/users/{user}/give-coins', [MinefieldAdminController::class, 'giveCoins']);
    Route::post('/admin/users/{user}/infinite-coins', [MinefieldAdminController::class, 'giveCoins']);
});
