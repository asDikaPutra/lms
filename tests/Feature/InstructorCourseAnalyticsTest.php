<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Assignment;
use App\Models\Content;
use App\Models\ContentProgress;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Material;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizQuestion;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Characterization tests for the instructor course analytics pages
 * (students / grades / progress). These lock the EXACT computed numbers
 * the controller produces today so the service extraction can be proven
 * behavior-preserving.
 */
class InstructorCourseAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    private User $instructor;

    private Course $course;

    private User $alice;

    private User $bob;

    private Quiz $quiz;

    private Assignment $assignment;

    private Content $content1;

    private Content $content2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->instructor = User::factory()->instructor()->create();
        $this->course = Course::factory()->create(['instructor_id' => $this->instructor->id]);

        $module = Module::create([
            'course_id' => $this->course->id,
            'title' => 'Module 1',
            'order' => 1,
            'is_published' => true,
        ]);

        $material = Material::create([
            'module_id' => $module->id,
            'title' => 'Material 1',
            'order' => 1,
            'is_published' => true,
        ]);

        // Two contents under the material.
        $this->content1 = Content::create([
            'material_id' => $material->id,
            'type' => 'artikel',
            'title' => 'Content 1',
            'body' => 'Body 1',
            'order' => 1,
        ]);
        $this->content2 = Content::create([
            'material_id' => $material->id,
            'type' => 'artikel',
            'title' => 'Content 2',
            'body' => 'Body 2',
            'order' => 2,
        ]);

        // One published assignment on the material (morph alias 'material').
        $this->assignment = new Assignment([
            'title' => 'Assignment 1',
            'description' => 'Desc',
            'deadline' => now()->addWeek(),
            'is_published' => true,
        ]);
        $this->assignment->assignable_type = 'material';
        $this->assignment->assignable_id = $material->id;
        $this->assignment->save();

        // One published quiz on the material.
        $this->quiz = Quiz::create([
            'title' => 'Quiz 1',
            'quizzable_type' => 'material',
            'quizzable_id' => $material->id,
            'is_published' => true,
            'result_mode' => 'immediate',
            'max_attempts' => 3,
        ]);
        QuizQuestion::create([
            'quiz_id' => $this->quiz->id,
            'question' => 'Q1',
            'type' => 'multiple_choice',
            'options' => ['a', 'b'],
            'correct_answer' => 'a',
            'points' => 100,
            'time_limit' => 30,
            'order' => 1,
        ]);

        // Two active students.
        $this->alice = User::factory()->create(['role' => 'student', 'name' => 'Alice']);
        $this->bob = User::factory()->create(['role' => 'student', 'name' => 'Bob']);

        foreach ([$this->alice, $this->bob] as $student) {
            Enrollment::create([
                'user_id' => $student->id,
                'course_id' => $this->course->id,
                'status' => 'active',
                'enrolled_at' => now(),
            ]);
        }

        // Alice completes everything: 2 contents, 1 submission (graded 80), 1 finished quiz (score 90).
        ContentProgress::create(['user_id' => $this->alice->id, 'content_id' => $this->content1->id, 'completed_at' => now()]);
        ContentProgress::create(['user_id' => $this->alice->id, 'content_id' => $this->content2->id, 'completed_at' => now()]);
        Submission::create([
            'assignment_id' => $this->assignment->id,
            'user_id' => $this->alice->id,
            'grade' => 80,
            'status' => 'graded',
            'submitted_at' => now(),
        ]);
        QuizAttempt::create([
            'quiz_id' => $this->quiz->id,
            'user_id' => $this->alice->id,
            'status' => 'completed',
            'score' => 90,
            'started_at' => now(),
            'finished_at' => now(),
        ]);

        // Bob does nothing (0 progress, at risk).
    }

    public function test_students_page_progress_numbers(): void
    {
        $this->actingAs($this->instructor)
            ->get("/instructor/courses/{$this->course->id}/students")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Instructor/Courses/Students')
                ->where('stats.total', 2)
                ->where('stats.active', 2)
                ->where('stats.pending', 0)
                ->where('stats.at_risk', 1)        // Bob at 0%
                ->where('stats.avg_progress', 50)  // Alice 100, Bob 0 -> avg 50
                ->has('enrollments', 2)
            );
    }

    public function test_grades_page_numbers(): void
    {
        $this->actingAs($this->instructor)
            ->get("/instructor/courses/{$this->course->id}/grades")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Instructor/Courses/Grades')
                // Alice: assignment_avg 80, quiz_avg 90, final 85. Bob: all null.
                ->where('stats.avg_grade', 85)
                ->where('stats.highest', 85)
                ->where('stats.lowest', 85)
                ->where('stats.incomplete', 1)   // Bob incomplete
                ->where('stats.needs_grading', 0)
                ->has('gradebook', 2)
            );
    }

    public function test_progress_page_numbers(): void
    {
        $this->actingAs($this->instructor)
            ->get("/instructor/courses/{$this->course->id}/progress")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Instructor/Courses/Progress')
                ->where('stats.avg_progress', 50)
                ->where('stats.at_risk', 1)
                ->has('studentProgress', 2)
                ->has('moduleProgress', 1)
            );
    }
}
