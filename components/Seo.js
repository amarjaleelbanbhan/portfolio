import Head from 'next/head';
import { useRouter } from 'next/router';
import { OG_IMAGE, absoluteUrl } from '@/lib/site';

/**
 * Per-page metadata. This is the only place title/description/canonical/OG tags
 * are emitted — _document.js carries just the site-wide invariants (icons,
 * fonts, JSON-LD) so no page ends up with duplicate or conflicting tags.
 *
 * `path` defaults to the current route, which keeps the canonical honest for
 * every page without each one repeating its own URL.
 */
export default function Seo({
  title,
  description,
  path,
  image = OG_IMAGE,
  type = 'website',
  noindex = false,
}) {
  const { pathname } = useRouter();
  const url = absoluteUrl(path ?? pathname);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* No canonical on excluded pages — /404 would point at a URL that 404s. */}
      {!noindex && <link rel="canonical" href={url} />}
      <meta
        name="robots"
        content={noindex ? 'noindex,nofollow,noarchive' : 'index,follow'}
      />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Amar Jaleel" />
      <meta property="og:locale" content="en_US" />

      {/* No twitter:site/creator — the @ajbanbhan handle does not exist. */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}
