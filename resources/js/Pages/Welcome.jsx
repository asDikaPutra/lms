import { Head } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import FlashMessages from '@/components/FlashMessages';
import { Button } from '@/components/ui/button';

export default function Welcome({ appName }) {
    return (
        <>
            <Head title="Setup Ready" />
            <FlashMessages />
            <main className="min-h-screen bg-slate-950 text-white">
                <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-teal-300">
                        Phase 1 Foundation
                    </p>
                    <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
                        {appName} siap dibangun dengan Laravel, Inertia, React, dan Tailwind.
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">
                        Fondasi pertama sudah memakai halaman React melalui Inertia. Berikutnya kita
                        bentuk dashboard per role sesuai rancangan LMS Islam Fakultas.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Button className="bg-teal-400 text-slate-950 hover:bg-teal-300">
                            <CheckCircle2 />
                            Inertia React aktif
                        </Button>
                        <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                            Lanjut Phase 2
                            <ArrowRight />
                        </Button>
                    </div>
                </section>
            </main>
        </>
    );
}
