import React, { useState, useRef } from 'react';
import { ChevronLeft, Shirt, Crown, Check, Sparkles, Frame, Monitor, Image as ImageIcon, Plus, Minus, RotateCcw } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import StudentAvatar from '../../../components/common/StudentAvatar';

export default function AvatarCustomizerScreen() {
  const { ownedCosmetics, equippedItems, equipItem, itemTransforms, updateItemTransform, avatarBaseImage, setAvatarBaseImage } = useStore();
  const { setProfileSubView } = useNavigationStore();
  const [activeTab, setActiveTab] = useState('hat');

  const [localTransforms, setLocalTransforms] = useState(itemTransforms || {
    hat: { x: 0, y: 0, scale: 1 },
    clothes: { x: 0, y: 0, scale: 1 },
    accessory: { x: 0, y: 0, scale: 1 }
  });

  const tabs = [
    { id: 'hat', label: 'TOPI', icon: Crown },
    { id: 'accessory', label: 'AKSESORI', icon: Sparkles },
    { id: 'border', label: 'BORDER', icon: Frame },
    { id: 'quizTheme', label: 'TEMA', icon: Monitor },
  ];

  const filteredItems = ownedCosmetics.filter(item => item.type === activeTab);
  const isTransformable = ['hat', 'accessory'].includes(activeTab);

  // Drag logic
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    if (!isTransformable) return;
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || !isTransformable) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    startPos.current = { x: e.clientX, y: e.clientY };

    setLocalTransforms(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        x: (prev[activeTab]?.x || 0) + dx,
        y: (prev[activeTab]?.y || 0) + dy
      }
    }));
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleScaleChange = (delta) => {
    if (!isTransformable) return;
    setLocalTransforms(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        scale: Math.max(0.5, Math.min((prev[activeTab]?.scale || 1) + delta, 3))
      }
    }));
  };

  const handleResetTransform = () => {
    if (!isTransformable) return;
    setLocalTransforms(prev => ({
      ...prev,
      [activeTab]: { x: 0, y: 0, scale: 1 }
    }));
  };

  const handleSave = () => {
    ['hat', 'accessory'].forEach(cat => {
      if (localTransforms[cat]) {
        updateItemTransform(cat, localTransforms[cat]);
      }
    });
    setProfileSubView('main');
  };

  const handlePhotoUpload = () => {
    // Simulasi mengganti foto dengan placeholder atau hapus
    if (avatarBaseImage) {
      setAvatarBaseImage(null);
    } else {
      setAvatarBaseImage('https://api.dicebear.com/7.x/avataaars/svg?seed=Linimasa');
    }
  };

  return (
    <div className="wardrobe-container">
      {/* HEADER */}
      <header className="wardrobe-header">
        <button className="back-btn" onClick={() => setProfileSubView('main')}>
          <ChevronLeft size={28} />
        </button>
        <div className="title-box">
          <Shirt size={22} color="#58CC02" />
          <h1>Ruang Ganti</h1>
        </div>
        <div className="header-spacer" />
      </header>

      <div className="wardrobe-body">
        {/* PREVIEW STAGE */}
        <section className="preview-stage">
          <div className="stage-glow" />
          
          <div className="photo-btn-container">
            <button className="photo-btn" onClick={handlePhotoUpload}>
              <ImageIcon size={16} /> {avatarBaseImage ? 'Hapus Foto' : 'Pasang Foto'}
            </button>
          </div>

          <div 
            className={`avatar-podium ${isTransformable ? 'draggable' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            title={isTransformable ? "Geser item ini" : ""}
          >
            <StudentAvatar size={160} showGlow overrideTransforms={localTransforms} />
          </div>

          {isTransformable && equippedItems[activeTab] && (
            <div className="transform-controls">
              <button className="t-btn" onClick={() => handleScaleChange(-0.1)} title="Perkecil"><Minus size={18} /></button>
              <button className="t-btn" onClick={handleResetTransform} title="Reset Posisi"><RotateCcw size={18} /></button>
              <button className="t-btn" onClick={() => handleScaleChange(0.1)} title="Perbesar"><Plus size={18} /></button>
            </div>
          )}
        </section>

        {/* SELECTOR PANEL */}
        <section className="selector-panel">
          <div className="tabs-row">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="items-container">
            <div className="items-grid">
              {/* DEFAULT OPTION */}
              <div 
                className={`item-card ${!equippedItems[activeTab] ? 'selected' : ''}`}
                onClick={() => equipItem(activeTab, null)}
              >
                <div className="item-inner">
                  <div className="item-icon-default">🚫</div>
                  <span className="item-label">Gaya Dasar</span>
                  {!equippedItems[activeTab] && (
                    <div className="selected-check"><Check size={14} strokeWidth={4} /></div>
                  )}
                </div>
              </div>

              {/* OWNED ITEMS */}
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className={`item-card ${equippedItems[item.type] === item.id ? 'selected' : ''}`}
                  onClick={() => equipItem(item.type, item.id)}
                >
                  <div className="item-inner">
                    <div className="item-icon">{item.icon}</div>
                    <span className="item-label">{item.name}</span>
                    {equippedItems[item.type] === item.id && (
                      <div className="selected-check"><Check size={14} strokeWidth={4} /></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="empty-message">
                <div className="empty-icon">👗</div>
                <p>Belum ada koleksi {
                  activeTab === 'hat' ? 'topi' : 
                  activeTab === 'accessory' ? 'aksesori' : 
                  activeTab === 'quizTheme' ? 'tema kuis' : 'border'
                } nih.</p>
                <small>Ayo beli koleksi baru di Toko!</small>
              </div>
            )}
          </div>
        </section>
      </div>

      <footer className="wardrobe-footer">
        <button className="save-btn" onClick={handleSave}>
          SIMPAN GAYA
        </button>
      </footer>

      <style jsx>{`
        .wardrobe-container {
          position: fixed; inset: 0; background: #F0F4F8;
          display: flex; flex-direction: column; z-index: 5000;
          font-family: 'Outfit', sans-serif;
        }

        /* HEADER */
        .wardrobe-header {
          background: white; padding: 15px 20px; display: flex; 
          align-items: center; justify-content: space-between;
          border-bottom: 2px solid #E5E5E5;
        }
        .back-btn {
          width: 45px; height: 45px; background: #F8FAFC; border: none;
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          color: #AFAFAF; cursor: pointer;
        }
        .title-box { display: flex; align-items: center; gap: 10px; }
        .title-box h1 { font-size: 1.1rem; font-weight: 900; color: #4B4B4B; margin: 0; }
        .header-spacer { width: 45px; }

        .wardrobe-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

        /* PREVIEW STAGE */
        .preview-stage {
          flex: 0 0 280px; position: relative; display: flex; flex-direction: column;
          align-items: center; justify-content: center; padding: 20px;
        }
        .stage-glow {
          position: absolute; width: 250px; height: 250px; background: white;
          filter: blur(40px); border-radius: 50%; opacity: 0.6; z-index: 1;
        }
        
        .photo-btn-container {
          position: absolute; top: 15px; left: 15px; z-index: 10;
        }
        .photo-btn {
          display: flex; align-items: center; gap: 6px; padding: 8px 12px;
          background: white; border: 2px solid #E5E5E5; border-radius: 12px;
          font-weight: 800; font-size: 0.75rem; color: #777; cursor: pointer;
        }
        .photo-btn:active { background: #F8FAFC; }

        .avatar-podium { 
          z-index: 2; transform: translateY(10px); 
          user-select: none; touch-action: none;
        }
        .avatar-podium.draggable { cursor: move; }

        .transform-controls {
          position: absolute; bottom: 15px; display: flex; gap: 10px; z-index: 10;
          background: rgba(255,255,255,0.9); padding: 8px; border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .t-btn {
          width: 36px; height: 36px; border-radius: 50%; border: none;
          background: #F8FAFC; color: #4B4B4B; display: flex; align-items: center;
          justify-content: center; cursor: pointer; border: 2px solid #E5E5E5;
        }
        .t-btn:active { background: #E5E5E5; }

        .stage-badge {
          margin-top: 15px; background: #58CC02; color: white; padding: 6px 16px;
          border-radius: 50px; font-weight: 900; font-size: 0.75rem;
          display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 0 #46A302;
          z-index: 3;
        }

        /* SELECTOR PANEL */
        .selector-panel {
          flex: 1; background: white; border-top-left-radius: 40px; border-top-right-radius: 40px;
          padding: 25px 20px; display: flex; flex-direction: column; gap: 20px;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.03); overflow: hidden;
        }
        .tabs-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none; }
        .tabs-row::-webkit-scrollbar { display: none; }
        
        .tab-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px 15px; background: #F8FAFC; border: 2px solid #E5E5E5;
          border-radius: 16px; cursor: pointer; color: #AFAFAF; font-weight: 800;
          font-size: 0.8rem; white-space: nowrap; transition: all 0.2s;
        }
        .tab-btn.active {
          background: #58CC02; border-color: #58CC02; color: white;
          box-shadow: 0 4px 12px rgba(88, 204, 2, 0.2);
        }

        .items-container { flex: 1; overflow-y: auto; padding-right: 2px; }
        .items-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }

        .item-card { height: 110px; position: relative; cursor: pointer; }
        .item-inner {
          position: absolute; inset: 0; background: white; border: 2px solid #E5E5E5;
          border-radius: 20px; display: flex; flex-direction: column; align-items: center;
          justify-content: center; transition: all 0.2s; z-index: 2;
        }
        .item-card::after {
          content: ''; position: absolute; inset: 0; bottom: -5px; background: #E5E5E5;
          border-radius: 20px; z-index: 1;
        }
        .item-card.selected .item-inner { border-color: #58CC02; background: #F1FBE9; }
        .item-card.selected::after { background: #46A302; }
        .item-card:active .item-inner { transform: translateY(4px); }
        
        .item-icon { font-size: 2.5rem; }
        .item-icon-default { font-size: 2rem; }
        .item-label { font-weight: 800; font-size: 0.7rem; color: #777; margin-top: 4px; text-align: center; }
        
        .selected-check {
          position: absolute; top: -5px; right: -5px; background: #58CC02; color: white;
          width: 22px; height: 22px; border-radius: 50%; display: flex; 
          align-items: center; justify-content: center; border: 3px solid white;
        }

        .empty-message { text-align: center; padding: 40px 0; opacity: 0.6; }
        .empty-icon { font-size: 3rem; margin-bottom: 10px; }
        .empty-message p { font-weight: 900; margin: 0; color: #4B4B4B; }
        .empty-message small { font-weight: 700; color: #1CB0F6; }

        .wardrobe-footer { background: white; padding: 20px; border-top: 2px solid #E5E5E5; }
        .save-btn {
          width: 100%; background: #1CB0F6; color: white; border: none; padding: 18px;
          border-radius: 20px; font-weight: 900; font-size: 1.1rem; cursor: pointer;
          box-shadow: 0 6px 0 #1899D6;
        }
        .save-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #1899D6; }
      `}</style>
    </div>
  );
}
