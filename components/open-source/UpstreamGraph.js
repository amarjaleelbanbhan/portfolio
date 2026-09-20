/**
 * The upstream repositories this work landed in.
 *
 * Every node and every edge is one thing: a repository with at least one
 * recorded pull request, joined to the hub. There is no weighting by stars, no
 * influence score, no activity heat and no edge that means anything other than
 * "a change of mine is in here". A graph that drew more than the records
 * contain would be inventing GitHub activity, which is precisely what this page
 * is supposed to avoid.
 *
 * Node size is the one derived quantity, and it encodes the only honest measure
 * available: how many pull requests went into that repository. The count is
 * also printed, so size is never the sole carrier.
 *
 * Structure and interaction:
 *
 * - The connecting lines are a decorative SVG, `aria-hidden`. Every node is a
 *   real `<button>` in normal DOM order, so tab order, touch targets and screen
 *   reader output do not depend on the drawing.
 * - Below `md` the ring is dropped entirely for a plain grid of the same
 *   buttons. A ring of six labels at 360px is unreadable, and dragging or
 *   hovering is not something a touch user should have to do.
 * - Selecting a repository filters the list below it; selecting it again
 *   clears. The button is the filter control, not a tooltip trigger.
 */
import { motion } from 'framer-motion';
import { useIsWide } from '@/lib/useMediaQuery';
import { duration, ease } from '@/lib/motion';

const MERGED = '#22c55e';
const PENDING = '#8291aa';

/** Ring geometry, in percentages of the container box. */
function ringPosition(index, total) {
  // Start at the top and walk clockwise.
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    left: 50 + Math.cos(angle) * 37,
    top: 50 + Math.sin(angle) * 36,
  };
}

function RepositoryButton({ repository, selected, onSelect, style, className = '' }) {
  const accent = repository.openCount > 0 && repository.mergedCount === 0 ? PENDING : MERGED;
  const count = repository.contributions.length;

  return (
    <button
      type="button"
      onClick={() => onSelect(selected ? null : repository.repository)}
      aria-pressed={selected}
      aria-label={`${repository.repository}, ${count} pull ${count === 1 ? 'request' : 'requests'}, ${
        repository.mergedCount
      } merged${repository.openCount > 0 ? `, ${repository.openCount} open` : ''}`}
      style={style}
      className={[
        'group flex items-center gap-2 rounded-full border px-3 py-2 min-h-[44px] max-w-[11rem]',
        'transition-[background-color,border-color,box-shadow] duration-[var(--duration-normal)]',
        className,
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className="rounded-full shrink-0"
        style={{
          width: `${6 + count * 3}px`,
          height: `${6 + count * 3}px`,
          background: repository.mergedCount > 0 ? accent : 'transparent',
          border: repository.mergedCount > 0 ? 'none' : `1px solid ${PENDING}`,
        }}
      />
      <span className="font-code text-[11px] text-slate-300 group-hover:text-white truncate">
        {repository.name}
      </span>
      <span className="font-code text-[10px] tabular-nums shrink-0" style={{ color: accent }}>
        {count}
      </span>
    </button>
  );
}

export default function UpstreamGraph({ repositories, selected, onSelect, totalContributions }) {
  const wide = useIsWide();

  const nodeStyle = (isSelected) => ({
    borderColor: isSelected ? MERGED : 'rgba(255,255,255,0.10)',
    background: isSelected ? `${MERGED}1a` : 'rgba(8,12,26,0.82)',
    boxShadow: isSelected ? `0 0 24px -10px ${MERGED}` : 'none',
  });

  if (!wide) {
    return (
      <div className="surface-card p-4">
        <p className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3">
          Upstream repositories · {repositories.length}
        </p>
        <div className="flex flex-wrap gap-2">
          {repositories.map((repository) => (
            <RepositoryButton
              key={repository.repository}
              repository={repository}
              selected={selected === repository.repository}
              onSelect={onSelect}
              style={nodeStyle(selected === repository.repository)}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mt-3 m-0">
          Tap a repository to show only its pull requests.
        </p>
      </div>
    );
  }

  return (
    <div className="surface-card p-5">
      <div className="relative w-full" style={{ aspectRatio: '16 / 8', minHeight: '20rem' }}>
        {/* Decorative: the same relationships are in the buttons' labels. */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {repositories.map((repository, index) => {
            const { left, top } = ringPosition(index, repositories.length);
            const isSelected = selected === repository.repository;
            return (
              <motion.line
                key={repository.repository}
                x1="50"
                y1="50"
                x2={left}
                y2={top}
                stroke={isSelected ? MERGED : 'rgba(255,255,255,0.16)'}
                // Non-scaling, so this is CSS pixels: the sub-pixel widths this
                // started with rendered as nothing on a normal display.
                strokeWidth={isSelected ? 2 : 1}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: duration.cinematic,
                  delay: index * 0.06,
                  ease: ease.standard,
                }}
              />
            );
          })}
        </svg>

        {/* Hub. A count, not a claim. */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 text-center rounded-full border px-4 py-3"
          style={{
            left: '50%',
            top: '50%',
            borderColor: 'rgba(34,197,94,0.28)',
            background: 'rgba(8,12,26,0.92)',
          }}
        >
          <p className="font-code text-lg font-bold m-0 tabular-nums" style={{ color: MERGED }}>
            {totalContributions}
          </p>
          <p className="font-code text-[9px] uppercase tracking-[0.18em] text-slate-500 m-0">
            pull requests
          </p>
        </div>

        {repositories.map((repository, index) => {
          const { left, top } = ringPosition(index, repositories.length);
          const isSelected = selected === repository.repository;
          return (
            <RepositoryButton
              key={repository.repository}
              repository={repository}
              selected={isSelected}
              onSelect={onSelect}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%`, top: `${top}%`, ...nodeStyle(isSelected) }}
            />
          );
        })}
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mt-1 m-0 max-w-2xl">
        One node per repository with a recorded pull request; node size is the number of pull
        requests, which is also printed. Select a repository to show only its contributions. No
        other relationship is shown — this is not an activity graph.
      </p>
    </div>
  );
}
