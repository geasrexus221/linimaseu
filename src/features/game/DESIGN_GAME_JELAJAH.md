# Dokumen Perancangan: Jelajah Nusantara (Petualangan Waktu)

**Visi**: Sebuah permainan papan edukatif untuk siswa SD yang mengutamakan kompetisi sehat, literasi sejarah, dan strategi pengumpulan sumber daya (Pijar).

---

## 1. Tujuan Utama & Kondisi Menang
1. **Juara Utama**: Pemain pertama yang berhasil mengumpulkan dan menyimpan **3 Artefak** di **Base (Markas)**.
2. **Cara Menang**: 
   - Kumpulkan **5 Pijar Sejarah** untuk mendapatkan 1 Fragmen Artefak.
   - Bawa Fragmen tersebut ke Markas untuk disimpan secara permanen.
   - Ulangi 3 kali.

---

## 2. Pengumpulan Pijar Sejarah
1. **Petak Jejak Masa Lalu**: Berhenti di petak ini untuk menjawab 1 Pertanyaan.
2. **Hadiah**: Jika benar, mendapat **1 Pijar Sejarah** dan sejumlah Tekad.
3. **Evolusi**: Begitu Pijar mencapai 5, otomatis menjadi **Fragmen Artefak**. Pemain harus pulang ke Markas untuk mengosongkan tas sebelum bisa mengumpulkan Pijar kembali.

---

## 3. Sistem Tantangan (Duel Pijar)
Saat Pemain A (Penantang) mendarat di petak Pemain B (Penjawab):
1. **Tantangan**: Pemain A memilih tema kuis untuk Pemain B.
2. **Hasil Duel**:
   - **Pemain B BENAR**: Pemain A (Penantang) dihukum **Kehilangan 1 Pijar Sejarah**.
   - **Pemain B SALAH**: Pemain A (Penantang) berhasil **Mengambil 1 Pijar Sejarah** milik Pemain B.
   - **Kondisi Khusus**: Jika Pemain B tidak memiliki Pijar, Pemain A berhak mengambil **100 Tekad** dari Pemain B.

---

## 4. Sistem Markas (Base)
Markas adalah tempat perlindungan dan titik penyimpanan.
1. **Bonus Markas**: Melewati/Mendarat di Markas sendiri = **+100 Tekad**.
2. **Retrieve**: Pilihan untuk menyimpan Fragmen Artefak agar aman dan tidak bisa hilang/berkurang.
3. **Rest**: Pilihan untuk beristirahat (Memulihkan perlindungan).

---

## 5. Daftar Petak & Fungsinya (Tile Library)
Papan terdiri dari berbagai jenis petak dengan fungsi unik:

1. **Petak Jejak Masa Lalu (Biru)**: 
   - **Fungsi**: Sumber Pijar Sejarah.
   - **Aksi**: Muncul 1 kuis pengetahuan. Benar = +1 Pijar & +10 Tekad.
2. **Petak Peti Harta (Kuning)**: 
   - **Fungsi**: Bonus Tekad instan.
   - **Aksi**: Mendapatkan Tekad acak (10-30 Tekad).
3. **Petak Kotak Kartu (Hijau)**: 
   - **Fungsi**: Inventori Strategi.
   - **Aksi**: Mendapatkan 1 Kartu Strategi secara gratis.
4. **Petak Markas (Sudut)**: 
   - **Fungsi**: Keamanan & Penyimpanan.
   - **Aksi**: Simpan Fragmen, +100 Tekad, & Istirahat (Kebal tantangan 1 putaran).
5. **Petak Lubang Jebakan (Merah)**: 
   - **Fungsi**: Hambatan Sejarah.
   - **Aksi**: Kehilangan 15 Tekad atau 1 Pijar secara acak.
6. **Petak Lubang Waktu (Ungu)**: 
   - **Fungsi**: Transportasi Instan.
   - **Aksi**: Berpindah ke petak Warp lain yang ada di papan.
7. **Petak Situs Rahasia (Putih/Emas)**: 
   - **Fungsi**: Hadiah Langka.
   - **Aksi**: Pemain boleh memilih: +50 Tekad ATAU Ambil 2 Kartu Strategi sekaligus.
8. **Petak Angin Ribut (Abu-abu)**: 
   - **Fungsi**: Pergerakan Acak.
   - **Aksi**: Mendorong pemain maju atau mundur 1-3 langkah secara acak.

---

## 6. Daftar Kartu Strategi (Action Cards)
| Nama Kartu | Biaya (Tekad) | Efek |
| :--- | :--- | :--- |
| **Langkah Pasti** | 40 | Pilih langkah (1-6) tanpa kocok dadu. |
| **Dadu Ganda** | 30 | Kocok dua dadu sekaligus. |
| **Rem Waktu** | 20 | Hasil dadu dikurangi 2 (minimal 1). |
| **Teleport Markas** | 60 | Instan kembali ke Markas sendiri. |
| **Senter Waktu** | 15 | Menghapus 2 pilihan salah pada kuis berikutnya. |
| **Buku Pintar** | 35 | Menjawab kuis dengan benar secara otomatis. |
| **Perisai Api** | 30 | Kebal dari tantangan lawan selama 3 giliran. |
| **Magnet Tekad** | 25 | Mendapat Tekad 2x lipat selama 3 giliran. |
| **Pencuri Pijar** | 50 | Mencuri 1 Pijar dari lawan (Jarak 1-3 petak). |
| **Tukar Posisi** | 55 | Tukar posisi bidakmu dengan lawan. |
| **Jembatan Cahaya** | 45 | Lompat ke petak kuis terdekat di depan. |
| **Ranjau Bingung** | 20 | Siapa pun yang mendarat kehilangan 1 giliran. |
| **Angin Ribut** | 40 | Semua pemain terdorong maju 3 petak. |
| **Berbagi Cahaya** | 10 | Berikan 50 Tekad ke lawan untuk dapat 1 Pijar. |
| **Hujan Tekad** | 30 | Semua pemain mendapatkan 30 Tekad. |

---

## 7. Filosofi Edukasi
- **Pengetahuan adalah Cahaya**: Pijar melambangkan semangat belajar anak. Semakin banyak tahu, semakin terang cahayanya.
- **Sportivitas & Strategi**: Mengajarkan pengelolaan sumber daya (Tekad) dan pengambilan risiko yang sehat.

---

## 8. Desain Antarmuka (UI Layout)
Game dimainkan secara **Landscape** untuk memberikan ruang visual papan 3D yang maksimal.

### A. HUD Pemain (Player Heads-Up Display)
- **Posisi**: Terletak di 4 sudut layar (sesuai jumlah pemain).
- **Profil**: Foto profil & Nama pemain.
- **Indikator Giliran**: Profil menyala (*Glow*) saat giliran aktif, dan meredup saat menunggu.
- **Bar Status (Samping Profil)**:
  - **Slot Artefak**: Ikon artefak pasif yang dibawa.
  - **Pijar Sejarah**: Indikator jumlah Pijar yang dikumpulkan (0-5).
  - **Fragmen Artefak**: Ikon fragmen. Abu-abu (dibawa), Emas (tersimpan di Markas).
  - **Tekad Jelajah**: Saldo mata uang dalam game (Tekad).
- **Interaksi**: Klik pada profil/bar untuk membuka **Popup Inventory** (Detail kartu dan efek yang dimiliki).

### B. Kontrol
- **Tombol Dadu**: Muncul di **Tengah Bawah** layar saat giliran pemain.
- **Papan Permainan**: Visual 3D di tengah layar dengan kamera isometrik.
- **Pion Player**: Ikon karakter (pawn) yang mewakili tiap pemain di atas petak.

### C. Navigasi
- **Tombol Pengaturan/Keluar**: Tersembunyi di pojok atas (ikon gear).
- **Log Aktivitas**: Teks singkat di pinggir layar yang menginformasikan kejadian game (misal: "Pemain A mendapatkan 1 Pijar!").

---

## 9. Gaya Visual Papan (Board Visual Style)
Estetika papan mengusung tema **"Floating Cosmic Board"** (Papan Kosmik Melayang), menggambarkan penjelajahan di atas "Sungai Waktu".

### A. Estetika Petak (Tiles)
- **Tampilan 3D Isometrik**: Setiap petak adalah lempengan kristal tebal yang memiliki kedalaman visual.
- **Efek Melayang**: Petak tidak menempel pada lantai, melainkan mengambang di udara dengan sedikit animasi naik-turun yang halus.
- **Warna & Cahaya**: Menggunakan warna-warna neon yang kontras (Biru, Kuning, Hijau, Merah) dengan ikon putih yang bercahaya di bagian tengah.

### B. Lingkungan (Environment)
- **Latar Belakang Nebula**: Papan berada di atas pusaran galaksi berwarna ungu dan pink tua, memberikan kesan magis dan futuristik.
- **Atmosfer**: Pencahayaan redup di area sekitar papan agar fokus pemain tetap tertuju pada jalur petak yang menyala.

### C. Visual Pion (Pawn)
- **Bidak Karakter**: Karakter pemain berdiri di atas penyangga (base) lingkaran kecil yang bercahaya sesuai warna pemain.
- **Jejak Cahaya**: Saat bergerak, pion meninggalkan jejak partikel cahaya tipis di sepanjang jalur.
