---
id: csps.vault.governor-uploads.S068.03-question-placement-schema
name: 03-question-placement-schema-V1
description: "Governor-uploaded S068. Question Placement Schema — every question is a governed system object with question_id, domain, depth_level, type, purpose, user_value, friction, sensitivity, timing, storage_vault, derived_profile_target, pipeline, core_spine_layer, confidence_effect, can_affect_configuration, requires_confirmation, fallback. 4 depth levels (Fundamental/Basic/Advanced/Deep Dive). 7 question types. 6 storage vaults (Identity/Intelligence/Configuration/Interaction/Governance/Asset). Cold-start governance. Sensitivity threshold rules. Question budget (max 3 orchestrated questions per session). Core rule: build question placement schema BEFORE building question banks."
type: vault_files
protection_level: protected
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S068
authored_by: Governor (uploaded)
absorbed_by: Opus-12
date: 2026-05-28
core_spine: ARCH
core_spines: [ARCH, GVRN, AI]
schema_anchor: vault_files
inherits_from: "Profile-Product Handoff [[02-profile-product-handoff-contract-V1]] + Governance Constitution [[04-governance-constitution-V1]] + L4 UX Content Questions layer (NEW)"
links:
  - rel: master-plan
    href: ../../../MASTER-RE-GATE-PLAN-S068.md
  - rel: absorption-protocol
    href: 01-universal-absorption-brief-V1.md
  - rel: companion
    href: 02-profile-product-handoff-contract-V1.md
  - rel: companion
    href: 04-governance-constitution-V1.md
context_question: "Before adding ANY question: can the system answer the 8 questions in §2 (purpose, value, storage, pipeline, spine, configuration effect, threshold, fallback)? If not, question stays as draft until it can."
---

# CSPS Question Placement Schema
## How Questions Should Be Classified, Stored, Routed, and Governed

Version: V1
Status: Foundation Schema
Purpose: Prevent the creation of random question banks by ensuring every question has a place, purpose, pipeline, threshold, and governance path.

---

# 1. Purpose

At this stage, CSPS should not receive a giant list of onboarding questions.

It should first receive the schema that determines where every future question belongs.

A question is not just text shown to a user.

A question is a governed system object.

Every question should have:

- a purpose
- a domain
- a depth level
- a sensitivity level
- a timing rule
- a storage destination
- a pipeline connection
- a confidence effect
- a fallback path
- a product configuration relationship

---

# 2. Core Rule — 8 Questions Per Question

No question should be added to CSPS unless the system can answer:

1. Why are we asking this?
2. What user value does it improve?
3. Where will the answer be stored?
4. Which pipeline does it affect?
5. Which Core Spine layer does it belong to?
6. Can the answer influence product configuration?
7. What confidence threshold is required before acting on it?
8. What happens if the user skips or contradicts it?

---

# 3. Question Object Schema

```json
{
  "question_id": "q_business_goal_001",
  "question_text": "What are you trying to accomplish today?",
  "domain": "intent",
  "depth_level": "fundamental",
  "question_type": "orientation",
  "purpose": "understand immediate user intent",
  "user_value": "helps the system suggest the best starting point",
  "friction_level": "low",
  "sensitivity_level": "low",
  "required_timing": "cold_start_phase_1",
  "allowed_contexts": ["new_user", "new_workspace", "new_project"],
  "disallowed_contexts": ["mid_task", "error_recovery"],
  "answer_storage_vault": "interaction_vault",
  "derived_profile_target": "layer_2.intent.current_goal",
  "pipeline": "intake_pipeline",
  "core_spine_layer": "L4_UX_Content_Questions",
  "confidence_effect": "initial_signal_only",
  "can_affect_configuration": false,
  "requires_confirmation_before_configuration": true,
  "fallback_if_skipped": "continue_with_generic_starting_path",
  "audit_required": false
}
```

---

# 4. Question Depth Levels

- **Fundamental** — only what's needed for first value
- **Basic** — initial personalization and routing
- **Advanced** — workflow, structure, operational understanding
- **Deep Dive** — strategic, behavioral, emotional, optimization-level

---

# 5. Question Types (7)

1. **Orientation** — what does the user want right now
2. **Clarifying** — one missing detail to improve output
3. **Reflective** — used after trust to deepen understanding
4. **Negative-Friction** — uncover hidden pain (use carefully)
5. **Asset-Based Prompt** — lower cognitive load via uploads/screenshots/docs
6. **Confirmation** — validate inference before configuration
7. **Correction** — when conflict or contradiction exists

---

# 6. Question Placement by Core Spine

## L0 — Constitutional Rules

Questions cannot violate: no interrogation / value before extraction / trust before depth / user control / no sensitive extraction without justification.

## L1 — Governance Protocols

Governed by: timing rules / confidence thresholds / sensitivity classification / fallback behavior / audit requirements.

## L2 — System Pipelines

Questions can feed: intake / classification / confidence / shadow profile / promotion / configuration / audit pipelines.

## L3 — Product Modules

May affect: onboarding / dashboard setup / bundle recommendation / template selection / support routing / feature suggestions / monetization triggers.

## L4 — UX / Content / Questions

The visible text, tone, microcopy, examples, interaction style.

---

# 7. Sensitivity Threshold Rules

- **Low** (goal, starting point, workspace name) — may ask early
- **Medium** (team size, workflow, customer type) — after value delivery or justification
- **High** (revenue, financial stress, regulated data, legal exposure, employee problems) — ONLY after trust + clear value + explicit explanation

---

# 8. Question Timing Rules

**Good:** after first value / after satisfaction / when one answer improves output / after upload / during feature activation / during profile review.

**Bad:** before value / cold start (except 1 orientation question) / right after error / mid-task / after too many questions / without explaining why.

---

# 9. Question Budget

- max 3 orchestrated questions per session
- max 1 soft confirmation per session
- NO high-sensitivity question during cold start
- NO repeated question if answer already exists with high confidence

---

# 10. Storage / Vault Mapping (6 vaults)

1. **Identity Vault** — deterministic identity / role questions
2. **Intelligence Vault** — probabilistic enrichment questions
3. **Configuration Vault** — questions directly affecting bundles, flags, templates, dashboards
4. **Interaction Vault** — questions asked, skipped, answered, paused, resumed
5. **Governance Vault** — question audit logs, sensitivity decisions, threshold decisions, overrides
6. **Asset Vault** — uploaded files and extracted source evidence

---

# 11. CSPS Should Assess

Before building question lists, inspect:

1. What questions already exist?
2. Which are essential?
3. Which are asked too early?
4. Which should be delayed?
5. Which can be replaced by asset upload?
6. Which affect product configuration?
7. Which require audit or confirmation?
8. Which are stored without clear use?

---

# 12. Final Rule

Do NOT build a question bank first.

Build the **question placement schema** first.

Then every future question can be added safely into the correct domain, depth, pipeline, Core Spine layer, vault, and threshold rule.
