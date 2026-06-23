# UI_FIX_REPORT.md — Codex Infinitum Polish Pass

Audited via static read of source (components/universe/**) across desktop (1920/1440/1366), tablet (768), mobile (390). Items below were cross-checked against actual code; two findings from the raw audit were disproven and removed (NexusDialogue z-index `9999` vs MasterJourneyHUD `120` is intentional layering, not a collision; `ArchitectFinale` IS rendered in `Observatory.tsx:60`, not dead code).

## P1 — Functional/Layout Breaks

**A9 — Hardcoded 180px padding during journey**
File: `components/universe/realms/RealmShell.tsx:149`
Inline `paddingBottom: "180px"` doesn't scale; on 390px viewports it eats ~46% of viewport height.
Fix: `clamp(120px, 28vh, 180px)`.

**D4 — Duplicate HUD chrome on simulation realms**
File: `components/universe/realms/RealmShell.tsx:152-156`
`FloatingHUDPanel` always renders alongside `RealmSimulationStage` whenever `hasSimulation` is true — two knowledge-style overlays competing for the same screen region.
Fix: verify actual content overlap; if duplicated, gate `FloatingHUDPanel` to only the realms/views where `RealmSimulationStage` isn't already showing equivalent info.

**A3 — NEXUS companion overlap on mobile during active journey**
File: `components/universe/nexus/NexusCompanion.module.css` (no journey-aware offset)
NEXUS sits at fixed bottom-right; when `MasterJourneyHUD` is active on mobile, both occupy the lower screen band with no coordinated offset.
Fix: add a journey-active modifier that lifts NEXUS above the HUD height.

## P2 — Visual Polish

**A1 — NexusDialogue beam height too large on mobile**
File: `components/universe/nexus/NexusDialogue.module.css:4,20-36,99-101`
Beam consumes ~33-38% of viewport height at 390px width.
Fix: `clamp()`-based height instead of fixed 130/150px.

**A5 — RealmSignatureAction SVG path not mobile-aware**
File: `components/universe/realms/RealmSignatureAction.module.css`
Hardcoded path coordinates assume a wider stage than mobile provides.
Fix: scale path via viewBox + `preserveAspectRatio`, not literal coordinates.

**A8 — Quick-links row tight on 390px**
File: `components/universe/map/UniverseMap.module.css:141-173`
Three buttons barely fit with no wrap fallback.
Fix: `flex-wrap: wrap` + reduced gap under 640px.

**C1 — Duplicate keyframes across modules**
`@keyframes arrive` / `realmEnter` / `flash` redefined near-identically in `inventions.module.css`, `chambers.module.css`, `realm.module.css`.
Fix: consolidate into `styles/tokens.css` or a shared animations partial — lowest priority, cosmetic maintenance only, skip unless time remains.

**C5 — glitch-shake too short to perceive (0.32s)**
File: `components/universe/nexus/NexusDialogue.module.css:49-58`
Fix: extend to ~0.5-0.6s.

**C7 — Unsynced trophy float (3s) vs modal glow (20s)**
File: `components/universe/journey/MasterJourneyHUD.module.css:270-287`
Fix: pick durations with a common multiple (e.g. 3s / 12s).
