---
name: EP-ERR-002
description: 'Error pattern registry: implement-without-ratification — recurring AI error with trigger, incident, and prevention mechanism.'
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
id: EP-ERR-002
pattern_name: implement-without-ratification
first_observed: S036
recurrence_count: 2
trigger: Creating new files in governance directories without explicit ratification
sample_incident: "OPUS-2 created core/L1-principles.md, L1-vocabulary.md without Governor review. Files implied constitutional status they did not have."
mechanical_prevention: plan-coverage-gate BLOCKS new libs/ files; PI ratification gate for core/
principle_reference: B_NO_IMPLEMENTATION_WITHOUT_PLAN + P-META-022
status: mechanically_prevented
session: S036
scope_level: S1
---

# EP-ERR-002 — Implement Without Ratification

**Training default:** 'Proceed' = full implementation license. Build immediately.

**CSPS override:** 'Proceed' authorizes ONE specific thing. Governance directories need PI item with ratified_at OR explicit Governor "ratified" in chat.

**Prevention:** `plan-coverage-gate` hook blocks new libs/ files without plan coverage.
