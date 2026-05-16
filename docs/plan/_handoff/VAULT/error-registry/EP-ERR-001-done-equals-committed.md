---
name: EP-ERR-001
description: 'Error pattern registry: done-equals-committed — recurring AI error with trigger, incident, and prevention mechanism.'
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
id: EP-ERR-001
pattern_name: done-equals-committed
first_observed: S034
recurrence_count: 3
trigger: Any 'done' or 'complete' claim without running validate-wiring-completeness.mjs
sample_incident: "OnboardingWizard built S034-C, called nowhere. Declared done. Existed as orphan for 2+ sessions. validate-wiring-completeness.mjs found it."
mechanical_prevention: validate-wiring-completeness.mjs (ADVISORY) + validate-active-protocol.mjs
principle_reference: P-ARCH-031
status: mechanically_prevented
session: S036
scope_level: S1
---

# EP-ERR-001 — Done Equals Committed

**Training default:** Claude declares DONE when code is committed and pnpm verify passes.

**CSPS override:** DONE = built + wired + called + output verified in a real execution path. Commit is necessary but not sufficient.

**Prevention:** `validate-wiring-completeness.mjs` classifies every exported symbol as WIRED/DEFERRED/ORPHAN. ORPHAN = not done.
