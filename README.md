# LMS Islam Fakultas

Platform Learning Management System (LMS) internal untuk Fakultas, dibangun dengan Laravel 13, Inertia.js, dan React.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 13, PHP 8.2+ |
| Frontend | React 19, Inertia.js, Vite |
| Styling | Tailwind CSS v4, Framer Motion |
| Database | MySQL (production), SQLite (development) |
| Queue | Database driver |
| Storage | Laravel Storage (local/public) |

## Fitur Utama

### Role & Akses
- **Admin** — manajemen user, kursus, dan laporan
- **Instructor (Dosen)** — course builder, penilaian, enrollment approval
- **Student (Mahasiswa)** — belajar, quiz, tugas, sertifikat

### Modul
- **Kursus & Enrollment** — kode enroll, mode auto/manual, approval
- **Content Builder** — artikel, video YouTube, audio, PDF, file
- **Quiz** — pilihan ganda, benar/salah, esai; timer; batas percobaan
- **Tugas** — upload file & link, deadline, penilaian
- **Diskusi** — forum per materi, reply satu level
- **Notifikasi** — database-queued untuk enrollment, penilaian, diskusi, deadline
- **Sertifikat** — kriteria otomatis, kode verifikasi publik
- **Leaderboard** — skor quiz + tugas per kursus (toggle per kursus)
- **Video Manager** — validasi & embed YouTube, live preview

## Instalasi

### Prasyarat
- PHP 8.2+
- Composer
- Node.js 20+
- MySQL 8+ atau SQLite

### Langkah

```bash
# 1. Clone dan install dependencies
git clone <repo-url>
cd lms
composer install
npm install

# 2. Konfigurasi environment
cp .env.example .env
php artisan key:generate

# 3. Atur database di .env, lalu migrate dan seed
php artisan migrate --seed

# 4. Buat storage link
php artisan storage:link

# 5. Build frontend assets
npm run build

# 6. Jalankan queue worker (development)
php artisan queue:work
```

### Development

```bash
# Jalankan dev server
php artisan serve

# Build frontend dengan hot reload
npm run dev
```

## Konfigurasi Penting

### Queue (Database)

```env
QUEUE_CONNECTION=database
```

Jalankan worker:
```bash
php artisan queue:work --sleep=3 --tries=3
```

### Scheduler (Reminder Deadline)

Tambahkan cron di server:
```
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

### Storage

```bash
php artisan storage:link
```

File upload disimpan di `storage/app/public/contents/`.

## Struktur Direktori

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/          # Dashboard, User, Course
│   │   ├── Instructor/     # Course builder, Quiz, Assignment, Submission
│   │   └── Student/        # Course, Quiz attempt, Assignment, Certificate
│   ├── Middleware/
│   └── Requests/
├── Models/                 # Eloquent models
├── Notifications/          # Queued notifications
├── Policies/               # Authorization policies
└── Services/
    ├── CertificateService.php
    ├── LeaderboardService.php
    └── VideoService.php

resources/js/
├── components/
│   ├── animated/           # Framer Motion wrappers
│   ├── shared/             # AtmosphericBackground, VideoPlayer, GlassCard
│   └── ui/                 # Shadcn/UI components
├── Layouts/                # AdminLayout, InstructorLayout, StudentLayout
└── pages/
    ├── Admin/
    ├── Instructor/
    └── Student/

doc/                        # Dokumen desain dan implementasi
```

## Akun Default (Seeder)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |

> **Penting:** Ganti password default sebelum deploy ke production.

## Deployment (Hostinger)

Lihat [`DEPLOYMENT.md`](DEPLOYMENT.md) untuk panduan lengkap deployment ke shared hosting Hostinger, termasuk konfigurasi MySQL, queue, scheduler, dan caching.

## Dokumentasi Teknis

Dokumen desain dan rencana implementasi tersedia di folder [`doc/`](doc/):

- `doc/2026-05-15-lms-islam-design.md` — Dokumen desain sistem
- `doc/2026-05-15-lms-islam-plan.md` — Rencana implementasi
- `doc/2026-05-15-lms-islam-refinement.md` — Refinement dan keputusan teknis
- `doc/2026-05-15-lms-islam-implementation-checklist.md` — Checklist progres implementasi

## Lisensi

Proyek internal. Hak cipta dilindungi.
