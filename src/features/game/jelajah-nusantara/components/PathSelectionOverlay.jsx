import React from 'react';
import { useGameStore } from '../../../../store/useGameStore';
import { TILE_STEP, TILE_SIZE } from './3d/Tile3D';

export default function PathSelectionOverlay() {
  const { players, turnIdx, isChoosingPath, mapData, choosePath } = useGameStore();
  
  if (!isChoosingPath || !mapData) return null;
  
  const currentPlayer = players[turnIdx];
  const currentTile = mapData.tiles.find(t => t.id === currentPlayer.positionTileId);
  if (!currentTile || !currentTile.next) return null;

  // Koordinat dasar board (sama dengan di BoardRenderer)
  const minX = Math.min(...mapData.tiles.map(t => t.x));
  const minY = Math.min(...mapData.tiles.map(t => t.y));

  return (
    <div className="path-selection-layer">
      {currentTile.next.map((nextId) => {
        const nextTile = mapData.tiles.find(t => t.id === nextId);
        if (!nextTile) return null;

        const posX = (nextTile.x - minX) * TILE_STEP + TILE_SIZE / 2;
        const posY = (nextTile.y - minY) * TILE_STEP + TILE_SIZE / 2;

        const dx = nextTile.x - currentTile.x;
        const dy = nextTile.y - currentTile.y;
        
        // Hitung rotasi grid (Right=0, Down=90, Left=180, Up=-90)
        const rotation = Math.atan2(dy, dx) * (180 / Math.PI);

        return (
          <div 
            key={nextId}
            className="path-arrow-container"
            style={{ 
              left: posX, 
              top: posY,
              transform: `translate(-50%, -50%) translateZ(60px) rotate(${rotation}deg)`
            }}
            onClick={(e) => {
              e.stopPropagation();
              choosePath(nextId);
            }}
          >
            <div className="arrow-flat-container">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Thick black outline path rendered underneath */}
                <path 
                  d="M5 12H19M19 12L13 6M19 12L13 18" 
                  stroke="#000000" 
                  strokeWidth="7" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                {/* Main white arrow path */}
                <path 
                  d="M5 12H19M19 12L13 6M19 12L13 18" 
                  stroke="#FFFFFF" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="arrow-glow-flat" />
          </div>
        );
      })}

      <style jsx>{`
        .path-selection-layer {
          position: absolute; inset: 0; pointer-events: none; z-index: 1000;
          transform-style: preserve-3d;
        }
        .path-arrow-container {
          position: absolute;
          pointer-events: auto; cursor: pointer;
        }
        .arrow-flat-container {
          display: flex; align-items: center; justify-content: center;
          animation: arrowPulseScale 0.8s ease-in-out infinite alternate;
          z-index: 10;
        }
        .arrow-glow-flat {
          position: absolute; width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
          border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%);
          z-index: 1; pointer-events: none;
        }
        @keyframes arrowPulseScale {
          from { transform: scale(0.9); opacity: 0.7; }
          to { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
