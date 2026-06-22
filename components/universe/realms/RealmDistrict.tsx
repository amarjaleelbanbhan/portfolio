"use client";

import type { District } from "./realmContent";
import s from "./realm.module.css";

/** Renders one depth district: lede + a grid of explorable topic cards. */
export default function RealmDistrict({ district }: { district: District }) {
  return (
    <section className={s.district} aria-label={district.name}>
      <p className={s.dlabel}>{district.layerLabel}</p>
      <h2 className={s.dname}>{district.name}</h2>
      <p className={s.intro}>{district.intro}</p>
      <ul className={s.topics}>
        {district.topics.map((t) => (
          <li key={t.name} className={s.topic}>
            <h3 className={s.topicName}>{t.name}</h3>
            <p className={s.topicBlurb}>{t.blurb}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
