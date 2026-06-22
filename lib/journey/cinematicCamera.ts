/**
 * CODEX INFINITUM — CinematicCamera GSAP helpers
 * Canon: CINEMATIC_LAYER_PLAN.md §1.3
 *
 * Pure functions — no React, no DOM querying. Passed element refs by callers.
 * Mirrors the pattern in lib/simulations/engine.ts (pure runtime, separate from UI).
 *
 * The "shrink into the machine" push: a 2-act GSAP timeline using only
 * CSS 2D transforms (scale + opacity) and a composited white-flash overlay.
 * No new WebGL context, no 3D perspective — the "depth" comes from scale + timing.
 */

import gsap from "gsap";

export interface DiveOptions {
  /** The inner stage (power button + cue) to push forward (zoom in). */
  stage: HTMLElement;
  /** The full-screen white-flash overlay to reveal at the peak of the dive. */
  flash: HTMLElement;
  /** Called when the timeline finishes — triggers JourneyDirector phase change. */
  onComplete: () => void;
}

/**
 * Build the "dive into the machine" timeline.
 *
 * Act 1 (0–0.25s):  Stage breathes IN — a slight contract before the lunge,
 *                   like drawing breath before the plunge.
 * Act 2 (0.25–2.0s): Stage surges forward — scale grows to 5×, opacity drops
 *                   to zero, as if the camera crashes through the circuit board.
 * Act 3 (1.8–2.2s): White flash fills the screen — the "heat" of impact;
 *                   it fades back to void in BootTerminal's entry animation.
 *
 * Total duration: ~2.25s (deliberately short — this is a cut, not a load screen).
 */
export function buildDiveTimeline({ stage, flash, onComplete }: DiveOptions): gsap.core.Timeline {
  return gsap.timeline({ onComplete }).to(stage, {
    // Act 1: contract (the held breath)
    scale: 0.92,
    duration: 0.22,
    ease: "power2.in",
  }).to(stage, {
    // Act 2: surge forward through the circuit
    scale: 6,
    opacity: 0,
    duration: 1.6,
    ease: "power3.in",
  }).to(flash, {
    // Act 3: white-hot impact flash
    opacity: 1,
    duration: 0.28,
    ease: "power2.out",
  }, 1.72); // overlaps the end of Act 2
}

/**
 * Reduced-motion path: no animation — instant cut to the boot terminal.
 * Matches the existing pattern in BootSequence/PowerCore/RealmSimulationStage.
 * A tiny delay lets the PowerCore's own click CSS register before the swap.
 */
export function reducedMotionDive(onComplete: () => void): void {
  setTimeout(onComplete, 60);
}
