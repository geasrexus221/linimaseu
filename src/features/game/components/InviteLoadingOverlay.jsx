import React from 'react';
import { Loader2, X } from 'lucide-react';

export default function InviteLoadingOverlay({ invitedPlayer, onCancel }) {
  return (
    <div className="invite-loading-overlay">
      <div className="loading-card">
        <div className="loading-animation-small">
          <div className="spinner-ring-small" />
          <div className="player-avatar-small">
            {invitedPlayer?.avatar || '👤'}
          </div>
        </div>
        
        <div className="loading-text-small">
          <h2>Menunggu...</h2>
          <p>Mengajak <strong>{invitedPlayer?.name || 'Teman'}</strong></p>
        </div>

        <button className="cancel-invite-btn-small" onClick={onCancel}>
          <X size={16} />
          <span>BATALKAN</span>
        </button>
      </div>

      <style jsx>{`
        .invite-loading-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          display: flex; justify-content: center; align-items: center;
          z-index: 6000; padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .loading-card {
          background: white; width: 90%; max-width: 280px; 
          padding: 30px 20px; border-radius: 32px; text-align: center;
          display: flex; flex-direction: column; align-items: center;
          gap: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          border: 3px solid #E5E5E5;
          animation: popUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popUp { 
          from { transform: scale(0.8) translateY(20px); opacity: 0; } 
          to { transform: scale(1) translateY(0); opacity: 1; } 
        }

        .loading-animation-small {
          position: relative; width: 80px; height: 80px;
          display: flex; justify-content: center; align-items: center;
        }
        .spinner-ring-small {
          position: absolute; inset: 0; border: 4px solid #f0f0f0;
          border-top: 4px solid #1cb0f6; border-radius: 50%;
          animation: spin 1.5s linear infinite;
        }
        .player-avatar-small { font-size: 2rem; z-index: 2; }
        
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        :global(.animate-spin) { animation: spin 1s linear infinite; }

        .loading-text-small h2 { font-weight: 900; font-size: 1.4rem; color: #333; margin: 0; }
        .loading-text-small p { color: #777; font-weight: 700; font-size: 0.85rem; margin-top: 5px; }

        .cancel-invite-btn-small {
          background: #ff4b4b; color: white; border: none;
          padding: 10px 20px; border-radius: 15px; font-weight: 900;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 0 #ea2b2b; cursor: pointer; transition: all 0.1s;
          font-size: 0.75rem;
        }
        .cancel-invite-btn-small:active { transform: translateY(2px); box-shadow: 0 2px 0 #ea2b2b; }
      `}</style>
    </div>
  );
}
