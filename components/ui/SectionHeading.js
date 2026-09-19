/**
 * Section heading — the eyebrow label + heading + optional lede used across
 * every portfolio section.
 *
 * Replaces the hand-repeated `.section-label` / `.section-heading` pairing so
 * the hierarchy is defined once. `as` sets the real heading level: the visual
 * size is a token, the semantic level is the caller's decision, and the two
 * should not be welded together.
 */
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

export default function SectionHeading({
  label,
  title,
  lede,
  as: Tag = 'h2',
  align = 'left',
  className = '',
}) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <motion.div {...fadeUp()} className={`${alignment} ${className}`}>
      {label && <p className="section-label">{label}</p>}
      <Tag className="section-heading">{title}</Tag>
      {lede && (
        <p
          className={`mt-3 text-slate-400 leading-relaxed max-w-2xl ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {lede}
        </p>
      )}
    </motion.div>
  );
}
