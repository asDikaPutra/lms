import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Clock, GraduationCap, Search, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import StudentLayout from '@/Layouts/StudentLayout';
import { AnimatedButton } from '@/components/animated/AnimatedButton';
import { AnimatedBadge } from '@/components/animated/AnimatedBadge';
import { AnimatedPage, StaggerContainer, FadeInWhenVisible } from '@/components/animated/AnimatedPage';
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
                            <BookOpen className="size-3.5 text-emerald-700" />
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                Katalog Kursus
                            </span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]"
                        >
                            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                Kursus Tersedia
                            </span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-2xl text-sm leading-relaxed text-neutral-600"
                        >
                            Jelajahi semua kursus yang tersedia dan bergabung untuk memulai pembelajaran.
                        </motion.p>
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
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                filter === 'all'
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-emerald-300'
                            }`}
                        >
                            Semua Kursus
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFilter('enrolled')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                filter === 'enrolled'
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-emerald-300'
                            }`}
                        >
                            Kursus Saya
                        </motion.button>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <motion.input
                            whileFocus={{ scale: 1.01 }}
                            value={searchForm.data.search}
                            onChange={(event) => searchForm.setData('search', event.target.value)}
                            placeholder="Cari kursus..."
                            className="h-11 w-full rounded-xl border-2 border-neutral-200 pl-10 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-white/90 backdrop-blur-sm shadow-sm"
                        />
                    </form>
                </motion.div>

                {/* Course Grid */}
                <StaggerContainer delay={0.5} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full rounded-2xl border-2 border-dashed border-neutral-200 p-12 text-center bg-white/60 backdrop-blur-sm"
                        >
                            <span className="text-5xl mb-4 block">📚</span>
                            <p className="text-sm text-neutral-600 font-medium">
                                {filter === 'enrolled' ? 'Belum ada kursus yang diikuti.' : 'Tidak ada kursus yang tersedia.'}
                            </p>
                            {filter === 'enrolled' && (
                                <p className="text-xs text-neutral-500 mt-2">Gunakan kode enroll dari dosen untuk bergabung ke kursus.</p>
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
            variants={fadeUp}
            whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }}
            className="group relative overflow-hidden rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgb(16,185,129,0.3)] transition-all duration-500"
        >
            {/* Outer glow ring */}
            <div className="absolute -inset-[2px] bg-gradient-to-br from-emerald-400 via-teal-400 to-green-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-3xl" />
            
            {/* Glass card container with backdrop blur */}
            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/40">
                {/* Decorative Islamic geometric header */}
                <div className="relative h-36 bg-gradient-to-br from-emerald-500/90 via-teal-500/90 to-emerald-600/90 backdrop-blur-sm overflow-hidden">
                    {/* Layered Islamic patterns */}
                    <div
                        className="absolute inset-0 opacity-[0.2]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l20 20-20 20-20-20L40 0zm0 40l20 20-20 20-20-20 20-20zm20-20l20 20-20 20-20-20 20-20zM0 20l20 20-20 20L0 40V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    
                    {/* Glass overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                    
                    {/* Ornamental corner decoration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: delay + 0.2, duration: 0.6 }}
                        className="absolute top-3 right-3"
                    >
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-40 drop-shadow-lg">
                            <path d="M24 4L28 16L40 20L28 24L24 36L20 24L8 20L20 16L24 4Z" fill="white" />
                            <circle cx="24" cy="20" r="3" fill="white" fillOpacity="0.7" />
                        </svg>
                    </motion.div>
                    
                    {/* Enrollment status badge */}
                    {course.enrollment_status && (
                        <div className="absolute top-3 left-3">
                            <EnrollmentBadge status={course.enrollment_status} />
                        </div>
                    )}
                    
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
                        className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/20 rounded-full blur-2xl"
                    />
                    
                    {/* Floating book icon with glass effect */}
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
                        className="absolute bottom-4 right-4 flex size-16 items-center justify-center rounded-2xl bg-white/30 backdrop-blur-xl shadow-2xl border border-white/50"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <GraduationCap className="size-8 text-white drop-shadow-lg" />
                    </motion.div>
                    
                    {/* Decorative bottom wave with glass effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/30 to-transparent backdrop-blur-sm" />
                </div>

                {/* Content section with glass background */}
                <div className="relative p-6 space-y-5 bg-gradient-to-b from-white/50 to-white/70 backdrop-blur-md">
                    {/* Decorative top border accent */}
                    <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
                    
                    <div className="space-y-2">
                        {/* Course code badge with glass effect */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: delay + 0.3 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 backdrop-blur-sm border border-emerald-200/60"
                        >
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.1em] font-mono">
                                {course.code}
                            </span>
                        </motion.div>
                        
                        {/* Course title with better typography */}
                        <h3 className="text-lg font-bold text-neutral-900 leading-tight line-clamp-2 tracking-tight drop-shadow-sm">
                            {course.name}
                        </h3>
                        
                        {/* Instructor with glass avatar */}
                        <div className="flex items-center gap-2 text-xs text-neutral-700">
                            <div className="flex items-center gap-1.5">
                                <div className="size-6 rounded-full bg-gradient-to-br from-emerald-200/80 to-teal-200/80 backdrop-blur-sm flex items-center justify-center border border-emerald-300/60 shadow-sm">
                                    <span className="text-[10px] font-bold text-emerald-800">
                                        {course.instructor?.name?.charAt(0) ?? 'D'}
                                    </span>
                                </div>
                                <span className="font-medium drop-shadow-sm">
                                    {course.instructor?.name ?? 'Dosen belum tersedia'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Progress section with glass effect */}
                    {course.enrollment_status === 'active' && (
                        <div className="space-y-2.5 p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                                    <TrendingUp className="size-3.5 text-emerald-600" />
                                    Progress Pembelajaran
                                </span>
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: delay + 0.5, type: 'spring' }}
                                    className="text-sm font-bold text-emerald-600 tabular-nums drop-shadow-sm"
                                >
                                    {course.progress}%
                                </motion.span>
                            </div>
                            
                            {/* Sophisticated progress bar with glass design */}
                            <div className="relative">
                                {/* Background track with glass effect */}
                                <div className="h-3 rounded-full bg-white/60 backdrop-blur-sm shadow-inner overflow-hidden border border-white/80">
                                    {/* Animated progress fill with multiple layers */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${course.progress}%` }}
                                        transition={{ duration: 1.2, delay: delay + 0.4, ease: [0.23, 1, 0.32, 1] }}
                                        className="relative h-3 rounded-full overflow-hidden"
                                    >
                                        {/* Base gradient with transparency */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/90 via-teal-500/90 to-emerald-600/90 backdrop-blur-sm" />
                                        
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
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                            style={{ width: '50%' }}
                                        />
                                        
                                        {/* Top highlight */}
                                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                                    </motion.div>
                                </div>
                                
                                {/* Glow effect under progress bar */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: course.progress > 0 ? 0.6 : 0 }}
                                    transition={{ delay: delay + 0.6 }}
                                    className="absolute -bottom-1 left-0 h-2 bg-gradient-to-r from-emerald-500/40 to-teal-500/40 blur-md rounded-full"
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Action button with glass styling */}
                    {cardAction.type === 'continue' && (
                        <Link href={cardAction.href}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative w-full h-11 rounded-xl overflow-hidden group/btn shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
                            >
                                {/* Glass gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/95 via-teal-600/95 to-emerald-600/95 backdrop-blur-sm group-hover/btn:from-emerald-700/95 group-hover/btn:via-teal-700/95 group-hover/btn:to-emerald-700/95 transition-all duration-300" />
                                
                                {/* Shine effect on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/btn:opacity-100"
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
                                <span className="relative flex items-center justify-center gap-2 text-sm font-bold text-white tracking-wide drop-shadow-lg">
                                    {cardAction.label}
                                    <motion.span
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        →
                                    </motion.span>
                                </span>
                            </motion.button>
                        </Link>
                    )}

                    {cardAction.type === 'enroll' && (
                        <form onSubmit={cardAction.action} className="space-y-2.5">
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
                                    className="h-10 w-full rounded-xl border-2 border-neutral-200 bg-white/80 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                                {enrollForm.errors.enroll_code && (
                                    <p className="mt-1.5 text-xs font-medium text-red-600">
                                        {enrollForm.errors.enroll_code}
                                    </p>
                                )}
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={cardAction.disabled}
                                className="relative w-full h-11 rounded-xl overflow-hidden group/btn shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {/* Glass gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 via-cyan-600/95 to-blue-600/95 backdrop-blur-sm group-hover/btn:from-blue-700/95 group-hover/btn:via-cyan-700/95 group-hover/btn:to-blue-700/95 transition-all duration-300" />

                                {/* Shine effect on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/btn:opacity-100"
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
                                <span className="relative flex items-center justify-center gap-2 text-sm font-bold text-white tracking-wide drop-shadow-lg">
                                    {cardAction.disabled ? 'Memproses...' : cardAction.label}
                                </span>
                            </motion.button>
                        </form>
                    )}

                    {cardAction.type === 'status' && (
                        <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-100/60 backdrop-blur-sm border border-amber-200/60">
                            <Clock className="size-4 text-amber-700" />
                            <span className="text-sm font-semibold text-amber-800 drop-shadow-sm">{cardAction.label}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

function EnrollmentBadge({ status }) {
    const config = {
        active: {
            label: 'Terdaftar',
            className: 'bg-emerald-100/80 backdrop-blur-sm text-emerald-800 border-emerald-300/70',
            icon: <CheckCircle2 className="size-3" />,
        },
        pending: {
            label: 'Pending',
            className: 'bg-amber-100/80 backdrop-blur-sm text-amber-800 border-amber-300/70',
            icon: <Clock className="size-3" />,
        },
        rejected: {
            label: 'Ditolak',
            className: 'bg-red-100/80 backdrop-blur-sm text-red-800 border-red-300/70',
            icon: null,
        },
    };

    const badge = config[status];
    if (!badge) return null;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-lg ${badge.className}`}>
            {badge.icon}
            {badge.label}
        </div>
    );
}
