import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { personalInfo } from '../data/portfolio';

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Skills' },
  { href: '/certifications', label: 'Certs' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { pathname } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-midnight/90 border-b border-white/5">
      <nav className="max-w-6xl mx-auto px-4 flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold tracking-tight text-neon-cyan">
          {personalInfo.name.split(' ')[0]}
          <span className="text-gray-400">.dev</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-neon-cyan transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-1 text-sm font-medium items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md transition-colors ${
                pathname === link.href
                  ? 'bg-accent/20 text-accent'
                  : 'hover:bg-white/5 text-slate-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={personalInfo.resumeFile}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-3 py-2 bg-neon-cyan text-midnight font-semibold rounded-md hover:bg-neon-green transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Resume
          </a>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-midnight/95 backdrop-blur">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-md transition-colors ${
                  pathname === link.href
                    ? 'bg-accent/20 text-accent'
                    : 'hover:bg-white/5 text-slate-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={personalInfo.resumeFile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-3 bg-neon-cyan text-midnight font-semibold rounded-md text-center mt-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
