/**
 * CODEX INFINITUM — Boot Script (deterministic, not random text)
 * Canon: 2_story_experience.md §1.5 (boot readout) + 10 (Kernel/Foundations lines)
 *
 * Every line is scripted with real timing. `pause` is seconds of rest BEFORE a
 * line begins (the "phrasing" / silence-between-notes principle, doc 6 §M3).
 * Type duration is derived from text length × TYPE_SPEED.
 */

export type BootKind = "header" | "cmd" | "status" | "note" | "count";

export interface BootStep {
  kind: BootKind;
  text: string;
  /** seconds to wait before this line starts (after the previous finishes) */
  pause?: number;
}

/** Seconds per character for the typewriter (doc 2 used ~60ms; tightened for status lines). */
export const TYPE_SPEED = 0.018;
/** Hold after the final line before handing off to the universe. */
export const FINAL_HOLD = 1.0;

/** First-visit boot — the full machine awakening (~length-derived, ~14–16s). */
export const FULL_BOOT: BootStep[] = [
  { kind: "header", text: "CODEX INFINITUM // SYSTEM BOOT v2.0", pause: 0.2 },
  { kind: "cmd", text: "> Initializing POST sequence...", pause: 0.35 },
  { kind: "status", text: "[✓] Hardware Realm Online", pause: 0.3 },
  { kind: "status", text: "[✓] Kernel Layer Activated — atmosphere breathing", pause: 0.22 },
  { kind: "status", text: "[✓] Memory Systems Loaded — 847 architectural decisions indexed", pause: 0.22 },
  { kind: "status", text: "[✓] Network Pathways Connected", pause: 0.22 },
  { kind: "status", text: "[✓] Cyber Fortress Shield Active", pause: 0.22 },
  { kind: "status", text: "[✓] Foundations Verified — halting problem still unsolved (as expected)", pause: 0.22 },
  { kind: "status", text: "[✓] Artificial Intelligence Core Awakening", pause: 0.22 },
  { kind: "status", text: "[✓] NEXUS Interface Preparing", pause: 0.22 },
  { kind: "note", text: "Entering Computer Science Universe...", pause: 0.6 },
  { kind: "count", text: "3", pause: 0.55 },
  { kind: "count", text: "2", pause: 0.55 },
  { kind: "count", text: "1", pause: 0.55 },
];

/** Returning-visitor express boot (~5s) — doc 2 "Returning Visitor Experience". */
export const EXPRESS_BOOT: BootStep[] = [
  { kind: "header", text: "SYSTEM: Returning explorer detected.", pause: 0.2 },
  { kind: "cmd", text: "> Loading previous session context...", pause: 0.3 },
  { kind: "status", text: "[✓] Universe topology restored", pause: 0.25 },
  { kind: "status", text: "[✓] NEXUS memory active — context restored", pause: 0.22 },
  { kind: "note", text: "Resuming CODEX INFINITUM...", pause: 0.5 },
];

/** Total seconds a script will take (for progress + skip affordance tuning). */
export function bootDuration(steps: BootStep[]): number {
  return (
    steps.reduce((t, s) => t + (s.pause ?? 0.15) + s.text.length * TYPE_SPEED, 0) +
    FINAL_HOLD
  );
}
