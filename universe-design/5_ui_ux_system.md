# 5 · THE UI/UX SYSTEM
## The Visual Constitution of CODEX INFINITUM — Design System & Component Bible

> *"A universe is not held together by gravity. It is held together by consistency. Every star obeys the same physics, or it is not the same sky."*

---

## Document Purpose

This is the **single source of visual truth** for CODEX INFINITUM. Where [`1_world_concept.md`](1_world_concept.md) wrote the cosmology, [`4_cs_worlds.md`](4_cs_worlds.md) drew the map, and [`2_story_experience.md`](2_story_experience.md) scored the journey — this document defines the *materials* the universe is built from: every color token, every typeface, every spacing unit, every component, every state, every responsive breakpoint, every accessibility guarantee.

It exists so that any engineer — including the Architect himself, six months from now — can build any screen of this universe without inventing a single value. If a number is not in this document, it does not belong in the product.

**Canon authority:** This document adopts the canonical realm palette established in [`4_cs_worlds.md` §14.4](4_cs_worlds.md) as the authoritative token set. Where [`8_technical_feasibility.md`](8_technical_feasibility.md) used provisional color hexes (e.g. `--realm-neural: #00d4ff`) and provisional route slugs, **this document supersedes them** — see [Appendix A: Reconciliation](#appendix-a--reconciliation-with-doc-8). NEXUS's visual identity follows [`3_ai_companion_design.md`](3_ai_companion_design.md) exactly.

---

## 1. THE DESIGN PRINCIPLES

Ten Universe Laws ([`1_world_concept.md` §4](1_world_concept.md)) govern the soul. These six principles translate them into design decisions you can *measure*.

### P1 — Darkness Is the Canvas *(Law Ⅳ)*
The void is not a background color. It is the medium that makes every glowing element *matter*. Nothing is placed on white. Significance is communicated by light emerging from dark. The default state of any pixel is `--void`.

### P2 — Light Is Meaning, Not Decoration *(Law Ⅱ)*
Glow is reserved for things that are *real* — interactive, important, alive. A static decorative glow is forbidden. If something glows, the visitor must be able to ask "what is that?" and get a real answer.

### P3 — One Realm, One Color Identity *(Doc 4 Color Discipline)*
Each realm owns a color. The entire chrome of the experience re-themes when the visitor enters a realm — propagated through a single CSS custom property (`--realm-active`). The visitor should be able to identify where they are with their eyes closed to detail, by hue alone.

### P4 — Depth Is Honest *(Law Ⅰ)*
The z-axis is not faked with drop-shadows alone. Layering, parallax, blur-by-distance, and scale-by-proximity all reinforce a *consistent* spatial model. Near is sharp, bright, large. Far is dim, blurred, small. This rule never breaks.

### P5 — Performance Is a Visual Feature *(Law Ⅶ)*
No component may animate a layout property. Every value in this system is chosen to be expressible in `transform`, `opacity`, `filter`, or a compositor-friendly custom property. A design that cannot run at 60fps is not in this design system.

### P6 — The Universe Breathes *(Law Ⅹ)*
Whitespace (void-space) is phrasing. Components are given room. Motion has rests. Nothing is crowded, because in a universe, the distance between stars is part of the beauty.

---

## 2. THE COLOR SYSTEM

### 2.1 Foundation — The Void Palette

The substrate every realm is painted onto. These are the only "neutral" colors in the universe.

| Token | Hex | Role |
|---|---|---|
| `--void` | `#050508` | The deepest background. Scene base. ([`2_story` Scene 1.1](2_story_experience.md)) |
| `--void-deep` | `#000008` | The starfield abyss, behind all depth planes |
| `--surface-1` | `#0B0B12` | Raised panels, cards at rest |
| `--surface-2` | `#13131D` | Elevated panels, modals, the NEXUS dialogue panel |
| `--surface-3` | `#1C1C28` | Highest elevation, focused/active surfaces |
| `--hairline` | `rgba(255,255,255,0.08)` | 1px borders, dividers, grid lines |
| `--hairline-strong` | `rgba(255,255,255,0.16)` | Borders on hover/focus |

### 2.2 Text On Void

| Token | Hex / Value | Contrast on `--void` | Use |
|---|---|---|---|
| `--text-primary` | `#E8EAF0` | 15.8:1 (AAA) | Headings, body, anything read closely |
| `--text-secondary` | `#A6ACBE` | 8.1:1 (AAA) | Supporting text, metadata, captions |
| `--text-dim` | `#64748B` | 4.6:1 (AA) | Labels, timestamps, de-emphasized UI |
| `--text-glow` | `#FFFFFF` | 21:1 | Peak emphasis, the brightest moment of a line |

> All three primary text tokens clear WCAG **AA** at body sizes; the top two clear **AAA**. `--text-dim` is restricted to text ≥ 14px or non-essential labels.

### 2.3 The Canonical Realm Palette *(authoritative — from [Doc 4 §14.4](4_cs_worlds.md))*

This is the master table. Every realm theme is built from exactly these values. No realm introduces a color not listed here.

| Realm | `--realm-primary` | `--realm-secondary` | `--realm-accent` |
|---|---|---|---|
| **Architect's Core** | `#FBBF24` | `#F59E0B` | — |
| **Silicon Foundry** | `#F59E0B` | `#B45309` | solder-white `#FFF7E6` |
| **The Foundations** | `#EAB308` | `#F1F5F9` | `#DC2626` |
| **Code Helix** | `#7C3AED` | `#8B5CF6` | `#22C55E` |
| **Neural Nebula** | `#3B82F6` | `#06B6D4` | `#8B5CF6` |
| **The Citadel** | `#EF4444` | `#1F2937` | `#22C55E` |
| **Data Archives** | `#7DD3FC` | `#F8FAFC` | `#F59E0B` |
| **Soul Quarter** | prismatic* | aurora gradient* | — |
| **Founders' Constellation** | `#B08D57` | `#F8FAFC` | `#67E8F9` |
| **The Observatory** | `#312E81` | `#F8FAFC` | — |
| **Legacy Archive** | `#78350F` | `#6B7280` | `#92400E` |
| **The Kernel** | `#94A3B8` | `#22D3EE` | — |
| **Network Pathways** | `#0D9488` | `#EA580C` | — |
| **Cloud Expanse** | `#38BDF8` | `#FFFFFF` | — |
| **Invention Archive** | `#00F5FF` | blueprint `#1E3A5F` | — |

> *\*Soul Quarter is the one realm with no fixed primary. It uses an animated `conic-gradient` / hue-rotating spectrum — see [§2.6](#26-the-soul-quarter-exception).*

### 2.4 Semantic / Functional Colors

Independent of realm. These mean the same thing everywhere in the universe.

| Token | Hex | Meaning |
|---|---|---|
| `--ok` | `#22C55E` | Success, "ONLINE", verified, complete |
| `--warn` | `#F59E0B` | Soft warnings, validation prompts (NEXUS amber, [`2_story` 6.2](2_story_experience.md)) |
| `--danger` | `#EF4444` | Threat, error, redaction bars |
| `--info` | `#38BDF8` | Neutral system messages |
| `--signal` | `#00F5FF` | The universe's "interactive" cyan — power button, transmit, "press me" |

> `--signal` (`#00F5FF`) is the **universal affordance color**: it appears wherever an element is the primary interactive target outside a themed realm (the power button, the TRANSMIT button, the boot accents). Inside a realm, the primary affordance shifts to `--realm-primary`.

### 2.5 Realm Theming Mechanism

The entire chrome re-themes via a single attribute on `<body>` (or the universe shell layout). One property cascades everywhere.

```css
/* tokens.css — realm theme switch */
[data-realm="architect-core"]   { --realm-primary:#FBBF24; --realm-secondary:#F59E0B; --realm-accent:#FBBF24; }
[data-realm="silicon-foundry"]  { --realm-primary:#F59E0B; --realm-secondary:#B45309; --realm-accent:#FFF7E6; }
[data-realm="the-foundations"]  { --realm-primary:#EAB308; --realm-secondary:#F1F5F9; --realm-accent:#DC2626; }
[data-realm="code-helix"]       { --realm-primary:#7C3AED; --realm-secondary:#8B5CF6; --realm-accent:#22C55E; }
[data-realm="neural-nebula"]    { --realm-primary:#3B82F6; --realm-secondary:#06B6D4; --realm-accent:#8B5CF6; }
[data-realm="the-citadel"]      { --realm-primary:#EF4444; --realm-secondary:#1F2937; --realm-accent:#22C55E; }
[data-realm="data-archives"]    { --realm-primary:#7DD3FC; --realm-secondary:#F8FAFC; --realm-accent:#F59E0B; }
[data-realm="soul-quarter"]     { --realm-primary:var(--prismatic); --realm-secondary:var(--aurora); }
[data-realm="founders-constellation"] { --realm-primary:#B08D57; --realm-secondary:#F8FAFC; --realm-accent:#67E8F9; }
[data-realm="the-observatory"]  { --realm-primary:#312E81; --realm-secondary:#F8FAFC; }
[data-realm="legacy-archive"]   { --realm-primary:#78350F; --realm-secondary:#6B7280; --realm-accent:#92400E; }
[data-realm="the-kernel"]       { --realm-primary:#94A3B8; --realm-secondary:#22D3EE; }

/* Derived glow tints — computed once, used everywhere */
:root {
  --realm-glow:      color-mix(in srgb, var(--realm-primary) 60%, transparent);
  --realm-glow-soft: color-mix(in srgb, var(--realm-primary) 24%, transparent);
  --realm-wash:      color-mix(in srgb, var(--realm-primary) 8%,  var(--void));
}
```

> **Transition rule:** when `data-realm` changes, the custom properties cross-fade over **1200ms** (matching NEXUS's color-bleed in [`3_ai_companion` §3.2](3_ai_companion_design.md)). This is handled by `@property` registered custom properties so the browser can interpolate the hex values natively. See [`6_interactions_and_animation.md` §7.3](6_interactions_and_animation.md).

### 2.6 The Soul Quarter Exception

The only realm without a fixed hue. Its primary is a slowly hue-rotating spectrum, the secondary an aurora gradient.

```css
@property --prismatic-hue { syntax:'<angle>'; inherits:true; initial-value:0deg; }
[data-realm="soul-quarter"] {
  --prismatic: hsl(var(--prismatic-hue) 90% 62%);
  --aurora: linear-gradient(120deg,
            hsl(var(--prismatic-hue) 90% 62%),
            hsl(calc(var(--prismatic-hue) + 90deg) 85% 60%),
            hsl(calc(var(--prismatic-hue) + 200deg) 88% 64%));
  animation: prismatic-drift 18s linear infinite;
}
@keyframes prismatic-drift { to { --prismatic-hue:360deg; } }
```

> Disabled under `prefers-reduced-motion` — the hue freezes at a curated value (`280deg`, a calm violet-magenta).

---

## 3. TYPOGRAPHY

### 3.1 The Three Voices *(from [Doc 8 font stack](8_technical_feasibility.md))*

| Role | Family | Token | Personality |
|---|---|---|---|
| **Display** | Orbitron | `--font-display` | The universe's voice — titles, realm names, NEXUS's name. Geometric, futuristic, confident. |
| **Mono** | JetBrains Mono | `--font-mono` | The machine's voice — boot sequence, terminal, code, mission console, classification codes. |
| **Body** | Inter | `--font-body` | The human voice — all prose, project stories, the "WHAT I LEARNED" reflections. Warm, legible, honest. |

```css
:root {
  --font-display: 'Orbitron', 'Space Grotesk', sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  --font-body:    'Inter', system-ui, -apple-system, sans-serif;
}
```

> Loaded via `next/font` with `display:swap`, subsetted to Latin, Display preloaded as critical. Zero layout shift (CLS budget < 0.1, [Doc 8](8_technical_feasibility.md)).

### 3.2 The Type Scale

A modular scale, ratio **1.250 (major third)**, base **16px**. Expressed in `rem`. Fluid headings clamp between mobile and desktop.

| Token | Size (rem) | px @16 | Line-height | Family | Use |
|---|---|---|---|---|---|
| `--fs-display` | `clamp(2.99, 6vw, 4.77)` | 48→76 | 1.05 | Display | Realm arrival titles, hero |
| `--fs-h1` | `clamp(2.44, 4vw, 3.05)` | 39→49 | 1.1 | Display | Section heads |
| `--fs-h2` | `1.95` | 31 | 1.15 | Display | Sub-sections |
| `--fs-h3` | `1.56` | 25 | 1.2 | Display / Body | Card titles |
| `--fs-lg` | `1.25` | 20 | 1.4 | Body | Lead paragraphs, NEXUS dialogue |
| `--fs-base` | `1.0` | 16 | 1.6 | Body | Body copy |
| `--fs-sm` | `0.8` | 13 | 1.5 | Body / Mono | Metadata, captions |
| `--fs-xs` | `0.64` | 10 | 1.4 | Mono | Labels, classification codes, status bars |

### 3.3 Typographic Treatments

- **Display tracking:** Orbitron headings use `letter-spacing: 0.02em`; the boot/terminal mono uses `0.3em` for that "system readout" feel ([`2_story` 1.2](2_story_experience.md)).
- **Mono labels** are `text-transform: uppercase`, `--fs-xs`, `--text-dim`, e.g. `[ ENTER REALM ]`, `STATUS: DEPLOYED`.
- **The glow word:** within a heading, a single word may be elevated to `--text-glow` with `text-shadow: 0 0 24px var(--realm-glow)` — used sparingly, once per heading max (P2).
- **Numerals:** tabular figures (`font-variant-numeric: tabular-nums`) for all stats, timestamps, and counters so they don't jitter when animating.

### 3.4 Readability Guardrails
- Body measure: max `68ch`. Prose never spans the full void.
- Minimum body size: 16px, never smaller for reading content.
- Line-height never below 1.5 for paragraphs.

---

## 4. SPACING, GRID & LAYOUT

### 4.1 The Spacing Scale *(8px base, geometric)*

```css
:root {
  --space-2xs: 0.25rem;  /* 4  */
  --space-xs:  0.5rem;   /* 8  */
  --space-sm:  0.75rem;  /* 12 */
  --space-md:  1rem;     /* 16 */
  --space-lg:  1.5rem;   /* 24 */
  --space-xl:  2.5rem;   /* 40 */
  --space-2xl: 4rem;     /* 64 */
  --space-3xl: 6.5rem;   /* 104 */
  --space-4xl: 10rem;    /* 160 — inter-section "void breathing room" */
}
```

### 4.2 The Layout Grid

Two grid modes, because the universe has two natures:

**Spatial mode (universe map, realm interiors):** Full-bleed canvas. No grid. Position is governed by the 3D scene and the [depth-plane model](#5-depth-elevation--the-z-axis). UI chrome floats over it.

**Document mode (project dossiers, deep archives, contact):** A 12-column grid for readable content laid over the void.

| Property | Value |
|---|---|
| Max content width | `1200px` (`--container`) |
| Columns | 12 |
| Gutter | `--space-lg` (24px) desktop / `--space-md` mobile |
| Outer margin | `clamp(--space-md, 5vw, --space-3xl)` |
| Reading column | spans 8 of 12, centered (≈ `680px`) |

### 4.3 Layout Anatomy of the Universe Shell

Per [`8_technical_feasibility` route architecture](8_technical_feasibility.md), a persistent shell wraps every realm:

```
┌────────────────────────────────────────────────────────┐
│  ◷ STATUS BAR  (mono, --fs-xs, fixed top, --surface-1)  │ z: chrome
│  ── realm name · signal strength · audio toggle · time  │
├────────────────────────────────────────────────────────┤
│                                                          │
│                  REALM CONTENT / CANVAS                  │ z: world
│                   (spatial or document)                  │
│                                                          │
│                                            ┌───────────┐ │
│                                            │  NEXUS    │ │ z: companion
│  ◉ COMPASS (return-to-map, lower-left)     │  (lower-  │ │
│                                            │   right)  │ │
└────────────────────────────────────────────┴───────────┘
```

- **Status bar:** persistent, mono, always shows current realm + the audio consent toggle.
- **Compass (lower-left):** always returns to the universe map — the visitor is never lost (P4, NEXUS never hand-holds but the way home is always visible).
- **NEXUS (lower-right):** per [`3_ai_companion` §3.4](3_ai_companion_design.md), 48px at rest, drifts but never obscures content.

---

## 5. DEPTH, ELEVATION & THE Z-AXIS

The universe is spatial. Elevation is not just shadow — it is the consistent depth model from [`2_story` 3.1](2_story_experience.md).

### 5.1 The Depth Planes

| Plane | Name | Contents | Visual treatment |
|---|---|---|---|
| **-2** | Abyss | Starfield, `--void-deep` | Slow drift, 70% opacity, 2px blur |
| **-1** | Far field | Distant realm orbs, fog | Scale 0.7, blur 1px, dimmed |
| **0** | Stage | The focused realm / content | Sharp, full color, full scale |
| **+1** | Near UI | Cards, dossiers, terminals | `--surface` + glow border |
| **+2** | Chrome | Status bar, compass, info cards | Crisp, `backdrop-filter` glass |
| **+3** | Companion | NEXUS | Always on top, `z-index:9999` |
| **+4** | Overlay | Modals, boot sequence, transitions | Full attention, dims everything behind |

### 5.2 The Z-Index Token Ladder

```css
:root {
  --z-abyss:    -20;
  --z-world:      0;
  --z-content:   10;
  --z-chrome:   100;
  --z-nexus:   9999;
  --z-overlay:10000;
  --z-boot:   10001;  /* boot sequence outranks all */
}
```

### 5.3 Elevation = Glow + Blur, Not Drop-Shadow

In a dark universe, things rise by *emitting light*, not by casting shadow (P1). Elevation tokens:

```css
:root {
  /* "shadow" here means a soft outer glow + a depth-defining dark halo */
  --elev-1: 0 2px 8px rgba(0,0,0,0.6);
  --elev-2: 0 8px 24px rgba(0,0,0,0.7), 0 0 0 1px var(--hairline);
  --elev-3: 0 16px 48px rgba(0,0,0,0.8), 0 0 0 1px var(--hairline-strong);
  /* realm-tinted glow for interactive/alive elements */
  --glow-rest:  0 0 24px var(--realm-glow-soft);
  --glow-hover: 0 0 40px var(--realm-glow), 0 0 0 1px var(--realm-primary);
}
```

### 5.4 Glassmorphism — The "Holographic UI" Material

Chrome and info cards are *holographic panels* — light reads through them. This is the universe's signature surface.

```css
.glass {
  background: color-mix(in srgb, var(--surface-2) 72%, transparent);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-lg);
  box-shadow: var(--elev-2), inset 0 1px 0 rgba(255,255,255,0.06);
}
```

> **Tier-3 / fallback:** `backdrop-filter` is replaced by a solid `--surface-2` at 92% opacity on devices that don't support it (Doc 8 graceful degradation). The design never *depends* on the blur for legibility.

### 5.5 Radius & Border Tokens

```css
:root {
  --radius-sm: 6px;    /* chips, badges */
  --radius-md: 10px;   /* buttons, inputs */
  --radius-lg: 16px;   /* cards, panels */
  --radius-xl: 24px;   /* modals, dossiers */
  --radius-full: 999px;/* pills, the power button */
}
```

---

## 6. ICONOGRAPHY, CURSORS & TEXTURE

### 6.1 Icon System
- **Style:** thin-line geometric, 1.5px stroke, 24px grid, rounded joins — reads as "engineered, precise, futuristic."
- **Source:** custom SVG set + Lucide (MIT) as base, recolored with `currentColor` so they inherit realm theming.
- **Glow on active:** active/selected icons gain `filter: drop-shadow(0 0 8px var(--realm-glow))`.

### 6.2 The Realm Cursors *(from [`2_story` Micro-moment #8](2_story_experience.md))*

The cursor *is* a piece of the world. Each realm swaps the custom SVG cursor:

| Context | Cursor |
|---|---|
| Boot / power button | Rotating targeting reticle (`--signal`) |
| Universe map | Default reticle, 0.5rpm rotation |
| Silicon Foundry | Solder-tip / hot iron point |
| Code Helix | Bracket caret `{ }` |
| Neural Nebula | Glowing neural node |
| The Citadel | Crosshair |
| Data Archives | Data-point diamond |
| Soul Quarter | Prismatic brush/stylus |
| Legacy Archive | Old-style I-beam |

> All custom cursors degrade to standard `pointer`/`default` if the SVG fails or `prefers-reduced-motion` is set (the reticle stops rotating but remains).

### 6.3 Texture
- **Circuit grid:** the breathing hex/circuit grid at 3% opacity ([`2_story` 1.1](2_story_experience.md)) is a reusable `--texture-circuit` background layer for empty void areas.
- **Grain:** a 2% film-grain overlay on `--void` prevents banding in gradients on cheap displays.
- **Bloom:** in-canvas (R3F `<Bloom>`), threshold tuned so only elements above ~70% luminance bloom — keeps glow meaningful (P2).

---

## 7. THE COMPONENT LIBRARY

Every component lists: anatomy, states, tokens, and the doc it serves. All are realm-themable via `--realm-primary`.

### 7.1 Power Button *(the universe's first impression — [`2_story` 1.2–1.4](2_story_experience.md))*
- **Anatomy:** 48px circle, `⏻` glyph, `--signal` stroke, soft outer glow.
- **States:**
  - *Rest:* breathing glow, 2.4s cycle (0→12px, 40%→100% opacity).
  - *Proximity (cursor < 80px):* cycle accelerates to 0.8s, core shifts toward white, circuit grid ignites outward, second ring appears rotating 4rpm.
  - *Active (click):* white flash + shockwave ring to viewport edge over 400ms.
- **A11y:** real `<button>`, `aria-label="Initialize CODEX INFINITUM"`, keyboard `Enter`/`Space` triggers identical sequence.

### 7.2 Terminal / Boot Readout
- **Anatomy:** full-bleed `--void`, mono text, character-by-character typewriter (60ms/char), blinking block cursor (1.2s), circuit-frame that lights edge-by-edge.
- **Tokens:** `--font-mono`, `--fs-sm`, `--signal` + `--ok` for `[OK]/✓`.
- **Reusable as:** the `sudo enter` secret terminal ([`1_world_concept` §5 Secrets](1_world_concept.md)) and the returning-visitor express boot.

### 7.3 Realm Orb *(universe map node — [`2_story` 3.2](2_story_experience.md))*
- **Anatomy:** sphere with realm surface texture, axial spin (8–12rpm), orbital drift (60–90s), corona glow in `--realm-primary`.
- **States:** *far* (0.7 scale, blurred, dimmed) → *near* (sharp) → *hover* (rotation −50%, camera zoom +5%, surface animation intensifies, info card appears) → *selected* (core pulse → travel animation).
- **A11y:** each orb is a focusable element with a real name + description; `Enter` navigates. Keyboard users get a list-based nav alternative (see [§9.3](#93-keyboard--focus)).

### 7.4 Info Card *(realm hover preview)*
- **Anatomy:** `.glass` panel, realm icon + name (Display), one-line description (Body), contents meta (mono), `[ ENTER REALM → ]` CTA.
- **Motion:** `scale(0.8)→1` + `opacity 0→1` over 200ms; positions to never overlap the Core hub.

### 7.5 Buttons

| Variant | Use | Style |
|---|---|---|
| **Primary** | Main action (ENTER, TRANSMIT) | filled `--realm-primary` (or `--signal` outside realms), `--void` text, `--glow-rest`→`--glow-hover` |
| **Ghost** | Secondary (GO FREE, skip) | transparent, `--hairline` border, realm text, fills on hover |
| **Mono-link** | Inline system actions | `--font-mono`, `--fs-xs`, bracketed `[ LIKE THIS ]`, underline-on-hover via `background-size` (no layout shift) |

- All buttons: `--radius-md`, `transform: scale(1.02)` on hover, `scale(0.98)` on active, transition `--duration-fast --ease-universe`. Full focus ring (§9).

### 7.6 Project Dossier *(invention detail — [`2_story` 5.3](2_story_experience.md), [`7_project_archive_system.md`](7_project_archive_system.md))*
- **Anatomy:** "classified file" layout — mono header block (`PROJECT DOSSIER: …`, `STATUS:`, `CLASSIFICATION:`), narrative sections (`MISSION OBJECTIVE`, `FIELD CONTEXT`, `TECHNICAL ARCHITECTURE` [expandable], `OUTCOME`, `WHAT I LEARNED`).
- **Redaction:** private specifics render under `--danger` redaction bars; NEXUS narrates around them.
- **Tokens:** mono headers `--fs-xs`/`--text-dim`; prose `--font-body`/`--fs-base`; stack badges as chips.

### 7.7 Skill Crystal & Skill Tree *(RPG knowledge system — [`4_cs_worlds` Skills Unlocked](4_cs_worlds.md))*
- **Skill crystal:** floating faceted gem carrying a tool logo; not a badge in a list. Hover reveals the "ABILITY UNLOCKED" card (obtained-from / effect / applied-in).
- **Skill tree:** data-driven node graph (`skills.json`), nodes fade in sequentially, connections "draw" via SVG `stroke-dashoffset`, expand on click. **Fully keyboard navigable** and rendered as a semantic `<ul>` for SEO (Doc 8's hardest component #3).

### 7.8 NEXUS Dialogue Panel *(per [`3_ai_companion` §3, §6](3_ai_companion_design.md))*
- **Anatomy:** the polyhedron (R3F) + a `.glass` text panel that types dialogue at NEXUS's deliberate cadence (250ms beat between lines).
- **Color:** panel border + glow inherit NEXUS's *realm-reactive* color, which equals `--realm-primary` per [Doc 4](4_cs_worlds.md).
- **States** map to NEXUS animation states: IDLE / SPEAKING / THINKING / ALERT / EXCITED ([`3_ai_companion` §3.3](3_ai_companion_design.md)). Visual detail in [`6_interactions_and_animation.md` §7](6_interactions_and_animation.md).

### 7.9 Mission Console *(contact — [`2_story` 6.2](2_story_experience.md))*
- **Anatomy:** "secure channel" panel; ops-language field labels (Designation, Organization, Mission Type, Mission Brief); `[ TRANSMIT MISSION BRIEF ► ]`.
- **Validation:** soft amber (`--warn`) inline warnings voiced by NEXUS, never red blocking errors.
- **Submit:** radiating signal-rings animation, `SIGNAL TRANSMITTED — [timestamp]`.
- **A11y:** real `<form>`, labels tied to inputs, errors via `aria-live="polite"`.

### 7.10 Status Bar & Compass
- **Status bar:** mono micro-UI; realm name, `Signal strength: ████ EXCELLENT`, audio toggle, live local time.
- **Compass:** lower-left return-to-map; persistent; the spatial "home."

### 7.11 Achievement / Toast *(easter eggs, unlocks — [`2_story` Easter Eggs](2_story_experience.md))*
- **Anatomy:** small `.glass` slide-in (lower-center), mono `ACHIEVEMENT UNLOCKED`, one line of NEXUS reaction.
- **Motion:** slide-up + fade, 4s dwell, auto-dismiss. Never blocks interaction.

### 7.12 Component State Matrix

Every interactive component implements this full matrix — no partial states ship.

| State | Visual signal |
|---|---|
| Rest | base surface, `--glow-rest` if alive |
| Hover | `--glow-hover`, scale 1.02, cursor swap |
| Focus-visible | 2px `--realm-primary` ring + 2px void offset (§9.3) |
| Active/pressed | scale 0.98, glow intensifies |
| Selected | persistent `--realm-primary` border + corona |
| Disabled | 40% opacity, `cursor:not-allowed`, no glow |
| Loading | realm-tinted shimmer (skeleton), never a spinner on first paint |
| Error | `--danger` border + `aria-live` message |

---

## 8. RESPONSIVE SYSTEM & DEVICE TIERS

### 8.1 Breakpoints

```css
:root {
  --bp-sm: 390px;   /* phones */
  --bp-md: 768px;   /* tablets */
  --bp-lg: 1024px;  /* small laptops */
  --bp-xl: 1440px;  /* desktop — the cinematic target */
}
```

### 8.2 The Three Experience Tiers *(from [`8_technical_feasibility` §Performance](8_technical_feasibility.md))*

The visual system maps onto Doc 8's device tiers. **The design is authored three times, not once** — each tier is a first-class deliverable, never a broken version of another.

| Tier | Device | Universe map | Particles | NEXUS | Transitions |
|---|---|---|---|---|---|
| **1 — Full Universe** | Desktop, strong GPU | Full R3F 3D, orbital drift, bloom | Full budget | 3D polyhedron, shaders | Cinematic GSAP+R3F |
| **2 — Standard** | Mid-range, average net | R3F, fewer polys, reduced bloom | Half budget | 3D, simplified material | GSAP + CSS |
| **3 — Minimal** | Weak GPU / mobile / slow | **CSS+SVG 2D map**, same colors & motion language | CSS dots only | CSS/SVG glowing polygon | Framer Motion / CSS only |

> The Tier-3 2D map is the hardest design problem in the project (Doc 8 §"3 Hardest Things"). It must use the *exact same* realm colors, glowing nodes, animated orbital connections (`<animateMotion>` / CSS `@keyframes`), and `filter: drop-shadow()` glows — so a phone user never feels they got a lesser universe, only a lighter one.

### 8.3 Mobile Layout Adaptations
- Spatial mode → **document mode** on `< --bp-md`: the universe becomes a vertical scroll of realm "cards" with the same colors/glows; tapping enters a realm.
- NEXUS docks to a bottom-sheet handle, not a floating orb, to respect thumb-reach.
- Status bar collapses to realm name + menu.
- Type scale's fluid `clamp()` handles heading downscale automatically.
- Touch targets ≥ 44×44px (§9).

---

## 9. ACCESSIBILITY

Accessibility is Law Ⅸ made literal — *every technical decision has a human consequence*. The universe is for everyone, including the visitor who can't see the bloom.

### 9.1 Color & Contrast
- All body text meets WCAG **AA** (4.5:1); primary/secondary meet **AAA** (§2.2).
- Information is **never carried by color alone** — status uses icon + label + color (e.g. `✓ ONLINE`, not just green).
- Realm identity has a non-color cue: the realm name is always in the status bar.

### 9.2 Motion & `prefers-reduced-motion`
A complete reduced-motion contract (detailed in [`6_interactions_and_animation.md` §14](6_interactions_and_animation.md)):
- Orbital drift, prismatic hue-rotation, parallax, particle systems, and NEXUS idle morphing **freeze** to curated static states.
- The boot sequence collapses to an instant static title card (still skippable).
- Travel animations become a simple cross-fade.
- All *content* remains 100% reachable — nothing is gated behind an animation.

### 9.3 Keyboard & Focus
- Every interactive element is a real, focusable element with a visible **focus-visible ring**: `outline: 2px solid var(--realm-primary); outline-offset: 2px;`
- The 3D universe map has a **parallel keyboard nav**: `Tab` cycles realms (announced by name), `Enter` travels, `Esc` returns to map (the compass action). Easter-egg triggers (Konami, `sudo enter`) all have keyboard equivalents (Doc 8 risk matrix).
- Logical tab order follows the visual reading order in document mode.
- No keyboard trap; modals/boot trap focus *intentionally* and release on close.

### 9.4 Screen Readers
- The cinematic boot has an `aria-live` summary ("System online. Entering CODEX INFINITUM.") and a "Skip to content" link.
- Realm pages are semantic RSC HTML (`<h1>`, `<section>`, `<article>`) per [Doc 8 SEO](8_technical_feasibility.md) — the same structure that helps crawlers helps screen readers.
- The 3D `<Canvas>` is `aria-hidden`; its meaning is duplicated in the accessible DOM (P4 honesty extends to a11y: the decorative layer never holds the only copy of information).
- NEXUS dialogue is announced via `aria-live="polite"`.

### 9.5 Touch & Targets
- Minimum 44×44px touch targets; spacing prevents mis-taps.
- Hover-only affordances always have a tap/focus equivalent.

### 9.6 Respecting the Visitor
- Audio is **off by default, consent-first** ([`3_ai_companion` §8.4](3_ai_companion_design.md)).
- No autoplay sound, no motion that can't be stopped, no flashing > 3Hz (seizure safety).
- The boot is skippable (Law Ⅲ allows it, with narrative consequence, never a functional one).

---

## 10. THE CONSOLIDATED DESIGN TOKENS

The complete `tokens.css` — the single import that powers the universe. This is canonical; [`6_interactions_and_animation.md`](6_interactions_and_animation.md) consumes the motion tokens, [`7_project_archive_system.md`](7_project_archive_system.md) consumes the surface tokens.

```css
/* ============================================================
   CODEX INFINITUM — tokens.css  (single source of truth)
   Supersedes provisional tokens in 8_technical_feasibility.md
   ============================================================ */
:root {
  /* — VOID / SURFACES — */
  --void:#050508; --void-deep:#000008;
  --surface-1:#0B0B12; --surface-2:#13131D; --surface-3:#1C1C28;
  --hairline:rgba(255,255,255,.08); --hairline-strong:rgba(255,255,255,.16);

  /* — TEXT — */
  --text-primary:#E8EAF0; --text-secondary:#A6ACBE;
  --text-dim:#64748B; --text-glow:#FFFFFF;

  /* — SEMANTIC — */
  --ok:#22C55E; --warn:#F59E0B; --danger:#EF4444;
  --info:#38BDF8; --signal:#00F5FF;

  /* — REALM (defaults to Architect's Core; overridden by [data-realm]) — */
  --realm-primary:#FBBF24; --realm-secondary:#F59E0B; --realm-accent:#FBBF24;
  --realm-glow:color-mix(in srgb,var(--realm-primary) 60%,transparent);
  --realm-glow-soft:color-mix(in srgb,var(--realm-primary) 24%,transparent);
  --realm-wash:color-mix(in srgb,var(--realm-primary) 8%,var(--void));

  /* — TYPE — */
  --font-display:'Orbitron','Space Grotesk',sans-serif;
  --font-mono:'JetBrains Mono','Fira Code',ui-monospace,monospace;
  --font-body:'Inter',system-ui,sans-serif;
  --fs-display:clamp(2.99rem,6vw,4.77rem); --fs-h1:clamp(2.44rem,4vw,3.05rem);
  --fs-h2:1.95rem; --fs-h3:1.56rem; --fs-lg:1.25rem;
  --fs-base:1rem; --fs-sm:.8rem; --fs-xs:.64rem;

  /* — SPACE — */
  --space-2xs:.25rem; --space-xs:.5rem; --space-sm:.75rem; --space-md:1rem;
  --space-lg:1.5rem; --space-xl:2.5rem; --space-2xl:4rem;
  --space-3xl:6.5rem; --space-4xl:10rem;
  --container:1200px;

  /* — RADIUS — */
  --radius-sm:6px; --radius-md:10px; --radius-lg:16px;
  --radius-xl:24px; --radius-full:999px;

  /* — ELEVATION / GLOW — */
  --elev-1:0 2px 8px rgba(0,0,0,.6);
  --elev-2:0 8px 24px rgba(0,0,0,.7),0 0 0 1px var(--hairline);
  --elev-3:0 16px 48px rgba(0,0,0,.8),0 0 0 1px var(--hairline-strong);
  --glow-rest:0 0 24px var(--realm-glow-soft);
  --glow-hover:0 0 40px var(--realm-glow),0 0 0 1px var(--realm-primary);

  /* — Z-INDEX — */
  --z-abyss:-20; --z-world:0; --z-content:10;
  --z-chrome:100; --z-nexus:9999; --z-overlay:10000; --z-boot:10001;

  /* — MOTION (full spec in doc 6) — */
  --ease-universe:cubic-bezier(.16,1,.3,1);
  --ease-boot:cubic-bezier(.4,0,.2,1);
  --ease-enter:cubic-bezier(.22,1,.36,1);
  --duration-fast:150ms; --duration-mid:350ms; --duration-slow:700ms;
  --duration-cinematic:1200ms;

  /* — BREAKPOINTS (reference; used in media queries) — */
  --bp-sm:390px; --bp-md:768px; --bp-lg:1024px; --bp-xl:1440px;
}

@media (prefers-reduced-motion:reduce){
  :root{ --duration-fast:0ms; --duration-mid:0ms;
         --duration-slow:0ms; --duration-cinematic:0ms; }
}
```

---

## APPENDIX A — RECONCILIATION WITH DOC 8

Doc 8 ([`8_technical_feasibility.md`](8_technical_feasibility.md)) was written with provisional values that this document now finalizes. Use the **right column**.

| Item | Doc 8 (provisional) | Doc 5 (canonical) |
|---|---|---|
| Neural realm color | `#00d4ff` | `#3B82F6` / `#06B6D4` (Neural Nebula) |
| Cyber realm color | `#00ff41` | `#EF4444` armor / `#22C55E` terminal (The Citadel) |
| Data realm color | `#8b5cf6` | `#7DD3FC` / `#F8FAFC` (Data Archives) |
| Background | `#000008` | `--void #050508` (deep abyss keeps `#000008`) |
| NEXUS idle color | `#7c3aed` | realm-reactive `--realm-primary` ([Doc 3/4](3_ai_companion_design.md)) |
| Route slugs | `silicon-foundry`, `neural-nexus`, `cipher-vault`, `data-observatory`, `code-sanctuary`, `genesis-lab` | align to canonical realm names: `silicon-foundry`, `neural-nebula`, `the-citadel`, `data-archives`, `code-helix`, `soul-quarter` |
| Realm count framing | 6 orbs | 6 explorable + structural + connective (per [Doc 4](4_cs_worlds.md)) |

> **Action for the team:** update `tokens.css` and the App Router folder names in Doc 8's tree to the canonical slugs above before Phase 1 begins.

---

## APPENDIX B — THE SYSTEM AT A GLANCE

| Layer | Decision |
|---|---|
| **Canvas** | Dark void; light = meaning |
| **Color** | 1 void palette + 12 realm themes via `[data-realm]` → `--realm-primary` |
| **Type** | Orbitron (universe) · JetBrains Mono (machine) · Inter (human) |
| **Space** | 8px geometric scale; 12-col document grid + spatial mode |
| **Depth** | 7 planes, glow-not-shadow elevation, glassmorphic chrome |
| **Components** | 12 core components, full 8-state matrix each |
| **Tiers** | 3 first-class experiences (Full / Standard / Minimal) |
| **A11y** | AA+ contrast, full keyboard, reduced-motion contract, semantic DOM |
| **Tokens** | One `tokens.css`, supersedes Doc 8 provisionals |

---

## Document Metadata

| Property | Value |
|---|---|
| Document ID | `universe/5_ui_ux_system` |
| Version | `1.0.0` |
| Status | `CANONICAL — Visual System (single source of design truth)` |
| Author | CODEX INFINITUM Creative Team |
| Date | 2026-06-22 |
| Depends on | [`1_world_concept.md`](1_world_concept.md), [`3_ai_companion_design.md`](3_ai_companion_design.md), [`4_cs_worlds.md`](4_cs_worlds.md) |
| Feeds into | [`6_interactions_and_animation.md`](6_interactions_and_animation.md), [`7_project_archive_system.md`](7_project_archive_system.md), [`8_technical_feasibility.md`](8_technical_feasibility.md) |

---

> *"Give a universe a consistent set of laws and it will feel infinite. Give it inconsistent ones and it will feel like a website. This document is the difference."*
> — The Architect's Style Guide, CODEX INFINITUM
