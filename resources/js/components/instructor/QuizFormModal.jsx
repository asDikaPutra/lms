import { useForm } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { TextField, SelectField, CheckboxField } from '@/components/ui/text-field';

const EMPTY_ARRAY = [];

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
    modules = EMPTY_ARRAY,
    preselectedType = null,
    preselectedId = null,
    showParentSelect = true
}) {
    const isEditing = Boolean(quiz);

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

    const handleParentChange = (e) => {
        const value = e.target.value;
        if (!value) {
            form.setData({ ...form.data, quizzable_type: 'module', quizzable_id: '' });
            return;
        }
        const [type, id] = value.split(':');
        form.setData({ ...form.data, quizzable_type: type, quizzable_id: id });
    };

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
        <Modal open={isOpen} onClose={onClose} title={isEditing ? 'Edit Kuis' : 'Buat Kuis Baru'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {showParentSelect && (
                    <SelectField
                        label={<>Tingkat Kuis <span className="text-red-500">*</span></>}
                        value={getCurrentValue()}
                        onChange={handleParentChange}
                        error={form.errors.quizzable_id || form.errors.quizzable_type}
                        description="Pilih modul untuk kuis tingkat modul, atau materi untuk kuis tingkat materi."
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

                <TextField
                    label={<>Judul Kuis <span className="text-red-500">*</span></>}
                    value={form.data.title}
                    onChange={(e) => form.setData('title', e.target.value)}
                    error={form.errors.title}
                    placeholder="Contoh: Kuis Pengantar Tafsir"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        label="Durasi (menit)"
                        type="number"
                        min="1"
                        max="600"
                        value={form.data.duration}
                        onChange={(e) => form.setData('duration', e.target.value)}
                        error={form.errors.duration}
                        placeholder="30"
                    />
                    <TextField
                        label={<>Nilai Minimum Lulus <span className="text-red-500">*</span></>}
                        type="number"
                        min="0"
                        max="100"
                        value={form.data.passing_score}
                        onChange={(e) => form.setData('passing_score', e.target.value)}
                        error={form.errors.passing_score}
                        placeholder="70"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        label={<>Maksimal Percobaan <span className="text-red-500">*</span></>}
                        type="number"
                        min="1"
                        max="10"
                        value={form.data.max_attempts}
                        onChange={(e) => form.setData('max_attempts', e.target.value)}
                        error={form.errors.max_attempts}
                        placeholder="1"
                    />
                    <SelectField
                        label={<>Mode Hasil <span className="text-red-500">*</span></>}
                        value={form.data.result_mode}
                        onChange={(e) => form.setData('result_mode', e.target.value)}
                        error={form.errors.result_mode}
                    >
                        <option value="immediate">Langsung tampil</option>
                        <option value="delayed">Ditunda</option>
                        <option value="custom">Setelah dinilai</option>
                    </SelectField>
                </div>

                <div className="pt-2">
                    <CheckboxField
                        label="Publish kuis (langsung terlihat oleh mahasiswa)"
                        checked={form.data.is_published}
                        onChange={(e) => form.setData('is_published', e.target.checked)}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-white/[0.07]">
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
        </Modal>
    );
}
