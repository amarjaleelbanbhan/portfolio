import Link from "next/link";
import styles from "./page.module.css";

/**
 * Phase 0 placeholder for the universe entry.
 * Phase 1 replaces this with the Boot Sequence (doc 2 Act 1 / doc 6 §3),
 * which then hands off to the Universe Map (Phase 2).
 * Kept intentionally minimal — but already on-brand (the void, the signal cyan).
 */
export default function UniverseEntry() {
  return (
    <main className={styles.entry}>
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.center}>
        <p className={styles.kicker}>SYSTEM · STANDBY</p>
        <h1 className={styles.title}>CODEX INFINITUM</h1>
        <p className={styles.tagline}>
          Every function has a purpose. Every universe has an architect.
        </p>

        <p className={styles.note}>
          Foundation online. The boot sequence arrives in Phase&nbsp;1.
        </p>

        <nav className={styles.links} aria-label="Temporary navigation">
          <Link className={styles.legacyLink} href="/legacy">
            ◁ Enter the Legacy Archive (Portfolio v1.0)
          </Link>
        </nav>
      </div>

      <footer className={styles.foot}>
        <span>AMAR JALEEL · AI PRODUCT ENGINEER</span>
      </footer>
    </main>
  );
}
