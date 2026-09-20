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

## Phase Completion

- [x] Phase 8 complete

### Completion Notes

Completed 2026-09-19. Route: `/work/rodift`.

**Evidence source.** The project source is not in a public repository and is not
named on the site. It was located in the owner's private account and reviewed
under authentication on 2026-09-19: a 593-line source-derived engineering README,
a v2.0.0 tag, 52 commits, and a Python test suite (`pytest.ini`,
`run_all_tests.py`, `tests/`). Every claim on the case-study page appears in that
documentation. Nothing was inferred and nothing was invented.

**Verified implementation** (all from the project's own documentation): Flutter
with flutter_bloc on mobile; Next.js 15 App Router, React 18, TypeScript and
Tailwind on the web; Supabase with PostgreSQL 17 + PostGIS, Deno edge functions,
Auth, Realtime, Storage and pg_cron; Firebase Cloud Messaging HTTP v1 for push.
Seven operational roles, a four-level geography, and a chain of command that the
data model encodes so issue assignment needs no manual triage.

**The engineering decisions that made the page worth writing** are the ones with
a cost attached: the hierarchy modelled as data (rigid — a restructure becomes a
migration); server-side re-validation of the client-chosen outlet, where the
device-reported accuracy cannot widen the acceptance radius (a genuine report
from a poor GPS fix can be rejected); three layers of authorization rather than
one (a permission change has to be made in more than one place); human-approved
in-app recovery because no email or SMS channel existed; and an anti-enumeration
response shape that is byte-identical for unknown, ineligible, cooling-down and
already-pending accounts (a mistyped login looks successful and never arrives).

**Limitations are the project's own**, not softened: no email/SMS recovery
channel, password-reset notifications in-app only, client-side report
aggregation, an inert legacy layer in the mobile app, and two pre-existing edge
functions that still fail strict type checking.

**Client confidentiality.** The client is not named. The repository name, the
internal product name it was renamed from, the synthetic auth email domain, the
bundle identifier, the Supabase project reference, the Firebase project id and a
data-quality note naming real distributor locations were all reviewed and
deliberately excluded. A browser test asserts that none of those strings appears
in the served HTML, that no repository link is rendered, and that the private
marker and disclosure note are present.

**No production-scale claims.** The page states a tagged release and a published
privacy policy as what they are. It claims no users, revenue, business outcomes
or operational scale, because none are available to publish — and the phase brief
is explicit that a version tag and a privacy policy are not by themselves proof
of live production usage.

**A real layout bug this surfaced.** The architecture SVG carried an inline
`min-width`, which raised the min-content size of every ancestor and pushed the
page 188px past a 360px viewport. `overflow-x` on the surrounding card could not
clamp it, because overflow does not reduce a block's min-content contribution.
Removing the inline minimum fixed it; the component list beneath the diagram is
the readable form on small screens. `.section-container` also gained
`min-width: 0`, which is the correct guard for flex children generally.

**Browser-verified**, 18 checks: 200 with a single `<h1>`, all twelve populated
sections present, **no empty section headings**, no forbidden identifier in the
HTML, no repository link, private marker and disclosure present, no invented
users/revenue/scale figures, a descriptive diagram label, correct canonical, zero
console or hydration errors, no overflow at 360/390/430 px, reduced motion clean,
`/work/veripatch` still 404 at that point, and `/work` still 200.

---

# PHASE 9 — VERIPATCH CASE STUDY

## Phase Completion

- [x] Phase 9 complete

### Completion Notes

Completed 2026-09-19. Route: `/work/veripatch`.

**Evidence source.** The repository is public and Apache-2.0 licensed, so every
claim on the page can be checked against it. Reviewed 2026-09-19: the README,
`docs/SECURITY.md`, `package.json`, the test layout, the GitHub releases and the
npm registry. Verified facts: five published versions (0.1.0 through 0.3.1),
current release v0.3.1, nine GitHub releases, Node 20+, and dependencies
including dockerode, better-sqlite3, semver and zod.

**The narrative is the project's own thesis** — a dependency bump is not a
verified remediation — and the pipeline is described stage by stage: scan a
lockfile against OSV.dev, rank by severity against fix feasibility, apply a
candidate fix to a staged copy inside a hardened Docker sandbox, independently
re-scan the resolved tree, run build and tests, emit Markdown and JSON evidence.

**Decisions with their costs**, all from the documentation: verdicts computed
from exit codes and an independent re-scan with no log-text heuristics (slower);
install with lifecycle scripts disabled (packages needing a postinstall are not
exercised realistically); a structural invariant that a fix can only be a version
bump of the same package, covered by property-based tests (a vulnerability whose
only remedy is switching packages cannot be automated); yarn and pnpm verification
explicitly refused rather than risking lockfile corruption (a large share of real
projects can be scanned but not verified); and verification against a staged copy
excluding `.git` and `.env` files so the sandbox never sees the working tree or
secrets.

**Residual risks reproduced, not softened.** The project documents three and all
three are on the page: network isolation is bridge-level rather than
domain-level, so the real defence against a malicious postinstall is that
lifecycle scripts are disabled; a confidence verdict reflects the project's own
build and test commands exiting successfully, not whether those checks are
honest, though the re-scan independently confirms the vulnerability is gone; and
Docker containers share the host kernel, so a runtime container escape is out of
scope. These were added to the canonical `limitations`, so they appear on the
work card as well as the case study.

**Verification evidence:** six separated test categories (unit, integration,
contract, e2e, bench, fixtures) under Vitest, property-based testing with
fast-check on the fix-resolver invariant, and architectural boundaries enforced
mechanically by `eslint-plugin-boundaries` rather than by review.

**No invented numbers.** No download counts, customers, users or revenue are
claimed — a browser assertion checks for them. No illustrative CLI output was
fabricated; the page describes the pipeline rather than showing a simulated
terminal session, because a convincing fake run would be the one thing on the
page that could not be checked against the repository.

**Browser-verified**, 30 checks: 200 with a single `<h1>`, no empty section
headings, repository and npm links present, no private marker on a public
project, every pipeline stage described, all three residual risks present, the
yarn/pnpm refusal documented, no "completely secure" style claim, v0.3.1 stated,
no invented figures, correct canonical, zero console or hydration errors, no
overflow at 360/390/430/768 px, reduced motion clean, both case studies linked
from `/work` and **only** the two that exist, a project without a case study
404ing, the homepage Core and five-stage story still intact with exactly two
canvases, and `/hire`, `/studio/request`, `/studio/admin`, `/projects`,
`/skills`, `/certifications` and `/contact` all still 200.

---

# PHASE 10 — KNOWLEDGEGUARD RESEARCH CASE STUDY

## Phase Completion

- [x] Phase 10 complete

### Completion Notes

Completed 2026-09-20. Route: `/work/knowledgeguard`.

**The canonical omission was not evidence of absence.** Public content said only
"factorial executed, analysis complete". The private repository holds a complete
515-line `RESULTS.md` with the full cell matrix, pre-registered hypotheses,
permutation and mixed-model tests, confidence intervals, a detection study, a
routing study and a published self-correction.

**Disclosure was determined, not assumed.** The project carries its own frozen
release policy (`docs/ARTIFACT_LICENSING.md`, Tier P / Tier R, authority
AID-0033), which explicitly clears "per-cell result rows with passage text and
rendered prompts removed — scores, costs, counts" for public release. So the
measured cells and statistics are published; no benchmark passage, rendered
prompt, question or gold answer is reproduced, and questions were kept out by the
project's own more-conservative decision.

**The design is the artifact.** A real 5 x 6 within-record factorial: five
deficiency types (SUFFICIENT, MISSING, ABSENT, CONFLICTING, OUTDATED) crossed
with six repair actions (NONE, ESCALATE, DECOMPOSE, ARBITRATE, TIME_FILTER,
ABSTAIN). 47 records, 1,410 balanced cells, n = 47 each, 2,946 generator calls,
no API spend. Rendered as an accessible `<table>` with real row and column
headers, so a screen reader announces "CONFLICTING, ARBITRATE, 0.807" — and every
axis level carries its own definition, which is what keeps the grid useful even
where results cannot be shown.

**Verified results published:** the interaction is real and large (partial
eta-squared 0.32, permutation p = 1e-4); oracle routing beats the best
type-agnostic policy by 6.6 F1 points [2.6, 10.5], rejecting the pre-registered
null but with a lower bound sitting exactly at the frozen practical threshold;
and — the result that matters — **with a real detector the benefit reverses**,
predicted routing scoring 0.064 F1 *below* type-agnostic. The +0.415 figure
against fixed escalation is included specifically as the number that must not be
quoted as the routing benefit, because that is the easiest available way to
overstate the study.

**Research integrity carried through, not summarised away.** The page publishes
the 2026-09-17 correction at the same visual weight as the results: the only cell
surviving multiple-comparison correction is deficiency-invariant, the injected
counter-passages are the only off-index passages (47/47 against 0 of 1,315), the
counter-passage is the strict maximum-overlap passage in 47/47, and two trivial
rules reproduce the identification with no generation at all. The number stands;
the causal reading does not. The pre-registered replication that would settle it
is labelled as not run, and the HotpotQA replication factorial is recorded as
incomplete with no numbers shown.

**New system pieces**, each justified by real content: an `ExperimentGrid` model
with optional cells, a `ResearchFinding` shape that keeps a value and what it
licenses in separate fields, a `correction` block, plus `ExperimentMatrix` and
`ResearchFindings` components. Six validation rules cover them, including one
rejecting a partially filled grid — a half-populated matrix invites reading
absence as zero.

**A third instance of the same layout bug.** The matrix table, like the
architecture diagram before it, has a min-content wider than a phone. Fixed
properly this time at `.section-container`, which now sets `width: 100%` as well
as `min-width: 0`: a definite used width means no descendant can expand the
container, so the inner scroller is what scrolls.

**Browser-verified**, 37 checks on a production build: 200 with a single `<h1>`,
no empty headings, the matrix as a table with 5 row and 7 column headers and 30
inspectable cells, four measured values present, run provenance stated, the
correction present and dated with its "causal reading does not" wording, the
replication marked not run, the routing reversal stated, the natural-versus-
constructed detection gap stated, no overclaiming language, no restricted
artifact names or repository URLs, the private marker and disclosure basis shown,
row and cell selection working with descriptive `aria-label`s and keyboard focus,
no overflow at 360/390/430/768 px, reduced motion clean, and the homepage Core,
story and every other route unaffected.

---

# PHASE 11 — CORTEXWARD CASE STUDY

## Phase Completion

- [x] Phase 11 complete

### Completion Notes

Completed 2026-09-20. Route: `/work/cortexward`.

**Status preserved: pre-alpha.** The page describes engineering, not the
repository's "autonomous AI security engineer" tagline, and a browser assertion
checks that no "autonomous platform" or "complete security" phrasing appears.

**The README and the roadmap disagree, and the roadmap wins.** The README summary
says the core verification loop is closed — that `ward scan --sandbox` generates a
proof-of-concept, runs it in Docker and climbs to the `DYNAMIC_POC` rung.
`ROADMAP.md`, which carries evidence per line, records the opposite: the sandbox
adapter is built and tested, but **nothing in the agent pipeline calls it**, and
no component produces proof-of-concept evidence for it to replay. Rungs 3 and 4
are therefore presented as not built, the discrepancy is disclosed on the page
itself, and it is recorded in the canonical limitations.

**The Verification Ladder is the centrepiece**, rendered as an ordered list where
each rung states its own status in words as well as colour and marker shape:
rungs 0-2 (pattern match, static reachability, taint confirmed) implemented;
rungs 3-4 (dynamic proof-of-concept, differential test) not built, each with the
specific reason it is blocked. Expanding a rung explains what reaching it would
mean.

**Two structural rules carried through**, because they are the design: a language
model can never climb the ladder on its own — model judgement is bounded and only
concrete analysis produces rungs — and refutation is first-class, with evidence
that a finding is *not* exploitable driving a not-affected verdict rather than
being discarded.

**Implemented, from the per-phase roadmap:** phases 0-4 complete — domain core,
workspace and port contracts, the Code Property Graph engine (AST, control flow,
data flow and call graph over tree-sitter with reachability, taint and slice
queries), four scanner adapters with cross-tool correlation and SARIF 2.1.0
output, and the seven-agent framework with multi-provider model support.
CycloneDX-VEX export is fully covered and verified end to end.

**Not implemented, stated as such:** dynamic and differential verification,
patch-gate validation, verification and patch-quality metrics (the manifest
fields exist and are deliberately left empty rather than estimated), a distinct
false-positive-reduction capability, contamination-controlled evaluation splits,
and broader benchmark datasets. Six of eleven phases are partially built; the
v1.0 phase has not started.

**New reusable piece:** a `CapabilityLadder` model and component, generic enough
for any graded capability set. Its `status` field is required — a ladder that
does not say which rungs are built is a roadmap presented as a feature list.

**Browser-verified**, 33 checks: 200 with a single `<h1>`, pre-alpha preserved, no
empty headings, five rungs rendered with three implemented and two not built, the
sandbox wiring gap stated verbatim, the README-versus-roadmap discrepancy
disclosed, both structural rules present, no autonomous-platform marketing, no
invented exploit demonstrations, the repository link present with no private
marker, expansion working with `aria-expanded`, no overflow at 360/390/430/768
px, reduced motion clean, and the homepage Core, story and all other case studies
unaffected.

**Two test artifacts, not product bugs**, worth recording: status labels are
rendered uppercase by CSS so a case-sensitive assertion missed them, and the
homepage R3F canvas mounts at roughly four seconds so a three-second wait was
marginal. Both assertions were corrected rather than the product.

---

# PHASE 12 — SCENEFORGE CASE STUDY

## Phase Completion

- [x] Phase 12 complete

### Completion Notes

Completed 2026-09-20. Route: `/work/sceneforge`.

**Two claims were checked and deliberately not made.** The repository's `output/`
directory contains only a `.gitkeep`, so **no render artifact exists** — the page
uses an explicitly labelled architecture visualization and states that no
rendered frame or output video is shown. And the documentation makes **no
determinism claim**, so none is made here; that absence is listed as a
verification item rather than passed over. The phase brief warned specifically
against carrying forward previously reported test counts or rendering
benchmarks: the documentation states none, so none are quoted.

**Verified pipeline:** a JSON manifest of HTML, CSS and JavaScript scenes is
compiled into one composition document per scene, placed in time by a dedicated
timeline package, rendered by headless Chrome and encoded by FFmpeg into a single
MP4 at a fixed 1920x1080, 30 frames per second stage. Express backend, React and
Monaco editor, local only — no cloud APIs, keys or uploads.

**The decisions worth the page** are the trust-model ones. The editor preview
sanitises markup and never executes scene JavaScript, because the preview runs in
the author's own session; execution happens only during a render, where the blast
radius is a render job. Script tags in scene markup are stripped and scene code
that navigates the page is rejected outright. Each scene compiles to its own
document specifically so CSS cannot leak between scenes.

**Honest operational limits:** rendering is CPU-heavy and single-job, and the
documentation is explicit that it needs a queue before more than a handful of
users touch it. The character engine is vendored as a pinned build because its
published package fails to install at all, so updates are manual.

**Browser-verified**, 22 checks: 200 with a single `<h1>`, active-development
status preserved, no empty headings, the absence of a render artifact stated,
determinism explicitly not claimed, no invented test counts or rendering
benchmarks, **no `<video>` element anywhere on the page**, operational limits
stated, no repository link on a private project with the private marker shown,
no overflow at 360/390/430/768 px, reduced motion clean, and the homepage and all
other case studies unaffected.

---

# PHASE 13 — EMERGENCY MESH CASE STUDY

## Phase Completion

- [x] Phase 13 complete

### Completion Notes

Completed 2026-09-20. Route: `/work/emergency-mesh`.

**The distinction this phase exists for is taken verbatim from the project's own
status record**, not inferred. Three states are separated on the page and in the
walkthrough:

- **Runs on real hardware** — discovery, local identity, compose/seal/sign,
  fragmentation and reassembly, single-hop transfer between two phones in range,
  acknowledgement for direct messages, and store-and-forward with retry and
  expiry.
- **Simulated only** — mesh behaviour beyond one hop. The simulator drives the
  same routing code as the real path, and the page says explicitly that a
  passing simulation is not evidence of hardware behaviour.
- **Not implemented** — **multi-hop relay**, the defining behaviour of a mesh.
  The transport is single-hop only.

**Two gaps stated rather than glossed:** the native Bluetooth layer is covered by
62 Kotlin unit tests and verified by compilation and packaging **but not on a
device** — the final transport task needs two physical phones — and an SOS
broadcast has no acknowledgement mechanism, so the interface deliberately does
not tell the user it reached anyone.

**The honesty is built into the diagram, not bolted on.** The third device is
drawn permanently out of range with an unestablished link, so no sequence of
steps can be read as a completed multi-hop delivery. The drawing carries an
"illustrative protocol simulation" label, and because the step list holds the
information, the SVG is `aria-hidden` rather than duplicating it badly.

**A real navigation gap this surfaced.** Emergency Mesh is a secondary project,
and only the featured card carried a case-study link — so its page was
unreachable from `/work`. `ProjectCard` now takes the same `hasCaseStudy` flag,
and both `/work` and the legacy `/projects` pass it, so no case study dead-ends.

**New reusable piece:** a `ProtocolWalkthrough` model and component. Every step
carries a status, which is what stops a walkthrough animating a capability into
existence.

**Browser-verified**, 37 checks: 200 with a single `<h1>`, active-development
preserved, no empty headings, eight protocol steps with the multi-hop step marked
not implemented, the simulation label present, the device-verification gap
stated, simulation explicitly not equated with hardware evidence, SOS delivery
not falsely claimed, no emergency-ready phrasing and the unsuitability for real
use stated, no repository link or key material on a private project, step
activation working, no overflow at 360/390/430/768 px, reduced motion clean, six
case studies linked from `/work`, a project without one still 404ing, and the
homepage Core, story and every other route unaffected.

---

# PHASE 14 — OPEN SOURCE PAGE

Create:

`/open-source`

Intro:

`I contribute fixes upstream, not only to my own repositories.`

Add verified contributions:

- [x] Pydantic AI #5969
- [x] Promptfoo #9781
- [x] loop-engineering #395
- [x] loop-engineering #437
- [x] MCP-Audit/MCTS #233
- [x] Academy Software Foundation DNA #195
- [x] eye-tracker #61 with current correct status

Each contribution must show:

- [x] repository
- [x] problem
- [x] change
- [x] tests/evidence
- [x] status
- [x] link
- [x] language/area tags

## Phase Completion

- [x] Phase 14 complete

### Completion Notes

Completed 2026-09-20. Route: `/open-source`.
Documented in `docs/portfolio-2026/open-source-page.md`.

**All seven pull requests were re-read from the GitHub API on 2026-09-20**, not
trusted from the Phase 1 cache. Every recorded field matched; the check added
four missing `openedAt` dates and confirmed eye-tracker#61 is **still open**.
Two language lists were corrected against the actual diffs: #395 touches
`action.yml` and a README, so it is YAML and Shell rather than JavaScript.

**The page is not a GitHub dashboard, deliberately.** No heat map, no streak, no
total "contributions", no impact score. What a reader actually wants from an
upstream change is two paragraphs — what was wrong before, and what was changed
— so those are the largest text on every card and the repository name is not.
Nothing counts reviews, reactions, stars or downstream impact, because none of
that is in the records.

**Four new required content fields**, every one sourced from the pull request
itself: `problem`, `change`, `verification` (tests the PR documents, never
inferred) and `diff` (files, additions, deletions and per-file paths from the
API). `verification` is optional on purpose — #395 documents no tests and the
card says so in as many words, because hiding an empty section would imply by
omission that every entry came with tests.

**"Never present an open PR as merged" is now enforced three times over.** The
`merged-pr` proof type renders green and reads "Merged PR", and eye-tracker#61
was carrying it. There is now a separate `pull-request` proof type that renders
grey and never says merged, `ProofBadge` renders it that way, and validation
**rejects** a `merged-pr` proof on any contribution that is not merged.

**Five validation rules added** — required problem and change, no merged proof on
an unmerged request, `mergedAt` not before `openedAt`, internally consistent
diff arithmetic, and `/open-source` registered as a real route. All five were
confirmed to fire by injecting defects.

**The lifecycle rail is two stops, and that is the point.** A real pull request
has review rounds, CI and revisions, none of which is in the records, so none of
it is drawn. Only opened and merged-or-not — which is what makes the terminal
stop honest rather than decorative.

**The repository graph encodes one thing**: pull requests per repository, as node
size, with the number also printed. Lines are a decorative `aria-hidden` SVG;
every node is a real `<button>` in DOM order, and below `md` the ring is dropped
for a plain tappable list rather than asking a touch user to hover or drag.

**Shared filter primitive.** `components/ui/FilterChipGroup` was extracted from
`/work`'s domain filters so the two pages cannot drift into subtly different
radio-group keyboard behaviour.

**Navigation moved to the `lg` breakpoint.** Seven destinations plus logo, GitHub
and Resume do not fit a 768px bar without dropping hit areas below 44px. Measured
fitting at 1024px. A phase adding an eighth destination must re-measure.

**Browser-verified**, 58 checks on a production build at 1280/1024/768/430/390/
360 px and under reduced motion: one `<h1>` carrying the claim, unique metadata,
all seven contributions and URLs, problem/change/tests/files on every card, the
counts matching the records, the open PR reading open everywhere and never
merged, no invented activity language, status/area/graph filtering, arrow-key
radio groups with one tab stop each, no overflow, nothing stranded after a
jump-scroll, no console errors, and ten existing routes plus the homepage story
and Engineering Core unaffected.

**Three defects found and fixed by that pass**: 82px of horizontal overflow at
360px caused by grid items defaulting to `min-width: auto` so an unbreakable file
path widened its column instead of truncating; two interactive targets under 24px
on desktop from an `sm:min-h-0` that belongs on chips and not on controls; and
graph edges drawn at 0.25 CSS pixels by a non-scaling stroke, i.e. invisible.

**Known follow-up for Phase 16:** the `javascript` skill still cites #395 as
evidence, which the corrected language data contradicts.

---

# PHASE 15 — RESEARCH PAGE

Create:

`/research`

Categories:

## Completed / Executed Research

- [x] KnowledgeGuard / EGB

## Research-driven Engineering

- [x] CortexWard

## Systems Experiments

- [x] Emergency Mesh

## Current FYP

- [x] SCAR-OS

SCAR-OS (previously VICE OS) must currently be represented carefully:

`Current FYP — Research & Architecture Stage`

Do not claim unimplemented features are working.

## Phase Completion

- [x] Phase 15 complete

### Completion Notes

Completed 2026-09-20. Route: `/research`.
Documented in `docs/portfolio-2026/research-page.md`.

**The page's argument is made structurally before it is made in prose.** Written
as four careful paragraphs, a completed factorial, a pre-alpha security pipeline,
a half-validated BLE protocol and a README all read as equally substantial. So
the page opens with a ledger — four entries against four evidence states — and
the honest shape is visible in one glance: 6 evidenced / 0 built for
KnowledgeGuard, 0 evidenced / 3 built for CortexWard, 7 evidenced / 1 not built
for Emergency Mesh, and 1 not built for SCAR-OS.

**Nothing in that ledger is authored.** Every cell counts items derived from
records the case studies already carry: findings, protocol steps with their own
status, ladder rungs with theirs, and pre-registered work not yet run. A
capability cannot be promoted by editing a sentence on this page — it has to be
promoted in the record the case study also reads.

Two mappings are deliberate: a `live` protocol step is **evidenced** because the
record means it ran on two real phones, and an implemented ladder rung is
**built** because the code exists and nothing has measured it. Implementation is
not evidence.

**Counts are not a score.** They are not comparable between rows — different
projects document different kinds of item — and the caveat, the measure line and
the table caption all say so. Cells are inspectable so the classification can be
checked rather than trusted, and an empty cell is disabled.

**KnowledgeGuard disclosure: preserved, not widened.** Published are measured
scores, counts and statistics, the categories the project's own Tier P policy
clears. Nothing was added whose publication status is ambiguous, and the
already-cleared numbers were not reverted merely because the repository is
private. All four readings are kept apart and none stands in for another: the
measured interaction, the oracle gain with its interval, the **detector routing
reversal** (0.064 F1 below type-agnostic), and the +41.5 figure rendered under
the label "the number that must not be quoted" rather than as a success claim.
The correction is rendered by the same component the case study uses, at the same
weight, keeping its wording — *the number stands; the causal reading does not*.
E6 is marked not run and the HotpotQA replication incomplete, with no numbers for
either.

**Emergency Mesh keeps all four of its states apart.** Hardware-verified
behaviour and the unimplemented multi-hop relay come from the ledger; the
simulation-only statement and the outstanding device validation come from a
separate **Stated gaps** block, built from the case study's unevidenced
verification items. Those were kept out of the counts on purpose: a caveat on the
transport is not a ninth protocol step, and counting it would have
double-counted single-hop transfer.

**Validation gained five rules.** `category` must be known; `executed` requires a
complete status, recorded results and a verified proof entry; a non-executed
category carrying results is an error; `architecture-stage` must be
`current-fyp` and must record what is not built; and `/research` is a known
route. Anchor validation was also generalised — it previously accepted only
project slugs, so `anchorsFor(path)` now returns the anchors each route actually
renders and `null` where there is no scheme, which makes the rule stricter
rather than looser.

**No new 3D scene.** The brief rules out decoration, and a structured comparison
is the right instrument for this content. Heading level became a prop on
`ExperimentMatrix`, `ResearchFindings` and `ResearchCorrection` so they can be
subsections here and top-level sections in a case study without changing size.

**Browser-verified**, 73 checks on a production build at 1280/1024/768/430/390/
360 px and under reduced motion: structure and metadata, every research-integrity
assertion above, no restricted artifact names or private repository URLs, no
overclaiming vocabulary, SCAR-OS on its canonical wording with no trace of the
old name, ledger interaction, no target under 24px, nothing stranded after a
jump scroll, no overflow, no console errors, and twelve existing routes plus the
homepage story unaffected.

One defect found and fixed: the ledger's row-header links were `next/link`,
which rewrites an in-page `#hash` to `/research#hash` and routes a scroll
through the client router.

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

Clusters (rendered only where skills exist — an empty cluster is not drawn):

- [x] Languages — 7
- [x] Frontend — 3
- [x] Backend — 4
- [x] AI — 3
- [x] Security — 2
- [x] Mobile — 2
- [x] Systems — 2
- [ ] Research — no skill currently carries this category, so no cluster renders
- [x] Infrastructure — 2
- [x] Developer Tools — 1

Clicking a skill should reveal:

- [x] projects
- [x] role/use
- [x] evidence
- [x] related work

## Phase Completion

- [x] Phase 16 complete

### Completion Notes

Completed 2026-09-20. Route: `/skills`, plus the homepage `TECH_STACK` section.
Documented in `docs/portfolio-2026/skill-galaxy.md`.

**One skill list, not three.** `/skills` carried a languages column, eight
category chip panels and the physics pills, all reading canonical content and
presenting it three different ways. The Galaxy is now the single surface. The
cube, the physics playground and the homepage spotlight were all preserved —
they were never reference lists, and the spotlight now carries evidence and
links into the Galaxy rather than glowing at bare nouns.

**Nodes are skills; edges are shared work, not resemblance.** Two technologies
are joined because they were used on the same project, study or pull request,
which is a fact in the records — so the clusters that appear can be opened and
checked. 26 technologies, 9 clusters, 73 evidence links, 83 shared-work
connections, all counted rather than written down.

**Not WebGL, on purpose.** The information is labels and relationships; in three
dimensions labels face away from the camera, nodes occlude, and hit-testing gets
worse on a phone. The Galaxy is DOM and SVG, so every skill is a real `<button>`
in document order — there is no separate 2D fallback to keep in sync, because
tab order, focus, 44px targets and screen reader output are properties of the
only implementation. Nothing depends on hover or dragging. Edge endpoints are
measured from the live DOM and re-measured on resize and after fonts load, which
is what keeps them attached when three columns reflow to one.

**Four unsupported claims removed or corrected.** `linux` had no project,
contribution or research reference at all and was removed. `python` no longer
cites the ASF docs PR (one line of Markdown). `javascript` no longer cites
loop-engineering #395 (`action.yml` and a README) — that work is real, so a
`github-actions` skill now carries it honestly. `typescript` gained #437, whose
diff is TypeScript.

**The portfolio became a canonical project**, because the brief's evidence
examples name it and citing something that is not in the record is exactly what
this phase forbids. Verified first: the repository is public and the site
returned 200. Recorded as active-development rather than production — it is live
but the admin and CMS work is unfinished — with two verified proofs (the
deployment and the CI gate) and two recorded limitations.

**Two validation rules make it permanent:** a skill with no evidence of any kind
fails, and a Languages-category skill citing a pull request must be cited back by
that request's own language list. The second rule is what caught both evidence
errors above.

**Deleted `components/SkillBar.js`** — unused, and literally the "Python 90%"
bar this phase exists to prevent.

**Browser-verified**, 58 checks on a production build at 1280/768/430/390/360 px
and under reduced motion: zero percentage strings and zero progress bars, all 26
skills reporting at least one piece of evidence, every relationship the brief
names checked individually, **every internal evidence link fetched for a 200 and
every anchored link visited to confirm it lands on a visible element**, category
dimming, focusable nodes, a touch tap opening evidence with no hover, 44px nodes
on mobile, the cube and playground still rendering, no overflow, nothing stranded
after a jump scroll, and ten routes unaffected.

**Three defects found and fixed.** The skill cube could not shrink — a Three.js
canvas sized in pixels at mount sets a grid item's automatic minimum size, so the
container never got narrower, the resize observer never fired, and the page ran
196px past a 360px viewport after a rotation; fixed with `overflow-hidden` (which
sets that minimum to zero) plus a real resize handler for the renderer and camera
aspect. Cluster headings were 23px on a pointer. And `/work#meditalk` scrolled
nowhere, because archived projects live behind a collapsed panel — `/work` now
expands the archive when the hash matches an archived slug.

---

# PHASE 17 — ABOUT + CREDENTIALS

Create/rebuild:

`/about`

Include:

- [x] identity
- [x] engineering philosophy
- [x] education
- [x] technical interests
- [x] current status
- [x] selected credentials

Do not prioritize certifications over engineering work.

Credentials should be supporting evidence.

## Phase Completion

- [x] Phase 17 complete

### Completion Notes

Completed 2026-09-20. Route: `/about`.
Documented in `docs/portfolio-2026/about-page.md`.

**The philosophy section does not assert character.** Careful, detail-oriented,
passionate about clean code — anyone can type that, and a reader with any
experience discounts all of it. The page's centrepiece is instead **four real
engineering decisions, read from the case studies, each shown with what it
cost**: a model is never allowed to be the evidence (CortexWard), freeze the
analysis before the first result existed (KnowledgeGuard), label the mesh demo
as a simulation (Emergency Mesh), refuse yarn and pnpm rather than guess
(VeriPatch). The text is read from each project's own record, so this page and
the case study cannot disagree, and validation **rejects a featured decision
that records no trade-off** — the section is titled "with what they cost".

**Principles have to point at work.** Each of the five carries project slugs,
validation requires at least one and requires every one to resolve, so a
statement about how Amar works cannot be added without evidence existing
somewhere else first.

**Everything checkable is derived**: education and dates from the canonical
record, "6 merged pull requests across 6 repositories" from the contributions,
current focus from project and research status (so nothing stays current because
a paragraph went stale), and the credential split from the credential list.
A browser check asserts **zero matches against twelve invented-experience
patterns** — years of experience, clients include, worked at, award-winning,
N users, testimonial, passionate.

**Credentials are counted, not claimed.** Eleven in total, nine Google and two
Udemy, derived by `getCredentialsByIssuer()` precisely because the claim it
replaces said "11 Google certifications". Four selected credentials appear with
verify links and a path to the full list; `/certifications` is unchanged and
still renders all eleven. The section sits after the decisions, principles,
focus and education, and a browser check asserts that ordering.

**Reused rather than rebuilt:** `PortraitOrbit` at full portrait size and the
homepage `Education` timeline. **No second Engineering Core** — a check asserts
zero canvases in `<main>`.

**Certifications left the primary navigation** rather than making the row nine
wide. The route is unchanged and reached from /about, the footer and the
sitemap; giving a certificate list top-level billing beside the work was the
wrong emphasis anyway.

**Browser-verified**, 65 checks on a production build at 1280/1024/768/430/390/
360 px and under reduced motion: structure and metadata, the positioning and its
four linked supporting areas, the verified education facts, SCAR-OS as "a
proposal, not an implementation" with no trace of the old name, the four
decisions with their costs and case-study links, the credential counts and
ordering, **every internal link fetched for a 200 and every anchored link
visited to confirm a visible target**, no target under 24px, no overflow,
reduced motion clean, no console errors, eleven routes unaffected,
`/studio/admin` still free of portfolio chrome, and the homepage story and
canvases intact.

**Two defects found and fixed.** Seven pixels of horizontal overflow at 360px
came from the orbit rings: they are square elements animating `rotate: 360`, and
a rotated square's bounding box is √2 times its width even though the visible
content is a circle that fits — fixed with `overflow-x: clip` on the portrait
column, which is the one overflow value that leaves the vertical axis visible so
the badge is not cut off. Fourteen controls were under 24px on a pointer from an
`sm:min-h-0` that belongs on chips rather than controls.

---

# PHASE 18 — RESUME SYSTEM

- [x] Replace stale resume presentation.
- [x] Create `/resume`.
- [x] Use canonical portfolio data where practical.
- [x] Ensure project names/statuses match portfolio.
- [x] Include current OSS evidence.
- [x] Include current research.
- [x] Prevent resume/site content drift.

Optional later:

- [x] PDF generation if maintainable — via the browser's own print pipeline, so
  there is no artifact to regenerate and nothing that can go stale between
  builds. Verified by driving `Page.printToPDF`: 262 KB, 4 pages, A4.

## Phase Completion

- [x] Phase 18 complete

### Completion Notes

Completed 2026-09-20. Route: `/resume`.
Documented in `docs/portfolio-2026/resume-system.md`.

**The static file had already drifted, exactly as Phase 2 predicted.**
`public/resume.html` still called the final-year project **VICE OS** — renamed
site-wide in Phase 3, with validation rejecting the old name in content ever
since, but the résumé was not content so nothing checked it. It also listed
seven skills the registry does not carry, including the `linux` entry Phase 16
removed for having no evidence. The contribution list, statuses and credential
counts were all typed by hand.

**It is now a route rendered from the same selectors as the site**, so a status
change, a merged pull request or a new credential updates it in the same commit,
and content validation fails the build if a reference stops resolving.

**Two shaping rules live in the selectors, not the page.**
`getResumeProjects()` excludes the archive — a résumé is a claim about current
capability and a retired 2023 project is not one. `getResumeSkills()` returns
every skill rather than featured ones, because a résumé is the one surface where
completeness beats curation and every skill now has evidence behind it. The page
then prints flagship work and the FYP in full and names the secondary projects in
one line: four A4 pages of project entries is a portfolio, and the site already
is the portfolio.

**Spoken languages became canonical.** English, Urdu and Sindhi were on the old
résumé; rather than drop a published claim, `Profile.spokenLanguages` models it
and validation fails if it is empty.

**No PDF generator, deliberately.** The print stylesheet inverts to black on
white, hides the site chrome and the print button, resets the document's Tailwind
colours wholesale, **expands link destinations** so a printed copy does not throw
away every URL, and sets `break-inside: avoid` on sections and entries. The
browser's "Save as PDF" produces the document — one fewer dependency, and one
fewer artifact that can silently stop matching the site.

**The print pass caught a bad bug:** the first version hid `header` and `footer`
wholesale to drop the site chrome, and the résumé's own name-and-contact block is
a `<header>` — so **the printed résumé had no name on it.** The rule is now
`header.sticky`, which is the Navbar's class and not the document's.

**The old URL still works.** `/resume.html` permanently redirects (308) because a
copy may be in an application already sent, and `profile.resumeUrl` is now
validated against the routes that exist — a résumé button that 404s would be
broken in the navigation of every page.

**Browser-verified**, 54 checks on a production build at 1280/768/430/390/360 px,
under reduced motion and under emulated print media: the drift gone, every fact
matching the site, all seven pull requests with the open one printed as open,
9 Google / 2 Udemy with no "11 Google", the print rules (nav hidden, **name
visible and black**, white background, URLs expanded), a real multi-page PDF from
`printToPDF`, the redirect, no remaining link to the deleted file, no target
under 24px, no overflow, no console errors, and eleven other routes unaffected.

---

# PHASE 19 — CONTACT + WORK WITH ME

## Contact

Replace mailto-only flow.

Categories:

- [x] Engineering opportunity
- [x] Internship/job
- [x] Research collaboration
- [x] Open source
- [x] Client project — routes to the Studio request form
- [x] Other

- [x] Secure backend submission.
- [x] Validation.
- [x] spam protection.
- [x] user feedback.
- [x] admin visibility — shares the `studio_leads` table the admin already reads.

## Client Funnel

Preserve:

- [x] `/hire`
- [x] `/studio`
- [x] `/studio/request`

Clarify:

`Amar Digital Systems — independent engineering practice by Amar Jaleel`

- [x] Stated in both footers; "View agency page" replaced.

## Phase Completion

- [x] Phase 19 complete — **with one open item**, below.

### Completion Notes

Completed 2026-09-20. Routes: `/contact` rebuilt, `/api/contact` added.
Documented in `docs/portfolio-2026/contact-and-funnel.md`.

**The old form failed silently.** It built a `mailto:` URL and navigated to it,
which does nothing visible unless the visitor has a mail client configured — no
confirmation, no record, and no way for anyone to know a message was lost. That
was the default path, and silent failure is the worst property a contact form can
have.

**Categories are canonical**, read by both the form and the API, because one that
exists on only one side is a submission that fails for a reason nobody can see.
The category is asked first, since it changes what the rest of the form is for.
`client_project` surfaces a pointer to the Studio request form rather than
collecting half a project brief badly.

**Submissions go to the existing `studio_leads` table**, discriminated by
`source`, using exactly the columns the Studio flow has written since Phase 0.5.
No schema change, a proven insert path, and admin visibility for free.

**Three spam layers, none load-bearing alone:** an off-screen `aria-hidden`
honeypot that returns the `201` a bot expects and writes nothing, a 2.5-second
timing gate (client-supplied, so advisory), and a rate limit.

**The rate limit's first version was wrong and the test caught it.** One counter
for all requests punished someone who mistypes their email four times exactly
like a bot — locked out for ten minutes. It is now two counters: 30 requests per
ten minutes to blunt a flood, and **3 accepted submissions**, counted only after
validation passes. Verified: eight consecutive invalid submissions all return
400.

**Feedback is per field and persistent.** `aria-invalid` plus a matching
`aria-describedby` on each bad field, focus moved to the first problem, and a
`role="status"` region rather than a toast — a toast that has faded is a result
the visitor cannot get back to.

**The funnel is preserved and the positioning clarified.** Both footers now read
"An independent engineering practice by Amar Jaleel", and "View agency page"
became "How I work" — *agency* implies a company with staff, and a check asserts
the word appears on none of the three routes.

**Browser-verified**, 42 checks, plus direct API probes covering the empty body,
a hostile payload (including `javascript:` on the URL field, rejected on
protocol), the honeypot, the timing gate, method rejection and both rate limits.

**Verified live, and the test earned its keep.** One marked submission was sent
with approval. It was **rejected** — `401 / 42501, "new row violates row-level
security policy for table studio_leads"` — while the Studio flow's
identical-shaped insert succeeds. The difference is one column: the table's RLS
policy constrains what a row may *contain*, not only who may insert one, and its
`WITH CHECK` pins `source`.

That exposed a bug in the fallback: it only retried on `400`, and PostgREST
reports a `WITH CHECK` failure as **401**. Fixed to retry on 400/401/403, and
re-tested — now `201`, with the reason logged. Phase 0.5 had listed anonymous
INSERT as "assumed allowed — not tested"; it is allowed, but only for row shapes
the policy approves, which is stricter and better than assumed.

**Remaining limitation:** the category is the first line of every message, so
nothing is lost to a human reading it, but the admin cannot filter on
`source LIKE 'contact:%'` until the policy is widened or a dedicated
`contact_messages` table exists. That is CMS-database work.

**Two rows prefixed `TEST —` now exist in `studio_leads`**, one from each
endpoint. `anon` cannot delete them; they need removing from the Supabase
dashboard.

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
