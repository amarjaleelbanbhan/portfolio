import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="description" content="Amar Jaleel - Full-Stack Developer, AI & Cybersecurity Enthusiast. Building Tomorrow's Solutions Today." />
        <meta name="keywords" content="Amar Jaleel, Full-Stack Developer, AI, Cybersecurity, Data Analytics, Portfolio, Web Developer, Pakistan" />
        <meta name="author" content="Amar Jaleel" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Amar Jaleel | Full-Stack Developer" />
        <meta property="og:description" content="Full-Stack Tech Enthusiast specializing in AI, Cybersecurity & Data Analytics. Building Tomorrow's Solutions Today." />
        <meta property="og:image" content="/images/og-image.png" />
        <meta property="og:site_name" content="Amar Jaleel Portfolio" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Amar Jaleel | Full-Stack Developer" />
        <meta name="twitter:description" content="Full-Stack Tech Enthusiast specializing in AI, Cybersecurity & Data Analytics." />
        <meta name="twitter:image" content="/images/og-image.png" />
        <meta name="twitter:creator" content="@ajbanbhan" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </Head>
      <body className="bg-midnight text-white antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
