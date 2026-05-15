<?php

namespace Tests\Feature;

use App\Models\Content;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Material;
use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InstructorPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_instructor_dashboard_only_shows_owned_courses_and_activity(): void
    {
        $this->withoutVite();

        $instructor = User::factory()->instructor()->create();
        $otherInstructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();
        $ownedCourse = Course::factory()->create(['instructor_id' => $instructor->id]);
        Course::factory()->create(['instructor_id' => $otherInstructor->id]);

        Enrollment::factory()->pending()->create([
            'user_id' => $student->id,
            'course_id' => $ownedCourse->id,
        ]);

        $this->actingAs($instructor)
            ->get('/instructor/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Instructor/Dashboard')
                ->where('stats.owned_courses', 1)
                ->where('stats.pending_enrollments', 1)
                ->has('courses', 1)
                ->has('pendingEnrollments', 1));
    }

    public function test_instructor_can_create_update_toggle_and_regenerate_owned_course(): void
    {
        $instructor = User::factory()->instructor()->create();

        $this->actingAs($instructor)
            ->post('/instructor/courses', [
                'code' => 'TAF101',
                'name' => 'Tafsir Tematik',
                'description' => 'Kajian tafsir pilihan.',
                'semester' => 'Ganjil 2026/2027',
                'enrollment_type' => 'manual',
                'leaderboard_enabled' => true,
                'certificate_criteria' => [
                    'min_progress' => 90,
                    'min_score' => 75,
                ],
            ])
            ->assertRedirect();

        $course = Course::query()->where('code', 'TAF101')->firstOrFail();

        $this->assertSame($instructor->id, $course->instructor_id);
        $this->assertSame('manual', $course->enrollment_type);
        $this->assertTrue($course->leaderboard_enabled);

        $oldEnrollCode = $course->enroll_code;

        $this->actingAs($instructor)
            ->put("/instructor/courses/{$course->id}", [
                'code' => 'TAF102',
                'name' => 'Tafsir Tematik Lanjutan',
                'description' => 'Update kajian.',
                'semester' => 'Genap 2026/2027',
                'enrollment_type' => 'auto',
                'leaderboard_enabled' => false,
                'is_active' => true,
                'certificate_criteria' => [
                    'min_progress' => 100,
                    'min_score' => 80,
                ],
            ])
            ->assertRedirect();

        $course->refresh();
        $this->assertSame('TAF102', $course->code);
        $this->assertSame('auto', $course->enrollment_type);

        $this->actingAs($instructor)
            ->patch("/instructor/courses/{$course->id}/regenerate-code")
            ->assertRedirect();

        $this->assertNotSame($oldEnrollCode, $course->refresh()->enroll_code);

        $this->actingAs($instructor)
            ->patch("/instructor/courses/{$course->id}/toggle")
            ->assertRedirect();

        $this->assertFalse($course->refresh()->is_active);
    }

    public function test_instructor_cannot_manage_another_instructors_course(): void
    {
        $instructor = User::factory()->instructor()->create();
        $otherInstructor = User::factory()->instructor()->create();
        $course = Course::factory()->create(['instructor_id' => $otherInstructor->id]);

        $this->actingAs($instructor)
            ->put("/instructor/courses/{$course->id}", [
                'code' => $course->code,
                'name' => $course->name,
                'description' => $course->description,
                'semester' => $course->semester,
                'enrollment_type' => 'auto',
                'leaderboard_enabled' => false,
                'is_active' => true,
                'certificate_criteria' => [
                    'min_progress' => 100,
                    'min_score' => 70,
                ],
            ])
            ->assertForbidden();
    }

    public function test_instructor_can_approve_and_reject_owned_course_enrollments(): void
    {
        $instructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();
        $course = Course::factory()->create(['instructor_id' => $instructor->id]);
        $enrollment = Enrollment::factory()->pending()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $this->actingAs($instructor)
            ->patch("/instructor/courses/{$course->id}/enrollments/{$enrollment->id}/approve")
            ->assertRedirect();

        $this->assertSame('active', $enrollment->refresh()->status);
        $this->assertNotNull($enrollment->enrolled_at);

        $enrollment->update(['status' => 'pending', 'enrolled_at' => null]);

        $this->actingAs($instructor)
            ->patch("/instructor/courses/{$course->id}/enrollments/{$enrollment->id}/reject")
            ->assertRedirect();

        $this->assertSame('rejected', $enrollment->refresh()->status);
    }

    public function test_instructor_can_build_modules_materials_and_content_for_owned_course(): void
    {
        Storage::fake('public');

        $instructor = User::factory()->instructor()->create();
        $course = Course::factory()->create(['instructor_id' => $instructor->id]);

        $this->actingAs($instructor)
            ->post("/instructor/courses/{$course->id}/modules", [
                'title' => 'Pendahuluan',
                'description' => 'Pembuka materi.',
            ])
            ->assertRedirect();

        $module = Module::query()->where('course_id', $course->id)->firstOrFail();

        $this->actingAs($instructor)
            ->post("/instructor/modules/{$module->id}/materials", [
                'title' => 'Makna Surat Al-Fatihah',
            ])
            ->assertRedirect();

        $material = Material::query()->where('module_id', $module->id)->firstOrFail();

        $this->actingAs($instructor)
            ->post("/instructor/materials/{$material->id}/contents", [
                'type' => 'artikel',
                'title' => 'Bacaan Awal',
                'body' => 'Isi artikel pembelajaran.',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('contents', [
            'material_id' => $material->id,
            'type' => 'artikel',
            'title' => 'Bacaan Awal',
        ]);

        $this->actingAs($instructor)
            ->post("/instructor/materials/{$material->id}/contents", [
                'type' => 'pdf',
                'title' => 'Handout PDF',
                'file' => UploadedFile::fake()->create('handout.pdf', 100, 'application/pdf'),
            ])
            ->assertRedirect();

        $content = Content::query()->where('title', 'Handout PDF')->firstOrFail();
        Storage::disk('public')->assertExists($content->file_path);

        $this->actingAs($instructor)
            ->patch("/instructor/modules/{$module->id}/toggle")
            ->assertRedirect();

        $this->assertTrue($module->refresh()->is_published);

        $this->actingAs($instructor)
            ->patch("/instructor/materials/{$material->id}/toggle")
            ->assertRedirect();

        $this->assertTrue($material->refresh()->is_published);
    }
}
