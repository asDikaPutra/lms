# LMS Design Style Guide
Panduan visual untuk antarmuka sistem pembelajaran (LMS) — versi redesign.

---

## Typography

| Role | Font Family | Size | Weight |
|---|---|---|---|
| Hero title | DM Serif Display | 26px | 400 (italic optional) |
| Section title | Plus Jakarta Sans | 18px | 600 |
| Module title | Plus Jakarta Sans | 15px | 600 |
| Activity name | Plus Jakarta Sans | 14px | 500 |
| Body / meta | Plus Jakarta Sans | 12–13px | 400 |
| Label uppercase | Plus Jakarta Sans | 10–11px | 700 |

```html
<!-- Google Fonts import -->
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
```

**Aturan:**
- Heading selalu *sentence case* — tidak pernah ALL CAPS kecuali label tipe kecil (QUIZ, TUGAS, MODUL 1)
- Label uppercase selalu pakai `letter-spacing: 0.07–0.08em`
- Dua font saja: DM Serif Display untuk momen editorial (hero), Plus Jakarta Sans untuk semua UI

---

## Color Palette

### Brand

| Token | Hex | Penggunaan |
|---|---|---|
| Forest Green | `#0B3D2E` | Hero background, avatar, logo, active state |
| Mint Accent | `#5DCAA5` | Progress bar, hero tag label |
| Mint Light | `#E1F5EE` | Badge "Modul", badge "Selesai", accent konten |
| Mint Dark | `#0F6E56` | Teks pada mint light background |

### Semantic — Activity Type

| Tipe | Accent Bar | Label Text | — |
|---|---|---|---|
| Quiz | `#378ADD` (biru) | `#185FA5` | — |
| Tugas | `#EF9F27` (amber) | `#854F0B` | — |
| Konten | `#5DCAA5` (mint) | `#0F6E56` | — |

### Status Badge

| Status | Background | Text |
|---|---|---|
| Selesai | `#E1F5EE` | `#0F6E56` |
| Menunggu | `var(--color-background-primary)` | `var(--color-text-secondary)` |
| — | border: `0.5px solid var(--color-border-tertiary)` | — |

---

## Spacing & Layout

```
Sidebar width   : 60px
Content padding : 28px (horizontal), 24px (top)
Card gap        : 10px (antar modul), 6px (antar activity item)
```

**Border radius:**

| Komponen | Radius |
|---|---|
| Card modul | 14px |
| Hero banner | 16px |
| Activity item | 10px |
| Badge / pill | 20px |
| Module badge (Modul 1) | 6px |
| Sidebar icon active | 10px |
| Logo box | 8px |

**Border:**
- Semua border: `0.5px solid var(--color-border-tertiary)`
- Tidak ada shadow — kedalaman dicapai lewat background bertingkat, bukan drop shadow

---

## Components

### Hero Banner

```css
background: #0B3D2E;
border-radius: 16px;
padding: 28px 32px;
overflow: hidden;
position: relative;
```

- Punya geometric SVG pattern di background dengan `opacity: 0.06`
- Dua kolom: kiri untuk info kursus, kanan untuk progress + CTA
- Progress pill pakai `background: rgba(255,255,255,0.1)` dengan border `rgba(255,255,255,0.2)`

### Module Card

```css
background: var(--color-background-primary);
border: 0.5px solid var(--color-border-tertiary);
border-radius: 14px;
overflow: hidden;
```

- Header dipisahkan dari list dengan `border-bottom: 0.5px solid var(--color-border-tertiary)`
- Header berisi: badge modul + judul + deskripsi di kiri, tombol chevron di kanan
- Tidak ada counter "2 Quiz / 2 Tugas" — terlalu noisy

### Activity Item

```css
display: flex;
align-items: center;
gap: 14px;
padding: 13px 16px;
border-radius: 10px;
border: 0.5px solid var(--color-border-tertiary);
background: var(--color-background-secondary);
```

**Accent bar** (pengganti ikon):
```css
width: 3px;
height: 36px;
border-radius: 2px;
flex-shrink: 0;
/* warna sesuai tipe: #378ADD (quiz) / #EF9F27 (tugas) */
```

Struktur konten activity:
```
[accent bar] [type label] [name] [meta]     [status badge]
```

### Sidebar

```css
width: 60px;
background: var(--color-background-primary);
border-right: 0.5px solid var(--color-border-tertiary);
```

- Logo box: 32×32px, `background: #0B3D2E`, `border-radius: 8px`
- Icon active state: `background: #0B3D2E; color: #fff; border-radius: 10px`
- Settings icon di paling bawah (`margin-top: auto`)

---

## Prinsip Desain

1. **Tidak ada ikon dekoratif di activity item** — gunakan accent bar berwarna sebagai penanda tipe, bukan icon bulat
2. **Tidak ada counter jumlah item** (2 Quiz, 2 Tugas) di header modul — cukup tampilkan kontennya langsung
3. **Dua font saja** — serif untuk editorial, sans untuk UI
4. **Border tipis, tidak ada shadow** — kedalaman lewat background bertingkat (`primary` → `secondary` → `tertiary`)
5. **Warna mengandung makna** — biru = quiz, amber = tugas, mint = konten/selesai. Tidak acak
6. **Label uppercase** hanya untuk metadata kecil: tipe aktivitas, label section, badge modul