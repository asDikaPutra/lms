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
                {/* 1 animated orb — GPU layer via will-change */}
                <div
                    className="absolute -top-32 -left-32 size-[420px] rounded-full
                        bg-gradient-to-br from-emerald-400/28 to-green-400/22 blur-2xl
                        animate-float-slow"
                    style={{ willChange: 'transform' }}
                />

                {/* 1 static orb — no animation cost */}
                <div
                    className="absolute top-1/4 -right-24 size-[320px] rounded-full
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
                            radial-gradient(ellipse 75% 55% at 0% 0%,   #0E2B29 0%, transparent 58%),
                            radial-gradient(ellipse 65% 50% at 100% 0%, #234244 0%, transparent 52%),
                            linear-gradient(145deg, #081616 0%, #000100 50%, #081616 100%)
                        `,
                    }}
                />

                {/* 1 animated orb — smaller, less blur, GPU layer */}
                <div
                    className="absolute -top-48 -left-48 size-[560px] rounded-full blur-[70px] animate-float-slow"
                    style={{
                        background: 'radial-gradient(circle, rgba(35,66,68,0.26) 0%, rgba(14,43,41,0.12) 55%, transparent 75%)',
                        willChange: 'transform',
                    }}
                />

                {/* 2 static orbs — no animation, reduced size & blur */}
                <div
                    className="absolute -top-24 -right-36 size-[440px] rounded-full blur-[60px]"
                    style={{ background: 'radial-gradient(circle, rgba(35,66,68,0.20) 0%, rgba(8,22,22,0.12) 55%, transparent 75%)' }}
                />

                <div
                    className="absolute -bottom-32 -right-24 size-[400px] rounded-full blur-[60px]"
                    style={{ background: 'radial-gradient(circle, rgba(35,66,68,0.15) 0%, rgba(14,43,41,0.08) 55%, transparent 75%)' }}
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
