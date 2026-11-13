<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    public $timestamps = false;

    protected $dateFormat = 'Y-m-d H:i:s.v';

    protected $fillable = [
        'user_id', 'mode_id', 'difficulty_id', 'game_id', 'best_time_ms', 'score', 'achieved_at',
    ];

    protected function casts(): array
    {
        return [
            'best_time_ms' => 'integer',
            'score' => 'integer',
            'achieved_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
