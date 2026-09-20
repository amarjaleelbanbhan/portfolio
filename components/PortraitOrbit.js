/**
 * Portrait with its orbit rings, orbiting dots and availability badge.
 *
 * Extracted from Hero so the composition could change without losing the
 * effects. Phase 4 moved the Engineering Core into the hero's main visual slot;
 * rather than delete the portrait to make room, it becomes a compact identity
 * anchor beside the headline — the same rings, the same orbiting dots, the same
 * pulsing badge, at a size that supports the headline instead of competing with
 * the core for attention.
 *
 * `size` drives everything so the piece stays coherent at any scale. Orbit
 * speeds are unchanged from the original.
 */
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PortraitOrbit({
  size = 'lg',
  showBadge = true,
  badgeLabel = 'Open to Work',
  className = '',
}) {
  const compact = size === 'sm';
  const box = compact ? 'w-[88px] h-[88px] sm:w-24 sm:h-24' : 'w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96';

  return (
    <div className={`relative ${box} ${className}`}>
      {/* Outer ambient glow */}
      <div className="absolute inset-[-12%] rounded-full bg-gradient-to-br from-neon-cyan/20 via-transparent to-neon-magenta/15 blur-2xl animate-pulse" />

      {/* Slow outer orbit ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[-4px] rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(20,184,166,0) 0%, rgba(20,184,166,0.6) 25%, rgba(217,70,239,0.4) 50%, rgba(34,197,94,0.3) 75%, rgba(20,184,166,0) 100%)',
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
        className="absolute inset-[2px] rounded-full"
        style={{
          background:
            'conic-gradient(from 180deg, rgba(34,197,94,0) 0%, rgba(34,197,94,0.5) 20%, rgba(34,197,94,0) 40%)',
          borderRadius: '50%',
          padding: '1px',
        }}
      >
        <div className="w-full h-full rounded-full bg-midnight" />
      </motion.div>

      {/* Portrait — the Phase 0.5 optimised asset, requested at render size. */}
      <div className={`absolute ${compact ? 'inset-[5px]' : 'inset-[10px]'} rounded-full overflow-hidden`}>
        <Image
          src="/images/hero-portrait.jpg"
          alt="Amar Jaleel"
          fill
          sizes={compact ? '96px' : '(min-width: 768px) 384px, (min-width: 640px) 320px, 256px'}
          className="object-cover object-top"
          style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)' }}
          priority
        />
      </div>

      {/* Orbiting dot — cyan */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full"
        style={{ transformOrigin: 'center' }}
      >
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 rounded-full bg-neon-cyan ${compact ? 'w-1.5 h-1.5' : 'w-3 h-3'}`}
          style={{ boxShadow: '0 0 10px rgba(20,184,166,0.8), 0 0 20px rgba(20,184,166,0.4)' }}
        />
      </motion.div>

      {/* Orbiting dot — magenta */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[-2px] rounded-full"
        style={{ transformOrigin: 'center' }}
      >
        <div
          className={`absolute bottom-2 right-0 rounded-full bg-neon-magenta ${compact ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'}`}
          style={{ boxShadow: '0 0 10px rgba(217,70,239,0.8), 0 0 20px rgba(217,70,239,0.4)' }}
        />
      </motion.div>

      {showBadge && !compact && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 200 }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-midnight-light/90 border border-neon-green/40 rounded-full px-4 py-2 text-xs font-code shadow-xl shadow-black/50 backdrop-blur-sm whitespace-nowrap"
        >
          <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-lg shadow-neon-green/60" />
          <span className="text-neon-green font-semibold">{badgeLabel}</span>
        </motion.div>
      )}
    </div>
  );
}
