import React, { useState } from 'react';
import { ChevronLeft, Play, Target, Shield, Zap, Users, Bot, BookOpen, GraduationCap, Sparkles, Clock, Layers, UserPlus, Cpu, HelpCircle } from 'lucide-react';
import { tarikTambangDuelThemes, aduCendekiawanItems } from '../data/tarikTambangDuelData';
import AduCendekiawanHelpModal from '../components/hud/AduCendekiawanHelpModal';
import OnlinePlayersModal from '../../components/OnlinePlayersModal';
import ArtifactPicker from '../../jelajah-nusantara/components/ArtifactPicker';
import PlayerSlot from '../../jelajah-nusantara/components/PlayerSlot';
import { soundManager } from '../../../../utils/SoundManager';
import { useStore } from '../../../../store/useStore';
import character1iso from '../../../../assets/UI/Character/character1iso.svg';
import character2iso from '../../../../assets/UI/Character/character2iso.svg';

export default function TarikTambangSetupScreen({ onBack, onStart }) {
  const { ownedArtifacts, theme: appTheme } = useStore();
  const isDark = appTheme === 'dark';
  const [helpOpen, setHelpOpen] = useState(false);

  const [difficulty, setDifficulty] = useState('normal');
  const [questionCount, setQuestionCount] = useState(15);
  const [grade, setGrade] = useState('5');
  const [theme, setTheme] = useState('ipas');
  const [opponent, setOpponent] = useState('bot');
  const [timeLimit, setTimeLimit] = useState(20);
  const [showOnlineModal, setShowOnlineModal] = useState(false);

  // Participant slots state: [Slot 1 (Kamu), Slot 2 (Lawan)]
  const [players, setPlayers] = useState([
    null, // Slot 1 (Kamu)
    null  // Slot 2 (Lawan)
  ]);
  const [activeSlotIdx, setActiveSlotIdx] = useState(null);
  
  // Modals & UI States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOpponentModal, setShowOpponentModal] = useState(false);
  const [showBotDifficultyModal, setShowBotDifficultyModal] = useState(false);
  const [showBotViewModal, setShowBotViewModal] = useState(false);
  const [showCharPickerModal, setShowCharPickerModal] = useState(false);
  const [isOnlineLoading, setIsOnlineLoading] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // Modal Edit states
  const [editName, setEditName] = useState('Kamu');
  const [editCharId, setEditCharId] = useState(1);
  const [editArtifacts, setEditArtifacts] = useState([null, null, null]);

  // Consumable items & character states
  const [selectedChar, setSelectedChar] = useState(1); // 1 = 🤠, 2 = 👩‍🚀
  const [equippedItems, setEquippedItems] = useState([null, null, null]);
  const [showArtifactPicker, setShowArtifactPicker] = useState(false);
  const [activeArtifactSlot, setActiveArtifactSlot] = useState(null);

  const TIMELIMITS = [20, 30, 50];

  const DIFFICULTY_DETAILS = {
    mudah: { questions: 10, reward: 50, desc: 'Cocok untuk belajar santai. AI berpikir lambat & tidak terlalu akurat.' },
    normal: { questions: 15, reward: 100, desc: 'Tantangan seimbang. AI memiliki kecepatan dan akurasi rata-rata.' },
    sulit: { questions: 20, reward: 200, desc: 'Uji kemampuan maksimalmu! AI sangat cepat berpikir dan sangat presisi.' }
  };

  const DIFFICULTIES = [
    { id: 'mudah', label: 'Santai', icon: <Shield size={20} />, color: '#58cc02', cardCount: 0, desc: 'Tanpa kartu · 10 soal · Reaksi lambat' },
    { id: 'normal', label: 'Normal', icon: <Target size={20} />, color: '#1cb0f6', cardCount: 1, desc: '1 kartu random · 15 soal · Reaksi sedang' },
    { id: 'sulit', label: 'Cendekiawan', icon: <Zap size={20} />, color: '#ff4b4b', cardCount: 3, desc: '3 kartu random · 20 soal · Reaksi sangat cepat' }
  ];

  const GRADES = [
    { id: '4', label: 'Kelas 4', active: false },
    { id: '5', label: 'Kelas 5', active: true }
  ];

  const OPPONENTS = [
    { id: 'bot', label: 'Lawan Komputer', desc: 'Main langsung melawan AI pintar', icon: <Bot size={24} />, color: '#ce82ff' },
    { id: 'friend', label: 'Ajak Teman', desc: 'Main bareng teman sekelasmu', icon: <Users size={24} />, color: '#f4c265' }
  ];

  const availableItems = ownedArtifacts.map(owned => {
    const item = aduCendekiawanItems.find(i => i.id === owned.id);
    if (!item || (owned.count || 0) <= 0) return null;
    return { ...item, count: owned.count };
  }).filter(i => i !== null);

  const handleArtifactClick = (slotIdx) => {
    setActiveArtifactSlot(slotIdx);
    setShowArtifactPicker(true);
  };

  const handleSelectArtifact = (item) => {
    const isAlreadyEquipped = editArtifacts.some(a => a?.id === item.id);
    if (isAlreadyEquipped) {
      soundManager.play('error', 0.5);
      return;
    }
    const newEquipped = [...editArtifacts];
    newEquipped[activeArtifactSlot] = item;
    setEditArtifacts(newEquipped);
    setShowArtifactPicker(false);
    soundManager.play('success', 0.4);
  };

  const handleAddPlayer = (idx) => {
    soundManager.play('click', 0.5);
    setActiveSlotIdx(idx);
    if (idx === 0) {
      // Direct customization for slot 0 (main player)
      setEditName('Kamu');
      setEditCharId(selectedChar);
      setEditArtifacts(equippedItems);
      setShowEditModal(true);
    } else {
      // Open opponent selector modal for slot 1
      setShowOpponentModal(true);
    }
  };

  const handleEditPlayer = (idx) => {
    if (!players[idx]) return;
    soundManager.play('click', 0.5);
    setActiveSlotIdx(idx);
    if (idx === 0) {
      setEditName(players[0].name);
      setEditCharId(players[0].characterId || 1);
      setEditArtifacts(players[0].equippedArtifacts || [null, null, null]);
      setShowEditModal(true);
    } else {
      if (players[1].type === 'ai') {
        setShowBotViewModal(true); // Show read-only bot info
      } else {
        setShowOpponentModal(true);
      }
    }
  };

  const handleRemovePlayer = (idx) => {
    soundManager.play('error', 0.3);
    const newPlayers = [...players];
    newPlayers[idx] = null;
    setPlayers(newPlayers);
  };

  const handleSaveEdit = () => {
    const wasFirstSlotEmpty = !players[0];
    const newPlayers = [...players];
    newPlayers[0] = {
      id: 'player-1',
      name: 'Kamu',
      type: 'human',
      characterId: editCharId,
      equippedArtifacts: editArtifacts
    };
    setPlayers(newPlayers);
    setSelectedChar(editCharId);
    setEquippedItems(editArtifacts);
    setShowEditModal(false);
    soundManager.play('success', 0.4);

    if (wasFirstSlotEmpty) {
      setTimeout(() => {
        handleAddPlayer(1);
      }, 400);
    }
  };

  const selectOpponent = (type) => {
    if (type === 'ai') {
      setShowOpponentModal(false);
      setShowBotDifficultyModal(true);
      soundManager.play('click', 0.5);
    } else if (type === 'online') {
      setShowOpponentModal(false);
      setIsOnlineLoading(true);
      soundManager.play('click', 0.5);
      
      setTimeout(() => {
        setIsOnlineLoading(false);
        setWarningMessage('Fitur bermain online (Undang Teman) tidak tersedia di versi prototipe ini. Silakan gunakan Lawan AI.');
        soundManager.play('error', 0.5);
      }, 2000);
    }
  };

  const selectBotDifficulty = (diff) => {
    const diffConfig = DIFFICULTIES.find(d => d.id === diff);
    const cardCount = diffConfig?.cardCount ?? 0;

    // Pick random cards from aduCendekiawanItems pool
    const allItemIds = ['tt_compas', 'tt_weight', 'tt_shield', 'tt_hourglass', 'tt_magnet', 'tt_stun', 'tt_heal_potion', 'tt_book_bomb', 'tt_telescope'];
    const shuffled = [...allItemIds].sort(() => 0.5 - Math.random());
    const botItemIds = shuffled.slice(0, cardCount);
    // Pad to 3 slots
    const botArtifacts = [
      botItemIds[0] ? { id: botItemIds[0] } : null,
      botItemIds[1] ? { id: botItemIds[1] } : null,
      botItemIds[2] ? { id: botItemIds[2] } : null,
    ];

    const newPlayers = [...players];
    const randomChar = Math.random() < 0.5 ? 1 : 2;
    newPlayers[1] = {
      id: `bot-${Date.now()}`,
      name: `Bot (${diff === 'mudah' ? 'Santai' : diff === 'normal' ? 'Normal' : 'Cendekiawan'})`,
      type: 'ai',
      difficulty: diff,
      characterId: randomChar,
      equippedArtifacts: botArtifacts,
      botItemIds // store for game screen to use
    };
    setPlayers(newPlayers);
    setDifficulty(diff);
    setOpponent('bot');
    setShowBotDifficultyModal(false);
    soundManager.play('success', 0.4);
  };

  const handleStart = () => {
    if (!players[0]) {
      soundManager.play('error', 0.5);
      setWarningMessage('Silakan pilih karakter utama Anda terlebih dahulu sebelum memulai!');
      return;
    }
    if (!players[1]) {
      soundManager.play('error', 0.5);
      setWarningMessage('Butuh lawan untuk memulai duel! Silakan tambahkan AI komputer atau undang teman.');
      return;
    }

    const equippedIds = players[0].equippedArtifacts.filter(item => item !== null).map(item => item.id);
    if (equippedIds.length > 0) {
      useStore.getState().consumeArtifacts(equippedIds);
    }

    const oppType = players[1].type === 'ai' ? 'bot' : 'friend';
    const friendObj = players[1].type === 'online' ? { id: players[1].id, name: players[1].name } : null;

    soundManager.play('whoosh', 0.6);
    onStart({ 
      grade, 
      difficulty: players[1].difficulty || difficulty, 
      theme, 
      opponent: oppType, 
      friend: friendObj, 
      characterId: players[0].characterId, 
      equippedItems: equippedIds, 
      questionCount,
      timeLimit 
    });
  };

  return (
    <div className="lobby-container">
      {/* Dynamic Classroom Grid Backdrop */}
      <div className="table-texture" />
      <div className="table-vignette" />

      {/* HEADER */}
      <header className="lobby-header">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={28} />
        </button>
        <div className="header-title" style={{ flex: 1 }}>
          <span className="subtitle">PENGATURAN DUEL</span>
          <h2>ADU CENDEKIAWAN</h2>
        </div>
        <button className="lobby-help-btn" onClick={() => setHelpOpen(true)} title="Panduan">
          <HelpCircle size={24} />
        </button>
      </header>

      <main className="lobby-content-grid">
        {/* START DUEL BUTTON IN THE GRID (TOP) */}
        <div className="start-btn-container">
          <button className="start-voyage-btn" onClick={handleStart}>
            <div className="btn-3d-face">
              <Play size={20} fill="white" />
              <span>MULAI DUEL SEKARANG!</span>
            </div>
            <div className="btn-3d-bottom" />
          </button>
        </div>

        {/* RIGHT COLUMN (SWAPPED TO TOP ON MOBILE): PESERTA (2 SLOTS) */}
        <div className="right-column">
          <section className="lobby-section">
            <div className="section-title">
              <span>PESERTA DUEL</span>
            </div>
            <div className="players-grid">
              {players.map((p, idx) => (
                <PlayerSlot 
                  key={idx} 
                  player={p} 
                  onAddClick={() => handleAddPlayer(idx)} 
                  onClick={p ? () => handleEditPlayer(idx) : null}
                  onRemove={idx > 0 && p ? () => handleRemovePlayer(idx) : null}
                  isFirstSlotEmpty={idx === 0 && !p}
                />
              ))}
            </div>
          </section>
        </div>

        {/* LEFT COLUMN: Configuration settings */}
        <div className="left-column">
          {/* Combined Section: PENGATURAN KUIS */}
          <section className="lobby-section">
            <div className="section-title">
              <span>PENGATURAN KUIS</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '6px', display: 'block', color: isDark ? '#bfcdff' : '#64748B' }}>PILIH KELAS</label>
                <select className="custom-select-3d" value={grade} onChange={e => setGrade(e.target.value)}>
                  {GRADES.map(g => (
                    <option key={g.id} value={g.id} disabled={!g.active}>
                      {g.label} {!g.active ? '(Segera Hadir)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '6px', display: 'block', color: isDark ? '#bfcdff' : '#64748B' }}>PILIH TEMA KUIS</label>
                <select className="custom-select-3d" value={theme} onChange={e => setTheme(e.target.value)}>
                  {tarikTambangDuelThemes.map(t => (
                    <option key={t.id} value={t.id} disabled={!t.active}>
                      {t.icon} {t.name} {!t.active ? '(Segera Hadir)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Combined Section: ATURAN DUEL */}
          <section className="lobby-section">
            <div className="section-title">
              <span>ATURAN DUEL</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '6px', display: 'block', color: isDark ? '#bfcdff' : '#64748B' }}>BANYAK SOAL</label>
                <select className="custom-select-3d" value={questionCount} onChange={e => setQuestionCount(Number(e.target.value))}>
                  <option value={10}>10 Soal</option>
                  <option value={15}>15 Soal</option>
                  <option value={20}>20 Soal</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '6px', display: 'block', color: isDark ? '#bfcdff' : '#64748B' }}>BATAS WAKTU</label>
                <select className="custom-select-3d" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))}>
                  {TIMELIMITS.map(limit => (
                    <option key={limit} value={limit}>{limit} Detik</option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Online Players Modal */}
      {showOnlineModal && (
        <OnlinePlayersModal 
          onClose={() => setShowOnlineModal(false)}
          onInvite={(player) => {
            setShowOnlineModal(false);
            const equippedIds = equippedItems.filter(item => item !== null).map(item => item.id);
            onStart({ grade, difficulty, theme, opponent, friend: player, characterId: selectedChar, equippedItems: equippedIds });
          }}
        />
      )}

      {/* Artifact Picker Modal - rendered AFTER edit modal so it appears on top */}

      {/* Player Slot 1 Customization Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="player-option-modal" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <h3>Edit Peserta</h3>
            
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '6px', display: 'block', color: isDark ? '#bfcdff' : '#6B7280' }}>NAMA PESERTA</label>
              <div style={{ fontSize: '1rem', fontWeight: 955, padding: '10px', background: isDark ? '#1a0a3a' : '#F3F4F6', borderRadius: '12px', border: '3px solid ' + (isDark ? '#2e1957' : '#E5E7EB'), color: isDark ? '#FFF' : '#1F2937' }}>
                {editName}
              </div>
            </div>

            {/* PENGATURAN KARAKTER: Character slot + 3 vertical item slots */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'stretch' }}>
              {/* Left side: Character slot */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: isDark ? '#bfcdff' : '#6B7280', textAlign: 'left' }}>KARAKTER</label>
                <div 
                  className={`char-slot-3d ${editCharId ? 'filled' : 'empty'}`}
                  onClick={() => setShowCharPickerModal(true)}
                  style={{
                    flex: '1', minHeight: '150px',
                    background: isDark ? '#170a35' : '#F9FAFB',
                    border: '3px solid ' + (isDark ? '#2f166b' : '#E5E7EB'),
                    borderRadius: '24px', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)', transition: 'transform 0.1s'
                  }}
                >
                  {editCharId ? (
                    <>
                      <img 
                        src={editCharId === 1 ? character1iso : character2iso} 
                        alt={`Karakter ${editCharId}`} 
                        style={{ height: '80px', objectFit: 'contain', marginBottom: '4px' }}
                      />
                      <span style={{ fontSize: '0.75rem', fontWeight: 955, color: isDark ? '#fff' : '#1F2937' }}>Karakter {editCharId}</span>
                      {/* Passive Skill Description */}
                      <div style={{
                        marginTop: '6px', padding: '5px 8px',
                        background: isDark ? 'rgba(88,204,2,0.12)' : 'rgba(88,204,2,0.1)',
                        borderRadius: '10px', border: '1.5px solid rgba(88,204,2,0.3)',
                        width: '100%', boxSizing: 'border-box'
                      }}>
                        <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#58CC02', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>⚡ Skill Pasif</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: isDark ? '#aaffaa' : '#166534', lineHeight: '1.3' }}>
                          {editCharId === 1
                            ? '+1 Poin Serangan'
                            : '+1 Poin Pemulihan'
                          }
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '2rem', color: '#AFAFAF' }}>+</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Pilih Karakter</span>
                    </>
                  )}
                </div>
              </div>

              {/* Right side: 3 vertical item slots */}
              <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: isDark ? '#bfcdff' : '#6B7280', textAlign: 'left' }}>BEKAL KARTU AKSI</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '1', justifyContent: 'space-between' }}>
                  {editArtifacts.map((art, idx) => (
                    <div 
                      key={idx} 
                      className={`artifact-vertical-slot ${art ? 'filled' : 'empty'}`}
                      onClick={() => handleArtifactClick(idx)}
                      style={{
                        height: '46px', background: isDark ? '#170a35' : '#F9FAFB',
                        border: '3px dashed ' + (isDark ? '#2f166b' : '#E5E7EB'),
                        borderRadius: '16px', display: 'flex', alignItems: 'center',
                        padding: '0 12px', gap: '8px', cursor: 'pointer', position: 'relative'
                      }}
                    >
                      {art ? (
                        <>
                          <span style={{ fontSize: '1.2rem' }}>{art.icon}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 955, flex: '1', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{art.name}</span>
                          <button 
                            className="slot-remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newEquipped = [...editArtifacts];
                              newEquipped[idx] = null;
                              setEditArtifacts(newEquipped);
                              soundManager.play('error', 0.3);
                            }}
                            style={{
                              background: '#EF4444', color: 'white', border: 'none',
                              borderRadius: '50%', width: '18px', height: '18px',
                              fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.3)', zIndex: 10
                            }}
                          >
                            X
                          </button>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '1.1rem', color: '#AFAFAF' }}>+</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#AFAFAF' }}>Slot {idx + 1} Kosong</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                className="start-voyage-btn" 
                style={{ flex: 1 }}
                onClick={handleSaveEdit}
              >
                <div className="btn-3d-face">
                  <span>SIMPAN</span>
                </div>
                <div className="btn-3d-bottom" />
              </button>
              <button 
                className="cancel-btn" 
                style={{ alignSelf: 'center' }}
                onClick={() => setShowEditModal(false)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Artifact Picker Modal - above edit modal in DOM order so z-index stacks correctly */}
      {showArtifactPicker && (
        <ArtifactPicker
          artifacts={availableItems}
          selectedId={editArtifacts[activeArtifactSlot]?.id || null}
          onSelect={handleSelectArtifact}
          onClose={() => setShowArtifactPicker(false)}
        />
      )}

      {/* Character Selector Modal inside Edit Modal */}
      {showCharPickerModal && (
        <div className="modal-overlay" style={{ zIndex: 4500 }} onClick={() => setShowCharPickerModal(false)}>
          <div className="player-option-modal" style={{ maxWidth: '340px' }} onClick={e => e.stopPropagation()}>
            <h3>Pilih Karakter</h3>
            <div className="options-grid" style={{ display: 'flex', flexDirection: 'row', gap: '15px', marginBottom: '20px' }}>
              <button 
                className={`option-btn ${editCharId === 1 ? 'selected' : ''}`}
                onClick={() => {
                  setEditCharId(1);
                  setShowCharPickerModal(false);
                  soundManager.play('success', 0.4);
                }}
                style={{ flex: 1, border: '4px solid ' + (editCharId === 1 ? '#58CC02' : '#E5E7EB'), padding: '14px 10px', height: '130px', justifyContent: 'center' }}
              >
                <div className="opt-icon" style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                  <img src={character1iso} alt="Karakter 1" style={{ height: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '0.8rem' }}>Karakter 1</span>
              </button>
              <button 
                className={`option-btn ${editCharId === 2 ? 'selected' : ''}`}
                onClick={() => {
                  setEditCharId(2);
                  setShowCharPickerModal(false);
                  soundManager.play('success', 0.4);
                }}
                style={{ flex: 1, border: '4px solid ' + (editCharId === 2 ? '#58CC02' : '#E5E7EB'), padding: '14px 10px', height: '130px', justifyContent: 'center' }}
              >
                <div className="opt-icon" style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                  <img src={character2iso} alt="Karakter 2" style={{ height: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '0.8rem' }}>Karakter 2</span>
              </button>
            </div>
            <button className="cancel-btn" onClick={() => setShowCharPickerModal(false)}>Batal</button>
          </div>
        </div>
      )}

      {/* Opponent Selector Modal */}
      {showOpponentModal && (
        <div className="modal-overlay" onClick={() => setShowOpponentModal(false)}>
          <div className="player-option-modal" onClick={e => e.stopPropagation()}>
            <h3>Tambah Lawan</h3>
            <div className="options-grid">
              <button className="option-btn" onClick={() => selectOpponent('ai')}>
                <div className="opt-icon"><Bot size={32} /></div>
                <span>Lawan AI (Bot)</span>
                <p>Tantang komputer untuk berduel kuis</p>
              </button>
              <button className="option-btn" onClick={() => selectOpponent('online')}>
                <div className="opt-icon"><UserPlus size={32} /></div>
                <span>Undang Teman</span>
                <p>Main duel online bersama teman</p>
              </button>
            </div>
            <button className="cancel-btn" onClick={() => setShowOpponentModal(false)}>Batal</button>
          </div>
        </div>
      )}

      {/* Bot Info Modal (Read-only) */}
      {showBotViewModal && players[1] && (
        <div className="modal-overlay" onClick={() => setShowBotViewModal(false)}>
          <div className="player-option-modal" style={{ maxWidth: '380px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '4px' }}>Peserta</h3>

            {/* Bot name + difficulty badge */}
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '6px', display: 'block', color: isDark ? '#bfcdff' : '#6B7280' }}>NAMA PESERTA</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: isDark ? '#1a0a3a' : '#F3F4F6', borderRadius: '12px', border: '3px solid ' + (isDark ? '#2e1957' : '#E5E7EB') }}>
                <span style={{ fontWeight: 955, fontSize: '1rem', color: isDark ? '#fff' : '#1F2937', flex: 1 }}>{players[1].name}</span>
                <span style={{
                  fontSize: '0.6rem', fontWeight: 900, padding: '3px 8px', borderRadius: '8px',
                  background: players[1].difficulty === 'mudah' ? '#D1FAE5' : players[1].difficulty === 'normal' ? '#DBEAFE' : '#FEE2E2',
                  color: players[1].difficulty === 'mudah' ? '#065F46' : players[1].difficulty === 'normal' ? '#1E40AF' : '#991B1B'
                }}>
                  {players[1].difficulty === 'mudah' ? 'Santai' : players[1].difficulty === 'normal' ? 'Normal' : 'Cendekiawan'}
                </span>
              </div>
            </div>

            {/* Character + Item Slots (read-only) */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'stretch' }}>
              {/* Left: Character */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: isDark ? '#bfcdff' : '#6B7280', textAlign: 'left' }}>KARAKTER</label>
                <div style={{
                  flex: '1', minHeight: '150px',
                  background: isDark ? '#170a35' : '#F9FAFB',
                  border: '3px solid ' + (isDark ? '#2f166b' : '#E5E7EB'),
                  borderRadius: '24px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)'
                }}>
                  <img
                    src={players[1].characterId === 1 ? character1iso : character2iso}
                    alt={`Karakter ${players[1].characterId}`}
                    style={{ height: '80px', objectFit: 'contain', marginBottom: '4px' }}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: 955, color: isDark ? '#fff' : '#1F2937' }}>Karakter {players[1].characterId}</span>
                  {/* Passive skill badge */}
                  <div style={{ marginTop: '6px', padding: '5px 8px', background: isDark ? 'rgba(88,204,2,0.12)' : 'rgba(88,204,2,0.1)', borderRadius: '10px', border: '1.5px solid rgba(88,204,2,0.3)', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#58CC02', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>⚡ Skill Pasif</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: isDark ? '#aaffaa' : '#166534', lineHeight: '1.3' }}>
                      {players[1].characterId === 1 ? '+1 Poin Serangan' : '+1 Poin Pemulihan'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: 3 Item Slots (read-only) */}
              <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: isDark ? '#bfcdff' : '#6B7280', textAlign: 'left' }}>BEKAL KARTU AKSI</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '1', justifyContent: 'space-between' }}>
                  {(players[1].equippedArtifacts || [null, null, null]).map((art, idx) => {
                    // Resolve full item info from id
                    const itemInfo = art?.id ? aduCendekiawanItems.find(i => i.id === art.id) : null;
                    return (
                      <div
                        key={idx}
                        style={{
                          height: '46px',
                          background: isDark ? (itemInfo ? '#170a35' : '#0d0626') : (itemInfo ? '#F9FAFB' : '#F3F4F6'),
                          border: '3px ' + (itemInfo ? 'solid' : 'dashed') + ' ' + (isDark ? (itemInfo ? '#CE82FF' : '#1e0d40') : (itemInfo ? '#CE82FF' : '#E5E7EB')),
                          borderRadius: '16px', display: 'flex', alignItems: 'center',
                          padding: '0 12px', gap: '8px', opacity: itemInfo ? 1 : 0.5
                        }}
                      >
                        {itemInfo ? (
                          <>
                            <span style={{ fontSize: '1.2rem' }}>{itemInfo.icon}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 955, flex: '1', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isDark ? '#fff' : '#1F2937' }}>{itemInfo.name}</span>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: '1.1rem', color: '#AFAFAF' }}>—</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#AFAFAF' }}>Slot {idx + 1} Kosong</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button className="cancel-btn" style={{ width: '100%' }} onClick={() => setShowBotViewModal(false)}>Tutup</button>
          </div>
        </div>
      )}

      {/* Bot Difficulty Selector Modal */}
      {showBotDifficultyModal && (
        <div className="modal-overlay" onClick={() => setShowBotDifficultyModal(false)}>
          <div className="player-option-modal" style={{ maxWidth: '360px' }} onClick={e => e.stopPropagation()}>
            <h3>Kecerdasan Bot AI</h3>
            <div className="options-grid" style={{ gap: '10px' }}>
              {DIFFICULTIES.map(diff => (
                <button 
                  key={diff.id} 
                  className="option-btn" 
                  onClick={() => selectBotDifficulty(diff.id)}
                  style={{ '--btn-color': diff.color, alignItems: 'flex-start', textAlign: 'left', padding: '12px 14px', gap: '10px' }}
                >
                  <div className="opt-icon" style={{ color: diff.color, flexShrink: 0 }}>{diff.icon}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900 }}>{diff.label}</span>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 700, lineHeight: '1.4' }}>{diff.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button className="cancel-btn" onClick={() => setShowBotDifficultyModal(false)}>Batal</button>
          </div>
        </div>
      )}

      {/* Online Loading Modal */}
      {isOnlineLoading && (
        <div className="modal-overlay" style={{ zIndex: 5000, background: 'rgba(0,0,0,0.85)' }}>
          <div className="player-option-modal" style={{ maxWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <div className="loading-spinner-3d" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: isDark ? 'white' : '#1F2937' }}>Menghubungkan...</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: isDark ? '#bfcdff' : '#6B7280' }}>Mengirim undangan duel online</p>
          </div>
        </div>
      )}

      {warningMessage && (
        <div className="modal-overlay" onClick={() => setWarningMessage('')} style={{ zIndex: 4000 }}>
          <div className="player-option-modal" style={{ maxWidth: '340px' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 15px', color: '#FF4B4B' }}>Perhatian</h3>
            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: isDark ? '#bfcdff' : '#4B4B4B', lineHeight: '1.5', marginBottom: '25px', padding: '0 10px' }}>
              {warningMessage}
            </p>
            <button 
              className="start-voyage-btn" 
              onClick={() => setWarningMessage('')}
            >
              <div className="btn-3d-face" style={{ background: 'linear-gradient(to bottom, #FF8484, #FF4B4B)', textShadow: '0 2px 0 #9e1d1d' }}>
                <span>MENGERTI</span>
              </div>
              <div className="btn-3d-bottom" style={{ background: '#9e1d1d' }} />
            </button>
          </div>
        </div>
      )}

      <AduCendekiawanHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      <style jsx>{`
        .lobby-container {
          position: absolute; inset: 0;
          background: ${isDark ? '#140c24' : '#F8FAFC'};
          display: flex; flex-direction: column;
          font-family: 'Outfit', sans-serif;
          z-index: 20; overflow: hidden;
        }

        .table-texture {
          position: absolute; inset: 0;
          opacity: ${isDark ? 0.08 : 0.04};
          background-image: radial-gradient(#1CB0F6 1.5px, transparent 1.5px);
          background-size: 25px 25px;
          z-index: 0; pointer-events: none;
        }
        .table-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(circle at center, transparent 30%, ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)'} 100%);
          z-index: 1; pointer-events: none;
        }

        .lobby-header {
          display: flex; align-items: center; gap: 20px;
          padding: 20px 24px; z-index: 10; border-bottom: 2px solid ${isDark ? '#2e1957' : '#E2E8F0'};
          background: ${isDark ? 'rgba(20, 12, 36, 0.9)' : 'rgba(255, 255, 255, 0.9)'}; 
          backdrop-filter: blur(5px);
        }

        .back-btn, .lobby-help-btn {
          width: 44px; height: 44px; 
          background: #1CB0F6;
          border: 3px solid #1CB0F6; border-bottom: 6px solid #147BB0; border-radius: 14px; 
          color: white; 
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          transition: all 0.1s; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .back-btn:active, .lobby-help-btn:active { transform: translateY(3px); border-bottom-width: 3px; }

        .header-title { display: flex; flex-direction: column; }
        .header-title .subtitle { font-weight: 900; font-size: 0.72rem; color: #1CB0F6; letter-spacing: 2px; }
        .header-title h2 { font-weight: 955; font-size: 1.3rem; color: ${isDark ? 'white' : '#0F172A'}; margin: 0; }

        .lobby-content-grid { 
          flex: 1; overflow-y: auto; padding: 25px; z-index: 5;
          padding-bottom: 120px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 30px;
          scrollbar-width: none;
        }
        .lobby-content-grid::-webkit-scrollbar { display: none; }

        @media (max-width: 900px) {
          .lobby-content-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 15px;
            padding-bottom: 95px; /* Navigator Bottom Safeguard */
          }
        }

        .left-column, .right-column {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .start-btn-container {
          grid-column: 1 / -1;
          margin-top: 5px;
          margin-bottom: 10px;
        }

        .lobby-section { 
          background: ${isDark ? '#20133c' : '#FFFFFF'};
          border: 4px solid ${isDark ? '#3c2470' : '#E2E8F0'};
          border-radius: 28px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: inset 0 3px 0 rgba(255,255,255,0.05), 0 8px 0 ${isDark ? '#0f081d' : '#CBD5E1'};
          position: relative;
        }

        .section-title { 
          display: flex; align-items: center; gap: 10px; 
          background: #1CB0F6;
          border: 3px solid #1CB0F6;
          border-bottom: 6px solid #147BB0;
          padding: 8px 16px; border-radius: 18px; 
          box-shadow: 0 6px 12px rgba(0,0,0,0.25);
          width: fit-content;
          margin-top: -42px;
          margin-left: -5px;
          margin-bottom: 20px;
        }
        .section-title span { font-weight: 955; font-size: 0.82rem; color: white; letter-spacing: 1.5px; text-shadow: 0 2px 0 rgba(0,0,0,0.5); }
        .section-title :global(svg) { color: white !important; }

        /* Custom 3D Select Dropdowns */
        .custom-select-3d {
          width: 100%;
          background: ${isDark ? '#2e1957' : '#FFFFFF'};
          border: 3px solid ${isDark ? '#4b298c' : '#CBD5E1'};
          border-bottom: 6px solid ${isDark ? '#1d0d3b' : '#94A3B8'};
          border-radius: 18px;
          padding: 12px 16px;
          font-size: 0.95rem;
          font-weight: 900;
          color: ${isDark ? 'white' : '#1E293B'};
          outline: none;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231CB0F6' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
          transition: transform 0.1s;
        }
        .custom-select-3d:active {
          transform: translateY(3px);
          border-bottom-width: 3px;
        }
        .custom-select-3d option {
          background: ${isDark ? '#20133c' : '#FFFFFF'};
          color: ${isDark ? 'white' : '#1E293B'};
          font-weight: 800;
        }

        /* Players Grid Styles for 2 slots */
        .players-grid { 
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px; 
          background: ${isDark ? '#170a35' : '#F9FAFB'}; 
          padding: 24px; border-radius: 24px; 
          border: 3px solid ${isDark ? '#2f166b' : '#E5E7EB'};
          box-shadow: inset 0 6px 12px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'};
          overflow: visible !important;
        }

        /* PlayerSlot Global Overrides */
        :global(.slot-empty) {
          background: ${isDark ? '#25134f' : '#FFFFFF'} !important;
          border: 3px dashed ${isDark ? '#4b2d97' : '#D1D5DB'} !important;
          border-radius: 20px !important;
          padding: 15px !important;
          box-shadow: inset 0 4px 8px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'} !important;
        }
        :global(.slot-empty span) {
          color: ${isDark ? '#8b75cd' : '#9CA3AF'} !important;
          font-weight: 900 !important;
        }
        :global(.slot-filled) {
          background: ${isDark ? 'linear-gradient(180deg, #3855eb 0%, #1b2ea1 100%)' : '#FFFFFF'} !important;
          border: 4px solid ${isDark ? '#fbd22b' : '#E5E7EB'} !important;
          border-radius: 24px !important;
          padding: 15px !important;
          box-shadow: 0 6px 0 ${isDark ? '#111b5e' : '#D1D5DB'}, 0 10px 15px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)'} !important;
          overflow: visible !important;
        }
        :global(.slot-filled .char-slot-preview) {
          background: ${isDark ? '#13227a' : '#F3F4F6'} !important;
          border: 3px solid ${isDark ? '#fbd22b' : '#E5E7EB'} !important;
          box-shadow: inset 0 4px 8px rgba(0,0,0,0.3) !important;
        }
        :global(.slot-filled .player-name) {
          color: ${isDark ? 'white' : '#1F2937'} !important;
          font-weight: 955 !important;
          text-shadow: ${isDark ? '0 2px 0 rgba(0,0,0,0.5)' : 'none'} !important;
        }

        /* Start Button Styles */
        .start-voyage-btn {
          width: 100%; height: 58px; position: relative; background: none; border: none; cursor: pointer;
        }
        .btn-3d-face {
          position: absolute; inset: 0; background: linear-gradient(to bottom, #58CC02, #4BAF02); 
          border: none;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          color: white !important; font-weight: 955; font-size: 1.05rem; z-index: 2;
          transition: transform 0.1s;
          text-shadow: 0 2px 0 #2c6601;
          box-shadow: inset 0 3px 0 rgba(255,255,255,0.25), 0 4px 10px rgba(0,0,0,0.2);
        }
        .btn-3d-face span { color: white !important; }
        .btn-3d-bottom { position: absolute; inset: 0; bottom: -8px; background: #2c6601; border-radius: 20px; z-index: 1; }
        .start-voyage-btn:active .btn-3d-face { transform: translateY(5px); }
        .start-voyage-btn:active .btn-3d-bottom { bottom: -3px; }

        /* Modals & Popups Styling */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.85);
          display: flex; align-items: center; justify-content: center;
          z-index: 3000; animation: fadeIn 0.3s;
        }
        .player-option-modal {
          background: ${isDark ? '#25134f' : '#FFFFFF'}; width: 90%; max-width: 360px; border-radius: 32px;
          padding: 30px; text-align: center; color: ${isDark ? 'white' : '#1F2937'};
          border: 4px solid ${isDark ? '#fbd22b' : '#1CB0F6'};
          box-shadow: 0 12px 0 ${isDark ? '#11052b' : '#147BB0'}, 0 20px 40px rgba(0,0,0,0.5);
          animation: popUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popUp { from { transform: scale(0.8) translateY(50px); } to { transform: scale(1) translateY(0); } }
        .player-option-modal h3 { font-weight: 950; margin: 0 0 25px; font-size: 1.2rem; color: ${isDark ? '#FFD700' : '#1CB0F6'}; text-shadow: ${isDark ? '0 2px 0 rgba(0,0,0,0.5)' : 'none'}; }
        
        .options-grid { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; }
        .option-btn {
          background: ${isDark ? 'linear-gradient(180deg, #3855eb 0%, #1b2ea1 100%)' : '#F3F4F6'}; 
          border: 4px solid ${isDark ? '#fbd22b' : '#E5E7EB'}; 
          padding: 20px; border-radius: 20px; display: flex; flex-direction: column; align-items: center;
          cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 0 ${isDark ? '#111b5e' : '#D1D5DB'};
          position: relative; width: 100%;
        }
        .option-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 ${isDark ? '#111b5e' : '#D1D5DB'}; }
        .opt-icon { color: ${isDark ? 'white' : '#1CB0F6'}; margin-bottom: 10px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
        .opt-icon :global(svg) { color: ${isDark ? 'white' : '#1CB0F6'} !important; }
        .option-btn span { font-weight: 955; color: ${isDark ? 'white' : '#1F2937'}; font-size: 1rem; text-shadow: ${isDark ? '0 2px 0 rgba(0,0,0,0.5)' : 'none'}; }
        .option-btn p { font-size: 0.75rem; color: ${isDark ? '#bfcdff' : '#6B7280'}; font-weight: 800; margin-top: 4px; }
        
        .cancel-btn {
          background: none; border: none; font-weight: 955; color: #FF4B4B;
          font-size: 0.9rem; cursor: pointer;
        }

        /* 3D Active State for Character Cards */
        .option-btn.selected {
          border-color: #58CC02 !important;
          box-shadow: 0 6px 0 #3b8701 !important;
        }

        .loading-spinner-3d {
          width: 48px;
          height: 48px;
          border: 6px solid ${isDark ? '#2e1957' : '#E2E8F0'};
          border-top: 6px solid #f4c265;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: 600px) {
          .lobby-header {
            padding: 10px 15px;
            gap: 12px;
          }
          .header-title h2 {
            font-size: 1.1rem;
          }
          .back-btn, .lobby-help-btn {
            width: 36px;
            height: 36px;
            border-radius: 10px;
          }
          .lobby-content-grid {
            padding: 10px;
            gap: 12px;
            padding-bottom: 90px;
          }
          .lobby-section {
            padding: 14px;
            margin-bottom: 15px;
            border-radius: 18px;
            box-shadow: inset 0 3px 0 rgba(255,255,255,0.05), 0 4px 0 ${isDark ? '#0f081d' : '#CBD5E1'};
          }
          .section-title {
            margin-top: -30px;
            padding: 6px 12px;
            border-radius: 12px;
            border-bottom-width: 4px;
            margin-bottom: 12px;
          }
          .section-title span {
            font-size: 0.75rem;
            letter-spacing: 1px;
          }
          
          /* Dropdown Menu overrides for mobile */
          .custom-select-3d {
            padding: 10px 12px;
            font-size: 0.85rem;
          }

          /* 2 Slots mobile layout */
          .players-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            padding: 10px;
            gap: 12px;
            border-radius: 16px;
            overflow: visible !important;
          }
          :global(.slot-filled) {
            border-radius: 16px !important;
            border-width: 3px !important;
            padding: 8px !important;
            box-shadow: 0 4px 0 ${isDark ? '#111b5e' : '#D1D5DB'} !important;
            overflow: visible !important;
          }
          :global(.slot-filled .char-slot-preview) {
            width: 44px !important;
            height: 44px !important;
            border-radius: 10px !important;
          }
          :global(.slot-filled .avatar-container),
          :global(.slot-filled .avatar-container .avatar-wrapper),
          :global(.slot-filled .avatar-container .avatar-base-img) {
            border-radius: 10px !important;
          }
          :global(.slot-filled .player-name) {
            font-size: 0.7rem !important;
          }
          :global(.slot-empty) {
            border-radius: 16px !important;
            padding: 8px !important;
          }
          :global(.slot-empty span) {
            font-size: 0.7rem !important;
          }

          .start-voyage-btn {
            height: 48px;
          }
          .btn-3d-face {
            border-radius: 14px;
            font-size: 0.95rem;
          }
          .btn-3d-bottom {
            border-radius: 14px;
            bottom: -5px;
          }
          .start-voyage-btn:active .btn-3d-face {
            transform: translateY(3px);
          }

          /* COMPACT MODALS FOR MOBILE */
          .player-option-modal {
            padding: 18px !important;
            border-radius: 20px !important;
            max-width: 310px !important;
            box-shadow: 0 8px 0 ${isDark ? '#11052b' : '#147BB0'}, 0 15px 30px rgba(0,0,0,0.4) !important;
            border-width: 3px !important;
          }
          .player-option-modal h3 {
            font-size: 1.05rem !important;
            margin-bottom: 15px !important;
          }
          .options-grid {
            gap: 10px !important;
            margin-bottom: 18px !important;
          }
          .option-btn {
            padding: 10px 15px !important;
            border-radius: 14px !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 12px !important;
            text-align: left !important;
            box-shadow: 0 4px 0 ${isDark ? '#111b5e' : '#D1D5DB'} !important;
            border-width: 3px !important;
          }
          .option-btn:active {
            transform: translateY(3px) !important;
            box-shadow: 0 1px 0 ${isDark ? '#111b5e' : '#D1D5DB'} !important;
          }
          .opt-icon {
            margin-bottom: 0 !important;
          }
          .opt-icon :global(svg) {
            width: 20px !important;
            height: 20px !important;
          }
          .option-btn span {
            font-size: 0.85rem !important;
          }
          .option-btn p {
            display: none !important;
          }
          .cancel-btn {
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </div>
  );
}
