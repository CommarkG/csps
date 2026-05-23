---
id: csps.adr.0019-validation-pass-includes-limits-line
title: ADR-0019 — Validation passes include explicit "limits + uncertainties" line per perspective
status: accepted
date: 2026-05-02
deciders: group:finky
tags: [domain:governance, type:explanation, audience:developer, audience:ai-agent, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/_handoff/VAULT/validation-pass-S002.md }
  - { rel: source-handoff, href: ../plan/_handoff/HANDOFF-S001-to-S002.md }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0019 — Validation passes include limits + uncertainties

## Context and problem statement

S001 §13 introduced 3-perspective validation passes (user / continuity / quality). S002 §3.2 enhanced this to require honest surfacing of LIMITS and UNCERTAINTIES per perspective — not just confirmations. Validation that produces only positive confirmations is theater.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Free-form validation narrative | Flexible | Default toward positive bias (confirmation bias) |
| Mandatory positive checklist | Easy to fill | No honest surfacing of gaps |
| **Mandatory limits + uncertainties line per perspective** | Surfaces gaps; user-directive "humbly" preserved | Slightly more verbose |

## Decision outcome

**Chosen:** every validation pass (now and future) requires per-perspective:
1. The validation question
2. The honest answer
3. **A "limits + uncertainties" line** stating what could not be verified or where the AI lacks confidence

The user's S001 directive *"humbly validate all you are doing now at least 3 times from different perspectives"* is operationalized — "humbly" = honest about limits.

**Reasoning:** S002 §3.2 surfaced this enhancement: "this user wants honest surfacing of limits, not just confirmations". Future closing-protocol §13 includes this requirement.

## Consequences

- `_handoff/VAULT/validation-pass-S002.md` is the first instance.
- Every future session's validation pass includes per-perspective limits.
- Audit `validation-includes-limits-line` (planned week 4) verifies presence.

## Enforcement

- `protocols.md` §13 closing-checklist requires limits-line per perspective
- `_handoff/VAULT/validation-pass-S<NNN>.md` template includes the section

## Sources

- `_handoff/VAULT/validation-pass-S002.md` (S002 §3.2 origin)
- User S001 directive: "humbly validate"
