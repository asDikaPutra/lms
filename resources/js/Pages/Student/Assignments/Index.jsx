import { Head, Link } from '@inertiajs/react';
import { CalendarClock, CheckCircle2, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import StudentLayout from '@/Layouts/StudentLayout';
import { Button } from '@/components/ui/button';
import { AnimatedPage, StaggerContainer, FadeInWhenVisible } from '@/components/animated/AnimatedPage';
import { fadeUp } from '@/lib/animations';

function getUrgency(deadlineStr) {
    if (!deadlineStr) return { label: 'Tidak ada', color: 'neutral', daysLeft: null };
    
    // the backend formats as "d M Y, H:i" which might not parse cleanly in Safari.
    // However, since we just need simple urgency based on a string, let's assume 
    // it's parsed, or we can use the backend's original carbon if we change backend.
    // Wait, let's change backend to return raw ISO string, and format in frontend,
    // or just rely on backend formatted string if we don't need real urgency.
    // Actually, urgency is best calculated on ISO string. Let me fix the controller to send raw deadline as well.
    // For now, let's just render the string as is, and use a standard badge.
    return { label: 'Deadline', color: 'teal' };
}

const statusStyles = {
    submitted:      { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30', label: 'Terkirim' },
    submitted_late: { badge: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30', label: 'Terkirim (Terlambat)' },
    late:           { badge: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30', label: 'Terlambat' },
    unsubmitted:    { badge: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30', label: 'Belum Dikerjakan' },
};

export default function AssignmentIndex({ assignments }) {
    return (
        <StudentLayout title="Tugas Mendatang">
            <Head title="Tugas Mendatang" />
            <AnimatedPage>
                {/* Hero Section */}
                <section className="mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="relative overflow-hidden rounded-2xl border p-7 shadow-md
                            border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/80 to-white
                            dark:border-white/[0.07] dark:bg-gradient-to-br dark:from-[#081616] dark:via-[#0E2B29] dark:to-[#000100] dark:shadow-[0_2px_24px_rgba(0,0,0,0.5)]"
                    >
                        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10" />

                        <div className="relative space-y-4">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5
                                    border-emerald-200 bg-emerald-100/80
                                    dark:border-emerald-500/25 dark:bg-emerald-500/10"
                            >
                                <CalendarClock className="size-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                    Daftar Tugas
                                </span>
                            </motion.div>

                            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                                className="text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl"
                            >
                                <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-teal-300 dark:to-emerald-400">
                                    Tugas Mendatang
                                </span>
                            </motion.h1>

                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
                                className="max-w-xl text-sm leading-relaxed text-content-secondary"
                            >
                                Pantau dan kerjakan tugas-tugas dari seluruh kursus yang Anda ikuti agar tidak tertinggal.
                            </motion.p>
                        </div>
                    </motion.div>
                </section>

                {/* Assignment List */}
                <FadeInWhenVisible>
                    <motion.div className="relative overflow-hidden rounded-2xl border shadow-md transition-shadow duration-300 min-h-[50vh]
                            border-line bg-surface hover:shadow-xl hover:border-neutral-300
                            dark:border-white/[0.07] dark:bg-[#081616] dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
                    >
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                        
                        <div className="p-6">
                            {assignments.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-line bg-surface-muted">
                                        <CheckCircle2 className="size-8 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-base font-bold text-content-primary">Semua tugas selesai!</h3>
                                    <p className="mt-1 text-sm text-content-muted">Tidak ada tugas mendatang dari kursus yang Anda ikuti.</p>
                                </motion.div>
                            ) : (
                                <StaggerContainer delay={0.2} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {assignments.map((assignment, index) => {
                                        const now = new Date();
                                        const deadline = assignment.deadline ? new Date(assignment.deadline) : null;
                                        const isOverdue = deadline && deadline < now;

                                        let statusType = 'unsubmitted';
                                        if (assignment.has_submitted) {
                                            statusType = assignment.submission_status === 'late' ? 'submitted_late' : 'submitted';
                                        } else if (isOverdue) {
                                            statusType = 'late';
                                        }
                                        
                                        const style = statusStyles[statusType];

                                        return (
                                            <motion.article
                                                key={assignment.id}
                                                variants={fadeUp}
                                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                                className="group relative flex flex-col overflow-hidden rounded-xl border p-5 shadow-sm transition-all
                                                    border-neutral-200 bg-neutral-50 hover:border-emerald-300 hover:shadow-md
                                                    dark:border-white/[0.07] dark:bg-white/[0.02] dark:hover:border-emerald-500/30"
                                            >
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="inline-flex items-center gap-1.5 rounded-[6px] border px-2 py-0.5
                                                            border-emerald-200 bg-emerald-50
                                                            dark:border-emerald-500/25 dark:bg-emerald-500/10"
                                                        >
                                                            <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                                                            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
                                                                {assignment.course_code}
                                                            </span>
                                                        </div>
                                                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                                                            {style.label}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <h3 className="line-clamp-2 text-sm font-bold leading-tight tracking-tight text-content-primary mb-1">
                                                            {assignment.title}
                                                        </h3>
                                                        <p className="text-xs text-content-secondary line-clamp-1">
                                                            {assignment.course_name}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-xs text-content-secondary font-medium">
                                                        <CalendarClock className="size-3.5 text-emerald-500" />
                                                        {assignment.deadline_formatted ?? 'Tidak ada deadline'}
                                                    </div>
                                                </div>

                                                <div className="mt-5 pt-4 border-t border-line">
                                                    <Link href={`/student/courses/${assignment.course_id}?view=assignment-${assignment.id}`} className="block">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full h-9 rounded-[10px] border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/25 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
                                                        >
                                                            <BookOpen className="size-3.5 mr-1.5" />
                                                            Buka Kursus
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </motion.article>
                                        );
                                    })}
                                </StaggerContainer>
                            )}
                        </div>
                    </motion.div>
                </FadeInWhenVisible>
            </AnimatedPage>
        </StudentLayout>
    );
}
