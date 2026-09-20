import '@/styles/globals.css';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { MotionConfig } from 'framer-motion';
import { chromeFor, useBootAlreadyPlayed, markBootPlayed } from '@/lib/routeChrome';

const LoadingScreen = dynamic(() => import('../components/LoadingScreen'), { ssr: false });
const ParticleNetwork = dynamic(() => import('../components/ParticleNetwork'), { ssr: false });

function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setWidth(Math.min(pct, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="scroll-progress"
      style={{ width: `${width}%` }}
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  );
}

export default function App({ Component, pageProps }) {
  const { pathname } = useRouter();
  const chrome = chromeFor(pathname);
  const isPortfolio = chrome === 'portfolio';

  const bootAlreadyPlayed = useBootAlreadyPlayed();
  const [bootFinished, setBootFinished] = useState(false);
  const showBoot = isPortfolio && !bootAlreadyPlayed && !bootFinished;

  const handleLoadingComplete = () => {
    markBootPlayed();
    setBootFinished(true);
  };

  return (
    // CSS handles reduced motion for token-driven transitions, but Framer
    // Motion never reads CSS — without this, every motion component kept
    // animating for visitors who asked it not to. "user" disables transform and
    // layout animation while keeping opacity, so content still resolves to
    // visible rather than being stranded at its initial state.
    <MotionConfig reducedMotion="user">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {showBoot && <LoadingScreen onComplete={handleLoadingComplete} />}

      {isPortfolio && (
        <>
          <ParticleNetwork />
          <ScrollProgress />
          <div className="scanlines" aria-hidden="true" />
        </>
      )}

      <Component {...pageProps} />
    </MotionConfig>
  );
}
