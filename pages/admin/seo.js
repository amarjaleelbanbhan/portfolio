/**
 * /admin/seo — titles, descriptions and what is in the sitemap.
 *
 * This screen is mostly a mirror rather than an editor, and that is the honest
 * shape right now: the public pages still render from the canonical files, so
 * their metadata comes from `<Seo>` in the source, not the database. Editing a
 * `seo` JSON column here would save happily and change nothing on the site,
 * which is exactly the kind of admin control the brief calls incomplete.
 *
 * What it does do is useful and true today: it reads the CMS records' SEO
 * fields, flags the ones that will cause problems when the public site does
 * switch over — missing descriptions, titles that search results truncate,
 * duplicates — and lists the routes the sitemap actually ships.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { createCms } from '@/lib/cms/client';

const SEO_TABLES = [
  { table: 'portfolio_projects', section: 'projects', label: 'Projects', title: 'title' },
  { table: 'research_projects', section: 'research', label: 'Research', title: 'title' },
  { table: 'site_content', section: 'content', label: 'Site content', title: 'content_key' },
];

/** Search results truncate around here; warn rather than silently ship it. */
const TITLE_LIMIT = 70;
const DESCRIPTION_MIN = 80;
const DESCRIPTION_LIMIT = 175;

function Seo({ session, setSession }) {
  const cms = useMemo(() => createCms(() => session, setSession), [session, setSession]);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const all = await Promise.all(
        SEO_TABLES.map(async (entry) => {
          const data = await cms.list(entry.table, {
            select: `id,${entry.title},seo,is_published,published_at`,
            limit: '500',
          });
          return data.map((row) => ({ ...entry, id: row.id, name: row[entry.title], seo: row.seo ?? {} }));
        })
      );
      setRows(all.flat());
    } catch (err) {
      setError(err.message);
      setRows([]);
    }
  }, [cms]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) load();
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const issues = useMemo(() => {
    if (!rows) return [];
    const found = [];
    const titles = new Map();

    for (const row of rows) {
      const title = row.seo.title ?? '';
      const description = row.seo.description ?? '';

      if (!description) {
        found.push({ ...row, problem: 'No description. Search results will invent one from the page.' });
      } else if (description.length < DESCRIPTION_MIN) {
        found.push({ ...row, problem: `Description is ${description.length} characters — thin.` });
      } else if (description.length > DESCRIPTION_LIMIT) {
        found.push({ ...row, problem: `Description is ${description.length} characters and will be truncated.` });
      }

      if (title.length > TITLE_LIMIT) {
        found.push({ ...row, problem: `Title is ${title.length} characters and will be truncated.` });
      }
      if (title) {
        if (titles.has(title)) {
          found.push({ ...row, problem: `Duplicate title, also on "${titles.get(title)}".` });
        } else {
          titles.set(title, row.name);
        }
      }
    }
    return found;
  }, [rows]);

  return (
    <div className="space-y-6 max-w-3xl">
      {error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <section className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-4">
        <h2 className="text-sm font-semibold text-amber-200 m-0">Where page metadata comes from today</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300 m-0">
          The public pages still render from the canonical files, so their titles and descriptions
          come from <code className="font-code text-xs">components/Seo.js</code> in the source — not
          from these records. Editing a record&apos;s SEO here is stored correctly and will take
          effect when the public site reads from the database; it does not change a live page yet.
        </p>
      </section>

      <section aria-labelledby="issues-heading">
        <h2 id="issues-heading" className="text-sm font-semibold text-slate-200 m-0 mb-3">
          Problems {rows ? `· ${issues.length}` : ''}
        </h2>

        {rows && issues.length === 0 && (
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-6 text-center">
            <p className="text-sm text-slate-300 m-0">
              {rows.length === 0 ? 'No CMS records to check yet.' : 'Nothing to fix.'}
            </p>
          </div>
        )}

        <ul className="list-none m-0 p-0 space-y-2">
          {issues.map((issue, index) => (
            <li
              key={`${issue.id}-${index}`}
              className="flex flex-wrap items-baseline gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-4 py-2.5"
            >
              <Link
                href={`/admin/${issue.section}/${issue.id}`}
                className="text-sm text-slate-200 transition-colors hover:text-teal-300"
              >
                {issue.name}
              </Link>
              <span className="font-code text-[10px] uppercase tracking-wider text-slate-600">
                {issue.label}
              </span>
              <span className="w-full text-xs text-amber-300 sm:w-auto">{issue.problem}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sitemap-heading">
        <h2 id="sitemap-heading" className="text-sm font-semibold text-slate-200 m-0 mb-2">
          Sitemap
        </h2>
        <p className="text-sm leading-relaxed text-slate-400 m-0">
          Shipped as a static file at{' '}
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-300 hover:text-teal-200"
          >
            /sitemap.xml
          </a>
          , listing the public routes. It is maintained alongside the routes themselves, so a new
          page is added in the same commit that creates it. Generating it from the database belongs
          with the switch-over, not before — a sitemap that advertises pages the site does not
          render yet is worse than one that lags.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400 m-0">
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-300 hover:text-teal-200"
          >
            robots.txt
          </a>{' '}
          disallows <code className="font-code text-xs">/admin</code>,{' '}
          <code className="font-code text-xs">/studio/admin</code> and{' '}
          <code className="font-code text-xs">/dev/</code>, and every admin page also sends
          <code className="font-code text-xs"> noindex</code>.
        </p>
      </section>
    </div>
  );
}

export default function AdminSeo() {
  return (
    <AdminShell title="SEO" description="Titles, descriptions and the sitemap">
      {({ session, setSession }) => <Seo session={session} setSession={setSession} />}
    </AdminShell>
  );
}
