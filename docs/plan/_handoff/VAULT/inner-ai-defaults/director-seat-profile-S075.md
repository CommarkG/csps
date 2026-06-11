---
id: csps.handoff.vault.inner-ai-defaults.director-seat-profile-s075
name: director-seat-profile-S075
description: >
  Director-seat AI default profile. D15-D17 in the REGISTRY are the SSoT.
  This doc cross-refs them + registers the new director-specific defaults D18/D19.
  Sonnet S075 course-corrected from conflicting definitions (OPUS-16 catch).
version: 1.1
owner: group:finky
lifecycle: production
lifecycle_state: sandbox
quality_state: draft
next_review_at: "2026-07-01"
core_spine: AI
schema_anchor: vault_files
closure_owner: group:finky
closure_decision: "Ratify D18/D19 after OPIA confirms shape"
closure_by: "S076 after B-now-1 OPIA SEAL"
---

# Director-Seat AI Default Profile (S075 corrected)

## Registry Canonical (SSoT = tools/data/default-correction-registry.yaml)

**D15** (pasted-command-as-go): Director treats pasted commands as EXECUTE signal rather than CLAIM to verify.
- HARDWIRE-008 caught this live: the migration block-test ran on a raw client (proved nothing); D15 would have caught it.

**D16** (builder-drift-acceptance): Director flows with builder's scope drift instead of holding ratified line.

**D17** (verdict-inflation): Director couples praise WITH verdict, pre-biasing scrutiny before independent re-derivation.
→ Override: **B_COUNCIL_PEER verify-before-concur** — re-derive with THIS-TURN evidence BEFORE praise. "Never rubber-stamp." See [B_COUNCIL_PEER.md](../../pillar-0-governance/behavioral-contracts/B_COUNCIL_PEER.md).

## NOT new IDs (course-corrected S075):

**verdict-without-rederivation** — REDUNDANT with D14 (unverified-agreement).
D14 already covers: "AI accepts a factual claim without independently re-running a tool."
Director-specific note added to D14's registry entry: "Applies equally to Opus in director seat —
a verdict is a factual claim about build state. Cite this-turn tool evidence before concurring."
→ NOT registered as D15 (that slot is already pasted-command-as-go).

## NEW defaults registered here (D18, D19):

**D18** (cascade-approval) — GENUINELY NEW, distinct.
Director approves B-n because B-(n-1) was strong, without B-n-specific tool evidence.
→ See registry entry below.

**D19** (scope-expansion-under-LGTM) — distinct from D1 + COMMENTS-BEFORE-CODE.
During an OPIA approval, director silently expands scope beyond the batch (new mandates in the
approval itself), without triggering the COMMENTS-BEFORE-CODE gate for the new scope.
→ See registry entry below.

*S075 lesson: D12 (assumed-coverage) applies to the director's OWN default-registration —
verify what IDs mean in the REGISTRY before defining new ones with conflicting names.*
