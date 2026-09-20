# About and Credentials

**Date:** 2026-09-20
**Phase:** 17 — About and Credentials
**Route:** `/about`

Who this engineer is, and why any of it should be believed.

---

## 1. The problem with about pages

The temptation is to assert character: careful, detail-oriented, passionate
about clean code. Anyone can type that, and a reader with any experience
discounts all of it. So none of it is here.

The page's centrepiece is instead **four real engineering decisions, read from
the case studies, each shown with what it cost**:

| Project | Decision | What it cost |
|---|---|---|
| CortexWard | A model is never allowed to be the evidence | The tool is far more conservative than an LLM reviewer |
| KnowledgeGuard | Freeze the analysis before the first result existed | A better test found later must be reported as exploratory |
| Emergency Mesh | Label the in-app mesh demo as a simulation | The most visually convincing screen carries a disclaimer |
| VeriPatch | Refuse yarn and pnpm projects rather than guess | A large share of real projects can be scanned but not verified |

A decision with its trade-off attached is the only honest evidence of judgement
a portfolio can offer. None of the text is written for this page — it is read
from each project's own `caseStudy.decisions`, so /about and the case study
cannot disagree, and validation **rejects a featured decision that records no
trade-off** because the section is titled "with what they cost".

---

## 2. What is derived

| On the page | Read from |
|---|---|
| Education, degree, dates, university | `content/education.ts`, `content/profile.ts` |
| "6 merged pull requests across 6 repositories" | `getContributionStats()` |
| Current focus | project `status` and research `status`/`publicStage` |
| Credential total and issuer split | `getCredentialsByIssuer()` |
| Every decision's text | the projects' case studies |
| Every principle's evidence | the project registry |

Nothing on the page claims employment, a client, an award, a testimonial or an
outcome that is not already evidenced elsewhere on the site. A browser check
asserts that against twelve patterns, including "years of experience", "clients
include", "worked at", "award-winning", "N users" and "passionate".

### Current focus has a definition

"Current" means: research that is not complete or paused, plus projects whose
status is `active-development`. Derived, so nothing stays on the page because a
paragraph went stale.

---

## 3. Principles have to point at work

`content/about.ts` holds the five principles, and each carries `projectSlugs`.
Validation requires at least one, and requires every slug to resolve.

```
about: principle references no project — it would be an unsupported claim
about: principle references nonexistent project "<slug>"
about: no case-study decision "<id>" on "<slug>"
about: featured decision records no trade-off
```

That is the rule the page is built on: a statement about how Amar works cannot
be added without evidence for it existing somewhere else first.

The five, and where each is visible:

1. **Decide where trust stops, then enforce it structurally** — CortexWard,
   SceneForge, RODIFT
2. **Treat a fix as a hypothesis until something checks it** — VeriPatch,
   CortexWard, KnowledgeGuard
3. **Design for the failure mode, not the happy path** — Emergency Mesh,
   VeriPatch, RODIFT
4. **Make results reproducible, including the inconvenient ones** —
   KnowledgeGuard
5. **Shipping is part of the engineering** — VeriPatch, the portfolio, RODIFT

---

## 4. Credentials

**Eleven in total — nine Google, two Udemy.** The split is counted by
`getCredentialsByIssuer()` rather than written, precisely because the claim it
replaces was wrong: the set was once described as "11 Google certifications".
A browser check asserts the page says "9 Google" and "2 Udemy" and never says
"11 Google".

Four selected credentials appear on /about, each linking to its issuer for
verification, with a clear path to the full list. `/certifications` is unchanged
and still renders all eleven — a check confirms the count there too.

**Placement is the point.** The credentials section sits after the decisions,
the principles, the current focus and the education, and a browser check asserts
that ordering. They are supporting evidence, and the page says so in those
words.

No credential record is duplicated: /about reads `getFeaturedCredentials()` from
the same source /certifications reads.

---

## 5. Visual design

Reused rather than rebuilt:

- **`PortraitOrbit`** — the hero's identity anchor, at full portrait size with
  its rings, orbiting dots and availability badge. A second portrait treatment
  would have been one more thing to keep in sync.
- **`Education`** — the homepage timeline, unchanged.

**No second Engineering Core.** A browser check asserts zero canvases in
`<main>`. The homepage owns the 3D statement; repeating it here would dilute
both and cost a bundle for decoration.

The four supporting areas (product engineering, security and developer tools,
applied AI and research engineering, mobile and systems engineering) are
rendered as links into the work that demonstrates each, not as tags.

---

## 6. Navigation

`About` joins the primary navigation. **Certifications leaves it** rather than
making the row nine wide: the route is unchanged and is reached from /about, the
footer and the sitemap. Giving a certificate list top-level billing alongside
the work was the wrong emphasis regardless of the width.

The footer now carries both, with `Certifications` spelled out rather than
abbreviated. The sitemap gained `/about`.

---

## 7. Verified

65 checks against a production build, headless Chrome over the DevTools
protocol, at 1280 / 1024 / 768 / 430 / 390 / 360 px and under emulated reduced
motion.

**Structure** — one `<h1>` carrying the name, no empty headings, no skipped
levels, unique title, description and canonical.

**Positioning** — "Software Engineer" as the primary identity, all four
supporting areas present and each one a link, and **zero matches against twelve
invented-experience patterns**.

**Facts** — the university, degree and verified dates as recorded; SCAR-OS named
as the final-year project, described as the research and architecture stage and
explicitly "a proposal, not an implementation"; no trace of the old project
name.

**Decisions** — four rendered, each showing decision, why and cost, each linking
to its case study, and the text confirmed to match the case studies.

**Credentials** — 11 total shown, the 9/2 split stated, "11 Google" absent, the
supporting-evidence framing present, four selected credentials with verify
links, a path to the full list, `/certifications` still listing eleven, and the
engineering sections confirmed to precede the credentials.

**Links** — every internal destination fetched for a 200, and every anchored
link **visited in a browser** and confirmed to land on a visible element.
External links open with `noopener`.

**Accessibility, layout, motion** — no interactive target under 24px, nothing
stranded after a jump scroll, no horizontal overflow at 360 / 390 / 430 / 768
px, reduced motion clean, no console errors or uncaught exceptions.

**No regressions** — eleven routes render one `<h1>` with zero console errors,
`/studio/admin` still renders zero particle canvases and zero scanline overlays,
and the homepage keeps its five story stages and both canvases.

### Two defects found and fixed

1. **Seven pixels of horizontal overflow at 360px, from a rotating square.** The
   orbit rings are square elements animating `rotate: 360`, and a rotated
   square's bounding box is √2 times its width — 373px for a 264px ring — even
   though what you see is a circle that fits comfortably. Fixed with
   `overflow-x: clip` on the portrait column: `clip` is the one overflow value
   that leaves the other axis visible, so the decorative excess stops
   contributing to the page's scrollable width while the badge below the
   portrait is untouched.
2. **Fourteen controls under 24px on a pointer**, from `sm:min-h-0` on links
   that are controls rather than chips. Now 44px on touch and 28px on a pointer.
