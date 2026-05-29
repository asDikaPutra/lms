import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Edit3, Plus, Search, Users, Layers3, ClipboardCheck, X } from 'lucide-react';
import { cloneElement, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import InstructorLayout from '@/Layouts/InstructorLayout';
import { Button } from '@/components/ui/button';
import { FilterButton } from '@/components/ui/filter-button';
import { AnimatedPage, StaggerContainer } from '@/components/animated/AnimatedPage';
import { fadeUp } from '@/lib/animations';

const emptyForm = {
    code: '',
    name: '',
    description: '',
    semester: '',
    enrollment_type: 'auto',
    leaderboard_enabled: false,
    certificate_criteria: {
        min_progress: 100,
        min_score: 70,
    },
};

export default function Index({ courses, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const form = useForm(emptyForm);
    const filterForm = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    const openModal = () => {
        form.reset();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        form.reset();
        form.clearErrors();
    };

    const submitCourse = (event) => {
        event.preventDefault();
        form.post('/instructor/courses', {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get('/instructor/courses', filterForm.data, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [filterForm.data]);

    return (
        <InstructorLayout title="Kursus Saya">
            <Head title="Kursus Saya" />

            <AnimatedPage>
                {/* Header Section */}
                <section className="mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
                    >
                        <div className="space-y-2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm border
                                    bg-emerald-100/80 border-emerald-200/60
                                    dark:bg-emerald-500/15 dark:border-emerald-500/30"
                            >
                                <BookOpen className="size-3.5 text-emerald-700 dark:text-emerald-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                    Manajemen Kursus
                                </span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]"
                            >
                                <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-teal-300 dark:to-emerald-400">
                                    Kursus Saya
                                </span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="max-w-2xl text-sm leading-relaxed text-content-secondary"
                            >
                                Kelola kursus yang Anda ampu.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button onClick={openModal} className="h-11 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all">
                                <Plus className="mr-2 size-4" /> Tambah Kursus
                            </Button>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Filter and Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        <FilterButton
                            active={filterForm.data.status === ''}
                            onClick={() => filterForm.setData('status', '')}
                        >
                            Semua
                        </FilterButton>
                        <FilterButton
                            active={filterForm.data.status === 'active'}
                            onClick={() => filterForm.setData('status', 'active')}
                        >
                            Aktif
                        </FilterButton>
                        <FilterButton
                            active={filterForm.data.status === 'inactive'}
                            onClick={() => filterForm.setData('status', 'inactive')}
                        >
                            Arsip
                        </FilterButton>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-80">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-content-muted" />
                        <motion.input
                            whileFocus={{ scale: 1.01 }}
                            value={filterForm.data.search}
                            onChange={(event) => filterForm.setData('search', event.target.value)}
                            placeholder="Cari kursus..."
                            className="h-11 w-full rounded-xl border-2 pl-10 pr-4 text-sm outline-none transition-all shadow-sm
                                border-neutral-200 bg-white/90 backdrop-blur-sm text-neutral-900 placeholder:text-neutral-400
                                focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10
                                dark:border-white/10 dark:bg-white/8 dark:text-white dark:placeholder:text-white/25
                                dark:focus:border-emerald-500/60 dark:focus:ring-emerald-500/15"
                        />
                    </div>
                </motion.div>

                {/* Course Grid */}
                <StaggerContainer delay={0.5} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.data.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full rounded-2xl border-2 border-dashed p-12 text-center backdrop-blur-sm
                                border-neutral-200 bg-white/60
                                dark:border-white/10 dark:bg-white/5"
                        >
                            <span className="text-5xl mb-4 block">📚</span>
                            <p className="text-sm text-content-secondary font-medium">
                                Belum ada kursus yang dibuat.
                            </p>
                            <p className="text-xs text-content-muted mt-2">Klik tombol "Tambah Kursus" untuk membuat kursus baru.</p>
                        </motion.div>
                    )}
                    {courses.data.map((course, index) => (
                        <CourseCard key={course.id} course={course} delay={index * 0.1} />
                    ))}
                </StaggerContainer>

                {/* Pagination */}
                {courses.last_page > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 flex justify-center gap-2"
                    >
                        {courses.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? '#'}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    link.active
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                                        : link.url
                                        ? 'bg-white dark:bg-white/8 text-neutral-600 dark:text-white/60 border border-line hover:border-emerald-300 dark:hover:border-emerald-500/40'
                                        : 'bg-surface-muted text-content-muted cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatedPage>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] tracking-[-0.01em]">
                    <div className="w-full max-w-lg rounded-[12px] shadow-xl ring-1 animate-in fade-in zoom-in-95 duration-200
                        bg-white ring-black/5
                        dark:bg-[#111a15] dark:ring-white/10"
                        role="dialog" aria-modal="true">
                        <div className="flex items-center justify-between border-b px-5 py-4
                            border-gray-300 dark:border-white/[0.07]">
                            <h3 className="text-[16px] font-semibold text-fg-primary dark:text-white/90">
                                Buat Kursus Baru
                            </h3>
                            <button onClick={closeModal} className="rounded-full p-1 transition-colors
                                text-fg-secondary hover:bg-slate-50 hover:text-fg-primary
                                dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white/80"
                                aria-label="Tutup modal">
                                <X className="size-5" />
                            </button>
                        </div>
                        <div className="p-5 max-h-[85vh] overflow-y-auto">
                            <form onSubmit={submitCourse} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Kode Kursus" id="code" error={form.errors.code}>
                                <input id="code" value={form.data.code} onChange={(event) => form.setData('code', event.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none transition-all
                                    border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint
                                    dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" placeholder="Contoh: IF101" />
                                    </Field>
                                    <Field label="Semester" id="semester" error={form.errors.semester}>
                                <input id="semester" value={form.data.semester} onChange={(event) => form.setData('semester', event.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none transition-all
                                    border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint
                                    dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" placeholder="Contoh: Genap 2026" />
                                    </Field>
                                </div>

                                <Field label="Nama Kursus" id="name" error={form.errors.name}>
                                <input id="name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none transition-all
                                    border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint
                                    dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" placeholder="Contoh: Pengantar Informatika" />
                                </Field>

                                <Field label="Deskripsi" id="description" error={form.errors.description}>
                                <textarea id="description" rows="3" value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none transition-all
                                    border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint
                                    dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25 dark:focus:border-emerald-500/60" placeholder="Penjelasan singkat mengenai kursus ini" />
                                </Field>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Mode Enrollment" id="enrollment-type" error={form.errors.enrollment_type}>
                                <select id="enrollment-type" value={form.data.enrollment_type} onChange={(event) => form.setData('enrollment_type', event.target.value)} className="w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none transition-all
                                    border-gray-300 text-fg-primary focus:border-mint focus:ring-1 focus:ring-mint
                                    dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:focus:border-emerald-500/60">
                                            <option value="auto">Otomatis (Auto)</option>
                                            <option value="manual">Manual (Approval)</option>
                                        </select>
                                    </Field>
                                    <div className="flex flex-col justify-end pb-2">
                                        <label className="flex items-center gap-2 text-[13px] cursor-pointer text-fg-primary dark:text-white/70">
                                            <input type="checkbox" checked={form.data.leaderboard_enabled} onChange={(event) => form.setData('leaderboard_enabled', event.target.checked)} className="size-4 rounded border-gray-300 text-mint focus:ring-mint" />
                                            Leaderboard aktif
                                        </label>
                                    </div>
                                </div>

                                <div className="rounded-[8px] p-3 border
                                    bg-slate-50 border-gray-300
                                    dark:bg-white/5 dark:border-white/[0.07]">
                                    <p className="text-[12px] font-semibold mb-3 text-fg-primary dark:text-white/70">Kriteria Sertifikat</p>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field label="Min. Progress (%)" id="min-progress" error={form.errors['certificate_criteria.min_progress']}>
                                            <input
                                                id="min-progress"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={form.data.certificate_criteria.min_progress}
                                                onChange={(event) => form.setData('certificate_criteria', { ...form.data.certificate_criteria, min_progress: event.target.value })}
                                                className="w-full rounded-[6px] border border-gray-300 px-3 py-1.5 text-[13px] text-fg-primary"
                                            />
                                        </Field>
                                        <Field label="Min. Nilai Kuis" id="min-score" error={form.errors['certificate_criteria.min_score']}>
                                            <input
                                                id="min-score"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={form.data.certificate_criteria.min_score}
                                                onChange={(event) => form.setData('certificate_criteria', { ...form.data.certificate_criteria, min_score: event.target.value })}
                                                className="w-full rounded-[6px] border border-gray-300 px-3 py-1.5 text-[13px] text-fg-primary"
                                            />
                                        </Field>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-3">
                                    <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                                    <Button type="submit" disabled={form.processing} className="px-6">
                                        <CheckCircle2 className="mr-1.5 size-4" /> Buat Kursus
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </InstructorLayout>
    );
}

function CourseCard({ course, delay }) {
    const getStatusConfig = () => {
        if (course.is_active) {
            return {
                label: 'Aktif',
                className: 'bg-emerald-100/80 text-emerald-800 border-emerald-300/70',
            };
        }
        return {
            label: 'Arsip',
            className: 'bg-neutral-100/80 text-neutral-600 border-neutral-300/70',
        };
    };

    const status = getStatusConfig();

    return (
        <motion.article
            variants={fadeUp}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } }}
            className="group relative overflow-hidden rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgb(16,185,129,0.2)] transition-all duration-400"
        >
            {/* Outer glow ring */}
            <div className="absolute -inset-[2px] bg-gradient-to-br from-emerald-400 via-teal-400 to-green-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-2xl" />
            
            {/* Card container */}
            <div className="relative rounded-2xl overflow-hidden border
                bg-white border-neutral-100
                dark:bg-[#111a15] dark:border-white/[0.07]">
                {/* Header with gradient */}
                <div className="relative h-28 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 overflow-hidden">
                    {/* Islamic pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.15]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 0l15 15-15 15-15-15L30 0zm0 30l15 15-15 15-15-15 15-15zm15-15l15 15-15 15-15-15 15-15zM0 15l15 15-15 15L0 30V15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    
                    {/* Status badge */}
                    <div className="absolute top-3 left-3">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm backdrop-blur-sm ${
                            course.is_active
                                ? 'bg-emerald-100/80 text-emerald-800 border-emerald-300/70 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40'
                                : 'bg-neutral-100/80 text-neutral-600 border-neutral-300/70 dark:bg-white/10 dark:text-white/50 dark:border-white/20'
                        }`}>
                            {status.label}
                        </div>
                    </div>

                    {/* Course icon — static */}
                    <div className="absolute bottom-3 right-3 flex size-12 items-center justify-center rounded-xl bg-white/25 backdrop-blur-sm border border-white/40">
                        <BookOpen className="size-6 text-white" />
                    </div>
                </div>

                {/* Content section */}
                <div className="p-5 space-y-4">
                    {/* Course code badge */}
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border
                            bg-emerald-50 border-emerald-100
                            dark:bg-emerald-500/15 dark:border-emerald-500/30">
                            <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-700 dark:text-emerald-400">
                                {course.code}
                            </span>
                        </span>
                        {course.semester && (
                            <span className="text-[10px] font-medium uppercase tracking-wider text-content-secondary">
                                {course.semester}
                            </span>
                        )}
                    </div>
                    
                    {/* Course title */}
                    <h3 className="text-base font-bold leading-snug line-clamp-2 text-content-primary">
                        {course.name}
                    </h3>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-3 py-3 border-y border-line-subtle">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                                <Users className="size-3.5" />
                            </div>
                            <p className="text-sm font-bold text-content-primary">{course.active_enrollments_count}</p>
                            <p className="text-[10px] text-content-secondary">Mahasiswa</p>
                        </div>
                        <div className="text-center border-x border-line-subtle">
                            <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                                <Layers3 className="size-3.5" />
                            </div>
                            <p className="text-sm font-bold text-content-primary">{course.modules_count ?? 0}</p>
                            <p className="text-[10px] text-content-secondary">Modul</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                                <ClipboardCheck className="size-3.5" />
                            </div>
                            <p className="text-sm font-bold text-content-primary">{course.pending_enrollments_count}</p>
                            <p className="text-[10px] text-content-secondary">Pending</p>
                        </div>
                    </div>

                    {/* Action button */}
                    <Link href={`/instructor/courses/${course.id}`}>
                        <Button variant="success" size="sm" className="w-full h-10 rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30">
                            Kelola
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}

function Field({ label, id, error, children }) {
    const describedBy = error ? `${id}-error` : undefined;

    return (
        <div>
            <label htmlFor={id} className="text-[12px] font-semibold mb-1.5 block text-fg-primary dark:text-white/70">
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
