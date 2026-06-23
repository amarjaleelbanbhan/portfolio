# MASTER_FIX_PLAN.md — Codex Infinitum Polish Pass

Sourced from: EXPERIENCE_ISSUES.md, UI_FIX_REPORT.md, 3D_SCENE_AUDIT.md, ANIMATION_REPORT.md, ARCHITECTURE_REPORT.md.
Scope for this round: fix P0/P1 (broken/ugly), apply select low-risk P2s opportunistically, leave the rest documented for a future pass. No new realms/systems/features.

## P0 — Broken experience
*(none found — the app boots, navigates, and builds; nothing is fully non-functional)*

## P1 — Must fix this pass
1. Power-on screen contrast too low (near-invisible on screenshot) — `PowerCore` label/cue styling.
2. Power-on screen not vertically centered on mobile (375x812) — large dead space below content.
3. `RealmShell.tsx:149` hardcoded `paddingBottom: "180px"` during journey — not responsive.
4. ~~`RealmShell.tsx:152-156` `FloatingHUDPanel` + `RealmSimulationStage` overlap~~ — **verified not a bug.** `FloatingHUDPanel` returns `null` unless a 3D landmark is actively selected (`activeLandmarkId`); it's an on-demand landmark detail popup, not a second always-on simulation HUD. No fix applied.
5. `NexusCompanion` has no journey-aware offset — risk of mobile overlap with `MasterJourneyHUD`.
6. `ArchitectAvatar.tsx` exit `setTimeout` not guarded against unmount (latent memory-leak warning).
7. ~~Scene arrival timeline vs sim-step camera pan race~~ — **verified not a bug.** All 7 environment scenes already gate the sim-step pan effect behind `arrivalDone` (`if (!arrivalDone || reduced) return;`). No fix needed.

## P2 — Apply if low-risk during this pass
- `NexusDialogue` beam height: switch fixed 130/150px to `clamp()`.
- `glitch-shake` duration 0.32s → ~0.5s so it's perceivable.
- Quick-links row (`UniverseMap.module.css`) — add `flex-wrap` under 640px.

## P2 — Documented, deferred to a future pass (not touched now)
- Duplicate `@keyframes arrive/flash/realmEnter` consolidation (cosmetic, no visible bug).
- `RealmOrbit` ring opacity / `UniverseCanvas` key-light placement (aesthetic only).
- `RealmSignatureAction` SVG path mobile scaling beyond the basics.
- Trophy float vs modal glow desync.
- `HolographicPanel` nested z-index clarity, `modeFor`/`colorFor` extraction, Motherboard import comments.

## Corrected from raw audit (no action needed)
- `ArchitectFinale` is NOT dead code — confirmed rendered in `Observatory.tsx`.
- `NexusDialogue` z-index (9999) vs `MasterJourneyHUD` (120) is intentional layering, not a collision.
