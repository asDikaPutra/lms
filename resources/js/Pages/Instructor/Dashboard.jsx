import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Clock, FileCheck2, HelpCircle, Users } from 'lucide-react';

import InstructorLayout from '@/Layouts/InstructorLayout';
import { Button } from '@/components/ui/button';

const statsConfig = [
    { key: 'owned_courses', label: 'Kursus', icon: BookOpen, tone: 'bg-emerald-50 text-emerald-700' },
    { key: 'pending_enrollments', label: 'Menunggu Approval', icon: Clock, tone: 'bg-amber-50 text-amber-700' },
    { key: 'submissions_needing_grading', label: 'Tugas Perlu Nilai', icon: FileCheck2, tone: 'bg-blue-50 text-blue-700' },
    { key: 'quiz_attempts_needing_grading', label: 'Quiz Perlu Nilai', icon: HelpCircle, tone: 'bg-violet-50 text-violet-700' },
];

export default function Dashboard({ stats, courses, pendingEnrollments }) {
    return (
        <InstructorLayout title="Dashboard">
            <Head title="Dashboard Dosen" />

            <section aria-labelledby="stats-title">
                <h2 id="stats-title" className="sr-only">
                    Ringkasan dosen
                </h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {statsConfig.map((item) => {
                        const Icon = item.icon;

                        return (
                            <article key={item.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`flex size-14 items-center justify-center rounded-2xl ${item.tone}`}>
                                        <Icon className="size-7" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-semibold text-slate-950">{stats[item.key]}</p>
                                        <p className="mt-1 text-sm font-medium text-slate-600">{item.label}</p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
                <section aria-labelledby="courses-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <h2 id="courses-title" className="text-lg font-semibold text-slate-950">
                            Kursus Saya
                        </h2>
                        <Link href="/instructor/courses" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                            Kelola kursus
                        </Link>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {courses.map((course) => (
                            <article key={course.id} className="rounded-xl border border-slate-100 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-700">{course.code}</p>
                                        <h3 className="mt-1 font-semibold text-slate-950">{course.name}</h3>
                                        <p className="mt-1 text-sm text-slate-500">{course.semester ?? 'Semester belum diatur'}</p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${course.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {course.is_active ? 'Aktif' : 'Arsip'}
                                    </span>
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-slate-600">
                                    <span>{course.modules_count} modul</span>
                                    <span>{course.active_enrollments_count} aktif</span>
                                    <span>{course.pending_enrollments_count} pending</span>
                                </div>
                                <Link href={`/instructor/courses/${course.id}`} className="mt-4 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                                    Buka builder
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="pending-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 id="pending-title" className="text-lg font-semibold text-slate-950">
                        Pengajuan Enrollment
                    </h2>
                    <div className="mt-4 space-y-3">
                        {pendingEnrollments.length === 0 && <p className="text-sm text-slate-500">Belum ada pengajuan baru.</p>}
                        {pendingEnrollments.map((enrollment) => (
                            <article key={enrollment.id} className="rounded-xl border border-slate-100 p-4">
                                <p className="font-semibold text-slate-950">{enrollment.user.name}</p>
                                <p className="mt-1 text-sm text-slate-500">{enrollment.course.code} - {enrollment.course.name}</p>
                                <div className="mt-3 flex gap-2">
                                    <Button type="button" size="sm" className="bg-emerald-700 text-white hover:bg-emerald-800" onClick={() => router.patch(`/instructor/courses/${enrollment.course.id}/enrollments/${enrollment.id}/approve`, {}, { preserveScroll: true })}>
                                        <CheckCircle2 />
                                        Setujui
                                    </Button>
                                    <Button type="button" size="sm" variant="outline" onClick={() => router.patch(`/instructor/courses/${enrollment.course.id}/enrollments/${enrollment.id}/reject`, {}, { preserveScroll: true })}>
                                        Tolak
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </InstructorLayout>
    );
}
