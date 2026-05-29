<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class QuizAttemptController extends Controller
{
    public function store(Request $request, Quiz $quiz): RedirectResponse
    {
        $quiz->load(['questions', 'quizzable']);
        Gate::authorize('attempt', $quiz);
        abort_unless($quiz->is_published, 403);

        // Check if user has reached max attempts
        $attemptCount = QuizAttempt::query()
            ->where('quiz_id', $quiz->id)
            ->where('user_id', $request->user()->id)
            ->count();

        if ($quiz->max_attempts !== null && $attemptCount >= $quiz->max_attempts) {
            return back()->with('error', "Anda sudah mencapai batas maksimal percobaan ({$quiz->max_attempts}x).");
        }

        $validated = $request->validate([
            'answers' => ['nullable', 'array'],
            'started_at' => ['nullable', 'date'],
        ]);

        $startedAt = isset($validated['started_at'])
            ? \Carbon\Carbon::parse($validated['started_at'])
            : now();

        $hasEssay = false;
        $earned = 0;
        $totalGradable = 0;
        $answers = $validated['answers'] ?? [];

        foreach ($quiz->questions as $question) {
            if ($question->type === 'essay') {
                $hasEssay = true;
                continue;
            }

            $totalGradable += (int) $question->points;
            $answer = $answers[$question->id] ?? null;

            if ($this->sameAnswer($answer, $question->correct_answer)) {
                $earned += (int) $question->points;
            }
        }

        QuizAttempt::query()->create([
            'quiz_id' => $quiz->id,
            'user_id' => $request->user()->id,
            'answers' => $answers,
            'score' => $totalGradable > 0 ? round(($earned / $totalGradable) * 100, 2) : 0,
            'status' => $hasEssay ? 'submitted' : 'graded',
            'started_at' => $startedAt,
            'finished_at' => now(),
        ]);

        return back()->with('success', $hasEssay ? 'Jawaban quiz dikirim dan menunggu penilaian essay.' : 'Quiz selesai dan nilai sudah dihitung.');
    }

    private function sameAnswer(mixed $answer, ?string $correctAnswer): bool
    {
        return mb_strtolower(trim((string) $answer)) === mb_strtolower(trim((string) $correctAnswer));
    }
}
