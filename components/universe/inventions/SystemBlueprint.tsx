"use client";

import type { ArchLayer } from "./inventionData";
import s from "./inventions.module.css";

/** The internal system architecture, rendered as stacked, labeled layers. */
export default function SystemBlueprint({ layers }: { layers: ArchLayer[] }) {
  return (
    <div className={s.blueprint}>
      {layers.map((l, i) => (
        <div key={l.layer} className={s.blayer} style={{ animationDelay: `${i * 70}ms` }}>
          <span className={s.blayerName}>{l.layer}</span>
          <span className={s.blayerDetail}>{l.detail}</span>
        </div>
      ))}
    </div>
  );
}
