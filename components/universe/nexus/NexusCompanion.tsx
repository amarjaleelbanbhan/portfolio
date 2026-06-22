"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useUniverseStore } from "@/store/universeStore";
import type { NexusMode } from "@/store/universeStore";
import { REALM_BY_SLUG } from "@/lib/realms";
import { firstGreeting, realmLine, nextIdleLine, enterLine } from "@/lib/nexusDialogue";
import { supportsWebGL, prefersReducedMotion as detectReduced } from "@/lib/deviceTier";
import NexusCoreFallback from "./NexusCoreFallback";
import NexusDialogue from "./NexusDialogue";
import styles from "./NexusCompanion.module.css";

const NexusCore3D = dynamic(() => import("./NexusCore3D"), { ssr: false });

const DEFAULT_COLOR = "#FBBF24";

function modeFor(slug: string | null): NexusMode {
  return (slug && REALM_BY_SLUG[slug]?.nexusMode) || "ARCHITECT";
}
function colorFor(slug: string | null): string {
  return (slug && REALM_BY_SLUG[slug]?.colors.primary) || DEFAULT_COLOR;
}

/**
 * NEXUS — the guardian/companion of the universe (canon doc 3 / doc 6 §7).
 * Persistent lower-right presence. Greets on arrival, shifts mode + bleeds
 * color to the active realm, keeps idle patience, and speaks on selection or
 * click. Pre-scripted (no AI backend). 3D core with CSS fallback.
 */
export default function NexusCompanion() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [webgl, setWebgl] = useState(true);

  const mode = useUniverseStore((s) => s.nexusMode);
  const animState = useUniverseStore((s) => s.nexusAnimState);
  const dialogue = useUniverseStore((s) => s.nexusDialogue);
  const current = useUniverseStore((s) => s.currentRealm);
  const hovered = useUniverseStore((s) => s.hoveredRealm);
  const selected = useUniverseStore((s) => s.selectedRealm);
  const visited = useUniverseStore((s) => s.visitedRealms);
  const tier = useUniverseStore((s) => s.deviceTier);
  const setMode = useUniverseStore((s) => s.setNexusMode);
  const setAnim = useUniverseStore((s) => s.setNexusAnimState);
  const say = useUniverseStore((s) => s.sayNexus);

  const clearTimer = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);
  const prevSelected = useRef<string | null>(null);
  const prevCurrent = useRef<string | null>(null);

  // inside a realm, currentRealm wins; on the map, hover/selection drive NEXUS
  const active = current ?? hovered ?? selected;
  const activeColor = colorFor(active);

  const speak = (line: string | null, state: "SPEAKING" | "EXCITED" = "SPEAKING") => {
    if (!line) return;
    if (clearTimer.current) window.clearTimeout(clearTimer.current);
    setAnim(state);
    say(line);
    const dwell = Math.min(9000, line.length * 32 + 3500);
    clearTimer.current = window.setTimeout(() => {
      say(null);
      setAnim("IDLE");
    }, dwell);
  };

  const armIdle = () => {
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      if (!useUniverseStore.getState().nexusDialogue && !useUniverseStore.getState().hoveredRealm) {
        speak(nextIdleLine());
      }
    }, 15000);
  };

  // Mount: detect capabilities + first-encounter greeting (doc 3 §5).
  useEffect(() => {
    setReduced(detectReduced());
    setWebgl(supportsWebGL());
    setMounted(true);
    const t1 = window.setTimeout(() => setAnim("THINKING"), 800);
    const t2 = window.setTimeout(() => {
      setMode("ARCHITECT");
      speak(firstGreeting(visited.length > 0));
    }, 2300);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      if (clearTimer.current) window.clearTimeout(clearTimer.current);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Active realm → shift mode + bleed the whole UI theme to that realm's color.
  useEffect(() => {
    if (!mounted) return;
    setMode(modeFor(active));
    document.documentElement.dataset.realm = active ?? "architect-core";
    armIdle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, mounted]);

  // Selecting a realm on the map → NEXUS reacts and speaks its line.
  useEffect(() => {
    if (!mounted) return;
    if (!current && selected && selected !== prevSelected.current) {
      const line = realmLine(selected);
      if (line) speak(line, "EXCITED");
    }
    prevSelected.current = selected;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, current, mounted]);

  // Arriving inside a realm (travel) → MENTOR-toned welcome.
  useEffect(() => {
    if (!mounted) return;
    if (current && current !== prevCurrent.current) {
      const line = enterLine(current);
      if (line) speak(line, "SPEAKING");
    }
    prevCurrent.current = current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, mounted]);

  if (!mounted) return null;

  const use3D = webgl && tier > 0;

  const onClick = () => {
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    speak(realmLine(active) ?? nextIdleLine());
  };

  return (
    <>
      <NexusDialogue line={dialogue} reduced={reduced} />
      <div className={styles.companion}>
        <button type="button" className={styles.button} aria-label="NEXUS — your guide to the universe" onClick={onClick}>
          {use3D ? (
            <div className={styles.canvasWrap}>
              <NexusCore3D mode={mode} animState={animState} color={activeColor} reduced={reduced} />
            </div>
          ) : (
            <NexusCoreFallback color={activeColor} reduced={reduced} />
          )}
        </button>
      </div>
    </>
  );
}
