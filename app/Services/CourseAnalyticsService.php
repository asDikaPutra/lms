<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ContentProgress;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\QuizAttempt;
use App\Models\Submission;
use Illuminate\Support\Collection;

/**
 * Computes per-student progress and gradebook figures for a course.
 *
 * All per-student aggregates are batched into a handful of grouped queries
 * (instead of N queries per student) and then read from in-memory maps.
 */
class CourseAnalyticsService
{
    public function __construct(private readonly CourseStructureService $structure) {}

    /**
     * Per-student completion progress, plus aggregate stats. Used by the
     * students page.
     *
     * @return array{
     *     enrollments: Collection<int, Enrollment>,
     *     stats: array{total: int, active: int, pending: int, at_risk: int, avg_progress: int},
     * }
     */
    public function studentsOverview(Course $course, array $filters = []): array
    {
        $enrollments = $course->enrollments()
            ->with(['user:id,name,email,nim'])
            ->when($filters['search'] ?? null, function ($q, $search): void {
                $q->whereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('nim', 'like', "%{$search}%"));
            })
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->get();

        $structure = $this->structure->summarize($course);
        $assignmentIds = $this->structure->publishedAssignmentIds($structure['module_ids'], $structure['material_ids']);
        $quizIds = $this->structure->publishedQuizIds($structure['module_ids'], $structure['material_ids']);

        $userIds = $enrollments->pluck('user_id');
        $completedContents = $this->completedContentCountByUser($userIds, $structure['content_ids']);
        $submittedAssignments = $this->submissionCountByUser($userIds, $assignmentIds);
        $completedQuizzes = $this->completedQuizCountByUser($userIds, $quizIds);

        $totalItems = $structure['total_contents'] + $structure['total_assignments'] + $structure['total_quizzes'];

        $enrollments->each(function ($enrollment) use (
            $completedContents, $submittedAssignments, $completedQuizzes, $structure, $totalItems
        ): void {
            $userId = $enrollment->user_id;
            $completedContentCount = $completedContents[$userId] ?? 0;
            $submittedCount = $submittedAssignments[$userId] ?? 0;
            $completedQuizCount = $completedQuizzes[$userId] ?? 0;

            $completedItems = $completedContentCount + $submittedCount + $completedQuizCount;
            $progress = $totalItems > 0 ? (int) round(($completedItems / $totalItems) * 100) : 0;

            $enrollment->progress = $progress;
            $enrollment->completed_contents = $completedContentCount;
            $enrollment->total_contents = $structure['total_contents'];
            $enrollment->submitted_assignments = $submittedCount;
            $enrollment->total_assignments = $structure['total_assignments'];
            $enrollment->completed_quizzes = $completedQuizCount;
            $enrollment->total_quizzes = $structure['total_quizzes'];
            $enrollment->is_at_risk = $progress < 30 && $enrollment->status === 'active';
        });

        $activeProgress = $enrollments->where('status', 'active');

        return [
            'enrollments' => $enrollments,
            'stats' => [
                'total' => $enrollments->count(),
                'active' => $activeProgress->count(),
                'pending' => $enrollments->where('status', 'pending')->count(),
                'at_risk' => $enrollments->where('is_at_risk', true)->count(),
                'avg_progress' => (int) round($activeProgress->avg('progress') ?? 0),
            ],
        ];
    }

    /**
     * Gradebook: per active student assignment/quiz averages and final grade,
     * plus aggregate stats and the list of ungraded submissions.
     *
     * @return array{
     *     gradebook: Collection<int, array<string, mixed>>,
     *     needsGrading: Collection<int, Submission>,
     *     stats: array{avg_grade: int, highest: int, lowest: int, incomplete: int, needs_grading: int},
     * }
     */
    public function gradebook(Course $course): array
    {
        $structure = $this->structure->summarize($course);
        $assignmentIds = $this->structure->publishedAssignmentIds($structure['module_ids'], $structure['material_ids']);
        $quizIds = $this->structure->publishedQuizIds($structure['module_ids'], $structure['material_ids']);

        $enrollments = $course->enrollments()
            ->where('status', 'active')
            ->with(['user:id,name,email,nim'])
            ->get();

        $userIds = $enrollments->pluck('user_id');

        // Batch every student's submissions and finished attempts into one query each,
        // then group by user so the per-student arithmetic below stays identical to the
        // original controller logic (including its truthy-filter semantics).
        $submissionsByUser = $assignmentIds->isEmpty() || $userIds->isEmpty() ? collect() : Submission::query()
            ->whereIn('user_id', $userIds)
            ->whereIn('assignment_id', $assignmentIds)
            ->get(['user_id', 'assignment_id', 'grade'])
            ->groupBy('user_id');

        $attemptsByUser = $quizIds->isEmpty() || $userIds->isEmpty() ? collect() : QuizAttempt::query()
            ->whereIn('user_id', $userIds)
            ->whereIn('quiz_id', $quizIds)
            ->whereNotNull('finished_at')
            ->get(['user_id', 'quiz_id', 'score'])
            ->groupBy('user_id');

        $gradebook = $enrollments->map(function ($enrollment) use ($submissionsByUser, $attemptsByUser, $assignmentIds) {
            $userId = $enrollment->user_id;

            // Assignment average: best grade per assignment, falsy values dropped (matches ->filter()).
            $submissions = ($submissionsByUser->get($userId) ?? collect())->keyBy('assignment_id');
            $assignmentGrades = $assignmentIds->map(fn ($id) => $submissions->get($id)?->grade)->filter()->values();
            $avgAssignment = $assignmentGrades->count() > 0 ? $assignmentGrades->avg() : null;

            // Quiz average: max score per quiz, averaged over attempted quizzes.
            $attempts = ($attemptsByUser->get($userId) ?? collect())
                ->groupBy('quiz_id')
                ->map(fn ($group) => $group->max('score'));
            $avgQuiz = $attempts->count() > 0 ? $attempts->avg() : null;

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

        $needsGrading = $assignmentIds->isEmpty() ? collect() : Submission::query()
            ->whereIn('assignment_id', $assignmentIds)
            ->whereNull('grade')
            ->with(['user:id,name', 'assignment:id,title'])
            ->latest('submitted_at')
            ->get();

        $finalGrades = $gradebook->pluck('final_grade')->filter();

        return [
            'gradebook' => $gradebook,
            'needsGrading' => $needsGrading,
            'stats' => [
                'avg_grade' => $finalGrades->count() > 0 ? round($finalGrades->avg()) : 0,
                'highest' => $finalGrades->count() > 0 ? round($finalGrades->max()) : 0,
                'lowest' => $finalGrades->count() > 0 ? round($finalGrades->min()) : 0,
                'incomplete' => $gradebook->where('is_complete', false)->count(),
                'needs_grading' => $needsGrading->count(),
            ],
        ];
    }

    /**
     * Per-student progress rows + per-module completion rows + aggregate stats.
     * Used by the progress page.
     *
     * Note: module-level counts intentionally aggregate across ALL users (not
     * just active enrollments), matching the original controller behavior.
     *
     * @return array{
     *     studentProgress: Collection<int, array<string, mixed>>,
     *     moduleProgress: Collection<int, array<string, mixed>>,
     *     stats: array{avg_progress: int, at_risk: int, most_completed_module: ?string, least_completed_module: ?string},
     * }
     */
    public function progressOverview(Course $course): array
    {
        $structure = $this->structure->summarize($course);
        $moduleIds = $structure['module_ids'];
        $materialIds = $structure['material_ids'];
        $contentIds = $structure['content_ids'];
        $assignmentIds = $this->structure->publishedAssignmentIds($moduleIds, $materialIds);
        $quizIds = $this->structure->publishedQuizIds($moduleIds, $materialIds);

        $modules = $course->modules()->with(['materials.contents'])->get();

        $enrollments = $course->enrollments()
            ->where('status', 'active')
            ->with(['user:id,name,email,nim'])
            ->get();

        $totalStudents = $enrollments->count();
        $totalContents = $structure['total_contents'];
        $totalAssignments = $structure['total_assignments'];
        $totalQuizzes = $structure['total_quizzes'];
        $totalItems = $totalContents + $totalAssignments + $totalQuizzes;

        $userIds = $enrollments->pluck('user_id');

        // Batch the per-student aggregates that were previously queried in a loop.
        $completedContentByUser = $this->completedContentCountByUser($userIds, $contentIds);
        $submittedByUser = $this->submissionCountByUser($userIds, $assignmentIds);
        $completedQuizByUser = $this->completedQuizCountByUser($userIds, $quizIds);

        // For modules-completed and last-activity, batch the raw progress rows once.
        $progressRows = $contentIds->isEmpty() || $userIds->isEmpty() ? collect() : ContentProgress::query()
            ->whereIn('user_id', $userIds)
            ->whereIn('content_id', $contentIds)
            ->get(['user_id', 'content_id', 'completed_at', 'updated_at']);

        $completedContentIdsByUser = $progressRows
            ->filter(fn ($row) => $row->completed_at !== null)
            ->groupBy('user_id')
            ->map(fn ($rows) => $rows->pluck('content_id')->all());

        $lastActivityByUser = $progressRows
            ->groupBy('user_id')
            ->map(fn ($rows) => $rows->max('updated_at'));

        // Pre-compute each module's content id set once.
        $moduleContentIdSets = $modules->mapWithKeys(fn ($module) => [
            $module->id => $module->materials->flatMap(fn ($m) => $m->contents->pluck('id'))->all(),
        ]);

        $studentProgress = $enrollments->map(function ($enrollment) use (
            $completedContentByUser, $submittedByUser, $completedQuizByUser,
            $completedContentIdsByUser, $lastActivityByUser, $moduleContentIdSets,
            $modules, $totalAssignments, $totalQuizzes, $totalItems
        ) {
            $userId = $enrollment->user_id;

            $completedContents = $completedContentByUser[$userId] ?? 0;
            $submittedAssignments = $submittedByUser[$userId] ?? 0;
            $completedQuizzes = $completedQuizByUser[$userId] ?? 0;

            $userCompletedContentIds = array_flip($completedContentIdsByUser->get($userId, []));
            $modulesCompleted = 0;
            foreach ($moduleContentIdSets as $moduleContentIds) {
                if (count($moduleContentIds) === 0) {
                    continue;
                }
                $done = 0;
                foreach ($moduleContentIds as $cid) {
                    if (isset($userCompletedContentIds[$cid])) {
                        $done++;
                    }
                }
                if ($done >= count($moduleContentIds)) {
                    $modulesCompleted++;
                }
            }

            $completedItems = $completedContents + $submittedAssignments + $completedQuizzes;
            $progress = $totalItems > 0 ? round(($completedItems / $totalItems) * 100) : 0;

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
                'last_activity' => $lastActivityByUser->get($userId),
                'is_at_risk' => $progress < 30,
            ];
        });

        $moduleProgress = $modules->map(function ($module) use ($totalStudents) {
            $moduleContentIds = $module->materials->flatMap(fn ($m) => $m->contents->pluck('id'));
            $moduleMaterialIds = $module->materials->pluck('id');

            $contentCompletions = $moduleContentIds->count() > 0
                ? ContentProgress::whereIn('content_id', $moduleContentIds)->whereNotNull('completed_at')->count()
                : 0;

            $assignmentSubmissions = Submission::whereHas('assignment', function ($q) use ($module, $moduleMaterialIds): void {
                $q->where(function ($q2) use ($module, $moduleMaterialIds): void {
                    $q2->whereIn('assignable_type', ['module', 'App\\Models\\Module'])->where('assignable_id', $module->id)
                        ->orWhere(fn ($q3) => $q3->whereIn('assignable_type', ['material', 'App\\Models\\Material'])->whereIn('assignable_id', $moduleMaterialIds));
                });
            })->count();

            $quizCompletions = QuizAttempt::whereNotNull('finished_at')
                ->whereHas('quiz', function ($q) use ($module, $moduleMaterialIds): void {
                    $q->where(function ($q2) use ($module, $moduleMaterialIds): void {
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

        $avgProgress = $studentProgress->avg('progress') ?? 0;
        $mostCompletedModule = $moduleProgress->sortByDesc('avg_progress')->first();
        $leastCompletedModule = $moduleProgress->sortBy('avg_progress')->first();

        return [
            'studentProgress' => $studentProgress,
            'moduleProgress' => $moduleProgress,
            'stats' => [
                'avg_progress' => round($avgProgress),
                'at_risk' => $studentProgress->where('is_at_risk', true)->count(),
                'most_completed_module' => $mostCompletedModule['title'] ?? null,
                'least_completed_module' => $leastCompletedModule['title'] ?? null,
            ],
        ];
    }

    /**
     * @param  Collection<int, int>  $userIds
     * @param  Collection<int, int>  $contentIds
     * @return array<int, int> user_id => completed content count
     */
    private function completedContentCountByUser(Collection $userIds, Collection $contentIds): array
    {
        if ($contentIds->isEmpty() || $userIds->isEmpty()) {
            return [];
        }

        return ContentProgress::query()
            ->whereIn('user_id', $userIds)
            ->whereIn('content_id', $contentIds)
            ->whereNotNull('completed_at')
            ->selectRaw('user_id, count(*) as aggregate')
            ->groupBy('user_id')
            ->pluck('aggregate', 'user_id')
            ->map(fn ($v) => (int) $v)
            ->all();
    }

    /**
     * @param  Collection<int, int>  $userIds
     * @param  Collection<int, int>  $assignmentIds
     * @return array<int, int> user_id => submission count
     */
    private function submissionCountByUser(Collection $userIds, Collection $assignmentIds): array
    {
        if ($assignmentIds->isEmpty() || $userIds->isEmpty()) {
            return [];
        }

        return Submission::query()
            ->whereIn('user_id', $userIds)
            ->whereIn('assignment_id', $assignmentIds)
            ->selectRaw('user_id, count(*) as aggregate')
            ->groupBy('user_id')
            ->pluck('aggregate', 'user_id')
            ->map(fn ($v) => (int) $v)
            ->all();
    }

    /**
     * @param  Collection<int, int>  $userIds
     * @param  Collection<int, int>  $quizIds
     * @return array<int, int> user_id => distinct finished quiz count
     */
    private function completedQuizCountByUser(Collection $userIds, Collection $quizIds): array
    {
        if ($quizIds->isEmpty() || $userIds->isEmpty()) {
            return [];
        }

        return QuizAttempt::query()
            ->whereIn('user_id', $userIds)
            ->whereIn('quiz_id', $quizIds)
            ->whereNotNull('finished_at')
            ->selectRaw('user_id, count(distinct quiz_id) as aggregate')
            ->groupBy('user_id')
            ->pluck('aggregate', 'user_id')
            ->map(fn ($v) => (int) $v)
            ->all();
    }
}
