<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    public function view(User $user, Course $course): bool
    {
        if ($user->isAdmin() || $this->ownsCourse($user, $course)) {
            return true;
        }

        return $course->is_active && $course->enrollments()
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->exists();
    }

    public function update(User $user, Course $course): bool
    {
        return $user->isAdmin() || $this->ownsCourse($user, $course);
    }

    public function delete(User $user, Course $course): bool
    {
        return $user->isAdmin() || $this->ownsCourse($user, $course);
    }

    public function manageEnrollments(User $user, Course $course): bool
    {
        return $user->isAdmin() || $this->ownsCourse($user, $course);
    }

    private function ownsCourse(User $user, Course $course): bool
    {
        return $user->isInstructor() && $course->instructor_id === $user->id;
    }
}
