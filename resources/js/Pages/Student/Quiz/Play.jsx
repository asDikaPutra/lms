import { useState, useEffect, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';

// Quizizz-style answer shapes & colors — adapted to emerald/teal LMS palette
const ANSWER_STYLES = [
    {
        bg: 'from-rose-500 to-red-600',
        glow: 'shadow-rose-500/40',
        border: 'border-rose-400/50',
        icon: (
            <svg viewBox="0 0 24 24" className="size-6 fill-white/80">
                <polygon points="12,2 22,22 2,22" />
            </svg>
        ),
    },
    {
        bg: 'from-sky-500 to-blue-600',
        glow: 'shadow-sky-500/40',
        border: 'border-sky-400/50',
        icon: (
            <svg viewBox="0 0 24 24" className="size-6 fill-white/80">
                <polygon points="12,2 22,12 12,22 2,12" />
            </svg>
        ),
    },
    {
        bg: 'from-amber-500 to-orange-500',
        glow: 'shadow-amber-500/40',
        border: 'border-amber-400/50',
        icon: (
            <svg viewBox="0 0 24 24" className="size-6 fill-white/80">
                <circle cx="12" cy="12" r="10" />
            </svg>
        ),
    },
    {
        bg: 'from-emerald-500 to-teal-600',
        glow: 'shadow-emerald-500/40',
        border: 'border-emerald-400/50',
        icon: (
            <svg viewBox="0 0 24 24" className="size-6 fill-white/80">
                <rect x="2" y="2" width="20" height="20" rx="3" />
            </svg>
        ),
    },
];

export default function QuizPlay({ attemptId, initialQuestionNumber = 1 }) {
    const [question, setQuestion] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(initialQuestionNumber);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [maxTime, setMaxTime] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [essayAnswer, setEssayAnswer] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState(null);
    const [transitioning, setTransitioning] = useState(false);
    const submittingRef = useRef(false);

    const loadQuestion = useCallback(async () => {
        setLoading(true);
        setTransitioning(false);
        submittingRef.current = false;
        try {
            const response = await fetch(
                `/student/quiz-attempts/${attemptId}/questions/${currentQuestion}`,
                {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                }
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setQuestion(data.question);
            setTotalQuestions(data.total);
            setTimeLeft(data.question.time_limit);
            setMaxTime(data.question.time_limit);
            setStartTime(Date.now());
            setSelectedAnswer(null);
            setEssayAnswer('');
            setShowFeedback(false);
            setFeedback(null);
        } catch (error) {
            console.error('Failed to load question:', error);
        } finally {
            setLoading(false);
        }
    }, [attemptId, currentQuestion]);

    useEffect(() => {
        loadQuestion();
    }, [loadQuestion]);

    useEffect(() => {
        if (timeLeft <= 0 || showFeedback || loading) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, showFeedback, loading]);

    // Handle timeout separately to avoid stale closure
    useEffect(() => {
        if (timeLeft !== 0 || showFeedback || loading || !startTime) return;
        handleTimeout();
    }, [timeLeft, showFeedback, loading, startTime]);

    const handleTimeout = async () => {
        if (showFeedback || submittingRef.current) return;
        submittingRef.current = true;
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        try {
            const response = await fetch(
                `/student/quiz-attempts/${attemptId}/questions/${currentQuestion}/submit`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                    body: JSON.stringify({ answer: null, time_taken: timeTaken }),
                }
            );
            const data = await response.json();
            setFeedback(data);
            setShowFeedback(true);
        } catch (error) {
            console.error('Failed to submit on timeout:', error);
            submittingRef.current = false;
        }
    };

    const handleAnswerSelect = async (answer) => {
        if (showFeedback || submittingRef.current) return;
        submittingRef.current = true;
        setSelectedAnswer(answer);
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        try {
            const response = await fetch(
                `/student/quiz-attempts/${attemptId}/questions/${currentQuestion}/submit`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                    body: JSON.stringify({ answer, time_taken: timeTaken }),
                }
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setFeedback(data);
            setShowFeedback(true);
        } catch (error) {
            console.error('Failed to submit answer:', error);
            submittingRef.current = false;
        }
    };

    const handleEssaySubmit = async () => {
        if (showFeedback || submittingRef.current || !essayAnswer.trim()) return;
        submittingRef.current = true;
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        try {
            const response = await fetch(
                `/student/quiz-attempts/${attemptId}/questions/${currentQuestion}/submit`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                    body: JSON.stringify({ answer: essayAnswer.trim(), time_taken: timeTaken }),
                }
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setFeedback(data);
            setShowFeedback(true);
        } catch (error) {
            console.error('Failed to submit essay answer:', error);
            submittingRef.current = false;
        }
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        try {
            const response = await fetch(`/student/quiz-attempts/${attemptId}/finish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            router.visit(`/student/quiz-attempts/${attemptId}/result`);
        } catch (error) {
            console.error('Failed to finish quiz:', error);
        }
    };

    // Timer ring calculation
    const timerProgress = maxTime > 0 ? timeLeft / maxTime : 0;
    const circumference = 2 * Math.PI * 22; // r=22
    const strokeDashoffset = circumference * (1 - timerProgress);
    const timerColor =
        timerProgress > 0.5
            ? '#10b981' // emerald
            : timerProgress > 0.25
            ? '#f59e0b' // amber
            : '#ef4444'; // red

    // Loading screen
    if (loading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="size-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400"
                    />
                    <span className="text-emerald-300 font-medium">Memuat soal…</span>
                </motion.div>
            </div>
        );
    }

    const progressPct = ((currentQuestion - 1) / totalQuestions) * 100;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 overflow-hidden">
            {/* Ambient background orbs */}
            <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-40 -left-40 size-[500px] bg-emerald-500 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                className="absolute -bottom-40 -right-40 size-[600px] bg-teal-500 rounded-full blur-3xl pointer-events-none"
            />

            {/* ── TOP BAR ── */}
            <div className="relative z-10 flex items-center gap-4 px-4 sm:px-8 pt-5 pb-3">
                {/* Question counter */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2">
                    <span className="text-white font-bold text-sm tabular-nums">
                        {currentQuestion}
                    </span>
                    <span className="text-white/40 text-sm">/</span>
                    <span className="text-white/60 text-sm tabular-nums">{totalQuestions}</span>
                </div>

                {/* Progress bar */}
                <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                    />
                </div>

                {/* Timer ring */}
                <div className="relative flex items-center justify-center size-14 flex-shrink-0">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                        <motion.circle
                            cx="24"
                            cy="24"
                            r="22"
                            fill="none"
                            stroke={timerColor}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 0.5 }}
                        />
                    </svg>
                    <motion.span
                        animate={timeLeft <= 5 ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 0.5 }}
                        className="relative text-white font-bold text-sm tabular-nums"
                        style={{ color: timerColor }}
                    >
                        {timeLeft}
                    </motion.span>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="relative z-10 flex flex-col h-[calc(100%-80px)] px-4 sm:px-8 pb-6">
                <AnimatePresence mode="wait">
                    {!showFeedback ? (
                        <motion.div
                            key={`q-${currentQuestion}`}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="flex flex-col h-full"
                        >
                            {/* Question card */}
                            <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                                className="relative flex-shrink-0 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/30 p-6 sm:p-8 mb-5 flex items-center justify-center min-h-[140px] sm:min-h-[160px]"
                            >
                                {/* Decorative top accent */}
                                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full" />

                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center leading-snug">
                                    {question?.question}
                                </h2>
                            </motion.div>

                            {/* Answer grid */}
                            {question?.type === 'essay' ? (
                                <div className="flex-1 flex flex-col gap-3">
                                    <textarea
                                        aria-label="Jawaban essay"
                                        value={essayAnswer}
                                        onChange={(e) => setEssayAnswer(e.target.value)}
                                        placeholder="Tulis jawaban essay Anda di sini..."
                                        className="flex-1 min-h-[200px] w-full rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 p-5 text-gray-900 text-base font-medium resize-none outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 shadow-xl placeholder:text-gray-400"
                                        disabled={!!selectedAnswer}
                                    />
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleEssaySubmit}
                                        disabled={!essayAnswer.trim() || submittingRef.current}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Kirim Jawaban
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 content-start">
                                {question?.options?.map((option, index) => {
                                    const style = ANSWER_STYLES[index % ANSWER_STYLES.length];
                                    return (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.85, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{
                                                delay: 0.15 + index * 0.08,
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 20,
                                            }}
                                            whileHover={{ scale: 1.03, y: -3 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => handleAnswerSelect(option)}
                                            disabled={!!selectedAnswer}
                                            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.bg} shadow-xl ${style.glow} border ${style.border} p-5 text-left group transition-all duration-200 disabled:cursor-not-allowed`}
                                        >
                                            {/* Shine on hover */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                                            />

                                            {/* Inner shadow top */}
                                            <div className="absolute inset-x-0 top-0 h-[1px] bg-white/30" />

                                            <div className="relative flex items-center gap-4">
                                                {/* Shape icon */}
                                                <div className="flex-shrink-0 size-10 flex items-center justify-center bg-black/20 rounded-xl">
                                                    {style.icon}
                                                </div>
                                                <span className="text-white font-bold text-base sm:text-lg leading-snug">
                                                    {option}
                                                </span>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                            )}
                        </motion.div>
                    ) : (
                        /* ── FEEDBACK SCREEN ── */
                        <motion.div
                            key={`fb-${currentQuestion}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                            className="flex flex-col items-center justify-center h-full gap-6"
                        >
                            {/* Result icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 250, damping: 15, delay: 0.1 }}
                                className={`relative flex items-center justify-center w-32 h-32 rounded-full shadow-2xl ${
                                    feedback?.is_correct
                                        ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/50'
                                        : 'bg-gradient-to-br from-rose-400 to-red-500 shadow-rose-500/50'
                                }`}
                            >
                                {/* Pulse ring */}
                                <motion.div
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className={`absolute inset-0 rounded-full ${
                                        feedback?.is_correct ? 'bg-emerald-400' : 'bg-rose-400'
                                    }`}
                                />
                                <span className="relative text-6xl">
                                    {feedback?.is_correct ? '✓' : '✗'}
                                </span>
                            </motion.div>

                            {/* Result text */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="text-center"
                            >
                                <h2 className="text-4xl font-bold text-white mb-2">
                                    {feedback?.is_correct ? 'Benar!' : 'Salah!'}
                                </h2>
                                {!feedback?.is_correct && feedback?.correct_answer && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="mt-3 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl"
                                    >
                                        <p className="text-white/60 text-sm mb-1">Jawaban yang benar:</p>
                                        <p className="text-white font-bold text-lg">{feedback.correct_answer}</p>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Next button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                onClick={handleNext}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative flex items-center gap-3 px-10 py-4 bg-white text-emerald-800 font-bold text-lg rounded-2xl shadow-2xl shadow-black/30 overflow-hidden group"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                                <span className="relative">
                                    {currentQuestion < totalQuestions ? 'Soal Berikutnya' : 'Lihat Hasil'}
                                </span>
                                <ChevronRight className="relative size-5" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
