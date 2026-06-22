"use client";

import { useState } from "react";
import ArchitectAvatar from "./ArchitectAvatar";
import CinematicCamera from "./CinematicCamera";
import BootTerminal from "./BootTerminal";
import BootSequence from "@/components/universe/boot/BootSequence";

/**
 * Phase machine type.
 *
 * First-visit sequence:   avatar → cinematic → boot-terminal
 * Return-visit sequence:  boot  (existing BootSequence, unchanged path)
 */
type Phase = "avatar" | "cinematic" | "boot-terminal" | "boot";

/**
 * CODEX INFINITUM — Journey Director (updated in Phase 10.2)
 * Canon: CINEMATIC_LAYER_PLAN.md §1.2
 *
 * Thin state machine that sequences the pre-universe experience.
 * Sits between UniverseGate and its sub-components — never touches them
 * internally. `completeBoot` and `setEntered` are owned by UniverseGate's
 * `onComplete` handler; JourneyDirector just threads the callback through.
 *
 *   First visit:
 *     "avatar"        — ArchitectAvatar (6-line monologue, Phase 10.1)
 *       ↓
 *     "cinematic"     — CinematicCamera (power button + dive into machine, Phase 10.2)
 *       ↓
 *     "boot-terminal" — BootTerminal (CircuitGrid igniting + SystemTerminal, Phase 10.2)
 *       ↓ onComplete
 *     Universe
 *
 *   Return visit (express=true):
 *     "boot"          — BootSequence unmodified (express boot, identical to pre-10.1)
 *       ↓ onComplete
 *     Universe
 */
export default function JourneyDirector({
  express = false,
  reduced = false,
  onComplete,
}: {
  /** true = returning visitor — skip avatar + cinematic, go straight to express boot */
  express?: boolean;
  /** prefers-reduced-motion — threaded through to every child */
  reduced?: boolean;
  /** fired when the full pre-universe sequence ends; UniverseGate owns completeBoot() */
  onComplete: (skipped: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>(express ? "boot" : "avatar");

  // ── First-visit phases ──────────────────────────────────────────

  if (phase === "avatar") {
    return (
      <ArchitectAvatar
        reduced={reduced}
        onDone={() => setPhase("cinematic")}
      />
    );
  }

  if (phase === "cinematic") {
    return (
      <CinematicCamera
        reduced={reduced}
        onDone={() => setPhase("boot-terminal")}
      />
    );
  }

  if (phase === "boot-terminal") {
    return (
      <BootTerminal
        reduced={reduced}
        onComplete={onComplete}
      />
    );
  }

  // ── Return-visit phase (phase === "boot") ───────────────────────
  // Renders the existing BootSequence completely unchanged.
  // express=true → EXPRESS_BOOT steps; power button still shown; Esc still works.
  return (
    <BootSequence
      express={express}
      reduced={reduced}
      onComplete={onComplete}
    />
  );
}
