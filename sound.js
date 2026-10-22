/**
 * ETHEREAL SOUND ENGINE (Web Audio API)
 * Zero external audio assets. Synthesizes celestial ambient crystal pads,
 * harmonic pentatonic chimes, and tactile spatial feedback.
 */

class EtherealSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.ambientGain = null;
    this.sfxGain = null;
    this.oscillators = [];
    this.chordFrequencies = [216, 288, 324, 432, 540, 648]; // 432Hz harmonic base
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.ctx = new AudioContext();

    // Master gains
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.sfxGain.connect(this.ctx.destination);
  }

  enable() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.enabled = true;
    this.startAmbientDrone();
  }

  disable() {
    this.enabled = false;
    this.stopAmbientDrone();
  }

  toggle() {
    if (this.enabled) {
      this.disable();
      return false;
    } else {
      this.enable();
      return true;
    }
  }

  startAmbientDrone() {
    if (!this.ctx || this.oscillators.length > 0) return;

    // Harmonic binaural ethereal chord: 216Hz & 432Hz
    const freqs = [108, 162, 216, 324, 432];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 1.5, this.ctx.currentTime);

      // Low pass filter with subtle LFO
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.015 / (idx + 1), this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      osc.start();
      this.oscillators.push({ osc, gain, filter });
    });
  }

  stopAmbientDrone() {
    this.oscillators.forEach(({ osc, gain }) => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
        setTimeout(() => osc.stop(), 850);
      } catch (e) {}
    });
    this.oscillators = [];
  }

  // Crystal Chime on Hovering Nodes / Interactive Elements
  playChime(noteIndex = 0) {
    if (!this.enabled || !this.ctx) return;

    const freq = this.chordFrequencies[noteIndex % this.chordFrequencies.length] * (noteIndex > 3 ? 1.5 : 1);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Exponential bell decay
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.25);
  }

  // Soft tactile glass click
  playClick() {
    if (!this.enabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(860, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Warp / Docking Sound effect
  playWarp() {
    if (!this.enabled || !this.ctx) return;
    this.playTopologyMorph(1);
  }

  // Dynamic filter modulation during orbit rotation
  modulateDrone(velocity = 0) {
    if (!this.enabled || !this.ctx || this.oscillators.length === 0) return;
    const clampedVel = Math.min(Math.max(velocity, 0), 1);
    const targetFreq = 450 + clampedVel * 1200;
    this.oscillators.forEach(({ filter }) => {
      try {
        filter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
      } catch (e) {}
    });
  }

  // Harmonic sweep when switching mathematical topologies
  playTopologyMorph(mode = 0) {
    if (!this.enabled || !this.ctx) return;
    const notes = [
      [216, 432, 648], // Torus: Perfect Fifth / Octave
      [270, 405, 540], // Lorenz: Dynamic Tritone / Major Third
      [324, 486, 720]  // Clifford: Ethereal Ninth
    ];
    const chord = notes[mode % notes.length];
    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq * 0.75, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + 0.35);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.09, this.ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.45);
    });
  }

  // Resonant chord for the Conceptionist Manifesto
  playManifesto() {
    if (!this.enabled || !this.ctx) return;
    const triad = [432, 540, 648, 864];
    triad.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.07, this.ctx.currentTime + idx * 0.08 + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.08 + 2.0);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 2.1);
    });
  }

  // 3D Spatialized Chime with stereo panning (-1.0 to 1.0)
  playSpatialChime(noteIndex = 0, pan = 0) {
    if (!this.enabled || !this.ctx) return;

    const freq = this.chordFrequencies[noteIndex % this.chordFrequencies.length] * (noteIndex > 3 ? 1.5 : 1);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    let outputNode = gain;
    if (this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-0.9, Math.min(0.9, pan)), this.ctx.currentTime);
      gain.connect(panner);
      outputNode = panner;
    }

    osc.connect(gain);
    outputNode.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.25);
  }

  // Subtle typewriter click for CLI terminal
  playKeyClick() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 + (Math.random() - 0.5) * 300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.035);
  }

  // Cryptographic Alert sound
  playAlert() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.setValueAtTime(165, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  // Spacetime Deconstruction: Granular microtonal phase dispersion
  playDeconstruct() {
    if (!this.enabled || !this.ctx) return;
    const freqs = [432, 417, 396, 312, 216, 108];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.45, this.ctx.currentTime + 1.8);

      gain.gain.setValueAtTime(0.08 / (idx + 1), this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

      if (this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime((idx / (freqs.length - 1)) * 1.8 - 0.9, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.sfxGain);
      } else {
        osc.connect(gain);
        gain.connect(this.sfxGain);
      }

      osc.start();
      osc.stop(this.ctx.currentTime + 1.85);
    });
  }

  // Spacetime Reconstruction: Gravitational collapse & ascending Pythagorean quintet
  playReconstruct() {
    if (!this.enabled || !this.ctx) return;
    // Sub-bass collapse
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(45, this.ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(144, this.ctx.currentTime + 0.6);
    subGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.7);
    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start();
    subOsc.stop(this.ctx.currentTime + 0.75);

    // Ascending radiant chime
    const chord = [432, 540, 648, 864, 1080];
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + 0.15 + idx * 0.08;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(startTime);
      osc.stop(startTime + 1.45);
    });
  }

  // Physical Ontological Regime Audio Signatures (1 to 9)
  playRegime(regimeIndex = 1) {
    if (!this.enabled || !this.ctx) return;
    const baseFreqs = {
      1: [216, 432, 648],         // Noether Symmetry
      2: [324, 486, 729],         // Gauge Light
      3: [108, 162, 243],         // Vacuum Zero-Point
      4: [288, 432, 576, 864],    // Feynman Action
      5: [270, 360, 540],         // Critical Tc
      6: [384, 576, 768],         // Soliton Winding
      7: [192, 288, 384, 576],    // Poincaré Disk
      8: [240, 360, 480, 720],    // Ryu-Takayanagi
      9: [432, 648, 864, 1296]    // Amplituhedron Jewel
    };
    const freqs = baseFreqs[regimeIndex] || [432, 648];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = this.ctx.currentTime + idx * 0.05;
      osc.type = regimeIndex === 3 ? 'sine' : (regimeIndex === 9 ? 'triangle' : 'sine');
      osc.frequency.setValueAtTime(freq, st);
      gain.gain.setValueAtTime(0.06 / (idx + 1), st);
      gain.gain.exponentialRampToValueAtTime(0.0001, st + 1.2);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(st);
      osc.stop(st + 1.25);
    });
  }
}

window.soundEngine = new EtherealSoundEngine();
