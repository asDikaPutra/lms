<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use App\Models\Enrollment;
use App\Models\Material;
use App\Models\Module;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;
use Inertia\Response;

class AssignmentController extends Controller
{
    public function index(Request $request): Response
    {
        $student = $request->user();

        $activeCourseIds = Enrollment::query()
            ->where('user_id', $student->id)
            ->where('status', 'active')
            ->pluck('course_id')
            ->values();

        $assignments = Assignment::query()
            ->published()
            ->where(function ($query) use ($activeCourseIds): void {
                $query->whereHasMorph('assignable', [Module::class], fn ($query) => $query->whereIn('course_id', $activeCourseIds)->published())
                    ->orWhereHasMorph('assignable', [Material::class], fn ($query) => $query->published()->whereHas('module', fn ($query) => $query->whereIn('course_id', $activeCourseIds)->published()));
            })
            ->with([
                'assignable' => fn (MorphTo $morphTo) => $morphTo->morphWith([
                    Module::class => ['course:id,name,code'],
                    Material::class => ['module.course:id,name,code'],
                ]),
                'submissions' => fn ($query) => $query->where('user_id', $student->id),
            ])
            ->orderBy('deadline')
            ->get()
            ->map(function (Assignment $assignment) {
                $course = null;
                if ($assignment->assignable instanceof Module) {
                    $course = $assignment->assignable->course;
                } elseif ($assignment->assignable instanceof Material) {
                    $course = $assignment->assignable->module?->course;
                }

                return [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'deadline' => $assignment->deadline?->toIso8601String(),
                    'deadline_formatted' => $assignment->deadline?->format('d M Y, H:i'),
                    'course_name' => $course?->name,
                    'course_code' => $course?->code,
                    'course_id' => $course?->id,
                    'has_submitted' => $assignment->submissions->isNotEmpty(),
                    'submission_status' => $assignment->submissions->first()?->status,
                ];
            });

        return Inertia::render('Student/Assignments/Index', [
            'assignments' => $assignments,
        ]);
    }

    public function store(Request $request, Assignment $assignment): RedirectResponse
    {
        Gate::authorize('submit', $assignment);
        abort_unless($assignment->is_published, 403);

        $rules = ['submitted_at' => now()];
        $validationRules = [];

        if ($assignment->allow_file) {
            $allowedMimes = implode(',', config('lms.uploads.submission_mimes', []));
            $maxKb = config('lms.uploads.max_kilobytes', 51200);
            $validationRules['file'] = [
                $assignment->allow_link ? 'nullable' : 'required',
                File::types(explode(',', $allowedMimes))->max($maxKb),
            ];
        }

        if ($assignment->allow_link) {
            $validationRules['link_url'] = [
                $assignment->allow_file ? 'nullable' : 'required',
                'url',
                'max:2048',
            ];
        }

        $validated = $request->validate($validationRules);

        $isLate = $assignment->deadline && now()->isAfter($assignment->deadline);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('submissions', 'local');
        }

        Submission::query()->updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'user_id' => $request->user()->id,
            ],
            [
                'file_path' => $filePath,
                'link_url' => $validated['link_url'] ?? null,
                'status' => $isLate ? 'late' : 'submitted',
                'submitted_at' => now(),
                'grade' => null,
                'feedback' => null,
            ],
        );

        $message = $isLate
            ? 'Tugas berhasil dikirim (terlambat).'
            : 'Tugas berhasil dikirim.';

        return back()->with('success', $message);
    }
}
