# 📱 Panduan Pembuatan APK - Lini Masa

Dokumen ini berisi langkah-langkah untuk mengubah proyek web Anda menjadi aplikasi Android (APK) menggunakan **Capacitor**.

---

## 🚀 1. Proses Utama (Langkah demi Langkah)

Lakukan urutan ini setiap kali Anda ingin membuat file APK baru:

### Langkah A: Build Project Web
Mengubah kode React menjadi file yang siap dibungkus.
```bash
npm run build
```
*Hasil: Muncul folder `dist`.*

### Langkah B: Sinkronisasi ke Android
Menyalin file dari folder `dist` ke folder `android`.
```bash
npx cap sync
```

### Langkah C: Buka di Android Studio
(Lewati langkah ini jika Android Studio sudah terbuka)
```bash
npx cap open android
```

### Langkah D: Build APK di Android Studio
1.  Tunggu loading "Gradle Sync" di pojok kanan bawah sampai selesai.
2.  Klik menu **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3.  Setelah muncul notifikasi "Build APK(s) successful", klik **Locate** untuk mengambil file `.apk`.

---

## 🔄 2. Cara Update Jika Kode Berubah
Jika Anda sudah pernah membuat APK, lalu mengubah kode di VS Code, Anda **tidak perlu** mengulangi semua dari nol. Cukup lakukan:

1.  `npm run build`
2.  `npx cap sync`
3.  Buka Android Studio yang sudah terbuka tadi, lalu klik **Build APK(s)** lagi.

---

## ⚡ 3. Cara Cepat untuk Development (Live Reload)
Daripada build APK terus-menerus setiap kali ada perubahan kecil, gunakan fitur ini untuk melihat perubahan langsung di HP (seperti di browser):

1.  Hubungkan HP dengan kabel USB (aktifkan USB Debugging).
2.  Jalankan perintah:
    ```bash
    npx cap run android -l --external
    ```
3.  Pilih device HP Anda. Sekarang, setiap Anda **Save** di VS Code, aplikasi di HP akan langsung berubah.

---

## 💡 Catatan Penting untuk Pemula

*   **Pilihan Menu Abu-abu (Mati):** Jika menu Build di Android Studio tidak bisa diklik, itu tandanya Android Studio masih loading. Perhatikan bar di bawah, tunggu sampai semua proses selesai.
*   **Error "Gradle Sync Failed":** Pastikan laptop Anda terhubung ke internet saat pertama kali membuka Android Studio, karena ia akan mendownload banyak data pendukung.
*   **Ikon Aplikasi:** Jika ingin mengubah ikon, ganti file gambar di `android/app/src/main/res`.
*   **Debug vs Release:** 
    *   **Debug APK:** File yang Anda buat sekarang. Bisa diinstal di HP tapi tidak bisa di-upload ke Google Play Store.
    *   **Release APK:** Memerlukan proses "Signing". Lakukan ini hanya jika aplikasi sudah benar-benar siap rilis.

---

*Semangat belajar! Jika ada error, jangan ragu untuk bertanya.*
