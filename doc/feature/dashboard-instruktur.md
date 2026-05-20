Untuk **dashboard instruktur**, isinya sebaiknya bukan sekadar daftar menu, tetapi **ringkasan kerja harian instruktur**: kelas apa yang diampu, tugas mana yang perlu dinilai, mahasiswa mana yang tertinggal, dan aktivitas apa yang perlu ditindaklanjuti.

Struktur dashboard yang saya sarankan:

## 1. Header ringkas

Bagian paling atas:

```text
Assalamu’alaikum, Ustadz/Dosen Dika
Semester Ganjil 2026/2027
Hari ini: 3 kelas aktif, 12 tugas perlu dinilai, 5 mahasiswa butuh perhatian
```

Bisa juga ditambah tombol cepat:

```text
+ Buat Materi
+ Buat Tugas
+ Buat Kuis
+ Buat Pengumuman
```

Tujuannya: instruktur langsung tahu kondisi kelasnya tanpa masuk satu-satu.

---

## 2. Statistik utama

Gunakan card statistik kecil.

| Card                | Isi                                      |
| ------------------- | ---------------------------------------- |
| Kelas Aktif         | Jumlah kelas yang sedang diampu          |
| Mahasiswa Aktif     | Total mahasiswa dari semua kelas         |
| Tugas Perlu Dinilai | Submission yang belum dikoreksi          |
| Kuis Berjalan       | Kuis yang sedang aktif                   |
| Materi Draft        | Materi yang belum dipublish              |
| Mahasiswa Berisiko  | Mahasiswa yang jarang aktif/belum submit |

Contoh:

```text
Kelas Aktif: 4
Mahasiswa: 128
Perlu Dinilai: 37
Deadline Minggu Ini: 6
Mahasiswa Berisiko: 9
```

Card yang paling penting menurut saya adalah:

```text
Tugas Perlu Dinilai
Mahasiswa Berisiko
Deadline Minggu Ini
```

Karena dashboard harus membantu instruktur menentukan prioritas.

---

## 3. Daftar kelas yang diampu

Bagian ini menampilkan course card.

Contoh card:

```text
Ulumul Qur’an
Kelas: PAI 3A
Mahasiswa: 34
Progress rata-rata: 72%
Tugas belum dinilai: 8
Pertemuan aktif: Makkiyah dan Madaniyah
[Kelola Kelas]
```

Data yang perlu tampil:

| Elemen              | Fungsi                     |
| ------------------- | -------------------------- |
| Nama mata kuliah    | Identitas kelas            |
| Kelas/semester      | Misalnya PAI 3A            |
| Jumlah mahasiswa    | Ringkasan peserta          |
| Progress rata-rata  | Gambaran pembelajaran      |
| Tugas belum dinilai | Prioritas instruktur       |
| Pertemuan aktif     | Modul yang sedang berjalan |
| Tombol kelola       | Masuk ke detail kelas      |

Untuk visual LMS, card kelas bisa dibuat seperti ini:

```text
------------------------------------------------
Ulumul Qur’an
PAI 3A · Semester 3

Progress kelas        72%
Mahasiswa aktif       29/34
Belum submit tugas    5
Perlu dinilai         8

[Materi] [Tugas] [Nilai]
------------------------------------------------
```

---

## 4. Panel tugas perlu dinilai

Ini wajib ada.

Instruktur biasanya tidak ingin mencari manual tugas mana yang belum dikoreksi. Dashboard harus langsung menampilkan antrean koreksi.

Contoh:

| Tugas                          | Kelas          |       Submission | Deadline | Aksi   |
| ------------------------------ | -------------- | ---------------: | -------- | ------ |
| Resume Kitab Ta’lim Muta’allim | Akhlak Tasawuf | 18 belum dinilai | 22 Mei   | Nilai  |
| Analisis QS. Al-Baqarah: 183   | Tafsir Tarbawi |  9 belum dinilai | 24 Mei   | Nilai  |
| Kuis Hadis Shahih              | Ulumul Hadis   |  3 review manual | 25 Mei   | Review |

Untuk assignment essay, tampilkan:

```text
Belum dinilai
Terlambat
Sudah diberi feedback
Perlu revisi
```

---

## 5. Deadline dan agenda minggu ini

Panel ini membantu instruktur melihat jadwal.

Isi yang bisa ditampilkan:

| Jenis agenda            | Contoh                                  |
| ----------------------- | --------------------------------------- |
| Deadline tugas          | Tugas resume ditutup Jumat              |
| Jadwal kuis             | Kuis Fikih Bab Thaharah dibuka Rabu     |
| Jadwal pertemuan        | Pertemuan 7: Diskusi Makkiyah-Madaniyah |
| Jadwal setoran          | Setoran hafalan QS. Al-Mulk ayat 1–5    |
| Jadwal publikasi materi | Materi “Qiyas” publish Senin            |

Contoh tampilan:

```text
Agenda Minggu Ini
- Senin: Publish materi Fikih Muamalah
- Rabu: Kuis Ulumul Hadis dibuka
- Jumat: Deadline tugas Tafsir Tarbawi
- Sabtu: Setoran hafalan Hadis Arbain #1
```

---

## 6. Monitoring mahasiswa berisiko

Ini fitur penting untuk LMS modern.

Mahasiswa berisiko bisa dihitung dari:

```text
- Tidak login beberapa hari
- Belum membuka materi
- Belum submit tugas
- Nilai kuis rendah
- Sering terlambat submit
- Tidak aktif di forum
```

Contoh panel:

| Mahasiswa | Kelas         | Masalah              | Aksi          |
| --------- | ------------- | -------------------- | ------------- |
| Ahmad F.  | Ulumul Qur’an | 3 tugas belum submit | Kirim pesan   |
| Siti N.   | Fikih         | Nilai kuis < 60      | Lihat progres |
| Rafi A.   | Hadis         | Tidak login 10 hari  | Hubungi       |

Tampilan singkatnya:

```text
Mahasiswa Butuh Perhatian
Ahmad F. — 3 tugas belum submit
Siti N. — nilai kuis rendah
Rafi A. — tidak aktif 10 hari
```

Ini bagus untuk dosen karena dashboard tidak hanya menampilkan data, tapi membantu mengambil tindakan.

---

## 7. Aktivitas terbaru kelas

Panel ini seperti feed.

Contoh:

```text
Aktivitas Terbaru
- 12 mahasiswa mengumpulkan tugas Resume Ulumul Qur’an
- 4 komentar baru di forum “Hukum Qiyas”
- Materi “Adab Menuntut Ilmu” telah dipublish
- Kuis “Hadis Shahih dan Hasan” selesai dikerjakan 28 mahasiswa
```

Aktivitas terbaru berguna agar instruktur merasa sistemnya “hidup”.

---

## 8. Pengumuman dan pesan

Dashboard sebaiknya menampilkan:

```text
Pengumuman terakhir
Pesan mahasiswa yang belum dibalas
Komentar forum yang perlu moderasi
```

Contoh:

| Item                       | Jumlah |
| -------------------------- | -----: |
| Pesan belum dibaca         |      5 |
| Komentar forum baru        |     14 |
| Komentar menunggu moderasi |      2 |

Kalau LMS Islamic ingin menjaga adab diskusi, panel moderasi komentar penting.

---

## 9. Ringkasan performa kelas

Ini untuk analitik sederhana.

Contoh:

```text
Rata-rata nilai kuis minggu ini: 78
Tingkat penyelesaian materi: 72%
Submission tepat waktu: 84%
Partisipasi forum: 56%
```

Bisa ditampilkan dalam chart kecil:

| Metrik            | Fungsi                                   |
| ----------------- | ---------------------------------------- |
| Progress materi   | Seberapa jauh mahasiswa mengikuti materi |
| Rata-rata nilai   | Kualitas pemahaman                       |
| Ketepatan submit  | Disiplin kelas                           |
| Aktivitas diskusi | Keterlibatan mahasiswa                   |

Untuk tahap awal, tidak perlu terlalu kompleks. Cukup 3–4 angka penting.

---

## 10. Widget khusus Islamic LMS

Agar dashboard terasa berbeda dari LMS biasa, tambahkan widget Islamic yang relevan.

### A. Setoran hafalan/tilawah

```text
Setoran Menunggu Review
- QS. Al-Mulk 1–5: 12 audio
- Hadis Arbain #1: 7 video
- Doa harian: 5 audio
```

### B. Materi perlu validasi

Jika ada reviewer materi Islamic:

```text
Materi Perlu Validasi
- Hadis tentang niat — belum ada derajat hadis
- Kutipan Tafsir Jalalain — perlu sumber halaman
- Materi Qiyas — menunggu review
```

### C. Ayat/hadis pekan ini

```text
Ayat Pekan Ini
QS. Al-Mujadilah: 11
Tema: Keutamaan Ilmu
```

Ini bukan fitur utama, tapi bagus untuk identitas Islamic LMS.

---

## 11. Susunan layout dashboard yang saya rekomendasikan

Versi desktop:

```text
-------------------------------------------------------
Header:
Assalamu’alaikum, Dosen
[+ Materi] [+ Tugas] [+ Kuis] [+ Pengumuman]

-------------------------------------------------------
Stats Cards:
Kelas Aktif | Mahasiswa | Perlu Dinilai | Deadline | Mahasiswa Berisiko

-------------------------------------------------------
Main Content:
Kiri:
- Kelas Saya
- Tugas Perlu Dinilai
- Aktivitas Terbaru

Kanan:
- Agenda Minggu Ini
- Mahasiswa Butuh Perhatian
- Setoran Hafalan
- Pengumuman/Pesan

-------------------------------------------------------
Bottom:
- Ringkasan Performa Kelas
- Materi Draft / Perlu Validasi
-------------------------------------------------------
```

Versi lebih konkret:

```text
Dashboard Instruktur

[4 Kelas Aktif] [128 Mahasiswa] [37 Perlu Dinilai] [6 Deadline] [9 Berisiko]

Kelas Saya
- Ulumul Qur’an — Progress 72% — 8 perlu dinilai
- Fikih Muamalah — Progress 65% — 12 perlu dinilai
- Akhlak Tasawuf — Progress 81% — 3 perlu dinilai

Tugas Perlu Dinilai
- Resume Kitab Ta’lim Muta’allim — 18 submission
- Analisis QS. Al-Baqarah: 183 — 9 submission

Agenda Minggu Ini
- Rabu: Kuis Hadis
- Jumat: Deadline Tafsir
- Sabtu: Setoran Hafalan

Mahasiswa Butuh Perhatian
- Ahmad — 3 tugas belum submit
- Siti — nilai kuis rendah
- Rafi — tidak login 10 hari
```

---

## 12. Prioritas MVP dashboard instruktur

Untuk MVP, saya sarankan hanya ini dulu:

| Prioritas      | Komponen                    |
| -------------- | --------------------------- |
| Wajib          | Statistik kelas             |
| Wajib          | Daftar kelas yang diampu    |
| Wajib          | Tugas perlu dinilai         |
| Wajib          | Agenda/deadline             |
| Wajib          | Aktivitas terbaru           |
| Penting        | Mahasiswa berisiko          |
| Penting        | Pengumuman                  |
| Khusus Islamic | Setoran hafalan/tilawah     |
| Khusus Islamic | Materi perlu validasi dalil |

Jangan terlalu banyak chart di awal. Dashboard yang baik adalah yang membuat instruktur tahu:

```text
Saya harus mengajar kelas apa?
Saya harus menilai tugas apa?
Mahasiswa mana yang bermasalah?
Agenda terdekat apa?
Materi mana yang belum siap?
```

## Rekomendasi akhir

Untuk dashboard instruktur LMS Islamic, saya sarankan isi utamanya:

```text
1. Header salam + quick action
2. Statistik ringkas
3. Kelas yang diampu
4. Tugas perlu dinilai
5. Agenda minggu ini
6. Mahasiswa butuh perhatian
7. Aktivitas terbaru
8. Setoran hafalan/tilawah
9. Pengumuman dan pesan
10. Materi draft/perlu validasi
```

Kalau ingin desain yang paling efektif, bagian paling atas jangan diisi dekorasi berlebihan. Isi dengan **aksi dan prioritas kerja instruktur**. Dashboard instruktur harus menjawab: **“Apa yang harus saya lakukan hari ini?”**
