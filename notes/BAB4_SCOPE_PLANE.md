# 4.3 Scope Plane (Fitur Aplikasi)

Selanjutnya dalam perancangan media aplikasi ini, dilakukan pengelompokan fitur dan konten berdasarkan halaman utama aplikasi seperti pada tabel berikut.

**Tabel 4.1 Fungsional Specification dan Content Requirement**

Sumber: Dokumen Pribadi

| Fungsional Specification | Content Requirement | Keterangan |
|---|---|---|
| **Halaman Autentikasi** | • Formulir registrasi akun baru (nama pengguna dan data profil awal). | User 1 |
| *(Auth)* | • Formulir login untuk pengguna yang sudah terdaftar. | Pemain |
| | • Data tersimpan secara persisten di perangkat menggunakan *local storage*. | |
| **Halaman Beranda** | • Tampilan daftar tokoh pahlawan nasional yang tersedia sebagai pintu masuk ke konten cerita. | User 1 |
| *(Home / Story Grid)* | • Filter konten berdasarkan era sejarah (misalnya: Era Pergerakan). | Pemain |
| | • Tombol navigasi cepat ke seluruh bagian aplikasi melalui tab bar bawah. | |
| | • Latar belakang dinamis yang menyesuaikan tema konten yang dipilih. | |
| **Mode Cerita** | • Layar pemilihan chapter dengan tampilan progres setiap chapter (terkunci / terbuka / selesai). | User 1 |
| *(Story Mode)* | • Tampilan *visual novel* interaktif dengan dialog antar karakter, narasi, dan deskripsi ilustrasi. | Pemain |
| | • Karakter panduan **Bimo** dan **Santi** sebagai pemeran utama dalam setiap cerita. | |
| | • Chapter perdana: kisah **R.A. Dewi Sartika** di Cicalengka pada akhir abad ke-19. | |
| | • Kuis pemahaman yang muncul otomatis setelah setiap chapter selesai dibaca. | |
| | • Sistem *chapter unlocking* — chapter baru terbuka setelah chapter sebelumnya diselesaikan. | |
| **Mode Kuis** | • Halaman hub kuis dengan pilihan kategori misi dan tema soal. | User 1 |
| *(Quiz Mode)* | • Soal pilihan ganda seputar sejarah dan budaya Indonesia dengan batas waktu. | Pemain |
| | • Sistem nyawa (*Hearts*) — setiap jawaban salah mengurangi satu Hati. | |
| | • Sistem **Streak Harian** yang mencatat konsistensi belajar pengguna setiap hari. | |
| | • Jawaban benar memberikan hadiah **Mahkota (*Crown*)** sebagai mata uang aplikasi. | |
| | • Mode **Kelas (*Classroom*)** — bergabung ke ruang kuis yang dibuat oleh guru atau pengajar. | |
| | • Layar hasil kuis menampilkan skor, jawaban benar/salah, dan perolehan Mahkota. | |
| **Mode Game** | • Halaman **Arcade** yang menampilkan daftar permainan yang tersedia. | User 1 |
| *(Game Mode)* | • Halaman **Intro Jelajah Nusantara** — penjelasan singkat cara bermain dan tombol mulai. | Pemain |
| | • Halaman **Setup Permainan** — konfigurasi jumlah pemain (1–4), nama, tipe (manusia/bot), dan pilihan peta. | |
| | • Layar **Permainan Utama** — papan 3D isometrik, sistem giliran, HUD pemain, dan log permainan. | |
| | • Layar **Kemenangan** yang muncul saat salah satu pemain mengumpulkan 3 Artefak Nusantara. | |
| | • Fitur **Map Maker** — editor peta kustom untuk merancang papan permainan sendiri. | |
| **Toko** | • Kategori **Kosmetik** — aksesori topi, pakaian, dan bingkai (*border*) profil avatar. | User 1 |
| *(Shop)* | • Kategori **Gacha** — pembukaan hadiah acak untuk mendapatkan item atau artefak langka. | Pemain |
| | • Kategori **Refill** — pengisian ulang Hati menggunakan Mahkota. | |
| | • Tampilan saldo Mahkota pengguna saat ini secara real-time. | |
| | • Konfirmasi pembelian sebelum transaksi dilakukan untuk mencegah pembelian tidak disengaja. | |
| **Profil** | • Halaman profil utama: nama, gelar (*title*), statistik (Mahkota, Streak, chapter selesai). | User 1 |
| *(Profile)* | • Halaman **Koleksi Artefak** — galeri seluruh Artefak Nusantara yang pernah diperoleh. | Pemain |
| | • Halaman **Kustomisasi Avatar** — mengganti dan menggunakan item kosmetik yang telah dibeli (topi, pakaian, aksesori, border). | |
| | • Pratinjau (*preview*) tampilan avatar secara langsung sebelum item dikenakan. | |
| **Pengaturan** | • Pengaturan volume musik latar (*background music*). | User 1 |
| *(Settings)* | • Pengaturan volume efek suara (*SFX*). | Pemain |
| | • Tombol aktifkan/nonaktifkan seluruh suara (*mute/unmute*). | |
| | • Pilihan tema tampilan aplikasi: **Mode Terang (*Light*)** dan **Mode Gelap (*Dark*)**. | |
| | • Pengaturan nama profil pengguna. | |
| | • Akses **Mode Pengembang (*Dev Mode*)** untuk keperluan pengujian dan demonstrasi. | |
