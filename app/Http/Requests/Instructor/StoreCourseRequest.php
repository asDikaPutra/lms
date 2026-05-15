<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isInstructor() === true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', 'unique:courses,code'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'semester' => ['nullable', 'string', 'max:255'],
            'enrollment_type' => ['required', Rule::in(['auto', 'manual'])],
            'leaderboard_enabled' => ['boolean'],
            'certificate_criteria.min_progress' => ['required', 'integer', 'min:0', 'max:100'],
            'certificate_criteria.min_score' => ['required', 'integer', 'min:0', 'max:100'],
        ];
    }
}
