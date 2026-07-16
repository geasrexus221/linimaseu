import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  title = 'Konfirmasi', 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'danger' 
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-x" onClick={onCancel}><X size={20} /></button>
        
        <div className={`modal-icon-box ${type}`}>
          <AlertTriangle size={32} />
        </div>

        <div className="modal-text">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`modal-btn confirm ${type}`} onClick={() => {
            onConfirm();
            onCancel();
          }}>
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx>{`
        .confirm-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          padding: 20px; z-index: 10000; backdrop-filter: blur(5px);
          animation: fadeIn 0.2s ease-out;
        }
        .confirm-modal-content {
          background: white; width: 100%; max-width: 360px;
          border-radius: 30px; padding: 35px 25px 25px;
          text-align: center; position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { transform: scale(0.8) translateY(30px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

        .close-x {
          position: absolute; top: 15px; right: 15px;
          background: #F0F0F0; border: none; border-radius: 50%;
          width: 35px; height: 35px; color: #999; cursor: pointer;
        }

        .modal-icon-box {
          width: 70px; height: 70px; border-radius: 20px; margin: 0 auto 20px;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-icon-box.danger { background: #FFE5E5; color: #FF4B4B; }
        .modal-icon-box.warning { background: #FFF4E5; color: #f4c265; }

        .modal-text h3 { margin: 0; font-weight: 900; font-size: 1.4rem; color: #333; }
        .modal-text p { margin: 10px 0 25px; font-weight: 700; color: #777; line-height: 1.5; font-size: 0.9rem; }

        .modal-actions { display: flex; flex-direction: column; gap: 10px; }
        .modal-btn {
          padding: 15px; border-radius: 16px; border: none;
          font-weight: 900; font-size: 1rem; cursor: pointer;
          transition: transform 0.1s;
        }
        .modal-btn:active { transform: scale(0.97); }
        
        .modal-btn.confirm.danger { background: #FF4B4B; color: white; box-shadow: 0 5px 0 #D13535; }
        .modal-btn.confirm.warning { background: #f4c265; color: white; box-shadow: 0 5px 0 #d1a34b; }
        .modal-btn.cancel { background: #F0F0F0; color: #AFAFAF; }
      `}</style>
    </div>
  );
}
