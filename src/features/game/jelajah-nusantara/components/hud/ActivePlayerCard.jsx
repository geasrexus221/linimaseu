import React from 'react';
import { Zap, Compass, Layers } from 'lucide-react';
import { useStore } from '../../../../../store/useStore';
import StudentAvatar from '../../../../../components/common/StudentAvatar';

export default function ActivePlayerCard({ player, onClick }) {
  const theme = useStore((state) => state.theme);
  const isDark = theme === 'dark';

  
  const prevTekad = React.useRef(player?.tekad);
  const prevKoin = React.useRef(player?.koin);
  const [pulseTekad, setPulseTekad] = React.useState(false);
  const [pulseKoin, setPulseKoin] = React.useState(false);

  React.useEffect(() => {
    if (player?.tekad !== prevTekad.current) {
      setPulseTekad(true);
      const t = setTimeout(() => setPulseTekad(false), 600);
      prevTekad.current = player?.tekad;
      return () => clearTimeout(t);
    }
  }, [player?.tekad]);

  React.useEffect(() => {
    if (player?.koin !== prevKoin.current) {
      setPulseKoin(true);
      const t = setTimeout(() => setPulseKoin(false), 600);
      prevKoin.current = player?.koin;
      return () => clearTimeout(t);
    }
  }, [player?.koin]);

  if (!player) return null;

  return (
    <div className="active-player-card" onClick={onClick}>
      <div className="avatar-frame" style={{ borderColor: player.color }}>
        {player.type === 'human' ? (
          <div style={{ transform: 'scale(0.6) translateY(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StudentAvatar size={50} />
          </div>
        ) : (
          <img src={player.avatar || 'https://via.placeholder.com/150'} alt="avatar" className="avatar-img" />
        )}
      </div>
      <div className="player-info">
        <div className="player-name">{player.name}</div>
        <div className="stats-row">
          <div className={`stat-chip tekad ${pulseTekad ? 'pulse' : ''}`} title="Tekad">
            <Zap size={9} fill="#FFD700" color="#FFD700" /> 
            <span>{player.tekad}</span>
          </div>
          <div className={`stat-chip koin ${pulseKoin ? 'pulse' : ''}`} title="Koin Emas">
            <span>🪙</span> 
            <span>{player.koin || 0}</span>
          </div>
          <div className="stat-chip artifacts-stored" title="Peti Harta Terisi">
            <span>📦</span>
            <span>{player.artifacts || 0}/3</span>
          </div>
          <div className="stat-chip inventory" title="Kartu Aksi">
            <Layers size={9} color="#EC4899" />
            <span>{player.inventory?.length || 0}/3</span>
          </div>
        </div>
      </div>

      <style>{`
        .active-player-card {
          display: flex; align-items: center; gap: 10px;
          background: var(--card-bg, #FFFFFF);
          padding: 6px 12px; border-radius: 16px;
          border: 3px solid var(--border-color, #E5E5E5);
          box-shadow: 0 4px 0 var(--border-color, #E5E5E5);
          pointer-events: auto; cursor: pointer; transition: all 0.2s;
        }
        @media (max-width: 600px) {
          .active-player-card { padding: 4px 10px; gap: 8px; border-radius: 14px; }
          .avatar-frame { width: 38px; height: 38px; }
          .player-name { font-size: 0.85rem !important; }
          .stat-chip { padding: 2px 6px !important; font-size: 0.65rem !important; }
        }
        .active-player-card:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .active-player-card:active { transform: translateY(2px); box-shadow: 0 1px 0 var(--border-color, #E5E5E5); }
        .avatar-frame {
          width: 44px; height: 44px; border-radius: 12px; border: 2.5px solid;
          background: var(--background-color, #F0F0F0); position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .avatar-img { width: 100%; height: 100%; border-radius: 9px; object-fit: cover; }
        .player-info { display: flex; flex-direction: column; }
        .player-name { color: var(--text-color, #4B4B4B); font-weight: 900; font-size: 1rem; margin-bottom: 2px; line-height: 1.1; }
        .stats-row { display: flex; gap: 5px; }
        .stat-chip {
          background: var(--background-color, #F7F7F7); padding: 2px 8px; border-radius: 8px;
          font-size: 0.75rem; color: var(--text-color, #4B4B4B); font-weight: 800;
          display: flex; align-items: center; gap: 4px; border: 1.5px solid var(--border-color, #E5E5E5);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .stat-chip.pulse { transform: scale(1.15); filter: brightness(1.2); }
        .stat-chip.tekad { border-color: #FFC800; background: var(--background-color, #FFF9E5); }
        .stat-chip.tekad span { color: #FFC800; }
        .stat-chip.koin { border-color: #FFD700; background: var(--background-color, #FFFDF0); }
        .stat-chip.koin span { color: #D4AF37; }
        .stat-chip.artifacts-stored { border-color: #f4c265; background: var(--background-color, #FFF9F0); }
        .stat-chip.artifacts-stored span { color: #f4c265; }
        .stat-chip.inventory { border-color: #EC4899; background: var(--background-color, #FFE5F3); }
        .stat-chip.inventory span { color: #EC4899; }
      `}</style>
    </div>
  );
}
