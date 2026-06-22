"use client";

import { ACHIEVEMENTS, type Snapshot } from "./knowledgeData";
import s from "./knowledge.module.css";

/** Meaningful discoveries — moments of the journey, not points. */
export default function AchievementArchive({ snap }: { snap: Snapshot }) {
  return (
    <div className={s.achievements}>
      {ACHIEVEMENTS.map((a) => {
        const earned = a.check(snap);
        return (
          <div key={a.id} className={`${s.ach} ${earned ? s.achEarned : ""}`}>
            <span className={s.achMark} aria-hidden="true">
              {earned ? "✦" : "○"}
            </span>
            <div>
              <span className={s.achName}>{a.name}</span>
              <span className={s.achDesc}>{a.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
