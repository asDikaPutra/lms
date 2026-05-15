<?php

namespace Tests\Feature;

use App\Models\Assignment;
use App\Models\ContentProgress;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Material;
use App\Models\Module as CourseModule;
use App\Models\Quiz;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DomainFoundationTest extends TestCase
{
    use RefreshDatabase;

    public function test_lms_domain_models_can_create_core_learning_hierarchy(): void
    {
        $instructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();

        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
            'leaderboard_enabled' => true,
        ]);

        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $module = CourseModule::query()->create([
            'course_id' => $course->id,
            'title' => 'Pertemuan 1',
            'order' => 1,
            'is_published' => true,
        ]);

        $material = Material::query()->create([
            'module_id' => $module->id,
            'title' => 'Adab Belajar',
            'order' => 1,
            'is_published' => true,
        ]);

        $content = $material->contents()->create([
            'type' => 'artikel',
            'title' => 'Niat Menuntut Ilmu',
            'body' => 'Konten pembelajaran awal.',
            'order' => 1,
        ]);

        ContentProgress::query()->create([
            'user_id' => $student->id,
            'content_id' => $content->id,
            'completed_at' => now(),
        ]);

        $quiz = $material->quizzes()->create([
            'title' => 'Quiz Materi',
            'passing_score' => 70,
            'is_published' => true,
        ]);

        $assignment = $module->assignments()->create([
            'title' => 'Tugas Modul',
            'description' => 'Tugas singkat.',
            'deadline' => now()->addDay(),
            'is_published' => true,
        ]);

        $course->load('instructor', 'students', 'modules.materials.contents');

        $this->assertTrue($course->leaderboard_enabled);
        $this->assertTrue($course->students->contains($student));
        $this->assertSame('material', $quiz->refresh()->quizzable_type);
        $this->assertSame('module', $assignment->refresh()->assignable_type);
        $this->assertDatabaseHas('content_progress', [
            'user_id' => $student->id,
            'content_id' => $content->id,
        ]);
        $this->assertInstanceOf(Quiz::class, $quiz);
        $this->assertInstanceOf(Assignment::class, $assignment);
    }
}
