# Case-Study System

**Date:** 2026-09-19
**Phase:** 7 — Reusable Engineering Case-Study System

`/work/[slug]` — the template and content model behind detailed project pages.

---

## 1. The governing rule

**A section renders only when it has real content.**

Phase 2 deliberately left `architecture`, `technicalDepth`, `verification` and
`solution` empty on every project rather than inventing prose. That is still true
at the end of Phase 7: the system exists, and the evidence goes in during the
case-study phases after the actual project material has been reviewed.

So the template is written out in full and the content decides what appears. A
project with three populated fields renders three sections — not three sections
and eight empty headings. Adding evidence to a project record is all it takes to
grow its case study; nothing is special-cased per project.

`getStaticPaths` reflects the same rule: **routes exist only for projects that
have a `caseStudy` block.** Everything else is a genuine 404, not a thin shell.

---

## 2. Content model

`content/types.ts` gained an optional `caseStudy` block on `Project`:

| Field | Purpose |
|---|---|
| `context` | the situation the work happened in |
| `constraints[]` | real constraints that shaped the design |
| `built` | what was actually built, in prose |
| `architecture` | `{ summary, nodes[], flows[], caveat }` — sanitized and structured |
| `decisions[]` | `{ title, decision, rationale, tradeoff? }` |
| `concerns[]` | security and reliability concerns and their handling |
| `verification[]` | `{ label, detail, verified }` |
| `results[]` | outcomes that can be stated honestly |
| `timeline[]` | dated or ordered milestones |
| `disclosure` | what is deliberately not shown |

Two modelling decisions worth keeping:

**Architecture is structured, not a paragraph.** `nodes` and `flows` mean the
diagram is generated from content, so a case study cannot quietly gain an
integration nobody built — and validation can check that every flow references a
node that exists.

**`verification[].verified` is a required boolean.** It separates "this is
tested" from "I can show you the test". A private project can honestly say a test
suite exists while marking it as not publicly evidenced.

---

## 3. Validation

Five rules, all confirmed to fire by deliberately breaking them:

| Rule | Prevents |
|---|---|
| architecture flow must reference existing nodes | drawing an integration that was never built |
| architecture needs a summary and a **caveat** | a sanitized drawing passing as a screenshot |
| architecture needs at least one node | an empty diagram frame |
| decisions need both a decision and a rationale | a decision listed without reasoning |
| verification items need an explicit `verified` boolean | ambiguity about what is evidenced |
| **private project with a case study needs a `disclosure`** | a reader unable to tell absence from omission |

That last one is the important one. A private project can publish a case study,
but it must state what is withheld.

---

## 4. Components

```
components/case-study/
  ProjectHero.js           title, status, domains, tech, links, proof strip
  ProjectArchitecture.js   generated SVG diagram + text equivalent
  RelatedWork.js           same-domain projects, derived
  sections.js              ConstraintBlock, TechnicalDecisions, ConcernSection,
                           TestEvidence, ProofStrip, ResultsSection,
                           ProjectTimeline, ProjectMetrics, ProjectLimitations,
                           ProseSection, Section
```

Reused unchanged from earlier phases: `StatusBadge`, `DomainBadge`, `ProofBadge`,
`TechTag`, `getProjectVisual`, the motion presets and the domain tokens.

### Architecture diagram layout

Node positions are **computed, not authored**: each node's column is its longest
path back to a node with no inbound flow, and columns are centred vertically
against the tallest. That gives a readable left-to-right system diagram without
anyone positioning boxes by hand, and it re-lays out correctly when a node is
added. The depth pass is iterative and bounded by node count, so a cycle in the
spec degrades gracefully instead of blowing the stack.

The node list is also rendered as a real `<dl>` beneath the drawing, so the
architecture is fully readable without seeing the diagram.

**SVG, not WebGL.** A case study should not load a 3D stack to draw seven boxes;
the homepage still carries the only WebGL scene on the site.

### Components deliberately not built

**`MediaGallery` was not created.** No project has any `media` entries, and no
authorised public screenshots exist for the private flagships. Building a gallery
that renders nothing would be exactly the "empty decorative component merely to
tick a checkbox" this phase was told to avoid. The `MediaItem` type already
exists in the model, so the component can be added the moment there is something
to put in it.

**`GitHubEvidence` was not created as a separate component.** Repository, package
and release links are already rendered by `ProjectHero` from `project.links`,
driven by `source.visibility`. A second component for the same data would be
duplication, not reuse.

---

## 5. Source handling

Unchanged from the canonical model — `public`, `private`, `unavailable`:

- public projects render their real repository, package and demo links
- private and unavailable projects render the `source.label` marker and **no
  URL**, because `links.repository` is validated to be absent for them
- private projects additionally must carry a `disclosure` note

---

## 6. Routing and SEO

- `getStaticPaths` generates only canonical slugs that have case studies;
  `fallback: false`.
- Unknown slugs return a real 404 — verified: `/work/nope`, `/work/rodift`
  (before its case study existed) and a traversal attempt all returned 404.
- Each page gets its own title, description and canonical
  (`https://amarjaleel.me/work/<slug>`) through the existing `Seo` component, with
  `type="article"`. `project.seo` overrides the defaults when present.
- `/work` and `/work/[slug]` coexist without collision in the Pages Router.
- Legacy `/projects` compatibility from Phase 6 is untouched.

Sitemap entries are added per case study as each one ships, rather than listing
routes that do not exist.

---

## 7. Integration with `/work`

`getCaseStudyProjects()` is the single definition of "has a detail page".
`/work` uses it to decide whether to show a case-study action, and `RelatedWork`
uses it to choose between `/work/<slug>` and `/work#<slug>` — so no public button
points at a page that has not been built.

---

## 8. Accessibility and motion

- Semantic `<article>` with one `<h1>` in the hero and `<h2>` per section; every
  section is `aria-labelledby` its heading and carries a stable id.
- The architecture diagram has `role="img"` with a full label listing every
  component, plus the text `<dl>` equivalent.
- Motion uses the Phase 3 presets and animates on mount; `reduced` is threaded
  into the diagram so path-drawing is skipped rather than slowed.
- Links and buttons keep 44 px touch targets on small screens.

---

## 9. Phase 8/9 integration points

1. Add a `caseStudy` block to the project record — the route appears
   automatically.
2. Populate only what the evidence supports. Leave the rest absent.
3. Private projects **must** include `disclosure`, or validation fails.
4. Architecture `nodes`/`flows` drive the diagram; `caveat` is required.
5. Add the new route to the sitemap in the same commit.
6. Wire the `/work` card action once the route is verified to render.
