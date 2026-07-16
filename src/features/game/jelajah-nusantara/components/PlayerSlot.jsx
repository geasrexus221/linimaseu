import React from 'react';
import { UserPlus, Cpu, Users, X } from 'lucide-react';
import character1iso from '../../../../assets/UI/Character/character1iso.svg';
import character2iso from '../../../../assets/UI/Character/character2iso.svg';

export default function PlayerSlot({ player, onAddClick, onClick, onRemove, isFirstSlotEmpty }) {
  if (!player) {
    return (
      <div className={`slot-empty ${isFirstSlotEmpty ? 'attention' : ''}`} onClick={onAddClick}>
        <div className="add-btn-circle">
          <UserPlus size={20} color={isFirstSlotEmpty ? "#f4c265" : "#AFAFAF"} />
        </div>
        <span>{isFirstSlotEmpty ? 'PILIH KARAKTER' : 'TAMBAH'}</span>
        
        <style jsx>{`
          .slot-empty {
            flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
            cursor: pointer; transition: all 0.2s;
          }
          .slot-empty:hover .add-btn-circle {
            border-color: #1CB0F6; transform: scale(1.05);
          }
          .add-btn-circle {
            width: 50px; height: 50px; border: 3px dashed #E5E5E5;
            border-radius: 14px; display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          }
          .slot-empty.attention .add-btn-circle {
            border: 3px solid #f4c265;
            background: #FFF9E6;
            box-shadow: 0 0 12px rgba(255, 150, 0, 0.6);
            animation: pulseGlow 1.5s infinite alternate;
          }
          .slot-empty.attention span {
            color: #f4c265 !important;
            font-size: 0.65rem;
            text-shadow: 0 1px 0 rgba(255,255,255,0.8);
          }
          @keyframes pulseGlow {
            0% { transform: scale(1); box-shadow: 0 0 8px rgba(255, 150, 0, 0.4); }
            100% { transform: scale(1.05); box-shadow: 0 0 16px rgba(255, 150, 0, 0.8); }
          }
          span { font-weight: 900; font-size: 0.65rem; color: #AFAFAF; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="slot-filled" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="avatar-wrapper">
        {player.characterId ? (
          <div className="char-slot-preview">
            <img 
              src={player.characterId === 2 ? character2iso : character1iso} 
              alt={player.name} 
              className="char-slot-img" 
            />
          </div>
        ) : (
          <StudentAvatar size={50} showGlow={player.type === 'human'} />
        )}
        
        
        {onRemove && (
          <button className="remove-btn" onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}>
            <X size={12} strokeWidth={3.5} />
          </button>
        )}

        {player.equippedArtifact && (
          <div className="artifact-badge" title={player.equippedArtifact.name}>
            {player.equippedArtifact.icon}
          </div>
        )}
        <div className="type-badge">
          {player.type === 'ai' ? <Cpu size={10} /> : <Users size={10} />}
        </div>
      </div>
      <span className="player-name">{player.name}</span>

      <style jsx>{`
        .slot-filled {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
          overflow: visible !important;
        }
        .avatar-wrapper { position: relative; overflow: visible !important; }
        .char-slot-preview {
          width: 50px; height: 50px; border-radius: 14px;
          background: ${player.type === 'human' ? 'linear-gradient(135deg, rgba(206,130,255,0.15), rgba(139,92,246,0.25))' : 'rgba(0,0,0,0.06)'};
          border: 3px solid ${player.type === 'human' ? '#CE82FF' : '#D1D5DB'};
          display: flex; align-items: center; justify-content: center;
          overflow: visible !important; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .char-slot-img {
          width: 90%; height: 90%; object-fit: contain; margin-top: -4px;
        }
        .remove-btn {
          position: absolute; top: -6px; right: -6px;
          background: #FF4B4B; color: white; width: 22px; height: 22px;
          border-radius: 50%; border: 2.5px solid white; 
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 20; box-shadow: 0 2px 5px rgba(255, 75, 75, 0.5);
          padding: 0; line-height: 1;
        }
        .artifact-badge {
          position: absolute; bottom: -5px; right: -5px;
          background: white; width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; border: 2px solid #f4c265;
          box-shadow: 0 3px 6px rgba(255, 150, 0, 0.3);
          z-index: 5;
        }
        .type-badge {
          position: absolute; top: 10px; left: -5px;
          background: #4B4B4B; color: white; width: 18px; height: 18px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          border: 2px solid white; z-index: 5;
        }
        .player-name {
          font-weight: 900; font-size: 0.65rem; color: #4B4B4B;
          text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          width: 60px;
        }

        :global(.slot-filled .avatar-container),
        :global(.slot-filled .avatar-container .avatar-wrapper),
        :global(.slot-filled .avatar-container .avatar-base-img) {
          border-radius: 14px !important;
        }
      `}</style>
    </div>
  );
}
