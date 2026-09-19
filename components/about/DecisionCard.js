/**
 * One recorded engineering decision, attributed to the project it came from.
 *
 * The case-study version of this (`TechnicalDecisions` in
 * `components/case-study/sections.js`) renders a project's decisions inside its
 * own page, where attribution is implicit. Here the framing is the other way
 * round — a reader is meeting the decision first — so the project name and the
 * link to the full case study are part of the card rather than the context.
 *
 * The trade-off is the emphasised field, and it is required by validation. A
 * decision listed without what it cost reads as an achievement, and the whole
 * reason this section exists is that it is not one.
 *
 * None of the text is written here: it is read from the project's own case
 * study, so this page and that page cannot disagree about what was decided.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

export default function DecisionCard({ decision, accent = 'var(--accent)', index = 0 }) {
  return (
    <motion.article
      {...fadeUp({ delay: Math.min(index, 4) * 0.05 })}
      className="surface-card p-5 flex flex-col h-full"
    >
      <div className="flex items-baseline gap-2 flex-wrap mb-2.5">
        <Link
          href={decision.href}
          className="font-code text-[10px] uppercase tracking-[0.2em] hover:brightness-125 transition-[filter] min-h-[44px] sm:min-h-[28px] inline-flex items-center"
          style={{ color: accent }}
        >
          {decision.projectLabel}
        </Link>
      </div>

      <h3 className="text-base font-semibold text-slate-100 leading-snug m-0 mb-3">
        {decision.title}
      </h3>

      <dl className="space-y-2.5 m-0 flex-1">
        <div>
          <dt className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Decision
          </dt>
          <dd className="text-sm text-slate-300 leading-relaxed m-0">{decision.decision}</dd>
        </div>
        <div>
          <dt className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500">Why</dt>
          <dd className="text-sm text-slate-400 leading-relaxed m-0">{decision.rationale}</dd>
        </div>
      </dl>

      {decision.tradeoff && (
        <div
          className="mt-3 pt-3 border-t"
          style={{ borderColor: 'rgba(245,158,11,0.22)' }}
        >
          <p
            className="font-code text-[10px] uppercase tracking-[0.2em] m-0 mb-1"
            style={{ color: '#f59e0b' }}
          >
            What it cost
          </p>
          <p className="text-sm text-slate-400 leading-relaxed m-0">{decision.tradeoff}</p>
        </div>
      )}
    </motion.article>
  );
}
