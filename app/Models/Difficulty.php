<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Difficulty extends Model
{
    public $timestamps = false;

    protected $fillable = ['code', 'name', 'board_rows', 'board_cols', 'mine_count'];

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