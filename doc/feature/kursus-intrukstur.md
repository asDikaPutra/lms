Saya ingin mengubah navigasi dan tampilan halaman kursus untuk role instruktur pada LMS.

Route utama:
http://127.0.0.1:8000/instructor/courses

Tujuan perubahan:
Halaman kursus instruktur jangan lagi menggunakan tabel. Ubah menjadi tampilan card/grid seperti UI student course yang sudah ada, agar konsisten secara desain.

====================================================================
1. HALAMAN DAFTAR KURSUS INSTRUKTUR
====================================================================

Ubah halaman `/instructor/courses` menjadi halaman daftar kursus berbasis card.

Gunakan style visual yang konsisten dengan halaman student UI:
- Card layout
- Rounded corner
- Shadow lembut
- Spacing rapi
- Typography konsisten
- Responsive grid
- Warna dan komponen mengikuti design system yang sudah ada

Tambahkan header halaman dengan gaya yang sama seperti halaman-halaman sebelumnya.

Header berisi:
- Judul: "Kursus Saya"
- Deskripsi singkat: "Kelola kursus yang Anda ampu."
- Tombol utama: "+ Tambah Kursus"

Tombol "+ Tambah Kursus":
- Letakkan di area kanan header
- Gunakan style primary button
- Untuk saat ini cukup arahkan ke halaman/form tambah kursus yang sudah ada jika tersedia
- Jika belum ada route tambah kursus, buat placeholder action atau route standar yang sesuai struktur project

====================================================================
2. ISI CARD KURSUS
====================================================================

Setiap card kursus harus menampilkan informasi singkat berikut:

- Nama kursus
- Kode kursus / kode kelas
- Status kursus
- Jumlah mahasiswa
- Progress kursus atau jumlah modul
- Jumlah item yang perlu dinilai
- Tombol "Kelola"

Contoh isi card:

Nama kursus:
Tafsir Al-Quran

Kode/kode kelas:
FAI301 · PAI 3A

Status:
Aktif / Draft / Arsip

Informasi ringkas:
- 35 Mahasiswa
- 14 Modul
- 8 Perlu Dinilai

Aksi:
- Tombol "Kelola"

Ketika tombol "Kelola" diklik, arahkan ke halaman detail kursus instruktur.

Contoh route:
`/instructor/courses/{courseId}`

Jangan tampilkan statistik global seperti total semua kursus, total semua mahasiswa, total semua tugas perlu dinilai, dan sebagainya di halaman ini. Statistik global cukup ada di dashboard instruktur.

Halaman ini hanya fokus pada:
- Daftar kursus yang diampu instruktur
- Informasi singkat per kursus
- Akses cepat ke halaman kelola kursus

====================================================================
3. HALAMAN DETAIL KURSUS / COURSE OVERVIEW
====================================================================

Setelah instruktur klik tombol "Kelola" pada salah satu card kursus, halaman pertama yang tampil adalah:

"Ringkasan Kursus" / "Course Overview"

Route contoh:
`/instructor/courses/{courseId}`

Halaman ini menjadi halaman awal Course Workspace.

Bagian atas halaman harus menggunakan style header yang sama seperti halaman sebelumnya.

Header detail kursus berisi:
- Nama kursus
- Kode kursus / kode kelas
- Status kursus
- Informasi ringkas seperti jumlah mahasiswa dan jumlah modul
- Tombol atau aksi untuk edit informasi kursus

Pada halaman Ringkasan Kursus, instruktur harus bisa melihat dan mengedit informasi dasar kursus.

Informasi kursus yang bisa diedit:
- Nama kursus
- Kode kursus
- Kode kelas
- Deskripsi kursus
- Status kursus
- Semester/periode jika field tersedia

Jika sudah ada form edit kursus, gunakan form yang sudah ada.
Jika belum ada, buat UI edit sederhana menggunakan modal, drawer, atau halaman edit sesuai pola project.

====================================================================
4. NAVIGASI DI DALAM DETAIL KURSUS
====================================================================

Di halaman detail kursus, tampilkan navigasi/tab/menu Course Workspace dengan item berikut:

- Ringkasan
- Struktur Kurikulum
- Tugas
- Kuis
- Diskusi
- Peserta
- Nilai
- Progres
- Pengaturan

Catatan penting:
- Menu "Struktur Kurikulum" adalah builder kursus.
- Struktur Kurikulum harus menggunakan isi dan logic yang sudah ada saat ini.
- Jangan rusak fitur builder kursus yang sudah berjalan.
- Menu lain seperti Tugas, Kuis, Diskusi, Peserta, Nilai, Progres, dan Pengaturan untuk saat ini cukup dibuatkan menu/halaman placeholder terlebih dahulu jika belum tersedia.
- Yang penting navigasi course workspace sudah terbentuk dan bisa dikembangkan nanti.

Contoh struktur navigasi:

Ringkasan | Struktur Kurikulum | Tugas | Kuis | Diskusi | Peserta | Nilai | Progres | Pengaturan

Atau jika project memakai sidebar/tab vertikal, ikuti pola UI yang paling konsisten dengan project saat ini.

====================================================================
5. ISI HALAMAN RINGKASAN KURSUS
====================================================================

Halaman Ringkasan Kursus minimal berisi:

1. Header informasi kursus
2. Tombol edit informasi kursus
3. Ringkasan lokal kursus
4. Akses cepat ke Struktur Kurikulum

Ringkasan lokal kursus boleh menampilkan:
- Jumlah mahasiswa
- Jumlah modul
- Jumlah tugas/quiz
- Jumlah item perlu dinilai
- Status publish kursus

Jangan tampilkan data global lintas kursus di halaman ini. Semua statistik di halaman ini harus spesifik untuk kursus yang sedang dibuka.

Tambahkan tombol utama:
"Lihat Struktur Kurikulum" atau "Kelola Struktur Kurikulum"

Tombol ini mengarah ke:
`/instructor/courses/{courseId}/curriculum`

====================================================================
6. STRUKTUR KURIKULUM
====================================================================

Menu "Struktur Kurikulum" harus menjadi halaman builder kursus.

Gunakan fitur builder yang sudah ada saat ini, yaitu halaman yang menampilkan struktur:

Course
→ Modul
→ Materi
→ Konten
→ Quiz
→ Tugas

Ketentuan:
- Jangan ubah logic utama builder jika sudah berjalan
- Pindahkan/letakkan builder tersebut agar berada di dalam Course Workspace
- Pastikan route-nya berada di bawah detail kursus instruktur

Contoh route:
`/instructor/courses/{courseId}/curriculum`

Di halaman ini, instruktur tetap bisa:
- Melihat daftar modul
- Menambah modul
- Mengedit modul
- Mengelola materi
- Mengelola konten
- Menambahkan quiz pada modul
- Menambahkan tugas pada modul
- Publish/unpublish item jika fitur sudah tersedia

====================================================================
7. PLACEHOLDER UNTUK MENU LAIN
====================================================================

Untuk menu berikut, buat halaman placeholder sederhana terlebih dahulu jika belum ada implementasinya:

- Tugas
- Kuis
- Diskusi
- Peserta
- Nilai
- Progres
- Pengaturan

Setiap placeholder cukup menampilkan:
- Judul halaman
- Deskripsi singkat
- Informasi bahwa fitur akan dikembangkan

Contoh:
Halaman Tugas:
Judul: "Tugas"
Deskripsi: "Kelola semua tugas pada kursus ini."

Halaman Kuis:
Judul: "Kuis"
Deskripsi: "Kelola semua kuis pada kursus ini."

Halaman Diskusi:
Judul: "Diskusi"
Deskripsi: "Kelola forum dan diskusi pada kursus ini."

Halaman Peserta:
Judul: "Peserta"
Deskripsi: "Lihat dan kelola peserta pada kursus ini."

Halaman Nilai:
Judul: "Nilai"
Deskripsi: "Kelola nilai dan rekap penilaian kursus ini."

Halaman Progres:
Judul: "Progres"
Deskripsi: "Pantau perkembangan belajar mahasiswa pada kursus ini."

Halaman Pengaturan:
Judul: "Pengaturan"
Deskripsi: "Atur konfigurasi kursus ini."

====================================================================
8. ROUTE YANG DIHARAPKAN
====================================================================

Gunakan struktur route seperti berikut, atau sesuaikan dengan struktur routing project saat ini:

Daftar kursus:
`/instructor/courses`

Detail / Ringkasan kursus:
`/instructor/courses/{courseId}`

Struktur Kurikulum:
`/instructor/courses/{courseId}/curriculum`

Tugas:
`/instructor/courses/{courseId}/assignments`

Kuis:
`/instructor/courses/{courseId}/quizzes`

Diskusi:
`/instructor/courses/{courseId}/discussions`

Peserta:
`/instructor/courses/{courseId}/students`

Nilai:
`/instructor/courses/{courseId}/grades`

Progres:
`/instructor/courses/{courseId}/progress`

Pengaturan:
`/instructor/courses/{courseId}/settings`

====================================================================
9. KRITERIA SELESAI
====================================================================

Perubahan dianggap selesai jika:

1. Halaman `/instructor/courses` tampil dalam bentuk card, bukan tabel.
2. Card kursus memiliki informasi:
   - Nama kursus
   - Kode/kode kelas
   - Status
   - Jumlah mahasiswa
   - Progress atau jumlah modul
   - Perlu dinilai
   - Tombol Kelola
3. Ada tombol "+ Tambah Kursus" pada halaman daftar kursus.
4. Klik tombol "Kelola" membuka halaman detail kursus.
5. Halaman detail kursus pertama yang tampil adalah "Ringkasan Kursus".
6. Ringkasan Kursus memiliki header dengan style konsisten dan bisa mengedit informasi kursus.
7. Course Workspace memiliki menu:
   - Ringkasan
   - Struktur Kurikulum
   - Tugas
   - Kuis
   - Diskusi
   - Peserta
   - Nilai
   - Progres
   - Pengaturan
8. Struktur Kurikulum tetap menggunakan builder kursus yang sudah ada.
9. Menu selain Struktur Kurikulum minimal memiliki halaman placeholder.
10. UI tetap konsisten dengan student UI dan style project yang sudah ada.