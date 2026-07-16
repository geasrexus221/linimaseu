import React, { useMemo } from 'react';
import BoardRenderer3D from './BoardRenderer3D';
import { TILE_STEP, TILE_SIZE } from './Tile3D';
import { useGameStore } from '../../../../../store/useGameStore';


function calcFitScale(tiles, viewW, viewH) {
  if (!tiles || tiles.length === 0) return 1;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < tiles.length; i++) {
    const t = tiles[i];
    if (t.x < minX) minX = t.x;
    if (t.x > maxX) maxX = t.x;
    if (t.y < minY) minY = t.y;
    if (t.y > maxY) maxY = t.y;
  }

  const rangeX = maxX - minX + 1;
  const rangeY = maxY - minY + 1;

  const diagonal = (rangeX + rangeY) * TILE_STEP;
  const visW = diagonal * 0.75;
  const visH = diagonal * 0.45;

  const scaleToFit = Math.min(viewW / visW, viewH / visH) * 0.72;
  return Math.max(0.15, Math.min(scaleToFit, 2));
}

import backgroundImg from '../../../../../assets/game/tiles/background.png';

export default function World3D({
  mapData, viewW = 800, viewH = 600, players = [], offsetY = 0,
  isChoosingPath = false, turnIdx = 0,
  userZoom = 1, userPan = { x: 0, y: 0 },
  onUserPan, onUserZoom, isManualZooming
}) {
  const tiles = Array.isArray(mapData) ? mapData : (mapData?.tiles ?? []);
  const isAutoZoomEnabled = useGameStore(state => state.isAutoZoomEnabled);
  const phase = useGameStore(state => state.phase);
  const setAutoZoomEnabled = useGameStore(state => state.setAutoZoomEnabled);
  const isTeleportMode = useGameStore(state => state.isTeleportMode);
  const isLowGraphics = useGameStore(state => state.isLowGraphics);

  const [isDragging, setIsDragging] = React.useState(false);
  const lastPointer = React.useRef({ x: 0, y: 0 });

  const panRef = React.useRef({ x: userPan.x, y: userPan.y });
  const zoomRef = React.useRef(userZoom);
  const isDraggingRef = React.useRef(false);

  React.useEffect(() => {
    panRef.current = { x: userPan.x, y: userPan.y };
  }, [userPan.x, userPan.y]);

  React.useEffect(() => {
    zoomRef.current = userZoom;
  }, [userZoom]);

  
  const currentPlayer = players[turnIdx];
  const isEventActive = phase === 'SHOWING_EVENT';
  const movingPlayer = players.find(p => p.isMoving) || (isChoosingPath || isEventActive ? currentPlayer : null);
  const activeTile = tiles.find(t => t.id === (movingPlayer ? movingPlayer.positionTileId : currentPlayer.positionTileId));

  
  const baseScale = useMemo(() => calcFitScale(tiles, viewW, viewH), [tiles, viewW, viewH]);

  
  const isMobile = viewW < 600;
  const minIdleScale = isMobile ? 1.35 : 1.2;
  const minFocusScale = isMobile ? 2.0 : 1.65;
  const autoFocusScale = Math.max(baseScale * 2.2, minFocusScale);

  
  const currentScale = isAutoZoomEnabled
    ? (movingPlayer ? autoFocusScale : Math.max(userZoom, minIdleScale))
    : userZoom;

  let followOffset = { x: 0, y: 0 };
  
  if (isAutoZoomEnabled && activeTile) {
    const minX = Math.min(...tiles.map(t => t.x));
    const minY = Math.min(...tiles.map(t => t.y));
    const normX = activeTile.x - minX;
    const normY = activeTile.y - minY;
    const rangeX = Math.max(...tiles.map(t => t.x)) - minX + 1;
    const rangeY = Math.max(...tiles.map(t => t.y)) - minY + 1;

    const pxX = normX * TILE_STEP + TILE_SIZE / 2;
    const pxY = normY * TILE_STEP + TILE_SIZE / 2;
    const centerX = (rangeX * TILE_STEP) / 2;
    const centerY = (rangeY * TILE_STEP) / 2;

    followOffset = { x: (centerX - pxX), y: (centerY - pxY) };
  }

  const activePointers = React.useRef([]);
  const prevDiff = React.useRef(-1);

  
  const handleWheel = (e) => {
    if (movingPlayer) return;
    
    
    if (isAutoZoomEnabled) {
      setAutoZoomEnabled(false);
    }
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const minZoom = Math.min(0.4, baseScale);
    onUserZoom?.(Math.max(minZoom, Math.min(userZoom * delta, 3.5)));
  };

  const handlePointerDown = (e) => {
    if (movingPlayer) return;
    
    
    if (isTeleportMode && e.target.closest('.tile-teleport-target')) {
      return;
    }
    
    
    activePointers.current.push({ id: e.pointerId, x: e.clientX, y: e.clientY });
    
    isDraggingRef.current = true;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    
    if (activePointers.current.length === 1) {
      lastPointer.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || movingPlayer || phase === 'ROLLING') return;

    
    const pointer = activePointers.current.find(p => p.id === e.pointerId);
    if (pointer) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }

    
    if (activePointers.current.length === 2) {
      
      if (isAutoZoomEnabled) {
        setAutoZoomEnabled(false);
      }

      const p1 = activePointers.current[0];
      const p2 = activePointers.current[1];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (prevDiff.current > 0) {
        
        const factor = dist / prevDiff.current;
        const minZoom = Math.min(0.4, baseScale);
        const newZoom = Math.max(minZoom, Math.min(zoomRef.current * factor, 3.5));
        zoomRef.current = newZoom;

        const zoomEl = document.getElementById('world-zoom-container');
        if (zoomEl) {
          zoomEl.style.transform = `translate3d(0, ${offsetY}px, 0) scale(${newZoom})`;
        }
      }
      prevDiff.current = dist;
      return; 
    }

    
    if (activePointers.current.length === 1) {
      const deltaX = e.clientX - lastPointer.current.x;
      const deltaY = e.clientY - lastPointer.current.y;
      const pixelDist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      
      if (pixelDist < 8) return;

      
      if (isAutoZoomEnabled) {
        setAutoZoomEnabled(false);
      }

      let dx = deltaX / currentScale;
      let dy = deltaY / currentScale;
      dy = dy / Math.cos(55 * Math.PI / 180);
      const angle = -45 * (Math.PI / 180);
      const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
      const ry = dx * Math.sin(angle) + dy * Math.cos(angle);

      
      const panLimit = viewW < 1024 ? 400 : 800; 
      const newX = Math.max(-panLimit, Math.min(panRef.current.x + rx, panLimit));
      const newY = Math.max(-panLimit, Math.min(panRef.current.y + ry, panLimit));

      panRef.current = { x: newX, y: newY };

      const dragEl = document.getElementById('world-drag-container');
      if (dragEl) {
        const rot = isLowGraphics ? '' : 'rotateX(55deg) rotateZ(45deg) ';
        dragEl.style.transform = `${rot}translate3d(${followOffset.x + (movingPlayer ? 0 : newX)}px, ${followOffset.y + (movingPlayer ? 0 : newY)}px, 0)`;
      }

      lastPointer.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e) => {
    
    activePointers.current = activePointers.current.filter(p => p.id !== e.pointerId);
    
    if (activePointers.current.length < 2) {
      prevDiff.current = -1;
    }
    if (activePointers.current.length === 0) {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        onUserPan?.(panRef.current);
        onUserZoom?.(zoomRef.current);
      }
    }
    
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  return (
    <div
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, #1b6ca8 0%, #0e3150 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        perspective: '1200px',
      }}
    >
      


      
      <div
        id="world-zoom-container"
        style={{
          transform: `translate3d(0, ${offsetY}px, 0) scale(${currentScale})`,
          transformOrigin: 'center center',
          transition: (!isDragging) ? 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
        }}
      >
        <div
          id="world-drag-container"
          style={{
            transform: `${isLowGraphics ? '' : 'rotateX(55deg) rotateZ(45deg) '}translate3d(${followOffset.x + (movingPlayer ? 0 : userPan.x)}px, ${followOffset.y + (movingPlayer ? 0 : userPan.y)}px, 0)`,
            transformStyle: isLowGraphics ? 'flat' : 'preserve-3d',
            transition: (!isDragging) ? 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            willChange: 'transform',
          }}
        >
          <BoardRenderer3D mapData={mapData} players={players} />
        </div>
      </div>

      <style>{`
      `}</style>
    </div>
  );
}
