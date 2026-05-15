import { Link, router, usePage } from '@inertiajs/react';
import { BookOpen, Home, LogOut, Users } from 'lucide-react';

import FlashMessages from '@/components/FlashMessages';
import { Button } from '@/components/ui/button';

const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { label: 'User', href: '/admin/users', icon: Users },
    { label: 'Kursus', href: '/admin/courses', icon: BookOpen },
];

export default function AdminLayout({ children, title = 'Admin' }) {
    const { auth } = usePage().props;

    const logout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-[#f7faf9] text-slate-950">
            <FlashMessages />
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow"
            >
                Lewati navigasi
            </a>

            <aside className="fixed inset-y-0 left-0 z-40 hidden w-[6.5rem] flex-col items-center justify-between bg-[#05245a] py-7 text-white lg:flex">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                    <BookOpen className="size-7" aria-hidden="true" />
                </div>

                <nav aria-label="Navigasi admin" className="flex flex-col gap-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = window.location.pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-label={item.label}
                                title={item.label}
                                className={`flex size-12 items-center justify-center rounded-2xl transition focus:outline-none focus:ring-3 focus:ring-white/40 ${
                                    active ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30' : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <Icon className="size-6" aria-hidden="true" />
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex flex-col items-center gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Keluar"
                        title="Keluar"
                        onClick={logout}
                        className="size-12 rounded-2xl text-white/80 hover:bg-white/10 hover:text-white"
                    >
                        <LogOut className="size-6" aria-hidden="true" />
                    </Button>
                    <div className="flex size-12 items-center justify-center rounded-full bg-violet-500 text-sm font-semibold">
                        {auth?.user?.name?.slice(0, 2).toUpperCase() ?? 'AD'}
                    </div>
                </div>
            </aside>

            <div className="lg:pl-[6.5rem]">
                <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f7faf9]/95 px-4 py-4 backdrop-blur lg:px-8">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Panel Admin</p>
                            <h1 className="text-2xl font-semibold tracking-normal text-slate-950">{title}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold text-slate-900">{auth?.user?.name}</p>
                                <p className="text-xs text-slate-500">{auth?.user?.email}</p>
                            </div>
                            <div className="flex size-11 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                {auth?.user?.name?.slice(0, 2).toUpperCase() ?? 'AD'}
                            </div>
                        </div>
                    </div>
                    <nav aria-label="Navigasi admin mobile" className="mx-auto mt-4 flex max-w-7xl gap-2 overflow-x-auto lg:hidden">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = window.location.pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition focus:outline-none focus:ring-3 focus:ring-blue-600/20 ${
                                        active ? 'bg-blue-700 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <Icon className="size-4" aria-hidden="true" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </header>

                <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
