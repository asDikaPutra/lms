<?php

namespace App\Http\Controllers;

use App\Services\CertificateService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificateVerificationController extends Controller
{
    public function __construct(
        private CertificateService $certificateService
    ) {}

    /**
     * Show verification form
     */
    public function index(): Response
    {
        return Inertia::render('CertificateVerification', [
            'certificate' => null,
        ]);
    }

    /**
     * Verify certificate by code
     */
    public function verify(Request $request): Response
    {
        $validated = $request->validate([
            'verify_code' => ['required', 'string', 'size:12'],
        ]);

        $certificate = $this->certificateService->verify($validated['verify_code']);

        if (!$certificate) {
            return Inertia::render('CertificateVerification', [
                'certificate' => null,
                'error' => 'Kode verifikasi tidak ditemukan.',
            ]);
        }

        return Inertia::render('CertificateVerification', [
            'certificate' => [
                'id' => $certificate->id,
                'verify_code' => $certificate->verify_code,
                'issued_at' => $certificate->issued_at,
                'student_name' => $certificate->user->name,
                'student_nim' => $certificate->user->nim,
                'course_name' => $certificate->course->name,
                'course_code' => $certificate->course->code,
                'instructor_name' => $certificate->course->instructor->name,
                'criteria' => $certificate->criteria,
            ],
        ]);
    }
}
