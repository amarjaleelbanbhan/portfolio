/**
 * The progress rail: BUILT → VERIFIED → RESEARCHED → SYSTEMS → CONTRIBUTED.
 *
 * Doubles as in-page navigation. Each marker is a real anchor link, so the five
 * stages are reachable by keyboard and by jump navigation, and the rail tells
 * the reader the shape of the argument before they have scrolled through it.
 *
 * The marker for the stage being read is emphasised, but every label stays
 * legible: the current position is signalled by weight and colour together, not
 * by colour alone.
 */
import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

export default function StageProgress({ stages, activeId, orientation = 'vertical' }) {
  const vertical = orientation === 'vertical';

  return (
    <nav aria-label="Engineering story stages">
      <ol
        className={
          vertical
            ? 'list-none m-0 p-0 flex flex-col gap-1'
            : 'list-none m-0 p-0 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 snap-x'
        }
      >
        {stages.map((stage, index) => {
          const isActive = stage.id === activeId;
          return (
            <li key={stage.id} className={vertical ? '' : 'shrink-0 snap-start'}>
              <a
                href={`#${stage.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={[
                  'group flex items-center gap-2.5 rounded-lg px-2 py-2 min-h-[44px]',
                  'font-code text-[11px] uppercase tracking-[0.18em] transition-colors',
                  'duration-[var(--duration-normal)]',
                  isActive ? 'font-bold' : 'font-medium text-slate-500 hover:text-slate-300',
                ].join(' ')}
                style={isActive ? { color: stage.color } : undefined}
              >
                <span
                  aria-hidden="true"
                  className="relative flex items-center justify-center w-4 h-4 shrink-0"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full transition-all duration-[var(--duration-normal)]"
                    style={{
                      background: isActive ? stage.color : '#475569',
                      boxShadow: isActive ? `0 0 10px ${stage.color}` : 'none',
                    }}
                  />
                  {isActive && (
                    <motion.span
                      layoutId="stage-ring"
                      transition={{ duration: duration.normal, ease: ease.outExpo }}
                      className="absolute inset-0 rounded-full border"
                      style={{ borderColor: stage.color }}
                    />
                  )}
                </span>
                <span className="whitespace-nowrap">
                  <span className="text-slate-600 mr-1.5">{String(index + 1).padStart(2, '0')}</span>
                  {stage.kicker}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
