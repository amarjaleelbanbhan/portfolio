'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NeonButton from '@/components/NeonButton';

const certifications = [
  {
    name: 'Google Cybersecurity Professional',
    link: 'https://www.coursera.org/account/accomplishments/specialization/U2DN4IX0N6H7',
    description: 'Network security, Linux, Python, SQL, SIEM tools.',
  },
  {
    name: 'Google Data Analytics Professional',
    link: 'https://www.coursera.org/account/accomplishments/specialization/W0BZT6HTJXZE',
    description: 'Data cleaning, analysis, R, SQL, Tableau.',
  },
  {
    name: 'Google AI Essentials',
    link: 'https://coursera.org/share/cccb05b37cae8b86455d73751d5c101a',
    description: 'Generative AI fundamentals and responsible AI.',
  },
];

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-midnight">
      <Navbar />
      <main className="flex-1 section-container space-y-8">{children}</main>
      <Footer />
    </div>
  );
}

function CertificationCard({ name, description, link }) {
  const openVerify = () => window.open(link, '_blank', 'noreferrer');

  return (
    <div className="p-5 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-3">
      <div>
        <p className="text-lg font-semibold text-slate-100">{name}</p>
        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{description}</p>
      </div>
      <div>
        <NeonButton onClick={openVerify}>Verify</NeonButton>
      </div>
    </div>
  );
}

export default function Certifications() {
  return (
    <Layout>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Certifications</p>
        <h1 className="text-3xl font-bold text-slate-100">Validated learning</h1>
        <p className="text-slate-300 mt-2 max-w-2xl">
          Credentials that reflect a focus on security, analytics, and applied AI.
        </p>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {certifications.map((cert) => (
          <CertificationCard key={cert.name} {...cert} />
        ))}
      </div>
    </Layout>
  );
}
