<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CourseSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_instructor_can_view_course_settings(): void
    {
        $instructor = User::factory()->instructor()->create();
        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
        ]);

        $this->actingAs($instructor)
            ->get("/instructor/courses/{$course->id}/settings")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Instructor/Courses/Settings')
                ->has('course')
                ->has('settings')
                ->has('stats')
            );
    }

    public function test_instructor_can_update_basic_info(): void
    {
        $instructor = User::factory()->instructor()->create();
        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
            'name' => 'Old Name',
        ]);

        $this->actingAs($instructor)
            ->patch("/instructor/courses/{$course->id}/settings", [
                'name' => 'New Course Name',
                'description' => 'Updated description',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('courses', [
            'id' => $course->id,
            'name' => 'New Course Name',
            'description' => 'Updated description',
        ]);
    }

    public function test_instructor_can_update_status_and_visibility(): void
    {
        $instructor = User::factory()->instructor()->create();
        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
            'status' => 'active',
        ]);

        $this->actingAs($instructor)
            ->patch("/instructor/courses/{$course->id}/settings", [
                'status' => 'draft',
                'is_visible' => false,
                'enrollment_type' => 'manual',
            ])
            ->assertRedirect();

        $course->refresh();
        $this->assertEquals('draft', $course->status);
        $this->assertFalse($course->is_visible);
        $this->assertEquals('manual', $course->enrollment_type);
    }

    public function test_instructor_can_update_settings_json(): void
    {
        $instructor = User::factory()->instructor()->create();
        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
        ]);

        $this->actingAs($instructor)
            ->patch("/instructor/courses/{$course->id}/settings", [
                'settings' => [
                    'learning' => [
                        'order' => 'sequential',
                        'completion_rule' => 'all_items',
                    ],
                    'quizzes' => [
                        'default_attempt_limit' => 3,
                        'shuffle_questions' => true,
                    ],
                ],
            ])
            ->assertRedirect();

        $course->refresh();
        $this->assertEquals('sequential', $course->getSetting('learning.order'));
        $this->assertEquals('all_items', $course->getSetting('learning.completion_rule'));
        $this->assertEquals(3, $course->getSetting('quizzes.default_attempt_limit'));
        $this->assertTrue($course->getSetting('quizzes.shuffle_questions'));
    }

    public function test_grade_weights_must_total_100(): void
    {
        $instructor = User::factory()->instructor()->create();
        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
        ]);

        $this->actingAs($instructor)
            ->patch("/instructor/courses/{$course->id}/settings", [
                'settings' => [
                    'grades' => [
                        'weights' => [
                            'assignments' => 50,
                            'quizzes' => 50,
                            'discussions' => 10,
                            'midterm' => 10,
                            'final' => 10,
                        ],
                    ],
                ],
            ])
            ->assertSessionHasErrors('settings.grades.weights');
    }

    public function test_instructor_can_archive_course(): void
    {
        $instructor = User::factory()->instructor()->create();
        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
            'status' => 'active',
            'is_active' => true,
        ]);

        $this->actingAs($instructor)
            ->patch("/instructor/courses/{$course->id}/archive")
            ->assertRedirect();

        $course->refresh();
        $this->assertEquals('archived', $course->status);
        $this->assertFalse($course->is_active);
    }

    public function test_other_instructor_cannot_access_settings(): void
    {
        $instructor = User::factory()->instructor()->create();
        $otherInstructor = User::factory()->instructor()->create();
        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
        ]);

        $this->actingAs($otherInstructor)
            ->get("/instructor/courses/{$course->id}/settings")
            ->assertForbidden();
    }

    public function test_student_cannot_access_settings(): void
    {
        $instructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();
        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
        ]);

        $this->actingAs($student)
            ->get("/instructor/courses/{$course->id}/settings")
            ->assertForbidden();
    }

    public function test_course_get_merged_settings_returns_defaults(): void
    {
        $course = new Course();
        $settings = $course->getMergedSettings();

        $this->assertArrayHasKey('learning', $settings);
        $this->assertArrayHasKey('assignments', $settings);
        $this->assertArrayHasKey('quizzes', $settings);
        $this->assertArrayHasKey('grades', $settings);
        $this->assertArrayHasKey('discussions', $settings);
        $this->assertArrayHasKey('participants', $settings);
        $this->assertArrayHasKey('islamic', $settings);
    }

    public function test_course_get_setting_with_dot_notation(): void
    {
        $course = new Course();
        $course->settings = [
            'learning' => [
                'order' => 'sequential',
            ],
        ];

        $this->assertEquals('sequential', $course->getSetting('learning.order'));
        $this->assertNull($course->getSetting('nonexistent.key'));
        $this->assertEquals('default', $course->getSetting('nonexistent.key', 'default'));
    }
}
