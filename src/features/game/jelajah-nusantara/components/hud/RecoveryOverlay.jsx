import React from 'react';
import { useGameStore } from '../../../../../store/useGameStore';
import Dice3D from '../../../../../components/common/Dice3D';
import { useStore } from '../../../../../store/useStore';
import character1tumbang from '../../../../../assets/UI/Character/character1tumbang.svg';
import { soundEngine } from '../../../../../features/game/jelajah-nusantara/logic/soundEngine';

export default function RecoveryOverlay() {
  const phase = useGameStore(s => s.phase);
  const turnIdx = useGameStore(s => s.turnIdx);
  const players = useGameStore(s => s.players);
  const diceValue = useGameStore(s => s.diceValue);
  const recoveryResult = useGameStore(s => s.recoveryResult);
  const handleRecoveryRoll = useGameStore(s => s.handleRecoveryRoll);
  const confirmRecoverySuccess = useGameStore(s => s.confirmRecoverySuccess);
  const confirmRecoveryFail = useGameStore(s => s.confirmRecoveryFail);
  const confirmRecoveryTie = useGameStore(s => s.confirmRecoveryTie);
  const theme = useStore(state => state.theme);
  const isDark = theme === 'dark';

  const isRecoveryPhase = phase === 'RECOVERY_WAITING' || phase === 'RECOVERY_ROLLING' || phase === 'RECOVERY_RESULT';
  const player = players && players[turnIdx];

  // Auto-confirm effect for AI Bot
  React.useEffect(() => {
    if (phase === 'RECOVERY_RESULT' && player && player.type === 'ai') {
      const timer = setTimeout(() => {
        if (recoveryResult === 'WIN') confirmRecoverySuccess();
        else if (recoveryResult === 'TIE') confirmRecoveryTie();
        else confirmRecoveryFail();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, player?.type, recoveryResult, confirmRecoverySuccess, confirmRecoveryFail, confirmRecoveryTie]);

  if (!isRecoveryPhase || !player) return null;

  const isRolling = phase === 'RECOVERY_ROLLING';
  const targets = [5, 3, 1];
  const faintAttempts = player.faintAttempts || 0;
  const target = targets[faintAttempts] || 1;

  const getWinningNumbers = (t) => {
    if (t === 5) return [6];
    if (t === 3) return [4, 5, 6];
    return [2, 3, 4, 5, 6];
  };

  const winningNums = getWinningNumbers(target);

  return (
    <div className="event-sheet-overlay recovery-overlay-sheet">
      <div className="event-sheet-container">
        {/* DRAG HANDLE VISUAL */}
        <div className="sheet-handle" />

        <div className="sheet-layout">
          {/* CENTERED: TITLE & CHARACTER SPRITE */}
          <div className="sheet-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', marginBottom: '8px' }}>
            <div className="title-stack" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <h2 className="event-title" style={{ fontSize: '1.4rem', color: '#EF4444', fontWeight: 950, letterSpacing: '1px', textShadow: '0 0 10px rgba(239, 68, 68, 0.4)' }}>TUMBANG!</h2>
              <div className="tumbang-sprite-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '4px',
                height: '48px',
                animation: 'spritePulse 2s ease-in-out infinite'
              }}>
                <img 
                  src={character1tumbang} 
                  alt="Tumbang" 
                  style={{
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                  }} 
                />
              </div>
            </div>
          </div>

          {/* CENTER/RIGHT: CONTENT */}
          <div className="sheet-body">
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '10px' }}>
              {/* Target Dice visual horizontal bar */}
              <div style={{ 
                background: isDark ? '#1F2937' : '#F3F4F6', 
                padding: '8px 12px', 
                borderRadius: '14px', 
                border: `2px solid ${isDark ? '#374151' : '#E5E5E5'}`, 
                flex: 1.6, 
                textAlign: 'center' 
              }}>
                <div style={{ fontSize: '0.6rem', color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 900, letterSpacing: '1px' }}>TARGET ANGKA DADU</div>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5, 6].map(num => {
                    const isSuccess = winningNums.includes(num);
                    const isTie = num === target;
                    let bgColor = isDark ? '#374151' : '#E5E5E5';
                    let textColor = isDark ? '#9CA3AF' : '#6B7280';
                    let borderStyle = '1px solid transparent';
                    let boxShadowStyle = 'none';

                    if (isSuccess) {
                      bgColor = '#58CC02';
                      textColor = 'white';
                      borderStyle = '1.5px solid white';
                      boxShadowStyle = '0 0 6px rgba(88,204,2,0.6)';
                    } else if (isTie) {
                      bgColor = '#F59E0B';
                      textColor = 'white';
                      borderStyle = '1.5px solid white';
                      boxShadowStyle = '0 0 6px rgba(245,158,11,0.6)';
                    }

                    return (
                      <div 
                        key={num}
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '5px',
                          backgroundColor: bgColor,
                          color: textColor,
                          fontWeight: 900,
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: borderStyle,
                          boxShadow: boxShadowStyle,
                          transition: 'all 0.2s'
                        }}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Turn attempt box */}
              <div style={{ 
                background: '#3B82F6', 
                padding: '8px 12px', 
                borderRadius: '14px', 
                border: '2px solid #2563EB', 
                flex: 1, 
                textAlign: 'center', 
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', fontWeight: 900, letterSpacing: '1px' }}>GILIRAN</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '2px' }}>KE-{faintAttempts + 1}</div>
              </div>
            </div>

            {/* Conditional Info Banner / Result Banner Box */}
            <div style={{ marginBottom: '10px' }}>
              {phase === 'RECOVERY_RESULT' ? (
                /* Result Banner */
                <div 
                  className="result-banner"
                  style={{
                    background: 
                      recoveryResult === 'WIN' ? 'linear-gradient(135deg, #58CC02 0%, #46A302 100%)' :
                      recoveryResult === 'TIE' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' :
                      'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    padding: '8px 16px',
                    borderRadius: '14px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                    border: '2px solid white'
                  }}
                >
                  <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '1px' }}>
                    {recoveryResult === 'WIN' ? '🎉 BERHASIL BANGKIT!' :
                     recoveryResult === 'TIE' ? '🔄 HASIL SERI!' :
                     '💤 GAGAL MEMULIHKAN DIRI'}
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, opacity: 0.9, marginTop: '2px', lineHeight: '1.25' }}>
                    {recoveryResult === 'WIN' ? 'Tekad pulih kembali (+50)! Kamu bisa bergerak di giliran berikutnya.' :
                     recoveryResult === 'TIE' ? 'Angka dadu sama dengan target. Kamu dapat kesempatan putar lagi!' :
                     'Tekad masih kosong. Coba lagi di giliran berikutnya!'}
                  </div>
                </div>
              ) : (
                /* Instruction / Info Banner */
                <div 
                  className="info-banner"
                  style={{
                    background: isDark ? 'linear-gradient(135deg, #374151 0%, #1F2937 100%)' : 'linear-gradient(135deg, #4B5563 0%, #374151 100%)',
                    padding: '8px 16px',
                    borderRadius: '14px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                    border: `2px solid ${isDark ? '#4B5563' : '#E5E5E5'}`
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px', opacity: 0.75, marginBottom: '2px' }}>
                    🎯 PETUNJUK PEMULIHAN
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, lineHeight: '1.25' }}>
                    {target === 5 ? 'Dapatkan angka 6 untuk Bangkit. Angka 5 berarti Seri (putar kembali).' :
                     target === 3 ? 'Dapatkan angka 4, 5, atau 6 untuk Bangkit. Angka 3 berarti Seri (putar kembali).' :
                     'Dapatkan angka 2, 3, 4, 5, atau 6 untuk Bangkit. Angka 1 berarti Seri (putar kembali).'}
                  </div>
                </div>
              )}
            </div>

            {/* Dice render area */}
            <div style={{ height: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              {(isRolling || diceValue > 0) ? (
                <Dice3D value={diceValue} isRolling={isRolling} size={52} />
              ) : (
                <div style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '0.85rem', fontStyle: 'italic', fontWeight: 700 }}>Siap untuk memutar...</div>
              )}
            </div>

            {/* Footer and Buttons */}
            <div className="sheet-footer">
              {phase === 'RECOVERY_RESULT' ? (
                <button 
                  className="sheet-confirm-btn"
                  style={{
                    background: 
                      recoveryResult === 'WIN' ? '#58CC02' :
                      recoveryResult === 'TIE' ? '#F59E0B' :
                      '#EF4444',
                    boxShadow: 
                      recoveryResult === 'WIN' ? '0 6px 0 #46A302' :
                      recoveryResult === 'TIE' ? '0 6px 0 #B45309' :
                      '0 6px 0 #B91C1C',
                    cursor: player.type === 'ai' ? 'default' : 'pointer'
                  }}
                  disabled={player.type === 'ai'}
                  onClick={() => {
                    soundEngine.playSound('click');
                    if (recoveryResult === 'WIN') confirmRecoverySuccess();
                    else if (recoveryResult === 'TIE') confirmRecoveryTie();
                    else confirmRecoveryFail();
                  }}
                >
                  {player.type === 'ai' ? 'Bot sedang konfirmasi...' :
                   recoveryResult === 'WIN' ? 'Bangkit & Selesai Giliran' :
                   recoveryResult === 'TIE' ? 'Putar Dadu Lagi!' :
                   'Selesai Giliran'}
                </button>
              ) : (
                <button 
                  className="sheet-confirm-btn"
                  style={{
                    background: isRolling ? '#9CA3AF' : '#58CC02',
                    boxShadow: isRolling ? 'none' : '0 6px 0 #46A302',
                    cursor: isRolling || player.type === 'ai' ? 'default' : 'pointer'
                  }}
                  disabled={isRolling || player.type === 'ai'}
                  onClick={() => {
                    soundEngine.playSound('click');
                    handleRecoveryRoll();
                  }}
                >
                  {player.type === 'ai' ? 'Bot sedang memutar...' : isRolling ? 'Memutar...' : 'Putar Dadu Pemulihan'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .recovery-overlay-sheet {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          display: flex; align-items: flex-end; justify-content: center;
          z-index: 9999; backdrop-filter: blur(4px);
          animation: overlayFade 0.3s ease-out;
          font-family: 'Outfit', sans-serif;
        }
        
        @media (min-width: 1024px) {
          .recovery-overlay-sheet {
            background: none;
            backdrop-filter: none;
            align-items: center;
            pointer-events: none;
          }
          .recovery-overlay-sheet .event-sheet-container {
            pointer-events: auto;
            border-radius: 40px !important;
            max-height: 80vh !important;
            border: 4px solid var(--border-color, #E5E5E5) !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
            width: auto !important;
            min-width: 600px;
          }
          .recovery-overlay-sheet .sheet-handle { display: none; }
        }

        .recovery-overlay-sheet .event-sheet-container {
          background: var(--card-bg, #FFFFFF);
          width: 100%; max-width: 900px;
          border-radius: 40px 40px 0 0;
          border: 4px solid var(--border-color, #E5E5E5);
          border-bottom: none;
          box-shadow: 0 -15px 40px rgba(0,0,0,0.5);
          padding: 16px 32px 20px;
          position: relative;
          max-height: 95vh;
          overflow-y: auto;
          animation: sheetSlideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @media (max-width: 600px) {
          .recovery-overlay-sheet .event-sheet-container {
            padding: 12px 20px 16px;
            border-radius: 24px 24px 0 0;
            border-width: 3px;
          }
          .recovery-overlay-sheet .sheet-handle { margin-bottom: 10px; }
          .recovery-overlay-sheet .event-badge { width: 55px !important; height: 55px !important; font-size: 1.8rem !important; }
          .recovery-overlay-sheet .event-title { font-size: 1.1rem !important; }
          .recovery-overlay-sheet .event-msg { font-size: 0.8rem !important; }
          .recovery-overlay-sheet .sheet-confirm-btn { padding: 12px !important; font-size: 1rem !important; border-radius: 14px !important; }
        }

        @media (max-height: 500px) {
          .recovery-overlay-sheet .event-sheet-container {
            padding: 10px 20px 12px;
            border-radius: 20px 20px 0 0;
          }
          .recovery-overlay-sheet .sheet-handle { margin: -6px auto 8px; height: 4px; }
          .recovery-overlay-sheet .sheet-layout { gap: 8px; }
          .recovery-overlay-sheet .event-badge { width: 40px !important; height: 40px !important; font-size: 1.2rem !important; border-radius: 10px !important; }
          .recovery-overlay-sheet .event-title { font-size: 0.9rem !important; }
          .recovery-overlay-sheet .event-msg { font-size: 0.7rem !important; }
          .recovery-overlay-sheet .sheet-confirm-btn { padding: 10px !important; font-size: 0.85rem !important; border-radius: 10px !important; }
          .recovery-overlay-sheet .sheet-header { min-width: auto !important; margin-bottom: 6px; }
        }

        .recovery-overlay-sheet .sheet-handle {
          width: 50px; height: 6px; background: #333; border-radius: 3px;
          margin: -10px auto 12px;
        }

        .recovery-overlay-sheet .sheet-layout {
          display: flex; flex-direction: column; gap: 10px;
        }
        @media (min-width: 850px) {
          .recovery-overlay-sheet .sheet-layout { flex-direction: row; align-items: center; }
        }

        .recovery-overlay-sheet .sheet-header {
          display: flex; align-items: center; gap: 20px; min-width: 280px;
        }
        .recovery-overlay-sheet .event-badge {
          width: 70px; height: 70px; border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.5rem; color: white;
          border: 3px solid rgba(255,255,255,0.3);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          animation: iconBounce 3s infinite ease-in-out;
          flex-shrink: 0;
        }
        .recovery-overlay-sheet .title-stack { flex: 1; }
        .recovery-overlay-sheet .event-title { margin: 0; font-size: 1.4rem; font-weight: 900; color: var(--text-color, #4B4B4B); text-transform: uppercase; line-height: 1.2; }

        .recovery-overlay-sheet .sheet-body { flex: 2; width: 100%; }
        
        .recovery-overlay-sheet .sheet-footer { flex: 1; width: 100%; margin-top: 5px; }
        .recovery-overlay-sheet .sheet-confirm-btn {
          width: 100%; padding: 14px; border-radius: 16px;
          background: #58CC02; color: white; border: none;
          font-weight: 900; font-size: 1.1rem; cursor: pointer;
          box-shadow: 0 6px 0 #46A302; transition: all 0.1s;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .recovery-overlay-sheet .sheet-confirm-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #46A302; }

        .result-banner {
          animation: bannerSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes bannerSlideIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes overlayFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sheetSlideUp { 
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce { from { transform: scale(1); } to { transform: scale(1.05); } }
        @keyframes spritePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03) translateY(-2px); }
        }
      `}</style>
    </div>
  );
}
