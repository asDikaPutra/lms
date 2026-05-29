import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Clock, FileCheck2, GraduationCap, HelpCircle, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

import InstructorLayout from '@/Layouts/InstructorLayout';
import { Button } from '@/components/ui/button';
import { AnimatedPage, StaggerContainer, FadeInWhenVisible } from '@/components/animated/AnimatedPage';
import { fadeUp } from '@/lib/animations';

const statsConfig = [
    { key: 'owned_courses', label: 'Kursus', icon: BookOpen, tone: 'emerald' },
    { key: 'pending_enrollments', label: 'Menunggu Approval', icon: Clock, tone: 'amber' },
    { key: 'submissions_needing_grading', label: 'Tugas Perlu Nilai', icon: FileCheck2, tone: 'blue' },
    { key: 'quiz_attempts_needing_grading', label: 'Quiz Perlu Nilai', icon: HelpCircle, tone: 'slate' },
];

const iconToneClasses = {
    emerald: 'from-emerald-400 via-emerald-500 to-teal-600 shadow-[0_4px_12px_rgba(5,150,105,0.32)]',
    amber: 'from-amber-400 via-amber-500 to-orange-500 shadow-[0_4px_12px_rgba(245,158,11,0.28)]',
    blue: 'from-blue-400 via-blue-500 to-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.28)]',
    slate: 'from-slate-400 via-slate-500 to-slate-600 shadow-[0_4px_12px_rgba(100,116,139,0.28)]',
};

export default function Dashboard({ stats, courses, pendingEnrollments, recentDiscussions }) {
    return (
        <InstructorLayout title="Dashboard">
            <Head title="Dashboard Dosen" />

            <AnimatedPage>
                {/* Hero Section */}
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm border
                                bg-emerald-100/80 border-emerald-200/60
                                dark:bg-emerald-500/15 dark:border-emerald-500/30"
                        >
                            <GraduationCap className="size-3.5 text-emerald-700 dark:text-emerald-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                Dashboard Dosen
                            </span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]"
                        >
                            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-teal-300 dark:to-emerald-400">
                                Selamat datang
                            </span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-white/45"
                        >
                            Kelola kursus, nilai tugas, dan pantau progress mahasiswa Anda.
                        </motion.p>
                    </motion.div>
                </section>

                {/* Stats Cards */}
                <StaggerContainer delay={0.4} className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statsConfig.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.article
                                key={item.key}
                                variants={fadeUp}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="group relative overflow-hidden rounded-xl p-5 shadow-lg border backdrop-blur-sm transition-all
                                    bg-white/90 border-neutral-200/60 hover:shadow-2xl hover:border-emerald-200/60
                                    dark:bg-[#111a15] dark:border-white/[0.07] dark:hover:border-emerald-500/25 dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)]"
                            >
                                <div className="relative flex items-start justify-between">
                                    <div>
                                        <motion.p 
                                            className="text-3xl font-bold text-neutral-900 dark:text-white/90"
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                                        >
                                            {stats[item.key]}
                                        </motion.p>
                                        <p className="mt-1.5 text-xs font-semibold text-neutral-600 dark:text-white/40">{item.label}</p>
                                    </div>
                                    <div className={`flex size-11 items-center justify-center rounded-[13px] bg-gradient-to-br text-white ${iconToneClasses[item.tone]}`}>
                                        <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </StaggerContainer>

                {/* Main Content Grid */}
                <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
                    {/* Courses Section */}
                    <FadeInWhenVisible>
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="relative overflow-hidden rounded-2xl p-6 shadow-xl border backdrop-blur-xl transition-shadow h-full
                                bg-white/90 border-neutral-200/60
                                dark:bg-[#111a15] dark:border-white/[0.07] dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
                        >
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold flex items-center gap-2.5 text-neutral-900 dark:text-white/90">
                                            <BookOpen className="size-5 text-emerald-600" strokeWidth={1.75} aria-hidden="true" />
                                            Kursus Saya
                                        </h2>
                                        <p className="mt-1 text-xs text-neutral-600 dark:text-white/35">Kelola dan pantau kursus Anda</p>
                                    </div>
                                    <Link 
                                        href="/instructor/courses"
                                        className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                                    >
                                        Kelola kursus
                                    </Link>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {courses.length === 0 && (
                                        <div className="col-span-2 rounded-xl border-2 border-dashed p-8 text-center
                                            border-neutral-200 bg-neutral-50/50
                                            dark:border-white/10 dark:bg-transparent">
                                            <BookOpen className="mx-auto mb-3 size-8 text-neutral-400 dark:text-white/20" aria-hidden="true" />
                                            <p className="text-xs text-neutral-500 dark:text-white/30 font-medium">Belum ada kursus.</p>
                                        </div>
                                    )}
                                    {courses.map((course, index) => (
                                        <CourseCard key={course.id} course={course} delay={index * 0.1} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </FadeInWhenVisible>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Pending Enrollments */}
                        <FadeInWhenVisible>
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="relative overflow-hidden rounded-2xl p-6 shadow-xl border backdrop-blur-xl
                                    bg-white/90 border-neutral-200/60
                                    dark:bg-[#111a15] dark:border-white/[0.07] dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
                            >
                                
                                <div className="relative">
                                    <div className="flex items-center gap-2.5 mb-6">
                                        <span className="inline-flex size-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-[0_4px_12px_rgba(245,158,11,0.28)]">
                                            <Clock className="size-5" strokeWidth={1.75} aria-hidden="true" />
                                        </span>
                                        <div>
                                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white/90">Pengajuan Enrollment</h2>
                                            <p className="text-xs text-neutral-600 dark:text-white/35">Perlu persetujuan Anda</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {pendingEnrollments.length === 0 && (
                                            <div className="text-center py-8 rounded-xl
                                                bg-neutral-50/50 dark:bg-transparent">
                                                <CheckCircle2 className="mx-auto mb-3 size-8 text-neutral-400 dark:text-white/20" aria-hidden="true" />
                                                <p className="text-xs text-neutral-500 dark:text-white/30 font-medium">Belum ada pengajuan baru.</p>
                                            </div>
                                        )}
                                        {pendingEnrollments.map((enrollment, index) => (
                                            <EnrollmentCard key={enrollment.id} enrollment={enrollment} delay={index * 0.1} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </FadeInWhenVisible>

                        {/* Recent Discussions */}
                        <FadeInWhenVisible>
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="relative overflow-hidden rounded-2xl p-6 shadow-xl border backdrop-blur-xl
                                    bg-white/90 border-neutral-200/60
                                    dark:bg-[#111a15] dark:border-white/[0.07] dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
                            >
                                
                                <div className="relative">
                                    <div className="flex items-center gap-2.5 mb-6">
                                        <span className="inline-flex size-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.28)]">
                                            <MessageSquare className="size-5" strokeWidth={1.75} />
                                        </span>
                                        <div>
                                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white/90">Diskusi Terbaru</h2>
                                            <p className="text-xs text-neutral-600 dark:text-white/35">Aktivitas mahasiswa</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                        {recentDiscussions.length === 0 && (
                                            <div className="text-center py-8 rounded-xl
                                                bg-neutral-50/50 dark:bg-transparent">
                                                <MessageSquare className="mx-auto mb-3 size-8 text-neutral-400 dark:text-white/20" aria-hidden="true" />
                                                <p className="text-xs text-neutral-500 dark:text-white/30 font-medium">Belum ada diskusi.</p>
                                            </div>
                                        )}
                                        {recentDiscussions.map((discussion, index) => (
                                            <DiscussionCard key={discussion.id} discussion={discussion} delay={index * 0.1} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </FadeInWhenVisible>
                    </div>
                </div>
            </AnimatedPage>
        </InstructorLayout>
    );
}

function CourseCard({ course, delay }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-[12px] border shadow-sm transition-all overflow-hidden
                border-neutral-200 bg-white hover:border-emerald-200 hover:shadow-md
                dark:border-white/[0.07] dark:bg-[#0d1610] dark:hover:border-emerald-500/25"
        >
            {/* Header banner */}
            <div className="relative h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 0l15 15-15 15-15-15L30 0zm0 30l15 15-15 15-15-15 15-15zm15-15l15 15-15 15-15-15 15-15zM0 15l15 15-15 15L0 30V15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                {/* Status badge */}
                <div className="absolute top-2.5 left-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${
                        course.is_active
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-black/20 text-white/80 border-white/20'
                    }`}>
                        {course.is_active ? 'Aktif' : 'Arsip'}
                    </span>
                </div>
                {/* Icon */}
                <div className="absolute bottom-2.5 right-3 flex size-9 items-center justify-center rounded-[10px] border border-white/25 bg-white/15 text-white backdrop-blur-sm">
                    <BookOpen className="size-4" strokeWidth={1.75} />
                </div>
            </div>

            <div className="p-4">
                <div className="mb-3">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md mb-1.5
                        bg-emerald-50 border border-emerald-200
                        dark:bg-emerald-500/15 dark:border-emerald-500/30">
                        <span className="size-1 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                        <p className="text-[9px] font-bold uppercase tracking-wider font-mono text-emerald-700 dark:text-emerald-400">
                            {course.code}
                        </p>
                    </div>
                    <h3 className="text-sm font-bold leading-snug line-clamp-2 text-neutral-900 dark:text-white/90">{course.name}</h3>
                    <p className="mt-0.5 text-xs text-neutral-600 dark:text-white/40">{course.semester ?? 'Semester belum diatur'}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="text-center p-2 rounded-lg border
                        border-neutral-200 bg-neutral-50
                        dark:border-white/[0.07] dark:bg-white/5">
                        <p className="font-bold text-neutral-900 dark:text-white/80">{course.modules_count}</p>
                        <p className="text-[10px] text-neutral-600 dark:text-white/35">Modul</p>
                    </div>
                    <div className="text-center p-2 rounded-lg border
                        border-neutral-200 bg-neutral-50
                        dark:border-white/[0.07] dark:bg-white/5">
                        <p className="font-bold text-neutral-900 dark:text-white/80">{course.active_enrollments_count}</p>
                        <p className="text-[10px] text-neutral-600 dark:text-white/35">Aktif</p>
                    </div>
                    <div className="text-center p-2 rounded-lg border
                        border-neutral-200 bg-neutral-50
                        dark:border-white/[0.07] dark:bg-white/5">
                        <p className="font-bold text-neutral-900 dark:text-white/80">{course.pending_enrollments_count}</p>
                        <p className="text-[10px] text-neutral-600 dark:text-white/35">Pending</p>
                    </div>
                </div>

                <Link
                    href={`/instructor/courses/${course.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group/link"
                >
                    <span className="relative">
                        Buka builder
                        <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-emerald-600 dark:bg-emerald-400 group-hover/link:w-full transition-all duration-300" />
                    </span>
                    <span aria-hidden="true"></span>
                </Link>
            </div>
        </motion.article>
    );
}

function EnrollmentCard({ enrollment, delay }) {
    return (
        <motion.article
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ y: -2 }}
            className="rounded-[12px] border p-3 shadow-sm transition-all
                border-neutral-200 bg-white hover:border-amber-200 hover:bg-amber-50/30
                dark:border-white/[0.07] dark:bg-[#0d1610] dark:hover:border-amber-500/25 dark:hover:bg-amber-500/5"
        >
            <div className="flex items-start gap-2">
                <div className="size-8 rounded-full flex items-center justify-center border shrink-0
                    bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-200/60
                    dark:from-emerald-600/25 dark:to-teal-600/25 dark:border-emerald-500/20">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        {enrollment.user.name.charAt(0)}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-snug text-neutral-900 dark:text-white/80">{enrollment.user.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-600 dark:text-white/40 line-clamp-1">
                        {enrollment.course.code} - {enrollment.course.name}
                    </p>
                    <div className="mt-3 flex gap-2">
                        <Button
                            variant="success"
                            size="sm"
                            className="flex-1 h-8 rounded-lg"
                            onClick={() => router.patch(`/instructor/courses/${enrollment.course.id}/enrollments/${enrollment.id}/approve`, {}, { preserveScroll: true })}
                        >
                            <CheckCircle2 className="size-3" />
                            Setujui
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg"
                            onClick={() => router.patch(`/instructor/courses/${enrollment.course.id}/enrollments/${enrollment.id}/reject`, {}, { preserveScroll: true })}
                        >
                            Tolak
                        </Button>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

function DiscussionCard({ discussion, delay }) {
    return (
        <motion.article
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ y: -2 }}
            className="rounded-[12px] border p-3 shadow-sm transition-all
                border-neutral-200 bg-white hover:border-blue-200 hover:bg-sky-50/30
                dark:border-white/[0.07] dark:bg-[#0d1610] dark:hover:border-emerald-500/25 dark:hover:bg-emerald-500/5"
        >
            <div className="flex items-start gap-2">
                <div className="size-8 rounded-full flex items-center justify-center border shrink-0
                    bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-200/60
                    dark:from-emerald-600/25 dark:to-teal-600/25 dark:border-emerald-500/20">
                    <span className="text-[10px] font-bold text-blue-700 dark:text-emerald-400">
                        {discussion.user?.name?.slice(0, 2).toUpperCase() ?? 'U'}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-900 dark:text-white/80">{discussion.user?.name ?? 'User'}</p>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-white/45 line-clamp-2">{discussion.body}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-500 dark:text-white/30">
                        <span className="text-blue-600 font-semibold">{discussion.course_code}</span>
                        <span>/</span>
                        <span className="line-clamp-1">{discussion.material_title}</span>
                        <span>/</span>
                        <span>{new Date(discussion.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <Link 
                        href={`/instructor/courses/${discussion.course_id}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-emerald-400 hover:text-blue-700 dark:hover:text-emerald-300 group/link"
                    >
                        <span className="relative">
                            Lihat diskusi
                            <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-blue-600 group-hover/link:w-full transition-all duration-300" />
                        </span>
                    <span aria-hidden="true">-&gt;</span>
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}
