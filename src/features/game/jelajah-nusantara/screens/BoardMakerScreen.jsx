import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Move } from 'lucide-react';
import { useNavigationStore } from '../../../../store/useNavigationStore';
import { useMakerStore } from '../../../../store/useMakerStore';
import { useRegisterRightPanel } from '../../../../hooks/useRegisterRightPanel';
import BoardMakerSidebarPanel from '../../../../components/layout/BoardMakerSidebarPanel';


const TILE_TYPES = {
  base:    { name: 'Markas',          color: '#FFFFFF', border: '#F59E0B', textColor: '#92400E' },
  jejak:   { name: 'Jejak Masa Lalu', color: '#3B82F6', border: '#1D4ED8', textColor: '#fff'    },
  peti:    { name: 'Peti Harta',      color: '#F59E0B', border: '#B45309', textColor: '#fff'    },
  kartu:   { name: 'Kotak Kartu',     color: '#10B981', border: '#047857', textColor: '#fff'    },
  jebakan: { name: 'Jebakan Duri (-Tekad)', color: '#EF4444', border: '#B91C1C', textColor: '#fff' },
  jebakan_mundur: { name: 'Jebakan Angin (Mundur)', color: '#06B6D4', border: '#0891B2', textColor: '#fff' },
  jebakan_pijar: { name: 'Jebakan Pijar (-1 Pijar)', color: '#8B5CF6', border: '#6D28D9', textColor: '#fff' },
  penjaga: { name: 'Tantangan Penjaga', color: '#F43F5E', border: '#BE123C', textColor: '#fff'    },
  warp:    { name: 'Lubang Waktu',    color: '#8B5CF6', border: '#5B21B6', textColor: '#fff'    },
  angin:   { name: 'Angin Ribut',     color: '#94A3B8', border: '#475569', textColor: '#fff'    },
  situs:   { name: 'Situs Rahasia',   color: '#FBBF24', border: '#D97706', textColor: '#fff'    },
  biasa:   { name: 'Petak Biasa',     color: '#4B5563', border: '#1F2937', textColor: '#fff'    },
};

const CELL_SIZE  = 64;  
const GRID_COLS  = 20;
const GRID_ROWS  = 15;
const CANVAS_W   = GRID_COLS * CELL_SIZE;
const CANVAS_H   = GRID_ROWS * CELL_SIZE;


function arrowHead(sx, sy, ex, ey, size = 9) {
  const angle = Math.atan2(ey - sy, ex - sx);
  const a1 = angle - Math.PI / 6;
  const a2 = angle + Math.PI / 6;
  return `${ex},${ey} ${ex - size * Math.cos(a1)},${ey - size * Math.sin(a1)} ${ex - size * Math.cos(a2)},${ey - size * Math.sin(a2)}`;
}
function shrinkLine(sx, sy, ex, ey, trim) {
  const dx = ex - sx; const dy = ey - sy;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < trim * 2 + 1) return { sx, sy, ex, ey };
  const ux = dx / len; const uy = dy / len;
  return { sx: sx + ux * trim, sy: sy + uy * trim, ex: ex - ux * trim, ey: ey - uy * trim };
}

export default function BoardMakerScreen() {
  const { setJelajahSubView } = useNavigationStore();
  const { 
    tiles, addTile, updateTile, deleteTile, toggleConnection,
    tool, activeTileType, zoom, setZoom
  } = useMakerStore();

  
  useRegisterRightPanel(BoardMakerSidebarPanel, 'board-maker');

  const [connectFrom, setConnectFrom] = useState(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const viewportRef = useRef(null);
  const touchState = useRef({ initialDist: 0, initialZoom: 1, isPinching: false });

  
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        touchState.current.initialDist = dist;
        touchState.current.initialZoom = zoom;
        touchState.current.isPinching = true;
      }
    };
    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && touchState.current.isPinching) {
        const dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        const delta = dist / touchState.current.initialDist;
        const newZoom = Math.min(2.5, Math.max(0.4, touchState.current.initialZoom * delta));
        setZoom(+(newZoom.toFixed(2)));
      }
    };
    viewport.addEventListener('touchstart', handleTouchStart, { passive: false });
    viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      viewport.removeEventListener('touchstart', handleTouchStart);
      viewport.removeEventListener('touchmove', handleTouchMove);
    };
  }, [zoom, setZoom]);

  
  useEffect(() => {
    return () => {
      
      
      
    };
  }, []);



  const handleCellClick = (x, y) => {
    const existing = tiles.find(t => t.x === x && t.y === y);

    if (tool === 'place') {
      if (!existing) {
        let owner = null;
        if (activeTileType === 'base') {
          const usedOwners = tiles.filter(t => t.type === 'base').map(t => t.owner);
          if (usedOwners.length >= 4) return;
          for (let i = 1; i <= 4; i++) { if (!usedOwners.includes(i)) { owner = i; break; } }
        }
        addTile({ id: Date.now(), type: activeTileType, x, y, owner, next: [] });
      } else {
        let owner = existing.owner;
        if (activeTileType === 'base' && existing.type !== 'base') {
          const usedOwners = tiles.filter(t => t.type === 'base').map(t => t.owner);
          if (usedOwners.length >= 4) return;
          for (let i = 1; i <= 4; i++) { if (!usedOwners.includes(i)) { owner = i; break; } }
        } else if (activeTileType !== 'base') {
          owner = null;
        }
        updateTile(existing.id, { type: activeTileType, owner });
      }
    } else if (tool === 'erase') {
      if (existing) deleteTile(existing.id);
    } else if (tool === 'connect') {
      if (!existing) { setConnectFrom(null); return; }
      if (connectFrom === null) {
        setConnectFrom(existing.id);
      } else {
        if (connectFrom !== existing.id) {
          toggleConnection(connectFrom, existing.id);
        }
        setConnectFrom(null);
      }
    }
  };

  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.code === 'Space') setIsSpacePressed(true); };
    const handleKeyUp = (e) => { if (e.code === 'Space') setIsSpacePressed(false); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseDown = (e) => {
    
    
    
    
    
    
    const isBackground = e.target.classList.contains('canvas-viewport') || 
                         e.target.classList.contains('canvas-centering') || 
                         e.target.tagName === 'svg';
    const isPanTool = tool === 'pan';
    if (e.button === 1 || e.button === 2 || (e.button === 0 && (isSpacePressed || isBackground || isPanTool))) {
      isDragging.current = true;
      startPos.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y
      };
      viewportRef.current.style.cursor = 'grabbing';
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setPan({
      x: startPos.current.panX + dx,
      y: startPos.current.panY + dy
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (viewportRef.current) viewportRef.current.style.cursor = (isSpacePressed || tool === 'pan') ? 'grab' : 'auto';
  };



  return (
    <div className="maker-container">
      <div className="canvas-area">
        <div className="canvas-header">
          <button onClick={() => setJelajahSubView('intro')} className="back-btn-minimal">
            <ChevronLeft size={20} />
            <span>Keluar Editor</span>
          </button>
          
          <div className="header-tool-status">
            {tool === 'place' ? (
              `🔧 Menggambar: ${TILE_TYPES[activeTileType]?.name || 'Petak'}`
            ) : tool === 'connect' ? '🔗 Membuat Jalur' : '🧹 Menghapus'}
          </div>

          <div className="header-spacer" />
        </div>

        <div 
          className="canvas-viewport" 
          ref={viewportRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()} 
          style={{ cursor: (isSpacePressed || tool === 'pan') ? 'grab' : 'auto' }}
        >
          <div className="canvas-centering">
            <div
              className="canvas-grid"
              style={{
                width: CANVAS_W, height: CANVAS_H,
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
            >
              <svg className="canvas-svg-layer">
                
                <line x1={CANVAS_W/2} y1={0} x2={CANVAS_W/2} y2={CANVAS_H} stroke="rgba(59,130,246,0.15)" strokeDasharray="5 5" />
                <line x1={0} y1={CANVAS_H/2} x2={CANVAS_W} y2={CANVAS_H/2} stroke="rgba(59,130,246,0.15)" strokeDasharray="5 5" />

                
                {Array.from({ length: GRID_ROWS }).map((_, r) => 
                  Array.from({ length: GRID_COLS }).map((_, c) => (
                    <rect 
                      key={`grid-${c}-${r}`} 
                      x={c * CELL_SIZE} y={r * CELL_SIZE} 
                      width={CELL_SIZE} height={CELL_SIZE} 
                      fill="transparent" 
                      onClick={() => handleCellClick(c, r)}
                      className="grid-cell"
                    />
                  ))
                ).flat()}

                
                {tiles.map(t => (t.next || []).map(nextId => {
                  const target = tiles.find(tt => tt.id === nextId);
                  if (!target) return null;
                  const cx1 = t.x * CELL_SIZE + CELL_SIZE/2;
                  const cy1 = t.y * CELL_SIZE + CELL_SIZE/2;
                  const cx2 = target.x * CELL_SIZE + CELL_SIZE/2;
                  const cy2 = target.y * CELL_SIZE + CELL_SIZE/2;
                  const pts = shrinkLine(cx1, cy1, cx2, cy2, CELL_SIZE/2 - 4);
                  const isWarp = t.type === 'warp';
                  const color = isWarp ? '#A78BFA' : 'rgba(255,255,255,0.6)';
                  return (
                    <g key={`conn-${t.id}-${nextId}`} className="connection-line" onClick={(e) => { e.stopPropagation(); toggleConnection(t.id, nextId); }}>
                      <line x1={pts.sx} y1={pts.sy} x2={pts.ex} y2={pts.ey} stroke={color} strokeWidth={3} strokeDasharray={isWarp ? '8 4' : 'none'} />
                      <polygon points={arrowHead(pts.sx, pts.sy, pts.ex, pts.ey)} fill={color} />
                    </g>
                  );
                })).flat()}
              </svg>

              
              {tiles.map(tile => {
                const cfg = TILE_TYPES[tile.type] || TILE_TYPES.biasa;
                const isConnecting = connectFrom === tile.id;
                return (
                  <div 
                    key={tile.id} 
                    className={`tile-item ${isConnecting ? 'connecting' : ''} ${tool}`}
                    onClick={(e) => { e.stopPropagation(); handleCellClick(tile.x, tile.y); }}
                    style={{
                      left: tile.x * CELL_SIZE + 6, top: tile.y * CELL_SIZE + 6,
                      width: CELL_SIZE - 12, height: CELL_SIZE - 12,
                      background: cfg.color, border: `2.5px solid ${cfg.border}`,
                      boxShadow: `0 4px 0 ${cfg.border}`
                    }}
                  >
                    {tile.type === 'base' && <span className="tile-owner">P{tile.owner}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        
        <div className="canvas-floating-controls">
          
          <div className="pan-controls-floating">
            <button onClick={() => setPan(p => ({ ...p, y: p.y + 100 }))} className="pan-arrow-btn" title="Geser ke Atas"><ChevronUp size={16} /></button>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button onClick={() => setPan(p => ({ ...p, x: p.x + 100 }))} className="pan-arrow-btn" title="Geser ke Kiri"><ChevronLeft size={16} /></button>
              <div className="pan-center-indicator"><Move size={12} color="rgba(255,255,255,0.4)" /></div>
              <button onClick={() => setPan(p => ({ ...p, x: p.x - 100 }))} className="pan-arrow-btn" title="Geser ke Kanan"><ChevronRight size={16} /></button>
            </div>
            <button onClick={() => setPan(p => ({ ...p, y: p.y - 100 }))} className="pan-arrow-btn" title="Geser ke Bawah"><ChevronDown size={16} /></button>
          </div>

          <div className="zoom-controls-floating">
            <button onClick={() => setZoom(Math.max(0.4, zoom - 0.1))} className="zoom-btn">−</button>
            <span className="zoom-val">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(2.5, zoom + 0.1))} className="zoom-btn">+</button>
          </div>
          
          <div className="panning-hint">
            Geser peta dengan <strong>Tombol Arah</strong> atau gunakan tool <strong>Geser Peta ✋</strong>
          </div>
        </div>
      </div>

      <style jsx>{`
        .maker-container { 
          position: relative; flex: 1; display: flex; 
          background: #0f172a; color: white; overflow: hidden;
          font-family: 'Outfit', sans-serif;
          height: 100%; width: 100%;
        }
        .canvas-area { flex: 1; display: flex; flex-direction: column; }
        
        .canvas-header { 
          padding: 10px 24px; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px);
          border-bottom: 2px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between;
          z-index: 100;
        }
        
        .back-btn-minimal { 
          background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); 
          border-radius: 12px; color: white; padding: 6px 14px; cursor: pointer;
          display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 0.8rem;
          transition: all 0.2s;
        }
        .back-btn-minimal:hover { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; color: #ef4444; }

        .header-tool-status { 
          background: rgba(59, 130, 246, 0.1); color: #3b82f6; 
          padding: 6px 20px; border-radius: 50px; font-weight: 900; 
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;
        }
        
        .header-spacer { width: 120px; }
        
        .zoom-controls-floating { 
          display: flex; align-items: center; gap: 12px; background: rgba(15, 23, 42, 0.9); 
          padding: 8px 18px; border-radius: 16px; border: 2px solid rgba(255,255,255,0.1); 
          backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .zoom-btn { background: none; border: none; color: white; font-size: 1.4rem; font-weight: 900; cursor: pointer; padding: 0 4px; transition: transform 0.2s; }
        .zoom-btn:hover { transform: scale(1.2); color: #3b82f6; }
        .zoom-val { font-size: 0.9rem; font-weight: 900; min-width: 50px; text-align: center; color: white; }

        .canvas-floating-controls {
          position: absolute; bottom: 24px; right: 24px;
          display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
          z-index: 1000;
        }

        .panning-hint {
          background: rgba(0, 0, 0, 0.6); color: rgba(255,255,255,0.8);
          padding: 6px 14px; border-radius: 50px; font-size: 0.7rem; font-weight: 700;
          backdrop-filter: blur(4px); pointer-events: none;
          border: 1px solid rgba(255,255,255,0.1);
          text-align: center;
        }

        .pan-controls-floating {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: rgba(15, 23, 42, 0.9);
          padding: 10px;
          border-radius: 18px;
          border: 2px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          margin-bottom: 6px;
        }
        .pan-arrow-btn {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .pan-arrow-btn:hover {
          background: #3b82f6;
          border-color: #3b82f6;
          transform: scale(1.1);
        }
        .pan-center-indicator {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .canvas-viewport { 
          flex: 1; overflow: hidden; background: #020617; position: relative; 
          user-select: none;
          display: flex; align-items: center; justify-content: center;
        }
        .canvas-centering { position: relative; display: flex; align-items: center; justify-content: center; }
        
        .canvas-grid {
          position: relative; transform-origin: center center;
          background: #0f172a;
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: ${CELL_SIZE}px ${CELL_SIZE}px;
          border: 2px solid #1e293b;
          box-shadow: 0 0 100px rgba(0,0,0,0.5);
        }

        .canvas-svg-layer { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; z-index: 1; }
        .grid-cell { cursor: crosshair; }
        .grid-cell:hover { fill: rgba(59, 130, 246, 0.05); }

        .tile-item { 
          position: absolute; border-radius: 12px; display: flex; 
          align-items: center; justify-content: center; cursor: pointer; 
          transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          z-index: 5; 
        }
        .tile-item:hover { transform: scale(1.1) translateY(-2px); }
        .tile-item.connecting { outline: 4px solid white; outline-offset: 4px; animation: pulse 1s infinite; z-index: 10; }
        .tile-item.erase:hover { border-color: #ef4444 !important; box-shadow: 0 4px 0 #ef4444 !important; }
        
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1.1); } 50% { opacity: 0.7; transform: scale(1); } }
        
        .tile-owner { font-size: 1rem; font-weight: 900; color: #1e293b; }
        
        .connection-line { cursor: pointer; }
        .connection-line:hover line { stroke-width: 5; stroke: #ef4444; }
        .connection-line:hover polygon { fill: #ef4444; }
      `}</style>
    </div>
  );
}
