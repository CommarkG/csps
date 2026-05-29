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

# 2. Core Rule

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

Suggested fields:

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

## Fundamental

Only what is needed to give first value.

## Basic

Initial personalization and routing.

## Advanced

Workflow, structure, and operational understanding.

## Deep Dive

Strategic, behavioral, emotional, and optimization-level understanding.

---

# 5. Question Types

## Orientation Question

Used to understand what the user wants right now.

## Clarifying Question

Used when one missing detail can improve output.

## Reflective Question

Used after trust exists to deepen understanding.

## Negative-Friction Question

Used carefully to uncover hidden pain.

Example:

> What do you dislike most about the way this is handled today?

## Asset-Based Prompt

Used to lower cognitive load by allowing uploads, screenshots, documents, websites, or examples.

## Confirmation Question

Used to validate an inference before product configuration.

## Correction Question

Used when conflict or contradiction exists.

---

# 6. Question Placement by Core Spine

## L0 — Constitutional Rules

Questions cannot violate:

- no interrogation
- value before extraction
- trust before depth
- user control
- no sensitive extraction without justification

## L1 — Governance Protocols

Questions are governed by:

- timing rules
- confidence thresholds
- sensitivity classification
- fallback behavior
- audit requirements

## L2 — System Pipelines

Questions can feed:

- intake pipeline
- classification pipeline
- confidence pipeline
- shadow profile pipeline
- promotion pipeline
- configuration pipeline
- audit pipeline

## L3 — Product Modules

Questions may affect:

- onboarding
- dashboard setup
- bundle recommendation
- template selection
- support routing
- feature suggestions
- monetization triggers

## L4 — UX / Content / Questions

The visible question text, tone, microcopy, examples, and interaction style live here.

---

# 7. Question Threshold Rules

## Low Sensitivity

May be asked early if useful.

Examples:

- goal today
- preferred starting point
- workspace name

## Medium Sensitivity

Ask after value delivery or clear justification.

Examples:

- team size
- operational workflow
- customer type

## High Sensitivity

Ask only after trust, clear value, and explicit explanation.

Examples:

- revenue
- financial stress
- regulated data
- legal/compliance exposure
- employee problems

---

# 8. Question Timing Rules

Good timing:

- after first value
- after user expresses satisfaction
- when one answer directly improves output
- after upload or asset ingestion
- when activating a relevant feature
- during profile review

Bad timing:

- before value
- during cold start except one orientation question
- immediately after an error
- in the middle of active task completion
- after too many questions
- without explaining why

---

# 9. Question Budget

Suggested default:

- maximum 3 orchestrated questions per session
- maximum 1 soft confirmation per session
- no high-sensitivity question during cold start
- no repeated question if answer already exists with high confidence

---

# 10. Storage / Vault Mapping

## Identity Vault

Questions that determine deterministic identity or role.

## Intelligence Vault

Questions that enrich probabilistic understanding.

## Configuration Vault

Questions whose answers directly affect bundles, feature flags, templates, or dashboard setup.

## Interaction Vault

Questions asked, skipped, answered, paused, resumed.

## Governance Vault

Question audit logs, sensitivity decisions, threshold decisions, overrides.

## Asset Vault

Uploaded files and extracted source evidence.

---

# 11. CSPS Should Assess

Before building question lists, CSPS should inspect:

1. What questions already exist?
2. Which questions are essential?
3. Which questions are asked too early?
4. Which questions should be delayed?
5. Which questions can be replaced by asset upload?
6. Which questions affect product configuration?
7. Which questions require audit or confirmation?
8. Which questions are currently stored without clear use?

---

# 12. Final Rule

Do not build a question bank first.

Build the question placement schema first.

Then every future question can be added safely into the correct domain, depth, pipeline, Core Spine layer, vault, and threshold rule.
