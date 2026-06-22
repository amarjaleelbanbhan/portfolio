"use client";

import { useUniverseStore } from "@/store/universeStore";
import { getRealmKnowledge } from "@/lib/environments/registry";
import HolographicPanel from "./HolographicPanel";
import type { KnowledgeLevel } from "@/lib/environments/types";
import s from "./FloatingHUDPanel.module.css";

export default function FloatingHUDPanel() {
  const currentRealm = useUniverseStore((state) => state.currentRealm);
  const activeLandmarkId = useUniverseStore((state) => state.activeLandmark);
  const activeLevel = useUniverseStore((state) => state.activeLevel);
  
  const selectLandmark = useUniverseStore((state) => state.selectLandmark);
  const setLevel = useUniverseStore((state) => state.setLevel);
  const enterRealm = useUniverseStore((state) => state.enterRealm);

  if (!currentRealm || !activeLandmarkId) return null;

  const knowledge = getRealmKnowledge(currentRealm);
  if (!knowledge) return null;

  const landmark = knowledge.landmarks.find((l) => l.id === activeLandmarkId);
  if (!landmark) return null;

  const levels: { id: KnowledgeLevel; label: string }[] = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "expert", label: "Expert" },
  ];

  const handleRealmClick = (realmSlug: string) => {
    enterRealm(realmSlug);
    selectLandmark(null); // Clear selected landmark on navigation
  };

  const handleProjectClick = () => {
    enterRealm("invention-archive");
    selectLandmark(null);
  };

  const explanation = landmark.howItWorks[activeLevel];

  const diffClass = landmark.difficultyLevel.toLowerCase();

  return (
    <div className={s.hudWrapper}>
      <HolographicPanel title={landmark.name} glowColor="var(--realm-primary)">
        <div className={s.hudHeader}>
          <h3 className={s.hudTitle}>{landmark.name}</h3>
          <button
            type="button"
            className={s.closeButton}
            onClick={() => selectLandmark(null)}
            aria-label="Close HUD"
          >
            &times;
          </button>
        </div>

        <div className={s.badgeRow}>
          <span className={`${s.difficultyBadge} ${s[diffClass]}`}>
            {landmark.difficultyLevel}
          </span>
        </div>

        <p className={s.hudSubtitle}>{landmark.whatIsIt}</p>

        {/* Level Tabs */}
        <div className={s.levelTabs} role="tablist" aria-label="Explanation difficulty level">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              role="tab"
              type="button"
              aria-selected={activeLevel === lvl.id}
              className={`${s.tabButton} ${activeLevel === lvl.id ? s.activeTab : ""}`}
              onClick={() => setLevel(lvl.id)}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Why Learn This */}
        <div className={s.infoSection}>
          <span className={s.sectionLabel}>Why study this?</span>
          <p className={s.sectionText}>{landmark.whyMatters}</p>
        </div>

        {/* How It Works (Progressive tab content) */}
        <div className={s.infoSection}>
          <span className={s.sectionLabel}>How it works internally</span>
          <p className={s.sectionText}>{explanation}</p>
        </div>

        {/* Where Used */}
        <div className={s.infoSection}>
          <span className={s.sectionLabel}>Where used</span>
          <p className={s.sectionText}>
            <code>{landmark.realUse}</code>
          </p>
        </div>

        {/* Unlocked Skills */}
        {landmark.skillsUnlocked.length > 0 && (
          <div className={s.infoSection}>
            <span className={s.sectionLabel}>Skills Unlocked</span>
            <div className={s.chipGroup}>
              {landmark.skillsUnlocked.map((skill, idx) => (
                <span key={idx} className={s.skillChip}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Connected Realms (Cross-Realm Relationships) */}
        {landmark.connectedRealms.length > 0 && (
          <div className={s.infoSection}>
            <span className={s.sectionLabel}>Connected Realms</span>
            <div className={s.chipGroup}>
              {landmark.connectedRealms.map((relSlug, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={s.realmChip}
                  onClick={() => handleRealmClick(relSlug)}
                >
                  {relSlug.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Connected Projects */}
        {landmark.connectedProjects.length > 0 && (
          <div className={s.infoSection}>
            <span className={s.sectionLabel}>Applied Projects</span>
            <div className={s.chipGroup}>
              {landmark.connectedProjects.map((proj, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={s.projectLink}
                  onClick={handleProjectClick}
                >
                  ✦ {proj.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </HolographicPanel>
    </div>
  );
}
