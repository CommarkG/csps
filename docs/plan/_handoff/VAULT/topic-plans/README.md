---
id: csps.handoff.vault.topic-plans
name: topic-plans
description: Topic-plans directory — every multi-session topic enters via a templated gradual-build-plan instance per P-META-016 (gradual-build-by-foundations). Each plan declares foundations + 3/4/5 levels + priority-engine inputs + ZF gates + backtrack triggers. Filename pattern `<topic-id>.md`. Per humble-batching, topics are NOT auto-bundled — each plan stands alone with explicit composition rationale if multi-discipline.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: governs, href: ../../pillar-0-governance/behavioral-contracts.md }
  - { rel: schema, href: ../../../../tools/templates/gradual-build-plan.template.md }
---

# Topic Plans

Per **P-META-016 — Gradual-Build-by-Foundations** (engraved S006 turn N): every multi-session topic that enters CSPS goes through a templated gradual-build plan with 3/4/5-depth selection + priority-engine sequencing.

## Filename pattern

`<topic-id>.md` — kebab-case slug; topic-id matches `topic_id:` frontmatter.

Examples:
- [s006-governance-foundation.md](./s006-governance-foundation.md) — the bundle engraving template-first + gradual-build + CSPS-alignment as one batch (depth-5)
- (future) `foundation-slices.md` — User/Tenant/AuditEvent slices (depth-5; opens after s006-governance-foundation closes)

## Mandatory frontmatter fields

| Field | Required | Purpose |
|---|---|---|
| `template_used` | yes | Always `gradual-build-plan` |
| `template_version` | yes | Tracks template evolution |
| `topic_id` | yes | Slug matching filename |
| `priority_score` | yes | Calculated from priority-engine formula |
| `multi_session_arc` | yes | List of session IDs spanning the topic |
| `depth_chosen` | yes | 3, 4, or 5 (free-form N rejected by validator) |
| `depth_rationale` | yes | Why this depth (factors named) |
| `backtrack_register` | yes | List of trigger-id + action pairs |

## Mandatory body sections

1. **§1 Foundation primitives (Level 1)** — depends on nothing
2. **§2-§N Per-level sections** — each with depends_on + artifacts + exit_criteria
3. **§N+1 Priority Engine** — inputs per level + ranked_next_layers + push_back_log
4. **§N+2 Cross-layer audits** — list of audit slugs catching cross-level violations
5. **§N+3 Backtrack triggers register** — what surfaces each trigger + action
6. **§N+4 Subsequent-turn engraving sequence** — explicit per-turn execution plan

## Validators (Pipeline 10 — csps-alignment-over-inner-defaults)

- `gradual-build-plan-coverage` — multi-session topic in handoff/governor-prompts without plan file
- `priority-engine-inputs-complete` — plan with missing priority-engine fields
- `priority-engine-depth-respected` — depth ∉ {3,4,5}
- `humble-batching-required` — batch without composition rationale
- `foundation-stability-before-layer-N` — L+1 work without L ZF
- `backtrack-trigger-coverage` — topic without registered triggers

## Lifecycle

| State | When |
|---|---|
| `active` | Currently being executed across declared session arc |
| `closed` | All levels at ZF; topic-plan closure signature emitted |
| `superseded` | Replaced by amended plan (rare; backtrack trigger usually amends in-place) |
| `aborted` | Topic dropped before completion (must include reason in frontmatter) |
