/**
 * /admin/leads — the CRM.
 *
 * Two views over the same data, because they answer different questions. The
 * **list** answers "what came in and when"; the **board** answers "where is
 * everything stuck". A pipeline that only exists as a status column is a status
 * column, not a pipeline.
 *
 * On a phone the board would be a horizontal scroll of near-empty columns, so
 * below `lg` the list is the only view — and the list is the one that works
 * with a thumb anyway.
 *
 * Nothing here deletes a lead. These are real enquiries from real people; the
 * closest thing to removal is the `archived` status, which keeps the record.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import LeadDetail from '@/components/admin/LeadDetail';
import { createCms } from '@/lib/cms/client';
import {
  PIPELINE,
  PRIORITIES,
  createLeads,
  enquiryKind,
  followUpDue,
  formatDate,
  formatMoney,
  pipelineTone,
  priorityTone,
} from '@/lib/cms/leads';

function Chip({ active, tone, onClick, children, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="inline-flex items-center gap-2 rounded-full border px-3 min-h-[40px] font-code text-[11px] uppercase tracking-wider transition-colors"
      style={{
        borderColor: active ? tone : 'rgba(255,255,255,0.10)',
        background: active ? `${tone}1f` : 'transparent',
        color: active ? '#f1f5f9' : '#94a3b8',
      }}
    >
      {children}
      {typeof count === 'number' && <span className="text-slate-500">{count}</span>}
    </button>
  );
}

function LeadCard({ lead, onOpen, compact = false }) {
  const kind = enquiryKind(lead);
  const due = followUpDue(lead);
  const value = formatMoney(lead.estimated_value_usd);

  return (
    <button
      type="button"
      onClick={() => onOpen(lead)}
      className="w-full rounded-lg border border-white/8 bg-white/[0.03] p-3 text-left transition-colors hover:border-white/20"
    >
      <p className="flex items-baseline gap-2 m-0">
        <span className="truncate text-sm font-medium text-slate-100">{lead.name}</span>
        <span
          aria-hidden="true"
          className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: priorityTone(lead.priority) }}
        />
      </p>
      <p className="truncate font-code text-[10px] text-slate-500 m-0 mt-0.5">
        {kind.category ?? kind.channel} · {formatDate(lead.created_at)}
      </p>
      {!compact && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-slate-400 m-0">{lead.problem}</p>
      )}
      <p className="mt-1.5 flex items-center gap-2 m-0">
        {value && <span className="font-code text-[10px] text-teal-300">{value}</span>}
        {due && <span className="font-code text-[10px] text-amber-300">follow-up due</span>}
      </p>
    </button>
  );
}

function Crm({ session, setSession }) {
  const cms = useMemo(() => createCms(() => session, setSession), [session, setSession]);
  const leads = useMemo(() => createLeads(cms, () => session?.user?.id), [cms, session]);

  const [rows, setRows] = useState(null);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('list');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setRows(await leads.list());
    } catch (err) {
      setError(err.message);
      setRows([]);
    }
  }, [leads]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) load();
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const onChanged = useCallback((updated) => {
    setRows((current) => (current ?? []).map((row) => (row.id === updated.id ? { ...row, ...updated } : row)));
    setSelected((current) => (current && current.id === updated.id ? { ...current, ...updated } : current));
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const needle = query.trim().toLowerCase();
    return rows.filter((lead) => {
      if (status !== 'all' && lead.status !== status) return false;
      if (priority !== 'all' && (lead.priority ?? 'normal') !== priority) return false;
      if (!needle) return true;
      return [lead.name, lead.email, lead.company, lead.problem, (lead.internal_tags ?? []).join(' ')]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle));
    });
  }, [priority, query, rows, status]);

  const counts = useMemo(() => {
    const map = new Map();
    for (const lead of rows ?? []) map.set(lead.status, (map.get(lead.status) ?? 0) + 1);
    return map;
  }, [rows]);

  const due = (rows ?? []).filter(followUpDue).length;
  const pipelineValue = (rows ?? [])
    .filter((lead) => !['won', 'lost', 'closed', 'archived'].includes(lead.status))
    .reduce((sum, lead) => sum + (Number(lead.estimated_value_usd) || 0), 0);

  return (
    <div className="space-y-5">
      {error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* ── Summary ── */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { value: rows?.length ?? '—', label: 'enquiries', tone: '#5eead4' },
          { value: counts.get('new') ?? 0, label: 'new, unread', tone: (counts.get('new') ?? 0) ? '#f59e0b' : '#8291aa' },
          { value: due, label: 'follow-ups due', tone: due ? '#f59e0b' : '#8291aa' },
          {
            value: pipelineValue ? formatMoney(pipelineValue) : '—',
            label: 'open pipeline value',
            tone: '#94a3b8',
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="font-code text-2xl font-bold tabular-nums m-0" style={{ color: stat.tone }}>
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-slate-400 m-0">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={status === 'all'} tone="#14b8a6" onClick={() => setStatus('all')} count={rows?.length}>
            All
          </Chip>
          {PIPELINE.filter((stage) => counts.get(stage.id)).map((stage) => (
            <Chip
              key={stage.id}
              active={status === stage.id}
              tone={stage.tone}
              onClick={() => setStatus(stage.id)}
              count={counts.get(stage.id)}
            >
              {stage.label}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Chip active={priority === 'all'} tone="#94a3b8" onClick={() => setPriority('all')}>
            Any priority
          </Chip>
          {PRIORITIES.map((entry) => (
            <Chip
              key={entry.id}
              active={priority === entry.id}
              tone={entry.tone}
              onClick={() => setPriority(entry.id)}
            >
              {entry.label}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[200px] flex-1 max-w-sm">
            <label htmlFor="lead-search" className="sr-only">
              Search enquiries
            </label>
            <input
              id="lead-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, message or tag"
              className="w-full rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-teal-400/60"
            />
          </div>

          {/* The board is desktop-only; on a phone it would be a horizontal
              scroll of near-empty columns. */}
          <div className="hidden lg:flex items-center gap-1 rounded-lg border border-white/10 p-1">
            {['list', 'board'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                className="rounded px-3 min-h-[36px] font-code text-[11px] uppercase tracking-wider transition-colors"
                style={{
                  background: view === mode ? 'rgba(20,184,166,0.16)' : 'transparent',
                  color: view === mode ? '#5eead4' : '#94a3b8',
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          <p aria-live="polite" className="font-code text-xs text-slate-500 m-0">
            {filtered === null
              ? 'loading…'
              : filtered.length === rows.length
                ? `${rows.length} enquir${rows.length === 1 ? 'y' : 'ies'}`
                : `${filtered.length} of ${rows.length}`}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
        <div className="min-w-0">
          {filtered?.length === 0 && (
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-8 text-center">
              <p className="text-sm text-slate-300 m-0">
                {rows.length === 0 ? 'No enquiries yet.' : 'Nothing matches those filters.'}
              </p>
            </div>
          )}

          {/* ── List ──
              Always rendered, and hidden at `lg` only when the board is
              selected. That is what makes the board desktop-only without
              maintaining two separate renders of the same list. */}
          {filtered && filtered.length > 0 && (
            <div className={view === 'board' ? 'lg:hidden' : ''}>
              <ul className="list-none m-0 p-0 space-y-2">
                {filtered.map((lead) => (
                  <li key={lead.id}>
                    <LeadCard lead={lead} onOpen={setSelected} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Board ── */}
          {filtered && filtered.length > 0 && view === 'board' && (
            <div className="hidden lg:block overflow-x-auto">
              <div className="flex gap-3 pb-2" style={{ minWidth: 'min-content' }}>
                {PIPELINE.filter((stage) => counts.get(stage.id)).map((stage) => {
                  const stageLeads = filtered.filter((lead) => lead.status === stage.id);
                  return (
                    <section
                      key={stage.id}
                      aria-label={`${stage.label} — ${stageLeads.length}`}
                      className="w-60 shrink-0"
                    >
                      <p className="mb-2 flex items-center gap-2 font-code text-[10px] uppercase tracking-wider m-0">
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: stage.tone }}
                        />
                        <span style={{ color: stage.tone }}>{stage.label}</span>
                        <span className="text-slate-600">{stageLeads.length}</span>
                      </p>
                      <ul className="list-none m-0 p-0 space-y-2">
                        {stageLeads.map((lead) => (
                          <li key={lead.id}>
                            <LeadCard lead={lead} onOpen={setSelected} compact />
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Detail ── */}
        <div className="min-w-0 xl:sticky xl:top-6">
          {selected ? (
            <LeadDetail
              lead={selected}
              leads={leads}
              onChange={onChanged}
              onClose={() => setSelected(null)}
            />
          ) : (
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-6">
              <p className="text-sm text-slate-400 m-0">
                Select an enquiry to read it, move it through the pipeline, add a private note or
                schedule a follow-up.
              </p>
              <p className="mt-2 font-code text-[11px] text-slate-600 m-0">
                {'// what they wrote is never editable — only the internal fields are'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminLeads() {
  return (
    <AdminShell title="Leads" description="Enquiries from the contact form and the Studio">
      {({ session, setSession }) => <Crm session={session} setSession={setSession} />}
    </AdminShell>
  );
}
