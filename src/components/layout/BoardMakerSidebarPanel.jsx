import React, { useState } from 'react';
import { 
  Save, Trash2, MousePointer2, ArrowRight, Download, 
  Map as MapIcon, RotateCcw, Eye, AlertTriangle, CheckCircle,
  FolderOpen, X, Play, Upload, Hand
} from 'lucide-react';
import { useMakerStore } from '../../store/useMakerStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useGameStore } from '../../store/useGameStore';
import { mapManager } from '../../features/game/jelajah-nusantara/utils/mapManager';

const TILE_TYPES = {
  base:    { name: 'Markas',            color: '#FFFFFF', border: '#F59E0B' },
  jejak:   { name: 'Jejak Masa Lalu',   color: '#3B82F6', border: '#1D4ED8' },
  peti:    { name: 'Peti Harta',        color: '#F59E0B', border: '#B45309' },
  kartu:   { name: 'Kotak Kartu',       color: '#10B981', border: '#047857' },
  jebakan: { name: 'Jebakan Duri (-Tekad)', color: '#EF4444', border: '#B91C1C' },
  jebakan_mundur: { name: 'Jebakan Angin (Mundur)', color: '#06B6D4', border: '#0891B2' },
  jebakan_pijar: { name: 'Jebakan Pijar (-1 Pijar)', color: '#8B5CF6', border: '#6D28D9' },
  penjaga: { name: 'Tantangan Penjaga', color: '#F43F5E', border: '#BE123C' },
  warp:    { name: 'Lubang Waktu',      color: '#8B5CF6', border: '#5B21B6' },
  angin:   { name: 'Angin Ribut',       color: '#94A3B8', border: '#475569' },
  situs:   { name: 'Situs Rahasia',     color: '#FBBF24', border: '#D97706' },
  biasa:   { name: 'Petak Biasa',       color: '#4B5563', border: '#1F2937' },
  turn_indicator: { name: 'Indikator Turn', color: '#10B981', border: '#FBBF24' },
};

export default function BoardMakerSidebarPanel() {
  const { setJelajahSubView } = useNavigationStore();
  const { initGame } = useGameStore();
  const { 
    mapName, setMapName, tiles, tool, setTool, 
    activeTileType, setActiveTileType, botCount, setBotCount,
    undo, history, resetMaker
  } = useMakerStore();

  const [showCollection, setShowCollection] = useState(false);
  const [allMaps, setAllMaps] = useState([]);
  const [botCount_, setBotCount_] = useState(botCount); 

  
  const baseCount = tiles.filter(t => t.type === 'base').length;
  const disconnected = tiles.filter(t => {
    const hasOutgoing = (t.next || []).length > 0;
    const hasIncoming = tiles.some(other => (other.next || []).includes(t.id));
    return !hasOutgoing && !hasIncoming && t.type !== 'base' && t.type !== 'turn_indicator';
  }).length;

  const handleSave = () => {
    if (tiles.length === 0) return alert('Papan masih kosong!');
    const saved = mapManager.saveCustomMap(mapName, { name: mapName, tiles });
    if (saved) alert(`Peta "${mapName}" berhasil disimpan!`);
  };

  const handlePreview = () => {
    if (tiles.length === 0) return alert('Papan masih kosong!');
    mapManager.saveTestMap(tiles);
    const testPlayers = [{ id: 'p1', name: 'Tester', type: 'human' }];
    for (let i = 0; i < botCount; i++) {
      testPlayers.push({ id: `bot${i + 1}`, name: `Bot ${i + 1}`, type: 'ai' });
    }
    initGame({ tiles }, testPlayers);
    setJelajahSubView('playing_test');
  };

  const handleExport = () => {
    if (tiles.length === 0) return alert('Papan masih kosong!');
    const dataStr = JSON.stringify({ name: mapName, tiles }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mapName.replace(/\s+/g, '_').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openCollection = () => {
    setAllMaps(mapManager.getAllMaps());
    setShowCollection(true);
  };

  const handleTestMap = (mapData) => {
    const tilesToTest = Array.isArray(mapData) ? mapData : mapData?.tiles;
    if (!tilesToTest || tilesToTest.length === 0) return alert('Peta ini tidak memiliki data petak!');
    mapManager.saveTestMap(tilesToTest);
    const testPlayers = [{ id: 'p1', name: 'Tester', type: 'human' }];
    for (let i = 0; i < botCount; i++) {
      testPlayers.push({ id: `bot${i + 1}`, name: `Bot ${i + 1}`, type: 'ai' });
    }
    initGame({ tiles: tilesToTest }, testPlayers);
    setJelajahSubView('playing_test');
    setShowCollection(false);
  };

  const handleLoadMap = (map) => {
    if (tiles.length > 0 && !window.confirm('Muat peta ini? Progres saat ini akan hilang.')) return;
    const { setMapData } = useMakerStore.getState();
    setMapData(map.data);
    setMapName(map.name);
    setShowCollection(false);
  };

  const handleDeleteMap = (id) => {
    if (!window.confirm('Hapus peta ini secara permanen?')) return;
    mapManager.deleteCustomMap(id);
    setAllMaps(mapManager.getAllMaps());
  };

  return (
    <div className="maker-sidebar-panel">
      
      <div className="panel-header">
        <div className="header-icon"><MapIcon size={20} color="#3b82f6" /></div>
        <div className="header-text">
          <h4>Editor Peta</h4>
          <span className="status-pill">{tiles.length} Petak</span>
        </div>
      </div>

      <div className="panel-scroll-content">
        
        <div className="editor-group">
          <label className="group-label">NAMA PETA</label>
          <input 
            className="editor-input" 
            value={mapName} 
            onChange={e => setMapName(e.target.value)} 
            placeholder="Ketik nama peta..."
          />
        </div>

        
        <div className="editor-group">
          <label className="group-label">TOOLS UTAMA</label>
          <div className="tools-stack">
            {[
              { id: 'place',   Icon: MousePointer2, label: 'Tempatkan / Ganti' },
              { id: 'connect', Icon: ArrowRight,     label: 'Buat Panah Arah' },
              { id: 'erase',   Icon: Trash2,         label: 'Hapus Elemen' },
              { id: 'pan',     Icon: Hand,           label: 'Geser Peta (Pan)' }
            ].map(t => (
              <button 
                key={t.id}
                className={`tool-row-btn ${tool === t.id ? 'active' : ''}`}
                onClick={() => setTool(t.id)}
              >
                <t.Icon size={15} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        
        <div className="editor-group">
          <label className="group-label">JENIS PETAK</label>
          <div className="palette-grid">
            {Object.entries(TILE_TYPES).map(([key, cfg]) => (
              <button
                key={key}
                className={`palette-item ${activeTileType === key && tool === 'place' ? 'active' : ''}`}
                onClick={() => { setActiveTileType(key); setTool('place'); }}
                style={{ '--tile-color': cfg.color }}
              >
                <div className="color-dot" style={{ background: cfg.color, border: `1px solid ${cfg.border}` }} />
                <span>{cfg.name}</span>
              </button>
            ))}
          </div>
        </div>

        
        <div className="editor-group status-box">
          <label className="group-label">VALIDASI</label>
          <div className="status-list">
            {baseCount === 0 ? (
              <div className="status-item warn"><AlertTriangle size={13} /> <span>Belum ada Markas</span></div>
            ) : (
              <div className="status-item ok"><CheckCircle size={13} /> <span>{baseCount} Markas Siap</span></div>
            )}
            {disconnected > 0 && (
              <div className="status-item error"><AlertTriangle size={13} /> <span>{disconnected} Petak Terputus</span></div>
            )}
          </div>
        </div>

        
        <div className="editor-group">
          <label className="group-label">BOT UNTUK TEST</label>
          <div className="bot-selector">
            {[0, 1, 2, 3].map(n => (
              <button 
                key={n} 
                className={`bot-btn ${botCount === n ? 'active' : ''}`}
                onClick={() => setBotCount(n)}
              >
                {n === 0 ? 'No Bot' : `${n} Bot`}
              </button>
            ))}
          </div>
        </div>
      </div>

      
      <div className="panel-footer-actions">
        
        <button className="primary-action-btn preview" onClick={handlePreview}>
          <Eye size={17} /> <span>Preview Papan Ini</span>
        </button>

        
        <button className="primary-action-btn collection" onClick={openCollection}>
          <FolderOpen size={17} /> <span>Koleksi Peta Saya</span>
        </button>

        
        <div className="action-grid">
          <button className="action-btn-mini" onClick={handleSave} title="Simpan">
            <Save size={15} /><span>Simpan</span>
          </button>
          <button className="action-btn-mini" onClick={undo} disabled={history.length === 0} title="Undo">
            <RotateCcw size={15} /><span>Undo</span>
          </button>
          <button className="action-btn-mini" onClick={handleExport} title="Export JSON">
            <Download size={15} /><span>Export</span>
          </button>
          <button className="action-btn-mini danger" onClick={() => window.confirm('Reset semua petak?') && resetMaker()} title="Reset">
            <Trash2 size={15} /><span>Reset</span>
          </button>
        </div>
      </div>

      
      {showCollection && (
        <div className="collection-overlay" onClick={(e) => e.target === e.currentTarget && setShowCollection(false)}>
          <div className="collection-modal">
            <div className="modal-header">
              <div className="modal-title">
                <FolderOpen size={18} color="#8b5cf6" />
                <h3>Koleksi Peta</h3>
              </div>
              <button className="modal-close" onClick={() => setShowCollection(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {allMaps.length === 0 ? (
                <div className="empty-collection">
                  <MapIcon size={32} strokeWidth={1} />
                  <p>Belum ada peta tersimpan</p>
                </div>
              ) : (
                allMaps.map(map => (
                  <div key={map.id} className="map-card">
                    <div className="map-card-info">
                      <div className="map-card-name">{map.name}</div>
                      <div className="map-card-meta">
                        {map.isCustom 
                          ? `Dibuat: ${new Date(map.createdAt).toLocaleDateString('id-ID')}`
                          : '🏛️ Peta Resmi Game'
                        }
                      </div>
                    </div>
                    <div className="map-card-actions">
                      <button 
                        className="map-action-btn test" 
                        onClick={() => handleTestMap(map.data)}
                        title="Test peta ini"
                      >
                        <Play size={13} /> Tes
                      </button>
                      <button 
                        className="map-action-btn load" 
                        onClick={() => handleLoadMap(map)}
                        title="Muat ke editor"
                      >
                        <Upload size={13} /> Buka
                      </button>
                      {map.isCustom && (
                        <button 
                          className="map-action-btn delete" 
                          onClick={() => handleDeleteMap(map.id)}
                          title="Hapus peta ini"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .maker-sidebar-panel {
          display: flex; flex-direction: column; height: 100%; gap: 16px; position: relative;
        }
        .panel-header { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .header-icon { width: 38px; height: 38px; border-radius: 12px; background: rgba(59,130,246,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .header-text h4 { margin: 0; font-size: 0.95rem; font-weight: 900; color: var(--text-color); }
        .status-pill { font-size: 0.6rem; font-weight: 900; color: #3b82f6; background: rgba(59,130,246,0.08); padding: 2px 8px; border-radius: 50px; }

        .panel-scroll-content { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding-right: 4px; min-height: 0; }
        .panel-scroll-content::-webkit-scrollbar { width: 3px; }
        .panel-scroll-content::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }

        .editor-group { display: flex; flex-direction: column; gap: 7px; }
        .group-label { font-size: 0.6rem; font-weight: 900; color: var(--text-muted); letter-spacing: 1px; }

        .editor-input {
          background: var(--card-bg); border: 2px solid var(--border-color);
          padding: 9px 13px; border-radius: 12px; font-family: inherit;
          font-weight: 700; font-size: 0.82rem; color: var(--text-color); outline: none; width: 100%; box-sizing: border-box;
        }
        .editor-input:focus { border-color: #3b82f6; }

        .tools-stack { display: flex; flex-direction: column; gap: 5px; }
        .tool-row-btn {
          display: flex; align-items: center; gap: 10px; padding: 9px 13px;
          background: var(--card-bg); border: 2px solid var(--border-color);
          border-radius: 12px; color: var(--text-color); font-weight: 700;
          font-size: 0.75rem; cursor: pointer; transition: all 0.15s;
        }
        .tool-row-btn.active { background: rgba(59,130,246,0.1); border-color: #3b82f6; color: #3b82f6; }

        .palette-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
        .palette-item {
          display: flex; align-items: center; gap: 7px; padding: 7px 9px;
          background: var(--card-bg); border: 2px solid var(--border-color);
          border-radius: 10px; cursor: pointer; font-size: 0.65rem; font-weight: 800;
          color: var(--text-color); text-align: left; transition: all 0.15s;
        }
        .palette-item.active { border-color: var(--tile-color); }
        .color-dot { width: 11px; height: 11px; border-radius: 3px; flex-shrink: 0; }

        .status-box { background: rgba(0,0,0,0.04); padding: 10px; border-radius: 12px; border: 1px dashed var(--border-color); }
        .status-list { display: flex; flex-direction: column; gap: 5px; }
        .status-item { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; font-weight: 800; }
        .status-item.warn { color: #f59e0b; }
        .status-item.ok { color: #10b981; }
        .status-item.error { color: #ef4444; }

        .bot-selector { display: flex; gap: 5px; }
        .bot-btn {
          flex: 1; padding: 7px 4px; border-radius: 9px; border: 2px solid var(--border-color);
          background: var(--card-bg); color: var(--text-color); font-weight: 900;
          font-size: 0.65rem; cursor: pointer; transition: all 0.15s;
        }
        .bot-btn.active { background: #3b82f6; border-color: #3b82f6; color: white; }

        .panel-footer-actions { display: flex; flex-direction: column; gap: 8px; padding-top: 12px; border-top: 2px solid var(--border-color); flex-shrink: 0; }
        .primary-action-btn {
          width: 100%; padding: 12px; border-radius: 14px; border: none;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          font-weight: 900; font-size: 0.82rem; cursor: pointer; transition: all 0.2s;
          font-family: inherit;
        }
        .primary-action-btn.preview { background: #f59e0b; color: white; box-shadow: 0 3px 0 #b45309; }
        .primary-action-btn.collection { background: rgba(139,92,246,0.1); color: #8b5cf6; border: 2px solid #8b5cf6; }
        .primary-action-btn:active { transform: translateY(2px); box-shadow: none !important; }

        .action-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
        .action-btn-mini {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 7px 4px; background: var(--card-bg); border: 2px solid var(--border-color);
          border-radius: 10px; color: var(--text-color); font-size: 0.52rem; font-weight: 900;
          cursor: pointer; font-family: inherit; transition: all 0.15s;
        }
        .action-btn-mini:hover { border-color: var(--text-muted); }
        .action-btn-mini:disabled { opacity: 0.4; cursor: not-allowed; }
        .action-btn-mini.danger { color: #ef4444; }

        /* ── Collection Modal ─────────────────────────────── */
        .collection-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(6px); animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .collection-modal {
          background: var(--card-bg); width: 90%; max-width: 480px; 
          border-radius: 20px; border: 2px solid var(--border-color);
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          display: flex; flex-direction: column; max-height: 80vh;
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .modal-header {
          padding: 18px 20px; border-bottom: 2px solid var(--border-color);
          display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
        }
        .modal-title { display: flex; align-items: center; gap: 10px; }
        .modal-title h3 { margin: 0; font-size: 1rem; font-weight: 900; color: var(--text-color); }
        .modal-close { background: var(--card-bg); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; padding: 5px; display: flex; align-items: center; }

        .modal-body { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }

        .empty-collection { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 40px; color: var(--text-muted); text-align: center; }
        .empty-collection p { margin: 0; font-size: 0.85rem; font-weight: 700; }

        .map-card {
          background: var(--background-color); border: 2px solid var(--border-color);
          border-radius: 14px; padding: 12px 14px;
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
        }
        .map-card-info { flex: 1; min-width: 0; }
        .map-card-name { font-weight: 900; font-size: 0.85rem; color: var(--text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .map-card-meta { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); margin-top: 2px; }

        .map-card-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .map-action-btn {
          display: flex; align-items: center; gap: 5px; padding: 6px 10px;
          border-radius: 9px; border: none; font-weight: 900; font-size: 0.7rem;
          cursor: pointer; font-family: inherit; transition: all 0.15s;
        }
        .map-action-btn.test { background: #58cc02; color: white; }
        .map-action-btn.load { background: #3b82f6; color: white; }
        .map-action-btn.delete { background: rgba(239,68,68,0.1); color: #ef4444; border: 2px solid #ef4444; padding: 6px 8px; }
        .map-action-btn:hover { filter: brightness(1.1); }
      `}</style>
    </div>
  );
}
