"use client";

import { PLACEMENT_BY_SLUG } from "./realmLayout";
import styles from "./RealmInfoCard.module.css";

/**
 * Hover/focus detail panel for a realm (canon doc 2 §3.2 / doc 5 §7.4).
 * Shows name, identity, conceptual layer, purpose, and the CS concepts inside.
 */
export default function RealmInfoCard({ slug }: { slug: string | null }) {
  const p = slug ? PLACEMENT_BY_SLUG[slug] : undefined;
  if (!p) return null;

  return (
    <aside
      className={styles.card}
      style={{ ["--rp" as string]: p.realm.colors.primary }}
      aria-live="polite"
    >
      <p className={styles.layer}>{p.layer}</p>
      <h2 className={styles.name}>{p.realm.name}</h2>
      <p className={styles.identity}>{p.realm.identity}</p>
      <p className={styles.tagline}>{p.tagline}</p>
      <ul className={styles.concepts}>
        {p.concepts.map((c) => (
          <li key={c} className={styles.chip}>
            {c}
          </li>
        ))}
      </ul>
    </aside>
  );
}
