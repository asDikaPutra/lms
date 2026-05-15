<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class EnrollmentController extends Controller
{
    public function approve(Course $course, Enrollment $enrollment): RedirectResponse
    {
        $this->authorizeEnrollment($course, $enrollment);

        $enrollment->update([
            'status' => 'active',
            'enrolled_at' => now(),
        ]);

        return back()->with('success', 'Mahasiswa berhasil disetujui.');
    }

    public function reject(Course $course, Enrollment $enrollment): RedirectResponse
    {
        $this->authorizeEnrollment($course, $enrollment);

        $enrollment->update([
            'status' => 'rejected',
            'enrolled_at' => null,
        ]);

        return back()->with('success', 'Pengajuan mahasiswa ditolak.');
    }

    private function authorizeEnrollment(Course $course, Enrollment $enrollment): void
    {
        abort_unless($enrollment->course_id === $course->id, 404);
        Gate::authorize('manageEnrollments', $course);
    }
}
