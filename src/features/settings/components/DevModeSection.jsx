import React, { useState } from 'react';
import { Trash2, Unlock, Dices, Flame, Heart, Star, Sparkles, FolderOpen } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { actionCards } from '../../game/jelajah-nusantara/data/cards';
import { aduCendekiawanItems } from '../../game/tarik-tambang/data/tarikTambangDuelData';

export default function DevModeSection() {
  const {
    stars, hearts, streak, ownedArtifacts,
    setStars, addHearts, setStreak, addArtifact,
    resetProgress, unlockAllChapters
  } = useStore();

  const { setCurrentView } = useNavigationStore();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

  return (
    <div className="dev-mode-container">
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Progress?"
        message="reset senua"
        onConfirm={resetProgress}
        onCancel={() => setShowResetConfirm(false)}
        confirmText="Ya, pang resetkeun euy"
        type="danger"
      />

      <ConfirmModal
        isOpen={showUnlockConfirm}
        title="Buka Semua?"
        message="buka semuanya kh?"
        onConfirm={unlockAllChapters}
        onCancel={() => setShowUnlockConfirm(false)}
        confirmText="Ya, beneur"
        type="warning"
      />

      <div className="dev-header">
        <span className="dev-badge">DEVELOPER MODE</span>
        <p className="dev-hint">Gunakan panel ini untuk testing data cepat.</p>
      </div>

      <div className="dev-grid">
        <button className="dev-card reset" onClick={() => setShowResetConfirm(true)}>
          <Trash2 size={20} />
          <span>Reset All</span>
        </button>
        <button className="dev-card unlock" onClick={() => setShowUnlockConfirm(true)}>
          <Unlock size={20} />
          <span>Unlock All</span>
        </button>
        <button className="dev-card dice" onClick={() => setCurrentView('dev-dice')}>
          <Dices size={20} />
          <span>Dadu Lab</span>
        </button>
        <button className="dev-card assets-trigger" onClick={() => setCurrentView('dev-assets')}>
          <FolderOpen size={20} />
          <span>Aset Lab</span>
        </button>
        <button className="dev-card items-trigger" onClick={() => setShowItemModal(true)}>
          <Sparkles size={20} />
          <span>Tambah Item</span>
        </button>
      </div>

      <div className="dev-controls-group">
        {/* Kontrol Bintang */}
        <div className="control-box">
          <div className="control-header">
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <span>Bintang ⭐</span>
          </div>
          <div className="stepper-grid wide">
            <button onClick={() => setStars(stars - 10000)}>-10k</button>
            <button onClick={() => setStars(stars - 1000)}>-1k</button>
            <button onClick={() => setStars(stars - 100)}>-100</button>
            <span className="current-val">{stars}</span>
            <button onClick={() => setStars(stars + 100)}>+100</button>
            <button onClick={() => setStars(stars + 1000)}>+1k</button>
            <button onClick={() => setStars(stars + 10000)}>+10k</button>
          </div>
        </div>

        {/* Kontrol Obor/Streak */}
        <div className="control-box">
          <div className="control-header">
            <Flame size={16} color="#f4c265" fill="#f4c265" />
            <span>Obor (Streak)</span>
          </div>
          <div className="stepper-grid">
            <button onClick={() => setStreak(streak - 5)}>-5</button>
            <button onClick={() => setStreak(streak - 1)}>-1</button>
            <span className="current-val">{streak}</span>
            <button onClick={() => setStreak(streak + 1)}>+1</button>
            <button onClick={() => setStreak(streak + 5)}>+5</button>
          </div>
        </div>

        {/* Kontrol Nyawa/Hearts */}
        <div className="control-box">
          <div className="control-header">
            <Heart size={16} color="#FF4B4B" fill="#FF4B4B" />
            <span>Nyawa (Hearts)</span>
          </div>
          <div className="stepper-grid">
            <button onClick={() => addHearts(-1)}>-1</button>
            <span className="current-val">{hearts}</span>
            <button onClick={() => addHearts(1)}>+1</button>
          </div>
        </div>

      </div>

      {showItemModal && (
        <div className="dev-modal-overlay" onClick={() => setShowItemModal(false)}>
          <div className="dev-modal-card" onClick={e => e.stopPropagation()}>
            <div className="dev-modal-header">
              <h3>Tambah Item Uji Coba</h3>
              <button className="dev-modal-close" onClick={() => setShowItemModal(false)}>✕</button>
            </div>
            <div className="dev-modal-body">
              <h4 className="dev-items-title">Jelajah Nusantara</h4>
              <div className="dev-items-grid">
                {actionCards.map(item => {
                  const owned = ownedArtifacts.find(a => a.id === item.id);
                  const count = owned ? owned.count : 0;
                  return (
                    <button key={item.id} className="dev-item-btn" onClick={() => addArtifact(item)}>
                      <span className="dev-item-icon">{item.icon}</span>
                      <span className="dev-item-name">{item.name}</span>
                      <span className="dev-item-count">x{count}</span>
                    </button>
                  );
                })}
              </div>

              <h4 className="dev-items-title" style={{ marginTop: '20px' }}>Adu Cendekiawan</h4>
              <div className="dev-items-grid">
                {aduCendekiawanItems.map(item => {
                  const owned = ownedArtifacts.find(a => a.id === item.id);
                  const count = owned ? owned.count : 0;
                  return (
                    <button key={item.id} className="dev-item-btn tt" onClick={() => addArtifact(item)}>
                      <span className="dev-item-icon">{item.icon}</span>
                      <span className="dev-item-name">{item.name}</span>
                      <span className="dev-item-count">x{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .dev-mode-container {
          margin: 20px;
          padding: 20px;
          background: #FFF9F0;
          border: 2px dashed #f4c265;
          border-radius: 24px;
        }

        .dev-header {
          margin-bottom: 20px;
          text-align: center;
        }

        .dev-badge {
          background: #f4c265;
          color: white;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .dev-hint {
          font-size: 0.75rem;
          color: #A08050;
          margin-top: 8px;
          font-weight: 600;
        }

        .dev-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-bottom: 25px;
        }

        .dev-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 15px 5px;
          border: none;
          border-radius: 16px;
          color: white;
          font-weight: 800;
          font-size: 0.7rem;
          cursor: pointer;
          transition: transform 0.1s;
        }

        .dev-card:active { transform: scale(0.95); }
        .dev-card.reset { background: #FF4B4B; box-shadow: 0 4px 0 #D13030; }
        .dev-card.unlock { background: #58CC02; box-shadow: 0 4px 0 #46A302; }
        .dev-card.dice { background: #1CB0F6; box-shadow: 0 4px 0 #1899D6; }
        .dev-card.assets-trigger { background: #8B5CF6; box-shadow: 0 4px 0 #7C3AED; }
        .dev-card.items-trigger { background: #f4c265; box-shadow: 0 4px 0 #EA580C; }

        /* Modal Popup Styles */
        .dev-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .dev-modal-card {
          background: white;
          border-radius: 24px;
          width: 100%;
          max-width: 500px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 3px solid #f4c265;
          animation: popUp 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .dev-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 20px;
          border-bottom: 2px dashed #FFE0B2;
        }
        .dev-modal-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 900;
          color: #333;
        }
        .dev-modal-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          font-weight: bold;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.15s;
        }
        .dev-modal-close:hover {
          color: #ef4444;
        }
        .dev-modal-body {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .dev-controls-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .control-box {
          background: white;
          padding: 12px;
          border-radius: 16px;
          border: 1px solid #FFE0B2;
        }

        .control-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 900;
          color: #666;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .stepper-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 5px;
        }

        .stepper-grid button {
          flex: 1;
          padding: 8px 0;
          border: none;
          background: #F0F0F0;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .stepper-grid.wide button {
          font-size: 0.65rem;
          padding: 6px 0;
        }

        .stepper-grid button:active { background: #E0E0E0; }

        .current-val {
          min-width: 40px;
          text-align: center;
          font-weight: 900;
          font-size: 1rem;
          color: #333;
        }

        /* Developer Items Manager Styles */
        .dev-items-section { display: flex; flex-direction: column; width: 100%; text-align: left; }
        .dev-items-title { font-size: 0.72rem; font-weight: 900; color: #a08050; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .dev-items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; width: 100%; }
        .dev-item-btn {
          background: #F7F9FC; border: 2.5px solid #E5E5E5; border-radius: 12px;
          padding: 8px; display: flex; align-items: center; gap: 8px; cursor: pointer;
          position: relative; transition: all 0.15s; text-align: left;
        }
        .dev-item-btn:hover { border-color: #f4c265; background: #FFF9F0; transform: translateY(-1px); }
        .dev-item-btn:active { transform: translateY(1px); }
        .dev-item-btn.tt:hover { border-color: #1cb0f6; background: #f0f9ff; }
        .dev-item-icon { font-size: 1.2rem; }
        .dev-item-name { font-size: 0.62rem; font-weight: 800; color: #4B4B4B; flex: 1; line-height: 1.2; }
        .dev-item-count { font-size: 0.6rem; font-weight: 900; color: #3B82F6; background: #dbeafe; padding: 2px 6px; border-radius: 6px; }
        .dev-item-btn.tt .dev-item-count { color: #1cb0f6; background: #e0f2fe; }
      `}</style>
    </div>
  );
}
