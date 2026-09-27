import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './LoadingScreen.module.css';

const DURATION = 4300;
const EXIT_DURATION = 350;

/** A short illustrated scene, then a camera move into the live homepage. */
export default function LoadingScreen({ onComplete }) {
  const [leaving, setLeaving] = useState(false);
  const skipRef = useRef(null);
  const finished = useRef(false);
  const sceneTimer = useRef(null);
  const exitTimer = useRef(null);
  const complete = useRef(onComplete);

  useEffect(() => {
    complete.current = onComplete;
  }, [onComplete]);

  const finish = useCallback((immediate = false) => {
    if (finished.current) return;
    finished.current = true;
    clearTimeout(sceneTimer.current);
    if (immediate) {
      complete.current();
    } else {
      setLeaving(true);
      exitTimer.current = setTimeout(() => complete.current(), EXIT_DURATION);
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const reducedMotionTimer = setTimeout(() => finish(true), 0);
      return () => clearTimeout(reducedMotionTimer);
    }

    skipRef.current?.focus({ preventScroll: true });
    sceneTimer.current = setTimeout(() => finish(), DURATION);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') finish(true);
      if (event.key === 'Tab') {
        event.preventDefault();
        skipRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      clearTimeout(sceneTimer.current);
      clearTimeout(exitTimer.current);
    };
  }, [finish]);

  return (
    <div className={`${styles.scene} ${leaving ? styles.leaving : ''}`} role="dialog" aria-modal="true" aria-label="Portfolio opening">
      <div className={styles.art} aria-hidden="true">
        {/* The illustration is decorative; the live portfolio supplies the content. */}
        <div className={styles.approach} />
        <div className={styles.image} />
        <span className={styles.powerLight} />
        <span className={styles.screenLight} />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.topline}>
        <span className={styles.brand}>AMAR JALEEL <span aria-hidden="true">✳</span> PORTFOLIO</span>
        <button ref={skipRef} type="button" className={styles.skip} onClick={() => finish(true)}>
          Skip intro <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className={styles.caption}>
        <span className={styles.line} />
        <p>One idea. One switch. A world of work.</p>
      </div>
      <div className={styles.progress} aria-hidden="true"><span /></div>
    </div>
  );
}
