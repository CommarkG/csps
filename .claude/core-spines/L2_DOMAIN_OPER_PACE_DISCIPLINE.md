---
id: csps.core-spines.l2-domain-oper-pace-discipline
name: L2_DOMAIN_OPER_PACE_DISCIPLINE
description: OPER spine domain governing work pacing. Gradual-build-by-foundations (depth 3/4/5 + per-layer ZF gates + foundation-stability enforced + push-back rules reject finish-fast / arbitrary-N / skip-foundation). Humble-batching with explicit composition rationale. PE-driven sequencing.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: normal review (PCR + amendment)
template_used: l2-domain-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: OPER
schema_anchor: core_spines_l2_domain
parent_l1_doctrine: ./L1_CORE_OPER.md
domain: PACE_DISCIPLINE
tags:
  - domain:ops
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
scope_level: S1
---

# L2_DOMAIN_OPER_PACE_DISCIPLINE

Operational decomposition of OPER spine — the domain governing **work pacing**.

## What this domain governs

Work proceeds through gradual-build-by-foundations. Every multi-session topic enters via templated plan; depth ∈ {3, 4, 5} with rationale; each level passes zero-findings before the next; foundation-stability-before-layer-N enforced. Free-form N rejected. Finish-fast urge rejected. Skip-foundation rejected. Unrelated-batching rejected.

The domain establishes humble-batching: each batch has explicit composition rationale stating why items are co-load-bearing. Batches without rationale are anti-pattern. Batches that bundle unrelated items defeat per-level ZF gates.

PE-driven sequencing within levels. PE_SCORE = (B × 0.30 + D × 0.30 + I × 0.15 + Bn × 0.10 + PAS × 0.15). 4 priority bands (BLOCKING / HIGH / MEDIUM / VAULTED). PE-QUICK vs PE-FULL firing modes. PE TRAJECTORY emits multi-step lookahead — never single-next-item.

## Operational governance surfaces

- **B_GRADUAL_BUILD_BY_FOUNDATIONS** (P-META-016)
- **gradual-build-plan template** (tools/templates/gradual-build-plan.template.md)
- **priority-engine.schema.yaml** (5-dim formula + bands + push-back rules + PE_ALIGNMENT_GUARDIAN)
- **Topic-plans vault** (_handoff/VAULT/topic-plans/)
- **Push-back rules** (rejects finish-fast / arbitrary-N / skip-foundation / unrelated-batching / premature-DONE)

## Per-domain validators

- `gradual-build-plan-coverage` (multi-session topic without plan)
- `priority-engine-depth-respected` (depth ∉ {3,4,5} rejected)
- `foundation-stability-before-layer-N` (L+1 work without L ZF blocked)
- `humble-batching-required` (batch without composition rationale)
- `priority-engine-inputs-complete` (plan has all PE input fields)
- `backtrack-trigger-coverage` (topic without registered triggers)
- `pe-trajectory-emitted-on-fire` (every PE fire emits multi-step trajectory)

## Composition

Composes with L2_DOMAIN_OPER_WORKFLOW_INTEGRITY (gradual-build IS the workflow shape) + L2_DOMAIN_OPER_REALITY_GROUNDING (PE inputs ground in observed leverage / dependency / cost) + the VALD Spine's RESULT_DRIVEN_VERIFICATION domain (per-layer ZF gate is verification-as-pace) + the GVRN Spine's AMENDMENT_DISCIPLINE domain (foundation-stability-before-amendment).

**Domain signature:** S006-AI-l2-domain-oper-pace-discipline-2026-05-04T20:00:00Z
