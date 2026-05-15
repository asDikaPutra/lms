<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_shows_operational_stats(): void
    {
        $this->withoutVite();

        $admin = User::factory()->admin()->create();
        $instructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();
        $course = Course::factory()->create(['instructor_id' => $instructor->id]);

        Enrollment::factory()->pending()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $this->actingAs($admin)
            ->get('/admin/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->where('stats.total_users', 3)
                ->where('stats.total_instructors', 1)
                ->where('stats.total_students', 1)
                ->where('stats.active_courses', 1)
                ->where('stats.pending_enrollments', 1));
    }

    public function test_admin_can_create_update_and_toggle_user(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post('/admin/users', [
                'name' => 'Mahasiswa Baru',
                'email' => 'baru@example.com',
                'password' => 'password123',
                'role' => 'student',
                'nim' => '1234567890',
                'is_active' => true,
            ])
            ->assertRedirect();

        $user = User::query()->where('email', 'baru@example.com')->firstOrFail();

        $this->assertSame('student', $user->role);
        $this->assertSame('1234567890', $user->nim);

        $this->actingAs($admin)
            ->put("/admin/users/{$user->id}", [
                'name' => 'Dosen Baru',
                'email' => 'dosenbaru@example.com',
                'password' => '',
                'role' => 'instructor',
                'nidn' => '9876543210',
                'is_active' => true,
            ])
            ->assertRedirect();

        $user->refresh();
        $this->assertSame('instructor', $user->role);
        $this->assertNull($user->nim);
        $this->assertSame('9876543210', $user->nidn);

        $this->actingAs($admin)
            ->patch("/admin/users/{$user->id}/toggle")
            ->assertRedirect();

        $this->assertFalse($user->refresh()->is_active);
    }

    public function test_non_admin_cannot_access_admin_user_management(): void
    {
        $student = User::factory()->student()->create();

        $this->actingAs($student)
            ->get('/admin/users')
            ->assertForbidden();
    }

    public function test_admin_can_import_students_from_csv(): void
    {
        $admin = User::factory()->admin()->create();
        $csv = UploadedFile::fake()->createWithContent(
            'students.csv',
            "name,email,nim,password\nMahasiswa Import,import@example.com,221100,password123\nBaris Rusak\n",
        );

        $this->actingAs($admin)
            ->post('/admin/users/import-students', ['file' => $csv])
            ->assertRedirect()
            ->assertSessionHas('success', '1 data mahasiswa berhasil diimpor.');

        $student = User::query()->where('email', 'import@example.com')->firstOrFail();

        $this->assertSame('student', $student->role);
        $this->assertSame('221100', $student->nim);
        $this->assertTrue($student->is_active);
    }

    public function test_admin_can_manage_courses_and_export_report(): void
    {
        $admin = User::factory()->admin()->create();
        $oldInstructor = User::factory()->instructor()->create();
        $newInstructor = User::factory()->instructor()->create();
        $course = Course::factory()->create([
            'code' => 'FAI101',
            'name' => 'Tafsir Al-Quran',
            'instructor_id' => $oldInstructor->id,
            'leaderboard_enabled' => false,
        ]);

        $this->actingAs($admin)
            ->get('/admin/courses')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Courses/Index')
                ->has('courses.data', 1)
                ->has('instructors', 2));

        $this->actingAs($admin)
            ->put("/admin/courses/{$course->id}", [
                'instructor_id' => $newInstructor->id,
                'semester' => 'Ganjil 2026/2027',
                'leaderboard_enabled' => true,
            ])
            ->assertRedirect();

        $course->refresh();
        $this->assertSame($newInstructor->id, $course->instructor_id);
        $this->assertTrue($course->leaderboard_enabled);

        $this->actingAs($admin)
            ->patch("/admin/courses/{$course->id}/toggle")
            ->assertRedirect();

        $this->assertFalse($course->refresh()->is_active);

        $this->actingAs($admin)
            ->get('/admin/reports/courses.csv')
            ->assertOk()
            ->assertHeader('content-type', 'text/csv; charset=UTF-8');
    }
}
