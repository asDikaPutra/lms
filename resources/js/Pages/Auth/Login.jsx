import { Head, useForm } from '@inertiajs/react';
import { BookOpenCheck, LogIn, Sparkles } from 'lucide-react';

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
                <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-8 px-5 py-8 sm:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,25rem)] lg:items-center lg:gap-14 lg:px-10">
                    <div className="max-w-2xl pt-4 lg:pt-0">
                        <div className="flex items-center gap-3 text-sm font-semibold text-blue-800">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white sm:size-11">
                                <BookOpenCheck className="size-6" aria-hidden="true" />
                            </div>
                            LMS Islam Fakultas
                        </div>
                        <h1 className="mt-7 max-w-[13ch] text-3xl font-semibold leading-tight tracking-normal text-[#08142d] sm:text-4xl md:text-5xl lg:text-6xl">
                            Assalamu'alaikum, selamat datang kembali.
                        </h1>
                        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                            Masuk untuk mengelola kelas, materi, tugas, dan pembelajaran sesuai peran Anda.
                        </p>
                    </div>

                    <form onSubmit={submit} aria-labelledby="login-title" className="w-full max-w-md lg:ml-auto">
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
                                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white/80 px-4 text-base outline-none transition focus:border-blue-700 focus:ring-3 focus:ring-blue-700/15 sm:text-sm"
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
                                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white/80 px-4 text-base outline-none transition focus:border-blue-700 focus:ring-3 focus:ring-blue-700/15 sm:text-sm"
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
