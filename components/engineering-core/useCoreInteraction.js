/**
 * Interaction state for the Engineering Core.
 *
 * One state object drives the 3D scene, the DOM ring and the detail panel, so a
 * domain highlighted by a mouse, a finger or the Tab key produces exactly the
 * same result everywhere. Without this the scene and the DOM would each own a
 * copy and they would disagree.
 *
 * `active` is the domain currently being shown. It is set by hover *or* focus —
 * hover is never the only route to the information (Phase 4 requirement), and
 * keyboard focus is treated as a first-class way to explore.
 *
 * `pinned` survives pointer-out. Touch devices have no hover, so a tap pins a
 * domain and its description stays readable instead of vanishing the moment the
 * finger lifts.
 */
import { useCallback, useMemo, useState } from 'react';

export const CAMERA_STATE = {
  INTRO: 'INTRO',
  IDLE: 'IDLE',
  DOMAIN_FOCUS: 'DOMAIN_FOCUS',
  RETURN: 'RETURN',
};

export default function useCoreInteraction(domains) {
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const [pinned, setPinned] = useState(null);

  // Precedence: an explicit pin wins, then keyboard focus, then hover. Focus
  // outranks hover so tabbing through the ring is not overridden by a stray
  // pointer resting somewhere else.
  const active = pinned ?? focused ?? hovered;

  const activeDomain = useMemo(
    () => domains.find((d) => d.domain === active) ?? null,
    [domains, active]
  );

  const toggle = useCallback((domain) => {
    setPinned((current) => (current === domain ? null : domain));
  }, []);

  const clear = useCallback(() => {
    setPinned(null);
    setHovered(null);
    setFocused(null);
  }, []);

  const cameraState = active ? CAMERA_STATE.DOMAIN_FOCUS : CAMERA_STATE.IDLE;

  return {
    active,
    activeDomain,
    pinned,
    cameraState,
    setHovered,
    setFocused,
    toggle,
    clear,
    /** True when something is highlighted, so others can dim. */
    hasSelection: Boolean(active),
  };
}
