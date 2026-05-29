import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AlertTriangle, Award, Ban, BookOpen, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Circle, ClipboardList, Clock, Diamond, Download, FileText, HelpCircle, Layers3, List, MessageSquare, PlayCircle, Send, Square, Trash2, Triangle, Upload, Users, X, XCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

import StudentLayout from '@/Layouts/StudentLayout';
import { Button } from '@/components/ui/button';
import { FadeInWhenVisible } from '@/components/animated/AnimatedPage';
import VideoPlayer from '@/components/shared/VideoPlayer';

export default function Show({ course, completedContentIds, attemptsByQuizId, submissionsByAssignmentId, progress }) {
    const completed = new Set(completedContentIds);
    const [currentView, setCurrentView] = useState('overview'); // 'overview' or material/quiz/assignment/discussion id
    const [showSidebar, setShowSidebar] = useState(false);
    const [expandedModules, setExpandedModules] = useState({});
    const [direction, setDirection] = useState(0);

    // Toggle module expansion
    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // Navigate to specific view
    const navigateTo = (view) => {
        setDirection(view === 'overview' ? -1 : 1);
        setCurrentView(view);
        setShowSidebar(false);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (showSidebar) {
                    setShowSidebar(false);
                } else if (currentView !== 'overview') {
                    navigateTo('overview');
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentView, showSidebar]);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <StudentLayout title="Belajar">
            <Head title={`${course.name} - Belajar`} />

            {/* Background � handled by AtmosphericBackground in layout */}

            {/* Course Header - Same as Instructor */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden"
            >
           

                <div className="relative">
                    {/* Back link */}
                    <Link
                        href="/student/courses"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors mb-4"
                    >
                        <ChevronLeft className="size-4" />
                        Kembali ke Kursus Saya
                    </Link>

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                            {/* Course code and semester */}
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                    <span className="size-1.5 rounded-full bg-white" />
                                    <span className="text-xs font-bold uppercase tracking-wider font-mono">
                                        {course.code}
                                    </span>
                                </span>
                                {course.semester && (
                                    <span className="text-sm font-medium text-white/80">
                                        {course.semester}
                                    </span>
                                )}
                                {course.instructor?.name && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-xs font-semibold text-white/90">
                                        <Users className="size-3.5" />
                                        {course.instructor.name}
                                    </span>
                                )}
                            </div>

                            {/* Course name */}
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                                {course.name}
                            </h1>

                            {/* Course info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                                <span className="flex items-center gap-1.5">
                                    <Layers3 className="size-4" />
                                    {course.modules?.length ?? 0} Modul
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <BookOpen className="size-4" />
                                    Belajar Mandiri
                                </span>
                            </div>

                            {/* Certificate Button */}
                            {course.certificate_criteria && (
                                <div className="pt-2">
                                    {course.has_certificate ? (
                                        <Link
                                            href={`/student/certificates/${course.certificate_id}`}
                                            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                                        >
                                            <Award className="size-3.5" />
                                            Lihat Sertifikat
                                        </Link>
                                    ) : course.certificate_eligibility?.eligible ? (
                                        <button
                                            type="button"
                                            onClick={() => router.post(`/student/courses/${course.id}/certificates/request`)}
                                            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                                        >
                                            <Award className="size-3.5" />
                                            Minta Sertifikat
                                        </button>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 md:max-w-sm">
                            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm sm:rounded-2xl sm:px-5">
                                <div className="shrink-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">Progress</p>
                                    <p className="text-2xl font-bold leading-none text-white sm:text-[28px]">{progress}%</p>
                                </div>
                                <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/25">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-2 rounded-full bg-white"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowSidebar(true)}
                                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                            >
                                <List className="size-4" />
                                Daftar Materi
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Area with spacing */}
            <div className="relative min-h-[600px] mt-6">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentView}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full"
                    >
                        {currentView === 'overview' ? (
                            <OverviewPage 
                                course={course} 
                                expandedModules={expandedModules}
                                toggleModule={toggleModule}
                                navigateTo={navigateTo}
                                completed={completed}
                                attemptsByQuizId={attemptsByQuizId}
                                submissionsByAssignmentId={submissionsByAssignmentId}
                            />
                        ) : (
                            <MaterialPage 
                                currentView={currentView}
                                course={course}
                                completed={completed}
                                attemptsByQuizId={attemptsByQuizId}
                                submissionsByAssignmentId={submissionsByAssignmentId}
                                navigateTo={navigateTo}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Hierarchical Sidebar */}
            <AnimatePresence>
                {showSidebar && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSidebar(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md shadow-2xl z-50 overflow-y-auto bg-surface"
                        >
                            <div className="sticky top-0 border-b p-4 flex items-center justify-between bg-surface border-line">
                                <h2 className="text-lg font-bold text-content-primary">Daftar Materi</h2>
                                <button
                                    onClick={() => setShowSidebar(false)}
                                    className="p-1.5 rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-white/8 text-content-secondary"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <div className="p-4 space-y-2">
                                {/* Overview Button */}
                                <button
                                    onClick={() => navigateTo('overview')}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                        currentView === 'overview'
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15'
                                            : 'border-line hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10'
                                    }`}
                                >
                                    <div>
                                        <p className="text-xs font-bold text-content-primary">Overview</p>
                                        <p className="text-[10px] text-content-secondary">Lihat semua modul</p>
                                    </div>
                                </button>

                                {/* Hierarchical Module List */}
                                {course.modules.map((module) => (
                                    <div key={module.id} className="space-y-1.5">
                                        {/* Module Header */}
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full text-left p-2.5 rounded-lg transition-colors bg-neutral-100 hover:bg-surface-muted dark:hover:bg-white/12"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-content-primary">{module.title}</span>
                                                {expandedModules[module.id] ? (
                                                    <ChevronUp className="size-3.5 text-content-secondary" />
                                                ) : (
                                                    <ChevronDown className="size-3.5 text-content-secondary" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Materials under Module */}
                                        {expandedModules[module.id] && (
                                            <div className="ml-3 space-y-1.5 border-l-2 border-emerald-200 dark:border-emerald-500/30 pl-2">
                                                {/* Module-level Quizzes */}
                                                {module.quizzes?.map((quiz) => (
                                                    <button
                                                        key={`quiz-${quiz.id}`}
                                                        onClick={() => navigateTo(`quiz-${quiz.id}`)}
                                                        className={`w-full text-left p-2 rounded-lg border transition-all ${
                                                            currentView === `quiz-${quiz.id}`
                                                                ? 'border-blue-500 bg-blue-50 dark:bg-emerald-500/15'
                                                                : 'border-line hover:border-blue-200 hover:bg-blue-50/50 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10'
                                                        }`}
                                                    >
                                                        <span className="block truncate text-xs font-medium text-neutral-900 dark:text-white/70">{quiz.title}</span>
                                                    </button>
                                                ))}

                                                {/* Module-level Assignments */}
                                                {module.assignments?.map((assignment) => (
                                                    <button
                                                        key={`assignment-${assignment.id}`}
                                                        onClick={() => navigateTo(`assignment-${assignment.id}`)}
                                                        className={`w-full text-left p-2 rounded-lg border transition-all ${
                                                            currentView === `assignment-${assignment.id}`
                                                                ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/15'
                                                                : 'border-line hover:border-amber-200 hover:bg-amber-50/50 dark:hover:border-amber-500/30 dark:hover:bg-amber-500/10'
                                                        }`}
                                                    >
                                                        <span className="block truncate text-xs font-medium text-neutral-900 dark:text-white/70">{assignment.title}</span>
                                                    </button>
                                                ))}

                                                {/* Materials */}
                                                {module.materials?.map((material) => (
                                                    <button
                                                        key={`material-${material.id}`}
                                                        onClick={() => navigateTo(`material-${material.id}`)}
                                                        className={`w-full text-left p-2 rounded-lg border transition-all ${
                                                            currentView === `material-${material.id}`
                                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15'
                                                                : 'border-line hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10'
                                                        }`}
                                                    >
                                                        <span className="block truncate text-xs font-medium text-neutral-900 dark:text-white/70">{material.title}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </StudentLayout>
    );
}

// Overview Page Component
function OverviewPage({ course, expandedModules, toggleModule, navigateTo, completed, attemptsByQuizId, submissionsByAssignmentId }) {
    return (
        <div className="space-y-5">
            {/* Enhanced header section */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">Daftar Pembelajaran</p>
                    <h2 className="text-2xl font-bold text-content-primary sm:text-3xl">Pilih Aktivitas Belajar</h2>
                </div>
            </div>

            {course.modules.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-line-strong bg-surface p-12 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-surface-muted">
                        <FileText className="size-8 text-content-muted" />
                    </div>
                    <p className="text-base font-semibold text-content-secondary">Belum ada materi yang dipublish.</p>
                    <p className="mt-1 text-sm text-content-secondary">Instruktur sedang menyiapkan konten pembelajaran.</p>
                </div>
            )}

            {course.modules.map((module) => {
                const isExpanded = expandedModules[module.id];

                return (
                    <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-lg transition-shadow hover:shadow-xl md:rounded-[18px]"
                    >
                        {/* Enhanced Module Header */}
                        <button
                            onClick={() => toggleModule(module.id)}
                            type="button"
                            className="w-full border-b-2 border-line bg-gradient-to-br from-white to-neutral-50/50 dark:from-[#111a15] dark:to-[#0d1610] p-4 text-left transition-colors hover:from-emerald-50/30 hover:to-teal-50/30 dark:hover:from-blue-500/5 dark:hover:to-cyan-500/5 sm:p-5 md:p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-bold leading-snug text-content-primary sm:text-xl">{module.title}</h3>
                                    {module.description && (
                                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-content-secondary">{module.description}</p>
                                    )}
                                </div>
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-line bg-white dark:bg-white/5 text-content-secondary shadow-sm"
                                >
                                    <ChevronDown className="size-5" />
                                </motion.div>
                            </div>
                        </button>

                        {/* Module Content (Expanded) */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-gradient-to-br from-neutral-50/50 to-white dark:from-[#0d1610] dark:to-[#111a15]"
                                >
                                    <div className="space-y-3 p-4 sm:p-5 md:p-6">
                                        {/* Module-level Quizzes */}
                                        {module.quizzes?.length > 0 && (
                                            <div className="space-y-2">
                                                {module.quizzes.map((quiz) => {
                                                    const attempt = attemptsByQuizId?.[quiz.id];
                                                    return (
                                                        <LearningItemButton
                                                            key={quiz.id}
                                                            onClick={() => navigateTo(`quiz-${quiz.id}`)}
                                                            tone="blue"
                                                            title={quiz.title}
                                                            eyebrow="Quiz"
                                                            meta={`${quiz.questions.length} soal - Passing ${quiz.passing_score}`}
                                                            status={attempt ? 'Selesai' : null}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Module-level Assignments */}
                                        {module.assignments?.length > 0 && (
                                            <div className="space-y-2">
                                                {module.assignments.map((assignment) => {
                                                    const submission = submissionsByAssignmentId?.[assignment.id];
                                                    return (
                                                        <LearningItemButton
                                                            key={assignment.id}
                                                            onClick={() => navigateTo(`assignment-${assignment.id}`)}
                                                            tone="amber"
                                                            title={assignment.title}
                                                            eyebrow="Tugas"
                                                            meta={`Deadline: ${assignment.deadline ? new Date(assignment.deadline).toLocaleDateString('id-ID') : 'Tidak ada'}`}
                                                            status={submission ? (submission.status === 'graded' ? 'Dinilai' : 'Dikumpulkan') : null}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Materials */}
                                        {module.materials?.length > 0 && (
                                            <div className="space-y-2">
                                                {module.materials.map((material) => {
                                                    const contentCount = material.contents?.length || 0;
                                                    const quizCount = material.quizzes?.length || 0;
                                                    const assignmentCount = material.assignments?.length || 0;
                                                    const completedCount = material.contents?.filter(c => completed.has(c.id)).length || 0;

                                                    return (
                                                        <LearningItemButton
                                                            key={material.id}
                                                            onClick={() => navigateTo(`material-${material.id}`)}
                                                            tone="emerald"
                                                            title={material.title}
                                                            eyebrow="Materi"
                                                            meta={`${completedCount}/${contentCount} konten${quizCount > 0 ? ` - ${quizCount} quiz` : ''}${assignmentCount > 0 ? ` - ${assignmentCount} tugas` : ''}`}
                                                            status={completedCount === contentCount && contentCount > 0 ? 'Selesai' : null}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}

// CriterionRow sub-component � single criterion display row
function CriterionRow({ label, currentValue, threshold, met }) {
    return (
        <div className="flex items-center gap-3 rounded-[10px] border border-line-subtle bg-surface-muted px-4 py-3">
            {/* Mint accent bar */}
            <span className="h-8 w-[3px] shrink-0 rounded-full bg-[#5DCAA5]" aria-hidden="true" />

            {/* Label + current value */}
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-400">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-content-primary">{currentValue}</p>
            </div>

            {/* Required threshold */}
            <div className="shrink-0 text-right">
                <p className="text-[10px] font-medium text-content-muted">Syarat</p>
                <p className="text-sm font-semibold text-content-secondary">{threshold}</p>
            </div>

            {/* Status icon */}
            <div className="shrink-0">
                {met ? (
                    <CheckCircle2 className="size-5 text-emerald-500" aria-label="Memenuhi syarat" />
                ) : (
                    <XCircle className="size-5 text-red-400" aria-label="Belum memenuhi syarat" />
                )}
            </div>
        </div>
    );
}

// Certificate Eligibility Section Component
function CertificateEligibilitySection({ certificate_criteria, certificate_eligibility, has_certificate, certificate_id, course }) {
    const eligible = certificate_eligibility?.eligible === true;
    const { flash } = usePage().props;
    const { post, processing } = useForm();

    // Flash message state with 4-second auto-dismiss
    const [flashMessage, setFlashMessage] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setFlashMessage({ type: 'success', text: flash.success });
        } else if (flash?.error) {
            setFlashMessage({ type: 'error', text: flash.error });
        } else if (flash?.warning) {
            setFlashMessage({ type: 'warning', text: flash.warning });
        }
    }, [flash]);

    useEffect(() => {
        if (!flashMessage) return;
        const timer = setTimeout(() => setFlashMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [flashMessage]);

    const handleRequestCertificate = (e) => {
        e.preventDefault();
        post(`/student/courses/${course.id}/certificates/request`);
    };

    return (
        <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
            {/* Section Header */}
            <div className="flex items-center justify-between gap-3 border-b border-line p-4 md:p-5">
                <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                        <Award className="size-5" aria-label="Sertifikat" />
                    </span>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400">Pencapaian</p>
                        <h3 className="text-[15px] font-semibold text-content-primary">Sertifikat Kursus</h3>
                    </div>
                </div>

                {/* Eligibility Badge */}
                {certificate_eligibility && (
                    eligible ? (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-3 py-1.5 text-[12px] font-semibold text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="size-3.5" aria-hidden="true" />
                            Memenuhi Syarat
                        </span>
                    ) : (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-500/20 px-3 py-1.5 text-[12px] font-semibold text-amber-700 dark:text-amber-300">
                            <AlertTriangle className="size-3.5" aria-hidden="true" />
                            Belum Memenuhi Syarat
                        </span>
                    )
                )}
            </div>

            {/* Criteria Progress List */}
            <div className="space-y-2 p-4 md:p-5">
                {'min_progress' in certificate_criteria && (
                    <CriterionRow
                        label="Progress Materi"
                        currentValue={
                            certificate_eligibility?.current_progress != null
                                ? `${certificate_eligibility.current_progress}%`
                                : 'Belum ada data'
                        }
                        threshold={`= ${certificate_criteria.min_progress}%`}
                        met={
                            certificate_eligibility?.current_progress != null &&
                            certificate_eligibility.current_progress >= certificate_criteria.min_progress
                        }
                    />
                )}

                {'min_quiz_score' in certificate_criteria && (
                    <CriterionRow
                        label="Nilai Kuis"
                        currentValue={
                            certificate_eligibility?.current_quiz_score != null
                                ? certificate_eligibility.current_quiz_score
                                : 'Belum ada percobaan'
                        }
                        threshold={`= ${certificate_criteria.min_quiz_score}`}
                        met={
                            certificate_eligibility?.current_quiz_score != null &&
                            certificate_eligibility.current_quiz_score >= certificate_criteria.min_quiz_score
                        }
                    />
                )}

                {'min_assignment_score' in certificate_criteria && (
                    <CriterionRow
                        label="Nilai Tugas"
                        currentValue={
                            certificate_eligibility?.current_assignment_score != null
                                ? certificate_eligibility.current_assignment_score
                                : 'Belum ada pengumpulan'
                        }
                        threshold={`= ${certificate_criteria.min_assignment_score}`}
                        met={
                            certificate_eligibility?.current_assignment_score != null &&
                            certificate_eligibility.current_assignment_score >= certificate_criteria.min_assignment_score
                        }
                    />
                )}
            </div>

            {/* Flash Messages */}
            <AnimatePresence>
                {flashMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className={`mx-4 mb-2 flex items-start gap-2.5 rounded-[10px] border px-4 py-3 text-sm font-medium md:mx-5 ${
                            flashMessage.type === 'success'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                : flashMessage.type === 'error'
                                ? 'border-red-200 bg-red-50 text-red-800'
                                : 'border-amber-200 bg-amber-50 text-amber-800'
                        }`}
                        role="alert"
                    >
                        {flashMessage.type === 'success' && <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />}
                        {flashMessage.type === 'error' && <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" aria-hidden="true" />}
                        {flashMessage.type === 'warning' && <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden="true" />}
                        <span>{flashMessage.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Button */}
            {has_certificate ? (
                /* View Certificate � already has one */
                <div className="border-t border-line-subtle px-4 pb-4 pt-3 md:px-5 md:pb-5">
                    <Link
                        href={`/student/certificates/${certificate_id}`}
                        className="inline-flex items-center gap-2 rounded-[10px] border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/15 px-5 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    >
                        <Award className="size-4" aria-hidden="true" />
                        Lihat Sertifikat
                    </Link>
                </div>
            ) : eligible ? (
                /* Request Certificate � eligible but no certificate yet */
                <div className="border-t border-neutral-100 px-4 pb-4 pt-3 md:px-5 md:pb-5">
                    <form onSubmit={handleRequestCertificate}>
                        <Button
                            type="submit"
                            variant="success"
                            size="sm"
                            disabled={processing}
                            loading={processing}
                            className="rounded-[10px] shadow-[0_4px_14px_rgba(11,61,46,0.30)]"
                        >
                            <Award className="size-4" aria-hidden="true" />
                            {processing ? 'Memproses...' : 'Minta Sertifikat'}
                        </Button>
                    </form>
                </div>
            ) : null /* Not eligible � criteria rows explain what's missing */}
        </div>
    );
}

function LearningItemButton({ tone, title, eyebrow, meta, status, onClick }) {
    const tones = {
        blue: {
            accent: 'bg-blue-500',
            hover: 'hover:border-blue-300 hover:bg-blue-50 hover:shadow-md',
            eyebrow: 'text-blue-700',
            icon: 'bg-blue-100 text-blue-600',
        },
        amber: {
            accent: 'bg-amber-500',
            hover: 'hover:border-amber-300 hover:bg-amber-50 hover:shadow-md',
            eyebrow: 'text-amber-700',
            icon: 'bg-amber-100 text-amber-600',
        },
        emerald: {
            accent: 'bg-emerald-500',
            hover: 'hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md',
            eyebrow: 'text-emerald-700',
            icon: 'bg-emerald-100 text-emerald-600',
        },
    };

    const selectedTone = tones[tone] ?? tones.emerald;

    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            className={`group relative w-full overflow-hidden rounded-xl border-2 border-line bg-surface p-4 text-left shadow-sm transition-all ${selectedTone.hover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2`}
        >
            {/* Accent bar */}
            <span className={`absolute inset-y-0 left-0 w-1 ${selectedTone.accent}`} />

            <div className="flex items-start gap-4 pl-3">
                {/* Icon badge � rounded-square app icon style */}
                <span className={`inline-flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br text-white shadow-[0_4px_12px_rgba(5,150,105,0.28)] ${
                    eyebrow === 'Quiz'
                        ? 'from-blue-400 via-blue-500 to-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.28)]'
                        : eyebrow === 'Tugas'
                        ? 'from-amber-400 via-amber-500 to-orange-500 shadow-[0_4px_12px_rgba(245,158,11,0.28)]'
                        : 'from-emerald-400 via-emerald-500 to-teal-600'
                }`}>
                    {eyebrow === 'Quiz' && <HelpCircle className="size-5" strokeWidth={1.75} />}
                    {eyebrow === 'Tugas' && <ClipboardList className="size-5" strokeWidth={1.75} />}
                    {eyebrow === 'Materi' && <BookOpen className="size-5" strokeWidth={1.75} />}
                </span>

                <div className="min-w-0 flex-1">
                    <p className="mt-1 text-base font-semibold leading-snug text-content-primary">{title}</p>
                    {meta && <p className="mt-1.5 text-sm text-content-secondary">{meta}</p>}
                </div>

                {status && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="size-3.5" />
                        {status}
                    </span>
                )}
            </div>
        </motion.button>
    );
}

// Material Page Component (handles material, quiz, assignment views)
function MaterialPage({ currentView, course, completed, attemptsByQuizId, submissionsByAssignmentId, navigateTo }) {
    // Find the current item
    let currentItem = null;
    let currentModule = null;
    let currentMaterial = null;

    // Parse currentView to find the item
    if (currentView.startsWith('material-')) {
        const materialId = parseInt(currentView.replace('material-', ''));
        for (const module of course.modules) {
            const material = module.materials?.find(m => m.id === materialId);
            if (material) {
                currentItem = { type: 'material', data: material };
                currentModule = module;
                currentMaterial = material;
                break;
            }
        }
    } else if (currentView.startsWith('quiz-')) {
        const quizId = parseInt(currentView.replace('quiz-', ''));
        for (const module of course.modules) {
            let quiz = module.quizzes?.find(q => q.id === quizId);
            if (quiz) {
                currentItem = { type: 'quiz', data: quiz, attempt: attemptsByQuizId?.[quizId] };
                currentModule = module;
                break;
            }
            for (const material of module.materials || []) {
                quiz = material.quizzes?.find(q => q.id === quizId);
                if (quiz) {
                    currentItem = { type: 'quiz', data: quiz, attempt: attemptsByQuizId?.[quizId] };
                    currentModule = module;
                    currentMaterial = material;
                    break;
                }
            }
            if (currentItem) break;
        }
    } else if (currentView.startsWith('assignment-')) {
        const assignmentId = parseInt(currentView.replace('assignment-', ''));
        for (const module of course.modules) {
            let assignment = module.assignments?.find(a => a.id === assignmentId);
            if (assignment) {
                currentItem = { type: 'assignment', data: assignment, submission: submissionsByAssignmentId?.[assignmentId] };
                currentModule = module;
                break;
            }
            for (const material of module.materials || []) {
                assignment = material.assignments?.find(a => a.id === assignmentId);
                if (assignment) {
                    currentItem = { type: 'assignment', data: assignment, submission: submissionsByAssignmentId?.[assignmentId] };
                    currentModule = module;
                    currentMaterial = material;
                    break;
                }
            }
            if (currentItem) break;
        }
    } else if (currentView.startsWith('content-')) {
        const contentId = parseInt(currentView.replace('content-', ''));
        for (const module of course.modules) {
            for (const material of module.materials || []) {
                const content = material.contents?.find(c => c.id === contentId);
                if (content) {
                    currentItem = { type: 'content', data: content, completed: completed.has(contentId) };
                    currentModule = module;
                    currentMaterial = material;
                    break;
                }
            }
            if (currentItem) break;
        }
    } else if (currentView.startsWith('discussion-')) {
        const materialId = parseInt(currentView.replace('discussion-', ''));
        for (const module of course.modules) {
            const material = module.materials?.find(m => m.id === materialId);
            if (material) {
                currentItem = { type: 'discussion', materialId, discussions: material.discussions || [] };
                currentModule = module;
                currentMaterial = material;
                break;
            }
        }
    }

    if (!currentItem) {
        return (
            <div className="rounded-3xl bg-white/90 dark:bg-[#111a15] backdrop-blur-xl p-8 shadow-2xl border border-neutral-200/60 dark:border-white/[0.07] text-center">
                <p className="text-content-secondary">Item tidak ditemukan</p>
                <button
                    onClick={() => navigateTo('overview')}
                    className="mt-4 px-6 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
                >
                    Kembali ke Overview
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Back Button */}
            <button
                onClick={() => navigateTo('overview')}
                className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold text-sm transition-colors"
            >
                <ChevronLeft className="size-4" />
                Kembali ke Overview
            </button>

            {/* Breadcrumb */}
            <div className="text-xs text-content-secondary">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currentModule.title}</span>
                {currentMaterial && (
                    <>
                        <span className="mx-1.5">/</span>
                        <span>{currentMaterial.title}</span>
                    </>
                )}
            </div>

            {/* Content Renderer */}
            <div className="min-h-[400px]">
                {currentItem.type === 'material' && (
                    <MaterialView 
                        material={currentItem.data} 
                        completed={completed} 
                        navigateTo={navigateTo}
                        attemptsByQuizId={attemptsByQuizId}
                        submissionsByAssignmentId={submissionsByAssignmentId}
                    />
                )}
                {currentItem.type === 'content' && (
                    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lg md:rounded-[24px]">
                        <div className="p-4 md:p-6">
                            <ContentView content={currentItem.data} completed={currentItem.completed} />
                        </div>
                    </div>
                )}
                {currentItem.type === 'quiz' && (
                    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lg md:rounded-[24px]">
                        <QuizView quiz={currentItem.data} attempt={currentItem.attempt} />
                    </div>
                )}
                {currentItem.type === 'assignment' && (
                    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lg md:rounded-[24px]">
                        <div className="p-4 md:p-6">
                            <AssignmentView assignment={currentItem.data} submission={currentItem.submission} />
                        </div>
                    </div>
                )}
                {currentItem.type === 'discussion' && (
                    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lg md:rounded-[24px]">
                        <div className="p-4 md:p-6">
                            <DiscussionView materialId={currentItem.materialId} discussions={currentItem.discussions} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Material View Component (shows all contents, quizzes, assignments, discussion with tabs)
function MaterialView({ material, completed, navigateTo, attemptsByQuizId, submissionsByAssignmentId }) {
    const [activeTab, setActiveTab] = useState(0);
    
    // Build tabs array
    const tabs = [];
    
    // Add content tabs
    material.contents?.forEach((content, index) => {
        tabs.push({
            id: `content-${content.id}`,
            type: 'content',
            title: content.title,
            icon: content.type === 'video' ? PlayCircle : FileText,
            data: content,
            badge: completed.has(content.id) ? 'Selesai' : null,
        });
    });
    
    // Add quiz tabs
    material.quizzes?.forEach((quiz) => {
        const attempt = attemptsByQuizId?.[quiz.id];
        tabs.push({
            id: `quiz-${quiz.id}`,
            type: 'quiz',
            title: quiz.title,
            icon: HelpCircle,
            data: quiz,
            attempt: attempt,
            badge: attempt ? 'Selesai' : null,
        });
    });
    
    // Add assignment tabs
    material.assignments?.forEach((assignment) => {
        const submission = submissionsByAssignmentId?.[assignment.id];
        tabs.push({
            id: `assignment-${assignment.id}`,
            type: 'assignment',
            title: assignment.title,
            icon: ClipboardList,
            data: assignment,
            submission: submission,
            badge: submission ? (submission.status === 'graded' ? 'Dinilai' : 'Dikumpulkan') : null,
        });
    });
    
    // Add discussion tab
    tabs.push({
        id: `discussion-${material.id}`,
        type: 'discussion',
        title: 'Diskusi Materi',
        icon: MessageSquare,
        data: { materialId: material.id, discussions: material.discussions || [] },
        badge: material.discussions?.length > 0 ? `${material.discussions.length}` : null,
    });

    const currentTab = tabs[activeTab];

    return (
        <div className="space-y-4 md:space-y-5">
            {/* Card Ruang Belajar - Separate card wrapper */}
            <div className="overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-lg sm:p-5 md:rounded-[20px] md:p-6">
                {/* Material header */}
                <div className="mb-4 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">Ruang Belajar</p>
                    <h2 className="text-xl font-bold leading-tight text-content-primary sm:text-2xl md:text-3xl">{material.title}</h2>
                    <p className="text-sm text-content-secondary">
                        {tabs.length} aktivitas tersedia
                    </p>
                </div>

                {/* Tab navigation */}
                <nav className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-2">
                        {tabs.map((tab, index) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === index;

                            return (
                                <motion.button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(index)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title={tab.title}
                                    aria-label={tab.title}
                                    className={`relative flex size-11 shrink-0 items-center justify-center rounded-[13px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:size-12 ${
                                        isActive
                                            ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-[0_4px_14px_rgba(5,150,105,0.38)]'
                                            : 'bg-neutral-100 text-neutral-500 hover:bg-emerald-50 hover:text-emerald-600'
                                    }`}
                                >
                                    <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                                </motion.button>
                            );
                        })}
                    </div>
                </nav>
            </div>

            {/* Content area - Separate from Ruang Belajar card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentTab.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="min-h-[300px] md:min-h-[400px]"
                >
                    {currentTab.type === 'content' && (
                        <ContentView content={currentTab.data} completed={completed.has(currentTab.data.id)} />
                    )}
                    {currentTab.type === 'quiz' && (
                        <QuizView quiz={currentTab.data} attempt={currentTab.attempt} />
                    )}
                    {currentTab.type === 'assignment' && (
                        <AssignmentView assignment={currentTab.data} submission={currentTab.submission} />
                    )}
                    {currentTab.type === 'discussion' && (
                        <DiscussionView
                            materialId={currentTab.data.materialId}
                            discussions={currentTab.data.discussions}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// Reuse ContentView, QuizView, AssignmentView from Show.jsx
// (Copy the exact same implementations)

function ContentView({ content, completed }) {
    return (
        <div className="space-y-5">
            {/* Card Konten - Separate card wrapper */}
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lg md:rounded-[24px]">
                {/* Header */}
                <div className="border-b border-line bg-gradient-to-br from-emerald-50 via-teal-50/30 to-white dark:from-emerald-500/8 dark:via-teal-500/5 dark:to-[#111a15] p-5 sm:p-6 md:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                            {/* Title only - clean and simple */}
                            <h2 className="max-w-3xl text-2xl font-bold leading-tight text-content-primary sm:text-3xl md:text-4xl">
                                {content.title}
                            </h2>
                        </div>

                        {/* Action button */}
                        <motion.button
                            type="button"
                            disabled={completed}
                            onClick={() => router.patch(`/student/contents/${content.id}/complete`, {}, { preserveScroll: true })}
                            whileHover={completed ? {} : { scale: 1.02 }}
                            whileTap={completed ? {} : { scale: 0.98 }}
                            className={`flex h-12 shrink-0 items-center gap-2 rounded-xl px-6 text-sm font-bold transition-all sm:w-auto ${
                                completed
                                    ? 'cursor-not-allowed border-2 border-emerald-200 bg-emerald-50 text-emerald-600'
                                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30'
                            }`}
                        >
                            <CheckCircle2 className="size-4" />
                            {completed ? 'Sudah Selesai' : 'Tandai Selesai'}
                        </motion.button>
                    </div>
                </div>

                {/* Content body */}
                <div className="p-5 sm:p-6 md:p-8">
                    <div className="mx-auto w-full max-w-5xl">
                        {content.type === 'artikel' && (
                            <div
                                className="prose prose-neutral prose-base max-w-none overflow-x-auto leading-relaxed dark:prose-invert prose-headings:font-bold prose-headings:text-neutral-900 dark:prose-headings:text-white/90 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-neutral-700 dark:prose-p:text-white/60 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-700 hover:prose-a:underline prose-strong:text-neutral-900 dark:prose-strong:text-white/90 prose-code:rounded prose-code:bg-neutral-100 dark:prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-emerald-700 dark:prose-code:text-emerald-400 prose-pre:rounded-xl prose-pre:bg-neutral-900 dark:prose-pre:bg-black/60 prose-img:rounded-xl prose-img:shadow-lg md:prose-lg [&_img]:h-auto [&_img]:max-w-full [&_table]:min-w-full"
                                dangerouslySetInnerHTML={{ __html: content.body }}
                            />
                        )}
                        {content.type === 'video' && (
                            <div className="space-y-4">
                                <VideoPlayer
                                    videoId={content.video_id}
                                    url={content.url}
                                    title={content.title}
                                    className="!rounded-xl !shadow-2xl md:!rounded-2xl"
                                />
                            </div>
                        )}
                        {content.type === 'audio' && (
                            <div className="flex items-center justify-center rounded-2xl border-2 border-line bg-gradient-to-br from-neutral-50 to-white dark:from-white/5 dark:to-[#111a15] p-8 md:p-12">
                                <div className="w-full max-w-2xl space-y-4">
                                    <div className="flex items-center justify-center">
                                        <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                                            <PlayCircle className="size-8" />
                                        </div>
                                    </div>
                                    <audio controls className="w-full" src={storageUrl(content.file_path)} />
                                </div>
                            </div>
                        )}
                        {content.type === 'pdf' && (
                            <div className="space-y-4">
                                <div className="overflow-hidden rounded-2xl border-2 border-neutral-200 bg-neutral-50 shadow-inner">
                                    <iframe
                                        title={content.title}
                                        src={storageUrl(content.file_path)}
                                        className="h-[70vh] min-h-[500px] w-full bg-white md:h-[600px]"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <DownloadLink path={content.file_path} label="Buka PDF di Tab Baru" />
                                </div>
                            </div>
                        )}
                        {content.type === 'file' && (
                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 py-16 text-center">
                                <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                                    <Download className="size-10" />
                                </div>
                                <p className="mb-6 text-lg font-semibold text-neutral-700">File siap diunduh</p>
                                <DownloadLink path={content.file_path} label="Unduh File" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Quiz View Component (with start screen and timer)
function QuizView({ quiz, attempt }) {
    const [quizStarted, setQuizStarted] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [timeExpired, setTimeExpired] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const form = useForm({ answers: {}, started_at: null });
    const latestFormData = useRef(form.data);
    const hasSubmitted = useRef(false);
    const canShowScore = attempt && quiz.result_mode === 'immediate' && attempt.status === 'graded' && attempt.score !== null;
    
    // Check if user can still attempt
    const attemptCount = attempt?.attempt_count || 0;
    const canAttempt = attemptCount < quiz.max_attempts;
    const hasAttempted = attemptCount > 0;
    const remainingAttempts = Math.max((quiz.max_attempts ?? 0) - attemptCount, 0);

    useEffect(() => {
        latestFormData.current = form.data;
    }, [form.data]);

    const postQuiz = () => {
        if (hasSubmitted.current) return;

        hasSubmitted.current = true;
        router.post(`/student/quizzes/${quiz.id}/attempts`, {
            answers: latestFormData.current.answers ?? {},
            started_at: latestFormData.current.started_at,
        }, {
            preserveScroll: true,
            onError: () => {
                hasSubmitted.current = false;
            },
        });
    };

    // Timer effect — runs whenever a quiz is actively being taken
    // (including a re-take, where a prior attempt still exists).
    useEffect(() => {
        if (!quizStarted || !startTime || timeExpired) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const durationSeconds = quiz.duration ? quiz.duration * 60 : null;
            setElapsedSeconds(durationSeconds ? Math.min(elapsed, durationSeconds) : elapsed);

            // Check if time expired
            if (durationSeconds && elapsed >= durationSeconds) {
                setTimeExpired(true);
                clearInterval(interval);
                postQuiz();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [quizStarted, startTime, timeExpired, quiz.duration]);

    const startQuiz = () => {
        const now = new Date().toISOString();
        setStartTime(Date.now());
        setQuizStarted(true);
        latestFormData.current = { ...latestFormData.current, started_at: now };
        form.setData('started_at', now);
    };

    const submitQuiz = (event) => {
        event.preventDefault();

        if (!latestFormData.current.started_at) {
            alert('Error: Waktu mulai tidak tercatat. Silakan refresh halaman.');
            return;
        }

        postQuiz();
    };

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate remaining time
    const getRemainingTime = () => {
        if (!quiz.duration) return null;
        const remaining = (quiz.duration * 60) - elapsedSeconds;
        return Math.max(0, remaining);
    };

    const remainingSeconds = getRemainingTime();
    const isWarningTime = remainingSeconds !== null && remainingSeconds <= 60; // Last minute warning
    const activeQuestion = quiz.questions[currentQuestionIndex];
    const totalQuestions = quiz.questions.length;
    const activeAnswer = activeQuestion ? form.data.answers[activeQuestion.id] : null;
    const answeredCount = quiz.questions.filter((question) => {
        const answer = form.data.answers[question.id];

        return answer !== undefined && String(answer).trim() !== '';
    }).length;
    const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const answerTones = [
        'border-blue-200 bg-blue-50 text-blue-950 hover:border-blue-400 hover:bg-blue-100',
        'border-emerald-200 bg-emerald-50 text-emerald-950 hover:border-emerald-400 hover:bg-emerald-100',
        'border-amber-200 bg-amber-50 text-amber-950 hover:border-amber-400 hover:bg-amber-100',
        'border-rose-200 bg-rose-50 text-rose-950 hover:border-rose-400 hover:bg-rose-100',
    ];

    const setAnswer = (questionId, value) => {
        const nextAnswers = {
            ...(latestFormData.current.answers ?? {}),
            [questionId]: value,
        };

        latestFormData.current = {
            ...latestFormData.current,
            answers: nextAnswers,
        };
        form.setData('answers', nextAnswers);
    };

    const goToQuestion = (index) => {
        setCurrentQuestionIndex(Math.min(Math.max(index, 0), Math.max(totalQuestions - 1, 0)));
    };

    const goToNextQuestion = () => {
        if (isLastQuestion) {
            postQuiz();
            return;
        }

        goToQuestion(currentQuestionIndex + 1);
    };

    // Quiz Start Screen (before starting)
    if (!quizStarted && canAttempt) {
        return (
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 shadow-2xl">
                {/* Header */}
                <div className="relative px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
                    <div className="flex items-start gap-4">
                        <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            className="flex size-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30"
                        >
                            <HelpCircle className="size-7 text-white" />
                        </motion.div>
                        <div className="min-w-0 flex-1">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300"
                            >
                                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Quiz
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="break-words text-xl font-bold leading-snug text-white sm:text-2xl"
                            >
                                {quiz.title}
                            </motion.h2>
                            {hasAttempted && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300"
                                >
                                    <AlertTriangle className="size-3.5" />
                                    Percobaan ke-{attemptCount + 1} dari {quiz.max_attempts}
                                </motion.p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative mx-4 mb-4 grid grid-cols-2 gap-2 sm:mx-6 sm:grid-cols-4 sm:gap-3"
                >
                    {[
                        { icon: <FileText className="size-4" />, value: `${quiz.questions.length}`, label: 'Soal', color: 'text-emerald-300' },
                        { icon: <Clock className="size-4" />, value: quiz.duration ? `${quiz.duration}` : '∞', label: 'Menit', color: 'text-teal-300' },
                        { icon: <CheckCircle2 className="size-4" />, value: `${quiz.passing_score}`, label: 'Passing', color: 'text-green-300' },
                        { icon: <HelpCircle className="size-4" />, value: `${remainingAttempts}`, label: 'Sisa Coba', color: 'text-cyan-300' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 + i * 0.05 }}
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
                        >
                            <span className={stat.color}>{stat.icon}</span>
                            <div>
                                <p className={`text-lg font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
                                <p className="text-[10px] text-white/40">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="relative mx-4 mb-5 rounded-xl border border-white/10 bg-white/5 px-5 py-4 sm:mx-6"
                >
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-emerald-300">Instruksi</p>
                    <ul className="space-y-2">
                        {[
                            'Pastikan koneksi internet Anda stabil sebelum memulai',
                            `Anda memiliki ${quiz.max_attempts} kesempatan mengerjakan quiz ini`,
                            quiz.duration ? `Waktu berjalan setelah klik "Mulai" — quiz otomatis berakhir jika waktu habis` : null,
                            'Jawaban tidak dapat diubah setelah dikonfirmasi',
                        ].filter(Boolean).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                                <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Start button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="relative px-4 pb-6 sm:px-6"
                >
                    <motion.button
                        type="button"
                        onClick={startQuiz}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="relative flex h-13 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 py-3.5 text-base font-bold text-emerald-950 shadow-xl shadow-emerald-500/30"
                    >
                        <motion.div
                            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                        />
                        <PlayCircle className="relative size-5" />
                        <span className="relative">Mulai Quiz</span>
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    // Max attempts reached
    if (!canAttempt) {
        const passed = canShowScore && Number(attempt.score) >= Number(quiz.passing_score);
        return (
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 shadow-2xl">
                <div className="relative px-6 py-6 sm:px-8 sm:py-8">
                    {/* Title */}
                    <div className="mb-5 flex items-start gap-4">
                        <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                            <Ban className="size-6 text-white/60" />
                        </div>
                        <div>
                            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-white/40">Quiz</p>
                            <h2 className="text-xl font-bold text-white">{quiz.title}</h2>
                        </div>
                    </div>

                    {/* Score card */}
                    {canShowScore && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className={`mb-4 rounded-2xl border p-5 text-center ${
                                passed
                                    ? 'border-emerald-400/30 bg-emerald-500/15'
                                    : 'border-amber-400/30 bg-amber-500/15'
                            }`}
                        >
                            <p className={`text-4xl font-bold tabular-nums ${passed ? 'text-emerald-300' : 'text-amber-300'}`}>
                                {attempt.score}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white/60">Nilai Terakhir</p>
                            <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                                passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                                {passed ? 'Lulus' : 'Belum Lulus'}
                            </div>
                        </motion.div>
                    )}

                    {/* Info */}
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                        <p className="text-sm text-white/50">
                            Semua <span className="font-bold text-white/70">{quiz.max_attempts}</span> percobaan telah digunakan
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz already attempted (show result summary, NOT fullscreen) —
    // but only when the student is NOT currently re-taking the quiz.
    if (attempt && !quizStarted) {
        const passed = canShowScore && Number(attempt.score) >= Number(quiz.passing_score);
        return (
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 shadow-2xl">
                <div className="relative px-6 py-6 sm:px-8 sm:py-8">
                    {/* Title row */}
                    <div className="mb-5 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
                                <HelpCircle className="size-6 text-white" />
                            </div>
                            <div>
                                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-white/40">Quiz</p>
                                <h2 className="text-xl font-bold text-white">{quiz.title}</h2>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                                        {quiz.questions.length} Soal
                                    </span>
                                    <span className="rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-teal-300">
                                        Passing: {quiz.passing_score}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                            attempt.status === 'graded'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                        }`}>
                            {attempt.status === 'graded' ? 'Selesai' : 'Menunggu Penilaian'}
                        </span>
                    </div>

                    {/* Score */}
                    {canShowScore && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`rounded-2xl border p-5 text-center ${
                                passed
                                    ? 'border-emerald-400/30 bg-emerald-500/15'
                                    : 'border-amber-400/30 bg-amber-500/15'
                            }`}
                        >
                            <p className={`text-5xl font-bold tabular-nums ${passed ? 'text-emerald-300' : 'text-amber-300'}`}>
                                {attempt.score}
                            </p>
                            <p className="mt-1 text-sm text-white/50">Nilai Kamu</p>
                            <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                                passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                                {passed ? 'Selamat, kamu lulus!' : 'Belum lulus, pelajari lagi'}
                            </div>
                        </motion.div>
                    )}

                    {!canShowScore && attempt.status !== 'graded' && (
                        <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-center">
                            <p className="text-sm text-amber-300">Jawaban kamu sedang dinilai oleh instruktur</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Quiz Active — FULLSCREEN Quizizz/Wayground style (rendered via portal to escape layout)
    return createPortal(
        <QuizFullscreen
            quiz={quiz}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            activeQuestion={activeQuestion}
            activeAnswer={activeAnswer}
            answeredCount={answeredCount}
            progressPercent={progressPercent}
            isLastQuestion={isLastQuestion}
            timeExpired={timeExpired}
            isWarningTime={isWarningTime}
            remainingSeconds={remainingSeconds}
            elapsedSeconds={elapsedSeconds}
            duration={quiz.duration}
            formatTime={formatTime}
            setAnswer={setAnswer}
            goToQuestion={goToQuestion}
            goToNextQuestion={goToNextQuestion}
            postQuiz={postQuiz}
            submitQuiz={submitQuiz}
            processing={form.processing}
            errors={form.errors}
            answers={form.data.answers}
        />,
        document.body
    );
}

// Fullscreen Quizizz/Wayground-style quiz player
function QuizFullscreen({
    quiz,
    currentQuestionIndex,
    totalQuestions,
    activeQuestion,
    activeAnswer,
    answeredCount,
    progressPercent,
    isLastQuestion,
    timeExpired,
    isWarningTime,
    remainingSeconds,
    elapsedSeconds,
    duration,
    formatTime,
    setAnswer,
    goToQuestion,
    goToNextQuestion,
    postQuiz,
    submitQuiz,
    processing,
    errors,
    answers,
}) {
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showNavigator, setShowNavigator] = useState(false);

    // Lock body scroll while quiz is fullscreen
    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, []);

    // Wayground-style answer color palette (matching the brand emerald/teal LMS theme)
    // LMS-themed answer palette: emerald/teal dominant, with teal, green, and cyan variants
    const answerStyles = [
        {
            bg: 'bg-emerald-600 hover:bg-emerald-700',
            selected: 'bg-emerald-700 ring-4 ring-emerald-300',
            shape: <Triangle className="size-7 text-white" fill="currentColor" />,
        },
        {
            bg: 'bg-teal-600 hover:bg-teal-700',
            selected: 'bg-teal-700 ring-4 ring-teal-300',
            shape: <Diamond className="size-7 text-white" fill="currentColor" />,
        },
        {
            bg: 'bg-green-600 hover:bg-green-700',
            selected: 'bg-green-700 ring-4 ring-green-300',
            shape: <Circle className="size-7 text-white" fill="currentColor" />,
        },
        {
            bg: 'bg-cyan-600 hover:bg-cyan-700',
            selected: 'bg-cyan-700 ring-4 ring-cyan-300',
            shape: <Square className="size-7 text-white" fill="currentColor" />,
        },
    ];

    const timerSeconds = duration ? remainingSeconds : elapsedSeconds;
    const timerProgress = duration ? remainingSeconds / (duration * 60) : 1;
    const timerCircumference = 2 * Math.PI * 26;
    const timerOffset = timerCircumference * (1 - timerProgress);

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950">
            {/* Ambient orbs */}
            <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500 blur-3xl"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-teal-500 blur-3xl"
            />

            {/* Geometric pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l20 20-20 20-20-20L40 0zm0 40l20 20-20 20-20-20 20-20zm20-20l20 20-20 20-20-20 20-20zM0 20l20 20-20 20L0 40V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative flex h-full flex-col">
                {/* ── TOP BAR ── */}
                <header className="flex flex-shrink-0 items-center gap-3 px-4 py-4 sm:gap-5 sm:px-8 sm:py-5">
                    {/* Exit */}
                    <button
                        type="button"
                        onClick={() => setShowExitConfirm(true)}
                        className="flex size-11 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white"
                        aria-label="Keluar quiz"
                    >
                        <X className="size-5" />
                    </button>

                    {/* Question counter */}
                    <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur sm:flex">
                        <span className="text-sm font-bold tabular-nums text-white">{currentQuestionIndex + 1}</span>
                        <span className="text-sm text-white/40">/</span>
                        <span className="text-sm tabular-nums text-white/60">{totalQuestions}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="relative flex-1">
                        <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                                initial={false}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-lg shadow-emerald-500/40"
                            />
                        </div>
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/40 sm:hidden">
                            Soal {currentQuestionIndex + 1}/{totalQuestions} • {answeredCount} terjawab
                        </p>
                    </div>

                    {/* Question grid toggle */}
                    <button
                        type="button"
                        onClick={() => setShowNavigator((v) => !v)}
                        className="flex size-11 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white"
                        aria-label="Daftar soal"
                    >
                        <List className="size-5" />
                    </button>

                    {/* Timer ring */}
                    {duration ? (
                        <div className="relative flex size-14 flex-shrink-0 items-center justify-center sm:size-16">
                            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 60 60">
                                <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
                                <motion.circle
                                    cx="30" cy="30" r="26"
                                    fill="none"
                                    stroke={timeExpired ? '#f43f5e' : isWarningTime ? '#f59e0b' : '#10b981'}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeDasharray={timerCircumference}
                                    animate={{ strokeDashoffset: timerOffset }}
                                    transition={{ duration: 0.5 }}
                                />
                            </svg>
                            <motion.span
                                animate={isWarningTime && !timeExpired ? { scale: [1, 1.15, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 0.6 }}
                                className={`relative text-xs font-bold tabular-nums sm:text-sm ${
                                    timeExpired ? 'text-rose-400' : isWarningTime ? 'text-amber-300' : 'text-emerald-300'
                                }`}
                            >
                                {formatTime(timerSeconds)}
                            </motion.span>
                        </div>
                    ) : (
                        <div className="flex flex-shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
                            <Clock className="size-4 text-emerald-300" />
                            <span className="text-sm font-bold tabular-nums text-white">{formatTime(elapsedSeconds)}</span>
                        </div>
                    )}
                </header>

                {/* Question grid drawer */}
                <AnimatePresence>
                    {showNavigator && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute left-1/2 top-20 z-30 max-h-[60vh] w-[min(92vw,420px)] -translate-x-1/2 overflow-y-auto rounded-2xl border border-white/15 bg-emerald-950/95 p-5 shadow-2xl backdrop-blur-xl"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Daftar Soal</p>
                                <p className="text-xs text-white/50">{answeredCount}/{totalQuestions} terjawab</p>
                            </div>
                            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                                {quiz.questions.map((q, i) => {
                                    const filled = answers[q.id] !== undefined && String(answers[q.id]).trim() !== '';
                                    const isActive = i === currentQuestionIndex;
                                    return (
                                        <button
                                            key={q.id}
                                            type="button"
                                            onClick={() => {
                                                goToQuestion(i);
                                                setShowNavigator(false);
                                            }}
                                            className={`flex aspect-square items-center justify-center rounded-xl text-sm font-bold transition ${
                                                isActive
                                                    ? 'bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/40'
                                                    : filled
                                                    ? 'bg-emerald-500/30 text-emerald-200 hover:bg-emerald-500/50'
                                                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── MAIN ── */}
                <main className="flex flex-1 flex-col overflow-y-auto px-4 pb-4 sm:px-8 sm:pb-6">
                    <AnimatePresence mode="wait">
                        {activeQuestion ? (
                            <motion.div
                                key={activeQuestion.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30, scale: 0.97 }}
                                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                                className="mx-auto flex w-full max-w-5xl flex-1 flex-col"
                            >
                                {/* Question card */}
                                <motion.div
                                    initial={{ scale: 0.96 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.05, duration: 0.35 }}
                                    className="relative mb-5 flex min-h-[140px] flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:min-h-[180px] sm:p-10"
                                >
                                    {/* Top accent */}
                                    <div className="absolute left-10 right-10 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

                                    {/* Type badge */}
                                    <div className="absolute left-5 top-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                                        <span className="size-1.5 rounded-full bg-emerald-500" />
                                        {activeQuestion.type === 'essay' ? 'Essay' : activeQuestion.type === 'true_false' ? 'Benar / Salah' : 'Pilihan Ganda'}
                                    </div>

                                    {/* Question number badge */}
                                    <div className="absolute right-5 top-4 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tabular-nums text-emerald-700">
                                        {currentQuestionIndex + 1} / {totalQuestions}
                                    </div>

                                    <h2 className="mt-4 break-words text-center text-xl font-bold leading-snug text-neutral-900 sm:text-2xl md:text-3xl">
                                        {activeQuestion.question}
                                    </h2>
                                </motion.div>

                                {/* Answers */}
                                {activeQuestion.type === 'multiple_choice' && (
                                    <div className="grid flex-1 gap-3 content-start sm:grid-cols-2 sm:gap-4">
                                        {activeQuestion.options?.map((option, i) => {
                                            const style = answerStyles[i % answerStyles.length];
                                            const selected = activeAnswer === option;
                                            return (
                                                <motion.button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => setAnswer(activeQuestion.id, option)}
                                                    disabled={processing || timeExpired}
                                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 300, damping: 22 }}
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className={`group relative overflow-hidden rounded-2xl p-5 text-left text-white shadow-xl transition-all sm:p-6 ${
                                                        selected ? style.selected : style.bg
                                                    } disabled:cursor-not-allowed disabled:opacity-60`}
                                                >
                                                    {/* Shine */}
                                                    <motion.div
                                                        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                                                        animate={{ x: ['-100%', '200%'] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                                                    />
                                                    <div className="absolute inset-x-0 top-0 h-[1px] bg-white/30" />

                                                    <div className="relative flex items-center gap-4">
                                                        <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-xl bg-black/25">
                                                            {style.shape}
                                                        </div>
                                                        <span className="flex-1 break-words text-base font-bold leading-snug sm:text-lg">
                                                            {option}
                                                        </span>
                                                        {selected && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="flex size-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-current"
                                                            >
                                                                <CheckCircle2 className="size-5" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}

                                {activeQuestion.type === 'true_false' && (
                                    <div className="grid flex-1 gap-3 content-start sm:grid-cols-2 sm:gap-4">
                                        {[
                                            ['true', 'Benar'],
                                            ['false', 'Salah'],
                                        ].map(([val, label], i) => {
                                            const style = answerStyles[i === 0 ? 3 : 0];
                                            const selected = activeAnswer === val;
                                            return (
                                                <motion.button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => setAnswer(activeQuestion.id, val)}
                                                    disabled={processing || timeExpired}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.1 + i * 0.1, type: 'spring' }}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className={`flex min-h-[120px] items-center justify-center gap-4 rounded-2xl p-6 text-2xl font-black text-white shadow-xl transition-all ${
                                                        selected ? style.selected : style.bg
                                                    } disabled:cursor-not-allowed disabled:opacity-60`}
                                                >
                                                    <div className="flex size-14 items-center justify-center rounded-xl bg-black/25">
                                                        {style.shape}
                                                    </div>
                                                    {label}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}

                                {activeQuestion.type === 'essay' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="flex-1"
                                    >
                                        <textarea
                                            value={answers[activeQuestion.id] ?? ''}
                                            onChange={(e) => setAnswer(activeQuestion.id, e.target.value)}
                                            rows="8"
                                            placeholder="Tulis jawaban Anda di sini..."
                                            disabled={processing || timeExpired}
                                            className="min-h-[200px] w-full rounded-2xl border-2 border-white/15 bg-white/95 px-5 py-4 text-base leading-relaxed text-neutral-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20"
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="m-auto rounded-2xl border border-amber-300/30 bg-amber-500/10 p-6 text-center text-amber-200">
                                Quiz ini belum memiliki soal.
                            </div>
                        )}
                    </AnimatePresence>
                </main>

                {/* ── BOTTOM BAR ── */}
                <footer className="flex flex-shrink-0 items-center gap-2 border-t border-white/10 bg-emerald-950/40 px-4 py-3 backdrop-blur sm:gap-3 sm:px-8 sm:py-4">
                    <button
                        type="button"
                        onClick={() => goToQuestion(currentQuestionIndex - 1)}
                        disabled={processing || currentQuestionIndex === 0}
                        className="flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <ChevronLeft className="size-4" />
                        <span className="hidden sm:inline">Sebelumnya</span>
                    </button>

                    {!isLastQuestion ? (
                        <>
                            <button
                                type="button"
                                onClick={() => goToQuestion(currentQuestionIndex + 1)}
                                disabled={processing || timeExpired}
                                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <span>Lanjut</span>
                                <ChevronRight className="size-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex-1" />
                            <motion.button
                                type="button"
                                onClick={postQuiz}
                                disabled={processing || totalQuestions === 0}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                className="relative flex h-12 items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-6 text-sm font-bold text-emerald-950 shadow-xl shadow-emerald-500/40 transition disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <motion.div
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                />
                                <span className="relative">
                                    {processing ? 'Mengirim...' : 'Kirim Jawaban'}
                                </span>
                                <Send className="relative size-4" />
                            </motion.button>
                        </>
                    )}
                </footer>

                {errors.answers && (
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-xl border border-rose-400/40 bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-200 backdrop-blur">
                        {errors.answers}
                    </div>
                )}
            </div>

            {/* Time expired overlay */}
            <AnimatePresence>
                {timeExpired && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-40 flex items-center justify-center bg-emerald-950/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="rounded-3xl border border-rose-400/30 bg-emerald-950 p-8 text-center shadow-2xl"
                        >
                            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-rose-500/20">
                                <Clock className="size-8 text-rose-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Waktu Habis</h3>
                            <p className="mt-2 text-sm text-white/60">Mengirim jawabanmu otomatis...</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Exit confirmation modal */}
            <AnimatePresence>
                {showExitConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setShowExitConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-3xl border border-white/15 bg-emerald-950 p-6 shadow-2xl"
                        >
                            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-amber-500/20">
                                <AlertTriangle className="size-7 text-amber-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-white">Keluar dari Quiz?</h3>
                            <p className="text-sm leading-relaxed text-white/60">
                                Jawabanmu yang sudah diisi belum dikirim. Yakin ingin keluar?
                            </p>
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowExitConfirm(false)}
                                    className="h-11 rounded-xl border border-white/15 bg-white/5 text-sm font-bold text-white transition hover:bg-white/10"
                                >
                                    Lanjutkan Quiz
                                </button>
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="h-11 rounded-xl bg-rose-500 text-sm font-bold text-white transition hover:bg-rose-600"
                                >
                                    Ya, Keluar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Assignment View Component (copied from Show.jsx)
function AssignmentView({ assignment, submission }) {
    const form = useForm({ file: null, link_url: '' });
    const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
    const isGraded = submission?.status === 'graded';
    const passed = isGraded && submission.grade !== null;

    const submitAssignment = (event) => {
        event.preventDefault();
        form.post(`/student/assignments/${assignment.id}/submit`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                    <ClipboardList className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="break-words text-lg font-bold leading-snug text-neutral-900">{assignment.title}</h2>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isLate ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                            <Clock className="size-3" />
                            {assignment.deadline
                                ? new Date(assignment.deadline).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                                : 'Tidak ada deadline'}
                        </span>
                        {isLate && (
                            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                                Lewat Deadline
                            </span>
                        )}
                    </div>
                </div>
                {submission && (
                    <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        isGraded
                            ? 'bg-emerald-100 text-emerald-700'
                            : submission.status === 'late'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-teal-100 text-teal-700'
                    }`}>
                        {isGraded ? `Nilai: ${submission.grade ?? '—'}` : submission.status === 'late' ? 'Terlambat' : 'Dikumpulkan'}
                    </span>
                )}
            </div>

            {/* Description */}
            {assignment.description && (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Deskripsi Tugas</p>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">{assignment.description}</p>
                </div>
            )}

            {/* Feedback */}
            {isGraded && submission.feedback && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600">Feedback Dosen</p>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-emerald-800">{submission.feedback}</p>
                </div>
            )}

            {/* Grade display */}
            {isGraded && (
                <div className={`rounded-xl border-2 p-4 text-center ${
                    Number(submission.grade) >= (assignment.passing_grade ?? 70)
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-amber-200 bg-amber-50'
                }`}>
                    <p className={`text-3xl font-bold tabular-nums ${
                        Number(submission.grade) >= (assignment.passing_grade ?? 70) ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                        {submission.grade}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-neutral-500">Nilai Kamu</p>
                </div>
            )}

            {/* Submit form */}
            {!isGraded && (
                <form onSubmit={submitAssignment} className="space-y-3">
                    <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-4">
                        {assignment.allow_file && (
                            <div>
                                <label htmlFor={`file-${assignment.id}`} className="mb-2 flex items-center gap-1.5 text-sm font-bold text-neutral-800">
                                    <Upload className="size-4 text-emerald-600" />
                                    Upload File
                                </label>
                                <input
                                    id={`file-${assignment.id}`}
                                    type="file"
                                    onChange={(e) => form.setData('file', e.target.files?.[0] ?? null)}
                                    className="w-full cursor-pointer text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:text-sm file:font-bold file:text-emerald-700 hover:file:bg-emerald-200 transition-colors"
                                />
                                {form.errors.file && (
                                    <p role="alert" className="mt-1.5 text-xs font-semibold text-rose-600">{form.errors.file}</p>
                                )}
                            </div>
                        )}
                        {assignment.allow_link && (
                            <div>
                                <label htmlFor={`link-${assignment.id}`} className="mb-2 flex items-center gap-1.5 text-sm font-bold text-neutral-800">
                                    <Download className="size-4 text-emerald-600" />
                                    Link URL
                                </label>
                                <input
                                    id={`link-${assignment.id}`}
                                    type="url"
                                    value={form.data.link_url}
                                    onChange={(e) => form.setData('link_url', e.target.value)}
                                    placeholder="https://..."
                                    className="h-10 w-full rounded-lg border-2 border-neutral-200 px-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                                {form.errors.link_url && (
                                    <p role="alert" className="mt-1.5 text-xs font-semibold text-rose-600">{form.errors.link_url}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="success"
                        disabled={form.processing}
                        loading={form.processing}
                        className="w-full h-12 rounded-xl shadow-lg shadow-emerald-500/25"
                    >
                        <Upload className="size-4" />
                        {form.processing ? 'Mengirim...' : submission ? 'Kirim Ulang Tugas' : 'Kirim Tugas'}
                    </Button>
                </form>
            )}
        </div>
    );
}

// Discussion View Component (simplified version)
function DiscussionView({ materialId, discussions: initialDiscussions }) {
    const { auth } = usePage().props;
    const form = useForm({ body: '', parent_id: null });
    const [replyingTo, setReplyingTo] = useState(null);
    const [discussions, setDiscussions] = useState(initialDiscussions || []);

    const submitDiscussion = (event) => {
        event.preventDefault();
        form.post(`/materials/${materialId}/discussions`, {
            preserveScroll: true,
            onSuccess: (page) => {
                const updatedMaterial = page.props.course.modules
                    .flatMap(m => m.materials)
                    .find(mat => mat.id === materialId);
                if (updatedMaterial) {
                    setDiscussions(updatedMaterial.discussions || []);
                }
                form.reset();
                setReplyingTo(null);
            },
        });
    };

    const handleDelete = (discussionId) => {
        router.delete(`/discussions/${discussionId}`, {
            preserveScroll: true,
            onSuccess: (page) => {
                const updatedMaterial = page.props.course.modules
                    .flatMap(m => m.materials)
                    .find(mat => mat.id === materialId);
                if (updatedMaterial) {
                    setDiscussions(updatedMaterial.discussions || []);
                }
            },
        });
    };

    const startReply = (discussionId) => {
        setReplyingTo(discussionId);
        form.setData('parent_id', discussionId);
    };

    const cancelReply = () => {
        setReplyingTo(null);
        form.setData({ body: '', parent_id: null });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                    <MessageSquare className="size-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-neutral-900">Diskusi Materi</h2>
                    <p className="mt-1 text-sm text-neutral-600">{discussions.length} diskusi aktif</p>
                </div>
            </div>

            <form onSubmit={submitDiscussion} className="space-y-3">
                {replyingTo && (
                    <div className="flex items-center justify-between rounded-lg bg-emerald-100 px-4 py-2 text-sm text-emerald-700 font-semibold">
                        <span>Membalas diskusi...</span>
                        <button type="button" onClick={cancelReply} className="text-emerald-900 hover:text-emerald-950 font-bold text-xs">
                            Batal
                        </button>
                    </div>
                )}
                <textarea
                    value={form.data.body}
                    onChange={(e) => form.setData('body', e.target.value)}
                    rows="3"
                    placeholder={replyingTo ? 'Tulis balasan Anda...' : 'Tulis pertanyaan atau komentar Anda...'}
                    className="w-full rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
                {form.errors.body && <p role="alert" className="text-sm text-rose-600 font-semibold">{form.errors.body}</p>}
                <Button
                    type="submit"
                    variant="success"
                    size="sm"
                    disabled={form.processing}
                    loading={form.processing}
                    className="px-6"
                >
                    <Send className="mr-1.5 size-4" />
                    Kirim Diskusi
                </Button>
            </form>

            <div className="space-y-3">
                {discussions.length === 0 && (
                    <div className="text-center py-8 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50">
                        <MessageSquare className="size-12 mx-auto text-neutral-400 mb-3" />
                        <p className="text-sm text-neutral-500 font-medium">Belum ada diskusi. Jadilah yang pertama bertanya!</p>
                    </div>
                )}
                {discussions.map((discussion) => (
                    <div key={discussion.id} className="rounded-xl border-2 border-neutral-200 bg-white p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-lg">
                                {discussion.user?.name?.slice(0, 2).toUpperCase() ?? 'U'}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-neutral-900">{discussion.user?.name ?? 'User'}</p>
                                <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-neutral-700">{discussion.body}</p>
                                <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
                                    <span>{new Date(discussion.created_at).toLocaleString('id-ID')}</span>
                                    <button type="button" onClick={() => startReply(discussion.id)} className="font-bold text-emerald-600 hover:text-emerald-700">
                                        Balas
                                    </button>
                                    {discussion.user_id === auth?.user?.id && (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(discussion.id)}
                                            className="font-bold text-rose-600 hover:text-rose-700"
                                        >
                                            Hapus
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {discussion.replies?.length > 0 && (
                            <div className="ml-12 mt-3 space-y-2 border-l-4 border-emerald-200 pl-4">
                                {discussion.replies.map((reply) => (
                                    <div key={reply.id} className="rounded-lg bg-emerald-50/50 p-3">
                                        <div className="flex items-start gap-2">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-emerald-700 text-xs font-bold">
                                                {reply.user?.name?.slice(0, 2).toUpperCase() ?? 'U'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-neutral-900">{reply.user?.name ?? 'User'}</p>
                                                <p className="mt-1 whitespace-pre-line text-xs leading-5 text-neutral-700">{reply.body}</p>
                                                <div className="mt-1.5 flex items-center gap-2 text-[10px] text-neutral-500">
                                                    <span>{new Date(reply.created_at).toLocaleString('id-ID')}</span>
                                                    {reply.user_id === auth?.user?.id && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(reply.id)}
                                                            className="font-bold text-rose-600 hover:text-rose-700"
                                                        >
                                                            Hapus
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Helper Components
function VideoContent({ url }) {
    const embed = youtubeEmbed(url);
    if (!embed) {
        return (
            <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold text-sm transition-colors">
                <PlayCircle className="size-4" />
                Buka Video
            </a>
        );
    }
    return <iframe title="Video pembelajaran" src={embed} className="aspect-video w-full rounded-[16px] border border-neutral-900/10 bg-neutral-950 shadow-[0_16px_44px_rgba(15,23,42,0.16)]" allowFullScreen />;
}

function DownloadLink({ path, label }) {
    return (
        <a href={storageUrl(path)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-semibold text-sm transition-colors">
            <Download className="size-4" />
            {label}
        </a>
    );
}

function storageUrl(path) {
    return path ? `/storage/${path}` : '#';
}

function youtubeEmbed(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace('www.', '');
        if (host === 'youtu.be') {
            return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
        }
        if (host === 'youtube.com' && parsed.searchParams.get('v')) {
            return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}`;
        }
    } catch {
        return null;
    }
    return null;
}
