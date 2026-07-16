import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Flame, Shirt, Crown, Frame, Monitor } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { useRegisterRightPanel } from '../../../hooks/useRegisterRightPanel';
import DesktopStatsPanel from '../../../components/layout/DesktopStatsPanel';
import { SHOP_CATALOG } from '../../../data/shop/catalog';
import CurrencyHeader from '../components/CurrencyHeader';
import CategorySwitcher from '../components/CategorySwitcher';
import ItemCard from '../components/ItemCard';
import StudentAvatar from '../../../components/common/StudentAvatar';
import MagicChest3D from '../components/MagicChest3D';
import CerminIcon from '../../../assets/UI/Character/cermin.svg';
import KuatIcon from '../../../assets/UI/Character/kuat.svg';

export default function ShopMainScreen() {
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [showCatalog, setShowCatalog] = useState(false);
  const { stars, setStars, addCosmetic, ownedCosmetics, addHearts, setStreak } = useStore();
  const { setShopSubView, setShopGachaCount, shopCategory, setShopCategory } = useNavigationStore();

  
  useRegisterRightPanel(DesktopStatsPanel, 'shop-main');

  const SUB_CATEGORIES = [
    { id: 'all', label: 'Semua', icon: Sparkles },
    { id: 'clothes', label: 'Pakaian', icon: Shirt },
    { id: 'hat', label: 'Topi', icon: Crown },
    { id: 'accessory', label: 'Aksesori', icon: Sparkles },
    { id: 'border', label: 'Border', icon: Frame },
    { id: 'quizTheme', label: 'Tema Kuis', icon: Monitor },
  ];

  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const [confirmItem, setConfirmItem] = useState(null);

  const triggerWarning = (msg) => {
    setWarningMsg(msg);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  const handleBuy = (item) => {
    if (stars < item.price) {
      triggerWarning('Bintang kamu tidak cukup untuk barang ini! 🌟');
      return;
    }
    setConfirmItem({ actionType: 'buy', item, cost: item.price, name: item.name });
  };

  const handleOpenChest = (count) => {
    const cost = count === 1 ? 150 : 1500;
    if (stars < cost) {
      triggerWarning('Bintang kamu tidak cukup untuk membuka peti! 🌟');
      return;
    }
    setConfirmItem({ actionType: 'gacha', count, cost, name: count === 1 ? '1 Peti Misteri' : '11 Peti Misteri' });
  };

  const confirmPurchase = () => {
    if (!confirmItem) return;
    if (confirmItem.actionType === 'buy') {
      const { item } = confirmItem;
      if (item.type === 'refill') {
        if (item.id === 'heart_refill') addHearts(5);
        if (item.id === 'obor_pack') setStreak(ownedCosmetics.length + 5);
      } else {
        addCosmetic(item);
      }
      setStars(stars - confirmItem.cost);
    } else if (confirmItem.actionType === 'gacha') {
      setStars(stars - confirmItem.cost);
      setShopGachaCount(confirmItem.count);
      setShopSubView('opening');
    }
    setConfirmItem(null);
  };

  return (
    <div className="shop-main-container">
      
      <div className="shop-awning">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div key={`stripe-${idx}`} className="awning-stripe" />
        ))}
        <div className="awning-scallop">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={`scallop-${idx}`} className="scallop-segment" />
          ))}
        </div>
      </div>

      
      <div className="sky-cloud cloud-1">☁️</div>
      <div className="sky-cloud cloud-2">☁️</div>
      <div className="sky-cloud cloud-3">☁️</div>

      
      <div className="shop-stage">
        <div className="stage-light" />
        <div className="stage-platform">
          <div className="character-preview">
            {shopCategory === 'cosmetic' && (
              <div className="preview-pop-wrapper">
                <img src={CerminIcon} alt="Pakaian" className="gaya-pahlawan-cermin-img" />
              </div>
            )}
            {shopCategory === 'refill' && (
              <div className="preview-pop-wrapper">
                <img src={KuatIcon} alt="Isi Ulang" className="gaya-pahlawan-cermin-img" />
              </div>
            )}
            {shopCategory === 'gacha' && (
              <div className="preview-pop-wrapper">
                <div className="chest-visual-3d">
                  <MagicChest3D />
                </div>
              </div>
            )}
          </div>
          <div className="platform-bottom" />
        </div>

        <div className="stage-text">
          <h2>
            {shopCategory === 'cosmetic' && 'GAYA PAHLAWAN'}
            {shopCategory === 'refill' && 'ISI TENAGA'}
            {shopCategory === 'gacha' && 'PETI MISTERI'}
          </h2>
          <p>
            {shopCategory === 'cosmetic' && 'Pilih pakaian terbaikmu!'}
            {shopCategory === 'refill' && 'Siap untuk lanjut belajar?'}
            {shopCategory === 'gacha' && 'Artefak langka menantimu!'}
          </p>
        </div>
        <div className="decor d1">✨</div>
        <div className="decor d2">✨</div>
      </div>

      <CategorySwitcher active={shopCategory} onChange={setShopCategory} />

      <div className="shop-content-area content-container">
        {shopCategory === 'cosmetic' && (
          <>

            
            <div className="sub-category-bar">
              {SUB_CATEGORIES.map(sub => (
                <button
                  key={sub.id}
                  className={`sub-pill ${activeSubCategory === sub.id ? 'active' : ''}`}
                  onClick={() => setActiveSubCategory(sub.id)}
                >
                  <sub.icon size={16} />
                  <span>{sub.label.toUpperCase()}</span>
                </button>
              ))}
            </div>

            <div className="items-grid">
              {SHOP_CATALOG.cosmetics
                .filter(item => activeSubCategory === 'all' || item.type === activeSubCategory)
                .map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onBuy={handleBuy}
                    isOwned={ownedCosmetics.some(c => c.id === item.id)}
                  />
                ))}
            </div>
          </>
        )}

        {shopCategory === 'refill' && (
          <>

            <div className="items-grid">
              {SHOP_CATALOG.refills.map(item => (
                <ItemCard
                  key={item.id}
                  item={{
                    ...item,
                    color: item.id === 'heart_refill' ? '#FF4B4B' : '#f4c265',
                    rarity: 'rare'
                  }}
                  onBuy={handleBuy}
                  isOwned={false}
                />
              ))}
            </div>
          </>
        )}

        {shopCategory === 'gacha' && (
          <>

            <div className="gacha-special-card">
              <div className="gacha-visual-box">
                <div className="box-glow" />
                <div className="magic-chest-3d-main">
                  <MagicChest3D />
                </div>
              </div>

              <div className="gacha-options">
                <button className="gacha-chunky-btn single" onClick={() => handleOpenChest(1)}>
                  <div className="g-btn-face">
                    <span className="g-btn-title">BUKA 1 PETI</span>
                    <span className="g-btn-price">150 ⭐</span>
                  </div>
                  <div className="g-btn-bottom"></div>
                </button>

                <button className="gacha-chunky-btn multi" onClick={() => handleOpenChest(11)}>
                  <div className="bonus-pill">BONUS +1</div>
                  <div className="g-btn-face">
                    <span className="g-btn-title">BUKA 11 PETI</span>
                    <span className="g-btn-price">1500 ⭐</span>
                  </div>
                  <div className="g-btn-bottom"></div>
                </button>
              </div>

              <button className="view-catalog-btn" onClick={() => setShowCatalog(true)}>
                Lihat Isi Peti & Peluang
              </button>
            </div>
          </>
        )}
      </div>

      
      {showCatalog && (
        <div className="gacha-catalog-overlay" onClick={() => setShowCatalog(false)}>
          <div className="gacha-catalog-modal" onClick={e => e.stopPropagation()}>
            <div className="catalog-header">
              <h3>Daftar Isi Peti Misteri</h3>
              <button className="close-catalog" onClick={() => setShowCatalog(false)}>✕</button>
            </div>
            <div className="catalog-scroll-area">
              {[...SHOP_CATALOG.gachaPool]
                .sort((a, b) => {
                  const weight = { epic: 3, rare: 2, common: 1 };
                  return weight[b.rarity] - weight[a.rarity];
                })
                .map(item => (
                  <div key={item.id} className={`catalog-item-row ${item.rarity}`}>
                    <div className="c-item-name">{item.name}</div>
                    <div className="c-item-meta">
                      <span className="c-rarity-tag">{item.rarity.toUpperCase()}</span>
                      <span className="c-chance">
                        {item.rarity === 'epic' ? '5%' : item.rarity === 'rare' ? '25%' : '70%'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <p className="catalog-footer">Item akan masuk ke Buku Koleksi secara otomatis.</p>
          </div>
        </div>
      )}

      
      <div className={`warning-toast-container ${showWarning ? 'active' : ''}`}>
        <div className="warning-toast-mini">
          <div className="w-mini-icon">⚠️</div>
          <div className="w-mini-text">{warningMsg}</div>
        </div>
      </div>

      
      <AnimatePresence>
        {confirmItem && (
          <div className="confirm-modal-overlay">
            <motion.div
              className="confirm-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2>Beli Barang Ini?</h2>
              <p>Apakah kamu yakin ingin menukarkan <strong>{confirmItem.cost} ⭐</strong> untuk mendapatkan <strong>{confirmItem.name}</strong>?</p>

              <div className="confirm-actions">
                <button className="btn-cancel" onClick={() => setConfirmItem(null)}>Batal</button>
                <button className="btn-confirm" onClick={confirmPurchase}>Ya, Beli!</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .shop-main-container {
          flex: 1; 
          background: var(--background-color);
          overflow-y: auto;
          padding-bottom: 120px; 
          font-family: 'Outfit', sans-serif;
          position: relative;
        }

        /* AWNING STYLES */
        .shop-awning {
          display: flex;
          height: 35px;
          width: 100%;
          background: var(--secondary-color);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .awning-stripe {
          flex: 1;
          height: 100%;
          background: var(--secondary-color);
        }
        .awning-stripe:nth-child(even) {
          background: var(--card-bg);
        }
        .awning-scallop {
          position: absolute;
          bottom: -12px;
          left: 0;
          width: 100%;
          height: 14px;
          display: flex;
          overflow: hidden;
          z-index: 99;
        }
        .scallop-segment {
          flex: 1;
          height: 24px;
          border-radius: 50%;
          background: var(--secondary-color);
          margin-top: -12px;
        }
        .scallop-segment:nth-child(even) {
          background: var(--card-bg);
        }

        /* CLOUDS */
        .sky-cloud {
          position: absolute;
          font-size: 2.5rem;
          opacity: 0.12;
          pointer-events: none;
          z-index: 1;
        }
        .cloud-1 { top: 70px; left: 6%; animation: floatSlow 20s infinite linear; }
        .cloud-2 { top: 130px; right: 6%; animation: floatSlow 26s infinite linear reverse; }
        .cloud-3 { top: 380px; left: 12%; animation: floatSlow 32s infinite linear; }
        
        @keyframes floatSlow {
          0% { transform: translateX(0); }
          50% { transform: translateX(25px); }
          100% { transform: translateX(0); }
        }

        /* CONFIRMATION MODAL */
        .confirm-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.55); z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
        }
        .confirm-modal-content {
          background: var(--card-bg);
          padding: 28px; border-radius: 28px;
          border: 4px solid var(--border-color);
          text-align: center; max-width: 340px; width: 100%;
          box-shadow: 0 16px 40px rgba(0,0,0,0.25);
        }
        .confirm-modal-content h2 { margin: 0 0 10px 0; font-weight: 900; color: var(--text-color); font-size: 1.4rem; }
        .confirm-modal-content p { font-size: 1rem; font-weight: 700; opacity: 0.85; margin-bottom: 24px; line-height: 1.4; color: var(--text-color); }
        .confirm-actions { display: flex; gap: 12px; }
        .btn-cancel { flex: 1; padding: 14px; border-radius: 16px; border: 3px solid var(--border-color); background: transparent; font-weight: 900; cursor: pointer; color: var(--text-muted); transition: background 0.2s; }
        .btn-cancel:hover { background: var(--background-color); }
        .btn-confirm { flex: 1; padding: 14px; border-radius: 16px; border: none; background: #58CC02; color: white; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #46A302; transition: filter 0.2s; }
        .btn-confirm:hover { filter: brightness(1.05); }
        .btn-confirm:active { transform: translateY(4px); box-shadow: none; }

        /* WARNING TOAST */
        .warning-toast-container {
          position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
          z-index: 9999; pointer-events: none; opacity: 0;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .warning-toast-container.active { opacity: 1; transform: translateX(-50%) translateY(20px); }
        .warning-toast-mini {
          background: #FF4B4B; color: white; padding: 14px 24px;
          border-radius: 50px; display: flex; align-items: center; gap: 10px;
          box-shadow: 0 8px 25px rgba(255, 75, 75, 0.35);
          border: 3.5px solid white; white-space: nowrap;
        }
        .w-mini-icon { font-size: 1.3rem; }
        .w-mini-text { font-weight: 900; font-size: 0.9rem; }

        /* STAGE */
        .shop-stage {
          height: 250px; background: transparent; position: relative;
          display: flex; flex-direction: column; align-items: center;
          justify-content: flex-end; padding-bottom: 24px;
          border-bottom: 4px solid var(--border-color); overflow: hidden;
        }
        .stage-light {
          position: absolute; top: -50px; width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(28, 176, 246, 0.12) 0%, transparent 70%);
        }
        .stage-platform { position: relative; z-index: 2; margin-bottom: 15px; }
        .platform-bottom {
          width: 170px; height: 42px; background: var(--background-color);
          border-radius: 50%; border: 3px solid var(--border-color);
        }
        .character-preview {
          position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
          display: flex; justify-content: center;
        }
        .preview-pop-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          animation: popUpEntrance 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          transform-origin: bottom center;
        }
        @keyframes popUpEntrance {
          from {
            transform: scale(0.15) translateY(180px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .gaya-pahlawan-cermin-img {
          height: 280px;
          margin-bottom: -110px;
          object-fit: contain;
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2));
          animation: float 3.5s infinite ease-in-out;
        }
        .chest-visual-3d { transform: scale(0.65); margin-bottom: -15px; }
        .refill-visuals { display: flex; gap: 18px; }
        .v-item { filter: drop-shadow(0 6px 12px rgba(0,0,0,0.12)); animation: float 3.5s infinite ease-in-out; }
        .flame { animation-delay: 0.6s; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }

        .stage-text { position: absolute; top: 18px; left: 0; width: 100%; text-align: center; z-index: 5; }
        .stage-text h2 { font-weight: 950; font-size: 1.5rem; color: var(--text-color); margin: 0; letter-spacing: 0.5px; }
        .stage-text p { font-weight: 800; font-size: 0.9rem; color: var(--text-muted); margin: 4px 0 0; }

        .decor { position: absolute; font-size: 1.6rem; opacity: 0.45; }
        .d1 { top: 40px; left: 16%; animation: float 5.5s infinite; }
        .d2 { top: 60px; right: 16%; animation: float 4.5s infinite 1.2s; }

        .shop-content-area { padding: 0 20px; max-width: 1200px; margin: 0 auto; width: 100%; position: relative; z-index: 5; }
        
        /* RED RIBBON BANNER */
        .red-ribbon {
          position: relative;
          background: #FF4B4B;
          color: white;
          font-weight: 900;
          font-size: 1rem;
          padding: 10px 32px;
          text-align: center;
          margin: 32px auto 24px;
          width: fit-content;
          border-radius: 8px;
          border-bottom: 5px solid #D32F2F;
          box-shadow: 0 6px 15px rgba(255, 75, 75, 0.15);
          letter-spacing: 1px;
        }
        .red-ribbon::before, .red-ribbon::after {
          content: '';
          position: absolute;
          top: 6px;
          width: 0;
          height: 0;
          border-style: solid;
          z-index: -1;
        }
        .red-ribbon::before {
          left: -15px;
          border-width: 12px 15px 12px 0;
          border-color: #C62828 transparent #C62828 transparent;
        }
        .red-ribbon::after {
          right: -15px;
          border-width: 12px 0 12px 15px;
          border-color: #C62828 transparent #C62828 transparent;
        }

        .sub-category-bar {
          display: flex; gap: 12px; margin-bottom: 24px; overflow-x: auto;
          padding: 6px 2px; scrollbar-width: none;
        }
        .sub-category-bar::-webkit-scrollbar { display: none; }
        
        .sub-pill {
          display: flex; align-items: center; gap: 8px; padding: 10px 20px;
          background: var(--card-bg); border: 2.5px solid var(--border-color);
          border-bottom-width: 5px;
          border-radius: 50px; cursor: pointer; white-space: nowrap;
          color: var(--text-muted); font-weight: 900; font-size: 0.8rem;
          transition: all 0.15s;
        }
        .sub-pill:active {
          transform: translateY(2px);
          border-bottom-width: 2.5px;
        }
        .sub-pill.active {
          background: var(--secondary-color); 
          border-color: var(--secondary-color);
          border-bottom-color: #1485BA;
          color: white; 
          transform: translateY(-2px); 
          box-shadow: 0 6px 14px rgba(28, 176, 246, 0.25);
        }

        .items-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); 
          gap: 24px; 
          max-width: 1200px;
          margin: 0 auto;
        }
        
        @media (max-width: 600px) {
          .items-grid {
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
        }

        /* GACHA CARD REVAMP */
        .gacha-special-card {
          background: linear-gradient(135deg, #7E57C2, #4527A0); 
          border-radius: 35px;
          padding: 35px 24px; 
          display: flex; 
          flex-direction: column; 
          align-items: center;
          border: 4px solid #FFD700; 
          box-shadow: 0 16px 36px rgba(69, 39, 160, 0.35);
          max-width: 500px; 
          margin: 0 auto;
          position: relative;
        }
        .gacha-visual-box { position: relative; margin-bottom: 25px; }
        .box-glow {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 170px; height: 170px; background: #FFD700; border-radius: 50%;
          filter: blur(40px); opacity: 0.25;
        }
        .magic-chest-3d-main { transform: scale(0.85); z-index: 2; position: relative; }

        .gacha-options { width: 100%; display: flex; flex-direction: column; gap: 18px; margin-bottom: 24px; }
        
        .gacha-chunky-btn {
          position: relative;
          width: 100%;
          height: 60px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .gacha-chunky-btn.multi {
          height: 66px;
        }
        .gacha-chunky-btn .g-btn-face {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 2;
          transition: transform 0.1s;
          border: 2px solid rgba(255,255,255,0.15);
        }
        .gacha-chunky-btn.single .g-btn-face {
          background: #58CC02;
        }
        .gacha-chunky-btn.multi .g-btn-face {
          background: #f4c265;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .gacha-chunky-btn .g-btn-bottom {
          position: absolute;
          inset: 0;
          bottom: -6px;
          border-radius: 18px;
          z-index: 1;
          transition: bottom 0.1s;
        }
        .gacha-chunky-btn.single .g-btn-bottom {
          background: #46A302;
        }
        .gacha-chunky-btn.multi .g-btn-bottom {
          background: #D97706;
        }

        .g-btn-title { font-weight: 900; font-size: 1.1rem; letter-spacing: 0.5px; }
        .g-btn-price { font-weight: 900; font-size: 0.9rem; opacity: 0.95; margin-top: 2px; }
        
        .gacha-chunky-btn:hover .g-btn-face {
          filter: brightness(1.05);
        }
        .gacha-chunky-btn:active .g-btn-face {
          transform: translateY(4px);
        }
        .gacha-chunky-btn:active .g-btn-bottom {
          bottom: -2px;
        }

        .bonus-pill {
          position: absolute; top: -14px; right: 24px; background: #FFD700;
          color: #8E44AD; font-weight: 900; font-size: 0.7rem; padding: 5px 12px;
          border-radius: 50px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          z-index: 5;
          animation: bounceMini 2s infinite ease-in-out;
        }
        @keyframes bounceMini {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .view-catalog-btn {
          background: rgba(255,255,255,0.15); border: 2px dashed rgba(255,255,255,0.4);
          color: white; font-weight: 900; font-size: 0.85rem; padding: 12px 24px;
          border-radius: 50px; cursor: pointer; transition: all 0.2s;
        }
        .view-catalog-btn:hover { background: rgba(255,255,255,0.25); border-style: solid; }

        /* CATALOG MODAL */
        .gacha-catalog-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 6000;
          display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);
        }
        .gacha-catalog-modal {
          background: var(--background-color); width: 90%; max-width: 420px;
          border-radius: 32px; padding: 28px; max-height: 80vh; display: flex; flex-direction: column;
          border: 4px solid var(--border-color);
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .catalog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .catalog-header h3 { margin: 0; font-weight: 950; color: var(--text-color); font-size: 1.3rem; }
        .close-catalog { background: none; border: none; font-size: 1.6rem; color: var(--text-muted); cursor: pointer; font-weight: bold; }
        
        .catalog-scroll-area { flex: 1; overflow-y: auto; padding-right: 5px; }
        .catalog-item-row {
          background: var(--card-bg); padding: 14px 18px; border-radius: 18px;
          margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;
          border: 2.5px solid transparent;
        }
        .catalog-item-row.epic { border-color: #FFD700; background: #FFF9E6; }
        .catalog-item-row.rare { border-color: #1CB0F6; background: #E3F2FD; }
        .catalog-item-row.common { border-color: var(--border-color); background: var(--card-bg); }

        .c-item-name { font-weight: 900; color: var(--text-color); font-size: 0.95rem; }
        .epic .c-item-name, .rare .c-item-name { color: #2C3E50; }
        
        .c-item-meta { display: flex; align-items: center; gap: 12px; }
        .c-rarity-tag { font-size: 0.65rem; font-weight: 900; padding: 3px 10px; border-radius: 50px; color: white; letter-spacing: 0.5px; }
        .epic .c-rarity-tag { background: #FFD700; color: #8B4513; }
        .rare .c-rarity-tag { background: #1CB0F6; }
        .common .c-rarity-tag { background: #AFAFAF; }
        
        .c-chance { font-weight: 900; color: var(--text-muted); font-size: 0.85rem; min-width: 35px; text-align: right; }
        .epic .c-chance, .rare .c-chance { color: #5D6D7E; }

        .catalog-footer { text-align: center; margin-top: 18px; font-size: 0.8rem; color: var(--text-muted); font-weight: 800; }
      `}</style>
    </div>
  );
}
