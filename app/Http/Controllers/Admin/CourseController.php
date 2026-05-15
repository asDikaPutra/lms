<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);

        return Inertia::render('Admin/Courses/Index', [
            'courses' => Course::query()
                ->with('instructor:id,name,email')
                ->withCount([
                    'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
                    'modules',
                ])
                ->when($filters['search'] ?? null, function ($query, string $search): void {
                    $query->where(function ($query) use ($search): void {
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%")
                            ->orWhere('semester', 'like', "%{$search}%");
                    });
                })
                ->when(($filters['status'] ?? null) !== null && ($filters['status'] ?? '') !== '', fn ($query) => $query->where('is_active', $filters['status'] === 'active'))
                ->latest()
                ->paginate(10)
                ->withQueryString(),
            'filters' => $filters,
            'instructors' => User::query()
                ->where('role', 'instructor')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
        ]);
    }

    public function update(Request $request, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'instructor_id' => ['required', 'exists:users,id'],
            'semester' => ['nullable', 'string', 'max:255'],
            'leaderboard_enabled' => ['boolean'],
        ]);

        $course->update($validated);

        return back()->with('success', 'Kursus berhasil diperbarui.');
    }

    public function toggle(Course $course): RedirectResponse
    {
        $course->update(['is_active' => ! $course->is_active]);

        return back()->with('success', $course->is_active ? 'Kursus diaktifkan.' : 'Kursus diarsipkan.');
    }

    public function export(): StreamedResponse
    {
        return response()->streamDownload(function (): void {
            $output = fopen('php://output', 'w');
            fputcsv($output, ['code', 'name', 'instructor', 'semester', 'active_enrollments', 'is_active']);

            Course::query()
                ->with('instructor:id,name')
                ->withCount(['enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active')])
                ->orderBy('code')
                ->chunkById(100, function ($courses) use ($output): void {
                    foreach ($courses as $course) {
                        fputcsv($output, [
                            $course->code,
                            $course->name,
                            $course->instructor?->name,
                            $course->semester,
                            $course->active_enrollments_count,
                            $course->is_active ? 'active' : 'archived',
                        ]);
                    }
                });

            fclose($output);
        }, 'lms-course-report.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
