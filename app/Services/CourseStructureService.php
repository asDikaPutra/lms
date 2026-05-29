<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Assignment;
use App\Models\Content;
use App\Models\Course;
use App\Models\Material;
use App\Models\Quiz;
use Illuminate\Support\Collection;

/**
 * Resolves the polymorphic structure of a course: the module / material /
 * content / assignment / quiz IDs that belong to it.
 *
 * Assignments and quizzes attach to either a Module or a Material via a morph
 * relation. Historically rows were stored with both the morph alias
 * ("module" / "material") and the legacy FQCN, so every scoped query must
 * match both forms.
 */
class CourseStructureService
{
    /** @var array<string, string[]> */
    private const MODULE_TYPES = ['module', 'App\\Models\\Module'];

    /** @var array<string, string[]> */
    private const MATERIAL_TYPES = ['material', 'App\\Models\\Material'];

    /**
     * @return array{
     *     module_ids: Collection<int, int>,
     *     material_ids: Collection<int, int>,
     *     content_ids: Collection<int, int>,
     *     total_contents: int,
     *     total_assignments: int,
     *     total_quizzes: int,
     * }
     */
    public function summarize(Course $course): array
    {
        $moduleIds = $course->modules()->pluck('id');
        $materialIds = Material::whereIn('module_id', $moduleIds)->pluck('id');
        $contentIds = Content::whereIn('material_id', $materialIds)->pluck('id');

        return [
            'module_ids' => $moduleIds,
            'material_ids' => $materialIds,
            'content_ids' => $contentIds,
            'total_contents' => $contentIds->count(),
            'total_assignments' => $this->publishedAssignmentIds($moduleIds, $materialIds)->count(),
            'total_quizzes' => $this->publishedQuizIds($moduleIds, $materialIds)->count(),
        ];
    }

    /**
     * @param  Collection<int, int>  $moduleIds
     * @param  Collection<int, int>  $materialIds
     * @return Collection<int, int>
     */
    public function publishedAssignmentIds(Collection $moduleIds, Collection $materialIds): Collection
    {
        return Assignment::query()
            ->where('is_published', true)
            ->where(fn ($query) => $this->scopeMorph($query, 'assignable', $moduleIds, $materialIds))
            ->pluck('id');
    }

    /**
     * @param  Collection<int, int>  $moduleIds
     * @param  Collection<int, int>  $materialIds
     * @return Collection<int, int>
     */
    public function publishedQuizIds(Collection $moduleIds, Collection $materialIds): Collection
    {
        return Quiz::query()
            ->where('is_published', true)
            ->where(fn ($query) => $this->scopeMorph($query, 'quizzable', $moduleIds, $materialIds))
            ->pluck('id');
    }

    /**
     * Constrain a query to rows whose {prefix}_type/{prefix}_id morph points at
     * one of the course's modules or materials (matching both alias and FQCN).
     *
     * @param  \Illuminate\Database\Eloquent\Builder<*>  $query
     * @param  Collection<int, int>  $moduleIds
     * @param  Collection<int, int>  $materialIds
     */
    public function scopeMorph($query, string $prefix, Collection $moduleIds, Collection $materialIds): void
    {
        $query->where(function ($q) use ($prefix, $moduleIds, $materialIds): void {
            $q->where(function ($inner) use ($prefix, $moduleIds): void {
                $inner->whereIn("{$prefix}_type", self::MODULE_TYPES)
                    ->whereIn("{$prefix}_id", $moduleIds);
            })->orWhere(function ($inner) use ($prefix, $materialIds): void {
                $inner->whereIn("{$prefix}_type", self::MATERIAL_TYPES)
                    ->whereIn("{$prefix}_id", $materialIds);
            });
        });
    }
}
