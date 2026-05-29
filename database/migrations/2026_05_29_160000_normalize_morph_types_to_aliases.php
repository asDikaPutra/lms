<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Normalise polymorphic morph types to their enforced morph-map aliases.
 *
 * AppServiceProvider enforces ['module' => Module::class, 'material' => Material::class].
 * Some quizzes/assignments were stored with the legacy FQCN ("App\Models\Module")
 * instead of the alias ("module"). Eloquent morphMany relations only match the
 * alias, so those rows were invisible in the curriculum builder and student
 * course views (while the manual two-form queries on the Quiz/Assignment list
 * pages still found them). Align the stored type with the morph map.
 */
return new class extends Migration
{
    /** @var array<string, string> legacy FQCN => morph alias */
    private array $map = [
        'App\\Models\\Module' => 'module',
        'App\\Models\\Material' => 'material',
    ];

    public function up(): void
    {
        foreach ($this->map as $fqcn => $alias) {
            DB::table('quizzes')->where('quizzable_type', $fqcn)->update(['quizzable_type' => $alias]);
            DB::table('assignments')->where('assignable_type', $fqcn)->update(['assignable_type' => $alias]);
        }
    }

    public function down(): void
    {
        // One-way data correction: the alias form is canonical per the enforced
        // morph map, and rows aliased before this migration are indistinguishable
        // from rows it converted. Reverting alias -> FQCN would re-break every
        // relation (morphMany only matches the alias), so there is no safe rollback.
    }
};
