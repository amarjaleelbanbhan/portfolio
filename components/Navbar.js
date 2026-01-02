import Link from 'next/link';
import { useRouter } from 'next/router';
import { personalInfo } from '../data/portfolio';

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Skills' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { pathname } = useRouter();

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-midnight/70 border-b border-white/5">
      <nav className="section-container flex items-center justify-between py-4">
        <div className="text-lg font-semibold tracking-tight text-neon-cyan">
          {personalInfo.name.split(' ')[0]}
          <span className="text-gray-400">.dev</span>
        </div>
        <div className="flex gap-2 md:gap-4 text-sm font-medium items-center flex-wrap">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2 md:px-3 py-2 rounded-md transition-colors ${
                pathname === link.href
                  ? 'bg-accent/20 text-accent'
                  : 'hover:bg-white/5 text-slate-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {/* Resume Download Button */}
          <a
            href={personalInfo.resumeFile}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-neon-cyan text-midnight font-semibold rounded-md hover:bg-neon-green transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden md:inline">Resume</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
