'use client';

import Head from 'next/head';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const certifications = [
  {
    name: 'Google Cybersecurity Professional',
    link: 'https://www.coursera.org/account/accomplishments/specialization/U2DN4IX0N6H7',
    description: 'Network security, Linux, Python scripting, SQL, and SIEM tools. 8-course specialization.',
    org: 'Google',
    color: '#ef4444',
    icon: '🔒',
  },
  {
    name: 'Google Data Analytics Professional',
    link: 'https://www.coursera.org/account/accomplishments/specialization/W0BZT6HTJXZE',
    description: 'Data cleaning, analysis, R programming, SQL, and Tableau visualization. 8-course specialization.',
    org: 'Google',
    color: '#f59e0b',
    icon: '📊',
  },
  {
    name: 'Google AI Essentials',
    link: 'https://coursera.org/share/cccb05b37cae8b86455d73751d5c101a',
    description: 'Generative AI fundamentals, responsible AI practices, and practical AI tool usage.',
    org: 'Google',
    color: '#8b5cf6',
    icon: '🤖',
  },
  {
    name: 'Python Bootcamp: Master Python',
    link: 'https://www.udemy.com/certificate/UC-ea3dcd47-fe5c-4073-b11b-15d417c0f56a/',
    description: 'Comprehensive Python programming with real-world projects — from basics to advanced applications.',
    org: 'Udemy',
    color: '#3b82f6',
    icon: '🐍',
  },
  {
    name: 'Discover the Art of Prompting',
    link: 'https://www.coursera.org/account/accomplishments/verify/TUEGAHF57ZTM',
    description: 'Prompt engineering techniques for generative AI models and practical AI productivity.',
    org: 'Google',
    color: '#10b981',
    icon: '💬',
  },
  {
    name: 'Introduction to AI',
    link: 'https://www.coursera.org/account/accomplishments/verify/2D6R17WJ0GV4',
    description: 'Foundational concepts in artificial intelligence, machine learning, and neural networks.',
    org: 'Google',
    color: '#14b8a6',
    icon: '🧠',
  },
];

function CertCard({ name, description, link, org, color, icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group relative rounded-xl border border-white/8 bg-white/3 overflow-hidden hover:border-white/15 transition-all duration-300"
    >
      {/* Accent top bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl shrink-0" role="img" aria-hidden="true">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded font-code"
                style={{ color, background: `${color}15`, border: `1px solid ${color}25` }}
              >
                {org}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors leading-snug">
              {name}
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">{description}</p>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200"
          style={{ color }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Verify Credential →
        </a>
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  return (
    <>
      <Head>
        <title>Certifications — Amar Jaleel</title>
        <meta name="description" content="Amar Jaleel's professional certifications in cybersecurity, data analytics, AI, and Python development." />
      </Head>
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-1 section-container space-y-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-label mb-2">// credentials</p>
            <h1 className="section-heading mb-3">Validated Learning</h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed">
              Professional certifications that reflect a focused commitment to security, analytics,
              and applied AI. Every credential backed by a verifiable link.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-6 py-5 border-y border-white/5"
          >
            {[
              { value: '11+', label: 'Certifications' },
              { value: '3',   label: 'Google Professional Certs' },
              { value: '2026', label: 'Latest Issued' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-xl font-bold text-neon-cyan font-code">{value}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, idx) => (
              <CertCard key={cert.name} {...cert} index={idx} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
