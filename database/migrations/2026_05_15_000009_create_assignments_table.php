<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->morphs('assignable');
            $table->string('title');
            $table->text('description');
            $table->dateTime('deadline')->index();
            $table->boolean('allow_file')->default(true);
            $table->boolean('allow_link')->default(false);
            $table->boolean('is_published')->default(false)->index();
            $table->timestamps();

            $table->index(['assignable_type', 'assignable_id', 'is_published']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
