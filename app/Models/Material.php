<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[Fillable(['module_id', 'title', 'order', 'is_published'])]
class Material extends Model
{
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function contents(): HasMany
    {
        return $this->hasMany(Content::class)->orderBy('order');
    }

    public function quizzes(): MorphMany
    {
        return $this->morphMany(Quiz::class, 'quizzable');
    }

    public function assignments(): MorphMany
    {
        return $this->morphMany(Assignment::class, 'assignable');
    }

    public function discussions(): HasMany
    {
        return $this->hasMany(Discussion::class);
    }
}
