"use client";

import type { Invention } from "./inventionData";
import s from "./inventions.module.css";

/**
 * The invention's narrative arc as a vertical timeline (canon doc 7 story
 * structure): Origin → Problem → Challenge → Results → Lessons → Future.
 * Only the steps present on the invention are shown.
 */
export default function EngineeringTimeline({ invention }: { invention: Invention }) {
  const steps: { label: string; body: string | string[] }[] = [];
  if (invention.origin) steps.push({ label: "Origin", body: invention.origin });
  if (invention.problem) steps.push({ label: "The Problem", body: invention.problem });
  if (invention.challenge) steps.push({ label: "Engineering Challenge", body: invention.challenge });
  if (invention.results?.length) steps.push({ label: "Results", body: invention.results });
  if (invention.lessons?.length) steps.push({ label: "Lessons Learned", body: invention.lessons });
  if (invention.future) steps.push({ label: "Future Evolution", body: invention.future });

  if (steps.length === 0) return null;

  return (
    <ol className={s.timeline}>
      {steps.map((step) => (
        <li key={step.label} className={s.step}>
          <span className={s.stepLabel}>{step.label}</span>
          {Array.isArray(step.body) ? (
            <ul className={s.stepList}>
              {step.body.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : (
            <p className={s.stepText}>{step.body}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
