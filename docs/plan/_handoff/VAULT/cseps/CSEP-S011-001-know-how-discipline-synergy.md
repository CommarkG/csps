---
id: csps.handoff.vault.csep.csep-s011-001
name: CSEP-S011-001-know-how-discipline-synergy
description: First CSEP (Cross-Synergy Enhancement Plan) — synergy-master analysis of B_KNOW_HOW_DISCIPLINE. Identifies 6 high-value synergy opportunities where the know-how discipline's essence (implicit→explicit + DO/DON'T harvest) can enhance other platform surfaces. Pending Cruel Critic review.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: csep_vault
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
session: S011
impl_status: swift-implemented
template_used: cross-synergy-enhancement-plan
vault_pending:
  - id: VLT-S011-005
    type: decision
    content: "Cruel Critic review of CSEP-S011-001 — 6 synergy opportunities need stability/scale assessment"
    context_ref: docs/plan/_handoff/VAULT/cseps/CSEP-S011-001-know-how-discipline-synergy.md
    session_added: S011
    retrieve_when: "When cruel-critic skill runs a review session OR monthly CSEP review"
---

# CSEP-S011-001 — B_KNOW_HOW_DISCIPLINE Synergy Analysis

> **Produced by:** synergy-master skill  
> **Source element:** B_KNOW_HOW_DISCIPLINE (S011 §24++++)  
> **Essence:** Converting implicit engineering requirements into explicit machine-checkable checklists, with a learning loop that harvests both errors (EP-NNN) and successes (SG-NNN) to improve future plans.

## §1 — Synergy opportunities (ranked)

### RANK 1 — HIGH impact, TRIVIAL effort
**Source:** B_KNOW_HOW_DISCIPLINE §KH Step 0 (apply SG-NNN DO patterns)  
**Target:** council-registry.md — each council member  
**Enhancement:** Every council member should list which EP patterns they prevent and which SG patterns they optimize for. The council becomes a DO/DON'T map by expert domain.  
**Mechanism:** When synergy-master runs, it checks if the source council member's EP/SG connections are in the registry. If not, the registry update is the first enhancement.  
**Integration path:** Add `prevents_eps: [EP-001, ...]` and `optimizes_for_sgs: [SG-001, ...]` fields to every council-registry.md member row.

### RANK 2 — HIGH impact, SMALL effort
**Source:** B_KNOW_HOW_DISCIPLINE's implicit→explicit conversion  
**Target:** impl_status state machine transitions  
**Enhancement:** Each transition point should have EXPLICIT criteria. `swift-implemented → audit-1-complete` is currently: "first mechanical audit passes." EXPLICIT: "validate-audit-slug-coverage=0 + validate-slice-freshness=0 + validate-no-implementation-without-plan=0." The transition gate should be machine-checkable, not AI-assessed.  
**Mechanism:** impl_status transitions currently have no enforcer. A `validate-impl-status-transitions.mjs` validator checks that the transition criteria are met before the status changes.  
**Integration path:** Add `transition_criteria:` field to impl_status enum definition + build validator.

### RANK 3 — HIGH impact, SMALL effort
**Source:** B_KNOW_HOW_DISCIPLINE EP-NNN classification → error pattern library  
**Target:** vault-methodology.md vault taxonomy  
**Enhancement:** Vault types should map to EP categories. Observation vault → EP-UNCLASSIFIED items. Question vault → research/design questions. The vault is currently typed by general category; it should be typed by EP/SG classification to enable know-how-extractor.mjs to process vault items efficiently.  
**Mechanism:** Add `ep_category: EP-NNN | SG-CANDIDATE | EP-UNCLASSIFIED` field to vault entries. know-how-extractor processes vault items with this classification in weekly runs.  
**Integration path:** Update vault-methodology.md §3 schema + governed-artifact-frontmatter template vault_pending entries.

### RANK 4 — MED impact, SMALL effort
**Source:** B_KNOW_HOW_DISCIPLINE §KH quality check  
**Target:** plan-creation-protocol.md §4 multi-session plan specifics  
**Enhancement:** §4 currently has 6 items for multi-session plans (depth, foundation, arc, backtrack, PE, push-back). A 7th: "§KH quality gate — each item has >30 chars of specific text referencing actual artifacts/validators/mechanisms." validate-plan-know-how.mjs upgrade from presence-check to quality-check.  
**Mechanism:** Upgrade the validator to measure §KH text length and specificity per item. This closes EP-010 (§KH quality degradation) mechanically.  
**Integration path:** Upgrade validate-plan-know-how.mjs quality scoring + plan-creation-protocol.md §4 item 7.

### RANK 5 — MED impact, MEDIUM effort
**Source:** B_KNOW_HOW_DISCIPLINE positive harvest (SG-NNN)  
**Target:** context-loading templates (all 8)  
**Enhancement:** Each context-loading template specifies required_artifacts (L1 reads). They should ALSO specify applicable_sgs — which success patterns apply when this task class fires. Engraving context → SG-001 (atomic registration). PCR context → SG-002 (slice-first lookup for principles). This makes the context-orchestrator a DO/DON'T orchestrator, not just a context loader.  
**Mechanism:** Add `applicable_eps: []` and `applicable_sgs: []` fields to context-loading JSON templates. context-orchestrator.sh logs these when firing.  
**Integration path:** Update all 8 context-loading JSON files + context-orchestrator.sh output format.

### RANK 6 — MED impact, MEDIUM effort
**Source:** B_KNOW_HOW_DISCIPLINE learning loop (session→EP/SG→pre-plan)  
**Target:** weekly health hook §1 (know-how extraction)  
**Enhancement:** The weekly hook currently runs know-how-extractor but doesn't AUTO-UPDATE the pre-plan-creation.md checklist. The loop is: extractor finds pattern → AI manually decides to update checklist → K=2 promotion happens. This should be: extractor finds pattern → AUTO-generates §KH addition → presents to Governor for approval → one-click integrate.  
**Mechanism:** know-how-extractor.mjs produces not just classification output but also generated §KH text for the relevant pre-plan checklist item. Governor reviews + approves → commit.  
**Integration path:** Upgrade know-how-extractor.mjs to generate §KH suggestions + add `--generate-kh` flag.

## §2 — Cruel Critic review (PENDING)

```yaml
cruel_critic_review:
  reviewer: cruel-critic
  status: PENDING
  vault_ref: VLT-S011-005
  retrieve_when: "cruel-critic skill review session OR monthly CSEP review"
```

## §3 — Integration tracking

| Opportunity | Status | Effort | Target session |
|---|---|---|---|
| RANK 1: Council EP/SG mapping | swift-implemented | TRIVIAL | S012 |
| RANK 2: impl_status transition criteria | swift-implemented | SMALL | S012 |
| RANK 3: Vault type → EP classification | swift-implemented | SMALL | S012 |
| RANK 4: §KH quality validator upgrade | swift-implemented | SMALL | S012 |
| RANK 5: Context templates + SG/EP fields | architecture-pending | MEDIUM | S013 |
| RANK 6: know-how-extractor §KH auto-generate | architecture-pending | MEDIUM | S013 |
