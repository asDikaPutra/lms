<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('instructor_id')->constrained('users')->cascadeOnDelete();
            $table->string('enroll_code')->unique();
            $table->enum('enrollment_type', ['auto', 'manual'])->default('auto')->index();
            $table->string('semester')->nullable()->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('leaderboard_enabled')->default(false);
            $table->json('certificate_criteria')->nullable();
            $table->timestamps();

            $table->index(['instructor_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
