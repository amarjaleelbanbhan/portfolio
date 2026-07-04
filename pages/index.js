import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import GlitchText from '@/components/GlitchText';
import NeonButton from '@/components/NeonButton';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ResumeButton from '@/components/ResumeButton';
import Achievements from '@/components/Achievements';
import Education from '@/components/Education';
import SpotlightGrid from '@/components/SpotlightGrid';
import ProjectCard from '@/components/ProjectCard';
import { projects, personalInfo } from '@/data/portfolio';

const AnimatedStats = dynamic(() => import('@/components/AnimatedStats'), { ssr: false });

const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* ─── Header / Name Section ─── */}
        <section className="section-container text-center">
          <motion.div {...fadeUp}>
            <p className="section-label mb-3">// about me</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-glow tracking-tight">
              <GlitchText text={personalInfo.name.toUpperCase()} />
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 font-light tracking-wide mb-2">
              {personalInfo.tagline}
            </p>
            <p className="text-base text-neon-cyan font-semibold mb-8 font-code">
              Building Tomorrow's Solutions Today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/projects"
                className="px-6 py-3 bg-neon-cyan text-midnight font-semibold rounded-lg shadow-lg shadow-neon-cyan/25 hover:bg-neon-green transition-all duration-300 text-sm w-full sm:w-auto text-center"
              >
                VIEW MY WORK
              </Link>
              <ResumeButton variant="large" />
            </div>
          </motion.div>
        </section>

        {/* ─── About / Bio ─── */}
        <section className="section-container">
          <motion.div {...fadeUp}>
            <div className="glass-panel box-glow max-w-2xl mx-auto">
              <p className="font-code text-xs text-neon-cyan mb-4 tracking-widest uppercase">&gt; user_bio.txt</p>
              <div className="space-y-4">
                <p className="text-slate-200 leading-relaxed">
                  Passionate tech enthusiast with a strong foundation in{' '}
                  <span className="text-neon-cyan font-medium">Artificial Intelligence</span>,{' '}
                  <span className="text-neon-cyan font-medium">Cybersecurity</span>, and{' '}
                  <span className="text-neon-cyan font-medium">Data Analytics</span>. Currently pursuing a
                  Computer Science degree at Sukkur IBA University.
                </p>
                <p className="text-slate-400 italic text-sm leading-relaxed">
                  <span className="text-neon-cyan not-italic font-semibold">Mission:</span>{' '}
                  To leverage technology responsibly and create meaningful impact through intelligent systems.
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-xs font-code text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full" />
                    {personalInfo.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
                    Available for opportunities
                  </span>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="flex items-center gap-1.5 hover:text-neon-cyan transition-colors"
                  >
                    <span className="w-1.5 h-1.5 bg-neon-magenta rounded-full" />
                    {personalInfo.email}
                  </a>
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
            <p className="section-label mb-2">// selected work</p>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="section-heading">
                FEATURED_PROJECTS
              </h2>
              <Link
                href="/projects"
                className="text-sm font-medium text-neon-cyan hover:text-white transition-colors font-code"
              >
                View all projects →
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
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
              href="/projects"
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
