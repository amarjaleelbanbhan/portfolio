/**
 * Research findings, and the published correction.
 *
 * Each finding keeps the measured value and what it licenses in separate
 * fields, because the gap between them is where research writing usually goes
 * wrong: a number gets quoted and the scope it was measured under gets dropped.
 * Rendering them as a pair makes that omission harder.
 *
 * The correction is rendered as a distinct, deliberately prominent block rather
 * than a footnote. A study that publishes a refutation of its own headline
 * result should show it at the same weight as the result.
 */
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

export function ResearchFindings({ findings = [], accent }) {
  if (findings.length === 0) return null;

  return (
    <motion.section
      id="findings"
      aria-labelledby="findings-heading"
      {...fadeUp()}
      className="mb-12 scroll-mt-24"
    >
      <h2
        id="findings-heading"
        className="text-xl sm:text-2xl font-bold text-slate-50 tracking-tight mb-2"
      >
        What the results support
      </h2>
      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mb-5">
        Each number is paired with what it does and does not license.
      </p>

      <div className="space-y-3">
        {findings.map((finding) => (
          <article key={finding.id} className="surface-card p-4 sm:p-5">
            <div className="flex items-baseline gap-3 flex-wrap mb-2">
              <h3 className="text-sm font-semibold text-slate-100 m-0">{finding.label}</h3>
              {finding.value && (
                <span
                  className="font-code text-xs tabular-nums px-2 py-0.5 rounded"
                  style={{ color: accent, background: `${accent}14`, border: `1px solid ${accent}2e` }}
                >
                  {finding.value}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed m-0">{finding.interpretation}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

export function ResearchCorrection({ correction, accent }) {
  if (!correction?.detail?.trim()) return null;

  return (
    <motion.section
      id="correction"
      aria-labelledby="correction-heading"
      {...fadeUp()}
      className="mb-12 scroll-mt-24"
    >
      <h2
        id="correction-heading"
        className="text-xl sm:text-2xl font-bold text-slate-50 tracking-tight mb-2"
      >
        Correction
      </h2>

      <div
        className="surface-card p-5"
        style={{ borderColor: `${accent}40`, background: `${accent}0a` }}
      >
        <div className="flex items-baseline gap-3 flex-wrap mb-2.5">
          <span
            className="font-code text-[10px] uppercase tracking-[0.2em] font-bold"
            style={{ color: accent }}
          >
            {correction.title}
          </span>
          <time className="font-code text-[11px] text-slate-500" dateTime={correction.date}>
            {correction.date}
          </time>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">{correction.detail}</p>
        <p className="text-sm font-medium text-slate-200 leading-relaxed m-0 pt-3 border-t border-white/10">
          {correction.status}
        </p>
      </div>
    </motion.section>
  );
}
