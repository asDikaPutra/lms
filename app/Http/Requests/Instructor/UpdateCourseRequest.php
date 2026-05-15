<?php

namespace App\Http\Requests\Instructor;

use App\Models\Course;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        $course = $this->route('course');

        return $course instanceof Course && $this->user()?->can('update', $course);
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', Rule::unique('courses', 'code')->ignore($this->route('course'))],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'semester' => ['nullable', 'string', 'max:255'],
            'enrollment_type' => ['required', Rule::in(['auto', 'manual'])],
            'leaderboard_enabled' => ['boolean'],
            'is_active' => ['boolean'],
            'certificate_criteria.min_progress' => ['required', 'integer', 'min:0', 'max:100'],
            'certificate_criteria.min_score' => ['required', 'integer', 'min:0', 'max:100'],
        ];
    }
}
