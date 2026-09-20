/**
 * Supabase connection details, in one place.
 *
 * These were hardcoded in two files, which is how a project reference ends up
 * pointing somewhere unexpected after a copy-paste. They come from the
 * environment now, with the current live values as the fallback so nothing
 * breaks before the variables are set in the hosting dashboard.
 *
 * ── On the key being in the bundle ───────────────────────────────────────────
 * `NEXT_PUBLIC_` means this ships to every visitor's browser, and that is
 * correct: a *publishable* key is designed to be public. It identifies the
 * project; it authorises nothing. Every actual permission comes from row-level
 * security, which the Phase 0.5 review verified with live probes and which the
 * Phase 19 contact test confirmed is stricter than assumed — the leads policy
 * constrains row *contents*, not just who may write.
 *
 * A **secret** key is a different thing entirely and must never appear here, in
 * any client component, in a log line, or in a commit. If a server route ever
 * needs one it reads `process.env.SUPABASE_SECRET_KEY` directly, at request
 * time, inside `pages/api/**` — never through this module, which is imported by
 * browser code.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yokgnzxwrbymarjdfyhk.supabase.co';

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_h1nOLJv7TuuOqbWkKbiMnQ_LkM8VdcX';

/** Headers for an unauthenticated (anon-role) PostgREST call. */
export function anonHeaders(extra = {}) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    ...extra,
  };
}

/** Headers for a call made as the signed-in user. */
export function authHeaders(accessToken, extra = {}) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${accessToken}`,
    ...extra,
  };
}

export const restUrl = (path) => `${SUPABASE_URL}/rest/v1/${path}`;
export const authUrl = (path) => `${SUPABASE_URL}/auth/v1/${path}`;

/**
 * `fetch`, with the one failure mode that is not an HTTP status handled.
 *
 * Every call site here shapes HTTP errors carefully and then let a rejected
 * fetch through untouched, so losing the network put the browser's own
 * "Failed to fetch" on screen as if it were an explanation. It is not one: it
 * does not say what failed, and it reads like a bug in the page rather than a
 * connection that dropped.
 *
 * The distinction is worth keeping — a request that never arrived is not a
 * request that was refused, and `unreachable` is what tells the interface to
 * say "try again" instead of signing someone out.
 */
export async function supabaseFetch(url, init) {
  try {
    return await fetch(url, init);
  } catch (cause) {
    // An aborted request is the caller's own doing, not a network failure.
    if (cause?.name === 'AbortError') throw cause;
    const error = new Error(
      'Could not reach the database. Check the connection and try again.'
    );
    error.unreachable = true;
    error.cause = cause;
    throw error;
  }
}
