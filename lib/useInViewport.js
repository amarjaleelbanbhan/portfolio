/**
 * Viewport visibility, for pausing work that is not being looked at.
 *
 * This is deliberately NOT an entrance-animation helper. Content must never be
 * gated behind scroll position — Phase 1 shipped that bug and it left project
 * cards permanently invisible after a jump-scroll. This hook is for render
 * loops: a WebGL scene or canvas that is scrolled off-screen should stop
 * burning frames, and nothing about what the user can read depends on it.
 *
 * Returns a ref to attach and a boolean. Defaults to true so that if
 * IntersectionObserver is unavailable, work continues rather than silently
 * stopping.
 */
import { useEffect, useRef, useState } from 'react';

export default function useInViewport({ rootMargin = '200px' } = {}) {
  const ref = useRef(null);
  const [inViewport, setInViewport] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      // Start rendering slightly before it scrolls into view so nothing pops in
      // mid-frame.
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, inViewport];
}
