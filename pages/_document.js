import { Html, Head, Main, NextScript } from 'next/document';
import { SITE_URL } from '@/lib/site';

/**
 * Site-wide invariants only. Anything that varies per page — title,
 * description, canonical, robots, Open Graph — lives in <Seo /> so pages never
 * emit duplicate or conflicting tags.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="author" content="Amar Jaleel" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Fonts — preconnect first */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Amar Jaleel',
              url: SITE_URL,
              jobTitle: 'AI Product Engineer',
              description: 'Full-Stack Developer specializing in AI, Cybersecurity, and Data Analytics.',
              alumniOf: { '@type': 'CollegeOrUniversity', name: 'Sukkur IBA University' },
              sameAs: [
                'https://www.linkedin.com/in/amarjaleel/',
                'https://github.com/amarjaleelbanbhan',
                'https://twitter.com/ajbanbhan',
              ],
            }),
          }}
        />
      </Head>
      <body className="bg-midnight text-white antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
