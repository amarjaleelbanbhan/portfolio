# 🧠 PROJECT_MEMORY.md — CODEX INFINITUM
### The Context-Reset-Safe Source of Truth for Implementation

> If an AI context window resets, **read this file first**, then `universe-design/` docs 1–10.
> This file is updated at the end of **every** phase. Never let it go stale.

---

## 0. WHAT THIS PROJECT IS

**CODEX INFINITUM** — an interactive **Computer Science Universe**, not a normal portfolio.
The creator's portfolio (Amar Jaleel, *AI Product Engineer*) lives *inside* the universe.
Full design spec: `universe-design/1_world_concept.md` … `10_universe_review_and_expansion.md` (10 canonical docs, design phase COMPLETE).

**Non-negotiables (never remove):** Boot experience · NEXUS companion · the CS realms · exploration · RPG knowledge system · History (Founders' Constellation) · Theory depth (The Foundations) · Projects-as-Inventions.

**The universe = 15 places** (canon: doc 4 + doc 10):
- *Core:* Architect's Core (about/Amar)
- *7 Explorable Worlds:* Silicon Foundry, The Foundations, Code Helix, Neural Nebula, The Citadel, Data Archives, Soul Quarter
- *3 Structural Realms:* Founders' Constellation, Legacy Archive (v1.0), The Observatory
- *4 Connective Layers:* The Kernel (OS), Network Pathways, Cloud Expanse, Invention Archive
- *Frontier:* Unexplored Territories (fog)

All 15 are encoded in `lib/realms.ts` and `styles/tokens.css` (`[data-realm]` themes).

---

## 1. CURRENT PHASE

**PHASE 1 — The Boot Sequence: ✅ COMPLETE & TESTED (green build + tsc clean).**
The birth moment (Human → Machine → Universe) is live at `/`. Phases 0 + 1 done.
**Next gate:** awaiting user approval to begin **Phase 2 — The Universe Map**.

---

## 2. EXISTING PROJECT ANALYSIS (the v1 portfolio — now the Legacy Archive)

### 2.1 Stack as found
Next.js **16.1.1** (Turbopack) · React **19.2.3** · JavaScript · Tailwind 3 · Pages Router.
Pre-installed & reused: three, framer-motion, tsparticles, matter-js, chart.js, @formspree/react. Gemini key in `.env.local`.

### 2.2 Reused
- `data/portfolio.js` (5 projects, 11 certs, skills, education) — to be restructured into universe data in later phases.
- The whole v1 site → **Legacy Archive** at `/legacy/*` (relocated via `git mv`, history preserved).
- Installed libs above.

### 2.3 Current on-disk structure (post Phase 0)
```
portfolio/
├── app/                       ← NEW · App Router universe
│   ├── layout.tsx             root layout: next/font (Orbitron/JetBrains/Inter), tokens, metadata, JSON-LD, data-realm
│   ├── page.tsx               Phase-0 universe entry placeholder (Boot replaces it in Phase 1)
│   └── page.module.css
├── pages/                     ← Pages Router (Legacy Archive + shared infra)
│   ├── legacy/                index, projects, skills, certifications, contact  → /legacy/*
│   ├── 404.js · _app.js · _document.js
├── components/                v1 components (used only by Legacy)
├── data/portfolio.js          v1 content (reused later)
├── lib/
│   ├── realms.ts              ← NEW · typed registry of all 15 realms (canonical)
│   ├── deviceTier.ts          ← NEW · 3-tier device detection + particle budget
│   └── markdown.js            (v1)
├── store/universeStore.ts     ← NEW · Zustand (nav/boot/NEXUS/device) + localStorage persist
├── styles/
│   ├── tokens.css             ← NEW · canonical design system (void palette, 15 realm themes, type, motion)
│   ├── universe.css           ← NEW · app/ global base (reset, focus ring, fonts)
│   └── globals.css            (v1 Tailwind globals — loaded only by pages/_app.js)
├── tsconfig.json · global.d.ts (CSS ambient types)  ← NEW
├── tailwind.config.js / postcss.config.js            (v1; scopes to pages tree)
└── universe-design/           the 10 canonical design docs
```

---

## 3. COMPLETED FEATURES
- ✅ Design phase: 10 canonical universe documents.
- ✅ Repository analysis + `PROJECT_MEMORY.md`.
- ✅ **Phase 0 — Foundation:**
  - Dependencies: `@react-three/fiber@9`, `@react-three/drei@10`, `@react-three/postprocessing`, `gsap`, `zustand`, `@pmndrs/detect-gpu`; dev: `typescript`, `@types/{react,react-dom,node,three}`.
  - TypeScript configured (`tsconfig.json`, `global.d.ts` for CSS ambient types).
  - `styles/tokens.css` — full canonical design-token system incl. all 15 realm themes + `@property` color-bleed + reduced-motion contract.
  - `styles/universe.css` — app/ global base.
  - `app/layout.tsx` (fonts via next/font, metadata, Person JSON-LD, `data-realm="architect-core"`) + `app/page.tsx` placeholder.
  - `lib/realms.ts` (15-realm typed registry), `lib/deviceTier.ts` (tiers/budget), `store/universeStore.ts` (Zustand + persist).
  - **Legacy preserved as route-based archive:** v1 pages `git mv`'d → `pages/legacy/*`; internal links updated (Navbar, Hero, index); imports re-aliased to `@/`.
  - **Green production build:** App `/` + Pages `/legacy/*` coexist; all 9 routes prerender.
- ✅ **Phase 1 — Boot Sequence** (canon doc 2 Act 1 / doc 6 §3):
  - Reusable system under `components/universe/boot/`: `CircuitGrid` (breathing/igniting void grid), `PowerCore` (proximity-ignition power trigger + click shockwave), `SystemTerminal` (GSAP-typed readout), `BootSequence` (orchestrator), `bootScript.ts` (deterministic FULL + EXPRESS timelines — no random text).
  - `components/universe/UniverseGate.tsx` (client) chooses full vs **express** boot from persisted `bootCompleted`, detects reduced-motion, owns boot→handoff; `HandoffPlaceholder.tsx` = the prepared handoff state ("inside the answer"; map arrives Phase 2).
  - `app/page.tsx` now renders `<UniverseGate/>` (removed Phase-0 placeholder + its CSS).
  - **GSAP** drives the typewriter timeline; **Zustand** `completeBoot()` persists the skip/express logic.
  - Skip via on-screen button **and** `Esc`. Full **reduced-motion** path: static readout + "[ ENTER ]" control; SR-only `aria-live` boot summary; `.sr-only` util added.
  - **Tested:** `next build` green (9 routes prerender) + `npx tsc --noEmit` exit 0.
  - **Scope respected:** no map / realms / NEXUS character / AI chat / projects / 3D — only the boot + handoff stub.

---

## 4. ARCHITECTURE DECISIONS (log)
| # | Decision | Status |
|---|---|---|
| A1 | Universe in **App Router (`app/`)**; v1 in **Pages Router (`pages/legacy`)** — coexisting | ✅ Applied (build proves it) |
| A2 | **`tokens.css` (CSS custom properties)** = design source of truth; supersedes v1 neon tokens | ✅ Applied |
| A3 | **TypeScript** for all universe code; legacy stays JS (`allowJs`, `checkJs:false`) | ✅ Applied |
| A4 | **CSS Modules** for universe components; **Tailwind retained only in Legacy** (globals.css loaded solely by `pages/_app.js`) | ✅ Applied |
| A5 | **Wrap three with R3F + drei**; add **GSAP** + keep **Framer Motion** + CSS micro-interactions | ✅ Installed (used from Phase 1+) |
| A6 | **Zustand** (+persist) for state | ✅ Applied (skeleton) |
| A7 | **Legacy = route-based archive at `/legacy`** (NO iframe, no code duplication, no deletion) | ✅ Applied |
| A8 | Work on branch **`codex-infinitum`**; `main`/v1 untouched | ✅ Applied |
| A9 | `paths` alias `@/*` without `baseUrl` (TS 7 deprecation-safe) | ✅ Applied |

## 5. DESIGN DECISIONS (from canon — do not re-litigate)
- Dark void canvas; light = meaning; one realm = one color (doc 5).
- NEXUS = morphing polyhedron, **4 modes** (Architect/Cyber/Quest/Mentor) + **5 animation states** (Idle/Speaking/Thinking/Alert/Excited); realm-reactive color *bleeds* 1.2s. Not a chat widget; never invent new modes.
- Boot is sacred (~22s first visit, 6s express on return), skippable with narrative cost.
- Three device tiers (Full / Standard / Minimal-CSS2D); transform/opacity-only animation; full reduced-motion contract.
- Projects = Inventions, CLASS I–V, 9-part dossier; private projects use redaction-as-intrigue.

---

## 6. STACK DECISIONS — RESOLVED ✅
All three Phase-0 open questions confirmed by user: **TypeScript · App Router · CSS Modules + tokens.css**, and **legacy = route-based `/legacy` archive (avoid iframe; no duplication; no deletion)**. See A3/A4/A7.

---

## 7. PENDING TASKS (the phase roadmap)
- [x] **Phase 0 — Foundation/Scaffolding** ✅
- [x] **Phase 1 — Boot Sequence** ✅ (`components/universe/boot/` + `UniverseGate` + `HandoffPlaceholder`)
- [ ] **Phase 2 — Universe Map** (doc 2 Act 3 / doc 4): R3F canvas, starfield, 15 realm nodes, orbital drift, hover info cards, travel transition, 2D fallback (tier 0). **Replaces `HandoffPlaceholder`** as the boot's destination. Wire `lib/realms.ts` + `lib/deviceTier.ts` + `enterRealm`.
- [ ] **Phase 3 — NEXUS** (doc 3 / doc 6 §7): morphing polyhedron, 4 modes/5 states, dialogue panel, scroll-velocity, color bleed.
- [ ] **Phase 4 — First realm vertical slice** (Neural Nebula end-to-end) — proves the realm pattern.
- [ ] **Phase 5 — Remaining realms** + connective layers + structural realms.
- [ ] **Phase 6 — Invention Archive** (doc 7): inventions, dossiers, VisiRoD + CommentFellows + GitHub conversions, redaction.
- [ ] **Phase 7 — RPG Knowledge System:** skill trees, abilities, learning paths, achievements, knowledge graph.
- [ ] **Phase 8 — Observatory/Contact + endings** (doc 2 Act 6).
- [ ] **Phase 9 — Polish:** perf/Lighthouse, device tiers, a11y, reduced-motion, SEO/JSON-LD, cross-browser.

---

## 8. PROBLEMS SOLVED (log)
- **Root route conflict** (app/page vs pages/index): resolved by relocating v1 to `pages/legacy/*`.
- **Relocated pages' relative imports broke** (`../data` → `pages/data`): rewrote to `@/` alias (location-independent).
- **TS: CSS side-effect imports lacked type declarations:** added `global.d.ts` (`declare module "*.css"` + `*.module.css`).
- **TS: `baseUrl` deprecated (fatal in installed TS):** removed `baseUrl`, kept `paths` (resolves relative to tsconfig).
- **React 19 + R3F compatibility:** used `@react-three/fiber@9` / `@react-three/drei@10` (React 19-compatible). Install clean.
- Note: `npm audit` reports 10 vulns in transitive deps — deferred to Phase 9 (not blocking; avoid `audit fix --force`).

---

## 9. ▶️ NEXT RECOMMENDED ACTION
**Get user approval to begin Phase 2 — The Universe Map.** It replaces `HandoffPlaceholder` as the boot's destination: an R3F `<Canvas>` with starfield + the 15 realm nodes (from `lib/realms.ts`) in orbital drift, hover info cards, the travel transition, and a CSS/SVG 2D fallback for tier-0 devices (`lib/deviceTier.ts`). Boot already calls into the gate, so Phase 2 swaps the post-boot view and wires `enterRealm`. Then test → update this file → commit → STOP.

> Phase-1 integration note for Phase 2: the boot finishes by setting `entered=true` in `UniverseGate`. Replace `<HandoffPlaceholder/>` there with `<UniverseMap/>`. Keep the "replay boot" affordance somewhere (e.g. a hidden settings control) per canon.

---
*Last updated: 2026-06-22 · End of Phase 1 (Boot Sequence; build green, tsc clean). Branch: `codex-infinitum`. Protocol: plan → implement one feature → test → report → commit → STOP for approval.*
