<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Content;
use App\Models\ContentProgress;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Support\Str;

class CertificateService
{
    /**
     * Check if student is eligible for certificate based on course criteria
     */
    public function isEligible(User $student, Course $course): bool
    {
        $enrollment = Enrollment::query()
            ->where('user_id', $student->id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->first();

        if (!$enrollment) {
            return false;
        }

        $criteria = $course->certificate_criteria ?? [];

        // Check minimum progress
        if (isset($criteria['min_progress'])) {
            $progress = $this->calculateProgress($student, $course);
            if ($progress < $criteria['min_progress']) {
                return false;
            }
        }

        // Check minimum quiz score
        if (isset($criteria['min_quiz_score'])) {
            $avgQuizScore = $this->calculateAverageQuizScore($student, $course);
            if ($avgQuizScore === null || $avgQuizScore < $criteria['min_quiz_score']) {
                return false;
            }
        }

        // Check minimum assignment score
        if (isset($criteria['min_assignment_score'])) {
            $avgAssignmentScore = $this->calculateAverageAssignmentScore($student, $course);
            if ($avgAssignmentScore === null || $avgAssignmentScore < $criteria['min_assignment_score']) {
                return false;
            }
        }

        return true;
    }

    /**
     * Issue certificate to student
     */
    public function issue(User $student, Course $course): Certificate
    {
        // Check if already has certificate
        $existing = Certificate::query()
            ->where('user_id', $student->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return $existing;
        }

        // Create certificate
        return Certificate::query()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'criteria' => $course->certificate_criteria,
            'verify_code' => $this->generateVerifyCode(),
            'issued_at' => now(),
        ]);
    }

    /**
     * Calculate student progress in course
     */
    public function calculateProgress(User $student, Course $course): float
    {
        $contentIds = Content::query()
            ->whereHas('material', function ($query) use ($course): void {
                $query
                    ->where('is_published', true)
                    ->whereHas('module', function ($moduleQuery) use ($course): void {
                        $moduleQuery
                            ->where('course_id', $course->id)
                            ->where('is_published', true);
                    });
            })
            ->pluck('id');

        $totalContents = $contentIds->count();

        if ($totalContents === 0) {
            return 100;
        }

        $completedContents = ContentProgress::query()
            ->where('user_id', $student->id)
            ->whereIn('content_id', $contentIds)
            ->whereNotNull('completed_at')
            ->count();

        return round(($completedContents / $totalContents) * 100, 2);
    }

    /**
     * Calculate average quiz score
     */
    public function calculateAverageQuizScore(User $student, Course $course): ?float
    {
        $attempts = \App\Models\QuizAttempt::query()
            ->where('user_id', $student->id)
            ->where('status', 'graded')
            ->whereHas('quiz', function ($query) use ($course) {
                $query->whereHasMorph('quizzable', [\App\Models\Module::class], function ($q) use ($course) {
                    $q->where('course_id', $course->id);
                })->orWhereHasMorph('quizzable', [\App\Models\Material::class], function ($q) use ($course) {
                    $q->whereHas('module', fn($mq) => $mq->where('course_id', $course->id));
                });
            })
            ->get();

        if ($attempts->isEmpty()) {
            return null;
        }

        return round($attempts->avg('score'), 2);
    }

    /**
     * Calculate average assignment score
     */
    public function calculateAverageAssignmentScore(User $student, Course $course): ?float
    {
        $submissions = \App\Models\Submission::query()
            ->where('user_id', $student->id)
            ->where('status', 'graded')
            ->whereHas('assignment', function ($query) use ($course) {
                $query->whereHasMorph('assignable', [\App\Models\Module::class], function ($q) use ($course) {
                    $q->where('course_id', $course->id);
                })->orWhereHasMorph('assignable', [\App\Models\Material::class], function ($q) use ($course) {
                    $q->whereHas('module', fn($mq) => $mq->where('course_id', $course->id));
                });
            })
            ->get();

        if ($submissions->isEmpty()) {
            return null;
        }

        return round($submissions->avg('grade'), 2);
    }

    /**
     * Generate unique verify code
     */
    private function generateVerifyCode(): string
    {
        do {
            $code = strtoupper(Str::random(12));
        } while (Certificate::query()->where('verify_code', $code)->exists());

        return $code;
    }

    /**
     * Verify certificate by code
     */
    public function verify(string $code): ?Certificate
    {
        return Certificate::query()
            ->where('verify_code', strtoupper($code))
            ->with(['user', 'course'])
            ->first();
    }
}
