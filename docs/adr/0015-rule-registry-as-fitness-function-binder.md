---
id: csps.adr.0015-rule-registry-as-fitness-function-binder
title: ADR-0015 — Rule registry as the binder between principles and fitness-function enforcers
status: accepted
date: 2026-05-02
deciders: group:finky
tags: [domain:governance, type:explanation, audience:developer, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-0-governance/rule-registry.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0015 — Rule registry binds principles to enforcers

## Context and problem statement

Principles in `principles.yaml` describe WHAT must be true. Enforcers (linters, hooks, CI checks) describe HOW to verify. Without an explicit binder, the principle ↔ enforcer mapping is implicit and drifts.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Implicit mapping via `// @enforces:` comments only | Lightweight | No registry; hard to audit which principles have insufficient enforcers |
| **Explicit rule-registry** (`docs/rules/RULE-NNNN.yaml`) binding principle ↔ enforcer | Auditable; surfaces gaps; PR-trackable | Yet-another-registry |
| Single combined principles + rules file | Fewer files | Conflates "what" with "how"; harder evolution |

## Decision outcome

**Chosen:** explicit rule-registry. Each rule in `docs/rules/RULE-NNNN.yaml` has: principle reference (P-OP-* / P-ARCH-* / P-META-*), severity, enforcers (multi-layer), `enhances:` field for reuse-first.

**Reasoning:** Neal Ford / Rebecca Parsons / Patrick Kua "fitness functions" pattern requires explicit principle ↔ enforcer binding to be auditable. The rule-registry IS the binder.

## Consequences

- Every principle has at least one rule.
- Every rule has at least one enforcer.
- Audit `principle-coverage` (P-META-001) verifies the bidirectional mapping.
- The `audit-of-audit` meta-check verifies rules have current enforcers.

## Enforcement

- `pillar-0/rule-registry.md`
- `principles.yaml#P-META-001` (defense in depth — every principle has enforcers)
- Audit `principle-coverage` + `enforcer-orphans`

## Sources

- Neal Ford / Rebecca Parsons / Patrick Kua — *Building Evolutionary Architectures* (fitness functions)
- [ArchUnitTS](https://github.com/LukasNiessen/ArchUnitTS) (TS fitness functions)
- [Open Policy Agent](https://www.openpolicyagent.org/)
