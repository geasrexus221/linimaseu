# BAB IV — PERANCANGAN

---

## 4.1 Strategi Perancangan

Dalam perancangan aplikasi Lini Masa dibutuhkan strategi perancangan yang dapat menarik minat serta memberikan nilai edukasi kepada target audiens, yaitu pelajar dan generasi muda yang ingin mempelajari sejarah dan budaya Indonesia secara menyenangkan.

Perancangan UI/UX aplikasi ini menggunakan metode **User Centered Design (UCD)** dengan tahapan sebagai berikut:

1. **Understand Context of Use** — Memahami kondisi dan lingkungan penggunaan aplikasi, termasuk perangkat yang digunakan (smartphone Android dan web browser), situasi belajar pengguna, serta hambatan yang sering dihadapi dalam proses belajar sejarah secara konvensional.

2. **Specify User Requirements** — Menentukan kebutuhan pengguna berdasarkan hasil analisis, seperti kebutuhan akan konten yang singkat namun bermakna, tampilan visual yang atraktif, sistem poin sebagai motivasi, dan kemudahan navigasi tanpa kurva belajar yang tinggi.

3. **Design Solutions** — Merancang solusi desain yang memenuhi kebutuhan tersebut, mencakup perancangan antarmuka, alur permainan, sistem reward, dan penyusunan konten edukasi yang terintegrasi dalam mekanisme permainan.

Perancangan diperkuat dengan kerangka kerja **The Elements of User Experience** (Jesse James Garrett) untuk memahami dan merancang pengalaman pengguna secara menyeluruh, mulai dari lapisan strategi (*strategy plane*), ruang lingkup (*scope plane*), struktur (*structure plane*), kerangka (*skeleton plane*), hingga tampilan visual (*surface plane*).

---

## 4.2 Ideate (Konsep Umum)

Pada tahap ideate, dikembangkan sebuah aplikasi pembelajaran berbentuk permainan edukatif interaktif yang bertujuan untuk meningkatkan minat dan pengetahuan pelajar terhadap sejarah dan tokoh-tokoh pahlawan nasional Indonesia. Konsep pengemasan aplikasi disesuaikan dengan data kebutuhan pengguna berdasarkan persona pelajar yang telah dianalisis sebelumnya.

Aplikasi **Lini Masa** dirancang untuk memberikan pengalaman belajar yang lebih visual, imersif, dan menyenangkan melalui dua pendekatan utama:

Pertama, melalui **permainan papan digital (board game)** bertajuk *Jelajah Nusantara*, di mana pemain berpetualang melintasi peta bertema Indonesia, menghadapi berbagai tantangan pengetahuan, dan berduel ilmu dengan sesama pemain. Sistem ini dilengkapi mekanisme **Tekad** (energi pemain) dan sistem **reward** berupa Pijar dan Artefak, serta **punishment** berupa pengurangan Tekad dan status "Tumbang", sebagai motivasi positif yang mendorong pengguna untuk terus belajar dan bermain.

Kedua, melalui **mode cerita visual novel (Visual Novel)**, di mana pengguna diajak menjelajahi kisah nyata tokoh pahlawan nasional, dimulai dari R.A. Dewi Sartika, melalui dialog interaktif dan ilustrasi yang menghidupkan kembali suasana Indonesia pada akhir abad ke-19.

Selain itu, aplikasi menyediakan **sistem kuis interaktif** yang terintegrasi dengan alur permainan sebagai sarana untuk membiasakan pengguna berhadapan dengan soal-soal sejarah secara konsisten. Seluruh elemen perancangan disesuaikan dengan preferensi visual generasi muda yang mengutamakan interaksi cepat, tampilan premium, dan konten berulang (*replayable*).

---

## 4.3 Konsep Media

Penentuan konsep media dalam perancangan Lini Masa ditentukan berdasarkan analisis karakteristik target audiens yang diperoleh melalui studi literatur dan observasi kebiasaan belajar generasi muda.

Media yang dipilih adalah **aplikasi hybrid multi-platform** yang dapat diakses melalui peramban web (*web browser*) di komputer maupun sebagai aplikasi *native* di perangkat Android. Pendekatan hybrid ini dipilih karena fleksibilitasnya — satu basis kode dapat menjangkau dua platform sekaligus tanpa mengorbankan kualitas pengalaman pengguna.

Secara visual, aplikasi dirancang dengan estetika **modern dan premium** yang terinspirasi dari desain antarmuka game-game populer, antara lain:

- **Warna**: Palet warna hangat dan hidup dengan aksen oranye (`#ff9600`), hijau energi (`#58cc02`), dan biru langit (`#1cb0f6`) yang merepresentasikan semangat dan optimisme.
- **Tipografi**: Menggunakan font **Outfit** dari Google Fonts dengan ketebalan 400, 700, dan 900 untuk menciptakan hierarki visual yang kuat dan kesan yang modern.
- **Grafis 3D Isometrik**: Papan permainan dirender menggunakan transformasi CSS 3D dan proyeksi isometrik, memberikan kedalaman visual tanpa memerlukan perangkat keras tinggi.
- **Ilustrasi Bertema Lokal**: Nama kartu aksi, ikon petak, dan narasi cerita menggunakan referensi budaya Indonesia yang kaya, seperti *Kopi Luwak*, *Sandal Jepit*, *Ojek Online*, *Peta Rahasia*, dan *Keris Pusaka*, untuk memperkuat identitas budaya bangsa.
- **Animasi Micro-interaction**: Setiap interaksi — dari klik tombol, mendarat di petak, hingga membuka kartu — disertai animasi halus yang memberikan umpan balik visual dan rasa kepuasan kepada pengguna.

Dengan pendekatan ini, Lini Masa diharapkan menjadi media edukatif yang tidak sekadar menghibur, tetapi juga secara aktif menanamkan nilai-nilai kebangsaan dan apresiasi terhadap pahlawan nasional dalam keseharian generasi muda di era digital.

---

## 4.4 Konsep Permainan

Penentuan konsep permainan dalam perancangan Lini Masa didasarkan pada analisis karakteristik target audiens dan kebutuhan akan media pembelajaran yang mampu mempertahankan perhatian pengguna dalam jangka waktu yang cukup untuk transfer pengetahuan terjadi.

Permainan inti dirancang sebagai **board game digital berbasis giliran (turn-based)** dengan elemen penjelajahan peta bertema Nusantara. Berikut adalah konsep mekanika permainan secara menyeluruh:

### Mekanika Inti
Setiap giliran, pemain memutar dadu digital 3D untuk menentukan jumlah langkah yang bisa diambil. Pion pemain kemudian bergerak secara otomatis sesuai jalur yang tersedia di peta, dan apabila terdapat persimpangan, pemain dapat memilih arah perjalanannya sendiri. Setelah mendarat, jenis petak tempat pion berhenti menentukan peristiwa yang terjadi selanjutnya.

### Jenis-Jenis Petak
| Petak | Ikon | Kejadian |
|---|---|---|
| **Jejak Masa Lalu** | 📜 | Kuis pengetahuan sejarah. Jawaban benar memberikan Pijar, salah mengurangi Tekad. |
| **Peti Harta** | 🎁 | Mendapatkan kartu aksi secara acak untuk digunakan nanti. |
| **Jebakan** | ⚠️ | Tekad berkurang dan/atau pion mundur beberapa langkah. |
| **Penjaga** | 🧙 | Tantangan duel dadu melawan penjaga wilayah. Menang mendapat Pijar, kalah kehilangan Tekad. |
| **Markas** | 🏠 | Pulih kembali, Tekad dipulihkan sebagian. |

### Sistem Ekonomi Game
- **Tekad**: Sumber energi pemain (0–100). Jika habis, pemain "Tumbang" dan harus berjuang untuk bangkit kembali melalui mekanisme pemulihan khusus.
- **Pijar**: Poin prestasi yang dikumpulkan. Setiap 5 Pijar dikonversi menjadi 1 **Artefak Nusantara**.
- **Artefak**: Kondisi kemenangan. Pemain pertama yang mengumpulkan **3 Artefak** memenangkan permainan.

### Sistem Konflik (Duel)
- **Tantangan Penjaga**: Duel dadu antara pemain dan Penjaga AI. Nilai dadu yang lebih tinggi menentukan pemenang.
- **Laga Cendekia**: Jika dua atau lebih pemain berada di petak yang sama, duel dapat terjadi antara sesama pemain.
- **Sistem Tumbang & Bangkit**: Pemain yang Tekadnya habis memasuki fase pemulihan, di mana mereka harus mendapatkan nilai dadu di atas target tertentu untuk bangkit kembali.

### Kartu Aksi (Inventori)
Pemain dapat mengumpulkan dan menggunakan kartu aksi yang terinspirasi dari kekayaan budaya Indonesia:

| Kartu | Efek |
|---|---|
| 🍱 Bekal Perjalanan | +30 Tekad |
| ☕ Kopi Luwak | +50 Tekad |
| ⚡ Langkah Kilat | Maju 3 petak tambahan |
| 🩴 Sandal Jepit | Maju 1 petak |
| 🗺️ Peta Rahasia | Maju 2 petak |
| 🛵 Ojek Online | Teleportasi ke petak tujuan |
| 🗡️ Keris Pusaka | Memenangkan duel berikutnya secara otomatis |
| *dan lainnya...* | |

### Dukungan AI Bot
Aplikasi mendukung mode bermain melawan **Bot berbasis kecerdasan buatan** yang mampu mengambil keputusan giliran secara mandiri, memilih arah persimpangan, dan melakukan pemulihan otomatis jika mengalami status Tumbang. Hal ini memungkinkan pengguna untuk bermain dan belajar bahkan tanpa kehadiran pemain lain.

Dengan konsep permainan yang kaya dan berlapis ini, Lini Masa diharapkan mampu menjadi platform edukasi yang tidak hanya meningkatkan pengetahuan sejarah dan budaya Indonesia, tetapi juga membangun kecakapan berpikir strategis dan daya juang (*resilience*) dalam diri penggunanya.

---

*Dokumen ini merupakan bagian dari penulisan skripsi pengembangan aplikasi Lini Masa.*
