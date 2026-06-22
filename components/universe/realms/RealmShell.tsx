"use client";

import { useEffect, useState } from "react";
import { REALM_BY_SLUG } from "@/lib/realms";
import { useUniverseStore } from "@/store/universeStore";
import { getRealmContent, type DistrictId } from "./realmContent";
import RealmHeader from "./RealmHeader";
import RealmNavigation from "./RealmNavigation";
import RealmDistrict from "./RealmDistrict";
import KnowledgeArchive from "./KnowledgeArchive";
import SkillUnlock from "./SkillUnlock";
import s from "./realm.module.css";

/**
 * The reusable realm engine. Renders any RealmContent as a living three-district
 * knowledge world with an arrival cinematic, district navigation, a gated deep
 * archive, and a skill unlock. `data-realm` scopes the realm's color theme.
 */
export default function RealmShell({
  slug,
  onExit,
}: {
  slug: string;
  onExit: () => void;
}) {
  const realm = REALM_BY_SLUG[slug];
  const content = getRealmContent(slug);
  const unlockedSkills = useUniverseStore((st) => st.unlockedSkills);
  const unlockSkill = useUniverseStore((st) => st.unlockSkill);

  const [active, setActive] = useState<DistrictId>("surface");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setActive("surface");
    setToast(false);
  }, [slug]);

  if (!realm || !content) {
    return (
      <main className={s.shell} data-realm={slug}>
        <div className={s.uncharted}>
          <p>This realm is not yet charted.</p>
          <button type="button" className={s.exit} onClick={onExit}>
            ◁ Return to the Universe Map
          </button>
        </div>
      </main>
    );
  }

  const archiveUnlocked = unlockedSkills.includes(content.skill.id);
  const activeDistrict =
    content.districts.find((d) => d.id === active) ?? content.districts[0];

  const descend = () => {
    if (!archiveUnlocked) {
      unlockSkill(content.skill.id);
      setToast(true);
    }
  };

  return (
    <main
      className={`${s.shell} ${s.enter}`}
      data-realm={slug}
      aria-label={`${realm.name} realm`}
    >
      <div className={s.flash} aria-hidden="true" />
      <div className={s.bgGrid} aria-hidden="true" />

      <div className={s.content}>
        <RealmHeader realm={realm} content={content} />

        <RealmNavigation
          districts={content.districts}
          active={active}
          archiveUnlocked={archiveUnlocked}
          onSelect={setActive}
          onExit={onExit}
        />

        <div className={s.body}>
          {activeDistrict.id === "archive" ? (
            <KnowledgeArchive
              district={activeDistrict}
              unlocked={archiveUnlocked}
              onUnlock={descend}
            />
          ) : (
            <RealmDistrict district={activeDistrict} />
          )}
        </div>
      </div>

      {toast && <SkillUnlock skill={content.skill} onClose={() => setToast(false)} />}
    </main>
  );
}
