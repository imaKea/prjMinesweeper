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
        'glacier' => [
            'id' => 'glacier',
            'type' => 'board',
            'name' => 'Băng Hà Bắc Cực',
            'description' => 'Tinh thể băng giá ánh lam lạnh lẽo với độ tương phản cực rõ nét.',
            'price' => 140,
            'accent' => '#38bdf8',
            'palette' => ['#061420', '#12334d', '#1c4f73', '#38bdf8'],
        ],
        'sakura' => [
            'id' => 'sakura',
            'type' => 'board',
            'name' => 'Hoa Anh Đào Đêm',
            'description' => 'Sắc hồng phấn Kyoto dịu mắt trên nền gỗ tối thanh lịch.',
            'price' => 220,
            'accent' => '#f472b6',
            'palette' => ['#180b16', '#381830', '#5c244b', '#f472b6'],
        ],
        'ocean' => [
            'id' => 'ocean',
            'type' => 'board',
            'name' => 'Đại Dương Thẳm',
            'description' => 'Ánh san hô ngọc lam phát sáng giữa lòng biển sâu huyền bí.',
            'price' => 320,
            'accent' => '#2dd4bf',
            'palette' => ['#04131c', '#0b2d3f', '#0e4d64', '#2dd4bf'],
        ],
        'emerald' => [
            'id' => 'emerald',
            'type' => 'board',
            'name' => 'Ngọc Lục Bảo',
            'description' => 'Mặt bàn khảm ngọc lục bảo sang trọng kết hợp ánh vàng champagne.',
            'price' => 440,
            'accent' => '#34d399',
            'palette' => ['#04140e', '#0c3324', '#14533a', '#34d399'],
        ],
        'cyberpunk' => [
            'id' => 'cyberpunk',
            'type' => 'board',
            'name' => 'Cyberpunk 2099',
            'description' => 'Lưới giáp điện tử vàng chanh cao áp rực cháy phong cách tương lai.',
            'price' => 620,
            'accent' => '#facc15',
            'palette' => ['#111008', '#29250d', '#473e12', '#facc15'],
        ],
        'obsidian' => [
            'id' => 'obsidian',
            'type' => 'board',
            'name' => 'Hắc Tinh Vân',
            'description' => 'Đá vũ trụ đen tuyền điểm xuyết cực quang tím lam huyền ảo.',
            'price' => 900,
            'accent' => '#a78bfa',
            'palette' => ['#05060f', '#151933', '#2d2a6e', '#a78bfa'],
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
        'sakura' => [
            'id' => 'sakura',
            'type' => 'flag',
            'name' => 'Cánh Hoa Anh Đào',
            'description' => 'Đóa anh đào năm cánh hồng phấn đánh dấu mìn đầy tinh tế.',
            'price' => 120,
            'accent' => '#f472b6',
        ],
        'lightning' => [
            'id' => 'lightning',
            'type' => 'flag',
            'name' => 'Tia Sét Cao Áp',
            'description' => 'Tia chớp điện cao thế vàng rực khóa nhanh điểm nguy hiểm.',
            'price' => 180,
            'accent' => '#facc15',
        ],
        'shield' => [
            'id' => 'shield',
            'type' => 'flag',
            'name' => 'Khiên Hộ Vệ',
            'description' => 'Huy hiệu khiên chiến thuật ngọc lục bảo bảo vệ ô nghi ngờ.',
            'price' => 240,
            'accent' => '#34d399',
        ],
        'crystal' => [
            'id' => 'crystal',
            'type' => 'flag',
            'name' => 'Pha Lê Băng',
            'description' => 'Viên tinh thể kim cương xanh băng cắt gọt đa diện phát sáng.',
            'price' => 340,
            'accent' => '#38bdf8',
        ],
        'phoenix' => [
            'id' => 'phoenix',
            'type' => 'flag',
            'name' => 'Lửa Phượng Hoàng',
            'description' => 'Ngọn lửa phượng hoàng rực cháy báo hiệu quả mìn đang ẩn nấp.',
            'price' => 480,
            'accent' => '#fb923c',
        ],
        'crown' => [
            'id' => 'crown',
            'type' => 'flag',
            'name' => 'Vương Miện Tối Thượng',
            'description' => 'Vương miện vàng ròng nạm hồng ngọc dành cho bậc thầy dò mìn.',
            'price' => 700,
            'accent' => '#eab308',
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

