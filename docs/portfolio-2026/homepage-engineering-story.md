# Homepage Engineering Story

**Date:** 2026-09-19
**Phase:** 5 — Cinematic Homepage Engineering Story

The scroll narrative beneath the Phase 4 hero:
`BUILT → VERIFIED → RESEARCHED → SYSTEMS → CONTRIBUTED`.

---

## 1. What it is

The hero introduces five engineering domains. This section shows what was
actually built in them. Five stages, each anchored to a real project or to real
upstream contributions, each carrying the status that project genuinely has and
the limitations it genuinely has.

It is deliberately **not** five project cards with scroll animations. Each stage
explains how a system works, using a diagram built for that system's particular
shape, and each diagram is labelled as a drawing rather than presented as a
recording.

---

## 2. Stage architecture

```
content/story.ts                authored choreography only
      │                         (titles, explanation, step labels, caveat, href)
      ▼
lib/content/selectors.ts        getStoryStages()
      │                         ├─ project      ← getProjectBySlug()
      │                         ├─ research     ← getResearchBySlug()
      │                         ├─ proof        ← verified entries only
      │                         ├─ limitations  ← project + research, de-duped
      │                         ├─ technologies ← skill registry
      │                         └─ contributions← getContributionsForDisplay()
      ▼
components/story/
  EngineeringStory.js           layout, active-stage tracking
    ├─ useActiveStage.js        IntersectionObserver → emphasis only
    ├─ StageProgress.js         progress rail + in-page navigation
    ├─ StoryStage.js            heading, copy, steps, evidence, limitations
    └─ StageDiagram.js          lazy-loads the right diagram + caveat
         └─ diagrams/
              DiagramPrimitives.js   shared node/link/pulse/frame vocabulary
              BuiltDiagram.js        connected application architecture
              VerifiedDiagram.js     verification pipeline with isolation box
              ResearchedDiagram.js   5 × 6 factorial grid
              SystemsDiagram.js      BLE network with an out-of-range peer
              ContributedDiagram.js  upstream contribution graph
```

### The split between authored and derived

`content/story.ts` holds only what cannot be looked up: stage titles, the
explanatory sentences, the labelled steps of each pipeline, the caveat and the
destination. Writing "field report → validation → backend" is a writing job, not
something derivable from a project record.

Everything checkable is derived. There is no second project database inside the
animation components — no statuses, no counts, no technology names, no URLs.

### Validation

Nine rules were added so authored copy cannot drift away from the projects it
describes:

| Rule | Prevents |
|---|---|
| exactly 5 stages, unique ids | a half-told narrative |
| `kicker` order matches BUILT→…→CONTRIBUTED | the argument being reordered by accident |
| domain is canonical *and* is a core domain | the story and the hero disagreeing |
| `projectSlug` exists | a stage about a project that was removed |
| **stage domain is one of that project's domains** | telling a security story about non-security work |
| every stage has a caveat | an illustration passing as a recording |
| ≥3 steps, unique step ids | an empty or broken pipeline |
| `href` route exists | linking at a page a later phase has not built |
| `#anchor` matches a real project slug | a link that scrolls nowhere |

Each was confirmed to fire by deliberately breaking it.

---

## 3. Stage-by-stage

| Stage | Project | Status shown | Visual |
|---|---|---|---|
| BUILT | RODIFT | Production | Mobile → validation → geo-match → backend → assign → notify → dashboard |
| VERIFIED | VeriPatch | Released | Linear pipeline with an explicit isolation/container boundary |
| RESEARCHED | KnowledgeGuard | Research | 5 × 6 factorial grid, deliberately uniform |
| SYSTEMS | Emergency Mesh | Active Development | BLE network with one reachable peer and one out of range |
| CONTRIBUTED | 7 upstream PRs | merged / open per record | Own-work node linked to upstream repositories |

### Facts and limitations represented

- **RODIFT** — verified proof: tagged release v2.0.0, published privacy policy.
  Limitation surfaced: client-owned, repository and operational data cannot be
  public. No client outcomes, users, revenue or deployment metrics are shown, and
  the diagram imitates no real screen.
- **VeriPatch** — verified proof: npm v0.3.1, 9 GitHub releases. The caveat says
  plainly that verifying one advisory is eliminated is not the same as
  eliminating all vulnerabilities or supply-chain risk.
- **KnowledgeGuard** — the five deficiency types are the ones named in the
  canonical research question. The grid is **uniform on purpose**: the canonical
  record says the factorial was executed and analysis completed, and publishes no
  results, so no cell is shaded to suggest a winning strategy and no numbers
  appear. The caveat states it does not establish a universal or final repair
  policy.
- **Emergency Mesh** — the honesty is built into the drawing, not only the words:
  the third node is drawn **out of range**, its link dashed, with no pulse and no
  acknowledgement. Animating a clean multi-hop delivery would imply live
  multi-hop relay has been validated across physical devices, and the canonical
  research record says it has not. All three documented limitations are listed.
- **Open Source** — all 7 contributions with canonical URLs and current statuses,
  6 merged and 1 open. The open PR is rendered as open, with a hollow dashed
  marker in the graph. No score, ranking, or simulated activity graph.

---

## 4. Interaction model

Scroll position decides **emphasis only** — which diagram the sticky panel shows
and which marker is lit on the rail. It never decides whether content is visible.

That is the load-bearing rule. Phase 1 shipped scroll-triggered entrances on
`/projects` and jump-scrolling left real cards stranded at `opacity: 0`; Phase 3
made "entrances animate on mount" a rule of the shared motion system. So every
stage here is fully rendered and readable from first paint, and if
`IntersectionObserver` never fires the reader loses a highlight and nothing else.
`useActiveStage` defaults to the first stage rather than to none, so the sticky
panel always has something real to show.

Active stage is chosen by comparing intersection ratios across a band in the
middle of the viewport, rather than reacting to each boundary crossing — that
keeps fast scrolling from flickering between neighbours.

The progress rail doubles as in-page navigation: five real anchor links, so the
stages are reachable by keyboard and by jump link, and the reader sees the shape
of the argument before scrolling through it.

---

## 5. Connection to the Engineering Core — and why it is not synced

The five stages map one-to-one onto the Core's domains (BUILT→product,
VERIFIED→security, RESEARCHED→ai, SYSTEMS→systems, CONTRIBUTED→open-source), and
they share the same `data-domain` attribute and the same `--domain-*` accent. The
colour that lit a node in the hero is the colour heading its chapter here.

**The story does not drive the Core, and `useCoreInteraction` was not forked.**

The reason is concrete rather than stylistic: by the time the story is being
read, the hero canvas is scrolled off-screen, and `SceneCanvas` deliberately
switches to `frameloop="demand"` when off-screen. Driving the Core from scroll
would either update something nobody can see, or require keeping an off-screen 3D
canvas rendering — which Phase 5 explicitly rules out. It would also risk
overriding a domain the visitor had deliberately selected.

So the connection is the shared domain identity, which costs nothing and cannot
desync. Verified: the story adds **no extra canvas** (the page still has exactly
two — the ambient particle field and the Core).

---

## 6. Motion choreography

All from the Phase 3 motion system; no animation framework was added.

- Stage content uses `fadeUp()` with small staggered delays — mount-based.
- Diagram links draw themselves with `pathLength`, so a connection reads as data
  moving through a system rather than appearing all at once.
- `DiagramPulse` sends a packet along a path; it is decoration reinforcing the
  link it follows, so it is dropped entirely under reduced motion rather than
  slowed.
- The rail's active ring moves with a Framer `layoutId`, so switching stages
  slides the indicator rather than snapping it.
- The factorial grid's cells appear on a short per-cell stagger, which reads as a
  design being filled in.

Each stage has a beginning (kicker + heading), an explanation (lede, body, steps)
and a conclusion (evidence, limitations, link), so the argument survives fast
scrolling.

---

## 7. Layout

Two compositions rather than one squeezed:

- **Wide (`lg`+)** — narrative column on the left, a sticky column on the right
  holding the progress rail and the diagram for whatever is being read.
- **Narrow** — the rail becomes a horizontally scrollable strip at the top, and
  each stage carries its own diagram inline beneath its text. No sticky panel, no
  scroll-jacking, normal page scrolling throughout.

Mobile conveys the same engineering facts: same steps, same evidence, same
limitations, same caveats. Diagrams share one 320×200 coordinate space and scale
fluidly, so nothing is a wide desktop diagram crushed into a narrow viewport.

Verified: no horizontal overflow at 360, 390 or 430 px.

---

## 8. Accessibility

- **The text is the content.** Every diagram's information exists as prose: the
  pipeline is an ordered `<ol>` with a label and a sentence per step, evidence is
  a list of badges, limitations are a list. A reader who never sees a drawing
  loses nothing.
- Each diagram carries `role="img"` and a full `aria-label` describing what it
  shows.
- Semantic structure: one `<h1>` (the hero), `<h2>` for the story, `<h3>` per
  stage, `<h4>` for the sub-blocks. Stable ids on every stage.
- The rail is a `<nav>` of real links with `aria-current` on the active one, and
  the active stage is signalled by weight *and* colour, never colour alone.
- Reduced motion: diagrams render complete and static rather than empty; pulses
  are removed; nothing is left mid-animation. Verified: 0 hidden elements, all 32
  step items present.
- Contribution links are ≥44 px tall on touch.
- Nothing depends on hover: statuses, links and descriptions are all permanently
  in the DOM.

---

## 9. Performance

Measured on a production build, same machine, same method as Phase 4.

| | Before | After |
|---|---|---|
| `/` static JS | 1484 KB | **1558 KB** (+74 KB, +5%) |
| `/` CSS | 66 KB | 67 KB |
| `/` `domInteractive` | 251 ms | **150 ms** (median of 5) |
| `/hire` static JS | 488 KB | **488 KB** (unchanged) |
| Canvases on `/` | 2 | **2** (unchanged) |

The +74 KB is the five diagrams and the story components. It is explainable and
bounded: everything is SVG and Framer Motion, no stage loads a Three.js scene,
and `/hire` is byte-identical, confirming nothing leaked into the client funnel.

Decisions that kept it there:

- **No second 3D stack.** The homepage already carries one for the Core; nothing
  in this narrative needs perspective or lighting to be understood.
- **Diagrams are lazily loaded** with `ssr: false`, behind fixed-ratio
  placeholders so lazy loading cannot cause layout shift.
- **No new render loops.** The only continuous motion is SVG `animateMotion` on
  the packet pulses, which the browser schedules; there is no `requestAnimationFrame`
  anywhere in this phase.
- **Text is independent of visuals.** Stage copy is server-rendered and readable
  before any diagram arrives.

**FCP is not reported as a comparison.** Across five runs on the same build it
ranged 1872–4072 ms — a 2.2× spread — because this is headless Chrome using
software rasterisation. `domInteractive` was stable (145–164 ms) and is the
number worth trusting. No figure here should be read as real-device performance.

---

## 10. Homepage changes

Final section order:

1. Hero (Phase 4) — unchanged
2. **Engineering story (new)**
3. About / bio terminal panel
4. Skills matrix (`SpotlightGrid`)
5. Evidence stats (`AnimatedStats`)
6. Education
7. Achievements
8. Featured projects (`#projects`)

**One block was removed:** the centred name/tagline/"VIEW MY WORK" section that
sat directly under the hero. After Phase 4 it repeated what the hero already
says — name, positioning and a work call-to-action — and it carried a **second
`<h1>`**, leaving the page with two top-level headings. Its `ResumeButton` was
the only thing it added, and that moved into the bio panel, where a CV belongs.
Verified: the page now has exactly one `<h1>`.

No component was deleted. `GlitchText` and `NeonButton` are still in the
repository and `GlitchText` is still used by the hero; only their now-unused
imports were removed from `pages/index.js`. The `#projects` anchor and all
navigation are intact.

---

## 11. Known limitations

1. **Diagrams are authored illustrations.** Every one is labelled as such in its
   caption. They describe architectures accurately but they are drawings, and the
   projects' own `architecture` / `technicalDepth` / `verification` fields remain
   empty in canonical content — the case-study phases fill those with real
   material.
2. **KnowledgeGuard shows no results.** By design: the canonical record publishes
   none. When the study is publishable, the grid can carry real values.
3. **The `research` domain has no stage of its own.** Research surfaces through
   KnowledgeGuard under AI; Phase 15 gives it a page.
4. **Destinations are all `/projects` anchors**, as in Phase 4. Phases 6/14/15
   should repoint them, which is one line per stage plus the route in
   `EXISTING_ROUTES`.
5. **Limitation de-duplication is prefix-based.** A project and its research
   record state the same limitation with different connectives; the first 60
   normalised characters are compared. Two genuinely different limitations sharing
   a 60-character opening would collapse — unlikely, and the failure mode is
   showing one of two near-identical sentences.

---

## 12. Phase 6 integration guidance

Phase 6 builds `/work`.

1. **Reuse `getStoryStages()` shape, not the components.** `/work` is a catalogue;
   this is a narrative. The useful part to carry over is the pattern of authored
   copy joined to canonical facts at the selector layer.
2. **Reuse the diagrams.** `components/story/diagrams/*` are standalone and take
   only `color`, `reduced` and (for the contribution graph) `contributions`. A
   case-study page can mount the relevant one directly.
3. **Repoint the destinations.** When `/work` ships, update `href` in
   `content/story.ts` and add the route to `EXISTING_ROUTES` in
   `lib/content/validation.ts` in the same commit, or validation will reject it.
4. **Do not duplicate the narrative on `/work`.** If a project appears in both,
   the story should link to the work page rather than restating it.
5. **Keep the mount-based entrance rule.** It applies to every phase.
6. **Stage ids are stable** (`story-built` … `story-contributed`) and safe to
   deep-link from navigation or from `/work`.
