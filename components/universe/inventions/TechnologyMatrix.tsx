"use client";

import type { TechMaterial } from "./inventionData";
import s from "./inventions.module.css";

/** Technologies presented as a craftsman's material list, not a logo strip. */
export default function TechnologyMatrix({ tech }: { tech: TechMaterial[] }) {
  return (
    <ul className={s.tech}>
      {tech.map((t) => (
        <li key={t.name} className={s.techItem}>
          <span className={s.techName}>{t.name}</span>
          {t.role && <span className={s.techRole}>{t.role}</span>}
        </li>
      ))}
    </ul>
  );
}
