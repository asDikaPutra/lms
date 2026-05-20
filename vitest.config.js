import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./resources/js/tests/setup.ts'],
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['resources/js/**/*.{js,jsx,ts,tsx}'],
            exclude: ['resources/js/tests/**', 'resources/js/bootstrap.js'],
        },
    },
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
