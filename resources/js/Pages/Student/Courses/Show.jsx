import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, Download, FileText, PlayCircle } from 'lucide-react';

import StudentLayout from '@/Layouts/StudentLayout';
import { Button } from '@/components/ui/button';

export default function Show({ course, completedContentIds, progress }) {
    const completed = new Set(completedContentIds);

    return (
        <StudentLayout title="Belajar">
            <Head title={`${course.name} - Belajar`} />

            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <Link href="/student/dashboard" className="text-sm font-semibold text-blue-700 hover:text-blue-900">
                        Kembali ke dashboard
                    </Link>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">{course.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{course.code} - {course.instructor?.name}</p>
                </div>
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:max-w-xs">
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Progress belajar</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            <section aria-labelledby="modules-title" className="space-y-5">
                <h2 id="modules-title" className="sr-only">Daftar materi</h2>
                {course.modules.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">Belum ada materi yang dipublish.</p>
                )}
                {course.modules.map((module) => (
                    <article key={module.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Modul {module.order}</p>
                            <h3 className="mt-1 text-lg font-semibold text-slate-950">{module.title}</h3>
                            {module.description && <p className="mt-1 text-sm text-slate-500">{module.description}</p>}
                        </div>

                        <div className="mt-5 space-y-4">
                            {module.materials.map((material) => (
                                <section key={material.id} aria-labelledby={`material-${material.id}`} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                                    <h4 id={`material-${material.id}`} className="font-semibold text-slate-950">{material.title}</h4>
                                    <div className="mt-4 space-y-3">
                                        {material.contents.map((content) => (
                                            <ContentBlock key={content.id} content={content} completed={completed.has(content.id)} />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </article>
                ))}
            </section>
        </StudentLayout>
    );
}

function ContentBlock({ content, completed }) {
    return (
        <article className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        {content.type === 'video' ? <PlayCircle className="size-5" aria-hidden="true" /> : <FileText className="size-5" aria-hidden="true" />}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-950">{content.title}</p>
                        <p className="mt-1 text-sm capitalize text-slate-500">{content.type}</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant={completed ? 'outline' : 'default'}
                    className={completed ? '' : 'bg-blue-700 text-white hover:bg-blue-800'}
                    disabled={completed}
                    onClick={() => router.patch(`/student/contents/${content.id}/complete`, {}, { preserveScroll: true })}
                >
                    <CheckCircle2 />
                    {completed ? 'Selesai' : 'Tandai selesai'}
                </Button>
            </div>

            <div className="mt-4">
                {content.type === 'artikel' && <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{content.body}</p>}
                {content.type === 'video' && <VideoContent url={content.url} />}
                {content.type === 'audio' && <audio controls className="w-full" src={storageUrl(content.file_path)} />}
                {content.type === 'pdf' && (
                    <div className="space-y-3">
                        <iframe title={content.title} src={storageUrl(content.file_path)} className="h-[28rem] w-full rounded-lg border border-slate-200" />
                        <DownloadLink path={content.file_path} label="Buka PDF" />
                    </div>
                )}
                {content.type === 'file' && <DownloadLink path={content.file_path} label="Unduh file" />}
            </div>
        </article>
    );
}

function VideoContent({ url }) {
    const embed = youtubeEmbed(url);

    if (!embed) {
        return (
            <a href={url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-700 hover:text-blue-900">
                Buka video
            </a>
        );
    }

    return <iframe title="Video pembelajaran" src={embed} className="aspect-video w-full rounded-lg border border-slate-200" allowFullScreen />;
}

function DownloadLink({ path, label }) {
    return (
        <a href={storageUrl(path)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
            <Download className="size-4" aria-hidden="true" />
            {label}
        </a>
    );
}

function storageUrl(path) {
    return path ? `/storage/${path}` : '#';
}

function youtubeEmbed(url) {
    if (!url) {
        return null;
    }

    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace('www.', '');

        if (host === 'youtu.be') {
            return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
        }

        if (host === 'youtube.com' && parsed.searchParams.get('v')) {
            return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}`;
        }
    } catch {
        return null;
    }

    return null;
}
