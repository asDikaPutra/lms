<?php

namespace App\Policies;

use App\Models\Material;
use App\Models\User;

class MaterialPolicy
{
    public function manage(User $user, Material $material): bool
    {
        return $user->isAdmin()
            || ($user->isInstructor() && $material->module()->whereHas('course', fn ($query) => $query->where('instructor_id', $user->id))->exists());
    }

    public function update(User $user, Material $material): bool
    {
        return $this->manage($user, $material);
    }

    public function delete(User $user, Material $material): bool
    {
        return $this->manage($user, $material);
    }
}
