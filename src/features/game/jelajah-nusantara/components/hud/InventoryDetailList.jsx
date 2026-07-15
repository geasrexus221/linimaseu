import React from 'react';
import { Zap, X, Shield, Star, Briefcase, Landmark, Compass, Plus, Minus, Trash2, Heart } from 'lucide-react';
import { useGameStore } from '../../../../../store/useGameStore';
import { actionCards } from '../../data/cards';
import { soundEngine } from '../../logic/soundEngine';

export default function InventoryDetailList({ player, onClose, isTestMode }) {
  const useCard = useGameStore(state => state.useCard);
  const phase = useGameStore(state => state.phase);
  const cheatAddCard = useGameStore(state => state.cheatAddCard);
  const cheatRemoveCard = useGameStore(state => state.cheatRemoveCard);
  const cheatSetStat = useGameStore(state => state.cheatSetStat);

  if (!player) return null;

  // Fill up 3 slots
  const slots = [0, 1, 2].map(idx => player.inventory[idx] || null);

  return (
    <div className="inventory-window">
      <div className="window-header">
        <div className="title-group">
          <Briefcase className="header-icon" size={24} />
          <div className="title-text">
            <h2>TAS</h2>
            <p>Kelola koleksi kartu dan pantau progres artefakmu</p>
          </div>
        </div>
        <button className="close-btn" onClick={() => { soundEngine.playSound('click'); onClose(); }}>
          <X size={24} />
        </button>
      </div>

      <div className="window-content">
        {/* STATS SECTION */}
        <div className="stats-dashboard">
          <div className="stat-card">
            <div className="stat-icon tekad"><Zap size={20} fill="#FFC800" /></div>
            <div className="stat-info">
              <span className="stat-label">TEKAD</span>
              <span className="stat-value">{player.tekad}/100</span>
            </div>
            <div className="stat-progress-bg">
              <div className="stat-progress-fill tekad" style={{ width: `${player.tekad}%` }} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon koin">🪙</div>
            <div className="stat-info">
              <span className="stat-label">KOIN EMAS</span>
              <span className="stat-value">{player.koin || 0}</span>
            </div>
            <div className="stat-progress-bg">
              <div className="stat-progress-fill koin" style={{ width: `${Math.min(100, ((player.koin || 0) / (player.artifacts === 0 ? 200 : player.artifacts === 1 ? 400 : 600)) * 100)}%` }} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon artifact">📦</div>
            <div className="stat-info">
              <span className="stat-label">PETI HARTA</span>
              <span className="stat-value">{player.artifacts}/3</span>
            </div>
            <div className="stat-desc">Peti harta terisi</div>
          </div>
        </div>

        <div className="section-divider">
          <span>KANTONG KARTU AKSI (MAX 3)</span>
        </div>

        {/* CARDS SECTION */}
        <div className="inventory-slots">
          {slots.map((card, idx) => (
            <div key={idx} className={`inventory-slot ${card ? 'filled' : 'empty'}`}>
              {card ? (
                <div className="card-item-full">
                  {/* Cost Badge in Top-Right */}
                  <div className="card-cost-box">
                    <Heart size={10} fill="#FF4B4B" color="#FF4B4B" />
                    <span>{card.cost}</span>
                  </div>

                  {/* Illustration Area */}
                  <div className="card-illustration-full" style={{ background: `linear-gradient(135deg, ${card.color}, rgba(255,255,255,0.35))` }}>
                    <div className="card-icon-box">{card.icon}</div>
                  </div>

                  {/* Card Name Banner */}
                  <div className="card-name-banner-full">
                    {card.name}
                  </div>

                  {/* Card Description/Effect Box */}
                  <div className="card-desc-box-full">
                    <p className="card-desc-text-full">{card.description}</p>
                  </div>

                  {/* Action Button */}
                  <div className="card-use-action-box">
                    <button
                      className="card-use-btn"
                      disabled={phase !== 'WAITING_ROLL' || player.tekad <= card.cost}
                      onClick={() => { soundEngine.playSound('click'); useCard(card.instanceId); onClose(); }}
                    >
                      {player.tekad <= card.cost ? 'TEKAD KURANG' : 'GUNAKAN KARTU'}
                    </button>
                  </div>

                  {isTestMode && (
                    <button className="cheat-remove-btn" onClick={() => { soundEngine.playSound('click'); cheatRemoveCard(card.instanceId); }}>
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="empty-slot-content">
                  <div className="empty-icon"><Compass size={32} opacity={0.2} /></div>
                  <span>Slot Kosong</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CHEAT MENU SECTION */}
        {isTestMode && (
          <div className="cheat-menu-section">
            <div className="section-divider">
              <span>DEBUG: CARD SPAWNER</span>
            </div>
            <div className="cheat-card-list">
              {actionCards.map(c => (
                <button
                  key={c.id}
                  className="cheat-spawn-btn"
                  onClick={() => { soundEngine.playSound('click'); cheatAddCard(c.id); }}
                  disabled={player.inventory.length >= 3}
                  title={`Tambah ${c.name}`}
                >
                  <span className="spawn-icon">{c.icon}</span>
                  <span className="spawn-name">{c.name}</span>
                </button>
              ))}
            </div>

            <div className="section-divider">
              <span>DEBUG: STAT MODIFIER</span>
            </div>
            <div className="cheat-stats-row">
              <div className="cheat-stat-control">
                <span>Tekad:</span>
                <button onClick={() => { soundEngine.playSound('click'); cheatSetStat('tekad', Math.max(0, player.tekad - 10)); }}><Minus size={14} /></button>
                <button onClick={() => { soundEngine.playSound('click'); cheatSetStat('tekad', Math.min(100, player.tekad + 10)); }}><Plus size={14} /></button>
              </div>
              <div className="cheat-stat-control">
                <span>Koin:</span>
                <button onClick={() => { soundEngine.playSound('click'); cheatSetStat('koin', Math.max(0, (player.koin || 0) - 50)); }}><Minus size={14} /></button>
                <button onClick={() => { soundEngine.playSound('click'); cheatSetStat('koin', (player.koin || 0) + 50); }}><Plus size={14} /></button>
              </div>
              <div className="cheat-stat-control">
                <span>Peti Harta:</span>
                <button onClick={() => { soundEngine.playSound('click'); cheatSetStat('artifacts', Math.max(0, player.artifacts - 1)); }}><Minus size={14} /></button>
                <button onClick={() => { soundEngine.playSound('click'); cheatSetStat('artifacts', Math.min(3, player.artifacts + 1)); }}><Plus size={14} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .inventory-window {
          background: var(--card-bg, #1A1A1A); width: 90vw; max-width: 800px;
          border-radius: 32px; border: 4px solid var(--border-color, #3C3C3C);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.05);
          display: flex; flex-direction: column; overflow: hidden;
          color: var(--text-color, white); pointer-events: auto;
          animation: modalAppear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes modalAppear {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .window-header {
          padding: 24px 32px; border-bottom: 2px solid var(--border-color, #333);
          display: flex; align-items: center; justify-content: space-between;
          background: var(--background-color, rgba(255,255,255,0.02));
        }
        .title-group { display: flex; align-items: center; gap: 16px; }
        .header-icon { color: #58CC02; }
        .title-text h2 { margin: 0; font-size: 1.4rem; font-weight: 900; letter-spacing: 1px; color: var(--text-color, #FFF); }
        .title-text p { margin: 0; font-size: 0.8rem; color: var(--text-muted, #777); font-weight: 700; }
        .close-btn { 
          background: var(--border-color, #333); border: none; color: var(--text-muted, #777); width: 44px; height: 44px; 
          border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .close-btn:hover { background: #EF4444; color: white; }

        .window-content { 
          padding: 32px; overflow-y: auto; max-height: 70vh; 
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }

        .stats-dashboard {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px;
        }
        @media (min-width: 600px) { .stats-dashboard { grid-template-columns: repeat(4, 1fr); } }
        .stat-card {
          background: var(--background-color, #222); border: 2px solid var(--border-color, #333); border-radius: 20px; padding: 16px;
          display: flex; flex-direction: column; gap: 8px; position: relative;
        }
        .stat-card.highlight { border-color: #58CC02; background: rgba(88, 204, 2, 0.05); }
        .stat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--border-color, #111); }
        .stat-info { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.65rem; font-weight: 900; color: var(--text-muted, #777); letter-spacing: 1px; }
        .stat-value { font-size: 1.1rem; font-weight: 900; color: var(--text-color, #FFF); }
        .stat-desc { font-size: 0.6rem; color: var(--text-muted, #555); font-weight: 800; }
        
        .stat-progress-bg { width: 100%; height: 6px; background: var(--border-color, #111); border-radius: 3px; overflow: hidden; margin-top: 4px; }
        .stat-progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
        .stat-progress-fill.tekad { background: #FFC800; }
        .stat-progress-fill.koin { background: #FFD700; }

        .section-divider {
          display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
        }
        .section-divider::after { content: ''; flex: 1; height: 2px; background: var(--border-color, #333); }
        .section-divider span { font-size: 0.75rem; font-weight: 900; color: var(--text-muted, #555); letter-spacing: 2px; }

        .inventory-slots { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .inventory-slot {
          aspect-ratio: 0.75; border-radius: 24px; border: 3px dashed var(--border-color, #333);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s;
        }
        .inventory-slot.filled { border-style: solid; border-color: var(--border-color, #3C3C3C); background: var(--background-color, #222); border-width: 2px; }
        .empty-slot-content { display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--text-muted, #444); font-weight: 900; font-size: 0.8rem; }

        .card-item-full {
          width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden;
          background: #FFF7E6; border: 5px solid #5E3A24; border-radius: 20px;
          position: relative; box-shadow: 0 8px 16px rgba(0,0,0,0.3), 0 3px 0 #3A2315;
        }
        .card-cost-box {
          position: absolute; top: 8px; right: 8px; background: white;
          border: 2px solid #5E3A24; border-radius: 10px;
          height: 22px; padding: 0 6px; display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; font-weight: 950; color: #5E3A24; gap: 3px;
          box-shadow: 0 2px 0 rgba(0,0,0,0.15); z-index: 10;
        }
        .card-illustration-full {
          margin: 8px 8px 4px 8px;
          height: 90px; border-radius: 8px;
          border: 2.5px solid #5E3A24;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          box-shadow: inset 0 3px 6px rgba(0,0,0,0.15);
        }
        .card-icon-box { font-size: 2.2rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2)); }
        
        .card-name-banner-full {
          background: white; border: 2.5px solid #5E3A24;
          margin: 2px 8px; padding: 4px; text-align: center;
          border-radius: 8px; font-weight: 950; font-size: 0.72rem;
          color: #3E2723; text-transform: uppercase;
          box-shadow: 0 2px 0 rgba(0,0,0,0.1);
        }
        .card-desc-box-full {
          background: #FAF4D0; border: 2.5px solid #5E3A24;
          margin: 2px 8px; padding: 6px;
          border-radius: 8px; flex: 1; display: flex;
          align-items: center; justify-content: center;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
        }
        .card-desc-text-full {
          margin: 0; font-size: 0.62rem; color: #4E342E;
          line-height: 1.3; font-weight: 800; text-align: center;
        }
        .card-use-action-box {
          padding: 6px 8px 8px 8px;
        }
        
        .card-use-btn {
          width: 100%; padding: 12px; border-radius: 12px; border: none;
          background: #58CC02; color: white; font-weight: 900; font-size: 0.8rem;
          cursor: pointer; box-shadow: 0 4px 0 #46A302; transition: all 0.1s;
        }
        .card-use-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 #46A302; }
        .card-use-btn:disabled { background: var(--border-color, #333); box-shadow: none; color: var(--text-muted, #555); cursor: not-allowed; }

        .cheat-menu-section { margin-top: 32px; padding-top: 16px; border-top: 2px dashed var(--border-color, #333); }
        .cheat-card-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .cheat-spawn-btn {
          background: var(--background-color, #333); border: 2px solid var(--border-color, #444); color: var(--text-color, #EEE); border-radius: 10px;
          padding: 6px 12px; display: flex; align-items: center; gap: 6px; cursor: pointer;
          font-size: 0.7rem; font-weight: 800; transition: all 0.2s;
        }
        .cheat-spawn-btn:hover:not(:disabled) { background: var(--border-color, #444); border-color: #58CC02; }
        .cheat-spawn-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .spawn-icon { font-size: 1rem; }
        
        .cheat-stats-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
        .cheat-stat-control { display: flex; align-items: center; gap: 6px; background: var(--background-color, #111); padding: 4px 8px; border-radius: 8px; border: 1px solid var(--border-color, #333); }
        .cheat-stat-control span { font-size: 0.65rem; font-weight: 900; color: var(--text-muted, #777); }
        .cheat-stat-control button { background: var(--border-color, #333); border: none; color: white; border-radius: 4px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .cheat-stat-control button:hover { background: var(--text-muted, #555); }
        
        .cheat-toggle-btn {
          background: var(--background-color, #333); border: 2px solid var(--border-color, #444); border-radius: 8px; color: var(--text-color, #EEE); padding: 4px 12px;
          font-size: 0.7rem; font-weight: 900; cursor: pointer;
        }
        .cheat-toggle-btn.active { background: #58CC02; border-color: #46A302; }
        
        .cheat-remove-btn {
          position: absolute; top: 12px; left: 12px; background: rgba(239, 68, 68, 0.4);
          border: none; color: white; width: 24px; height: 24px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .cheat-remove-btn:hover { background: rgba(239, 68, 68, 1); }

        @media (max-width: 600px) {
          .window-content { padding: 16px; }
          .stats-dashboard { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; margin-bottom: 16px !important; }
          .inventory-slots { grid-template-columns: 1fr !important; gap: 12px !important; }
          .inventory-slot {
            aspect-ratio: 0.75 !important;
            width: 100% !important;
            max-width: 200px !important;
            margin: 0 auto !important;
            height: auto !important;
          }
          .card-item-full {
            flex-direction: column !important;
            width: 100% !important;
            height: 100% !important;
          }
          .card-use-btn {
            width: 100% !important;
            padding: 8px !important;
            font-size: 0.75rem !important;
            border-radius: 8px !important;
            box-shadow: 0 3px 0 #46A302 !important;
          }
          .empty-slot-content {
            flex-direction: row !important;
            gap: 8px !important;
            padding: 16px !important;
          }
        }

        @media (max-height: 500px) {
          .inventory-window { width: 95vw !important; max-height: 98vh !important; border-radius: 16px !important; }
          .window-header { padding: 10px 20px !important; }
          .title-text h2 { font-size: 1rem !important; }
          .header-icon { width: 20px !important; height: 20px !important; }
          .window-content { padding: 12px 20px !important; max-height: 80vh !important; }
          .stats-dashboard { grid-template-columns: repeat(4, 1fr) !important; gap: 8px !important; margin-bottom: 12px !important; }
          .stat-card { padding: 8px !important; border-radius: 12px !important; gap: 4px !important; }
          .stat-icon { width: 28px !important; height: 28px !important; }
          .stat-value { font-size: 0.85rem !important; }
          .stat-label { font-size: 0.5rem !important; }
          .stat-desc { display: none; }
          .section-divider { margin-bottom: 12px !important; gap: 8px !important; }
          .section-divider span { font-size: 0.6rem !important; letter-spacing: 1px !important; }
          .inventory-slots { gap: 12px !important; }
          .inventory-slot { border-radius: 16px !important; }
          .card-icon-box { font-size: 1.5rem !important; }
          .card-cost-box { top: 6px !important; right: 6px !important; padding: 2px 6px !important; font-size: 0.65rem !important; }
          .card-name-full { font-size: 0.75rem !important; margin-bottom: 4px !important; }
          .card-desc-full { font-size: 0.6rem !important; margin-bottom: 8px !important; }
          .card-use-btn { padding: 8px !important; font-size: 0.7rem !important; border-radius: 8px !important; }
          .cheat-menu-section { margin-top: 12px !important; padding-top: 8px !important; }
          .cheat-spawn-btn { padding: 4px 8px !important; font-size: 0.6rem !important; }
          .cheat-stats-row { gap: 6px !important; }
          .cheat-stat-control { padding: 2px 6px !important; }
        }
      `}</style>
    </div>
  );
}
