<?php

namespace Tests\Feature;

use App\Models\Content;
use App\Models\ContentProgress;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Material;
use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StudentPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_dashboard_shows_courses_statuses_and_progress(): void
    {
        $this->withoutVite();

        $student = User::factory()->student()->create();
        $course = Course::factory()->create();
        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Modul Published',
            'order' => 1,
            'is_published' => true,
        ]);
        $material = Material::query()->create([
            'module_id' => $module->id,
            'title' => 'Materi Published',
            'order' => 1,
            'is_published' => true,
        ]);
        $contentA = Content::query()->create([
            'material_id' => $material->id,
            'type' => 'artikel',
            'title' => 'Konten A',
            'body' => 'A',
            'order' => 1,
        ]);
        Content::query()->create([
            'material_id' => $material->id,
            'type' => 'artikel',
            'title' => 'Konten B',
            'body' => 'B',
            'order' => 2,
        ]);

        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);
        ContentProgress::query()->create([
            'user_id' => $student->id,
            'content_id' => $contentA->id,
            'completed_at' => now(),
        ]);

        $this->actingAs($student)
            ->get('/student/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Dashboard')
                ->where('stats.active_courses', 1)
                ->where('stats.overall_progress', 50)
                ->where('enrollments.0.course.progress', 50));
    }

    public function test_student_can_join_auto_manual_and_resubmit_rejected_enrollment(): void
    {
        $student = User::factory()->student()->create();
        $autoCourse = Course::factory()->create(['enrollment_type' => 'auto', 'enroll_code' => 'AUTO1234']);
        $manualCourse = Course::factory()->create(['enrollment_type' => 'manual', 'enroll_code' => 'MANU1234']);

        $this->actingAs($student)
            ->post('/student/enrollments', ['enroll_code' => 'AUTO1234'])
            ->assertRedirect();

        $this->assertDatabaseHas('enrollments', [
            'user_id' => $student->id,
            'course_id' => $autoCourse->id,
            'status' => 'active',
        ]);

        $this->actingAs($student)
            ->post('/student/enrollments', ['enroll_code' => 'MANU1234'])
            ->assertRedirect();

        $this->assertDatabaseHas('enrollments', [
            'user_id' => $student->id,
            'course_id' => $manualCourse->id,
            'status' => 'pending',
        ]);

        Enrollment::query()
            ->where('user_id', $student->id)
            ->where('course_id', $manualCourse->id)
            ->update(['status' => 'rejected']);

        $this->actingAs($student)
            ->post('/student/enrollments', ['enroll_code' => 'MANU1234'])
            ->assertRedirect();

        $this->assertDatabaseHas('enrollments', [
            'user_id' => $student->id,
            'course_id' => $manualCourse->id,
            'status' => 'pending',
        ]);
    }

    public function test_student_can_only_open_active_enrolled_course_and_only_sees_published_content(): void
    {
        $this->withoutVite();

        $student = User::factory()->student()->create();
        $otherStudent = User::factory()->student()->create();
        $course = Course::factory()->create(['is_active' => true]);
        $inactiveCourse = Course::factory()->create(['is_active' => false]);
        $publishedModule = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Published Module',
            'order' => 1,
            'is_published' => true,
        ]);
        $hiddenModule = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Hidden Module',
            'order' => 2,
            'is_published' => false,
        ]);
        $publishedMaterial = Material::query()->create([
            'module_id' => $publishedModule->id,
            'title' => 'Published Material',
            'order' => 1,
            'is_published' => true,
        ]);
        Material::query()->create([
            'module_id' => $hiddenModule->id,
            'title' => 'Hidden Material',
            'order' => 1,
            'is_published' => true,
        ]);
        Content::query()->create([
            'material_id' => $publishedMaterial->id,
            'type' => 'artikel',
            'title' => 'Visible Content',
            'body' => 'Published',
            'order' => 1,
        ]);

        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);
        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $inactiveCourse->id,
        ]);

        $this->actingAs($student)
            ->get("/student/courses/{$course->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Courses/Show')
                ->has('course.modules', 1)
                ->where('course.modules.0.title', 'Published Module')
                ->where('course.modules.0.materials.0.contents.0.title', 'Visible Content'));

        $this->actingAs($otherStudent)
            ->get("/student/courses/{$course->id}")
            ->assertForbidden();

        $this->actingAs($student)
            ->get("/student/courses/{$inactiveCourse->id}")
            ->assertForbidden();
    }

    public function test_student_can_mark_published_content_complete(): void
    {
        $student = User::factory()->student()->create();
        $course = Course::factory()->create();
        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Modul',
            'order' => 1,
            'is_published' => true,
        ]);
        $material = Material::query()->create([
            'module_id' => $module->id,
            'title' => 'Materi',
            'order' => 1,
            'is_published' => true,
        ]);
        $content = Content::query()->create([
            'material_id' => $material->id,
            'type' => 'artikel',
            'title' => 'Konten',
            'body' => 'Isi',
            'order' => 1,
        ]);
        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $this->actingAs($student)
            ->patch("/student/contents/{$content->id}/complete")
            ->assertRedirect();

        $this->assertDatabaseHas('content_progress', [
            'user_id' => $student->id,
            'content_id' => $content->id,
        ]);
    }
}
