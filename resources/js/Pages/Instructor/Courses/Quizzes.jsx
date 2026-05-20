import { Head, Link, router } from '@inertiajs/react';
import { HelpCircle, Plus, Search, Users, CheckCircle2, FileText, Clock, Layers3, Edit2, Trash2, MoreHorizontal, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import InstructorLayout from '@/Layouts/InstructorLayout';
import CourseWorkspaceLayout from '@/components/instructor/CourseWorkspaceLayout';
import QuizFormModal from '@/components/instructor/QuizFormModal';
import { Button } from '@/components/ui/button';

export default function Quizzes({ course, quizzes, stats, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [filterData, setFilterData] = useState({
        search: filters.search ?? '',
        status: filters.status ?? '',
        module_id: filters.module_id ?? '',
    });

    const openModal = (quiz = null) => {
        setEditingQuiz(quiz);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingQuiz(null);
    };

    const deleteQuiz = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kuis ini? Semua soal dan percobaan terkait akan ikut terhapus.')) {
            router.delete(`/instructor/quizzes/${id}`, { preserveScroll: true });
        }
    };

    const togglePublish = (quiz) => {
        router.patch(`/instructor/quizzes/${quiz.id}/toggle`, {}, { preserveScroll: true });
    };

    // Debounced filter
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(`/instructor/courses/${course.id}/quizzes`, filterData, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [filterData]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const getModuleName = (quiz) => {
        if (!quiz.quizzable) return '-';
        const type = quiz.quizzable_type;
        if (type === 'module' || type === 'App\\Models\\Module') {
            return quiz.quizzable.title;
        }
        // Material - get module from material
        return quiz.quizzable.module?.title ?? quiz.quizzable.title;
    };

    const getQuizLevel = (quiz) => {
        const type = quiz.quizzable_type;
        if (type === 'material' || type === 'App\\Models\\Material') {
            return 'Materi';
        }
        return 'Modul';
    };

    return (
        <InstructorLayout title={`${course.name} - Kuis`}>
            <Head title={`${course.name} - Kuis`} />

            <CourseWorkspaceLayout course={course}>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900">Kuis</h2>
                            <p className="text-sm text-neutral-600 mt-1">Kelola semua kuis pada kursus ini.</p>
                        </div>
                        <Button 
                            onClick={() => openModal()} 
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
                        >
                            <Plus className="mr-2 size-4" /> Buat Kuis
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Total Kuis" value={stats.total} icon={HelpCircle} color="emerald" />
                        <StatCard label="Aktif" value={stats.published} icon={CheckCircle2} color="teal" />
                        <StatCard label="Draft" value={stats.draft} icon={FileText} color="neutral" />
                        <StatCard label="Rata-rata Nilai" value={stats.avg_score} icon={Users} color="blue" suffix="%" />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                            <input
                                value={filterData.search}
                                onChange={(e) => setFilterData(prev => ({ ...prev, search: e.target.value }))}
                                placeholder="Cari kuis..."
                                className="h-10 w-full rounded-lg border border-neutral-200 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                        <select
                            value={filterData.status}
                            onChange={(e) => setFilterData(prev => ({ ...prev, status: e.target.value }))}
                            className="h-10 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        >
                            <option value="">Semua Status</option>
                            <option value="published">Aktif</option>
                            <option value="draft">Draft</option>
                        </select>
                        <select
                            value={filterData.module_id}
                            onChange={(e) => setFilterData(prev => ({ ...prev, module_id: e.target.value }))}
                            className="h-10 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        >
                            <option value="">Semua Modul</option>
                            {course.modules?.map((module) => (
                                <option key={module.id} value={module.id}>{module.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Quizzes Table */}
                    {quizzes.length === 0 ? (
                        <EmptyState onCreateClick={() => openModal()} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px]">
                                    <thead>
                                        <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Kuis</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Modul</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Soal</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Durasi</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Peserta</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Rata-rata</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                                            <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {quizzes.map((quiz) => (
                                            <tr key={quiz.id} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100">
                                                            <HelpCircle className="size-4 text-emerald-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-neutral-900">{quiz.title}</p>
                                                            <p className="text-xs text-neutral-500">Tingkat {getQuizLevel(quiz)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm text-neutral-600">{getModuleName(quiz)}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-sm font-medium text-neutral-900">{quiz.questions?.length ?? 0}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-sm text-neutral-600">{quiz.duration ? `${quiz.duration} menit` : '-'}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-sm text-neutral-600">{quiz.completed_attempts_count ?? 0}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-sm font-medium text-neutral-900">
                                                        {quiz.attempts_avg_score ? Math.round(quiz.attempts_avg_score) : '-'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <StatusBadge isPublished={quiz.is_published} />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/instructor/quizzes/${quiz.id}/edit`}
                                                            className="inline-flex h-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                                                        >
                                                            <Layers3 className="mr-1.5 size-3.5" /> Builder
                                                        </Link>
                                                        <ActionDropdown
                                                            quiz={quiz}
                                                            isOpen={openDropdown === quiz.id}
                                                            onToggle={(e) => {
                                                                e.stopPropagation();
                                                                setOpenDropdown(openDropdown === quiz.id ? null : quiz.id);
                                                            }}
                                                            onEdit={() => openModal(quiz)}
                                                            onTogglePublish={() => togglePublish(quiz)}
                                                            onDelete={() => deleteQuiz(quiz.id)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </div>
            </CourseWorkspaceLayout>

            {/* Quiz Form Modal */}
            <QuizFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                quiz={editingQuiz}
                modules={course.modules}
                showParentSelect={true}
            />
        </InstructorLayout>
    );
}


function StatCard({ label, value, icon: Icon, color, suffix = '' }) {
    const colors = {
        emerald: 'from-emerald-500 to-teal-500 shadow-emerald-500/25',
        teal: 'from-teal-500 to-cyan-500 shadow-teal-500/25',
        neutral: 'from-neutral-400 to-neutral-500 shadow-neutral-400/25',
        blue: 'from-blue-500 to-indigo-500 shadow-blue-500/25',
        amber: 'from-amber-500 to-orange-500 shadow-amber-500/25',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4"
        >
            <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg`}>
                    <Icon className="size-5 text-white" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-neutral-900">{value}{suffix}</p>
                    <p className="text-xs text-neutral-500">{label}</p>
                </div>
            </div>
        </motion.div>
    );
}

function StatusBadge({ isPublished }) {
    if (isPublished) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Aktif
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
            <span className="size-1.5 rounded-full bg-neutral-400" />
            Draft
        </span>
    );
}


function ActionDropdown({ quiz, isOpen, onToggle, onEdit, onTogglePublish, onDelete }) {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="flex size-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-colors"
            >
                <MoreHorizontal className="size-4" />
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 rounded-lg bg-white shadow-lg border border-neutral-200 py-1 z-10">
                    <button
                        onClick={() => { onEdit(); onToggle({ stopPropagation: () => {} }); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                        <Edit2 className="size-4" /> Edit
                    </button>
                    <button
                        onClick={() => { onTogglePublish(); onToggle({ stopPropagation: () => {} }); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                        <Eye className="size-4" /> {quiz.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <hr className="my-1 border-neutral-100" />
                    <button
                        onClick={() => { onDelete(); onToggle({ stopPropagation: () => {} }); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="size-4" /> Hapus
                    </button>
                </div>
            )}
        </div>
    );
}

function EmptyState({ onCreateClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-neutral-100 p-12 text-center"
        >
            <div className="flex justify-center mb-6">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200">
                    <HelpCircle className="size-10 text-emerald-600" />
                </div>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Belum Ada Kuis</h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Buat kuis pertama untuk menguji pemahaman mahasiswa terhadap materi pembelajaran.
            </p>
            <Button 
                onClick={onCreateClick}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
                <Plus className="mr-2 size-4" /> Buat Kuis Pertama
            </Button>
        </motion.div>
    );
}
