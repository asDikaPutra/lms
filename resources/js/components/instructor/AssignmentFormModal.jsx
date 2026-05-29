import { useForm } from '@inertiajs/react';
import { CheckCircle2, FileText, Link as LinkIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { TextField, TextArea, SelectField, CheckboxField } from '@/components/ui/text-field';

const EMPTY_ARRAY = [];

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
    modules = EMPTY_ARRAY,
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

    return (
        <Modal open={isOpen} onClose={onClose} title={isEditing ? 'Edit Tugas' : 'Buat Tugas Baru'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Parent Selection - Show when showParentSelect is true */}
                {showParentSelect && (
                    <SelectField
                        id="assignment-parent"
                        label={<>Tingkat Tugas <span className="text-red-500">*</span></>}
                        description="Pilih modul untuk tugas tingkat modul, atau materi untuk tugas tingkat materi."
                        error={form.errors.assignable_id || form.errors.assignable_type}
                        value={getCurrentValue()}
                        onChange={handleParentChange}
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
                    </SelectField>
                )}

                {/* Title */}
                <TextField
                    id="assignment-title"
                    label={<>Judul Tugas <span className="text-red-500">*</span></>}
                    error={form.errors.title}
                    value={form.data.title}
                    onChange={(e) => form.setData('title', e.target.value)}
                    placeholder="Contoh: Ringkasan Materi Modul 1"
                />

                {/* Description */}
                <TextArea
                    id="assignment-description"
                    label={<>Deskripsi / Instruksi <span className="text-red-500">*</span></>}
                    error={form.errors.description}
                    rows="4"
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    placeholder="Jelaskan instruksi tugas untuk mahasiswa..."
                />

                {/* Deadline */}
                <TextField
                    id="assignment-deadline"
                    type="datetime-local"
                    label={<>Deadline <span className="text-red-500">*</span></>}
                    error={form.errors.deadline}
                    value={form.data.deadline}
                    onChange={(e) => form.setData('deadline', e.target.value)}
                />

                {/* Submission Type */}
                <div className="space-y-3 rounded-lg p-4 border
                    bg-neutral-50 border-neutral-200
                    dark:bg-white/5 dark:border-white/[0.07]">
                    <p className="text-sm font-semibold text-neutral-700 dark:text-white/70">Tipe Pengumpulan</p>
                    <div className="flex flex-wrap gap-4">
                        <CheckboxField
                            checked={form.data.allow_file}
                            onChange={(e) => form.setData('allow_file', e.target.checked)}
                            label={<><FileText className="size-4 text-neutral-500 dark:text-white/40" /> Upload File</>}
                        />
                        <CheckboxField
                            checked={form.data.allow_link}
                            onChange={(e) => form.setData('allow_link', e.target.checked)}
                            label={<><LinkIcon className="size-4 text-neutral-500 dark:text-white/40" /> Submit Link</>}
                        />
                    </div>
                    {form.errors.allow_file && <p className="text-xs text-red-600">{form.errors.allow_file}</p>}
                    {form.errors.allow_link && <p className="text-xs text-red-600">{form.errors.allow_link}</p>}
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center gap-2 pt-2">
                    <CheckboxField
                        checked={form.data.is_published}
                        onChange={(e) => form.setData('is_published', e.target.checked)}
                        label="Publish tugas (langsung terlihat oleh mahasiswa)"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-white/[0.07]">
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
        </Modal>
    );
}
