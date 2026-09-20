# Supabase Security Review

**Date:** 2026-09-18
**Phase:** 0.5
**Project in use by the app:** `yokgnzxwrbymarjdfyhk.supabase.co`
**Table:** `studio_leads`

No configuration was changed. Every probe below is non-destructive: reads,
metadata lookups, and writes filtered to a UUID that matches no row. **No RLS
policy was weakened, and no account was created.**

---

## Summary

| Check | Result | Confidence |
|---|---|---|
| Anonymous `SELECT` on `studio_leads` | **Blocked** (401, PostgREST `42501`) | Verified |
| Anonymous `UPDATE` on `studio_leads` | **Blocked** (401) | Verified |
| Anonymous `DELETE` on `studio_leads` | **Blocked** (401) | Verified |
| Anonymous `INSERT` on `studio_leads` | Assumed allowed | **Not tested** |
| **Public signup enabled** | **YES — `disable_signup: false`** | Verified |
| Authenticated read scoped to owner | **Unknown** | **Cannot verify** |
| Committed project ref ≠ app project | Confirmed, explained | Verified |

**The one finding that needs action:** public email signup is open on the project.
Whether that is exploitable depends entirely on the `SELECT` policy's role scope,
which cannot be read without dashboard access.

---

## 1. Anonymous access is correctly locked down

All three probes used only the publishable key
(`sb_publishable_h1nOLJv7TuuOqbWkKbiMnQ_LkM8VdcX`), which already ships to every
visitor's browser in `pages/studio/admin.js`. This is by design — publishable keys
are public — so the probes reveal nothing that was not already public.

```
GET    /rest/v1/studio_leads?select=id&limit=0   → 401  Proxy-Status: PostgREST; error=42501
PATCH  /rest/v1/studio_leads?id=eq.<nil-uuid>    → 401
DELETE /rest/v1/studio_leads?id=eq.<nil-uuid>    → 401
```

`42501` is `insufficient_privilege`. RLS is enabled and the `anon` role has no
`SELECT`, `UPDATE`, or `DELETE` policy. **This is the correct posture** and matches
the stated intent in the comment at `pages/api/studio-lead.js:15`.

The `UPDATE`/`DELETE` probes were filtered to
`id=eq.00000000-0000-0000-0000-000000000000`, which matches no row — had the
policy permitted the operation, the response would have been `204` affecting zero
rows. It was rejected before row matching, which is the stronger signal.

### Not tested: anonymous INSERT

The app depends on `anon` being able to `INSERT` (that is how
`/api/studio-lead` writes leads — it uses the publishable key server-side, not a
service-role key). Testing this would have written a junk row into the production
leads table, and `anon` cannot delete it afterwards. **Left untested
deliberately.** It is presumed working because the live form works.

---

## 2. Public signup is ENABLED — needs manual review

```
GET /auth/v1/settings
→ { "disable_signup": false, "mailer_autoconfirm": false, "external": { "email": true, ... } }
```

**Anyone can call `POST /auth/v1/signup` against this project and create an
account.** Commit `b97d5a0` ("security: make studio admin sign-in only") removed
the signup *form* from `/studio/admin` and added the text "Registration is not
available from this page" — but removing a form does not close an endpoint. The
GoTrue signup route is still open.

**Whether this is exploitable depends on a policy I cannot read.** Two cases:

- **Safe:** the `SELECT` policy is scoped to a specific owner, e.g.
  `USING (auth.uid() = '<owner-uuid>')` or a `profiles.role = 'admin'` check. A
  self-registered user authenticates fine but reads zero rows.
- **Not safe:** the policy is `TO authenticated` with `USING (true)`. Then **any
  person on the internet can register, confirm their email, sign in at
  `/studio/admin`, and read and modify every lead** — names, emails, companies,
  and free-text project descriptions.

`mailer_autoconfirm: false` means an attacker must control a real inbox to
confirm, which is a speed bump, not a control.

### Recommended manual verification

In the Supabase dashboard for project `yokgnzxwrbymarjdfyhk`:

1. **Authentication → Providers → Email → disable "Enable sign ups".** There is
   exactly one intended user; leaving self-registration open has no upside.
2. **Database → `studio_leads` → RLS policies.** Confirm the `SELECT` (and
   `UPDATE`) policies name a specific owner rather than the blanket
   `authenticated` role. If they are `TO authenticated USING (true)`, tighten to
   the owner's `auth.uid()`.
3. **Authentication → Users.** Confirm only the expected account exists. Any
   unrecognised account means signup has already been used.
4. Consider enabling MFA on the owner account (the `admin.mfa-notes` branches in
   the history suggest this was intended twice and never landed).

These are account-level changes on live infrastructure, so they are left for the
repository owner rather than performed here.

---

## 3. Committed project ref differs from the app's project

| Source | Project ref |
|---|---|
| `supabase/.temp/project-ref` (was committed) | `ogglcexhmaducblafgta` |
| `pages/api/studio-lead.js`, `pages/studio/admin.js` | `yokgnzxwrbymarjdfyhk` |

**Explanation:** `supabase/.temp/` was pure Supabase CLI local state — eight files
containing version strings (`cli-latest`, `gotrue-version`, `postgres-version`, …)
and a pooler connection URL. There is **no `config.toml`, no `migrations/`, no
`seed.sql`** — the directory is the residue of running `supabase link` in this
folder against a *different* project (`ogglcexhmaducblafgta`, named "visirod" in
the owner's Supabase org), unrelated to the portfolio.

It is not production configuration, nothing in the app reads it, and the app's
own Supabase target is hardcoded in source. **Untracked in Phase 0.5**
(`git rm -r --cached supabase/.temp` + `.gitignore`). The pooler URL it contained
is a connection string without a password, but it identified an unrelated
production project and had no reason to be in a public repository.

---

## 4. Items that could not be verified from available access

The portfolio's Supabase project is **not in the organisation reachable through
the connected Supabase tooling** (which lists only `visirod` and `Rodfit`).
Therefore the following are **documented, not guessed**:

- The exact `CREATE POLICY` definitions on `studio_leads`.
- Whether RLS is `FORCE`d (matters if anything ever connects as the table owner).
- Whether any non-owner accounts already exist.
- Whether `anon` INSERT is rate-limited at the database level.
- Whether the `service_role` key has ever been exposed anywhere.

---

## 5. Unchanged pre-existing weaknesses (not in Phase 0.5 scope)

Carried forward to Phase 21 (Admin Auth + Security):

- **No token refresh.** `refresh_token` is stored in `sessionStorage` and never
  used; the operator is silently logged out when the ~1h access token expires
  (`pages/studio/admin.js`).
- **No MFA** on the admin account.
- **No CSP**, so any injected script on the origin could read the session from
  `sessionStorage`.
- **No rate limiting** on `/api/studio-lead` beyond the honeypot.
- **Unbounded lead query** — `loadLeads` fetches every row with no `limit`.
- **`notified_at`** is selected but never written; there is no lead notification
  of any kind.
