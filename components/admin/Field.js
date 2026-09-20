/**
 * One editor field, rendered from its schema definition.
 *
 * Every type here is a real, labelled control with its error and help text
 * wired through `aria-describedby`. That is not decoration: an editor where a
 * validation message is visually adjacent but programmatically unconnected is
 * an editor a screen-reader user cannot debug.
 *
 * JSON fields deserve a note. They are edited as text because the shapes are
 * deeply nested and a generated form would be worse to use than the JSON. What
 * makes that safe is the contract: it parses, checks and **drops unknown keys**
 * on save, so nothing reaches a page that was not named in
 * `lib/cms/contracts.js`. The field shows parse errors as you type, so a
 * malformed brace is caught before the save button is ever pressed.
 */
import { useId, useMemo } from 'react';

const BASE =
  'w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors focus:border-teal-400/60';

function borderFor(hasError) {
  return hasError ? 'rgba(248,113,113,0.6)' : 'rgba(255,255,255,0.12)';
}

/** Pretty-print for editing; keep raw text while it is mid-edit and invalid. */
export function stringifyJson(value) {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return '';
  }
}

export default function Field({ field, value, onChange, error, references = [] }) {
  const id = useId();
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;
  const describedBy = [error ? errorId : null, field.help ? helpId : null].filter(Boolean).join(' ');

  // Parse errors are reported as you type, separately from save-time contract
  // errors, because they are a different problem with a different fix.
  const jsonParseError = useMemo(() => {
    if (field.type !== 'json' || typeof value !== 'string') return '';
    if (!value.trim()) return '';
    try {
      JSON.parse(value);
      return '';
    } catch (err) {
      return err.message;
    }
  }, [field.type, value]);

  const common = {
    id,
    'aria-invalid': Boolean(error) || Boolean(jsonParseError),
    'aria-describedby': describedBy || undefined,
    style: { borderColor: borderFor(error || jsonParseError) },
  };

  let control;
  switch (field.type) {
    case 'textarea':
      control = (
        <textarea
          {...common}
          rows={field.rows ?? 4}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          className={`${BASE} resize-y`}
        />
      );
      break;

    case 'json':
      control = (
        <textarea
          {...common}
          rows={field.rows ?? 10}
          spellCheck={false}
          value={stringifyJson(value)}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`${BASE} resize-y font-code text-xs leading-relaxed`}
        />
      );
      break;

    case 'select':
      control = (
        <select
          {...common}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          className={BASE}
        >
          {!field.required && <option value="">—</option>}
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
      break;

    case 'reference':
      control = (
        <select
          {...common}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value || null)}
          className={BASE}
        >
          <option value="">— none —</option>
          {references.map((row) => (
            <option key={row.id} value={row.id}>
              {row.label}
            </option>
          ))}
        </select>
      );
      break;

    case 'boolean':
      control = (
        <label className="inline-flex items-center gap-2.5 min-h-[44px] cursor-pointer">
          <input
            {...common}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
            className="h-4 w-4 accent-teal-400"
            style={undefined}
          />
          <span className="text-sm text-slate-300">{field.label}</span>
        </label>
      );
      break;

    case 'number':
      control = (
        <input
          {...common}
          type="number"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))}
          className={BASE}
        />
      );
      break;

    case 'tags':
      control = (
        <input
          {...common}
          type="text"
          value={Array.isArray(value) ? value.join(', ') : (value ?? '')}
          onChange={(event) =>
            onChange(
              event.target.value
                .split(',')
                .map((entry) => entry.trim())
                .filter(Boolean)
            )
          }
          placeholder="comma, separated"
          className={BASE}
        />
      );
      break;

    case 'date':
      control = (
        <input
          {...common}
          type="date"
          value={(value ?? '').slice(0, 10)}
          onChange={(event) => onChange(event.target.value || null)}
          className={BASE}
        />
      );
      break;

    case 'datetime':
      control = (
        <input
          {...common}
          type="datetime-local"
          value={value ? new Date(value).toISOString().slice(0, 16) : ''}
          onChange={(event) => onChange(event.target.value ? new Date(event.target.value).toISOString() : null)}
          className={BASE}
        />
      );
      break;

    case 'url':
      control = (
        <input
          {...common}
          type="url"
          inputMode="url"
          placeholder="https://"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value || null)}
          className={BASE}
        />
      );
      break;

    case 'slug':
      control = (
        <input
          {...common}
          type="text"
          spellCheck={false}
          value={value ?? ''}
          // Normalised as typed, so the database's slug constraint is never the
          // first time anyone learns about it.
          onChange={(event) =>
            onChange(
              event.target.value
                .toLowerCase()
                .replace(/[^a-z0-9-]+/g, '-')
                .replace(/-{2,}/g, '-')
            )
          }
          className={`${BASE} font-code`}
        />
      );
      break;

    default:
      control = (
        <input
          {...common}
          type="text"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          className={BASE}
        />
      );
  }

  return (
    <div>
      {field.type !== 'boolean' && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
          {field.label}
          {field.required && <span className="ml-1 text-teal-300">*</span>}
        </label>
      )}

      {control}

      {jsonParseError && (
        <p className="mt-1.5 text-xs text-amber-300 m-0">Not valid JSON yet: {jsonParseError}</p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-400 m-0">
          {error}
        </p>
      )}
      {field.help && (
        <p id={helpId} className="mt-1.5 text-xs text-slate-500 leading-relaxed m-0">
          {field.help}
        </p>
      )}
    </div>
  );
}
