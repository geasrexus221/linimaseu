# PANDUAN IDENTITAS VISUAL
## Proyek Aplikasi Edukasi "Lini Masa Sejarah Indonesia"

Panduan ini mendokumentasikan spesifikasi elemen desain, logo, skema warna, tipografi, maskot, serta ikonografi yang membentuk identitas visual aplikasi Lini Masa untuk menjaga konsistensi antarmuka pengguna (UI/UX) premium yang ramah anak.

---

## 1. Logo & Filosofi Logo

*   **Berkas Logo Utama:** [Linimasa.svg](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/assets/UI/element/Linimasa.svg)
*   **Filosofi Desain:**
    *   **Teks "LINIMASA":** Menggunakan tipografi tebal (bold rounded) yang melambangkan fakta sejarah Indonesia yang kokoh dan tak terbantahkan, namun tetap disajikan secara bersahabat bagi siswa sekolah dasar (SD).
    *   **Warna Kuning Emas/Oranye:** Melambangkan masa kejayaan nusantara (kejayaan maritim kerajaan kuno hingga kejayaan kemerdekaan RI), serta melambangkan nilai edukasi yang luhur (pencerahan, kebijaksanaan, dan semangat belajar).
    *   **Konsep Portal Lintas Waktu:** Elemen visual logo melambangkan gerbang petualangan sejarah di mana siswa dapat melakukan pengembaraan waktu (*time travel*) untuk mengeksplorasi sejarah bangsa Indonesia secara interaktif.

---

## 2. Skema Palet Warna (Color Palette)

Aplikasi menggunakan palet warna cerah, kontras tinggi, dan ramah anak (*gamified harmonious system*).

### A. Warna Utama Tema (Light Mode)

Dideklarasikan pada berkas [global.css](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/styles/global.css):

| Nama Warna | Variabel CSS | Kode Hex | Deskripsi & Implementasi |
| :--- | :--- | :--- | :--- |
| **Kuning Emas (Primary)** | `--primary-color` | `#f4c365` | Warna tombol aksi utama, lencana skor, bintang kuis, dan hadiah. |
| **Kuning Emas Gelap** | `--primary-color-dark` | `#d1a54c` | Warna pembatas 3D bawah tombol utama guna memberikan efek timbul. |
| **Biru Muda (Secondary)** | `--secondary-color` | `#1cb0f6` | Warna tombol sekunder, judul petualangan, dan portal air waktu. |
| **Teal/Cyan (Sidebar)** | `--sidebar-bg` | `#49CAE3` | Latar belakang bilah navigasi kiri (sidebar) dan horizontal tabbar. |
| **Hijau Aksen (Accent)** | `--accent-color` | `#58cc02` | Warna tombol mulai kuis, penanda kelulusan materi, dan status benar. |
| **Biru Langit Toko** | `--shop-bg` | `#9BD2FE` | Latar belakang halaman toko/belanja kosmetik. |
| **Latar Belakang Lembut** | `--background-color` | `#faf9f6` | Latar belakang dasar krem lembut agar mata siswa tidak cepat lelah. |
| **Kartu & Panel** | `--card-bg` | `#ffffff` | Latar belakang wadah konten, leaderboard, dan profil pengguna. |
| **Teks Utama** | `--text-color` | `#4b4b4b` | Warna abu-abu gelap arang untuk keterbacaan teks artikel sejarah. |
| **Teks Redup (Muted)** | `--text-muted` | `#737373` | Warna abu-abu sedang untuk teks sekunder dan subjudul materi. |

### B. Warna Tema Mode Gelap (Dark Mode Overrides)

Ketika status `[data-theme='dark']` aktif, variabel berikut disesuaikan:

| Nama Warna | Variabel CSS | Kode Hex | Deskripsi & Implementasi |
| :--- | :--- | :--- | :--- |
| **Navy Gelap (Background)** | `--background-color` | `#1e1e2d` | Latar belakang gelap agar nyaman digunakan di malam hari. |
| **Abu Gelap (Card Bg)** | `--card-bg` | `#2a2a3d` | Latar belakang modul, papan leaderboard, dan box profil. |
| **Batas Modul (Border)** | `--border-color` | `#3a3a4d` | Warna pembatas ubin materi dan navigasi. |
| **Emas Oranye Gelap** | `--primary-color` | `#cc7800` | Emas gelap untuk tombol utama agar kontrasnya terjaga. |
| **Emas Oranye Pembatas** | `--primary-color-dark`| `#a36000` | Pembatas 3D bawah tombol utama mode gelap. |

### C. Kode Warna Node Lintasan Pembelajaran (Sifat Cahaya Path Nodes)

Peta petualangan belajar modul Sifat Cahaya menggunakan tombol jalur bulat 3D (*path nodes*) dengan kode warna berikut:

| Tipe Node | Gradasi Atas | Gradasi Bawah | Batas 3D Bawah | Makna & Dampak Game |
| :--- | :--- | :--- | :--- | :--- |
| **Node Materi (Biru)** | `#38B6FF` | `#0070F3` | `#0056B3` | Konten pembelajaran interaktif (animasi, bacaan). |
| **Node Kuis (Hijau)** | `#78E08F` | `#38A169` | `#276749` | Pertanyaan evaluasi materi kuis harian. |
| **Node Hadiah (Emas)** | `Transparan` | `Transparan` | `Transparan` | Peti hadiah `📦` bintang/kosmetik (animasi melambung). |
| **Node Terkunci (Abu)** | `#CFD8DC` | `#90A4AE` | `#546E7A` | Aktivitas belajar yang belum terbuka. |
| **Node Selesai/Klaim** | `Grayscale` | `Grayscale` | `Grayscale` | Aktivitas/hadiah yang sudah diselesaikan (transparansi 50%). |

### D. Warna Identitas Pemain (Player Identity Colors)

*   **Pemain 1 (Kamu / Budi):** `#22C55E` (Hijau Rumput)
*   **Pemain 2 (Santi / AI):** `#D946EF` (Magenta Cerah)
*   **Pemain 3 (Bimo / AI):** `#EAB308` (Kuning Emas)
*   **Pemain 4 (AI):** `#3B82F6` (Biru Muda)

---

## 3. Tipografi (Typography)

Sistem tipografi aplikasi dirancang khusus untuk memaksimalkan keterbacaan teks naratif sejarah yang panjang oleh anak-anak:

*   **Font Utama (Body Text & UI): `Nunito`**
    *   *Karakteristik:* Rounded sans-serif (huruf bersudut tumpul/bulat).
    *   *Alasan Pemilihan:* Bentuk huruf yang bulat lembut membantu mata anak-anak mengenali karakter huruf dengan lebih cepat dan santai tanpa menyebabkan kelelahan membaca (*eye strain*).
*   **Font Hiasan (Skor & Game): `Fredoka One`**
    *   *Karakteristik:* Sangat tebal, bulat penuh, dan berkesan mainan (*playful*).
    *   *Alasan Pemilihan:* Digunakan pada judul gim 3D (Jelajah Nusantara & Adu Cendekiawan), angka skor dadu, dan teks gelembung dialog instruksi untuk memperkuat nuansa permainan.

---

## 4. Karakter & Maskot (Characters & Mascots)

Elemen gamifikasi aplikasi didukung oleh kehadiran karakter unik yang menemani perjalanan belajar siswa:

1.  **Pijar (Maskot Utama - Obor Semangat):**
    *   *Representasi:* Obor api kecil yang menyala cerah di bagian header status harian (*streak* harian).
    *   *Filosofi:* Melambangkan "pijar semangat perjuangan pahlawan" yang terus berkobar di dada siswa. Pijar bertugas memotivasi siswa untuk belajar secara konsisten setiap hari.
2.  **Budi (Karakter Pemain - 🐰 Kelinci Hijau):**
    *   *Representasi:* Karakter kelinci berambut hijau yang aktif, tangkas, dan selalu siap bertualang menjelajah ubin sejarah di game papan Jelajah Nusantara.
3.  **Santi (Lawan AI / Penantang - 👧 Anak Perempuan):**
    *   *Representasi:* Karakter lawan tanding yang ramah, sopan, dan cerdas. Menantang siswa dalam uji kecerdasan duel kuis cepat di arena Adu Cendekiawan.
4.  **Penjaga Waktu (NPC - 🧙‍♂️ Kakek Bijak):**
    *   *Representasi:* Pemandu berkostum jubah penyihir waktu yang menjaga titik-titik pos bersejarah dan memberikan pertanyaan tantangan bagi para pengembara cilik.

---

## 5. Ikonografi (Iconography)

Gaya ikon dalam aplikasi mengikuti kaidah antarmuka visual modern Duolingo:

### A. Pustaka Ikon Utama (UI Icons)

*   **Teknologi:** Menggunakan **Lucide React** sebagai pustaka ikon tunggal aplikasi demi konsistensi.
*   **Ketebalan Garis (Stroke Width):** Diatur pada ketebalan **2.5** hingga **3** pixel (`strokeWidth={2.5}`).
*   **Gaya Visual:**
    *   Ikon bertema datar (*flat*) dengan kontur outline tebal yang bersih.
    *   Penggunaan warna outline yang selaras dengan tema (misalnya merah menyala untuk obor/flame, kuning emas untuk bintang/star, dan merah muda untuk jantung/hearts).
    *   Tidak menggunakan bingkai kotak/frame bayangan luar pada grid ikon lab, sehingga visualisasi ikon terlihat menyatu, frameless, dan dinamis.

### B. Ikonografi Spasial - Node Lintasan Belajar (Sifat Cahaya Path Nodes)

Ubin/tombol bulat pada jalur pembelajaran modul Sifat Cahaya dilengkapi dengan ikonografi simbolis untuk memandu pemahaman siswa sebelum menekan modul:

*   **Ikon Lampu Pijar (`Lightbulb`):** Menandakan modul **Materi Belajar** (mengenalkan teori perambatan, pembiasan, pemantulan, atau penembusan cahaya).
*   **Ikon Bintang (`Star`):** Menandakan modul **Kuis Evaluasi** untuk menantang pemahaman materi siswa dengan hadiah bintang.
*   **Ikon Kotak Paket (`📦` / Peti):** Menandakan modul **Klaim Hadiah** bintang ekstra atau item kosmetik toko.
*   **Ikon Gembok (`Lock`):** Menunjukkan bahwa ubin modul tersebut **Masih Terkunci** dan mengharuskan penyelesaian modul sebelumnya.
