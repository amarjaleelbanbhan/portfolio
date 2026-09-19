/**
 * CONTRIBUTED — upstream open source.
 *
 * One node in the middle, edges out to the repositories the work actually landed
 * in. The visual argument is the transition from "my own repository" to "inside
 * a codebase someone else maintains".
 *
 * Every repository shown comes from the canonical contribution records, and a
 * node's ring reflects that record's real status — a merged PR reads solid, an
 * open one reads dashed and is never drawn as merged. Nothing here is a score,
 * a ranking or a simulated activity graph; the full list with links sits in the
 * DOM beside this drawing.
 */
import { DiagramFrame, DiagramCaption, DiagramLink } from './DiagramPrimitives';
import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

const CENTRE = { x: 62, y: 100 };

export default function ContributedDiagram({ color, contributions = [], reduced = false }) {
  // De-duplicate by repository: two PRs into one project is one relationship on
  // a graph, even though it is two contributions in the list.
  const repos = [];
  for (const c of contributions) {
    const name = c.repository.split('/')[1] ?? c.repository;
    const existing = repos.find((r) => r.name === name);
    if (existing) {
      existing.count += 1;
      if (c.status === 'merged') existing.merged = true;
    } else {
      repos.push({ name, count: 1, merged: c.status === 'merged', status: c.status });
    }
  }

  const top = 42;
  const step = repos.length > 1 ? (168 - 42) / (repos.length - 1) : 0;

  return (
    <DiagramFrame
      title="Upstream contribution graph"
      desc={`Pull requests opened against ${repos.length} upstream repositories. Merged contributions are shown as merged; open contributions are shown as open.`}
    >
      {/* The developer's own node. */}
      <motion.g
        initial={reduced ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: duration.normal, ease: ease.outExpo }}
      >
        <circle cx={CENTRE.x} cy={CENTRE.y} r={16} fill={`${color}26`} stroke={color} strokeOpacity={0.9} />
        <circle cx={CENTRE.x} cy={CENTRE.y} r={5} fill={color} />
        <DiagramCaption x={CENTRE.x} y={CENTRE.y + 32} dim={false}>OWN WORK</DiagramCaption>
      </motion.g>

      {repos.map((repo, i) => {
        const y = top + i * step;
        const x = 214;
        const d = `M ${CENTRE.x + 18} ${CENTRE.y} C 130 ${CENTRE.y}, 150 ${y}, ${x - 8} ${y}`;
        return (
          <g key={repo.name}>
            <DiagramLink
              d={d}
              color={color}
              reduced={reduced}
              delay={0.2 + i * 0.09}
              active={repo.merged}
              dashed={!repo.merged}
            />
            <motion.g
              initial={reduced ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: duration.normal, delay: 0.3 + i * 0.09, ease: ease.outExpo }}
            >
              <circle
                cx={x}
                cy={y}
                r={5}
                fill={repo.merged ? color : 'transparent'}
                stroke={color}
                strokeOpacity={repo.merged ? 0.95 : 0.55}
                strokeDasharray={repo.merged ? undefined : '2 2'}
              />
              <text
                x={x + 12}
                y={y + 3}
                className="font-code"
                style={{ fontSize: 8, fill: repo.merged ? '#cbd5e1' : '#94a3b8' }}
              >
                {repo.name}
              </text>
              {!repo.merged && (
                <text x={x + 12} y={y + 12} className="font-code" style={{ fontSize: 6, fill: '#64748b' }}>
                  open
                </text>
              )}
            </motion.g>
          </g>
        );
      })}

      <DiagramCaption x={214} y={26} anchor="start" dim={false}>UPSTREAM REPOSITORIES</DiagramCaption>
    </DiagramFrame>
  );
}
