/**
 * /admin/audit — the administrative record.
 *
 * Read-only, because the table is append-only: the policies allow an
 * authorised admin to insert and to read, and allow nobody to update or delete.
 * That is the property worth having, and the interface should not pretend to
 * offer more control than it does.
 *
 * ── What this log is, precisely ──────────────────────────────────────────────
 * A record of what the **admin interface** did, written by the client with its
 * own `auth.uid()`. It is not proof of every statement the database saw: a
 * different client, or a direct SQL session, writes nothing here. Saying so
 * matters, because an audit log people trust more than it deserves is worse
 * than no audit log. Real guarantees need database triggers, which is a schema
 * change and is written up rather than assumed.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { createCms } from '@/lib/cms/client';

const ACTION_TONE = {
  create: '#22c55e',
  update: '#38bdf8',
  delete: '#f87171',
  publish: '#22c55e',
  unpublish: '#f59e0b',
  migrate: '#af63f8',
  'publish-all': '#af63f8',
  'delete-media': '#f87171',
};

function when(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function AuditLog({ session, setSession }) {
  const cms = useMemo(() => createCms(() => session, setSession), [session, setSession]);
  const [rows, setRows] = useState(null);
  const [action, setAction] = useState('all');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setRows(
        await cms.list('admin_audit_log', {
          select: 'id,actor_id,action,entity_type,entity_id,detail,created_at',
          order: 'created_at.desc',
          limit: '300',
        })
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

  const actions = useMemo(() => [...new Set((rows ?? []).map((row) => row.action))].sort(), [rows]);
  const filtered = useMemo(
    () => (rows ?? []).filter((row) => action === 'all' || row.action === action),
    [action, rows]
  );

  return (
    <div className="space-y-5 max-w-4xl">
      {error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <p className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-400 m-0">
        Append-only: the policies let an authorised admin add and read entries, and let nobody edit
        or remove them. It records what this interface did — a direct database session writes
        nothing here, so treat it as an operations trail rather than forensic proof.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {['all', ...actions].map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setAction(entry)}
            aria-pressed={action === entry}
            className="rounded-full border px-3 min-h-[40px] font-code text-[11px] uppercase tracking-wider transition-colors"
            style={{
              borderColor: action === entry ? (ACTION_TONE[entry] ?? '#14b8a6') : 'rgba(255,255,255,0.10)',
              color: action === entry ? '#f1f5f9' : '#94a3b8',
            }}
          >
            {entry}
          </button>
        ))}
        <p aria-live="polite" className="font-code text-xs text-slate-500 m-0">
          {rows === null ? 'loading…' : `${filtered.length} entr${filtered.length === 1 ? 'y' : 'ies'}`}
        </p>
      </div>

      {filtered.length === 0 && rows !== null && (
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-8 text-center">
          <p className="text-sm text-slate-300 m-0">Nothing recorded yet.</p>
        </div>
      )}

      <ul className="list-none m-0 p-0 space-y-1.5">
        {filtered.map((row) => (
          <li key={row.id} className="rounded-lg border border-white/8 bg-white/[0.02] px-4 py-2.5">
            <p className="flex flex-wrap items-baseline gap-2 m-0">
              <span
                className="font-code text-[10px] uppercase tracking-wider"
                style={{ color: ACTION_TONE[row.action] ?? '#94a3b8' }}
              >
                {row.action}
              </span>
              <span className="text-sm text-slate-200">{row.entity_type}</span>
              {row.detail?.label && <span className="text-sm text-slate-400">{row.detail.label}</span>}
              <span className="ml-auto font-code text-[10px] text-slate-600">{when(row.created_at)}</span>
            </p>
            {row.detail && Object.keys(row.detail).length > 0 && (
              <p className="mt-1 font-code text-[10px] text-slate-600 m-0 break-all">
                {Object.entries(row.detail)
                  .filter(([key]) => key !== 'label')
                  .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join('|') : value}`)
                  .join('  ')}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminAudit() {
  return (
    <AdminShell title="Audit Log" description="Every administrative action, append-only">
      {({ session, setSession }) => <AuditLog session={session} setSession={setSession} />}
    </AdminShell>
  );
}
