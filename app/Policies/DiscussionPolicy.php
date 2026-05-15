<?php

namespace App\Policies;

use App\Models\Discussion;
use App\Models\Material;
use App\Models\User;

class DiscussionPolicy
{
    public function create(User $user, Material $material): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isInstructor()) {
            return $material->module()->whereHas('course', fn ($query) => $query->where('instructor_id', $user->id))->exists();
        }

        return $user->isStudent() && $user->enrollments()
            ->where('course_id', $material->module?->course_id)
            ->where('status', 'active')
            ->exists();
    }

    public function delete(User $user, Discussion $discussion): bool
    {
        if ($user->isAdmin() || $discussion->user_id === $user->id) {
            return true;
        }

        return $user->isInstructor()
            && $discussion->material()->whereHas('module.course', fn ($query) => $query->where('instructor_id', $user->id))->exists();
    }
}
