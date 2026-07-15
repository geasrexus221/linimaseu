import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useStore } from '../../store/useStore';
import { Dices, ScrollText, Briefcase, Star, User, History, Zap } from 'lucide-react';
import Dice3D from '../common/Dice3D';

/**
 * JelajahGameplayPanel: The unified sidebar for Jelajah Nusantara gameplay.
 * Consolidates status, logs, and inventory into a single right-panel view.
 */
export default function JelajahGameplayPanel() {
  const [activeTab, setActiveTab] = useState('status');
  
  // PERFORMANCE: Use selective picking to prevent unnecessary re-renders
  const players = useGameStore(state => state.players);
  const turnIdx = useGameStore(state => state.turnIdx);
  const phase = useGameStore(state => state.phase);
  const diceValue = useGameStore(state => state.diceValue);
  const gameLogs = useGameStore(state => state.gameLogs);
  const rollDice = useGameStore(state => state.rollDice);
  const startMoving = useGameStore(state => state.startMoving);
  const useCard = useGameStore(state => state.useCard);
  const setInventoryOpen = useGameStore(state => state.setInventoryOpen);
  const toastKoinCukup = useGameStore(state => state.toastKoinCukup);
  
  const userName = useStore(state => state.userName);

  const currentPlayer = players[turnIdx];
  const isMyTurn = currentPlayer?.name === userName || currentPlayer?.type === 'human' || currentPlayer?.type === 'local';

  const nextCost = currentPlayer?.artifacts === 0 ? 200 : currentPlayer?.artifacts === 1 ? 400 : 600;

  // Helper to render avatar correctly (image vs emoji)
  const renderAvatar = (avatar, color) => {
    const isUrl = avatar?.startsWith('http') || avatar?.startsWith('/');
    return (
      <div className="avatar-circle" style={{ background: color || '#3b82f6' }}>
        {isUrl ? <img src={avatar} alt="P" /> : <span>{avatar || '👤'}</span>}
      </div>
    );
  };

  return (
    <div className="gameplay-sidebar-panel">
      {/* Toast Notification Option 2 */}
      {toastKoinCukup && (
        <div className="coin-toast-alert">
          <span className="toast-icon">🪙</span>
          <div className="toast-body">
            <strong>KOIN EMAS CUKUP!</strong>
            <span>Pergilah ke Markas untuk mengisi Peti Harta Karun!</span>
          </div>
        </div>
      )}

      {/* Quick Stats Bar - ALWAYS VISIBLE */}
      <div className="quick-stats-bar">
        <div className="qs-item tekad" title="Tekad (Daya Tahan)">
          <div className="qs-icon"><Zap size={14} fill="currentColor" /></div>
          <div className="qs-val">
            <div className="v-row">
              <span className="v">{currentPlayer?.tekad || 0}</span>
              <span className="m">/100</span>
            </div>
            <span className="l">Tekad</span>
          </div>
        </div>
        <div className="qs-item koin" title="Koin Emas (Bawa ke Markas untuk Peti)">
          <div className="qs-icon">🪙</div>
          <div className="qs-val">
            <div className="v-row">
              <span className="v">{currentPlayer?.koin || 0}</span>
              {currentPlayer?.artifacts < 3 && <span className="m">/{nextCost}</span>}
            </div>
            <span className="l">Koin Emas</span>
          </div>
        </div>
        <div className="qs-item peti" title="Peti Harta Karun Terisi (Target Menang)">
          <div className="qs-icon">📦</div>
          <div className="qs-val">
            <div className="v-row">
              <span className="v">{currentPlayer?.artifacts || 0}</span>
              <span className="m">/3</span>
            </div>
            <span className="l">Peti Harta</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="panel-tabs">
        <button 
          className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          <User size={16} />
          <span>Status</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'log' ? 'active' : ''}`}
          onClick={() => setActiveTab('log')}
        >
          <History size={16} />
          <span>Log</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tas' ? 'active' : ''}`}
          onClick={() => setActiveTab('tas')}
        >
          <Briefcase size={16} />
          <span>Tas</span>
        </button>
      </div>

      <div className="panel-content-scroll">
        {activeTab === 'status' && (
          <div className="status-tab">
            {/* Minimal Turn Indicator */}
            <div className="turn-indicator-bar">
              <div className={`indicator-pill ${isMyTurn ? 'me' : 'other'}`}>
                <div className="pulse-dot"></div>
                <span>
                  {!currentPlayer 
                    ? 'MENUNGGU PERMAINAN...' 
                    : isMyTurn 
                      ? 'GILIRAN ANDA' 
                      : `GILIRAN: ${currentPlayer.name}`}
                </span>
              </div>
            </div>

            {/* Leaderboard / Opponents */}
            <div className="opponents-section">
              <div className="section-label">PERINGKAT PEMAIN</div>
              <div className="opponents-list">
                {players.map((p, idx) => (
                  <div key={p.id} className={`opponent-item ${idx === turnIdx ? 'active' : ''}`}>
                    <div className="rank">#{idx + 1}</div>
                    {renderAvatar(p.avatar, p.color)}
                    <div className="o-info">
                      <span className="o-name">{p.name}</span>
                      <span className="o-sub">Petak {p.position || 0}</span>
                    </div>
                    <div className="o-score" title="Peti Harta Terisi">
                      <span>📦</span>
                      <span>{p.artifacts || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'log' && (
          <div className="log-tab">
            <div className="section-label">RIWAYAT PERJALANAN</div>
            <div className="logs-list">
              {gameLogs.length > 0 ? (
                gameLogs.map((log, i) => (
                  <div key={i} className="log-entry">
                    <div className="log-icon"><ScrollText size={14} /></div>
                    <div className="log-body">
                      <p className="log-msg">{log}</p>
                      <span className="log-time">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">Belum ada kejadian...</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tas' && (
          <div className="tas-tab">
            <div className="section-label">PENGATURAN ITEM</div>
            
            <button className="open-full-inventory-btn" onClick={() => setInventoryOpen(true)}>
              <div className="btn-aura"></div>
              <Briefcase size={24} />
              <div className="btn-text">
                <span className="main-t">BUKA TAS</span>
                <span className="sub-t">Gunakan Item & Artefak</span>
              </div>
            </button>

            <div className="mini-item-list">
              <div className="section-label">DAFTAR ITEM ({currentPlayer?.inventory?.length || 0}/3)</div>
              {currentPlayer?.inventory?.length > 0 ? (
                currentPlayer.inventory.map((item, i) => (
                  <div key={item.instanceId || i} className="mini-item-row">
                    <div className="m-main-info">
                      <div className="m-icon-box">
                        <span className="m-icon">{item.icon || '📦'}</span>
                      </div>
                      <div className="m-details">
                        <span className="m-name">{item.name}</span>
                        <span className="m-desc">{item.description || 'Efek misterius...'}</span>
                      </div>
                    </div>
                    
                    <div className="m-actions">
                      <div className="m-cost" title="Biaya Tekad">
                        <Zap size={10} fill="currentColor" />
                        <span>{item.cost || 0}</span>
                      </div>
                      <button 
                        className={`m-use-btn ${(!isMyTurn || (currentPlayer?.tekad || 0) < (item.cost || 0)) ? 'disabled' : ''}`}
                        onClick={() => isMyTurn && useCard(item.instanceId)}
                        disabled={!isMyTurn || (currentPlayer?.tekad || 0) < (item.cost || 0)}
                      >
                        PAKAI
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">Tas Kosong</div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .gameplay-sidebar-panel { display: flex; flex-direction: column; height: 100%; color: white; font-family: 'Outfit', sans-serif; }
        
        .quick-stats-bar {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
          margin-bottom: 20px; padding: 14px; 
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(8px);
          border-radius: 20px; 
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .qs-item { display: flex; align-items: center; gap: 8px; padding: 2px; }
        .qs-icon { 
          width: 24px; height: 24px; border-radius: 6px; 
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.05);
          font-size: 0.95rem;
        }
        .qs-item.tekad .qs-icon { color: #58CC02; background: rgba(88, 204, 2, 0.1); }
        .qs-item.koin .qs-icon { color: #FFD700; background: rgba(255, 215, 0, 0.1); }
        .qs-item.peti .qs-icon { color: #f4c265; background: rgba(244, 194, 101, 0.1); }

        .coin-toast-alert {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #FFE8D6;
          border: 4px solid #4A2E10;
          border-radius: 18px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          z-index: 10000;
          animation: slideDownToast 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          color: #4A2E10;
          min-width: 290px;
        }
        .toast-icon {
          font-size: 1.8rem;
          animation: bounceToast 1.2s infinite;
        }
        .toast-body {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .toast-body strong {
          font-size: 0.85rem;
          font-weight: 950;
          color: #EF4444;
          letter-spacing: 0.5px;
        }
        .toast-body span {
          font-size: 0.7rem;
          font-weight: 800;
          color: #4A2E10;
        }
        @keyframes slideDownToast {
          0% { transform: translate(-50%, -100px); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes bounceToast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .qs-val { display: flex; flex-direction: column; line-height: 1; min-width: 0; }
        .v-row { display: flex; align-items: baseline; gap: 1px; }
        .qs-val .v { font-weight: 900; font-size: 1rem; color: white; }
        .qs-val .m { font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.5); }
        .qs-val .l { font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.7); text-transform: uppercase; margin-top: 2px; }

        .panel-tabs { 
          display: flex; 
          background: rgba(15, 23, 42, 0.35); 
          padding: 5px; 
          border-radius: 14px; 
          margin-bottom: 20px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .tab-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px 0; background: none; border: none; color: rgba(255,255,255,0.6);
          cursor: pointer; font-weight: 900; font-size: 0.8rem; transition: all 0.2s; border-radius: 10px;
        }
        .tab-btn.active { 
          background: #1CB0F6; 
          color: white; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
        }

        .panel-content-scroll { 
          flex: 1; overflow-y: auto; padding-right: 5px; 
          will-change: transform; transform: translate3d(0,0,0);
        }
        .section-label { 
          font-size: 0.75rem; font-weight: 900; 
          color: #0f172a; 
          margin-bottom: 12px; letter-spacing: 1px; text-transform: uppercase;
          text-shadow: 0 1px 0 rgba(255,255,255,0.25);
        }

        /* Turn Indicator */
        .turn-indicator-bar { margin-bottom: 20px; }
        .indicator-pill {
          display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-radius: 50px;
          font-weight: 900; font-size: 0.8rem; letter-spacing: 0.5px;
        }
        .indicator-pill.me { 
          background: #58CC02; 
          color: white; 
          border: 2px solid #58CC02; 
          box-shadow: 0 4px 15px rgba(88, 204, 2, 0.35);
        }
        .indicator-pill.other { 
          background: #1CB0F6; 
          color: white; 
          border: 2px solid #1CB0F6; 
          box-shadow: 0 4px 15px rgba(28, 176, 246, 0.35);
        }
        .pulse-dot { width: 10px; height: 10px; background: white; border-radius: 50%; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }

        /* Leaderboard */
        .opponents-list { display: flex; flex-direction: column; gap: 10px; }
        .opponent-item {
          display: flex; align-items: center; gap: 12px; padding: 12px 16px;
          background: white; 
          color: #4b4b4b;
          border-radius: 18px; 
          border: 2.5px solid #E5E5E5;
          box-shadow: 0 4px 0 #E5E5E5;
          transition: all 0.2s; 
          will-change: transform;
        }
        .opponent-item.active { 
          background: white; 
          border-color: #1CB0F6; 
          box-shadow: 0 4px 0 #1899D6, 0 8px 24px rgba(28, 176, 246, 0.15);
        }
        .rank { font-size: 0.8rem; font-weight: 900; color: #AFAFAF; width: 22px; }
        .avatar-circle {
          width: 36px; height: 36px; border-radius: 12px; overflow: hidden;
          display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
          border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
        .o-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .o-name { font-weight: 900; font-size: 0.85rem; color: #4B4B4B; }
        .o-sub { font-size: 0.7rem; font-weight: 800; color: #777777; }
        .o-score { display: flex; align-items: center; gap: 4px; font-weight: 900; font-size: 0.9rem; color: #D97706; }

        /* Logs */
        .logs-list { display: flex; flex-direction: column; gap: 10px; }
        .log-entry { 
          display: flex; gap: 12px; padding: 12px 16px; 
          background: white; 
          border-radius: 18px;
          border: 2.5px solid #E5E5E5;
          box-shadow: 0 4px 0 #E5E5E5;
        }
        .log-icon { color: #1CB0F6; margin-top: 2px; }
        .log-body { flex: 1; }
        .log-msg { font-size: 0.8rem; font-weight: 800; line-height: 1.4; color: #4B4B4B; margin: 0; }
        .log-time { font-size: 0.65rem; font-weight: 800; color: #AFAFAF; margin-top: 4px; display: block; }

        /* Inventory */
        .inventory-grid { display: flex; flex-direction: column; gap: 10px; }
        .inventory-item {
          display: flex; align-items: center; gap: 12px; padding: 12px;
          background: white; border-radius: 16px; border: 2px solid #E5E5E5;
        }
        .item-icon { width: 40px; height: 40px; background: rgba(0,0,0,0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .item-info { flex: 1; display: flex; flex-direction: column; }
        .item-name { font-weight: 900; font-size: 0.85rem; color: #4B4B4B; }
        .item-desc { font-size: 0.7rem; font-weight: 800; color: #777777; }
        .use-btn {
          background: #58CC02; color: white; border: none; padding: 8px 14px;
          border-radius: 10px; font-weight: 900; font-size: 0.75rem; cursor: pointer;
          box-shadow: 0 3px 0 #46A302; transition: all 0.1s;
        }
        .use-btn:active { transform: translateY(2px); box-shadow: 0 1px 0 #46A302; }
        
        /* Inventory Tab Custom Styles */
        .open-full-inventory-btn {
          width: 100%; display: flex; align-items: center; gap: 15px; padding: 15px;
          background: #1CB0F6; border: none; border-radius: 18px; color: white;
          cursor: pointer; box-shadow: 0 5px 0 #1899D6; transition: all 0.1s;
          position: relative; margin-bottom: 25px;
        }
        .open-full-inventory-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 #1899D6; }
        .btn-text { display: flex; flex-direction: column; align-items: flex-start; }
        .main-t { font-weight: 900; font-size: 1.05rem; letter-spacing: 1px; }
        .sub-t { font-size: 0.7rem; font-weight: 800; opacity: 0.9; }
        
        .mini-item-list { 
          background: white; 
          border-radius: 18px; 
          padding: 16px; 
          border: 2.5px solid #E5E5E5;
          box-shadow: 0 4px 0 #E5E5E5;
        }
        .mini-item-row { 
          display: flex; justify-content: space-between; align-items: center; 
          gap: 12px; padding: 12px 0; border-bottom: 1.5px solid #F1F1F1; 
        }
        .mini-item-row:last-child { border: none; }
        
        .m-main-info { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
        .m-icon-box { 
          width: 36px; height: 36px; background: rgba(0,0,0,0.05); 
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .m-icon { font-size: 1.2rem; }
        .m-details { display: flex; flex-direction: column; min-width: 0; }
        .m-name { font-size: 0.85rem; font-weight: 900; color: #4B4B4B; }
        .m-desc { font-size: 0.7rem; font-weight: 700; color: #777777; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
 
        .m-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .m-cost { 
          display: flex; align-items: center; gap: 4px; font-size: 0.65rem; 
          font-weight: 900; color: #58CC02; 
        }
        .m-use-btn {
          background: #58CC02; color: white; border: none; padding: 6px 12px;
          border-radius: 8px; font-weight: 900; font-size: 0.7rem; cursor: pointer;
          box-shadow: 0 3px 0 #46A302; transition: all 0.1s;
        }
        .m-use-btn:active:not(.disabled) { transform: translateY(2px); box-shadow: 0 1px 0 #46A302; }
        .m-use-btn.disabled { opacity: 0.35; filter: grayscale(1); cursor: not-allowed; box-shadow: none; }
 
        .empty-state { text-align: center; color: #AFAFAF; padding: 40px 0; font-weight: 900; font-size: 0.8rem; }
      `}</style>
    </div>
  );
}
