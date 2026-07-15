# BAB IV: IMPLEMENTASI DESAIN VISUAL DAN PENGALAMAN PENGGUNA (UI/UX)

Pada bab ini, penulis memaparkan proses implementasi seluruh aset grafis, perancangan antarmuka pengguna (User Interface), perwujudan pengalaman pengguna (User Experience), serta pengujian kenyamanan visual dari aplikasi pembelajaran sejarah interaktif "Project Linimasa". Proses implementasi ini difokuskan pada penerapan identitas visual yang ramah anak, legibilitas tipografi, dan konsistensi komponen antarmuka yang adaptif.

---

## 4.1 Lingkungan Produksi Aset dan Implementasi Desain

Untuk menerjemahkan konsep kreatif menjadi elemen visual digital yang siap guna di dalam aplikasi, penulis menggunakan perangkat pendukung desain sebagai berikut:

### 4.1.1 Perangkat Lunak Desain (Software Tools)
*   **Figma:** Digunakan untuk merancang tata letak *wireframe*, menyusun sistem desain (*design system*), mendesain purwarupa antarmuka (*UI prototyping*), serta mengatur tata letak responsif pada berbagai ukuran layar.
*   **Adobe Illustrator / Inkscape:** Digunakan untuk merancang dan mematangkan ilustrasi vektor, ikon-ikon menu, ubin peta lintasan, serta desain karakter pahlawan dalam format *Scalable Vector Graphics* (SVG).
*   **Visual Studio Code (VS Code):** Digunakan sebagai editor kode teks untuk menyusun struktur kerangka antarmuka menggunakan HTML5/JSX, mengaplikasikan gaya visual menggunakan CSS3 vanilla, serta memprogram efek transisi halaman.

> **Rekomendasi Gambar 4.1:** 
> *Tampilkan tangkapan layar (screenshot) lembar kerja Anda di Figma yang memperlihatkan mockup desain antarmuka aplikasi atau kumpulan aset UI.*
> 
> ```
> +-----------------------------------------------------------------+
> |                                                                 |
> |       [Gambar 4.1: Lembar Kerja Figma Perancangan UI Proyek]     |
> |                                                                 |
> +-----------------------------------------------------------------+
> ```

---

## 4.2 Implementasi Identitas Visual dan Sistem Warna

Sebagai media pembelajaran bagi anak-anak Sekolah Dasar (khususnya kelas 5 dan 6), penentuan skema warna sangat memengaruhi psikologi belajar, fokus, dan ketertarikan visual mereka. Penulis mengimplementasikan sistem warna terpadu yang memadukan kontras tinggi dengan warna-warna pastel hangat agar nyaman dipandang dalam durasi lama.

### 4.2.1 Penerapan Palet Warna Dinamis (Color System)
Saya menetapkan sistem warna berbasis variabel CSS terpusat pada file `global.css` agar warna aplikasi konsisten dan mendukung transisi tema gelap/terang secara mulus:
*   **Kuning Emas (`#f4c365` - Primary):** Melambangkan kemenangan, prestasi, dan semangat belajar. Digunakan sebagai warna tombol aksi utama, bintang penunjuk kuis, dan bingkai koleksi lencana prestasi.
*   **Hijau Aksen (`#58cc02` - Accent Success):** Digunakan untuk merangsang perasaan berhasil atau aman. Diimplementasikan pada tombol konfirmasi positif (seperti "Mulai Giliran"), bilah status jawaban kuis yang benar, serta tombol "Bertahan" pada duel.
*   **Merah Hati (`#FF4B4B` - Accent Danger):** Dipakai untuk memicu fokus/kewaspadaan. Digunakan untuk status stamina Tekad (HP), ikon nyawa yang berkurang, atau notifikasi jawaban kuis yang keliru.
*   **Cokelat Kayu (`#5E3A24` - Frame Border):** Memberikan kesan fisik, retro, dan kokoh. Warna ini digunakan secara konsisten sebagai garis luar (*stroke/border*) pada kartu TCG, gelembung teks dialog, dan tombol 3D agar terlihat seperti mainan fisik/kartu fisik asli.

> **Rekomendasi Gambar 4.2:** 
> *Tampilkan palet warna yang Anda gunakan beserta screenshot implementasinya pada dashboard aplikasi.*
> 
> ```
> +-----------------------------------------------------------------+
> |                                                                 |
> |   [Gambar 4.2: Skema Penerapan Palet Warna dalam Antarmuka]     |
> |                                                                 |
> +-----------------------------------------------------------------+
> ```

---

## 4.3 Implementasi Desain Komponen Antarmuka (UI Design Systems)

Agar aplikasi memiliki alur visual yang seragam, penulis merancang komponen antarmuka modular yang dapat digunakan kembali (*reusable UI components*) pada seluruh modul game (Jelajah Nusantara, Adu Cendekiawan, dan Toko):

### 4.3.1 Tombol Game 3D (Chunky Retro Buttons)
Saya mendesain tombol dengan estetika visual menonjol (3D mainan anak-anak). Tombol ini memiliki garis tepi cokelat tebal dan bayangan bawah (*drop shadow*) tebal untuk memperjelas area interaksi sentuh:
*   **Keadaan Normal:** Tombol dirender dengan ketebalan bayangan bawah sebesar 4 piksel (`box-shadow: 0 4px 0 #4A2E10`).
*   **Keadaan Ditekan (Active State):** Ketika layar disentuh, posisi tombol akan turun sedikit ke bawah menggunakan CSS `transform: translateY(3px)` disertai penyusutan bayangan menjadi 1 piksel (`box-shadow: 0 1px 0 #4A2E10`). Umpan balik visual ini meniru gerakan fisika tombol tekan nyata untuk memberikan kepuasan taktil bagi anak-anak.

> **Rekomendasi Gambar 4.3:** 
> *Tampilkan gambar perbandingan tombol 3D chunky saat kondisi normal vs kondisi tertekan.*
> 
> ```
> +-----------------------------------------------------------------+
> |                                                                 |
> |   [Gambar 4.3: Perbandingan Tombol 3D Chunky (Normal vs Tekan)] |
> |                                                                 |
> +-----------------------------------------------------------------+
> ```

### 4.3.2 Bingkai Kartu TCG Fisik (TCG Physical Cards)
Kartu aksi dalam permainan dirancang agar terasa seperti kartu koleksi fisik premium dengan elemen visual:
*   **Border Kayu Tebal:** Batas luar berwarna cokelat pekat `#5E3A24` setebal 5px dengan kelengkungan sudut (*border-radius*) 20px.
*   **Banner Nama:** Spanduk putih bersih di bagian tengah untuk memperjelas pembacaan nama kartu pahlawan sejarah.
*   **Lencana Biaya:** Badge kapsul putih di pojok kanan atas berisi ikon hati merah (`❤️`) dan angka biaya Tekad.
*   **Boks Efek:** Kotak teks berwarna krem lembut `#FAF4D0` di bagian bawah dengan jenis huruf berukuran kompak agar deskripsi kegunaan kartu terbaca secara terfokus.

> **Rekomendasi Gambar 4.4:** 
> *Tampilkan satu kartu TCG utuh (misalnya kartu "Bekal Perjalanan") dan beri panah keterangan untuk elemen border cokelat, lencana biaya, banner nama, dan kotak efek.*
> 
> ```
> +-----------------------------------------------------------------+
> |                                                                 |
> |       [Gambar 4.4: Anatomi Desain Fisik Kartu Aksi TCG]          |
> |                                                                 |
> +-----------------------------------------------------------------+
> ```

### 4.3.3 Bilah Status Ramping (HUD Pills)
Bilah penunjuk Koin Emas dan Tekad di bagian atas layar didesain menggunakan bentuk kapsul dengan garis luar cokelat tua. Penggunaan lambang emoji koin (`🪙`) dan hati (`❤️`) ukuran proporsional membantu anak-anak mengenali status permainan mereka secara cepat tanpa perlu membaca teks penjelasan.

> **Rekomendasi Gambar 4.5:** 
> *Tampilkan screenshot bilah koin dan stamina (Tekad) di bagian atas layar HUD.*
> 
> ```
> +-----------------------------------------------------------------+
> |                                                                 |
> |       [Gambar 4.5: Visualisasi Bilah Status (HUD Pills)]        |
> |                                                                 |
> +-----------------------------------------------------------------+
> ```

---

## 4.4 Implementasi Desain Karakter dan Ilustrasi Peta

Aset karakter pahlawan (seperti Budi dan karakter AI lainnya) dibuat dalam format grafis vektor berbasis **Scalable Vector Graphics (SVG)**. 

### 4.4.1 Karakter Vektor SVG
Penggunaan format SVG di dalam kode web memastikan ilustrasi karakter tetap tajam secara optimal (tidak pecah/buram) ketika aplikasi dijalankan pada layar komputer desktop beresolusi tinggi maupun layar handphone berkerapatan piksel tinggi (*Retina Display*).

> **Rekomendasi Gambar 4.6:** 
> *Tampilkan gambar karakter Budi atau karakter pendamping dalam versi utuh.*
> 
> ```
> +-----------------------------------------------------------------+
> |                                                                 |
> |       [Gambar 4.6: Desain Karakter Pahlawan Berbasis Vektor]    |
> |                                                                 |
> +-----------------------------------------------------------------+
> ```

### 4.4.2 Peta Lintasan Sejarah Melingkar (Dynamic Path)
Ubin lintasan (*nodes*) dirancang mengikuti garis alur sejarah melingkar untuk memberikan kesan perjalanan linimasa yang progresif. Tiap ubin dihiasi ikon unik yang memperjelas jenis tantangan secara visual (ikon Lampu untuk materi sejarah, ikon Bintang untuk kuis, dan ikon Peti Harta untuk hadiah).

> **Rekomendasi Gambar 4.7:** 
> *Tampilkan screenshot alur peta sejarah meliuk-liuk lengkap dengan ubin materi/kuis.*
> 
> ```
> +-----------------------------------------------------------------+
> |                                                                 |
> |     [Gambar 4.7: Struktur Lintasan Peta Jalur Sejarah 3D]       |
> |                                                                 |
> +-----------------------------------------------------------------+
> ```

---

## 4.5 Penerapan Tipografi dan Keterbacaan (Typography & Legibility)

Tipografi memiliki peran vital sebagai penyampai informasi sejarah dalam aplikasi ini agar anak-anak tidak jenuh saat membaca materi pelajaran:
*   **Jenis Huruf (Font Family):** Saya menggunakan jenis huruf **Outfit** dan **Inter** dari Google Fonts. Karakteristik huruf sans-serif ini memiliki lekukan geometris bulat yang modern, ramah anak, serta memiliki ruang keterbacaan yang sangat baik pada ukuran kecil (*legibility*).
*   **Kontras Teks:** Warna tulisan utama diatur menggunakan warna abu-abu gelap `#4b4b4b` di atas latar belakang krem/putih terang untuk mengurangi kelelahan mata anak-anak akibat kontras warna hitam-putih murni yang terlalu tajam.
*   **Hirarki Visual:** Ukuran teks dibedakan secara tegas antara Judul Utama (1.25rem - bold), Nama Kartu/Sub-judul (0.85rem - extra bold), dan Paragraf/Deskripsi (0.7rem - medium).

> **Rekomendasi Gambar 4.8:** 
> *Tampilkan gambar contoh tulisan kuis atau dialog sejarah yang memperlihatkan perbedaan ukuran font untuk judul, pertanyaan, dan opsi.*
> 
> ```
> +-----------------------------------------------------------------+
> |                                                                 |
> |       [Gambar 4.8: Penerapan Hirarki Tipografi Outfit]          |
> |                                                                 |
> +-----------------------------------------------------------------+
> ```

---

## 4.6 Pengujian Pengalaman Pengguna (Usability & User Experience Testing)

Sebagai proyek Desain Komunikasi Visual, tahap akhir pengembangan dievaluasi melalui metode **Usability Testing** dengan menitikberatkan pada kenyamanan navigasi, kejelasan informasi visual, dan daya tarik interaksi bagi pengguna sasaran:

1.  **Evaluasi Keterbacaan (Readability Test):** Menguji apakah font *Outfit* dengan ukuran 0.7rem pada boks deskripsi kartu TCG dapat dibaca dengan mudah oleh anak-anak kelas 5 dan 6 SD tanpa harus memicingkan mata.
2.  **Evaluasi Kejelasan Ikon (Affordance Test):** Menguji apakah bentuk tombol 3D *chunky*, ikon Tas Inventaris (💼), dan tombol dadu (🎲) langsung dipahami fungsinya sebagai elemen interaktif yang bisa ditekan oleh anak-anak.
3.  **Evaluasi Umpan Balik Visual (Visual Feedback Test):** Mengamati respon anak-anak terhadap transisi kartu terbakar (`CardBurningOverlay`) dan partikel bintang berhamburan saat menang duel. Hasil pengujian menunjukkan bahwa anak-anak merasa senang dan terpacu ketika mendapatkan respon animasi yang kaya.

> **Rekomendasi Gambar 4.9:** 
> *Tampilkan screenshot visual feedback, misalnya momen dadu berputar atau partikel koin/bintang pecah di layar.*
> 
> ```
> +-----------------------------------------------------------------+
> |                                                                 |
> |       [Gambar 4.9: Umpan Balik Visual Partikel & Animasi]       |
> |                                                                 |
> +-----------------------------------------------------------------+
> ```

Hasil pengujian kenyamanan visual dan interaksi ini membuktikan bahwa aplikasi "Project Linimasa" berhasil memadukan fungsi media edukasi yang edukatif dengan desain antarmuka ramah anak yang menyenangkan untuk dimainkan.
