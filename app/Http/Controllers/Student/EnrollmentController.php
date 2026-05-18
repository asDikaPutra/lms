<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Notifications\EnrollmentRequestedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'enroll_code' => ['required', 'string', 'max:50'],
        ]);

        $course = Course::query()
            ->where('enroll_code', strtoupper(trim($validated['enroll_code'])))
            ->where('is_active', true)
            ->first();

        if (! $course) {
            return back()->withErrors(['enroll_code' => 'Kode enroll tidak ditemukan atau kursus tidak aktif.']);
        }

        $status = $course->enrollment_type === 'auto' ? 'active' : 'pending';

        $enrollment = Enrollment::query()->firstOrNew([
            'user_id' => $request->user()->id,
            'course_id' => $course->id,
        ]);

        if ($enrollment->exists && $enrollment->status === 'active') {
            return back()->with('warning', 'Anda sudah terdaftar di kursus ini.');
        }

        if ($enrollment->exists && $enrollment->status === 'pending') {
            return back()->with('warning', 'Pengajuan Anda masih menunggu persetujuan dosen.');
        }

        $enrollment->fill([
            'status' => $status,
            'enrolled_at' => $status === 'active' ? now() : null,
            'completed_at' => null,
        ])->save();

        // Notify instructor if manual enrollment
        if ($status === 'pending') {
            $course->instructor->notify(new EnrollmentRequestedNotification($enrollment));
        }

        return back()->with('success', $status === 'active'
            ? 'Anda berhasil masuk ke kursus.'
            : 'Pengajuan enroll dikirim dan menunggu persetujuan dosen.');
    }
}
