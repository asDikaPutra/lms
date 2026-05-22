/**
 * Atmospheric background — OPTIMIZED VERSION
 * 
 * Perubahan untuk performa:
 * 1. Kurangi jumlah animated elements (3 → 1 per mode)
 * 2. Ganti blur-3xl dengan blur-2xl (lebih ringan)
 * 3. Gunakan CSS animation instead of Framer Motion untuk beberapa
 * 4. Kurangi kompleksitas gradient
 * 5. Tambahkan will-change untuk GPU acceleration
 */
export default function AtmosphericBackground() {
    return (
        <>
            {/* ── LIGHT MODE (OPTIMIZED) ─────────────────────────────────── */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none dark:hidden
                bg-gradient-to-br from-emerald-50 via-teal-50/50 to-green-50">
                
                {/* Static pattern - no animation */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                
                {/* Single animated glow - reduced blur */}
                <div 
                    className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-400/30 to-green-400/25 blur-2xl animate-float-slow"
                    style={{ willChange: 'transform' }}
                />
                
                {/* Static glow orbs - no animation */}
                <div className="absolute top-1/4 -right-32 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-teal-400/25 to-emerald-400/20 blur-2xl" />
            </div>

            {/* ── DARK MODE (OPTIMIZED) ──────────────────────────────────── */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden dark:block">

                {/* Simplified gradient - fewer layers */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 80% 60% at 0% 0%, #0d2a1e 0%, transparent 60%),
                            radial-gradient(ellipse 70% 55% at 100% 0%, #071828 0%, transparent 55%),
                            linear-gradient(145deg, #0c1410 0%, #0a0f14 50%, #090e12 100%)
                        `,
                    }}
                />

                {/* Simplified pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981'%3E%3Crect x='14' y='6' width='4' height='20'/%3E%3Crect x='6' y='14' width='20' height='4'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Single animated glow - reduced blur */}
                <div
                    className="absolute -top-56 -left-56 h-[700px] w-[700px] rounded-full blur-[100px] animate-float-slow"
                    style={{ 
                        background: 'radial-gradient(circle, rgba(16,185,129,0.28) 0%, rgba(5,150,105,0.14) 50%, transparent 75%)',
                        willChange: 'transform'
                    }}
                />

                {/* Static glow orbs - no animation, reduced blur */}
                <div
                    className="absolute -top-32 -right-48 h-[600px] w-[600px] rounded-full blur-[90px]"
                    style={{ background: 'radial-gradient(circle, rgba(14,116,144,0.24) 0%, rgba(8,47,73,0.16) 50%, transparent 75%)' }}
                />
                
                <div
                    className="absolute -bottom-40 -right-32 h-[550px] w-[550px] rounded-full blur-[90px]"
                    style={{ background: 'radial-gradient(circle, rgba(8,145,178,0.18) 0%, rgba(4,120,87,0.10) 50%, transparent 75%)' }}
                />

                {/* Subtle vignette */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.15) 100%)',
                    }}
                />
            </div>
        </>
    );
}
