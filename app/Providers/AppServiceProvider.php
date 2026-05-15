<?php

namespace App\Providers;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Discussion;
use App\Models\Material;
use App\Models\Module;
use App\Models\Quiz;
use App\Policies\AssignmentPolicy;
use App\Policies\CoursePolicy;
use App\Policies\DiscussionPolicy;
use App\Policies\MaterialPolicy;
use App\Policies\ModulePolicy;
use App\Policies\QuizPolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading(! app()->isProduction());

        Gate::policy(Course::class, CoursePolicy::class);
        Gate::policy(Module::class, ModulePolicy::class);
        Gate::policy(Material::class, MaterialPolicy::class);
        Gate::policy(Quiz::class, QuizPolicy::class);
        Gate::policy(Assignment::class, AssignmentPolicy::class);
        Gate::policy(Discussion::class, DiscussionPolicy::class);

        Relation::enforceMorphMap([
            'module' => Module::class,
            'material' => Material::class,
        ]);
    }
}
