<?php

namespace App\Policies;

use App\Models\Assignment;
use App\Models\Material;
use App\Models\Module;
use App\Models\User;

class AssignmentPolicy
{
    public function manage(User $user, Assignment $assignment): bool
    {
        return $user->isAdmin() || $this->isInstructorOwner($user, $assignment);
    }

    public function submit(User $user, Assignment $assignment): bool
    {
        return $user->isStudent() && $this->isActiveStudent($user, $assignment);
    }

    private function isInstructorOwner(User $user, Assignment $assignment): bool
    {
        if (! $user->isInstructor()) {
            return false;
        }

        $parent = $assignment->assignable;

        if ($parent instanceof Module) {
            return $parent->course()->where('instructor_id', $user->id)->exists();
        }

        if ($parent instanceof Material) {
            return $parent->module()->whereHas('course', fn ($query) => $query->where('instructor_id', $user->id))->exists();
        }

        return false;
    }

    private function isActiveStudent(User $user, Assignment $assignment): bool
    {
        $parent = $assignment->assignable;
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
