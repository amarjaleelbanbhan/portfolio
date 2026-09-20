/**
 * Animated surface.
 *
 * Wraps the existing .surface-card / .glass-panel treatments — which stay in
 * globals.css because other components already use them — and adds the shared
 * entrance and hover motion. `domain` tints the surface through the token
 * system rather than through a prop threaded down to every child.
 */
import { motion } from 'framer-motion';
import { fadeUp, hoverLift } from '@/lib/motion';

export default function Panel({
  children,
  variant = 'surface',
  domain,
  lift = false,
  delay = 0,
  animate = true,
  className = '',
  ...rest
}) {
  const base = variant === 'glass' ? 'glass-panel' : 'surface-card';
  const motionProps = {
    ...(animate ? fadeUp({ delay }) : {}),
    ...(lift ? hoverLift : {}),
  };

  return (
    <motion.div
      data-domain={domain}
      className={`${base} ${className}`}
      {...motionProps}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
