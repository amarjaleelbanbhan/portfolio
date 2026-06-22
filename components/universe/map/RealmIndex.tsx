"use client";

import { useState } from "react";
import { PLACEMENTS, LAYER_ORDER, type RealmPlacement } from "./realmLayout";
import HolographicPanel from "../environments/HolographicPanel";
import styles from "./RealmIndex.module.css";

/**
 * Accessible, keyboard-navigable index of all realms, grouped by conceptual
 * layer (canon doc 5 §9.3 — the parallel keyboard nav for the 3D map; also the
 * map legend). Focus/hover highlights the realm; Enter/click prepares travel.
 */
export default function RealmIndex({
  active,
  onHover,
  onSelect,
}: {
  active: string | null;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
}) {
  // collapsed by default to keep the world view dominant
  const [open, setOpen] = useState(false);

  const groups = LAYER_ORDER.map((layer) => ({
    layer,
    items: PLACEMENTS.filter((p) => p.layer === layer),
  })).filter((g) => g.items.length > 0);

  return (
    <nav className={styles.index} aria-label="Universe realm index">
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "✕ CLOSE NAV" : "☰ NAVIGATE"}
      </button>

      {open && (
        <HolographicPanel title="ARCHITECT NAVIGATION INTERFACE" className={styles.scroll}>
          {groups.map((g) => (
            <div key={g.layer} className={styles.group}>
              <p className={styles.layerLabel}>{g.layer}</p>
              {g.items.map((p: RealmPlacement) => (
                <button
                  key={p.slug}
                  type="button"
                  className={styles.item}
                  aria-current={active === p.slug ? "true" : undefined}
                  style={{ ["--rp" as string]: p.realm.colors.primary }}
                  onMouseEnter={() => onHover(p.slug)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(p.slug)}
                  onBlur={() => onHover(null)}
                  onClick={() => onSelect(p.slug)}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  {p.realm.name}
                </button>
              ))}
            </div>
          ))}
        </HolographicPanel>
      )}
    </nav>
  );
}
