import { Head, Link, router, useForm } from '@inertiajs/react';
import { Award, BookOpen, CheckCircle2, Clock, FileText, GraduationCap, Search, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import StudentLayout from '@/Layouts/StudentLayout';
import { AnimatedCard } from '@/components/animated/AnimatedCard';
import { AnimatedButton } from '@/components/animated/AnimatedButton';
import { AnimatedBadge, AnimatedDot } from '@/components/animated/AnimatedBadge';
import { AnimatedPage, StaggerContainer, FadeInWhenVisible } from '@/components/animated/AnimatedPage';
import { fadeUp, staggerContainer } from '@/lib/animations';

const statsConfig = [
    { key: 'active_courses', label: 'Kursus Aktif', icon: BookOpen, color: 'from-emerald-500 to-teal-600' },
    { key: 'overall_progress', label: 'Progress', icon: CheckCircle2, color: 'from-blue-500 to-cyan-600', suffix: '%' },
    { key: 'assignments_due', label: 'Tugas Mendatang', icon: FileText, color: 'from-amber-500 to-orange-600' },
    { key: 'certificates', label: 'Sertifikat', icon: Award, color: 'from-purple-500 to-pink-600' },
];

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
                                <span className="text-base">🕌</span>
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
                                {/* Decorative gradient */}
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl" />
                                
                                <div className="relative space-y-4">
                                    <div className="flex items-center gap-2.5">
                                        <motion.div
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                            className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                                        >
                                            <span className="text-xl">🎓</span>
                                        </motion.div>
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
                                                    <span>⚠️</span>
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
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-300`} />
                                
                                {/* Glow effect */}
                                <div className={`absolute -inset-1 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
                                
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
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                        className={`flex size-11 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} text-white shadow-lg`}
                                    >
                                        <Icon className="size-5" />
                                    </motion.div>
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
                            {/* Decorative gradient */}
                            <div className="absolute -top-20 -right-20 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl" />
                            
                            <div className="relative">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2.5">
                                            <span className="text-2xl">📚</span>
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
                                            <span className="text-4xl mb-3 block">📖</span>
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
                            {/* Decorative gradient */}
                            <div className="absolute -top-20 -left-20 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl" />
                            
                            <div className="relative">
                                <div className="flex items-center gap-2.5 mb-6">
                                    <motion.div
                                        animate={{ rotate: [0, -10, 10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                        className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg"
                                    >
                                        <Clock className="size-5" />
                                    </motion.div>
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
                                            <span className="text-4xl mb-3 block">✅</span>
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
            whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgb(16,185,129,0.3)] transition-all duration-500"
        >
            {/* Outer glow ring */}
            <div className="absolute -inset-[2px] bg-gradient-to-br from-emerald-400 via-teal-400 to-green-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-3xl" />
            
            {/* Inner card container */}
            <div className="relative bg-white rounded-3xl overflow-hidden">
                {/* Decorative Islamic geometric header */}
                <div className="relative h-32 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 overflow-hidden">
                    {/* Layered Islamic patterns */}
                    <div
                        className="absolute inset-0 opacity-[0.15]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l20 20-20 20-20-20L40 0zm0 40l20 20-20 20-20-20 20-20zm20-20l20 20-20 20-20-20 20-20zM0 20l20 20-20 20L0 40V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    
                    {/* Ornamental corner decoration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: delay + 0.2, duration: 0.6 }}
                        className="absolute top-2.5 right-2.5"
                    >
                        <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="opacity-30">
                            <path d="M24 4L28 16L40 20L28 24L24 36L20 24L8 20L20 16L24 4Z" fill="white" />
                            <circle cx="24" cy="20" r="3" fill="white" fillOpacity="0.6" />
                        </svg>
                    </motion.div>
                    
                    {/* Animated gradient orb */}
                    <motion.div
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"
                    />
                    
                    {/* Status badge positioned in header */}
                    <div className="absolute top-3 left-3">
                        <StatusBadge status={enrollment.status} />
                    </div>
                    
                    {/* Floating book icon with sophisticated animation */}
                    <motion.div
                        animate={{ 
                            y: [0, -8, 0],
                            rotateY: [0, 10, 0],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute bottom-3 right-3 flex size-14 items-center justify-center rounded-2xl bg-white/25 backdrop-blur-md shadow-2xl border border-white/40"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <GraduationCap className="size-7 text-white drop-shadow-lg" />
                    </motion.div>
                    
                    {/* Decorative bottom wave */}
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/20 to-transparent" />
                </div>

                {/* Content section with refined spacing */}
                <div className="relative p-5 space-y-4">
                    {/* Decorative top border accent */}
                    <div className="absolute top-0 left-5 right-5 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40" />
                    
                    <div className="space-y-2">
                        {/* Course code badge with ornamental style */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: delay + 0.3 }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60"
                        >
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
                                    
                                    {/* Shimmer effect */}
                                    <motion.div
                                        animate={{
                                            x: ['-100%', '200%'],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'linear',
                                            repeatDelay: 1,
                                        }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                        style={{ width: '50%' }}
                                    />
                                    
                                    {/* Top highlight */}
                                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                                </motion.div>
                            </div>
                            
                            {/* Glow effect under progress bar */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: enrollment.course.progress > 0 ? 0.6 : 0 }}
                                transition={{ delay: delay + 0.6 }}
                                className="absolute -bottom-1 left-0 h-2 bg-gradient-to-r from-emerald-500/40 to-teal-500/40 blur-md rounded-full"
                                style={{ width: `${enrollment.course.progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Action button or status message */}
                    {enrollment.status === 'active' ? (
                        <Link href={`/student/courses/${enrollment.course.id}`}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative w-full h-11 rounded-xl overflow-hidden group/btn shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
                            >
                                {/* Gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 group-hover/btn:from-emerald-700 group-hover/btn:via-teal-700 group-hover/btn:to-emerald-700 transition-all duration-300" />
                                
                                {/* Shine effect on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100"
                                    animate={{
                                        x: ['-100%', '200%'],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatDelay: 0.5,
                                    }}
                                />
                                
                                {/* Button text */}
                                <span className="relative flex items-center justify-center gap-2 text-sm font-bold text-white tracking-wide">
                                    Lanjut Belajar
                                    <motion.span
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        →
                                    </motion.span>
                                </span>
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
            whileHover={{ x: 4, y: -2, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden flex items-start gap-2.5 rounded-xl border border-amber-200/60 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20 backdrop-blur-sm p-3 hover:border-amber-300 hover:shadow-xl shadow-lg transition-all"
        >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
            
            <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/40"
            >
                <Clock className="size-4" />
            </motion.div>
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
