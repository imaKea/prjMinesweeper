<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $endlessMode = DB::table('game_modes')->where('code', 'endless')->first();
        if ($endlessMode) {
            DB::table('games')->where('mode_id', $endlessMode->id)->delete();
            DB::table('records')->where('mode_id', $endlessMode->id)->delete();
            DB::table('game_modes')->where('id', $endlessMode->id)->delete();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse
    }
};
