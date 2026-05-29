import { Head, Link, router } from '@inertiajs/react';
import { MessageSquare, Search, Users, MessageCircle, Bell, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import InstructorLayout from '@/Layouts/InstructorLayout';
import CourseWorkspaceLayout from '@/components/instructor/CourseWorkspaceLayout';
import { Button } from '@/components/ui/button';

export default function Discussions({ course, discussions, stats, filters }) {
    const [filterData, setFilterData] = useState({
        search: filters.search ?? '',
        module_id: filters.module_id ?? '',
    });

    // Debounced filter
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(`/instructor/courses/${course.id}/discussions`, filterData, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [filterData]);

    return (
        <InstructorLayout title={`${course.name} - Diskusi`}>
            <Head title={`${course.name} - Diskusi`} />

            <CourseWorkspaceLayout course={course}>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white/90">Diskusi</h2>
                            <p className="text-sm mt-1 text-neutral-600 dark:text-white/45">Kelola forum dan diskusi pada kursus ini.</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard label="Total Materi" value={stats.total} icon={MessageSquare} color="emerald" />
                        <StatCard label="Diskusi Aktif" value={stats.active} icon={MessageCircle} color="teal" />
                        <StatCard label="Komentar Baru (7 hari)" value={stats.new_comments} icon={Bell} color="amber" />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400 dark:text-white/30" />
                            <input
                                value={filterData.search}
                                onChange={(e) => setFilterData(prev => ({ ...prev, search: e.target.value }))}
                                placeholder="Cari materi..."
                                className="h-10 w-full rounded-lg border pl-10 pr-4 text-sm outline-none border-neutral-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/8 dark:text-white dark:placeholder:text-white/25 dark:focus:border-emerald-500/60"
                            />
                        </div>
                        <select
                            value={filterData.module_id}
                            onChange={(e) => setFilterData(prev => ({ ...prev, module_id: e.target.value }))}
                            className="h-10 rounded-lg border px-3 text-sm outline-none border-neutral-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/8 dark:text-white/80 dark:focus:border-emerald-500/60"
                        >
                            <option value="">Semua Modul</option>
                            {course.modules?.map((module) => (
                                <option key={module.id} value={module.id}>{module.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Discussions List */}
                    {discussions.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl shadow-sm border overflow-hidden bg-white border-neutral-100 dark:bg-[#111a15] dark:border-white/[0.07]"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[700px]">
                                    <thead>
                                        <tr className="border-b border-neutral-100 bg-neutral-50/50 dark:border-white/[0.07] dark:bg-white/5">
                                            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Materi</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Modul</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Post</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Komentar</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Baru</th>
                                            <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.06]">
                                        {discussions.map((material) => (
                                            <tr key={material.id} className="transition-colors hover:bg-neutral-50/50 dark:hover:bg-white/5">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100">
                                                            <MessageSquare className="size-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-neutral-900 dark:text-white/80">{material.title}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm text-neutral-600 dark:text-white/50">{material.module?.title ?? '-'}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-sm font-medium text-neutral-900 dark:text-white/80">{material.total_posts ?? 0}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-sm text-neutral-600 dark:text-white/50">{material.total_comments ?? 0}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {material.new_comments > 0 ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                                                            {material.new_comments}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-neutral-400">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-end">
                                                        <Link
                                                            href={`/instructor/courses/${course.id}/curriculum`}
                                                            className="inline-flex h-8 items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                        >
                                                            <Eye className="mr-1.5 size-3.5" /> Lihat
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* Info Card */}
                    <div className="rounded-xl border p-4
                        bg-blue-50 border-blue-200
                        dark:bg-emerald-500/10 dark:border-emerald-500/30">
                        <div className="flex items-start gap-3">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-emerald-500/20">
                                <MessageSquare className="size-4 text-blue-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="font-medium text-blue-900 dark:text-emerald-300">Tentang Diskusi</h4>
                                <p className="text-sm text-blue-700 dark:text-emerald-400/80 mt-1">
                                    Diskusi terkait dengan setiap materi pembelajaran. Untuk melihat dan membalas diskusi, 
                                    buka halaman <Link href={`/instructor/courses/${course.id}/curriculum`} className="underline font-medium">Struktur Kurikulum</Link> dan 
                                    klik pada materi yang ingin dilihat diskusinya.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CourseWorkspaceLayout>
        </InstructorLayout>
    );
}


function StatCard({ label, value, icon: Icon, color }) {
    const colors = {
        emerald: 'from-emerald-500 to-teal-500 shadow-emerald-500/25',
        teal: 'from-teal-500 to-cyan-500 shadow-teal-500/25',
        amber: 'from-amber-500 to-orange-500 shadow-amber-500/25',
        blue: 'from-blue-500 to-indigo-500 shadow-blue-500/25',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl shadow-sm border p-4 bg-white border-neutral-100 dark:bg-[#111a15] dark:border-white/[0.07]"
        >
            <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg`}>
                    <Icon className="size-5 text-white" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white/90">{value}</p>
                    <p className="text-xs text-neutral-500 dark:text-white/40">{label}</p>
                </div>
            </div>
        </motion.div>
    );
}

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl shadow-sm border p-12 text-center bg-white border-neutral-100 dark:bg-[#111a15] dark:border-white/[0.07]"
        >
            <div className="flex justify-center mb-6">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200">
                    <MessageSquare className="size-10 text-blue-600" />
                </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white/90">Belum Ada Materi</h3>
            <p className="mb-6 max-w-md mx-auto text-neutral-600 dark:text-white/45">
                Diskusi akan muncul setelah Anda membuat materi pembelajaran di Struktur Kurikulum.
            </p>
        </motion.div>
    );
}


