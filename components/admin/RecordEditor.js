/**
 * The editor every CMS table shares.
 *
 * Driven entirely by the table's schema, so a new field is a line in
 * `lib/cms/schemas.js` rather than a new screen.
 *
 * ── Publishing is separate from saving ───────────────────────────────────────
 * Two distinct actions, deliberately. Saving a draft should never be one
 * mis-click away from putting something on the public site, and publishing
 * moves `is_published` and `published_at` together — which is the whole reason
 * it is a function in `lib/cms/client.js` rather than a checkbox here. The
 * header states what the public can actually see, computed with the same
 * predicate the database applies, so a record that is flagged published with no
 * date reads as "not public" instead of looking fine.
 *
 * ── Unsaved work ─────────────────────────────────────────────────────────────
 * A dirty form warns before the tab closes. Losing twenty minutes of a case
 * study to a stray ⌘W is the kind of thing that makes someone stop using a CMS.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Field, { stringifyJson } from '@/components/admin/Field';
import { SLUG_RE } from '@/lib/cms/contracts';
import { isPubliclyVisible, visibilityLabel } from '@/lib/cms/client';

/** Parse the JSON fields and run their contracts. Returns value + errors. */
function applyContracts(schema, draft) {
  const record = { ...draft };
  const errors = {};

  for (const field of schema.fields) {
    if (field.type !== 'json') continue;
    const raw = record[field.name];

    if (typeof raw === 'string') {
      if (!raw.trim()) {
        record[field.name] = Array.isArray(draft[field.name]) ? [] : {};
        continue;
      }
      try {
        record[field.name] = JSON.parse(raw);
      } catch (err) {
        errors[field.name] = `That is not valid JSON: ${err.message}`;
        continue;
      }
    }

    if (field.contract) {
      const result = field.contract(record[field.name]);
      record[field.name] = result.value;
      for (const [key, message] of Object.entries(result.errors ?? {})) {
        // Contract errors are keyed by path; surface them against the field so
        // the editor can point at the right box.
        errors[field.name] = errors[field.name] ? `${errors[field.name]} ${message}` : `${key}: ${message}`;
      }
    }
  }

  for (const field of schema.fields) {
    const value = record[field.name];
    if (field.required && (value === null || value === undefined || value === '')) {
      errors[field.name] = `${field.label} is required.`;
    }
    if (field.type === 'slug' && value && !SLUG_RE.test(value)) {
      errors[field.name] = 'Lowercase letters, numbers and single hyphens only.';
    }
    if (field.type === 'url' && value) {
      try {
        const url = new URL(value);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocol');
      } catch {
        errors[field.name] = 'That needs to be a full http(s) URL.';
      }
    }
  }

  Object.assign(errors, schema.validate?.(record) ?? {});
  return { record, errors };
}

export default function RecordEditor({ schema, cms, recordId, onSaved }) {
  const router = useRouter();
  const isNew = recordId === 'new';

  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(isNew ? 'ready' : 'loading');
  const [message, setMessage] = useState('');
  const [references, setReferences] = useState([]);
  const firstErrorRef = useRef(null);

  // ── Load ──
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(async () => {
      // Reference options for any `reference` field.
      const referenceFields = schema.fields.filter((field) => field.type === 'reference');
      if (referenceFields.length) {
        try {
          const field = referenceFields[0];
          const rows = await cms.list(field.referenceTable, {
            select: `id,${field.referenceLabel}`,
            order: `${field.referenceLabel}.asc`,
            limit: '200',
          });
          if (!cancelled) {
            setReferences(rows.map((row) => ({ id: row.id, label: row[field.referenceLabel] })));
          }
        } catch {
          // A missing option list must not block editing the rest.
        }
      }

      if (isNew) return;
      try {
        const row = await cms.getOne(schema.table, { id: `eq.${recordId}` });
        if (cancelled) return;
        if (!row) {
          setStatus('missing');
          return;
        }
        const editable = { ...row };
        for (const field of schema.fields) {
          if (field.type === 'json') editable[field.name] = stringifyJson(row[field.name]);
        }
        setDraft(editable);
        setSaved(row);
        setStatus('ready');
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setMessage(err.message);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [cms, isNew, recordId, schema]);

  // A new record starts from the schema's defaults.
  useEffect(() => {
    if (!isNew || draft) return undefined;
    let cancelled = false;
    Promise.resolve().then(async () => {
      const { emptyRecord } = await import('@/lib/cms/schemas');
      if (cancelled) return;
      const blank = emptyRecord(schema);
      for (const field of schema.fields) {
        if (field.type === 'json') blank[field.name] = stringifyJson(blank[field.name]);
      }
      setDraft(blank);
    });
    return () => {
      cancelled = true;
    };
  }, [draft, isNew, schema]);

  const dirty = useMemo(() => {
    if (!draft) return false;
    if (isNew) return Object.values(draft).some((value) => value && JSON.stringify(value) !== '{}' && JSON.stringify(value) !== '[]');
    if (!saved) return false;
    return schema.fields.some((field) => {
      const current = field.type === 'json' ? draft[field.name] : draft[field.name];
      const original = field.type === 'json' ? stringifyJson(saved[field.name]) : saved[field.name];
      return JSON.stringify(current ?? null) !== JSON.stringify(original ?? null);
    });
  }, [draft, isNew, saved, schema]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = useCallback((name, value) => {
    setDraft((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  }, []);

  async function save(event) {
    event?.preventDefault();
    if (status === 'saving') return;

    const { record, errors: found } = applyContracts(schema, draft);
    const real = Object.fromEntries(Object.entries(found).filter(([, value]) => value));
    if (Object.keys(real).length > 0) {
      setErrors(real);
      setMessage('Check the highlighted fields.');
      requestAnimationFrame(() => firstErrorRef.current?.scrollIntoView({ block: 'center' }));
      return;
    }

    setStatus('saving');
    setMessage('');
    setErrors({});

    // Only the schema's own columns are sent. Row metadata — id, created_at,
    // updated_at, published state — is never written from the form: updated_at
    // is a trigger's job and publishing is a separate action.
    const payload = {};
    for (const field of schema.fields) payload[field.name] = record[field.name];

    try {
      const result = isNew
        ? await cms.create(schema.table, payload, { entityLabel: record[schema.titleField] })
        : await cms.update(schema.table, { id: `eq.${recordId}` }, payload, {
            entityLabel: record[schema.titleField],
          });

      setSaved(result);
      const editable = { ...result };
      for (const field of schema.fields) {
        if (field.type === 'json') editable[field.name] = stringifyJson(result[field.name]);
      }
      setDraft(editable);
      setStatus('ready');
      setMessage('Saved.');
      onSaved?.(result);

      if (isNew && result?.id) {
        router.replace(`/admin/${schema.section}/${result.id}`, undefined, { shallow: true });
      }
    } catch (err) {
      setStatus('ready');
      setMessage(err.message);
    }
  }

  async function togglePublish() {
    if (!saved?.id) return;
    const next = !isPubliclyVisible(saved);
    setStatus('saving');
    setMessage('');
    try {
      const row = await cms.publish(schema.table, { id: `eq.${saved.id}` }, next, {
        entityLabel: saved[schema.titleField],
      });
      setSaved(row);
      setStatus('ready');
      setMessage(next ? 'Published. It is live now.' : 'Unpublished. It is no longer public.');
    } catch (err) {
      setStatus('ready');
      setMessage(err.message);
    }
  }

  async function remove() {
    if (!saved?.id) return;
    // A deliberate, typed confirmation. A one-click delete on a case study that
    // took a week to write is not a feature.
    const typed = window.prompt(
      `Deleting "${saved[schema.titleField] ?? saved.id}" cannot be undone. Type DELETE to confirm.`
    );
    if (typed !== 'DELETE') return;

    setStatus('saving');
    try {
      await cms.remove(schema.table, { id: `eq.${saved.id}` }, { entityLabel: saved[schema.titleField] });
      router.push(`/admin/${schema.section}`);
    } catch (err) {
      setStatus('ready');
      setMessage(err.message);
    }
  }

  if (status === 'loading') return <p className="text-sm text-slate-500">Loading…</p>;
  if (status === 'missing') return <p className="text-sm text-slate-400">That record does not exist.</p>;
  if (!draft) return <p className="text-sm text-slate-500">Loading…</p>;

  const live = saved ? isPubliclyVisible(saved) : false;
  const firstErrorField = schema.fields.find((field) => errors[field.name])?.name;

  return (
    <form onSubmit={save} className="max-w-3xl">
      {/* ── Publish state and actions ── */}
      {!isNew && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-4">
          <span
            className="inline-flex items-center gap-2 font-code text-[11px] uppercase tracking-wider"
            style={{ color: live ? '#22c55e' : '#94a3b8' }}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: live ? '#22c55e' : 'transparent', border: live ? 'none' : '1px solid #64748b' }}
            />
            {visibilityLabel(saved)}
          </span>

          <button
            type="button"
            onClick={togglePublish}
            disabled={status === 'saving'}
            className="rounded-lg border px-3 min-h-[40px] text-xs font-semibold transition-colors disabled:opacity-60"
            style={{
              borderColor: live ? 'rgba(248,113,113,0.4)' : 'rgba(34,197,94,0.4)',
              color: live ? '#fca5a5' : '#86efac',
            }}
          >
            {live ? 'Unpublish' : 'Publish'}
          </button>

          <button
            type="button"
            onClick={remove}
            disabled={status === 'saving'}
            className="ml-auto rounded-lg px-3 min-h-[40px] text-xs text-slate-500 transition-colors hover:text-red-300 disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      )}

      <div className="space-y-5">
        {schema.fields.map((field) => (
          <div key={field.name} ref={field.name === firstErrorField ? firstErrorRef : undefined}>
            <Field
              field={field}
              value={draft[field.name]}
              onChange={(value) => set(field.name, value)}
              error={errors[field.name]}
              references={references}
            />
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center gap-3 border-t border-white/8 bg-[#060d18]/95 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={status === 'saving'}
          aria-busy={status === 'saving'}
          className="rounded-lg bg-teal-400 px-5 py-2.5 min-h-[44px] text-sm font-semibold text-[#06121f] transition-colors hover:bg-teal-300 disabled:opacity-60"
        >
          {status === 'saving' ? 'Saving…' : isNew ? 'Create' : 'Save changes'}
        </button>

        {dirty && <span className="font-code text-[11px] text-amber-300">unsaved changes</span>}

        <div role="status" aria-live="polite" className="min-w-0 flex-1">
          {message && <p className="truncate text-sm text-slate-400 m-0">{message}</p>}
        </div>
      </div>
    </form>
  );
}
