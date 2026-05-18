<?php

namespace App\Services;

use App\Models\Course;
use App\Models\QuizAttempt;
use App\Models\Submission;
use Illuminate\Support\Collection;

class LeaderboardService
{
    /**
     * Get leaderboard for a course
     */
    public function getLeaderboard(Course $course): Collection
    {
        if (!$course->leaderboard_enabled) {
            return collect();
        }

        // Get all active enrollments
        $enrollments = $course->enrollments()
            ->where('status', 'active')
            ->with('user')
            ->get();

        // Calculate scores for each student
        $leaderboard = $enrollments->map(function ($enrollment) use ($course) {
            $student = $enrollment->user;
            
            $quizScore = $this->calculateQuizScore($student, $course);
            $assignmentScore = $this->calculateAssignmentScore($student, $course);
            $totalScore = $quizScore + $assignmentScore;

            return [
                'user_id' => $student->id,
                'name' => $student->name,
                'nim' => $student->nim,
                'avatar' => $student->avatar,
                'quiz_score' => round($quizScore, 2),
                'assignment_score' => round($assignmentScore, 2),
                'total_score' => round($totalScore, 2),
            ];
        });

        // Sort by total score descending
        $leaderboard = $leaderboard->sortByDesc('total_score')->values();

        // Add rank
        $leaderboard = $leaderboard->map(function ($item, $index) {
            $item['rank'] = $index + 1;
            return $item;
        });

        return $leaderboard;
    }

    /**
     * Calculate quiz score for student in course
     */
    private function calculateQuizScore($student, Course $course): float
    {
        $attempts = QuizAttempt::query()
            ->where('user_id', $student->id)
            ->where('status', 'graded')
            ->whereHas('quiz', function ($query) use ($course) {
                $query->where('is_published', true)
                    ->whereHasMorph('quizzable', [\App\Models\Module::class], function ($q) use ($course) {
                        $q->where('course_id', $course->id)
                          ->where('is_published', true);
                    })
                    ->orWhereHasMorph('quizzable', [\App\Models\Material::class], function ($q) use ($course) {
                        $q->where('is_published', true)
                          ->whereHas('module', fn($mq) => $mq->where('course_id', $course->id)
                                                              ->where('is_published', true));
                    });
            })
            ->get();

        if ($attempts->isEmpty()) {
            return 0;
        }

        // Get best attempt for each quiz
        $bestScores = $attempts->groupBy('quiz_id')
            ->map(fn($quizAttempts) => $quizAttempts->max('score'));

        return $bestScores->avg() ?? 0;
    }

    /**
     * Calculate assignment score for student in course
     */
    private function calculateAssignmentScore($student, Course $course): float
    {
        $submissions = Submission::query()
            ->where('user_id', $student->id)
            ->where('status', 'graded')
            ->whereHas('assignment', function ($query) use ($course) {
                $query->where('is_published', true)
                    ->whereHasMorph('assignable', [\App\Models\Module::class], function ($q) use ($course) {
                        $q->where('course_id', $course->id)
                          ->where('is_published', true);
                    })
                    ->orWhereHasMorph('assignable', [\App\Models\Material::class], function ($q) use ($course) {
                        $q->where('is_published', true)
                          ->whereHas('module', fn($mq) => $mq->where('course_id', $course->id)
                                                              ->where('is_published', true));
                    });
            })
            ->get();

        if ($submissions->isEmpty()) {
            return 0;
        }

        return $submissions->avg('grade') ?? 0;
    }

    /**
     * Get student rank in course
     */
    public function getStudentRank($student, Course $course): ?int
    {
        $leaderboard = $this->getLeaderboard($course);
        
        $studentEntry = $leaderboard->firstWhere('user_id', $student->id);
        
        return $studentEntry['rank'] ?? null;
    }
}
