# LMS Islam Fakultas — Refinement Before Implementation
**Date:** 2026-05-15  
**Status:** Approved Baseline for Implementation

Dokumen ini menyempurnakan design document dan implementation plan sebelum coding dimulai. Gunakan dokumen ini sebagai acuan koreksi bila ada bagian lama yang masih ambigu.

---

## 1. Keputusan Produk yang Dikunci

### Target MVP
MVP internal harus fokus pada operasional belajar-mengajar fakultas:
- Admin mengelola user, dosen, mahasiswa, kursus, import CSV, dan laporan.
- Dosen mengelola kursus, enrollment, modul, materi, konten, quiz, tugas, diskusi, progress, leaderboard, dan sertifikat.
- Mahasiswa mengikuti kursus via kode enroll, belajar berurutan, mengerjakan quiz/tugas, berdiskusi, melihat nilai, dan mengunduh sertifikat.

Fitur marketplace, kursus berbayar, multi-fakultas, dan langganan institusi ditunda ke fase komersial.

### Prinsip Urutan Konten
Urutan render di halaman belajar mahasiswa harus selalu:
1. Contents dalam material, berdasarkan `contents.order`.
2. Quiz material, jika ada dan published.
3. Tugas material, jika ada dan published.
4. Diskusi material.
5. Setelah semua material selesai, tampilkan quiz/tugas module-level.

Quiz dan tugas tidak memakai field `order`. Keduanya selalu menjadi aktivitas akhir dari parent-nya.

### Mode Enrollment
- `auto`: mahasiswa langsung aktif setelah memasukkan kode enroll.
- `manual`: mahasiswa masuk status `pending`, dosen menerima notifikasi, lalu approve/reject.
- Enrollment yang sudah `rejected` boleh diajukan ulang dengan mengubah kembali status menjadi `pending`.

---

## 2. Penyempurnaan Database

### courses
Tambahkan field berikut:

| Field | Type | Keterangan |
|-------|------|------------|
| leaderboard_enabled | boolean | default false; dikontrol dosen per kursus |
| certificate_criteria | JSON nullable | template kriteria sertifikat per kursus |

Catatan: `certificate_criteria` disimpan di `courses`, sedangkan `certificates.criteria` menjadi snapshot kriteria saat sertifikat diterbitkan.

### discussions
Schema lama hanya mendukung post flat, padahal requirement menyebut reply. Gunakan struktur threaded ringan:

| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| material_id | FK → materials | thread per materi |
| user_id | FK → users | penulis |
| parent_id | FK → discussions nullable | null untuk top-level post, isi untuk reply |
| body | text | |
| timestamps | | |

Batasi reply satu level pada MVP agar UI sederhana dan query tetap ringan.

### content_progress
Tambahkan tabel tracking progress agar progress dashboard, sertifikat, dan monitoring dosen tidak dihitung dari tebakan.

| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| user_id | FK → users | |
| content_id | FK → contents | |
| completed_at | timestamp nullable | null berarti belum selesai |
| timestamps | | |

Constraint:
- unique `user_id + content_id`
- content dianggap selesai saat mahasiswa klik "Tandai selesai" atau aktivitas video/file/artikel dinyatakan selesai oleh UI.

### quiz_attempts
Tambahkan field:

| Field | Type | Keterangan |
|-------|------|------------|
| status | enum | in_progress\|submitted\|graded |

Essay membuat attempt berstatus `submitted` sampai dosen menilai. Quiz tanpa essay bisa langsung `graded` bila `result_mode = immediate`.

### submissions
Tambahkan field:

| Field | Type | Keterangan |
|-------|------|------------|
| status | enum | submitted\|graded\|late |

Submission setelah deadline tetap boleh diterima pada MVP, tetapi status menjadi `late`.

### Polymorphic Types
Gunakan morph map Laravel agar database menyimpan alias pendek:

```php
Relation::enforceMorphMap([
    'module' => \App\Models\Module::class,
    'material' => \App\Models\Material::class,
]);
```

Dengan ini `quizzable_type` dan `assignable_type` konsisten berisi `module` atau `material`, bukan nama class penuh.

---

## 3. Authorization dan Role Guard

Semua controller wajib memeriksa kepemilikan dan akses:
- Admin hanya lewat middleware `role:admin`.
- Dosen hanya boleh mengubah kursus yang `instructor_id` miliknya.
- Mahasiswa hanya boleh membuka kursus dengan enrollment `active`.
- Quiz, tugas, file, dan diskusi harus divalidasi terhadap kursus yang memang bisa diakses user.

Policy minimal:
- `CoursePolicy`: view, update, manageEnrollments, viewReports.
- `ModulePolicy`: create/update/delete berdasarkan ownership course.
- `MaterialPolicy`: create/update/delete berdasarkan ownership course.
- `QuizPolicy`: manage untuk dosen pemilik, attempt untuk mahasiswa aktif.
- `AssignmentPolicy`: manage untuk dosen pemilik, submit untuk mahasiswa aktif.
- `DiscussionPolicy`: create untuk peserta aktif, delete untuk penulis sendiri atau dosen/admin.

---

## 4. UI/UX Refinement dari Mockup

Visual dashboard mengikuti `example-mockup.png`:
- Sidebar kiri gelap dengan icon-only navigation.
- Area utama putih/very light, kartu statistik kecil, dan daftar kursus sebagai card.
- Warna kursus boleh bervariasi per course, tapi UI dasar jangan didominasi satu warna.
- Gunakan layout responsif: sidebar collapse/bottom nav di mobile.
- Hindari landing page marketing; setelah login user langsung masuk dashboard sesuai role.

Dashboard student harus menampilkan:
- Sapaan dan nama user.
- Search course/material.
- Statistik ringkas: kursus, progress, tugas mendatang, sertifikat.
- Kartu kursus dengan progress.
- Upcoming assignments.
- Quote/ornamen Islami sebagai elemen sekunder, bukan penghalang workflow.

Dashboard instructor harus menampilkan:
- Kelas yang diampu.
- Pending enrollment.
- Tugas/quiz yang perlu dinilai.
- Progress mahasiswa yang perlu perhatian.

Dashboard admin harus menampilkan:
- Total user per role.
- Total kursus aktif.
- Enrollment aktif/pending.
- Shortcut import user dan export laporan.

---

## 5. Reporting dan Progress

Progress course dihitung dari:
```
completed_contents / total_published_contents
```

Nilai course dihitung dari gabungan:
- rata-rata quiz yang sudah graded
- rata-rata tugas yang sudah graded

Untuk MVP, bobot default:
- Quiz: 50%
- Tugas: 50%

Jika salah satu komponen belum ada, gunakan komponen yang tersedia. Bobot custom per kursus ditunda sampai fase berikutnya.

Leaderboard hanya tampil bila `courses.leaderboard_enabled = true`.

---

## 6. Sertifikat

Sertifikat diterbitkan jika mahasiswa memenuhi `courses.certificate_criteria`.

Kriteria MVP:
```json
{
  "min_progress": 100,
  "min_score": 70
}
```

Saat sertifikat diterbitkan:
- buat row `certificates`
- salin criteria dari course ke `certificates.criteria`
- generate `verify_code` unik
- isi `issued_at`

PDF sertifikat boleh menggunakan template sederhana pada MVP. QR code mengarah ke route verifikasi publik:
```
/certificates/verify/{verify_code}
```

---

## 7. File Upload dan Storage

Storage MVP:
- Gunakan disk `public`.
- Jalankan `php artisan storage:link` saat deploy.
- Maksimum file upload 50MB.
- Validasi MIME type sesuai jenis content/submission.

Lokasi file:
- Materi: `materials/{course_id}/{material_id}/...`
- Submission: `submissions/{assignment_id}/{user_id}/...`
- Avatar: `avatars/{user_id}/...`

File access:
- File materi hanya bisa diakses peserta kursus aktif, dosen pemilik, dan admin.
- Jika memakai `public` disk, hindari menaruh materi sensitif. Untuk MVP ini diterima karena target internal dan shared hosting.

---

## 8. Email dan Queue

Gunakan:
```
QUEUE_CONNECTION=database
```

Wajib ada queue worker atau cron fallback di Hostinger. Jika shared hosting tidak mendukung long-running worker, gunakan cron untuk:
```
php artisan queue:work --stop-when-empty
```

Scheduler tetap menjalankan deadline reminder harian.

---

## 9. Implementation Guardrails

Sebelum implementasi fitur besar:
- Buat migration dan model lengkap lebih dulu.
- Tambahkan policy sebelum controller mutasi data.
- Tambahkan seed user admin, dosen, mahasiswa dummy untuk manual testing.
- Implementasi UI per role dimulai dari dashboard, lalu workflow inti.
- Jangan implementasikan marketplace, payment, multi-tenant, atau mobile app native pada MVP.

Definition of Done MVP:
- Admin bisa membuat user dan kursus.
- Dosen bisa membuat modul, materi, konten, quiz, tugas, dan approve enrollment.
- Mahasiswa bisa join course, membuka materi, menandai progress, submit quiz/tugas, dan diskusi.
- Email notifikasi dasar berjalan via queue database.
- Sertifikat dan leaderboard bekerja sesuai toggle/kriteria.
- Build production berhasil untuk deployment Hostinger.
