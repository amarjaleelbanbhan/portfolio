/**
 * One lead, in full: what they wrote, where it is in the pipeline, the internal
 * notes and the history.
 *
 * ── What is editable, and what is not ────────────────────────────────────────
 * The intake fields — name, email, company, website, the message — are shown
 * and never edited. They are what someone actually said, and an internal tool
 * that lets you rewrite them is a tool that will eventually be used to rewrite
 * them. Everything internal (status, priority, value, follow-up, tags, notes)
 * is fully editable.
 *
 * Every change writes a history line, so the activity list is a real record
 * rather than a timestamp on a row.
 */
import { useCallback, useEffect, useState } from 'react';
import {
  PIPELINE,
  PRIORITIES,
  enquiryBody,
  enquiryKind,
  followUpDue,
  formatDate,
  formatMoney,
  pipelineTone,
  priorityTone,
} from '@/lib/cms/leads';

const ACTION_LABELS = {
  status_changed: 'Status changed',
  priority_changed: 'Priority changed',
  follow_up_scheduled: 'Follow-up scheduled',
  follow_up_cleared: 'Follow-up cleared',
  value_changed: 'Estimated value changed',
  tags_changed: 'Tags changed',
  note_added: 'Note added',
  email_opened: 'Email drafted',
};

function Row({ label, children }) {
  return (
    <div className="flex items-baseline gap-3 py-1.5">
      <dt className="w-28 shrink-0 font-code text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-sm text-slate-300 m-0">{children}</dd>
    </div>
  );
}

export default function LeadDetail({ lead, leads, onChange, onClose }) {
  const [notes, setNotes] = useState([]);
  const [activity, setActivity] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const kind = enquiryKind(lead);
  const body = enquiryBody(lead);

  const load = useCallback(async () => {
    try {
      const [noteRows, activityRows] = await Promise.all([leads.notes(lead.id), leads.activity(lead.id)]);
      setNotes(noteRows);
      setActivity(activityRows);
    } catch (error) {
      setMessage(error.message);
    }
  }, [lead.id, leads]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) load();
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function patch(fields) {
    setBusy(true);
    setMessage('');
    try {
      const updated = await leads.updateFields(lead, fields);
      onChange(updated);
      await load();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitNote(event) {
    event.preventDefault();
    if (!noteText.trim()) return;
    setBusy(true);
    setMessage('');
    try {
      await leads.addNote(lead, noteText);
      setNoteText('');
      await load();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function emailThem() {
    const subject = encodeURIComponent(`Re: your enquiry${kind.category ? ` — ${kind.category}` : ''}`);
    const intro = encodeURIComponent(`Hi ${lead.name.split(' ')[0]},\n\n`);
    window.location.href = `mailto:${lead.email}?subject=${subject}&body=${intro}`;
    // Recording it is the point — a CRM that opens a draft and forgets is not
    // tracking anything.
    try {
      const updated = await leads.markContacted(lead);
      onChange(updated);
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#081120]">
      <div className="flex items-start justify-between gap-3 border-b border-white/8 p-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-100 m-0">{lead.name}</h2>
          <p className="truncate font-code text-xs text-slate-500 m-0 mt-0.5">
            {kind.channel}
            {kind.category ? ` · ${kind.category}` : ''} · {formatDate(lead.created_at)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg border border-white/10 px-3 min-h-[40px] text-xs text-slate-400 transition-colors hover:text-slate-100"
        >
          Close
        </button>
      </div>

      <div className="space-y-6 p-4">
        {/* ── What they wrote. Read-only, deliberately. ── */}
        <section aria-labelledby={`enquiry-${lead.id}`}>
          <h3 id={`enquiry-${lead.id}`} className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 m-0 mb-2">
            Their enquiry
          </h3>
          <dl className="m-0">
            <Row label="Email">
              <a href={`mailto:${lead.email}`} className="text-teal-300 hover:text-teal-200 break-all">
                {lead.email}
              </a>
            </Row>
            {lead.company && <Row label="Organisation">{lead.company}</Row>}
            {lead.website && (
              <Row label="Link">
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-300 hover:text-teal-200 break-all"
                >
                  {lead.website}
                </a>
              </Row>
            )}
          </dl>
          <p className="mt-2 whitespace-pre-wrap rounded-lg border border-white/8 bg-white/[0.02] p-3 text-sm leading-relaxed text-slate-300 m-0">
            {body}
          </p>
        </section>

        {/* ── Pipeline ── */}
        <section aria-labelledby={`pipeline-${lead.id}`} className="space-y-3">
          <h3 id={`pipeline-${lead.id}`} className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 m-0">
            Pipeline
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`status-${lead.id}`} className="mb-1.5 block text-xs text-slate-400">
                Status
              </label>
              <select
                id={`status-${lead.id}`}
                value={lead.status}
                disabled={busy}
                onChange={(event) => patch({ status: event.target.value })}
                className="w-full rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3 py-2.5 min-h-[44px] text-sm text-slate-100 outline-none focus:border-teal-400/60"
              >
                {PIPELINE.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`priority-${lead.id}`} className="mb-1.5 block text-xs text-slate-400">
                Priority
              </label>
              <select
                id={`priority-${lead.id}`}
                value={lead.priority ?? 'normal'}
                disabled={busy}
                onChange={(event) => patch({ priority: event.target.value })}
                className="w-full rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3 py-2.5 min-h-[44px] text-sm text-slate-100 outline-none focus:border-teal-400/60"
              >
                {PRIORITIES.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`value-${lead.id}`} className="mb-1.5 block text-xs text-slate-400">
                Estimated value (USD)
              </label>
              <input
                id={`value-${lead.id}`}
                type="number"
                min="0"
                step="100"
                defaultValue={lead.estimated_value_usd ?? ''}
                disabled={busy}
                onBlur={(event) => {
                  const raw = event.target.value;
                  const next = raw === '' ? null : Number(raw);
                  if (next !== (lead.estimated_value_usd === null ? null : Number(lead.estimated_value_usd))) {
                    patch({ estimated_value_usd: next });
                  }
                }}
                className="w-full rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3 py-2.5 min-h-[44px] text-sm text-slate-100 outline-none focus:border-teal-400/60"
              />
            </div>

            <div>
              <label htmlFor={`followup-${lead.id}`} className="mb-1.5 block text-xs text-slate-400">
                Next follow-up
              </label>
              <input
                id={`followup-${lead.id}`}
                type="date"
                defaultValue={lead.next_follow_up_at ? lead.next_follow_up_at.slice(0, 10) : ''}
                disabled={busy}
                onChange={(event) =>
                  patch({
                    next_follow_up_at: event.target.value
                      ? new Date(`${event.target.value}T09:00:00`).toISOString()
                      : null,
                  })
                }
                className="w-full rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3 py-2.5 min-h-[44px] text-sm text-slate-100 outline-none focus:border-teal-400/60"
              />
              {followUpDue(lead) && (
                <p className="mt-1 text-xs text-amber-300 m-0">This follow-up is due.</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor={`tags-${lead.id}`} className="mb-1.5 block text-xs text-slate-400">
              Internal tags
            </label>
            <input
              id={`tags-${lead.id}`}
              type="text"
              defaultValue={(lead.internal_tags ?? []).join(', ')}
              disabled={busy}
              placeholder="comma, separated"
              onBlur={(event) => {
                const next = event.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                if (next.join('|') !== (lead.internal_tags ?? []).join('|')) patch({ internal_tags: next });
              }}
              className="w-full rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3 py-2.5 min-h-[44px] text-sm text-slate-100 outline-none focus:border-teal-400/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={emailThem}
              className="rounded-lg bg-teal-400 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-[#06121f] transition-colors hover:bg-teal-300"
            >
              Email {lead.name.split(' ')[0]}
            </button>
            {lead.last_contacted_at && (
              <span className="font-code text-[11px] text-slate-500">
                last contacted {formatDate(lead.last_contacted_at)}
              </span>
            )}
          </div>
        </section>

        {/* ── Notes ── */}
        <section aria-labelledby={`notes-${lead.id}`}>
          <h3 id={`notes-${lead.id}`} className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 m-0 mb-2">
            Internal notes
          </h3>
          <form onSubmit={submitNote} className="mb-3">
            <label htmlFor={`note-${lead.id}`} className="sr-only">
              Add a note
            </label>
            <textarea
              id={`note-${lead.id}`}
              rows={3}
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Private. Never shown on the site."
              className="w-full resize-y rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-teal-400/60"
            />
            <button
              type="submit"
              disabled={busy || !noteText.trim()}
              className="mt-2 rounded-lg border border-white/12 px-3 py-2 min-h-[40px] text-xs text-slate-300 transition-colors hover:border-white/25 disabled:opacity-50"
            >
              Add note
            </button>
          </form>

          <ul className="list-none m-0 p-0 space-y-2">
            {notes.length === 0 && <li className="text-xs text-slate-600">No notes yet.</li>}
            {notes.map((note) => (
              <li key={note.id} className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
                <p className="whitespace-pre-wrap text-sm text-slate-300 m-0">{note.note}</p>
                <p className="mt-1.5 font-code text-[10px] text-slate-600 m-0">{formatDate(note.created_at)}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── History ── */}
        <section aria-labelledby={`activity-${lead.id}`}>
          <h3 id={`activity-${lead.id}`} className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 m-0 mb-2">
            History
          </h3>
          <ul className="list-none m-0 p-0 space-y-1.5">
            {activity.length === 0 && (
              <li className="text-xs text-slate-600">Nothing recorded yet.</li>
            )}
            {activity.map((entry) => (
              <li key={entry.id} className="flex items-baseline gap-2 text-xs">
                <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-slate-600" />
                <span className="text-slate-300">{ACTION_LABELS[entry.action] ?? entry.action}</span>
                {entry.detail?.from && (
                  <span className="font-code text-slate-500">
                    {entry.detail.from} → {entry.detail.to}
                  </span>
                )}
                <span className="ml-auto shrink-0 font-code text-[10px] text-slate-600">
                  {formatDate(entry.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div role="status" aria-live="polite" className="min-h-[1.25rem]">
          {message && <p className="text-sm text-red-400 m-0">{message}</p>}
        </div>

        <p className="font-code text-[10px] text-slate-600 m-0">
          {`// value ${formatMoney(lead.estimated_value_usd) ?? 'not set'} · priority `}
          <span style={{ color: priorityTone(lead.priority) }}>{lead.priority ?? 'normal'}</span>
          {' · status '}
          <span style={{ color: pipelineTone(lead.status) }}>{lead.status}</span>
        </p>
      </div>
    </div>
  );
}
