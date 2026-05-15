import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookOpen, CheckCircle2, FilePlus2, FolderPlus, Layers3, Plus, Trash2 } from 'lucide-react';
import { cloneElement, useState } from 'react';

import InstructorLayout from '@/Layouts/InstructorLayout';
import { Button } from '@/components/ui/button';

export default function Show({ course }) {
    const moduleForm = useForm({ title: '', description: '' });
    const materialForm = useForm({ module_id: '', title: '' });
    const contentForm = useForm({ material_id: '', type: 'artikel', title: '', body: '', url: '', file: null });
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const storeModule = (event) => {
        event.preventDefault();
        moduleForm.post(`/instructor/courses/${course.id}/modules`, {
            preserveScroll: true,
            onSuccess: () => moduleForm.reset(),
        });
    };

    const storeMaterial = (event) => {
        event.preventDefault();
        materialForm.post(`/instructor/modules/${materialForm.data.module_id}/materials`, {
            preserveScroll: true,
            onSuccess: () => materialForm.reset(),
        });
    };

    const storeContent = (event) => {
        event.preventDefault();
        contentForm.post(`/instructor/materials/${contentForm.data.material_id}/contents`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => contentForm.reset(),
        });
    };

    return (
        <InstructorLayout title="Course Builder">
            <Head title={`${course.name} - Builder`} />

            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <Link href="/instructor/courses" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                        Kembali ke kursus
                    </Link>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">{course.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {course.code} - kode enroll <span className="font-mono text-slate-700">{course.enroll_code}</span>
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                    <Badge label="Aktif" value={course.active_enrollments_count} />
                    <Badge label="Pending" value={course.pending_enrollments_count} />
                    <Badge label="Mode" value={course.enrollment_type} />
                    <Badge label="Status" value={course.is_active ? 'Aktif' : 'Arsip'} />
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
                <section aria-labelledby="builder-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <Layers3 className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <h2 id="builder-title" className="text-lg font-semibold text-slate-950">
                                Modul, Materi, dan Konten
                            </h2>
                            <p className="text-sm text-slate-500">Urutan belajar dibaca dari atas ke bawah.</p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        {course.modules.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">Belum ada modul.</p>}
                        {course.modules.map((module) => (
                            <article key={module.id} className="rounded-xl border border-slate-200 p-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Modul {module.order}</p>
                                        <h3 className="mt-1 font-semibold text-slate-950">{module.title}</h3>
                                        <p className="mt-1 text-sm text-slate-500">{module.description ?? 'Tanpa deskripsi'}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => router.patch(`/instructor/modules/${module.id}/toggle`, {}, { preserveScroll: true })}>
                                            {module.is_published ? 'Unpublish' : 'Publish'}
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => router.delete(`/instructor/modules/${module.id}`, { preserveScroll: true })}>
                                            <Trash2 />
                                            Hapus
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {module.materials.map((material) => (
                                        <div key={material.id} className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <p className="font-medium text-slate-900">{material.title}</p>
                                                    <p className="text-sm text-slate-500">{material.contents.length} konten</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <Button type="button" variant="outline" size="sm" onClick={() => router.patch(`/instructor/materials/${material.id}/toggle`, {}, { preserveScroll: true })}>
                                                        {material.is_published ? 'Unpublish' : 'Publish'}
                                                    </Button>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedMaterial(selectedMaterial === material.id ? null : material.id)}>
                                                        Preview
                                                    </Button>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => router.delete(`/instructor/materials/${material.id}`, { preserveScroll: true })}>
                                                        <Trash2 />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </div>
                                            {(selectedMaterial === material.id || material.contents.length > 0) && (
                                                <ol className="mt-3 space-y-2">
                                                    {material.contents.map((content) => (
                                                        <li key={content.id} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-sm">
                                                            <span>{content.order}. {content.title} <span className="text-slate-400">({content.type})</span></span>
                                                            <Button type="button" variant="ghost" size="sm" onClick={() => router.delete(`/instructor/contents/${content.id}`, { preserveScroll: true })}>
                                                                Hapus
                                                            </Button>
                                                        </li>
                                                    ))}
                                                </ol>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <aside className="space-y-6">
                    <section aria-labelledby="module-form-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <FormTitle id="module-form-title" icon={FolderPlus} title="Tambah Modul" />
                        <form onSubmit={storeModule} className="mt-4 space-y-4">
                            <Field label="Judul Modul" id="module-title" error={moduleForm.errors.title}>
                                <input id="module-title" value={moduleForm.data.title} onChange={(event) => moduleForm.setData('title', event.target.value)} className="field" />
                            </Field>
                            <Field label="Deskripsi" id="module-description" error={moduleForm.errors.description}>
                                <textarea id="module-description" rows="3" value={moduleForm.data.description} onChange={(event) => moduleForm.setData('description', event.target.value)} className="field h-auto py-2" />
                            </Field>
                            <Button type="submit" className="bg-emerald-700 text-white hover:bg-emerald-800" disabled={moduleForm.processing}>
                                <Plus />
                                Simpan Modul
                            </Button>
                        </form>
                    </section>

                    <section aria-labelledby="material-form-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <FormTitle id="material-form-title" icon={BookOpen} title="Tambah Materi" />
                        <form onSubmit={storeMaterial} className="mt-4 space-y-4">
                            <Field label="Modul" id="material-module" error={materialForm.errors.module_id}>
                                <select id="material-module" value={materialForm.data.module_id} onChange={(event) => materialForm.setData('module_id', event.target.value)} className="field">
                                    <option value="">Pilih modul</option>
                                    {course.modules.map((module) => (
                                        <option key={module.id} value={module.id}>{module.title}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Judul Materi" id="material-title" error={materialForm.errors.title}>
                                <input id="material-title" value={materialForm.data.title} onChange={(event) => materialForm.setData('title', event.target.value)} className="field" />
                            </Field>
                            <Button type="submit" className="bg-emerald-700 text-white hover:bg-emerald-800" disabled={materialForm.processing || !materialForm.data.module_id}>
                                <Plus />
                                Simpan Materi
                            </Button>
                        </form>
                    </section>

                    <section aria-labelledby="content-form-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <FormTitle id="content-form-title" icon={FilePlus2} title="Tambah Konten" />
                        <form onSubmit={storeContent} className="mt-4 space-y-4">
                            <Field label="Materi" id="content-material" error={contentForm.errors.material_id}>
                                <select id="content-material" value={contentForm.data.material_id} onChange={(event) => contentForm.setData('material_id', event.target.value)} className="field">
                                    <option value="">Pilih materi</option>
                                    {course.modules.flatMap((module) => module.materials.map((material) => (
                                        <option key={material.id} value={material.id}>{module.title} - {material.title}</option>
                                    )))}
                                </select>
                            </Field>
                            <Field label="Tipe" id="content-type" error={contentForm.errors.type}>
                                <select id="content-type" value={contentForm.data.type} onChange={(event) => contentForm.setData('type', event.target.value)} className="field">
                                    <option value="artikel">Artikel</option>
                                    <option value="video">Video YouTube</option>
                                    <option value="audio">Audio</option>
                                    <option value="pdf">PDF</option>
                                    <option value="file">File</option>
                                </select>
                            </Field>
                            <Field label="Judul Konten" id="content-title" error={contentForm.errors.title}>
                                <input id="content-title" value={contentForm.data.title} onChange={(event) => contentForm.setData('title', event.target.value)} className="field" />
                            </Field>
                            {contentForm.data.type === 'artikel' && (
                                <Field label="Isi Artikel" id="content-body" error={contentForm.errors.body}>
                                    <textarea id="content-body" rows="5" value={contentForm.data.body} onChange={(event) => contentForm.setData('body', event.target.value)} className="field h-auto py-2" />
                                </Field>
                            )}
                            {contentForm.data.type === 'video' && (
                                <Field label="URL Video" id="content-url" error={contentForm.errors.url}>
                                    <input id="content-url" type="url" value={contentForm.data.url} onChange={(event) => contentForm.setData('url', event.target.value)} className="field" />
                                </Field>
                            )}
                            {['audio', 'pdf', 'file'].includes(contentForm.data.type) && (
                                <Field label="File" id="content-file" error={contentForm.errors.file}>
                                    <input id="content-file" type="file" onChange={(event) => contentForm.setData('file', event.target.files?.[0] ?? null)} className="field file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700" />
                                </Field>
                            )}
                            <Button type="submit" className="bg-emerald-700 text-white hover:bg-emerald-800" disabled={contentForm.processing || !contentForm.data.material_id}>
                                <CheckCircle2 />
                                Simpan Konten
                            </Button>
                        </form>
                    </section>
                </aside>
            </div>
        </InstructorLayout>
    );
}

function Badge({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 font-semibold text-slate-950">{value}</p>
        </div>
    );
}

function FormTitle({ id, icon: Icon, title }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon className="size-5" aria-hidden="true" />
            </div>
            <h2 id={id} className="text-lg font-semibold text-slate-950">{title}</h2>
        </div>
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
