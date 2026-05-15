<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ContentProgress;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function show(Request $request, Course $course): Response
    {
        Gate::authorize('view', $course);

        $course->load([
            'instructor:id,name',
            'modules' => fn ($query) => $query->published()->orderBy('order'),
            'modules.materials' => fn ($query) => $query->published()->orderBy('order'),
            'modules.materials.contents' => fn ($query) => $query->orderBy('order'),
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

        return Inertia::render('Student/Courses/Show', [
            'course' => $course,
            'completedContentIds' => $completedContentIds,
            'progress' => $contentIds->count() > 0 ? (int) round(($completedContentIds->count() / $contentIds->count()) * 100) : 0,
        ]);
    }
}
