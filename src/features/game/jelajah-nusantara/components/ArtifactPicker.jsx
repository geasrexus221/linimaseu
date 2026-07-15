import React from 'react';
import { X, Shield } from 'lucide-react';

export default function ArtifactPicker({ artifacts, selectedId, onSelect, onClose }) {
  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-modal" onClick={e => e.stopPropagation()}>
        <header className="picker-header">
          <div className="title-row">
            <Shield size={20} color="#f4c265" />
            <h3>PILIH KARTU BEKAL</h3>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="picker-body">
          {artifacts.length === 0 ? (
            <div className="empty-state">
              <span>🍱</span>
              <p>Belum punya kartu bekal. Ayo cari di Toko Peti Ajaib!</p>
            </div>
          ) : (
            <div className="artifacts-list">
              {artifacts.map(art => (
                <div 
                  key={art.id} 
                  className={`art-item ${selectedId === art.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelect(art);
                    onClose();
                  }}
                >
                  <div className="art-icon">
                    {art.icon}
                    <span className="art-count-badge">x{art.count}</span>
                  </div>
                  <div className="art-info">
                    <span className="art-name">{art.name}</span>
                    <span className="art-desc">{art.description || art.desc}</span>
                  </div>
                  {selectedId === art.id && <div className="selected-dot" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="picker-tip">
          <p>Tiap kartu bekal dapat digunakan saat giliran Anda di game!</p>
        </div>
      </div>

      <style jsx>{`
        .picker-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center;
          z-index: 3000; backdrop-filter: blur(5px);
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .picker-modal {
          background: white; width: 92%; max-width: 380px; border-radius: 30px;
          overflow: hidden; animation: popUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popUp { from { transform: scale(0.8) translateY(50px); } to { transform: scale(1) translateY(0); } }

        .picker-header {
          padding: 20px; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 2px solid #F0F0F0;
        }
        .title-row { display: flex; align-items: center; gap: 10px; }
        .title-row h3 { margin: 0; font-size: 1rem; font-weight: 900; color: #4B4B4B; }
        .close-btn { background: none; border: none; color: #AFAFAF; cursor: pointer; }

        .picker-body { padding: 16px 20px; max-height: 340px; overflow-y: auto; }
        .artifacts-list { display: flex; flex-direction: column; gap: 12px; }
        
        .art-item {
          display: flex; align-items: center; gap: 12px;
          padding: 8px 12px; background: #F7F9FC; border: 2px solid #E5E5E5;
          border-radius: 16px; cursor: pointer; position: relative;
          transition: all 0.2s ease;
        }
        .art-item:hover {
          background: #FFF9F0; border-color: #f4c265;
        }
        .art-item.active {
          border-color: #f4c265; background: #FFF9F0;
        }
        .art-icon {
          width: 48px; height: 48px; background: white; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem; border: 2px solid #E5E5E5; transition: all 0.2s;
          position: relative; flex-shrink: 0;
        }
        .art-count-badge {
          position: absolute; top: -6px; right: -6px; background: #3B82F6;
          color: white; font-size: 0.55rem; font-weight: 900; padding: 1px 5px;
          border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .art-item.active .art-icon { border-color: #f4c265; }
        
        .art-info {
          display: flex; flex-direction: column; gap: 2px;
          flex: 1; text-align: left; padding-right: 15px;
        }
        .art-name { font-size: 0.78rem; font-weight: 900; color: #4B4B4B; }
        .art-item.active .art-name { color: #D97706; }
        .art-desc { font-size: 0.65rem; font-weight: 700; color: #64748B; line-height: 1.35; }
        
        .selected-dot {
          position: absolute; top: 50%; right: 12px; transform: translateY(-50%);
          background: #f4c265; width: 14px; height: 14px; border-radius: 50%;
          border: 2.5px solid white; box-shadow: 0 0 0 2px #f4c265;
        }

        .empty-state { text-align: center; padding: 30px 10px; }
        .empty-state span { font-size: 3rem; display: block; margin-bottom: 10px; }
        .empty-state p { font-size: 0.8rem; font-weight: 700; color: #AFAFAF; line-height: 1.4; }

        .picker-tip { background: #F7F9FC; padding: 15px; text-align: center; }
        .picker-tip p { margin: 0; font-size: 0.65rem; color: #AFAFAF; font-weight: 800; }
      `}</style>
    </div>
  );
}
