/**
 * WebAudioEngine — Procedural Real-Time Automotive Sound Synthesizer for RealDrive 3D
 * Generates cylinder firing pulses, intake resonance, exhaust harmonics, turbo spool, BOV venting, gear whine, and tire skids.
 */

export type EngineSoundProfile =
  | 'V8_AMERICAN_MUSCLE'
  | 'V10_HIGH_REV_SUPERCAR'
  | 'V12_EXOTIC_SYMPHONY'
  | 'INLINE_6_TURBO_JDM'
  | 'INLINE_4_TUNER'
  | 'ROTARY_WANKEL'
  | 'HEAVY_DIESEL_TRUCK'
  | 'ELECTRIC_EV_SYNTH';

export class WebAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Engine audio nodes
  private engineGain: GainNode | null = null;
  private oscBase: OscillatorNode | null = null;
  private oscSub: OscillatorNode | null = null;
  private oscHarmonic: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;

  // Turbo nodes
  private turboGain: GainNode | null = null;
  private turboOsc: OscillatorNode | null = null;
  private bovNoiseNode: AudioBufferSourceNode | null = null;

  // Transmission gear whine
  private gearGain: GainNode | null = null;
  private gearOsc: OscillatorNode | null = null;

  // Tire skid noise
  private tireNoiseNode: AudioBufferSourceNode | null = null;
  private tireGain: GainNode | null = null;
  private tireFilter: BiquadFilterNode | null = null;

  // Police Siren
  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private isSirenPlaying: boolean = false;

  private soundProfile: EngineSoundProfile = 'V8_AMERICAN_MUSCLE';
  private prevThrottle: number = 0;

  constructor(profile: EngineSoundProfile = 'V8_AMERICAN_MUSCLE') {
    this.soundProfile = profile;
  }

  public initialize(): void {
    if (this.ctx) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupEngineSynthesis();
      this.setupTurboSynthesis();
      this.setupGearWhineSynthesis();
      this.setupTireNoiseSynthesis();
      this.setupSirenSynthesis();
    } catch (e) {
      console.warn('Web Audio API not supported or user gesture needed:', e);
    }
  }

  private setupEngineSynthesis(): void {
    if (!this.ctx || !this.masterGain) return;

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
    this.engineFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    // Base fundamental cylinder pulse
    this.oscBase = this.ctx.createOscillator();
    this.oscBase.type = 'sawtooth';
    this.oscBase.frequency.setValueAtTime(45, this.ctx.currentTime);

    // Deep sub-harmonic rumble
    this.oscSub = this.ctx.createOscillator();
    this.oscSub.type = 'triangle';
    this.oscSub.frequency.setValueAtTime(22.5, this.ctx.currentTime);

    // High frequency exhaust rasp
    this.oscHarmonic = this.ctx.createOscillator();
    this.oscHarmonic.type = 'square';
    this.oscHarmonic.frequency.setValueAtTime(90, this.ctx.currentTime);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.oscSub.connect(subGain);

    const harmGain = this.ctx.createGain();
    harmGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.oscHarmonic.connect(harmGain);

    this.oscBase.connect(this.engineFilter);
    subGain.connect(this.engineFilter);
    harmGain.connect(this.engineFilter);

    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    this.oscBase.start();
    this.oscSub.start();
    this.oscHarmonic.start();
  }

  private setupTurboSynthesis(): void {
    if (!this.ctx || !this.masterGain) return;

    this.turboGain = this.ctx.createGain();
    this.turboGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.turboOsc = this.ctx.createOscillator();
    this.turboOsc.type = 'sine';
    this.turboOsc.frequency.setValueAtTime(1200, this.ctx.currentTime);

    this.turboOsc.connect(this.turboGain);
    this.turboGain.connect(this.masterGain);
    this.turboOsc.start();
  }

  private setupGearWhineSynthesis(): void {
    if (!this.ctx || !this.masterGain) return;

    this.gearGain = this.ctx.createGain();
    this.gearGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.gearOsc = this.ctx.createOscillator();
    this.gearOsc.type = 'triangle';
    this.gearOsc.frequency.setValueAtTime(300, this.ctx.currentTime);

    this.gearOsc.connect(this.gearGain);
    this.gearGain.connect(this.masterGain);
    this.gearOsc.start();
  }

  private setupTireNoiseSynthesis(): void {
    if (!this.ctx || !this.masterGain) return;

    // Generate white noise buffer for tire skids
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.tireNoiseNode = this.ctx.createBufferSource();
    this.tireNoiseNode.buffer = noiseBuffer;
    this.tireNoiseNode.loop = true;

    this.tireFilter = this.ctx.createBiquadFilter();
    this.tireFilter.type = 'bandpass';
    this.tireFilter.frequency.setValueAtTime(950, this.ctx.currentTime);
    this.tireFilter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    this.tireGain = this.ctx.createGain();
    this.tireGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.tireNoiseNode.connect(this.tireFilter);
    this.tireFilter.connect(this.tireGain);
    this.tireGain.connect(this.masterGain);
    this.tireNoiseNode.start();
  }

  private setupSirenSynthesis(): void {
    if (!this.ctx || !this.masterGain) return;

    this.sirenGain = this.ctx.createGain();
    this.sirenGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.sirenOsc = this.ctx.createOscillator();
    this.sirenOsc.type = 'sawtooth';
    this.sirenOsc.frequency.setValueAtTime(750, this.ctx.currentTime);

    this.sirenOsc.connect(this.sirenGain);
    this.sirenGain.connect(this.masterGain);
    this.sirenOsc.start();
  }

  /**
   * Updates synthesis parameters every frame from vehicle telemetry
   */
  public update(
    rpm: number,
    throttle: number,
    speedKmh: number,
    lateralSlip: number,
    boostPsi: number,
    isSirenActive: boolean = false
  ): void {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;

    // 1. Engine RPM frequency mapping
    // Firing frequency: (RPM / 60) * (cylinders / 2)
    let cylinders = 8;
    if (this.soundProfile === 'V10_HIGH_REV_SUPERCAR') cylinders = 10;
    else if (this.soundProfile === 'V12_EXOTIC_SYMPHONY') cylinders = 12;
    else if (this.soundProfile === 'INLINE_6_TURBO_JDM') cylinders = 6;
    else if (this.soundProfile === 'INLINE_4_TUNER') cylinders = 4;
    else if (this.soundProfile === 'ROTARY_WANKEL') cylinders = 3;

    const baseFreq = Math.max(20, (rpm / 60) * (cylinders / 2));

    if (this.oscBase) this.oscBase.frequency.setTargetAtTime(baseFreq, t, 0.04);
    if (this.oscSub) this.oscSub.frequency.setTargetAtTime(baseFreq * 0.5, t, 0.04);
    if (this.oscHarmonic) this.oscHarmonic.frequency.setTargetAtTime(baseFreq * 2.0, t, 0.04);

    // Throttle intake resonance opening
    if (this.engineFilter) {
      const filterCutoff = 400 + (rpm / 8000) * 1600 + throttle * 2200;
      this.engineFilter.frequency.setTargetAtTime(filterCutoff, t, 0.05);
    }

    // 2. Turbo spool whine
    if (this.turboOsc && this.turboGain) {
      const turboFreq = 1200 + (boostPsi / 25) * 4500;
      const turboVolume = Math.min(0.25, (boostPsi / 20) * 0.25 * throttle);
      this.turboOsc.frequency.setTargetAtTime(turboFreq, t, 0.08);
      this.turboGain.gain.setTargetAtTime(turboVolume, t, 0.05);
    }

    // 3. BOV Blow-Off Valve trigger on rapid throttle drop
    if (this.prevThrottle > 0.6 && throttle < 0.15 && boostPsi > 8.0) {
      this.playBlowOffValveWhoosh();
    }
    this.prevThrottle = throttle;

    // 4. Transmission gear whine
    if (this.gearOsc && this.gearGain) {
      const gearFreq = Math.max(120, Math.abs(speedKmh) * 18);
      const gearVol = Math.min(0.12, (Math.abs(speedKmh) / 250) * 0.12);
      this.gearOsc.frequency.setTargetAtTime(gearFreq, t, 0.05);
      this.gearGain.gain.setTargetAtTime(gearVol, t, 0.05);
    }

    // 5. Tire skid noise on high lateral slip
    if (this.tireGain) {
      const skidVol = Math.max(0, Math.min(0.4, (lateralSlip - 0.25) * 1.2));
      this.tireGain.gain.setTargetAtTime(skidVol, t, 0.03);
    }

    // 6. Police Siren modulation
    if (this.sirenOsc && this.sirenGain) {
      if (isSirenActive) {
        const sirenPhase = Math.sin(t * 3.5);
        const sirenFreq = 650 + (sirenPhase + 1) * 350; // oscillates between 650 Hz and 1350 Hz
        this.sirenOsc.frequency.setValueAtTime(sirenFreq, t);
        this.sirenGain.gain.setTargetAtTime(0.28, t, 0.1);
      } else {
        this.sirenGain.gain.setTargetAtTime(0.0, t, 0.1);
      }
    }
  }

  private playBlowOffValveWhoosh(): void {
    if (!this.ctx || !this.masterGain) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.45;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
      }

      const bovSource = this.ctx.createBufferSource();
      bovSource.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1800, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.32, this.ctx.currentTime);

      bovSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      bovSource.start();
    } catch (e) {
      // ignore
    }
  }

  public setSoundProfile(profile: EngineSoundProfile): void {
    this.soundProfile = profile;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public dispose(): void {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
