/**
 * Evidence badge — renders one canonical Proof item.
 *
 * Phase 2's rule carries through to the UI: unverified proof is never displayed
 * publicly. This component enforces it rather than trusting each caller to
 * remember, so a future case-study page cannot accidentally publish an
 * unverified claim.
 *
 * `sourceUrl` is optional by design. Private work (RODIFT) has real evidence —
 * a tagged production release, a published privacy policy — that cannot always
 * be linked, and the model must not force a fabricated URL to render it.
 */

const PROOF = {
  'test-suite': { label: 'Tests', color: '#22c55e' },
  'production-release': { label: 'Production Release', color: '#22c55e' },
  benchmark: { label: 'Benchmark', color: '#38bdf8' },
  'merged-pr': { label: 'Merged PR', color: '#22c55e' },
  'package-release': { label: 'Package', color: '#14b8a6' },
  deployment: { label: 'Deployment', color: '#14b8a6' },
  'research-result': { label: 'Research Result', color: '#a855f7' },
  ci: { label: 'CI', color: '#38bdf8' },
  demo: { label: 'Demo', color: '#8b5cf6' },
  'user-evidence': { label: 'User Evidence', color: '#f59e0b' },
};

export default function ProofBadge({ proof, className = '' }) {
  // Never render unverified evidence. Phase 2 validation also rejects it in the
  // data, but a component that renders whatever it is handed is one refactor
  // away from publishing a claim nobody checked.
  if (!proof?.verified) return null;

  const style = PROOF[proof.type];
  if (!style) return null;

  const label = proof.label || style.label;
  const body = (
    <>
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: style.color }}
      />
      <span className="font-medium">{label}</span>
      {proof.value && <span className="text-slate-400">{proof.value}</span>}
    </>
  );

  const classes =
    'inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-md font-code ' +
    `border transition-colors duration-[var(--duration-fast)] ${className}`;
  const styleProps = {
    color: style.color,
    background: `${style.color}0f`,
    borderColor: `${style.color}2e`,
  };

  if (proof.sourceUrl) {
    return (
      <a
        href={proof.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${classes} hover:brightness-125`}
        style={styleProps}
        title={proof.description}
      >
        {body}
      </a>
    );
  }

  return (
    <span className={classes} style={styleProps} title={proof.description}>
      {body}
    </span>
  );
}
