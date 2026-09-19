/**
 * Device capability tier, as React state.
 *
 * Wraps lib/deviceTier.ts (salvaged from Codex Infinitum, classified KEEP —
 * see docs/portfolio-2026/codex-salvage-audit.md). That module is a synchronous
 * SSR-safe heuristic; this adds the client/server split and the reduced-motion
 * interaction, which is what every animated surface actually needs.
 *
 *   2 — full effects: WebGL scenes, full particle budget
 *   1 — reduced: fewer particles, simplified geometry, frame skipping
 *   0 — minimal: no WebGL, static frame instead of an animation loop
 *
 * Read through useSyncExternalStore rather than an effect that calls setState.
 * Device capability never changes for the life of the page, so there is nothing
 * to subscribe to — the server snapshot reports the optimistic default and the
 * client snapshot reports the measured truth, which is exactly the contract
 * useSyncExternalStore exists for. It is also the pattern lib/routeChrome.js
 * already uses, and the project's lint rules reject the effect version.
 */
import { useSyncExternalStore } from 'react';
import { quickDeviceTier, supportsWebGL, particleBudget } from '@/lib/deviceTier';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';

// Measured once per page load and cached, so every consumer gets the same
// referentially-stable snapshot and the WebGL probe runs once, not per render.
let cached = null;

function readCapabilities() {
  if (!cached) {
    cached = { tier: quickDeviceTier(), webgl: supportsWebGL(), ready: true };
  }
  return cached;
}

// Capability is fixed for the page's lifetime; there is no change to subscribe to.
const noopSubscribe = () => () => {};
const SERVER_SNAPSHOT = { tier: 2, webgl: true, ready: false };
const getServerSnapshot = () => SERVER_SNAPSHOT;

export default function useDeviceTier() {
  const { tier, webgl, ready } = useSyncExternalStore(
    noopSubscribe,
    readCapabilities,
    getServerSnapshot
  );
  const reducedMotion = usePrefersReducedMotion();

  // Reduced motion is a stated preference, not a capability guess, so it wins
  // over the heuristic: drop to the static tier regardless of hardware.
  const effectiveTier = reducedMotion ? 0 : tier;

  return {
    tier: effectiveTier,
    /** Raw hardware tier, ignoring the motion preference. */
    hardwareTier: tier,
    /** False during SSR and the first client render. */
    ready,
    webgl,
    reducedMotion,
    /** Multiplier for particle counts and similar budgets. */
    budget: particleBudget(effectiveTier),
    /** True when a continuous animation loop is appropriate at all. */
    shouldAnimate: effectiveTier > 0,
  };
}
