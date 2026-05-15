<?php

namespace App\Policies;

use App\Models\Module;
use App\Models\User;

class ModulePolicy
{
    public function manage(User $user, Module $module): bool
    {
        return $user->isAdmin()
            || ($user->isInstructor() && $module->course()->where('instructor_id', $user->id)->exists());
    }

    public function update(User $user, Module $module): bool
    {
        return $this->manage($user, $module);
    }

    public function delete(User $user, Module $module): bool
    {
        return $this->manage($user, $module);
    }
}
