import dynamic from 'next/dynamic';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { motion } from 'framer-motion';
import { projects as projectsData } from '@/data/portfolio';

const SecretProject = dynamic(() => import('@/components/SecretProject'), {
  ssr: false,
  loading: () => (
    <div className="glass-panel p-6 h-64 flex items-center justify-center">
      <p className="text-slate-400 font-code text-sm">Decrypting classified data...</p>
    </div>
  ),
});

export default function Projects() {
  return (
    <>
      <Head>
        <title>Projects — Amar Jaleel</title>
        <meta name="description" content="Amar Jaleel's portfolio of projects spanning AI, cybersecurity, full-stack development, and data analytics." />
      </Head>
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-1 section-container space-y-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <p className="section-label mb-2">// portfolio</p>
            <h1 className="section-heading mb-3">Things I've Built</h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed">
              A snapshot of recent work spanning full-stack delivery, AI-assisted experiences,
              and robust backend services. Each project reflects a real problem solved.
            </p>
          </motion.div>

          {/* Project grid */}
          <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
            {projectsData.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}

            {/* Easter egg */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: projectsData.length * 0.08 }}
            >
              <SecretProject />
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-6 py-8 border-t border-white/5"
          >
            {[
              { label: 'Projects Completed', value: '10+' },
              { label: 'GitHub Commits', value: '500+' },
              { label: 'Open Source', value: 'Yes' },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold text-neon-cyan font-code">{value}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
}
