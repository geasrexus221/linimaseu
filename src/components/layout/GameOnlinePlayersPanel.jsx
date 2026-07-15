import React, { useState } from 'react';
import { Users, Search, Circle, Send } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { soundManager } from '../../utils/SoundManager';

// Mock Online Players - In real app, this would come from a websocket/API
const MOCK_ONLINE_PLAYERS = [
  { id: 'u1', name: 'Ahmad_Gamer', avatar: '👨‍🎓', status: 'Lobby', level: 12 },
  { id: 'u2', name: 'Siti_Sejarah', avatar: '👩‍🏫', status: 'Bermain', level: 25 },
  { id: 'u3', name: 'Budi_Adventure', avatar: '🤠', status: 'Lobby', level: 8 },
  { id: 'u4', name: 'Lina_Pintar', avatar: '👧', status: 'Lobby', level: 15 },
  { id: 'u5', name: 'Dedi_Kuat', avatar: '👨‍🌾', status: 'Bermain', level: 10 },
];

export default function GameOnlinePlayersPanel() {
  const { userName } = useStore();
  const [search, setSearch] = useState('');
  const [invitedIds, setInvitedIds] = useState([]);

  const filteredPlayers = MOCK_ONLINE_PLAYERS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = (id) => {
    if (invitedIds.includes(id)) return;
    
    soundManager.play('click', 0.5);
    setInvitedIds([...invitedIds, id]);
    
    // Simulate sending invite
    setTimeout(() => {
      soundManager.play('success', 0.4);
    }, 500);
  };

  return (
    <div className="online-players-panel">
      <div className="panel-header">
        <div className="header-icon">
          <Users size={20} color="#1CB0F6" />
        </div>
        <div className="header-text">
          <h4>Penjelajah Online</h4>
          <span className="online-count">{MOCK_ONLINE_PLAYERS.length} Aktif</span>
        </div>
      </div>

      <div className="search-box">
        <Search size={16} color="#AFAFAF" />
        <input 
          type="text" 
          placeholder="Cari teman..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="players-list-scroll">
        <label className="section-label">PILIH TEMAN UNTUK DIAJAK</label>
        
        {filteredPlayers.map(player => (
          <div key={player.id} className="player-invite-card">
            <div className="player-avatar-mini">{player.avatar}</div>
            <div className="player-info-mini">
              <span className="p-name">{player.name}</span>
              <div className="p-meta">
                <Circle size={8} fill={player.status === 'Lobby' ? '#58CC02' : '#f4c265'} color="transparent" />
                <span>{player.status} • Lv.{player.level}</span>
              </div>
            </div>
            
            <button 
              className={`invite-btn-mini ${invitedIds.includes(player.id) ? 'sent' : ''}`}
              onClick={() => handleInvite(player.id)}
              disabled={player.status !== 'Lobby' || invitedIds.includes(player.id)}
            >
              {invitedIds.includes(player.id) ? 'Terkirim' : <Send size={14} />}
            </button>
          </div>
        ))}

        {filteredPlayers.length === 0 && (
          <div className="empty-state">
            <p>Tidak ada teman ditemukan</p>
          </div>
        )}
      </div>

      <div className="panel-footer-tip">
        <p>💡 Pemain di "Lobby" lebih mudah menerima ajakan bermain.</p>
      </div>

      <style jsx>{`
        .online-players-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 20px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 5px;
        }
        .header-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: rgba(28, 176, 246, 0.1);
          display: flex; align-items: center; justify-content: center;
        }
        .header-text h4 { margin: 0; font-size: 1rem; font-weight: 900; color: var(--text-color); }
        .online-count { font-size: 0.7rem; font-weight: 800; color: #58CC02; text-transform: uppercase; }

        .search-box {
          display: flex; align-items: center; gap: 10px;
          background: var(--background-color);
          border: 2px solid var(--border-color);
          border-radius: 14px; padding: 8px 12px;
        }
        .search-box input {
          border: none; background: none; outline: none;
          font-family: inherit; font-size: 0.85rem; font-weight: 700;
          color: var(--text-color); width: 100%;
        }

        .players-list-scroll {
          flex: 1; overflow-y: auto;
          display: flex; flex-direction: column; gap: 10px;
          padding-right: 5px;
        }
        .players-list-scroll::-webkit-scrollbar { width: 4px; }
        .players-list-scroll::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }

        .section-label { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); letter-spacing: 0.5px; }

        .player-invite-card {
          display: flex; align-items: center; gap: 12px;
          padding: 12px; background: var(--card-bg);
          border: 2px solid var(--border-color); border-radius: 16px;
          transition: transform 0.2s;
        }
        .player-invite-card:hover { transform: translateX(5px); border-color: var(--secondary-color); }

        .player-avatar-mini { font-size: 1.5rem; }
        .player-info-mini { flex: 1; display: flex; flex-direction: column; }
        .p-name { font-size: 0.85rem; font-weight: 800; color: var(--text-color); }
        .p-meta { display: flex; align-items: center; gap: 5px; font-size: 0.65rem; font-weight: 700; color: var(--text-muted); }

        .invite-btn-mini {
          width: 34px; height: 34px; border-radius: 10px;
          background: var(--secondary-color); color: white;
          border: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          box-shadow: 0 3px 0 #1899D6; transition: all 0.1s;
        }
        .invite-btn-mini:active { transform: translateY(2px); box-shadow: 0 1px 0 #1899D6; }
        .invite-btn-mini:disabled { background: var(--border-color); box-shadow: none; cursor: not-allowed; }
        
        .invite-btn-mini.sent {
          width: auto; padding: 0 10px; background: #58CC02;
          font-size: 0.65rem; font-weight: 900; box-shadow: 0 3px 0 #46A302;
        }

        .empty-state { text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.8rem; font-weight: 700; }
        .panel-footer-tip { padding: 12px; background: rgba(88, 204, 2, 0.05); border-radius: 12px; border: 1px dashed #58CC02; }
        .panel-footer-tip p { margin: 0; font-size: 0.65rem; font-weight: 700; color: #2B7D00; line-height: 1.4; }
      `}</style>
    </div>
  );
}
