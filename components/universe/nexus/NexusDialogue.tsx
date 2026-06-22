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
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (raf.current) window.clearInterval(raf.current);
    if (!line) {
      setShown("");
      return;
    }
    if (reduced) {
      setShown(line);
      return;
    }
    let i = 0;
    setShown("");
    raf.current = window.setInterval(() => {
      i += 1;
      setShown(line.slice(0, i));
      if (i >= line.length && raf.current) window.clearInterval(raf.current);
    }, 22);
    return () => {
      if (raf.current) window.clearInterval(raf.current);
    };
  }, [line, reduced]);

  if (!line) return null;

  return (
    <div className={styles.panel} role="status" aria-live="polite">
      <span className={styles.tag}>NEXUS</span>
      <p className={styles.text}>{shown}</p>
    </div>
  );
}
