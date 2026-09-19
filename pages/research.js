/**
 * /research — executed research and research-driven engineering.
 *
 * The organising idea is a distinction, not a list. Four things that would all
 * read as "research" in a CV are separated by what actually exists behind them:
 * a completed factorial with published results and a published correction;
 * software built to answer a question that has not yet measured anything; a
 * protocol that runs on real hardware for part of its behaviour and in a
 * simulator for the rest; and a final-year project whose repository contains a
 * README.
 *
 * That distinction is made structurally, in the ledger, before it is made in
 * prose — because prose can make all four sound equivalent and a grid cannot.
 *
 * Everything factual is derived through `getResearchOverviews()`. The only
 * authored content in this file is framing copy, and none of it makes a claim
 * that the records do not already carry.
 *
 * ── Disclosure ───────────────────────────────────────────────────────────────
 * KnowledgeGuard's repository is private. What appears here is what the Phase
 * 10 review established is cleared by the project's own Tier P release policy:
 * per-cell scores, counts and statistics, with passage text and rendered
 * prompts removed. No benchmark passage, rendered prompt, question or gold
 * answer is reproduced, and this phase deliberately did not widen that
 * boundary — nothing was added whose publication status is ambiguous.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EvidenceLedger from '@/components/research/EvidenceLedger';
import ResearchEntry from '@/components/research/ResearchEntry';
import { EVIDENCE_ORDER, EVIDENCE_STATE } from '@/components/research/evidenceStates';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import { fadeUp } from '@/lib/motion';
import { getResearchCategories, getResearchOverviews } from '@/lib/content';

const overviews = getResearchOverviews();
const categories = getResearchCategories();

/** Totals across every entry, counted rather than written down. */
const totals = EVIDENCE_ORDER.reduce((acc, state) => {
  acc[state] = overviews.reduce((sum, overview) => sum + (overview.counts[state] ?? 0), 0);
  return acc;
}, {});

export default function Research() {
  const reduced = usePrefersReducedMotion();

  return (
    <>
      <Seo
        title="Research — Amar Jaleel"
        description="A completed RAG factorial with its published correction, security verification infrastructure that has not been evaluated yet, a BLE protocol tested on real phones, and a final-year project at the architecture stage."
        path="/research"
      />
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-1 section-container" data-domain="research">
          {/* ── Introduction ── */}
          <motion.div {...fadeUp()} className="mb-10">
            <p className="section-label">{'// research'}</p>
            <h1 className="section-heading max-w-3xl text-balance">
              Research, separated from the plans that look like it
            </h1>
            <p className="mt-3 text-slate-400 leading-relaxed max-w-2xl">
              One study here ran, produced results, and then produced a correction against its own
              headline finding. The rest are at earlier stages, and this page says which is which
              before it says anything else — because a research page where a completed experiment
              and a proposal read the same is not reporting research, it is advertising.
            </p>
          </motion.div>

          {/* ── What the categories mean ── */}
          <motion.section
            {...fadeUp({ delay: 0.05 })}
            aria-labelledby="categories-heading"
            className="mb-12"
          >
            <h2 id="categories-heading" className="sr-only">
              How this work is categorised
            </h2>
            <ol className="list-none m-0 p-0 grid gap-3 sm:grid-cols-2">
              {categories.map((category) => {
                const count = overviews.filter(
                  (o) => o.research.category === category.category
                ).length;
                return (
                  <li key={category.category} className="surface-card p-4">
                    <p className="flex items-baseline gap-2 m-0 mb-1.5">
                      <span className="text-sm font-semibold text-slate-100">{category.label}</span>
                      <span className="font-code text-[10px] text-slate-600 tabular-nums">
                        {count}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed m-0">
                      {category.description}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed m-0 mt-2 font-code">
                      {`// ${category.test}`}
                    </p>
                  </li>
                );
              })}
            </ol>
          </motion.section>

          {/* ── The ledger: the page's central artifact ── */}
          <EvidenceLedger overviews={overviews} reduced={reduced} />

          {/* ── Totals, as a legend rather than a headline ── */}
          <motion.div {...fadeUp()} className="mb-4">
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 m-0">
              {EVIDENCE_ORDER.map((state) => {
                const meta = EVIDENCE_STATE[state];
                return (
                  <div key={state} className="surface-card p-4">
                    <dd
                      className="text-2xl font-bold font-code tabular-nums m-0"
                      style={{ color: meta.color }}
                    >
                      {totals[state]}
                    </dd>
                    <dt className="text-xs text-slate-400 leading-tight mt-0.5">{meta.label}</dt>
                  </div>
                );
              })}
            </dl>
            <p className="font-code text-[11px] text-slate-600 mt-2.5">
              {'// documented items across all four entries — not a score, and not comparable between projects'}
            </p>
          </motion.div>

          {/* ── The entries ── */}
          <div className="space-y-4">
            {overviews.map((overview) => (
              <ResearchEntry
                key={overview.research.slug}
                overview={overview}
                reduced={reduced}
              />
            ))}
          </div>

          {/* ── Method note ── */}
          <section
            aria-labelledby="method-note-heading"
            className="mt-14 pt-8 border-t border-white/5"
          >
            <h2
              id="method-note-heading"
              className="text-base font-semibold text-slate-200 tracking-tight mb-2"
            >
              How this page is kept honest
            </h2>
            <ul className="list-none m-0 p-0 space-y-2 max-w-2xl">
              {[
                'Nothing on this page is written by hand about what exists. Every item in the ledger is derived from a canonical record — a measured finding, a protocol step with its own status, a verification rung, a pre-registered experiment — so a capability cannot be promoted by editing a sentence.',
                'A result and an implementation are different states and are never merged. Code that exists but has measured nothing reads as built, not as evidence.',
                'A simulation is evidence about the simulator. Where behaviour has only been simulated, it is labelled that way and is never counted with behaviour verified on hardware.',
                'KnowledgeGuard’s correction is published at the same weight as the result it corrects, and the experiments that have not been run are listed rather than omitted.',
                'KnowledgeGuard’s repository is private. Published here are measured scores, counts and statistics only — the categories its own release policy clears, with passage text and rendered prompts removed. No benchmark passage, prompt, question or gold answer is reproduced.',
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2.5 text-sm text-slate-400 leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 shrink-0"
                  />
                  {line}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-500 mt-4">
              The engineering these questions produced is on the{' '}
              <Link
                href="/work"
                className="text-neon-cyan hover:text-white underline decoration-dotted underline-offset-4"
              >
                work page
              </Link>
              , and the changes that went upstream are on{' '}
              <Link
                href="/open-source"
                className="text-neon-cyan hover:text-white underline decoration-dotted underline-offset-4"
              >
                open source
              </Link>
              .
            </p>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
