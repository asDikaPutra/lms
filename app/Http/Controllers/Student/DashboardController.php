<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Content;
use App\Models\ContentProgress;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Material;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $student = $request->user();
        $search = $request->string('search')->toString();

        $enrollments = Enrollment::query()
            ->with(['course.instructor:id,name'])
            ->where('user_id', $student->id)
            ->whereHas('course', function ($query) use ($search): void {
                $query->where('is_active', true)
                    ->when($search !== '', function ($query) use ($search): void {
                        $query->where(function ($query) use ($search): void {
                            $query->where('name', 'like', "%{$search}%")
                                ->orWhere('code', 'like', "%{$search}%")
                                ->orWhereHas('modules.materials', fn ($query) => $query->where('title', 'like', "%{$search}%"));
                        });
                    });
            })
            ->latest()
            ->get();

        $activeCourseIds = $enrollments
            ->where('status', 'active')
            ->pluck('course_id')
            ->values();

        $totalPublishedContents = $activeCourseIds->sum(fn ($courseId) => $this->publishedContentCount((int) $courseId));
        $completedContents = ContentProgress::query()
            ->where('user_id', $student->id)
            ->whereNotNull('completed_at')
            ->whereHas('content.material.module.course', fn ($query) => $query->whereIn('id', $activeCourseIds))
            ->count();

        return Inertia::render('Student/Dashboard', [
            'filters' => ['search' => $search],
            'stats' => [
                'active_courses' => $enrollments->where('status', 'active')->count(),
                'overall_progress' => $totalPublishedContents > 0 ? (int) round(($completedContents / $totalPublishedContents) * 100) : 0,
                'assignments_due' => $this->upcomingAssignmentsQuery($activeCourseIds)->count(),
                'certificates' => $student->certificates()->count(),
            ],
            'enrollments' => $enrollments->map(fn (Enrollment $enrollment) => [
                'id' => $enrollment->id,
                'status' => $enrollment->status,
                'course' => [
                    'id' => $enrollment->course->id,
                    'code' => $enrollment->course->code,
                    'name' => $enrollment->course->name,
                    'semester' => $enrollment->course->semester,
                    'instructor' => $enrollment->course->instructor,
                    'progress' => $enrollment->status === 'active' ? $this->progressForCourse($student->id, $enrollment->course) : 0,
                ],
            ]),
            'upcomingAssignments' => $this->upcomingAssignmentsQuery($activeCourseIds)
                ->with('assignable')
                ->orderBy('deadline')
                ->limit(5)
                ->get(['id', 'title', 'deadline', 'assignable_id', 'assignable_type'])
                ->map(fn (Assignment $assignment) => [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'deadline' => $assignment->deadline?->format('d M Y, H:i'),
                ]),
        ]);
    }

    private function progressForCourse(int $studentId, Course $course): int
    {
        $total = $this->publishedContentCount($course->id);

        if ($total === 0) {
            return 0;
        }

        $completed = ContentProgress::query()
            ->where('user_id', $studentId)
            ->whereNotNull('completed_at')
            ->whereHas('content.material.module', fn ($query) => $query->where('course_id', $course->id)->published())
            ->whereHas('content.material', fn ($query) => $query->published())
            ->count();

        return (int) round(($completed / $total) * 100);
    }

    private function publishedContentCount(int $courseId): int
    {
        return Content::query()
            ->whereHas('material', fn ($query) => $query->published())
            ->whereHas('material.module', fn ($query) => $query->published()->where('course_id', $courseId))
            ->count();
    }

    private function upcomingAssignmentsQuery($activeCourseIds)
    {
        return Assignment::query()
            ->published()
            ->where('deadline', '>=', now())
            ->where(function ($query) use ($activeCourseIds): void {
                $query->whereHasMorph('assignable', [Module::class], fn ($query) => $query->whereIn('course_id', $activeCourseIds)->published())
                    ->orWhereHasMorph('assignable', [Material::class], fn ($query) => $query->published()->whereHas('module', fn ($query) => $query->whereIn('course_id', $activeCourseIds)->published()));
            });
    }
}
