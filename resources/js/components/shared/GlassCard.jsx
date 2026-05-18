import { motion } from 'framer-motion';

/**
 * Shared glass card component with backdrop blur and hover effects.
 * Used for content sections across all roles.
 */
export default function GlassCard({ children, className = '', hover = true, ...props }) {
    return (
        <motion.div
            whileHover={hover ? { y: -2 } : undefined}
            className={`relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl border border-neutral-200/60 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}

/**
 * Glass card with decorative gradient orb in corner
 */
export function GlassCardWithOrb({ children, orbColor = 'emerald', position = 'top-right', className = '', ...props }) {
    const positions = {
        'top-right': '-top-20 -right-20',
        'top-left': '-top-20 -left-20',
        'bottom-right': '-bottom-20 -right-20',
        'bottom-left': '-bottom-20 -left-20',
    };

    const colors = {
        emerald: 'from-emerald-400/10 to-teal-400/10',
        amber: 'from-amber-400/10 to-orange-400/10',
        blue: 'from-blue-400/10 to-cyan-400/10',
        purple: 'from-purple-400/10 to-pink-400/10',
    };

    return (
        <GlassCard className={className} {...props}>
            <div className={`absolute ${positions[position]} w-32 h-32 bg-gradient-to-br ${colors[orbColor]} rounded-full blur-3xl`} />
            <div className="relative">{children}</div>
        </GlassCard>
    );
}
