<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $username = config('minefield.admin.username');
        $password = config('minefield.admin.password');

        if (! is_string($password) || $password === '') {
            $this->command?->warn('Admin account seeding skipped: set MINEFIELD_ADMIN_PASSWORD in .env first.');

            return;
        }

        if (! is_string($username) || ! preg_match('/^[A-Za-z0-9_]{3,20}$/', $username)) {
            throw new RuntimeException('MINEFIELD_ADMIN_USERNAME must contain 3-20 letters, numbers, or underscores.');
        }

        if (strlen($password) < 12) {
            throw new RuntimeException('MINEFIELD_ADMIN_PASSWORD must be at least 12 characters long.');
        }

        $admin = User::firstOrNew(['username' => $username]);
        $admin->forceFill([
            'display_name' => $username,
            'password' => Hash::make($password),
            'role' => 'admin',
        ])->save();
    }
}
