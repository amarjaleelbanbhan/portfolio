/**
 * /admin/health — what the database holds versus what the site actually shows.
 *
 * The question this answers is the one a CMS usually cannot: **is the public
 * site reading any of this?** Right now it is not — the pages render from the
 * canonical files in `content/`, which is deliberate and is what keeps the site
 * correct while the tables fill up. A dashboard that implied otherwise would be
 * the most expensive kind of wrong.
 *
 * It is also where the content migration lives, because migrating is a health
 * operation: it is how the two sides stop disagreeing.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { createCms } from '@/lib/cms/client';
import { migrate, publishImported, sourceCounts } from '@/lib/cms/migrate';
import { authHeaders, restUrl } from '@/lib/supabase';

const SOURCE = sourceCounts();

const TABLES = [
  { table: 'technologies', label: 'Technologies', section: 'skills' },
  { table: 'portfolio_projects', label: 'Projects', section: 'projects' },
  { table: 'research_projects', label: 'Research', section: 'research' },
  { table: 'open_source_contributions', label: 'Open source', section: 'open-source' },
  { table: 'credentials', label: 'Credentials', section: 'credentials' },
  { table: 'experience', label: 'Experience', section: 'experience' },
  { table: 'site_content', label: 'Site content', section: 'content' },
];

async function count(accessToken, table, filter = '') {
  const response = await fetch(`${restUrl(table)}?select=id${filter ? `&${filter}` : ''}`, {
    method: 'HEAD',
    headers: authHeaders(accessToken, { Prefer: 'count=exact' }),
  });
  if (!response.ok) return null;
  const total = (response.headers.get('content-range') ?? '').split('/')[1];
  return total && total !== '*' ? Number(total) : 0;
}

function Health({ session, setSession }) {
  const cms = useMemo(() => createCms(() => session, setSession), [session, setSession]);
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const token = session?.access_token;

  const load = useCallback(async () => {
    if (!token) return;
    setError('');
    try {
      const now = new Date().toISOString();
      const result = await Promise.all(
        TABLES.map(async (entry) => ({
          ...entry,
          total: await count(token, entry.table),
          live: await count(
            token,
            entry.table,
            `is_published=eq.true&published_at=not.is.null&published_at=lte.${now}`
          ),
          source: SOURCE[entry.table] ?? null,
        }))
      );
      setRows(result);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) load();
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function runMigration() {
    if (!window.confirm('Import the canonical content into the CMS? Records are matched by slug and updated in place, nothing is deleted, and everything imports unpublished.')) {
      return;
    }
    setBusy('Starting…');
    setReport(null);
    try {
      const result = await migrate(cms, (label) => setBusy(label));
      setReport(result);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  async function runPublish() {
    if (
      !window.confirm(
        'Publish every unpublished CMS record? This sets the published flag and date together. The same content is already public through the static files, so nothing new is disclosed.'
      )
    ) {
      return;
    }
    setBusy('Publishing…');
    setReport(null);
    try {
      const result = await publishImported(cms, (label) => setBusy(label));
      setReport(result);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  const empty = rows?.every((row) => (row.total ?? 0) === 0);

  return (
    <div className="space-y-8 max-w-4xl">
      {error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* ── What the public site is actually reading ── */}
      <section aria-labelledby="source-heading" className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
        <h2 id="source-heading" className="text-sm font-semibold text-slate-200 m-0">
          Where the public site gets its content
        </h2>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed m-0">
          <strong className="text-teal-300">The canonical files in <code className="font-code text-xs">content/</code></strong>
          , not the database. Every public page still renders from them, and content validation runs
          against them on every build.
        </p>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed m-0">
          That is deliberate. Switching the public site to the database is a separate change, and
          doing it before the tables are populated and reviewed would empty the site. Importing here
          is safe: it fills the CMS without altering a single public page.
        </p>
      </section>

      {/* ── Table state ── */}
      <section aria-labelledby="tables-heading">
        <h2 id="tables-heading" className="text-sm font-semibold text-slate-200 m-0 mb-3">
          CMS tables
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/8">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Record counts per CMS table</caption>
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.02]">
                <th scope="col" className="px-4 py-2.5 font-code text-[10px] uppercase tracking-wider text-slate-500">Table</th>
                <th scope="col" className="px-4 py-2.5 text-right font-code text-[10px] uppercase tracking-wider text-slate-500">In canonical files</th>
                <th scope="col" className="px-4 py-2.5 text-right font-code text-[10px] uppercase tracking-wider text-slate-500">In database</th>
                <th scope="col" className="px-4 py-2.5 text-right font-code text-[10px] uppercase tracking-wider text-slate-500">Publicly visible</th>
              </tr>
            </thead>
            <tbody>
              {(rows ?? TABLES).map((row) => (
                <tr key={row.table} className="border-b border-white/5 last:border-0">
                  <th scope="row" className="px-4 py-2.5 font-normal">
                    <Link href={`/admin/${row.section}`} className="text-slate-200 hover:text-teal-300 transition-colors">
                      {row.label}
                    </Link>
                  </th>
                  <td className="px-4 py-2.5 text-right font-code tabular-nums text-slate-500">
                    {row.source ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right font-code tabular-nums text-slate-300">
                    {row.total ?? '—'}
                  </td>
                  <td
                    className="px-4 py-2.5 text-right font-code tabular-nums"
                    style={{ color: row.live ? '#22c55e' : '#64748b' }}
                  >
                    {row.live ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 font-code text-[11px] text-slate-600">
          {'// experience and site content have no canonical source — nothing is invented for them'}
        </p>
      </section>

      {/* ── Migration ── */}
      <section aria-labelledby="migrate-heading" className="rounded-xl border border-white/8 p-5">
        <h2 id="migrate-heading" className="text-sm font-semibold text-slate-200 m-0">
          Import canonical content
        </h2>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed m-0 max-w-2xl">
          Copies the verified static content into the CMS tables without changing what any of it
          says. Records are matched on slug — or the pull-request URL for contributions — and
          updated in place, so running it twice changes nothing the second time. It never deletes,
          and it never gives a private project a repository URL.
        </p>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed m-0 max-w-2xl">
          Everything imports <strong className="text-slate-200">unpublished</strong>. Publishing is
          the separate button, so an import can never quietly become a publishing event.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={runMigration}
            disabled={Boolean(busy)}
            className="rounded-lg bg-teal-400 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-[#06121f] transition-colors hover:bg-teal-300 disabled:opacity-60"
          >
            {busy ? `Working… ${busy}` : 'Import canonical content'}
          </button>

          {!empty && (
            <button
              type="button"
              onClick={runPublish}
              disabled={Boolean(busy)}
              className="rounded-lg border border-green-400/40 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-green-300 transition-colors hover:bg-green-400/10 disabled:opacity-60"
            >
              Publish everything unpublished
            </button>
          )}
        </div>

        <div role="status" aria-live="polite" className="mt-4">
          {report && (
            <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
              <ul className="list-none m-0 p-0 space-y-1">
                {report.steps.map((step) => (
                  <li key={step.label} className="flex items-baseline gap-2 text-sm">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ background: step.ok ? '#22c55e' : '#f87171' }}
                    />
                    <span className="text-slate-300">{step.label}</span>
                    <span className="font-code text-xs text-slate-500">
                      {step.ok ? `${step.count} record${step.count === 1 ? '' : 's'}` : step.error}
                    </span>
                  </li>
                ))}
              </ul>
              {report.errors.length === 0 && (
                <p className="mt-3 text-xs text-slate-500 m-0">
                  Done. The public site is unchanged — it still reads the canonical files.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function AdminHealth() {
  return (
    <AdminShell title="Site Health" description="What the database holds versus what the site shows">
      {({ session, setSession }) => <Health session={session} setSession={setSession} />}
    </AdminShell>
  );
}
