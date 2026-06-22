# 🧬 EXPERIENCE_TRANSFORMATION_PLAN.md
### CODEX INFINITUM — From "a book about a universe" to "the universe itself"

> Source of truth for this plan: `IMMERSION_PLAYTEST_REPORT.md` (overall immersion 3.8/10 — "the atmospheric descriptions are the world. The UI is a brochure about the world.")
> This is a **plan only**. No code is written in this document or as part of producing it.
> Standing constraint from the user: **we are NOT rebuilding.** Boot, the universe engine, the realm architecture, NEXUS, the data models, the Knowledge system, and the Invention Archive are kept. This plan describes an **added layer**, not a replacement project.

---

## 0. DIAGNOSIS (in architecture terms, not vibes)

The report's pattern across all 9 realm reviews is identical: `atmosphere` (the evocative hero prose, e.g. *"molten silicon, holographic schematics, a continent-sized motherboard"*) is a **string that is displayed once and then abandoned**. Everything after it — `RealmDistrict` — renders `district.topics` as static `<li>` text cards. The world described in `atmosphere` is never rendered. It exists only as copy.

This is a precise, fixable gap: `RealmContent` has a field (`atmosphere`) that was written as an **art-direction brief** but is consumed as **decoration**. The fix is to give every realm a real, living, on-screen subject that `atmosphere` actually specifies — and to make the existing topic cards *control* that subject instead of being the content themselves.

---

## 1. NEW ARCHITECTURE LAYER — `RealmSimulationEngine`

A new, small, shared runtime sits between the realm data model and the realm UI. It does **not** replace `RealmShell`'s structure — it adds one new always-mounted layer to it.

```
lib/simulations/
  engine.ts        shared tick-loop: requestAnimationFrame wrapper, tier-based
                   frame/particle budget (reuses lib/deviceTier.ts particleBudget()),
                   pause-on-tab-hidden, pause on prefers-reduced-motion, cleanup.
                   Every simulation component calls this instead of writing its
                   own RAF plumbing — one engine, many simulations.
  types.ts         SimulationDefinition: { id, realmSlug, kind: "canvas2d" | "r3f" | "dom",
                   minTierForMotion: DeviceTier, posterFrame: () => ReactNode (the static
                   tier-0 / reduced-motion substitute — never blank), topicHooks:
                   Record<topicName, SimState> }
  registry.ts      REALM_SIMULATIONS: Record<realmSlug, SimulationDefinition> — the
                   lookup RealmShell uses, mirroring how realmContent.ts's
                   REALM_CONTENT registry already works.

components/universe/simulations/
  RealmSimulationStage.tsx       mounts the correct simulation for the current
                                 realm + drives it from the active topic; owns the
                                 tier/reduced-motion fallback to posterFrame().
  RealmSimulationStage.module.css   full-bleed stage, sits behind .content (same
                                     layer convention as the existing .flash/.bgGrid
                                     decorative divs already in realm.module.css).
  <PerRealmSim>.tsx               one file per realm's signature simulation (catalog
                                  in §3).
```

**Why this shape, not something bigger:** it reuses three things that already exist and already work — the device-tier system (`lib/deviceTier.ts`), the `dynamic(ssr:false)` code-splitting convention established in Phase 9.2's `UniverseGate`, and the registry pattern already proven by `realmContent.ts`. No new state-management system, no new global store fields beyond perhaps one (`activeTopic`, optional). This is additive plumbing, not a parallel architecture.

**Design rule for every simulation (non-negotiable, per the brief):** each one must depict a **real CS process** via actual logic — a real truth-table evaluator, a real round-robin scheduler tick, a real traceroute hop sequence, a real tiny forward-pass — not particle decoration with a CS-themed paint job. "Visual beauty + correctness," exactly as instructed.

---

## 2. HOW TO UPGRADE `RealmShell`

Current `RealmShell` (read at `components/universe/realms/RealmShell.tsx`) renders, in order: decorative `.flash`/`.bgGrid` → `RealmHeader` → `RealmNavigation` → (`RealmDistrict` | `KnowledgeArchive`) → `SkillUnlock` toast.

**Upgrade (insertion, not rewrite):**
1. Insert `<RealmSimulationStage slug={slug} districtId={activeDistrict.id} activeTopic={activeTopic} />` directly after the existing `.bgGrid` div and before `.content` — it becomes the new always-on backdrop, replacing flat `--void` with the realm's living system.
2. `RealmShell` gains one small piece of local state, `activeTopic: string | null`, lifted up from `RealmDistrict` (today `RealmDistrict` has no interactivity at all — it just maps and renders). Hovering/clicking a topic card sets `activeTopic`, which `RealmSimulationStage` reads to switch the simulation's highlighted state (e.g. selecting "Boolean Logic" makes the Silicon Foundry circuit board light up its logic-gate cluster).
3. `data-realm` theming, the arrival flash, and `KnowledgeArchive`'s gating logic are untouched — the simulation stage is realm-aware the same way the CSS theme already is (via `[data-realm]`), so the gated Deep Archive can apply its own visual treatment (see §implementation 10.6) without new plumbing.

This keeps `RealmShell` the single per-realm orchestrator it already is — it just now orchestrates one more layer.

---

## 3. SIMULATION REQUIRED FOR EVERY REALM

One signature simulation per explorable/connective realm, each implementing a real small algorithm or state machine, each with a tier-0/reduced-motion poster fallback (so the realm is never blank — satisfies the "understand without reading English" requirement) and a hover/click hook into its district's topics:

| Realm | Simulation | Real CS process shown | Topic hooks |
|---|---|---|---|
| The Foundations | `TuringTapeSim` | A Turing machine head stepping along a tape; a live truth-table evaluator | Logic → truth table, Turing Machines → tape run, Halting Problem → a deliberately non-halting tape with a visible "still running…" tell |
| Silicon Foundry | `CircuitBoardSim` | PCB trace map with traveling electron pulses; togglable AND/OR/NOT gates | Electricity & Logic → gate toggle, From Sand to Silicon → wafer→transistor→chip cross-section |
| The Kernel | `ProcessSchedulerSim` | Round-robin/priority scheduler: colored bars competing for a CPU time-slice; concentric privilege rings | The Scheduler → live tick, The Privilege Ring → ring-0/ring-3 highlight |
| Network Pathways | `PacketRouteSim` | Topology graph; DNS lookup → TCP handshake → packet hops animated in sequence; dropped-packet sparks | The Signal Road → packet travel, Protocol Stack → animated layer hand-off |
| Code Helix | `SyntaxTreeSim` | A tiny live code snippet that visibly parses into a growing AST/structure above it | The Grammar Spire → parse-as-you-type, Structures Quarter → AST growth |
| Neural Nebula | `NeuralActivationSim` | A small layered network: forward pass lighting activations, a loss value ticking down over visible "epochs" | The Inference Field → forward pass, Training Laboratory → loss curve falling |
| Data Archives | `QueryCrystalSim` | Pick a canned query → rows crystallize into a chart in front of you | The Query Hall → query→chart, Insight Dome → chart re-forms on selection |
| The Citadel | `FirewallSim` | Inbound particles classified allow/deny at a wall in real time; type text → watch it encrypt character-by-character | The Outer Wall → live block/allow, War Room → encrypt-as-you-type |
| Cloud Expanse | `WeatherComputeSim` | Load-as-weather: instances spawn as cloud cells under load, lightning = request spikes, calms under scale-out | The Weather Systems → scale event, Open Sky → instance count live |
| Soul Quarter | `GenerativeFieldSim` | A pointer-reactive generative particle/flow field with a shifting palette — **deliberately the only realm that looks unlike all the others** (report #7) | The Playground → direct pointer interaction, Design Studio → palette/contrast control |
| Founders' Constellation, The Observatory, Architect's Core, Invention Archive, Legacy Archive | *(out of scope for this pass — see §7, these are structural/identity rooms, not CS-process rooms; report scored them 5–6/10, not 2–3/10)* | — | — |

`atmosphere` in `realmContent.ts` is **promoted from flavor text to the art-direction spec** for that realm's simulation — the string already correctly describes what each sim should look like; it just needs to stop being abandoned after the hero render.

---

## 4. COMPONENT ARCHITECTURE (full picture)

```
components/universe/realms/
  RealmShell.tsx            (upgraded — mounts RealmSimulationStage, lifts activeTopic)
  RealmDistrict.tsx         (upgraded — topics become hoverable/clickable controls,
                             not inert cards; emits onFocusTopic(name))
  RealmNavigation.tsx       (unchanged)
  RealmHeader.tsx           (unchanged)
  KnowledgeArchive.tsx      (unchanged logic; gated archive gets its own sim "tension"
                             treatment per realm — redaction/glitch via the same
                             posterFrame mechanism, not a new gate system)
  SkillUnlock.tsx           (unchanged)
  realmContent.ts           (additive only — DistrictTopic gains optional simKey?: string;
                             atmosphere's role is now documented as the sim brief)

lib/simulations/
  engine.ts · types.ts · registry.ts     (new shared runtime, §1)

components/universe/simulations/
  RealmSimulationStage.tsx (+ .module.css)      (new orchestrator, §1)
  CircuitBoardSim.tsx · TuringTapeSim.tsx · ProcessSchedulerSim.tsx ·
  PacketRouteSim.tsx · SyntaxTreeSim.tsx · NeuralActivationSim.tsx ·
  QueryCrystalSim.tsx · FirewallSim.tsx · WeatherComputeSim.tsx ·
  GenerativeFieldSim.tsx                        (10 new realm-specific files, §3)

components/universe/nexus/
  NexusDialogue.tsx          (upgraded — typewriter reveal, reusing the proven
                              GSAP-typed-text pattern already shipped in
                              components/universe/boot/SystemTerminal.tsx)
  NexusCompanion.tsx         (upgraded — permanent idle-breathing CSS state on the
                              button; existing armIdle()/idleTimer pattern extended
                              with realm-dwell-aware variants, not replaced)
  NexusCompanion.module.css  (additive breathing keyframe)
  lib/nexusDialogue.ts       (additive — a "hold to hear more" lore-cycle list per
                              mode, NOT a chat backend — the standing "no AI/Gemini
                              backend" rule from Phase 3 is preserved)

components/universe/map/
  UniverseCanvas.tsx         (upgraded — pointer-driven parallax offset on the
                              camera/group; no new 3D system)
  EnergyConnections.tsx      (upgraded — a traveling light-pulse sprite per edge,
                              using the existing edgeSegment() math from realmLayout.ts)
  RealmNode.tsx              (upgraded — size driven by a new optional `weight`
                              field on lib/realms.ts's Realm interface)
  UniverseGate.tsx           (upgraded — the instant currentRealm swap becomes a
                              brief "hyperspace" zoom transition before mounting
                              RealmShell; still the same dynamic()-split components)

components/universe/boot/
  SystemTerminal.tsx / .module.css   (upgraded layout only — multi-position text
                                      across the full viewport instead of top-left;
                                      bootScript.ts content and GSAP timeline logic
                                      are unchanged)
```

---

## 5. IMPLEMENTATION PHASES (each a future, separate, approved slice — plan only, not started)

Numbered to continue the existing roadmap (last completed: Phase 9.2).

| Phase | Scope | Why this order |
|---|---|---|
| **10.0** | Build `lib/simulations/` (engine/types/registry) + `RealmSimulationStage` shell, wire into `RealmShell` rendering an empty/placeholder stage. Add `simKey?` to `DistrictTopic`. Zero visual change to any realm yet — pure plumbing. | Prove the tier-gating/reduced-motion/pause-on-hidden contract once, correctly, before any individual simulation is authored on top of it. |
| **10.1** | Author `TuringTapeSim` (The Foundations) + `CircuitBoardSim` (Silicon Foundry). | Canon's own "first realm" + the most concrete, deterministic logic — lowest risk way to validate the pattern end-to-end. |
| **10.2** | Author `ProcessSchedulerSim` (The Kernel) + `PacketRouteSim` (Network Pathways) + `WeatherComputeSim` (Cloud Expanse). | Shared "nodes + flow" visual grammar — batch them. |
| **10.3** | Author `SyntaxTreeSim` (Code Helix) + `NeuralActivationSim` (Neural Nebula). | Closes the report's single widest gap — NEXUS's Neural Nebula line describes exactly this and nothing currently shows it. |
| **10.4** | Author `QueryCrystalSim` (Data Archives) + `FirewallSim` (The Citadel) + `GenerativeFieldSim` (Soul Quarter). | Completes all 9 process realms; Soul Quarter deliberately last since it must look unlike the eight that came before it. |
| **10.5** | Universe Map aliveness: pointer parallax, traveling edge pulses, node weight-sizing, hyperspace enter transition. | Independent of realm sims; sequenced after so each slice stays reviewable alone. |
| **10.6** | NEXUS presence pass: idle-breathing button, typewriter dialogue, dwell-based unprompted lines, hold-to-expand lore cycling, Deep Archive 🔒 vault tension treatment. | Ties the companion and the "locked vault" mystery together once the realms it comments on already feel alive. |
| **10.7** *(optional)* | Invention Archive 3D hover/redaction polish; boot sequence full-viewport layout. | Report already scored these 5–6/10 — lowest-priority gap. |
| **10.8** *(optional)* | Closing-moment constellation recap on Observatory exit. | Narrative nice-to-have, not a comprehension gap. |

Each phase follows the existing protocol unchanged: plan → implement only that slice → `next build` + `npx tsc --noEmit` → report (files/what/what's left) → commit with a specific message → **stop for approval**.

---

## 6. WHAT EXISTING CODE STAYS (unchanged in architecture)

- **Boot system** — `components/universe/boot/*`, `bootScript.ts`, the GSAP timeline. (10.7 touches layout CSS only, optionally, later.)
- **Universe engine** — `UniverseCanvas`, `RealmNode`, `RealmOrbit`, `StarField`, `EnergyConnections`, `realmLayout.ts`, `UniverseMap2D`. (10.5 adds behavior on top, doesn't rewrite.)
- **Realm architecture** — `RealmShell`, `RealmHeader`, `RealmNavigation`, `realm.module.css`, and the `RealmContent`/`District`/`DistrictTopic` data model in `realmContent.ts`. Only additive fields + one new child component.
- **NEXUS** — `NexusCore3D`, `NexusCoreFallback`, the mode/anim-state model, `lib/nexusDialogue.ts`'s scripted-line approach, the existing idle-timer pattern in `NexusCompanion.tsx`. **No AI/Gemini backend is introduced** — the standing Phase 3 constraint holds.
- **Data models** — `lib/realms.ts`, `lib/creator.ts`, `inventionData.ts`, `knowledgeData.ts`, `store/universeStore.ts`. At most one or two optional UI-state fields added later (e.g. `activeTopic`); no schema rewrite.
- **Knowledge Mastery system** — `components/universe/knowledge/*` is untouched by this plan. It is explicitly protected ("not gamification") and the report did not flag it as a process-comprehension gap.
- **Invention Archive** — stays; only optional polish in 10.7.

## 7. WHAT NEEDS REPLACEMENT

- **`RealmDistrict.tsx`'s render contract** — today: a flat, inert `<li>` text grid. This is replaced with an interactive, captioned control surface that drives `RealmSimulationStage`. The data it reads (`District`/`DistrictTopic`) is unchanged; only what it renders and the fact that it now emits events is new.
- **The "one CSS template fits all 12 realms" assumption** — `realm.module.css` currently differentiates realms only via `[data-realm]` color tokens. The simulation stage is what actually gives each realm a distinct visual identity (PCB vs. neurons vs. weather vs. generative field) — this assumption, not the stylesheet itself, is what's being retired.
- **`SystemTerminal.tsx`'s top-left-confined layout** — content and GSAP logic stay; the positioning rules are replaced to use the full viewport (per report §1/§5).
- **`NexusDialogue.tsx`'s instant-text-appears rendering** — replaced with a typed-reveal renderer reusing the existing proven typewriter approach from boot; the mode/state/store model underneath is unchanged.

---

## 8. EXPLICITLY NOT IN THIS PLAN

- No AI/Gemini chat backend for NEXUS (standing constraint).
- No sound design system (report flags it as MEDIUM/optional; would need its own consent-first audio architecture and is independent of the simulation engine — a candidate for a later, separately-approved phase if wanted).
- No changes to the Knowledge Mastery / RPG system, the Invention Archive's data, or the Founders' Constellation / Architect's Core / Observatory content.
- No merge to `main`, no deploy. Everything above is additive work on `codex-infinitum`.

---
*This is a planning document only. Awaiting approval to begin Phase 10.0.*
