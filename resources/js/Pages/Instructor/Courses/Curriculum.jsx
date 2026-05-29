import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { BookOpen, CheckCircle2, ClipboardList, Layers3, MessageSquare, Plus, Send, Trash2, Edit2, PlayCircle, FileText, FileAudio, File, X, ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
import { cloneElement, useState, useEffect } from 'react';

import InstructorLayout from '@/Layouts/InstructorLayout';
import CourseWorkspaceLayout from '@/components/instructor/CourseWorkspaceLayout';
import AssignmentFormModal from '@/components/instructor/AssignmentFormModal';
import { Button } from '@/components/ui/button';
import { VideoUrlPreview } from '@/components/shared/VideoPlayer';
import RichTextEditor from '@/components/shared/RichTextEditor';

export default function Curriculum({ course }) {
    const [modalState, setModalState] = useState({ isOpen: false, type: null, parentId: null });
    // Assignment modal state (using shared component)
    const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [assignmentParentType, setAssignmentParentType] = useState(null);
    const [assignmentParentId, setAssignmentParentId] = useState(null);

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

    const moduleForm = useForm({ title: '', description: '' });
    const materialForm = useForm({ module_id: '', title: '' });
    const contentForm = useForm({ material_id: '', type: 'artikel', title: '', body: '', url: '', file: null, file_path: '' });
    const quizForm = useForm(defaultQuizData());
    const [expandedModules, setExpandedModules] = useState(new Set());
    const [expandedMaterials, setExpandedMaterials] = useState(new Set());
    const [editId, setEditId] = useState(null);

    // Open assignment modal (for module-level or material-level assignments)
    const openAssignmentModal = (parentId, parentType, assignment = null) => {
        setAssignmentParentId(parentId);
        setAssignmentParentType(parentType);
        setEditingAssignment(assignment);
        setAssignmentModalOpen(true);
    };

    const closeAssignmentModal = () => {
        setAssignmentModalOpen(false);
        setEditingAssignment(null);
        setAssignmentParentType(null);
        setAssignmentParentId(null);
    };

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
            moduleForm.setData({ title: '', description: '' });
            moduleForm.clearErrors();
            materialForm.setData({ module_id: '', title: '' });
            materialForm.clearErrors();
            contentForm.setData({ material_id: '', type: 'artikel', title: '', body: '', url: '', file: null, file_path: '' });
            contentForm.clearErrors();
            quizForm.reset();
            quizForm.clearErrors();
            setEditId(null);
        } else if (modalState.parentId) {
            if (modalState.type === 'material') {
                materialForm.setData('module_id', modalState.parentId);
            } else if (modalState.type === 'content' && !editId) {
                contentForm.setData('material_id', modalState.parentId);
            } else if (modalState.type === 'quiz') {
                quizForm.setData(defaultQuizData(modalState.parentId, modalState.parentKind ?? 'module'));
            }
        }
    }, [modalState.isOpen, modalState.parentId, modalState.parentKind, modalState.type]);

    const openModal = (type, parentId = null, existingData = null, parentKind = null) => {
        // For assignments, use the shared modal component
        if (type === 'assignment') {
            openAssignmentModal(parentId, parentKind || 'module', existingData);
            return;
        }

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
                    file_path: existingData.file_path || '',
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
            }
        } else if (type === 'quiz') {
            quizForm.setData(defaultQuizData(parentId, parentKind ?? 'module'));
        }
    };

    const closeModal = () => {
        setModalState({ isOpen: false, type: null, parentId: null });
        setEditId(null);
    };

    const storeModule = (event) => {
        event.preventDefault();
        if (editId) {
            moduleForm.put(`/instructor/modules/${editId}`, {
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
            materialForm.put(`/instructor/materials/${editId}`, {
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
            contentForm.transform((data) => ({ ...data, _method: 'PUT' }));
            contentForm.post(`/instructor/contents/${editId}`, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => closeModal(),
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

    const getContentTypeIcon = (type) => {
        switch (type) {
            case 'video': return <PlayCircle className="size-4 text-[#006bd6]" />;
            case 'artikel': return <FileText className="size-4 text-forest" />;
            case 'audio': return <FileAudio className="size-4 text-[#5e2b97]" />;
            case 'pdf': return <File className="size-4 text-[#cc0000]" />;
            default: return <File className="size-4 text-fg-secondary" />;
        }
    };


    return (
        <InstructorLayout title={`${course.name} - Struktur Kurikulum`}>
            <Head title={`${course.name} - Struktur Kurikulum`} />

            <CourseWorkspaceLayout course={course}>
                <div className="w-full tracking-[-0.01em]">
                    <section aria-labelledby="builder-title" className="rounded-[10px] p-4 lg:p-5 shadow-[0_0_0.5px_rgba(0,0,0,0.14),_0_1px_1px_rgba(0,0,0,0.24)] bg-surface dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)]">
                        <div className="flex items-center justify-between border-b pb-4 border-ceramic dark:border-white/[0.07]">
                            <div className="flex items-center gap-3">
                                <div className="flex size-[36px] items-center justify-center rounded-[8px] bg-mint-light text-forest dark:bg-emerald-500/20 dark:text-emerald-400">
                                    <Layers3 className="size-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <h2 id="builder-title" className="text-[16px] font-semibold tracking-[-0.16px] text-fg-primary dark:text-white/90">
                                        Struktur Kurikulum
                                    </h2>
                                    <p className="text-[12px] text-fg-secondary dark:text-white/40">Kelola modul, materi, dan konten pembelajaran.</p>
                                </div>
                            </div>
                            <Button onClick={() => openModal('module')} size="sm" className="h-[36px]">
                                <Plus className="mr-1.5 size-4" /> Modul Baru
                            </Button>
                        </div>

                        <div className="mt-5 space-y-5">
                            {course.modules.length === 0 && <p className="rounded-[8px] border border-dashed p-5 text-center text-[13px] border-gray-300 text-fg-secondary dark:border-white/15 dark:text-white/35">Belum ada modul yang dibuat.</p>}
                            {course.modules.map((module) => (
                                <ModuleItem
                                    key={module.id}
                                    module={module}
                                    expandedModules={expandedModules}
                                    expandedMaterials={expandedMaterials}
                                    toggleModule={toggleModule}
                                    toggleMaterial={toggleMaterial}
                                    openModal={openModal}
                                    getContentTypeIcon={getContentTypeIcon}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </CourseWorkspaceLayout>

            {/* Modal Overlay */}
            {modalState.isOpen && (
                <ModalOverlay
                    modalState={modalState}
                    closeModal={closeModal}
                    editId={editId}
                    course={course}
                    moduleForm={moduleForm}
                    materialForm={materialForm}
                    contentForm={contentForm}
                    quizForm={quizForm}
                    storeModule={storeModule}
                    storeMaterial={storeMaterial}
                    storeContent={storeContent}
                    storeQuiz={storeQuiz}
                />
            )}

            {/* Assignment Modal (shared component) */}
            <AssignmentFormModal
                isOpen={assignmentModalOpen}
                onClose={closeAssignmentModal}
                assignment={editingAssignment}
                modules={course.modules}
                preselectedType={assignmentParentType}
                preselectedId={assignmentParentId}
                showParentSelect={false}
            />
        </InstructorLayout>
    );
}


function ModuleItem({ module, expandedModules, expandedMaterials, toggleModule, toggleMaterial, openModal, getContentTypeIcon }) {
    return (
        <article className="rounded-[8px] border overflow-hidden transition-all border-ceramic bg-white hover:border-gray-300 dark:border-white/[0.07] dark:bg-[#111a15] dark:hover:border-white/15">
            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between bg-slate-50 dark:bg-white/5">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-fg-secondary dark:text-white/35">Modul {module.order}</p>
                    <h3 className="text-[15px] font-semibold text-fg-primary dark:text-white/90">{module.title}</h3>
                    <p className="mt-0.5 text-[13px] text-fg-secondary dark:text-white/40">{module.description ?? 'Tanpa deskripsi'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="h-[28px] w-[28px] p-0 border-ceramic text-fg-secondary hover:text-fg-primary" onClick={() => toggleModule(module.id)}>
                        {expandedModules.has(module.id) ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-fg-primary hover:bg-mint-light/30" onClick={() => openModal('module', null, module)}>
                        <Edit2 className="mr-1.5 size-3.5" />Edit
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-forest/30 text-forest hover:bg-mint-light" onClick={() => openModal('quiz', module.id, null, 'module')}>
                        <HelpCircle className="mr-1.5 size-3.5" />Quiz
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-forest/30 text-forest hover:bg-mint-light" onClick={() => openModal('assignment', module.id, null, 'module')}>
                        <ClipboardList className="mr-1.5 size-3.5" />Tugas
                    </Button>
                    <Button type="button" variant="outline" size="sm" className={`h-[28px] px-2.5 text-[11px] ${module.is_published ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-forest/30 text-forest hover:bg-mint-light'}`} onClick={() => router.patch(`/instructor/modules/${module.id}/toggle`, {}, { preserveScroll: true })}>
                        {module.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/modules/${module.id}`, { preserveScroll: true })}>
                        <Trash2 className="mr-1.5 size-3.5" />Hapus
                    </Button>
                </div>
            </div>

            {/* Module Quizzes */}
            {module.quizzes?.map((quiz) => (
                <QuizItem key={quiz.id} quiz={quiz} parentId={module.id} parentKind="module" expanded={expandedModules.has(module.id)} openModal={openModal} />
            ))}

            {/* Module Assignments */}
            {module.assignments?.map((assignment) => (
                <AssignmentItem key={`assignment-${assignment.id}`} assignment={assignment} parentId={module.id} parentKind="module" expanded={expandedModules.has(module.id)} openModal={openModal} />
            ))}

            {/* Materials */}
            <div className={`flex flex-col border-t divide-y border-ceramic divide-ceramic dark:border-white/[0.07] dark:divide-white/[0.06] ${expandedModules.has(module.id) ? '' : 'hidden'}`}>
                {module.materials.length === 0 && (
                    <div className="relative p-4 pl-[48px] pr-4 bg-surface">
                        <div className="absolute left-[24px] top-0 h-full w-[2px] bg-ceramic dark:bg-white/10"></div>
                        <div className="absolute left-[24px] top-[24px] w-[16px] h-[2px] bg-ceramic dark:bg-white/10"></div>
                        <p className="text-[12px] text-fg-secondary italic">Belum ada materi di modul ini.</p>
                    </div>
                )}
                {module.materials.map((material) => (
                    <MaterialItem
                        key={material.id}
                        material={material}
                        moduleId={module.id}
                        expandedModules={expandedModules}
                        expandedMaterials={expandedMaterials}
                        toggleMaterial={toggleMaterial}
                        openModal={openModal}
                        getContentTypeIcon={getContentTypeIcon}
                    />
                ))}
                <div className="relative p-3 pl-[48px] pr-4 bg-surface">
                    <div className="absolute left-[24px] top-0 h-[30px] w-[2px] bg-ceramic"></div>
                    <div className="absolute left-[24px] top-[30px] w-[16px] h-[2px] bg-ceramic"></div>
                    <Button onClick={() => openModal('material', module.id)} variant="outline" size="sm" className="w-full border-dashed text-fg-secondary hover:text-fg-primary hover:border-gray-300 hover:bg-slate-50 relative z-10">
                        <Plus className="mr-1.5 size-4" /> Tambah Materi Baru
                    </Button>
                </div>
            </div>
        </article>
    );
}


function QuizItem({ quiz, parentId, parentKind, expanded, openModal }) {
    return (
        <div className={`relative border-b bg-white border-ceramic dark:bg-[#111a15] dark:border-white/[0.07] ${expanded ? '' : 'hidden'}`}>
            <div className="absolute left-[24px] top-0 h-full w-[2px] bg-ceramic dark:bg-white/10"></div>
            <div className="relative flex flex-col gap-2 py-3 pl-[48px] pr-4 md:flex-row md:items-center md:justify-between">
                <div className="absolute left-[24px] top-[24px] w-[16px] h-[2px] bg-ceramic dark:bg-white/10"></div>
                <div className="flex items-center gap-2">
                    <HelpCircle className="size-4 text-forest" />
                    <p className="text-[14px] font-medium text-fg-primary dark:text-white/80">{quiz.title} <span className="text-[11px] font-normal uppercase tracking-wider ml-1 text-fg-secondary dark:text-white/35">(Quiz Tingkat {parentKind === 'module' ? 'Modul' : 'Materi'})</span></p>
                </div>
                <div className="flex flex-wrap items-center gap-2 relative z-10">
                    <Link href={`/instructor/quizzes/${quiz.id}/edit`} className="inline-flex h-[28px] items-center justify-center rounded-[6px] border border-forest bg-mint-light/30 px-2.5 text-[11px] font-semibold text-forest hover:bg-mint-light transition-colors">
                        <Layers3 className="mr-1.5 size-3.5" /> Builder Soal
                    </Link>
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-fg-primary hover:bg-mint-light/30" onClick={() => openModal('quiz', parentId, quiz, parentKind)}>
                        <Edit2 className="mr-1.5 size-3.5" />Edit
                    </Button>
                    <Button type="button" variant="outline" size="sm" className={`h-[28px] px-2.5 text-[11px] border-ceramic ${quiz.is_published ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-forest hover:text-forest hover:bg-mint-light'}`} onClick={() => router.patch(`/instructor/quizzes/${quiz.id}/toggle`, {}, { preserveScroll: true })}>
                        {quiz.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/quizzes/${quiz.id}`, { preserveScroll: true })}>
                        <Trash2 className="mr-1.5 size-3.5" />Hapus
                    </Button>
                </div>
            </div>
        </div>
    );
}

function AssignmentItem({ assignment, parentId, parentKind, expanded, openModal }) {
    return (
        <div className={`relative border-b bg-white border-ceramic dark:bg-[#111a15] dark:border-white/[0.07] ${expanded ? '' : 'hidden'}`}>
            <div className="absolute left-[24px] top-0 h-full w-[2px] bg-ceramic dark:bg-white/10"></div>
            <div className="relative flex flex-col gap-2 py-3 pl-[48px] pr-4 md:flex-row md:items-center md:justify-between">
                <div className="absolute left-[24px] top-[24px] w-[16px] h-[2px] bg-ceramic dark:bg-white/10"></div>
                <div className="flex items-center gap-2">
                    <ClipboardList className="size-4 text-forest" />
                    <p className="text-[14px] font-medium text-fg-primary dark:text-white/80">{assignment.title} <span className="text-[11px] font-normal uppercase tracking-wider ml-1 text-fg-secondary dark:text-white/35">(Tugas Tingkat {parentKind === 'module' ? 'Modul' : 'Materi'})</span></p>
                </div>
                <div className="flex flex-wrap items-center gap-2 relative z-10">
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-fg-primary hover:bg-mint-light/30" onClick={() => openModal('assignment', parentId, assignment, parentKind)}>
                        <Edit2 className="mr-1.5 size-3.5" />Edit
                    </Button>
                    <Button type="button" variant="outline" size="sm" className={`h-[28px] px-2.5 text-[11px] border-ceramic ${assignment.is_published ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-forest hover:text-forest hover:bg-mint-light'}`} onClick={() => router.patch(`/instructor/assignments/${assignment.id}/toggle`, {}, { preserveScroll: true })}>
                        {assignment.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/assignments/${assignment.id}`, { preserveScroll: true })}>
                        <Trash2 className="mr-1.5 size-3.5" />Hapus
                    </Button>
                </div>
            </div>
        </div>
    );
}


function MaterialItem({ material, moduleId, expandedModules, expandedMaterials, toggleMaterial, openModal, getContentTypeIcon }) {
    return (
        <div className="relative bg-surface">
            <div className={`absolute left-[24px] top-0 w-[2px] bg-ceramic ${expandedModules.has(moduleId) ? 'h-full' : 'h-0'}`}></div>
            <div className="relative flex flex-col gap-2 py-3 pl-[48px] pr-4 md:flex-row md:items-center md:justify-between">
                <div className="absolute left-[24px] top-[24px] w-[16px] h-[2px] bg-ceramic dark:bg-white/10"></div>
                <div>
                    <p className="text-[14px] font-medium text-fg-primary dark:text-white/80">{material.title}</p>
                    <p className="text-[12px] text-fg-secondary dark:text-white/40">{material.contents.length} konten dilampirkan</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 relative z-10">
                    <Button type="button" variant="outline" size="sm" className="h-[28px] w-[28px] p-0 border-ceramic text-fg-secondary hover:text-fg-primary" onClick={() => toggleMaterial(material.id)}>
                        {expandedMaterials.has(material.id) ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-fg-primary hover:bg-mint-light/30" onClick={() => openModal('material', moduleId, material)}>
                        <Edit2 className="mr-1.5 size-3.5" />Edit
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] bg-mint-light/30 text-forest border-forest/30 hover:bg-mint-light hover:text-forest" onClick={() => openModal('content', material.id)}>
                        <Plus className="mr-1.5 size-3.5" /> Konten
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-forest/30 text-forest hover:bg-mint-light" onClick={() => openModal('quiz', material.id, null, 'material')}>
                        <HelpCircle className="mr-1.5 size-3.5" /> Quiz
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-forest/30 text-forest hover:bg-mint-light" onClick={() => openModal('assignment', material.id, null, 'material')}>
                        <ClipboardList className="mr-1.5 size-3.5" /> Tugas
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/materials/${material.id}`, { preserveScroll: true })}>
                        <Trash2 className="mr-1.5 size-3.5" />Hapus
                    </Button>
                </div>
            </div>
            <div className={`border-t bg-slate-50 border-ceramic dark:bg-white/5 dark:border-white/[0.07] ${expandedMaterials.has(material.id) ? '' : 'hidden'}`}>
                <ol className="flex flex-col divide-y divide-ceramic">
                    {material.contents.map((content, cIdx) => {
                        const hasQuizzes = material.quizzes && material.quizzes.length > 0;
                        const hasAssignments = material.assignments && material.assignments.length > 0;
                        const isLast = cIdx === material.contents.length - 1 && !hasQuizzes && !hasAssignments;
                        return (
                            <ContentItem key={content.id} content={content} materialId={material.id} isLast={isLast} openModal={openModal} getContentTypeIcon={getContentTypeIcon} />
                        );
                    })}
                    {material.quizzes?.map((quiz, qIdx) => {
                        const hasAssignments = material.assignments && material.assignments.length > 0;
                        const isLast = qIdx === material.quizzes.length - 1 && !hasAssignments;
                        return (
                            <MaterialQuizItem key={`quiz-${quiz.id}`} quiz={quiz} materialId={material.id} isLast={isLast} openModal={openModal} />
                        );
                    })}
                    {material.assignments?.map((assignment, aIdx) => {
                        const isLast = aIdx === material.assignments.length - 1;
                        return (
                            <MaterialAssignmentItem key={`assignment-${assignment.id}`} assignment={assignment} materialId={material.id} isLast={isLast} openModal={openModal} />
                        );
                    })}
                    <li className="relative flex items-center justify-between gap-3 py-2.5 pl-[80px] pr-4 transition-colors cursor-pointer bg-slate-50 hover:bg-[#f1f1f1] dark:bg-transparent dark:hover:bg-white/5" onClick={() => openModal('discussion', material.id, material)}>
                        <div className="absolute left-[56px] top-0 h-[18px] w-[2px] bg-ceramic"></div>
                        <div className="absolute left-[56px] top-[18px] w-[16px] h-[2px] bg-ceramic"></div>
                        <div className="flex items-center gap-2 relative z-10">
                            <MessageSquare className="size-4 text-blue-600" />
                            <span className="text-[13px] font-medium text-fg-primary dark:text-white/80">Diskusi Materi <span className="text-[11px] font-normal uppercase tracking-wider ml-1 text-fg-secondary dark:text-white/35">({material.discussions?.length || 0} post)</span></span>
                        </div>
                        <div className="flex items-center gap-2 relative z-10">
                            <span className="text-[11px] text-blue-600 font-semibold">Lihat diskusi</span>
                        </div>
                    </li>
                    {material.contents.length === 0 && (!material.quizzes || material.quizzes.length === 0) && (!material.assignments || material.assignments.length === 0) && (
                        <div className="relative py-2.5 pl-[80px] pr-4 bg-slate-50">
                            <div className="absolute left-[56px] top-0 h-[18px] w-[2px] bg-ceramic"></div>
                            <div className="absolute left-[56px] top-[18px] w-[16px] h-[2px] bg-ceramic"></div>
                            <p className="text-[12px] text-fg-secondary italic">Materi ini masih kosong.</p>
                        </div>
                    )}
                </ol>
            </div>
        </div>
    );
}


function ContentItem({ content, materialId, isLast, openModal, getContentTypeIcon }) {
    return (
        <li className="relative flex items-center justify-between gap-3 py-2.5 pl-[80px] pr-4 transition-colors bg-slate-50 hover:bg-[#f1f1f1] dark:bg-transparent dark:hover:bg-white/5">
            <div className={`absolute left-[56px] top-0 w-[2px] bg-ceramic ${isLast ? 'h-[18px]' : 'h-full'}`}></div>
            <div className="absolute left-[56px] top-[18px] w-[16px] h-[2px] bg-ceramic"></div>
            <div className="flex items-center gap-2 relative z-10">
                {getContentTypeIcon(content.type)}
                <span className="text-[13px] font-medium text-fg-primary dark:text-white/80">{content.title} <span className="text-[11px] font-normal uppercase tracking-wider ml-1 text-fg-secondary dark:text-white/35">({content.type})</span></span>
            </div>
            <div className="flex items-center gap-2 relative z-10">
                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-fg-primary hover:bg-mint-light/30" onClick={() => openModal('content', materialId, content)}>
                    <Edit2 className="mr-1.5 size-3.5" />Edit
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/contents/${content.id}`, { preserveScroll: true })}>
                    <Trash2 className="mr-1.5 size-3.5" />Hapus
                </Button>
            </div>
        </li>
    );
}

function MaterialQuizItem({ quiz, materialId, isLast, openModal }) {
    return (
        <li className="relative flex items-center justify-between gap-3 py-2.5 pl-[80px] pr-4 transition-colors bg-slate-50 hover:bg-[#f1f1f1] dark:bg-transparent dark:hover:bg-white/5">
            <div className={`absolute left-[56px] top-0 w-[2px] bg-ceramic ${isLast ? 'h-[18px]' : 'h-full'}`}></div>
            <div className="absolute left-[56px] top-[18px] w-[16px] h-[2px] bg-ceramic"></div>
            <div className="flex items-center gap-2 relative z-10">
                <HelpCircle className="size-4 text-forest" />
                <span className="text-[13px] font-medium text-fg-primary dark:text-white/80">{quiz.title} <span className="text-[11px] font-normal uppercase tracking-wider ml-1 text-fg-secondary dark:text-white/35">(Quiz)</span></span>
            </div>
            <div className="flex items-center gap-2 relative z-10">
                <Link href={`/instructor/quizzes/${quiz.id}/edit`} className="inline-flex h-[28px] items-center justify-center rounded-[6px] border border-forest bg-mint-light/30 px-2.5 text-[11px] font-semibold text-forest hover:bg-mint-light transition-colors">
                    <Layers3 className="mr-1.5 size-3.5" /> Builder Soal
                </Link>
                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-fg-primary hover:bg-mint-light/30" onClick={() => openModal('quiz', materialId, quiz, 'material')}>
                    <Edit2 className="mr-1.5 size-3.5" />Edit
                </Button>
                <Button type="button" variant="outline" size="sm" className={`h-[28px] px-2.5 text-[11px] border-ceramic ${quiz.is_published ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-forest hover:text-forest hover:bg-mint-light'}`} onClick={() => router.patch(`/instructor/quizzes/${quiz.id}/toggle`, {}, { preserveScroll: true })}>
                    {quiz.is_published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/quizzes/${quiz.id}`, { preserveScroll: true })}>
                    <Trash2 className="mr-1.5 size-3.5" />Hapus
                </Button>
            </div>
        </li>
    );
}

function MaterialAssignmentItem({ assignment, materialId, isLast, openModal }) {
    return (
        <li className="relative flex items-center justify-between gap-3 py-2.5 pl-[80px] pr-4 transition-colors bg-slate-50 hover:bg-[#f1f1f1] dark:bg-transparent dark:hover:bg-white/5">
            <div className={`absolute left-[56px] top-0 w-[2px] bg-ceramic ${isLast ? 'h-[18px]' : 'h-full'}`}></div>
            <div className="absolute left-[56px] top-[18px] w-[16px] h-[2px] bg-ceramic"></div>
            <div className="flex items-center gap-2 relative z-10">
                <ClipboardList className="size-4 text-forest" />
                <span className="text-[13px] font-medium text-fg-primary dark:text-white/80">{assignment.title} <span className="text-[11px] font-normal uppercase tracking-wider ml-1 text-fg-secondary dark:text-white/35">(Tugas)</span></span>
            </div>
            <div className="flex items-center gap-2 relative z-10">
                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-fg-primary hover:bg-mint-light/30" onClick={() => openModal('assignment', materialId, assignment, 'material')}>
                    <Edit2 className="mr-1.5 size-3.5" />Edit
                </Button>
                <Button type="button" variant="outline" size="sm" className={`h-[28px] px-2.5 text-[11px] border-ceramic ${assignment.is_published ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-forest hover:text-forest hover:bg-mint-light'}`} onClick={() => router.patch(`/instructor/assignments/${assignment.id}/toggle`, {}, { preserveScroll: true })}>
                    {assignment.is_published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-[28px] px-2.5 text-[11px] border-ceramic text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.delete(`/instructor/assignments/${assignment.id}`, { preserveScroll: true })}>
                    <Trash2 className="mr-1.5 size-3.5" />Hapus
                </Button>
            </div>
        </li>
    );
}

function ModalOverlay({ modalState, closeModal, editId, course, moduleForm, materialForm, contentForm, quizForm, storeModule, storeMaterial, storeContent, storeQuiz }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] tracking-[-0.01em]">
            <div className={`w-full rounded-[12px] shadow-xl ring-1 animate-in fade-in zoom-in-95 duration-200 bg-white ring-black/5 dark:bg-[#111a15] dark:ring-white/10 ${modalState.type === 'content' ? 'max-w-2xl' : 'max-w-md'}`} role="dialog" aria-modal="true">
                <div className="flex items-center justify-between border-b px-5 py-4 border-ceramic dark:border-white/[0.07]">
                    <h3 className="text-[16px] font-semibold text-fg-primary dark:text-white/90">
                        {modalState.type === 'module' && (editId ? 'Edit Modul' : 'Tambah Modul Baru')}
                        {modalState.type === 'material' && (editId ? 'Edit Materi' : 'Tambah Materi Baru')}
                        {modalState.type === 'content' && (editId ? 'Edit Konten' : 'Tambah Konten Pembelajaran')}
                        {modalState.type === 'quiz' && (editId ? 'Edit Quiz' : 'Tambah Quiz')}
                        {modalState.type === 'discussion' && 'Diskusi Materi'}
                    </h3>
                    <button onClick={closeModal} className="rounded-full p-1 transition-colors text-fg-secondary hover:bg-slate-50 hover:text-fg-primary dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white/80">
                        <X className="size-5" />
                    </button>
                </div>
                <div className={`p-5 overflow-y-auto ${modalState.type === 'content' ? 'max-h-[85vh]' : 'max-h-[80vh]'}`}>
                    {modalState.type === 'module' && (
                        <ModuleForm form={moduleForm} onSubmit={storeModule} onCancel={closeModal} editId={editId} />
                    )}
                    {modalState.type === 'material' && (
                        <MaterialForm form={materialForm} onSubmit={storeMaterial} onCancel={closeModal} editId={editId} course={course} parentId={modalState.parentId} />
                    )}
                    {modalState.type === 'content' && (
                        <ContentForm form={contentForm} onSubmit={storeContent} onCancel={closeModal} editId={editId} />
                    )}
                    {modalState.type === 'quiz' && (
                        <QuizForm form={quizForm} onSubmit={storeQuiz} onCancel={closeModal} editId={editId} />
                    )}
                    {modalState.type === 'discussion' && modalState.parentId && (
                        <InstructorDiscussionSection materialId={modalState.parentId} discussions={modalState.parentKind?.discussions || []} />
                    )}
                </div>
            </div>
        </div>
    );
}

function ModuleForm({ form, onSubmit, onCancel, editId }) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Judul Modul" id="module-title" error={form.errors.title}>
                <input id="module-title" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" placeholder="Contoh: Pengantar Algoritma" />
            </Field>
            <Field label="Deskripsi (Opsional)" id="module-description" error={form.errors.description}>
                <textarea id="module-description" rows="3" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" placeholder="Penjelasan singkat modul" />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
                <Button type="submit" disabled={form.processing}>
                    <CheckCircle2 className="mr-1.5 size-4" /> {editId ? 'Perbarui Modul' : 'Simpan Modul'}
                </Button>
            </div>
        </form>
    );
}


function MaterialForm({ form, onSubmit, onCancel, editId, course, parentId }) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {!parentId && (
                <Field label="Pilih Modul" id="material-module" error={form.errors.module_id}>
                    <select id="material-module" value={form.data.module_id} onChange={(e) => form.setData('module_id', e.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60">
                        <option value="">-- Pilih modul --</option>
                        {course.modules.map((module) => (
                            <option key={module.id} value={module.id}>{module.title}</option>
                        ))}
                    </select>
                </Field>
            )}
            <Field label="Judul Materi" id="material-title" error={form.errors.title}>
                <input id="material-title" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" placeholder="Contoh: Konsep Dasar Array" />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
                <Button type="submit" disabled={form.processing || !form.data.module_id}>
                    <CheckCircle2 className="mr-1.5 size-4" /> {editId ? 'Perbarui Materi' : 'Simpan Materi'}
                </Button>
            </div>
        </form>
    );
}

function ContentForm({ form, onSubmit, onCancel, editId }) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Format Konten" id="content-type" error={form.errors.type}>
                <select id="content-type" value={form.data.type} disabled={!!editId} onChange={(e) => form.setData('type', e.target.value)} className={`w-full rounded-[6px] border border-gray-300 px-3 py-2 text-[13px] text-fg-primary outline-none focus:border-mint focus:ring-1 focus:ring-mint ${editId ? 'bg-slate-50 cursor-not-allowed opacity-60' : ''}`}>
                    <option value="artikel">Teks / Artikel</option>
                    <option value="video">Video YouTube</option>
                    <option value="audio">Audio / Podcast</option>
                    <option value="pdf">Dokumen PDF</option>
                    <option value="file">File Berkas</option>
                </select>
            </Field>
            <Field label="Judul Konten" id="content-title" error={form.errors.title}>
                <input id="content-title" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" />
            </Field>
            {form.data.type === 'artikel' && (
                <Field label="Isi Artikel" id="content-body" error={form.errors.body}>
                    <RichTextEditor value={form.data.body} onChange={(html) => form.setData('body', html)} />
                </Field>
            )}
            {form.data.type === 'video' && (
                <div>
                    <Field label="Tautan Video YouTube" id="content-url" error={form.errors.url}>
                        <input id="content-url" type="url" value={form.data.url} onChange={(e) => form.setData('url', e.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" placeholder="https://youtube.com/watch?v=... atau https://youtu.be/..." />
                    </Field>
                    {form.data.url && <VideoUrlPreview url={form.data.url} className="mt-2" />}
                </div>
            )}
            {['audio', 'pdf', 'file'].includes(form.data.type) && (
                <div>
                    <Field label="Unggah File" id="content-file" error={form.errors.file}>
                        <input id="content-file" type="file" accept={form.data.type === 'audio' ? 'audio/*' : form.data.type === 'pdf' ? '.pdf' : undefined} onChange={(e) => form.setData('file', e.target.files?.[0] ?? null)} className="w-full text-[13px] file:mr-3 file:rounded-[4px] file:border-0 file:bg-mint-light file:text-forest file:px-3 file:py-1.5 file:font-semibold cursor-pointer" />
                    </Field>
                    {editId && form.data.file_path && (
                        <p className="text-xs text-fg-secondary mt-1">File saat ini: {form.data.file_path.split('/').pop()}</p>
                    )}
                    <p className="text-xs text-fg-secondary mt-1">Maksimal 50 MB</p>
                </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
                <Button type="submit" disabled={form.processing}>
                    <CheckCircle2 className="mr-1.5 size-4" /> {editId ? 'Perbarui Konten' : 'Simpan Konten'}
                </Button>
            </div>
        </form>
    );
}


function QuizForm({ form, onSubmit, onCancel, editId }) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Judul Quiz" id="quiz-title" error={form.errors.title}>
                <input id="quiz-title" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Durasi (menit)" id="quiz-duration" error={form.errors.duration}>
                    <input id="quiz-duration" type="number" min="1" max="600" value={form.data.duration} onChange={(e) => form.setData('duration', e.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" />
                </Field>
                <Field label="Passing Score" id="quiz-passing-score" error={form.errors.passing_score}>
                    <input id="quiz-passing-score" type="number" min="0" max="100" value={form.data.passing_score} onChange={(e) => form.setData('passing_score', e.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" />
                </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Maks. Percobaan" id="quiz-max-attempts" error={form.errors.max_attempts}>
                    <input id="quiz-max-attempts" type="number" min="1" max="10" value={form.data.max_attempts} onChange={(e) => form.setData('max_attempts', e.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" />
                </Field>
                <Field label="Mode Hasil" id="quiz-result-mode" error={form.errors.result_mode}>
                    <select id="quiz-result-mode" value={form.data.result_mode} onChange={(e) => form.setData('result_mode', e.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60">
                        <option value="immediate">Langsung tampil</option>
                        <option value="delayed">Ditunda</option>
                        <option value="custom">Setelah dinilai</option>
                    </select>
                </Field>
            </div>
            <label className="flex items-center gap-2 text-[13px] text-fg-secondary">
                <input type="checkbox" checked={form.data.is_published} onChange={(e) => form.setData('is_published', e.target.checked)} className="size-4 rounded border-gray-300 text-forest focus:ring-mint" />
                Publish quiz
            </label>
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
                <Button type="submit" disabled={form.processing}>
                    <CheckCircle2 className="mr-1.5 size-4" /> {editId ? 'Perbarui Quiz' : 'Simpan Quiz'}
                </Button>
            </div>
        </form>
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
                router.reload({ only: ['course'], preserveScroll: true, preserveState: true });
            },
        });
    };

    const handleDelete = (discussionId) => {
        if (!confirm('Yakin ingin menghapus diskusi ini?')) return;
        router.delete(`/discussions/${discussionId}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['course'], preserveScroll: true, preserveState: true });
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
            <div className="flex items-center gap-2 border-b pb-3 border-ceramic dark:border-white/[0.07]">
                <MessageSquare className="size-4 text-forest" aria-hidden="true" />
                <h5 className="text-[14px] font-semibold text-fg-primary dark:text-white/90">Diskusi Materi</h5>
                <span className="ml-auto text-[12px] text-fg-secondary dark:text-white/35">{discussions.length} diskusi</span>
            </div>

            <form onSubmit={submitDiscussion} className="mt-4 space-y-3">
                {replyingTo && (
                    <div className="flex items-center justify-between rounded-[6px] px-3 py-2 text-[12px] bg-mint-light text-forest dark:bg-emerald-500/15 dark:text-emerald-400">
                        <span>Membalas diskusi...</span>
                        <button type="button" onClick={cancelReply} className="text-fg-primary hover:text-fg-secondary">Batal</button>
                    </div>
                )}
                <textarea value={form.data.body} onChange={(e) => form.setData('body', e.target.value)} rows="3" placeholder={replyingTo ? 'Tulis balasan...' : 'Jawab pertanyaan mahasiswa atau beri komentar...'} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" />
                {form.errors.body && <p role="alert" className="text-[12px] text-red-600">{form.errors.body}</p>}
                <Button type="submit" size="sm" disabled={form.processing}>
                    <Send className="mr-1.5 size-3.5" />Kirim
                </Button>
            </form>

            <div className="mt-5 space-y-4">
                {discussions.length === 0 && (
                    <p className="text-center text-[12px] text-fg-secondary dark:text-white/35">Belum ada diskusi di materi ini.</p>
                )}
                {discussions.map((discussion) => (
                    <article key={discussion.id} className="rounded-[8px] border p-3 border-ceramic bg-slate-50 dark:border-white/[0.07] dark:bg-white/5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                    {discussion.user?.name?.slice(0, 2).toUpperCase() ?? 'U'}
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-fg-primary dark:text-white/80">{discussion.user?.name ?? 'User'}</p>
                                    <p className="mt-1 whitespace-pre-line text-[13px] leading-6 text-fg-secondary dark:text-white/45">{discussion.body}</p>
                                    <div className="mt-2 flex items-center gap-3 text-[11px] text-fg-secondary dark:text-white/30">
                                        <span>{new Date(discussion.created_at).toLocaleString('id-ID')}</span>
                                        <button type="button" onClick={() => startReply(discussion.id)} className="font-semibold text-forest hover:text-mint">Balas</button>
                                        <button type="button" onClick={() => handleDelete(discussion.id)} className="font-semibold text-red-600 hover:text-red-700">Hapus</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {discussion.replies?.length > 0 && (
                            <div className="ml-10 mt-3 space-y-2 border-l-2 border-ceramic pl-3">
                                {discussion.replies.map((reply) => (
                                    <div key={reply.id} className="rounded-[6px] p-3 bg-white dark:bg-white/5">
                                        <div className="flex items-start gap-2">
                                            <div className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/60">
                                                {reply.user?.name?.slice(0, 2).toUpperCase() ?? 'U'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[12px] font-semibold text-fg-primary dark:text-white/80">{reply.user?.name ?? 'User'}</p>
                                                <p className="mt-1 whitespace-pre-line text-[12px] leading-5 text-fg-secondary dark:text-white/45">{reply.body}</p>
                                                <div className="mt-2 flex items-center gap-3 text-[10px] text-fg-secondary dark:text-white/30">
                                                    <span>{new Date(reply.created_at).toLocaleString('id-ID')}</span>
                                                    <button type="button" onClick={() => handleDelete(reply.id)} className="font-semibold text-red-600 hover:text-red-700">Hapus</button>
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

function Field({ label, id, error, children }) {
    const describedBy = error ? `${id}-error` : undefined;
    return (
        <div>
            <label htmlFor={id} className="text-[12px] font-semibold mb-1.5 block text-fg-primary dark:text-white/70">{label}</label>
            <div>
                {cloneElement(children, { 'aria-describedby': describedBy, 'aria-invalid': Boolean(error) })}
            </div>
            {error && <p id={describedBy} role="alert" className="mt-1.5 text-[11px] text-red-600">{error}</p>}
        </div>
    );
}


