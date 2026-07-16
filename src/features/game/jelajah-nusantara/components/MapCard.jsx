import { Lock, Trash2 } from 'lucide-react';

export default function MapCard({ map, isSelected, onClick, onDelete }) {
  return (
    <div 
      className={`map-card ${isSelected ? 'selected' : ''} ${map.locked ? 'locked' : ''}`}
      onClick={() => !map.locked && onClick()}
    >
      
      {onDelete && (
        <button 
          className="delete-map-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Hapus peta "${map.name}"?`)) onDelete();
          }}
        >
          <Trash2 size={14} />
        </button>
      )}

      <div className="map-image" style={{ backgroundImage: `url(${map.thumbnail || map.img})` }}>
        {map.locked && (
          <div className="lock-overlay">
            <div className="lock-icon-box">
              <Lock size={24} fill="#FFD700" color="#FFD700" />
            </div>
            <span>TERKUNCI</span>
          </div>
        )}
      </div>
      <div className="map-info">
        <h3>{map.name}</h3>
      </div>

      <style jsx>{`
        .map-card {
          flex: 1; min-width: 140px; background: white; border-radius: 20px;
          border: 3px solid #E5E5E5; overflow: hidden; cursor: pointer;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }
        .map-card.selected {
          border-color: #1CB0F6;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(28, 176, 246, 0.2);
        }
        .map-card.locked {
          cursor: not-allowed;
          filter: grayscale(0.5);
        }
        .delete-map-btn {
          position: absolute; top: 6px; right: 6px; z-index: 10;
          width: 26px; height: 26px; border-radius: 50%;
          background: #EF4444; color: white; border: none;
          display: flex; alignItems: center; justifyContent: center;
          cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }
        .delete-map-btn:hover { transform: scale(1.1); background: #DC2626; }
        .map-image {
          height: 145px; background-size: cover; background-position: center;
          position: relative;
        }
        .lock-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.6);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          color: #FFD700; font-weight: 900; font-size: 0.6rem; gap: 5px;
        }
        .lock-icon-box {
          background: rgba(255,215,0,0.2); padding: 8px; border-radius: 50%;
        }
        .map-info { padding: 10px; text-align: center; }
        .map-info h3 { font-size: 0.8rem; font-weight: 900; margin: 0; color: #4B4B4B; }
      `}</style>
    </div>
  );
}
