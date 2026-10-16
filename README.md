# Qurrotul A'ini — Personal Portfolio

Portfolio berbasis **Next.js App Router, TypeScript, Tailwind CSS, Motion, dan Lucide React**. Desain mengadaptasi HTML `portfolio_misela_paul_v2.html`: gradasi biru lembut, navbar kaca, portrait inline, dan tipografi editorial. Font: **Plus Jakarta Sans + Instrument Serif**, di-host melalui `next/font`.

## Menjalankan project

Gunakan Node.js **20.9 atau lebih baru** (direkomendasikan Node.js 24 LTS).

```sh
npm ci
npm run dev
```

Buka alamat Local yang ditampilkan terminal, biasanya <http://localhost:3000>.

```sh
npm run typecheck
npm run build
npm start
```

Build pertama membutuhkan koneksi internet untuk mengunduh Google Fonts. Setelah build, font dilayani dari aplikasi sendiri.

## Struktur

```text
src/
  app/                  # Root layout, metadata, halaman, dan CSS global
  components/
    layout/             # Navbar responsive + Footer
    sections/           # Hero, About, Experience, Projects, Skills, Contact
    ui/                 # PortraitCard + SectionHeading
    animations/         # Reveal
  data/
    profile.ts          # Nama, profesi, email, foto, dan tautan opsional
    projects.ts         # Daftar proyek + isi detail
    experience.ts       # Timeline pendidikan / pengalaman
    skills.ts           # Kelompok teknologi
  lib/utils.ts          # Helper penggabungan class Tailwind
public/
  images/               # Portrait placeholder + ilustrasi preview proyek
  icon.svg
```

## Personalisasi konten

- Edit `src/data/profile.ts` untuk identitas, email, GitHub, LinkedIn, URL website, dan résumé. `shortName` digunakan di navbar dan hero; `name` untuk nama lengkap.
- Ganti portrait ilustrasi dengan foto sendiri, misalnya `public/images/portrait.jpg`, lalu ubah `portrait` dan `portraitAlt`. Foto raster menggunakan optimasi `next/image`.
- Tambahkan CV asli sebagai `public/resume.pdf`, lalu set `resume: "/resume.pdf"`. Tombol unduh hanya muncul ketika path diisi. File PDF contoh tidak dibuat.
- Isi `siteUrl` dengan domain produksi untuk metadata URL. Ubah `public/icon.svg` jika ingin mengganti monogram.
- Isi proyek asli di `src/data/projects.ts`. **Notes Studio adalah contoh konsep visual**, bukan aplikasi yang sudah dibangun. Tautan proyek hanya muncul jika `href` tersedia.
- Tambahkan universitas, tahun, dan pengalaman yang benar di `src/data/experience.ts`. Konten awal hanya menyatakan profesi yang diberikan: Informatics Student.
- `skills.ts` menjelaskan teknologi website ini; sesuaikan menjadi keahlian pribadi setelah dikonfirmasi.
- Teks narasi ada di masing-masing komponen section; warna, spacing, dan interaksi visual ada di `globals.css`.

## Interaksi & aksesibilitas

- Portrait miring **6° → −5°** saat hover dengan CSS, tanpa zoom atau animasi berulang.
- Navbar menggunakan CSS `backdrop-filter`; menu mobile mendukung Escape dan menutup setelah memilih tautan.
- Motion digunakan untuk text entrance dan scroll reveal `whileInView`, sekali per elemen.
- CSS menangani hover tombol, gradasi, dan smooth scroll.
- `prefers-reduced-motion` menonaktifkan transisi dan reveal; konten server tetap terbaca saat JavaScript dimatikan.
- Filter proyek bekerja berdasarkan kategori; detail proyek memakai disclosure HTML native yang dapat dioperasikan dengan keyboard.
- Contact mengarah ke email melalui `mailto:`. Belum ada backend, database, atau form pengiriman email.
- Kontrol editor pada HTML referensi adalah fitur preview dan tidak disertakan dalam halaman portfolio publik. Personalisasi dilakukan melalui file data.

## Deploy ke Vercel

1. Push repository ke GitHub.
2. Import repository melalui **Vercel → Add New → Project**.
3. Gunakan framework preset **Next.js**, root directory repository ini, dan pengaturan build default (`npm run build`).
4. Deploy. Vercel dapat membuat preview deployment untuk pull request berikutnya.

Tidak memerlukan environment variable untuk versi ini. Project disiapkan untuk Vercel; deployment belum dilakukan dari workspace ini.

Referensi implementasi: [Next.js App Router](https://nextjs.org/docs/app/getting-started/installation), [Tailwind CSS dengan PostCSS](https://tailwindcss.com/docs/installation/using-postcss), [Motion for React](https://motion.dev/docs/react).
