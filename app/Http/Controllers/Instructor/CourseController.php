<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreCourseRequest;
use App\Http\Requests\Instructor\UpdateCourseRequest;
use App\Models\Assignment;
use App\Models\Content;
use App\Models\ContentProgress;
use App\Models\Course;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Submission;
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
        $materialIds = \App\Models\Material::whereIn('module_id', $moduleIds)->pluck('id');

        // Get all assignments from modules AND materials in this course
        $assignments = \App\Models\Assignment::query()
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
                $materialIds = \App\Models\Material::where('module_id', $moduleId)->pluck('id');
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
        $materialIds = \App\Models\Material::whereIn('module_id', $moduleIds)->pluck('id');

        // Get all quizzes from modules AND materials in this course
        $quizzes = \App\Models\Quiz::query()
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
                $materialIds = \App\Models\Material::where('module_id', $moduleId)->pluck('id');
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
        $materials = \App\Models\Material::whereIn('module_id', $moduleIds)
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
    public function students(Request $request, Course $course): Response
    {
        Gate::authorize('update', $course);

        $filters = $request->only(['search', 'status']);

        // Get enrollments with user data and progress
        $enrollments = $course->enrollments()
            ->with(['user:id,name,email,nim'])
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->whereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('nim', 'like', "%{$search}%"));
            })
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->get();

        // Get module and content counts for progress calculation
        $moduleIds = $course->modules()->pluck('id');
        $totalContents = \App\Models\Content::whereHas('material', fn ($q) => $q->whereIn('module_id', $moduleIds))->count();
        $totalAssignments = \App\Models\Assignment::where(function ($q) use ($moduleIds) {
            $materialIds = \App\Models\Material::whereIn('module_id', $moduleIds)->pluck('id');
            $q->whereIn('assignable_type', ['module', 'App\\Models\\Module'])->whereIn('assignable_id', $moduleIds)
              ->orWhere(fn ($q2) => $q2->whereIn('assignable_type', ['material', 'App\\Models\\Material'])->whereIn('assignable_id', $materialIds));
        })->where('is_published', true)->count();
        $totalQuizzes = \App\Models\Quiz::where(function ($q) use ($moduleIds) {
            $materialIds = \App\Models\Material::whereIn('module_id', $moduleIds)->pluck('id');
            $q->whereIn('quizzable_type', ['module', 'App\\Models\\Module'])->whereIn('quizzable_id', $moduleIds)
              ->orWhere(fn ($q2) => $q2->whereIn('quizzable_type', ['material', 'App\\Models\\Material'])->whereIn('quizzable_id', $materialIds));
        })->where('is_published', true)->count();

        // Enrich enrollments with progress data
        $enrichedEnrollments = $enrollments->map(function ($enrollment) use ($moduleIds, $totalContents, $totalAssignments, $totalQuizzes) {
            $userId = $enrollment->user_id;
            
            // Content progress
            $completedContents = \App\Models\ContentProgress::where('user_id', $userId)
                ->whereHas('content.material', fn ($q) => $q->whereIn('module_id', $moduleIds))
                ->whereNotNull('completed_at')
                ->count();
            
            // Submissions count
            $submittedAssignments = \App\Models\Submission::where('user_id', $userId)
                ->whereHas('assignment', function ($q) use ($moduleIds) {
                    $materialIds = \App\Models\Material::whereIn('module_id', $moduleIds)->pluck('id');
                    $q->where(function ($q2) use ($moduleIds, $materialIds) {
                        $q2->whereIn('assignable_type', ['module', 'App\\Models\\Module'])->whereIn('assignable_id', $moduleIds)
                           ->orWhere(fn ($q3) => $q3->whereIn('assignable_type', ['material', 'App\\Models\\Material'])->whereIn('assignable_id', $materialIds));
                    });
                })->count();
            
            // Quiz attempts count
            $completedQuizzes = \App\Models\QuizAttempt::where('user_id', $userId)
                ->whereNotNull('finished_at')
                ->whereHas('quiz', function ($q) use ($moduleIds) {
                    $materialIds = \App\Models\Material::whereIn('module_id', $moduleIds)->pluck('id');
                    $q->where(function ($q2) use ($moduleIds, $materialIds) {
                        $q2->whereIn('quizzable_type', ['module', 'App\\Models\\Module'])->whereIn('quizzable_id', $moduleIds)
                           ->orWhere(fn ($q3) => $q3->whereIn('quizzable_type', ['material', 'App\\Models\\Material'])->whereIn('quizzable_id', $materialIds));
                    });
                })->distinct('quiz_id')->count('quiz_id');

            // Calculate progress
            $totalItems = $totalContents + $totalAssignments + $totalQuizzes;
            $completedItems = $completedContents + $submittedAssignments + $completedQuizzes;
            $progress = $totalItems > 0 ? round(($completedItems / $totalItems) * 100) : 0;

            $enrollment->progress = $progress;
            $enrollment->completed_contents = $completedContents;
            $enrollment->total_contents = $totalContents;
            $enrollment->submitted_assignments = $submittedAssignments;
            $enrollment->total_assignments = $totalAssignments;
            $enrollment->completed_quizzes = $completedQuizzes;
            $enrollment->total_quizzes = $totalQuizzes;
            $enrollment->is_at_risk = $progress < 30 && $enrollment->status === 'active';

            return $enrollment;
        });

        // Calculate stats
        $activeCount = $enrichedEnrollments->where('status', 'active')->count();
        $pendingCount = $enrichedEnrollments->where('status', 'pending')->count();
        $atRiskCount = $enrichedEnrollments->where('is_at_risk', true)->count();
        $avgProgress = $enrichedEnrollments->where('status', 'active')->avg('progress') ?? 0;

        $courseData = $course->loadCount([
            'modules',
            'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
            'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
        ]);

        return Inertia::render('Instructor/Courses/Students', [
            'course' => $courseData,
            'enrollments' => $enrichedEnrollments,
            'stats' => [
                'total' => $enrichedEnrollments->count(),
                'active' => $activeCount,
                'pending' => $pendingCount,
                'at_risk' => $atRiskCount,
                'avg_progress' => round($avgProgress),
            ],
            'filters' => $filters,
        ]);
    }

    /**
     * Show course grades page
     */
    public function grades(Request $request, Course $course): Response
    {
        Gate::authorize('update', $course);

        $tab = $request->get('tab', 'gradebook');

        $moduleIds = $course->modules()->pluck('id');
        $materialIds = \App\Models\Material::whereIn('module_id', $moduleIds)->pluck('id');

        // Get active enrollments
        $enrollments = $course->enrollments()
            ->where('status', 'active')
            ->with(['user:id,name,email,nim'])
            ->get();

        // Get all assignments and quizzes for this course
        $assignments = \App\Models\Assignment::where(function ($q) use ($moduleIds, $materialIds) {
            $q->whereIn('assignable_type', ['module', 'App\\Models\\Module'])->whereIn('assignable_id', $moduleIds)
              ->orWhere(fn ($q2) => $q2->whereIn('assignable_type', ['material', 'App\\Models\\Material'])->whereIn('assignable_id', $materialIds));
        })->where('is_published', true)->get();

        $quizzes = \App\Models\Quiz::where(function ($q) use ($moduleIds, $materialIds) {
            $q->whereIn('quizzable_type', ['module', 'App\\Models\\Module'])->whereIn('quizzable_id', $moduleIds)
              ->orWhere(fn ($q2) => $q2->whereIn('quizzable_type', ['material', 'App\\Models\\Material'])->whereIn('quizzable_id', $materialIds));
        })->where('is_published', true)->get();

        // Build gradebook data
        $gradebook = $enrollments->map(function ($enrollment) use ($assignments, $quizzes) {
            $userId = $enrollment->user_id;

            // Get assignment grades
            $submissions = \App\Models\Submission::where('user_id', $userId)
                ->whereIn('assignment_id', $assignments->pluck('id'))
                ->get()
                ->keyBy('assignment_id');

            $assignmentGrades = $assignments->map(fn ($a) => $submissions->get($a->id)?->grade)->filter()->values();
            $avgAssignment = $assignmentGrades->count() > 0 ? $assignmentGrades->avg() : null;

            // Get quiz grades
            $attempts = \App\Models\QuizAttempt::where('user_id', $userId)
                ->whereIn('quiz_id', $quizzes->pluck('id'))
                ->whereNotNull('finished_at')
                ->get()
                ->groupBy('quiz_id')
                ->map(fn ($group) => $group->max('score'));

            $avgQuiz = $attempts->count() > 0 ? $attempts->avg() : null;

            // Calculate final grade (simple average for now)
            $grades = collect([$avgAssignment, $avgQuiz])->filter();
            $finalGrade = $grades->count() > 0 ? $grades->avg() : null;

            return [
                'user' => $enrollment->user,
                'enrollment_id' => $enrollment->id,
                'assignment_avg' => $avgAssignment ? round($avgAssignment) : null,
                'quiz_avg' => $avgQuiz ? round($avgQuiz) : null,
                'final_grade' => $finalGrade ? round($finalGrade) : null,
                'is_complete' => $avgAssignment !== null && $avgQuiz !== null,
            ];
        });

        // Get items needing grading
        $needsGrading = \App\Models\Submission::whereIn('assignment_id', $assignments->pluck('id'))
            ->whereNull('grade')
            ->with(['user:id,name', 'assignment:id,title'])
            ->latest('submitted_at')
            ->get();

        // Calculate stats
        $grades = $gradebook->pluck('final_grade')->filter();
        $avgGrade = $grades->count() > 0 ? round($grades->avg()) : 0;
        $highestGrade = $grades->count() > 0 ? round($grades->max()) : 0;
        $lowestGrade = $grades->count() > 0 ? round($grades->min()) : 0;
        $incompleteCount = $gradebook->where('is_complete', false)->count();

        $courseData = $course->loadCount([
            'modules',
            'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
            'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
        ]);

        return Inertia::render('Instructor/Courses/Grades', [
            'course' => $courseData,
            'gradebook' => $gradebook,
            'needsGrading' => $needsGrading,
            'stats' => [
                'avg_grade' => $avgGrade,
                'highest' => $highestGrade,
                'lowest' => $lowestGrade,
                'incomplete' => $incompleteCount,
                'needs_grading' => $needsGrading->count(),
            ],
            'tab' => $tab,
        ]);
    }

    /**
     * Show course progress page
     */
    public function progress(Request $request, Course $course): Response
    {
        Gate::authorize('update', $course);

        $tab = $request->get('tab', 'students');

        $moduleIds = $course->modules()->pluck('id');
        $materialIds = \App\Models\Material::whereIn('module_id', $moduleIds)->pluck('id');

        // Get modules with progress data
        $modules = $course->modules()->with(['materials.contents'])->get();

        // Get active enrollments
        $enrollments = $course->enrollments()
            ->where('status', 'active')
            ->with(['user:id,name,email,nim'])
            ->get();

        $totalStudents = $enrollments->count();

        // Calculate totals
        $totalContents = \App\Models\Content::whereIn('material_id', $materialIds)->count();
        $totalAssignments = \App\Models\Assignment::where(function ($q) use ($moduleIds, $materialIds) {
            $q->whereIn('assignable_type', ['module', 'App\\Models\\Module'])->whereIn('assignable_id', $moduleIds)
              ->orWhere(fn ($q2) => $q2->whereIn('assignable_type', ['material', 'App\\Models\\Material'])->whereIn('assignable_id', $materialIds));
        })->where('is_published', true)->count();
        $totalQuizzes = \App\Models\Quiz::where(function ($q) use ($moduleIds, $materialIds) {
            $q->whereIn('quizzable_type', ['module', 'App\\Models\\Module'])->whereIn('quizzable_id', $moduleIds)
              ->orWhere(fn ($q2) => $q2->whereIn('quizzable_type', ['material', 'App\\Models\\Material'])->whereIn('quizzable_id', $materialIds));
        })->where('is_published', true)->count();

        // Student progress data
        $studentProgress = $enrollments->map(function ($enrollment) use ($moduleIds, $materialIds, $modules, $totalContents, $totalAssignments, $totalQuizzes) {
            $userId = $enrollment->user_id;

            $completedContents = \App\Models\ContentProgress::where('user_id', $userId)
                ->whereIn('content_id', \App\Models\Content::whereIn('material_id', $materialIds)->pluck('id'))
                ->whereNotNull('completed_at')
                ->count();

            $submittedAssignments = \App\Models\Submission::where('user_id', $userId)
                ->whereHas('assignment', function ($q) use ($moduleIds, $materialIds) {
                    $q->where(function ($q2) use ($moduleIds, $materialIds) {
                        $q2->whereIn('assignable_type', ['module', 'App\\Models\\Module'])->whereIn('assignable_id', $moduleIds)
                           ->orWhere(fn ($q3) => $q3->whereIn('assignable_type', ['material', 'App\\Models\\Material'])->whereIn('assignable_id', $materialIds));
                    });
                })->count();

            $completedQuizzes = \App\Models\QuizAttempt::where('user_id', $userId)
                ->whereNotNull('finished_at')
                ->whereHas('quiz', function ($q) use ($moduleIds, $materialIds) {
                    $q->where(function ($q2) use ($moduleIds, $materialIds) {
                        $q2->whereIn('quizzable_type', ['module', 'App\\Models\\Module'])->whereIn('quizzable_id', $moduleIds)
                           ->orWhere(fn ($q3) => $q3->whereIn('quizzable_type', ['material', 'App\\Models\\Material'])->whereIn('quizzable_id', $materialIds));
                    });
                })->distinct('quiz_id')->count('quiz_id');

            // Modules completed
            $modulesCompleted = 0;
            foreach ($modules as $module) {
                $moduleContentIds = $module->materials->flatMap(fn ($m) => $m->contents->pluck('id'));
                $moduleCompletedContents = \App\Models\ContentProgress::where('user_id', $userId)
                    ->whereIn('content_id', $moduleContentIds)
                    ->whereNotNull('completed_at')
                    ->count();
                if ($moduleContentIds->count() > 0 && $moduleCompletedContents >= $moduleContentIds->count()) {
                    $modulesCompleted++;
                }
            }

            $totalItems = $totalContents + $totalAssignments + $totalQuizzes;
            $completedItems = $completedContents + $submittedAssignments + $completedQuizzes;
            $progress = $totalItems > 0 ? round(($completedItems / $totalItems) * 100) : 0;

            // Last activity
            $lastActivity = \App\Models\ContentProgress::where('user_id', $userId)
                ->whereIn('content_id', \App\Models\Content::whereIn('material_id', $materialIds)->pluck('id'))
                ->latest('updated_at')
                ->first();

            return [
                'user' => $enrollment->user,
                'enrollment_id' => $enrollment->id,
                'progress' => $progress,
                'modules_completed' => $modulesCompleted,
                'total_modules' => $modules->count(),
                'assignments_submitted' => $submittedAssignments,
                'total_assignments' => $totalAssignments,
                'quizzes_completed' => $completedQuizzes,
                'total_quizzes' => $totalQuizzes,
                'last_activity' => $lastActivity?->updated_at,
                'is_at_risk' => $progress < 30,
            ];
        });

        // Module progress data
        $moduleProgress = $modules->map(function ($module) use ($totalStudents, $moduleIds, $materialIds) {
            $moduleContentIds = $module->materials->flatMap(fn ($m) => $m->contents->pluck('id'));
            $moduleMaterialIds = $module->materials->pluck('id');

            $contentCompletions = $moduleContentIds->count() > 0
                ? \App\Models\ContentProgress::whereIn('content_id', $moduleContentIds)->whereNotNull('completed_at')->count()
                : 0;

            $assignmentSubmissions = \App\Models\Submission::whereHas('assignment', function ($q) use ($module, $moduleMaterialIds) {
                $q->where(function ($q2) use ($module, $moduleMaterialIds) {
                    $q2->whereIn('assignable_type', ['module', 'App\\Models\\Module'])->where('assignable_id', $module->id)
                       ->orWhere(fn ($q3) => $q3->whereIn('assignable_type', ['material', 'App\\Models\\Material'])->whereIn('assignable_id', $moduleMaterialIds));
                });
            })->count();

            $quizCompletions = \App\Models\QuizAttempt::whereNotNull('finished_at')
                ->whereHas('quiz', function ($q) use ($module, $moduleMaterialIds) {
                    $q->where(function ($q2) use ($module, $moduleMaterialIds) {
                        $q2->whereIn('quizzable_type', ['module', 'App\\Models\\Module'])->where('quizzable_id', $module->id)
                           ->orWhere(fn ($q3) => $q3->whereIn('quizzable_type', ['material', 'App\\Models\\Material'])->whereIn('quizzable_id', $moduleMaterialIds));
                    });
                })->count();

            $maxContentCompletions = $moduleContentIds->count() * $totalStudents;
            $avgProgress = $maxContentCompletions > 0 ? round(($contentCompletions / $maxContentCompletions) * 100) : 0;

            return [
                'id' => $module->id,
                'title' => $module->title,
                'order' => $module->order,
                'content_completions' => $contentCompletions,
                'max_content_completions' => $maxContentCompletions,
                'assignment_submissions' => $assignmentSubmissions,
                'quiz_completions' => $quizCompletions,
                'avg_progress' => $avgProgress,
            ];
        });

        // Calculate stats
        $avgProgress = $studentProgress->avg('progress') ?? 0;
        $atRiskCount = $studentProgress->where('is_at_risk', true)->count();
        $mostCompletedModule = $moduleProgress->sortByDesc('avg_progress')->first();
        $leastCompletedModule = $moduleProgress->sortBy('avg_progress')->first();

        $courseData = $course->loadCount([
            'modules',
            'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
            'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
        ]);

        return Inertia::render('Instructor/Courses/Progress', [
            'course' => $courseData,
            'studentProgress' => $studentProgress,
            'moduleProgress' => $moduleProgress,
            'stats' => [
                'avg_progress' => round($avgProgress),
                'at_risk' => $atRiskCount,
                'most_completed_module' => $mostCompletedModule['title'] ?? null,
                'least_completed_module' => $leastCompletedModule['title'] ?? null,
            ],
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
    public function updateSettings(Request $request, Course $course): RedirectResponse
    {
        Gate::authorize('update', $course);

        $validated = $request->validate([
            // Basic info
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:50|unique:courses,code,' . $course->id,
            'description' => 'nullable|string|max:5000',
            'semester' => 'nullable|string|max:50',

            // Status & Visibility
            'status' => 'sometimes|in:draft,active,closed,archived',
            'is_visible' => 'sometimes|boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'enrollment_type' => 'sometimes|in:auto,manual',

            // Settings sections
            'settings' => 'sometimes|array',
            'settings.learning' => 'sometimes|array',
            'settings.learning.order' => 'sometimes|in:free,sequential',
            'settings.learning.completion_rule' => 'sometimes|in:opened,read_complete,all_items',
            'settings.learning.enable_prerequisites' => 'sometimes|boolean',

            'settings.assignments' => 'sometimes|array',
            'settings.assignments.allow_late_submission' => 'sometimes|boolean',
            'settings.assignments.late_penalty_percent' => 'sometimes|integer|min:0|max:100',
            'settings.assignments.allow_resubmission' => 'sometimes|boolean',
            'settings.assignments.max_attempts' => 'sometimes|integer|min:1|max:10',
            'settings.assignments.default_submission_type' => 'sometimes|in:text,file,link,audio,video',

            'settings.quizzes' => 'sometimes|array',
            'settings.quizzes.default_attempt_limit' => 'sometimes|integer|min:1|max:10',
            'settings.quizzes.default_duration_minutes' => 'sometimes|integer|min:1|max:480',
            'settings.quizzes.shuffle_questions' => 'sometimes|boolean',
            'settings.quizzes.shuffle_options' => 'sometimes|boolean',
            'settings.quizzes.show_answers_after_submit' => 'sometimes|boolean',
            'settings.quizzes.show_score_after_submit' => 'sometimes|boolean',

            'settings.grades' => 'sometimes|array',
            'settings.grades.scale' => 'sometimes|in:0-100,letter',
            'settings.grades.passing_grade' => 'sometimes|integer|min:0|max:100',
            'settings.grades.rounding' => 'sometimes|in:none,one_decimal,integer',
            'settings.grades.weights' => 'sometimes|array',
            'settings.grades.weights.assignments' => 'sometimes|integer|min:0|max:100',
            'settings.grades.weights.quizzes' => 'sometimes|integer|min:0|max:100',
            'settings.grades.weights.discussions' => 'sometimes|integer|min:0|max:100',
            'settings.grades.weights.midterm' => 'sometimes|integer|min:0|max:100',
            'settings.grades.weights.final' => 'sometimes|integer|min:0|max:100',

            'settings.discussions' => 'sometimes|array',
            'settings.discussions.enabled' => 'sometimes|boolean',
            'settings.discussions.moderation_enabled' => 'sometimes|boolean',
            'settings.discussions.allow_student_topics' => 'sometimes|boolean',
            'settings.discussions.allow_anonymous' => 'sometimes|boolean',
            'settings.discussions.min_comments_for_grade' => 'sometimes|integer|min:0|max:50',
            'settings.discussions.show_adab_rules' => 'sometimes|boolean',

            'settings.participants' => 'sometimes|array',
            'settings.participants.enrollment_open' => 'sometimes|boolean',
            'settings.participants.allow_self_unenroll' => 'sometimes|boolean',
            'settings.participants.max_participants' => 'nullable|integer|min:1|max:1000',

            'settings.islamic' => 'sometimes|array',
            'settings.islamic.show_learning_dua' => 'sometimes|boolean',
            'settings.islamic.show_basmallah' => 'sometimes|boolean',
            'settings.islamic.enable_quran_block' => 'sometimes|boolean',
            'settings.islamic.enable_hadith_block' => 'sometimes|boolean',
            'settings.islamic.require_islamic_references' => 'sometimes|boolean',
            'settings.islamic.enable_content_review' => 'sometimes|boolean',
            'settings.islamic.show_adab_discussion' => 'sometimes|boolean',
            'settings.islamic.enable_recitation_submission' => 'sometimes|boolean',

            // Certificate criteria
            'certificate_criteria' => 'sometimes|array',
            'certificate_criteria.min_progress' => 'sometimes|integer|min:0|max:100',
            'certificate_criteria.min_score' => 'sometimes|integer|min:0|max:100',

            // Leaderboard
            'leaderboard_enabled' => 'sometimes|boolean',
        ]);

        // Validate grade weights total if provided
        if (isset($validated['settings']['grades']['weights'])) {
            $weights = $validated['settings']['grades']['weights'];
            $total = array_sum($weights);
            if ($total !== 100) {
                return back()->withErrors(['settings.grades.weights' => 'Total bobot nilai harus 100%. Saat ini: ' . $total . '%']);
            }
        }

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

    /**
     * Get basic course data for placeholder pages
     */
    private function getBasicCourseData(Course $course): Course
    {
        return $course->loadCount([
            'modules',
            'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
            'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
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
