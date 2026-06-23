"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import avatarStyles from "../journey/ArchitectAvatar.module.css";

const FINALE_LINE =
  "I built CODEX to answer one question. Now you have walked through the answer.";
const TYPE_SPEED = 0.022; // matches AVATAR_TYPE_SPEED in lib/journey/avatarScript.ts

/**
 * The Architect's one-time finale line (Phase 1.1 audit fix #2) — appears in
 * the Observatory once the visitor has earned it (Follow The Data complete,
 * or Cartographer-threshold realms visited). Reuses ArchitectAvatar's
 * holographic-figure + typewriter CSS for visual consistency, but is NOT the
 * locked AVATAR_SCRIPT — this is a separate, single, one-time line.
 */
export default function ArchitectFinale() {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTyped(FINALE_LINE);
      setDone(true);
      return;
    }
    const counter = { c: 0 };
    const tl = gsap.timeline();
    tlRef.current = tl;
    tl.to(counter, {
      c: FINALE_LINE.length,
      duration: FINALE_LINE.length * TYPE_SPEED,
      ease: "none",
      onUpdate: () => setTyped(FINALE_LINE.slice(0, Math.ceil(counter.c))),
      onComplete: () => setDone(true),
    });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className={avatarStyles.dialogue} role="presentation" style={{ minHeight: "auto" }}>
      <p className={`${avatarStyles.dialogueLine} ${avatarStyles.resolve}`}>
        {typed}
        {!done && <span className={avatarStyles.caret} aria-hidden="true" />}
      </p>
    </div>
  );
}
