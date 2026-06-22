"use client";

import { useUniverseStore } from "@/store/universeStore";
import { REALM_BY_SLUG } from "@/lib/realms";
import { CREATOR } from "@/lib/creator";
import s from "./chambers.module.css";

/**
 * The Architect's Core — the Creator Chamber (canon doc 4 §1).
 * Answers "Who built this universe?" as a Journey Archive, not a résumé.
 * Knowledge DNA links each trait back to the realm that forged it.
 */
export default function ArchitectCore({ onExit }: { onExit: () => void }) {
  const enterRealm = useUniverseStore((st) => st.enterRealm);

  return (
    <main className={s.chamber} data-realm="architect-core" aria-label="The Architect's Core">
      <div className={s.flash} aria-hidden="true" />

      <header className={s.head}>
        <button type="button" className={s.exit} onClick={onExit}>
          ◁ Universe Map
        </button>
        <p className={s.kicker}>THE ARCHITECT'S CORE · WHO BUILT THIS UNIVERSE</p>
        <h1 className={s.title}>{CREATOR.identity}</h1>
        <p className={s.lede}>{CREATOR.oneLine}</p>
      </header>

      <section className={s.section}>
        <blockquote className={s.quote}>“{CREATOR.originQuestion}”</blockquote>
        <p className={s.body}>{CREATOR.originStory}</p>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>The Journey</h2>
        <ol className={s.journey}>
          {CREATOR.journey.map((step, i) => (
            <li key={step.phase} className={s.jstep}>
              <span className={s.jindex}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <span className={s.jphase}>{step.phase}</span>
                <p className={s.jtext}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Focus</h2>
        <div className={s.chips}>
          {CREATOR.focus.map((f) => (
            <span key={f} className={s.chip}>
              {f}
            </span>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Knowledge DNA</h2>
        <p className={s.body}>How each realm of the universe shaped its architect. Follow a strand back to its source.</p>
        <div className={s.dna}>
          {CREATOR.dna.map((strand) => {
            const r = REALM_BY_SLUG[strand.slug];
            return (
              <button
                key={strand.slug}
                type="button"
                className={s.dnaItem}
                style={{ ["--rp" as string]: r?.colors.primary ?? "var(--realm-primary)" }}
                onClick={() => enterRealm(strand.slug)}
                aria-label={`Travel to ${r?.name ?? strand.slug}`}
              >
                <span className={s.dnaName}>{r?.name ?? strand.slug}</span>
                <span className={s.dnaTrait}>{strand.trait}</span>
                <span className={s.dnaNote}>{strand.note}</span>
              </button>
            );
          })}
        </div>
      </section>

      <footer className={s.foot}>
        <button type="button" className={s.next} onClick={() => enterRealm("the-observatory")}>
          Continue to The Observatory →
        </button>
      </footer>
    </main>
  );
}
