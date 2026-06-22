# 🧠 PROJECT_MEMORY.md — CODEX INFINITUM
### The Context-Reset-Safe Source of Truth for Implementation

> If an AI context window resets, **read this file first**, then `universe-design/` docs 1–10.
> This file is updated at the end of **every** phase. Never let it go stale.

---

## 0. WHAT THIS PROJECT IS

**CODEX INFINITUM** — an interactive **Computer Science Universe**, not a normal portfolio.
The creator's portfolio (Amar Jaleel, *AI Product Engineer*) lives *inside* the universe.
Full design spec: `universe-design/1_world_concept.md` … `10_universe_review_and_expansion.md` (10 canonical docs, design phase COMPLETE).

**Non-negotiables (never remove):** Boot experience · NEXUS companion · the CS realms · exploration · RPG knowledge system · History (Founders' Constellation) · Theory depth (The Foundations) · Projects-as-Inventions.

**The universe = 15 places** (canon: doc 4 + doc 10):
- *Core:* Architect's Core (about/Amar)
- *7 Explorable Worlds:* Silicon Foundry, The Foundations, Code Helix, Neural Nebula, The Citadel, Data Archives, Soul Quarter
- *3 Structural Realms:* Founders' Constellation, Legacy Archive (v1.0), The Observatory
- *4 Connective Layers:* The Kernel (OS), Network Pathways, Cloud Expanse, Invention Archive
- *Frontier:* Unexplored Territories (fog)

All 15 are encoded in `lib/realms.ts` and `styles/tokens.css` (`[data-realm]` themes).

---

## 1. CURRENT PHASE

**PHASE 10.5 — Network Pathways World: ✅ DONE & TESTED.**
Implemented the custom networking environment and simulations using the Living Realm Engine:
- **Registry Update**: Populated `lib/environments/registry.ts` with coordinates, difficulty levels, skill unlocks, and cross-realm links for the 5 networking landmarks.
- **Cinematic 3D Scene**: Created `scenes/NetworkPathwaysScene.tsx` in R3F, rendering Client Terminal, DNS Beacon (orbiting scanner ring), Router Hub, Firewall Gate (scanning laser shield), and Server Core. Bound cameras to store state, performing cinematic "Packet POV" panning over active steps.
- **Canvas2D Fallback Backdrop**: Created `scenes/NetworkPathways2D.tsx` drawing a high-performance vector node diagram with click hit-testing.
- **Advanced Packet Simulation**: Created `NetworkPathwaysVisualizer.tsx` executing Canvas2D animations for:
  - TCP/IP Layer Elevator (Application -> Transport -> Internet -> Physical).
  - Packet POV creation (message fragments & attaching TCP/IP header envelopes).
  - DNS Discovery (Root -> TLD -> Auth server queries).
  - TCP Handshake (SYN -> SYN-ACK -> ACK pulses).
  - Router Decision mesh (displaying Blocked, Congested, and Selected routes).
  - Firewall header scanning laser sweeps and verification states.
  - Server unordered packet sorting and HTTP 200 OK readout.
- **Integration**: Updated `EnvironmentLayer.tsx` dynamic backdrops and `SignalVisualizer.tsx` dispatcher.
- **Build**: ✓ Verified clean node tsc typecheck + next build (11 routes static green).
**Next gate:** Phase 10.9 — Cyber Citadel (security world, threats scanner, OAuth token authentication, and TLS/cryptographic chambers).

---

## 2. EXISTING PROJECT ANALYSIS (the v1 portfolio — now the Legacy Archive)

### 2.1 Stack as found
Next.js **16.1.1** (Turbopack) · React **19.2.3** · JavaScript · Tailwind 3 · Pages Router.
Pre-installed & reused: three, framer-motion, tsparticles, matter-js, chart.js, @formspree/react. Gemini key in `.env.local`.

### 2.2 Reused
- `data/portfolio.js` (5 projects, 11 certs, skills, education) — to be restructured into universe data in later phases.
- The whole v1 site → **Legacy Archive** at `/legacy/*` (relocated via `git mv`, history preserved).
- Installed libs above.

### 2.3 Current on-disk structure (post Phase 0)
```
portfolio/
├── app/                       ← NEW · App Router universe
│   ├── layout.tsx             root layout: next/font (Orbitron/JetBrains/Inter), tokens, metadata, JSON-LD, data-realm
│   ├── page.tsx               Phase-0 universe entry placeholder (Boot replaces it in Phase 1)
│   └── page.module.css
├── pages/                     ← Pages Router (Legacy Archive + shared infra)
│   ├── legacy/                index, projects, skills, certifications, contact  → /legacy/*
│   ├── 404.js · _app.js · _document.js
├── components/                v1 components (used only by Legacy)
├── data/portfolio.js          v1 content (reused later)
├── lib/
│   ├── realms.ts              ← NEW · typed registry of all 15 realms (canonical)
│   ├── deviceTier.ts          ← NEW · 3-tier device detection + particle budget
│   └── markdown.js            (v1)
├── store/universeStore.ts     ← NEW · Zustand (nav/boot/NEXUS/device) + localStorage persist
├── styles/
│   ├── tokens.css             ← NEW · canonical design system (void palette, 15 realm themes, type, motion)
│   ├── universe.css           ← NEW · app/ global base (reset, focus ring, fonts)
│   └── globals.css            (v1 Tailwind globals — loaded only by pages/_app.js)
├── tsconfig.json · global.d.ts (CSS ambient types)  ← NEW
├── tailwind.config.js / postcss.config.js            (v1; scopes to pages tree)
└── universe-design/           the 10 canonical design docs
```

---

## 3. COMPLETED FEATURES
- ✅ Design phase: 10 canonical universe documents.
- ✅ Repository analysis + `PROJECT_MEMORY.md`.
- ✅ **Phase 0 — Foundation:**
  - Dependencies: `@react-three/fiber@9`, `@react-three/drei@10`, `@react-three/postprocessing`, `gsap`, `zustand`, `@pmndrs/detect-gpu`; dev: `typescript`, `@types/{react,react-dom,node,three}`.
  - TypeScript configured (`tsconfig.json`, `global.d.ts` for CSS ambient types).
  - `styles/tokens.css` — full canonical design-token system incl. all 15 realm themes + `@property` color-bleed + reduced-motion contract.
  - `styles/universe.css` — app/ global base.
  - `app/layout.tsx` (fonts via next/font, metadata, Person JSON-LD, `data-realm="architect-core"`) + `app/page.tsx` placeholder.
  - `lib/realms.ts` (15-realm typed registry), `lib/deviceTier.ts` (tiers/budget), `store/universeStore.ts` (Zustand + persist).
  - **Legacy preserved as route-based archive:** v1 pages `git mv`'d → `pages/legacy/*`; internal links updated (Navbar, Hero, index); imports re-aliased to `@/`.
  - **Green production build:** App `/` + Pages `/legacy/*` coexist; all 9 routes prerender.
- ✅ **Phase 1 — Boot Sequence** (canon doc 2 Act 1 / doc 6 §3):
  - Reusable system under `components/universe/boot/`: `CircuitGrid` (breathing/igniting void grid), `PowerCore` (proximity-ignition power trigger + click shockwave), `SystemTerminal` (GSAP-typed readout), `BootSequence` (orchestrator), `bootScript.ts` (deterministic FULL + EXPRESS timelines — no random text).
  - `components/universe/UniverseGate.tsx` (client) chooses full vs **express** boot from persisted `bootCompleted`, detects reduced-motion, owns boot→handoff; `HandoffPlaceholder.tsx` = the prepared handoff state ("inside the answer"; map arrives Phase 2).
  - `app/page.tsx` now renders `<UniverseGate/>` (removed Phase-0 placeholder + its CSS).
  - **GSAP** drives the typewriter timeline; **Zustand** `completeBoot()` persists the skip/express logic.
  - Skip via on-screen button **and** `Esc`. Full **reduced-motion** path: static readout + "[ ENTER ]" control; SR-only `aria-live` boot summary; `.sr-only` util added.
  - **Tested:** `next build` green (9 routes prerender) + `npx tsc --noEmit` exit 0.
  - **Scope respected:** no map / realms / NEXUS character / AI chat / projects / 3D — only the boot + handoff stub.
- ✅ **Phase 2 — Universe Map** (canon doc 2 Act 3 / doc 4 / doc 10):
  - `components/universe/map/realmLayout.ts`: CS-meaningful layered placement of all 15 realms (Core→Foundation→Physical→System→Creation→Intelligence→Protection→Future, History/Legacy as poles) + per-realm tagline/concepts + the relationship **EDGES** graph (the map teaches CS).
  - 3D (R3F): `UniverseCanvas` (tier-aware: star count/AA/dpr scale down; no post-processing), `StarField`, `RealmOrbit` (layer rings), `RealmNode` (staggered appear, idle bob, active glow), `EnergyConnections` (single-draw LineSegments, fade-in), `OrbitControls` (constrained, slow auto-rotate, off under reduced-motion).
  - 2D fallback: `UniverseMap2D` (SVG edges + accessible buttons, same layout/colors) for tier-0 / no-WebGL.
  - Overlay chrome: `RealmInfoCard` (name/identity/layer/purpose/concepts on hover/focus), `RealmIndex` (accessible, keyboard-navigable legend grouped by layer — parallel nav for the 3D map), status bar + travel-prep hint.
  - `UniverseMap` orchestrator: tier/WebGL/reduced detection → 3D or 2D; `dynamic(ssr:false)` for the canvas; drives hover + `selectRealm` (travel prep only).
  - Store: added `selectedRealm` + `selectRealm` (travel preparation; not persisted).
  - `UniverseGate` now hands off boot → `UniverseMap` (removed `HandoffPlaceholder`).
  - **Tested:** `next build` green (9 routes) + `npx tsc --noEmit` exit 0.
  - **Scope respected:** no realm interiors / NEXUS character / chat / projects / RPG — only the map + travel-prep state.
- ✅ **Phase 3 — NEXUS Companion** (canon doc 3 / doc 6 §7 / doc 8 §NEXUS):
  - `components/universe/nexus/`: `NexusCore3D` (R3F morphing polyhedron — cycles the 4 platonic solids, wireframe cage, heartbeat nucleus, realm color bleed, motion driven by 4 modes × 5 anim-states), `NexusCoreFallback` (CSS/SVG sigil for tier-0/no-WebGL/reduced), `NexusDialogue` (typed speech panel, aria-live), `NexusCompanion` (orchestrator).
  - `lib/nexusDialogue.ts`: **pre-scripted** lines (canon doc 3 §5) — first/return greeting, per-realm line ×15, idle lines. **No AI/Gemini backend** (that's a later upgrade path).
  - Behavior: greets on arrival; shifts mode + **bleeds the whole UI theme** to the active realm (`document.documentElement.dataset.realm`); idle patience (15s); speaks on realm selection (EXCITED) and on click.
  - Store: added `hoveredRealm` + `hoverRealm` (map hover lifted to store so NEXUS reacts); reuses existing `nexusMode`/`nexusAnimState`/`nexusDialogue`.
  - `UniverseGate` renders `<NexusCompanion/>` alongside `<UniverseMap/>` (persistent). `RealmInfoCard` moved bottom-left to clear NEXUS (bottom-right).
  - **Tested:** `next build` green (9 routes) + `npx tsc --noEmit` exit 0.
  - **Scope respected:** NEXUS visual + scripted dialogue only — no AI chat backend, no realm interiors, no projects, no RPG.
- ✅ **Phase 4 — First Realm vertical slice: THE FOUNDATIONS** (canon doc 4 / doc 10):
  - **Reusable realm engine** in `components/universe/realms/`: `RealmShell` (orchestrator + arrival cinematic + `data-realm` theming), `RealmHeader`, `RealmNavigation` (district tabs + return-to-map), `RealmDistrict` (topic grid), `KnowledgeArchive` (gated deep layer), `SkillUnlock` (ability toast), shared `realm.module.css`. **Future realms only add data.**
  - `realmContent.ts`: typed `RealmContent` model (3 districts + skill) + registry; **The Foundations** authored — Surface "The Hall of Axioms" (Logic/Math/Problem Solving), Interior "The Computation Engine" (Discrete Math/Boolean/Graphs/Algorithms/Complexity), gated Archive "The Incompleteness Vault" (Automata/Turing/Computability/Halting/P≠NP/Gödel) + skill "Computational Thinking".
  - **Travel wired:** map `RealmInfoCard` shows ENTER for enterable realms → `enterRealm` sets `currentRealm` → `UniverseGate` renders `RealmShell` (arrival flash + fade); `onExit` → `exitRealm` back to map. Non-enterable realms show "not yet charted".
  - **NEXUS reacts:** arrives in MENTOR mode, bleeds theme to gold/chalk, speaks the Foundations welcome (`enterLine`).
  - **Skill system foundation:** store `unlockedSkills` + `unlockSkill` (persisted); descending into the Deep Archive unlocks "Computational Thinking" with an ABILITY UNLOCKED toast. (Not the full RPG.)
  - **Tested:** `next build` green (9 routes) + `npx tsc --noEmit` exit 0.
  - **Scope respected:** only the realm engine + Foundations — no other realm interiors, projects archive, AI Core, or full RPG.
- ✅ **Phase 5 — Expand the realms** (canon doc 4 / doc 10): authored 11 more `RealmContent` entries (data only — engine untouched), each with Surface→Interior→Archive districts + a skill:
  - Explorable: **Silicon Foundry** (System Understanding), **Code Helix** (Software Architecture), **Neural Nebula** (Intelligence Engineering), **The Citadel** (Security Thinking), **Data Archives** (Data Intelligence), **Soul Quarter** (Creative Engineering).
  - Connective/system layers (same engine): **The Kernel** (Resource Orchestration), **Network Pathways** (Connection Architecture), **Cloud Expanse** (Distributed Thinking).
  - Structural: **Founders' Constellation** (Historical Perspective — Lovelace/Turing/von Neumann/Shannon/Hopper + modern pioneers), **The Observatory** (Frontier Vision — AI future/Quantum/BCI/AGI).
  - NEXUS: per-realm arrival lines (`ENTER_LINES` ×12) + per-realm mode already via `realm.nexusMode`.
  - **Legacy access restored:** map info-card routes `legacy-archive` → `/legacy` (the preserved v1) instead of "not yet charted".
  - **Now enterable: 12 realms.** Still non-enterable by design: Architect's Core (= About/personal, deferred) and Invention Archive (Phase 6).
  - **Tested:** `next build` green (9 routes) + `npx tsc --noEmit` exit 0.
  - **Scope respected:** no projects archive, no personal portfolio, no Gemini, no map redesign, no engine rewrite.
- ✅ **Phase 6 — The Invention Archive** (canon doc 7): projects as inventions (CLASS I–V, 9-part dossier), not portfolio cards.
  - `components/universe/inventions/`: `inventionData.ts` (typed `Invention` + `CLASS_META` + content), `InventionArchive` (chamber: blueprint cases grouped Flagship/Public), `InventionDossier` (declassified file overlay), `EngineeringTimeline` (Origin→Problem→Challenge→Results→Lessons→Future), `SystemBlueprint` (architecture layers), `TechnologyMatrix` (tech as materials), `ConceptLinks` (connected realms → travel back), shared `inventions.module.css`.
  - **Flagships (full dossier, private, redacted):** VisiRoD FIRS (CLASS II — Flutter/Supabase/PostGIS/Edge Functions/Next.js/FCM; realms code-helix·data-archives·network·citadel·cloud) + CommentFellows (CLASS I — Flutter/Next.js/Supabase/Gemini/FCM; realms nebula·helix·data·soul·citadel·cloud). Each carries a NEXUS comment. No fabricated metrics.
  - **Public works (compact, truthful from `data/portfolio.js`):** ZakatLink, Smart Notebook, Bus Reservation, EduResource Hub, MediTalk — real descriptions/tags/links preserved.
  - **Entry:** `invention-archive` now enterable — map info-card "OPEN ARCHIVE →" → `enterRealm("invention-archive")` → `UniverseGate` renders `InventionArchive`. Dossier realm-chips call `enterRealm` to travel back into the universe.
  - **NEXUS:** arrival line for the archive ("These are not files. They are proof that knowledge became reality…"); per-invention NEXUS quote shown inside each dossier.
  - **Tested:** `next build` green (9 routes) + `npx tsc --noEmit` exit 0.
  - **Scope respected:** no résumé page, no normal portfolio cards, no fake metrics, no contact section, no Gemini chat.
- ✅ **Phase 7 — Architect's Core & Observatory** (canon doc 4 §1/§8 / doc 2 Act 6): the identity + ending layer (Creator Chamber, not About/Contact pages).
  - `lib/creator.ts`: typed identity content — AI Product Engineer, origin question, 5-step journey, focus, **Knowledge DNA** (realm→trait), mission, future interests, horizon, invitation. A Journey Archive, not a résumé.
  - `components/universe/chambers/`: `ArchitectCore` (who built this — journey + focus + Knowledge DNA strands that link back to each realm via `enterRealm`), `Observatory` (the ending — current mission, future direction, on-the-horizon, **Transmission System**: LinkedIn/GitHub/Email channels from `data/portfolio.js`, no form), shared `chambers.module.css`.
  - **Routing:** `architect-core` + `the-observatory` are now enterable and intercepted in `UniverseGate` (custom chambers, not `RealmShell`). Map CTAs: "MEET THE ARCHITECT →", "ENTER OBSERVATORY →". (The Phase-5 `RealmContent` for the-observatory remains as latent data; chamber routing wins.)
  - **NEXUS:** arrival line for architect-core ("You have seen the universe. Now meet its architect…"); observatory keeps its frontier farewell line.
  - Cross-links: ArchitectCore "Continue to The Observatory →"; Observatory "Return to the universe".
  - **Tested:** `next build` green (9 routes) + `npx tsc --noEmit` exit 0.
  - **Scope respected:** no résumé page, no boring timeline, no RPG yet, no Gemini chat.
- ✅ **Phase 8 — RPG Knowledge System** (canon doc 4 Skills / doc 6 §6): knowledge becomes ability — not gamification (no XP/levels/badges/ranking).
  - `components/universe/knowledge/`: `knowledgeData.ts` (5 mastery branches × abilities, 4 learning paths, 8 achievements + pure evaluators), `AbilityNode`, `KnowledgeTree`, `LearningPath`, `MasteryConstellation`, `AchievementArchive`, `KnowledgePanel` (overlay), `KnowledgeButton` (persistent trigger), `knowledge.module.css`.
  - **All state DERIVED from real progress** (`visitedRealms` + `unlockedSkills` + `bootCompleted`): an ability is *locked* → *awakened* (realm visited) → *mastered* (Deep Archive skill unlocked). Branches: Foundation / System / Creation / Intelligence / Security. Paths: Architect / AI Engineer / Defender / Creator (stage = realm; clickable to travel). Achievements: First Awakening, Explorer, Cartographer, Deep Thinker, Builder, Historian, Architect, Horizon Seeker.
  - Store: `+knowledgeOpen` + `toggleKnowledge`.
  - **Access:** persistent "✦ MASTERY" button (top-right shell, all views) + a button in Architect's Core. Ability/stage clicks travel to the source realm.
  - **NEXUS:** speaks on panel open — "You are not collecting points. You are mapping understanding…" (`MASTERY_LINE`).
  - **Tested:** `next build` green (9 routes) + `npx tsc --noEmit` exit 0.
  - **Scope respected:** no XP numbers, no fake levels, no childish badges, no competitive ranking.
- ✅ **Phase 9.1 — Production Audit** (`PRODUCTION_AUDIT.md`): evidence-based findings (perf/a11y/mobile/code/SEO/security) tagged Critical/Important/Nice. No fixes.
- ✅ **Phase 9.2 — Production Fixes (Critical + Important)**, 4 slices, hardening only:
  - **Slice 1 `986e386`** (a11y + SEO): `lib/useModalA11y.ts` (Esc/focus-trap/restore, WCAG 2.1.2/2.4.3) on `KnowledgePanel` + `InventionDossier`; removed stale `public/sitemap.xml`+`robots.txt`; added `app/sitemap.ts`+`app/robots.ts`+`lib/site.ts` (SITE_URL → also `metadataBase`).
  - **Slice 2 `e8a8758`** (perf): `UniverseGate` lazy-loads all post-boot views via `next/dynamic` (three/R3F ~861KB now fetched only when the map mounts); NEXUS 3D only on `tier>=2 && !reduced` (CSS sigil otherwise — removes 2nd WebGL context on mid/low/reduced); decorative canvases `aria-hidden`.
  - **Slice 3 `a45d860`** (mobile + contrast): `--text-dim` → `#768499` (~5.3:1 AA); RealmIndex collapsed `<768px`; RealmInfoCard docks to top band `<640px`; travel hint clears NEXUS; 2D map nodes shrink `<480px`.
  - **Slice 4 `fe3b201`** (security): `npm audit fix` (no --force) 10→2 (all 4 high gone; 2 moderate need breaking Next downgrade, left); conservative security headers in `next.config.mjs` (no CSP).
  - All slices: `next build` green (11 routes incl. /sitemap.xml + /robots.txt) + `tsc --noEmit` exit 0.
- ✅ **`IMMERSION_PLAYTEST_REPORT.md`** (provided): full playtest verdict — vision 10/10, writing 8/10, execution 3/10. Root cause pinpointed: every realm's `atmosphere` (hero prose describing a living world) is displayed once and then abandoned; `RealmDistrict` renders only static text cards underneath it.
- ✅ **`EXPERIENCE_TRANSFORMATION_PLAN.md`**: the architecture response — a new `RealmSimulationEngine` layer, additive to (not replacing) the realm engine; one signature simulation per CS-process realm; `RealmShell` upgraded to lead with the simulation, demote cards to "details if you want them"; phased rollout 10.0→10.8; explicit stays-vs-replaced tables; no AI backend, no sound system, Knowledge/Invention/Observatory untouched.
- ✅ **Phase 10.2 — Enter the Machine Cinematic Transition** (`components/universe/journey/` + `lib/journey/cinematicCamera.ts`):
  - **Problem solved:** power button click went directly to boot terminal with no sense of "entering" the machine. First-time visitors needed the physical sensation of going inside.
  - `lib/journey/cinematicCamera.ts`: pure GSAP timeline factory — `buildDiveTimeline()` (3-act: contract 0.22s → surge 1.6s power3.in → white flash 0.28s) + `reducedMotionDive()` (instant cut, 60ms paint settle). No React.
  - `components/universe/journey/CinematicCamera.tsx` (+ `.module.css`): the cinematic bridge. Reuses `PowerCore` + `CircuitGrid` directly (both unmodified). Architect cue text: *"Ready? Let's go inside."* appears on mount. On power click: cue exits, CircuitGrid ignites, Canvas2D trace burst fires (20 PCB-style radial lines with leading-glow tips + 90° branches, amber/cyan color, tier-scaled: 20 full / 12 standard / 0 on tier-0), GSAP dive timeline runs, white flash fills screen, `onDone()` fires. Device-tier gated: tier-0/reduced-motion → instant cut via `reducedMotionDive`. Esc always works.
  - `components/universe/journey/BootTerminal.tsx` (+ `.module.css`): the post-cinematic boot shell. Composes `CircuitGrid(igniting=true)` + `SystemTerminal(FULL_BOOT)` + skip button. Arrives by fading FROM white (CSS `bootTerminalArrive` animation), creating a seamless visual bridge from the flash. `BootSequence.tsx` byte-for-byte untouched.
  - `JourneyDirector.tsx` updated: phase machine now `"avatar" → "cinematic" → "boot-terminal"` for first visits. Return visitors (`express=true`) still go straight to `BootSequence` (unchanged path).
  - **Tested:** `tsc --noEmit` exit 0 · `next build` green (11 routes, compiled in 19.0s cached, TypeScript in 12.9s, 11/11 static pages).
  - **Scope respected:** no realm changes, no Silicon Foundry simulation changes, no NEXUS rewrite, no store schema changes.
  - **Problem solved:** visitors entered the machine without meeting the person who built it. The experience jumped straight from void → terminal readout, with no human context for *why* they were there.
  - `lib/journey/avatarScript.ts`: typed `AvatarLine[]` data (6 lines + pauses, 4 kinds: `lead`/`mid`/`pivot`/`resolve`) — same `{ text, pause }` shape as `bootScript.ts`'s `BootStep`, so no new animation system needed.
  - `components/universe/journey/ArchitectAvatar.tsx` (+ `.module.css`): the Architect as a **guide**, not an About page. Pure CSS holographic silhouette (head orb + body trapezoid clip-path), digital scan-line sweep, corner holographic brackets — tier-0 safe, zero 3D/WebGL. GSAP typewriter identical to `SystemTerminal`'s proven pattern. Lines: *"I spent years using computers…" → "What actually happens after I press the power button?" → "Come with me. Let me show you the world behind the screen."* Esc + skip button always visible after first line; `aria-label` + `sr-only` summary for accessibility; reduced-motion: all lines appear instantly.
  - `components/universe/journey/JourneyDirector.tsx`: thin phase state-machine (`"avatar" → "boot"`). Replaces the direct `<BootSequence/>` render in `UniverseGate`'s "not entered" branch. `BootSequence`, `PowerCore`, `SystemTerminal`, `bootScript.ts`, `CircuitGrid` — all byte-for-byte unchanged. Return visitors (`express=true`) skip directly to boot. `completeBoot` owned by `UniverseGate.onComplete` (no double-call).
  - **`UniverseGate.tsx`**: one import swapped (`BootSequence` → `JourneyDirector`), one JSX element swapped — everything else untouched.
  - **Tested:** `tsc --noEmit` exit 0 · `next build` green (11 routes, compiled in 79s, TypeScript in 27.3s, 11/11 static pages).
  - **Scope respected:** no realm environments, no Silicon Foundry changes, no NEXUS rewrite, no store schema changes, no new 3D/WebGL.
  - **New shared runtime** `lib/simulations/`: `types.ts` (`SimStep`/`SimulationDefinition`), `engine.ts` (`startTickEngine` — tier-gated RAF loop reusing `particleBudget()`/`DeviceTier`, auto-pause on tab-hidden, manual pause/resume), `registry.ts` (`REALM_SIMULATIONS` lookup + `getSimulation(slug)` — currently **one entry: `silicon-foundry`**).
  - **New components** `components/universe/simulations/`: `RealmSimulationStage` (orchestrator — tier/reduced-motion detection, 5-step autoplay every 4.2s, narrates each step through the **real NEXUS companion** via `sayNexus`/`setNexusAnimState`, not a second voice), `SignalVisualizer` (Canvas2D — five real, named CS processes: PCB electron pulses → a live-evaluated AND/OR/NOT truth table → FETCH/DECODE/EXECUTE token relay across Memory/Control/ALU boxes → CPU↔RAM address/data round-trip → converged "RESULT" pulse), `SimulationControls` (step rail of 5 inspectable stages + step-back/forward + "▶ FOLLOW SIGNAL"/"⏸ PAUSE").
  - **Fallback contract:** on tier 0 or `prefers-reduced-motion`, `SignalVisualizer` draws one accurate **static** frame per step (no RAF, no autoplay) instead of a separate poster component — same primitives, same correctness, just still. Visitor can still manually step through all 5 stages.
  - **`RealmShell` upgrade:** new `hasSimulation = !!getSimulation(slug)`. When true (today: only Silicon Foundry), inserts `RealmSimulationStage` right after the header and collapses the existing district tabs' body behind a "▾ Explore the full archive — details, if you want them" toggle (Exit + tabs themselves stay always visible — they're chrome, not content). When false (the other 11 realms), renders **exactly as before** — zero visual/behavioral change.
  - **Tested:** `next build` green (11 routes, unchanged) + `npx tsc --noEmit` exit 0. Verified existing dev server still serves `/` (HTTP 200) after the change. *(Note: canvas animation itself was not visually eyeballed in a browser by the agent this round — build/type-check are the evidence; a manual look at `/` → enter Silicon Foundry is recommended before calling Phase 10.1 next.)*
  - **Scope respected:** no other realm touched, no content removed (district cards/topics/skill unlock all intact, just collapsed by default), no random decorative particles — every animation is a named, real CS process, no AI backend added to NEXUS.

---

## 4. ARCHITECTURE DECISIONS (log)
| # | Decision | Status |
|---|---|---|
| A1 | Universe in **App Router (`app/`)**; v1 in **Pages Router (`pages/legacy`)** — coexisting | ✅ Applied (build proves it) |
| A2 | **`tokens.css` (CSS custom properties)** = design source of truth; supersedes v1 neon tokens | ✅ Applied |
| A3 | **TypeScript** for all universe code; legacy stays JS (`allowJs`, `checkJs:false`) | ✅ Applied |
| A4 | **CSS Modules** for universe components; **Tailwind retained only in Legacy** (globals.css loaded solely by `pages/_app.js`) | ✅ Applied |
| A5 | **Wrap three with R3F + drei**; add **GSAP** + keep **Framer Motion** + CSS micro-interactions | ✅ Installed (used from Phase 1+) |
| A6 | **Zustand** (+persist) for state | ✅ Applied (skeleton) |
| A7 | **Legacy = route-based archive at `/legacy`** (NO iframe, no code duplication, no deletion) | ✅ Applied |
| A8 | Work on branch **`codex-infinitum`**; `main`/v1 untouched | ✅ Applied |
| A9 | `paths` alias `@/*` without `baseUrl` (TS 7 deprecation-safe) | ✅ Applied |

## 5. DESIGN DECISIONS (from canon — do not re-litigate)
- Dark void canvas; light = meaning; one realm = one color (doc 5).
- NEXUS = morphing polyhedron, **4 modes** (Architect/Cyber/Quest/Mentor) + **5 animation states** (Idle/Speaking/Thinking/Alert/Excited); realm-reactive color *bleeds* 1.2s. Not a chat widget; never invent new modes.
- Boot is sacred (~22s first visit, 6s express on return), skippable with narrative cost.
- Three device tiers (Full / Standard / Minimal-CSS2D); transform/opacity-only animation; full reduced-motion contract.
- Projects = Inventions, CLASS I–V, 9-part dossier; private projects use redaction-as-intrigue.

---

## 6. STACK DECISIONS — RESOLVED ✅
All three Phase-0 open questions confirmed by user: **TypeScript · App Router · CSS Modules + tokens.css**, and **legacy = route-based `/legacy` archive (avoid iframe; no duplication; no deletion)**. See A3/A4/A7.

---

## 7. PENDING TASKS (the phase roadmap)
- [x] **Phase 0 — Foundation/Scaffolding** ✅
- [x] **Phase 1 — Boot Sequence** ✅ (`components/universe/boot/` + `UniverseGate`)
- [x] **Phase 2 — Universe Map** ✅ (`components/universe/map/` — 3D + 2D fallback, 15 realms, travel-prep state)
- [x] **Phase 3 — NEXUS** ✅ (`components/universe/nexus/` — morphing polyhedron, 4 modes/5 states, scripted dialogue, realm color bleed; persistent on map)
  - _Deferred within NEXUS (later phases):_ scroll-velocity reactions (map doesn't scroll — wire in realms), the hidden `speak`/conversation system, Gemini upgrade.
- [x] **Phase 4 — First realm vertical slice: THE FOUNDATIONS** ✅ (reusable engine + travel + skill unlock)
- [x] **Phase 5 — Expand the realms** ✅ (12 realms now explorable; Legacy routes to `/legacy`)
  - _Deferred polish (later):_ per-realm challenge mini-games (doc 4 §14.2), bespoke per-realm arrival cinematics/3D interiors, realm-specific particle systems.
- [x] **Phase 6 — Invention Archive** ✅ (`components/universe/inventions/` — CLASS I–V dossiers, VisiRoD + CommentFellows + public works, realm cross-links)
- [x] **Phase 7 — Architect's Core & Observatory** ✅ (`components/universe/chambers/` — Creator Chamber + ending/transmission; both enterable from the map)
- [x] **Phase 8 — RPG Knowledge System** ✅ (`components/universe/knowledge/`)
- [x] **Phase 9.1 — Production Audit** ✅ (`PRODUCTION_AUDIT.md`)
- [x] **Phase 9.2 — Production Fixes (Critical + Important)** ✅ (4 slices: a11y/SEO, perf/code-split/WebGL, mobile/contrast, security)
- [x] **Phase 10.0 — Simulation Engine + Silicon Foundry** ✅ (`lib/simulations/` + `components/universe/simulations/`; `RealmShell` upgraded; only Silicon Foundry transformed)
- [x] **Phase 10.2 — Enter the Machine Cinematic** ✅ (`CinematicCamera`, `BootTerminal`, `lib/journey/cinematicCamera.ts`; `JourneyDirector` updated; build green 11 routes; commit `706a06f`)
- [x] **Phase 10.3 — Silicon Foundry Motherboard Environment** ✅ (R3F 3D motherboard city, arrival sequence, floating holographic panels/labels, Canvas2D fallback, build green 11 routes)
- [x] **Phase 10.3.5 — Immersion Quality Pass** ✅ (Upgraded Universe Map planet nodes, network connections, zoom transitions, holographic index, projected light beam dialog box, atmospheric motherboard fog)
- [x] **Phase 10.4 — Living Realm Engine:** Extract environment registry, cinematic director and generic object layers for future immersive realms. ✅
- [x] **Phase 10.5 — Network Pathways environment:** Build network pathways background, router landmarks, and HELO packet simulation visualizer. ✅
- [x] **Phase 10.6 — The Kernel environment:** Build kernel control room background, scheduler/memory manager landmarks, and process spawn thread simulation. ✅
- [x] **Phase 10.7 — Code Helix environment:** Build code forge, compiler AST visualization, algorithm arena, and runtime event loop simulation. ✅
- [x] **Phase 10.8 — Data Archives environment:** Build database vault, optimizer query planner, index towers, and ACID data fetch simulation. ✅
- [ ] **Phase 10.9 — Cyber Citadel environment:** Build authentication gates, threat scanner shields, encryption chambers, and intrusion defense simulation.
- [ ] **Release:** merge `codex-infinitum` → `main` + deploy (Vercel). **Awaiting approval — do not merge/deploy yet.**

---

## 8. PROBLEMS SOLVED (log)
- **Root route conflict** (app/page vs pages/index): resolved by relocating v1 to `pages/legacy/*`.
- **Relocated pages' relative imports broke** (`../data` → `pages/data`): rewrote to `@/` alias (location-independent).
- **TS: CSS side-effect imports lacked type declarations:** added `global.d.ts` (`declare module "*.css"` + `*.module.css`).
- **TS: `baseUrl` deprecated (fatal in installed TS):** removed `baseUrl`, kept `paths` (resolves relative to tsconfig).
- **React 19 + R3F compatibility:** used `@react-three/fiber@9` / `@react-three/drei@10` (React 19-compatible). Install clean.
- Note: `npm audit` reports 10 vulns in transitive deps — deferred to Phase 9 (not blocking; avoid `audit fix --force`).

---

## 9. ▶️ NEXT RECOMMENDED ACTION
**Network Pathways world is established.** Phase 10.5 delivered the R3F 3D backdrop scene (Packet POV pans), Canvas2D fallback vector map, and advanced packet visualizer (TCP/IP Elevator, DNS Recursive Discovery, TCP Handshake, Router Decision mesh, Firewall inspection sweeps, and Server reconstruction). Next recommended: **Phase 10.6** — The Kernel (operating system control room grid, process scheduler queue rings, MMU/virtual memory mapping layouts, and application context-switching process thread simulation).

> Everything is on branch `codex-infinitum`; `main` still holds working v1. Build green, tsc clean. Two-router setup intact (app/ universe + pages/legacy).

---
*Last updated: 2026-06-23 · End of Phase 10.5 (Network Pathways World; build green 11 routes, tsc clean). Branch: `codex-infinitum` (NOT merged/deployed). Protocol: plan → implement one feature → test → report → commit → STOP for approval.*
