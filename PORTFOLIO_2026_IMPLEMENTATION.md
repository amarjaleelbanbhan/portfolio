# PORTFOLIO 2026 — CLAUDE IMPLEMENTATION TRACKER

Repository: `amarjaleelbanbhan/portfolio`  
Live site: `https://amarjaleel.me`

---

# 0. CLAUDE OPERATING RULES

Claude must read this file **before starting work in every session**.

This file is the source of truth for the portfolio upgrade.

## Mandatory Rules

- [ ] Do not try to implement the entire roadmap in one session.
- [ ] Work on **one phase at a time**.
- [ ] Before starting a phase, inspect the existing implementation related to that phase.
- [ ] Do not skip unchecked tasks.
- [ ] Do not mark anything complete unless it is actually implemented and verified.
- [ ] Preserve existing working features unless the task explicitly replaces them.
- [ ] Do not remove existing animations, transitions, effects, 3D features, interactive skill tags, or modern visual systems simply to simplify the site.
- [ ] Existing visual systems may be refactored, optimized, reorganized, or upgraded.
- [ ] Every major visual effect should communicate engineering depth, state, architecture, navigation, evidence, or storytelling.
- [ ] Do not invent project metrics, users, results, test counts, benchmarks, production claims, research claims, or open-source statuses.
- [ ] Do not expose secrets or private company/project information.
- [ ] Do not add Claude, Anthropic, AI, `Co-authored-by`, `Generated-by`, or any other AI attribution to commits, commit messages, pull requests, code comments, documentation, or repository metadata.
- [ ] Use clear normal developer commit messages written as if authored directly by Amar.
- [ ] Do not make a giant final commit. Commit phase work logically.
- [ ] Run relevant validation before every phase is considered complete.
- [ ] If a task cannot be verified, leave it unchecked and document why.
- [ ] Never silently change project claims or technical facts.
- [ ] Update this file after completing a phase.

## Required Workflow For Every Phase

1. Read this file.
2. Identify the first incomplete phase.
3. Inspect the relevant existing source.
4. Write a short implementation plan.
5. Identify regression risks.
6. Implement only that phase.
7. Run build/lint/tests relevant to the change.
8. Inspect the resulting UI/behavior.
9. Fix regressions.
10. Update checkboxes in this file.
11. Add a short phase completion note.
12. Commit the completed work.
13. Stop and report what was completed and what phase comes next.

Do **not** automatically continue through multiple major phases unless explicitly instructed.

---

# 1. TARGET PORTFOLIO POSITIONING

The upgraded portfolio must make it clear that Amar works across:

- Software / Product Engineering
- Security & Developer Tools
- Applied AI / RAG Research Engineering
- Mobile & Systems Engineering
- Open Source

The portfolio must not look like:

- a generic student portfolio
- a certification showcase
- a plain resume website
- a visual-effects demo with weak engineering evidence
- an AI-generated template

The site itself should demonstrate:

- advanced frontend engineering
- motion design
- 3D/WebGL capability
- responsive engineering
- accessibility
- performance adaptation
- content architecture
- evidence-driven technical communication

---

# 2. TARGET MAIN NAVIGATION

Eventually move toward:

- Home
- Work
- Research
- Open Source
- About
- Work With Me

Secondary actions:

- GitHub
- Resume

Existing routes must not be deleted before replacements are verified.

---

# PHASE 0 — FETCH, RUN, AND UNDERSTAND THE EXISTING PORTFOLIO

**Goal:** Understand the real repository before modifying anything.

## Repository

- [x] Fetch/pull the latest `amarjaleelbanbhan/portfolio`.
- [x] Confirm active branch.
- [x] Record latest relevant commits.
- [x] Inspect `package.json`.
- [x] Identify Next.js/React versions.
- [x] Identify major dependencies.
- [x] Inspect folder structure.

## Existing Pages / Routes

Inspect:

- [x] `/`
- [x] `/projects`
- [x] `/skills`
- [x] `/certifications`
- [x] `/contact`
- [x] `/hire`
- [x] `/studio`
- [x] `/studio/request`
- [x] `/studio/admin`
- [x] API routes
- [x] resume route/file
- [x] error/404 behavior

## Existing Visual Systems

Locate and document:

- [x] Framer Motion usage
- [x] GSAP usage
- [x] Three.js usage
- [x] React Three Fiber usage
- [x] Drei usage
- [x] particle effects
- [x] scroll effects
- [x] hero effects
- [x] skill animations
- [x] hover effects
- [x] route/page transitions
- [x] reduced-motion handling
- [x] mobile fallbacks

## Existing Data

Inspect:

- [x] `data/portfolio.js`
- [x] personal information
- [x] project data
- [x] skill data
- [x] certification data
- [x] achievements
- [x] stats
- [x] education
- [x] experience

## Existing Backend/Admin

Inspect:

- [x] Supabase integration
- [x] lead API
- [x] Studio request form
- [x] authentication
- [x] admin session handling
- [x] lead status changes
- [x] RLS assumptions
- [x] environment variables
- [x] security risks

## SEO

Inspect:

- [x] canonical URLs
- [x] Open Graph
- [x] JSON-LD
- [x] robots.txt
- [x] sitemap
- [x] page titles
- [x] descriptions
- [x] domain consistency

## Validation

- [x] Install dependencies.
- [x] Run build.
- [x] Run lint if configured.
- [x] Run tests if configured.
- [x] Record existing failures without fixing unrelated ones.

## Deliverable

Create:

`docs/portfolio-2026/current-state.md`

It must contain:

- architecture
- routes
- data model
- visual systems
- admin/backend
- SEO
- reusable components
- risks
- current validation results

## Phase Completion

- [x] Phase 0 complete
- [x] Current-state document created
- [x] No product changes made

### Completion Notes

Completed 2026-09-18. Deliverable: `docs/portfolio-2026/current-state.md`.

No product changes were made during Phase 0.

Key findings:

- `npm run lint` was silently broken. `next lint` was removed in Next.js 16, so
  the script misparsed `lint` as a directory and exited 0 without linting
  anything. Real ESLint reported 18 errors / 3 warnings.
- `_document.js` emitted a canonical pointing at `https://amarjaleel.dev` on every
  page. That domain does not resolve. `/studio` and `/studio/request` each emitted
  a second, conflicting canonical.
- The homepage had no `<title>` at all.
- `og:image`, `/favicon.ico` and `/apple-touch-icon.png` all 404'd in production,
  so no social share had a preview image.
- The hero portrait was a 5.96 MB PNG saved with a `.jpg` extension, eagerly
  preloaded into a 384px circle. Four copies existed across two directories.
- `_app.js` forced the ~7s hacker boot screen onto `/hire` and `/studio/request`,
  so the client funnel opened with "DECRYPTING PORTFOLIO DATA...".
- Content is duplicated across six locations and has already drifted: 9 projects
  vs a "10+" stat, 11 certifications vs 6 rendered, and two different verify URLs
  for the same credential.
- ~2,400 lines of unreferenced Codex Infinitum code remain under `lib/`, `store/`
  and `styles/`.
- `supabase/.temp/` was committed and pointed at a different Supabase project than
  the one the application uses.

---

# PHASE 0.5 — STABILIZATION & SALVAGE

**Goal:** Fix what is actively broken and preserve what is valuable, before any
redesign begins. No new portfolio features.

## SEO / Metadata Foundation

- [x] Replace `amarjaleel.dev` references with `amarjaleel.me`.
- [x] Remove conflicting global/per-page canonical tags.
- [x] Remove duplicate description/robots metadata.
- [x] Add a proper homepage `<title>`.
- [x] Fix `og:url`.
- [x] Add and wire an Open Graph image.
- [x] Fix favicon.
- [x] Fix Apple touch icon.
- [x] `/studio/admin` emits clean `noindex,nofollow,noarchive`.
- [x] All existing routes still functional.
- [x] Verified against generated HTML.

## Hero Asset Optimization

- [x] Use `next/image`.
- [x] Produce optimized responsive assets.
- [x] Correct `sizes`.
- [x] No multi-megabyte images shipped.
- [x] Remove unused duplicate hero images after verifying references.
- [x] Hero visual design unchanged.

## Development Quality Gate

- [x] Repair `npm run lint` under Next.js 16.
- [x] Run real ESLint.
- [x] Fix all existing lint errors.
- [x] No legitimate rules silenced.
- [x] Behavior preserved.
- [x] `npm run lint` performs real linting and passes.

## CI

- [x] Workflow on pull requests and pushes to `main`.
- [x] Install, lint, build.

## Repository Hygiene

- [x] `.veripatch/` ignored.
- [x] `supabase/.temp/` inspected and untracked.
- [x] No required production configuration removed.
- [x] Stale files inspected before removal.

## Chrome Separation

- [x] Portfolio routes keep the full cinematic visual system.
- [x] Client routes keep the Studio design without the boot sequence.
- [x] Admin has a clean control-center environment.
- [x] LoadingScreen, ParticleNetwork, scanlines and animation components retained.

## Supabase Security Review

- [x] Anonymous SELECT/UPDATE/DELETE verified blocked.
- [x] Public signup status determined.
- [x] Committed project-ref discrepancy explained.
- [x] Findings documented, not guessed.
- [x] No RLS weakened.
- [ ] Owner-scoped authenticated read confirmed — **requires dashboard access.**
- [ ] Public signup disabled — **requires dashboard access.**

## Codex Infinitum Salvage Audit

- [x] Every subsystem classified KEEP / ADAPT / DELETE.
- [x] `docs/portfolio-2026/codex-salvage-audit.md` created.
- [x] Nothing deleted from the subsystem during this phase.

## Validation

- [x] Clean install.
- [x] `npm run lint` passes.
- [x] `npm run build` passes.
- [x] `/`, `/projects`, `/skills`, `/hire`, `/studio`, `/studio/request` and
      `/studio/admin` manually verified.
- [x] Portfolio animations still present.
- [x] Studio routes no longer inherit portfolio boot effects.
- [x] No broken assets.
- [x] No console-breaking errors.

## Phase Completion

- [x] Phase 0.5 complete

### Completion Notes

Completed 2026-09-18. Deliverables: `docs/portfolio-2026/codex-salvage-audit.md`
and `docs/portfolio-2026/supabase-security-review.md`.

**Metadata.** Title, description, canonical, OG and robots tags now all come from
a single `<Seo>` component. `_document.js` keeps only site-wide invariants (icons,
fonts, JSON-LD). Verified against served HTML: every route emits exactly one
description, one canonical and one robots tag, all on `amarjaleel.me`.
`/studio/admin` no longer emits a conflicting `index, follow`. Canonical is
omitted on `noindex` pages so `/404` does not self-canonicalise to a URL that
404s. Added `/studio/request` to the sitemap and `Disallow: /studio/admin` to
robots.txt.

**Assets.** The "hero-portrait.jpg" was actually a 2579x3440 PNG. A 1600px
archival master now lives in `assets/` (outside `public/`, never served) and
`scripts/generate-assets.mjs` derives every public asset from it using the `sharp`
that already ships with Next, so no dependency was added. The hero went from
5,964,416 to 97,075 bytes (98.4% smaller), and `next/image` serves it at 384x511
rather than full resolution. The same script generates the OG card, favicon.ico,
apple-touch-icon and PWA icons. Removed four oversized duplicates across
`public/images/` and a root-level `images/` directory that was never served.

**Lint.** `next lint` replaced with `eslint . --max-warnings 0`. All 18 errors and
3 warnings fixed at the cause; nothing suppressed:

- `_app.js` reads the boot-played flag via `useSyncExternalStore` instead of
  setting state in a mount effect.
- `Navbar` closes the mobile menu by adjusting state during render (React's
  documented "reset state when a value changes" pattern) instead of an effect.
- `Hero`'s typing cycler advances on its existing timer rather than synchronously.
- `GravitySkills`' `isClient` state was redundant, since the component is imported
  with `ssr: false`, so it was removed entirely.
- `SecretProject` derives the match percentage during render; the unlock latches
  from the slider handlers.
- `SpotlightGrid` measures each card once via a ref callback and derives intensity
  during render, replacing a setState per card per mousemove.
- `TerminalGame` resolves the win in the click handler.
- `SkillCube` captures the container node for cleanup, and `admin.js` wraps
  `loadLeads` in `useCallback`.

**Chrome separation.** `lib/routeChrome.js` maps a pathname to `portfolio`,
`client` or `admin`. Portfolio is the default so future public pages inherit the
visual system automatically. Verified in a browser: `/hire` with a cleared session
paints instantly with no boot screen; `/studio/admin` reports 0 canvases, 0
scanlines and 0 scroll bars; `/` still plays the full boot sequence with
particles, orbit rings and the typing cycler intact.

**Regression caught during validation.** Wrapping `loadLeads` in `useCallback`
turned a hoisted function declaration into a `const`, putting it in the temporal
dead zone for the effect declared above it. The build failed prerendering
`/studio/admin` with `ReferenceError: Cannot access 'H' before initialization`.
Fixed by moving the definition above its consumer.

**Supabase.** Anonymous SELECT, UPDATE and DELETE are all correctly blocked
(401 / PostgREST `42501`). Anonymous INSERT was deliberately not tested, since it
would have written a junk row that `anon` cannot delete.

Public signup is enabled (`disable_signup: false`). Commit `b97d5a0` removed the
signup form but the GoTrue `/auth/v1/signup` endpoint is still open. Whether that
exposes lead data depends on the `SELECT` policy's role scope, which cannot be
read from here because the project is not in the reachable organisation. The two
dashboard actions are left unchecked above.

**Deliberately out of scope:** the particle canvas painting over body text, the
latent 666px-vs-638px horizontal overflow masked by `overflow-x: clip`, content
duplication and the 9-vs-"10+" drift (Phase 1/2), the fabricated "Autonomous Drone
Swarm" project in `SecretProject.js` (Phase 1), the stale `README.md` and
`PROJECT_STATUS_REPORT.md`, and admin token refresh (Phase 21).

---

# PHASE 1 — CREDIBILITY AND CONTENT CORRECTIONS

**Goal:** Fix factual problems before visual rebuilding.

## Domain / SEO

Completed during Phase 0.5 — see that phase's notes.

- [x] Replace incorrect `amarjaleel.dev` canonical references with `amarjaleel.me`.
- [x] Correct Open Graph URLs.
- [x] Correct JSON-LD URLs.
- [x] Confirm sitemap domain.
- [x] Confirm no stale `.dev` references remain in application code.
      (`LINKEDIN_POST.md` still carries one, but it is an unfinished marketing
      draft that also contains a `YOUR_PORTFOLIO_URL` placeholder and is not
      shipped — handle with the rest of the content review.)

## Incorrect / Weak Claims

- [x] Remove or correct `11 Google certs`. (9 Google + 2 Udemy; count no longer claimed as Google.)
- [x] Remove arbitrary vanity counters unless verified and useful.
- [x] Remove dead Bus Reservation System portfolio reference.
- [x] Review MediTalk positioning.
- [x] Reframe MediTalk as historical ML prototype if retained.
- [x] Remove any medical-diagnosis credibility overclaim.
- [x] Check all project repository/demo links.

## Secret Project

- [x] Remove the fabricated stealth-project reveal.
- [x] Preserve the puzzle, sliders, canvas, unlock animation and confetti.
- [x] Replace with a truthful reveal plus links to real work.

## Positioning

- [x] Move away from `AI Product Engineer | Cybersecurity | Data Analytics`.
- [x] Drop `Data Analytics Engineer` as an identity.
- [x] Centre on Software Engineer across the five real domains.
- [x] Update title, tagline, typing roles, JSON-LD, page metadata and footer.

## Skills

- [x] Remove unsupported proficiency percentages.
- [x] Retain skill visuals and interactions (SkillCube, GravitySkills, SpotlightGrid).
- [x] Replace percentages with the projects each language was used in.
- [ ] Skill Galaxy — deliberately not built (Phase 16).

## Certifications

- [x] Reconcile the duplicated certification sources into one temporary source of truth.
- [x] Verify title, issuer, date and credential URL for all 11.
- [x] Correct the Google Cybersecurity card, which linked to a Data Analytics credential.
- [x] Stop displaying `11 Google Certifications`.
- [x] Reframe credentials as supporting evidence.

## Resume

- [x] Replace stale resume content.
- [x] Add current serious engineering work.
- [x] Add selected open-source evidence.
- [x] Ensure resume claims match portfolio claims.
- [x] Add portfolio URL and GitHub.

## Open Source Evidence

- [x] Verify all seven contributions against the GitHub API.
- [x] Surface them on the portfolio (interim placement on `/projects`).
- [ ] `/open-source` page — deliberately not built (Phase 14).

## Project Status

Assign honest statuses:

- [x] RODIFT — Production
- [x] VeriPatch — Released
- [x] KnowledgeGuard — Research
- [x] CortexWard — Pre-alpha
- [x] SceneForge — Active Development
- [x] Emergency Mesh — Active Development
- [x] CS Learning by Game — Active Development
- [x] VICE OS — Research (Current FYP — Research & Architecture Stage)
- [x] BuildSphere — Prototype
- [x] TODO Tracker Pro — Completed (not published to the Marketplace)
- [x] ZakatLink / Smart Notebook / EduResource Hub / MediTalk — Archived

Recommended status vocabulary:

- Production
- Released
- Active Development
- Research
- Prototype
- Pre-alpha
- Completed
- Archived

## Content Duplication

- [x] Reconcile obviously conflicting values.
- [x] Eliminate direct factual contradictions.
- [x] Document remaining duplication in `docs/portfolio-2026/content-audit.md`.
- [ ] Full canonical migration — deliberately deferred (Phase 2).

## Validation

- [x] Build succeeds.
- [x] Lint passes.
- [x] No broken internal project links.
- [x] No known false headline stats remain.
- [x] Metadata uses `.me`.
- [x] All 38 rendered outbound links checked.
- [x] Advanced visuals preserved (ParticleNetwork, Hero orbit system, typing
      animation, GravitySkills, SkillCube, SpotlightGrid, GlitchText,
      TerminalGame, SecretProject).

## Phase Completion

- [x] Phase 1 complete

### Completion Notes

Completed 2026-09-18. Deliverable: `docs/portfolio-2026/content-audit.md`.

**Evidence first.** Nothing was written from the brief alone. Every project,
status, contribution and credential was verified on 2026-09-18 against the
authenticated GitHub API, the npm registry, and live HTTP checks. Where evidence
was weaker than the brief's suggested status, the weaker status was used.

**Claims removed.** "11 Google certs" (the set is 9 Google + 2 Udemy),
"9 shipped projects", "500+ commits", "Projects Completed 10+" (only 9 were
listed), "Courses Completed 15+", "Certifications 11+", "2026 Latest Issued"
(the newest credential is Nov 2025), MediTalk's "85% accuracy", and the
self-assigned skill percentages.

**Real defect found.** `/certifications` linked the Google Cybersecurity card to
credential `U2DN4IX0N6H7`, which resolves to a **Google Data Analytics**
certificate. Fetching both pages and comparing their contents exposed it. The
page now reads from the single reconciled source with the correct
`MDMFD7XJJXL4`.

**Dead link.** `Bus-Reservation-System` returns 404; the project was removed
rather than left with a broken repository button.

**Fabricated project.** `SecretProject.js` revealed an "Autonomous Drone Swarm …
currently in stealth mode" that does not exist. The reveal is now an honest
"ACCESS GRANTED / you found one of the hidden experiments" message that explains
what the puzzle actually is and links to the portfolio source and CortexWard. The
puzzle, sliders, wave canvas, unlock latch and confetti are all untouched.

**Private repositories.** Five of the ten strongest projects are private
(RODIFT, KnowledgeGuard, SceneForge, Emergency Mesh, VICE OS). They are listed
with a "Private repository" marker instead of a repo button, so no visitor hits a
404. RODIFT is client work and is described without naming the organization.

**Regression caught during validation.** Grouping `/projects` by tier, I had
switched the cards from `animate` to `whileInView`. A jump-scroll that skips past
elements can leave them at `opacity: 0`, which a screenshot confirmed. Reverted to
the page's original `animate` semantics so content is never gated behind scroll.

**Visual system extended, not reduced.** The new flagship projects would have
fallen back to the generic placeholder icon, so bespoke card visuals were added
for RODIFT, KnowledgeGuard, CortexWard, SceneForge, Emergency Mesh, VICE OS and
MediTalk, and the two stale entries removed. All 14 projects now have a real
visual.

**Correction to the brief.** "loop-engineering #395 / #437" are in
`cobusgreyling/loop-engineering`, not `block/goose` — `goose#395` and `goose#437`
are unrelated PRs by a different author.

**Not done, by design:** `/open-source`, `/research`, the Skill Galaxy, case
studies, the homepage redesign, and the Phase 2 canonical migration.

---

# PHASE 2 — CANONICAL CONTENT MODEL

**Goal:** Stop scattering project truth across unrelated components.

Do not build the admin CMS yet.

First create a stable canonical data model that the existing site can consume.

## Data Types

Create structured models for:

- [x] Project
- [x] ResearchProject
- [x] OpenSourceContribution
- [x] Technology
- [x] SkillEvidence
- [x] ProofItem
- [x] Credential
- [x] Experience
- [x] SiteContent

## Project Model Should Support

- [x] id
- [x] slug
- [x] title
- [x] short description
- [x] long description
- [x] category/domain
- [x] status
- [x] visibility
- [x] featured
- [x] priority
- [x] repository URL
- [x] demo URL
- [x] package URL
- [x] problem
- [x] solution
- [x] role
- [x] architecture
- [x] technical depth
- [x] verification
- [x] limitations
- [x] stack
- [x] proof
- [x] media
- [x] SEO fields
- [x] published date
- [x] updated date

## Proof Types

Support:

- [x] Test Suite
- [x] Production Release
- [x] Benchmark
- [x] Merged PR
- [x] Package Release
- [x] Deployment
- [x] Research Result
- [x] CI
- [x] Demo
- [x] User Evidence

## Initial Canonical Projects

Registry entries created with verified summary, status, tier, links,
source visibility and proof. Deep case-study fields (architecture, technical
depth, verification write-ups) remain intentionally empty until the case-study
phases supply real material.

Populate verified content for:

- [x] RODIFT
- [x] VeriPatch
- [x] KnowledgeGuard / EGB
- [x] CortexWard
- [x] SceneForge
- [x] Emergency Mesh
- [x] CS Learning by Game
- [x] BuildSphere
- [x] TODO Tracker Pro
- [x] VICE OS

## Validation

- [x] Existing pages can read from canonical data.
- [x] No major visual redesign yet.
- [x] Build succeeds.

## Phase Completion

- [x] Phase 2 complete

### Completion Notes

Completed 2026-09-18. Deliverable: `docs/portfolio-2026/content-architecture.md`.

**Architecture.** `content/*.ts` holds typed canonical content; `lib/content/`
exposes selectors and validation; UI imports only from `@/lib/content`. That
boundary is the point — swapping the static files for Supabase changes selector
bodies, not pages or components. `data/portfolio.js` is deleted; there is no
second source.

Content is TypeScript while the UI stays JavaScript, so the models are genuinely
type-checked during the Next build, and `npm run validate:content` can load the
same modules outside Next through Node's type-stripping loader. `enum` is avoided
throughout for that reason.

**Identity.** Every entity has a stable slug. `ProjectCard` visuals are keyed by
`project.slug` rather than display title, so renaming a project can no longer
silently drop it to the generic fallback. Verified: 14 projects, 14 visual keys,
0 fallbacks rendered, 0 stale keys.

**Status vs tier separated.** `status` records where work actually is;
`tier` records portfolio importance. Featured ordering is explicit via
`featuredRank`, replacing `filter(...).slice(0, 3)`, which had made array
position the definition of importance.

**Private work is first-class.** `source.visibility` is modelled, and validation
fails if a private project carries any repository URL — the case that would
render a broken Code button. Five of the ten strongest projects are private and
render an honest marker instead. RODIFT's evidence (a tagged release, a
published privacy policy) needs no source URL, which is exactly what the optional
`sourceUrl` on proof is for.

**Links are explicit.** `repository`/`demo`/`package`/`documentation`/`report`/
`release`/`privacyPolicy` replace the ambiguous `link`+`github` pair. VeriPatch's
npm URL now renders as "Package" rather than being mislabelled "Live Demo", and
RODIFT surfaces its privacy policy — both fell out of the model for free.

**Counts derive.** The hardcoded `6` and `5` in Hero, and the hardcoded stats
array, now come from `getMergedContributionCount()`, `getFlagshipCount()`,
`getPublishedPackageCount()`, `getProductionSystemCount()` and
`getEvidenceStats()`. Adding a merged PR updates every surface at once.

**Validation.** 20+ rules in `lib/content/validation.ts`, wired into CI ahead of
lint and build. Confirmed working by injecting six deliberate defects (private
repo leaking a URL, duplicate featuredRank, VICE OS marked released, archived
project featured, technology pointing at a nonexistent skill, skill pointing at a
nonexistent project) and checking each was reported. No validation framework was
added.

**Two real defects found and fixed during the phase.** The skills page rendered
"loop-engineering · loop-engineering" because two contributions share a
repository — evidence labels are now de-duplicated. And the Twitter/X link was
dead: `twitter.com/ajbanbhan` and `x.com/ajbanbhan` both 404 while a control
handle returns 200. Phase 1 saw a 301 and did not follow the redirect. The handle
is removed from `profile.ts` with an explanatory comment, social links are now
derived via `getSocialLinks()` so they render only what exists, and JSON-LD
`sameAs` derives from the same source.

**A third defect, found in the Phase 2 re-audit.** `components/GravitySkills.js`
was still reading a hardcoded nine-item array — the architecture doc already
claimed it read from the content layer, so the claim was ahead of the code. The
array had also drifted: it advertised TensorFlow, Linux and Cybersecurity, none
of which exist in the skill registry with evidence behind them. It now uses
`getRepresentativeSkills()`, which takes the highest-ranked featured skill per
category. That rule is explicit rather than positional, so appending a skill
cannot silently change what renders, and it returns nine labels — the same body
count, so the Matter.js physics is untouched.

**Repository docs.** README rewritten to describe the real stack (Next.js 16,
React 19, a Supabase-backed API route — not "static only") and the content
workflow. `PROJECT_STATUS_REPORT.md`, `suggestion.md` and `Data.md` moved to
`docs/archive/` with headers marking them historical. `LINKEDIN_POST.md` removed:
an unfinished template containing a placeholder URL and the dead `.dev` domain,
with no historical value.

**Naming to confirm:** the brief says "SCAR-OS" in one section and "VICE OS" in
two others. The repository is `VICE-OS`, so VICE OS was used. A rename is now a
slug change in two content files.

**Not done, by design:** no Supabase tables, no CRUD, no admin editors, no
Skill Galaxy, no case studies, no homepage redesign, and the resume was left as
Phase 1 corrected it — its remaining duplication is documented for Phase 18.

---

# PHASE 3 — DESIGN SYSTEM AND MOTION SYSTEM

**Goal:** Create reusable visual rules before rebuilding pages.

Do not remove the existing modern visual identity.

## Design Tokens

Create/refine:

- [x] background tokens
- [x] surface tokens
- [x] border tokens
- [x] text hierarchy
- [x] spacing
- [x] radii
- [x] shadows
- [x] domain accent system

Suggested domain mapping:

- Product → teal
- AI → violet
- Security → amber/red
- Systems → blue
- Research → purple
- Open Source → green

Do not turn the whole site into rainbow UI.

## Typography

- [x] Inter for normal UI/body where appropriate.
- [x] JetBrains Mono for technical metadata/code.
- [x] Display styling used sparingly.

## Motion Tokens

Create shared motion settings:

- [x] fast
- [x] normal
- [x] slow
- [x] cinematic
- [x] shared easings
- [x] reduced-motion variants

## Reusable Effects

- [x] section reveal
- [x] project depth hover
- [x] architecture line animation
- [x] tag expansion
- [x] proof reveal
- [ ] navigation transitions — deferred; the navbar is rebuilt in Phase 4/5 and
      a transition designed against the current one would be discarded.
- [x] modal/drawer transitions
- [ ] media parallax — deferred to Phase 4, which introduces the first media
      surfaces that need it.
- [ ] route/page transition strategy — deferred to Phase 4. Pages Router route
      transitions interact with the boot sequence and scroll restoration, and
      that is a decision to make with the new homepage, not before it.

## Accessibility

- [x] Effects respect reduced-motion preference.
- [x] Keyboard interaction remains possible.
- [x] Visual-only data also exists in semantic DOM.

## Phase Completion

- [x] Phase 3 complete

### Completion Notes

Completed 2026-09-19. Deliverable:
`docs/portfolio-2026/design-motion-system.md`.

**Almost nothing changed visually, on purpose.** The phase moved values that
already existed into one place. `#07111f`, `#14b8a6`, the `rgba(10,15,28,0.55)`
card fill and `cubic-bezier(0.16, 1, 0.3, 1)` were literals repeated across
`globals.css` and `tailwind.config.js`; they now have names in
`styles/tokens.css`. No colour or curve was re-picked.

**Token architecture salvaged, palette replaced.** The Codex `tokens.css` was
classified ADAPT, and that was right: the `@property` registration, scale shape,
z-index ladder and reduced-motion contract were the correct structure, while its
`--void: #050508` near-black and 15 realm palettes clashed with the live
identity. `[data-realm]` became `[data-domain]`, keyed one-to-one to the
canonical `Domain` union, so a domain colour is derived from content rather than
chosen per component. `lib/realms.ts` and `styles/universe.css` were removed as
the audit scheduled for this phase.

**The motion system encodes the Phase 1 regression rule.** Entrance presets
animate on mount; nothing in the shared system triggers on scroll intersection.
That is the bug that left `/projects` cards at opacity 0 after a jump-scroll, and
a rule inside the system survives copy-paste in a way a comment on one page does
not. Verified in a production build: jumping straight to the bottom of `/`,
`/projects` and `/skills` leaves 0 on-screen elements below 0.05 opacity.

**Framer Motion had been ignoring reduced motion entirely.** CSS collapsed the
token-driven transitions, but Framer never reads CSS, so every motion component
kept animating. `MotionConfig reducedMotion="user"` in `_app.js` fixes it
globally — transform and layout animation stop while opacity still resolves, so
content ends visible rather than stranded at its initial state.

**Both documented defects fixed at the cause, and measured.**

The particle canvas was `position: fixed; z-index: 0` inside `#__next`. Within a
stacking context a positioned element with z-index 0 paints above *unpositioned*
block and inline content — so any page without a positioned wrapper had its body
text painted over, which is exactly why only `/skills` showed it. Moving the
canvas to a negative index fixes every page at once instead of adding
`relative z-10` to each section forever.

Horizontal overflow measured 34px on `/` at 375px with `overflow-x: clip`
temporarily lifted — the clip clamps `scrollWidth`, so the defect reads as 0
until you remove it. The cause was the Education timeline: rows enter with
`x: ±50` while the mobile layout is a single full-width column, and because they
used `whileInView` the offset persisted below the fold rather than being
transient. Now 0px at both 375px and 1280px. The clip stays as a backstop and is
commented as one. Hero's three decorative glows still extend past the viewport
but are clipped by Hero's own `overflow-hidden` and contribute nothing to
`scrollWidth`.

**R3F proven, not assumed.** R3F, drei and postprocessing had been in
`package.json` for a long time without ever being imported or built here — the
salvage audit called the stack unproven ground. `components/three/SceneCanvas.js`
is now the single boundary handling capability, visibility, reduced motion, DPR
and fallback, and `pages/dev/r3f-probe` (noindex, robots-disallowed, unlinked)
renders a lit shaded mesh through it. Measured tier 1 on the test machine, WebGL
true, 538x318 canvas.

**A real bug found while verifying.** GravitySkills called
`render.canvas.remove()` on cleanup. The canvas belongs to React, not Matter, so
detaching it left the physics drawing into an orphaned element on any re-mount —
and StrictMode re-mounts every time, so the canvas was missing entirely in
development while working in production. Removing that one line fixed it in both.

**Existing effects adapted, never removed.** SkillCube keeps its scene,
materials, lighting and rotation speeds and gained off-screen pausing, a
tier-capped pixel ratio and a static frame under reduced motion. ParticleNetwork
thins to 45/30 particles on weaker tiers rather than switching off. GravitySkills
keeps Matter.js untouched. SpotlightGrid, GlitchText, SecretProject and
TerminalGame were not touched at all.

**Browser-verified** against a production build with Chrome: 9 routes at 200, 0
console errors, 14 project cards, SkillCube and GravitySkills both rendering and
the physics canvas confirmed animating by pixel diff, reduced-motion tokens
collapsing to 0s, and `/hire`, `/studio/request` and `/studio/admin` each
reporting 0 ambient canvases, 0 scanlines and 0 scroll bars.

**Deferred with reasons, not silently:** navigation transitions, media parallax
and the route/page transition strategy are all left unchecked above — each is a
decision that belongs with the Phase 4 homepage rather than one made against a
navbar and page shell that Phase 4 replaces.

**Known residual risk:** `pages/skills.js` still uses `whileInView` in four
places. It verifies clean under jump-scroll today, so it was not rewritten for
its own sake, but it is the pattern the shared system now forbids and the next
phase to touch that page should migrate it.

---

# PHASE 4 — HOMEPAGE HERO + ENGINEERING CORE 3D EXPERIENCE

**Goal:** Replace generic visual noise with a memorable engineering identity while keeping ambitious visuals.

## Hero Copy

Headline:

`I build software systems where AI, security, and product engineering meet.`

Supporting direction:

Amar is a Computer Science student and software engineer building production software, developer/security tools, research systems, and experimental systems software.

## CTA

- [x] Explore Engineering Work
- [x] View Open Source
- [x] Work With Me

## 3D Engineering Core

Create a central engineering system with domains:

- [x] PRODUCT
- [x] AI
- [x] SECURITY
- [x] SYSTEMS
- [x] OPEN SOURCE

## Technology Nodes

Derived through `getDomainSummary()`; curated ordering is validated against the
skill registry and the domain's own projects, so no node can advertise work that
was not done.

- [x] Product: Flutter, Next.js, PostgreSQL, Supabase
- [x] AI: RAG, Agents, Evaluation, Python
- [x] Security: Static Analysis, Docker, CLI, Node.js
- [x] Systems: BLE, Cryptography, FFmpeg, Kotlin
- [x] Open Source: pydantic-ai, promptfoo, loop-engineering, MCTS (derived from merged PRs)

## Interaction

- [x] Hover highlights domain.
- [x] Related technologies become visible.
- [x] Unrelated nodes dim.
- [x] Clicking domain navigates/scrolls appropriately.
- [x] Mouse movement adds restrained parallax.
- [x] No forced uncontrolled camera spinning.

## Performance Tiers

### Tier A
- [x] Full desktop 3D.
- [x] particles/connections.
- [ ] scroll camera effects where useful — deferred to Phase 5, which introduces
      the scroll narrative the camera would respond to. `CameraRig` already
      accepts a target, so this is a prop, not a rewrite.

### Tier B
- [x] Reduced mobile particle count.
- [x] reduced postprocessing.
- [x] lower DPR.

### Tier C
- [x] Static/SVG/2D fallback.
- [x] no loss of information.

## Phase Completion

- [x] Phase 4 complete

### Completion Notes

Completed 2026-09-19. Deliverable: `docs/portfolio-2026/engineering-core.md`.

**The core is a schematic, not a planet.** A decorative sphere would have been
easier and said nothing. Instead each link's brightness is derived from real
evidence — non-archive project count per domain, merged PRs for Open Source — so
the picture is weighted by what actually exists and reweights itself when content
changes. Node satellites are the domain's real technologies, one mote each.

**The headline is the legend.** "AI", "security" and "product engineering" are set
in the same domain accents the core uses, so the colour language is taught by the
sentence before the diagram uses it. It cost nothing and it is the one deliberate
flourish; everything around it stayed disciplined.

**Nothing was deleted to make room.** The portrait, both orbit rings, both
orbiting dots and the availability badge became `PortraitOrbit.js` with a `size`
prop, and now sit beside the headline as a compact identity anchor rather than a
second main visual. Typing cycler, GlitchText, floating chips, depth washes,
particles and scanlines all remain; the chips were dimmed from 0.55 to 0.32 peak
so they read as ambience instead of competing with the domain labels.

**No second source of facts.** `content/domains.ts` holds only label, description,
destination and ring angle. Projects, technologies, counts and colours are all
derived by `getDomainSummary()`. Seven new validation rules make the curated
ordering safe: a technology must exist in the skill registry *and* be used by a
non-archive project in that domain, destinations must be routes that exist today,
anchors must match real project slugs, ring angles must be unique. Each was
confirmed to fire by deliberately breaking it.

Deriving the technology lists was tried and abandoned for a good reason worth
recording: ranking by exclusivity opened Product with "WebGL, FFmpeg, Headless",
and ranking by frequency surfaced Node.js everywhere. Curated ordering with
enforced facts is the honest version.

**No GSAP.** The salvaged `cinematicCamera.ts` animates CSS 2D transforms and is
the repo's only GSAP consumer; what carried over is its act structure and
reduced-motion contract, not its code. The camera is critically-damped
interpolation inside the frame loop `SceneCanvas` already owns, with delta
clamped so a backgrounded tab cannot cause a jump.

**Two real defects found by browser testing, both fixed at the cause.**
`SceneCanvas` sets `relative` on its own root and was being handed `absolute
inset-0`; Tailwind emits `.relative` after `.absolute`, so the class was
overridden and the canvas collapsed to 515x147 instead of square. And
`GlitchText` renders a `<div>`, which is invalid inside the new `<p>` — the
browser closed the paragraph, server and client markup disagreed, and React threw
hydration error #418. `GlitchText` gained an `as` prop rather than losing the
effect.

**A third issue browser testing surfaced:** on touch, tapping a domain navigates
immediately, so the description was unreachable on a phone — hover-gated
information with no hover. The narrow layout now renders every description and
technology inline as a card list, so nothing is behind an interaction that cannot
happen.

**Measured.** `/hire` loads 598 KB of static JS+CSS against 1748 KB on `/`, so the
3D stack is genuinely route-scoped and never reaches the client funnel or admin.
`domInteractive` 148 ms — the headline never waits on WebGL. Scrolled off-screen,
the canvas stops producing frames. Three mount/unmount cycles leak no canvases.
No horizontal overflow at 360, 390 or 430 px. Zero console errors.

**Browser-verified** against a production build: five domains render; hover, focus
and tap each highlight and dim correctly; all five destinations resolve to real
anchors; all five are keyboard reachable with descriptions exposed via
`aria-describedby`; WebGL-disabled falls back to the 2D SVG core with every
domain and link intact; reduced motion renders the static core with nothing left
invisible; `/hire`, `/studio/request` and `/studio/admin` contain zero core
elements and zero canvases.

**Not done, by design:** no scroll story, no case studies, no Research or Open
Source page, no Skill Galaxy, no CMS. Scroll-linked camera is left unchecked
above — it belongs with the Phase 5 narrative it would respond to.

---

# PHASE 5 — HOMEPAGE ENGINEERING STORY

**Goal:** Turn scrolling into an engineering narrative.

Narrative:

`BUILT -> VERIFIED -> RESEARCHED -> SYSTEMS -> CONTRIBUTED`

## BUILT — RODIFT

- [x] Visualize field report -> backend -> assignment -> notification -> resolution.
- [x] Use Flutter / Next.js / Supabase / PostgreSQL / PostGIS / FCM evidence.
- [x] Do not expose private company data.

## VERIFIED — VeriPatch

- [x] dependency graph
- [x] vulnerability
- [x] sandbox
- [x] rescan
- [x] build/test
- [x] evidence report

## RESEARCHED — KnowledgeGuard

- [x] query
- [x] retrieved evidence
- [x] deficiency type
- [x] repair action
- [ ] measured result — deliberately not shown. The canonical research record
      states the factorial was executed and the analysis completed, and publishes
      no results, so the grid is uniform and carries no numbers. This unchecks
      until the study is publishable; inventing a chart would have been the only
      way to tick it.

## SYSTEMS — Emergency Mesh

- [x] node discovery
- [x] encrypted message
- [x] forwarding/store
- [x] ACK
- [x] clearly label simulation where relevant

## CONTRIBUTED — Open Source

- [x] transition into upstream repository contributions
- [x] merged/open status visible
- [x] no contribution score

## Phase Completion

- [x] Phase 5 complete

### Completion Notes

Completed 2026-09-19. Deliverable:
`docs/portfolio-2026/homepage-engineering-story.md`.

**Five stages, not five cards.** Each has a diagram built for its own engineering
problem — a connected application flow, a verification pipeline with an explicit
isolation boundary, a factorial grid, a BLE network, a contribution graph — drawn
from one shared vocabulary of nodes, links and pulses so the five read as one
directed piece rather than the same sphere relabelled.

**Authored copy, derived facts.** `content/story.ts` holds only what cannot be
looked up: titles, explanation, step labels, caveat, destination. Statuses,
technologies, proof, limitations, contribution URLs and counts are all resolved
through `getStoryStages()`. Nine validation rules stop the two drifting apart,
the sharpest being that a stage's domain must be one of its project's domains —
which is how the story would most plausibly start lying. Each rule was confirmed
to fire by deliberately breaking it.

**Honesty is built into the drawings, not bolted on as captions.** Emergency
Mesh's third node is drawn out of range with a dashed link, no packet and no
acknowledgement, because animating a clean multi-hop delivery would imply live
multi-hop relay has been validated across physical devices and the research
record says it has not. KnowledgeGuard's factorial grid is uniform, with no
shaded cell and no numbers, because no results are published. RODIFT's diagram
imitates no real screen and shows no client outcome. Every stage carries a
caveat, and validation rejects a stage without one.

**The Engineering Core is connected but not driven.** The stages share the Core's
domains and accent tokens, so the colour that lit a node in the hero heads its
chapter here. `useCoreInteraction` was not forked and scroll does not drive the
Core: by the time the story is read the hero canvas is off-screen and
`SceneCanvas` has stopped its frame loop by design, so syncing would either
update something invisible or require keeping an off-screen canvas rendering —
which this phase explicitly rules out. Verified: the page still has exactly two
canvases.

**Scroll drives emphasis, never visibility.** Every stage renders fully visible
from first paint; the observer only decides which diagram the sticky panel shows.
Verified: jumping straight to the bottom of the page leaves 0 on-screen elements
below 0.05 opacity, and jump navigation to `#story-systems` lands on a fully
visible stage.

**Two defects found by looking at the rendered page.** The RODIFT diagram's
"Validate" and "Geo-match" nodes overlapped at their original coordinates, and
the KnowledgeGuard grid's row labels ran underneath the retrieval node — both
invisible in code review and obvious in a screenshot. Also fixed a proof badge
that printed "Tagged release v2.0.0 v2.0.0" because the label already contained
the value, and a limitations list that showed the same Emergency Mesh limitation
twice because the project and research records word it slightly differently.

**Homepage cleanup.** The centred name/tagline block under the hero was removed:
after Phase 4 it repeated the hero's name, positioning and call to action, and it
carried a second `<h1>`. Its ResumeButton moved into the bio panel. No component
was deleted — `GlitchText` and `NeonButton` remain, and only their unused imports
went. The page now has exactly one `<h1>` and `#projects` is intact.

**Measured.** `/` static JS went 1484 KB -> 1558 KB (+74 KB, +5%) for five
diagrams and the story components; `/hire` is unchanged at 488 KB, so nothing
leaked into the client funnel. `domInteractive` improved, 251 ms -> 150 ms median
of five runs. No new render loops: the only continuous motion is SVG
`animateMotion`, and there is no `requestAnimationFrame` in this phase. FCP is
deliberately not compared — it ranged 1872-4072 ms across five runs of the same
build under software rasterisation, so it measures the harness, not the page.

**Browser-verified** on a production build: five stages in the right order, every
status matching canonical content, all 7 contributions with 6 merged and 1 open
rendered as open, no console or hydration errors, nothing hidden after fast
scroll, reduced motion keeping all 32 step items and every diagram, no horizontal
overflow at 360/390/430 px, the Engineering Core still interactive, and `/hire`,
`/studio/request` and `/studio/admin` untouched.

**Not done, by design:** no `/work` page, no case-study component system, no
Research or Open Source page, no Skill Galaxy, no CMS.

---

# PHASE 6 — WORK PAGE

Create:

`/work`

## Categories

Groups come from the canonical tier selectors rather than from category arrays
in the page, so tier is the single definition of where a project belongs.

- [x] Production / Product Engineering
- [x] Security & Developer Tools
- [x] Applied AI / Research Systems
- [x] Systems Engineering
- [x] Secondary / Experimental Work

## Featured Priority

- [x] RODIFT
- [x] VeriPatch
- [x] KnowledgeGuard
- [x] CortexWard
- [x] SceneForge

Secondary:

- [x] Emergency Mesh
- [x] CS Learning by Game
- [x] BuildSphere
- [x] TODO Tracker Pro

Archive/past:

- [x] ZakatLink if retained
- [x] older educational work
- [x] MediTalk historical prototype if retained

## Phase Completion

- [x] Phase 6 complete

### Completion Notes

Completed 2026-09-19. Deliverable: `docs/portfolio-2026/work-page.md`.

**One source for grouping.** Featured, secondary, current FYP and archive come
straight from the tier selectors; the page contains no project list. Filter
options are derived from the domains projects actually carry, so a domain with
nothing behind it cannot render as a dead button.

**Conditional fields, not placeholder text.** Only RODIFT and VeriPatch have
populated `problem` and `role`. `FeaturedProjectCard` renders each block —
heading included — only when the field exists, so KnowledgeGuard, CortexWard and
SceneForge simply do not show those sections rather than showing an empty heading
or invented prose. Phases 7-9 populate them from real evidence.

**Visuals extracted, not duplicated.** The slug-keyed visual map moved out of
ProjectCard into `components/project-visuals.js` so the compact card and the
featured card read from one source. Two copies would let a flagship show its
bespoke treatment in one place and the generic fallback in the other. Verified in
the browser: all five flagship accents present, distinct, and none equal to the
fallback.

**A real collision this surfaced:** VeriPatch and CortexWard both used `#f97316`.
Invisible until they sat adjacent as flagships on this page; VeriPatch moved to
`#fbbf24`.

**Legacy compatibility without a redirect.** `/projects` stays a fully working
page. A redirect would have staked every existing `/projects#rodift` link on
fragment preservation surviving a 3xx, which is an unnecessary dependency when
keeping the page costs nothing — and it also preserves the SecretProject easter
egg. Consolidation is a cross-canonical: `/projects` passes `path="/work"` to the
existing Seo component, emitting exactly one canonical pointing at `/work`, with
one robots tag and no conflict. `/projects` left the sitemap, `/work` took its
place, and a banner points visitors to the maintained page.

**Navigation.** Navbar, Footer, Hero CTAs, homepage CTAs, hire, studio,
certifications, the five Engineering Core destinations and the five homepage
story destinations all now point at `/work`, with `EXISTING_ROUTES` updated in
the same change so route validation never went red.

**Browser-verified** on a production build, 40 checks: all 14 projects in the
right groups with working anchors, one `<h1>`, SCAR-OS named correctly with
Research status and no trace of the old name, no Bus Reservation System, zero
private repository URLs with five private markers, domain filtering and search
working with `aria-checked` and arrow-key navigation, an empty-state message that
clears back to 14, nothing left transparent after filtering, all legacy
`/projects#` anchors resolving, one canonical on each page, no overflow at
360/390/430/768 px, reduced motion clean, the Engineering Core still interactive
with exactly two canvases, and `/hire`, `/studio/request` and `/studio/admin`
unaffected.

**Not done, by design:** cards do not link to case studies, because `/work/[slug]`
does not exist yet and public buttons must not point at unbuilt routes. Phase 7
adds the routes and wires them.

---

# PHASE 7 — REUSABLE CASE STUDY SYSTEM

Create reusable components:

- [x] `ProjectHero`
- [x] `ProjectArchitecture`
- [x] `ProofStrip`
- [x] `TechnicalDecision`
- [x] `ConstraintBlock`
- [x] `TestEvidence`
- [x] `ProjectTimeline`
- [ ] `MediaGallery` — deliberately not built. No project has any `media`
      entries and no authorised public screenshots exist for the private
      flagships, so this would have been an empty component built to tick a
      checkbox. The `MediaItem` type is already in the model; the component can
      be added the moment there is something to put in it.
- [x] `ProjectMetrics`
- [ ] `GitHubEvidence` — not built as a separate component. Repository, package
      and release links are already rendered by `ProjectHero` from
      `project.links`, driven by `source.visibility`. A second component over the
      same data would be duplication rather than reuse.
- [x] `ProjectLimitations`
- [x] `RelatedWork`

Every major project should support:

1. Problem
2. Context
3. What I built
4. Architecture
5. My responsibility
6. Hard engineering decisions
7. Security/reliability concerns
8. Verification
9. Results
10. Limitations

- [x] Template covers all ten sections plus evidence and links.
- [x] Every section renders conditionally on available verified content.

## Phase Completion

- [x] Phase 7 complete

### Completion Notes

Completed 2026-09-19. Deliverable:
`docs/portfolio-2026/case-study-system.md`.

**The system, not the content.** Phase 2 left `architecture`, `technicalDepth`,
`verification` and `solution` empty on all fourteen projects rather than
inventing prose, and that is still true here. This phase built the template and
the model; Phases 8 and 9 supply evidence after reviewing real project material.

**Sections render or disappear.** The template is written out in full and the
content decides what appears, so a project with three populated fields renders
three sections rather than three sections and eight empty headings. The same rule
governs routing: `getStaticPaths` generates paths only for projects that have a
`caseStudy` block, and `fallback: false` makes every other slug a real 404.
Verified: `/work/nope`, `/work/rodift` (before its case study existed) and a
path-traversal attempt all returned 404, while `/work` stayed 200.

**Architecture is structured content, not a paragraph.** `nodes` and `flows`
generate the diagram, so a case study cannot quietly gain an integration nobody
built, and validation can check that every flow references a node that exists.
Node positions are computed from dependency depth rather than authored, so the
diagram re-lays out correctly when a component is added. The node list also
renders as a description list, so the architecture is readable without the
drawing.

**`verification[].verified` is a required boolean.** It separates "this is
tested" from "I can show you the test", which is the distinction a private
project needs in order to stay honest.

**Five validation rules, all confirmed to fire by breaking them:** a flow to an
unknown node, an architecture without a caveat, a decision without a rationale, a
verification item without an explicit verified flag, and — the important one — a
private project publishing a case study without a disclosure note explaining what
is withheld.

**Two components deliberately not built**, recorded above with reasons rather
than ticked: MediaGallery has no media to show, and GitHubEvidence would
duplicate links ProjectHero already renders.

**No new WebGL.** The diagram is SVG; the homepage still carries the only 3D
scene on the site.

---

# PHASE 8 — RODIFT CASE STUDY

- [ ] Create sanitized architecture diagram.
- [ ] Show mobile field workflow.
- [ ] Show management workflow.
- [ ] Show Supabase/Postgres/PostGIS architecture.
- [ ] Show RBAC.
- [ ] Show Edge Functions.
- [ ] Show FCM/realtime.
- [ ] Show verified release evidence.
- [ ] Mark private repository appropriately.
- [ ] Do not expose internal company information.

## Phase Completion

- [ ] Phase 8 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 9 — VERIPATCH CASE STUDY

Interactive pipeline:

- [ ] Scan
- [ ] Detect vulnerability
- [ ] Choose remediation
- [ ] Copy project
- [ ] Docker sandbox
- [ ] Safe install
- [ ] Rescan
- [ ] Build/test
- [ ] Evidence report

Also show:

- [ ] OSV
- [ ] lockfile handling
- [ ] threat model
- [ ] npm package
- [ ] property-based tests
- [ ] real pnpm parsing defect/fix
- [ ] remaining limitations

## Phase Completion

- [ ] Phase 9 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 10 — KNOWLEDGEGUARD RESEARCH CASE STUDY

Present as research, not SaaS.

Sections:

- [ ] Research question
- [ ] Hypothesis
- [ ] Experiment design
- [ ] Dataset/benchmark
- [ ] Factorial design
- [ ] Results
- [ ] Statistical analysis
- [ ] Artifact discovery/correction
- [ ] Limitations
- [ ] Follow-up experiment

Interactive matrix:

- [ ] 5 evidence deficiency types
- [ ] 6 repair actions
- [ ] hover/click cell explanation

Verified evidence to represent carefully:

- [ ] 1,410 balanced experiment cells
- [ ] 270 automated tests
- [ ] statistical interaction result
- [ ] routing headroom
- [ ] confound discovery
- [ ] E6 follow-up status

## Phase Completion

- [ ] Phase 10 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 11 — CORTEXWARD CASE STUDY

Label clearly:

`PRE-ALPHA / ACTIVE DEVELOPMENT`

## Verification Ladder

- [ ] None
- [ ] Static Reachability
- [ ] Taint Confirmed
- [ ] Dynamic PoC
- [ ] Differential Test

Show:

- [ ] Hexagonal architecture
- [ ] Code Property Graph
- [ ] scanners
- [ ] verification system
- [ ] agents
- [ ] sandbox
- [ ] SARIF/VEX
- [ ] benchmark/evaluation concepts

Separate:

- [ ] Implemented
- [ ] In Progress
- [ ] Planned

## Phase Completion

- [ ] Phase 11 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 12 — SCENEFORGE CASE STUDY

Story:

`HTML/CSS/JS → Canonical Scene → Timeline → Chromium → Frames → FFmpeg → MP4`

Show verified:

- [ ] offline design
- [ ] deterministic rendering
- [ ] canonical model
- [ ] local composer
- [ ] asset system
- [ ] 169/169 tests
- [ ] 50-second dogfood render
- [ ] 1,500 frames
- [ ] actual rendered preview where available

Do not embed an unnecessarily heavy editor into the portfolio.

## Phase Completion

- [ ] Phase 12 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 13 — EMERGENCY MESH CASE STUDY

Create an animated network visualization.

Show:

- [ ] BLE discovery
- [ ] identities
- [ ] encryption
- [ ] sending
- [ ] store-and-forward
- [ ] ACK
- [ ] routing concepts

Stack:

- [ ] Flutter/Dart
- [ ] Kotlin BLE
- [ ] Ed25519
- [ ] X25519
- [ ] XChaCha20-Poly1305
- [ ] SQLCipher

Testing/evidence:

- [ ] Dart tests
- [ ] Kotlin tests
- [ ] fuzz testing
- [ ] protocol documentation

Mandatory limitation:

- [ ] Clearly state real live multi-hop relay is not yet fully validated/complete on hardware.

## Phase Completion

- [ ] Phase 13 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 14 — OPEN SOURCE PAGE

Create:

`/open-source`

Intro:

`I contribute fixes upstream, not only to my own repositories.`

Add verified contributions:

- [ ] Pydantic AI #5969
- [ ] Promptfoo #9781
- [ ] loop-engineering #395
- [ ] loop-engineering #437
- [ ] MCP-Audit/MCTS #233
- [ ] Academy Software Foundation DNA #195
- [ ] eye-tracker #61 with current correct status

Each contribution must show:

- [ ] repository
- [ ] problem
- [ ] change
- [ ] tests/evidence
- [ ] status
- [ ] link
- [ ] language/area tags

## Phase Completion

- [ ] Phase 14 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 15 — RESEARCH PAGE

Create:

`/research`

Categories:

## Completed / Executed Research

- [ ] KnowledgeGuard / EGB

## Research-driven Engineering

- [ ] CortexWard

## Systems Experiments

- [ ] Emergency Mesh

## Current FYP

- [ ] SCAR-OS

SCAR-OS (previously VICE OS) must currently be represented carefully:

`Current FYP — Research & Architecture Stage`

Do not claim unimplemented features are working.

## Phase Completion

- [ ] Phase 15 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 16 — EVIDENCE-BACKED SKILLS

Remove arbitrary skill percentages.

Do NOT remove skill tags or interactive skill visualizations.

## Skill Evidence

Examples:

Flutter:
- RODIFT
- Emergency Mesh

TypeScript:
- VeriPatch
- SceneForge
- Portfolio
- Promptfoo contribution

Python:
- KnowledgeGuard
- CortexWard
- Pydantic AI contribution
- MCTS contribution

Docker:
- VeriPatch
- CortexWard

Supabase:
- RODIFT
- Portfolio Studio

## Interactive Skill Galaxy

Clusters:

- [ ] Languages
- [ ] Frontend
- [ ] Backend
- [ ] AI
- [ ] Security
- [ ] Mobile
- [ ] Systems
- [ ] Research
- [ ] Infrastructure
- [ ] Developer Tools

Clicking a skill should reveal:

- [ ] projects
- [ ] role/use
- [ ] evidence
- [ ] related work

## Phase Completion

- [ ] Phase 16 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 17 — ABOUT + CREDENTIALS

Create/rebuild:

`/about`

Include:

- [ ] identity
- [ ] engineering philosophy
- [ ] education
- [ ] technical interests
- [ ] current status
- [ ] selected credentials

Do not prioritize certifications over engineering work.

Credentials should be supporting evidence.

## Phase Completion

- [ ] Phase 17 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 18 — RESUME SYSTEM

- [ ] Replace stale resume presentation.
- [ ] Create `/resume`.
- [ ] Use canonical portfolio data where practical.
- [ ] Ensure project names/statuses match portfolio.
- [ ] Include current OSS evidence.
- [ ] Include current research.
- [ ] Prevent resume/site content drift.

Optional later:

- [ ] PDF generation if maintainable.

## Phase Completion

- [ ] Phase 18 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 19 — CONTACT + WORK WITH ME

## Contact

Replace mailto-only flow.

Categories:

- [ ] Engineering opportunity
- [ ] Internship/job
- [ ] Research collaboration
- [ ] Open source
- [ ] Client project
- [ ] Other

- [ ] Secure backend submission.
- [ ] Validation.
- [ ] spam protection.
- [ ] user feedback.
- [ ] admin visibility.

## Client Funnel

Preserve:

- [ ] `/hire`
- [ ] `/studio`
- [ ] `/studio/request`

Clarify:

`Amar Digital Systems — independent engineering practice by Amar Jaleel`

## Phase Completion

- [ ] Phase 19 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 20 — ADMIN CONTROL CENTER FOUNDATION

Current `/studio/admin` is primarily a lead dashboard.

Upgrade carefully.

Recommended route:

`/admin`

Do not delete the current admin until replacement is verified.

## Admin Navigation

- [ ] Dashboard
- [ ] Content
- [ ] Projects
- [ ] Research
- [ ] Open Source
- [ ] Skills
- [ ] Experience
- [ ] Credentials
- [ ] Resume
- [ ] Leads
- [ ] Media
- [ ] SEO
- [ ] Analytics
- [ ] Site Health
- [ ] Settings
- [ ] Audit Log

## Admin UI

- [ ] dark professional control-center layout
- [ ] sidebar
- [ ] responsive
- [ ] keyboard friendly
- [ ] command/search interface
- [ ] no unnecessary 3D

## Phase Completion

- [ ] Phase 20 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 21 — ADMIN AUTH + SECURITY

- [ ] Proper Supabase authentication.
- [ ] Session refresh.
- [ ] Protected routes.
- [ ] RLS verification.
- [ ] No public lead SELECT.
- [ ] No public CMS mutation.
- [ ] Server-side validation.
- [ ] No service-role key in browser.
- [ ] Sensitive write rate limiting where appropriate.
- [ ] Logout.
- [ ] Audit actions.

## Phase Completion

- [ ] Phase 21 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 22 — ADMIN CMS DATABASE

Do not migrate everything at once.

Create database structure first.

Suggested tables:

- [ ] `portfolio_projects`
- [ ] `project_media`
- [ ] `project_metrics`
- [ ] `project_technologies`
- [ ] `technologies`
- [ ] `research_projects`
- [ ] `open_source_contributions`
- [ ] `credentials`
- [ ] `experience`
- [ ] `site_content`
- [ ] `site_settings`
- [ ] `studio_leads`
- [ ] `lead_notes`
- [ ] `admin_audit_log`

For every table:

- [ ] schema defined
- [ ] relationships defined
- [ ] indexes considered
- [ ] RLS policies defined
- [ ] read/write paths documented

Maintain static fallback during migration where useful.

## Phase Completion

- [ ] Phase 22 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 23 — PROJECT CMS

Admin project editor should support:

- [ ] create
- [ ] edit
- [ ] delete/archive safely
- [ ] upload media
- [ ] reorder media
- [ ] proof items
- [ ] architecture
- [ ] technical decisions
- [ ] metrics
- [ ] limitations
- [ ] technologies
- [ ] preview
- [ ] draft
- [ ] publish
- [ ] unpublish
- [ ] featured toggle
- [ ] homepage ordering

No source-code edit should be required for normal project content updates.

## Phase Completion

- [ ] Phase 23 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 24 — RESEARCH + OPEN SOURCE CMS

## Research Editor

- [ ] question
- [ ] hypothesis
- [ ] method
- [ ] dataset
- [ ] experiment design
- [ ] results
- [ ] limitations
- [ ] corrections
- [ ] future work
- [ ] repository
- [ ] status

## Open Source Editor

- [ ] repository
- [ ] organization
- [ ] PR number
- [ ] PR URL
- [ ] title
- [ ] problem
- [ ] contribution
- [ ] tests
- [ ] merged/open status
- [ ] date
- [ ] language
- [ ] tags

Public rendering must not depend on live GitHub API uptime.

## Phase Completion

- [ ] Phase 24 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 25 — ADVANCED LEAD CRM

Upgrade lead statuses to:

- [ ] new
- [ ] reviewing
- [ ] contacted
- [ ] qualified
- [ ] proposal
- [ ] negotiation
- [ ] won
- [ ] lost
- [ ] archived

Lead detail:

- [ ] notes
- [ ] follow-up date
- [ ] priority
- [ ] estimated value
- [ ] source
- [ ] service
- [ ] timeline
- [ ] last contacted
- [ ] next action
- [ ] email quick action
- [ ] website quick action
- [ ] activity history

Views:

- [ ] kanban
- [ ] table
- [ ] search
- [ ] filters
- [ ] mobile list

## Phase Completion

- [ ] Phase 25 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 26 — MEDIA LIBRARY

Admin media capabilities:

- [ ] upload
- [ ] preview
- [ ] alt text
- [ ] caption
- [ ] project assignment
- [ ] dimensions
- [ ] file size
- [ ] type
- [ ] unused media detection

Optimize:

- [ ] images
- [ ] video previews
- [ ] diagrams
- [ ] OG images

## Phase Completion

- [ ] Phase 26 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 27 — SEO CONTROL CENTER

Per page/project:

- [ ] title
- [ ] description
- [ ] OG title
- [ ] OG description
- [ ] OG image
- [ ] canonical
- [ ] index/noindex
- [ ] slug

Admin warnings:

- [ ] missing metadata
- [ ] duplicate descriptions
- [ ] missing OG image
- [ ] invalid canonical
- [ ] invalid slug

## Structured Data

- [ ] Person
- [ ] WebSite
- [ ] appropriate CreativeWork / SoftwareSourceCode
- [ ] research CreativeWork where appropriate

## Phase Completion

- [ ] Phase 27 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 28 — SITE HEALTH

Create admin health checks for:

- [ ] broken repository links
- [ ] broken demo links
- [ ] missing images
- [ ] missing alt text
- [ ] missing proof
- [ ] missing limitations
- [ ] stale dates
- [ ] missing metadata
- [ ] duplicate slugs
- [ ] private repo mistakenly exposed
- [ ] inconsistent project status
- [ ] unverified public claim

## Phase Completion

- [ ] Phase 28 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 29 — ADMIN GLOBAL SEARCH + COMMAND PALETTE

Implement:

`Ctrl/Cmd + K`

Search across:

- [ ] projects
- [ ] research
- [ ] open source
- [ ] leads
- [ ] skills
- [ ] credentials
- [ ] site content

Commands:

- [ ] Create project
- [ ] Add contribution
- [ ] New research entry
- [ ] Search lead
- [ ] View site
- [ ] Preview draft
- [ ] Open media
- [ ] Open SEO health

Avoid destructive publish/delete commands unless confirmation is explicit.

## Phase Completion

- [ ] Phase 29 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 30 — DRAFT / PREVIEW / PUBLISH

CMS workflow:

`Draft → Preview → Publish`

- [ ] protected previews
- [ ] `published_at`
- [ ] `updated_at`
- [ ] unpublished content hidden publicly
- [ ] preview token/session protection
- [ ] rollback-safe editing strategy

## Phase Completion

- [ ] Phase 30 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 31 — ADMIN AUDIT LOG

Track:

- [ ] project created
- [ ] project edited
- [ ] project published
- [ ] project archived
- [ ] SEO changed
- [ ] lead status changed
- [ ] research changed
- [ ] OSS contribution changed
- [ ] settings changed

Store:

- [ ] action
- [ ] entity type
- [ ] entity id
- [ ] timestamp
- [ ] admin user
- [ ] safe summary

## Phase Completion

- [ ] Phase 31 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 32 — MOBILE EXPERIENCE

Do not simply disable all advanced effects.

Test:

- [ ] 360px
- [ ] 390px
- [ ] 430px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px

Check:

- [ ] no horizontal overflow
- [ ] touch targets
- [ ] nav
- [ ] hero
- [ ] 3D fallback/tier
- [ ] case studies
- [ ] skill galaxy
- [ ] forms
- [ ] admin
- [ ] tables/kanban fallbacks

## Phase Completion

- [ ] Phase 32 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 33 — ACCESSIBILITY

Implement/test:

- [ ] skip link
- [ ] semantic landmarks
- [ ] keyboard navigation
- [ ] focus-visible
- [ ] dialog accessibility
- [ ] alt text
- [ ] color contrast
- [ ] reduced motion
- [ ] screen-reader project content
- [ ] interactive skill accessibility
- [ ] 3D information represented in DOM

## Phase Completion

- [ ] Phase 33 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 34 — PERFORMANCE

Measure before blindly removing visual features.

Optimize:

- [ ] dynamic imports
- [ ] lazy 3D
- [ ] viewport mounting
- [ ] pause off-screen rendering
- [ ] pause hidden-tab rendering
- [ ] DPR clamping
- [ ] particle reduction
- [ ] texture optimization
- [ ] screenshot optimization
- [ ] video preview optimization
- [ ] bundle analysis
- [ ] remove genuinely unused dependencies

Measure:

- [ ] LCP
- [ ] CLS
- [ ] INP
- [ ] JS bundle
- [ ] 3D startup cost
- [ ] mobile memory
- [ ] animation FPS

## Phase Completion

- [ ] Phase 34 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 35 — ERROR BOUNDARIES + FALLBACKS

- [ ] 3D scene error boundaries.
- [ ] Static visualization fallback.
- [ ] API failure states.
- [ ] Supabase failure states.
- [ ] image/video fallbacks.
- [ ] empty CMS states.
- [ ] graceful admin errors.
- [ ] public content remains usable without WebGL.

## Phase Completion

- [ ] Phase 35 complete

### Completion Notes

_Add notes here after completion._

---

# PHASE 36 — FINAL PRODUCTION QA

Check every major path.

## Public

- [ ] `/`
- [ ] `/work`
- [ ] all flagship project pages
- [ ] `/research`
- [ ] `/open-source`
- [ ] `/about`
- [ ] `/resume`
- [ ] `/contact`
- [ ] `/hire`
- [ ] `/studio`
- [ ] `/studio/request`

## Admin

- [ ] auth
- [ ] dashboard
- [ ] CMS
- [ ] project CRUD
- [ ] research CRUD
- [ ] OSS CRUD
- [ ] leads
- [ ] media
- [ ] SEO
- [ ] site health
- [ ] audit log

## Technical

- [ ] production build
- [ ] lint
- [ ] tests
- [ ] links
- [ ] mobile
- [ ] accessibility
- [ ] reduced motion
- [ ] WebGL fallback
- [ ] metadata
- [ ] sitemap
- [ ] robots
- [ ] RLS
- [ ] secrets
- [ ] forms
- [ ] error handling

## Final Content Review

- [ ] no false metrics
- [ ] no stale project statuses
- [ ] no broken repository links
- [ ] no AI attribution in git metadata
- [ ] no private information leakage
- [ ] SCAR-OS accurately described
- [ ] Emergency Mesh limitation accurately described
- [ ] CortexWard accurately marked pre-alpha
- [ ] KnowledgeGuard research limitations preserved

## Phase Completion

- [ ] Phase 36 complete

### Completion Notes

_Add notes here after completion._

---

# FINAL DEFINITION OF DONE

The project is complete only when:

- [ ] The portfolio clearly presents Amar as a serious software / AI / security / systems engineer.
- [ ] The strongest current projects dominate the experience.
- [ ] Engineering evidence replaces vanity stats.
- [ ] 3D/motion/animations remain ambitious but purposeful.
- [ ] Mobile gets an adapted high-quality experience.
- [ ] Skills are linked to real project evidence.
- [ ] Research is separated from product marketing.
- [ ] Open-source work is clearly visible.
- [ ] Current FYP is represented honestly.
- [ ] Client and recruiter flows coexist without confusing identity.
- [ ] Admin is a real portfolio control center.
- [ ] Portfolio content can be maintained without repeatedly editing source files.
- [ ] Admin and public data access are secured.
- [ ] SEO domain and metadata are correct.
- [ ] Resume and portfolio use consistent facts.
- [ ] Accessibility and fallbacks are implemented.
- [ ] Production validation passes.
- [ ] No Claude/AI co-author attribution exists anywhere in repository history created by this work.

---

# CLAUDE SESSION START COMMAND

Whenever starting a new Claude Code session, use:

> Read `PORTFOLIO_2026_IMPLEMENTATION.md` completely. Inspect the repository and determine the first incomplete phase. Work ONLY on that phase. Before coding, explain what already exists, what you will change, and what could regress. Then implement it, run the relevant verification, update the checkboxes and completion notes in the tracker, commit the phase with a normal developer commit message, and stop. Do not move to the next major phase until I explicitly tell you to continue. Do not add Claude, Anthropic, AI, Co-authored-by, Generated-by, or any other AI attribution anywhere in commits, pull requests, code, documentation, comments, or repository metadata.
