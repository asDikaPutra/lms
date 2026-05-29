import { Head, useForm } from '@inertiajs/react';
import { BookOpenCheck, Search, ShieldCheck, XCircle, CheckCircle2, User, Hash, BookOpen, GraduationCap, CalendarDays, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { validateVerifyCode } from '@/Pages/certificate-verification-utils';

/**
 * Formats an ISO date string as a readable Indonesian date.
 * e.g. "2025-01-15T00:00:00Z" → "15 Januari 2025"
 *
 * @param {string} isoString
 * @returns {string}
 */
function formatIndonesianDate(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Green validity badge shown at the top of a successful verification result.
 */
function ValidityBadge() {
    return (
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            ✓ Sertifikat Terverifikasi
        </div>
    );
}

/**
 * A single detail row in the certificate result grid.
 */
function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Icon className="size-4" />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-neutral-800 break-words">{value}</p>
            </div>
        </div>
    );
}

/**
 * Renders the certificate details after a successful verification.
 */
function VerificationResult({ certificate }) {
    return (
        <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-md"
        >
            <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-white/80 p-6 shadow-xl shadow-emerald-900/10 backdrop-blur-xl">
                {/* Top accent line */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500 via-[#5DCAA5] to-emerald-500" />

                {/* Badge */}
                <div className="mb-5 flex justify-center">
                    <ValidityBadge />
                </div>

                {/* Divider */}
                <div className="mb-5 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

                {/* Details grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailRow
                        icon={User}
                        label="Nama Mahasiswa"
                        value={certificate.student_name}
                    />
                    <DetailRow
                        icon={Hash}
                        label="NIM"
                        value={certificate.student_nim}
                    />
                    <DetailRow
                        icon={BookOpen}
                        label="Nama Kursus"
                        value={certificate.course_name}
                    />
                    <DetailRow
                        icon={BadgeCheck}
                        label="Kode Kursus"
                        value={certificate.course_code}
                    />
                    <DetailRow
                        icon={GraduationCap}
                        label="Instruktur"
                        value={certificate.instructor_name}
                    />
                    <DetailRow
                        icon={CalendarDays}
                        label="Tanggal Terbit"
                        value={formatIndonesianDate(certificate.issued_at)}
                    />
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Red-tinted error card shown when the verification code is not found.
 */
function ErrorCard({ message }) {
    return (
        <motion.div
            key="error-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-md"
        >
            <div className="relative overflow-hidden rounded-2xl border border-red-200/60 bg-red-50/80 p-6 shadow-xl shadow-red-900/10 backdrop-blur-xl">
                {/* Top accent line */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-red-400 via-red-500 to-red-400" />

                <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <XCircle className="size-5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-red-700">Sertifikat Tidak Ditemukan</p>
                        <p className="mt-1 text-sm text-red-600">{message}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function CertificateVerification({ certificate = null, error = null }) {
    const { data, setData, post, processing } = useForm({
        verify_code: '',
    });
    const [localError, setLocalError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        const validation = validateVerifyCode(data.verify_code);
        if (!validation.valid) {
            setLocalError(validation.message);
            return;
        }

        setLocalError(null);
        post('/verify-certificate');
    };

    const handleCodeChange = (event) => {
        const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
        setData('verify_code', value);
        if (localError) setLocalError(null);
    };

    return (
        <>
            <Head title="Verifikasi Sertifikat" />

            {/* Full-page background */}
            <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50/50 to-green-50">
                {/* Floating ambient orbs */}
                <motion.div
                    animate={{ y: [0, -24, 0], x: [0, 16, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                    className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-400/15 blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, 32, 0], x: [0, -24, 0] }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                    className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-gradient-to-br from-teal-400/15 to-green-400/15 blur-3xl"
                />

                <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
                    {/* Brand header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 flex flex-col items-center gap-3 text-center"
                    >
                        {/* Logo mark */}
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B3D2E] to-emerald-700 text-white shadow-xl shadow-emerald-900/30"
                        >
                            <BookOpenCheck className="size-7" />
                        </motion.div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                                LMS Islam Fakultas
                            </p>
                            <h1 className="mt-1 font-heading text-2xl font-bold text-[#0B3D2E] sm:text-3xl">
                                Verifikasi Sertifikat
                            </h1>
                            <p className="mt-1.5 max-w-sm text-sm text-neutral-500">
                                Masukkan kode verifikasi untuk mengonfirmasi keaslian sertifikat.
                            </p>
                        </div>
                    </motion.div>

                    {/* Glass morphism form card */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="w-full max-w-md"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl sm:p-8">
                            {/* Decorative top accent line */}
                            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0B3D2E] via-[#5DCAA5] to-[#0B3D2E]" />

                            {/* Decorative corner orb */}
                            <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 blur-2xl" />

                            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                {/* Code input */}
                                <div>
                                    <label
                                        htmlFor="verify_code"
                                        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-700"
                                    >
                                        Kode Verifikasi
                                    </label>

                                    <div className="relative">
                                        <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-emerald-600" />
                                        <motion.input
                                            id="verify_code"
                                            type="text"
                                            value={data.verify_code}
                                            onChange={handleCodeChange}
                                            maxLength={12}
                                            placeholder="XXXXXXXXXXXX"
                                            autoComplete="off"
                                            autoCapitalize="characters"
                                            spellCheck={false}
                                            whileFocus={{ scale: 1.01 }}
                                            style={{ textTransform: 'uppercase' }}
                                            className={`h-12 w-full rounded-xl border-2 bg-white/80 pl-10 pr-4 font-mono text-sm font-semibold tracking-[0.2em] text-neutral-900 outline-none transition-all placeholder:font-sans placeholder:tracking-normal placeholder:text-neutral-400 ${
                                                localError
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                                    : 'border-neutral-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-neutral-300'
                                            }`}
                                        />
                                    </div>

                                    {/* Character count hint */}
                                    <div className="mt-1.5 flex items-center justify-between">
                                        <span className="text-[11px] text-neutral-400">
                                            Contoh: ABC123DEF456
                                        </span>
                                        <span
                                            className={`text-[11px] font-medium tabular-nums ${
                                                data.verify_code.length === 12
                                                    ? 'text-emerald-600'
                                                    : 'text-neutral-400'
                                            }`}
                                        >
                                            {data.verify_code.length}/12
                                        </span>
                                    </div>

                                    {/* Inline validation error */}
                                    {localError && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600"
                                            role="alert"
                                        >
                                            <span className="text-sm">⚠️</span>
                                            {localError}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Submit button */}
                                <Button
                                    type="submit"
                                    variant="success"
                                    disabled={processing}
                                    loading={processing}
                                    className="w-full rounded-xl py-3 shadow-lg shadow-emerald-900/25 hover:shadow-xl hover:shadow-emerald-900/30"
                                >
                                    <Search className="size-4" />
                                    {processing ? 'Memverifikasi...' : 'Verifikasi Sertifikat'}
                                </Button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Footer note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-center text-xs text-neutral-400"
                    >
                        Layanan verifikasi sertifikat resmi LMS Islam Fakultas
                    </motion.p>

                    {/* Verification result / error card */}
                    <AnimatePresence mode="wait">
                        {certificate && (
                            <div className="mt-6 w-full max-w-md">
                                <VerificationResult certificate={certificate} />
                            </div>
                        )}
                        {!certificate && error && (
                            <div className="mt-6 w-full max-w-md">
                                <ErrorCard message={error} />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </>
    );
}
