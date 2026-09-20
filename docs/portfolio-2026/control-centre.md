# The Portfolio Control Centre

**Date:** 2026-09-20
**Phases:** 20–31 — admin, auth, CMS, CRM, media, SEO, health, palette, publishing, audit
**Route:** `/admin`

---

## 1. The shape

```
  lib/supabase.js            url + publishable key, from the environment
        │
  lib/admin/session.js       sign in · refresh · membership · sign out
        │
  lib/cms/client.js          the ONE data layer: audit, publish rule, errors
        │        ├── lib/cms/contracts.js   every JSONB column, validated
        │        ├── lib/cms/schemas.js     field definitions per table
        │        ├── lib/cms/leads.js       CRM operations
        │        ├── lib/cms/media.js       storage + bucket rules
        │        └── lib/cms/migrate.js     canonical content → tables
        │
  components/admin/*         shell · palette · field · editor · lead detail
        │
  pages/admin/*              dashboard, generic section routes, bespoke screens
```

**One data layer.** Every admin read and write goes through `lib/cms/client.js`,
so audit logging, the publish rule and error shaping are decided once. A new
editor screen cannot forget any of them.

---

## 2. The three things most likely to go wrong

### The publish rule needs two columns

Anonymous reads of the seven published-content tables require **all three**:

```sql
is_published = true AND published_at IS NOT NULL AND published_at <= now()
```

Setting the flag alone produces a record the admin calls live and the public
site never shows, and nothing about the interface would normally reveal that.
So:

- `publish()` in the data layer is the only way to change it, and it always
  moves both columns.
- `isPubliclyVisible()` evaluates the database's own predicate in the browser,
  so the list and the editor show what a **visitor** sees, not what the flag
  says.
- The dashboard counts mismatched records separately and warns about them.

`portfolio_media` is the exception — its rule is `is_published` alone, with no
date column — and `lib/cms/media.js` handles it separately rather than writing a
column that does not exist.

### A public file outlives its record

A file in `portfolio-public` is fetchable by URL whether or not its row says
published, because object storage does not consult a table. Unpublishing hides
it from the site and does nothing to the file.

That is a fact to design around, not a bug to work around:

- private bucket is the upload default, and the reason is on screen;
- "make public" is an explicit copy behind a confirmation, never a checkbox;
- deleting a record offers to delete the object, because a row removed while its
  file stays reachable is the worst of both;
- private previews use five-minute signed URLs.

**SVG is refused in the public bucket.** It is script-capable, there is no
sanitiser here, and refusing is honest where accepting and hoping is not.

### The anonymous lead grant is table-wide

`studio_leads` has one anonymous `INSERT` policy. Its `WITH CHECK` pins
`status = 'new'` and `source = 'studio_request'` and validates the intake
fields — but the **grant** covers the whole table, so the CRM columns added
later (`priority`, `estimated_value_usd`, `internal_tags`, `next_follow_up_at`)
are not independently constrained by it.

`/api/contact` therefore builds an explicit server-side allowlist, field by
field, and **never spreads the request body**. Without that, a stranger could
file themselves as an urgent high-value lead.

---

## 3. Authorisation

Two steps, because they are two different facts:

| Step | What it proves |
|---|---|
| Supabase sign-in | who someone is |
| `portfolio_admins` membership | that they may administer this |

A signed-in non-admin is told plainly that the account is not authorised, rather
than being dropped into an interface where every panel is mysteriously empty —
which reads as a bug rather than a refusal.

**That check is for honesty, not protection.** Anyone can edit client state;
nobody can talk their way past a policy. Row-level security is the boundary, and
section 6 is the evidence.

The membership check distinguishes *refused* from *unreachable*, because a
network failure is not a refusal and signing someone out for bad wifi is a real
way to lose work.

### What the old admin was missing

Three things, now handled once in `lib/admin/session.js`:

1. **Refresh.** The refresh token was stored and never used, so a session simply
   expired and dumped you back at the sign-in form mid-task.
2. **An authorisation check.** Authorisation lived entirely in RLS, so a
   non-admin reached the interface and found everything empty.
3. **Server-side sign-out.** Clearing local storage left the refresh token valid
   until it expired on its own.

Tokens live in `sessionStorage`, so the session dies with the tab — the right
default for an admin surface on a possibly shared machine. It is readable by any
script on the origin, which is exactly why none of it substitutes for RLS.

---

## 4. One editor, seven tables

`lib/cms/schemas.js` defines the fields; everything else is generic. Projects,
research, open source, skills, credentials, experience and site content get the
same **finished** list and form rather than seven variations on one, and a new
field is a line in a schema rather than a new screen.

Cross-field rules that the database also enforces are checked early and
explained, so `23514 violates check constraint` is never the first time anyone
finds out:

- a private project must not carry a repository URL;
- only a merged contribution has a merge date;
- a pull-request URL must match its repository and number;
- an experience entry cannot end before it starts.

### JSON fields, and why they are raw

The flexible JSONB columns are edited as JSON and validated through the
contracts on save. That is a decision, not a shortcut: a case study has fifteen
nested optional structures, and a generated form for each would be enormous,
worse to use, and immediately out of date.

The contract is what makes it safe. It parses, checks shapes, and **drops
unknown keys**, so nothing reaches a page that was not named in
`lib/cms/contracts.js`. Parse errors appear as you type; contract errors appear
against the field on save.

Two rules worth calling out, because they mirror the site's own standards:

- **A measured value with no interpretation is refused.** That is the failure
  mode research writing actually has.
- **Site content blocks are a closed set**, and there is deliberately no `html`
  block. That is what stops the CMS becoming a way to inject markup.

---

## 5. Content migration

The tables are empty and the public site still renders from `content/`. That is
deliberate and the health page says so in as many words, because a dashboard
implying otherwise would be the most expensive kind of wrong.

`lib/cms/migrate.js` copies the canonical content in **without changing what any
of it says** — statuses, evidence, limitations, corrections, disclosure notes and
source-visibility rules all transfer exactly.

- **Idempotent.** Matched on slug, or pull-request URL for contributions, and
  updated in place. Running it twice changes nothing the second time.
- **Never deletes.**
- **Never leaks a private repository.** The mapping forces `repository_url` to
  null on any non-public source.
- **Imports unpublished**, so a migration can never quietly become a publishing
  event. Publishing is a separate, confirmed action.

It runs in the browser with the admin's own session, under exactly the policies
that protect everything else. An API route would have meant handing a server a
secret key — a much larger thing to get wrong than a migration button.

One normalisation is worth recording: credentials store month precision
("Nov 2025") and the column is a `date`, so the first of the month is used. Every
surface renders month and year, so nothing is claimed that the source did not
say.

---

## 6. Verified

106 browser and API checks across three suites, against a production build.

**The gate holds.** Signed out, every admin route shows the sign-in form, carries
`noindex`, leaks no section navigation and no record data, and renders without
console errors. Bad credentials are refused with a message that does not reveal
whether the account exists, no session is stored after a failure, and the gate
stays up.

**Row-level security, probed directly with the publishable key:**

| Table | Anonymous read | Anonymous insert |
|---|---|---|
| `portfolio_admins` | 401 | — |
| `studio_leads` | 401 | refused except the intake policy |
| `lead_notes` | 401 | — |
| `lead_activity` | 401 | — |
| `admin_audit_log` | 401 | 401 |
| `site_settings` | 401 | 401 |
| `portfolio_projects` | 200, **zero drafts** | 401 |
| `technologies` / `research_projects` / `credentials` / `site_content` | 200, **zero drafts** | — |

**The public endpoint gives nothing away.** `/api/site-config` returns an empty
projection with no secret key configured, rejects `POST`, and contains no key
material.

**No portfolio chrome** on the admin: zero particle canvases, zero scanline
overlays, zero scroll bars, no boot sequence.

**Mobile.** No horizontal overflow at 390px, and no control under 40px.

**No regressions.** Fourteen public routes render with their heading and zero
console errors; `/studio/admin` still loads.

### What is *not* verified

**An authenticated admin round trip.** No admin credentials exist in this
environment, and asking for a password to type in is not something to do. The
following need one signed-in pass:

- sign-in succeeds and the membership check passes;
- session refresh across an expiry;
- sign-out revokes server-side;
- create / edit / publish / unpublish / delete on each table;
- the content migration and bulk publish;
- media upload to each bucket, signed preview, make-public, delete;
- lead status change, note, follow-up, and the resulting activity rows;
- audit entries appearing for all of the above.

Until then these are *implemented and statically verified*, not *proven working*,
and the tracker says so.

---

## 7. Known and deliberately open

- **Draft/preview/publish is partial.** Draft state, publishing, unpublishing and
  future-dated publication work. Independent draft revisions, publishing history,
  preview-as-rendered and rollback do not — there are no revision tables, and the
  brief is explicit they need separate design. Scheduling works only because the
  policy compares a timestamp; no job flips anything.
- **The public site does not read the database yet.** By design, until the tables
  are populated and reviewed.
- **Contact enquiries cannot be filtered apart in SQL**, because the intake policy
  pins `source`. The category is the first line of the message and the CRM parses
  it back out. The narrow policy change is written up in
  `supabase/schema-reference.sql` under `-- PROPOSED`, and is not applied.
- **Supabase Auth configuration** — public signup, leaked-password protection —
  is dashboard configuration, not application code.
- **The audit log is client-written.** It records what this interface did, not
  every statement the database saw. Triggers would change that.
- **Roles are not enforced.** `portfolio_admins.role` supports `editor`, but the
  policies check active membership only, so an editor would have owner
  permissions. Do not add one before role-specific policies exist.
- **The rate limit on `/api/contact` is per-instance**, so it is per warm
  instance on serverless rather than global.
