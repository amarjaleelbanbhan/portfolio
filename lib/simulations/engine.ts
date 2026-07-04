/**
 * CODEX INFINITUM — shared simulation tick engine (Phase 10.0).
 * One requestAnimationFrame loop, reused by every canvas simulation, so each
 * simulation component only writes its own draw function — not its own RAF
 * plumbing. Tier-gated frame rate (lib/deviceTier.ts), auto-pause when the
 * tab is hidden, and a manual pause/resume for the step transport controls.
 */

import type { DeviceTier } from "@/lib/deviceTier";

export interface TickInfo {
  /** ms since the previous tick */
  dt: number;
  /** ms since the engine started */
  elapsed: number;
  frame: number;
}

export type TickFn = (info: TickInfo) => void;

export interface TickEngine {
  resume: () => void;
  pause: () => void;
  stop: () => void;
  isPaused: () => boolean;
}

/** Skip this many frames between ticks, per device tier. Tier 0 never ticks — callers should draw a single static frame instead. */
const FRAME_SKIP: Record<DeviceTier, number> = { 0: -1, 1: 1, 2: 0 };

export function startTickEngine(tick: TickFn, tier: DeviceTier): TickEngine {
  const skip = FRAME_SKIP[tier];
  let raf = 0;
  let paused = skip < 0;
  let last = 0;
  let elapsed = 0;
  let frame = 0;

  function loop(now: number) {
    raf = requestAnimationFrame(loop);
    if (paused) {
      last = now;
      return;
    }
    if (skip > 0 && frame % (skip + 1) !== 0) {
      frame++;
      return;
    }
    const dt = last ? now - last : 16.7;
    last = now;
    elapsed += dt;
    tick({ dt, elapsed, frame });
    frame++;
  }

  function onVisibility() {
    if (document.hidden) paused = true;
    else if (skip >= 0) paused = false;
  }
  document.addEventListener("visibilitychange", onVisibility);
  raf = requestAnimationFrame(loop);

  return {
    resume: () => {
      if (skip >= 0) paused = false;
    },
    pause: () => {
      paused = true;
    },
    stop: () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    },
    isPaused: () => paused,
  };
}
