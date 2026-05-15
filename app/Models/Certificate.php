<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable(['user_id', 'course_id', 'criteria', 'verify_code', 'issued_at'])]
class Certificate extends Model
{
    protected function casts(): array
    {
        return [
            'criteria' => 'array',
            'issued_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Certificate $certificate): void {
            if (blank($certificate->verify_code)) {
                $certificate->verify_code = strtoupper(Str::random(16));
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
