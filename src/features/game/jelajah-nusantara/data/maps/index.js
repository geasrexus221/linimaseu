import defaultBoard from './defaultBoard.json';
import map1 from './Map 1.json';
import peta1Thumbnail from '../../../../../assets/UI/Arena/Peta1.png';

/**
 * Registrasi peta resmi yang disertakan dalam aplikasi.
 * Jika Anda menambah file JSON baru di folder ini, daftarkan di sini.
 */
export const OFFICIAL_MAPS = [
  {
    id: 'lintasan-pemuda',
    name: 'Pulau Misteri',
    description: 'Jelajahi pulau misterius Nusantara dan temukan rahasia kuno yang tersembunyi.',
    thumbnail: peta1Thumbnail,
    data: map1,
    difficulty: 'Menengah'
  }
];
