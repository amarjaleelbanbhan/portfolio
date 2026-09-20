# Evidence-Backed Skills and the Skill Galaxy

**Date:** 2026-09-20
**Phase:** 16 — Evidence-Backed Skills
**Route:** `/skills` (plus the homepage `TECH_STACK` section)

Every technology on the site is now attached to something a reader can open.

---

## 1. One list, not three

Before this phase `/skills` carried three presentations of the same registry: a
languages column with its evidence, eight category panels of chips, and the
physics pills. All read from canonical content, and none was obviously the real
answer.

The Galaxy is now the single skill surface. What stayed, and why:

| Kept | Why |
|---|---|
| `SkillCube` | A visual signature, not a list. |
| `GravitySkills` | The physics playground. Not a reference, and never was. |
| `SpotlightGrid` (homepage) | The spotlight is a signature; it now shows evidence and links into the Galaxy. |
| "Currently learning" | Deliberately *not* skills — there is nothing to attach yet, and the page says so. |

Deleted: `components/SkillBar.js`. Unused, and it was the literal "Python 90%"
bar the phase exists to prevent — dead code that invites reintroduction.

---

## 2. What the Galaxy shows

**Nodes are skills. Edges are shared work, not resemblance.**

Two skills are joined because they were used on the same project, research entry
or pull request — a fact in the records. The clusters that emerge (Flutter beside
Dart, BLE and cryptography; Python beside RAG and evaluation) emerge because
those things were genuinely built together, and every one can be opened.

```
26 technologies · 9 clusters · 73 evidence links · 83 shared-work connections
```

All four figures are counted, not written down.

Interaction, in the order the brief asks for it:

1. **Select a category** → its cluster lights, the others dim to 0.32.
2. **Select a skill** → its edges draw, its co-used skills highlight.
3. **The panel fills** with the projects, research and pull requests it was used
   in — each a link.
4. **Open one** → a case study, a project card, a research entry, or the pull
   request on GitHub.
5. **"Used alongside"** moves to a neighbouring skill without leaving the board.

`#skill-<slug>` deep-links to a skill with its evidence open, which is what the
homepage tech stack points at.

### Why this is not WebGL

The brief allows a 3D visualisation "if it genuinely improves the experience".
It would not. The information here is labels and relationships: in three
dimensions labels face away from the camera, nodes occlude each other, and
hit-testing becomes a chore on a phone. The project already has WebGL where it
earns its place — the Engineering Core and the skill cube — and a second full
scene would cost every visitor a bundle in exchange for a harder interface.

So the Galaxy is DOM and SVG. **Every skill is a real `<button>` in document
order**, which means there is no separate "2D fallback" to keep in sync: tab
order, focus rings, 44px touch targets and screen reader output are properties
of the only implementation there is. Nothing depends on hover, and nothing
depends on dragging.

### Layout

Skills sit in category islands laid out by CSS grid, so the arrangement survives
any viewport with no coordinate table. Edge endpoints are **measured from the
live DOM** and re-measured on resize and after web fonts load, which is what
keeps the lines attached when the grid reflows from three columns to one. Before
the first measurement there are simply no lines, and the board is fully usable
without them.

The initial measurement comes from `ResizeObserver`, which fires once on
`observe()`. That is deliberate: it avoids `setState` in an effect body, which
the project's lint rules reject, and it means there is no separate "first paint"
code path that could disagree with the resize path.

---

## 3. Content corrections this forced

Building the evidence links surfaced four claims that were not supported.

| Change | Why |
|---|---|
| **`linux` removed** | It carried no project, contribution or research reference at all. A skill's claim to exist in this model is the work it points at. |
| **`python` no longer cites `AcademySoftwareFoundation/dna#195`** | That change is one line of Markdown in a Python project. It is evidence of reading a README. |
| **`javascript` no longer cites `loop-engineering#395`** | That diff is `action.yml` and a README. |
| **`github-actions` added** | #395 *is* real work — hardening a GitHub Action against unquoted shell expansion — and now has a skill that honestly describes it. |

`typescript` also gained `loop-engineering#437`, whose diff is TypeScript source.

### The portfolio is now a canonical project

The brief's evidence examples name the portfolio twice (TypeScript, Supabase
Studio), and citing it required it to exist in the record. It was verified
before being added: the repository is **public**, and the site returned **200**
on 2026-09-20.

Recorded as `tier: secondary`, `status: active-development` — live and in use,
but the admin and CMS work is unfinished, and `production` is reserved for
systems an organisation depends on. Two verified proofs: the live deployment and
the CI gate that runs content validation, lint and a build on every push. Two
limitations recorded: content is typed modules rather than a database, and the
Supabase write path is the enquiry flow only.

---

## 4. Validation rules added

```
skill: has no project, contribution or research evidence
skill: cites <repo>#<n> as evidence, but that change is in <languages>
```

The first is Phase 16's central rule — a label with nothing behind it is the
self-assessed percentage again, just without the number.

The second applies to `Languages`-category skills only, and it is what caught the
`python`/`#195` and `javascript`/`#395` errors above. A language skill citing a
pull request now has to be cited back by that pull request's own language list.

---

## 5. Three defects the browser pass found

**1. The skill cube could not shrink, so the page overflowed after a resize.**
Three.js sizes its canvas in pixels at mount. A grid or flex item's automatic
minimum size is its content, so that canvas stopped its box from ever getting
narrower: the container never shrank, the resize observer never fired, and the
page ran 196px past a 360px viewport after a rotation. Two changes fix it
properly rather than hiding it — `overflow-hidden` on the wrapper, which sets the
automatic minimum to zero and lets the box shrink at all, and a real resize
handler that updates the renderer size and the camera aspect instead of letting
CSS squash the projection. (Loading directly at 360px had always been fine; it
was only rotation and pane-resize that broke, which is exactly the case a desktop
test misses.)

**2. Cluster headings were 23px tall on desktop.** They carried
`sm:min-h-0`, which is right for a chip in a dense group and wrong for a control.
Now 44px on touch and 32px on a pointer, both above the WCAG 2.2 minimum.

**3. `/work#meditalk` scrolled nowhere.** The evidence panel links a project
without a case study to its card on `/work`, and archived projects live behind a
collapsed panel, so the anchor had no target. `/work` now expands the archive
when the hash matches an archived slug and scrolls to it — the anchor resolves
without putting earlier work in front of the reader by default.

Two decorative heading icons were also given `aria-hidden`.

---

## 6. Verified

58 checks against a production build, headless Chrome over the DevTools
protocol, at 1280 / 768 / 430 / 390 / 360 px and under emulated reduced motion.

**No proficiency scoring** — zero percentage strings anywhere on the page, zero
progress bars.

**Evidence integrity** — all 26 skills render, **every one reports at least one
piece of evidence**, `linux` is gone, the count is in each node's accessible name
rather than only in the dot size, and nine populated clusters render with no
empty one. Every relationship the brief names was checked individually: Flutter →
RODIFT and Emergency Mesh; TypeScript → VeriPatch and the portfolio; Python →
KnowledgeGuard and CortexWard; Docker → VeriPatch and CortexWard; Supabase →
RODIFT and the portfolio.

**No dead links** — every internal evidence destination was fetched and returned
200, and **every anchored link was visited in a browser** and confirmed to land
on a visible element, which is what caught the archive problem.

**Interaction** — selecting marks `aria-pressed`, category selection dims the
other 24 nodes, skill nodes are focusable buttons, a touch tap opens evidence
with no hover having occurred, and every node is ≥44px at 390px.

**Preserved** — the 3D cube and the physics playground both still render, and the
currently-learning list is intact.

**Layout and motion** — no interactive target under 24px, no horizontal overflow
at 360 / 390 / 430 / 768 px, nothing stranded after a jump scroll, reduced motion
clean, and no console errors, warnings or uncaught exceptions.

**No regressions** — ten routes render one `<h1>` with zero console errors, the
homepage tech stack links into the Galaxy with 14 deep links and shows evidence
rather than bare names, and `/work` renders the new portfolio card.

---

## 7. Known and deliberately left

`whileInView` remains on the homepage (`SpotlightGrid`, `AnimatedStats`,
`Achievements`, `index.js`), which the Phase 3 motion rule discourages. Measured
this phase: after a jump-scroll to the bottom, **no in-viewport element is below
0.05 opacity on any route** — content above the final position sits at 0 until
scrolled back to, and then reveals normally. It is not a live defect, so the
working effect was left alone rather than flattened into mount-time fades; the
homepage motion pass is the right place to decide that, and nothing added in this
phase uses the pattern.

`GravitySkills` still sizes its Matter world once at mount. Its canvas is
`w-full`, so it cannot overflow, but the physics bounds do not follow a resize.
Rebuilding the world on resize is a change to a working playground for a case
nobody hits mid-throw; noted rather than done.
