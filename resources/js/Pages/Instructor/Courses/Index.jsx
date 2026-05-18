import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookPlus, Edit3, RefreshCw, Search, Trash2, X, Plus, BookOpen, Layers3, CheckCircle2 } from 'lucide-react';
import { cloneElement, useEffect, useState } from 'react';

import InstructorLayout from '@/Layouts/InstructorLayout';
import { Button } from '@/components/ui/button';

const emptyForm = {
    code: '',
    name: '',
    description: '',
    semester: '',
    enrollment_type: 'auto',
    leaderboard_enabled: false,
    certificate_criteria: {
        min_progress: 100,
        min_score: 70,
    },
};

export default function Index({ courses, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const form = useForm(emptyForm);
    const filterForm = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    const openModal = (course = null) => {
        if (course) {
            setEditingCourse(course);
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
        } else {
            setEditingCourse(null);
            form.reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
        form.reset();
        form.clearErrors();
    };

    const submitCourse = (event) => {
        event.preventDefault();

        if (editingCourse) {
            form.put(`/instructor/courses/${editingCourse.id}`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
            return;
        }

        form.post('/instructor/courses', {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const deleteCourse = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kursus ini? Semua data terkait akan ikut terhapus.')) {
            router.delete(`/instructor/courses/${id}`, { preserveScroll: true });
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get('/instructor/courses', filterForm.data, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [filterForm.data]);

    return (
        <InstructorLayout title="Manajemen Kursus">
            <Head title="Manajemen Kursus" />

            <div className="w-full tracking-[-0.01em]">
                <section aria-labelledby="course-list-title" className="rounded-[10px] bg-white p-4 lg:p-5 shadow-[0_0_0.5px_rgba(0,0,0,0.14),_0_1px_1px_rgba(0,0,0,0.24)]">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#edebe9] pb-4">
                        <div>
                            <h2 id="course-list-title" className="text-[18px] font-semibold text-sb-text-black tracking-[-0.16px]">
                                Kursus Anda
                            </h2>
                            <p className="mt-0.5 text-[12px] text-sb-text-soft">Kelola daftar kursus, pendaftaran, dan kurikulum.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2" aria-label="Filter kursus">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-sb-text-soft" aria-hidden="true" />
                                    <input
                                        id="course-search"
                                        value={filterForm.data.search}
                                        onChange={(event) => filterForm.setData('search', event.target.value)}
                                        placeholder="Cari kursus..."
                                        className="h-[36px] w-full rounded-[6px] border border-[#d6dbde] pl-8 pr-3 text-[13px] outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent md:w-48"
                                    />
                                </div>
                                <select
                                    id="course-status"
                                    value={filterForm.data.status}
                                    onChange={(event) => filterForm.setData('status', event.target.value)}
                                    className="h-[36px] rounded-[6px] border border-[#d6dbde] px-3 py-0 text-[13px] outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Arsip</option>
                                </select>
                            </div>
                            <Button onClick={() => openModal()} size="sm" className="h-[36px]">
                                <Plus className="mr-1.5 size-4" /> Tambah Kursus
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-[50rem] text-left text-[13px]">
                            <thead>
                                <tr className="border-b border-[#edebe9] text-sb-text-soft">
                                    <th className="py-2.5 pr-4 font-medium">Informasi Kursus</th>
                                    <th className="py-2.5 pr-4 font-medium">Kode Enroll</th>
                                    <th className="py-2.5 pr-4 font-medium">Enrollment</th>
                                    <th className="py-2.5 pr-4 font-medium">Status</th>
                                    <th className="py-2.5 text-right font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#edebe9]">
                                {courses.data.map((course) => (
                                    <tr key={course.id} className="transition-colors hover:bg-slate-50">
                                        <td className="py-3 pr-4">
                                            <p className="font-semibold text-sb-text-black">{course.name}</p>
                                            <p className="text-[12px] text-sb-text-soft uppercase tracking-[0.05em] mt-0.5">{course.code} &bull; {course.semester ?? 'TIDAK ADA SMT'}</p>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className="font-mono bg-[#f9f9f9] border border-[#edebe9] rounded-[4px] px-2 py-0.5 text-sb-text-black">{course.enroll_code}</span>
                                        </td>
                                        <td className="py-3 pr-4 text-sb-text-soft text-[12px]">
                                            <span className="capitalize">{course.enrollment_type}</span> &bull; {course.active_enrollments_count} aktif, {course.pending_enrollments_count} pending
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className={`inline-block rounded-pill px-2.5 py-0.5 text-[11px] font-medium border ${course.is_active ? 'bg-sb-light border-sb-light text-sb-green' : 'bg-white border-[#edebe9] text-sb-text-soft'}`}>
                                                {course.is_active ? 'Aktif' : 'Arsip'}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right">
                                            <div className="flex justify-end gap-1.5 items-center">
                                                <Link href={`/instructor/courses/${course.id}`} className="inline-flex h-[28px] items-center justify-center rounded-[6px] border border-sb-green bg-sb-light/30 px-2.5 text-[11px] font-semibold text-sb-green hover:bg-sb-light transition-colors">
                                                    <Layers3 className="mr-1.5 size-3.5" /> Builder
                                                </Link>
                                                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-sb-text-black hover:bg-sb-light/30" onClick={() => openModal(course)}>
                                                    <Edit3 className="mr-1.5 size-3.5" /> Edit
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-sb-text-soft hover:text-sb-text-black hover:bg-slate-50" onClick={() => router.patch(`/instructor/courses/${course.id}/regenerate-code`, {}, { preserveScroll: true })}>
                                                    <RefreshCw className="mr-1.5 size-3.5" /> Kode
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" className={`h-[28px] px-2.5 text-[11px] font-medium border-[#edebe9] ${course.is_active ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-sb-green hover:text-sb-green hover:bg-sb-light'}`} onClick={() => router.patch(`/instructor/courses/${course.id}/toggle`, {}, { preserveScroll: true })}>
                                                    {course.is_active ? 'Arsip' : 'Aktif'}
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteCourse(course.id)}>
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] tracking-[-0.01em]">
                    <div className="w-full max-w-lg rounded-[12px] bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200" role="dialog" aria-modal="true">
                        <div className="flex items-center justify-between border-b border-[#edebe9] px-5 py-4">
                            <h3 className="text-[16px] font-semibold text-sb-text-black">
                                {editingCourse ? 'Edit Kursus' : 'Buat Kursus Baru'}
                            </h3>
                            <button onClick={closeModal} className="rounded-full p-1 text-sb-text-soft hover:bg-[#f9f9f9] hover:text-sb-text-black transition-colors">
                                <X className="size-5" />
                            </button>
                        </div>
                        <div className="p-5 max-h-[85vh] overflow-y-auto">
                            <form onSubmit={submitCourse} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Kode Kursus" id="code" error={form.errors.code}>
                                        <input id="code" value={form.data.code} onChange={(event) => form.setData('code', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" placeholder="Contoh: IF101" />
                                    </Field>
                                    <Field label="Semester" id="semester" error={form.errors.semester}>
                                        <input id="semester" value={form.data.semester} onChange={(event) => form.setData('semester', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" placeholder="Contoh: Genap 2026" />
                                    </Field>
                                </div>

                                <Field label="Nama Kursus" id="name" error={form.errors.name}>
                                    <input id="name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" placeholder="Contoh: Pengantar Informatika" />
                                </Field>

                                <Field label="Deskripsi" id="description" error={form.errors.description}>
                                    <textarea id="description" rows="3" value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" placeholder="Penjelasan singkat mengenai kursus ini" />
                                </Field>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Mode Enrollment" id="enrollment-type" error={form.errors.enrollment_type}>
                                        <select id="enrollment-type" value={form.data.enrollment_type} onChange={(event) => form.setData('enrollment_type', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent">
                                            <option value="auto">Otomatis (Auto)</option>
                                            <option value="manual">Manual (Approval)</option>
                                        </select>
                                    </Field>
                                    <div className="flex flex-col justify-end pb-2">
                                        <label className="flex items-center gap-2 text-[13px] text-sb-text-black cursor-pointer">
                                            <input type="checkbox" checked={form.data.leaderboard_enabled} onChange={(event) => form.setData('leaderboard_enabled', event.target.checked)} className="size-4 rounded border-[#d6dbde] text-sb-accent focus:ring-sb-accent" />
                                            Leaderboard aktif
                                        </label>
                                    </div>
                                </div>

                                <div className="rounded-[8px] bg-[#f9f9f9] p-3 border border-[#edebe9]">
                                    <p className="text-[12px] font-semibold text-sb-text-black mb-3">Kriteria Sertifikat</p>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field label="Min. Progress (%)" id="min-progress" error={form.errors['certificate_criteria.min_progress']}>
                                            <input
                                                id="min-progress"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={form.data.certificate_criteria.min_progress}
                                                onChange={(event) => form.setData('certificate_criteria', { ...form.data.certificate_criteria, min_progress: event.target.value })}
                                                className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-1.5 text-[13px] text-sb-text-black"
                                            />
                                        </Field>
                                        <Field label="Min. Nilai Kuis" id="min-score" error={form.errors['certificate_criteria.min_score']}>
                                            <input
                                                id="min-score"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={form.data.certificate_criteria.min_score}
                                                onChange={(event) => form.setData('certificate_criteria', { ...form.data.certificate_criteria, min_score: event.target.value })}
                                                className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-1.5 text-[13px] text-sb-text-black"
                                            />
                                        </Field>
                                    </div>
                                </div>

                                {editingCourse && (
                                    <label className="flex items-center gap-2 text-[13px] text-sb-text-black cursor-pointer">
                                        <input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} className="size-4 rounded border-[#d6dbde] text-sb-accent focus:ring-sb-accent" />
                                        Kursus aktif (Publik)
                                    </label>
                                )}

                                <div className="flex justify-end gap-3 pt-3">
                                    <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                                    <Button type="submit" disabled={form.processing} className="px-6">
                                        <CheckCircle2 className="mr-1.5 size-4" /> {editingCourse ? 'Simpan Perubahan' : 'Buat Kursus'}
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

function Field({ label, id, error, children }) {
    const describedBy = error ? `${id}-error` : undefined;

    return (
        <div>
            <label htmlFor={id} className="text-[12px] font-semibold text-sb-text-black mb-1.5 block">
                {label}
            </label>
            <div>
                {cloneElement(children, {
                    'aria-describedby': describedBy,
                    'aria-invalid': Boolean(error),
                })}
            </div>
            {error && (
                <p id={describedBy} role="alert" className="mt-1.5 text-[11px] text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
