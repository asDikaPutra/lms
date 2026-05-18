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
    blue: 'bg-[#f4f7fa] text-[#0051c3]',
    emerald: 'bg-sb-light text-sb-green',
    teal: 'bg-[#eef8f6] text-[#007b6a]',
    orange: 'bg-[#fff6e5] text-[#b35200]',
    sky: 'bg-[#f0f8ff] text-[#006bd6]',
    violet: 'bg-[#f6f2fb] text-[#5e2b97]',
};

export default function Dashboard({ stats, recentUsers, recentCourses }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <section aria-labelledby="stats-title" className="tracking-[-0.01em]">
                <h2 id="stats-title" className="sr-only">
                    Statistik LMS
                </h2>
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {statConfig.map((item) => {
                        const Icon = item.icon;
                        return (
                            <article key={item.key} className="rounded-[10px] bg-white p-4 shadow-[0_0_0.5px_rgba(0,0,0,0.14),_0_1px_1px_rgba(0,0,0,0.24)] transition-all hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),_0_2px_2px_rgba(0,0,0,0.06),_0_0_2px_rgba(0,0,0,0.07)]">
                                <div className="flex items-center gap-3">
                                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-[8px] ${toneClasses[item.tone]}`}>
                                        <Icon className="size-5" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="text-[20px] font-semibold text-sb-text-black tracking-[-0.16px] leading-tight">{stats[item.key]}</p>
                                        <p className="text-[12px] text-sb-text-soft">{item.label}</p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_1fr] tracking-[-0.01em]">
                <section aria-labelledby="recent-users-title" className="rounded-[10px] bg-white p-4 shadow-[0_0_0.5px_rgba(0,0,0,0.14),_0_1px_1px_rgba(0,0,0,0.24)]">
                    <div className="flex items-center justify-between gap-4">
                        <h2 id="recent-users-title" className="text-[16px] font-semibold text-sb-text-black tracking-[-0.16px]">
                            User Terbaru
                        </h2>
                        <Link href="/admin/users" className="text-[13px] font-semibold text-sb-accent hover:text-sb-green transition-colors">
                            Kelola user
                        </Link>
                    </div>
                    <div className="mt-4 divide-y divide-[#edebe9]">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                                <div>
                                    <p className="text-[14px] font-semibold text-sb-text-black">{user.name}</p>
                                    <p className="text-[12px] text-sb-text-soft">{user.email}</p>
                                </div>
                                <span className="rounded-pill bg-[#f9f9f9] px-2 py-0.5 text-[11px] font-medium text-sb-text-black border border-[#edebe9]">
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="recent-courses-title" className="rounded-[10px] bg-white p-4 shadow-[0_0_0.5px_rgba(0,0,0,0.14),_0_1px_1px_rgba(0,0,0,0.24)]">
                    <h2 id="recent-courses-title" className="text-[16px] font-semibold text-sb-text-black tracking-[-0.16px]">
                        Kursus Terbaru
                    </h2>
                    <div className="mt-4 space-y-3">
                        {recentCourses.map((course) => (
                            <article key={course.id} className="rounded-[8px] border border-[#edebe9] bg-[#f9f9f9] p-3 transition-all hover:border-[#d6dbde] hover:bg-white">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-semibold text-sb-green tracking-[0.05em] uppercase">{course.code}</p>
                                        <h3 className="text-[14px] font-semibold text-sb-text-black leading-snug">{course.name}</h3>
                                        <p className="mt-0.5 text-[12px] text-sb-text-soft">{course.instructor?.name}</p>
                                    </div>
                                    <span className={`rounded-pill px-2 py-0.5 text-[11px] font-medium border ${course.is_active ? 'bg-sb-light border-sb-light text-sb-green' : 'bg-white border-[#edebe9] text-sb-text-soft'}`}>
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
