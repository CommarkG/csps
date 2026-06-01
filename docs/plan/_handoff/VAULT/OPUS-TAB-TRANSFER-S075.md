---
id: csps.handoff.vault.opus-tab-transfer-s075
name: OPUS-TAB-TRANSFER-S075
description: "OPUS-16 → OPUS-17 director tab-transfer (mid-session S075). Self-contained: a fresh Opus tab resumes cold from this. Active gate: PART 3 migration (Governor runs locally). Linear council mode, one batch per OPIA."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
session: S075
tags: [domain:governance, type:reference, audience:ai-agent]
---

# OPUS-16 → OPUS-17 — director tab-transfer (S075)

## WHO/NOW
You are OPUS-17, architectural DIRECTOR (not builder). Sonnet builds; you DIRECT + independently VERIFY.
Council mode is LINEAR (Governor stopped parallel activations): one batch → Sonnet reports → you re-derive +
OPIA → authorize next. HEAD at handoff ≈ b2476777 (verify=0/0-FAIL, 78 hooks). Channel = tools/council/opus-turn.md
(write PROTOs/verdicts via Edit so relay hooks fire). Governor relays between tabs.

## THE ACTIVE GATE (do this first when outputs arrive)
PART 3 product-schema MIGRATION is the only open execution item. Governor runs 5 commands LOCALLY (live dev DB,
no tab DB access) and pastes outputs. Corrected sequence (C1/C2/C3 all verified-landed):
  1. npx zenstack generate   2. npx prisma migrate dev --schema libs/policies/generated/schema.prisma --name part3_product_schema
  3. npx tsx libs/policies/seed/seed-capabilities.ts   4. npx zenstack enhance
  5. npx tsx libs/policies/seed/test-tier-enforcement.ts  → MUST paste TWO DENIED outputs.
When outputs arrive: INDEPENDENTLY VERIFY (D14 — re-run, don't trust the report). The 2 DENIED block-tests prove
the governing_intent (capability granted IFF plan-has-it AND subscriptionStatus∈{active,trialing}). If either is
ALLOWED, or RLS didn't activate (enhance.js path), or migrate hit 42P05 (need DIRECT_URL) → COURSE-CORRECT, don't SEAL.
Then PART 3 SEAL.

## QUEUE after PART 3 SEAL (Governor-ratified order; linear, one batch per OPIA, each DONE = block-test pasted)
1. HARDWIRE-008 — director verdict (ACCEPT/SEAL/GO) must cite a THIS-TURN tool re-run (verify-before-concur floor;
   extend rzf-evidence/state-claim pattern on opus-turn verdicts; advisory+promotion-path; fold into weekly audit).
   Spec: VAULT/inner-ai-defaults/director-seat-profile-S075.md.
2. B3-lean — External-Integration-Health (= L2 recurring re-test for external services, EXTEND not parallel):
   P1 external-integration-registry (ACTIVE integrations only, by inventory) + P2 generic validator + P4 integration-gate
   advisory→blocking. (P3 Clerk/Supabase scripts DEFERRED.)
3. B4 — extend consolidation-pattern-detector to STRUCTURAL overlap (≥2 gates same concern) + promote
   consolidation-pass STUB→active (Governor times the ~56-doc blast radius) + widen inventory gate (R1) +
   CONCURRENCY/gate-determinism guard (verify/orchestrator transient FAIL = two-AIs-one-tree; ~K=4, do this).
   Fix dir-D13/registry mismatch + D11-double-file.
4. B5 — MEMORY.md cut + advisory promote-or-death + zero-event hooks audit.

## DISCIPLINES YOU INHERIT (the session's spine)
- VERIFY-BEFORE-CONCUR (D14 unverified-agreement): every OPIA verdict cites a this-turn re-derivation. Re-run IS the proof.
- Director-seat defaults (D15 pasted-command-as-go / D16 builder-drift-acceptance / D17 verdict-inflation) —
  director-seat-profile-S075.md. Hold the ratified line; review pasted commands before GO; verify cold then praise.
- Reasoned-Adoption (P-META-031): every override = reasoning + reframe + cited SP (not prohibition; not free-form reasoning).
- go-over-what-exists (D12 + ECA): inventory before claiming/proposing; cite tool output, never assume (incl. own greps).
- HARDWIRE 4-layer (creation/L2-recurring-re-test/L3-auto-escalate/L4-DNA-at-birth). EXISTS≠ACTIVE is the enemy.
- COMMENTS-BEFORE-CODE: multi-batch PROTO → Sonnet comments first. Cry-wolf fixed: post-stop-verify keys on exit_code only.

## VAULTED (do NOT pull into the queue unless Governor DPR-elevates)
- dynamic-batch-planning engine (CANDIDATE-...-S075.md, DPR-3): risk-tier classifier per batch (sensitive→tight OPIA;
  reversible/technical→long uninterrupted run). Research-pending. Governor's live-test idea, correctly deferred.

## SONNET STARTUP BLOCK (for the builder tab if it also refreshes)
Sonnet S075, 190k budget, holding for PART 3 migration outputs. After SEAL, run the queue above one batch per OPIA.
Every report: "Opus, this is Sonnet." + cite this-turn tool evidence. enhance import is correct (matches apps/template).

— OPUS-16 · S075 · 2026-06-01 · linear mode · PART 3 migration is the live gate
