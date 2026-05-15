<?php

namespace Tests\Feature;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Material;
use App\Models\Module as CourseModule;
use App\Models\Quiz;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthAccessControlTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_redirects_users_to_their_role_dashboard(): void
    {
        $this->withoutVite();

        $admin = User::factory()->admin()->create([
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $response = $this->post('/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $response->assertRedirect('/admin/dashboard');
        $this->assertAuthenticatedAs($admin);
    }

    public function test_inactive_user_cannot_login(): void
    {
        $this->withoutVite();

        User::factory()->student()->inactive()->create([
            'email' => 'inactive@example.com',
            'password' => 'password',
        ]);

        $this->post('/login', [
            'email' => 'inactive@example.com',
            'password' => 'password',
        ])->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_role_middleware_blocks_wrong_dashboard(): void
    {
        $this->withoutVite();

        $student = User::factory()->student()->create();

        $this->get('/student/dashboard')
            ->assertRedirect('/login');

        $this->actingAs($student)
            ->get('/admin/dashboard')
            ->assertForbidden();

        $this->actingAs($student)
            ->get('/student/dashboard')
            ->assertOk();
    }

    public function test_course_policy_allows_owner_and_active_student_only(): void
    {
        $owner = User::factory()->instructor()->create();
        $otherInstructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();
        $outsider = User::factory()->student()->create();

        $course = Course::factory()->create(['instructor_id' => $owner->id]);

        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $this->assertTrue($owner->can('update', $course));
        $this->assertFalse($otherInstructor->can('update', $course));
        $this->assertTrue($student->can('view', $course));
        $this->assertFalse($outsider->can('view', $course));
    }

    public function test_quiz_and_assignment_policies_scope_to_enrolled_students_and_owner(): void
    {
        $owner = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();
        $outsider = User::factory()->student()->create();
        $course = Course::factory()->create(['instructor_id' => $owner->id]);

        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $module = CourseModule::query()->create([
            'course_id' => $course->id,
            'title' => 'Pertemuan',
            'order' => 1,
            'is_published' => true,
        ]);

        $material = Material::query()->create([
            'module_id' => $module->id,
            'title' => 'Materi',
            'order' => 1,
            'is_published' => true,
        ]);

        $quiz = $material->quizzes()->create([
            'title' => 'Quiz',
            'passing_score' => 70,
            'is_published' => true,
        ]);

        $assignment = $module->assignments()->create([
            'title' => 'Tugas',
            'description' => 'Deskripsi',
            'deadline' => now()->addDay(),
            'is_published' => true,
        ]);

        $this->assertTrue($owner->can('manage', $quiz));
        $this->assertTrue($owner->can('manage', $assignment));
        $this->assertTrue($student->can('attempt', $quiz));
        $this->assertTrue($student->can('submit', $assignment));
        $this->assertFalse($outsider->can('attempt', $quiz));
        $this->assertFalse($outsider->can('submit', $assignment));
        $this->assertInstanceOf(Quiz::class, $quiz);
        $this->assertInstanceOf(Assignment::class, $assignment);
    }
}
