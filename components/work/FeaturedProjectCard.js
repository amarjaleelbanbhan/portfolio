/**
 * The large card used for flagship work on /work.
 *
 * Substantially more than the compact ProjectCard: it carries the problem the
 * project addresses, the engineering contribution, domains, technologies,
 * verified evidence, essential limitations and every link that actually exists.
 *
 * Every one of those blocks is conditional. Only RODIFT and VeriPatch currently
 * have populated `problem` and `role` fields; KnowledgeGuard, CortexWard and
 * SceneForge have neither. Rather than invent a problem statement or a
 * responsibility for them, this renders the heading only when there is real
 * content under it — an empty "My contribution" heading would be worse than no
 * heading at all. The case-study phases fill those fields from real evidence.
 *
 * The visual comes from the shared slug-keyed map, so a flagship project cannot
 * fall back to the generic placeholder.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getProjectVisual } from '@/components/project-visuals';
import StatusBadge from '@/components/ui/StatusBadge';
import DomainBadge from '@/components/ui/DomainBadge';
import ProofBadge from '@/components/ui/ProofBadge';
import TechTag from '@/components/ui/TechTag';
import { duration, ease } from '@/lib/motion';

/** Link labels, keyed by the canonical ProjectLinks field. */
const LINK_LABELS = {
  repository: 'Code',
  demo: 'Live demo',
  package: 'Package',
  documentation: 'Docs',
  report: 'Report',
  release: 'Release',
  privacyPolicy: 'Privacy policy',
};

function LinkAction({ field, href, accent }) {
  const label = LINK_LABELS[field];
  if (!label) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-code font-semibold px-3 py-2 min-h-[44px] sm:min-h-0 sm:py-1.5 rounded-md border transition-colors duration-[var(--duration-fast)] hover:brightness-125"
      style={{ color: accent, borderColor: `${accent}40`, background: `${accent}12` }}
    >
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export default function FeaturedProjectCard({ project, index = 0, technologies = [] }) {
  const visual = getProjectVisual(project.slug);
  const accent = visual.accent;
  const isPrivate = project.source.visibility !== 'public';
  const verifiedProof = (project.proof ?? []).filter((p) => p.verified);
  const linkEntries = Object.entries(project.links ?? {}).filter(([, href]) => Boolean(href));

  return (
    <motion.article
      // Anchored so legacy /projects#slug links and Core/story destinations
      // land on the right project here.
      id={project.slug}
      data-domain={project.domains?.[0]}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, delay: Math.min(index * 0.06, 0.3), ease: ease.outExpo }}
      className="surface-card group relative overflow-hidden scroll-mt-24"
      style={{ '--card-accent': accent }}
    >
      <div className="grid md:grid-cols-[210px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Visual panel — the bespoke, slug-keyed treatment. */}
        <div
          className={`relative min-h-[150px] md:min-h-full bg-gradient-to-br ${visual.gradient} overflow-hidden flex items-center justify-center`}
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
          <div
            className="absolute w-40 h-40 rounded-full blur-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-50"
            style={{ background: accent }}
          />
          <div
            className="relative z-10 transition-transform duration-500 group-hover:scale-110"
            style={{ color: accent }}
          >
            {visual.icon}
          </div>
          {/* Domain-accent edge, lit on hover. */}
          <div
            className="absolute inset-x-0 bottom-0 md:inset-y-0 md:left-auto md:right-0 md:w-0.5 h-0.5 md:h-auto opacity-40 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
            <h3 className="text-xl font-bold text-slate-50 tracking-tight">
              {project.title}
            </h3>
            <StatusBadge status={project.status} />
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {(project.domains ?? []).map((domain) => (
              <DomainBadge key={domain} domain={domain} />
            ))}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">{project.summary}</p>

          {/* Only rendered when the canonical record actually has one. */}
          {project.problem && (
            <div className="mb-3.5">
              <h4 className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1.5">
                Problem
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">{project.problem}</p>
            </div>
          )}

          {project.role && (
            <div className="mb-3.5">
              <h4 className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1.5">
                My contribution
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">{project.role}</p>
            </div>
          )}

          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {technologies.map((tech) => (
                <TechTag key={tech.key} accent={accent}>
                  {tech.label}
                </TechTag>
              ))}
            </div>
          )}

          {verifiedProof.length > 0 && (
            <div className="mb-4">
              <h4 className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                Verified evidence
              </h4>
              <div className="flex flex-wrap gap-2">
                {verifiedProof.map((proof) => (
                  <ProofBadge key={proof.id} proof={proof} />
                ))}
              </div>
            </div>
          )}

          {(project.limitations ?? []).length > 0 && (
            <div className="mb-4">
              <h4 className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1.5">
                Limitations
              </h4>
              <ul className="list-none m-0 p-0 space-y-1">
                {project.limitations.map((limitation) => (
                  <li
                    key={limitation}
                    className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed"
                  >
                    <span aria-hidden="true" className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.note && (
            <p className="text-xs text-slate-500 italic leading-relaxed mb-4">{project.note}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* Private work gets an honest marker, never a button that 404s. */}
            {isPrivate && (
              <span className="inline-flex items-center gap-1.5 text-xs font-code text-slate-500 pr-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {project.source.label ?? 'Private repository'}
              </span>
            )}
            {linkEntries.map(([field, href]) => (
              <LinkAction key={field} field={field} href={href} accent={accent} />
            ))}
            <Link
              href="/#engineering-story"
              className="ml-auto text-xs font-code text-slate-500 hover:text-slate-300 transition-colors"
            >
              How I work →
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
