/**
 * Domain badge — which engineering discipline a piece of work belongs to.
 *
 * Keyed by the canonical Domain union in content/types.ts. Domain colour is an
 * identifier, not decoration: amber means security work, so it must not be
 * borrowed for unrelated emphasis. The values mirror --domain-* in
 * styles/tokens.css.
 */

const DOMAIN = {
  product: { color: '#14b8a6', label: 'Product' },
  ai: { color: '#8b5cf6', label: 'Applied AI' },
  security: { color: '#f59e0b', label: 'Security' },
  systems: { color: '#38bdf8', label: 'Systems' },
  research: { color: '#a855f7', label: 'Research' },
  'open-source': { color: '#22c55e', label: 'Open Source' },
};

/** The accent colour for a domain, for surfaces that tint themselves. */
export function domainColor(domain) {
  return DOMAIN[domain]?.color ?? null;
}

export function domainLabel(domain) {
  return DOMAIN[domain]?.label ?? null;
}

export default function DomainBadge({ domain, className = '' }) {
  const style = DOMAIN[domain];
  if (!style) return null;

  return (
    <span
      data-domain={domain}
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full font-code whitespace-nowrap ${className}`}
      style={{
        color: style.color,
        background: `${style.color}14`,
        border: `1px solid ${style.color}33`,
      }}
    >
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: style.color }}
      />
      {style.label}
    </span>
  );
}
