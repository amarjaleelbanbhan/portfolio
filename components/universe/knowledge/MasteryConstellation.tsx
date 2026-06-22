"use client";

import type { MasteryCounts } from "./knowledgeData";
import s from "./knowledge.module.css";

/** A quiet summary of understanding — not a score, a map of growth. */
export default function MasteryConstellation({
  counts,
  realmsExplored,
}: {
  counts: MasteryCounts;
  realmsExplored: number;
}) {
  const stat = (num: number, label: string) => (
    <div className={s.cStat}>
      <span className={s.cNum}>{num}</span>
      <span className={s.cLabel}>{label}</span>
    </div>
  );

  return (
    <div className={s.constellation}>
      {stat(counts.unlocked, "abilities awakened")}
      {stat(counts.mastered, "mastered")}
      {stat(realmsExplored, "realms explored")}
    </div>
  );
}
