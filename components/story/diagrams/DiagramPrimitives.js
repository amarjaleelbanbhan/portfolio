/**
 * Shared vocabulary for the five story diagrams.
 *
 * Each stage gets a visual built for its own engineering problem — a flow, a
 * pipeline, a factorial grid, a radio network, a contribution graph — but they
 * are drawn from the same parts so the story reads as one directed piece rather
 * than five unrelated animations.
 *
 * Everything here is SVG. No stage loads a Three.js scene: the homepage already
 * carries one for the Engineering Core, and nothing in this narrative needs
 * perspective, lighting or depth to be understood.
 *
 * Motion rule inherited from Phase 3: these animate on mount, never on scroll
 * intersection. A diagram that scrolled past without its observer firing would
 * be permanently blank, which is the regression Phase 1 shipped once already.
 */
import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

/** Shared canvas box. Every diagram uses the same coordinate space. */
export const VIEW = { w: 320, h: 200 };

/** A labelled node. `state` drives emphasis without changing layout. */
export function DiagramNode({
  x,
  y,
  label,
  color,
  active = false,
  shape = 'rect',
  width = 62,
  height = 26,
  delay = 0,
  reduced = false,
}) {
  const common = {
    initial: reduced ? false : { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: duration.normal, delay, ease: ease.outExpo },
  };

  return (
    <motion.g {...common}>
      {shape === 'rect' ? (
        <rect
          x={x - width / 2}
          y={y - height / 2}
          width={width}
          height={height}
          rx={6}
          fill={active ? `${color}26` : 'rgba(8,12,26,0.72)'}
          stroke={color}
          strokeOpacity={active ? 0.95 : 0.4}
          strokeWidth={active ? 1.6 : 1}
        />
      ) : (
        <circle
          cx={x}
          cy={y}
          r={height / 2}
          fill={active ? `${color}26` : 'rgba(8,12,26,0.72)'}
          stroke={color}
          strokeOpacity={active ? 0.95 : 0.4}
          strokeWidth={active ? 1.6 : 1}
        />
      )}
      <text
        x={x}
        y={y + 3.2}
        textAnchor="middle"
        className="font-code"
        style={{ fontSize: 8, fill: active ? color : '#cbd5e1', letterSpacing: '0.02em' }}
      >
        {label}
      </text>
    </motion.g>
  );
}

/**
 * A connection between two points.
 *
 * Draws itself with pathLength so the link reads as data moving through the
 * system rather than appearing all at once. Under reduced motion it is simply
 * present — the diagram must be complete and legible, not empty.
 */
export function DiagramLink({ d, color, delay = 0, active = false, reduced = false, dashed = false }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeOpacity={active ? 0.9 : 0.32}
      strokeWidth={active ? 1.6 : 1}
      strokeDasharray={dashed ? '3 4' : undefined}
      initial={reduced ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: duration.slow, delay, ease: ease.standard }}
    />
  );
}

/**
 * A packet travelling along a path.
 *
 * Purely decorative reinforcement of the link it follows, so it is dropped
 * entirely under reduced motion rather than being slowed down.
 */
export function DiagramPulse({ d, color, delay = 0, dur = 2.4, reduced = false }) {
  if (reduced) return null;
  return (
    <circle r={2.4} fill={color}>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={d} />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        dur={`${dur}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  );
}

/** Small caption inside the drawing, for axis or group labels. */
export function DiagramCaption({ x, y, children, anchor = 'middle', dim = true }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className="font-code"
      style={{ fontSize: 7, fill: dim ? '#64748b' : '#94a3b8', letterSpacing: '0.08em' }}
    >
      {children}
    </text>
  );
}

/**
 * The frame every diagram sits in.
 *
 * `title` and `desc` are what a screen reader gets instead of the drawing, so
 * the information is never only in the pixels.
 */
export function DiagramFrame({ title, desc, children, className = '' }) {
  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className={`w-full h-auto ${className}`}
      role="img"
      aria-label={`${title}. ${desc}`}
    >
      {children}
    </svg>
  );
}
