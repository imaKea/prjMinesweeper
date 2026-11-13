<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'display_name',
        'password',
        'coins',
        'equipped_board_skin',
        'equipped_flag_skin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_locked' => 'boolean',
            'coins' => 'integer',
        ];
    }

    public function games()
    {
        return $this->hasMany(Game::class);
    }

    public function records()
    {
        return $this->hasMany(Record::class);
    }

    public function skins()
    {
        return $this->hasMany(UserSkin::class);
    }

    public function hasSkin(string $skinId): bool
    {
        if ($skinId === 'classic') {
            return true;
        }

        return $this->skins()->where('skin_id', $skinId)->exists();
    }
}
