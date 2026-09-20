/**
 * An interactive protocol walkthrough over a small illustrative network.
 *
 * Each step lights the nodes and links it involves and explains one documented
 * behaviour. Crucially, every step also carries a status — whether the step is
 * something the implementation does on real hardware, something only a simulator
 * has done, or something that is not built at all — so the diagram cannot
 * animate a capability into existence.
 *
 * The far node is drawn permanently out of range and its link is never
 * established. That is deliberate: it keeps a failure state on screen, and it
 * means no sequence of steps can be read as a completed multi-hop delivery.
 *
 * The step list is a real list of buttons and the diagram is `aria-hidden`,
 * because the steps carry the information and the drawing only illustrates it.
 * Selecting a step is optional — every explanation is visible in the list.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

const STATUS = {
  live: { label: 'Runs on real hardware', color: '#22c55e', mark: '●' },
  simulated: { label: 'Simulated only', color: '#f59e0b', mark: '◐' },
  'not-implemented': { label: 'Not implemented', color: '#8291aa', mark: '○' },
};

const W = 320;
const H = 150;

export default function ProtocolWalkthrough({ walkthrough, accent, reduced = false }) {
  const [active, setActive] = useState(null);
  if (!walkthrough?.nodes?.length) return null;

  const { title, intro, nodes, links, steps, caveat } = walkthrough;
  const step = steps.find((s) => s.id === active) ?? null;

  const spacing = W / (nodes.length + 1);
  const pos = new Map(nodes.map((n, i) => [n.id, { x: spacing * (i + 1), y: H / 2 }]));

  const litNodes = new Set(step?.nodes ?? []);
  const litLinks = new Set(step?.links ?? []);

  return (
    <section aria-labelledby="protocol-heading" className="mb-12 scroll-mt-24" id="protocol">
      <h2
        id="protocol-heading"
        className="text-xl sm:text-2xl font-bold text-slate-50 tracking-tight mb-2"
      >
        {title}
      </h2>
      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mb-5">{intro}</p>

      <figure className="m-0 mb-5">
        <div className="surface-card p-4 sm:p-5">
          {/* The drawing illustrates the steps below; the steps carry the
              information, so this is hidden from assistive technology rather
              than duplicating it badly. */}
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" aria-hidden="true">
            <text
              x={W / 2}
              y={14}
              textAnchor="middle"
              className="font-code"
              style={{ fontSize: 7, fill: '#94a3b8', letterSpacing: '0.1em' }}
            >
              ILLUSTRATIVE PROTOCOL SIMULATION
            </text>

            {links.map((link) => {
              const a = pos.get(link.from);
              const b = pos.get(link.to);
              if (!a || !b) return null;
              const lit = litLinks.has(link.id);
              return (
                <g key={link.id}>
                  <motion.line
                    x1={a.x + 16}
                    y1={a.y}
                    x2={b.x - 16}
                    y2={b.y}
                    stroke={link.established ? accent : '#8291aa'}
                    strokeOpacity={lit ? 0.95 : link.established ? 0.35 : 0.2}
                    strokeWidth={lit ? 2 : 1}
                    strokeDasharray={link.established ? undefined : '3 3'}
                    initial={reduced ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: duration.slow, ease: ease.standard }}
                  />
                  {!link.established && (
                    <text
                      x={(a.x + b.x) / 2}
                      y={a.y - 8}
                      textAnchor="middle"
                      className="font-code"
                      style={{ fontSize: 6, fill: '#8291aa' }}
                    >
                      NO LINK
                    </text>
                  )}
                </g>
              );
            })}

            {nodes.map((node) => {
              const p = pos.get(node.id);
              const lit = litNodes.has(node.id);
              return (
                <g key={node.id}>
                  {node.inRange && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={28}
                      fill={lit ? `${accent}12` : 'transparent'}
                      stroke={accent}
                      strokeOpacity={lit ? 0.3 : 0.12}
                      strokeDasharray="2 4"
                    />
                  )}
                  <rect
                    x={p.x - 11}
                    y={p.y - 18}
                    width={22}
                    height={36}
                    rx={4}
                    fill="rgba(8,12,26,0.92)"
                    stroke={node.inRange ? accent : '#8291aa'}
                    strokeOpacity={lit ? 1 : 0.45}
                    strokeWidth={lit ? 1.6 : 1}
                  />
                  <rect
                    x={p.x - 7}
                    y={p.y - 13}
                    width={14}
                    height={22}
                    rx={1.5}
                    fill={lit ? `${accent}40` : `${accent}14`}
                  />
                  <text
                    x={p.x}
                    y={p.y + 32}
                    textAnchor="middle"
                    className="font-code"
                    style={{ fontSize: 6.5, fill: node.inRange ? '#94a3b8' : '#8291aa' }}
                  >
                    {node.label}
                  </text>
                </g>
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

      <ol className="list-none m-0 p-0 space-y-2">
        {steps.map((s, i) => {
          const status = STATUS[s.status] ?? STATUS['not-implemented'];
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setActive(isActive ? null : s.id)}
                aria-pressed={isActive}
                className="w-full text-left surface-card p-3.5 transition-colors hover:border-white/20"
                style={{ borderColor: isActive ? `${accent}66` : undefined }}
              >
                <span className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-6 h-6 rounded flex items-center justify-center font-code text-[10px] font-bold"
                    style={{ background: `${accent}1a`, color: accent, border: `1px solid ${accent}33` }}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-semibold text-slate-100">{s.label}</span>
                      <span
                        className="font-code text-[10px] uppercase tracking-wider"
                        style={{ color: status.color }}
                      >
                        <span aria-hidden="true">{status.mark} </span>
                        {status.label}
                      </span>
                    </span>
                    <span className="block text-xs text-slate-400 leading-relaxed">{s.detail}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
