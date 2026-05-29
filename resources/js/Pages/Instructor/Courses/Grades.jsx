import { Head, Link, router } from '@inertiajs/react';
import { BarChart3, TrendingUp, TrendingDown, AlertCircle, Clock, Download, Settings, FileText, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

import InstructorLayout from '@/Layouts/InstructorLayout';
import CourseWorkspaceLayout from '@/components/instructor/CourseWorkspaceLayout';
import { Button } from '@/components/ui/button';
import { FilterButton } from '@/components/ui/filter-button';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';

export default function Grades({ course, gradebook, needsGrading, stats, tab }) {
    const [activeTab, setActiveTab] = useState(tab || 'gradebook');

    const tabs = [
        { id: 'gradebook', label: 'Gradebook', icon: BarChart3 },
        { id: 'needs_grading', label: 'Perlu Dinilai', icon: Clock, count: stats.needs_grading },
        { id: 'weights', label: 'Bobot Nilai', icon: Settings },
        { id: 'export', label: 'Export', icon: Download },
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        router.get(`/instructor/courses/${course.id}/grades`, { tab: tabId }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    return (
        <InstructorLayout title={`${course.name} - Nilai`}>
            <Head title={`${course.name} - Nilai`} />

            <CourseWorkspaceLayout course={course}>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-content-primary">Nilai</h2>
                            <p className="text-sm mt-1 text-content-secondary">Kelola nilai dan rekap penilaian kursus ini.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2">
                                <Download className="size-4" /> Export
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <StatCard label="Rata-rata Kelas" value={stats.avg_grade} icon={BarChart3} color="emerald" />
                        <StatCard label="Nilai Tertinggi" value={stats.highest} icon={TrendingUp} color="teal" />
                        <StatCard label="Nilai Terendah" value={stats.lowest} icon={TrendingDown} color="amber" />
                        <StatCard label="Belum Lengkap" value={stats.incomplete} icon={AlertCircle} color="red" />
                        <StatCard label="Perlu Dinilai" value={stats.needs_grading} icon={Clock} color="blue" />
                    </div>

                    {/* Tabs */}
                    <Card>
                        <div className="border-b border-line-subtle">
                            <nav className="flex gap-1 p-1.5">
                                {tabs.map((t) => {
                                    const Icon = t.icon;
                                    return (
                                        <FilterButton
                                            key={t.id}
                                            active={activeTab === t.id}
                                            onClick={() => handleTabChange(t.id)}
                                            className="rounded-lg"
                                        >
                                            <Icon className="size-4" />
                                            {t.label}
                                            {t.count > 0 && (
                                                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                                                    activeTab === t.id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {t.count}
                                                </span>
                                            )}
                                        </FilterButton>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="p-4">
                            {activeTab === 'gradebook' && <GradebookTab gradebook={gradebook} />}
                            {activeTab === 'needs_grading' && <NeedsGradingTab items={needsGrading} courseId={course.id} />}
                            {activeTab === 'weights' && <WeightsTab />}
                            {activeTab === 'export' && <ExportTab />}
                        </div>
                    </Card>
                </div>
            </CourseWorkspaceLayout>
        </InstructorLayout>
    );
}

function GradebookTab({ gradebook }) {
    if (!gradebook || gradebook.length === 0) {
        return (
            <div className="text-center py-12">
                <BarChart3 className="size-12 text-content-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-content-primary">Belum Ada Data Nilai</h3>
                <p className="text-content-secondary">Data nilai akan muncul setelah mahasiswa mengerjakan tugas dan kuis.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
                <thead>
                    <tr className="border-b border-line bg-surface-muted/50 dark:border-white/[0.07] dark:bg-white/5">
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Mahasiswa</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Tugas</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Kuis</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Nilai Akhir</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.06]">
                    {gradebook.map((item, index) => (
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
                            <td className="py-3 px-4 text-center">
                                <GradeCell value={item.assignment_avg} />
                            </td>
                            <td className="py-3 px-4 text-center">
                                <GradeCell value={item.quiz_avg} />
                            </td>
                            <td className="py-3 px-4 text-center">
                                <span className={`text-lg font-bold ${getGradeColor(item.final_grade)}`}>
                                    {item.final_grade ?? '-'}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                                {item.is_complete ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 className="size-3" /> Lengkap
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                                        <AlertCircle className="size-3" /> Belum Lengkap
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


function NeedsGradingTab({ items, courseId }) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12">
                <CheckCircle2 className="size-12 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-content-primary">Semua Sudah Dinilai</h3>
                <p className="text-content-secondary">Tidak ada submission yang perlu dinilai saat ini.</p>
            </div>
        );
    }

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

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
                <thead>
                    <tr className="border-b border-line bg-surface-muted/50 dark:border-white/[0.07] dark:bg-white/5">
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Item</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Mahasiswa</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Submit</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-secondary">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.06]">
                    {items.map((item) => (
                        <tr key={item.id} className="transition-colors hover:bg-surface-muted/50 dark:hover:bg-white/5">
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100">
                                        <FileText className="size-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-content-primary">{item.assignment?.title ?? '-'}</p>
                                        <p className="text-xs text-content-secondary">Tugas</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-sm text-content-secondary">{item.user?.name ?? '-'}</span>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-sm text-content-secondary">{formatDate(item.submitted_at)}</span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex justify-end">
                                    <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700">
                                        Nilai
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function WeightsTab() {
    return (
        <div className="max-w-md mx-auto py-8">
            <div className="text-center mb-6">
                <Settings className="size-12 text-content-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-content-primary">Bobot Nilai</h3>
                <p className="text-content-secondary text-sm">Atur bobot penilaian untuk setiap komponen.</p>
            </div>
            <div className="space-y-4 rounded-xl p-6 border
                bg-surface-muted border-line
                dark:bg-white/5 dark:border-white/[0.07]">
                <WeightItem label="Tugas" value={30} />
                <WeightItem label="Kuis" value={20} />
                <WeightItem label="Diskusi" value={10} />
                <WeightItem label="UTS" value={20} />
                <WeightItem label="UAS" value={20} />
                <div className="pt-4 border-t border-line">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-content-primary">Total</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">100%</span>
                    </div>
                </div>
            </div>
            <p className="text-xs text-content-secondary text-center mt-4">
                Fitur pengaturan bobot akan segera tersedia.
            </p>
        </div>
    );
}

function WeightItem({ label, value }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-content-secondary">{label}</span>
            <span className="font-medium text-content-primary">{value}%</span>
        </div>
    );
}

function ExportTab() {
    return (
        <div className="text-center py-12">
            <Download className="size-12 text-content-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-content-primary">Export Nilai</h3>
            <p className="text-content-secondary mb-6">Unduh rekap nilai dalam berbagai format.</p>
            <div className="flex justify-center gap-3">
                <Button variant="outline" className="gap-2">
                    <FileText className="size-4" /> Excel
                </Button>
                <Button variant="outline" className="gap-2">
                    <FileText className="size-4" /> CSV
                </Button>
                <Button variant="outline" className="gap-2">
                    <FileText className="size-4" /> PDF
                </Button>
            </div>
            <p className="text-xs text-content-secondary mt-4">
                Fitur export akan segera tersedia.
            </p>
        </div>
    );
}


function GradeCell({ value }) {
    if (value === null || value === undefined) {
        return <span className="text-content-muted">-</span>;
    }
    return <span className={`font-medium ${getGradeColor(value)}`}>{value}</span>;
}

function getGradeColor(value) {
    if (value === null || value === undefined) return 'text-content-muted';
    if (value >= 80) return 'text-emerald-600';
    if (value >= 60) return 'text-amber-600';
    return 'text-red-600';
}
