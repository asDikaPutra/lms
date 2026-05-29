import { Head, useForm } from '@inertiajs/react';
import { BookOpen, BookOpenCheck, GraduationCap, LogIn, Lock, Mail, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import FlashMessages from '@/components/FlashMessages';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/shared/ThemeToggle';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [focusedField, setFocusedField] = useState(null);

    const submit = (event) => {
        event.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Masuk" />
            <FlashMessages />

            <main className="relative min-h-screen overflow-hidden
                bg-gradient-to-br from-emerald-50 via-white to-teal-50
                dark:bg-none dark:bg-[#081616]">
 
                {/* Background orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Light mode orbs */}
                    <div className="absolute -top-20 -left-20 size-96 rounded-full blur-3xl
                        bg-gradient-to-br from-emerald-400/20 to-teal-400/20 dark:hidden" />
                    <div className="absolute -bottom-20 -right-20 size-96 rounded-full blur-3xl
                        bg-gradient-to-br from-teal-400/20 to-cyan-400/20 dark:hidden" />
 
                    {/* Dark mode orbs */}
                    <div className="absolute -top-48 -left-48 size-[560px] rounded-full blur-[70px] hidden dark:block animate-float-slow"
                        style={{ background: 'radial-gradient(circle, rgba(35,66,68,0.22) 0%, rgba(14,43,41,0.10) 55%, transparent 75%)', willChange: 'transform' }} />
                    <div className="absolute -bottom-32 -right-32 size-[440px] rounded-full blur-[60px] hidden dark:block"
                        style={{ background: 'radial-gradient(circle, rgba(35,66,68,0.18) 0%, rgba(8,22,22,0.10) 55%, transparent 75%)' }} />
                </div>

                {/* Theme toggle — top right */}
                <div className="absolute top-4 right-4 z-10">
                    <ThemeToggle />
                </div>

                <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-8 px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[1fr_minmax(380px,420px)] lg:items-center lg:gap-12 lg:px-8">

                    {/* Left — Hero */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                        className="max-w-2xl"
                    >
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                            className="flex items-center gap-2.5"
                        >
                            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
                                <BookOpenCheck className="size-5" />
                            </div>
                            <span className="text-base font-bold text-content-primary">LMS Islam Fakultas</span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="mt-8 max-w-[16ch] text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight"
                        >
                            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-teal-300 dark:to-emerald-400">
                                Assalamu'alaikum
                            </span>
                            <br />
                            <span className="text-content-primary">
                                selamat datang kembali.
                            </span>
                        </motion.h1>

                        {/* Role badges */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="mt-6 flex items-center gap-3"
                        >
                            {[
                                { label: 'Mahasiswa', icon: GraduationCap },
                                { label: 'Dosen', icon: BookOpen },
                                { label: 'Admin', icon: Settings },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + i * 0.1 }}
                                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-sm border
                                        bg-white/80 backdrop-blur-sm border-neutral-200/60
                                        dark:bg-white/8 dark:border-white/10 dark:backdrop-blur-sm"
                                >
                                    <item.icon className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                    <span className="text-xs font-medium text-content-secondary">{item.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right — Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
                        className="w-full lg:ml-auto"
                    >
                        <form
                            onSubmit={submit}
                            className="relative overflow-hidden rounded-2xl p-6 sm:p-8 border
                                bg-white/80 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 border-neutral-200/60
                                dark:bg-[#081616] dark:border-white/[0.07] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                        >
                            {/* Decorative corner */}
                            <div className="absolute -top-10 -right-10 size-32 rounded-full blur-3xl opacity-10
                                bg-gradient-to-br from-emerald-500 to-teal-500" />

                            {/* Form header */}
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <span className="text-xs font-semibold uppercase tracking-wider">Silakan masuk</span>
                            </div>
                            <h2 className="mt-2 text-2xl font-bold text-content-primary">
                                Masuk Akun
                            </h2>

                            <div className="mt-6 space-y-4">
                                {/* Email */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                    <label htmlFor="email" className="block text-xs font-semibold mb-1.5 text-content-primary">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-content-muted" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            autoComplete="email"
                                            className={`h-11 w-full rounded-lg border-2 pl-10 pr-3 text-sm outline-none transition-all
                                                dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 ${
                                                errors.email
                                                    ? 'border-red-400 bg-red-50/50 dark:border-red-500/60 dark:bg-red-500/10'
                                                    : focusedField === 'email'
                                                    ? 'border-emerald-500 bg-white shadow-lg shadow-emerald-500/10 dark:border-emerald-500/70 dark:bg-white/12'
                                                    : 'border-neutral-200 bg-neutral-50/50 hover:border-line-strong dark:hover:border-white/25'
                                            }`}
                                            placeholder="nama@email.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                            className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                            <span className="text-sm">⚠️</span>{errors.email}
                                        </motion.p>
                                    )}
                                </motion.div>

                                {/* Password */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                    <label htmlFor="password" className="block text-xs font-semibold mb-1.5 text-content-primary">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-content-muted" />
                                        <input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            autoComplete="current-password"
                                            className={`h-11 w-full rounded-lg border-2 pl-10 pr-3 text-sm outline-none transition-all
                                                dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 ${
                                                errors.password
                                                    ? 'border-red-400 bg-red-50/50 dark:border-red-500/60 dark:bg-red-500/10'
                                                    : focusedField === 'password'
                                                    ? 'border-emerald-500 bg-white shadow-lg shadow-emerald-500/10 dark:border-emerald-500/70 dark:bg-white/12'
                                                    : 'border-neutral-200 bg-neutral-50/50 hover:border-line-strong dark:hover:border-white/25'
                                            }`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.password && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                            className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                            <span className="text-sm">⚠️</span>{errors.password}
                                        </motion.p>
                                    )}
                                </motion.div>

                                {/* Remember me */}
                                <motion.label
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                                    className="flex items-center gap-2 cursor-pointer group"
                                >
                                    <input
                                        type="checkbox"
                                        aria-label="Ingat saya"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="size-4 rounded-md border-2 border-neutral-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all cursor-pointer dark:border-white/20"
                                    />
                                    <span className="text-xs font-medium text-neutral-700 dark:text-white/55 group-hover:text-neutral-900 dark:group-hover:text-white/80 transition-colors">
                                        Ingat saya
                                    </span>
                                </motion.label>

                                {/* Submit */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                                    <Button
                                        type="submit"
                                        variant="success"
                                        disabled={processing}
                                        loading={processing}
                                        className="h-11 w-full text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                                    >
                                        {processing ? 'Memproses...' : (
                                            <span className="flex items-center justify-center gap-2">
                                                Sign in <LogIn className="size-4" />
                                            </span>
                                        )}
                                    </Button>
                                </motion.div>
                            </div>
                        </form>
                    </motion.div>
                </section>
            </main>
        </>
    );
}

