import { Head, Link } from '@inertiajs/react';
import { Award, GraduationCap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import StudentLayout from '@/Layouts/StudentLayout';
import { AnimatedPage, StaggerContainer } from '@/components/animated/AnimatedPage';
import { fadeUp } from '@/lib/animations';

export default function Index({ certificates }) {
    const sorted = certificates.toSorted(
        (a, b) => new Date(b.issued_at) - new Date(a.issued_at)
    );

    return (
        <StudentLayout title="Sertifikat Saya">
            <Head title="Sertifikat Saya" />

            <AnimatedPage>
                {/* Header â€” sama dengan halaman lain */}
                <section className="mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-3"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm border
                                bg-emerald-100/80 border-emerald-200/60
                                dark:bg-emerald-500/15 dark:border-emerald-500/30"
                        >
                            <Award className="size-3.5 text-emerald-700 dark:text-emerald-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                Pencapaian Saya
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]"
                        >
                            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-teal-300 dark:to-emerald-400">
                                Sertifikat Saya
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-2xl text-sm leading-relaxed text-content-secondary"
                        >
                            Kumpulan sertifikat yang telah Anda peroleh dari kursus yang diselesaikan.
                        </motion.p>
                    </motion.div>
                </section>

                {/* Grid / Empty state */}
                {sorted.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-2xl border-2 border-dashed p-16 text-center backdrop-blur-sm
                            border-line bg-white/60
                            dark:border-white/10 dark:bg-white/5"
                    >
                        <GraduationCap className="size-12 mx-auto mb-4 text-content-muted dark:text-white/20" />
                        <p className="text-sm font-medium text-content-secondary">
                            Belum ada sertifikat yang diperoleh.
                        </p>
                        <p className="text-xs mt-2 text-content-muted">
                            Selesaikan kursus untuk mendapatkan sertifikat.
                        </p>
                    </motion.div>
                ) : (
                    <StaggerContainer delay={0.4} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {sorted.map((certificate) => (
                            <CertificateCard key={certificate.id} certificate={certificate} />
                        ))}
                    </StaggerContainer>
                )}
            </AnimatedPage>
        </StudentLayout>
    );
}

function CertificateCard({ certificate }) {
    const formattedDate = new Date(certificate.issued_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    });

    const truncatedCode =
        certificate.verify_code.length > 8
            ? certificate.verify_code.slice(0, 8) + '...'
            : certificate.verify_code;

    return (
        <motion.article
            variants={fadeUp}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } }}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-[0_16px_48px_rgba(16,185,129,0.22)] transition-all duration-400"
        >
            {/* Outer glow ring */}
            <div className="absolute -inset-[2px] bg-gradient-to-br from-emerald-400 via-teal-400 to-green-500 opacity-0 group-hover:opacity-80 blur-xl transition-opacity duration-500 rounded-2xl" />

            <Link
                href={`/student/certificates/${certificate.id}`}
                className="relative block rounded-2xl overflow-hidden border
                    bg-white/90 border-white/40
                    dark:bg-[#081616] dark:border-white/[0.07]"
            >
                {/* Header banner â€” sama dengan Courses Index */}
                <div className="relative h-36 bg-gradient-to-br from-emerald-500/90 via-teal-500/90 to-emerald-600/90 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

                    {/* Sparkles corner */}
                    <div className="absolute top-3 right-3">
                        <Sparkles className="size-8 text-white/30" />
                    </div>

                    {/* Award icon */}
                    <div className="absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl shadow-xl border border-white/30">
                        <Award className="size-6 text-white" />
                    </div>

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/10 to-transparent" />
                </div>

                {/* Card body */}
                <div className="relative p-5 space-y-3
                    bg-gradient-to-b from-white/60 to-white/80
                    dark:bg-none dark:bg-[#081616]">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-5 right-5 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

                    {/* Course code badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border
                        bg-emerald-100/60 border-emerald-200/60
                        dark:bg-emerald-500/15 dark:border-emerald-500/30">
                        <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] font-mono text-emerald-700 dark:text-emerald-400">
                            {certificate.course.code}
                        </span>
                    </div>

                    {/* Course name */}
                    <h3 className="text-base font-bold leading-tight line-clamp-2 tracking-tight text-content-primary">
                        {certificate.course.name}
                    </h3>

                    {/* Issue date */}
                    <p className="text-xs font-medium text-content-secondary">
                        Diterbitkan: {formattedDate}
                    </p>

                    {/* Verify code */}
                    <div className="flex items-center gap-2 pt-1 border-t border-line-subtle">
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-content-muted">
                            Kode:
                        </span>
                        <span className="font-mono text-[10px] tracking-wider text-content-secondary">
                            {truncatedCode}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

