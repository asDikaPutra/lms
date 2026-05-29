<?php

namespace App\Http\Requests\Instructor;

use App\Models\Course;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $course = $this->route('course');

        return $course instanceof Course && $this->user()?->can('update', $course);
    }

    public function rules(): array
    {
        $course = $this->route('course');

        return [
            // Basic info
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:50|unique:courses,code,'.$course->id,
            'description' => 'nullable|string|max:5000',
            'semester' => 'nullable|string|max:50',

            // Status & Visibility
            'status' => 'sometimes|in:draft,active,closed,archived',
            'is_visible' => 'sometimes|boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'enrollment_type' => 'sometimes|in:auto,manual',

            // Settings sections
            'settings' => 'sometimes|array',
            'settings.learning' => 'sometimes|array',
            'settings.learning.order' => 'sometimes|in:free,sequential',
            'settings.learning.completion_rule' => 'sometimes|in:opened,read_complete,all_items',
            'settings.learning.enable_prerequisites' => 'sometimes|boolean',

            'settings.assignments' => 'sometimes|array',
            'settings.assignments.allow_late_submission' => 'sometimes|boolean',
            'settings.assignments.late_penalty_percent' => 'sometimes|integer|min:0|max:100',
            'settings.assignments.allow_resubmission' => 'sometimes|boolean',
            'settings.assignments.max_attempts' => 'sometimes|integer|min:1|max:10',
            'settings.assignments.default_submission_type' => 'sometimes|in:text,file,link,audio,video',

            'settings.quizzes' => 'sometimes|array',
            'settings.quizzes.default_attempt_limit' => 'sometimes|integer|min:1|max:10',
            'settings.quizzes.default_duration_minutes' => 'sometimes|integer|min:1|max:480',
            'settings.quizzes.shuffle_questions' => 'sometimes|boolean',
            'settings.quizzes.shuffle_options' => 'sometimes|boolean',
            'settings.quizzes.show_answers_after_submit' => 'sometimes|boolean',
            'settings.quizzes.show_score_after_submit' => 'sometimes|boolean',

            'settings.grades' => 'sometimes|array',
            'settings.grades.scale' => 'sometimes|in:0-100,letter',
            'settings.grades.passing_grade' => 'sometimes|integer|min:0|max:100',
            'settings.grades.rounding' => 'sometimes|in:none,one_decimal,integer',
            'settings.grades.weights' => 'sometimes|array',
            'settings.grades.weights.assignments' => 'sometimes|integer|min:0|max:100',
            'settings.grades.weights.quizzes' => 'sometimes|integer|min:0|max:100',
            'settings.grades.weights.discussions' => 'sometimes|integer|min:0|max:100',
            'settings.grades.weights.midterm' => 'sometimes|integer|min:0|max:100',
            'settings.grades.weights.final' => 'sometimes|integer|min:0|max:100',

            'settings.discussions' => 'sometimes|array',
            'settings.discussions.enabled' => 'sometimes|boolean',
            'settings.discussions.moderation_enabled' => 'sometimes|boolean',
            'settings.discussions.allow_student_topics' => 'sometimes|boolean',
            'settings.discussions.allow_anonymous' => 'sometimes|boolean',
            'settings.discussions.min_comments_for_grade' => 'sometimes|integer|min:0|max:50',
            'settings.discussions.show_adab_rules' => 'sometimes|boolean',

            'settings.participants' => 'sometimes|array',
            'settings.participants.enrollment_open' => 'sometimes|boolean',
            'settings.participants.allow_self_unenroll' => 'sometimes|boolean',
            'settings.participants.max_participants' => 'nullable|integer|min:1|max:1000',

            'settings.islamic' => 'sometimes|array',
            'settings.islamic.show_learning_dua' => 'sometimes|boolean',
            'settings.islamic.show_basmallah' => 'sometimes|boolean',
            'settings.islamic.enable_quran_block' => 'sometimes|boolean',
            'settings.islamic.enable_hadith_block' => 'sometimes|boolean',
            'settings.islamic.require_islamic_references' => 'sometimes|boolean',
            'settings.islamic.enable_content_review' => 'sometimes|boolean',
            'settings.islamic.show_adab_discussion' => 'sometimes|boolean',
            'settings.islamic.enable_recitation_submission' => 'sometimes|boolean',

            // Certificate criteria
            'certificate_criteria' => 'sometimes|array',
            'certificate_criteria.min_progress' => 'sometimes|integer|min:0|max:100',
            'certificate_criteria.min_score' => 'sometimes|integer|min:0|max:100',

            // Leaderboard
            'leaderboard_enabled' => 'sometimes|boolean',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $weights = $this->input('settings.grades.weights');

            // Grade weights, when provided, must total exactly 100%.
            if (is_array($weights)) {
                $total = array_sum($weights);
                if ($total !== 100) {
                    $validator->errors()->add(
                        'settings.grades.weights',
                        'Total bobot nilai harus 100%. Saat ini: '.$total.'%'
                    );
                }
            }
        });
    }
}
