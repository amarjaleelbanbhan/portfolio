# Portfolio — Current State (Phase 0 Audit)

**Date:** 2026-09-18
**Commit audited:** `fa96654` (Merge PR #10, shareable hire page)
**Branch:** `main`
**Live:** https://amarjaleel.me (Vercel)

This is the Phase 0 deliverable: a factual record of the portfolio as it existed
*before* any Phase 0.5 work. Items fixed in Phase 0.5 are marked **[fixed in 0.5]**
so the drift between this document and the code stays visible.

---

## 1. Architecture

A Pages Router Next.js site running **two separate visual systems** in one
deployment.

**System A — the personal portfolio.** `/`, `/projects`, `/skills`,
`/certifications`, `/contact`, `/404`. Dark cyberpunk/terminal aesthetic. Tailwind
utilities plus global helper classes in `styles/globals.css` (`.section-container`,
`.glass-panel`, `.surface-card`, `.section-heading`, `.text-glow`, `.scanlines`).
Shares `Navbar` + `Footer`. Reads `data/portfolio.js`.

**System B — "Amar Digital Systems", the client funnel.** `/hire`, `/studio`,
`/studio/request`, `/studio/admin`. Clean corporate SaaS aesthetic built with CSS
Modules (`Hire.module.css`, `Studio.module.css`, `Request.module.css`). No
Tailwind, no shared components, header/footer inlined per page, content hardcoded
per page.

**The two collided in `pages/_app.js`**, which unconditionally wrapped *every*
route in the portfolio's `LoadingScreen`, `ParticleNetwork`, `ScrollProgress`, and
`.scanlines`. **[fixed in 0.5]**

**Versions.** Next.js 16.3.5 (Turbopack), React 19.2.3, TypeScript 6
(`strict: true` but `checkJs: false`, so the all-`.js` app code is unchecked),
Tailwind 3.4, Node 26 local.

**Backend.** One API route, `pages/api/studio-lead.js`, validating and forwarding
to Supabase PostgREST. No other server code.

**Security headers** in `next.config.mjs`: `X-Content-Type-Options`,
`Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`.
Deliberately **no CSP**. Vercel adds HSTS.

---

## 2. Routes

| Route | File | Purpose |
|---|---|---|
| `/` | `pages/index.js` | Hero, bio, skills, stats, education, achievements, 3 featured projects |
| `/projects` | `pages/projects.js` | All 9 projects + `SecretProject` easter egg + hardcoded stats row |
| `/skills` | `pages/skills.js` | Skill bars, category chips, `SkillCube`, `GravitySkills` |
| `/certifications` | `pages/certifications.js` | 6 cert cards (own hardcoded list) |
| `/contact` | `pages/contact.js` | mailto form, socials, `TerminalGame` |
| `/404` | `pages/404.js` | Custom 404 |
| `/hire` | `pages/hire.js` | Shareable client landing page → `/studio/request` |
| `/studio` | `pages/studio.js` | Agency page → `/studio/request` |
| `/studio/request` | `pages/studio/request.js` | Lead capture form |
| `/studio/admin` | `pages/studio/admin.js` | Private lead dashboard, `noindex` |
| `/api/studio-lead` | `pages/api/studio-lead.js` | POST-only lead ingest |

**Navigation gaps (still open).** `Navbar` omits `/hire` entirely. `Footer` omits
both `/studio` and `/hire`. `/hire` is reachable only by direct URL or from
`/studio/admin`.

---

## 3. Data model

`data/portfolio.js` is the nominal single source, but **three pages bypass it**.

| Content | Canonical | Also duplicated in |
|---|---|---|
| Personal info | `personalInfo` | — |
| Stats (4) | `stats` | `Hero.js` ("11 / 9 / 500+"), `projects.js` ("10+ / 500+ / Yes"), `certifications.js` ("11+ / 3 / 2026") |
| Projects (9) | `projects` | Per-title visual map in `ProjectCard.js` |
| Certifications (11) | `achievements` | `certifications.js` has its own 6-item list |
| Skills | `skills` | `skills.js`, `SpotlightGrid.js`, `GravitySkills.js` each use different sets |
| Education (2) | `education` | — |
| Experience | `experience` | **Empty array** |
| Studio copy | — | Hardcoded in `hire.js` / `studio.js` |
| Leads | Supabase `studio_leads` | — |

**Live inconsistencies.** `projects` has 9 entries but `stats` claims "10+".
`achievements` has 11 but `/certifications` shows 6, with **two different verify
URLs for the same credential** (Google Cybersecurity: `U2DN4IX0N6H7` vs
`MDMFD7XJJXL4`; AI Essentials: `coursera.org/share/…` vs `…/verify/0YL581G13RX6`).

**The `featured` flag is dead** — all 9 projects are `featured: true`, so
`filter(featured).slice(0,3)` just takes the first three.

**Fabricated content.** `components/SecretProject.js` reveals an "Autonomous Drone
Swarm… currently in stealth mode" project that does not exist. Flagged for Phase 1.

---

## 4. Visual systems

**Global (`_app.js`):** boot-sequence `LoadingScreen` (~7s, session-gated),
`ParticleNetwork` (90 particles, depth parallax, mouse repulsion, reduced-motion
static frame, tab-visibility pause, DPR cap), `ScrollProgress`, `.scanlines`.

**3D:** `SkillCube.js` — raw Three.js, 6-material cube, full dispose on unmount.
**No React Three Fiber anywhere**, despite R3F being installed.

**Physics:** `GravitySkills.js` — Matter.js, 9 draggable pills, custom
`afterRender` text pass, full teardown.

**Hover/cursor:** `GlitchText` (RGB split), `SpotlightGrid` (cursor-following
radial gradient + per-card proximity glow), `ProjectCard` lift,
`.glass-panel`/`.surface-card` hover, `NeonButton`, `ResumeButton` gradient sweep.

**Scroll:** `whileInView` fadeUp across all pages, staggered card entrance,
`AnimatedStats` count-up, skill-bar fill, `Education` alternating slide-in,
navbar scroll state.

**Hero:** typing role cycler, 8 floating chips, two counter-rotating conic orbit
rings, two orbiting dots, spring-in status badge, sliding stat pills.

**Nav:** `layoutId` shared-layout underline, `AnimatePresence` mobile menu.

**Easter eggs:** `TerminalGame` (brute-force mini-game + confetti),
`SecretProject` (canvas wave-matching puzzle + confetti).

**Reduced motion:** global CSS block collapses durations; `ParticleNetwork`
renders one static frame. Framer `whileInView` transforms are **not** guarded.

---

## 5. Admin / backend

Entirely client-side. Statically prerendered; the *data* is what is protected.

- **Auth:** direct `fetch` to `/auth/v1/token?grant_type=password`. No
  `@supabase/supabase-js`. Sign-in only (signup form removed in `b97d5a0`).
  **No MFA** — placeholder files were created and deleted twice without
  implementation. Also accepts a session from a URL hash fragment.
- **Session:** `sessionStorage['ads-admin-session']`. Expiry checked once on
  mount. **The refresh token is stored but never used** — operators are silently
  logged out when the ~1h access token expires.
- **Leads:** `GET /rest/v1/studio_leads?...&order=created_at.desc` with the user's
  access token. **No pagination or limit** — fetches every lead on every refresh.
- **Statuses:** `new | contacted | qualified | won | closed`, PATCHed with an
  optimistic update and rollback on failure.
- **Keys:** publishable key hardcoded in both `admin.js` (ships to browser) and
  `studio-lead.js`. This is by design for a publishable key. No `.env` for
  Supabase; `.env.local` holds only an unused `GEMINI_API_KEY`.
- **`notified_at`** is selected and never written or displayed — an unfinished
  notification feature. **No lead notification of any kind exists.**

See `docs/portfolio-2026/supabase-security-review.md` for verified RLS findings.

---

## 6. Client funnel

```
/hire ──┐
        ├─► /studio/request ─► POST /api/studio-lead ─► Supabase ─► /studio/admin
/studio ┘                          (RLS)                          (manual polling)
```

`/api/studio-lead` is solid: method guard (405), honeypot returning a **fake 201**,
required-field checks, email regex, URL protocol validation, field truncation,
whitelisted `service`/`timeline`, generic client errors with server-side logging.

**Gaps:** the boot screen fired on `/hire` and `/studio/request` **[fixed in 0.5]**;
no notification; no confirmation email; no rate limiting beyond the honeypot;
`/hire` unreachable from the site; two overlapping top-of-funnel pages.

---

## 7. SEO (pre-0.5)

All of the following were fixed in Phase 0.5:

- `_document.js` hardcoded `<link rel="canonical" href="https://amarjaleel.dev">`
  on **every page**. `amarjaleel.dev` **does not resolve**. `lib/site.ts` declared
  the same dead domain.
- `/studio` and `/studio/request` emitted **two conflicting canonicals**.
- **The homepage had no `<title>` at all.**
- Two `<meta name="description">` on most pages.
- `/studio/admin` emitted `noindex,nofollow,noarchive` **and** a conflicting
  `index, follow` from `_document`.
- `og:image` pointed at `/images/og-image.png`, which **404'd** → no social
  previews anywhere. `/favicon.ico` and `/apple-touch-icon.png` also 404'd.
- `/studio/request` missing from the sitemap; `/studio/admin` not disallowed in
  robots.txt.

Still open: JSON-LD is only a `Person` — no `ProfessionalService` for Amar Digital
Systems, no `FAQPage` despite `/studio`'s FAQ, no `CreativeWork` for projects. Two
`<h1>` on the homepage. Fonts loaded via render-blocking `<link>` rather than
`next/font`. No analytics.

---

## 8. Resume

`public/resume.html` — hand-written static HTML, no generation, no PDF.
"Download Resume" opens a web page. Shares nothing with `data/portfolio.js`.

| | Resume | Portfolio |
|---|---|---|
| Projects | 4 | 9 |
| Missing | — | **VeriPatch** (npm-published), BuildSphere, CS Learning by Game, TODO Tracker Pro, Bus Reservation |
| Certifications | 6 | 11 |
| Education | "Currently Pursuing", no institution, no dates | Sukkur IBA University, 2023–2027 + Intermediate |

Omits the entire Amar Digital Systems angle and contains no link back to the site.

---

## 9. Mobile / responsive

Tailwind breakpoints on the portfolio; hand-written media queries on the Studio
side. Global `overflow-x: clip` on `html`/`body`.

**Measured at 638px viewport:**
- `document.body.scrollWidth` = **666px** — real overflow, *masked* by
  `overflow-x: clip`, not fixed. Offenders: Education timeline rows (from Framer's
  `initial={{ x: ±50 }}`) and the hero's blurred gradient orbs.
- **5.96 MB hero portrait** eagerly preloaded into a ≤384px circle. **[fixed in 0.5]**
- Three concurrent rAF loops (particles, Matter.js, Three.js) with no device gate.
- **The particle canvas paints over body text** — the fixed canvas is a positioned
  element at `z-index: 0`, so it paints above non-positioned block content.
  Visible on `/skills`. **Still open.**
- Several sub-44px touch targets.
- Mouse-only interactions inert on touch: `SpotlightGrid` shows a permanent
  "Move your mouse to reveal the tech stack" hint with no touch path, leaving the
  stack at 40% opacity.

---

## 10. Components worth preserving

`ParticleNetwork` (well-built: DPR cap, debounced resize, visibility pause,
reduced-motion path, full cleanup), `Hero` (orbit-ring portrait, typing cycler),
`GravitySkills`, `SkillCube` (correct Three.js disposal), `GlitchText`,
`ProjectCard` (bespoke per-project SVG/gradient system), `SpotlightGrid`,
`TerminalGame`, `SecretProject`, `AnimatedStats`, `Education`, `Achievements`,
`LoadingScreen`.

Design system: `globals.css` helper classes, `tailwind.config.js` palette and
keyframes, the three Studio CSS Modules (709 lines).

Backend: the `studio-lead.js` validation patterns and the `studio_leads` schema.

---

## 11. Risks

1. **No tests, no CI** (CI added in 0.5; tests still absent).
2. **`checkJs: false`** — all app code untyped.
3. **Content duplicated in six places**, already drifted (§3).
4. **`ProjectCard` keyed by exact title string** — renaming a project silently
   downgrades its card to the generic fallback.
5. **Two competing design systems** with no shared tokens.
6. **Admin has no token refresh.**
7. **Supabase public signup is enabled** — see the security review.
8. **~2,400 lines of dead Codex Infinitum code** — see the salvage audit.
9. **README is wrong**: claims "Next.js 13+ (React 18)" and "No backend, just
   static + SSG". `PROJECT_STATUS_REPORT.md` is dated January 2026 and describes 3
   projects, a radar chart, and Formspree — none of which match the code.
10. **7 npm vulnerabilities** (1 low, 3 moderate, 3 high).

---

## 12. Validation results (at `fa96654`, pre-0.5)

| Check | Result |
|---|---|
| `npm install` | Pass (exit 0), 7 vulnerabilities reported |
| `npm run build` | **Pass** — 11 routes, TypeScript clean |
| `npm run lint` | **Broken** — `next lint` was removed in Next 16; misparsed `lint` as a directory and exited 0 without linting |
| `npx eslint .` | **18 errors, 3 warnings** |
| Tests | None configured |

Error breakdown: 6× `react-hooks/set-state-in-effect`, 8×
`react/jsx-no-comment-textnodes`, 4× `react/no-unescaped-entities`; warnings for
`no-img-element` and two `exhaustive-deps`. All resolved in Phase 0.5.
