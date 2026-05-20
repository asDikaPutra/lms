import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, CheckCircle2, User, Calendar, Award, Copy, Check, ExternalLink, Download } from 'lucide-react';
import { motion } from 'framer-motion';

import StudentLayout from '@/Layouts/StudentLayout';
import { AnimatedPage, FadeInWhenVisible } from '@/components/animated/AnimatedPage';

/**
 * Format an ISO date string to Indonesian locale date.
 * e.g. "2025-01-15T00:00:00Z" → "15 Januari 2025"
 */
function formatIndonesianDate(isoString) {
    return new Date(isoString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function Show({ certificate }) {
    return (
        <StudentLayout title="Detail Sertifikat">
            <Head title="Detail Sertifikat" />

            <AnimatedPage>
                {/* Back button + Download button */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6 flex items-center justify-between"
                >
                    <Link
                        href="/student/certificates"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-emerald-700 transition-colors group"
                    >
                        <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                        Kembali ke Sertifikat
                    </Link>

                    <a
                        href={`/student/certificates/${certificate.id}/download`}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0B3D2E] to-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition-opacity hover:opacity-90"
                    >
                        <Download className="size-4" />
                        Unduh PDF
                    </a>
                </motion.div>

                {/* Certificate Document Card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mx-auto max-w-2xl"
                >
                    <CertificateDocument certificate={certificate} />
                </motion.div>

                {/* Criteria Met List */}
                {certificate.criteria && (
                    <FadeInWhenVisible>
                        <div className="mx-auto max-w-2xl mt-6">
                            <CriteriaMetList criteria={certificate.criteria} />
                        </div>
                    </FadeInWhenVisible>
                )}

                {/* Verify Code Copy Widget */}
                <FadeInWhenVisible>
                    <div className="mx-auto max-w-2xl mt-6">
                        <VerifyCodeCopyWidget verifyCode={certificate.verify_code} />
                    </div>
                </FadeInWhenVisible>
            </AnimatedPage>
        </StudentLayout>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CertificateDocument                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

function CertificateDocument({ certificate }) {
    const formattedDate = formatIndonesianDate(certificate.issued_at);

    return (
        <article
            className="overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(11,61,46,0.25)] border border-white/40"
            aria-label="Dokumen Sertifikat"
        >
            {/* ── Forest Green header ── */}
            <div className="relative bg-[#0B3D2E] overflow-hidden px-8 pt-10 pb-12">
                {/* Islamic geometric pattern overlay at 6% opacity */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l20 20-20 20-20-20L40 0zm0 40l20 20-20 20-20-20 20-20zm20-20l20 20-20 20-20-20 20-20zM0 20l20 20-20 20L0 40V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                    aria-hidden="true"
                />

                {/* Subtle radial glow */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: 'radial-gradient(ellipse at 60% 50%, #5DCAA5 0%, transparent 70%)',
                    }}
                    aria-hidden="true"
                />

                {/* Achievement seal — positioned top-right */}
                <div className="absolute top-6 right-8" aria-hidden="true">
                    <AchievementSeal />
                </div>

                {/* Header text content */}
                <div className="relative space-y-3">
                    {/* "Sertifikat Penyelesaian" label */}
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5DCAA5]">
                        Sertifikat Penyelesaian
                    </p>

                    {/* "Diberikan kepada" */}
                    <p className="text-sm text-white/60 font-medium">Diberikan kepada</p>

                    {/* Student name — largest text, focal point */}
                    <h1 className="font-heading text-[28px] leading-tight text-white">
                        {certificate.user.name}
                    </h1>

                    {/* NIM */}
                    <p className="text-sm text-white/70 font-medium tracking-wide">
                        NIM: {certificate.user.nim}
                    </p>
                </div>
            </div>

            {/* ── Card body ── */}
            <div className="bg-white/95 backdrop-blur-sm px-8 py-7 space-y-5">
                {/* "atas keberhasilan menyelesaikan" */}
                <p className="text-sm text-neutral-500 font-medium">
                    atas keberhasilan menyelesaikan kursus
                </p>

                {/* Course name */}
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-neutral-900 leading-snug">
                        {certificate.course.name}
                    </h2>
                    {/* Course code badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200/60">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.1em] font-mono">
                            {certificate.course.code}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

                {/* Meta info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Instructor */}
                    <div className="flex items-start gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200/60">
                            <User className="size-4 text-emerald-700" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                Instruktur
                            </p>
                            <p className="text-sm font-semibold text-neutral-800 leading-snug mt-0.5">
                                {certificate.course.instructor.name}
                            </p>
                        </div>
                    </div>

                    {/* Issue date */}
                    <div className="flex items-start gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200/60">
                            <Calendar className="size-4 text-emerald-700" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                Tanggal Terbit
                            </p>
                            <p className="text-sm font-semibold text-neutral-800 leading-snug mt-0.5">
                                {formattedDate}
                            </p>
                        </div>
                    </div>

                    {/* Verify code */}
                    <div className="flex items-start gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200/60">
                            <Award className="size-4 text-emerald-700" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                Kode Verifikasi
                            </p>
                            <p className="font-mono text-sm font-semibold text-neutral-800 tracking-wider mt-0.5">
                                {certificate.verify_code}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom accent bar */}
                <div className="h-1 rounded-full bg-gradient-to-r from-[#0B3D2E] via-[#5DCAA5] to-[#0B3D2E]" />
            </div>
        </article>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  AchievementSeal — inline SVG in Mint Accent #5DCAA5                       */
/* ─────────────────────────────────────────────────────────────────────────── */

function AchievementSeal() {
    return (
        <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
            <svg
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Achievement seal"
            >
                {/* Outer ribbon ring */}
                <circle cx="36" cy="36" r="32" stroke="#5DCAA5" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
                {/* Inner filled circle */}
                <circle cx="36" cy="36" r="26" fill="#5DCAA5" fillOpacity="0.15" stroke="#5DCAA5" strokeWidth="1.5" />
                {/* 8-point star */}
                <path
                    d="M36 14 L39.5 26 L51 22 L43 32 L55 36 L43 40 L51 50 L39.5 46 L36 58 L32.5 46 L21 50 L29 40 L17 36 L29 32 L21 22 L32.5 26 Z"
                    fill="#5DCAA5"
                    opacity="0.9"
                />
                {/* Center circle */}
                <circle cx="36" cy="36" r="6" fill="white" fillOpacity="0.9" />
                {/* Center check mark */}
                <path
                    d="M32.5 36 L35 38.5 L39.5 33.5"
                    stroke="#0B3D2E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CriteriaMetList                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */

const CRITERIA_CONFIG = [
    {
        key: 'min_progress',
        label: 'Progress Materi',
        unit: '%',
        description: 'Persentase materi yang telah diselesaikan',
    },
    {
        key: 'min_quiz_score',
        label: 'Nilai Kuis',
        unit: '',
        description: 'Rata-rata nilai kuis',
    },
    {
        key: 'min_assignment_score',
        label: 'Nilai Tugas',
        unit: '',
        description: 'Rata-rata nilai tugas',
    },
];

function CriteriaMetList({ criteria }) {
    // Only show criteria that were actually configured (non-null/undefined)
    const activeCriteria = CRITERIA_CONFIG.filter(
        (c) => criteria[c.key] !== undefined && criteria[c.key] !== null
    );

    if (activeCriteria.length === 0) return null;

    return (
        <section
            className="rounded-2xl bg-white/90 backdrop-blur-sm border border-neutral-200/60 shadow-lg overflow-hidden"
            aria-label="Kriteria yang Dipenuhi"
        >
            {/* Section header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#0B3D2E]/10 border border-[#0B3D2E]/20">
                    <CheckCircle2 className="size-4 text-[#0B3D2E]" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-neutral-900">Kriteria yang Dipenuhi</h3>
                    <p className="text-[11px] text-neutral-500">Semua kriteria berikut telah terpenuhi</p>
                </div>
            </div>

            {/* Criteria rows */}
            <div className="divide-y divide-neutral-100">
                {activeCriteria.map((config, index) => (
                    <CriterionRow
                        key={config.key}
                        config={config}
                        threshold={criteria[config.key]}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
}

function CriterionRow({ config, threshold, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
            className="flex items-center gap-4 px-6 py-4"
        >
            {/* Mint accent bar */}
            <div className="w-1 h-10 rounded-full bg-[#5DCAA5] shrink-0" aria-hidden="true" />

            {/* Label + description */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">{config.label}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">{config.description}</p>
            </div>

            {/* Threshold badge */}
            <div className="shrink-0 flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-700">
                    ≥ {threshold}{config.unit}
                </span>

                {/* Checkmark icon */}
                <div className="flex size-6 items-center justify-center rounded-full bg-[#5DCAA5]/15 border border-[#5DCAA5]/40">
                    <CheckCircle2 className="size-3.5 text-[#5DCAA5]" />
                </div>
            </div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  VerifyCodeCopyWidget                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Displays the verify code with click-to-copy functionality and a shareable URL.
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */
function VerifyCodeCopyWidget({ verifyCode }) {
    // null = idle, 'success' = copied, 'error' = failed
    const [copyStatus, setCopyStatus] = useState(null);

    // Auto-dismiss feedback after 3 seconds
    useEffect(() => {
        if (copyStatus === null) return;

        const timer = setTimeout(() => {
            setCopyStatus(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [copyStatus]);

    const shareableUrl =
        typeof window !== 'undefined'
            ? window.location.origin + '/verify-certificate?code=' + verifyCode
            : '/verify-certificate?code=' + verifyCode;

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(verifyCode);
            setCopyStatus('success');
        } catch {
            setCopyStatus('error');
        }
    }

    async function handleCopyUrl() {
        try {
            await navigator.clipboard.writeText(shareableUrl);
            setCopyStatus('success');
        } catch {
            setCopyStatus('error');
        }
    }

    const feedbackMessage =
        copyStatus === 'success'
            ? 'Kode berhasil disalin!'
            : copyStatus === 'error'
            ? 'Gagal menyalin kode.'
            : null;

    return (
        <section
            className="rounded-2xl bg-white/90 backdrop-blur-sm border border-neutral-200/60 shadow-lg overflow-hidden"
            aria-label="Kode Verifikasi"
        >
            {/* Section header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#0B3D2E]/10 border border-[#0B3D2E]/20">
                    <Award className="size-4 text-[#0B3D2E]" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-neutral-900">Kode Verifikasi</h3>
                    <p className="text-[11px] text-neutral-500">Klik kode untuk menyalin ke clipboard</p>
                </div>
            </div>

            <div className="px-6 py-5 space-y-4">
                {/* Verify code display — clickable, cursor-pointer, hover ring */}
                <div className="flex items-center gap-3">
                    {/* Req 6.1: visual indicator that code is clickable */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        aria-label={`Salin kode verifikasi ${verifyCode}`}
                        className="flex-1 cursor-pointer rounded-xl border border-emerald-200/60 bg-emerald-50/60 px-4 py-3 font-mono text-lg font-bold tracking-[0.25em] text-emerald-800 transition-all hover:ring-2 hover:ring-emerald-400/60 hover:ring-offset-1 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:ring-offset-1 text-center"
                    >
                        {verifyCode}
                    </button>

                    {/* CopyButton — Req 6.2 */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        aria-label="Salin kode verifikasi"
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200/60 bg-emerald-50 text-emerald-700 transition-all hover:bg-emerald-100 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:ring-offset-1"
                    >
                        {copyStatus === 'success' ? (
                            <Check className="size-4" />
                        ) : (
                            <Copy className="size-4" />
                        )}
                    </button>
                </div>

                {/* Feedback message — Req 6.3, 6.4 */}
                {feedbackMessage && (
                    <motion.p
                        key={copyStatus}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-sm font-medium ${
                            copyStatus === 'success' ? 'text-emerald-700' : 'text-red-600'
                        }`}
                        role="status"
                        aria-live="polite"
                    >
                        {feedbackMessage}
                    </motion.p>
                )}

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

                {/* Shareable URL — Req 6.5 */}
                <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ExternalLink className="size-3" aria-hidden="true" />
                        URL Verifikasi
                    </p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={shareableUrl}
                            aria-label="URL verifikasi sertifikat"
                            className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-text select-all"
                            onFocus={(e) => e.target.select()}
                        />
                        <button
                            type="button"
                            onClick={handleCopyUrl}
                            aria-label="Salin URL verifikasi"
                            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 transition-all hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-1"
                        >
                            <Copy className="size-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
