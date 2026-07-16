import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, HelpCircle, Heart, Swords, Shield, Clock, Sparkles } from 'lucide-react';

export default function AduCendekiawanHelpModal({ isOpen, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) return null;

  const totalPages = 4;

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
                <h3>Panduan Adu Cendekiawan</h3>
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
                        <div className="large-emoji">🏆</div>
                        <div className="floating-bubble heart">❤️</div>
                        <div className="floating-bubble sword">⚔️</div>
                      </div>
                      <h4 className="page-title">Cara Menang! 🏆</h4>
                      <p className="page-text font-lg">
                        Kedua pemain memulai dengan <strong>10 HP (Darah)</strong>.
                      </p>
                      <p className="page-text">
                        Jawab kuis sejarah dengan cepat dan tepat untuk menguras HP lawanmu! Pemain yang pertama kali menghabiskan HP lawannya adalah pemenangnya.
                      </p>
                      <div className="tip-box">
                        <Sparkles size={16} color="#FFD700" className="inline-icon" />
                        <span>Jika soal habis, pemain dengan sisa HP terbanyak yang dinyatakan menang.</span>
                      </div>
                    </div>
                  )}

                  {currentPage === 1 && (
                    <div className="help-page-layout">
                      <h4 className="page-title text-center">Pilih Strategimu! ⚔️🛡️</h4>
                      <p className="page-text text-center">Sebelum menjawab soal, pilihlah salah satu Mode Aksi berikut:</p>
                      
                      <div className="modes-list">
                        <div className="mode-item">
                          <div className="mode-badge red"><Swords size={20} color="white" /></div>
                          <div className="mode-details">
                            <h5>Mode Serang (Attack)</h5>
                            <p>Jika jawabanmu Benar, kamu akan menghasilkan serangan yang langsung mengurangi HP lawan.</p>
                          </div>
                        </div>
                        
                        <div className="mode-item">
                          <div className="mode-badge green"><Heart size={20} color="white" /></div>
                          <div className="mode-details">
                            <h5>Mode Pulih (Heal)</h5>
                            <p>Jika jawabanmu Benar, kamu akan memulihkan HP dirimu sendiri (maksimal batas 10 HP).</p>
                          </div>
                        </div>

                        <div className="mode-item warning-box">
                          <div className="mode-badge dark-red">⚠️</div>
                          <div className="mode-details">
                            <h5>Awas Penalti!</h5>
                            <p>Jika jawabanmu Salah atau kamu kehabisan waktu, HP milikmu sendiri akan langsung berkurang <strong>-1 HP</strong> pada mode apa pun.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPage === 2 && (
                    <div className="help-page-layout text-center">
                      <div className="illustration-wrapper time-style">
                        <div className="large-emoji">⏱️</div>
                        <div className="time-badge">3x</div>
                      </div>
                      <h4 className="page-title">Kecepatan Menjawab ⚡</h4>
                      <p className="page-text font-lg">
                        Semakin cepat kamu menjawab dengan benar, semakin banyak poin aksi (Damage/Heal) yang kamu dapatkan!
                      </p>
                      
                      <div className="time-rules-list">
                        <div className="time-rule-row">
                          <span className="speed-tag fast">🚀 Sangat Cepat</span>
                          <span className="time-desc">Sisa waktu {'>'} 70%</span>
                          <span className="points-badge">+3 Poin</span>
                        </div>
                        <div className="time-rule-row">
                          <span className="speed-tag normal">⚡ Sedang</span>
                          <span className="time-desc">Sisa waktu {'>'} 50%</span>
                          <span className="points-badge">+2 Poin</span>
                        </div>
                        <div className="time-rule-row">
                          <span className="speed-tag slow">🐢 Lambat</span>
                          <span className="time-desc">Sisa waktu {'<'} 50%</span>
                          <span className="points-badge">+1 Poin</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPage === 3 && (
                    <div className="help-page-layout">
                      <h4 className="page-title text-center">Kartu Aksi Sakti 🃏</h4>
                      <p className="page-text text-center">Gunakan Kartu Aksi sebelum kuis dimulai untuk membalikkan keadaan! Cara kerjanya dibagi menjadi:</p>
                      
                      <div className="tile-help-row">
                        <div className="card-type-icon">🧪</div>
                        <div>
                          <h5>Efek Instan</h5>
                          <p>Kartu yang langsung memulihkan HP-mu atau mengurangi HP lawan secara seketika saat diaktifkan.</p>
                        </div>
                      </div>

                      <div className="tile-help-row">
                        <div className="card-type-icon">🛡️</div>
                        <div>
                          <h5>Efek Pelindung</h5>
                          <p>Kartu tameng yang menahan serangan lawan jika kamu membuat kesalahan atau salah menjawab.</p>
                        </div>
                      </div>

                      <div className="tile-help-row">
                        <div className="card-type-icon">⏱️</div>
                        <div>
                          <h5>Bantuan Kuis</h5>
                          <p>Membantu memperlambat jalannya waktu kuis atau membuang pilihan jawaban salah agar lebih mudah dijawab.</p>
                        </div>
                      </div>

                      <div className="tile-help-row">
                        <div className="card-type-icon">⚡</div>
                        <div>
                          <h5>Efek Pengganggu</h5>
                          <p>Kartu taktis untuk menyetrum bot atau menunda musuh agar tidak bisa menjawab soal.</p>
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
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
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
          background: #1B2921; /* Dark Chalkboard green */
          border: 12px solid #5C4033; /* Wooden Frame color */
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.8);
          width: 100%; max-width: 580px;
          border-radius: 20px;
          display: flex; flex-direction: column;
          max-height: 90vh; overflow: hidden;
          font-family: 'Outfit', sans-serif;
          pointer-events: auto;
          color: #FFFDF0; /* Chalk white text */
        }

        .help-modal-header {
          padding: 16px 24px; border-bottom: 3px dashed rgba(255, 253, 240, 0.2);
          display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
        }
        .title-group { display: flex; align-items: center; gap: 10px; }
        .help-title-icon { color: #FFD700; }
        .help-modal-header h3 { margin: 0; font-size: 1.15rem; font-weight: 950; color: #FFD700; text-transform: uppercase; letter-spacing: 0.5px; }

        .help-modal-close {
          background: rgba(255,255,255,0.1); border: 2px solid rgba(255, 253, 240, 0.4); border-radius: 8px;
          width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
          color: #FFFDF0; cursor: pointer; transition: all 0.1s;
        }
        .help-modal-close:active { transform: translateY(2px); }

        .help-modal-body {
          flex: 1; overflow-y: auto; padding: 24px;
          min-height: 280px; display: flex; flex-direction: column;
        }
        .page-slide { width: 100%; flex: 1; display: flex; flex-direction: column; }

        .help-page-layout { display: flex; flex-direction: column; height: 100%; flex: 1; }
        .text-center { text-align: center; align-items: center; }

        .page-title {
          margin: 0 0 12px 0; font-size: 1.2rem; font-weight: 900; color: #FFD700;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .page-text { margin: 0 0 16px 0; color: rgba(255, 253, 240, 0.85); font-weight: 600; line-height: 1.5; font-size: 0.85rem; }
        .page-text.font-lg { font-size: 1.05rem; color: #FFFDF0; }

        /* Page 1 Hero Illustration style */
        .illustration-wrapper {
          position: relative; width: 100px; height: 100px;
          background: rgba(255,255,255,0.06);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          border: 3px solid rgba(255, 253, 240, 0.3);
          margin: 10px auto 20px;
        }
        .large-emoji { font-size: 3rem; }
        .floating-bubble {
          position: absolute; width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,0.1); border: 2px solid white;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .floating-bubble.heart {
          top: -5px; left: -10px; animation: floatAnim1 3s infinite alternate;
        }
        .floating-bubble.sword {
          bottom: -5px; right: -10px; animation: floatAnim2 3s infinite alternate;
        }
        @keyframes floatAnim1 { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-8px) rotate(10deg); } }
        @keyframes floatAnim2 { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-6px) rotate(-15deg); } }

        .time-style .time-badge {
          position: absolute; bottom: -5px; right: -5px;
          background: #FF4B4B; color: white; font-size: 0.8rem; font-weight: 900;
          padding: 2px 8px; border-radius: 20px; border: 2px solid white;
        }

        .ring-pulse {
          position: absolute; inset: -10px; border: 2.5px solid rgba(255, 253, 240, 0.2); border-radius: 50%;
          opacity: 0.5; animation: pulseRing 2s infinite;
        }
        @keyframes pulseRing { 0% { transform: scale(0.9); opacity: 0.5; } 100% { transform: scale(1.25); opacity: 0; } }

        .tip-box {
          background: rgba(255,255,255,0.04); border: 2.5px dashed rgba(255, 253, 240, 0.3); border-radius: 16px;
          padding: 12px 18px; color: rgba(255, 253, 240, 0.85); font-size: 0.85rem; font-weight: 600;
          display: flex; gap: 10px; align-items: center; text-align: left;
          margin-top: auto;
        }

        /* Modes List Styles */
        .modes-list { display: flex; flex-direction: column; gap: 10px; }
        .mode-item {
          background: rgba(255,255,255,0.04); border: 2px solid rgba(255, 253, 240, 0.2); border-radius: 16px;
          padding: 10px 14px; display: flex; gap: 14px; align-items: center;
        }
        .mode-badge {
          width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
          border: 1.5px solid rgba(255,255,255,0.4); flex-shrink: 0;
        }
        .mode-badge.red { background: linear-gradient(135deg, #FF4B4B, #C0392B); }
        .mode-badge.green { background: linear-gradient(135deg, #58CC02, #3F9E01); }
        .mode-badge.dark-red { background: #9E1D1D; font-size: 1.2rem; }
        
        .mode-item.warning-box {
          background: rgba(255, 75, 75, 0.08); border-color: rgba(255, 75, 75, 0.3);
        }
        .mode-item h5 { margin: 0 0 3px 0; font-size: 0.9rem; font-weight: 850; color: #FFFDF0; }
        .mode-item p { margin: 0; font-size: 0.72rem; font-weight: 600; color: rgba(255, 253, 240, 0.75); line-height: 1.4; }

        /* Speed rules list */
        .time-rules-list { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 420px; margin: 10px auto; }
        .time-rule-row {
          background: rgba(255,255,255,0.04); border: 2px solid rgba(255,255,255,0.1); border-radius: 12px;
          padding: 8px 15px; display: flex; align-items: center; justify-content: space-between;
        }
        .speed-tag { font-size: 0.75rem; font-weight: 850; padding: 4px 10px; border-radius: 8px; text-transform: uppercase; }
        .speed-tag.fast { background: rgba(88,204,2,0.2); color: #58CC02; }
        .speed-tag.normal { background: rgba(28,176,246,0.2); color: #1CB0F6; }
        .speed-tag.slow { background: rgba(244, 194, 101, 0.2); color: #f4c265; }
        .time-desc { font-size: 0.75rem; font-weight: 700; color: rgba(255,253,240,0.6); }
        .points-badge { font-size: 0.8rem; font-weight: 900; color: #FFD700; }

        /* General Item page styles */
        .tile-help-row {
          background: rgba(255,255,255,0.04); border: 2px solid rgba(255, 253, 240, 0.2); border-radius: 16px;
          padding: 10px 14px; display: flex; gap: 14px; align-items: center; margin-bottom: 8px;
        }
        .card-type-icon { font-size: 1.8rem; flex-shrink: 0; }
        .tile-help-row h5 { margin: 0 0 3px 0; font-size: 0.9rem; font-weight: 850; color: #FFD700; }
        .tile-help-row p { margin: 0; font-size: 0.72rem; font-weight: 600; color: rgba(255, 253, 240, 0.75); line-height: 1.4; }

        /* Footer styling */
        .help-modal-footer {
          padding: 16px 24px; border-top: 3px dashed rgba(255, 253, 240, 0.2);
          display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
          background: rgba(0,0,0,0.2);
        }

        .nav-btn {
          background: rgba(255,255,255,0.06); border: 2px solid rgba(255, 253, 240, 0.4); border-radius: 12px;
          padding: 6px 12px; display: flex; align-items: center; gap: 6px;
          color: #FFFDF0; font-weight: 800; font-size: 0.8rem; cursor: pointer;
          transition: all 0.1s;
        }
        .nav-btn:active { transform: translateY(2px); }
        .nav-btn.disabled { opacity: 0.25; cursor: not-allowed; transform: none !important; }

        .nav-btn.next-btn {
          background: #58CC02; border-color: #58CC02; color: white;
        }
        .nav-btn.next-btn:active { transform: translateY(2px); }

        .dots-row { display: flex; gap: 8px; }
        .dot-indicator {
          width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.2);
          cursor: pointer; transition: all 0.2s;
        }
        .dot-indicator.active { background: #FFD700; width: 12px; border-radius: 6px; }

        @media (max-height: 550px) {
          .help-modal-card { max-height: 95vh; border-width: 6px; }
          .help-modal-body { padding: 12px 20px; min-height: 200px; }
          .illustration-wrapper { width: 70px; height: 70px; margin: 5px auto 10px; }
          .large-emoji { font-size: 2.2rem; }
          .page-title { font-size: 1rem; margin-bottom: 8px; }
          .modes-list, .time-rules-list { gap: 6px; }
          .mode-item, .tile-help-row { padding: 6px 12px; border-radius: 12px; margin-bottom: 4px; }
          .mode-badge { width: 30px; height: 30px; border-radius: 8px; }
          .card-type-icon { font-size: 1.4rem; }
          .mode-item h5, .tile-help-row h5 { font-size: 0.8rem; }
          .mode-item p, .tile-help-row p { font-size: 0.65rem; line-height: 1.3; }
        }
      `}</style>
    </AnimatePresence>
  );
}
