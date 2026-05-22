/**
 * AppIcon — rounded-square icon wrapper bergaya app icon mobile modern.
 * Gradient emerald solid, shadow halus, simbol putih line-art di tengah.
 */

const sizeClasses = {
    xs: {
        frame: 'size-8 rounded-[10px]',
        icon: 'size-4',
        shadow: 'shadow-[0_2px_8px_rgba(5,150,105,0.30)]',
    },
    sm: {
        frame: 'size-9 rounded-[11px]',
        icon: 'size-[18px]',
        shadow: 'shadow-[0_3px_10px_rgba(5,150,105,0.30)]',
    },
    md: {
        frame: 'size-11 rounded-[14px]',
        icon: 'size-5',
        shadow: 'shadow-[0_4px_14px_rgba(5,150,105,0.32)]',
    },
    lg: {
        frame: 'size-14 rounded-[18px]',
        icon: 'size-7',
        shadow: 'shadow-[0_6px_18px_rgba(5,150,105,0.34)]',
    },
    xl: {
        frame: 'size-16 rounded-[20px]',
        icon: 'size-8',
        shadow: 'shadow-[0_8px_24px_rgba(5,150,105,0.36)]',
    },
};

export default function AppIcon({ icon: Icon, size = 'md', className = '', iconClassName = '', ...props }) {
    const classes = sizeClasses[size] ?? sizeClasses.md;

    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white ${classes.frame} ${classes.shadow} ${className}`}
            {...props}
        >
            <Icon
                className={`${classes.icon} ${iconClassName}`}
                strokeWidth={1.75}
                aria-hidden="true"
            />
        </span>
    );
}

/**
 * NavIcon — versi kecil untuk sidebar nav, dengan state active/inactive.
 * Active: gradient emerald + shadow. Inactive: abu-abu lembut.
 */
export function NavIcon({ icon: Icon, active = false, className = '' }) {
    return (
        <span
            className={`inline-flex size-[38px] shrink-0 items-center justify-center rounded-[11px] transition-all duration-200 ${
                active
                    ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.35)]'
                    : 'bg-neutral-100 text-neutral-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:bg-white/8 dark:text-white/40 dark:group-hover:bg-emerald-500/15 dark:group-hover:text-emerald-400'
            } ${className}`}
        >
            <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
        </span>
    );
}

/**
 * BrandIcon — ikon brand di header sidebar, ukuran tetap.
 */
export function BrandIcon({ icon: Icon, className = '' }) {
    return (
        <span
            className={`inline-flex size-[38px] shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-[0_4px_14px_rgba(5,150,105,0.38)] ${className}`}
        >
            <Icon className="size-[20px]" strokeWidth={1.75} aria-hidden="true" />
        </span>
    );
}
