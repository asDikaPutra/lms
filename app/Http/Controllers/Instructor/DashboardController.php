<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Material;
use App\Models\Module;
use App\Models\QuizAttempt;
use App\Models\Submission;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $instructorId = auth()->id();

        $courses = Course::query()
            ->where('instructor_id', $instructorId)
            ->withCount([
                'modules',
                'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
                'enrollments as pending_enrollments_count' => fn ($query) => $query->where('status', 'pending'),
            ])
            ->latest()
            ->get(['id', 'code', 'name', 'semester', 'enrollment_type', 'enroll_code', 'is_active', 'leaderboard_enabled', 'created_at']);

        return Inertia::render('Instructor/Dashboard', [
            'stats' => [
                'owned_courses' => $courses->count(),
                'pending_enrollments' => Enrollment::query()
                    ->whereHas('course', fn ($query) => $query->where('instructor_id', $instructorId))
                    ->where('status', 'pending')
                    ->count(),
                'submissions_needing_grading' => Submission::query()
                    ->whereIn('status', ['submitted', 'late'])
                    ->whereHas('assignment', fn ($query) => $this->scopeOwnedAssignable($query, $instructorId))
                    ->count(),
                'quiz_attempts_needing_grading' => QuizAttempt::query()
                    ->where('status', 'submitted')
                    ->whereHas('quiz', fn ($query) => $this->scopeOwnedQuizzable($query, $instructorId))
                    ->count(),
            ],
            'courses' => $courses,
            'pendingEnrollments' => Enrollment::query()
                ->with(['user:id,name,email,nim', 'course:id,code,name,instructor_id'])
                ->whereHas('course', fn ($query) => $query->where('instructor_id', $instructorId))
                ->where('status', 'pending')
                ->latest()
                ->limit(6)
                ->get(),
        ]);
    }

    private function scopeOwnedAssignable($query, int $instructorId): void
    {
        $query->where(function ($query) use ($instructorId): void {
            $query->whereHasMorph('assignable', [Module::class], fn ($query) => $query->whereHas('course', fn ($query) => $query->where('instructor_id', $instructorId)))
                ->orWhereHasMorph('assignable', [Material::class], fn ($query) => $query->whereHas('module.course', fn ($query) => $query->where('instructor_id', $instructorId)));
        });
    }

    private function scopeOwnedQuizzable($query, int $instructorId): void
    {
        $query->where(function ($query) use ($instructorId): void {
            $query->whereHasMorph('quizzable', [Module::class], fn ($query) => $query->whereHas('course', fn ($query) => $query->where('instructor_id', $instructorId)))
                ->orWhereHasMorph('quizzable', [Material::class], fn ($query) => $query->whereHas('module.course', fn ($query) => $query->where('instructor_id', $instructorId)));
        });
    }
}
