# Audit UX & Alur Pengguna Lini Masa (Versi Saat Ini)

Dokumen ini berisi pemetaan teknis mengenai alur pengguna dan fitur yang **sudah diimplementasikan** dalam kode sumber aplikasi Lini Masa hingga saat ini.

---

## 1. Gerbang Awal (Entry Point)
*   **Start Screen**: Layar pemilihan peran dengan gaya visual Duolingo (Clean white background, 3D buttons).
    *   **Pilihan A: Masuk sebagai Murid**: Memicu state `hasStarted` menjadi `true`.
    *   **Pilihan B: Masuk sebagai Guru**: Memicu state `hasStarted` menjadi `true` (saat ini alur fungsional masih sama dengan murid).

---

## 2. Navigasi Utama (Bottom Tab Bar)
Aplikasi memiliki 5 tab utama yang selalu tersedia setelah masuk:
1.  **Jelajah Materi (Icon: Book)**: Fokus pada modul pembelajaran sejarah dan sains.
2.  **Quiz (Icon: Target)**: Fokus pada misi harian dan kelas.
3.  **Game (Icon: Gamepad)**: Papan permainan 3D (Jelajah Nusantara).
4.  **Shop (Icon: ShoppingCart)**: Tempat membeli artefak.
5.  **Profile (Icon: User)**: Statistik dan progres pengguna.

---

## 3. Detail Alur Per-Modul (Yang Sudah Ada)

### A. Modul Jelajah Materi (Alur Pembelajaran)
1.  **Layar Daftar Pahlawan**: Menampilkan grid karakter (contoh: Dewi Sartika).
2.  **Layar Pemilihan Chapter**: Setelah memilih pahlawan, muncul daftar chapter (Chapter 1, 2, 3). Menampilkan status *Locked/Unlocked*.
3.  **Visual Novel Screen**: 
    *   Dialog interaktif dengan aset gambar pahlawan.
    *   Navigasi klik untuk melanjutkan cerita.
4.  **Post-Chapter Quiz**: Setelah cerita VN selesai, pengguna langsung diarahkan ke kuis khusus chapter tersebut.

### B. Modul Quiz (Alur Tantangan)
1.  **Quiz Hub**: 
    *   Tombol **"Misi Sejarah"**: Masuk ke pemilihan Pillar (Edukasi, Budaya, dll).
    *   Tombol **"Masuk Kelas"**: Masuk ke fitur Classroom.
2.  **Classroom System**:
    *   Layar input Kode Kelas.
    *   Lobby Kelas: Menunggu tugas dari guru.
    *   Assignment: Memulai kuis yang ditugaskan di dalam kelas.
3.  **Quiz Play (Mekanik Duolingo)**:
    *   Sistem Nyawa (Hearts): Berkurang jika salah menjawab.
    *   Sistem Streak: Bonus poin untuk jawaban benar berturut-turut.
    *   Progress Bar & Timer.
    *   Layar Result: Menampilkan perolehan Skor dan Mahkota.

### C. Modul Game (Adventure Board 3D)
1.  **3D Game Board**: Papan permainan persegi dengan petak-petak (Start, Situs, Kuis, Peti, Penjara).
2.  **Ultimate Physics Dice**: 
    *   Dadu 3D dengan simulasi fisika nyata (Gravitasi, Pantulan, Torsi).
    *   Dadu berguling dan berhenti secara organik.
3.  **Player Movement**: Bidak pemain melompat sesuai angka dadu yang muncul.
4.  **Property Logic**: Pemain bisa membeli "Situs Sejarah" jika mendarat di petak situs.

### D. Modul Shop & Profile
1.  **Shop**: Menampilkan daftar artefak (contoh: "Kacamata Bung Hatta") yang bisa dibeli menggunakan mata uang **Mahkota**.
2.  **Profile**: 
    *   Menampilkan jumlah XP, Mahkota, dan Sisa Nyawa (Hearts).
    *   Menampilkan grafik progres/statistik.

---

## 4. Mekanik Global (Sistem Dasar)
*   **Health Regen**: Nyawa (Hearts) akan bertambah secara otomatis setiap durasi waktu tertentu.
*   **Currency System**: Penggunaan **Crowns/Mahkota** sebagai mata uang utama untuk belanja.
*   **Theme System**: Mendukung perpindahan mode Terang (Light) dan Gelap (Dark) yang mengubah seluruh visual aplikasi.
*   **State Persistence**: Menggunakan `Zustand` untuk menyimpan progres pahlawan, koleksi artefak, dan jumlah mata uang.

---

## 5. Fitur Mendatang & Pengembangan (Backlog)
Berikut adalah fitur yang direncanakan untuk melengkapi pengalaman pengguna namun belum diimplementasikan secara penuh:

### A. Sistem Sosial & Kompetisi
*   **Leaderboard (Papan Peringkat)**: Menampilkan peringkat siswa berdasarkan total XP atau Mahkota dalam lingkup global maupun lingkup Kelas.
*   **Sistem Pertemanan**: Kemampuan untuk melihat profil teman, melihat koleksi artefak mereka, dan saling mengirim "Energi/Hearts" (Mockup).

### B. Detail Koleksi & Edukasi Lanjutan
*   **Encyclopedia Artefak**: Layar detail untuk setiap artefak yang dimiliki. Berisi narasi sejarah mendalam, foto asli (jika ada), dan signifikansi sejarahnya.
*   **Pencapaian (Achievements)**: Badge khusus yang didapat setelah menyelesaikan milestone tertentu (misal: "Penjelajah 5 Pulau").

### C. Personalisasi (Avatar System)
*   **Changing Room (Kamar Pas)**: Layar khusus untuk mengubah penampilan avatar menggunakan item kosmetik yang sudah dibeli di Shop.
*   **Kustomisasi Kartu Profil**: Mengubah latar belakang kartu profil berdasarkan tema pahlawan yang disukai.

### D. Perluasan Fitur Guru (Teacher Dashboard)
*   **Manajemen Kelas**: Guru dapat melihat daftar siswa, mereset kode kelas, dan melihat statistik pengerjaan kuis siswa secara grafis.
*   **Reward Creator**: Guru dapat memberikan Mahkota atau Item khusus kepada siswa yang berprestasi langsung dari dashboard.

---

*Catatan: Dokumen ini disusun untuk membantu pembuatan diagram UX Journey yang akurat berdasarkan status pengembangan saat ini.*
