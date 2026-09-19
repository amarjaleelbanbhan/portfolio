/**
 * RESEARCHED — KnowledgeGuard.
 *
 * A factorial design, drawn as a grid: deficiency types down one axis, candidate
 * repair actions across the other, every cell a run under the same conditions.
 * That shape *is* the argument — it says "this was measured across a controlled
 * space", which is the difference between research and a demo.
 *
 * The five deficiency types are the ones named in the canonical research
 * question. No cell is shaded to imply a winning strategy and no numbers are
 * shown: the canonical record says the factorial was executed and the analysis
 * completed, and it does not publish results, so neither does this.
 */
import { motion } from 'framer-motion';
import { DiagramFrame, DiagramCaption, DiagramLink, DiagramNode } from './DiagramPrimitives';
import { duration, ease } from '@/lib/motion';

/** Named in the canonical research question, in that order. */
const DEFICIENCIES = ['missing', 'insufficient', 'conflicting', 'outdated', 'absent'];
const REPAIRS = 6;

const CELL = 15;
const GAP = 3;
// The grid starts right of the deficiency labels, and the question/retrieval
// pair runs along the top rather than down the left, so nothing overlaps the
// row labels at this size.
const GRID_X = 104;
const GRID_Y = 52;

export default function ResearchedDiagram({ color, reduced = false }) {
  return (
    <DiagramFrame
      title="KnowledgeGuard factorial design"
      desc="A question retrieves evidence that is deficient in a typed way — missing, insufficient, conflicting, outdated or absent from the corpus. Each deficiency type is crossed with candidate repair actions and every pairing is evaluated under the same controlled conditions. The factorial has been executed and the analysis completed."
    >
      {/* Question → retrieval, running along the top and feeding the grid. */}
      <DiagramNode x={44} y={20} label="Question" color={color} reduced={reduced} delay={0.1} width={58} />
      <DiagramLink d="M 73 20 L 107 20" color={color} reduced={reduced} delay={0.18} />
      <DiagramNode x={142} y={20} label="Retrieved" color={color} reduced={reduced} delay={0.25} width={62} />
      <DiagramLink d="M 142 33 L 142 44" color={color} reduced={reduced} delay={0.35} dashed />

      {/* Deficiency-type axis. */}
      {DEFICIENCIES.map((label, row) => (
        <DiagramCaption key={label} x={GRID_X - 6} y={GRID_Y + row * (CELL + GAP) + 10} anchor="end">
          {label}
        </DiagramCaption>
      ))}

      {/* The factorial grid. Uniform on purpose — no cell is highlighted as a
          result, because no results are published. */}
      {DEFICIENCIES.map((label, row) =>
        Array.from({ length: REPAIRS }).map((_, col) => (
          <motion.rect
            key={`${label}-${col}`}
            x={GRID_X + col * (CELL + GAP)}
            y={GRID_Y + row * (CELL + GAP)}
            width={CELL}
            height={CELL}
            rx={2.5}
            fill={`${color}1f`}
            stroke={color}
            strokeOpacity={0.35}
            initial={reduced ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: duration.normal,
              delay: 0.45 + (row * REPAIRS + col) * 0.012,
              ease: ease.outExpo,
            }}
          />
        ))
      )}

      <DiagramCaption x={GRID_X + (REPAIRS * (CELL + GAP)) / 2 - GAP / 2} y={44} dim={false}>
        REPAIR ACTIONS
      </DiagramCaption>
      <DiagramCaption x={GRID_X - 6} y={44} anchor="end" dim={false}>
        DEFICIENCY
      </DiagramCaption>

      <DiagramCaption
        x={GRID_X + (REPAIRS * (CELL + GAP)) / 2 - GAP / 2}
        y={GRID_Y + DEFICIENCIES.length * (CELL + GAP) + 16}
      >
        EVERY CELL EVALUATED UNDER THE SAME CONDITIONS
      </DiagramCaption>
      <DiagramCaption
        x={GRID_X + (REPAIRS * (CELL + GAP)) / 2 - GAP / 2}
        y={GRID_Y + DEFICIENCIES.length * (CELL + GAP) + 30}
      >
        FACTORIAL EXECUTED · ANALYSIS COMPLETE
      </DiagramCaption>
    </DiagramFrame>
  );
}
