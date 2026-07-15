import React from 'react';
import { Loader2, X } from 'lucide-react';

export default function InviteLoadingOverlay({ friendName, onCancel }) {
  return (
    <div className="invite-overlay">
      <div className="invite-card">
        <div className="loading-container">
          <Loader2 size={60} color="#CE82FF" className="spinner-anim" />
        </div>
        
        <h2 className="waiting-title">Menunggu Jawaban...</h2>
        <p className="waiting-desc">
          Kamu mengundang <strong>{friendName}</strong> untuk bermain Ular Tangga Sejarah.
        </p>

        <button className="cancel-invite-btn" onClick={onCancel}>
          <X size={18} />
          <span>Batalkan Undangan</span>
        </button>
      </div>

      <style jsx>{`
        .invite-overlay {
          position: fixed; inset: 0; background: rgba(255,255,255,0.8);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000; backdrop-filter: blur(8px);
        }
        
        .invite-card {
          width: 90%; max-width: 320px; background: white;
          border-radius: 32px; padding: 40px 20px;
          text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          border: 4px solid #eee;
        }

        .loading-container { margin-bottom: 25px; display: flex; justify-content: center; }
        .spinner-anim { animation: spin 1.5s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .waiting-title { font-weight: 900; font-size: 1.4rem; color: #333; margin-bottom: 10px; }
        .waiting-desc { font-weight: 600; color: #666; font-size: 0.9rem; line-height: 1.5; margin-bottom: 30px; }
        .waiting-desc strong { color: #CE82FF; }

        .cancel-invite-btn {
          background: #ff4b4b; border: none; border-radius: 16px;
          padding: 15px 25px; width: 100%; display: flex; align-items: center;
          justify-content: center; gap: 8px; color: white;
          font-weight: 900; font-size: 1rem; cursor: pointer;
          box-shadow: 0 6px 0 #d33; transition: all 0.1s;
        }
        .cancel-invite-btn:active { transform: translateY(4px); box-shadow: none; }
      `}</style>
    </div>
  );
}
