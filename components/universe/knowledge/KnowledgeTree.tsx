"use client";

import { BRANCHES, abilityState, type Snapshot } from "./knowledgeData";
import AbilityNode from "./AbilityNode";
import s from "./knowledge.module.css";

/** The five mastery branches and their abilities. */
export default function KnowledgeTree({
  snap,
  onTravel,
}: {
  snap: Snapshot;
  onTravel: (slug: string) => void;
}) {
  return (
    <div className={s.tree}>
      {BRANCHES.map((branch) => (
        <section key={branch.id} className={s.branch} aria-label={branch.name}>
          <h3 className={s.branchName}>{branch.name}</h3>
          <p className={s.branchIntro}>{branch.intro}</p>
          <div className={s.abilities}>
            {branch.abilities.map((a) => (
              <AbilityNode key={a.id} ability={a} state={abilityState(a, snap)} onTravel={onTravel} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
