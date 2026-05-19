import { Head, useForm } from '@inertiajs/react';
import { BookOpenCheck, LogIn, Sparkles, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import FlashMessages from '@/components/FlashMessages';
import { AnimatedButton } from '@/components/animated/AnimatedButton';

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
            
            {/* Background with subtle Islamic geometric pattern */}
            <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                {/* Animated background patterns */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Geometric pattern overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.03 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    
                    {/* Floating orbs */}
                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 20, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            y: [0, 40, 0],
                            x: [0, -30, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1,
                        }}
                        className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl"
                    />
                </div>

                <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-8 px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[1fr_minmax(380px,420px)] lg:items-center lg:gap-12 lg:px-8">
                    {/* Left side - Hero content */}
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
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                            >
                                <BookOpenCheck className="size-5" />
                            </motion.div>
                            <span className="text-base font-bold text-neutral-800">LMS Islam Fakultas</span>
                        </motion.div>

                        {/* Main heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="mt-8 max-w-[16ch] text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight"
                        >
                            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                Assalamu'alaikum
                            </span>
                            <br />
                            <span className="text-neutral-800">
                                selamat datang kembali.
                            </span>
                        </motion.h1>

                        {/* Decorative elements */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="mt-6 flex items-center gap-4"
                        >
                            {[
                                { label: 'Mahasiswa', icon: '📚' },
                                { label: 'Dosen', icon: '👨‍🏫' },
                                { label: 'Admin', icon: '⚙️' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + i * 0.1 }}
                                    className="flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm px-3 py-1.5 shadow-sm border border-neutral-200/60"
                                >
                                    <span className="text-base">{item.icon}</span>
                                    <span className="text-xs font-medium text-neutral-700">{item.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right side - Login form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
                        className="w-full lg:ml-auto"
                    >
                        <motion.form
                            onSubmit={submit}
                            className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 border border-neutral-200/60"
                            whileHover={{ boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.15)' }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Form header */}
                            <div className="flex items-center gap-2 text-emerald-600">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <Sparkles className="size-4" />
                                </motion.div>
                                <span className="text-xs font-semibold uppercase tracking-wider">Silakan masuk</span>
                            </div>
                            <h2 className="mt-2 text-2xl font-bold text-neutral-900">
                                Masuk Akun
                            </h2>

                            <div className="mt-6 space-y-4">
                                {/* Email field */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <label htmlFor="email" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                        <motion.input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            autoComplete="email"
                                            whileFocus={{ scale: 1.01 }}
                                            className={`h-11 w-full rounded-lg border-2 pl-10 pr-3 text-sm text-neutral-900 outline-none transition-all ${
                                                errors.email
                                                    ? 'border-red-400 bg-red-50/50'
                                                    : focusedField === 'email'
                                                    ? 'border-emerald-500 bg-white shadow-lg shadow-emerald-500/10'
                                                    : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-300'
                                            }`}
                                            placeholder="nama@email.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
                                        >
                                            <span className="text-sm">⚠️</span>
                                            {errors.email}
                                        </motion.p>
                                    )}
                                </motion.div>

                                {/* Password field */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <label htmlFor="password" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                        <motion.input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            autoComplete="current-password"
                                            whileFocus={{ scale: 1.01 }}
                                            className={`h-11 w-full rounded-lg border-2 pl-10 pr-3 text-sm text-neutral-900 outline-none transition-all ${
                                                errors.password
                                                    ? 'border-red-400 bg-red-50/50'
                                                    : focusedField === 'password'
                                                    ? 'border-emerald-500 bg-white shadow-lg shadow-emerald-500/10'
                                                    : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-300'
                                            }`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.password && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
                                        >
                                            <span className="text-sm">⚠️</span>
                                            {errors.password}
                                        </motion.p>
                                    )}
                                </motion.div>

                                {/* Remember me */}
                                <motion.label
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex items-center gap-2 cursor-pointer group"
                                >
                                    <motion.input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        whileTap={{ scale: 0.9 }}
                                        className="size-4 rounded-md border-2 border-neutral-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all cursor-pointer"
                                    />
                                    <span className="text-xs font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
                                        Ingat saya
                                    </span>
                                </motion.label>

                                {/* Submit button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <AnimatedButton
                                        type="submit"
                                        disabled={processing}
                                        className="h-11 w-full text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                                    >
                                        {processing ? (
                                            <motion.span
                                                animate={{ opacity: [1, 0.5, 1] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                Memproses...
                                            </motion.span>
                                        ) : (
                                            <>
                                                Sign in
                                                <motion.div
                                                    animate={{ x: [0, 4, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                >
                                                    <LogIn className="ml-2 size-4" />
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatedButton>
                                </motion.div>
                            </div>

                            {/* Decorative corner accent */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-3xl"
                            />
                        </motion.form>
                    </motion.div>
                </section>
            </main>
        </>
    );
}
