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
        className={`absolute top-0 left-0 text-cyan-400 transition-all duration-75 ${
          isHovered ? 'translate-x-[2px] translate-y-[-2px] opacity-70' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        {text}
      </span>

      {/* Magenta glitch layer */}
      <span
        className={`absolute top-0 left-0 text-magenta-500 transition-all duration-75 ${
          isHovered ? 'translate-x-[-2px] translate-y-[2px] opacity-70' : 'opacity-0'
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
