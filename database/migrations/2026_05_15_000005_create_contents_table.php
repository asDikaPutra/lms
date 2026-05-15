<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['artikel', 'video', 'audio', 'pdf', 'file'])->index();
            $table->string('title');
            $table->longText('body')->nullable();
            $table->string('url')->nullable();
            $table->string('file_path')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();

            $table->index(['material_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contents');
    }
};
