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
        <div className="min-h-screen bg-[#f8fbfa] text-slate-950">
            <FlashMessages />
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow"
            >
                Lewati navigasi
            </a>

            <div>
                <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f8fbfa]/95 px-4 py-4 backdrop-blur lg:px-8">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-700 text-white">
                                <BookOpen className="size-6" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Panel Admin</p>
                                <h1 className="text-2xl font-semibold tracking-normal text-slate-950">{title}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold text-slate-900">{auth?.user?.name}</p>
                                <p className="text-xs text-slate-500">{auth?.user?.email}</p>
                            </div>
                            <div className="flex size-11 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                {auth?.user?.name?.slice(0, 2).toUpperCase() ?? 'AD'}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label="Keluar"
                                title="Keluar"
                                onClick={logout}
                                className="size-11 rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            >
                                <LogOut className="size-5" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                    <nav aria-label="Navigasi admin" className="mx-auto mt-4 flex max-w-7xl gap-2 overflow-x-auto">
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
