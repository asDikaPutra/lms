# LMS Islam Fakultas — Design Document
**Date:** 2026-05-15  
**Status:** Refined Baseline — Ready for Implementation Planning

> **Refinement note:** sebelum implementasi, gunakan juga `2026-05-15-lms-islam-refinement.md` sebagai sumber keputusan final untuk area yang sebelumnya ambigu: progress tracking, sertifikat, leaderboard, discussion reply, polymorphic type, authorization, dan deployment queue.

---

## 1. Overview

Platform Learning Management System (LMS) berbasis web untuk kebutuhan internal fakultas dengan mata kuliah Islam. Target awal adalah ≤3000 pengguna (mahasiswa + dosen + admin). Platform dirancang untuk bisa dikembangkan ke arah komersial (marketplace kursus) di masa depan.

---

## 2. Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 13 |
| Frontend | React (via Inertia.js) |
| Styling | Tailwind CSS + Shadcn/UI |
| Database | MySQL |
| Video | YouTube Embed (unlisted) |
| Storage | File storage lokal Hostinger |
| Email | Laravel Mail + Queue |
| Hosting | Hostinger Shared Hosting |

---

## 3. User Roles

| Role | Deskripsi |
|------|-----------|
| `admin` | Kelola semua user, kursus, laporan |
| `instructor` | Dosen — kelola kursus yang diampu |
| `student` | Mahasiswa — akses kursus yang diikuti |

---

## 4. Arsitektur Folder

```
app/
├── Http/Controllers/
│   ├── Admin/
│   ├── Instructor/
│   └── Student/
├── Models/
├── Policies/
└── Jobs/

resources/js/
├── Pages/
│   ├── Admin/
│   ├── Instructor/
│   └── Student/
└── Components/
```

---

## 5. Struktur Konten (Hierarki)

```
Course (Mata Kuliah)
└── Module (Pertemuan/Bab)  [punya urutan]
    ├── Material (Lesson/Topik)  [punya urutan]
    │   ├── Content  [punya urutan]
    │   │   ├── artikel (rich text)
    │   │   ├── video (YouTube embed)
    │   │   ├── audio (upload)
    │   │   ├── pdf (upload)
    │   │   └── file (upload)
    │   ├── Quiz     ← selalu di akhir material (opsional)
    │   ├── Tugas    ← selalu di akhir material (opsional)
    │   └── Diskusi  ← 1 thread per materi (otomatis)
    ├── Quiz  ← selalu di akhir modul (opsional, standalone)
    └── Tugas ← selalu di akhir modul (opsional, standalone)
```

**Catatan:** Quiz dan tugas tidak memiliki field `order` — selalu dirender setelah semua materi/konten.

---

## 6. Database Schema

### users
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| name | varchar | |
| email | varchar unique | |
| password | varchar | hashed |
| role | enum | admin\|instructor\|student |
| nim | varchar nullable | untuk mahasiswa |
| nidn | varchar nullable | untuk dosen |
| avatar | varchar nullable | |
| is_active | boolean | default true |
| timestamps | | |

### courses
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| code | varchar | kode mata kuliah (FAI301) |
| name | varchar | |
| description | text | |
| instructor_id | FK → users | |
| enroll_code | varchar unique | kode untuk mahasiswa join |
| enrollment_type | enum | auto\|manual |
| semester | varchar | |
| is_active | boolean | |
| leaderboard_enabled | boolean | default false |
| certificate_criteria | JSON nullable | template kriteria sertifikat per kursus |
| timestamps | | |

### enrollments
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| user_id | FK → users | |
| course_id | FK → courses | |
| status | enum | pending\|active\|rejected |
| enrolled_at | timestamp | |
| completed_at | timestamp nullable | |

### modules
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| course_id | FK → courses | |
| title | varchar | |
| description | text nullable | |
| order | int | urutan pertemuan |
| is_published | boolean | |
| timestamps | | |

### materials
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| module_id | FK → modules | |
| title | varchar | |
| order | int | urutan dalam modul |
| is_published | boolean | |
| timestamps | | |

### contents
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| material_id | FK → materials | |
| type | enum | artikel\|video\|audio\|pdf\|file |
| title | varchar | |
| body | longtext nullable | untuk artikel |
| url | varchar nullable | untuk video YouTube |
| file_path | varchar nullable | untuk audio/pdf/file |
| order | int | urutan dalam materi |
| timestamps | | |

### quizzes
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| quizzable_type | varchar | "module" atau "material" |
| quizzable_id | bigint | polymorphic FK |
| title | varchar | |
| duration | int nullable | dalam menit |
| result_mode | enum | immediate\|delayed\|custom |
| passing_score | int | nilai minimum lulus |
| is_published | boolean | |
| timestamps | | |

### quiz_questions
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| quiz_id | FK → quizzes | |
| question | text | |
| type | enum | multiple_choice\|true_false\|essay |
| options | JSON nullable | untuk multiple choice |
| correct_answer | text | |
| points | int | |
| order | int | |

### quiz_attempts
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| quiz_id | FK → quizzes | |
| user_id | FK → users | |
| answers | JSON | jawaban mahasiswa |
| score | decimal | |
| status | enum | in_progress\|submitted\|graded |
| started_at | timestamp | |
| finished_at | timestamp nullable | |

### assignments
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| assignable_type | varchar | "module" atau "material" |
| assignable_id | bigint | polymorphic FK |
| title | varchar | |
| description | text | |
| deadline | datetime | |
| allow_file | boolean | |
| allow_link | boolean | |
| is_published | boolean | |
| timestamps | | |

### submissions
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| assignment_id | FK → assignments | |
| user_id | FK → users | |
| file_path | varchar nullable | |
| link_url | varchar nullable | |
| grade | decimal nullable | |
| feedback | text nullable | |
| status | enum | submitted\|graded\|late |
| submitted_at | timestamp | |

### certificates
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| user_id | FK → users | |
| course_id | FK → courses | |
| criteria | JSON | kondisi yang ditetapkan dosen |
| verify_code | varchar unique | untuk QR verifikasi |
| issued_at | timestamp | |

### discussions
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| material_id | FK → materials | 1 thread per materi |
| user_id | FK → users | siapa yang posting |
| parent_id | FK → discussions nullable | reply 1 level; null untuk post utama |
| body | text | konten teks |
| timestamps | | |

### content_progress
| Field | Type | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| user_id | FK → users | mahasiswa |
| content_id | FK → contents | konten yang diselesaikan |
| completed_at | timestamp nullable | null berarti belum selesai |
| timestamps | | |

**Constraint:** unique `user_id + content_id`.

---

## 6.1 Keputusan Schema Tambahan

- `courses.certificate_criteria` adalah template kriteria sertifikat per kursus.
- `certificates.criteria` adalah snapshot kriteria saat sertifikat diterbitkan.
- `courses.leaderboard_enabled` mengontrol apakah leaderboard terlihat oleh mahasiswa.
- `quizzable_type` dan `assignable_type` wajib memakai Laravel morph map alias `module` dan `material`.
- Progress kursus dihitung dari `content_progress` terhadap seluruh published contents dalam course.

---

## 7. Enrollment Flow

```
Mahasiswa input kode enroll
         │
         ▼
enrollment_type = ?
    │              │
   auto           manual
    │              │
    ▼              ▼
status=active   status=pending
Langsung masuk  → Email notif ke dosen
                → Dosen approve/tolak
                → Email notif ke mahasiswa
```

---

## 8. Fitur per Role

### Admin
- Dashboard statistik (total user, kursus, aktif)
- Manajemen user (tambah/edit/nonaktifkan dosen & mahasiswa)
- Import mahasiswa via CSV
- Assign dosen ke mata kuliah
- Arsip mata kuliah
- Export data & rekap nilai semua kelas

### Instructor (Dosen)
- Dashboard mata kuliah yang diampu
- Buat/edit mata kuliah + generate kode enroll
- Setting enrollment mode (auto/manual) per kursus
- Approve/tolak pengajuan enroll mahasiswa
- Builder konten: modul → materi → konten
- Video Manager (paste YouTube URL → auto preview thumbnail & judul)
- Publish/unpublish modul & materi
- Quiz builder (pilihan ganda/benar-salah/essay) + setting result_mode
- Buat tugas (file/link) + set deadline
- Nilai & feedback submission tugas
- Posting & reply di forum diskusi per materi
- Monitoring progress mahasiswa
- Rekap nilai + export Excel
- Leaderboard toggle (aktif/nonaktif per kursus)
- Set kriteria sertifikat per kursus

### Student (Mahasiswa)
- Dashboard kursus + progress + tugas deadline
- Join kursus via kode enroll
- Akses modul & materi (urut: konten → quiz → tugas → diskusi)
- Submit quiz
- Submit tugas (upload file dan/atau link)
- Lihat nilai & feedback
- Posting & reply di forum diskusi per materi
- Lihat leaderboard (jika diaktifkan dosen)
- Download sertifikat (jika memenuhi kriteria)
- Edit profil & avatar
- Riwayat kursus & sertifikat

---

## 9. Email Notifikasi

| Trigger | Penerima |
|---------|----------|
| Mahasiswa ajukan enroll | Dosen |
| Dosen approve enroll | Mahasiswa |
| Dosen tolak enroll | Mahasiswa |
| Kursus baru dipublish | Mahasiswa terdaftar |
| Modul baru dipublish | Mahasiswa terdaftar |
| Quiz baru tersedia | Mahasiswa terdaftar |
| Hasil quiz dirilis dosen | Mahasiswa |
| Tugas baru dibuat | Mahasiswa terdaftar |
| Deadline tugas H-1 | Mahasiswa yang belum submit |
| Dosen sudah menilai tugas | Mahasiswa |
| Sertifikat siap didownload | Mahasiswa |
| Post baru di diskusi materi | Peserta yang pernah posting di thread itu |

**Implementasi:** Laravel Mail + Queue Jobs + Scheduler (cron harian untuk reminder deadline)

---

## 10. Roadmap

### Fase 1 — MVP Internal (Sekarang)
- Core LMS: kursus, modul, materi, konten, quiz, tugas
- Manajemen user & enrollment
- Email notifikasi
- Sertifikat
- Leaderboard
- Progress tracking

### Fase 2 — Pengembangan
- Multi-fakultas
- Fitur Islam (Al-Quran embed, referensi hadits, modul tahfidz)
- Mobile responsive optimization

### Fase 3 — Komersial
- Marketplace kursus publik
- Kursus berbayar
- Langganan institusi

---

## 11. Catatan Teknis

- **Shared hosting Hostinger** — tidak support Node.js, semua rendering via Laravel + Inertia
- **Queue:** Gunakan database driver (tidak perlu Redis di shared hosting)
- **Cron job:** Setup via cPanel Hostinger untuk deadline reminder
- **Video:** YouTube unlisted embed — hemat storage & bandwidth
- **File upload:** Batasi ukuran file (rekomendasi max 50MB per file) sesuai limit hosting
