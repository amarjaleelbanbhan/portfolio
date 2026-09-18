import { useSyncExternalStore } from 'react';

/**
 * Which global chrome a route gets.
 *
 *   portfolio — full cinematic system (boot screen, particles, scanlines, scroll bar)
 *   client    — Amar Digital Systems pages; they ship their own self-contained
 *               design and must not inherit the portfolio's boot sequence
 *   admin     — plain control-center surface, no ambient effects at all
 *
 * Portfolio is the default so new public pages pick up the visual system
 * automatically.
 */
export function chromeFor(pathname) {
  if (pathname === '/studio/admin' || pathname.startsWith('/studio/admin/')) return 'admin';
  if (pathname === '/hire' || pathname === '/studio' || pathname.startsWith('/studio/')) return 'client';
  return 'portfolio';
}

const BOOT_KEY = 'portfolio-loaded';

// Module-level cache keeps the snapshot referentially stable across renders,
// which useSyncExternalStore requires.
let bootPlayed = false;
const noopSubscribe = () => () => {};

function readBootPlayed() {
  if (!bootPlayed && typeof window !== 'undefined') {
    try {
      bootPlayed = window.sessionStorage.getItem(BOOT_KEY) === 'true';
    } catch {
      // Private-mode / storage-disabled browsers just replay the boot screen.
    }
  }
  return bootPlayed;
}

/** True once the boot sequence has already played in this browser session. */
export function useBootAlreadyPlayed() {
  return useSyncExternalStore(noopSubscribe, readBootPlayed, () => false);
}

export function markBootPlayed() {
  bootPlayed = true;
  try {
    window.sessionStorage.setItem(BOOT_KEY, 'true');
  } catch {
    // Non-fatal: the boot screen simply plays again next navigation.
  }
}
