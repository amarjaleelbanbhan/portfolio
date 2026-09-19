/**
 * The conditional building blocks of a case study.
 *
 * Every component here returns `null` when it has no real content. That is the
 * central rule of the case-study system: a project whose evidence has not been
 * reviewed yet renders fewer sections, never an empty heading or a placeholder.
 * Callers can therefore render the full template unconditionally and let the
 * content decide what appears.
 *
 * These are grouped in one module because each is small and they are always used
 * together; splitting them into a dozen files would add navigation cost without
 * adding clarity.
 */
import { motion } from 'framer-motion';
import ProofBadge from '@/components/ui/ProofBadge';
import { fadeUp } from '@/lib/motion';

/** Shared section frame: heading plus body, rendered only when given children. */
export function Section({ id, title, lede, children, className = '' }) {
  return (
    <motion.section
      id={id}
      aria-labelledby={`${id}-heading`}
      {...fadeUp()}
      className={`mb-12 scroll-mt-24 ${className}`}
    >
      <h2
        id={`${id}-heading`}
        className="text-xl sm:text-2xl font-bold text-slate-50 tracking-tight mb-2"
      >
        {title}
      </h2>
      {lede && <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mb-4">{lede}</p>}
      {children}
    </motion.section>
  );
}

/** A block of prose. Renders nothing at all when the field is absent. */
export function ProseSection({ id, title, body }) {
  if (!body?.trim()) return null;
  return (
    <Section id={id} title={title}>
      <p className="text-base text-slate-300 leading-relaxed max-w-2xl">{body}</p>
    </Section>
  );
}

/** Context plus the constraints that shaped the work. */
export function ConstraintBlock({ context, constraints = [], accent }) {
  if (!context?.trim() && constraints.length === 0) return null;
  return (
    <Section id="context" title="Context and constraints">
      {context && (
        <p className="text-base text-slate-300 leading-relaxed max-w-2xl mb-4">{context}</p>
      )}
      {constraints.length > 0 && (
        <ul className="list-none m-0 p-0 grid gap-2.5 sm:grid-cols-2">
          {constraints.map((constraint) => (
            <li key={constraint} className="flex items-start gap-2.5 surface-card p-3.5">
              <span
                aria-hidden="true"
                className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: accent }}
              />
              <span className="text-sm text-slate-300 leading-relaxed">{constraint}</span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/**
 * Engineering decisions.
 *
 * Deliberately shows the trade-off alongside the decision: a decision listed
 * without what it cost reads as marketing rather than engineering.
 */
export function TechnicalDecisions({ decisions = [], accent }) {
  if (decisions.length === 0) return null;
  return (
    <Section
      id="decisions"
      title="Technical decisions"
      lede="What was chosen, why, and what it cost."
    >
      <div className="space-y-4">
        {decisions.map((d) => (
          <article key={d.id} className="surface-card p-5">
            <h3 className="text-base font-semibold text-slate-100 mb-2.5">{d.title}</h3>
            <dl className="space-y-2 m-0">
              <div>
                <dt className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Decision
                </dt>
                <dd className="text-sm text-slate-300 leading-relaxed m-0">{d.decision}</dd>
              </div>
              <div>
                <dt className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Why
                </dt>
                <dd className="text-sm text-slate-400 leading-relaxed m-0">{d.rationale}</dd>
              </div>
              {d.tradeoff && (
                <div>
                  <dt
                    className="font-code text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: accent }}
                  >
                    Trade-off
                  </dt>
                  <dd className="text-sm text-slate-400 leading-relaxed m-0">{d.tradeoff}</dd>
                </div>
              )}
            </dl>
          </article>
        ))}
      </div>
    </Section>
  );
}

/** Security and reliability concerns and how each was handled. */
export function ConcernSection({ concerns = [] }) {
  if (concerns.length === 0) return null;
  return (
    <Section
      id="concerns"
      title="Security and reliability"
      lede="The failure modes that shaped the implementation."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {concerns.map((c) => (
          <article key={c.id} className="surface-card p-4">
            <h3 className="text-sm font-semibold text-slate-100 mb-1.5">{c.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{c.detail}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

/**
 * Verification activities.
 *
 * `verified` is rendered explicitly rather than assumed: an item implemented but
 * not independently evidenced here is marked as such, so the reader can tell the
 * difference between "this is tested" and "I can show you the test".
 */
export function TestEvidence({ items = [], accent }) {
  if (items.length === 0) return null;
  return (
    <Section
      id="verification"
      title="Verification"
      lede="How the implementation was checked, and how much of that can be shown publicly."
    >
      <ul className="list-none m-0 p-0 space-y-2.5">
        {items.map((item) => (
          <li key={item.id} className="surface-card p-4 flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-1 w-2 h-2 rounded-full shrink-0"
              style={{
                background: item.verified ? accent : 'transparent',
                border: item.verified ? 'none' : '1px solid #64748b',
              }}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 m-0">
                {item.label}
                <span
                  className="ml-2 font-code text-[10px] uppercase tracking-wider"
                  style={{ color: item.verified ? accent : '#64748b' }}
                >
                  {item.verified ? 'evidenced' : 'not publicly evidenced'}
                </span>
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mt-1 m-0">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Verified proof items, as a compact strip. */
export function ProofStrip({ proof = [] }) {
  const verified = proof.filter((p) => p.verified);
  if (verified.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {verified.map((item) => (
        <ProofBadge key={item.id} proof={item} />
      ))}
    </div>
  );
}

/** Outcomes that can be stated honestly. Never invented numbers. */
export function ResultsSection({ results = [] }) {
  if (results.length === 0) return null;
  return (
    <Section id="results" title="Results">
      <ul className="list-none m-0 p-0 space-y-2">
        {results.map((result) => (
          <li key={result} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
            <span aria-hidden="true" className="mt-1.5 w-1 h-1 rounded-full bg-slate-500 shrink-0" />
            {result}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Ordered milestones. */
export function ProjectTimeline({ entries = [], accent }) {
  if (entries.length === 0) return null;
  return (
    <Section id="timeline" title="Timeline">
      <ol className="list-none m-0 p-0 relative">
        <span
          aria-hidden="true"
          className="absolute left-[5px] top-2 bottom-2 w-px"
          style={{ background: `${accent}33` }}
        />
        {entries.map((entry) => (
          <li key={entry.id} className="relative pl-6 pb-5 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2"
              style={{ borderColor: accent, background: 'var(--bg-base)' }}
            />
            <p className="text-sm font-medium text-slate-200 m-0">
              {entry.label}
              {entry.date && (
                <time className="ml-2 font-code text-[11px] text-slate-500" dateTime={entry.date}>
                  {entry.date}
                </time>
              )}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed mt-0.5 m-0">{entry.detail}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** Verified metrics only. A metric without verification is not displayed. */
export function ProjectMetrics({ metrics = [], accent }) {
  const verified = metrics.filter((m) => m.verified);
  if (verified.length === 0) return null;
  return (
    <Section id="metrics" title="Metrics">
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
        {verified.map((m) => (
          <div key={m.label} className="surface-card p-4">
            <p className="text-2xl font-bold font-code m-0" style={{ color: accent }}>
              {m.value}
            </p>
            <p className="text-xs text-slate-400 leading-tight mt-1 m-0">{m.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** Documented limitations, straight from the canonical record. */
export function ProjectLimitations({ limitations = [], disclosure }) {
  if (limitations.length === 0 && !disclosure?.trim()) return null;
  return (
    <Section
      id="limitations"
      title="Limitations and disclosure"
      lede="What this project does not do, and what cannot be shown publicly."
    >
      {limitations.length > 0 && (
        <ul className="list-none m-0 p-0 space-y-2 mb-4">
          {limitations.map((limitation) => (
            <li
              key={limitation}
              className="flex items-start gap-2.5 text-sm text-slate-400 leading-relaxed"
            >
              <span aria-hidden="true" className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
              {limitation}
            </li>
          ))}
        </ul>
      )}
      {disclosure && (
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl surface-card p-4">
          {disclosure}
        </p>
      )}
    </Section>
  );
}
