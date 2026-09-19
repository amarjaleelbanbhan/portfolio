# Engineering Core

**Date:** 2026-09-19
**Phase:** 4 — Cinematic Homepage Hero & 3D Engineering Core

The homepage hero and the reusable 3D infrastructure behind it.

---

## 1. The idea

The core is a **schematic, not a planet**. A decorative sphere would have been
easier and would have said nothing; the brief explicitly rules it out. So the
visualisation is built to carry real information:

- each of the five nodes is a canonical `Domain`
- each **link's brightness is derived from evidence** — how many non-archive
  projects sit in that domain, or how many pull requests were merged upstream for
  Open Source. A domain with more behind it genuinely reads stronger, and the
  picture reweights itself when content changes
- each node's **satellites are its actual technologies**, one mote each
- the **headline is the legend**: "AI", "security" and "product engineering" are
  set in the same domain accents the core uses, so the colour language is taught
  by the sentence before the diagram uses it

Nothing in the visual is decided by hand except layout angles.

---

## 2. Component architecture

```
components/Hero.js                     composition only — no scene, no data
  ├─ PortraitOrbit.js                  portrait + orbit rings + dots (extracted)
  └─ engineering-core/
       EngineeringCore.js              container: state + layers
         ├─ SceneCanvas (Phase 3)      capability / DPR / visibility / fallback
         │    └─ CoreScene.js          scene contents, lights, pointer
         │         ├─ CameraRig.js     INTRO / IDLE / DOMAIN_FOCUS / RETURN
         │         ├─ CoreConnections  centre, shell, evidence-weighted links
         │         └─ DomainNode.js    one node + its technology satellites
         ├─ DomainRing.js              semantic navigation (real links)
         ├─ DomainDetail.js            description panel
         └─ CoreFallback.js            2D SVG core
       useCoreInteraction.js           one shared interaction state
       coreLayout.js                   shared geometry (3D + DOM read the same)
```

`Hero.js` contains no scene code, no content and no event handling — it composes.

---

## 3. Content relationships

```
content/domains.ts          label, description, href, ring angle,
       │                    curated technology slugs
       ▼
lib/content/selectors.ts    getCoreDomains() / getDomainSummary()
       │                    ├─ projects      ← getProjectsByDomain()
       │                    ├─ technologies  ← skill registry / merged repos
       │                    ├─ stat          ← derived count
       │                    └─ color         ← --domain-* tokens
       ▼
EngineeringCore
```

Only copy and destination are authored. Every fact is derived.

### Why the technology lists are curated

Deriving them was tried twice and both attempts produced misleading output.
Ranking by how *exclusive* a technology is to a domain opened Product with
"WebGL, FFmpeg, Headless" — technically exclusive, but not what Product means.
Ranking by frequency surfaced Node.js everywhere and said nothing.

So ordering is curated in `content/domains.ts` and the **facts are enforced by
validation** instead: every slug must exist in the skill registry *and* be used
by a non-archive project in that domain. The list can be ordered for a reader; it
cannot claim something untrue.

### Validation rules added this phase

| Rule | Prevents |
|---|---|
| domain is a canonical `Domain`, no duplicates | a node with no content behind it |
| unique ring angle, 0–359 | two nodes drawn on top of each other |
| `href` path is in `EXISTING_ROUTES` | linking at a page a later phase has not built |
| `#anchor` matches a real project slug | a link that scrolls nowhere |
| technology exists in the skill registry | advertising a skill that does not exist |
| technology used by a project in that domain | advertising work not actually done |
| exactly 5 core domains | breaking the ring layout and keyboard order |

All seven were confirmed to fire by deliberately breaking each.

---

## 4. Interaction

One state object (`useCoreInteraction`) drives the 3D scene, the DOM ring and the
detail panel, so mouse, touch and keyboard produce identical results.

Precedence: **pinned → focused → hovered**. Focus outranks hover so tabbing is not
overridden by a pointer resting elsewhere.

| Input | Behaviour |
|---|---|
| Hover (node or label) | highlight, dim others, reveal description |
| Keyboard focus | identical — hover is never the only route |
| Tap | pins the domain; the link still navigates |
| Activate | navigates to the destination |

Selecting a domain scales its node, brightens its link, dims the rest, tints the
ambient wash, leans the camera, and shows the description with its technologies.

### Destinations

Existing routes only — no links to pages later phases will build.

| Domain | Destination |
|---|---|
| Product | `/projects#rodift` |
| AI | `/projects#knowledgeguard` |
| Security | `/projects#veripatch` |
| Systems | `/projects#emergency-mesh` |
| Open Source | `/projects#open-source` |

`/projects` gained `id={slug}` per card and `id="open-source"` on the
contributions section, with `scroll-mt-24` so anchors clear the fixed navbar.
All five were verified to resolve to a real element.

---

## 5. Camera strategy

Four states, driven by interaction rather than a clock:

| State | Behaviour |
|---|---|
| `INTRO` | one authored pull-back from z=11 to z=7.2, plays once |
| `IDLE` | a slow breath (±0.06) plus clamped pointer parallax (±0.32) |
| `DOMAIN_FOCUS` | leans 0.5 units toward the active node |
| `RETURN` | the same easing with no target — cannot fight `DOMAIN_FOCUS` |

Implemented as critically-damped interpolation inside `useFrame`:
`x + (target - x) * (1 - e^(-λΔt))`, which is frame-rate independent, and Δt is
clamped to 0.1s so a backgrounded tab cannot produce a jump on return.

**No GSAP was introduced.** The salvaged `lib/journey/cinematicCamera.ts` animates
CSS 2D transforms on DOM elements and is the repository's only GSAP consumer
(~70 KB for one timeline). What carried over is its *shape* — an anticipation
beat, an authored move, a settle — and its reduced-motion contract, not its code.
Framer Motion cannot drive a Three.js camera, so the frame loop already owned by
`SceneCanvas` does the work.

Amplitudes are deliberately small: the labels sit in the DOM around the scene and
must stay readable. There is no continuous camera rotation.

---

## 6. Device tiers

Inherited from `SceneCanvas` / `useDeviceTier`; no second capability system.

| Tier | Core behaviour |
|---|---|
| 2 (desktop, wide) | full detail: subdivided geometry, technology satellites, wireframe shell, antialiasing, DPR ≤ 2 |
| 1 | low detail: flat geometry, no satellites, no shell, DPR ≤ 1.5 |
| 0 / no WebGL / reduced motion | 2D SVG core, no render loop |

`detail` is `tier >= 2 && isWide`, so phones and weak hardware skip the satellite
motes — the cheapest meaningful geometry reduction available.

There is **no postprocessing**. Bloom over five small emissive nodes would cost a
full-screen pass for something the emissive materials already imply.

---

## 7. Fallback behaviour

The 2D core is the same diagram in SVG — centre, dashed enclosure, five
evidence-weighted links, five nodes — and it highlights on the same interaction
state. It is not a placeholder.

More importantly, **the DOM layer is the content layer**. `DomainRing` renders
real `<Link>` elements with labels, counts and destinations regardless of whether
WebGL ever loads, so nothing is lost:

- WebGL unavailable → SVG core, five links, all destinations, hero text unaffected
- reduced motion → static SVG core, nothing animating, nothing invisible
- narrow screens → the ring becomes a card list with **every description and
  technology visible inline**

That last point is a real fix rather than a nicety: touch has no hover and a tap
navigates, so gating descriptions behind interaction would have made them
unreachable on a phone. Browser testing caught exactly that.

---

## 8. Rendering and performance decisions

- **Route-scoped.** The core is `next/dynamic` with `ssr:false`, and `SceneCanvas`
  loads R3F dynamically. Measured static JS+CSS: `/` 1748 KB, `/hire` **598 KB** —
  the 3D stack does not reach the client funnel or admin.
- **Text first.** `domInteractive` 148 ms on `/`; the headline and CTAs are server
  rendered and never wait on WebGL. The dynamic import reserves the core's square
  so nothing reflows when it arrives.
- **One loop.** Every animation runs in `useFrame`. Nothing starts a
  `requestAnimationFrame` of its own, so when `SceneCanvas` switches to
  `frameloop="demand"` it all stops together. Verified: scrolled off-screen, the
  canvas stops producing new frames.
- **No state in the frame loop.** Highlighting mutates material and transform
  values directly. Driving it through React state would re-render the scene graph
  on every pointer move.
- **No new assets.** No textures, no 3D fonts, no models. Labels are DOM, which is
  why there is no font download and no projection maths. The hero portrait is the
  Phase 0.5 optimised 97 KB asset, now requested at 96 px.

---

## 9. Preserved from the previous hero

Nothing was deleted to make room. The portrait, both orbit rings, both orbiting
dots and the availability badge moved into `PortraitOrbit.js` as a reusable
component with a `size` prop, and now sit beside the headline as a compact
identity anchor — supporting the thesis instead of competing with the core for
the role of main visual.

The typing cycler, `GlitchText`, floating technology chips, gradient depth
washes, particle field and scanlines all remain. The chips were dimmed from 0.55
to 0.32 peak opacity so they read as ambient depth rather than as a second set of
tags competing with the domain labels.

`GlitchText` gained an `as` prop. It renders a `<div>`, which is invalid inside a
`<p>` — the browser silently closes the paragraph, so server markup and hydrated
DOM disagreed and React threw hydration error #418. Inline callers now pass
`as="span"`.

---

## 10. Known limitations

1. **Labels sit outside the 3D nodes rather than on them.** Pinning HTML to
   projected 3D coordinates would need re-projection every frame and would drift
   whenever the camera moves. The ring frames the constellation instead, which
   stays correct at any camera position and keeps labels as ordinary accessible
   DOM. The trade-off is that a label is adjacent to its node, not attached.
2. **`/` is 1748 KB of static JS+CSS.** Three.js and R3F dominate. Acceptable for
   a 3D homepage and route-scoped, but bundle analysis belongs to Phase 34.
3. **~39 fps measured**, in headless Chrome using software rasterisation. Not
   representative of a real GPU; treat as a floor, not a number.
4. **The `research` domain is not a core node.** Five nodes is the design and the
   validation enforces it; research surfaces through KnowledgeGuard under AI and
   SCAR-OS under Systems until Phase 15 gives it a page.
5. **Destinations are all `/projects` anchors.** Correct for now — the brief
   forbids linking at routes that do not exist — but Phases 6/14/15 should
   repoint them at real domain pages. That is a one-line change per domain in
   `content/domains.ts`, and validation will reject a typo.

---

## 11. Phase 5 integration guidance

Phase 5 builds the `BUILT → VERIFIED → RESEARCHED → SYSTEMS → CONTRIBUTED` scroll
story beneath this hero.

1. **Reuse the domain state, do not fork it.** `useCoreInteraction` is not tied to
   the hero; if a scroll section should drive the core's highlight, lift the hook
   and pass `active` down rather than adding a second source of truth.
2. **The narrative maps onto existing domains.** BUILT→product, VERIFIED→security,
   RESEARCHED→ai, SYSTEMS→systems, CONTRIBUTED→open-source. Read them from
   `getCoreDomains()` so the story cannot disagree with the core.
3. **Use `getProjectsByDomain()`** for each chapter's project rather than naming
   slugs in the page.
4. **Scroll-linked camera is possible but not free.** `CameraRig` takes a target;
   a scroll section could drive `activeAngle`. Keep the amplitude small — the
   labels must stay readable, which is why nothing here rotates continuously.
5. **Do not gate story content behind scroll intersection.** Phase 3's rule
   stands: entrance presets animate on mount.
6. **Anchors already exist** on every project card and the contributions section.
7. **Repoint destinations** in `content/domains.ts` as real pages ship; add the
   route to `EXISTING_ROUTES` in `lib/content/validation.ts` in the same commit.
