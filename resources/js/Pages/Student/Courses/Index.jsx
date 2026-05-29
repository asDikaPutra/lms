import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Clock, GraduationCap, Search, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import StudentLayout from '@/Layouts/StudentLayout';
import { Button } from '@/components/ui/button';
import { FilterButton } from '@/components/ui/filter-button';
import { AnimatedPage, StaggerContainer } from '@/components/animated/AnimatedPage';
import { fadeUp } from '@/lib/animations';

export default function CoursesIndex({ courses }) {
    const searchForm = useForm({ search: '' });
    const [filter, setFilter] = useState('all'); // 'all' or 'enrolled'

    const handleSearch = (event) => {
        event.preventDefault();
        router.get('/student/courses', searchForm.data, {
            preserveState: true,
            replace: true,
        });
    };

    // Filter courses based on selected filter
    const filteredCourses = filter === 'enrolled' 
        ? courses.filter(course => course.enrollment_status === 'active')
        : courses;

    return (
        <StudentLayout title="Kursus Tersedia">
            <Head title="Kursus Tersedia" />

            <AnimatedPage>
                {/* Header Section */}
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
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5
                                    border-emerald-200 bg-emerald-100/80
                                    dark:border-emerald-500/25 dark:bg-emerald-500/10"
                            >
                                <BookOpen className="size-3.5 text-emerald-700 dark:text-emerald-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                    Katalog Kursus
                                </span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.18 }}
                                className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]"
                            >
                                <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-teal-300 dark:to-emerald-400">
                                    Kursus Tersedia
                                </span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.28 }}
                                className="max-w-2xl text-sm leading-relaxed text-content-secondary"
                            >
                                Jelajahi semua kursus yang tersedia dan bergabung untuk memulai pembelajaran.
                            </motion.p>
                        </div>
                    </motion.div>
                </section>

                {/* Filter and Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
                            Semua Kursus
                        </FilterButton>
                        <FilterButton active={filter === 'enrolled'} onClick={() => setFilter('enrolled')}>
                            Kursus Saya
                        </FilterButton>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-content-muted" />
                        <motion.input
                            whileFocus={{ scale: 1.01 }}
                            value={searchForm.data.search}
                            onChange={(event) => searchForm.setData('search', event.target.value)}
                            placeholder="Cari kursus..."
                            className="h-11 w-full rounded-xl border-2 pl-10 pr-4 text-sm outline-none transition-all shadow-sm
                                border-line bg-surface/90 backdrop-blur-sm text-content-primary placeholder:text-content-muted
                                focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10
                                dark:border-white/10 dark:bg-white/8 dark:text-white dark:placeholder:text-white/25
                                dark:focus:border-emerald-500/60 dark:focus:ring-emerald-500/15"
                        />
                    </form>
                </motion.div>

                {/* Course Grid */}
                <StaggerContainer delay={0.5} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full rounded-2xl border-2 border-dashed p-12 text-center backdrop-blur-sm
                                border-line bg-surface/60
                                dark:border-white/10 dark:bg-white/5"
                        >
                            <span className="text-5xl mb-4 block">ðŸ“š</span>
                            <p className="text-sm text-content-secondary font-medium">
                                {filter === 'enrolled' ? 'Belum ada kursus yang diikuti.' : 'Tidak ada kursus yang tersedia.'}
                            </p>
                            {filter === 'enrolled' && (
                                <p className="text-xs text-content-muted mt-2">Gunakan kode enroll dari dosen untuk bergabung ke kursus.</p>
                            )}
                        </motion.div>
                    )}
                    {filteredCourses.map((course, index) => (
                        <CourseCard key={course.id} course={course} delay={index * 0.1} />
                    ))}
                </StaggerContainer>
            </AnimatedPage>
        </StudentLayout>
    );
}

function CourseCard({ course, delay }) {
    const enrollForm = useForm({ enroll_code: '' });

    const handleEnroll = (event) => {
        event.preventDefault();

        enrollForm.post('/student/enrollments', {
            preserveScroll: true,
            onSuccess: () => enrollForm.reset(),
        });
    };

    // Determine card action based on enrollment status
    const getCardAction = () => {
        if (!course.enrollment_status) {
            // Not enrolled - show enroll button
            return {
                type: 'enroll',
                label: course.enrollment_type === 'auto' ? 'Gabung Sekarang' : 'Minta Akses',
                action: handleEnroll,
                disabled: enrollForm.processing,
            };
        }

        if (course.enrollment_status === 'active') {
            // Active enrollment - show continue learning
            return {
                type: 'continue',
                label: 'Lanjut Belajar',
                href: `/student/courses/${course.id}`,
            };
        }

        if (course.enrollment_status === 'pending') {
            // Pending approval
            return {
                type: 'status',
                label: 'Menunggu Persetujuan',
                variant: 'warning',
            };
        }

        if (course.enrollment_status === 'rejected') {
            // Rejected - can request again
            return {
                type: 'enroll',
                label: 'Minta Akses Lagi',
                action: handleEnroll,
                disabled: enrollForm.processing,
            };
        }
    };

    const cardAction = getCardAction();
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
            {/* Banner — sama dengan Dashboard */}
            <div className="relative h-36 overflow-hidden bg-gradient-to-br from-emerald-500/90 via-teal-500/90 to-emerald-600/90 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                <div className="absolute -right-6 -top-6 size-24 rounded-full bg-emerald-400/20 blur-2xl" />
                {course.enrollment_status && (
                    <div className="absolute top-3 left-3">
                        <EnrollmentBadge status={course.enrollment_status} />
                    </div>
                )}
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
                            {course.code}
                        </span>
                    </div>
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight tracking-tight text-content-primary">
                        {course.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-content-secondary">
                        <div className="flex size-5 items-center justify-center rounded-full border bg-gradient-to-br
                            from-emerald-100 to-teal-100 border-emerald-200/60
                            dark:from-emerald-600/30 dark:to-teal-600/30 dark:border-emerald-500/20"
                        >
                            <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                                {course.instructor?.name?.charAt(0) ?? 'D'}
                            </span>
                        </div>
                        <span className="font-medium truncate">{course.instructor?.name ?? 'Dosen belum tersedia'}</span>
                    </div>
                </div>

                {/* Progress */}
                {course.enrollment_status === 'active' && (
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
                                {course.progress}%
                            </motion.span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${course.progress}%` }}
                                transition={{ duration: 1.2, delay: delay + 0.3, ease: [0.23, 1, 0.32, 1] }}
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                            />
                        </div>
                    </div>
                )}

                {/* Action */}
                {cardAction.type === 'continue' && (
                    <Link href={cardAction.href} className="block w-full">
                        <Button
                            variant="success"
                            size="sm"
                            className="w-full h-9 rounded-[10px]"
                        >
                            {cardAction.label}
                        </Button>
                    </Link>
                )}

                {cardAction.type === 'enroll' && (
                    <form onSubmit={cardAction.action} className="space-y-2">
                        <div>
                            <label htmlFor={`enroll-code-${course.id}`} className="sr-only">
                                Kode Enroll
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                id={`enroll-code-${course.id}`}
                                value={enrollForm.data.enroll_code}
                                onChange={(event) => enrollForm.setData('enroll_code', event.target.value)}
                                placeholder="Masukkan kode enroll"
                                className="h-9 w-full rounded-[10px] border px-3 text-xs outline-none transition-all
                                    border-line bg-surface text-content-primary placeholder:text-content-muted focus:border-brand focus:ring-4 focus:ring-brand/10"
                            />
                            {enrollForm.errors.enroll_code && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    {enrollForm.errors.enroll_code}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            variant="default"
                            size="sm"
                            disabled={cardAction.disabled}
                            loading={enrollForm.processing}
                            className="w-full h-9 rounded-[10px] bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        >
                            {cardAction.disabled ? 'Memproses...' : cardAction.label}
                        </Button>
                    </form>
                )}

                {cardAction.type === 'status' && (
                    <div className="py-1.5 text-center text-[11px] font-medium text-content-muted">
                        Menunggu persetujuan dosen
                    </div>
                )}
            </div>
        </motion.article>
    );
}

function EnrollmentBadge({ status }) {
    const config = {
        active:   { label: 'Terdaftar', cls: 'bg-emerald-100/90 border-emerald-300/80 text-emerald-800 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-300', dot: 'bg-emerald-500 dark:bg-emerald-400' },
        pending:  { label: 'Pending',   cls: 'bg-amber-100/90 border-amber-300/80 text-amber-800 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-300', dot: 'bg-amber-500 dark:bg-amber-400' },
        rejected: { label: 'Ditolak',   cls: 'bg-red-100/90 border-red-300/80 text-red-800 dark:bg-red-500/20 dark:border-red-500/40 dark:text-red-300', dot: null },
    };
    const cfg = config[status] ?? { label: status, cls: 'bg-white/80 border-white/40 text-neutral-700 dark:bg-white/10 dark:border-white/20 dark:text-white/60', dot: null };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${cfg.cls}`}>
            {cfg.dot && <span className={`size-1.5 rounded-full animate-pulse ${cfg.dot}`} />}
            {cfg.label}
        </span>
    );
}

