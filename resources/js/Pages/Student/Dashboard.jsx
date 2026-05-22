import { Head, Link, router, useForm } from '@inertiajs/react';
import { BadgeCheck, BookOpen, CalendarClock, CheckCircle2, KeyRound, Search, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import StudentLayout from '@/Layouts/StudentLayout';
import { AnimatedBadge, AnimatedDot } from '@/components/animated/AnimatedBadge';
import { AnimatedPage, StaggerContainer, FadeInWhenVisible } from '@/components/animated/AnimatedPage';
import { fadeUp } from '@/lib/animations';

const statsConfig = [
    { key: 'active_courses',   label: 'Kursus Aktif',   icon: BookOpen,      tone: 'emerald' },
    { key: 'overall_progress', label: 'Progress',        icon: CheckCircle2,  tone: 'blue',   suffix: '%' },
    { key: 'assignments_due',  label: 'Tugas Mendatang', icon: CalendarClock, tone: 'amber' },
    { key: 'certificates',     label: 'Sertifikat',      icon: BadgeCheck,    tone: 'violet' },
];

const iconToneClasses = {
    emerald: 'from-emerald-400 via-emerald-500 to-teal-600 shadow-[0_4px_16px_rgba(16,185,129,0.38)]',
    blue:    'from-blue-400 via-blue-500 to-indigo-600 shadow-[0_4px_16px_rgba(99,102,241,0.35)]',
    amber:   'from-amber-400 via-amber-500 to-orange-500 shadow-[0_4px_16px_rgba(245,158,11,0.35)]',
    violet:  'from-violet-400 via-violet-500 to-purple-600 shadow-[0_4px_16px_rgba(139,92,246,0.35)]',
};

const statCardHover = {
    emerald: 'hover:border-emerald-300 hover:shadow-[0_8px_28px_rgba(16,185,129,0.14)] dark:hover:border-emerald-500/30 dark:hover:shadow-[0_8px_28px_rgba(16,185,129,0.18)]',
    blue:    'hover:border-blue-300 hover:shadow-[0_8px_28px_rgba(99,102,241,0.14)] dark:hover:border-indigo-500/30 dark:hover:shadow-[0_8px_28px_rgba(99,102,241,0.18)]',
    amber:   'hover:border-amber-300 hover:shadow-[0_8px_28px_rgba(245,158,11,0.14)] dark:hover:border-amber-500/30 dark:hover:shadow-[0_8px_28px_rgba(245,158,11,0.18)]',
    violet:  'hover:border-violet-300 hover:shadow-[0_8px_28px_rgba(139,92,246,0.14)] dark:hover:border-violet-500/30 dark:hover:shadow-[0_8px_28px_rgba(139,92,246,0.18)]',
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
                            className="relative overflow-hidden rounded-2xl border p-7 shadow-lg
                                border-emerald-100/80 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white
                                dark:border-white/[0.07] dark:bg-gradient-to-br dark:from-[#0d1f16] dark:via-[#0f1c14] dark:to-[#0a1510] dark:shadow-[0_2px_24px_rgba(0,0,0,0.5)]"
                        >
                            {/* Pattern */}
                            <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.04]"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M30 0l15 15-15 15-15-15L30 0zm0 30l15 15-15 15-15-15 15-15zm15-15l15 15-15 15-15-15 15-15zM0 15l15 15-15 15L0 30V15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
                            />
                            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10" />

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
                                    <span className="text-neutral-800 dark:text-white/90">hari ini.</span>
                                </motion.h1>

                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
                                    className="max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-white/45"
                                >
                                    Pantau kursus aktif, lanjutkan materi, dan masuk ke kelas baru dengan kode enroll dari dosen.
                                </motion.p>
                            </div>
                        </motion.div>

                        {/* Join Course Card */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="relative overflow-hidden rounded-2xl border p-6 shadow-lg transition-shadow duration-300
                                    border-neutral-200/80 bg-white/90 backdrop-blur-xl shadow-emerald-500/5
                                    dark:border-white/[0.07] dark:bg-[#111a15] dark:shadow-[0_2px_20px_rgba(0,0,0,0.45)]"
                            >
                                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex size-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.40)]">
                                            <KeyRound className="size-5" strokeWidth={1.75} aria-hidden="true" />
                                        </span>
                                        <div>
                                            <h2 className="text-sm font-bold text-neutral-900 dark:text-white/90">Join Kursus</h2>
                                            <p className="text-xs text-neutral-500 dark:text-white/35">Masukkan kode dari dosen</p>
                                        </div>
                                    </div>
                                    <form onSubmit={joinCourse} className="space-y-3">
                                        <div>
                                            <label htmlFor="enroll-code" className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-white/50">
                                                Kode Enroll
                                            </label>
                                            <motion.input
                                                whileFocus={{ scale: 1.01 }}
                                                id="enroll-code"
                                                value={enrollForm.data.enroll_code}
                                                onChange={(e) => enrollForm.setData('enroll_code', e.target.value)}
                                                className="h-10 w-full rounded-lg border-2 px-3 text-sm font-semibold uppercase tracking-wider outline-none transition-all
                                                    border-neutral-200 bg-white/70 text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10
                                                    dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20 dark:focus:border-emerald-500/60 dark:focus:ring-emerald-500/20"
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
                                        <motion.button
                                            type="submit"
                                            disabled={enrollForm.processing}
                                            whileHover={{ scale: enrollForm.processing ? 1 : 1.02 }}
                                            whileTap={{ scale: enrollForm.processing ? 1 : 0.98 }}
                                            className="h-10 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-bold text-white shadow-[0_4px_16px_rgba(16,185,129,0.38)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {enrollForm.processing ? 'Mengirim...' : 'Gabung Sekarang'}
                                        </motion.button>
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
                                className={`group relative overflow-hidden rounded-xl border p-5 shadow-sm transition-all duration-300
                                    border-neutral-200/70 bg-white/90 backdrop-blur-sm hover:shadow-lg
                                    dark:border-white/[0.07] dark:bg-[#111a15] dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)]
                                    ${statCardHover[item.tone]}`}
                            >
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200/80 to-transparent dark:via-white/8" />
                                <div className="flex items-start justify-between">
                                    <div>
                                        <motion.p
                                            className="text-3xl font-bold text-neutral-900 dark:text-white/90"
                                            initial={{ scale: 0.6, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.45 + index * 0.08, type: 'spring', stiffness: 200 }}
                                        >
                                            {stats[item.key]}{item.suffix ?? ''}
                                        </motion.p>
                                        <p className="mt-1.5 text-xs font-medium text-neutral-500 dark:text-white/40">{item.label}</p>
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
                            className="relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-shadow duration-300 h-full
                                border-neutral-200/70 bg-white/90 backdrop-blur-xl hover:shadow-lg
                                dark:border-white/[0.07] dark:bg-[#111a15] dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
                        >
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200/80 to-transparent dark:via-white/8" />
                            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white/90">Kursus Saya</h2>
                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-white/35">Status aktif, pending, dan rejected terlihat di sini.</p>
                                </div>
                                <form onSubmit={search} className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400 dark:text-white/25" />
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        value={filterForm.data.search}
                                        onChange={(e) => filterForm.setData('search', e.target.value)}
                                        placeholder="Cari kursus/materi"
                                        className="h-9 w-full rounded-lg border-2 pl-9 pr-3 text-xs outline-none transition-all md:w-56
                                            border-neutral-200 bg-white/70 text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10
                                            dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20 dark:focus:border-emerald-500/50 dark:focus:ring-emerald-500/15"
                                    />
                                </form>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {enrollments.length === 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="col-span-2 rounded-xl border-2 border-dashed p-8 text-center
                                            border-neutral-200 bg-neutral-50/50
                                            dark:border-white/10 dark:bg-transparent"
                                    >
                                        <BookOpen className="mx-auto mb-3 size-8 text-neutral-300 dark:text-white/20" aria-hidden="true" />
                                        <p className="text-xs font-medium text-neutral-400 dark:text-white/30">Belum ada kursus.</p>
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
                            className="relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-shadow duration-300 h-full
                                border-neutral-200/70 bg-white/90 backdrop-blur-xl hover:shadow-lg
                                dark:border-white/[0.07] dark:bg-[#111a15] dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
                        >
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200/80 to-transparent dark:via-white/8" />
                            <div className="mb-6 flex items-center gap-3">
                                <span className="inline-flex size-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-[0_4px_14px_rgba(245,158,11,0.35)]">
                                    <CalendarClock className="size-5" strokeWidth={1.75} aria-hidden="true" />
                                </span>
                                <div>
                                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white/90">Tugas Mendatang</h2>
                                    <p className="text-xs text-neutral-500 dark:text-white/35">Deadline yang perlu diperhatikan</p>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                {upcomingAssignments.length === 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="rounded-xl border-2 border-dashed py-8 text-center
                                            border-neutral-200 bg-neutral-50/50
                                            dark:border-white/10 dark:bg-transparent"
                                    >
                                        <CheckCircle2 className="mx-auto mb-3 size-8 text-neutral-300 dark:text-white/20" aria-hidden="true" />
                                        <p className="text-xs font-medium text-neutral-400 dark:text-white/30">Belum ada tugas mendatang.</p>
                                    </motion.div>
                                )}
                                {upcomingAssignments.map((assignment, index) => (
                                    <AssignmentCard key={assignment.id} assignment={assignment} delay={index * 0.08} />
                                ))}
                            </div>
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
            className="group relative overflow-hidden rounded-[14px] border shadow-sm transition-all
                border-neutral-200 bg-white hover:border-emerald-200 hover:shadow-md
                dark:border-white/[0.07] dark:bg-[#0d1610] dark:hover:border-emerald-500/25 dark:hover:shadow-[0_6px_24px_rgba(16,185,129,0.12)]"
        >
            {/* Banner */}
            <div className="relative h-24 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700">
                <div className="absolute inset-0 opacity-[0.1]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l20 20-20 20-20-20L40 0zm0 40l20 20-20 20-20-20 20-20zm20-20l20 20-20 20-20-20 20-20zM0 20l20 20-20 20L0 40V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
                />
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />
                <div className="absolute top-3 left-3"><StatusBadge status={enrollment.status} /></div>
                <div className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-[10px] border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                    <BookOpen className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </div>
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
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight tracking-tight text-neutral-900 dark:text-white/90">
                        {enrollment.course.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-white/35">
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
                        <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 dark:text-white/40">
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
                    <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-white/8">
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
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            className="flex h-9 w-full items-center justify-center rounded-[10px] text-xs font-bold text-white transition-opacity hover:opacity-90
                                bg-emerald-700 hover:bg-emerald-800
                                dark:bg-gradient-to-r dark:from-emerald-600 dark:to-teal-600 dark:shadow-[0_3px_12px_rgba(16,185,129,0.35)]"
                        >
                            Lanjut Belajar →
                        </motion.button>
                    </Link>
                ) : (
                    <div className="py-1.5 text-center text-[11px] font-medium text-neutral-400 dark:text-white/25">
                        {enrollment.status === 'pending' ? 'Menunggu persetujuan dosen' : 'Pendaftaran ditolak'}
                    </div>
                )}
            </div>
        </motion.article>
    );
}

// ─── AssignmentCard ───────────────────────────────────────────────────────────
function AssignmentCard({ assignment, delay }) {
    return (
        <motion.article
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.35 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="flex items-start gap-3 rounded-[12px] border p-3 shadow-sm transition-all
                border-amber-200 bg-white hover:border-amber-300 hover:bg-amber-50/30
                dark:border-white/[0.07] dark:bg-[#0d1610] dark:hover:border-amber-500/25 dark:hover:bg-amber-500/5"
        >
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-[0_3px_10px_rgba(245,158,11,0.32)]">
                <CalendarClock className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold leading-snug text-neutral-900 dark:text-white/80">{assignment.title}</p>
                <p className="mt-0.5 text-[10px] font-medium text-neutral-500 dark:text-white/35">{assignment.deadline}</p>
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
