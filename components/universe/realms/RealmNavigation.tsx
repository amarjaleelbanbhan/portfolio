"use client";

import type { District, DistrictId } from "./realmContent";
import s from "./realm.module.css";

/** District switcher + return-to-map. Reusable across realms. */
export default function RealmNavigation({
  districts,
  active,
  archiveUnlocked,
  onSelect,
  onExit,
}: {
  districts: District[];
  active: DistrictId;
  archiveUnlocked: boolean;
  onSelect: (id: DistrictId) => void;
  onExit: () => void;
}) {
  return (
    <nav className={s.nav} aria-label="Realm districts">
      <button type="button" className={s.exit} onClick={onExit}>
        ◁ Universe Map
      </button>
      <div className={s.tabs} role="tablist">
        {districts.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={active === d.id}
            className={`${s.tab} ${active === d.id ? s.tabActive : ""}`}
            onClick={() => onSelect(d.id)}
          >
            {d.name}
            {d.gated && !archiveUnlocked && (
              <span className={s.lock} aria-label="locked">
                {" "}
                🔒
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
