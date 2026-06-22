"use client";

import styles from "./NexusCompanion.module.css";

/**
 * CSS/SVG NEXUS for tier-0 / no-WebGL / reduced-motion. A glowing geometric
 * sigil that adopts the active realm color. No 3D, no rapid morphing.
 */
export default function NexusCoreFallback({
  color,
  reduced,
}: {
  color: string;
  reduced: boolean;
}) {
  return (
    <div
      className={`${styles.fallback} ${reduced ? "" : styles.fallbackSpin}`}
      style={{ ["--rp" as string]: color }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100">
        <polygon
          points="50,8 86,30 86,70 50,92 14,70 14,30"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <polygon
          points="50,24 72,38 72,62 50,76 28,62 28,38"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
        <circle cx="50" cy="50" r="6" fill="#fff" />
      </svg>
    </div>
  );
}
