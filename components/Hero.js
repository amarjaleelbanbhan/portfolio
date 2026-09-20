'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import GlitchText from './GlitchText';
import PortraitOrbit from './PortraitOrbit';
import { getDomainColor, getProfile } from '@/lib/content';
import { duration, ease, fadeUp } from '@/lib/motion';

// The Core is the hero's main visual, but the headline must paint first — the
// page is never held behind WebGL initialisation.
const EngineeringCore = dynamic(
  () => import('./engineering-core/EngineeringCore'),
  {
    ssr: false,
    loading: () => <div className="w-full aspect-square max-w-[520px] mx-auto" />,
  }
);

const profile = getProfile();

const roles = [
  'Software Engineer',
  'Product Engineering',
  'Security & Developer Tools',
  'Applied AI / RAG',
  'Systems Engineering',
];

const floatingChips = [
  { label: 'Python',          color: '#3b82f6', delay: 0   },
  { label: 'Next.js',         color: '#14b8a6', delay: 0.4 },
  { label: 'Flutter',         color: '#f97316', delay: 0.8 },
  { label: 'TypeScript',      color: '#797bf3', delay: 1.2 },
  { label: 'RAG',             color: '#d946ef', delay: 1.6 },
  { label: 'Supabase',        color: '#22c55e', delay: 2.0 },
  { label: 'Static Analysis', color: '#f59e0b', delay: 2.4 },
  { label: 'BLE',             color: '#14b8a6', delay: 2.8 },
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
        // Advance on the same timer the rest of the cycle uses, so the effect
        // body stays free of synchronous state updates.
        timer = setTimeout(() => {
          setIsDeleting(false);
          setRoleIndex((i) => (i + 1) % strings.length);
        }, deletingSpeed);
      }
    }
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, strings, typingSpeed, deletingSpeed, pauseMs]);

  return displayText;
}

/**
 * The headline doubles as the legend for the Engineering Core: the three
 * disciplines it names are set in the same domain accents the core uses, so the
 * colour language is taught by the sentence before it is used by the diagram.
 */
function Headline() {
  return (
    <>
      I build software systems where{' '}
      <span style={{ color: getDomainColor('ai') }}>AI</span>,{' '}
      <span style={{ color: getDomainColor('security') }}>security</span>, and{' '}
      <span style={{ color: getDomainColor('product') }}>product engineering</span> meet.
    </>
  );
}

export default function Hero() {
  const typedRole = useTypingEffect(roles);

  return (
    <div className="relative min-h-[92vh] flex items-center overflow-hidden">

      {/* Deep gradient overlays for depth.
          Pinned to a fixed band rather than `inset-0`: the hero grows when the
          Engineering Core mounts under the thesis, and a blob positioned at
          `top-1/3` of a growing container moves with it — which is a 0.159
          layout shift for a decoration nobody is reading. The band is the
          hero's own minimum height, so it never reflows. */}
      <div className="absolute inset-x-0 top-0 h-[92vh] pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-neon-cyan/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] bg-neon-magenta/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-neon-green/4 rounded-full blur-[100px]" />
      </div>

      {/* Floating tech chips — kept, but dimmed. The headline is now the
          hero's thesis and the core carries the labels, so these drop back to
          ambient depth instead of reading as a second set of tags. They sit
          behind the transparent canvas, which is where the depth comes from. */}
      <div className="absolute inset-x-0 top-0 h-[92vh] pointer-events-none overflow-hidden">
        {floatingChips.map((chip, i) => (
          <motion.div
            key={chip.label}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: [0, 0.32, 0.32, 0], y: [60, -20] }}
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
        <div className="grid gap-10 lg:gap-12 lg:grid-cols-[1.05fr_1fr] items-center">

          {/* ─── Left: the thesis ───
              First in source and first in the grid at every width. The core
              used to be ordered above it on narrow screens, which put the
              headline 1594px down at 360px — two screens of scrolling before
              the page says what it is. The core is still there, directly
              underneath. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.outExpo }}
            className="order-1 flex flex-col"
          >
            {/* Identity row — the portrait keeps its rings and orbiting dots,
                repositioned to support the headline rather than rival the core. */}
            <motion.div
              {...fadeUp({ delay: 0.05 })}
              className="flex items-center gap-4 mb-6"
            >
              <PortraitOrbit size="sm" showBadge={false} />
              <div className="min-w-0">
                <p className="font-code text-[11px] font-semibold uppercase tracking-[0.28em] text-neon-cyan mb-1.5">
                  {profile.name}
                </p>
                <div className="flex items-center gap-1 text-sm text-slate-300 font-code min-h-[1.5rem]">
                  <span className="text-neon-cyan select-none">&gt;&nbsp;</span>
                  <span className="text-white">{typedRole}</span>
                  <span
                    className="inline-block w-0.5 h-4 bg-neon-cyan ml-0.5 cursor-blink"
                    aria-hidden="true"
                  />
                </div>
                <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-neon-green/40 bg-midnight-light/80 px-3 py-1 text-[11px] font-code backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
                  <span className="text-neon-green font-semibold">Open to Work</span>
                </span>
              </div>
            </motion.div>

            <motion.h1
              {...fadeUp({ delay: 0.15 })}
              className="text-[1.75rem] sm:text-4xl md:text-[2.75rem] font-bold leading-[1.12] tracking-tight mb-5 text-slate-50 text-balance"
            >
              <Headline />
            </motion.h1>

            <motion.p
              {...fadeUp({ delay: 0.25 })}
              className="text-base text-slate-300 max-w-xl leading-relaxed mb-8"
            >
              I&apos;m <GlitchText as="span" text="Amar Jaleel" />, a Computer Science student and software
              engineer building production applications, developer and security tools, applied AI
              research systems, and experimental systems software.
            </motion.p>

            <motion.div
              {...fadeUp({ delay: 0.35 })}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/work"
                className="group px-6 py-3.5 bg-neon-cyan text-midnight font-bold rounded-lg shadow-lg shadow-neon-cyan/30 hover:bg-neon-green hover:shadow-neon-green/30 transition-all duration-300 text-sm flex items-center gap-2"
              >
                Explore Engineering Work
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
              <Link
                href="/open-source"
                className="px-6 py-3.5 border border-neon-green/40 text-neon-green font-semibold rounded-lg hover:border-neon-green hover:bg-neon-green/8 transition-all duration-300 text-sm"
              >
                View Open Source
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3.5 text-slate-300 font-semibold rounded-lg border border-white/10 hover:border-white/25 hover:text-white transition-all duration-300 text-sm"
              >
                Work With Me
              </Link>
            </motion.div>
          </motion.div>

          {/* ─── Right: the Engineering Core ─── */}
          <div className="order-2 w-full">
            <EngineeringCore />
          </div>

        </div>
      </div>
    </div>
  );
}
