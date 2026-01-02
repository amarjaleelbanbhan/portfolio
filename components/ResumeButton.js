import { motion } from 'framer-motion';
import { personalInfo } from '../data/portfolio';

export default function ResumeButton({ className = '', variant = 'default' }) {
  const isLarge = variant === 'large';
  
  return (
    <motion.a
      href={personalInfo.resumeFile}
      download
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        inline-flex items-center justify-center gap-2
        ${isLarge 
          ? 'px-8 py-4 text-lg' 
          : 'px-4 py-2 text-sm'
        }
        bg-gradient-to-r from-neon-cyan via-neon-green to-neon-cyan
        bg-[length:200%_100%]
        hover:bg-right
        text-midnight font-semibold
        rounded-lg
        transition-all duration-500
        shadow-lg shadow-neon-cyan/25
        hover:shadow-neon-cyan/50
        group
        ${className}
      `}
    >
      {/* Download Icon */}
      <svg 
        className={`${isLarge ? 'w-6 h-6' : 'w-4 h-4'} group-hover:animate-bounce`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      
      <span>Download Resume</span>
      
      {/* Sparkle effect on large variant */}
      {isLarge && (
        <span className="absolute -top-1 -right-1">
          <motion.span
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="block"
          >
            <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" />
            </svg>
          </motion.span>
        </span>
      )}
    </motion.a>
  );
}
