import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, CheckCircle2, User, Calendar, Award, Copy, Check, ExternalLink, Download } from 'lucide-react';
import { motion } from 'framer-motion';

import StudentLayout from '@/Layouts/StudentLayout';
import { AnimatedPage, FadeInWhenVisible } from '@/components/animated/AnimatedPage';

function formatIndonesianDate(isoString) {
    return new Date(isoString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

export default function Show({ certificate }) {
    return (
        <StudentLayout title="Detail Sertifikat">
            <Head title="Detail Sertifikat" />

            <AnimatedPage>
                {/* Back + Download */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6 flex items-center justify-between"
                >
                    <Link
                        href="/student/certificates"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors group
                            text-neutral-600 hover:text-emerald-700
                            dark:text-white/50 dark:hover:text-emerald-400"
                    >
                        <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                        Kembali ke Sertifikat
                    </Link>

                    <a
                        href={`/student/certificates/${certificate.id}/download`}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90
                            bg-gradient-to-r from-[#0B3D2E] to-emerald-700 shadow-emerald-900/20"
                    >
                        <Download className="size-4" />
                        Unduh PDF
                    </a>
                </motion.div>

                {/* Certificate Document */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mx-auto max-w-2xl"
                >
                    <CertificateDocument certificate={certificate} />
                </motion.div>

                {/* Criteria */}
                {certificate.criteria && (
                    <FadeInWhenVisible>
                        <div className="mx-auto max-w-2xl mt-6">
                            <CriteriaMetList criteria={certificate.criteria} />
                        </div>
                    </FadeInWhenVisible>
                )}

                {/* Verify code */}
                <FadeInWhenVisible>
                    <div className="mx-auto max-w-2xl mt-6">
                        <VerifyCodeCopyWidget verifyCode={certificate.verify_code} certificateId={certificate.id} />
                    </div>
                </FadeInWhenVisible>
            </AnimatedPage>
        </StudentLayout>
    );
}

/* ── CertificateDocument ─────────────────────────────────────────────────── */

function CertificateDocument({ certificate }) {
    const formattedDate = formatIndonesianDate(certificate.issued_at);

    return (
        <article
            className="overflow-hidden rounded-3xl border shadow-[0_20px_60px_rgba(11,61,46,0.25)]
                border-white/40 dark:border-white/[0.07] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            aria-label="Dokumen Sertifikat"
        >
            {/* Forest Green header */}
            <div className="relative bg-[#0B3D2E] overflow-hidden px-8 pt-10 pb-12">
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l20 20-20 20-20-20L40 0zm0 40l20 20-20 20-20-20 20-20zm20-20l20 20-20 20-20-20 20-20zM0 20l20 20-20 20L0 40V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                    aria-hidden="true"
                />
                <div
                    className="absolute inset-0 opacity-20"
                    style={{ background: 'radial-gradient(ellipse at 60% 50%, #5DCAA5 0%, transparent 70%)' }}
                    aria-hidden="true"
                />

                {/* Seal */}
                <div className="absolute top-6 right-8" aria-hidden="true">
                    <AchievementSeal />
                </div>

                <div className="relative space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5DCAA5]">
                        Sertifikat Penyelesaian
                    </p>
                    <p className="text-sm text-white/60 font-medium">Diberikan kepada</p>
                    <h1 className="font-heading text-[28px] leading-tight text-white">
                        {certificate.user.name}
                    </h1>
                    <p className="text-sm text-white/70 font-medium tracking-wide">
                        NIM: {certificate.user.nim}
                    </p>
                </div>
            </div>

            {/* Card body */}
            <div className="px-8 py-7 space-y-5
                bg-white/95 backdrop-blur-sm
                dark:bg-[#111a15]">
                <p className="text-sm font-medium text-content-secondary">
                    atas keberhasilan menyelesaikan kursus
                </p>

                <div className="space-y-1">
                    <h2 className="text-xl font-bold leading-snug text-content-primary">
                        {certificate.course.name}
                    </h2>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border
                        bg-emerald-100/70 border-emerald-200/60
                        dark:bg-emerald-500/15 dark:border-emerald-500/30">
                        <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] font-mono text-emerald-700 dark:text-emerald-400">
                            {certificate.course.code}
                        </span>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-white/10" />

                {/* Meta grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: User, label: 'Instruktur', value: certificate.course.instructor.name },
                        { icon: Calendar, label: 'Tanggal Terbit', value: formattedDate },
                        { icon: Award, label: 'Kode Verifikasi', value: certificate.verify_code, mono: true },
                    ].map(({ icon: Icon, label, value, mono }) => (
                        <div key={label} className="flex items-start gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border
                                bg-emerald-50 border-emerald-200/60
                                dark:bg-emerald-500/15 dark:border-emerald-500/30">
                                <Icon className="size-4 text-emerald-700 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
                                    {label}
                                </p>
                                <p className={`text-sm font-semibold leading-snug mt-0.5 text-content-primary ${mono ? 'font-mono tracking-wider' : ''}`}>
                                    {value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom accent */}
                <div className="h-1 rounded-full bg-gradient-to-r from-[#0B3D2E] via-[#5DCAA5] to-[#0B3D2E]" />
            </div>
        </article>
    );
}

/* ── AchievementSeal ─────────────────────────────────────────────────────── */

function AchievementSeal() {
    return (
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Achievement seal">
            <circle cx="36" cy="36" r="32" stroke="#5DCAA5" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
            <circle cx="36" cy="36" r="26" fill="#5DCAA5" fillOpacity="0.15" stroke="#5DCAA5" strokeWidth="1.5" />
            <path d="M36 14 L39.5 26 L51 22 L43 32 L55 36 L43 40 L51 50 L39.5 46 L36 58 L32.5 46 L21 50 L29 40 L17 36 L29 32 L21 22 L32.5 26 Z" fill="#5DCAA5" opacity="0.9" />
            <circle cx="36" cy="36" r="6" fill="white" fillOpacity="0.9" />
            <path d="M32.5 36 L35 38.5 L39.5 33.5" stroke="#0B3D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ── CriteriaMetList ─────────────────────────────────────────────────────── */

const CRITERIA_CONFIG = [
    { key: 'min_progress', label: 'Progress Materi', unit: '%', description: 'Persentase materi yang telah diselesaikan' },
    { key: 'min_quiz_score', label: 'Nilai Kuis', unit: '', description: 'Rata-rata nilai kuis' },
    { key: 'min_assignment_score', label: 'Nilai Tugas', unit: '', description: 'Rata-rata nilai tugas' },
];

function CriteriaMetList({ criteria }) {
    const activeCriteria = CRITERIA_CONFIG.filter(
        (c) => criteria[c.key] !== undefined && criteria[c.key] !== null
    );
    if (activeCriteria.length === 0) return null;

    return (
        <section
            className="rounded-2xl overflow-hidden border shadow-lg backdrop-blur-sm
                bg-white/90 border-neutral-200/60
                dark:bg-[#111a15] dark:border-white/[0.07]"
            aria-label="Kriteria yang Dipenuhi"
        >
            <div className="px-6 py-4 border-b flex items-center gap-2.5
                border-line-subtle">
                <div className="flex size-8 items-center justify-center rounded-lg border
                    bg-[#0B3D2E]/10 border-[#0B3D2E]/20
                    dark:bg-emerald-500/15 dark:border-emerald-500/30">
                    <CheckCircle2 className="size-4 text-[#0B3D2E] dark:text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-content-primary">Kriteria yang Dipenuhi</h3>
                    <p className="text-[11px] text-content-secondary">Semua kriteria berikut telah terpenuhi</p>
                </div>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-white/[0.06]">
                {activeCriteria.map((config, index) => (
                    <motion.div
                        key={config.key}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
                        className="flex items-center gap-4 px-6 py-4"
                    >
                        <div className="w-1 h-10 rounded-full bg-[#5DCAA5] shrink-0" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-content-primary">{config.label}</p>
                            <p className="text-[11px] mt-0.5 text-content-secondary">{config.description}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                            <span className="text-sm font-bold text-content-secondary">
                                ≥ {criteria[config.key]}{config.unit}
                            </span>
                            <div className="flex size-6 items-center justify-center rounded-full bg-[#5DCAA5]/15 border border-[#5DCAA5]/40">
                                <CheckCircle2 className="size-3.5 text-[#5DCAA5]" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

/* ── VerifyCodeCopyWidget ────────────────────────────────────────────────── */

function VerifyCodeCopyWidget({ verifyCode, certificateId }) {
    const [copyStatus, setCopyStatus] = useState(null);

    useEffect(() => {
        if (!copyStatus) return;
        const t = setTimeout(() => setCopyStatus(null), 3000);
        return () => clearTimeout(t);
    }, [copyStatus]);

    const shareableUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}/verify-certificate?code=${verifyCode}`
            : `/verify-certificate?code=${verifyCode}`;

    const copy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus('success');
        } catch {
            setCopyStatus('error');
        }
    };

    return (
        <section
            className="rounded-2xl overflow-hidden border shadow-lg backdrop-blur-sm
                bg-white/90 border-neutral-200/60
                dark:bg-[#111a15] dark:border-white/[0.07]"
            aria-label="Kode Verifikasi"
        >
            <div className="px-6 py-4 border-b flex items-center gap-2.5
                border-line-subtle">
                <div className="flex size-8 items-center justify-center rounded-lg border
                    bg-[#0B3D2E]/10 border-[#0B3D2E]/20
                    dark:bg-emerald-500/15 dark:border-emerald-500/30">
                    <Award className="size-4 text-[#0B3D2E] dark:text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-content-primary">Kode Verifikasi</h3>
                    <p className="text-[11px] text-content-secondary">Klik kode untuk menyalin ke clipboard</p>
                </div>
            </div>

            <div className="px-6 py-5 space-y-4">
                {/* Code + copy button */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => copy(verifyCode)}
                        aria-label={`Salin kode verifikasi ${verifyCode}`}
                        className="flex-1 cursor-pointer rounded-xl border px-4 py-3 font-mono text-lg font-bold tracking-[0.25em] text-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-1
                            border-emerald-200/60 bg-emerald-50/60 text-emerald-800 hover:ring-2 hover:ring-emerald-400/60 hover:ring-offset-1 hover:bg-emerald-50 focus:ring-emerald-500/60
                            dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
                    >
                        {verifyCode}
                    </button>
                    <button
                        type="button"
                        onClick={() => copy(verifyCode)}
                        aria-label="Salin kode verifikasi"
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-offset-1
                            border-emerald-200/60 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 focus:ring-emerald-500/60
                            dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-500/25"
                    >
                        {copyStatus === 'success' ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </button>
                </div>

                {/* Feedback */}
                {copyStatus && (
                    <motion.p
                        key={copyStatus}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-sm font-medium ${copyStatus === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                        role="status"
                        aria-live="polite"
                    >
                        {copyStatus === 'success' ? 'Kode berhasil disalin!' : 'Gagal menyalin kode.'}
                    </motion.p>
                )}

                <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-white/10" />

                {/* Shareable URL */}
                <div className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-content-muted">
                        <ExternalLink className="size-3" aria-hidden="true" />
                        URL Verifikasi
                    </p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={shareableUrl}
                            aria-label="URL verifikasi sertifikat"
                            className="flex-1 rounded-lg border px-3 py-2 font-mono text-xs outline-none cursor-text select-all transition-colors
                                border-neutral-200 bg-neutral-50 text-neutral-600 focus:ring-2 focus:ring-emerald-400/50
                                dark:border-white/10 dark:bg-white/5 dark:text-white/50 dark:focus:ring-emerald-500/30"
                            onFocus={(e) => e.target.select()}
                        />
                        <button
                            type="button"
                            onClick={() => copy(shareableUrl)}
                            aria-label="Salin URL verifikasi"
                            className="flex size-9 shrink-0 items-center justify-center rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-offset-1
                                border-neutral-200 bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:ring-emerald-400/50
                                dark:border-white/10 dark:bg-white/5 dark:text-white/35 dark:hover:bg-white/10 dark:hover:text-white/60"
                        >
                            <Copy className="size-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
