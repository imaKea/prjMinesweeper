<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            if (! Schema::hasColumn('games', 'score')) {
                $table->unsignedInteger('score')->default(0);
            }
            if (! Schema::hasColumn('games', 'board_state')) {
                $table->longText('board_state')->nullable();
            }
        });

        Schema::table('records', function (Blueprint $table) {
            if (! Schema::hasColumn('records', 'score')) {
                $table->unsignedInteger('score')->default(0);
            }
            $table->unsignedInteger('best_time_ms')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['score', 'board_state']);
        });

        Schema::table('records', function (Blueprint $table) {
            $table->dropColumn(['score']);
            $table->unsignedInteger('best_time_ms')->nullable(false)->change();
        });

        DB::table('game_modes')->where('code', 'endless')->delete();
    }
};
