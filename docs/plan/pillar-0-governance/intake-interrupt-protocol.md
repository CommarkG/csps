---
id: csps.governance.intake-interrupt-protocol
name: intake-interrupt-protocol
description: >
  The CSPS Intake Interrupt Protocol — defines how new ideas are routed when active
  implementation is in progress. Three cases with PE-based thresholds (×1.5 vault/plan,
  ×2.0 interrupt, L1 = always stop). Ratified by Opus Turn 9 S025.
  Prevents both: (1) shiny-object drift (premature pivot) and (2) silent idea burial.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, AI, VALD]
schema_anchor: pillar_0_governance_leaves
impl_status: swift-implemented
domain_path: platform
depth_tier: L2
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:draft
session: S025
intent_crystallized: true
threshold_route: platform.governance
template_grade: B
template_status: standard
links:
  - { rel: pe-schema, href: ../../../tools/templates/priority-engine.schema.yaml }
  - { rel: b-completion-over-shiny, href: ./behavioral-contracts.md#B_COMPLETION_OVER_SHINY }
  - { rel: b-pe-alignment-guardian, href: ./behavioral-contracts.md#B_PE_ALIGNMENT_GUARDIAN }
  - { rel: raw-thoughts-queue, href: ../_intake/raw-thoughts-queue.md }
  - { rel: session-state, href: ../../../tools/session-state.json }
  - { rel: master-plan, href: ../_handoff/VAULT/csps-master-plan-s025-plus.md }
diataxis_type: how-to
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Intake Interrupt Protocol

> **Ratified by Opus Turn 9 S025.**
> When a new idea arrives during active implementation, route it through this protocol.
> Prevents: premature pivot (shiny object drift) AND silent idea burial.

---

## §1 — The Three Cases

### Case 1 — VAULT
**Condition:** `PE(new idea) < PE(current active work) × 1.5`

**Action:**
1. Add to `docs/plan/_intake/raw-thoughts-queue.md` with: PE score + trigger condition + brief description
2. Continue current work uninterrupted
3. No VLT raised. No session disruption.

**The idea surfaces when:** PE dashboard shows it crossed the threshold, OR trigger condition is met.

---

### Case 2 — PLAN
**Condition:** `PE(new idea) ≥ PE(current active work) × 1.5`

**Action:**
1. Continue current work until the NEXT closed-circle milestone (phase complete + pnpm verify passes + commit)
2. At that natural pause point: run Threshold intake (9-step) for the new idea
3. Create topic-plan with PE score
4. Add blocking_decisions entry to session-state.json:
```json
{
  "id": "VLT-INTERRUPT-[slug]",
  "state": "open",
  "priority": "P1",
  "description": "New idea arrival during active build — Governor decision needed",
  "arrived_during": "[session + active work item]",
  "idea_PE": [score],
  "current_work_PE": [score]
}
```
5. Governor decides: continue current work, or pivot to new topic-plan

**Do NOT stop mid-implementation.** The pause point is the B_HUMBLE_EXECUTOR MILESTONE checkpoint — a natural closed circle where stopping costs nothing.

---

### Case 3 — INTERRUPT
**Condition:** `PE(new idea) ≥ PE(current active work) × 2.0` AND current implementation < 50% complete

**Action:**
1. Stop immediately after current atomic action completes (not mid-function, not mid-file)
2. Document interrupted state in raw-thoughts-queue.md
3. Run full Threshold intake for the new idea
4. Raise VLT blocking_decisions entry (same format as Case 2)
5. GOVERNOR MUST decide — AI cannot make this call unilaterally

**Why ×2.0 for interrupts (vs ×1.5 for plans):** Re-entry cost is real. Interrupting mid-implementation creates context debt that compounds. The higher threshold protects active work from all but the most critical ideas.

---

### Case 4 — ARCHITECTURAL ALWAYS-STOP
**Condition:** New idea touches L1 sealed elements — REGARDLESS of PE scores

**Action:**
1. Stop immediately after current atomic action
2. Flag as `opus_review_type: architectural` in sonnet-turn.md
3. NEVER implement without Opus L2 consultation + Governor ratification
4. VLT raised immediately

**Examples of L1 touches:** Core Spine changes, foundation schema amendments, sealed principle contradictions, template Grade A creation.

---

## §2 — The Decision Tree

```
New idea arrives during active implementation
         ↓
Is L1 sealed element affected?
  YES → Case 4 (always stop, Opus required)
  NO  ↓
Compare PE(idea) vs PE(current) × multiplier:
  < ×1.5  → Case 1: VAULT (continue uninterrupted)
  ≥ ×1.5  → Case 2: PLAN (pause at next ZF gate)
  ≥ ×2.0 AND <50% complete → Case 3: INTERRUPT (stop after atomic action)
```

---

## §3 — The PE Multipliers (Opus Turn 9 ratified)

| Multiplier | Threshold | Action |
|---|---|---|
| × 1.5 | `PE(idea) ≥ PE(current) × 1.5` | Create topic-plan at next ZF gate (Case 2) |
| × 2.0 | `PE(idea) ≥ PE(current) × 2.0 AND <50% complete` | Interrupt after current atomic action (Case 3) |
| × ∞ | L1 element touched | Always stop regardless of PE (Case 4) |

**Source:** B_COMPLETION_OVER_SHINY (the ×1.5 multiplier already existed for completion bias — this protocol extends it to interrupts).

---

## §4 — Mechanical Enforcement (Current + Planned)

**Currently advisory:** This document defines the protocol. AI applies it by judgment.

**S026 target — `validate-intake-interrupt.mjs`:**
- Checks session-state.json for blocking_decisions entries with `VLT-INTERRUPT-*` IDs
- If any are `open` AND current session is adding new work: warns "interrupt decision pending Governor"
- Requires Governor ratification before building the enforcement validator

**The non-enforcement gap:** Until the validator is built, the protocol depends on:
1. The Governor reminding → AI checking raw-thoughts-queue on new ideas
2. The PE dashboard showing if an idea in queue has crossed the threshold
3. B_PE_ALIGNMENT_GUARDIAN deflecting when a new idea is being pursued without PE comparison

---

## §5 — Integration with Sessions and Plans

**In closing-summary §10.13d (Decisions presented):** Every Case 2/3/4 event must be listed.

**In HANDOFF Zone B (mandate):** Carry-forward any Case 2/3 topic-plans created this session.

**In session-state.json blocking_decisions:** All open VLT-INTERRUPT entries tracked.

**The raw-thoughts-queue is the vault:** Every Case 1 idea goes there. The PE dashboard checks it. When an idea's PE rises (or trigger condition met), it surfaces in next session.

---

*Ratified: Opus Turn 9 S025 | Thresholds: ×1.5 vault/plan, ×2.0 interrupt, L1=always*
*Enforcement: advisory (validate-intake-interrupt.mjs pending Governor ratification)*
