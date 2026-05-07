---
id: csps.tools.templates.gradual-build-plan
name: gradual-build-plan-template
description: Canonical template for every multi-session topic-plan per P-META-016 (Gradual-Build-by-Foundations). Produces a topic-plan instance under _handoff/VAULT/topic-plans/<topic-id>.md. Mandatory frontmatter fields + body sections + priority-engine integration + ZF gates per level + backtrack triggers + cross-layer audits. Depth-3/4/5 schema enforced (free-form N rejected by validator priority-engine-depth-respected).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: meta-template
template_status: novel-pending-pattern-evaluation
core_spines: [GVRN, OPER]
template_id: gradual-build-plan
template_version: 1.0
applicability_trigger: |
  Multi-session topic entering CSPS — any work that:
  (a) requires >1 session arc, OR
  (b) depends on >2 platform elements being foundation-stable, OR
  (c) crosses >1 Core Spine, OR
  (d) classified as cross-actor (affects persona / agent / customer-facing app)
validators_atomic:
  - gradual-build-plan-coverage
  - priority-engine-inputs-complete
  - priority-engine-depth-respected
  - foundation-stability-before-layer-N
  - humble-batching-required
  - backtrack-trigger-coverage
escape_hatch: |
  template_status: novel-pending-pattern-evaluation
  Promoted to stable after K=2 successful uses
tags:
  - domain:governance
  - domain:ops
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ./ }
  - { rel: schema, href: ./priority-engine.schema.yaml }
  - { rel: governs, href: ../../docs/plan/pillar-0-governance/csps-core-manifest.md }
  - { rel: registry, href: ../../docs/plan/_handoff/VAULT/template-registry.md }
session: S006
---

# Gradual-Build-Plan Template

> Use this template for every multi-session topic-plan. Replace `<placeholders>` with concrete content. Required frontmatter fields are listed below; required body sections are §1-§10.

---

## Required frontmatter

```yaml
---
id: csps.handoff.vault.topic-plan.<topic-id>
name: <topic-id>
description: <one-paragraph what this topic-plan does + composition rationale per humble-batching>
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_version: 1.0
template_status: novel-pending-pattern-evaluation | stable
core_spines: [<one or more of GVRN, ARCH, AI, OPER, VALD>]
tags:
  - domain:<>
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft | stable
diataxis_type: how-to
session: S<NNN>
topic_id: <kebab-case-slug>
priority_score: <0-100 from priority engine>
priority_band: 1 | 2 | 3 | 4
multi_session_arc: [S<NNN>, S<NNN+1>, ...]
alignment_verified_session: S<NNN>    # updated each session this plan is reviewed
execution_mode: velocity | balanced | deep_quality   # S015: velocity=speed/Sonnet, balanced=verify-gated/Sonnet, deep_quality=assumption-blocks/Opus for intersections
depth_chosen: 3 | 4 | 5
depth_rationale: |
  <factors evaluated:
   - leverage (downstream fan-out)
   - cross-actor (persona/agent/customer impact)
   - reversibility
   - multi-session cost
   - dependency-graph fan-out>
backtrack_register:
  - trigger-id: <slug>
    action: <what surfaces it + amendment action>
links:
  - { rel: parent, href: ../README.md }
  - { rel: governs-engravings, href: <path-if-applicable> }
muv_audit:
  required_sections_present: PASS | FAIL with finding
  alignment_questions_count: <N for cross-chat handshakes; 0 for internal sequencing>
---
```

---

## §0 — Triad Governance Check (P-META-021 — mandatory for all plans)

> **Per P-META-021:** No single governance layer covers all situations. Plans must declare the triad for their most consequential decisions. This section is NOT optional — it is the difference between a plan that works once and a plan that navigates correctly across infinite session boundaries.

**Q1 — What are the 1-3 most consequential decisions this plan will make?**
(A decision is consequential if it is hard to reverse, affects multiple artifacts, represents a new situation class, or blocks future phases.)
```
Decision 1: <describe>
Decision 2: <describe>
Decision 3: <describe>
```

**Q2 — For each consequential decision, does the triad exist?**

| Decision | Context layer (L2 spine) | Principle layer (P-* or B_*) | Mechanical layer (hook/validator) |
|---|---|---|---|
| <decision 1> | <which L2 domain> | <which principle> | <which enforcer> |
| <decision 2> | | | |

**Q3 — What are the VLTs (Governor decisions) this plan requires before L3 can start?**
(List here; register in tools/session-state.json blocking_decisions; PENDING = phase advance blocked per B_CONSENSUS_BEFORE_PROCEEDING)
```
VLT-<NNN>-001: <question>
VLT-<NNN>-002: <question>
```

**Q4 — Config hierarchy check (S014 canonical pattern — silent override):**
"Does this plan touch any hierarchical configuration? (settings.json, tsconfig, ZModel extends, .env, GitHub Actions)"
If YES: name every parent config and confirm ALL critical fields are EXPLICITLY declared at the child level.
```
Config: <name>
Parent: <parent config path>
Critical field: <field name>
Explicitly declared at child level: yes / no
```
WHY: The S014 canonical instance — project settings.json had permissions{} without defaultMode. System used DEFAULT (not parent's value). Silent. Invisible. Every session ran with degraded governance. EXPLICIT OVER IMPLICIT in ALL config hierarchies.

**Why this section exists:** The platform has infinite future situations. Rules enumerated for today's situations will not cover tomorrow's. The triad (context + principle + mechanical) is the only mechanism that scales. A plan that doesn't declare its triad for consequential decisions is a plan that will drift the moment a new situation appears. This section makes the governance architecture explicit — not as overhead, but as load-bearing structure.

---

## Required body sections

### §1 Foundation primitives (Level 1) — depends on: nothing

| Path | Purpose | Core Spine |
|---|---|---|
| <artifact-1-path> | <purpose> | <spine> |

**Exit criteria (L1 → L2 gate):**
- [ ] All N foundation files created + frontmatter PASS
- [ ] Cross-link integrity check (all `links:` resolve)
- [ ] `pnpm zf:phase` — ZF Orchestrator Level 2 achieved (iteration count recorded in tools/zf-session-tracker.json)
- [ ] [other criteria specific to topic]

> **Per P-META-021:** `pnpm zf:phase` not `pnpm verify`. The difference: Level 2 runs pnpm verify PLUS instruction-context + extraction check + PE re-assessment. A level that only passes `pnpm verify` (Level 1) has not been properly ZF-checked. Every level boundary is a CONSEQUENTIAL decision requiring the full triad.

### §2 Foundation composition (Level 2) — depends on: L1

| Surface | Artifact | Action |
|---|---|---|
| <surface> | <artifact> | ADD/AMEND |

**Exit criteria (L2 → L3 gate):**
- [ ] [criteria]

### §3 Core (Level 3) — depends on: L2

(Same structure)

### §4 Integration + cross-layer audits (Level 4) — depends on: L3

(For depth-5 topics; depth-4 topics omit if not needed; depth-3 collapses §4 into §3)

### §5 Polish + observability + drift detection (Level 5) — depends on: L4

(For depth-5 topics only)

### §6 Priority Engine — inputs for level placement

```yaml
priority_engine:
  topic_id: <topic-id>
  depth_chosen: 3 | 4 | 5
  depth_rationale: see frontmatter
  inputs_per_level:
    L1_foundation:
      leverage: 1-10
      dependency_satisfied: 0 | 1
      reversibility: 1-10
      risk_of_rework: 1-10
      multi_session_cost: 0.X-N (sessions)
      priority_score: <calculated>
    L2: ...
    LN: ...
  ranked_next_layers:
    1: L1 (placed first; reason)
    2: L2 (after L1 ZF)
    ...
  push_back_log:
    - rejected_attempt: <description>
      reason: <which discipline rejected it>
```

### §7 Cross-layer audits (mandatory)

| Audit slug | What it catches | Pipeline |
|---|---|---|
| <slug> | <description> | <pipeline-id> |

### §8 Backtrack triggers register

| Trigger | What surfaces it | Action |
|---|---|---|
| <trigger> | <surface mechanism> | <amendment action> |

### §9 Subsequent-turn engraving execution sequence

| Turn | Level | Work | Files touched |
|---|---|---|---|
| N+1 | L1 | <work> | <count> files |
| N+2 | L2 | <work> | <count> files |
| ... | ... | ... | ... |

**Discipline:** if a turn cannot complete a level, split level across turns; never start L+1 before L ZF passes.

### §9.5 Context-Loss Prevention Checklist (mandatory; references canonical catalog)

**Per [plan-creation-protocol.md §3 Step 4](../../docs/plan/pillar-0-governance/plan-creation-protocol.md):** every multi-session plan declares applicable pains from [context-loss-pains.md](../../docs/plan/pillar-0-governance/context-loss-pains.md) (single canonical catalog; don't restate).

```yaml
context_loss_prevention:
  consulted: docs/plan/pillar-0-governance/context-loss-pains.md
  applies_to_this_plan:
    # Cite PAIN-* IDs most-relevant to this topic-plan; per-Class guidance below.
    # Class A (D1-D10 cognitive failure modes) — cite 2-3 most-relevant
    - PAIN-D2: <how this plan prevents doctrine-completion-feels-like-completion>
    # Class B (token / context-budget) — multi-session always cites these
    - PAIN-AUTO-COMPACT: <how this plan handles /compact at L<N>→L<N+1> transitions>
    - PAIN-MODEL-SWITCH: <how this plan respects task-boundary model switches>
    # Class C (cross-session / cross-chat) — multi-session always cites
    - PAIN-CHAT-JUMP-DEGRADATION: <how chat-jump-prompt LEAN ensures continuity>
    - PAIN-PROTOCOL-COMPRESSION: <how every protocol item transcribed to TodoWrite>
    # Class D (operational friction) — cite if plan touches .claude/* or settings.json
    - PAIN-PERMISSION-POPUP: <if plan authors hooks/skills, diff-first-ask discipline>
    # Class E (validation / drift) — cite if plan introduces engravings
    - PAIN-FALSE-ZF-0: <how RZF re-runs evidenced same-batch>
  not_applicable:
    - PAIN-X: <reason this pain doesn't apply to this plan>
```

**Validator** `plan-context-loss-section-present` (week-4) audits this section non-empty.

### §10 Topic-plan attestation (L0)

```yaml
topic_plan_zf:
  ran_at: <ISO-8601-UTC>
  cycles_run: <N>
  findings:
    - <finding> | none
  status: ZF-0-ACHIEVED-CYCLE-<N>
  signature: S<NNN>-AI-topic-plan-attest-<ISO-8601-UTC>-<topic-id>-L0
```

---

## §HARVEST — Mandatory harvest section (S015 — every plan must declare this)

> Every plan must answer: what is this plan designed to TEACH? Harvesting is not a session-close ceremony — it is structural. This section defines what to collect, when, and where.

```yaml
harvest_triggers:
  - on: phase_gate                  # fires at each L<N> → L<N+1> boundary
    collect:
      - schema_decisions_made
      - patterns_discovered
      - assumption_violations
      - simpler_approaches_found
    destination: vault              # vault first — process at gate, distribute after review
    vault_path: docs/plan/_intake/vault/<topic-id>/

  - on: discovery                   # fires when AI finds something unexpected mid-implementation
    collect: [divergence_from_assumption, unexpected_constraint, performance_finding]
    destination: raw-thoughts-queue # immediate capture, low cost, processed at next gate

  - on: plan_close
    collect: [full_extraction_cycle, lessons_for_next_similar_plan, graduation_path_if_applicable]
    destination:
      - extraction_note: docs/plan/_handoff/VAULT/session-<NNN>-extraction.md
      - pattern_home: <canonical destination for plan-specific patterns>

harvest_questions:                  # what are we TRYING TO LEARN by executing this plan?
  - "<specific learning question 1>"
  - "<specific learning question 2>"
  # These guide the extraction at each gate — not abstract, not generic.
```

---

## Composition rules

1. **Multi-discipline batching (per humble-batching):** if topic-plan covers >1 discipline, frontmatter description MUST cite composition rationale (why these are co-load-bearing in one batch)
2. **Depth choice rejected if free-form N:** validator `priority-engine-depth-respected` rejects N ∉ {3,4,5}
3. **Per-level ZF mandatory:** L<N+1> work blocked until L<N> ZF cycle passes per `foundation-stability-before-layer-N`
4. **Backtrack triggers must be registered atomically:** trigger entries in §8 PLUS frontmatter `backtrack_register:` field
5. **Priority engine inputs complete:** all 6 inputs per level (leverage / dependency_satisfied / reversibility / risk_of_rework / multi_session_cost / priority_score) — validator `priority-engine-inputs-complete`
6. **Each level cites its prior level dependencies:** L<N> §depends_on: must list L<N-1> + any cross-level prerequisites
7. **Push-back log preserved:** §6 push_back_log captures rejected shortcuts (per priority-engine.schema.yaml §8 push-back rules)

---

## Example instances

| Topic-plan | Depth | Status |
|---|---|---|
| [s006-governance-foundation.md](../../docs/plan/_handoff/VAULT/topic-plans/s006-governance-foundation.md) | 5 | active (L1 in progress) |
| [zero-laptop-dependency-setup.md](../../docs/plan/_handoff/VAULT/topic-plans/zero-laptop-dependency-setup.md) | 3 | active (opens after governance foundation L2 closes) |

---

**Template signature:** S006-AI-gradual-build-plan-template-2026-05-04T16:00:00Z
