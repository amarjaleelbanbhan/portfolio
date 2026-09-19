/**
 * Domain filters and search for /work.
 *
 * The filter set is derived from the domains projects actually carry, not from
 * a hand-written list — a domain with no projects behind it would be a dead
 * button, and a new domain should appear without anyone editing this file.
 *
 * Implemented as a radio group rather than a row of buttons: the options are
 * mutually exclusive, so arrow keys should move between them and only the
 * active one should be a tab stop. That is what a radio group gives for free,
 * and it is the correct semantics for "pick exactly one".
 *
 * The active filter is identifiable programmatically (`aria-checked`) and
 * visually by border, background and a dot — never by colour alone.
 */
import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

export default function ProjectFilters({
  domains,
  active,
  onChange,
  query,
  onQueryChange,
  resultCount,
  totalCount,
}) {
  return (
    <div className="space-y-4">
      <div
        role="radiogroup"
        aria-label="Filter projects by engineering domain"
        className="flex flex-wrap gap-2"
      >
        {domains.map((domain) => {
          const isActive = active === domain.key;
          return (
            <button
              key={domain.key}
              type="button"
              role="radio"
              aria-checked={isActive}
              // Only the selected option is in the tab order; arrow keys move
              // within the group, which is the standard radio-group pattern.
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(domain.key)}
              onKeyDown={(e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
                e.preventDefault();
                const i = domains.findIndex((d) => d.key === active);
                const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
                const next = domains[(i + step + domains.length) % domains.length];
                onChange(next.key);
                document.getElementById(`filter-${next.key}`)?.focus();
              }}
              id={`filter-${domain.key}`}
              className={[
                'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 min-h-[44px]',
                'font-code text-xs font-semibold uppercase tracking-wider whitespace-nowrap',
                'transition-[background-color,border-color,color,box-shadow] duration-[var(--duration-normal)]',
                isActive ? 'text-slate-50' : 'text-slate-400 hover:text-slate-200',
              ].join(' ')}
              style={{
                borderColor: isActive ? domain.color : 'rgba(255,255,255,0.10)',
                background: isActive ? `${domain.color}1f` : 'rgba(8,12,26,0.6)',
                boxShadow: isActive ? `0 0 20px -8px ${domain.color}` : 'none',
              }}
            >
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: isActive ? domain.color : 'transparent',
                  border: isActive ? 'none' : '1px solid #475569',
                }}
              />
              {domain.label}
              <span className="text-[10px] font-normal text-slate-500 normal-case tracking-normal">
                {domain.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <label htmlFor="work-search" className="sr-only">
            Search projects by name, summary or technology
          </label>
          <input
            id="work-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search projects or technologies"
            className="w-full rounded-lg border border-white/10 bg-[rgba(8,12,26,0.6)] px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 font-code focus-visible:outline-none focus-visible:border-neon-cyan/60"
          />
        </div>

        {/* Announced politely so a screen-reader user hears the result count
            change without the focus moving. */}
        <p aria-live="polite" className="font-code text-xs text-slate-500">
          {resultCount === totalCount
            ? `${totalCount} projects`
            : `${resultCount} of ${totalCount} projects`}
        </p>
      </div>
    </div>
  );
}
