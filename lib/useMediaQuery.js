/**
 * Media-query hooks.
 *
 * SSR-safe by construction: useSyncExternalStore's server snapshot always
 * returns the "narrow / no preference" answer, so server and first client render
 * agree and React never warns about a hydration mismatch. The real value
 * arrives on subscribe, immediately after mount.
 *
 * This is deliberately not a media-query abstraction layer. It exists because
 * two Phase 3 requirements genuinely need the viewport in JavaScript: motion
 * presets that must differ between stacked and side-by-side layouts, and
 * reduced-motion handling for Framer Motion, which never reads CSS.
 */
import { useSyncExternalStore } from 'react';

function subscribe(query) {
  return (onChange) => {
    if (typeof window === 'undefined') return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  };
}

/** True when `query` currently matches. False during SSR and first paint. */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false
  );
}

/**
 * True at Tailwind's `md` breakpoint and up — the width at which stacked
 * layouts become side-by-side. Use it to pick a motion direction, not to hide
 * content: server HTML always renders as if narrow.
 */
export function useIsWide() {
  return useMediaQuery('(min-width: 768px)');
}

/**
 * True when the visitor has asked for reduced motion.
 *
 * CSS handles this for token-driven transitions; this hook is for the cases CSS
 * cannot reach — Framer Motion props, canvas animation loops and WebGL frames.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
