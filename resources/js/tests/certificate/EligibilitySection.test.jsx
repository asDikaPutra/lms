import React from 'react';
import { render } from '@testing-library/react';
import { test as fcTest, fc } from '@fast-check/vitest';
import { describe, expect, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock @inertiajs/react: Head is a no-op, Link renders a plain <a> tag,
// usePage provides flash and auth, useForm provides a minimal form API
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
    useForm: () => ({
        post: vi.fn(),
        processing: false,
        data: {},
        setData: vi.fn(),
        errors: {},
        reset: vi.fn(),
    }),
    router: { post: vi.fn(), patch: vi.fn() },
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

// Mock AnimatedButton
vi.mock('@/components/animated/AnimatedButton', () => ({
    AnimatedButton: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

// Mock VideoPlayer
vi.mock('@/components/shared/VideoPlayer', () => ({
    default: ({ title }) => <div data-testid="video-player">{title}</div>,
}));

// Mock UI button
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

// Mock framer-motion to avoid animation issues in jsdom
vi.mock('framer-motion', () => {
    const tags = [
        'div', 'span', 'p', 'h1', 'h2', 'h3', 'section', 'article',
        'header', 'footer', 'main', 'nav', 'aside', 'ul', 'li', 'a', 'button',
        'form', 'input', 'label',
    ];
    const motionComponents = {};
    for (const tag of tags) {
        motionComponents[tag] = ({ children, className, style, ...rest }) => {
            const {
                initial, animate, exit, variants, transition,
                whileHover, whileTap, whileInView, viewport, layoutId,
                custom,
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

// Mock route() helper used by the component for certificate request
vi.stubGlobal('route', (name, params) => {
    if (name === 'student.certificates.request') {
        return `/student/courses/${params}/certificate`;
    }
    return `/${name}`;
});

import Show from '@/pages/Student/Courses/Show';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal course prop that causes the eligibility section to render.
 * The Show page requires course.modules to be an array (may be empty).
 */
function buildCourse({
    certificate_criteria,
    certificate_eligibility,
    has_certificate = false,
    certificate_id = null,
} = {}) {
    return {
        id: 1,
        name: 'Test Course',
        code: 'TC101',
        instructor: { id: 1, name: 'Instructor Name' },
        modules: [],
        certificate_criteria,
        certificate_eligibility,
        has_certificate,
        certificate_id,
    };
}

/**
 * Render the Show page with the given course and return the container.
 * The Show page also requires completedContentIds, attemptsByQuizId,
 * submissionsByAssignmentId, and progress props.
 */
function renderShowWithCourse(course) {
    return render(
        <Show
            course={course}
            completedContentIds={[]}
            attemptsByQuizId={{}}
            submissionsByAssignmentId={{}}
            progress={0}
        />
    );
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

// Integer in [0, 100]
const scoreArb = fc.integer({ min: 0, max: 100 });

// Nullable integer in [0, 100]
const nullableScoreArb = fc.option(scoreArb, { nil: null });

/**
 * Generate a pair of (certificate_criteria, certificate_eligibility) where
 * the criteria object contains at least one key and the eligibility values
 * are consistent with the criteria keys present.
 *
 * We use three independent booleans to decide which criteria keys to include,
 * ensuring at least one is always present.
 */
const eligibilityPairArb = fc
    .record({
        includeProgress: fc.boolean(),
        includeQuiz: fc.boolean(),
        includeAssignment: fc.boolean(),
        minProgress: scoreArb,
        minQuizScore: scoreArb,
        minAssignmentScore: scoreArb,
        currentProgress: scoreArb,
        currentQuizScore: nullableScoreArb,
        currentAssignmentScore: nullableScoreArb,
    })
    .map(
        ({
            includeProgress,
            includeQuiz,
            includeAssignment,
            minProgress,
            minQuizScore,
            minAssignmentScore,
            currentProgress,
            currentQuizScore,
            currentAssignmentScore,
        }) => {
            // Guarantee at least one criterion is included
            const hasNone = !includeProgress && !includeQuiz && !includeAssignment;
            const effectiveIncludeProgress = hasNone ? true : includeProgress;

            const certificate_criteria = {};
            if (effectiveIncludeProgress) certificate_criteria.min_progress = minProgress;
            if (includeQuiz) certificate_criteria.min_quiz_score = minQuizScore;
            if (includeAssignment) certificate_criteria.min_assignment_score = minAssignmentScore;

            const certificate_eligibility = {
                eligible: false, // eligibility badge is not the focus of this property
                current_progress: currentProgress,
                current_quiz_score: currentQuizScore,
                current_assignment_score: currentAssignmentScore,
            };

            return { certificate_criteria, certificate_eligibility };
        }
    );

// ---------------------------------------------------------------------------
// Property 4: Eligibility section renders correct values for any eligibility data
// Feature: certificate, Property 4: Eligibility section renders correct values for any eligibility data
// Validates: Requirements 4.1, 4.3
// ---------------------------------------------------------------------------

describe('Property 4: Eligibility section renders correct values for any eligibility data', () => {
    fcTest.prop([eligibilityPairArb], { numRuns: 100 })(
        'each current value and its required threshold are both present in the rendered output',
        ({ certificate_criteria, certificate_eligibility }) => {
            const course = buildCourse({ certificate_criteria, certificate_eligibility });
            const { container, unmount } = render(
                <Show
                    course={course}
                    completedContentIds={[]}
                    attemptsByQuizId={{}}
                    submissionsByAssignmentId={{}}
                    progress={0}
                />
            );

            const text = container.textContent ?? '';

            // --- Progress criterion ---
            if ('min_progress' in certificate_criteria) {
                // Current value is rendered as "{value}%"
                const currentProgressText = `${certificate_eligibility.current_progress}%`;
                expect(text).toContain(currentProgressText);

                // Required threshold is rendered as "≥ {min_progress}%"
                const thresholdText = `≥ ${certificate_criteria.min_progress}%`;
                expect(text).toContain(thresholdText);
            }

            // --- Quiz score criterion ---
            if ('min_quiz_score' in certificate_criteria) {
                if (certificate_eligibility.current_quiz_score !== null) {
                    // Current value is rendered as the raw numeric score
                    expect(text).toContain(String(certificate_eligibility.current_quiz_score));
                } else {
                    // Null score renders the fallback text
                    expect(text).toContain('Belum ada percobaan');
                }

                // Required threshold is rendered as "≥ {min_quiz_score}"
                const thresholdText = `≥ ${certificate_criteria.min_quiz_score}`;
                expect(text).toContain(thresholdText);
            }

            // --- Assignment score criterion ---
            if ('min_assignment_score' in certificate_criteria) {
                if (certificate_eligibility.current_assignment_score !== null) {
                    // Current value is rendered as the raw numeric score
                    expect(text).toContain(String(certificate_eligibility.current_assignment_score));
                } else {
                    // Null score renders the fallback text
                    expect(text).toContain('Belum ada pengumpulan');
                }

                // Required threshold is rendered as "≥ {min_assignment_score}"
                const thresholdText = `≥ ${certificate_criteria.min_assignment_score}`;
                expect(text).toContain(thresholdText);
            }

            unmount();
        }
    );
});

// ---------------------------------------------------------------------------
// Task 6.5 — Unit tests for eligibility section conditional rendering
// Requirements: 4.2, 4.4, 4.5, 4.6
// ---------------------------------------------------------------------------

import { screen } from '@testing-library/react';

describe('CertificateEligibilitySection — conditional rendering (task 6.5)', () => {

    // -----------------------------------------------------------------------
    // Test 1: when certificate_criteria is null, the eligibility section is
    // not rendered (Requirement 4.2)
    // -----------------------------------------------------------------------
    test('does not render eligibility section when certificate_criteria is null', () => {
        const course = buildCourse({
            certificate_criteria: null,
            certificate_eligibility: null,
        });
        renderShowWithCourse(course);

        // The section header "Sertifikat Kursus" should not appear
        expect(screen.queryByText('Sertifikat Kursus')).not.toBeInTheDocument();

        // Neither action button should appear
        expect(screen.queryByText('Lihat Sertifikat')).not.toBeInTheDocument();
        expect(screen.queryByText('Minta Sertifikat')).not.toBeInTheDocument();
    });

    // -----------------------------------------------------------------------
    // Test 2: when current_quiz_score is null, "Belum ada percobaan" is
    // displayed (Requirement 4.4)
    // -----------------------------------------------------------------------
    test('displays "Belum ada percobaan" when current_quiz_score is null', () => {
        const course = buildCourse({
            certificate_criteria: {
                min_progress: 80,
                min_quiz_score: 70,
            },
            certificate_eligibility: {
                eligible: false,
                current_progress: 90,
                current_quiz_score: null,
                current_assignment_score: null,
            },
        });
        renderShowWithCourse(course);

        expect(screen.getByText('Belum ada percobaan')).toBeInTheDocument();
    });

    // -----------------------------------------------------------------------
    // Test 3: when current_assignment_score is null, "Belum ada pengumpulan"
    // is displayed (Requirement 4.4)
    // -----------------------------------------------------------------------
    test('displays "Belum ada pengumpulan" when current_assignment_score is null', () => {
        const course = buildCourse({
            certificate_criteria: {
                min_progress: 80,
                min_assignment_score: 75,
            },
            certificate_eligibility: {
                eligible: false,
                current_progress: 90,
                current_quiz_score: null,
                current_assignment_score: null,
            },
        });
        renderShowWithCourse(course);

        expect(screen.getByText('Belum ada pengumpulan')).toBeInTheDocument();
    });

    // -----------------------------------------------------------------------
    // Test 4: when has_certificate === true, "Lihat Sertifikat" link is
    // present and points to the correct URL (Requirement 4.5)
    // -----------------------------------------------------------------------
    test('renders "Lihat Sertifikat" link when has_certificate is true', () => {
        const course = buildCourse({
            certificate_criteria: { min_progress: 80 },
            certificate_eligibility: {
                eligible: true,
                current_progress: 90,
                current_quiz_score: null,
                current_assignment_score: null,
            },
            has_certificate: true,
            certificate_id: 42,
        });
        renderShowWithCourse(course);

        const link = screen.getByText('Lihat Sertifikat');
        expect(link).toBeInTheDocument();

        // The link should navigate to the certificate detail page
        const anchor = link.closest('a');
        expect(anchor).not.toBeNull();
        expect(anchor.getAttribute('href')).toBe('/student/certificates/42');

        // "Minta Sertifikat" must NOT appear when has_certificate is true
        expect(screen.queryByText('Minta Sertifikat')).not.toBeInTheDocument();
    });

    // -----------------------------------------------------------------------
    // Test 5: when eligible === true && has_certificate === false,
    // "Minta Sertifikat" button is present (Requirement 4.6)
    // -----------------------------------------------------------------------
    test('renders "Minta Sertifikat" button when eligible is true and has_certificate is false', () => {
        const course = buildCourse({
            certificate_criteria: { min_progress: 80 },
            certificate_eligibility: {
                eligible: true,
                current_progress: 90,
                current_quiz_score: null,
                current_assignment_score: null,
            },
            has_certificate: false,
            certificate_id: null,
        });
        renderShowWithCourse(course);

        const button = screen.getByText('Minta Sertifikat');
        expect(button).toBeInTheDocument();

        // "Lihat Sertifikat" must NOT appear when has_certificate is false
        expect(screen.queryByText('Lihat Sertifikat')).not.toBeInTheDocument();
    });
});
