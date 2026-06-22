"use client";

import { useState } from "react";
import { useUniverseStore } from "@/store/universeStore";
import { INVENTIONS, INVENTION_BY_ID, CLASS_META } from "./inventionData";
import InventionDossier from "./InventionDossier";
import s from "./inventions.module.css";

/**
 * The Invention Archive (canon doc 7 §VII) — the cross-realm vault where
 * projects live as inventions. Sealed blueprint cases the visitor discovers,
 * not cards on a grid. Selecting a case declassifies its dossier.
 */
export default function InventionArchive({ onExit }: { onExit: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const enterRealm = useUniverseStore((st) => st.enterRealm);
  const open = openId ? INVENTION_BY_ID[openId] : undefined;

  const flagships = INVENTIONS.filter((i) => i.visibility === "private");
  const works = INVENTIONS.filter((i) => i.visibility === "public");

  const renderCase = (id: string) => {
    const inv = INVENTION_BY_ID[id];
    const meta = CLASS_META[inv.classRoman];
    return (
      <button
        key={inv.id}
        type="button"
        className={s.case}
        style={{ ["--rp" as string]: meta.color }}
        onClick={() => setOpenId(inv.id)}
        aria-label={`Open ${inv.name} dossier`}
      >
        <span className={s.caseGlyph} aria-hidden="true">
          {meta.glyph}
        </span>
        <span className={s.caseClass}>
          {meta.label} · CLASS {inv.classRoman}
        </span>
        <span className={s.caseName}>{inv.name}</span>
        <span className={s.caseTagline}>{inv.tagline}</span>
        <span className={s.caseStatus}>{inv.status}</span>
      </button>
    );
  };

  return (
    <main className={s.archive} data-realm="invention-archive" aria-label="The Invention Archive">
      <div className={s.flash} aria-hidden="true" />

      <header className={s.header}>
        <button type="button" className={s.exit} onClick={onExit}>
          ◁ Universe Map
        </button>
        <div className={s.brand}>
          <h1 className={s.brandTitle}>THE INVENTION ARCHIVE</h1>
          <p className={s.brandSub}>Where knowledge became reality — projects as inventions.</p>
        </div>
      </header>

      <section className={s.group} aria-label="Flagship inventions">
        <p className={s.groupLabel}>Flagship Inventions</p>
        <div className={s.grid}>{flagships.map((i) => renderCase(i.id))}</div>
      </section>

      <section className={s.group} aria-label="Public works">
        <p className={s.groupLabel}>Public Works · converted from the field</p>
        <div className={s.grid}>{works.map((i) => renderCase(i.id))}</div>
      </section>

      {open && (
        <InventionDossier
          invention={open}
          onEnterRealm={(slug) => {
            setOpenId(null);
            enterRealm(slug);
          }}
          onClose={() => setOpenId(null)}
        />
      )}
    </main>
  );
}
