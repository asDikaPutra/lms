import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Layers3, ClipboardList, HelpCircle, MessageSquare, Users, BarChart3, TrendingUp, Settings, ChevronLeft, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { label: 'Ringkasan', href: '', icon: BookOpen },
    { label: 'Struktur Kurikulum', href: '/curriculum', icon: Layers3 },
    { label: 'Tugas', href: '/assignments', icon: ClipboardList },
    { label: 'Kuis', href: '/quizzes', icon: HelpCircle },
    { label: 'Diskusi', href: '/discussions', icon: MessageSquare },
    { label: 'Peserta', href: '/students', icon: Users },
    { label: 'Nilai', href: '/grades', icon: BarChart3 },
    { label: 'Progres', href: '/progress', icon: TrendingUp },
    { label: 'Pengaturan', href: '/settings', icon: Settings },
];

export default function CourseWorkspaceLayout({ course, children, activeTab = '' }) {
    const { url } = usePage();
    const baseUrl = `/instructor/courses/${course.id}`;

    const getStatusConfig = () => {
        if (course.is_active) {
            return {
                label: 'Aktif',
                className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            };
        }
        return {
            label: 'Arsip',
            className: 'bg-neutral-100 text-neutral-600 border-neutral-200',
        };
    };

    const status = getStatusConfig();

    return (
        <div className="space-y-6">
            {/* Course Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border p-6 shadow-md relative overflow-hidden
                    border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/80 to-white
                    dark:border-white/[0.07] dark:bg-gradient-to-br dark:from-[#081616] dark:via-[#0E2B29] dark:to-[#000100] dark:shadow-[0_2px_24px_rgba(0,0,0,0.5)]"
            >
                <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10" />

                <div className="relative">
                    {/* Back link */}
                    <Link
                        href="/instructor/courses"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors mb-4"
                    >
                        <ChevronLeft className="size-4" />
                        Kembali ke Daftar Kursus
                    </Link>

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                            {/* Course code and status */}
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-100/80 dark:border-emerald-500/25 dark:bg-emerald-500/10">
                                    <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-700 dark:text-emerald-400">
                                        {course.code}
                                    </span>
                                </span>
                                {course.semester && (
                                    <span className="text-sm font-medium text-content-secondary">
                                        {course.semester}
                                    </span>
                                )}
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.className}`}>
                                    {status.label}
                                </span>
                            </div>

                            {/* Course name */}
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-content-primary">
                                {course.name}
                            </h1>

                            {/* Course info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-content-secondary">
                                <span className="flex items-center gap-1.5">
                                    <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
                                    {course.active_enrollments_count} Mahasiswa
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Layers3 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                    {course.modules?.length ?? course.modules_count ?? 0} Modul
                                </span>
                                <span className="text-xs rounded border border-emerald-200 bg-emerald-100/50 px-2 py-0.5 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400">
                                    Kode Enroll: <strong className="font-mono">{course.enroll_code}</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="rounded-xl border p-1.5 overflow-x-auto shadow-sm
                    bg-white border-neutral-100
                    dark:bg-[#081616] dark:border-white/[0.07]"
            >
                <nav className="flex gap-1 min-w-max">
                    {navItems.map((item) => {
                        const fullHref = `${baseUrl}${item.href}`;
                        const isActive = item.href === '' 
                            ? url === baseUrl || url === `${baseUrl}/`
                            : url.startsWith(fullHref);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={fullHref}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.32)]'
                                        : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white/80'
                                }`}
                            >
                                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                                <span className="whitespace-nowrap">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </motion.div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
            >
                {children}
            </motion.div>
        </div>
    );
}

