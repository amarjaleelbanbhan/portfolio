/**
 * /admin — the dashboard.
 *
 * The first question this has to answer is not "how many records are there" but
 * **"does the public site show what I think it shows"**. Those are different
 * questions, because a record can be flagged published and still be invisible:
 * the anonymous read policy also requires `published_at` to be set and not in
 * the future. A row in that state is the single easiest thing to get wrong and
 * the hardest to notice, so it has its own column here and its own warning.
 *
 * Counts come from PostgREST's exact count header rather than by downloading
 * rows, so the dashboard costs almost nothing regardless of how much content
 * exists.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { ADMIN_SECTIONS } from '@/lib/admin/navigation';
import { PUBLISHABLE_TABLES } from '@/lib/cms/client';
import { authHeaders, restUrl } from '@/lib/supabase';

const CONTENT_SECTIONS = ADMIN_SECTIONS.filter(
  (section) => section.table && PUBLISHABLE_TABLES.includes(section.table)
);

/**
 * Row count for a filter, read from the `Content-Range` header.
 *
 * `HEAD` plus `count=exact` means the database counts and returns nothing else.
 */
async function countRows(accessToken, table, filter = '') {
  const response = await fetch(`${restUrl(table)}?select=id${filter ? `&${filter}` : ''}`, {
    method: 'HEAD',
    headers: authHeaders(accessToken, { Prefer: 'count=exact' }),
  });
  if (!response.ok) return null;
  const range = response.headers.get('content-range') ?? '';
  const total = range.split('/')[1];
  return total && total !== '*' ? Number(total) : 0;
}

function Stat({ value, label, tone = 'default', href }) {
  const colour =
    tone === 'warn' ? '#f59e0b' : tone === 'good' ? '#22c55e' : tone === 'quiet' ? '#94a3b8' : '#5eead4';
  const body = (
    <>
      <span className="block font-code text-2xl font-bold tabular-nums" style={{ color: colour }}>
        {value === null ? '—' : value}
      </span>
      <span className="mt-0.5 block text-xs leading-tight text-slate-400">{label}</span>
    </>
  );
  const className =
    'block rounded-xl border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-white/16';
  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

function Dashboard({ session }) {
  const [rows, setRows] = useState(null);
  const [leads, setLeads] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = session?.access_token;

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const contentCounts = await Promise.all(
        CONTENT_SECTIONS.map(async (section) => {
          const [total, published, flagged] = await Promise.all([
            countRows(token, section.table),
            // The real definition of public: flag set AND a date that has passed.
            countRows(token, section.table, `is_published=eq.true&published_at=not.is.null&published_at=lte.${new Date().toISOString()}`),
            // Flagged published but not actually visible — the trap.
            countRows(token, section.table, 'is_published=eq.true&published_at=is.null'),
          ]);
          return { ...section, total, published, flagged };
        })
      );
      setRows(contentCounts);

      const [leadTotal, leadNew, leadFollowUp] = await Promise.all([
        countRows(token, 'studio_leads'),
        countRows(token, 'studio_leads', 'status=eq.new'),
        countRows(token, 'studio_leads', `next_follow_up_at=not.is.null&next_follow_up_at=lte.${new Date().toISOString()}`),
      ]);
      setLeads({ total: leadTotal, fresh: leadNew, due: leadFollowUp });
    } catch (err) {
      setError(err.message || 'Could not load the dashboard.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const totals = useMemo(() => {
    if (!rows) return null;
    return rows.reduce(
      (acc, row) => ({
        total: acc.total + (row.total ?? 0),
        published: acc.published + (row.published ?? 0),
        flagged: acc.flagged + (row.flagged ?? 0),
      }),
      { total: 0, published: 0, flagged: 0 }
    );
  }, [rows]);

  const empty = totals?.total === 0;

  return (
    <div className="space-y-8">
      {error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* The state the database is actually in. Said plainly, because a CMS
          that looks populated when it is empty wastes an afternoon. */}
      {empty && !loading && (
        <section
          aria-labelledby="empty-heading"
          className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-5"
        >
          <h2 id="empty-heading" className="text-sm font-semibold text-amber-200 m-0">
            The content tables are empty
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed m-0 max-w-2xl">
            The schema exists but nothing has been migrated into it yet. The public site is still
            rendering from the canonical files in <code className="font-code text-xs">content/</code>,
            which is deliberate — it keeps the site correct while the database fills up. Nothing
            here is broken.
          </p>
          <Link
            href="/admin/health"
            className="mt-3 inline-flex items-center min-h-[40px] font-code text-xs font-semibold text-amber-200 hover:text-amber-100"
          >
            See what the site is reading →
          </Link>
        </section>
      )}

      {/* ── Publishing state ── */}
      <section aria-labelledby="publishing-heading">
        <h2 id="publishing-heading" className="text-sm font-semibold text-slate-200 m-0 mb-3">
          Publishing
        </h2>
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Stat value={totals?.total ?? null} label="records in the CMS" tone="quiet" />
          <Stat value={totals?.published ?? null} label="visible to the public" tone="good" />
          <Stat
            value={totals?.flagged ?? null}
            label="flagged published, but no date — not public"
            tone={totals?.flagged ? 'warn' : 'quiet'}
          />
          <Stat value={leads?.total ?? null} label="enquiries" href="/admin/leads" />
        </div>

        {totals?.flagged > 0 && (
          <p className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.04] px-4 py-3 text-sm text-amber-200">
            {totals.flagged} record{totals.flagged === 1 ? ' has' : 's have'} the published flag set
            with no publication date. The public read policy requires both, so {totals.flagged === 1 ? 'it is' : 'they are'} invisible.
            Republishing from the record fixes it.
          </p>
        )}
      </section>

      {/* ── Per-section ── */}
      <section aria-labelledby="sections-heading">
        <h2 id="sections-heading" className="text-sm font-semibold text-slate-200 m-0 mb-3">
          Content
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/8">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Record counts by section</caption>
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.02]">
                <th scope="col" className="px-4 py-2.5 font-code text-[10px] uppercase tracking-wider text-slate-500">
                  Section
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-code text-[10px] uppercase tracking-wider text-slate-500">
                  Records
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-code text-[10px] uppercase tracking-wider text-slate-500">
                  Live
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-code text-[10px] uppercase tracking-wider text-slate-500">
                  Needs a date
                </th>
              </tr>
            </thead>
            <tbody>
              {(rows ?? CONTENT_SECTIONS).map((row) => (
                <tr key={row.id} className="border-b border-white/5 last:border-0">
                  <th scope="row" className="px-4 py-2.5 font-normal">
                    <Link href={row.href} className="text-slate-200 hover:text-teal-300 transition-colors">
                      {row.label}
                    </Link>
                  </th>
                  <td className="px-4 py-2.5 text-right font-code tabular-nums text-slate-400">
                    {row.total ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right font-code tabular-nums" style={{ color: row.published ? '#22c55e' : '#64748b' }}>
                    {row.published ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right font-code tabular-nums" style={{ color: row.flagged ? '#f59e0b' : '#475569' }}>
                    {row.flagged ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Enquiries ── */}
      <section aria-labelledby="enquiries-heading">
        <h2 id="enquiries-heading" className="text-sm font-semibold text-slate-200 m-0 mb-3">
          Enquiries
        </h2>
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Stat value={leads?.fresh ?? null} label="new, unread" tone={leads?.fresh ? 'warn' : 'quiet'} href="/admin/leads" />
          <Stat value={leads?.due ?? null} label="follow-up due" tone={leads?.due ? 'warn' : 'quiet'} href="/admin/leads" />
        </div>
      </section>

      <p className="font-code text-[11px] text-slate-600">
        {loading ? '// loading…' : '// counts read directly from the database'}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminShell title="Dashboard" description="What is live, what is draft, and what needs attention">
      {({ session }) => <Dashboard session={session} />}
    </AdminShell>
  );
}
