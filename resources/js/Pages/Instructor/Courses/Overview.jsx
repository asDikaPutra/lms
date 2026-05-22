import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookOpen, Users, Layers3, ClipboardList, HelpCircle, ClipboardCheck, Edit2, CheckCircle2, X, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { cloneElement, useState } from 'react';
import { motion } from 'framer-motion';

import InstructorLayout from '@/Layouts/InstructorLayout';
import CourseWorkspaceLayout from '@/components/instructor/CourseWorkspaceLayout';
import { Button } from '@/components/ui/button';

export default function Overview({ course }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const form = useForm({
        code: course.code ?? '',
        name: course.name ?? '',
        description: course.description ?? '',
        semester: course.semester ?? '',
        enrollment_type: course.enrollment_type ?? 'auto',
        leaderboard_enabled: Boolean(course.leaderboard_enabled),
        is_active: Boolean(course.is_active),
        certificate_criteria: {
            min_progress: course.certificate_criteria?.min_progress ?? 100,
            min_score: course.certificate_criteria?.min_score ?? 70,
        },
    });

    const openEditModal = () => {
        form.setData({
            code: course.code ?? '',
            name: course.name ?? '',
            description: course.description ?? '',
            semester: course.semester ?? '',
            enrollment_type: course.enrollment_type ?? 'auto',
            leaderboard_enabled: Boolean(course.leaderboard_enabled),
            is_active: Boolean(course.is_active),
            certificate_criteria: {
                min_progress: course.certificate_criteria?.min_progress ?? 100,
                min_score: course.certificate_criteria?.min_score ?? 70,
            },
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        form.clearErrors();
    };

    const submitEdit = (event) => {
        event.preventDefault();
        form.put(`/instructor/courses/${course.id}`, {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
        });
    };

    const regenerateCode = () => {
        router.patch(`/instructor/courses/${course.id}/regenerate-code`, {}, { preserveScroll: true });
    };

    const toggleStatus = () => {
        router.patch(`/instructor/courses/${course.id}/toggle`, {}, { preserveScroll: true });
    };

    // Calculate stats
    const totalQuizzes = course.modules?.reduce((acc, m) => {
        const moduleQuizzes = m.quizzes?.length ?? 0;
        const materialQuizzes = m.materials?.reduce((a, mat) => a + (mat.quizzes?.length ?? 0), 0) ?? 0;
        return acc + moduleQuizzes + materialQuizzes;
    }, 0) ?? 0;

    const totalAssignments = course.modules?.reduce((acc, m) => {
        const moduleAssignments = m.assignments?.length ?? 0;
        const materialAssignments = m.materials?.reduce((a, mat) => a + (mat.assignments?.length ?? 0), 0) ?? 0;
        return acc + moduleAssignments + materialAssignments;
    }, 0) ?? 0;

    return (
        <InstructorLayout title={`${course.name} - Ringkasan`}>
            <Head title={`${course.name} - Ringkasan`} />

            <CourseWorkspaceLayout course={course}>
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={openEditModal} variant="outline" className="gap-2">
                            <Edit2 className="size-4" />
                            Edit Informasi Kursus
                        </Button>
                        <Button onClick={regenerateCode} variant="outline" className="gap-2">
                            <RefreshCw className="size-4" />
                            Generate Ulang Kode Enroll
                        </Button>
                        <Button 
                            onClick={toggleStatus} 
                            variant="outline" 
                            className={`gap-2 ${course.is_active ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'}`}
                        >
                            {course.is_active ? <ToggleRight className="size-4" /> : <ToggleLeft className="size-4" />}
                            {course.is_active ? 'Arsipkan Kursus' : 'Aktifkan Kursus'}
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            icon={Users}
                            label="Mahasiswa Aktif"
                            value={course.active_enrollments_count}
                            color="emerald"
                        />
                        <StatCard
                            icon={Layers3}
                            label="Total Modul"
                            value={course.modules?.length ?? 0}
                            color="teal"
                        />
                        <StatCard
                            icon={HelpCircle}
                            label="Total Kuis"
                            value={totalQuizzes}
                            color="blue"
                        />
                        <StatCard
                            icon={ClipboardList}
                            label="Total Tugas"
                            value={totalAssignments}
                            color="purple"
                        />
                    </div>

                    {/* Course Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl shadow-sm border p-6
                            bg-white border-neutral-100
                            dark:bg-[#111a15] dark:border-white/[0.07]"
                    >
                        <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white/90">Informasi Kursus</h2>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                            <InfoRow label="Kode Kursus" value={course.code} />
                            <InfoRow label="Semester" value={course.semester || '-'} />
                            <InfoRow label="Mode Enrollment" value={course.enrollment_type === 'auto' ? 'Otomatis' : 'Manual (Approval)'} />
                            <InfoRow label="Kode Enroll" value={course.enroll_code} mono />
                            <InfoRow label="Leaderboard" value={course.leaderboard_enabled ? 'Aktif' : 'Nonaktif'} />
                            <InfoRow label="Status" value={course.is_active ? 'Aktif' : 'Arsip'} />
                        </div>

                        {course.description && (
                            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-white/[0.07]">
                                <p className="text-sm font-medium mb-1 text-neutral-500 dark:text-white/40">Deskripsi</p>
                                <p className="text-sm text-neutral-700 dark:text-white/60">{course.description}</p>
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-white/[0.07]">
                            <p className="text-sm font-medium mb-2 text-neutral-500 dark:text-white/40">Kriteria Sertifikat</p>
                            <div className="flex gap-4 text-sm">
                                <span className="text-neutral-700 dark:text-white/60">
                                    Min. Progress: <strong>{course.certificate_criteria?.min_progress ?? 100}%</strong>
                                </span>
                                <span className="text-neutral-700 dark:text-white/60">
                                    Min. Nilai Kuis: <strong>{course.certificate_criteria?.min_score ?? 70}</strong>
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Pending Enrollments */}
                    {course.pending_enrollments_count > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-xl border p-6
                                bg-amber-50 border-amber-200
                                dark:bg-amber-500/10 dark:border-amber-500/30"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/20">
                                    <ClipboardCheck className="size-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-amber-900 dark:text-amber-300">Pendaftaran Menunggu Persetujuan</h3>
                                    <p className="text-sm text-amber-700 dark:text-amber-400/80">{course.pending_enrollments_count} mahasiswa menunggu persetujuan</p>
                                </div>
                            </div>
                            <Link href={`/instructor/courses/${course.id}/students`}>
                                <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-500/40 dark:text-amber-400 dark:hover:bg-amber-500/15">
                                    Kelola Pendaftaran
                                </Button>
                            </Link>
                        </motion.div>
                    )}

                    {/* Quick Access to Curriculum */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-xl border p-6
                            bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200
                            dark:from-emerald-500/10 dark:to-teal-500/10 dark:border-emerald-500/30"
                    >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
                                    <Layers3 className="size-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-900 dark:text-white/90">Struktur Kurikulum</h3>
                                    <p className="text-sm text-neutral-600 dark:text-white/45">Kelola modul, materi, konten, kuis, dan tugas</p>
                                </div>
                            </div>
                            <Link href={`/instructor/courses/${course.id}/curriculum`}>
                                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25">
                                    <Layers3 className="mr-2 size-4" />
                                    Kelola Struktur Kurikulum
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </CourseWorkspaceLayout>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
                    <div className="w-full max-w-lg rounded-xl shadow-xl ring-1 animate-in fade-in zoom-in-95 duration-200
                        bg-white ring-black/5
                        dark:bg-[#111a15] dark:ring-white/10"
                        role="dialog" aria-modal="true">
                        <div className="flex items-center justify-between border-b px-5 py-4
                            border-neutral-200 dark:border-white/[0.07]">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white/90">
                                Edit Informasi Kursus
                            </h3>
                            <button onClick={closeEditModal} className="rounded-full p-1 transition-colors
                                text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600
                                dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white/70">
                                <X className="size-5" />
                            </button>
                        </div>
                        <div className="p-5 max-h-[85vh] overflow-y-auto">
                            <form onSubmit={submitEdit} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Kode Kursus" id="code" error={form.errors.code}>
                                        <input id="code" value={form.data.code} onChange={(e) => form.setData('code', e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm outline-none
                                            border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                                            dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" placeholder="Contoh: IF101" />
                                    </Field>
                                    <Field label="Semester" id="semester" error={form.errors.semester}>
                                        <input id="semester" value={form.data.semester} onChange={(e) => form.setData('semester', e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm outline-none
                                            border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                                            dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" placeholder="Contoh: Genap 2026" />
                                    </Field>
                                </div>

                                <Field label="Nama Kursus" id="name" error={form.errors.name}>
                                    <input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm outline-none
                                        border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                                        dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" placeholder="Contoh: Pengantar Informatika" />
                                </Field>

                                <Field label="Deskripsi" id="description" error={form.errors.description}>
                                    <textarea id="description" rows="3" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm outline-none
                                        border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                                        dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" placeholder="Penjelasan singkat mengenai kursus ini" />
                                </Field>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Mode Enrollment" id="enrollment-type" error={form.errors.enrollment_type}>
                                        <select id="enrollment-type" value={form.data.enrollment_type} onChange={(e) => form.setData('enrollment_type', e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm outline-none
                                            border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                                            dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:focus:border-emerald-500/60">
                                            <option value="auto">Otomatis (Auto)</option>
                                            <option value="manual">Manual (Approval)</option>
                                        </select>
                                    </Field>
                                    <div className="flex flex-col justify-end pb-2 gap-2">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer text-neutral-700 dark:text-white/60">
                                            <input type="checkbox" checked={form.data.leaderboard_enabled} onChange={(e) => form.setData('leaderboard_enabled', e.target.checked)} className="size-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500" />
                                            Leaderboard aktif
                                        </label>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer text-neutral-700 dark:text-white/60">
                                            <input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} className="size-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500" />
                                            Kursus aktif
                                        </label>
                                    </div>
                                </div>

                                <div className="rounded-lg p-4 border
                                    bg-neutral-50 border-neutral-200
                                    dark:bg-white/5 dark:border-white/[0.07]">
                                    <p className="text-sm font-semibold mb-3 text-neutral-700 dark:text-white/70">Kriteria Sertifikat</p>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field label="Min. Progress (%)" id="min-progress" error={form.errors['certificate_criteria.min_progress']}>
                                            <input id="min-progress" type="number" min="0" max="100" value={form.data.certificate_criteria.min_progress} onChange={(e) => form.setData('certificate_criteria', { ...form.data.certificate_criteria, min_progress: e.target.value })}
                                                className="w-full rounded-lg border px-3 py-2 text-sm outline-none
                                                    border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                                                    dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:focus:border-emerald-500/60" />
                                        </Field>
                                        <Field label="Min. Nilai Kuis" id="min-score" error={form.errors['certificate_criteria.min_score']}>
                                            <input id="min-score" type="number" min="0" max="100" value={form.data.certificate_criteria.min_score} onChange={(e) => form.setData('certificate_criteria', { ...form.data.certificate_criteria, min_score: e.target.value })}
                                                className="w-full rounded-lg border px-3 py-2 text-sm outline-none
                                                    border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                                                    dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:focus:border-emerald-500/60" />
                                        </Field>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-3">
                                    <Button type="button" variant="outline" onClick={closeEditModal}>Batal</Button>
                                    <Button type="submit" disabled={form.processing} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                        <CheckCircle2 className="mr-1.5 size-4" /> Simpan Perubahan
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </InstructorLayout>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    const colorClasses = {
        emerald: 'from-emerald-500 to-teal-500 shadow-emerald-500/25',
        teal: 'from-teal-500 to-cyan-500 shadow-teal-500/25',
        blue: 'from-blue-500 to-indigo-500 shadow-blue-500/25',
        purple: 'from-purple-500 to-pink-500 shadow-purple-500/25',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl shadow-sm border p-5
                bg-white border-neutral-100
                dark:bg-[#111a15] dark:border-white/[0.07]"
        >
            <div className="flex items-center gap-4">
                <div className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
                    <Icon className="size-6 text-white" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white/90">{value}</p>
                    <p className="text-sm text-neutral-500 dark:text-white/40">{label}</p>
                </div>
            </div>
        </motion.div>
    );
}

function InfoRow({ label, value, mono = false }) {
    return (
        <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-white/40">{label}</p>
            <p className={`text-sm text-neutral-900 dark:text-white/80 ${mono ? 'font-mono' : ''}`}>{value}</p>
        </div>
    );
}

function Field({ label, id, error, children }) {
    const describedBy = error ? `${id}-error` : undefined;
    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium mb-1.5 block text-neutral-700 dark:text-white/70">
                {label}
            </label>
            <div>
                {cloneElement(children, { 'aria-describedby': describedBy, 'aria-invalid': Boolean(error) })}
            </div>
            {error && <p id={describedBy} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
