/**
 * CODEX INFINITUM — Avatar Script
 * Canon: CINEMATIC_LAYER_PLAN.md §1.1
 *
 * The Architect's opening monologue — a human speaking to the visitor BEFORE
 * the machine boots. Five lines + pauses, each timed for a cinematic read.
 *
 * Shape mirrors `bootScript.ts`'s BootStep so the same typewriter-reveal
 * timing constants (TYPE_SPEED, pause) apply — no new animation system needed.
 *
 * Gating: shown only when `bootCompleted === false` (first visit).
 * Returning visitors skip directly to the express boot, identical to today.
 */

export interface AvatarLine {
  /** The spoken text — typed character-by-character at TYPE_SPEED. */
  text: string;
  /**
   * Seconds to wait AFTER the previous line finishes before typing begins.
   * Longer pauses are "breaths" — silence that carries emotional weight.
   */
  pause: number;
  /**
   * Optional: emphasis class applied to this line.
   * "lead"    → quieter opener, setting the scene
   * "mid"     → building thought
   * "pivot"   → the question that changed everything
   * "resolve" → the answer/invitation
   */
  kind: "lead" | "mid" | "pivot" | "resolve";
}

/** Seconds per character — reuses bootScript's constant semantically. */
export const AVATAR_TYPE_SPEED = 0.022; // slightly slower than terminal for human warmth
/** Hold after the final line before fading the avatar and revealing PowerCore. */
export const AVATAR_FINAL_HOLD = 1.6;

/**
 * The five lines of the Architect's opening monologue.
 * These are the ONLY lines in the avatar scene — do not add more without a
 * design review. Every word was chosen to frame the visitor's experience.
 */
export const AVATAR_SCRIPT: AvatarLine[] = [
  {
    kind: "lead",
    text: "I spent years using computers.",
    pause: 0.5,
  },
  {
    kind: "mid",
    text: "Building things. Shipping things. Breaking things.",
    pause: 1.1,
  },
  {
    kind: "pivot",
    text: "But one question never left me —",
    pause: 0.9,
  },
  {
    kind: "pivot",
    text: "What actually happens after I press the power button?",
    pause: 0.5,
  },
  {
    kind: "mid",
    text: "I studied Computer Science to find the answer.",
    pause: 1.2,
  },
  {
    kind: "resolve",
    text: "Come with me. Let me show you the world behind the screen.",
    pause: 1.0,
  },
];

/** Total seconds the avatar scene takes (for skip affordance tuning). */
export function avatarDuration(): number {
  return (
    AVATAR_SCRIPT.reduce(
      (t, line) =>
        t + line.pause + line.text.length * AVATAR_TYPE_SPEED,
      0
    ) + AVATAR_FINAL_HOLD
  );
}
