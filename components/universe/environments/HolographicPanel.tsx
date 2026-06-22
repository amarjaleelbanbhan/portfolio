"use client";

import type { ReactNode } from "react";
import { useUniverseStore } from "@/store/universeStore";
import styles from "./HolographicPanel.module.css";

interface HolographicPanelProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  title?: string;
}

/**
 * HolographicPanel — wraps any content in a high-tech floating terminal panel.
 * Adds glowing amber borders, L-shaped corner brackets, a grid background mesh,
 * and a sweeping vertical scanline. Respects reduced-motion setting.
 */
export default function HolographicPanel({
  children,
  className = "",
  glowColor,
  title,
}: HolographicPanelProps) {
  const prefersReduced = useUniverseStore((s) => s.prefersReducedMotion);

  return (
    <div
      className={`${styles.panel} ${prefersReduced ? styles.reduced : ""} ${className}`}
      style={glowColor ? ({ "--panel-glow-color": glowColor } as any) : undefined}
    >
      {/* Corner brackets */}
      <span className={`${styles.corner} ${styles.topLeft}`} />
      <span className={`${styles.corner} ${styles.topRight}`} />
      <span className={`${styles.corner} ${styles.bottomLeft}`} />
      <span className={`${styles.corner} ${styles.bottomRight}`} />

      {/* Decorative hairline header bar if title is provided */}
      {title && (
        <div className={styles.header}>
          <span className={styles.titleText}>{title}</span>
          <span className={styles.statusIndicator} />
        </div>
      )}

      {/* Subtle tech grid background and scanline */}
      <div className={styles.gridOverlay} />
      {!prefersReduced && <div className={styles.scanline} />}

      <div className={styles.content}>{children}</div>
    </div>
  );
}
