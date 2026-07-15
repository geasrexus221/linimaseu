import React from 'react';
import { X, Users, Zap, Star } from 'lucide-react';

const MOCK_PLAYERS = [
  { id: 1, name: 'Budi Setiawan', level: 12, avatar: '🧑‍🎓', status: 'Online' },
  { id: 2, name: 'Siti Aminah', level: 15, avatar: '👩‍🎓', status: 'Online' },
  { id: 3, name: 'Andi Pratama', level: 8, avatar: '🧑‍💻', status: 'Online' },
  { id: 4, name: 'Dewi Lestari', level: 20, avatar: '👩‍🏫', status: 'Online' },
  { id: 5, name: 'Rizky Fauzi', level: 10, avatar: '🧑‍🚀', status: 'Online' },
];

export default function OnlinePlayersModal({ onClose, onInvite }) {
  return (
    <div className="modal-overlay">
      <div className="modal-container-fun">
        <header className="modal-header-playful">
          <div className="header-icon-box">
            <div className="pulse-dot" />
            <Users size={24} color="white" />
          </div>
          <div className="header-text-box">
            <h3>Pemain Online</h3>
            <span>{MOCK_PLAYERS.length} Teman Aktif</span>
          </div>
          <button className="close-btn-circle" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <div className="players-scroll-area">
          {MOCK_PLAYERS.map(player => (
            <div key={player.id} className="player-fun-card">
              <div className="avatar-wrapper-fun">
                <span className="avatar-emoji-fun">{player.avatar}</span>
                <div className="status-badge" />
              </div>
              <div className="player-details-fun">
                <span className="name-fun">{player.name}</span>
                <div className="level-tag-fun">
                  <Star size={12} fill="#FFD700" color="#FFD700" />
                  <span>Level {player.level}</span>
                </div>
              </div>
              <button className="ajak-btn-3d" onClick={() => onInvite(player)}>
                <div className="ajak-btn-face">AJAK</div>
                <div className="ajak-btn-side"></div>
              </button>
            </div>
          ))}
        </div>

        <div className="modal-footer-fun">
          <p>Tantang temanmu untuk petualangan bersama! 🚀</p>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          display: flex; justify-content: center; align-items: center;
          z-index: 5000; padding: 20px; backdrop-filter: blur(8px);
        }
        .modal-container-fun {
          background: white; width: 100%; max-width: 400px;
          border-radius: 40px; overflow: hidden; display: flex; flex-direction: column;
          border: 4px solid #E5E5E5; box-shadow: 0 30px 60px rgba(0,0,0,0.2);
          animation: modalPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes modalPopIn {
          from { transform: scale(0.5) translateY(50px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        .modal-header-playful {
          padding: 25px; background: #1CB0F6; color: white;
          display: flex; align-items: center; gap: 15px; position: relative;
        }
        .header-icon-box {
          width: 50px; height: 50px; background: rgba(255,255,255,0.2);
          border-radius: 18px; display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .pulse-dot {
          position: absolute; top: -5px; right: -5px; width: 15px; height: 15px;
          background: #58CC02; border-radius: 50%; border: 3px solid white;
          animation: pulseGreen 2s infinite;
        }
        @keyframes pulseGreen {
          0% { box-shadow: 0 0 0 0 rgba(88,204,2,0.7); }
          70% { box-shadow: 0 0 0 10px rgba(88,204,2,0); }
          100% { box-shadow: 0 0 0 0 rgba(88,204,2,0); }
        }
        .header-text-box h3 { font-weight: 900; margin: 0; font-size: 1.3rem; }
        .header-text-box span { font-weight: 700; font-size: 0.8rem; opacity: 0.8; }
        .close-btn-circle {
          position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.1);
          border: none; width: 35px; height: 35px; border-radius: 50%;
          color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }

        .players-scroll-area { padding: 20px; display: flex; flex-direction: column; gap: 12px; max-height: 380px; overflow-y: auto; }
        .player-fun-card {
          display: flex; align-items: center; gap: 15px; padding: 12px 18px;
          background: #F7F9FC; border-radius: 24px; border: 2px solid #E5E5E5;
          transition: all 0.2s;
        }
        .player-fun-card:hover { border-color: #1CB0F6; background: #F0F9FF; transform: scale(1.02); }
        
        .avatar-wrapper-fun { position: relative; width: 55px; height: 55px; background: white; border-radius: 18px; display: flex; align-items: center; justify-content: center; border: 2px solid #E5E5E5; }
        .avatar-emoji-fun { font-size: 2rem; }
        .status-badge { position: absolute; bottom: -2px; right: -2px; width: 14px; height: 14px; background: #58CC02; border-radius: 50%; border: 2px solid white; }

        .player-details-fun { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .name-fun { font-weight: 900; color: #4B4B4B; font-size: 1rem; }
        .level-tag-fun {
          display: flex; align-items: center; gap: 5px; background: #FFF4E5;
          padding: 3px 10px; border-radius: 50px; font-weight: 800; font-size: 0.7rem;
          color: #f4c265; width: fit-content; border: 1.5px solid #f4c265;
        }

        .ajak-btn-3d { position: relative; width: 80px; height: 40px; background: none; border: none; cursor: pointer; }
        .ajak-btn-face {
          position: absolute; inset: 0; background: #1CB0F6; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 900; font-size: 0.8rem; z-index: 2;
          transition: transform 0.1s; border: 1.5px solid rgba(255,255,255,0.2);
        }
        .ajak-btn-side { position: absolute; inset: 0; bottom: -4px; background: #1899D6; border-radius: 12px; z-index: 1; }
        .ajak-btn-3d:active .ajak-btn-face { transform: translateY(2px); }
        .ajak-btn-3d:active .ajak-btn-side { bottom: -2px; }

        .modal-footer-fun { padding: 20px; text-align: center; color: #AFAFAF; font-weight: 800; font-size: 0.8rem; border-top: 2px solid #F0F0F0; }
      `}</style>
    </div>
  );
}
