'use client';

import Seo from '@/components/Seo';
import { getAllCredentials } from '@/lib/content';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


const credentials = getAllCredentials();

function CertCard({ title, description, credentialUrl, issuer, issuedAt, color, icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -6 }}
      className="surface-card group relative h-full flex flex-col overflow-hidden"
    >
      {/* Accent top bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl shrink-0" role="img" aria-hidden="true">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded font-code"
                style={{ color, background: `${color}15`, border: `1px solid ${color}25` }}
              >
                {issuer}
              </span>
            </div>
            <h2 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors leading-snug">
              {title}
            </h2>
            <p className="text-[11px] text-slate-500 font-code mt-1">{issuedAt}</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">{description}</p>

        <a
          href={credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 text-xs font-medium transition-colors duration-200 mt-auto pt-1 w-fit"
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
      <Seo
        title="Certifications — Amar Jaleel"
        description="Amar Jaleel's professional certifications in cybersecurity, data analytics, AI, and Python development."
      />
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 section-container space-y-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-label mb-2">{'// credentials'}</p>
            <h1 className="section-heading mb-3">Credentials</h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed">
              Supporting evidence, not the main story — the engineering work on the{' '}
              <Link href="/work" className="text-neon-cyan hover:underline">work page</Link>{' '}
              is what I would rather be judged on. Every credential below links to its issuer for
              verification.
            </p>
          </motion.div>


          {/* Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {credentials.map((cert, idx) => (
              <CertCard key={cert.id} {...cert} index={idx} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
