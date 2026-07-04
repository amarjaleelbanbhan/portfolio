import Link from 'next/link';
import { personalInfo } from '../data/portfolio';

const navLinks = [
  { href: '/',               label: 'Home'     },
  { href: '/projects',       label: 'Projects' },
  { href: '/skills',         label: 'Skills'   },
  { href: '/certifications', label: 'Certs'    },
  { href: '/contact',        label: 'Contact'  },
];

const socialLinks = [
  { label: 'GitHub',    href: personalInfo.social.github },
  { label: 'LinkedIn',  href: personalInfo.social.linkedin },
  { label: 'Twitter',   href: personalInfo.social.twitter },
  { label: 'Email',     href: `mailto:${personalInfo.email}` },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-midnight/60 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <p className="text-base font-bold text-neon-cyan font-code mb-2">
              {personalInfo.name.split(' ')[0]}
              <span className="text-slate-600">.dev</span>
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              AI Product Engineer & Full-Stack Developer based in Pakistan.
              Building intelligent, meaningful software.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3 font-code">Navigate</p>
            <ul className="space-y-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-neon-cyan transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3 font-code">Connect</p>
            <ul className="space-y-2">
              {socialLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('mailto') ? '_self' : '_blank'}
                    rel="noreferrer"
                    className="text-sm text-slate-400 hover:text-neon-cyan transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5">
          <p className="text-xs text-slate-600 font-code">
            © {new Date().getFullYear()} {personalInfo.name}. Crafted with Next.js & Framer Motion.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-code">
            <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
