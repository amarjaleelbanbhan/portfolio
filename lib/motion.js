/**
 * Shared motion system.
 *
 * Framer Motion cannot read CSS custom properties, so the durations and easings
 * here mirror the tokens in styles/tokens.css. Changing one means changing the
 * other — they are listed side by side in
 * docs/portfolio-2026/design-motion-system.md.
 *
 * Import presets from here instead of writing `transition={{ duration: 0.6,
 * ease: [0.16, 1, 0.3, 1] }}` inline. Those scattered literals are how a site
 * ends up with eleven slightly different "fast" animations.
 *
 * ── The one hard rule ───────────────────────────────────────────────────────
 * Entrance presets animate on MOUNT, never on scroll intersection.
 *
 * Phase 1 shipped `whileInView` on /projects and it left project cards stuck at
 * opacity 0 after a jump-scroll — the observer never fired for elements the
 * scroll skipped over, so real content was permanently invisible. A screenshot
 * caught it. Phase 3 keeps that lesson in the system rather than in a comment on
 * one page: nothing here gates content behind scroll position. If a future phase
 * genuinely needs a scroll-triggered reveal, it must guarantee the element is
 * visible when the observer does not fire.
 */

/** Durations in seconds, mirroring --duration-* in tokens.css. */
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.35,
  slow: 0.7,
  cinematic: 1.2,
};

/** Easing curves, mirroring --ease-* in tokens.css. */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  enter: [0.22, 1, 0.36, 1],
  standard: [0.4, 0, 0.2, 1],
  in: [0.55, 0.055, 0.675, 0.19],
};

/** Stagger steps for grouped reveals. */
export const stagger = {
  tight: 0.04,
  normal: 0.08,
  loose: 0.15,
};

/**
 * True when the visitor asked for reduced motion.
 *
 * SSR-safe: returns false on the server so markup matches, then components
 * refine on mount via usePrefersReducedMotion.
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ── Entrance presets ────────────────────────────────────────────────────────
// Each returns a props object spread straight onto a motion element:
//   <motion.div {...fadeUp()} />

/** Fade in while rising. The default entrance for almost everything. */
export function fadeUp({ delay = 0, distance = 20, duration: d = duration.slow } = {}) {
  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: d, delay, ease: ease.outExpo },
  };
}

/** Fade with no movement. For elements whose position must not shift. */
export function fadeIn({ delay = 0, duration: d = duration.slow } = {}) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: d, delay, ease: ease.outExpo },
  };
}

/**
 * Fade in from the side.
 *
 * Only for elements with horizontal slack inside their container. A full-width
 * element offset horizontally pushes past the viewport and creates real
 * horizontal overflow — that is exactly what the Education timeline did on
 * mobile (measured: 34px past a 375px viewport). Prefer fadeUp when in doubt,
 * and see slideInResponsive for layouts that are only side-by-side above a
 * breakpoint.
 */
export function slideIn({ from = 'left', delay = 0, distance = 30, duration: d = duration.slow } = {}) {
  return {
    initial: { opacity: 0, x: from === 'left' ? -distance : distance },
    animate: { opacity: 1, x: 0 },
    transition: { duration: d, delay, ease: ease.outExpo },
  };
}

/**
 * Horizontal entrance above a breakpoint, vertical below it.
 *
 * For two-column layouts that stack on mobile: sliding sideways is right when
 * the element occupies half the row and wrong — and overflowing — when it spans
 * the full width. Pass the result of useIsWide().
 */
export function slideInResponsive({ from = 'left', wide, delay = 0, distance = 30, duration: d = duration.slow } = {}) {
  return wide
    ? slideIn({ from, delay, distance, duration: d })
    : fadeUp({ delay, distance: 20, duration: d });
}

/** Scale up slightly while fading in. For cards and panels appearing as a unit. */
export function scaleIn({ delay = 0, from = 0.96, duration: d = duration.normal } = {}) {
  return {
    initial: { opacity: 0, scale: from },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: d, delay, ease: ease.outExpo },
  };
}

// ── Staggered groups ────────────────────────────────────────────────────────

/**
 * Container/child variant pair for staggered reveals.
 *
 *   const { container, item } = staggerGroup();
 *   <motion.ul variants={container} initial="hidden" animate="show">
 *     <motion.li variants={item} />
 */
export function staggerGroup({ step = stagger.normal, delay = 0, distance = 16 } = {}) {
  return {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: step, delayChildren: delay } },
    },
    item: {
      hidden: { opacity: 0, y: distance },
      show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.outExpo } },
    },
  };
}

// ── Interaction presets ─────────────────────────────────────────────────────

/** Card hover: lift. Matches the CSS .hover-lift for non-Framer surfaces. */
export const hoverLift = {
  whileHover: { y: -6 },
  transition: { duration: duration.normal, ease: ease.outExpo },
};

/** Button press feedback. */
export const pressable = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.98 },
  transition: { duration: duration.fast, ease: ease.outExpo },
};

/** Interactive tag/chip: subtle, since these appear in dense groups. */
export const tagInteraction = {
  whileHover: { y: -2, scale: 1.04 },
  whileTap: { scale: 0.97 },
  transition: { duration: duration.fast, ease: ease.outExpo },
};

// ── Overlay presets ─────────────────────────────────────────────────────────

/** Backdrop behind a modal or drawer. */
export const backdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: duration.normal, ease: ease.standard },
};

/** Centred dialog. */
export const dialog = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 4 },
  transition: { duration: duration.normal, ease: ease.outExpo },
};

/** Edge drawer. `side` is the edge it is anchored to. */
export function drawer(side = 'right') {
  const offset = side === 'right' ? '100%' : '-100%';
  return {
    initial: { x: offset },
    animate: { x: 0 },
    exit: { x: offset },
    transition: { duration: duration.normal, ease: ease.outExpo },
  };
}

// ── Evidence presets ────────────────────────────────────────────────────────

/**
 * Proof/metric reveal. Slightly slower and more deliberate than a normal fade:
 * evidence is the point of this portfolio, so it is allowed to announce itself.
 */
export function proofReveal({ delay = 0 } = {}) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.slow, delay, ease: ease.enter },
  };
}

/**
 * Architecture/diagram line draw, for SVG paths with pathLength.
 * Phase 4+ uses this for architecture diagrams.
 */
export function drawLine({ delay = 0, duration: d = duration.cinematic } = {}) {
  return {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: d, delay, ease: ease.standard },
  };
}
