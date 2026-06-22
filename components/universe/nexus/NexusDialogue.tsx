"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./NexusDialogue.module.css";

/**
 * NEXUS's speech panel. Types the current line at NEXUS's deliberate cadence;
 * shows instantly under reduced motion. aria-live so it's announced.
 */
export default function NexusDialogue({
  line,
  reduced,
}: {
  line: string | null;
  reduced: boolean;
}) {
  const [shown, setShown] = useState("");
  const [thinking, setThinking] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (raf.current) window.clearInterval(raf.current);
    if (!line) {
      setShown("");
      setThinking(false);
      return;
    }
    if (reduced) {
      setShown(line);
      return;
    }

    // Trigger brief thinking/glitch state before typing starts
    setThinking(true);
    setShown("");
    setGlitch(true);

    const gTimer = setTimeout(() => {
      setGlitch(false);
    }, 350);

    const tTimer = setTimeout(() => {
      setThinking(false);
      let i = 0;
      raf.current = window.setInterval(() => {
        i += 1;
        setShown(line.slice(0, i));
        if (i >= line.length && raf.current) {
          window.clearInterval(raf.current);
        }
      }, 18);
    }, 450); // 450ms thinking delay

    return () => {
      clearTimeout(gTimer);
      clearTimeout(tTimer);
      if (raf.current) window.clearInterval(raf.current);
    };
  }, [line, reduced]);

  if (!line) return null;

  return (
    <div
      className={`${styles.panel} ${glitch ? styles.panelGlitch : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.tag}>NEXUS COMPANION</span>
      <p className={styles.text}>
        {thinking ? (
          <span className={styles.thinkingText}>[ SYS_RETRIEVING... ]</span>
        ) : (
          <>
            {shown}
            <span className={styles.cursor}>|</span>
          </>
        )}
      </p>
    </div>
  );
}
