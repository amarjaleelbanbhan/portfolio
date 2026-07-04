/**
 * CODEX INFINITUM — Device Tier detection (doc 8 §Performance / doc 5 §8.2)
 *
 * Three first-class experience tiers:
 *   2 = Full Universe   (strong GPU)   — full R3F, particles, bloom
 *   1 = Standard        (mid-range)    — reduced particles, simplified 3D
 *   0 = Minimal         (weak/mobile)  — CSS+SVG 2D map, no WebGL
 *
 * A fast synchronous heuristic runs first (SSR-safe). A precise GPU probe via
 * @pmndrs/detect-gpu is loaded lazily in later phases to refine the tier.
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

/** Quick heuristic tier from memory + cores + WebGL (doc 8 getParticleBudget). */
export function quickDeviceTier(): DeviceTier {
  if (!isBrowser()) return 2; // assume capable on the server; refined on mount
  if (!supportsWebGL()) return 0;

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 4; // GB (Chromium only; default 4)
  const cores = navigator.hardwareConcurrency ?? 4;

  if (memory >= 8 && cores >= 8) return 2;
  if (memory >= 4 && cores >= 4) return 1;
  return 0;
}

/** Particle budget multiplier per tier (doc 8 §Particle Budget). */
export function particleBudget(tier: DeviceTier): number {
  return tier === 2 ? 1.0 : tier === 1 ? 0.5 : 0;
}
