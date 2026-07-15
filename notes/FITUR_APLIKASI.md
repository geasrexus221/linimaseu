# 🌟 Daftar Lengkap Fitur Aplikasi Linimasa

Linimasa adalah sebuah platform edukasi berbalut *game* (gamifikasi) yang dirancang untuk memberikan pengalaman belajar yang interaktif, menantang, dan menyenangkan bagi siswa, sekaligus memberikan alat pemantauan yang komprehensif bagi guru.

Berikut adalah daftar lengkap fitur-fitur yang ada di dalam aplikasi ini:

---

## 1. 🔐 Sistem Autentikasi (Sistem Masuk)
- **Multi-Role Login:** Sistem masuk terpisah antara Murid dan Guru.
- **Login Tamu / Simulasi:** (Mode purwarupa) memungkinkan masuk dengan satu ketukan (email, murid, atau guru).
- **Layar Masuk Responsif:** Layar masuk disesuaikan dengan tema, lengkap dengan logo Linimasa beresolusi tinggi dan opsi *login* yang menarik.

---

## 2. 🎓 Dashboard Murid (Student Dashboard)
Merupakan pusat kendali bagi siswa yang menampilkan seluruh informasi perkembangan belajarnya.
- **HUD Ringkas (Heads-Up Display):** Menampilkan status Level, Total XP (Pengalaman), dan Peringkat (Leaderboard) pemain.
- **Pengumuman Global:** Papan pengumuman *real-time* (peringatan, info, atau event) yang bisa diletakkan di layar utama (berada paling atas pada layar HP).
- **Misi Harian (Daily Quests):** Daftar misi yang di-reset setiap hari (misalnya: Selesaikan 2 materi, baca 3 artikel) dengan imbalan XP/Koin bagi yang berhasil menyelesaikannya.
- **Perjalanan Api (Login Streak):** Visualisasi seberapa rajin siswa masuk setiap harinya. Jika berhasil masuk berturut-turut, akan mendapatkan bonus (misalnya peti harta karun pada hari ke-7).
- **Aktivitas Terakhir:** Ringkasan nilai, skor, dan perolehan XP dari materi/kuis terakhir yang dikerjakan.

---

## 3. 🗺️ Eksplorasi Modul (Story / Materi)
Pendekatan belajar materi layaknya menjelajahi peta sebuah *game*.
- **Peta Penjelajahan (Path Nodes):** Materi dibagi ke dalam titik-titik persinggahan (*nodes*). Siswa tidak bisa melompat ke titik akhir sebelum menyelesaikan titik sebelumnya.
- **Karakter Pemandu Interaktif:** Karakter NPC yang mengikuti perkembangan siswa. Saat siswa bergeser ke materi baru, karakter akan ikut berpindah di peta. Tersedia animasi khusus di akhir jalan (*reward node*).
- **Info Modul Samping (Right Panel):** Saat sebuah materi dipilih, akan muncul panel khusus yang menjelaskan inti pelajaran yang akan dibaca/dimainkan.

---

## 4. 🧠 Area Latihan & Kuis (Quiz)
Sistem evaluasi interaktif pasca-materi.
- **Berbagai Format Pertanyaan:** Pilihan ganda, kuis interaktif, dsb.
- **Imbalan Berdasarkan Skor:** Memberikan koin dan XP secara proporsional berdasarkan jawaban benar.
- **Sistem Nyawa (Hearts):** Mirip permainan pada umumnya, salah menjawab dapat mengurangi nyawa. Nyawa akan beregenerasi seiring waktu atau melalui perolehan hadiah.

---

## 5. 🎮 Game "Jelajah Nusantara"
Game edukasi terintegrasi di dalam aplikasi (Mode Board Game).
- **Meja Komando (Lobi Game):** Ruang tunggu interaktif sebelum permainan dimulai, dengan estetika visual (tekstur kayu) yang bereaksi terhadap Mode Terang/Gelap.
- **Pemilihan Peta & Tema Kuis:** Siswa bisa memilih latar peta dan topik pelajaran spesifik yang menjadi rintangan di dalam game.
- **Multiplayer Lokal / Slot Pemain:** Pilihan untuk mendaftarkan dan menambah peserta dalam satu layar permainan.
- **Sistem "Board Maker" (Eksperimental):** Fitur untuk merancang dan memodifikasi papan penjelajahan.

---

## 6. 🛒 Toko (Shop)
- **Tukar Koin dengan Kosmetik:** Siswa dapat menggunakan koin yang didapat dari belajar untuk membeli kostum/aksesoris (topi, jaket, dsb).
- **Sistem *Bundle* / Bundel:** Pembelian dalam bentuk paket (misalnya Paket Obor untuk mengamankan *streak*).

---

## 7. 👤 Profil (Profile) & Koleksi
- **Kustomisasi Avatar:** Melihat avatar yang sedang digunakan (dengan kombinasi kosmetik yang telah dibeli dari Toko).
- **Rak Prestasi (Achievements / Medals):** Menyimpan lencana (badges) khusus yang didapatkan setelah menyelesaikan modul tertentu atau mencapai *milestone* sulit.

---

## 8. 👨‍🏫 Dashboard Guru (Teacher Command Center)
Antarmuka terpisah khusus untuk pengajar.
- **Pantauan Keaktifan Siswa:** Melihat status murid secara individu (apakah rajin mengerjakan, atau sedang kesulitan / nyawa habis).
- **Rapor Singkat:** Analisis apakah siswa tuntas mengerjakan materi terakhir atau bolos.
- **Papan Peringkat Kelas (Leaderboard Control):** Melihat siswa mana yang memimpin di kelas berdasarkan XP.

---

## 9. ⚙️ Pengaturan & Dukungan Sistem (Settings)
- **Tema Gelap / Terang (Dark Mode / Light Mode):** Dukungan penuh antarmuka ganda. Halaman seperti *Meja Komando*, *Dashboard*, hingga *Toko* akan berubah secara menyeluruh sesuai tema.
- **Manajer Suara (Sound Manager):** Mengatur hidup/matinya efek suara klik, musik latar, atau efek kemenangan (Whoosh, Click, Applause).
- **Layout Responsif (Cross-Platform):** Desain yang berubah bentuk secara cerdas (Responsive). Kolom-kolom akan ditata bersebelahan di Desktop/Tablet, namun akan disusun ke bawah secara rapi (seperti posisi urutan Pengumuman -> Perjalanan Api) ketika dibuka di HP Android/iOS.
