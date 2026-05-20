<?php

namespace Tests\Feature;

use App\Models\Content;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Material;
use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CourseCrudTest extends TestCase
{
    use RefreshDatabase;

    // === Instructor Tests ===

    public function test_instructor_can_list_own_courses_with_search_and_filter(): void
    {
        $this->withoutVite();

        $instructor = User::factory()->instructor()->create();
        $otherInstructor = User::factory()->instructor()->create();

        // Create 2 courses for the instructor
        $course1 = Course::factory()->create([
            'instructor_id' => $instructor->id,
            'name' => 'Tafsir Tematik',
            'code' => 'TAF101',
            'semester' => 'Ganjil 2026',
            'is_active' => true,
        ]);
        $course2 = Course::factory()->create([
            'instructor_id' => $instructor->id,
            'name' => 'Fiqh Muamalah',
            'code' => 'FQH201',
            'semester' => 'Genap 2026',
            'is_active' => false,
        ]);

        // Create 1 course for the other instructor
        Course::factory()->create(['instructor_id' => $otherInstructor->id]);

        // Test: instructor sees only own courses
        $this->actingAs($instructor)
            ->get('/instructor/courses')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Instructor/Courses/Index')
                ->has('courses.data', 2)
            );

        // Test search: search by name "Tafsir" returns 1 result
        $this->actingAs($instructor)
            ->get('/instructor/courses?search=Tafsir')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Instructor/Courses/Index')
                ->has('courses.data', 1)
            );

        // Test status filter: only active courses shown
        $this->actingAs($instructor)
            ->get('/instructor/courses?status=active')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Instructor/Courses/Index')
                ->has('courses.data', 1)
            );
    }

    public function test_instructor_can_view_course_builder_page(): void
    {
        $this->withoutVite();

        $instructor = User::factory()->instructor()->create();

        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
        ]);

        $module = Module::create([
            'course_id' => $course->id,
            'title' => 'Module 1',
            'description' => 'First module',
            'order' => 1,
            'is_published' => true,
        ]);

        $this->actingAs($instructor)
            ->get("/instructor/courses/{$course->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Instructor/Courses/Overview')
                ->where('course.id', $course->id)
                ->has('course.modules', 1)
            );
    }

    public function test_instructor_can_delete_own_course_without_active_enrollments(): void
    {
        $instructor = User::factory()->instructor()->create();

        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
        ]);

        $this->actingAs($instructor)
            ->delete("/instructor/courses/{$course->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('courses', ['id' => $course->id]);
    }

    public function test_instructor_cannot_delete_course_with_active_enrollments(): void
    {
        $instructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();

        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
        ]);

        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $this->actingAs($instructor)
            ->delete("/instructor/courses/{$course->id}")
            ->assertStatus(409);

        $this->assertDatabaseHas('courses', ['id' => $course->id]);
    }

    public function test_instructor_cannot_delete_other_instructors_course(): void
    {
        $instructor1 = User::factory()->instructor()->create();
        $instructor2 = User::factory()->instructor()->create();

        $course = Course::factory()->create([
            'instructor_id' => $instructor2->id,
        ]);

        $this->actingAs($instructor1)
            ->delete("/instructor/courses/{$course->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('courses', ['id' => $course->id]);
    }

    // === Student Tests ===

    public function test_student_can_browse_active_courses(): void
    {
        $this->withoutVite();

        $instructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();

        // Create 2 active courses
        Course::factory()->create([
            'instructor_id' => $instructor->id,
            'is_active' => true,
        ]);
        Course::factory()->create([
            'instructor_id' => $instructor->id,
            'is_active' => true,
        ]);

        // Create 1 inactive course
        Course::factory()->create([
            'instructor_id' => $instructor->id,
            'is_active' => false,
        ]);

        $this->actingAs($student)
            ->get('/student/courses')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Courses/Index')
                ->has('courses', 2)
            );
    }

    public function test_student_can_view_enrolled_course_detail(): void
    {
        $this->withoutVite();

        $instructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();

        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
            'is_active' => true,
        ]);

        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $this->actingAs($student)
            ->get("/student/courses/{$course->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Courses/Show')
                ->has('course')
                ->has('progress')
            );
    }

    public function test_student_cannot_view_unenrolled_course(): void
    {
        $instructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();

        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
            'is_active' => true,
        ]);

        // Student is NOT enrolled in this course
        $this->actingAs($student)
            ->get("/student/courses/{$course->id}")
            ->assertForbidden();
    }

    // === Admin Tests ===

    public function test_admin_can_list_all_courses(): void
    {
        $this->withoutVite();

        $admin = User::factory()->admin()->create();

        $instructor1 = User::factory()->instructor()->create();
        $instructor2 = User::factory()->instructor()->create();

        Course::factory()->create(['instructor_id' => $instructor1->id]);
        Course::factory()->create(['instructor_id' => $instructor2->id]);

        $this->actingAs($admin)
            ->get('/admin/courses')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Courses/Index')
                ->has('courses.data', 2)
            );
    }

    public function test_admin_can_update_course_instructor_and_semester(): void
    {
        $admin = User::factory()->admin()->create();
        $instructor = User::factory()->instructor()->create();
        $newInstructor = User::factory()->instructor()->create();

        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
            'semester' => 'Ganjil 2025/2026',
            'leaderboard_enabled' => false,
        ]);

        $this->actingAs($admin)
            ->put("/admin/courses/{$course->id}", [
                'instructor_id' => $newInstructor->id,
                'semester' => 'Genap 2026/2027',
                'leaderboard_enabled' => true,
            ])
            ->assertRedirect();

        $course->refresh();

        $this->assertEquals($newInstructor->id, $course->instructor_id);
        $this->assertEquals('Genap 2026/2027', $course->semester);
        $this->assertTrue($course->leaderboard_enabled);
    }

    public function test_admin_can_toggle_course_status(): void
    {
        $admin = User::factory()->admin()->create();
        $instructor = User::factory()->instructor()->create();

        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
            'is_active' => true,
        ]);

        // Toggle from active to inactive
        $this->actingAs($admin)
            ->patch("/admin/courses/{$course->id}/toggle")
            ->assertRedirect();

        $course->refresh();
        $this->assertFalse($course->is_active);

        // Toggle back from inactive to active
        $this->actingAs($admin)
            ->patch("/admin/courses/{$course->id}/toggle")
            ->assertRedirect();

        $course->refresh();
        $this->assertTrue($course->is_active);
    }

    public function test_admin_can_export_courses_csv(): void
    {
        $admin = User::factory()->admin()->create();
        $instructor = User::factory()->instructor()->create();

        Course::factory()->create([
            'instructor_id' => $instructor->id,
            'code' => 'TAF101',
            'name' => 'Tafsir Tematik',
        ]);

        $response = $this->actingAs($admin)
            ->get('/admin/reports/courses.csv');

        $response->assertOk();
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');

        $content = $response->streamedContent();
        $this->assertStringContainsString('code,name,instructor,semester,active_enrollments,is_active', $content);
        $this->assertStringContainsString('TAF101', $content);
    }

    public function test_admin_can_delete_course(): void
    {
        $admin = User::factory()->admin()->create();
        $instructor = User::factory()->instructor()->create();

        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
        ]);

        $this->actingAs($admin)
            ->delete("/admin/courses/{$course->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('courses', ['id' => $course->id]);
    }

    // === Validation Tests ===

    public function test_course_creation_validates_required_fields(): void
    {
        $instructor = User::factory()->instructor()->create();

        $this->actingAs($instructor)
            ->post('/instructor/courses', [])
            ->assertSessionHasErrors([
                'code',
                'name',
                'enrollment_type',
                'certificate_criteria.min_progress',
                'certificate_criteria.min_score',
            ]);
    }

    public function test_course_creation_rejects_duplicate_code(): void
    {
        $instructor = User::factory()->instructor()->create();

        // Create an existing course with code 'TAF101'
        Course::factory()->create([
            'instructor_id' => $instructor->id,
            'code' => 'TAF101',
        ]);

        // Attempt to create another course with the same code
        $this->actingAs($instructor)
            ->post('/instructor/courses', [
                'code' => 'TAF101',
                'name' => 'Another Course',
                'enrollment_type' => 'auto',
                'certificate_criteria' => ['min_progress' => 100, 'min_score' => 70],
            ])
            ->assertSessionHasErrors(['code']);
    }

    public function test_course_auto_generates_enroll_code(): void
    {
        $instructor = User::factory()->instructor()->create();

        $this->actingAs($instructor)
            ->post('/instructor/courses', [
                'code' => 'NEW101',
                'name' => 'New Course',
                'enrollment_type' => 'auto',
                'certificate_criteria' => ['min_progress' => 100, 'min_score' => 70],
            ])
            ->assertRedirect();

        $course = Course::where('code', 'NEW101')->first();

        $this->assertNotNull($course->enroll_code);
        $this->assertEquals(8, strlen($course->enroll_code));
        $this->assertSame(strtoupper($course->enroll_code), $course->enroll_code);
    }

    public function test_course_update_allows_same_code_for_self(): void
    {
        $instructor = User::factory()->instructor()->create();

        $course = Course::factory()->create([
            'instructor_id' => $instructor->id,
            'code' => 'TAF101',
            'name' => 'Original Name',
        ]);

        $this->actingAs($instructor)
            ->put("/instructor/courses/{$course->id}", [
                'code' => 'TAF101',
                'name' => 'Updated Name',
                'enrollment_type' => 'auto',
                'is_active' => true,
                'certificate_criteria' => ['min_progress' => 100, 'min_score' => 70],
            ])
            ->assertRedirect();

        $course->refresh();
        $this->assertEquals('Updated Name', $course->name);
    }

    public function test_certificate_criteria_validates_range(): void
    {
        $instructor = User::factory()->instructor()->create();

        $this->actingAs($instructor)
            ->post('/instructor/courses', [
                'code' => 'RNG101',
                'name' => 'Range Test',
                'enrollment_type' => 'auto',
                'certificate_criteria' => ['min_progress' => 150, 'min_score' => -10],
            ])
            ->assertSessionHasErrors([
                'certificate_criteria.min_progress',
                'certificate_criteria.min_score',
            ]);
    }
}
