/**
 * Accessible interactive card foundation.
 *
 * The pattern later phases need for case-study and project cards: a whole card
 * that behaves like one link without trapping the rest of its content in an
 * anchor.
 *
 * It uses the "stretched link" approach — the card is a positioned container,
 * one real <a> inside it carries the destination and accessible name, and a
 * pseudo-element overlay makes the full card clickable. That keeps exactly one
 * tab stop, gives the focus ring something real to attach to, and leaves any
 * nested links inside the card still individually reachable (they sit above the
 * overlay). Wrapping everything in an <a> instead would flatten headings, tags
 * and buttons into a single unreadable link label.
 *
 * Cards with no href render as a plain article and take no tab stop at all.
 */
import { motion } from 'framer-motion';
import { fadeUp, hoverLift } from '@/lib/motion';

export default function InteractiveCard({
  children,
  href,
  label,
  domain,
  external = false,
  delay = 0,
  animate = true,
  className = '',
  ...rest
}) {
  const motionProps = {
    ...(animate ? fadeUp({ delay }) : {}),
    ...hoverLift,
  };

  return (
    <motion.article
      data-domain={domain}
      className={`surface-card group relative h-full flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-[var(--focus-ring-color)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-base)] ${className}`}
      {...motionProps}
      {...rest}
    >
      {href && (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          aria-label={label}
          // Covers the card without becoming a visible element. Nested
          // interactive content needs a higher z-index to stay clickable.
          className="absolute inset-0 z-10 outline-none"
        >
          <span className="sr-only">{label}</span>
        </a>
      )}
      {children}
    </motion.article>
  );
}
