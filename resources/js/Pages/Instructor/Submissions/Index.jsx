import { Head, Link, router, useForm } from '@inertiajs/react';
import { ClipboardCheck, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { useState } from 'react';

import InstructorLayout from '@/Layouts/InstructorLayout';
import { Button } from '@/components/ui/button';

export default function Index({ submissions }) {
    return (
        <InstructorLayout title="Penilaian Tugas">
            <Head title="Penilaian Tugas" />

            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <Link href="/instructor/dashboard" className="text-sm font-semibold text-blue-700 hover:text-blue-900">
                        Kembali ke dashboard
                    </Link>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Penilaian Tugas</h2>
                    <p className="mt-1 text-sm text-slate-500">Review dan beri nilai pengumpulan tugas mahasiswa.</p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                    <ClipboardCheck className="size-4" aria-hidden="true" />
                    {submissions.total} pengumpulan
                </div>
            </div>

            <section className="space-y-4" aria-label="Daftar pengumpulan tugas">
                {submissions.data.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                        Belum ada pengumpulan tugas.
                    </div>
                )}

                {submissions.data.map((submission) => (
                    <SubmissionCard key={submission.id} submission={submission} />
                ))}
            </section>

            {submissions.last_page > 1 && (
                <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Pagination">
                    {submissions.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url || '#'}
                            className={`rounded-lg px-3 py-2 text-sm ${link.active ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            preserveScroll
                        />
                    ))}
                </nav>
            )}
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
        submitted: 'bg-amber-50 text-amber-700',
        late: 'bg-rose-50 text-rose-700',
        graded: 'bg-emerald-50 text-emerald-700',
    };

    const statusLabel = {
        submitted: 'Menunggu penilaian',
        late: 'Terlambat',
        graded: `Dinilai: ${submission.grade}`,
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-950">{submission.assignment?.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {submission.user?.name} {submission.user?.nim && `(${submission.user.nim})`}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        Dikumpulkan: {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString('id-ID') : '-'}
                    </p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[submission.status]}`}>
                    {statusLabel[submission.status]}
                </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                {submission.file_path && (
                    <a href={`/storage/${submission.file_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-slate-100">
                        <FileText className="size-4" aria-hidden="true" />
                        Unduh File
                    </a>
                )}
                {submission.link_url && (
                    <a href={submission.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-slate-100">
                        <ExternalLink className="size-4" aria-hidden="true" />
                        Buka Link
                    </a>
                )}
            </div>

            {submission.status !== 'graded' && !showGrade && (
                <Button type="button" className="mt-4 bg-blue-700 text-white hover:bg-blue-800" onClick={() => setShowGrade(true)}>
                    <CheckCircle2 className="mr-1.5 size-4" />
                    Beri Nilai
                </Button>
            )}

            {showGrade && (
                <form onSubmit={submitGrade} className="mt-4 space-y-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div>
                        <label htmlFor={`grade-${submission.id}`} className="block text-sm font-semibold text-slate-700">
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
                            className="mt-2 h-10 w-32 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15"
                        />
                        {form.errors.grade && <p role="alert" className="mt-1 text-sm text-rose-600">{form.errors.grade}</p>}
                    </div>
                    <div>
                        <label htmlFor={`feedback-${submission.id}`} className="block text-sm font-semibold text-slate-700">
                            Feedback (opsional)
                        </label>
                        <textarea
                            id={`feedback-${submission.id}`}
                            rows="3"
                            value={form.data.feedback}
                            onChange={(e) => form.setData('feedback', e.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15"
                            placeholder="Catatan untuk mahasiswa..."
                        />
                        {form.errors.feedback && <p role="alert" className="mt-1 text-sm text-rose-600">{form.errors.feedback}</p>}
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" className="bg-blue-700 text-white hover:bg-blue-800" disabled={form.processing}>
                            <CheckCircle2 className="mr-1.5 size-4" />
                            Simpan Nilai
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowGrade(false)}>
                            Batal
                        </Button>
                    </div>
                </form>
            )}

            {submission.status === 'graded' && submission.feedback && (
                <div className="mt-4 rounded-lg bg-emerald-50 p-3">
                    <p className="text-sm font-semibold text-emerald-800">Feedback:</p>
                    <p className="mt-1 whitespace-pre-line text-sm text-emerald-700">{submission.feedback}</p>
                </div>
            )}
        </article>
    );
}
