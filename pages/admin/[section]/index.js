/**
 * /admin/<section> — the record list for any CMS table.
 *
 * Generic on purpose. `lib/cms/schemas.js` says which columns to show, what to
 * search and how to order, so Projects, Research, Open Source, Skills,
 * Credentials, Experience and Site Content all get the same finished list
 * rather than seven variations on one.
 *
 * The status column shows what the **public** sees, not what the flag says.
 * Those differ whenever `published_at` is missing or still in the future, and
 * that gap is the whole reason this column exists.
 *
 * Bespoke sections — leads, media, seo, health, audit, settings — have their
 * own files, which Next resolves ahead of this dynamic route.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminShell from '@/components/admin/AdminShell';
import { createCms, visibilityLabel, isPubliclyVisible } from '@/lib/cms/client';
import { CMS_SECTIONS, schemaForSection } from '@/lib/cms/schemas';

function formatCell(value) {
  if (value === null || value === undefined || value === '') return '—';
  if (Array.isArray(value)) return value.join(', ') || '—';
  if (typeof value === 'boolean') return value ? 'yes' : 'no';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  return String(value);
}

function RecordList({ schema, session, setSession }) {
  const cms = useMemo(() => createCms(() => session, setSession), [session, setSession]);
  const [rows, setRows] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const select = [
        'id',
        'is_published',
        'published_at',
        'updated_at',
        ...new Set(schema.listFields.concat(schema.searchFields, [schema.titleField])),
      ].join(',');
      setRows(await cms.list(schema.table, { select, order: schema.order, limit: '500' }));
    } catch (err) {
      setError(err.message);
      setRows([]);
    }
  }, [cms, schema]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) load();
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) =>
      schema.searchFields.some((field) => String(row[field] ?? '').toLowerCase().includes(needle))
    );
  }, [query, rows, schema.searchFields]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link
          href={`/admin/${schema.section}/new`}
          className="rounded-lg bg-teal-400 px-4 py-2.5 min-h-[44px] inline-flex items-center text-sm font-semibold text-[#06121f] transition-colors hover:bg-teal-300"
        >
          New {schema.label.toLowerCase()}
        </Link>

        <div className="min-w-[200px] flex-1 max-w-sm">
          <label htmlFor="record-search" className="sr-only">
            Search {schema.plural.toLowerCase()}
          </label>
          <input
            id="record-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${schema.plural.toLowerCase()}`}
            className="w-full rounded-lg border border-white/12 bg-white/5 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-teal-400/60"
          />
        </div>

        <p aria-live="polite" className="font-code text-xs text-slate-500 m-0">
          {filtered === null
            ? 'loading…'
            : filtered.length === rows.length
              ? `${rows.length} record${rows.length === 1 ? '' : 's'}`
              : `${filtered.length} of ${rows.length}`}
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {filtered?.length === 0 && (
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-8 text-center">
          <p className="text-sm text-slate-300 m-0">
            {rows.length === 0 ? `No ${schema.plural.toLowerCase()} yet.` : 'Nothing matches that.'}
          </p>
          {rows.length === 0 && (
            <p className="mt-1.5 text-xs text-slate-500 m-0">
              The public site is still reading the canonical files until this table is populated.
            </p>
          )}
        </div>
      )}

      {filtered && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/8">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">{schema.plural}</caption>
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.02]">
                {schema.listFields.map((field) => (
                  <th
                    key={field}
                    scope="col"
                    className="whitespace-nowrap px-4 py-2.5 font-code text-[10px] uppercase tracking-wider text-slate-500"
                  >
                    {field.replace(/_/g, ' ')}
                  </th>
                ))}
                <th scope="col" className="whitespace-nowrap px-4 py-2.5 font-code text-[10px] uppercase tracking-wider text-slate-500">
                  Public
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const live = isPubliclyVisible(row);
                const label = visibilityLabel(row);
                return (
                  <tr key={row.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    {schema.listFields.map((field, index) => (
                      <td key={field} className="px-4 py-2.5 align-top">
                        {index === 0 ? (
                          <Link
                            href={`/admin/${schema.section}/${row.id}`}
                            className="text-slate-100 hover:text-teal-300 transition-colors"
                          >
                            {formatCell(row[field])}
                          </Link>
                        ) : (
                          <span className="text-slate-400">{formatCell(row[field])}</span>
                        )}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-4 py-2.5 align-top">
                      <span
                        className="font-code text-[10px] uppercase tracking-wider"
                        style={{
                          color: live ? '#22c55e' : label === 'Draft' ? '#64748b' : '#f59e0b',
                        }}
                      >
                        {label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function SectionIndex() {
  const router = useRouter();
  const section = String(router.query.section ?? '');
  const schema = schemaForSection(section);

  if (!schema) {
    return (
      <AdminShell title="Not found" description="That section does not exist">
        {() => (
          <p className="text-sm text-slate-400">
            There is no <code className="font-code text-xs">{section}</code> section.{' '}
            <Link href="/admin" className="text-teal-300 hover:text-teal-200">
              Back to the dashboard
            </Link>
            .
          </p>
        )}
      </AdminShell>
    );
  }

  return (
    <AdminShell title={schema.plural} description={`Manage ${schema.plural.toLowerCase()}`}>
      {({ session, setSession }) => (
        <RecordList schema={schema} session={session} setSession={setSession} />
      )}
    </AdminShell>
  );
}

/**
 * Only real CMS sections are routed. An unknown section renders the message
 * above rather than a blank screen; `CMS_SECTIONS` is exported so the health
 * page can cross-check the navigation against what actually has an editor.
 */
export { CMS_SECTIONS };
