---
id: csps.pillar-0-governance.plan-creation-protocol
name: plan-creation-protocol
description: "Canonical protocol for how plans get created in CSPS — single-session tasks / multi-session topic-plans / element-reviews / closing-summaries / handoffs. Defines triggers + types + 6-step creation flow (Step 6 = mandatory know-how consultation added S011) + multi-session-plan specifics + composition with existing disciplines + mechanical enforcement. Required reading for any AI/Governor authoring a new plan."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: novel-pending-pattern-evaluation
core_spine: GVRN
core_spines: [GVRN, OPER, ARCH, VALD]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: how-to
session: S008
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-220"
  l3_lines: "221-end"
  read_protocol: "L1 = 5-step flow + plan types. L2 = multi-session specifics + composition. L3 = mechanical enforcement + references."
links:
  - { rel: parent, href: ./README.md }
  - { rel: context-loss-pains, href: ./context-loss-pains.md }
  - { rel: csps-dna, href: ./csps-platform-dna.md }
  - { rel: gradual-build-template, href: ../../../tools/templates/gradual-build-plan.template.md }
  - { rel: dna-extracts, href: ../_handoff/VAULT/contexts/INDEX.md }
domain_path: platform
---

# Plan Creation Protocol — CSPS

> **Canonical home for "how plans get made in CSPS."** Every AI/Governor authoring a new plan consults this file first. Composes with [csps-platform-dna.md](./csps-platform-dna.md) + [context-loss-pains.md](./context-loss-pains.md) + [gradual-build-plan template](../../../tools/templates/gradual-build-plan.template.md). Per S008 turn 12 user directive — fresh-eyes future-AI lens applied.

## §1 — When plans are created (triggers)

A new plan is authored when ANY of these triggers fires:

| # | Trigger | Plan type |
|---|---|---|
| 1 | User opens new substantive directive (>1 session of work) | Multi-session topic-plan |
| 2 | User opens single-session focused task (≤1 session) | Single-session task plan (inline TodoWrite OR extension to topic-plan) |
| 3 | A new behavioral contract / principle / leaf is being engraved | Element-review (per [P-META-019 structural-prevention](../../../packages/principles/principles.yaml)) |
| 4 | Session boundary reached (close) | Closing-summary + Handoff (per [protocols.md §10/§11](../_handoff/VAULT/protocols.md)) |
| 5 | Reassessment trigger fires (per CSPS-adapted 5 triggers — see [EXT-20260505-001-D](../_handoff/VAULT/contexts/governance/priority-engine/EXT-20260505-001-D-7-reassessment-triggers.md)) | Re-PCR + plan amendment (NOT new plan unless scope-pivot) |

**Counterweight (don't over-create):** if existing topic-plan covers the work, EXTEND it. Per [P-OP-001 reuse-first](../../../packages/principles/principles.yaml) — no parallel structures.

## §2 — Plan types in CSPS

| Type | Where lives | Template | Used for |
|---|---|---|---|
| **Single-session task** | TodoWrite OR inline in chat | (none formal) | Bounded work ≤1 session; 3+ steps |
| **Multi-session topic-plan** | `docs/plan/_handoff/VAULT/topic-plans/<topic-id>.md` | [gradual-build-plan.template.md](../../../tools/templates/gradual-build-plan.template.md) | Cross-session arcs; depth ∈ {3,4,5} per [B_GRADUAL_BUILD_BY_FOUNDATIONS](./behavioral-contracts.md) |
| **Element-review** | `docs/plan/_handoff/VAULT/element-reviews/<element-id>-S<NNN>.md` | (per element-review template) | Per-element gap analysis pre-engraving |
| **Closing-summary** | `docs/plan/_handoff/VAULT/closing-summary-S<NNN>.md` | (per closing-summary-template if exists; else mirror prior session) | Per [protocols.md §10](../_handoff/VAULT/protocols.md) mandatory |
| **Handoff** | `docs/plan/_handoff/HANDOFF-S<NNN>-to-S<NNN+1>.md` | (Zone A/B/C/D structure) | Per [B_MUTUAL_UNDERSTANDING_VALIDATION](./behavioral-contracts.md) cross-session boundary |
| **Chat-jump-prompt** | `docs/plan/_handoff/VAULT/chat-jump-prompt-S<NNN>-to-S<NNN+1>.md` (+ -detailed.md) | (per LEAN protocol per memory entry 43) | Cross-chat handshake; minimal + detailed variants |

## §3 — The 5-step creation flow (every plan)

Every new plan follows these 5 steps in order. Skipping ANY = plan-discipline violation (caught by `plan-creation-coverage` audit; week-4).

### Step 0 — Completion + Foundation gate (CSEP-S015-001/002 — added S015)

BEFORE creating ANY new plan, check three gates:

**Gate A — FOUNDATION_EXIT_GATE:** Is there any active plan whose current phase has mixed-state exit criteria ([x] AND [ ] in the same section)? If yes: new plan PE = lower than resolving those exit criteria. Run `node tools/validators/validate-phase-exit-criteria.mjs` to confirm CLEAN.

**Gate B — Completion bias:** Is there active work >50% complete that creating this plan might displace? Apply B_COMPLETION_OVER_SHINY: the new plan must PE-score higher than the continuation × 1.5 to justify creation now. If not: vault the new plan idea in raw-thoughts-queue, finish existing work first.

**Gate C — Platform generalizability (B_PLATFORM_FIRST_OPTIMIZATION):** Is the solution this plan implements platform-generalizable? If yes — implement at platform level (libs/, tools/, governance/) before implementing locally (apps/). A local fix that could have been a platform fix is a missed compounding opportunity.

**Anti-pattern:** creating a new plan while an existing plan has unchecked exit criteria or is >50% complete.

---

### Step 1 — Precedent check (per [P-OP-001 reuse-first](../../../packages/principles/principles.yaml) + [B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK](./behavioral-contracts.md))

BEFORE authoring:
1. Search existing CSPS for similar plan/topic — does it already exist?
2. Check CSP carry-forwards (memory entries + extraction notes at [INDEX.md](../_handoff/VAULT/contexts/INDEX.md))
3. Check industry research (only after 1+2 exhausted)

**Anti-pattern:** authoring new plan when existing plan should be extended.

### Step 2 — DNA gate (per [csps-platform-dna.md](./csps-platform-dna.md))

Verify the proposed plan touches required DNA elements (14 as of S022):
- vocab + naming + SCHEMA + core_spine + principles + behavioral contracts + depth_levels + PE + LAYER (at minimum)
- **Element 14 — Domain Primitives (NEW S022):** Does this plan propose a new functional capability?
  If YES: compute CCG score using formula in [core-primitives-architecture.md §4.2](../_handoff/VAULT/topic-plans/csps-core-primitives-architecture.md):
  ```
  CCG_SCORE = (PREVALENCE × 0.35) + (COST × 0.35) + (STABILITY × 0.30)
  ≥ 7.0 → register in core-primitives-registry.md as PROPOSED + VLT required
  4.0–6.9 → libs/integrations/ as shared pattern, no CCG gate
  < 4.0 → app layer, no registration needed
  ```
  Include in plan frontmatter: `ccg_assessment: { prevalence, cost, stability, ccg_score, classification }`

If ANY DNA element absent → fail gate; revise plan scope.

### Step 3 — Template selection (per [B_TEMPLATE_FIRST_CREATION](./behavioral-contracts.md))

Per type table in §2, choose template:
- Multi-session arc → [gradual-build-plan.template.md](../../../tools/templates/gradual-build-plan.template.md)
- Element-review → element-review template
- Closing-summary → mirror prior session OR closing-summary-template if exists

**Anti-pattern:** ad-hoc structure when template exists.

### Step 4 — Context-Loss Prevention Checklist (per [context-loss-pains.md](./context-loss-pains.md))

Every plan declares which context-loss pains it addresses (or explicitly N/A with reason). Reference the canonical catalog:

```yaml
context_loss_prevention:
  consulted: docs/plan/pillar-0-governance/context-loss-pains.md (canonical catalog)
  applies_to_this_plan:
    - <pain-id>: <how this plan mitigates>
    - ...
  not_applicable:
    - <pain-id>: <reason>
```

**Mechanical enforcement:** per-plan validator (week-4) audits this section present + non-empty.

### Step 5 — Engraving (per [B_FIVE_SURFACE_ENGRAVING](./behavioral-contracts.md))

For plans that introduce/amend principles/contracts/leaves:
- Apply 5/5 atomic engraving same-batch (schema + validator + hook + memory + contract)
- Per [P-META-007 FSE](../../../packages/principles/principles.yaml)

For plans that DON'T introduce constitutional changes:
- Skip Step 5 explicitly with note ("no engraving — operational plan only")

### Step 6 — Know-How Consultation (per B_KNOW_HOW_DISCIPLINE — MANDATORY)

**Added S011 §24++++ after discovering that plans were declared "done" with gaps because IMPLICIT requirements (audit slug registration, artifact propagation, smoke testing, orphan prevention) were never explicit.**

Every plan MUST include a `## §KH Know-How Consultation` section in the plan body with SPECIFIC mitigations for each item in [know-how/checklists/pre-plan-creation.md](../_handoff/VAULT/know-how/checklists/pre-plan-creation.md).

**Required elements in §KH section:**
1. **Orphan prevention** — how this plan's L1 artifacts will be detected if not built (→ EP-002)
2. **Implicit deliverables list** — audit slugs, slice regenerations, HANDOFF §B4 updates (→ EP-003)
3. **Validator authoring checklist** — each new validator's 3-step (file + verify + slug) (→ EP-003)
4. **Artifact propagation scope** — which HANDOFF/closing-summary sections will be updated at closure (→ EP-001)
5. **Smoke test commands** — concrete `node <file> [args]` for each new .mjs (→ EP-006)
6. **Persistent warning baseline** — run pnpm verify; list any warnings; fix or LEGACY_YELLOW (→ EP-005)

**Skip condition:** single-turn trivial operational plans only (e.g., fixing a typo). Any plan that ships code/validators/governance artifacts MUST have §KH.

**Mechanical enforcement:** `validate-plan-know-how.mjs` (in pnpm verify) — plans authored session ≥ S011 without §KH section or `know_how_consulted: true` = FAIL.

## §4 — Multi-session plan specifics (extends gradual-build-plan template)

When authoring a multi-session plan (Trigger #1 from §1), additionally:

1. **Depth choice:** ∈ {3, 4, 5} per [B_GRADUAL_BUILD_BY_FOUNDATIONS](./behavioral-contracts.md). Free-form N rejected by validator.
2. **Foundation-stability:** L<N+1> work blocked until L<N> ZF passes. Per template §10 attestation.
3. **Reassessment checkpoints:** declared in frontmatter `multi_session_arc: [S<NNN>, ...]` + per-layer ZF gate.
4. **Backtrack triggers register:** mandatory frontmatter field listing what would re-open locked decisions.
5. **Priority Engine inputs:** all 6 inputs per layer (Breadth/Depth/Impact/Blockers_now/PAS/multi_session_cost) per template §6.
6. **Push-back log:** §6 captures rejected shortcuts (finish-fast / arbitrary-N / skip-foundation / etc.).

## §5 — Composition with existing disciplines

This protocol does not stand alone. It composes with:

| Discipline | Composition role |
|---|---|
| [B_TEMPLATE_FIRST_CREATION](./behavioral-contracts.md) (P-META-015) | Step 3 mandatory template gate |
| [B_GRADUAL_BUILD_BY_FOUNDATIONS](./behavioral-contracts.md) (P-META-016) | §4 depth + foundation-stability |
| [B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK](./behavioral-contracts.md) | Step 1 precedent check |
| [B_FIVE_SURFACE_ENGRAVING](./behavioral-contracts.md) (P-META-007) | Step 5 engraving |
| [B_PE_ALIGNMENT_GUARDIAN](./behavioral-contracts.md) (P-META-018) | PE-priority-aligned plan ordering |
| [B_CONSOLIDATION_PASS](./behavioral-contracts.md) (S009 PCR pending; per EXT-003-A) | Plans don't duplicate canonical-home content |
| [B_HANDOFF_PRE_FLIGHT_AUDIT](./behavioral-contracts.md) (P-META-013) | At session-close: handoff plans get 9-check whole-session walk |
| [B_INTAKE_DISCIPLINE](./behavioral-contracts.md) | External-input plans use manual-protocol Step 5 routing |

## §6 — Mechanical enforcement (validators)

Week-4 validator suite includes:

| Validator | What it checks |
|---|---|
| `plan-creation-coverage` | Every new plan has 5-step compliance evidence in frontmatter or §X header |
| `plan-precedent-check-cited` | Step 1 evidence present (existing-plan check + CSP-carry-forward check) |
| `plan-dna-gate-passed` | Step 2 DNA elements declared in frontmatter |
| `plan-template-used` | Step 3 `template_used:` field references registered template |
| `plan-context-loss-section-present` | Step 4 §X section references context-loss-pains.md (catches CSPS-D2-doctrine-completion-feels-like-completion at plan-authoring level) |
| `plan-engraving-fse-compliant` | Step 5 engravings 5/5 atomic per FSE |

**Pre-runtime:** AI manually applies. **Post-runtime (week-4+):** mechanical via audit-runner Pipeline 1 (governance) + audit-hub.md.

## §7 — Anti-patterns

Plans that violate this protocol exhibit one of these patterns:

| Pattern | Detection | Mitigation |
|---|---|---|
| **Inventing parallel structure** | Plan creates new what existing covers | Step 1 precedent check; reuse-first |
| **Ad-hoc no-template** | Plan structure differs from registered template | Step 3 template-first gate |
| **Skipping context-loss section** | No §X "Context-Loss Prevention" reference to canonical catalog | Step 4 + validator |
| **Doctrine-completion** (per CSP file #2 D2) | Authoring plan FEELS like completion; execution stalls | Per-plan execution validator + pre_close pnpm verify |
| **Premature engraving** | Step 5 fires before plan ratified | B_PCR_FOR_DECISIONS + Governor confirmation gate |
| **Foundation-skip** | Multi-session plan jumps L1→L3 without L2 | B_GRADUAL_BUILD ZF gate per layer |

## §8 — References

- [csps-platform-dna.md](./csps-platform-dna.md) — DNA elements canonical home (Step 2 input)
- [context-loss-pains.md](./context-loss-pains.md) — pains catalog (Step 4 input)
- [gradual-build-plan.template.md](../../../tools/templates/gradual-build-plan.template.md) — multi-session template (Step 3 default)
- [INDEX.md](../_handoff/VAULT/contexts/INDEX.md) — extraction notes available for usage
- [protocols.md §10/§11](../_handoff/VAULT/protocols.md) — closing/fresh-chat protocols
- [B_TEMPLATE_FIRST_CREATION + B_GRADUAL_BUILD + B_NO_INVENTION sections](./behavioral-contracts.md)
- [extractions-ledger.md](../_intake/extractions-ledger.md) — full intake history

---

### Step 7 — Intersection Detection (pre-L4 gate — required for multi-session plans) [S016]

Before any L4 (implementation) begins, scan the plan for **intersections**: places where two decisions share a dependency or where one assumption is the prerequisite for another.

**The intersection detection checklist:**

```
For each pair of consequential decisions in §ASSUMPTIONS:
  □ Do they reference the same schema entity?
  □ Does decision A assume a behavior that decision B also modifies?
  □ Does the timing of decision A affect the validity of decision B?
  □ Would changing decision A require re-doing decision B?

For each planned implementation step:
  □ Does this step assume output from a previous step that isn't confirmed yet?
  □ Does this step affect a shared resource (schema, auth, billing) used by other steps?
```

**Intersections found = STOP. Each intersection requires:**
1. Named in the plan as an explicit intersection card
2. Discussed with Governor until consensus reached
3. Consensus written into the plan (Context | Chosen | Reasoning — per §ASSUMPTIONS format)
4. Only then can L4 implementation begin

**Anti-pattern:** proceeding to L4 with unresolved intersections. They surface as production bugs or architecture rewrites.

---

**Plan creation protocol signature:** `S016-AI-plan-creation-protocol-v1.1-2026-05-07`
