<?php

namespace Tests\Feature;

use App\Models\Difficulty;
use App\Models\User;
use Database\Seeders\MinefieldSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopAndCurrencyTest extends TestCase
{
    use RefreshDatabase;

    public function test_player_earns_more_coins_for_harder_difficulties_on_win(): void
    {
        $this->seed(MinefieldSeeder::class);

        $user = User::create([
            'username' => 'skin_tester',
            'display_name' => 'Skin Tester',
            'password' => 'secret123',
            'coins' => 0,
        ]);

        $this->actingAs($user);

        // 1. Easy game -> 30 base coins (played over 100s = no speed bonus)
        $tokenEasy = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])
            ->assertOk()
            ->json('token');

        $this->postJson("/api/games/{$tokenEasy}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 120000,
        ])->assertOk()->assertJson([
            'saved' => true,
            'coinsEarned' => 30,
            'coins' => 30,
        ]);

        $this->assertEquals(30, $user->fresh()->coins);

        // 2. Medium game -> 75 base coins (total 105)
        $tokenMed = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'medium'])
            ->assertOk()
            ->json('token');

        $this->postJson("/api/games/{$tokenMed}/win", [
            'mode' => 'classic',
            'difficulty' => 'medium',
            'timeMs' => 120000,
        ])->assertOk()->assertJson([
            'saved' => true,
            'coinsEarned' => 75,
            'coins' => 105,
        ]);

        $this->assertEquals(105, $user->fresh()->coins);

        // 3. Hard game -> 180 base coins (total 285)
        $tokenHard = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'hard'])
            ->assertOk()
            ->json('token');

        $this->postJson("/api/games/{$tokenHard}/win", [
            'mode' => 'classic',
            'difficulty' => 'hard',
            'timeMs' => 120000,
        ])->assertOk()->assertJson([
            'saved' => true,
            'coinsEarned' => 180,
            'coins' => 285,
        ]);

        $this->assertEquals(285, $user->fresh()->coins);
    }

    public function test_player_earns_speed_bonus_coins_for_fast_completion(): void
    {
        $this->seed(MinefieldSeeder::class);

        $user = User::create([
            'username' => 'speedster',
            'display_name' => 'Speed Runner',
            'password' => 'secret123',
            'coins' => 0,
        ]);

        $this->actingAs($user);

        // Under 30s (< 30000ms): Base 30 + 100 Speed Bonus = 130 coins
        $t1 = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])->json('token');
        $res1 = $this->postJson("/api/games/{$t1}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 15000,
        ])->assertOk()->json();

        $this->assertEquals(130, $res1['coinsEarned']);
        $this->assertEquals(100, $res1['speedBonus']);
        $this->assertEquals(130, $user->fresh()->coins);

        // Under 60s (30000ms - 59999ms): Base 30 + 50 Speed Bonus = 80 coins
        $t2 = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])->json('token');
        $res2 = $this->postJson("/api/games/{$t2}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 45000,
        ])->assertOk()->json();

        $this->assertEquals(80, $res2['coinsEarned']);
        $this->assertEquals(50, $res2['speedBonus']);
        $this->assertEquals(210, $user->fresh()->coins);

        // Under 100s (60000ms - 99999ms): Base 30 + 25 Speed Bonus = 55 coins
        $t3 = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])->json('token');
        $res3 = $this->postJson("/api/games/{$t3}/win", [
            'mode' => 'classic',
            'difficulty' => 'easy',
            'timeMs' => 75000,
        ])->assertOk()->json();

        $this->assertEquals(55, $res3['coinsEarned']);
        $this->assertEquals(25, $res3['speedBonus']);
        $this->assertEquals(265, $user->fresh()->coins);

        // 100s or more (>= 100,000ms): Base 180 (hard) + 0 Speed Bonus = 180 coins (no speed bonus)
        $t4 = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'hard'])->json('token');
        $res4 = $this->postJson("/api/games/{$t4}/win", [
            'mode' => 'classic',
            'difficulty' => 'hard',
            'timeMs' => 112000,
        ])->assertOk()->json();

        $this->assertEquals(180, $res4['coinsEarned']);
        $this->assertEquals(0, $res4['speedBonus']);
        $this->assertEquals(180, $res4['baseCoins']);
        $this->assertEquals(445, $user->fresh()->coins);
    }

    public function test_non_classic_mode_awards_twenty_percent_bonus_and_records_best_time(): void
    {
        $this->seed(MinefieldSeeder::class);

        $user = User::create([
            'username' => 'variant_winner',
            'display_name' => 'Variant Winner',
            'password' => 'secret123',
            'coins' => 0,
        ]);

        $this->actingAs($user);

        // Plus mode + Easy base (30) * 1.2 = 36 coins; 105s => 0 speed bonus
        $token = $this->postJson('/api/games', ['mode' => 'plus', 'difficulty' => 'easy'])->json('token');

        $res = $this->postJson("/api/games/{$token}/win", [
            'mode' => 'plus',
            'difficulty' => 'easy',
            'timeMs' => 105000,
        ])->assertOk()->json();

        $this->assertTrue($res['saved']);
        $this->assertEquals(36, $res['coinsEarned']);
        $this->assertEquals(0, $res['speedBonus']);
        $this->assertEquals(36, $res['baseCoins']);
        $this->assertEquals(36, $user->fresh()->coins);
        $this->assertDatabaseHas('records', [
            'user_id' => $user->id,
            'best_time_ms' => 105000,
        ]);
    }

    public function test_player_can_use_hint_with_100_coins(): void
    {
        $this->seed(MinefieldSeeder::class);

        $user = User::create([
            'username' => 'hint_tester',
            'display_name' => 'Hint Tester',
            'password' => 'secret123',
            'coins' => 250,
        ]);

        $this->actingAs($user);

        $token = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])->json('token');

        // Successful hint call deducts 100 coins in DB
        $res = $this->postJson("/api/games/{$token}/hint")
            ->assertOk()
            ->json();

        $this->assertTrue($res['success']);
        $this->assertEquals(100, $res['cost']);
        $this->assertEquals(150, $res['coins']);
        $this->assertEquals(150, $user->fresh()->coins);

        // Spend down coins to < 100
        $user->update(['coins' => 50]);

        $this->postJson("/api/games/{$token}/hint")
            ->assertStatus(422)
            ->assertJsonPath('success', false);

        $this->assertEquals(50, $user->fresh()->coins);
    }

    public function test_guest_can_use_hint_endpoint(): void
    {
        $this->seed(MinefieldSeeder::class);

        $this->postJson('/api/guest')->assertOk();
        $token = $this->postJson('/api/games', ['mode' => 'classic', 'difficulty' => 'easy'])->json('token');

        $res = $this->postJson("/api/games/{$token}/hint")
            ->assertOk()
            ->json();

        $this->assertTrue($res['success']);
        $this->assertEquals(100, $res['cost']);
    }

    public function test_shop_catalog_returns_items_and_player_status(): void
    {
        $this->seed(MinefieldSeeder::class);

        $user = User::create([
            'username' => 'shopper',
            'display_name' => 'Shopper',
            'password' => 'secret123',
            'coins' => 150,
        ]);

        $this->actingAs($user);

        $response = $this->getJson('/api/shop')
            ->assertOk()
            ->assertJsonStructure([
                'coins',
                'equipped' => ['board', 'flag'],
                'unlocked',
                'catalog' => [
                    'boards',
                    'flags',
                ],
            ]);

        $this->assertEquals(150, $response->json('coins'));
        $this->assertEquals('classic', $response->json('equipped.board'));
        $this->assertEquals('classic', $response->json('equipped.flag'));
    }

    public function test_player_cannot_buy_skin_with_insufficient_coins(): void
    {
        $this->seed(MinefieldSeeder::class);

        $user = User::create([
            'username' => 'poor_player',
            'display_name' => 'Poor Player',
            'password' => 'secret123',
            'coins' => 50, // Cyber Matrix costs 100
        ]);

        $this->actingAs($user);

        $this->postJson('/api/shop/buy', [
            'skin_id' => 'matrix',
            'type' => 'board',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['coins']);

        $this->assertEquals(50, $user->fresh()->coins);
    }

    public function test_player_can_buy_and_auto_equip_skin(): void
    {
        $this->seed(MinefieldSeeder::class);

        $user = User::create([
            'username' => 'wealthy_player',
            'display_name' => 'Wealthy Player',
            'password' => 'secret123',
            'coins' => 200,
        ]);

        $this->actingAs($user);

        // Buy Cyber Matrix board (100 coins)
        $this->postJson('/api/shop/buy', [
            'skin_id' => 'matrix',
            'type' => 'board',
        ])->assertOk()->assertJson([
            'success' => true,
            'coins' => 100,
            'equipped' => [
                'board' => 'matrix',
                'flag' => 'classic',
            ],
        ]);

        $this->assertEquals(100, $user->fresh()->coins);
        $this->assertEquals('matrix', $user->fresh()->equipped_board_skin);
        $this->assertTrue($user->fresh()->hasSkin('matrix'));

        // Cannot buy it again
        $this->postJson('/api/shop/buy', [
            'skin_id' => 'matrix',
            'type' => 'board',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['skin_id']);
    }

    public function test_player_can_equip_owned_skin(): void
    {
        $this->seed(MinefieldSeeder::class);

        $user = User::create([
            'username' => 'fashion_player',
            'display_name' => 'Fashion Player',
            'password' => 'secret123',
            'coins' => 500,
        ]);

        $this->actingAs($user);

        // Buy pirate flag (80 coins)
        $this->postJson('/api/shop/buy', [
            'skin_id' => 'pirate',
            'type' => 'flag',
        ])->assertOk();

        // Switch back to classic flag
        $this->postJson('/api/shop/equip', [
            'skin_id' => 'classic',
            'type' => 'flag',
        ])->assertOk()->assertJson([
            'equipped' => ['flag' => 'classic'],
        ]);
        $this->assertEquals('classic', $user->fresh()->equipped_flag_skin);

        // Switch back to pirate flag
        $this->postJson('/api/shop/equip', [
            'skin_id' => 'pirate',
            'type' => 'flag',
        ])->assertOk()->assertJson([
            'equipped' => ['flag' => 'pirate'],
        ]);
        $this->assertEquals('pirate', $user->fresh()->equipped_flag_skin);

        // Attempt to equip an unowned skin
        $this->postJson('/api/shop/equip', [
            'skin_id' => 'skull',
            'type' => 'flag',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['skin_id']);
    }

    public function test_shop_page_renders_with_assets(): void
    {
        $this->seed(MinefieldSeeder::class);
        $this->get('/shop')
            ->assertOk()
            ->assertSee('minefield/js/shop.js')
            ->assertSee('Cửa hàng trang phục');
    }
}

