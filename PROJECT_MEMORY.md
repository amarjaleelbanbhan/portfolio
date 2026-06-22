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
- *7 Explorable Worlds:* Silicon Foundry (Hardware), The Foundations (Math/Theory), Code Helix (Software), Neural Nebula (AI/ML), The Citadel (Cyber), Data Archives (Data), Soul Quarter (Creative)
- *3 Structural Realms:* Founders' Constellation (CS history), Legacy Archive (v1.0), The Observatory (future/contact)
- *4 Connective Layers:* The Kernel (OS/atmosphere), Network Pathways (networking/travel), Cloud Expanse (sky), Invention Archive (projects)
- *Frontier:* Unexplored Territories (fog: Quantum, Robotics, AGI, BCI…)

---

## 1. CURRENT PHASE

**PHASE 1 · Step 0 — Repository Analysis (COMPLETE).**
No implementation code written yet. This commit contains analysis + this memory file only.
**Next gate:** awaiting user approval (and confirmation of 3 stack decisions in §6) before Phase 0 scaffolding.

---

## 2. EXISTING PROJECT ANALYSIS (the v1 portfolio)

### 2.1 Structure (what's on disk now)
```
portfolio/
├── pages/            Pages Router — index, projects, skills, certifications, contact, 404, _app, _document (~721 LOC)
├── components/       17 components (~1867 LOC): Hero, Navbar, Footer, GlitchText, NeonButton, ProjectCard,
│                     SkillBar, SkillCube(3D), GravitySkills(matter-js), TerminalGame, LoadingScreen,
│                     Achievements, AnimatedStats, Education, ResumeButton, SecretProject, SpotlightGrid
├── data/portfolio.js Real content: personalInfo, stats, 5 public projects, 11 certifications, skills, education (257 LOC)
├── lib/markdown.js   Markdown util
├── styles/globals.css Tailwind base + cyberpunk tokens (neon-cyan/green/magenta, midnight) (120 LOC)
├── public/           favicon, hero portraits, resume.html, robots.txt, sitemap.xml
├── images/           hero portraits
├── tailwind.config.js / postcss.config.js / jsconfig.json / next.config.mjs
├── .env.local        GEMINI_API_KEY already present (for AI features)
└── universe-design/  the 10 design docs (untracked until this commit)
```

### 2.2 Existing technologies
| Tech | Version | Note |
|---|---|---|
| Next.js | **16.1.1** | **Pages Router** (newer than doc 8's assumed 14) |
| React | 19.2.3 | |
| Language | **JavaScript** | jsconfig + `@/*` path alias; no TypeScript |
| Styling | **Tailwind 3.4.13** + `@tailwindcss/typography` | doc 8 had *rejected* Tailwind for CSS Modules — see §6 |
| three.js | 0.182.0 | raw three (SkillCube). **No** R3F yet |
| framer-motion | 12.23.26 | present |
| tsparticles | 3.x (`@tsparticles/react`, `/slim`) | present |
| matter-js | 0.20.0 | physics (GravitySkills) |
| chart.js | 4.5.1 | skills radar |
| @formspree/react | 3.0.0 | contact form |
| react-markdown, react-confetti | — | misc |
| ESLint | 9 + eslint-config-next 16 | |

State: builds & runs (per existing `PROJECT_STATUS_REPORT.md`); `.next/` + `node_modules/` present. Branch `main`, 6 commits, clean working tree except untracked `universe-design/` + new prep files.

### 2.3 What can be REUSED ✅
- **`data/portfolio.js`** — real content (5 projects, 11 certs incl. the 3 Google Professional certs, skills w/ levels, education at Sukkur IBA). Will be **restructured** into universe content (`data/realms`, `data/inventions`, `data/skills`, `data/certifications`, `data/nexus-dialogues`).
- **Libraries already installed:** three, framer-motion, tsparticles, matter-js, chart.js — all match canon needs. Saves install/learning.
- **Gemini API key** — already configured for the future NEXUS Gemini upgrade path (doc 8 §NEXUS).
- **Concept seeds:** `LoadingScreen` (boot-skip pattern via sessionStorage), `TerminalGame` (terminal interaction — feeds the `sudo enter` secret + boot readout), `GlitchText`, glass-panel + scanline CSS, neon design instincts.
- **The entire v1 site** → becomes the **Legacy Archive** realm content (canon doc 4 §9). Preserve, do not delete.
- SEO scaffolding: robots.txt, sitemap.xml, hero images.

### 2.4 What must CHANGE / be ADDED 🔧
- **Add libs:** `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `gsap`, `zustand`, `@pmndrs/detect-gpu`. (Optional: `typescript` + types if adopting TS.)
- **Introduce `app/` (App Router)** for the universe, coexisting with `pages/` (Next supports both) — or migrate per §6 decision.
- **Port the canonical token system** `universe-design/5` → `styles/tokens.css` (CSS custom properties: void palette, 15 realm themes, type, spacing, z-index, motion). This becomes the single source of design truth and *supersedes* the v1 neon tokens (v1 tokens live on only inside Legacy Archive).
- **Identity update:** v1 title "Full-Stack Tech Enthusiast" → canon "**AI Product Engineer**".
- **Add flagship private inventions** missing from v1 data: **VisiRoD FIRS** (CLASS II) and **CommentFellows** (CLASS I) per doc 7.
- **Decommission v1 as the root experience** — root `/` becomes boot→universe; v1 served as Legacy Archive (strategy in §6).

---

## 3. COMPLETED FEATURES
- ✅ Design phase: 10 canonical universe documents.
- ✅ Repository analysis (this document).
- _(no implementation code yet)_

---

## 4. ARCHITECTURE DECISIONS (log)
| # | Decision | Rationale | Status |
|---|---|---|---|
| A1 | Build the universe in **App Router (`app/`)**, keep **Pages Router (`pages/`)** for the preserved v1 | Both coexist in Next 16; clean separation; v1 = Legacy Archive | **Recommended — confirm (§6)** |
| A2 | Keep canonical **`tokens.css` (CSS custom properties)** as the design source of truth | Doc 5 is canon; works with *either* Tailwind or CSS Modules | **Locked** |
| A3 | Wrap existing raw `three` with **React Three Fiber + drei** | Declarative R3F integrates with React/Zustand state (doc 8) | **Recommended** |
| A4 | Add **GSAP** (timelines), keep **Framer Motion** (route transitions), **CSS** for micro-interactions | Doc 6 animation matrix | **Locked** |
| A5 | **Zustand** for universe/boot/NEXUS state, `persist` to localStorage | Doc 8 | **Locked** |
| A6 | Implementation on a **`codex-infinitum` branch**, not `main` | Protect working v1; merge when ready | **Applied** |

## 5. DESIGN DECISIONS (carried from canon — do not re-litigate)
- Dark void canvas; light = meaning; one realm = one color (doc 5).
- NEXUS = morphing polyhedron, **4 modes** (Architect/Cyber/Quest/Mentor) + **5 animation states** (Idle/Speaking/Thinking/Alert/Excited); realm-reactive color *bleeds* over 1.2s (doc 3/6). **Not** a chat widget; **never** invent new modes.
- Boot is sacred (~22s first visit, 6s express on return), skippable with narrative cost (doc 2/6).
- Three device tiers (Full / Standard / Minimal-CSS2D); transform/opacity-only animation; full reduced-motion contract (doc 5/6/8).
- Projects = Inventions, CLASS I–V, 9-part dossier; private projects use redaction-as-intrigue (doc 7).

---

## 6. ⚠️ DECISIONS PENDING USER CONFIRMATION (before Phase 0)
1. **Styling authoring:** canon doc 8 *rejected* Tailwind for CSS Modules, but v1 ships Tailwind 3.
   **Recommendation:** keep `tokens.css` (custom properties) as canonical; use **CSS Modules** for bespoke realm/universe components (matches doc 5/6); keep Tailwind only inside the preserved v1 Legacy Archive. *(Alternative: keep Tailwind everywhere, mapping its theme to the tokens — faster but diverges from canon.)*
2. **TypeScript:** canon assumes TS; v1 is JS.
   **Recommendation:** author **new universe code in TypeScript** (incremental; Next 16 supports mixed). Legacy stays JS.
3. **Legacy v1 hosting:** canon `/legacy → v1 iframe`.
   **Recommendation:** keep v1 in `pages/` reachable under a legacy path and **iframe/portal it** from the Legacy Archive realm, so `app/` owns root `/`. *(Alternative: static-snapshot v1 into `/public/legacy/`.)*

> Default if user just says "proceed": adopt all three recommendations above.

---

## 7. PENDING TASKS (the phase roadmap)
- [ ] **Phase 0 — Foundation/Scaffolding:** confirm §6 decisions; install deps; create `app/` root layout; port `tokens.css`; Zustand store skeleton; device-tier util; universe shell (status bar / compass / NEXUS mount — empty); wire Legacy route; baseline build green.
- [ ] **Phase 1 — Boot Sequence** (doc 2 Act 1 / doc 6 §3): void + breathing grid, power button, GSAP boot terminal, localStorage skip, particle→map handoff.
- [ ] **Phase 2 — Universe Map** (doc 2 Act 3 / doc 4): R3F canvas, starfield, 15 realm nodes, orbital drift, hover info cards, travel transition, 2D fallback.
- [ ] **Phase 3 — NEXUS** (doc 3 / doc 6 §7): morphing polyhedron, 4 modes/5 states, dialogue panel, scroll-velocity, color bleed.
- [ ] **Phase 4 — First realm vertical slice** (Neural Nebula end-to-end: arrival cinematic, 3 districts, skill unlock, challenge, NEXUS) — proves the realm pattern.
- [ ] **Phase 5 — Remaining realms** via the pattern (Silicon Foundry, The Foundations, Code Helix, Citadel, Data Archives, Soul Quarter) + connective layers (Kernel/Network/Cloud) + structural (Founders' Constellation, Observatory, Legacy).
- [ ] **Phase 6 — Invention Archive** (doc 7): inventions, dossiers, VisiRoD + CommentFellows + GitHub conversions, redaction.
- [ ] **Phase 7 — RPG Knowledge System:** skill trees, abilities, learning paths, achievements, knowledge graph.
- [ ] **Phase 8 — Observatory/Contact + endings** (doc 2 Act 6): transmission console, NEXUS goodbye.
- [ ] **Phase 9 — Polish:** perf/Lighthouse, device tiers, a11y, reduced-motion, SEO/JSON-LD, cross-browser (doc 8 Phase 4).

---

## 8. PROBLEMS SOLVED (log)
- _(none yet — implementation not started)_

---

## 9. ▶️ NEXT RECOMMENDED ACTION
**Get user approval to begin Phase 0 (Foundation/Scaffolding)** and confirmation of the 3 stack decisions in §6 (or a simple "proceed with recommendations"). Phase 0 writes the first code: deps + `app/` shell + `tokens.css` + Zustand + device tiers, ending in a green baseline build. Then STOP for the next gate.

---
*Last updated: 2026-06-22 · End of Phase 1 Step 0 (analysis). Workflow: plan → implement one feature → test → report → commit → STOP for approval.*
