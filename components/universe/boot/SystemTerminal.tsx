"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./SystemTerminal.module.css";
import { type BootStep, TYPE_SPEED, FINAL_HOLD } from "./bootScript";

/**
 * The cinematic system-startup readout (canon doc 2 §1.5 / doc 6 §3).
 * GSAP timeline types each scripted line in real time. Status lines pop their
 * checkmark. Under reduced motion: full readout shown instantly + an Enter
 * control (content is never gated behind motion — doc 6 §14).
 */
export default function SystemTerminal({
  steps,
  reduced = false,
  onComplete,
}: {
  steps: BootStep[];
  reduced?: boolean;
  onComplete: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  useEffect(() => {
    if (reduced) return; // static path renders below
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      steps.forEach((step, i) => {
        const el = lineRefs.current[i];
        if (!el) return;
        const counter = { c: 0 };
        tl.set(el, { opacity: 1 }, `+=${step.pause ?? 0.15}`);
        tl.to(counter, {
          c: step.text.length,
          duration: step.text.length * TYPE_SPEED,
          ease: "none",
          onUpdate: () => {
            el.textContent = step.text.slice(0, Math.ceil(counter.c));
          },
        });
      });
      tl.call(() => doneRef.current(), undefined, `+=${FINAL_HOLD}`);
    }, rootRef);
    return () => ctx.revert();
  }, [steps, reduced]);

  return (
    <div ref={rootRef} className={styles.terminal}>
      {/* Screen-reader summary (announced once; animated text is hidden from SR) */}
      <p className="sr-only" aria-live="polite">
        CODEX INFINITUM is booting. Entering the Computer Science Universe.
      </p>

      <div className={styles.screen} aria-hidden="true">
        {steps.map((step, i) => (
          <p
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className={`${styles.line} ${styles[step.kind]}`}
            style={reduced ? undefined : { opacity: 0 }}
          >
            {reduced ? step.text : ""}
          </p>
        ))}
        {!reduced && <span className={styles.cursor} />}
      </div>

      {reduced && (
        <button type="button" className={styles.enter} onClick={onComplete}>
          [ ENTER THE UNIVERSE ▸ ]
        </button>
      )}
    </div>
  );
}
