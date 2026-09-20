/**
 * An interactive factorial matrix.
 *
 * The design *is* the contribution in a research case study, so this renders the
 * grid as the primary artifact: deficiency types down one axis, repair actions
 * across the other, every cell a condition that was actually run.
 *
 * Built as a real `<table>` with proper row and column headers rather than a
 * grid of divs. A screen reader then announces "CONFLICTING, ARBITRATE, 0.807"
 * when moving through it, which is exactly the relationship the visual conveys —
 * and it works without any of the interaction below.
 *
 * Selecting a row, column or cell explains what that factor level means. That
 * is why the matrix is still useful when `cells` is absent: the axes carry
 * definitions, so the design communicates even with no results to show. Nothing
 * here fabricates a value — an unmeasured cell renders as an em dash.
 *
 * Colour encodes magnitude as a background wash, but every cell also prints its
 * number, and the best cell in each row is marked with a symbol as well as a
 * ring, so nothing depends on colour alone.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

export default function ExperimentMatrix({
  experiment,
  accent,
  reduced = false,
  // The matrix is a top-level section of a case study and a subsection of a
  // research entry, so the caller owns the level. Visual size is unchanged;
  // only the semantics move.
  as: Heading = 'h2',
}) {
  const [selected, setSelected] = useState(null);

  if (!experiment?.rows?.length || !experiment?.cols?.length) return null;

  const { rows, cols, cells = [], measure, rowsLabel, colsLabel, provenance, caveat, title } =
    experiment;

  const byKey = new Map(cells.map((c) => [c.key, c]));
  const values = cells.map((c) => c.value).filter((v) => typeof v === 'number');
  const max = values.length ? Math.max(...values) : 1;

  // What the detail panel is currently explaining.
  const detail =
    selected?.kind === 'row'
      ? rows.find((r) => r.id === selected.id)
      : selected?.kind === 'col'
        ? cols.find((c) => c.id === selected.id)
        : null;
  const cellDetail = selected?.kind === 'cell' ? byKey.get(selected.id) : null;
  const cellRow = cellDetail ? rows.find((r) => selected.id.startsWith(`${r.id}|`)) : null;
  const cellCol = cellDetail ? cols.find((c) => selected.id.endsWith(`|${c.id}`)) : null;

  return (
    <section aria-labelledby="experiment-heading" className="mb-12 scroll-mt-24" id="experiment">
      <Heading
        id="experiment-heading"
        className="text-xl sm:text-2xl font-bold text-slate-50 tracking-tight mb-2"
      >
        {title}
      </Heading>
      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mb-5">
        {rows.length} × {cols.length}, fully crossed. Every cell was run.
        {cells.length > 0 && <> Values are {measure}.</>} Select a row, column or cell to see what
        it represents.
      </p>

      <div className="surface-card p-4 sm:p-5 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            {title}. {rowsLabel} by {colsLabel}
            {cells.length > 0 ? `, measured in ${measure}.` : '. No measured values are shown.'}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="p-1.5 font-code text-[9px] uppercase tracking-wider text-slate-500 align-bottom">
                {rowsLabel} ↓ / {colsLabel} →
              </th>
              {cols.map((col) => {
                const isActive = selected?.kind === 'col' && selected.id === col.id;
                return (
                  <th key={col.id} scope="col" className="p-1 align-bottom">
                    <button
                      type="button"
                      onClick={() => setSelected(isActive ? null : { kind: 'col', id: col.id })}
                      aria-pressed={isActive}
                      className="w-full font-code text-[9px] uppercase tracking-wide px-1 py-2 rounded transition-colors"
                      style={{
                        color: isActive ? accent : '#94a3b8',
                        background: isActive ? `${accent}1f` : 'transparent',
                      }}
                    >
                      {col.label}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rowActive = selected?.kind === 'row' && selected.id === row.id;
              return (
                <tr key={row.id}>
                  <th scope="row" className="p-1">
                    <button
                      type="button"
                      onClick={() => setSelected(rowActive ? null : { kind: 'row', id: row.id })}
                      aria-pressed={rowActive}
                      className="w-full text-left font-code text-[10px] uppercase tracking-wide px-1.5 py-2 rounded transition-colors whitespace-nowrap"
                      style={{
                        color: rowActive ? accent : '#cbd5e1',
                        background: rowActive ? `${accent}1f` : 'transparent',
                      }}
                    >
                      {row.label}
                    </button>
                  </th>
                  {cols.map((col, ci) => {
                    const key = `${row.id}|${col.id}`;
                    const cell = byKey.get(key);
                    const isActive = selected?.kind === 'cell' && selected.id === key;
                    const dimmed =
                      (selected?.kind === 'row' && selected.id !== row.id) ||
                      (selected?.kind === 'col' && selected.id !== col.id);
                    const intensity = cell && max > 0 ? cell.value / max : 0;
                    return (
                      <td key={col.id} className="p-1">
                        <motion.button
                          type="button"
                          onClick={() => setSelected(isActive ? null : { kind: 'cell', id: key })}
                          aria-pressed={isActive}
                          aria-label={`${row.label}, ${col.label}${
                            cell ? `, ${cell.value.toFixed(3)} ${measure}` : ', not measured'
                          }${cell?.best ? ', best in row' : ''}`}
                          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                          animate={{ opacity: dimmed ? 0.3 : 1, scale: 1 }}
                          transition={{
                            duration: duration.normal,
                            delay: reduced ? 0 : ci * 0.015,
                            ease: ease.outExpo,
                          }}
                          className="w-full min-w-[46px] rounded px-1 py-2.5 font-code text-[11px] tabular-nums transition-[box-shadow] border"
                          style={{
                            background: cell ? `${accent}${Math.round(intensity * 40 + 8).toString(16).padStart(2, '0')}` : 'transparent',
                            borderColor: isActive ? accent : cell?.best ? `${accent}66` : 'rgba(255,255,255,0.06)',
                            color: cell ? '#e2e8f0' : '#475569',
                            boxShadow: isActive ? `0 0 0 1px ${accent}` : 'none',
                          }}
                        >
                          {cell ? cell.value.toFixed(3) : '—'}
                          {/* A symbol as well as a ring: never colour alone. */}
                          {cell?.best && (
                            <span aria-hidden="true" style={{ color: accent }}>
                              {' ▸'}
                            </span>
                          )}
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

      {/* Reserved height so selecting a cell does not reflow the page. */}
      <div className="min-h-[5.5rem] mt-3" aria-live="polite">
        {detail && (
          <div className="surface-card p-4">
            <p className="font-code text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: accent }}>
              {detail.label}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed m-0">{detail.detail}</p>
          </div>
        )}
        {cellDetail && cellRow && cellCol && (
          <div className="surface-card p-4">
            <p className="font-code text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: accent }}>
              {cellRow.label} × {cellCol.label} — {cellDetail.value.toFixed(3)} {measure}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed m-0">
              {cellRow.label} evidence, repaired with {cellCol.label}.
            </p>
            {cellDetail.note && (
              <p className="text-xs text-amber-300/90 leading-relaxed mt-2 m-0">{cellDetail.note}</p>
            )}
          </div>
        )}
        {!selected && (
          <p className="font-code text-xs text-slate-500">
            {'// select a row, column or cell'}
          </p>
        )}
      </div>

      {provenance && (
        <p className="text-xs text-slate-500 leading-relaxed mt-3 max-w-2xl">{provenance}</p>
      )}
      {caveat && (
        <p className="text-[11px] text-slate-500 leading-relaxed mt-2 max-w-2xl">{caveat}</p>
      )}
    </section>
  );
}
