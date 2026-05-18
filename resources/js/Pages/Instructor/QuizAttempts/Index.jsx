import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle2, ClipboardCheck } from 'lucide-react';

import InstructorLayout from '@/Layouts/InstructorLayout';
import { Button } from '@/components/ui/button';

export default function Index({ attempts }) {
    return (
        <InstructorLayout title="Penilaian Quiz">
            <Head title="Penilaian Quiz" />

            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <Link href="/instructor/dashboard" className="text-sm font-semibold text-blue-700 hover:text-blue-900">
                        Kembali ke dashboard
                    </Link>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Penilaian Quiz</h2>
                    <p className="mt-1 text-sm text-slate-500">Review jawaban essay yang menunggu penilaian.</p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                    <ClipboardCheck className="size-4" aria-hidden="true" />
                    {attempts.length} menunggu
                </div>
            </div>

            <section className="space-y-4" aria-label="Daftar attempt quiz">
                {attempts.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                        Belum ada jawaban essay yang perlu dinilai.
                    </div>
                )}

                {attempts.map((attempt) => (
                    <AttemptCard key={attempt.id} attempt={attempt} />
                ))}
            </section>
        </InstructorLayout>
    );
}

function AttemptCard({ attempt }) {
    const essayQuestions = attempt.quiz.questions.filter((question) => question.type === 'essay');
    const form = useForm({
        essay_scores: Object.fromEntries(essayQuestions.map((question) => [question.id, ''])),
    });

    const submit = (event) => {
        event.preventDefault();
        form.put(`/instructor/quiz-attempts/${attempt.id}/grade`, {
            preserveScroll: true,
        });
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-950">{attempt.quiz.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{attempt.student?.name} - passing {attempt.quiz.passing_score}</p>
                </div>
                <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Menunggu penilaian
                </span>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
                {essayQuestions.map((question) => (
                    <div key={question.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                        <p className="text-sm font-semibold text-slate-950">{question.question}</p>
                        <p className="mt-3 whitespace-pre-line rounded-lg bg-white p-3 text-sm leading-6 text-slate-700">
                            {question.answer || 'Belum ada jawaban.'}
                        </p>
                        <label className="mt-3 block text-sm font-semibold text-slate-700" htmlFor={`score-${attempt.id}-${question.id}`}>
                            Nilai essay, maks {question.points}
                        </label>
                        <input
                            id={`score-${attempt.id}-${question.id}`}
                            type="number"
                            min="0"
                            max={question.points}
                            step="0.01"
                            value={form.data.essay_scores[question.id] ?? ''}
                            onChange={(event) => form.setData('essay_scores', { ...form.data.essay_scores, [question.id]: event.target.value })}
                            className="mt-2 h-10 w-32 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15"
                        />
                    </div>
                ))}

                {form.errors.essay_scores && <p role="alert" className="text-sm text-rose-600">{form.errors.essay_scores}</p>}
                <Button type="submit" className="bg-blue-700 text-white hover:bg-blue-800" disabled={form.processing}>
                    <CheckCircle2 />
                    Simpan Nilai
                </Button>
            </form>
        </article>
    );
}
