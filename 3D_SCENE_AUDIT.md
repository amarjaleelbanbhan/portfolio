# 3D_SCENE_AUDIT.md — Codex Infinitum Polish Pass

## P1

**B5 — Scene camera focus points hardcoded, not bound to mesh refs**
Files: `components/universe/environments/scenes/*Scene.tsx` (pattern repeated across CloudExpanseScene and siblings)
Camera focus targets are literal `Vector3` constants instead of reading the actual landmark mesh's world position. If a landmark's authored position ever shifts, the camera silently points at empty space.
Fix: where landmark refs already exist, read `getWorldPosition()` instead of duplicating coordinates. Lower priority if no landmark positions are currently being changed — defer unless a scene visibly mis-frames.

## P2 — Aesthetic, not broken

**B1 — Brief look-at lag during zoom-to-node**
File: `components/universe/map/UniverseCanvas.tsx` (ZoomDirector)
Camera position and look-at target are updated by separate mechanisms; on slow frames there's a single-frame mismatch. Not perceptible at 60fps, theoretical only.

**B3 — Key light positioned center-scene instead of as a "sun"**
File: `components/universe/map/UniverseCanvas.tsx:148-152`
Main point light sits at `[0,0,2]`; nodes at `z ≈ ±9` on the far side receive little direct light and look dim relative to near-side nodes.
Fix (optional): reposition or add a low-intensity directional light to even out the far side. Cosmetic — defer to a future visual pass, not in this round's P0/P1 scope.

**B4 — RealmOrbit rings nearly invisible (opacity 0.45 vs near-black background)**
File: `components/universe/map/RealmOrbit.tsx:12`
Layer-tier rings barely register, so the "rings = conceptual layers" idea doesn't land visually. Cosmetic, defer.

## Verified non-issues
- Lighting/camera setup per individual realm scene was spot-checked on 3 of the larger scene files; no overlapping meshes or out-of-frustum objects found beyond B5 above.
