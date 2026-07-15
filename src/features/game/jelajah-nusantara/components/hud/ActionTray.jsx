import { Dices, Briefcase } from 'lucide-react';
import Dice3D from '../../../../../components/common/Dice3D';
import { soundEngine } from '../../logic/soundEngine';

export default function ActionTray({ 
  isVisible, phase, diceValue, isLocalHuman, inventory, 
  onRoll, onUseCard, onOpenInventory, isTestMode, onCheat 
}) {
  return (
    <div className={`action-tray ${isVisible ? 'visible' : ''}`}>
      <div className="action-buttons-row">
        {isLocalHuman && phase === 'WAITING_ROLL' && (
          <button className="roll-button" onClick={() => { soundEngine.playSound('click'); onRoll(); }}>
            <div className="roll-btn-inner">
              <Dices size={24} />
              <span>PUTAR DADU</span>
            </div>
          </button>
        )}
        
        <button className="inventory-toggle-btn" onClick={() => { soundEngine.playSound('click'); onOpenInventory(); }}>
          <Briefcase size={22} />
          <span>TAS</span>
        </button>
      </div>

      <style>{`
        .action-tray {
          position: absolute; left: 50%; bottom: 20px;
          display: flex; flex-direction: column; align-items: center; gap: 15px;
          transform: translate(-50%, 200%); opacity: 0;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          pointer-events: auto; width: 100%; max-width: 360px;
        }
        .action-tray.visible { transform: translate(-50%, 0); opacity: 1; }
        
        @media (max-width: 600px) {
          .action-tray { bottom: 15px; max-width: 280px; }
          .roll-button { max-width: 180px !important; }
          .roll-btn-inner { padding: 12px 0 !important; font-size: 0.85rem !important; }
          .inventory-toggle-btn { width: 56px !important; height: 56px !important; }
        }

        .action-buttons-row { display: flex; align-items: center; gap: 12px; width: 100%; justify-content: center; }

        .roll-button {
          background: linear-gradient(135deg, #D4A373, #A26E40); border: 2px solid #EAB308; padding: 0; border-radius: 16px;
          cursor: pointer; transition: all 0.1s;
          flex: 1; max-width: 200px;
          box-shadow: 0 5px 0 #6A3E16;
        }
        .roll-button:active { transform: translateY(3px); box-shadow: 0 2px 0 #6A3E16; }
        .roll-btn-inner {
          padding: 10px 0; background: linear-gradient(135deg, #D4A373, #A26E40); border-radius: 16px;
          color: #FFFDF5; font-weight: 900; font-size: 0.9rem; letter-spacing: 0.5px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          border: 2px solid rgba(234,179,8,0.4);
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .inventory-toggle-btn {
          width: 52px; height: 52px; border-radius: 16px; 
          background: linear-gradient(135deg, #FEF3C7, #E2C999);
          border: 2.5px dashed #8B4513;
          color: #4A2E1B; 
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 1px; cursor: pointer;
          box-shadow: 0 4px 0 #6A3E16; transition: all 0.1s;
        }
        .inventory-toggle-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 #6A3E16; }
        .inventory-toggle-btn span { font-size: 0.6rem; font-weight: 900; color: #6A3E16; text-transform: uppercase; }
      `}</style>
    </div>
  );
}
