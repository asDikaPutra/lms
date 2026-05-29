import { Head, router, useForm } from '@inertiajs/react';
import { 
    Settings as SettingsIcon, 
    BookOpen, 
    Eye, 
    GraduationCap, 
    ClipboardList, 
    HelpCircle, 
    BarChart3, 
    MessageSquare, 
    Users, 
    Moon, 
    AlertTriangle,
    Save,
    RefreshCw,
    Archive,
    Trash2,
    CheckCircle2,
    Info,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import InstructorLayout from '@/Layouts/InstructorLayout';
import CourseWorkspaceLayout from '@/components/instructor/CourseWorkspaceLayout';
import { Button } from '@/components/ui/button';
import { FilterButton } from '@/components/ui/filter-button';
import { ConfirmDialog } from '@/components/ui/modal';
import { TextField, TextArea, SelectField } from '@/components/ui/text-field';

export default function Settings({ course, settings, stats }) {
    const [activeSection, setActiveSection] = useState('basic');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        visibility: true,
        learning: true,
        assignments: true,
        quizzes: true,
        grades: true,
        discussions: true,
        participants: true,
        islamic: true,
        danger: true,
    });

    const sections = [
        { id: 'basic', label: 'Informasi Dasar', icon: BookOpen },
        { id: 'visibility', label: 'Status & Visibilitas', icon: Eye },
        { id: 'learning', label: 'Struktur Pembelajaran', icon: GraduationCap },
        { id: 'assignments', label: 'Kebijakan Tugas', icon: ClipboardList },
        { id: 'quizzes', label: 'Kebijakan Kuis', icon: HelpCircle },
        { id: 'grades', label: 'Pengaturan Nilai', icon: BarChart3 },
        { id: 'discussions', label: 'Pengaturan Diskusi', icon: MessageSquare },
        { id: 'participants', label: 'Pengaturan Peserta', icon: Users },
        { id: 'islamic', label: 'Islamic LMS', icon: Moon },
        { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
    ];

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    return (
        <InstructorLayout title={`${course.name} - Pengaturan`}>
            <Head title={`${course.name} - Pengaturan`} />

            <CourseWorkspaceLayout course={course}>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-content-primary">Pengaturan</h2>
                            <p className="text-sm text-content-secondary mt-1">Atur konfigurasi kursus ini.</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-content-secondary">
                                <span className="font-medium">{course.name}</span>
                                <span>·</span>
                                <span className="font-mono">{course.code}</span>
                                {course.semester && (
                                    <>
                                        <span>·</span>
                                        <span>{course.semester}</span>
                                    </>
                                )}
                                <span>·</span>
                                <StatusBadge status={course.status || (course.is_active ? 'active' : 'archived')} />
                            </div>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div className="rounded-xl shadow-sm border p-1.5 overflow-x-auto
                        bg-white border-neutral-100
                        dark:bg-[#111a15] dark:border-white/[0.07]">
                        <nav className="flex gap-1 min-w-max">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeSection === section.id;
                                return (
                                    <FilterButton
                                        key={section.id}
                                        active={isActive}
                                        onClick={() => {
                                            setActiveSection(section.id);
                                            document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        className={section.id === 'danger' && !isActive
                                            ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 border-transparent'
                                            : undefined
                                        }
                                    >
                                        <Icon className="size-4" />
                                        {section.label}
                                    </FilterButton>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Settings Sections */}
                    <div className="space-y-6">
                        <BasicInfoSection 
                            course={course} 
                            expanded={expandedSections.basic}
                            onToggle={() => toggleSection('basic')}
                        />
                        <VisibilitySection 
                            course={course} 
                            expanded={expandedSections.visibility}
                            onToggle={() => toggleSection('visibility')}
                        />
                        <LearningSection 
                            course={course} 
                            settings={settings} 
                            expanded={expandedSections.learning}
                            onToggle={() => toggleSection('learning')}
                        />
                        <AssignmentsSection 
                            course={course} 
                            settings={settings} 
                            expanded={expandedSections.assignments}
                            onToggle={() => toggleSection('assignments')}
                        />
                        <QuizzesSection 
                            course={course} 
                            settings={settings} 
                            expanded={expandedSections.quizzes}
                            onToggle={() => toggleSection('quizzes')}
                        />
                        <GradesSection 
                            course={course} 
                            settings={settings} 
                            expanded={expandedSections.grades}
                            onToggle={() => toggleSection('grades')}
                        />
                        <DiscussionsSection 
                            course={course} 
                            settings={settings} 
                            expanded={expandedSections.discussions}
                            onToggle={() => toggleSection('discussions')}
                        />
                        <ParticipantsSection 
                            course={course} 
                            settings={settings} 
                            expanded={expandedSections.participants}
                            onToggle={() => toggleSection('participants')}
                        />
                        <IslamicSection 
                            course={course} 
                            settings={settings} 
                            expanded={expandedSections.islamic}
                            onToggle={() => toggleSection('islamic')}
                        />
                        <DangerZoneSection 
                            course={course} 
                            stats={stats}
                            expanded={expandedSections.danger}
                            onToggle={() => toggleSection('danger')}
                            showDeleteConfirm={showDeleteConfirm}
                            setShowDeleteConfirm={setShowDeleteConfirm}
                            showArchiveConfirm={showArchiveConfirm}
                            setShowArchiveConfirm={setShowArchiveConfirm}
                            deleteConfirmText={deleteConfirmText}
                            setDeleteConfirmText={setDeleteConfirmText}
                        />
                    </div>
                </div>
            </CourseWorkspaceLayout>
        </InstructorLayout>
    );
}

function StatusBadge({ status }) {
    const configs = {
        draft: { label: 'Draft', className: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
        active: { label: 'Aktif', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        closed: { label: 'Selesai', className: 'bg-amber-100 text-amber-700 border-amber-200' },
        archived: { label: 'Arsip', className: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
    };
    const config = configs[status] || configs.draft;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.className}`}>
            {config.label}
        </span>
    );
}

function SectionCard({ id, title, description, icon: Icon, children, expanded, onToggle, variant = 'default' }) {
    const variants = {
        default: 'border-line-subtle',
        danger: 'border-red-200 bg-red-50/30 dark:border-red-500/30 dark:bg-red-500/5',
    };

    return (
        <motion.div
            id={`section-${id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl shadow-sm border overflow-hidden scroll-mt-6
                bg-surface
                ${variants[variant]}`}
        >
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-5 text-left transition-colors ${
                    variant === 'danger'
                        ? 'hover:bg-red-50 dark:hover:bg-red-500/8'
                        : 'hover:bg-neutral-50 dark:hover:bg-white/5'
                }`}
            >
                <div className="flex items-center gap-4">
                    <div className={`flex size-10 items-center justify-center rounded-xl ${
                        variant === 'danger' 
                            ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' 
                            : 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 dark:from-emerald-500/20 dark:to-teal-500/20 dark:text-emerald-400'
                    }`}>
                        <Icon className="size-5" />
                    </div>
                    <div>
                        <h3 className={`text-lg font-semibold ${variant === 'danger' ? 'text-red-900 dark:text-red-300' : 'text-content-primary'}`}>
                            {title}
                        </h3>
                        <p className={`text-sm ${variant === 'danger' ? 'text-red-600 dark:text-red-400/70' : 'text-content-secondary'}`}>
                            {description}
                        </p>
                    </div>
                </div>
                {expanded
                    ? <ChevronUp className="size-5 text-content-muted" />
                    : <ChevronDown className="size-5 text-content-muted" />
                }
            </button>
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-0 border-t border-line-subtle">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function Toggle({ checked, onChange, label, description }) {
    return (
        <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
                <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
                <div className="w-10 h-6 rounded-full transition-colors bg-neutral-200 peer-checked:bg-emerald-500 dark:bg-white/15 dark:peer-checked:bg-emerald-500" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
            </div>
            <div className="flex-1">
                <span className="text-sm font-medium text-content-primary group-hover:text-neutral-900 dark:group-hover:text-white/90">{label}</span>
                {description && <p className="text-xs text-content-secondary mt-0.5">{description}</p>}
            </div>
        </label>
    );
}

function SaveButton({ processing, onClick }) {
    return (
        <Button 
            onClick={onClick} 
            disabled={processing}
            className="gap-2"
        >
            {processing ? (
                <RefreshCw className="size-4 animate-spin" />
            ) : (
                <Save className="size-4" />
            )}
            Simpan Perubahan
        </Button>
    );
}

function SuccessMessage({ show }) {
    if (!show) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-emerald-600"
        >
            <CheckCircle2 className="size-4" />
            Tersimpan
        </motion.div>
    );
}


// ============================================
// SECTION: Basic Info
// ============================================
function BasicInfoSection({ course, expanded, onToggle }) {
    const [saved, setSaved] = useState(false);
    const form = useForm({
        name: course.name || '',
        code: course.code || '',
        description: course.description || '',
        semester: course.semester || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.patch(`/instructor/courses/${course.id}/settings`, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            },
        });
    };

    return (
        <SectionCard
            id="basic"
            title="Informasi Dasar"
            description="Nama, kode, dan deskripsi kursus"
            icon={BookOpen}
            expanded={expanded}
            onToggle={onToggle}
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <TextField
                        label="Nama Kursus"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="Contoh: Tafsir Al-Quran"
                        error={form.errors.name}
                    />
                    <TextField
                        label="Kode Kursus"
                        value={form.data.code}
                        onChange={(e) => form.setData('code', e.target.value)}
                        placeholder="Contoh: FAI301"
                        error={form.errors.code}
                    />
                </div>
                <TextField
                    label="Semester / Periode"
                    value={form.data.semester}
                    onChange={(e) => form.setData('semester', e.target.value)}
                    placeholder="Contoh: Ganjil 2025/2026"
                    error={form.errors.semester}
                />
                <TextArea
                    label="Deskripsi Kursus"
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    placeholder="Deskripsi singkat tentang kursus ini..."
                    rows={4}
                    error={form.errors.description}
                />
                <div className="flex items-center justify-between pt-2">
                    <SuccessMessage show={saved} />
                    <SaveButton processing={form.processing} onClick={handleSubmit} />
                </div>
            </form>
        </SectionCard>
    );
}

// ============================================
// SECTION: Status & Visibility
// ============================================
function VisibilitySection({ course, expanded, onToggle }) {
    const [saved, setSaved] = useState(false);
    const form = useForm({
        status: course.status || (course.is_active ? 'active' : 'archived'),
        is_visible: course.is_visible ?? true,
        start_date: course.start_date || '',
        end_date: course.end_date || '',
        enrollment_type: course.enrollment_type || 'auto',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.patch(`/instructor/courses/${course.id}/settings`, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            },
        });
    };

    const regenerateCode = () => {
        router.patch(`/instructor/courses/${course.id}/regenerate-code`, {}, { preserveScroll: true });
    };

    return (
        <SectionCard
            id="visibility"
            title="Status & Visibilitas"
            description="Atur akses dan periode kursus"
            icon={Eye}
            expanded={expanded}
            onToggle={onToggle}
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <SelectField
                        label="Status Kursus"
                        description="Tentukan status aktif kursus"
                        value={form.data.status}
                        onChange={(e) => form.setData('status', e.target.value)}
                        error={form.errors.status}
                    >
                        <option value="draft">Draft - Belum dipublikasikan</option>
                        <option value="active">Aktif - Dapat diakses mahasiswa</option>
                        <option value="closed">Selesai - Tidak menerima aktivitas baru</option>
                        <option value="archived">Arsip - Tidak aktif</option>
                    </SelectField>
                    <SelectField
                        label="Tipe Enrollment"
                        description="Cara mahasiswa bergabung ke kursus"
                        value={form.data.enrollment_type}
                        onChange={(e) => form.setData('enrollment_type', e.target.value)}
                        error={form.errors.enrollment_type}
                    >
                        <option value="auto">Otomatis - Langsung diterima</option>
                        <option value="manual">Manual - Perlu persetujuan</option>
                    </SelectField>
                </div>

                <div className="p-4 rounded-lg border
                    bg-neutral-50 border-neutral-200
                    dark:bg-white/5 dark:border-white/[0.07]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-content-primary">Kode Enrollment</p>
                            <p className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">{course.enroll_code}</p>
                        </div>
                        <Button type="button" variant="outline" onClick={regenerateCode} className="gap-2">
                            <RefreshCw className="size-4" />
                            Generate Ulang
                        </Button>
                    </div>
                </div>

                <Toggle
                    checked={form.data.is_visible}
                    onChange={(v) => form.setData('is_visible', v)}
                    label="Tampilkan ke Mahasiswa"
                    description="Jika dinonaktifkan, kursus tidak akan muncul di daftar kursus mahasiswa"
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <TextField
                        label="Tanggal Mulai Akses"
                        description="Opsional"
                        type="date"
                        value={form.data.start_date}
                        onChange={(e) => form.setData('start_date', e.target.value)}
                        error={form.errors.start_date}
                    />
                    <TextField
                        label="Tanggal Selesai Akses"
                        description="Opsional"
                        type="date"
                        value={form.data.end_date}
                        onChange={(e) => form.setData('end_date', e.target.value)}
                        error={form.errors.end_date}
                    />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <SuccessMessage show={saved} />
                    <SaveButton processing={form.processing} onClick={handleSubmit} />
                </div>
            </form>
        </SectionCard>
    );
}

// ============================================
// SECTION: Learning Structure
// ============================================
function LearningSection({ course, settings, expanded, onToggle }) {
    const [saved, setSaved] = useState(false);
    const form = useForm({
        settings: {
            learning: {
                order: settings.learning?.order || 'free',
                completion_rule: settings.learning?.completion_rule || 'opened',
                enable_prerequisites: settings.learning?.enable_prerequisites || false,
            },
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.patch(`/instructor/courses/${course.id}/settings`, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            },
        });
    };

    const updateLearning = (key, value) => {
        form.setData('settings', {
            learning: {
                ...form.data.settings.learning,
                [key]: value,
            },
        });
    };

    return (
        <SectionCard
            id="learning"
            title="Struktur Pembelajaran"
            description="Atur urutan dan aturan penyelesaian materi"
            icon={GraduationCap}
            expanded={expanded}
            onToggle={onToggle}
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <SelectField
                    label="Urutan Belajar"
                    description="Tentukan bagaimana mahasiswa mengakses materi"
                    value={form.data.settings.learning.order}
                    onChange={(e) => updateLearning('order', e.target.value)}
                >
                    <option value="free">Bebas - Mahasiswa dapat mengakses materi mana saja</option>
                    <option value="sequential">Berurutan - Harus menyelesaikan materi sebelumnya</option>
                </SelectField>

                <SelectField
                    label="Aturan Penyelesaian Materi"
                    description="Kapan materi dianggap selesai"
                    value={form.data.settings.learning.completion_rule}
                    onChange={(e) => updateLearning('completion_rule', e.target.value)}
                >
                    <option value="opened">Dibuka - Materi selesai jika sudah dibuka</option>
                    <option value="read_complete">Dibaca Lengkap - Materi selesai jika dibaca sampai akhir</option>
                    <option value="all_items">Semua Item - Modul selesai jika semua tugas/kuis selesai</option>
                </SelectField>

                <Toggle
                    checked={form.data.settings.learning.enable_prerequisites}
                    onChange={(v) => updateLearning('enable_prerequisites', v)}
                    label="Aktifkan Prasyarat Modul"
                    description="Mahasiswa harus menyelesaikan modul tertentu sebelum mengakses modul berikutnya"
                />

                <div className="flex items-center justify-between pt-2">
                    <SuccessMessage show={saved} />
                    <SaveButton processing={form.processing} onClick={handleSubmit} />
                </div>
            </form>
        </SectionCard>
    );
}

// ============================================
// SECTION: Assignments Policy
// ============================================
function AssignmentsSection({ course, settings, expanded, onToggle }) {
    const [saved, setSaved] = useState(false);
    const form = useForm({
        settings: {
            assignments: {
                allow_late_submission: settings.assignments?.allow_late_submission ?? true,
                late_penalty_percent: settings.assignments?.late_penalty_percent || 0,
                allow_resubmission: settings.assignments?.allow_resubmission || false,
                max_attempts: settings.assignments?.max_attempts || 1,
                default_submission_type: settings.assignments?.default_submission_type || 'file',
            },
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.patch(`/instructor/courses/${course.id}/settings`, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            },
        });
    };

    const updateAssignments = (key, value) => {
        form.setData('settings', {
            assignments: {
                ...form.data.settings.assignments,
                [key]: value,
            },
        });
    };

    return (
        <SectionCard
            id="assignments"
            title="Kebijakan Tugas"
            description="Pengaturan default untuk tugas dalam kursus ini"
            icon={ClipboardList}
            expanded={expanded}
            onToggle={onToggle}
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="p-3 rounded-lg border
                    bg-blue-50 border-blue-200
                    dark:bg-emerald-500/10 dark:border-emerald-500/30">
                    <div className="flex items-start gap-2">
                        <Info className="size-4 text-blue-600 dark:text-emerald-400 mt-0.5" />
                        <p className="text-xs text-blue-700 dark:text-emerald-300">
                            Pengaturan ini adalah default untuk semua tugas baru. Setiap tugas dapat memiliki pengaturan berbeda.
                        </p>
                    </div>
                </div>

                <Toggle
                    checked={form.data.settings.assignments.allow_late_submission}
                    onChange={(v) => updateAssignments('allow_late_submission', v)}
                    label="Izinkan Keterlambatan Submit"
                    description="Mahasiswa dapat mengumpulkan tugas setelah deadline"
                />

                {form.data.settings.assignments.allow_late_submission && (
                    <TextField
                        label="Penalti Keterlambatan (%)"
                        description="Pengurangan nilai untuk submission terlambat"
                        type="number"
                        value={form.data.settings.assignments.late_penalty_percent}
                        onChange={(e) => updateAssignments('late_penalty_percent', parseInt(e.target.value) || 0)}
                        min={0}
                        max={100}
                    />
                )}

                <Toggle
                    checked={form.data.settings.assignments.allow_resubmission}
                    onChange={(v) => updateAssignments('allow_resubmission', v)}
                    label="Izinkan Resubmission"
                    description="Mahasiswa dapat mengumpulkan ulang tugas"
                />

                {form.data.settings.assignments.allow_resubmission && (
                    <TextField
                        label="Maksimal Percobaan Submit"
                        description="Jumlah maksimal submission yang diizinkan"
                        type="number"
                        value={form.data.settings.assignments.max_attempts}
                        onChange={(e) => updateAssignments('max_attempts', parseInt(e.target.value) || 0)}
                        min={1}
                        max={10}
                    />
                )}

                <SelectField
                    label="Tipe Submission Default"
                    description="Format submission yang digunakan secara default"
                    value={form.data.settings.assignments.default_submission_type}
                    onChange={(e) => updateAssignments('default_submission_type', e.target.value)}
                >
                    <option value="text">Teks - Jawaban dalam bentuk teks</option>
                    <option value="file">File - Upload file dokumen</option>
                    <option value="link">Link - URL/tautan</option>
                    <option value="audio">Audio - File audio</option>
                    <option value="video">Video - File video</option>
                </SelectField>

                <div className="flex items-center justify-between pt-2">
                    <SuccessMessage show={saved} />
                    <SaveButton processing={form.processing} onClick={handleSubmit} />
                </div>
            </form>
        </SectionCard>
    );
}


// ============================================
// SECTION: Quizzes Policy
// ============================================
function QuizzesSection({ course, settings, expanded, onToggle }) {
    const [saved, setSaved] = useState(false);
    const form = useForm({
        settings: {
            quizzes: {
                default_attempt_limit: settings.quizzes?.default_attempt_limit || 1,
                default_duration_minutes: settings.quizzes?.default_duration_minutes || 30,
                shuffle_questions: settings.quizzes?.shuffle_questions || false,
                shuffle_options: settings.quizzes?.shuffle_options || false,
                show_answers_after_submit: settings.quizzes?.show_answers_after_submit || false,
                show_score_after_submit: settings.quizzes?.show_score_after_submit ?? true,
            },
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.patch(`/instructor/courses/${course.id}/settings`, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            },
        });
    };

    const updateQuizzes = (key, value) => {
        form.setData('settings', {
            quizzes: {
                ...form.data.settings.quizzes,
                [key]: value,
            },
        });
    };

    return (
        <SectionCard
            id="quizzes"
            title="Kebijakan Kuis"
            description="Pengaturan default untuk kuis dalam kursus ini"
            icon={HelpCircle}
            expanded={expanded}
            onToggle={onToggle}
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="p-3 rounded-lg border
                    bg-blue-50 border-blue-200
                    dark:bg-emerald-500/10 dark:border-emerald-500/30">
                    <div className="flex items-start gap-2">
                        <Info className="size-4 text-blue-600 dark:text-emerald-400 mt-0.5" />
                        <p className="text-xs text-blue-700 dark:text-emerald-300">
                            Pengaturan ini adalah default untuk semua kuis baru. Setiap kuis dapat memiliki pengaturan berbeda.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <TextField
                        label="Jumlah Percobaan Default"
                        description="Berapa kali mahasiswa dapat mengerjakan kuis"
                        type="number"
                        value={form.data.settings.quizzes.default_attempt_limit}
                        onChange={(e) => updateQuizzes('default_attempt_limit', parseInt(e.target.value) || 0)}
                        min={1}
                        max={10}
                    />
                    <TextField
                        label="Durasi Default (menit)"
                        description="Waktu pengerjaan kuis"
                        type="number"
                        value={form.data.settings.quizzes.default_duration_minutes}
                        onChange={(e) => updateQuizzes('default_duration_minutes', parseInt(e.target.value) || 0)}
                        min={1}
                        max={480}
                    />
                </div>

                <div className="space-y-3">
                    <Toggle
                        checked={form.data.settings.quizzes.shuffle_questions}
                        onChange={(v) => updateQuizzes('shuffle_questions', v)}
                        label="Acak Urutan Soal"
                        description="Urutan soal akan diacak untuk setiap mahasiswa"
                    />
                    <Toggle
                        checked={form.data.settings.quizzes.shuffle_options}
                        onChange={(v) => updateQuizzes('shuffle_options', v)}
                        label="Acak Pilihan Jawaban"
                        description="Urutan pilihan jawaban akan diacak"
                    />
                    <Toggle
                        checked={form.data.settings.quizzes.show_score_after_submit}
                        onChange={(v) => updateQuizzes('show_score_after_submit', v)}
                        label="Tampilkan Nilai Setelah Submit"
                        description="Mahasiswa dapat melihat nilai langsung setelah mengerjakan"
                    />
                    <Toggle
                        checked={form.data.settings.quizzes.show_answers_after_submit}
                        onChange={(v) => updateQuizzes('show_answers_after_submit', v)}
                        label="Tampilkan Jawaban Benar Setelah Submit"
                        description="Mahasiswa dapat melihat jawaban yang benar"
                    />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <SuccessMessage show={saved} />
                    <SaveButton processing={form.processing} onClick={handleSubmit} />
                </div>
            </form>
        </SectionCard>
    );
}

// ============================================
// SECTION: Grades Settings
// ============================================
function GradesSection({ course, settings, expanded, onToggle }) {
    const [saved, setSaved] = useState(false);
    const form = useForm({
        settings: {
            grades: {
                scale: settings.grades?.scale || '0-100',
                passing_grade: settings.grades?.passing_grade || 60,
                rounding: settings.grades?.rounding || 'none',
                weights: {
                    assignments: settings.grades?.weights?.assignments || 30,
                    quizzes: settings.grades?.weights?.quizzes || 20,
                    discussions: settings.grades?.weights?.discussions || 10,
                    midterm: settings.grades?.weights?.midterm || 20,
                    final: settings.grades?.weights?.final || 20,
                },
            },
        },
        certificate_criteria: {
            min_progress: course.certificate_criteria?.min_progress || 100,
            min_score: course.certificate_criteria?.min_score || 70,
        },
        leaderboard_enabled: course.leaderboard_enabled || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.patch(`/instructor/courses/${course.id}/settings`, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            },
        });
    };

    const updateGrades = (key, value) => {
        form.setData('settings', {
            grades: {
                ...form.data.settings.grades,
                [key]: value,
            },
        });
    };

    const updateWeight = (key, value) => {
        form.setData('settings', {
            grades: {
                ...form.data.settings.grades,
                weights: {
                    ...form.data.settings.grades.weights,
                    [key]: value,
                },
            },
        });
    };

    const updateCertificate = (key, value) => {
        form.setData('certificate_criteria', {
            ...form.data.certificate_criteria,
            [key]: value,
        });
    };

    const totalWeight = Object.values(form.data.settings.grades.weights).reduce((a, b) => a + b, 0);
    const isWeightValid = totalWeight === 100;

    return (
        <SectionCard
            id="grades"
            title="Pengaturan Nilai"
            description="Skala nilai, bobot, dan kriteria kelulusan"
            icon={BarChart3}
            expanded={expanded}
            onToggle={onToggle}
        >
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <SelectField
                        label="Skala Nilai"
                        value={form.data.settings.grades.scale}
                        onChange={(e) => updateGrades('scale', e.target.value)}
                    >
                        <option value="0-100">0 - 100</option>
                        <option value="letter">A/B/C/D/E</option>
                    </SelectField>
                    <TextField
                        label="Nilai Minimum Kelulusan"
                        type="number"
                        value={form.data.settings.grades.passing_grade}
                        onChange={(e) => updateGrades('passing_grade', parseInt(e.target.value) || 0)}
                        min={0}
                        max={100}
                    />
                    <SelectField
                        label="Pembulatan Nilai"
                        value={form.data.settings.grades.rounding}
                        onChange={(e) => updateGrades('rounding', e.target.value)}
                    >
                        <option value="none">Tanpa Pembulatan</option>
                        <option value="one_decimal">1 Angka Desimal</option>
                        <option value="integer">Bilangan Bulat</option>
                    </SelectField>
                </div>

                {/* Grade Weights */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-content-secondary">Bobot Nilai</h4>
                        <span className={`text-sm font-bold ${isWeightValid ? 'text-emerald-600' : 'text-red-600'}`}>
                            Total: {totalWeight}%
                        </span>
                    </div>
                    {!isWeightValid && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-700">Total bobot harus 100%. Saat ini: {totalWeight}%</p>
                        </div>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        {[
                            { key: 'assignments', label: 'Tugas' },
                            { key: 'quizzes', label: 'Kuis' },
                            { key: 'discussions', label: 'Diskusi' },
                            { key: 'midterm', label: 'UTS' },
                            { key: 'final', label: 'UAS' },
                        ].map((item) => (
                            <div key={item.key} className="space-y-1">
                                <label className="text-xs font-medium text-neutral-600">{item.label}</label>
                                <div className="relative">
                                    <TextField
                                        type="number"
                                        value={form.data.settings.grades.weights[item.key]}
                                        onChange={(e) => updateWeight(item.key, parseInt(e.target.value) || 0)}
                                        min={0}
                                        max={100}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certificate Criteria */}
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                    <h4 className="text-sm font-medium text-content-secondary">Kriteria Sertifikat</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                            label="Progres Minimum (%)"
                            description="Persentase penyelesaian kursus untuk mendapat sertifikat"
                            type="number"
                            value={form.data.certificate_criteria.min_progress}
                            onChange={(e) => updateCertificate('min_progress', parseInt(e.target.value) || 0)}
                            min={0}
                            max={100}
                        />
                        <TextField
                            label="Nilai Minimum"
                            description="Nilai rata-rata minimum untuk mendapat sertifikat"
                            type="number"
                            value={form.data.certificate_criteria.min_score}
                            onChange={(e) => updateCertificate('min_score', parseInt(e.target.value) || 0)}
                            min={0}
                            max={100}
                        />
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="pt-4 border-t border-neutral-100">
                    <Toggle
                        checked={form.data.leaderboard_enabled}
                        onChange={(v) => form.setData('leaderboard_enabled', v)}
                        label="Aktifkan Leaderboard"
                        description="Tampilkan peringkat mahasiswa berdasarkan nilai"
                    />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <SuccessMessage show={saved} />
                    <SaveButton processing={form.processing} onClick={handleSubmit} />
                </div>
            </form>
        </SectionCard>
    );
}

// ============================================
// SECTION: Discussions Settings
// ============================================
function DiscussionsSection({ course, settings, expanded, onToggle }) {
    const [saved, setSaved] = useState(false);
    const form = useForm({
        settings: {
            discussions: {
                enabled: settings.discussions?.enabled ?? true,
                moderation_enabled: settings.discussions?.moderation_enabled || false,
                allow_student_topics: settings.discussions?.allow_student_topics ?? true,
                allow_anonymous: settings.discussions?.allow_anonymous || false,
                min_comments_for_grade: settings.discussions?.min_comments_for_grade || 0,
                show_adab_rules: settings.discussions?.show_adab_rules ?? true,
            },
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.patch(`/instructor/courses/${course.id}/settings`, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            },
        });
    };

    const updateDiscussions = (key, value) => {
        form.setData('settings', {
            discussions: {
                ...form.data.settings.discussions,
                [key]: value,
            },
        });
    };

    return (
        <SectionCard
            id="discussions"
            title="Pengaturan Diskusi"
            description="Atur forum diskusi kursus"
            icon={MessageSquare}
            expanded={expanded}
            onToggle={onToggle}
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <Toggle
                    checked={form.data.settings.discussions.enabled}
                    onChange={(v) => updateDiscussions('enabled', v)}
                    label="Aktifkan Forum Diskusi"
                    description="Mahasiswa dapat berdiskusi pada setiap materi"
                />

                {form.data.settings.discussions.enabled && (
                    <>
                        <Toggle
                            checked={form.data.settings.discussions.moderation_enabled}
                            onChange={(v) => updateDiscussions('moderation_enabled', v)}
                            label="Moderasi Komentar"
                            description="Komentar harus disetujui sebelum ditampilkan"
                        />
                        <Toggle
                            checked={form.data.settings.discussions.allow_student_topics}
                            onChange={(v) => updateDiscussions('allow_student_topics', v)}
                            label="Izinkan Mahasiswa Membuat Topik Baru"
                            description="Mahasiswa dapat memulai diskusi baru"
                        />
                        <Toggle
                            checked={form.data.settings.discussions.allow_anonymous}
                            onChange={(v) => updateDiscussions('allow_anonymous', v)}
                            label="Izinkan Komentar Anonim"
                            description="Mahasiswa dapat berkomentar tanpa menampilkan nama"
                        />
                        <Toggle
                            checked={form.data.settings.discussions.show_adab_rules}
                            onChange={(v) => updateDiscussions('show_adab_rules', v)}
                            label="Tampilkan Aturan Adab Diskusi"
                            description="Tampilkan panduan adab sebelum berkomentar"
                        />
                        <TextField
                            label="Minimal Komentar untuk Dinilai"
                            description="Jumlah komentar minimum agar diskusi dihitung dalam nilai (0 = tidak dihitung)"
                            type="number"
                            value={form.data.settings.discussions.min_comments_for_grade}
                            onChange={(e) => updateDiscussions('min_comments_for_grade', parseInt(e.target.value) || 0)}
                            min={0}
                            max={50}
                        />
                    </>
                )}

                <div className="flex items-center justify-between pt-2">
                    <SuccessMessage show={saved} />
                    <SaveButton processing={form.processing} onClick={handleSubmit} />
                </div>
            </form>
        </SectionCard>
    );
}

// ============================================
// SECTION: Participants Settings
// ============================================
function ParticipantsSection({ course, settings, expanded, onToggle }) {
    const [saved, setSaved] = useState(false);
    const form = useForm({
        settings: {
            participants: {
                enrollment_open: settings.participants?.enrollment_open ?? true,
                allow_self_unenroll: settings.participants?.allow_self_unenroll || false,
                max_participants: settings.participants?.max_participants || null,
            },
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.patch(`/instructor/courses/${course.id}/settings`, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            },
        });
    };

    const updateParticipants = (key, value) => {
        form.setData('settings', {
            participants: {
                ...form.data.settings.participants,
                [key]: value,
            },
        });
    };

    return (
        <SectionCard
            id="participants"
            title="Pengaturan Peserta"
            description="Atur enrollment dan batasan peserta"
            icon={Users}
            expanded={expanded}
            onToggle={onToggle}
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <Toggle
                    checked={form.data.settings.participants.enrollment_open}
                    onChange={(v) => updateParticipants('enrollment_open', v)}
                    label="Enrollment Terbuka"
                    description="Mahasiswa dapat mendaftar ke kursus ini"
                />
                <Toggle
                    checked={form.data.settings.participants.allow_self_unenroll}
                    onChange={(v) => updateParticipants('allow_self_unenroll', v)}
                    label="Izinkan Keluar Sendiri"
                    description="Mahasiswa dapat keluar dari kursus tanpa persetujuan"
                />
                <TextField
                    label="Batas Maksimal Peserta"
                    description="Kosongkan jika tidak ada batasan"
                    type="number"
                    value={form.data.settings.participants.max_participants || ''}
                    onChange={(e) => updateParticipants('max_participants', parseInt(e.target.value) || null)}
                    min={1}
                    max={1000}
                    placeholder="Tidak terbatas"
                />

                <div className="flex items-center justify-between pt-2">
                    <SuccessMessage show={saved} />
                    <SaveButton processing={form.processing} onClick={handleSubmit} />
                </div>
            </form>
        </SectionCard>
    );
}


// ============================================
// SECTION: Islamic LMS Settings
// ============================================
function IslamicSection({ course, settings, expanded, onToggle }) {
    const [saved, setSaved] = useState(false);
    const form = useForm({
        settings: {
            islamic: {
                show_learning_dua: settings.islamic?.show_learning_dua ?? true,
                show_basmallah: settings.islamic?.show_basmallah ?? true,
                enable_quran_block: settings.islamic?.enable_quran_block ?? true,
                enable_hadith_block: settings.islamic?.enable_hadith_block ?? true,
                require_islamic_references: settings.islamic?.require_islamic_references || false,
                enable_content_review: settings.islamic?.enable_content_review || false,
                show_adab_discussion: settings.islamic?.show_adab_discussion ?? true,
                enable_recitation_submission: settings.islamic?.enable_recitation_submission || false,
            },
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.patch(`/instructor/courses/${course.id}/settings`, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            },
        });
    };

    const updateIslamic = (key, value) => {
        form.setData('settings', {
            islamic: {
                ...form.data.settings.islamic,
                [key]: value,
            },
        });
    };

    return (
        <SectionCard
            id="islamic"
            title="Pengaturan Islamic LMS"
            description="Fitur khusus untuk pembelajaran Islami"
            icon={Moon}
            expanded={expanded}
            onToggle={onToggle}
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="p-4 rounded-xl border
                    bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200
                    dark:from-emerald-500/10 dark:to-teal-500/10 dark:border-emerald-500/30">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
                            <Moon className="size-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="font-medium text-emerald-900 dark:text-emerald-300">Fitur Islamic LMS</h4>
                            <p className="text-sm text-emerald-700 dark:text-emerald-400/80 mt-1">
                                Aktifkan fitur-fitur khusus untuk mendukung pembelajaran berbasis nilai-nilai Islam.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-content-secondary pt-2">Tampilan & Konten</h4>
                    <Toggle
                        checked={form.data.settings.islamic.show_learning_dua}
                        onChange={(v) => updateIslamic('show_learning_dua', v)}
                        label="Tampilkan Doa Pembuka Belajar"
                        description="Tampilkan doa sebelum memulai pembelajaran"
                    />
                    <Toggle
                        checked={form.data.settings.islamic.show_basmallah}
                        onChange={(v) => updateIslamic('show_basmallah', v)}
                        label="Tampilkan Basmalah"
                        description="Tampilkan basmalah pada halaman materi"
                    />
                    <Toggle
                        checked={form.data.settings.islamic.enable_quran_block}
                        onChange={(v) => updateIslamic('enable_quran_block', v)}
                        label="Aktifkan Blok Ayat Al-Quran"
                        description="Izinkan penyisipan ayat Al-Quran dalam materi"
                    />
                    <Toggle
                        checked={form.data.settings.islamic.enable_hadith_block}
                        onChange={(v) => updateIslamic('enable_hadith_block', v)}
                        label="Aktifkan Blok Hadis"
                        description="Izinkan penyisipan hadis dalam materi"
                    />
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-100">
                    <h4 className="text-sm font-medium text-content-secondary">Validasi & Review</h4>
                    <Toggle
                        checked={form.data.settings.islamic.require_islamic_references}
                        onChange={(v) => updateIslamic('require_islamic_references', v)}
                        label="Wajibkan Sumber Dalil"
                        description="Materi Islamic wajib menyertakan sumber dalil"
                    />
                    <Toggle
                        checked={form.data.settings.islamic.enable_content_review}
                        onChange={(v) => updateIslamic('enable_content_review', v)}
                        label="Aktifkan Review Materi"
                        description="Materi harus direview sebelum dipublikasikan"
                    />
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-100">
                    <h4 className="text-sm font-medium text-content-secondary">Diskusi & Aktivitas</h4>
                    <Toggle
                        checked={form.data.settings.islamic.show_adab_discussion}
                        onChange={(v) => updateIslamic('show_adab_discussion', v)}
                        label="Tampilkan Adab Diskusi"
                        description="Tampilkan panduan adab sebelum berdiskusi"
                    />
                    <Toggle
                        checked={form.data.settings.islamic.enable_recitation_submission}
                        onChange={(v) => updateIslamic('enable_recitation_submission', v)}
                        label="Aktifkan Setoran Hafalan/Tilawah"
                        description="Mahasiswa dapat menyetor hafalan atau tilawah"
                    />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <SuccessMessage show={saved} />
                    <SaveButton processing={form.processing} onClick={handleSubmit} />
                </div>
            </form>
        </SectionCard>
    );
}

// ============================================
// SECTION: Danger Zone
// ============================================
function DangerZoneSection({ 
    course, 
    stats, 
    expanded, 
    onToggle,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showArchiveConfirm,
    setShowArchiveConfirm,
    deleteConfirmText,
    setDeleteConfirmText
}) {
    const handleArchive = () => {
        router.patch(`/instructor/courses/${course.id}/archive`, {}, {
            preserveScroll: true,
            onSuccess: () => setShowArchiveConfirm(false),
        });
    };

    const handleDelete = () => {
        if (deleteConfirmText !== course.code) return;
        router.delete(`/instructor/courses/${course.id}`, {
            onSuccess: () => {
                // Will redirect to courses list
            },
        });
    };

    const hasData = stats.modules_count > 0 || 
                    stats.materials_count > 0 || 
                    stats.assignments_count > 0 || 
                    stats.quizzes_count > 0 ||
                    stats.submissions_count > 0 ||
                    stats.quiz_attempts_count > 0 ||
                    course.active_enrollments_count > 0;

    return (
        <SectionCard
            id="danger"
            title="Danger Zone"
            description="Tindakan berbahaya yang tidak dapat dibatalkan"
            icon={AlertTriangle}
            expanded={expanded}
            onToggle={onToggle}
            variant="danger"
        >
            <div className="space-y-4 pt-4">
                {/* Archive Course */}
                <div className="p-4 border border-amber-200 rounded-xl bg-amber-50/50">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h4 className="font-medium text-amber-900">Arsipkan Kursus</h4>
                            <p className="text-sm text-amber-700 mt-1">
                                Kursus akan dinonaktifkan dan tidak dapat diakses mahasiswa. Data tetap tersimpan.
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={() => setShowArchiveConfirm(true)}
                            className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-100 shrink-0"
                        >
                            <Archive className="size-4" />
                            Arsipkan
                        </Button>
                    </div>
                </div>

                {/* Delete Course */}
                <div className="p-4 border border-red-200 rounded-xl bg-red-50/50">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h4 className="font-medium text-red-900">Hapus Kursus</h4>
                            <p className="text-sm text-red-700 mt-1">
                                Penghapusan kursus akan menghapus semua data terkait termasuk modul, materi, tugas, kuis, dan data pembelajaran. 
                                <strong className="font-semibold"> Tindakan ini tidak dapat dibatalkan.</strong>
                            </p>
                            {hasData && (
                                <div className="mt-3 p-3 bg-red-100 rounded-lg">
                                    <p className="text-xs font-medium text-red-800 mb-2">Data yang akan dihapus:</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-red-700">
                                        <span>• {stats.modules_count} Modul</span>
                                        <span>• {stats.materials_count} Materi</span>
                                        <span>• {stats.assignments_count} Tugas</span>
                                        <span>• {stats.quizzes_count} Kuis</span>
                                        <span>• {stats.submissions_count} Submission</span>
                                        <span>• {stats.quiz_attempts_count} Percobaan Kuis</span>
                                        <span>• {course.active_enrollments_count} Peserta Aktif</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Button 
                            variant="destructive" 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="gap-2 shrink-0"
                            disabled={course.active_enrollments_count > 0}
                        >
                            <Trash2 className="size-4" />
                            Hapus Kursus
                        </Button>
                    </div>
                    {course.active_enrollments_count > 0 && (
                        <p className="text-xs text-red-600 mt-3">
                            * Tidak dapat menghapus kursus yang memiliki peserta aktif. Arsipkan terlebih dahulu atau keluarkan semua peserta.
                        </p>
                    )}
                </div>
            </div>

            {/* Archive Confirmation Modal */}
            <ConfirmDialog
                open={showArchiveConfirm}
                onClose={() => setShowArchiveConfirm(false)}
                onConfirm={handleArchive}
                title="Arsipkan Kursus?"
                description={`Kursus ${course.name} akan diarsipkan. Mahasiswa tidak akan dapat mengakses kursus ini, tetapi semua data tetap tersimpan dan dapat diaktifkan kembali.`}
                confirmLabel="Ya, Arsipkan"
                variant="warning"
                icon={Archive}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmDialog
                open={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                }}
                onConfirm={handleDelete}
                title="Hapus Kursus?"
                description={`Semua data kursus termasuk modul, materi, tugas, kuis, submission, dan nilai akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus Permanen"
                variant="danger"
                icon={Trash2}
            />
        </SectionCard>
    );
}
