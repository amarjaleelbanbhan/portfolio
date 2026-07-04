import dynamic from 'next/dynamic';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillCube from '@/components/SkillCube';

const GravitySkills = dynamic(() => import('@/components/GravitySkills'), {
  ssr: false,
  loading: () => (
    <div className="glass-panel p-6 h-[500px] flex items-center justify-center">
      <p className="text-slate-400 font-code text-sm">Loading Physics Engine...</p>
    </div>
  ),
});

const languageSkills = [
  { name: 'Python',      level: 90, color: '#3b82f6' },
  { name: 'JavaScript',  level: 85, color: '#f59e0b' },
  { name: 'HTML / CSS',  level: 88, color: '#f97316' },
  { name: 'C++',         level: 80, color: '#8b5cf6' },
  { name: 'SQL',         level: 80, color: '#06b6d4' },
  { name: 'Java',        level: 78, color: '#ef4444' },
  { name: 'R',           level: 75, color: '#10b981' },
];

const categories = [
  {
    title: 'AI / Machine Learning',
    color: '#8b5cf6',
    skills: ['TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Data & Analytics',
    color: '#f59e0b',
    skills: ['Tableau', 'Power BI', 'Excel', 'Google Analytics', 'BigQuery'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Cybersecurity',
    color: '#ef4444',
    skills: ['Linux', 'Wireshark', 'Kali Linux', 'OWASP', 'SIEM Tools', 'Nmap'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Web & Cloud',
    color: '#14b8a6',
    skills: ['React', 'Next.js', 'Node.js', 'Git', 'GitHub', 'Google Cloud', 'Docker'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
];

const currentlyLearning = [
  { label: 'Advanced ML & Deep Learning',     color: '#8b5cf6' },
  { label: 'Cloud Security (AWS / Azure)',     color: '#ef4444' },
  { label: 'Big Data Analytics & Spark',       color: '#f59e0b' },
  { label: 'Advanced Cybersecurity & CTFs',   color: '#14b8a6' },
];

function ProgressBar({ name, level, color }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-200">{name}</span>
        <span className="text-xs font-code" style={{ color }}>{level}%</span>
      </div>
      <div className="w-full bg-white/6 rounded-full h-1.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}aa, ${color})` }}
        />
      </div>
    </div>
  );
}

function SkillChip({ name, color }) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center px-3 py-1.5 m-1 text-xs font-medium rounded-lg border transition-all duration-200 cursor-default"
      style={{
        color,
        background: `${color}12`,
        borderColor: `${color}30`,
      }}
    >
      {name}
    </motion.span>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
};

export default function Skills() {
  return (
    <>
      <Head>
        <title>Skills — Amar Jaleel</title>
        <meta name="description" content="Amar Jaleel's technical skills in AI, cybersecurity, data analytics, and full-stack development." />
      </Head>
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-1 section-container">

          {/* Header */}
          <motion.div {...fadeUp} className="mb-12">
            <p className="section-label mb-2">// capabilities</p>
            <h1 className="section-heading mb-3">
              <span className="text-neon-cyan font-code">&lt;</span>
              Skills
              <span className="text-neon-cyan font-code"> /&gt;</span>
            </h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed">
              A comprehensive overview of my technical toolkit — from languages and frameworks
              to specialized domains in AI, security, and data.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ─── Left Column ─── */}
            <div className="space-y-6">

              {/* Languages */}
              <motion.div {...fadeUp} className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Programming Languages
                </h2>
                {languageSkills.map((skill) => (
                  <ProgressBar key={skill.name} {...skill} />
                ))}
              </motion.div>

              {/* Category chips */}
              {categories.slice(0, 2).map((cat, idx) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-6"
                >
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2.5" style={{ color: cat.color }}>
                    {cat.icon}
                    <span className="text-white">{cat.title}</span>
                  </h2>
                  <div className="flex flex-wrap -m-1">
                    {cat.skills.map((s) => <SkillChip key={s} name={s} color={cat.color} />)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ─── Right Column ─── */}
            <div className="space-y-6">

              {/* 3D Cube */}
              <motion.div {...fadeUp}>
                <SkillCube />
              </motion.div>

              {/* Category chips cont. */}
              {categories.slice(2).map((cat, idx) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-6"
                >
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2.5">
                    <span style={{ color: cat.color }}>{cat.icon}</span>
                    {cat.title}
                  </h2>
                  <div className="flex flex-wrap -m-1">
                    {cat.skills.map((s) => <SkillChip key={s} name={s} color={cat.color} />)}
                  </div>
                </motion.div>
              ))}

              {/* Currently learning */}
              <motion.div {...fadeUp} className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Currently Learning
                </h2>
                <ul className="space-y-3">
                  {currentlyLearning.map(({ label, color }) => (
                    <li key={label} className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                      {label}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* ─── Interactive Physics Skills ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-10"
          >
            <GravitySkills />
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
}
