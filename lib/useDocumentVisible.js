/**
 * Whether the tab is currently being looked at.
 *
 * Browsers already suspend requestAnimationFrame on a hidden tab, so a render
 * loop mostly stops on its own — but "mostly, as a side effect of the platform"
 * is not the same as stopping, and it is not something to rely on in a
 * background tab that a browser decides to keep warm. The WebGL scenes read
 * this directly so the pause is a property of the code rather than a
 * coincidence of the host.
 *
 * Defaults to true, so a missing Page Visibility API means work continues
 * rather than a scene that never renders.
 */
import { useEffect, useState } from 'react';

export default function useDocumentVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return visible;
}
