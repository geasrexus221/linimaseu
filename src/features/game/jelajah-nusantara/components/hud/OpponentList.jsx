import React from 'react';
import { useStore } from '../../../../../store/useStore';
import character1iso from '../../../../../assets/UI/Character/character1iso.svg';
import character2iso from '../../../../../assets/UI/Character/character2iso.svg';
import character1tumbang from '../../../../../assets/UI/Character/character1tumbang.svg';

export default function OpponentList({ players, turnIdx }) {
  const theme = useStore((state) => state.theme);
  const isDark = theme === 'dark';

  // Urutkan pemain: Giliran sekarang di atas, diikuti giliran berikutnya, lalu yang sudah lewat di bawah.
  const sortedPlayers = [
    ...players.slice(turnIdx),
    ...players.slice(0, turnIdx)
  ];

  return (
    <div className="opponents-list">
      {sortedPlayers.map((player) => {
        const isActive = players[turnIdx].id === player.id;
        const isChar2 = player.characterId === 2;
        const charSvg = (player.characterId === 1 && player.isFainted) ? character1tumbang : (isChar2 ? character2iso : character1iso);
        const isYellow = player.color === '#FACC15';
        const nameColor = isYellow ? '#7B521E' : '#FFFFFF';

        return (
          <div key={player.id} className={`opponent-card-wrapper ${isActive ? 'active' : ''}`}>
            {/* 1. Left Circle - Character Avatar */}
            <div className="character-circle" style={{ borderColor: isActive ? player.color : '#8B521E' }}>
              <img src={charSvg} alt="char" className="avatar-img-circle" />
              {/* Tiny Badge at bottom of circle */}
              <div className="circle-bottom-badge">
                {player.id === 'player-1' ? 'KAMU' : player.type === 'ai' ? 'BOT' : 'TEMAN'}
              </div>
            </div>

            {/* 2. Right Body - Header and Stats */}
            <div className="card-right-body">
              {/* Header Banner (Player slot and Name) */}
              <div className="card-header-banner" style={{ 
                backgroundColor: player.color, 
                borderColor: isActive ? player.color : '#8B521E' 
              }}>
                <div className="header-flex">
                  <span className="header-sub-small">P{player.playerNum}</span>
                  <span className="header-title-name" style={{ color: nameColor }}>{player.name}</span>
                </div>
              </div>

              {/* Main Plate (Compact Stats Row: Tekad/HP, Pijar, Artefak, Kartu) */}
              <div className="card-main-plate" style={{ borderColor: isActive ? player.color : '#8B521E' }}>
                <div className="stats-row">
                  <span className="val tekad">❤️{player.tekad}</span>
                  <span className="val koin">🪙{player.koin || 0}</span>
                  <span className="val artifacts">📦{player.artifacts || 0}</span>
                  <span className="val inventory">🎴{player.inventory?.length || 0}</span>
                </div>
              </div>
            </div>
            
            <style>{`
              .opponent-card-wrapper {
                display: flex;
                align-items: center;
                position: relative;
                width: 140px;
                height: 42px;
                margin-bottom: 2px;
                box-sizing: border-box;
                font-family: 'Outfit', sans-serif;
                pointer-events: auto;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                transform: ${isActive ? 'scale(1.03)' : 'scale(1)'};
              }
              .opponent-card-wrapper.active {
                animation: activePulsing 2s infinite alternate;
              }
              @keyframes activePulsing {
                from { filter: drop-shadow(0 0 1px ${player.color}88); }
                to { filter: drop-shadow(0 0 4px ${player.color}); }
              }
              .character-circle {
                position: relative;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 1.8px solid #8B521E;
                background: linear-gradient(135deg, #FFFDF0 0%, #FFEFC6 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 0 #A87C43, 0 3px 6px rgba(0,0,0,0.15);
                z-index: 5;
                flex-shrink: 0;
                overflow: visible;
              }
              .avatar-img-circle {
                width: 82%;
                height: 82%;
                object-fit: contain;
                transform: translateY(-1px);
              }
              .circle-bottom-badge {
                position: absolute;
                bottom: -4px;
                left: 50%;
                transform: translateX(-50%);
                background: #8B521E;
                color: white;
                font-size: 0.38rem;
                font-weight: 900;
                padding: 0.2px 3px;
                border-radius: 4px;
                border: 0.5px solid white;
                box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                white-space: nowrap;
              }
              
              .card-right-body {
                margin-left: -8px;
                flex: 1;
                display: flex;
                flex-direction: column;
                height: 34px;
                position: relative;
                z-index: 1;
              }
              .card-header-banner {
                background: #F4A261;
                border: 1.8px solid #8B521E;
                border-radius: 0 8px 0 0;
                padding: 1px 4px 1px 10px;
                height: 14px;
                display: flex;
                align-items: center;
                box-sizing: border-box;
              }
              .header-flex {
                display: flex;
                align-items: center;
                gap: 3px;
                width: 100%;
              }
              .header-sub-small {
                font-size: 0.38rem;
                font-weight: 950;
                color: #FFFDF0;
                background: rgba(0,0,0,0.25);
                padding: 0.5px 2px;
                border-radius: 3px;
                line-height: 1;
              }
              .header-title-name {
                font-size: 0.52rem;
                font-weight: 900;
                line-height: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
                text-shadow: 0 0.5px 1px rgba(0,0,0,0.15);
              }
              
              .card-main-plate {
                background: linear-gradient(to bottom, #FFFDF0 0%, #FFF8E7 100%);
                border: 1.8px solid #8B521E;
                border-top: none;
                border-radius: 0 0 8px 8px;
                flex: 1;
                padding: 1px 4px 1px 10px;
                box-shadow: 0 2px 0 #A87C43, 0 2px 4px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                justify-content: center;
                box-sizing: border-box;
              }
              .stats-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                gap: 4px;
              }
              .val {
                font-size: 0.54rem;
                font-weight: 900;
                display: flex;
                align-items: center;
                gap: 1.5px;
                white-space: nowrap;
                flex-shrink: 0;
              }
               .val.tekad { color: #E05A00; }
               .val.koin { color: #D4AF37; }
               .val.artifacts { color: #D97706; }
               .val.inventory { color: #C026D3; }
            `}</style>
          </div>
        );
      })}
    </div>
  );
}
