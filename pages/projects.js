import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { projects as projectsData } from '../data/portfolio';

// Dynamically import SecretProject to avoid SSR issues
const SecretProject = dynamic(() => import('@/components/SecretProject'), {
  ssr: false,
  loading: () => (
    <div className="glass-panel p-6 h-96 flex items-center justify-center">
      <p className="text-gray-400">Decrypting classified data...</p>
    </div>
  ),
});

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-midnight">
      <Navbar />
      <main className="flex-1 section-container space-y-8">{children}</main>
      <Footer />
    </div>
  );
}

export default function Projects() {
  return (
    <Layout>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Projects</p>
        <h1 className="text-3xl font-bold text-slate-100">Things I have built</h1>
        <p className="text-slate-300 mt-2 max-w-2xl">
          A snapshot of recent work spanning full-stack delivery, AI-assisted experiences, and robust backend services.
        </p>
      </div>
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        {projectsData.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
        {/* Secret Project - Wave Puzzle */}
        <SecretProject />
      </div>
    </Layout>
  );
}
