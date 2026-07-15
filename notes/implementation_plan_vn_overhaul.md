# Implementation Plan - Visual Novel Storytelling Overhaul

Overhaul the Visual Novel (VN) system to introduce two child observer characters, **Bimo** and **Santi**, who travel through time to observe historical events. The initial focus will be on the story of **Raden Dewi Sartika**.

## User Review Required

> [!IMPORTANT]
> The historical figure (Raden Dewi Sartika) will NOT have direct dialogue with the characters. Her actions and words will be observed and narrated by Bimo, Santi, or the internal narrator.

> [!NOTE]
> Character representation will use Emojis (👦 for Bimo, 👧 for Santi) with dynamic animations to indicate the speaker.

## Proposed Changes

### Core Components

#### [MODIFY] [VisualNovelScreen.jsx](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/features/story/screens/VisualNovelScreen.jsx)
- Update the layout to support two character slots (Bimo on the left, Santi on the right).
- Implement animations (using `framer-motion`) to highlight the active speaker (e.g., scaling up the speaker and dimming the listener).
- Add a dedicated **Illustration Placeholder Box** in the center/background to display descriptive notes for required images.
- Improve the dialogue box to show the character's name and icon clearly.

### Character Profiles
- **Bimo (10th, Laki-laki)**: 👦 Semangat, suka bertanya, pemberani.
- **Santi (9th, Perempuan)**: 👧 Cerdik, analitis, tenang, banyak pengetahuan.

## Story Arc: Raden Dewi Sartika (Observer POV)

### Chapter 1: Cita-cita di Halaman Belakang
- **Latar**: Cicalengka, akhir tahun 1800-an.
- **Plot**: Bimo & Santi melihat Dewi kecil bermain "sekolah-sekolahan" di bawah pohon.
- **Dialog**: Bimo heran mereka memakai arang/daun pisang. Santi menjelaskan sulitnya akses pendidikan dulu.
- **Ilustrasi**: Dewi kecil mengajar teman-temannya di bawah pohon besar.

### Chapter 2: Badai dan Keteguhan
- **Latar**: Setelah ayah Dewi diasingkan ke Ternate.
- **Plot**: Bimo & Santi melihat Dewi tinggal bersama pamannya. Ia belajar mandiri di perpustakaan paman.
- **Dialog**: Bimo sedih, tapi Santi menunjukkan keteguhan Dewi yang tidak berhenti belajar meski dalam sulit.
- **Ilustrasi**: Dewi remaja membaca buku secara sembunyi-sembunyi di kantor pamannya.

### Chapter 3: Gebrakan di Pendopo
- **Latar**: Bandung, 16 Januari 1904.
- **Plot**: Pembukaan "Sakola Isteri" pertama di pendopo Kabupaten Bandung.
- **Dialog**: Bimo takjub melihat antusiasme murid baru. Santi menjelaskan ini sekolah perempuan pertama di Indonesia.
- **Ilustrasi**: Halaman pendopo dengan papan nama "Sakola Isteri" dan siswi berbaju kebaya.

### Chapter 4: Cahaya yang Meluas
- **Latar**: Beberapa tahun kemudian (Sakola Keutamaan Istri).
- **Plot**: Sekolah berkembang pesat. Dewi menulis buku "Keutamaan Istri".
- **Dialog**: Bimo melihat murid belajar menjahit & memasak. Santi menunjukkan buku penting karya Dewi.
- **Ilustrasi**: Kelas yang sibuk dengan berbagai aktivitas keterampilan; Dewi menulis di meja kayu.

### Chapter 5: Bintang dari Priangan
- **Latar**: Refleksi Masa Kini.
- **Plot**: Bimo & Santi kembali dan merenungkan warisan Dewi Sartika.
- **Dialog**: Merenung bagaimana pendidikan perempuan kini sudah setara. Mengenang gelar Pahlawan Nasional Dewi (1966).
- **Ilustrasi**: Potret Dewi Sartika dengan latar transisi sekolah modern.

## Verification Plan

### Manual Verification
- Verify that character animations correctly trigger when the speaker changes.
- Ensure the Illustration Placeholder box is clearly visible and descriptive.
- Confirm that Dewi Sartika never speaks directly to Bimo/Santi.
