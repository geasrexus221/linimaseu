import re

file_path = r"c:\Users\Laxus\Desktop\Project Linimasa\SYSTEM_FLOWCHART.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update general intro descriptions
content = content.replace("membaca/menulis ke media penyimpanan", "membaca/menulis ke database")
content = content.replace("pemeriksaan data pada penyimpanan lokal", "pemeriksaan data pada database")

# 2. Update global flow
content = content.replace("Membaca Penyimpanan Lokal", "Meminta Data Ke Database")
content = content.replace("Simpan Perubahan Data ke\n                               Penyimpanan Lokal", "Simpan Perubahan Data ke\n                                    Database")
content = content.replace("Simpan Perubahan Data ke Penyimpanan Lokal", "Simpan Perubahan Data ke Database")
content = content.replace("SaveData[(Simpan Perubahan Data ke Penyimpanan Lokal)]", "SaveData[(Simpan Perubahan Data ke Database)]")

# 3. Update shop/gacha flow
content = content.replace("SaveToDisk[(Simpan Data ke Penyimpanan Lokal)]", "SaveToDisk[(Simpan Data ke Database)]")
content = content.replace("SaveToDisk[(Simpan Perubahan ke Penyimpanan Lokal)]", "SaveToDisk[(Simpan Perubahan ke Database)]")

# 4. Update teacher flow
content = content.replace("SaveTeacherData[(Simpan Perubahan Ke Penyimpanan Lokal)]", "SaveTeacherData[(Simpan Perubahan Ke Database)]")
content = content.replace("Simpan ke LocalStorage", "Simpan ke Database")

# 5. Update profile flow
# Remove parentheses from read block in Profile (Section 10.A)
old_profile_read = """                              Akses Halaman Profil
                                       │
                                       ▼
                            Membaca Penyimpanan Lokal
                         (Data Profil, Skor, Lencana,
                          Inventaris, Daftar Teman)"""

new_profile_read = """                              Akses Halaman Profil
                                       │
                                       ▼
                            Meminta Data Ke Database"""

content = content.replace(old_profile_read, new_profile_read)
content = content.replace("Membaca Penyimpanan Lokal\n                         (Data Profil, Skor, Lencana,\n                          Inventaris, Daftar Teman)", "Meminta Data Ke Database")

# Remove parentheses in other parts of Profile Section 10
content = content.replace("Muat Item &          Muat Semua          Muat Daftar         Muat Daftar\n      Karakter            Lencana &              Skor                Teman\n     Terpasang            Aksesoris             Pemain             (Karakter)",
                          "Muat Hiasan          Muat Semua          Muat Daftar         Muat Daftar\n      Terpasang              Item                Skor                Teman")

content = content.replace("Muat Item &          Muat Semua          Muat Daftar         Muat Daftar\n      Karakter            Lencana &              Skor                Teman\n     Terpasang            Aksesoris             Pemain                │",
                          "Muat Hiasan          Muat Semua          Muat Daftar         Muat Daftar\n      Terpasang              Item                Skor                Teman")

content = content.replace("Filter Tipe          Urutkan                ▼          ▼\n      Kosmetik            (Terpasang/         Skor dari             Tambah     Hapus\n          │               Aksesoris/          Tertinggi             Teman      Teman\n          ▼                Lencana)               │                   │          │\n     Terapkan /               │                   ▼                   ▼          ▼\n    Lepas Pasang              │              Cari Posisi         Cari Nama   Hapus dari\n     (Karakter)               │               Pemain di           Target      Daftar\n          │                   │                 Daftar                │        Teman\n          ▼                   ▼                   ▼                   ▼          │\n     Perbarui              Tampilkan           Tampilkan          Ditemukan?     │\n    Tampilan               Koleksi            Leaderboard          ┌──┴──┐       │\n          │                   │                   │                ▼ Ya  ▼ Tidak │\n          │                   │                   │             Tambah   Pesan   │\n          │                   │                   │             Daftar   Error   │",
                          "Pilih Hiasan        Saring Kategori          Urutkan                ▼          ▼\n          │                   │               Skor dari             Tambah     Hapus\n          ▼                   ▼               Tertinggi             Teman      Teman\n    Pasang Hiasan         Tampilkan               │                   │          │\n          │                Koleksi                ▼                   ▼          ▼\n          ▼                   │              Cari Posisi         Cari Nama  Hapus dari\n      Perbarui                │               Pemain di           Pengguna    Daftar\n      Tampilan                │                Daftar                 │       Teman\n          │                   │                   ▼                   ▼          │\n          │                   │               Tampilkan            Pengguna      │\n          │                   │                 Papan                Ada?        │\n          │                   │               Peringkat            ┌──┴──┐       │\n          │                   │                   │                ▼ Ya  ▼ Tidak │\n          │                   │                   │             Tambah   Tampilkan\n          │                   │                   │             Daftar   Pering-\n          │                   │                   │             Teman    katan")

# Fix bottom redirect line and final save block in Profile Section 10.A
content = content.replace("└───────────────────┼───────────────────┼───────────────┴────────┼─────┘\n                             ▼                   ▼                        │\n                         Simpan Perubahan ke Penyimpanan Lokal ◄──────────┘",
                          "└───────────────────┼───────────────────┼───────────────┴────────┼─────┘\n                             ▼                   ▼                        │\n                              Simpan Perubahan ke Database ◄──────────────┘")

# Update Mermaid JS Profile load
content = content.replace("Membaca Penyimpanan Lokal: Data Profil, Inventaris, Lencana, Teman", "Meminta Data Ke Database")
content = content.replace("Membaca Penyimpanan: Data Profil, Inventaris, Penghargaan, Teman", "Meminta Data Ke Database")
content = content.replace("Muat Item & Karakter Terpasang", "Muat Hiasan")
content = content.replace("Pilih Item Kosmetik", "Pilih Hiasan")
content = content.replace("Terapkan / Lepas Pasang?", "Pasang Hiasan")
content = content.replace("Perbarui Tampilan Karakter", "Perbarui Tampilan")
content = content.replace("Muat Semua Lencana & Aksesoris", "Muat Semua Item")
content = content.replace("Filter Tipe: Terpasang / Aksesoris / Lencana", "Saring Kategori")
content = content.replace("Filter Tipe: Terpasang / Hiasan / Penghargaan", "Saring Kategori")
content = content.replace("Muat Daftar Teman & Karakter", "Muat Daftar Teman")
content = content.replace("Cari Nama Target", "Cari Nama Pengguna")
content = content.replace("User Ditemukan?", "Pengguna Ada?")
content = content.replace("Tambah ke Daftar Teman", "Tambah Daftar Teman")
content = content.replace("Pesan Error", "Peringatan")
content = content.replace("Simpan Perubahan ke Penyimpanan Lokal", "Simpan Perubahan ke Database")
content = content.replace("Simpan Perubahan ke Penyimpanan", "Simpan Perubahan ke Database")
content = content.replace("SaveProfileChanges[(Simpan Perubahan ke Penyimpanan Lokal)]", "SaveProfileChanges[(Simpan Perubahan ke Database)]")
content = content.replace("SaveProfileChanges[Simpan Perubahan]", "SaveProfileChanges[Simpan Perubahan ke Database]")

# Save changes back
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Term replacement completed successfully!")
