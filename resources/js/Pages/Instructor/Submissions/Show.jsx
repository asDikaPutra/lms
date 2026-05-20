import { Head, Link, useForm } from '@inertiajs/react';
import { ClipboardCheck, CheckCircle2, FileText, ExternalLink, ArrowLeft, Calendar, Users, Clock } from 'lucide-react';
import { useState } from 'react';

import InstructorLayout from '@/Layouts/InstructorLayout';
import { Button } from '@/components/ui/button';

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
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali ke Tugas
                    </Link>
                ) : (
                    <Link 
                        href="/instructor/submissions" 
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali
                    </Link>
                )}
                
                <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <h2 className="text-xl font-bold text-neutral-900">{assignment.title}</h2>
                    <p className="mt-2 text-sm text-neutral-600">{assignment.description}</p>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="size-4" />
                            Deadline: {assignment.deadline ? new Date(assignment.deadline).toLocaleString('id-ID') : '-'}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Users className="size-4" />
                            {stats.total} submission
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Submission" value={stats.total} color="emerald" />
                <StatCard label="Sudah Dinilai" value={stats.graded} color="teal" />
                <StatCard label="Menunggu Penilaian" value={stats.pending} color="amber" />
                <StatCard label="Terlambat" value={stats.late} color="red" />
            </div>

            {/* Submissions List */}
            <section className="space-y-4" aria-label="Daftar pengumpulan tugas">
                {submissions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
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

function StatCard({ label, value, color }) {
    const colorClasses = {
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        teal: 'bg-teal-50 text-teal-700 border-teal-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        red: 'bg-red-50 text-red-700 border-red-200',
    };

    return (
        <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-medium">{label}</p>
        </div>
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
        <article className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                        {submission.user?.name}
                    </h3>
                    {submission.user?.nim && (
                        <p className="text-sm text-neutral-500">NIM: {submission.user.nim}</p>
                    )}
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
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
                        className="inline-flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-neutral-100 border border-neutral-200"
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
                        className="inline-flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-neutral-100 border border-neutral-200"
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
                <form onSubmit={submitGrade} className="mt-4 space-y-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                    <div>
                        <label htmlFor={`grade-${submission.id}`} className="block text-sm font-semibold text-neutral-700">
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
                            className="mt-2 h-10 w-32 rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                        {form.errors.grade && <p role="alert" className="mt-1 text-sm text-red-600">{form.errors.grade}</p>}
                    </div>
                    <div>
                        <label htmlFor={`feedback-${submission.id}`} className="block text-sm font-semibold text-neutral-700">
                            Feedback (opsional)
                        </label>
                        <textarea
                            id={`feedback-${submission.id}`}
                            rows="3"
                            value={form.data.feedback}
                            onChange={(e) => form.setData('feedback', e.target.value)}
                            className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                        <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200">
                            <p className="text-sm font-semibold text-emerald-800">Feedback:</p>
                            <p className="mt-1 whitespace-pre-line text-sm text-emerald-700">{submission.feedback}</p>
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}
