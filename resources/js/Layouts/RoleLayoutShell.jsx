import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';

import FlashMessages from '@/components/FlashMessages';
import AtmosphericBackground from '@/components/shared/AtmosphericBackground';
import { NavIcon, BrandIcon as AppBrandIcon } from '@/components/shared/AppIcon';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';

export default function RoleLayoutShell({
    children,
    title,
    navItems,
    brandIcon: BrandIcon,
    fallbackInitials,
    storageKey,
}) {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    useEffect(() => {
        const saved = window.localStorage.getItem(storageKey);
        if (saved !== null) setIsSidebarExpanded(saved === 'true');
    }, [storageKey]);

    const toggleSidebar = () => {
        setIsSidebarExpanded((current) => {
            const next = !current;
            window.localStorage.setItem(storageKey, String(next));
            return next;
        });
    };

    const logout = () => router.post('/logout');

    const desktopSidebarWidth = isSidebarExpanded ? 'lg:w-[248px]' : 'lg:w-[80px]';
    const desktopContentMargin = isSidebarExpanded ? 'lg:ml-[248px]' : 'lg:ml-[80px]';

    return (
        <div className="min-h-screen tracking-[-0.01em] text-neutral-900 dark:text-white">
            <AtmosphericBackground />
            <FlashMessages />

            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[8px] focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:shadow"
            >
                Lewati navigasi
            </a>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden dark:bg-black/70"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ── Sidebar ──────────────────────────────────────────────── */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r transition-[width,transform,box-shadow] duration-300 lg:translate-x-0
                    border-neutral-200/70 bg-white/90 backdrop-blur-xl
                    dark:border-white/[0.06] dark:bg-[#081616]/95 dark:backdrop-blur-xl
                    ${desktopSidebarWidth}
                    ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-[1px_0_0_rgba(0,0,0,0.06)] dark:lg:shadow-[1px_0_0_rgba(255,255,255,0.04)]'}
                `}
            >
                {/* Brand header */}
                <div className={`relative flex h-[64px] items-center border-b px-4
                    border-neutral-200/70 dark:border-white/[0.06]
                    ${isSidebarExpanded ? 'lg:justify-between' : 'lg:justify-center'}
                `}>
                    <div className="flex min-w-0 items-center gap-3">
                        <AppBrandIcon icon={BrandIcon} />
                        <div className={`min-w-0 ${isSidebarExpanded ? 'lg:block' : 'lg:hidden'}`}>
                            <p className="truncate text-[13px] font-bold text-emerald-700 dark:text-emerald-400">LMS Fakultas</p>
                            <p className="truncate text-[11px] text-neutral-500 dark:text-white/40">{title}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={toggleSidebar}
                        aria-label={isSidebarExpanded ? 'Sembunyikan nama menu' : 'Tampilkan nama menu'}
                        title={isSidebarExpanded ? 'Sembunyikan nama menu' : 'Tampilkan nama menu'}
                        className={`hidden size-8 items-center justify-center rounded-full border shadow-sm transition lg:flex
                            border-neutral-200 bg-white text-neutral-400 hover:text-emerald-600
                            dark:border-white/10 dark:bg-white/5 dark:text-white/40 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400
                            ${isSidebarExpanded ? '' : 'absolute -right-4 top-4'}
                        `}
                    >
                        {isSidebarExpanded
                            ? <PanelLeftClose className="size-4" aria-hidden="true" />
                            : <PanelLeftOpen className="size-4" aria-hidden="true" />
                        }
                    </button>

                    {isMobileMenuOpen && (
                        <button
                            type="button"
                            aria-label="Tutup menu"
                            className="absolute -right-10 top-4 text-white lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X className="size-6" />
                        </button>
                    )}
                </div>

                {/* Nav items */}
                <nav className={`flex flex-1 flex-col gap-1.5 overflow-y-auto py-5
                    ${isSidebarExpanded ? 'px-3' : 'px-3 lg:items-center lg:px-3'}
                `}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = window.location.pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={item.label}
                                aria-label={item.label}
                                className={`group flex h-[44px] items-center rounded-[12px] text-[13px] font-semibold transition-all duration-200
                                    ${isSidebarExpanded ? 'w-full justify-start gap-3 px-2' : 'w-full justify-start gap-3 px-2 lg:w-[44px] lg:justify-center lg:gap-0 lg:px-0'}
                                    ${active
                                        ? 'text-emerald-700 dark:text-emerald-400'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:text-white/40 dark:hover:text-white/80'
                                    }
                                `}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <NavIcon icon={Icon} active={active} />
                                <span className={`truncate ${isSidebarExpanded ? 'block' : 'lg:hidden'}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom user strip */}
                <div className={`border-t p-3 border-neutral-200/70 dark:border-white/[0.06] ${isSidebarExpanded ? '' : 'lg:flex lg:justify-center'}`}>
                    <div className={`flex items-center gap-2.5 ${isSidebarExpanded ? '' : 'lg:justify-center'}`}>
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[11px] font-bold text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                            {auth?.user?.name?.slice(0, 2).toUpperCase() ?? fallbackInitials}
                        </div>
                        <div className={`min-w-0 flex-1 ${isSidebarExpanded ? 'block' : 'lg:hidden'}`}>
                            <p className="truncate text-[12px] font-semibold text-neutral-800 dark:text-white/80">{auth?.user?.name}</p>
                            <p className="truncate text-[10px] text-neutral-400 dark:text-white/35">{auth?.user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main content ─────────────────────────────────────────── */}
            <div className={`flex flex-col transition-[margin] duration-300 ${desktopContentMargin}`}>

                {/* Top header */}
                <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b px-4 backdrop-blur-xl lg:px-6
                    border-neutral-200/70 bg-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                    dark:border-white/[0.06] dark:bg-[#081616]/80 dark:shadow-none
                ">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            aria-label="Buka menu"
                            className="text-neutral-500 hover:text-neutral-900 transition-colors dark:text-white/40 dark:hover:text-white/80 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="size-5" />
                        </button>
                        <h2 className="text-[16px] font-semibold tracking-[-0.16px] text-emerald-700 dark:text-white/90 lg:text-[18px]">
                            {title}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-3">
                        {/* User info */}
                        <div className="hidden text-right sm:block">
                            <p className="text-[13px] font-semibold text-neutral-800 dark:text-white/80">{auth?.user?.name}</p>
                            <p className="text-[12px] text-neutral-400 dark:text-white/35">{auth?.user?.email}</p>
                        </div>

                        {/* Avatar */}
                        <div className="flex size-[36px] items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[12px] font-bold text-white shadow-[0_0_14px_rgba(16,185,129,0.35)]">
                            {auth?.user?.name?.slice(0, 2).toUpperCase() ?? fallbackInitials}
                        </div>

                        {/* Theme toggle */}
                        <ThemeToggle />

                        {/* Logout */}
                        <button
                            type="button"
                            aria-label="Keluar"
                            title="Keluar"
                            onClick={logout}
                            className="flex size-[36px] items-center justify-center rounded-full border transition-all active:scale-95
                                border-neutral-200 bg-white text-neutral-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500
                                dark:border-white/10 dark:bg-white/5 dark:text-white/40 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-400
                            "
                        >
                            <LogOut className="size-[16px]" aria-hidden="true" />
                        </button>
                    </div>
                </header>

                <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
