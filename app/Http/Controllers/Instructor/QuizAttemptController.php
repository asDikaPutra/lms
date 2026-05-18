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
    public function index(Request $request): Response
    {
        $attempts = QuizAttempt::query()
            ->with(['quiz.questions', 'quiz.quizzable', 'user:id,name'])
            ->where('status', 'submitted')
            ->whereIn('quiz_id', $this->ownedQuizIds($request))
            ->latest('finished_at')
            ->get()
            ->map(fn (QuizAttempt $attempt) => $this->attemptPayload($attempt));

        return Inertia::render('Instructor/QuizAttempts/Index', [
            'attempts' => $attempts,
        ]);
    }

    public function grade(Request $request, QuizAttempt $attempt): RedirectResponse
    {
        abort_unless($this->ownedQuizIds($request)->contains($attempt->quiz_id), 403);

        $validated = $request->validate([
            'essay_scores' => ['required', 'array'],
            'essay_scores.*' => ['nullable', 'numeric', 'min:0'],
        ]);

        $attempt->load('quiz.questions');

        $responses = $this->responses($attempt->answers);
        $essayScores = collect($validated['essay_scores'])
            ->mapWithKeys(fn ($score, $questionId) => [(int) $questionId => (float) ($score ?? 0)]);

        $totalPoints = (float) $attempt->quiz->questions->sum('points');
        $earnedPoints = $attempt->quiz->questions->sum(function ($question) use ($responses, $essayScores): float {
            if ($question->type === 'essay') {
                return min((float) ($essayScores->get($question->id) ?? 0), (float) $question->points);
            }

            return (string) ($responses[$question->id] ?? '') === (string) $question->correct_answer
                ? (float) $question->points
                : 0.0;
        });

        $attempt->update([
            'answers' => [
                'responses' => $responses,
                'essay_scores' => $essayScores->all(),
            ],
            'score' => $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 2) : 0,
            'status' => 'graded',
            'finished_at' => now(),
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
