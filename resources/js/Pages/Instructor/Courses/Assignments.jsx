import { Head, Link, router } from '@inertiajs/react';
import { ClipboardList, Plus, Search, Calendar, Users, CheckCircle2, X, Edit2, Trash2, Eye, MoreHorizontal, FileText, Link as LinkIcon, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import InstructorLayout from '@/Layouts/InstructorLayout';
import CourseWorkspaceLayout from '@/components/instructor/CourseWorkspaceLayout';
import AssignmentFormModal from '@/components/instructor/AssignmentFormModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { EmptyState } from '@/components/ui/empty-state';

export default function Assignments({ course, assignments, stats, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [filterData, setFilterData] = useState({
        search: filters.search ?? '',
        status: filters.status ?? '',
        module_id: filters.module_id ?? '',
    });

    const openModal = (assignment = null) => {
        setEditingAssignment(assignment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAssignment(null);
    };

    const deleteAssignment = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus tugas ini? Semua submission terkait akan ikut terhapus.')) {
            router.delete(`/instructor/assignments/${id}`, { preserveScroll: true });
        }
    };

    const togglePublish = (assignment) => {
        router.patch(`/instructor/assignments/${assignment.id}/toggle`, {}, { preserveScroll: true });
    };

    // Debounced filter
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(`/instructor/courses/${course.id}/assignments`, filterData, {
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

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isOverdue = (deadline) => {
        if (!deadline) return false;
        return new Date(deadline) < new Date();
    };

    return (
        <InstructorLayout title={`${course.name} - Tugas`}>
            <Head title={`${course.name} - Tugas`} />

            <CourseWorkspaceLayout course={course}>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-content-primary">Tugas</h2>
                            <p className="text-sm text-content-secondary mt-1">Kelola semua tugas pada kursus ini.</p>
                        </div>
                        <Button 
                            onClick={() => openModal()} 
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
                        >
                            <Plus className="mr-2 size-4" /> Buat Tugas
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Total Tugas" value={stats.total} icon={ClipboardList} color="emerald" />
                        <StatCard label="Aktif" value={stats.published} icon={CheckCircle2} color="teal" />
                        <StatCard label="Draft" value={stats.draft} icon={FileText} color="neutral" />
                        <StatCard label="Perlu Dinilai" value={stats.needs_grading} icon={Clock} color="amber" />
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-muted" />
                            <input
                                value={filterData.search}
                                onChange={(e) => setFilterData(prev => ({ ...prev, search: e.target.value }))}
                                placeholder="Cari tugas..."
                                className="h-10 w-full rounded-lg border pl-10 pr-4 text-sm outline-none
                                    border-line focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                                    dark:border-white/10 dark:bg-white/8 dark:text-white dark:placeholder:text-white/25 dark:focus:border-emerald-500/60"
                            />
                        </div>
                        <select
                            value={filterData.status}
                            onChange={(e) => setFilterData(prev => ({ ...prev, status: e.target.value }))}
                            className="h-10 rounded-lg border px-3 text-sm outline-none
                                border-line focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                                dark:border-white/10 dark:bg-white/8 dark:text-white/80 dark:focus:border-emerald-500/60"
                        >
                            <option value="">Semua Status</option>
                            <option value="published">Aktif</option>
                            <option value="draft">Draft</option>
                            <option value="needs_grading">Perlu Dinilai</option>
                        </select>
                        <select
                            value={filterData.module_id}
                            onChange={(e) => setFilterData(prev => ({ ...prev, module_id: e.target.value }))}
                            className="h-10 rounded-lg border px-3 text-sm outline-none
                                border-line focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                                dark:border-white/10 dark:bg-white/8 dark:text-white/80 dark:focus:border-emerald-500/60"
                        >
                            <option value="">Semua Modul</option>
                            {course.modules?.map((module) => (
                                <option key={module.id} value={module.id}>{module.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Assignments Table */}
                    {assignments.length === 0 ? (
                        <EmptyState
                            icon={ClipboardList}
                            title="Belum ada tugas"
                            description="Tambahkan tugas untuk modul agar mahasiswa dapat mengumpulkan pekerjaan mereka."
                            action={
                                <Button onClick={() => openModal()} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                                    <Plus className="mr-2 size-4" /> Buat Tugas
                                </Button>
                            }
                        />
                    ) : (
                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-line-subtle bg-surface-muted/50 dark:bg-white/5">
                                            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Tugas</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Lokasi</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Deadline</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Submission</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Perlu Dinilai</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Status</th>
                                            <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.06]">
                                        {assignments.map((assignment) => (
                                            <tr key={assignment.id} className="transition-colors hover:bg-surface-muted/50 dark:hover:bg-white/5">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                                            <ClipboardList className="size-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm text-content-primary">{assignment.title}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                {assignment.allow_file && (
                                                                    <span className="inline-flex items-center gap-1 text-[10px] text-content-secondary">
                                                                        <FileText className="size-3" /> File
                                                                    </span>
                                                                )}
                                                                {assignment.allow_link && (
                                                                    <span className="inline-flex items-center gap-1 text-[10px] text-content-secondary">
                                                                        <LinkIcon className="size-3" /> Link
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-content-secondary">{assignment.assignable?.title ?? '-'}</span>
                                                        <span className="text-[10px] text-content-muted uppercase">
                                                            {(assignment.assignable_type === 'material' || assignment.assignable_type === 'App\\Models\\Material') 
                                                                ? 'Tingkat Materi' 
                                                                : 'Tingkat Modul'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="size-3.5 text-content-muted" />
                                                        <span className={`text-sm ${isOverdue(assignment.deadline) ? 'text-red-600' : 'text-content-secondary'}`}>
                                                            {formatDate(assignment.deadline)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="inline-flex items-center gap-1 text-sm text-content-secondary">
                                                        <Users className="size-3.5" />
                                                        {assignment.submissions_count ?? 0}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {assignment.pending_submissions_count > 0 ? (
                                                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                                                            {assignment.pending_submissions_count}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-content-muted">0</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <StatusBadge isPublished={assignment.is_published} isOverdue={isOverdue(assignment.deadline)} />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/instructor/submissions/assignment/${assignment.id}`}
                                                            className="inline-flex h-8 items-center justify-center rounded-lg bg-emerald-50 px-3 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                                                        >
                                                            <Eye className="mr-1.5 size-3.5" /> Submission
                                                        </Link>
                                                        <div className="relative">
                                                            <Button
                                                                variant="outline"
                                                                size="icon-sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenDropdown(openDropdown === assignment.id ? null : assignment.id);
                                                                }}
                                                                aria-label="Aksi lainnya"
                                                            >
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                            {openDropdown === assignment.id && (
                                                                <DropdownMenu
                                                                    assignment={assignment}
                                                                    onEdit={() => { setOpenDropdown(null); openModal(assignment); }}
                                                                    onToggle={() => { setOpenDropdown(null); togglePublish(assignment); }}
                                                                    onDelete={() => { setOpenDropdown(null); deleteAssignment(assignment.id); }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </div>
            </CourseWorkspaceLayout>

            {/* Assignment Form Modal */}
            <AssignmentFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                assignment={editingAssignment}
                modules={course.modules}
                showParentSelect={true}
            />
        </InstructorLayout>
    );
}


function StatusBadge({ isPublished, isOverdue }) {
    if (!isPublished) {
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-surface-muted text-content-secondary border border-line">
                Draft
            </span>
        );
    }
    if (isOverdue) {
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                Selesai
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            Aktif
        </span>
    );
}

function DropdownMenu({ assignment, onEdit, onToggle, onDelete }) {
    return (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-lg border py-1 z-50
            bg-surface border-line
            dark:bg-[#111a15] dark:border-white/[0.07]">
            <button onClick={onEdit} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-content-primary hover:bg-surface-muted dark:hover:bg-white/8">
                <Edit2 className="size-4" /> Edit
            </button>
            <button onClick={onToggle} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-content-primary hover:bg-surface-muted dark:hover:bg-white/8">
                {assignment.is_published ? (<><X className="size-4" /> Unpublish</>) : (<><CheckCircle2 className="size-4" /> Publish</>)}
            </button>
            <hr className="my-1 border-line-subtle" />
            <button onClick={onDelete} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                <Trash2 className="size-4" /> Hapus
            </button>
        </div>
    );
}
