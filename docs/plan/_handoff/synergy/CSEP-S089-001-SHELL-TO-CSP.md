---
id: csps.handoff.synergy.csep-s089-001-shell-to-csp
name: CSEP-S089-001-SHELL-TO-CSP
description: >
  Cross-Synergy Enhancement Plan — shares the CSPS Customer Journey Shell solution (one-frame shell +
  scope-adaptive SAGD depth + First Viewport Contract + Journey-Frame-Consistency + lovability rubric)
  to the sibling CSP platform as a reusable, CSP-instantiable prompt. Saved in the synergy element.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: ARCH
schema_anchor: synergy_files
diataxis_type: how-to
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
session: S089
---

# CSEP-S089-001 — Share the Customer Journey Shell to CSP

**Source:** CSPS (Core Sights Platform services) · **Target:** CSP (Core Sights Platform) ·
**Mechanism:** the Customer Journey Shell solution, built + test-driven in CSPS S089.

## 1. THE PROMPT FOR CSP (paste into a CSP build session)

```
You are building/upgrading CSP's primary user entry experience. Adopt the CSPS Customer Journey
Shell pattern (proven in CSPS S089). Build it as a CORESPINE: one universal core + CSP-specific
overlays that rely on the core. Requirements:

1. ONE SHELL FRAME (no teleportation): the whole core journey lives in a single shell route.
   Steps render INSIDE the shell. Deep-dive module pages are clearly-secondary "go deeper" links,
   never the primary path. (Principle: Journey Frame Consistency — a CTA that advances the user
   must keep them in the same visual frame; same colors/structure/tone/step-indicator.)

2. SCOPE-ADAPTIVE DEPTH (SAGD) — the soul of it:
   a. CLASSIFY the user's input scope (reuse a small/medium/large band; cheap classify).
   b. ASK, never assume: "This reads like a [quick win / meaningful goal / major undertaking] —
      straight path, or go deeper together?" The user routes.
   c. ROUTE: QUICK (1 sanity challenge -> save) · LIGHT DIVE (challenge 1 assumption + root cause
      + ripples + 1 horizon-broadener) · DEEP DIVE (competing-commitment/root-cause · intrinsic-vs-
      extrinsic values · ecology/ripple check · Golden-Circle WHY; "the friction is the feature").
   d. SAVE the DEEPENED output (root_cause + ripples + WHY + desired_outcome + how_tested/measured
      + post-completion lifecycle) — not the raw first answer.

3. FIRST VIEWPORT CONTRACT (FVC): the first screen must show VALUE before any input; honest states
   (empty/loading/error/success, no silent blank); 4±1 primary chunks; decision-tree-first
   (offer the choice before the content).

4. LOVABILITY RUBRIC (verify each surface a-e + e7): first-screen-value · zero-friction ·
   honest-state · flow-coherence · delight · trust/reversibility · GUIDED-DEPTH (e7: did it make
   the user think deeper, user-paced).

5. ASK-DON'T-ASSUME as a UX law throughout; no dark patterns; user can undo/edit.

DONE = a human test-drive confirms the felt outcome ("did it make me think deeper?"), not just
that the code renders. Build each surface as core + overlay so CSP-specific journeys reuse the core.
```

## 2. CSP-INSTANTIATION NOTES
- CSP's domains differ (CSP = the governance platform; CSPS = the services layer). Keep the SHELL
  CORE identical; vary only the overlays (CSP-specific steps, vocabulary via CSP's own glossary).
- Reuse, don't reinvent: the shell core, SAGD router, FVC checklist, lovability rubric are the
  universal core. CSP supplies its own step content + brand layer.
- dna-guardian: when CSP imports this, run its alignment check (CSP DNA vs CSPS DNA) — translate
  vocabulary, do not import CSPS-specific defaults wholesale.

## 3. IMPROVEMENTS TO PARK (this CSEP could be better)
- (a) Extract the shell CORE into a shared library both CSPS + CSP consume (true one-source, not a
  copied prompt) — the deepest synergy form. Currently this is a PROMPT (copy), not a shared module.
- (b) Bi-directional sync: improvements CSP makes to the shell flow back to CSPS (the "mini-sensors
  alert the mothership" idea from Csps-Draft-Inputs).
- (c) SAGD deep-tier frameworks (immunity-to-change etc.) are research-backed (Kimi) — validate with
  CSP's own user base; feed findings to research-register.
-> Parked as PARK-S089-SHELL-SYNERGY-SHARE improvements.

## 4. DECISION LEDGER
- CHOSEN: share as a CSP-instantiable PROMPT + CSEP now (fast, usable); park the shared-library
  extraction (the deeper synergy) for when both platforms are stable.
- REJECTED: extract a shared shell-core library now — premature (CSPS shell still iterating via
  test-drive; sharing a moving target causes drift). Share the proven pattern; library-ify when stable.
- REJECTED: CSP re-derives its own shell from scratch — wastes the proven CSPS work (the exact
  "build without research = deliberate ignorance" the Governor named).
