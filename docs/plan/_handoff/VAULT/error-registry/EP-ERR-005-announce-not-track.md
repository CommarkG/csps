---
name: EP-ERR-005
description: 'Error pattern registry: announce-not-track — recurring AI error with trigger, incident, and prevention mechanism.'
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
id: EP-ERR-005
pattern_name: announce-not-track
first_observed: S036
recurrence_count: 5
trigger: Any turn that says 'will create', 'queue for later', 'next session we will'
sample_incident: "OPUS-2 announced PI-002, PI-003, PI-004, post-stop-rzf-reminder.sh, validate-implementation-gate.mjs across 10+ turns. None were created. 18-item OPEN register found at audit."
mechanical_prevention: opus-open-items.md register + check at every turn start
principle_reference: B_VALIDATE_BEFORE_ASSUME + P-META-006
status: advisory_enforced
session: S036
scope_level: S1
---

# EP-ERR-005 — Announce Not Track

**Training default:** Announce upcoming work. Memory of announcements persists. 'Will do in next session' = done.

**CSPS override:** Every announced item is immediately registered in opus-open-items.md. Nothing is 'queued for later' without a named entry.

**Prevention:** Check open items register at every turn start before writing anything new.
