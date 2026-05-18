<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contents', function (Blueprint $table): void {
            // Stores the extracted YouTube video ID (11 chars) for video-type contents.
            // Kept separate from `url` so the original URL is preserved for auditing.
            $table->string('video_id', 20)->nullable()->after('url');
        });
    }

    public function down(): void
    {
        Schema::table('contents', function (Blueprint $table): void {
            $table->dropColumn('video_id');
        });
    }
};
