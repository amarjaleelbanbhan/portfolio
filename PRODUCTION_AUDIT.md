# 🔍 PRODUCTION_AUDIT.md — CODEX INFINITUM
### Phase 9.1 · Pre-Release Audit (findings only — no fixes applied)

> Role: Performance / Accessibility / Frontend-Architecture / QA review of the
> completed universe before release. Each finding is tagged **Critical**,
> **Important**, or **Nice**. Fixes await approval (Phase 9.2).

**Branch:** `codex-infinitum` · **Build:** green · **Type-check:** `tsc --noEmit` exit 0.

### How this was audited
- `next build` (Turbopack) — compiles clean; 9 routes prerender (`/`, `/_not-found`, `/legacy/*`, `/404`).
- Chunk measurement: `.next/static/chunks` — largest **861 KB** (three/R3F vendor), **3.0 MB** total JS.
- `npm audit` — 10 vulnerabilities (1 low, 5 moderate, **4 high**), all build-time/transitive.
- Static scans: `NEXT_PUBLIC` (none), `console.*` in universe code (none), `dangerouslySetInnerHTML` (1 — JSON-LD, safe), eager imports, SEO files.
- Manual code review of components/state.
- ⚠️ **Lighthouse not run** — no browser in this environment. Targets below are *estimates*; a real Lighthouse + mobile-device pass is itself a Phase-9.2 task.

---

## SCORECARD (estimated, pending real Lighthouse)

| Area | Estimate | Confidence |
|---|---|---|
| Performance (desktop) | ~85–92 | Med — static prerender + lazy 3D help; heavy three chunk hurts |
| Performance (mobile mid-tier) | ~70–85 | Low-Med — two WebGL contexts + 861KB three |
| Accessibility | ~80–88 | Med — good tokens/keyboard base; modal traps + contrast gaps |
| Best Practices | ~90+ | High — no console, no leaks, safe HTML |
| SEO | ~70 | High issue — stale sitemap/robots + single client route |

---

## 1 · PERFORMANCE

### IMPORTANT — Entire universe is eagerly imported into the `/` bundle
`components/universe/UniverseGate.tsx` statically imports **every** view: `BootSequence`, `UniverseMap`, `NexusCompanion`, `RealmShell`, `InventionArchive`, `ArchitectCore`, `Observatory`, `KnowledgeButton`, `KnowledgePanel`. So the **boot screen pays the download cost of the whole app** before the visitor does anything.
*Fix direction:* `next/dynamic` for everything past the boot (map, realms, inventions, chambers, knowledge) so the first paint ships boot + shell only. Realms/inventions/knowledge load on travel/open.

### IMPORTANT — Heavy three.js / R3F vendor chunk (861 KB)
The largest chunk is the 3D stack. It is already behind `dynamic(ssr:false)` for `UniverseCanvas` and `NexusCore3D` (good — not in first paint), but on the map it's the dominant payload on mobile.
*Fix direction:* confirm tree-shaking (import only used three modules), keep tier-0 on the 2D path (already does), consider `drei` selective imports; verify the 861 KB chunk only loads when WebGL is actually used.

### IMPORTANT — Two concurrent WebGL contexts on the map
On the universe map, **both** `UniverseCanvas` *and* the persistent `NexusCore3D` run live `<Canvas>` render loops simultaneously. `NexusCore3D` rotates/morphs every frame even when idle. On mid/low devices this is real GPU + battery cost.
*Fix direction:* set NEXUS `frameloop="demand"` (or pause when off-state/idle), and/or render NEXUS as the CSS fallback on tier 1, not just tier 0. Consider a single shared canvas long-term (not required for release).

### NICE — Minor per-render allocation
`NexusCore3D` constructs `new THREE.Color(color)` on each React render (used inside `useFrame`). Negligible, but could be memoized.

### NICE — Fonts
Three families / seven weights (Orbitron ×3, JetBrains ×3, Inter). Fine, but trimming unused weights shaves KB.

---

## 2 · ACCESSIBILITY

### CRITICAL — Modal overlays are not keyboard-dismissible / no focus management
`KnowledgePanel` and `InventionDossier` use `role="dialog" aria-modal="true"` but have **no `Esc` to close, no focus trap, and no focus restore**. A keyboard or screen-reader user can tab out behind the modal or get stranded (WCAG 2.1.2 / 2.4.3).
*Fix direction:* add `Esc` handler, trap focus within the dialog, move focus to it on open and restore on close. (Boot already does `Esc`; reuse that pattern.)

### IMPORTANT — Decorative 3D canvas not hidden from AT
The R3F `<Canvas>` (map + NEXUS) is not `aria-hidden`. Keyboard/AT users navigate via `RealmIndex` (good — that exists), but the canvas should be explicitly `aria-hidden="true"` so AT doesn't announce an empty interactive surface.

### IMPORTANT — `--text-dim` contrast below AA for small text
`--text-dim` `#64748B` on `--void` `#050508` ≈ **4.3:1**, under the 4.5:1 AA threshold for normal text. It's used widely for small **mono labels** (status bar, kickers, hints, captions).
*Fix direction:* lighten `--text-dim` slightly (e.g. → ~`#7C8AA0` ≈ 5:1) or reserve it for ≥18px/decorative only.

### IMPORTANT — Verify keyboard parity end-to-end
`RealmIndex` gives keyboard nav for the 3D map; the 2D map and all chambers/archive use real buttons. Worth an explicit pass: tab order across overlapping chrome, the realm-index toggle, dossier/panel close affordances, and the NEXUS button.

### NICE — Heading hierarchy in the Knowledge panel
`KnowledgePanel` title is a `<p class=ptitle>` while sections are `<h2>` — no `<h1>` in the overlay. Minor semantic tidy.

---

## 3 · MOBILE EXPERIENCE

### IMPORTANT — Chrome crowding on small screens
On the map, five fixed elements compete: `RealmIndex` (top-left, **open by default**, up to 76vw), `RealmInfoCard` (bottom-left), NEXUS (bottom-right), travel hint (bottom-center), `MASTERY` (top-right). On phones these overlap/cover the map.
*Fix direction:* collapse `RealmIndex` by default on `<768px`; ensure info-card + hint + NEXUS don't stack; possibly a single bottom sheet on mobile.

### IMPORTANT — 2D fallback node overlap at very small widths
`UniverseMap2D` positions 15 nodes by percentage (`50 ± nx*42%`). At <480px the inner-layer nodes crowd and labels/targets can overlap.
*Fix direction:* scale spacing with viewport, or switch the 2D map to a list/cluster layout under a breakpoint.

### NICE — Touch zoom on the 3D map
`OrbitControls` has `enableZoom` on; pinch works but verify it doesn't fight page scroll on the fixed canvas (likely fine since map is full-screen fixed).

---

## 4 · CODE QUALITY

### NICE — Dead / latent store API
`store/universeStore.ts` defines but does not yet use: `transitionPhase`/`setTransitionPhase`, `previousRealm`, `nexusVisible`/`setNexusVisible`, `addTime`, `unlockEgg`/`unlockedEasterEggs`. Either wire (easter eggs/time are deferred Phase-9 delight) or trim to reduce surface.

### NICE — Latent duplicate data/types
- `REALM_CONTENT["the-observatory"]` (Phase 5) is unused — chamber routing wins. Either remove it or have the Observatory chamber consume its "frontier" topics.
- `NexusMode` is declared in both `lib/realms.ts` and `store/universeStore.ts` (structurally identical). Consider one source.

### NICE — Repeated CSS keyframes / patterns
`arrive`/`flash`/`fade` keyframes and the "chamber/archive shell" pattern repeat across `realm`, `inventions`, `chambers` modules. Could extract shared classes; low priority (scoped, harmless).

### Verdict
TypeScript is `strict`, fully typed, no `any` leaks, no `console.*`, clean component boundaries. Good baseline.

---

## 5 · SEO & SHARING

### CRITICAL — Stale `robots.txt` + `sitemap.xml` (wrong routes AND wrong domain)
`public/sitemap.xml` and `public/robots.txt` are **v1 leftovers**: they list removed routes (`/projects`, `/skills`, …) at `https://amarjaleel.vercel.app`, while `app/layout.tsx` `metadataBase` is `https://amarjaleel.dev`. Search engines will be pointed at dead URLs on a different domain, and the universe `/` + `/legacy/*` aren't represented.
*Fix direction:* replace with `app/sitemap.ts` + `app/robots.ts` (or updated static files) reflecting real routes and the real domain; reconcile the domain everywhere.

### IMPORTANT — No Open Graph image
`app/layout.tsx` sets OG title/description but no `og:image`. Shared links will be bland.
*Fix direction:* add a static OG image (or `@vercel/og` static generation) — one image is enough for the root.

### IMPORTANT — Single client route limits crawlability
The whole universe is one client-rendered route (`/`); realms/inventions/chambers are in-page overlays, so they have **no individual URLs or server-rendered text** for crawlers. Acceptable for a portfolio (root carries the Person schema + description), but it caps SEO depth.
*Fix direction (optional):* add a hidden, server-rendered semantic summary (realms + key facts) in `app/page`, or accept as a deliberate tradeoff. Legacy (`/legacy/*`) is already crawlable.

### NICE — `metadataBase` domain
Placeholder `amarjaleel.dev` — confirm/replace with the real deploy domain before launch.

---

## 6 · SECURITY

### IMPORTANT — Dependency vulnerabilities (10; 4 high)
`npm audit` reports high-severity issues in **build-time/transitive** deps (e.g. `postcss` XSS in stringify, `yaml` stack overflow). Not runtime-exploitable for a static export, but should be cleaned. `npm audit fix` (non-`--force`) is available.
*Fix direction:* run `npm audit fix`, re-run `next build` + `tsc` to confirm nothing breaks; re-audit.

### NICE — No security headers
`next.config.mjs` sets no headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`). Hardening opportunity for the deploy.

### NICE — Unused secret present
`.env.local` holds `GEMINI_API_KEY` though Gemini is unused. It is **not** exposed (gitignored, no `NEXT_PUBLIC`, no API route). Keep for the future NEXUS upgrade or remove.

### Confirmed clean ✓
- No `NEXT_PUBLIC` env exposure. No `console.*` in universe code. Only `dangerouslySetInnerHTML` is the static JSON-LD object (safe). External links use `rel="noopener noreferrer"`.

---

## PRIORITIZED ACTION LIST (for Phase 9.2 approval)

### 🔴 Critical (do before release)
1. **Modal a11y** — `Esc` + focus trap + focus restore for `KnowledgePanel` & `InventionDossier`.
2. **SEO files** — replace stale `sitemap.xml`/`robots.txt` with route-accurate, domain-correct versions (`app/sitemap.ts` + `app/robots.ts`).

### 🟡 Important (strongly recommended)
3. **Code-split** views in `UniverseGate` via `next/dynamic` (boot/shell first).
4. **NEXUS canvas cost** — `frameloop="demand"` / pause when idle; consider CSS fallback on tier 1.
5. **Mobile chrome** — collapse `RealmIndex` by default <768px; de-crowd map overlays.
6. **2D map** node spacing at <480px.
7. **`--text-dim` contrast** → ≥4.5:1.
8. **`aria-hidden`** the decorative 3D canvases.
9. **OG image** for sharing.
10. **`npm audit fix`** + re-verify build.

### 🟢 Nice (polish / hardening)
11. Trim dead store API + latent observatory `RealmContent` + duplicate `NexusMode`.
12. Security headers in `next.config.mjs`.
13. `metadataBase` real domain; font-weight trim; memoize NEXUS color; KnowledgePanel `<h1>`.
14. Decide: merge `codex-infinitum` → `main` + deploy (Vercel).

---

*Audit by the Phase-9 review (Performance/A11y/Architecture/QA). No code changed. Next: await approval, then apply fixes in small reviewable slices (Critical → Important → Nice), each ending in green `next build` + `tsc`.*
