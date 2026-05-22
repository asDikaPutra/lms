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
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white/90">Pengaturan</h2>
                            <p className="text-sm text-neutral-600 dark:text-white/45 mt-1">Atur konfigurasi kursus ini.</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500 dark:text-white/35">
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
                                    <button
                                        key={section.id}
                                        onClick={() => {
                                            setActiveSection(section.id);
                                            document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                            isActive
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
                                                : section.id === 'danger'
                                                ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10'
                                                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white/80'
                                        }`}
                                    >
                                        <Icon className="size-4" />
                                        {section.label}
                                    </button>
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
        default: 'border-neutral-100 dark:border-white/[0.07]',
        danger: 'border-red-200 bg-red-50/30 dark:border-red-500/30 dark:bg-red-500/5',
    };

    return (
        <motion.div
            id={`section-${id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl shadow-sm border overflow-hidden scroll-mt-6
                bg-white dark:bg-[#111a15]
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
                        <h3 className={`text-lg font-semibold ${variant === 'danger' ? 'text-red-900 dark:text-red-300' : 'text-neutral-900 dark:text-white/90'}`}>
                            {title}
                        </h3>
                        <p className={`text-sm ${variant === 'danger' ? 'text-red-600 dark:text-red-400/70' : 'text-neutral-500 dark:text-white/40'}`}>
                            {description}
                        </p>
                    </div>
                </div>
                {expanded
                    ? <ChevronUp className="size-5 text-neutral-400 dark:text-white/30" />
                    : <ChevronDown className="size-5 text-neutral-400 dark:text-white/30" />
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
                        <div className="px-5 pb-5 pt-0 border-t border-neutral-100 dark:border-white/[0.07]">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function FormField({ label, description, children, error }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-white/70">{label}</label>
            {description && <p className="text-xs text-neutral-500 dark:text-white/35">{description}</p>}
            {children}
            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

function TextInput({ value, onChange, placeholder, error, ...props }) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors
                dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 ${
                error 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500/40' 
                    : 'border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:focus:border-emerald-500/60'
            }`}
            {...props}
        />
    );
}

function TextArea({ value, onChange, placeholder, rows = 3, error }) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors resize-none
                dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 ${
                error 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500/40' 
                    : 'border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:focus:border-emerald-500/60'
            }`}
        />
    );
}

function SelectInput({ value, onChange, options, error }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors
                dark:bg-white/8 dark:text-white/90 ${
                error 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500/40' 
                    : 'border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:focus:border-emerald-500/60'
            }`}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
}

function NumberInput({ value, onChange, min, max, error, ...props }) {
    return (
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            min={min}
            max={max}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors
                dark:bg-white/8 dark:text-white/90 ${
                error 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500/40' 
                    : 'border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:focus:border-emerald-500/60'
            }`}
            {...props}
        />
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
                <span className="text-sm font-medium text-neutral-700 dark:text-white/70 group-hover:text-neutral-900 dark:group-hover:text-white/90">{label}</span>
                {description && <p className="text-xs text-neutral-500 dark:text-white/35 mt-0.5">{description}</p>}
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
                    <FormField label="Nama Kursus" error={form.errors.name}>
                        <TextInput
                            value={form.data.name}
                            onChange={(v) => form.setData('name', v)}
                            placeholder="Contoh: Tafsir Al-Quran"
                            error={form.errors.name}
                        />
                    </FormField>
                    <FormField label="Kode Kursus" error={form.errors.code}>
                        <TextInput
                            value={form.data.code}
                            onChange={(v) => form.setData('code', v)}
                            placeholder="Contoh: FAI301"
                            error={form.errors.code}
                        />
                    </FormField>
                </div>
                <FormField label="Semester / Periode" error={form.errors.semester}>
                    <TextInput
                        value={form.data.semester}
                        onChange={(v) => form.setData('semester', v)}
                        placeholder="Contoh: Ganjil 2025/2026"
                        error={form.errors.semester}
                    />
                </FormField>
                <FormField label="Deskripsi Kursus" error={form.errors.description}>
                    <TextArea
                        value={form.data.description}
                        onChange={(v) => form.setData('description', v)}
                        placeholder="Deskripsi singkat tentang kursus ini..."
                        rows={4}
                        error={form.errors.description}
                    />
                </FormField>
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
                    <FormField 
                        label="Status Kursus" 
                        description="Tentukan status aktif kursus"
                        error={form.errors.status}
                    >
                        <SelectInput
                            value={form.data.status}
                            onChange={(v) => form.setData('status', v)}
                            options={[
                                { value: 'draft', label: 'Draft - Belum dipublikasikan' },
                                { value: 'active', label: 'Aktif - Dapat diakses mahasiswa' },
                                { value: 'closed', label: 'Selesai - Tidak menerima aktivitas baru' },
                                { value: 'archived', label: 'Arsip - Tidak aktif' },
                            ]}
                            error={form.errors.status}
                        />
                    </FormField>
                    <FormField 
                        label="Tipe Enrollment" 
                        description="Cara mahasiswa bergabung ke kursus"
                        error={form.errors.enrollment_type}
                    >
                        <SelectInput
                            value={form.data.enrollment_type}
                            onChange={(v) => form.setData('enrollment_type', v)}
                            options={[
                                { value: 'auto', label: 'Otomatis - Langsung diterima' },
                                { value: 'manual', label: 'Manual - Perlu persetujuan' },
                            ]}
                            error={form.errors.enrollment_type}
                        />
                    </FormField>
                </div>

                <div className="p-4 rounded-lg border
                    bg-neutral-50 border-neutral-200
                    dark:bg-white/5 dark:border-white/[0.07]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-700 dark:text-white/70">Kode Enrollment</p>
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
                    <FormField 
                        label="Tanggal Mulai Akses" 
                        description="Opsional"
                        error={form.errors.start_date}
                    >
                        <input
                            type="date"
                            value={form.data.start_date}
                            onChange={(e) => form.setData('start_date', e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm outline-none
                                border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                                dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:focus:border-emerald-500/60"
                        />
                    </FormField>
                    <FormField 
                        label="Tanggal Selesai Akses" 
                        description="Opsional"
                        error={form.errors.end_date}
                    >
                        <input
                            type="date"
                            value={form.data.end_date}
                            onChange={(e) => form.setData('end_date', e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm outline-none
                                border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                                dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:focus:border-emerald-500/60"
                        />
                    </FormField>
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
                <FormField 
                    label="Urutan Belajar" 
                    description="Tentukan bagaimana mahasiswa mengakses materi"
                >
                    <SelectInput
                        value={form.data.settings.learning.order}
                        onChange={(v) => updateLearning('order', v)}
                        options={[
                            { value: 'free', label: 'Bebas - Mahasiswa dapat mengakses materi mana saja' },
                            { value: 'sequential', label: 'Berurutan - Harus menyelesaikan materi sebelumnya' },
                        ]}
                    />
                </FormField>

                <FormField 
                    label="Aturan Penyelesaian Materi" 
                    description="Kapan materi dianggap selesai"
                >
                    <SelectInput
                        value={form.data.settings.learning.completion_rule}
                        onChange={(v) => updateLearning('completion_rule', v)}
                        options={[
                            { value: 'opened', label: 'Dibuka - Materi selesai jika sudah dibuka' },
                            { value: 'read_complete', label: 'Dibaca Lengkap - Materi selesai jika dibaca sampai akhir' },
                            { value: 'all_items', label: 'Semua Item - Modul selesai jika semua tugas/kuis selesai' },
                        ]}
                    />
                </FormField>

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
                    dark:bg-blue-500/10 dark:border-blue-500/30">
                    <div className="flex items-start gap-2">
                        <Info className="size-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <p className="text-xs text-blue-700 dark:text-blue-300">
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
                    <FormField 
                        label="Penalti Keterlambatan (%)" 
                        description="Pengurangan nilai untuk submission terlambat"
                    >
                        <NumberInput
                            value={form.data.settings.assignments.late_penalty_percent}
                            onChange={(v) => updateAssignments('late_penalty_percent', v)}
                            min={0}
                            max={100}
                        />
                    </FormField>
                )}

                <Toggle
                    checked={form.data.settings.assignments.allow_resubmission}
                    onChange={(v) => updateAssignments('allow_resubmission', v)}
                    label="Izinkan Resubmission"
                    description="Mahasiswa dapat mengumpulkan ulang tugas"
                />

                {form.data.settings.assignments.allow_resubmission && (
                    <FormField 
                        label="Maksimal Percobaan Submit" 
                        description="Jumlah maksimal submission yang diizinkan"
                    >
                        <NumberInput
                            value={form.data.settings.assignments.max_attempts}
                            onChange={(v) => updateAssignments('max_attempts', v)}
                            min={1}
                            max={10}
                        />
                    </FormField>
                )}

                <FormField 
                    label="Tipe Submission Default" 
                    description="Format submission yang digunakan secara default"
                >
                    <SelectInput
                        value={form.data.settings.assignments.default_submission_type}
                        onChange={(v) => updateAssignments('default_submission_type', v)}
                        options={[
                            { value: 'text', label: 'Teks - Jawaban dalam bentuk teks' },
                            { value: 'file', label: 'File - Upload file dokumen' },
                            { value: 'link', label: 'Link - URL/tautan' },
                            { value: 'audio', label: 'Audio - File audio' },
                            { value: 'video', label: 'Video - File video' },
                        ]}
                    />
                </FormField>

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
                    dark:bg-blue-500/10 dark:border-blue-500/30">
                    <div className="flex items-start gap-2">
                        <Info className="size-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            Pengaturan ini adalah default untuk semua kuis baru. Setiap kuis dapat memiliki pengaturan berbeda.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField 
                        label="Jumlah Percobaan Default" 
                        description="Berapa kali mahasiswa dapat mengerjakan kuis"
                    >
                        <NumberInput
                            value={form.data.settings.quizzes.default_attempt_limit}
                            onChange={(v) => updateQuizzes('default_attempt_limit', v)}
                            min={1}
                            max={10}
                        />
                    </FormField>
                    <FormField 
                        label="Durasi Default (menit)" 
                        description="Waktu pengerjaan kuis"
                    >
                        <NumberInput
                            value={form.data.settings.quizzes.default_duration_minutes}
                            onChange={(v) => updateQuizzes('default_duration_minutes', v)}
                            min={1}
                            max={480}
                        />
                    </FormField>
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
                    <FormField label="Skala Nilai">
                        <SelectInput
                            value={form.data.settings.grades.scale}
                            onChange={(v) => updateGrades('scale', v)}
                            options={[
                                { value: '0-100', label: '0 - 100' },
                                { value: 'letter', label: 'A/B/C/D/E' },
                            ]}
                        />
                    </FormField>
                    <FormField label="Nilai Minimum Kelulusan">
                        <NumberInput
                            value={form.data.settings.grades.passing_grade}
                            onChange={(v) => updateGrades('passing_grade', v)}
                            min={0}
                            max={100}
                        />
                    </FormField>
                    <FormField label="Pembulatan Nilai">
                        <SelectInput
                            value={form.data.settings.grades.rounding}
                            onChange={(v) => updateGrades('rounding', v)}
                            options={[
                                { value: 'none', label: 'Tanpa Pembulatan' },
                                { value: 'one_decimal', label: '1 Angka Desimal' },
                                { value: 'integer', label: 'Bilangan Bulat' },
                            ]}
                        />
                    </FormField>
                </div>

                {/* Grade Weights */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-neutral-700 dark:text-white/60">Bobot Nilai</h4>
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
                                    <NumberInput
                                        value={form.data.settings.grades.weights[item.key]}
                                        onChange={(v) => updateWeight(item.key, v)}
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
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-white/60">Kriteria Sertifikat</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField 
                            label="Progres Minimum (%)" 
                            description="Persentase penyelesaian kursus untuk mendapat sertifikat"
                        >
                            <NumberInput
                                value={form.data.certificate_criteria.min_progress}
                                onChange={(v) => updateCertificate('min_progress', v)}
                                min={0}
                                max={100}
                            />
                        </FormField>
                        <FormField 
                            label="Nilai Minimum" 
                            description="Nilai rata-rata minimum untuk mendapat sertifikat"
                        >
                            <NumberInput
                                value={form.data.certificate_criteria.min_score}
                                onChange={(v) => updateCertificate('min_score', v)}
                                min={0}
                                max={100}
                            />
                        </FormField>
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
                        <FormField 
                            label="Minimal Komentar untuk Dinilai" 
                            description="Jumlah komentar minimum agar diskusi dihitung dalam nilai (0 = tidak dihitung)"
                        >
                            <NumberInput
                                value={form.data.settings.discussions.min_comments_for_grade}
                                onChange={(v) => updateDiscussions('min_comments_for_grade', v)}
                                min={0}
                                max={50}
                            />
                        </FormField>
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
                <FormField 
                    label="Batas Maksimal Peserta" 
                    description="Kosongkan jika tidak ada batasan"
                >
                    <NumberInput
                        value={form.data.settings.participants.max_participants || ''}
                        onChange={(v) => updateParticipants('max_participants', v || null)}
                        min={1}
                        max={1000}
                        placeholder="Tidak terbatas"
                    />
                </FormField>

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
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-white/60 pt-2">Tampilan & Konten</h4>
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
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-white/60">Validasi & Review</h4>
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
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-white/60">Diskusi & Aktivitas</h4>
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
            <AnimatePresence>
                {showArchiveConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setShowArchiveConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="rounded-2xl shadow-xl max-w-md w-full p-6
                                bg-white dark:bg-[#111a15]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/20">
                                    <Archive className="size-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white/90">Arsipkan Kursus?</h3>
                                    <p className="text-sm text-neutral-500 dark:text-white/40">Kursus akan dinonaktifkan</p>
                                </div>
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-white/50 mb-6">
                                Kursus <strong>{course.name}</strong> akan diarsipkan. Mahasiswa tidak akan dapat mengakses kursus ini, 
                                tetapi semua data tetap tersimpan dan dapat diaktifkan kembali.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button variant="outline" onClick={() => setShowArchiveConfirm(false)}>
                                    Batal
                                </Button>
                                <Button 
                                    onClick={handleArchive}
                                    className="bg-amber-600 hover:bg-amber-700"
                                >
                                    Ya, Arsipkan
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteConfirmText('');
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="rounded-2xl shadow-xl max-w-md w-full p-6
                                bg-white dark:bg-[#111a15]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
                                    <Trash2 className="size-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white/90">Hapus Kursus?</h3>
                                    <p className="text-sm text-neutral-500 dark:text-white/40">Tindakan ini tidak dapat dibatalkan</p>
                                </div>
                            </div>
                            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl mb-4">
                                <p className="text-sm text-red-800 dark:text-red-300">
                                    <strong>Peringatan:</strong> Semua data kursus termasuk modul, materi, tugas, kuis, 
                                    submission, dan nilai akan dihapus secara permanen.
                                </p>
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-white/50 mb-4">
                                Untuk mengkonfirmasi, ketik kode kursus <strong className="font-mono">{course.code}</strong> di bawah ini:
                            </p>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder={course.code}
                                className="w-full rounded-lg border px-3 py-2 text-sm outline-none font-mono mb-4
                                    border-neutral-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                                    dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25"
                            />
                            <div className="flex gap-3 justify-end">
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeleteConfirmText('');
                                    }}
                                >
                                    Batal
                                </Button>
                                <Button 
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deleteConfirmText !== course.code}
                                >
                                    Hapus Permanen
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </SectionCard>
    );
}
