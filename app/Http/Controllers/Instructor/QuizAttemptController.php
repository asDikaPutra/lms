<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizAttemptController extends Controller
{
    public function grade(Request $request, QuizAttempt $attempt): RedirectResponse
    {
        abort_unless($this->ownedQuizIds($request)->contains($attempt->quiz_id), 403);

        $validated = $request->validate([
            'essay_scores' => ['required', 'array'],
            'essay_scores.*' => ['nullable', 'numeric', 'min:0'],
        ]);

        $attempt->load(['quiz.questions', 'quiz.quizzable', 'user']);

        $essayScores = collect($validated['essay_scores'])
            ->mapWithKeys(fn ($score, $questionId) => [(int) $questionId => (float) ($score ?? 0)]);

        // Preserve original answers format and update essay entries
        $answers = $attempt->answers ?? [];
        foreach ($attempt->quiz->questions as $question) {
            if ($question->type === 'essay') {
                $essayScore = min($essayScores->get($question->id, 0), (float) $question->points);
                $answers[$question->id] = [
                    'answer' => $answers[$question->id]['answer'] ?? null,
                    'time_taken' => $answers[$question->id]['time_taken'] ?? 0,
                    'is_correct' => $essayScore >= (float) $question->points,
                    'points' => (int) $essayScore,
                    'answered_at' => $answers[$question->id]['answered_at'] ?? now()->toISOString(),
                ];
            }
        }

        // Recalculate total score as percentage (excluding ungraded essay = already graded here)
        $totalPoints = (float) $attempt->quiz->questions->sum('points');
        $earnedPoints = collect($answers)->sum('points');
        $score = $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 2) : 0;

        $attempt->update([
            'answers' => $answers,
            'score' => $score,
            'status' => 'graded',
            'finished_at' => $attempt->finished_at ?? now(),
        ]);

        // Notify student
        $attempt->user->notify(new \App\Notifications\QuizGradedNotification($attempt));

        return back()->with('status', 'Nilai quiz berhasil disimpan.');
    }

    private function ownedQuizIds(Request $request)
    {
        return Quiz::query()
            ->where(function ($query) use ($request): void {
                $query
                    ->whereHasMorph('quizzable', [Module::class], fn ($moduleQuery) => $moduleQuery
                        ->whereHas('course', fn ($courseQuery) => $courseQuery->where('instructor_id', $request->user()->id)))
                    ->orWhereHasMorph('quizzable', [Material::class], fn ($materialQuery) => $materialQuery
                        ->whereHas('module.course', fn ($courseQuery) => $courseQuery->where('instructor_id', $request->user()->id)));
            })
            ->pluck('id');
    }

    private function attemptPayload(QuizAttempt $attempt): array
    {
        return [
            'id' => $attempt->id,
            'student' => $attempt->user,
            'score' => $attempt->score,
            'status' => $attempt->status,
            'finished_at' => $attempt->finished_at,
            'quiz' => [
                'id' => $attempt->quiz->id,
                'title' => $attempt->quiz->title,
                'passing_score' => $attempt->quiz->passing_score,
                'questions' => $attempt->quiz->questions->map(fn ($question) => [
                    'id' => $question->id,
                    'question' => $question->question,
                    'type' => $question->type,
                    'points' => $question->points,
                    'answer' => $this->responses($attempt->answers)[$question->id] ?? null,
                ]),
            ],
        ];
    }

    private function responses(?array $answers): array
    {
        if (! $answers) {
            return [];
        }

        return $answers['responses'] ?? $answers;
    }
}
