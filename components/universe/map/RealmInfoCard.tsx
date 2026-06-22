"use client";

import { PLACEMENT_BY_SLUG } from "./realmLayout";
import { isEnterable } from "../realms/realmContent";
import styles from "./RealmInfoCard.module.css";

/**
 * Hover/focus detail panel for a realm (canon doc 2 §3.2 / doc 5 §7.4).
 * Shows name, identity, conceptual layer, purpose, and the CS concepts inside.
 * Enterable realms get a travel CTA; the rest show as "not yet charted".
 */
export default function RealmInfoCard({
  slug,
  onEnter,
}: {
  slug: string | null;
  onEnter?: (slug: string) => void;
}) {
  const p = slug ? PLACEMENT_BY_SLUG[slug] : undefined;
  if (!p || !slug) return null;
  const isArchive = slug === "invention-archive";
  const isCore = slug === "architect-core";
  const enterable = isEnterable(slug) || isArchive || isCore;
  const isLegacy = slug === "legacy-archive";
  const enterLabel = isCore
    ? "MEET THE ARCHITECT →"
    : isArchive
      ? "OPEN ARCHIVE →"
      : slug === "the-observatory"
        ? "ENTER OBSERVATORY →"
        : "ENTER REALM →";

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

      {enterable ? (
        <button type="button" className={styles.enter} onClick={() => onEnter?.(slug)}>
          {enterLabel}
        </button>
      ) : isLegacy ? (
        <a className={styles.enter} href="/legacy">
          OPEN LEGACY ARCHIVE →
        </a>
      ) : (
        <p className={styles.uncharted}>◌ Not yet charted</p>
      )}
    </aside>
  );
}
