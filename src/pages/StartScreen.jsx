import React from 'react';
import { GraduationCap, BookOpen, Sparkles } from 'lucide-react';

export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen-duo">
      <div className="start-content-duo">
        <div className="header-section">
          <div className="icon-badge">
            <Sparkles size={20} fill="#f4c265" color="#f4c265" />
            <span>BELAJAR SEJARAH SERU</span>
          </div>
          <h1 className="duo-title">Lini Masa</h1>
          <p className="duo-subtitle">Pilih cara belajarmu hari ini!</p>
        </div>

        <div className="selection-grid">
          {/* MURID CARD */}
          <div className="duo-card student" onClick={onStart}>
            <div className="duo-card-top">
              <div className="duo-icon-box">
                <GraduationCap size={44} strokeWidth={2.5} />
              </div>
            </div>
            <div className="duo-card-bottom">
              <h3>MURID</h3>
              <p>Mulai petualangan sejarah!</p>
            </div>
          </div>

          {/* GURU CARD */}
          <div className="duo-card teacher" onClick={onStart}>
            <div className="duo-card-top">
              <div className="duo-icon-box">
                <BookOpen size={44} strokeWidth={2.5} />
              </div>
            </div>
            <div className="duo-card-bottom">
              <h3>GURU</h3>
              <p>Kelola kelas & materi.</p>
            </div>
          </div>
        </div>

        <div className="action-footer">
          <p>Sudah punya akun? <span>MASUK DISINI</span></p>
        </div>
      </div>

      <style jsx>{`
        .start-screen-duo {
          position: fixed;
          inset: 0;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          padding: 20px;
        }

        .start-content-duo {
          width: 100%;
          max-width: 450px;
          display: flex;
          flex-direction: column;
          gap: 40px;
          animation: duoBounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes duoBounceIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .header-section {
          text-align: center;
        }

        .icon-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFF4E5;
          color: #f4c265;
          padding: 8px 16px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 0.8rem;
          margin-bottom: 12px;
        }

        @media (max-width: 600px) {
          .duo-title { font-size: 2.5rem !important; }
          .start-content-duo { gap: 20px !important; }
          .duo-card-top { padding: 20px 15px !important; }
          .duo-card-bottom h3 { font-size: 1rem !important; }
          .duo-subtitle { font-size: 0.9rem !important; }
        }

        .selection-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .duo-card {
          position: relative;
          background: #FFFFFF;
          border: 2px solid #E5E5E5;
          border-bottom: 6px solid #E5E5E5;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.1s;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }

        .duo-card:active {
          transform: translateY(4px);
          border-bottom-width: 2px;
        }

        .duo-card-top {
          width: 100%;
          padding: 30px 20px;
          display: flex;
          justify-content: center;
          transition: all 0.2s;
        }

        .student .duo-card-top { background: #F2F7FF; }
        .teacher .duo-card-top { background: #F2FFF2; }

        .duo-icon-box {
          color: #1CB0F6;
          transition: transform 0.2s;
        }

        .student .duo-icon-box { color: #1CB0F6; }
        .teacher .duo-icon-box { color: #58CC02; }

        .duo-card:hover .duo-icon-box {
          transform: scale(1.15) rotate(-5deg);
        }

        .duo-card-bottom {
          padding: 15px;
          text-align: center;
          width: 100%;
        }

        .duo-card-bottom h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #4B4B4B;
        }

        .duo-card-bottom p {
          margin: 4px 0 0;
          font-size: 0.75rem;
          color: #afafaf;
          font-weight: 700;
          line-height: 1.2;
        }

        /* Hover Styles - Match Duolingo active states */
        .duo-card.student:hover {
          border-color: #84D8FF;
          border-bottom-color: #1CB0F6;
        }
        .duo-card.student:hover .duo-card-bottom h3 { color: #1CB0F6; }

        .duo-card.teacher:hover {
          border-color: #A5ED6E;
          border-bottom-color: #58CC02;
        }
        .duo-card.teacher:hover .duo-card-bottom h3 { color: #58CC02; }

        .action-footer {
          text-align: center;
          margin-top: 20px;
        }

        .action-footer p {
          color: #AFAFAF;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .action-footer span {
          color: #1CB0F6;
          cursor: pointer;
          margin-left: 5px;
        }

        .action-footer span:hover {
          filter: brightness(0.9);
        }
      `}</style>
    </div>
  );
}
