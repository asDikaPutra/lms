import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlert, CircleCheck, TriangleAlert, X } from 'lucide-react';

const tone = {
    success: {
        icon: CircleCheck,
        className: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    },
    error: {
        icon: CircleAlert,
        className: 'border-rose-200 bg-rose-50 text-rose-900',
    },
    warning: {
        icon: TriangleAlert,
        className: 'border-amber-200 bg-amber-50 text-amber-900',
    },
};

/** Auto-dismiss timeout in ms per message type */
const DISMISS_DELAY = {
    success: 4000,
    error: 10000,
    warning: 10000,
};

export default function FlashMessages() {
    const { flash = {} } = usePage().props;
    const [visibleMessages, setVisibleMessages] = useState([]);
    const timersRef = useRef(new Map());

    // Sync incoming flash props into visible messages state
    useEffect(() => {
        const incoming = Object.entries(flash)
            .filter(([, message]) => Boolean(message))
            .map(([type, message]) => ({ id: `${type}-${Date.now()}`, type, message }));

        if (incoming.length > 0) {
            setVisibleMessages((prev) => [...prev, ...incoming]);
        }
    }, [flash]);

    // Set up auto-dismiss timers for new messages only
    useEffect(() => {
        visibleMessages.forEach((msg) => {
            if (!timersRef.current.has(msg.id)) {
                const delay = DISMISS_DELAY[msg.type] ?? DISMISS_DELAY.error;
                const timer = setTimeout(() => {
                    setVisibleMessages((prev) => prev.filter((m) => m.id !== msg.id));
                    timersRef.current.delete(msg.id);
                }, delay);
                timersRef.current.set(msg.id, timer);
            }
        });
    }, [visibleMessages]);

    // Cleanup all timers on unmount
    useEffect(() => {
        return () => {
            timersRef.current.forEach((timer) => clearTimeout(timer));
            timersRef.current.clear();
        };
    }, []);

    const dismiss = (id) => {
        const timer = timersRef.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
        setVisibleMessages((prev) => prev.filter((m) => m.id !== id));
    };

    if (visibleMessages.length === 0) {
        return null;
    }

    return (
        <div className="fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
            <AnimatePresence>
                {visibleMessages.map((msg) => {
                    const Icon = tone[msg.type]?.icon ?? CircleAlert;
                    const className = tone[msg.type]?.className ?? tone.error.className;

                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            role="status"
                            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm ${className}`}
                        >
                            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                            <p className="flex-1">{msg.message}</p>
                            <button
                                type="button"
                                onClick={() => dismiss(msg.id)}
                                className="mt-0.5 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                                aria-label="Dismiss"
                            >
                                <X className="size-4" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
