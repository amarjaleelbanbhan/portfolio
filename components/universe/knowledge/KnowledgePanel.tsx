"use client";

import { useUniverseStore } from "@/store/universeStore";
import { REALM_BY_SLUG } from "@/lib/realms";
import { LEARNING_PATHS, masteryCounts, type Snapshot } from "./knowledgeData";
import MasteryConstellation from "./MasteryConstellation";
import KnowledgeTree from "./KnowledgeTree";
import LearningPath from "./LearningPath";
import AchievementArchive from "./AchievementArchive";
import s from "./knowledge.module.css";

/**
 * The Knowledge Mastery overlay — how learning CS transforms a person.
 * Everything is derived from real progress (visitedRealms + unlockedSkills).
 */
export default function KnowledgePanel() {
  const open = useUniverseStore((st) => st.knowledgeOpen);
  const toggle = useUniverseStore((st) => st.toggleKnowledge);
  const enterRealm = useUniverseStore((st) => st.enterRealm);
  const visitedRealms = useUniverseStore((st) => st.visitedRealms);
  const unlockedSkills = useUniverseStore((st) => st.unlockedSkills);
  const bootCompleted = useUniverseStore((st) => st.bootCompleted);

  if (!open) return null;

  const snap: Snapshot = { bootCompleted, visitedRealms, unlockedSkills };
  const counts = masteryCounts(snap);
  const realmsExplored = visitedRealms.filter((v) => REALM_BY_SLUG[v]).length;

  const onTravel = (slug: string) => {
    toggle(false);
    enterRealm(slug);
  };

  return (
    <div className={s.overlay} role="dialog" aria-modal="true" aria-label="Knowledge Mastery">
      <div className={s.sheet}>
        <button type="button" className={s.close} onClick={() => toggle(false)} aria-label="Close">
          ×
        </button>

        <header>
          <p className={s.ptitle}>KNOWLEDGE MASTERY</p>
          <p className={s.psub}>Abilities are not badges. They are transformations — knowledge become capability.</p>
        </header>

        <MasteryConstellation counts={counts} realmsExplored={realmsExplored} />

        <h2 className={s.sectionTitle}>Mastery Branches</h2>
        <KnowledgeTree snap={snap} onTravel={onTravel} />

        <h2 className={s.sectionTitle}>Learning Paths</h2>
        <div className={s.paths}>
          {LEARNING_PATHS.map((p) => (
            <LearningPath key={p.id} path={p} visited={visitedRealms} onTravel={onTravel} />
          ))}
        </div>

        <h2 className={s.sectionTitle}>Discoveries</h2>
        <AchievementArchive snap={snap} />
      </div>
    </div>
  );
}
