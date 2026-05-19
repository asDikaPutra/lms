<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Module;
use App\Models\Quiz;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class QuizController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'quizzable_type' => ['required', Rule::in(['module', 'material'])],
            'quizzable_id' => ['required', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'duration' => ['nullable', 'integer', 'min:1', 'max:600'],
            'result_mode' => ['required', Rule::in(['immediate', 'delayed', 'custom'])],
            'passing_score' => ['required', 'integer', 'min:0', 'max:100'],
            'max_attempts' => ['nullable', 'integer', 'min:1', 'max:10'],
            'is_published' => ['boolean'],
        ]);

        $parent = $this->resolveParent($validated['quizzable_type'], (int) $validated['quizzable_id']);
        Gate::authorize('update', $parent);

        $parent->quizzes()->create([
            'title' => $validated['title'],
            'duration' => $validated['duration'] ?? null,
            'result_mode' => $validated['result_mode'],
            'passing_score' => $validated['passing_score'],
            'max_attempts' => $validated['max_attempts'] ?? 1,
            'is_published' => (bool) ($validated['is_published'] ?? false),
        ]);

        return back()->with('success', 'Quiz berhasil dibuat.');
    }

    public function edit(Quiz $quiz)
    {
        Gate::authorize('manage', $quiz);

        $quiz->load(['questions' => fn ($query) => $query->orderBy('order')]);
        
        $quizzable = $quiz->quizzable;
        $courseId = $quizzable instanceof Module 
            ? $quizzable->course_id 
            : $quizzable->module->course_id;

        return inertia('Instructor/Quizzes/Edit', [
            'quiz' => $quiz,
            'course_id' => $courseId,
        ]);
    }

    public function update(Request $request, Quiz $quiz): RedirectResponse
    {
        Gate::authorize('manage', $quiz);

        $quiz->update($request->validate([
            'title' => ['required', 'string', 'max:255'],
            'duration' => ['nullable', 'integer', 'min:1', 'max:600'],
            'result_mode' => ['required', Rule::in(['immediate', 'delayed', 'custom'])],
            'passing_score' => ['required', 'integer', 'min:0', 'max:100'],
            'max_attempts' => ['required', 'integer', 'min:1', 'max:10'],
            'is_published' => ['boolean'],
        ]));

        return back()->with('success', 'Quiz berhasil diperbarui.');
    }

    public function toggle(Quiz $quiz): RedirectResponse
    {
        Gate::authorize('manage', $quiz);

        $quiz->update(['is_published' => ! $quiz->is_published]);

        return back()->with('success', $quiz->is_published ? 'Quiz dipublish.' : 'Quiz disembunyikan.');
    }

    public function destroy(Quiz $quiz): RedirectResponse
    {
        Gate::authorize('manage', $quiz);

        $quiz->delete();

        return back()->with('success', 'Quiz berhasil dihapus.');
    }

    private function resolveParent(string $type, int $id): Module|Material
    {
        return $type === 'module'
            ? Module::query()->findOrFail($id)
            : Material::query()->findOrFail($id);
    }
}
