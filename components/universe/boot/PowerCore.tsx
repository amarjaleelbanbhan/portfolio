"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PowerCore.module.css";

/**
 * The interactive POWER trigger (canon doc 2 §1.2–1.4 / doc 5 §7.1).
 * Dormant breathing glow → cursor-proximity ignition → click shockwave → activate.
 * Accessible: real <button>, keyboard Enter/Space, aria-label.
 */
export default function PowerCore({
  onActivate,
  reduced = false,
}: {
  onActivate: () => void;
  reduced?: boolean;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [near, setNear] = useState(false);
  const [activating, setActivating] = useState(false);

  // Cursor-proximity ignition (doc 2 §1.3) — disabled under reduced motion.
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const el = btnRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      setNear(dist < 80);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  const activate = () => {
    if (activating) return;
    if (reduced) {
      onActivate();
      return;
    }
    setActivating(true);
    // Shockwave plays ~400ms, then we hand off to the boot terminal (doc 2 §1.4).
    window.setTimeout(onActivate, 420);
  };

  return (
    <div className={styles.core}>
      <button
        ref={btnRef}
        type="button"
        className={`${styles.button} ${near ? styles.near : ""} ${
          activating ? styles.activating : ""
        }`}
        aria-label="Initialize CODEX INFINITUM"
        onClick={activate}
        disabled={activating}
      >
        <span className={styles.ring} aria-hidden="true" />
        <svg className={styles.glyph} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3v9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M7.5 6.4a7 7 0 1 0 9 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {activating && <span className={styles.shock} aria-hidden="true" />}
      </button>

      <p className={styles.label}>[ PRESS TO INITIALIZE ]</p>
    </div>
  );
}
