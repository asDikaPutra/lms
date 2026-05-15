<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->morphs('quizzable');
            $table->string('title');
            $table->unsignedInteger('duration')->nullable();
            $table->enum('result_mode', ['immediate', 'delayed', 'custom'])->default('immediate');
            $table->unsignedInteger('passing_score')->default(0);
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();

            $table->index(['quizzable_type', 'quizzable_id', 'is_published']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
