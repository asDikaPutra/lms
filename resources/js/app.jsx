import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from '@/contexts/ThemeContext';

createInertiaApp({
    title: (title) => (title ? `${title} - LMS Islam Fakultas` : 'LMS Islam Fakultas'),
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#0f766e',
    },
});
