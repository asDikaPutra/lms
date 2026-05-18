import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';

import FlashMessages from '@/components/FlashMessages';
import AtmosphericBackground from '@/components/shared/AtmosphericBackground';
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
        if (saved !== null) {
            setIsSidebarExpanded(saved === 'true');
        }
    }, [storageKey]);

    const toggleSidebar = () => {
        setIsSidebarExpanded((current) => {
            const next = !current;
            window.localStorage.setItem(storageKey, String(next));
            return next;
        });
    };

    const logout = () => {
        router.post('/logout');
    };

    const desktopSidebarWidth = isSidebarExpanded ? 'lg:w-[248px]' : 'lg:w-[80px]';
    const desktopContentMargin = isSidebarExpanded ? 'lg:ml-[248px]' : 'lg:ml-[80px]';

    return (
        <div className="min-h-screen text-sb-text-black tracking-[-0.01em]">
            <AtmosphericBackground />
            <FlashMessages />
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[8px] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow"
            >
                Lewati navigasi
            </a>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-white/40 bg-white/85 backdrop-blur-xl transition-[width,transform,box-shadow] duration-300 lg:translate-x-0 ${desktopSidebarWidth} ${
                    isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-[1px_0_3px_rgba(0,0,0,0.1)]'
                }`}
            >
                <div className={`relative flex h-[64px] items-center border-b border-white/40 px-4 ${isSidebarExpanded ? 'lg:justify-between' : 'lg:justify-center'}`}>
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-sb-green text-white shadow-[0_0_0.5px_rgba(0,0,0,0.14),_0_1px_1px_rgba(0,0,0,0.24)]">
                            <BrandIcon className="size-[18px]" aria-hidden="true" />
                        </div>
                        <div className={`min-w-0 ${isSidebarExpanded ? 'lg:block' : 'lg:hidden'}`}>
                            <p className="truncate text-[13px] font-bold text-sb-green">LMS Fakultas</p>
                            <p className="truncate text-[11px] text-sb-text-soft">{title}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={toggleSidebar}
                        aria-label={isSidebarExpanded ? 'Sembunyikan nama menu' : 'Tampilkan nama menu'}
                        title={isSidebarExpanded ? 'Sembunyikan nama menu' : 'Tampilkan nama menu'}
                        className={`hidden size-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-sb-text-soft shadow-sm transition hover:text-sb-green lg:flex ${isSidebarExpanded ? '' : 'absolute -right-4 top-4'}`}
                    >
                        {isSidebarExpanded ? (
                            <PanelLeftClose className="size-4" aria-hidden="true" />
                        ) : (
                            <PanelLeftOpen className="size-4" aria-hidden="true" />
                        )}
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

                <nav className={`flex flex-1 flex-col gap-2 overflow-y-auto py-6 ${isSidebarExpanded ? 'px-4' : 'px-4 lg:items-center lg:px-3'}`}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = window.location.pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={item.label}
                                aria-label={item.label}
                                className={`flex h-[44px] items-center rounded-[10px] text-[13px] font-semibold transition-all ${
                                    isSidebarExpanded ? 'w-full justify-start gap-3 px-3' : 'w-full justify-start gap-3 px-3 lg:w-[44px] lg:justify-center lg:gap-0 lg:px-0'
                                } ${
                                    active
                                        ? 'bg-sb-light text-sb-green shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                                        : 'text-sb-text-soft hover:bg-[#f9f9f9] hover:text-sb-text-black'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Icon className="size-[20px] shrink-0" aria-hidden="true" />
                                <span className={`truncate ${isSidebarExpanded ? 'block' : 'lg:hidden'}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <div className={`flex flex-col transition-[margin] duration-300 ${desktopContentMargin}`}>
                <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-white/40 bg-white/80 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-xl lg:px-6">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            aria-label="Buka menu"
                            className="text-sb-text-soft hover:text-sb-text-black lg:hidden"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="size-5" />
                        </button>
                        <h2 className="text-[16px] font-semibold text-sb-green tracking-[-0.16px] lg:text-[18px]">{title}</h2>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="hidden text-right sm:block">
                            <p className="text-[13px] font-semibold text-sb-text-black">{auth?.user?.name}</p>
                            <p className="text-[12px] text-sb-text-soft">{auth?.user?.email}</p>
                        </div>
                        <div className="flex size-[36px] items-center justify-center rounded-full bg-sb-green text-[12px] font-semibold text-white shadow-sm">
                            {auth?.user?.name?.slice(0, 2).toUpperCase() ?? fallbackInitials}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="Keluar"
                            title="Keluar"
                            onClick={logout}
                            className="size-[36px] rounded-full border-sb-text-soft bg-transparent text-sb-text-black transition-all hover:bg-slate-50 hover:text-sb-green active:scale-95"
                        >
                            <LogOut className="size-[16px]" aria-hidden="true" />
                        </Button>
                    </div>
                </header>

                <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
