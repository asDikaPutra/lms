<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::query()->count(),
                'total_instructors' => User::query()->where('role', 'instructor')->count(),
                'total_students' => User::query()->where('role', 'student')->count(),
                'active_courses' => Course::query()->where('is_active', true)->count(),
                'active_enrollments' => Enrollment::query()->where('status', 'active')->count(),
                'pending_enrollments' => Enrollment::query()->where('status', 'pending')->count(),
            ],
            'recentUsers' => User::query()
                ->latest()
                ->limit(5)
                ->get(['id', 'name', 'email', 'role', 'is_active', 'created_at']),
            'recentCourses' => Course::query()
                ->with('instructor:id,name')
                ->latest()
                ->limit(5)
                ->get(['id', 'code', 'name', 'instructor_id', 'semester', 'is_active']),
        ]);
    }
}
