/**
 * One research entry's documented items, grouped by evidence state.
 *
 * The ledger above says how many; this says which. It is the same derived data
 * rendered at full length, because the distinction the page is built on — ran,
 * built, simulated, not done — only means something if a reader can see the
 * individual items and disagree with the classification.
 *
 * States with nothing in them are omitted. An empty "Simulated only" heading
 * would read as a category the project has considered and cleared, when in fact
 * the project simply has no simulator.
 */
import { EVIDENCE_ORDER, EVIDENCE_STATE } from '@/components/research/evidenceStates';

export default function EvidenceBreakdown({ evidence = [], headingId }) {
  if (evidence.length === 0) return null;

  const groups = EVIDENCE_ORDER.map((state) => ({
    state,
    meta: EVIDENCE_STATE[state],
    items: evidence.filter((item) => item.state === state),
  })).filter((group) => group.items.length > 0);

  return (
    <div>
      <h3
        id={headingId}
        className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3"
      >
        Evidence, item by item
      </h3>
      <div className="space-y-4">
        {groups.map((group) => (
          <section key={group.state} aria-label={group.meta.label}>
            <p className="flex items-baseline gap-2 mb-2 m-0">
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full shrink-0 translate-y-[-1px]"
                style={{
                  background: group.state === 'not-built' ? 'transparent' : group.meta.color,
                  border: group.state === 'not-built' ? `1px solid ${group.meta.color}` : 'none',
                }}
              />
              <span
                className="font-code text-[11px] uppercase tracking-wider"
                style={{ color: group.meta.color }}
              >
                {group.meta.label}
              </span>
              <span className="font-code text-[10px] text-slate-600 tabular-nums">
                {group.items.length}
              </span>
            </p>
            <ul className="list-none m-0 p-0 space-y-2 pl-3.5 border-l" style={{ borderColor: `${group.meta.color}26` }}>
              {group.items.map((item) => (
                <li key={item.id}>
                  <p className="text-sm font-medium text-slate-200 m-0">{item.label}</p>
                  <p className="text-xs text-slate-400 leading-relaxed m-0 mt-0.5">{item.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
