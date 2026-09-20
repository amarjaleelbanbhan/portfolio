/**
 * /admin/settings — site-wide configuration.
 *
 * ── Why this table has no public read policy, and must not get one ───────────
 * `site_settings` is a mixed bag: some of it is presentation, some of it is
 * operational. A blanket anonymous policy would publish the whole bag, and the
 * next person to add an operational key would publish that too without
 * noticing. So the table stays private and a **named allowlist** —
 * `PUBLIC_SETTING_KEYS` in `lib/cms/contracts.js` — decides what a public page
 * may ever read, served through `/api/site-config`.
 *
 * The editor marks each key as public or private so the decision is visible at
 * the moment someone creates one, rather than buried in a constant.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { createCms } from '@/lib/cms/client';
import { PUBLIC_SETTING_KEYS, isPublicSettingKey, validateSettingValue } from '@/lib/cms/contracts';

function Settings({ session, setSession }) {
  const cms = useMemo(() => createCms(() => session, setSession), [session, setSession]);
  const [rows, setRows] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [newKey, setNewKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await cms.list('site_settings', {
        select: 'setting_key,setting_value,updated_at',
        order: 'setting_key.asc',
      });
      setRows(data);
      setDrafts(
        Object.fromEntries(data.map((row) => [row.setting_key, JSON.stringify(row.setting_value ?? {}, null, 2)]))
      );
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

  async function save(key) {
    setBusy(true);
    setMessage('');
    setError('');
    try {
      let parsed;
      try {
        parsed = JSON.parse(drafts[key] || '{}');
      } catch (err) {
        throw new Error(`Not valid JSON: ${err.message}`);
      }
      const { value, errors } = validateSettingValue(key, parsed);
      const first = Object.values(errors)[0];
      if (first) throw new Error(first);

      await cms.request(`site_settings?on_conflict=setting_key`, {
        method: 'POST',
        prefer: 'resolution=merge-duplicates,return=minimal',
        body: { setting_key: key, setting_value: value },
      });
      await cms.audit('update', 'site_settings', key, { public: isPublicSettingKey(key) });
      setMessage(`Saved ${key}.`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function create(event) {
    event.preventDefault();
    const key = newKey.trim();
    if (!key) return;
    setDrafts((current) => ({ ...current, [key]: '{}' }));
    setRows((current) => [...(current ?? []), { setting_key: key, setting_value: {} }]);
    setNewKey('');
    setMessage(`Added ${key}. Edit it and save.`);
  }

  const missingPublicKeys = PUBLIC_SETTING_KEYS.filter(
    (key) => !(rows ?? []).some((row) => row.setting_key === key)
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <section className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
        <p className="text-sm leading-relaxed text-slate-400 m-0">
          This table has no anonymous read policy and should not get one. Only the keys on the
          allowlist are ever served to a public page, through{' '}
          <code className="font-code text-xs">/api/site-config</code>. Everything else stays private
          to this screen.
        </p>
      </section>

      <form onSubmit={create} className="flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <label htmlFor="new-setting" className="mb-1.5 block text-sm font-medium text-slate-300">
            New setting key
          </label>
          <input
            id="new-setting"
            type="text"
            value={newKey}
            onChange={(event) => setNewKey(event.target.value)}
            placeholder="site.navigation"
            className="w-full rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-teal-400/60"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg border border-white/12 px-4 py-2.5 min-h-[44px] text-sm text-slate-300 transition-colors hover:border-white/25"
        >
          Add
        </button>
      </form>

      {missingPublicKeys.length > 0 && (
        <p className="rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3 text-xs text-slate-500 m-0">
          On the public allowlist but not yet defined: {missingPublicKeys.join(', ')}.
        </p>
      )}

      <div role="status" aria-live="polite">
        {message && <p className="text-sm text-slate-400 m-0">{message}</p>}
      </div>

      <ul className="list-none m-0 p-0 space-y-4">
        {(rows ?? []).map((row) => {
          const isPublic = isPublicSettingKey(row.setting_key);
          return (
            <li key={row.setting_key} className="rounded-xl border border-white/8 p-4">
              <div className="mb-2 flex flex-wrap items-baseline gap-2">
                <label
                  htmlFor={`setting-${row.setting_key}`}
                  className="font-code text-sm text-slate-200"
                >
                  {row.setting_key}
                </label>
                <span
                  className="font-code text-[10px] uppercase tracking-wider"
                  style={{ color: isPublic ? '#f59e0b' : '#64748b' }}
                >
                  {isPublic ? 'served publicly' : 'private'}
                </span>
              </div>

              <textarea
                id={`setting-${row.setting_key}`}
                rows={8}
                spellCheck={false}
                value={drafts[row.setting_key] ?? ''}
                onChange={(event) =>
                  setDrafts((current) => ({ ...current, [row.setting_key]: event.target.value }))
                }
                className="w-full resize-y rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3 py-2.5 font-code text-xs leading-relaxed text-slate-100 outline-none focus:border-teal-400/60"
              />

              <button
                type="button"
                disabled={busy}
                onClick={() => save(row.setting_key)}
                className="mt-2 rounded-lg border border-white/12 px-3 py-2 min-h-[40px] text-xs text-slate-300 transition-colors hover:border-white/25 disabled:opacity-50"
              >
                Save
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function AdminSettings() {
  return (
    <AdminShell title="Settings" description="Site-wide configuration. Only the allowlist ships publicly.">
      {({ session, setSession }) => <Settings session={session} setSession={setSession} />}
    </AdminShell>
  );
}
