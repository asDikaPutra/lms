<?php

namespace App\Policies;

use App\Models\Material;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\User;

class QuizPolicy
{
    public function manage(User $user, Quiz $quiz): bool
    {
        return $user->isAdmin() || $this->isInstructorOwner($user, $quiz);
    }

    public function attempt(User $user, Quiz $quiz): bool
    {
        return $user->isStudent() && $this->isActiveStudent($user, $quiz);
    }

    private function isInstructorOwner(User $user, Quiz $quiz): bool
    {
        if (! $user->isInstructor()) {
            return false;
        }

        $parent = $quiz->quizzable;

        if ($parent instanceof Module) {
            return $parent->course()->where('instructor_id', $user->id)->exists();
        }

        if ($parent instanceof Material) {
            return $parent->module()->whereHas('course', fn ($query) => $query->where('instructor_id', $user->id))->exists();
        }

        return false;
    }

    private function isActiveStudent(User $user, Quiz $quiz): bool
    {
        $parent = $quiz->quizzable;
        $courseId = match (true) {
            $parent instanceof Module => $parent->course_id,
            $parent instanceof Material => $parent->module?->course_id,
            default => null,
        };

        return $courseId !== null && $user->enrollments()
            ->where('course_id', $courseId)
            ->where('status', 'active')
            ->exists();
    }
}
