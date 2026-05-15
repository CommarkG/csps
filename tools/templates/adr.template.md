---
id: csps.tools.templates.adr
name: adr-template
template_grade: A  # Opus Turn 15 S026 — governs all architecture decisions; constitutional
template_status: standard
session: S006
scope_level: S1
---

# ADR-[NNN]: [Title]

**Date:** [YYYY-MM-DD]
**Status:** PROPOSED | ACCEPTED | DEPRECATED | SUPERSEDED
**Deciders:** Governor + [relevant roles]
**Session:** S[NNN]

---

## Context

[What is the issue or question motivating this decision?
What is the current state that creates a need for change?]

---

## Decision

[What is the change being made?
State it clearly and directly.]

---

## Interface (if applicable)

```typescript
// Exact TypeScript interface / schema / protocol being sealed at L1
// Once ACCEPTED: this interface cannot change without a new ADR
```

---

## Consequences

**Positive:**
- [What this enables]

**Negative / Constraints:**
- [What this constrains or prevents]

**Mitigation:**
- [How constraints are managed]

---

## Alternatives Considered

| Option | Why not chosen |
|---|---|
| [Option A] | [Reason] |
| [Option B] | [Reason] |

---

## Enforcement

[How this decision is mechanically enforced:]
- Validator: [which validator prevents violations]
- Hook: [which hook enforces at build time]
- Contract: [which B_* behavioral contract backs this]

---

## Review Trigger

This ADR should be revisited when:
- [Specific condition, e.g., "More than 3 apps use the L1 interface"]
- [Specific condition, e.g., "JavaScript Temporal API standardizes"]

---

*ADR template v1.0 | Created by CSPS | Session 0 | 2026-05-11*
