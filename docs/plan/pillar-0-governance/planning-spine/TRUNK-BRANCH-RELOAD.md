---
id: csps.governance.planning-spine.trunk-branch-reload
name: TRUNK-BRANCH-RELOAD
description: >
  The Planning Spine as a reusable core model: TRUNK (7-stage universal loop) = SUBSTRATE+DEFAULT;
  BRANCHES (domain specializations) = VARIETY. Branch INHERIT-ONLY rule. Branch-activation reload
  as the structural cure for Domain-2/3 inheritance drift. Named inter-stage data contract
  (crystallized_intent field) resolves FINDING-S082-01. GVRN artifact, NOT a 6th L1 spine.
  Parent model for scheduled persona-core-spine cluster.
version: "0.1"
status: ratified
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
authored_by: Sonnet S082
authored_at: "2026-06-10"
session: S082
impl_status: swift-implemented
finding_resolved: FINDING-S082-01
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: trunk-doc, href: ./PLANNING-SPINE.md }
  - { rel: inheritance-model, href: ./INHERITANCE-MODEL.md }
  - { rel: stage-3-emits, href: ./stages/03-INTENT-CRYSTALLIZE.md }
  - { rel: stage-6-consumes, href: ./stages/06-COMPLETION-TEST.md }
  - { rel: platform-attitude, href: ../JOURNEY-CONSOLIDATION-DRAFT-S072.md }
  - { rel: no-orphans, href: ../../../../packages/principles/principles/P-META-036-no-orphans-law.yaml }
  - { rel: persona-cluster-inherits, href: ../../../../tools/council/opus-turn.md }
---

# Planning Spine — Trunk-Branch-Reload Model

> **GVRN artifact, not a 6th L1 Spine.** The Planning Spine is a governance METHOD — it governs how CSPS plans. It does not define a new knowledge domain. The 5 L1 spines (GVRN/ARCH/AI/OPER/VALD) are knowledge domains with coverage areas. The Planning Spine is a process model that lives under GVRN, exactly as Simulation is a method under VALD.

---

## §1 — The Model in One Diagram

```
TRUNK (SUBSTRATE + DEFAULT — universal, every domain)
╔══════════════════════════════════════════════════╗
║  1. CLASSIFY                                     ║
║  2. CHECK-EXISTS                                 ║
║  3. INTENT-CRYSTALLIZE ──emits──► crystallized_intent
║  4. DUAL-FOCAL                                   ║
║  5. SIMULATE/SANDBOX                             ║
║  6. COMPLETION-TEST ◄──consumes── crystallized_intent
║  7. LOOP-EXIT or LOOP-BACK                       ║
╚══════════════════════════════════════════════════╝
      │ INHERIT (mandatory; not override)
      ▼
BRANCH (VARIETY — domain specialization)
┌──────────────────────────────────────────────────┐
│  All 7 trunk stages INHERITED               │
│  + domain steps ADDED between trunk stages       │
│  ┌─────────────────────────────────────────┐    │
│  │  3.1 [domain-specific pre-design step]  │    │
│  │  5.1 [domain validation gate]           │    │
│  └─────────────────────────────────────────┘    │
│  ON ACTIVATION → RELOAD trunk constraints        │
└──────────────────────────────────────────────────┘
```

Platform-Attitude vocabulary (S072, ratified S081):
- **TRUNK** = SUBSTRATE (invariant) + DEFAULT (baseline behavior when no branch active)
- **BRANCH** = VARIETY (selectable domain specialization)
- Same pattern: trunk = the thing that always ships; branch = the thing consumer selects

---

## §2 — TRUNK: The Universal 7-Stage Loop

The trunk is the PLANNING-SPINE.md 7-stage loop. It is:

1. **Mandatory** — no domain branch may skip or override a trunk stage
2. **Re-entrant** — CLASSIFY and CHECK-EXISTS fire again on goal-refine, new-research, or loop-back
3. **Governed** — P-META-034 (Reality-Tested Completion) governs the exit gate; P-META-035 (Iteration & Reuse) governs the loop; P-META-036 (No-Orphans) governs every artifact created through the loop

**The trunk defines the inter-stage DATA CONTRACT.** Specifically:

| From stage | Named field emitted | Consumed by stage |
|---|---|---|
| Stage 3 (INTENT-CRYSTALLIZE) | `crystallized_intent` | Stage 6 (COMPLETION-TEST Part B) |

See §4 for the full data contract definition (FINDING-S082-01 resolution).

---

## §3 — BRANCHES: Domain Specializations (VARIETY)

A branch is a domain specialization that inherits all trunk stages and adds domain-specific steps.

### Known branches (design-time — not yet built)

| Branch | Spine | Domain steps added | Trunk stages used |
|---|---|---|---|
| Schema-design branch | ARCH | ZModel syntax gate, ZenStack policy check, RLS boundary verification | All 7 |
| Journey branch | GVRN+OPER | User journey test gate, UI acceptance test, trunk → app.page match | All 7 |
| Persona branch | AI | Persona alignment check, AI behavior test, D1-D13 default audit | All 7 |
| Feature branch | ARCH+OPER | App-level feature test, regression gate, perf budget check | All 7 |

**Persona branch is the SCHEDULED FIRST BRANCH** — inherits this trunk-branch-reload model. See SCHEDULED-CLUSTER-S082-PERSONA-SPINE-DNA-ORCH in opus-turn.md. Domain steps TBD in that cluster.

### INHERIT-ONLY Rule

A branch:
- ✅ **MAY** add domain-specific steps between existing trunk stages
- ✅ **MAY** add domain-specific completion criteria within Stage 6
- ✅ **MAY** add domain-specific artifacts to Stage 3's `crystallized_intent` output
- ❌ **MAY NOT** override a trunk stage's purpose or governing principle
- ❌ **MAY NOT** skip a trunk stage (especially CLASSIFY, CHECK-EXISTS, INTENT-CRYSTALLIZE, COMPLETION-TEST)
- ❌ **MAY NOT** change the trunk's named data contract fields

**Enforceability at design time (PHASEB builds the mechanical enforcement):**
A branch document that doesn't declare its parent trunk + which trunk stages it extends is an orphan (P-META-036 catches). Every branch doc must have frontmatter:
```yaml
parent_trunk: planning-spine/PLANNING-SPINE.md
inherits_stages: [1, 2, 3, 4, 5, 6, 7]  # all 7 — required
adds_steps:
  - after_stage: 3
    step_id: "schema-validation-gate"
    domain: ARCH
```

---

## §4 — FINDING-S082-01: Named Inter-Stage Data Contract

**The finding (Opus-accepted, S082):** Stage 3 (INTENT-CRYSTALLIZE) and Stage 6 (COMPLETION-TEST Part B INTENT-CONFORMANCE) share a named dependency. Without a machine-readable field definition, Stage 6's Part B is conceptual — it says "evaluate against the crystallized intent" but relies on the AI having loaded Stage 3's context, not a specific field.

**The resolution:** `crystallized_intent` is the named contract field.

### Stage 3 EMITS → `crystallized_intent`

Stage 3 (INTENT-CRYSTALLIZE) produces this field as part of its output artifact. It must be:

```yaml
# In the Stage-3 output artifact's frontmatter or body:
crystallized_intent: >
  [single statement that passes 3 tests:]
  (1) A builder evaluates any artifact against it without ambiguity
  (2) Uses human's exact intent words (not AI paraphrase — I1 from threshold-intake-protocol §7)
  (3) Narrow enough to detect when output diverges from intent
```

**Three tests for a valid `crystallized_intent`:**
1. **Evaluability:** Can a builder look at an artifact and answer YES/NO: "does this satisfy the intent"?
2. **Human-authority:** The outcome statement uses the human's exact words, not AI synthesis (aligns with threshold-intake-protocol §7 Category I)
3. **Divergence-detectability:** Narrow enough that output-X and output-Y can be evaluated as different against it

### Stage 6 CONSUMES ← `crystallized_intent`

Stage 6 Part B (INTENT-CONFORMANCE) reads the `crystallized_intent` field:

```yaml
# Stage 6 Part B check:
conformance_check:
  reads: crystallized_intent  # from the Stage-3 output artifact
  question: "Does the output trace to this intent — checkable on paper, before execution?"
  pass_if: "output achieves the stated intent OR emits impact-obligation with named signal + revisit condition"
  fail_if: "output diverged from crystallized_intent without declared rationale"
  loop_back_trigger: "conformance-fail → return to CLASSIFY (Stage 1)"
```

**Why this closes FINDING-S082-01:**
Before: Stage 6 Part B said "evaluate against the Stage-3 crystallized intent" — conceptual. The AI needed to have Stage-3's context loaded to know what to check.
After: Stage 6 Part B reads `crystallized_intent:` — mechanical. The field is present in the Stage-3 output artifact, readable without loading the full Stage-3 context. This is the Tier-2 entity-card pattern applied to inter-stage contracts.

---

## §5 — Branch-Activation Reload: The Domain-2/3 Cure

The two weak inheritance domains (INHERITANCE-MODEL.md) share a root cause: when execution crosses a boundary (planning→implementing, implementing→auditing), the governing context from earlier stages gets compressed out of the AI's active context.

**Branch-activation reload is the structural fix:**

When a domain branch activates (i.e., when execution moves from planning into a domain-specific implementation or audit), the branch emits a **trunk reload** — a compact bundle of the trunk's governing constraints re-injected into context.

### Reload Bundle Schema (design spec)

```yaml
branch_activation_reload:
  branch_id: "[schema|journey|persona|feature]-branch"
  activated_at_stage: "[Stage N where branch was activated]"
  activated_session: S[NNN]
  trunk_constraints:
    crystallized_intent: "[from Stage-3 output artifact — exact field value]"
    scope_lock: "[from Opus PROTO DO NOW section — verbatim]"
    no_orphans_home:
      core_spine: "[declared spine]"
      schema_anchor: "[declared anchor]"
      canonical_path: "[declared home path]"
    completion_criteria: "[from Stage-6 COMPLETION-TEST definition]"
  never_drop: true
```

### How It Cures Domain 2 (Planning → Implementing)

**Without reload:** Sonnet begins building from the last few turns of context. The planning constraint from Opus's PROTO turn 4 is compressed by turn 20. The implementation is technically correct but misses the governance constraint.

**With reload:** When Sonnet activates the domain branch to begin building, the branch activation emits the trunk-reload bundle. Sonnet reads:
- `crystallized_intent` — what the plan was supposed to achieve
- `scope_lock` — what was explicitly in/out of scope
- `no_orphans_home` — where the artifacts live

The planning constraint is re-surfaced at the build/audit boundary, not recovered from memory.

### How It Cures Domain 3 (Implementing → Auditing)

**Without reload:** The audit (OPIA / closing-summary §10.0) evaluates against the implementation's own claims. The original planning decision may be 3-5 sessions back in HANDOFF archive.

**With reload:** The audit begins by loading the branch-activation-reload from the implementing session. The audit now has:
- `crystallized_intent` — the original intent to evaluate against
- `completion_criteria` — the Stage-6 definition from the planning loop

The audit back-references the planning origin, not just the commit.

---

## §6 — Classification: GVRN Artifact, NOT 6th Spine

**The risk:** As the Planning Spine grows (trunk + branches + reload model), it could be mistaken for a new knowledge domain deserving its own L1 spine classification.

**The ruling:** It is NOT a 6th spine. Here is why:

| L1 Spine | What it governs | Nature |
|---|---|---|
| GVRN | Decision rights, governance process, accountability | Knowledge domain |
| ARCH | Data structures, API contracts, schema design | Knowledge domain |
| AI | AI behavior defaults, inner-defaults, calibration | Knowledge domain |
| OPER | Operations, deployment, cadence, reality-grounding | Knowledge domain |
| VALD | Evidence, validation, coverage, zero-findings | Knowledge domain |
| ~~Planning Spine~~ | ~~How to plan~~ | ~~Process method~~ |

The Planning Spine is a **process method** — it governs HOW to plan, not WHAT domain is being planned. It belongs under GVRN because governance is the domain that owns process methods. **Precedent:** Simulation is a method (not a knowledge domain) → entry under VALD spine.

The Planning Spine:
- `core_spine: GVRN` ✅
- `schema_anchor: pillar_0_governance_leaves` ✅
- Does NOT declare a new spine ID ✅
- IS the parent that branches reference for their `parent_trunk` ✅

---

## §7 — Persona Cluster Inheritance (No-Orphans)

The SCHEDULED-CLUSTER persona-core-spine cluster (scheduled in opus-turn.md for post-concept-bar) inherits this trunk-branch-reload model:

- Trunk = the 7-stage loop (PLANNING-SPINE.md) = mandatory
- Persona branch = domain specialization that INHERITS the trunk + ADDS persona-specific steps
- Branch-activation reload = re-surfaces persona governance constraints at build/audit boundary
- `crystallized_intent` field = named by BOTH the trunk and persona branch outputs

**No-Orphans declaration for persona cluster branch:**
```yaml
parent_trunk: planning-spine/PLANNING-SPINE.md
inherits_stages: [1, 2, 3, 4, 5, 6, 7]
adds_steps:
  - after_stage: 3
    step_id: "persona-alignment-gate"
    domain: AI
  - after_stage: 5  
    step_id: "ai-behavior-test"
    domain: AI
```

---

*RATIFIED v0.1 — S082. FINDING-S082-01 resolved. Ratified with cluster Item 7, 2026-06-11. No enforcement code (PHASEB gated).*
