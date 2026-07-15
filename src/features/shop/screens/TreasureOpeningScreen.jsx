import React, { useState, useEffect } from 'react';
import { Sparkles, Star, ChevronRight, Info } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { SHOP_CATALOG } from '../../../data/shop/catalog';
import MagicChest3D from '../components/MagicChest3D';
import { drawFromGachaPool } from '../../../utils/gachaUtils';
import { soundManager } from '../../../utils/SoundManager';

export default function TreasureOpeningScreen() {
  const { addArtifact, ownedArtifacts } = useStore();
  const { setShopSubView, shopGachaCount } = useNavigationStore();
  
  const [step, setStep] = useState('waiting'); // waiting, opening, opened, results
  const [resultItems, setResultItems] = useState([]);
  const [highestRarity, setHighestRarity] = useState('common');
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null); // Item for popup
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);
  
  // Track IDs already owned before this gacha
  const [preOwnedIds, setPreOwnedIds] = useState([]);

  const startOpening = () => {
    // Save currently owned IDs
    setPreOwnedIds(ownedArtifacts.map(a => a.id));
    setStep('opening'); // triggers vibrate
    
    // Draw items using the externalized logic
    const drawn = drawFromGachaPool(SHOP_CATALOG.gachaPool, shopGachaCount);
    
    setResultItems(drawn);
    
    const hasEpic = drawn.some(i => i.rarity === 'epic');
    const hasRare = drawn.some(i => i.rarity === 'rare');
    const finalRarity = hasEpic ? 'epic' : (hasRare ? 'rare' : 'common');
    setHighestRarity(finalRarity);

    let hasOpened = false;
    const proceedToOpen = () => {
      if (hasOpened) return;
      hasOpened = true;

      setStep('opened');
      soundManager.play('chest_open', 0.6);
      
      // Trigger dramatic effects if Epic
      if (finalRarity === 'epic') {
        setIsFlashActive(true);
        setShowShockwave(true);
        setTimeout(() => setIsFlashActive(false), 500);
        setTimeout(() => setShowShockwave(false), 1000);
      }

      // Wait for lid to open and light to shine for 1.5s, then show results
      setTimeout(() => {
        setStep('results');
        soundManager.play('success', 0.5);
        drawn.forEach(item => addArtifact(item));
      }, 1500);
    };

    // Play whoosh SFX
    soundManager.play('whoosh', 0.65);

    const whooshAudio = soundManager.sounds?.whoosh;
    if (whooshAudio && soundManager.enabled) {
      whooshAudio.onended = () => {
        whooshAudio.onended = null;
        proceedToOpen();
      };
      // Fallback timer: whoosh is usually ~1-1.5s, so 2.5s fallback is super safe
      setTimeout(proceedToOpen, 2500);
    } else {
      // If sound manager is disabled or audio not available, open after standard 1.5s vibrate
      setTimeout(proceedToOpen, 1500);
    }
  };

  const revealAll = () => {
    // Filter out indices that are already revealed
    const unrevealedIndices = resultItems
      .map((_, i) => i)
      .filter(i => !revealedIndices.includes(i));

    if (unrevealedIndices.length === 0) return;

    // Reveal one by one with a delay of 200ms
    unrevealedIndices.forEach((idx, stepIndex) => {
      setTimeout(() => {
        setRevealedIndices(prev => {
          if (prev.includes(idx)) return prev;
          const next = [...prev, idx];
          
          // Play squash sound when a card is revealed!
          soundManager.play('squash', 0.6);

          // If it is Epic, trigger epic dramatic flash and shockwave effects exactly as it opens
          if (resultItems[idx].rarity === 'epic') {
            setIsFlashActive(true);
            setTimeout(() => setIsFlashActive(false), 500);
            setShowShockwave(true);
            setTimeout(() => setShowShockwave(false), 1000);
          }

          return next;
        });
      }, stepIndex * 200); // 200ms delay between each card opening
    });
  };

  const revealOneOrShowDetail = (index) => {
    if (!revealedIndices.includes(index)) {
      // If single reveal is Epic, add a small flash!
      if (resultItems[index].rarity === 'epic') {
        setIsFlashActive(true);
        setTimeout(() => setIsFlashActive(false), 300);
        setShowShockwave(true);
        setTimeout(() => setShowShockwave(false), 1000);
      }
      soundManager.play('squash', 0.6); // 🔊 Play squash sound!
      setRevealedIndices([...revealedIndices, index]);
    } else {
      setSelectedDetail(resultItems[index]);
    }
  };

  return (
    <div className={`opening-screen-container ${highestRarity} ${step}`}>
      {/* SCREEN FLASH */}
      {isFlashActive && <div className="screen-flash" />}
      
      {/* SHOCKWAVE */}
      {showShockwave && <div className="shockwave" />}

      {/* BACKGROUND EFFECTS */}
      {/* BACKGROUND EFFECTS - ONLY SHOW RAYS WHEN OPENED */}
      {(step === 'opened' || step === 'results') && (
        <div className="magic-portal-bg">
          <div className="portal-rays" />
          <div className="portal-ring" />
        </div>
      )}
      
      <div className="stars-layer" />
      
      {/* FLOATING SYMBOLS BACKGROUND */}
      <div className="floating-symbols">
        <div className="symbol s1">⚡</div>
        <div className="symbol s2">🍱</div>
        <div className="symbol s3">☕</div>
        <div className="symbol s4">🛵</div>
        <div className="symbol s5">🗺️</div>
      </div>

      {highestRarity === 'epic' && step !== 'waiting' && (
        <>
          <div className="epic-vortex" />
          <div className="epic-embers">
            {[...Array(30)].map((_, i) => <div key={i} className="ember" />)}
          </div>
        </>
      )}

      {/* CHEST SECTION */}
      {(step === 'waiting' || step === 'opening' || step === 'opened' || (step === 'results' && shopGachaCount === 1)) && (
        <div className={`chest-focus ${step === 'results' ? 'fade-up' : ''} ${isFlashActive ? 'shake-hard' : ''}`}>
          <MagicChest3D 
            isVibrating={step === 'opening'} 
            isOpen={step === 'opened' || step === 'results'} 
            rarity={(step === 'opened' || step === 'results') ? highestRarity : 'common'} 
          />
        </div>
      )}

      {/* WAITING VIEW */}
      {step === 'waiting' && (
        <div className="waiting-text">
          <h2>Peti Ajaib Siap Dibuka!</h2>
          <p>Membuka {shopGachaCount} Peti. Benda sejarah apa ya yang ada di dalamnya?</p>
          <button className="open-now-btn" onClick={startOpening}>
            <div className="btn-3d-face">BUKA SEKARANG!</div>
            <div className="btn-3d-bottom"></div>
          </button>
        </div>
      )}

      {/* OPENING VIEW */}
      {step === 'opening' && (
        <h2 className="opening-label">MEMBUKA...</h2>
      )}

      {/* RESULT VIEW - SINGLE */}
      {step === 'results' && shopGachaCount === 1 && resultItems.length === 1 && (
        <div className="result-view-single">
          <div className="result-card-3d">
            {!preOwnedIds.includes(resultItems[0].id) && <div className="new-ribbon">BARU!</div>}
            <div className="success-banner">BARANG BERHARGA!</div>
            <div className={`rarity-halo ${resultItems[0].rarity}`} />
            <div className="item-visual-large">{resultItems[0].icon}</div>
            
            <div className="item-info-box">
              <div className={`rarity-tag ${resultItems[0].rarity}`}>
                {resultItems[0].rarity.toUpperCase()}
              </div>
              <h2>{resultItems[0].name}</h2>
              <p>{resultItems[0].desc}</p>
              <div className="card-stars large">
                {Array.from({ length: resultItems[0].rarity === 'epic' ? 3 : resultItems[0].rarity === 'rare' ? 2 : 1 }).map((_, i) => (
                  <Star key={i} className="star-icon" size={18} fill="#FFD700" color="#FFA800" />
                ))}
              </div>
            </div>

            <button className="claim-btn" onClick={() => setShopSubView('gacha')}>
              SELESAI
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* RESULT VIEW - MULTIPLE (GRID) */}
      {step === 'results' && shopGachaCount > 1 && (
        <div className="result-view-grid">
          
          <div className="gacha-grid">
            {resultItems.map((item, idx) => {
              const isRevealed = revealedIndices.includes(idx);
              const isNew = !preOwnedIds.includes(item.id);
              return (
                <div 
                  key={idx} 
                  className={`gacha-card-wrapper ${isRevealed ? 'revealed' : ''}`}
                  onClick={() => revealOneOrShowDetail(idx)}
                  data-rarity={item.rarity}
                >
                  <div className="gacha-card-inner">
                    {/* BACK OF CARD */}
                    <div className="gacha-card-back">
                      <span className="question-mark">?</span>
                    </div>
                    {/* FRONT OF CARD */}
                    <div className="gacha-card-front">
                      {isNew && <div className="card-new-tag">BARU</div>}
                      <span className="card-icon">{item.icon}</span>
                      <span className="card-name">{item.name}</span>
                      <div className="card-stars">
                        {Array.from({ length: item.rarity === 'epic' ? 3 : item.rarity === 'rare' ? 2 : 1 }).map((_, i) => (
                          <Star key={i} className="star-icon" size={10} fill="#FFD700" color="#FFA800" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid-actions">
            {revealedIndices.length < shopGachaCount ? (
              <button className="reveal-all-btn" onClick={revealAll}>
                Buka Semua
              </button>
            ) : (
              <button className="claim-btn" onClick={() => setShopSubView('gacha')}>
                SELESAI
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ITEM DETAIL POPUP */}
      {selectedDetail && (
        <div className="item-detail-overlay" onClick={() => setSelectedDetail(null)}>
          <div className="detail-modal" onClick={e => e.stopPropagation()}>
            <div className={`detail-rarity ${selectedDetail.rarity}`}>{selectedDetail.rarity.toUpperCase()}</div>
            <div className="detail-icon">{selectedDetail.icon}</div>
            <h3>{selectedDetail.name}</h3>
            <p>{selectedDetail.desc}</p>
            <div className="card-stars large" style={{ marginBottom: '25px', marginTop: '-15px' }}>
              {Array.from({ length: selectedDetail.rarity === 'epic' ? 3 : selectedDetail.rarity === 'rare' ? 2 : 1 }).map((_, i) => (
                <Star key={i} className="star-icon" size={18} fill="#FFD700" color="#FFA800" />
              ))}
            </div>
            <button className="close-detail-btn" onClick={() => setSelectedDetail(null)}>Tutup</button>
          </div>
        </div>
      )}

      <style jsx>{`
        /* SUPER DUPER WAH BACKGROUND */
        .magic-portal-bg {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          z-index: 0; overflow: hidden;
        }
        .portal-rays {
          position: absolute; width: 250%; height: 250%;
          background: repeating-conic-gradient(
            from 0deg,
            rgba(255, 255, 255, 0.05) 0deg,
            transparent 15deg,
            transparent 30deg
          );
          animation: rotatePortal 40s linear infinite;
          filter: blur(3px);
        }
        .epic .portal-rays {
          background: repeating-conic-gradient(
            from 0deg,
            rgba(255, 215, 0, 0.15) 0deg,
            transparent 8deg,
            transparent 16deg
          );
          animation: rotatePortal 15s linear infinite;
          filter: blur(5px);
        }

        .portal-ring {
          position: absolute; width: 400px; height: 400px;
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          box-shadow: 0 0 100px rgba(255,255,255,0.05);
          animation: pulseRing 3s ease-in-out infinite;
        }
        .epic .portal-ring {
          border-color: rgba(255, 150, 0, 0.4);
          box-shadow: 0 0 150px rgba(255, 150, 0, 0.3);
          width: 500px; height: 500px;
        }

        .floating-symbols {
          position: absolute; inset: 0; z-index: 0; opacity: 0.3;
        }
        .symbol {
          position: absolute; font-size: 2rem; 
          animation: floatSymbol 10s linear infinite;
        }
        .s1 { top: 10%; left: 15%; animation-delay: 0s; }
        .s2 { top: 20%; right: 10%; animation-delay: -2s; }
        .s3 { bottom: 15%; left: 10%; animation-delay: -4s; }
        .s4 { bottom: 10%; right: 15%; animation-delay: -6s; }
        .s5 { top: 50%; left: 5%; animation-delay: -8s; }

        @keyframes rotatePortal {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes floatSymbol {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(20px, -100px) rotate(20deg); opacity: 0; }
        }

        .epic-vortex {
          position: absolute; inset: 0;
          background: radial-gradient(circle, rgba(244, 194, 101, 0.2) 0%, transparent 70%);
          animation: vortexPulse 2s ease-in-out infinite;
          z-index: 0;
        }
        @keyframes vortexPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }

        .opening-screen-container {
          position: fixed; inset: 0; background: #1a1a2e;
          z-index: 2000; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif; overflow: hidden;
        }

        .magic-rays-bg {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 600px; height: 600px; 
          background: radial-gradient(circle, rgba(206, 130, 255, 0.1) 0%, transparent 60%);
          animation: spin 15s linear infinite; z-index: 0;
          transition: all 1s;
        }
        .epic .magic-rays-bg {
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, transparent 70%);
          animation-duration: 5s;
        }

        .stars-layer {
          position: absolute; inset: 0;
          background-image: radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 110px 10px, #ddd, rgba(0,0,0,0));
          background-size: 200px 200px;
          opacity: 0.3;
        }

        .screen-flash {
          position: fixed; inset: 0; background: white; z-index: 9999;
          animation: flashAnim 0.5s ease-out forwards;
        }
        @keyframes flashAnim { from { opacity: 1; } to { opacity: 0; } }

        .shockwave {
          position: absolute; top: 50%; left: 50%; 
          width: 10px; height: 10px; background: none;
          border: 4px solid white; border-radius: 50%;
          transform: translate(-50%, -50%); z-index: 99;
          animation: shockAnim 1s ease-out forwards;
        }
        @keyframes shockAnim {
          from { width: 0; height: 0; opacity: 1; border-width: 20px; }
          to { width: 800px; height: 800px; opacity: 0; border-width: 0px; }
        }

        .epic-embers {
          position: absolute; inset: 0; pointer-events: none; z-index: 5;
        }
        .ember {
          position: absolute; width: 4px; height: 4px; background: #FFD700;
          border-radius: 50%; box-shadow: 0 0 10px #FFD700;
          animation: emberFloat 4s linear infinite;
          bottom: -10px;
        }
        .ember:nth-child(even) { width: 6px; height: 6px; background: #f4c265; }
        
        @keyframes emberFloat {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px) scale(0); opacity: 0; }
        }

        /* Distribute embers */
        ${[...Array(20)].map((_, i) => `
          .ember:nth-child(${i+1}) { 
            left: ${Math.random() * 100}%; 
            animation-delay: ${Math.random() * 4}s;
            animation-duration: ${3 + Math.random() * 3}s;
          }
        `).join('')}

        .shake-hard { animation: shakeHard 0.3s infinite; }
        @keyframes shakeHard {
          0% { transform: translate(2px, 1px) rotate(0deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          80% { transform: translate(3px, 1px) rotate(-1deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }

        .chest-focus { position: relative; z-index: 10; margin-bottom: 20px; transition: all 0.5s; }
        .chest-focus.fade-up { transform: scale(0.5) translateY(-50px); opacity: 0.8; margin-bottom: -50px;}
        
        .waiting-text { text-align: center; z-index: 10; }
        .waiting-text h2 { color: white; font-weight: 900; font-size: 1.8rem; margin: 0; }
        .waiting-text p { color: rgba(255,255,255,0.6); font-weight: 700; margin-top: 10px; margin-bottom: 40px; }

        .open-now-btn { position: relative; width: 250px; height: 65px; background: none; border: none; cursor: pointer; margin: 0 auto;}
        .btn-3d-face {
          position: absolute; inset: 0; background: #CE82FF; border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 900; font-size: 1.2rem; z-index: 2;
          border: 2px solid rgba(255,255,255,0.2); transition: transform 0.1s;
        }
        .btn-3d-bottom { position: absolute; inset: 0; bottom: -8px; background: #8E44AD; border-radius: 20px; z-index: 1; }
        .open-now-btn:active .btn-3d-face { transform: translateY(4px); }
        .open-now-btn:active .btn-3d-bottom { bottom: -4px; }

        .opening-label { color: #CE82FF; font-weight: 900; margin-top: 30px; letter-spacing: 4px; z-index: 10; animation: blink 0.5s alternate infinite; }
        @keyframes blink { from { opacity: 1; } to { opacity: 0.5; } }

        /* SINGLE RESULT */
        .result-view-single { width: 100%; display: flex; justify-content: center; padding: 20px; z-index: 10; }
        .result-card-3d {
          background: white; width: 100%; max-width: 320px; border-radius: 40px;
          padding: 50px 30px 30px; text-align: center; position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          animation: cardPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes cardPop { from { transform: scale(0.5) translateY(50px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        
        .success-banner {
          position: absolute; top: -20px; left: 50%; transform: translateX(-50%);
          background: #58CC02; color: white; padding: 10px 25px; border-radius: 50px;
          font-weight: 900; font-size: 1rem; box-shadow: 0 8px 0 #46A302; z-index: 5;
        }
        .item-visual-large { font-size: 6rem; position: relative; z-index: 2; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1)); margin-bottom: 10px;}
        .rarity-halo {
          position: absolute; top: 80px; left: 50%; transform: translate(-50%, -50%);
          width: 150px; height: 150px; border-radius: 50%; filter: blur(30px); opacity: 0.4;
        }
        .rarity-halo.epic { background: #FFD700; }
        .rarity-halo.rare { background: #1CB0F6; }
        .rarity-halo.common { background: #AFAFAF; }

        .item-info-box h2 { font-weight: 900; font-size: 1.6rem; color: #4B4B4B; margin: 15px 0 10px; }
        .item-info-box p { font-weight: 700; color: #777; font-size: 0.9rem; line-height: 1.4; margin-bottom: 25px; }
        
        .rarity-tag { display: inline-block; padding: 4px 15px; border-radius: 50px; color: white; font-weight: 900; font-size: 0.75rem; }
        .rarity-tag.epic { background: #FFD700; color: #8B4513; }
        .rarity-tag.rare { background: #1CB0F6; }
        .rarity-tag.common { background: #AFAFAF; }

        /* GRID RESULT */
        .result-view-grid { z-index: 10; width: 100%; max-width: 600px; padding: 10px; text-align: center; }
        .grid-title { color: white; font-weight: 900; font-size: 1.2rem; margin-bottom: 15px; }
        
        .gacha-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
          margin-bottom: 25px; justify-items: center;
        }

        .gacha-card-wrapper {
          width: 100%; aspect-ratio: 3/4; perspective: 1000px; cursor: pointer;
          max-width: 110px;
        }
        .gacha-card-inner {
          position: relative; width: 100%; height: 100%;
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        .gacha-card-wrapper.revealed .gacha-card-inner { transform: rotateY(180deg); }

        .gacha-card-front, .gacha-card-back {
          position: absolute; width: 100%; height: 100%;
          backface-visibility: hidden; border-radius: 12px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }

        .gacha-card-back {
          background: white;
          border: 2px solid #E5E5E5;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .gacha-card-wrapper[data-rarity='epic'] .gacha-card-back {
          background: linear-gradient(135deg, #FFD700, #F39C12);
          border-color: #F1C40F;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
        }
        .gacha-card-wrapper[data-rarity='epic'] .question-mark { color: #8B4513; }

        .gacha-card-wrapper[data-rarity='rare'] .gacha-card-back {
          background: linear-gradient(135deg, #1CB0F6, #1899D6);
          border-color: #1485BA;
        }
        .gacha-card-wrapper[data-rarity='rare'] .question-mark { color: rgba(255,255,255,0.7); }

        .question-mark { color: #AFAFAF; font-size: 2rem; font-weight: 900; }

        .gacha-card-front {
          background: white; border: 3px solid #E5E5E5;
          transform: rotateY(180deg); box-shadow: 0 0 15px rgba(255,255,255,0.2);
          padding: 8px; position: relative;
        }

        .gacha-card-wrapper.revealed[data-rarity='rare'] .gacha-card-front {
          background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
          border-color: #1CB0F6;
        }
        [data-rarity='rare'] .card-name { color: #1485BA; }

        .card-new-tag {
          position: absolute; top: -5px; right: -5px; background: #FF4B4B;
          color: white; font-size: 0.5rem; font-weight: 900; padding: 2px 6px;
          border-radius: 4px; z-index: 5; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .new-ribbon {
          position: absolute; top: 10px; right: 10px; background: #FF4B4B;
          color: white; font-size: 0.8rem; font-weight: 900; padding: 5px 15px;
          border-radius: 8px; z-index: 10; transform: rotate(15deg);
          box-shadow: 0 4px 0 #A52A2A;
        }

        .item-detail-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.85);
          display: flex; align-items: center; justify-content: center;
          z-index: 3000; backdrop-filter: blur(5px);
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .detail-modal {
          background: white; width: 90%; max-width: 350px; border-radius: 30px;
          padding: 30px; text-align: center; position: relative;
          animation: modalUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes modalUp { from { transform: scale(0.8) translateY(50px); } to { transform: scale(1) translateY(0); } }

        .detail-rarity {
          display: inline-block; padding: 4px 12px; border-radius: 50px;
          color: white; font-weight: 900; font-size: 0.7rem; margin-bottom: 20px;
        }
        .detail-rarity.epic { background: #FFD700; color: #8B4513; }
        .detail-rarity.rare { background: #1CB0F6; }
        .detail-rarity.common { background: #AFAFAF; }

        .detail-icon { font-size: 5rem; margin-bottom: 20px; }
        .detail-modal h3 { font-weight: 900; font-size: 1.5rem; color: #4B4B4B; margin: 0 0 10px; }
        .detail-modal p { color: #777; font-weight: 600; line-height: 1.5; margin-bottom: 30px; }

        .close-detail-btn {
          width: 100%; background: #E5E5E5; border: none; padding: 15px;
          border-radius: 15px; font-weight: 900; color: #777; cursor: pointer;
        }

        .gacha-card-wrapper.revealed[data-rarity='epic'] .gacha-card-front {
          background: linear-gradient(135deg, #FFD700, #F39C12);
          border-color: #F1C40F;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
          overflow: hidden;
        }

        .gacha-card-wrapper.revealed[data-rarity='epic'] .gacha-card-front::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          20%, 100% { transform: translateX(100%) rotate(45deg); }
        }
        
        .card-icon { font-size: 2rem; margin-bottom: 3px; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.1)); position: relative; z-index: 2; }
        
        [data-rarity='epic'] .card-name { color: #8B4513; position: relative; z-index: 2; }
        .card-name { font-size: 0.6rem; font-weight: 900; color: #4B4B4B; text-align: center; line-height: 1.1; margin-bottom: 2px; }

        .card-stars {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2px;
          margin-top: auto;
          position: relative;
          z-index: 2;
        }
        .card-stars.large {
          gap: 6px;
          margin-top: 15px;
          margin-bottom: 10px;
        }
        .star-icon {
          animation: starGlow 1.5s ease-in-out infinite alternate;
        }
        @keyframes starGlow {
          from { filter: drop-shadow(0 0 1px rgba(255, 215, 0, 0.4)); }
          to { filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.9)); }
        }

        .grid-actions { display: flex; justify-content: center; gap: 15px; }
        
        .reveal-all-btn {
          background: #FFD700; color: #8B4513; border: none; padding: 15px 30px;
          border-radius: 20px; font-weight: 900; font-size: 1.1rem; cursor: pointer;
          box-shadow: 0 6px 0 #d1a34b; transition: transform 0.1s;
        }
        .reveal-all-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #d1a34b; }

        .claim-btn {
          width: 100%; max-width: 250px; background: #1CB0F6; color: white; border: none;
          padding: 18px; border-radius: 20px; font-weight: 900; font-size: 1rem;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 6px 0 #1899D6; cursor: pointer; margin: 0 auto;
        }
        .claim-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #1899D6; }
        
        .confetti-layer { position: absolute; font-size: 3rem; pointer-events: none; animation: floatUp 3s infinite ease-out; }
        @keyframes floatUp { 0% { transform: translateY(100px); opacity: 1; } 100% { transform: translateY(-100px); opacity: 0; } }
      `}</style>
    </div>
  );
}
