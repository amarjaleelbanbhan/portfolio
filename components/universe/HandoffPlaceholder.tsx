"use client";

import Link from "next/link";
import styles from "./HandoffPlaceholder.module.css";

/**
 * Post-boot handoff state. Phase 1 ends here: the machine is awake and the
 * visitor has "arrived." The Universe Map (Phase 2) will replace this stub.
 * Per scope: no map / realms / NEXUS yet — only the prepared handoff.
 */
export default function HandoffPlaceholder({ onReplay }: { onReplay?: () => void }) {
  return (
    <main className={styles.arrived}>
      <div className={styles.center}>
        <p className={styles.kicker}>SYSTEM · ONLINE</p>
        <h1 className={styles.title}>CODEX INFINITUM</h1>
        <p className={styles.line}>You are now inside the answer.</p>
        <p className={styles.note}>
          The Universe Map materializes in Phase&nbsp;2.
        </p>

        <nav className={styles.links} aria-label="Navigation">
          <Link className={styles.link} href="/legacy">
            ◁ Legacy Archive (Portfolio v1.0)
          </Link>
          {onReplay && (
            <button type="button" className={styles.link} onClick={onReplay}>
              ↻ Replay boot
            </button>
          )}
        </nav>
      </div>

      <footer className={styles.foot}>AMAR JALEEL · AI PRODUCT ENGINEER</footer>
    </main>
  );
}
