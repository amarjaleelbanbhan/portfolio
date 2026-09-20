/**
 * Case-study hero.
 *
 * Reuses the slug-keyed project visual, so a case study opens with the same
 * treatment the project carries everywhere else and a flagship cannot appear
 * here as a generic placeholder.
 *
 * Source handling is the canonical model's, not a special case: public projects
 * get their real links, private ones get an honest marker and no URL.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getProjectVisual } from '@/components/project-visuals';
import StatusBadge from '@/components/ui/StatusBadge';
import DomainBadge from '@/components/ui/DomainBadge';
import TechTag from '@/components/ui/TechTag';
import { ProofStrip } from './sections';
import { duration, ease } from '@/lib/motion';

const LINK_LABELS = {
  repository: 'Code',
  demo: 'Live demo',
  package: 'Package',
  documentation: 'Docs',
  report: 'Report',
  release: 'Release',
  privacyPolicy: 'Privacy policy',
};

export default function ProjectHero({ project, technologies = [], reduced = false }) {
  const visual = getProjectVisual(project.slug);
  const accent = visual.accent;
  const isPrivate = project.source.visibility !== 'public';
  const links = Object.entries(project.links ?? {}).filter(([, href]) => Boolean(href));

  return (
    <header className="mb-12" data-domain={project.domains?.[0]}>
      <nav aria-label="Breadcrumb" className="mb-5">
        <Link
          href="/work"
          className="font-code text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Engineering Work
        </Link>
      </nav>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_200px] md:items-start">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-3">
            <StatusBadge status={project.status} />
            {(project.domains ?? []).map((d) => (
              <DomainBadge key={d} domain={d} />
            ))}
          </div>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.outExpo }}
            className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 text-balance"
          >
            {project.title}
          </motion.h1>

          <p className="text-base text-slate-300 leading-relaxed max-w-2xl mb-4">
            {project.summary}
          </p>

          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {technologies.map((tech) => (
                <TechTag key={tech.key} accent={accent}>
                  {tech.label}
                </TechTag>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {isPrivate && (
              <span className="inline-flex items-center gap-1.5 text-xs font-code text-slate-500 pr-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {project.source.label ?? 'Private repository'}
              </span>
            )}
            {links.map(([field, href]) => (
              <a
                key={field}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-code font-semibold px-3 py-2 min-h-[44px] sm:min-h-0 sm:py-1.5 rounded-md border transition-colors hover:brightness-125"
                style={{ color: accent, borderColor: `${accent}40`, background: `${accent}12` }}
              >
                {LINK_LABELS[field] ?? field}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* The project's own visual, at case-study scale. */}
        <div
          className={`relative h-36 md:h-44 rounded-lg overflow-hidden bg-gradient-to-br ${visual.gradient} flex items-center justify-center order-first md:order-last`}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
          <div className="absolute w-32 h-32 rounded-full blur-3xl opacity-30" style={{ background: accent }} />
          <div className="relative z-10" style={{ color: accent }}>
            {visual.icon}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ProofStrip proof={project.proof} />
      </div>
    </header>
  );
}
