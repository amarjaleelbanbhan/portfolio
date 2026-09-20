import Link from 'next/link';
import Seo from '@/components/Seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import EngineeringStory from '@/components/story/EngineeringStory';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ResumeButton from '@/components/ResumeButton';
import Achievements from '@/components/Achievements';
import Education from '@/components/Education';
import SpotlightGrid from '@/components/SpotlightGrid';
import ProjectCard from '@/components/ProjectCard';
import { getFeaturedProjects, getMergedContributionCount, getProfile } from '@/lib/content';

const AnimatedStats = dynamic(() => import('@/components/AnimatedStats'), { ssr: false });

// Ordered by explicit featuredRank, not by position in the array.
const featuredProjects = getFeaturedProjects(3);
const profile = getProfile();
// Derived, not written out: the bio used to say "six" and would have gone stale
// the moment a seventh pull request merged.
const mergedContributionCount = getMergedContributionCount();

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Seo
        title="Amar Jaleel | Software Engineer"
        description="Amar Jaleel — software engineer building product, AI, security, and systems software. Based in Pakistan, open to opportunities."
        path="/"
        type="profile"
      />
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* ─── The engineering story ─── */}
        <EngineeringStory />

        {/* The old name/tagline block that sat here was removed in Phase 5. It
            repeated what the Phase 4 hero already says — name, positioning and a
            "view my work" call to action — and it carried a second <h1>, which
            left the page with two top-level headings. Its ResumeButton moved
            into the bio section below, which is the only part it added. */}

        {/* ─── About / Bio ─── */}
        <section className="section-container">
          <motion.div {...fadeUp}>
            <div className="max-w-4xl mx-auto">
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-1 px-4">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-neon-green/70" />
                <span className="ml-3 font-code text-xs text-slate-600">~/amar/bio.md</span>
              </div>

              <div className="glass-panel box-glow border-t-0 rounded-tl-none rounded-tr-none">
                <p className="font-code text-xs text-neon-cyan mb-6 tracking-widest">&gt; cat bio.md</p>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left — story */}
                  <div className="space-y-4">
                    <p className="text-slate-200 leading-relaxed text-base">
                      I&apos;m a <span className="text-neon-cyan font-semibold">Computer Science student</span> at
                      Sukkur IBA University (class of &apos;27) who got tired of tutorial projects and started
                      shipping real ones.
                    </p>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      My work spans <span className="text-white font-medium">product engineering</span>,{' '}
                      <span className="text-white font-medium">security and developer tools</span>,{' '}
                      <span className="text-white font-medium">applied AI</span>, and{' '}
                      <span className="text-white font-medium">systems</span>. I&apos;ve shipped a field
                      reporting platform that is in production, published a security CLI to npm, and run a
                      controlled study on how RAG systems fail to retrieve good evidence.
                    </p>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      I also contribute upstream rather than only to my own repositories —{' '}
                      <Link
                        href="/open-source"
                        className="text-neon-green font-semibold hover:text-white underline decoration-dotted underline-offset-4"
                      >
                        {mergedContributionCount} merged pull requests
                      </Link>{' '}
                      into projects including Pydantic AI, Promptfoo and the Academy Software Foundation.
                    </p>
                    <p className="text-slate-500 text-sm font-code italic">
                      {'// When the code compiles on the first try, I assume something’s wrong.'}
                    </p>
                    <div className="pt-1">
                      <ResumeButton variant="large" />
                    </div>
                  </div>

                  {/* Right — quick facts */}
                  <div className="space-y-3">
                    {[
                      { icon: '🎓', label: 'Education',    value: 'B.Sc. CS — Sukkur IBA University (2023–2027)' },
                      { icon: '📍', label: 'Location',     value: 'Pakistan · Remote-friendly' },
                      { icon: '🔭', label: 'Currently',    value: 'Building AI tools & open-source projects' },
                      { icon: '⚡', label: 'Speciality',   value: 'AI × Security × Full-stack' },
                      { icon: '🤝', label: 'Status',       value: 'Open to internships & collaborations', green: true },
                      { icon: '📬', label: 'Contact',      value: profile.email, link: `mailto:${profile.email}` },
                    ].map(({ icon, label, value, green, link }) => (
                      <div key={label} className="flex items-start gap-3 group">
                        <span className="text-base mt-0.5">{icon}</span>
                        <div className="min-w-0">
                          <span className="font-code text-xs text-slate-600 uppercase tracking-wider">{label}</span>
                          {link ? (
                            <a
                              href={link}
                              className="flex items-center min-h-[44px] sm:min-h-0 text-sm text-slate-400 hover:text-neon-cyan transition-colors truncate"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className={`text-sm ${green ? 'text-neon-green' : 'text-slate-400'}`}>{value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── Skills Matrix ─── */}
        <SpotlightGrid />

        {/* ─── Stats ─── */}
        <AnimatedStats />

        {/* ─── Education ─── */}
        <Education />

        {/* ─── Achievements ─── */}
        <Achievements />

        {/* ─── Featured Projects ─── */}
        <section id="projects" className="section-container">
          <motion.div {...fadeUp} className="mb-10">
            <p className="section-label mb-2">{'// selected work'}</p>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="section-heading">
                FEATURED_PROJECTS
              </h2>
              <Link
                href="/work"
                className="inline-flex items-center min-h-[44px] sm:min-h-0 text-sm font-medium text-neon-cyan hover:text-white transition-colors font-code"
              >
                View all projects →
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="h-full"
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fadeUp}
            className="text-center mt-10"
          >
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-6 py-3 border border-neon-cyan/30 text-neon-cyan font-semibold rounded-lg hover:border-neon-cyan hover:bg-neon-cyan/8 transition-all duration-300 text-sm font-code"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-7 7m7-7l-7-7" />
              </svg>
              VIEW ALL PROJECTS
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
