/**
 * Tracks which story stage is currently being read.
 *
 * This drives *emphasis only* — which diagram the sticky panel shows and which
 * marker is lit on the progress rail. It must never control whether content is
 * visible.
 *
 * That distinction is the whole design. Phase 1 shipped scroll-triggered
 * entrances on /projects and jump-scrolling left real cards stranded at opacity
 * 0; Phase 3 made "entrances animate on mount" a rule of the shared motion
 * system. So every stage here renders fully visible from the first paint, and if
 * IntersectionObserver never fires — old browser, observer unsupported, script
 * error — the reader loses a highlight and nothing else.
 *
 * Defaults to the first stage rather than to "none" for the same reason: the
 * sticky panel always has something real to show.
 */
import { useEffect, useRef, useState } from 'react';

export default function useActiveStage(ids) {
  const [activeId, setActiveId] = useState(ids[0] ?? null);
  // Keeps the effect from re-subscribing when the caller passes a new array
  // identity with the same contents.
  const key = ids.join('|');
  const ratios = useRef(new Map());

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const elements = key.split('|').map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.current.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        // Whichever stage occupies the most of the reading band wins. Comparing
        // ratios rather than reacting to each crossing keeps fast scrolling from
        // flickering between neighbours.
        let best = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios.current) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActiveId(best);
      },
      {
        // A band across the middle of the viewport: a stage becomes active when
        // it is what the reader is actually looking at, not when its top edge
        // grazes the bottom of the screen.
        rootMargin: '-35% 0px -35% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [key]);

  return activeId;
}
