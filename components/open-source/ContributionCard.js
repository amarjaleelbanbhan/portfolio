/**
 * One upstream contribution, in full.
 *
 * The card is built around the two things a reader of a portfolio actually
 * needs and almost never gets: what was wrong before, and what was changed.
 * Everything else on it — status, dates, diff, tests — is supporting evidence
 * for those two paragraphs, which is why they are the largest text here and the
 * repository name is not.
 *
 * Status is rendered from the canonical value with no fallback branch that
 * could default an unknown state to "merged". An open request reads open in the
 * badge, in the lifecycle rail and in the border tint, and validation
 * independently rejects a merged-typed proof on an unmerged request.
 *
 * Test evidence is stated or its absence is stated. "No tests documented in the
 * pull request" is a useful thing for a reader to know, and hiding the section
 * when it is empty would quietly imply that every entry came with tests.
 */
import { motion } from 'framer-motion';
import ChangedFiles from '@/components/open-source/ChangedFiles';
import ContributionLifecycle from '@/components/open-source/ContributionLifecycle';
import { fadeUp } from '@/lib/motion';

const STATUS = {
  merged: { label: 'Merged', color: '#22c55e' },
  open: { label: 'Open', color: '#8291aa' },
  closed: { label: 'Closed', color: '#8291aa' },
};

export default function ContributionCard({ contribution, daysToMerge, reduced = false, index = 0 }) {
  const status = STATUS[contribution.status] ?? STATUS.open;
  const headingId = `${contribution.id}-heading`;

  return (
    <motion.article
      id={contribution.id}
      aria-labelledby={headingId}
      {...fadeUp({ delay: reduced ? 0 : Math.min(index, 4) * 0.04 })}
      className="surface-card p-5 sm:p-6 scroll-mt-24"
      style={{ borderColor: `${status.color}26` }}
    >
      {/* ── Identity ── */}
      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div className="min-w-0">
          <p className="font-code text-xs text-slate-500 mb-1 truncate">
            {contribution.repository}
            <span className="text-slate-600">{` #${contribution.prNumber}`}</span>
          </p>
          <h3 id={headingId} className="text-base sm:text-lg font-semibold text-slate-100 leading-snug m-0">
            {contribution.title}
          </h3>
        </div>
        <span
          className="shrink-0 font-code text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
          style={{
            color: status.color,
            background: `${status.color}14`,
            border: `1px solid ${status.color}33`,
          }}
        >
          {status.label}
        </span>
      </div>

      {/* ── Lifecycle ── */}
      <div className="mb-4 pb-4 border-b border-white/5">
        <ContributionLifecycle
          status={contribution.status}
          openedAt={contribution.openedAt}
          mergedAt={contribution.mergedAt}
          daysToMerge={daysToMerge}
          reduced={reduced}
        />
      </div>

      {/* ── The two paragraphs that matter ── */}
      <dl className="m-0 space-y-3.5 mb-4">
        <div>
          <dt className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
            The problem
          </dt>
          <dd className="m-0 text-sm text-slate-300 leading-relaxed">{contribution.problem}</dd>
        </div>
        <div>
          <dt
            className="font-code text-[10px] uppercase tracking-[0.2em] mb-1"
            style={{ color: status.color }}
          >
            What I changed
          </dt>
          <dd className="m-0 text-sm text-slate-300 leading-relaxed">{contribution.change}</dd>
        </div>
      </dl>

      {/* ── Evidence ── */}
      {/* `min-w-0` on both columns is load-bearing, not tidiness. Grid items
          default to min-width:auto, so the file list — whose min-content width
          is an unbreakable path like `pydantic_ai_slim/.../_adapter.py` — would
          otherwise widen the column past the viewport instead of truncating,
          which is exactly what it did at 360px before this was added. */}
      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        <div className="min-w-0">
          <p className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
            Tests and checks
          </p>
          {contribution.verification?.length ? (
            <ul className="list-none m-0 p-0 space-y-1.5">
              {contribution.verification.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                    style={{ background: status.color }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed m-0">
              No tests or checks are documented in this pull request.
            </p>
          )}
        </div>

        <ChangedFiles diff={contribution.diff} accent={status.color} />
      </div>

      {/* ── Tags and link ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap pt-3 border-t border-white/5">
        <ul className="list-none m-0 p-0 flex flex-wrap gap-1.5">
          {contribution.areas.map((area) => (
            <li
              key={area}
              className="font-code text-[10px] px-2 py-0.5 rounded-md text-slate-400"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {area}
            </li>
          ))}
          {contribution.languages.map((language) => (
            <li
              key={language}
              className="font-code text-[10px] px-2 py-0.5 rounded-md"
              style={{
                color: status.color,
                background: `${status.color}12`,
                border: `1px solid ${status.color}25`,
              }}
            >
              {language}
            </li>
          ))}
        </ul>

        <a
          href={contribution.url}
          target="_blank"
          rel="noopener noreferrer"
          // 44px on every breakpoint rather than only on touch: this is the
          // card's primary action, and a 16px-tall link is below the WCAG 2.2
          // minimum target size for a pointer as well.
          className="font-code text-xs font-medium inline-flex items-center gap-1.5 min-h-[44px] hover:brightness-125 transition-[filter]"
          style={{ color: status.color }}
        >
          {`View ${contribution.repository.split('/')[1]}#${contribution.prNumber}`}
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      {contribution.issueRef && (
        <p className="font-code text-[10px] text-slate-600 mt-2 m-0">
          {`// resolves ${contribution.repository}${contribution.issueRef}`}
        </p>
      )}
    </motion.article>
  );
}
