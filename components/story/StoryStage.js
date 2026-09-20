/**
 * One stage of the engineering story.
 *
 * Everything a reader needs is text: heading, explanation, the labelled steps of
 * the pipeline, the verified evidence, the documented limitations and a link to
 * the project. The diagram beside it is a second telling of the same thing, not
 * the only telling — so keyboard users, screen-reader users, reduced-motion
 * users and anyone whose scripts have not finished loading get the full story.
 *
 * `showDiagram` is how the two layouts differ. On wide screens the diagram lives
 * in one sticky panel shared by all five stages, so it is rendered here only on
 * narrow screens, directly under the stage it belongs to.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import StatusBadge from '@/components/ui/StatusBadge';
import ProofBadge from '@/components/ui/ProofBadge';
import { fadeUp, stagger } from '@/lib/motion';
import StageDiagram from './StageDiagram';

export default function StoryStage({ stage, index, showDiagram = false, reduced = false }) {
  const { project } = stage;

  return (
    <section
      id={stage.id}
      data-domain={stage.domain}
      aria-labelledby={`${stage.id}-heading`}
      // scroll-mt clears the fixed navbar when the rail jumps here.
      className="scroll-mt-24 py-12 lg:py-20 border-t border-white/5 first:border-t-0"
    >
      <motion.div {...fadeUp({ delay: 0.02 })}>
        <p className="flex items-center gap-3 mb-3">
          <span className="font-code text-[11px] text-slate-600">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className="font-code text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: stage.color }}
          >
            {stage.kicker}
          </span>
          <span aria-hidden="true" className="h-px flex-1 max-w-16" style={{ background: `${stage.color}40` }} />
        </p>

        <h3
          id={`${stage.id}-heading`}
          className="text-2xl sm:text-3xl font-bold text-slate-50 leading-tight tracking-tight mb-3 text-balance"
        >
          {stage.title}
        </h3>

        {/* The project this stage is about, with the status it really has. */}
        {project && (
          <p className="flex items-center gap-2.5 flex-wrap mb-4">
            <Link
              href={stage.href}
              className="inline-flex items-center min-h-[44px] sm:min-h-0 font-code text-xs font-semibold text-slate-200 hover:text-white underline decoration-dotted underline-offset-4"
            >
              {project.shortTitle ?? project.title}
            </Link>
            <StatusBadge status={project.status} />
            {project.source.visibility !== 'public' && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-code">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {project.source.label ?? 'Private repository'}
              </span>
            )}
          </p>
        )}

        <p className="text-base text-slate-300 leading-relaxed max-w-2xl mb-3">{stage.lede}</p>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mb-6">{stage.body}</p>
      </motion.div>

      {/* Narrow screens: the diagram sits with its own stage. */}
      {showDiagram && (
        <motion.div {...fadeUp({ delay: 0.08 })} className="mb-6">
          <StageDiagram stage={stage} reduced={reduced} />
        </motion.div>
      )}

      {/* The pipeline as an ordered list. This is the semantic equivalent of the
          diagram: same steps, same order, readable without any visual. */}
      <motion.div {...fadeUp({ delay: 0.1 })} className="mb-6">
        <h4 className="font-code text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-3">
          How it works
        </h4>
        <ol className="list-none m-0 p-0 grid gap-2 sm:grid-cols-2">
          {stage.steps.map((step, i) => (
            <li key={step.id} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 w-5 h-5 rounded flex items-center justify-center font-code text-[9px] font-bold"
                style={{ background: `${stage.color}1a`, color: stage.color, border: `1px solid ${stage.color}33` }}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="text-sm font-medium text-slate-200">{step.label}</span>
                <span className="block text-xs text-slate-500 leading-relaxed">{step.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Verified evidence only — ProofBadge refuses anything unverified. */}
      {stage.proof.length > 0 && (
        <motion.div {...fadeUp({ delay: 0.12 })} className="mb-5">
          <h4 className="font-code text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2.5">
            Evidence
          </h4>
          <div className="flex flex-wrap gap-2">
            {stage.proof.map((item) => (
              <ProofBadge key={item.id} proof={item} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Upstream contributions, with their real statuses and canonical URLs. */}
      {stage.contributionList.length > 0 && (
        <motion.div {...fadeUp({ delay: 0.12 })} className="mb-5">
          <h4 className="font-code text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2.5">
            Pull requests
          </h4>
          <ul className="list-none m-0 p-0 grid gap-1.5 sm:grid-cols-2">
            {stage.contributionList.map((c) => (
              <li key={c.id}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 py-1.5 min-h-[44px] sm:min-h-0 sm:py-1"
                >
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: c.status === 'merged' ? stage.color : 'transparent',
                             border: c.status === 'merged' ? 'none' : '1px solid #8291aa' }}
                  />
                  <span className="font-code text-xs text-slate-300 group-hover:text-white transition-colors truncate">
                    {c.repository}
                    <span className="text-slate-500">#{c.prNumber}</span>
                  </span>
                  <span
                    className="font-code text-[10px] uppercase tracking-wider shrink-0"
                    style={{ color: c.status === 'merged' ? stage.color : '#8291aa' }}
                  >
                    {c.status}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Documented limitations, taken from the canonical record rather than
          written here, so the story cannot quietly drop an inconvenient one. */}
      {stage.limitations.length > 0 && (
        <motion.div {...fadeUp({ delay: 0.14 })} className="mb-5">
          <h4 className="font-code text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2">
            Limitations
          </h4>
          <ul className="list-none m-0 p-0 space-y-1.5">
            {stage.limitations.map((limitation) => (
              <li key={limitation} className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
                <span aria-hidden="true" className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                {limitation}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.div {...fadeUp({ delay: 0.16 })}>
        <Link
          href={stage.href}
          className="inline-flex items-center gap-2 min-h-[44px] sm:min-h-0 font-code text-xs font-semibold group"
          style={{ color: stage.color }}
        >
          {stage.contributions ? 'See all contributions' : `See ${project?.shortTitle ?? project?.title ?? 'the project'}`}
          <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </Link>
      </motion.div>
    </section>
  );
}
