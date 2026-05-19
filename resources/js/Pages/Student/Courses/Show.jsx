import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AlertTriangle, Ban, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ClipboardList, Clock, Download, FileText, HelpCircle, List, MessageSquare, PlayCircle, Send, Trash2, Upload, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import StudentLayout from '@/Layouts/StudentLayout';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/animated/AnimatedButton';
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
                if (currentView !== 'overview') {
                    navigateTo('overview');
                } else {
                    setShowSidebar(false);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentView]);

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

    // Count stats for each module
    const getModuleStats = (module) => {
        let contents = 0;
        let quizzes = (module.quizzes?.length || 0);
        let assignments = (module.assignments?.length || 0);
        
        module.materials?.forEach(material => {
            contents += material.contents?.length || 0;
            quizzes += material.quizzes?.length || 0;
            assignments += material.assignments?.length || 0;
        });

        return { contents, quizzes, assignments };
    };

    return (
        <StudentLayout title="Belajar">
            <Head title={`${course.name} - Belajar`} />

            {/* Background - Nature Fresh */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-br from-emerald-50 via-teal-50/50 to-green-50">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Course Header - Gradient Banner Style */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 md:p-6 text-white shadow-xl relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h1 className="text-xl md:text-2xl font-bold mb-1">{course.name}</h1>
                        <p className="text-emerald-100 text-sm">{course.code} • {course.instructor?.name}</p>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Progress */}
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/30">
                            <div className="text-right">
                                <p className="text-[10px] font-semibold text-emerald-100">Progress</p>
                                <p className="text-lg font-bold text-white">{progress}%</p>
                            </div>
                            <div className="w-20 md:w-24 h-2 rounded-full bg-white/30 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-2 rounded-full bg-white shadow-lg"
                                />
                            </div>
                        </div>

                        {/* Sidebar Toggle */}
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors font-semibold text-xs border border-white/30"
                        >
                            <List className="size-3.5" />
                            <span className="hidden sm:inline">Daftar Materi</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="relative min-h-[600px]">
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
                                getModuleStats={getModuleStats}
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
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-neutral-900">Daftar Materi</h2>
                                <button
                                    onClick={() => setShowSidebar(false)}
                                    className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
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
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : 'border-neutral-200 hover:border-emerald-200 hover:bg-emerald-50/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                                            currentView === 'overview' ? 'bg-emerald-500 text-white' : 'bg-neutral-100 text-neutral-600'
                                        }`}>
                                            <List className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-neutral-900">Overview</p>
                                            <p className="text-[10px] text-neutral-500">Lihat semua modul</p>
                                        </div>
                                    </div>
                                </button>

                                {/* Hierarchical Module List */}
                                {course.modules.map((module) => (
                                    <div key={module.id} className="space-y-1.5">
                                        {/* Module Header */}
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full text-left p-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Modul {module.order}</span>
                                                    <span className="text-xs font-semibold text-neutral-900">{module.title}</span>
                                                </div>
                                                {expandedModules[module.id] ? (
                                                    <ChevronUp className="size-3.5 text-neutral-600" />
                                                ) : (
                                                    <ChevronDown className="size-3.5 text-neutral-600" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Materials under Module */}
                                        {expandedModules[module.id] && (
                                            <div className="ml-3 space-y-1.5 border-l-2 border-emerald-200 pl-2">
                                                {/* Module-level Quizzes */}
                                                {module.quizzes?.map((quiz) => (
                                                    <button
                                                        key={`quiz-${quiz.id}`}
                                                        onClick={() => navigateTo(`quiz-${quiz.id}`)}
                                                        className={`w-full text-left p-2 rounded-lg border transition-all ${
                                                            currentView === `quiz-${quiz.id}`
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-neutral-200 hover:border-blue-200 hover:bg-blue-50/50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <HelpCircle className="size-3.5 text-blue-600" />
                                                            <span className="text-xs font-medium text-neutral-900 truncate">{quiz.title}</span>
                                                        </div>
                                                    </button>
                                                ))}

                                                {/* Module-level Assignments */}
                                                {module.assignments?.map((assignment) => (
                                                    <button
                                                        key={`assignment-${assignment.id}`}
                                                        onClick={() => navigateTo(`assignment-${assignment.id}`)}
                                                        className={`w-full text-left p-2 rounded-lg border transition-all ${
                                                            currentView === `assignment-${assignment.id}`
                                                                ? 'border-amber-500 bg-amber-50'
                                                                : 'border-neutral-200 hover:border-amber-200 hover:bg-amber-50/50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <ClipboardList className="size-3.5 text-amber-600" />
                                                            <span className="text-xs font-medium text-neutral-900 truncate">{assignment.title}</span>
                                                        </div>
                                                    </button>
                                                ))}

                                                {/* Materials */}
                                                {module.materials?.map((material) => (
                                                    <button
                                                        key={`material-${material.id}`}
                                                        onClick={() => navigateTo(`material-${material.id}`)}
                                                        className={`w-full text-left p-2 rounded-lg border transition-all ${
                                                            currentView === `material-${material.id}`
                                                                ? 'border-emerald-500 bg-emerald-50'
                                                                : 'border-neutral-200 hover:border-emerald-200 hover:bg-emerald-50/50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="size-3.5 text-emerald-600" />
                                                            <span className="text-xs font-medium text-neutral-900 truncate">{material.title}</span>
                                                        </div>
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
function OverviewPage({ course, getModuleStats, expandedModules, toggleModule, navigateTo, completed, attemptsByQuizId, submissionsByAssignmentId }) {
    return (
        <div className="space-y-4">
            {/* Modules List */}
            <div className="space-y-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">Daftar pembelajaran</p>
                        <h2 className="text-xl font-bold text-neutral-950">Pilih aktivitas belajar</h2>
                    </div>
                    <p className="text-sm text-neutral-500">Urut dari quiz, tugas, lalu materi utama.</p>
                </div>
                
                {course.modules.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-white/90 p-8 text-center">
                        <FileText className="size-12 mx-auto text-neutral-400 mb-3" />
                        <p className="text-neutral-500 text-sm font-medium">Belum ada materi yang dipublish.</p>
                    </div>
                )}

                {course.modules.map((module) => {
                    const stats = getModuleStats(module);
                    const isExpanded = expandedModules[module.id];

                    return (
                        <motion.div
                            key={module.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="overflow-hidden rounded-[22px] border border-emerald-100/80 bg-white/95 shadow-[0_14px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                        >
                            {/* Module Header */}
                            <button
                                onClick={() => toggleModule(module.id)}
                                className="w-full p-4 text-left transition-colors hover:bg-emerald-50/30 md:p-5"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-800">
                                                Modul {module.order}
                                            </span>
                                            <span className="flex size-7 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm">
                                                {isExpanded ? (
                                                    <ChevronUp className="size-4" />
                                                ) : (
                                                    <ChevronDown className="size-4" />
                                                )}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-neutral-950">{module.title}</h3>
                                        {module.description && (
                                            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">{module.description}</p>
                                        )}
                                    </div>
                                    
                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-2 sm:flex sm:shrink-0">
                                        {stats.contents > 0 && (
                                            <ModuleStat value={stats.contents} label="Konten" tone="sky" />
                                        )}
                                        {stats.quizzes > 0 && (
                                            <ModuleStat value={stats.quizzes} label="Quiz" tone="indigo" />
                                        )}
                                        {stats.assignments > 0 && (
                                            <ModuleStat value={stats.assignments} label="Tugas" tone="amber" />
                                        )}
                                    </div>
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
                                        className="border-t border-emerald-100 bg-gradient-to-b from-emerald-50/30 to-white"
                                    >
                                        <div className="space-y-3 p-4 md:p-5">
                                            {/* Module-level Quizzes */}
                                            {module.quizzes?.length > 0 && (
                                                <div className="space-y-2">
                                                    {module.quizzes.map((quiz) => {
                                                        const attempt = attemptsByQuizId?.[quiz.id];
                                                        return (
                                                            <LearningItemButton
                                                                key={quiz.id}
                                                                onClick={() => navigateTo(`quiz-${quiz.id}`)}
                                                                icon={HelpCircle}
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
                                                                icon={ClipboardList}
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
                                                                icon={FileText}
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
        </div>
    );
}

function ModuleStat({ value, label, tone }) {
    const tones = {
        sky: 'border-sky-100 bg-sky-50 text-sky-700',
        indigo: 'border-indigo-100 bg-indigo-50 text-indigo-700',
        amber: 'border-amber-100 bg-amber-50 text-amber-700',
    };

    return (
        <div className={`min-w-[58px] rounded-[14px] border px-3 py-2 text-center ${tones[tone]}`}>
            <p className="text-base font-black leading-none">{value}</p>
            <p className="mt-1 text-[10px] font-semibold">{label}</p>
        </div>
    );
}

function LearningItemButton({ icon: Icon, tone, title, eyebrow, meta, status, onClick }) {
    const tones = {
        blue: {
            accent: 'bg-blue-500',
            icon: 'bg-blue-50 text-blue-700 ring-blue-100',
            hover: 'hover:border-blue-200 hover:bg-blue-50/40',
            eyebrow: 'text-blue-700',
        },
        amber: {
            accent: 'bg-amber-500',
            icon: 'bg-amber-50 text-amber-700 ring-amber-100',
            hover: 'hover:border-amber-200 hover:bg-amber-50/40',
            eyebrow: 'text-amber-700',
        },
        emerald: {
            accent: 'bg-emerald-500',
            icon: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
            hover: 'hover:border-emerald-200 hover:bg-emerald-50/40',
            eyebrow: 'text-emerald-700',
        },
    };

    const selectedTone = tones[tone] ?? tones.emerald;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group relative w-full overflow-hidden rounded-[16px] border border-neutral-200 bg-white p-3 text-left shadow-sm transition-all ${selectedTone.hover} hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2`}
        >
            <span className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${selectedTone.accent}`} />
            <div className="flex items-center gap-3 pl-2">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] ring-1 ${selectedTone.icon}`}>
                    <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${selectedTone.eyebrow}`}>{eyebrow}</p>
                    <p className="mt-0.5 truncate text-sm font-bold text-neutral-950 md:text-[15px]">{title}</p>
                    {meta && <p className="mt-1 text-xs text-neutral-500">{meta}</p>}
                </div>
                {status && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="size-3.5" aria-hidden="true" />
                        {status}
                    </span>
                )}
            </div>
        </button>
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
            <div className="rounded-3xl bg-white/90 backdrop-blur-xl p-8 shadow-2xl border border-neutral-200/60 text-center">
                <p className="text-neutral-500">Item tidak ditemukan</p>
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
                className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold text-sm transition-colors"
            >
                <ChevronLeft className="size-4" />
                Kembali ke Overview
            </button>

            {/* Breadcrumb */}
            <div className="text-xs text-neutral-600">
                <span className="font-semibold text-emerald-600">Modul {currentModule.order}</span>
                <span className="mx-1.5">›</span>
                <span>{currentModule.title}</span>
                {currentMaterial && (
                    <>
                        <span className="mx-1.5">›</span>
                        <span>{currentMaterial.title}</span>
                    </>
                )}
            </div>

            {/* Content Renderer */}
            <div className="min-h-[400px] overflow-hidden rounded-[24px] border border-white/70 bg-white/95 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
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
                    <ContentView content={currentItem.data} completed={currentItem.completed} />
                )}
                {currentItem.type === 'quiz' && (
                    <QuizView quiz={currentItem.data} attempt={currentItem.attempt} />
                )}
                {currentItem.type === 'assignment' && (
                    <AssignmentView assignment={currentItem.data} submission={currentItem.submission} />
                )}
                {currentItem.type === 'discussion' && (
                    <DiscussionView materialId={currentItem.materialId} discussions={currentItem.discussions} />
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
    const activeLabel = currentTab?.type === 'content' ? currentTab.data.type : currentTab?.type;
    const completedCount = material.contents?.filter((content) => completed.has(content.id)).length || 0;
    const totalContent = material.contents?.length || 0;
    
    return (
        <div className="space-y-5 p-4 md:p-6">
            {/* Material Header */}
            <div className="relative overflow-hidden rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-5">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-100/50" />
                <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">Ruang belajar</p>
                        <h2 className="text-xl font-bold text-neutral-950 md:text-2xl">{material.title}</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
                            Pilih ikon untuk berpindah materi, quiz, tugas, atau diskusi.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        {totalContent > 0 && (
                            <span className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm">
                                {completedCount}/{totalContent} selesai
                            </span>
                        )}
                        <span className="rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-xs font-bold capitalize text-neutral-700 shadow-sm">
                            {activeLabel}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-neutral-200">
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent">
                    {tabs.map((tab, index) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === index;
                        
                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(index)}
                                aria-label={tab.title}
                                title={tab.title}
                                className={`relative flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                                    isActive
                                        ? 'bg-white text-emerald-700 shadow-md'
                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                                }`}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Icon className="size-3.5" aria-hidden="true" />
                                <span className="max-w-[120px] truncate">{tab.title}</span>
                                {tab.badge && (
                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                        isActive 
                                            ? 'bg-emerald-100 text-emerald-700' 
                                            : 'bg-neutral-200 text-neutral-700'
                                    }`}>
                                        {tab.badge}
                                    </span>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentTab.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="min-h-[300px] rounded-[20px] border border-neutral-200 bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.07)] md:p-5"
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

// Content View Component (copied from Show.jsx)
function ContentView({ content, completed }) {
    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-[0_10px_22px_rgba(14,165,233,0.26)]">
                        {content.type === 'video' ? <PlayCircle className="size-5" /> : <FileText className="size-5" />}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700">{content.type}</p>
                        <h2 className="mt-1 text-xl font-bold text-neutral-950">{content.title}</h2>
                    </div>
                </div>
                <Button
                    type="button"
                    variant={completed ? 'outline' : 'default'}
                    className={`h-11 rounded-full px-5 text-sm font-bold ${completed ? 'border border-emerald-300 bg-emerald-50 text-emerald-700' : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_10px_22px_rgba(5,150,105,0.22)] hover:from-emerald-700 hover:to-teal-700'}`}
                    disabled={completed}
                    onClick={() => router.patch(`/student/contents/${content.id}/complete`, {}, { preserveScroll: true })}
                >
                    <CheckCircle2 className="mr-1.5 size-4" />
                    {completed ? 'Selesai' : 'Tandai Selesai'}
                </Button>
            </div>

            <div className="rounded-[18px] border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-3 md:p-4">
                {content.type === 'artikel' && (
                    <div className="prose prose-sm max-w-none rounded-[14px] bg-white p-4">
                        <p className="whitespace-pre-line text-sm leading-7 text-neutral-700">{content.body}</p>
                    </div>
                )}
                {content.type === 'video' && (
                    <VideoPlayer
                        videoId={content.video_id}
                        url={content.url}
                        title={content.title}
                        className="rounded-[14px]"
                    />
                )}
                {content.type === 'audio' && (
                    <audio controls className="w-full rounded-[14px]" src={storageUrl(content.file_path)} />
                )}
                {content.type === 'pdf' && (
                    <div className="space-y-3">
                        <iframe 
                            title={content.title} 
                            src={storageUrl(content.file_path)} 
                            className="h-[500px] w-full rounded-[14px] border border-neutral-200 bg-white" 
                        />
                        <DownloadLink path={content.file_path} label="Buka PDF di Tab Baru" />
                    </div>
                )}
                {content.type === 'file' && (
                    <div className="text-center py-8">
                        <FileText className="size-12 mx-auto text-neutral-400 mb-3" />
                        <DownloadLink path={content.file_path} label="Unduh File" />
                    </div>
                )}
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
        if (hasSubmitted.current || form.processing) return;

        hasSubmitted.current = true;
        form
            .transform(() => ({
                answers: latestFormData.current.answers ?? {},
                started_at: latestFormData.current.started_at,
            }))
            .post(`/student/quizzes/${quiz.id}/attempts`, {
                preserveScroll: true,
                onError: () => {
                    hasSubmitted.current = false;
                },
            });
    };

    // Timer effect
    useEffect(() => {
        if (!quizStarted || !startTime || attempt || timeExpired) return;

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
    }, [quizStarted, startTime, attempt, timeExpired, quiz.duration]);

    const startQuiz = () => {
        const now = new Date().toISOString();
        setStartTime(Date.now());
        setQuizStarted(true);
        form.setData('started_at', now);
    };

    const submitQuiz = (event) => {
        event.preventDefault();

        if (!form.data.started_at) {
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
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg sm:size-10">
                        <HelpCircle className="size-4 sm:size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="break-words text-lg font-bold leading-snug text-neutral-900 sm:text-xl">{quiz.title}</h2>
                        <p className="mt-1 text-xs leading-relaxed text-neutral-600 sm:text-sm">Baca instruksi dengan teliti sebelum memulai</p>
                        {hasAttempted && (
                            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                                <AlertTriangle className="size-3.5" />
                                Percobaan ke-{attemptCount + 1} dari {quiz.max_attempts}
                            </p>
                        )}
                    </div>
                </div>

                {/* Quiz Info Card */}
                <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-neutral-900 sm:text-base">
                        <ClipboardList className="size-4 text-blue-700 sm:size-5" />
                        Informasi Quiz
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex min-w-0 items-center gap-3 rounded-lg bg-white/70 p-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                                <FileText className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-neutral-600">Jumlah Soal</p>
                                <p className="truncate text-sm font-bold text-neutral-900">{quiz.questions.length} Soal</p>
                            </div>
                        </div>

                        <div className="flex min-w-0 items-center gap-3 rounded-lg bg-white/70 p-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                                <HelpCircle className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-neutral-600">Maks. Percobaan</p>
                                <p className="truncate text-sm font-bold text-neutral-900">{quiz.max_attempts}x {hasAttempted && `(Sisa: ${remainingAttempts}x)`}</p>
                            </div>
                        </div>

                        {quiz.duration && (
                            <div className="flex min-w-0 items-center gap-3 rounded-lg bg-white/70 p-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                    <Clock className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-neutral-600">Durasi</p>
                                    <p className="truncate text-sm font-bold text-neutral-900">{quiz.duration} Menit</p>
                                </div>
                            </div>
                        )}

                        <div className="flex min-w-0 items-center gap-3 rounded-lg bg-white/70 p-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                <CheckCircle2 className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-neutral-600">Passing Score</p>
                                <p className="truncate text-sm font-bold text-neutral-900">{quiz.passing_score}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-neutral-900 sm:text-base">
                        <AlertTriangle className="size-4 text-amber-600 sm:size-5" />
                        Instruksi
                    </h3>
                    <ul className="space-y-2 text-xs leading-relaxed text-neutral-700 sm:text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>Pastikan koneksi internet Anda stabil</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>Jawab semua pertanyaan dengan teliti</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-rose-600 font-bold">•</span>
                            <span><strong>Anda memiliki {quiz.max_attempts} kesempatan</strong> untuk mengerjakan quiz ini</span>
                        </li>
                        {hasAttempted && (
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold">•</span>
                                <span><strong>Ini adalah percobaan ke-{attemptCount + 1}</strong> dari {quiz.max_attempts} percobaan</span>
                            </li>
                        )}
                        {quiz.duration && (
                            <>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-600 font-bold">•</span>
                                    <span>Waktu akan berjalan setelah Anda klik "Mulai Quiz"</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-600 font-bold">•</span>
                                    <span><strong>Quiz akan otomatis berakhir</strong> jika waktu habis</span>
                                </li>
                            </>
                        )}
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>Pastikan Anda sudah siap sebelum memulai</span>
                        </li>
                    </ul>
                </div>

                {/* Start Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="sticky bottom-3 z-20 sm:static"
                >
                    <AnimatedButton
                        type="button"
                        onClick={startQuiz}
                        className="h-12 w-full text-sm font-bold shadow-xl sm:text-base bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    >
                        Mulai Quiz
                    </AnimatedButton>
                </motion.div>
            </div>
        );
    }

    // Max attempts reached
    if (!canAttempt) {
        return (
            <div className="space-y-4">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg sm:size-10">
                        <Ban className="size-4 sm:size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="break-words text-lg font-bold leading-snug text-neutral-900 sm:text-xl">{quiz.title}</h2>
                        <p className="mt-1 text-xs text-neutral-600 sm:text-sm">Batas percobaan telah tercapai</p>
                    </div>
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center sm:p-6">
                    <Ban className="mx-auto mb-2 size-8 text-rose-700" />
                    <p className="mb-2 text-base font-bold text-rose-700 sm:text-lg">Batas Percobaan Tercapai</p>
                    <p className="text-xs leading-relaxed text-rose-600 sm:text-sm">
                        Anda telah menggunakan semua {quiz.max_attempts} percobaan untuk quiz ini.
                    </p>
                </div>

                {canShowScore && (
                    <div className={`rounded-xl p-4 ${
                        Number(attempt.score) >= Number(quiz.passing_score)
                            ? 'bg-emerald-50 border-2 border-emerald-200'
                            : 'bg-rose-50 border-2 border-rose-200'
                    }`}>
                        <p className="text-sm font-bold text-neutral-900 sm:text-base">
                            Nilai Terakhir: <span className={Number(attempt.score) >= Number(quiz.passing_score) ? 'text-emerald-700' : 'text-rose-700'}>
                                {attempt.score}
                            </span>
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-neutral-700 sm:text-sm">
                            {Number(attempt.score) >= Number(quiz.passing_score) ? 'Selamat, Anda lulus quiz ini.' : 'Belum lulus. Silakan pelajari kembali materinya.'}
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // Quiz Questions (after starting or if already attempted)
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3 sm:flex-1">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg sm:size-10">
                        <HelpCircle className="size-4 sm:size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="break-words text-lg font-bold leading-snug text-neutral-900 sm:text-xl">{quiz.title}</h2>
                        <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700 sm:px-3 sm:text-xs">
                                {quiz.questions.length} Soal
                            </span>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:px-3 sm:text-xs">
                                Passing: {quiz.passing_score}
                            </span>
                            {quiz.duration && (
                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700 sm:px-3 sm:text-xs">
                                    {quiz.duration} Menit
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {attempt && (
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold sm:ml-auto ${
                        attempt.status === 'graded' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                    }`}>
                        {attempt.status === 'graded' ? (canShowScore ? `Nilai: ${attempt.score}` : 'Selesai') : 'Menunggu Penilaian'}
                    </span>
                )}
            </div>

            {/* Timer Display (only when quiz is active) */}
            {!attempt && quizStarted && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`sticky top-2 z-10 rounded-xl border p-3 shadow-lg sm:top-4 sm:p-4 ${
                        timeExpired
                            ? 'bg-rose-50 border-rose-300'
                            : isWarningTime
                            ? 'bg-amber-50 border-amber-300'
                            : 'bg-blue-50 border-blue-300'
                    }`}
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`flex size-10 items-center justify-center rounded-lg ${
                                timeExpired
                                    ? 'bg-rose-200 text-rose-700'
                                    : isWarningTime
                                    ? 'bg-amber-200 text-amber-700 animate-pulse'
                                    : 'bg-blue-200 text-blue-700'
                            }`}>
                                <Clock className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-neutral-600">
                                    {quiz.duration ? 'Waktu Tersisa' : 'Waktu Berjalan'}
                                </p>
                                <p className={`text-2xl font-bold ${
                                    timeExpired
                                        ? 'text-rose-700'
                                        : isWarningTime
                                        ? 'text-amber-700'
                                        : 'text-blue-700'
                                }`}>
                                    {quiz.duration ? formatTime(remainingSeconds) : formatTime(elapsedSeconds)}
                                </p>
                            </div>
                        </div>
                        {timeExpired && (
                            <span className="w-fit rounded-full bg-rose-200 px-3 py-1.5 text-xs font-bold text-rose-800">
                                Mengirim Otomatis
                            </span>
                        )}
                        {isWarningTime && !timeExpired && (
                            <span className="w-fit animate-pulse rounded-full bg-amber-200 px-3 py-1.5 text-xs font-bold text-amber-800">
                                Segera Selesaikan
                            </span>
                        )}
                    </div>
                </motion.div>
            )}

            {canShowScore && (
                <div className={`rounded-xl p-4 ${
                    Number(attempt.score) >= Number(quiz.passing_score)
                        ? 'bg-emerald-50 border-2 border-emerald-200'
                        : 'bg-rose-50 border-2 border-rose-200'
                }`}>
                    <p className="text-sm font-bold text-neutral-900 sm:text-base">
                        Hasil Quiz: <span className={Number(attempt.score) >= Number(quiz.passing_score) ? 'text-emerald-700' : 'text-rose-700'}>
                            {attempt.score}
                        </span>
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-700 sm:text-sm">
                        {Number(attempt.score) >= Number(quiz.passing_score) ? 'Selamat, Anda lulus quiz ini.' : 'Belum lulus. Silakan pelajari kembali materinya.'}
                    </p>
                </div>
            )}

            {!attempt && (
                <form onSubmit={submitQuiz} className="space-y-4">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:p-4">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">
                                    Soal {Math.min(currentQuestionIndex + 1, totalQuestions)} dari {totalQuestions}
                                </p>
                                <p className="mt-1 text-xs font-semibold text-neutral-500">
                                    {answeredCount}/{totalQuestions} terjawab
                                </p>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 sm:w-56">
                                <motion.div
                                    initial={false}
                                    animate={{ width: `${progressPercent}%` }}
                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="mb-5 flex flex-wrap gap-1.5">
                            {quiz.questions.map((question, index) => {
                                const hasAnswer = form.data.answers[question.id] !== undefined && String(form.data.answers[question.id]).trim() !== '';
                                const isActive = index === currentQuestionIndex;

                                return (
                                    <button
                                        key={question.id}
                                        type="button"
                                        onClick={() => goToQuestion(index)}
                                        disabled={form.processing}
                                        className={`flex size-9 items-center justify-center rounded-lg border text-xs font-black transition-all ${
                                            isActive
                                                ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                                                : hasAnswer
                                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                                : 'border-neutral-200 bg-white text-neutral-500 hover:border-blue-200 hover:bg-blue-50'
                                        }`}
                                        aria-label={`Buka soal ${index + 1}`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {activeQuestion ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeQuestion.id}
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4 sm:p-5">
                                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">
                                            {activeQuestion.type === 'essay' ? 'Essay' : activeQuestion.type === 'true_false' ? 'Benar atau Salah' : 'Pilihan Ganda'}
                                        </p>
                                        <h3 className="break-words text-lg font-black leading-snug text-neutral-950 sm:text-2xl">
                                            {activeQuestion.question}
                                        </h3>
                                    </div>

                                    {activeQuestion.type === 'multiple_choice' && (
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {activeQuestion.options?.map((option, optionIndex) => {
                                                const selected = activeAnswer === option;

                                                return (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => setAnswer(activeQuestion.id, option)}
                                                        disabled={form.processing}
                                                        className={`min-h-24 rounded-2xl border-2 p-4 text-left text-sm font-bold leading-relaxed shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:text-base ${
                                                            selected
                                                                ? 'border-blue-700 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                                : answerTones[optionIndex % answerTones.length]
                                                        }`}
                                                    >
                                                        <span className={`mb-3 flex size-7 items-center justify-center rounded-lg text-xs font-black ${
                                                            selected ? 'bg-white text-blue-700' : 'bg-white/80 text-neutral-700'
                                                        }`}>
                                                            {String.fromCharCode(65 + optionIndex)}
                                                        </span>
                                                        <span className="break-words">{option}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {activeQuestion.type === 'true_false' && (
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {[
                                                ['true', 'Benar'],
                                                ['false', 'Salah'],
                                            ].map(([value, label], optionIndex) => {
                                                const selected = activeAnswer === value;

                                                return (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        onClick={() => setAnswer(activeQuestion.id, value)}
                                                        disabled={form.processing}
                                                        className={`min-h-24 rounded-2xl border-2 p-4 text-center text-base font-black shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                                                            selected
                                                                ? 'border-blue-700 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                                : answerTones[optionIndex]
                                                        }`}
                                                    >
                                                        {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {activeQuestion.type === 'essay' && (
                                        <textarea
                                            value={form.data.answers[activeQuestion.id] ?? ''}
                                            onChange={(event) => setAnswer(activeQuestion.id, event.target.value)}
                                            rows="7"
                                            placeholder="Tulis jawaban Anda di sini..."
                                            disabled={form.processing}
                                            className="min-h-44 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm leading-relaxed outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                                Quiz ini belum memiliki soal.
                            </div>
                        )}
                    </div>

                    {form.errors.answers && <p role="alert" className="text-sm text-rose-600 font-semibold">{form.errors.answers}</p>}
                    
                    <div className="sticky bottom-3 z-20 rounded-2xl border border-neutral-200 bg-white/95 p-2 shadow-xl backdrop-blur sm:static sm:p-0 sm:shadow-none sm:border-0 sm:bg-transparent">
                        <div className="grid grid-cols-[auto_1fr] gap-2 sm:grid-cols-[auto_auto_1fr]">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => goToQuestion(currentQuestionIndex - 1)}
                                disabled={form.processing || currentQuestionIndex === 0}
                                className="h-12 rounded-xl px-4 font-bold"
                            >
                                <ChevronLeft className="size-4" />
                                <span className="hidden sm:inline">Sebelumnya</span>
                            </Button>

                            {!isLastQuestion && (
                                <Button
                                    type="button"
                                    onClick={goToNextQuestion}
                                    disabled={form.processing || totalQuestions === 0 || timeExpired}
                                    className="h-12 rounded-xl bg-blue-600 px-4 font-bold text-white hover:bg-blue-700 sm:col-auto"
                                >
                                    <span>Lanjut</span>
                                    <ChevronRight className="size-4" />
                                </Button>
                            )}

                            <AnimatedButton
                                type={isLastQuestion ? 'submit' : 'button'}
                                onClick={isLastQuestion ? undefined : postQuiz}
                                className={`h-12 w-full text-sm font-bold shadow-xl text-white ${
                                    isLastQuestion
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                                        : 'bg-gradient-to-r from-neutral-700 to-neutral-900 hover:from-neutral-800 hover:to-black'
                                }`}
                                disabled={form.processing || totalQuestions === 0 || timeExpired}
                            >
                                {form.processing && timeExpired ? 'Mengirim Otomatis...' : isLastQuestion ? 'Kirim Jawaban' : 'Selesaikan Sekarang'}
                                <Send className="size-4" />
                            </AnimatedButton>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

// Assignment View Component (copied from Show.jsx)
function AssignmentView({ assignment, submission }) {
    const form = useForm({ file: null, link_url: '' });
    const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);

    const submitAssignment = (event) => {
        event.preventDefault();
        form.post(`/student/assignments/${assignment.id}/submit`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
                    <ClipboardList className="size-5" />
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-neutral-900">{assignment.title}</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                            Deadline: {assignment.deadline ? new Date(assignment.deadline).toLocaleString('id-ID') : 'Tidak ada'}
                        </span>
                        {isLate && (
                            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                                ⚠️ Lewat Deadline
                            </span>
                        )}
                    </div>
                </div>
                {submission && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        submission.status === 'graded' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : submission.status === 'late'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                    }`}>
                        {submission.status === 'graded' ? `Nilai: ${submission.grade}` : submission.status === 'late' ? 'Terlambat' : 'Sudah Dikumpulkan'}
                    </span>
                )}
            </div>

            {assignment.description && (
                <div className="rounded-xl border-2 border-neutral-200 bg-neutral-50/50 p-4">
                    <h3 className="text-sm font-bold text-neutral-900 mb-2">📋 Deskripsi Tugas</h3>
                    <p className="whitespace-pre-line text-sm leading-6 text-neutral-700">{assignment.description}</p>
                </div>
            )}

            {submission?.status === 'graded' && submission.feedback && (
                <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
                    <h3 className="text-sm font-bold text-emerald-900 mb-2">💬 Feedback Dosen</h3>
                    <p className="whitespace-pre-line text-sm leading-6 text-emerald-800">{submission.feedback}</p>
                </div>
            )}

            {(!submission || submission.status !== 'graded') && (
                <form onSubmit={submitAssignment} className="space-y-4">
                    <div className="rounded-xl border-2 border-neutral-200 bg-white p-4 space-y-4">
                        {assignment.allow_file && (
                            <div>
                                <label htmlFor={`file-${assignment.id}`} className="block text-sm font-bold text-neutral-900 mb-2">
                                    📎 Upload File
                                </label>
                                <input
                                    id={`file-${assignment.id}`}
                                    type="file"
                                    onChange={(e) => form.setData('file', e.target.files?.[0] ?? null)}
                                    className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:text-emerald-700 file:font-bold cursor-pointer hover:file:bg-emerald-200 transition-colors"
                                />
                                {form.errors.file && <p role="alert" className="mt-1.5 text-sm text-rose-600 font-semibold">{form.errors.file}</p>}
                            </div>
                        )}
                        {assignment.allow_link && (
                            <div>
                                <label htmlFor={`link-${assignment.id}`} className="block text-sm font-bold text-neutral-900 mb-2">
                                    🔗 Link URL
                                </label>
                                <input
                                    id={`link-${assignment.id}`}
                                    type="url"
                                    value={form.data.link_url}
                                    onChange={(e) => form.setData('link_url', e.target.value)}
                                    placeholder="https://..."
                                    className="h-10 w-full rounded-lg border-2 border-neutral-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                                {form.errors.link_url && <p role="alert" className="mt-1.5 text-sm text-rose-600 font-semibold">{form.errors.link_url}</p>}
                            </div>
                        )}
                    </div>
                    <AnimatedButton
                        type="submit"
                        className="w-full h-11 text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                        disabled={form.processing}
                    >
                        <Upload className="mr-1.5 size-4" />
                        {submission ? 'Kirim Ulang Tugas' : 'Kirim Tugas'}
                    </AnimatedButton>
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
                        <span>💬 Membalas diskusi...</span>
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
                <AnimatedButton
                    type="submit"
                    className="px-6 py-2 text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    disabled={form.processing}
                >
                    <Send className="mr-1.5 size-4" />
                    Kirim Diskusi
                </AnimatedButton>
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
                                        💬 Balas
                                    </button>
                                    {discussion.user_id === auth?.user?.id && (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(discussion.id)}
                                            className="font-bold text-rose-600 hover:text-rose-700"
                                        >
                                            🗑️ Hapus
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
