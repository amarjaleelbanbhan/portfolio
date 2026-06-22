"use client";

import { useRef } from "react";
import { useModalA11y } from "@/lib/useModalA11y";
import { CLASS_META, type Invention } from "./inventionData";
import EngineeringTimeline from "./EngineeringTimeline";
import SystemBlueprint from "./SystemBlueprint";
import TechnologyMatrix from "./TechnologyMatrix";
import ConceptLinks from "./ConceptLinks";
import s from "./inventions.module.css";

/** The full invention dossier — a classified file declassified in real time. */
export default function InventionDossier({
  invention,
  onEnterRealm,
  onClose,
}: {
  invention: Invention;
  onEnterRealm: (slug: string) => void;
  onClose: () => void;
}) {
  const meta = CLASS_META[invention.classRoman];
  const ref = useRef<HTMLDivElement>(null);
  useModalA11y(ref, onClose);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={s.dossier}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inv-title"
    >
      <div className={s.dossierInner} style={{ ["--rp" as string]: meta.color }}>
        <button type="button" className={s.dclose} onClick={onClose} aria-label="Close dossier">
          ×
        </button>

        <header className={s.dhead}>
          <span className={s.dglyph} aria-hidden="true">
            {meta.glyph}
          </span>
          <div>
            <p className={s.dclass}>
              {meta.label} · CLASS {invention.classRoman}
            </p>
            <h2 id="inv-title" className={s.dtitle}>{invention.name}</h2>
            <p className={s.dsub}>{invention.className}</p>
          </div>
        </header>

        <div className={s.dstatusRow}>
          <span className={s.dstatus}>{invention.status}</span>
          {invention.redacted && <span className={s.dredact}>CLASSIFIED · details shared on request</span>}
        </div>

        <p className={s.dtagline}>{invention.tagline}</p>

        {invention.nexusComment && (
          <blockquote className={s.nexusQuote}>
            <span className={s.nexusTag}>NEXUS</span>
            {invention.nexusComment}
          </blockquote>
        )}

        <EngineeringTimeline invention={invention} />

        {invention.architecture && invention.architecture.length > 0 && (
          <section className={s.section}>
            <h3 className={s.sectionTitle}>System Architecture</h3>
            <SystemBlueprint layers={invention.architecture} />
          </section>
        )}

        <section className={s.section}>
          <h3 className={s.sectionTitle}>Technologies Assembled</h3>
          <TechnologyMatrix tech={invention.technologies} />
        </section>

        <section className={s.section}>
          <h3 className={s.sectionTitle}>CS Realms Combined</h3>
          <ConceptLinks realms={invention.realms} onEnterRealm={onEnterRealm} />
        </section>

        {invention.links && invention.links.length > 0 && (
          <div className={s.links}>
            {invention.links.map((l) => (
              <a key={l.href} className={s.linkBtn} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
