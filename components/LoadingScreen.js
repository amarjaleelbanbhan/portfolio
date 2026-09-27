import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './LoadingScreen.module.css';

const DURATION = 7800;
const EXIT_DURATION = 550;
const diagnostics = [
  { command: 'verify --display', check: () => window.matchMedia('(min-width: 0px)').matches },
  { command: 'verify --assets', check: async () => {
    const image = new Image();
    image.src = '/images/intro-amar-room.webp';
    await image.decode();
    return image.naturalWidth > 0;
  } },
  { command: 'verify --fonts', check: async () => {
    await document.fonts.ready;
    return document.fonts.status === 'loaded';
  } },
  { command: 'verify --portfolio', check: () => Boolean(document.querySelector('main')) },
];

/** A continuous illustrated scene; the boot readout performs browser checks. */
export default function LoadingScreen({ onComplete }) {
  const [leaving, setLeaving] = useState(false);
  const [lines, setLines] = useState([]);
  const skipRef = useRef(null);
  const finished = useRef(false);
  const timers = useRef([]);
  const complete = useRef(onComplete);

  useEffect(() => { complete.current = onComplete; }, [onComplete]);

  const finish = useCallback((immediate = false) => {
    if (finished.current) return;
    finished.current = true;
    timers.current.forEach(clearTimeout);
    if (immediate) complete.current();
    else {
      setLeaving(true);
      timers.current.push(setTimeout(() => complete.current(), EXIT_DURATION));
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const timer = setTimeout(() => finish(true), 0);
      return () => clearTimeout(timer);
    }
    let active = true;
    const scheduled = timers.current;
    skipRef.current?.focus({ preventScroll: true });
    diagnostics.forEach(({ command, check }, index) => {
      scheduled.push(setTimeout(async () => {
        if (!active || finished.current) return;
        setLines((current) => [...current, { command, status: 'RUNNING' }]);
        try {
          const result = await check();
          if (active && !finished.current) setLines((current) => current.map((line) =>
            line.command === command ? { command, status: result ? 'OK' : 'WAIT' } : line));
        } catch {
          if (active && !finished.current) setLines((current) => current.map((line) =>
            line.command === command ? { command, status: 'WAIT' } : line));
        }
      }, 3000 + index * 590));
    });
    scheduled.push(setTimeout(() => finish(), DURATION));
    const onKeyDown = (event) => {
      if (event.key === 'Escape') finish(true);
      if (event.key === 'Tab') {
        event.preventDefault();
        skipRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      active = false;
      window.removeEventListener('keydown', onKeyDown);
      scheduled.forEach(clearTimeout);
    };
  }, [finish]);

  const readout = (
    <div className={styles.terminal}>
      <div className={styles.terminalHead}>AMAR / STARTUP <span className={styles.cursor}>_</span></div>
      <div className={styles.log}>
        {lines.map(({ command, status }) => (
          <div key={command} className={styles.logLine}>
            <span><span className={styles.prompt}>$</span> {command}</span>
            <span className={status === 'OK' ? styles.ok : styles.pending}>{status}</span>
          </div>
        ))}
      </div>
      <span className={styles.terminalFoot}>portfolio://amarjaleel.me</span>
    </div>
  );

  return (
    <div className={`${styles.scene} ${leaving ? styles.leaving : ''}`} role="dialog" aria-modal="true" aria-label="Portfolio opening">
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.room} />
        <div className={styles.character}>
          <div className={styles.base} />
          <div className={styles.walk} />
          <div className={styles.press} />
        </div>
        <div className={styles.deskForeground} />
        <div className={styles.powerLight} />
        <div className={styles.monitor}>{readout}</div>
        <div className={styles.screenGlow} />
      </div>
      <div className={styles.topline}>
        <span className={styles.brand}>AMAR JALEEL <span aria-hidden="true">✳</span> PORTFOLIO</span>
        <button ref={skipRef} type="button" className={styles.skip} onClick={() => finish(true)}>Skip intro <span aria-hidden="true">↗</span></button>
      </div>
      <div className={styles.mobileReadout} aria-hidden="true">{readout}</div>
      <div className={styles.progress} aria-hidden="true"><span /></div>
    </div>
  );
}
