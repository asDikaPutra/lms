import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test as fcTest, fc } from '@fast-check/vitest';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock @inertiajs/react: Head is a no-op, Link renders a plain <a> tag
vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    Link: ({ href, children, className, onClick }) => (
        <a href={href} className={className} onClick={onClick}>
            {children}
        </a>
    ),
    usePage: () => ({
        props: {
            auth: { user: { name: 'Test User', email: 'test@example.com' } },
            flash: {},
        },
    }),
}));

// Mock StudentLayout to render children directly
vi.mock('@/Layouts/StudentLayout', () => ({
    default: ({ children }) => <div data-testid="student-layout">{children}</div>,
}));

// Mock AnimatedPage / FadeInWhenVisible to render children directly
vi.mock('@/components/animated/AnimatedPage', () => ({
    AnimatedPage: ({ children }) => <div>{children}</div>,
    FadeInWhenVisible: ({ children }) => <div>{children}</div>,
}));

// Mock framer-motion to avoid animation issues in jsdom
vi.mock('framer-motion', () => {
    const tags = [
        'div', 'span', 'p', 'h1', 'h2', 'h3', 'section', 'article',
        'header', 'footer', 'main', 'nav', 'aside', 'ul', 'li', 'a', 'button',
    ];
    const motionComponents = {};
    for (const tag of tags) {
        motionComponents[tag] = ({ children, className, style, ...rest }) => {
            const {
                initial, animate, exit, variants, transition,
                whileHover, whileTap, whileInView, viewport,
                ...domProps
            } = rest;
            return React.createElement(tag, { className, style, ...domProps }, children);
        };
        motionComponents[tag].displayName = `motion.${tag}`;
    }
    return {
        motion: motionComponents,
        AnimatePresence: ({ children }) => <>{children}</>,
    };
});

import Show from '@/pages/Student/Certificates/Show';

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

// 12-char uppercase alphanumeric string matching the verify_code format
const verifyCodeArb = fc.stringMatching(/^[A-Z0-9]{12}$/);

// Alphanumeric-only strings: no whitespace, so container.textContent.includes() works reliably
const alphanumArb = (minLen = 1, maxLen = 40) =>
    fc.stringMatching(new RegExp(`^[A-Za-z0-9]{${minLen},${maxLen}}$`));

// Numeric-only strings for NIM
const nimArb = fc.stringMatching(/^[0-9]{6,12}$/);

// ISO date strings
const issuedAtArb = fc
    .integer({
        min: new Date('2020-01-01T00:00:00.000Z').getTime(),
        max: new Date('2030-12-31T23:59:59.999Z').getTime(),
    })
    .map((ts) => new Date(ts).toISOString());

// Full certificate object for Show page
const certificateArb = fc.record({
    id: fc.integer({ min: 1 }),
    verify_code: verifyCodeArb,
    issued_at: issuedAtArb,
    criteria: fc.constant(null),
    user: fc.record({
        id: fc.integer({ min: 1 }),
        name: alphanumArb(2, 40),
        nim: nimArb,
    }),
    course: fc.record({
        id: fc.integer({ min: 1 }),
        name: alphanumArb(2, 40),
        code: alphanumArb(2, 10),
        instructor: fc.record({
            id: fc.integer({ min: 1 }),
            name: alphanumArb(2, 40),
        }),
    }),
});

// ---------------------------------------------------------------------------
// Property 3: Certificate detail renders all required fields
// Feature: certificate, Property 3: Certificate detail renders all required fields
// Validates: Requirements 2.1, 2.3
// ---------------------------------------------------------------------------

describe('Property 3: Certificate detail renders all required fields', () => {
    fcTest.prop([certificateArb], { numRuns: 100 })(
        'renders student name, NIM, course name, code, instructor name, and verify code for any certificate',
        (certificate) => {
            const { container, unmount } = render(<Show certificate={certificate} />);
            const text = container.textContent ?? '';

            // Student name must be present (focal point of the certificate)
            expect(text).toContain(certificate.user.name);

            // NIM must be present
            expect(text).toContain(certificate.user.nim);

            // Course name must be present
            expect(text).toContain(certificate.course.name);

            // Course code must be present
            expect(text).toContain(certificate.course.code);

            // Instructor name must be present
            expect(text).toContain(certificate.course.instructor.name);

            // Verify code must be present
            expect(text).toContain(certificate.verify_code);

            unmount();
        }
    );
});

// ---------------------------------------------------------------------------
// Property 7: Shareable URL contains the verify_code
// Feature: certificate, Property 7: Shareable URL contains the verify_code
// Validates: Requirements 6.5
// ---------------------------------------------------------------------------

describe('Property 7: Shareable URL contains the verify_code', () => {
    fcTest.prop([verifyCodeArb], { numRuns: 100 })(
        'the shareable URL input value contains the exact verify_code',
        (verifyCode) => {
            const certificate = {
                id: 1,
                verify_code: verifyCode,
                issued_at: '2025-01-15T00:00:00.000Z',
                criteria: null,
                user: { id: 1, name: 'TestUser', nim: '2021001001' },
                course: {
                    id: 1,
                    name: 'TestCourse',
                    code: 'TC101',
                    instructor: { id: 1, name: 'InstructorName' },
                },
            };

            const { container, unmount } = render(<Show certificate={certificate} />);

            // The shareable URL input should contain the verify_code as a query param
            const urlInput = container.querySelector('input[aria-label="URL verifikasi sertifikat"]');
            expect(urlInput).not.toBeNull();
            expect(urlInput.value).toContain(verifyCode);

            unmount();
        }
    );
});

// ---------------------------------------------------------------------------
// Test fixture
// ---------------------------------------------------------------------------

const baseCertificate = {
    id: 1,
    verify_code: 'ABCD12345678',
    issued_at: '2025-01-15T00:00:00.000Z',
    criteria: {
        min_progress: 80,
        min_quiz_score: 70,
        min_assignment_score: 75,
    },
    user: {
        id: 1,
        name: 'Budi Santoso',
        nim: '2021001001',
    },
    course: {
        id: 1,
        name: 'Fiqih Muamalah',
        code: 'FQH101',
        instructor: {
            id: 1,
            name: 'Ustadz Ahmad',
        },
    },
};

// ---------------------------------------------------------------------------
// Task 3.5: Unit tests for copy-to-clipboard behavior
// Requirements: 6.2, 6.3, 6.4
// ---------------------------------------------------------------------------

describe('VerifyCodeCopyWidget — copy-to-clipboard behavior', () => {
    let writeTextSpy;

    beforeEach(() => {
        // Ensure navigator.clipboard exists in jsdom (it may not by default)
        if (!navigator.clipboard) {
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: () => Promise.resolve() },
                writable: true,
                configurable: true,
            });
        }
        // Spy on the existing clipboard.writeText so we can control its return value
        writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    /**
     * Test: clicking the copy button calls navigator.clipboard.writeText
     * with the correct verify code.
     * Requirements: 6.2
     */
    it('calls navigator.clipboard.writeText with the correct verify code when copy button is clicked', async () => {
        writeTextSpy.mockResolvedValue(undefined);

        render(<Show certificate={baseCertificate} />);

        // Use the dedicated copy icon button (exact label, not the code display button)
        const copyButton = screen.getByRole('button', { name: 'Salin kode verifikasi' });
        fireEvent.click(copyButton);

        // Wait for the async clipboard call to complete
        await waitFor(() => {
            expect(writeTextSpy).toHaveBeenCalledWith(baseCertificate.verify_code);
        });
    });

    /**
     * Test: success feedback message "Kode berhasil disalin!" appears after copying
     * and auto-dismisses after 3 seconds.
     * Requirements: 6.3
     */
    it('shows success feedback "Kode berhasil disalin!" and auto-dismisses after 3 seconds', async () => {
        writeTextSpy.mockResolvedValue(undefined);

        vi.useFakeTimers();

        render(<Show certificate={baseCertificate} />);

        // Use the dedicated copy icon button (exact label, not the code display button)
        const copyButton = screen.getByRole('button', { name: 'Salin kode verifikasi' });

        // Click and flush the microtask queue so the async handleCopy resolves
        await act(async () => {
            fireEvent.click(copyButton);
        });

        // Success message should be visible immediately after clicking
        expect(screen.getByText('Kode berhasil disalin!')).toBeInTheDocument();

        // Advance time by 3 seconds — the auto-dismiss timeout should fire
        await act(async () => {
            vi.advanceTimersByTime(3000);
        });

        // Success message should be gone after 3 seconds
        expect(screen.queryByText('Kode berhasil disalin!')).not.toBeInTheDocument();
    });

    /**
     * Test: when navigator.clipboard.writeText rejects, the error message
     * "Gagal menyalin kode." is shown.
     * Requirements: 6.4
     */
    it('shows error message "Gagal menyalin kode." when clipboard.writeText rejects', async () => {
        writeTextSpy.mockRejectedValue(new Error('Permission denied'));

        render(<Show certificate={baseCertificate} />);

        // Use the dedicated copy icon button (exact label, not the code display button)
        const copyButton = screen.getByRole('button', { name: 'Salin kode verifikasi' });

        await act(async () => {
            fireEvent.click(copyButton);
        });

        expect(screen.getByText('Gagal menyalin kode.')).toBeInTheDocument();
    });
});
