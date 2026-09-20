/**
 * One research entry.
 *
 * Every block renders only when the canonical record actually carries it, which
 * is what lets the same component render a completed factorial with published
 * results and a final-year project whose repository contains a README. There is
 * no per-project branching here; the content decides what appears, and an entry
 * with nothing to show renders nothing rather than an empty heading.
 *
 * The one piece of deliberate emphasis is the research question. It is set as a
 * pull quote at the top of every entry because it is the only thing that makes
 * the rest of the entry worth reading, and because a research page that opens
 * with a technology list has already lost the plot.
 *
 * Detail lives in the case study. This page links there rather than reproducing
 * architecture, decisions and disclosure — the exception being the experiment
 * matrix, the findings and the correction, which are the research and not the
 * engineering write-up.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import ExperimentMatrix from '@/components/case-study/ExperimentMatrix';
import { ResearchCorrection, ResearchFindings } from '@/components/case-study/ResearchFindings';
import EvidenceBreakdown from '@/components/research/EvidenceBreakdown';
import ProofBadge from '@/components/ui/ProofBadge';
import { getDomainColor } from '@/lib/content';
import { fadeUp } from '@/lib/motion';

export default function ResearchEntry({ overview, reduced = false }) {
  const { research, categoryMeta, project, caseStudyHref, evidence, proof, gaps } = overview;
  const study = project?.caseStudy;
  const accent = getDomainColor('research');
  const headingId = `research-${research.slug}-heading`;

  // The title carries a subtitle after an em dash; the heading wants the name
  // and the lede wants the rest.
  const [name, subtitle] = research.title.split(' — ');

  return (
    <motion.article
      id={`research-${research.slug}`}
      aria-labelledby={headingId}
      {...fadeUp()}
      className="scroll-mt-24 pt-10 border-t border-white/5"
      data-domain="research"
    >
      {/* ── Identity ── */}
      <p className="font-code text-[10px] uppercase tracking-[0.22em] mb-2" style={{ color: accent }}>
        {categoryMeta.label}
      </p>
      <h2
        id={headingId}
        className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight m-0"
      >
        {name}
      </h2>
      {subtitle && (
        <p className="text-base text-slate-400 leading-relaxed max-w-2xl mt-1.5">{subtitle}</p>
      )}

      <p className="mt-3 inline-flex items-center gap-2 font-code text-[11px] px-2.5 py-1 rounded-md"
        style={{ color: accent, background: `${accent}12`, border: `1px solid ${accent}2e` }}
      >
        {research.publicStage}
      </p>

      {/* ── The question ── */}
      <div className="mt-6 pl-4 sm:pl-5 border-l-2" style={{ borderColor: `${accent}66` }}>
        <p className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
          The question
        </p>
        <p className="text-lg sm:text-xl text-slate-100 leading-snug max-w-3xl text-balance m-0">
          {research.researchQuestion}
        </p>
      </div>

      {/* ── Method and data ── */}
      {(research.method || research.dataset) && (
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 m-0">
          {research.method && (
            <div>
              <dt className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                Method
              </dt>
              <dd className="m-0 text-sm text-slate-300 leading-relaxed">{research.method}</dd>
            </div>
          )}
          {research.dataset && (
            <div>
              <dt className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                Data
              </dt>
              <dd className="m-0 text-sm text-slate-300 leading-relaxed">{research.dataset}</dd>
            </div>
          )}
        </dl>
      )}

      {/* ── What the study found, in the record's own words ── */}
      {research.results && (
        <div className="mt-6 surface-card p-5" style={{ borderColor: `${accent}2e` }}>
          <p className="font-code text-[10px] uppercase tracking-[0.2em] mb-1.5" style={{ color: accent }}>
            Result
          </p>
          <p className="text-base text-slate-200 leading-relaxed m-0 max-w-3xl">
            {research.results}
          </p>
        </div>
      )}

      {proof.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {proof.map((item) => (
            <ProofBadge key={item.id} proof={item} />
          ))}
        </div>
      )}

      {/* ── The experiment, its findings and its correction ──
          Rendered here rather than only in the case study because these are the
          research itself, not the engineering write-up around it. Each returns
          null when the record does not carry it. */}
      <div className="mt-8">
        <ExperimentMatrix experiment={study?.experiment} accent={accent} reduced={reduced} as="h3" />
        <ResearchFindings findings={study?.findings} accent={accent} as="h3" />
        <ResearchCorrection correction={study?.correction} accent={accent} as="h3" />
      </div>

      {/* ── Evidence breakdown ── */}
      <div className="mt-2">
        <EvidenceBreakdown evidence={evidence} headingId={`evidence-${research.slug}`} />
      </div>

      {/* ── Gaps the project states about itself ──
          Verification activities the case study records as implemented but not
          independently evidenced. Kept separate from the ledger because they
          qualify work that exists rather than being items in their own right —
          "the native stack has not been verified on a device" is a caveat on
          the transport, not a ninth protocol step. */}
      {gaps.length > 0 && (
        <div className="mt-8">
          <h3 className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3">
            Stated gaps
          </h3>
          <ul className="list-none m-0 p-0 grid gap-2.5 sm:grid-cols-2">
            {gaps.map((gap) => (
              <li key={gap.id} className="surface-card p-4">
                <p className="text-sm font-medium text-slate-200 m-0 flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 border"
                    style={{ borderColor: '#f59e0b', background: 'transparent' }}
                  />
                  {gap.label}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed m-0 mt-1 pl-3.5">
                  {gap.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Limitations ── */}
      {(research.limitations ?? []).length > 0 && (
        <div className="mt-8">
          <h3 className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3">
            What this does not establish
          </h3>
          <ul className="list-none m-0 p-0 space-y-2 max-w-3xl">
            {research.limitations.map((limitation) => (
              <li
                key={limitation}
                className="flex items-start gap-2.5 text-sm text-slate-400 leading-relaxed"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 shrink-0"
                />
                {limitation}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Where to read more ── */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        {caseStudyHref && (
          <Link
            href={caseStudyHref}
            className="font-code text-xs font-semibold px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-lg border transition-colors"
            style={{ borderColor: `${accent}66`, color: accent }}
          >
            Read the full case study →
          </Link>
        )}
        <p className="font-code text-[11px] text-slate-600 m-0">
          {research.source.visibility === 'public' && research.source.repositoryUrl ? (
            <a
              href={research.source.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-[44px] sm:min-h-0 hover:text-neon-cyan transition-colors"
            >
              {'// source: repository'}
            </a>
          ) : (
            `// ${research.source.label ?? 'source not public'}`
          )}
        </p>
      </div>
    </motion.article>
  );
}
