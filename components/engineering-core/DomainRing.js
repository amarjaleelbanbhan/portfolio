/**
 * The semantic domain navigation.
 *
 * This is the real content layer, not a caption for the canvas. Every domain is
 * a genuine link with its label, evidence count and destination in the DOM, so
 * the five domains can be explored entirely by keyboard or screen reader without
 * touching WebGL. The 3D scene is a visualisation of this list, and renders on
 * top of it — never instead of it.
 *
 * Two layouts, one component and one set of markup:
 *   - `ring`  positions the links around the core on wide screens
 *   - `list`  stacks them on narrow screens and in the fallback
 *
 * Hover, focus and tap all feed the same interaction state, so information is
 * never behind hover alone.
 *
 * The list layout shows every description inline rather than behind a tap.
 * Touch has no hover, and a tap on these chips navigates — so gating the
 * descriptions behind interaction would have left them unreachable on a phone.
 * Wide screens keep the reveal, where hover and focus both work.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ringPercent } from './coreLayout';
import { duration, ease, stagger } from '@/lib/motion';

function DomainLink({ domain, index, isActive, isDimmed, onHover, onFocus, onSelect, layout }) {
  const positioned = layout === 'ring';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: duration.slow,
        delay: 0.5 + index * stagger.normal,
        ease: ease.outExpo,
      }}
      className={positioned ? 'absolute -translate-x-1/2 -translate-y-1/2' : ''}
      style={positioned ? ringPercent(domain.angle) : undefined}
    >
      <Link
        href={domain.href}
        data-domain={domain.domain}
        data-active={isActive || undefined}
        aria-describedby={`domain-desc-${domain.domain}`}
        onMouseEnter={() => onHover(domain.domain)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onFocus(domain.domain)}
        onBlur={() => onFocus(null)}
        // Touch has no hover: a tap pins the domain so its description stays
        // readable. The link still navigates on the second tap or on Enter.
        onClick={() => onSelect(domain.domain)}
        className={[
          'group flex items-center gap-2.5 rounded-full border px-3.5 py-2',
          'font-code text-xs font-semibold uppercase tracking-wider whitespace-nowrap',
          'transition-[opacity,border-color,background-color,box-shadow,transform]',
          'duration-[var(--duration-normal)] ease-[cubic-bezier(0.16,1,0.3,1)]',
          // 44px minimum target (WCAG 2.5.8) without inflating the visual chip.
          'min-h-[44px]',
          isDimmed ? 'opacity-40' : 'opacity-100',
          isActive ? 'scale-105' : 'hover:scale-105',
        ].join(' ')}
        style={{
          color: domain.color,
          borderColor: isActive ? domain.color : `${domain.color}40`,
          background: isActive ? `${domain.color}1f` : 'rgba(8, 12, 26, 0.78)',
          boxShadow: isActive ? `0 0 26px -6px ${domain.color}` : 'none',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: domain.color, boxShadow: `0 0 8px ${domain.color}` }}
        />
        {domain.label}
        <span className="text-[10px] font-normal text-slate-400 normal-case tracking-normal">
          {domain.stat.value}
        </span>
      </Link>
    </motion.div>
  );
}

export default function DomainRing({
  domains,
  active,
  layout = 'ring',
  onHover,
  onFocus,
  onSelect,
}) {
  const wrapper =
    layout === 'ring'
      ? 'pointer-events-none absolute inset-0'
      : 'grid gap-3 sm:grid-cols-2';

  return (
    <ul className={`${wrapper} list-none m-0 p-0`}>
      {domains.map((domain, index) => (
        <li
          key={domain.domain}
          className={
            layout === 'ring'
              ? 'pointer-events-auto'
              : 'surface-card p-3.5 flex flex-col items-start gap-2'
          }
        >
          <DomainLink
            domain={domain}
            index={index}
            layout={layout}
            isActive={active === domain.domain}
            isDimmed={Boolean(active) && active !== domain.domain}
            onHover={onHover}
            onFocus={onFocus}
            onSelect={onSelect}
          />

          {layout === 'list' ? (
            <>
              <p
                id={`domain-desc-${domain.domain}`}
                className="text-xs text-slate-400 leading-relaxed"
              >
                {domain.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {domain.technologies.map((tech) => (
                  <span
                    key={tech.key}
                    className="font-code text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      color: tech.color,
                      background: `${tech.color}14`,
                      border: `1px solid ${tech.color}2e`,
                    }}
                  >
                    {tech.label}
                  </span>
                ))}
              </div>
            </>
          ) : (
            /* Always in the DOM: the description a sighted user gets on hover is
               the same one a screen reader announces via aria-describedby. */
            <span id={`domain-desc-${domain.domain}`} className="sr-only">
              {domain.description}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
