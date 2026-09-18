import dynamic from 'next/dynamic';
import Seo from '@/components/Seo';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillCube from '@/components/SkillCube';
import {
  getFeaturedSkills,
  getFeaturedSkillsGrouped,
  getSkillEvidenceLabels,
} from '@/lib/content';

const GravitySkills = dynamic(() => import('@/components/GravitySkills'), {
  ssr: false,
  loading: () => (
    <div className="glass-panel p-6 h-[500px] flex items-center justify-center">
      <p className="text-slate-400 font-code text-sm">Loading Physics Engine...</p>
    </div>
  ),
});



const CATEGORY_STYLE = {
  Frontend: {
    color: '#14b8a6',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  AI: {
    color: '#8b5cf6',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  Security: {
    color: '#ef4444',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  Backend: {
    color: '#22c55e',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
};

// Categories, membership and ordering all come from the content layer.
const categories = getFeaturedSkillsGrouped([
  'Frontend',
  'Backend',
  'AI',
  'Security',
  'Mobile',
  'Systems',
  'Infrastructure',
  'Developer Tools',
]).map(({ category, skills: items }) => ({
  title: category,
  skills: items.map((skill) => skill.name),
  color: CATEGORY_STYLE[category]?.color ?? '#14b8a6',
  icon: CATEGORY_STYLE[category]?.icon ?? null,
}));

const languageSkills = getFeaturedSkills()
  .filter((skill) => skill.category === 'Languages')
  .map((skill) => ({
    name: skill.name,
    color: skill.color,
    usedIn: getSkillEvidenceLabels(skill.slug),
  }));

const LEARNING_COLORS = ['#8b5cf6', '#ef4444', '#f59e0b', '#14b8a6'];

// Areas of current focus. Not modelled as skills because there is no evidence
// to attach yet — a skill in the canonical model must point at real work.
const currentlyLearning = [
  'Program analysis and verification',
  'RAG evaluation methodology',
  'Distributed and offline-first systems',
  'Operating systems and voice interaction (FYP)',
].map((label, i) => ({ label, color: LEARNING_COLORS[i % LEARNING_COLORS.length] }));

// Self-assessed percentages were removed in Phase 1 — they measured nothing.
// A language is listed with the work it was actually used for instead.
function LanguageEvidence({ name, color, usedIn, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mb-4 pl-3 border-l-2"
      style={{ borderColor: `${color}66` }}
    >
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-sm font-semibold" style={{ color }}>{name}</span>
        <span className="text-[11px] text-slate-600 font-code uppercase tracking-wider">used in</span>
      </div>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{usedIn.join(' · ')}</p>
    </motion.div>
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
      <Seo
        title="Skills — Amar Jaleel"
        description="Amar Jaleel's technical skills in AI, cybersecurity, data analytics, and full-stack development."
      />
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-1 section-container">

          {/* Header */}
          <motion.div {...fadeUp} className="mb-12">
            <p className="section-label mb-2">{'// capabilities'}</p>
            <h1 className="section-heading mb-3">
              <span className="text-neon-cyan font-code">&lt;</span>
              Skills
              <span className="text-neon-cyan font-code"> /&gt;</span>
            </h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed">
              The tools I actually build with, listed against the work they were used for.
              Proficiency percentages were removed — they were self-assigned and measured nothing.
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
                  Languages &amp; Where They&apos;re Used
                </h2>
                {languageSkills.map((skill, i) => (
                  <LanguageEvidence key={skill.name} {...skill} index={i} />
                ))}
              </motion.div>

              {/* Category chips */}
              {categories.slice(0, Math.ceil(categories.length / 2)).map((cat, idx) => (
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
              {categories.slice(Math.ceil(categories.length / 2)).map((cat, idx) => (
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
