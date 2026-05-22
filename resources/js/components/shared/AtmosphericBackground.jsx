import { motion } from 'framer-motion';

/**
 * Atmospheric background — adapts to light/dark mode.
 *
 * Light: soft emerald/teal mist on white.
 * Dark:  deep multi-tone gradient (charcoal → navy → dark emerald → teal)
 *        with subtle Islamic geometric pattern overlay and floating glow orbs.
 */
export default function AtmosphericBackground() {
    return (
        <>
            {/* ── LIGHT MODE ─────────────────────────────────────────────── */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none dark:hidden
                bg-gradient-to-br from-emerald-50 via-teal-50/50 to-green-50">
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                <motion.div
                    animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-400/35 to-green-400/30 blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, 50, 0], x: [0, -40, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute top-1/4 -right-32 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-teal-400/30 to-emerald-400/25 blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                    className="absolute bottom-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-gradient-to-br from-lime-400/25 to-teal-400/20 blur-3xl"
                />
            </div>

            {/* ── DARK MODE ──────────────────────────────────────────────── */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden dark:block">

                {/* Base multi-tone gradient — charcoal → deep navy → dark emerald */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 80% 60% at 0% 0%,    #0d2a1e 0%, transparent 60%),
                            radial-gradient(ellipse 70% 55% at 100% 0%,  #071828 0%, transparent 55%),
                            radial-gradient(ellipse 65% 50% at 50% 100%, #0a1f18 0%, transparent 55%),
                            radial-gradient(ellipse 75% 45% at 100% 80%, #060f1e 0%, transparent 50%),
                            radial-gradient(ellipse 60% 40% at 20% 60%,  #0b1e16 0%, transparent 50%),
                            linear-gradient(145deg, #0c1410 0%, #0a0f14 40%, #0b1510 70%, #090e12 100%)
                        `,
                    }}
                />

                {/* Plus (+) grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981'%3E%3Crect x='14' y='6' width='4' height='20'/%3E%3Crect x='6' y='14' width='20' height='4'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Noise texture for depth */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundSize: '180px 180px',
                    }}
                />

                {/* Glow orb — top-left emerald */}
                <motion.div
                    animate={{ y: [0, -45, 0], x: [0, 35, 0] }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-56 -left-56 h-[700px] w-[700px] rounded-full blur-[130px]"
                    style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.32) 0%, rgba(5,150,105,0.16) 50%, transparent 75%)' }}
                />

                {/* Glow orb — top-right deep navy/cyan */}
                <motion.div
                    animate={{ y: [0, 55, 0], x: [0, -35, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                    className="absolute -top-32 -right-48 h-[600px] w-[600px] rounded-full blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(14,116,144,0.28) 0%, rgba(8,47,73,0.20) 50%, transparent 75%)' }}
                />

                {/* Glow orb — center teal */}
                <motion.div
                    animate={{ y: [0, -30, 0], x: [0, 25, 0] }}
                    transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
                    className="absolute top-1/2 left-1/3 h-[500px] w-[500px] -translate-y-1/2 rounded-full blur-[110px]"
                    style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.20) 0%, rgba(13,148,136,0.10) 55%, transparent 80%)' }}
                />

                {/* Glow orb — bottom-right dark cyan */}
                <motion.div
                    animate={{ y: [0, -35, 0], x: [0, -20, 0] }}
                    transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute -bottom-40 -right-32 h-[550px] w-[550px] rounded-full blur-[110px]"
                    style={{ background: 'radial-gradient(circle, rgba(8,145,178,0.22) 0%, rgba(4,120,87,0.14) 50%, transparent 75%)' }}
                />

                {/* Glow orb — bottom-left deep emerald */}
                <motion.div
                    animate={{ y: [0, 40, 0], x: [0, 30, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
                    className="absolute -bottom-32 -left-32 h-[450px] w-[450px] rounded-full blur-[100px]"
                    style={{ background: 'radial-gradient(circle, rgba(4,120,87,0.24) 0%, rgba(6,78,59,0.12) 55%, transparent 80%)' }}
                />

                {/* Subtle vignette — darkens edges slightly for depth */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.20) 100%)',
                    }}
                />
            </div>
        </>
    );
}
