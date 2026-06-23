# EXPERIENCE_ISSUES.md — Codex Infinitum Polish Pass

Live-tested via dev server (desktop 1280x800 default + mobile 375x812 resize) plus targeted code reads.

## Screen: Power-on / Architect cue (post-monologue, pre-boot)

**Problem:** Extremely low contrast. Screenshot at default viewport is almost entirely black — the power core's glow and cue text ("Ready?" / "Let's go inside.") are barely perceptible even at full brightness on a calibrated screenshot.
**Cause:** `PowerCore` label/cue text colors are low-opacity desaturated grays/cyans against a near-black (`--void: #050508`) background with no surrounding light source to give scale or focus.
**Priority:** High
**Fix:** Increase contrast on the cue/label text (brighter color or subtle text-shadow glow), and/or add a soft radial vignette of light around the power core so it visually anchors the dark frame instead of nearly disappearing into it.

## Screen: Power-on / Architect cue — Mobile (375x812)

**Problem:** All content (ARCHITECT label, cue lines, power button, press-to-initialize label) is packed into the top ~240px of an 812px-tall viewport. The remaining ~70% of the screen is dead empty black space.
**Cause:** The container is not vertically centered on the mobile viewport — likely a flex/justify rule that works at desktop aspect ratios but doesn't apply `justify-content: center` (or equivalent) reliably on tall narrow viewports, or the content wrapper has a fixed top-anchored position.
**Priority:** High
**Fix:** Vertically center the entire power-on cluster in the viewport on mobile (`min-height: 100vh` + `display:flex; align-items:center;` on the outer wrapper, or equivalent in the existing component), so it doesn't read as a half-broken page.

## Screen: Architect monologue → cue transition

**Problem:** By the time of testing, the monologue lines ("I spent years using computers...") had already played and were gone from the DOM, replaced by the terse "Ready? / Let's go inside." cue — consistent with the audit's earlier finding that the Architect's presence is front-loaded and brief.
**Cause:** Confirms Phase 13 audit finding — not a new bug, just re-confirmed live.
**Priority:** Medium (tracked already; addressed partially by the existing Architect finale in Observatory)
**Fix:** No new action this pass — out of scope for "polish, not features."

## Note on scope

Full click-through past the power button was inconclusive in this session (the power button's onClick may require a real pointer event sequence the automated click didn't fully trigger, or the transition genuinely completes in under the screenshot interval) — no console errors were observed either way. This is flagged as inconclusive, not asserted as a bug, since it could not be reproduced with confidence. Recommend a manual click-through check before the next deploy if doubt remains.
