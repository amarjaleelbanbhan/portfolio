import Link from 'next/link';
import { motion } from 'framer-motion';
import { hoverLift } from '@/lib/motion';
import { getProjectVisual } from '@/components/project-visuals';
import StatusBadge from '@/components/ui/StatusBadge';
import TechTag from '@/components/ui/TechTag';


/**
 * Renders a canonical Project. Only links that actually exist are rendered, and
 * a non-public source shows an honest marker instead of a button that 404s.
 */
export default function ProjectCard({ slug, title, summary, tags, status, note, links = {}, source, hasCaseStudy = false }) {
  const visual = getProjectVisual(slug);
  const repositoryUrl = links.repository;
  const demoLink = links.demo || links.package;
  const demoLabel = links.demo ? 'Live Demo' : links.package ? 'Package' : null;
  const isPrivateSource = source ? source.visibility !== 'public' : false;
  const sourceLabel = source?.label || 'Private repository';

  return (
    <motion.article
      {...hoverLift}
      className="surface-card group relative h-full flex flex-col overflow-hidden"
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
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-base font-semibold text-slate-50 group-hover:text-white transition-colors">
            {title}
          </h3>
          <StatusBadge status={status} />
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-3">
          {summary}
        </p>
        {note && (
          <p className="text-xs text-slate-500 leading-relaxed mb-4 italic">
            {note}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags?.slice(0, 4).map((tag) => (
            <TechTag key={tag} accent={visual.accent}>
              {tag}
            </TechTag>
          ))}
          {tags?.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-md text-slate-500 bg-white/5">
              +{tags.length - 4}
            </span>
          )}
        </div>

        {/* Case study — only rendered once the route actually exists, so a
            public link never points at an unbuilt page. */}
        {hasCaseStudy && (
          <Link
            href={`/work/${slug}`}
            className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 text-xs font-code font-semibold mb-3 hover:brightness-125 transition-[filter]"
            style={{ color: visual.accent }}
          >
            Read the case study
            <span aria-hidden="true">→</span>
          </Link>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 mt-auto pt-1 [&_a]:min-h-[44px] sm:[&_a]:min-h-0">
          {/* Private work gets an honest marker instead of a button that 404s. */}
          {isPrivateSource && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {sourceLabel}
            </span>
          )}

          {repositoryUrl && (
            <a
              href={repositoryUrl}
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
              {demoLabel}
            </a>
          )}

          {links.privacyPolicy && (
            <a
              href={links.privacyPolicy}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors ml-auto"
            >
              Privacy policy →
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
