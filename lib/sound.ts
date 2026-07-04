/**
 * CODEX INFINITUM — Synthesized Cyberpunk Sound Design Engine
 *
 * Pure Web Audio API synthesizer. Zero external dependencies.
 * Silent by default (soundEnabled=false) for WCAG 1.4.2 compliance.
 * All synthesis is procedural — no audio files required.
 *
 * Sound palette:
 *  typewriterClick  — brief percussive tick for terminal/avatar typewriter
 *  powerIgnition    — deep sub-bass reactor core ignition thud
 *  cinematicSweep   — rising filtered noise dive/sweep for zoom transitions
 *  realmHover       — soft mid-frequency ping for map node hover
 *  realmSelect      — crisp metallic click for node selection
 *  signatureAction  — energetic tri-tone burst for signature interactions
 *  journeyComplete  — triumphant ascending chime cascade for journey finish
 */

let _ctx: AudioContext | null = null;

/** Lazily initializes (or resumes) the AudioContext on first user interaction. */
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_ctx) {
    try {
      _ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (_ctx.state === "suspended") {
    _ctx.resume().catch(() => {});
  }
  return _ctx;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function masterGain(ctx: AudioContext, volume: number): GainNode {
  const g = ctx.createGain();
  g.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), ctx.currentTime);
  g.connect(ctx.destination);
  return g;
}

function envelope(
  gain: GainNode,
  ctx: AudioContext,
  attack: number,
  sustain: number,
  release: number,
  peak = 1,
) {
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peak, now + attack);
  gain.gain.setValueAtTime(peak, now + attack + sustain);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + sustain + release);
}

// ─── Individual sound synthesizers ───────────────────────────────────────────

/**
 * A brief percussive click — used for every typewriter character.
 * Very short (< 8ms), so it doesn't blur fast typing.
 */
function _typewriterClick(ctx: AudioContext, vol: number) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.012, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 6);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;

  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 3800;
  bp.Q.value = 1.8;

  const g = ctx.createGain();
  g.gain.setValueAtTime(vol * 0.22, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.014);

  src.connect(bp);
  bp.connect(g);
  g.connect(ctx.destination);
  src.start();
}

/**
 * Deep sub-bass ignition thud with a short harmonic overtone — reactor core.
 * Used when the cinematic camera power node is first clicked.
 */
function _powerIgnition(ctx: AudioContext, vol: number) {
  const now = ctx.currentTime;

  // Sub sine punch
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(60, now);
  osc.frequency.exponentialRampToValueAtTime(28, now + 0.18);

  const oscGain = ctx.createGain();
  envelope(oscGain, ctx, 0.004, 0.06, 0.22, vol * 0.7);

  // Harmonic click transient
  const click = ctx.createOscillator();
  click.type = "triangle";
  click.frequency.setValueAtTime(320, now);
  click.frequency.exponentialRampToValueAtTime(80, now + 0.04);

  const clickGain = ctx.createGain();
  envelope(clickGain, ctx, 0.001, 0.01, 0.06, vol * 0.35);

  // Noise burst
  const nBuf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
  const nd = nBuf.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  const nSrc = ctx.createBufferSource();
  nSrc.buffer = nBuf;

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 280;

  const nGain = ctx.createGain();
  envelope(nGain, ctx, 0.001, 0.02, 0.06, vol * 0.18);

  osc.connect(oscGain); oscGain.connect(ctx.destination);
  click.connect(clickGain); clickGain.connect(ctx.destination);
  nSrc.connect(lp); lp.connect(nGain); nGain.connect(ctx.destination);

  osc.start(now); osc.stop(now + 0.5);
  click.start(now); click.stop(now + 0.12);
  nSrc.start(now);
}

/**
 * Rising filtered noise sweep — cinematic zoom warp-dive.
 * Duration ~1.4s; used when the 3D camera zooms into a realm.
 */
function _cinematicSweep(ctx: AudioContext, vol: number) {
  const dur = 1.4;
  const now = ctx.currentTime;

  const nBuf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const nd = nBuf.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  const nSrc = ctx.createBufferSource();
  nSrc.buffer = nBuf;

  // Bandpass sweep rising through the frequency spectrum
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(120, now);
  bp.frequency.exponentialRampToValueAtTime(3400, now + dur * 0.8);
  bp.Q.value = 2.2;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(vol * 0.55, now + 0.12);
  g.gain.setValueAtTime(vol * 0.55, now + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  // Pitch-descending sub tone (warp feel)
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(55, now);
  osc.frequency.exponentialRampToValueAtTime(18, now + dur);

  const oscG = ctx.createGain();
  envelope(oscG, ctx, 0.05, dur * 0.6, dur * 0.3, vol * 0.3);

  nSrc.connect(bp); bp.connect(g); g.connect(ctx.destination);
  osc.connect(oscG); oscG.connect(ctx.destination);

  nSrc.start(now);
  osc.start(now); osc.stop(now + dur + 0.1);
}

/**
 * Soft sine ping — realm map node hover.
 * 14ms, very gentle.
 */
function _realmHover(ctx: AudioContext, vol: number) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);

  const g = ctx.createGain();
  envelope(g, ctx, 0.004, 0.02, 0.12, vol * 0.12);

  osc.connect(g); g.connect(ctx.destination);
  osc.start(now); osc.stop(now + 0.2);
}

/**
 * Metallic click with harmonic ring — realm node selection.
 */
function _realmSelect(ctx: AudioContext, vol: number) {
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 340;

  const g = ctx.createGain();
  envelope(g, ctx, 0.002, 0.01, 0.18, vol * 0.28);

  osc.connect(hp); hp.connect(g); g.connect(ctx.destination);
  osc.start(now); osc.stop(now + 0.25);
}

/**
 * Energetic tri-tone burst — signature action (SEND PACKET, CREATE CODE, etc).
 * Three staggered tones, cyberpunk feel.
 */
function _signatureAction(ctx: AudioContext, vol: number) {
  const now = ctx.currentTime;
  const freqs = [330, 440, 660];
  const delays = [0, 0.055, 0.11];

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, now + delays[i]);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1200;
    lp.Q.value = 1.4;

    const g = ctx.createGain();
    const t0 = now + delays[i];
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol * 0.22, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);

    osc.connect(lp); lp.connect(g); g.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + 0.3);
  });
}

/**
 * Triumphant ascending chime cascade — master journey completion.
 * 8-note arpeggio over ~1.6s with a rich reverb-like decay.
 */
function _journeyComplete(ctx: AudioContext, vol: number) {
  const now = ctx.currentTime;
  // Pentatonic major arpeggio (C5 pentatonic)
  const notes = [523.25, 659.25, 783.99, 1046.5, 1174.66, 1318.51, 1567.98, 2093];
  const step = 0.16;

  notes.forEach((freq, i) => {
    const t = now + i * step;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);

    // Slight overtone
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2.01, t);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol * (0.35 - i * 0.02), t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6 + i * 0.04);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0, t);
    g2.gain.linearRampToValueAtTime(vol * 0.08, t + 0.01);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);

    osc.connect(g); g.connect(ctx.destination);
    osc2.connect(g2); g2.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.8);
    osc2.start(t); osc2.stop(t + 0.5);
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Throttle tracker for hover sounds (prevents rapid-fire on mouse-move). */
let _lastHoverAt = 0;

export const sound = {
  /** Call on first user gesture to unlock the AudioContext. */
  unlock() {
    getCtx();
  },

  typewriterClick(enabled: boolean, vol = 0.6) {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    _typewriterClick(ctx, vol);
  },

  powerIgnition(enabled: boolean, vol = 0.8) {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    _powerIgnition(ctx, vol);
  },

  cinematicSweep(enabled: boolean, vol = 0.7) {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    _cinematicSweep(ctx, vol);
  },

  realmHover(enabled: boolean, vol = 0.5) {
    if (!enabled) return;
    // Throttle: at most once every 80ms
    const now = performance.now();
    if (now - _lastHoverAt < 80) return;
    _lastHoverAt = now;
    const ctx = getCtx();
    if (!ctx) return;
    _realmHover(ctx, vol);
  },

  realmSelect(enabled: boolean, vol = 0.65) {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    _realmSelect(ctx, vol);
  },

  signatureAction(enabled: boolean, vol = 0.7) {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    _signatureAction(ctx, vol);
  },

  journeyComplete(enabled: boolean, vol = 0.65) {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    _journeyComplete(ctx, vol);
  },
};
