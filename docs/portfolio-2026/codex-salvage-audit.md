# Codex Infinitum — Salvage Audit

**Date:** 2026-09-18
**Phase:** 0.5
**Scope:** every currently-unreferenced module left behind by the Codex Infinitum
experiment, classified for the Engineering Universe rebuild (Phases 3–5, 16).

## Background

Commits `677819f` → `fef0a46` built "Codex Infinitum", an App Router (`app/`) 3D
universe with 15 explorable CS realms. `fef0a46` ("restore original portfolio and
isolate CODEX INFINITUM") deleted the `app/` tree but left its entire support
layer in place. Nothing under `lib/` (except `lib/site.ts`, revived in Phase 0.5),
`store/`, `styles/tokens.css`, or `styles/universe.css` is imported by any file in
`pages/` or `components/` — verified by grep.

That is ~2,400 lines of unreferenced TypeScript and CSS. It still costs build time
(TypeScript type-checks it) and it is the sole reason `zustand`, `gsap`, and
`@pmndrs/detect-gpu` remain in `package.json`.

**Nothing in this subsystem was deleted in Phase 0.5.** This document is the
decision record for when the rebuild reaches it.

## Architectural context

Two facts constrain every decision below:

1. **The site is Pages Router.** Codex was written for App Router. Nothing here
   uses `app/`-only APIs (no `next/navigation`, no server components, no route
   handlers), so the portability problem is smaller than it looks — but any
   module that assumed an `app/`-tree file layout needs its imports revisited.
2. **App code is `.js` with `checkJs: false`.** These modules are `.ts` and are
   genuinely type-checked. Importing them from `.js` pages works (Next compiles
   both), but the types provide no safety on the consuming side until the
   consumer is also TypeScript.

## Classification

| Module | Lines | Decision |
|---|---|---|
| `lib/deviceTier.ts` | 54 | **KEEP** |
| `lib/simulations/engine.ts` | 76 | **KEEP** |
| `lib/useModalA11y.ts` | 66 | **KEEP** |
| `lib/journey/cinematicCamera.ts` | 104 | **ADAPT** |
| `store/universeStore.ts` | 269 | **ADAPT** |
| `lib/sound.ts` | 352 | **ADAPT** |
| `styles/tokens.css` | 156 | **ADAPT** |
| `lib/environments/registry.ts` | 1006 | **ADAPT** (content), **DELETE** (shape) |
| `lib/environments/types.ts` | 55 | **ADAPT** |
| `lib/simulations/types.ts` | 26 | **ADAPT** |
| `lib/simulations/registry.ts` | 29 | **DELETE** |
| `lib/realms.ts` | 216 | **DELETE** |
| `lib/nexusDialogue.ts` | 138 | **DELETE** |
| `lib/creator.ts` | 56 | **DELETE** |
| `lib/journey/avatarScript.ts` | 85 | **DELETE** |
| `styles/universe.css` | 66 | **DELETE** |
| `lib/markdown.js` | 74 | **DELETE** |

---

## KEEP

### `lib/deviceTier.ts`

**What it does.** Returns a `DeviceTier` of `0 | 1 | 2` from a synchronous,
SSR-safe heuristic: WebGL support, then `navigator.deviceMemory` and
`hardwareConcurrency`. Also exports `prefersReducedMotion()`, `supportsWebGL()`,
`isBrowser()`, and `particleBudget(tier)`.

**Pages Router compatibility.** Total. Zero React, zero DOM-tree assumptions,
guards every browser access behind `isBrowser()`, returns tier 2 on the server
and refines on mount. Drop-in usable today.

**Value to the Engineering Universe.** This is exactly the Tier A / B / C
contract the roadmap already specifies in Phase 4 ("Performance Tiers") and
Phase 34. The tier semantics in the file and the tiers in the roadmap line up
one-for-one. It would be wasteful to re-derive this.

It also has immediate value *outside* the 3D work: `ParticleNetwork`,
`GravitySkills`, and `SkillCube` currently run three unconditional
`requestAnimationFrame` loops on every device with no low-power path. Wiring
them through `quickDeviceTier()` is a small change with a real mobile win.

**Dependency/debt cost.** None. The file's docstring mentions `@pmndrs/detect-gpu`
as a *future* lazy refinement; it does not import it. Removing that dependency
does not affect this module.

**Decision: KEEP.** Use as-is. The only caveat is that `deviceMemory` is
Chromium-only — the `?? 4` default is a reasonable fallback, but Safari/Firefox
will always land in tier 1 or 0 on the memory check. Worth revisiting with a
real GPU probe if tiering proves too pessimistic.

### `lib/simulations/engine.ts`

**What it does.** A single shared `requestAnimationFrame` loop with
`resume`/`pause`/`stop`, tier-gated frame skipping (`{0: -1, 1: 1, 2: 0}` —
tier 0 never ticks), automatic pause on `visibilitychange`, and a
`{dt, elapsed, frame}` tick payload.

**Pages Router compatibility.** Total. Pure function, no React, no imports except
a `type` import from `deviceTier`.

**Value to the Engineering Universe.** Phase 34 asks for "pause off-screen
rendering", "pause hidden-tab rendering", and tier-based particle reduction. This
implements two of those three generically, so each future canvas or 3D scene
writes only its draw function. It is also strictly better than what the existing
components do: `ParticleNetwork` hand-rolls tab-visibility pausing, and
`SkillCube` and `GravitySkills` have no pausing at all.

**Dependency/debt cost.** None — type-only import.

**Decision: KEEP.** Genuinely reusable infrastructure. Consider making it the
single tick source for all animated canvases in Phase 34.

### `lib/useModalA11y.ts`

**What it does.** A focus-trap hook: moves focus into the dialog, traps
Tab/Shift+Tab, closes on Esc, restores focus to the previously focused element.

**Pages Router compatibility.** Total — a plain React hook.

**Value to the Engineering Universe.** Phase 33 lists "dialog accessibility" and
"keyboard navigation" as requirements, and Phases 7/16 introduce case-study
drawers and a clickable skill galaxy that will need exactly this. There is
currently no modal anywhere in the site, so it is unused *yet*, not obsolete.

**Dependency/debt cost.** None.

**Decision: KEEP.** Zero cost to retain, and Phase 33 would otherwise rewrite it.

---

## ADAPT

### `lib/journey/cinematicCamera.ts`

**What it does.** Builds a GSAP timeline for a "dive into the machine" transition:
a dim/spark anticipation beat, a contract, a scale-to-6× surge with opacity
falloff, and a white impact flash. Also exports `reducedMotionDive()`, which skips
straight to the callback. Pure — callers pass element refs; it touches no DOM
queries and no React.

**Pages Router compatibility.** Total. It is framework-agnostic.

**Value to the Engineering Universe.** Phase 4 explicitly wants "scroll camera
effects" and "restrained parallax" while banning "forced uncontrolled camera
spinning" — and this file is a *deliberate, authored* camera move, which is the
right instinct. The reduced-motion branch is already built in, satisfying a
Phase 33 requirement for free.

**Why ADAPT and not KEEP.** Two mismatches. First, it animates CSS 2D transforms
on DOM elements, not a `THREE.Camera` — the name is aspirational. For a real R3F
Engineering Core the easing curves and act structure are the valuable part, not
the implementation. Second, it is the *only* consumer of `gsap` (~70 KB gzipped)
in the entire repo, and the rest of the site animates with Framer Motion. Keeping
GSAP for one timeline is hard to justify.

**Decision: ADAPT.** Port the act structure and timings to Framer Motion (or to
R3F `useFrame` if it becomes a genuine camera move) and drop the `gsap`
dependency. Preserve `reducedMotionDive`'s contract exactly.

### `store/universeStore.ts`

**What it does.** A Zustand store with `persist` + `createJSONStorage` covering
navigation (current/previous/selected/hovered realm, transition phase),
persisted progress (visited realms, unlocked easter eggs, unlocked skills, time
spent), boot state, NEXUS assistant mode/animation/dialogue/visibility, a
knowledge-mastery panel flag, runtime device capability (tier, WebGL support,
reduced motion), and living-realm state (active landmark, knowledge level,
simulation step, master-journey phase).

**Pages Router compatibility.** Zustand is router-agnostic and works fine. One
real hazard: `persist` with `localStorage` hydrates asynchronously, which in
Pages Router causes hydration mismatches unless read through the store's
`skipHydration`/`onRehydrateStorage` pattern or a mounted guard. This needs care,
not avoidance.

**Value to the Engineering Universe.** Roughly 70% of the state shape is Codex
fiction (realms, NEXUS, easter eggs, master-journey phases) that the new roadmap
does not have. The remaining 30% is real and needed: the device-capability slice
and the persistence wiring. Phase 4's tier system and Phase 16's skill-galaxy
selection state both need somewhere to live.

**Dependency/debt cost.** `zustand` is 1.2 KB and this is its only consumer. The
site has no other global state today — every page is self-contained — so adding
a global store is a genuine architectural decision, not a free carry-over.

**Decision: ADAPT.** Keep the persistence pattern and the device slice as the
skeleton for a much smaller store. Delete the realm/NEXUS/journey slices with the
rest of the Codex fiction. Do not introduce the store at all until a phase
actually needs cross-page state — most likely Phase 16.

### `lib/sound.ts`

**What it does.** A procedural Web Audio synthesiser — no audio files. Seven
authored sounds (typewriter click, power ignition, cinematic sweep, realm hover,
realm select, signature action, journey complete) built from oscillators, filtered
noise, and ADSR envelopes. Lazily creates/resumes the `AudioContext` on first
interaction, returns `null` safely when unavailable, and is silent by default,
citing WCAG 1.4.2.

**Pages Router compatibility.** Total — pure Web Audio, SSR-guarded.

**Value to the Engineering Universe.** Genuinely impressive and technically
interesting work, and the zero-asset approach means it costs no bandwidth. But
the current roadmap never asks for audio. Nothing in Phases 1–36 mentions sound.

**Why ADAPT rather than KEEP or DELETE.** The synthesis helpers are reusable and
the default-silent + explicit-opt-in design is correct. But shipping it wired up
would be a product decision nobody has made, and shipping it unwired is dead
weight in the bundle.

**Decision: ADAPT — but defer.** Retain the file unreferenced for now; revisit if
a phase introduces an audio affordance. If none has by the time Phase 34
(bundle analysis) runs, downgrade to DELETE. The sound names are Codex-specific
and would need renaming to the new domain vocabulary anyway.

### `lib/environments/registry.ts` + `lib/environments/types.ts`

**What they do.** `types.ts` defines `LandmarkObject` (3D position, 2D normalized
position, `whatIsIt` / `whyMatters` / `realUse`, a three-level
`ProgressiveExplanations` block, difficulty, skills unlocked, connected realms,
connected projects) and `RealmKnowledgeDefinition`. `registry.ts` is 1,006 lines
of populated content for the CS realms — the Silicon Foundry entry alone
describes a CPU tower, memory array, and bus network with beginner/intermediate/
expert explanations each.

**Pages Router compatibility.** Total — plain typed data.

**Value to the Engineering Universe.** The *content* is the asset here, and it is
substantial, accurate, and hand-written. The `ProgressiveExplanations` idea
(beginner → intermediate → expert on the same object) is a strong pattern that
maps directly onto Phase 7's case-study depth requirements and Phase 16's
"clicking a skill reveals role/use/evidence".

The *shape* does not survive. `RealmKnowledgeDefinition` is built around realms,
NEXUS commentary, and camera overviews — concepts the new roadmap deletes. Phase 2
defines an entirely different canonical model (`Project`, `ProofItem`,
`SkillEvidence`, …).

**Dependency/debt cost.** None (no imports beyond its own types), but 1,006 lines
is the single largest contributor to the dead-code type-check cost.

**Decision: ADAPT (content), DELETE (shape).** Mine `registry.ts` for explanation
copy when Phase 16 builds evidence-backed skills — the CPU/memory/network
material is reusable teaching content. Carry the `ProgressiveExplanations`
three-level pattern into the Phase 2 model. Delete `RealmKnowledgeDefinition`,
`LandmarkObject.position`/`pos2D`/`connectedRealms`/`nexusComment`, and the realm
framing. **Do not delete `registry.ts` until its content has been mined** — that
copy is not recoverable from anywhere else.

### `styles/tokens.css`

**What it does.** A full design-token layer: void/surface scale, text hierarchy,
semantic colours, a realm-theming system driven by `[data-realm]` with
`@property`-registered custom properties for native colour interpolation, a type
scale (`--fs-display` … `--fs-xs` with `clamp()`), spacing, radii, elevation/glow,
a z-index scale, motion easings and durations, and a reduced-motion block that
collapses all durations to zero.

**Pages Router compatibility.** Total — it is plain CSS. It is currently imported
by nothing (`globals.css` does not reference it).

**Value to the Engineering Universe.** Phase 3 asks for exactly this file:
background/surface/border tokens, text hierarchy, spacing, radii, shadows, a
domain accent system, and motion tokens (`fast`/`normal`/`slow`/`cinematic` with
shared easings and reduced-motion variants). The motion scale here
(`--duration-fast: 150ms` … `--duration-cinematic: 1200ms`, `--ease-universe`,
`--ease-enter`) maps onto Phase 3's request almost verbatim.

The `@property` + `[data-realm]` mechanism is directly reusable as Phase 3's
"domain accent system" (Product → teal, AI → violet, Security → amber/red,
Systems → blue, Research → purple, Open Source → green) — rename `[data-realm]`
to `[data-domain]` and swap the palette.

**Why ADAPT.** The token *architecture* is right; the *values* are Codex's
(15 realm palettes, a `--void: #050508` near-black) and clash with the live
portfolio's `#07111f` midnight/teal identity, which must not be thrown away. It
also duplicates concepts already in `tailwind.config.js`, so adopting it wholesale
without reconciling the two would create a second competing source of truth —
precisely the problem Phase 2 exists to end.

**Decision: ADAPT.** Use as the structural template for the Phase 3 token layer.
Reconcile against `tailwind.config.js` and the existing `globals.css` helpers so
there is exactly one source of truth. Keep `@property`, the motion scale, and the
reduced-motion block; replace the palette.

### `lib/simulations/types.ts`

**What it does.** `SimStep` (`id`, `label`, `caption`, `nexusLine`) and
`SimulationDefinition` (`realmSlug`, `title`, `steps`).

**Value.** The step-sequence concept — a process broken into labelled, captioned
stages — is precisely what Phases 5, 9, 12, and 13 need (VeriPatch's
scan → sandbox → rescan → evidence pipeline; SceneForge's render pipeline;
Emergency Mesh's discovery → encrypt → forward → ACK).

**Decision: ADAPT.** Keep the `SimStep` shape; drop `nexusLine` and `realmSlug`.
Small enough to rewrite from scratch, but the concept is validated — carry it
forward rather than reinventing it.

---

## DELETE

These are Codex fiction with no counterpart in the new roadmap. None should be
deleted during Phase 0.5; they come out when the rebuild reaches the phase that
supersedes them.

### `lib/realms.ts`
Typed registry of the 15 realms (slug, name, subtitle, domain, identity,
realmClass, nexusMode, challenge, colors). Entirely Codex world-building. The new
navigation is Home / Work / Research / Open Source / About / Work With Me. **No
salvage value beyond the colour values**, which are already duplicated in
`tokens.css`. Delete with `tokens.css`'s realm block in Phase 3.

### `lib/nexusDialogue.ts`
Authored dialogue for "NEXUS", an AI narrator persona — greetings, idle lines,
and a `NexusEvent` reaction union. The new portfolio has no narrator character,
and a self-aware AI persona actively works against the roadmap's stated goal of
evidence-driven technical communication over spectacle. **Delete.**

### `lib/creator.ts`
A `CREATOR` object holding "Journey Archive" identity content plus `JourneyStep`
and `DnaStrand` types keyed by realm slug. Superseded by Phase 17 (`/about`) and
Phase 2's `SiteContent` model, both of which read from the canonical data layer.
The docstring already notes professional links come from `data/portfolio.js`.
**Delete** — but read it once before deleting, in case any biography phrasing is
worth keeping for Phase 17.

### `lib/journey/avatarScript.ts`
A five-line timed monologue ("The Architect's opening monologue") typed out before
the machine boots. This is the Codex equivalent of the boot screen, and Phase 0.5
has just established that long pre-content gates are a liability (the ~7s boot
screen was blocking the client funnel). **Delete.**

### `lib/simulations/registry.ts`
29 lines that derive `REALM_SIMULATIONS` by mapping over `REALM_KNOWLEDGE`. Pure
glue between two modules that are themselves being deleted or reshaped. **Delete**
— it has no independent value.

### `styles/universe.css`
Global base styles for the `app/` tree (`html, body` reset, `--void` background,
`--text-primary`). It explicitly scopes itself to "the App Router universe tree
(app/ only)" — a tree that no longer exists — and its resets conflict with
`globals.css`, which owns the live body background and typography. **Delete.**

### `lib/markdown.js`
Not Codex — older. Reads `data.md` from `process.cwd()` and returns raw content,
with stub helpers for extracting projects. **Two defects:** the repo file is
`Data.md` (capital D), so this would throw `ENOENT` on Linux (Vercel, CI) while
appearing to work on Windows; and `getProjects()` is unfinished. Superseded by
`data/portfolio.js` and Phase 2's canonical model. **Delete.**

---

## Dependency consequences

Once the DELETE and ADAPT decisions land:

| Package | Sole consumer | Fate |
|---|---|---|
| `gsap` | `lib/journey/cinematicCamera.ts` | Removable once ported to Framer Motion |
| `zustand` | `store/universeStore.ts` | Retain only if the reduced store is actually introduced |
| `@pmndrs/detect-gpu` | none (mentioned in a comment only) | **Removable now** |

Separately, these are declared in `package.json` and imported by nothing at all,
Codex or otherwise: `@formspree/react`, `@react-three/fiber`, `@react-three/drei`,
`@react-three/postprocessing`, `@tsparticles/react`, `@tsparticles/slim`,
`tsparticles`, `chart.js`, `react-markdown`.

**Note for Phase 4:** the R3F stack is installed but has never been imported or
built in this repository. The only working 3D is hand-rolled Three.js
(`components/SkillCube.js`). Treat R3F as unproven ground, not as existing
infrastructure.

## Recommended removal schedule

| When | Remove |
|---|---|
| Phase 3 (design system) | `lib/realms.ts`, `styles/universe.css`, realm block of `tokens.css` |
| Phase 4 (3D core) | `lib/journey/*` after porting the camera timeline |
| Phase 16 (skills) | `lib/environments/*` **after mining the explanation content** |
| Phase 17 (about) | `lib/creator.ts` after reviewing its biography copy |
| Phase 34 (performance) | `lib/sound.ts` if still unwired; all unused dependencies |
| Any time | `lib/nexusDialogue.ts`, `lib/simulations/registry.ts`, `lib/markdown.js` |
