---
id: csps.governance.planning-spine.research-input
name: RESEARCH-INPUT
description: "Research as the Planning Spine's input sub-system. Consolidates research-registry + validate-research-reuse. Defines: research types, when-activated, save-template, processing, schema-hierarchy/connected-research, reuse-frequency, who triggers."
version: "0.1"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
status: ratified
authored_by: Sonnet S080
authored_at: "2026-06-05"
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - maturity:stable
links:
  - { rel: research-registry, href: ../../../../tools/config/research-registry.yaml }
  - { rel: validate-research-reuse, href: ../../../../tools/validators/validate-research-reuse.mjs }
  - { rel: planning-spine, href: PLANNING-SPINE.md }
  - { rel: p-meta-035, href: ../../../../packages/principles/principles/P-META-035-iteration-and-reuse.yaml }
---

# Research Input — Planning Spine Sub-system

> Research enters the Planning Spine as a loop trigger. This document consolidates the research infrastructure: `tools/config/research-registry.yaml` (the registry) and `tools/validators/validate-research-reuse.mjs` (the enforcement). No content duplication — cross-references only.

---

## Research in the Loop

Research is NOT a stage in the planning loop — it is an INPUT that can trigger re-entry at any stage:

```
External research arrives
        │
        ▼
   Is this research new (not in research-registry)?
        │
   YES: register in research-registry.yaml → re-trigger CLASSIFY
   NO:  retrieve existing research → inject into current stage context
```

---

## Research Types

| Type | Description | When activated | Who |
|------|-------------|----------------|-----|
| **Prior-art** | Existing industry solutions / patterns for a concept being planned | Before INTENT-CRYSTALLIZE — when a new concept is proposed | Sonnet during planning |
| **Platform-archaeology** | What CSPS itself has on this topic (in vault, registers, closed sessions) | At CHECK-EXISTS — when the Atlas query finds related but unfamiliar nodes | Sonnet during CHECK-EXISTS |
| **External-validation** | Third-party verification of a claim or approach | At COMPLETION-TEST — when IZFC sweep uses "external comparison" as an angle | Opus during OPIA |
| **CSP cross-platform** | What the sister platform (CSP) has done for the same problem | At CLASSIFY — when a new category of problem is identified | Governor during relay |
| **Failure-mode research** | Documented failure patterns (gap-recurrence-register k≥2) | Pre-simulate — understand what has failed in similar attempts | Sonnet during SIMULATE/SANDBOX |

---

## Research Registry (canonical — do not copy)

**Canonical home:** `tools/config/research-registry.yaml`

The registry is the SSoT for all research performed across CSPS sessions. The `validate-research-reuse.mjs` validator enforces: before commissioning new research, check whether matching research already exists.

**Key schema fields** (from canonical source):
- `id` — unique research node ID
- `topic` — what was researched
- `session` — when it was performed
- `spine` — which spine it informs
- `reuse_eligible` — can be cited in future plans
- `linked_plan_items` — which PI items consumed this research

---

## Connected Research Schema (hierarchy)

Research can reference prior research (e.g., "this prior-art research supersedes the earlier platform-archaeology pass on the same topic"). The schema supports:

```yaml
- id: research-NNN
  topic: "<concept>"
  supersedes: [research-NNN-1]   # this replaces older research
  extends: [research-NNN-2]      # this builds on, doesn't replace
  contradicts: [research-NNN-3]  # this changes a prior conclusion
```

This creates a research graph — not a flat registry — which allows the planning loop to understand not just "does research exist?" but "is this research still the most current understanding?"

---

## Reuse Frequency & the P-META-035 Connection

`validate-research-reuse.mjs` measures: how often is commissioned research reused vs. commissioned fresh? This is the P-META-035 (Iteration & Reuse) metric at the research layer. Target: reuse rate >60% (most research should build on existing; <40% new research per session is healthy).

**Honest current state:** The research-registry exists and the validator exists. The reuse-rate KPI is not yet measured — it's a `not_yet_propagated` item in the improvement-register.

---

## Save Template

When research is completed, it is saved to `research-registry.yaml` with:

```yaml
- id: research-<session>-<slug>
  topic: "<what was researched>"
  summary: "<key finding in 2-3 sentences>"
  session: S<NNN>
  spine: <spine>
  reuse_eligible: true | false
  linked_plan_items: []
  supersedes: []
  extends: []
  source_type: prior-art | platform-archaeology | external-validation | csp-cross-platform | failure-mode
```

---

## Who Triggers Research

| Trigger | Who | When |
|---------|-----|------|
| New concept proposed without precedent check | Sonnet (auto) | CHECK-EXISTS stage — `pre-tool-use-check-existing.sh` fires |
| New planning area entering CLASSIFY | Governor (relay) | At loop entry |
| Opus OPIA identifies an unverified claim | Opus | During COMPLETION-TEST |
| gap-recurrence-register K=2 gap in a known area | Sonnet (auto) | Pre-simulate — consult failure-mode research |

---
*RATIFIED v0.1 | Sonnet S080 | Ratified S082 · 2026-06-11*
