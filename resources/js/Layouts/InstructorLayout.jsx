import { BookOpen, GraduationCap, Home } from 'lucide-react';

import RoleLayoutShell from '@/Layouts/RoleLayoutShell';

const navItems = [
    { label: 'Dashboard', href: '/instructor/dashboard', icon: Home },
    { label: 'Kursus', href: '/instructor/courses', icon: BookOpen },
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
