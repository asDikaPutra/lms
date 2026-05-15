<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[Fillable(['title', 'description', 'deadline', 'allow_file', 'allow_link', 'is_published'])]
class Assignment extends Model
{
    protected function casts(): array
    {
        return [
            'deadline' => 'datetime',
            'allow_file' => 'boolean',
            'allow_link' => 'boolean',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function assignable(): MorphTo
    {
        return $this->morphTo();
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }
}
