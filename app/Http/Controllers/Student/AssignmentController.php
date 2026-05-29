<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\File;

class AssignmentController extends Controller
{
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
