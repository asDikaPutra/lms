import { Head, router, useForm } from '@inertiajs/react';
import { Edit3, Search, Upload, UserPlus } from 'lucide-react';
import { cloneElement, useEffect, useState } from 'react';

import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const emptyForm = {
    name: '',
    email: '',
    password: '',
    role: 'student',
    nim: '',
    nidn: '',
    is_active: true,
};

export default function Index({ users, filters, stats }) {
    const [editingUser, setEditingUser] = useState(null);
    const form = useForm(emptyForm);
    const filterForm = useForm({
        search: filters.search ?? '',
        role: filters.role ?? '',
        status: filters.status ?? '',
    });
    const importForm = useForm({
        file: null,
    });

    useEffect(() => {
        if (!editingUser) {
            form.setData(emptyForm);
            return;
        }

        form.setData({
            name: editingUser.name ?? '',
            email: editingUser.email ?? '',
            password: '',
            role: editingUser.role ?? 'student',
            nim: editingUser.nim ?? '',
            nidn: editingUser.nidn ?? '',
            is_active: Boolean(editingUser.is_active),
        });
    }, [editingUser]);

    const submitUser = (event) => {
        event.preventDefault();

        if (editingUser) {
            form.put(`/admin/users/${editingUser.id}`, {
                preserveScroll: true,
                onSuccess: () => setEditingUser(null),
            });
            return;
        }

        form.post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const applyFilters = (event) => {
        event.preventDefault();
        router.get('/admin/users', filterForm.data, {
            preserveState: true,
            replace: true,
        });
    };

    const importStudents = (event) => {
        event.preventDefault();
        importForm.post('/admin/users/import-students', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => importForm.reset(),
        });
    };

    return (
        <AdminLayout title="Manajemen User">
            <Head title="Manajemen User" />

            <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Daftar User</CardTitle>
                                <CardDescription className="mt-1">
                                    {stats.total} total, {stats.active} aktif, {stats.inactive} nonaktif
                                </CardDescription>
                            </div>
                            <form onSubmit={applyFilters} className="flex flex-col gap-2 md:flex-row" aria-label="Filter user">
                            <label className="sr-only" htmlFor="search">
                                Cari user
                            </label>
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                                <input
                                    id="search"
                                    value={filterForm.data.search}
                                    onChange={(event) => filterForm.setData('search', event.target.value)}
                                    placeholder="Cari nama/email"
                                    className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 md:w-56"
                                />
                            </div>
                            <label className="sr-only" htmlFor="role">
                                Role
                            </label>
                            <select
                                id="role"
                                value={filterForm.data.role}
                                onChange={(event) => filterForm.setData('role', event.target.value)}
                                className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15"
                            >
                                <option value="">Semua role</option>
                                <option value="admin">Admin</option>
                                <option value="instructor">Dosen</option>
                                <option value="student">Mahasiswa</option>
                            </select>
                            <label className="sr-only" htmlFor="status">
                                Status user
                            </label>
                            <select
                                id="status"
                                value={filterForm.data.status}
                                onChange={(event) => filterForm.setData('status', event.target.value)}
                                className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15"
                            >
                                <option value="">Semua status</option>
                                <option value="active">Aktif</option>
                                <option value="inactive">Nonaktif</option>
                            </select>
                            <Button type="submit" className="h-10 bg-blue-700 text-white hover:bg-blue-800">
                                Filter
                            </Button>
                        </form>
                        </div>
                    </CardHeader>
                    <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[48rem] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="py-3 pr-4 font-medium">Nama</th>
                                    <th className="py-3 pr-4 font-medium">Role</th>
                                    <th className="py-3 pr-4 font-medium">Identitas</th>
                                    <th className="py-3 pr-4 font-medium">Status</th>
                                    <th className="py-3 text-right font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.data.map((user) => (
                                    <tr key={user.id}>
                                        <td className="py-4 pr-4">
                                            <p className="font-semibold text-slate-950">{user.name}</p>
                                            <p className="text-slate-500">{user.email}</p>
                                        </td>
                                        <td className="py-4 pr-4 capitalize">{user.role}</td>
                                        <td className="py-4 pr-4 text-slate-600">{user.nim || user.nidn || '-'}</td>
                                        <td className="py-4 pr-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {user.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button type="button" variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                                                    <Edit3 />
                                                    Edit
                                                </Button>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => router.patch(`/admin/users/${user.id}/toggle`, {}, { preserveScroll: true })}>
                                                    {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
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

                <aside className="space-y-6">
                <Card>
                    <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <UserPlus className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <CardTitle>{editingUser ? 'Edit User' : 'Tambah User'}</CardTitle>
                            <CardDescription>Data dasar akun LMS</CardDescription>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <form onSubmit={submitUser} className="space-y-4">
                        <Field label="Nama" id="name" error={form.errors.name}>
                            <input id="name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="field" />
                        </Field>
                        <Field label="Email" id="email-form" error={form.errors.email}>
                            <input id="email-form" type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} className="field" />
                        </Field>
                        <Field label={editingUser ? 'Password Baru' : 'Password'} id="password-form" error={form.errors.password}>
                            <input id="password-form" type="password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} className="field" autoComplete="new-password" />
                        </Field>
                        <Field label="Role" id="role-form" error={form.errors.role}>
                            <select id="role-form" value={form.data.role} onChange={(event) => form.setData('role', event.target.value)} className="field">
                                <option value="admin">Admin</option>
                                <option value="instructor">Dosen</option>
                                <option value="student">Mahasiswa</option>
                            </select>
                        </Field>
                        {form.data.role === 'student' && (
                            <Field label="NIM" id="nim" error={form.errors.nim}>
                                <input id="nim" value={form.data.nim} onChange={(event) => form.setData('nim', event.target.value)} className="field" />
                            </Field>
                        )}
                        {form.data.role === 'instructor' && (
                            <Field label="NIDN" id="nidn" error={form.errors.nidn}>
                                <input id="nidn" value={form.data.nidn} onChange={(event) => form.setData('nidn', event.target.value)} className="field" />
                            </Field>
                        )}
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} className="size-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600" />
                            Akun aktif
                        </label>
                        <div className="flex gap-2">
                            <Button type="submit" className="bg-blue-700 text-white hover:bg-blue-800" disabled={form.processing}>
                                {form.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                            {editingUser && (
                                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                                    Batal
                                </Button>
                            )}
                        </div>
                    </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <Upload className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <CardTitle>Import Mahasiswa</CardTitle>
                            <CardDescription>CSV: name, email, nim, password</CardDescription>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <form onSubmit={importStudents} className="space-y-4" aria-busy={importForm.processing}>
                        <Field label="File CSV" id="student-import" error={importForm.errors.file}>
                            <input
                                id="student-import"
                                type="file"
                                accept=".csv,text/csv,text/plain"
                                onChange={(event) => importForm.setData('file', event.target.files?.[0] ?? null)}
                                className="field file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700"
                            />
                        </Field>
                        <Button type="submit" className="bg-emerald-700 text-white hover:bg-emerald-800" disabled={importForm.processing}>
                            <Upload />
                            {importForm.processing ? 'Mengimpor...' : 'Import CSV'}
                        </Button>
                    </form>
                    </CardContent>
                </Card>
                </aside>
            </div>
        </AdminLayout>
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
