/**
 * Admin session handling.
 *
 * Extracted from `/studio/admin` so the new control centre does not grow a
 * second, subtly different copy of it — and so the three things that were
 * missing can be added once rather than twice.
 *
 * ── What was missing ─────────────────────────────────────────────────────────
 * 1. **Refresh.** The old session simply expired and dumped you back at the
 *    sign-in form mid-task. There is a refresh token in the response; it was
 *    stored and never used.
 * 2. **An authorisation check.** A valid Supabase session only proves the
 *    person signed in, not that they are an admin. Authorisation lived entirely
 *    in row-level security, so a non-admin who signed in would reach the
 *    interface and find every panel empty — which looks like a bug rather than
 *    a refusal. `portfolio_admins` is now checked explicitly, so the UI can say
 *    no properly.
 * 3. **Server-side sign-out.** Clearing local storage leaves the refresh token
 *    valid until it expires. Logout now calls the auth endpoint too.
 *
 * ── Storage ──────────────────────────────────────────────────────────────────
 * `sessionStorage`, not `localStorage`: the session dies with the tab, which is
 * the right default for an admin surface on a possibly-shared machine. It is
 * readable by any script on the origin, so it is only as safe as the site's XSS
 * posture — which is why nothing here is treated as a substitute for RLS. The
 * database is the boundary; this is convenience.
 *
 * Tokens are never logged. Every error path below reports a message, never the
 * response body of an auth call.
 */
import { SUPABASE_PUBLISHABLE_KEY, authUrl, authHeaders, restUrl } from '@/lib/supabase';

const SESSION_KEY = 'ads-admin-session';

/** Refresh this many seconds before expiry, so a request never races it. */
const REFRESH_MARGIN_S = 120;

function read() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw);
    if (!stored?.access_token || !stored?.expires_at) return null;
    return stored;
  } catch {
    return null;
  }
}

function write(session) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // A private-mode browser with storage disabled still works for this tab;
    // the session just lives in React state until reload.
  }
}

export function clearStoredSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* nothing to clear */
  }
}

function shape(data) {
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? '',
    expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
    user: data.user ?? null,
  };
}

/**
 * The session in storage, plus whatever arrived in the URL fragment.
 *
 * Supabase magic links and recovery links return tokens in the hash. They are
 * consumed and stripped immediately — a URL with an access token in it gets
 * copied, pasted into chat, and stored in history.
 */
export function restoreSession() {
  if (typeof window === 'undefined') return null;

  try {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const accessToken = hash.get('access_token');
    if (accessToken) {
      const session = shape({
        access_token: accessToken,
        refresh_token: hash.get('refresh_token') || '',
        expires_in: Number(hash.get('expires_in') || 3600),
      });
      write(session);
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      return session;
    }
  } catch {
    /* a malformed fragment is not a session */
  }

  const stored = read();
  if (!stored) return null;
  if (stored.expires_at * 1000 <= Date.now()) {
    clearStoredSession();
    return null;
  }
  return stored;
}

export async function signIn(email, password) {
  const response = await fetch(`${authUrl('token')}?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: String(email).trim(), password }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data?.access_token) {
    // Deliberately not surfacing the raw auth error: "Invalid login
    // credentials" is all a sign-in form should ever say, whether the address
    // is unknown or the password is wrong.
    throw new Error(
      response.status === 400 || response.status === 401
        ? 'Those credentials were not accepted.'
        : 'Sign-in failed. Try again in a moment.'
    );
  }

  const session = shape(data);
  write(session);
  return session;
}

/**
 * Exchange the refresh token for a new access token.
 *
 * Returns null when the refresh itself is refused, which means the session is
 * genuinely over — a revoked or expired refresh token cannot be recovered from,
 * and retrying only produces the same answer more slowly.
 */
export async function refreshSession(session) {
  if (!session?.refresh_token) return null;

  try {
    const response = await fetch(`${authUrl('token')}?grant_type=refresh_token`, {
      method: 'POST',
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data?.access_token) return null;

    const next = shape(data);
    write(next);
    return next;
  } catch {
    return null;
  }
}

/** True when the token is close enough to expiry to be worth replacing. */
export function needsRefresh(session) {
  if (!session?.expires_at) return false;
  return session.expires_at - REFRESH_MARGIN_S <= Math.floor(Date.now() / 1000);
}

export async function signOut(session) {
  if (session?.access_token) {
    try {
      // Revoke server-side too. Clearing storage alone leaves the refresh token
      // usable until it expires on its own.
      await fetch(authUrl('logout'), {
        method: 'POST',
        headers: authHeaders(session.access_token),
      });
    } catch {
      // A failed revoke must not strand someone in a signed-in interface.
    }
  }
  clearStoredSession();
}

/**
 * Whether this session belongs to an authorised admin.
 *
 * A valid Supabase session proves someone signed in; it does not make them an
 * admin. `portfolio_admins` is the membership record, and its own RLS means a
 * non-admin reading it gets nothing back — so an empty result is a "no", not an
 * error, and the interface can say so plainly instead of rendering empty panels
 * that look broken.
 *
 * Returns `{ authorised, reachable }`. The distinction matters: a network
 * failure is not a refusal, and treating it as one would sign someone out for
 * having bad wifi.
 */
export async function checkAdminMembership(accessToken) {
  try {
    const response = await fetch(`${restUrl('portfolio_admins')}?select=*&limit=1`, {
      headers: authHeaders(accessToken),
    });

    if (response.status === 401 || response.status === 403) {
      return { authorised: false, reachable: true };
    }
    if (!response.ok) {
      return { authorised: false, reachable: false };
    }

    const rows = await response.json();
    return { authorised: Array.isArray(rows) && rows.length > 0, reachable: true };
  } catch {
    return { authorised: false, reachable: false };
  }
}
