<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    public $timestamps = false;

    protected $dateFormat = 'Y-m-d H:i:s.v';

    protected $fillable = [
        'token', 'user_id', 'mode_id', 'difficulty_id', 'status',
        'started_at', 'finished_at', 'time_ms', 'score', 'board_state',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'finished_at' => 'datetime',
            'time_ms' => 'integer',
            'score' => 'integer',
            'board_state' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mode()
    {
        return $this->belongsTo(GameMode::class, 'mode_id');
    }

    public function difficulty()
    {
        return $this->belongsTo(Difficulty::class, 'difficulty_id');
    }

    public function record()
    {
        return $this->hasOne(Record::class);
    }
}
