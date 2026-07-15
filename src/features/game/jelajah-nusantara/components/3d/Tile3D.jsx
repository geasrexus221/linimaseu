import React, { memo } from 'react';
import { Layers, Swords, Footprints, Vault, ChevronLeft, Waypoints, Calendar, Wind, Flame, HelpCircle } from 'lucide-react';

import { useGameStore } from '../../../../../store/useGameStore';

export const TILE_SIZE = 84;   // pixel size of one square tile
export const TILE_GAP = 6;    // gap between tiles
export const TILE_STEP = TILE_SIZE + TILE_GAP; // grid step
export const TILE_DEPTH = 12;  // depth/thickness shadow

export const TILE_CONFIG = {
  base: { bg: '#FFFFFF', side: '#B0B0B0', border: '#F59E0B' },
  jejak: { bg: '#D97706', side: '#92400E' },   // Amber/Clay
  peti: { bg: '#F59E0B', side: '#B45309' },    // Warm Gold
  kartu: { bg: '#6366F1', side: '#4338CA' },   // Indigo
  jebakan: { bg: '#EF4444', side: '#991B1B' }, // Crimson
  jebakan_mundur: { bg: '#06B6D4', side: '#0891B2' }, // Cyan
  jebakan_pijar: { bg: '#8B5CF6', side: '#6D28D9' },  // Violet
  penjaga: { bg: '#EC4899', side: '#9D174D' }, // Vibrant Rose
  warp: { bg: '#8B5CF6', side: '#5B21B6' },    // Cosmic Violet
  angin: { bg: '#94A3B8', side: '#475569' },
  situs: { bg: '#FBBF24', side: '#D97706' },
  belok: { bg: '#F97316', side: '#d1a34b' },
  biasa: { bg: '#334155', side: '#1E293B' },   // Slate Gray
  turn_indicator: { bg: '#059669', side: '#047857' },
};

const BASE_COLORS = {
  1: { bg: '#22C55E', side: '#15803D', text: '#052e16' }, // Green
  2: { bg: '#D946EF', side: '#A21CAF', text: '#4a044e' }, // Magenta
  3: { bg: '#EAB308', side: '#A16207', text: '#422006' }, // Yellow
  4: { bg: '#3B82F6', side: '#1D4ED8', text: '#172554' }, // Blue
};

const Tile3D = memo(({ tile, onClick, isTeleportActive }) => {
  const roundCount = useGameStore(state => state.roundCount || 1);
  const activeJumpingTileId = useGameStore(state => state.activeJumpingTileId);
  const isLowGraphics = useGameStore(state => state.isLowGraphics);
  const isJumpingOnThis = activeJumpingTileId === tile.id;
  const baseCfg = tile.type === 'base' ? BASE_COLORS[tile.owner] : null;
  const cfg = baseCfg || TILE_CONFIG[tile.type] || TILE_CONFIG.biasa;
  const isBase = tile.type === 'base';
  const isWarp = tile.type === 'warp';
  const isSpecial = isBase || isWarp;

  // Set colors based on active configuration
  const colorTop = cfg.bg;
  const colorSide = cfg.side;
  const colorHighlight = 'rgba(255, 255, 255, 0.15)'; // overlay highlights

  return (
    <div
      onClick={onClick}
      className={`${isTeleportActive ? 'tile-teleport-target' : ''} ${isJumpingOnThis ? 'tile-stepped-on' : ''}`.trim()}
      style={{
        position: 'absolute',
        left: tile.x * TILE_STEP,
        top: tile.y * TILE_STEP,
        width: TILE_SIZE,
        height: TILE_SIZE,
        // Cancel the global 3D board rotation so the user's pre-rendered 2.5D SVG renders flat and correct
        transform: isLowGraphics ? 'none' : 'rotateZ(-45deg) rotateX(-45deg)',
        zIndex: isTeleportActive ? 10000 : (tile.x + tile.y) * 10,
        cursor: isTeleportActive ? 'pointer' : 'default',
        pointerEvents: isTeleportActive ? 'auto' : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {/* 2.5D Isometric SVG Tile */}
      <svg 
        viewBox="0 0 84 84" 
        style={{ 
          position: 'absolute',
          width: '100%', 
          height: '100%',
          overflow: 'visible',
          filter: 'none',
        }}
      >
        {/* Path 1: Top Face main */}
        <path fill={colorTop} d="M78.71,34.33c.86.64,1.79,1.22,2.82,1.71.84.27,1.22,1.35.4,1.86-1.24.79-2.49,1.56-3.76,2.3-10.4,6.13-20.95,12.21-31.45,18.26-.97.56-2,1.03-3.02,1.5-1.22.2-1.56.55-1.02,1.06-.1.23-.05.49.15.78-.19.22.02.35.61.41.06-.37.39-.33.5,0,.62-.17.76.27.4,1.32.18,1.63.25,3.25.21,4.88,0,.62-.29,1.14-.86,1.56-.04.01-.09-.01-.13,0-.74-.16-.88-.77-.42-1.84-.29-1.65-.38-3.5-.18-5.17-.51-.09-.94-.27-1.29-.54v-1.54c-2.71-1.53-5.46-3.13-8.24-4.79l-.29.1c-10.3-5.96-20.49-11.89-30.56-17.79-.58-.45-1.05-1.01-1.4-1.69.49-.38,1.01-.7,1.54-1.02,12.33-7.53,25.16-14.31,37.59-21.67,1.59-.58,2.64-.33,4.11.39,11.39,6.7,22.87,13.25,34.27,19.92Z"/>
        
        {/* Path 2: Left Side Wall */}
        <path fill={colorSide} d="M1.2,36.71c.69.09.54.49.82.87.52.71,4.02,2.51,5.03,3.09,5.48,3.21,11.05,6.43,16.58,9.68,2.74,1.61,5.61,3.31,8.31,4.94.51.3.96.39,1.52.79,2.66,1.61,5.32,3.15,7.98,4.62l.03.5c-.4.53-.44.88-.13,1.06,1.23.4,1.44,1.32.61,2.76.29.77.21,1.35,0,2.11l.29,1.25c.77,1.62-1.01,1.86-2.17,1.45-.98-.41-1.91-.97-2.83-1.48-12.24-6.78-24.08-14.34-36.23-21.27-.45-.37-.77-.88-.93-1.44.16-2.32-.24-4.97-.01-7.25.09-.91.49-1.18,1.13-1.68Z"/>
        
        {/* Path 3: Right Side Wall */}
        <path fill={colorSide} opacity="0.85" d="M43.96,62.21c-.31-.36,0-.59.94-.7l1.19-.94c7.91-4.56,16-9.24,23.77-13.78.04-.03.06-.1.07-.19,4.35-2.18,8.57-4.76,12.73-7.36,1.19-1.44,1.45-.09.68.93.29,1.16.29,2.36,0,3.61.24,1.05.25,2.03,0,2.93-1.06,1.2-5.34,3.39-6.96,4.35-10.82,6.4-21.73,12.76-32.67,18.9.1-.34.56-.89.59-1.2.04-.43.03-1.44.04-1.98.03-.96-.29-2.82-.22-3.49.05-.4.55-.67-.16-1.08Z"/>
        
        {/* Path 4: Top Face Highlight */}
        <path fill={colorTop} opacity="0.9" d="M83.33,46.71c.11-.95-.26-2.02-.25-2.93,0-.67.28-1.56.26-2.26-.01-.44-.28-1-.25-1.37.02-.34.37-.58.47-.91.05-.16.13-.47-.16-.41-.22.15-.42.5-.62.63-2.3,1.39-4.68,2.91-7.08,4.29-1.83,1.05-3.67,2.17-5.61,2.96l.12.24c-.64.14-1.14.64-1.63.94-3.54,2.16-7.19,4.14-10.77,6.24-3.85,2.25-7.71,4.36-11.58,6.66-.36.22-1.09.91-1.26.99-.24.11-.51.02-.75.13-.14.06-.22.3-.25.31-.09.04-.36-.03-.5,0-.53.07-.75-.28-.68-1.04-.71-.58-.4-.98.93-1.21,10.1-6.02,20.43-11.77,30.57-17.75,2.51-1.48,5.03-2.95,7.5-4.5.24-.25.52-.8.27-1.09-.48-.57-2.06-1.19-2.77-1.67-.22-.14-.56-.32-.57-.62,1.15.67,4.77,2.36,5.1,3.59.07.27.14,1.02.16,1.34.11,1.66-.06,3.5-.13,5.13-.05,1.03.24,1.47-.5,2.31Z"/>
        <path fill={colorHighlight} d="M83.33,46.71c.11-.95-.26-2.02-.25-2.93,0-.67.28-1.56.26-2.26-.01-.44-.28-1-.25-1.37.02-.34.37-.58.47-.91.05-.16.13-.47-.16-.41-.22.15-.42.5-.62.63-2.3,1.39-4.68,2.91-7.08,4.29-1.83,1.05-3.67,2.17-5.61,2.96l.12.24c-.64.14-1.14.64-1.63.94-3.54,2.16-7.19,4.14-10.77,6.24-3.85,2.25-7.71,4.36-11.58,6.66-.36.22-1.09.91-1.26.99-.24.11-.51.02-.75.13-.14.06-.22.3-.25.31-.09.04-.36-.03-.5,0-.53.07-.75-.28-.68-1.04-.71-.58-.4-.98.93-1.21,10.1-6.02,20.43-11.77,30.57-17.75,2.51-1.48,5.03-2.95,7.5-4.5.24-.25.52-.8.27-1.09-.48-.57-2.06-1.19-2.77-1.67-.22-.14-.56-.32-.57-.62,1.15.67,4.77,2.36,5.1,3.59.07.27.14,1.02.16,1.34.11,1.66-.06,3.5-.13,5.13-.05,1.03.24,1.47-.5,2.31Z"/>
        
        {/* Path 5: Bottom Detail / Shadow Edge */}
        <path fill={colorSide} opacity="0.6" d="M33.45,56.08c1.92.97,3.8,2.07,5.68,3.14.25.14.63.43.93.59s1.78.8,1.84.88c.2.3-.06,1.59.07,1.74.05.06.79.12.99.2.66.25.13.36.15.73.07,1.2.06,2.19.09,3.4.01.42.24.97.22,1.36-.05.74-.68.98.17,1.83-.06.02-.13.1-.25.13-.67.14-1.34.18-2,.13-.63-.1-.7-.15-1.25-.38.59,0,1.5.11,1.94-.37s.04-.7-.03-1.09-.27-1.06-.28-1.24c-.02-.34.22-.78.22-1.12,0-.33-.23-.67-.23-1,0-.48.62-1.1.51-1.86-.09-.58-1.23-.43-1.36-1.16-.06-.36.53-.53.36-1.19-.09-.36-1.94-1.07-2.34-1.31-1.82-1.07-3.72-2.18-5.41-3.4Z"/>
      </svg>
      
      {/* TILE TYPE VECTOR INDICATORS (Floating on top of the 2.5D surface, centered at (42, 21)) */}
      {!isBase && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '25%', // Centered in the top rhombus face of the 2.5D tile
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 5,
        }}>
          {(() => {
            const iconSize = 28;
            const iconColor = '#FFFFFF';
            switch (tile.type) {
              case 'jejak':
                return <HelpCircle size={iconSize} color={iconColor} strokeWidth={2.5} />;
              case 'peti':
                return <Vault size={iconSize} color={iconColor} strokeWidth={2.5} />;
              case 'kartu':
                return <Layers size={iconSize} color={iconColor} strokeWidth={2.5} />;
              case 'jebakan':
                return <ChevronLeft size={iconSize} color={iconColor} strokeWidth={2.5} />;
              case 'jebakan_mundur':
                return <Wind size={iconSize} color={iconColor} strokeWidth={2.5} />;
              case 'jebakan_pijar':
                return <Flame size={iconSize} color={iconColor} strokeWidth={2.5} />;
              case 'penjaga':
                return <Swords size={iconSize} color={iconColor} strokeWidth={2.5} />;
              case 'warp':
                return <Waypoints size={iconSize} color={iconColor} strokeWidth={2.5} />;
              case 'turn_indicator':
                return <Calendar size={iconSize} color={iconColor} strokeWidth={2.5} />;
              default:
                return null;
            }
          })()}
        </div>
      )}

      {/* 3D hologram overlay for turn_indicator */}
      {tile.type === 'turn_indicator' && (
        <div style={{
          position: 'absolute',
          bottom: '75%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'hologramFloat 3s ease-in-out infinite'
        }}>
          <div style={{
            background: 'rgba(5, 150, 105, 0.25)',
            border: '2px solid #34D399',
            boxShadow: '0 0 15px rgba(52, 211, 153, 0.6), inset 0 0 10px rgba(52, 211, 153, 0.4)',
            borderRadius: '12px',
            padding: '6px 12px',
            color: '#FFFFFF',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '12px',
            fontWeight: 800,
            textShadow: '0 0 5px rgba(52, 211, 153, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '65px',
          }}>
            <span style={{ fontSize: '9px', opacity: 0.8, letterSpacing: '0.5px' }}>ROUND</span>
            <span style={{ fontSize: '18px', lineHeight: 1.1 }}>{roundCount}</span>
          </div>
          <div style={{
            width: '2px',
            height: '20px',
            background: 'linear-gradient(to top, rgba(52, 211, 153, 0), rgba(52, 211, 153, 0.8))',
            boxShadow: '0 0 8px rgba(52, 211, 153, 0.6)'
          }} />
          
          <style jsx global>{`
            @keyframes hologramFloat {
              0%, 100% { transform: translate(-50%, 0); }
              50% { transform: translate(-50%, -8px); }
            }
          `}</style>
        </div>
      )}

      {/* 3D FLAG FOR BASE TILES (Straight up on billboarded surface, shifted to center of top face) */}
      {isBase && tile.owner != null && (
        <div style={{
          position: 'absolute',
          bottom: '75%', // Sits above the top face
          left: '30%',
          zIndex: 50,
          pointerEvents: 'none',
        }}>
          {/* Flag Fabric (Triangular/Slanted) */}
          <div style={{
            position: 'absolute',
            left: '5px',
            bottom: '35px',
            width: '60px',
            height: '40px',
            background: cfg.bg,
            clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '8px',
            borderLeft: `3px solid rgba(255,255,255,0.7)`,
          }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '18px',
              fontWeight: 900,
              color: 'white',
              marginLeft: '-2px'
            }}>
              P{tile.owner}
            </span>
          </div>

          <div style={{
            width: '5px',
            height: '75px',
            background: 'linear-gradient(to bottom, #f0f0f0, #888, #444)',
            borderRadius: '3px',
          }} />
        </div>
      )}

      <style>{`
        .tile-teleport-target:hover {
          filter: brightness(1.25) saturate(1.2);
        }
        @keyframes tileBounce {
          0% { transform: translateZ(0px) rotateZ(-45deg) rotateX(-45deg); }
          25% { transform: translateZ(-18px) rotateZ(-45deg) rotateX(-45deg); } /* Sinks straight down into the board */
          50% { transform: translateZ(5px) rotateZ(-45deg) rotateX(-45deg); }   /* Pantul ke atas */
          75% { transform: translateZ(-1px) rotateZ(-45deg) rotateX(-45deg); }  /* Settle */
          100% { transform: translateZ(0px) rotateZ(-45deg) rotateX(-45deg); }   /* Kembali normal */
        }
        .tile-stepped-on {
          animation: tileBounce 0.68s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  );
});

export default Tile3D;
