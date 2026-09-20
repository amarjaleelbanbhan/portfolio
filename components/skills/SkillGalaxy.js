/**
 * The Skill Galaxy — the technical ecosystem as a graph of real work.
 *
 * ── What the edges mean ──────────────────────────────────────────────────────
 * Lines between two skills mean **they were used on the same thing**, derived
 * from shared project, research and contribution references. They are not
 * similarity, not a taxonomy, and not a guess about which technologies "go
 * together". That is the whole reason this is worth drawing: the clusters that
 * emerge — Flutter beside Dart, BLE and cryptography; Python beside RAG and
 * evaluation — emerge because those things were genuinely built together, and
 * every one of them can be opened and checked.
 *
 * ── Why this is not WebGL ────────────────────────────────────────────────────
 * A 3D scene would make this worse. The information here is labels and
 * relationships; in three dimensions labels face away from the camera, nodes
 * occlude each other, and hit-testing becomes a chore on a phone. The project
 * already has WebGL where it earns its place — the Engineering Core and the
 * skill cube — and the tier/fallback machinery for it. Adding a second full
 * scene for a graph that reads better flat would cost every visitor a bundle
 * and give them a harder interface.
 *
 * So this is DOM and SVG: every skill is a real `<button>` in document order,
 * which means tab order, focus rings, touch targets and screen reader output
 * all work without a fallback mode existing separately from the "real" one.
 *
 * ── Layout ───────────────────────────────────────────────────────────────────
 * Skills sit in category islands laid out by CSS grid, so the arrangement
 * survives any viewport without a hand-tuned coordinate table. Edge endpoints
 * are measured from the live DOM after layout and re-measured on resize, which
 * is what lets the lines stay attached when the grid reflows from three columns
 * to one. Before the first measurement there are simply no lines — the board is
 * fully usable without them, and the server renders exactly what the client
 * renders first.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

/** Ambient edges are limited to pairs used together more than once. */
const AMBIENT_MIN_WEIGHT = 2;

const CATEGORY_ACCENT = {
  Languages: '#14b8a6',
  Frontend: '#38bdf8',
  Backend: '#22c55e',
  AI: '#986ef7',
  Security: '#f59e0b',
  Mobile: '#06b6d4',
  Systems: '#af63f8',
  Research: '#af63f8',
  Infrastructure: '#0ea5e9',
  'Developer Tools': '#f97316',
};

export default function SkillGalaxy({
  graph,
  selected,
  onSelect,
  activeCategory,
  onSelectCategory,
  reduced = false,
}) {
  const boardRef = useRef(null);
  const nodeRefs = useRef(new Map());
  const [points, setPoints] = useState(null);
  const [box, setBox] = useState(null);

  /** Centre of every rendered chip, in board coordinates. */
  const measure = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const bounds = board.getBoundingClientRect();
    const next = {};
    for (const [slug, element] of nodeRefs.current) {
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      next[slug] = {
        x: rect.left - bounds.left + rect.width / 2,
        y: rect.top - bounds.top + rect.height / 2,
      };
    }
    setPoints(next);
    setBox({ width: bounds.width, height: bounds.height });
  }, []);

  // The initial measurement comes from ResizeObserver, which fires once as soon
  // as it starts observing — so there is no setState in an effect body, which
  // the project's lint rules reject, and no second code path for "first paint"
  // that could disagree with the resize path.
  //
  // Fonts are re-measured separately: chip widths change when the display face
  // swaps in, and that can happen without the board's own box changing.
  useEffect(() => {
    const board = boardRef.current;
    if (!board || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => measure());
    observer.observe(board);

    const onResize = () => measure();
    window.addEventListener('resize', onResize);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [measure]);

  const registerNode = useCallback((slug) => (element) => {
    if (element) nodeRefs.current.set(slug, element);
    else nodeRefs.current.delete(slug);
  }, []);

  /** Edges touching the selected skill, and the quiet ambient set behind them. */
  const { activeEdges, ambientEdges, neighbours } = useMemo(() => {
    const active = selected ? graph.edges.filter((e) => e.from === selected || e.to === selected) : [];
    return {
      activeEdges: active,
      ambientEdges: graph.edges.filter((e) => e.weight >= AMBIENT_MIN_WEIGHT),
      neighbours: new Set(active.map((e) => (e.from === selected ? e.to : e.from))),
    };
  }, [graph.edges, selected]);

  const isDimmed = (node) => {
    if (selected) return node.slug !== selected && !neighbours.has(node.slug);
    if (activeCategory && activeCategory !== 'all') return node.category !== activeCategory;
    return false;
  };

  const path = (edge) => {
    const a = points?.[edge.from];
    const b = points?.[edge.to];
    if (!a || !b) return null;
    // A shallow arc rather than a straight line: with this many crossings,
    // curves stay distinguishable where parallel straight lines merge.
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy) || 1;
    const bow = Math.min(length * 0.16, 48);
    return `M ${a.x} ${a.y} Q ${mx - (dy / length) * bow} ${my + (dx / length) * bow} ${b.x} ${b.y}`;
  };

  return (
    <div className="relative" ref={boardRef}>
      {/* Edges. Decorative: every relationship they draw is also stated in the
          evidence panel, so nothing depends on reading the lines. */}
      {points && box && (
        <svg
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          width={box.width}
          height={box.height}
          style={{ overflow: 'visible' }}
        >
          {ambientEdges.map((edge) => {
            const d = path(edge);
            if (!d) return null;
            return (
              <path
                key={`ambient-${edge.id}`}
                d={d}
                fill="none"
                stroke="rgba(148,163,184,0.16)"
                strokeWidth={1}
                opacity={selected ? 0.25 : 1}
              />
            );
          })}
          {activeEdges.map((edge, index) => {
            const d = path(edge);
            if (!d) return null;
            return (
              <motion.path
                key={`active-${edge.id}`}
                d={d}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={Math.min(1 + edge.weight * 0.6, 3)}
                strokeLinecap="round"
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.85 }}
                transition={{
                  duration: reduced ? 0 : duration.slow,
                  delay: reduced ? 0 : index * 0.03,
                  ease: ease.outExpo,
                }}
              />
            );
          })}
        </svg>
      )}

      {/* Islands. One per category that actually has skills. */}
      <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {graph.categories.map((group) => {
          const accent = CATEGORY_ACCENT[group.category] ?? '#14b8a6';
          const categoryActive = activeCategory === group.category;
          return (
            <section
              key={group.category}
              aria-labelledby={`cluster-${group.category.replace(/\s+/g, '-')}`}
              className="surface-card p-4"
              style={{
                borderColor: categoryActive ? `${accent}66` : undefined,
                background: categoryActive ? `${accent}0a` : undefined,
              }}
            >
              <h3 id={`cluster-${group.category.replace(/\s+/g, '-')}`} className="m-0 mb-3">
                <button
                  type="button"
                  onClick={() => onSelectCategory(categoryActive ? 'all' : group.category)}
                  aria-pressed={categoryActive}
                  // A control, not a chip: 44px on touch and still above the 24px
                  // pointer minimum on a desktop pointer.
                  className="font-code text-[10px] uppercase tracking-[0.2em] inline-flex items-center gap-2 min-h-[44px] sm:min-h-[32px] transition-colors"
                  style={{ color: categoryActive ? accent : '#94a3b8' }}
                >
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background: categoryActive ? accent : 'transparent',
                      border: categoryActive ? 'none' : `1px solid ${accent}80`,
                    }}
                  />
                  {group.category}
                  <span className="text-slate-600 normal-case tracking-normal">
                    {group.skills.length}
                  </span>
                </button>
              </h3>

              <ul className="list-none m-0 p-0 flex flex-wrap gap-1.5">
                {group.skills.map((node) => {
                  const isSelected = selected === node.slug;
                  const isNeighbour = neighbours.has(node.slug);
                  const dimmed = isDimmed(node);
                  return (
                    <li key={node.slug}>
                      <motion.button
                        ref={registerNode(node.slug)}
                        type="button"
                        id={`skill-node-${node.slug}`}
                        onClick={() => onSelect(isSelected ? null : node.slug)}
                        aria-pressed={isSelected}
                        aria-label={`${node.label}, ${node.category}, ${node.evidenceCount} ${
                          node.evidenceCount === 1 ? 'piece' : 'pieces'
                        } of evidence`}
                        animate={{ opacity: dimmed ? 0.32 : 1 }}
                        transition={{ duration: reduced ? 0 : duration.normal, ease: ease.outExpo }}
                        whileHover={reduced ? undefined : { y: -2 }}
                        className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 min-h-[44px] sm:min-h-[34px] font-code text-xs transition-[border-color,background-color,box-shadow]"
                        style={{
                          borderColor: isSelected
                            ? node.color
                            : isNeighbour
                              ? `${node.color}66`
                              : 'rgba(255,255,255,0.10)',
                          background: isSelected
                            ? `${node.color}24`
                            : isNeighbour
                              ? `${node.color}12`
                              : 'rgba(8,12,26,0.55)',
                          color: isSelected || isNeighbour ? node.color : '#cbd5e1',
                          boxShadow: isSelected ? `0 0 22px -6px ${node.color}` : 'none',
                        }}
                      >
                        {/* Size carries evidence count; the number is in the
                            accessible name, so the dot is never the only
                            carrier. */}
                        <span
                          aria-hidden="true"
                          className="rounded-full shrink-0"
                          style={{
                            width: `${4 + Math.min(node.evidenceCount, 6)}px`,
                            height: `${4 + Math.min(node.evidenceCount, 6)}px`,
                            background: node.color,
                            opacity: isSelected || isNeighbour ? 1 : 0.55,
                          }}
                        />
                        {node.label}
                      </motion.button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
