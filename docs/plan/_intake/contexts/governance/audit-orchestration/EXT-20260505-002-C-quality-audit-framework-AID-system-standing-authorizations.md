---
extraction_id: EXT-20260505-002-C
parent_input_id: EXT-20260505-002
section_label: "§7 Quality Audit Framework + AID-NNN system + 14 audit kinds + standing authorizations"
source_type: AI_OTHER
confidence: 0.95
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T04:35:00Z
pipeline_state: routed
routed_to: docs/plan/pillar-0-governance/audit-hub.md (existing) + audit-runner.md extension + new AID-NNN registry
next_review_at: 2026-05-06T04:35:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_layer: L2 (detailed extraction; L3 deep-dive when audit-runner builds week-4)
deep_dive_schedule: Week-4 audit-runner ship (per build-order.md week-4) — apply AID-NNN + standing authorizations as audit-runner architecture; OR S010 Phase 8-9 if earlier
priority_for_10_phase_completion: MEDIUM (informs Phase 9 measurement validator + Phase 10 continuous validation; not blocking Phase 5-7)
consolidation_cross_refs:
  - feedback_audit_orchestration.md (memory entry 26) — CSPS audit-hub.md exists with 10 pipelines
  - EXT-20260505-001-C (7 PE invocation points) — composes (Quality Audit IS one of the audit-runner orchestration outputs)
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T04:35:00Z
scope_level: S1
---

# Extract C — Quality Audit Framework + AID-NNN system + Standing authorizations

## Essence

CSP runs **AID-NNN (Audit ID; 3-digit sequential)** for every audit instance — full lifecycle metadata per `quality_audit_schema.json` (audit_kind / audit_target / triggered_by / agent_session_uuid / findings_count + by_severity / consolidated_status / linked_artifacts / signature). **14 enumerated audit kinds** + **standing authorizations** (audits AI may run without per-instance Governor approval — POST_BATCH_RZF / HANDSHAKE_HYGIENE_AUDIT / ROUTINE_BUS_DRY_RUN / ADVISORY_RATCHET_REVIEW / MECHANICAL_GAP_AUDIT). **CSPS has audit-hub.md with 10 pipelines but no AID-NNN registry, no enumerated kinds list, no standing-authorization mechanism** — friction-reduction opportunity.

## Verbatim source quotes

**14 audit kinds (§7):**
> "RZF_FULL / POST_BATCH_RZF / DRIFT_FROM_CANONICAL / ZERO_FIRE_VALIDATOR_REVIEW / BANNER_BUDGET_AUDIT / HANDSHAKE_HYGIENE_AUDIT / ADVISORY_RATCHET_REVIEW / CONSOLIDATION_AUDIT / OBLIGATION_REGISTRY_AUDIT / CRUEL_CRITIC_FIRE / ARTIFACT_COVERAGE_SWEEP / ROUTINE_BUS_DRY_RUN / FOLD_AUDIT / MECHANICAL_GAP_AUDIT"

**Standing authorizations (§7):**
> "POST_BATCH_RZF after every BATCH_CLOSE
> HANDSHAKE_HYGIENE_AUDIT when 3 verified handshakes accumulate
> ROUTINE_BUS_DRY_RUN before scheduled fire
> ADVISORY_RATCHET_REVIEW when ADVISORY window expires
> MECHANICAL_GAP_AUDIT quarterly + on-demand on Governor 'make it mechanical' trigger"

**State machine per audit:**
> "SCHEDULED → RUNNING → COMPLETE_CLEAN / COMPLETE_FINDINGS_OPEN / COMPLETE_FINDINGS_RESOLVED / ABANDONED"

## CSPS current state

- **audit-hub.md** has 10 pipelines (per memory entry 26 + audit-hub.md L57-L240+); each pipeline has audit slugs but NO AID-NNN identifier per audit-instance
- **B_HANDOFF_PRE_FLIGHT_AUDIT** (P-META-013) — runs at every session-close (analog of POST_BATCH_RZF standing authorization)
- **B_PRE_CLOSE_VERIFICATION** (P-META-008) — pnpm verify at every close (analog of validator-suite mechanical run)
- **No AID-NNN registry** — CSPS audits are slug-named not instance-IDed
- **No standing authorizations** — every audit is either continuously-running (validators) or session-close-mandatory (HPFA / verify); no in-between "AI can fire when condition met"
- **CSPS has equivalent of CONSOLIDATION_AUDIT / MECHANICAL_GAP_AUDIT?** No — CONSOLIDATION_AUDIT is what CSP file #3 is about (just received); MECHANICAL_GAP_AUDIT analog needed

## Recommended downstream action

**Per "save + schedule deep-dive" directive — defer to week-4 audit-runner ship:**

1. **NEW LEDGER (week-4):** `docs/plan/_handoff/VAULT/audit-instance-registry.md` (CSPS analog of CSP's AID-NNN registry) — one row per audit-instance with full lifecycle metadata
2. **NEW SCHEMA (week-4):** `tools/templates/audit-instance.template.md` + frontmatter spec — includes audit_kind enum
3. **AID-NNN CSPS-adapted enum** (subset of CSP's 14, focused on CSPS week-4 needs):
   - `RZF_FULL` (already part of P-META-006)
   - `POST_BATCH_RZF` (already part of B_HANDOFF_PRE_FLIGHT_AUDIT)
   - `HANDSHAKE_HYGIENE_AUDIT` (CSPS analog: HPFA)
   - `MECHANICAL_GAP_AUDIT` (NEW for CSPS — adapts CSP S336 H0d pattern)
   - `CONSOLIDATION_AUDIT` (NEW for CSPS — directly from CSP file #3)
   - `TAG_STATUS_DEEP_AUDIT` (NEW per user directive S008 turn 8 — registered THIS BATCH 5/5 atomic)
4. **STANDING AUTHORIZATIONS for CSPS** (subset):
   - HPFA after every session-close (already standing per protocols.md)
   - Tag-status-deep-audit weekly (NEW this batch)
   - Consolidation-audit after every comprehensive-guide authoring same-batch

## Open questions

- AID-NNN sequential per CSPS-wide OR per-pipeline?
- Standing authorizations — 4-condition gate (per CSPS autonomous-execution discipline) implicit OR explicit per-authorization spec?
- audit-instance-registry.md location: under `_handoff/VAULT/` (governance trail) OR new `docs/plan/audit-instances/` (separate concern)?

## Engraving readiness

⚠️ DEFERRED to week-4 audit-runner ship. Standing authorization for tag-status-deep-audit IS engraving THIS BATCH (per user directive).
