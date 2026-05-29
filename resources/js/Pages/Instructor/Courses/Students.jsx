import { Head, router } from '@inertiajs/react';
import { Users, Search, CheckCircle2, Clock, AlertTriangle, TrendingUp, Eye, MoreHorizontal, UserX, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import InstructorLayout from '@/Layouts/InstructorLayout';
import CourseWorkspaceLayout from '@/components/instructor/CourseWorkspaceLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { EmptyState } from '@/components/ui/empty-state';

export default function Students({ course, enrollments, stats, filters }) {
    const [filterData, setFilterData] = useState({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });
    const [openDropdown, setOpenDropdown] = useState(null);

    // Debounced filter
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(`/instructor/courses/${course.id}/students`, filterData, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [filterData]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const approveEnrollment = (enrollmentId) => {
        router.patch(`/instructor/courses/${course.id}/enrollments/${enrollmentId}/approve`, {}, { preserveScroll: true });
    };

    const rejectEnrollment = (enrollmentId) => {
        if (confirm('Apakah Anda yakin ingin menolak pendaftaran ini?')) {
            router.patch(`/instructor/courses/${course.id}/enrollments/${enrollmentId}/reject`, {}, { preserveScroll: true });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTimeSince = (dateString) => {
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
        return formatDate(dateString);
    };

    return (
        <InstructorLayout title={`${course.name} - Peserta`}>
            <Head title={`${course.name} - Peserta`} />

            <CourseWorkspaceLayout course={course}>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white/90">Peserta</h2>
                            <p className="text-sm mt-1 text-neutral-600 dark:text-white/45">Lihat dan kelola peserta pada kursus ini.</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <StatCard label="Total Peserta" value={stats.total} icon={Users} color="emerald" />
                        <StatCard label="Aktif" value={stats.active} icon={CheckCircle2} color="teal" />
                        <StatCard label="Pending" value={stats.pending} icon={Clock} color="amber" />
                        <StatCard label="Berisiko" value={stats.at_risk} icon={AlertTriangle} color="red" />
                        <StatCard label="Rata-rata Progres" value={stats.avg_progress} icon={TrendingUp} color="blue" suffix="%" />
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400 dark:text-white/30" />
                            <input
                                value={filterData.search}
                                onChange={(e) => setFilterData(prev => ({ ...prev, search: e.target.value }))}
                                placeholder="Cari nama, NIM, atau email..."
                                className="h-10 w-full rounded-lg border pl-10 pr-4 text-sm outline-none border-neutral-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/8 dark:text-white dark:placeholder:text-white/25 dark:focus:border-emerald-500/60"
                            />
                        </div>
                        <select
                            value={filterData.status}
                            onChange={(e) => setFilterData(prev => ({ ...prev, status: e.target.value }))}
                            className="h-10 rounded-lg border px-3 text-sm outline-none border-neutral-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/8 dark:text-white/80 dark:focus:border-emerald-500/60"
                        >
                            <option value="">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    {/* Students Table */}
                    {enrollments.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="Belum Ada Peserta"
                            description="Bagikan kode enroll kursus kepada mahasiswa untuk mendaftarkan mereka ke kursus ini."
                        />
                    ) : (
                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1000px]">
                                    <thead>
                                        <tr className="border-b border-neutral-100 bg-neutral-50/50 dark:border-white/[0.07] dark:bg-white/5">
                                            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Mahasiswa</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">NIM</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Progres</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Tugas</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Kuis</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Aktivitas Terakhir</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Status</th>
                                            <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.06]">
                                        {enrollments.map((enrollment) => (
                                            <tr key={enrollment.id} className="transition-colors hover:bg-neutral-50/50 dark:hover:bg-white/5">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-medium text-sm">
                                                            {enrollment.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-neutral-900 dark:text-white/80">{enrollment.user?.name ?? '-'}</p>
                                                            <p className="text-xs text-neutral-500 dark:text-white/40">{enrollment.user?.email ?? '-'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm font-mono text-neutral-600">{enrollment.user?.nim ?? '-'}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="text-sm font-medium text-neutral-900 dark:text-white/80">{enrollment.progress ?? 0}%</span>
                                                        <div className="w-16 h-1.5 rounded-full overflow-hidden bg-neutral-200 dark:bg-white/10">
                                                            <div 
                                                                className={`h-full rounded-full ${enrollment.progress >= 70 ? 'bg-emerald-500' : enrollment.progress >= 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                                style={{ width: `${enrollment.progress ?? 0}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-sm text-neutral-600 dark:text-white/50">
                                                        {enrollment.submitted_assignments ?? 0}/{enrollment.total_assignments ?? 0}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-sm text-neutral-600 dark:text-white/50">
                                                        {enrollment.completed_quizzes ?? 0}/{enrollment.total_quizzes ?? 0}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm text-neutral-500 dark:text-white/35">{getTimeSince(enrollment.updated_at)}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <StatusBadge status={enrollment.status} isAtRisk={enrollment.is_at_risk} />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {enrollment.status === 'pending' ? (
                                                            <>
                                                                <Button
                                                                    onClick={() => approveEnrollment(enrollment.id)}
                                                                    size="sm"
                                                                    className="h-8 bg-emerald-600 hover:bg-emerald-700"
                                                                >
                                                                    <CheckCircle2 className="mr-1 size-3.5" /> Terima
                                                                </Button>
                                                                <Button
                                                                    onClick={() => rejectEnrollment(enrollment.id)}
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                                                                >
                                                                    <UserX className="mr-1 size-3.5" /> Tolak
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8"
                                                            >
                                                                <Eye className="mr-1 size-3.5" /> Detail
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </div>
            </CourseWorkspaceLayout>
        </InstructorLayout>
    );
}


function StatusBadge({ status, isAtRisk }) {
    if (status === 'pending') {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                <Clock className="size-3" />
                Pending
            </span>
        );
    }
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
