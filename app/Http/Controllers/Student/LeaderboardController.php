<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\LeaderboardService;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    public function __construct(
        private LeaderboardService $leaderboardService
    ) {}

    /**
     * Show leaderboard for a course
     */
    public function show(Course $course): Response
    {
        // Check if student is enrolled
        $enrollment = $course->enrollments()
            ->where('user_id', auth()->id())
            ->where('status', 'active')
            ->first();

        abort_unless($enrollment, 403, 'Anda belum terdaftar di kursus ini.');

        // Check if leaderboard is enabled
        if (!$course->leaderboard_enabled) {
            return Inertia::render('Student/Leaderboard/Disabled', [
                'course' => [
                    'id' => $course->id,
                    'name' => $course->name,
                    'code' => $course->code,
                ],
            ]);
        }

        $leaderboard = $this->leaderboardService->getLeaderboard($course);
        $studentRank = $this->leaderboardService->getStudentRank(auth()->user(), $course);

        return Inertia::render('Student/Leaderboard/Show', [
            'course' => [
                'id' => $course->id,
                'name' => $course->name,
                'code' => $course->code,
            ],
            'leaderboard' => $leaderboard,
            'student_rank' => $studentRank,
        ]);
    }
}
