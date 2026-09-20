# Work Page

**Date:** 2026-09-19
**Phase:** 6 — Engineering Work Page

`/work` — the engineering portfolio, and the new canonical destination for
project links.

---

## 1. What it answers

The homepage answers *what kind of engineering does Amar do, and how does he
approach problems*. This page answers *what has he actually built, what is its
status, and where is the evidence*.

It deliberately does not repeat the five-stage homepage narrative — it links back
to it from the introduction and from every featured card.

---

## 2. Architecture

```
pages/work.js                    grouping, filtering, layout
  ├─ components/work/ProjectFilters.js      domain radio group + search
  ├─ components/work/FeaturedProjectCard.js flagship card
  ├─ components/ProjectCard.js              compact card (reused unchanged)
  └─ components/project-visuals.js          slug-keyed visuals (extracted)
```

`components/project-visuals.js` is new. The visual map previously lived inside
`ProjectCard`; it was extracted so the compact card and the featured card read
from one source. Two copies would let a flagship render its bespoke treatment in
one place and the generic fallback in the other — exactly the failure that
slug-keying exists to prevent.

`getProjectVisual()` is the only read path, so every caller gets identical
fallback behaviour.

---

## 3. Canonical content

Grouping and ordering come entirely from selectors. There is no project list in
the page.

| Group | Selector | Order |
|---|---|---|
| Featured Engineering Work | `getFlagshipProjects()` | RODIFT, VeriPatch, KnowledgeGuard, CortexWard, SceneForge |
| Systems & Additional | `getSecondaryProjects()` | Emergency Mesh, CS Learning by Game, BuildSphere, TODO Tracker Pro |
| Current Final Year Project | `getCurrentFypProjects()` | SCAR-OS |
| Earlier Work | `getArchivedProjects()` | ZakatLink, MediTalk, Smart Notebook, EduResource Hub |
| Upstream Contributions | `getContributionsForDisplay()` | merged first, then open |

Technology labels resolve through `getSkillBySlug()`. Domain accents come from
`getDomainColor()`. `DOMAINS` was added to the `@/lib/content` barrel so the page
could read the canonical domain list without reaching past the content boundary.

### The conditional-field rule

Only **RODIFT and VeriPatch** currently have populated `problem` and `role`
fields. KnowledgeGuard, CortexWard and SceneForge have neither.

`FeaturedProjectCard` renders each of those blocks — heading included — only when
the field exists. It does not emit an empty "Problem" heading, a placeholder, or
invented prose. The case-study phases populate those fields from real evidence;
until then the canonical `summary` carries the description.

The same rule applies to limitations, notes, verified proof and every link: each
block appears only when there is real content behind it.

---

## 4. Filtering and search

Filter options are **derived from the domains projects actually carry**, not
hand-written — a domain with no projects behind it would be a dead button, and a
new domain appears without editing the page. Each chip shows its own count.

Implemented as a **radio group**, not a row of buttons: the options are mutually
exclusive, so arrow keys move between them and only the selected option is a tab
stop. The active filter is identifiable programmatically (`aria-checked`) and
visually by border, background and a filled dot — never by colour alone.

Search matches title, summary, note, tags, resolved technology names and domain
labels. Result counts are announced through `aria-live="polite"`.

An empty result shows an explanatory message and a "Clear filters" button rather
than a blank page.

**Filtering never strips an anchor target.** The page always loads unfiltered
(`all` is the default), so a deep link always resolves before any filter can
apply. The archive section auto-expands whenever a filter is active, so a
filtered project is never hidden behind a collapsed panel.

---

## 5. Private-source treatment

Unchanged from the canonical model: `source.visibility` decides everything.

Five of the fourteen projects are private. Those render the `source.label`
("Private repository") where a Code button would be, and no repository URL is
emitted. Only links that actually exist in `project.links` are rendered, each
labelled by its field — so RODIFT surfaces its published privacy policy and
nothing else, and no client is named.

Verified in the browser: **zero** GitHub URLs matching any private repository
identifier appear on the page, and five private markers render.

---

## 6. Navigation and legacy compatibility

`/work` is now the primary destination. Updated: Navbar, Footer, Hero CTAs,
homepage CTAs, `pages/hire.js`, `pages/studio.js`, `pages/certifications.js`,
the five Engineering Core destinations in `content/domains.ts`, and the five
homepage story destinations in `content/story.ts`. `EXISTING_ROUTES` in
`lib/content/validation.ts` gained `/work` in the same change, so the route
checks stayed green throughout.

### Why `/projects` was kept rather than redirected

`/projects` remains a **fully functional page**. A redirect would have staked
every existing `/projects#rodift` link on fragment preservation surviving a 3xx —
which browsers do implement, but which is an unnecessary dependency when the
alternative costs nothing. Keeping the page also preserves the `SecretProject`
easter egg and the contributions section that live there.

Consolidation is handled by a **cross-canonical**: `/projects` passes
`path="/work"` to the existing `Seo` component, so it emits exactly one canonical
tag pointing at `/work`. `Seo` renders a single `<link rel="canonical">` and a
single robots tag, so there is no conflicting canonical — verified in the
browser. A banner at the top of `/projects` points visitors at `/work`.

`/projects` was removed from the sitemap and `/work` added in its place: listing
a page whose canonical points elsewhere sends conflicting signals.

Verified: `/projects#rodift`, `/projects#veripatch` and `/projects#open-source`
all still resolve to real elements, and `/work#rodift`, `/work#knowledgeguard`,
`/work#emergency-mesh` and `/work#open-source` resolve on the new page.

---

## 7. SEO

`/work` has its own title, description, canonical (`https://amarjaleel.me/work`)
and Open Graph metadata through the existing `Seo` component — one description,
one canonical, one robots tag. The sitemap lists `/work` at priority 0.9.

---

## 8. Responsive and accessibility

- Featured cards are a two-column grid above `md` and stack below it; the visual
  panel keeps a minimum height so it never collapses.
- Filter chips and contribution links have 44 px minimum touch targets.
- No horizontal overflow at 360, 390, 430 or 768 px (measured with the page's
  `overflow-x` clip lifted).
- Semantic structure: one `<h1>`, `<h2>` per group, `<h3>` per project. Every
  group section is `aria-labelledby` its heading.
- Status and domain are always rendered as text in a badge, never as colour
  alone.
- Reduced motion: verified 0 hidden elements.

---

## 9. Known limitations

1. **`problem` and `role` exist for two of five flagships.** Documented above;
   Phases 7–9 populate the rest from real evidence rather than inference.
2. **`architecture`, `technicalDepth` and `verification` remain empty** in
   canonical content for every project. The Work page does not render them.
3. **Cards do not yet link to case studies.** `/work/[slug]` does not exist at
   the end of Phase 6, and the brief forbids pointing public buttons at routes
   that have not been built. Phase 7 adds the routes and wires the cards.
4. **The contributions section is duplicated** between `/work` and the legacy
   `/projects` page. Both read the same selector, and `/projects` is retired
   content; this resolves when `/projects` is eventually removed.
5. **Two flagships shared an accent colour** (VeriPatch and CortexWard were both
   `#f97316`), which was only visible once they sat adjacent on this page.
   VeriPatch moved to `#fbbf24`.

---

## 10. Phase 7 integration points

- `FeaturedProjectCard` is where a "Read the case study" action belongs once
  `/work/[slug]` exists. Add it beside the existing link actions.
- `getProjectVisual(slug)` gives a case-study hero its accent, gradient and icon
  for free.
- Anchor ids on `/work` are the project slugs, so `/work#rodift` and
  `/work/rodift` can coexist without collision.
- `EXISTING_ROUTES` will need `/work/[slug]` handling when story and domain
  destinations are repointed at case studies.
