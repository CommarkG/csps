---
id: csps.handoff.vault.topic-plan.s038-stt-quality-protocols
name: s038-stt-quality-protocols-plan
description: >
  S038 platform work: STT (speech-to-text) quality protocols module + quality-protocols
  mini-tree consolidating OPUS-2/Sonnet/shared quality specs. DNA inheritance gate tested.
  Covers libs/integrations/speech/, tools/council/quality-protocols/, libs/integrations/security/.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: ARCH
core_spines: [ARCH, GVRN, AI, VALD]
schema_anchor: topic_plans
domain_path: platform
tags:
  - domain:architecture
  - domain:governance
  - domain:ai
  - type:how-to
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S038
execution_mode: deep_quality
intent_crystallized: true
threshold_route: developer.api-integration
status: active
priority_score: 75
priority_band: 1
depth_chosen: 3
depth_rationale: "Foundation-level platform integration; 3 sessions (A/B/C); no cross-actor AAP review needed"
alignment_verified_session: S038
zf_required_level: 2
consolidation_check: true

covered_paths:
  - libs/integrations/speech/
  - tools/council/quality-protocols/
  - libs/integrations/security/
  - .env.platform.example
  - apps/budget-planner/src/app/dashboard/
  - apps/budget-planner/src/app/page.tsx

goal_statement: "STT quality protocols live as platform primitive; OPUS-2+Sonnet quality specs consolidated"
know_how_consulted: true

question_register:
  - id: Q001
    type: C
    question: "What problem does the STT quality module solve?"
    asked_at: "S038 session-open"
    answer: "Speech-to-text transcription produces uncertain output; the module buffers segments, flags low-confidence ones, learns corrections, and manages review — so the platform can improve accuracy over time."
    confirmed: true
  - id: Q002
    type: Z
    question: "What proves this is done?"
    asked_at: "S038 session-open"
    answer: "All 5 TypeScript files exist in libs/integrations/speech/ with @csps-enforces P-META-022; validate-new-file-dna.mjs shows 0 violations; pnpm verify exit_code=0."
    confirmed: true
done_criteria:
  - "libs/integrations/speech/ — 5 TypeScript files with @csps-enforces P-META-022"
  - "tools/council/quality-protocols/ — 3 spec files mini-tree"
  - "validate-new-file-dna.mjs: 0 violations on new files"
  - "pnpm verify exit_code=0"
failure_signal: "STT module exists but no PI item, no @csps-enforces, or validate-new-file-dna blocks"

links:
  - { rel: parent, href: ../README.md }
context_question: "What is the current depth level of this topic plan, and have all prior depth gates been verified clean before proceeding to the next level?"
---

# S038: STT Module + Quality Protocols

## §0 — CONSOLIDATION CHECK

**Existing elements searched before creating new:**
- `libs/integrations/monitoring/sentry.ts` — covers error capture, NOT STT quality
- `libs/integrations/security/user-projections.ts` — field scoping, NOT speech
- No existing speech/STT module in `libs/integrations/` — novel, no duplication

**New files are genuinely novel.** No consolidation needed.

---

## §ET Enforcement Trio

| Rule | Tier 1 | Tier 2 | Tier 3 | Permanence |
|---|---|---|---|---|
| New libs/ files need DNA | post-stop-dna-sync-check.sh | validate-new-file-dna.mjs | session-open CAP | high |
| Quality specs enforced | post-stop-rzf-reminder.sh | validate-directive-has-rzf.mjs | quality-protocols/ specs | medium |

## §CC Creation Completeness Spec

| Artifact | Type | Wiring Destination | Registration | Enforcement Trio | Done Criterion |
|---|---|---|---|---|---|
| libs/integrations/speech/*.ts | Integration module | libs/integrations/index.ts exports | PI item | T2: validate-new-file-dna.mjs | exported + @csps-enforces annotation |
| tools/council/quality-protocols/ | mini-tree docs | communication-protocol-shared.md reference | validate-mini-tree-integrity | T3: session-open | README mini_tree_root PASS |

## §BC Before Coding Checklist

- [x] All wiring destinations specified
- [x] Enforcement trios declared
- [x] PI item covers speech/ path (this plan = plan-coverage-gate satisfied)
- [x] Done criteria are specific and testable
- [x] @csps-enforces annotations planned at creation time

## §IO Implementation Order

1. **Register:** This plan file → satisfies plan-coverage-gate for covered_paths
2. **Implement:** libs/integrations/speech/ → tools/council/quality-protocols/
3. **Wire:** libs/integrations/index.ts exports speech module
4. **Verify:** pnpm verify exit_code=0 → commit → push

## Phase 1 — S038-A: STT Module

`libs/integrations/speech/`: buffer.ts, dictionary.ts, detector.ts, review.ts, types.ts

## Phase 2 — S038-B: Quality Protocols Mini-Tree

`tools/council/quality-protocols/`: README.md, shared-rules.md, opus-quality-spec.md, sonnet-quality-spec.md

## Phase 3 — S038-C + Close

DNA audit + open items + closing-summary + HANDOFF
