/**
 * Related work.
 *
 * Related by shared engineering domain, drawn from canonical content rather than
 * from a hand-maintained "see also" list — so a new project in the same domain
 * appears automatically and a retired one drops out.
 *
 * Links go to `/work#slug` rather than `/work/slug`: only projects with a case
 * study have a detail route, and pointing at a page that does not exist is the
 * failure this phase is explicitly told to avoid. `hasCaseStudy` upgrades the
 * link when the target really has one.
 */
import Link from 'next/link';
import { getProjectVisual } from '@/components/project-visuals';
import StatusBadge from '@/components/ui/StatusBadge';

export default function RelatedWork({ projects = [] }) {
  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mb-12 pt-8 border-t border-white/5">
      <h2
        id="related-heading"
        className="text-xl font-bold text-slate-50 tracking-tight mb-1"
      >
        Related work
      </h2>
      <p className="text-sm text-slate-500 mb-5">Other projects in the same engineering domains.</p>

      <ul className="list-none m-0 p-0 grid gap-3 sm:grid-cols-2">
        {projects.map((project) => {
          const accent = getProjectVisual(project.slug).accent;
          const href = project.hasCaseStudy ? `/work/${project.slug}` : `/work#${project.slug}`;
          return (
            <li key={project.slug}>
              <Link
                href={href}
                className="surface-card p-4 flex items-start gap-3 h-full hover:border-white/20 transition-colors"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                  style={{ background: accent }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-slate-100">
                      {project.shortTitle ?? project.title}
                    </span>
                    <StatusBadge status={project.status} />
                  </span>
                  <span className="block text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {project.summary}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
