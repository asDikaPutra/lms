import { Head, useForm } from '@inertiajs/react';
import { BookOpenCheck, LogIn } from 'lucide-react';

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
                <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_26rem]">
                    <div className="max-w-2xl">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-sm">
                            <BookOpenCheck className="size-7" aria-hidden="true" />
                        </div>
                        <p className="mt-8 text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
                            LMS Islam Fakultas
                        </p>
                        <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
                            Assalamu'alaikum, silakan masuk untuk melanjutkan pembelajaran.
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                            Akses dashboard sesuai peran Anda sebagai admin, dosen, atau mahasiswa.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <h2 className="text-xl font-semibold">Masuk Akun</h2>

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

                            <Button type="submit" className="h-11 w-full bg-teal-700 text-white hover:bg-teal-800" disabled={processing}>
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
