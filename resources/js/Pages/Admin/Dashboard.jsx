import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock, GraduationCap, Users } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';

const statConfig = [
    { key: 'total_users', label: 'Total User', icon: Users, tone: 'blue' },
    { key: 'total_instructors', label: 'Dosen', icon: GraduationCap, tone: 'emerald' },
    { key: 'total_students', label: 'Mahasiswa', icon: GraduationCap, tone: 'teal' },
    { key: 'active_courses', label: 'Kursus Aktif', icon: BookOpen, tone: 'orange' },
    { key: 'active_enrollments', label: 'Enroll Aktif', icon: Users, tone: 'sky' },
    { key: 'pending_enrollments', label: 'Pending Enroll', icon: Clock, tone: 'violet' },
];

const toneClasses = {
    blue: 'border-blue-100 bg-blue-50 text-blue-600',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-600',
    teal: 'border-teal-100 bg-teal-50 text-teal-600',
    orange: 'border-orange-100 bg-orange-50 text-orange-600',
    sky: 'border-sky-100 bg-sky-50 text-sky-600',
    violet: 'border-violet-100 bg-violet-50 text-violet-600',
};

export default function Dashboard({ stats, recentUsers, recentCourses }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <section aria-labelledby="stats-title">
                <h2 id="stats-title" className="sr-only">
                    Statistik LMS
                </h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {statConfig.map((item) => {
                        const Icon = item.icon;
                        return (
                            <article key={item.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`flex size-14 items-center justify-center rounded-2xl border ${toneClasses[item.tone]}`}>
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
                <section aria-labelledby="recent-users-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <h2 id="recent-users-title" className="text-lg font-semibold text-slate-950">
                            User Terbaru
                        </h2>
                        <Link href="/admin/users" className="text-sm font-semibold text-blue-700 hover:text-blue-900">
                            Kelola user
                        </Link>
                    </div>
                    <div className="mt-4 divide-y divide-slate-100">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between gap-4 py-3">
                                <div>
                                    <p className="font-medium text-slate-950">{user.name}</p>
                                    <p className="text-sm text-slate-500">{user.email}</p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="recent-courses-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 id="recent-courses-title" className="text-lg font-semibold text-slate-950">
                        Kursus Terbaru
                    </h2>
                    <div className="mt-4 space-y-3">
                        {recentCourses.map((course) => (
                            <article key={course.id} className="rounded-xl border border-slate-100 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-blue-700">{course.code}</p>
                                        <h3 className="mt-1 font-semibold text-slate-950">{course.name}</h3>
                                        <p className="mt-1 text-sm text-slate-500">{course.instructor?.name}</p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${course.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {course.is_active ? 'Aktif' : 'Arsip'}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
