# ARCHITECTURE_REPORT.md — Codex Infinitum Polish Pass

## P1

**D4 — FloatingHUDPanel + RealmSimulationStage overlap on simulation realms**
File: `components/universe/realms/RealmShell.tsx:152-156`
Both render simultaneously whenever a realm has a registered simulation. Needs a content check (not just a static read) to confirm actual visual duplication before removing either — flagged for the fix pass to verify in-browser, not removed blind.

## P2 — Code quality, not user-facing

**D1 — Motherboard3DScene/2DCanvas imports unlabeled as Silicon-Foundry-exclusive**
File: `components/universe/environments/EnvironmentLayer.tsx`
Cosmetic comment-only fix, low value, skip unless trivial.

**D2 — HolographicPanel nested z-index (0/1/2) hardcoded internally**, makes layering hard to trace when nested (RealmShell wraps it twice for Silicon Foundry). Works correctly today; defer refactor.

**D3 — RealmInfoCard hint text hardcodes NEXUS's mobile width (104px) instead of referencing a shared variable.** Brittle but not currently broken — defer.

**D6 — `modeFor`/`colorFor` helpers in NexusCompanion.tsx are local**, not shared. No duplication found elsewhere in the codebase on this pass — not actually duplicated yet, so no fix needed now.

## Corrected from raw audit
- **"ArchitectFinale orphaned/dead code"** — disproven. `Observatory.tsx` imports it (line 7) AND renders it in JSX (line 60), gated by `setArchitectFinaleShown`. No action needed.
