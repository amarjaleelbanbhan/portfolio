import '@/styles/globals.css';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for loading screen (client-only)
const LoadingScreen = dynamic(() => import('../components/LoadingScreen'), { 
  ssr: false 
});

export default function App({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Check if we've already shown loading screen this session
    const loaded = sessionStorage.getItem('portfolio-loaded');
    if (loaded) {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('portfolio-loaded', 'true');
    setIsLoading(false);
    setHasLoaded(true);
  };

  return (
    <>
      {/* Show loading screen only on first visit */}
      {isLoading && !hasLoaded && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      
      <div className="scanlines" />
      <Component {...pageProps} />
    </>
  );
}
