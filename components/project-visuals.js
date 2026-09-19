/**
 * Per-project card visuals.
 *
 * Keyed by project slug, never by display title: renaming a project must not
 * silently drop it back to the generic fallback visual.
 *
 * Extracted from ProjectCard in Phase 6 so the compact card and the featured
 * Work-page card draw from one source. Two copies would let a flagship project
 * render its bespoke treatment in one place and the generic fallback in the
 * other, which is exactly the failure the slug keying exists to prevent.
 *
 * `getProjectVisual` is the only way to read this map, so every caller gets the
 * same fallback behaviour.
 */

const projectVisuals = {
  'zakatlink': {
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    accent: '#10b981',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <circle cx="24" cy="24" r="18" strokeOpacity="0.4" />
        <path d="M24 10v28M17 17h10a4 4 0 010 8h-8a4 4 0 010 8h11" strokeLinecap="round" />
      </svg>
    ),
  },
  'rodift': {
    gradient: 'from-teal-500/20 via-emerald-500/10 to-transparent',
    accent: '#14b8a6',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <path d="M24 4c-6.6 0-12 5.4-12 12 0 9 12 28 12 28s12-19 12-28c0-6.6-5.4-12-12-12z" strokeOpacity="0.4" />
        <circle cx="24" cy="16" r="5" />
        <path d="M8 38h8M32 38h8" strokeLinecap="round" strokeOpacity="0.5" />
      </svg>
    ),
  },
  'knowledgeguard': {
    gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
    accent: '#a855f7',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <circle cx="19" cy="19" r="11" strokeOpacity="0.5" />
        <path d="M27 27l9 9" strokeLinecap="round" />
        <path d="M14 19h10M19 14v10" strokeLinecap="round" strokeOpacity="0.6" />
        <circle cx="19" cy="19" r="3" fill="currentColor" fillOpacity="0.25" />
      </svg>
    ),
  },
  'cortexward': {
    gradient: 'from-orange-500/20 via-red-500/10 to-transparent',
    accent: '#f97316',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <path d="M24 5L9 11v13c0 8.6 6.4 16.6 15 19 8.6-2.4 15-10.4 15-19V11L24 5z" strokeOpacity="0.4" />
        <circle cx="24" cy="21" r="5" />
        <path d="M24 26v7M19 24l-4 3M29 24l4 3" strokeLinecap="round" strokeOpacity="0.7" />
      </svg>
    ),
  },
  'sceneforge': {
    gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    accent: '#ec4899',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <rect x="5" y="12" width="26" height="24" rx="3" strokeOpacity="0.4" />
        <path d="M31 21l12-6v18l-12-6z" strokeLinejoin="round" />
        <path d="M5 18h26" strokeOpacity="0.5" />
        <circle cx="10" cy="15" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  'emergency-mesh': {
    gradient: 'from-red-500/20 via-orange-500/10 to-transparent',
    accent: '#ef4444',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <circle cx="24" cy="24" r="4" fill="currentColor" fillOpacity="0.3" />
        <circle cx="10" cy="13" r="3.5" />
        <circle cx="38" cy="13" r="3.5" />
        <circle cx="10" cy="35" r="3.5" />
        <circle cx="38" cy="35" r="3.5" />
        <path d="M13 15l8 6M35 15l-8 6M13 33l8-6M35 33l-8-6" strokeOpacity="0.55" strokeLinecap="round" />
      </svg>
    ),
  },
  'scar-os': {
    gradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
    accent: '#6366f1',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <rect x="14" y="7" width="12" height="20" rx="6" strokeOpacity="0.5" />
        <path d="M9 22c0 6.6 5.4 12 12 12s12-5.4 12-12" strokeLinecap="round" />
        <path d="M21 34v6M15 40h12" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M34 14v8M39 12v12M44 16v4" strokeLinecap="round" strokeOpacity="0.45" />
      </svg>
    ),
  },
  'meditalk': {
    gradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    accent: '#f43f5e',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <path d="M24 6a10 10 0 00-10 10v6a10 10 0 0020 0v-6A10 10 0 0024 6z" strokeOpacity="0.4" />
        <path d="M10 22c0 7.732 6.268 14 14 14s14-6.268 14-14M24 36v6M18 42h12" strokeLinecap="round" />
      </svg>
    ),
  },
  'smart-notebook': {
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    accent: '#8b5cf6',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <rect x="8" y="8" width="32" height="36" rx="3" strokeOpacity="0.4" />
        <path d="M15 18h18M15 24h18M15 30h12" strokeLinecap="round" />
        <circle cx="36" cy="34" r="6" fill="currentColor" fillOpacity="0.15" />
        <path d="M34 34l1.5 1.5L38 32" strokeLinecap="round" />
      </svg>
    ),
  },
  'eduresource-hub': {
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    accent: '#f59e0b',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <path d="M24 8L4 18l20 10 20-10L24 8z" strokeOpacity="0.4" />
        <path d="M4 18v14M12 22v10M36 22v10M44 18v14" strokeLinecap="round" />
        <path d="M12 32c0 4 6 6 12 6s12-2 12-6" strokeLinecap="round" />
      </svg>
    ),
  },
  'veripatch': {
    gradient: 'from-orange-500/20 via-amber-500/10 to-transparent',
    accent: '#fbbf24',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <path d="M24 6L8 13v13c0 9 7 16 16 19 9-3 16-10 16-19V13L24 6z" strokeOpacity="0.4" />
        <path d="M17 24l5 5 9-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  'cs-learning-game': {
    gradient: 'from-lime-500/20 via-green-500/10 to-transparent',
    accent: '#84cc16',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <circle cx="12" cy="24" r="6" strokeOpacity="0.5" />
        <circle cx="36" cy="24" r="6" strokeOpacity="0.5" />
        <path d="M18 24h12" strokeLinecap="round" />
        <path d="M36 18l6-6M36 30l6 6" strokeLinecap="round" />
        <path d="M12 18l-6-6M12 30l-6 6" strokeLinecap="round" />
        <circle cx="42" cy="12" r="3" fill="currentColor" fillOpacity="0.4" />
        <circle cx="42" cy="36" r="3" fill="currentColor" fillOpacity="0.4" />
        <circle cx="6" cy="12" r="3" fill="currentColor" fillOpacity="0.4" />
        <circle cx="6" cy="36" r="3" fill="currentColor" fillOpacity="0.4" />
      </svg>
    ),
  },
  'todo-tracker-pro': {
    gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    accent: '#0ea5e9',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <rect x="8" y="8" width="32" height="32" rx="4" strokeOpacity="0.4" />
        <path d="M16 18l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 20h8" strokeLinecap="round" />
        <path d="M16 28l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 30h8" strokeLinecap="round" />
      </svg>
    ),
  },
  'buildsphere': {
    gradient: 'from-cyan-500/20 via-teal-500/10 to-transparent',
    accent: '#06b6d4',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <path d="M24 6l18 10v16L24 42 6 32V16L24 6z" strokeOpacity="0.4" />
        <path d="M24 6v36M6 16l18 10 18-10" strokeLinecap="round" />
        <path d="M15 11l9 5 9-5" strokeLinecap="round" strokeOpacity="0.5" />
      </svg>
    ),
  },
};

const defaultVisual = {
  gradient: 'from-neon-cyan/15 via-slate-500/10 to-transparent',
  accent: '#14b8a6',
  icon: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
      <rect x="8" y="8" width="32" height="32" rx="4" strokeOpacity="0.4" />
      <path d="M16 24h16M24 16v16" strokeLinecap="round" />
    </svg>
  ),
};

/** The visual for a slug, or the generic fallback when none is defined. */
export function getProjectVisual(slug) {
  return projectVisuals[slug] || defaultVisual;
}

/**
 * True when the slug has a bespoke visual.
 *
 * Not usable from scripts/validate-content.mjs: this module contains JSX, and
 * the content validator runs outside Next on Node type-stripping, which cannot
 * compile it. Flagship visual coverage is asserted in the browser test instead.
 */
export function hasProjectVisual(slug) {
  return Object.prototype.hasOwnProperty.call(projectVisuals, slug);
}

/** Every slug that has a bespoke visual. */
export function projectVisualSlugs() {
  return Object.keys(projectVisuals);
}
