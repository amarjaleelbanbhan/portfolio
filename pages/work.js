/**
 * /work — the engineering portfolio.
 *
 * The homepage answers "what kind of engineering does Amar do, and how does he
 * approach problems". This page answers "what has he actually built, what is
 * its status, and where is the evidence". It deliberately does not repeat the
 * five-stage homepage narrative; it links back to it instead.
 *
 * Grouping and ordering come entirely from the canonical selectors — flagship,
 * secondary, current FYP and archive — so there is no second project list here.
 *
 * Filtering never removes a project from the DOM in a way that could strip an
 * anchor target: a filtered-out project is unmounted from its group, but every
 * group is still rendered and the full set is restored by the "All" filter,
 * which is the default on load. Deep links therefore always resolve, because
 * the page always loads unfiltered.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import FeaturedProjectCard from '@/components/work/FeaturedProjectCard';
import ProjectFilters from '@/components/work/ProjectFilters';
import {
  DOMAINS,
  getAllProjects,
  getArchivedProjects,
  getContributionsForDisplay,
  getCurrentFypProjects,
  getDomainColor,
  getCaseStudyProjects,
  getFlagshipProjects,
  getSecondaryProjects,
  getSkillBySlug,
} from '@/lib/content';
import { fadeUp } from '@/lib/motion';

const flagship = getFlagshipProjects();
const secondary = getSecondaryProjects();
const currentFyp = getCurrentFypProjects();
const archived = getArchivedProjects();
const allProjects = getAllProjects();
const caseStudySlugs = new Set(getCaseStudyProjects().map((p) => p.slug));
const contributions = getContributionsForDisplay();
const mergedCount = contributions.filter((c) => c.status === 'merged').length;
const openCount = contributions.filter((c) => c.status === 'open').length;

const DOMAIN_LABELS = {
  product: 'Product',
  ai: 'Applied AI',
  security: 'Security',
  systems: 'Systems',
  research: 'Research',
  'open-source': 'Open Source',
};

/**
 * Filter options, derived from the domains projects actually carry.
 *
 * A domain nobody has worked in would otherwise render as a button that always
 * returns nothing.
 */
const filterDomains = [
  { key: 'all', label: 'All', color: '#14b8a6', count: allProjects.length },
  ...DOMAINS.map((domain) => ({
    key: domain,
    label: DOMAIN_LABELS[domain] ?? domain,
    color: getDomainColor(domain),
    count: allProjects.filter((p) => p.domains?.includes(domain)).length,
  })).filter((d) => d.count > 0),
];

/** Technology labels for a project, resolved through the skill registry. */
function technologiesFor(project) {
  return (project.technologies ?? [])
    .map((slug) => ({ slug, skill: getSkillBySlug(slug) }))
    .filter((entry) => Boolean(entry.skill))
    .slice(0, 6)
    .map((entry) => ({ key: entry.slug, label: entry.skill.shortName ?? entry.skill.name }));
}

/** Text a search query is matched against. Technologies resolve to real names. */
function searchCorpus(project) {
  return [
    project.title,
    project.shortTitle,
    project.summary,
    project.note,
    ...(project.tags ?? []),
    ...technologiesFor(project).map((t) => t.label),
    ...(project.domains ?? []).map((d) => DOMAIN_LABELS[d] ?? d),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function matches(project, domain, query) {
  if (domain !== 'all' && !project.domains?.includes(domain)) return false;
  if (!query.trim()) return true;
  return searchCorpus(project).includes(query.trim().toLowerCase());
}

/** A group heading plus its blurb. Hidden entirely when a filter empties it. */
function GroupHeading({ id, title, blurb, count }) {
  return (
    <motion.div {...fadeUp()} className="mb-5">
      <div className="flex items-baseline gap-3 flex-wrap">
        <h2 id={id} className="text-xl sm:text-2xl font-bold text-slate-50 tracking-tight">
          {title}
        </h2>
        <span className="font-code text-xs text-slate-600">{count}</span>
      </div>
      <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">{blurb}</p>
    </motion.div>
  );
}

/** Slugs that live inside the collapsed archive panel. */
const archivedSlugs = new Set(archived.map((p) => p.slug));

export default function Work() {
  const [domain, setDomain] = useState('all');
  const [query, setQuery] = useState('');
  const [showArchive, setShowArchive] = useState(false);

  // Deep links into archived work have to resolve. The archive is collapsed by
  // default, so `/work#meditalk` — which the Skill Galaxy's evidence panel
  // generates for any project without a case study — used to scroll nowhere.
  // Expanding on a matching hash keeps the anchor honest without putting the
  // earlier work back in front of the reader by default.
  useEffect(() => {
    const openArchiveForHash = () => {
      const slug = window.location.hash.slice(1);
      if (!slug || !archivedSlugs.has(slug)) return;
      setShowArchive(true);
      // The element does not exist until the panel has rendered.
      requestAnimationFrame(() => {
        document.getElementById(slug)?.scrollIntoView({ block: 'start' });
      });
    };
    openArchiveForHash();
    window.addEventListener('hashchange', openArchiveForHash);
    return () => window.removeEventListener('hashchange', openArchiveForHash);
  }, []);

  const filtered = useMemo(() => {
    const keep = (list) => list.filter((p) => matches(p, domain, query));
    return {
      flagship: keep(flagship),
      secondary: keep(secondary),
      currentFyp: keep(currentFyp),
      archived: keep(archived),
    };
  }, [domain, query]);

  const resultCount =
    filtered.flagship.length +
    filtered.secondary.length +
    filtered.currentFyp.length +
    filtered.archived.length;

  const isFiltering = domain !== 'all' || query.trim().length > 0;

  return (
    <>
      <Seo
        title="Engineering Work — Amar Jaleel"
        description="Production applications, developer and security tools, applied AI research systems, and experimental systems engineering — with the status and evidence behind each project."
        path="/work"
      />
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 section-container">
          {/* ── Introduction ── */}
          <motion.div {...fadeUp()} className="mb-8">
            <p className="section-label">{'// engineering work'}</p>
            <h1 className="section-heading max-w-3xl text-balance">Engineering Work</h1>
            <p className="mt-3 text-slate-400 leading-relaxed max-w-2xl">
              Production applications, developer and security tools, applied AI research systems,
              and experimental systems engineering. Each project carries the status it has actually
              reached and the evidence that supports it.
            </p>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-2xl">
              Want the cinematic overview of how I approach these problems instead?{' '}
              <Link
                href="/#engineering-story"
                className="text-neon-cyan hover:text-white underline decoration-dotted underline-offset-4"
              >
                Read the engineering story
              </Link>
              .
            </p>
          </motion.div>

          {/* ── Filters ── */}
          <motion.div {...fadeUp({ delay: 0.05 })} className="mb-10">
            <ProjectFilters
              domains={filterDomains}
              active={domain}
              onChange={setDomain}
              query={query}
              onQueryChange={setQuery}
              resultCount={resultCount}
              totalCount={allProjects.length}
            />
          </motion.div>

          {resultCount === 0 && (
            <div className="surface-card p-8 text-center">
              <p className="text-slate-300 font-medium mb-1">No projects match that.</p>
              <p className="text-sm text-slate-500 mb-4">
                Try a different domain, or clear the search to see all{' '}
                {allProjects.length} projects.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDomain('all');
                  setQuery('');
                }}
                className="font-code text-xs font-semibold px-4 py-2.5 min-h-[44px] rounded-lg border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* ── Featured ── */}
          {filtered.flagship.length > 0 && (
            <section aria-labelledby="featured-heading" className="mb-14">
              <GroupHeading
                id="featured-heading"
                title="Featured Engineering Work"
                blurb="The systems I would want to be judged on."
                count={filtered.flagship.length}
              />
              <div className="space-y-5">
                {filtered.flagship.map((project, i) => (
                  <FeaturedProjectCard
                    key={project.slug}
                    project={project}
                    index={i}
                    technologies={technologiesFor(project)}
                    hasCaseStudy={caseStudySlugs.has(project.slug)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── Secondary ── */}
          {filtered.secondary.length > 0 && (
            <section aria-labelledby="secondary-heading" className="mb-14">
              <GroupHeading
                id="secondary-heading"
                title="Systems & Additional Projects"
                blurb="Smaller tools and experiments that still stand on their own."
                count={filtered.secondary.length}
              />
              <div className="grid gap-5 md:grid-cols-2">
                {filtered.secondary.map((project) => (
                  <div key={project.slug} id={project.slug} className="h-full scroll-mt-24">
                    <ProjectCard {...project} hasCaseStudy={caseStudySlugs.has(project.slug)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Current FYP ── */}
          {filtered.currentFyp.length > 0 && (
            <section aria-labelledby="fyp-heading" className="mb-14">
              <GroupHeading
                id="fyp-heading"
                title="Current Final Year Project"
                blurb="University research, represented at the stage it has actually reached."
                count={filtered.currentFyp.length}
              />
              <div className="grid gap-5 md:grid-cols-2">
                {filtered.currentFyp.map((project) => (
                  <div key={project.slug} id={project.slug} className="h-full scroll-mt-24">
                    <ProjectCard {...project} hasCaseStudy={caseStudySlugs.has(project.slug)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Earlier work ──
              Quieter and collapsed by default: this is kept for the record, not
              offered as current evidence. It expands when a filter matches it,
              so a filtered project is never hidden behind a closed panel. */}
          {filtered.archived.length > 0 && (
            <section aria-labelledby="archive-heading" className="mb-14">
              <GroupHeading
                id="archive-heading"
                title="Earlier Work"
                blurb="Older projects, kept for the record rather than as current evidence."
                count={filtered.archived.length}
              />
              {!showArchive && !isFiltering ? (
                <button
                  type="button"
                  onClick={() => setShowArchive(true)}
                  aria-expanded={false}
                  className="w-full surface-card p-4 text-left font-code text-xs text-slate-400 hover:text-slate-200 transition-colors min-h-[44px]"
                >
                  Show {filtered.archived.length} earlier projects →
                </button>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 opacity-90">
                  {filtered.archived.map((project) => (
                    <div key={project.slug} id={project.slug} className="h-full scroll-mt-24">
                      <ProjectCard {...project} hasCaseStudy={caseStudySlugs.has(project.slug)} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Upstream contributions ──
              Phase 14 gave this its own page, so what stays here is a pointer
              rather than a second copy of the list. The `open-source` id is
              kept deliberately: /work#open-source is linked from documentation
              and was a Core destination, and an anchor that silently stops
              resolving is worse than a short section. */}
          <section
            id="open-source"
            aria-labelledby="open-source-heading"
            className="pt-8 border-t border-white/5 scroll-mt-24"
          >
            <GroupHeading
              id="open-source-heading"
              title="Upstream Contributions"
              blurb="Pull requests into codebases maintained by other people, shown with their current status."
              count={contributions.length}
            />
            <div className="surface-card p-5 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl m-0">
                {mergedCount} merged into repositories maintained by other people
                {openCount > 0 && `, ${openCount} still open`}. Each one is shown with the problem
                it addressed, the change made, its test evidence and its current status.
              </p>
              <Link
                href="/open-source"
                className="font-code text-xs font-semibold px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-lg border border-neon-green/40 text-neon-green hover:bg-neon-green/10 transition-colors"
              >
                View all contributions →
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
