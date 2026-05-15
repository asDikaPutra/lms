<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->firstOrCreate(
            ['email' => 'admin@lms.ac.id'],
            [
                'name' => 'Administrator',
                'password' => 'password123',
                'role' => 'admin',
                'is_active' => true,
            ],
        );
    }
}
