/**
 * The research ledger: every entry against the evidence that actually exists
 * for it.
 *
 * This is the page's central artifact, and the reason it exists is that the
 * usual research page cannot be read at a glance. Four projects described in
 * four paragraphs of careful prose all look equally substantial. Put them in a
 * grid against what was actually produced and the honest shape appears
 * immediately: one has executed results, one has code and no measurements, one
 * works on hardware for part of its protocol and in a simulator for the rest,
 * and one has nothing built at all.
 *
 * Nothing here is authored. Every cell counts items derived from canonical
 * records — measured findings, protocol steps, verification rungs, pre-
 * registered work not yet run — by `getResearchEvidence()`.
 *
 * **The counts are not a score and are not comparable between rows.** Different
 * projects document different kinds of item, so six findings and six protocol
 * steps are six of different things. The caveat says this, the measure line
 * says this, and the cells are inspectable so a reader can check rather than
 * take the number on trust.
 *
 * Built as a real `<table>` with row and column headers, following the Phase 10
 * experiment matrix: a screen reader announces "Emergency Mesh, simulated only,
 * 2", which is exactly the relationship the grid conveys, and it works with no
 * interaction at all.
 */
import { useState } from 'react';

import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';
import { EVIDENCE_ORDER, EVIDENCE_STATE } from '@/components/research/evidenceStates';

export default function EvidenceLedger({ overviews, reduced = false }) {
  const [selected, setSelected] = useState(null);

  if (overviews.length === 0) return null;

  const stateDetail =
    selected?.kind === 'state' ? EVIDENCE_STATE[selected.id] : null;
  const cellOverview =
    selected?.kind === 'cell'
      ? overviews.find((o) => o.research.slug === selected.slug)
      : null;
  const cellItems = cellOverview
    ? cellOverview.evidence.filter((item) => item.state === selected.state)
    : [];

  return (
    <section aria-labelledby="ledger-heading" id="ledger" className="mb-14 scroll-mt-24">
      <h2
        id="ledger-heading"
        className="text-xl sm:text-2xl font-bold text-slate-50 tracking-tight mb-2"
      >
        What exists, project by project
      </h2>
      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mb-5">
        Each cell counts documented items — a measured finding, a protocol step, a verification
        rung, a pre-registered experiment — grouped by the strongest evidence that exists for them.
        Select a column to see what a state means, or a cell to see the items in it.
      </p>

      <div className="surface-card p-4 sm:p-5 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Research entries by evidence state. Counts are documented items, not a score, and are
            not comparable between rows.
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="p-1.5 font-code text-[9px] uppercase tracking-wider text-slate-500 align-bottom"
              >
                Research ↓ / Evidence →
              </th>
              {EVIDENCE_ORDER.map((state) => {
                const meta = EVIDENCE_STATE[state];
                const isActive = selected?.kind === 'state' && selected.id === state;
                return (
                  <th key={state} scope="col" className="p-1 align-bottom">
                    <button
                      type="button"
                      onClick={() => setSelected(isActive ? null : { kind: 'state', id: state })}
                      aria-pressed={isActive}
                      className="w-full font-code text-[9px] uppercase tracking-wide px-1 py-2 rounded transition-colors min-h-[44px]"
                      style={{
                        color: isActive ? meta.color : '#94a3b8',
                        background: isActive ? `${meta.color}1f` : 'transparent',
                      }}
                    >
                      {meta.short}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {overviews.map((overview) => {
              const { research, counts, evidence } = overview;
              const total = evidence.length;
              return (
                <tr key={research.slug}>
                  <th scope="row" className="p-1">
                    {/* A plain anchor, not next/link: this is an in-page jump,
                        and Link would rewrite it to /research#… and route
                        through the client router to reach the same scroll
                        position. */}
                    <a
                      href={`#research-${research.slug}`}
                      className="font-code text-[11px] px-1.5 py-2 min-h-[44px] flex items-center rounded text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
                    >
                      {research.title.split(' — ')[0]}
                    </a>
                  </th>
                  {EVIDENCE_ORDER.map((state, index) => {
                    const meta = EVIDENCE_STATE[state];
                    const value = counts[state] ?? 0;
                    const isActive =
                      selected?.kind === 'cell' &&
                      selected.slug === research.slug &&
                      selected.state === state;
                    const dimmed = selected?.kind === 'state' && selected.id !== state;
                    const share = total > 0 ? value / total : 0;
                    return (
                      <td key={state} className="p-1">
                        <motion.button
                          type="button"
                          disabled={value === 0}
                          onClick={() =>
                            setSelected(
                              isActive ? null : { kind: 'cell', slug: research.slug, state }
                            )
                          }
                          aria-pressed={isActive}
                          aria-label={`${research.title}, ${meta.label}, ${value} ${
                            value === 1 ? 'item' : 'items'
                          }`}
                          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                          animate={{ opacity: dimmed ? 0.3 : 1, scale: 1 }}
                          transition={{
                            duration: duration.normal,
                            delay: reduced ? 0 : index * 0.02,
                            ease: ease.outExpo,
                          }}
                          className="w-full min-w-[52px] min-h-[44px] rounded px-1 py-2 font-code text-sm tabular-nums border transition-[box-shadow] disabled:cursor-default"
                          style={{
                            background:
                              value === 0
                                ? 'transparent'
                                : `${meta.color}${Math.round(share * 38 + 10)
                                    .toString(16)
                                    .padStart(2, '0')}`,
                            borderColor: isActive
                              ? meta.color
                              : value > 0
                                ? `${meta.color}3d`
                                : 'rgba(255,255,255,0.06)',
                            color: value === 0 ? '#475569' : '#e2e8f0',
                            boxShadow: isActive ? `0 0 0 1px ${meta.color}` : 'none',
                          }}
                        >
                          {value}
                        </motion.button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Reserved height so inspecting a cell does not reflow the page. */}
      <div className="min-h-[6.5rem] mt-3" aria-live="polite">
        {stateDetail && (
          <div className="surface-card p-4">
            <p
              className="font-code text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ color: stateDetail.color }}
            >
              {stateDetail.label}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed m-0">{stateDetail.detail}</p>
          </div>
        )}
        {cellOverview && (
          <div className="surface-card p-4">
            <p
              className="font-code text-[10px] uppercase tracking-[0.2em] mb-2"
              style={{ color: EVIDENCE_STATE[selected.state].color }}
            >
              {cellOverview.research.title.split(' — ')[0]} ·{' '}
              {EVIDENCE_STATE[selected.state].label}
            </p>
            <ul className="list-none m-0 p-0 space-y-2">
              {cellItems.map((item) => (
                <li key={item.id}>
                  <p className="text-sm font-medium text-slate-200 m-0">{item.label}</p>
                  <p className="text-xs text-slate-400 leading-relaxed m-0 mt-0.5">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!selected && (
          <p className="font-code text-xs text-slate-500">{'// select a column or a cell'}</p>
        )}
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed mt-3 max-w-2xl">
        These are counts, not a score, and they are not comparable between rows: one project
        documents measured findings, another documents protocol steps, another verification rungs.
        A high number in one column says how much of that kind of item was recorded, not how good
        the work is.
      </p>
    </section>
  );
}
