---
id: csps.handoff.vault.topic-plan.platform-core-alignment
name: platform-core-alignment
description: >
  Core Alignment and Completion phase — Governor directive S018. Perfects the platform's
  own governance infrastructure: Threshold (session-open gate), vocabulary canon
  (meta-terms as registered vocabulary), file-split discipline (mini-trees pattern with
  template + enforcement), push-back mechanical enforcement, and harvesting pipeline
  (positive + negative channels flowing end-to-end). All declared things must be
  mechanically enforced. Nothing floats as prose-only governance.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: GVRN
core_spines: [GVRN, AI, VALD, ARCH, OPER]
schema_anchor: topic_plans
tags:
  - domain:governance
  - type:how-to
  - audience:ai-agent
  - audience:developer
  - maturity:draft
diataxis_type: how-to
session: S018
execution_mode: deep_quality
intent_crystallized: true
threshold_route: platform.governance
know_how_consulted: true
enforcement_stage: planned
topic_id: platform-core-alignment
priority_score: 97
priority_band: 1
depth_chosen: 5
depth_rationale: |
  Depth-5: (a) All 5 levels address different governance layers that must be closed
  in sequence; (b) Threshold perfection (L5) depends on vocabulary (L1) and
  enforcement (L2-L4) being complete; (c) No level can be skipped — each is a
  foundation for the next. This is a governance improvement meta-plan.
links:
  - { rel: parent, href: ./README.md }
  - { rel: threshold-gate, href: ../../../pillar-0-governance/threshold-gate-v2.md }
  - { rel: vocabulary-as-code, href: ../../../pillar-1-architecture-and-stack/vocabulary-as-code.md }
  - { rel: audit-runner, href: ../../../pillar-0-governance/audit-runner.md }
  - { rel: inner-ai-defaults, href: ../inner-ai-defaults/README.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/threshold-gate-v2.md
  - docs/plan/pillar-0-governance/behavioral-contracts.md
  - docs/plan/pillar-0-governance/audit-runner.md
  - docs/plan/_handoff/VAULT/inner-ai-defaults/README.md
  - AGENTS.md
domain_path: platform
scope_level: S1
context_question: "What is the current depth level of this topic plan, and have all prior depth gates been verified clean before proceeding to the next level?"
---
## §0 — CONSOLIDATION CHECK (mandatory — read before any implementation)

CHECK WHAT EXISTS before any implementation step in this plan.
- Search: tools/validators/ for existing validators covering this area
- Search: tools/generators/ for existing generators
- Search: .claude/hooks/ for existing hooks
- Search: docs/plan/pillar-0-governance/audit-runner.md for registered slugs
- Search: docs/plan/_handoff/VAULT/topic-plans/ for overlapping plans
- Search: libs/ for existing integrations and patterns

Consolidation finding: [update with findings when implementing each step]



# Topic-Plan — Platform Core Alignment (depth-5)

> **Governor directive S018:** "Core Alignment and Completion. All declared things must be mechanically enforced. Nothing floats as prose-only governance. Threshold first."

---

## §HARVEST — What this plan is designed to extract

```yaml
harvest_triggers:
  - on: phase_gate
    collect: [governance_gaps_closed, enforcement_surface_added, vocabulary_term_registered]
    destination: vault
    vault_path: docs/plan/_intake/vault/platform-core-alignment/
  - on: plan_close
    collect: [threshold_protocol_complete, mini_trees_template_ratified, push_back_enforced]
    destination:
      - extraction_note: docs/plan/_handoff/VAULT/session-S019-extraction.md
      - governance_hub: docs/plan/pillar-0-governance/

harvest_questions:
  - "Is every governance declaration now backed by at least one mechanical enforcement?"
  - "Does the Threshold fire correctly on every session-open?"
  - "Are positive and negative harvesting both measurable end-to-end?"
  - "Can a new AI instance orient itself in < 3 minutes using only the Threshold artifacts?"
```

---

## §1 — Level 1: Vocabulary Canon — Register Meta-Terms

**Goal:** Every term used in platform governance exists in the vocabulary canon with definition + structure + canonical home. No more terms that live only in conversation.

**Missing terms to register:**

| Term | Definition to register | Canonical home |
|---|---|---|
| **Threshold** | The governance entry point for every session and every input. Consists of: session-open protocol + CONCEPT_LOAD + inner-AI-defaults consultation + P-META-020 context activation. The Threshold is where the platform's "context as compass" becomes active. All inputs pass through the Threshold before work begins. | threshold-gate-v2.md |
| **Mini-trees** | A file organization pattern where a logically coherent domain is expressed as: one intro+index file (context + purpose + links + audit trail) + N sub-files (each covering one semantic section). Sub-files can be stubs (frontmatter + description + placeholder content + at least one link). The intro+index file is the canonical entry point; sub-files are self-contained but cross-referenced. | To be created: docs/plan/pillar-0-governance/mini-trees-pattern.md |
| **Split (governance)** | The act of decomposing a monolithic file that exceeds the dual-gate threshold (>300 lines AND ≥3 distinct semantic sections) into a mini-tree. Distinct from code splits. Governed by validate-file-complexity.mjs (to be built). | mini-trees-pattern.md |
| **Positive harvesting** | The CEC cycle: when a positive event occurs (insight / ratified element / successful fix / AI self-correction), walk all platform surfaces asking "where does this enhance other elements?" Iterate until 0 new opportunities. Enforced by post-tool-use-cec-trigger.sh hook. | B_POSITIVE_VALUE_EXTRACTION + P-META-006 |
| **Negative harvesting** | The catch-to-engraving cycle: when a gap/anti-pattern/failure is observed, convert it to a persistent artifact (memory + AGENTS.md hard NO + validator + contract). The observation alone is wasted unless engraved. Enforced by B_CATCH_TO_ENGRAVING. | B_CATCH_TO_ENGRAVING + learning-loop.md |
| **Core Alignment** | The state where every governance declaration has: (a) a canonical home, (b) at least one mechanical enforcement surface, (c) a validator or hook that catches violations. "Declared but not enforced" = not aligned. | This plan |

**Actions:**
1. Add all 6 terms to `docs/plan/pillar-1-architecture-and-stack/vocabulary.md` with structure
2. Add `concept_ref` annotations to each term (which L2 spine it belongs to)
3. Register `vocabulary-canon-completeness` audit slug (checks known meta-terms exist in vocabulary.md)

**L1 Exit Criteria:**
- [ ] All 6 terms in vocabulary.md with definition + structure + canonical home
- [ ] vocabulary-canon-completeness audit slug registered in audit-runner.md
- [ ] pnpm verify exit_code 0

---

## §2 — Level 2: File-Split Discipline — Mini-Trees Template + Enforcement

**Goal:** Platform files exceeding the dual-gate threshold are split into mini-trees. Template ensures consistency. Validator catches new violations automatically.

**Dual-gate threshold (ratified S018):**
```
SPLIT REQUIRED: lines > 300 AND distinct_semantic_sections ≥ 3
SPLIT ADVISORY: lines > 150 AND distinct_semantic_sections ≥ 2
STUB FILES: allowed with frontmatter + description + ≥1 link (satisfies nothing-stands-alone)
```

**Mini-trees template (to be created at `tools/templates/mini-tree-intro.template.md`):**
```markdown
---
[standard frontmatter]
mini_tree_root: true
sub_files:
  - path: ./sub-file-1.md
    covers: "<one sentence>"
  - path: ./sub-file-2.md
    covers: "<one sentence>"
---

# [Domain Name] — Overview

> [One-sentence purpose of this domain]

## What this covers

[2-3 sentences of context]

## Sub-files

| File | Covers |
|---|---|
| [sub-file-1.md](./sub-file-1.md) | ... |
| [sub-file-2.md](./sub-file-2.md) | ... |

## Status and audit trail

[Current state + last review date]
```

**Files that need splitting (identified S018):**

| File | Lines | Action |
|---|---|---|
| `token-optimization.md` | 1,321 | Split: intro + §2(L2) + §3(L3) + §4(L4) + §5(L5) sub-files |
| `closing-summary-template.md` | 594 | Split: intro + §10a-d + §10e-j + §10k-m sub-files |
| `architecture-principles.md` | 521 | Split: intro + ARCH/GVRN/AI/VALD/OPER sub-files |
| `qc-audit-system.md` | 513 | Assess — may be one coherent domain |
| `model-routing-dashboard.md` | 494 | Split: intro + routing-profiles + decision-matrix sub-files |
| `audit-hub.md` | 456 | Already partial — complete mini-tree |
| `learning-loop.md` | 412 | Split: intro + state-machine + audit-pipeline sub-files |

**Validator to build: `validate-file-complexity.mjs`**
- Scans all `.md` files in `/docs`
- Flags files exceeding dual-gate threshold without `mini_tree_root: true` in frontmatter
- EXIT 0 advisory (not blocking) until templates are complete; promotes to blocking when template registry covers all flagged files

**L2 Exit Criteria:**
- [ ] `tools/templates/mini-tree-intro.template.md` created + registered in template-registry.md
- [ ] `validate-file-complexity.mjs` authored + wired in pnpm verify (advisory mode)
- [ ] All 7 listed files assessed: split started OR explicitly deferred with WHY
- [ ] Audit slug `file-complexity-threshold` registered in audit-runner.md
- [ ] pnpm verify exit_code 0

---

## §3 — Level 3: Push-Back — Mechanical Enforcement

**Goal:** "AI must push back when warranted" moves from prose declaration to mechanically enforced behavior.

**Current state (S018):**
- AGENTS.md prose section ✅ (declared)
- B_AI_PROFESSIONAL_VOICE contract ✅ (declared)
- Memory ✅ (persisted)
- **HARD NO bullet** ❌ (missing from mechanical section)
- **Inner-AI-defaults entry** ❌ (missing — "failing to push back" is a distinct failure mode from sycophancy)
- **Validator** ❌ (not mechanically checkable without session-log analysis)

**Actions:**
1. Add to AGENTS.md ❌ hard-NO section: "Never omit push-back when evidence / precedent / contradicting fact exists — even when the Governor seems committed to a direction. Silence = tacit endorsement. Cite your grounding."
2. Add inner-AI-defaults entry: `ai-behavior-spine/push-back-duty.md` (disposition: override — training default is to validate user's direction; CSPS requires active challenge when warranted)
3. Register audit slug `push-back-on-conflict` (per-session advisory — session log scan for turns where AI agreed with a Governor assertion that contradicts a registered principle)

**L3 Exit Criteria:**
- [ ] AGENTS.md ❌ hard-NO bullet added for push-back duty
- [ ] inner-AI-defaults entry authored: push-back-duty.md
- [ ] audit slug `push-back-on-conflict` registered in audit-runner.md
- [ ] pnpm verify exit_code 0

---

## §4 — Level 4: Harvesting Pipeline

> **ZF MANDATE FOR THIS LEVEL:** extraction-check-blocking is now BLOCKING (S018). ZF Level 3 ACHIEVED = last run at ZERO BLOCKING. Progress toward zero is not zero. (INST-VALD-001) — Both Channels Flowing

**Goal:** Positive and negative harvesting both run measurably end-to-end. Not declared — confirmed flowing.

**Positive channel (CEC) — current gaps:**
- Extraction-check is ADVISORY in ZF (not blocking)
- No validator confirms extraction note was written before session close sign-off
- Fix: promote `extraction-check` to BLOCKING in ZF orchestrator (not advisory)

**Negative channel (catch-to-engraving + learning loop) — current gaps:**
- LearningLoopItem schema exists ✅ (ZModel defined)
- But DB table doesn't exist on live Supabase (needs pnpm db:push cycle to include it)
- No pipeline from "observed gap → LearningLoopItem created → triage → validator → fix"
- continuous-drift-log.md exists ✅ but no scheduled audit reads + acts on it
- Fix: create `tools/validators/validate-learning-loop-coverage.mjs` + schedule weekly review

**Actions:**
1. Promote `extraction-check` in ZF orchestrator from advisory to BLOCKING (edit zf-orchestrator.mjs)
2. Confirm LearningLoopItem table exists in live Supabase (needs pnpm db:push with full schema)
3. Create `validate-learning-loop-coverage.mjs`: checks that any observed gap in current session has a corresponding catch-to-engraving artifact (memory entry OR AGENTS.md hard NO OR validator)
4. Schedule weekly continuous-drift-log.md review (cron or hook)

**L4 Exit Criteria:**
- [ ] `extraction-check` promoted to BLOCKING in ZF orchestrator
- [ ] `validate-learning-loop-coverage.mjs` authored + wired in pnpm verify
- [ ] audit slug `learning-loop-coverage` registered
- [ ] pnpm verify exit_code 0

---

## §5 — Level 5: Threshold Perfection

**Goal:** The Threshold (session-open governance gate) is complete, validated, and self-documenting. Any new AI instance can orient in < 3 minutes using only Threshold artifacts.

**Current state:**
- `threshold-gate-v2.md` exists ✅
- CONCEPT_LOAD fires per-input ✅
- session-open.sh fires ✅ (but is a stub in many Q-checks)
- inner-AI-defaults registry ✅
- **No session-open completeness validator** ❌
- **15 Q-checks in session-open.sh** — most are advisory prompts, not enforced checks
- **Threshold vocabulary entry** ❌ (L1 closes this)

**Actions:**
1. `threshold-gate-v2.md` → convert to mini-tree: intro (what Threshold is + how to use) + Q-checks-reference.md + session-open-protocol.md + concept-load-reference.md
2. `validate-session-open-completeness.mjs`: checks that session-state.json was read + pnpm verify ran + VLTs confirmed in the current session before first substantive work
3. Document the 3-minute orientation sequence in `threshold-gate-v2.md` intro
4. Register audit slug `threshold-completeness` in audit-runner.md

**L5 Exit Criteria:**
- [ ] `threshold-gate-v2.md` converted to mini-tree (intro + 3 sub-files)
- [ ] `validate-session-open-completeness.mjs` authored + wired in pnpm verify
- [ ] audit slug `threshold-completeness` registered
- [ ] Vocabulary entry "Threshold" registered (L1 dependency)
- [ ] pnpm verify exit_code 0

---

## §Priority Engine

```yaml
priority_engine:
  topic_id: platform-core-alignment
  depth_chosen: 5
  priority_band: 1
  priority_score: 97
  dependency_sequence: L1 → L2 → L3 → L4 → L5
  note: Each level depends on vocabulary (L1) being complete. L5 (Threshold) is the
        highest-value output but requires all prior levels as foundations.
  B_COMPLETION_OVER_SHINY: active — once L1 starts, do not add new items until gate passes.
```
