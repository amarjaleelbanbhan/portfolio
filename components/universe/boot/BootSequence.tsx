"use client";

import { useCallback, useEffect, useState } from "react";
import CircuitGrid from "./CircuitGrid";
import PowerCore from "./PowerCore";
import SystemTerminal from "./SystemTerminal";
import { FULL_BOOT, EXPRESS_BOOT } from "./bootScript";
import styles from "./BootSequence.module.css";

type Phase = "standby" | "terminal";

/**
 * Orchestrates the birth moment: Human → Machine → Digital Universe.
 * (canon doc 2 Act 1 / doc 6 §3). Composes CircuitGrid + PowerCore +
 * SystemTerminal. Pure: parent decides express/reduced and owns the handoff.
 *
 * `onComplete(skipped)` fires once the boot finishes or is skipped.
 */
export default function BootSequence({
  express = false,
  reduced = false,
  onComplete,
}: {
  express?: boolean;
  reduced?: boolean;
  onComplete: (skipped: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("standby");
  const steps = express ? EXPRESS_BOOT : FULL_BOOT;

  const skip = useCallback(() => onComplete(true), [onComplete]);
  const finish = useCallback(() => onComplete(false), [onComplete]);

  // Esc skips the boot at any stage (doc 5 §9.3 — keyboard parity).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  return (
    <section className={styles.boot} aria-label="System boot sequence">
      <CircuitGrid igniting={phase === "terminal"} />

      <div className={styles.stage}>
        {phase === "standby" ? (
          <PowerCore reduced={reduced} onActivate={() => setPhase("terminal")} />
        ) : (
          <SystemTerminal steps={steps} reduced={reduced} onComplete={finish} />
        )}
      </div>

      <button type="button" className={styles.skip} onClick={skip}>
        SKIP ▸
      </button>
    </section>
  );
}
