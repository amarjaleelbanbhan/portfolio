# 6 · INTERACTIONS & ANIMATION
## The Motion Bible of CODEX INFINITUM — How the Universe Moves, Reacts & Breathes

> *"A static universe is a dead universe. Everything that can move, must move — but never for spectacle. Motion is the language of intelligence."*
> — Universe Law Ⅱ, [`1_world_concept.md`](1_world_concept.md)

---

## Document Purpose

[`2_story_experience.md`](2_story_experience.md) wrote the *screenplay* — what happens, scene by scene. [`5_ui_ux_system.md`](5_ui_ux_system.md) defined the *materials* — colors, components, tokens. **This document is the choreography** — the exact curves, durations, triggers, and easing that make every element move with intention.

It is the bridge between the cinematic vision and the engineering reality. Every animation here is specified at three levels:
1. **Intent** — what the visitor should *feel*
2. **Spec** — the exact values (duration, easing, properties, triggers)
3. **Implementation** — which tool (GSAP / Framer Motion / CSS / R3F), per [`8_technical_feasibility.md` Animation Matrix](8_technical_feasibility.md)

**The prime directive** (Law Ⅶ, [`8_technical_feasibility` Animation Performance Rules](8_technical_feasibility.md)): every animation in this document is expressible in `transform`, `opacity`, `filter`, or a registered custom property. **No layout property is ever animated.** A motion design that cannot run at 60fps does not exist in CODEX INFINITUM.

---

## 1. THE MOTION PHILOSOPHY

### Six Motion Principles

**M1 — Motion Carries Meaning.** A neural network pulses *because* an AI project is being revealed; it is explanatory, not decorative (Law Ⅱ). If an animation can be removed without losing information *or* emotion, remove it.

**M2 — The Universe Has Inertia.** Nothing starts or stops abruptly. Objects accelerate and decelerate like they have mass. The signature ease is `--ease-universe` — a spring-like out-curve that feels physical.

**M3 — Silence Between Notes.** Per Law Ⅹ, animations have rests. A boot line lands, *then pauses*, then the next begins. Continuous motion is exhausting; phrased motion is musical.

**M4 — Reward Attention, Don't Demand It.** Idle and ambient motion is subtle (P6). The big choreography is reserved for moments the visitor *caused* — a click, an arrival, a discovery (Law Ⅴ).

**M5 — Consistency Is Physics.** The same gesture always produces the same motion. Hover always scales 1.02. Travel always takes 1.2s. The universe obeys its own laws without exception (P4 from Doc 5).

**M6 — Degrade With Grace.** Every animation has a reduced-motion equivalent that preserves meaning. Motion is an enhancement layer, never a dependency (§14).

---

## 2. THE EASING & TIMING SYSTEM

### 2.1 The Easing Curves

The complete set. No animation uses an easing not listed here.

| Token | cubic-bezier | Character | Used for |
|---|---|---|---|
| `--ease-universe` | `(.16, 1, .3, 1)` | Spring-like, decisive out | Hovers, entrances, the universe's "voice" |
| `--ease-boot` | `(.4, 0, .2, 1)` | Material standard | Boot sequence, progress bars, system UI |
| `--ease-enter` | `(.22, 1, .36, 1)` | Soft arrival | Cards, panels, content reveals |
| `--ease-in-cubic` | `(.55, .055, .675, .19)` | Accelerate away | Exits, things leaving toward the camera |
| `--ease-linear` | `linear` | Constant | Orbital drift, infinite rotations, hue-shift |

> R3F/GSAP equivalents: `--ease-universe` ≈ GSAP `power4.out`; `--ease-boot` ≈ `power2.inOut`; orbital drift uses raw `useFrame` delta (linear).

### 2.2 The Duration Scale *(from [Doc 5 tokens](5_ui_ux_system.md))*

| Token | Value | Feel | Used for |
|---|---|---|---|
| `--duration-fast` | 150ms | Instant | Micro-interactions, hovers, presses |
| `--duration-mid` | 350ms | Responsive | Card reveals, hover-zoom, info cards |
| `--duration-slow` | 700ms | Deliberate | Section reveals, mode changes |
| `--duration-cinematic` | 1200ms | Epic | Realm travel, color bleeds, the big moments |

**The golden rule of duration:** the more the visitor caused it directly, the faster it resolves (a button must feel instant). The more it is a *cinematic reward*, the longer it may linger (a realm arrival earns its 3 seconds).

---

## 3. THE BOOT SEQUENCE — FRAME-PERFECT CHOREOGRAPHY
### *Implements [`2_story` Act 1](2_story_experience.md) · GSAP Timeline*

The most sacred animation in the universe (Law Ⅲ). It is a single paused `gsap.timeline()` (Doc 8), played on first visit, seeked-to-end on return.

### 3.1 The Master Timeline

| t (s) | Event | Spec | Tool |
|---|---|---|---|
| 0.0 | Void + breathing grid | hex grid 3% opacity, breathes 6s loop, Web Audio reactive | CSS + Web Audio |
| 1.8 | Power button appears | fade+scale `0.8→1`, 400ms `--ease-enter` | GSAP |
| 1.8→∞ | Button breathing | glow 0→12px / 40%→100% opacity, 2.4s loop | CSS keyframes |
| 2.2 | "[ PRESS TO INITIALIZE ]" | typewriter, 60ms/char, blink cursor 1.2s | GSAP |
| hover | Proximity ignition | grid lights 8 paths outward 200px/300ms; pulse → 0.8s; ring 4rpm | GSAP + CSS |
| click | **Impact (t=0)** | white flash; shockwave ring to viewport edge, 400ms; 50ms silence | GSAP |
| 0.05 | Boot terminal begins | typewriter readout, edge circuit-frame lights edge-by-edge | GSAP |
| ~0.05→18 | POST / MEMORY / STORAGE / NETWORK / SECURITY / AI CORE lines | each block types, then **180–600ms rest** (M3); 847-pattern count via `CountTo` | GSAP |
| ~12 | The boot typo | `NEXUS initalizing… [correcting…] initializing…` (Micro-moment #2) | GSAP |
| 18 | BOOT COMPLETE | "Entering… 3… 2… 1…", 1s beats, music swells | GSAP |
| 21 | **The Shatter** | every char → particle (847 motes), swirl outward, plane shatters to 3D | GSAP → R3F handoff |
| 22→30 | Universe condenses | 6 orbs condense from particles; camera drifts to Core; score crossfades | R3F `useFrame` + GSAP |

### 3.2 The Critical Handoff (t≈21s)

The single hardest moment: 2D DOM terminal → 3D WebGL universe. The 847 boot characters don't fade — they *become* the particle field that condenses into realms.

```
GSAP timeline completes terminal
  → captures char positions (getBoundingClientRect)
  → spawns matching InstancedMesh particles at those screen coords (R3F)
  → DOM terminal opacity → 0 as particles take over (cross-authority, 600ms)
  → R3F useFrame drives particle → orbit convergence
  → GSAP resumes for camera dolly to Core
```

> This is the "three animation systems in sequence" challenge from [Doc 8 §Hardest Things #1](8_technical_feasibility.md). The contract: **GSAP owns time, R3F owns space, they share a single clock** (`gsap.ticker` drives both, no competing RAF loops — M5, no jank).

### 3.3 Returning-Visitor Express Boot
Per [`2_story` Returning Visitor](2_story_experience.md): `bootCompleted` in Zustand → timeline seeks to a **6s express** variant (`SYSTEM: Returning explorer detected…`). Still cinematic, no repetition fatigue (Doc 8 risk matrix).

---

## 4. THE UNIVERSE MAP — AMBIENT MOTION
### *Implements [`2_story` Act 3](2_story_experience.md) · R3F*

The map is *never the same screenshot twice* (M4 ambient layer).

### 4.1 Persistent Ambient Motion

| Element | Motion | Spec |
|---|---|---|
| Starfield (`<Stars>`) | slow drift + twinkle | linear, ~0.5°/s rotation, per-star opacity sine |
| Realm orbs | axial spin | 8–12rpm, **each unique** (never align identically) |
| Realm orbs | orbital drift | full orbit 60–90s, each unique speed |
| Core hub | radiate (no spin) | corona pulse 0.8Hz, steady — it is gravity, not motion |
| Ambient dust | float | 2,000 `InstancedMesh` particles, lazy elliptical drift |
| NEXUS anchor | float | `<Float>` speed 1.5, per [Doc 3](3_ai_companion_design.md) |

### 4.2 The Orbital Alignment *(Micro-moment #3)*
Once every ~3 real hours, all 6 orbs align into a perfect hexagon for ~40s. Implemented as a phase check in `useFrame`; on alignment, NEXUS whispers once. No fanfare — a reward for *being there* (M4).

### 4.3 Parallax & Depth
Three depth planes ([`2_story` 3.1](2_story_experience.md), [Doc 5 §5](5_ui_ux_system.md)) parallax on pointer move: far plane translates `±8px`, mid `±20px`, near (chrome) fixed. Damped (lerp 0.06) so it glides, never snaps (M2). Gyroscope-driven on mobile (with permission).

### 4.4 Realm Hover *(implements [`2_story` 3.2](2_story_experience.md))*
On cursor within orb's 120px radius:
- Orb rotation slows 50% (`--duration-mid`)
- Camera zooms toward it +5% over 300ms
- Surface animation intensifies (neural lines pulse faster, honeycomb rotates defensively)
- Info card: `scale(.8)→1` + `opacity 0→1`, 200ms `--ease-enter`
- Custom cursor already realm-swapped ([Doc 5 §6.2](5_ui_ux_system.md))

---

## 5. REALM TRAVEL — THE TRANSITION CHOREOGRAPHY
### *Implements [`2_story` 3.3 & 4.1](2_story_experience.md) · GSAP → Router → Framer Motion*

The 1.2s journey from map to realm — the universe's signature transition, and the "ride the network" moment ([`4_cs_worlds` Network Pathways](4_cs_worlds.md): the visitor *is a packet*).

### 5.1 The Travel Timeline

| t (ms) | Event | Property animated |
|---|---|---|
| 0 | Selected orb core flash | `opacity`, `filter:brightness` |
| 100 | Camera accelerates toward orb | R3F camera `position` (z), `--ease-in-cubic` |
| 100→500 | Hyperspace streak | stars stretch (vertex shader), other orbs blur+fade `opacity` |
| 500 | Orb surface fills viewport | camera z, scale |
| 800 | Lens-flare brightness peak | full-screen `opacity` flash |
| 800 | **Router.push(realm)** | Next.js navigation fires under the flash |
| 1000 | Realm interior fades in | Framer `AnimatePresence` enter, `--ease-enter` |
| 1000→1200 | Realm arrival cinematic begins | per-realm (R3F) |
| 1200 | Ambient score crossfades | Web Audio gain ramp |

### 5.2 The Three-System Handshake
```
GSAP   → owns the EXIT (map dissolve, hyperspace, flash)         [0–800ms]
Router → fires at the flash peak (navigation hidden by brightness)[800ms]
Framer → owns the ENTER (realm content AnimatePresence)          [1000–1200ms]
R3F    → owns the realm arrival cinematic                        [1200ms+]
```
The flash at 800ms is the *cover* — the router swap is invisible because the screen is pure white at that instant (M5 seamlessness). On unmount, the previous realm's R3F scene calls `dispose()` (Doc 8, GPU memory).

### 5.3 The Legacy Archive Exception
Per [`4_cs_worlds` §9](4_cs_worlds.md): traveling to Legacy does **not** hyperspace. Instead the modern palette *desaturates to sepia/silver-grey* over `--duration-cinematic`, score softens to a music-box echo, camera drifts gently. The visitor steps *backward in time*, not flies to a planet (a deliberate break in M5 that signals "this place is different").

### 5.4 Per-Realm Arrival Cinematics *(3s each, from [`4_cs_worlds`](4_cs_worlds.md))*

| Realm | Arrival motion |
|---|---|
| Silicon Foundry | Camera descends *through* strata; continent-motherboard ignites trace-by-trace underfoot |
| Code Helix | Glass city *builds itself* upward; Helix unspools overhead; syntax rains upward into walls |
| Neural Nebula | Rise *into* the network; nodes ignite in a forward-pass wave; one inference ripple, realm exhales |
| The Citadel | Descend through firewall layers, each scans+clears; final wall opens to green war-room |
| Data Archives | Materialize in the dome; data pours from above, crystallizes into walkable charts below |
| Soul Quarter | Color floods from everywhere; aurora ribbons resolve into playful forms, won't settle |

---

## 6. CONTENT & SCROLL INTERACTIONS
### *Inside realms (document mode) · GSAP ScrollTrigger + Framer Motion*

### 6.1 Scroll-Triggered Reveals
Content sections animate in on scroll-into-view:
- **Spec:** `opacity 0→1`, `translateY(24px→0)`, 600ms `--ease-enter`, stagger 80ms between siblings.
- **Trigger:** ScrollTrigger at 80% viewport; fires once (no re-animate on scroll-up — M4, not attention-seeking).
- **Init:** inside `useLayoutEffect` + `ScrollTrigger.refresh()` post-hydration (Doc 8 risk matrix — avoids hydration fights).

### 6.2 The Layer Descent *(the 3 depth layers — [`2_story` 4.2](2_story_experience.md))*
Going from Surface → Interior → Archive is *spatial*, not a scroll: the camera/content "walks deeper." Each descent is a `--duration-slow` push with a subtle vignette closing in — the visitor feels they're going *into* something.

### 6.3 The Archive Whisper *(Micro-moment #6)*
On entering a realm's deepest archive layer: ambient music drops to near-silence, a single piano note every 8s, motion slows globally by 30% (a `--time-scale` multiplier on ambient loops). "You are in the rarest part of this place. Slow down."

### 6.4 Number Counters
Stats and the "847 architectural decisions" count animate via GSAP `CountTo`, `--ease-boot`, tabular-nums ([Doc 5 §3.3](5_ui_ux_system.md)) so digits don't reflow.

### 6.5 Skill Tree Animation *(RPG knowledge — [Doc 5 §7.7](5_ui_ux_system.md))*
- Nodes fade+scale in sequentially (stagger 60ms).
- Connection lines *draw* via SVG `stroke-dashoffset` animation, 400ms each, cascading from root.
- Expand on click: sub-nodes unfold (`scale .7→1`, stagger), related project crystals surface.
- Keyboard: focus a node, `Enter` expands with the same motion (M6 parity).

---

## 7. NEXUS — THE LIVING ANIMATION SYSTEM
### *Implements [`3_ai_companion` §3.3, §6](3_ai_companion_design.md) · R3F + GSAP*

NEXUS is the most-animated entity in the universe. Its motion *is* its personality.

### 7.1 The Five Animation States

| State | Geometry | Nucleus | Aura | Duration |
|---|---|---|---|---|
| **IDLE** | slow morph (icosa→dodeca→octa→tetra, 8s ease-in-out-cubic), 3rpm rotate | pulse 0.8Hz | lazy elliptical drift, ~200 particles | loops |
| **SPEAKING** | size 1.4×, rapid morphs synced to "speech rhythm" | +30% brightness | accelerate, organize to content | per line |
| **THINKING** | size 0.85×, rotation → near-zero | dim + flicker | 3 particles tight orbit (processing) | 1.5–4s |
| **ALERT** | snaps to fixed icosahedron, hard angular lock | flashes 2× @200ms | freeze then scatter outward | instant |
| **EXCITED** | size pulse 1.0→1.6→1.0 in 400ms, multi-morph | max brightness | starburst spiral outward | 400ms |

> Geometry morphing via vertex interpolation across the 4 platonic solids (Doc 3 §8.2). Mode-driven from Zustand `nexusState`; R3F picks up state as prop changes (Doc 8).

### 7.2 State Triggers

| Trigger | → State |
|---|---|
| Dialogue line typing | SPEAKING |
| Awaiting a response / 1.5–4s before reply | THINKING |
| Entering The Citadel / security content | ALERT → settles to IDLE (CYBER mode) |
| Easter egg found / journey complete | EXCITED |
| No activity | IDLE |

### 7.3 The Color Bleed *(realm-reactive — [`3_ai_companion` §3.2](3_ai_companion_design.md))*
NEXUS never *cuts* color. On entering a realm, its palette **bleeds** to `--realm-primary` over **1200ms** gradient morph, nucleus transitioning *last* (like a heart adapting to pressure). Implemented with `@property`-registered color custom properties so the GPU interpolates hexes natively — the same mechanism that re-themes the chrome ([Doc 5 §2.5](5_ui_ux_system.md)), kept in sync so NEXUS and the world change together.

### 7.4 Scroll-Velocity Reactions *(behavioral animation — [`3_ai_companion` §6.2](3_ai_companion_design.md))*
NEXUS watches scroll velocity (px/s, 500ms rolling avg, Doc 3 §8.3) and animates accordingly:

| Velocity | NEXUS motion |
|---|---|
| < 50px/s (meditating) | expands slightly, opens deeper lore |
| 50–200 (reading) | IDLE, satisfied |
| 200–600 (scanning) | surfaces nav shortcuts |
| > 600 (rushing, 3s) | "slow down" dialogue, gentle deceleration gesture |
| stationary > 15s | offers one specific insight (then respects silence — Micro-moment #4) |

### 7.5 The Mode Personalities In Motion
Each of NEXUS's four *personality* modes ([`3_ai_companion` §4](3_ai_companion_design.md)) has a motion signature layered over the animation states:
- **ARCHITECT** — measured, smooth, elegant rotations
- **CYBER** — sharp, angular, snaps to hard forms, shorter motions
- **QUEST** — quick, joyful, bouncy, rainbow trails (Soul Quarter)
- **MENTOR** — slow, deliberate, lots of THINKING pauses (Socratic beats)

### 7.6 NEXUS Says Goodbye *(Micro-moment #9)*
After contact transmission: NEXUS shrinks, dims, becomes a single point of light, drifts up and off-screen, blinks **exactly twice**, gone. Not deleted — *departed*. The most emotionally engineered 3 seconds in the universe.

---

## 8. THE MICRO-INTERACTION LIBRARY
### *CSS transitions — instant, zero JS bundle cost ([Doc 8 matrix](8_technical_feasibility.md))*

Every small gesture, specified once, reused everywhere (M5).

| Interaction | Spec |
|---|---|
| **Button hover** | `transform: scale(1.02)`, `--glow-rest`→`--glow-hover`, 150ms `--ease-universe` |
| **Button press** | `scale(0.98)`, glow intensifies, 100ms |
| **Card hover** | `translateY(-4px) scale(1.01)`, elevation `--elev-2`→`--elev-3`, 350ms |
| **Skill crystal hover** | facet shimmer (hue-rotate sweep), ability card fades in 200ms |
| **Link hover** | underline grows via `background-size: 0→100%` (no layout shift) |
| **Toggle (audio)** | knob slides `transform: translateX`, track color cross-fades 150ms |
| **Input focus** | border → `--realm-primary`, glow ring expands 150ms, label floats up |
| **Cursor swap** | realm cursor on `data-realm` change, instant |
| **Icon activate** | `drop-shadow` glow appears, slight `scale(1.1)` 150ms |
| **Tab title farewell** *(Micro-moment #10)* | on `visibilitychange`/`beforeunload`: title → `[ CODEX INFINITUM · Come back soon ]` for 2s |

---

## 9. PROJECT DISCOVERY ANIMATION
### *Implements [`2_story` 5.2](2_story_experience.md) · GSAP + R3F*

When a visitor opens a blueprint case in the Invention Archive:

| t | Event | Spec |
|---|---|---|
| 0 | Case unseals | mechanical *hiss* SFX, steam/vent ring animation around seam |
| 0→600ms | Blueprints unfurl | cyan lines draw outward in all directions, like a technical drawing at 10× speed (SVG stroke-dashoffset) |
| 600ms | Project form assembles | 3D conceptual model materializes (R3F) — *VisiRoD:* device + live GPS pins + role-hierarchy tree; *CommentFellows:* neural interface + social nodes + pulsing Gemini core |
| last | Name engraves | letter-by-letter "carved in light", `--ease-enter` |

The VisiRoD GPS pins *pulse live* (Micro-moment #7) — real geographic markers, communicating scale silently.

---

## 10. EASTER EGG & SECRET ANIMATIONS
### *Implements [`2_story` Easter Eggs](2_story_experience.md)*

| Egg | Trigger | Animation |
|---|---|---|
| **Origin Realm** | Konami code on map | hidden 7th node fades in with a unique chime; timeline unfurls |
| **Late Night Mode** | 12–3am local | stars brighten 20% (gradual gain over 2s), NEXUS dims warmly |
| **5-World Badge** | all 6 realms in one session | EXCITED NEXUS + achievement toast slide-in |
| **Hidden Poem** | click Core silhouette 5× | poem fades in, void darkens around it, music drops to solo piano |
| **Certification `G`** | hover 3 Google certs in sequence | constellation lines draw between them forming a `G` (stroke-dashoffset) |
| **`sudo enter` terminal** | type anywhere | terminal slides up from bottom, boot-style typewriter |

All triggers have keyboard equivalents (Doc 8 risk matrix); all animations honor reduced-motion (§14).

---

## 11. SOUND DESIGN SYSTEM
### *Consolidated from [`2_story`](2_story_experience.md) & [`3_ai_companion` §8.4](3_ai_companion_design.md) · Web Audio API*

**Consent-first, off by default.** A persistent toggle lives in the status bar ([Doc 5 §4.3](5_ui_ux_system.md)). Sound is an *enhancement*; the universe is fully meaningful silent (M6).

### 11.1 Ambient Layers
| Layer | Sound | Level |
|---|---|---|
| Pre-boot hum | subsonic server-room hum | -40dB, felt not heard |
| Power-button invitation | warm synth swell, unresolved | -20dB |
| Universe score | layered synth pads, subtle arps | ambient bed |
| Per-realm score | unique per realm, crossfades on travel | ambient bed |
| Archive whisper | single piano note / 8s | sparse |

### 11.2 Event Sounds
| Event | Sound |
|---|---|
| Power click | the "$40k door-thunk" — deep, resonant, final + 50ms silence |
| Hover (button) | hum pitch-shifts up a perfect fifth, 200ms |
| Realm travel | rising cinematic swell → crossfade to realm score |
| Case unseal | pressurized hiss |
| Transmission sent | radio-broadcast sweep |

### 11.3 NEXUS Audio Presence *(from [`3_ai_companion` §8.4](3_ai_companion_design.md))*
| State | Sound |
|---|---|
| IDLE | 40Hz sub-bass @0.8Hz (heartbeat) |
| SPEAKING | F#2 layered sine undertone |
| ALERT | single 880Hz burst, 200ms, -20dB |
| EXCITED | ascending glissando C2→C4, 400ms |

All audio: accessible-fallback compliant, never autoplay, never required.

---

## 12. AMBIENT "LIVING" DETAILS
### *The micro-moments that make it a world, not a site ([`2_story` Micro-Story Moments](2_story_experience.md))*

| Detail | Motion |
|---|---|
| **Breathing grid** | circuit grid pulse synced to Web Audio ambient levels (listens to the room) |
| **Boot typo** | self-correcting `initalizing → initializing` |
| **Orbital alignment** | hexagon every ~3h, 40s window |
| **NEXUS patience** | one "still thinking?" line at 15s idle, never repeated |
| **Cursor-by-realm** | 6 distinct cursors, swap on realm change |
| **The footprint** | a new light appears on the map after transmission — the visitor's mark |
| **Goodbye blink** | NEXUS's two-blink departure |

These are **M4 incarnate**: discovered, never advertised. Most visitors miss them. The ones who don't, remember forever.

---

## 13. ANIMATION IMPLEMENTATION MATRIX
### *Which tool for which job ([Doc 8](8_technical_feasibility.md))*

| Scenario | Tool | Why |
|---|---|---|
| Boot sequence (timed, precise) | **GSAP Timeline** | frame-perfect sequencing + callbacks |
| Realm travel / world transition | **GSAP + clip-path** + Framer entrance | complex morph not possible in CSS |
| NEXUS mode/state changes | **GSAP → R3F uniforms** | targets Three.js objects, not DOM |
| Realm ambient (orbits, particles) | **R3F `useFrame`** | per-frame 3D, instanced |
| Page enter/exit (realm routes) | **Framer `AnimatePresence`** | natural with React routing |
| Hover glows, button states | **CSS `@keyframes` / transitions** | GPU-composited, zero JS |
| Scroll reveals | **GSAP ScrollTrigger** | precise scroll binding |
| Number counters | **GSAP CountTo** | smooth, controllable easing |
| Color/theme bleed | **`@property` + CSS** | native hex interpolation |
| Micro-interactions | **CSS transitions** | instant, no bundle cost |

**Clock discipline (M5, no jank):** GSAP and R3F share one ticker (`gsap.ticker` drives R3F's `useFrame` where they interact) — never two competing `requestAnimationFrame` loops.

---

## 14. THE REDUCED-MOTION CONTRACT
### *Law Ⅸ & [Doc 5 §9.2](5_ui_ux_system.md) — motion is enhancement, never dependency*

When `prefers-reduced-motion: reduce` is detected (also exposed as Zustand `prefersReducedMotion` and a manual in-universe toggle):

| Full Motion | Reduced-Motion Equivalent |
|---|---|
| Boot cinematic (22s) | instant static title card: "CODEX INFINITUM — online" |
| Realm travel hyperspace | simple 200ms cross-fade |
| Orbital drift / spin | **frozen** at curated positions (still beautiful, still readable) |
| Prismatic hue-rotation | frozen at `280deg` |
| Parallax | disabled |
| Particle systems | static or removed; CSS dots only |
| NEXUS idle morph/float | gentle opacity pulse only; no geometry churn |
| Scroll reveals | appear instantly, no translate |
| Number counters | show final value immediately |
| Easter-egg flourishes | reduced to instant state change + toast |

**The invariant:** *every piece of content and every interaction remains 100% reachable.* Nothing is gated behind an animation. The reduced-motion universe is calmer, not lesser — and it loads even faster.

> Token-level enforcement: under reduced-motion, [Doc 5's](5_ui_ux_system.md) duration tokens collapse to `0ms`, so any CSS transition referencing them becomes instant automatically. GSAP/R3F check the flag and swap to static branches.

---

## 15. ANIMATION PERFORMANCE BUDGET
### *Law Ⅶ — performance is part of the art ([Doc 8](8_technical_feasibility.md))*

| Rule | Enforcement |
|---|---|
| **Transform & opacity only** | lint/review: no animated `width/height/top/left/margin` |
| **`will-change` sparingly** | applied only mid-animation, removed on complete |
| **No JS in paint** | GSAP targets CSS vars / transforms, never `el.style.width` in RAF |
| **Pause off-screen** | IntersectionObserver pauses all non-visible animations |
| **Idle enhancement** | particle systems / shaders load on `requestIdleCallback` |
| **Tier budgets** | particles 1.0 / 0.5 / 0 by device tier ([Doc 5 §8.2](5_ui_ux_system.md), Doc 8) |
| **Frame target** | 60fps Tier 1–2; Tier 3 prioritizes content over motion |
| **`dpr={[1,2]}`** | cap pixel ratio so high-DPI doesn't render 3× |

Every animation is profiled in Phase 4's Lighthouse pass (Doc 8). An effect that drops frames is cut or simplified — *a universe that lags is a universe that lies* (Law Ⅶ).

---

## APPENDIX — THE MOTION SYSTEM AT A GLANCE

| Layer | Decision |
|---|---|
| **Easing** | 5 curves; `--ease-universe` is the voice |
| **Duration** | 4 steps; faster when caused, slower when earned |
| **Boot** | GSAP timeline → R3F particle handoff at t≈21s |
| **Map** | never-repeating orbital ambient; pointer parallax |
| **Travel** | 1.2s GSAP-exit → router@flash → Framer-enter |
| **NEXUS** | 5 animation states × 4 personality modes; 1.2s color bleed |
| **Micro** | CSS-only, one spec per gesture, reused everywhere |
| **Sound** | consent-first, off by default, fully optional |
| **A11y** | full reduced-motion contract; content never gated by motion |
| **Perf** | transform/opacity only; 60fps; off-screen paused |

---

## Document Metadata

| Property | Value |
|---|---|
| Document ID | `universe/6_interactions_and_animation` |
| Version | `1.0.0` |
| Status | `CANONICAL — Motion Bible` |
| Author | CODEX INFINITUM Creative Team |
| Date | 2026-06-22 |
| Depends on | [`2_story_experience.md`](2_story_experience.md), [`3_ai_companion_design.md`](3_ai_companion_design.md), [`4_cs_worlds.md`](4_cs_worlds.md), [`5_ui_ux_system.md`](5_ui_ux_system.md) |
| Feeds into | [`7_project_archive_system.md`](7_project_archive_system.md), [`8_technical_feasibility.md`](8_technical_feasibility.md) |

---

> *"Anyone can make a thing move. The art is in making it move like it means something — like it has mass, and memory, and a reason. This document is how the universe earns the right to be called alive."*
> — The Architect's Motion Bible, CODEX INFINITUM
