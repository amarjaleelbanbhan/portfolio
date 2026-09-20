# Content Audit

**Date:** 2026-09-18
**Phase:** 1 — Credibility and Content Corrections
**Purpose:** record every public claim that was inaccurate, stale, unsupported or
duplicated; what Phase 1 did about it; and what still needs the Phase 2 canonical
model.

All verification was done on 2026-09-18 against the GitHub API (authenticated as
the repository owner), the npm registry, and live HTTP checks of every outbound
link.

---

## 1. Claim reconciliation

| Claim | Current locations (pre-Phase 1) | Verified value | Phase 1 action | Phase 2 migration needed |
|---|---|---|---|---|
| "11 Google certs" | `Hero.js` bio line, `Hero.js` stat pill, `index.js` about copy | **False.** 11 credentials total, but 9 Google + 2 Udemy | Replaced with "6 merged upstream PRs"; about copy now says six merged PRs; pill now "Merged Upstream PRs" | No |
| "9 shipped projects" | `Hero.js` bio line, `Hero.js` stat pill | Unsupported — "shipped" was never defined; several were unshipped experiments | Bio line now "1 published npm package / 1 system in production"; pill now "5 Flagship Systems" | No |
| "500+ commits" | `Hero.js` bio line, `stats` array, `projects.js` stats row | Unverifiable vanity metric | Removed everywhere | No |
| "Projects Completed 10+" | `stats` array, `projects.js` stats row | **False.** 9 projects were listed | Removed; `projects.js` stats row replaced with the open-source contributions list | No |
| "Courses Completed 15+" | `stats` array | Unverifiable | Removed | No |
| "Certifications 11+" | `stats` array, `certifications.js` stats row | 11 exactly; the "+" was wrong | `stats` now "Verified Credentials: 11"; `certifications.js` stats row removed entirely | No |
| "3 Google Professional Certs" | `certifications.js` stats row | True (Cybersecurity, Data Analytics, AI Essentials) but part of a de-emphasised vanity row | Row removed — credentials are now framed as supporting evidence | No |
| "2026 Latest Issued" | `certifications.js` stats row | **False.** Latest credential is Nov 2025 | Row removed | No |
| Google Cybersecurity verify link | `certifications.js` used `U2DN4IX0N6H7`; `data/portfolio.js` used `MDMFD7XJJXL4` | `U2DN4IX0N6H7` resolves to a **Google Data Analytics** certificate — the card linked to the wrong credential | `certifications.js` now reads from `data/portfolio.js`, which carries the correct `MDMFD7XJJXL4` | No |
| Google AI Essentials verify link | `certifications.js` used `coursera.org/share/cccb…`; `data/portfolio.js` used `…/verify/0YL581G13RX6` | Both resolve; the `verify/` form is the canonical accomplishment URL | Single source now uses `verify/0YL581G13RX6` | No |
| Certification list length | `data/portfolio.js` had 11; `certifications.js` rendered 6 | 11 is correct | `certifications.js` renders all 11 from the single source | No |
| Skill proficiency percentages ("Python 90%", "JavaScript 85%", …) | `data/portfolio.js` `skills.languages`, `pages/skills.js` `languageSkills` | Self-assigned; measures nothing | Percentages removed. Each language now lists the projects it was used in | Yes — Phase 16 replaces this with full `SkillEvidence` |
| Skill category contents | `data/portfolio.js` `skills.categories`, `pages/skills.js` `categories`, `SpotlightGrid.js`, `GravitySkills.js` | Four different sets, all divergent | `skills.js` now reads `data/portfolio.js`. Categories re-scoped to the real domains | Partly — `SpotlightGrid` and `GravitySkills` still hold their own sets |
| "Currently learning" list | `data/portfolio.js` `skills.learning`, `pages/skills.js` `currentlyLearning` | Two divergent lists | `skills.js` now derives from `data/portfolio.js` | No |
| Bus Reservation System | `data/portfolio.js` projects | **Repository returns 404** | Removed from the portfolio entirely | No |
| MediTalk "85% accuracy", "diagnosis-style responses" | `data/portfolio.js` description | Accuracy figure unverifiable; framing implied clinical capability | Reframed as an educational ML prototype, explicitly never clinically validated, never intended for medical use. Accuracy claim removed. Status `Archived` | No |
| "AI Product Engineer" / "Data Analytics Engineer" identity | `personalInfo.title`, `personalInfo.tagline`, `Hero.js` roles | Not supported by current work | Title → `Software Engineer`; tagline → `Product · AI · Security · Systems`; typing roles rewritten to the five real domains | No |
| Hero bio ("a medical voice agent", "3D floor planner") | `Hero.js` | Accurate but led with archived student work | Rewritten to lead with RODIFT, VeriPatch and KnowledgeGuard | No |
| "Autonomous Drone Swarm … stealth mode" | `SecretProject.js` | **Fabricated.** No such project exists | Reveal replaced with an honest "ACCESS GRANTED / you found one of the hidden experiments" message plus real links. Puzzle, sliders, canvas, confetti and unlock animation all preserved | No |
| `featured: true` on all 9 projects | `data/portfolio.js` | Flag was meaningless — homepage just took the first three | Homepage now selects `tier === 'primary'` | Yes — Phase 2 formalises `featured` + `priority` |
| Resume: 4 projects, 6 certs, no institution | `public/resume.html` | Omitted VeriPatch, RODIFT and all current work | Rewritten around the five primary systems + Emergency Mesh + all 7 OSS contributions; portfolio URL and GitHub added; institution and dates added | Yes — Phase 18 generates it from canonical data |

---

## 2. Project status assignments

Every status is backed by repository evidence. Where evidence was weaker than the
roadmap's suggested status, the **weaker** status was chosen.

| Project | Repo | Visibility | Status assigned | Evidence |
|---|---|---|---|---|
| RODIFT | `VisiRoD` | Private | **Production** | Tagged `v2.0.0`; README describes a delivered enterprise platform for a field-sales organization; a live privacy policy is published via GitHub Pages (a store-distribution requirement) |
| VeriPatch | `VeriPatch` | Public | **Released** | 9 GitHub releases, latest `veripatch@0.3.1`; published on npm with 5 versions |
| KnowledgeGuard / EGB | `knowledgeguard` | Private | **Research** | README: "benchmark built on real data, the E2 factorial executed, analysis complete" |
| CortexWard | `CortexWard` | Public | **Pre-alpha** | The project's own README status badge reads `status-pre--alpha` |
| SceneForge | `scene-forge` | Private | **Active Development** | No releases or tags; last push 2026-08-16. `Completed` was not chosen — nothing marks it finished |
| Emergency Mesh | `emg-mesh` | Private | **Active Development** | README: "in active development … Not yet installable as a finished product, and not yet suitable for real emergencies" |
| CS Learning by Game | `CS-learning-by-game` | Public | **Active Development** | No releases; last push 2026-08-15 |
| BuildSphere | `BuildSphere` | Public | **Prototype** | No releases, no deployed demo |
| TODO Tracker Pro | `todo-tracker-pro` | Public | **Completed** | **Not** `Released` — the VS Code Marketplace listing returns 404 and there are no GitHub releases |
| VICE OS | `VICE-OS` | Private | **Research** | Repository is 0 KB with only a README. Presented as "Current FYP — Research & Architecture Stage" |
| ZakatLink | `ZakatLink` | Public | **Archived** | Last push 2026-01-07 |
| MediTalk | `MediTalk_AI_Agent` | Public | **Archived** | Last push 2026-07-04; superseded by current work |
| Smart Notebook | `Smart-Notebook` | Public | **Archived** | Last push 2026-07-04 |
| EduResource Hub | `EduResource_Hub` | Public | **Archived** | Last push 2026-07-04 |

**Five of the ten strongest projects are private repositories.** They are listed
with a "Private repository" marker instead of a repo button, so no visitor hits a
404. This is a structural constraint the roadmap should plan around — see §6.

---

## 3. Open source contributions

All seven verified against the GitHub API. Six merged, one open.

| Contribution | Status | Verified |
|---|---|---|
| `pydantic/pydantic-ai#5969` | Merged 2026-07-01 | ✓ |
| `promptfoo/promptfoo#9781` | Merged 2026-06-21 | ✓ |
| `cobusgreyling/loop-engineering#395` | Merged 2026-07-27 | ✓ |
| `cobusgreyling/loop-engineering#437` | Merged 2026-07-31 | ✓ |
| `MCP-Audit/MCTS#233` | Merged 2026-06-11 | ✓ |
| `AcademySoftwareFoundation/dna#195` | Merged 2026-09-17 | ✓ |
| `shaal/eye-tracker#61` | **Open** | ✓ |

**Correction to the roadmap:** the brief listed these as "loop-engineering #395 /
#437" without an owner. The upstream is `cobusgreyling/loop-engineering`, not
`block/goose` — `goose#395` and `goose#437` are unrelated PRs by a different
author. Recorded here so Phase 14 uses the right URLs.

---

## 4. Link verification

| Link | Result | Action |
|---|---|---|
| `github.com/…/Bus-Reservation-System` | **404** | Project removed |
| `github.com/…/ZakatLink` | 200 | Kept (archive) |
| `github.com/…/Smart-Notebook` | 200 | Kept (archive) |
| `github.com/…/EduResource_Hub` | 200 | Kept (archive) |
| `amarjaleelbanbhan.github.io/EduResource_Hub/` | 200 | Kept (archive) |
| `github.com/…/MediTalk_AI_Agent` | 200 | Kept (archive) |
| `github.com/…/VeriPatch` | 200 | Kept |
| `npmjs.com/package/veripatch` | Registry confirms v0.3.1 | Kept |
| `github.com/…/CortexWard` | 200 | Kept |
| `github.com/…/CS-learning-by-game` | 200 | Kept |
| `github.com/…/todo-tracker-pro` | 200 | Kept |
| `github.com/…/BuildSphere` | 200 | Kept |
| All 9 Coursera credential URLs | 200, content-checked | Kept (one corrected — see §1) |
| Both Udemy credential URLs | 200 | Kept |
| `linkedin.com/in/amarjaleel/` | 999 | Kept — LinkedIn's standard anti-bot code, not a broken link |
| `npmjs.com/package/veripatch` (web UI) | 403 | Kept — npm blocks non-interactive clients; the **registry API** confirms `veripatch@0.3.1` with 5 published versions |

**Note on the anti-bot responses.** Udemy initially returned exit code 000 to
scripted requests and was re-checked; both certificate URLs resolve with 200.
LinkedIn's 999 and npm's 403 are documented anti-automation responses from those
sites, not link failures — both were confirmed working by other means.

---

## 5. Remaining duplication for Phase 2

Phase 1 reconciled the contradictions but did not perform the canonical
migration. What is still duplicated:

| Content | Still duplicated in | Why it was left |
|---|---|---|
| Skill sets | `SpotlightGrid.js` (renders `skills.categories` — now shared) and `GravitySkills.js` (own hardcoded 9-item list) | `GravitySkills` needs short labels for physics bodies; Phase 16 reworks it |
| Project visuals | `ProjectCard.js` keyed by **exact title string** | Renaming a project silently downgrades its card to the generic fallback. Phase 2 should key visuals off a stable `id`/`slug` instead |
| Hero stat pills | `Hero.js` hardcodes `6` and `5` rather than deriving from `stats` / `projects` | Phase 4 rebuilds the hero; deriving now would be thrown away |
| Hero bio prose | `Hero.js` and `index.js` both describe the same work in different words | Phase 2 `SiteContent` model |
| Studio/Hire copy | `pages/hire.js`, `pages/studio.js` | Out of Phase 1 scope; client funnel content is unaffected by these corrections |
| Resume content | `public/resume.html` mirrors `data/portfolio.js` by hand | Phase 18 generates it |
| Open source list | `data/portfolio.js` `openSource`, rendered on `/projects` | Phase 14 moves it to `/open-source` |
| Credential descriptions | `data/portfolio.js` only (reconciled) | Done |

---

## 6. Findings that affect the roadmap

1. **Half the flagship work is in private repositories** (RODIFT, KnowledgeGuard,
   SceneForge, Emergency Mesh, VICE OS). The case-study phases (8, 10, 12, 13)
   cannot link to source. They will need sanitised architecture diagrams,
   screenshots, or extracted artefacts, and Phase 7's `GitHubEvidence` component
   needs a defined "private" state.
2. **RODIFT is client work for a named organization.** The repository README and
   the public privacy policy identify a real company and contact address. Phase 8
   must describe the system without naming the client; this audit and the site
   copy both refer to it only as "a field-sales organization".
3. **VICE OS has no implementation** — the repository is 0 KB with a single
   README. "Research & Architecture Stage" is accurate and must not drift upward
   without new evidence.
4. **TODO Tracker Pro is not published.** The roadmap suggested "Released or
   Completed"; the Marketplace 404 settles it as `Completed`.
5. **The `loop-engineering` upstream was mis-attributed in the brief** (§3).
6. **`LINKEDIN_POST.md`, `PROJECT_STATUS_REPORT.md`, `Data.md` and `README.md`
   are all stale** and contradict the current site. They are not shipped, so they
   were left alone, but they should be rewritten or deleted before the repository
   is shown to anyone.
