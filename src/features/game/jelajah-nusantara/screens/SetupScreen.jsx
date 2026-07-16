import React, { useState, useEffect } from 'react';
import { ChevronLeft, Play, Map, Shield, Users, Plus, Cpu, User, BookOpen, Layers, UserPlus, HelpCircle } from 'lucide-react';
import JelajahHelpModal from '../components/hud/JelajahHelpModal';
import { useStore } from '../../../../store/useStore';
import { useNavigationStore } from '../../../../store/useNavigationStore';
import { useGameStore } from '../../../../store/useGameStore';
import { soundManager } from '../../../../utils/SoundManager';
import MapCard from '../components/MapCard';
import PlayerSlot from '../components/PlayerSlot';
import ArtifactPicker from '../components/ArtifactPicker';
import OnlinePlayersModal from '../../components/OnlinePlayersModal';
import { mapManager } from '../utils/mapManager';
import { availableSubjects, availableClasses, quizBanks } from '../data/questions';
import { actionCards } from '../data/cards';
import character1iso from '../../../../assets/UI/Character/character1iso.svg';
import character2iso from '../../../../assets/UI/Character/character2iso.svg';

export default function SetupScreen() {
  const { ownedArtifacts, theme, userName } = useStore();
  const isDark = theme === 'dark';
  const { setJelajahSubView, setGameSubView } = useNavigationStore();
  const [helpOpen, setHelpOpen] = useState(false);
  
  const [selectedMapIdx, setSelectedMapIdx] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('ipas');
  const [selectedClass, setSelectedClass] = useState('kelas_4_5');
  const [showArtifactPicker, setShowArtifactPicker] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [activeSlotIdx, setActiveSlotIdx] = useState(null);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCharId, setEditCharId] = useState(1);
  const [editArtifacts, setEditArtifacts] = useState([null, null, null]);
  const [showOnlineModal, setShowOnlineModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isOnlineLoading, setIsOnlineLoading] = useState(false);

  
  const [players, setPlayers] = useState([
    null, 
    null, 
    null, 
    null  
  ]);

  const [activeArtifactSlot, setActiveArtifactSlot] = useState(null);

  const [availableMaps, setAvailableMaps] = useState([]);

  useEffect(() => {
    
    setAvailableMaps(mapManager.getAllMaps());
  }, []);

  const handleAddPlayer = (idx) => {
    soundManager.play('click', 0.5);
    setActiveSlotIdx(idx);
    if (idx === 0) {
      
      setEditName(userName || 'Kamu');
      setEditCharId(1);
      setEditArtifacts([null, null, null]);
      setShowEditModal(true);
    } else {
      
      setShowPlayerModal(true);
    }
  };

  const handleArtifactClick = (slotIdx) => {
    soundManager.play('click', 0.5);
    setActiveArtifactSlot(slotIdx);
    setShowArtifactPicker(true);
  };

  const setPlayerAtSlot = (type) => {
    if (type === 'ai') {
      const newPlayers = [...players];
      const randomChar = Math.random() < 0.5 ? 1 : 2;
      newPlayers[activeSlotIdx] = { 
        id: `ai-${Date.now()}`, 
        name: `Bot ${activeSlotIdx + 1}`, 
        type: 'ai', 
        equippedArtifacts: [null, null, null],
        characterId: randomChar
      };
      setPlayers(newPlayers);
      setShowPlayerModal(false);
      soundManager.play('success', 0.4);
    } else {
      
      setShowPlayerModal(false);
      setEditName(`Teman ${activeSlotIdx + 1}`);
      setEditCharId(1);
      setEditArtifacts([null, null, null]);
      setShowEditModal(true);
      soundManager.play('click', 0.5);
    }
  };

  const handleInviteOnlineFriend = () => {
    setShowPlayerModal(false);
    setIsOnlineLoading(true);
    soundManager.play('click', 0.5);

    setTimeout(() => {
      setIsOnlineLoading(false);
      setWarningMessage('Fitur bermain online (Undang Teman) tidak tersedia di versi prototipe ini. Silakan gunakan Teman Selayar atau Lawan AI.');
      soundManager.play('error', 0.5);
    }, 2000); 
  };

  const handleRemovePlayer = (idx) => {
    soundManager.play('error', 0.3);
    const newPlayers = [...players];
    newPlayers[idx] = null;
    setPlayers(newPlayers);
  };

  const handleEditPlayer = (idx) => {
    
    if (!players[idx]) return;
    soundManager.play('click', 0.5);
    setActiveSlotIdx(idx);
    setEditName(players[idx].name);
    setEditCharId(players[idx].characterId || 1);
    setEditArtifacts(players[idx].equippedArtifacts || [null, null, null]);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      soundManager.play('error', 0.5);
      setWarningMessage('Nama tidak boleh kosong!');
      return;
    }
    const wasFirstSlotEmpty = !players[0];
    const newPlayers = [...players];
    newPlayers[activeSlotIdx] = {
      id: activeSlotIdx === 0 ? 'player-1' : (players[activeSlotIdx]?.id || `player-${Date.now()}`),
      name: editName.trim(),
      type: activeSlotIdx === 0 ? 'human' : (players[activeSlotIdx]?.type || 'local'),
      characterId: editCharId,
      equippedArtifacts: editArtifacts
    };
    setPlayers(newPlayers);
    setShowEditModal(false);
    soundManager.play('success', 0.4);

    if (wasFirstSlotEmpty && activeSlotIdx === 0) {
      setTimeout(() => {
        handleAddPlayer(1);
      }, 400);
    }
  };

  const handleStart = () => {
    const selectedMap = availableMaps[selectedMapIdx];
    if (!selectedMap) {
      soundManager.play('error', 0.5);
      setWarningMessage('Pilih peta petualangan terlebih dahulu!');
      return;
    }
    
    if (!players[0]) {
      soundManager.play('error', 0.5);
      setWarningMessage('Silakan pilih karakter utama Anda terlebih dahulu sebelum memulai!');
      return;
    }

    const activePlayers = players.filter(p => p !== null);
    if (activePlayers.length < 2) {
      soundManager.play('error', 0.5);
      setWarningMessage('Butuh minimal 2 penjelajah untuk memulai! Silakan tambahkan teman selayar, AI lawan, atau undang teman online.');
      return;
    }

    let computedThemeId = `${selectedSubject}_${selectedClass}`;
    if (!quizBanks[computedThemeId]) {
      computedThemeId = selectedSubject === 'sejarah' ? 'sejarah_umum' : 'ipas_4_5';
    }

    
    const equippedIds = players[0].equippedArtifacts.filter(a => a !== null).map(a => a.id);
    if (equippedIds.length > 0) {
      useStore.getState().consumeArtifacts(equippedIds);
    }

    
    useGameStore.getState().initGame(
      selectedMap.data, 
      players, 
      computedThemeId 
    );

    soundManager.play('whoosh', 0.6);
    setJelajahSubView('playing');
  };

  const availableCards = ownedArtifacts.map(owned => {
    const card = actionCards.find(c => c.id === owned.id);
    if (!card || (owned.count || 0) <= 0) return null;
    return { ...card, count: owned.count };
  }).filter(c => c !== null);

  return (
    <div className="lobby-container">
      
      <div className="table-texture" />
      <div className="table-vignette" />

      
      <header className="lobby-header">
        <button className="back-btn" onClick={() => setGameSubView('arcade')}>
          <ChevronLeft size={28} />
        </button>
        <div className="header-title">
          <span className="subtitle">LOBBY</span>
          <h2>JELAJAH NUSANTARA</h2>
        </div>
        <button className="lobby-help-btn" onClick={() => setHelpOpen(true)} title="Panduan">
          <HelpCircle size={24} />
        </button>
      </header>

      <main className="lobby-content-grid">
        
        <div className="start-btn-container">
          <button className="start-voyage-btn" onClick={handleStart}>
            <div className="btn-3d-face">
              <Play size={20} fill="white" />
              <span>MULAI PETUALANGAN!</span>
            </div>
            <div className="btn-3d-bottom" />
          </button>
        </div>

        <div className="right-column">
          
          <section className="lobby-section">
            <div className="section-title">
              <span>PESERTA</span>
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

        <div className="left-column">
          
          <section className="lobby-section">
            <div className="section-title">
              <span>PILIH PETA PETUALANGAN</span>
            </div>
            <div className="maps-grid">
              {availableMaps.map((map, idx) => (
                <MapCard 
                  key={map.id} 
                  map={map} 
                  isSelected={selectedMapIdx === idx}
                  onClick={() => {
                    soundManager.play('click', 0.5);
                    setSelectedMapIdx(idx);
                  }}
                />
              ))}
            </div>
          </section>

          
          <section className="lobby-section">
            <div className="section-title">
              <span>PILIH TEMA KUIS</span>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '8px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={14} /> MATA PELAJARAN
                </div>
                <select 
                  className="custom-select-3d" 
                  value={selectedSubject} 
                  onChange={e => setSelectedSubject(e.target.value)}
                >
                  {availableSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '8px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} /> FILTER KELAS
                </div>
                <select 
                  className="custom-select-3d" 
                  value={selectedClass} 
                  onChange={e => setSelectedClass(e.target.value)}
                >
                  {availableClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        </div>
      </main>

      
      {showArtifactPicker && (
        <ArtifactPicker 
          artifacts={availableCards}
          selectedId={editArtifacts[activeArtifactSlot]?.id}
          onSelect={(art) => {
            const isAlreadyEquipped = editArtifacts.some(a => a?.id === art.id);
            if (isAlreadyEquipped) {
              soundManager.play('error', 0.5);
              return;
            }
            const newEquipped = [...editArtifacts];
            newEquipped[activeArtifactSlot] = art;
            setEditArtifacts(newEquipped);
            setShowArtifactPicker(false);
            soundManager.play('success', 0.4);
          }}
          onClose={() => setShowArtifactPicker(false)}
        />
      )}

      {showPlayerModal && (
        <div className="modal-overlay" onClick={() => setShowPlayerModal(false)}>
          <div className="player-option-modal" onClick={e => e.stopPropagation()}>
            <h3>Tambah Pemain</h3>
            <div className="options-grid">
              <button className="option-btn" onClick={() => setPlayerAtSlot('local')}>
                <div className="opt-icon"><Users size={32} /></div>
                <span>Teman Selayar</span>
                <p>Bermain berdua dalam satu HP</p>
              </button>
              <button className="option-btn" onClick={handleInviteOnlineFriend}>
                <div className="opt-icon"><UserPlus size={32} /></div>
                <span>Undang Teman</span>
                <p>Main online bersama teman</p>
              </button>
              <button className="option-btn" onClick={() => setPlayerAtSlot('ai')}>
                <div className="opt-icon"><Cpu size={32} /></div>
                <span>Lawan AI (Bot)</span>
                <p>Tantang kecerdasan komputer</p>
              </button>
            </div>
            <button className="cancel-btn" onClick={() => setShowPlayerModal(false)}>Batal</button>
          </div>
        </div>
      )}

      {showOnlineModal && (
        <OnlinePlayersModal 
          onClose={() => setShowOnlineModal(false)}
          onInvite={(player) => {
            setShowOnlineModal(false);
            const newPlayers = [...players];
            newPlayers[activeSlotIdx] = {
              id: player.id || `online-${Date.now()}`,
              name: player.name || 'Teman Online',
              type: 'online',
              equippedArtifacts: [null, null, null],
              characterId: Math.random() < 0.5 ? 1 : 2
            };
            setPlayers(newPlayers);
            soundManager.play('success', 0.4);
          }}
        />
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="player-option-modal" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <h3>Edit Peserta</h3>
            
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '6px', display: 'block', color: isDark ? '#bfcdff' : '#6B7280' }}>NAMA PESERTA</label>
              {players[activeSlotIdx]?.type === 'local' ? (
                <input 
                  type="text" 
                  className="custom-select-3d" 
                  style={{ cursor: 'text', padding: '10px' }}
                  value={editName} 
                  onChange={e => setEditName(e.target.value)} 
                  maxLength={12}
                />
              ) : (
                <div style={{ fontSize: '1rem', fontWeight: 955, padding: '10px', background: isDark ? '#1a0a3a' : '#F3F4F6', borderRadius: '12px', border: '3px solid ' + (isDark ? '#2e1957' : '#E5E7EB'), color: isDark ? '#FFF' : '#1F2937' }}>
                  {editName}
                </div>
              )}
            </div>

            <label style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '8px', display: 'block', textAlign: 'left', color: isDark ? '#bfcdff' : '#6B7280' }}>PILIH KARAKTER</label>
            <div className="char-selection-grid" style={{ marginBottom: '12px' }}>
              <div 
                className={`char-card ${editCharId === 1 ? 'selected' : ''}`}
                style={{ padding: '8px' }}
                onClick={() => setEditCharId(1)}
              >
                <div className="char-preview-box" style={{ height: '60px' }}>
                  <img src={character1iso} alt="Karakter 1" className="char-preview-img" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <span className="char-name">Riri (K1)</span>
              </div>
              <div 
                className={`char-card ${editCharId === 2 ? 'selected' : ''}`}
                style={{ padding: '8px' }}
                onClick={() => setEditCharId(2)}
              >
                <div className="char-preview-box" style={{ height: '60px' }}>
                  <img src={character2iso} alt="Karakter 2" className="char-preview-img" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <span className="char-name">Marsha (K2)</span>
              </div>
            </div>

            
            <div style={{
              background: isDark ? '#1a0d3b' : '#F9FAFB',
              border: `2px solid ${isDark ? '#2e1957' : '#E5E7EB'}`,
              borderRadius: '16px',
              padding: '10px 12px',
              marginBottom: '16px',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, color: isDark ? '#bfcdff' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                📊 STATS JELAJAH: <span style={{ color: isDark ? '#FFF' : '#1F2937', fontWeight: 955 }}>{editCharId === 1 ? 'RIRI' : 'MARSHA'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                <div style={{ background: isDark ? '#25134f' : '#FFFFFF', border: `1.5px solid ${isDark ? '#3e2475' : '#E5E7EB'}`, borderRadius: '10px', padding: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#9CA3AF' }}>🗡️ SERANG</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#FF4B4B', marginTop: '1px' }}>
                    {editCharId === 1 ? '+2' : '+0'}
                  </div>
                </div>
                <div style={{ background: isDark ? '#25134f' : '#FFFFFF', border: `1.5px solid ${isDark ? '#3e2475' : '#E5E7EB'}`, borderRadius: '10px', padding: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#9CA3AF' }}>🛡️ BERTAHAN</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#58CC02', marginTop: '1px' }}>
                    {editCharId === 1 ? '+1' : '+2'}
                  </div>
                </div>
                <div style={{ background: isDark ? '#25134f' : '#FFFFFF', border: `1.5px solid ${isDark ? '#3e2475' : '#E5E7EB'}`, borderRadius: '10px', padding: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#9CA3AF' }}>💨 LINCAH</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: editCharId === 1 ? '#FF4B4B' : '#1CB0F6', marginTop: '1px' }}>
                    {editCharId === 1 ? '-1' : '+1'}
                  </div>
                </div>
              </div>
            </div>

            
            <label style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '8px', display: 'block', textAlign: 'left', color: isDark ? '#bfcdff' : '#6B7280' }}>BEKAL KARTU AKSI (MAKS 3)</label>
            <div className="artifact-slots-row" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
              {editArtifacts.map((art, idx) => (
                <div 
                  key={idx} 
                  className={`artifact-mini-slot ${art ? 'filled' : ''}`}
                  onClick={() => handleArtifactClick(idx)}
                  style={{ position: 'relative', flex: 1, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '14px', border: '2px dashed #D1D5DB', overflow: 'visible' }}
                >
                  {art ? (
                    <>
                      <div className="art-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span className="art-icon-small" style={{ fontSize: '1.4rem' }}>{art.icon}</span>
                        <span className="art-label" style={{ fontSize: '0.55rem', fontWeight: 955, textAlign: 'center', marginTop: '2px' }}>{art.name}</span>
                      </div>
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
                          position: 'absolute', top: '-6px', right: '-6px',
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
                    <div className="art-add">
                      <Plus size={16} color="#AFAFAF" />
                    </div>
                  )}
                </div>
              ))}
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

      {isOnlineLoading && (
        <div className="modal-overlay" style={{ zIndex: 5000, background: 'rgba(0,0,0,0.85)' }}>
          <div className="player-option-modal" style={{ maxWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <div className="loading-spinner-3d" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: isDark ? 'white' : '#1F2937' }}>Menghubungkan...</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: isDark ? '#bfcdff' : '#6B7280' }}>Mengirim undangan bermain online</p>
          </div>
        </div>
      )}

      <JelajahHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      <style jsx>{`
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

        .lobby-container {
          position: absolute; inset: 0; 
          background: ${isDark ? 'radial-gradient(circle at center, #3F1D7E 0%, #150630 100%)' : 'radial-gradient(circle at center, #F4F7FC 0%, #C4D3E9 100%)'};
          display: flex; flex-direction: column; z-index: 10;
          font-family: 'Outfit', sans-serif; overflow: hidden;
          color: ${isDark ? 'white' : '#1F2937'};
          transition: background 0.3s ease, color 0.3s ease;
        }

        /* PREMIUM VIBRANT BACKGROUND */
        .table-texture {
          position: absolute; inset: 0; opacity: ${isDark ? 0.15 : 0.08};
          background-image: radial-gradient(${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.2)'} 1px, transparent 0);
          background-size: 24px 24px;
          pointer-events: none;
        }
        .table-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 30%, transparent 10%, ${isDark ? 'rgba(21, 6, 48, 0.9)' : 'rgba(196, 211, 233, 0.4)'} 100%);
          pointer-events: none;
        }

        .lobby-header {
          margin: 15px 15px 5px 15px;
          padding: 15px 25px; 
          background: ${isDark ? '#2a1662' : '#FFFFFF'};
          border: 4px solid ${isDark ? '#fbd22b' : '#1CB0F6'}; 
          border-radius: 24px;
          box-shadow: inset 0 4px 0 ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'}, 0 8px 0 ${isDark ? '#120730' : '#147BB0'};
          z-index: 10; 
          display: flex; align-items: center; justify-content: space-between;
        }
        .header-title { text-align: center; flex: 1; }
        .subtitle { 
          font-size: 0.7rem; font-weight: 955; 
          color: white; background: linear-gradient(135deg, #FF4B4B, #C0392B); 
          padding: 4px 12px; border-radius: 8px; letter-spacing: 2px; 
          margin-bottom: 4px; display: inline-block; 
          box-shadow: 0 3px 0 #8c1c11; border: 2px solid white;
          text-transform: uppercase; 
        }
        .header-title h2 { 
          margin: 0; font-size: 1.5rem; font-weight: 950; 
          color: ${isDark ? '#FFD700' : '#1CB0F6'}; 
          text-shadow: ${isDark ? '0 3px 0 #000, 0 6px 10px rgba(0,0,0,0.5)' : '0 2px 0 rgba(255,255,255,0.8), 0 3px 6px rgba(0,0,0,0.1)'}; 
          letter-spacing: 2px; 
        }
        
        .back-btn, .lobby-help-btn {
          width: 44px; height: 44px; 
          background: #1CB0F6;
          border: 3px solid #1CB0F6; border-bottom: 6px solid #147BB0; border-radius: 14px; 
          color: white; 
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          transition: all 0.1s; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .back-btn:hover, .lobby-help-btn:hover { background: #1899D6; }
        .back-btn:active, .lobby-help-btn:active { transform: translateY(3px); border-bottom-width: 3px; }
        
        .status-badge {
          background: linear-gradient(135deg, #f4c265, #FF5200); color: white; padding: 8px 16px; border-radius: 50px;
          font-weight: 955; font-size: 0.7rem; letter-spacing: 1.5px;
          box-shadow: 0 4px 0 ${isDark ? '#a03300' : '#d29600'}, 0 8px 15px ${isDark ? 'rgba(255, 150, 0, 0.4)' : 'rgba(244, 194, 101, 0.2)'};
          border: 2px solid rgba(255,255,255,0.3);
        }

        .lobby-content-grid { 
          flex: 1; overflow-y: auto; padding: 25px; z-index: 5;
          padding-bottom: 120px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 30px;
        }
        @media (max-width: 900px) {
          .lobby-content-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 15px;
          }
        }
        .left-column, .right-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .start-btn-container {
          grid-column: 1 / -1;
          margin-top: 10px;
          margin-bottom: 15px;
          padding: 0;
        }
        @media (max-width: 900px) {
          .start-btn-container {
            margin-bottom: 10px;
          }
        }
        
        .lobby-section { 
          background: ${isDark ? '#23124d' : '#FFFFFF'};
          border: 4px solid ${isDark ? '#381b7e' : '#E5E7EB'};
          border-radius: 28px;
          padding: 24px;
          margin-bottom: 40px;
          box-shadow: inset 0 3px 0 ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'}, 0 8px 0 ${isDark ? '#11052b' : '#D1D5DB'};
          position: relative;
        }
         .section-title { 
          display: flex; align-items: center; gap: 12px; margin-bottom: 20px; 
          background: ${isDark ? 'linear-gradient(to bottom, #ec407a, #d81b60)' : '#1CB0F6'};
          border: 3px solid ${isDark ? '#f48fb1' : '#1CB0F6'};
          border-bottom: 6px solid ${isDark ? '#880e4f' : '#147BB0'};
          padding: 10px 18px; border-radius: 18px; 
          box-shadow: 0 6px 12px rgba(0,0,0,0.25);
          width: fit-content;
          margin-top: -42px;
          margin-left: -5px;
        }
        .section-title span { font-weight: 955; font-size: 0.9rem; color: white; letter-spacing: 1.5px; text-shadow: 0 2px 0 rgba(0,0,0,0.5); }
        .section-title svg { filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)); color: white !important; }


        .maps-grid {
          display: flex;
          overflow-x: auto;
          gap: 15px;
          padding-bottom: 12px;
          padding-top: 4px;
          scrollbar-width: none;
        }
        .maps-grid::-webkit-scrollbar {
          display: none;
        }
        
        .map-placeholder-card {
          flex-shrink: 0;
          width: 140px;
          height: 191px;
          border-radius: 20px;
          border: 3px dashed ${isDark ? '#4b2d97' : '#E5E5E5'};
          background: ${isDark ? '#170a35' : '#F9FAFB'};
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .map-placeholder-card span {
          font-size: 0.8rem;
          font-weight: 900;
          color: ${isDark ? '#7a5ec5' : '#9CA3AF'};
          text-align: center;
        }
        
        /* MapCard Global Override */
        :global(.map-card) {
          flex-shrink: 0 !important;
          width: 140px !important;
          background: ${isDark ? 'linear-gradient(180deg, #3855eb 0%, #1b2ea1 100%)' : '#FFFFFF'} !important;
          border: 4px solid ${isDark ? '#fbd22b' : '#E5E7EB'} !important;
          border-radius: 24px !important;
          box-shadow: 0 8px 0 ${isDark ? '#111b5e' : '#D1D5DB'}, 0 12px 20px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)'} !important;
          color: ${isDark ? 'white' : '#1F2937'} !important;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        :global(.map-card:hover) {
          transform: translateY(-4px) !important;
        }
        :global(.map-card.selected) {
          border-color: #58CC02 !important;
          box-shadow: 0 8px 0 #2c6601, 0 12px 25px ${isDark ? 'rgba(88,204,2,0.4)' : 'rgba(88,204,2,0.2)'} !important;
        }
        :global(.map-image) {
          border-radius: 18px 18px 0 0 !important;
        }
        :global(.map-info h3) {
          color: ${isDark ? 'white' : '#1F2937'} !important;
          font-weight: 955 !important;
          text-shadow: ${isDark ? '0 2px 0 rgba(0,0,0,0.5)' : 'none'} !important;
        }
        :global(.map-info p) {
          color: ${isDark ? '#bfcdff' : '#6B7280'} !important;
          font-weight: 800 !important;
        }

        .players-grid { 
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px; 
          background: ${isDark ? '#170a35' : '#F9FAFB'}; 
          padding: 24px; border-radius: 24px; 
          border: 3px solid ${isDark ? '#2f166b' : '#E5E7EB'};
          box-shadow: inset 0 6px 12px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'};
          overflow: visible !important;
        }

        /* PlayerSlot Global Override */
        :global(.slot-empty) {
          background: ${isDark ? '#25134f' : '#FFFFFF'} !important;
          border: 3px dashed ${isDark ? '#4b2d97' : '#D1D5DB'} !important;
          border-radius: 20px !important;
          padding: 15px !important;
          box-shadow: inset 0 4px 8px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'} !important;
        }
        :global(.slot-empty:hover) {
          border-color: #1CB0F6 !important;
        }
        :global(.add-btn-circle) {
          border-color: ${isDark ? '#4b2d97' : '#D1D5DB'} !important;
          background: ${isDark ? '#1a0a3a' : '#F3F4F6'} !important;
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

        /* ARTIFACT MINI SLOTS */
        .artifact-slots-row { display: flex; gap: 15px; }
        .artifact-mini-slot {
          flex: 1; aspect-ratio: 1; background: ${isDark ? '#170a35' : '#FFFFFF'};
          border: 3px dashed ${isDark ? '#4b2d97' : '#D1D5DB'}; border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); overflow: hidden;
          box-shadow: inset 0 4px 8px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)'};
        }
        .artifact-mini-slot:hover { transform: scale(1.05); border-color: #1CB0F6; background: ${isDark ? '#1f0d47' : '#F9FAFB'}; }
        .artifact-mini-slot.filled {
          background: ${isDark ? 'linear-gradient(180deg, #3855eb 0%, #1b2ea1 100%)' : '#FFFFFF'}; 
          border: 4px solid ${isDark ? '#fbd22b' : '#E5E7EB'}; 
          box-shadow: 0 6px 0 ${isDark ? '#111b5e' : '#D1D5DB'}, 0 10px 15px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)'}; 
          border-style: solid;
        }
        .artifact-mini-slot.filled:active { transform: scale(0.95); }

        .custom-select-3d {
          width: 100%;
          padding: 16px;
          background: ${isDark ? '#25134f' : '#FFFFFF'};
          border: 3px solid ${isDark ? '#fbd22b' : '#1CB0F6'};
          border-bottom: 6px solid ${isDark ? '#d29600' : '#147BB0'};
          border-radius: 16px;
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          color: ${isDark ? 'white' : '#1F2937'};
          font-size: 1rem;
          appearance: none;
          outline: none;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          transition: all 0.2s;
        }
        .custom-select-3d:focus, .custom-select-3d:hover {
          background: ${isDark ? '#2e1763' : '#F9FAFB'};
          border-color: ${isDark ? '#fbd22b' : '#1CB0F6'};
        }
        
        .art-content { display: flex; flex-direction: column; align-items: center; padding: 5px; }
        .art-icon-small { font-size: 2.2rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2)); }
        .art-label { 
          font-size: 0.65rem; font-weight: 955; color: ${isDark ? 'white' : '#1F2937'} !important; 
          text-align: center; line-height: 1.2; margin-top: 6px;
          text-shadow: ${isDark ? '0 2px 0 rgba(0,0,0,0.5)' : 'none'};
        }


        .start-voyage-btn {
          width: 100%; height: 58px; position: relative; background: none; border: none; cursor: pointer;
        }
        .btn-3d-face {
          position: absolute; inset: 0; background: linear-gradient(to bottom, #58CC02, #4BAF02); 
          border: none;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          color: white !important; font-weight: 955; font-size: 1.1rem; z-index: 2;
          transition: transform 0.1s;
          text-shadow: 0 2px 0 #2c6601;
          box-shadow: inset 0 3px 0 rgba(255,255,255,0.2), 0 4px 10px rgba(0,0,0,0.15);
        }
        .btn-3d-face span {
          color: white !important;
        }
        .btn-3d-bottom { position: absolute; inset: 0; bottom: -8px; background: #2c6601; border-radius: 20px; z-index: 1; }
        .start-voyage-btn:active .btn-3d-face { transform: translateY(5px); }
        .start-voyage-btn:active .btn-3d-bottom { bottom: -3px; }

        /* CHARACTER SELECTION CARDS */
        .char-selection-grid { display: flex; gap: 15px; }
        .char-card {
          flex: 1; 
          background: ${isDark ? 'linear-gradient(180deg, #3855eb 0%, #1b2ea1 100%)' : '#FFFFFF'};
          border: 4px solid ${isDark ? '#fbd22b' : '#E5E7EB'};
          border-radius: 24px; 
          padding: 15px; display: flex; flex-direction: column;
          align-items: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 0 ${isDark ? '#111b5e' : '#D1D5DB'}, 0 12px 20px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)'};
          color: ${isDark ? 'white' : '#1F2937'};
        }
        .char-card:hover { 
          transform: translateY(-4px); 
          border-color: #58CC02; 
          box-shadow: 0 8px 0 #2c6601, 0 12px 25px ${isDark ? 'rgba(88, 204, 2, 0.3)' : 'rgba(88, 204, 2, 0.1)'}; 
        }
        .char-card.selected {
          border-color: #58CC02;
          box-shadow: 0 8px 0 #2c6601, 0 12px 25px ${isDark ? 'rgba(88, 204, 2, 0.4)' : 'rgba(88, 204, 2, 0.15)'};
        }
        .char-preview-box {
          background: ${isDark ? '#13227a' : '#F3F4F6'};
          border: 3px solid ${isDark ? '#fbd22b' : '#E5E7EB'};
          border-radius: 18px;
          width: 90%; height: 100px; display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px; overflow: visible;
          box-shadow: inset 0 4px 8px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'};
        }
        .char-preview-img { width: 100%; height: 100%; object-fit: contain; }
        .char-name { font-weight: 955; font-size: 0.85rem; letter-spacing: 0.5px; text-shadow: ${isDark ? '0 2px 0 rgba(0,0,0,0.5)' : 'none'}; }

        /* PLAYER MODAL */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000; animation: fadeIn 0.3s;
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
        .option-btn span { font-weight: 955; color: ${isDark ? 'white' : '#1F2937'}; font-size: 1rem; text-shadow: ${isDark ? '0 2px 0 rgba(0,0,0,0.5)' : 'none'}; }
        .option-btn p { font-size: 0.75rem; color: ${isDark ? '#bfcdff' : '#6B7280'}; font-weight: 800; margin-top: 4px; }
        
        .cancel-btn {
          background: none; border: none; font-weight: 955; color: #FF4B4B;
          font-size: 0.9rem; cursor: pointer;
        }

        @media (max-width: 600px) {
          .lobby-header {
            margin: 6px 6px 0px 6px;
            padding: 8px 12px;
            border-radius: 14px;
            border-width: 3px;
            box-shadow: 0 4px 0 ${isDark ? '#120730' : '#147BB0'};
          }
          .header-title h2 {
            font-size: 1rem;
            letter-spacing: 1px;
          }
          .back-btn, .lobby-help-btn {
            width: 34px;
            height: 34px;
            border-radius: 8px;
          }
          .lobby-content-grid {
            padding: 8px;
            gap: 10px;
            padding-bottom: 80px;
          }
          .lobby-section {
            padding: 22px 10px 10px 10px;
            margin-bottom: 16px;
            border-radius: 16px;
            box-shadow: 0 4px 0 ${isDark ? '#11052b' : '#D1D5DB'};
          }
          .section-title {
            margin-top: -36px;
            padding: 4px 10px;
            border-radius: 10px;
            border-bottom-width: 4px;
            margin-bottom: 8px;
          }
          .section-title span {
            font-size: 0.7rem;
            letter-spacing: 1px;
          }
          .maps-grid {
            display: flex;
            justify-content: flex-start;
            flex-wrap: nowrap;
            gap: 8px;
            padding-bottom: 8px;
          }
          .map-placeholder-card {
            width: 100px !important;
            height: 115px !important;
            border-radius: 16px;
            border-width: 2.5px;
          }
          .map-placeholder-card span {
            font-size: 0.65rem;
          }
          :global(.map-card) {
            flex-shrink: 0 !important;
            width: 100px !important;
            max-width: 100px !important;
            min-width: 100px !important;
            border-radius: 16px !important;
            border-width: 3px !important;
            box-shadow: 0 4px 0 ${isDark ? '#111b5e' : '#D1D5DB'} !important;
          }
          :global(.map-image) {
            height: 75px !important;
          }
          .players-grid {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            padding: 10px;
            gap: 8px;
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
          .char-card {
            border-radius: 16px;
            padding: 8px;
            border-width: 3px;
            box-shadow: 0 4px 0 ${isDark ? '#111b5e' : '#D1D5DB'};
          }
          .char-preview-box {
            height: 60px;
            border-radius: 12px;
            margin-bottom: 4px;
          }
          .char-name {
            font-size: 0.7rem;
          }
          .artifact-mini-slot {
            border-radius: 14px;
          }
          .custom-select-3d {
            padding: 8px;
            border-radius: 10px;
            font-size: 0.8rem;
            border-bottom-width: 4px;
          }
          .start-voyage-btn {
            height: 44px;
          }
          .btn-3d-face {
            border-radius: 12px;
            font-size: 0.9rem;
          }
          .btn-3d-bottom {
            border-radius: 12px;
            bottom: -5px;
          }
          .start-voyage-btn:active .btn-3d-face {
            transform: translateY(3px);
          }
          .start-btn-container {
            margin-top: 2px;
            margin-bottom: 5px;
          }
          
          /* COMPACT PLAYER OPTION MODAL FOR MOBILE */
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
            display: none !important; /* Hide description to make it compact */
          }
          .cancel-btn {
            font-size: 0.8rem !important;
          }
        }
 
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
