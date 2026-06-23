"use client";

import { useEffect, useState } from "react";
import { REALM_BY_SLUG } from "@/lib/realms";
import { useUniverseStore } from "@/store/universeStore";
import { getRealmContent, type DistrictId } from "./realmContent";
import { getSimulation } from "@/lib/simulations/registry";
import RealmHeader from "./RealmHeader";
import RealmNavigation from "./RealmNavigation";
import RealmDistrict from "./RealmDistrict";
import KnowledgeArchive from "./KnowledgeArchive";
import SkillUnlock from "./SkillUnlock";
import RealmSimulationStage from "../simulations/RealmSimulationStage";
import RealmEnvironment from "../environments/RealmEnvironment";
import FloatingHUDPanel from "../environments/FloatingHUDPanel";
import HolographicPanel from "../environments/HolographicPanel";
import RealmSignatureAction from "./RealmSignatureAction";
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

  // Realms with a registered simulation lead with it; everything else (the
  // current 11) renders exactly as before — this phase transforms ONE realm.
  const hasSimulation = !!getSimulation(slug);
  const [detailsOpen, setDetailsOpen] = useState(!hasSimulation);

  useEffect(() => {
    setActive("surface");
    setToast(false);
    setDetailsOpen(!hasSimulation);
  }, [slug, hasSimulation]);

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

  const isSiliconFoundry = slug === "silicon-foundry";

  const renderContent = () => (
    <div className={s.content}>
      <RealmHeader realm={realm} content={content} />

      <RealmSignatureAction slug={slug} />

      {hasSimulation && (
        isSiliconFoundry ? (
          <HolographicPanel className={s.stageHoloWrapper}>
            <RealmSimulationStage slug={slug} />
          </HolographicPanel>
        ) : (
          <RealmSimulationStage slug={slug} />
        )
      )}

      {/* Exit + district tabs are chrome, not content — always reachable. */}
      <RealmNavigation
        districts={content.districts}
        active={active}
        archiveUnlocked={archiveUnlocked}
        onSelect={(id) => {
          setActive(id);
          setDetailsOpen(true);
        }}
        onExit={onExit}
      />

      {hasSimulation && (
        <button
          type="button"
          className={s.detailsToggle}
          aria-expanded={detailsOpen}
          onClick={() => setDetailsOpen((o) => !o)}
        >
          {detailsOpen ? "▴ Hide the full archive" : "▾ Explore the full archive — details, if you want them"}
        </button>
      )}

      {(!hasSimulation || detailsOpen) && (
        <div className={s.body}>
          {activeDistrict.id === "archive" ? (
            isSiliconFoundry ? (
              <HolographicPanel>
                <KnowledgeArchive
                  district={activeDistrict}
                  unlocked={archiveUnlocked}
                  onUnlock={descend}
                />
              </HolographicPanel>
            ) : (
              <KnowledgeArchive
                district={activeDistrict}
                unlocked={archiveUnlocked}
                onUnlock={descend}
              />
            )
          ) : (
            <RealmDistrict district={activeDistrict} />
          )}
        </div>
      )}
    </div>
  );

  const isJourneyActive = useUniverseStore((st) => st.activeMasterJourneyPhase !== null);

  return (
    <main
      className={`${s.shell} ${s.enter}`}
      data-realm={slug}
      aria-label={`${realm.name} realm`}
      style={isJourneyActive ? { paddingBottom: "clamp(120px, 28vh, 180px)" } : undefined}
    >
      <div className={s.flash} aria-hidden="true" />
      {hasSimulation ? (
        <RealmEnvironment slug={slug}>
          {renderContent()}
          <FloatingHUDPanel />
        </RealmEnvironment>
      ) : (
        <>
          <div className={s.bgGrid} aria-hidden="true" />
          {renderContent()}
        </>
      )}

      {toast && <SkillUnlock skill={content.skill} onClose={() => setToast(false)} />}
    </main>
  );
}
