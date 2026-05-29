import { Head, Link, useForm } from '@inertiajs/react';
import { ClipboardCheck, CheckCircle2, FileText, ExternalLink, ArrowLeft, Calendar, Users, Clock } from 'lucide-react';
import { useState } from 'react';

import InstructorLayout from '@/Layouts/InstructorLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';

export default function Show({ assignment, submissions }) {
    const stats = {
        total: submissions.length,
        graded: submissions.filter(s => s.status === 'graded').length,
        pending: submissions.filter(s => s.status === 'submitted').length,
        late: submissions.filter(s => s.status === 'late').length,
    };

    // Get course ID from assignable (could be module or material)
    const getCourseId = () => {
        if (!assignment.assignable) return null;
        // If assignable is a module, it has course_id directly
        if (assignment.assignable.course_id) return assignment.assignable.course_id;
        // If assignable is a material, get course_id from module
        if (assignment.assignable.module?.course_id) return assignment.assignable.module.course_id;
        return null;
    };

    const courseId = getCourseId();

    return (
        <InstructorLayout title={`Submissions - ${assignment.title}`}>
            <Head title={`Submissions - ${assignment.title}`} />

            <div className="mb-6">
                {courseId ? (
                    <Link 
                        href={`/instructor/courses/${courseId}/assignments`} 
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali ke Tugas
                    </Link>
                ) : (
                    <Link 
                        href="/instructor/submissions" 
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali
                    </Link>
                )}
                
                <Card className="mt-4">
                    <CardContent className="pt-5">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white/90">{assignment.title}</h2>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-white/50">{assignment.description}</p>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-white/35">
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="size-4" />
                            Deadline: {assignment.deadline ? new Date(assignment.deadline).toLocaleString('id-ID') : '-'}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Users className="size-4" />
                            {stats.total} submission
                        </span>
                    </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Submission" value={stats.total} color="emerald" />
                <StatCard label="Sudah Dinilai" value={stats.graded} color="teal" />
                <StatCard label="Menunggu Penilaian" value={stats.pending} color="amber" />
                <StatCard label="Terlambat" value={stats.late} color="red" />
            </div>
            <section className="space-y-4" aria-label="Daftar pengumpulan tugas">
                {submissions.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-8 text-center text-sm border-neutral-300 bg-white text-neutral-500 dark:bg-transparent dark:border-white/15 dark:text-white/35">
                        Belum ada pengumpulan tugas.
                    </div>
                ) : (
                    submissions.map((submission) => (
                        <SubmissionCard key={submission.id} submission={submission} />
                    ))
                )}
            </section>
        </InstructorLayout>
    );
}

function SubmissionCard({ submission }) {
    const [showGrade, setShowGrade] = useState(false);
    const form = useForm({
        grade: submission.grade ?? '',
        feedback: submission.feedback ?? '',
    });

    const submitGrade = (event) => {
        event.preventDefault();
        form.put(`/instructor/submissions/${submission.id}/grade`, {
            preserveScroll: true,
            onSuccess: () => setShowGrade(false),
        });
    };

    const statusBadge = {
        submitted: 'bg-amber-50 text-amber-700 border-amber-200',
        late: 'bg-red-50 text-red-700 border-red-200',
        graded: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    const statusLabel = {
        submitted: 'Menunggu penilaian',
        late: 'Terlambat',
        graded: `Dinilai: ${submission.grade}`,
    };

    return (
        <Card>
            <CardContent className="pt-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white/90">
                        {submission.user?.name}
                    </h3>
                    {submission.user?.nim && (
                        <p className="text-sm text-neutral-500 dark:text-white/35">NIM: {submission.user.nim}</p>
                    )}
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400 dark:text-white/25">
                        <Clock className="size-3.5" />
                        Dikumpulkan: {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString('id-ID') : '-'}
                    </p>
                </div>
                <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge[submission.status]}`}>
                    {statusLabel[submission.status]}
                </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                {submission.file_path && (
                    <a 
                        href={`/storage/${submission.file_path}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border bg-neutral-50 text-emerald-700 hover:bg-neutral-100 border-neutral-200 dark:bg-white/8 dark:text-emerald-400 dark:border-white/10 dark:hover:bg-white/12"
                    >
                        <FileText className="size-4" aria-hidden="true" />
                        Unduh File
                    </a>
                )}
                {submission.link_url && (
                    <a 
                        href={submission.link_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border bg-neutral-50 text-emerald-700 hover:bg-neutral-100 border-neutral-200 dark:bg-white/8 dark:text-emerald-400 dark:border-white/10 dark:hover:bg-white/12"
                    >
                        <ExternalLink className="size-4" aria-hidden="true" />
                        Buka Link
                    </a>
                )}
            </div>

            {submission.status !== 'graded' && !showGrade && (
                <Button 
                    type="button" 
                    className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700" 
                    onClick={() => setShowGrade(true)}
                >
                    <CheckCircle2 className="mr-1.5 size-4" />
                    Beri Nilai
                </Button>
            )}

            {showGrade && (
                <form onSubmit={submitGrade} className="mt-4 space-y-4 rounded-xl border p-4 border-neutral-100 bg-neutral-50 dark:bg-white/5 dark:border-white/[0.07]">
                    <div>
                        <label htmlFor={`grade-${submission.id}`} className="block text-sm font-semibold text-neutral-700 dark:text-white/70">
                            Nilai (0-100)
                        </label>
                        <input
                            id={`grade-${submission.id}`}
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={form.data.grade}
                            onChange={(e) => form.setData('grade', e.target.value)}
                            className="mt-2 h-10 w-32 rounded-lg border px-3 text-sm outline-none border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-white/8 dark:text-white/90"
                        />
                        {form.errors.grade && <p role="alert" className="mt-1 text-sm text-red-600">{form.errors.grade}</p>}
                    </div>
                    <div>
                        <label htmlFor={`feedback-${submission.id}`} className="block text-sm font-semibold text-neutral-700 dark:text-white/70">
                            Feedback (opsional)
                        </label>
                        <textarea
                            id={`feedback-${submission.id}`}
                            rows="3"
                            value={form.data.feedback}
                            onChange={(e) => form.setData('feedback', e.target.value)}
                            className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25"
                            placeholder="Catatan untuk mahasiswa..."
                        />
                        {form.errors.feedback && <p role="alert" className="mt-1 text-sm text-red-600">{form.errors.feedback}</p>}
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            type="submit" 
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700" 
                            disabled={form.processing}
                        >
                            <CheckCircle2 className="mr-1.5 size-4" />
                            Simpan Nilai
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowGrade(false)}>
                            Batal
                        </Button>
                    </div>
                </form>
            )}

            {submission.status === 'graded' && (
                <div className="mt-4 space-y-2">
                    <Button 
                        type="button" 
                        variant="outline"
                        size="sm"
                        onClick={() => setShowGrade(true)}
                    >
                        Edit Nilai
                    </Button>
                    {submission.feedback && (
                        <div className="rounded-lg p-3 border bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30">
                            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Feedback:</p>
                            <p className="mt-1 whitespace-pre-line text-sm text-emerald-700 dark:text-emerald-400/80">{submission.feedback}</p>
                        </div>
                    )}
                </div>
            )}
        </CardContent>
        </Card>
    );
}

