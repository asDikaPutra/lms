import { useForm } from '@inertiajs/react';
import { X, CheckCircle2, FileText, Link as LinkIcon } from 'lucide-react';
import { cloneElement, useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';

/**
 * Reusable Assignment Form Modal
 * Used in both Assignments page and Curriculum page
 * 
 * @param {boolean} isOpen - Whether modal is open
 * @param {function} onClose - Close modal callback
 * @param {object|null} assignment - Existing assignment for edit mode, null for create
 * @param {array} modules - List of modules with their materials for dropdown
 * @param {string|null} preselectedType - Pre-selected type ('module' or 'material')
 * @param {number|null} preselectedId - Pre-selected parent ID
 * @param {boolean} showParentSelect - Whether to show parent selection (true for Assignments page)
 */
export default function AssignmentFormModal({ 
    isOpen, 
    onClose, 
    assignment = null, 
    modules = [], 
    preselectedType = null,
    preselectedId = null,
    showParentSelect = true 
}) {
    const isEditing = Boolean(assignment);

    // Determine initial type from assignment or preselected
    const getInitialType = () => {
        if (assignment) {
            const type = assignment.assignable_type;
            if (type === 'material' || type === 'App\\Models\\Material') return 'material';
            return 'module';
        }
        return preselectedType || 'module';
    };

    const form = useForm({
        assignable_type: getInitialType(),
        assignable_id: preselectedId ?? assignment?.assignable_id ?? '',
        title: assignment?.title ?? '',
        description: assignment?.description ?? '',
        deadline: assignment?.deadline ? assignment.deadline.slice(0, 16) : '',
        allow_file: assignment?.allow_file ?? true,
        allow_link: assignment?.allow_link ?? false,
        is_published: assignment?.is_published ?? false,
    });

    // Build flat list of options for dropdown
    const parentOptions = useMemo(() => {
        const options = [];
        modules?.forEach((module) => {
            // Add module option
            options.push({
                type: 'module',
                id: module.id,
                label: `📁 Modul: ${module.title}`,
                isModule: true,
            });
            // Add material options under this module
            module.materials?.forEach((material) => {
                options.push({
                    type: 'material',
                    id: material.id,
                    label: `    📄 Materi: ${material.title}`,
                    isModule: false,
                    moduleId: module.id,
                });
            });
        });
        return options;
    }, [modules]);

    // Reset form when modal opens/closes or assignment changes
    useEffect(() => {
        if (isOpen) {
            const initialType = getInitialType();
            form.setData({
                assignable_type: initialType,
                assignable_id: preselectedId ?? assignment?.assignable_id ?? '',
                title: assignment?.title ?? '',
                description: assignment?.description ?? '',
                deadline: assignment?.deadline ? assignment.deadline.slice(0, 16) : '',
                allow_file: assignment?.allow_file ?? true,
                allow_link: assignment?.allow_link ?? false,
                is_published: assignment?.is_published ?? false,
            });
            form.clearErrors();
        }
    }, [isOpen, assignment?.id, preselectedId, preselectedType]);

    // Handle parent selection change
    const handleParentChange = (e) => {
        const value = e.target.value;
        if (!value) {
            form.setData({ ...form.data, assignable_type: 'module', assignable_id: '' });
            return;
        }
        
        const [type, id] = value.split(':');
        form.setData({ ...form.data, assignable_type: type, assignable_id: id });
    };

    // Get current selected value for dropdown
    const getCurrentValue = () => {
        if (!form.data.assignable_id) return '';
        return `${form.data.assignable_type}:${form.data.assignable_id}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            form.put(`/instructor/assignments/${assignment.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    form.reset();
                },
            });
        } else {
            form.post('/instructor/assignments', {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    form.reset();
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
            <div
                className="w-full max-w-lg rounded-xl bg-white shadow-xl ring-1 ring-black/5"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                    <h3 className="text-lg font-semibold text-neutral-900">
                        {isEditing ? 'Edit Tugas' : 'Buat Tugas Baru'}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="p-5 max-h-[75vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Parent Selection - Show when showParentSelect is true */}
                        {showParentSelect && (
                            <div>
                                <label htmlFor="assignment-parent" className="text-sm font-medium text-neutral-700 mb-1.5 block">
                                    Tingkat Tugas <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="assignment-parent"
                                    value={getCurrentValue()}
                                    onChange={handleParentChange}
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                >
                                    <option value="">-- Pilih Modul atau Materi --</option>
                                    {parentOptions.map((option) => (
                                        <option 
                                            key={`${option.type}:${option.id}`} 
                                            value={`${option.type}:${option.id}`}
                                            className={option.isModule ? 'font-semibold' : ''}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-neutral-500">
                                    Pilih modul untuk tugas tingkat modul, atau materi untuk tugas tingkat materi.
                                </p>
                                {(form.errors.assignable_id || form.errors.assignable_type) && (
                                    <p className="mt-1.5 text-xs text-red-600">{form.errors.assignable_id || form.errors.assignable_type}</p>
                                )}
                            </div>
                        )}

                        {/* Title */}
                        <Field label="Judul Tugas" id="assignment-title" error={form.errors.title} required>
                            <input
                                id="assignment-title"
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                placeholder="Contoh: Ringkasan Materi Modul 1"
                            />
                        </Field>

                        {/* Description */}
                        <Field label="Deskripsi / Instruksi" id="assignment-description" error={form.errors.description} required>
                            <textarea
                                id="assignment-description"
                                rows="4"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                placeholder="Jelaskan instruksi tugas untuk mahasiswa..."
                            />
                        </Field>

                        {/* Deadline */}
                        <Field label="Deadline" id="assignment-deadline" error={form.errors.deadline} required>
                            <input
                                id="assignment-deadline"
                                type="datetime-local"
                                value={form.data.deadline}
                                onChange={(e) => form.setData('deadline', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </Field>

                        {/* Submission Type */}
                        <div className="space-y-3 rounded-lg bg-neutral-50 p-4 border border-neutral-200">
                            <p className="text-sm font-semibold text-neutral-700">Tipe Pengumpulan</p>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.allow_file}
                                        onChange={(e) => form.setData('allow_file', e.target.checked)}
                                        className="size-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <FileText className="size-4 text-neutral-500" />
                                    Upload File
                                </label>
                                <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.allow_link}
                                        onChange={(e) => form.setData('allow_link', e.target.checked)}
                                        className="size-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <LinkIcon className="size-4 text-neutral-500" />
                                    Submit Link
                                </label>
                            </div>
                            {form.errors.allow_file && <p className="text-xs text-red-600">{form.errors.allow_file}</p>}
                            {form.errors.allow_link && <p className="text-xs text-red-600">{form.errors.allow_link}</p>}
                        </div>

                        {/* Publish Status */}
                        <div className="flex items-center gap-2 pt-2">
                            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_published}
                                    onChange={(e) => form.setData('is_published', e.target.checked)}
                                    className="size-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                Publish tugas (langsung terlihat oleh mahasiswa)
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing || (showParentSelect && !form.data.assignable_id)}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                            >
                                <CheckCircle2 className="mr-1.5 size-4" />
                                {isEditing ? 'Simpan Perubahan' : 'Buat Tugas'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function Field({ label, id, error, required, children }) {
    const describedBy = error ? `${id}-error` : undefined;
    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium text-neutral-700 mb-1.5 block">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div>
                {cloneElement(children, { 'aria-describedby': describedBy, 'aria-invalid': Boolean(error) })}
            </div>
            {error && <p id={describedBy} role="alert" className="mt-1.5 text-xs text-red-600">{error}</p>}
        </div>
    );
}
