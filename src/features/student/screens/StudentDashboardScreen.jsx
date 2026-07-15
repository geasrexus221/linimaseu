import React, { useState } from 'react';
import { Star, Flame, Trophy, Bell, Award, BookOpen, Clock, Target, Play, Gift, Calendar, CheckCircle, Zap } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useRegisterRightPanel } from '../../../hooks/useRegisterRightPanel';
import DesktopStatsPanel from '../../../components/layout/DesktopStatsPanel';
import MascotMelambai from '../../../assets/UI/Character/melambai1.svg';

export default function StudentDashboardScreen() {
  const { stars, streak, maxStreak, hearts, globalAnnouncements, setActiveTab, lastQuizResult } = useStore();

  // Register the right panel (Sidebar Kanan)
  useRegisterRightPanel(DesktopStatsPanel, 'student-dashboard');

  // Dynamic greeting based on streak
  const greetingText = streak < 2 
    ? "Budi, yuk selamatkan apimu!"
    : "Halo Budi! Siap berpetualang?";

  const MOCK_DAILY_QUESTS = [
    { id: 1, title: 'Latihan Pemanasan', desc: 'Selesaikan 1 materi di Modul IPAS', reward: 50, progress: 1, total: 1, isClaimed: false },
    { id: 2, title: 'Kutu Buku', desc: 'Pelajari 3 materi pelajaran baru', reward: 100, progress: 1, total: 3, isClaimed: false },
    { id: 3, title: 'Sang Juara Kuis', desc: 'Dapatkan nilai sempurna pada 2 Kuis Evaluasi', reward: 150, progress: 0, total: 2, isClaimed: false }
  ];

  const streakTrackerMarkup = (
    <div className="streak-tracker-container">
      <div className="section-title" style={{ marginTop: '5px' }}>
        <Flame size={20} color="#EF4444" />
        <h2>Perjalanan Api</h2>
      </div>
      
      <div className="streak-card card-surface">
        <div className="streak-header">
          <div className="streak-count">
            <Flame size={24} fill="#EF4444" color="#EF4444" />
            <span className="streak-num">{streak}</span>
            <span className="streak-txt">Hari Beruntun</span>
          </div>
          <p className="streak-desc">Pertahankan apimu agar tidak padam!</p>
        </div>
        <div className="streak-days">
          {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, idx) => {
            const isActive = idx < streak;
            const isToday = idx === streak - 1;
            const isChestDay = idx === 6;
            
            return (
              <div key={idx} className={`streak-day ${isActive ? 'active' : ''} ${isToday ? 'today' : ''} ${isChestDay ? 'chest-day' : ''}`}>
                <div className="day-circle">
                  {isActive ? (
                    isChestDay 
                      ? <Gift size={16} fill={isToday ? '#FFF' : '#FFD700'} color={isToday ? '#D97706' : '#D97706'} /> 
                      : <Flame size={16} fill={isToday ? '#FFF' : '#1cb0f6'} color={isToday ? '#FFF' : '#1cb0f6'} />
                  ) : (
                    isChestDay ? <Gift size={16} color="#AFAFAF" /> : day
                  )}
                </div>
                {isChestDay ? (
                  <span className="day-lbl chest-lbl">x10 <Trophy size={8} fill="#FFD700" color="#D97706" /></span>
                ) : (
                  <span className="day-lbl">{day}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container dashboard-bg">
      {/* Scrollable Container */}
      <div className="scroll-wrapper">
        <div className="dashboard-grid">
          
          {/* PENGUMUMAN (News Ticker Bar) */}
          {globalAnnouncements.length > 0 && (
            <div className="announcement-ticker-container">
              <div className="ticker-badge">
                <Bell size={18} fill="white" />
              </div>
              <div className="ticker-wrapper">
                <div className="ticker-track">
                  {globalAnnouncements.map((ann, idx) => (
                    <span key={ann.id} className="ticker-item">
                      <span className="ticker-class">[{ann.className}]</span>
                      <span className="ticker-msg">{ann.message}</span>
                      <span className="ticker-date">({ann.timestamp})</span>
                      {idx < globalAnnouncements.length - 1 && <span className="ticker-separator">•</span>}
                    </span>
                  ))}
                  {/* Duplikasi data untuk scroll tanpa putus */}
                  {globalAnnouncements.map((ann, idx) => (
                    <span key={`dup-${ann.id}`} className="ticker-item" aria-hidden="true">
                      <span className="ticker-class">[{ann.className}]</span>
                      <span className="ticker-msg">{ann.message}</span>
                      <span className="ticker-date">({ann.timestamp})</span>
                      {idx < globalAnnouncements.length - 1 && <span className="ticker-separator">•</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PERJALANAN API (MOBILE ONLY - Bawah Pengumuman) */}
          <div className="mobile-only-streak">
            {streakTrackerMarkup}
          </div>

          {/* KOLOM KIRI (Main Column) */}
          <div className="grid-col-main">
            
            {/* Header Ucapan Selamat Datang (Tanpa Foto) + Mascot */}
            <div className="welcome-banner">
              <img src={MascotMelambai} alt="Mascot" className="welcome-mascot" />
              <div className="welcome-top">
                <div className="welcome-text">
                  <h1>{greetingText}</h1>
                  <p>Selesaikan misi harian untuk Bintang ⭐!</p>
                </div>
              </div>
              
              <button className="quick-play-btn" onClick={() => setActiveTab('quiz')}>
                <Play size={20} fill="#FFF" />
                <span>MULAI PETUALANGAN</span>
              </button>
            </div>



            {/* 1. Misi Harian (Daily Quests) */}
            <div className="section-title">
              <Target size={20} />
              <h2>Misi Harian</h2>
            </div>
            
            <div className="quests-list">
              {MOCK_DAILY_QUESTS.map(quest => {
                const isCompleted = quest.progress >= quest.total;
                return (
                  <div key={quest.id} className={`quest-card ${isCompleted ? 'completed' : ''}`}>
                    <div className="quest-info">
                      <h3>{quest.title}</h3>
                      <p>{quest.desc}</p>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${(quest.progress / quest.total) * 100}%` }} />
                      </div>
                      <span className="progress-text">{quest.progress} / {quest.total}</span>
                    </div>
                    <div className="quest-reward">
                      <Star size={16} fill="#FFD700" color="#FFD700" />
                      <span>+{quest.reward} ⭐</span>
                    </div>
                    {isCompleted ? (
                      <button className="claim-btn">KLAIM</button>
                    ) : (
                      <div className="not-done-circle" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* KOLOM KANAN (Side Column) */}
          <div className="grid-col-side">
            
            {/* 1. Perjalanan Api (Streak Tracker) - DESKTOP ONLY */}
            <div className="desktop-only-streak">
              {streakTrackerMarkup}
            </div>

            {/* 2. Aktivitas Terakhir (Last Quiz) */}
            <div className="section-title">
              <Clock size={20} />
              <h2>Aktivitas Terakhir</h2>
            </div>
            
            {lastQuizResult ? (
              <div className="last-quiz-card card-surface">
                <div className="lq-icon">
                  <CheckCircle size={28} color="#FFF" />
                </div>
                <div className="lq-info">
                  <h3>{lastQuizResult.themeTitle || lastQuizResult.title || 'Latihan Terakhir'}</h3>
                  <div className="lq-stats">
                    {lastQuizResult.score > 0 && (
                      <div className="lq-stat-badge">
                        <Zap size={14} fill="#FFC800" color="#D97706" />
                        <span>Skor: {lastQuizResult.score}</span>
                      </div>
                    )}
                    {lastQuizResult.starsEarned > 0 && (
                      <div className="lq-stat-badge stars">
                        <Star size={14} fill="#58CC02" color="#46A302" />
                        <span>+{lastQuizResult.starsEarned} ⭐</span>
                      </div>
                    )}
                    {lastQuizResult.accuracy !== undefined && (
                      <div className="lq-stat-badge">
                        <Zap size={14} fill="#FFC800" color="#D97706" />
                        <span>Akurasi: {lastQuizResult.accuracy}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state card-surface">
                <p>Belum ada latihan yang diselesaikan.</p>
                <button className="small-action-btn" onClick={() => setActiveTab('quiz')}>Mulai Sekarang</button>
              </div>
            )}

          </div>
        </div>
        <div style={{ height: 100 }} /> {/* Spacer for tab bar */}
      </div>

      <style jsx>{`
        .page-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: var(--background-color);
          height: 100%;
        }

        .scroll-wrapper {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          width: 100%;
          -webkit-overflow-scrolling: touch;
        }

        .dashboard-grid {
          padding: 20px;
          display: grid;
          grid-template-columns: 1fr; /* Mobile default */
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (min-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1.5fr 1fr;
            align-items: start;
          }
          .mobile-only-streak { display: none !important; }
          .desktop-only-streak { display: block !important; }
        }

        .mobile-only-streak { display: block; margin-bottom: 5px; }
        .desktop-only-streak { display: none; }

        .grid-col-main { display: flex; flex-direction: column; gap: 15px; }
        .grid-col-side { display: flex; flex-direction: column; gap: 15px; }

        .card-surface {
          background: var(--card-bg);
          border: 2px solid var(--border-color);
          box-shadow: 0 4px 0 var(--border-color);
        }

        .welcome-banner {
          background: linear-gradient(135deg, #1CB0F6, #1485BA);
          padding: 20px; border-radius: 20px; color: white;
          margin-bottom: 10px;
          box-shadow: 0 6px 15px rgba(28, 176, 246, 0.4);
          display: flex; flex-direction: column; gap: 15px;
          position: relative;
          overflow: hidden;
        }
        .welcome-mascot {
          position: absolute;
          bottom: 50px; /* Diatas kanan tombol mulai petualangan */
          right: 5px;
          height: 120px;
          z-index: 1; /* Diatas background tombol, tapi dibawah teks tombol */
          pointer-events: none;
          transform-origin: bottom center;
          animation: breathe 3s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.02) rotate(-2deg); }
        }
        .welcome-top {
          display: flex; align-items: center; gap: 15px;
          position: relative; z-index: 2;
          padding-right: 80px; /* Prevent text overlapping mascot */
        }
        .mascot-box {
          width: 60px; height: 60px; background: rgba(255,255,255,0.2);
          border-radius: 16px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .emoji-mascot { font-size: 2.5rem; }
        .welcome-text { flex: 1; text-align: left; }
        .welcome-text h1 { font-weight: 900; font-size: 1.1rem; margin: 0 0 5px 0; line-height: 1.3; }
        .welcome-text p { font-weight: 600; font-size: 0.85rem; margin: 0; opacity: 0.9; }
        
        .standalone-claim-btn {
          width: 100%;
          background: #FFD700; border: none; padding: 15px; border-radius: 16px;
          display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 10px;
          cursor: pointer; box-shadow: 0 5px 0 #d1a34b; transition: transform 0.1s;
          margin-bottom: 15px;
        }
        .standalone-claim-btn span { font-weight: 900; font-size: 1.1rem; color: #d1a34b; }
        .standalone-claim-btn:active { transform: translateY(5px); box-shadow: 0 0 0 transparent; }
        
        .bounce { animation: bounce 2s infinite; }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .quick-play-btn {
          width: 100%; background: #58CC02; color: white; border: none;
          padding: 15px; border-radius: 16px; font-weight: 900; font-size: 1.1rem;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          cursor: pointer; box-shadow: 0 5px 0 #46A302; transition: all 0.1s;
          position: relative; /* z-index dihilangkan agar tidak menjadi stacking context baru */
        }
        .quick-play-btn span, .quick-play-btn svg {
          position: relative;
          z-index: 2; /* Teks dan ikon harus berada di atas mascot (z-index: 1) */
        }
        .quick-play-btn:active { transform: translateY(5px); box-shadow: 0 0 0 transparent; }

        /* Mini Stats Row */
        .mini-stats-row {
          display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;
        }
        .mini-stat-card {
          flex: 1; min-width: 100px;
          background: var(--card-bg); border: 2px solid var(--border-color); border-radius: 16px;
          padding: 10px; display: flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 0 var(--border-color);
        }
        .mini-stat-icon {
          width: 36px; height: 36px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .mini-stat-info { display: flex; flex-direction: column; }
        .ms-val { font-weight: 900; font-size: 1rem; color: var(--text-color); line-height: 1.1; }
        .ms-lbl { font-weight: 700; font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; }

        .section-title {
          display: flex; align-items: center; gap: 10px; margin-top: 5px; color: var(--text-muted);
        }
        .section-title h2 { font-weight: 900; font-size: 1.2rem; margin: 0; text-transform: uppercase; letter-spacing: 1px; color: var(--text-color); }

        /* Streak Visualizer */
        .streak-card {
          border-radius: 20px; padding: 15px; display: flex; flex-direction: column; gap: 15px;
        }
        .streak-header { display: flex; flex-direction: column; gap: 5px; }
        .streak-count { display: flex; align-items: center; gap: 5px; }
        .streak-num { font-weight: 900; font-size: 1.5rem; color: #EF4444; line-height: 1; }
        .streak-txt { font-weight: 800; font-size: 0.9rem; color: var(--text-color); }
        .streak-desc { font-weight: 600; font-size: 0.75rem; color: var(--text-muted); margin: 0; }
        
        .streak-days { display: flex; justify-content: space-between; align-items: center; }
        .streak-day { display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .day-circle {
          width: 32px; height: 32px; border-radius: 50%; background: var(--background-color);
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.8rem; color: var(--text-muted); border: 2px solid var(--border-color);
          transition: all 0.2s;
        }
        .streak-day.active .day-circle { background: #E8F6FD; border-color: #84D8FF; color: #1cb0f6; }
        .streak-day.today .day-circle { background: #1cb0f6; border-color: #1485BA; transform: scale(1.1); box-shadow: 0 3px 0 #1485BA; }
        .streak-day.chest-day .day-circle { border-color: #84D8FF; }
        .streak-day.chest-day.active .day-circle { background: #E8F6FD; }
        
        .day-lbl { font-weight: 800; font-size: 0.65rem; color: var(--text-muted); display: flex; align-items: center; gap: 2px; }
        .streak-day.active .day-lbl { color: #1cb0f6; }
        .chest-lbl { color: #d1a34b !important; font-weight: 900; }

        /* Last Quiz History */
        .last-quiz-card {
          border-radius: 20px; padding: 15px; display: flex; align-items: center; gap: 15px;
        }
        .lq-icon {
          width: 50px; height: 50px; background: #58CC02; border-radius: 16px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          box-shadow: 0 3px 0 #46A302;
        }
        .lq-info { flex: 1; min-width: 0; }
        .lq-info h3 { font-weight: 800; font-size: 1rem; color: var(--text-color); margin: 0 0 8px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lq-stats { display: flex; gap: 10px; flex-wrap: wrap; }
        .lq-stat-badge {
          display: flex; align-items: center; gap: 4px; padding: 4px 8px;
          background: #FFF4E5; border-radius: 8px; border: 1px solid #FFD700;
        }
        .lq-stat-badge span { font-weight: 800; font-size: 0.75rem; color: #d1a34b; }
        .lq-stat-badge.stars { background: #F2FDF0; border-color: #58CC02; }
        .lq-stat-badge.stars span { color: #46A302; }

        .small-action-btn {
          margin-top: 10px; background: #1CB0F6; color: white; border: none;
          padding: 8px 16px; border-radius: 12px; font-weight: 800; font-size: 0.8rem;
          cursor: pointer; box-shadow: 0 3px 0 #1899D6;
        }
        .small-action-btn:active { transform: translateY(3px); box-shadow: 0 0 0 transparent; }

        /* Misi Harian */
        .quests-list { display: flex; flex-direction: column; gap: 12px; }
        .quest-card {
          background: var(--card-bg); border-radius: 20px; border: 2px solid var(--border-color);
          padding: 15px; display: flex; align-items: center; gap: 15px;
          box-shadow: 0 4px 0 var(--border-color); transition: all 0.2s;
        }
        .quest-card.completed { border-color: #58CC02; background: #F2FDF0; box-shadow: 0 4px 0 #58CC02; }
        
        .quest-info { flex: 1; }
        .quest-info h3 { font-weight: 800; font-size: 1rem; color: var(--text-color); margin: 0 0 3px 0; }
        .quest-info p { font-weight: 600; font-size: 0.75rem; color: var(--text-muted); margin: 0 0 8px 0; }
        
        .progress-bar-bg { width: 100%; height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden; margin-bottom: 4px; }
        .progress-bar-fill { height: 100%; background: #f4c265; border-radius: 4px; }
        .quest-card.completed .progress-bar-fill { background: #58CC02; }
        .progress-text { font-weight: 800; font-size: 0.7rem; color: var(--text-muted); }

        .quest-reward {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: #FFF4E5; padding: 5px 10px; border-radius: 12px; border: 1.5px solid #FFD700;
        }
        .quest-reward span { font-weight: 900; font-size: 0.7rem; color: #f4c265; }

        .claim-btn {
          background: #58CC02; color: white; border: none; padding: 10px 15px;
          border-radius: 12px; font-weight: 900; cursor: pointer;
          box-shadow: 0 4px 0 #46A302; transition: transform 0.1s;
        }
        .claim-btn:active { transform: translateY(4px); box-shadow: 0 0 0 transparent; }
        
        .not-done-circle {
          width: 30px; height: 30px; border-radius: 50%; border: 3px dashed var(--border-color);
        }

        /* Announcement News Ticker Styles */
        .announcement-ticker-container {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          background: #FEF2F2;
          border: 2px solid #EF4444;
          border-radius: 16px;
          height: 44px;
          overflow: hidden;
          box-shadow: 0 4px 0 #DC2626;
          margin-bottom: 12px;
          position: relative;
        }
        .ticker-badge {
          background: #EF4444;
          color: white;
          width: 44px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          box-shadow: 4px 0 8px rgba(0,0,0,0.12);
          flex-shrink: 0;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        .ticker-wrapper {
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: center;
          height: 100%;
        }
        .ticker-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: tickerScroll 30s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
          cursor: pointer;
        }
        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 750;
          color: #991B1B;
        }
        .ticker-class {
          color: #DC2626;
          font-weight: 900;
          margin-left: 20px;
        }
        .ticker-msg {
          color: #7F1D1D;
        }
        .ticker-date {
          color: #991B1B;
          opacity: 0.7;
          font-size: 0.65rem;
        }
        .ticker-separator {
          margin-left: 20px;
          color: #EF4444;
          font-weight: 900;
          font-size: 1.1rem;
        }
        @keyframes tickerScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        
        .empty-state {
          padding: 20px; text-align: center; color: var(--text-muted); font-weight: 700;
          border-radius: 16px; border: 2px dashed var(--border-color);
        }

      `}</style>
    </div>
  );
}
