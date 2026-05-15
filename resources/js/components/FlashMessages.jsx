import { usePage } from '@inertiajs/react';
import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide-react';

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

export default function FlashMessages() {
    const { flash = {} } = usePage().props;
    const messages = Object.entries(flash).filter(([, message]) => Boolean(message));

    if (messages.length === 0) {
        return null;
    }

    return (
        <div className="fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
            {messages.map(([type, message]) => {
                const Icon = tone[type]?.icon ?? CircleAlert;
                const className = tone[type]?.className ?? tone.error.className;

                return (
                    <div
                        key={type}
                        role="status"
                        className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm ${className}`}
                    >
                        <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <p>{message}</p>
                    </div>
                );
            })}
        </div>
    );
}
