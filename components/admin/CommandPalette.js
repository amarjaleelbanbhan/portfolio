/**
 * The command palette.
 *
 * ⌘K / Ctrl-K from anywhere in the control centre. It exists because a sidebar
 * with fourteen destinations is a scanning problem, and because the fastest
 * route between two editors should not go through the mouse.
 *
 * Deliberately a real dialog: focus moves in on open and returns to whatever
 * opened it on close, Escape closes, Tab is trapped, and the listbox follows
 * the ARIA combobox pattern so a screen reader announces the highlighted option
 * rather than silently changing what Enter will do.
 *
 * Matching is subsequence-based — "opsr" finds "Open Source" — because exact
 * prefix matching makes a palette feel broken the first time you mistype.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ADMIN_SECTIONS } from '@/lib/admin/navigation';

/** True when every character of `query` appears in `text`, in order. */
function subsequenceScore(text, query) {
  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();
  if (!needle) return 0;

  let index = 0;
  let score = 0;
  let streak = 0;
  for (const char of needle) {
    const found = haystack.indexOf(char, index);
    if (found === -1) return -1;
    // Consecutive matches and word-start matches rank higher, so "os" prefers
    // "Open Source" over "Projects".
    streak = found === index ? streak + 1 : 0;
    if (found === 0 || haystack[found - 1] === ' ') score += 3;
    score += 1 + streak;
    index = found + 1;
  }
  return score;
}

export default function CommandPalette({ open, onClose, actions = [] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const returnFocusTo = useRef(null);

  const items = useMemo(
    () => [
      ...ADMIN_SECTIONS.map((section) => ({
        id: `go-${section.id}`,
        label: section.label,
        hint: section.description,
        group: 'Go to',
        run: () => router.push(section.href),
      })),
      ...actions,
    ],
    [actions, router]
  );

  const results = useMemo(() => {
    if (!query.trim()) return items.slice(0, 12);
    return items
      .map((item) => ({ item, score: Math.max(subsequenceScore(item.label, query), subsequenceScore(item.hint ?? '', query) - 4) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((entry) => entry.item);
  }, [items, query]);

  // Reset the highlight by adjusting state during render — the pattern React
  // documents for "reset state when a value changes", and the one the site's
  // Navbar already uses. An effect would paint the stale highlight first.
  const [lastKey, setLastKey] = useState(`${open}|${query}`);
  const key = `${open}|${query}`;
  if (lastKey !== key) {
    setLastKey(key);
    setActive(0);
  }

  useEffect(() => {
    if (!open) return undefined;
    returnFocusTo.current = document.activeElement;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const close = useCallback(() => {
    setQuery('');
    onClose();
    // Put focus back where it came from; a dialog that drops focus on the body
    // leaves a keyboard user at the top of the document.
    const target = returnFocusTo.current;
    if (target && typeof target.focus === 'function') {
      requestAnimationFrame(() => target.focus());
    }
  }, [onClose]);

  const choose = useCallback(
    (item) => {
      close();
      item?.run?.();
    },
    [close]
  );

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((current) => (results.length ? (current + 1) % results.length : 0));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((current) => (results.length ? (current - 1 + results.length) % results.length : 0));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      choose(results[active]);
      return;
    }
    if (event.key === 'Tab') {
      // The only focusable thing is the input, so keep it there rather than
      // letting Tab escape to the page behind the overlay.
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      // Clicking the backdrop closes; clicking the panel must not.
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-xl rounded-xl border border-white/12 bg-[#0b1524] shadow-2xl shadow-black/60 overflow-hidden"
      >
        <div className="border-b border-white/8 px-4">
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-results"
            aria-activedescendant={results[active] ? `command-option-${results[active].id}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search sections and actions…"
            className="w-full bg-transparent py-4 text-base text-slate-100 placeholder-slate-600 outline-none"
          />
        </div>

        <ul
          id="command-palette-results"
          role="listbox"
          aria-label="Results"
          ref={listRef}
          className="max-h-[50vh] list-none overflow-y-auto m-0 p-1.5"
        >
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-slate-500">Nothing matches that.</li>
          )}
          {results.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                id={`command-option-${item.id}`}
                role="option"
                aria-selected={index === active}
                data-active={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(item)}
                className="flex w-full items-baseline gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                style={{
                  background: index === active ? 'rgba(20,184,166,0.12)' : 'transparent',
                  color: index === active ? '#f1f5f9' : '#cbd5e1',
                }}
              >
                <span className="font-code text-[10px] uppercase tracking-wider text-slate-600 shrink-0 w-12">
                  {item.group}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm">{item.label}</span>
                  {item.hint && (
                    <span className="block text-xs text-slate-500 leading-snug mt-0.5">{item.hint}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="border-t border-white/8 px-4 py-2 font-code text-[10px] text-slate-600 m-0">
          ↑↓ to move · ⏎ to open · esc to close
        </p>
      </div>
    </div>
  );
}
