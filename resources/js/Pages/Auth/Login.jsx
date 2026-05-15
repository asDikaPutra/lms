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
            <main className="min-h-screen bg-[#f7faf9] text-slate-950">
                <section className="grid min-h-screen lg:grid-cols-[6.5rem_1fr]">
                    <aside className="hidden bg-[#05245a] text-white lg:flex lg:flex-col lg:items-center lg:justify-between lg:py-8">
                        <div className="flex size-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                            <BookOpenCheck className="size-7" aria-hidden="true" />
                        </div>
                        <div className="flex flex-col gap-5" aria-hidden="true">
                            <div className="size-11 rounded-2xl bg-blue-500 shadow-lg shadow-blue-900/30" />
                            <div className="size-11 rounded-2xl border border-white/15 bg-white/10" />
                            <div className="size-11 rounded-2xl border border-white/15 bg-white/10" />
                        </div>
                        <div className="flex size-11 items-center justify-center rounded-full bg-violet-500 text-sm font-semibold">
                            LMS
                        </div>
                    </aside>

                    <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_25rem]">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1 text-sm font-medium text-teal-700 shadow-sm">
                                <Sparkles className="size-4" aria-hidden="true" />
                                LMS Islam Fakultas
                            </div>
                            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
                                Assalamu'alaikum, selamat datang kembali.
                            </h1>
                            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                                Masuk untuk mengelola kelas, materi, tugas, dan pembelajaran sesuai peran Anda.
                            </p>
                            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
                                    <GraduationCap className="size-6 text-teal-600" aria-hidden="true" />
                                    <p className="mt-3 text-sm font-semibold text-slate-900">Belajar Terarah</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">Modul, materi, quiz, dan tugas berada dalam satu alur.</p>
                                </div>
                                <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
                                    <ShieldCheck className="size-6 text-amber-600" aria-hidden="true" />
                                    <p className="mt-3 text-sm font-semibold text-slate-900">Akses Aman</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">Dashboard otomatis mengikuti peran pengguna.</p>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={submit}
                            aria-labelledby="login-title"
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <p className="text-sm font-medium text-teal-700">Silakan masuk</p>
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
                                        className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15"
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
                                        className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15"
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
                                        className="size-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                                    />
                                    Ingat saya
                                </label>

                                <Button type="submit" className="h-11 w-full bg-[#0f766e] text-white hover:bg-[#115e59]" disabled={processing}>
                                    <LogIn />
                                    {processing ? 'Memproses...' : 'Masuk'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}
