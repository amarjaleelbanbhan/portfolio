'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Particles from '@tsparticles/react';
import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import GlitchText from './GlitchText';

export default function Hero() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: '#00ff88',
      },
      links: {
        color: '#00ff88',
        distance: 150,
        enable: true,
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: false,
        straight: false,
        outModes: {
          default: 'bounce',
        },
      },
      number: {
        value: 60,
        density: {
          enable: true,
          area: 800,
        },
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  return (
    <div className="relative overflow-hidden">
      {init && (
        <div className="absolute inset-0 opacity-50">
          <Particles
            id="hero-particles"
            options={particlesOptions}
          />
        </div>
      )}
      <div className="section-container relative">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 flex flex-col justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em]">
                Welcome to my world
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold leading-tight mb-4"
            >
              <GlitchText text="AMAR JALEEL" />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-slate-300 max-w-lg mb-6"
            >
              Full-Stack Tech Enthusiast | AI • Cybersecurity • Data Analytics
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-base text-slate-400 max-w-lg mb-8"
            >
              Building Tomorrow's Solutions Today. Passionate about leveraging cutting-edge technology to solve real-world challenges.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4"
            >
              <a
                href="#projects"
                className="px-5 py-3 bg-accent text-midnight font-semibold rounded-lg shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all"
              >
                View Work
              </a>
              <a
                href="/contact"
                className="px-5 py-3 border border-accent rounded-lg text-accent hover:bg-accent/10 transition-all"
              >
                Contact
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Hexagon Portrait */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Glow behind */}
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse" />
              {/* Portrait - centered to show full head */}
              <img
                src="/images/hero-portrait.jpg"
                alt="Amar Jaleel - Full-Stack Developer, AI & Cybersecurity Enthusiast"
                className="absolute inset-0 w-full h-full object-cover object-top rounded-full shadow-[0_0_40px_rgba(0,255,136,0.3)]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
