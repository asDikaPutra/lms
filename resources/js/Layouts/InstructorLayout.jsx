import { BookOpen, ClipboardCheck, ClipboardList, GraduationCap, Home } from 'lucide-react';

import RoleLayoutShell from '@/Layouts/RoleLayoutShell';

const navItems = [
    { label: 'Dashboard', href: '/instructor/dashboard', icon: Home },
    { label: 'Kursus', href: '/instructor/courses', icon: BookOpen },
    { label: 'Penilaian Quiz', href: '/instructor/quiz-attempts', icon: ClipboardCheck },
    { label: 'Penilaian Tugas', href: '/instructor/submissions', icon: ClipboardList },
];

export default function InstructorLayout({ children, title = 'Dosen' }) {
    return (
        <RoleLayoutShell
            title={title}
            navItems={navItems}
            brandIcon={GraduationCap}
            fallbackInitials="DS"
            storageKey="lms:instructor-sidebar-expanded"
        >
            {children}
        </RoleLayoutShell>
    );
}
