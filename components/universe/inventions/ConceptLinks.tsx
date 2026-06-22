"use client";

import { REALM_BY_SLUG } from "@/lib/realms";
import s from "./inventions.module.css";

/**
 * The CS realms an invention combines — links back into the universe.
 * Clicking a realm travels there (knowledge → engineering → real systems).
 */
export default function ConceptLinks({
  realms,
  onEnterRealm,
}: {
  realms: string[];
  onEnterRealm: (slug: string) => void;
}) {
  return (
    <div className={s.realms}>
      {realms.map((slug) => {
        const r = REALM_BY_SLUG[slug];
        if (!r) return null;
        return (
          <button
            key={slug}
            type="button"
            className={s.realmChip}
            style={{ ["--rp" as string]: r.colors.primary }}
            onClick={() => onEnterRealm(slug)}
            aria-label={`Travel to ${r.name}`}
          >
            <span className={s.realmDot} aria-hidden="true" />
            {r.name}
          </button>
        );
      })}
    </div>
  );
}
