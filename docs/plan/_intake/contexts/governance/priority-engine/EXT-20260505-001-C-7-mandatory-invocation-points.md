---
extraction_id: EXT-20260505-001-C
parent_input_id: EXT-20260505-001
section_label: "§5 + §11 The 7 mandatory invocation points + mechanical layer"
source_type: AI_OTHER
confidence: 0.95
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T03:55:00Z
pipeline_state: routed
routed_to: governance/priority-engine (new leaf candidate) + audit-hub.md Pipeline composition + tools/pe-compute.mjs (new tool candidate)
next_review_at: 2026-05-05T04:30:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
  - trust_tier: external_ai_export
sla_due:
  routed_for_review: 2026-05-05T04:30:00Z
  pcr_decision: 2026-05-06T03:55:00Z
scope_level: S1
---

# Extract C — 7 mandatory PE invocation points + mechanical surface pattern

## Essence

CSP makes PE invocation **mandatory at 7 enumerated points** (plan auth / CC dispatch / reassessment / completion-vs-new / session start / cross-CC bundling / mid-stream landscape) — skipping any is a discipline violation. Mechanical surface = `pe_compute.ps1` + `pe_context_cache.json` + `context_inject.ps1 PE_CONTEXT_BRIEF` (surfaced at session start + every 300K-token refresh). CSPS has SCATTERED PE invocation (template embeds priority_engine §6; B_GRADUAL_BUILD per-layer ZF embeds reassessment) but **no enumerated-mandatory list + no mechanical compute layer + no session-start brief**.

## Verbatim source quotes

> "Point 1 — Plan authoring: any new plan (multi-session OR session-level). PE TABLE per PLAN_STANDARD MANDATORY structure."
>
> "Point 5 — Session start (PE_CONTEXT_BRIEF): every session start + every 300K-token refresh. context_inject.ps1 surfaces PE_CONTEXT_BRIEF — top-3 items by PE_SCORE + ACCUMULATOR threshold check + pillar balance + findings boost on active spine + SSI (System Stability Index)."
>
> "Output example:
> ```
> PE CONTEXT BRIEF (S335 H10 -- ADVISORY)
> PLATFORM STATE:
>   Implementation debt: 0 CCs IMPL_IN_PROGRESS | 0 phases overdue
>   ACCUMULATOR score: 155/60 threshold | BULK_SESSION needed: YES
>   Pillar balance: CONTEXT 6% | GOVERNANCE 77% | TIMING 9% | INTEGRITY 4%
> PE RECOMMENDATION: ACCUMULATOR above threshold - bulk cleaning needed
> FINDINGS BOOST: GVRN +2 (65 open findings)
> SSI: 464
> ```"

## CSPS current state

- **Plan authoring:** ✅ PE TABLE in [`gradual-build-plan.template.md`](../../../../../tools/templates/gradual-build-plan.template.md) §6 — REQUIRED frontmatter field
- **CC dispatch:** ❌ N/A (CSPS has no CC analog yet; topic-plan + ADR substitute)
- **Reassessment:** ⚠️ B_GRADUAL_BUILD per-layer ZF gate is partial; no enumerated trigger list
- **Completion-vs-new-scope:** ⚠️ FWWS (P-OP-002) is philosophical; no mechanical decision protocol
- **Session start:** ❌ NO PE brief surfaced; AI reads HANDOFF Zone A but no PE re-fire
- **Cross-CC bundling:** ⚠️ humble-batching (P-OP-004) is the analog but no PART-LEVEL bundling discipline
- **Mid-stream landscape change:** ❌ NO mechanism; AI judgment-driven

## Recommended downstream action

**Multi-leaf engraving** (PCR-required; multi-session arc):

1. **NEW LEAF:** [`docs/plan/pillar-0-governance/priority-engine.md`](../../../../../docs/plan/pillar-0-governance/) — canonical CSPS PE doctrine with 7 enumerated invocation points (CSPS-adapted from CSP's 7) + mechanical surface spec
2. **NEW TOOL:** `tools/pe-compute.mjs` — CSPS Node.js analog of `pe_compute.ps1` (matches CSPS toolchain — pnpm + Node.js)
3. **NEW SCHEMA:** `tools/pe-context-cache.json` — cross-session PE state cache
4. **EXTEND HOOK:** `.claude/hooks/session-start-pe-brief.sh` — UserPromptSubmit OR SessionStart hook that surfaces PE_CONTEXT_BRIEF to AI context at session-open (composes with existing user-prompt-submit-intake.sh)
5. **EXTEND audit-hub.md Pipeline 7** — add `pe-invocation-coverage` audit slug (verifies each session has PE invocation at the 7 mandatory points)

## Open questions

- CSPS has 5 mandatory points possible (plan auth / topic-plan transition / per-layer ZF gate / session start / completion-vs-new). Should adopt 5 not 7 (CSP-divergence per CSPS-DNA fit) or extend to 7?
- Does CSPS need PE_CONTEXT_BRIEF at session-start, or is HANDOFF Zone A + chat-jump-prompt sufficient? **Argument for adding:** HANDOFF is static per session-close-state; PE_CONTEXT_BRIEF is dynamic per current-session state.
- Should `pe-compute.mjs` consume topic-plan §6 frontmatter directly OR require separate ledger?

## Engraving readiness

⚠️ READY FOR PCR. New leaf + new tool + new schema + new hook + audit extension = full FSE 5/5 atomic. Multi-session arc work; natural fit as **L2 or L3 sub-deliverable in unified-intake topic-plan** (composes with envelope schema).
