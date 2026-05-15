import { Head, Link, router, useForm } from '@inertiajs/react';
import { Award, BookOpen, CheckCircle2, Clock, FileText, Search } from 'lucide-react';

import StudentLayout from '@/Layouts/StudentLayout';
import { Button } from '@/components/ui/button';

const statsConfig = [
    { key: 'active_courses', label: 'Kursus Aktif', icon: BookOpen, tone: 'bg-blue-50 text-blue-700' },
    { key: 'overall_progress', label: 'Progress', icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-700', suffix: '%' },
    { key: 'assignments_due', label: 'Tugas Mendatang', icon: FileText, tone: 'bg-amber-50 text-amber-700' },
    { key: 'certificates', label: 'Sertifikat', icon: Award, tone: 'bg-violet-50 text-violet-700' },
];

export default function Dashboard({ filters, stats, enrollments, upcomingAssignments }) {
    const enrollForm = useForm({ enroll_code: '' });
    const filterForm = useForm({ search: filters.search ?? '' });

    const joinCourse = (event) => {
        event.preventDefault();
        enrollForm.post('/student/enrollments', {
            preserveScroll: true,
            onSuccess: () => enrollForm.reset(),
        });
    };

    const search = (event) => {
        event.preventDefault();
        router.get('/student/dashboard', filterForm.data, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <StudentLayout title="Dashboard">
            <Head title="Dashboard Mahasiswa" />

            <section className="grid gap-6 lg:grid-cols-[1fr_24rem]">
                <div>
                    <p className="text-sm font-medium text-blue-700">Assalamu'alaikum</p>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950 md:text-4xl">Selamat belajar hari ini.</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                        Pantau kursus aktif, lanjutkan materi, dan masuk ke kelas baru dengan kode enroll dari dosen.
                    </p>
                </div>

                <form onSubmit={joinCourse} aria-labelledby="join-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 id="join-title" className="text-lg font-semibold text-slate-950">Join Kursus</h2>
                    <label htmlFor="enroll-code" className="mt-4 block text-sm font-medium text-slate-700">
                        Kode enroll
                    </label>
                    <input
                        id="enroll-code"
                        value={enrollForm.data.enroll_code}
                        onChange={(event) => enrollForm.setData('enroll_code', event.target.value)}
                        className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm uppercase outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15"
                        aria-describedby={enrollForm.errors.enroll_code ? 'enroll-code-error' : undefined}
                    />
                    {enrollForm.errors.enroll_code && (
                        <p id="enroll-code-error" role="alert" className="mt-2 text-sm text-rose-600">
                            {enrollForm.errors.enroll_code}
                        </p>
                    )}
                    <Button type="submit" className="mt-4 w-full bg-blue-700 text-white hover:bg-blue-800" disabled={enrollForm.processing}>
                        {enrollForm.processing ? 'Mengirim...' : 'Gabung'}
                    </Button>
                </form>
            </section>

            <section aria-labelledby="stats-title" className="mt-6">
                <h2 id="stats-title" className="sr-only">Statistik mahasiswa</h2>
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
                                        <p className="text-3xl font-semibold text-slate-950">{stats[item.key]}{item.suffix ?? ''}</p>
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
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 id="courses-title" className="text-lg font-semibold text-slate-950">Kursus Saya</h2>
                            <p className="mt-1 text-sm text-slate-500">Status aktif, pending, dan rejected terlihat di sini.</p>
                        </div>
                        <form onSubmit={search} className="relative" aria-label="Cari kursus dan materi">
                            <label htmlFor="student-search" className="sr-only">Cari kursus atau materi</label>
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                            <input
                                id="student-search"
                                value={filterForm.data.search}
                                onChange={(event) => filterForm.setData('search', event.target.value)}
                                placeholder="Cari kursus/materi"
                                className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 md:w-64"
                            />
                        </form>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {enrollments.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">Belum ada kursus.</p>}
                        {enrollments.map((enrollment) => (
                            <article key={enrollment.id} className="rounded-xl border border-slate-100 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-blue-700">{enrollment.course.code}</p>
                                        <h3 className="mt-1 font-semibold text-slate-950">{enrollment.course.name}</h3>
                                        <p className="mt-1 text-sm text-slate-500">{enrollment.course.instructor?.name ?? 'Dosen belum tersedia'}</p>
                                    </div>
                                    <StatusBadge status={enrollment.status} />
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>Progress</span>
                                        <span>{enrollment.course.progress}%</span>
                                    </div>
                                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                                        <div className="h-2 rounded-full bg-blue-600" style={{ width: `${enrollment.course.progress}%` }} />
                                    </div>
                                </div>
                                {enrollment.status === 'active' && (
                                    <Link href={`/student/courses/${enrollment.course.id}`} className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900">
                                        Lanjut belajar
                                    </Link>
                                )}
                            </article>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="assignment-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 id="assignment-title" className="text-lg font-semibold text-slate-950">Tugas Mendatang</h2>
                    <div className="mt-4 space-y-3">
                        {upcomingAssignments.length === 0 && <p className="text-sm text-slate-500">Belum ada tugas mendatang.</p>}
                        {upcomingAssignments.map((assignment) => (
                            <article key={assignment.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                    <Clock className="size-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-950">{assignment.title}</p>
                                    <p className="mt-1 text-sm text-slate-500">{assignment.deadline}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </StudentLayout>
    );
}

function StatusBadge({ status }) {
    const classes = {
        active: 'bg-emerald-50 text-emerald-700',
        pending: 'bg-amber-50 text-amber-700',
        rejected: 'bg-rose-50 text-rose-700',
    };

    const labels = {
        active: 'Aktif',
        pending: 'Pending',
        rejected: 'Ditolak',
    };

    return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes[status] ?? 'bg-slate-100 text-slate-600'}`}>{labels[status] ?? status}</span>;
}
