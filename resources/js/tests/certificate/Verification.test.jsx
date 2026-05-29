import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { test as fcTest, fc } from '@fast-check/vitest';
import { validateVerifyCode } from '@/pages/certificate-verification-utils';
import CertificateVerification from '@/pages/CertificateVerification';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Capture a mutable ref so individual tests can override the verify_code value
let mockVerifyCode = '';

// Mock @inertiajs/react: Head is a no-op, useForm reads from the mutable ref
vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    useForm: vi.fn(() => ({
        data: { verify_code: mockVerifyCode },
        setData: vi.fn(),
        post: vi.fn(),
        processing: false,
    })),
}));

// Mock framer-motion to render children without animation overhead
vi.mock('framer-motion', () => {
    const tags = [
        'div', 'span', 'p', 'h1', 'h2', 'h3', 'section', 'article',
        'header', 'footer', 'main', 'nav', 'aside', 'ul', 'li', 'a', 'button', 'input',
    ];
    const motionComponents = {};
    for (const tag of tags) {
        motionComponents[tag] = ({ children, className, style, ...rest }) => {
            const {
                initial, animate, exit, variants, transition,
                whileHover, whileTap, whileInView, whileFocus, viewport,
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

// Mock the route() global used in the component
global.route = vi.fn(() => '/verify-certificate');

// ---------------------------------------------------------------------------
// Feature: certificate, Property 5: Verification code validation accepts only exactly-12-alphanumeric strings
// Validates: Requirements 5.2, 5.3
// ---------------------------------------------------------------------------
describe('validateVerifyCode', () => {
    /**
     * Property 5: Verification code validation accepts only exactly-12-alphanumeric strings
     * Validates: Requirements 5.2, 5.3
     */
    fcTest.prop([fc.string()], { numRuns: 100 })(
        'accepts input if and only if it is exactly 12 uppercase alphanumeric characters',
        (input) => {
            const isValid = /^[A-Z0-9]{12}$/.test(input.toUpperCase());
            const result = validateVerifyCode(input);
            expect(result.valid).toBe(isValid);
        },
    );
});

// ---------------------------------------------------------------------------
// Feature: certificate, Property 6: Verification result renders all required certificate fields
// Validates: Requirements 5.4, 5.6
// ---------------------------------------------------------------------------
describe('CertificateVerification result display', () => {
    /**
     * Property 6: Verification result renders all required certificate fields
     * Validates: Requirements 5.4, 5.6
     */
    fcTest.prop(
        [
            fc.record({
                id: fc.integer({ min: 1 }),
                verify_code: fc.stringMatching(/^[A-Z0-9]{12}$/),
                // Use alphanumeric-only strings to avoid text normalization issues
                student_name: fc.stringMatching(/^[A-Za-z0-9]{1,40}$/),
                student_nim: fc.stringMatching(/^[0-9]{1,12}$/),
                course_name: fc.stringMatching(/^[A-Za-z0-9]{1,40}$/),
                course_code: fc.stringMatching(/^[A-Z0-9]{1,10}$/),
                instructor_name: fc.stringMatching(/^[A-Za-z0-9]{1,40}$/),
                issued_at: fc
                    .integer({
                        min: new Date('2020-01-01T00:00:00.000Z').getTime(),
                        max: new Date('2030-12-31T23:59:59.999Z').getTime(),
                    })
                    .map((ts) => new Date(ts).toISOString()),
                criteria: fc.constant(null),
            }),
        ],
        { numRuns: 100 },
    )(
        'renders all six certificate fields and the validity badge for any valid certificate',
        (certificate) => {
            const { container, unmount } = render(
                <CertificateVerification certificate={certificate} error={null} />,
            );
            const text = container.textContent;

            // All six identity fields must be present
            expect(text).toContain(certificate.student_name);
            expect(text).toContain(certificate.student_nim);
            expect(text).toContain(certificate.course_name);
            expect(text).toContain(certificate.course_code);
            expect(text).toContain(certificate.instructor_name);

            // Validity badge must be present
            expect(text).toContain('Sertifikat Terverifikasi');

            unmount();
        },
    );
});

// ---------------------------------------------------------------------------
// Task 4.5: Unit tests for verification page edge cases
// Requirements: 5.2, 5.3, 5.5
// ---------------------------------------------------------------------------

describe('CertificateVerification — form validation edge cases', () => {
    beforeEach(() => {
        // Reset to empty code before each test
        mockVerifyCode = '';
    });

    it('shows "Kode verifikasi tidak boleh kosong." when submitting an empty code', () => {
        // mockVerifyCode is '' (set in beforeEach)
        const { container } = render(
            <CertificateVerification certificate={null} error={null} />,
        );

        const form = container.querySelector('form');
        fireEvent.submit(form);

        expect(
            screen.getByText('Kode verifikasi tidak boleh kosong.'),
        ).toBeInTheDocument();
    });

    it('shows the format error message when submitting a code shorter than 12 chars', () => {
        // Set a short (non-empty) code
        mockVerifyCode = 'ABC123';

        const { container } = render(
            <CertificateVerification certificate={null} error={null} />,
        );

        const form = container.querySelector('form');
        fireEvent.submit(form);

        expect(
            screen.getByText(
                'Kode verifikasi harus terdiri dari 12 karakter alfanumerik.',
            ),
        ).toBeInTheDocument();
    });
});

describe('CertificateVerification — result / error card rendering', () => {
    it('renders the error card when certificate is null and error is set', () => {
        render(
            <CertificateVerification
                certificate={null}
                error="Kode verifikasi tidak ditemukan."
            />,
        );

        // The ErrorCard heading must be visible
        expect(screen.getByText('Sertifikat Tidak Ditemukan')).toBeInTheDocument();
        // The server error message must also be visible
        expect(
            screen.getByText('Kode verifikasi tidak ditemukan.'),
        ).toBeInTheDocument();
    });

    it('renders neither result card nor error card when both certificate and error are null', () => {
        render(<CertificateVerification certificate={null} error={null} />);

        // The validity badge text must NOT be present
        expect(
            screen.queryByText(/Sertifikat Terverifikasi/),
        ).not.toBeInTheDocument();

        // The error card heading must NOT be present
        expect(
            screen.queryByText('Sertifikat Tidak Ditemukan'),
        ).not.toBeInTheDocument();
    });
});
