import { Head, Link, router, useForm } from '@inertiajs/react';
import { BadgeCheck, BookOpen, CalendarClock, CheckCircle2, KeyRound, Search, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import StudentLayout from '@/Layouts/StudentLayout';
import { Button } from '@/components/ui/button';
import { AnimatedPage, StaggerContainer, FadeInWhenVisible } from '@/components/animated/AnimatedPage';
import { fadeUp } from '@/lib/animations';

const statsConfig = [
    { key: 'active_courses',   label: 'Kursus Aktif',   icon: BookOpen,      tone: 'emerald' },
    { key: 'overall_progress', label: 'Progress',        icon: CheckCircle2,  tone: 'blue',   suffix: '%' },
    { key: 'assignments_due',  label: 'Tugas Mendatang', icon: CalendarClock, tone: 'teal' },
    { key: 'certificates',     label: 'Sertifikat',      icon: BadgeCheck,    tone: 'violet' },
];

const iconToneClasses = {
    emerald: 'from-emerald-400 via-emerald-500 to-teal-600 shadow-[0_4px_16px_rgba(16,185,129,0.38)]',
    blue:    'from-blue-400 via-blue-500 to-indigo-600 shadow-[0_4px_16px_rgba(99,102,241,0.35)]',
    teal:    'from-teal-400 via-teal-500 to-cyan-600 shadow-[0_4px_16px_rgba(20,184,166,0.35)]',
    violet:  'from-violet-400 via-violet-500 to-purple-600 shadow-[0_4px_16px_rgba(139,92,246,0.35)]',
};

const statCardHover = {
    emerald: 'hover:border-emerald-300 hover:shadow-[0_8px_28px_rgba(16,185,129,0.22)] dark:hover:border-emerald-500/30 dark:hover:shadow-[0_8px_28px_rgba(16,185,129,0.18)]',
    blue:    'hover:border-blue-300 hover:shadow-[0_8px_28px_rgba(99,102,241,0.22)] dark:hover:border-indigo-500/30 dark:hover:shadow-[0_8px_28px_rgba(99,102,241,0.18)]',
    teal:    'hover:border-teal-300 hover:shadow-[0_8px_28px_rgba(20,184,166,0.22)] dark:hover:border-teal-500/30 dark:hover:shadow-[0_8px_28px_rgba(20,184,166,0.18)]',
    violet:  'hover:border-violet-300 hover:shadow-[0_8px_28px_rgba(139,92,246,0.22)] dark:hover:border-violet-500/30 dark:hover:shadow-[0_8px_28px_rgba(139,92,246,0.18)]',
};

const statCardTint = {
    emerald: 'bg-gradient-to-br from-white to-emerald-50/80 dark:from-[#081616] dark:to-[#081616]',
    blue:    'bg-gradient-to-br from-white to-blue-50/80 dark:from-[#081616] dark:to-[#081616]',
    teal:    'bg-gradient-to-br from-white to-teal-50/80 dark:from-[#081616] dark:to-[#081616]',
    violet:  'bg-gradient-to-br from-white to-violet-50/80 dark:from-[#081616] dark:to-[#081616]',
};

export default function DashboardAnimated({ filters, stats, enrollments, upcomingAssignments }) {
    const enrollForm = useForm({ enroll_code: '' });
    const filterForm = useForm({ search: filters.search ?? '' });

    const joinCourse = (e) => {
        e.preventDefault();
        enrollForm.post('/student/enrollments', { preserveScroll: true, onSuccess: () => enrollForm.reset() });
    };

    const search = (e) => {
        e.preventDefault();
        router.get('/student/dashboard', filterForm.data, { preserveState: true, replace: true });
    };

    return (
        <StudentLayout title="Dashboard">
            <Head title="Dashboard Mahasiswa" />
            <AnimatedPage>

                {/* ── Hero ─────────────────────────────────────────────── */}
                <section className="mb-6">
                    <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">

                        {/* Greeting banner */}
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
                                    <BookOpen className="size-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                        Assalamu'alaikum
                                    </span>
                                </motion.div>

                                <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                                    className="text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-5xl"
                                >
                                    <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-teal-300 dark:to-emerald-400">
                                        Selamat belajar
                                    </span>
                                    <br />
                                    <span className="text-content-primary">hari ini.</span>
                                </motion.h1>

                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
                                    className="max-w-xl text-sm leading-relaxed text-content-secondary"
                                >
                                    Pantau kursus aktif, lanjutkan materi, dan masuk ke kelas baru dengan kode enroll dari dosen.
                                </motion.p>
                            </div>
                        </motion.div>

                        {/* Join Course Card */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="relative overflow-hidden rounded-2xl border p-6 shadow-md transition-shadow duration-300
                                    border-line bg-surface hover:shadow-xl hover:border-emerald-200
                                    dark:border-white/[0.07] dark:bg-[#081616] dark:shadow-[0_2px_20px_rgba(0,0,0,0.45)]"
                            >
                                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex size-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.40)]">
                                            <KeyRound className="size-5" strokeWidth={1.75} aria-hidden="true" />
                                        </span>
                                        <div>
                                            <h2 className="text-sm font-bold text-content-primary">Join Kursus</h2>
                                            <p className="text-xs text-content-secondary">Masukkan kode dari dosen</p>
                                        </div>
                                    </div>
                                    <form onSubmit={joinCourse} className="space-y-3">
                                        <div>
                                            <label htmlFor="enroll-code" className="mb-1.5 block text-xs font-semibold text-content-secondary">
                                                Kode Enroll
                                            </label>
                                            <motion.input
                                                whileFocus={{ scale: 1.01 }}
                                                id="enroll-code"
                                                value={enrollForm.data.enroll_code}
                                                onChange={(e) => enrollForm.setData('enroll_code', e.target.value)}
                                                className="h-10 w-full rounded-lg border-2 px-3 text-sm font-semibold uppercase tracking-wider outline-none transition-all
                                                    border-line bg-surface text-content-primary placeholder:text-content-muted focus:border-brand focus:ring-4 focus:ring-brand/10"
                                                placeholder="KODE123"
                                            />
                                            {enrollForm.errors.enroll_code && (
                                                <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                                    className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400"
                                                >
                                                    <span className="size-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                                                    {enrollForm.errors.enroll_code}
                                                </motion.p>
                                            )}
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="success"
                                            size="sm"
                                            disabled={enrollForm.processing}
                                            loading={enrollForm.processing}
                                            className="w-full h-10 rounded-lg shadow-[0_4px_16px_rgba(16,185,129,0.38)]"
                                        >
                                            {enrollForm.processing ? 'Mengirim...' : 'Gabung Sekarang'}
                                        </Button>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* ── Stats Cards ───────────────────────────────────────── */}
                <StaggerContainer delay={0.35} className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statsConfig.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.article
                                key={item.key}
                                variants={fadeUp}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className={`group relative overflow-hidden rounded-xl border p-5 shadow-md transition-all duration-300
                                    border-neutral-200 ${statCardTint[item.tone]} backdrop-blur-sm hover:shadow-xl
                                    dark:border-white/[0.07] dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)]
                                    ${statCardHover[item.tone]}`}
                            >
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                                <div className="flex items-start justify-between">
                                    <div>
                                        <motion.p
                                            className="text-3xl font-bold text-content-primary"
                                            initial={{ scale: 0.6, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.45 + index * 0.08, type: 'spring', stiffness: 200 }}
                                        >
                                            {stats[item.key]}{item.suffix ?? ''}
                                        </motion.p>
                                        <p className="mt-1.5 text-xs font-medium text-content-secondary">{item.label}</p>
                                    </div>
                                    <div className={`flex size-11 items-center justify-center rounded-[13px] bg-gradient-to-br text-white ${iconToneClasses[item.tone]}`}>
                                        <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </StaggerContainer>

                {/* ── Main Grid ─────────────────────────────────────────── */}
                <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">

                    {/* Courses Section */}
                    <FadeInWhenVisible>
                        <motion.div whileHover={{ y: -2 }}
                            className="relative overflow-hidden rounded-2xl border p-6 shadow-md transition-shadow duration-300 h-full
                                border-line bg-surface hover:shadow-xl hover:border-neutral-300
                                dark:border-white/[0.07] dark:bg-[#081616] dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
                        >
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-content-primary">Kursus Saya</h2>
                                    <p className="mt-0.5 text-xs text-content-secondary">Status aktif, pending, dan rejected terlihat di sini.</p>
                                </div>
                                <form onSubmit={search} className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-content-muted" />
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        value={filterForm.data.search}
                                        onChange={(e) => filterForm.setData('search', e.target.value)}
                                        placeholder="Cari kursus/materi"
                                        className="h-9 w-full rounded-lg border-2 pl-9 pr-3 text-xs outline-none transition-all md:w-56
                                            border-line bg-surface text-content-primary placeholder:text-content-muted focus:border-brand focus:ring-4 focus:ring-brand/10"
                                    />
                                </form>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {enrollments.length === 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="col-span-2 rounded-xl border-2 border-dashed p-8 text-center
                                            border-line bg-surface-muted
                                            dark:bg-transparent"
                                    >
                                        <BookOpen className="mx-auto mb-3 size-8 text-neutral-300 dark:text-white/20" aria-hidden="true" />
                                        <p className="text-xs font-medium text-content-muted">Belum ada kursus.</p>
                                    </motion.div>
                                )}
                                {enrollments.map((enrollment, index) => (
                                    <CourseCard key={enrollment.id} enrollment={enrollment} delay={index * 0.08} />
                                ))}
                            </div>
                        </motion.div>
                    </FadeInWhenVisible>

                    {/* Assignments Section */}
                    <FadeInWhenVisible>
                        <motion.div whileHover={{ y: -2 }}
                            className="relative overflow-hidden rounded-2xl border shadow-md transition-shadow duration-300 h-full flex flex-col
                                border-line bg-surface hover:shadow-xl hover:border-neutral-300
                                dark:border-white/[0.07] dark:bg-[#081616] dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
                        >
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                            {/* Section header ― compact */}
                            <div className="flex items-center justify-between px-5 pt-5 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <span className="inline-flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 text-white shadow-[0_3px_10px_rgba(20,184,166,0.32)]">
                                        <CalendarClock className="size-4" strokeWidth={1.75} aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h2 className="text-sm font-bold text-content-primary">Tugas Mendatang</h2>
                                        <p className="text-[10px] text-content-muted">Deadline terdekat</p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="mx-5 h-px bg-line-subtle" />

                            {/* Task list */}
                            <div className="flex-1 px-4 py-3 space-y-1.5">
                                {upcomingAssignments.length === 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-10 text-center"
                                    >
                                        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl border
                                            border-line bg-surface-muted">
                                            <CheckCircle2 className="size-5 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
                                        </div>
                                        <p className="text-xs font-semibold text-content-secondary">Semua tugas selesai!</p>
                                        <p className="mt-1 text-[10px] text-content-muted">Tidak ada deadline yang mendekat.</p>
                                    </motion.div>
                                )}
                                {upcomingAssignments.map((assignment, index) => (
                                    <Link key={assignment.id} href={`/student/courses/${assignment.course_id}?view=assignment-${assignment.id}`} className="block">
                                        <AssignmentCard assignment={assignment} delay={index * 0.06} />
                                    </Link>
                                ))}
                            </div>

                            {/* Footer CTA */}
                            {upcomingAssignments.length > 0 && (
                                <div className="px-4 pb-4 pt-2">
                                    <Link href="/student/assignments">
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="w-full h-9 rounded-[10px]"
                                        >
                                            Lihat Semua
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </FadeInWhenVisible>
                </div>
            </AnimatedPage>
        </StudentLayout>
    );
}

// ─── CourseCard ───────────────────────────────────────────────────────────────
function CourseCard({ enrollment, delay }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-[14px] border shadow-md transition-all
                border-line bg-surface hover:border-emerald-300 hover:shadow-[0_8px_24px_rgba(16,185,129,0.15)]
                dark:border-white/[0.07] dark:bg-[#081616] dark:hover:border-emerald-500/25 dark:hover:shadow-[0_6px_24px_rgba(16,185,129,0.12)]"
        >
            {/* Banner — sama dengan Courses Index */}
            <div className="relative h-36 overflow-hidden bg-gradient-to-br from-emerald-500/90 via-teal-500/90 to-emerald-600/90 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                <div className="absolute -right-6 -top-6 size-24 rounded-full bg-emerald-400/20 blur-2xl" />
                <div className="absolute top-3 left-3"><StatusBadge status={enrollment.status} /></div>
                <div className="absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-2xl border border-white/30 bg-white/20 backdrop-blur-xl shadow-xl">
                    <BookOpen className="size-6 text-white" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/10 to-transparent" />
            </div>

            {/* Content */}
            <div className="space-y-4 p-4">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 rounded-[6px] border px-2 py-0.5
                        border-emerald-200 bg-emerald-50
                        dark:border-emerald-500/25 dark:bg-emerald-500/10"
                    >
                        <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
                            {enrollment.course.code}
                        </span>
                    </div>
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight tracking-tight text-content-primary">
                        {enrollment.course.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-content-secondary">
                        <div className="flex size-5 items-center justify-center rounded-full border bg-gradient-to-br
                            from-emerald-100 to-teal-100 border-emerald-200/60
                            dark:from-emerald-600/30 dark:to-teal-600/30 dark:border-emerald-500/20"
                        >
                            <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                                {enrollment.course.instructor?.name?.charAt(0) ?? 'D'}
                            </span>
                        </div>
                        <span className="font-medium truncate">{enrollment.course.instructor?.name ?? 'Dosen belum tersedia'}</span>
                    </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-content-secondary">
                            <TrendingUp className="size-3 text-emerald-500" />
                            Progress
                        </span>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: delay + 0.4, type: 'spring' }}
                            className="text-xs font-bold tabular-nums text-emerald-600 dark:text-emerald-400"
                        >
                            {enrollment.course.progress}%
                        </motion.span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${enrollment.course.progress}%` }}
                            transition={{ duration: 1.2, delay: delay + 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        />
                    </div>
                </div>

                {/* Action */}
                {enrollment.status === 'active' ? (
                    <Link href={`/student/courses/${enrollment.course.id}`}>
                        <Button
                            variant="success"
                            size="sm"
                            className="w-full h-9 rounded-[10px]"
                        >
                            Lanjut Belajar
                        </Button>
                    </Link>
                ) : (
                    <div className="py-1.5 text-center text-[11px] font-medium text-content-muted">
                        {enrollment.status === 'pending' ? 'Menunggu persetujuan dosen' : 'Pendaftaran ditolak'}
                    </div>
                )}
            </div>
        </motion.article>
    );
}

// ─── AssignmentCard — redesigned as deadline timeline item ───────────────────
function getUrgency(deadlineStr) {
    if (!deadlineStr) return { label: 'Tidak ada', color: 'neutral', daysLeft: null };
    const now = new Date();
    const deadline = new Date(deadlineStr);
    const diffMs = deadline - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) return { label: 'Terlambat', color: 'red', daysLeft: -1 };
    if (diffHours < 24) return { label: 'Hari ini', color: 'red', daysLeft: 0 };
    if (diffDays === 1) return { label: 'Besok', color: 'orange', daysLeft: 1 };
    if (diffDays <= 3) return { label: `${diffDays} hari lagi`, color: 'amber', daysLeft: diffDays };
    if (diffDays <= 7) return { label: `${diffDays} hari lagi`, color: 'yellow', daysLeft: diffDays };
    return { label: `${diffDays} hari lagi`, color: 'teal', daysLeft: diffDays };
}

const urgencyStyles = {
    red:     { badge: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30', bar: 'bg-red-500', dot: 'bg-red-500' },
    orange:  { badge: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30', bar: 'bg-rose-500', dot: 'bg-rose-500' },
    amber:   { badge: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30', bar: 'bg-amber-400', dot: 'bg-amber-400' },
    yellow:  { badge: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30', bar: 'bg-sky-400', dot: 'bg-sky-400' },
    teal:    { badge: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/30', bar: 'bg-teal-500', dot: 'bg-teal-500' },
    neutral: { badge: 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-white/8 dark:text-white/40 dark:border-white/10', bar: 'bg-neutral-400', dot: 'bg-neutral-400' },
};

function AssignmentCard({ assignment, delay }) {
    const urgency = getUrgency(assignment.deadline);
    const style = urgencyStyles[urgency.color];

    const formattedDeadline = assignment.deadline
        ? new Date(assignment.deadline).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })
        : 'Tidak ada deadline';

    return (
        <motion.article
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.3 }}
            whileHover={{ x: 2, transition: { duration: 0.15 } }}
            className="group relative flex items-start gap-3 rounded-xl border px-3.5 py-3 transition-all cursor-pointer
                border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-white hover:shadow-sm
                dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-white/10 dark:hover:bg-white/[0.06]"
        >
            {/* Left urgency bar */}
            <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${style.bar}`} />

            {/* Urgency dot */}
            <div className="mt-0.5 shrink-0">
                <span className={`inline-flex size-2 rounded-full ${style.dot}`} />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                {/* Course code + urgency badge */}
                <div className="mb-1 flex items-center gap-1.5 flex-wrap">
                    {assignment.course_code && (
                        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            {assignment.course_code}
                        </span>
                    )}
                    <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${style.badge}`}>
                        {urgency.label}
                    </span>
                </div>

                {/* Title */}
                <p className="truncate text-xs font-semibold leading-snug text-content-primary">
                    {assignment.title}
                </p>

                {/* Deadline */}
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-content-muted">
                    <CalendarClock className="size-3 shrink-0" />
                    {formattedDeadline}
                </p>
            </div>
        </motion.article>
    );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const config = {
        active:   { label: 'Aktif',   cls: 'bg-emerald-100/90 border-emerald-300/80 text-emerald-800 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-300', dot: 'bg-emerald-500 dark:bg-emerald-400' },
        pending:  { label: 'Pending', cls: 'bg-amber-100/90 border-amber-300/80 text-amber-800 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-300', dot: 'bg-amber-500 dark:bg-amber-400' },
        rejected: { label: 'Ditolak', cls: 'bg-red-100/90 border-red-300/80 text-red-800 dark:bg-red-500/20 dark:border-red-500/40 dark:text-red-300', dot: null },
    };
    const cfg = config[status] ?? { label: status, cls: 'bg-white/80 border-white/40 text-neutral-700 dark:bg-white/10 dark:border-white/20 dark:text-white/60', dot: null };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${cfg.cls}`}>
            {cfg.dot && <span className={`size-1.5 rounded-full animate-pulse ${cfg.dot}`} />}
            {cfg.label}
        </span>
    );
}

