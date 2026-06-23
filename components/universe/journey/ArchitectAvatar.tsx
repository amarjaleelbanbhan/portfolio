"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AVATAR_SCRIPT, AVATAR_TYPE_SPEED, AVATAR_FINAL_HOLD } from "@/lib/journey/avatarScript";
import styles from "./ArchitectAvatar.module.css";

/**
 * CODEX INFINITUM — Architect Avatar (Phase 10.1)
 * Canon: CINEMATIC_LAYER_PLAN.md §1.1
 *
 * The creator character appears before the machine boots — first-visit only.
 * A cinematic guide, NOT an About section. The Architect speaks as a human:
 *   "I wondered. I learned. I built."
 * (NEXUS speaks as a system: "Observe this process. This is computation.")
 *
 * Props:
 *   reduced  — prefers-reduced-motion: shows all lines instantly, skip always visible
 *   onDone   — called when the monologue finishes OR the visitor skips
 */
export default function ArchitectAvatar({
  reduced = false,
  onDone,
}: {
  reduced?: boolean;
  onDone: () => void;
}) {
  // Which lines are currently "revealed" (index into AVATAR_SCRIPT)
  const [revealedCount, setRevealedCount] = useState<number>(reduced ? AVATAR_SCRIPT.length : 0);
  // Live content of the currently-typing line
  const [typingText, setTypingText] = useState<string>("");
  // Whether the scene is in its exit animation
  const [exiting, setExiting] = useState(false);
  // Whether the skip/continue button is visible (appears after first line types)
  const [actionsVisible, setActionsVisible] = useState(false);

  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const tl = useRef<gsap.core.Timeline | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Exit helper: fade out then hand off ────────────────────────
  const exit = useCallback(() => {
    tl.current?.kill();
    setExiting(true);
    // Wait for stageExit animation (800ms), then call parent
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    exitTimeoutRef.current = setTimeout(() => doneRef.current(), 820);
  }, []);

  // Cancel the pending exit handoff if the component unmounts mid-exit.
  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  // ── Reduced-motion path: all lines shown instantly ─────────────
  useEffect(() => {
    if (!reduced) return;
    setActionsVisible(true);
  }, [reduced]);

  // ── Animated path: GSAP typewriter timeline ─────────────────────
  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();
      tl.current = timeline;

      AVATAR_SCRIPT.forEach((line, i) => {
        const counter = { c: 0 };

        // Pause before this line starts
        timeline.to(counter, { duration: line.pause, onStart: () => {} }, "+=0");

        // Show skip button after the first line begins
        if (i === 0) {
          timeline.call(() => setActionsVisible(true));
        }

        // Type the current line character by character
        timeline.to(counter, {
          c: line.text.length,
          duration: line.text.length * AVATAR_TYPE_SPEED,
          ease: "none",
          onStart: () => {
            setTypingText("");
            setRevealedCount(i); // "i" lines are fully done, line i is typing
          },
          onUpdate: function () {
            setTypingText(line.text.slice(0, Math.ceil(counter.c)));
          },
          onComplete: () => {
            // Mark this line fully revealed
            setRevealedCount(i + 1);
            setTypingText("");
          },
        });
      });

      // Hold at the end, then auto-exit
      timeline.call(() => {}, undefined, `+=${AVATAR_FINAL_HOLD}`);
      timeline.call(() => exit());
    });

    return () => {
      ctx.revert();
    };
  }, [reduced, exit]);

  // ── Keyboard: Escape skips, Space/Enter on skip button ─────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exit]);

  return (
    <section
      className={`${styles.stage}${exiting ? ` ${styles.exiting}` : ""}`}
      aria-label="Architect introduction"
    >
      {/* SR-only summary so screen readers don't need to hear animated text */}
      <p className="sr-only" aria-live="polite">
        The architect of this universe introduces themselves before the computer boots.
        Press Skip to proceed directly.
      </p>

      {/* ── Holographic figure ── */}
      <div className={styles.avatarWrap} aria-hidden="true">
        <div className={styles.figure}>
          <div className={styles.silhouette} />
          <div className={styles.head} />
          <div className={styles.scan} />
          <div className={styles.brackets} />
        </div>
        <span className={styles.label}>ARCHITECT</span>
      </div>

      {/* ── Dialogue ── */}
      <div className={styles.dialogue} role="presentation">
        {AVATAR_SCRIPT.map((line, i) => {
          // Fully typed lines — show complete text
          if (i < revealedCount) {
            return (
              <p key={i} className={`${styles.dialogueLine} ${styles[line.kind]}`}>
                {line.text}
              </p>
            );
          }
          // Currently-typing line
          if (!reduced && i === revealedCount && typingText) {
            return (
              <p key={i} className={`${styles.dialogueLine} ${styles[line.kind]}`}>
                {typingText}
                <span className={styles.caret} aria-hidden="true" />
              </p>
            );
          }
          return null;
        })}
      </div>

      {/* ── Actions: skip intro ── */}
      <div className={`${styles.actions}${actionsVisible ? ` ${styles.visible}` : ""}`}>
        <button
          type="button"
          className={styles.skip}
          onClick={exit}
          aria-label="Skip introduction and proceed to boot sequence"
        >
          SKIP INTRO ▸
        </button>
      </div>
    </section>
  );
}
