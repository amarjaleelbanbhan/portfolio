# Content Architecture

**Date:** 2026-09-18
**Phase:** 2 — Canonical Content Architecture

One trustworthy content layer that every later phase reads from, designed so the
storage behind it can change without the UI changing.

---

## 1. The shape

```
                 ┌─ projects.ts
                 ├─ research.ts
                 ├─ skills.ts
Static Content ──┼─ credentials.ts        content/
                 ├─ open-source.ts
                 ├─ education.ts
                 └─ profile.ts
                       │
                       │   (types.ts defines the contract for all of them)
                       ▼
                 Content API              lib/content/index.ts
                       │
                   selectors              lib/content/selectors.ts
                       │
                       ▼
                      UI                  pages/*, components/*
```

**The rule:** UI imports from `@/lib/content` and nothing else. No component
imports `@/content/*` directly.

That single constraint is what makes the left-hand side replaceable:

```
Supabase ──► lib/content ──► UI          (later, same selector signatures)
```

When content moves to Supabase, `selectors.ts` changes from array filters to
queries. Every page and component stays exactly as it is.

### Why a selector layer rather than exported arrays

Before Phase 2, "what is featured" was implemented as
`projects.filter(...).slice(0, 3)` inside `pages/index.js`, which silently made
array order the definition of importance. Rules that live in one place can be
validated; rules scattered across components cannot.

---

## 2. Models

Defined in `content/types.ts`. No `enum` is used — unions from `as const` arrays
keep the content files loadable by Node's type-stripping loader, which is how
`npm run validate:content` runs them outside Next.

### Project

Identity is `slug`, never `title`.

| Group | Fields |
|---|---|
| Identity | `id`, `slug`, `title`, `shortTitle` |
| Copy | `summary`, `description` |
| Classification | `tier`, `status`, `domains` |
| Ordering | `featured`, `featuredRank`, `sortOrder` |
| Dates | `startedAt`, `updatedAt` |
| Narrative | `role`, `problem`, `solution` |
| Depth | `architecture`, `technicalDepth`, `verification`, `limitations` |
| Relations | `technologies` (skill slugs), `tags`, `researchSlug` |
| Access | `links`, `source` |
| Evidence | `proof`, `metrics`, `media` |
| Meta | `note`, `seo` |

Optional fields are genuinely optional. A project with no architecture write-up
omits the field rather than carrying invented prose — the case-study phases fill
these in as real material exists.

### Status vs tier — deliberately separate

`status` is **where the work is**. `tier` is **how much it matters to the
portfolio**. Conflating them is how an unfinished-but-important project ends up
buried, or a polished-but-trivial one ends up featured.

```
status: production | released | active-development | research
        prototype  | pre-alpha | completed         | archived

tier:   flagship | secondary | current-fyp | archive
```

Public labels ("Active Development") are formatted in `ProjectCard`, so display
wording never leaks back into the data.

### Source and links

```ts
source: { visibility: 'public' | 'private' | 'unavailable', repositoryUrl?, label? }
```

Five of the ten strongest projects are private. The model makes that a
first-class state rather than an omission:

- `public` **must** carry a `repositoryUrl`.
- `private` / `unavailable` **must not** carry one, and must not set
  `links.repository`. Validation fails otherwise.
- The card renders the `label` ("Private repository") where the Code button
  would be.

Links are explicit rather than a generic `link`/`github` pair:

```ts
links: { repository?, demo?, package?, documentation?, report?, release?, privacyPolicy? }
```

The UI renders only what exists, and labels correctly — VeriPatch's npm URL now
renders as "Package" rather than being mislabelled "Live Demo", which is what
the old ambiguous `link` field produced.

### Proof

```ts
{ id, type, label, value?, description?, sourceUrl?, verified, asOf? }
```

`sourceUrl` is optional **by design**: private work can still have honest
evidence. RODIFT carries a tagged `production-release` and a published privacy
policy; neither requires exposing the repository, and no URL is invented to fill
the gap.

`verified: false` fails validation. Anything published was checked against a
primary source on `asOf`.

> Worth recording: CortexWard's README carries CI and coverage badges, but they
> are static shields.io badges, not live status. They were therefore **not**
> recorded as proof.

### Research

Modelled separately from products — a study has a question and a result, not a
release and users. Fields: `researchQuestion`, `hypothesis`, `method`,
`dataset`, `experimentDesign`, `results`, `limitations`, `corrections`,
`futureWork`.

Prose is not duplicated: a project points at research via `researchSlug`, and
research points back via `projectSlug`.

SCAR-OS's public wording lives in a single `publicStage` field
(`"Current FYP — Research & Architecture Stage"`) so it cannot drift between
surfaces, and validation independently rejects a `production`/`released` status
or a `featured` flag on it.

### Skills

```ts
{ slug, name, category, shortName?, color?, projectSlugs, contributionIds, researchSlugs, featured, sortOrder? }
```

No proficiency scores. A skill's claim to exist is the work it points at, and
every reference is validated. `shortName` serves constrained surfaces such as the
physics pills.

### Open-source contributions

Cached from the GitHub API rather than fetched at render time, so the public site
never depends on GitHub being reachable. Status is `merged | open | closed`, and
validation cross-checks that each `url` actually matches its `repository` and
`prNumber`.

---

## 3. Entity relationships

```
Project ──technologies[]──►  Skill        (by skill slug)
Project ──researchSlug────►  Research     (1:1, optional)
Research ─projectSlug─────►  Project      (back-reference)
Skill ───projectSlugs[]───►  Project
Skill ───contributionIds[]►  Contribution
Skill ───researchSlugs[]──►  Research
Project / Research / Contribution ──has──► Proof[]
```

Every arrow is validated. A dangling reference fails the build.

---

## 4. Selectors

`lib/content/selectors.ts`:

**Projects** — `getAllProjects`, `getProjectsByTier`, `getFlagshipProjects`,
`getSecondaryProjects`, `getCurrentFypProjects`, `getArchivedProjects`,
`getFeaturedProjects(limit?)`, `getProjectBySlug`, `getProjectsByStatus`,
`getPrivateProjects`

**Research** — `getAllResearch`, `getResearchBySlug`, `getResearchForProject`

**Open source** — `getAllContributions`, `getMergedContributions`,
`getOpenContributions`, `getContributionById`, `getContributionsForDisplay`

**Skills** — `getAllSkills`, `getFeaturedSkills`, `getSkillsByCategory`,
`getSkillBySlug`, `getFeaturedSkillsGrouped`, `getRepresentativeSkills`,
`getSkillEvidence`, `getSkillEvidenceLabels`

**Credentials** — `getAllCredentials`, `getFeaturedCredentials`,
`getCredentialCount`

**Derived numbers** — `getEvidenceStats`, `getMergedContributionCount`,
`getFlagshipCount`, `getPublishedPackageCount`, `getProductionSystemCount`

### Derived counts

The Hero previously hardcoded `6` and `5`. Both now derive:

| Surface | Was | Now |
|---|---|---|
| "N merged upstream PRs" | literal `6` | `getMergedContributionCount()` |
| "N published npm package" | literal `1` | `getPublishedPackageCount()` |
| "N system in production" | literal `1` | `getProductionSystemCount()` |
| Flagship stat pill | literal `5` | `getFlagshipCount()` |
| `AnimatedStats` tiles | hardcoded array | `getEvidenceStats()` |

Adding a merged PR to `content/open-source.ts` updates every surface at once.

---

## 5. Validation

`lib/content/validation.ts`, run by `npm run validate:content`, in CI before
lint and build. Pure functions, no I/O, no validation framework.

Rules: duplicate slugs/ids, kebab-case slugs, invalid status/tier/domain/
category/proof-type, duplicate `featuredRank`, featured without a rank, archived
marked featured, public source missing a URL, **private source carrying a URL**,
malformed URLs, skills referencing nonexistent projects/contributions/research,
project technologies referencing nonexistent skills, duplicate PRs, contribution
URL not matching its repo and number, merged without `mergedAt`, unverified
proof, SCAR-OS misrepresented or reverting to its old name, and Bus Reservation
System reintroduced.

The rules were confirmed to fire by injecting six deliberate defects and checking
each was reported.

---

## 6. The Supabase migration boundary

Everything above the line stays; everything below is replaced.

```
   pages/*, components/*        ← unchanged
   ────────────────────────────────────  the boundary
   lib/content/index.ts         ← unchanged (re-exports)
   lib/content/selectors.ts     ← bodies change, signatures do not
   ────────────────────────────────────
   content/*.ts                 ← replaced by Supabase queries
```

Practical notes for that phase:

1. Selectors are synchronous. Supabase is not. Either fetch in `getStaticProps`
   and pass through, or make selectors async and update call sites — a decision
   worth making before the CMS work starts, not during it.
2. `content/types.ts` should become the source for generated database types, so
   the schema and the model cannot diverge.
3. `validation.ts` should run on write in the CMS, not only in CI.

---

## 7. Duplication eliminated in Phase 2

| Was duplicated in | Now |
|---|---|
| `pages/certifications.js` had its own 6-item credential list | reads `getAllCredentials()` (all 11) |
| `pages/skills.js` had its own language + category lists | reads `getFeaturedSkills` / `getFeaturedSkillsGrouped` |
| `components/SpotlightGrid.js` used `skills.categories` | reads `getFeaturedSkillsGrouped` |
| `components/GravitySkills.js` had a hardcoded 9-skill array | reads `getRepresentativeSkills()` |
| `components/Hero.js` hardcoded `6` and `5` | derived selectors |
| `components/AnimatedStats.js` read a hardcoded `stats` array | `getEvidenceStats()` |
| `ProjectCard` visuals keyed by display title | keyed by `slug` |
| `pages/index.js` `filter(...).slice(0, 3)` | `getFeaturedProjects(3)` with explicit `featuredRank` |
| `data/portfolio.js` | deleted; `content/` is the only source |

## 8. Duplication intentionally remaining

> **Resolved in Phase 18.** `public/resume.html` was the largest entry in this
> table and is gone: `/resume` renders from the selectors, so there is no second
> copy to keep in step. It had already drifted — see
> `docs/portfolio-2026/resume-system.md`.

| What | Where | Why |
|---|---|---|
| **Studio / Hire copy** | `pages/hire.js`, `pages/studio.js` | Client-funnel marketing copy, not portfolio content. No model defined for it yet. |
| **Project card visuals** | `components/ProjectCard.js` | SVG/gradient per project. Now keyed by slug, so it cannot silently break, but it still lives beside the UI rather than in content. Reasonable — it is design, not data. |
| **"Currently learning"** | `pages/skills.js` | Deliberately not modelled as skills: there is no evidence to attach, and a skill in this model must point at real work. |
| **Hero prose vs index prose** | `Hero.js`, `index.js` | Both describe the same work in different words. Phase 4 rewrites the homepage; modelling it now would be discarded. |
| **Category icons** | `pages/skills.js` | Presentation keyed by category name. |

---

## 9. Naming — resolved

Phase 2 shipped the final-year project as **VICE OS**, flagging the brief's
inconsistent use of "SCAR-OS" as a question to confirm. It was confirmed at the
start of Phase 3: the canonical name is **SCAR-OS**, and VICE OS is the previous
name.

The rename touched five files and broke nothing, which is the slug-based identity
model working as intended:

| File | Change |
|---|---|
| `content/projects.ts` | `id`, `slug`, `title`, `researchSlug` |
| `content/research.ts` | `id`, `slug`, `title`, `projectSlug` |
| `components/ProjectCard.js` | visual key `vice-os` → `scar-os` |
| `lib/content/validation.ts` | stage rule re-pointed, plus a new rule rejecting the old name |
| `PORTFOLIO_2026_IMPLEMENTATION.md` | forward-looking checklist items |

Three things deliberately did **not** change:

1. **The GitHub repository is still `VICE-OS`.** It is private, so it publishes no
   URL and the old name is not visible on any public surface. Renaming someone's
   repository is not a portfolio-content decision.
2. **Historical documents keep the old name.** `content-audit.md` and the Phase 1
   and 2 completion notes record what was true when they were written. Rewriting
   them would falsify the record.
3. **The stage.** Still `status: research`, `tier: current-fyp`, `publicStage:
   "Current FYP — Research & Architecture Stage"`. A rename is not progress, and
   validation still rejects any attempt to present it as shipped software.

No redirect was needed: there is no `/projects/[slug]` route, and the slug appears
in no URL, sitemap entry or anchor — only as a React key and a visual-map lookup.
When case-study routes arrive (Phase 7), they will be built on `scar-os` from the
start, so no legacy URL will ever have existed.
