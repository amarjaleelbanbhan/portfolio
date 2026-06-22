# 🎬 CINEMATIC_LAYER_PLAN.md
### CODEX INFINITUM — From "explains Computer Science" to "lets you feel it"

> **Planning document only. No code is written in this document or as part of producing it.**
> Standing constraint, restated per the user's correction: **nothing built so far is removed, rebuilt, or replaced.** Boot Sequence, Universe Map, Realm Engine, `realmContent.ts`, NEXUS, the Phase 10.0 Simulation Engine, the Knowledge Mastery system, the Invention Archive, Architect's Core, and the Observatory all stay exactly as they are today. This plan describes one more **additive layer on top** — a cinematic/presentation skin and a guide character, not a new foundation.
> Text is not deleted anywhere. It steps back to "deeper knowledge, if you want it" — the same demotion pattern Phase 10.0 already proved on Silicon Foundry's district cards.

---

## 0. WHAT THIS LAYER ACTUALLY ADDS

Today, a visitor reads `atmosphere` prose, then (in Silicon Foundry) watches a contained signal simulation, then optionally reads district cards. That is already correct in *kind* — Phase 10.0 proved "simulation primary, text secondary" works. What's still missing, per this brief:

1. **A "why am I here" frame, told by a person, not a system.** Nothing currently introduces the Architect as a character before the universe opens — the Architect only exists later, as a destination (`architect-core`), not a guide.
2. **A felt sense of *shrinking into the machine*** at boot — today's boot is a terminal readout (real and good), but it's read, not experienced spatially.
3. **Realms that are contained simulations inside a flat backdrop**, rather than the visitor standing *inside* an environment that the simulation is one feature of (giant CPU towers, electric rivers, a software-creation chamber, becoming a packet, etc.).
4. **A consistent "Iron-Man-hologram" visual language** for every information surface, instead of bordered text-card styling.
5. **NEXUS narrating the whole journey**, not just the one simulation it was wired into in Phase 10.0.

None of this requires touching how `RealmShell`, `RealmSimulationStage`, the store, or the registries work internally — it requires **wrapping and preceding** them.

---

## 1. NEW FOLDER — `components/universe/journey/`

Exactly the five components named, each with a precise, narrow job:

```
components/universe/journey/
  ArchitectAvatar.tsx (+ .module.css)
  JourneyDirector.tsx
  CinematicCamera.tsx (+ .module.css)
  StoryEvents.tsx
  HolographicInterface.tsx (+ .module.css)

lib/journey/
  avatarScript.ts      (the monologue — typed data, mirrors boot/bootScript.ts exactly)
  storyEvents.ts        (the beat registry — typed data, mirrors lib/simulations/registry.ts exactly)
  cinematicCamera.ts     (GSAP timeline helpers — pure functions, no React)
```

### 1.1 `ArchitectAvatar`
The Architect as a **guide**, not an "About" page. Appears once, before the power button, for first-time visitors only.

- **Content** (new scripted lines, distinct from `lib/creator.ts`'s "Architect's Core" bio — same origin question, different voice/purpose, per your explicit instruction that this is not "About me"):
  1. *"I used computers for years..."*
  2. *"...but one question changed everything: What actually happens when I press this button?"*
  3. *"Computer Science became my journey to find the answer."*
  4. *"Come with me. Let me show you."*
- **Data location:** `lib/journey/avatarScript.ts` — same `{ text, pause }` shape as `bootScript.ts`'s `BootStep`, so it can reuse the exact typewriter-reveal logic already proven in `SystemTerminal.tsx` (no new text-animation code needed, just the same renderer fed different data).
- **Visual:** a single still/breathing silhouette or line-art figure (CSS, tier-0 safe — no 3D model, no new asset pipeline), holographic-framed via `HolographicInterface` (§1.5), center stage, dark void background — reuses the existing `--void` token and `CircuitGrid` backdrop component as-is.
- **Exit:** on the final line, the avatar fades/steps aside and **the existing `PowerCore` button appears** — this is the literal "then enter the computer" handoff. `PowerCore.tsx` is untouched.
- **Gating (reuses existing state, no schema change):** shown only when `bootCompleted` is `false` (the same flag that already selects `FULL_BOOT` vs `EXPRESS_BOOT`). Returning visitors skip straight to the power button, exactly as they already skip to the express boot today.

### 1.2 `JourneyDirector`
The **state machine that sequences everything else** — it does not render visuals itself, it decides which phase is active and mounts the right child. This is the one new piece of orchestration the brief actually requires, because today `UniverseGate.tsx` only knows two phases ("not entered" → `BootSequence`; "entered" → map/realm). It needs a third, earlier phase, and later, a per-realm cinematic phase.

- **Phases:** `"avatar" → "boot" → "universe"` at the top level (first visit only; returning visitors enter directly at `"boot"` in express mode, identical to today). Inside a realm, it additionally tracks `"environment-establish" → "simulation"` (§2) for the realms that get an expanded environment.
- **Where it plugs in:** replaces the few lines in `UniverseGate.tsx` that currently render `<BootSequence ... />` directly in the "not entered" branch. `JourneyDirector` wraps `BootSequence` (unmodified) and conditionally renders `ArchitectAvatar` before it. Everything below — `UniverseMap`, `RealmShell`, `NexusCompanion`, `KnowledgeButton/Panel`, the `entered` branch's realm-slug routing — **is untouched**, because `JourneyDirector`'s job ends the moment the existing "entered" state takes over.
- **No new global store fields required.** It reads `bootCompleted` (existing) and owns its own local phase state, the same pattern `UniverseGate` already uses for `entered`/`mounted`.

### 1.3 `CinematicCamera`
A reusable "camera-feel" utility — **not a real 3D camera**, deliberately, to preserve Phase 9.2's device-tier/perf work and Phase 10.0's choice of Canvas2D over WebGL for the simulation layer. It's a GSAP-timeline-driven transform wrapper (`scale`/`translateZ`-style 2D transforms on a container), reusing the `gsap` dependency already installed and already used in `SystemTerminal.tsx`.

- **Two jobs only:**
  1. The boot "shrink into the machine" push-in (§3) — a single timeline that scales/dollies the boot stage forward through the power-click → circuit → CPU → universe-open sequence.
  2. A realm-entry "establishing push" for realms with an expanded environment (§4) — one short push-in from a wide establishing view to the existing simulation framing, then it hands off and gets out of the way; it never drives ongoing realm interaction.
- **Fallback contract (same rule as everywhere else in this codebase):** on tier 0 or `prefers-reduced-motion`, the timeline is skipped entirely and the camera snaps straight to its end-state — a hard cut, never a half-finished animation, never blank. This mirrors the existing `reduced` prop pattern already threaded through `BootSequence`/`PowerCore`/`RealmSimulationStage`.

### 1.4 `StoryEvents`
The **data-vs-player split**, mirroring exactly how Phase 10.0 separated `lib/simulations/registry.ts` (data) from `RealmSimulationStage.tsx` (player). `StoryEvents.tsx` is a thin renderless component that `JourneyDirector` and `RealmShell` consume; the actual script lives in `lib/journey/storyEvents.ts`.

- **Shape:** `StoryEvent { phase: JourneyPhase | realmSlug; nexusLine?: string; cameraCue?: CameraCueId; avatarLine?: string }` — a registry keyed the same way `REALM_SIMULATIONS` already is.
- **Purpose:** one place that answers "what does NEXUS say, where does the camera push, what does the avatar say" for any given moment, instead of scattering that logic across components. This is what lets the NEXUS upgrade (§6) and the camera (§1.3) stay decoupled from the realm/boot components they affect.

### 1.5 `HolographicInterface`
The **visual skin**, not a new data or logic layer. A presentational wrapper + matching `.module.css` (glass blur, thin scan-line sweep, corner brackets, `color-mix(in srgb, var(--realm-primary) ..%, transparent)` tinting — all built from tokens already in `tokens.css`, no new design tokens needed) that existing panels opt into by wrapping their children, e.g.:

```tsx
<HolographicInterface>
  <RealmSimulationStage slug={slug} />
</HolographicInterface>
```

- It changes **how a panel looks**, never what it does. `RealmSimulationStage`, `KnowledgeArchive`, `RealmDistrict`'s topic cards, and `SimulationControls` keep every line of their existing logic; they're just rendered inside this wrapper instead of (or in addition to) their current bordered-card CSS. This directly satisfies "current information panels become holographic analysis panels" without touching the panels' internals.
- Reduced-motion contract: the scan-line sweep is a CSS animation, disabled the same way every other decorative animation in `realm.module.css` already is (`@media (prefers-reduced-motion: reduce)`), leaving the glass/border styling (which is static) intact.

---

## 2. NEW FOLDER (proposed, not explicitly named in the brief — flagging for your review) — `components/universe/environments/`

The brief's five environment write-ups (Silicon Foundry expansion, Code Helix, Network Pathways, Neural Nebula, Cyber Fortress) are backdrops a visitor stands inside, layered **behind** the existing/future simulation — they are a different kind of thing than `journey/`'s sequencing-and-chrome components, and a different kind of thing than `lib/simulations/`'s foreground process diagrams. Rather than overload either folder, I'm proposing a third, sibling registry that follows the **exact same pattern** Phase 10.0 already established for simulations — same gating mechanism, same fallback contract, same registry-driven lookup — so reviewing it should feel familiar:

```
lib/environments/
  types.ts            EnvironmentDefinition { realmSlug, layers, posterFrame }
  registry.ts          REALM_ENVIRONMENTS + getEnvironment(slug) — currently empty until Phase 10.4+

components/universe/environments/
  RealmEnvironmentStage.tsx (+ .module.css)   the mount point — sits behind RealmSimulationStage
                                               the same way `.bgGrid`/`.flash` already sit behind `.content`
                                               in realm.module.css; renders null if no environment is
                                               registered for the realm (identical pattern to
                                               RealmShell's `hasSimulation` check today)
  MotherboardEnvironment.tsx     Silicon Foundry — expansion, see §4
  CodeChamberEnvironment.tsx     Code Helix
  PacketJourneyEnvironment.tsx   Network Pathways
  NeuralBrainEnvironment.tsx     Neural Nebula
  CyberBattlefieldEnvironment.tsx The Citadel (the brief's "Cyber Fortress" — same realm, no new slug)
```

`RealmShell` gains one more optional, conditionally-rendered line, the same shape as Phase 10.0's `{hasSimulation && <RealmSimulationStage slug={slug} />}` insertion — `{hasEnvironment && <RealmEnvironmentStage slug={slug} />}`, mounted *before* it, full-bleed behind the content column. No other line in `RealmShell` changes.

---

## 3. BOOT UPGRADE — "shrink into the machine," reusing what already exists

Keep `BootSequence.tsx`, `PowerCore.tsx`, `bootScript.ts`, `CircuitGrid.tsx`, and `SystemTerminal.tsx` exactly as they are. The brief's 8-beat sequence (power click → electricity → motherboard lights → circuits → CPU wakes → memory initializes → kernel starts → universe opens) is **not new visual content to invent** — it is almost exactly the five steps Phase 10.0 already built and proved for Silicon Foundry:

| Brief's boot beat | Already-built source to reuse |
|---|---|
| Electricity travels | `SignalVisualizer`'s `drawElectricity` |
| Circuits activate | `SignalVisualizer`'s `drawLogic` |
| CPU wakes | `SignalVisualizer`'s `drawCpu` (FETCH/DECODE/EXECUTE) |
| Memory initializes | `SignalVisualizer`'s `drawMemory` |
| Kernel starts / universe opens | `SignalVisualizer`'s `drawResult`, then `CinematicCamera`'s push-out into the existing `CircuitGrid` → `UniverseMap` handoff |

**Plan, not code:** `BootSequence` adds one new optional visual layer — a condensed, non-interactive cycle through those same five `SignalVisualizer` draw functions, rendered *behind* the existing terminal text (which is already proven, scripted, and timed) instead of beside or replacing it. `CinematicCamera` drives a single scale/push timeline across the whole boot so the *transition* from power-click to terminal to universe-open reads as one continuous "falling into the machine" move instead of three separate screens. `SystemTerminal`'s lines, `bootScript.ts`'s content, and its GSAP timeline logic are not edited — only what's visible behind it changes.

---

## 4. REALM ENVIRONMENT EXPANSIONS

| Realm (existing slug) | Brief's name | What's added | What's reused, untouched |
|---|---|---|---|
| `silicon-foundry` | Silicon Foundry | `MotherboardEnvironment` — wide backdrop: motherboard plane, a few "CPU tower" landmarks, animated trace "rivers", memory block silhouettes in the distance, all Canvas2D, all tier-gated | Phase 10.0's entire `RealmSimulationStage`/`SignalVisualizer`/`SimulationControls` — explicitly **expanded, not replaced**, per your instruction; it becomes the foreground detail view inside this new backdrop |
| `code-helix` | Code Helix | `CodeChamberEnvironment` — a "software creation chamber": a floating idea-spark → text forming into code → a compiler-shape transforming it → a stream of machine instructions flowing into an execution point. Real pipeline (idea → source → compiled form → execution), not abstract particles | `realmContent.ts`'s Code Helix `atmosphere`/districts (already describe this — promoted from text to art-direction spec, the same move Phase 10.0's source plan made for Silicon Foundry) |
| `network-pathways` | Network Pathways | `PacketJourneyEnvironment` — visitor's viewpoint becomes a packet: Computer → Router (hop) → Internet (backbone lines) → Server → Response returns, an actual sequenced multi-hop traversal, camera-led by `CinematicCamera` | existing `network-pathways` realm content/colors |
| `neural-nebula` | Neural Nebula | `NeuralBrainEnvironment` — inside-the-network view: data points flowing in, layered connections lighting in sequence, a visible training/loss signal, output as a prediction | existing `neural-nebula` realm content/colors |
| `the-citadel` | Cyber Fortress | `CyberBattlefieldEnvironment` — attack particles approaching a wall, a detection flash, an encryption transform (visibly scrambling/unscrambling a value), a defense hold. No realm rename — this is `the-citadel`'s environment, the brief's name is flavor for the same place | existing `the-citadel` realm content/colors, `nexusMode: "CYBER"` |

Every one of these is a **backdrop behind** that realm's existing `RealmHeader` → (future simulation) → district-cards flow, exactly as `silicon-foundry`'s motherboard plane sits behind its already-built foreground simulation. None of `realmContent.ts`'s data, none of `RealmDistrict`'s logic, none of `KnowledgeArchive`'s gating changes.

---

## 5. ANIMATION STRATEGY

Same non-negotiable rule as Phase 10.0, extended to every new surface: **every animation represents a real, nameable CS process or a real camera/staging move — never decorative-only particles.**

- **Renderer choice stays Canvas2D**, consistent with the Phase 10.0 decision to avoid a second WebGL context — environments are backdrops, not new 3D scenes, so they stay cheap on the same device-tier ladder (`lib/deviceTier.ts`'s `quickDeviceTier()`/`particleBudget()`/`prefersReducedMotion()` — reused as-is, no new tier logic).
- **Camera moves use GSAP** (already a dependency, already used in `SystemTerminal.tsx`) — no new animation library.
- **Tier/reduced-motion fallback contract, applied uniformly:**
  - Tier 0 or reduced-motion → environments render one static establishing frame (their `posterFrame`, same concept as `lib/simulations/types.ts`'s existing fallback shape); `CinematicCamera` snaps instead of animating; `ArchitectAvatar`'s lines appear instantly instead of typed.
  - Tier 1 → full visuals, frame-skipped (reuses `engine.ts`'s existing `FRAME_SKIP` table).
  - Tier 2 → full fidelity.
  - **Never blank** — the same rule already honored everywhere in this codebase.
- **NEXUS narration reuses the proven Phase 10.0 mechanism** (`sayNexus`/`setNexusAnimState` store actions called from a component, dwell-timed) rather than inventing a second caption system — `StoryEvents` just gives it more lines to say, in more places.

---

## 6. NEXUS UPGRADE

No new component, no new store field, no AI/Gemini backend (standing Phase 3 rule, unchanged). The upgrade is **content + reach**, using the exact pattern Phase 10.0 proved on Silicon Foundry's simulation:

- `lib/nexusDialogue.ts` gains more JARVIS-toned lines (e.g. *"Watch this signal enter the processor. This is where a thought becomes an action"*), sourced from `StoryEvents`' `nexusLine` field for boot beats and environment beats, the same way `RealmSimulationStage` already calls `sayNexus(step.nexusLine)` per simulation step.
- `NexusCompanion.tsx`'s existing `speak()`/`armIdle()`/dwell-timer plumbing is reused unmodified — it already accepts any line from any caller.

---

## 7. WHAT STAYS — EXPLICIT LIST

- `components/universe/boot/{BootSequence,PowerCore,SystemTerminal,CircuitGrid}.tsx` + `bootScript.ts` — logic and timing unmodified; only what renders behind them changes.
- `components/universe/realms/{RealmShell,RealmHeader,RealmNavigation,RealmDistrict,KnowledgeArchive,SkillUnlock}.tsx`, `realmContent.ts` — `RealmShell` gains one more conditional line (`hasEnvironment`), mirroring its existing `hasSimulation` line; nothing else changes.
- `lib/simulations/*`, `components/universe/simulations/*` — Phase 10.0's engine and Silicon Foundry simulation; **expanded with a backdrop, never replaced**, per your explicit instruction.
- `components/universe/nexus/*`, `lib/nexusDialogue.ts` — model and mechanism unchanged; only line content grows.
- `store/universeStore.ts` — no schema changes anticipated; `JourneyDirector` and `ArchitectAvatar` reuse the existing `bootCompleted` flag for first-visit gating.
- Knowledge Mastery system, Invention Archive, Architect's Core, Observatory — untouched; not mentioned anywhere in the brief as needing this layer.
- `main` branch — untouched; everything above is additive work on `codex-infinitum`. No merge, no deploy.

---

## 8. IMPLEMENTATION PHASES (each a future, separate, approved slice — plan only, none started)

Numbered to continue the roadmap after Phase 10.0.

| Phase | Scope | Why this order |
|---|---|---|
| **10.1** | `lib/journey/avatarScript.ts` + `ArchitectAvatar` + `JourneyDirector`, wired into `UniverseGate`'s "not entered" branch. First-visit-only intro, gated on existing `bootCompleted`. | The narrative frame has to exist before anything it introduces is upgraded; lowest-risk slice (one new phase in one existing gate, reuses the proven typewriter renderer). |
| **10.2** | `lib/journey/cinematicCamera.ts` + `CinematicCamera`, applied to the boot sequence only (the "shrink into the machine" push), reusing `SignalVisualizer`'s draw functions per §3. | Proves the camera utility on the one place its visual material already exists, before it's asked to drive realm environments it doesn't have material for yet. |
| **10.3** | `HolographicInterface` + `.module.css`, applied first to Silicon Foundry's existing `RealmSimulationStage` + `SimulationControls` (the proof realm again, consistent with Phase 10.0's "prove it on one realm first" pattern). | Validates the visual-skin wrapper on the realm everyone will compare it against, with zero logic risk (pure CSS/markup wrap). |
| **10.4** | `lib/environments/{types,registry}.ts` + `RealmEnvironmentStage` (plumbing only, registry empty) + `MotherboardEnvironment` (Silicon Foundry). | Mirrors Phase 10.0's own first slice exactly: build the empty pipe, then prove it once on the realm that already has every other layer (sim + hologram skin) finished. |
| **10.5** | `lib/journey/storyEvents.ts` + `StoryEvents`, wired so Silicon Foundry's environment + simulation + NEXUS all read from one beat script instead of separate ad hoc calls; extend NEXUS lines per §6 for this realm only. | Completes the full stack — avatar → boot → environment → simulation → hologram skin → NEXUS — on one realm before fanning out, so any seam shows up while the surface area is still small. |
| **10.6** | `CodeChamberEnvironment` (Code Helix) + `HolographicInterface` applied to its panels. | Second realm, different visual grammar (flow/transform vs. circuit), validates the pattern generalizes. |
| **10.7** | `PacketJourneyEnvironment` (Network Pathways) + `NeuralBrainEnvironment` (Neural Nebula) + hologram skin for both. | Batched — both are "travel/flow through a system" visual grammar; efficient to author together. |
| **10.8** | `CyberBattlefieldEnvironment` (The Citadel) + hologram skin. | Closes the five named environments. |
| **10.9** *(optional)* | Apply `HolographicInterface` to the remaining realms' `RealmDistrict`/`KnowledgeArchive` cards (no environment, just the visual skin) for a consistent universe-wide feel. | Cosmetic completeness pass — lowest priority, purely additive CSS. |

Each phase follows the existing, unchanged protocol: plan → implement only that slice → `next build` + `npx tsc --noEmit` → report (files/what/what's left) → commit with a specific message → **stop for approval**.

---

## 9. EXPLICITLY NOT IN THIS PLAN

- No AI/Gemini chat backend for NEXUS (standing constraint, unchanged).
- No new 3D/WebGL contexts — environments and the camera stay Canvas2D/CSS/GSAP, consistent with Phase 9.2's perf work and Phase 10.0's explicit choice.
- No sound design.
- No changes to Knowledge Mastery, Invention Archive data, Architect's Core, or Observatory content.
- No merge to `main`, no deploy.

## 10. ONE OPEN FLAG FOR YOUR REVIEW

The brief named the five `journey/` components explicitly but didn't name a home for the five realm **environments** themselves (§2) — I've proposed `components/universe/environments/` + `lib/environments/` as a sibling to the existing `simulations/` pair, following its exact pattern, rather than folding environments into `journey/` (which is about sequencing/guiding, not about a specific realm's backdrop) or into `simulations/` (which is about foreground process diagrams, already proven and not to be disturbed). Flagging this now so you can redirect before any folder gets created.

---
*This is a planning document only. Awaiting approval to begin Phase 10.1.*
