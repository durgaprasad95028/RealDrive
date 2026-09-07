// Synthesized Automotive Web Audio Engine
class AudioService {
  private ctx: AudioContext | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private isEngineRunning: boolean = false;
  private isMuted: boolean = false;
  private masterGainNode: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGainNode = this.ctx.createGain();
        this.masterGainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.masterGainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(muted ? 0 : 0.3, this.ctx.currentTime);
    }
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGainNode) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio fallback
    }
  }

  public playBlinker() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGainNode) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch {}
  }

  public playGearShift() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGainNode) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {}
  }

  public playCash() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGainNode) return;

      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.15, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGainNode!);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.16);
      });
    } catch {}
  }

  public playAlert() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGainNode) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.setValueAtTime(440, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {}
  }

  public startEngine(initialRpm: number = 900) {
    if (this.isMuted || this.isEngineRunning) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGainNode) return;

      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();

      this.engineOsc.type = 'sawtooth';
      const freq = 30 + (initialRpm / 1000) * 25;
      this.engineOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      this.engineGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.engineOsc.connect(this.engineGain);
      this.engineGain.connect(this.masterGainNode);

      this.engineOsc.start();
      this.isEngineRunning = true;
    } catch {}
  }

  public updateEngineRpm(rpm: number) {
    if (!this.isEngineRunning || !this.engineOsc || !this.ctx || this.isMuted) return;
    try {
      const baseFreq = 28 + (rpm / 1000) * 32;
      this.engineOsc.frequency.setTargetAtTime(baseFreq, this.ctx.currentTime, 0.05);
    } catch {}
  }

  public stopEngine() {
    if (!this.isEngineRunning) return;
    try {
      if (this.engineOsc && this.ctx) {
        this.engineGain?.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.08);
        setTimeout(() => {
          try {
            this.engineOsc?.stop();
            this.engineOsc?.disconnect();
            this.engineGain?.disconnect();
          } catch {}
          this.engineOsc = null;
          this.engineGain = null;
          this.isEngineRunning = false;
        }, 100);
      }
    } catch {
      this.isEngineRunning = false;
    }
  }
}

export const audioService = new AudioService();
