import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, GraduationCap, Library, Users, Sparkles } from 'lucide-react';

import FlashMessages from '@/components/FlashMessages';
import { Button } from '@/components/ui/button';

export default function Welcome({ auth, appName }) {
    return (
        <>
            <Head title="Selamat Datang" />
            <FlashMessages />
            
            <div className="min-h-screen bg-canvas text-fg-primary selection:bg-mint-light selection:text-forest tracking-[-0.01em]">
                {/* Global Nav (top bar) - White, soft shadows */}
                <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/50 bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.1),_0_2px_2px_rgba(0,0,0,0.06),_0_0_2px_rgba(0,0,0,0.07)]">
                    <div className="mx-auto flex h-[72px] lg:h-[99px] max-w-[1440px] items-center justify-between px-4 lg:px-10">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 lg:size-12 items-center justify-center rounded-full bg-forest text-white">
                                <BookOpen className="size-5 lg:size-6" />
                            </div>
                            <span className="text-xl lg:text-2xl font-bold tracking-tight text-forest">
                                {appName || 'LMS Fakultas'}
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            {auth?.user ? (
                                <Link href="/dashboard" className="text-sm lg:text-base font-semibold text-fg-primary hover:text-forest">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-semibold text-fg-primary hover:text-forest px-4 py-2 border border-fg-primary rounded-pill hover:bg-slate-50 transition-all active:scale-95">
                                        Masuk
                                    </Link>
                                    <Link href="/register">
                                        <Button className="h-[32px] lg:h-[38px] rounded-pill bg-black px-4 lg:px-5 text-sm font-semibold text-white hover:bg-slate-800 transition-all active:scale-95">
                                            Daftar Sekarang
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="pt-[72px] lg:pt-[99px]">
                    {/* Hero Section */}
                    <div className="mx-auto max-w-[1440px] px-4 py-12 lg:px-10 lg:py-20">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-[45px] lg:text-[80px] font-semibold leading-[1.2] tracking-[-0.16px] text-forest">
                                Masa Depan Pembelajaran Studi Islam
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-[19px] leading-[1.75] text-fg-primary">
                                Sistem Manajemen Pembelajaran yang dirancang khusus untuk memfasilitasi civitas akademika fakultas dalam kegiatan belajar mengajar yang interaktif, terstruktur, dan bernilai islami.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-4">
                                <Link href={auth?.user ? "/dashboard" : "/login"}>
                                    <Button className="h-12 lg:h-[42px] rounded-pill bg-mint px-6 text-base font-semibold text-white shadow-none transition-all hover:bg-forest active:scale-95">
                                        Mulai Belajar
                                    </Button>
                                </Link>
                                <Link href="/courses">
                                    <Button variant="outline" className="h-12 lg:h-[42px] rounded-pill border-mint px-6 text-base font-semibold text-mint transition-all hover:bg-canvas active:scale-95">
                                        Jelajahi Kuliah
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Feature Band (Dark Green Strip) */}
                    <div className="w-full bg-forest text-white mt-12 py-16 lg:py-24">
                        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-12 px-4 lg:flex-row lg:px-10">
                            <div className="w-full lg:w-1/2">
                                <h2 className="text-[24px] font-semibold text-white tracking-[-0.16px]">
                                    Pembelajaran yang Berkesinambungan
                                </h2>
                                <p className="mt-4 text-[19px] leading-[1.75] text-fg-white-soft">
                                    Akses seluruh materi perkuliahan, forum diskusi, dan evaluasi dalam satu platform yang terintegrasi penuh. Memberikan pengalaman akademik yang mulus dan bebas hambatan.
                                </p>
                                <div className="mt-8 flex items-center gap-4">
                                    <Link href="/about">
                                        <Button className="rounded-pill bg-white px-6 py-2 font-semibold text-mint hover:bg-slate-100 active:scale-95">
                                            Pelajari Sistem
                                        </Button>
                                    </Link>
                                    <Link href="/docs">
                                        <Button variant="outline" className="rounded-pill border-white px-6 py-2 font-semibold text-white hover:bg-white/10 active:scale-95">
                                            Panduan Lengkap
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {[
                                        { title: 'Materi Terstruktur', icon: Library, desc: 'Kurikulum tertata rapi' },
                                        { title: 'Interaksi Akademik', icon: Users, desc: 'Diskusi komprehensif' },
                                    ].map((feature, idx) => (
                                        <div key={idx} className="rounded-card bg-forest/30 border border-white/10 p-6 backdrop-blur-sm">
                                            <feature.icon className="size-8 text-mint-light" />
                                            <h3 className="mt-4 text-[16px] font-semibold text-white">{feature.title}</h3>
                                            <p className="mt-2 text-[14px] text-fg-white-soft">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                
                {/* Footer Canvas */}
                <footer className="bg-canvas py-16">
                    <div className="mx-auto max-w-[1440px] px-4 text-center lg:px-10">
                        <p className="text-[14px] text-fg-secondary">
                            © {new Date().getFullYear()} {appName || 'LMS Fakultas'}. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
