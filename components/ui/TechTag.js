/**
 * Technology tag.
 *
 * Tints itself from the surrounding --domain-accent unless given an explicit
 * accent, so a group of tags inside a [data-domain] subtree reads as belonging
 * to that domain without every caller passing a colour.
 *
 * `interactive` adds hover/press motion and a real focusable element. Phase 16
 * makes these open skill evidence; until then the default is a plain span, so
 * nothing announces itself to a screen reader as clickable when it is not.
 */
import { motion } from 'framer-motion';
import { tagInteraction } from '@/lib/motion';

export default function TechTag({
  children,
  accent,
  interactive = false,
  onClick,
  className = '',
}) {
  const color = accent || 'var(--domain-accent)';
  const style = {
    background: accent ? `${accent}14` : 'var(--domain-soft)',
    color,
    border: `1px solid ${accent ? `${accent}25` : 'var(--domain-soft)'}`,
  };
  const classes = `text-xs px-2 py-0.5 rounded-md font-code ${className}`;

  if (!interactive) {
    return (
      <span className={classes} style={style}>
        {children}
      </span>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      {...tagInteraction}
      // 44px is the WCAG 2.5.8 target minimum; the visual chip stays small and
      // the tap area is padded out to meet it.
      className={`${classes} min-h-[44px] sm:min-h-0 sm:py-1 inline-flex items-center`}
      style={style}
    >
      {children}
    </motion.button>
  );
}
