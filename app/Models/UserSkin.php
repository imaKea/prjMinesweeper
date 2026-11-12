<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSkin extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'skin_id',
        'skin_type',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

