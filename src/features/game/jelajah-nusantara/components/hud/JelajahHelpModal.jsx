import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, HelpCircle, Star, Heart, Coins, Sparkles, Swords, Briefcase } from 'lucide-react';


import markasImg from '../../../../../assets/game/tiles/markas_p1.png';
import petiImg from '../../../../../assets/game/tiles/peti.png';
import jejakImg from '../../../../../assets/game/tiles/jejak.png';
import penjagaImg from '../../../../../assets/game/tiles/penjaga.png';
import jebakanImg from '../../../../../assets/game/tiles/jebakan.png';
import kartuImg from '../../../../../assets/game/tiles/kartu.png';

export default function JelajahHelpModal({ isOpen, onClose }) {
  console.log("[DEBUG] JelajahHelpModal: isOpen =", isOpen);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = 5;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="help-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            className="help-modal-card"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
          >
            
            <div className="help-modal-header">
              <div className="title-group">
                <HelpCircle size={22} className="help-title-icon" />
                <h3>Panduan Bermain</h3>
              </div>
              <button className="help-modal-close" onClick={onClose} title="Tutup">
                <X size={20} />
              </button>
            </div>

            
            <div className="help-modal-body">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="page-slide"
                >
                  {currentPage === 0 && (
                    <div className="help-page-layout text-center">
                      <div className="illustration-wrapper hero-style">
                        <div className="ring-pulse"></div>
                        <img src={markasImg} alt="Markas" className="large-illus" />
                        <div className="floating-mini-gold"><Coins size={18} fill="#FFD700" color="#B58A00" /></div>
                      </div>
                      <h4 className="page-title">Cara Menang!</h4>
                      <p className="page-text font-lg">
                        Tujuan utamamu adalah mengisi <strong>3 Peti Artefak</strong> di <strong>Markasmu</strong>!
                      </p>
                      <div className="tip-box">
                        <Sparkles size={16} color="#FFD700" className="inline-icon" />
                        <span>Kumpulkan <strong>Koin Emas</strong> selama menjelajahi papan dan bawalah pulang ke Markasmu.</span>
                      </div>
                    </div>
                  )}

                  {currentPage === 1 && (
                    <div className="help-page-layout">
                      <h4 className="page-title text-center">Mengenal Mata Uang</h4>
                      <div className="currencies-list">
                        <div className="currency-item">
                          <div className="currency-badge red"><Heart size={20} fill="white" color="white" /></div>
                          <div className="currency-details">
                            <h5>Tekad (HP)</h5>
                            <p>Energi utamamu untuk bertahan di papan. Tekad akan berkurang jika salah menjawab kuis atau terkena jebakan. Jika habis (0), kamu akan <strong>Tumbang</strong>!</p>
                          </div>
                        </div>

                        <div className="currency-item">
                          <div className="currency-badge yellow"><Coins size={20} fill="white" color="white" /></div>
                          <div className="currency-details">
                            <h5>Koin Emas</h5>
                            <p>Uang yang kamu dapatkan di sepanjang jalan. Gunakan koin ini untuk mengisi Peti Artefak di Markasmu agar memenangkan game.</p>
                          </div>
                        </div>

                        <div className="currency-item">
                          <div className="currency-badge blue"><Star size={20} fill="white" color="white" /></div>
                          <div className="currency-details">
                            <h5>Bintang</h5>
                            <p>Hadiah utama setelah menyelesaikan game. Kumpulkan Bintang untuk membeli baju, topi, dan aksesoris keren di Toko!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPage === 2 && (
                    <div className="help-page-layout">
                      <h4 className="page-title text-center">Petak Petualangan (1/2)</h4>
                      <div className="tiles-grid">
                        <div className="tile-help-row">
                          <img src={markasImg} alt="Markas" className="tile-icon" />
                          <div>
                            <h5>Markas (Base)</h5>
                            <p>Tempat istirahat untuk memulihkan Tekad. Setiap melewati markas sendiri, kamu juga mendapat bonus koin emas gratis!</p>
                          </div>
                        </div>

                        <div className="tile-help-row">
                          <img src={petiImg} alt="Peti" className="tile-icon" />
                          <div>
                            <h5>Peti Harta</h5>
                            <p>Petak keberuntungan! Singgahi untuk langsung memulihkan Tekad dan mendapat koin gratis.</p>
                          </div>
                        </div>

                        <div className="tile-help-row">
                          <img src={jejakImg} alt="Jejak" className="tile-icon" />
                          <div>
                            <h5>Jejak Pengetahuan</h5>
                            <p>Di sini kamu ditantang menjawab kuis sejarah seru. Jawaban benar memberimu koin, tapi jawaban salah mengurangi Tekadmu!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPage === 3 && (
                    <div className="help-page-layout">
                      <h4 className="page-title text-center">Petak Petualangan (2/2)</h4>
                      <div className="tiles-grid">
                        <div className="tile-help-row">
                          <img src={penjagaImg} alt="Penjaga" className="tile-icon" />
                          <div>
                            <h5>Tantangan Penjaga</h5>
                            <p>Adu lemparan dadumu melawan monster penjaga. Menang dapat koin, kalah mengurangi koin dan Tekad!</p>
                          </div>
                        </div>

                        <div className="tile-help-row">
                          <img src={jebakanImg} alt="Jebakan" className="tile-icon" />
                          <div>
                            <h5>Lubang Jebakan</h5>
                            <p>Awas! Ada duri tajam (-Tekad), angin puyuh (tiup mundur), atau koin bocor yang siap menghambat perjalananmu.</p>
                          </div>
                        </div>

                        <div className="tile-help-row">
                          <img src={kartuImg} alt="Kartu" className="tile-icon" />
                          <div>
                            <h5>Kotak Kartu</h5>
                            <p>Ambil kartu aksi misterius secara acak ke dalam tas strategi (maksimal 3 kartu).</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPage === 4 && (
                    <div className="help-page-layout">
                      <h4 className="page-title text-center">Duel & Kartu Aksi</h4>
                      <div className="features-list">
                        <div className="feature-item">
                          <div className="feature-header-icon"><Swords size={20} color="#f4c265" /></div>
                          <div>
                            <h5>Laga Petualang</h5>
                            <p>Jika kamu berhenti di petak yang sama dengan pemain lain, duel dimulai! Pemenang bisa merebut koin atau tekad lawan.</p>
                          </div>
                        </div>

                        <div className="feature-item">
                          <div className="feature-header-icon"><Briefcase size={20} color="#f4c265" /></div>
                          <div>
                            <h5>Menggunakan Kartu Aksi</h5>
                            <p>Gunakan kartu sakti di awal giliranmu untuk melompat lebih jauh, memulihkan Tekad, atau bahkan berpindah tempat secara instan!</p>
                          </div>
                        </div>

                        <div className="feature-item">
                          <div className="feature-header-icon"><Heart size={20} color="#EF4444" fill="#EF4444" /></div>
                          <div>
                            <h5>Tumbang & Bangkit</h5>
                            <p>Jika Tekadmu habis, kamu akan pingsan. Lempar dadu pemulihan di awal giliranmu untuk bangkit kembali!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            
            <div className="help-modal-footer">
              <button
                className={`nav-btn prev-btn ${currentPage === 0 ? 'disabled' : ''}`}
                onClick={handlePrev}
                disabled={currentPage === 0}
              >
                <ChevronLeft size={18} />
                <span>Sebelumnya</span>
              </button>

              
              <div className="dots-row">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`dot-indicator ${idx === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(idx)}
                  />
                ))}
              </div>

              <button className="nav-btn next-btn" onClick={handleNext}>
                <span>{currentPage === totalPages - 1 ? 'Selesai' : 'Lanjut'}</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
          .help-modal-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.6);
            display: flex; align-items: center; justify-content: center;
            z-index: 25000 !important; backdrop-filter: blur(5px);
            padding: 20px; box-sizing: border-box;
            -webkit-transform: translate3d(0, 0, 0) !important;
            transform: translate3d(0, 0, 0) !important;
            transform-style: preserve-3d !important;
            backface-visibility: hidden !important;
            -webkit-backface-visibility: hidden !important;
          }

          .help-modal-card {
            background: linear-gradient(180deg, #F3E5AB 0%, #E2C999 100%);
            width: 100%; max-width: 580px;
            border-radius: 32px;
            border: 4px dashed #6A3E16;
            box-shadow: 0 15px 40px rgba(106,62,22,0.4), inset 0 0 30px rgba(106,62,22,0.15);
            display: flex; flex-direction: column;
            max-height: 90vh; overflow: hidden;
            font-family: 'Outfit', sans-serif;
            pointer-events: auto;
          }

          .help-modal-header {
            padding: 16px 24px; border-bottom: 2.5px dashed #8B4513;
            display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
          }
          .title-group { display: flex; align-items: center; gap: 10px; }
          .help-title-icon { color: #8B4513; }
          .help-modal-header h3 { margin: 0; font-size: 1.2rem; font-weight: 950; color: #4A2E1B; text-transform: uppercase; letter-spacing: 0.5px; }

          .help-modal-close {
            background: #FFFDF0; border: 2.5px solid #8B4513; border-radius: 50%;
            width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
            color: #8B4513; cursor: pointer; box-shadow: 0 3px 0 #8B4513; transition: all 0.1s;
          }
          .help-modal-close:active { transform: translateY(2px); box-shadow: 0 1px 0 #8B4513; }

          .help-modal-body {
            flex: 1; overflow-y: auto; padding: 24px;
            min-height: 280px; display: flex; flex-direction: column;
          }
          .page-slide { width: 100%; flex: 1; display: flex; flex-direction: column; }

          .help-page-layout { display: flex; flex-direction: column; height: 100%; flex: 1; }
          .text-center { text-align: center; align-items: center; }

          .page-title {
            margin: 0 0 12px 0; font-size: 1.25rem; font-weight: 900; color: #4A2E1B;
            text-transform: uppercase; letter-spacing: 0.5px;
          }
          .page-text { margin: 0 0 16px 0; color: #4A2E1B; font-weight: 700; line-height: 1.5; }
          .page-text.font-lg { font-size: 1.05rem; }

          /* Page 1 Specific */
          .illustration-wrapper {
            position: relative; width: 110px; height: 110px;
            background: radial-gradient(circle, #FFFDF0 0%, #FFD700 100%);
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            border: 3.5px solid #8B4513; box-shadow: 0 6px 0 #8B4513, 0 10px 20px rgba(0,0,0,0.15);
            margin: 15px auto 25px;
          }
          .large-illus { width: 75px; height: 75px; object-fit: contain; }
          .floating-mini-gold {
            position: absolute; bottom: -5px; right: -5px; font-size: 1.8rem;
            animation: bounceMini 2s infinite alternate;
          }
          @keyframes bounceMini { 0% { transform: translateY(0); } 100% { transform: translateY(-6px); } }
          .ring-pulse {
            position: absolute; inset: -10px; border: 2.5px solid #FFD700; border-radius: 50%;
            opacity: 0.5; animation: pulseRing 2s infinite;
          }
          @keyframes pulseRing { 0% { transform: scale(0.9); opacity: 0.5; } 100% { transform: scale(1.25); opacity: 0; } }

          .tip-box {
            background: #FFFDF0; border: 2.5px dashed #8B4513; border-radius: 16px;
            padding: 12px 18px; color: #4A2E1B; font-size: 0.88rem; font-weight: 700;
            display: flex; gap: 10px; align-items: center; text-align: left;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); max-width: 440px; margin-top: auto;
          }
          .inline-icon { flex-shrink: 0; }

          /* Currencies List */
          .currencies-list { display: flex; flex-direction: column; gap: 14px; }
          .currency-item {
            background: #FFFDF0; border: 2.5px solid #8B4513; border-radius: 18px;
            padding: 10px 14px; display: flex; gap: 14px; align-items: center;
            box-shadow: 0 4px 0 #8B4513;
          }
          .currency-badge {
            width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
            border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.15); flex-shrink: 0;
          }
          .currency-badge.red { background: linear-gradient(135deg, #FF4B4B, #D33131); }
          .currency-badge.yellow { background: linear-gradient(135deg, #FFD700, #F59E0B); }
          .currency-badge.blue { background: linear-gradient(135deg, #1CB0F6, #0052D4); }
          .currency-details h5 { margin: 0 0 3px 0; font-size: 0.95rem; font-weight: 900; color: #4A2E1B; text-transform: uppercase; }
          .currency-details p { margin: 0; font-size: 0.76rem; font-weight: 700; color: #6A3E16; line-height: 1.4; }

          /* Tiles grid styling */
          .tiles-grid { display: flex; flex-direction: column; gap: 12px; }
          .tile-help-row {
            background: #FFFDF0; border: 2.5px solid #8B4513; border-radius: 18px;
            padding: 10px 14px; display: flex; gap: 14px; align-items: center;
            box-shadow: 0 4px 0 #8B4513;
          }
          .tile-icon { width: 50px; height: 50px; object-fit: contain; flex-shrink: 0; }
          .tile-help-row h5 { margin: 0 0 3px 0; font-size: 0.95rem; font-weight: 900; color: #4A2E1B; text-transform: uppercase; }
          .tile-help-row p { margin: 0; font-size: 0.76rem; font-weight: 700; color: #6A3E16; line-height: 1.4; }

          /* Feature List styles */
          .features-list { display: flex; flex-direction: column; gap: 12px; }
          .feature-item {
            background: #FFFDF0; border: 2.5px solid #8B4513; border-radius: 18px;
            padding: 10px 14px; display: flex; gap: 14px; align-items: center;
            box-shadow: 0 4px 0 #8B4513;
          }
          .feature-header-icon {
            width: 40px; height: 40px; border-radius: 12px; background: rgba(139,69,19,0.08);
            border: 2px solid #8B4513; display: flex; align-items: center; justify-content: center;
            font-size: 1.3rem; flex-shrink: 0;
          }
          .feature-item h5 { margin: 0 0 3px 0; font-size: 0.95rem; font-weight: 900; color: #4A2E1B; text-transform: uppercase; }
          .feature-item p { margin: 0; font-size: 0.76rem; font-weight: 700; color: #6A3E16; line-height: 1.4; }

          /* Footer styling */
          .help-modal-footer {
            padding: 16px 24px; border-top: 2.5px dashed #8B4513;
            display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
            background: rgba(106,62,22,0.05);
          }

          .nav-btn {
            background: linear-gradient(to bottom, #FFFDF0 0%, #FFF5D6 100%);
            border: 2.5px solid #8B4513; border-radius: 14px;
            padding: 8px 14px; display: flex; align-items: center; gap: 6px;
            color: #8B4513; font-weight: 900; font-size: 0.85rem; cursor: pointer;
            box-shadow: 0 4px 0 #8B4513; transition: all 0.1s;
            text-transform: uppercase; letter-spacing: 0.5px;
          }
          .nav-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 #8B4513; }
          .nav-btn.disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; box-shadow: 0 4px 0 #8B4513 !important; }

          .nav-btn.next-btn {
            background: linear-gradient(to bottom, #58CC02 0%, #46A302 100%);
            border-color: #2B2D42; color: white; box-shadow: 0 4px 0 #2B2D42;
          }
          .nav-btn.next-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 #2B2D42; }

          .dots-row { display: flex; gap: 8px; }
          .dot-indicator {
            width: 10px; height: 10px; border-radius: 50%; background: rgba(139,69,19,0.3);
            border: 1.5px solid #8B4513; cursor: pointer; transition: all 0.2s;
          }
          .dot-indicator.active { background: #FFD700; width: 14px; border-radius: 6px; }

          @media (max-height: 550px) {
            .help-modal-card { max-height: 95vh; }
            .help-modal-body { padding: 12px 20px; min-height: 200px; }
            .illustration-wrapper { width: 80px; height: 80px; margin: 5px auto 10px; }
            .large-illus { width: 50px; height: 50px; }
            .page-title { font-size: 1.1rem; margin-bottom: 8px; }
            .currencies-list, .tiles-grid, .features-list { gap: 8px; }
            .currency-item, .tile-help-row, .feature-item { padding: 6px 12px; border-radius: 12px; }
            .currency-badge { width: 32px; height: 32px; border-radius: 8px; }
            .tile-icon { width: 36px; height: 36px; }
            .feature-header-icon { width: 32px; height: 32px; border-radius: 8px; }
            .currency-details h5, .tile-help-row h5, .feature-item h5 { font-size: 0.85rem; }
            .currency-details p, .tile-help-row p, .feature-item p { font-size: 0.7rem; line-height: 1.3; }
          }
        `}</style>
    </AnimatePresence>
  );
}
