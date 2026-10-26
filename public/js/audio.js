// Sanjeevani-ID: Zero-Dependency Web Audio API Sound Synthesizer
// 100% Code-based • Zero external MP3 files • Works offline

let audioCtx = null;
let soundEnabled = true;
let activeSirenOsc1 = null;
let activeSirenOsc2 = null;
let activeSirenGain = null;
let sirenInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const SoundSystem = {
  isEnabled() {
    return soundEnabled;
  },

  toggle() {
    soundEnabled = !soundEnabled;
    if (!soundEnabled) {
      this.stopSiren();
    }
    return soundEnabled;
  },

  playClick() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio click error:', e);
    }
  },

  playAlertBeep() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.warn('Audio alert error:', e);
    }
  },

  playSuccessChime() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major Triad + Octave)

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.001, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.85);
      });
    } catch (e) {
      console.warn('Audio success chime error:', e);
    }
  },

  playSiren(durationSeconds = 12) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      this.stopSiren();

      const now = ctx.currentTime;
      activeSirenOsc1 = ctx.createOscillator();
      activeSirenGain = ctx.createGain();

      activeSirenOsc1.type = 'sawtooth';
      activeSirenOsc1.frequency.setValueAtTime(650, now);

      activeSirenGain.gain.setValueAtTime(0.22, now);

      // Lowpass filter for emergency medical siren warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);

      activeSirenOsc1.connect(filter);
      filter.connect(activeSirenGain);
      activeSirenGain.connect(ctx.destination);

      activeSirenOsc1.start();

      let high = false;
      sirenInterval = setInterval(() => {
        if (!activeSirenOsc1 || !ctx) return;
        high = !high;
        const targetFreq = high ? 920 : 650;
        activeSirenOsc1.frequency.exponentialRampToValueAtTime(targetFreq, ctx.currentTime + 0.4);
      }, 500);

      // Auto-stop after duration
      setTimeout(() => {
        this.stopSiren();
      }, durationSeconds * 1000);

    } catch (e) {
      console.warn('Audio siren error:', e);
    }
  },

  stopSiren() {
    if (sirenInterval) {
      clearInterval(sirenInterval);
      sirenInterval = null;
    }
    if (activeSirenOsc1) {
      try {
        activeSirenOsc1.stop();
        activeSirenOsc1.disconnect();
      } catch (e) {}
      activeSirenOsc1 = null;
    }
    if (activeSirenGain) {
      try {
        activeSirenGain.disconnect();
      } catch (e) {}
      activeSirenGain = null;
    }
  }
};

window.SoundSystem = SoundSystem;
