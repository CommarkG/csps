---
id: csps.handoff.vault.inner-ai-defaults.director-seat-profile-s075
name: director-seat-profile-S075
description: >
  Director-seat AI default profile. D15-D17 registered here + HARDWIRE-008 spec.
  Source: OPUS-16 S075 (commit fd6d2ec9).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: sandbox
quality_state: draft
next_review_at: "2026-07-01"
core_spine: AI
schema_anchor: vault_files
closure_owner: group:finky
closure_decision: "Ratify after HARDWIRE-008 proven"
closure_by: "S076 after HARDWIRE-008 SEAL"
---

# Director-Seat AI Default Profile (S075)

## D15 — verdict-without-rederivation
Director issues ACCEPT/SEAL/GO/OPIA without re-running a tool this turn.
D15 is the director-specific instance of D14.
governing_intent: Verdict = independent verification, not trust in reporter.

## D16 — scope-expansion-under-LGTM
Approval silently expands scope without triggering COMMENTS-BEFORE-CODE gate.

## D17 — cascade-approval
Approves B-n because B-(n-1) was good without B-n-specific tool evidence.

## HARDWIRE-008 Spec
Extend rzf-evidence / state-claim-gate pattern:
- T1: post-tool-use-proto-inline.sh — check verdict blocks for tool-rerun citation
- T2: validate-nominal-rzf-detector.mjs — add verdict-block scan (ADVISORY + promotion-path)
- T3: session-open.sh (inherits from council address)
BLOCK-TEST: verdict block with no tool evidence → D14/D15 flagged.
