/**
 * The pull-request lifecycle for one contribution.
 *
 * Deliberately short. A real upstream pull request has far more going on than
 * this — review rounds, maintainer comments, CI runs, revisions — and none of
 * that is in the canonical records, so none of it is drawn. The only two events
 * here are the two that were actually verified against the API: when the
 * request was opened, and whether and when it was merged.
 *
 * That constraint is what makes the terminal stop honest. For a merged request
 * it is filled and dated; for an open one it is a hollow ring reading "not
 * merged", and no amount of styling turns one into the other.
 *
 * The rail is `aria-hidden` and the same information is in the text beside it,
 * so nothing depends on reading a drawing.
 */
import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

const MERGED = '#22c55e';
const PENDING = '#64748b';

export default function ContributionLifecycle({
  status,
  openedAt,
  mergedAt,
  daysToMerge,
  reduced = false,
}) {
  const merged = status === 'merged';
  const accent = merged ? MERGED : PENDING;

  // "Opened" with no recorded date would be a stop with nothing in it.
  if (!openedAt && !mergedAt) return null;

  const span =
    daysToMerge === null || daysToMerge === undefined
      ? null
      : daysToMerge === 0
        ? 'same day'
        : `${daysToMerge} ${daysToMerge === 1 ? 'day' : 'days'}`;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 shrink-0" aria-hidden="true">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: '#475569' }}
        />
        <span className="relative h-px w-10 sm:w-16 overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <motion.span
            className="absolute inset-y-0 left-0"
            style={{ background: accent, transformOrigin: 'left center' }}
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: merged ? 1 : 0.35, opacity: merged ? 1 : 0.5 }}
            transition={{ duration: duration.slow, ease: ease.outExpo }}
          />
          <span className="block w-full h-px" />
        </span>
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{
            background: merged ? MERGED : 'transparent',
            border: merged ? 'none' : `1px solid ${PENDING}`,
          }}
        />
      </div>

      <dl className="flex items-center gap-x-4 gap-y-1 flex-wrap m-0 text-[11px] font-code">
        <div className="flex items-baseline gap-1.5">
          <dt className="text-slate-600 uppercase tracking-wider">Opened</dt>
          <dd className="m-0 text-slate-400">
            {openedAt ? <time dateTime={openedAt}>{openedAt}</time> : 'date not recorded'}
          </dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-slate-600 uppercase tracking-wider">
            {merged ? 'Merged' : 'Status'}
          </dt>
          <dd className="m-0" style={{ color: accent }}>
            {merged && mergedAt ? (
              <time dateTime={mergedAt}>{mergedAt}</time>
            ) : (
              'open — not merged'
            )}
          </dd>
        </div>
        {span && (
          <div className="flex items-baseline gap-1.5">
            <dt className="text-slate-600 uppercase tracking-wider">Open for</dt>
            <dd className="m-0 text-slate-400">{span}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
