---
name: synergy-master
description: When running a cross-synergy analysis OR reviewing how a ratified element enhances other platform parts OR producing a CSEP (Cross-Synergy Enhancement Plan) — analyze how any well-defined principle/contract/pattern in ONE place can enhance ALL other relevant platform surfaces. Outputs a structured CSEP vaulted for Cruel Critic review. Triggers on "synergy", "cross-synergy", "CSEP", "core synergy", "synergy master", "how does X enhance Y", "propagate this insight", "cross-enhancement". Never generic: always cite specific source + target + mechanism.
allowed_tools: [Read, Grep, Glob, Write]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-META-019
backed_by_contract: B_STRUCTURAL_PREVENTION_DISCIPLINE
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_KNOW_HOW_DISCIPLINE
  - B_CONSOLIDATION_PASS
  - B_STRUCTURAL_PREVENTION_DISCIPLINE
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: CSEP-structured-synergy-analysis
  max_tokens: 3000
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: true
principle_compliance:
  - P-META-010    # AAP
  - P-META-002    # principles-travel-with-artifacts
  - P-META-019    # structural-prevention-discipline
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/council-registry.md    # council member registration
  - docs/plan/pillar-0-governance/qc-coverage-map.md     # where synergies surface
  - docs/plan/_handoff/VAULT/know-how/                   # EP/SG patterns to propagate
template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
scope_level: S1
batch: BATCH-C
lifecycle_state: active
template_depth: L2
parent_template: skill-base
---

# /synergy-master — Core Cross-Synergy Analysis

## When to invoke

- After any NEW principle, behavioral contract, or EP/SG pattern is ratified
- When asked "how does X relate to Y in the platform?"
- Monthly synergy scan (council recurring protocol)
- When preparing a Cross-Synergy Enhancement Plan (CSEP)

## The 5-step synergy analysis

### Step 1 — Source identification
Name the element being analyzed:
```
SOURCE: <element type> / <element name> / <session ratified>
ESSENCE: <one sentence — what is the core insight this element captures?>
```

### Step 2 — Platform scan
For each of the 4 rings × 4 dimensions in qc-coverage-map.md:
- Does the SOURCE essence apply here?
- If yes: what specific enhancement would it produce?
- What artifact would be affected?

### Step 3 — Synergy opportunity ranking
Rank by: (impact × effort_ratio). HIGH = big impact, small change. LOW = small impact, big change.

### Step 4 — CSEP production
Output a structured Cross-Synergy Enhancement Plan (see CSEP template).

### Step 5 — Vault for Cruel Critic
Set impl_status: swift-implemented on the CSEP.
Vault_pending: Cruel Critic review required before integration.

## What the Cruel Critic checks
- Does the enhancement create new dependencies that break edge cases?
- Is the token budget for the enhancement justified?
- Is the change reversible?
- Does it work at scale (what happens at 300 elements vs 30)?
- Does it create infinite synergy loops?

## Output format (CSEP)

```yaml
csep_id: CSEP-S<NNN>-NNN
source_element: <type>:<name>
essence: "<one sentence>"
synergy_opportunities:
  - rank: 1
    target: <artifact or dimension>
    enhancement: "<what changes>"
    mechanism: "<how it connects>"
    impact: HIGH | MED | LOW
    effort: TRIVIAL | SMALL | MEDIUM | LARGE
    impl_status: swift-implemented
cruel_critic_status: pending | approved | rejected
integration_status: pending | integrated | vaulted
vault_ref: VLT-S<NNN>-NNN
```
