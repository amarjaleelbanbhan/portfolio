"use client";

import type { District } from "./realmContent";
import { useUniverseStore } from "@/store/universeStore";
import HolographicPanel from "../environments/HolographicPanel";
import s from "./realm.module.css";

/** Renders one depth district: lede + a grid of explorable topic cards. */
export default function RealmDistrict({ district }: { district: District }) {
  const currentRealm = useUniverseStore((s) => s.currentRealm);
  const isSiliconFoundry = currentRealm === "silicon-foundry";

  return (
    <section className={s.district} aria-label={district.name}>
      <p className={s.dlabel}>{district.layerLabel}</p>
      <h2 className={s.dname}>{district.name}</h2>
      <p className={s.intro}>{district.intro}</p>
      <ul className={s.topics}>
        {district.topics.map((t) => {
          const cardContent = (
            <>
              <h3 className={s.topicName}>{t.name}</h3>
              <p className={s.topicBlurb}>{t.blurb}</p>
            </>
          );

          return isSiliconFoundry ? (
            <li key={t.name}>
              <HolographicPanel className={s.topicHolo}>
                {cardContent}
              </HolographicPanel>
            </li>
          ) : (
            <li key={t.name} className={s.topic}>
              {cardContent}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
