/**
 * CODEX INFINITUM — Device Tier detection (doc 8 §Performance / doc 5 §8.2)
 *
 * Three first-class experience tiers:
 *   2 = Full Universe   (strong GPU)   — full R3F, particles, bloom
 *   1 = Standard        (mid-range)    — reduced particles, simplified 3D
 *   0 = Minimal         (weak/mobile)  — CSS+SVG 2D map, no WebGL
 *
 * A fast synchronous heuristic runs first, and is SSR-safe. It is also the
 * only probe: the plan to refine the tier with @pmndrs/detect-gpu was never
 * wired up through Phase 34, and the package was removed rather than left in
 * the manifest describing an intention. The heuristic below has been measured
 * against the real scenes and holds; if a precise GPU probe is wanted later,
 * it is a lazy import at the one call site.
 */

export type DeviceTier = 0 | 1 | 2;

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function prefersReducedMotion(): boolean {
  if (!isBrowser()) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function supportsWebGL(): boolean {
  if (!isBrowser()) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * True when the primary input is a finger, which is the most reliable signal
 * available that this is a phone or tablet rather than a desktop.
 */
export function isTouchPrimary(): boolean {
  if (!isBrowser()) return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/** Quick heuristic tier from memory + cores + WebGL (doc 8 getParticleBudget). */
export function quickDeviceTier(): DeviceTier {
  if (!isBrowser()) return 2; // assume capable on the server; refined on mount
  if (!supportsWebGL()) return 0;

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 4; // GB (Chromium only; default 4)
  const cores = navigator.hardwareConcurrency ?? 4;

  const tier: DeviceTier =
    memory >= 8 && cores >= 8 ? 2 : memory >= 4 && cores >= 4 ? 1 : 0;

  // A flagship phone reports eight cores and eight gigabytes and would land on
  // tier 2 — the same particle count and the same 2x device pixel ratio as a
  // desktop, on a GPU that is thermally limited and a battery that is not
  // plugged in. Cores are not the constraint on a phone; sustained power is.
  // Capping touch devices at tier 1 halves the particle field and the 3D pixel
  // ratio without removing either.
  if (tier === 2 && isTouchPrimary()) return 1;
  return tier;
}

/** Particle budget multiplier per tier (doc 8 §Particle Budget). */
export function particleBudget(tier: DeviceTier): number {
  return tier === 2 ? 1.0 : tier === 1 ? 0.5 : 0;
}
