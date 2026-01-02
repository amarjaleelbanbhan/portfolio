import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillCube from '@/components/SkillCube';

// Dynamically import GravitySkills to avoid SSR issues with matter-js
const GravitySkills = dynamic(() => import('@/components/GravitySkills'), {
  ssr: false,
  loading: () => (
    <div className="glass-panel p-6 h-[560px] flex items-center justify-center">
      <p className="text-gray-400">Loading Physics Engine...</p>
    </div>
  ),
});

// Local Layout wrapper
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-midnight">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

// Hardcoded skill data based on Data.md
const languageSkills = [
  { name: 'Python', level: 90 },
  { name: 'JavaScript', level: 85 },
  { name: 'C++', level: 80 },
  { name: 'Java', level: 78 },
  { name: 'SQL', level: 80 },
  { name: 'R', level: 75 },
  { name: 'HTML/CSS', level: 88 },
];

const aiMlSkills = ['TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy'];

const dataAnalyticsSkills = ['Tableau', 'Power BI', 'Excel', 'Google Analytics'];

const cybersecuritySkills = ['Linux', 'Wireshark', 'Kali Linux', 'OWASP'];

const webCloudSkills = ['Git', 'GitHub', 'Google Cloud', 'VS Code'];

// Progress Bar Component
function ProgressBar({ name, level }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-white font-medium">{name}</span>
        <span className="text-[var(--neon-cyan)]">{level}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-green)] shadow-[0_0_10px_var(--neon-cyan)]"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

// Skill Chip Component
function SkillChip({ name }) {
  return (
    <span className="inline-block px-3 py-1.5 m-1 text-sm font-medium text-white bg-white/10 border border-[var(--neon-cyan)]/30 rounded-full hover:bg-[var(--neon-cyan)]/20 hover:border-[var(--neon-cyan)] transition-all duration-300 hover:shadow-[0_0_10px_var(--neon-cyan)]">
      {name}
    </span>
  );
}

export default function Skills() {
  return (
    <Layout>
      <main className="flex-1 section-container py-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-[var(--neon-cyan)]">&lt;</span>
            Skills
            <span className="text-[var(--neon-cyan)]"> /&gt;</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and toolkit.
          </p>
        </div>

        {/* Main Grid - 1 col mobile, 2 cols desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Technical Skills */}
          <div className="space-y-6">
            {/* Languages with Progress Bars */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-6 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Programming Languages
              </h2>
              {languageSkills.map((skill) => (
                <ProgressBar key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </div>

            {/* AI/ML Skills */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                AI / Machine Learning
              </h2>
              <div className="flex flex-wrap">
                {aiMlSkills.map((skill) => (
                  <SkillChip key={skill} name={skill} />
                ))}
              </div>
            </div>

            {/* Data & Analytics Skills */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Data & Analytics
              </h2>
              <div className="flex flex-wrap">
                {dataAnalyticsSkills.map((skill) => (
                  <SkillChip key={skill} name={skill} />
                ))}
              </div>
            </div>

            {/* Cybersecurity Skills */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Cybersecurity
              </h2>
              <div className="flex flex-wrap">
                {cybersecuritySkills.map((skill) => (
                  <SkillChip key={skill} name={skill} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Visuals */}
          <div className="space-y-6">
            {/* Web & Cloud Skills */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Web & Cloud
              </h2>
              <div className="flex flex-wrap">
                {webCloudSkills.map((skill) => (
                  <SkillChip key={skill} name={skill} />
                ))}
              </div>
            </div>

            {/* Interactive Physics Skills */}
            <GravitySkills />

            {/* Currently Learning */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Currently Learning
              </h2>
              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[var(--neon-cyan)] rounded-full shadow-[0_0_8px_var(--neon-cyan)]"></span>
                  Advanced ML Algorithms & Deep Learning
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[var(--neon-green)] rounded-full shadow-[0_0_8px_var(--neon-green)]"></span>
                  Cloud Security (AWS/Azure/GCP)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[var(--neon-magenta)] rounded-full shadow-[0_0_8px_var(--neon-magenta)]"></span>
                  Big Data Analytics & Visualization
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[var(--neon-cyan)] rounded-full shadow-[0_0_8px_var(--neon-cyan)]"></span>
                  Advanced Cybersecurity Concepts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
