<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Enrollment>
 */
class EnrollmentFactory extends Factory
{
    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'active', 'rejected']);

        return [
            'user_id' => User::factory()->student(),
            'course_id' => Course::factory(),
            'status' => $status,
            'enrolled_at' => $status === 'active' ? now() : null,
            'completed_at' => null,
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'enrolled_at' => now(),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'enrolled_at' => null,
        ]);
    }
}
