import { Head, useForm } from '@inertiajs/react';
import { BookOpenCheck, GraduationCap, LogIn, ShieldCheck, Sparkles } from 'lucide-react';

import FlashMessages from '@/components/FlashMessages';
import { Button } from '@/components/ui/button';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Masuk" />
            <FlashMessages />
            <main className="min-h-screen bg-[#f8fbfa] text-slate-950">
                <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-6 py-10 lg:grid-cols-[1fr_25rem]">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 text-sm font-semibold text-blue-800">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-700 text-white">
                                <BookOpenCheck className="size-6" aria-hidden="true" />
                            </div>
                            LMS Islam Fakultas
                        </div>
                        <h1 className="mt-8 text-4xl font-semibold leading-tight tracking-normal text-[#08142d] md:text-6xl">
                            Assalamu'alaikum, selamat datang kembali.
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                            Masuk untuk mengelola kelas, materi, tugas, dan pembelajaran sesuai peran Anda.
                        </p>
                        <div className="mt-9 flex flex-col gap-5 text-sm text-slate-700 sm:flex-row">
                            <div className="flex max-w-xs items-start gap-3">
                                <GraduationCap className="mt-1 size-6 shrink-0 text-emerald-600" aria-hidden="true" />
                                <div>
                                    <p className="font-semibold text-slate-950">Belajar Terarah</p>
                                    <p className="mt-1 leading-6 text-slate-600">Modul, materi, quiz, dan tugas berada dalam satu alur.</p>
                                </div>
                            </div>
                            <div className="flex max-w-xs items-start gap-3">
                                <ShieldCheck className="mt-1 size-6 shrink-0 text-amber-600" aria-hidden="true" />
                                <div>
                                    <p className="font-semibold text-slate-950">Akses Aman</p>
                                    <p className="mt-1 leading-6 text-slate-600">Dashboard otomatis mengikuti peran pengguna.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} aria-labelledby="login-title" className="w-full">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                            <Sparkles className="size-4" aria-hidden="true" />
                            Silakan masuk
                        </div>
                        <h2 id="login-title" className="mt-2 text-2xl font-semibold">
                                Masuk Akun
                        </h2>

                        <div className="mt-6 space-y-5">
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                    autoComplete="email"
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white/80 px-4 text-sm outline-none transition focus:border-blue-700 focus:ring-3 focus:ring-blue-700/15"
                                />
                                {errors.email && (
                                    <p id="email-error" role="alert" className="mt-2 text-sm text-rose-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                    autoComplete="current-password"
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white/80 px-4 text-sm outline-none transition focus:border-blue-700 focus:ring-3 focus:ring-blue-700/15"
                                />
                                {errors.password && (
                                    <p id="password-error" role="alert" className="mt-2 text-sm text-rose-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(event) => setData('remember', event.target.checked)}
                                    className="size-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
                                />
                                Ingat saya
                            </label>

                            <Button type="submit" className="h-12 w-full rounded-xl bg-blue-700 text-white hover:bg-blue-800" disabled={processing}>
                                <LogIn />
                                {processing ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
}
