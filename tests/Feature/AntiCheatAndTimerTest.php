<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\Record;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\MinefieldSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AntiCheatAndTimerTest extends TestCase
{
    use RefreshDatabase;

    public function test_win_rejects_zero_and_negative_and_implausibly_fast_time_ms(): void
    {
        $this->seed(MinefieldSeeder::class);
        $player = User::factory()->create(['coins' => 0]);
        $this->actingAs($player);

        $token = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])
            ->assertOk()
            ->json('token');

        foreach ([-500, 0, 1, 199] as $badTime) {
            $this->postJson("/api/games/{$token}/win", [
                'mode' => 'classic',
                'difficulty' => 'easy',
                'timeMs' => $badTime,
            ])->assertUnprocessable()
                ->assertJsonValidationErrors(['timeMs']);
        }

        $this->assertDatabaseHas('games', ['token' => $token, 'status' => 'playing']);
        $this->assertDatabaseCount('records', 0);
        $this->assertSame(0, $player->fresh()->coins);
    }

    public function test_win_enforces_exact_2500ms_server_tolerance_boundary(): void
    {
        $this->seed(MinefieldSeeder::class);
        $player = User::factory()->create(['coins' => 0]);
        $this->actingAs($player);

        Carbon::setTestNow(Carbon::parse('2026-11-12 12:00:00.000'));
        try {
            $token = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])
                ->assertOk()
                ->json('token');

            Carbon::setTestNow(Carbon::parse('2026-11-12 12:00:10.000'));

            // elapsed = 10000ms -> 7499 + 2500 = 9999 < 10000 => REJECT
            $this->postJson("/api/games/{$token}/win", [
                'mode' => 'classic',
                'difficulty' => 'easy',
                'timeMs' => 7499,
            ])->assertUnprocessable()
                ->assertJsonValidationErrors(['timeMs']);

            // elapsed = 10000ms -> 7500 + 2500 = 10000 >= 10000 => ACCEPT (boundary)
            $this->postJson("/api/games/{$token}/win", [
                'mode' => 'classic',
                'difficulty' => 'easy',
                'timeMs' => 7500,
            ])->assertOk()
                ->assertJson(['saved' => true, 'timeMs' => 7500]);
        } finally {
            Carbon::setTestNow();
        }
    }

    public function test_guest_win_also_rejects_tampered_timer(): void
    {
        $this->seed(MinefieldSeeder::class);
        $this->postJson('/api/guest')->assertOk();

        Carbon::setTestNow(Carbon::parse('2026-11-12 12:10:00.000'));
        try {
            $token = $this->postJson('/api/games', ['mode' => 'plus', 'difficulty' => 'medium'])
                ->assertOk()
                ->json('token');

            Carbon::setTestNow(Carbon::parse('2026-11-12 12:10:20.000'));

            // elapsed = 20000ms, client claims 5000ms => REJECT
            $this->postJson("/api/games/{$token}/win", [
                'mode' => 'plus',
                'difficulty' => 'medium',
                'timeMs' => 5000,
            ])->assertUnprocessable()
                ->assertJsonValidationErrors(['timeMs']);
        } finally {
            Carbon::setTestNow();
        }
    }

    public function test_player_cannot_replay_same_game_token_twice_for_win(): void
    {
        $this->seed(MinefieldSeeder::class);
        $player = User::factory()->create(['coins' => 0]);
        $this->actingAs($player);

        $token = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])
            ->assertOk()
            ->json('token');

        $this->postJson("/api/games/{$token}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 15000,
        ])->assertOk();

        $coinsAfterFirstWin = $player->fresh()->coins;
        $this->assertGreaterThan(0, $coinsAfterFirstWin);

        // Replay second win with identical token must return 409 Conflict
        $this->postJson("/api/games/{$token}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 15000,
        ])->assertStatus(409);

        $this->assertSame($coinsAfterFirstWin, $player->fresh()->coins);
        $this->assertDatabaseCount('records', 1);
    }

    public function test_guest_cannot_replay_same_game_token_twice_for_win(): void
    {
        $this->seed(MinefieldSeeder::class);
        $this->postJson('/api/guest')->assertOk();

        $token = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])
            ->assertOk()
            ->json('token');

        $this->postJson("/api/games/{$token}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 15000,
        ])->assertOk();

        // Session token has been pulled on first submit => second submit is 404
        $this->postJson("/api/games/{$token}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 15000,
        ])->assertNotFound();
    }

    public function test_player_cannot_submit_win_after_recording_loss_or_use_hint_after_finish(): void
    {
        $this->seed(MinefieldSeeder::class);
        $player = User::factory()->create(['coins' => 500]);
        $this->actingAs($player);

        $token = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])
            ->assertOk()
            ->json('token');

        $this->postJson("/api/games/{$token}/loss")->assertOk();

        $this->postJson("/api/games/{$token}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 12000,
        ])->assertStatus(409);

        $this->postJson("/api/games/{$token}/hint")->assertStatus(409);

        $this->assertDatabaseHas('games', ['token' => $token, 'status' => 'lost']);
        $this->assertDatabaseCount('records', 0);
        $this->assertSame(500, $player->fresh()->coins);
    }

    public function test_win_rejects_mismatched_mode_or_difficulty_payload(): void
    {
        $this->seed(MinefieldSeeder::class);
        $player = User::factory()->create(['coins' => 0]);
        $this->actingAs($player);

        // Started as classic/easy, tries to submit as corner/hard for higher coin reward
        $token = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])
            ->assertOk()
            ->json('token');

        $this->postJson("/api/games/{$token}/win", [
            'mode' => 'corner',
            'difficulty' => 'hard',
            'timeMs' => 15000,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['token']);

        $this->assertDatabaseHas('games', ['token' => $token, 'status' => 'playing']);
        $this->assertSame(0, $player->fresh()->coins);
    }

    public function test_user_cannot_hijack_another_users_game_token(): void
    {
        $this->seed(MinefieldSeeder::class);
        $owner = User::factory()->create(['coins' => 300]);
        $attacker = User::factory()->create(['coins' => 300]);

        $token = $this->actingAs($owner)
            ->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'medium'])
            ->assertOk()
            ->json('token');

        $this->actingAs($attacker)
            ->postJson("/api/games/{$token}/win", [
                'mode' => 'classic',
                'difficulty' => 'medium',
                'timeMs' => 12000,
            ])->assertNotFound();

        $this->actingAs($attacker)
            ->postJson("/api/games/{$token}/hint")
            ->assertNotFound();

        $this->actingAs($attacker)
            ->postJson("/api/games/{$token}/loss")
            ->assertNotFound();

        $this->assertDatabaseHas('games', ['token' => $token, 'status' => 'playing', 'user_id' => $owner->id]);
        $this->assertSame(300, $owner->fresh()->coins);
        $this->assertSame(300, $attacker->fresh()->coins);
    }

    public function test_slower_second_win_preserves_faster_personal_best_record(): void
    {
        $this->seed(MinefieldSeeder::class);
        $player = User::factory()->create(['coins' => 0]);
        $this->actingAs($player);

        $t1 = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])->json('token');
        $this->postJson("/api/games/{$t1}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 15000,
        ])->assertOk()->assertJson(['isBest' => true]);

        $t2 = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])->json('token');
        $this->postJson("/api/games/{$t2}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 25000,
        ])->assertOk()->assertJson(['isBest' => false, 'saved' => true]);

        $record = Record::where('user_id', $player->id)->firstOrFail();
        $this->assertSame(15000, $record->best_time_ms);
    }
}
