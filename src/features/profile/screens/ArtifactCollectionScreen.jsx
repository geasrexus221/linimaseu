import React, { useState } from 'react';
import { ChevronLeft, Book, Info, X } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { actionCards } from '../../game/jelajah-nusantara/data/cards';

export default function ArtifactCollectionScreen() {
  const { ownedArtifacts } = useStore();
  const { setProfileSubView } = useNavigationStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  
  const resolvedArtifacts = ownedArtifacts.map(owned => {
    const card = actionCards.find(c => c.id === owned.id);
    if (!card || (owned.count || 0) <= 0) return null;
    return { ...card, count: owned.count };
  }).filter(c => c !== null);

  
  const rarityOrder = { epic: 0, rare: 1, common: 2 };
  const sortedArtifacts = [...resolvedArtifacts].sort((a, b) => 
    rarityOrder[a.rarity] - rarityOrder[b.rarity]
  );

  const filteredArtifacts = activeTab === 'all' 
    ? sortedArtifacts 
    : sortedArtifacts.filter(item => item.rarity === activeTab);

  const tabs = [
    { id: 'all', label: 'SEMUA' },
    { id: 'epic', label: 'EPIC' },
    { id: 'rare', label: 'RARE' },
    { id: 'common', label: 'COMMON' },
  ];

  return (
    <div className="collection-screen-container">
      
      <header className="collection-header">
        <button className="back-btn-3d" onClick={() => setProfileSubView('main')}>
          <ChevronLeft size={28} />
        </button>
        <div className="header-title-box">
          <Book size={24} color="#8B4513" />
          <h2>Tas Bekal Kartu</h2>
        </div>
        <div style={{ width: 45 }}></div>
      </header>

      
      <div className="collection-tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`coll-tab-btn ${activeTab === tab.id ? 'active' : ''} ${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="collection-body">
        {resolvedArtifacts.length === 0 ? (
          <div className="empty-collection">
            <div className="empty-visual">🎒✨</div>
            <h3>Tas Bekal Kartu Kosong!</h3>
            <p>Ayo buka Peti Ajaib di Toko untuk mendapatkan kartu bekal Jelajah Nusantara.</p>
          </div>
        ) : (
          <div className="collection-grid">
            {filteredArtifacts.map((item) => (
              <div 
                key={item.id} 
                className={`artifact-card-3d ${item.rarity}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="card-face">
                  <div className="artifact-icon-large">{item.icon}</div>
                  <span className="artifact-name-label">{item.name}</span>
                  <span className="card-count-badge">x{item.count}</span>
                  <div className={`rarity-dot ${item.rarity}`} />
                </div>
                <div className="card-bottom"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      {selectedItem && (
        <div className="artifact-detail-overlay">
          <div className="detail-modal-fun">
            <button className="close-detail-btn" onClick={() => setSelectedItem(null)}><X size={20} /></button>
            
            <div className="detail-visual-section">
              <div className="visual-ring">{selectedItem.icon}</div>
              <div className={`rarity-pill ${selectedItem.rarity}`}>
                {selectedItem.rarity.toUpperCase()}
              </div>
            </div>

            <div className="detail-text-section">
              <h2>{selectedItem.name}</h2>
              <p className="artifact-desc">{selectedItem.desc}</p>
              
              <div className="fun-fact-box">
                <div className="fact-header">
                  <Info size={16} />
                  <span>KARTU BEKAL AKSI</span>
                </div>
                <p>Miliki: {selectedItem.count} buah | Gunakan kartu bekal ini untuk membantumu melangkah atau memulihkan Tekad di game Jelajah Nusantara!</p>
              </div>
            </div>

            <button className="cool-back-btn" onClick={() => setSelectedItem(null)}>
              MANTAP!
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .collection-screen-container {
          position: fixed; inset: 0; background: #fdf6e3;
          display: flex; flex-direction: column; z-index: 1000;
          font-family: 'Outfit', sans-serif;
        }
        .collection-header {
          padding: 15px 20px; display: flex; align-items: center; justify-content: space-between;
          background: white; border-bottom: 2px solid #E5E5E5;
        }
        .header-title-box { display: flex; align-items: center; gap: 10px; }
        .header-title-box h2 { font-weight: 900; font-size: 1.1rem; color: #8B4513; margin: 0; }
        
        .back-btn-3d {
          background: none; border: none; cursor: pointer; color: #8B4513;
          display: flex; align-items: center; justify-content: center;
        }

        .collection-tabs {
          display: flex; gap: 8px; padding: 15px 20px; 
          background: #fdf6e3; overflow-x: auto; scrollbar-width: none;
        }
        .collection-tabs::-webkit-scrollbar { display: none; }
        
        .coll-tab-btn {
          flex: 1; padding: 10px 15px; border-radius: 12px; border: 2px solid #E5E5E5;
          background: white; color: #AFAFAF; font-weight: 800; font-size: 0.75rem;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .coll-tab-btn.active.all { background: #8B4513; color: white; border-color: #8B4513; }
        .coll-tab-btn.active.epic { background: #FFD700; color: white; border-color: #FFD700; }
        .coll-tab-btn.active.rare { background: #1CB0F6; color: white; border-color: #1CB0F6; }
        .coll-tab-btn.active.common { background: #AFAFAF; color: white; border-color: #AFAFAF; }
        
        .collection-body { flex: 1; overflow-y: auto; padding: 10px 20px 25px; }
        
        .empty-collection { text-align: center; padding-top: 80px; color: #8B4513; }
        .empty-visual { font-size: 5rem; margin-bottom: 20px; animation: float 3s infinite ease-in-out; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .empty-collection h3 { font-weight: 900; margin-bottom: 10px; }
        .empty-collection p { font-size: 0.95rem; font-weight: 700; opacity: 0.7; padding: 0 40px; }

        .collection-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .artifact-card-3d { position: relative; height: 115px; cursor: pointer; }
        .card-face {
          position: absolute; inset: 0; background: white; border-radius: 20px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          z-index: 2; border: 2px solid #E5E5E5; transition: transform 0.1s;
          overflow: hidden; padding-bottom: 10px;
        }
        .rarity-dot {
          position: absolute; top: 8px; right: 8px; width: 6px; height: 6px; border-radius: 50%;
        }
        .rarity-dot.epic { background: #FFD700; box-shadow: 0 0 5px #FFD700; }
        .rarity-dot.rare { background: #1CB0F6; }
        .rarity-dot.common { background: #AFAFAF; }
        
        .card-count-badge {
          position: absolute; bottom: 8px; right: 8px; background: #3B82F6;
          color: white; font-size: 0.6rem; font-weight: 900; padding: 1px 5px;
          border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .card-bottom { position: absolute; inset: 0; bottom: -6px; background: #E5E5E5; border-radius: 20px; z-index: 1; }
        .artifact-card-3d:active .card-face { transform: translateY(4px); }
        .artifact-card-3d:active .card-bottom { bottom: -2px; }

        .artifact-card-3d.epic .card-face { border-color: #FFD700; background: #FFF9F0; }
        .artifact-card-3d.epic .card-bottom { background: #d1a34b; }
        .artifact-card-3d.rare .card-face { border-color: #1CB0F6; background: #F0F9FF; }
        .artifact-card-3d.rare .card-bottom { background: #1899D6; }

        .artifact-icon-large { font-size: 2.8rem; margin-bottom: 2px; }
        .artifact-name-label { font-weight: 900; font-size: 0.65rem; color: #555; text-align: center; padding: 0 5px; }

        /* Detail Overlay */
        .artifact-detail-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center; padding: 25px;
          z-index: 2000; backdrop-filter: blur(8px);
        }
        .detail-modal-fun {
          width: 100%; max-width: 400px; background: white; border-radius: 35px;
          padding: 40px 25px; text-align: center; position: relative;
          border: 4px solid #8B4513; box-shadow: 0 20px 0 #5D2E0C;
          animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popUp { from { transform: scale(0.7) translateY(50px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        
        .close-detail-btn { position: absolute; top: 20px; right: 20px; background: #F0F0F0; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; }
        
        .detail-visual-section { margin-bottom: 25px; position: relative; }
        .visual-ring {
          font-size: 6rem; width: 150px; height: 150px; background: #FDF6E3;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          margin: 0 auto; border: 4px dashed #8B4513;
        }
        .rarity-pill {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          padding: 6px 18px; border-radius: 50px; color: white; font-weight: 900; font-size: 0.8rem;
          box-shadow: 0 4px 0 rgba(0,0,0,0.2);
        }
        .rarity-pill.epic { background: #FFD700; color: #8B4513; }
        .rarity-pill.rare { background: #1CB0F6; }
        .rarity-pill.common { background: #AFAFAF; }

        .detail-text-section h2 { font-weight: 900; font-size: 1.6rem; color: #4B4B4B; margin: 0 0 10px; }
        .artifact-desc { font-weight: 700; font-size: 0.95rem; color: #777; line-height: 1.5; margin-bottom: 25px; }

        .fun-fact-box {
          background: #E3F2FD; border-radius: 20px; padding: 15px;
          text-align: left; border: 2px dashed #1CB0F6; margin-bottom: 30px;
        }
        .fact-header { display: flex; align-items: center; gap: 8px; color: #1CB0F6; font-weight: 900; font-size: 0.75rem; margin-bottom: 5px; }
        .fun-fact-box p { font-weight: 800; font-size: 0.85rem; color: #0052D4; margin: 0; }

        .cool-back-btn {
          width: 100%; background: #58CC02; color: white; border: none;
          padding: 18px; border-radius: 20px; font-weight: 900; font-size: 1.1rem;
          box-shadow: 0 6px 0 #46A302; cursor: pointer;
        }
        .cool-back-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #46A302; }
      `}</style>
    </div>
  );
}
