"use client";

import { useCallback, useEffect } from "react";
import CircuitGrid from "@/components/universe/boot/CircuitGrid";
import SystemTerminal from "@/components/universe/boot/SystemTerminal";
import { FULL_BOOT } from "@/components/universe/boot/bootScript";
import styles from "./BootTerminal.module.css";

/**
 * CODEX INFINITUM — Boot Terminal (Phase 10.2)
 *
 * The post-cinematic boot experience. Composes the same sub-components
 * BootSequence uses (CircuitGrid, SystemTerminal, skip button) but:
 *
 *   1. CircuitGrid starts in `igniting=true` mode — the circuits are ALREADY
 *      alive (the dive animation just travelled through them).
 *   2. The SystemTerminal begins immediately — no power button; the visitor
 *      already pressed it. The machine is now booting.
 *   3. Entry animation: fades from white (matching CinematicCamera's flash),
 *      so the transition reads as a single continuous moment.
 *
 * BootSequence.tsx is byte-for-byte untouched.
 * Only used for first-time visitors (after the cinematic). Return visitors
 * continue through the regular BootSequence path in JourneyDirector.
 */
export default function BootTerminal({
  reduced = false,
  onComplete,
}: {
  reduced?: boolean;
  onComplete: (skipped: boolean) => void;
}) {
  const skip = useCallback(() => onComplete(true), [onComplete]);

  // Esc skips — same keyboard contract as BootSequence
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  return (
    <section className={styles.boot} aria-label="System boot sequence">
      {/* CircuitGrid igniting=true — circuits already activated by the dive */}
      <CircuitGrid igniting={true} />

      <div className={styles.stage}>
        <SystemTerminal
          steps={FULL_BOOT}
          reduced={reduced}
          onComplete={() => onComplete(false)}
        />
      </div>

      <button type="button" className={styles.skip} onClick={skip}>
        SKIP ▸
      </button>
    </section>
  );
}
