---
id: csps.adr.0026-rp-005-l1-sealing-requires-implementation-evidence
title: ADR-0026 — RP-005: L1 sealing requires operational evidence, not just ratification
status: accepted
version: 1.0
owner: group:finky
date: 2026-05-12
deciders: group:finky
consulted: Opus (Turn 16 SROF-008)
informed: all-AI-assistants, future-developers
tags:
  - domain:governance
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
diataxis_type: explanation
session: S027
links:
  - { rel: retrograde-principle, href: ../plan/_handoff/VAULT/retrograde-principles-s027.md }
  - { rel: opus-ratification, href: ../plan/_handoff/VAULT/opus-srof-schema-and-spines-review.md }
  - { rel: l1-gvrn, href: ../../.claude/core-spines/L1_CORE_GVRN.md }
  - { rel: core-manifest, href: ../plan/pillar-0-governance/csps-core-manifest.md }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0026 — RP-005: L1 Sealing Requires Operational Evidence

## Context and problem statement

The CSPS platform seals principles at L1 (undebatable CORE, ADR + ratification required
to amend). However, S027 analysis revealed that "ZModel as the schema source of truth"
was sealed in the ARCH CORE L1 while `packages/database/` (the intended canonical location)
never existed as a ZModel package. The principle was aspirational at the time of sealing.

This created a worse problem than having no principle: the sealed status made it appear
authoritative while the implementation gap was invisible. Any Opus or Sonnet turn reading
the ARCH CORE would assume ZModel SSoT was operational — it was not.

Opus Turn 16 SROF-008 confirmed this as the most important of the 7 retrograde principles
(RP-005, PE=80): "We have been sealing aspirational principles."

## Decision

**Before any principle is sealed at L1 CORE, two conditions must both be met:**

1. **`implementation_evidence:`** — the path of an artifact that proves the mechanism exists
   and is operational (e.g., a validator that enforces it, a running script, an active hook)
2. **`validator_active:`** — the name of at least one running validator in `pnpm verify`
   that enforces this principle

**If neither exists at sealing time:**
- The principle may be declared at L2 with status `ASPIRATIONAL → implementation pending`
- It cannot be sealed at L1 until both conditions are met
- The L2 declaration is the correct interim state

**Amendment to `csps-core-manifest.md`:**
Add `§L1-SEALING-GATE` section per Opus Turn 16 specification (to be done in Session B):
```
Before sealing at L1 CORE:
  1. implementation_evidence: [artifact path proving mechanism exists]
  2. validator_active: [validator name in pnpm verify enforcing this principle]
  3. Governor attestation: "This is operational, not aspirational"
Missing any → cannot seal. Declare as L2 "ASPIRATIONAL" instead.
```

**Retroactive reclassification (pending csps-core-manifest.md amendment):**
"ZModel as SSoT" → demote from L1 CORE to L2 ASPIRATIONAL until:
- `libs/policies/base.zmodel` is declared as canonical platform schema foundation (done per E1)
- `validate-schema-anchors.mjs` is built and active in pnpm verify (Session B)

## Consequences

**Good:**
- Prevents "aspirational sealing" — the most structurally damaging governance failure mode
- L1 CORE becomes genuinely undebatable (because it's been proven operational)
- The L2 ASPIRATIONAL state makes implementation debt visible rather than hiding it

**Neutral:**
- Future L1 sealings require more work (build the validator first, then seal)
- Some existing L1 principles may need retroactive review

**Implementation required (Session B):**
- Add §L1-SEALING-GATE to `csps-core-manifest.md`
- Add `implementation_evidence:` and `validator_active:` fields to frontmatter of existing L1 files
- Retroactively demote any aspirational L1 principles to L2

**Ratified by:** Opus Turn 16 SROF-008 (E3) | Governor attestation S027
