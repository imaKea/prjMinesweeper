<?php

namespace App\Services;

use App\Models\Difficulty;
use App\Models\GameMode;

class SkinCatalog
{
    public const BOARDS = [
        'classic' => [
            'id' => 'classic',
            'type' => 'board',
            'name' => 'Cổ Điển Trầm',
            'description' => 'Bàn cờ đá phiến tối màu với viền hổ phách sắc nét. Bản gốc vượt thời gian.',
            'price' => 0,
            'accent' => '#e4a63b',
            'palette' => ['#141c25', '#2a3541', '#344252', '#e4a63b'],
        ],
        'matrix' => [
            'id' => 'matrix',
            'type' => 'board',
            'name' => 'Ma Trận Số',
            'description' => 'Màn hình CRT hacker với các ô xanh phát quang phosphor và tia quét.',
            'price' => 100,
            'accent' => '#10b981',
            'palette' => ['#05130b', '#0a2314', '#10b981', '#34d399'],
        ],
        'synthwave' => [
            'id' => 'synthwave',
            'type' => 'board',
            'name' => 'Neon Thập Niên 80',
            'description' => 'Bảng màu retrowave sôi động kết hợp giữa hồng neon, xanh ngọc và tím đậm.',
            'price' => 180,
            'accent' => '#f43f5e',
            'palette' => ['#0f0d1b', '#1e1837', '#f43f5e', '#38bdf8'],
        ],
        'wood' => [
            'id' => 'wood',
            'type' => 'board',
            'name' => 'Gỗ Mộc Cổ Điển',
            'description' => 'Gỗ gụ và sồi chạm khắc ấm áp với các đường viền vát ánh kim vàng.',
            'price' => 260,
            'accent' => '#d97706',
            'palette' => ['#1c130d', '#3d2516', '#5e3820', '#f59e0b'],
        ],
        'amethyst' => [
            'id' => 'amethyst',
            'type' => 'board',
            'name' => 'Thạch Anh Tím',
            'description' => 'Hang động pha lê lấp lánh với những viên đá quý tím hoàng gia.',
            'price' => 360,
            'accent' => '#a855f7',
            'palette' => ['#120a1c', '#27123d', '#4c1d95', '#c084fc'],
        ],
        'magma' => [
            'id' => 'magma',
            'type' => 'board',
            'name' => 'Nham Thạch Núi Lửa',
            'description' => 'Đá hắc diệu thạch rực cháy với các vết nứt dung nham nóng đỏ.',
            'price' => 500,
            'accent' => '#ef4444',
            'palette' => ['#140806', '#2b100a', '#7f1d1d', '#f97316'],
        ],
        'royal' => [
            'id' => 'royal',
            'type' => 'board',
            'name' => 'Hoàng Gia Vàng Ròng',
            'description' => 'Bọc kim loại hoàng gia với viền vàng 24K sang trọng và quý phái.',
            'price' => 750,
            'accent' => '#eab308',
            'palette' => ['#17140b', '#302812', '#78350f', '#facc15'],
        ],
    ];

    public const FLAGS = [
        'classic' => [
            'id' => 'classic',
            'type' => 'flag',
            'name' => 'Cờ Hổ Phách',
            'description' => 'Cờ tam giác màu hổ phách độ tương phản cao tiêu chuẩn.',
            'price' => 0,
            'accent' => '#e4a63b',
        ],
        'pirate' => [
            'id' => 'pirate',
            'type' => 'flag',
            'name' => 'Cờ Hải Tặc',
            'description' => 'Lá cờ đen đầu lâu xương chéo đáng sợ của cướp biển.',
            'price' => 80,
            'accent' => '#e2e8f0',
        ],
        'hazard' => [
            'id' => 'hazard',
            'type' => 'flag',
            'name' => 'Biển Cảnh Báo',
            'description' => 'Cọc tiêu cảnh báo công nghiệp với biểu tượng nguy hiểm màu vàng đen.',
            'price' => 140,
            'accent' => '#eab308',
        ],
        'sapphire' => [
            'id' => 'sapphire',
            'type' => 'flag',
            'name' => 'Cờ Lam Hoàng Tộc',
            'description' => 'Cờ hiệu màu lam thêu chỉ vàng quý tộc với mũi giáo mạ vàng.',
            'price' => 200,
            'accent' => '#3b82f6',
        ],
        'radar' => [
            'id' => 'radar',
            'type' => 'flag',
            'name' => 'Tâm Ngắm Lazer',
            'description' => 'Tâm nhắm quang học công nghệ cao khóa chặt tọa độ quả mìn.',
            'price' => 280,
            'accent' => '#06b6d4',
        ],
        'star' => [
            'id' => 'star',
            'type' => 'flag',
            'name' => 'Ngôi Sao Vàng',
            'description' => 'Ngôi sao 5 cánh lấp lánh đánh dấu vị trí quan trọng.',
            'price' => 400,
            'accent' => '#f59e0b',
        ],
        'skull' => [
            'id' => 'skull',
            'type' => 'flag',
            'name' => 'Đầu Lâu Đỏ',
            'description' => 'Đầu lâu neon đỏ rực cảnh báo vùng nguy hiểm chết người.',
            'price' => 550,
            'accent' => '#f43f5e',
        ],
    ];

    public static function getBoards(): array
    {
        return array_values(self::BOARDS);
    }

    public static function getFlags(): array
    {
        return array_values(self::FLAGS);
    }

    public static function getSkin(string $type, string $id): ?array
    {
        if ($type === 'board') {
            return self::BOARDS[$id] ?? null;
        }

        if ($type === 'flag') {
            return self::FLAGS[$id] ?? null;
        }

        return null;
    }

    /**
     * Calculate speed bonus coins for fast completion:
     * - Under 30s (< 30,000ms): +100 xu
     * - Under 60s (< 60,000ms): +50 xu
     * - Under 100s (< 100,000ms): +25 xu
     * - 100s or more (>= 100,000ms): 0 xu
     */
    public static function calculateSpeedBonus(?int $timeMs): int
    {
        if ($timeMs === null || $timeMs < 500) {
            return 0;
        }

        // Over 100 seconds receives no speed bonus (0 xu)
        if ($timeMs >= 100_000) {
            return 0;
        }

        if ($timeMs < 30_000) {
            return 100;
        }

        if ($timeMs < 60_000) {
            return 50;
        }

        return 25;
    }

    /**
     * Get reward breakdown including base coins and speed bonus.
     */
    public static function getRewardBreakdown(Difficulty $difficulty, ?GameMode $mode = null, ?int $timeMs = null): array
    {
        $baseCoins = match ($difficulty->code) {
            'easy' => 30,
            'medium' => 75,
            'hard' => 180,
            default => max(15, (int) round($difficulty->mine_count * 3.5)),
        };

        // Non-classic modes give 20% difficulty bonus
        if ($mode && $mode->code !== 'classic') {
            $baseCoins = (int) round($baseCoins * 1.2);
        }

        $speedBonus = self::calculateSpeedBonus($timeMs);

        return [
            'base' => $baseCoins,
            'speedBonus' => $speedBonus,
            'total' => $baseCoins + $speedBonus,
        ];
    }

    /**
     * Calculate virtual currency reward for winning a game.
     * The harder the difficulty, the higher the coin reward.
     * Includes speed bonus when timeMs is provided.
     */
    public static function calculateReward(Difficulty $difficulty, ?GameMode $mode = null, ?int $timeMs = null): int
    {
        return self::getRewardBreakdown($difficulty, $mode, $timeMs)['total'];
    }
}

