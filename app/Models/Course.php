<?php

namespace App\Models;

use Database\Factories\CourseFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'code',
    'name',
    'description',
    'instructor_id',
    'enroll_code',
    'enrollment_type',
    'semester',
    'is_active',
    'status',
    'is_visible',
    'start_date',
    'end_date',
    'leaderboard_enabled',
    'certificate_criteria',
    'settings',
])]
class Course extends Model
{
    /** @use HasFactory<CourseFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_visible' => 'boolean',
            'leaderboard_enabled' => 'boolean',
            'certificate_criteria' => 'array',
            'settings' => 'array',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    /**
     * Get a specific setting value with default fallback
     */
    public function getSetting(string $key, mixed $default = null): mixed
    {
        $settings = $this->settings ?? [];
        $keys = explode('.', $key);
        $value = $settings;

        foreach ($keys as $k) {
            if (!is_array($value) || !array_key_exists($k, $value)) {
                return $default;
            }
            $value = $value[$k];
        }

        return $value;
    }

    /**
     * Get default settings structure
     */
    public static function getDefaultSettings(): array
    {
        return [
            'learning' => [
                'order' => 'free', // free, sequential
                'completion_rule' => 'opened', // opened, read_complete, all_items
                'enable_prerequisites' => false,
            ],
            'assignments' => [
                'allow_late_submission' => true,
                'late_penalty_percent' => 0,
                'allow_resubmission' => false,
                'max_attempts' => 1,
                'default_submission_type' => 'file', // text, file, link, audio, video
            ],
            'quizzes' => [
                'default_attempt_limit' => 1,
                'default_duration_minutes' => 30,
                'shuffle_questions' => false,
                'shuffle_options' => false,
                'show_answers_after_submit' => false,
                'show_score_after_submit' => true,
            ],
            'grades' => [
                'scale' => '0-100', // 0-100, letter
                'passing_grade' => 60,
                'rounding' => 'none', // none, one_decimal, integer
                'weights' => [
                    'assignments' => 30,
                    'quizzes' => 20,
                    'discussions' => 10,
                    'midterm' => 20,
                    'final' => 20,
                ],
            ],
            'discussions' => [
                'enabled' => true,
                'moderation_enabled' => false,
                'allow_student_topics' => true,
                'allow_anonymous' => false,
                'min_comments_for_grade' => 0,
                'show_adab_rules' => true,
            ],
            'participants' => [
                'enrollment_open' => true,
                'allow_self_unenroll' => false,
                'max_participants' => null,
            ],
            'islamic' => [
                'show_learning_dua' => true,
                'show_basmallah' => true,
                'enable_quran_block' => true,
                'enable_hadith_block' => true,
                'require_islamic_references' => false,
                'enable_content_review' => false,
                'show_adab_discussion' => true,
                'enable_recitation_submission' => false,
            ],
        ];
    }

    /**
     * Get merged settings with defaults
     */
    public function getMergedSettings(): array
    {
        return array_replace_recursive(
            static::getDefaultSettings(),
            $this->settings ?? []
        );
    }

    protected static function booted(): void
    {
        static::creating(function (Course $course): void {
            if (blank($course->enroll_code)) {
                $course->enroll_code = strtoupper(Str::random(8));
            }
        });
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->wherePivot('status', 'active')
            ->withPivot(['status', 'enrolled_at', 'completed_at'])
            ->withTimestamps();
    }

    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }
}
