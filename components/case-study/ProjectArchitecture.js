/**
 * Sanitized architecture diagram.
 *
 * Renders from the canonical `architecture.nodes` / `architecture.flows` spec
 * rather than from hand-drawn coordinates, so a case study describes components
 * that exist in content and cannot quietly gain an integration nobody built.
 * Validation checks that every flow references a real node.
 *
 * Layout is computed, not authored: nodes are placed in columns by their
 * dependency depth (how far they sit from a node with no inbound flow), which
 * gives a readable left-to-right system diagram without anyone positioning
 * boxes by hand.
 *
 * SVG, not WebGL. A case study should not load a 3D stack to draw seven boxes,
 * and the homepage already carries the only WebGL scene on the site.
 *
 * The node list is also rendered as a real description list below the drawing,
 * so the architecture is readable without seeing the diagram at all.
 */
import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

const COL_W = 150;
const ROW_H = 72;
const NODE_W = 118;
const NODE_H = 42;
const PAD = 16;

/** Shape hint per node kind, so a data store never looks like a client. */
const KIND_STYLE = {
  client: { rx: 8, dash: null },
  service: { rx: 6, dash: null },
  data: { rx: 18, dash: null },
  external: { rx: 6, dash: '4 3' },
  process: { rx: 20, dash: null },
};

/**
 * Assign each node a column from its longest path back to a root.
 *
 * Iterative rather than recursive so a cycle in the spec cannot blow the stack —
 * it just stops improving after `nodes.length` passes.
 */
function computeColumns(nodes, flows) {
  const depth = new Map(nodes.map((n) => [n.id, 0]));
  for (let pass = 0; pass < nodes.length; pass += 1) {
    let changed = false;
    for (const flow of flows) {
      const next = (depth.get(flow.from) ?? 0) + 1;
      if (next > (depth.get(flow.to) ?? 0)) {
        depth.set(flow.to, next);
        changed = true;
      }
    }
    if (!changed) break;
  }
  return depth;
}

function layout(nodes, flows) {
  const depth = computeColumns(nodes, flows);
  const columns = new Map();
  for (const node of nodes) {
    const col = depth.get(node.id) ?? 0;
    if (!columns.has(col)) columns.set(col, []);
    columns.get(col).push(node);
  }

  const positions = new Map();
  const maxRows = Math.max(...[...columns.values()].map((c) => c.length), 1);
  for (const [col, list] of columns) {
    list.forEach((node, row) => {
      // Centre each column vertically against the tallest one.
      const offset = (maxRows - list.length) / 2;
      positions.set(node.id, {
        x: PAD + col * COL_W + NODE_W / 2,
        y: PAD + (row + offset) * ROW_H + NODE_H / 2,
      });
    });
  }

  return {
    positions,
    width: PAD * 2 + columns.size * COL_W,
    height: PAD * 2 + maxRows * ROW_H,
  };
}

export default function ProjectArchitecture({ architecture, accent, reduced = false }) {
  if (!architecture?.nodes?.length) return null;

  const { nodes, flows = [], summary, caveat } = architecture;
  const { positions, width, height } = layout(nodes, flows);

  return (
    <section aria-labelledby="architecture-heading" className="mb-12">
      <h2
        id="architecture-heading"
        className="text-xl sm:text-2xl font-bold text-slate-50 tracking-tight mb-2"
      >
        Architecture
      </h2>
      {summary && (
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mb-5">{summary}</p>
      )}

      <figure className="m-0">
        <div className="surface-card p-4 sm:p-5 overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            // Scales with its container rather than carrying a pixel minimum.
            // An inline min-width here raised the min-content size of every
            // ancestor, which pushed the page past the viewport on phones —
            // overflow-x on the card cannot clamp that, because overflow does
            // not reduce a block's min-content contribution. The component list
            // below the drawing is the readable form on small screens.
            className="w-full h-auto"
            role="img"
            aria-label={`${summary || 'System architecture'}. Components: ${nodes
              .map((n) => n.label)
              .join(', ')}.`}
          >
            {flows.map((flow, i) => {
              const a = positions.get(flow.from);
              const b = positions.get(flow.to);
              if (!a || !b) return null;
              // Route out of the right edge of the source into the left edge of
              // the target, curving so parallel flows stay distinguishable.
              const x1 = a.x + NODE_W / 2;
              const x2 = b.x - NODE_W / 2;
              const mid = (x1 + x2) / 2;
              const d = `M ${x1} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${x2} ${b.y}`;
              return (
                <g key={`${flow.from}-${flow.to}-${i}`}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={accent}
                    strokeOpacity={0.4}
                    strokeWidth={1.2}
                    initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: duration.slow, delay: 0.1 + i * 0.05, ease: ease.standard }}
                  />
                  {flow.label && (
                    <text
                      x={mid}
                      y={(a.y + b.y) / 2 - 5}
                      textAnchor="middle"
                      className="font-code"
                      style={{ fontSize: 7, fill: '#64748b' }}
                    >
                      {flow.label}
                    </text>
                  )}
                </g>
              );
            })}

            {nodes.map((node, i) => {
              const pos = positions.get(node.id);
              if (!pos) return null;
              const style = KIND_STYLE[node.kind] ?? KIND_STYLE.service;
              return (
                <motion.g
                  key={node.id}
                  initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: duration.normal, delay: i * 0.05, ease: ease.outExpo }}
                >
                  <rect
                    x={pos.x - NODE_W / 2}
                    y={pos.y - NODE_H / 2}
                    width={NODE_W}
                    height={NODE_H}
                    rx={style.rx}
                    fill="rgba(8,12,26,0.85)"
                    stroke={accent}
                    strokeOpacity={0.55}
                    strokeDasharray={style.dash ?? undefined}
                  />
                  <text
                    x={pos.x}
                    y={node.detail ? pos.y - 1 : pos.y + 3}
                    textAnchor="middle"
                    className="font-code"
                    style={{ fontSize: 9, fill: '#e2e8f0' }}
                  >
                    {node.label}
                  </text>
                  {node.detail && (
                    <text
                      x={pos.x}
                      y={pos.y + 10}
                      textAnchor="middle"
                      className="font-code"
                      style={{ fontSize: 6.5, fill: '#64748b' }}
                    >
                      {node.detail.length > 24 ? `${node.detail.slice(0, 22)}…` : node.detail}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>
        </div>
        {caveat && (
          <figcaption className="mt-2.5 text-[11px] text-slate-500 leading-relaxed">
            {caveat}
          </figcaption>
        )}
      </figure>

      {/* The same information as text. A reader who cannot see the drawing gets
          the full component list and what each part does. */}
      <dl className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {nodes.map((node) => (
          <div key={node.id} className="min-w-0">
            <dt className="font-code text-xs font-semibold" style={{ color: accent }}>
              {node.label}
            </dt>
            {node.detail && (
              <dd className="text-xs text-slate-400 leading-relaxed m-0">{node.detail}</dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
