<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreCourseRequest;
use App\Http\Requests\Instructor\UpdateCourseRequest;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);

        return Inertia::render('Instructor/Courses/Index', [
            'courses' => Course::query()
                ->where('instructor_id', $request->user()->id)
                ->withCount([
                    'modules',
                    'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
                    'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
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
        ]);
    }

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        Course::query()->create([
            ...$request->validated(),
            'instructor_id' => $request->user()->id,
            'is_active' => true,
        ]);

        return back()->with('success', 'Kursus berhasil dibuat.');
    }

    public function show(Course $course): Response
    {
        Gate::authorize('update', $course);

        return Inertia::render('Instructor/Courses/Show', [
            'course' => $course->load([
                'modules.materials.contents',
                'modules.materials.discussions' => fn ($query) => $query->whereNull('parent_id')->with(['user:id,name', 'replies.user:id,name'])->oldest(),
                'modules.quizzes.questions',
                'modules.materials.quizzes.questions',
                'modules.assignments',
                'modules.materials.assignments',
                'enrollments' => fn ($query) => $query->with('user:id,name,email,nim')->latest(),
            ])->loadCount([
                'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
                'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
            ]),
        ]);
    }

    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        $course->update($request->validated());

        return back()->with('success', 'Kursus berhasil diperbarui.');
    }

    public function regenerateCode(Course $course): RedirectResponse
    {
        Gate::authorize('update', $course);

        do {
            $code = strtoupper(Str::random(8));
        } while (Course::query()->where('enroll_code', $code)->exists());

        $course->update(['enroll_code' => $code]);

        return back()->with('success', 'Kode enroll berhasil dibuat ulang.');
    }

    public function toggle(Course $course): RedirectResponse
    {
        Gate::authorize('update', $course);

        $course->update(['is_active' => ! $course->is_active]);

        return back()->with('success', $course->is_active ? 'Kursus diaktifkan.' : 'Kursus diarsipkan.');
    }
}
