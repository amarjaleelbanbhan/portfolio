/**
 * Technical metadata label — a small monospaced key/value pair.
 *
 * Monospace is reserved for technical information (Phase 3 typography rule), so
 * this is the right component for dates, versions, counts and identifiers, and
 * the wrong one for prose.
 *
 * Renders a <dl> fragment when `term` is set so the relationship between label
 * and value survives in the accessibility tree rather than existing only
 * visually. Group several inside a single <dl>.
 */

export default function MetaLabel({ label, value, className = '' }) {
  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <dt className="text-[10px] font-code uppercase tracking-wider text-slate-500 shrink-0">
        {label}
      </dt>
      <dd className="text-xs font-code text-slate-300 m-0">{value}</dd>
    </div>
  );
}

/** Metric display: a large derived number with its label underneath. */
export function Metric({ value, label, accent = 'var(--accent)', className = '' }) {
  return (
    <div className={className}>
      <div className="text-2xl font-bold font-code" style={{ color: accent }}>
        {value}
      </div>
      <div className="text-xs text-slate-400 leading-tight mt-0.5">{label}</div>
    </div>
  );
}
