# Design and Motion System

**Date:** 2026-09-19
**Phase:** 3 — Advanced Design and Motion Foundation

The reusable visual, animation and interaction layer the later phases build on.
This phase deliberately changed almost nothing visible: it moved values that were
already in the codebase into one place, and fixed two defects that had been
documented since Phase 0.5.

---

## 1. The shape

```
styles/tokens.css        values: colour, type, space, radius, shadow, z, motion
        │                        (CSS custom properties, one source of truth)
        ├─────────────► styles/globals.css   surfaces, focus, utilities
        │
lib/motion.js            the same durations/easings for Framer Motion,
        │                which cannot read CSS variables
        │
        ├─ lib/useMediaQuery.js    viewport + reduced-motion, in JS
        ├─ lib/useDeviceTier.js    capability tier 0/1/2
        └─ lib/useInViewport.js    pause work that is off-screen
                │
                ▼
        components/ui/*      badges, tags, headings, panels, cards
        components/three/*   SceneCanvas — the R3F boundary
                │
                ▼
              pages/*
```

**The rule:** a component should not contain a colour literal, a duration, or a
cubic-bezier. If it needs one, it belongs in `tokens.css` (for CSS) or
`lib/motion.js` (for Framer).

### Why the values are duplicated between CSS and JS

Framer Motion animates via the Web Animations API and JavaScript objects. It
cannot read `var(--duration-normal)`. The two files therefore mirror each other
deliberately:

| Token (`tokens.css`) | Mirror (`lib/motion.js`) |
|---|---|
| `--duration-instant: 100ms` | `duration.instant = 0.1` |
| `--duration-fast: 150ms` | `duration.fast = 0.15` |
| `--duration-normal: 350ms` | `duration.normal = 0.35` |
| `--duration-slow: 700ms` | `duration.slow = 0.7` |
| `--duration-cinematic: 1200ms` | `duration.cinematic = 1.2` |
| `--ease-out-expo` | `ease.outExpo` |
| `--ease-enter` | `ease.enter` |
| `--ease-standard` | `ease.standard` |

Changing one means changing the other. This is the one intentional duplication
in the system; everything else has a single home.

---

## 2. Visual tokens

Declared in `styles/tokens.css`.

| Group | Tokens |
|---|---|
| Background | `--bg-base` `--bg-raised` `--bg-elevated` |
| Surface | `--surface-1..3` `--surface-sheen` |
| Border | `--border-hairline` `--border-strong` `--border-accent` `--border-accent-hover` |
| Text | `--text-primary` `--text-secondary` `--text-muted` `--text-dim` |
| Accent | `--accent` `--accent-bright` `--accent-secondary` `--accent-tertiary` |
| Domain | `--domain-product` `--domain-ai` `--domain-security` `--domain-systems` `--domain-research` `--domain-open-source` |
| Status | `--status-*`, one per canonical `ProjectStatus` |
| Typography | `--font-body` `--font-display` `--font-mono`, `--fs-*`, `--lh-*`, `--tracking-*` |
| Space | `--space-2xs..3xl`, `--container` |
| Radius | `--radius-sm..full` |
| Shadow | `--elev-1..3` `--inset-sheen` `--glow-rest` `--glow-hover` `--glow-domain` |
| State | `--state-hover-lift` `--state-press-scale` `--focus-ring-*` |
| Z-index | `--z-behind` … `--z-boot` |
| Motion | `--duration-*` `--ease-*` |

The values are the ones the site already used. `#07111f`, `#14b8a6`, the
`rgba(10,15,28,0.55)` card fill and the `cubic-bezier(0.16, 1, 0.3, 1)` easing
were all literals repeated across `globals.css` and `tailwind.config.js`; they
now have names. Nothing was re-picked, which is why the phase produced no
intended visual change.

### Contrast

Measured against `--bg-base` (`#07111f`):

| Token | Ratio | Use |
|---|---|---|
| `--text-primary` | 15.8:1 | headings |
| `--text-secondary` | 9.7:1 | body |
| `--text-muted` | 6.1:1 | supporting text |
| `--text-dim` | 4.6:1 | large or non-essential text only |

---

## 3. Domain colours

Six accents, keyed one-to-one to the canonical `Domain` union in
`content/types.ts` — so a domain colour is derived from content, never chosen per
component.

| Domain | Colour | |
|---|---|---|
| `product` | `#14b8a6` | teal |
| `ai` | `#986ef7` | violet |
| `security` | `#f59e0b` | amber |
| `systems` | `#38bdf8` | blue |
| `research` | `#af63f8` | purple |
| `open-source` | `#22c55e` | green |

**These are identifiers, not decoration.** Amber means security work. Using it
for unrelated emphasis breaks the only thing the colour is for.

Applied by attribute, so a subtree re-themes without threading a prop through
every child:

```jsx
<section data-domain="security">
  {/* descendants read var(--domain-accent) and var(--domain-soft) */}
</section>
```

`--domain-accent` and `--domain-soft` are registered with `@property`, so the
browser interpolates them natively when a domain changes rather than snapping.

This replaces the Codex `[data-realm]` mechanism, which had the right structure
and the wrong palette. `lib/realms.ts` and `styles/universe.css` were removed
this phase, as the salvage audit scheduled.

---

## 4. Typography

| Role | Token | Family |
|---|---|---|
| Cinematic display | `--fs-display` | Inter, tight tracking |
| Page heading | `--fs-h1` | Inter |
| Section heading | `--fs-h2` | Inter |
| Sub-heading | `--fs-h3` | Inter |
| Body | `--fs-base`, `--lh-body` | Inter |
| Technical label | `--fs-xs`, `--tracking-label` | JetBrains Mono, uppercase |
| Code, metrics, status, evidence | `--fs-sm` / `--fs-2xs` | JetBrains Mono |

**Monospace is reserved for technical information** — labels, metrics, statuses,
identifiers, evidence, code. Prose is always Inter. That is the whole rule, and
it is what keeps the technical texture meaningful instead of decorative.

Existing page text layouts were not rewritten to demonstrate this. The scale is
available; pages adopt it as later phases rebuild them.

---

## 5. Motion system

`lib/motion.js`.

| Preset | Use |
|---|---|
| `fadeUp()` | default entrance |
| `fadeIn()` | entrance where position must not shift |
| `slideIn()` | entrance for elements with horizontal slack |
| `slideInResponsive()` | horizontal above `md`, vertical when stacked |
| `scaleIn()` | cards and panels appearing as a unit |
| `staggerGroup()` | container/child variants for grouped reveals |
| `hoverLift` | card hover |
| `pressable` | buttons |
| `tagInteraction` | tags and chips |
| `backdrop` / `dialog` / `drawer()` | overlays |
| `proofReveal()` | evidence and metrics |
| `drawLine()` | SVG architecture diagrams (`pathLength`) |

### The regression rule

**Entrance presets animate on mount. Nothing in the shared system triggers on
scroll intersection.**

Phase 1 applied `whileInView` to `/projects` and it left project cards at
`opacity: 0` after a jump-scroll — real content, permanently invisible, caught by
a screenshot. Encoding the rule in the system means a future phase cannot
reintroduce it by copying a nearby component.

Verified this phase: jumping straight to the bottom of `/`, `/projects` and
`/skills` in a production build leaves **0** on-screen elements below 0.05
opacity.

### Reduced motion

Three layers, because no single one covers everything:

1. **CSS tokens** — `@media (prefers-reduced-motion: reduce)` collapses every
   `--duration-*` to `0ms` and `--state-hover-lift` to `0px`, which disables all
   token-driven transitions at once.
2. **`globals.css`** — neutralises the older keyframe animations that predate the
   token layer, and stops the scanline drift.
3. **`MotionConfig reducedMotion="user"` in `_app.js`** — Framer Motion never
   reads CSS, so before this phase every motion component ignored the preference
   entirely. `"user"` disables transform and layout animation while keeping
   opacity, so content still resolves to visible instead of being stranded at its
   initial state.

Canvas and WebGL work is handled separately by the tier system below:
`useDeviceTier` forces tier 0 under reduced motion, and tier 0 means a single
static frame rather than a render loop.

Verified: with reduced motion emulated, `--duration-fast` and `--duration-normal`
compute to `0s`, `--state-hover-lift` to `0px`, and no on-screen content is
transparent.

---

## 6. Reusable components

`components/ui/`:

| Component | Reads | Notes |
|---|---|---|
| `StatusBadge` | `ProjectStatus` | public labels formatted here only |
| `DomainBadge` | `Domain` | exports `domainColor()` for tinting |
| `ProofBadge` | `Proof` | **refuses to render unverified proof** |
| `TechTag` | — | tints from `--domain-accent`; optional interactive mode |
| `SectionHeading` | — | eyebrow + heading + lede; `as` sets the real level |
| `MetaLabel`, `Metric` | — | monospaced technical metadata |
| `Panel` | — | animated `.surface-card` / `.glass-panel` |
| `InteractiveCard` | — | accessible whole-card link foundation |

`ProjectCard` was migrated onto `StatusBadge` and `TechTag`; the status map moved
wholesale, so nothing changed visually.

### Two decisions worth keeping

**`ProofBadge` enforces verification in the UI.** Phase 2 validation already
rejects unverified proof in the data. Enforcing it again at render means a
component cannot publish an unchecked claim just because a future caller passed
it one.

**`InteractiveCard` uses a stretched link, not a wrapping anchor.** The card is
positioned, one real `<a>` carries the destination and accessible name, and an
absolutely-positioned overlay makes the whole card clickable. That keeps exactly
one tab stop and leaves the heading, tags and nested links individually
meaningful. Wrapping the card in an anchor instead would flatten all of that into
a single unreadable link name.

---

## 7. 3D infrastructure

Phase 4 builds the Engineering Core; this phase built only what it will stand on.

### Capability tiers — `lib/useDeviceTier.js`

Wraps `lib/deviceTier.ts` (salvaged, classified KEEP).

| Tier | Meaning |
|---|---|
| 2 | full effects: WebGL scenes, full particle budget |
| 1 | reduced: fewer particles, simplified geometry, capped DPR |
| 0 | minimal: no WebGL, one static frame, no loop |

Reduced motion forces the effective tier to 0 regardless of hardware — a stated
preference outranks a hardware guess. `hardwareTier` stays available for anything
that needs the raw capability.

Read via `useSyncExternalStore`, matching `lib/routeChrome.js`. Capability never
changes for the life of a page, so there is nothing to subscribe to, and the
project's lint rules reject the `setState`-in-effect version.

### `SceneCanvas` — `components/three/SceneCanvas.js`

The single boundary every future 3D scene mounts through. It guarantees:

- never renders WebGL below `minTier` or without a context
- always renders a real `fallback` instead, so a page is never empty
- `frameloop="demand"` when off-screen, hidden, or under reduced motion
- DPR capped per tier (`2 → [1,2]`, `1 → [1,1.5]`, `0 → [1,1]`)
- canvas fills its container at `--z-base`, content layers above at `--z-content`
- loaded with `ssr: false`, so R3F never enters the server bundle or the initial
  payload of pages with no 3D

### The R3F proof

R3F, drei and postprocessing had been in `package.json` for a long time without
ever being imported or built here — the salvage audit called the stack "unproven
ground, not existing infrastructure". `pages/dev/r3f-probe` proves it compiles,
mounts and renders a lit, shaded, rotating mesh through `SceneCanvas`, and
reports the measured tier.

It is `noindex`, `Disallow: /dev/` in robots.txt, absent from the sitemap and
unlinked from any navigation. Phase 4 should keep it as the place to test scene
changes in isolation.

### Existing canvases

`SkillCube` and `ParticleNetwork` were adapted, not replaced:

- `SkillCube` pauses off-screen and on hidden tabs, caps pixel ratio by tier, and
  draws a single static frame under reduced motion. Scene, materials, lighting
  and rotation speeds are untouched.
- `ParticleNetwork` thins its field by tier (90 / 45 / 30) rather than switching
  off. Weak devices get a sparser network, never an empty one.
- `GravitySkills` keeps its Matter.js implementation entirely. The only change
  was removing `render.canvas.remove()` from cleanup — the canvas belongs to
  React, and detaching it left the physics drawing into an orphaned element on
  re-mount.

---

## 8. The two defects

### Particle layer

The canvas was `position: fixed; z-index: 0` inside `#__next`, which establishes
a stacking context. Within one, a **positioned** element with `z-index: 0` paints
above **unpositioned** block and inline content. Pages whose sections happened to
carry `relative` were unaffected; `/skills` has no positioned wrapper anywhere,
so its body text sat underneath the particle field.

Fixed by moving the canvas to `--z-behind` (`-1`) via `.ambient-canvas`. It now
paints behind all content but above the body gradient. This is a root fix: no
page has to remember to position itself, and a new page cannot reintroduce the
bug by omitting a class.

### Horizontal overflow

Measured with `overflow-x` temporarily lifted, which is the only way to see it —
`overflow-x: clip` clamps `scrollWidth` and reports 0.

| | Before | After |
|---|---|---|
| `/` at 375px | **34px** | 0px |
| all other routes, 375px and 1280px | 0px | 0px |

The cause was the Education timeline. Its rows enter with `x: ±50`, and below
`md` the timeline is a single stacked column, so a full-width card offset
sideways runs past the viewport edge — and because the rows used `whileInView`,
elements below the fold sat at that offset indefinitely rather than transiently.
They now enter vertically when stacked and horizontally only at `md` and up,
where cards are 5/12 wide and have the room.

`overflow-x: clip` remains as a backstop, not as the fix, and is commented as
such.

The elements still extending past the viewport are Hero's three decorative blur
glows. They are clipped by Hero's own `overflow-hidden` and contribute nothing to
`scrollWidth` — local containment of background decoration, which is correct.

---

## 9. Mobile and accessibility

- **Touch targets** — `TechTag` in interactive mode is padded to a 44px minimum
  height on small screens (WCAG 2.5.8) while the chip stays visually small.
- **Keyboard** — `InteractiveCard` keeps one tab stop and shows a focus ring via
  `focus-within`. The global `:focus-visible` ring is token-driven.
- **Reduced motion** — three layers, section 5.
- **Semantic equivalents** — `MetaLabel` emits real `<dt>`/`<dd>`; canvases are
  `aria-hidden` with the information they decorate present as text.
- **Low-capability devices** — effects are adapted by tier, not removed: fewer
  particles, capped DPR, static frames, a real WebGL fallback.

Full mobile polish remains Phase 32.

---

## 10. Route separation

Unchanged from Phase 0.5 and verified again this phase: `/hire`,
`/studio/request` and `/studio/admin` render **0** ambient canvases, **0**
scanline overlays and **0** scroll progress bars. The boot sequence, particle
field and CRT effects remain portfolio-only.

`/dev/r3f-probe` intentionally inherits portfolio chrome — it is a portfolio
route, just an unlisted one.

---

## 11. Phase 4 integration guidance

1. **Mount the Engineering Core through `SceneCanvas`.** Capability, visibility,
   reduced motion, DPR and fallback are already decided. Pass `minTier={1}` and a
   real 2D `fallback` — the five domains must be navigable without WebGL.
2. **Drive domain colour from content.** Read `domains` off the canonical
   project, set `data-domain`, and let `--domain-accent` cascade. Do not pass
   colours down as props.
3. **Use `frameloop="demand"` deliberately.** `SceneCanvas` already switches to
   it off-screen; scenes that are idle rather than animating should invalidate
   manually rather than running `always`.
4. **Port the camera timeline off GSAP.** `lib/journey/cinematicCamera.ts` is the
   act structure worth keeping; GSAP is a ~70 KB dependency with one consumer.
   Its `reducedMotionDive()` contract must survive the port.
5. **Do not reintroduce scroll-gated entrances.** Use the presets.
6. **Budget from `useDeviceTier().budget`** rather than a new per-scene constant.

### Known residual risk

`pages/skills.js` still uses `whileInView` in four places. It was verified
working under jump-scroll in a production build, so it was left alone rather than
rewritten for its own sake — but it is the pattern the shared system now forbids,
and whichever phase next touches that page should migrate it to the presets.

---

## 12. Intentionally not done

No homepage rebuild, no Engineering Core, no scroll storytelling, no case
studies, no Skill Galaxy, no Research or Open Source page, no CMS. `SkillCube`,
`GravitySkills`, `SpotlightGrid`, `GlitchText`, `SecretProject` and `TerminalGame`
are all preserved.

`tailwind.config.js` still declares its own colour literals. Tailwind cannot read
CSS custom properties at config time without a build step, and the values match
the tokens exactly; reconciling it properly is a Phase 32 concern.
