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
import { skills, projects, personalInfo } from '../data/portfolio';

// Dynamic imports for interactive components
const AnimatedStats = dynamic(() => import('../components/AnimatedStats'), { ssr: false });

// Get featured projects
const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Hero Header Section */}
        <section className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-glow">
              <GlitchText text={personalInfo.name.toUpperCase()} />
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 font-light tracking-wide mb-3">
              {personalInfo.title} | {personalInfo.tagline}
            </p>
            <p className="text-lg text-accent font-semibold mb-6">
              Building Tomorrow's Solutions Today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <NeonButton onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                INITIATE PROTOCOL
              </NeonButton>
              <ResumeButton variant="large" />
            </div>
          </motion.div>
        </section>

        {/* About Section (Terminal Window) */}
        <section className="section-container">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-panel box-glow"
          >
            <p className="text-cyan-400 font-code text-sm mb-4">&gt; USER_BIO</p>
            <div className="space-y-4">
              <p className="text-slate-200 leading-relaxed">
                Passionate tech enthusiast with a strong foundation in <span className="text-accent">Artificial Intelligence</span>,{' '}
                <span className="text-accent">Cybersecurity</span>, and <span className="text-accent">Data Analytics</span>. Currently pursuing a
                Computer Science degree.
              </p>
              <p className="text-slate-300 italic">
                💡 <span className="text-accent">Mission:</span> To leverage technology responsibly and create meaningful impact.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Skills Matrix */}
        <section className="section-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-slate-100 mb-8 text-glow"
          >
            TECH_STACK
          </motion.h2>
          <div className="glass-panel">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(skills.categories).map((category, idx) => (
                <motion.div
                  key={category[0]}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <p className="text-cyan-400 font-code text-sm mb-4 tracking-widest">&gt; {category[0].toUpperCase()}</p>
                  <div className="space-y-3 flex flex-col">
                    {category[1].map((skill) => (
                      <div
                        key={skill}
                        className="px-3 py-2 border border-accent text-accent text-sm font-code rounded transition-all duration-300 hover:bg-accent/10 hover:shadow-[0_0_10px_rgba(20,184,166,0.4)] cursor-default"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Animated Stats */}
        <AnimatedStats />

        {/* Education Section */}
        <Education />

        {/* Achievements Section */}
        <Achievements />

        {/* Featured Projects Preview */}
        <section id="projects" className="section-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-slate-100 mb-8 text-glow text-center"
          >
            FEATURED_PROJECTS
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-panel p-6 hover:border-neon-cyan/50 transition-all group"
              >
                <h3 className="text-xl font-bold text-neon-cyan mb-2 group-hover:text-neon-green transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-neon-cyan/10 text-neon-cyan rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <NeonButton onClick={() => window.location.href = '/projects'}>
              VIEW ALL PROJECTS
            </NeonButton>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

