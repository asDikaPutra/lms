import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

// YouTube logo as inline SVG (lucide-react doesn't include it in all versions)
function YoutubeIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
    );
}

/**
 * YouTube video player component.
 *
 * Shows a thumbnail with a play button overlay.
 * On click, replaces the thumbnail with the embedded iframe.
 *
 * Props:
 *   - videoId: string  — YouTube video ID (11 chars). If null, falls back to url.
 *   - url: string      — Original YouTube URL (fallback for legacy content without video_id)
 *   - title: string    — accessible title for the iframe
 *   - className: string
 */
export default function VideoPlayer({ videoId: videoIdProp, url, title = 'Video', className = '' }) {
    const [playing, setPlaying] = useState(false);

    // Resolve video ID: prefer stored video_id, fall back to extracting from url
    const videoId = videoIdProp || extractYouTubeId(url);

    if (!videoId) {
        // Last resort: show a plain link if we can't parse the URL
        if (!url) return null;
        return (
            <div className={`flex items-center justify-center rounded-2xl bg-neutral-100 border border-neutral-200 p-6 ${className}`}>
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-semibold text-sm transition-colors"
                >
                    <Play className="size-4" fill="currentColor" />
                    Buka Video
                </a>
            </div>
        );
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;

    return (
        <div className={`relative w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl ${className}`}
             style={{ aspectRatio: '16/9' }}>
            <AnimatePresence mode="wait">
                {!playing ? (
                    <motion.button
                        key="thumbnail"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setPlaying(true)}
                        className="group absolute inset-0 w-full h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
                        aria-label={`Putar video: ${title}`}
                    >
                        {/* Thumbnail */}
                        <img
                            src={thumbnailUrl}
                            alt={title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                        />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

                        {/* Play button */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="relative flex size-16 md:size-20 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-2xl shadow-black/40 group-hover:bg-white transition-colors duration-300">
                                {/* Pulse ring */}
                                <motion.div
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute inset-0 rounded-full bg-white/60"
                                />
                                <Play className="size-7 md:size-9 text-emerald-600 translate-x-0.5" fill="currentColor" />
                            </div>
                        </motion.div>

                        {/* YouTube badge */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                            <YoutubeIcon className="size-3.5 text-red-500" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">YouTube</span>
                        </div>

                        {/* Title overlay */}
                        <div className="absolute bottom-3 right-3 left-24 text-right">
                            <p className="text-xs font-semibold text-white/90 line-clamp-1 drop-shadow">{title}</p>
                        </div>
                    </motion.button>
                ) : (
                    <motion.div
                        key="player"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        <iframe
                            src={embedUrl}
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full border-0"
                            loading="lazy"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * YouTube URL preview for the instructor content form.
 * Shows a live thumbnail preview as the instructor types a URL.
 */
export function VideoUrlPreview({ url, className = '' }) {
    // Extract video ID client-side for preview
    const videoId = extractYouTubeId(url);

    if (!videoId) return null;

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`overflow-hidden rounded-xl border border-emerald-200/60 bg-white/70 backdrop-blur-sm shadow-lg ${className}`}
        >
            <div className="relative" style={{ aspectRatio: '16/9' }}>
                <img
                    src={thumbnailUrl}
                    alt="Preview video"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg">
                        <Play className="size-5 text-emerald-600 translate-x-0.5" fill="currentColor" />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50/80">
                <YoutubeIcon className="size-4 text-red-500 shrink-0" />
                <p className="text-xs font-semibold text-emerald-700 truncate">
                    Video ID: <span className="font-mono">{videoId}</span>
                </p>
                <span className="ml-auto text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Valid ✓</span>
            </div>
        </motion.div>
    );
}

/**
 * Client-side YouTube ID extractor (mirrors VideoService.php logic).
 * Used only for live preview — server always re-validates.
 */
function extractYouTubeId(url) {
    if (!url || typeof url !== 'string') return null;

    try {
        const parsed = new URL(url.trim());
        const host = parsed.hostname.replace(/^(www\.|m\.)/, '');

        if (host === 'youtu.be') {
            const id = parsed.pathname.slice(1).split('/')[0];
            return isValidId(id) ? id : null;
        }

        if (host === 'youtube.com') {
            const path = parsed.pathname;

            if (path.startsWith('/watch')) {
                const id = parsed.searchParams.get('v');
                return isValidId(id) ? id : null;
            }
            if (path.startsWith('/embed/') || path.startsWith('/shorts/') || path.startsWith('/v/')) {
                const id = path.split('/')[2];
                return isValidId(id) ? id : null;
            }
        }
    } catch {
        // Invalid URL
    }

    return null;
}

function isValidId(id) {
    return typeof id === 'string' && /^[a-zA-Z0-9_\-]{11}$/.test(id);
}
