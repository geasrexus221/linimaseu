import React, { useState } from 'react';
import { X, Zap, Target, Award, Book, ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { actionCards } from '../../features/game/jelajah-nusantara/data/cards';


const getSeededRandom = (seedString) => {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  return () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
};

const FRIEND_ACHIEVEMENTS = [
  { id: 1, title: 'Pembaca Cepat', icon: '⚡', color: '#f4c265' },
  { id: 2, title: 'Si Paling Tepat', icon: '🎯', color: '#58cc02' },
  { id: 3, title: 'Pejuang Tangguh', icon: '🛡️', color: '#1cb0f6' },
  { id: 4, title: 'Penjelajah Peta', icon: '🗺️', color: '#9333ea' },
];

const resolveFriendData = (friend, rankValue) => {
  const rand = getSeededRandom(friend.name + friend.id);

  
  const accuracy = 72 + Math.floor(rand() * 25);

  
  let title = "PENGELANA AWAL";
  if (friend.score > 1400) {
    title = "LEGENDA NUSANTARA";
  } else if (friend.score > 1200) {
    title = "PENGELANA ULUNG";
  } else if (friend.score > 1000) {
    title = "PENJELAJAH AKTIF";
  }

  
  const ownedCardsCount = 3 + Math.floor(rand() * 6); 
  const shuffledCards = [...actionCards].sort(() => rand() - 0.5);
  const ownedCards = shuffledCards.slice(0, ownedCardsCount).map(card => ({
    ...card,
    count: 1 + Math.floor(rand() * 3) 
  }));

  
  const rarityOrder = { epic: 0, rare: 1, common: 2 };
  ownedCards.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

  
  const weeklyValues = Array.from({ length: 7 }, () => 15 + Math.floor(rand() * 80));
  const maxWeeklyIndex = weeklyValues.indexOf(Math.max(...weeklyValues));
  const daysName = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const maxDayName = daysName[maxWeeklyIndex];

  
  const activeBadges = [
    rand() > 0.35,
    rand() > 0.45,
    rand() > 0.55,
    rand() > 0.65
  ];

  return {
    accuracy,
    title,
    ownedCards,
    weeklyValues,
    maxDayName,
    activeBadges,
    rank: rankValue || 3
  };
};

export default function FriendProfileModal({ friend, rank, onClose }) {
  const [viewMode, setViewMode] = useState('main'); 
  const [selectedItem, setSelectedItem] = useState(null);
  
  if (!friend) return null;

  const data = resolveFriendData(friend, rank);
  const totalCardsCount = data.ownedCards.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="modal-overlay">
      <div className="friend-profile-card">
        {viewMode === 'main' ? (
          <>
            <button className="close-btn-top" onClick={onClose}><X size={24} /></button>
            
            <div className="profile-header-bg">
              <div className="wave w1" />
              <div className="wave w2" />
            </div>
            
            <div className="profile-scroll-area">
              <div className="profile-main-info">
                <div className="avatar-section">
                  <div className="avatar-glow-ring">
                    <div className="friend-avatar-large">{friend.avatar}</div>
                  </div>
                </div>
                <h2 className="friend-name-large">{friend.name}</h2>
                <span className="friend-title-txt">{data.title}</span>
                <div className="friend-rank-pill">Peringkat Kelas #{data.rank}</div>
              </div>

              <div className="inner-content-wrapper">
                
                <div className="stats-grid-wrapper">
                  <div className="stat-card-3d orange">
                    <div className="stat-card-content">
                      <div className="stat-card-header">
                        <span className="stat-lbl">HARI STREAK</span>
                      </div>
                      <div className="stat-card-body">
                        <div className="stat-icon-box"><Zap size={22} fill="#f4c265" color="#f4c265" /></div>
                        <span className="stat-val">{friend.streak}</span>
                      </div>
                    </div>
                  </div>
                  <div className="stat-card-3d green">
                    <div className="stat-card-content">
                      <div className="stat-card-header">
                        <span className="stat-lbl">AKURASI</span>
                      </div>
                      <div className="stat-card-body">
                        <div className="stat-icon-box"><Target size={22} color="#58cc02" /></div>
                        <span className="stat-val">{data.accuracy}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="stat-card-3d yellow">
                    <div className="stat-card-content">
                      <div className="stat-card-header">
                        <span className="stat-lbl">PERINGKAT</span>
                      </div>
                      <div className="stat-card-body">
                        <div className="stat-icon-box"><Award size={22} color="#ffc800" /></div>
                        <span className="stat-val">#{data.rank}</span>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="artifact-bar-premium" onClick={() => setViewMode('collection')}>
                  <div className="bar-icon-box">
                    <Book size={22} color="white" fill="white" />
                  </div>
                  <div className="bar-mid">
                    <span className="bar-label">Tas Bekal Kartu</span>
                    <span className="bar-sub">{totalCardsCount} Kartu Dimiliki</span>
                  </div>
                  <div className="bar-right">
                    <ChevronRight size={22} color="#AFAFAF" />
                  </div>
                </div>

                
                <div className="weekly-chart-card">
                  <div className="chart-header">
                    <h3>Laporan Mingguan</h3>
                    <div className="trend-badge">SI PALING RAJIN! 🚀</div>
                  </div>
                  <div className="chart-area">
                    {data.weeklyValues.map((v, i) => {
                      const maxVal = Math.max(...data.weeklyValues);
                      return (
                        <div key={i} className="chart-column">
                          <div className="bar-container">
                            <div 
                              className={`bar-fill ${v === maxVal ? 'is-max' : ''}`} 
                              style={{ height: `${v}%` }}
                            />
                          </div>
                          <span className="day-label">{['S', 'S', 'R', 'K', 'J', 'S', 'M'][i]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="chart-summary">
                    Wah! {friend.name.split(' ')[0]} belajar paling banyak di hari <strong>{data.maxDayName}</strong>.
                  </p>
                </div>

                
                <div className="achievement-section-card">
                  <h3 className="section-title">Medali Pencapaian</h3>
                  <div className="badge-list-fun">
                    {FRIEND_ACHIEVEMENTS.map((ach, idx) => {
                      const isActive = data.activeBadges[idx];
                      return (
                        <div key={ach.id} className="badge-item-fun">
                          <div className={`badge-medal ${isActive ? 'active' : 'grayscale'}`} style={{ '--color': ach.color }}>
                            <div className="medal-ring">
                              <span className="medal-emoji">{ach.icon}</span>
                            </div>
                          </div>
                          <span className="badge-label">{ach.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </>
        ) : (
          <>
            
            <header className="collection-header">
              <button className="back-btn-3d" onClick={() => setViewMode('main')}>
                <ChevronLeft size={28} />
              </button>
              <div className="header-title-box">
                <Book size={24} color="#8B4513" />
                <h2>Tas Bekal Kartu</h2>
              </div>
              <div style={{ width: 45 }}></div>
            </header>

            <div className="collection-body">
              {data.ownedCards.length === 0 ? (
                <div className="empty-collection">
                  <div className="empty-visual">🎒✨</div>
                  <h3>Tas Bekal Kartu Kosong!</h3>
                  <p>Teman kamu belum mengumpulkan kartu bekal Jelajah Nusantara.</p>
                </div>
              ) : (
                <div className="collection-grid">
                  {data.ownedCards.map((item) => (
                    <div 
                      key={item.id} 
                      className={`artifact-card-3d ${item.rarity}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="card-face">
                        <div className="artifact-icon-large">{item.icon}</div>
                        <div className="artifact-name-box">
                          <span className="artifact-name-txt">{item.name}</span>
                        </div>
                        {item.count > 1 && <span className="artifact-count-badge">x{item.count}</span>}
                        
                        <div className="card-stars">
                          {Array.from({ length: item.rarity === 'epic' ? 3 : item.rarity === 'rare' ? 2 : 1 }).map((_, i) => (
                            <Star key={i} className="star-icon" size={10} fill="#FFD700" color="#FFA800" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      
      {selectedItem && (
        <div className="item-detail-overlay-friend" onClick={() => setSelectedItem(null)}>
          <div className="detail-modal-friend" onClick={e => e.stopPropagation()}>
            <div className={`detail-rarity-friend ${selectedItem.rarity}`}>{selectedItem.rarity.toUpperCase()}</div>
            <div className="detail-icon-friend">{selectedItem.icon}</div>
            <h3>{selectedItem.name}</h3>
            <p>{selectedItem.desc}</p>
            <div className="card-stars-friend large" style={{ marginBottom: '25px', marginTop: '-15px' }}>
              {Array.from({ length: selectedItem.rarity === 'epic' ? 3 : selectedItem.rarity === 'rare' ? 2 : 1 }).map((_, i) => (
                <Star key={i} className="star-icon" size={18} fill="#FFD700" color="#FFA800" />
              ))}
            </div>
            <button className="close-detail-btn-friend" onClick={() => setSelectedItem(null)}>Tutup</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.8); display: flex; justify-content: center;
          align-items: center; z-index: 7000; padding: 20px;
          backdrop-filter: blur(10px);
        }
        .friend-profile-card {
          background: var(--background-color, #f4f6f8); width: 100%; max-width: 420px;
          height: 90%; max-height: 700px;
          border-radius: 40px; border: 4px solid var(--border-color);
          overflow: hidden; position: relative; display: flex; flex-direction: column;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .close-btn-top {
          position: absolute; top: 20px; right: 20px; z-index: 10;
          background: rgba(0,0,0,0.15); border: none; color: white;
          width: 40px; height: 40px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .close-btn-top:hover { background: rgba(0,0,0,0.3); }

        .profile-header-bg {
          height: 140px; background: linear-gradient(135deg, #1C80F6 0%, #1CB0F6 100%);
          position: relative; overflow: hidden; flex-shrink: 0;
        }
        .wave {
          position: absolute; border-radius: 43%; opacity: 0.12;
          width: 250px; height: 250px; background: white;
        }
        .w1 { top: -140px; left: -60px; animation: rotateWave 22s infinite linear; }
        .w2 { top: -110px; right: -50px; animation: rotateWave 28s infinite linear reverse; }

        @keyframes rotateWave {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .profile-scroll-area {
          flex: 1; overflow-y: auto; padding-bottom: 30px;
        }

        .profile-main-info {
          text-align: center; margin-top: -65px; padding: 0 20px 10px;
          display: flex; flex-direction: column; align-items: center;
        }
        
        .avatar-section { position: relative; margin-bottom: 12px; }
        .avatar-glow-ring {
          padding: 6px; background: var(--card-bg, white); border-radius: 28px;
          border: 4px solid var(--secondary-color, #1CB0F6);
          box-shadow: 0 10px 24px rgba(28, 176, 246, 0.2);
          display: inline-block;
          transition: transform 0.3s;
        }
        .avatar-glow-ring:hover { transform: scale(1.05) rotate(-3deg); }

        .friend-avatar-large {
          width: 100px; height: 100px; background: white;
          border-radius: 20px; font-size: 3.8rem;
          display: flex; justify-content: center; align-items: center;
        }
        .friend-name-large { font-weight: 950; font-size: 1.4rem; color: var(--text-color, #4B4B4B); margin-bottom: 2px; line-height: 1.2; }
        .friend-title-txt { font-weight: 850; color: var(--text-muted, #777); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .friend-rank-pill {
          display: inline-block; background: #e3f2fd; color: #1cb0f6;
          padding: 5px 14px; border-radius: 50px; font-weight: 900; font-size: 0.75rem;
          box-shadow: 0 3px 0 rgba(28, 176, 246, 0.2);
        }

        .inner-content-wrapper { padding: 10px 18px; display: flex; flex-direction: column; gap: 15px; }

        /* StatsGrid inside modal */
        .stats-grid-wrapper {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
        }
        .stat-card-3d {
          position: relative; height: 110px;
        }
        .stat-card-3d.orange { --accent: #f4c265; --bg: rgba(244, 194, 101, 0.1); }
        .stat-card-3d.green { --accent: #58cc02; --bg: rgba(88, 204, 2, 0.1); }
        .stat-card-3d.yellow { --accent: #ffc800; --bg: rgba(255, 200, 0, 0.1); }

        .stat-card-content {
          position: absolute; inset: 0; background: var(--card-bg, white); border-radius: 20px;
          display: flex; flex-direction: column; overflow: hidden;
          border: 3px solid var(--border-color, #e5e5e5);
          box-shadow: 0 5px 0 var(--border-color, #e5e5e5);
        }
        .stat-card-header {
          background: var(--accent); padding: 5px; text-align: center;
          border-bottom: 3px solid var(--border-color, #e5e5e5);
        }
        .stat-lbl {
          font-weight: 900; font-size: 0.6rem; color: white;
          text-shadow: 0 1px 1px rgba(0,0,0,0.1); display: block;
        }
        .stat-card-body {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 4px; padding: 6px; background: var(--card-bg, white);
        }
        .stat-icon-box { display: flex; align-items: center; justify-content: center; transform: scale(0.85); }
        .stat-val { font-weight: 950; font-size: 1.15rem; color: var(--text-color, #4b4b4b); line-height: 1; }

        /* Tas Bekal Bar */
        .artifact-bar-premium {
          background: linear-gradient(135deg, #1C80F6 0%, #1CB0F6 100%);
          border-radius: 22px; padding: 12px 16px; display: flex; align-items: center;
          border: 3px solid var(--border-color, #e5e5e5); border-bottom-width: 6px;
          cursor: pointer; transition: transform 0.1s;
        }
        .artifact-bar-premium:active { transform: translateY(2px); border-bottom-width: 3px; }
        .bar-icon-box {
          width: 36px; height: 36px; background: rgba(255,255,255,0.2);
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          margin-right: 12px;
        }
        .bar-mid { flex: 1; display: flex; flex-direction: column; }
        .bar-label { color: white; font-weight: 950; font-size: 0.9rem; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .bar-sub { color: rgba(255,255,255,0.8); font-weight: 800; font-size: 0.65rem; }
        .bar-right { display: flex; align-items: center; }

        /* Weekly Chart */
        .weekly-chart-card {
          background: var(--card-bg, white); border-radius: 24px; padding: 18px;
          border: 3px solid var(--border-color, #e5e5e5); border-bottom-width: 6px;
        }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .chart-header h3 { font-weight: 950; font-size: 1.1rem; color: var(--text-color, #4b4b4b); margin: 0; }
        .trend-badge { 
          background: linear-gradient(135deg, #1C80F6 0%, #58cc02 100%);
          color: white; padding: 4px 10px; 
          border-radius: 50px; font-weight: 900; font-size: 0.6rem;
          box-shadow: 0 3px 0 #1063C3;
        }
        .chart-area {
          height: 110px; display: flex; align-items: flex-end; justify-content: space-between;
          padding: 0 5px; margin-bottom: 12px; border-bottom: 2px solid var(--border-color, #e5e5e5);
        }
        .chart-column { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .bar-container { width: 100%; height: 80px; display: flex; align-items: flex-end; justify-content: center; }
        .bar-fill {
          width: 12px; background: var(--border-color, #e5e5e5); border-radius: 50px 50px 0 0;
          transition: height 1s; position: relative;
        }
        .bar-fill::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, #A2D2FF 0%, var(--border-color, #e5e5e5) 100%);
          border-radius: 50px 50px 0 0; opacity: 0.45;
        }
        .bar-fill.is-max {
          background: linear-gradient(180deg, #00C6FF 0%, #1C80F6 100%);
          box-shadow: 0 0 10px rgba(28, 176, 246, 0.3);
        }
        .bar-fill.is-max::after { display: none; }
        .day-label { font-weight: 950; font-size: 0.75rem; color: var(--text-muted, #777); }
        .chart-summary { font-size: 0.8rem; color: var(--text-muted, #777); font-weight: 800; text-align: center; margin: 0; }
        .chart-summary strong { color: var(--secondary-color, #1CB0F6); font-weight: 950; }

        /* Achievements */
        .achievement-section-card {
          background: var(--card-bg, white); border-radius: 24px; padding: 18px;
          border: 3px solid var(--border-color, #e5e5e5); border-bottom-width: 6px;
        }
        .section-title { font-weight: 950; font-size: 1.1rem; color: var(--text-color, #4b4b4b); margin: 0 0 15px 0; }
        .badge-list-fun { display: flex; justify-content: space-around; padding-bottom: 5px; }
        .badge-item-fun { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        
        .badge-medal {
          width: 58px; height: 58px; background: var(--color); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          position: relative; border: 3px solid var(--border-color, #e5e5e5);
          box-shadow: 0 4px 0 var(--border-color, #e5e5e5);
        }
        .badge-medal.grayscale {
          opacity: 0.3; filter: grayscale(1);
          --color: #e5e5e5;
        }
        .medal-ring {
          width: 44px; height: 44px; border: 2.5px dashed rgba(255,255,255,0.45);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
        }
        .medal-emoji { font-size: 1.5rem; }
        .badge-label { font-weight: 900; font-size: 0.65rem; color: var(--text-muted, #777); text-align: center; }

        /* COLLECTION VIEW IN FRIEND PROFILE */
        .collection-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px 20px; border-bottom: 3px solid var(--border-color, #e5e5e5);
          background: var(--card-bg, white); flex-shrink: 0;
        }
        .back-btn-3d {
          background: var(--card-bg, white); border: 2.5px solid var(--border-color, #e5e5e5);
          border-bottom-width: 5px; width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          color: #8B4513; transition: transform 0.1s;
        }
        .back-btn-3d:active { transform: translateY(2px); border-bottom-width: 2.5px; }
        .header-title-box { display: flex; align-items: center; gap: 8px; }
        .header-title-box h2 { font-weight: 950; font-size: 1.2rem; color: #8B4513; margin: 0; }

        .collection-body {
          flex: 1; overflow-y: auto; padding: 20px;
        }
        .empty-collection { text-align: center; padding: 40px 20px; }
        .empty-visual { font-size: 4rem; margin-bottom: 15px; }
        .empty-collection h3 { font-weight: 950; font-size: 1.2rem; color: var(--text-color, #4b4b4b); margin-bottom: 8px; }
        .empty-collection p { color: var(--text-muted, #777); font-weight: 700; font-size: 0.85rem; line-height: 1.4; }

        .collection-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;
        }
        .artifact-card-3d {
          position: relative; aspect-ratio: 3/4; cursor: pointer; perspective: 1000px;
        }
        .card-face {
          position: absolute; inset: 0; background: white; border-radius: 18px;
          border: 3.5px solid #E5E5E5; box-shadow: 0 6px 0 #E5E5E5;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 8px; transition: all 0.15s;
        }
        .artifact-card-3d:hover .card-face { transform: translateY(-4px); box-shadow: 0 10px 0 #E5E5E5; }
        .artifact-card-3d:active .card-face { transform: translateY(2px); box-shadow: 0 4px 0 #E5E5E5; }

        .artifact-card-3d.epic .card-face {
          background: linear-gradient(135deg, #FFFDF0, #FFF9C4); border-color: #FFD700; box-shadow: 0 6px 0 #FFD700;
        }
        .artifact-card-3d.epic:hover .card-face { box-shadow: 0 10px 0 #FFD700; }
        .artifact-card-3d.epic:active .card-face { box-shadow: 0 4px 0 #FFD700; }

        .artifact-card-3d.rare .card-face {
          background: linear-gradient(135deg, #F0F9FF, #E0F2FE); border-color: #1CB0F6; box-shadow: 0 6px 0 #1CB0F6;
        }
        .artifact-card-3d.rare:hover .card-face { box-shadow: 0 10px 0 #1CB0F6; }
        .artifact-card-3d.rare:active .card-face { box-shadow: 0 4px 0 #1CB0F6; }

        .artifact-icon-large { font-size: 2.2rem; margin-bottom: 5px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); }
        .artifact-name-box { flex: 1; display: flex; align-items: center; justify-content: center; }
        .artifact-name-txt { font-weight: 950; font-size: 0.65rem; color: #4B4B4B; text-align: center; line-height: 1.25; }
        
        .artifact-card-3d.epic .artifact-name-txt { color: #8B4513; }
        .artifact-card-3d.rare .artifact-name-txt { color: #1485BA; }

        .artifact-count-badge {
          position: absolute; top: -6px; left: -6px; background: #f4c265;
          color: white; font-size: 0.65rem; font-weight: 900; padding: 2px 7px;
          border-radius: 10px; border: 2.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        .card-stars {
          display: flex; justify-content: center; align-items: center; gap: 1px;
          margin-top: 5px;
        }
        .star-icon {
          animation: starGlow 1.5s ease-in-out infinite alternate;
        }
        @keyframes starGlow {
          from { filter: drop-shadow(0 0 1px rgba(255, 215, 0, 0.4)); }
          to { filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.9)); }
        }

        /* DETAIL POPUP FRIEND */
        .item-detail-overlay-friend {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center;
          z-index: 8000; backdrop-filter: blur(5px);
          animation: fadeIn 0.25s;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .detail-modal-friend {
          background: white; width: 85%; max-width: 330px; border-radius: 30px;
          padding: 25px; text-align: center; position: relative;
          animation: modalUp 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 4px solid var(--border-color, #e5e5e5);
        }
        @keyframes modalUp { from { transform: scale(0.8) translateY(50px); } to { transform: scale(1) translateY(0); } }

        .detail-rarity-friend {
          display: inline-block; padding: 4px 12px; border-radius: 50px;
          color: white; font-weight: 900; font-size: 0.65rem; margin-bottom: 15px;
        }
        .detail-rarity-friend.epic { background: #FFD700; color: #8B4513; }
        .detail-rarity-friend.rare { background: #1CB0F6; }
        .detail-rarity-friend.common { background: #AFAFAF; }

        .detail-icon-friend { font-size: 4.5rem; margin-bottom: 15px; }
        .detail-modal-friend h3 { font-weight: 950; font-size: 1.4rem; color: #4B4B4B; margin: 0 0 8px; }
        .detail-modal-friend p { color: #777; font-weight: 700; font-size: 0.85rem; line-height: 1.4; margin-bottom: 25px; }

        .close-detail-btn-friend {
          width: 100%; background: #E5E5E5; border: none; padding: 12px;
          border-radius: 12px; font-weight: 900; color: #777; cursor: pointer;
        }
        .card-stars-friend.large { display: flex; justify-content: center; gap: 4px; }
      `}</style>
    </div>
  );
}
