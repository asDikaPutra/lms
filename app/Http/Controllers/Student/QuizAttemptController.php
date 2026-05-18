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

        if ($attemptCount >= $quiz->max_attempts) {
            return back()->with('error', "Anda sudah mencapai batas maksimal percobaan ({$quiz->max_attempts}x).");
        }

        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'started_at' => ['required', 'date'],
        ]);

        // Validate time limit if quiz has duration
        if ($quiz->duration) {
            $startedAt = \Carbon\Carbon::parse($validated['started_at']);
            $elapsedMinutes = $startedAt->diffInMinutes(now());
            
            if ($elapsedMinutes > $quiz->duration) {
                return back()->with('error', 'Waktu quiz telah habis. Jawaban tidak dapat dikirim.');
            }
        }

        $hasEssay = false;
        $earned = 0;
        $total = 0;
        $answers = $validated['answers'];

        foreach ($quiz->questions as $question) {
            $total += (int) $question->points;
            $answer = $answers[$question->id] ?? null;

            if ($question->type === 'essay') {
                $hasEssay = true;

                continue;
            }

            if ($this->sameAnswer($answer, $question->correct_answer)) {
                $earned += (int) $question->points;
            }
        }

        QuizAttempt::query()->create([
            'quiz_id' => $quiz->id,
            'user_id' => $request->user()->id,
            'answers' => $answers,
            'score' => $total > 0 ? round(($earned / $total) * 100, 2) : 0,
            'status' => $hasEssay ? 'submitted' : 'graded',
            'started_at' => $validated['started_at'],
            'finished_at' => now(),
        ]);

        return back()->with('success', $hasEssay ? 'Jawaban quiz dikirim dan menunggu penilaian essay.' : 'Quiz selesai dan nilai sudah dihitung.');
    }

    private function sameAnswer(mixed $answer, ?string $correctAnswer): bool
    {
        return mb_strtolower(trim((string) $answer)) === mb_strtolower(trim((string) $correctAnswer));
    }
}
