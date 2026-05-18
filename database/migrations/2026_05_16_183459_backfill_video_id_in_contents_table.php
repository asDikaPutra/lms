<?php

use App\Services\VideoService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $videoService = new VideoService();

        DB::table('contents')
            ->where('type', 'video')
            ->whereNotNull('url')
            ->whereNull('video_id')
            ->orderBy('id')
            ->each(function ($content) use ($videoService): void {
                $videoId = $videoService->extractVideoId($content->url);

                if ($videoId !== null) {
                    DB::table('contents')
                        ->where('id', $content->id)
                        ->update(['video_id' => $videoId]);
                }
            });
    }

    public function down(): void
    {
        // Backfill is non-destructive; down() is a no-op.
    }
};
