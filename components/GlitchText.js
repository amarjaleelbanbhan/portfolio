'use client';

import { useState } from 'react';

export default function GlitchText({ text }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cyan glitch layer */}
      <span
        className={`absolute top-0 left-0 text-neon-cyan will-change-transform transition-all duration-75 ${
          isHovered ? 'translate-x-[2px] translate-y-[-2px] opacity-80 mix-blend-screen' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        {text}
      </span>

      {/* Magenta glitch layer */}
      <span
        className={`absolute top-0 left-0 text-neon-magenta will-change-transform transition-all duration-75 ${
          isHovered ? 'translate-x-[-2px] translate-y-[2px] opacity-80 mix-blend-screen' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        {text}
      </span>

      {/* Main text layer */}
      <span className="relative z-10 text-white font-heading font-bold">
        {text}
      </span>
    </div>
  );
}
