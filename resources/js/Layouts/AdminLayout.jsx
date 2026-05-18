import { BookOpen, Home, Users } from 'lucide-react';

import RoleLayoutShell from '@/Layouts/RoleLayoutShell';

const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { label: 'User', href: '/admin/users', icon: Users },
    { label: 'Kursus', href: '/admin/courses', icon: BookOpen },
];

export default function AdminLayout({ children, title = 'Admin' }) {
    return (
        <RoleLayoutShell
            title={title}
            navItems={navItems}
            brandIcon={BookOpen}
            fallbackInitials="AD"
            storageKey="lms:admin-sidebar-expanded"
        >
            {children}
        </RoleLayoutShell>
    );
}
