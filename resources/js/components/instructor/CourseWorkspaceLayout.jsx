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
                className="rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden"
            >
                {/* Islamic pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.1]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 0l15 15-15 15-15-15L30 0zm0 30l15 15-15 15-15-15 15-15zm15-15l15 15-15 15-15-15 15-15zM0 15l15 15-15 15L0 30V15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                <div className="relative">
                    {/* Back link */}
                    <Link 
                        href="/instructor/courses" 
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors mb-4"
                    >
                        <ChevronLeft className="size-4" />
                        Kembali ke Daftar Kursus
                    </Link>

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                            {/* Course code and status */}
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                    <span className="size-1.5 rounded-full bg-white" />
                                    <span className="text-xs font-bold uppercase tracking-wider font-mono">
                                        {course.code}
                                    </span>
                                </span>
                                {course.semester && (
                                    <span className="text-sm font-medium text-white/80">
                                        {course.semester}
                                    </span>
                                )}
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.className}`}>
                                    {status.label}
                                </span>
                            </div>

                            {/* Course name */}
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                                {course.name}
                            </h1>

                            {/* Course info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                                <span className="flex items-center gap-1.5">
                                    <Users className="size-4" />
                                    {course.active_enrollments_count} Mahasiswa
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Layers3 className="size-4" />
                                    {course.modules?.length ?? course.modules_count ?? 0} Modul
                                </span>
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
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
                    dark:bg-[#111a15] dark:border-white/[0.07]"
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
