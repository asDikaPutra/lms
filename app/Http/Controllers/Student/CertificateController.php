<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Services\CertificateService;
use App\Services\CertificatePdfService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function __construct(
        private CertificateService $certificateService,
        private CertificatePdfService $pdfService,
    ) {}

    /**
     * Show student's certificates
     */
    public function index(Request $request): Response
    {
        $certificates = Certificate::query()
            ->where('user_id', $request->user()->id)
            ->with('course')
            ->latest('issued_at')
            ->get();

        return Inertia::render('Student/Certificates/Index', [
            'certificates' => $certificates,
        ]);
    }

    /**
     * Show certificate detail
     */
    public function show(Certificate $certificate): Response
    {
        abort_unless($certificate->user_id === auth()->id(), 403);

        $certificate->load('course.instructor', 'user');

        return Inertia::render('Student/Certificates/Show', [
            'certificate' => $certificate,
        ]);
    }

    /**
     * Download certificate as PDF
     */
    public function download(Certificate $certificate): HttpResponse
    {
        abort_unless($certificate->user_id === auth()->id(), 403);

        $pdf = $this->pdfService->generate($certificate);

        $filename = 'sertifikat-' . str($certificate->course->name ?? 'kursus')->slug() . '.pdf';

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Request certificate for a course
     */
    public function request(Request $request, Course $course): RedirectResponse
    {
        // Check if student is enrolled
        $enrollment = $course->enrollments()
            ->where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->first();

        if (!$enrollment) {
            return back()->with('error', 'Anda belum terdaftar di kursus ini.');
        }

        // Check if already has certificate
        $existing = Certificate::query()
            ->where('user_id', $request->user()->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return back()->with('warning', 'Anda sudah memiliki sertifikat untuk kursus ini.');
        }

        // Check eligibility
        if (!$this->certificateService->isEligible($request->user(), $course)) {
            return back()->with('error', 'Anda belum memenuhi kriteria untuk mendapatkan sertifikat.');
        }

        // Issue certificate
        $this->certificateService->issue($request->user(), $course);

        return back()->with('success', 'Selamat! Sertifikat Anda telah diterbitkan.');
    }
}
