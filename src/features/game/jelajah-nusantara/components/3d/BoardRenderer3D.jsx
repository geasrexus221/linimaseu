import React, { useMemo } from 'react';
import Tile3D, { TILE_STEP, TILE_SIZE, TILE_DEPTH } from './Tile3D';
import { useGameStore } from '../../../../../store/useGameStore';
import PawnAvatar from '../PawnAvatar';
import PathSelectionOverlay from '../PathSelectionOverlay';
import arena1Platform from '../../../../../assets/UI/Arena/arena1.svg';


const ARROW_COLOR_DEFAULT = 'rgba(255,255,255,0.75)';
const ARROW_COLOR_WARP = 'rgba(167,139,250,0.9)';


function arrowHead(sx, sy, ex, ey, size = 10) {
  const angle = Math.atan2(ey - sy, ex - sx);
  const a1 = angle - Math.PI / 6;
  const a2 = angle + Math.PI / 6;
  return `${ex},${ey} ${ex - size * Math.cos(a1)},${ey - size * Math.sin(a1)} ${ex - size * Math.cos(a2)},${ey - size * Math.sin(a2)}`;
}


function shortenLine(sx, sy, ex, ey, trimPx) {
  const dx = ex - sx;
  const dy = ey - sy;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < trimPx * 2 + 1) return { sx, sy, ex, ey };
  const ux = dx / len;
  const uy = dy / len;
  return {
    sx: sx + ux * trimPx,
    sy: sy + uy * trimPx,
    ex: ex - ux * trimPx,
    ey: ey - uy * trimPx,
  };
}

const BoardRenderer3D = React.memo(({ mapData, players = [] }) => {
  const isTeleportMode = useGameStore(state => state.isTeleportMode);
  const teleportToTile = useGameStore(state => state.teleportToTile);
  const activeJumpingTileId = useGameStore(state => state.activeJumpingTileId);
  const turnIdx = useGameStore(state => state.turnIdx);
  const isLowGraphics = useGameStore(state => state.isLowGraphics);
  const tiles = Array.isArray(mapData) ? mapData : (mapData?.tiles ?? []);

  
  const { minX, maxX, minY, maxY } = useMemo(() => {
    if (!tiles.length) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    return tiles.reduce((acc, t) => ({
      minX: Math.min(acc.minX, t.x),
      maxX: Math.max(acc.maxX, t.x),
      minY: Math.min(acc.minY, t.y),
      maxY: Math.max(acc.maxY, t.y),
    }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  }, [tiles]);

  
  const normalizedTiles = useMemo(
    () => tiles.map(t => ({ ...t, x: t.x - minX, y: t.y - minY })),
    [tiles, minX, minY]
  );

  const rangeX = maxX - minX + 1;
  const rangeY = maxY - minY + 1;
  const boardW = rangeX * TILE_STEP;
  const boardH = rangeY * TILE_STEP;

  
  const tileMap = useMemo(() => {
    const m = {};
    normalizedTiles.forEach(t => { m[t.id] = t; });
    return m;
  }, [normalizedTiles]);

  
  const connections = useMemo(() => {
    const lines = [];
    normalizedTiles.forEach(tile => {
      (tile.next || []).forEach(targetId => {
        const target = tileMap[targetId];
        if (!target) return;
        const cx1 = tile.x * TILE_STEP + TILE_SIZE / 2;
        const cy1 = tile.y * TILE_STEP + TILE_SIZE / 2;
        const cx2 = target.x * TILE_STEP + TILE_SIZE / 2;
        const cy2 = target.y * TILE_STEP + TILE_SIZE / 2;
        const trim = TILE_SIZE / 2 + 2;
        const { sx, sy, ex, ey } = shortenLine(cx1, cy1, cx2, cy2, trim);
        lines.push({
          key: `${tile.id}-${targetId}`,
          sx, sy, ex, ey,
          isWarp: tile.type === 'warp',
        });
      });
    });
    return lines;
  }, [normalizedTiles, tileMap]);

  if (!tiles.length) return null;

  const svgW = boardW + TILE_STEP;
  const svgH = boardH + TILE_STEP + TILE_DEPTH + 20;

  return (
    
    <div
      style={{
        position: 'relative',
        width: boardW,
        height: boardH,
        transformStyle: 'preserve-3d',
        overflow: 'visible',
      }}
    >
      
      {!isLowGraphics && (
        <img
          src={arena1Platform}
          alt=""
          style={{
            position: 'absolute',
            width: '130%',
            height: '130%',
            top: -450,
            left: -450,
            zIndex: -100, 
            pointerEvents: 'none',
            
            transform: 'translate3d(0, 0, -350px) rotateZ(-45deg) rotateX(-45deg) scale(1.0)',
            transformOrigin: 'center center',
          }}
        />
      )}
      
      <svg
        style={{
          position: 'absolute',
          left: -TILE_STEP / 2,
          top: -TILE_STEP / 2,
          width: svgW,
          height: svgH,
          overflow: 'visible',
          pointerEvents: 'none',
          zIndex: 500,
        }}
        viewBox={`${-TILE_STEP / 2} ${-TILE_STEP / 2} ${svgW} ${svgH}`}
      >
        {connections.map(({ key, sx, sy, ex, ey, isWarp }) => {
          const color = isWarp ? ARROW_COLOR_WARP : ARROW_COLOR_DEFAULT;
          const glowColor = isWarp ? 'rgba(167, 139, 250, 0.45)' : 'rgba(255, 255, 255, 0.3)';
          return (
            <g key={key}>
              
              <line
                x1={sx} y1={sy} x2={ex} y2={ey}
                stroke={glowColor} strokeWidth={isWarp ? 8 : 6}
              />
              <line
                x1={sx} y1={sy} x2={ex} y2={ey}
                stroke={color} strokeWidth={isWarp ? 3 : 2.5}
                strokeDasharray={isWarp ? '8 4' : 'none'}
              />
              <polygon
                points={arrowHead(sx, sy, ex, ey, 11)}
                fill={color}
              />
            </g>
          );
        })}
      </svg>

      
      {normalizedTiles.map(tile => (
        <Tile3D
          key={tile.id}
          tile={tile}
          isTeleportActive={isTeleportMode}
          onClick={() => isTeleportMode && teleportToTile(tile.id)}
        />
      ))}

      
      {players.map((p, idx) => {
        const tile = tileMap[p.positionTileId];
        if (!tile) return null;

        
        const sharingPlayers = players.filter(other => other.positionTileId === p.positionTileId);
        const offset = sharingPlayers.length > 1
          ? { x: (idx % 2) * 44 - 22, y: Math.floor(idx / 2) * 44 - 22 }
          : { x: 0, y: 0 };

        const isActivePlayer = idx === turnIdx;
        const isLanding = isActivePlayer && activeJumpingTileId !== null;

        return (
          <div
            key={p.playerNum}
            id={`pawn-${p.id}`}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate3d(${tile.x * TILE_STEP + TILE_SIZE / 2 + offset.x}px, ${tile.y * TILE_STEP + TILE_SIZE / 2 + offset.y}px, 30px) translate(-50%, -50%)`,
              transformStyle: 'preserve-3d',
              zIndex: 20000,
              transition: 'transform 0.6s cubic-bezier(0.45, 0.05, 0.55, 0.95)',
              overflow: 'visible',
              willChange: 'transform',
              pointerEvents: 'none',
            }}
          >
            
            <div
              style={{ transformStyle: 'preserve-3d', overflow: 'visible' }}
              className={p.isMoving ? 'pawn-jumping-active' : isLanding ? 'pawn-stepped-on' : ''}
            >
              
              <div style={{
                transform: isLowGraphics ? 'translateZ(25px)' : 'rotateZ(-45deg) rotateX(-45deg) translateZ(25px)',
                overflow: 'visible',
                filter: 'none',
                opacity: 1,
                transition: 'all 0.5s'
              }}>
                <PawnAvatar player={p} />
              </div>
            </div>

            <style>{`
              .pawn-jumping-active {
                animation: pawnJumpAnim 0.6s ease-in-out infinite;
              }
              @keyframes pawnJumpAnim {
                0%, 100% { transform: translateZ(0px); }
                50% { transform: translateZ(60px); }
              }
              @keyframes pawnBounce {
                0% { transform: translateZ(0px); }
                25% { transform: translateZ(-18px); } /* Sinks down matching the tile's -18px Z-axis sink */
                50% { transform: translateZ(5px); }   /* Pantul ke atas */
                75% { transform: translateZ(-1px); }  /* Settle */
                100% { transform: translateZ(0px); }  /* Kembali normal */
              }
              .pawn-stepped-on {
                animation: pawnBounce 0.68s cubic-bezier(0.25, 1, 0.5, 1) forwards;
              }
            `}</style>
          </div>
        );
      })}

      <PathSelectionOverlay />
    </div>
  );
});

export default BoardRenderer3D;
