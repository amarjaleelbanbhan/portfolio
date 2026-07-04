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
  /** Dimmer overlay shown during the anticipation beat (optional — Phase 1.1). */
  dimmer?: HTMLElement | null;
  /** Small point of light at the click location (optional — Phase 1.1). */
  spark?: HTMLElement | null;
  /** Skip/shorten the anticipation beat's movement (reduced motion). */
  reduced?: boolean;
}

/**
 * Build the "dive into the machine" timeline.
 *
 * Act 0 (0–0.4s):   Anticipation beat — screen dims to near-black, a single
 *                   small point of light holds at the click location. The
 *                   held breath before the breath (doc: "power-on anticipation").
 * Act 1 (0.4–0.65s): Stage breathes IN — a slight contract before the lunge,
 *                   like drawing breath before the plunge.
 * Act 2 (0.65–2.4s): Stage surges forward — scale grows to 5×, opacity drops
 *                   to zero, as if the camera crashes through the circuit board.
 * Act 3 (2.2–2.6s): White flash fills the screen — the "heat" of impact;
 *                   it fades back to void in BootTerminal's entry animation.
 *
 * Total duration: ~2.65s (deliberately short — this is a cut, not a load screen).
 */
export function buildDiveTimeline({
  stage,
  flash,
  onComplete,
  dimmer,
  spark,
  reduced = false,
}: DiveOptions): gsap.core.Timeline {
  const tl = gsap.timeline({ onComplete });

  // Act 0: anticipation beat — dim to near-black, hold a single spark of light.
  // Held beat is preserved even under reduced motion; only the movement (scale)
  // in Acts 1–2 is shortened/skipped there (handled by the caller via `reduced`).
  if (dimmer || spark) {
    const beatDuration = reduced ? 0.3 : 0.45;
    if (dimmer) {
      tl.to(dimmer, { opacity: 1, duration: beatDuration * 0.5, ease: "power1.in" }, 0);
    }
    if (spark) {
      tl.fromTo(
        spark,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: beatDuration * 0.6, ease: "power2.out" },
        0
      ).to(spark, { opacity: 0, duration: beatDuration * 0.3, ease: "power1.in" }, beatDuration * 0.6);
    }
    if (dimmer) {
      tl.to(dimmer, { opacity: 0, duration: 0.2, ease: "power1.out" }, beatDuration);
    }
  }

  const actsStart = dimmer || spark ? (reduced ? 0.3 : 0.45) : 0;

  return tl.to(stage, {
    // Act 1: contract (the held breath)
    scale: 0.92,
    duration: 0.22,
    ease: "power2.in",
  }, actsStart).to(stage, {
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
  }, actsStart + 1.72); // overlaps the end of Act 2
}

/**
 * Reduced-motion path: no animation — instant cut to the boot terminal.
 * Matches the existing pattern in BootSequence/PowerCore/RealmSimulationStage.
 * A tiny delay lets the PowerCore's own click CSS register before the swap.
 */
export function reducedMotionDive(onComplete: () => void): void {
  setTimeout(onComplete, 60);
}
