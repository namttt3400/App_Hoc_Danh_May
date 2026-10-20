/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SoundSwitchType } from '../types';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private switchType: SoundSwitchType = 'blue';
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSwitchType(type: SoundSwitchType) {
    this.switchType = type;
  }

  public getSwitchType(): SoundSwitchType {
    return this.switchType;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public playKeyClick(combo: number = 0) {
    if (this.switchType === 'off') return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (this.switchType === 'blue') {
      // Mechanical Clicky switch (Cherry MX Blue)
      // High click burst + subtle housing resonance
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2800 + Math.random() * 200, now);
      filter.Q.setValueAtTime(3.5, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.035);

      gain.gain.setValueAtTime(0.4 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);

      // Bottom out thud
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(180, now + 0.005);
      thudOsc.frequency.exponentialRampToValueAtTime(60, now + 0.035);
      thudGain.gain.setValueAtTime(0.2 * this.volume, now + 0.005);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thudOsc.start(now + 0.005);
      thudOsc.stop(now + 0.045);

    } else if (this.switchType === 'brown') {
      // Tactile Thock (Cherry MX Brown / Gateron Yellow)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 + Math.random() * 30, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

      gain.gain.setValueAtTime(0.35 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.065);

    } else if (this.switchType === 'bubble') {
      // Cheerful bubble pop with combo pitch ramp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const pitchOffset = Math.min(600, combo * 12);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450 + pitchOffset, now);
      osc.frequency.exponentialRampToValueAtTime(750 + pitchOffset, now + 0.04);

      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    }
  }

  public playError() {
    if (this.switchType === 'off') return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.09);

    gain.gain.setValueAtTime(0.25 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playComboStreak(streak: number) {
    if (this.switchType === 'off' || streak % 10 !== 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const noteIdx = Math.min(notes.length - 1, Math.floor(streak / 10) - 1);
    const freq = notes[noteIdx];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.25 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playSuccessChime() {
    if (this.switchType === 'off') return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C high
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const startTime = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.22 * this.volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  }
}

export const soundManager = new SoundSynthesizer();
