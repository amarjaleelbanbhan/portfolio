/**
 * The résumé call to action.
 *
 * No longer a download: Phase 18 replaced the static file with `/resume`, a
 * route generated from the same records as the site, which prints to PDF from
 * the browser. A `download` attribute on an HTML route would have saved the
 * markup rather than the document.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getProfile } from '@/lib/content';

const profile = getProfile();

// Framer needs a component reference, and next/link must stay the element so
// client-side navigation and prefetching still apply.
const MotionLink = motion.create(Link);

export default function ResumeButton({ className = '', variant = 'default' }) {
  const isLarge = variant === 'large';
  
  return (
    <MotionLink
      href={profile.resumeUrl}
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
        group relative
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      
      <span>View Résumé</span>
      
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
    </MotionLink>
  );
}
