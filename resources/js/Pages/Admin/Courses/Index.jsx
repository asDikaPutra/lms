import { Head, router, useForm } from '@inertiajs/react';
import { Archive, BookOpen, Download, Edit3, Search } from 'lucide-react';
import { cloneElement, useEffect, useState } from 'react';

import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Index({ courses, filters, instructors }) {
    const [editingCourse, setEditingCourse] = useState(null);
    const form = useForm({
        instructor_id: '',
        semester: '',
        leaderboard_enabled: false,
    });
    const filterForm = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    useEffect(() => {
        if (!editingCourse) {
            form.setData({
                instructor_id: '',
                semester: '',
                leaderboard_enabled: false,
            });
            return;
        }

        form.setData({
            instructor_id: String(editingCourse.instructor_id ?? ''),
            semester: editingCourse.semester ?? '',
            leaderboard_enabled: Boolean(editingCourse.leaderboard_enabled),
        });
    }, [editingCourse]);

    const applyFilters = (event) => {
        event.preventDefault();
        router.get('/admin/courses', filterForm.data, {
            preserveState: true,
            replace: true,
        });
    };

    const submitCourse = (event) => {
        event.preventDefault();

        if (!editingCourse) {
            return;
        }

        form.put(`/admin/courses/${editingCourse.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditingCourse(null),
        });
    };

    return (
        <AdminLayout title="Manajemen Kursus">
            <Head title="Manajemen Kursus" />

            <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Daftar Kursus</CardTitle>
                                <CardDescription className="mt-1">Pantau dosen, status kelas, dan jumlah peserta aktif.</CardDescription>
                            </div>
                            <div className="flex flex-col gap-2 md:flex-row">
                            <form onSubmit={applyFilters} className="flex flex-col gap-2 md:flex-row" aria-label="Filter kursus">
                                <label className="sr-only" htmlFor="course-search">
                                    Cari kursus
                                </label>
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-muted" aria-hidden="true" />
                                    <input
                                        id="course-search"
                                        value={filterForm.data.search}
                                        onChange={(event) => filterForm.setData('search', event.target.value)}
                                        placeholder="Cari kode/nama"
                                        className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-content-primary placeholder:text-content-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 md:w-56"
                                    />
                                </div>
                                <label className="sr-only" htmlFor="course-status">
                                    Status kursus
                                </label>
                                <select
                                    id="course-status"
                                    value={filterForm.data.status}
                                    onChange={(event) => filterForm.setData('status', event.target.value)}
                                    className="h-10 rounded-lg border border-line bg-surface px-3 text-sm text-content-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                                >
                                    <option value="">Semua status</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Arsip</option>
                                </select>
                                <Button type="submit" className="h-10">
                                    Filter
                                </Button>
                            </form>
                            <a
                                href="/admin/reports/courses.csv"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-content-primary transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand/20"
                            >
                                <Download className="size-4" aria-hidden="true" />
                                Export
                            </a>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[56rem] text-left text-sm">
                            <thead>
                                <tr className="border-b border-line text-content-secondary">
                                    <th className="py-3 pr-4 font-medium">Kursus</th>
                                    <th className="py-3 pr-4 font-medium">Dosen</th>
                                    <th className="py-3 pr-4 font-medium">Semester</th>
                                    <th className="py-3 pr-4 font-medium">Peserta</th>
                                    <th className="py-3 pr-4 font-medium">Status</th>
                                    <th className="py-3 text-right font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line-subtle">
                                {courses.data.map((course) => (
                                    <tr key={course.id}>
                                        <td className="py-4 pr-4">
                                            <p className="font-semibold text-content-primary">{course.name}</p>
                                            <p className="text-content-secondary">{course.code}</p>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <p className="font-medium text-content-primary">{course.instructor?.name ?? '-'}</p>
                                            <p className="text-content-secondary">{course.instructor?.email ?? ''}</p>
                                        </td>
                                        <td className="py-4 pr-4 text-content-secondary">{course.semester ?? '-'}</td>
                                        <td className="py-4 pr-4 text-content-secondary">
                                            {course.active_enrollments_count} aktif, {course.modules_count} modul
                                        </td>
                                        <td className="py-4 pr-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${course.is_active ? 'bg-success-subtle text-success' : 'bg-surface-muted text-content-secondary'}`}>
                                                {course.is_active ? 'Aktif' : 'Arsip'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button type="button" variant="outline" size="sm" onClick={() => setEditingCourse(course)}>
                                                    <Edit3 />
                                                    Edit
                                                </Button>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => router.patch(`/admin/courses/${course.id}/toggle`, {}, { preserveScroll: true })}>
                                                    <Archive />
                                                    {course.is_active ? 'Arsipkan' : 'Aktifkan'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-brand-subtle text-brand">
                            <BookOpen className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <CardTitle>Edit Kursus</CardTitle>
                            <CardDescription>{editingCourse ? editingCourse.name : 'Pilih kursus dari tabel'}</CardDescription>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <form onSubmit={submitCourse} className="space-y-4" aria-busy={form.processing}>
                        <Field label="Dosen Pengampu" id="instructor-id" error={form.errors.instructor_id}>
                            <select id="instructor-id" value={form.data.instructor_id} onChange={(event) => form.setData('instructor_id', event.target.value)} className="field" disabled={!editingCourse}>
                                <option value="">Pilih dosen</option>
                                {instructors.map((instructor) => (
                                    <option key={instructor.id} value={instructor.id}>
                                        {instructor.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Semester" id="semester" error={form.errors.semester}>
                            <input id="semester" value={form.data.semester} onChange={(event) => form.setData('semester', event.target.value)} className="field" disabled={!editingCourse} />
                        </Field>
                        <label className="flex items-center gap-2 text-sm text-content-secondary">
                            <input
                                type="checkbox"
                                checked={form.data.leaderboard_enabled}
                                onChange={(event) => form.setData('leaderboard_enabled', event.target.checked)}
                                className="size-4 rounded border-line text-brand accent-brand focus:ring-brand/30"
                                disabled={!editingCourse}
                            />
                            Leaderboard aktif
                        </label>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={!editingCourse || form.processing}>
                                {form.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                            {editingCourse && (
                                <Button type="button" variant="outline" onClick={() => setEditingCourse(null)}>
                                    Batal
                                </Button>
                            )}
                        </div>
                    </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

function Field({ label, id, error, children }) {
    const describedBy = error ? `${id}-error` : undefined;

    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium text-content-primary">
                {label}
            </label>
            <div className="mt-2">
                {cloneElement(children, {
                    'aria-describedby': describedBy,
                    'aria-invalid': Boolean(error),
                })}
            </div>
            {error && (
                <p id={describedBy} role="alert" className="mt-2 text-sm text-danger">
                    {error}
                </p>
            )}
        </div>
    );
}
