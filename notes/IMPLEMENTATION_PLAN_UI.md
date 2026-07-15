# Perombakan UI: Gaya Petualangan Ceria (Duolingo-Inspired)

Mengubah visual game dari tema "Space-Glassmorphism" yang berat menjadi tema "Playful-Adventure" yang ringan, ceria, dan sangat responsif untuk mobile.

## User Review Required

> [!IMPORTANT]
> Perubahan ini akan menghapus semua efek transparan/blur (Glassmorphism) untuk menghilangkan lag. Tampilan akan menjadi jauh lebih cerah (Solid Colors).

> [!TIP]
> Kita akan menggunakan sistem "3D Flat" (tombol dengan bayangan tebal di bawah) agar terasa memuaskan saat diklik di HP.

## Proposed Changes

### 🎨 1. Sistem Desain & Warna
Membuat palet warna baru yang kontras dan ceria.
- **Background**: Biru Langit Cerah atau Putih Tulang (mengganti hitam ruang angkasa).
- **Border**: Garis hitam tebal (2px - 3px) untuk kesan kartun.
- **Shadow**: Menggunakan bayangan solid (offset bawah) bukan bayangan lembut.

---

### 📱 2. Optimasi Mobile-Friendly
- **Ukuran Tombol**: Minimal 56px untuk tombol utama (Kocok Dadu).
- **Tipografi**: Menggunakan font yang lebih besar dan tebal (Outfit/Roboto Bold).
- **Layout**: Memindahkan status lawan ke posisi yang lebih mudah dijangkau jempol.

---

### 🧩 3. Perubahan Komponen (HUD & Event)

#### [MODIFY] [ActivePlayerCard.jsx](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/features/game/jelajah-nusantara/components/hud/ActivePlayerCard.jsx)
- Menghilangkan transparansi.
- Menggunakan background putih bersih dengan border tebal berwarna sesuai pemain.
- Indikator "GILIRANMU" dibuat lebih besar seperti label harga.

#### [MODIFY] [ActionTray.jsx](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/features/game/jelajah-nusantara/components/hud/ActionTray.jsx)
- Tombol **Kocok Dadu** diubah menjadi super besar dengan efek "Pegas" (animasi tekan ke bawah).
- Inventory kartu dibuat lebih lebar dengan gambar kartu yang menyerupai kartu fisik.

#### [MODIFY] [EventModal.jsx](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/features/game/jelajah-nusantara/components/EventModal.jsx)
- Menghilangkan efek blur background.
- Menggunakan modal full-screen di mobile atau panel besar di tengah.
- Pilihan jawaban kuis dibuat satu kolom di mobile agar tidak kekecilan.

---

### ⚡ 4. Optimasi Performa
- **Hapus `backdrop-filter: blur`**: Ini adalah penyebab utama lag di React.
- **Gunakan CSS Transform**: Untuk animasi yang lebih smooth (60 FPS).
- **Simplify 3D View**: Sedikit menyesuaikan FOV agar dunia terlihat lebih "Isometrik" dan lucu.

## Verification Plan

### Manual Verification
- Mengetes di mode **Mobile Emulator (Chrome DevTools)** untuk memastikan semua tombol bisa diklik dengan nyaman.
- Memastikan tidak ada lagi penurunan FPS saat modal muncul.
- Memastikan teks terbaca jelas di layar kecil.
