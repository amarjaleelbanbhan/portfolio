import dynamic from 'next/dynamic';
import Seo from '@/components/Seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { motion } from 'framer-motion';
import {
  getArchivedProjects,
  getContributionsForDisplay,
  getCurrentFypProjects,
  getFlagshipProjects,
  getSecondaryProjects,
} from '@/lib/content';

const SecretProject = dynamic(() => import('@/components/SecretProject'), {
  ssr: false,
  loading: () => (
    <div className="glass-panel p-6 h-64 flex items-center justify-center">
      <p className="text-slate-400 font-code text-sm">Decrypting classified data...</p>
    </div>
  ),
});

// Grouping and ordering come from the content layer; this page only decides
// how each group is introduced.
const GROUPS = [
  {
    key: 'flagship',
    heading: 'Primary Engineering Work',
    blurb: 'The systems I would want to be judged on.',
    projects: getFlagshipProjects(),
  },
  {
    key: 'secondary',
    heading: 'Secondary Work',
    blurb: 'Smaller tools and experiments that still stand on their own.',
    projects: getSecondaryProjects(),
  },
  {
    key: 'current-fyp',
    heading: 'Final Year Project',
    blurb: 'Current university research, represented at the stage it has actually reached.',
    projects: getCurrentFypProjects(),
  },
  {
    key: 'archive',
    heading: 'Archive',
    blurb: 'Earlier work, kept for the record rather than as current evidence.',
    projects: getArchivedProjects(),
  },
];

const contributions = getContributionsForDisplay();

export default function Projects() {
  return (
    <>
      <Seo
        title="Projects — Amar Jaleel"
        description="Amar Jaleel's portfolio of projects spanning AI, cybersecurity, full-stack development, and data analytics."
      />
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-1 section-container space-y-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <p className="section-label mb-2">{'// portfolio'}</p>
            <h1 className="section-heading mb-3">Things I&apos;ve Built</h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed">
              Product engineering, security and developer tooling, applied AI research, and systems
              work. Each project carries the status it has actually reached — not the one it is
              aiming for. Several are private client or research repositories and are marked as such.
            </p>
          </motion.div>

          {/* Project groups */}
          {GROUPS.map(({ key, heading, blurb, projects: group }) => {
            if (group.length === 0) return null;

            return (
              <section key={key} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold text-slate-100">{heading}</h2>
                  <p className="text-sm text-slate-500 mt-1">{blurb}</p>
                </motion.div>

                <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 items-stretch">
                  {group.map((project, idx) => (
                    <motion.div
                      key={project.slug}
                      // Anchor target: the homepage Engineering Core deep-links
                      // each domain at its strongest project. scroll-mt clears
                      // the fixed navbar so the card is not hidden under it.
                      id={project.slug}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="h-full scroll-mt-24"
                    >
                      <ProjectCard {...project} />
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Easter egg */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:max-w-xl"
          >
            <SecretProject />
          </motion.div>

          {/* Upstream contributions — the dedicated page lands in a later phase. */}
          <motion.section
            id="open-source"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="pt-8 border-t border-white/5 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-slate-100">Open Source Contributions</h2>
            <p className="text-sm text-slate-500 mt-1 mb-5">
              Fixes sent upstream, not only to my own repositories.
            </p>

            <ul className="space-y-2">
              {contributions.map((pr) => (
                <li key={pr.id}>
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noreferrer"
                    className="surface-card flex flex-wrap items-center gap-x-3 gap-y-1 p-3.5 group"
                  >
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded font-code shrink-0"
                      style={
                        pr.status === 'merged'
                          ? { color: '#a855f7', background: '#a855f714', border: '1px solid #a855f733' }
                          : { color: '#22c55e', background: '#22c55e14', border: '1px solid #22c55e33' }
                      }
                    >
                      {pr.status === 'merged' ? 'Merged' : 'Open'}
                    </span>
                    <span className="font-code text-xs text-neon-cyan shrink-0">
                      {pr.repository}#{pr.prNumber}
                    </span>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors min-w-0">
                      {pr.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.section>
        </main>
        <Footer />
      </div>
    </>
  );
}
