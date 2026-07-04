'use client';

import { motion } from 'framer-motion';

export default function NeonButton({ children, onClick, href, className = '' }) {
  const base =
    'relative inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-neon-cyan/50 text-neon-cyan font-code text-xs font-semibold uppercase tracking-widest rounded-lg transition-all duration-300 hover:border-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] active:scale-95 select-none ' +
    className;

  if (href) {
    return (
      <a href={href} className={base} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={base}
    >
      {children}
    </motion.button>
  );
}
