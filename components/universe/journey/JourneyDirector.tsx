"use client";

import { useState } from "react";
import ArchitectAvatar from "./ArchitectAvatar";
import BootSequence from "@/components/universe/boot/BootSequence";

type Phase = "avatar" | "boot";

/**
 * CODEX INFINITUM — Journey Director (Phase 10.1)
 * Canon: CINEMATIC_LAYER_PLAN.md §1.2
 *
 * The state machine that sequences the pre-universe experience for first-time
 * visitors. It sits between UniverseGate and BootSequence — a thin wrapper
 * that adds one phase before the existing boot, without touching BootSequence's
 * internals.
 *
 *   First visit:    avatar → boot → universe
 *   Return visit:   boot   → universe  (express=true skips the avatar entirely)
 *
 * `completeBoot` and `setEntered` are owned by UniverseGate's `onComplete`
 * handler — JourneyDirector just threads the callback through.
 */
export default function JourneyDirector({
  express = false,
  reduced = false,
  onComplete,
}: {
  express?: boolean;
  reduced?: boolean;
  onComplete: (skipped: boolean) => void;
}) {
  /**
   * Phase sequencing:
   * - first visit (express=false) → "avatar" then "boot"
   * - return visit (express=true)  → "boot" directly (same as before Phase 10.1)
   */
  const [phase, setPhase] = useState<Phase>(express ? "boot" : "avatar");

  if (phase === "avatar") {
    return (
      <ArchitectAvatar
        reduced={reduced}
        onDone={() => setPhase("boot")}
      />
    );
  }

  // phase === "boot" — render the existing BootSequence completely unchanged
  return (
    <BootSequence
      express={express}
      reduced={reduced}
      onComplete={onComplete}
    />
  );
}
