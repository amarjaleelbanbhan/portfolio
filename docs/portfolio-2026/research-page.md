# Research Page

**Date:** 2026-09-20
**Phase:** 15 — Research
**Route:** `/research`

Four things that would all read as "research" in a CV, separated by what
actually exists behind them.

---

## 1. The problem this page solves

Written as four careful paragraphs, a completed factorial, a pre-alpha security
pipeline, a half-validated BLE protocol and a final-year project with a README
all look equally substantial. Prose flattens them. The reader has to trust the
adjectives.

So the distinction is made **structurally, before it is made in prose**. The
page opens with a ledger: four research entries against four evidence states.
The honest shape is visible in one glance —

| | Evidenced | Built | Simulated | Not built |
|---|---|---|---|---|
| KnowledgeGuard / EGB | 6 | 0 | 0 | 2 |
| CortexWard | 0 | 3 | 0 | 2 |
| Emergency Mesh | 7 | 0 | 0 | 1 |
| SCAR-OS | 0 | 0 | 0 | 1 |

— one project has measured results, one has code that has measured nothing, one
has behaviour exercised on hardware plus one thing that is not implemented, and
one has nothing built at all.

---

## 2. Nothing in the ledger is authored

Every cell counts items derived from records that already existed:

| Canonical record | Evidence state |
|---|---|
| `caseStudy.findings` | `executed` — a measured result exists |
| `caseStudy.network.steps` `live` | `executed` — exercised on real hardware |
| `caseStudy.network.steps` `simulated` | `simulated` |
| `caseStudy.network.steps` `not-implemented` | `not-built` |
| `caseStudy.ladder.stages` `implemented` / `partial` | `built` |
| `caseStudy.ladder.stages` `planned` | `not-built` |
| `research.futureWork` | `not-built` |
| `research.limitations` (only when nothing else exists) | `not-built` |

`getResearchEvidence()` in `lib/content/selectors.ts`. A capability therefore
cannot be promoted by editing a sentence on this page — it has to be promoted in
the record that the case study also reads, which means the two can never
disagree.

Two mappings are deliberate rather than obvious:

- **A `live` protocol step is `executed`, not `built`.** The canonical record
  means it was exercised on two real phones. That is a result.
- **An implemented ladder rung is `built`, not `executed`.** The code exists and
  nothing has measured how well it works. Implementation is not evidence.

### What the ledger does not do

It does not total, rank or score. Counts are **not comparable between rows** —
one project documents findings, another protocol steps, another verification
rungs — and the caveat, the measure line and the `<caption>` all say so. Cells
are inspectable, so a reader can check the classification instead of taking the
number on trust, and a cell with nothing in it is disabled rather than a button
that opens an empty panel.

Built as a real `<table>` with row and column headers, following the Phase 10
matrix: a screen reader announces "Emergency Mesh, simulated only, 0".

---

## 3. What is *not* in the ledger, and why

`caseStudy.verification` items with `verified: false` — "the native stack has not
been verified on a device", "mesh behaviour beyond one hop exists only in
simulation" — are rendered in a separate **Stated gaps** block.

They were deliberately kept out of the counts. They qualify work that exists
rather than being items in their own right: the device-verification gap is a
caveat on the transport, not a ninth protocol step, and counting it would both
double-count single-hop transfer and quietly turn a caveat into a tally.

This is also what satisfies the Emergency Mesh requirement. The ledger separates
hardware-verified behaviour from the unimplemented multi-hop relay; the gaps
block carries the simulation-only statement and the outstanding device
validation. Four states, all four visible, none merged.

---

## 4. KnowledgeGuard — disclosure boundary

**The Phase 10 boundary was preserved and deliberately not widened.**

Published: measured per-cell scores, counts and statistics — the categories the
project's own Tier P release policy clears, with passage text and rendered
prompts removed.

Not published, and not added this phase: source passage text, rendered prompts,
private questions, gold answers, restricted benchmark records, and any dataset
or artifact not cleared for release. Nothing whose publication status is
ambiguous was added. The already-cleared numerical results were **not** reverted
merely because the repository is private — the policy, not the repository's
visibility, is what governs.

### The four things a reader must be able to tell apart

All four are on the page, and none is allowed to stand for another:

1. **The measured interaction** — partial η² 0.32, permutation p = 1e-4. Real
   and large. Says the cells differ; does not say knowing the type is worth
   anything.
2. **Oracle routing** — +6.6 F1, 95% CI [2.6, 10.5]. The pre-registered null is
   rejected, but the lower bound sits exactly at the frozen practical threshold.
3. **Actual detector routing** — predicted routing scores **0.064 F1 below**
   type-agnostic. The benefit reverses. The headroom is real and, on this
   evidence, unreachable.
4. **The figure that must not be quoted** — +41.5 F1 against fixed escalation.
   Rendered under the label "The number that must not be quoted", with the
   explanation that almost all of it is the action main effect. It appears as a
   warning, never as a success claim.

The **correction** is rendered by the same `ResearchCorrection` component the
case study uses, at the same weight as the results, dated, and keeping its own
wording: *the number stands; the causal reading does not.*

**E6 is labelled not run** and the **HotpotQA replication is labelled
incomplete**, both as `not-built` items in the ledger and in the limitations.
No numbers are shown for either.

The case study is linked rather than reproduced. What appears here is the
research — the factorial, the findings, the correction — not the engineering
write-up around it.

---

## 5. SCAR-OS

`publicStage` is rendered verbatim: **Current FYP — Research & Architecture
Stage**. The entry has no results block, because the record carries no results
and validation now rejects results on any non-`executed` category. Its single
evidence item is `not-built`: "No implementation yet. The repository contains a
README only."

The repository is still named `VICE-OS` and is private, so no URL is published;
the old name appears nowhere on the page, and a browser check asserts that.

---

## 6. Model and validation changes

**`content/types.ts`**

```ts
RESEARCH_CATEGORIES = ['executed', 'research-engineering',
                       'systems-experiment', 'current-fyp']
EVIDENCE_STATES     = ['executed', 'built', 'simulated', 'not-built']
ResearchProject.category: ResearchCategory   // required
```

Category is separate from status on purpose. Status says how far along the work
is; category says what sort of work it is, and collapsing them is what lets a
plan sit beside a completed study as though the two were comparable.

**New rules in `lib/content/validation.ts`**

- `category` must be a known value.
- `executed` requires `status: 'complete'`, recorded `results`, and at least one
  verified proof entry. A plan cannot become executed research by editing one
  field.
- A non-`executed` category carrying `results` is an error.
- `architecture-stage` must be categorised `current-fyp` and must record what is
  not built. The SCAR-OS guard, generalised.
- `/research` added to `EXISTING_ROUTES`.

**Anchor validation generalised.** It previously accepted only project slugs
plus the literal `open-source`, so `/research#research-knowledgeguard` failed.
`anchorsFor(path)` now returns the anchors each route actually renders —
`/work` and `/projects` render project slugs, `/research` renders
`research-<slug>` and `ledger`, `/` renders the story stage ids — and returns
`null` for routes with no known scheme, which means "do not check" rather than
"reject". This makes the rule stricter where it can be and removes the need to
loosen it every time a page gains its own anchors.

**Heading level is now a prop** on `ExperimentMatrix`, `ResearchFindings` and
`ResearchCorrection`. They are top-level sections of a case study and
subsections of a research entry; the caller owns the level and the visual size
is unchanged.

---

## 7. Navigation

`Research` added to the navbar (now eight destinations, still measured as
fitting at 1024px), the footer and the sitemap.

The homepage story's RESEARCHED stage now points at
`/research#research-knowledgeguard` instead of `/work#knowledgeguard`. The stage
is about the study, and this is where the factorial, the findings and the
correction live.

The Engineering Core was **not** given a sixth `research` node. The ring is laid
out at 72° intervals for five domains; adding one would re-geometry a working 3D
scene for a destination the navigation already carries.

---

## 8. Verified

73 checks against a production build, headless Chrome over the DevTools
protocol, at 1280 / 1024 / 768 / 430 / 390 / 360 px and under emulated reduced
motion.

**Structure** — one `<h1>`, no empty headings, no skipped heading levels, unique
title, description and canonical, and all four entries in category order.

**Research integrity** — the interaction, the oracle gain with its interval, the
detector reversal, the must-not-be-quoted figure framed as such, the correction
present and dated with its own wording, E6 marked not run, HotpotQA marked
incomplete, the matrix rendered as a table with 30 inspectable cells, and no
overclaiming vocabulary anywhere on the page.

**Disclosure** — no restricted artifact names, no private repository URLs, the
private marker shown, and the disclosure basis stated in full.

**Per-project honesty** — SCAR-OS on its canonical stage wording with no results
and no trace of the old name; CortexWard pre-alpha with built separated from
evaluated and both unbuilt rungs named; Emergency Mesh with multi-hop marked not
built, the simulation-only gap stated, the device-verification gap stated, no
emergency-ready phrasing, and the unsuitability for real emergencies stated.

**Ledger** — four rows, four state columns, the not-a-score caveat present, cell
selection listing real items, column selection explaining the state, row headers
linking to their entry, and empty cells disabled.

**Layout, motion, accessibility** — no interactive target under 24px, nothing
stranded below 0.05 opacity after a jump scroll, no horizontal overflow at 360 /
390 / 430 / 768 px, reduced motion clean, and no console errors, warnings or
uncaught exceptions.

**No regressions** — twelve existing routes render one `<h1>` with zero console
errors, the homepage story keeps all five stages, and the story's new anchor
resolves and scrolls.

One defect found and fixed: the ledger's row-header links were `next/link`,
which rewrites `#research-scar-os` to `/research#research-scar-os` and routes an
in-page jump through the client router. They are plain anchors now.

---

## 9. Deliberately not done

- **No new 3D scene.** The brief rules out decoration, and the ledger is the
  right instrument for this content: a structured comparison, not a spectacle.
- **The full case studies are not reproduced.** Architecture, decisions,
  verification and disclosure stay on `/work/<slug>`; this page carries the
  research and links onward.
- **No cross-project comparison of the counts.** The numbers are deliberately
  not totalled per row, ranked, or turned into a score.
