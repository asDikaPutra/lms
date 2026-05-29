<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['material_id', 'type', 'title', 'body', 'url', 'video_id', 'file_path', 'order'])]
class Content extends Model
{
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }
}
