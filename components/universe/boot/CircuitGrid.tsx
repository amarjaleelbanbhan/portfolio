"use client";

import styles from "./CircuitGrid.module.css";

/**
 * The breathing circuit grid of the void (canon doc 2 §1.1 / doc 6 §12).
 * Dormant: a barely-visible hex/circuit lattice that breathes.
 * `igniting`: circuits fire outward from center (on power activation).
 * Pure CSS — respects prefers-reduced-motion via tokens (durations → 0).
 */
export default function CircuitGrid({ igniting = false }: { igniting?: boolean }) {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.grid} />
      <div className={`${styles.ignite} ${igniting ? styles.fired : ""}`} />
    </div>
  );
}
