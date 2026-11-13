<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameMode extends Model
{
    public $timestamps = false;

    protected $fillable = ['code', 'name', 'description', 'neighbor_offsets'];

    protected function casts(): array
    {
        return ['neighbor_offsets' => 'array'];
    }

    public static function findByCodeCached(string $code): ?self
    {
        static $cache = null;
        if ($cache === null) {
            $cache = self::all()->keyBy('code');
        }

        return $cache->get($code) ?? self::where('code', $code)->first();
    }

    public static function findByIdCached(int $id): ?self
    {
        static $cache = null;
        if ($cache === null) {
            $cache = self::all()->keyBy('id');
        }

        return $cache->get($id) ?? self::find($id);
    }
}