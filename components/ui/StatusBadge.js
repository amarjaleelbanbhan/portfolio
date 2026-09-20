/**
 * Project status badge.
 *
 * Keyed by the canonical ProjectStatus value from content/types.ts. Public
 * wording is formatted here and nowhere else, so display strings never leak
 * back into the data model — the same rule Phase 2 established.
 *
 * Colours follow meaning, not decoration: shipped work reads green, in-flight
 * amber, exploratory violet, retired grey. These mirror --status-* in
 * styles/tokens.css.
 */

const STATUS = {
  production: { color: '#22c55e', label: 'Production' },
  released: { color: '#22c55e', label: 'Released' },
  'active-development': { color: '#f59e0b', label: 'Active Development' },
  research: { color: '#986ef7', label: 'Research' },
  prototype: { color: '#38bdf8', label: 'Prototype' },
  'pre-alpha': { color: '#f97316', label: 'Pre-alpha' },
  completed: { color: '#14b8a6', label: 'Completed' },
  archived: { color: '#8291aa', label: 'Archived' },
};

/** The public label for a status, for callers that need the text alone. */
export function statusLabel(status) {
  return STATUS[status]?.label ?? null;
}

export default function StatusBadge({ status, className = '' }) {
  const style = STATUS[status];
  if (!style) return null;

  return (
    <span
      className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded font-code whitespace-nowrap ${className}`}
      style={{
        color: style.color,
        background: `${style.color}14`,
        border: `1px solid ${style.color}33`,
      }}
    >
      {style.label}
    </span>
  );
}
