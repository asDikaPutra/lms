import { motion } from 'framer-motion';

/**
 * Shared atmospheric background with floating orbs and Islamic geometric pattern.
 * Used across Student, Instructor, and Admin pages for consistent aesthetic.
 */
export default function AtmosphericBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-br from-emerald-50 via-teal-50/50 to-green-50">
            {/* Geometric pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />
            
            {/* Floating orbs */}
            <motion.div
                animate={{
                    y: [0, -40, 0],
                    x: [0, 30, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/35 to-green-400/30 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    y: [0, 50, 0],
                    x: [0, -40, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2,
                }}
                className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-gradient-to-br from-teal-400/30 to-emerald-400/25 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 4,
                }}
                className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-gradient-to-br from-lime-400/25 to-teal-400/20 rounded-full blur-3xl"
            />
        </div>
    );
}
