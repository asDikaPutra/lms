<?php

namespace App\Services;

use App\Models\Certificate;

class CertificatePdfService
{
    /**
     * Template dimensions (px at 96dpi): 2000 x 1414
     * PDF page size A4 landscape: 297 x 210 mm
     *
     * Conversion: px / 2000 * 297 = mm (x-axis)
     *             px / 1414 * 210 = mm (y-axis)
     */
    private const PAGE_W = 297.0;
    private const PAGE_H = 210.0;
    private const IMG_W  = 2000.0;
    private const IMG_H  = 1414.0;

    /** Convert pixel X coordinate to mm */
    private function px(float $px): float
    {
        return $px / self::IMG_W * self::PAGE_W;
    }

    /** Convert pixel Y coordinate to mm */
    private function py(float $py): float
    {
        return $py / self::IMG_H * self::PAGE_H;
    }

    public function generate(Certificate $certificate): string
    {
        $certificate->loadMissing('course.instructor', 'user');

        $pdf = new \FPDF('L', 'mm', 'A4');
        $pdf->AddPage();
        $pdf->SetAutoPageBreak(false);

        // ── Background template ──────────────────────────────────────────
        $templatePath = public_path('template-sertifikat.png');
        $pdf->Image($templatePath, 0, 0, self::PAGE_W, self::PAGE_H, 'PNG');

        // ── Font setup ───────────────────────────────────────────────────
        // FPDF ships with core fonts; we use Helvetica (no embedding needed)
        $pdf->SetTextColor(90, 60, 10); // dark gold/brown for readability on template

        // ── Student name (largest, center ~57% from top) ─────────────────
        $pdf->SetFont('Helvetica', 'B', 28);
        $nameY = $this->py(780); // ~55% down
        $pdf->SetXY(0, $nameY);
        $pdf->Cell(self::PAGE_W, 12, $certificate->user->name, 0, 0, 'C');

        // ── "telah menyelesaikan kursus" label ───────────────────────────
        $pdf->SetFont('Helvetica', '', 11);
        $pdf->SetTextColor(100, 80, 20);
        $pdf->SetXY(0, $nameY + 14);
        $pdf->Cell(self::PAGE_W, 7, 'telah berhasil menyelesaikan kursus', 0, 0, 'C');

        // ── Course name ──────────────────────────────────────────────────
        $pdf->SetFont('Helvetica', 'B', 18);
        $pdf->SetTextColor(90, 60, 10);
        $pdf->SetXY(0, $nameY + 23);
        $pdf->Cell(self::PAGE_W, 10, $certificate->course->name, 0, 0, 'C');

        // ── Instructor name ──────────────────────────────────────────────
        $pdf->SetFont('Helvetica', '', 10);
        $pdf->SetTextColor(100, 80, 20);
        $pdf->SetXY(0, $nameY + 35);
        $pdf->Cell(self::PAGE_W, 6, 'Instruktur: ' . $certificate->course->instructor->name, 0, 0, 'C');

        // ── Issue date (bottom area ~88% from top) ───────────────────────
        $pdf->SetFont('Helvetica', '', 10);
        $pdf->SetTextColor(90, 60, 10);
        $dateStr = $certificate->issued_at->translatedFormat('d F Y');
        // Place date roughly at bottom-center of template
        $pdf->SetXY(0, $this->py(1230));
        $pdf->Cell(self::PAGE_W, 6, $dateStr, 0, 0, 'C');

        // ── Verify code (small, bottom) ──────────────────────────────────
        $pdf->SetFont('Helvetica', '', 8);
        $pdf->SetTextColor(130, 100, 30);
        $pdf->SetXY(0, $this->py(1310));
        $pdf->Cell(self::PAGE_W, 5, 'Kode Verifikasi: ' . $certificate->verify_code, 0, 0, 'C');

        return $pdf->Output('S'); // return as string
    }
}
