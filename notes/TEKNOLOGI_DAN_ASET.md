# Teknologi, Program, dan Aset yang Digunakan
## Project Linimasa — Dokumentasi Teknis Lengkap

---

## 1. Bahasa Pemrograman

| Bahasa | Digunakan Untuk |
|---|---|
| **JavaScript (ES2022+)** | Bahasa pemrograman utama untuk seluruh logika aplikasi, UI, game, dan animasi |
| **JSX** | Ekstensi sintaks JavaScript untuk menulis struktur UI seperti HTML di dalam kode React |
| **CSS3** | Styling, animasi, layout, dan desain responsif seluruh antarmuka |
| **HTML5** | Struktur dasar halaman web (file `index.html`) |
| **JSON** | Format data konfigurasi (Capacitor, package manager, dll.) |

---

## 2. Framework & Library Utama

### Frontend Framework
| Library | Versi | Kegunaan |
|---|---|---|
| **React** | v19.2.5 | Framework utama untuk membangun antarmuka pengguna berbasis komponen |
| **React DOM** | v19.2.5 | Menghubungkan React dengan DOM (tampilan di browser) |

### Build Tool & Dev Server
| Tool | Versi | Kegunaan |
|---|---|---|
| **Vite** | v8.0.10 | Build tool modern yang sangat cepat, menggantikan Webpack. Digunakan untuk proses development (Hot Module Replacement / HMR) dan build produksi |
| **@vitejs/plugin-react** | v6.0.1 | Plugin Vite untuk mengaktifkan dukungan JSX dan React Fast Refresh |

### State Management (Manajemen Status/Data)
| Library | Versi | Kegunaan |
|---|---|---|
| **Zustand** | v5.0.12 | Library manajemen state yang ringan dan modern. Digunakan untuk menyimpan seluruh data game (posisi pemain, fase permainan, inventori, dll.) secara global dan reaktif |

### 3D & Animasi
| Library | Versi | Kegunaan |
|---|---|---|
| **Three.js** | v0.184.0 | Library JavaScript untuk rendering grafis 3D di web. Digunakan secara internal oleh React Three Fiber |
| **@react-three/fiber** | v9.6.0 | Wrapper React untuk Three.js. Memungkinkan pembuatan scene 3D menggunakan sintaks JSX |
| **@react-three/drei** | v10.7.7 | Kumpulan helper dan komponen siap pakai untuk React Three Fiber (kamera, kontrol, shader, dll.) |
| **Framer Motion** | v12.38.0 | Library animasi premium untuk React. Digunakan untuk transisi halaman, animasi UI, dan efek micro-interaction |

### Ikon
| Library | Versi | Kegunaan |
|---|---|---|
| **Lucide React** | v1.12.0 | Kumpulan lebih dari 1000 ikon SVG yang bersih dan konsisten. Digunakan di seluruh tombol dan elemen UI (Settings, Dices, Briefcase, MapPin, dll.) |

---

## 3. Platform & Deployment

### Build untuk Android
| Teknologi | Versi | Kegunaan |
|---|---|---|
| **Capacitor Core** | v8.3.1 | Bridge (jembatan) yang mengubah aplikasi web (HTML/CSS/JS) menjadi aplikasi mobile native yang bisa berjalan di Android dan iOS |
| **Capacitor Android** | v8.3.1 | Plugin khusus untuk platform Android |
| **Capacitor CLI** | v8.3.1 | Alat command-line untuk mengelola build dan sinkronisasi proyek Capacitor |

> Dengan Capacitor, aplikasi yang sama bisa di-build menjadi:
> - **Website** (diakses lewat browser PC/HP)
> - **Aplikasi Android APK** (diinstal langsung di ponsel)

---

## 4. Tools Pengembangan (Developer Tools)

| Tool | Versi | Kegunaan |
|---|---|---|
| **ESLint** | v10.2.1 | Alat untuk menganalisis kode dan mendeteksi kesalahan penulisan kode (linting) secara otomatis |
| **eslint-plugin-react-hooks** | v7.1.1 | Plugin ESLint khusus untuk memastikan aturan React Hooks dipatuhi |
| **eslint-plugin-react-refresh** | v0.5.2 | Plugin ESLint untuk kompatibilitas dengan Hot Module Replacement Vite |
| **@types/react & @types/react-dom** | v19.x | Definisi tipe TypeScript untuk React (untuk autocomplete dan pengecekan di editor) |
| **Node.js & npm** | (runtime) | Runtime JavaScript di server/lokal dan package manager untuk menginstal semua library |
| **Git** | (runtime) | Version control untuk melacak perubahan kode (konfigurasi ada di `.gitignore`) |

---

## 5. Tipografi (Font)

| Font | Sumber | Digunakan Untuk |
|---|---|---|
| **Outfit** (400, 700, 900) | Google Fonts | Font utama seluruh aplikasi. Dipakai untuk semua teks mulai dari judul, isi konten, hingga label tombol. Memberikan kesan modern, bersih, dan mudah dibaca |

Font diimpor melalui Google Fonts CDN di file `index.html`.

---

## 6. Desain & Sistem Visual

### Sistem Warna (CSS Variables)
Seluruh warna didefinisikan sebagai CSS Custom Properties di `src/styles/global.css`:

| Token | Warna | Digunakan Untuk |
|---|---|---|
| `--primary-color` | `#ff9600` (Oranye) | Warna aksen utama, tombol utama |
| `--secondary-color` | `#1cb0f6` (Biru Langit) | Tombol sekunder, elemen interaktif |
| `--accent-color` | `#58cc02` (Hijau) | Tombol aksi positif (misalnya "Putar Dadu") |
| `--background-color` | `#faf9f6` (Krem) | Latar belakang halaman utama (mode terang) |
| `--text-color` | `#4b4b4b` (Abu Gelap) | Warna teks utama |

### Tema Gelap & Terang
Aplikasi mendukung dua tema: **Dark Mode** dan **Light Mode**, yang dikendalikan melalui atribut `data-theme='dark'` pada elemen `html`.

### Perspektif & Proyeksi 3D Isometrik
Board game menggunakan transformasi CSS 3D murni:
- `rotateX(55deg)` + `rotateZ(45deg)` untuk efek tampilan isometrik
- `perspective: 1200px` untuk kedalaman visual 3D

---

## 7. Arsitektur Kode

### Pola yang Digunakan
| Pola | Digunakan Untuk |
|---|---|
| **Component-Based Architecture** | Setiap elemen UI adalah komponen React yang terpisah dan bisa digunakan ulang |
| **Feature-Based Folder Structure** | Kode diorganisir per fitur (`/auth`, `/game`, `/story`, `/quiz`, `/shop`) |
| **Custom Hooks** | Logika yang bisa digunakan ulang (misalnya `useRegisterRightPanel`) dipisahkan ke dalam custom hooks |
| **Store Pattern (Zustand)** | Semua state game dan aplikasi dikelola secara global dan reaktif |
| **Separation of Concerns** | Logika game (`tileHandlers.js`, `soundEngine.js`) dipisahkan dari komponen UI |

### Struktur Folder Utama
```
src/
├── assets/           → Semua aset statis (gambar, audio)
├── components/       → Komponen UI yang bisa digunakan di seluruh aplikasi
├── data/             → Data statis (cerita, kuis, toko)
├── features/         → Fitur-fitur aplikasi (auth, game, story, quiz, settings, shop)
├── hooks/            → Custom React Hooks
├── pages/            → Halaman-halaman utama
├── store/            → Manajemen state global (Zustand stores)
├── styles/           → File CSS global
└── utils/            → Fungsi-fungsi utilitas
```

---

## 8. Aset Visual (Gambar)

### Gambar Papan Game (Tile Icons)
Terletak di `src/assets/game/tiles/`:

| File | Kegunaan |
|---|---|
| `background.png` | Gambar latar belakang peta utama permainan (6 MB, resolusi tinggi) |
| `jebakan.png` | Ikon untuk petak Jebakan |
| `jejak.png` | Ikon untuk petak Jejak Masa Lalu (kartu acara) |
| `kartu.png` | Ikon untuk petak Kartu Aksi |
| `penjaga.png` | Ikon untuk petak Penjaga |
| `peti.png` | Ikon untuk petak Peti Harta |
| `markas_p1.png` | Ikon Markas untuk Pemain 1 |
| `markas_p2.png` | Ikon Markas untuk Pemain 2 |
| `markas_p3.png` | Ikon Markas untuk Pemain 3 |
| `markas_p4.png` | Ikon Markas untuk Pemain 4 |

### Gambar UI & Latar Belakang
Terletak di `src/assets/UI BG/`:

| File | Kegunaan |
|---|---|
| `path story raden dewi.png` | Gambar latar untuk jalur cerita Raden Dewi Sartika (5.7 MB) |

### Gambar Umum
Terletak di `src/assets/`:

| File | Kegunaan |
|---|---|
| `hero.png` | Gambar hero/banner di halaman beranda |

---

## 9. Aset Audio (Suara)

### Musik Latar (Background Music)
Terletak di `src/assets/game/music/`:

| File | Kegunaan |
|---|---|
| `adventure_theme.mp3` | Musik latar utama yang diputar selama permainan berlangsung |

### Efek Suara Permainan (SFX)
Terletak di `src/assets/game/sfx/`:

| File | Kegunaan |
|---|---|
| `move.mp3` | Suara saat pion pemain berpindah petak |
| `land.mp3` | Suara saat pion mendarat di petak tujuan |
| `event_open.mp3` | Suara saat kartu/modal event terbuka |
| `win.mp3` | Suara kemenangan |
| `lose.mp3` | Suara kekalahan |
| `attack.wav` | Suara serangan dalam Tantangan Penjaga |
| `card_get.wav` | Suara saat mendapatkan kartu baru |
| `card_use.wav` | Suara saat menggunakan kartu aksi |
| `turn_start.mp3` | Suara penanda pergantian giliran |
| `button.mp3` | Suara saat menekan tombol di UI |

### Suara Dadu (Dice Voice)
Terletak di `src/assets/audio/dice/`:

| File | Kegunaan |
|---|---|
| `rolling dice.mp3` | Suara dadu sedang dikocok/diputar |
| `satu.mp3` | Suara pengucapan angka "1" |
| `dua.mp3` | Suara pengucapan angka "2" |
| `tiga.mp3` | Suara pengucapan angka "3" |
| `empat.mp3` | Suara pengucapan angka "4" |
| `lima.mp3` | Suara pengucapan angka "5" |
| `enam.mp3` | Suara pengucapan angka "6" |

### Efek Suara Umum
Terletak di `src/assets/audio/`:

| File | Kegunaan |
|---|---|
| `chest open.wav` | Suara peti harta terbuka |
| `click.wav` | Suara klik tombol umum |
| `success.mp3` | Suara berhasil/sukses |
| `whoosh.mp3` | Suara efek pergerakan cepat |
| `error.wav` | Suara kesalahan |

---

## 10. Data Konten Aplikasi

### Konten Cerita (Visual Novel)
Terletak di `src/data/story/`:

| Konten | Deskripsi |
|---|---|
| `dewi-sartika/chapter1.js` | Konten cerita / dialog interaktif untuk kisah pahlawan nasional **R.A. Dewi Sartika** |
| `storyRegistry.js` | Daftar/registri semua cerita yang tersedia dalam aplikasi |

### Konten Kuis
Terletak di `src/data/`:

| File | Deskripsi |
|---|---|
| `quizData.js` | Data soal-soal kuis |
| `quizQuestions.js` | Data pertanyaan untuk mode kuis |

### Data Game
Terletak di `src/features/game/jelajah-nusantara/data/`:

| File | Deskripsi |
|---|---|
| `cards.js` | Database 14+ kartu aksi (Bekal Perjalanan, Ojek Online, Kopi Luwak, dll.) |
| `gameConfig.js` | Konfigurasi global game (jumlah langkah, delay AI, target kemenangan, dll.) |
| `duelData.js` | Data tema-tema untuk sistem Laga Cendekia (duel antar pemain) |
| `maps/` | Data peta-peta yang tersedia untuk dimainkan |

---

## 11. Program & Software Pendukung (untuk Pengembang)

| Software | Kegunaan |
|---|---|
| **Visual Studio Code** (disarankan) | Editor kode utama untuk menulis dan mengelola seluruh kode proyek |
| **Node.js (v18+)** | Runtime yang diperlukan untuk menjalankan Vite, npm, dan semua tooling |
| **npm (Node Package Manager)** | Untuk menginstal dan mengelola semua library (`npm install`) |
| **Android Studio** | IDE dari Google yang diperlukan untuk build APK Android menggunakan Capacitor |
| **Java JDK (v17+)** | Diperlukan oleh Android Studio untuk proses kompilasi kode Android |
| **Android SDK** | Toolkit resmi Android untuk build dan testing APK |
| **Web Browser** (Chrome/Firefox) | Untuk testing dan debugging aplikasi versi web |
| **Chrome DevTools** | Alat inspeksi browser untuk debugging CSS, JavaScript, dan performa |

---

## 12. Ringkasan Stack Teknologi

```
┌─────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                │
│   React 19 + JSX   │   CSS3   │   Framer Motion    │
│   Lucide Icons     │   Google Fonts (Outfit)        │
├─────────────────────────────────────────────────────┤
│                     3D LAYER                        │
│   Three.js   │   React Three Fiber   │   Drei      │
│   CSS 3D Transforms (Isometric Board)               │
├─────────────────────────────────────────────────────┤
│                   STATE LAYER                       │
│               Zustand v5 (Global Store)             │
├─────────────────────────────────────────────────────┤
│                    BUILD LAYER                      │
│       Vite v8   │   @vitejs/plugin-react            │
│       Rollup (bundler)   │   ESLint                 │
├─────────────────────────────────────────────────────┤
│                  PLATFORM LAYER                     │
│   Web Browser (PC)   │   Capacitor → Android APK   │
└─────────────────────────────────────────────────────┘
```
