<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

final class LeaderboardController extends Controller
{
    public function index(): Response
    {
        $leaderboard = DB::table('users')
            ->select('users.id', 'users.name', 'users.nim', 'users.avatar', DB::raw('COALESCE(SUM(quiz_attempts.score), 0) as total_score'))
            ->leftJoin('quiz_attempts', function ($join): void {
                $join->on('users.id', '=', 'quiz_attempts.user_id')
                    ->where('quiz_attempts.status', '=', 'completed');
            })
            ->where('users.role', 'student')
            ->where('users.is_active', true)
            ->groupBy('users.id', 'users.name', 'users.nim', 'users.avatar')
            ->orderByDesc('total_score')
            ->orderBy('users.name')
            ->limit(10)
            ->get();

        return Inertia::render('Student/Leaderboard', [
            'leaderboard' => $leaderboard,
        ]);
    }
}
