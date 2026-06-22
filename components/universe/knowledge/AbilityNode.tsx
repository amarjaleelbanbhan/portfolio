"use client";

import { REALM_BY_SLUG } from "@/lib/realms";
import type { Ability, AbilityState } from "./knowledgeData";
import s from "./knowledge.module.css";

/** One ability — a transformation, not a badge. Travels to its source realm. */
export default function AbilityNode({
  ability,
  state,
  onTravel,
}: {
  ability: Ability;
  state: AbilityState;
  onTravel: (slug: string) => void;
}) {
  const realm = REALM_BY_SLUG[ability.source];
  const cls =
    state === "mastered" ? s.abilityMastered : state === "locked" ? s.abilityLocked : "";

  return (
    <button
      type="button"
      className={`${s.ability} ${cls}`}
      style={{ ["--rp" as string]: realm?.colors.primary ?? "var(--realm-primary)" }}
      onClick={() => onTravel(ability.source)}
      aria-label={`${ability.name} — ${state}. Travel to ${realm?.name ?? ability.source}`}
    >
      <span className={s.aState}>
        {state === "mastered" ? "◆ MASTERED" : state === "unlocked" ? "◇ AWAKENED" : "· LOCKED"}
      </span>
      <span className={s.aName}>{ability.name}</span>
      <span className={s.aMeaning}>{ability.meaning}</span>
      <span className={s.aFrom}>
        {state === "locked" ? `Explore ${realm?.name ?? ability.source} to awaken` : `from ${realm?.name ?? ability.source}`}
      </span>
      <span className={s.aChips}>
        {ability.usedIn.map((u) => (
          <span key={u} className={s.aChip}>
            {u}
          </span>
        ))}
      </span>
    </button>
  );
}
