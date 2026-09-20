/**
 * Domain filters and search for /work.
 *
 * The filter set is derived from the domains projects actually carry, not from
 * a hand-written list — a domain with no projects behind it would be a dead
 * button, and a new domain should appear without anyone editing this file.
 *
 * The chip row itself is `components/ui/FilterChipGroup`, shared with
 * /open-source. Its radio-group keyboard behaviour and active-state treatment
 * are documented there; this component keeps only the part that is specific to
 * project filtering, which is the search field and the result count.
 */
import FilterChipGroup from '@/components/ui/FilterChipGroup';

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
      <FilterChipGroup
        label="Filter projects by engineering domain"
        idPrefix="filter"
        options={domains}
        active={active}
        onChange={onChange}
      />

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
            className="w-full min-h-[44px] rounded-lg border border-white/10 bg-[rgba(8,12,26,0.6)] px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 font-code focus-visible:outline-none focus-visible:border-neon-cyan/60"
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
