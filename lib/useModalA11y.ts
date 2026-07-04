import { useEffect, useRef, type RefObject } from "react";

/**
 * Accessible modal behavior (WCAG 2.1.2 No Keyboard Trap, 2.4.3 Focus Order):
 * - moves focus into the dialog on open
 * - traps Tab/Shift+Tab within it
 * - Esc closes
 * - restores focus to the previously focused element on close
 *
 * The dialog container must have tabIndex={-1}. Visual design is untouched.
 */
export function useModalA11y(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  active = true,
) {
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    const prevFocused = document.activeElement as HTMLElement | null;

    const SEL =
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const items = () =>
      Array.from(node.querySelectorAll<HTMLElement>(SEL)).filter(
        (el) => el.offsetParent !== null,
      );

    node.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = items();
      if (focusable.length === 0) {
        e.preventDefault();
        node.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === node)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", onKey);
    return () => {
      node.removeEventListener("keydown", onKey);
      prevFocused?.focus?.();
    };
  }, [ref, active]);
}
