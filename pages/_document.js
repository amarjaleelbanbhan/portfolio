import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f172a" />

        {/* Primary */}
        <meta name="description" content="Amar Jaleel — AI Product Engineer & Full-Stack Developer specializing in AI, Cybersecurity, and Data Analytics. Based in Pakistan, open to opportunities." />
        <meta name="keywords" content="Amar Jaleel, AI Engineer, Full-Stack Developer, Cybersecurity, Data Analytics, Python, Next.js, Portfolio, Pakistan, Sukkur IBA" />
        <meta name="author" content="Amar Jaleel" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://amarjaleel.dev" />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://amarjaleel.dev" />
        <meta property="og:title"       content="Amar Jaleel | AI Engineer & Full-Stack Developer" />
        <meta property="og:description" content="AI Product Engineer specializing in Cybersecurity & Data Analytics. Building Tomorrow's Solutions Today." />
        <meta property="og:image"       content="/images/og-image.png" />
        <meta property="og:site_name"   content="Amar Jaleel Portfolio" />
        <meta property="og:locale"      content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@ajbanbhan" />
        <meta name="twitter:creator"     content="@ajbanbhan" />
        <meta name="twitter:title"       content="Amar Jaleel | AI Engineer & Full-Stack Developer" />
        <meta name="twitter:description" content="AI Product Engineer specializing in Cybersecurity & Data Analytics." />
        <meta name="twitter:image"       content="/images/og-image.png" />

        {/* Favicon */}
        <link rel="icon"              href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon"              href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon"  href="/apple-touch-icon.png" />

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
              url: 'https://amarjaleel.dev',
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
