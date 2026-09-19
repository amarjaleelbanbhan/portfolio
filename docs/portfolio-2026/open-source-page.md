# Open Source Page

**Date:** 2026-09-20
**Phase:** 14 — Open Source
**Route:** `/open-source`

One claim, made with evidence: changes of mine are in codebases other people
maintain.

---

## 1. Why this page is not a GitHub dashboard

The obvious version of this page is a contribution heat map, a streak counter
and a total. All three are available from the GitHub API and all three would be
dishonest here, because they measure activity rather than engineering, and
because a portfolio that shows them is asking to be read as busy rather than
careful.

What a reader of a portfolio actually wants from an upstream contribution is two
paragraphs: **what was wrong before, and what was changed**. Those are the
largest text on every card. The repository name is smaller. Everything else —
status, dates, diff, tests — is supporting evidence for those two paragraphs.

Nothing on the page counts reviews, reactions, stars or downstream impact. Those
are not in the records, so they are not rendered.

---

## 2. Verification

All seven pull requests were re-read from the GitHub API on **2026-09-20**, from
`/repos/{owner}/{repo}/pulls/{n}` and its `files` collection.

| PR | State | Opened | Merged | Diff |
|---|---|---|---|---|
| `pydantic/pydantic-ai#5969` | merged | 2026-06-17 | 2026-07-01 | 2 files, +91 −8 |
| `promptfoo/promptfoo#9781` | merged | 2026-06-16 | 2026-06-21 | 10 files, +208 −16 |
| `cobusgreyling/loop-engineering#395` | merged | 2026-07-25 | 2026-07-27 | 2 files, +67 −6 |
| `cobusgreyling/loop-engineering#437` | merged | 2026-07-29 | 2026-07-31 | 5 files, +91 −63 |
| `MCP-Audit/MCTS#233` | merged | 2026-06-11 | 2026-06-11 | 2 files, +99 −1 |
| `AcademySoftwareFoundation/dna#195` | merged | 2026-09-15 | 2026-09-17 | 1 file, +1 −1 |
| `shaal/eye-tracker#61` | **open** | 2026-07-26 | — | 2 files, +208 −0 |

Author on all seven: `amarjaleelbanbhan`. Every recorded field matched what was
already in `content/open-source.ts`; the check added four `openedAt` dates that
had been missing and confirmed that eye-tracker#61 is still open.

Two language lists were corrected against the diffs rather than left as they
were: `#395` touches `action.yml` and a README, so it is recorded as YAML and
Shell rather than JavaScript, and `#437` touches TypeScript source, compiled
JavaScript and an `.mjs` test, so it records both.

> The `javascript` skill in `content/skills.ts` still cites `#395` as evidence.
> That is now inconsistent with the corrected language data and is fixed in
> Phase 16, where skill evidence is the subject and a validation rule can be
> added to prevent it recurring.

---

## 3. What the model gained

`OpenSourceContribution` grew four fields, all of them required by the phase
brief and all of them sourced from the pull request itself:

```ts
problem: string          // required — the upstream problem, before the change
change:  string          // required — what was actually changed
verification?: string[]  // tests and checks the PR documents. Never inferred.
issueRef?: string        // the upstream issue it closes
diff?: {                 // straight from the API
  files: number; additions: number; deletions: number;
  paths: { path: string; additions: number; deletions: number }[];
}
```

`verification` is optional on purpose. `#395` documents no tests, and the card
says so in as many words. Hiding the section when it is empty would have
implied, by omission, that every entry came with tests.

`PROOF_TYPES` gained `'pull-request'`. The existing `'merged-pr'` renders green
and reads "Merged PR", and eye-tracker#61 was carrying it. That is the single
most damaging thing this page could get wrong, so it is now wrong in three
independent places at once or not at all:

1. the data uses a separate proof type,
2. `ProofBadge` renders that type grey and never says "merged",
3. validation **rejects** a `merged-pr` proof on any contribution whose status
   is not `merged`.

---

## 4. Validation rules added

In `lib/content/validation.ts`:

- `problem` and `change` are required on every contribution.
- A non-merged contribution may not carry a `merged-pr` proof.
- `mergedAt` may not precede `openedAt`.
- Diff figures must be internally consistent: at least one file, no more paths
  than files, no negative line counts, and — when the path list is complete —
  per-file additions and deletions must sum to the stated totals.
- `/open-source` added to `EXISTING_ROUTES`, which is what allows the Engineering
  Core and the story's CONTRIBUTED stage to point at it.

All five were confirmed to fire by injecting defects and checking each was
reported, then reverting.

---

## 5. The page

```
Hero — the claim, as the h1
  ↓
Four derived counts + total diff + the date it was all verified
  ↓
Upstream repository graph          ← select a repository to filter
  ↓
Status filter · Area filter · result count · clear
  ↓
Seven contribution cards
  ↓
"How this page is kept honest"
```

### The repository graph

A hub carrying the total, and one node per repository with a recorded pull
request. **Node size is the number of pull requests and the number is also
printed**, so size is never the sole carrier. There is no other encoding: no
weighting by stars, no activity heat, no edge that means anything except "a
change of mine is in here".

Structurally it is a decorative `aria-hidden` SVG for the lines, with every node
a real `<button>` in normal DOM order. Tab order, touch targets and screen
reader output therefore do not depend on the drawing. Below `md` the ring is
dropped entirely for a plain wrapped list of the same buttons — a ring of six
labels at 360px is unreadable, and no touch user should have to hover or drag to
use it.

Selecting a node filters the list. It is a filter control, not a tooltip.

### The cards

Each card carries, in order: repository and PR number, title, status badge,
lifecycle rail, **the problem**, **what I changed**, tests and checks, changed
files, area and language tags, and a link to the request.

The **lifecycle rail** is deliberately two stops. A real pull request has review
rounds, CI and revisions; none of that is in the records, so none of it is drawn.
The only two events are the two that were verified: opened, and merged-or-not.
That constraint is what makes the terminal stop honest — filled and dated for a
merge, a hollow ring reading "open — not merged" otherwise.

**Changed files** is as close to source as the page gets, and it stops where the
evidence does: paths and line counts, no diff text. A path is marked `test` from
the path alone, which is an observation about the filename rather than a claim
about what the test asserts.

### Filtering

Two radio groups (status, technical area) plus the graph's repository selection.
Both groups are `components/ui/FilterChipGroup` — extracted this phase from
`/work`'s domain filters so the two pages cannot drift into subtly different
keyboard behaviour. Arrow keys move within a group, only the active option is a
tab stop, and the active state is border + background + dot, never colour alone.

The page always loads unfiltered, so every anchor target resolves on load.

---

## 6. Navigation

| Surface | Change |
|---|---|
| `Navbar` | "Open Source" added; desktop row moved from `md` to `lg` |
| `Footer` | "Open Source" added; social links gained `noopener` |
| `content/domains.ts` | open-source Core node → `/open-source` |
| `content/story.ts` | CONTRIBUTED stage → `/open-source` |
| `components/Hero.js` | "View Open Source" → `/open-source` |
| `pages/work.js` | list replaced by a pointer; `#open-source` anchor kept |
| `pages/index.js` | hardcoded "six merged pull requests" → derived + linked |
| `public/sitemap.xml` | `/open-source` added |

**The navbar breakpoint moved on purpose.** Seven destinations plus the logo, the
GitHub icon and the Resume button do not fit a 768px bar without wrapping or
shrinking hit areas below 44px. Measured at 1024px the row fits with room to
spare. Any phase that adds an eighth destination must re-measure rather than let
the row collapse silently.

`/work` keeps its `open-source` anchor. Documentation and an old Core
destination point at it, and an anchor that silently stops resolving is worse
than a three-line section.

---

## 7. Verified

58 checks against a production build, in headless Chrome over the DevTools
protocol, at 1280 / 1024 / 768 / 430 / 390 / 360 px and under emulated reduced
motion.

**Content** — 200 with exactly one `<h1>` carrying the claim, no empty headings,
canonical and a unique 164-character description, all seven contributions
rendered, all seven PR URLs present and opening with `noopener`, every card
showing problem / change / tests / files, the PR with no documented tests saying
so, the six-merged and one-open counts matching the records, and the verification
date shown.

**Honesty** — the open card reads "Open" and "open — not merged" and the word
"merged" appears on it in no other form; the merged card is dated and shows its
14 days open; no contribution-score, streak, stars, impact or maintainer-reaction
language anywhere on the page.

**Interaction** — status filter narrows to one, clearing restores seven, the area
filter narrows to one, a graph node filters to that repository and reports
`aria-pressed`, arrow keys move within each radio group, and each group has
exactly one tab stop.

**Layout and motion** — no horizontal overflow at 360 / 390 / 430 / 768 px, the
graph becomes a tappable list below `md`, nothing stranded below 0.05 opacity
after a jump-scroll, reduced motion collapses `--duration-normal` to `0s` with no
invisible content, and no console errors, warnings or uncaught exceptions on any
route.

**No regressions** — `/`, `/work`, `/work/knowledgeguard`, `/work/emergency-mesh`,
`/skills`, `/certifications`, `/contact`, `/studio`, `/hire` and `/projects` all
render one `<h1>` with zero console errors; the homepage story keeps all five
stages and the Engineering Core still renders; `/work#open-source` still resolves
and `/work` still links six case studies.

### Three defects this found and fixed

1. **Horizontal overflow at 360 / 390 / 430 px**, 82px at the worst. Grid items
   default to `min-width: auto`, so the changed-files column — whose min-content
   width is an unbreakable path like `pydantic_ai_slim/.../_adapter.py` — widened
   its column past the viewport instead of truncating. Fixed with `min-w-0` on
   both grid columns. This is the same class of bug as the architecture diagram
   in Phase 8 and the experiment matrix in Phase 10; the difference is that those
   needed an inner scroller and this one needed the truncation that was already
   written to actually take effect.
2. **Two interactive targets under 24px on desktop** — the card's primary link
   and the "Clear filters" button both had `sm:min-h-0`, which is right for a
   chip in a dense group and wrong for a control. Both are now 44px at every
   breakpoint.
3. **Graph edges invisible.** `vectorEffect="non-scaling-stroke"` means
   `strokeWidth` is in CSS pixels, and the lines were drawn at 0.25.

---

## 8. Deliberately not done

- **No live GitHub fetch.** The records are cached so the page never depends on
  GitHub being reachable, and never renders a status nobody checked. The cost is
  that a merge does not appear until the content file is updated, which is the
  right trade for a page whose entire point is verified state.
- **No diff text.** Paths and counts only.
- **No closed-PR state in the UI.** `ContributionStatus` allows `closed` and the
  card handles it, but no contribution is currently closed, so nothing renders
  it. When one is, it will read grey and say "Closed".
