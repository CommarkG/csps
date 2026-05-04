---
id: csps.handoff.vault.topic-plan.token-optimization
name: token-optimization
description: Topic-plan instance for token consumption optimization in CSPS. Depth-5 (sophisticated narrow). Opens S007 turn 1. Implements the 10-phase optimal-order plan specified in `pillar-0-governance/token-optimization.md` v0.3 §9. Composes with B_GRADUAL_BUILD_BY_FOUNDATIONS + P-META-009 CCA + extends B_COGNITIVE_CONTEXT_DISCIPLINE via new B_TOKEN_BUDGET contract. Phase 1 (measurement) MUST run before any optimization claims per RZF discipline.
version: 0.1
owner: group:finky
lifecycle: production
lifecycle_state: pending-review
next_review_at: 2026-08-01
template_used: gradual-build-plan
template_version: 1.0
template_status: novel-pending-pattern-evaluation
core_spine: AI
core_spines: [AI, GVRN, OPER, VALD]
schema_anchor: topic_plan_instance
tags:
  - domain:ai
  - domain:governance
  - type:how-to
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: how-to
session: S006
topic_id: token-optimization
priority_score: 80
priority_band: 2
multi_session_arc: [S007, S008, S009, S010, S011, S012]
depth_chosen: 5
depth_rationale: |
  Sophisticated narrow because:
  (a) high leverage — affects every CSPS session forever (foundation reads + recurring cycles)
  (b) cross-spine — touches all 5 Core Spines (GVRN context discipline / ARCH file structure / AI cognitive context / OPER session lifecycle / VALD measurement validators)
  (c) reversibility — moderate (file splits reversible but disruptive; hooks reversible easily; subagent routing reversible)
  (d) multi-tenant scaling impact — direct (every app graduating from CSPS inherits the discipline)
  (e) enterprise-alignment lens — load-bearing (token-cost-per-session is auditable + trackable)
  (f) pattern absorbed from CSP after 4-council synthesis (Perplexity + GPT + Gemini + Claude AI converged)
backtrack_register:
  - trigger-id: phase-1-measurement-shows-different-priorities
    action: Phase 2 element-review re-prioritizes 7 strategies via priority-engine 5-dim formula
  - trigger-id: hook-self-test-fails-at-session-start
    action: cruel-critic Critique 2 mitigation; surface offending hook + repair before Phase 5 close
  - trigger-id: skill-trigger-collision-detected
    action: cruel-critic Critique 3 mitigation; rewrite skill descriptions; ≥30% keyword overlap = anti-pattern
  - trigger-id: file-split-breaks-codegen
    action: rollback split + restore monolithic; surface as enhancement candidate
  - trigger-id: claudeignore-excludes-critical-file
    action: Phase 4 test scenario coverage catches; remove offending pattern
links:
  - { rel: parent, href: ./README.md }
  - { rel: source-analysis, href: ../../pillar-0-governance/token-optimization.md }
  - { rel: csp-source, href: '../../../../_intake/processed/EXT-S006-CSP-TOKEN-BUDGET/raw.md' }
  - { rel: composes-cca, href: ../../pillar-0-governance/cognitive-context-architecture.md }
muv_audit:
  required_sections_present: STUB (full sections fill at S007 Phase 1 open)
  alignment_questions_count: deferred-to-S007-open
---

# Topic Plan — Token Optimization (STUB; opens S007 turn 1)

> **STUB STATUS:** This topic-plan instance is prepared at S006 close per chat-transfer §15 item #8 ("token-optimization topic-plan instance prepared — NOT opened; opens at S007 turn 1"). Full sections §1-§10 are deferred to S007 Phase 1 opening. Phase 1 measurement baseline must run BEFORE any sections claim numerical exits.

## Reference

Full v0.3 plan in [`pillar-0-governance/token-optimization.md`](../../pillar-0-governance/token-optimization.md) §9 (10-phase optimal order).

## Phase summary (per token-optimization.md v0.3 §9)

| Phase | Focus | Depends on | Est. session cost |
|---|---|---|---|
| 1 | Baseline measurement | nothing | 0.3-0.5 |
| 2 | Element-review (gap analysis + priority placement) | Phase 1 | 0.3 |
| 3 | B_TOKEN_BUDGET 5/5 atomic engraving (CONTRACT-FIRST) | Phase 2 | 0.5-0.7 |
| 4 | AGENTS.md slim + 10 skills + .claudeignore | Phase 3 | 1-2 |
| 5 | Hook migration (7 hooks per migration table) | Phase 4 | 1 |
| 6 | Subagent + Haiku tiering | Phase 5 | 0.5-1 |
| 7 | File splitting (principles.yaml + behavioral-contracts + audit-runner + ai-behavior-spine) | Phase 4 + 6 | 4-8 |
| 8 | principles-mcp build (CCA Layer 4 activation) | Phase 7 | 1-2 |
| 9 | Context-loading templates + orchestrator hook | Phase 8 | 0.5-1 |
| 10 | Compaction discipline + MCP audit + measurement validator + continuous validation | Phase 9 | 0.5-1 |

**Total arc: 5-8 sessions (S007 → S012 typical; per CSP cruel-critic Critique 5 absorbed).**

## Open prerequisites at S007 turn 1

1. User ratifies Phase 1 scope (measurement script + 8 scenarios)
2. User decides Phase 3 placement: extend P-META-009 CCA OR new principle (recommended: extend per v0.3 §14.4 rationale)
3. User decides L1/L2/L3 collision resolution: adopt "Quick/Element/Canonical" for document-depth concept
4. Step 0 (per protocols.md §11): prior-platform precedent for token-optimization (CSP precedent already absorbed; user may have additional)

## Phase 1 first-action sequence

When S007 opens this topic-plan:
1. Author `tools/measure-token-cost.mjs` (kebab-case per naming-policy)
2. Author 8 scenario JSONs at `tools/scenarios/`
3. Run `pnpm tokens:measure` to capture baseline
4. Save baseline at `_handoff/VAULT/token-cost-baseline-S007.json`
5. Document per-scenario totals in element-review draft
6. Phase 1 exit attestation per gradual-build-plan template

## Topic-plan attestation (will fill at S007 Phase 1 close)

```yaml
topic_plan_zf:
  ran_at: <iso>
  cycles_run: <N>
  findings: <list>
  status: <ZF status>
  signature: S00<N>-AI-token-optimization-phase-1-<iso>
```

**Stub signature:** `S006-AI-token-optimization-topic-plan-stub-2026-05-04T23:30:00Z (PREPARED; NOT OPENED — opens S007)`
