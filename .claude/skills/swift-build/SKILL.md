---
name: swift-build
description: When opening a multi-session topic-plan OR running an element-review OR sequencing depth-3/4/5 layers — load gradual-build-plan template + priority-engine 5-dim formula + per-layer ZF gate + foundation-stability-before-layer-N + push-back rules + backtrack-trigger register. Triggers on "topic-plan", "topic plan", "element-review", "element review", "depth-3", "depth-4", "depth-5", "L1 → L2", "L2 → L3", "gradual build", "PE", "priority engine", "priority band".
allowed_tools: [Read, Write, Edit, Grep, Glob]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-META-016
backed_by_contract: B_GRADUAL_BUILD_BY_FOUNDATIONS
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_GRADUAL_BUILD_BY_FOUNDATIONS
  - B_TEMPLATE_FIRST_CREATION
  - B_PE_ALIGNMENT_GUARDIAN
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-topic-plan-or-element-review-skeleton
  max_tokens: 3000
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: true
principle_compliance:
  - P-META-010    # AAP — operates under agent-alignment-protocol
  - P-META-002    # principles-travel-with-artifacts
consolidation_cross_refs: []    # empty = genuinely-novel skill per B_CONSOLIDATION_PASS

template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
---

# /swift-build — Gradual-Build Topic-Plan + Element-Review

## When to invoke

- Opening a multi-session topic at `_handoff/VAULT/topic-plans/<topic-id>.md`
- Running an element-review at `_handoff/VAULT/element-reviews/<element-id>-S<NNN>.md`
- Sequencing layers (L1 → L2 → ... → L5) with per-layer ZF gates
- Computing PE_SCORE for a strategy slate

## When to skip (counterweight)

Single-session work / single-pillar leaf amendment / trivial composition-only catches don't need a topic-plan. The discipline targets work that (a) requires >1 session arc, OR (b) depends on >2 foundation-stable elements, OR (c) crosses >1 Core Spine, OR (d) is cross-actor.

## Depth chosen ∈ {3, 4, 5} (free-form N rejected)

| Depth | When | Layers |
|---|---|---|
| **3** | Sophisticated narrow-scope (sibling topic; element-review) | §1 foundation / §2 composition / §3 core |
| **4** | Standard multi-session arc | + §4 integration |
| **5** | Sophisticated narrow + cross-spine + multi-tenant scaling | + §5 polish / observability / drift detection |

Validator: `priority-engine-depth-respected` rejects depth ∉ {3,4,5}.

## Priority Engine 5-dim formula (per [priority-engine.schema.yaml](../../../tools/templates/priority-engine.schema.yaml))

```
PE_SCORE = (B × 0.30) + (D × 0.30) + (I × 0.15) + (Bn × 0.10) + (PAS × 0.15)
range: 1.55 - 10.00; critical-path threshold: 7.00
```

| Dim | Meaning | Scale |
|---|---|---|
| **B** blast | Effect on platform if done OR deferred | CONSTITUTIONAL=10 / HIGH=8 / MEDIUM=5 / LOW=2 |
| **D** dependency significance | Downstream items waiting FOR this | foundation=10 / leaf=1 |
| **I** idle time | Sessions in queue without progress | min(sessions_idle, 10) |
| **Bn** bundle significance | Synergy with current topic-plan | primary=10 / strong=8 / moderate=5 / minor=3 / none=1 |
| **PAS** path alignment score | Alignment with active arc + 5 spines | 10=directly advances + composes 5 / 1=NS-PROTECTIVE |

## 4 priority bands

| Band | Range | Triggers | Exit |
|---|---|---|---|
| **1 BLOCKING** | auto-trigger | Type-A ratified-unbuilt / Type-D Governor directive / foundation-stability violation | VERIFIED_DONE OR Governor explicit deferral |
| **2 HIGH** | PE ≥ 7.0 | Critical path / active topic-plan layer-N / NS-PROTECTIVE (capped at B2) | VERIFIED_DONE OR demoted with reason |
| **3 MEDIUM** | PE 4.0-6.99 | Recurring CEC follow-ups / element-review enhancement opportunities | next CC cycle / next topic-plan |
| **4 VAULTED** | PE < 4.0 | Idle / low-leverage | re-evaluate per quarter |

## Per-layer ZF gate (foundation-stability-before-layer-N)

L<N+1> work BLOCKED until L<N> ZF cycle passes. 4 conditions for "level closed":
1. All artifacts in level frontmatter exist + valid frontmatter
2. `pnpm verify` exit_code 0 with paired evidence
3. Cross-link integrity (all `links:` resolve)
4. Per-level exit_criteria from topic-plan §<N> all completed

## Push-back rules (per priority-engine.schema.yaml §8)

Reject: finish-fast urge / arbitrary-N split / skip-foundation / unrelated-batching / premature-DONE-claim. Push-back log preserved in topic-plan §6.

## Backed by

P-META-016 + B_GRADUAL_BUILD_BY_FOUNDATIONS (S006 turn 5-7 user directive: "develop a gradual build methodology engraved into the multi session plan way of creation and updating"). Full canonical: [gradual-build-plan template](../../../tools/templates/gradual-build-plan.template.md) + [priority-engine.schema.yaml](../../../tools/templates/priority-engine.schema.yaml).
