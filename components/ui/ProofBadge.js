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
  // Grey, not green, and it never says "merged": an open request must not read
  // as a landed change anywhere on the site.
  'pull-request': { label: 'Pull Request', color: '#8291aa' },
  'package-release': { label: 'Package', color: '#14b8a6' },
  deployment: { label: 'Deployment', color: '#14b8a6' },
  'research-result': { label: 'Research Result', color: '#af63f8' },
  ci: { label: 'CI', color: '#38bdf8' },
  demo: { label: 'Demo', color: '#986ef7' },
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
  // Several proof records put the version in the label ("Tagged release v2.0.0")
  // and again in `value`. Showing both reads as a stutter, so the value is only
  // rendered when it adds something the label does not already say.
  const value = proof.value && !label.includes(proof.value) ? proof.value : null;
  const body = (
    <>
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: style.color }}
      />
      <span className="font-medium">{label}</span>
      {value && <span className="text-slate-400">{value}</span>}
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
        // A linked badge is a control, so it carries a 44px touch target on
        // touch-sized screens. The chip returns to its compact size from `sm`
        // up, where a pointer makes the extra height dead space.
        className={`${classes} hover:brightness-125 min-h-[44px] px-3 sm:min-h-0 sm:px-2.5`}
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
