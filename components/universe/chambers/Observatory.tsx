"use client";

import { useEffect, useState } from "react";
import { useUniverseStore } from "@/store/universeStore";
import { CREATOR } from "@/lib/creator";
import { personalInfo } from "@/data/portfolio";
import ArchitectFinale from "./ArchitectFinale";
import s from "./chambers.module.css";

/** Same realm-visit threshold used by the "Cartographer" achievement (knowledgeData.ts). */
const CARTOGRAPHER_THRESHOLD = 6;

/**
 * The Observatory — the ending chapter (canon doc 4 §8 / doc 2 Act 6).
 * "The journey never ends." Future direction + a Transmission System (channels,
 * not a form first): connect, explore work, collaborate. Real professional links.
 */
export default function Observatory({ onExit }: { onExit: () => void }) {
  const exitToMap = useUniverseStore((st) => st.exitRealm);
  const visitedRealms = useUniverseStore((st) => st.visitedRealms);
  const masterJourneyCompleted = useUniverseStore((st) => st.masterJourneyCompleted);
  const architectFinaleShown = useUniverseStore((st) => st.architectFinaleShown);
  const setArchitectFinaleShown = useUniverseStore((st) => st.setArchitectFinaleShown);

  const earnedFinale =
    masterJourneyCompleted || visitedRealms.length >= CARTOGRAPHER_THRESHOLD;
  const [showFinale, setShowFinale] = useState(false);

  // One-time: if earned and not yet shown this session/ever, play it once.
  useEffect(() => {
    if (earnedFinale && !architectFinaleShown) {
      setShowFinale(true);
      setArchitectFinaleShown(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [earnedFinale, architectFinaleShown]);

  const channels = [
    { label: "CONNECT", value: "LinkedIn", href: personalInfo.social.linkedin, blank: true },
    { label: "EXPLORE WORK", value: "GitHub", href: personalInfo.social.github, blank: true },
    { label: "TRANSMIT", value: personalInfo.email, href: `mailto:${personalInfo.email}`, blank: false },
  ];

  return (
    <main className={s.chamber} data-realm="the-observatory" aria-label="The Observatory">
      <div className={s.flash} aria-hidden="true" />

      <header className={s.head}>
        <button type="button" className={s.exit} onClick={onExit}>
          ◁ Universe Map
        </button>
        <p className={s.kicker}>THE OBSERVATORY · THE FINAL CHAPTER</p>
        <h1 className={s.title}>The journey never ends.</h1>
        <p className={s.lede}>You have traversed the universe. One question remains — what comes next?</p>
      </header>

      {showFinale && (
        <section className={s.section} aria-label="A message from the Architect">
          <h2 className={s.sectionTitle}>The Architect</h2>
          <ArchitectFinale />
        </section>
      )}

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Current Mission</h2>
        <p className={s.mission}>{CREATOR.mission}</p>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Future Direction</h2>
        <div className={s.chips}>
          {CREATOR.futureInterests.map((f) => (
            <span key={f} className={s.chip}>
              {f}
            </span>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>On the Horizon</h2>
        <div className={s.horizon}>
          {CREATOR.horizon.map((h) => (
            <span key={h} className={s.hItem}>
              ◌ {h}
            </span>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Transmission System</h2>
        <p className={s.invitation}>{CREATOR.invitation}</p>
        <div className={s.transmission}>
          {channels.map((c) => (
            <a
              key={c.label}
              className={s.channel}
              href={c.href}
              target={c.blank ? "_blank" : undefined}
              rel={c.blank ? "noopener noreferrer" : undefined}
            >
              <span className={s.channelLabel}>{c.label}</span>
              <span className={s.channelValue}>{c.value} ↗</span>
            </a>
          ))}
        </div>
      </section>

      <footer className={s.foot}>
        <p className={s.closing}>
          Signal open. The rest, if you&rsquo;re curious, is a conversation away.
        </p>
        <button type="button" className={s.next} onClick={exitToMap}>
          ↺ Return to the universe
        </button>
      </footer>
    </main>
  );
}
