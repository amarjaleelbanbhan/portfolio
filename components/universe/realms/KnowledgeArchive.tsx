"use client";

import type { District } from "./realmContent";
import RealmDistrict from "./RealmDistrict";
import s from "./realm.module.css";

/**
 * The gated deepest layer (canon doc 4 §14.1). Sealed until the visitor
 * chooses to descend — the act of going deep unlocks the realm's skill.
 */
export default function KnowledgeArchive({
  district,
  unlocked,
  onUnlock,
}: {
  district: District;
  unlocked: boolean;
  onUnlock: () => void;
}) {
  if (unlocked) return <RealmDistrict district={district} />;

  return (
    <section className={s.gate} aria-label="Sealed deep archive">
      <p className={s.dlabel}>{district.layerLabel}</p>
      <h2 className={s.dname}>{district.name}</h2>
      <p className={s.gtext}>{district.intro}</p>
      <button type="button" className={s.unlock} onClick={onUnlock}>
        ▸ Descend into the Deep Archive
      </button>
    </section>
  );
}
