/**
 * The description panel under the core.
 *
 * Reserves its own height so selecting a domain does not reflow the page — with
 * the panel collapsing and expanding, every hover would nudge the hero.
 *
 * With nothing selected it prompts rather than sitting empty, because on touch
 * there is no hover to discover the interaction with.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

export default function DomainDetail({ domain }) {
  return (
    <div className="min-h-[7.5rem] sm:min-h-[6.5rem]" aria-live="polite">
      <AnimatePresence mode="wait">
        {domain ? (
          <motion.div
            key={domain.domain}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: duration.normal, ease: ease.outExpo }}
            data-domain={domain.domain}
          >
            <div className="flex items-baseline gap-3 flex-wrap mb-2">
              <span
                className="font-code text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: domain.color }}
              >
                {domain.label}
              </span>
              <span className="font-code text-[11px] text-slate-500">
                {domain.stat.value} {domain.stat.label}
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              {domain.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {domain.technologies.map((tech) => (
                <span
                  key={tech.key}
                  className="font-code text-[10px] px-2 py-0.5 rounded"
                  style={{
                    color: tech.color,
                    background: `${tech.color}14`,
                    border: `1px solid ${tech.color}2e`,
                  }}
                >
                  {tech.label}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.normal, ease: ease.outExpo }}
            className="text-sm text-slate-500 leading-relaxed max-w-xl font-code"
          >
            {'// select a domain to see the work behind it'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
