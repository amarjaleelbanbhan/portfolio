/** Single source of truth for the site's canonical URL (metadata, sitemap, robots). */
export const SITE_URL = "https://amarjaleel.me";

/** Default social preview image. Absolute URLs are required by OG/Twitter crawlers. */
export const OG_IMAGE = `${SITE_URL}/images/og-image.png`;

/** Builds an absolute URL for a route path (e.g. "/projects"). */
export function absoluteUrl(path = "/"): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}
