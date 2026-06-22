"use client";

import { REALM_BY_SLUG } from "@/lib/realms";
import { pathProgress, type LearningPathDef } from "./knowledgeData";
import s from "./knowledge.module.css";

/** One learning path — a route through the realms, with real progress. */
export default function LearningPath({
  path,
  visited,
  onTravel,
}: {
  path: LearningPathDef;
  visited: string[];
  onTravel: (slug: string) => void;
}) {
  const { done, total } = pathProgress(path, visited);

  return (
    <div className={s.path}>
      <div className={s.pathHead}>
        <span className={s.pathName}>{path.name}</span>
        <span className={s.pathCount}>
          {done}/{total}
        </span>
      </div>
      <p className={s.pathIntro}>{path.intro}</p>
      <div className={s.pathStages}>
        {path.stages.map((slug, i) => {
          const realm = REALM_BY_SLUG[slug];
          const reached = visited.includes(slug);
          return (
            <span key={slug} className={s.stageWrap}>
              <button
                type="button"
                className={`${s.stage} ${reached ? s.stageDone : ""}`}
                style={{ ["--rp" as string]: realm?.colors.primary ?? "var(--realm-primary)" }}
                onClick={() => onTravel(slug)}
              >
                {realm?.name ?? slug}
              </button>
              {i < path.stages.length - 1 && <span className={s.stageArrow} aria-hidden="true">→</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}
