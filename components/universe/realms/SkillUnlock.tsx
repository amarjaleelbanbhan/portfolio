"use client";

import { useEffect } from "react";
import type { RealmSkill } from "./realmContent";
import s from "./realm.module.css";

/**
 * The "ABILITY UNLOCKED" reward (canon doc 4 Skills Unlocked). Foundation of
 * the RPG knowledge system — full skill tree comes in a later phase.
 */
export default function SkillUnlock({
  skill,
  onClose,
}: {
  skill: RealmSkill;
  onClose: () => void;
}) {
  useEffect(() => {
    const id = window.setTimeout(onClose, 9000);
    return () => window.clearTimeout(id);
  }, [onClose]);

  return (
    <div className={s.toast} role="status" aria-live="polite">
      <button type="button" className={s.tclose} onClick={onClose} aria-label="Dismiss">
        ×
      </button>
      <p className={s.tkicker}>ABILITY UNLOCKED</p>
      <h3 className={s.tname}>{skill.name}</h3>
      <p className={s.torigin}>Obtained from {skill.origin}</p>
      <p className={s.teffect}>{skill.effect}</p>
      <div className={s.tchips}>
        {skill.usedIn.map((u) => (
          <span key={u} className={s.tchip}>
            {u}
          </span>
        ))}
      </div>
    </div>
  );
}
