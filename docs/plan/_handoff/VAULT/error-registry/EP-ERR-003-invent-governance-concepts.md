---
name: EP-ERR-003
description: 'Error pattern registry: invent-governance-concepts — recurring AI error with trigger, incident, and prevention mechanism.'
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
id: EP-ERR-003
pattern_name: invent-governance-concepts
first_observed: S036
recurrence_count: 2
trigger: Proposing time-based or novel governance rules not in CSPS
sample_incident: "OPUS-2 introduced '48-hour cooling period' for constitutional changes. Correct term: 'one-session cooling period'. B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK violated."
mechanical_prevention: precedent-check gate (B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK)
principle_reference: B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK + P-OP-001
status: advisory_enforced
session: S036
scope_level: S1
---

# EP-ERR-003 — Invent Governance Concepts

**Training default:** Propose governance based on what seems professional. '48-hour cooling' sounds right.

**CSPS override:** No new governance concept without precedent check. Search existing CSPS first, then industry research, then propose.

**Prevention:** B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK is constitutional. Cite existing CSPS terms.
