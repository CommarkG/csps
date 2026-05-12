---
id: csps.tools.templates.csep
name: cross-synergy-enhancement-plan-template
description: CSEP (Cross-Synergy Enhancement Plan) template. Output of the synergy-master skill analysis. Every ratified element in CSPS should trigger a CSEP to discover where its essence can enhance other platform surfaces. Reviewed by cruel-critic before integration. Vaulted between synergy-master production and cruel-critic review. Per B_KNOW_HOW_DISCIPLINE (positive harvest pipeline) + council-registry.md (synergy-master recurring protocol).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: meta-template
template_status: standard
core_spine: GVRN
schema_anchor: tools_templates_meta
template_id: cross-synergy-enhancement-plan
impl_status: sealed-zf
impl_sealed_at: S011
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# CSEP Template — Cross-Synergy Enhancement Plan

> Fill from synergy-master skill output. Vault with impl_status: swift-implemented. Cruel Critic reviews before integration.

## §1 — Source element

```yaml
csep_id: CSEP-S<NNN>-<NN>        # e.g. CSEP-S011-001
produced_by: synergy-master
produced_at: <iso>
impl_status: swift-implemented
vault_pending:
  - id: VLT-<session>-<NN>
    type: decision
    content: "Cruel Critic review pending before integration"
    retrieve_when: "cruel-critic skill runs review session"

source_element:
  type: principle | contract | ep-pattern | sg-pattern | validator | skill | architecture
  id: <P-XXX-NNN | B_NAME | EP-NNN | SG-NNN | etc.>
  name: <element name>
  ratified_session: S<NNN>

essence: |
  <One sentence: the core insight this element captures that could propagate>
```

## §2 — Synergy opportunities (ranked HIGH→LOW)

```yaml
synergy_opportunities:
  - rank: 1
    target_type: principle | contract | validator | skill | template | hook | artifact
    target_id: <specific artifact or dimension>
    enhancement: |
      <What specific change this synergy produces in the target>
    mechanism: |
      <How the source essence connects to the target — the logical bridge>
    evidence: |
      <Why this connection is non-obvious / what makes it valuable>
    impact: HIGH | MED | LOW
    effort: TRIVIAL | SMALL | MEDIUM | LARGE
    impl_status: swift-implemented
    integration_path: |
      <Specific action: add field to template / update §KH / extend validator / amend contract>
```

## §3 — Cruel Critic review (filled by cruel-critic skill)

```yaml
cruel_critic_review:
  reviewer: cruel-critic
  reviewed_at: <iso>
  verdict: APPROVED | CONDITIONAL | REJECTED
  amendment_findings:
    - amendment: 1  # estimated vs verified
      finding: "<>"
      severity: BLOCKING | WARN | INFO
    - amendment: 2  # hook reliability
      finding: "<>"
    - amendment: 3  # tests necessary not sufficient
      finding: "<>"
    - amendment: 4  # classification accuracy
      finding: "<>"
    - amendment: 5  # implementation optimism
      finding: "<>"
  scale_30_to_300: |
    <What happens at 10x scale>
  reversibility: SAFE | CONDITIONAL | RISKY
  conditions:
    - "<condition that must be met before integration>"
  integration_recommendation: proceed | defer-to-vault | abandon
```

## §4 — Integration tracking

```yaml
integration:
  status: pending | in-progress | integrated | deferred | abandoned
  integrated_at: <iso>
  integration_commits: []
  impl_status_after_integration: audit-1-complete | sealed-zf
```
