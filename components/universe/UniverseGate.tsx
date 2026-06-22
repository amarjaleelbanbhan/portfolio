"use client";

import { useEffect, useState } from "react";
import { useUniverseStore } from "@/store/universeStore";
import BootSequence from "./boot/BootSequence";
import UniverseMap from "./map/UniverseMap";

/**
 * Client gate for the universe entry.
 * Decides full vs express boot from persisted `bootCompleted` (Zustand +
 * localStorage), detects reduced-motion, then hands off to the Universe Map.
 * Mounted-gate avoids SSR/hydration mismatch from persisted state.
 */
export default function UniverseGate() {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(false);

  const bootCompleted = useUniverseStore((s) => s.bootCompleted);
  const completeBoot = useUniverseStore((s) => s.completeBoot);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMounted(true);
  }, []);

  // Pre-hydration: a stable void (matches the server render — no flash/mismatch).
  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, background: "var(--void)" }}
      />
    );
  }

  if (entered) {
    return <UniverseMap onReplay={() => setEntered(false)} />;
  }

  return (
    <BootSequence
      express={bootCompleted}
      reduced={reduced}
      onComplete={(skipped) => {
        completeBoot(skipped);
        setEntered(true);
      }}
    />
  );
}
