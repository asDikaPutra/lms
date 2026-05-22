import { Head, Link } from '@inertiajs/react';
import { Award, GraduationCap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import StudentLayout from '@/Layouts/StudentLayout';
import { AnimatedPage, StaggerContainer } from '@/components/animated/AnimatedPage';
import { fadeUp } from '@/lib/animations';

export default function Index({ certificates }) {
    // Sort certificates by issued_at descending (most recent first)
    const sorted = [...certificates].sort(
        (a, b) => new Date(b.issued_at) - new Date(a.issued_at)
    );

    return (
        <StudentLayout title="Sertifikat Saya">
            <Head title="Sertifikat Saya" />

            <AnimatedPage>
                {/* Header Section */}
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/80 backdrop-blur-sm border border-emerald-200/60"
                        >
                            <Award className="size-3.5 text-emerald-700" />
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                Pencapaian Saya
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]"
                        >
                            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                Sertifikat Saya
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-2xl text-sm leading-relaxed text-neutral-600"
                        >
                            Kumpulan sertifikat yang telah Anda peroleh dari kursus yang diselesaikan.
                        </motion.p>
                    </motion.div>
                </section>

                {/* Certificate Grid */}
                {sorted.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-2xl border-2 border-dashed border-neutral-200 p-16 text-center bg-white/60 backdrop-blur-sm"
                    >
                        <GraduationCap className="size-12 text-neutral-300 mx-auto mb-4" />
                        <p className="text-sm text-neutral-600 font-medium">
                            Belum ada sertifikat yang diperoleh.
                        </p>
                        <p className="text-xs text-neutral-400 mt-2">
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
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const truncatedCode =
        certificate.verify_code.length > 8
            ? certificate.verify_code.slice(0, 8) + '...'
            : certificate.verify_code;

    return (
        <motion.article
            variants={fadeUp}
            whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }}
            className="group relative overflow-hidden rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgb(16,185,129,0.3)] transition-all duration-500"
        >
            {/* Outer glow ring */}
            <div className="absolute -inset-[2px] bg-gradient-to-br from-emerald-400 via-teal-400 to-green-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-3xl" />

            {/* Glass card container */}
            <Link
                href={`/student/certificates/${certificate.id}`}
                className="relative block bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/40"
            >
                {/* Forest Green header band */}
                <div className="relative h-24 bg-[#0B3D2E] overflow-hidden">
                    {/* Islamic geometric SVG pattern at 15% opacity */}
                    <div
                        className="absolute inset-0 opacity-[0.15]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l20 20-20 20-20-20L40 0zm0 40l20 20-20 20-20-20 20-20zm20-20l20 20-20 20-20-20 20-20zM0 20l20 20-20 20L0 40V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Glass overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />

                    {/* Ornamental star SVG in corner */}
                    <div className="absolute top-3 right-3">
                        <Sparkles className="size-10 text-white/40 drop-shadow-lg" />
                    </div>

                    {/* Floating Award icon */}
                    <motion.div
                        animate={{
                            y: [0, -6, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute bottom-3 right-4 flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl shadow-xl border border-white/30"
                    >
                        <Award className="size-6 text-white drop-shadow-lg" />
                    </motion.div>

                    {/* Decorative bottom gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/10 to-transparent" />
                </div>

                {/* Card body */}
                <div className="relative p-5 space-y-3 bg-gradient-to-b from-white/50 to-white/70 backdrop-blur-md">
                    {/* Decorative top border accent */}
                    <div className="absolute top-0 left-5 right-5 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

                    {/* Course code badge (emerald pill) */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 backdrop-blur-sm border border-emerald-200/60">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.1em] font-mono">
                            {certificate.course.code}
                        </span>
                    </div>

                    {/* Course name */}
                    <h3 className="text-base font-bold text-neutral-900 leading-tight line-clamp-2 tracking-tight">
                        {certificate.course.name}
                    </h3>

                    {/* Issue date */}
                    <p className="text-xs text-neutral-500 font-medium">
                        Diterbitkan: {formattedDate}
                    </p>

                    {/* Truncated verify code in monospace */}
                    <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
                        <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
                            Kode:
                        </span>
                        <span className="font-mono text-[10px] text-neutral-600 tracking-wider">
                            {truncatedCode}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
