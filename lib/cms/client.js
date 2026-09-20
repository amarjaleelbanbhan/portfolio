/**
 * The CMS data layer.
 *
 * Every admin read and write goes through here. That is the point: audit
 * logging, the publish rule, error shaping and session refresh are decided
 * once, so a new editor screen cannot forget any of them.
 *
 * ── The publish rule ─────────────────────────────────────────────────────────
 * Anonymous reads require, on all seven published-content tables:
 *
 *     is_published = true AND published_at IS NOT NULL AND published_at <= now()
 *
 * **Setting `is_published` alone does nothing.** That is a genuinely easy way to
 * ship a record that the admin shows as live and the public site never renders,
 * so publishing is a single function here (`publish`) rather than a checkbox
 * each screen sets for itself. Unpublishing clears `published_at` too, so the
 * two columns can never disagree.
 *
 * ── Audit ────────────────────────────────────────────────────────────────────
 * Writes append to `admin_audit_log`. The log is append-only at the database
 * level and the client supplies its own `auth.uid()` as `actor_id`, which the
 * policy requires. Worth being precise about what that buys: this is a record
 * of what the admin interface did, not tamper-proof evidence of every statement
 * the database saw. A determined client could skip it. Real guarantees need
 * triggers, which is a schema change and is written up rather than assumed.
 *
 * An audit failure never fails the operation it describes — losing the edit
 * because the log was unreachable would be worse than losing the log line.
 */
import { authHeaders, restUrl, supabaseFetch } from '@/lib/supabase';
import { needsRefresh, refreshSession } from '@/lib/admin/session';
import { validateAuditDetail } from '@/lib/cms/contracts';

/** Tables whose public visibility is governed by the publish rule. */
export const PUBLISHABLE_TABLES = [
  'portfolio_projects',
  'technologies',
  'research_projects',
  'open_source_contributions',
  'credentials',
  'experience',
  'site_content',
];

export class CmsError extends Error {
  constructor(message, { status = 0, code = '', hint = '' } = {}) {
    super(message);
    this.name = 'CmsError';
    this.status = status;
    this.code = code;
    this.hint = hint;
  }
}

/**
 * Turn a PostgREST failure into something an editor can act on.
 *
 * The raw messages are accurate and unreadable. These are the ones that
 * actually happen, mapped to what the person should do about them.
 */
async function toError(response) {
  let body = {};
  try {
    body = await response.json();
  } catch {
    /* some failures have no JSON body */
  }
  const code = body?.code ?? '';
  const raw = body?.message ?? '';

  if (response.status === 401 || response.status === 403 || code === '42501') {
    return new CmsError(
      'The database refused that — either the session expired or the row-level security policy does not allow it.',
      { status: response.status, code, hint: raw }
    );
  }
  if (code === '23505') {
    return new CmsError('Something with that identifier already exists. Slugs and URLs have to be unique.', {
      status: response.status,
      code,
      hint: raw,
    });
  }
  if (code === '23514') {
    return new CmsError('A value is outside what the database allows for that column.', {
      status: response.status,
      code,
      hint: raw,
    });
  }
  if (code === '23503') {
    return new CmsError('That references a record that does not exist. Save the parent first.', {
      status: response.status,
      code,
      hint: raw,
    });
  }
  return new CmsError(raw || `The request failed (${response.status}).`, {
    status: response.status,
    code,
    hint: raw,
  });
}

/**
 * A live session handle.
 *
 * Holds the current session and refreshes it in place, so a long editing
 * session does not fail its next save at the moment the token expires.
 */
export function createCms(getSession, setSession) {
  async function token() {
    const session = getSession();
    if (!session?.access_token) throw new CmsError('Not signed in.', { status: 401 });
    if (!needsRefresh(session)) return session.access_token;

    const refreshed = await refreshSession(session);
    if (!refreshed) {
      setSession(null);
      throw new CmsError('The session expired. Sign in again.', { status: 401 });
    }
    setSession(refreshed);
    return refreshed.access_token;
  }

  async function request(path, { method = 'GET', body, prefer, signal } = {}) {
    const accessToken = await token();
    const headers = authHeaders(accessToken, {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(prefer ? { Prefer: prefer } : {}),
    });

    const response = await supabaseFetch(restUrl(path), {
      method,
      headers,
      signal,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) throw await toError(response);
    if (response.status === 204) return null;

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  /**
   * Append an audit line. Never throws — see the module note.
   */
  async function audit(action, entityType, entityId, detail = {}) {
    try {
      const session = getSession();
      const actorId = session?.user?.id;
      if (!actorId) return;
      await request('admin_audit_log', {
        method: 'POST',
        prefer: 'return=minimal',
        body: {
          actor_id: actorId,
          action,
          entity_type: entityType,
          entity_id: String(entityId ?? ''),
          detail: validateAuditDetail(detail).value,
        },
      });
    } catch {
      // Deliberately swallowed. Losing an edit because the audit log was
      // unreachable is worse than losing the audit line.
    }
  }

  return {
    request,
    audit,

    /** Rows from a table, with PostgREST query parameters. */
    async list(table, params = {}) {
      const query = new URLSearchParams(params).toString();
      return (await request(`${table}${query ? `?${query}` : ''}`)) ?? [];
    },

    async getOne(table, match, select = '*') {
      const query = new URLSearchParams({ select, limit: '1', ...match }).toString();
      const rows = (await request(`${table}?${query}`)) ?? [];
      return rows[0] ?? null;
    },

    async create(table, row, { entityLabel } = {}) {
      const [created] = await request(table, {
        method: 'POST',
        prefer: 'return=representation',
        body: row,
      });
      await audit('create', table, created?.id ?? created?.slug ?? '', {
        label: entityLabel ?? created?.title ?? created?.slug ?? '',
      });
      return created;
    },

    async update(table, match, patch, { entityLabel } = {}) {
      const query = new URLSearchParams(match).toString();
      const [updated] = (await request(`${table}?${query}`, {
        method: 'PATCH',
        prefer: 'return=representation',
        body: patch,
      })) ?? [];
      await audit('update', table, updated?.id ?? Object.values(match)[0] ?? '', {
        label: entityLabel ?? updated?.title ?? updated?.slug ?? '',
        fields: Object.keys(patch),
      });
      return updated;
    },

    async remove(table, match, { entityLabel } = {}) {
      const query = new URLSearchParams(match).toString();
      await request(`${table}?${query}`, { method: 'DELETE', prefer: 'return=minimal' });
      await audit('delete', table, Object.values(match)[0] ?? '', { label: entityLabel ?? '' });
    },

    /**
     * Publish or unpublish, with both columns always moved together.
     *
     * The anonymous read policy needs `is_published` **and** a `published_at`
     * that is set and not in the future. Setting one without the other is the
     * single most likely way to produce a record the admin calls live and the
     * public site never shows, so no screen is allowed to do it by hand.
     *
     * `at` accepts a future timestamp, which the policy honours — the row
     * simply stays invisible until then. That is scheduling as far as the
     * database is concerned; there is no job that flips anything, and nothing
     * here pretends otherwise.
     */
    async publish(table, match, published, { at, entityLabel } = {}) {
      if (!PUBLISHABLE_TABLES.includes(table)) {
        throw new CmsError(`${table} has no publish state.`);
      }
      const when = published ? (at ? new Date(at).toISOString() : new Date().toISOString()) : null;
      const query = new URLSearchParams(match).toString();
      const [row] = (await request(`${table}?${query}`, {
        method: 'PATCH',
        prefer: 'return=representation',
        body: { is_published: published, published_at: when },
      })) ?? [];
      await audit(published ? 'publish' : 'unpublish', table, row?.id ?? Object.values(match)[0] ?? '', {
        label: entityLabel ?? row?.title ?? row?.slug ?? '',
        published_at: when ?? 'null',
      });
      return row;
    },
  };
}

/**
 * Is this row visible to the public right now?
 *
 * The same predicate the database applies, evaluated in the browser so the
 * admin can show the true state rather than just echoing the checkbox. Where
 * the two disagree, this is what the visitor experiences.
 */
export function isPubliclyVisible(row) {
  if (!row?.is_published) return false;
  if (!row.published_at) return false;
  return new Date(row.published_at).getTime() <= Date.now();
}

/** Why a row is not visible, in words, for the admin's status column. */
export function visibilityLabel(row) {
  if (!row?.is_published) return 'Draft';
  if (!row.published_at) return 'Published flag set, but no date — not public';
  if (new Date(row.published_at).getTime() > Date.now()) return 'Scheduled';
  return 'Live';
}
