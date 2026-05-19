<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Material;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizQuestion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizPlayFlowTest extends TestCase
{
    use RefreshDatabase;

    private User $student;
    private Quiz $quiz;
    private QuizQuestion $question1;
    private QuizQuestion $question2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->student = User::factory()->create(['role' => 'student']);
        
        $instructor = User::factory()->create(['role' => 'instructor']);
        $course = Course::factory()->create(['instructor_id' => $instructor->id]);
        
        $module = Module::create([
            'course_id' => $course->id,
            'title' => 'Test Module',
            'order' => 1,
            'is_published' => true,
        ]);
        
        $material = Material::create([
            'module_id' => $module->id,
            'title' => 'Test Material',
            'type' => 'quiz',
            'order' => 1,
            'is_published' => true,
        ]);

        $this->quiz = Quiz::create([
            'title' => 'Test Quiz',
            'quizzable_type' => Material::class,
            'quizzable_id' => $material->id,
            'is_published' => true,
            'max_attempts' => 3,
            'passing_score' => 70,
        ]);

        $this->question1 = QuizQuestion::create([
            'quiz_id' => $this->quiz->id,
            'question' => 'What is 2+2?',
            'type' => 'multiple_choice',
            'options' => ['3', '4', '5', '6'],
            'correct_answer' => '4',
            'points' => 100,
            'time_limit' => 30,
            'order' => 1,
        ]);

        $this->question2 = QuizQuestion::create([
            'quiz_id' => $this->quiz->id,
            'question' => 'What is 3+3?',
            'type' => 'multiple_choice',
            'options' => ['5', '6', '7', '8'],
            'correct_answer' => '6',
            'points' => 100,
            'time_limit' => 30,
            'order' => 2,
        ]);
    }

    public function test_student_can_view_quiz_info(): void
    {
        $response = $this->actingAs($this->student)
            ->get(route('student.quizzes.show', $this->quiz));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Student/Quiz/Show')
            ->has('quiz')
            ->where('canAttempt', true)
        );
    }

    public function test_student_can_start_quiz(): void
    {
        $response = $this->actingAs($this->student)
            ->postJson(route('student.quizzes.start', $this->quiz));

        $response->assertOk();
        $response->assertJsonStructure(['attempt_id']);

        $this->assertDatabaseHas('quiz_attempts', [
            'quiz_id' => $this->quiz->id,
            'user_id' => $this->student->id,
            'status' => 'in_progress',
        ]);
    }

    public function test_student_cannot_exceed_max_attempts(): void
    {
        // Create 3 attempts
        for ($i = 0; $i < 3; $i++) {
            QuizAttempt::create([
                'quiz_id' => $this->quiz->id,
                'user_id' => $this->student->id,
                'status' => 'completed',
                'started_at' => now(),
            ]);
        }

        $response = $this->actingAs($this->student)
            ->postJson(route('student.quizzes.start', $this->quiz));

        $response->assertForbidden();
    }

    public function test_student_can_get_question(): void
    {
        $attempt = QuizAttempt::create([
            'quiz_id' => $this->quiz->id,
            'user_id' => $this->student->id,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $response = $this->actingAs($this->student)
            ->getJson(route('student.quizzes.get-question', [$attempt, 1]));

        $response->assertOk();
        $response->assertJson([
            'question' => [
                'id' => $this->question1->id,
                'question' => 'What is 2+2?',
                'type' => 'multiple_choice',
                'options' => ['3', '4', '5', '6'],
                'time_limit' => 30,
                'points' => 100,
            ],
            'current' => 1,
            'total' => 2,
        ]);
    }

    public function test_student_can_submit_correct_answer(): void
    {
        $attempt = QuizAttempt::create([
            'quiz_id' => $this->quiz->id,
            'user_id' => $this->student->id,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $response = $this->actingAs($this->student)
            ->postJson(route('student.quizzes.submit-answer', [$attempt, 1]), [
                'answer' => '4',
                'time_taken' => 5, // Fast answer
            ]);

        $response->assertOk();
        $response->assertJson([
            'is_correct' => true,
            'correct_answer' => '4',
        ]);

        // Should get speed bonus (answered in first 25% of time)
        $this->assertGreaterThan(100, $response->json('points'));

        $attempt->refresh();
        $this->assertArrayHasKey($this->question1->id, $attempt->answers);
        $this->assertTrue($attempt->answers[$this->question1->id]['is_correct']);
    }

    public function test_student_can_submit_incorrect_answer(): void
    {
        $attempt = QuizAttempt::create([
            'quiz_id' => $this->quiz->id,
            'user_id' => $this->student->id,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $response = $this->actingAs($this->student)
            ->postJson(route('student.quizzes.submit-answer', [$attempt, 1]), [
                'answer' => '3',
                'time_taken' => 10,
            ]);

        $response->assertOk();
        $response->assertJson([
            'is_correct' => false,
            'points' => 0,
            'correct_answer' => '4',
        ]);

        $attempt->refresh();
        $this->assertFalse($attempt->answers[$this->question1->id]['is_correct']);
        $this->assertEquals(0, $attempt->answers[$this->question1->id]['points']);
    }

    public function test_speed_bonus_calculation(): void
    {
        $attempt = QuizAttempt::create([
            'quiz_id' => $this->quiz->id,
            'user_id' => $this->student->id,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        // Very fast answer (within 25% of time limit)
        $response1 = $this->actingAs($this->student)
            ->postJson(route('student.quizzes.submit-answer', [$attempt, 1]), [
                'answer' => '4',
                'time_taken' => 5, // 5s out of 30s = 16.7%
            ]);

        $this->assertEquals(150, $response1->json('points')); // 100 + 50% bonus

        // Medium speed answer (within 50% of time limit)
        $response2 = $this->actingAs($this->student)
            ->postJson(route('student.quizzes.submit-answer', [$attempt, 2]), [
                'answer' => '6',
                'time_taken' => 12, // 12s out of 30s = 40%
            ]);

        $this->assertEquals(125, $response2->json('points')); // 100 + 25% bonus
    }

    public function test_student_can_finish_quiz(): void
    {
        $attempt = QuizAttempt::create([
            'quiz_id' => $this->quiz->id,
            'user_id' => $this->student->id,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        // Submit answers
        $attempt->recordAnswer($this->question1->id, '4', 5, true, 150);
        $attempt->recordAnswer($this->question2->id, '6', 10, true, 125);

        $response = $this->actingAs($this->student)
            ->postJson(route('student.quizzes.finish', $attempt));

        $response->assertOk();
        $response->assertJson([
            'score' => 275,
            'attempt_id' => $attempt->id,
        ]);

        $attempt->refresh();
        $this->assertEquals('completed', $attempt->status);
        $this->assertEquals(275, $attempt->score);
        $this->assertNotNull($attempt->finished_at);
    }

    public function test_student_can_view_quiz_result(): void
    {
        $attempt = QuizAttempt::create([
            'quiz_id' => $this->quiz->id,
            'user_id' => $this->student->id,
            'status' => 'completed',
            'score' => 200,
            'started_at' => now(),
        ]);

        $response = $this->actingAs($this->student)
            ->get(route('student.quizzes.result', $attempt));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Student/Quiz/Result')
            ->has('attempt')
        );
    }

    public function test_student_cannot_access_other_student_attempt(): void
    {
        $otherStudent = User::factory()->create(['role' => 'student']);
        $attempt = QuizAttempt::create([
            'quiz_id' => $this->quiz->id,
            'user_id' => $otherStudent->id,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $response = $this->actingAs($this->student)
            ->getJson(route('student.quizzes.get-question', [$attempt, 1]));

        $response->assertForbidden();
    }
}
