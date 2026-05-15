<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Course>
 */
class CourseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->bothify('FAI###')),
            'name' => fake()->randomElement([
                'Tafsir Al-Quran',
                'Fiqh Ibadah',
                'Hadis & Ulumul Hadis',
                'Akidah & Akhlak',
                'Bahasa Arab',
            ]),
            'description' => fake()->paragraph(),
            'instructor_id' => User::factory()->instructor(),
            'enroll_code' => strtoupper(Str::random(8)),
            'enrollment_type' => fake()->randomElement(['auto', 'manual']),
            'semester' => fake()->randomElement(['Ganjil 2026/2027', 'Genap 2026/2027']),
            'is_active' => true,
            'leaderboard_enabled' => false,
            'certificate_criteria' => [
                'min_progress' => 100,
                'min_score' => 70,
            ],
        ];
    }
}
