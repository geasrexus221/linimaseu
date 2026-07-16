import React, { useState } from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useStore } from '../../store/useStore';
import { SHOP_CATALOG } from '../../data/shop/catalog';
import { actionCards } from '../game/jelajah-nusantara/data/cards';
import { 
  ChevronLeft, Image, Music, Type, Grid, Clipboard, Check, Search, 
  Trash2, Unlock, Dices, Flame, Heart, Star, Sparkles, Trophy, Clock, CheckCircle, Gift,
  LayoutDashboard, BookOpen, ClipboardCheck, Gamepad2, ShoppingBag, User, Settings,
  Palette, Layers, MousePointerClick, Sliders, Map,
  ArrowLeft, ArrowRight, ChevronUp, ChevronDown, Home, Menu, X, LogOut, Info, HelpCircle, Bell, Calendar,
  Award, Crown, Medal, Flag, Key, Lock, Sword, Shield, Book, GraduationCap, School, Compass, PenTool, Edit3, Lightbulb, Camera,
  Play, Pause, VolumeX, Volume2, Users, UserCheck, MessageSquare, Share2
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/SoundManager';

import JelajahHelpModal from '../game/jelajah-nusantara/components/hud/JelajahHelpModal';
import GameSettingsModal from '../game/jelajah-nusantara/components/hud/GameSettingsModal';
import InventoryDetailList from '../game/jelajah-nusantara/components/hud/InventoryDetailList';
import TurnOverlay from '../game/jelajah-nusantara/components/hud/TurnOverlay';
import QuizContent from '../game/jelajah-nusantara/components/events/QuizContent';
import BattleContent from '../game/jelajah-nusantara/components/events/BattleContent';
import ChoiceContent from '../game/jelajah-nusantara/components/events/ChoiceContent';
import BasePurchaseContent from '../game/jelajah-nusantara/components/events/BasePurchaseContent';
import CardPreviewContent from '../game/jelajah-nusantara/components/events/CardPreviewContent';
import DiscardCardContent from '../game/jelajah-nusantara/components/events/DiscardCardContent';
import DuelInvitationContent from '../game/jelajah-nusantara/components/events/DuelInvitationContent';
import DuelTargetSelectionContent from '../game/jelajah-nusantara/components/events/DuelTargetSelectionContent';
import AddStudentModal from '../teacher/components/modals/AddStudentModal';
import StudentDetailModal from '../teacher/components/modals/StudentDetailModal';

// Import Image Sprites
import CerminSvg from '../../assets/UI/Character/cermin.svg';
import KuatSvg from '../../assets/UI/Character/kuat.svg';
import Karakter1Svg from '../../assets/UI/Character/karakter1.svg';
import Character1IsoSvg from '../../assets/UI/Character/character1iso.svg';
import Character2IsoSvg from '../../assets/UI/Character/character2iso.svg';
import Melambai1Svg from '../../assets/UI/Character/melambai1.svg';
import Duduk2Svg from '../../assets/UI/Character/duduk2.svg';
import Meja1Svg from '../../assets/UI/Character/Meja1.svg';
import Arena1Svg from '../../assets/UI/Arena/arena1.svg';
import JelajahNusantaraIcon from '../../assets/UI/Arena/Jelajah nusantara icon.svg';
import AduCendekiawanIcon from '../../assets/UI/Arena/Adu Cendikiawan icon.svg';
import PodiumSvg from '../../assets/UI/Arena/Podium.svg';
import TileSvg from '../../assets/UI/Arena/tile.svg';
import Peta1Png from '../../assets/UI/Arena/Peta1.png';
import BgSvg from '../../assets/UI BG/bg.svg';
import BushSvg from '../../assets/UI BG/bush.svg';
import PathSvg from '../../assets/UI BG/path.svg';

// Import Audio Files
import BlinkMp3 from '../../assets/audio/blink.mp3';
import CorrectMp3 from '../../assets/audio/correct.mp3';
import ErrorWav from '../../assets/audio/error.wav';
import GlassMp3 from '../../assets/audio/glass.mp3';
import HitMp3 from '../../assets/audio/hit.mp3';
import SquasbMp3 from '../../assets/audio/squasb.mp3';
import SuccessMp3 from '../../assets/audio/success.mp3';
import WhooshMp3 from '../../assets/audio/whoosh.mp3';
import ChestOpenWav from '../../assets/audio/chest open.wav';
import ClickWav from '../../assets/audio/click.wav';
import RollingDiceMp3 from '../../assets/audio/dice/rolling dice.mp3';
import PixelPicnicParadeMp3 from '../../assets/game/music/Pixel Picnic Parade.mp3';
import AttackWav from '../../assets/game/sfx/attack.wav';
import CardGetWav from '../../assets/game/sfx/card_get.wav';
import MoveMp3 from '../../assets/game/sfx/move.mp3';

export default function DevAssetsScreen() {
  const { setCurrentView } = useNavigationStore();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [customText, setCustomText] = useState('Lini Masa Sejarah Indonesia SD Kelas 5 & 6');
  const [activePopup, setActivePopup] = useState(null); // 'reward', 'shop', 'node', 'settings', 'victory', 'jelajah_help', 'recovery', 'add_student', 'student_detail'
  const [helpPage, setHelpPage] = useState(0);
  const [addStudentTab, setAddStudentTab] = useState('manual');
  const [addStudentName, setAddStudentName] = useState('');
  const [addStudentNis, setAddStudentNis] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [studentDetailName, setStudentDetailName] = useState('Budi Santoso');
  const [studentDetailNis, setStudentDetailNis] = useState('10293847');
  const [activeSimTab, setActiveSimTab] = useState('dashboard');
  const [hideDescriptions, setHideDescriptions] = useState(false);
  const [hideFrames, setHideFrames] = useState(false);
  const [settingsSubView, setSettingsSubView] = useState('main');
  const [cameraStream, setCameraStream] = useState(null);
  const [isTargetDetected, setIsTargetDetected] = useState(false);
  const [arTarget, setArTarget] = useState('cermin'); // 'cermin' | 'karakter' | 'podium'
  const videoRef = React.useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      soundManager.play('success');
    } catch (err) {
      alert('Gagal mengakses kamera: ' + err.message);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsTargetDetected(false);
      soundManager.play('click');
    }
  };

  React.useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  React.useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  React.useEffect(() => {
    const originalState = useGameStore.getState();

    useGameStore.setState({
      players: [
        {
          name: 'Budi (Kamu)',
          characterId: 1,
          koin: 150,
          tekad: 80,
          inventory: [
            { name: 'Kartu Pijar', icon: '🕯️', desc: 'Maju 3 langkah otomatis tanpa putar dadu.' },
            { name: 'Kartu Tekad', icon: '❤️', desc: 'Pulihkan kembali 20 poin Tekad karaktermu.' }
          ],
          stats: { serangan: 2, pertahanan: 1, kelincahan: -1 }
        },
        {
          name: 'Santi (AI)',
          characterId: 2,
          koin: 100,
          tekad: 90,
          inventory: [],
          stats: { serangan: 0, pertahanan: 2, kelincahan: 1 }
        }
      ],
      turnIdx: 0,
      remainingSteps: 3
    });

    return () => {
      useGameStore.setState(originalState);
    };
  }, []);

  const { 
    stars, addStars, hearts, addHearts, resetHearts, streak, setStreak,
    userName, setUserName, unlockAllChapters, resetProgress,
    selectedGrade, setSelectedGrade, soundEnabled, setSoundEnabled,
    sfxVolume, setSfxVolume, musicVolume, setMusicVolume
  } = useStore();

  const tabs = [
    { id: 'all', label: 'Semua', icon: Grid },
    { id: 'sprites', label: 'Gambar & Sprite', icon: Image },
    { id: 'audio', label: 'Audio & SFX', icon: Music },
    { id: 'icons', label: 'Ikon', icon: Sparkles },
    { id: 'colors', label: 'Warna & Palet', icon: Palette },
    { id: 'popups', label: 'Pop-up & Menu', icon: Layers },
    { id: 'buttons', label: 'Gaya Tombol', icon: MousePointerClick },
    { id: 'navigation', label: 'Navigator', icon: Compass },
    { id: 'gameplay', label: 'Game Jelajah', icon: Gamepad2 },
    { id: 'cendekiawan', label: 'Adu Cendekiawan', icon: Trophy },
    { id: 'sandbox', label: 'Simulator State', icon: Sliders },
    { id: 'views', label: 'Alur Layar', icon: Map },
    { id: 'shopData', label: 'Katalog Toko', icon: ShoppingBag },
    { id: 'fonts', label: 'Font & Tipografi', icon: Type },
    { id: 'arSandbox', label: 'Uji Coba AR', icon: Camera }
  ];

  const COLOR_PALETTE = [
    { name: 'Kuning Emas (Primary)', varName: '--primary-color', hex: '#f4c365', desc: 'Warna tombol utama, sorotan, bintang kuis.' },
    { name: 'Kuning Emas Gelap', varName: '--primary-color-dark', hex: '#d1a54c', desc: 'Warna pembatas 3D bawah tombol utama.' },
    { name: 'Biru Muda (Secondary)', varName: '--secondary-color', hex: '#1cb0f6', desc: 'Warna tombol sekunder, judul petualangan, portal waktu.' },
    { name: 'Hijau Aksen (Accent)', varName: '--accent-color', hex: '#58cc02', desc: 'Warna tombol mulai kuis, status sukses.' },
    { name: 'Teal Sidebar (Sidebar Bg)', varName: '--sidebar-bg', hex: '#49CAE3', desc: 'Latar belakang sidebar (light mode).' },
    { name: 'Biru Toko (Shop Bg)', varName: '--shop-bg', hex: '#9BD2FE', desc: 'Latar belakang arena belanja/toko.' },
    { name: 'Latar Belakang (Background)', varName: '--background-color', hex: '#faf9f6 / #1e1e2d', desc: 'Warna dasar layar aplikasi.' },
    { name: 'Kartu & Panel (Card Bg)', varName: '--card-bg', hex: '#ffffff / #2a2a3d', desc: 'Warna dasar wadah konten, leaderboard, profil.' },
    { name: 'Teks Utama (Text)', varName: '--text-color', hex: '#4b4b4b / #e0e0e0', desc: 'Warna untuk paragraf dan label.' },
    { name: 'Garis Pembatas (Border)', varName: '--border-color', hex: '#e5e5e5 / #3a3a4d', desc: 'Warna garis tepi, grid ubin, pembatas materi.' },
    { name: 'Status Sukses (Success)', varName: '--success-text', hex: '#10B981', desc: 'Warna notifikasi jawaban benar, klaim sukses.' },
    { name: 'Status Bahaya (Danger)', varName: '--danger-text', hex: '#EF4444', desc: 'Warna notifikasi jawaban salah, darah/nyawa habis.' }
  ];

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'linear-gradient(135deg, #58CC02, #3DA001)' },
    { id: 'story', label: 'Jelajah Sejarah', icon: BookOpen, color: 'linear-gradient(135deg, #1CB0F6, #1485BA)' },
    { id: 'quiz', label: 'Latihan', icon: ClipboardCheck, color: 'linear-gradient(135deg, #1CB0F6, #1485BA)' },
    { id: 'game', label: 'Arena', icon: Gamepad2, color: 'linear-gradient(135deg, #f4c265, #E67E00)' },
    { id: 'shop', label: 'Toko', icon: ShoppingBag, color: 'linear-gradient(135deg, #CE82FF, #8E44AD)' },
    { id: 'profile', label: 'Profil', icon: User, color: 'linear-gradient(135deg, #FF4B4B, #D33131)' },
    { id: 'settings', label: 'Setelan', icon: Settings, color: 'linear-gradient(135deg, #AFAFAF, #777777)' },
  ];

  const SPRITE_ASSETS = [
    { name: 'Cermin Gaya Pahlawan', path: CerminSvg, format: 'SVG', category: 'Karakter & Aksi' },
    { name: 'Kuat Isi Ulang', path: KuatSvg, format: 'SVG', category: 'Karakter & Aksi' },
    { name: 'Karakter 1 Standar', path: Karakter1Svg, format: 'SVG', category: 'Karakter & Aksi' },
    { name: 'Karakter 1 Isometric', path: Character1IsoSvg, format: 'SVG', category: 'Karakter & Aksi' },
    { name: 'Karakter 2 Isometric', path: Character2IsoSvg, format: 'SVG', category: 'Karakter & Aksi' },
    { name: 'Karakter Melambai', path: Melambai1Svg, format: 'SVG', category: 'Karakter & Aksi' },
    { name: 'Karakter Duduk', path: Duduk2Svg, format: 'SVG', category: 'Karakter & Aksi' },
    { name: 'Meja Kelas', path: Meja1Svg, format: 'SVG', category: 'Objek UI' },
    { name: 'Ikon Jelajah Nusantara', path: JelajahNusantaraIcon, format: 'SVG', category: 'Objek UI' },
    { name: 'Ikon Tarik Tambang', path: AduCendekiawanIcon, format: 'SVG', category: 'Objek UI' },
    { name: 'Arena Pertarungan', path: Arena1Svg, format: 'SVG', category: 'Latar Belakang & Arena' },
    { name: 'Podium Pemenang', path: PodiumSvg, format: 'SVG', category: 'Latar Belakang & Arena' },
    { name: 'Ubin Lintasan (Tile)', path: TileSvg, format: 'SVG', category: 'Latar Belakang & Arena' },
    { name: 'Latar Belakang Peta', path: BgSvg, format: 'SVG', category: 'Latar Belakang & Arena' },
    { name: 'Semak Hiasan (Bush)', path: BushSvg, format: 'SVG', category: 'Latar Belakang & Arena' },
    { name: 'Lintasan Peta (Path)', path: PathSvg, format: 'SVG', category: 'Latar Belakang & Arena' },
    { name: 'Peta Utama 3D', path: Peta1Png, format: 'PNG', category: 'Latar Belakang & Arena' },
  ];

  const AUDIO_ASSETS = [
    { name: 'Blink Pop SFX', path: BlinkMp3, category: 'Efek Suara UI' },
    { name: 'Jawaban Benar (Correct)', path: CorrectMp3, category: 'Efek Suara Kuis' },
    { name: 'Jawaban Salah / Error', path: ErrorWav, category: 'Efek Suara UI' },
    { name: 'Glass Clink Transition', path: GlassMp3, category: 'Efek Suara UI' },
    { name: 'Hit Impact SFX', path: HitMp3, category: 'Efek Suara Permainan' },
    { name: 'Squash Reveal SFX', path: SquasbMp3, category: 'Efek Suara Toko' },
    { name: 'Success Reward SFX', path: SuccessMp3, category: 'Efek Suara UI' },
    { name: 'Whoosh Transition SFX', path: WhooshMp3, category: 'Efek Suara UI' },
    { name: 'Chest Opening SFX', path: ChestOpenWav, category: 'Efek Suara Toko' },
    { name: 'Click Button SFX', path: ClickWav, category: 'Efek Suara UI' },
    { name: 'Rolling Dice SFX', path: RollingDiceMp3, category: 'Efek Suara Permainan' },
    { name: 'Attack Action SFX', path: AttackWav, category: 'Efek Suara Permainan' },
    { name: 'Card Obtained SFX', path: CardGetWav, category: 'Efek Suara Permainan' },
    { name: 'Token Move SFX', path: MoveMp3, category: 'Efek Suara Permainan' },
    { name: 'Pixel Picnic Parade', path: PixelPicnicParadeMp3, category: 'Musik Latar (BGM)' },
  ];

  const LUCIDE_ICONS_LIST = [
    // Menu Utama
    { name: 'LayoutDashboard', component: <LayoutDashboard size={24} /> },
    { name: 'BookOpen', component: <BookOpen size={24} /> },
    { name: 'ClipboardCheck', component: <ClipboardCheck size={24} /> },
    { name: 'Gamepad2', component: <Gamepad2 size={24} /> },
    { name: 'ShoppingBag', component: <ShoppingBag size={24} /> },
    { name: 'User', component: <User size={24} /> },
    { name: 'Settings', component: <Settings size={24} /> },
    
    // UI Navigasi & Kontrol
    { name: 'ChevronLeft', component: <ChevronLeft size={24} /> },
    { name: 'ArrowLeft', component: <ArrowLeft size={24} /> },
    { name: 'ArrowRight', component: <ArrowRight size={24} /> },
    { name: 'ChevronUp', component: <ChevronUp size={24} /> },
    { name: 'ChevronDown', component: <ChevronDown size={24} /> },
    { name: 'Home', component: <Home size={24} /> },
    { name: 'Menu', component: <Menu size={24} /> },
    { name: 'X', component: <X size={24} /> },
    { name: 'Search', component: <Search size={24} /> },
    { name: 'Sliders', component: <Sliders size={24} /> },
    { name: 'Map', component: <Map size={24} /> },
    { name: 'LogOut', component: <LogOut size={24} /> },

    // Notifikasi & Info
    { name: 'Info', component: <Info size={24} /> },
    { name: 'HelpCircle', component: <HelpCircle size={24} /> },
    { name: 'Bell', component: <Bell size={24} /> },
    { name: 'Calendar', component: <Calendar size={24} /> },
    { name: 'Clock', component: <Clock size={24} /> },

    // Game & Hadiah
    { name: 'Award', component: <Award size={24} /> },
    { name: 'Crown', component: <Crown size={24} /> },
    { name: 'Medal', component: <Medal size={24} /> },
    { name: 'Flag', component: <Flag size={24} /> },
    { name: 'Key', component: <Key size={24} /> },
    { name: 'Lock', component: <Lock size={24} /> },
    { name: 'Unlock', component: <Unlock size={24} /> },
    { name: 'Sword', component: <Sword size={24} /> },
    { name: 'Shield', component: <Shield size={24} /> },
    { name: 'Flame', component: <Flame size={24} /> },
    { name: 'Heart', component: <Heart size={24} /> },
    { name: 'Star', component: <Star size={24} /> },
    { name: 'Sparkles', component: <Sparkles size={24} /> },
    { name: 'Trophy', component: <Trophy size={24} /> },
    { name: 'Gift', component: <Gift size={24} /> },
    { name: 'Dices', component: <Dices size={24} /> },
    { name: 'CheckCircle', component: <CheckCircle size={24} /> },
    { name: 'Trash2', component: <Trash2 size={24} /> },

    // Pendidikan
    { name: 'Book', component: <Book size={24} /> },
    { name: 'GraduationCap', component: <GraduationCap size={24} /> },
    { name: 'School', component: <School size={24} /> },
    { name: 'Compass', component: <Compass size={24} /> },
    { name: 'PenTool', component: <PenTool size={24} /> },
    { name: 'Edit3', component: <Edit3 size={24} /> },

    // Media & Audio
    { name: 'Play', component: <Play size={24} /> },
    { name: 'Pause', component: <Pause size={24} /> },
    { name: 'VolumeX', component: <VolumeX size={24} /> },
    { name: 'Volume2', component: <Volume2 size={24} /> },
    { name: 'Music', component: <Music size={24} /> },
    { name: 'Image', component: <Image size={24} /> },

    // Sosial
    { name: 'Users', component: <Users size={24} /> },
    { name: 'UserCheck', component: <UserCheck size={24} /> },
    { name: 'MessageSquare', component: <MessageSquare size={24} /> },
    { name: 'Share2', component: <Share2 size={24} /> }
  ];

  const BUTTON_ITEMS = [
    { id: '1', className: 'chunky-btn primary-green', face: 'Mulai Petualangan', title: 'Tomol Utama Hijau (Chunky Primary Green)', desc: 'Digunakan sebagai aksi konfirmasi utama, seperti memulai kuis, klaim pencapaian, dan mulai petualangan.', type: 'chunky', sfx: 'click' },
    { id: '2', className: 'chunky-btn primary-yellow', face: 'Klaim Hadiah', title: 'Tomol Aksen Kuning (Chunky Accent Yellow)', desc: 'Digunakan untuk aksi gembira, klaim peti harta karun, klaim reward harian, dan konfirmasi belanja.', type: 'chunky', styleFace: { color: '#4b4b4b' }, sfx: 'success' },
    { id: '3', className: 'chunky-btn primary-blue', face: 'Lanjutkan', title: 'Tomol Info Biru (Chunky Secondary Blue)', desc: 'Digunakan untuk navigasi cerita selanjutnya, tombol lanjut dialog, dan aksi konfirmasi netral.', type: 'chunky', sfx: 'click' },
    { id: '4', className: 'chunky-btn primary-red', face: 'Hapus Progress', title: 'Tomol Bahaya Merah (Chunky Danger Red)', desc: 'Digunakan untuk aksi destruktif seperti hapus data, reset materi belajar, dan keluar sesi.', type: 'chunky', sfx: 'error' },
    { id: '5', className: 'outlined-btn', face: 'Batal', title: 'Tomol Garis Tepi (Outlined Neutral Button)', desc: 'Digunakan untuk tombol batal, kembali ke halaman sebelumnya, atau menutup jendela modal.', type: 'outlined', sfx: 'click' },
    { id: '6', className: 'mock-action-mode-btn attack', face: '⚔️ SERANG', title: 'Tomol Duel Serang (Clash Attack Mode)', desc: 'Digunakan untuk memilih tindakan serangan fisik/tarikan tali di arena Adu Cendekiawan.', type: 'clash', style: { width: '140px' }, sfx: 'click' },
    { id: '7', className: 'mock-action-mode-btn heal', face: '💚 PULIHKAN', title: 'Tomol Duel Pulihkan (Clash Heal Mode)', desc: 'Digunakan untuk memulihkan nyawa/HP di arena Adu Cendekiawan melalui jawaban benar.', type: 'clash', style: { width: '140px' }, sfx: 'click' },
    { id: '8', className: 'mock-opt-btn', face: 'Pilihan Jawaban', title: 'Tomol Pilihan Jawaban Kuis (Quiz Option Button)', desc: 'Tombol kotak 3D bersudut tumpul untuk memilih jawaban kuis materi sejarah Indonesia.', type: 'option', style: { width: '180px' }, sfx: 'click' },
    { id: '9', className: 'mock-circle-hud-btn', face: '?', title: 'Tomol Bulat Mini HUD (Circular Control Button)', desc: 'Digunakan untuk menu setelan cepat, bantuan panduan bermain, dan tombol tutup X bulat.', type: 'hud', style: { width: '42px', height: '42px' }, sfx: 'click' }
  ];

  const NODE_ITEMS = [
    { id: 'n1', type: 'material', status: 'unlocked', label: 'Node Materi' },
    { id: 'n2', type: 'quiz', status: 'unlocked', label: 'Node Kuis' },
    { id: 'n3', type: 'reward', status: 'unlocked', label: 'Node Hadiah' },
    { id: 'n4', type: 'locked', status: 'locked', label: 'Node Terkunci' },
    { id: 'n5', type: 'claimed', status: 'claimed', label: 'Node Selesai / Diklaim' }
  ];

  const [sprites, setSprites] = useState(SPRITE_ASSETS);
  const [audios, setAudios] = useState(AUDIO_ASSETS);
  const [colors, setColors] = useState(COLOR_PALETTE);
  const [icons, setIcons] = useState(LUCIDE_ICONS_LIST);
  const [buttonsList, setButtonsList] = useState(BUTTON_ITEMS);
  const [nodesList, setNodesList] = useState(NODE_ITEMS);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedType, setDraggedType] = useState(null);

  const handleDragStart = (e, index, type) => {
    setDraggedIndex(index);
    setDraggedType(type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index, type) => {
    e.preventDefault();
    if (draggedType !== type || draggedIndex === index) return;
    
    if (type === 'sprites') {
      const updated = [...sprites];
      const draggedItem = updated[draggedIndex];
      updated.splice(draggedIndex, 1);
      updated.splice(index, 0, draggedItem);
      setDraggedIndex(index);
      setSprites(updated);
    } else if (type === 'audios') {
      const updated = [...audios];
      const draggedItem = updated[draggedIndex];
      updated.splice(draggedIndex, 1);
      updated.splice(index, 0, draggedItem);
      setDraggedIndex(index);
      setAudios(updated);
    } else if (type === 'colors') {
      const updated = [...colors];
      const draggedItem = updated[draggedIndex];
      updated.splice(draggedIndex, 1);
      updated.splice(index, 0, draggedItem);
      setDraggedIndex(index);
      setColors(updated);
    } else if (type === 'icons') {
      const updated = [...icons];
      const draggedItem = updated[draggedIndex];
      updated.splice(draggedIndex, 1);
      updated.splice(index, 0, draggedItem);
      setDraggedIndex(index);
      setIcons(updated);
    } else if (type === 'buttons') {
      const updated = [...buttonsList];
      const draggedItem = updated[draggedIndex];
      updated.splice(draggedIndex, 1);
      updated.splice(index, 0, draggedItem);
      setDraggedIndex(index);
      setButtonsList(updated);
    } else if (type === 'nodes') {
      const updated = [...nodesList];
      const draggedItem = updated[draggedIndex];
      updated.splice(draggedIndex, 1);
      updated.splice(index, 0, draggedItem);
      setDraggedIndex(index);
      setNodesList(updated);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedType(null);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSprites = SPRITE_ASSETS.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAudio = AUDIO_ASSETS.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`dev-assets-container ${hideFrames ? 'hide-frames' : ''} ${hideDescriptions ? 'hide-descriptions' : ''}`}>
      <header className="assets-header">
        <button className="back-btn" onClick={() => setCurrentView('main')}>
          <ChevronLeft size={20} /> Kembali
        </button>
        <div className="header-title-box">
          <h2>Pustaka Aset Lini Masa</h2>
          <span className="dev-badge">DEVELOPER LAB</span>
        </div>
      </header>

      {/* Tabs Filter */}
      <div className="filter-navigation">
        <div className="tabs-wrapper">
          {tabs.map(t => {
            const TabIcon = t.icon;
            return (
              <button 
                key={t.id} 
                className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => { setActiveTab(t.id); setSearchQuery(''); }}
              >
                <TabIcon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
        
        {activeTab !== 'fonts' && (
          <div className="search-bar-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Cari aset..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Visual Toggles Controls */}
      <div className="view-toggles-bar">
        <div className="toggle-control-item">
          <span className="toggle-label">Sembunyikan Deskripsi</span>
          <button 
            className={`toggle-switch mini-switch ${hideDescriptions ? 'active' : ''}`}
            onClick={() => {
              setHideDescriptions(!hideDescriptions);
              soundManager.play('click');
            }}
          >
            <div className="toggle-knob" />
          </button>
        </div>
        <div className="toggle-control-item">
          <span className="toggle-label">Sembunyikan Frame (Raw Visuals)</span>
          <button 
            className={`toggle-switch mini-switch ${hideFrames ? 'active' : ''}`}
            onClick={() => {
              setHideFrames(!hideFrames);
              soundManager.play('click');
            }}
          >
            <div className="toggle-knob" />
          </button>
        </div>
      </div>

      <div className="assets-viewport">
        {/* ================= SPRITES ================= */}
        {(activeTab === 'all' || activeTab === 'sprites') && (
          <section className="viewport-section">
            <h3 className="section-title-label">Gambar & Sprite ({filteredSprites.length})</h3>
            <div className="sprites-grid">
              {filteredSprites.map((item, idx) => (
                <div 
                  key={idx} 
                  className="sprite-card" 
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx, 'sprites')}
                  onDragOver={(e) => handleDragOver(e, idx, 'sprites')}
                  onDragEnd={handleDragEnd}
                  onClick={() => setPreviewImage(item)}
                >
                  <div className="sprite-preview-container">
                    <img src={item.path} alt={item.name} className="sprite-thumb" />
                  </div>
                  <div className="sprite-meta">
                    <h4>{item.name}</h4>
                    <div className="meta-footer">
                      <span className="format-badge">{item.format}</span>
                      <span className="category-text">{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= AUDIO ================= */}
        {(activeTab === 'all' || activeTab === 'audio') && (
          <section className="viewport-section">
            <h3 className="section-title-label">Audio & SFX ({filteredAudio.length})</h3>
            <div className="audio-list">
              {filteredAudio.map((item, idx) => (
                <div 
                  key={idx} 
                  className="audio-row"
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx, 'audios')}
                  onDragOver={(e) => handleDragOver(e, idx, 'audios')}
                  onDragEnd={handleDragEnd}
                >
                  <div className="audio-info">
                    <h4>{item.name}</h4>
                    <span className="category-text">{item.category}</span>
                  </div>
                  <div className="audio-player-control">
                    <audio src={item.path} controls className="html-audio-player" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= ICONS ================= */}
        {(activeTab === 'all' || activeTab === 'icons') && (
          <section className="viewport-section">
            <h3 className="section-title-label">Ikon Aplikasi (Lucide Icons)</h3>
            <div className="icons-grid-clean">
              {icons.map((icon, idx) => (
                <div 
                  key={idx} 
                  className="icon-box-clean" 
                  title={icon.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx, 'icons')}
                  onDragOver={(e) => handleDragOver(e, idx, 'icons')}
                  onDragEnd={handleDragEnd}
                >
                  {icon.component}
                </div>
              ))}
            </div>

            <h3 className="section-title-label" style={{ marginTop: '40px' }}>Node Lintasan Pembelajaran (Sifat Cahaya Path Nodes)</h3>
            <p className="section-desc-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: '600' }}>
              Tombol bulat 3D (path nodes) dari peta petualangan modul Sifat Cahaya beserta status keterbukaan dan penyelesaiannya.
            </p>
            <div className="mock-nodes-grid">
              {nodesList.map((node, idx) => (
                <div 
                  key={node.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx, 'nodes')}
                  onDragOver={(e) => handleDragOver(e, idx, 'nodes')}
                  onDragEnd={handleDragEnd}
                >
                  <MockNode type={node.type} status={node.status} label={node.label} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= FONTS ================= */}
        {activeTab === 'fonts' && (
          <section className="viewport-section">
            <h3 className="section-title-label">Typography</h3>
            <p className="section-desc-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '30px', fontWeight: '600' }}>
              Spesifikasi keluarga huruf dan hierarki teks yang digunakan secara konsisten di seluruh antarmuka aplikasi.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              
              {/* 1. OUTFIT (Display & Heading Font) */}
              <div className="typography-specimen-card" style={{ 
                background: 'white', 
                borderRadius: '24px', 
                border: '2.5px solid var(--border-color)', 
                padding: '40px', 
                display: 'flex', 
                flexDirection: 'row', 
                gap: '50px',
                alignItems: 'center',
                boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                color: '#1F2937',
                fontFamily: "'Outfit', sans-serif"
              }}>
                {/* Left Side: Massive Aa */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '180px', borderRight: '2px solid #E5E7EB', paddingRight: '40px' }}>
                  <span style={{ fontSize: '9rem', fontWeight: '950', lineHeight: 1, color: '#1F2937' }}>Aa</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '10px', color: '#1F2937', letterSpacing: '-0.5px' }}>Outfit</span>
                </div>

                {/* Right Side: Spec Table */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', borderBottom: '2px solid #E5E7EB', paddingBottom: '12px', marginBottom: '24px' }}>
                    <span style={{ fontWeight: '900', color: '#4B5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '3.5px solid #10B981', paddingBottom: '6px', width: 'fit-content' }}>Style</span>
                    <span style={{ fontWeight: '900', color: '#4B5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '3.5px solid #10B981', paddingBottom: '6px', width: 'fit-content' }}>Weight</span>
                    <span style={{ fontWeight: '900', color: '#4B5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '3.5px solid #10B981', paddingBottom: '6px', width: 'fit-content' }}>Point</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Row 1: Heading 1 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '950', fontSize: '44px', color: '#111827', margin: 0, padding: 0, lineHeight: 1.1 }}>Heading 1</span>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '950', fontSize: '1.1rem', color: '#111827' }}>Super Bold</span>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '900', fontSize: '1.5rem', color: '#111827' }}>44</span>
                    </div>

                    {/* Row 2: Heading 2 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '800', fontSize: '36px', color: '#1F2937', margin: 0, padding: 0, lineHeight: 1.1 }}>Heading 2</span>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '800', fontSize: '1rem', color: '#4B5563' }}>Extra Bold</span>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '800', fontSize: '1.3rem', color: '#1F2937' }}>36</span>
                    </div>

                    {/* Row 3: Sub-Heading */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '600', fontSize: '24px', color: '#374151', margin: 0, padding: 0, lineHeight: 1.1 }}>Sub-Heading</span>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '600', fontSize: '0.95rem', color: '#4B5563' }}>Semi Bold</span>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '600', fontSize: '1.2rem', color: '#374151' }}>24</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. NUNITO (Body & UI Font) */}
              <div className="typography-specimen-card" style={{ 
                background: 'white', 
                borderRadius: '24px', 
                border: '2.5px solid var(--border-color)', 
                padding: '40px', 
                display: 'flex', 
                flexDirection: 'row', 
                gap: '50px',
                alignItems: 'center',
                boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                color: '#1F2937',
                fontFamily: "'Nunito', sans-serif"
              }}>
                {/* Left Side: Massive Aa */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '180px', borderRight: '2px solid #E5E7EB', paddingRight: '40px' }}>
                  <span style={{ fontSize: '9rem', fontWeight: '800', lineHeight: 1, color: '#1F2937' }}>Aa</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: '900', marginTop: '10px', color: '#1F2937', letterSpacing: '-0.5px' }}>Nunito</span>
                </div>

                {/* Right Side: Spec Table */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', borderBottom: '2px solid #E5E7EB', paddingBottom: '12px', marginBottom: '24px' }}>
                    <span style={{ fontWeight: '900', color: '#4B5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '3.5px solid #10B981', paddingBottom: '6px', width: 'fit-content' }}>Style</span>
                    <span style={{ fontWeight: '900', color: '#4B5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '3.5px solid #10B981', paddingBottom: '6px', width: 'fit-content' }}>Weight</span>
                    <span style={{ fontWeight: '900', color: '#4B5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '3.5px solid #10B981', paddingBottom: '6px', width: 'fit-content' }}>Point</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Row 1: Main Text */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: '700', fontSize: '20px', color: '#1F2937', margin: 0, padding: 0, lineHeight: 1.1 }}>Main Text</span>
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: '700', fontSize: '1rem', color: '#4B5563' }}>Bold</span>
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: '700', fontSize: '1.3rem', color: '#1F2937' }}>20</span>
                    </div>

                    {/* Row 2: Menu */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: '600', fontSize: '18px', color: '#374151', margin: 0, padding: 0, lineHeight: 1.1 }}>Menu</span>
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: '600', fontSize: '0.95rem', color: '#4B5563' }}>Medium</span>
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: '600', fontSize: '1.2rem', color: '#374151' }}>18</span>
                    </div>

                    {/* Row 3: Body Text */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: '400', fontSize: '16px', color: '#4B5563', margin: 0, padding: 0, lineHeight: 1.1 }}>Body Text</span>
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: '400', fontSize: '0.9rem', color: '#6B7280' }}>Regular</span>
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: '400', fontSize: '1.1rem', color: '#4B5563' }}>16</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. FREDOKA (Game Title & Score Font) */}
              <div className="typography-specimen-card" style={{ 
                background: 'white', 
                borderRadius: '24px', 
                border: '2.5px solid var(--border-color)', 
                padding: '40px', 
                display: 'flex', 
                flexDirection: 'row', 
                gap: '50px',
                alignItems: 'center',
                boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                color: '#1F2937',
                fontFamily: "'Fredoka', sans-serif"
              }}>
                {/* Left Side: Massive Aa */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '180px', borderRight: '2px solid #E5E7EB', paddingRight: '40px' }}>
                  <span style={{ fontSize: '9rem', fontWeight: '700', lineHeight: 1, color: '#1F2937' }}>Aa</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '10px', color: '#1F2937', letterSpacing: '-0.5px' }}>Fredoka</span>
                </div>

                {/* Right Side: Spec Table */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', borderBottom: '2px solid #E5E7EB', paddingBottom: '12px', marginBottom: '24px' }}>
                    <span style={{ fontWeight: '900', color: '#4B5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '3.5px solid #10B981', paddingBottom: '6px', width: 'fit-content' }}>Style</span>
                    <span style={{ fontWeight: '900', color: '#4B5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '3.5px solid #10B981', paddingBottom: '6px', width: 'fit-content' }}>Weight</span>
                    <span style={{ fontWeight: '900', color: '#4B5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '3.5px solid #10B981', paddingBottom: '6px', width: 'fit-content' }}>Point</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Row 1: Game Title */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: '700', fontSize: '40px', color: '#111827', margin: 0, padding: 0, lineHeight: 1.1 }}>Game Title</span>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: '700', fontSize: '1rem', color: '#111827' }}>Bold Rounded</span>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: '700', fontSize: '1.4rem', color: '#111827' }}>40</span>
                    </div>

                    {/* Row 2: Score Display */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: '600', fontSize: '32px', color: '#1F2937', margin: 0, padding: 0, lineHeight: 1.1 }}>Score Display</span>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: '600', fontSize: '0.95rem', color: '#4B5563' }}>Medium Rounded</span>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: '600', fontSize: '1.25rem', color: '#1F2937' }}>32</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ================= COLORS ================= */}
        {(activeTab === 'all' || activeTab === 'colors') && (
          <section className="viewport-section" style={{ marginTop: '20px' }}>
            <h3 className="section-title-label">Warna & Palet Sistem</h3>
            <div className="colors-grid">
              {colors.map((color, idx) => (
                <div 
                  key={idx} 
                  className="color-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx, 'colors')}
                  onDragOver={(e) => handleDragOver(e, idx, 'colors')}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => {
                    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                      handleCopy(color.hex, color.name);
                    }
                  }}
                >
                  <div className="color-preview" style={{ background: `var(${color.varName})` }} />
                  <div className="color-info">
                    <input 
                      type="text" 
                      className="color-name-input"
                      value={color.name}
                      onChange={(e) => {
                        const updated = [...colors];
                        updated[idx].name = e.target.value;
                        setColors(updated);
                      }}
                    />
                    <span className="color-var-code">{color.varName}</span>
                    <span className="color-hex-code">{color.hex}</span>
                    {!hideDescriptions && (
                      <textarea 
                        className="color-desc-input"
                        value={color.desc}
                        onChange={(e) => {
                          const updated = [...colors];
                          updated[idx].desc = e.target.value;
                          setColors(updated);
                        }}
                      />
                    )}
                  </div>
                  {copiedId === color.name && <span className="copied-tag">Tersalin!</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= POP-UPS ================= */}
        {(activeTab === 'all' || activeTab === 'popups') && (
          <section className="viewport-section" style={{ marginTop: '20px' }}>
            <h3 className="section-title-label">Menu & Pop-up Dialog (Live Inline Previews)</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '30px', 
              width: '100%', 
              marginTop: '20px' 
            }}>
              
              {/* 1. Event Kuis Jejak Pengetahuan */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2.5px dashed var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#38B6FF', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>1. KUIS JEJAK PENGETAHUAN</span>
                <div className="event-sheet-overlay">
                  <div className="event-sheet-container" style={{ width: '100%' }}>
                    <div className="sheet-layout">
                      <div className="sheet-header">
                        <div className="title-stack">
                          <h2 className="event-title">KUIS JEJAK PENGETAHUAN</h2>
                          <p className="event-msg">Jawab pertanyaan berikut untuk mendapatkan koin emas!</p>
                        </div>
                      </div>
                      <div className="sheet-body">
                        <QuizContent 
                          question={{
                            question: "Siapakah tokoh yang membacakan naskah Proklamasi Kemerdekaan Indonesia pada tanggal 17 Agustus 1945?",
                            options: ["Drs. Moh. Hatta", "Ir. Soekarno", "Sutan Syahrir", "Mr. Ahmad Soebardjo"],
                            correct: 1
                          }} 
                          onAnswer={(ansIdx) => {
                            soundManager.play(ansIdx === 1 ? 'success' : 'error');
                            alert(`Jawaban Anda: Opsi ${ansIdx + 1}`);
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Event Pertarungan Penjaga Pos */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2.5px dashed var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#38B6FF', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>2. PERTARUNGAN PENJAGA POS</span>
                <div className="event-sheet-overlay">
                  <div className="event-sheet-container" style={{ width: '100%' }}>
                    <div className="sheet-layout">
                      <div className="sheet-header">
                        <div className="title-stack">
                          <h2 className="event-title">PENJAGA POS SRIWIJAYA</h2>
                          <p className="event-msg">Kalahkan Penjaga Pos untuk melewati rintangan jalan ini!</p>
                        </div>
                      </div>
                      <div className="sheet-body">
                        <BattleContent 
                          player={{ name: 'Budi (Kamu)', characterId: 1, tekad: 80, koin: 150 }}
                          guardian={{ name: 'Prajurit Sriwijaya', power: 4, emoji: '👹' }} 
                          playerRoll={null} 
                          isRolling={false}
                          isPending={true}
                          onRoll={() => {
                            soundManager.play('dice_roll');
                            alert("Dadu diputar!");
                          }}
                          loser={null}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Event Persimpangan (Choice) */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2.5px dashed var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#38B6FF', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>3. PERSIMPANGAN JALAN</span>
                <div className="event-sheet-overlay">
                  <div className="event-sheet-container" style={{ width: '100%' }}>
                    <div className="sheet-layout">
                      <div className="sheet-header">
                        <div className="title-stack">
                          <h2 className="event-title">PERSIMPANGAN UTAMA</h2>
                          <p className="event-msg">Pilihlah jalur lintasan perjalananmu berikutnya!</p>
                        </div>
                      </div>
                      <div className="sheet-body">
                        <ChoiceContent 
                          message="Kamu tiba di persimpangan jalan kuno kerajaan Nusantara. Pilih jalanmu!" 
                          remainingSteps={3}
                          onChoice={(choice) => {
                            soundManager.play('click');
                            alert(`Arah yang dipilih: Jalur ${choice}`);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Event Dapat Kartu Aksi (Card Preview) */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2.5px dashed var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#38B6FF', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>4. DAPAT KARTU AKSI</span>
                <div className="event-sheet-overlay">
                  <div className="event-sheet-container" style={{ width: '100%' }}>
                    <div className="sheet-layout">
                      <div className="sheet-header">
                        <div className="title-stack">
                          <h2 className="event-title">KARTU BARU DIPEROLEH</h2>
                          <p className="event-msg">Kartu aksi ini ditambahkan ke kantong tasmu!</p>
                        </div>
                      </div>
                      <div className="sheet-body">
                        <CardPreviewContent card={{ name: 'Langkah Warp', icon: '🌀', description: 'Teleportasi langsung ke ubin mana saja di papan permainan.', cost: 20, color: '#3B82F6' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Event Buang Kartu (Discard Card) */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2.5px dashed var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#38B6FF', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>5. BUANG KARTU (TAS PENUH)</span>
                <div className="event-sheet-overlay">
                  <div className="event-sheet-container" style={{ width: '100%' }}>
                    <div className="sheet-layout">
                      <div className="sheet-header">
                        <div className="title-stack">
                          <h2 className="event-title">TAS PENUH!</h2>
                          <p className="event-msg">Pilihlah salah satu kartu untuk dibuang agar bisa menyimpan kartu baru.</p>
                        </div>
                      </div>
                      <div className="sheet-body">
                        <DiscardCardContent 
                          currentInventory={[
                            { instanceId: 'card-1', name: 'Kartu Pijar', icon: '🕯️', description: 'Maju 3 langkah' },
                            { instanceId: 'card-2', name: 'Kartu Tekad', icon: '❤️', description: 'Pulihkan 20 Tekad' }
                          ]}
                          newCard={{ instanceId: 'card-3', name: 'Kartu Warp', icon: '🌀', description: 'Warp teleportasi' }}
                          onDiscard={(instanceId) => {
                            soundManager.play('click');
                            alert(`Kartu dengan ID ${instanceId} dibuang.`);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Event Undangan Duel Cendekiawan */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2.5px dashed var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#38B6FF', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>6. UNDANGAN DUEL CENDEKIAWAN</span>
                <div className="event-sheet-overlay">
                  <div className="event-sheet-container" style={{ width: '100%' }}>
                    <div className="sheet-layout">
                      <div className="sheet-header">
                        <div className="title-stack">
                          <h2 className="event-title">TANTANGAN DUEL</h2>
                          <p className="event-msg">Pemain lain mengajakmu berduel kecerdasan sejarah!</p>
                        </div>
                      </div>
                      <div className="sheet-body">
                        <DuelInvitationContent 
                          opponent={{ name: 'Santi (AI)', characterId: 2, stats: { serangan: 0, pertahanan: 2, kelincahan: 1 } }} 
                          onChoice={(choice) => {
                            soundManager.play('click');
                            alert(`Pilihan tantangan: ${choice}`);
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Event Pilih Lawan Duel */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2.5px dashed var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#38B6FF', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>7. PILIH LAWAN DUEL</span>
                <div className="event-sheet-overlay">
                  <div className="event-sheet-container" style={{ width: '100%' }}>
                    <div className="sheet-layout">
                      <div className="sheet-header">
                        <div className="title-stack">
                          <h2 className="event-title">PILIH TARGET DUEL</h2>
                          <p className="event-msg">Pilihlah salah satu penjelajah di lintasan untuk diajak berduel.</p>
                        </div>
                      </div>
                      <div className="sheet-body">
                        <DuelTargetSelectionContent 
                          onSelectTarget={(target) => {
                            soundManager.play('click');
                            alert(`Target dipilih: ${target}`);
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. Event Beli Peti di Markas */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2.5px dashed var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#38B6FF', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>8. BELI PETI DI MARKAS</span>
                <div className="event-sheet-overlay">
                  <div className="event-sheet-container" style={{ width: '100%' }}>
                    <div className="sheet-layout">
                      <div className="sheet-header">
                        <div className="title-stack">
                          <h2 className="event-title">KUNJUNGAN MARKAS</h2>
                          <p className="event-msg">Tukarkan koin emasmu untuk membeli peti kemenangan!</p>
                        </div>
                      </div>
                      <div className="sheet-body">
                        <BasePurchaseContent 
                          cost={200} 
                          onChoice={(choice) => {
                            soundManager.play('click');
                            alert(`Beli peti: ${choice}`);
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 9. Modal Panduan Bermain (JelajahHelpModal) */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2px solid var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#10B981', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>9. MODAL PANDUAN BERMAIN</span>
                <JelajahHelpModal isOpen={true} onClose={() => {}} />
              </div>

              {/* 10. Modal Pengaturan Game (GameSettingsModal) */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2px solid var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#10B981', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>10. PENGATURAN GAME</span>
                <GameSettingsModal isOpen={true} onClose={() => {}} />
              </div>

              {/* 11. Modal Tas / Inventori (InventoryDetailList) */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2px solid var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#10B981', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>11. TAS & KARTU AKSI</span>
                <InventoryDetailList 
                  player={{
                    name: 'Budi (Kamu)',
                    characterId: 1,
                    koin: 150,
                    tekad: 80,
                    inventory: [
                      { name: 'Kartu Pijar', icon: '🕯️', desc: 'Maju 3 langkah otomatis tanpa putar dadu.' },
                      { name: 'Kartu Tekad', icon: '❤️', desc: 'Pulihkan kembali 20 poin Tekad karaktermu.' },
                      { name: 'Kartu Warp', icon: '🌀', desc: 'Teleportasi langsung ke ubin mana saja di papan.' }
                    ]
                  }} 
                  isTestMode={true} 
                  onClose={() => {}} 
                />
              </div>

              {/* 12. Modal Kemenangan (VictoryModal) */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2.5px dashed var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#EF4444', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>12. MODAL KEMENANGAN</span>
                <div className="victory-overlay" style={{ background: 'none', position: 'relative', inset: 'auto', zIndex: 1, padding: 0, backdropFilter: 'none' }}>
                  <div className="victory-popup" style={{ border: '2px solid var(--border-color)', boxShadow: 'none' }}>
                    <div className="popup-header">
                      <div className="trophy-badge">🏆</div>
                      <h2 className="popup-title">HASIL AKHIR</h2>
                      <p className="popup-subtitle">🏆 <strong>Budi (Kamu)</strong> pemenang!</p>
                    </div>
                    <div className="podium-row">
                      <div className="podium-col col-rank-2" style={{ opacity: 1 }}>
                        <div className="podium-avatar-wrap silver-ring">
                          <div className="podium-avatar-crop">
                            <span style={{ fontSize: '1.8rem' }}>🐱</span>
                          </div>
                          <div className="rank-badge rank-2-badge">2</div>
                        </div>
                        <span className="podium-name">Santi</span>
                        <div className="podium-block block-2" />
                      </div>
                      <div className="podium-col col-rank-1" style={{ opacity: 1 }}>
                        <div className="winner-crown">👑</div>
                        <div className="podium-avatar-wrap gold-ring">
                          <div className="podium-avatar-crop gold-bg">
                            <span style={{ fontSize: '2.2rem' }}>🐰</span>
                          </div>
                          <div className="rank-badge rank-1-badge">1</div>
                        </div>
                        <span className="podium-name name-gold">Budi (Kamu)</span>
                        <div className="podium-block block-1" />
                      </div>
                      <div className="podium-col col-rank-3" style={{ opacity: 1 }}>
                        <div className="podium-avatar-wrap bronze-ring">
                          <div className="podium-avatar-crop">
                            <span style={{ fontSize: '1.8rem' }}>🦊</span>
                          </div>
                          <div className="rank-badge rank-3-badge">3</div>
                        </div>
                        <span className="podium-name">Bimo</span>
                        <div className="podium-block block-3" />
                      </div>
                    </div>
                    <div className="score-strips">
                      <div className="score-strip is-you">
                        <span className="strip-rank-num">#1</span>
                        <div className="strip-info">
                          <span className="strip-name">Budi (Kamu) <span className="you-tag">KAMU</span></span>
                        </div>
                        <div className="strip-scores">
                          <span className="score-pill peti">3 Peti</span>
                          <span className="score-pill koin">250 Koin</span>
                        </div>
                      </div>
                      <div className="score-strip">
                        <span className="strip-rank-num">#2</span>
                        <div className="strip-info">
                          <span className="strip-name">Santi</span>
                        </div>
                        <div className="strip-scores">
                          <span className="score-pill peti">2 Peti</span>
                          <span className="score-pill koin">180 Koin</span>
                        </div>
                      </div>
                    </div>
                    <div className="reward-box">
                      <Star size={18} color="#D97706" fill="#FACC15" />
                      <span>+400 Bintang diperoleh!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 13. Modal Pemulihan Karakter (Recovery) */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2.5px dashed var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#EF4444', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>13. PEMULIHAN KARAKTER</span>
                <div className="event-sheet-overlay">
                  <div className="event-sheet-container" style={{ borderColor: '#EF4444' }}>
                    <div className="sheet-layout">
                      <div className="sheet-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                        <div className="title-stack">
                          <h2 className="event-title" style={{ color: '#EF4444' }}>TUMBANG!</h2>
                          <p className="event-msg">Karaktermu pingsan karena kehabisan poin Tekad!</p>
                        </div>
                      </div>
                      <div className="sheet-body" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3.5rem', margin: '15px 0' }}>🐰💤</div>
                        <div style={{ background: '#FEF2F2', border: '2.5px dashed #FCA5A5', borderRadius: '16px', padding: '12px', marginBottom: '20px', color: '#991B1B', fontWeight: '800' }}>
                          🎲 Putar dadu pemulihan dan dapatkan angka <strong>5 atau 6</strong> untuk bangkit kembali!
                        </div>
                        <button className="chunky-btn primary-red" style={{ width: '100%' }} onClick={() => soundManager.play('dice_roll')}>
                          <span className="btn-face">PUTAR DADU PEMULIHAN</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 14. Overlay Giliran Pemain (TurnOverlay) */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2px solid var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#10B981', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>14. OVERLAY GILIRAN BARU</span>
                <TurnOverlay isVisible={true} playerName="Budi (Kamu)" playerColor="#1CB0F6" />
              </div>

              {/* 15. Tambah Murid Guru (AddStudentModal) */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2px solid var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#8B5CF6', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>15. TAMBAH MURID (GURU)</span>
                <AddStudentModal 
                  isOpen={true} 
                  onClose={() => {}} 
                  activeClassroom={{ id: 'class-1', name: 'Kelas 5-A' }} 
                  onAddStudent={(std) => alert(`Murid ditambahkan: ${std.name}`)} 
                />
              </div>

              {/* 16. Detail Murid & Rapor Guru (StudentDetailModal) */}
              <div className="inline-popup-container" style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '2px solid var(--border-color)', borderRadius: '28px', padding: '24px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', background: '#8B5CF6', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', position: 'absolute', top: '-12px', left: '20px', zIndex: 5 }}>16. DETAIL & RAPOR MURID</span>
                <StudentDetailModal 
                  selectedStudent={{
                    id: 'stud-1',
                    name: studentDetailName,
                    nis: studentDetailNis,
                    score: 85,
                    attendance: 100
                  }}
                  onClose={() => {}}
                  activeClassroom={{ name: 'Kelas 5-A' }}
                  getStudentRecord={(id, score) => ({
                    academic: [
                      { subject: 'Kerajaan Kutai', score: 90, classAvg: 75, dateShared: '2026-06-01', dateCompleted: '2026-06-02' },
                      { subject: 'Kerajaan Tarumanegara', score: 80, classAvg: 70, dateShared: '2026-06-05', dateCompleted: '2026-06-07' },
                      { subject: 'Kerajaan Sriwijaya', score: 85, classAvg: 80, dateShared: '2026-06-10', dateCompleted: '2026-06-12' }
                    ],
                    attendance: {
                      'Minggu 1': 'Hadir',
                      'Minggu 2': 'Hadir',
                      'Minggu 3': 'Sakit',
                      'Minggu 4': 'Hadir',
                      'Minggu 5': 'Hadir'
                    },
                    notes: 'Murid sangat aktif mengikuti materi sejarah dan game isometrik.'
                  })}
                  onSave={() => alert('Rapor murid disimpan!')}
                />
              </div>

            </div>
          </section>
        )}

        {/* ================= BUTTONS ================= */}
        {(activeTab === 'all' || activeTab === 'buttons') && (
          <section className="viewport-section" style={{ marginTop: '20px' }}>
            <h3 className="section-title-label">Koleksi Gaya Tombol Aplikasi</h3>
            <p className="section-desc-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: '600' }}>
              Daftar seluruh gaya tombol interaktif yang digunakan di berbagai fitur aplikasi, berjajar secara vertikal tanpa frame luar.
            </p>
            
            <div className="vertical-buttons-list">
              {buttonsList.map((btn, idx) => (
                <div 
                  key={btn.id} 
                  className="vertical-button-item-row"
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx, 'buttons')}
                  onDragOver={(e) => handleDragOver(e, idx, 'buttons')}
                  onDragEnd={handleDragEnd}
                >
                  <div className="btn-preview-column">
                    {btn.type === 'chunky' ? (
                      <button className={btn.className} onClick={() => soundManager.play(btn.sfx)}>
                        <span className="btn-face" style={btn.styleFace}>{btn.face}</span>
                      </button>
                    ) : btn.type === 'outlined' ? (
                      <button className={btn.className} onClick={() => soundManager.play(btn.sfx)}>
                        {btn.face}
                      </button>
                    ) : btn.type === 'clash' ? (
                      <button className={btn.className} style={btn.style} onClick={() => soundManager.play(btn.sfx)}>
                        {btn.face}
                      </button>
                    ) : btn.type === 'option' ? (
                      <button className={btn.className} style={btn.style} onClick={() => soundManager.play(btn.sfx)}>
                        {btn.face}
                      </button>
                    ) : (
                      <button className={btn.className} style={btn.style} onClick={() => soundManager.play(btn.sfx)}>{btn.face}</button>
                    )}
                  </div>
                  <div className="btn-info-column">
                    <h5>{btn.title}</h5>
                    <p>{btn.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= COMPONENT NAVIGATOR PREVIEW ================= */}
        {(activeTab === 'all' || activeTab === 'navigation') && (
          <section className="viewport-section" style={{ marginTop: '20px' }}>
            <h3 className="section-title-label">Komponen Navigator</h3>
            
            <h4 className="icon-group-title">Navigator Vertikal (Sidebar Nav)</h4>
            <div className="mock-navigator-row-grid">
              
              {/* Sidebar Active Preview */}
              <div className="mock-navigator-column-card">
                <h5>Semua Status Aktif (Active Preview)</h5>
                <div className="mock-sidebar-container">
                  <div className="mock-sidebar-nav">
                    {NAV_ITEMS.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <div key={item.id} className="mock-sidebar-item active">
                          <div className="mock-sidebar-icon-box" style={{ '--color': item.color }}>
                            <IconComp />
                          </div>
                          <span className="mock-sidebar-label">{item.label}</span>
                          <div className="mock-active-indicator" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar Inactive Preview */}
              <div className="mock-navigator-column-card">
                <h5>Semua Status Tidak Aktif (Inactive Preview)</h5>
                <div className="mock-sidebar-container">
                  <div className="mock-sidebar-nav">
                    {NAV_ITEMS.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <div key={item.id} className="mock-sidebar-item">
                          <div className="mock-sidebar-icon-box" style={{ '--color': item.color }}>
                            <IconComp />
                          </div>
                          <span className="mock-sidebar-label">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar Interactive Simulator */}
              <div className="mock-navigator-column-card">
                <h5>Simulator Interaktif (Hover & Klik)</h5>
                <div className="mock-sidebar-container">
                  <div className="mock-sidebar-nav">
                    {NAV_ITEMS.map((item) => {
                      const IconComp = item.icon;
                      const isActive = activeSimTab === item.id;
                      return (
                        <div 
                          key={item.id} 
                          className={`mock-sidebar-item ${isActive ? 'active' : ''}`}
                          onClick={() => { soundManager.play('click'); setActiveSimTab(item.id); }}
                        >
                          <div className="mock-sidebar-icon-box" style={{ '--color': item.color }}>
                            <IconComp />
                          </div>
                          <span className="mock-sidebar-label">{item.label}</span>
                          {isActive && <div className="mock-active-indicator" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            <h4 className="icon-group-title" style={{ marginTop: '30px' }}>Navigator Horizontal (Mobile Tab Bar)</h4>
            
            <div className="mock-tabbar-vertical-stack">
              {/* Horizontal Tabbar All Active Preview */}
              <div className="mock-tabbar-preview-box">
                <h5>Semua Status Aktif (Active Preview)</h5>
                <div className="mock-pop-tabbar">
                  <div className="mock-tabbar-items">
                    {NAV_ITEMS.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <div key={item.id} className="mock-pop-tab-item active" style={{ '--tab-color': item.color }}>
                          <div className="mock-icon-wrapper">
                            <div className="mock-active-circle" />
                            <div className="mock-icon-main">
                              <IconComp />
                            </div>
                          </div>
                          <span className="mock-pop-label">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Horizontal Tabbar All Inactive Preview */}
              <div className="mock-tabbar-preview-box">
                <h5>Semua Status Tidak Aktif (Inactive Preview)</h5>
                <div className="mock-pop-tabbar">
                  <div className="mock-tabbar-items">
                    {NAV_ITEMS.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <div key={item.id} className="mock-pop-tab-item" style={{ '--tab-color': item.color }}>
                          <div className="mock-icon-wrapper">
                            <div className="mock-active-circle" />
                            <div className="mock-icon-main">
                              <IconComp />
                            </div>
                          </div>
                          <span className="mock-pop-label">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Horizontal Tabbar Interactive Simulator */}
              <div className="mock-tabbar-preview-box">
                <h5>Simulator Interaktif (Klik Tab)</h5>
                <div className="mock-pop-tabbar">
                  <div className="mock-tabbar-items">
                    {NAV_ITEMS.map((item) => {
                      const IconComp = item.icon;
                      const isActive = activeSimTab === item.id;
                      return (
                        <div 
                          key={item.id} 
                          className={`mock-pop-tab-item ${isActive ? 'active' : ''}`}
                          style={{ '--tab-color': item.color }}
                          onClick={() => { soundManager.play('click'); setActiveSimTab(item.id); }}
                        >
                          <div className="mock-icon-wrapper">
                            <div className="mock-active-circle" />
                            <div className="mock-icon-main">
                              <IconComp />
                            </div>
                          </div>
                          <span className="mock-pop-label">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

          </section>
        )}

        {/* ================= JELAJAH NUSANTARA GAMEPLAY UI ================= */}
        {(activeTab === 'all' || activeTab === 'gameplay') && (
          <section className="viewport-section" style={{ marginTop: '20px' }}>
            <h3 className="section-title-label">UI Elemen Jelajah Nusantara</h3>
            <p className="section-desc-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: '600' }}>
              Koleksi seluruh elemen antarmuka, bilah status, tombol aksi, dan widget khusus yang digunakan pada layar permainan Jelajah Nusantara.
            </p>
            
            {/* 1. TOP HEADER WIDGETS */}
            <h4 className="icon-group-title">1. Bilah Status Atas (Top Header HUD)</h4>
            <div className="game-hud-row-container">
              <div className="game-hud-preview-card">
                <h5>Bilah Koin Emas (Coins Pill)</h5>
                <div className="mock-game-pill koin-pill">
                  <div className="mock-game-pill-icon koin-icon">🪙</div>
                  <span className="mock-game-pill-val">0<span className="mock-game-pill-max">/200</span></span>
                </div>
              </div>

              <div className="game-hud-preview-card">
                <h5>Bilah Tekad/Nyawa (Stamina Pill)</h5>
                <div className="mock-game-pill tekad-pill">
                  <div className="mock-game-pill-icon tekad-icon">❤️</div>
                  <span className="mock-game-pill-val">100<span className="mock-game-pill-max">/100</span></span>
                </div>
              </div>

              <div className="game-hud-preview-card">
                <h5>Bar Peti Harta (Treasure Chest Slots)</h5>
                <div className="mock-game-chest-bar">
                  <span className="chest-bar-emoji">📦</span>
                  <div className="chest-slot-dots">
                    <div className="chest-dot filled"></div>
                    <div className="chest-dot"></div>
                    <div className="chest-dot"></div>
                  </div>
                </div>
              </div>

              <div className="game-hud-preview-card">
                <h5>Tombol Fitur Lingkar (Circular Controls)</h5>
                <div className="mock-circular-btns-row">
                  <button className="mock-circle-hud-btn help-btn" onClick={() => soundManager.play('click')}>?</button>
                  <button className="mock-circle-hud-btn settings-btn" onClick={() => soundManager.play('click')}>⚙️</button>
                </div>
              </div>
            </div>

            {/* 2. FLOATING & BUBBLE BANNER */}
            <h4 className="icon-group-title" style={{ marginTop: '30px' }}>2. Tombol Aksi Mengambang & Gelembung Dialog</h4>
            <div className="game-hud-row-container">
              
              <div className="game-hud-preview-card">
                <h5>Tombol Kamera (Camera Mode)</h5>
                <button className="mock-floating-rect-btn camera" onClick={() => soundManager.play('click')}>
                  <div className="rect-btn-icon">🔄</div>
                  <span>KAMERA</span>
                </button>
              </div>

              <div className="game-hud-preview-card">
                <h5>Tombol Cheat Debug (Cheat Panel)</h5>
                <button className="mock-floating-rect-btn cheat" onClick={() => soundManager.play('click')}>
                  <div className="rect-btn-icon">📍</div>
                  <span>CHEAT</span>
                </button>
              </div>

              <div className="game-hud-preview-card" style={{ flex: 2, minWidth: '300px' }}>
                <h5>Gelembung Dialog Instruksi (Tutorial Speech Bubble)</h5>
                <div className="mock-speech-bubble-banner">
                  <p>Putar dadu untuk bergerak!</p>
                </div>
              </div>

            </div>

            {/* 3. BOTTOM CONTROLS & PLAYER BADGES */}
            <h4 className="icon-group-title" style={{ marginTop: '30px' }}>3. Kontrol Aksi Bawah & Kartu Pemain (Bottom HUD & Badges)</h4>
            
            <div className="mock-bottom-hud-layout-preview">
              <div className="mock-bottom-hud-left-panel">
                <h5>Profil Status Pemain (Player Badges)</h5>
                
                <div className="mock-player-badge-item player-1">
                  <div className="player-badge-avatar">🐰</div>
                  <div className="player-badge-info">
                    <span className="player-badge-role green">P1 Budi (Kamu)</span>
                    <div className="player-badge-stats">
                      <span>❤️ 100</span>
                      <span>🪙 0</span>
                      <span>📦 0</span>
                      <span>🎴 1</span>
                    </div>
                  </div>
                </div>

                <div className="mock-player-badge-item player-2" style={{ marginTop: '8px' }}>
                  <div className="player-badge-avatar">🐱</div>
                  <div className="player-badge-info">
                    <span className="player-badge-role purple">P2 Teman 2</span>
                    <div className="player-badge-stats">
                      <span>❤️ 100</span>
                      <span>🪙 0</span>
                      <span>📦 0</span>
                      <span>🎴 0</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mock-bottom-hud-right-panel">
                <h5>Bar Tombol Bawah (Bottom Bar Controls)</h5>
                <div className="mock-bottom-controls-bar">
                  
                  {/* Tas Button */}
                  <button className="mock-bottom-tas-btn" onClick={() => soundManager.play('click')}>
                    <span className="tas-icon">💼</span>
                    <span className="tas-label">TAS</span>
                    <span className="tas-count">1/3</span>
                  </button>

                  {/* Putar Dadu */}
                  <button className="mock-bottom-dadu-btn" onClick={() => soundManager.play('click')}>
                    <span className="dadu-icon">🎲</span>
                    <span className="dadu-label">PUTAR DADU</span>
                  </button>

                  {/* Chat Log Button */}
                  <button className="mock-bottom-chat-btn" onClick={() => soundManager.play('click')}>
                    💬
                  </button>
                  
                </div>
              </div>
            </div>

            {/* 4. DAFTAR KARTU AKSI JELAJAH NUSANTARA */}
            <h4 className="icon-group-title" style={{ marginTop: '30px' }}>4. Daftar Kartu Aksi Jelajah Nusantara (Action Cards Gallery)</h4>
            <div className="jelajah-cards-assets-grid">
              {actionCards.map((card, idx) => (
                <div key={idx} className="dev-tcg-card-item">
                  {/* Cost Badge in Top-Right */}
                  <div className="dev-tcg-card-cost">
                    <Heart size={10} fill="#FF4B4B" color="#FF4B4B" />
                    <span>{card.cost}</span>
                  </div>

                  {/* Illustration Area */}
                  <div className="dev-tcg-card-illustration" style={{ background: `linear-gradient(135deg, ${card.color || '#FFF'}, rgba(255,255,255,0.35))` }}>
                    <div className="dev-tcg-card-icon">{card.icon || '🎴'}</div>
                  </div>

                  {/* Card Name Banner */}
                  <div className="dev-tcg-card-name-banner">
                    {card.name}
                  </div>

                  {/* Card Description/Effect Box */}
                  <div className="dev-tcg-card-desc-box">
                    <p className="dev-tcg-card-desc-text">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </section>
        )}

        {/* ================= ADU CENDEKIAWAN GAMEPLAY UI ================= */}
        {(activeTab === 'all' || activeTab === 'cendekiawan') && (
          <section className="viewport-section" style={{ marginTop: '20px' }}>
            <h3 className="section-title-label">UI Elemen Adu Cendekiawan</h3>
            <p className="section-desc-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: '600' }}>
              Galeri komponen antarmuka duel kuis pertarungan tarik tambang / adu kecerdasan.
            </p>

            {/* 1. CLASH HP BARS */}
            <h4 className="icon-group-title">1. Panel Clash HP & Timer (HP Bars & Countdown)</h4>
            <div className="cendekiawan-hud-box">
              <div className="mock-hp-fighting-container">
                {/* Player HP */}
                <div className="mock-hp-bar-side player-side">
                  <div className="mock-hp-label-row">
                    <span className="mock-hp-side-name">Kamu</span>
                    <span className="mock-hp-side-val">10/10 HP</span>
                  </div>
                  <div className="mock-hp-bar-outer">
                    <div className="mock-hp-bar-inner player" style={{ width: '100%' }}></div>
                  </div>
                </div>

                {/* Center Badge / Timer */}
                <div className="mock-clash-vs-badge">
                  <span>15s</span>
                </div>

                {/* Bot HP */}
                <div className="mock-hp-bar-side bot-side">
                  <div className="mock-hp-label-row">
                    <span className="mock-hp-side-val">7/10 HP</span>
                    <span className="mock-hp-side-name">Lawan</span>
                  </div>
                  <div className="mock-hp-bar-outer">
                    <div className="mock-hp-bar-inner bot" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ACTION MODE SELECTOR */}
            <h4 className="icon-group-title" style={{ marginTop: '30px' }}>2. Pemilih Mode Aksi Duel (Action Mode Selector)</h4>
            <div className="cendekiawan-hud-box">
              <div className="mock-action-mode-selector">
                <button className="mock-action-mode-btn attack active" onClick={() => soundManager.play('click')}>
                  ⚔️ SERANG
                </button>
                <button className="mock-action-mode-btn heal" onClick={() => soundManager.play('click')}>
                  💚 PULIHKAN
                </button>
              </div>
            </div>

            {/* 3. MULTIPLE CHOICE QUESTION BOX */}
            <h4 className="icon-group-title" style={{ marginTop: '30px' }}>3. Panel Pertanyaan & Pilihan Jawaban (Quiz & Options)</h4>
            <div className="cendekiawan-hud-box">
              <div className="mock-quiz-panel">
                {/* Timer Bar */}
                <div className="mock-timer-wrapper">
                  <div className="mock-timer-bar pts-3-bar" style={{ width: '75%' }}></div>
                </div>
                
                {/* Points multiplier legend */}
                <div className="mock-timer-points-legend">
                  <span className="legend-segment pts-1">1+</span>
                  <span className="legend-segment pts-2">2+</span>
                  <span className="legend-segment pts-3 active">3+</span>
                </div>

                {/* Question */}
                <div className="mock-question-box">
                  <h2>Siapakah tokoh yang membacakan teks Proklamasi Kemerdekaan Indonesia?</h2>
                  <div className="mock-active-item-badge">
                    Kartu Aktif: 🧭 Kompas
                  </div>
                </div>

                {/* Answers */}
                <div className="mock-options-grid">
                  <button className="mock-opt-btn selected" onClick={() => soundManager.play('click')}>
                    Ir. Soekarno
                  </button>
                  <button className="mock-opt-btn" onClick={() => soundManager.play('click')}>
                    Drs. Mohammad Hatta
                  </button>
                  <button className="mock-opt-btn" onClick={() => soundManager.play('click')}>
                    Sutan Sjahrir
                  </button>
                  <button className="mock-opt-btn" onClick={() => soundManager.play('click')}>
                    Sayuti Melik
                  </button>
                </div>
              </div>
            </div>

            {/* 4. BOOSTER CARD ITEMS */}
            <h4 className="icon-group-title" style={{ marginTop: '30px' }}>4. Kartu Bantuan / Booster (Battle Booster Cards)</h4>
            <div className="mock-booster-cards-row">
              {[
                { label: 'Kompas', icon: '🧭', desc: 'Eliminasi 2 pilihan salah' },
                { label: 'Pemberat', icon: '⚓', desc: 'Dua kali lipat kekuatan tarik' },
                { label: 'Tameng', icon: '🛡️', desc: 'Blokir serangan musuh' },
                { label: 'Jam Pasir', icon: '⏳', desc: 'Tambah durasi waktu menjawab' },
                { label: 'Magnet', icon: '🧲', desc: 'Kacaukan konsentrasi lawan' }
              ].map((card, idx) => (
                <div key={idx} className="mock-booster-item-card" onClick={() => soundManager.play('click')}>
                  <div className="booster-item-icon">{card.icon}</div>
                  <div className="booster-item-label">{card.label}</div>
                  <div className="booster-item-desc">{card.desc}</div>
                </div>
              ))}
            </div>

          </section>
        )}

        {/* ================= DEVELOPER SANDBOX ================= */}
        {(activeTab === 'all' || activeTab === 'sandbox') && (
          <section className="viewport-section" style={{ marginTop: '20px' }}>
            <h3 className="section-title-label">Simulator State Pengembang</h3>
            <div className="sandbox-panel-card">
              <div className="sandbox-stats-grid">
                <div className="sandbox-stat-box">
                  <span className="s-stat-label">Nama Pengguna</span>
                  <input 
                    type="text" 
                    value={userName} 
                    onChange={e => setUserName(e.target.value)} 
                    className="sandbox-text-input" 
                  />
                </div>
                <div className="sandbox-stat-box">
                  <span className="s-stat-label">Bintang (Crowns)</span>
                  <div className="s-stat-value-row">
                    <Star size={20} fill="#FFD700" color="#FFD700" />
                    <span className="s-stat-val-txt">{stars}</span>
                  </div>
                  <div className="s-stat-btn-row">
                    <button className="s-action-btn" onClick={() => { soundManager.play('success'); addStars(100); }}>+100</button>
                    <button className="s-action-btn" onClick={() => { soundManager.play('click'); addStars(-100); }}>-100</button>
                  </div>
                </div>
                <div className="sandbox-stat-box">
                  <span className="s-stat-label">Nyawa (Hearts)</span>
                  <div className="s-stat-value-row">
                    <Heart size={20} fill="#FF4B4B" color="#FF4B4B" />
                    <span className="s-stat-val-txt">{hearts} / 5</span>
                  </div>
                  <div className="s-stat-btn-row">
                    <button className="s-action-btn" onClick={() => { soundManager.play('click'); addHearts(1); }}>+1</button>
                    <button className="s-action-btn" onClick={() => { soundManager.play('click'); addHearts(-1); }}>-1</button>
                    <button className="s-action-btn" onClick={() => { soundManager.play('success'); resetHearts(); }}>Reset</button>
                  </div>
                </div>
                <div className="sandbox-stat-box">
                  <span className="s-stat-label">Streak Hari (Obor)</span>
                  <div className="s-stat-value-row">
                    <Flame size={20} fill="#EF4444" color="#EF4444" />
                    <span className="s-stat-val-txt">{streak} Hari</span>
                  </div>
                  <div className="s-stat-btn-row">
                    <button className="s-action-btn" onClick={() => { soundManager.play('click'); setStreak(streak + 1); }}>+1 Hari</button>
                    <button className="s-action-btn" onClick={() => { soundManager.play('click'); setStreak(Math.max(0, streak - 1)); }}>-1 Hari</button>
                  </div>
                </div>
              </div>

              <div className="sandbox-global-actions">
                <h4>Aksi Global Jalur Petualangan</h4>
                <div className="s-global-btn-group">
                  <button 
                    className="chunky-btn primary-green"
                    onClick={() => { soundManager.play('success'); unlockAllChapters(); alert('Semua materi dan bab telah berhasil dibuka!'); }}
                  >
                    <span className="btn-face">Buka Semua Bab & Materi</span>
                  </button>
                  <button 
                    className="chunky-btn primary-red"
                    onClick={() => { soundManager.play('error'); resetProgress(); alert('Progress belajar Anda telah di-reset ke awal.'); }}
                  >
                    <span className="btn-face">Reset Progress Belajar</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= SCREEN VIEWS REGISTRY ================= */}
        {(activeTab === 'all' || activeTab === 'views') && (
          <section className="viewport-section" style={{ marginTop: '20px' }}>
            <h3 className="section-title-label">Alur Layar & Peta Navigasi</h3>
            <div className="views-registry-list">
              {[
                { key: 'dashboard', label: 'Dashboard', desc: 'Layar beranda utama yang menampilkan pengumuman kelas, ranking, dan menu ringkasan status.' },
                { key: 'story', label: 'Jelajah Sejarah', desc: 'Daftar era sejarah di mana siswa memilih subjek belajar berdasarkan tingkat kelas (Grade 5/6).' },
                { key: 'path', label: 'Jalur Lintasan', desc: 'Peta petualangan 3D linimasa sejarah yang berisi node materi, kuis, dan hadiah peti.' },
                { key: 'quiz', label: 'Arena Latihan', desc: 'Layar kuis interaktif evaluasi bab dengan visualisasi kompetisi tarik tambang.' },
                { key: 'shop', label: 'Toko Penjelajah', desc: 'Tempat menukarkan poin bintang dengan aksesori kostum avatar, nyawa, atau tiket gacha.' },
                { key: 'profile', label: 'Profil Siswa', desc: 'Rangkuman statistik performa, kustomisasi lemari avatar, dan koleksi pencapaian lencana.' },
                { key: 'settings', label: 'Pengaturan', desc: 'Setelan kontrol audio volume, ganti nama profil, dan pintu masuk ke Developer Mode.' },
                { key: 'dev-assets', label: 'Aset Lab', desc: 'Dashboard debug tempat Anda meninjau seluruh warna, suara, gambar, tombol, dan pop-up saat ini.' }
              ].map((view, idx) => (
                <div key={idx} className="view-registry-card">
                  <div className="v-card-header">
                    <span className="v-key-badge">{view.key}</span>
                    <h4>{view.label}</h4>
                  </div>
                  <p>{view.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= SHOP CATALOG DATA ================= */}
        {(activeTab === 'all' || activeTab === 'shopData') && (
          <section className="viewport-section" style={{ marginTop: '20px' }}>
            <h3 className="section-title-label">Katalog Toko & Aksesori</h3>
            
            <h4 className="icon-group-title">Daftar Pakaian & Topi (Avatar Cosmetics)</h4>
            <div className="shop-data-grid">
              {SHOP_CATALOG.cosmetics.map((item, idx) => (
                <div key={idx} className={`shop-data-card ${item.rarity || 'common'}`}>
                  <div className="s-item-badge-row">
                    <span className="s-item-rarity">{item.rarity || 'common'}</span>
                    <span className="s-item-price">{item.price} ⭐</span>
                  </div>
                  <div className="s-item-visual">
                    <span className="s-item-emoji">{item.icon}</span>
                  </div>
                  <h4>{item.name}</h4>
                  <span className="s-item-category">Kategori: {item.category}</span>
                </div>
              ))}
            </div>

            <h4 className="icon-group-title" style={{ marginTop: '30px' }}>Daftar Hadiah Peti Gacha (Gacha Pool)</h4>
            <div className="gacha-pool-list">
              {SHOP_CATALOG.gachaPool.map((item, idx) => (
                <div key={idx} className="gacha-pool-row">
                  <div className="g-pool-left">
                    <span className="g-pool-emoji">{item.icon || '🎁'}</span>
                    <span className="g-pool-name">{item.name}</span>
                  </div>
                  <div className="g-pool-right">
                    <span className="g-pool-desc">Kategori: {item.category}</span>
                    <span className="g-pool-rarity-badge">{item.rarity || 'common'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= UJI COBA AR (AR SANDBOX) ================= */}
        {activeTab === 'arSandbox' && (
          <section className="viewport-section" style={{ marginTop: '20px' }}>
            <h3 className="section-title-label">Uji Coba AR & Kamera (AR Sandbox)</h3>
            <p className="section-desc-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: '600' }}>
              Simulator kamera deteksi kartu AR Lini Masa. Aktifkan kamera lokal Anda untuk mensimulasikan proses pemindaian kartu dan penampilan objek 3D melayang di atas kartu target.
            </p>

            <div className="ar-sandbox-layout">
              {/* Left Panel: Camera View */}
              <div className="ar-camera-panel">
                <div className="ar-viewport-box">
                  {cameraStream ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="ar-video-feed"
                    />
                  ) : (
                    <div className="ar-camera-placeholder">
                      <Camera size={48} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                      <span>Kamera Pengembang Belum Aktif</span>
                    </div>
                  )}

                  {/* Scanning Laser Line Overlay */}
                  {cameraStream && !isTargetDetected && (
                    <div className="ar-scanning-overlay">
                      <div className="ar-scan-corners" />
                      <div className="ar-scan-line" />
                      <span className="ar-scan-status-text">Mencari Kartu Target Sejarah...</span>
                    </div>
                  )}

                  {/* AR Object Projection (Mock 3D Model) */}
                  {cameraStream && isTargetDetected && (
                    <div className="ar-object-overlay">
                      <div className="ar-3d-model-wrapper">
                        {arTarget === 'cermin' && (
                          <div className="ar-mock-projection-container">
                            <img src={TileSvg} className="ar-mock-model rotating" alt="Cermin/Tile" />
                            <span className="ar-projection-glow-ring" />
                          </div>
                        )}
                        {arTarget === 'karakter' && (
                          <div className="ar-mock-projection-container">
                            <img src={Karakter1Svg} className="ar-mock-model bouncing" alt="Karakter Budi" />
                            <span className="ar-projection-glow-ring" />
                          </div>
                        )}
                        {arTarget === 'podium' && (
                          <div className="ar-mock-projection-container">
                            <img src={PodiumSvg} className="ar-mock-model floating" alt="Podium Juara" />
                            <span className="ar-projection-glow-ring" />
                          </div>
                        )}
                      </div>
                      <div className="ar-detection-toast">
                        🎯 Target Terdeteksi: Kartu {arTarget.toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="ar-controls-bar">
                  {!cameraStream ? (
                    <button className="chunky-btn primary-green" onClick={startCamera}>
                      <span className="btn-face">Aktifkan Kamera</span>
                    </button>
                  ) : (
                    <div className="ar-action-buttons">
                      <button className="chunky-btn primary-red" onClick={stopCamera}>
                        <span className="btn-face">Matikan Kamera</span>
                      </button>
                      <button 
                        className={`chunky-btn ${isTargetDetected ? 'primary-yellow' : 'primary-blue'}`}
                        onClick={() => {
                          soundManager.play('click');
                          setIsTargetDetected(!isTargetDetected);
                        }}
                      >
                        <span className="btn-face" style={isTargetDetected ? { color: '#4b4b4b' } : {}}>
                          {isTargetDetected ? 'Reset Deteksi' : 'Simulasikan Deteksi'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: AR Configurations */}
              <div className="ar-config-panel">
                <div className="ar-card-config-box">
                  <h4>1. Pilih Kartu Target Simulasi</h4>
                  <p className="config-desc">Pilih kartu yang ingin Anda pindai di depan kamera:</p>
                  
                  <div className="ar-target-options">
                    <div 
                      className={`ar-target-card-option ${arTarget === 'cermin' ? 'active' : ''}`}
                      onClick={() => { soundManager.play('click'); setArTarget('cermin'); }}
                    >
                      <div className="target-icon-thumb">🔍</div>
                      <div className="target-info-txt">
                        <strong>Kartu Cermin (Ubin)</strong>
                        <span>Indeks Target: 0</span>
                      </div>
                    </div>
                    <div 
                      className={`ar-target-card-option ${arTarget === 'karakter' ? 'active' : ''}`}
                      onClick={() => { soundManager.play('click'); setArTarget('karakter'); }}
                    >
                      <div className="target-icon-thumb">👦</div>
                      <div className="target-info-txt">
                        <strong>Kartu Karakter Budi</strong>
                        <span>Indeks Target: 1</span>
                      </div>
                    </div>
                    <div 
                      className={`ar-target-card-option ${arTarget === 'podium' ? 'active' : ''}`}
                      onClick={() => { soundManager.play('click'); setArTarget('podium'); }}
                    >
                      <div className="target-icon-thumb">🏆</div>
                      <div className="target-info-txt">
                        <strong>Kartu Podium Juara</strong>
                        <span>Indeks Target: 2</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ar-code-config-box" style={{ marginTop: '20px' }}>
                  <h4>2. Kode Pemasangan MindAR & A-Frame</h4>
                  <p className="config-desc">Salin kode integrasi berikut untuk meletakkannya di layar permainan produksi:</p>
                  <pre className="code-snippet-box">
{`<a-scene mindar-image="imageTargetSrc: /assets/targets.mind;">
  <a-camera active="false" position="0 0 0" look-controls="enabled: false"></a-camera>
  
  <a-entity mindar-image-target="targetIndex: ${arTarget === 'cermin' ? 0 : arTarget === 'karakter' ? 1 : 2}">
    <a-gltf-model 
      src="/assets/models/${arTarget}.glb" 
      position="0 0 0" 
      scale="0.5 0.5 0.5" 
      rotation="0 0 0"
    ></a-gltf-model>
  </a-entity>
</a-scene>`}
                  </pre>
                  <button 
                    className="copy-code-btn"
                    onClick={() => handleCopy(`<a-scene mindar-image="imageTargetSrc: /assets/targets.mind;">\n  <a-camera active="false" position="0 0 0" look-controls="enabled: false"></a-camera>\n  \n  <a-entity mindar-image-target="targetIndex: ${arTarget === 'cermin' ? 0 : arTarget === 'karakter' ? 1 : 2}">\n    <a-gltf-model \n      src="/assets/models/${arTarget}.glb" \n      position="0 0 0" \n      scale="0.5 0.5 0.5" \n      rotation="0 0 0"\n    ></a-gltf-model>\n  </a-entity>\n</a-scene>`, 'ar-code')}
                  >
                    {copiedId === 'ar-code' ? 'Kode Berhasil Disalin!' : 'Salin Kode Konfigurasi'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Lightbox / Gambar Full Size Preview */}
      {previewImage && (
        <div className="assets-lightbox" onClick={() => setPreviewImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <div className="lightbox-header">
              <h3>{previewImage.name}</h3>
              <button onClick={() => setPreviewImage(null)}>✕</button>
            </div>
            <div className="lightbox-img-box">
              <img src={previewImage.path} alt={previewImage.name} />
            </div>
            <div className="lightbox-footer">
              <span>Tipe: {previewImage.format}</span>
              <span>Kategori: {previewImage.category}</span>
              <button 
                className="lightbox-copy-btn" 
                onClick={() => handleCopy(`import MyImage from '${previewImage.path}';`, 'lightbox-path')}
              >
                {copiedId === 'lightbox-path' ? <Check size={14} /> : <Clipboard size={14} />}
                <span>{copiedId === 'lightbox-path' ? 'Tersalin' : 'Salin Import Path'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Lightbox / Test Overlay for Popups */}
      {activePopup && (
        <div className="assets-lightbox-overlay" onClick={() => setActivePopup(null)}>
          <div 
            className="assets-lightbox-modal" 
            style={{ 
              maxWidth: (activePopup === 'student_detail' || activePopup === 'victory') ? '750px' : '450px',
              width: (activePopup === 'student_detail' || activePopup === 'victory') ? '95%' : '90%'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close-x" onClick={() => setActivePopup(null)}>✕</button>

            {activePopup === 'reward' && (
              <div className="custom-popup-reward">
                <div className="reward-icon-huge">🎁</div>
                <h2 className="reward-title">Harta Karun Terbuka!</h2>
                <p className="reward-desc">Kamu telah menyelesaikan seluruh rintangan dan menemukan harta karun ini.</p>
                <div className="reward-box">
                  <Star size={32} fill="#FFD700" color="#FFD700" />
                  <span className="reward-amount">+500 Bintang</span>
                </div>
                <button 
                  className="chunky-btn primary-yellow" 
                  style={{ width: '100%' }}
                  onClick={() => { soundManager.play('success'); setActivePopup(null); }}
                >
                  <span className="btn-face" style={{ color: '#4b4b4b' }}>KLAIM HADIAH</span>
                </button>
              </div>
            )}

            {activePopup === 'shop' && (
              <div className="custom-popup-shop">
                <h2 className="shop-confirm-title">Beli Barang Ini?</h2>
                <p className="shop-confirm-desc">Apakah kamu yakin ingin menukarkan <strong>150 ⭐</strong> untuk mendapatkan <strong>Pengisi Nyawa</strong>?</p>
                <div className="confirm-actions">
                  <button className="btn-cancel" onClick={() => { soundManager.play('click'); setActivePopup(null); }}>Batal</button>
                  <button className="btn-confirm-buy" onClick={() => { soundManager.play('success'); setActivePopup(null); }}>Ya, Beli!</button>
                </div>
              </div>
            )}

            {activePopup === 'node' && (
              <div className="custom-popup-node">
                <div className="popup-title">Sifat: Merambat Lurus</div>
                <div className="popup-subtitle" style={{ marginBottom: '10px' }}>Materi Pembelajaran</div>
                <button 
                  className="chunky-btn primary-green" 
                  style={{ width: '100%', marginTop: '10px' }}
                  onClick={() => { soundManager.play('click'); setActivePopup(null); }}
                >
                  <span className="btn-face">MULAI PETUALANGAN</span>
                </button>
              </div>
            )}

            {activePopup === 'settings' && (
              <div className="custom-popup-settings">
                <header className="settings-popup-header">
                  {settingsSubView !== 'main' && (
                    <button 
                      className="settings-back-arrow"
                      onClick={() => { soundManager.play('click'); setSettingsSubView('main'); }}
                    >
                      ← Kembali
                    </button>
                  )}
                  <h3 className="settings-popup-title">
                    {settingsSubView === 'main' && 'Pengaturan'}
                    {settingsSubView === 'profile' && 'Profil Saya'}
                    {settingsSubView === 'notifications' && 'Notifikasi & Audio'}
                    {settingsSubView === 'privacy' && 'Privasi & Keamanan'}
                    {settingsSubView === 'about' && 'Tentang Lini Masa'}
                  </h3>
                </header>

                <div className="settings-popup-body">
                  {/* MAIN VIEW */}
                  {settingsSubView === 'main' && (
                    <div className="settings-main-menu-list">
                      <div className="settings-menu-item" onClick={() => { soundManager.play('click'); setSettingsSubView('profile'); }}>
                        <div className="item-left">👤 <span>Profil Saya</span></div>
                        <span className="arrow-right">›</span>
                      </div>
                      <div className="settings-menu-item" onClick={() => { soundManager.play('click'); setSettingsSubView('notifications'); }}>
                        <div className="item-left">🔊 <span>Notifikasi & Audio</span></div>
                        <span className="arrow-right">›</span>
                      </div>
                      <div className="settings-menu-item" onClick={() => { soundManager.play('click'); setSettingsSubView('privacy'); }}>
                        <div className="item-left">🛡️ <span>Privasi & Keamanan</span></div>
                        <span className="arrow-right">›</span>
                      </div>
                      <div className="settings-menu-item" onClick={() => { soundManager.play('click'); setSettingsSubView('about'); }}>
                        <div className="item-left">ℹ️ <span>Tentang Lini Masa</span></div>
                        <span className="arrow-right">›</span>
                      </div>
                    </div>
                  )}

                  {/* PROFILE VIEW */}
                  {settingsSubView === 'profile' && (
                    <div className="settings-form-content">
                      <div className="form-group-item">
                        <label>Nama Pengguna</label>
                        <input 
                          type="text" 
                          value={userName} 
                          onChange={(e) => setUserName(e.target.value)} 
                          className="styled-popup-input"
                        />
                      </div>
                      <div className="form-group-item" style={{ marginTop: '12px' }}>
                        <label>Tingkat Kelas</label>
                        <div className="popup-grade-row">
                          <button 
                            className={`popup-grade-btn ${selectedGrade === 5 ? 'active' : ''}`}
                            onClick={() => setSelectedGrade(5)}
                          >
                            Kelas 5
                          </button>
                          <button 
                            className={`popup-grade-btn ${selectedGrade === 6 ? 'active' : ''}`}
                            onClick={() => setSelectedGrade(6)}
                          >
                            Kelas 6
                          </button>
                        </div>
                      </div>
                      <div className="danger-zone-popup">
                        <button 
                          className="popup-danger-btn"
                          onClick={() => {
                            if (confirm('Apakah Anda yakin ingin me-reset seluruh kemajuan belajar Anda?')) {
                              soundManager.play('error');
                              resetProgress();
                              setActivePopup(null);
                            }
                          }}
                        >
                          Hapus Kemajuan (Reset)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* NOTIFICATIONS VIEW */}
                  {settingsSubView === 'notifications' && (
                    <div className="settings-form-content">
                      <div className="popup-toggle-row">
                        <span className="toggle-txt-label">Efek Suara (SFX)</span>
                        <button 
                          className={`toggle-switch mini-switch ${soundEnabled ? 'active' : ''}`}
                          onClick={() => setSoundEnabled(!soundEnabled)}
                        >
                          <div className="toggle-knob" />
                        </button>
                      </div>
                      <div className="form-group-item" style={{ opacity: soundEnabled ? 1 : 0.5, marginTop: '12px' }}>
                        <label>Volume SFX ({Math.round(sfxVolume * 100)}%)</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1" 
                          value={sfxVolume}
                          disabled={!soundEnabled}
                          onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                          className="popup-slider"
                        />
                      </div>
                      <div className="form-group-item" style={{ opacity: soundEnabled ? 1 : 0.5, marginTop: '12px' }}>
                        <label>Volume Musik ({Math.round(musicVolume * 100)}%)</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1" 
                          value={musicVolume}
                          disabled={!soundEnabled}
                          onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                          className="popup-slider"
                        />
                      </div>
                    </div>
                  )}

                  {/* PRIVACY VIEW */}
                  {settingsSubView === 'privacy' && (
                    <div className="settings-text-content">
                      <p><strong>Penyimpanan Lokal:</strong> Data Anda disimpan secara lokal di perangkat Anda (localStorage).</p>
                      <p><strong>Tanpa Server Luar:</strong> Lini Masa tidak mengirimkan data belajar Anda ke pihak luar, demi privasi siswa yang aman.</p>
                    </div>
                  )}

                  {/* ABOUT VIEW */}
                  {settingsSubView === 'about' && (
                    <div className="settings-about-content">
                      <span style={{ fontSize: '2.5rem' }}>⏳</span>
                      <h4>Lini Masa v1.0.4</h4>
                      <p>Aplikasi sejarah interaktif SD Kelas 5 & 6.</p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px' }}>Google DeepMind AAC & Laxus</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePopup === 'victory' && (
              <div className="custom-popup-victory" style={{ width: '100%' }}>
                <div className="victory-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div className="trophy-badge" style={{ display: 'inline-flex', background: '#FEF3C7', padding: '16px', borderRadius: '50%', marginBottom: '12px', border: '3px solid #F59E0B' }}>
                    <Trophy size={48} color="#F59E0B" />
                  </div>
                  <h2 className="victory-title" style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--text-color)', margin: '0 0 4px 0' }}>HASIL AKHIR</h2>
                  <p className="victory-subtitle" style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    🏆 <strong>Budi (Kamu)</strong> memenangkan petualangan!
                  </p>
                </div>

                {/* Simulated Podiums */}
                <div className="mock-podiums" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', margin: '30px 0', borderBottom: '3px solid var(--border-color)', paddingBottom: '10px' }}>
                  {/* Rank 2 */}
                  <div className="mock-podium-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🐱</div>
                    <div style={{ fontWeight: '800', fontSize: '0.85rem' }}>Santi</div>
                    <div style={{ height: '60px', width: '100%', background: '#E5E7EB', border: '2px solid #9CA3AF', borderBottom: 'none', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: '900', color: '#9CA3AF', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>2</div>
                  </div>
                  {/* Rank 1 */}
                  <div className="mock-podium-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🐰👑</div>
                    <div style={{ fontWeight: '900', fontSize: '0.95rem', color: '#D97706' }}>Budi</div>
                    <div style={{ height: '90px', width: '100%', background: '#FEF3C7', border: '2px solid #F59E0B', borderBottom: 'none', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: '900', color: '#F59E0B', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>1</div>
                  </div>
                  {/* Rank 3 */}
                  <div className="mock-podium-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🦊</div>
                    <div style={{ fontWeight: '800', fontSize: '0.85rem' }}>Bimo</div>
                    <div style={{ height: '45px', width: '100%', background: '#FEE2E2', border: '2px solid #F87171', borderBottom: 'none', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: '900', color: '#F87171', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>3</div>
                  </div>
                </div>

                {/* Score list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: '16px' }}>
                    <span style={{ fontWeight: '800' }}>🥇 Budi (Kamu)</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ background: '#DCFCE7', padding: '2px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>📦 3 Peti</span>
                      <span style={{ background: '#FEF9C3', padding: '2px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>🪙 250</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--background-color)', border: '2px solid var(--border-color)', borderRadius: '16px' }}>
                    <span style={{ fontWeight: '700' }}>🥈 Santi</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ background: '#F3F4F6', padding: '2px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>📦 2 Peti</span>
                      <span style={{ background: '#FEF9C3', padding: '2px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>🪙 180</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--background-color)', border: '2px solid var(--border-color)', borderRadius: '16px' }}>
                    <span style={{ fontWeight: '700' }}>🥉 Bimo</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ background: '#F3F4F6', padding: '2px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>📦 1 Peti</span>
                      <span style={{ background: '#FEF9C3', padding: '2px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>🪙 120</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="chunky-btn primary-blue" style={{ flex: 1 }} onClick={() => setActivePopup(null)}>
                    <span className="btn-face">KEMBALI KE MENU</span>
                  </button>
                  <button className="chunky-btn primary-green" style={{ flex: 1 }} onClick={() => { soundManager.play('success'); setActivePopup(null); }}>
                    <span className="btn-face">MAIN LAGI</span>
                  </button>
                </div>
              </div>
            )}

            {activePopup === 'jelajah_help' && (
              <div className="custom-popup-help" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <HelpCircle size={24} color="#1CB0F6" />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 950 }}>Panduan Bermain</h3>
                </div>

                <div style={{ minHeight: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
                  {helpPage === 0 && (
                    <>
                      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏰📦</div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 900 }}>Cara Menang!</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', fontWeight: '600' }}>
                        Tujuan utamamu adalah mengumpulkan Koin Emas di lintasan dan membawanya pulang untuk mengisi <strong>3 Peti Harta Karun</strong> di <strong>Markasmu</strong>!
                      </p>
                    </>
                  )}
                  {helpPage === 1 && (
                    <>
                      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎲🚶</div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 900 }}>Putar Dadu & Jalan</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', fontWeight: '600' }}>
                        Putar dadu pada giliranmu, lalu jalankan pion karaktermu menyusuri ubin papan permainan sesuai angka yang diperoleh.
                      </p>
                    </>
                  )}
                  {helpPage === 2 && (
                    <>
                      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚔️📜</div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 900 }}>Ubin Kuis & Penjaga</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', fontWeight: '600' }}>
                        Mendarat di ubin kuis akan memicu pertanyaan sejarah. Jawab benar untuk koin, atau hadapi pertarungan sengit saat mendarat di ubin Penjaga Pos!
                      </p>
                    </>
                  )}
                </div>

                {/* Pagination Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', borderTop: '2px solid var(--border-color)', paddingTop: '15px' }}>
                  <button 
                    className="chunky-btn primary-blue" 
                    style={{ visibility: helpPage > 0 ? 'visible' : 'hidden', padding: '6px 12px' }}
                    onClick={() => { soundManager.play('click'); setHelpPage(p => p - 1); }}
                  >
                    <span className="btn-face">Sebelumnya</span>
                  </button>
                  
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[0, 1, 2].map(idx => (
                      <div 
                        key={idx} 
                        style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          background: helpPage === idx ? '#1CB0F6' : 'var(--border-color)',
                          transition: 'all 0.2s' 
                        }} 
                      />
                    ))}
                  </div>

                  <button 
                    className="chunky-btn primary-green" 
                    style={{ padding: '6px 12px' }}
                    onClick={() => {
                      soundManager.play('click');
                      if (helpPage < 2) {
                        setHelpPage(p => p + 1);
                      } else {
                        setActivePopup(null);
                      }
                    }}
                  >
                    <span className="btn-face">{helpPage === 2 ? 'SELESAI' : 'Selanjutnya'}</span>
                  </button>
                </div>
              </div>
            )}

            {activePopup === 'recovery' && (
              <div className="custom-popup-recovery" style={{ width: '100%', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.6rem', color: '#EF4444', fontWeight: 950, margin: '0 0 10px 0', letterSpacing: '1px' }}>TUMBANG!</h2>
                
                <div style={{ fontSize: '3rem', margin: '20px 0' }}>
                  🐰💤
                </div>

                <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-color)', marginBottom: '15px' }}>
                  Karaktermu pingsan karena kehabisan Tekad!
                </p>

                <div style={{ background: '#FEF2F2', border: '2px dashed #FCA5A5', borderRadius: '16px', padding: '12px', marginBottom: '20px', fontSize: '0.85rem', color: '#991B1B', fontWeight: '600' }}>
                  🎲 Dapatkan angka <strong>5 atau 6</strong> pada dadu pemulihan untuk segera bangkit berdiri!
                </div>

                <button 
                  className="chunky-btn primary-red" 
                  style={{ width: '100%' }}
                  onClick={() => {
                    soundManager.play('dice_roll');
                    const rollVal = Math.floor(Math.random() * 6) + 1;
                    alert(`Hasil Dadu Pemulihan: ${rollVal}. ` + (rollVal >= 5 ? 'Selamat! Karakter Bangkit!' : 'Gagal Bangkit, Coba lagi giliran berikutnya.'));
                    setActivePopup(null);
                  }}
                >
                  <span className="btn-face">PUTAR DADU PEMULIHAN</span>
                </button>
              </div>
            )}

            {activePopup === 'add_student' && (
              <div className="custom-popup-add-student" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Users size={24} color="#10B981" />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 950 }}>Tambah Murid</h3>
                </div>

                {/* Tab buttons */}
                <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-color)', marginBottom: '20px', paddingBottom: '10px' }}>
                  <button 
                    onClick={() => { soundManager.play('click'); setAddStudentTab('manual'); }}
                    style={{ flex: 1, padding: '8px 12px', background: addStudentTab === 'manual' ? '#10B981' : 'transparent', color: addStudentTab === 'manual' ? 'white' : 'var(--text-color)', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Input Manual
                  </button>
                  <button 
                    onClick={() => { soundManager.play('click'); setAddStudentTab('invite'); }}
                    style={{ flex: 1, padding: '8px 12px', background: addStudentTab === 'invite' ? '#3B82F6' : 'transparent', color: addStudentTab === 'invite' ? 'white' : 'var(--text-color)', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Undang via Kode
                  </button>
                </div>

                {addStudentTab === 'manual' ? (
                  <form onSubmit={(e) => { e.preventDefault(); soundManager.play('success'); alert(`Sukses menambahkan murid ${addStudentName} (NIS: ${addStudentNis})`); setActivePopup(null); }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-color)' }}>Nama Lengkap Murid</label>
                      <input 
                        type="text" 
                        value={addStudentName} 
                        onChange={(e) => setAddStudentName(e.target.value)} 
                        placeholder="Cth: Budi Santoso"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '2.2px solid var(--border-color)', outline: 'none', fontWeight: '700', background: 'var(--card-bg)', color: 'var(--text-color)' }}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-color)' }}>NIS / NISN</label>
                      <input 
                        type="text" 
                        value={addStudentNis} 
                        onChange={(e) => setAddStudentNis(e.target.value)} 
                        placeholder="Cth: 10293847"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '2.2px solid var(--border-color)', outline: 'none', fontWeight: '700', background: 'var(--card-bg)', color: 'var(--text-color)' }}
                        required
                      />
                    </div>
                    <div style={{ padding: '10px', background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '8px', fontSize: '0.75rem', color: '#92400E', lineHeight: '1.4', textAlign: 'left' }}>
                      <strong>Catatan:</strong> Murid ini akan dibuatkan akun otomatis. Kata sandi bawaan (default) adalah: <strong>123456</strong>
                    </div>
                    <button type="submit" className="chunky-btn primary-green" style={{ width: '100%', marginTop: '10px' }}>
                      <span className="btn-face">TAMBAHKAN MURID</span>
                    </button>
                  </form>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px', textAlign: 'left' }}>
                      Bagikan kode berikut ke siswa agar mereka bisa bergabung dengan kelas secara mandiri:
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', background: 'var(--background-color)', border: '2px solid var(--border-color)', borderRadius: '16px', marginBottom: '20px' }}>
                      <code style={{ fontSize: '1.25rem', fontWeight: '900', color: '#3B82F6', letterSpacing: '1px' }}>LMS-5A-DEV</code>
                      <button 
                        onClick={() => {
                          soundManager.play('success');
                          setCopiedInvite(true);
                          setTimeout(() => setCopiedInvite(false), 2000);
                        }}
                        style={{ marginLeft: 'auto', background: '#3B82F6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        {copiedInvite ? 'Tersalin!' : 'Salin'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activePopup === 'student_detail' && (
              <div className="custom-popup-student-detail" style={{ width: '100%', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '2px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem' }}>
                    {(studentDetailName || '').split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input 
                      type="text"
                      value={studentDetailName}
                      onChange={(e) => setStudentDetailName(e.target.value)}
                      style={{ fontSize: '1.25rem', fontWeight: '950', border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-color)' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>NIS:</span>
                      <input 
                        type="text"
                        value={studentDetailNis}
                        onChange={(e) => setStudentDetailNis(e.target.value)}
                        style={{ fontSize: '0.75rem', border: 'none', background: 'transparent', outline: 'none', width: '120px', color: 'var(--text-muted)', fontWeight: '800' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxHeight: '350px', overflowY: 'auto', paddingRight: '6px' }}>
                  {/* Left Column: Stats & Absensi */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', fontWeight: '900', color: 'var(--text-color)', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '4px' }}>Statistik Aktivitas</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--background-color)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Akurasi Jawaban</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#10B981' }}>85%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--background-color)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Kuis Selesai</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#3B82F6' }}>24 / 30</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--background-color)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Kehadiran</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#10B981' }}>100% (5/5 Hadir)</span>
                      </div>
                    </div>

                    <h4 style={{ margin: '10px 0 5px 0', fontSize: '0.95rem', fontWeight: '900', color: 'var(--text-color)', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '4px' }}>Kehadiran Mingguan</h4>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['M1', 'M2', 'M3', 'M4', 'M5'].map(m => (
                        <div key={m} style={{ flex: 1, textAlign: 'center', background: '#DCFCE7', color: '#15803D', padding: '6px 4px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900', border: '1px solid #86EFAC' }}>
                          {m}
                          <div style={{ fontSize: '0.55rem', marginTop: '2px', opacity: 0.8 }}>Hadir</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Academic Records */}
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', fontWeight: '900', color: 'var(--text-color)', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '4px' }}>Daftar Nilai Kuis (Rapor)</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--background-color)', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>Sejarah: Kerajaan Kutai</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Selesai: 14/07/2026</span>
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#10B981' }}>90</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--background-color)', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>Sejarah: Kerajaan Tarumanegara</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Selesai: 12/07/2026</span>
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#10B981' }}>85</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--background-color)', borderRadius: '8px', borderLeft: '4px solid #F59E0B' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>Sifat Cahaya: Pembiasan</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Selesai: 10/07/2026</span>
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#F59E0B' }}>70</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '2px solid var(--border-color)', paddingTop: '15px' }}>
                  <button className="chunky-btn primary-red" style={{ padding: '8px 16px' }} onClick={() => { if (confirm('Reset kemajuan murid?')) { soundManager.play('error'); setActivePopup(null); } }}>
                    <span className="btn-face">Reset Progress</span>
                  </button>
                  <button className="chunky-btn primary-green" style={{ padding: '8px 16px' }} onClick={() => { soundManager.play('success'); alert(`Sukses menyimpan data ${studentDetailName}`); setActivePopup(null); }}>
                    <span className="btn-face">Simpan & Tutup</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        /* Overrides to make fixed modals render inline inside the preview cards */
        .inline-popup-container .settings-overlay,
        .inline-popup-container .help-modal-overlay,
        .inline-popup-container .inventory-window-overlay,
        .inline-popup-container .event-sheet-overlay,
        .inline-popup-container .modal-overlay {
          position: relative !important;
          inset: auto !important;
          width: 100% !important;
          height: auto !important;
          min-height: auto !important;
          background: none !important;
          backdrop-filter: none !important;
          z-index: 1 !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          animation: none !important;
          box-shadow: none !important;
        }

        .inline-popup-container .settings-card,
        .inline-popup-container .help-modal-card,
        .inline-popup-container .inventory-window,
        .inline-popup-container .event-sheet-container,
        .inline-popup-container .modal-content,
        .inline-popup-container .student-detail-modal {
          position: relative !important;
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          max-height: none !important;
          margin: 0 !important;
          box-shadow: none !important;
          border-radius: 20px !important;
          border: 2px solid var(--border-color) !important;
          transform: none !important;
          animation: none !important;
          padding: 20px !important;
        }

        .inline-popup-container .turn-overlay {
          position: relative !important;
          top: auto !important;
          left: auto !important;
          z-index: 1 !important;
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          animation: none !important;
        }

        .inline-popup-container .turn-card {
          animation: none !important;
          box-shadow: none !important;
        }

        .dev-assets-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--background-color);
          color: var(--text-color);
          font-family: var(--font-main);
          min-height: 100vh;
          overflow-y: auto;
          padding-bottom: 50px;
        }

        .assets-header {
          display: flex;
          align-items: center;
          padding: 20px;
          border-bottom: 1.5px solid var(--border-color);
          background: var(--card-bg);
        }

        .back-btn {
          background: var(--background-color);
          border: 2px solid var(--border-color);
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.85rem;
          transition: all 0.15s;
        }
        .back-btn:hover { background: var(--border-color); }

        .header-title-box {
          margin-left: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-title-box h2 {
          margin: 0;
          font-weight: 900;
          font-size: 1.4rem;
          color: var(--text-color);
        }

        .dev-badge {
          background: var(--secondary-color);
          color: white;
          padding: 3px 10px;
          border-radius: 50px;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .filter-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: var(--background-color);
          border-bottom: 1.5px solid var(--border-color);
          flex-wrap: wrap;
          gap: 15px;
        }

        .tabs-wrapper {
          display: flex;
          gap: 8px;
          overflow-x: auto;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 14px;
          border: 2px solid var(--border-color);
          background: var(--card-bg);
          color: var(--text-muted);
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .tab-btn:hover {
          background: var(--border-color);
          color: var(--text-color);
        }

        .tab-btn.active {
          background: var(--secondary-color);
          border-color: var(--secondary-color);
          color: white;
          box-shadow: 0 4px 12px rgba(28, 176, 246, 0.25);
        }

        .search-bar-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--card-bg);
          padding: 8px 14px;
          border-radius: 12px;
          border: 2.2px solid var(--border-color);
          min-width: 250px;
          color: var(--text-muted);
        }

        .search-bar-box input {
          background: none;
          border: none;
          color: var(--text-color);
          outline: none;
          font-weight: 600;
          font-size: 0.85rem;
          width: 100%;
        }

        .assets-viewport {
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .section-title-label {
          font-size: 1.2rem;
          font-weight: 900;
          margin: 0 0 20px 0;
          color: var(--text-color);
          border-left: 4px solid var(--secondary-color);
          padding-left: 10px;
        }

        /* Sprite Grid Styles */
        .sprites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }

        .sprite-card {
          background: var(--card-bg);
          border-radius: 20px;
          overflow: hidden;
          border: 2.2px solid var(--border-color);
          cursor: pointer;
          transition: all 0.2s;
        }

        .sprite-card:hover {
          transform: translateY(-4px);
          border-color: var(--secondary-color);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }

        .sprite-preview-container {
          height: 140px;
          background: var(--background-color);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px;
          position: relative;
          background-image: radial-gradient(var(--border-color) 15%, transparent 15%);
          background-size: 16px 16px;
        }

        .sprite-thumb {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }

        .sprite-meta {
          padding: 12px 14px;
        }

        .sprite-meta h4 {
          margin: 0 0 8px 0;
          font-weight: 800;
          font-size: 0.85rem;
          color: var(--text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meta-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .format-badge {
          background: var(--border-color);
          color: var(--text-muted);
          font-size: 0.6rem;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .category-text {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--secondary-color);
        }

        /* Audio Row Styles */
        .audio-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .audio-row {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 2.2px solid var(--border-color);
          gap: 20px;
          flex-wrap: wrap;
        }

        .audio-info h4 {
          margin: 0 0 4px 0;
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--text-color);
        }

        .audio-player-control {
          display: flex;
          align-items: center;
        }

        .html-audio-player {
          height: 36px;
          outline: none;
          max-width: 250px;
        }

        /* Icons clean grid */
        .icon-group-title {
          font-size: 0.95rem;
          font-weight: 900;
          margin: 20px 0 12px 0;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .icons-grid-clean {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
          gap: 12px;
        }

        .icon-box-clean {
          width: 64px;
          height: 64px;
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
          transition: all 0.2s;
        }
        .icon-box-clean:hover {
          background: var(--border-color);
          transform: scale(1.05);
        }

        /* Font Specimen Styles */
        .font-specimen-card {
          background: var(--card-bg);
          border-radius: 20px;
          padding: 25px;
          border: 2.2px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .font-meta-group h3 {
          margin: 0 0 6px 0;
          font-weight: 900;
          font-size: 1.25rem;
          color: var(--text-color);
        }

        .font-meta-group p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .custom-input-tester {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .custom-input-tester label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .custom-input-tester input {
          background: var(--background-color);
          border: 2.2px solid var(--border-color);
          color: var(--text-color);
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          outline: none;
        }

        .custom-input-tester input:focus {
          border-color: var(--secondary-color);
        }

        .specimen-renders {
          display: flex;
          flex-direction: column;
          gap: 20px;
          border-top: 1.5px dashed var(--border-color);
          padding-top: 20px;
        }

        .render-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .render-label {
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--secondary-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Lightbox CSS */
        .assets-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
          z-index: 5000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .lightbox-content {
          background: var(--card-bg);
          border-radius: 28px;
          border: 2.2px solid var(--border-color);
          width: 90%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        .lightbox-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1.5px solid var(--border-color);
        }

        .lightbox-header h3 {
          margin: 0;
          font-weight: 900;
          font-size: 1.1rem;
          color: var(--text-color);
        }

        .lightbox-header button {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
        }

        .lightbox-img-box {
          height: 350px;
          background: var(--background-color);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          background-image: radial-gradient(var(--border-color) 15%, transparent 15%);
          background-size: 20px 20px;
        }

        .lightbox-img-box img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
        }

        .lightbox-footer {
          padding: 16px 20px;
          border-top: 1.5px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-muted);
        }

        .lightbox-copy-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--secondary-color);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .lightbox-copy-btn:hover {
          background: var(--primary-color-dark);
        }

        /* ================= COLOR PALETTE CSS ================= */
        .colors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        .color-card {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .color-card:hover {
          transform: translateY(-4px);
          border-color: var(--secondary-color);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        .color-preview {
          height: 100px;
          width: 100%;
          border-bottom: 2.2px solid var(--border-color);
        }
        .color-info {
          padding: 16px;
        }
        .color-info h4 {
          margin: 0 0 6px 0;
          font-weight: 950;
          font-size: 0.95rem;
          color: var(--text-color);
        }
        .color-var-code {
          display: block;
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--secondary-color);
          margin-bottom: 4px;
          font-weight: bold;
        }
        .color-hex-code {
          display: block;
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .color-desc {
          margin: 0;
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.4;
          font-weight: 600;
        }
        .copied-tag {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #58CC02;
          color: white;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 4px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* ================= POPUPS TRIGGER CSS ================= */
        .popups-preview-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          padding: 24px;
          border-radius: 20px;
        }
        .popup-trigger-row {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .popup-trigger-row p {
          margin: 0;
          font-size: 0.88rem;
          color: var(--text-muted);
          flex: 1;
          min-width: 250px;
          font-weight: 600;
        }

        /* ================= VERTICAL BUTTONS LIST CSS ================= */
        .vertical-buttons-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 20px;
          padding: 16px;
        }
        .vertical-button-item-row {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-bottom: 12px;
          border-bottom: 1.5px dashed var(--border-color);
        }
        .vertical-button-item-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .btn-preview-column {
          width: 220px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-shrink: 0;
          overflow: visible;
        }
        .btn-info-column {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .btn-info-column h5 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 950;
          color: var(--text-color);
        }
        .btn-info-column p {
          margin: 0;
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1.4;
          font-weight: 600;
        }

        /* Chunky 3D Buttons */
        .chunky-btn {
          position: relative;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          outline: none;
          display: inline-block;
        }
        .chunky-btn .btn-face {
          display: block;
          padding: 10px 22px;
          border-radius: 14px;
          font-weight: 950;
          font-size: 0.85rem;
          color: white;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          transform: translateY(-4px);
          transition: transform 0.1s ease;
          border: 2px solid rgba(255,255,255,0.15);
          text-shadow: 0 1.5px 0 rgba(0,0,0,0.1);
        }
        
        .primary-green .btn-face { background: #58CC02; }
        .primary-green { background: #46A302; border-radius: 14px; box-shadow: 0 4px 0 #46A302; }

        .primary-yellow .btn-face { background: #FFC800; color: #4B4B4B; text-shadow: none; }
        .primary-yellow { background: #E6B000; border-radius: 14px; box-shadow: 0 4px 0 #E6B000; }

        .primary-blue .btn-face { background: #1CB0F6; }
        .primary-blue { background: #1485BA; border-radius: 14px; box-shadow: 0 4px 0 #1485BA; }

        .primary-red .btn-face { background: #FF4B4B; }
        .primary-red { background: #EA2B2B; border-radius: 14px; box-shadow: 0 4px 0 #EA2B2B; }

        .chunky-btn:hover .btn-face {
          filter: brightness(1.05);
        }
        .chunky-btn:active .btn-face {
          transform: translateY(0px);
        }

        /* Outlined Button */
        .outlined-btn {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-bottom-width: 4.5px;
          color: var(--text-color);
          font-weight: 950;
          font-size: 0.85rem;
          padding: 10px 22px;
          border-radius: 14px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          transition: all 0.1s;
        }
        .outlined-btn:hover {
          background: var(--border-color);
        }
        .outlined-btn:active {
          transform: translateY(2px);
          border-bottom-width: 2.2px;
        }

        /* ================= POPUP LIGHTBOX PREVIEWS ================= */
        .assets-lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
          z-index: 6000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(5px);
        }
        .assets-lightbox-modal {
          background: var(--card-bg);
          border-radius: 28px;
          border: 2.2px solid var(--border-color);
          padding: 30px;
          width: 90%;
          max-width: 420px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.25);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .modal-close-x {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.3rem;
          cursor: pointer;
          font-weight: bold;
          z-index: 10;
        }
        .modal-close-x:hover { color: var(--text-color); }
        
        .custom-popup-reward {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .reward-title {
          font-weight: 950;
          font-size: 1.4rem;
          margin: 12px 0 6px 0;
          color: var(--text-color);
        }
        .reward-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin: 0 0 20px 0;
          line-height: 1.5;
          font-weight: 600;
        }
        .reward-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--background-color);
          border: 2.2px solid var(--border-color);
          padding: 10px 20px;
          border-radius: 16px;
          margin-bottom: 25px;
        }
        .reward-amount {
          font-weight: 950;
          font-size: 1.15rem;
          color: #FFD700;
        }
        .reward-icon-huge {
          font-size: 6rem;
          animation: floatReward 2s infinite ease-in-out;
        }
        @keyframes floatReward {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .custom-popup-shop {
          text-align: center;
          padding: 10px 0;
        }
        .shop-confirm-title {
          font-weight: 950;
          font-size: 1.4rem;
          margin: 0 0 10px 0;
          color: var(--text-color);
        }
        .shop-confirm-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 25px;
          line-height: 1.5;
          font-weight: 600;
        }
        .confirm-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        
        .custom-popup-node {
          border-radius: 20px;
          padding: 10px;
          text-align: center;
        }
        .popup-title {
          font-weight: 950;
          font-size: 1.3rem;
          color: var(--text-color);
          margin-bottom: 4px;
        }
        .popup-subtitle {
          font-size: 0.75rem;
          font-weight: 900;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        /* ================= CUSTOM POPUP SETTINGS CSS ================= */
        .custom-popup-settings {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
          width: 100%;
        }
        .settings-popup-header {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 12px;
          margin-bottom: 5px;
          position: relative;
        }
        .settings-back-arrow {
          background: transparent;
          border: none;
          color: var(--secondary-color);
          font-weight: 950;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0;
        }
        .settings-popup-title {
          margin: 0;
          font-weight: 950;
          font-size: 1.15rem;
          color: var(--text-color);
        }
        .settings-popup-body {
          display: flex;
          flex-direction: column;
          min-height: 200px;
        }
        .settings-main-menu-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .settings-menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-radius: 14px;
          border: 2px solid var(--border-color);
          cursor: pointer;
          transition: all 0.2s;
          background: var(--background-color);
        }
        .settings-menu-item:hover {
          transform: translateY(-2px);
          border-color: var(--primary-color);
        }
        .settings-menu-item .item-left {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
          font-size: 0.9rem;
          color: var(--text-color);
        }
        .settings-menu-item .arrow-right {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--text-muted);
        }

        /* Form elements inside settings popup */
        .settings-form-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .form-group-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group-item label {
          font-size: 0.7rem;
          font-weight: 900;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .styled-popup-input {
          background: var(--background-color);
          border: 2px solid var(--border-color);
          border-radius: 10px;
          padding: 8px 12px;
          color: var(--text-color);
          font-weight: 800;
          outline: none;
        }
        .styled-popup-input:focus {
          border-color: var(--secondary-color);
        }
        .popup-grade-row {
          display: flex;
          gap: 10px;
        }
        .popup-grade-btn {
          flex: 1;
          padding: 8px;
          border-radius: 10px;
          border: 2px solid var(--border-color);
          background: var(--background-color);
          color: var(--text-color);
          font-weight: 900;
          cursor: pointer;
          transition: all 0.1s;
        }
        .popup-grade-btn.active {
          border-color: var(--primary-color);
          color: var(--primary-color);
          background: rgba(244, 195, 101, 0.06);
          transform: translateY(1px);
        }
        .danger-zone-popup {
          margin-top: 15px;
          border-top: 1.5px dashed #EF4444;
          padding-top: 15px;
        }
        .popup-danger-btn {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          background: #FFEBEB;
          border: 2px solid #FFC1C1;
          color: #EF4444;
          font-weight: 900;
          cursor: pointer;
        }
        .popup-danger-btn:hover {
          background: #FFDDDD;
        }
        .popup-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 0;
          font-weight: 900;
          font-size: 0.88rem;
          color: var(--text-color);
        }
        .popup-slider {
          width: 100%;
          accent-color: var(--primary-color);
        }
        .settings-text-content p {
          font-size: 0.8rem;
          line-height: 1.5;
          margin: 0 0 10px 0;
          font-weight: 600;
        }
        .settings-about-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          padding: 10px 0;
        }
        .settings-about-content h4 {
          margin: 0;
          font-weight: 950;
          font-size: 1.1rem;
          color: var(--text-color);
        }
        .settings-about-content p {
          margin: 0;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        /* ================= UJI COBA AR (AR SANDBOX) CSS ================= */
        .ar-sandbox-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .ar-sandbox-layout {
            grid-template-columns: 1fr;
          }
        }
        .ar-camera-panel {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 24px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .ar-viewport-box {
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 18px;
          background: #000;
          border: 2px solid var(--border-color);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 8px 16px rgba(0,0,0,0.5);
        }
        .ar-video-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ar-camera-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #9CA3AF;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .ar-controls-bar {
          display: flex;
          justify-content: center;
        }
        .ar-action-buttons {
          display: flex;
          gap: 15px;
          width: 100%;
        }
        .ar-action-buttons button {
          flex: 1;
        }
        
        /* Scanner lines and grids */
        .ar-scanning-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 30px;
        }
        .ar-scan-corners {
          position: absolute;
          inset: 30px;
          border: 3px dashed rgba(255,255,255,0.4);
          border-radius: 12px;
        }
        .ar-scan-line {
          position: absolute;
          width: calc(100% - 60px);
          height: 4px;
          background: linear-gradient(90deg, transparent, #1CB0F6, transparent);
          top: 30px;
          left: 30px;
          animation: scanLaser 2.2s infinite ease-in-out;
          box-shadow: 0 0 10px #1CB0F6;
        }
        @keyframes scanLaser {
          0%, 100% { top: 30px; opacity: 0.3; }
          50% { top: calc(100% - 34px); opacity: 1; }
        }
        .ar-scan-status-text {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.7);
          color: #FFF;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 4px 12px;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.25);
        }

        /* 3D Projection Overlay and Animations */
        .ar-object-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .ar-3d-model-wrapper {
          position: relative;
          z-index: 5;
        }
        .ar-mock-projection-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ar-mock-model {
          width: 120px;
          height: 120px;
          object-fit: contain;
          filter: drop-shadow(0 10px 20px rgba(0,255,255,0.6));
          z-index: 3;
        }
        .ar-mock-model.rotating {
          animation: spin3D 4s infinite linear;
        }
        .ar-mock-model.bouncing {
          animation: bounce3D 1.8s infinite ease-in-out;
        }
        .ar-mock-model.floating {
          animation: float3D 2.5s infinite ease-in-out;
        }
        @keyframes spin3D {
          from { transform: rotate(0deg) scale(1.1); }
          to { transform: rotate(360deg) scale(1.1); }
        }
        @keyframes bounce3D {
          0%, 100% { transform: translateY(0) scale(1.15) rotate(0deg); }
          50% { transform: translateY(-15px) scale(1.05) rotate(8deg); }
        }
        @keyframes float3D {
          0%, 100% { transform: translateY(0) scale(1.1); }
          50% { transform: translateY(-10px) scale(1.15); }
        }
        .ar-projection-glow-ring {
          position: absolute;
          width: 90px;
          height: 35px;
          background: radial-gradient(ellipse, rgba(28, 176, 246, 0.4), transparent 70%);
          border-radius: 50%;
          bottom: -15px;
          z-index: 1;
          animation: ringPulse 1.8s infinite ease-in-out;
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 0.8; }
        }
        .ar-detection-toast {
          position: absolute;
          top: 15px;
          background: #D1FAE5;
          border: 2px solid #10B981;
          color: #065F46;
          font-weight: 950;
          font-size: 0.72rem;
          padding: 6px 16px;
          border-radius: 12px;
          text-shadow: none;
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        /* Config Panel (Right) */
        .ar-config-panel {
          display: flex;
          flex-direction: column;
        }
        .ar-card-config-box, .ar-code-config-box {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 24px;
          padding: 20px;
        }
        .ar-card-config-box h4, .ar-code-config-box h4 {
          margin: 0 0 4px 0;
          font-weight: 950;
          font-size: 1rem;
          color: var(--text-color);
        }
        .config-desc {
          margin: 0 0 15px 0;
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
          line-height: 1.4;
        }
        .ar-target-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ar-target-card-option {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 16px;
          border-radius: 16px;
          border: 2.2px solid var(--border-color);
          cursor: pointer;
          background: var(--background-color);
          transition: all 0.2s;
        }
        .ar-target-card-option:hover {
          transform: translateY(-2px);
          border-color: var(--primary-color);
        }
        .ar-target-card-option.active {
          border-color: var(--primary-color);
          background: rgba(244, 195, 101, 0.05);
          box-shadow: 0 4px 0 var(--primary-color);
        }
        .target-icon-thumb {
          font-size: 1.8rem;
        }
        .target-info-txt {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }
        .target-info-txt strong {
          font-size: 0.85rem;
          font-weight: 900;
          color: var(--text-color);
        }
        .target-info-txt span {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 700;
        }
        .code-snippet-box {
          background: #1E1E2E;
          color: #A9B2C3;
          padding: 14px;
          border-radius: 14px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.72rem;
          text-align: left;
          overflow-x: auto;
          margin-bottom: 12px;
          line-height: 1.4;
          border: 1.5px solid rgba(255,255,255,0.05);
        }
        .copy-code-btn {
          width: 100%;
          background: var(--background-color);
          border: 2px solid var(--border-color);
          color: var(--text-color);
          padding: 10px;
          border-radius: 12px;
          font-weight: 900;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .copy-code-btn:hover {
          background: var(--border-color);
        }

        /* ================= DEVELOPER SANDBOX CSS ================= */
        .sandbox-panel-card {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .sandbox-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .sandbox-stat-box {
          background: var(--background-color);
          border: 2.2px solid var(--border-color);
          border-radius: 18px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .s-stat-label {
          font-size: 0.75rem;
          font-weight: 900;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .sandbox-text-input {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          color: var(--text-color);
          padding: 8px 12px;
          border-radius: 10px;
          font-weight: 800;
          outline: none;
          font-size: 0.9rem;
          width: 100%;
        }
        .sandbox-text-input:focus {
          border-color: var(--secondary-color);
        }
        .s-stat-value-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .s-stat-val-txt {
          font-weight: 950;
          font-size: 1.2rem;
          color: var(--text-color);
        }
        .s-stat-btn-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .s-action-btn {
          flex: 1;
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-bottom-width: 4px;
          color: var(--text-color);
          font-weight: 900;
          font-size: 0.75rem;
          padding: 6px 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.1s;
        }
        .s-action-btn:hover { background: var(--border-color); }
        .s-action-btn:active { transform: translateY(2px); border-bottom-width: 2px; }
        
        .sandbox-global-actions {
          border-top: 1.5px dashed var(--border-color);
          padding-top: 20px;
        }
        .sandbox-global-actions h4 {
          margin: 0 0 14px 0;
          font-weight: 950;
          font-size: 0.95rem;
          color: var(--text-color);
        }
        .s-global-btn-group {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        /* ================= SCREEN VIEWS REGISTRY CSS ================= */
        .views-registry-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }
        .view-registry-card {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .v-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .v-key-badge {
          background: var(--secondary-color);
          color: white;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 6px;
          font-family: monospace;
        }
        .v-card-header h4 {
          margin: 0;
          font-weight: 950;
          font-size: 0.95rem;
          color: var(--text-color);
        }
        .view-registry-card p {
          margin: 0;
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
          font-weight: 600;
        }

        /* ================= SHOP CATALOG DATA CSS ================= */
        .shop-data-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 15px;
        }
        .shop-data-card {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 18px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }
        .s-item-badge-row {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-size: 0.6rem;
          font-weight: 900;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .s-item-rarity {
          background: var(--background-color);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-muted);
        }
        .shop-data-card.epic .s-item-rarity { background: #FFE082; color: #E65100; }
        .shop-data-card.rare .s-item-rarity { background: #B3E5FC; color: #0277BD; }
        
        .s-item-price {
          color: #FFB300;
        }
        .s-item-visual {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: var(--background-color);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }
        .s-item-emoji {
          font-size: 2rem;
        }
        .shop-data-card h4 {
          margin: 0 0 4px 0;
          font-weight: 950;
          font-size: 0.85rem;
          color: var(--text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }
        .s-item-category {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .gacha-pool-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .gacha-pool-row {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 14px;
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .g-pool-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .g-pool-emoji {
          font-size: 1.4rem;
        }
        .g-pool-name {
          font-weight: 900;
          font-size: 0.9rem;
          color: var(--text-color);
        }
        .g-pool-right {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 0.72rem;
          font-weight: 800;
        }
        .g-pool-desc {
          color: var(--text-muted);
        }
        .g-pool-rarity-badge {
          background: var(--background-color);
          color: var(--text-muted);
          padding: 2px 8px;
          border-radius: 50px;
          text-transform: uppercase;
        }

        /* ================= COMPONENT NAVIGATOR PREVIEW CSS ================= */
        .mock-navigator-row-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .mock-navigator-column-card {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 24px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .mock-navigator-column-card h5 {
          margin: 0;
          font-weight: 950;
          font-size: 0.85rem;
          color: var(--text-color);
        }
        .mock-sidebar-container {
          background: var(--sidebar-bg);
          border-radius: 18px;
          padding: 15px;
          display: flex;
          justify-content: center;
        }
        .mock-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }
        .mock-sidebar-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 10px 15px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          border: 2px solid transparent;
          color: white;
        }
        .mock-sidebar-item.active {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }
        .mock-sidebar-item:not(.active):hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .mock-sidebar-icon-box {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(1.05);
        }
        .mock-sidebar-item:not(.active) .mock-sidebar-icon-box {
          filter: brightness(0) invert(1) opacity(0.7);
        }
        .mock-sidebar-label {
          font-weight: 900;
          font-size: 0.85rem;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .mock-active-indicator {
          position: absolute;
          right: -17px;
          width: 4px;
          height: 24px;
          background: white;
          border-radius: 4px 0 0 4px;
          box-shadow: -2px 0 5px rgba(255,255,255,0.5);
        }

        .mock-tabbar-vertical-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .mock-tabbar-preview-box {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 20px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mock-tabbar-preview-box h5 {
          margin: 0;
          font-weight: 950;
          font-size: 0.85rem;
          color: var(--text-color);
        }
        .mock-pop-tabbar {
          height: 70px;
          background: var(--sidebar-bg);
          border-radius: 16px;
          display: flex;
          justify-content: center;
          border: 2.2px solid rgba(255, 255, 255, 0.2);
          overflow: visible;
        }
        .mock-tabbar-items {
          width: 100%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 10px;
        }
        .mock-pop-tab-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          cursor: pointer;
          user-select: none;
          color: white;
        }
        .mock-icon-wrapper {
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: transform 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
        }
        .mock-icon-main {
          z-index: 3;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(1.1);
        }
        .mock-active-circle {
          position: absolute;
          width: 50px;
          height: 50px;
          background: var(--tab-color);
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.5);
          box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          border: 4px solid var(--sidebar-bg);
        }
        .mock-pop-tab-item.active .mock-icon-wrapper {
          transform: translateY(-16px);
        }
        .mock-pop-tab-item.active .mock-active-circle {
          transform: scale(1);
        }
        .mock-pop-tab-item.active .mock-icon-main {
          transform: scale(1.2);
        }
        .mock-pop-label {
          position: absolute;
          bottom: 4px;
          font-size: 0.6rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .mock-pop-tab-item.active .mock-pop-label {
          opacity: 1;
          transform: translateY(0);
        }
        .mock-pop-tab-item:not(.active) .mock-icon-main {
          filter: brightness(0) invert(1) opacity(0.6);
        }

        /* ================= JELAJAH NUSANTARA GAMEPLAY UI CSS ================= */
        .game-hud-row-container {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          width: 100%;
        }
        .game-hud-preview-card {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 20px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
          min-width: 140px;
          align-items: flex-start;
        }
        .game-hud-preview-card h5 {
          margin: 0;
          font-weight: 950;
          font-size: 0.8rem;
          color: var(--text-color);
        }

        /* Top HUD Pills */
        .mock-game-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FEFDF9;
          border: 3.5px solid #E8CBA3;
          border-radius: 50px;
          padding: 4px 14px 4px 6px;
          height: 38px;
          box-sizing: border-box;
          box-shadow: 0 4px 0 #E2C59D;
        }
        .mock-game-pill-icon {
          width: 26px;
          height: 26px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .mock-game-pill-val {
          font-weight: 950;
          font-size: 0.95rem;
          color: #6C5535;
        }
        .mock-game-pill-max {
          font-size: 0.65rem;
          color: #B49F86;
        }

        .mock-game-chest-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FEFDF9;
          border: 3px solid #E8CBA3;
          border-radius: 12px;
          padding: 6px 12px;
          box-shadow: 0 4px 0 #E2C59D;
        }
        .chest-bar-emoji {
          font-size: 1.1rem;
        }
        .chest-slot-dots {
          display: flex;
          gap: 6px;
        }
        .chest-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ECE6DB;
          border: 1.5px solid #C4B29E;
        }
        .chest-dot.filled {
          background: #C08D5B;
          border-color: #7E512A;
        }

        .mock-circular-btns-row {
          display: flex;
          gap: 10px;
        }
        .mock-circle-hud-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #FEFDF9;
          border: 3px solid #E8CBA3;
          box-shadow: 0 4px 0 #E2C59D;
          font-weight: 950;
          font-size: 1.1rem;
          color: #8B5A2B;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mock-circle-hud-btn:active {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #E2C59D;
        }

        /* Floating buttons */
        .mock-floating-rect-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          background: #FEFDF9;
          border: 3.5px solid #6C5535;
          border-radius: 16px;
          box-shadow: 0 5px 0 #4E3B24;
          cursor: pointer;
          transition: all 0.1s;
        }
        .mock-floating-rect-btn:active {
          transform: translateY(3px);
          box-shadow: 0 2px 0 #4E3B24;
        }
        .rect-btn-icon {
          font-size: 1.3rem;
          margin-bottom: 4px;
        }
        .mock-floating-rect-btn span {
          font-size: 0.55rem;
          font-weight: 950;
          color: #4E3B24;
          letter-spacing: 0.5px;
        }

        /* Dialog bubble */
        .mock-speech-bubble-banner {
          background: #FFFBEB;
          border: 3px dashed #D97706;
          border-radius: 50px;
          padding: 8px 24px;
          box-shadow: 0 4px 0 rgba(217, 119, 6, 0.15);
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        }
        .mock-speech-bubble-banner p {
          margin: 0;
          font-size: 0.85rem;
          font-weight: 900;
          color: #78350F;
        }

        /* Bottom HUD layout */
        .mock-bottom-hud-layout-preview {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          width: 100%;
        }
        .mock-bottom-hud-left-panel {
          flex: 1;
          min-width: 250px;
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 20px;
          padding: 16px;
        }
        .mock-bottom-hud-left-panel h5 {
          margin: 0 0 12px 0;
          font-weight: 950;
          font-size: 0.8rem;
          color: var(--text-color);
        }
        .mock-bottom-hud-right-panel {
          flex: 2;
          min-width: 320px;
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 20px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mock-bottom-hud-right-panel h5 {
          margin: 0;
          font-weight: 950;
          font-size: 0.8rem;
          color: var(--text-color);
        }

        .mock-player-badge-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          border-radius: 12px;
          color: white;
          font-weight: 900;
          text-shadow: 0 1px 1px rgba(0,0,0,0.15);
          width: 100%;
          box-sizing: border-box;
        }
        .mock-player-badge-item.player-1 {
          background: #10B981;
        }
        .mock-player-badge-item.player-2 {
          background: #8B5CF6;
        }
        .player-badge-avatar {
          font-size: 1.2rem;
        }
        .player-badge-info {
          display: flex;
          flex-direction: column;
        }
        .player-badge-role {
          font-size: 0.75rem;
          font-weight: 950;
        }
        .player-badge-stats {
          display: flex;
          gap: 8px;
          font-size: 0.65rem;
          opacity: 0.95;
        }

        .mock-bottom-controls-bar {
          background: rgba(0,0,0,0.05);
          border-radius: 18px;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
        }
        .mock-bottom-tas-btn {
          background: #FFFDF9;
          border: 2.5px dashed #8B5A2B;
          border-radius: 12px;
          padding: 6px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 0 #5E3D1C;
          cursor: pointer;
        }
        .mock-bottom-tas-btn:active {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #5E3D1C;
        }
        .tas-icon {
          font-size: 1rem;
        }
        .tas-label {
          font-size: 0.55rem;
          font-weight: 950;
          color: #5E3D1C;
        }
        .tas-count {
          font-size: 0.5rem;
          font-weight: 800;
          color: #8B5A2B;
        }

        .mock-bottom-dadu-btn {
          flex: 1;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #D4A373, #A26E40);
          border: 2.5px solid #FFC800;
          box-shadow: 0 4px 0 #6A3E16;
          color: white;
          font-weight: 950;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          cursor: pointer;
        }
        .mock-bottom-dadu-btn:active {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #6A3E16;
        }
        .dadu-icon {
          font-size: 1.1rem;
        }

        .mock-bottom-chat-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #FFFDF9;
          border: 2.5px solid #8B5A2B;
          box-shadow: 0 4px 0 #5E3D1C;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .mock-bottom-chat-btn:active {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #5E3D1C;
        }

        /* ================= ADU CENDEKIAWAN GAMEPLAY UI CSS ================= */
        .cendekiawan-hud-box {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 100%;
          box-sizing: border-box;
        }

        .mock-hp-fighting-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 15px;
        }
        .mock-hp-bar-side {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mock-hp-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 950;
          color: var(--text-color);
        }
        .mock-hp-bar-outer {
          height: 18px;
          background: #E5E7EB;
          border-radius: 9px;
          border: 2px solid var(--border-color);
          overflow: hidden;
        }
        .mock-hp-bar-inner {
          height: 100%;
          border-radius: 7px;
          transition: width 0.3s;
        }
        .mock-hp-bar-inner.player {
          background: linear-gradient(90deg, #10B981, #059669);
        }
        .mock-hp-bar-inner.bot {
          background: linear-gradient(90deg, #EF4444, #DC2626);
        }
        
        .mock-clash-vs-badge {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #FEF3C7;
          border: 3px solid #F59E0B;
          color: #B45309;
          font-weight: 950;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 0 #D97706;
        }

        .mock-action-mode-selector {
          display: flex;
          gap: 15px;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }
        .mock-action-mode-btn {
          flex: 1;
          padding: 12px;
          border-radius: 14px;
          font-weight: 950;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.1s;
          border: 2.5px solid;
          color: white;
          text-shadow: 0 1px 1px rgba(0,0,0,0.15);
        }
        .mock-action-mode-btn.attack {
          background: #EF4444;
          border-color: #DC2626;
          box-shadow: 0 4px 0 #B91C1C;
        }
        .mock-action-mode-btn.attack.active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 #B91C1C;
          border-color: #991B1B;
        }
        .mock-action-mode-btn.heal {
          background: #10B981;
          border-color: #059669;
          box-shadow: 0 4px 0 #047857;
        }
        .mock-action-mode-btn.heal.active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 #047857;
          border-color: #065F46;
        }

        .mock-quiz-panel {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mock-timer-wrapper {
          height: 12px;
          background: #E5E7EB;
          border-radius: 6px;
          border: 1.5px solid var(--border-color);
          overflow: hidden;
        }
        .mock-timer-bar {
          height: 100%;
          border-radius: 4px;
        }
        .mock-timer-bar.pts-3-bar {
          background: #10B981;
        }
        .mock-timer-points-legend {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--text-muted);
        }
        .mock-timer-points-legend .legend-segment.active {
          color: #10B981;
          font-weight: 950;
        }

        .mock-question-box {
          background: rgba(0,0,0,0.02);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
        }
        .mock-question-box h2 {
          margin: 0 0 10px 0;
          font-size: 1.1rem;
          font-weight: 950;
          color: var(--text-color);
          line-height: 1.4;
        }
        .mock-active-item-badge {
          background: #DBEAFE;
          color: #1E40AF;
          font-size: 0.7rem;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 6px;
          width: fit-content;
          margin: 0 auto;
        }

        .mock-options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .mock-opt-btn {
          padding: 14px;
          border-radius: 14px;
          background: var(--card-bg);
          border: 2.5px solid var(--border-color);
          box-shadow: 0 4px 0 var(--border-color);
          font-weight: 900;
          font-size: 0.8rem;
          color: var(--text-color);
          cursor: pointer;
          transition: all 0.1s;
        }
        .mock-opt-btn:active {
          transform: translateY(2px);
          box-shadow: 0 2px 0 var(--border-color);
        }
        .mock-opt-btn.selected {
          border-color: #3B82F6;
          background: #EFF6FF;
          color: #1E40AF;
          box-shadow: 0 4px 0 #2563EB;
        }

        .mock-booster-cards-row {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          width: 100%;
        }
        .mock-booster-item-card {
          flex: 1;
          min-width: 120px;
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 18px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mock-booster-item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }
        .booster-item-icon {
          font-size: 1.8rem;
          margin-bottom: 8px;
        }
        .booster-item-label {
          font-weight: 950;
          font-size: 0.8rem;
          color: var(--text-color);
          margin-bottom: 4px;
        }
        .booster-item-desc {
          font-size: 0.6rem;
          color: var(--text-muted);
          font-weight: 800;
        }

        /* ================= PATH NODES GALLERY CSS ================= */
        .mock-nodes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 20px;
          margin-top: 15px;
        }
        .mock-node-card {
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 20px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          transition: transform 0.2s;
        }
        .mock-node-card:hover {
          transform: translateY(-4px);
        }
        .mock-node-visual {
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .mock-node-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .mock-node-info h4 {
          margin: 0;
          font-size: 0.75rem;
          font-weight: 950;
          color: var(--text-color);
        }
        .node-status-badge {
          font-size: 0.6rem;
          font-weight: 900;
          background: var(--background-color);
          color: var(--text-muted);
          padding: 2px 6px;
          border-radius: 6px;
          text-transform: uppercase;
        }

        /* 3D Circular Node Styles */
        .path-node-btn {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          cursor: pointer;
          color: white;
          position: relative;
        }
        .path-node-btn.material {
          width: 76px;
          height: 76px;
        }
        .path-node-btn.quiz {
          width: 68px;
          height: 68px;
        }
        .path-node-btn.reward {
          width: 82px;
          height: 82px;
          font-size: 2.6rem;
          background: transparent;
          border: none;
          animation: floatReward 2s infinite ease-in-out;
        }
        .path-node-btn.locked {
          background: linear-gradient(135deg, #CFD8DC 0%, #90A4AE 100%);
          border-bottom: 5px solid #546E7A;
          color: #ECEFF1;
          box-shadow: inset 0 2px 0 rgba(255,255,255,0.4);
        }
        .path-node-btn.material.unlocked {
          background: linear-gradient(135deg, #38B6FF 0%, #0070F3 100%);
          border-bottom: 5px solid #0056B3;
          box-shadow: inset 0 2.5px 0 rgba(255,255,255,0.4), 0 3px 6px rgba(0, 112, 243, 0.25);
        }
        .path-node-btn.quiz.unlocked {
          background: linear-gradient(135deg, #78E08F 0%, #38A169 100%);
          border-bottom: 5px solid #276749;
          box-shadow: inset 0 2.5px 0 rgba(255,255,255,0.3), 0 3px 6px rgba(56, 161, 105, 0.2);
        }
        .path-node-btn.reward.unlocked {
          background: transparent;
          filter: drop-shadow(0 6px 10px rgba(255, 215, 0, 0.4));
        }
        .path-node-btn.claimed {
          background: transparent;
          animation: none;
          filter: grayscale(100%) opacity(0.5);
          cursor: default;
        }

        /* ================= VIEW TOGGLES BAR CSS ================= */
        .view-toggles-bar {
          display: flex;
          align-items: center;
          gap: 24px;
          background: var(--card-bg);
          border: 2.2px solid var(--border-color);
          border-radius: 16px;
          padding: 10px 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .toggle-control-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .toggle-label {
          font-size: 0.78rem;
          font-weight: 900;
          color: var(--text-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .toggle-switch.mini-switch {
          width: 44px;
          height: 24px;
          border-radius: 50px;
          background: #E5E7EB;
          border: 2px solid #D1D5DB;
          position: relative;
          cursor: pointer;
          padding: 0;
          outline: none;
          transition: all 0.2s;
        }
        .toggle-switch.mini-switch.active {
          background: #58CC02;
          border-color: #46A302;
        }
        .toggle-switch.mini-switch .toggle-knob {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .toggle-switch.mini-switch.active .toggle-knob {
          transform: translateX(20px);
        }

        /* HIDE FRAMES MODE OVERRIDES */
        .dev-assets-container.hide-frames .sprite-card,
        .dev-assets-container.hide-frames .audio-row,
        .dev-assets-container.hide-frames .color-card,
        .dev-assets-container.hide-frames .view-registry-card,
        .dev-assets-container.hide-frames .shop-data-card,
        .dev-assets-container.hide-frames .gacha-pool-row,
        .dev-assets-container.hide-frames .mock-navigator-column-card,
        .dev-assets-container.hide-frames .mock-tabbar-preview-box,
        .dev-assets-container.hide-frames .game-hud-preview-card,
        .dev-assets-container.hide-frames .mock-node-card,
        .dev-assets-container.hide-frames .vertical-buttons-list,
        .dev-assets-container.hide-frames .vertical-button-item-row,
        .dev-assets-container.hide-frames .popup-trigger-row,
        .dev-assets-container.hide-frames .popups-preview-list {
          border-color: transparent !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        /* HIDE DESCRIPTIONS MODE OVERRIDES */
        .dev-assets-container.hide-descriptions .color-desc,
        .dev-assets-container.hide-descriptions .category-text,
        .dev-assets-container.hide-descriptions .format-badge,
        .dev-assets-container.hide-descriptions .section-desc-text,
        .dev-assets-container.hide-descriptions .btn-info-column p,
        .dev-assets-container.hide-descriptions .view-registry-card p,
        .dev-assets-container.hide-descriptions .popup-trigger-row p,
        .dev-assets-container.hide-descriptions .node-status-badge,
        .dev-assets-container.hide-descriptions .booster-item-desc {
          display: none !important;
        }

        /* Draggable Grabs */
        .sprite-card,
        .audio-row,
        .color-card,
        .icon-box-clean,
        .vertical-button-item-row,
        .mock-nodes-grid > div {
          cursor: grab;
          user-select: none;
        }
        .sprite-card:active,
        .audio-row:active,
        .color-card:active,
        .icon-box-clean:active,
        .vertical-button-item-row:active,
        .mock-nodes-grid > div:active {
          cursor: grabbing;
        }
        /* Editable Color Inputs */
        .color-name-input {
          background: transparent;
          border: none;
          border-bottom: 1.5px dashed transparent;
          font-size: 0.82rem;
          font-weight: 950;
          color: var(--text-color);
          padding: 2px 0;
          width: 100%;
          outline: none;
          font-family: inherit;
        }
        .color-name-input:focus {
          border-bottom-color: var(--primary-color);
        }
        .color-desc-input {
          background: transparent;
          border: none;
          border-bottom: 1.5px dashed transparent;
          font-size: 0.68rem;
          color: var(--text-muted);
          width: 100%;
          resize: none;
          outline: none;
          font-family: inherit;
          margin-top: 4px;
          height: 36px;
        }
        .color-desc-input:focus {
          border-bottom-color: var(--primary-color);
        }

        /* HIDE DESCRIPTIONS MODE OVERRIDES FOR TEXTAREAS */
        .dev-assets-container.hide-descriptions .color-desc-input {
          display: none !important;
        }

        /* JELAJAH NUSANTARA TCG CARDS ASSETS LAB */
        .jelajah-cards-assets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
          margin-top: 16px;
        }
        .dev-tcg-card-item {
          aspect-ratio: 0.72;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #FFF7E6;
          border: 5px solid #5E3A24;
          border-radius: 20px;
          position: relative;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3), 0 3px 0 #3A2315;
          max-width: 200px;
          margin: 0 auto;
          box-sizing: border-box;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .dev-tcg-card-cost {
          position: absolute;
          top: 8px;
          right: 8px;
          background: white;
          border: 2px solid #5E3A24;
          border-radius: 10px;
          height: 22px;
          padding: 0 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 950;
          color: #5E3A24;
          gap: 3px;
          box-shadow: 0 2px 0 rgba(0,0,0,0.15);
          z-index: 10;
        }
        .dev-tcg-card-illustration {
          margin: 8px 8px 4px 8px;
          height: 90px;
          border-radius: 8px;
          border: 2.5px solid #5E3A24;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: inset 0 3px 6px rgba(0,0,0,0.15);
        }
        .dev-tcg-card-icon {
          font-size: 2.2rem;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
        }
        .dev-tcg-card-name-banner {
          background: white;
          border: 2.5px solid #5E3A24;
          margin: 2px 8px;
          padding: 4px;
          text-align: center;
          border-radius: 8px;
          font-weight: 950;
          font-size: 0.72rem;
          color: #3E2723;
          text-transform: uppercase;
          box-shadow: 0 2px 0 rgba(0,0,0,0.1);
        }
        .dev-tcg-card-desc-box {
          background: #FAF4D0;
          border: 2.5px solid #5E3A24;
          margin: 2px 8px 8px 8px;
          padding: 6px;
          border-radius: 8px;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
        }
        .dev-tcg-card-desc-text {
          margin: 0;
          font-size: 0.62rem;
          color: #4E342E;
          line-height: 1.3;
          font-weight: 800;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

function MockNode({ type, status, label }) {
  const isUnlocked = status === 'unlocked';
  const isClaimed = status === 'claimed';
  const isLocked = status === 'locked';

  let iconContent = null;
  if (isLocked) {
    iconContent = <Lock size={28} color="#9CA3AF" />;
  } else if (type === 'material') {
    iconContent = <Lightbulb fill="white" size={26} color="white" />;
  } else if (type === 'quiz') {
    iconContent = <Star fill="white" size={28} color="white" />;
  } else if (type === 'reward' || isClaimed) {
    iconContent = '📦';
  }

  const btnClasses = `path-node-btn ${isUnlocked ? 'unlocked' : ''} ${isLocked ? 'locked' : ''} ${type} ${isClaimed ? 'claimed' : ''}`.trim();

  return (
    <div className="mock-node-card">
      <div className="mock-node-visual">
        <button className={btnClasses}>
          <div className="node-icon">{iconContent}</div>
        </button>
      </div>
      <div className="mock-node-info">
        <h4>{label}</h4>
        <span className="node-status-badge">{status}</span>
      </div>
    </div>
  );
}
