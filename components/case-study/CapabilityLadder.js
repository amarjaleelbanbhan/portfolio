/**
 * A graded capability ladder.
 *
 * The whole point is the status column. A ladder rendered without it is a
 * roadmap dressed as a feature list, so every rung states whether it is built,
 * partially built or planned — and a planned rung shows why it is not built yet
 * rather than being quietly omitted.
 *
 * Rendered as an ordered list, because the rungs are genuinely ordered and a
 * screen reader should say so. Status is carried by a text label as well as
 * colour and a marker shape, so nothing depends on colour alone.
 *
 * Selecting a rung expands what it means. The summary line is always visible, so
 * the ladder is fully readable without any interaction.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

const STATUS = {
  implemented: { label: 'Implemented', color: '#22c55e', mark: '●' },
  partial: { label: 'Partial', color: '#f59e0b', mark: '◐' },
  planned: { label: 'Not built yet', color: '#8291aa', mark: '○' },
};

export default function CapabilityLadder({ ladder, accent, reduced = false }) {
  const [open, setOpen] = useState(null);
  if (!ladder?.stages?.length) return null;

  const { title, intro, stages, rules = [], caveat } = ladder;

  return (
    <section aria-labelledby="ladder-heading" className="mb-12 scroll-mt-24" id="ladder">
      <h2
        id="ladder-heading"
        className="text-xl sm:text-2xl font-bold text-slate-50 tracking-tight mb-2"
      >
        {title}
      </h2>
      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mb-5">{intro}</p>

      <ol className="list-none m-0 p-0 space-y-2">
        {stages.map((stage, i) => {
          const status = STATUS[stage.status] ?? STATUS.planned;
          const isOpen = open === stage.id;
          return (
            <motion.li
              key={stage.id}
              initial={reduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: duration.normal, delay: reduced ? 0 : i * 0.05, ease: ease.outExpo }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : stage.id)}
                aria-expanded={isOpen}
                className="w-full text-left surface-card p-4 transition-colors hover:border-white/20"
                style={{ borderColor: isOpen ? `${accent}66` : undefined }}
              >
                <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
                  {/* Rung marker */}
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-7 h-7 rounded flex items-center justify-center font-code text-[11px] font-bold"
                    style={{
                      background: `${status.color}1a`,
                      color: status.color,
                      border: `1px solid ${status.color}44`,
                    }}
                  >
                    {stage.level}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2 flex-wrap mb-0.5">
                      <span className="font-code text-sm font-semibold text-slate-100">
                        {stage.label}
                      </span>
                      {/* Status as words, not just a colour. */}
                      <span
                        className="font-code text-[10px] uppercase tracking-wider"
                        style={{ color: status.color }}
                      >
                        <span aria-hidden="true">{status.mark} </span>
                        {status.label}
                      </span>
                    </span>
                    <span className="block text-xs text-slate-400 leading-relaxed">
                      {stage.evidence}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className="shrink-0 font-code text-slate-600 text-xs mt-1"
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </div>

                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <p className="text-sm text-slate-300 leading-relaxed m-0">{stage.meaning}</p>
                    {stage.gap && (
                      <p className="text-xs text-slate-500 leading-relaxed m-0">
                        <span className="font-code uppercase tracking-wider text-[10px] text-slate-600">
                          Why not yet:{' '}
                        </span>
                        {stage.gap}
                      </p>
                    )}
                  </div>
                )}
              </button>
            </motion.li>
          );
        })}
      </ol>

      {rules.length > 0 && (
        <div className="mt-5">
          <h3 className="font-code text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2.5">
            Structural rules
          </h3>
          <ul className="list-none m-0 p-0 space-y-2">
            {rules.map((rule) => (
              <li key={rule} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: accent }}
                />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}

      {caveat && (
        <p className="text-[11px] text-slate-500 leading-relaxed mt-4 max-w-2xl">{caveat}</p>
      )}
    </section>
  );
}
