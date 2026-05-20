<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\ContentProgress;
use App\Models\Course;
use App\Models\QuizAttempt;
use App\Models\Submission;
use App\Services\CertificateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function __construct(
        private CertificateService $certificateService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        
        // Get all active courses
        $courses = Course::query()
            ->with('instructor:id,name')
            ->where('is_active', true)
            ->latest()
            ->get();

        // Get user's enrollments
        $enrollments = $user->enrollments()
            ->whereIn('course_id', $courses->pluck('id'))
            ->get()
            ->keyBy('course_id');

        // Map courses with enrollment status and progress
        $coursesWithStatus = $courses->map(function ($course) use ($user, $enrollments) {
            $enrollment = $enrollments->get($course->id);
            
            // Calculate progress if enrolled and active
            $progress = 0;
            if ($enrollment && $enrollment->status === 'active') {
                $contentIds = $course->modules()
                    ->published()
                    ->with(['materials' => fn ($q) => $q->published()->with('contents')])
                    ->get()
                    ->flatMap(fn ($module) => $module->materials)
                    ->flatMap(fn ($material) => $material->contents)
                    ->pluck('id');

                if ($contentIds->count() > 0) {
                    $completedCount = ContentProgress::query()
                        ->where('user_id', $user->id)
                        ->whereIn('content_id', $contentIds)
                        ->whereNotNull('completed_at')
                        ->count();

                    $progress = (int) round(($completedCount / $contentIds->count()) * 100);
                }
            }

            return [
                'id' => $course->id,
                'code' => $course->code,
                'name' => $course->name,
                'description' => $course->description,
                'instructor' => $course->instructor,
                'enrollment_status' => $enrollment ? $enrollment->status : null,
                'enrollment_type' => $course->enrollment_type,
                'enrolled_at' => $enrollment?->created_at?->toISOString(),
                'progress' => $progress,
            ];
        });

        return Inertia::render('Student/Courses/Index', [
            'courses' => $coursesWithStatus,
        ]);
    }

    public function show(Request $request, Course $course): Response
    {
        Gate::authorize('view', $course);

        $course->load([
            'instructor:id,name',
            'modules' => fn ($query) => $query->published()->orderBy('order'),
            'modules.materials' => fn ($query) => $query->published()->orderBy('order'),
            'modules.materials.contents' => fn ($query) => $query->orderBy('order'),
            'modules.materials.discussions' => fn ($query) => $query->whereNull('parent_id')->with(['user:id,name', 'replies.user:id,name'])->oldest(),
            'modules.quizzes' => fn ($query) => $query->published()->with('questions')->orderBy('id'),
            'modules.materials.quizzes' => fn ($query) => $query->published()->with('questions')->orderBy('id'),
            'modules.assignments' => fn ($query) => $query->published()->orderBy('id'),
            'modules.materials.assignments' => fn ($query) => $query->published()->orderBy('id'),
        ]);

        $contentIds = $course->modules
            ->flatMap(fn ($module) => $module->materials)
            ->flatMap(fn ($material) => $material->contents)
            ->pluck('id');

        $completedContentIds = ContentProgress::query()
            ->where('user_id', $request->user()->id)
            ->whereIn('content_id', $contentIds)
            ->whereNotNull('completed_at')
            ->pluck('content_id')
            ->values();

        $publishedQuizzes = $course->modules->flatMap(fn ($module) => $module->quizzes)
            ->merge($course->modules->flatMap(fn ($module) => $module->materials)->flatMap(fn ($material) => $material->quizzes));
        $visibleScoreQuizIds = $publishedQuizzes
            ->where('result_mode', 'immediate')
            ->pluck('id');
        
        // Get all attempts grouped by quiz_id with count
        $allAttempts = QuizAttempt::query()
            ->where('user_id', $request->user()->id)
            ->whereIn('quiz_id', $publishedQuizzes->pluck('id'))
            ->get(['id', 'quiz_id', 'score', 'status', 'finished_at'])
            ->groupBy('quiz_id');
        
        $attemptsByQuizId = $allAttempts->mapWithKeys(function ($attempts, $quizId) use ($visibleScoreQuizIds) {
            $latestAttempt = $attempts->sortByDesc('finished_at')->first();
            return [
                $quizId => [
                    'id' => $latestAttempt->id,
                    'quiz_id' => $latestAttempt->quiz_id,
                    'score' => $visibleScoreQuizIds->contains($latestAttempt->quiz_id) ? $latestAttempt->score : null,
                    'status' => $latestAttempt->status,
                    'finished_at' => $latestAttempt->finished_at,
                    'attempt_count' => $attempts->count(),
                ],
            ];
        });

        return Inertia::render('Student/Courses/Show', [
            'course' => $this->studentCoursePayload($course, $request),
            'completedContentIds' => $completedContentIds,
            'attemptsByQuizId' => $attemptsByQuizId,
            'submissionsByAssignmentId' => $this->getSubmissions($request, $course),
            'progress' => $contentIds->count() > 0 ? (int) round(($completedContentIds->count() / $contentIds->count()) * 100) : 0,
        ]);
    }

    private function studentCoursePayload(Course $course, Request $request): array
    {
        $user = $request->user();

        $hasCertificate = Certificate::query()
            ->where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        $eligibility = null;
        if ($course->certificate_criteria) {
            $eligibility = [
                'eligible' => $this->certificateService->isEligible($user, $course),
                'current_progress' => $this->certificateService->calculateProgress($user, $course),
                'current_quiz_score' => $this->certificateService->calculateAverageQuizScore($user, $course),
                'current_assignment_score' => $this->certificateService->calculateAverageAssignmentScore($user, $course),
            ];
        }

        return [
            'id' => $course->id,
            'code' => $course->code,
            'name' => $course->name,
            'instructor' => $course->instructor,
            'modules' => $course->modules->map(fn ($module) => [
                'id' => $module->id,
                'title' => $module->title,
                'description' => $module->description,
                'order' => $module->order,
                'quizzes' => $module->quizzes->map(fn ($quiz) => $this->quizPayload($quiz)),
                'assignments' => $module->assignments->map(fn ($assignment) => $this->assignmentPayload($assignment)),
                'materials' => $module->materials->map(fn ($material) => [
                    'id' => $material->id,
                    'title' => $material->title,
                    'order' => $material->order,
                    'contents' => $material->contents->map(fn ($c) => [
                    'id' => $c->id,
                    'type' => $c->type,
                    'title' => $c->title,
                    'body' => $c->body,
                    'url' => $c->url,
                    'video_id' => $c->video_id,
                    'file_path' => $c->file_path,
                    'order' => $c->order,
                ]),
                    'quizzes' => $material->quizzes->map(fn ($quiz) => $this->quizPayload($quiz)),
                    'assignments' => $material->assignments->map(fn ($assignment) => $this->assignmentPayload($assignment)),
                    'discussions' => $material->discussions,
                ]),
            ]),
            'certificate_criteria' => $course->certificate_criteria,
            'certificate_eligibility' => $eligibility,
            'has_certificate' => (bool) $hasCertificate,
            'certificate_id' => $hasCertificate?->id,
        ];
    }

    private function quizPayload($quiz): array
    {
        return [
            'id' => $quiz->id,
            'title' => $quiz->title,
            'duration' => $quiz->duration,
            'result_mode' => $quiz->result_mode,
            'passing_score' => $quiz->passing_score,
            'max_attempts' => $quiz->max_attempts,
            'questions' => $quiz->questions->map(fn ($question) => [
                'id' => $question->id,
                'question' => $question->question,
                'type' => $question->type,
                'options' => $question->options,
                'points' => $question->points,
                'order' => $question->order,
            ]),
        ];
    }

    private function assignmentPayload($assignment): array
    {
        return [
            'id' => $assignment->id,
            'title' => $assignment->title,
            'description' => $assignment->description,
            'deadline' => $assignment->deadline?->toISOString(),
            'allow_file' => $assignment->allow_file,
            'allow_link' => $assignment->allow_link,
        ];
    }

    private function getSubmissions(Request $request, Course $course)
    {
        $assignmentIds = $course->modules
            ->flatMap(fn ($module) => $module->assignments)
            ->merge($course->modules->flatMap(fn ($module) => $module->materials)->flatMap(fn ($material) => $material->assignments))
            ->pluck('id');

        return Submission::query()
            ->where('user_id', $request->user()->id)
            ->whereIn('assignment_id', $assignmentIds)
            ->get(['id', 'assignment_id', 'file_path', 'link_url', 'grade', 'feedback', 'status', 'submitted_at'])
            ->keyBy('assignment_id');
    }
}
