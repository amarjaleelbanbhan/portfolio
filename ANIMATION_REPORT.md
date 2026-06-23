# ANIMATION_REPORT.md — Codex Infinitum Polish Pass

## P1

**C2 — GSAP timeline in ArchitectAvatar not guarded against unmount**
File: `components/universe/journey/ArchitectAvatar.tsx:59-96`
`setTimeout` inside the exit callback can fire after unmount if the user navigates away mid-typewriter, risking a React state-update-on-unmounted warning.
Fix: guard the timeout callback with a mounted ref; ensure `tl.current?.kill()` runs in cleanup (verify it already does via `ctx.revert()` — if so, only the setTimeout needs the guard).

**C3 — Arrival timeline and sim-step camera pans can run concurrently**
File: `components/universe/environments/scenes/CloudExpanseScene.tsx` (pattern likely shared by sibling scene files)
If `activeSimStep` changes while the 3s arrival GSAP timeline is still playing, a second animation begins moving `camera.position`/`cameraTarget` concurrently, causing jitter.
Fix: gate the sim-step pan effect behind an `arrivalDone` flag.

## P2 — Polish, not broken

**C4 — Decorative infinite spin (NexusCompanion fallback, 16s) with no semantic tie to a CS concept.**
Fix: shorten to a single deliberate run on mount, or pause on hover/idle — defer unless touching this file for other reasons.

**C5 — glitch-shake (0.32s) too short to register.** Extend to ~0.5-0.6s.

**C7 — Trophy float (3s) and modal glow (20s) unsynced**, mildly distracting in the completion modal. Pick durations with a common multiple.

**C8 — codeReveal fade-out window too abrupt (85%→100%)** in `RealmSignatureAction.module.css`. Extend fade start to ~70%.

## Verified as correctly scoped (no fix needed)
- EnergyConnections pulse animation already early-returns most logic when `reduced` is set; the residual line fade is a single opacity transition, not a perceptible motion hazard — judged acceptable, not worth touching this pass.
