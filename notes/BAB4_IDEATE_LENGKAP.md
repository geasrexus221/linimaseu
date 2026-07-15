# 4.2 Ideate (Konsep Umum)

Pada tahap *ideate* (pencetusan ide), gagasan utama yang dikembangkan adalah penciptaan **"Project Linimasa"**, sebuah aplikasi edukasi interaktif berbasis gamifikasi yang dirancang secara khusus untuk meningkatkan wawasan sejarah dan budaya Indonesia bagi siswa kelas 5–6 SD. Konsep pengemasan aplikasi ini disesuaikan dengan data kebutuhan pengguna yang menyukai metode pembelajaran visual, kompetitif, dan tidak monoton.

Secara umum, **"Project Linimasa"** mengusung format permainan papan (*board game*) 3D virtual yang dipadukan dengan mode penceritaan bergaya novel visual (*visual novel*). Aplikasi ini menghadirkan fitur **"Jelajah Nusantara"**, di mana pemain dapat mengeksplorasi peta 3D interaktif melalui putaran dadu. Konsep ini diperkaya dengan mekanika permainan tingkat lanjut yang sesuai dengan logika berpikir anak kelas atas, yakni sebagai berikut.

---

### a. Jelajah Nusantara (Board Game 3D Interaktif)

Inti dari aplikasi Linimasa adalah fitur **Jelajah Nusantara**, sebuah permainan papan digital berbasis giliran (*turn-based*) yang dirender dalam tampilan tiga dimensi dengan perspektif isometrik. Setiap pemain diwakili oleh sebuah pion (*avatar*) yang dapat dijelajahi di atas peta yang terdiri dari petak-petak bertemakan Nusantara.

Pada setiap gilirannya, pemain memutar dadu digital 3D yang akan menghasilkan nilai acak antara 1 hingga 6. Pion kemudian bergerak secara otomatis sesuai jalur yang tersedia di peta sebanyak jumlah langkah yang didapat. Apabila terdapat persimpangan jalan di tengah perjalanan, pemain diberikan kebebasan memilih arah yang ingin dituju, menciptakan elemen pengambilan keputusan strategis yang memperkaya pengalaman bermain.

---

### b. Tantangan Penjaga & Laga Cendekia

Konsep ini diperkaya dengan mekanika permainan tingkat lanjut yang sesuai dengan logika berpikir anak kelas atas, berupa fitur kuis dan duel ilmu — baik melawan pemain lain maupun AI Bot — untuk menguji pemahaman sejarah. Terdapat dua jenis konflik utama dalam permainan:

**Tantangan Penjaga** terjadi ketika pion pemain mendarat di petak bertanda Penjaga. Pemain akan menghadapi duel dadu melawan seorang *Penjaga* AI yang menjaga wilayah tersebut. Pemain harus mendapatkan nilai dadu yang lebih tinggi dari nilai milik Penjaga untuk memenangkan duel. Kemenangan memberikan hadiah berupa **Pijar Sejarah**, sementara kekalahan mengakibatkan berkurangnya **Tekad** pemain. Mekanika ini mendorong pemain untuk memahami bahwa setiap perjalanan pengetahuan selalu disertai tantangan yang harus dihadapi, bukan dihindari.

**Laga Cendekia** adalah mekanika duel antarpemain yang terjadi secara otomatis ketika dua atau lebih pemain berada di petak yang sama secara bersamaan. Kedua pemain akan melakukan putaran dadu dan nilai yang lebih tinggi menentukan pemenang duel. Pemenang mendapatkan Pijar, sedangkan yang kalah kehilangan sebagian Tekad. Mekanika ini memperkenalkan unsur kompetitif yang sehat dan mendorong interaksi langsung antarpemain.

---

### c. Sistem Tekad

**Sistem Tekad** adalah sistem manajemen sumber daya energi yang mengajarkan pemain untuk berpikir strategis agar karakter mereka tidak "Tumbang" saat menjelajah. Setiap pemain memiliki nilai Tekad yang berkisar antara 0 hingga 100, divisualisasikan dalam bentuk bilah (*progress bar*) yang terlihat jelas pada antarmuka permainan.

Tekad dapat berkurang akibat berbagai peristiwa negatif, seperti mendarat di petak Jebakan, kalah dalam Tantangan Penjaga, atau menjawab soal kuis dengan salah. Sebaliknya, Tekad dapat dipulihkan dengan cara singgah di **Markas** milik pemain, mengonsumsi Kartu Aksi pemulihan, atau memperoleh bonus dari Peti Harta.

Apabila nilai Tekad pemain mencapai nol, karakter tersebut dinyatakan **"Tumbang"** dan memasuki fase pemulihan khusus. Pada fase ini, pemain tidak dapat bergerak secara normal dan harus memutar dadu untuk mendapatkan nilai yang melampaui target tertentu agar dapat bangkit kembali. Target tersebut semakin mudah setiap kali pemain mencoba, dari nilai 5, lalu 3, hingga akhirnya 1, memastikan setiap pemain selalu memiliki kesempatan untuk kembali bertanding tanpa rasa frustrasi yang berlebihan. Sistem ini secara halus mengajarkan nilai **ketangguhan** (*resilience*) dan **manajemen sumber daya** kepada pengguna muda.

---

### d. Sistem Petak dan Peristiwa (*Tile Events*)

Setiap petak di peta Jelajah Nusantara memiliki jenis dan fungsi yang berbeda-beda, menciptakan variasi pengalaman di setiap sesi bermain. Berikut adalah jenis-jenis petak yang tersedia:

- **Jejak Masa Lalu (📜)**: Petak edukatif utama. Pemain akan mendapatkan pertanyaan pilihan ganda seputar sejarah Indonesia. Jawaban yang benar memberikan hadiah Pijar Sejarah, sementara jawaban yang salah mengurangi Tekad. Petak ini adalah representasi langsung dari tujuan edukasi aplikasi.

- **Peti Harta Karun (🎁)**: Pemain mendapatkan hadiah kejutan berupa Tekad tambahan. Terdapat pula peluang sebesar 25% untuk mendapatkan Pijar Sejarah secara langsung dari dalam peti, menambah unsur kejutan (*surprise*) yang disukai anak-anak.

- **Jebakan (⚠️)**: Petak rintangan yang mengurangi Tekad dan/atau memundurkan pion beberapa langkah. Keberadaan petak ini menciptakan rasa urgensi dan mengajarkan pemain untuk selalu waspada dalam memilih jalur perjalanan.

- **Penjaga (🧙)**: Petak duel melawan Penjaga AI. Jenis Penjaga bervariasi tergantung pada wilayah peta, mencerminkan keragaman budaya dan tokoh-tokoh penjaga kearifan lokal dari berbagai daerah di Indonesia.

- **Kartu (🃏)**: Pemain mendapatkan satu kartu aksi secara acak untuk disimpan di inventori dan digunakan pada giliran yang dianggap tepat secara strategis.

- **Markas (🏠)**: Petak istirahat milik masing-masing pemain. Singgah di Markas sendiri memulihkan Tekad sebesar 50 poin, memberikan kesempatan untuk mempersiapkan diri sebelum melanjutkan penjelajahan.

---

### e. Kartu Aksi Kearifan Lokal

Salah satu elemen yang paling membedakan Linimasa dari aplikasi edukasi lainnya adalah **Kartu Aksi Kearifan Lokal**. Kartu-kartu ini merupakan item pembantu dengan identitas budaya Indonesia yang kuat, yang dapat dikumpulkan dan digunakan oleh pemain untuk mendapatkan keuntungan strategis dalam permainan. Terdapat **14 jenis kartu aksi** yang tersedia, dibagi ke dalam dua kategori:

**Kartu Pemulihan Tekad** — terinspirasi dari kuliner dan minuman tradisional Indonesia:

| Kartu | Efek | Inspirasi Budaya |
|---|---|---|
| 🍱 Bekal Perjalanan | +30 Tekad | Tradisi membawa bekal saat perjalanan jauh |
| ☕ Kopi Luwak | +50 Tekad | Kopi premium khas Nusantara |
| 🧪 Jamu Kuat | +70 Tekad | Jamu sebagai warisan pengobatan tradisional |
| 🥥 Air Kelapa | +20 Tekad | Minuman segar alami khas tropis Indonesia |
| 🎒 Ransel Gunung | +40 Tekad | Semangat petualangan pendaki Nusantara |
| 🍢 Sate Padang | +60 Tekad | Kuliner legendaris dari Sumatera Barat |

**Kartu Pergerakan Strategis** — terinspirasi dari moda transportasi dan cara unik berpindah khas Indonesia:

| Kartu | Efek | Inspirasi Budaya |
|---|---|---|
| ⚡ Langkah Kilat | +3 langkah | Gerakan cepat dan gesit |
| 🗺️ Peta Rahasia | +2 langkah | Menjelajah dengan panduan peta kuno |
| 🩴 Sandal Jepit | +1 langkah | Kesederhanaan alat berjalan masyarakat Indonesia |
| 🛵 Ojek Online | +5 langkah | Transportasi andalan modern Indonesia |
| 🚲 Sepeda Lipat | +3 langkah | Gaya hidup aktif dan ramah lingkungan |
| 🐸 Lompatan Katak | +4 langkah | Ketangkasan melompati rintangan |
| 🎟️ Voucher Tiket | +6 langkah | Melaju jauh layaknya naik transportasi publik |
| 🔙 Mundur Cantik | -2 langkah (strategis) | Mundur untuk mengambil posisi yang lebih baik |
| 🌌 Teleportasi Nusantara | Pindah ke petak mana saja | Portal ajaib yang menghubungkan seluruh Nusantara |

Pemilihan nama dan tema setiap kartu bukan sekadar dekorasi. Setiap kartu dirancang sebagai **titik kontak budaya** yang secara tidak langsung memperkenalkan kekayaan kuliner, gaya hidup, dan tradisi Nusantara kepada pengguna dalam konteks yang menyenangkan.

---

### f. Sistem Reward & Kustomisasi (Toko & Profil)

Untuk mempertahankan motivasi jangka panjang pengguna, Linimasa dilengkapi dengan **Sistem Reward** yang komprehensif. Sistem ini bekerja di dua level:

**Level Dalam Sesi Permainan**:
Pemain mengumpulkan **Pijar Sejarah** melalui kuis, tantangan, dan duel. Setiap 5 Pijar yang terkumpul secara otomatis dikonversi menjadi satu **Artefak Nusantara**. Pemain pertama yang berhasil mengumpulkan **3 Artefak** memenangkan permainan. Sistem konversi ini memberikan rasa pencapaian bertahap yang terukur.

**Level Lintas Sesi (Jangka Panjang)**:
Terdapat mata uang global bernama **Mahkota (*Crown*)** yang diperoleh dari menyelesaikan kuis, chapter cerita, dan aktivitas harian di aplikasi. Mahkota dapat digunakan di **Toko (Shop)** untuk membeli:

- **Kartu Aksi Baru**: Memperluas repertoar strategi yang dimiliki pemain.
- **Item Kosmetik Avatar**: Berbagai aksesori, pakaian, dan bingkai profil untuk mempersonalisasi karakter pengguna, mencakup kategori *topi*, *pakaian*, *aksesori*, dan *border* bingkai profil.
- **Gacha Artefak**: Fitur pembukaan hadiah acak untuk mendapatkan item langka.

Selain itu, aplikasi menerapkan sistem **Hati (*Hearts*)** dan **Streak** untuk mendorong konsistensi belajar harian. Hati berfungsi sebagai nyawa dalam sesi kuis — kesalahan menjawab menghabiskan satu Hati — sementara sistem Streak mencatat berapa hari berturut-turut pengguna aktif menggunakan aplikasi, memberikan rasa pencapaian tersendiri bagi pengguna yang konsisten.

---

### g. Mode Cerita Visual Novel

Melengkapi fitur game interaktif, Linimasa juga menghadirkan **Mode Cerita** dalam format *Visual Novel*. Pengguna diajak menjelajahi kisah nyata tokoh-tokoh pahlawan nasional Indonesia melalui dialog interaktif yang dinarasikan oleh dua karakter panduan bernama **Bimo** dan **Santi** — dua siswa yang secara ajaib dapat melintas waktu ke masa lalu.

Sesi perdana mengangkat kisah **R.A. Dewi Sartika**, pahlawan pendidikan perempuan Indonesia, dimulai dari masa kecilnya di Cicalengka pada akhir abad ke-19. Setiap chapter cerita disajikan dengan ilustrasi pendukung yang menggambarkan latar waktu dan suasana bersejarah, serta dialog yang ditulis dengan bahasa yang ramah dan mudah dipahami oleh siswa sekolah dasar.

Setelah menyelesaikan sebuah chapter cerita, pengguna akan diarahkan ke sesi kuis terkait untuk mengukur pemahaman mereka terhadap materi yang baru saja dipelajari, menciptakan siklus pembelajaran yang lengkap: **membaca → memahami → diuji → mendapat reward**.

---

Dengan seluruh komponen konsep tersebut, **Project Linimasa** hadir bukan sekadar sebagai aplikasi bermain, melainkan sebagai sebuah ekosistem belajar yang utuh — di mana setiap interaksi, mulai dari memutar dadu, membaca dialog, hingga memilih kartu, adalah sebuah kesempatan untuk belajar tentang Indonesia.
