"use client";

import { useUniverseStore } from "@/store/universeStore";
import styles from "./ArchitectTransmission.module.css";

/**
 * Persistent "VIEW CREATOR WORK" entry point (Phase 1.1 audit fix #5).
 * Visible from the first post-boot screen onward, framed as a transmission
 * from the Architect rather than a generic nav button. Uses the same
 * state-driven navigation as every other realm jump (enterRealm), so it
 * works without a full page reload.
 */
export default function ArchitectTransmission() {
  const enterRealm = useUniverseStore((s) => s.enterRealm);
  const currentRealm = useUniverseStore((s) => s.currentRealm);

  // Already viewing the archive — no need to show the entry point.
  if (currentRealm === "invention-archive") return null;

  return (
    <div className={styles.wrap}>
      <span className={styles.label} aria-hidden="true">
        Architect Transmission
      </span>
      <button
        type="button"
        className={styles.button}
        onClick={() => enterRealm("invention-archive")}
        aria-label="Architect transmission — view creator work"
      >
        View Creator Work
      </button>
    </div>
  );
}
