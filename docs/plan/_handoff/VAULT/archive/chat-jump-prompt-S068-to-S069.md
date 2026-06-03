---
id: csps.vault.chat-jump-prompt-S068-to-S069
name: chat-jump-prompt-S068-to-S069
description: "Two paste-targets for the S068→S069 tab transfer per chat-jump protocol: (1) MINIMAL block for the new AI, (2) DETAILED standalone (~250 words) for the Governor. Source of truth: HANDOFF-S068-to-S069.md."
type: vault_files
protection_level: protected
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S068
core_spine: GVRN
schema_anchor: vault_files
inherits_from: "HANDOFF-S068-to-S069.md + chat-jump-prompt protocol (P-META-014 MUV) + tab-transfer-template"
links:
  - rel: handoff
    href: ../HANDOFF-S068-to-S069.md
context_question: "Pasting into a fresh tab? Use the MINIMAL block for the new AI; keep the DETAILED block for your own orientation."
---

# Chat-Jump Prompt — S068 → S069

## MINIMAL (paste into the fresh Sonnet tab)
```
Sonnet here. Session S069 — WIRING phase (succeeds S068).
FIRST: node tools/scripts/cross-tab-diff-review.mjs --role sonnet
  → node tools/verify.mjs --skip-install 2>&1 | tail -20  (expect exit_code=0)
  → read docs/plan/_handoff/HANDOFF-S068-to-S069.md SECTION 0 (10 false assumptions)
  → read tools/council/opus-turn.md TOP ENTRY (OPUS-13 wiring directive)
THEN continue PART 1 (PROTO-S068-PART-1-SUBSTRATE) — WIRE described→active; end every
CHECKPOINT with §15 3-SCOPE FEEDBACK. Slowdown in force (no new governance).
Ask Governor before PART 2 (designed, awaiting ratify). ASK-OPUS on STOP triggers.
```

## DETAILED standalone (Governor orientation — ~250 words)
```
S068 was a re-gate + constitutional day. The Governor blocked app development behind a
4-precondition foundation (Threshold / Frictionless-Onboarding / Developer-Journey /
Product-Schema) + page-templates, and we engraved the platform's DNA: Core-Maximal
(apps = bundles of core, build nothing net-new), the Planning-Discipline §1-§15
(context+reasoning, finding-must-be-wired, refinement-before-ratification, wiring=DNA,
the iterative-console 3-scope feedback), 3 moats (M-43 cross-tab-diff-review ACTIVE;
M-44 refinement; M-45 wiring-completeness), 2 AI-defaults (D11 verbal-deferral, D13
doc≠mechanism), plus the Foreign-Element + Inheritance models.

The honest headline, carried forward: ~14 described : 1 wired. Most of what we engraved
is governance TEXT whose enforcement is not yet wired. So S069 is a WIRING phase, not an
engraving phase — a wiring-weighted slowdown is in force (no new governance until the
described:wired ratio improves).

Biggest finding: the threshold (meant to be the ONLY input gate) is a tested LIBRARY the
live flow never calls — dispatch fired 4 times against 532 intakes. PART 2 (designed,
awaiting ratify) STEP 1 WIRES it into user-prompt-submit — the single highest-impact fix.

Open work (S069): PART 1 substrate (Sonnet, in progress) wires the 4 described validators;
PART 2 threshold (ratify then build); the WIRING PASS (283 partial files, 117 advisory-
forever validators to promote-or-prune); the COMPLETION-TO-RZF pass runs last. Full state
+ 10 false-assumptions + §17 attestation: HANDOFF-S068-to-S069.md. HEAD 927fe248, verify=0.
```
