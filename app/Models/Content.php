<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['material_id', 'type', 'title', 'body', 'url', 'file_path', 'order'])]
class Content extends Model
{
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(ContentProgress::class);
    }
}
