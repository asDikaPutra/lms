import { Head, router } from '@inertiajs/react';
import { TrendingUp, Users, Layers3, AlertTriangle, Activity, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

import InstructorLayout from '@/Layouts/InstructorLayout';
import CourseWorkspaceLayout from '@/components/instructor/CourseWorkspaceLayout';

export default function Progress({ course, studentProgress, moduleProgress, stats, tab }) {
    const [activeTab, setActiveTab] = useState(tab || 'students');

    const tabs = [
        { id: 'students', label: 'Per Mahasiswa', icon: Users },
        { id: 'modules', label: 'Per Modul', icon: Layers3 },
        { id: 'at_risk', label: 'Mahasiswa Berisiko', icon: AlertTriangle, count: stats.at_risk },
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        router.get(`/instructor/courses/${course.id}/progress`, { tab: tabId }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    return (
        <InstructorLayout title={`${course.name} - Progres`}>
            <Head title={`${course.name} - Progres`} />

            <CourseWorkspaceLayout course={course}>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-content-primary">Progres</h2>
                            <p className="text-sm mt-1 text-content-secondary">Pantau perkembangan belajar mahasiswa pada kursus ini.</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Progres Kelas" value={stats.avg_progress} icon={TrendingUp} color="emerald" suffix="%" />
                        <StatCard label="Mahasiswa Berisiko" value={stats.at_risk} icon={AlertTriangle} color="red" />
                        <StatCard 
                            label="Modul Terbanyak Selesai" 
                            value={stats.most_completed_module ?? '-'} 
                            icon={CheckCircle2} 
                            color="teal" 
                            isText 
                        />
                        <StatCard 
                            label="Modul Paling Tertinggal" 
                            value={stats.least_completed_module ?? '-'} 
                            icon={Clock} 
                            color="amber" 
                            isText 
                        />
                    </div>

                    {/* Tabs */}
                    <div className="rounded-xl shadow-sm border overflow-hidden bg-surface border-line dark:bg-[#081616] dark:border-white/[0.07]">
                        <div className="border-b border-line-subtle">
                            <nav className="flex gap-1 p-1.5">
                                {tabs.map((t) => {
                                    const Icon = t.icon;
                                    return (
                                        <button
                                            type="button"
                                            key={t.id}
                                            onClick={() => handleTabChange(t.id)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                                activeTab === t.id
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
                                                    : 'text-content-secondary hover:bg-surface-muted hover:text-content-primary dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white/80'
                                            }`}
                                        >
                                            <Icon className="size-4" />
                                            {t.label}
                                            {t.count > 0 && (
                                                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                                                    activeTab === t.id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                                                }`}>
                                                    {t.count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="p-4">
                            {activeTab === 'students' && <StudentProgressTab data={studentProgress} />}
                            {activeTab === 'modules' && <ModuleProgressTab data={moduleProgress} />}
                            {activeTab === 'at_risk' && <AtRiskTab data={studentProgress?.filter(s => s.is_at_risk) ?? []} />}
                        </div>
                    </div>
                </div>
            </CourseWorkspaceLayout>
        </InstructorLayout>
    );
}

function StudentProgressTab({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <Users className="size-12 text-content-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-content-primary">Belum Ada Data</h3>
                <p className="text-content-secondary">Data progres akan muncul setelah mahasiswa mulai belajar.</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Tidak ada aktivitas';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays < 7) return `${diffDays} hari lalu`;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
                <thead>
                    <tr className="border-b border-line bg-surface-muted/50 dark:border-white/[0.07] dark:bg-white/5">
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Mahasiswa</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Progres</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Modul</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Tugas</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Kuis</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Aktivitas Terakhir</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.06]">
                    {data.map((item, index) => (
                        <tr key={index} className="transition-colors hover:bg-surface-muted/50 dark:hover:bg-white/5">
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-medium text-sm">
                                        {item.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-content-primary">{item.user?.name ?? '-'}</p>
                                        <p className="text-xs text-content-secondary">{item.user?.nim ?? '-'}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-medium text-content-primary">{item.progress}%</span>
                                    <div className="w-20 h-1.5 rounded-full overflow-hidden bg-surface-muted">
                                        <div 
                                            className={`h-full rounded-full ${getProgressColor(item.progress)}`}
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <span className="text-sm text-content-secondary">{item.modules_completed}/{item.total_modules}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <span className="text-sm text-content-secondary">{item.assignments_submitted}/{item.total_assignments}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <span className="text-sm text-content-secondary">{item.quizzes_completed}/{item.total_quizzes}</span>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-sm text-content-secondary">{formatDate(item.last_activity)}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <StatusBadge isAtRisk={item.is_at_risk} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


function ModuleProgressTab({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <Layers3 className="size-12 text-content-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-content-primary">Belum Ada Modul</h3>
                <p className="text-content-secondary">Buat modul di Struktur Kurikulum untuk melihat progres per modul.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
                <thead>
                    <tr className="border-b border-line bg-surface-muted/50 dark:border-white/[0.07] dark:bg-white/5">
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Modul</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Materi Selesai</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Tugas Submit</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Kuis Selesai</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Progres Rata-rata</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.06]">
                    {data.map((module) => (
                        <tr key={module.id} className="transition-colors hover:bg-surface-muted/50 dark:hover:bg-white/5">
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-8 items-center justify-center rounded-lg font-bold text-sm bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                        {module.order}
                                    </div>
                                    <span className="font-medium text-content-primary">{module.title}</span>
                                </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <span className="text-sm text-content-secondary">
                                    {module.content_completions}/{module.max_content_completions}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <span className="text-sm text-content-secondary">{module.assignment_submissions}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <span className="text-sm text-content-secondary">{module.quiz_completions}</span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-medium text-content-primary">{module.avg_progress}%</span>
                                    <div className="w-20 h-1.5 rounded-full overflow-hidden bg-surface-muted">
                                        <div 
                                            className={`h-full rounded-full ${getProgressColor(module.avg_progress)}`}
                                            style={{ width: `${module.avg_progress}%` }}
                                        />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AtRiskTab({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <CheckCircle2 className="size-12 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-content-primary">Tidak Ada Mahasiswa Berisiko</h3>
                <p className="text-content-secondary">Semua mahasiswa memiliki progres yang baik.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border p-4 bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/30">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="size-5 mt-0.5 text-red-600 dark:text-red-400" />
                    <div>
                        <h4 className="font-medium text-red-900 dark:text-red-300">Perhatian</h4>
                        <p className="text-sm mt-1 text-red-700 dark:text-red-400/80">
                            Mahasiswa berikut memiliki progres di bawah 30% dan mungkin memerlukan perhatian khusus.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((item, index) => (
                    <div key={index} className="rounded-xl border p-4 bg-surface border-line dark:bg-[#081616] dark:border-white/[0.07]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-rose-500 text-white font-medium">
                                {item.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                            </div>
                            <div>
                                <p className="font-medium text-content-primary">{item.user?.name ?? '-'}</p>
                                <p className="text-xs text-content-secondary">{item.user?.nim ?? '-'}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-content-secondary">Progres</span>
                                <span className="font-medium text-red-600">{item.progress}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full overflow-hidden bg-surface-muted">
                                <div 
                                    className="h-full rounded-full bg-red-500"
                                    style={{ width: `${item.progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-content-secondary pt-1">
                                <span>Modul: {item.modules_completed}/{item.total_modules}</span>
                                <span>Tugas: {item.assignments_submitted}/{item.total_assignments}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


function getProgressColor(value) {
    if (value >= 70) return 'bg-emerald-500';
    if (value >= 30) return 'bg-amber-500';
    return 'bg-red-500';
}

function StatusBadge({ isAtRisk }) {
    if (isAtRisk) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                <AlertTriangle className="size-3" />
                Berisiko
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="size-3" />
            Aktif
        </span>
    );
}

function StatCard({ label, value, icon: Icon, color, suffix = '', isText = false }) {
    const colors = {
        emerald: 'from-emerald-500 to-teal-500 shadow-emerald-500/25',
        teal: 'from-teal-500 to-cyan-500 shadow-teal-500/25',
        amber: 'from-amber-500 to-orange-500 shadow-amber-500/25',
        red: 'from-red-500 to-rose-500 shadow-red-500/25',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl shadow-sm border p-4 bg-surface border-line dark:bg-[#081616] dark:border-white/[0.07]"
        >
            <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg`}>
                    <Icon className="size-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                    {isText ? (
                        <p className="text-sm font-bold text-content-primary truncate">{value}</p>
                    ) : (
                        <p className="text-2xl font-bold text-content-primary">{value}{suffix}</p>
                    )}
                    <p className="text-xs text-content-secondary">{label}</p>
                </div>
            </div>
        </motion.div>
    );
}





