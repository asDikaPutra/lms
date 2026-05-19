<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function show(Quiz $quiz): Response
    {
        $quiz->load('questions');
        
        $userAttempts = QuizAttempt::where('quiz_id', $quiz->id)
            ->where('user_id', auth()->id())
            ->count();

        return Inertia::render('Student/Quiz/Show', [
            'quiz' => $quiz,
            'userAttempts' => $userAttempts,
            'canAttempt' => $quiz->max_attempts === null || $userAttempts < $quiz->max_attempts,
        ]);
    }

    public function start(Quiz $quiz)
    {
        $userAttempts = QuizAttempt::where('quiz_id', $quiz->id)
            ->where('user_id', auth()->id())
            ->count();

        if ($quiz->max_attempts !== null && $userAttempts >= $quiz->max_attempts) {
            return back()->with('error', 'Maximum attempts reached');
        }

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => auth()->id(),
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        return redirect()->route('student.quizzes.get-question', [$attempt, 1]);
    }

    public function getQuestion(Request $request, QuizAttempt $attempt, int $questionNumber): JsonResponse|Response
    {
        if ($attempt->user_id !== auth()->id()) {
            abort(403);
        }

        if ($attempt->status !== 'in_progress') {
            abort(400, 'Quiz not in progress');
        }

        // If this is a page load (not AJAX), render Inertia page
        if (!$request->wantsJson()) {
            return Inertia::render('Student/Quiz/QuizPlay', [
                'attemptId' => $attempt->id,
                'questionNumber' => $questionNumber,
            ]);
        }

        $question = QuizQuestion::where('quiz_id', $attempt->quiz_id)
            ->orderBy('order')
            ->skip($questionNumber - 1)
            ->first();

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $totalQuestions = QuizQuestion::where('quiz_id', $attempt->quiz_id)->count();

        return response()->json([
            'question' => [
                'id' => $question->id,
                'question' => $question->question,
                'type' => $question->type,
                'options' => $question->options,
                'time_limit' => $question->time_limit,
                'points' => $question->points,
            ],
            'current' => $questionNumber,
            'total' => $totalQuestions,
        ]);
    }

    public function submitAnswer(Request $request, QuizAttempt $attempt, int $questionNumber): JsonResponse
    {
        if ($attempt->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($attempt->status !== 'in_progress') {
            return response()->json(['message' => 'Quiz not in progress'], 400);
        }

        $validated = $request->validate([
            'answer' => 'required',
            'time_taken' => 'required|integer|min:0',
        ]);

        $question = QuizQuestion::where('quiz_id', $attempt->quiz_id)
            ->orderBy('order')
            ->skip($questionNumber - 1)
            ->first();

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        // Check if answer is correct
        $isCorrect = $this->checkAnswer($question, $validated['answer']);
        
        // Calculate points based on speed (Quizizz style)
        $points = 0;
        if ($isCorrect) {
            $timeLimit = $question->time_limit;
            $timeTaken = $validated['time_taken'];
            
            // Base points
            $basePoints = $question->points;
            
            // Speed bonus: 0-50% bonus based on speed
            // If answered in first 25% of time: 50% bonus
            // If answered in first 50% of time: 25% bonus
            // Otherwise: no bonus
            $speedBonus = 0;
            if ($timeTaken <= $timeLimit * 0.25) {
                $speedBonus = $basePoints * 0.5;
            } elseif ($timeTaken <= $timeLimit * 0.5) {
                $speedBonus = $basePoints * 0.25;
            }
            
            $points = (int) ($basePoints + $speedBonus);
        }

        $attempt->recordAnswer(
            $question->id,
            $validated['answer'],
            $validated['time_taken'],
            $isCorrect,
            $points
        );

        return response()->json([
            'is_correct' => $isCorrect,
            'points' => $points,
            'correct_answer' => $question->correct_answer,
        ]);
    }

    public function finish(QuizAttempt $attempt): JsonResponse
    {
        if ($attempt->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($attempt->status !== 'in_progress') {
            return response()->json(['message' => 'Quiz not in progress'], 400);
        }

        $score = $attempt->calculateScore();
        
        $attempt->update([
            'status' => 'completed',
            'score' => $score,
            'finished_at' => now(),
        ]);

        return response()->json([
            'score' => $score,
            'attempt_id' => $attempt->id,
        ]);
    }

    public function result(QuizAttempt $attempt): Response
    {
        if ($attempt->user_id !== auth()->id()) {
            abort(403);
        }

        $attempt->load(['quiz.questions', 'quiz.quizzable']);
        
        // Get course_id from Material -> Module -> Course
        $courseId = null;
        if ($attempt->quiz->quizzable_type === 'App\\Models\\Material') {
            $material = $attempt->quiz->quizzable;
            if ($material && $material->module) {
                $courseId = $material->module->course_id;
            }
        }

        return Inertia::render('Student/Quiz/Result', [
            'attempt' => $attempt,
            'courseId' => $courseId,
        ]);
    }

    private function checkAnswer(QuizQuestion $question, mixed $answer): bool
    {
        if ($question->type === 'multiple_choice' || $question->type === 'true_false') {
            return $answer === $question->correct_answer;
        }

        // For essay, we'll need manual grading
        return false;
    }
}
