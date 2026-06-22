"use client";

import { useEffect, useState } from "react";
import { useUniverseStore } from "@/store/universeStore";
import dynamic from "next/dynamic";
import BootSequence from "./boot/BootSequence";

// Everything past the boot is code-split so the first paint ships only the
// boot + shell — the universe (map, realms, archive, chambers, knowledge)
// loads on demand. All are client-only (R3F / window access).
const UniverseMap = dynamic(() => import("./map/UniverseMap"), {
  ssr: false,
  loading: () => <div style={{ position: "fixed", inset: 0, background: "var(--void)" }} aria-hidden="true" />,
});
const NexusCompanion = dynamic(() => import("./nexus/NexusCompanion"), { ssr: false });
const RealmShell = dynamic(() => import("./realms/RealmShell"), { ssr: false });
const InventionArchive = dynamic(() => import("./inventions/InventionArchive"), { ssr: false });
const ArchitectCore = dynamic(() => import("./chambers/ArchitectCore"), { ssr: false });
const Observatory = dynamic(() => import("./chambers/Observatory"), { ssr: false });
const KnowledgeButton = dynamic(() => import("./knowledge/KnowledgeButton"), { ssr: false });
const KnowledgePanel = dynamic(() => import("./knowledge/KnowledgePanel"), { ssr: false });

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
        ) : currentRealm ? (
          <RealmShell slug={currentRealm} onExit={exitRealm} />
        ) : (
          <UniverseMap onReplay={() => setEntered(false)} />
        )}
        <NexusCompanion />
        <KnowledgeButton />
        <KnowledgePanel />
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
