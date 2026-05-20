import { Head, Link, router, useForm } from '@inertiajs/react';
import { BadgeCheck, BookOpen, CalendarClock, CheckCircle2, KeyRound, Search, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import StudentLayout from '@/Layouts/StudentLayout';
import { AnimatedCard } from '@/components/animated/AnimatedCard';
import { AnimatedButton } from '@/components/animated/AnimatedButton';
import { AnimatedBadge, AnimatedDot } from '@/components/animated/AnimatedBadge';
import { AnimatedPage, StaggerContainer, FadeInWhenVisible } from '@/components/animated/AnimatedPage';
import { fadeUp, staggerContainer } from '@/lib/animations';

const statsConfig = [
    { key: 'active_courses', label: 'Kursus Aktif', icon: BookOpen, tone: 'emerald' },
    { key: 'overall_progress', label: 'Progress', icon: CheckCircle2, tone: 'blue', suffix: '%' },
    { key: 'assignments_due', label: 'Tugas Mendatang', icon: CalendarClock, tone: 'amber' },
    { key: 'certificates', label: 'Sertifikat', icon: BadgeCheck, tone: 'slate' },
];

const iconToneClasses = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    blue: 'border-sky-200 bg-sky-50 text-sky-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
};

export default function DashboardAnimated({ filters, stats, enrollments, upcomingAssignments }) {
    const enrollForm = useForm({ enroll_code: '' });
    const filterForm = useForm({ search: filters.search ?? '' });

    const joinCourse = (event) => {
        event.preventDefault();
        enrollForm.post('/student/enrollments', {
            preserveScroll: true,
            onSuccess: () => enrollForm.reset(),
        });
    };

    const search = (event) => {
        event.preventDefault();
        router.get('/student/dashboard', filterForm.data, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <StudentLayout title="Dashboard">
            <Head title="Dashboard Mahasiswa" />

            <AnimatedPage>
                {/* Hero Section with Greeting - Improved Layout */}
                <section className="mb-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-3"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/80 backdrop-blur-sm border border-emerald-200/60"
                            >
                                <BookOpen className="size-3.5 text-emerald-700" aria-hidden="true" />
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                    Assalamu'alaikum
                                </span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]"
                            >
                                <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                    Selamat belajar
                                </span>
                                <br />
                                <span className="text-neutral-800">
                                    hari ini.
                                </span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="max-w-2xl text-base leading-relaxed text-neutral-600"
                            >
                                Pantau kursus aktif, lanjutkan materi, dan masuk ke kelas baru dengan kode enroll dari dosen.
                            </motion.p>
                        </motion.div>

                        {/* Join Course Card - Enhanced */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <motion.div
                                whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(16, 185, 129, 0.25)' }}
                                className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 shadow-2xl shadow-emerald-500/10 border border-emerald-100/60"
                            >
                                
                                <div className="relative space-y-4">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="flex size-10 items-center justify-center rounded-[10px] border border-emerald-200 bg-emerald-50 text-emerald-700"
                                        >
                                            <KeyRound className="size-5" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-neutral-900">Join Kursus</h2>
                                            <p className="text-xs text-neutral-600">Masukkan kode dari dosen</p>
                                        </div>
                                    </div>
                                    
                                    <form onSubmit={joinCourse} className="space-y-3">
                                        <div>
                                            <label htmlFor="enroll-code" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                                                Kode Enroll
                                            </label>
                                            <motion.input
                                                whileFocus={{ scale: 1.01 }}
                                                id="enroll-code"
                                                value={enrollForm.data.enroll_code}
                                                onChange={(event) => enrollForm.setData('enroll_code', event.target.value)}
                                                className="h-10 w-full rounded-lg border-2 border-neutral-200 px-3 text-sm text-neutral-900 uppercase font-semibold tracking-wider outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-white/70"
                                                placeholder="KODE123"
                                            />
                                            {enrollForm.errors.enroll_code && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
                                                >
                                                    <span className="size-1.5 rounded-full bg-red-600" aria-hidden="true" />
                                                    {enrollForm.errors.enroll_code}
                                                </motion.p>
                                            )}
                                        </div>
                                        <AnimatedButton
                                            type="submit"
                                            variant="primary"
                                            className="h-10 w-full text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30"
                                            disabled={enrollForm.processing}
                                        >
                                            {enrollForm.processing ? 'Mengirim...' : 'Gabung Sekarang'}
                                        </AnimatedButton>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Cards - Enhanced with better spacing */}
                <StaggerContainer delay={0.4} className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statsConfig.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.article
                                key={item.key}
                                variants={fadeUp}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm p-5 shadow-lg border border-neutral-200/60 hover:shadow-2xl hover:border-emerald-200/60 transition-all"
                            >
                                <div className="relative flex items-start justify-between">
                                    <div>
                                        <motion.p 
                                            className="text-3xl font-bold text-neutral-900"
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                                        >
                                            {stats[item.key]}{item.suffix ?? ''}
                                        </motion.p>
                                        <p className="mt-1.5 text-xs font-semibold text-neutral-600">{item.label}</p>
                                    </div>
                                    <div className={`flex size-11 items-center justify-center rounded-[10px] border ${iconToneClasses[item.tone]}`}>
                                        <Icon className="size-5" aria-hidden="true" />
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </StaggerContainer>

                {/* Main Content Grid - Improved spacing and layout */}
                <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                    {/* Courses Section - Enhanced */}
                    <FadeInWhenVisible>
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 shadow-xl border border-neutral-200/60 h-full"
                        >
                            <div className="relative">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2.5">
                                            Kursus Saya
                                        </h2>
                                        <p className="mt-1 text-xs text-neutral-600">Status aktif, pending, dan rejected terlihat di sini.</p>
                                    </div>
                                    <form onSubmit={search} className="relative">
                                        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400" />
                                        <motion.input
                                            whileFocus={{ scale: 1.02 }}
                                            value={filterForm.data.search}
                                            onChange={(event) => filterForm.setData('search', event.target.value)}
                                            placeholder="Cari kursus/materi"
                                            className="h-9 w-full rounded-lg border-2 border-neutral-200 pl-9 pr-3 text-xs outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-white/70 md:w-64"
                                        />
                                    </form>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {enrollments.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="col-span-2 rounded-xl border-2 border-dashed border-neutral-200 p-8 text-center bg-neutral-50/50"
                                        >
                                            <BookOpen className="mx-auto mb-3 size-8 text-neutral-400" aria-hidden="true" />
                                            <p className="text-xs text-neutral-500 font-medium">Belum ada kursus.</p>
                                        </motion.div>
                                    )}
                                    {enrollments.map((enrollment, index) => (
                                        <CourseCard key={enrollment.id} enrollment={enrollment} delay={index * 0.1} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </FadeInWhenVisible>

                    {/* Assignments Section - Enhanced */}
                    <FadeInWhenVisible>
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 shadow-xl border border-neutral-200/60 h-full"
                        >
                            <div className="relative">
                                <div className="flex items-center gap-2.5 mb-6">
                                    <div className="flex size-10 items-center justify-center rounded-[10px] border border-amber-200 bg-amber-50 text-amber-700">
                                        <CalendarClock className="size-5" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-neutral-900">Tugas Mendatang</h2>
                                        <p className="text-xs text-neutral-600">Deadline yang perlu diperhatikan</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    {upcomingAssignments.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-8 bg-neutral-50/50 rounded-xl"
                                        >
                                            <CheckCircle2 className="mx-auto mb-3 size-8 text-neutral-400" aria-hidden="true" />
                                            <p className="text-xs text-neutral-500 font-medium">Belum ada tugas mendatang.</p>
                                        </motion.div>
                                    )}
                                    {upcomingAssignments.map((assignment, index) => (
                                        <AssignmentCard key={assignment.id} assignment={assignment} delay={index * 0.1} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </FadeInWhenVisible>
                </div>
            </AnimatedPage>
        </StudentLayout>
    );
}

function CourseCard({ enrollment, delay }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
        >
            {/* Inner card container */}
            <div className="relative overflow-hidden bg-white">
                <div className="relative h-24 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700">
                    <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l20 20-20 20-20-20L40 0zm0 40l20 20-20 20-20-20 20-20zm20-20l20 20-20 20-20-20 20-20zM0 20l20 20-20 20L0 40V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    <div className="absolute top-3 left-3">
                        <StatusBadge status={enrollment.status} />
                    </div>
                    <div className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-[10px] border border-white/25 bg-white/10 text-white">
                        <BookOpen className="size-5" aria-hidden="true" />
                    </div>
                </div>

                {/* Content section with refined spacing */}
                <div className="relative p-5 space-y-4">
                    <div className="space-y-2">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: delay + 0.3 }}
                            className="inline-flex items-center gap-1.5 rounded-[6px] border border-emerald-200 bg-emerald-50 px-2.5 py-1"
                        >
                            <span className="size-1.5 rounded-full bg-emerald-600" />
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.1em] font-mono">
                                {enrollment.course.code}
                            </span>
                        </motion.div>
                        
                        {/* Course title with better typography */}
                        <h3 className="text-base font-bold text-neutral-900 leading-tight line-clamp-2 tracking-tight">
                            {enrollment.course.name}
                        </h3>
                        
                        {/* Instructor with decorative element */}
                        <div className="flex items-center gap-2 text-xs text-neutral-600">
                            <div className="flex items-center gap-1.5">
                                <div className="size-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center border border-emerald-200/60">
                                    <span className="text-[10px] font-bold text-emerald-700">
                                        {enrollment.course.instructor?.name?.charAt(0) ?? 'D'}
                                    </span>
                                </div>
                                <span className="font-medium">
                                    {enrollment.course.instructor?.name ?? 'Dosen belum tersedia'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Progress section with enhanced visual hierarchy */}
                    <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                                <TrendingUp className="size-3.5 text-emerald-600" />
                                Progress Pembelajaran
                            </span>
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: delay + 0.5, type: 'spring' }}
                                className="text-sm font-bold text-emerald-600 tabular-nums"
                            >
                                {enrollment.course.progress}%
                            </motion.span>
                        </div>
                        
                        {/* Sophisticated progress bar with layered design */}
                        <div className="relative">
                            {/* Background track with inner shadow */}
                            <div className="h-3 rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 shadow-inner overflow-hidden border border-neutral-200/60">
                                {/* Animated progress fill with multiple layers */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${enrollment.course.progress}%` }}
                                    transition={{ duration: 1.2, delay: delay + 0.4, ease: [0.23, 1, 0.32, 1] }}
                                    className="relative h-3 rounded-full overflow-hidden"
                                >
                                    {/* Base gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
                                    
                                    {/* Top highlight */}
                                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                                </motion.div>
                            </div>
                            
                        </div>
                    </div>

                    {/* Action button or status message */}
                    {enrollment.status === 'active' ? (
                        <Link href={`/student/courses/${enrollment.course.id}`}>
                            <motion.button
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex h-11 w-full items-center justify-center rounded-[10px] bg-emerald-700 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                            >
                                Lanjut Belajar
                            </motion.button>
                        </Link>
                    ) : (
                        <div className="text-center py-2 text-xs text-neutral-500 font-medium">
                            {enrollment.status === 'pending' ? 'Menunggu persetujuan dosen' : 'Pendaftaran ditolak'}
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

function AssignmentCard({ assignment, delay }) {
    return (
        <motion.article
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="flex items-start gap-2.5 rounded-[12px] border border-amber-200 bg-white p-3 shadow-sm transition-all hover:border-amber-300 hover:bg-amber-50/30"
        >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-amber-200 bg-amber-50 text-amber-700">
                <CalendarClock className="size-4" aria-hidden="true" />
            </div>
            <div className="relative flex-1">
                <p className="text-xs font-bold text-neutral-900 leading-snug">{assignment.title}</p>
                <p className="mt-0.5 text-[10px] font-medium text-neutral-600">{assignment.deadline}</p>
            </div>
        </motion.article>
    );
}

function StatusBadge({ status }) {
    const config = {
        active: { 
            label: 'Aktif', 
            variant: 'success',
            dot: true,
        },
        pending: { 
            label: 'Pending', 
            variant: 'warning',
            dot: true,
        },
        rejected: { 
            label: 'Ditolak', 
            variant: 'danger',
            dot: false,
        },
    };

    const { label, variant, dot } = config[status] || { label: status, variant: 'default', dot: false };

    return (
        <AnimatedBadge variant={variant} size="sm" animate={dot}>
            {dot && <AnimatedDot variant={variant} />}
            {label}
        </AnimatedBadge>
    );
}
