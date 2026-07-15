# 📊 Diagram Alur Sistem (System Flowchart) — Project Linimasa

Dokumen ini berisi rancangan **System Flowchart** (Diagram Alur Sistem) untuk seluruh modul aplikasi **Project Linimasa**. Berbeda dengan *User Flow* (yang hanya menggambarkan langkah navigasi pengguna), *System Flowchart* berfokus pada **bagaimana sistem memproses input, mengambil keputusan logis, melakukan manajemen data di memori, membaca/menulis ke media penyimpanan, dan menghasilkan output antarmuka**.

Setiap modul dilengkapi dengan dua format diagram:
1. **Diagram Alur Teks (ASCII/Unicode Box):** Format teks terstruktur menggunakan istilah sistem yang generik dan formal dalam bahasa Indonesia (tanpa referensi kode teknis), siap disalin-tempel (copy-paste) ke dalam dokumen Microsoft Word untuk penulisan **BAB IV Skripsi**.
2. **Diagram Alur Grafis (Mermaid JS):** Format grafis interaktif menggunakan istilah generik yang ter-render otomatis saat dibuka dengan Markdown Viewer.

---

## 1. ⚙️ Arsitektur Alur Sistem Global (Global System Flow)

Menggambarkan siklus hidup sistem dari saat aplikasi dijalankan, inisialisasi sistem, pemeriksaan data pada penyimpanan lokal, pemeriksaan status autentikasi, pembagian menu berdasarkan peran pengguna (Siswa/Guru), hingga pembaruan data secara persisten.

### A. Diagram Alur Teks (Copy-Pasteable)
```
                                  ( Mulai )
                                      │
                                      ▼
                             Inisialisasi Sistem
                                      │
                                      ▼
                             Membaca Database
                                      │
                      ┌───────────────┴───────────────┐
                      ▼ Ada                           ▼ Tidak Ada
               Memuat Data Pengguna            Setel Data Default
             (Profil, Skor, Lencana)          (Pengguna Baru, Skor=0)
                      │                               │
                      └───────────────┬───────────────┘
                                      ▼
                          Memeriksa Status Login
                                      │
                      ┌────────────────┴────────────────┐
                      ▼ Belum                         ▼ Sudah
             Tampilkan Menu Autoktifikasi       Memeriksa Peran Pengguna
                      │                               │
                      ▼                        ┌──────┴──────┐
              Input Kredensial                 ▼ Siswa       ▼ Guru
                      │                     Tampilkan      Tampilkan
                      ▼                     Menu Siswa    Dasbor Guru
               Validasi Data                   │              │
                      │                        ▼              ▼
               ┌──────┴──────┐             Pilih Fitur    Pilih Aksi
               ▼ Gagal       ▼ Sukses      (Materi, Kuis, (Kelola Kelas,
             Tampilkan     Simpan Status     Game, Toko)    Buat Soal)
               Error           Login           │              │
               │               │               └──────┬───────┘
               ▼               ▼                      │
            Ulangi       Setel Session                ▼
               │               │           Simpan Perubahan Data ke
               └───────────────┼─────────→         Database
                               │                      │
                               ▼                      ▼
                            Selesai                ( Selesai )
```

### B. Diagram Alur Grafis (Mermaid JS)
```mermaid
flowchart TD
    Start([Mulai]) --> InitSystem[Inisialisasi Sistem]
    InitSystem --> ReadStorage{Membaca Database?}
    
    ReadStorage -- Ada --> LoadUserData[Memuat Data Pengguna: Profil, Skor, Lencana]
    ReadStorage -- Tidak --> SetDefaultData[Setel Data Default: Pengguna Baru, Skor=0]
    
    SetDefaultData --> CheckLogin{Membaca Status Login?}
    LoadUserData --> CheckLogin
    
    CheckLogin -- Belum --> ShowAuth[Tampilkan Menu Autentikasi]
    ShowAuth --> InputCredentials[Input Kredensial]
    InputCredentials --> ValidateCredentials{Validasi Data?}
    ValidateCredentials -- Gagal --> ShowError[Tampilkan Error] --> ShowAuth
    ValidateCredentials -- Sukses --> SaveLoginStatus[Simpan Status Login & Setel Session] --> CheckLogin
    
    CheckLogin -- Sudah --> CheckRole{Memeriksa Peran Pengguna?}
    
    CheckRole -- Guru --> TeacherDashboard[Tampilkan Dasbor Guru]
    TeacherDashboard --> TeacherAction{Pilih Aksi Guru}
    TeacherAction -->|Kelola Kelas| ClassCRUD[Proses Data Kelas]
    TeacherAction -->|Buat Soal| QuestionCRUD[Proses Pembuatan Soal]
    TeacherAction -->|Kirim Tugas| AssignTask[Kirim Tugas ke Kelas Siswa]
    ClassCRUD & QuestionCRUD & AssignTask --> SaveData[(Simpan Perubahan Data ke Database)]
    
    CheckRole -- Siswa --> StudentDashboard[Tampilkan Menu Siswa]
    StudentDashboard --> StudentAction{Pilih Fitur Siswa}
    
    StudentAction -->|dashboard| ModuleDash[Menu Dasbor: Misi Harian, Pengumuman]
    StudentAction -->|story| ModuleStory[Menu Materi: Peta Alur & Visual Novel]
    StudentAction -->|quiz| ModuleQuiz[Menu Kuis: Evaluasi Mandiri & Kelas]
    StudentAction -->|game| ModuleGame[Menu Game: Pilihan Permainan]
    StudentAction -->|shop| ModuleShop[Menu Toko: Transaksi Item & Hadiah]
    StudentAction -->|profile| ModuleProfile[Menu Profil: Museum & Kustomisasi]
    
    ModuleDash & ModuleStory & ModuleQuiz & ModuleGame & ModuleShop & ModuleProfile --> SaveData
    SaveData --> End([Selesai])
```

---

## 2. 🔐 Alur Sistem Modul Autentikasi (Authentication System Flow)

Memetakan logika pendaftaran akun baru dan verifikasi masuk dengan validasi multi-peran (Guru vs Siswa) serta perulangan jika kredensial salah.

### A. Diagram Alur Teks (Copy-Pasteable)
```
                                       Mulai
                                         │
                                         ▼
                               Tampilkan Pilihan User
                                   (Siswa / Guru)
                                         │
                         ┌───────────────┴───────────────┐
 ┌────────────────► Menu Registrasi                  Menu Login ◄──────────────────┐
 │                       │                               │                         │
 │                       ▼                               ▼                         │
 │              Input Akun Baru (Nama,            Input Username & Password         │
 │               Username, Password)                     │                         │
 │                       │                               ▼                         │
 │                       ▼                       Cek Akun di Database              │
 │                  Validasi Username                    │                         │
 │                       │                       ┌───────┴───────┐                 │
 │               ┌───────┴───────┐               ▼ Valid         ▼ Salah           │
 │               ▼ Terdaftar     ▼ Unik      Simpan Status Sesi Tampilkan Error    │
 │        Tampilkan Error    Buat Akun           │               │                 │
 │               │               │               ▼               ▼                 │
 │               ▼               ▼               │              Ulangi ─────────────┘
 │            Kembali       Simpan Data          │
 │               │               │               │
 └───────────────┘               ▼               │
                            Auto Login           │
                                 │               │
                                 ▼               ▼
                         Arahkan ke Beranda ◄────┘
                                 │
                                 ▼
                              Selesai
```

### B. Diagram Alur Grafis (Mermaid JS)
```mermaid
flowchart TD
    Start([Mulai]) --> ShowRoleSelection[Tampilkan Pilihan User: Siswa / Guru]
    ShowRoleSelection --> ChooseAction{Pilih Menu?}
    ChooseAction -->|Registrasi| ShowRegister[Menu Registrasi]
    ChooseAction -->|Login| ShowLogin[Menu Login]
    
    ShowRegister --> InputNewAccount[Input Akun Baru: Nama, Username, Password]
    InputNewAccount --> CheckUnique{Validasi Username?}
    CheckUnique -- Terdaftar --> ShowRegError[Tampilkan Error] --> ShowRegister
    CheckUnique -- Unik --> CreateAccount[Buat Akun Baru & Simpan Data]
    CreateAccount --> AutoLogin[Auto Login & Arahkan ke Beranda]
    
    ShowLogin --> InputCredentials[Input Username & Password]
    InputCredentials --> QueryAccount{Cek Akun di Database?}
    QueryAccount -- Salah --> ShowLoginError[Tampilkan Error] --> ShowLogin
    QueryAccount -- Valid --> SaveSession[Simpan Status Sesi & Arahkan ke Beranda]
    
    AutoLogin & SaveSession --> End([Selesai])
```

---

## 3. 🎓 Alur Sistem Dasbor Siswa & Pengecekan Streak

Modul yang berjalan secara otomatis untuk menghitung selisih waktu guna meregenerasi poin Energi (Nyawa) dan memperbarui status keaktifan beruntun (Streak).

### A. Diagram Alur Teks (Copy-Pasteable)
```
                              Akses Halaman Beranda
                                         │
                                         ▼
                             Panggil useHeartRegen
                                         │
                                         ▼
                            Cek Sisa Nyawa (Hearts)
                                         │
                        ┌────────────────┴────────────────┐
                        ▼ < 5                             ▼ = 5
               Hitung Selisih Waktu               Nyawa Tetap Penuh
            (Waktu Sekarang - LastRegen)                  │
                        │                                 │
                        ▼                                 │
               Regenerasi Nyawa                           │
               (Tiap 30 Menit = +1)                       │
                        │                                 │
                        └────────────────┬────────────────┘
                                         ▼
                             Pengecekan Streak Hari
                                         │
                        ┌────────────────┴────────────────┐
                        ▼ > 1 Hari                        ▼ <= 1 Hari
             Hitung Selisih Hari                  Streak Aktif
                        │                                 │
             ┌──────────┴──────────┐                      ▼
             ▼ <= 2 Hari           ▼ > 2 Hari        Pertahankan /
        Pertahankan Streak       Reset Streak        Tambah Streak
             (Gunakan Obor)         (Streak = 0)          │
             (Jika Diaktifkan)             │              │
             │                             │              │
             └──────────┬──────────────────┘              │
                        └────────────────┬────────────────┘
                                         ▼
                            Muat Misi Harian & Progres
                                         │
                                         ▼
                              Muat Pengumuman Guru
                                         │
                                         ▼
                             Render Tampilan Dasbor
                                         │
                                         ▼
                                     Selesai
```

### B. Diagram Alur Grafis (Mermaid JS)
```mermaid
flowchart TD
    Start([Mulai]) --> TriggerHeartRegen[Proses Pemulihan Energi]
    TriggerHeartRegen --> GetTime[Ambil Waktu Cek & Waktu Terakhir]
    GetTime --> CheckHearts{Cek Sisa Energi Aktif?}
    
    CheckHearts -- Ya --> CalcHeartDiff[Hitung Selisih Waktu per 30 Menit]
    CalcHeartDiff --> AddHearts[Regenerasi Energi Baru]
    AddHearts --> UpdateHeartTime[Perbarui Waktu Pengambilan]
    CheckHearts -- Tidak --> IdleHeart[Status Penuh]
    
    UpdateHeartTime & IdleHeart --> CheckStreak[Pengecekan Keaktifan Harian]
    CheckStreak --> GetStreakTime[Ambil Waktu Login Terakhir]
    GetStreakTime --> CalcDayDiff{Hitung Selisih Hari?}
    CalcDayDiff -->|> 1 Hari tetapi <= 2 Hari| KeepStreak[Pertahankan Keaktifan dengan Item]
    CalcDayDiff -->|> 2 Hari| BreakStreak[Reset Keaktifan: Streak = 0]
    CalcDayDiff -->|Hari yang sama| IdleStreak[Abaikan]
    
    KeepStreak & BreakStreak & IdleStreak --> LoadDailyQuests[Muat Progress Misi Harian]
    LoadDailyQuests --> RenderDashboard[Render Antarmuka Dasbor]
    RenderDashboard --> End([Selesai])
```

---

## 4. 🧠 Alur Sistem Kuis Interaktif (Quiz Hub Engine)

Engine evaluasi pemahaman yang memproses permintaan soal ke server, memproses input jawaban siswa, melakukan validasi jawaban di server, dan mengirimkan hasil evaluasi kembali ke server.

### A. Diagram Alur Teks (Copy-Pasteable)
```
                                    Mulai Kuis
                                         │
                                         ▼
                             Meminta Data dari Server
                                         │
                                         ▼
                                   Menerima Data
                                         │
                                         ▼
                                    Urutan Soal
                                         │
                                         ▼
                               Tampilkan Soal Aktif ◄─────────────────────┐
                                         │                                │
                                         ▼                                │
                                Input Jawaban Siswa                       │
                                         │                                │
                                         ▼                                │
                               Kirim Data Jawaban                         │
                                         │                                │
                                         ▼                                │
                              Validasi Data Jawaban                       │
                                         │                                │
                        ┌────────────────┴────────────────┐               │
                        ▼ Benar                           ▼ Salah         │
                Tambah Skor & Poin XP              Kurangi Energi (-1 Nyawa)│
                        │                                 │               │
                        └────────────────┬────────────────┘               │
                                         ▼                                │
                             Tampilkan Penjelasan Soal                    │
                                         │
                        ┌────────────────┴────────────────┐               │
                        ▼ Energi > 0 & Soal Sisa          ▼ Energi habis /│
                        Indeks Soal +1                       Soal Selesai │
                        │                                         │       │
                        └─────────────────────────────────────────┼───────┘
                                                                  ▼
                                                          Hitung Skor Akhir
                                                                  │
                                                                  ▼
                                                           Kirim Data Hasil
                                                                  │
                                                                  ▼
                                                        Simpan Perubahan Data
                                                                  │
                                                                  ▼
                                                      Tampilkan Hasil Evaluasi
                                                                  │
                                                                  ▼
                                                             ( Selesai )
```

### B. Diagram Alur Grafis (Mermaid JS)
```mermaid
flowchart TD
    Start([Mulai]) --> RequestQuiz[Meminta Data dari Server]
    RequestQuiz --> ReceiveQuiz[Menerima Data]
    ReceiveQuiz --> ShuffleQuestions[Urutan Soal]
    ShuffleQuestions --> RenderQuestion[Tampilkan Soal Aktif]
    
    RenderQuestion --> UserSubmit[Input Jawaban Siswa]
    UserSubmit --> SendAnswer[Kirim Data Jawaban]
    SendAnswer --> EvalAnswer{Validasi Data Jawaban?}
    
    EvalAnswer -- Benar --> AddPoints[Tambah Skor & Poin XP]
    EvalAnswer -- Salah --> DeductHeart[Kurangi Energi]
    
    AddPoints & DeductHeart --> ShowFeedback[Tampilkan Penjelasan Soal]
    ShowFeedback --> CheckEndConditions{Energi habis atau Soal Selesai?}
    
    CheckEndConditions -- Tidak --> IncrementIndex[Indeks Soal +1] --> RenderQuestion
    
    CheckEndConditions -- Ya --> RenderResult[Tampilkan Hasil Evaluasi]
    RenderResult --> SendResults[Kirim Data Hasil]
    SendResults --> UpdateStore[Simpan Perubahan Data]
    UpdateStore --> End([Selesai])
```

---

## 5. 🎲 Alur Sistem Game Papan 3D (Jelajah Nusantara Engine)

Mengendalikan logika giliran permainan papan, simulasi dadu, pergerakan bidak langkah-demi-langkah, penanganan petak peristiwa, pertempuran bidak, dan status pingsan (*fainted*).

### A. Diagram Alur Teks (Copy-Pasteable)
```
                                 Mulai Permainan
                                        │
                                        ▼
 ┌──────────────────────► Inisialisasi Data Pemain ◄────────────────────────────┐
 │                                      │                                       │
 │                                      ▼                                       │
 │                              Mulai Giliran Baru                              │
 │                                      │                                       │
 │                                      ▼                                       │
 │                           Memeriksa Status Pemain                            │
 │                                      │                                       │
 │                    ┌─────────────────┴─────────────────┐                     │
 │                    │ Energi = 0                        ▼ Energi > 0          │
 │                    │                            Putar Dadu Utama             │
 │                    │                              (Nilai 1 - 6)              │
 │                    ▼                                   │                     │
 │           Lempar Dadu Pemulihan                        ▼                     │
 │                    │                            Fase Pergerakan              │
 │                ┌───┴───┐                               │                     │
 │                ▼ Sukses▼ Gagal                         ▼                     │
 │                Energi +50 Giliran                Bidak Bergerak ◄────────┐   │
 │                          Lewat                         │                 │   │
 │                │       │                               ▼                 │   │
 │                └───┬───┘                     Melewati Markas Sendiri?    │   │
 │                    ▼                            ┌──────┴──────┐          │   │
 │            Giliran Berikutnya                   ▼ Ya          ▼ Tidak    │   │
 │                    │                         Koin +50   Ada Lawan di Ubin?   │
 └────────────────────┘                            │       ┌──────┴──────┐      │
                                                   │       ▼ Ya          ▼ Tidak│
                                                   │   Picu Duel   Cek Persimpangan?│
                                                   │  Laga Cendekia       │     │   │
                                                   │       │       ┌──────┴──────┐  │
                                                   │       │       ▼ Ya          ▼ Tidak
                                                   │       │   Pilih Arah     Lanjut│
                                                   │       │       │            │   │
                                                   └───────┼───────┴────────────┘   │
                                                           ▼                        │
                                                   Langkah Dadu = 0?                │
                                                           │                        │
                                                   ┌───────┴───────┐                │
                                                   ▼ Tidak         ▼ Ya             │
                                            Sisa Langkah -1      Landed             │
                                                   │               │                │
                                                   └───────────────┼────────────┐   │
                                                                   ▼            │   │
                                                           Logika Aksi Petak    │   │
                                                                   │            │   │
                                                                   ▼            │   │
                                                            Tampilkan Event     │   │
                                                                   │            │   │
                                                                   ▼            │   │
                                                           Cek Syarat Menang    │   │
                                                                   │            │   │
                                                   ┌───────────────┴───────┐    │   │
                                                   ▼ Ya                    ▼ Tidak  │
                                             Victory Screen       Giliran Berikutnya│
                                                   │                       │        │
                                                   ▼                       ▼        │
                                                Selesai           Giliran Berikutnya│
                                                                           │        │
                                                                           └────────┘
```

### B. Diagram Alur Grafis (Mermaid JS)
```mermaid
flowchart TD
    Start([Mulai]) --> InitPlayers[Inisialisasi Data Pemain: Energi=100, Koin=0, Base]
    InitPlayers --> SetPhaseRoll[Setel Fase: Menunggu Dadu]
    
    SetPhaseRoll --> CheckPlayerStatus{Memeriksa Status Pemain?}
    
    CheckPlayerStatus -- Pingsan --> RecoveryWaiting[Fase Pemulihan]
    RecoveryWaiting --> RollRecoveryDice[Lempar Dadu Pemulihan]
    RollRecoveryDice --> CalcRecovery{Apakah Dadu Sukses?}
    CalcRecovery -- Ya --> RecoverPlayer[Energi = 50 & Pingsan = false] --> GiliranBerikutnya[Giliran Berikutnya]
    CalcRecovery -- Gagal --> SkipTurn[Giliran Dilewati] --> GiliranBerikutnya
    
    GiliranBerikutnya --> InitPlayers
    
    CheckPlayerStatus -- Sehat --> RollDice[Putar Dadu Utama: Nilai 1 - 6]
    RollDice --> SetPhaseMoving[Fase Pergerakan]
    
    SetPhaseMoving --> MoveOneStep[Bidak Bergerak]
    MoveOneStep --> CheckBasePass{Melewati Markas?}
    CheckBasePass -- Ya --> AddBasePassCoin[Koin +50] --> CheckOpponent{Ada Lawan di Ubin?}
    CheckBasePass -- Tidak --> CheckOpponent
    
    CheckOpponent -- Ya --> TriggerDuel[Picu Duel Laga Cendekia] --> CheckStepsLeft
    CheckOpponent -- Tidak --> CheckIntersection{Cek Persimpangan?}
    
    CheckIntersection -- Ya --> WaitPathChoice[Pilih Arah] --> CheckStepsLeft
    CheckIntersection -- Tidak --> CheckStepsLeft
    
    CheckStepsLeft{Langkah Dadu = 0?}
    CheckStepsLeft -- Tidak --> MoveOneStep
    
    CheckStepsLeft -- Ya --> ResolveTile[Landed: Logika Aksi Petak]
    ResolveTile --> CallTileHandler[Eksekusi Handler Aksi Petak]
    
    CallTileHandler --> EventModal[Tampilkan Event & Jalankan Logika]
    EventModal --> ApplyStateUpdate[Perbarui Energi / Koin / Item Pemain]
    ApplyStateUpdate --> CheckWin{Cek Syarat Menang?}
    
    CheckWin -- Ya --> VictoryScreen[Tampilkan Victory Screen] --> EndGame([Selesai])
    CheckWin -- Tidak --> GiliranBerikutnyaNormal[Giliran Berikutnya] --> InitPlayers
```

---

## 6. ⚔️ Alur Sistem Duel 1v1 (Adu Cendekiawan)

Duel kecerdasan 1v1 yang menggabungkan parameter atribut serangan/pertahanan/kelincahan karakter, pemilihan taktik aksi (Serang/Pulih), dan pengurangan poin Poin Nyawa.

### A. Diagram Alur Teks (Copy-Pasteable)
```
                                   Mulai Duel
                                         │
                                         ▼
                             Inisialisasi Data Pemain
                                         │
                                         ▼
  ┌─────────────────────────► Persiapan Tindakan
  │                                      │
  │                                      ▼
  │                             Tampilkan Pertanyaan
  │                                      │
  │                                      ▼
  │                                Kirim Jawaban
  │                                      │
  │                                      ▼
  │                               Evaluasi Jawaban
  │                                      │
  │                                      ▼
  │                           Kalkulasi & Cek Sisa Nyawa
  │                                      │
  │                      ┌───────────────┴───────────────┐
  │                      ▼ Belum Selesai                 ▼ Selesai
  │               Pertanyaan Berikut            Kalkulasi Total Skor
  │                      │                               │
  ┌──────────────────────┘                               ▼
                                                  Layar Kemenangan
                                                         │
                                                         ▼
                                                      Selesai
```

### B. Diagram Alur Grafis (Mermaid JS)
```mermaid
flowchart TD
    Start([Mulai]) --> SetupDeck[Inisialisasi Data Pemain]
    SetupDeck --> SetInitialHP[Setel Nyawa Pemain & Lawan]
    
    SetInitialHP --> PrepTurn[Persiapan Tindakan]
    PrepTurn --> ChooseMode[Pilih Taktik]
    ChooseMode --> ChooseItem{Gunakan Item?}
    ChooseItem -- Ya --> ApplyItem[Gunakan Item] --> RenderQuestionTT
    ChooseItem -- Tidak --> RenderQuestionTT
    
    RenderQuestionTT[Tampilkan Pertanyaan]
    RenderQuestionTT --> UserAnswer[Kirim Jawaban]
    
    UserAnswer --> EvalDuelAnswer{Evaluasi Jawaban}
    EvalDuelAnswer --> CalcHP{Kalkulasi & Cek Sisa Nyawa}
    
    CalcHP -- Belum Selesai --> NextQuestionTT[Pertanyaan Berikut] --> PrepTurn
    
    CalcHP -- Selesai --> EvalWinner[Kalkulasi Total Skor]
    EvalWinner --> VictoryScreen[Layar Kemenangan]
    VictoryScreen --> EndGameTT([Selesai])
```

---

## 7. 🪂 Alur Sistem Game Mini Layangan (Flappy Kite Logic)

Loop simulasi fisika dinamis 2D (kecepatan vertikal & gravitasi) yang disisipi gerbang pertanyaan kuis interaktif selama penerbangan layangan.

### A. Diagram Alur Teks (Copy-Pasteable)
```
                                Mulai Layangan
                                       │
                                       ▼
                             Inisiasi Koordinat
                            (Y = 300, HP = 3, Skor = 0)
                                       │
                                       ▼
                             Hitung Mundur 3s
                                       │
                                       ▼
                                 Game Loop ◄──────────────────────────────────────┐
                                       │                                          │
                      ┌────────────────┴────────────────┐                         │
                      ▼                                 ▼                         │
              Terapkan Gravitasi              Deteksi Input Jump                  │
             (Kite jatuh kebawah)                (Layar diketuk)                  │
                      │                                 │                         │
                      │                                 ▼                         │
                      │                          Beri Gaya Keatas                 │
                      │                           (Kite melompat)                 │
                      │                                 │                         │
                      └────────────────┬────────────────┘                         │
                                       ▼                                          │
                             Gerakkan Tiang Pipa                                  │
                               (Kanan ke Kiri)                                    │
                                       │                                          │
                      ┌────────────────┴────────────────┐                         │
                      ▼                                 ▼                         │
             Cek Tabrakan Pipa                Cek Gerbang Kuis                    │
                      │                                 │                         │
            ┌─────────┴─────────┐              ┌────────┴────────┐                │
            ▼ Ya                ▼ Tidak        ▼ Ya              ▼ Tidak          │
         HP = HP - 1          Skor Tiang +1  Tampilkan Soal      Terbang Lanjut   │
            │                                  │                                  │
            ▼                                  ▼                                  │
      Cek HP = 0?                         Pilih Opsi Gerbang (A/B)                │
            │                                  │                                  │
            │                         ┌────────┴────────┐                         │
            │                         ▼ Benar           ▼ Salah                   │
            │                     Skor Kuis +20         HP = HP - 1               │
            │                         │                 │                         │
            │                         └────────┬────────┘                         │
            │                                  ▼                                  │
            │                             Cek HP = 0?                             │
            │                                  │                                  │
            └────────────────┬─────────────────┘                                  │
                             ▼                                                    │
                     HP = 0 / Nabrak Batas?                                       │
                             │                                                    │
                    ┌────────┴────────┐                                           │
                    ▼ Ya              ▼ Tidak                                     │
                Game Over          Lanjut Loop ───────────────────────────────────┘
                    │
                    ▼
              Hitung Bintang
             (Tambahkan ke Store)
                    │
                    ▼
                 Selesai
```

### B. Diagram Alur Grafis (Mermaid JS)
```mermaid
flowchart TD
    Start([Mulai]) --> InitKite[Inisiasi Koordinat: Y=300, HP=3, Skor=0]
    InitKite --> LaunchCountdown[Hitung Mundur 3s]
    
    LaunchCountdown --> GameLoop[Game Loop: Terapkan Gravitasi & Kecepatan]
    GameLoop --> InputJump{Deteksi Input Jump?}
    InputJump -- Ya --> ApplyImpulse[Beri Gaya Keatas / Melompat] --> RenderFrame
    InputJump -- Tidak --> ApplyGravity[Terapkan Gravitasi Ke bawah] --> RenderFrame
    
    RenderFrame --> MovePipes[Gerakkan Tiang Rintangan]
    MovePipes --> CheckPipePassed{Cek Tiang Terlewati?}
    CheckPipePassed -- Ya --> AddPipeScore[Skor Tiang +1] --> CheckGateCollision
    MovePipes --> CheckPipeCollision{Cek Tabrakan Rintangan?}
    CheckPipeCollision -- Ya --> DeductKiteHP[HP Rintangan -1] --> CheckGateCollision
    CheckPipeCollision -- Tidak --> CheckGateCollision
    
    CheckGateCollision --> CheckGate{Menabrak Gerbang Kuis?}
    CheckGate -- Ya --> PromptQuestion[Tampilkan Soal Kuis di Layar]
    PromptQuestion --> UserChooseGate[Pilih Opsi Gerbang: A / B]
    UserChooseGate --> EvalGateAnswer{Evaluasi Jawaban Gerbang?}
    EvalGateAnswer -- Benar --> BonusScore[Skor Kuis +20 & Tambah Kecepatan] --> CheckKiteHP
    EvalGateAnswer -- Salah --> DamageGate[HP Rintangan -1] --> CheckKiteHP
    CheckGate -- Tidak --> CheckKiteHP
    
    CheckKiteHP{HP Rintangan == 0 atau Jatuh Batas?}
    CheckKiteHP -- Tidak --> GameLoop
    
    CheckKiteHP -- Ya --> SetGameOver[Setel Status Game Over]
    SetGameOver --> CalcStars[Hitung Perolehan Bintang Akhir]
    CalcStars --> SaveStars[Simpan Perolehan Bintang]
    SaveStars --> EndKite([Selesai])
```

---

## 8. 🛒 Alur Sistem Transaksi Toko & Pembukaan Peti (Shop & Gacha)

Logika pemrosesan pengurangan saldo koin Bintang untuk membeli item aksesoris, pemulihan Energi, atau penukaran kotak peti misteri (gacha).

### A. Diagram Alur Teks (Copy-Pasteable)
```
                                   Menu Toko
                                       │
 ┌───────────────────────────► Pilih Kategori Item ◄─────────────────────────┐
 │                                     │                                     │
 │       ┌─────────────────────────────┼─────────────────────────────┐       │
 │       ▼                             ▼                             ▼       │
 │Aksesoris Tampilan           Pemulihan Energi                 Kotak Peti   │
 │       │                             │                             │       │
 │       ▼                             ▼                             ▼       │
 │  Pilih Item                    Pilih Paket               Pilih Jumlah Kotak│
 │       │                             │                             │       │
 │       └─────────────────────────────┼─────────────────────────────┘       │
 │                                     ▼                                     │
 │                            Konfirmasi Pembelian                           │
 │                                     │                                     │
 │                                     ▼                                     │
 │                          Cek Saldo Koin Bintang                           │
 │                                     │                                     │
 │                           ┌─────────┴─────────┐                           │
 │                           ▼                   ▼                           │
 │                      Saldo Cukup         Saldo Kurang                     │
 │                           │                   │                           │
 │                           ▼                   ▼                           │
 │                   Transaksi Diproses     Tampilkan Peringatan             │
 │                           │                       │                       │
 │       ┌───────────────────┼────────────────___┘                           │
 │       ▼                   ▼                   ▼                           │
 │  Penyimpanan           Energi/              Buka                          │
 │  Inventori            Karakter           Kotak Acak                       │
 │  Bertambah            Bertambah           (Artefak)                       │
 │       │                   │                   │                           │
 │       └───────────────────┼───────────────────┘                           │
 │                           ▼                                               │
 │                Pengurangan Saldo Koin                                     │
 │                           │                                               │
 └───────────────────────────┴───────────────────────────────────────────────┘
```

### B. Diagram Alur Grafis (Mermaid JS)
```mermaid
flowchart TD
    Start([Mulai]) --> OpenShop[Menu Toko]
    OpenShop --> ChooseCategory[Pilih Kategori Item]
    
    ChooseCategory -->|Aksesoris Tampilan| SelectCosmetic[Pilih Item]
    ChooseCategory -->|Pemulihan Energi| SelectRefill[Pilih Paket]
    ChooseCategory -->|Kotak Acak| SelectGacha[Pilih Jumlah Kotak]
    
    SelectCosmetic & SelectRefill & SelectGacha --> ConfirmPurchase[Konfirmasi Pembelian]
    ConfirmPurchase --> CheckBalance[Cek Saldo Koin Bintang]
    
    CheckBalance --> BalanceCheck{Apakah Saldo Cukup?}
    BalanceCheck -- Tidak --> ShowWarning[Tampilkan Peringatan & Batal Transaksi] --> ChooseCategory
    BalanceCheck -- Ya --> ProcessTransaction[Transaksi Diproses]
    
    ProcessTransaction --> ItemRouting{Deteksi Kategori Item?}
    ItemRouting -->|Aksesoris Tampilan| SaveCosmetics[Penyimpanan Inventori Bertambah]
    ItemRouting -->|Pemulihan Energi| AddConsumables[Energi / Karakter Bertambah]
    ItemRouting -->|Kotak Acak| OpenGachaScreen[Buka Kotak Acak & Dapatkan Artefak]
    
    SaveCosmetics & AddConsumables & OpenGachaScreen --> DeductStars[Pengurangan Saldo Koin]
    DeductStars --> SaveToDisk[(Simpan Perubahan ke Database)] --> ChooseCategory
```

---

## 9. 👨‍🏫 Alur Dasbor Guru (Teacher Command Center System)

Memetakan tindakan administratif guru pengajar dalam mengelola kelas virtual, absensi murid, modul bank soal kuis, serta perilisan tugas pelajaran.

### A. Diagram Alur Teks (Copy-Pasteable)
```
                                Masuk Dasbor Guru
                                         │
                                         ▼
                             Muat Data Kelas & Kuis
                                         │
                                         ▼
                              Pilih Menu Dashboard
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         ▼ Overview                      ▼ Manajemen Murid               ▼ Bank Soal
   Render Statistik Kelas          Render Rekap Absensi            Render Daftar Kuis
         │                               │                               │
    ┌────┴────┐                     ┌────┴────┐                     ┌────┴────┐
    ▼         ▼                     ▼         ▼                     ▼         ▼
  Buat      Kirim                 Edit      Tambah                Buat      Kirim PR
  Kelas  Pengumuman              Catatan    Siswa                 Kuis      ke Kelas
    │         │                     │         │                     │         │
    └────┬────┘                     └────┬────┘                     └────┬────┘
         └───────────────────────────────┼───────────────────────────────┘
                                         ▼
                             Simpan Update ke Store
                                         │
                                         ▼
                               Simpan ke Database
                                         │
                                         ▼
                                Selesai / Re-render
```

### B. Diagram Alur Grafis (Mermaid JS)
```mermaid
flowchart TD
    Start([Mulai]) --> FetchClassrooms[Muat Data Kelas]
    FetchClassrooms --> FetchQuizzes[Muat Data Kumpulan Kuis]
    
    FetchQuizzes --> ChooseMenuTeacher{Pilih Menu Dasbor Guru?}
    
    ChooseMenuTeacher -->|Overview| ShowStats[Tampilkan Statistik Kelas]
    ShowStats --> ActionsOverview{Pilih Aksi Overview}
    ActionsOverview -->|Buat Kelas| ClassCreate[Proses Pembuatan Kelas]
    ActionsOverview -->|Hapus Kelas| ClassDelete[Hapus Data Kelas]
    ActionsOverview -->|Kirim Pengumuman| BroadcastNotice[Sebarkan Pengumuman]
    
    ChooseMenuTeacher -->|Manajemen Murid| ShowStudents[Tampilkan Manajemen Murid]
    ShowStudents --> ActionsStudents{Pilih Aksi Murid}
    ActionsStudents -->|Edit Detail| EditRecord[Perbarui Catatan Murid]
    ActionsStudents -->|Tambah Murid| AddStudent[Masukkan Murid ke Kelas]
    
    ChooseMenuTeacher -->|Bank Soal| ShowBank[Tampilkan Bank Soal]
    ShowBank --> ActionsBank{Paksi Bank Soal}
    ActionsBank -->|Buat Kuis Baru| CreateQuiz[Buat Kuis & Susun Pertanyaan]
    ActionsBank -->|Kirim PR Kuis| ReleaseAssignment[Rilis Kuis sebagai Tugas Kelas]
    
    ClassCreate & ClassDelete & BroadcastNotice & EditRecord & AddStudent & CreateQuiz & ReleaseAssignment --> SaveTeacherData[(Simpan Perubahan Ke Database)]
    SaveTeacherData --> EndTeacher([Selesai])
```

---

## 10. 👤 Alur Sistem Halaman Profil (Profile & Customization System Flow)

Memetakan bagaimana sistem memuat profil pengguna dan menangani empat aksi utama: kustomisasi tampilan dengan hiasan terpasang, pemetaan inventaris item/penghargaan, pengurutan papan peringkat, serta penambahan atau penghapusan daftar teman.

### A. Diagram Alur Teks (Copy-Pasteable)
```
                                 Akses Profil
                                      │
                                      ▼
                                Baca Database
                                      │
                                      ▼
                                Tampilkan Menu
                                      │
         ┌───────────────────┬────────┴────────┬───────────────────┐
         ▼                   ▼                 ▼                   ▼
    Kustomisasi          Inventaris        Peringkat             Teman
         │                   │                 │                   │
         ▼                   ▼                 ▼                   ▼
    Muat Hiasan          Muat Item         Muat Skor           Muat Teman
         │                   │                 │                   │
         ▼                   ▼                 ▼                   ├──────────┐
    Pilih Hiasan      Saring Kategori      Urutkan Skor            ▼          ▼
         │                   │                 │                Tambah      Hapus
         ▼                   ▼                 ▼                 Teman      Teman
    Pasang Hiasan        Tampilkan        Cari Posisi              │          │
         │                Koleksi              │                   ▼          ▼
         ▼                   │                 ▼               Cari Nama    Hapus
     Perbarui                │             Tampilkan               │          │
     Tampilan                │               Papan                 ▼          │
         │                   │                 │                 Ada?         │
         │                   │                 │                ┌──┴──┐       │
         │                   │                 │                ▼ Ya  ▼ Tidak │
         │                   │                 │             Tambah   Pemberi-│
         │                   │                 │               │      tahuan  │
         │                   │                 │               │        │     │
         └───────────────────┼─────────────────┼───────────────┴────────┼─────┘
                             ▼                 ▼                        │
                              Simpan Database ◄─────────────────────────┘
                                      │
                                      ▼
                                   Selesai
```

### B. Diagram Alur Grafis (Mermaid JS)
```mermaid
flowchart TD
    Start([Mulai]) --> OpenProfile[Akses Profil]
    OpenProfile --> LoadProfileData[Baca Database]
    LoadProfileData --> ShowProfileMenu[Tampilkan Menu]
    
    ShowProfileMenu -->|Kustomisasi| CustomSection[Muat Hiasan]
    CustomSection --> SelectCosmetic[Pilih Hiasan]
    SelectCosmetic --> ToggleEquip[Pasang Hiasan]
    ToggleEquip --> UpdateCharacter[Perbarui Tampilan]
    
    ShowProfileMenu -->|Inventaris| InventorySection[Muat Item]
    InventorySection --> FilterType[Saring Kategori]
    FilterType --> ShowCollection[Tampilkan Koleksi]
    
    ShowProfileMenu -->|Peringkat| RankSection[Muat Skor]
    RankSection --> SortScores[Urutkan Skor]
    SortScores --> FindRankPosition[Cari Posisi]
    FindRankPosition --> RenderLeaderboard[Tampilkan Papan]
    
    ShowProfileMenu -->|Teman| FriendSection[Muat Teman]
    FriendSection --> ChooseFriendAction{Pilih Aksi?}
    
    ChooseFriendAction -->|Tambah| InputFriendName[Cari Nama]
    InputFriendName --> QueryUser{Ada?}
    QueryUser -- Ya --> AddToFriendList[Tambah]
    QueryUser -- Tidak --> ShowFriendError[Pemberitahuan]
    
    ChooseFriendAction -->|Hapus| RemoveFriend[Hapus]
    
    UpdateCharacter & ShowProfileMenu & ShowCollection & RenderLeaderboard & AddToFriendList & RemoveFriend --> SaveProfileChanges[Simpan Perubahan]
    ShowFriendError --> ShowProfileMenu
    SaveProfileChanges --> EndProfile([Selesai])
```

---

*Dokumen System Flowchart ini dibuat sebagai referensi mutlak arsitektur sistem logika aplikasi **Project Linimasa**.*
