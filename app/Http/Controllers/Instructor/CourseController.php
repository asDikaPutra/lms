<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreCourseRequest;
use App\Http\Requests\Instructor\UpdateCourseRequest;
use App\Http\Requests\Instructor\UpdateCourseSettingsRequest;
use App\Models\Assignment;
use App\Models\Course;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Submission;
use App\Services\CourseAnalyticsService;
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
                ->paginate(12)
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

    /**
     * Show course overview (ringkasan kursus)
     */
    public function show(Course $course): Response
    {
        Gate::authorize('update', $course);

        return Inertia::render('Instructor/Courses/Overview', [
            'course' => $course->load([
                'modules.materials.contents',
                'modules.materials.discussions' => fn ($query) => $query->whereNull('parent_id')->with(['user:id,name', 'replies.user:id,name'])->oldest(),
                'modules.quizzes.questions',
                'modules.materials.quizzes.questions',
                'modules.assignments',
                'modules.materials.assignments',
                'enrollments' => fn ($query) => $query->with('user:id,name,email,nim')->latest(),
            ])->loadCount([
                'modules',
                'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
                'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
            ]),
        ]);
    }

    /**
     * Show course curriculum builder
     */
    public function curriculum(Course $course): Response
    {
        Gate::authorize('update', $course);

        return Inertia::render('Instructor/Courses/Curriculum', [
            'course' => $course->load([
                'modules.materials.contents',
                'modules.materials.discussions' => fn ($query) => $query->whereNull('parent_id')->with(['user:id,name', 'replies.user:id,name'])->oldest(),
                'modules.quizzes.questions',
                'modules.materials.quizzes.questions',
                'modules.assignments',
                'modules.materials.assignments',
                'enrollments' => fn ($query) => $query->with('user:id,name,email,nim')->latest(),
            ])->loadCount([
                'modules',
                'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
                'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
            ]),
        ]);
    }

    /**
     * Show course assignments page
     */
    public function assignments(Request $request, Course $course): Response
    {
        Gate::authorize('update', $course);

        $filters = $request->only(['search', 'status', 'module_id']);

        $moduleIds = $course->modules()->pluck('id');
        $materialIds = Material::whereIn('module_id', $moduleIds)->pluck('id');

        // Get all assignments from modules AND materials in this course
        $assignments = Assignment::query()
            ->where(function ($q) use ($moduleIds, $materialIds) {
                // Module-level assignments
                $q->where(function ($q2) use ($moduleIds) {
                    $q2->where('assignable_type', 'module')
                        ->whereIn('assignable_id', $moduleIds);
                })->orWhere(function ($q2) use ($moduleIds) {
                    $q2->where('assignable_type', 'App\\Models\\Module')
                        ->whereIn('assignable_id', $moduleIds);
                })
                // Material-level assignments
                    ->orWhere(function ($q2) use ($materialIds) {
                        $q2->where('assignable_type', 'material')
                            ->whereIn('assignable_id', $materialIds);
                    })->orWhere(function ($q2) use ($materialIds) {
                        $q2->where('assignable_type', 'App\\Models\\Material')
                            ->whereIn('assignable_id', $materialIds);
                    });
            })
            ->with(['assignable'])
            ->withCount([
                'submissions',
                'submissions as pending_submissions_count' => fn ($q) => $q->whereNull('grade'),
            ])
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->when($filters['status'] ?? null, function ($q, $status) {
                if ($status === 'published') {
                    $q->where('is_published', true);
                } elseif ($status === 'draft') {
                    $q->where('is_published', false);
                } elseif ($status === 'needs_grading') {
                    $q->whereHas('submissions', fn ($sq) => $sq->whereNull('grade'));
                }
            })
            ->when($filters['module_id'] ?? null, function ($q, $moduleId) {
                // Filter by module - include both module-level and material-level assignments
                $materialIds = Material::where('module_id', $moduleId)->pluck('id');
                $q->where(function ($q2) use ($moduleId, $materialIds) {
                    $q2->where(function ($q3) use ($moduleId) {
                        $q3->whereIn('assignable_type', ['module', 'App\\Models\\Module'])
                            ->where('assignable_id', $moduleId);
                    })->orWhere(function ($q3) use ($materialIds) {
                        $q3->whereIn('assignable_type', ['material', 'App\\Models\\Material'])
                            ->whereIn('assignable_id', $materialIds);
                    });
                });
            })
            ->latest()
            ->get();

        // Calculate stats
        $totalAssignments = $assignments->count();
        $publishedCount = $assignments->where('is_published', true)->count();
        $draftCount = $assignments->where('is_published', false)->count();
        $needsGradingCount = $assignments->sum('pending_submissions_count');

        // Load modules with their materials for the form dropdown
        $courseWithModulesAndMaterials = $course->load(['modules.materials:id,module_id,title'])->loadCount([
            'modules',
            'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
            'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
        ]);

        return Inertia::render('Instructor/Courses/Assignments', [
            'course' => $courseWithModulesAndMaterials,
            'assignments' => $assignments,
            'stats' => [
                'total' => $totalAssignments,
                'published' => $publishedCount,
                'draft' => $draftCount,
                'needs_grading' => $needsGradingCount,
            ],
            'filters' => $filters,
        ]);
    }

    /**
     * Show course quizzes page
     */
    public function quizzes(Request $request, Course $course): Response
    {
        Gate::authorize('update', $course);

        $filters = $request->only(['search', 'status', 'module_id']);

        $moduleIds = $course->modules()->pluck('id');
        $materialIds = Material::whereIn('module_id', $moduleIds)->pluck('id');

        // Get all quizzes from modules AND materials in this course
        $quizzes = Quiz::query()
            ->where(function ($q) use ($moduleIds, $materialIds) {
                $q->where(function ($q2) use ($moduleIds) {
                    $q2->where('quizzable_type', 'module')
                        ->whereIn('quizzable_id', $moduleIds);
                })->orWhere(function ($q2) use ($moduleIds) {
                    $q2->where('quizzable_type', 'App\\Models\\Module')
                        ->whereIn('quizzable_id', $moduleIds);
                })->orWhere(function ($q2) use ($materialIds) {
                    $q2->where('quizzable_type', 'material')
                        ->whereIn('quizzable_id', $materialIds);
                })->orWhere(function ($q2) use ($materialIds) {
                    $q2->where('quizzable_type', 'App\\Models\\Material')
                        ->whereIn('quizzable_id', $materialIds);
                });
            })
            ->with(['quizzable', 'questions'])
            ->withCount([
                'attempts',
                'attempts as completed_attempts_count' => fn ($q) => $q->whereNotNull('finished_at'),
            ])
            ->withAvg('attempts', 'score')
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->when($filters['status'] ?? null, function ($q, $status) {
                if ($status === 'published') {
                    $q->where('is_published', true);
                } elseif ($status === 'draft') {
                    $q->where('is_published', false);
                }
            })
            ->when($filters['module_id'] ?? null, function ($q, $moduleId) {
                $materialIds = Material::where('module_id', $moduleId)->pluck('id');
                $q->where(function ($q2) use ($moduleId, $materialIds) {
                    $q2->where(function ($q3) use ($moduleId) {
                        $q3->whereIn('quizzable_type', ['module', 'App\\Models\\Module'])
                            ->where('quizzable_id', $moduleId);
                    })->orWhere(function ($q3) use ($materialIds) {
                        $q3->whereIn('quizzable_type', ['material', 'App\\Models\\Material'])
                            ->whereIn('quizzable_id', $materialIds);
                    });
                });
            })
            ->latest()
            ->get();

        // Calculate stats
        $totalQuizzes = $quizzes->count();
        $publishedCount = $quizzes->where('is_published', true)->count();
        $draftCount = $quizzes->where('is_published', false)->count();
        $avgScore = $quizzes->avg('attempts_avg_score');

        $courseWithModules = $course->load(['modules.materials:id,module_id,title'])->loadCount([
            'modules',
            'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
            'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
        ]);

        return Inertia::render('Instructor/Courses/Quizzes', [
            'course' => $courseWithModules,
            'quizzes' => $quizzes,
            'stats' => [
                'total' => $totalQuizzes,
                'published' => $publishedCount,
                'draft' => $draftCount,
                'avg_score' => round($avgScore ?? 0),
            ],
            'filters' => $filters,
        ]);
    }

    /**
     * Show course discussions page
     */
    public function discussions(Request $request, Course $course): Response
    {
        Gate::authorize('update', $course);

        $filters = $request->only(['search', 'status', 'module_id']);

        // Get all materials in this course
        $moduleIds = $course->modules()->pluck('id');
        $materials = Material::whereIn('module_id', $moduleIds)
            ->with(['module:id,title'])
            ->withCount([
                'discussions as total_posts' => fn ($q) => $q->whereNull('parent_id'),
                'discussions as total_comments',
                'discussions as new_comments' => fn ($q) => $q->where('created_at', '>=', now()->subDays(7)),
            ])
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->when($filters['module_id'] ?? null, fn ($q, $moduleId) => $q->where('module_id', $moduleId))
            ->latest()
            ->get();

        // Calculate stats
        $totalDiscussions = $materials->count();
        $activeDiscussions = $materials->where('total_posts', '>', 0)->count();
        $totalNewComments = $materials->sum('new_comments');

        $courseWithModules = $course->load(['modules:id,course_id,title'])->loadCount([
            'modules',
            'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
            'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
        ]);

        return Inertia::render('Instructor/Courses/Discussions', [
            'course' => $courseWithModules,
            'discussions' => $materials,
            'stats' => [
                'total' => $totalDiscussions,
                'active' => $activeDiscussions,
                'new_comments' => $totalNewComments,
            ],
            'filters' => $filters,
        ]);
    }

    /**
     * Show course students page
     */
    public function students(Request $request, Course $course, CourseAnalyticsService $analytics): Response
    {
        Gate::authorize('update', $course);

        $filters = $request->only(['search', 'status']);

        $overview = $analytics->studentsOverview($course, $filters);

        $courseData = $course->loadCount([
            'modules',
            'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
            'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
        ]);

        return Inertia::render('Instructor/Courses/Students', [
            'course' => $courseData,
            'enrollments' => $overview['enrollments'],
            'stats' => $overview['stats'],
            'filters' => $filters,
        ]);
    }

    /**
     * Show course grades page
     */
    public function grades(Request $request, Course $course, CourseAnalyticsService $analytics): Response
    {
        Gate::authorize('update', $course);

        $tab = $request->get('tab', 'gradebook');

        $result = $analytics->gradebook($course);

        $courseData = $course->loadCount([
            'modules',
            'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
            'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
        ]);

        return Inertia::render('Instructor/Courses/Grades', [
            'course' => $courseData,
            'gradebook' => $result['gradebook'],
            'needsGrading' => $result['needsGrading'],
            'stats' => $result['stats'],
            'tab' => $tab,
        ]);
    }

    /**
     * Show course progress page
     */
    public function progress(Request $request, Course $course, CourseAnalyticsService $analytics): Response
    {
        Gate::authorize('update', $course);

        $tab = $request->get('tab', 'students');

        $result = $analytics->progressOverview($course);

        $courseData = $course->loadCount([
            'modules',
            'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
            'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
        ]);

        return Inertia::render('Instructor/Courses/Progress', [
            'course' => $courseData,
            'studentProgress' => $result['studentProgress'],
            'moduleProgress' => $result['moduleProgress'],
            'stats' => $result['stats'],
            'tab' => $tab,
        ]);
    }

    /**
     * Show course settings page
     */
    public function settings(Course $course): Response
    {
        Gate::authorize('update', $course);

        $courseData = $course->loadCount([
            'modules',
            'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
            'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
        ]);

        // Get stats for danger zone warnings
        $stats = [
            'modules_count' => $course->modules()->count(),
            'materials_count' => Material::whereIn('module_id', $course->modules()->pluck('id'))->count(),
            'assignments_count' => Assignment::where(function ($q) use ($course) {
                $moduleIds = $course->modules()->pluck('id');
                $materialIds = Material::whereIn('module_id', $moduleIds)->pluck('id');
                $q->whereIn('assignable_type', ['module', 'App\\Models\\Module'])->whereIn('assignable_id', $moduleIds)
                    ->orWhere(fn ($q2) => $q2->whereIn('assignable_type', ['material', 'App\\Models\\Material'])->whereIn('assignable_id', $materialIds));
            })->count(),
            'quizzes_count' => Quiz::where(function ($q) use ($course) {
                $moduleIds = $course->modules()->pluck('id');
                $materialIds = Material::whereIn('module_id', $moduleIds)->pluck('id');
                $q->whereIn('quizzable_type', ['module', 'App\\Models\\Module'])->whereIn('quizzable_id', $moduleIds)
                    ->orWhere(fn ($q2) => $q2->whereIn('quizzable_type', ['material', 'App\\Models\\Material'])->whereIn('quizzable_id', $materialIds));
            })->count(),
            'submissions_count' => Submission::whereHas('assignment', function ($q) use ($course) {
                $moduleIds = $course->modules()->pluck('id');
                $materialIds = Material::whereIn('module_id', $moduleIds)->pluck('id');
                $q->whereIn('assignable_type', ['module', 'App\\Models\\Module'])->whereIn('assignable_id', $moduleIds)
                    ->orWhere(fn ($q2) => $q2->whereIn('assignable_type', ['material', 'App\\Models\\Material'])->whereIn('assignable_id', $materialIds));
            })->count(),
            'quiz_attempts_count' => QuizAttempt::whereHas('quiz', function ($q) use ($course) {
                $moduleIds = $course->modules()->pluck('id');
                $materialIds = Material::whereIn('module_id', $moduleIds)->pluck('id');
                $q->whereIn('quizzable_type', ['module', 'App\\Models\\Module'])->whereIn('quizzable_id', $moduleIds)
                    ->orWhere(fn ($q2) => $q2->whereIn('quizzable_type', ['material', 'App\\Models\\Material'])->whereIn('quizzable_id', $materialIds));
            })->count(),
        ];

        return Inertia::render('Instructor/Courses/Settings', [
            'course' => $courseData,
            'settings' => $course->getMergedSettings(),
            'stats' => $stats,
        ]);
    }

    /**
     * Update course settings
     */
    public function updateSettings(UpdateCourseSettingsRequest $request, Course $course): RedirectResponse
    {
        $validated = $request->validated();

        // Merge settings with existing
        if (isset($validated['settings'])) {
            $currentSettings = $course->settings ?? [];
            $validated['settings'] = array_replace_recursive($currentSettings, $validated['settings']);
        }

        // Update is_active based on status for backward compatibility
        if (isset($validated['status'])) {
            $validated['is_active'] = in_array($validated['status'], ['active', 'closed']);
        }

        $course->update($validated);

        return back()->with('success', 'Pengaturan kursus berhasil disimpan.');
    }

    /**
     * Archive course
     */
    public function archive(Course $course): RedirectResponse
    {
        Gate::authorize('update', $course);

        $course->update([
            'status' => 'archived',
            'is_active' => false,
        ]);

        return back()->with('success', 'Kursus berhasil diarsipkan.');
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

    public function destroy(Course $course): RedirectResponse
    {
        Gate::authorize('delete', $course);

        if ($course->enrollments()->where('status', 'active')->exists()) {
            return back()->with('error', 'Tidak dapat menghapus kursus yang memiliki enrollment aktif.')
                ->setStatusCode(409);
        }

        $course->delete();

        return redirect()->route('instructor.courses.index')
            ->with('success', 'Kursus berhasil dihapus.');
    }
}
