import React, { useState, useEffect, useRef } from 'react';
import StudentAvatar from '../../../../components/common/StudentAvatar';
import { useGameStore } from '../../../../store/useGameStore';
import character1iso from '../../../../assets/UI/Character/character1iso.svg';
import character1isojump from '../../../../assets/UI/Character/character1isojump.svg';
import character1isoup from '../../../../assets/UI/Character/character1isoup.svg';
import character1isojumpup from '../../../../assets/UI/Character/character1isojumpup.svg';
import character2iso from '../../../../assets/UI/Character/character2iso.svg';
import character2isojump from '../../../../assets/UI/Character/character2isojump.svg';
import character2isoup from '../../../../assets/UI/Character/character2isoup.svg';
import character2isojumpup from '../../../../assets/UI/Character/character2isojumpup.svg';
import melambai1 from '../../../../assets/UI/Character/melambai1.svg';
import character1sad from '../../../../assets/UI/Character/character1sad.svg';
import character1tumbang from '../../../../assets/UI/Character/character1tumbang.svg';

export default function PawnAvatar({ player, size = 48 }) {
  if (!player) return null;

  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isSad, setIsSad] = useState(false);
  const prevTriggersRef = useRef({ pijar: 0, tekad: 0, pijarLose: 0, tekadLose: 0 });
  const wasActiveRef = useRef(false);

  const turnIdx = useGameStore(state => state.turnIdx);
  const players = useGameStore(state => state.players);
  const pijarFlyTrigger = useGameStore(state => state.pijarFlyTrigger);
  const tekadFlyTrigger = useGameStore(state => state.tekadFlyTrigger);
  const pijarLoseTrigger = useGameStore(state => state.pijarLoseTrigger);
  const tekadLoseTrigger = useGameStore(state => state.tekadLoseTrigger);

  const isActive = players[turnIdx]?.playerNum === player.playerNum;

  useEffect(() => {
    if (!isActive) {
      setIsCelebrating(false);
      setIsSad(false);
      wasActiveRef.current = false;
      return;
    }

    // Reset baseline triggers on turn entry to prevent catch-up celebration of old events
    if (!wasActiveRef.current) {
      wasActiveRef.current = true;
      prevTriggersRef.current = {
        pijar: pijarFlyTrigger,
        tekad: tekadFlyTrigger,
        pijarLose: pijarLoseTrigger,
        tekadLose: tekadLoseTrigger
      };
      return;
    }

    const hasPijarGain = pijarFlyTrigger > prevTriggersRef.current.pijar;
    const hasTekadGain = tekadFlyTrigger > prevTriggersRef.current.tekad;
    const hasPijarLoss = pijarLoseTrigger > prevTriggersRef.current.pijarLose;
    const hasTekadLoss = tekadLoseTrigger > prevTriggersRef.current.tekadLose;

    // Always update baseline values immediately to prevent infinite triggers
    prevTriggersRef.current = {
      pijar: pijarFlyTrigger,
      tekad: tekadFlyTrigger,
      pijarLose: pijarLoseTrigger,
      tekadLose: tekadLoseTrigger
    };

    let timer;

    if (hasPijarGain || hasTekadGain) {
      setIsCelebrating(true);
      setIsSad(false);
      timer = setTimeout(() => {
        setIsCelebrating(false);
      }, 2500);
    } else if (hasPijarLoss || hasTekadLoss) {
      setIsSad(true);
      setIsCelebrating(false);
      timer = setTimeout(() => {
        setIsSad(false);
      }, 2500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [pijarFlyTrigger, tekadFlyTrigger, pijarLoseTrigger, tekadLoseTrigger, isActive]);

  // Determine character assets based on player's chosen characterId and direction facingY
  const isChar2 = player.characterId === 2;
  const isUp = player.facingY === 'up';

  const idleAsset = isChar2
    ? (isUp ? character2isoup : character2iso)
    : (isUp ? character1isoup : character1iso);

  const jumpAsset = isChar2
    ? (isUp ? character2isojumpup : character2isojump)
    : (isUp ? character1isojumpup : character1isojump);

  const avatarSrc = (player.characterId === 1 && player.isFainted)
    ? character1tumbang
    : (player.characterId === 1 && isCelebrating)
      ? melambai1
      : (player.characterId === 1 && isSad)
        ? character1sad
        : (player.isMoving ? jumpAsset : idleAsset);

  return (
    <div style={{
      position: 'relative',
      width: size * 1.5,
      minHeight: size * 1.8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
      transformStyle: 'preserve-3d',
    }}>
      {/* Floating Name Badge above head */}
      <div style={{
        position: 'absolute',
        top: '18px', 
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: player.color || '#333',
        color: 'white',
        padding: '3px 8px',
        borderRadius: '12px',
        fontSize: '0.65rem',
        fontWeight: '900',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        border: '1.5px solid white',
        zIndex: 50,
        pointerEvents: 'none',
      }}>
        {player.name || 'Pemain'}
      </div>

      {/* Floating Body */}
      <div style={{
        width: '100%',
        position: 'relative',
        top: '-5px',
        zIndex: 2,
        animation: player.isFainted ? 'none' : 'pawnFloat 2s ease-in-out infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        transformStyle: 'preserve-3d',
      }}>
        <div style={{
          width: size * 4.2,
          height: size * 4.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible'
        }}>
          <img
            src={avatarSrc}
            alt={player.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transform: player.facing === 'right' ? 'scaleX(-1)' : 'scaleX(1)',
              transition: 'transform 0.2s ease-out'
            }}
          />
        </div>
      </div>

      {/* Neon Player Color Indicator Ring */}
      <div style={{
        position: 'absolute',
        bottom: 63, 
        width: size * 1.1,
        height: 12,
        border: `2.5px solid ${player.color}`,
        boxShadow: `0 0 10px ${player.color}, inset 0 0 8px ${player.color}`,
        borderRadius: '50%',
        zIndex: 0,
        opacity: 0.85,
        animation: 'ringPulse 2s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes pawnFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.18); opacity: 0.95; }
        }
      `}</style>
    </div>
  );
}
