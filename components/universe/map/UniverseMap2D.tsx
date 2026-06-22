"use client";

import { PLACEMENTS, EDGES, PLACEMENT_BY_SLUG } from "./realmLayout";
import styles from "./UniverseMap2D.module.css";

/** map normalized (-1..1) coords → viewport percentage */
const px = (nx: number) => 50 + nx * 42;
const py = (ny: number) => 50 - ny * 42;

/**
 * Non-WebGL fallback (canon doc 5 §8.2 tier-0). Same realms, colors and
 * relationship graph as the 3D map — rendered as accessible buttons + SVG
 * connections. Fully keyboard-navigable.
 */
export default function UniverseMap2D({
  active,
  onHover,
  onSelect,
}: {
  active: string | null;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className={styles.map}>
      <svg className={styles.edges} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {EDGES.map((e, i) => {
          const a = PLACEMENT_BY_SLUG[e.from];
          const b = PLACEMENT_BY_SLUG[e.to];
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={px(a.nx)}
              y1={py(a.ny)}
              x2={px(b.nx)}
              y2={py(b.ny)}
              className={styles.edge}
            />
          );
        })}
      </svg>

      {PLACEMENTS.map((p) => (
        <button
          key={p.slug}
          type="button"
          className={`${styles.node} ${active === p.slug ? styles.active : ""} ${
            p.slug === "architect-core" ? styles.core : ""
          }`}
          style={{
            left: `${px(p.nx)}%`,
            top: `${py(p.ny)}%`,
            ["--rp" as string]: p.realm.colors.primary,
          }}
          aria-label={`${p.realm.name} — ${p.realm.identity}`}
          aria-current={active === p.slug ? "true" : undefined}
          onMouseEnter={() => onHover(p.slug)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(p.slug)}
          onBlur={() => onHover(null)}
          onClick={() => onSelect(p.slug)}
        >
          <span className={styles.orb} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
