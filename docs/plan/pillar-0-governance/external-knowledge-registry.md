---
id: csps.governance.external-knowledge-registry
name: external-knowledge-registry
description: "Registry of all EXT-KNOW entries absorbed into CSPS. Tracks source, status, evidence level, and CSPS artifacts produced."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: governance_docs
diataxis_type: reference
session: S039
impl_status: swift-implemented
links:
  - { rel: parent, href: ./audit-runner.md }
  - { rel: governs, href: ../../_intake/external-knowledge/ }
---

# External Knowledge Registry

Every external knowledge item absorbed into CSPS appears here. Raw research always saved. Nothing lost.

## Registry

| ID | Source | Status | Evidence Level | CSPS Outcome | Artifacts | Date |
|---|---|---|---|---|---|---|
| EXT-KNOW-001 | [Temp name!!!] competitor landscape | raw | 1 | COMPLEMENT | — | 2026-05-17 |
| EXT-KNOW-002 | [Temp name!!!] market hypothesis + STT mapping | raw | 1 | COMPLEMENT | PROP-APP3-001 | 2026-05-17 |
| EXT-KNOW-003 | External document architecture patterns | processed | 3 | PARTIAL_COMPLEMENT | PROP-GOV-001, PROP-GOV-002, PROP-GOV-003 | 2026-05-17 |

## Status Values

- `raw` — captured, not yet fully processed
- `in_progress` — DNA confrontation underway
- `processed` — confronted, outcome declared, artifacts produced
- `archived` — no longer active, kept for reference

## CSPS Outcome Values

- `COMPLEMENT` — enhances CSPS without conflict
- `NEW` — adds capability CSPS doesn't have; requires PROP-NNN
- `CONFLICT` — contradicts sealed CSPS principles; documented why not adopted
- `PARTIAL_COMPLEMENT` — some aspects useful, others conflict

## Proposals Generated

| Proposal | From EXT-KNOW | Description | Status |
|---|---|---|---|
| PROP-APP3-001 | EXT-KNOW-002 | [Temp name!!!] as App #3 on CSPS | Awaiting Governor ratification |
| PROP-GOV-001 | EXT-KNOW-003 | Add scope.owns/does_not_own to doc template | Awaiting Governor ratification |
| PROP-GOV-002 | EXT-KNOW-003 | Processing checklist for EXT-KNOW entries | Awaiting Governor ratification |
| PROP-GOV-003 | EXT-KNOW-003 | evidence_level: 0-5 taxonomy for EXT-KNOW | Applied (already in EXT-KNOW-001/002/003) |

*Updated: 2026-05-17 | Next: absorb files 04-09, 10, 11 from [Temp name!!!] project*
