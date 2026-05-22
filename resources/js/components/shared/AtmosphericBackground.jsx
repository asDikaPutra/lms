/**
 * AtmosphericBackground — OPTIMIZED
 *
 * Strategi performa:
 * - Hanya 1 elemen yang dianimasikan per mode (bukan 5-6)
 * - Orb statis tidak pakai Framer Motion (zero JS overhead)
 * - blur dikurangi: blur-[100px] → blur-[70px], blur-[90px] → blur-[60px]
 * - Ukuran orb dikurangi agar area blur lebih kecil
 * - will-change: transform hanya pada elemen animasi
 * - contain: layout+paint pada container untuk isolasi repaint
 * - prefers-reduced-motion: animasi dimatikan via CSS
 */
export default function AtmosphericBackground() {
    return (
        <>
            {/* ── LIGHT MODE ─────────────────────────────────────────────── */}
            <div
                className="fixed inset-0 -z-10 overflow-hidden pointer-events-none dark:hidden
                    bg-gradient-to-br from-emerald-50 via-teal-50/50 to-green-50"
                style={{ contain: 'layout paint' }}
            >
                {/* Static pattern — zero cost */}
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                {/* 1 animated orb — GPU layer via will-change */}
                <div
                    className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full
                        bg-gradient-to-br from-emerald-400/28 to-green-400/22 blur-2xl
                        animate-float-slow"
                    style={{ willChange: 'transform' }}
                />

                {/* 1 static orb — no animation cost */}
                <div
                    className="absolute top-1/4 -right-24 h-[320px] w-[320px] rounded-full
                        bg-gradient-to-br from-teal-400/22 to-emerald-400/18 blur-2xl"
                />
            </div>

            {/* ── DARK MODE ──────────────────────────────────────────────── */}
            <div
                className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden dark:block"
                style={{ contain: 'layout paint' }}
            >
                {/* Base gradient — pure CSS, zero JS */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 75% 55% at 0% 0%,   #0d2a1e 0%, transparent 58%),
                            radial-gradient(ellipse 65% 50% at 100% 0%, #071828 0%, transparent 52%),
                            linear-gradient(145deg, #0c1410 0%, #0a0f14 50%, #090e12 100%)
                        `,
                    }}
                />

                {/* Plus pattern — static, zero cost */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981'%3E%3Crect x='14' y='6' width='4' height='20'/%3E%3Crect x='6' y='14' width='20' height='4'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* 1 animated orb — smaller, less blur, GPU layer */}
                <div
                    className="absolute -top-48 -left-48 h-[560px] w-[560px] rounded-full blur-[70px] animate-float-slow"
                    style={{
                        background: 'radial-gradient(circle, rgba(16,185,129,0.26) 0%, rgba(5,150,105,0.12) 55%, transparent 75%)',
                        willChange: 'transform',
                    }}
                />

                {/* 2 static orbs — no animation, reduced size & blur */}
                <div
                    className="absolute -top-24 -right-36 h-[440px] w-[440px] rounded-full blur-[60px]"
                    style={{ background: 'radial-gradient(circle, rgba(14,116,144,0.20) 0%, rgba(8,47,73,0.12) 55%, transparent 75%)' }}
                />

                <div
                    className="absolute -bottom-32 -right-24 h-[400px] w-[400px] rounded-full blur-[60px]"
                    style={{ background: 'radial-gradient(circle, rgba(8,145,178,0.15) 0%, rgba(4,120,87,0.08) 55%, transparent 75%)' }}
                />

                {/* Vignette — pure CSS */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.12) 100%)',
                    }}
                />
            </div>
        </>
    );
}
