import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookOpen, Users, Layers3, ClipboardList, HelpCircle, ClipboardCheck, Edit2, CheckCircle2, X, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

import InstructorLayout from '@/Layouts/InstructorLayout';
import CourseWorkspaceLayout from '@/components/instructor/CourseWorkspaceLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Modal } from '@/components/ui/modal';
import { TextField, TextArea, SelectField, CheckboxField } from '@/components/ui/text-field';

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
                        <StatCard icon={Users} label="Mahasiswa Aktif" value={course.active_enrollments_count} color="emerald" />
                        <StatCard icon={Layers3} label="Total Modul" value={course.modules?.length ?? 0} color="teal" />
                        <StatCard icon={HelpCircle} label="Total Kuis" value={totalQuizzes} color="blue" />
                        <StatCard icon={ClipboardList} label="Total Tugas" value={totalAssignments} color="purple" />
                    </div>

                    {/* Course Info Card */}
                    <Card>
                        <CardContent className="pt-5">
                        <h2 className="text-lg font-semibold mb-4 text-content-primary">Informasi Kursus</h2>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                            <InfoRow label="Kode Kursus" value={course.code} />
                            <InfoRow label="Semester" value={course.semester || '-'} />
                            <InfoRow label="Mode Enrollment" value={course.enrollment_type === 'auto' ? 'Otomatis' : 'Manual (Approval)'} />
                            <InfoRow label="Kode Enroll" value={course.enroll_code} mono />
                            <InfoRow label="Leaderboard" value={course.leaderboard_enabled ? 'Aktif' : 'Nonaktif'} />
                            <InfoRow label="Status" value={course.is_active ? 'Aktif' : 'Arsip'} />
                        </div>

                        {course.description && (
                            <div className="mt-4 pt-4 border-t border-line-subtle">
                                <p className="text-sm font-medium mb-1 text-content-secondary">Deskripsi</p>
                                <p className="text-sm text-content-secondary">{course.description}</p>
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-line-subtle">
                            <p className="text-sm font-medium mb-2 text-content-secondary">Kriteria Sertifikat</p>
                            <div className="flex gap-4 text-sm">
                                <span className="text-content-secondary">
                                    Min. Progress: <strong>{course.certificate_criteria?.min_progress ?? 100}%</strong>
                                </span>
                                <span className="text-content-secondary">
                                    Min. Nilai Kuis: <strong>{course.certificate_criteria?.min_score ?? 70}</strong>
                                </span>
                            </div>
                        </div>
                    </CardContent>
                    </Card>

                    {/* Pending Enrollments */}
                    {course.pending_enrollments_count > 0 && (
                        <Card variant="tinted" className="border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30">
                            <CardContent className="pt-5">
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
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Access to Curriculum */}
                    <Card variant="tinted" className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 dark:border-emerald-500/30">
                        <CardContent className="pt-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
                                    <Layers3 className="size-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-content-primary">Struktur Kurikulum</h3>
                                    <p className="text-sm text-content-secondary">Kelola modul, materi, konten, kuis, dan tugas</p>
                                </div>
                            </div>
                            <Link href={`/instructor/courses/${course.id}/curriculum`}>
                                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25">
                                    <Layers3 className="mr-2 size-4" />
                                    Kelola Struktur Kurikulum
                                </Button>
                            </Link>
                        </div>
                        </CardContent>
                    </Card>
                </div>
            </CourseWorkspaceLayout>

            {/* Edit Modal */}
            <Modal open={isEditModalOpen} onClose={closeEditModal} title="Edit Informasi Kursus">
                <form onSubmit={submitEdit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                            label="Kode Kursus"
                            id="code"
                            value={form.data.code}
                            onChange={(e) => form.setData('code', e.target.value)}
                            placeholder="Contoh: IF101"
                            error={form.errors.code}
                        />
                        <TextField
                            label="Semester"
                            id="semester"
                            value={form.data.semester}
                            onChange={(e) => form.setData('semester', e.target.value)}
                            placeholder="Contoh: Genap 2026"
                            error={form.errors.semester}
                        />
                    </div>

                    <TextField
                        label="Nama Kursus"
                        id="name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="Contoh: Pengantar Informatika"
                        error={form.errors.name}
                    />

                    <TextArea
                        label="Deskripsi"
                        id="description"
                        rows="3"
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        placeholder="Penjelasan singkat mengenai kursus ini"
                        error={form.errors.description}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <SelectField
                            label="Mode Enrollment"
                            id="enrollment-type"
                            value={form.data.enrollment_type}
                            onChange={(e) => form.setData('enrollment_type', e.target.value)}
                            error={form.errors.enrollment_type}
                        >
                            <option value="auto">Otomatis (Auto)</option>
                            <option value="manual">Manual (Approval)</option>
                        </SelectField>
                        <div className="flex flex-col justify-end pb-2 gap-2">
                            <CheckboxField
                                label="Leaderboard aktif"
                                checked={form.data.leaderboard_enabled}
                                onChange={(e) => form.setData('leaderboard_enabled', e.target.checked)}
                            />
                            <CheckboxField
                                label="Kursus aktif"
                                checked={form.data.is_active}
                                onChange={(e) => form.setData('is_active', e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg p-4 border
                        bg-surface-muted border-line
                        dark:bg-white/5 dark:border-white/[0.07]">
                        <p className="text-sm font-semibold mb-3 text-content-primary">Kriteria Sertifikat</p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField
                                label="Min. Progress (%)"
                                id="min-progress"
                                type="number"
                                min="0"
                                max="100"
                                value={form.data.certificate_criteria.min_progress}
                                onChange={(e) => form.setData('certificate_criteria', { ...form.data.certificate_criteria, min_progress: e.target.value })}
                                error={form.errors['certificate_criteria.min_progress']}
                            />
                            <TextField
                                label="Min. Nilai Kuis"
                                id="min-score"
                                type="number"
                                min="0"
                                max="100"
                                value={form.data.certificate_criteria.min_score}
                                onChange={(e) => form.setData('certificate_criteria', { ...form.data.certificate_criteria, min_score: e.target.value })}
                                error={form.errors['certificate_criteria.min_score']}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <Button type="button" variant="outline" onClick={closeEditModal}>Batal</Button>
                        <Button type="submit" disabled={form.processing} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                            <CheckCircle2 className="mr-1.5 size-4" /> Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </Modal>
        </InstructorLayout>
    );
}

function InfoRow({ label, value, mono = false }) {
    return (
        <div>
            <p className="text-sm font-medium text-content-secondary">{label}</p>
            <p className={`text-sm text-content-primary ${mono ? 'font-mono' : ''}`}>{value}</p>
        </div>
    );
}
