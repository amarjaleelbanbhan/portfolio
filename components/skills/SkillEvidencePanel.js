/**
 * What a selected skill is actually backed by.
 *
 * This is the half of the galaxy that does the work. The graph shows which
 * technologies were used together; this says where, and every entry is a link
 * to the thing itself — a case study, a project card, a research entry, or the
 * pull request on GitHub. A skill with nothing to open would be a label, and
 * content validation now rejects one.
 *
 * Destinations are resolved in `getSkillEvidenceDetail()`, not here, so no
 * component has to know that a project without a reviewed case study links to
 * its card on /work rather than to a page that does not exist.
 *
 * With nothing selected the panel is a prompt rather than blank space, and its
 * height is reserved so selecting a skill does not shift the board above it.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import { statusLabel } from '@/components/ui/StatusBadge';
import { duration, ease } from '@/lib/motion';

const GROUPS = [
  { key: 'projects', label: 'Built into', color: '#14b8a6' },
  { key: 'research', label: 'Used in research', color: '#af63f8' },
  { key: 'contributions', label: 'Upstream contributions', color: '#22c55e' },
];

function EvidenceRow({ item, color }) {
  const body = (
    <>
      <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
        {item.label}
      </span>
      <span className="font-code text-[10px] uppercase tracking-wider text-slate-500 shrink-0 ml-auto">
        {statusLabel(item.meta) ?? item.meta}
      </span>
      <span aria-hidden="true" style={{ color }}>
        {item.external ? '↗' : '→'}
      </span>
    </>
  );

  const className =
    'group flex items-center gap-2.5 w-full rounded-lg border border-white/8 bg-[rgba(8,12,26,0.5)] px-3 py-2.5 min-h-[44px] hover:border-white/20 transition-colors';

  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link href={item.href} className={className}>
      {body}
    </Link>
  );
}

export default function SkillEvidencePanel({ detail, onSelectSkill, reduced = false }) {
  if (!detail) {
    return (
      <div className="surface-card p-5 min-h-[18rem] flex flex-col justify-center">
        <p className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 m-0 mb-2">
          Evidence
        </p>
        <p className="text-sm text-slate-400 leading-relaxed m-0">
          Select a technology to see the projects, research and pull requests it was actually used
          in. Selecting a category narrows the board to that cluster.
        </p>
        <p className="font-code text-xs text-slate-600 mt-3 m-0">
          {'// every line on the board is two technologies used on the same thing'}
        </p>
      </div>
    );
  }

  const { skill, relatedSkills, total } = detail;

  return (
    <motion.div
      key={skill.slug}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.normal, ease: ease.outExpo }}
      className="surface-card p-5 min-h-[18rem]"
      aria-live="polite"
    >
      <div className="flex items-baseline gap-2.5 flex-wrap mb-1">
        <h3 className="text-lg font-semibold text-slate-50 m-0" style={{ color: skill.color }}>
          {skill.name}
        </h3>
        <span className="font-code text-[10px] uppercase tracking-wider text-slate-500">
          {skill.category}
        </span>
      </div>
      <p className="font-code text-[11px] text-slate-500 m-0 mb-4">
        {`${total} ${total === 1 ? 'piece' : 'pieces'} of evidence`}
      </p>

      <div className="space-y-4">
        {GROUPS.map((group) => {
          const items = detail[group.key];
          if (items.length === 0) return null;
          return (
            <section key={group.key} aria-label={`${group.label} — ${skill.name}`}>
              <p
                className="font-code text-[10px] uppercase tracking-[0.2em] mb-2 m-0"
                style={{ color: group.color }}
              >
                {group.label}
              </p>
              <ul className="list-none m-0 p-0 space-y-1.5">
                {items.map((item) => (
                  <li key={item.key}>
                    <EvidenceRow item={item} color={group.color} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {relatedSkills.length > 0 && (
        <section aria-label={`Used alongside ${skill.name}`} className="mt-4 pt-4 border-t border-white/5">
          <p className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 m-0">
            Used alongside
          </p>
          <ul className="list-none m-0 p-0 flex flex-wrap gap-1.5">
            {relatedSkills.map((related) => (
              <li key={related.slug}>
                <button
                  type="button"
                  onClick={() => onSelectSkill(related.slug)}
                  className="font-code text-[11px] px-2 py-1 min-h-[44px] sm:min-h-[30px] inline-flex items-center rounded-md border border-white/10 text-slate-400 hover:text-white hover:border-white/25 transition-colors"
                >
                  {related.label}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </motion.div>
  );
}
