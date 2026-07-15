import os

path = r"c:\Users\Laxus\Desktop\Project Linimasa\PANDUAN_SKRIPSI.md"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

start_str = "##### H. Alur Toko"
start_idx = content.find(start_str)
if start_idx == -1:
    print("Could not find start index")
    exit(1)

end_str = "##### I. Alur Profil"
end_idx = content.find(end_str)
if end_idx == -1:
    print("Could not find end index")
    exit(1)

new_toko_block = """##### H. Alur Toko
```
                            Halaman Toko
                                  │
                                  ▼
                            Pilih Kategori
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
   Gaya Pahlawan             Isi Tenaga              Peti Misteri
    (Kosmetik)              (Isi Ulang)                (Gacha)
         │                        │                        │
         ▼                        ▼                        ▼
     Pilih Item              Pilih Paket           Pilih Jumlah Peti
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼
                         Konfirmasi Pembelian
                                  │
                                  ▼
                          Cek Saldo Bintang
                                  │
                       ┌──────────┴──────────┐
                       ▼                     ▼
                     Cukup              Tidak Cukup
                       │                     │
                       ▼                     ▼
              Transaksi Diproses     Tampilkan Peringatan
                       │                     │
         ┌─────────────┼─────────────┐       │
         ▼             ▼             ▼       │
      Kosmetik     Isi Ulang       Gacha     │
       Masuk         Nyawa        Halaman    │
     Inventori    / Obor Naik    Buka Peti   │
         │             │             │       │
         └─────────────┼─────────────┘       │
                       ▼                     │
                Bintang Berkurang            │
                       │                     │
                       └──────────┬──────────┘
                                  ▼
                           Kembali ke Toko
```

"""

content = content[:start_idx] + new_toko_block + content[end_idx:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated to new Toko diagram!")
