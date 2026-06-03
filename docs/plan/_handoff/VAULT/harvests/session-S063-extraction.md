---
id: csps.vault.session-S063-extraction
name: session-S063-extraction
description: "S063 session extraction stub. Opens at session start with 3-item mandate. Will be filled in at session close."
type: session_extraction
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: session_extractions
session: S063
links:
  - docs/plan/_handoff/RELAY-S063-consolidated-mandate.md
  - tools/data/gap-recurrence-register.yaml
  - tools/config/unified-plan.yaml
---

# Session S063 Extraction — IN PROGRESS

**Status:** Open (filling in at session close)

## S063 Mandate

- Item 1: K=4 gap fix — pre-commit-claim-validator-gate.sh (MUST-FIRST)
- Item 2: R4 reasoning hook — pre-commit-describe-without-implement.sh
- Item 3: 6 BATCH-K PROTO builds (validator/hook builds)

*Learnings, synergy opportunities, and inner-AI-defaults updates will be added at close.*
