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
              <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-6 flex items-center gap-2">
                <span className="text-xl">💻</span> Programming Languages
              </h2>
              {languageSkills.map((skill) => (
                <ProgressBar key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </div>

            {/* AI/ML Skills */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-4 flex items-center gap-2">
                <span className="text-xl">🤖</span> AI / Machine Learning
              </h2>
              <div className="flex flex-wrap">
                {aiMlSkills.map((skill) => (
                  <SkillChip key={skill} name={skill} />
                ))}
              </div>
            </div>

            {/* Data & Analytics Skills */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span> Data & Analytics
              </h2>
              <div className="flex flex-wrap">
                {dataAnalyticsSkills.map((skill) => (
                  <SkillChip key={skill} name={skill} />
                ))}
              </div>
            </div>

            {/* Cybersecurity Skills */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-4 flex items-center gap-2">
                <span className="text-xl">🔐</span> Cybersecurity
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
              <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-4 flex items-center gap-2">
                <span className="text-xl">🌐</span> Web & Cloud
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
              <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-4 flex items-center gap-2">
                <span className="text-xl">🚀</span> Currently Learning
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
