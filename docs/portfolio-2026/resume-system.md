# Résumé System

**Date:** 2026-09-20
**Phase:** 18 — Resume System
**Route:** `/resume` (replaces `public/resume.html`)

---

## 1. Why the static file had to go

`public/resume.html` was a hand-maintained mirror of the canonical data, and the
content architecture document had flagged it as drift risk since Phase 2. It had
already drifted:

- It called the final-year project **VICE OS**. The site renamed it to SCAR-OS in
  Phase 3, and validation has rejected the old name in content ever since — but
  the résumé was not content, so nothing checked it.
- It listed **Linux, Prompt Engineering, OSV, Git, CI/CD, Testing and Code
  Review** as skills. None of those is in the skill registry, and `linux` was
  removed in Phase 16 for having no evidence behind it.
- Its contribution list, statuses and credential counts were all typed by hand.

That is what a second copy always becomes. The résumé is now a route rendered
from the same selectors as the rest of the site, so a status change, a merged
pull request or a new credential updates it in the same commit — and content
validation fails the build if any reference stops resolving.

---

## 2. What it renders, and from where

| Section | Source |
|---|---|
| Header, contact, location | `getProfile()` |
| Summary | `resumeSummary` in `content/about.ts` |
| Selected engineering work | `getResumeProjects()` |
| Open-source contributions | `getContributionsForDisplay()`, `getContributionStats()` |
| Research | `getAllResearch()` |
| Technical skills | `getResumeSkills()` |
| Education | `getEducation()` |
| Credentials | `getFeaturedCredentials()`, `getCredentialsByIssuer()` |
| Languages | `profile.spokenLanguages` |

Two deliberate shaping rules in the selectors rather than the page:

**`getResumeProjects()` excludes the archive.** A résumé is a claim about current
capability, and a retired 2023 project is not one.

**`getResumeSkills()` returns every skill, not just featured ones.** A résumé is
the one surface where completeness beats curation, and since Phase 16 every
skill in the registry has evidence behind it, so listing all of them claims
nothing extra.

The page then splits the projects: flagship work and the final-year project
print in full, and the secondary projects are named in a single line with a
pointer to `/work`. Four A4 pages of project entries is a portfolio, and the
site already is the portfolio.

### Spoken languages became canonical

English, Urdu and Sindhi were on the static résumé. Rather than drop a published
claim, `Profile.spokenLanguages` now models it, and validation fails if it is
empty — otherwise the résumé would print an empty section.

---

## 3. There is no PDF generator

The page is designed to print instead. `@media print` in `globals.css`:

- inverts to black on white, because a dark theme on paper is unreadable and
  unkind to whoever prints it;
- hides the navigation, footer, ambient canvas, scanlines, scroll progress and
  the print button;
- resets the document's Tailwind colours wholesale and re-applies only the few
  that carry meaning, because overriding them one utility at a time is not
  maintainable;
- **expands link destinations** — `a[href^='http']::after { content: ' (' attr(href) ')' }`
  inside résumé entries, so a printed copy does not throw away every URL;
- sets `break-inside: avoid` on sections and entries and `break-after: avoid` on
  headings, so nothing splits mid-thought;
- sets a 14mm `@page` margin.

"Save as PDF" in the browser produces the document. That is one fewer dependency,
and one fewer artifact that can silently stop matching the site. Verified by
driving `Page.printToPDF` in the test: **262 KB, 4 pages, A4.**

> One bug this caught, and it was a bad one: the first version hid `header` and
> `footer` wholesale to drop the site chrome. The résumé's own name-and-contact
> block is a `<header>`, so **the printed résumé had no name on it.** The rule is
> now `header.sticky`, which is the Navbar's class and not the document's.

---

## 4. The old URL still works

`public/resume.html` is deleted. `next.config.mjs` permanently redirects
`/resume.html` → `/resume` (308), because a copy of the old link may already be
in a sent application.

`profile.resumeUrl` is now `/resume`, and validation checks it against
`EXISTING_ROUTES` — a résumé button that 404s would be broken in the navigation
of every page on the site, which is exactly the kind of thing nobody notices for
months.

`ResumeButton` and the navbar entries became `next/link` rather than anchors
with `download`: a `download` attribute on an HTML route saves the markup, not
the document. The label is now "View Résumé", and the glyph changed from a
download arrow to a document.

---

## 5. Verified

54 checks against a production build, headless Chrome over the DevTools
protocol, at 1280 / 768 / 430 / 390 / 360 px, under emulated reduced motion, and
under emulated **print** media.

**The drift is gone** — no "VICE OS", SCAR-OS carrying its real stage and "no
implementation yet", none of the seven ghost skills, no proficiency percentage
anywhere in the skills section (the assertion is scoped there on purpose: "95%
CI [2.6, 10.5]" in the research results is a confidence interval).

**Facts match the site** — RODIFT Production, VeriPatch Released, CortexWard
Pre-alpha, SCAR-OS Research; all seven pull requests with the open one printed as
open; the derived merged count; all four research entries; the verified education
dates; 11 credentials as 9 Google and 2 Udemy with no "11 Google"; the spoken
languages.

**Print** — navigation, footer and the print button hidden; **the name visible
and black**; a white page background; link destinations expanded; and a real
multi-page PDF out of `printToPDF`.

**Routing** — `/resume.html` returns 308 to `/resume` and following it lands on a
200; the navigation and hero point at `/resume`; nothing anywhere still links the
deleted file.

**Quality** — no interactive target under 24px, no horizontal overflow at any
tested width, reduced motion clean, no console errors, and eleven other routes
unaffected.

---

## 6. Deliberately not done

- **No generated PDF artifact.** Adding a headless-browser render step to CI
  would reintroduce exactly the second copy this phase removed, and it would be
  stale between builds.
- **No hand-written "experience" section.** There is no employment to list, and
  inventing one is the failure this whole project is built to avoid. The work
  itself carries the argument.
