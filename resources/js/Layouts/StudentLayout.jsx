import { Award, BookOpen, CalendarClock, GraduationCap, Home } from 'lucide-react';

import RoleLayoutShell from '@/Layouts/RoleLayoutShell';

const navItems = [
    { label: 'Dashboard', href: '/student/dashboard', icon: Home },
    { label: 'Kursus Saya', href: '/student/courses', icon: BookOpen },
    { label: 'Tugas', href: '/student/assignments', icon: CalendarClock },
    { label: 'Sertifikat', href: '/student/certificates', icon: Award },
];

export default function StudentLayout({ children, title = 'Mahasiswa' }) {
    return (
        <RoleLayoutShell
            title={title}
            navItems={navItems}
            brandIcon={GraduationCap}
            fallbackInitials="MH"
            storageKey="lms:student-sidebar-expanded"
        >
            {children}
        </RoleLayoutShell>
    );
}
