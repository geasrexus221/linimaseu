import React, { useState } from 'react';
import { LogIn, Trophy, Target, Calendar, X, BookOpen, GraduationCap, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { useRegisterRightPanel } from '../../../hooks/useRegisterRightPanel';
import DesktopStatsPanel from '../../../components/layout/DesktopStatsPanel';
import { MOCK_CLASSROOMS } from '../../../data/classrooms';
import MascotMeja from '../../../assets/UI/Character/Meja1.svg';

export default function QuizHubScreen() {
  const { lastQuizResult, activeClass, setActiveClass } = useStore();
  const { setQuizSubView } = useNavigationStore();
  
  
  useRegisterRightPanel(DesktopStatsPanel, 'quiz-hub');
  
  const [showClassModal, setShowClassModal] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [pendingIntent, setPendingIntent] = useState(null); 

  const handleJoinClass = () => {
    const cls = MOCK_CLASSROOMS[classCode];
    if (cls) {
      setActiveClass(cls);
      setQuizSubView(pendingIntent || 'classroom');
      setShowClassModal(false);
      setPendingIntent(null);
    } else {
      alert('Kode kelas tidak ditemukan! Coba gunakan: KELAS1');
    }
  };

  
  const freshClass = activeClass ? MOCK_CLASSROOMS[activeClass.id] : null;
  const pendingAssignments = freshClass?.assignments || activeClass?.assignments || [];
  const hasTasks = pendingAssignments.length > 0;
  const closestDeadline = hasTasks ? pendingAssignments[0].dueDate : null;

  return (
    <div className="quiz-hub-container">
      <div className="hub-header-area">
        <h2 className="hub-title">Pusat Latihan</h2>
      </div>

      <div className="quiz-hub-grid">
        
        
        <div className="hub-main-col">
          
          
          <div className="hero-mode-card" onClick={() => setQuizSubView('missions')}>
            <div className="hero-content">
              <h3>Kuis Utama</h3>
              <p>Mari bermain dan uji pengetahuanmu sekarang!</p>
              <button className="play-now-btn">
                <span>MULAI</span>
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="hero-icon-wrapper">
              <img src={MascotMeja} alt="Karakter Meja" className="hero-mascot-img" />
            </div>
          </div>

          
          <div className="secondary-mode-card class-entry" onClick={() => { setPendingIntent('classroom'); setShowClassModal(true); }} style={{ marginBottom: '16px' }}>
            <div className="sec-icon-box" style={{ background: '#7c3aed' }}>
              <LogIn size={36} color="white" />
            </div>
            <div className="sec-info">
              <h4>Masuk ke Kelas Guru</h4>
              <p>Gabung dengan kelas gurumu untuk menerima tugas dan melihat peringkat.</p>
            </div>
            <div className="sec-arrow">
              <ArrowRight size={24} color="var(--text-muted)" />
            </div>
          </div>

          
          <div className="secondary-mode-card" onClick={() => setQuizSubView('teacherTasks')}>
            <div className="sec-icon-box">
              <GraduationCap size={36} color="white" />
              {hasTasks && <div className="task-badge">{pendingAssignments.length}</div>}
            </div>
            <div className="sec-info">
              <h4>Tugas Dari Guru</h4>
              <p>Kerjakan kuis khusus yang diberikan oleh gurumu di kelas.</p>
              {hasTasks && (
                <div className="task-deadline">
                  <Calendar size={12} />
                  <span>Selesai: {closestDeadline || 'Tidak ada batas waktu'}</span>
                </div>
              )}
            </div>
            <div className="sec-arrow">
              <ArrowRight size={24} color="var(--text-muted)" />
            </div>
          </div>

        </div>

        
        <div className="hub-side-col">

          
          <div className="last-result-card">
            <div className="last-result-header">
              <Target size={16} color="var(--text-muted)" />
              <span>CAPAIAN TERAKHIR</span>
            </div>

            {lastQuizResult ? (
              <div className="last-result-body">
                <div className="lr-icon">
                  <CheckCircle size={32} color="#FFF" />
                </div>
                <div className="lr-details">
                  <h4>{lastQuizResult.themeTitle}</h4>
                  <div className="lr-stats">
                    <div className="lr-badge">
                      <Zap size={14} color="#D97706" />
                      <span className="val">{lastQuizResult.accuracy}%</span>
                      <span className="lbl">Akurasi</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-result-placeholder">
                <div className="placeholder-icon">?</div>
                <div className="placeholder-text">
                  <strong>Belum Ada Riwayat Kuis</strong>
                  <p>Selesaikan kuis pertamamu untuk melihat progres di sini!</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      
      {showClassModal && (
        <div className="class-modal-overlay">
          <div className="class-modal-content">
            <button className="close-modal" onClick={() => { setShowClassModal(false); setPendingIntent(null); }}>
              <X size={24} />
            </button>
            <div className="modal-header">
              <div className="modal-icon-bg">
                <GraduationCap size={40} color="white" />
              </div>
              <h3>Pintu Masuk Kelas</h3>
              <p>Masukkan kode rahasia dari gurumu</p>
            </div>
            <div className="modal-body">
              <div className="code-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Contoh: KELAS-SEJARAH" 
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  className="chunky-input"
                />
                <button className="submit-code-btn" onClick={handleJoinClass}>
                  <LogIn size={24} />
                  <span>MASUK</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .quiz-hub-container {
          flex: 1; background: var(--background-color);
          overflow-y: auto; padding-bottom: 100px;
        }

        .hub-header-area { 
          padding: 30px 30px 10px; 
        }
        
        .hub-title { 
          font-weight: 900; font-size: 2rem; margin: 0; color: var(--text-color); 
        }

        .quiz-hub-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          padding: 20px 30px;
          max-width: 1200px;
        }

        @media (min-width: 900px) {
          .quiz-hub-grid {
            grid-template-columns: 1.6fr 1fr;
            align-items: start;
          }
        }

        .hub-main-col { display: flex; flex-direction: column; gap: 20px; }
        .hub-side-col { display: flex; flex-direction: column; gap: 20px; }

        /* HERO CARD (Misi Utama) */
        .hero-mode-card {
          background: linear-gradient(135deg, #1CB0F6, #1485BA);
          border-radius: 24px; padding: 30px; display: flex; justify-content: space-between;
          align-items: center; color: white; cursor: pointer;
          box-shadow: 0 8px 0 #1899D6; transition: transform 0.2s, box-shadow 0.2s;
          position: relative; overflow: hidden;
        }
        .hero-mode-card:active { transform: translateY(4px); box-shadow: 0 4px 0 #1899D6; }
        .hero-content { flex: 1; z-index: 2; position: relative; }
        .hero-content h3 { font-weight: 900; font-size: 1.8rem; margin: 0 0 10px 0; line-height: 1.1; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .hero-content p { font-weight: 600; font-size: 1rem; margin: 0 0 20px 0; opacity: 0.9; max-width: 80%; line-height: 1.4; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
        .play-now-btn {
          background: white; color: #1CB0F6; border: none; padding: 12px 24px;
          border-radius: 16px; font-weight: 900; font-size: 1rem;
          display: inline-flex; align-items: center; gap: 10px; cursor: pointer;
          box-shadow: 0 4px 0 #E5E5E5; transition: background 0.2s;
        }
        .play-now-btn:hover { background: #F7F9FC; }
        .hero-icon-wrapper {
          position: absolute;
          right: -20px;
          bottom: -10px; /* Slight offset to ensure it anchors to the bottom */
          height: 115%; /* Taller than the banner so it hits top and bottom */
          display: flex; justify-content: center; align-items: flex-end;
          z-index: 1; flex-shrink: 0; pointer-events: none;
        }
        .hero-mascot-img {
          height: 100%;
          object-fit: contain;
          transform-origin: bottom center;
          animation: mascot-breathe 4s ease-in-out infinite;
        }
        @keyframes mascot-breathe {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.03) rotate(-1deg) translateY(-5px); }
        }
        /* Dekorasi latar hero */
        .hero-mode-card::after {
          content: ''; position: absolute; right: -50px; top: -50px;
          width: 200px; height: 200px; background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
          border-radius: 50%; z-index: 1;
        }

        /* SECONDARY CARD (Tugas Guru) */
        .secondary-mode-card {
          background: var(--card-bg); border: 2px solid var(--border-color);
          border-radius: 24px; padding: 20px; display: flex; align-items: center;
          gap: 20px; cursor: pointer; box-shadow: 0 6px 0 var(--border-color);
          transition: all 0.2s;
        }
        .secondary-mode-card:active { transform: translateY(3px); box-shadow: 0 3px 0 var(--border-color); }
        .sec-icon-box {
          width: 70px; height: 70px; background: #CE82FF;
          border-radius: 20px; display: flex; justify-content: center; align-items: center;
          box-shadow: 0 4px 0 #AF6EE1; flex-shrink: 0; position: relative;
        }
        .task-badge {
          position: absolute; top: -8px; right: -8px;
          background: #FF4B4B; color: white; border-radius: 50%;
          width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 0.8rem; border: 3px solid var(--card-bg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2); animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(255, 75, 75, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(255, 75, 75, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 75, 75, 0); }
        }
        .sec-info { flex: 1; }
        .sec-info h4 { font-weight: 900; font-size: 1.2rem; color: var(--text-color); margin: 0 0 5px 0; }
        .sec-info p { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin: 0; line-height: 1.4; }
        .task-deadline {
          display: flex; align-items: center; gap: 4px; margin-top: 8px;
          background: #FFF4E5; color: #D97706; padding: 4px 8px; border-radius: 8px;
          font-weight: 800; font-size: 0.7rem; width: fit-content; border: 1px solid #FFD700;
        }
        .sec-arrow { padding-right: 10px; }

        /* CLASS ENTRY BOX */
        .class-entry-box {
          background: #58CC02; border-radius: 24px; padding: 20px;
          display: flex; align-items: center; gap: 15px; cursor: pointer;
          box-shadow: 0 6px 0 #46A302; transition: transform 0.2s; color: white;
        }
        .class-entry-box:active { transform: translateY(3px); box-shadow: 0 3px 0 #46A302; }
        .entry-icon {
          width: 50px; height: 50px; background: rgba(255,255,255,0.2);
          border-radius: 16px; display: flex; justify-content: center; align-items: center;
          border: 2px solid white;
        }
        .entry-info .lbl { font-weight: 900; font-size: 0.65rem; opacity: 0.9; letter-spacing: 1px; }
        .entry-info h4 { font-weight: 900; font-size: 1.1rem; margin: 2px 0 0 0; }

        .class-lite-box {
          background: var(--card-bg); border: 2px dashed #f4c265;
          border-radius: 16px; padding: 15px; display: flex; align-items: center; justify-content: center;
          gap: 10px; font-weight: 800; font-size: 0.9rem; color: var(--text-color);
        }

        /* LAST RESULT CARD */
        .last-result-card {
          background: var(--card-bg); border: 2px solid var(--border-color);
          border-radius: 24px; padding: 20px; box-shadow: 0 6px 0 var(--border-color);
        }
        .last-result-header {
          display: flex; align-items: center; gap: 8px; font-weight: 900;
          font-size: 0.75rem; color: var(--text-muted); margin-bottom: 15px;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .last-result-body { display: flex; align-items: center; gap: 15px; }
        .lr-icon {
          width: 55px; height: 55px; background: #FFD700; border-radius: 16px;
          display: flex; justify-content: center; align-items: center; flex-shrink: 0;
          box-shadow: 0 4px 0 #D97706;
        }
        .lr-details { flex: 1; }
        .lr-details h4 { font-weight: 900; font-size: 1.1rem; color: var(--text-color); margin: 0 0 8px 0; }
        .lr-stats { display: flex; gap: 10px; }
        .lr-badge {
          display: flex; align-items: center; gap: 6px; background: #FFF4E5;
          padding: 6px 12px; border-radius: 12px; border: 1.5px solid #FFD700;
        }
        .lr-badge .val { font-weight: 900; color: #D97706; font-size: 0.9rem; }
        .lr-badge .lbl { font-weight: 700; color: #D97706; font-size: 0.65rem; text-transform: uppercase; }

        .no-result-placeholder { display: flex; align-items: center; gap: 15px; opacity: 0.7; }
        .placeholder-icon {
          width: 50px; height: 50px; background: var(--background-color);
          border-radius: 16px; display: flex; justify-content: center; align-items: center;
          font-weight: 900; font-size: 1.5rem; color: var(--border-color);
          border: 2px solid var(--border-color);
        }
        .placeholder-text { text-align: left; }
        .placeholder-text strong { display: block; font-weight: 900; font-size: 0.95rem; color: var(--text-color); margin-bottom: 3px; }
        .placeholder-text p { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin: 0; }

        /* Modal Styles */
        .class-modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center;
          z-index: 3000; padding: 20px;
        }
        .class-modal-content {
          background: var(--card-bg); width: 100%; max-width: 400px;
          border-radius: 32px; padding: 30px; position: relative;
          border: 4px solid var(--border-color); text-align: center;
        }
        .close-modal { position: absolute; top: 20px; right: 20px; background: none; border: none; color: var(--text-muted); cursor: pointer; }
        .modal-icon-bg {
          width: 80px; height: 80px; background: #ce82ff; border-radius: 20px;
          margin: 0 auto 15px; display: flex; justify-content: center; align-items: center;
          box-shadow: 0 6px 0 #af6ee1;
        }
        .modal-header h3 { font-weight: 900; font-size: 1.4rem; color: var(--text-color); }
        .modal-header p { font-weight: 700; color: var(--text-muted); font-size: 0.9rem; margin-top: 5px; }
        .modal-body { margin-top: 25px; }
        .code-input-wrapper { display: flex; flex-direction: column; gap: 12px; }
        .chunky-input {
          padding: 18px; border-radius: 16px; border: 3px solid var(--border-color);
          background: var(--background-color); font-family: var(--font-main);
          font-weight: 900; font-size: 1.1rem; text-align: center; color: var(--text-color);
        }
        .chunky-input:focus { border-color: #1cb0f6; outline: none; }
        .submit-code-btn {
          background: #58cc02; color: white; border: none; padding: 18px;
          border-radius: 16px; font-weight: 900; font-size: 1rem;
          display: flex; justify-content: center; align-items: center; gap: 10px;
          box-shadow: 0 6px 0 #46a302; cursor: pointer;
        }
        .submit-code-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #46a302; }

      `}</style>
    </div>
  );
}
