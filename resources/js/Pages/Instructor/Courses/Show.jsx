import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { BookOpen, CheckCircle2, ClipboardList, FilePlus2, FolderPlus, Layers3, MessageSquare, Plus, Send, Trash2, Edit2, PlayCircle, FileText, FileAudio, File, X, ChevronDown, ChevronRight, HelpCircle, ListPlus } from 'lucide-react';
import { cloneElement, useState, useEffect } from 'react';

import InstructorLayout from '@/Layouts/InstructorLayout';
import { Button } from '@/components/ui/button';
import { VideoUrlPreview } from '@/components/shared/VideoPlayer';

export default function Show({ course }) {
    const [modalState, setModalState] = useState({ isOpen: false, type: null, parentId: null });
    const defaultQuizData = (parentId = '', parentKind = 'module') => ({
        quizzable_type: parentKind,
        quizzable_id: parentId ?? '',
        title: '',
        duration: '',
        result_mode: 'immediate',
        passing_score: 70,
        max_attempts: 1,
        is_published: false,
    });

    const defaultAssignmentData = (parentId = '', parentKind = 'module') => ({
        assignable_type: parentKind,
        assignable_id: parentId ?? '',
        title: '',
        description: '',
        deadline: '',
        allow_file: true,
        allow_link: false,
        is_published: false,
    });

    const moduleForm = useForm({ title: '', description: '' });
    const materialForm = useForm({ module_id: '', title: '' });
    const contentForm = useForm({ material_id: '', type: 'artikel', title: '', body: '', url: '', file: null });
    const quizForm = useForm(defaultQuizData());
    const assignmentForm = useForm(defaultAssignmentData());
    const [expandedModules, setExpandedModules] = useState(new Set());
    const [expandedMaterials, setExpandedMaterials] = useState(new Set());
    const [editId, setEditId] = useState(null);

    const toggleModule = (id) => {
        const next = new Set(expandedModules);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedModules(next);
    };

    const toggleMaterial = (id) => {
        const next = new Set(expandedMaterials);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedMaterials(next);
    };

    useEffect(() => {
        if (!modalState.isOpen) {
            moduleForm.reset();
            moduleForm.clearErrors();
            materialForm.reset();
            materialForm.clearErrors();
            contentForm.reset();
            contentForm.clearErrors();
            quizForm.reset();
            quizForm.clearErrors();
            assignmentForm.reset();
            assignmentForm.clearErrors();
            setEditId(null);
        } else if (modalState.parentId) {
            if (modalState.type === 'material') {
                materialForm.setData('module_id', modalState.parentId);
            } else if (modalState.type === 'content') {
                contentForm.setData('material_id', modalState.parentId);
            } else if (modalState.type === 'quiz') {
                quizForm.setData(defaultQuizData(modalState.parentId, modalState.parentKind ?? 'module'));
            } else if (modalState.type === 'assignment') {
                assignmentForm.setData(defaultAssignmentData(modalState.parentId, modalState.parentKind ?? 'module'));
            }
        }
    }, [modalState.isOpen, modalState.parentId, modalState.parentKind, modalState.type]);

    const openModal = (type, parentId = null, existingData = null, parentKind = null) => {
        setModalState({ isOpen: true, type, parentId, parentKind });
        if (existingData && type !== 'discussion') {
            setEditId(existingData.id);
            if (type === 'module') {
                moduleForm.setData({ title: existingData.title, description: existingData.description || '' });
            } else if (type === 'material') {
                materialForm.setData({ module_id: parentId, title: existingData.title });
            } else if (type === 'content') {
                contentForm.setData({
                    material_id: parentId,
                    type: existingData.type,
                    title: existingData.title,
                    body: existingData.body || '',
                    url: existingData.url || '',
                });
            } else if (type === 'quiz') {
                quizForm.setData({
                    ...defaultQuizData(parentId, parentKind ?? 'module'),
                    title: existingData.title,
                    duration: existingData.duration || '',
                    result_mode: existingData.result_mode || 'immediate',
                    passing_score: existingData.passing_score ?? 70,
                    max_attempts: existingData.max_attempts ?? 1,
                    is_published: Boolean(existingData.is_published),
                });
            } else if (type === 'assignment') {
                assignmentForm.setData({
                    ...defaultAssignmentData(parentId, parentKind ?? 'module'),
                    title: existingData.title,
                    description: existingData.description || '',
                    deadline: existingData.deadline ? existingData.deadline.slice(0, 16) : '',
                    allow_file: Boolean(existingData.allow_file),
                    allow_link: Boolean(existingData.allow_link),
                    is_published: Boolean(existingData.is_published),
                });
            }
        } else if (type === 'quiz') {
            quizForm.setData(defaultQuizData(parentId, parentKind ?? 'module'));
        } else if (type === 'assignment') {
            assignmentForm.setData(defaultAssignmentData(parentId, parentKind ?? 'module'));
        }
    };

    const closeModal = () => {
        setModalState({ isOpen: false, type: null, parentId: null });
        setEditId(null);
    };

    const storeModule = (event) => {
        event.preventDefault();
        if (editId) {
            moduleForm.patch(`/instructor/modules/${editId}`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            moduleForm.post(`/instructor/courses/${course.id}/modules`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const storeMaterial = (event) => {
        event.preventDefault();
        if (editId) {
            materialForm.patch(`/instructor/materials/${editId}`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            materialForm.post(`/instructor/modules/${materialForm.data.module_id}/materials`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const storeContent = (event) => {
        event.preventDefault();
        if (editId) {
            // For updates with potentially new files, use POST with _method PATCH
            contentForm.post(`/instructor/contents/${editId}`, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => closeModal(),
                data: { ...contentForm.data, _method: 'PATCH' }
            });
        } else {
            contentForm.post(`/instructor/materials/${contentForm.data.material_id}/contents`, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const storeQuiz = (event) => {
        event.preventDefault();
        if (editId) {
            quizForm.put(`/instructor/quizzes/${editId}`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            quizForm.post('/instructor/quizzes', {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const storeAssignment = (event) => {
        event.preventDefault();
        if (editId) {
            assignmentForm.put(`/instructor/assignments/${editId}`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            assignmentForm.post('/instructor/assignments', {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const storeQuestion = (event) => {
        event.preventDefault();
        if (editId) {
            questionForm.put(`/instructor/quiz-questions/${editId}`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            questionForm.post(`/instructor/quizzes/${modalState.parentId}/questions`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const getContentTypeIcon = (type) => {
        switch (type) {
            case 'video': return <PlayCircle className="size-4 text-[#006bd6]" />;
            case 'artikel': return <FileText className="size-4 text-sb-green" />;
            case 'audio': return <FileAudio className="size-4 text-[#5e2b97]" />;
            case 'pdf': return <File className="size-4 text-[#cc0000]" />;
            default: return <File className="size-4 text-sb-text-soft" />;
        }
    };

    return (
        <InstructorLayout title="Course Builder">
            <Head title={`${course.name} - Builder`} />

            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between tracking-[-0.01em]">
                <div>
                    <Link href="/instructor/courses" className="text-[13px] font-semibold text-sb-accent hover:text-sb-green transition-colors">
                        &larr; Kembali ke kursus
                    </Link>
                    <h2 className="mt-2 text-[24px] font-semibold text-sb-text-black leading-tight tracking-[-0.16px]">{course.name}</h2>
                    <p className="mt-1 text-[13px] text-sb-text-soft">
                        <span className="font-semibold text-sb-green uppercase tracking-[0.05em]">{course.code}</span> &bull; Kode enroll: <strong className="text-sb-text-black">{course.enroll_code}</strong>
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Badge label="Aktif" value={course.active_enrollments_count} />
                    <Badge label="Pending" value={course.pending_enrollments_count} />
                    <Badge label="Mode" value={course.enrollment_type} className="capitalize" />
                    <Badge label="Status" value={course.is_active ? 'Aktif' : 'Arsip'} tone={course.is_active ? 'bg-sb-light text-sb-green' : 'bg-[#f9f9f9] text-sb-text-soft'} />
                </div>
            </div>

            <div className="w-full tracking-[-0.01em]">
                <section aria-labelledby="builder-title" className="rounded-[10px] bg-white p-4 lg:p-5 shadow-[0_0_0.5px_rgba(0,0,0,0.14),_0_1px_1px_rgba(0,0,0,0.24)]">
                    <div className="flex items-center justify-between border-b border-[#edebe9] pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-[36px] items-center justify-center rounded-[8px] bg-sb-light text-sb-green">
                                <Layers3 className="size-5" aria-hidden="true" />
                            </div>
                            <div>
                                <h2 id="builder-title" className="text-[16px] font-semibold text-sb-text-black tracking-[-0.16px]">
                                    Struktur Kurikulum
                                </h2>
                                <p className="text-[12px] text-sb-text-soft">Kelola modul, materi, dan konten pembelajaran.</p>
                            </div>
                        </div>
                        <Button onClick={() => openModal('module')} size="sm" className="h-[36px]">
                            <Plus className="mr-1.5 size-4" /> Modul Baru
                        </Button>
                    </div>

                    <div className="mt-5 space-y-5">
                        {course.modules.length === 0 && <p className="rounded-[8px] border border-dashed border-[#d6dbde] p-5 text-center text-[13px] text-sb-text-soft">Belum ada modul yang dibuat.</p>}
                        {course.modules.map((module) => (
                            <article key={module.id} className="rounded-[8px] border border-[#edebe9] bg-white overflow-hidden transition-all hover:border-[#d6dbde]">
                                <div className="flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between bg-[#f9f9f9]">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-sb-text-soft">Modul {module.order}</p>
                                        <h3 className="text-[15px] font-semibold text-sb-text-black">{module.title}</h3>
                                        <p className="mt-0.5 text-[13px] text-sb-text-soft">{module.description ?? 'Tanpa deskripsi'}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button type="button" variant="outline" size="sm" className="h-[28px] w-[28px] p-0 border-[#edebe9] text-sb-text-soft hover:text-sb-text-black" onClick={() => toggleModule(module.id)}>
                                            {expandedModules.has(module.id) ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-sb-text-black hover:bg-sb-light/30" onClick={() => openModal('module', null, module)}>
                                            <Edit2 className="mr-1.5 size-3.5" />
                                            Edit
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-sb-green/30 text-sb-green hover:bg-sb-light" onClick={() => openModal('quiz', module.id, null, 'module')}>
                                            <HelpCircle className="mr-1.5 size-3.5" />
                                            Quiz
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-sb-green/30 text-sb-green hover:bg-sb-light" onClick={() => openModal('assignment', module.id, null, 'module')}>
                                            <ClipboardList className="mr-1.5 size-3.5" />
                                            Tugas
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" className={`h-[28px] px-2.5 text-[11px] ${module.is_published ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-sb-green/30 text-sb-green hover:bg-sb-light'}`} onClick={() => router.patch(`/instructor/modules/${module.id}/toggle`, {}, { preserveScroll: true })}>
                                            {module.is_published ? 'Unpublish' : 'Publish'}
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/modules/${module.id}`, { preserveScroll: true })}>
                                            <Trash2 className="mr-1.5 size-3.5" />
                                            Hapus
                                        </Button>
                                    </div>
                                </div>

                                {module.quizzes?.map((quiz) => (
                                    <div key={quiz.id} className={`bg-white relative border-b border-[#edebe9] ${expandedModules.has(module.id) ? '' : 'hidden'}`}>
                                        <div className="absolute left-[24px] top-0 h-full w-[2px] bg-[#edebe9]"></div>
                                        <div className="relative flex flex-col gap-2 py-3 pl-[48px] pr-4 md:flex-row md:items-center md:justify-between">
                                            <div className="absolute left-[24px] top-[24px] w-[16px] h-[2px] bg-[#edebe9]"></div>
                                            <div className="flex items-center gap-2">
                                                <HelpCircle className="size-4 text-sb-green" />
                                                <p className="text-[14px] font-medium text-sb-text-black">{quiz.title} <span className="text-[11px] font-normal text-sb-text-soft uppercase tracking-wider ml-1">(Quiz Tingkat Modul)</span></p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 relative z-10">
                                                <Link href={`/instructor/quizzes/${quiz.id}/edit`} className="inline-flex h-[28px] items-center justify-center rounded-[6px] border border-sb-green bg-sb-light/30 px-2.5 text-[11px] font-semibold text-sb-green hover:bg-sb-light transition-colors">
                                                    <Layers3 className="mr-1.5 size-3.5" /> Builder Soal
                                                </Link>
                                                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-sb-text-black hover:bg-sb-light/30" onClick={() => openModal('quiz', module.id, quiz, 'module')}>
                                                    <Edit2 className="mr-1.5 size-3.5" />
                                                    Edit
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" className={`h-[28px] px-2.5 text-[11px] border-[#edebe9] ${quiz.is_published ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-sb-green hover:text-sb-green hover:bg-sb-light'}`} onClick={() => router.patch(`/instructor/quizzes/${quiz.id}/toggle`, {}, { preserveScroll: true })}>
                                                    {quiz.is_published ? 'Unpublish' : 'Publish'}
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/quizzes/${quiz.id}`, { preserveScroll: true })}>
                                                    <Trash2 className="mr-1.5 size-3.5" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {module.assignments?.map((assignment) => (
                                    <div key={`assignment-${assignment.id}`} className={`bg-white relative border-b border-[#edebe9] ${expandedModules.has(module.id) ? '' : 'hidden'}`}>
                                        <div className="absolute left-[24px] top-0 h-full w-[2px] bg-[#edebe9]"></div>
                                        <div className="relative flex flex-col gap-2 py-3 pl-[48px] pr-4 md:flex-row md:items-center md:justify-between">
                                            <div className="absolute left-[24px] top-[24px] w-[16px] h-[2px] bg-[#edebe9]"></div>
                                            <div className="flex items-center gap-2">
                                                <ClipboardList className="size-4 text-sb-green" />
                                                <p className="text-[14px] font-medium text-sb-text-black">{assignment.title} <span className="text-[11px] font-normal text-sb-text-soft uppercase tracking-wider ml-1">(Tugas Tingkat Modul)</span></p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 relative z-10">
                                                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-sb-text-black hover:bg-sb-light/30" onClick={() => openModal('assignment', module.id, assignment, 'module')}>
                                                    <Edit2 className="mr-1.5 size-3.5" />
                                                    Edit
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" className={`h-[28px] px-2.5 text-[11px] border-[#edebe9] ${assignment.is_published ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-sb-green hover:text-sb-green hover:bg-sb-light'}`} onClick={() => router.patch(`/instructor/assignments/${assignment.id}/toggle`, {}, { preserveScroll: true })}>
                                                    {assignment.is_published ? 'Unpublish' : 'Publish'}
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/assignments/${assignment.id}`, { preserveScroll: true })}>
                                                    <Trash2 className="mr-1.5 size-3.5" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className={`flex flex-col border-t border-[#edebe9] divide-y divide-[#edebe9] ${expandedModules.has(module.id) ? '' : 'hidden'}`}>
                                    {module.materials.length === 0 && (
                                        <div className="relative p-4 pl-[48px] pr-4 bg-white">
                                            <div className="absolute left-[24px] top-0 h-full w-[2px] bg-[#edebe9]"></div>
                                            <div className="absolute left-[24px] top-[24px] w-[16px] h-[2px] bg-[#edebe9]"></div>
                                            <p className="text-[12px] text-sb-text-soft italic">Belum ada materi di modul ini.</p>
                                        </div>
                                    )}
                                    {module.materials.map((material) => (
                                        <div key={material.id} className="bg-white relative">
                                            <div className={`absolute left-[24px] top-0 w-[2px] bg-[#edebe9] ${expandedModules.has(module.id) ? 'h-full' : 'h-0'}`}></div>
                                            <div className="relative flex flex-col gap-2 py-3 pl-[48px] pr-4 md:flex-row md:items-center md:justify-between">
                                                <div className="absolute left-[24px] top-[24px] w-[16px] h-[2px] bg-[#edebe9]"></div>
                                                <div>
                                                    <p className="text-[14px] font-medium text-sb-text-black">{material.title}</p>
                                                    <p className="text-[12px] text-sb-text-soft">{material.contents.length} konten dilampirkan</p>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 relative z-10">
                                                    <Button type="button" variant="outline" size="sm" className="h-[28px] w-[28px] p-0 border-[#edebe9] text-sb-text-soft hover:text-sb-text-black" onClick={() => toggleMaterial(material.id)}>
                                                        {expandedMaterials.has(material.id) ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                                    </Button>
                                                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-sb-text-black hover:bg-sb-light/30" onClick={() => openModal('material', module.id, material)}>
                                                        <Edit2 className="mr-1.5 size-3.5" />
                                                        Edit
                                                    </Button>
                                                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] bg-sb-light/30 text-sb-green border-sb-green/30 hover:bg-sb-light hover:text-sb-green" onClick={() => openModal('content', material.id)}>
                                                        <Plus className="mr-1.5 size-3.5" /> Konten
                                                    </Button>
                                                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-sb-green/30 text-sb-green hover:bg-sb-light" onClick={() => openModal('quiz', material.id, null, 'material')}>
                                                        <HelpCircle className="mr-1.5 size-3.5" /> Quiz
                                                    </Button>
                                                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-sb-green/30 text-sb-green hover:bg-sb-light" onClick={() => openModal('assignment', material.id, null, 'material')}>
                                                        <ClipboardList className="mr-1.5 size-3.5" /> Tugas
                                                    </Button>
                                                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/materials/${material.id}`, { preserveScroll: true })}>
                                                        <Trash2 className="mr-1.5 size-3.5" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className={`bg-[#f9f9f9] border-t border-[#edebe9] ${expandedMaterials.has(material.id) ? '' : 'hidden'}`}>
                                                <ol className="flex flex-col divide-y divide-[#edebe9]">
                                                    {material.contents.map((content, cIdx) => {
                                                        const isLast = cIdx === material.contents.length - 1 && (!material.quizzes || material.quizzes.length === 0);
                                                        return (
                                                        <li key={content.id} className="relative flex items-center justify-between gap-3 py-2.5 pl-[80px] pr-4 bg-[#f9f9f9] hover:bg-[#f1f1f1] transition-colors">
                                                            <div className={`absolute left-[56px] top-0 w-[2px] bg-[#edebe9] ${isLast ? 'h-[18px]' : 'h-full'}`}></div>
                                                            <div className="absolute left-[56px] top-[18px] w-[16px] h-[2px] bg-[#edebe9]"></div>
                                                            <div className="flex items-center gap-2 relative z-10">
                                                                {getContentTypeIcon(content.type)}
                                                                <span className="text-[13px] font-medium text-sb-text-black">{content.title} <span className="text-[11px] font-normal text-sb-text-soft uppercase tracking-wider ml-1">({content.type})</span></span>
                                                            </div>
                                                            <div className="flex items-center gap-2 relative z-10">
                                                                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-sb-text-black hover:bg-sb-light/30" onClick={() => openModal('content', material.id, content)}>
                                                                    <Edit2 className="mr-1.5 size-3.5" />
                                                                    Edit
                                                                </Button>
                                                                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/contents/${content.id}`, { preserveScroll: true })}>
                                                                    <Trash2 className="mr-1.5 size-3.5" />
                                                                    Hapus
                                                                </Button>
                                                            </div>
                                                        </li>
                                                        );
                                                    })}
                                                    {material.quizzes?.map((quiz, qIdx) => {
                                                        const isLast = qIdx === material.quizzes.length - 1 && (!material.assignments || material.assignments.length === 0);
                                                        return (
                                                            <li key={`quiz-${quiz.id}`} className="relative flex items-center justify-between gap-3 py-2.5 pl-[80px] pr-4 bg-[#f9f9f9] hover:bg-[#f1f1f1] transition-colors">
                                                                <div className={`absolute left-[56px] top-0 w-[2px] bg-[#edebe9] ${isLast ? 'h-[18px]' : 'h-full'}`}></div>
                                                                <div className="absolute left-[56px] top-[18px] w-[16px] h-[2px] bg-[#edebe9]"></div>
                                                                <div className="flex items-center gap-2 relative z-10">
                                                                    <HelpCircle className="size-4 text-sb-green" />
                                                                    <span className="text-[13px] font-medium text-sb-text-black">{quiz.title} <span className="text-[11px] font-normal text-sb-text-soft uppercase tracking-wider ml-1">(Quiz)</span></span>
                                                                </div>
                                                                <div className="flex items-center gap-2 relative z-10">
                                                                    <Link href={`/instructor/quizzes/${quiz.id}/edit`} className="inline-flex h-[28px] items-center justify-center rounded-[6px] border border-sb-green bg-sb-light/30 px-2.5 text-[11px] font-semibold text-sb-green hover:bg-sb-light transition-colors">
                                                                        <Layers3 className="mr-1.5 size-3.5" /> Builder Soal
                                                                    </Link>
                                                                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-sb-text-black hover:bg-sb-light/30" onClick={() => openModal('quiz', material.id, quiz, 'material')}>
                                                                        <Edit2 className="mr-1.5 size-3.5" />
                                                                        Edit
                                                                    </Button>
                                                                    <Button type="button" variant="outline" size="sm" className={`h-[28px] px-2.5 text-[11px] border-[#edebe9] ${quiz.is_published ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-sb-green hover:text-sb-green hover:bg-sb-light'}`} onClick={() => router.patch(`/instructor/quizzes/${quiz.id}/toggle`, {}, { preserveScroll: true })}>
                                                                        {quiz.is_published ? 'Unpublish' : 'Publish'}
                                                                    </Button>
                                                                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/quizzes/${quiz.id}`, { preserveScroll: true })}>
                                                                        <Trash2 className="mr-1.5 size-3.5" />
                                                                        Hapus
                                                                    </Button>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                    {material.assignments?.map((assignment, aIdx) => {
                                                        const isLast = aIdx === material.assignments.length - 1;
                                                        return (
                                                            <li key={`assignment-${assignment.id}`} className="relative flex items-center justify-between gap-3 py-2.5 pl-[80px] pr-4 bg-[#f9f9f9] hover:bg-[#f1f1f1] transition-colors">
                                                                <div className={`absolute left-[56px] top-0 w-[2px] bg-[#edebe9] ${isLast ? 'h-[18px]' : 'h-full'}`}></div>
                                                                <div className="absolute left-[56px] top-[18px] w-[16px] h-[2px] bg-[#edebe9]"></div>
                                                                <div className="flex items-center gap-2 relative z-10">
                                                                    <ClipboardList className="size-4 text-sb-green" />
                                                                    <span className="text-[13px] font-medium text-sb-text-black">{assignment.title} <span className="text-[11px] font-normal text-sb-text-soft uppercase tracking-wider ml-1">(Tugas)</span></span>
                                                                </div>
                                                                <div className="flex items-center gap-2 relative z-10">
                                                                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-sb-text-black hover:bg-sb-light/30" onClick={() => openModal('assignment', material.id, assignment, 'material')}>
                                                                        <Edit2 className="mr-1.5 size-3.5" />
                                                                        Edit
                                                                    </Button>
                                                                    <Button type="button" variant="outline" size="sm" className={`h-[28px] px-2.5 text-[11px] border-[#edebe9] ${assignment.is_published ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-sb-green hover:text-sb-green hover:bg-sb-light'}`} onClick={() => router.patch(`/instructor/assignments/${assignment.id}/toggle`, {}, { preserveScroll: true })}>
                                                                        {assignment.is_published ? 'Unpublish' : 'Publish'}
                                                                    </Button>
                                                                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-[#edebe9] text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/assignments/${assignment.id}`, { preserveScroll: true })}>
                                                                        <Trash2 className="mr-1.5 size-3.5" />
                                                                        Hapus
                                                                    </Button>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                    <li className="relative flex items-center justify-between gap-3 py-2.5 pl-[80px] pr-4 bg-[#f9f9f9] hover:bg-[#f1f1f1] transition-colors cursor-pointer" onClick={() => openModal('discussion', material.id, material)}>
                                                        <div className="absolute left-[56px] top-0 h-[18px] w-[2px] bg-[#edebe9]"></div>
                                                        <div className="absolute left-[56px] top-[18px] w-[16px] h-[2px] bg-[#edebe9]"></div>
                                                        <div className="flex items-center gap-2 relative z-10">
                                                            <MessageSquare className="size-4 text-blue-600" />
                                                            <span className="text-[13px] font-medium text-sb-text-black">Diskusi Materi <span className="text-[11px] font-normal text-sb-text-soft uppercase tracking-wider ml-1">({material.discussions?.length || 0} post)</span></span>
                                                        </div>
                                                        <div className="flex items-center gap-2 relative z-10">
                                                            <span className="text-[11px] text-blue-600 font-semibold">Lihat diskusi →</span>
                                                        </div>
                                                    </li>
                                                    {material.contents.length === 0 && (!material.quizzes || material.quizzes.length === 0) && (!material.assignments || material.assignments.length === 0) && (
                                                        <div className="relative py-2.5 pl-[80px] pr-4 bg-[#f9f9f9]">
                                                            <div className="absolute left-[56px] top-0 h-[18px] w-[2px] bg-[#edebe9]"></div>
                                                            <div className="absolute left-[56px] top-[18px] w-[16px] h-[2px] bg-[#edebe9]"></div>
                                                            <p className="text-[12px] text-sb-text-soft italic">Materi ini masih kosong.</p>
                                                        </div>
                                                    )}
                                                </ol>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="relative p-3 pl-[48px] pr-4 bg-white">
                                        <div className="absolute left-[24px] top-0 h-[30px] w-[2px] bg-[#edebe9]"></div>
                                        <div className="absolute left-[24px] top-[30px] w-[16px] h-[2px] bg-[#edebe9]"></div>
                                        <Button onClick={() => openModal('material', module.id)} variant="outline" size="sm" className="w-full border-dashed text-sb-text-soft hover:text-sb-text-black hover:border-[#d6dbde] hover:bg-[#f9f9f9] relative z-10">
                                            <Plus className="mr-1.5 size-4" /> Tambah Materi Baru
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>

            {/* Modal Overlay */}
            {modalState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] tracking-[-0.01em]">
                    <div className="w-full max-w-md rounded-[12px] bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200" role="dialog" aria-modal="true">
                        <div className="flex items-center justify-between border-b border-[#edebe9] px-5 py-4">
                            <h3 className="text-[16px] font-semibold text-sb-text-black">
                                {modalState.type === 'module' && (editId ? 'Edit Modul' : 'Tambah Modul Baru')}
                                {modalState.type === 'material' && (editId ? 'Edit Materi' : 'Tambah Materi Baru')}
                                {modalState.type === 'content' && (editId ? 'Edit Konten' : 'Tambah Konten Pembelajaran')}
                                {modalState.type === 'quiz' && (editId ? 'Edit Quiz' : 'Tambah Quiz')}
                                {modalState.type === 'assignment' && (editId ? 'Edit Tugas' : 'Tambah Tugas')}
                                {modalState.type === 'discussion' && 'Diskusi Materi'}
                                {modalState.type === 'question' && (editId ? 'Edit Soal' : 'Tambah Soal Quiz')}
                            </h3>
                            <button onClick={closeModal} className="rounded-full p-1 text-sb-text-soft hover:bg-[#f9f9f9] hover:text-sb-text-black transition-colors">
                                <X className="size-5" />
                            </button>
                        </div>
                        <div className="p-5 max-h-[80vh] overflow-y-auto">
                            {modalState.type === 'module' && (
                                <form onSubmit={storeModule} className="space-y-4">
                                    <Field label="Judul Modul" id="module-title" error={moduleForm.errors.title}>
                                        <input id="module-title" value={moduleForm.data.title} onChange={(event) => moduleForm.setData('title', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" placeholder="Contoh: Pengantar Algoritma" />
                                    </Field>
                                    <Field label="Deskripsi (Opsional)" id="module-description" error={moduleForm.errors.description}>
                                        <textarea id="module-description" rows="3" value={moduleForm.data.description} onChange={(event) => moduleForm.setData('description', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" placeholder="Penjelasan singkat modul" />
                                    </Field>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                                        <Button type="submit" disabled={moduleForm.processing}>
                                            <CheckCircle2 className="mr-1.5 size-4" /> {editId ? 'Perbarui Modul' : 'Simpan Modul'}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {modalState.type === 'material' && (
                                <form onSubmit={storeMaterial} className="space-y-4">
                                    <Field label="Pilih Modul" id="material-module" error={materialForm.errors.module_id}>
                                        <select id="material-module" value={materialForm.data.module_id} onChange={(event) => materialForm.setData('module_id', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent">
                                            <option value="">-- Pilih modul --</option>
                                            {course.modules.map((module) => (
                                                <option key={module.id} value={module.id}>{module.title}</option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field label="Judul Materi" id="material-title" error={materialForm.errors.title}>
                                        <input id="material-title" value={materialForm.data.title} onChange={(event) => materialForm.setData('title', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" placeholder="Contoh: Konsep Dasar Array" />
                                    </Field>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                                        <Button type="submit" disabled={materialForm.processing || !materialForm.data.module_id}>
                                            <CheckCircle2 className="mr-1.5 size-4" /> {editId ? 'Perbarui Materi' : 'Simpan Materi'}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {modalState.type === 'content' && (
                                <form onSubmit={storeContent} className="space-y-4">
                                    <Field label="Format Konten" id="content-type" error={contentForm.errors.type}>
                                        <select id="content-type" value={contentForm.data.type} onChange={(event) => contentForm.setData('type', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent">
                                            <option value="artikel">Teks / Artikel</option>
                                            <option value="video">Video YouTube</option>
                                            <option value="audio">Audio / Podcast</option>
                                            <option value="pdf">Dokumen PDF</option>
                                            <option value="file">File Berkas</option>
                                        </select>
                                    </Field>
                                    <Field label="Judul Konten" id="content-title" error={contentForm.errors.title}>
                                        <input id="content-title" value={contentForm.data.title} onChange={(event) => contentForm.setData('title', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" />
                                    </Field>
                                    {contentForm.data.type === 'artikel' && (
                                        <Field label="Isi Artikel" id="content-body" error={contentForm.errors.body}>
                                            <textarea id="content-body" rows="4" value={contentForm.data.body} onChange={(event) => contentForm.setData('body', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" />
                                        </Field>
                                    )}
                                    {contentForm.data.type === 'video' && (
                                        <Field label="Tautan Video YouTube" id="content-url" error={contentForm.errors.url}>
                                            <input
                                                id="content-url"
                                                type="url"
                                                value={contentForm.data.url}
                                                onChange={(event) => contentForm.setData('url', event.target.value)}
                                                className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent"
                                                placeholder="https://youtube.com/watch?v=... atau https://youtu.be/..."
                                            />
                                            <VideoUrlPreview url={contentForm.data.url} className="mt-2" />
                                        </Field>
                                    )}
                                    {['audio', 'pdf', 'file'].includes(contentForm.data.type) && (
                                        <Field label="Unggah File" id="content-file" error={contentForm.errors.file}>
                                            <input id="content-file" type="file" onChange={(event) => contentForm.setData('file', event.target.files?.[0] ?? null)} className="w-full text-[13px] file:mr-3 file:rounded-[4px] file:border-0 file:bg-sb-light file:text-sb-green file:px-3 file:py-1.5 file:font-semibold cursor-pointer" />
                                        </Field>
                                    )}
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                                        <Button type="submit" disabled={contentForm.processing}>
                                            <CheckCircle2 className="mr-1.5 size-4" /> {editId ? 'Perbarui Konten' : 'Simpan Konten'}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {modalState.type === 'quiz' && (
                                <form onSubmit={storeQuiz} className="space-y-4">
                                    <Field label="Judul Quiz" id="quiz-title" error={quizForm.errors.title}>
                                        <input id="quiz-title" value={quizForm.data.title} onChange={(event) => quizForm.setData('title', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" />
                                    </Field>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Field label="Durasi (menit)" id="quiz-duration" error={quizForm.errors.duration}>
                                            <input id="quiz-duration" type="number" min="1" max="600" value={quizForm.data.duration} onChange={(event) => quizForm.setData('duration', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" />
                                        </Field>
                                        <Field label="Passing Score" id="quiz-passing-score" error={quizForm.errors.passing_score}>
                                            <input id="quiz-passing-score" type="number" min="0" max="100" value={quizForm.data.passing_score} onChange={(event) => quizForm.setData('passing_score', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" />
                                        </Field>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Field label="Maks. Percobaan" id="quiz-max-attempts" error={quizForm.errors.max_attempts}>
                                            <input id="quiz-max-attempts" type="number" min="1" max="10" value={quizForm.data.max_attempts} onChange={(event) => quizForm.setData('max_attempts', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" />
                                        </Field>
                                        <Field label="Mode Hasil" id="quiz-result-mode" error={quizForm.errors.result_mode}>
                                            <select id="quiz-result-mode" value={quizForm.data.result_mode} onChange={(event) => quizForm.setData('result_mode', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent">
                                                <option value="immediate">Langsung tampil</option>
                                                <option value="delayed">Ditunda</option>
                                                <option value="custom">Setelah dinilai</option>
                                            </select>
                                        </Field>
                                    </div>
                                    <label className="flex items-center gap-2 text-[13px] text-sb-text-soft">
                                        <input type="checkbox" checked={quizForm.data.is_published} onChange={(event) => quizForm.setData('is_published', event.target.checked)} className="size-4 rounded border-[#d6dbde] text-sb-green focus:ring-sb-accent" />
                                        Publish quiz
                                    </label>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                                        <Button type="submit" disabled={quizForm.processing}>
                                            <CheckCircle2 className="mr-1.5 size-4" /> {editId ? 'Perbarui Quiz' : 'Simpan Quiz'}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {modalState.type === 'assignment' && (
                                <form onSubmit={storeAssignment} className="space-y-4">
                                    <Field label="Judul Tugas" id="assignment-title" error={assignmentForm.errors.title}>
                                        <input id="assignment-title" value={assignmentForm.data.title} onChange={(event) => assignmentForm.setData('title', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" placeholder="Contoh: Tugas Akhir Modul 1" />
                                    </Field>
                                    <Field label="Deskripsi" id="assignment-description" error={assignmentForm.errors.description}>
                                        <textarea id="assignment-description" rows="3" value={assignmentForm.data.description} onChange={(event) => assignmentForm.setData('description', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" placeholder="Instruksi tugas untuk mahasiswa..." />
                                    </Field>
                                    <Field label="Deadline" id="assignment-deadline" error={assignmentForm.errors.deadline}>
                                        <input id="assignment-deadline" type="datetime-local" value={assignmentForm.data.deadline} onChange={(event) => assignmentForm.setData('deadline', event.target.value)} className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent" />
                                    </Field>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[13px] text-sb-text-soft">
                                            <input type="checkbox" checked={assignmentForm.data.allow_file} onChange={(event) => assignmentForm.setData('allow_file', event.target.checked)} className="size-4 rounded border-[#d6dbde] text-sb-green focus:ring-sb-accent" />
                                            Izinkan upload file
                                        </label>
                                        <label className="flex items-center gap-2 text-[13px] text-sb-text-soft">
                                            <input type="checkbox" checked={assignmentForm.data.allow_link} onChange={(event) => assignmentForm.setData('allow_link', event.target.checked)} className="size-4 rounded border-[#d6dbde] text-sb-green focus:ring-sb-accent" />
                                            Izinkan submit link
                                        </label>
                                        <label className="flex items-center gap-2 text-[13px] text-sb-text-soft">
                                            <input type="checkbox" checked={assignmentForm.data.is_published} onChange={(event) => assignmentForm.setData('is_published', event.target.checked)} className="size-4 rounded border-[#d6dbde] text-sb-green focus:ring-sb-accent" />
                                            Publish tugas
                                        </label>
                                    </div>
                                    {assignmentForm.errors.allow_file && <p className="text-[12px] text-red-600">{assignmentForm.errors.allow_file}</p>}
                                    {assignmentForm.errors.allow_link && <p className="text-[12px] text-red-600">{assignmentForm.errors.allow_link}</p>}
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                                        <Button type="submit" disabled={assignmentForm.processing}>
                                            <CheckCircle2 className="mr-1.5 size-4" /> {editId ? 'Perbarui Tugas' : 'Simpan Tugas'}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {modalState.type === 'discussion' && modalState.parentId && (
                                <InstructorDiscussionSection materialId={modalState.parentId} discussions={modalState.parentKind?.discussions || []} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </InstructorLayout>
    );
}

function InstructorDiscussionSection({ materialId, discussions }) {
    const { auth } = usePage().props;
    const form = useForm({ body: '', parent_id: null });
    const [replyingTo, setReplyingTo] = useState(null);

    const submitDiscussion = (event) => {
        event.preventDefault();
        form.post(`/materials/${materialId}/discussions`, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setReplyingTo(null);
                // Reload hanya data course, modal tetap terbuka
                router.reload({ 
                    only: ['course'],
                    preserveScroll: true,
                    preserveState: true,
                });
            },
        });
    };

    const handleDelete = (discussionId) => {
        if (!confirm('Yakin ingin menghapus diskusi ini?')) return;
        
        router.delete(`/discussions/${discussionId}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Reload hanya data course, modal tetap terbuka
                router.reload({ 
                    only: ['course'],
                    preserveScroll: true,
                    preserveState: true,
                });
            },
        });
    };

    const startReply = (discussionId) => {
        setReplyingTo(discussionId);
        form.setData('parent_id', discussionId);
    };

    const cancelReply = () => {
        setReplyingTo(null);
        form.setData({ body: '', parent_id: null });
    };

    return (
        <div>
            <div className="flex items-center gap-2 border-b border-[#edebe9] pb-3">
                <MessageSquare className="size-4 text-sb-green" aria-hidden="true" />
                <h5 className="text-[14px] font-semibold text-sb-text-black">Diskusi Materi</h5>
                <span className="ml-auto text-[12px] text-sb-text-soft">{discussions.length} diskusi</span>
            </div>

            <form onSubmit={submitDiscussion} className="mt-4 space-y-3">
                {replyingTo && (
                    <div className="flex items-center justify-between rounded-[6px] bg-sb-light px-3 py-2 text-[12px] text-sb-green">
                        <span>Membalas diskusi...</span>
                        <button type="button" onClick={cancelReply} className="text-sb-text-black hover:text-sb-text-soft">
                            Batal
                        </button>
                    </div>
                )}
                <textarea
                    value={form.data.body}
                    onChange={(e) => form.setData('body', e.target.value)}
                    rows="3"
                    placeholder={replyingTo ? 'Tulis balasan...' : 'Jawab pertanyaan mahasiswa atau beri komentar...'}
                    className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[13px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent"
                />
                {form.errors.body && <p role="alert" className="text-[12px] text-red-600">{form.errors.body}</p>}
                <Button type="submit" size="sm" disabled={form.processing}>
                    <Send className="mr-1.5 size-3.5" />
                    Kirim
                </Button>
            </form>

            <div className="mt-5 space-y-4">
                {discussions.length === 0 && (
                    <p className="text-center text-[12px] text-sb-text-soft">Belum ada diskusi di materi ini.</p>
                )}
                {discussions.map((discussion) => (
                    <article key={discussion.id} className="rounded-[8px] border border-[#edebe9] bg-[#f9f9f9] p-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-semibold text-blue-700">
                                    {discussion.user?.name?.slice(0, 2).toUpperCase() ?? 'U'}
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-sb-text-black">{discussion.user?.name ?? 'User'}</p>
                                    <p className="mt-1 whitespace-pre-line text-[13px] leading-6 text-sb-text-soft">{discussion.body}</p>
                                    <div className="mt-2 flex items-center gap-3 text-[11px] text-sb-text-soft">
                                        <span>{new Date(discussion.created_at).toLocaleString('id-ID')}</span>
                                        <button type="button" onClick={() => startReply(discussion.id)} className="font-semibold text-sb-green hover:text-sb-accent">
                                            Balas
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(discussion.id)}
                                            className="font-semibold text-red-600 hover:text-red-700"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {discussion.replies?.length > 0 && (
                            <div className="ml-10 mt-3 space-y-2 border-l-2 border-[#edebe9] pl-3">
                                {discussion.replies.map((reply) => (
                                    <div key={reply.id} className="rounded-[6px] bg-white p-3">
                                        <div className="flex items-start gap-2">
                                            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700">
                                                {reply.user?.name?.slice(0, 2).toUpperCase() ?? 'U'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[12px] font-semibold text-sb-text-black">{reply.user?.name ?? 'User'}</p>
                                                <p className="mt-1 whitespace-pre-line text-[12px] leading-5 text-sb-text-soft">{reply.body}</p>
                                                <div className="mt-2 flex items-center gap-3 text-[10px] text-sb-text-soft">
                                                    <span>{new Date(reply.created_at).toLocaleString('id-ID')}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(reply.id)}
                                                        className="font-semibold text-red-600 hover:text-red-700"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
}

function Badge({ label, value, className = '', tone = 'bg-[#f9f9f9] text-sb-text-black' }) {
    return (
        <div className="rounded-[8px] border border-[#edebe9] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <p className="text-[11px] text-sb-text-soft uppercase tracking-wider">{label}</p>
            <p className={`mt-0.5 text-[14px] font-semibold ${className} ${tone.includes('bg-') ? '' : 'text-sb-text-black'}`}>
                {tone.includes('bg-') ? <span className={`inline-block rounded-pill px-2 py-0.5 text-[11px] ${tone}`}>{value}</span> : value}
            </p>
        </div>
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
