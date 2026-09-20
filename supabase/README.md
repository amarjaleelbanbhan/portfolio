# Supabase

Project: **Amar Digital Systems** — `yokgnzxwrbymarjdfyhk`

---

## Migration history

Nine migrations have been applied to the live project:

| Version | Name |
|---|---|
| `20260916194830` | `create_studio_leads` |
| `20260916195237` | `add_studio_lead_notification_state` |
| `20260916195651` | `add_studio_admin_rls` |
| `20260916195804` | `constrain_studio_lead_status` |
| `20260916200807` | `restrict_admin_signup_to_owner` |
| `20260916211335` | `improve_studio_request_intake` |
| `20260920040726` | `portfolio_cms_crm_foundation` |
| `20260920040817` | `portfolio_crm_owner_rls_and_media_storage` |
| `20260920040835` | `portfolio_append_only_audit_activity` |

**Do not reapply these.** They are already in the database, and re-running them
would either fail or, worse, partially succeed.

### Getting the authoritative SQL into this repository

`supabase/migrations/` is intentionally empty. The bodies of those nine
migrations live in the project and have not been exported, and **writing SQL
from the schema documentation and labelling it "the applied migration" would be
a fabrication** — a policy body reconstructed from prose is a guess, and a guess
in a migration file is the kind that gets applied to a database one day.

Export the real ones with the CLI, from a machine that has the database
password:

```bash
supabase link --project-ref yokgnzxwrbymarjdfyhk
supabase db pull                 # writes the current schema as a migration
supabase migration list          # confirms local and remote agree
```

`supabase/schema-reference.sql` is a hand-written description of the live schema
for reading and reviewing. It is **documentation, not a migration**, it is not
executable as a replay of history, and it is marked as such in the file itself.

Never commit the database password, a service-role key or a secret API key. The
publishable key is public by design and appears in the client bundle; that is
correct and is not a leak.

---

## What the application relies on

### The publish rule

Anonymous reads of the seven published-content tables require **all three**:

```sql
is_published = true
AND published_at IS NOT NULL
AND published_at <= now()
```

Setting `is_published` alone leaves a record the admin calls live and the public
site never shows. `lib/cms/client.js` exposes `publish()` as the only way to
change it, so the two columns always move together.

`portfolio_media` is the exception: its public read rule is `is_published` only,
with no date column. `lib/cms/media.js` handles that separately.

### The lead intake policy

`studio_leads` has one anonymous `INSERT` policy, and its `WITH CHECK` pins:

```
status = 'new'
source = 'studio_request'
```

Confirmed live: an insert with `source: 'contact:<category>'` is rejected with
`401 / 42501 — new row violates row-level security policy`. So `/api/contact`
sends the values the policy accepts and carries the enquiry category as the
first line of the message instead.

**The anonymous grant is table-wide**, which means the CRM columns added later —
`priority`, `estimated_value_usd`, `internal_tags`, `next_follow_up_at` — are
not independently constrained by that policy. `/api/contact` therefore builds an
explicit server-side allowlist and never spreads the request body, because
without that a stranger could file themselves as an urgent high-value lead.

### Storage

| Bucket | Public | Limit | Types |
|---|---|---|---|
| `portfolio-public` | yes | 10 MiB | jpeg, png, webp, avif, svg, mp4 |
| `portfolio-private` | no | 10 MiB | the above plus pdf |

A file in the public bucket is fetchable by URL **regardless of whether its
database row is published**, because object storage does not consult a table.
The media library is built around that: private is the default, "make public" is
an explicit copy, and deleting a record offers to delete the object too.

SVG is refused in the public bucket. It is script-capable and there is no
sanitiser here yet; refusing is honest, accepting and hoping is not.

---

## Proposed change, not applied

One narrow policy change would let contact enquiries be told apart from Studio
requests in SQL. It is written out in `schema-reference.sql` under
`-- PROPOSED`, and it has **not** been applied. It widens the intake policy's
accepted `source` values by exactly the set the contact form uses, and nothing
else.

Without it the CRM still works — the category is in the message and the UI
parses it back out — but `WHERE source LIKE 'contact:%'` is not available.
