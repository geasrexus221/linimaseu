# BUKU PANDUAN LENGKAP PERMAINAN
*Project Linimasa - Single Source of Truth (SSOT) untuk QA & Tester*

Dokumen ini berisi seluruh aturan, mekanik, dan variabel pasti yang tertanam (*hardcoded*) di dalam sumber kode (source code) untuk permainan **Jelajah Nusantara** dan **Adu Cendekiawan**. Dokumen ini dapat digunakan sebagai acuan kebenaran mutlak untuk pengecekan *bug* (QA).

---

## 🎲 BAGIAN 1: JELAJAH NUSANTARA
*Game Papan (Board Game) 3D Multiplayer/Singleplayer*

### 1. Kondisi Kemenangan & Atribut Utama
* **Tekad (HP)**: Mulai dari 100. Batas Maksimal: 100. Jika mencapai 0, pemain berstatus **Tumbang (Fainted)**.
* **Koin Emas**: Atribut finansial utama. Digunakan sebagai biaya menggunakan Kartu Aksi dan mengisi Peti Harta Karun di Markas.
* **Pengisian Peti Harta Karun (Chest Costs)**: 
  * Peti ke-1 (Artefak 1): **200 Koin Emas**
  * Peti ke-2 (Artefak 2): **400 Koin Emas**
  * Peti ke-3 (Artefak 3): **600 Koin Emas**
* **Kemenangan Mutlak**: Pemain yang pertama kali berhasil mengisi **3 Artefak** di Markas (*Base*) miliknya adalah pemenangnya.

### 2. Jenis Petak (Tiles) & Efek Eksak
* **🏠 Markas (Base)**:
  * Pemain yang berhenti di Markas miliknya akan pulih **+50 Tekad** (batas max 100) dan mendapat kesempatan mengisi Peti Harta Karun jika memiliki Koin Emas yang cukup.
  * Merupakan satu-satunya tempat untuk merubah Koin Emas menjadi Artefak.
  * Setiap kali melintasi/melewati Markas sendiri (walaupun tidak berhenti): Otomatis mendapat bonus jalan **+50 Koin Emas**.
* **📦 Peti Koin Emas (Peti)**:
  * Memberikan **+20, +30, +40, atau +50 Koin Emas** secara acak, serta memulihkan **+10 Tekad** secara pasti.
* **📜 Jejak Pengetahuan (Quiz/History)**:
  * Memunculkan kuis sesuai tema materi pelajaran.
  * **Jawaban Benar**: **+50 Koin Emas**.
  * **Jawaban Salah**: **-20 Tekad**.
* **⚔️ Tantangan Penjaga (Guardian)**:
  * Mengadu lemparan dadu (1-6) ditambah bonus stat Serangan/Pertahanan/Kelincahan karakter:
    * *Dadu Pemain + Stat Karakter vs Dadu Penjaga*.
  * **Menang (Skor Pemain > Skor Penjaga)**: **+50 Koin Emas**.
  * **Kalah (Skor Pemain <= Skor Penjaga)**: **-20 Tekad & -30 Koin Emas** (Jika Tekad mencapai 0, pemain menjadi Tumbang).
* **🪤 Jenis-Jenis Jebakan (Trap)**:
  Terdapat 3 jenis petak jebakan spesifik di papan permainan:
  * **💔 Jebakan Duri (jebakan)**: Mengurangi Tekad secara acak sebesar **-20, -30, atau -40 Tekad**.
  * **🌬️ Jebakan Angin (jebakan_mundur)**: Memaksa pemain mundur ke belakang sebanyak **1, 2, atau 3 langkah** secara acak.
  * **🪙 Lubang Koin Bocor (jebakan_pijar)**: Mengurangi Koin Emas sebesar **-30 Koin Emas**.
* **🃏 Kotak Kartu Aksi (Kartu)**:
  * Memberikan 1 kartu aksi acak ke Tas (maksimal penyimpanan **3 kartu**).
  * Jika Tas penuh (3/3), pemain wajib memilih 1 kartu (bisa kartu lama di tas atau kartu baru) untuk dibuang sebelum gilirannya berakhir.

### 3. Laga Cendekia (Duel Papan)
Jika ada 2 pemain aktif yang berhenti di petak yang sama persis, pemain yang baru datang berhak menantang duel kuis:
* Pemenang akan mencuri **hingga 50 Koin Emas** dari pihak yang kalah.
* Pihak yang kalah menerima damage ke Tekad (HP) berdasarkan strategi bertahan yang mereka pilih:
  * **Bertahan (Defend)**: Menggunakan stat Pertahanan. Damage diterima = `(Skor Dadu Penyerang - Skor Dadu Bertahan) * 10`. Jika penyerang kalah/seri, defender tetap terkena **10 Damage (Chip Damage)**.
  * **Menghindar (Evade)**: Menggunakan stat Kelincahan. Damage diterima = `Skor Dadu Penyerang * 10` jika gagal. Jika skor dadu defender lebih besar/sama dengan penyerang, defender berhasil menghindar dan menerima **0 Damage**.
* *Atribut Statistik Karakter*:
  * **Karakter 1 (Agresif)**: Serangan: +2, Pertahanan: +1, Kelincahan: -1.
  * **Karakter 2 (Defensif)**: Serangan: 0, Pertahanan: +2, Kelincahan: +1.

### 4. Status Tumbang (Fainted)
Saat Tekad = 0, pemain pingsan dan wajib melakukan *Recovery Roll* (lempar dadu pemulihan) di setiap awal gilirannya:
* **Percobaan 1**: Lemparan dadu harus **> 5** (Hanya angka **6** yang berhasil). Jika dadu mendapat angka 5, statusnya SERI (*TIE*) dan pemain langsung melempar dadu ulang di giliran yang sama. Angka < 5 dianggap GAGAL.
* **Percobaan 2**: Lemparan dadu harus **> 3** (Angka **4, 5, atau 6** berhasil). Jika dadu mendapat angka 3, statusnya SERI (*TIE*) - melempar dadu ulang. Angka < 3 dianggap GAGAL.
* **Percobaan 3**: Lemparan dadu harus **> 1** (Angka **2, 3, 4, 5, atau 6** berhasil). Jika dadu mendapat angka 1, statusnya SERI (*TIE*) - melempar dadu ulang.
* *Jika berhasil*: Bangkit dengan **50 Tekad** dan giliran berakhir (berjalan pada giliran selanjutnya).
* *Jika gagal*: Tetap Tumbang, giliran dilewati.

### 5. Daftar Lengkap Kartu Aksi
Pemain dapat menggunakan kartu aksi di awal gilirannya sebelum memutar dadu. Penggunaan kartu memerlukan Tekad sebagai biaya (*cost*). Pemain tidak bisa menggunakan kartu jika sisa Tekad kurang dari atau sama dengan biaya kartu (Tekad tidak boleh mencapai 0 akibat menggunakan kartu).

| Ikon | Nama Kartu | Rarity | Cost (Tekad) | Efek Logika |
| :---: | :--- | :---: | :---: | :--- |
| 🍱 | **Bekal Perjalanan** | Common | 10 | Memulihkan **+30 Tekad** secara instan. |
| ❤️ | **Langkah Kilat** | Common | 15 | Bergerak maju **3 langkah** ke depan. |
| ☕ | **Kopi Luwak** | Rare | 20 | Memulihkan **+50 Tekad** secara instan. |
| 🗺️ | **Peta Rahasia** | Common | 10 | Bergerak maju **2 langkah** ke depan. |
| 🩴 | **Sandal Jepit** | Common | 5 | Bergerak maju **1 langkah** ke depan. |
| 🛵 | **Ojek Online** | Epic | 20 | Bergerak maju **5 langkah** ke depan. |
| 🚲 | **Sepeda Lipat** | Common | 12 | Bergerak maju **3 langkah** ke depan. |
| 🧪 | **Jamu Kuat** | Rare | 30 | Memulihkan **+70 Tekad** secara instan. |
| 🥥 | **Air Kelapa** | Common | 8 | Memulihkan **+20 Tekad** secara instan. |
| 🎒 | **Ransel Gunung** | Rare | 15 | Memulihkan **+40 Tekad** secara instan. |
| 🐸 | **Lompatan Katak** | Rare | 18 | Bergerak maju **4 langkah** ke depan. |
| 🔙 | **Mundur Cantik** | Common | 5 | Bergerak mundur **2 langkah** ke belakang. |
| 🎟️ | **Voucher Tiket** | Epic | 25 | Bergerak maju **6 langkah** ke depan. |
| 🍢 | **Sate Padang** | Rare | 25 | Memulihkan **+60 Tekad** secara instan. |
| 🌌 | **Teleportasi** | Epic | 40 | Mengaktifkan Mode Teleportasi: Klik petak mana saja di papan untuk pindah ke sana. |

### 6. Logika AI (Bot) Jelajah Nusantara
* Bot memiliki waktu berpikir (*think delay*) sebesar 1.5 detik (1500ms).
* Bot akan otomatis memilih berhenti di Markas (tidak lanjut jalan) jika Tekad mereka di bawah 70.

---

## ⚔️ BAGIAN 2: ADU CENDEKIAWAN
*Mode Duel Cerdas Cermat Cepat (Tarik Tambang)*

### 1. Aturan Dasar & Kondisi Menang
* **Tekad (HP)**: Maksimal 10 HP. Pemain dan Bot sama-sama memulai dengan 10 HP.
* **Waktu Menjawab (Timer)**: 20 Detik per soal (bisa diubah dari *Config*).
* **Jumlah Soal**:
  * Tingkat Mudah = 10 Soal.
  * Tingkat Normal = 15 Soal.
  * Tingkat Sulit = 20 Soal.
* **Kemenangan**: Pemain yang menghabiskan HP lawannya terlebih dahulu menang. Jika soal habis, pemain dengan sisa HP terbanyak menang. Jika sama, hasilnya *Tie* (Seri).

### 2. Mode Aksi & Perhitungan Poin (Damage/Heal)
Setiap pemain/bot dapat memilih antara mode **Serang (Attack)** atau **Pulih (Heal)** sebelum menjawab.

* **Penalti Jawaban Salah / Kehabisan Waktu**:
  * Mode apapun, jika salah/habis waktu: **-1 HP** ke diri sendiri.
* **Poin Jawaban Benar (Berdasarkan Kecepatan Menjawab)**:
  * **+3 Poin**: Menjawab dengan sisa waktu di atas 70%.
  * **+2 Poin**: Menjawab dengan sisa waktu di atas 50%.
  * **+1 Poin**: Menjawab dengan sisa waktu di bawah 50%.
* **Bonus Karakter Pasif**:
  * **Karakter 1 (Tipe Agresif)**: Mendapat tambahan **+1 Poin Serangan** setiap kali menjawab benar dalam mode Serang.
  * **Karakter 2 (Tipe Defensif)**: Mendapat tambahan **+1 Poin Pulih** setiap kali menjawab benar dalam mode Pulih.
* **Aplikasi Poin**: 
  * Jika Mode Serang: Poin akan mengurangi HP lawan (Damage).
  * Jika Mode Pulih: Poin akan menambah HP diri sendiri (Heal, maksimal 10 HP).

### 3. Logika AI (Bot) Adu Cendekiawan
Setiap tingkat kesulitan mengatur seberapa cerdas dan seberapa cepat bot bereaksi:
* **Tingkat Mudah**:
  * Akurasi Jawaban Benar: 50%
  * Waktu Reaksi (Mikir): Acak antara 7 hingga 14 detik.
* **Tingkat Normal**:
  * Akurasi Jawaban Benar: 75%
  * Waktu Reaksi (Mikir): Acak antara 4 hingga 10 detik.
* **Tingkat Sulit**:
  * Akurasi Jawaban Benar: 90%
  * Waktu Reaksi (Mikir): Acak antara 1.5 hingga 6 detik.
* **Pemilihan Mode Bot**:
  * Jika HP bot masih penuh (10 HP), Bot 100% memilih Mode Serang.
  * Jika HP bot di bawah batas maksimal, Bot memiliki probabilitas **30% memilih Mode Pulih**, 70% Mode Serang.

### 4. Daftar & Efek Item Bantuan (Cards)
Pemain bisa menggunakan kartu sebelum soal dimulai. Kartu memerlukan waktu 2 detik (*reveal animation*) sebelum aktif.

| Nama Item | Ikon | Rarity | Efek di dalam Kode (Hardcoded Logic) |
| :--- | :---: | :---: | :--- |
| **Kompas 50:50** | 🧭 | Common | Menghilangkan secara acak 2 pilihan jawaban yang salah. |
| **Pemberat** | ⚓ | Rare | Jika jawaban Anda Benar, poin yang didapat akan dikali 2 (Ganda). |
| **Tameng** | 🛡️ | Epic | Melindungi/Memblokir serangan lawan (jika Anda menjawab salah dan lawan menyerang). |
| **Jam Pasir** | ⏳ | Common | Pengatur waktu (*Timer*) berjalan 2x lebih lambat (turun setiap 2 detik). |
| **Magnet Pengacau** | 🧲 | Rare | Menunda (*Delay*) respon jawaban Bot secara mutlak selama 4 Detik tambahan. |
| **Palu Petir** | ⚡ | Epic | Membuat Bot terkena Stun; Bot akan divonis tidak menjawab (*timeTaken = MAX, answer = -1*). |
| **Ramuan Ajaib** | 🧪 | Common | Langsung memulihkan HP Anda sebanyak **+3 HP** (Instan saat diaktifkan). |
| **Bom Buku** | 💣 | Rare | Langsung mengurangi HP Bot sebanyak **-3 HP** (Instan saat diaktifkan). |
| **Teropong Bintang**| 🔭 | Epic | Tidak memiliki efek teknis manipulasi poin, murni bantuan visual. (Menyoroti/highlight letak jawaban benar). |

---
*Dokumen ini merupakan intisari langsung dari kode Project Linimasa dan harus dijadikan panduan kebenaran untuk segala pengujian logika permainan.*
