import { motion } from 'framer-motion';

const projectVisuals = {
  ZakatLink: {
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    accent: '#10b981',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <circle cx="24" cy="24" r="18" strokeOpacity="0.4" />
        <path d="M24 10v28M17 17h10a4 4 0 010 8h-8a4 4 0 010 8h11" strokeLinecap="round" />
      </svg>
    ),
  },
  'Smart Notebook': {
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
  'Bus Reservation System': {
    gradient: 'from-blue-500/20 via-sky-500/10 to-transparent',
    accent: '#3b82f6',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <rect x="6" y="12" width="36" height="24" rx="4" strokeOpacity="0.4" />
        <path d="M6 20h36M14 32v4M34 32v4" strokeLinecap="round" />
        <circle cx="14" cy="32" r="3" />
        <circle cx="34" cy="32" r="3" />
        <path d="M6 20V14" strokeLinecap="round" />
      </svg>
    ),
  },
  'EduResource Hub': {
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
  'MediTalk - AI Voice Agent': {
    gradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    accent: '#f43f5e',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <path d="M24 6a10 10 0 00-10 10v6a10 10 0 0020 0v-6A10 10 0 0024 6z" strokeOpacity="0.4" />
        <path d="M10 22c0 7.732 6.268 14 14 14s14-6.268 14-14M24 36v6M18 42h12" strokeLinecap="round" />
        <path d="M20 16h8M20 21h6" strokeLinecap="round" />
      </svg>
    ),
  },
  VeriPatch: {
    gradient: 'from-orange-500/20 via-amber-500/10 to-transparent',
    accent: '#f97316',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <path d="M24 6L8 13v13c0 9 7 16 16 19 9-3 16-10 16-19V13L24 6z" strokeOpacity="0.4" />
        <path d="M17 24l5 5 9-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  'MCTS — MCP Security Scanner': {
    gradient: 'from-indigo-500/20 via-violet-500/10 to-transparent',
    accent: '#6366f1',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-60">
        <circle cx="24" cy="24" r="16" strokeOpacity="0.4" />
        <circle cx="24" cy="24" r="8" strokeOpacity="0.5" />
        <circle cx="24" cy="24" r="2" fill="currentColor" fillOpacity="0.6" />
        <path d="M24 8v4M24 36v4M8 24h4M36 24h4" strokeLinecap="round" />
      </svg>
    ),
  },
  'CS Learning by Game': {
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
  'TODO Tracker Pro': {
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
  BuildSphere: {
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

export default function ProjectCard({ title, description, tags, link, github, image }) {
  const visual = projectVisuals[title] || defaultVisual;
  const projectLink = link && link !== '#' ? link : github;
  const isGitHub = projectLink?.includes('github.com');
  const demoLink = link && !link.includes('github.com') && link !== '#' ? link : null;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative rounded-xl border border-white/8 bg-white/3 backdrop-blur overflow-hidden hover:border-white/16 transition-colors duration-300"
      style={{ '--card-accent': visual.accent }}
    >
      {/* Visual preview area */}
      <div
        className={`relative h-36 bg-gradient-to-br ${visual.gradient} overflow-hidden flex items-center justify-center`}
        aria-hidden="true"
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        {/* Glow orb */}
        <div
          className="absolute w-32 h-32 rounded-full blur-3xl opacity-30"
          style={{ background: visual.accent }}
        />
        {/* Icon */}
        <div className="relative z-10" style={{ color: visual.accent }}>
          {visual.icon}
        </div>
        {/* Accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${visual.accent}, transparent)` }}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-50 mb-1.5 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md font-code"
              style={{
                background: `${visual.accent}14`,
                color: visual.accent,
                border: `1px solid ${visual.accent}25`,
              }}
            >
              {tag}
            </span>
          ))}
          {tags?.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-md text-slate-500 bg-white/5">
              +{tags.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Code
            </a>
          )}
          {demoLink && (
            <a
              href={demoLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: visual.accent }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          )}
          {!demoLink && github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors ml-auto"
              style={{ color: visual.accent }}
            >
              View Project →
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
