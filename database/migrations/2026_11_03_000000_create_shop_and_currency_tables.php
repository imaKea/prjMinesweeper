<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->unsignedInteger('coins')->default(0)->after('is_locked');
            $table->string('equipped_board_skin', 50)->default('classic')->after('coins');
            $table->string('equipped_flag_skin', 50)->default('classic')->after('equipped_board_skin');
        });

        Schema::create('user_skins', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('skin_id', 50);
            $table->string('skin_type', 20); // 'board' or 'flag'
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['user_id', 'skin_id']);
            $table->index(['user_id', 'skin_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_skins');

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['coins', 'equipped_board_skin', 'equipped_flag_skin']);
        });
    }
};

