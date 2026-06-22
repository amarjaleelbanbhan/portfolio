"use client";

import { useEffect, useState } from "react";
import { useUniverseStore } from "@/store/universeStore";
import BootSequence from "./boot/BootSequence";
import UniverseMap from "./map/UniverseMap";
import NexusCompanion from "./nexus/NexusCompanion";
import RealmShell from "./realms/RealmShell";
import { isEnterable } from "./realms/realmContent";
import InventionArchive from "./inventions/InventionArchive";
import ArchitectCore from "./chambers/ArchitectCore";
import Observatory from "./chambers/Observatory";

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
  const currentRealm = useUniverseStore((s) => s.currentRealm);
  const exitRealm = useUniverseStore((s) => s.exitRealm);

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
    return (
      <>
        {currentRealm === "invention-archive" ? (
          <InventionArchive onExit={exitRealm} />
        ) : currentRealm === "architect-core" ? (
          <ArchitectCore onExit={exitRealm} />
        ) : currentRealm === "the-observatory" ? (
          <Observatory onExit={exitRealm} />
        ) : currentRealm && isEnterable(currentRealm) ? (
          <RealmShell slug={currentRealm} onExit={exitRealm} />
        ) : (
          <UniverseMap onReplay={() => setEntered(false)} />
        )}
        <NexusCompanion />
      </>
    );
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
