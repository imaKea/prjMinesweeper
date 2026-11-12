<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_modes', function (Blueprint $table): void {
            $table->tinyIncrements('id');
            $table->string('code', 20)->unique();
            $table->string('name', 50);
            $table->string('description', 255)->nullable();
            $table->json('neighbor_offsets');
        });

        Schema::create('difficulties', function (Blueprint $table): void {
            $table->tinyIncrements('id');
            $table->string('code', 20)->unique();
            $table->string('name', 50);
            $table->unsignedTinyInteger('board_rows');
            $table->unsignedTinyInteger('board_cols');
            $table->unsignedSmallInteger('mine_count');
        });

        Schema::create('games', function (Blueprint $table): void {
            $table->id();
            $table->char('token', 36)->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('mode_id');
            $table->unsignedTinyInteger('difficulty_id');
            $table->enum('status', ['playing', 'won', 'lost', 'rejected'])->default('playing');
            $table->dateTime('started_at', 3);
            $table->dateTime('finished_at', 3)->nullable();
            $table->unsignedInteger('time_ms')->nullable();
            $table->foreign('mode_id')->references('id')->on('game_modes');
            $table->foreign('difficulty_id')->references('id')->on('difficulties');
            $table->index(['user_id', 'started_at']);
            $table->index(['mode_id', 'difficulty_id']);
        });

        Schema::create('records', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('mode_id');
            $table->unsignedTinyInteger('difficulty_id');
            $table->unsignedBigInteger('game_id')->nullable();
            $table->unsignedInteger('best_time_ms');
            $table->dateTime('achieved_at', 3);
            $table->unique(['user_id', 'mode_id', 'difficulty_id']);
            $table->index(['mode_id', 'difficulty_id', 'best_time_ms', 'achieved_at'], 'records_leaderboard_idx');
            $table->foreign('mode_id')->references('id')->on('game_modes');
            $table->foreign('difficulty_id')->references('id')->on('difficulties');
            $table->foreign('game_id')->references('id')->on('games')->nullOnDelete();
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE difficulties ADD CONSTRAINT ck_difficulties_mines CHECK (mine_count >= 1 AND mine_count < board_rows * board_cols)');
            DB::statement("ALTER TABLE games ADD CONSTRAINT ck_games_won_has_time CHECK (status <> 'won' OR time_ms IS NOT NULL)");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('records');
        Schema::dropIfExists('games');
        Schema::dropIfExists('difficulties');
        Schema::dropIfExists('game_modes');
    }
};