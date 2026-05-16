---
name: EP-ERR-006
description: 'Error pattern registry: context-fades-mid-session — recurring AI error with trigger, incident, and prevention mechanism.'
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
id: EP-ERR-006
pattern_name: context-fades-mid-session
first_observed: S036
recurrence_count: 6
trigger: Any message without the mandatory handshake after turn 1; governance drift after turn 5
sample_incident: "Sonnet stopped using 'Opus, this is Sonnet.' handshake after turn 1. OPUS-2 drifted from 'Read [file] —' directive format by turn 5. Session-open governance not sufficient."
mechanical_prevention: validate-communication-protocol.mjs + user-prompt-submit hooks inject reminders every turn
principle_reference: communication-protocol-shared.md RULE 1 + RULE 6
status: mechanically_prevented
session: S036
scope_level: S1
---

# EP-ERR-006 — Context Fades Mid-Session

**Training default:** Governance rules read at session start persist for the session. Context is stable.

**CSPS override:** Governance is injected at EVERY turn start via user-prompt-submit hooks. The protocol repeats in every directive header. Context compression is the enemy.

**Prevention:** validate-communication-protocol.mjs + communication-protocol-shared.md RULE 4 (contextual locality).
