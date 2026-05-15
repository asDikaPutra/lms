import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookPlus, Edit3, RefreshCw, Search } from 'lucide-react';
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
    const [editingCourse, setEditingCourse] = useState(null);
    const form = useForm(emptyForm);
    const filterForm = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    useEffect(() => {
        if (!editingCourse) {
            form.setData(emptyForm);
            return;
        }

        form.setData({
            code: editingCourse.code ?? '',
            name: editingCourse.name ?? '',
            description: editingCourse.description ?? '',
            semester: editingCourse.semester ?? '',
            enrollment_type: editingCourse.enrollment_type ?? 'auto',
            leaderboard_enabled: Boolean(editingCourse.leaderboard_enabled),
            is_active: Boolean(editingCourse.is_active),
            certificate_criteria: {
                min_progress: editingCourse.certificate_criteria?.min_progress ?? 100,
                min_score: editingCourse.certificate_criteria?.min_score ?? 70,
            },
        });
    }, [editingCourse]);

    const submitCourse = (event) => {
        event.preventDefault();

        if (editingCourse) {
            form.put(`/instructor/courses/${editingCourse.id}`, {
                preserveScroll: true,
                onSuccess: () => setEditingCourse(null),
            });
            return;
        }

        form.post('/instructor/courses', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const applyFilters = (event) => {
        event.preventDefault();
        router.get('/instructor/courses', filterForm.data, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <InstructorLayout title="Manajemen Kursus">
            <Head title="Manajemen Kursus Dosen" />

            <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
                <section aria-labelledby="course-list-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 id="course-list-title" className="text-lg font-semibold text-slate-950">
                                Kursus Saya
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">Kelola kursus, kode enroll, dan status publikasi.</p>
                        </div>
                        <form onSubmit={applyFilters} className="flex flex-col gap-2 md:flex-row" aria-label="Filter kursus dosen">
                            <label className="sr-only" htmlFor="course-search">
                                Cari kursus
                            </label>
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                                <input
                                    id="course-search"
                                    value={filterForm.data.search}
                                    onChange={(event) => filterForm.setData('search', event.target.value)}
                                    placeholder="Cari kursus"
                                    className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 md:w-56"
                                />
                            </div>
                            <label className="sr-only" htmlFor="course-status">
                                Status kursus
                            </label>
                            <select
                                id="course-status"
                                value={filterForm.data.status}
                                onChange={(event) => filterForm.setData('status', event.target.value)}
                                className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                            >
                                <option value="">Semua status</option>
                                <option value="active">Aktif</option>
                                <option value="inactive">Arsip</option>
                            </select>
                            <Button type="submit" className="h-10 bg-emerald-700 text-white hover:bg-emerald-800">
                                Filter
                            </Button>
                        </form>
                    </div>

                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[58rem] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="py-3 pr-4 font-medium">Kursus</th>
                                    <th className="py-3 pr-4 font-medium">Kode Enroll</th>
                                    <th className="py-3 pr-4 font-medium">Enrollment</th>
                                    <th className="py-3 pr-4 font-medium">Status</th>
                                    <th className="py-3 text-right font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {courses.data.map((course) => (
                                    <tr key={course.id}>
                                        <td className="py-4 pr-4">
                                            <p className="font-semibold text-slate-950">{course.name}</p>
                                            <p className="text-slate-500">{course.code} - {course.semester ?? 'Semester belum diatur'}</p>
                                        </td>
                                        <td className="py-4 pr-4 font-mono text-slate-700">{course.enroll_code}</td>
                                        <td className="py-4 pr-4 text-slate-600">
                                            {course.enrollment_type}, {course.active_enrollments_count} aktif, {course.pending_enrollments_count} pending
                                        </td>
                                        <td className="py-4 pr-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${course.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {course.is_active ? 'Aktif' : 'Arsip'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/instructor/courses/${course.id}`} className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                                    Builder
                                                </Link>
                                                <Button type="button" variant="outline" size="sm" onClick={() => setEditingCourse(course)}>
                                                    <Edit3 />
                                                    Edit
                                                </Button>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => router.patch(`/instructor/courses/${course.id}/regenerate-code`, {}, { preserveScroll: true })}>
                                                    <RefreshCw />
                                                    Kode
                                                </Button>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => router.patch(`/instructor/courses/${course.id}/toggle`, {}, { preserveScroll: true })}>
                                                    {course.is_active ? 'Arsipkan' : 'Aktifkan'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section aria-labelledby="course-form-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <BookPlus className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <h2 id="course-form-title" className="text-lg font-semibold text-slate-950">
                                {editingCourse ? 'Edit Kursus' : 'Buat Kursus'}
                            </h2>
                            <p className="text-sm text-slate-500">Data dasar dan aturan enrollment</p>
                        </div>
                    </div>

                    <form onSubmit={submitCourse} className="mt-5 space-y-4" aria-busy={form.processing}>
                        <Field label="Kode" id="code" error={form.errors.code}>
                            <input id="code" value={form.data.code} onChange={(event) => form.setData('code', event.target.value)} className="field" />
                        </Field>
                        <Field label="Nama Kursus" id="name" error={form.errors.name}>
                            <input id="name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="field" />
                        </Field>
                        <Field label="Deskripsi" id="description" error={form.errors.description}>
                            <textarea id="description" rows="3" value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="field h-auto py-2" />
                        </Field>
                        <Field label="Semester" id="semester" error={form.errors.semester}>
                            <input id="semester" value={form.data.semester} onChange={(event) => form.setData('semester', event.target.value)} className="field" />
                        </Field>
                        <Field label="Mode Enrollment" id="enrollment-type" error={form.errors.enrollment_type}>
                            <select id="enrollment-type" value={form.data.enrollment_type} onChange={(event) => form.setData('enrollment_type', event.target.value)} className="field">
                                <option value="auto">Auto</option>
                                <option value="manual">Manual approval</option>
                            </select>
                        </Field>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Field label="Minimal Progress" id="min-progress" error={form.errors['certificate_criteria.min_progress']}>
                                <input
                                    id="min-progress"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={form.data.certificate_criteria.min_progress}
                                    onChange={(event) => form.setData('certificate_criteria', { ...form.data.certificate_criteria, min_progress: event.target.value })}
                                    className="field"
                                />
                            </Field>
                            <Field label="Minimal Nilai" id="min-score" error={form.errors['certificate_criteria.min_score']}>
                                <input
                                    id="min-score"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={form.data.certificate_criteria.min_score}
                                    onChange={(event) => form.setData('certificate_criteria', { ...form.data.certificate_criteria, min_score: event.target.value })}
                                    className="field"
                                />
                            </Field>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input type="checkbox" checked={form.data.leaderboard_enabled} onChange={(event) => form.setData('leaderboard_enabled', event.target.checked)} className="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600" />
                            Leaderboard aktif
                        </label>
                        {editingCourse && (
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} className="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600" />
                                Kursus aktif
                            </label>
                        )}
                        <div className="flex gap-2">
                            <Button type="submit" className="bg-emerald-700 text-white hover:bg-emerald-800" disabled={form.processing}>
                                {form.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                            {editingCourse && (
                                <Button type="button" variant="outline" onClick={() => setEditingCourse(null)}>
                                    Batal
                                </Button>
                            )}
                        </div>
                    </form>
                </section>
            </div>
        </InstructorLayout>
    );
}

function Field({ label, id, error, children }) {
    const describedBy = error ? `${id}-error` : undefined;

    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium text-slate-700">
                {label}
            </label>
            <div className="mt-2">
                {cloneElement(children, {
                    'aria-describedby': describedBy,
                    'aria-invalid': Boolean(error),
                })}
            </div>
            {error && (
                <p id={describedBy} role="alert" className="mt-2 text-sm text-rose-600">
                    {error}
                </p>
            )}
        </div>
    );
}
