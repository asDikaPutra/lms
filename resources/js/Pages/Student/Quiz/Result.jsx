import { Head, Link } from '@inertiajs/react';
import { CheckCircle, XCircle, Clock, ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Result({ attempt, courseId }) {
    const totalQuestions = attempt.quiz.questions.length;
    const answers = attempt.answers || {};
    const correctAnswers = Object.values(answers).filter((a) => a.is_correct).length;
    const isPending = attempt.status === 'submitted';
    // Use server-computed score (already a percentage 0-100)
    const percentage = attempt.score ?? 0;
    const passed = percentage >= (attempt.quiz.passing_score || 0);
    const totalTime = Object.values(answers).reduce((sum, a) => sum + (a.time_taken || 0), 0);
    const courseUrl = courseId ? `/student/courses/${courseId}` : '/student/courses';

    // Circular progress ring
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - percentage / 100);

    return (
        <>
            <Head title="Hasil Quiz" />

            <div className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 overflow-y-auto">
                {/* Background orbs */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="fixed -top-40 -left-40 size-[500px] bg-emerald-500 rounded-full blur-3xl pointer-events-none"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                    className="fixed -bottom-40 -right-40 size-[600px] bg-teal-500 rounded-full blur-3xl pointer-events-none"
                />

                <div className="relative z-10 min-h-full flex flex-col items-center justify-start py-10 px-4">
                    <div className="w-full max-w-2xl">
                        {/* ── SCORE HERO ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                            className="relative bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl overflow-hidden mb-5 shadow-2xl shadow-black/30"
                        >
                            {/* Top accent */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

                            <div className="p-8 sm:p-10 flex flex-col items-center text-center">
                                {/* Circular score ring */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 15 }}
                                    className="relative size-36 mb-6"
                                >
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                                        {/* Track */}
                                        <circle
                                            cx="64" cy="64" r={radius}
                                            fill="none"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="8"
                                        />
                                        {/* Progress */}
                                        <motion.circle
                                            cx="64" cy="64" r={radius}
                                            fill="none"
                                            stroke={passed ? '#10b981' : '#f59e0b'}
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={circumference}
                                            initial={{ strokeDashoffset: circumference }}
                                            animate={{ strokeDashoffset }}
                                            transition={{ delay: 0.5, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                                        />
                                    </svg>
                                    {/* Center content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.7, type: 'spring' }}
                                            className="text-4xl font-bold text-white tabular-nums"
                                        >
                                            {isPending ? '...' : `${percentage}%`}
                                        </motion.span>
                                    </div>
                                </motion.div>

                                {/* Status */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-3 ${
                                        isPending
                                            ? 'bg-sky-500/25 border border-sky-400/40 text-sky-300'
                                            : passed
                                                ? 'bg-emerald-500/25 border border-emerald-400/40 text-emerald-300'
                                                : 'bg-amber-500/25 border border-amber-400/40 text-amber-300'
                                    }`}
                                >
                                    <span>{isPending ? '⏳' : passed ? '🎉' : '💪'}</span>
                                    <span>{isPending ? 'Menunggu Penilaian' : passed ? 'Lulus' : 'Belum Lulus'}</span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.65 }}
                                    className="text-2xl sm:text-3xl font-bold text-white mb-1"
                                >
                                    {isPending ? 'Quiz Dikirim' : passed ? 'Selamat!' : 'Tetap Semangat!'}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="text-white/60 text-base"
                                >
                                    {isPending
                                        ? 'Jawaban essay menunggu penilaian dosen.'
                                        : `${correctAnswers} dari ${totalQuestions} jawaban benar`
                                    }
                                </motion.p>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
                                {[
                                    {
                                        icon: <CheckCircle className="size-5 text-emerald-400" />,
                                        value: correctAnswers,
                                        label: 'Benar',
                                        color: 'text-emerald-300',
                                    },
                                    {
                                        icon: <XCircle className="size-5 text-rose-400" />,
                                        value: totalQuestions - correctAnswers,
                                        label: 'Salah',
                                        color: 'text-rose-300',
                                    },
                                    {
                                        icon: <Clock className="size-5 text-sky-400" />,
                                        value: `${totalTime}s`,
                                        label: 'Waktu',
                                        color: 'text-sky-300',
                                    },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.75 + i * 0.1 }}
                                        className="flex flex-col items-center gap-1.5 py-5"
                                    >
                                        {stat.icon}
                                        <span className={`text-2xl font-bold tabular-nums ${stat.color}`}>
                                            {stat.value}
                                        </span>
                                        <span className="text-xs text-white/40 font-medium">{stat.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* ── ANSWER REVIEW ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden mb-5"
                        >
                            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
                                <BookOpen className="size-4 text-emerald-400" />
                                <h3 className="font-bold text-white text-sm uppercase tracking-widest">
                                    Review Jawaban
                                </h3>
                            </div>

                            <div className="divide-y divide-white/8">
                                {attempt.quiz.questions.map((q, index) => {
                                    const answer = answers[q.id];
                                    const isCorrect = answer?.is_correct || false;

                                    return (
                                        <motion.div
                                            key={q.id}
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1 + index * 0.05 }}
                                            className="px-6 py-4 flex items-start gap-4"
                                        >
                                            {/* Status dot */}
                                            <div
                                                className={`flex-shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                                                    isCorrect
                                                        ? 'bg-emerald-500/30 text-emerald-300'
                                                        : 'bg-rose-500/30 text-rose-300'
                                                }`}
                                            >
                                                {isCorrect ? '✓' : '✗'}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-white/80 text-sm font-medium mb-2 leading-snug">
                                                    <span className="text-white/40 mr-1">{index + 1}.</span>
                                                    {q.question}
                                                </p>
                                                <div className="space-y-1 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white/40">Jawaban kamu:</span>
                                                        <span
                                                            className={`font-semibold ${
                                                                isCorrect ? 'text-emerald-300' : 'text-rose-300'
                                                            }`}
                                                        >
                                                            {answer?.answer || 'Tidak dijawab'}
                                                        </span>
                                                    </div>
                                                    {!isCorrect && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-white/40">Jawaban benar:</span>
                                                            <span className="font-semibold text-emerald-300">
                                                                {q.correct_answer}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Time taken */}
                                            <div className="flex-shrink-0 flex items-center gap-1 text-white/30 text-xs">
                                                <Clock className="size-3" />
                                                <span>{answer?.time_taken || 0}s</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* ── BACK BUTTON ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                        >
                            <Link href={courseUrl}>
                                <Button
                                    variant="success"
                                    className="relative w-full h-14 rounded-2xl text-base shadow-xl shadow-emerald-500/30"
                                >
                                    <ArrowLeft className="size-5" />
                                    Kembali ke Pembelajaran
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
