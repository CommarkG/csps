---
id: csps.vault.error-registry.index
name: error-registry-index
description: Mechanical error registry — each file documents a recurring AI error pattern with trigger, incident, and prevention mechanism.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S036
scope_level: S1
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: parent, href: ../README.md }
---

# Error Registry — CSPS

Each EP-ERR file documents a recurring AI error pattern. When the Governor sends a correction,
the pattern is harvested here to prevent recurrence.

**Naming:** `EP-ERR-NNN-[pattern-kebab].md`
**Trigger:** post-stop-error-harvest.sh detects correction keywords → "HARVEST GATE" prompt
**Coverage:** validate-error-registry-coverage.mjs checks all override entries have EP-ERR

| ID | Pattern | Status |
|---|---|---|
| EP-ERR-001 | done-equals-committed | mechanically_prevented |
| EP-ERR-002 | implement-without-ratification | mechanically_prevented |
| EP-ERR-003 | invent-governance-concepts | mechanically_prevented |
| EP-ERR-004 | sycophantic-compliance | advisory_enforced |
| EP-ERR-005 | announce-not-track | advisory_enforced |
| EP-ERR-006 | context-fades-mid-session | mechanically_prevented |
