import { actionCards } from '../../features/game/jelajah-nusantara/data/cards';
import { aduCendekiawanItems } from '../../features/game/tarik-tambang/data/tarikTambangDuelData';

export const SHOP_CATALOG = {
  cosmetics: [
    { id: 'topi-veteran', type: 'hat', name: 'Topi Veteran', price: 200, icon: '🧢', color: '#1CB0F6' },
    { id: 'kacamata', type: 'accessory', name: 'Kacamata', price: 150, icon: '👓', color: '#58CC02' },
    { id: 'mahkota', type: 'hat', name: 'Mahkota', price: 2000, icon: '👑', color: '#FFD700' },
    { id: 'border-gold', type: 'border', name: 'Border Emas', price: 1200, icon: '✨', color: '#FFD700' },
    { id: 'border-diamond', type: 'border', name: 'Border Berlian', price: 1500, icon: '💎', color: '#B9F2FF' },
    { id: 'theme-kelas', type: 'quizTheme', name: 'Tema Kuis: Ruang Kelas', price: 500, icon: '🏫', color: '#8B4513' },
    { id: 'theme-lautan', type: 'quizTheme', name: 'Tema Kuis: Lautan', price: 600, icon: '🌊', color: '#0077be' },
    { id: 'topi-wisuda', type: 'hat', name: 'Topi Wisuda', price: 600, icon: '🎓', color: '#1CB0F6' },
    { id: 'topi-pesulap', type: 'hat', name: 'Topi Pesulap', price: 700, icon: '🎩', color: '#9C27B0' },
    { id: 'helm-penyelamat', type: 'hat', name: 'Helm Penyelamat', price: 550, icon: '⛑️', color: '#FF4B4B' },
    { id: 'pita-rambut', type: 'hat', name: 'Pita Rambut', price: 350, icon: '🎀', color: '#E91E63' },
    { id: 'kacamata-hitam', type: 'accessory', name: 'Kacamata Hitam', price: 400, icon: '🕶️', color: '#212121' },
    { id: 'kacamata-renang', type: 'accessory', name: 'Kacamata Renang', price: 450, icon: '🥽', color: '#00BCD4' },
    { id: 'bunga-hiasan', type: 'accessory', name: 'Bunga Hiasan', price: 300, icon: '🌸', color: '#FF4081' },
  ],

  refills: [
    { id: 'heart_refill', type: 'refill', name: 'Nyawa Penuh', price: 100, icon: '❤️', desc: 'Pulihkan semangat belajar!' },
    { id: 'obor_pack', type: 'refill', name: '5 Obor Game', price: 250, icon: '🔥', desc: 'Tiket masuk game instan' },
  ],

  gachaPool: [...actionCards, ...aduCendekiawanItems]
};
