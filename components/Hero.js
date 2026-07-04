'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GlitchText from './GlitchText';
import { personalInfo } from '../data/portfolio';

const roles = [
  'AI Product Engineer',
  'Cybersecurity Enthusiast',
  'Full-Stack Developer',
  'Data Analytics Engineer',
  'Open Source Builder',
];

const floatingChips = [
  { label: 'Python',         color: '#3b82f6', delay: 0    },
  { label: 'Next.js',        color: '#14b8a6', delay: 0.4  },
  { label: 'TensorFlow',     color: '#f97316', delay: 0.8  },
  { label: 'TypeScript',     color: '#6366f1', delay: 1.2  },
  { label: 'Cybersecurity',  color: '#d946ef', delay: 1.6  },
  { label: 'React',          color: '#22c55e', delay: 2.0  },
  { label: 'Machine Learning', color: '#f59e0b', delay: 2.4 },
  { label: 'Node.js',        color: '#14b8a6', delay: 2.8  },
];

function useTypingEffect(strings, typingSpeed = 90, deletingSpeed = 50, pauseMs = 2200) {
  const [displayText, setDisplayText] = useState('');
  const [roleIndex, setRoleIndex]     = useState(0);
  const [isDeleting, setIsDeleting]   = useState(false);

  useEffect(() => {
    const current = strings[roleIndex];
    let timer;
    if (!isDeleting) {
      if (displayText.length < current.length) {
        timer = setTimeout(() => setDisplayText(current.slice(0, displayText.length + 1)), typingSpeed);
      } else {
        timer = setTimeout(() => setIsDeleting(true), pauseMs);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => setDisplayText(current.slice(0, displayText.length - 1)), deletingSpeed);
      } else {
        setIsDeleting(false);
        setRoleIndex((i) => (i + 1) % strings.length);
      }
    }
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, strings, typingSpeed, deletingSpeed, pauseMs]);

  return displayText;
}

const socialLinks = [
  {
    label: 'GitHub',
    href: personalInfo.social.github,
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: personalInfo.social.linkedin,
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: personalInfo.social.twitter,
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

export default function Hero() {
  const typedRole = useTypingEffect(roles);

  return (
    <div className="relative min-h-[92vh] flex items-center overflow-hidden">

      {/* Deep gradient overlays for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-neon-cyan/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] bg-neon-magenta/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-neon-green/4 rounded-full blur-[100px]" />
      </div>

      {/* Floating tech chips */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingChips.map((chip, i) => (
          <motion.div
            key={chip.label}
            initial={{ opacity: 0, y: 60 }}
            animate={{
              opacity: [0, 0.7, 0.7, 0],
              y: [60, -20],
            }}
            transition={{
              duration: 8 + i * 0.6,
              delay: chip.delay + 1.5,
              repeat: Infinity,
              repeatDelay: 4 + i * 0.8,
              ease: 'easeInOut',
            }}
            style={{
              left: `${8 + ((i * 37 + 13) % 84)}%`,
              top: `${20 + ((i * 23 + 7) % 60)}%`,
              borderColor: chip.color + '40',
              color: chip.color,
              boxShadow: `0 0 12px ${chip.color}20`,
            }}
            className="absolute text-xs font-code px-2.5 py-1 rounded-full border bg-midnight/80 backdrop-blur-sm select-none"
          >
            {chip.label}
          </motion.div>
        ))}
      </div>

      <div className="section-container relative w-full" style={{ zIndex: 1 }}>
        <div className="grid gap-12 lg:grid-cols-2 items-center">

          {/* ─── Left: Text Content ─── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="order-2 lg:order-1 flex flex-col"
          >
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-code text-xs font-semibold uppercase tracking-[0.3em] text-neon-cyan mb-4 flex items-center gap-2"
            >
              <span className="w-6 h-px bg-neon-cyan/60" />
              Hello, World — I&apos;m
              <span className="w-6 h-px bg-neon-cyan/60" />
            </motion.p>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-none tracking-tight mb-5"
            >
              <GlitchText text="AMAR JALEEL" />
            </motion.h1>

            {/* Typing role */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="flex items-center gap-1 text-lg md:text-xl text-slate-300 mb-6 font-code min-h-[1.75rem]"
            >
              <span className="text-neon-cyan select-none">&gt;&nbsp;</span>
              <span className="text-white">{typedRole}</span>
              <span
                className="inline-block w-0.5 h-5 bg-neon-cyan ml-0.5 cursor-blink"
                aria-hidden="true"
              />
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mb-8 space-y-3"
            >
              <p className="text-base text-slate-300 max-w-xl leading-relaxed">
                CS student at{' '}
                <span className="text-neon-cyan font-medium">Sukkur IBA University</span>{' '}
                who ships real tools — a security CLI on npm, a VS Code extension, a 3D browser app,
                and a medical voice agent. I build at the crossroads of{' '}
                <span className="text-slate-200 font-medium">AI</span>,{' '}
                <span className="text-slate-200 font-medium">cybersecurity</span>, and{' '}
                <span className="text-slate-200 font-medium">full-stack engineering</span>.
              </p>
              <p className="text-sm text-slate-500 max-w-lg leading-relaxed font-code">
                <span className="text-neon-green">11</span> Google certs ·{' '}
                <span className="text-neon-cyan">9</span> shipped projects ·{' '}
                <span className="text-neon-magenta">500+</span> commits
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="flex flex-wrap gap-3 mb-9"
            >
              <Link
                href="/projects"
                className="group px-7 py-3.5 bg-neon-cyan text-midnight font-bold rounded-lg shadow-lg shadow-neon-cyan/30 hover:bg-neon-green hover:shadow-neon-green/30 transition-all duration-300 text-sm flex items-center gap-2"
              >
                View My Work
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3.5 border border-neon-cyan/40 text-neon-cyan font-semibold rounded-lg hover:border-neon-cyan hover:bg-neon-cyan/8 hover:shadow-lg hover:shadow-neon-cyan/10 transition-all duration-300 text-sm"
              >
                Get in Touch
              </Link>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center gap-1"
            >
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 text-slate-500 hover:text-neon-cyan transition-all duration-200 rounded-lg hover:bg-white/5 hover:scale-110"
                >
                  {icon}
                </a>
              ))}
              <span className="ml-3 text-xs text-slate-600 font-code">// find me online</span>
            </motion.div>
          </motion.div>

          {/* ─── Right: Portrait + Orbiting elements ─── */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">

              {/* Outer ambient glow */}
              <div className="absolute inset-[-20px] rounded-full bg-gradient-to-br from-neon-cyan/20 via-transparent to-neon-magenta/15 blur-3xl animate-pulse" />

              {/* Slow outer orbit ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-8px] rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(20,184,166,0) 0%, rgba(20,184,166,0.6) 25%, rgba(217,70,239,0.4) 50%, rgba(34,197,94,0.3) 75%, rgba(20,184,166,0) 100%)',
                  borderRadius: '50%',
                  padding: '1.5px',
                }}
              >
                <div className="w-full h-full rounded-full bg-midnight" />
              </motion.div>

              {/* Fast inner orbit ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[4px] rounded-full"
                style={{
                  background: 'conic-gradient(from 180deg, rgba(34,197,94,0) 0%, rgba(34,197,94,0.5) 20%, rgba(34,197,94,0) 40%)',
                  borderRadius: '50%',
                  padding: '1px',
                }}
              >
                <div className="w-full h-full rounded-full bg-midnight" />
              </motion.div>

              {/* Portrait */}
              <img
                src="/images/hero-portrait.jpg"
                alt="Amar Jaleel – AI Product Engineer"
                className="absolute inset-[10px] w-[calc(100%-20px)] h-[calc(100%-20px)] object-cover object-top rounded-full"
                style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)' }}
                loading="eager"
              />

              {/* Orbiting dot — cyan */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{ transformOrigin: 'center' }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 rounded-full bg-neon-cyan shadow-lg shadow-neon-cyan/60"
                  style={{ boxShadow: '0 0 10px rgba(20,184,166,0.8), 0 0 20px rgba(20,184,166,0.4)' }}
                />
              </motion.div>

              {/* Orbiting dot — magenta */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-4px] rounded-full"
                style={{ transformOrigin: 'center' }}
              >
                <div
                  className="absolute bottom-3 right-0 w-2.5 h-2.5 rounded-full bg-neon-magenta"
                  style={{ boxShadow: '0 0 10px rgba(217,70,239,0.8), 0 0 20px rgba(217,70,239,0.4)' }}
                />
              </motion.div>

              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-midnight-light/90 border border-neon-green/40 rounded-full px-4 py-2 text-xs font-code shadow-xl shadow-black/50 backdrop-blur-sm whitespace-nowrap"
              >
                <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-lg shadow-neon-green/60" />
                <span className="text-neon-green font-semibold">Open to Work</span>
              </motion.div>

              {/* Floating stat pill — top left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -left-8 top-1/4 flex items-center gap-2 bg-midnight-light/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-code backdrop-blur-sm shadow-lg"
              >
                <span className="text-2xl font-bold text-neon-cyan">11</span>
                <span className="text-slate-400 leading-tight">Google<br/>Certs</span>
              </motion.div>

              {/* Floating stat pill — right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="absolute -right-8 top-1/3 flex items-center gap-2 bg-midnight-light/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-code backdrop-blur-sm shadow-lg"
              >
                <span className="text-2xl font-bold text-neon-green">9</span>
                <span className="text-slate-400 leading-tight">Shipped<br/>Projects</span>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
