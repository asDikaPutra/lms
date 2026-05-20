import React from 'react';
import { render, screen } from '@testing-library/react';
import { test as fcTest, fc } from '@fast-check/vitest';
import { describe, it, expect, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock @inertiajs/react: Head is a no-op, Link renders a plain <a> tag
vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    Link: ({ href, children, className, onClick, title, 'aria-label': ariaLabel }) => (
        <a href={href} className={className} onClick={onClick} title={title} aria-label={ariaLabel}>
            {children}
        </a>
    ),
    usePage: () => ({
        props: {
            auth: { user: { name: 'Test User', email: 'test@example.com' } },
            flash: {},
        },
    }),
    router: { post: vi.fn() },
}));

// Mock StudentLayout to render children directly (avoids full layout complexity)
vi.mock('@/Layouts/StudentLayout', () => ({
    default: ({ children }) => <div data-testid="student-layout">{children}</div>,
}));

// Mock AnimatedPage / StaggerContainer to render children directly
vi.mock('@/components/animated/AnimatedPage', () => ({
    AnimatedPage: ({ children }) => <div>{children}</div>,
    StaggerContainer: ({ children, className }) => <div className={className}>{children}</div>,
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
        AnimatePresence: ({ children }) => children,
    };
});

import Index from '@/pages/Student/Certificates/Index';

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

// 12-char uppercase alphanumeric string matching the verify_code format
const verifyCodeArb = fc.stringMatching(/^[A-Z0-9]{12}$/);

// Generate ISO date strings using integer timestamps to avoid fc.date() edge cases
const MIN_TS = new Date('2020-01-01T00:00:00.000Z').getTime();
const MAX_TS = new Date('2030-12-31T23:59:59.999Z').getTime();
const issuedAtArb = fc
    .integer({ min: MIN_TS, max: MAX_TS })
    .map((ts) => new Date(ts).toISOString());

// Alphanumeric-only strings: no whitespace, so container.textContent.includes() works reliably
const alphanumArb = (minLen = 3, maxLen = 30) =>
    fc.stringMatching(new RegExp(`^[A-Za-z0-9]{${minLen},${maxLen}}$`));

const certificateArb = fc.record({
    id: fc.integer({ min: 1, max: 100_000 }),
    verify_code: verifyCodeArb,
    issued_at: issuedAtArb,
    course: fc.record({
        id: fc.integer({ min: 1 }),
        name: alphanumArb(3, 30),
        code: alphanumArb(2, 10),
    }),
});

// ---------------------------------------------------------------------------
// Property 1: Certificate card renders all required fields
// Feature: certificate, Property 1: Certificate card renders all required fields
// Validates: Requirements 1.2
// ---------------------------------------------------------------------------

describe('Property 1: Certificate card renders all required fields', () => {
    fcTest.prop([certificateArb], { numRuns: 100 })(
        'renders course name, course code, and verify code for any certificate',
        (certificate) => {
            const { container, unmount } = render(
                <Index certificates={[certificate]} />
            );

            // Use textContent for robust substring matching — avoids getByText
            // normalization issues with whitespace and multi-element text splits
            const text = container.textContent ?? '';

            // Course name must be present in the rendered output (Requirement 1.2)
            expect(text).toContain(certificate.course.name);

            // Course code must be present (rendered in the emerald pill badge)
            expect(text).toContain(certificate.course.code);

            // Verify code: the component truncates codes longer than 8 chars to first 8 + '...'
            // Since verify_code is always exactly 12 chars, it will always be truncated
            const expectedCodePrefix = certificate.verify_code.slice(0, 8);
            expect(text).toContain(expectedCodePrefix + '...');

            unmount();
        }
    );
});

// ---------------------------------------------------------------------------
// Property 2: Certificate list is ordered by issue date descending
// Feature: certificate, Property 2: Certificate list is ordered by issue date descending
// Validates: Requirements 1.1
// ---------------------------------------------------------------------------

describe('Property 2: Certificate list is ordered by issue date descending', () => {
    // Generate arrays of >=2 certificates with unique sequential IDs
    const certificateArrayArb = fc
        .array(certificateArb, { minLength: 2, maxLength: 10 })
        .map((certs) =>
            // Assign sequential IDs to guarantee uniqueness across the array
            certs.map((cert, idx) => ({ ...cert, id: idx + 1 }))
        );

    fcTest.prop([certificateArrayArb], { numRuns: 100 })(
        'rendered cards appear in descending issued_at order (most recent first)',
        (certificates) => {
            const { container, unmount } = render(<Index certificates={certificates} />);

            // Compute the expected sorted order (most recent first)
            const expectedOrder = [...certificates].sort(
                (a, b) => new Date(b.issued_at) - new Date(a.issued_at)
            );

            // Get all rendered article cards in DOM order
            const articles = Array.from(container.querySelectorAll('article'));
            expect(articles.length).toBe(certificates.length);

            // Each card contains a link to /student/certificates/{id}.
            // Extract the certificate ID from the href of the <a> inside each article,
            // then compare the order of IDs to the expected sorted order.
            const renderedIds = articles.map((article) => {
                const link = article.querySelector('a[href^="/student/certificates/"]');
                expect(link).not.toBeNull();
                const href = link.getAttribute('href');
                // href is "/student/certificates/{id}"
                const id = parseInt(href.split('/').pop(), 10);
                return id;
            });

            const expectedIds = expectedOrder.map((cert) => cert.id);
            expect(renderedIds).toEqual(expectedIds);

            unmount();
        }
    );
});

// ---------------------------------------------------------------------------
// Task 2.4: Unit tests for Index page edge cases
// Requirements: 1.3, 1.4
// ---------------------------------------------------------------------------

describe('Index page — edge cases (task 2.4)', () => {
    /**
     * Test: empty certificates array renders the empty state message.
     * Requirements: 1.3
     */
    it('renders empty state message "Belum ada sertifikat yang diperoleh." when certificates is empty', () => {
        render(<Index certificates={[]} />);
        expect(
            screen.getByText('Belum ada sertifikat yang diperoleh.')
        ).toBeInTheDocument();
    });

    /**
     * Test: clicking a certificate card navigates to /student/certificates/{id}.
     * Verifies the href attribute of the card link.
     * Requirements: 1.4
     */
    it('certificate card link has correct href to /student/certificates/{id}', () => {
        const certificate = {
            id: 42,
            verify_code: 'ABCD12345678',
            issued_at: '2025-06-01T00:00:00.000Z',
            course: {
                id: 1,
                name: 'Fiqih Muamalah',
                code: 'FQH101',
            },
        };

        render(<Index certificates={[certificate]} />);

        // The card is wrapped in a Link that renders as an <a> tag
        const link = screen.getByRole('link', { name: /Fiqih Muamalah/i });
        expect(link).toBeInTheDocument();
        expect(link.getAttribute('href')).toBe('/student/certificates/42');
    });
});
