import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';

/**
 * Shared stats card with gradient icon and hover animations.
 * Used in dashboards across all roles.
 */
export default function StatsCard({ icon: Icon, label, value, gradient = 'from-emerald-500 to-teal-600', suffix = '', delay = 0 }) {
    return (
        <motion.article
            variants={fadeUp}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm p-5 shadow-lg border border-neutral-200/60 hover:shadow-2xl hover:border-emerald-200/60 transition-all"
        >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-300`} />
            
            {/* Glow effect */}
            <div className={`absolute -inset-1 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
            
            <div className="relative flex items-start justify-between">
                <div>
                    <motion.p 
                        className="text-3xl font-bold text-neutral-900"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: delay + 0.1, type: 'spring' }}
                    >
                        {value}{suffix}
                    </motion.p>
                    <p className="mt-1.5 text-xs font-semibold text-neutral-600">{label}</p>
                </div>
                <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`flex size-11 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-lg`}
                >
                    <Icon className="size-5" />
                </motion.div>
            </div>
        </motion.article>
    );
}
