<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Material;
use App\Models\Module;
use App\Models\Submission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionController extends Controller
{
    public function index(Request $request): Response
    {
        $assignmentIds = $this->ownedAssignmentIds($request);

        $submissions = Submission::query()
            ->with(['assignment', 'user:id,name,nim'])
            ->whereIn('assignment_id', $assignmentIds)
            ->latest('submitted_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Instructor/Submissions/Index', [
            'submissions' => $submissions,
            'filters' => $request->only(['status', 'assignment_id']),
        ]);
    }

    public function show(Request $request, Assignment $assignment): Response
    {
        abort_unless($this->ownedAssignmentIds($request)->contains($assignment->id), 403);

        // Load the assignable with its parent relationships
        // Module has course directly, Material has module.course
        $assignment->load(['assignable.module.course']);
        
        // If assignable is a Module, also load its course directly
        if ($assignment->assignable_type === 'module' || $assignment->assignable_type === Module::class) {
            $assignment->load(['assignable.course']);
        }

        $submissions = Submission::query()
            ->with(['user:id,name,nim'])
            ->where('assignment_id', $assignment->id)
            ->latest('submitted_at')
            ->get();

        return Inertia::render('Instructor/Submissions/Show', [
            'assignment' => $assignment,
            'submissions' => $submissions,
        ]);
    }

    public function grade(Request $request, Submission $submission): RedirectResponse
    {
        abort_unless($this->ownedAssignmentIds($request)->contains($submission->assignment_id), 403);

        $validated = $request->validate([
            'grade' => ['required', 'numeric', 'min:0', 'max:100'],
            'feedback' => ['nullable', 'string', 'max:5000'],
        ]);

        $submission->update([
            'grade' => $validated['grade'],
            'feedback' => $validated['feedback'] ?? null,
            'status' => 'graded',
        ]);

        // Notify student
        $submission->user->notify(new \App\Notifications\AssignmentGradedNotification($submission));

        return back()->with('success', 'Nilai tugas berhasil disimpan.');
    }

    private function ownedAssignmentIds(Request $request)
    {
        return Assignment::query()
            ->where(function ($query) use ($request): void {
                $query
                    ->whereHasMorph('assignable', [Module::class], fn ($moduleQuery) => $moduleQuery
                        ->whereHas('course', fn ($courseQuery) => $courseQuery->where('instructor_id', $request->user()->id)))
                    ->orWhereHasMorph('assignable', [Material::class], fn ($materialQuery) => $materialQuery
                        ->whereHas('module.course', fn ($courseQuery) => $courseQuery->where('instructor_id', $request->user()->id)));
            })
            ->pluck('id');
    }
}
