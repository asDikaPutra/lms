<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class QuizQuestionController extends Controller
{
    public function store(Request $request, Quiz $quiz): RedirectResponse
    {
        Gate::authorize('manage', $quiz);

        $validated = $this->validated($request);

        $quiz->questions()->create([
            ...$validated,
            'options' => $this->optionsFor($validated),
            'correct_answer' => $this->correctAnswerFor($validated),
            'order' => (int) $quiz->questions()->max('order') + 1,
        ]);

        return back()->with('success', 'Soal quiz berhasil ditambahkan.');
    }

    public function update(Request $request, QuizQuestion $question): RedirectResponse
    {
        Gate::authorize('manage', $question->quiz);

        $validated = $this->validated($request);

        $question->update([
            ...$validated,
            'options' => $this->optionsFor($validated),
            'correct_answer' => $this->correctAnswerFor($validated),
        ]);

        return back()->with('success', 'Soal quiz berhasil diperbarui.');
    }

    public function destroy(QuizQuestion $question): RedirectResponse
    {
        Gate::authorize('manage', $question->quiz);

        $question->delete();

        return back()->with('success', 'Soal quiz berhasil dihapus.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'question' => ['required', 'string'],
            'type' => ['required', Rule::in(['multiple_choice', 'true_false', 'essay'])],
            'options_text' => ['nullable', 'string'],
            'correct_answer' => ['nullable', 'string'],
            'points' => ['required', 'integer', 'min:1', 'max:100'],
        ]);
    }

    private function optionsFor(array $validated): ?array
    {
        if ($validated['type'] === 'true_false') {
            return ['true', 'false'];
        }

        if ($validated['type'] !== 'multiple_choice') {
            return null;
        }

        return collect(preg_split('/\r\n|\r|\n/', $validated['options_text'] ?? ''))
            ->map(fn (string $option) => trim($option))
            ->filter()
            ->values()
            ->all();
    }

    private function correctAnswerFor(array $validated): ?string
    {
        return $validated['type'] === 'essay' ? null : ($validated['correct_answer'] ?? null);
    }
}
