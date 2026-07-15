/**
 * Database Kartu Aksi Jelajah Nusantara
 * Anda bisa menambah kartu baru di sini dengan mudah.
 */
export const actionCards = [
  {
    id: 'bekal_tekad',
    name: 'Bekal Perjalanan',
    description: 'Memberikan tambahan +30 Tekad secara instan.',
    desc: 'Memberikan tambahan +30 Tekad secara instan.',
    icon: '🍱',
    color: '#58CC02',
    cost: 10,
    rarity: 'common',
    effect: (player) => {
      return { ...player, tekad: Math.min(100, player.tekad + 30) };
    }
  },
  {
    id: 'langkah_kilat',
    name: 'Langkah Kilat',
    description: 'Maju 3 langkah tambahan ke depan.',
    desc: 'Maju 3 langkah tambahan ke depan.',
    icon: '❤️',
    color: '#3B82F6',
    cost: 15,
    rarity: 'common',
    action: 'MOVE_FORWARD',
    value: 3
  },
  {
    id: 'kopi_luwak',
    name: 'Kopi Luwak',
    description: 'Memulihkan +50 Tekad. Sangat berenergi!',
    desc: 'Memulihkan +50 Tekad. Sangat berenergi!',
    icon: '☕',
    color: '#8B4513',
    cost: 20,
    rarity: 'rare',
    effect: (player) => {
      return { ...player, tekad: Math.min(100, player.tekad + 50) };
    }
  },
  {
    id: 'peta_rahasia',
    name: 'Peta Rahasia',
    description: 'Maju 2 langkah tambahan untuk melewati rintangan.',
    desc: 'Maju 2 langkah tambahan untuk melewati rintangan.',
    icon: '🗺️',
    color: '#F59E0B',
    cost: 10,
    rarity: 'common',
    action: 'MOVE_FORWARD',
    value: 2
  },
  {
    id: 'sandal_jepit',
    name: 'Sandal Jepit',
    description: 'Melangkah santai 1 petak ke depan.',
    desc: 'Melangkah santai 1 petak ke depan.',
    icon: '🩴',
    color: '#10B981',
    cost: 5,
    rarity: 'common',
    action: 'MOVE_FORWARD',
    value: 1
  },
  {
    id: 'ojek_online',
    name: 'Ojek Online',
    description: 'Melesat cepat sejauh 5 petak.',
    desc: 'Melesat cepat sejauh 5 petak.',
    icon: '🛵',
    color: '#059669',
    cost: 20,
    rarity: 'epic',
    action: 'MOVE_FORWARD',
    value: 5
  },
  {
    id: 'sepeda_lipat',
    name: 'Sepeda Lipat',
    description: 'Gowes sejauh 3 petak dengan lincah.',
    desc: 'Gowes sejauh 3 petak dengan lincah.',
    icon: '🚲',
    color: '#3B82F6',
    cost: 12,
    rarity: 'common',
    action: 'MOVE_FORWARD',
    value: 3
  },
  {
    id: 'jamu_kuat',
    name: 'Jamu Kuat',
    description: 'Ramuan tradisional, pulihkan +70 Tekad.',
    desc: 'Ramuan tradisional, pulihkan +70 Tekad.',
    icon: '🧪',
    color: '#EF4444',
    cost: 30,
    rarity: 'rare',
    effect: (player) => {
      return { ...player, tekad: Math.min(100, player.tekad + 70) };
    }
  },
  {
    id: 'air_kelapa',
    name: 'Air Kelapa',
    description: 'Segar! Pulihkan +20 Tekad.',
    desc: 'Segar! Pulihkan +20 Tekad.',
    icon: '🥥',
    color: '#60A5FA',
    cost: 8,
    rarity: 'common',
    effect: (player) => {
      return { ...player, tekad: Math.min(100, player.tekad + 20) };
    }
  },
  {
    id: 'ransel_gunung',
    name: 'Ransel Gunung',
    description: 'Perlengkapan lengkap, +40 Tekad.',
    desc: 'Perlengkapan lengkap, +40 Tekad.',
    icon: '🎒',
    color: '#78350F',
    cost: 15,
    rarity: 'rare',
    effect: (player) => {
      return { ...player, tekad: Math.min(100, player.tekad + 40) };
    }
  },
  {
    id: 'lompatan_katak',
    name: 'Lompatan Katak',
    description: 'Lompat sejauh 4 petak ke depan.',
    desc: 'Lompat sejauh 4 petak ke depan.',
    icon: '🐸',
    color: '#22C55E',
    cost: 18,
    rarity: 'rare',
    action: 'MOVE_FORWARD',
    value: 4
  },
  {
    id: 'mundur_cantik',
    name: 'Mundur Cantik',
    description: 'Mundur 2 petak (strategis untuk ambil peti).',
    desc: 'Mundur 2 petak (strategis untuk ambil peti).',
    icon: '🔙',
    color: '#6B7280',
    cost: 5,
    rarity: 'common',
    action: 'MOVE_BACKWARD',
    value: 2
  },
  {
    id: 'voucher_tiket',
    name: 'Voucher Tiket',
    description: 'Terbang jauh sejauh 6 petak.',
    desc: 'Terbang jauh sejauh 6 petak.',
    icon: '🎟️',
    color: '#EC4899',
    cost: 25,
    rarity: 'epic',
    action: 'MOVE_FORWARD',
    value: 6
  },
  {
    id: 'sate_padang',
    name: 'Sate Padang',
    description: 'Makan enak! Pulihkan +60 Tekad.',
    desc: 'Makan enak! Pulihkan +60 Tekad.',
    icon: '🍢',
    color: '#B91C1C',
    cost: 25,
    rarity: 'rare',
    effect: (player) => {
      return { ...player, tekad: Math.min(100, player.tekad + 60) };
    }
  },
  {
    id: 'teleportasi_nusantara',
    name: 'Teleportasi',
    description: 'Buka portal untuk pindah ke petak manapun.',
    desc: 'Buka portal untuk pindah ke petak manapun.',
    icon: '🌌',
    color: '#8B5CF6',
    cost: 40,
    rarity: 'epic',
    action: 'TELEPORT_MODE'
  }
];
