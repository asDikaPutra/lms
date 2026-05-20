import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Clock, ListChecks, Play, ArrowLeft, BookOpen, Sparkles, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Show({ quiz, userAttempts, canAttempt }) {
    const [starting, setStarting] = useState(false);
    const [hovered, setHovered] = useState(false);

    const handleStart = () => {
        setStarting(true);
        router.post(`/student/quizzes/${quiz.id}/start`);
    };

    const totalQuestions = quiz.questions?.length || 0;

    return (
        <>
            <Head title={quiz.title} />

            {/* Full screen container */}
            <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950">
                {/* Animated background orbs */}
                <motion.div
                    animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"
                />

                {/* Geometric pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l20 20-20 20-20-20L40 0zm0 40l20 20-20 20-20-20 20-20zm20-20l20 20-20 20-20-20 20-20zM0 20l20 20-20 20L0 40V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => router.visit('/student/dashboard')}
                    className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
                >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block">Kembali</span>
                </motion.button>

                {/* Main content */}
                <div className="relative h-full flex items-center justify-center px-4 py-16">
                    <div className="w-full max-w-2xl">
                        {/* Quiz icon + title */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                            className="text-center mb-8"
                        >
                            {/* Animated icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                                className="relative inline-flex items-center justify-center w-24 h-24 mb-6"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl rotate-6 opacity-60 blur-sm" />
                                <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl shadow-2xl shadow-emerald-500/40">
                                    <BookOpen className="w-11 h-11 text-white" />
                                </div>
                                {/* Sparkle */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                    className="absolute -top-2 -right-2"
                                >
                                    <Sparkles className="w-5 h-5 text-amber-300" />
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 mb-4"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Quiz</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3"
                            >
                                {quiz.title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-emerald-200/70 text-base"
                            >
                                Siap menguji pengetahuanmu?
                            </motion.p>
                        </motion.div>

                        {/* Stats row */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.5 }}
                            className="grid grid-cols-2 gap-3 mb-6"
                        >
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/30">
                                    <ListChecks className="w-5 h-5 text-emerald-300" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{totalQuestions}</div>
                                    <div className="text-xs text-emerald-200/60 font-medium">Soal</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500/30">
                                    <Clock className="w-5 h-5 text-teal-300" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{quiz.duration ?? '—'}</div>
                                    <div className="text-xs text-emerald-200/60 font-medium">Menit</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Attempts info */}
                        {quiz.max_attempts && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-2 bg-amber-500/15 border border-amber-400/25 rounded-xl px-4 py-3 mb-6"
                            >
                                <Shield className="w-4 h-4 text-amber-300 flex-shrink-0" />
                                <span className="text-sm text-amber-200">
                                    Percobaan: <span className="font-bold text-amber-300">{userAttempts} / {quiz.max_attempts}</span>
                                </span>
                            </motion.div>
                        )}

                        {/* Instructions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 }}
                            className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 mb-8"
                        >
                            <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-3">Instruksi</p>
                            <ul className="space-y-2">
                                {[
                                    'Jawab setiap pertanyaan dalam batas waktu yang ditentukan',
                                    'Feedback langsung diberikan setelah menjawab',
                                    'Jawaban tidak dapat diubah setelah dikonfirmasi',
                                ].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + i * 0.08 }}
                                        className="flex items-start gap-2.5 text-sm text-white/70"
                                    >
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Start button */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.75, type: 'spring', stiffness: 200 }}
                        >
                            {canAttempt ? (
                                <motion.button
                                    onClick={handleStart}
                                    disabled={starting}
                                    onHoverStart={() => setHovered(true)}
                                    onHoverEnd={() => setHovered(false)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="relative w-full h-16 rounded-2xl overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed group"
                                >
                                    {/* Button background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-size-200 transition-all duration-500" />
                                    <motion.div
                                        animate={{ opacity: hovered ? 1 : 0 }}
                                        className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400"
                                    />
                                    {/* Shine sweep */}
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                                    />
                                    {/* Shadow glow */}
                                    <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />

                                    <span className="relative flex items-center justify-center gap-3 text-lg font-bold text-white tracking-wide">
                                        {starting ? (
                                            <motion.span
                                                animate={{ opacity: [1, 0.5, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                Memulai...
                                            </motion.span>
                                        ) : (
                                            <>
                                                <Play className="w-5 h-5 fill-white" />
                                                Mulai Quiz
                                            </>
                                        )}
                                    </span>
                                </motion.button>
                            ) : (
                                <div className="w-full h-16 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center">
                                    <span className="text-red-300 font-semibold text-sm">
                                        Batas maksimal percobaan telah tercapai
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
