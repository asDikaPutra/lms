<?php

namespace App\Services;

/**
 * YouTube URL parser and embed generator.
 *
 * Handles the following URL formats:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 *   - https://www.youtube.com/shorts/VIDEO_ID
 *   - https://m.youtube.com/watch?v=VIDEO_ID
 *
 * SSRF protection: this service never fetches arbitrary URLs.
 * It only parses the URL string and constructs known YouTube endpoints.
 */
class VideoService
{
    /**
     * Extract the YouTube video ID from a URL.
     * Returns null if the URL is not a valid YouTube URL.
     */
    public function extractVideoId(string $url): ?string
    {
        $url = trim($url);

        // Must be a valid URL
        if (! filter_var($url, FILTER_VALIDATE_URL)) {
            return null;
        }

        $parsed = parse_url($url);

        if (! isset($parsed['host'])) {
            return null;
        }

        $host = strtolower($parsed['host']);

        // Strip www. and m. prefixes
        $host = preg_replace('/^(www\.|m\.)/', '', $host);

        // Only allow youtube.com and youtu.be
        if (! in_array($host, ['youtube.com', 'youtu.be'], true)) {
            return null;
        }

        $videoId = null;

        if ($host === 'youtu.be') {
            // https://youtu.be/VIDEO_ID
            $path = ltrim($parsed['path'] ?? '', '/');
            $videoId = explode('/', $path)[0];
        } elseif ($host === 'youtube.com') {
            $path = $parsed['path'] ?? '';

            if (str_starts_with($path, '/watch')) {
                // https://youtube.com/watch?v=VIDEO_ID
                parse_str($parsed['query'] ?? '', $query);
                $videoId = $query['v'] ?? null;
            } elseif (str_starts_with($path, '/embed/')) {
                // https://youtube.com/embed/VIDEO_ID
                $videoId = explode('/', ltrim($path, '/'))[1] ?? null;
            } elseif (str_starts_with($path, '/shorts/')) {
                // https://youtube.com/shorts/VIDEO_ID
                $videoId = explode('/', ltrim($path, '/'))[1] ?? null;
            } elseif (str_starts_with($path, '/v/')) {
                // https://youtube.com/v/VIDEO_ID
                $videoId = explode('/', ltrim($path, '/'))[1] ?? null;
            }
        }

        if (blank($videoId)) {
            return null;
        }

        // Validate video ID format: 11 alphanumeric chars + hyphens/underscores
        if (! preg_match('/^[a-zA-Z0-9_\-]{11}$/', $videoId)) {
            return null;
        }

        return $videoId;
    }

    /**
     * Validate that a URL is a supported YouTube URL.
     */
    public function isValidYouTubeUrl(string $url): bool
    {
        return $this->extractVideoId($url) !== null;
    }
}
