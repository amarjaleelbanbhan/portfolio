/**
 * A single-choice filter row.
 *
 * Implemented as a radio group rather than a row of buttons: the options are
 * mutually exclusive, so arrow keys should move between them and only the
 * active one should be a tab stop. That is what a radio group gives for free,
 * and it is the correct semantics for "pick exactly one".
 *
 * The active option is identifiable programmatically (`aria-checked`) and
 * visually by border, background and a dot — never by colour alone.
 *
 * Extracted from `/work`'s domain filters in Phase 14 so the Open Source page
 * does not grow a second, subtly different keyboard implementation. `idPrefix`
 * keeps the element ids unique when a page renders more than one group.
 */
export default function FilterChipGroup({ label, idPrefix, options, active, onChange }) {
  const move = (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const index = options.findIndex((option) => option.key === active);
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const next = options[(index + step + options.length) % options.length];
    onChange(next.key);
    document.getElementById(`${idPrefix}-${next.key}`)?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = active === option.key;
        const color = option.color ?? '#14b8a6';
        return (
          <button
            key={option.key}
            id={`${idPrefix}-${option.key}`}
            type="button"
            role="radio"
            aria-checked={isActive}
            // Only the selected option is in the tab order; arrow keys move
            // within the group, which is the standard radio-group pattern.
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.key)}
            onKeyDown={move}
            className={[
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 min-h-[44px]',
              'font-code text-xs font-semibold uppercase tracking-wider whitespace-nowrap',
              'transition-[background-color,border-color,color,box-shadow] duration-[var(--duration-normal)]',
              isActive ? 'text-slate-50' : 'text-slate-400 hover:text-slate-200',
            ].join(' ')}
            style={{
              borderColor: isActive ? color : 'rgba(255,255,255,0.10)',
              background: isActive ? `${color}1f` : 'rgba(8,12,26,0.6)',
              boxShadow: isActive ? `0 0 20px -8px ${color}` : 'none',
            }}
          >
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                background: isActive ? color : 'transparent',
                border: isActive ? 'none' : '1px solid #475569',
              }}
            />
            {option.label}
            {typeof option.count === 'number' && (
              <span className="text-[10px] font-normal text-slate-500 normal-case tracking-normal">
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
