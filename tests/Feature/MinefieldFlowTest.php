<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\MinefieldSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class MinefieldFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_minefield_pages_render_with_their_frontend_assets(): void
    {
        $this->seed(MinefieldSeeder::class);

        $this->get('/')->assertOk()->assertSee('minefield/js/login.js');
        $this->get('/modes')->assertOk()->assertSee('minefield/js/modes.js');
        $this->get('/game')->assertOk()->assertSee('minefield/js/game.js');
    }

    public function test_pages_explain_when_game_catalogs_have_not_been_seeded(): void
    {
        $this->get('/modes')
            ->assertOk()
            ->assertSee('Game options are unavailable. Run the Minefield database seeders and reload.');
    }

    public function test_game_pages_render_mode_and_difficulty_options_from_the_database(): void
    {
        $this->seed(MinefieldSeeder::class);
        DB::table('game_modes')->insert([
            'code' => 'test-mode',
            'name' => 'Test Mode',
            'description' => 'A database-defined mode',
            'neighbor_offsets' => json_encode([[0, 1]]),
        ]);
        DB::table('difficulties')->insert([
            'code' => 'test-size',
            'name' => 'Test Size',
            'board_rows' => 3,
            'board_cols' => 5,
            'mine_count' => 2,
        ]);

        $this->get('/modes')
            ->assertOk()
            ->assertSee('"id":"test-mode"', false)
            ->assertSee('"offsets":[[0,1]]', false)
            ->assertSee('"rows":3,"cols":5,"mines":2', false);
    }

    public function test_registered_player_can_save_a_win_to_the_leaderboard(): void
    {
        $this->seed(MinefieldSeeder::class);

        $this->postJson('/api/signup', [
            'username' => 'field_player',
            'displayName' => 'Field Player',
            'password' => 'secret123',
        ])->assertCreated()->assertJsonPath('username', 'field_player');

        $token = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])
            ->assertOk()
            ->json('token');

        $this->postJson("/api/games/{$token}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 15000,
        ])->assertOk()->assertJson(['saved' => true, 'isBest' => true, 'rank' => 1]);

        $this->assertDatabaseHas('games', ['token' => $token, 'status' => 'won', 'time_ms' => 15000]);
        $this->assertDatabaseHas('records', ['best_time_ms' => 15000]);
        $this->getJson('/api/leaderboard?mode=classic&difficulty=easy')
            ->assertOk()
            ->assertJsonPath('0.username', 'field_player')
            ->assertJsonPath('0.timeMs', 15000);
    }

    public function test_equal_time_record_rank_uses_milliseconds_within_the_same_second(): void
    {
        $this->seed(MinefieldSeeder::class);
        $firstPlayer = User::factory()->create();
        $secondPlayer = User::factory()->create();
        $modeId = DB::table('game_modes')->where('code', 'classic')->value('id');
        $difficultyId = DB::table('difficulties')->where('code', 'easy')->value('id');

        DB::table('records')->insert([
            'user_id' => $firstPlayer->id,
            'mode_id' => $modeId,
            'difficulty_id' => $difficultyId,
            'game_id' => null,
            'best_time_ms' => 20000,
            'achieved_at' => '2026-10-28 10:00:00.200',
        ]);

        Carbon::setTestNow(Carbon::parse('2026-10-28 10:00:00.700'));

        try {
            $token = $this->actingAs($secondPlayer)
                ->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])
                ->assertOk()
                ->json('token');

            $this->postJson("/api/games/{$token}/win", [
                'mode' => 'classic',
                'difficulty' => 'easy',
                'timeMs' => 20000,
            ])->assertOk()->assertJson(['saved' => true, 'isBest' => true, 'rank' => 2]);
        } finally {
            Carbon::setTestNow();
        }
    }

    public function test_guest_can_play_but_does_not_create_a_persisted_record(): void
    {
        $this->seed(MinefieldSeeder::class);
        $this->postJson('/api/guest')->assertOk()->assertJsonPath('guest', true);

        $token = $this->postJson('/api/games', ['mode' => 'plus', 'difficulty' => 'medium'])
            ->assertOk()
            ->json('token');

        $this->postJson("/api/games/{$token}/win", [
            'mode' => 'plus',
            'difficulty' => 'medium',
            'timeMs' => 15000,
        ])->assertOk()->assertJson(['saved' => false]);

        $this->assertDatabaseCount('games', 0);
        $this->assertDatabaseCount('records', 0);
    }

    public function test_only_admins_can_manage_the_admin_page(): void
    {
        $this->seed(MinefieldSeeder::class);
        $this->get('/admin')->assertRedirect('/');

        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        $player = User::factory()->create();
        $modeId = DB::table('game_modes')->where('code', 'classic')->value('id');
        $difficultyId = DB::table('difficulties')->where('code', 'easy')->value('id');
        Game::create([
            'token' => '00000000-0000-4000-8000-000000000001',
            'user_id' => $player->id,
            'mode_id' => $modeId,
            'difficulty_id' => $difficultyId,
            'status' => 'won',
            'started_at' => Carbon::parse('2026-10-26 12:00:00.123'),
            'finished_at' => Carbon::parse('2026-10-26 12:00:10.456'),
            'time_ms' => 10333,
        ]);
        Game::create([
            'token' => '00000000-0000-4000-8000-000000000002',
            'user_id' => $player->id,
            'mode_id' => $modeId,
            'difficulty_id' => $difficultyId,
            'status' => 'lost',
            'started_at' => Carbon::parse('2026-10-26 13:00:00.123'),
            'finished_at' => Carbon::parse('2026-10-26 13:00:10.456'),
        ]);

        $this->actingAs($admin)
            ->get('/admin')
            ->assertOk()
            ->assertSee($player->username)
            ->assertSee('Leaderboard records')
            ->assertSee('Game statistics by mode')
            ->assertSee('1 wins / 1 losses · 50% win rate');

        $this->actingAs($admin)
            ->post('/admin/users/'.$player->id.'/lock')
            ->assertRedirect();
        $this->assertDatabaseHas('users', ['id' => $player->id, 'is_locked' => true]);

        $this->actingAs($player)->get('/admin')->assertForbidden();
    }

    public function test_existing_admin_can_sign_in_from_the_admin_login_page(): void
    {
        $admin = User::factory()->create(['username' => 'Admin']);
        $admin->forceFill(['role' => 'admin'])->save();

        $this->get('/admin/login')->assertOk()->assertSee('admin-login.js');
        $this->postJson('/api/admin/login', [
            'username' => 'Admin',
            'password' => 'password',
        ])->assertOk()->assertJsonPath('role', 'admin');

        $this->get('/admin')->assertOk();
    }

    public function test_regular_user_cannot_sign_in_from_admin_login(): void
    {
        $user = User::factory()->create();

        $this->postJson('/api/admin/login', [
            'username' => $user->username,
            'password' => 'password',
        ])->assertUnprocessable();

        $this->assertGuest();
    }

    public function test_admin_cannot_sign_in_from_regular_login(): void
    {
        $admin = User::factory()->create(['username' => 'AdminUser']);
        $admin->forceFill(['role' => 'admin'])->save();

        $this->postJson('/api/login', [
            'username' => 'AdminUser',
            'password' => 'password',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['username' => 'Tên đăng nhập hoặc mật khẩu không chính xác.']);

        $this->assertGuest();
    }

    public function test_login_is_rate_limited_after_ten_failed_attempts(): void
    {
        $user = User::factory()->create();

        for ($attempt = 0; $attempt < 10; $attempt++) {
            $this->postJson('/api/login', [
                'username' => $user->username,
                'password' => 'wrong-password',
            ])->assertUnprocessable();
        }

        $this->postJson('/api/login', [
            'username' => $user->username,
            'password' => 'wrong-password',
        ])->assertTooManyRequests();
    }

    public function test_admin_can_create_edit_and_delete_accounts_and_passwords(): void
    {
        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();

        $this->actingAs($admin)
            ->post('/admin/users', [
                'username' => 'new_player',
                'display_name' => 'New Player',
                'password' => 'initial123',
                'role' => 'user',
            ])
            ->assertRedirect();

        $player = User::where('username', 'new_player')->firstOrFail();
        $this->assertTrue(Hash::check('initial123', $player->password));

        $this->put('/admin/users/'.$player->id, [
            'username' => 'renamed_player',
            'display_name' => 'Renamed Player',
            'password' => 'updated123',
            'role' => 'user',
        ])->assertRedirect();

        $player->refresh();
        $this->assertSame('Renamed Player', $player->display_name);
        $this->assertTrue(Hash::check('updated123', $player->password));

        $this->delete('/admin/users/'.$player->id)->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $player->id]);
    }

    public function test_admin_can_create_edit_and_delete_leaderboard_records(): void
    {
        $this->seed(MinefieldSeeder::class);
        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        $player = User::factory()->create();
        $modeId = DB::table('game_modes')->where('code', 'classic')->value('id');
        $difficultyId = DB::table('difficulties')->where('code', 'easy')->value('id');

        $this->actingAs($admin)
            ->post('/admin/records', [
                'user_id' => $player->id,
                'mode_id' => $modeId,
                'difficulty_id' => $difficultyId,
                'best_time_ms' => 12500,
                'achieved_at' => '2026-10-26T12:00',
            ])
            ->assertRedirect();

        $recordId = DB::table('records')->where('user_id', $player->id)->value('id');
        $this->assertDatabaseHas('records', ['id' => $recordId, 'best_time_ms' => 12500]);

        $this->put('/admin/records/'.$recordId, [
            'best_time_ms' => 11000,
            'achieved_at' => '2026-10-26T13:00',
        ])->assertRedirect();
        $this->assertDatabaseHas('records', ['id' => $recordId, 'best_time_ms' => 11000, 'game_id' => null]);

        $this->delete('/admin/records/'.$recordId)->assertRedirect();
        $this->assertDatabaseMissing('records', ['id' => $recordId]);
    }

    public function test_locked_account_is_logged_out_and_cannot_submit_a_game_result(): void
    {
        $this->seed(MinefieldSeeder::class);
        $player = User::factory()->create();
        $this->actingAs($player);

        $token = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])
            ->assertOk()
            ->json('token');

        $player->forceFill(['is_locked' => true])->save();

        $this->postJson("/api/games/{$token}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 10000,
        ])->assertStatus(423)->assertJsonPath('message', 'This account is locked.');

        $this->assertGuest();
        $this->assertDatabaseHas('games', ['token' => $token, 'status' => 'playing']);
        $this->assertDatabaseCount('records', 0);
    }

    public function test_game_timestamps_keep_millisecond_precision(): void
    {
        $this->seed(MinefieldSeeder::class);
        $player = User::factory()->create();
        $this->actingAs($player);
        Carbon::setTestNow(Carbon::parse('2026-10-27 12:00:00.123'));

        try {
            $token = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])
                ->assertOk()
                ->json('token');

            $storedTimestamp = DB::table('games')->where('token', $token)->value('started_at');
            $this->assertStringEndsWith('.123', $storedTimestamp);
            $this->assertSame('123', Game::where('token', $token)->firstOrFail()->started_at->format('v'));
        } finally {
            Carbon::setTestNow();
        }
    }

    public function test_admin_seeder_uses_a_configured_strong_password(): void
    {
        config([
            'minefield.admin.username' => 'Seeded_Admin',
            'minefield.admin.password' => 'a-strong-admin-password',
        ]);

        $this->seed(AdminUserSeeder::class);

        $admin = User::where('username', 'Seeded_Admin')->firstOrFail();
        $this->assertSame('admin', $admin->role);
        $this->assertTrue(Hash::check('a-strong-admin-password', $admin->password));
        $this->assertNotSame('a-strong-admin-password', $admin->password);
    }

    public function test_admin_can_add_custom_amount_of_coins_and_toggle_lock_via_json(): void
    {
        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        $player = User::factory()->create();
        $player->forceFill(['coins' => 100, 'is_locked' => false])->save();

        // 1. Add custom amount (e.g. 5000) via new give-coins endpoint
        $response = $this->actingAs($admin)
            ->postJson('/admin/users/'.$player->id.'/give-coins', ['amount' => 5000]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'userId' => $player->id,
                'coins' => 5100,
            ]);

        $player->refresh();
        $this->assertSame(5100, $player->coins);

        // 1b. Backward compatible check for infinite-coins alias
        $this->actingAs($admin)
            ->postJson('/admin/users/'.$player->id.'/infinite-coins', ['amount' => 1000])
            ->assertOk();
        $player->refresh();
        $this->assertSame(6100, $player->coins);

        // 2. Add default fallback (sets 999,999) when amount is omitted
        $this->actingAs($admin)
            ->post('/admin/users/'.$player->id.'/give-coins')
            ->assertRedirect();

        $player->refresh();
        $this->assertSame(999999, $player->coins);

        // 3. Toggle lock via AJAX/JSON
        $lockRes = $this->actingAs($admin)
            ->postJson('/admin/users/'.$player->id.'/lock');

        $lockRes->assertOk()
            ->assertJson([
                'success' => true,
                'is_locked' => true,
            ]);

        $player->refresh();
        $this->assertTrue($player->is_locked);
    }

    public function test_player_can_record_game_loss_without_creating_leaderboard_record(): void
    {
        $this->seed(MinefieldSeeder::class);
        $player = User::factory()->create();
        $this->actingAs($player);

        $startRes = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy']);
        $startRes->assertOk();
        $token = $startRes->json('token');

        $this->postJson("/api/games/{$token}/loss")
            ->assertOk()
            ->assertJson(['saved' => true]);

        $this->assertDatabaseHas('games', ['token' => $token, 'status' => 'lost']);
        $this->assertDatabaseCount('records', 0);
    }

    public function test_win_endpoint_rejects_tampered_time_outside_server_tolerance(): void
    {
        $this->seed(MinefieldSeeder::class);
        $player = User::factory()->create();
        $this->actingAs($player);

        Carbon::setTestNow(Carbon::parse('2026-11-12 10:00:00.000'));
        try {
            $token = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])
                ->assertOk()
                ->json('token');

            Carbon::setTestNow(Carbon::parse('2026-11-12 10:00:10.000'));

            // Reported timeMs (1000ms) is 9000ms behind server elapsed (10000ms) > 2500ms tolerance
            $this->postJson("/api/games/{$token}/win", [
                'mode' => 'classic',
                'difficulty' => 'easy',
                'timeMs' => 1000,
            ])->assertUnprocessable()
                ->assertJsonValidationErrors(['timeMs']);

            $this->assertDatabaseHas('games', ['token' => $token, 'status' => 'playing']);
            $this->assertDatabaseCount('records', 0);
        } finally {
            Carbon::setTestNow();
        }
    }
}
