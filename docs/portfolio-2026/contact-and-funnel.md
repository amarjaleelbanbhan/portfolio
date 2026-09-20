# Contact and the Client Funnel

**Date:** 2026-09-20
**Phase:** 19 — Contact + Work With Me
**Routes:** `/contact` (rebuilt), `/api/contact` (new), `/hire` `/studio` `/studio/request` (preserved)

---

## 1. The old form failed silently

`/contact` built a `mailto:` URL and navigated to it. That only works if the
visitor has a mail client configured; otherwise the browser does nothing
visible. There was no confirmation, no record, and no way for anyone to know a
message had been lost. **Silent failure is the worst property a contact form can
have**, and it was the default path.

It now posts to `/api/contact`, which validates server-side and writes the
enquiry down. The direct email address is still on the page — a form that is the
only way to reach someone is its own kind of wall.

---

## 2. Categories are canonical

`content/contact.ts` holds the six the brief asks for, and both ends read it:
the form renders them and the API validates against them. A category that exists
on one side and not the other is a submission that fails for a reason nobody can
see.

| id | Label |
|---|---|
| `engineering_opportunity` | Engineering opportunity |
| `internship_job` | Internship or graduate role |
| `research_collaboration` | Research collaboration |
| `open_source` | Open source |
| `client_project` | Client project → routes to the Studio |
| `other` | Something else |

The category is asked **first**, because it changes what the rest of the form is
for, and each one carries a line telling a visitor whether it is the right box.

`client_project` is marked `routesToStudio`. Selecting it surfaces a pointer to
`/studio/request`, which asks what a project brief actually needs. The contact
form does not try to collect half of that badly, and the visitor can still send
a plain question from here.

---

## 3. Where submissions go

Into the existing `studio_leads` table, discriminated by `source`
(`contact:<category>`), using **exactly the columns the Studio request flow has
been writing since Phase 0.5**. That path is already proven and the admin
dashboard already reads the table, so contact enquiries are visible with no
schema change at all — though the live test below found the policy to be
stricter than the column list alone suggests.

A dedicated `contact_messages` table is the right long-term shape and belongs
with the CMS database phase.

### Verified live, and it found something

One marked test submission was sent with Amar's go-ahead. The first attempt was
**rejected**:

```
401  {"code":"42501","message":"new row violates row-level security policy for table \"studio_leads\""}
```

The Studio flow's identical-shaped insert succeeds. The difference is one column:
`source`. **The table's RLS policy constrains what a row may contain, not only
who may insert one** — its `WITH CHECK` pins `source` to the value the Studio
flow sends, so `contact:<category>` is refused.

Two things follow.

1. **The fallback was necessary, and it was also wrong.** It only retried on
   `400`; PostgREST reports a `WITH CHECK` failure as **401**, which is not the
   status a constraint violation suggests. Fixed to retry on 400, 401 and 403 —
   and re-tested, which now returns `201` with the reason logged.
2. **Category filtering in SQL is not available yet.** The category is the first
   line of every message, so nothing is lost to a human reading the enquiry, but
   the admin cannot `WHERE source LIKE 'contact:%'` until either the policy is
   widened or a dedicated `contact_messages` table exists.

> The Phase 0.5 security review listed anonymous `INSERT` as "assumed allowed —
> not tested". It is allowed, but only for rows the policy's `WITH CHECK`
> approves. That is a stricter and better posture than assumed, and it is worth
> recording because it is invisible until something tries to write a different
> shape.

**Two test rows now exist in `studio_leads`**, both prefixed `TEST —`, one from
each endpoint. `anon` cannot delete them; they need removing from the Supabase
dashboard.

## 4. Spam protection: three weak layers, none load-bearing

1. **Honeypot** — a `fax` field, off-screen, `aria-hidden`, `tabIndex={-1}`, so
   no sighted, keyboard or screen-reader user can reach it. A filled honeypot
   gets the `201` a bot expects and writes nothing; telling it that it failed
   only teaches it to try again.
2. **Timing gate** — a submission under 2.5 seconds from mount is dropped the
   same way. The elapsed time is client-supplied and therefore advisory, which
   is why it is one of three layers and not the defence.
3. **Rate limit** — in-memory, per instance.

### The rate limit is two counters, and the first version was wrong

A single limit on all requests punishes the person who mistypes their email four
times exactly as though they were a bot. The first version did that — five
requests of any kind in ten minutes, so a human fumbling the form was locked out
for ten minutes. Measured, then fixed.

| Counter | Limit | Counts |
|---|---|---|
| `requests` | 30 / 10 min | every POST, to blunt a flood |
| `submissions` | 3 / 10 min | only requests that **pass validation** |

Verified: eight consecutive invalid submissions all return `400`, and the flood
cap trips at the expected point.

**It is per-instance.** On a serverless platform that limits per warm instance
rather than globally. That is a real limitation, stated in the source rather
than papered over; a durable limit belongs with the database work.

---

## 5. Validation and feedback

Server-side validation returns a **field-keyed** error object, so the form can
point at what is wrong rather than showing one generic message. Every hostile
input is handled: types coerced, lengths capped, category checked against the
canonical set rather than passed through, and the optional URL **parsed** rather
than pattern-matched — `javascript:alert(1)` is rejected on protocol.

On the page:

- Each invalid field gets `aria-invalid` and an `aria-describedby` pointing at
  its own message.
- Focus moves to the first problem, not left on the button.
- The status region is `role="status"` and **persistent, not a toast**. A toast
  that has faded is a result the visitor cannot get back to.
- An error clears as the visitor starts addressing it, so the form does not
  argue with them while they type.
- The submit button reports `aria-busy` rather than only looking different.

---

## 6. The client funnel

`/hire`, `/studio` and `/studio/request` are untouched except for positioning.

The brief asks for **"Amar Digital Systems — independent engineering practice by
Amar Jaleel"**. Two changes:

- Both footers now read *"An independent engineering practice by Amar Jaleel"*.
- `/hire`'s "View agency page" became "How I work". **Agency implies a company
  with staff**; it is one person, and for the kind of client who wants a named
  engineer, saying so is better as well as more accurate. A browser check
  asserts the word "agency" appears on none of the three routes.

`/hire`'s "About Amar" link also now points at `/about` rather than the homepage.

---

## 7. Verified

42 checks against a production build, plus direct API probes.

**API** (`curl`, no database writes) — empty body returns four field errors; a
hostile payload is rejected per field including `javascript:` on the URL; the
honeypot and the timing gate both return `201` and write nothing; `GET` is
`405`; eight invalid submissions do not lock a human out; the flood cap trips.

**Form** — one `<h1>`, a real submit rather than a mail-client hand-off with the
direct address still offered, all six categories as a labelled radio group, the
honeypot hidden and unfocusable, the client-project route surfacing the Studio
pointer, per-field `aria-invalid` with matching descriptions, a non-`timeout`
status announcement, focus landing on the first problem, no navigation on
submit, every visible field labelled, no interactive target under 24px, no
overflow at 360 / 390 / 430 / 768 px, reduced motion clean, and no console
errors.

**Funnel preserved** — `/hire`, `/studio` and `/studio/request` all render
cleanly, the first two state the independent practice, none says "agency", and
the Studio request form is intact.

**No regressions** — nine other routes render one `<h1>` with zero console
errors.

> One test-harness bug worth recording: the first run failed because the
> `curl` probes had already spent the rate-limit budget for `127.0.0.1` on the
> same warm server, so the browser's submission came back `429` instead of
> `400`. The limiter was working; the test was polluted. Restarting the server
> between the API probes and the browser pass is now part of the procedure.

---

## 8. Open items

- **Two `TEST —` rows need deleting** from `studio_leads` in the Supabase
  dashboard; `anon` cannot remove them.
- **The leads RLS policy pins `source`**, so contact enquiries are stored under
  the Studio's value and cannot be filtered apart in SQL. Widening the policy or
  adding a `contact_messages` table fixes it; either is a production change.
- A durable, shared rate limit needs somewhere to store counters.
- The admin dashboard shows contact enquiries because they share the leads
  table, but it does not yet *filter* by `source`. That is the CRM phase.
