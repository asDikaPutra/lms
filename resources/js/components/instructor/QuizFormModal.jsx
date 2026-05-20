import { useForm } from '@inertiajs/react';
import { X, CheckCircle2, HelpCircle } from 'lucide-react';
import { cloneElement, useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';

/**
 * Reusable Quiz Form Modal
 * Used in both Quizzes page and Curriculum page
 * 
 * @param {boolean} isOpen - Whether modal is open
 * @param {function} onClose - Close modal callback
 * @param {object|null} quiz - Existing quiz for edit mode, null for create
 * @param {array} modules - List of modules with their materials for dropdown
 * @param {string|null} preselectedType - Pre-selected type ('module' or 'material')
 * @param {number|null} preselectedId - Pre-selected parent ID
 * @param {boolean} showParentSelect - Whether to show parent selection (true for Quizzes page)
 */
export default function QuizFormModal({ 
    isOpen, 
    onClose, 
    quiz = null, 
    modules = [], 
    preselectedType = null,
    preselectedId = null,
    showParentSelect = true 
}) {
    const isEditing = Boolean(quiz);

    // Determine initial type from quiz or preselected
    const getInitialType = () => {
        if (quiz) {
            const type = quiz.quizzable_type;
            if (type === 'material' || type === 'App\\Models\\Material') return 'material';
            return 'module';
        }
        return preselectedType || 'module';
    };

    const form = useForm({
        quizzable_type: getInitialType(),
        quizzable_id: preselectedId ?? quiz?.quizzable_id ?? '',
        title: quiz?.title ?? '',
        duration: quiz?.duration ?? '',
        result_mode: quiz?.result_mode ?? 'immediate',
        passing_score: quiz?.passing_score ?? 70,
        max_attempts: quiz?.max_attempts ?? 1,
        is_published: quiz?.is_published ?? false,
    });

    // Build flat list of options for dropdown
    const parentOptions = useMemo(() => {
        const options = [];
        modules?.forEach((module) => {
            options.push({
                type: 'module',
                id: module.id,
                label: `📁 Modul: ${module.title}`,
                isModule: true,
            });
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

    // Reset form when modal opens/closes or quiz changes
    useEffect(() => {
        if (isOpen) {
            const initialType = getInitialType();
            form.setData({
                quizzable_type: initialType,
                quizzable_id: preselectedId ?? quiz?.quizzable_id ?? '',
                title: quiz?.title ?? '',
                duration: quiz?.duration ?? '',
                result_mode: quiz?.result_mode ?? 'immediate',
                passing_score: quiz?.passing_score ?? 70,
                max_attempts: quiz?.max_attempts ?? 1,
                is_published: quiz?.is_published ?? false,
            });
            form.clearErrors();
        }
    }, [isOpen, quiz?.id, preselectedId, preselectedType]);

    // Handle parent selection change
    const handleParentChange = (e) => {
        const value = e.target.value;
        if (!value) {
            form.setData({ ...form.data, quizzable_type: 'module', quizzable_id: '' });
            return;
        }
        const [type, id] = value.split(':');
        form.setData({ ...form.data, quizzable_type: type, quizzable_id: id });
    };

    // Get current selected value for dropdown
    const getCurrentValue = () => {
        if (!form.data.quizzable_id) return '';
        return `${form.data.quizzable_type}:${form.data.quizzable_id}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            form.put(`/instructor/quizzes/${quiz.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    form.reset();
                },
            });
        } else {
            form.post('/instructor/quizzes', {
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
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100">
                            <HelpCircle className="size-4 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900">
                            {isEditing ? 'Edit Kuis' : 'Buat Kuis Baru'}
                        </h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="p-5 max-h-[75vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Parent Selection */}
                        {showParentSelect && (
                            <div>
                                <label htmlFor="quiz-parent" className="text-sm font-medium text-neutral-700 mb-1.5 block">
                                    Tingkat Kuis <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="quiz-parent"
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
                                    Pilih modul untuk kuis tingkat modul, atau materi untuk kuis tingkat materi.
                                </p>
                                {(form.errors.quizzable_id || form.errors.quizzable_type) && (
                                    <p className="mt-1.5 text-xs text-red-600">{form.errors.quizzable_id || form.errors.quizzable_type}</p>
                                )}
                            </div>
                        )}

                        {/* Title */}
                        <Field label="Judul Kuis" id="quiz-title" error={form.errors.title} required>
                            <input
                                id="quiz-title"
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                placeholder="Contoh: Kuis Pengantar Tafsir"
                            />
                        </Field>

                        {/* Duration and Passing Score */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Durasi (menit)" id="quiz-duration" error={form.errors.duration}>
                                <input
                                    id="quiz-duration"
                                    type="number"
                                    min="1"
                                    max="600"
                                    value={form.data.duration}
                                    onChange={(e) => form.setData('duration', e.target.value)}
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="30"
                                />
                            </Field>
                            <Field label="Nilai Minimum Lulus" id="quiz-passing-score" error={form.errors.passing_score} required>
                                <input
                                    id="quiz-passing-score"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={form.data.passing_score}
                                    onChange={(e) => form.setData('passing_score', e.target.value)}
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="70"
                                />
                            </Field>
                        </div>

                        {/* Max Attempts and Result Mode */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Maksimal Percobaan" id="quiz-max-attempts" error={form.errors.max_attempts} required>
                                <input
                                    id="quiz-max-attempts"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={form.data.max_attempts}
                                    onChange={(e) => form.setData('max_attempts', e.target.value)}
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="1"
                                />
                            </Field>
                            <Field label="Mode Hasil" id="quiz-result-mode" error={form.errors.result_mode} required>
                                <select
                                    id="quiz-result-mode"
                                    value={form.data.result_mode}
                                    onChange={(e) => form.setData('result_mode', e.target.value)}
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                >
                                    <option value="immediate">Langsung tampil</option>
                                    <option value="delayed">Ditunda</option>
                                    <option value="custom">Setelah dinilai</option>
                                </select>
                            </Field>
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
                                Publish kuis (langsung terlihat oleh mahasiswa)
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing || (showParentSelect && !form.data.quizzable_id)}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                            >
                                <CheckCircle2 className="mr-1.5 size-4" />
                                {isEditing ? 'Simpan Perubahan' : 'Buat Kuis'}
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
