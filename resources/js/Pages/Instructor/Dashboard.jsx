import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Clock, FileCheck2, GraduationCap, HelpCircle, MessageSquare, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import InstructorLayout from '@/Layouts/InstructorLayout';
import { AnimatedPage, StaggerContainer, FadeInWhenVisible } from '@/components/animated/AnimatedPage';
import { fadeUp } from '@/lib/animations';

const statsConfig = [
    { key: 'owned_courses', label: 'Kursus', icon: BookOpen, gradient: 'from-emerald-500 to-teal-600' },
    { key: 'pending_enrollments', label: 'Menunggu Approval', icon: Clock, gradient: 'from-amber-500 to-orange-600' },
    { key: 'submissions_needing_grading', label: 'Tugas Perlu Nilai', icon: FileCheck2, gradient: 'from-blue-500 to-cyan-600' },
    { key: 'quiz_attempts_needing_grading', label: 'Quiz Perlu Nilai', icon: HelpCircle, gradient: 'from-purple-500 to-pink-600' },
];

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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/80 backdrop-blur-sm border border-emerald-200/60"
                        >
                            <GraduationCap className="size-3.5 text-emerald-700" />
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                Dashboard Dosen
                            </span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]"
                        >
                            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                Selamat datang
                            </span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-2xl text-sm leading-relaxed text-neutral-600"
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
                                className="group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm p-5 shadow-lg border border-neutral-200/60 hover:shadow-2xl hover:border-emerald-200/60 transition-all"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-300`} />
                                <div className={`absolute -inset-1 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
                                
                                <div className="relative flex items-start justify-between">
                                    <div>
                                        <motion.p 
                                            className="text-3xl font-bold text-neutral-900"
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                                        >
                                            {stats[item.key]}
                                        </motion.p>
                                        <p className="mt-1.5 text-xs font-semibold text-neutral-600">{item.label}</p>
                                    </div>
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                        className={`flex size-11 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} text-white shadow-lg`}
                                    >
                                        <Icon className="size-5" />
                                    </motion.div>
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
                            className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 shadow-xl border border-neutral-200/60 h-full"
                        >
                            <div className="absolute -top-20 -right-20 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl" />
                            
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2.5">
                                            <span className="text-2xl">📚</span>
                                            Kursus Saya
                                        </h2>
                                        <p className="mt-1 text-xs text-neutral-600">Kelola dan pantau kursus Anda</p>
                                    </div>
                                    <Link 
                                        href="/instructor/courses"
                                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        Kelola kursus →
                                    </Link>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {courses.length === 0 && (
                                        <div className="col-span-2 rounded-xl border-2 border-dashed border-neutral-200 p-8 text-center bg-neutral-50/50">
                                            <span className="text-4xl mb-3 block">📖</span>
                                            <p className="text-xs text-neutral-500 font-medium">Belum ada kursus.</p>
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
                                className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 shadow-xl border border-neutral-200/60"
                            >
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
                                            <h2 className="text-xl font-bold text-neutral-900">Pengajuan Enrollment</h2>
                                            <p className="text-xs text-neutral-600">Perlu persetujuan Anda</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {pendingEnrollments.length === 0 && (
                                            <div className="text-center py-8 bg-neutral-50/50 rounded-xl">
                                                <span className="text-4xl mb-3 block">✅</span>
                                                <p className="text-xs text-neutral-500 font-medium">Belum ada pengajuan baru.</p>
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
                                className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 shadow-xl border border-neutral-200/60"
                            >
                                <div className="absolute -top-20 -right-20 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
                                
                                <div className="relative">
                                    <div className="flex items-center gap-2.5 mb-6">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
                                            <MessageSquare className="size-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-neutral-900">Diskusi Terbaru</h2>
                                            <p className="text-xs text-neutral-600">Aktivitas mahasiswa</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                        {recentDiscussions.length === 0 && (
                                            <div className="text-center py-8 bg-neutral-50/50 rounded-xl">
                                                <span className="text-4xl mb-3 block">💬</span>
                                                <p className="text-xs text-neutral-500 font-medium">Belum ada diskusi.</p>
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
            whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-xl bg-white/70 backdrop-blur-sm border border-neutral-200/60 shadow-lg hover:shadow-2xl hover:border-emerald-200/60 transition-all"
        >
            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
            
            <div className="relative p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100/60 backdrop-blur-sm border border-emerald-200/50 mb-2">
                            <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                                {course.code}
                            </p>
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-2">{course.name}</h3>
                        <p className="mt-1 text-xs text-neutral-600">{course.semester ?? 'Semester belum diatur'}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border ${
                        course.is_active 
                            ? 'bg-emerald-100/80 text-emerald-700 border-emerald-300/70' 
                            : 'bg-neutral-100/80 text-neutral-600 border-neutral-300/70'
                    }`}>
                        {course.is_active ? 'Aktif' : 'Arsip'}
                    </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 rounded-lg bg-white/40 backdrop-blur-sm border border-white/60">
                        <p className="font-bold text-neutral-900">{course.modules_count}</p>
                        <p className="text-[10px] text-neutral-600">Modul</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/40 backdrop-blur-sm border border-white/60">
                        <p className="font-bold text-neutral-900">{course.active_enrollments_count}</p>
                        <p className="text-[10px] text-neutral-600">Aktif</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/40 backdrop-blur-sm border border-white/60">
                        <p className="font-bold text-neutral-900">{course.pending_enrollments_count}</p>
                        <p className="text-[10px] text-neutral-600">Pending</p>
                    </div>
                </div>

                <Link 
                    href={`/instructor/courses/${course.id}`}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 group/link"
                >
                    <span className="relative">
                        Buka builder
                        <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-emerald-600 group-hover/link:w-full transition-all duration-300" />
                    </span>
                    <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        →
                    </motion.span>
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
            whileHover={{ x: 4, y: -2 }}
            className="group relative overflow-hidden rounded-xl bg-white/70 backdrop-blur-sm border border-neutral-200/60 p-3 hover:border-amber-200 hover:shadow-xl shadow-lg transition-all"
        >
            <div className="flex items-start gap-2">
                <div className="size-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center border border-emerald-200/60 shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700">
                        {enrollment.user.name.charAt(0)}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-900 leading-snug">{enrollment.user.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-600 line-clamp-1">
                        {enrollment.course.code} - {enrollment.course.name}
                    </p>
                    <div className="mt-3 flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.patch(`/instructor/courses/${enrollment.course.id}/enrollments/${enrollment.id}/approve`, {}, { preserveScroll: true })}
                            className="flex-1 h-8 px-3 rounded-lg bg-gradient-to-r from-emerald-600/95 to-teal-600/95 backdrop-blur-sm text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-1.5"
                        >
                            <CheckCircle2 className="size-3" />
                            Setujui
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.patch(`/instructor/courses/${enrollment.course.id}/enrollments/${enrollment.id}/reject`, {}, { preserveScroll: true })}
                            className="h-8 px-3 rounded-lg bg-white/80 backdrop-blur-sm border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-50 transition-all"
                        >
                            Tolak
                        </motion.button>
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
            whileHover={{ x: 4, y: -2 }}
            className="group relative overflow-hidden rounded-xl bg-white/70 backdrop-blur-sm border border-neutral-200/60 p-3 hover:border-blue-200 hover:shadow-xl shadow-lg transition-all"
        >
            <div className="flex items-start gap-2">
                <div className="size-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center border border-blue-200/60 shrink-0">
                    <span className="text-[10px] font-bold text-blue-700">
                        {discussion.user?.name?.slice(0, 2).toUpperCase() ?? 'U'}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-900">{discussion.user?.name ?? 'User'}</p>
                    <p className="mt-1 text-xs text-neutral-600 line-clamp-2">{discussion.body}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-500">
                        <span className="text-blue-600 font-semibold">{discussion.course_code}</span>
                        <span>•</span>
                        <span className="line-clamp-1">{discussion.material_title}</span>
                        <span>•</span>
                        <span>{new Date(discussion.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <Link 
                        href={`/instructor/courses/${discussion.course_id}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 group/link"
                    >
                        <span className="relative">
                            Lihat diskusi
                            <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-blue-600 group-hover/link:w-full transition-all duration-300" />
                        </span>
                        <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            →
                        </motion.span>
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}
