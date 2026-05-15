---
id: csps.handoff.vault.element-reviews
name: element-reviews
description: Place for deeper review and research on platform elements — what exists + what could be enhanced + priority placement for enhancements. Per user S006 turn 5 directive "we must have a place for deeper review and research on all the platform's elements". Element-review = special instance of gradual-build at depth-3 (L1 state-of-art / L2 enhancement opportunities / L3 priority placement). Filename pattern `<element-id>-S<NNN>.md`. Composes with audit-hub Pipeline 10 (csps-alignment) + topic-plans for enhancements that warrant their own arc.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: registry-canonical
template_status: novel-pending-pattern-evaluation
core_spines: [GVRN, VALD]
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: governs, href: ../../pillar-0-governance/csps-core-manifest.md }
  - { rel: composes-with, href: ../topic-plans/README.md }
session: S006
domain_path: platform
scope_level: S1
---

# Element Reviews

> **Per user directive S006 turn 5:** "we must have a place for deeper review and research on all the platform's elements. what exists and could enhanced doing this".

This vault directory is the place. Each element review is a depth-3 gradual-build-plan instance scoped to ONE platform element (a pillar leaf, a B_* contract, a P-META principle, a slice, an ADR, a validator script, etc.).

## Filename pattern

`<element-id>-S<NNN>.md` — kebab-case element-id + session of review.

Examples:
- `priority-engine-S006.md` — review of priority engine after S006 PE absorptions
- `csps-core-manifest-S007.md` — review of Core Spine architecture after first usage data
- `template-registry-S008.md` — review of template registry K=2 promotion data

## Per-review structure (depth-3)

### §1 What exists (L1 state-of-art inventory)

```yaml
element_id: <slug>
review_session: S<NNN>
element_owner: <persona | role>

current_state:
  artifacts_count: <N>
  pillar_location: <pillar-N | vault | tools>
  core_spines: [<list>]
  mechanical_enforcement_status:
    declared: <count>
    active: <count>
    deferred: <count with reasons>
  surfaces_present:
    memory: yes | no
    contract: yes | no
    AGENTS_NO: yes | no
    spine_row: yes | no
    audit_atomic: yes | no
    validator_implementation: yes | partial | no
  cross_references_inbound: <count>
  cross_references_outbound: <count>
  last_amended: <date>
```

### §2 Enhancement opportunities (L2 gap analysis)

```yaml
gaps_vs_csps_aligned_ideal:
  - gap_id: <slug>
    description: <what's missing>
    blast_radius: LOW | MED | HIGH | CONSTITUTIONAL
    estimated_leverage: 0-10
    cross_element_impact: [<elements affected>]
    risk_of_rework_if_deferred: 0-10
    recommended_fix:
      type: validator | hook | schema-field | contract-amendment | new-leaf | re-engraving
      description: <what to build>
      surfaces_to_engrave_atomically: [memory, contract, AGENTS, spine, audit]
```

### §3 Priority placement (L3 enhancement queue)

```yaml
priority_placement:
  via_priority_engine: see priority-engine.schema.yaml
  ranked_enhancements:
    1: <gap-id> (PE_SCORE: X.X | recommended-session: S<NNN>)
    2: <gap-id> (PE_SCORE: X.X | recommended-session: S<NNN>)
  blocked_by:
    - <gap-id>: blocked on <prerequisite>
  vaulted:
    - <gap-id>: <activation-condition>
  promoted_to_topic_plan:
    - <gap-id>: see _handoff/VAULT/topic-plans/<topic-id>.md
```

### §4 Review attestation (L0)

```yaml
review_zf:
  ran_at: <ISO-8601-UTC>
  cycles_run: <N>
  findings:
    - <finding> | none
  reviewer: AI | persona | user
  signature: S<NNN>-AI-element-review-<ISO-8601-UTC>-<element-id>
```

---

## When to author an element review

**Trigger conditions:**
1. After a topic-plan closes that touched the element (close-of-arc retrospective)
2. When `alignment-drift-over-time` flags drift on the element
3. When user explicitly requests deeper inspection
4. When K=2 enhancement opportunities surface in the element's `continuous-drift-log` entries
5. Quarterly cadence per `element-review-staleness` audit (any element not reviewed in 90+ days)

**Authority:** AI proposes; user-as-Governor ratifies the priority_placement section before any L3 enhancement opens its own topic-plan.

---

## Composition with audit-hub Pipeline 10

Element reviews CONSUME audit-hub findings + PRODUCE enhancement candidates that flow into:
- New audit slugs (atomic per FSE)
- New B_* contracts (5/5 atomic)
- New topic-plans (when enhancement is multi-session)
- Validator-script implementations (closing previously-deferred registrations)

This is the **continuous improvement loop** that the user S006 turn 8 ratified Q-2 tweak demands: every enforcement-skip surfaces here as an enhancement opportunity → priority engine places it → topic-plan executes it.

---

## Validators

| Slug | Catches | Status |
|---|---|---|
| `element-review-required-sections` | Review missing §1/§2/§3/§4 | registered (impl deferred) |
| `element-review-staleness` | Element not reviewed in 90+ days | registered (impl deferred) |
| `enhancement-promoted-to-topic-plan-coverage` | Promoted enhancement without topic-plan instance | registered (impl deferred) |

---

**Registry signature:** S006-AI-element-reviews-2026-05-04T16:10:00Z
