<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MinefieldSeeder extends Seeder
{
    public function run(): void
    {
        $modes = [
            ['classic', 'Cổ điển', 'Tất cả 8 ô xung quanh', [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]],
            ['plus', 'Dấu cộng', '4 ô kề cạnh (ngang & dọc)', [[-1, 0], [0, -1], [0, 1], [1, 0]]],
            ['corner', 'Góc chéo', '4 ô góc chéo', [[-1, -1], [-1, 1], [1, -1], [1, 1]]],
        ];

        foreach ($modes as [$code, $name, $description, $offsets]) {
            DB::table('game_modes')->updateOrInsert(
                ['code' => $code],
                ['name' => $name, 'description' => $description, 'neighbor_offsets' => json_encode($offsets)]
            );
        }

        foreach ([
            ['easy', 'Dễ', 9, 9, 10],
            ['medium', 'Trung bình', 12, 12, 22],
            ['hard', 'Khó', 16, 16, 40],
        ] as [$code, $name, $rows, $cols, $mines]) {
            DB::table('difficulties')->updateOrInsert(
                ['code' => $code],
                ['name' => $name, 'board_rows' => $rows, 'board_cols' => $cols, 'mine_count' => $mines]
            );
        }
    }
}
