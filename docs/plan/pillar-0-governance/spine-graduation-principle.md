---
id: csps.pillar-0-governance.spine-graduation-principle
name: spine-graduation-principle
description: >
  The formal testable statement of the L1→L5 graduation model for CSPS Core Spines.
  Defines what it means for a governance element to be at the correct layer, what
  constitutes a layer violation, and how to test whether a new artifact belongs at L1,
  L2, or L3. Governs the universality hierarchy across GVRN/ARCH/AI/OPER/VALD.
  Ratified: Opus Turn 16 B.6 Q4 — "Graduation principle → L1 GVRN CORE (undebatable)."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
template_grade: B
impl_status: swift-implemented
diataxis_type: explanation
session: S027
tags:
  - domain:governance
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: parent, href: ./README.md }
  - { rel: l1-gvrn, href: ../../../.claude/core-spines/L1_CORE_GVRN.md }
  - { rel: l1-arch, href: ../../../.claude/core-spines/L1_CORE_ARCH.md }
  - { rel: corespine-depth-validator, href: ../../../tools/validators/validate-corespine-depth-markers.mjs }
  - { rel: spine-hierarchy-validator, href: ../../../tools/validators/validate-spine-hierarchy.mjs }
  - { rel: core-manifest, href: ./csps-core-manifest.md }
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
---

# Spine Graduation Principle

> **This is a formal governance rule, not documentation.**
> It states what is true, what constitutes a violation, and how to test both.
> Ratified at L1 GVRN CORE — undebatable without ADR + ratification.

---

## §1 — The Principle (formal statement)

The CSPS Core Spine model operates on **layered universality**:

```
L1: UNIVERSAL — applies to everything, no exception, no context restriction
L2: UNIVERSAL WITHIN ITS DOMAIN — applies to all L3 instances in that domain
L3: SPECIFIC INSTANCES — applies to this artifact, cannot contradict L1 or L2
```

**Moving outward = increasing specificity, decreasing universality.**
**Moving inward = broader claim, heavier ratification requirement.**

Each layer is **universal toward the layer directly beneath it**: L1 governs L2; L2 governs L3. Nothing at L3 can contradict its governing L1 or L2 without the ratification burden of an amendment to that layer.

This principle applies to all 5 spines: GVRN, ARCH, AI, OPER, VALD.

---

## §2 — Layer Tests (how to determine correct layer placement)

### A new governance element belongs at **L1** if ALL are true:
1. It applies without exception across all platform contexts, all apps, all sessions
2. Changing it would require re-grounding the entire platform's approach in that spine
3. It has implementation evidence (per RP-005 / ADR-0026) — a running enforcer exists
4. It requires CC-equivalent ratification (ADR + Governor) to amend

*If any is false: it does NOT belong at L1. Consider L2 ASPIRATIONAL.*

### A new governance element belongs at **L2** if ALL are true:
1. It applies within a specific domain of a spine (not universally)
2. It governs all L3 instances in its domain but not outside it
3. It extends the L1 principle operationally without claiming L1-level universality
4. Amendment requires PCR + Governor (normal review, not ADR)

*L2 is the domain layer — operational without being constitutional.*

### A new governance element belongs at **L3** if ALL are true:
1. It is a specific instance, artifact, or implementation — not a rule about rules
2. It applies to this specific thing (a validator, a principle, a contract)
3. It is consistent with its governing L1 and L2
4. No formal amendment required — per-session edit is sufficient

*L3 is the instance layer — what exists, not what governs.*

---

## §3 — Violation Tests (what constitutes a layer violation)

**Type A — L3 contradicts L1:**
> "This validator fires except when X" — where X conflicts with an L1 CORE principle.
> The exception cannot exist if the L1 principle is genuinely universal.
> Fix: either the validator is wrong, or the L1 principle needs amendment.

**Type B — L2 claims L1-level universality:**
> An L2 domain document declares something "universal and undebatable" without
> going through L1 sealing protocol (ADR + ratification + implementation evidence).
> Fix: demote to L2 ASPIRATIONAL, or elevate through proper L1 sealing (ADR-0026 gate).

**Type C — L3 instance claims domain-wide applicability:**
> An L3 file (specific artifact) says it governs "all artifacts of type X."
> If true, it belongs at L2 (domain layer). If false, the claim is wrong.
> Fix: promote to L2 or remove the universal claim.

**Type D — Declaration without implementation at L1:**
> Per ADR-0026 (RP-005), an L1 principle declared without a running validator
> or operational artifact proving it is aspirational — not sealed.
> Fix: either build the implementation, or demote to L2 ASPIRATIONAL.

---

## §4 — The Layer Ratification Requirements

| Layer | Amendment | Ratification | Required evidence |
|---|---|---|---|
| L1 | ADR + Governor | Full: research_ref + Opus L1 + Governor attestation | implementation_evidence: + validator_active: (per ADR-0026) |
| L2 | PCR + Governor | Targeted: PCR + Governor confirm + ZF Level 2 | Demonstrated L3 use cases (Pattern 1: min 3 real instances) |
| L3 | Per-session edit | None (within L2 domain) | Consistent with L1 + L2 |

---

## §5 — Current Layer Counts

At S027 close:
- L1 files: 5 (one per spine, sealed)
- L2 domain files: 17 (16 original + L2_DOMAIN_ARCH_SCHEMA_GOVERNANCE added S027)
- L3 instance files: 5 (one per spine, populated by instance-registry-populator.mjs)
- L4/L5: defined in csps-core-manifest.md but not yet formalized as files (per-app and per-customer-tier layers)

---

## §6 — Enforcement

**Active validator:** `validate-corespine-depth-markers.mjs` — checks that L1/L2/L3 files all exist, have correct frontmatter structure, and no L1 file has been expanded with examples or cross-references (do_not_expand: list enforcement).

**Planned validator:** `validate-spine-hierarchy.mjs` (PE=67, S028 mandate) — checks L3 instances don't contradict L1 definitions. Specific check: any L3 entry whose content logically conflicts with its parent L1's sealed prose triggers ADVISORY → escalate to Opus for classification.

**Human gate:** When a new governance artifact is authored and its layer placement is uncertain, consult Pattern 6 (Virtual Opus Audit): "Does this touch L1? If yes: stop, Opus required, no exceptions."
