<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Material;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class QuizSystemTest extends TestCase
{
    use RefreshDatabase;

    public function test_instructor_can_create_publish_and_add_questions_to_owned_quiz(): void
    {
        $instructor = User::factory()->instructor()->create();
        $course = Course::factory()->create(['instructor_id' => $instructor->id]);
        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Modul Quiz',
            'order' => 1,
            'is_published' => true,
        ]);

        $this->actingAs($instructor)
            ->post('/instructor/quizzes', [
                'quizzable_type' => 'module',
                'quizzable_id' => $module->id,
                'title' => 'Quiz Pembuka',
                'duration' => 30,
                'result_mode' => 'immediate',
                'passing_score' => 70,
                'is_published' => false,
            ])
            ->assertRedirect();

        $quiz = Quiz::query()->where('title', 'Quiz Pembuka')->firstOrFail();

        $this->assertFalse($quiz->is_published);

        $this->actingAs($instructor)
            ->post("/instructor/quizzes/{$quiz->id}/questions", [
                'question' => 'Apa hukum menuntut ilmu?',
                'type' => 'multiple_choice',
                'options_text' => "Wajib\nMubah\nMakruh",
                'correct_answer' => 'Wajib',
                'points' => 10,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('quiz_questions', [
            'quiz_id' => $quiz->id,
            'type' => 'multiple_choice',
            'correct_answer' => 'Wajib',
        ]);

        $this->actingAs($instructor)
            ->patch("/instructor/quizzes/{$quiz->id}/toggle")
            ->assertRedirect();

        $this->assertTrue($quiz->refresh()->is_published);
    }

    public function test_instructor_can_create_quiz_for_material_scope(): void
    {
        $instructor = User::factory()->instructor()->create();
        $course = Course::factory()->create(['instructor_id' => $instructor->id]);
        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Modul Quiz',
            'order' => 1,
            'is_published' => true,
        ]);
        $material = Material::query()->create([
            'module_id' => $module->id,
            'title' => 'Materi Quiz',
            'order' => 1,
            'is_published' => true,
        ]);

        $this->actingAs($instructor)
            ->post('/instructor/quizzes', [
                'quizzable_type' => 'material',
                'quizzable_id' => $material->id,
                'title' => 'Quiz Materi',
                'duration' => 20,
                'result_mode' => 'immediate',
                'passing_score' => 75,
                'is_published' => false,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('quizzes', [
            'title' => 'Quiz Materi',
            'quizzable_type' => 'material',
            'quizzable_id' => $material->id,
        ]);
    }

    public function test_instructor_cannot_manage_quiz_from_another_instructor_course(): void
    {
        $instructor = User::factory()->instructor()->create();
        $otherInstructor = User::factory()->instructor()->create();
        $course = Course::factory()->create(['instructor_id' => $otherInstructor->id]);
        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Modul Orang Lain',
            'order' => 1,
            'is_published' => true,
        ]);
        $quiz = $module->quizzes()->create([
            'title' => 'Quiz Tertutup',
            'duration' => 20,
            'result_mode' => 'immediate',
            'passing_score' => 70,
            'is_published' => false,
        ]);

        $this->actingAs($instructor)
            ->patch("/instructor/quizzes/{$quiz->id}/toggle")
            ->assertForbidden();
    }

    public function test_student_course_page_contains_published_quiz_without_correct_answers(): void
    {
        $this->withoutVite();

        $student = User::factory()->student()->create();
        $course = Course::factory()->create();
        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Modul Published',
            'order' => 1,
            'is_published' => true,
        ]);
        $quiz = $module->quizzes()->create([
            'title' => 'Quiz Published',
            'duration' => 15,
            'result_mode' => 'immediate',
            'passing_score' => 70,
            'is_published' => true,
        ]);
        $quiz->questions()->create([
            'question' => 'Pilih jawaban benar',
            'type' => 'multiple_choice',
            'options' => ['A', 'B'],
            'correct_answer' => 'A',
            'points' => 10,
            'order' => 1,
        ]);
        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $this->actingAs($student)
            ->get("/student/courses/{$course->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Courses/Show')
                ->where('course.modules.0.quizzes.0.title', 'Quiz Published')
                ->where('course.modules.0.quizzes.0.max_attempts', 1)
                ->where('course.modules.0.quizzes.0.questions.0.question', 'Pilih jawaban benar')
                ->missing('course.modules.0.quizzes.0.questions.0.correct_answer'));
    }

    public function test_student_course_page_hides_score_for_non_immediate_result_mode(): void
    {
        $this->withoutVite();

        $student = User::factory()->student()->create();
        $course = Course::factory()->create();
        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Modul Published',
            'order' => 1,
            'is_published' => true,
        ]);
        $quiz = $module->quizzes()->create([
            'title' => 'Quiz Delayed',
            'result_mode' => 'delayed',
            'passing_score' => 70,
            'is_published' => true,
        ]);
        QuizAttempt::query()->create([
            'quiz_id' => $quiz->id,
            'user_id' => $student->id,
            'answers' => [],
            'score' => 100,
            'status' => 'graded',
            'started_at' => now(),
            'finished_at' => now(),
        ]);
        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $this->actingAs($student)
            ->get("/student/courses/{$course->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Courses/Show')
                ->where("attemptsByQuizId.{$quiz->id}.score", null));
    }

    public function test_student_objective_quiz_attempt_is_auto_graded(): void
    {
        $student = User::factory()->student()->create();
        $course = Course::factory()->create();
        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Modul',
            'order' => 1,
            'is_published' => true,
        ]);
        $quiz = $module->quizzes()->create([
            'title' => 'Quiz Objective',
            'result_mode' => 'immediate',
            'passing_score' => 70,
            'is_published' => true,
        ]);
        $questionA = $quiz->questions()->create([
            'question' => 'Benar?',
            'type' => 'true_false',
            'options' => ['true', 'false'],
            'correct_answer' => 'true',
            'points' => 5,
            'order' => 1,
        ]);
        $questionB = $quiz->questions()->create([
            'question' => 'Pilih?',
            'type' => 'multiple_choice',
            'options' => ['A', 'B'],
            'correct_answer' => 'A',
            'points' => 5,
            'order' => 2,
        ]);
        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $this->actingAs($student)
            ->post("/student/quizzes/{$quiz->id}/attempts", [
                'answers' => [
                    $questionA->id => 'true',
                    $questionB->id => 'B',
                ],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('quiz_attempts', [
            'quiz_id' => $quiz->id,
            'user_id' => $student->id,
            'score' => 50,
            'status' => 'graded',
        ]);
    }

    public function test_student_quiz_attempt_is_recorded_when_timer_auto_submits_after_duration(): void
    {
        $student = User::factory()->student()->create();
        $course = Course::factory()->create();
        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Modul',
            'order' => 1,
            'is_published' => true,
        ]);
        $quiz = $module->quizzes()->create([
            'title' => 'Quiz Timer',
            'duration' => 1,
            'result_mode' => 'immediate',
            'passing_score' => 70,
            'is_published' => true,
        ]);
        $question = $quiz->questions()->create([
            'question' => 'Benar?',
            'type' => 'true_false',
            'options' => ['true', 'false'],
            'correct_answer' => 'true',
            'points' => 10,
            'order' => 1,
        ]);
        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $this->actingAs($student)
            ->post("/student/quizzes/{$quiz->id}/attempts", [
                'answers' => [
                    $question->id => 'true',
                ],
                'started_at' => now()->subMinutes(2)->toISOString(),
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('quiz_attempts', [
            'quiz_id' => $quiz->id,
            'user_id' => $student->id,
            'score' => 100,
            'status' => 'graded',
        ]);
    }

    public function test_student_essay_quiz_attempt_waits_for_grading(): void
    {
        $student = User::factory()->student()->create();
        $course = Course::factory()->create();
        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Modul',
            'order' => 1,
            'is_published' => true,
        ]);
        $material = Material::query()->create([
            'module_id' => $module->id,
            'title' => 'Materi',
            'order' => 1,
            'is_published' => true,
        ]);
        $quiz = $material->quizzes()->create([
            'title' => 'Quiz Essay',
            'result_mode' => 'custom',
            'passing_score' => 70,
            'is_published' => true,
        ]);
        $question = $quiz->questions()->create([
            'question' => 'Jelaskan hikmah menuntut ilmu.',
            'type' => 'essay',
            'points' => 10,
            'order' => 1,
        ]);
        Enrollment::factory()->active()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $this->actingAs($student)
            ->post("/student/quizzes/{$quiz->id}/attempts", [
                'answers' => [
                    $question->id => 'Menjadi lebih dekat kepada Allah.',
                ],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('quiz_attempts', [
            'quiz_id' => $quiz->id,
            'user_id' => $student->id,
            'status' => 'submitted',
        ]);
    }

    public function test_instructor_can_view_and_grade_owned_essay_attempt(): void
    {
        $instructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();
        $course = Course::factory()->create(['instructor_id' => $instructor->id]);
        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Modul',
            'order' => 1,
            'is_published' => true,
        ]);
        $quiz = $module->quizzes()->create([
            'title' => 'Quiz Essay',
            'result_mode' => 'custom',
            'passing_score' => 70,
            'is_published' => true,
        ]);
        $objective = $quiz->questions()->create([
            'question' => 'Benar?',
            'type' => 'true_false',
            'options' => ['true', 'false'],
            'correct_answer' => 'true',
            'points' => 5,
            'order' => 1,
        ]);
        $essay = $quiz->questions()->create([
            'question' => 'Jelaskan hikmah belajar.',
            'type' => 'essay',
            'points' => 5,
            'order' => 2,
        ]);
        $attempt = QuizAttempt::query()->create([
            'quiz_id' => $quiz->id,
            'user_id' => $student->id,
            'answers' => [
                $objective->id => 'true',
                $essay->id => 'Jawaban essay.',
            ],
            'score' => 50,
            'status' => 'submitted',
            'started_at' => now(),
            'finished_at' => now(),
        ]);

        $this->actingAs($instructor)
            ->get('/instructor/quiz-attempts')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Instructor/QuizAttempts/Index')
                ->where('attempts.0.quiz.title', 'Quiz Essay')
                ->where('attempts.0.quiz.questions.1.answer', 'Jawaban essay.'));

        $this->actingAs($instructor)
            ->put("/instructor/quiz-attempts/{$attempt->id}/grade", [
                'essay_scores' => [
                    $essay->id => 3,
                ],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('quiz_attempts', [
            'id' => $attempt->id,
            'score' => 80,
            'status' => 'graded',
        ]);
    }

    public function test_instructor_cannot_grade_attempt_from_another_instructor_course(): void
    {
        $instructor = User::factory()->instructor()->create();
        $otherInstructor = User::factory()->instructor()->create();
        $student = User::factory()->student()->create();
        $course = Course::factory()->create(['instructor_id' => $otherInstructor->id]);
        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Modul',
            'order' => 1,
            'is_published' => true,
        ]);
        $quiz = $module->quizzes()->create([
            'title' => 'Quiz Essay',
            'result_mode' => 'custom',
            'passing_score' => 70,
            'is_published' => true,
        ]);
        $essay = $quiz->questions()->create([
            'question' => 'Jelaskan hikmah belajar.',
            'type' => 'essay',
            'points' => 5,
            'order' => 1,
        ]);
        $attempt = QuizAttempt::query()->create([
            'quiz_id' => $quiz->id,
            'user_id' => $student->id,
            'answers' => [
                $essay->id => 'Jawaban essay.',
            ],
            'score' => 0,
            'status' => 'submitted',
            'started_at' => now(),
            'finished_at' => now(),
        ]);

        $this->actingAs($instructor)
            ->put("/instructor/quiz-attempts/{$attempt->id}/grade", [
                'essay_scores' => [
                    $essay->id => 5,
                ],
            ])
            ->assertForbidden();
    }
}
