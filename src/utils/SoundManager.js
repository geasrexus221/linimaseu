import clickSfx from '../assets/audio/click.wav';
import successSfx from '../assets/audio/success.mp3';
import whooshSfx from '../assets/audio/whoosh.mp3';
import { useStore } from '../store/useStore';
import errorSfx from '../assets/audio/error.wav';
import chestOpenSfx from '../assets/audio/chest open.wav';
import popSfx from '../assets/audio/pop.mp3';
import squasbSfx from '../assets/audio/squasb.mp3';
import wrongSfx from '../assets/audio/blink.mp3';
import hitSfx from '../assets/audio/hit.mp3';
import correctSfx from '../assets/audio/correct.mp3';

// Dice SFX
import diceRollSfx from '../assets/audio/dice/rolling dice.mp3';
import dice1Sfx from '../assets/audio/dice/satu.mp3';
import dice2Sfx from '../assets/audio/dice/dua.mp3';
import dice3Sfx from '../assets/audio/dice/tiga.mp3';
import dice4Sfx from '../assets/audio/dice/empat.mp3';
import dice5Sfx from '../assets/audio/dice/lima.mp3';
import dice6Sfx from '../assets/audio/dice/enam.mp3';

const SFX_URLS = {
  click: clickSfx,
  success: successSfx,
  whoosh: whooshSfx,
  error: errorSfx,
  chest_open: chestOpenSfx,
  node_pop: popSfx,
  squash: squasbSfx,
  wrong: wrongSfx,
  hit: hitSfx,
  correct: correctSfx,
  heal: successSfx,
  dice_roll: diceRollSfx,
  dice_1: dice1Sfx,
  dice_2: dice2Sfx,
  dice_3: dice3Sfx,
  dice_4: dice4Sfx,
  dice_5: dice5Sfx,
  dice_6: dice6Sfx
};

class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.initialized = false;

    // Create persistent audio objects
    if (typeof window !== 'undefined') {
      Object.entries(SFX_URLS).forEach(([name, url]) => {
        this.sounds[name] = new Audio(url);
        this.sounds[name].preload = 'auto';
      });
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // "Prime" all sounds with a play/pause to unlock them for later use in setTimeouts
    Object.values(this.sounds).forEach(audio => {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {
        // This is expected before user interaction
      });
    });

    console.log("🔊 SoundManager: Audio Unlocked & Primed");
  }

  play(name, volume = 0.5) {
    if (!this.enabled) return;
    const audio = this.sounds[name];

    if (!audio) {
      console.warn(`🔊 SoundManager: Sound "${name}" not found`);
      return;
    }

    try {
      audio.currentTime = 0;
      
      // Sync volume with global store's sfxVolume
      let globalSfxVolume = 1;
      try {
        globalSfxVolume = useStore.getState().sfxVolume;
      } catch (e) {}
      
      audio.volume = volume * globalSfxVolume;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error(`🔊 SoundManager: Failed to play "${name}"`, error);
        });
      }
    } catch (error) {
      console.error(`🔊 SoundManager: Error playing "${name}"`, error);
    }
  }
}

export const soundManager = new SoundManager();
