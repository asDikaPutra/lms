import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock, GraduationCap, Users } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';

const statConfig = [
    { key: 'total_users', label: 'Total User', icon: Users, tone: 'blue' },
    { key: 'total_instructors', label: 'Dosen', icon: GraduationCap, tone: 'emerald' },
    { key: 'total_students', label: 'Mahasiswa', icon: GraduationCap, tone: 'teal' },
    { key: 'active_courses', label: 'Kursus Aktif', icon: BookOpen, tone: 'orange' },
    { key: 'active_enrollments', label: 'Enroll Aktif', icon: Users, tone: 'sky' },
    { key: 'pending_enrollments', label: 'Pending Enroll', icon: Clock, tone: 'violet' },
];

const toneClasses = {
    blue: 'from-blue-400 via-blue-500 to-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.28)]',
    emerald: 'from-emerald-400 via-emerald-500 to-teal-600 shadow-[0_4px_12px_rgba(5,150,105,0.32)]',
    teal: 'from-teal-400 via-teal-500 to-cyan-600 shadow-[0_4px_12px_rgba(20,184,166,0.30)]',
    orange: 'from-orange-400 via-orange-500 to-amber-600 shadow-[0_4px_12px_rgba(249,115,22,0.28)]',
    sky: 'from-sky-400 via-sky-500 to-blue-500 shadow-[0_4px_12px_rgba(14,165,233,0.28)]',
    violet: 'from-violet-400 via-violet-500 to-purple-600 shadow-[0_4px_12px_rgba(139,92,246,0.28)]',
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
                            <StatCard
                                key={item.key}
                                label={item.label}
                                value={stats[item.key]}
                                icon={Icon}
                                color={item.tone}
                            />
                        );
                    })}
                </div>
            </section>

            <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_1fr] tracking-[-0.01em]">
                <Card>
                    <CardHeader className="flex-row items-center justify-between pb-3">
                        <CardTitle className="text-[16px]">User Terbaru</CardTitle>
                        <Link href="/admin/users" className="text-[13px] font-semibold text-mint hover:text-forest transition-colors">
                            Kelola user
                        </Link>
                    </CardHeader>
                    <CardContent>
                    <div className="divide-y divide-[ceramic]">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                                <div>
                                    <p className="text-[14px] font-semibold text-fg-primary">{user.name}</p>
                                    <p className="text-[12px] text-fg-secondary">{user.email}</p>
                                </div>
                                <span className="rounded-pill bg-[#f9f9f9] px-2 py-0.5 text-[11px] font-medium text-fg-primary border border-[ceramic]">
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-[16px]">Kursus Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-3">
                        {recentCourses.map((course) => (
                            <article key={course.id} className="rounded-[8px] border border-[ceramic] bg-[#f9f9f9] p-3 transition-all hover:border-[#d6dbde] hover:bg-white">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-semibold text-forest tracking-[0.05em] uppercase">{course.code}</p>
                                        <h3 className="text-[14px] font-semibold text-fg-primary leading-snug">{course.name}</h3>
                                        <p className="mt-0.5 text-[12px] text-fg-secondary">{course.instructor?.name}</p>
                                    </div>
                                    <span className={`rounded-pill px-2 py-0.5 text-[11px] font-medium border ${course.is_active ? 'bg-mint-light border-mint-light text-forest' : 'bg-white border-[ceramic] text-fg-secondary'}`}>
                                        {course.is_active ? 'Aktif' : 'Arsip'}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
