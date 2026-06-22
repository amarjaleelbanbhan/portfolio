"use client";

import type { SimStep } from "@/lib/simulations/types";
import styles from "./SimulationControls.module.css";

interface SimulationControlsProps {
  steps: SimStep[];
  activeIndex: number;
  playing: boolean;
  canAutoplay: boolean;
  onSelect: (index: number) => void;
  onStep: (delta: 1 | -1) => void;
  onTogglePlay: () => void;
}

/** Transport for the simulation: pause/step/inspect/follow-the-signal. */
export default function SimulationControls({
  steps,
  activeIndex,
  playing,
  canAutoplay,
  onSelect,
  onStep,
  onTogglePlay,
}: SimulationControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.rail} role="tablist" aria-label="Signal stages — inspect any stage">
        {steps.map((step, i) => (
          <button
            key={step.id}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            className={`${styles.pill} ${i === activeIndex ? styles.pillActive : ""}`}
            onClick={() => onSelect(i)}
          >
            {step.label}
          </button>
        ))}
      </div>

      <div className={styles.transport}>
        <button type="button" className={styles.tbtn} onClick={() => onStep(-1)} aria-label="Step back">
          ◁ STEP
        </button>
        {canAutoplay && (
          <button type="button" className={styles.tbtn} onClick={onTogglePlay} aria-pressed={playing}>
            {playing ? "⏸ PAUSE" : "▶ FOLLOW SIGNAL"}
          </button>
        )}
        <button type="button" className={styles.tbtn} onClick={() => onStep(1)} aria-label="Step forward">
          STEP ▷
        </button>
      </div>
    </div>
  );
}
