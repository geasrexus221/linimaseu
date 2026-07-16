import { useStore } from '../../../../store/useStore';


import moveSfx from '../../../../assets/game/sfx/move.mp3';
import landSfx from '../../../../assets/game/sfx/land.mp3';
import eventOpenSfx from '../../../../assets/game/sfx/event_open.mp3';
import winSfx from '../../../../assets/game/sfx/win.mp3';
import loseSfx from '../../../../assets/game/sfx/lose.mp3';
import attackSfx from '../../../../assets/game/sfx/attack.wav';
import cardGetSfx from '../../../../assets/game/sfx/card_get.wav';
import cardUseSfx from '../../../../assets/game/sfx/card_use.wav';
import turnStartSfx from '../../../../assets/game/sfx/turn_start.mp3';
import buttonSfx from '../../../../assets/game/sfx/button.mp3';


import diceRollSfx from '../../../../assets/audio/dice/rolling dice.mp3';
import dice1Sfx from '../../../../assets/audio/dice/satu.mp3';
import dice2Sfx from '../../../../assets/audio/dice/dua.mp3';
import dice3Sfx from '../../../../assets/audio/dice/tiga.mp3';
import dice4Sfx from '../../../../assets/audio/dice/empat.mp3';
import dice5Sfx from '../../../../assets/audio/dice/lima.mp3';
import dice6Sfx from '../../../../assets/audio/dice/enam.mp3';


import adventureTheme from '../../../../assets/game/music/Pixel Picnic Parade.mp3';
import squasbSfx from '../../../../assets/audio/squasb.mp3';
import glassSfx from '../../../../assets/audio/glass.mp3';
import hitSfx from '../../../../assets/audio/hit.mp3';
import blinkSfx from '../../../../assets/audio/blink.mp3';
import correctSfx from '../../../../assets/audio/correct.mp3';
import clickSfx from '../../../../assets/audio/click.wav';
import successSfx from '../../../../assets/audio/success.mp3';


class SoundEngine {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.initialized = false;
  }

  get soundList() {
    return {
      move: moveSfx,
      land: landSfx,
      dice_roll: diceRollSfx,
      dice_1: dice1Sfx,
      dice_2: dice2Sfx,
      dice_3: dice3Sfx,
      dice_4: dice4Sfx,
      dice_5: dice5Sfx,
      dice_6: dice6Sfx,
      event_open: eventOpenSfx,
      win: winSfx,
      lose: loseSfx,
      attack: attackSfx,
      card_get: cardGetSfx,
      card_use: cardUseSfx,
      turn_start: turnStartSfx,
      button: buttonSfx,
      squash: squasbSfx,
      glass: glassSfx,
      hit: hitSfx,
      blink: blinkSfx,
      correct: correctSfx,
      click: clickSfx,
      success: successSfx,
    };
  }

  init() {
    if (this.initialized) return;
    
    
    Object.entries(this.soundList).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.sounds[key] = audio;
    });

    this.initialized = true;
    console.log('[SoundEngine] Initialized with dynamic src/assets paths');
  }

  
  playSound(key) {
    const { soundEnabled, sfxVolume } = useStore.getState();
    if (!soundEnabled) return;

    
    const url = this.soundList[key];
    if (url) {
      const audio = new Audio(url);
      audio.volume = sfxVolume ?? 0.7;
      audio.play().catch(e => {
        console.warn(`[SoundEngine] Playback blocked for SFX: ${key}. Interaction may be needed.`);
      });
    } else {
      console.warn(`[SoundEngine] Sound key not found: ${key}`);
    }
  }

  
  playDiceResult(value) {
    this.playSound(`dice_${value}`);
  }

  
  playMusic(url) {
    const { soundEnabled, musicVolume } = useStore.getState();
    const musicUrl = url || adventureTheme;
    
    if (this.music) {
      this.music.pause();
    }

    this.music = new Audio(musicUrl);
    this.music.loop = true;
    this.music.volume = musicVolume ?? 0.5;
    
    if (soundEnabled) {
      this.music.play().catch(e => {
        console.warn('[SoundEngine] Music autoplay blocked by browser. Interaction required.');
      });
    }
  }

  
  syncSettings() {
    const { musicVolume, soundEnabled } = useStore.getState();
    if (this.music) {
      this.music.volume = musicVolume ?? 0.5;
      if (!soundEnabled) {
        this.music.pause();
      } else if (this.music.paused) {
        this.music.play().catch(() => {});
      }
    }
  }

  stopMusic() {
    if (this.music) {
      this.music.pause();
      this.music = null;
    }
  }
}

export const soundEngine = new SoundEngine();
