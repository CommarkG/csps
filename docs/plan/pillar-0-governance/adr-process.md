---
id: csps.governance.adr-process
name: adr-process
description: Architecture Decision Records process. MADR template (Markdown Any Decision Records) + the seed ADRs that lock the v1.x architectural choices.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:doc
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - observability
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ./reuse-first-principle.md }
  - { rel: rule-registry, href: ./rule-registry.md }
domain_path: platform
---

# Architecture Decision Records (ADR) Process

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The standard for capturing architectural decisions in CSPS. Every irreversible (or expensive-to-reverse) decision becomes an ADR. ADRs are the **why**; leaf documents in the plan are the **current state**; rules in the registry are the **enforced consequences**.

## Why ADRs

Without ADRs, the reasoning behind decisions evaporates. Six months later, you (or future-you, or a new contractor, or an AI assistant) sees code you wouldn't have written and either rewrites it (losing the original constraint) or leaves it confused (paying tax on every related decision).

Michael Nygard's 2011 ADR pattern is the canonical reference; Martin Fowler popularized it via [martinfowler.com/bliki/ArchitectureDecisionRecord.html](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html); ThoughtWorks moved ADRs to "Adopt" on the Tech Radar in 2018; AWS Well-Architected, Microsoft Azure, and Google Cloud all now recommend them.

## When to write an ADR

Write an ADR for:
- Any locked architectural decision (tech-stack pick, schema-pattern choice, naming convention)
- Any decision that closes off a future option (chose Postgres → can't easily switch to DynamoDB later)
- Any decision that surprised you to make (resolves an ambiguity)
- Any decision the user and AI agreed on in chat (the chat → law workflow per [rule-registry.md](./rule-registry.md))
- Any deprecation of a previous decision (supersedes record)

Do NOT write an ADR for:
- Implementation details (where comments suffice)
- Things still being explored (write as `status: proposed` only when you're close to deciding)
- Reversals of trivial preferences (style, formatting)

## Format — MADR (Markdown Any Decision Records)

`docs/adr/NNNN-kebab-title.md`. NNNN is sequential, starting at 0001, no gaps. The `validate-adr-numbering.mjs` validator enforces this.

```markdown
---
id: ADR-NNNN
title: <Short noun phrase — what was decided>
status: proposed | accepted | superseded | deprecated
date: 2026-05-01
deciders: [finky]
tags: [domain, tech, schema, ...]
supersedes: ADR-NNNN | null
superseded_by: ADR-NNNN | null
---

# ADR-NNNN: <Short noun phrase>

## Context and problem statement

<What's the situation? What's the question we're answering? Why now?>

## Decision drivers

<Forces that influence the decision: cost, time, dependencies, constraints, risks.>

## Considered options

1. **<Option A>** — brief description
2. **<Option B>** — brief description
3. **<Option C>** — brief description

## Existing thing considered

<Per the reuse-first principle: what existing artifact / pattern / decision did we look at first? Why was enhancement insufficient (if creating new) OR which existing thing is being enhanced?>

## Decision outcome

**Chosen option:** <name + one-line summary>

**Justification:** <why this option won; trade-offs accepted.>

## Consequences

- **Positive:** <what becomes easier>
- **Negative:** <what becomes harder; debt accepted>
- **Neutral:** <other effects worth recording>

## Enforcement (links to rule registry)

This decision is enforced by:
- RULE-NNNN — <rule statement> ([link](../rules/RULE-NNNN.yaml))
- RULE-NNNN — <rule statement> ([link](../rules/RULE-NNNN.yaml))

## Open questions

<What this ADR didn't resolve; signals for future ADRs.>

## Sources / references

- <link>
- <link>
```

## Status lifecycle

```
proposed → accepted → (superseded | deprecated)
```

- **proposed** — under discussion; should not be referenced as ratified yet
- **accepted** — locked; the canonical state
- **superseded** — replaced by a newer ADR (must reference `superseded_by`)
- **deprecated** — no longer valid but kept for historical context (no replacement)

The audit runner has a check `adr-no-stale-proposed` (warn if `proposed` > 14 days).

## Reuse-first applied to ADRs

Before writing ADR-NNNN, search the existing ADR archive:
```bash
grep -ri "<your topic keywords>" docs/adr/
```

If a near-match exists, **enhance the ratified ADR** by:
- Appending to its "Open questions" section if you're answering an open question (no new ADR needed; the original gains a new section with date + answer)
- Writing a `superseding` ADR if the original decision was wrong (`status: superseded`, `supersedes: ADR-OLD`, link both directions)

If creating a fresh ADR (no existing match), the **Existing thing considered** section must explain why no existing ADR sufficed.

## Seed ADRs (to be created during migration)

The v1.3 master plan locked many decisions implicitly. As content migrates from v1.3 to leaf docs, the major decisions become explicit ADRs:

| ADR | Title | Status | Locks |
|---|---|---|---|
| ADR-0001 | pick-csps-stack-nx-nextjs-postgres | accepted | The full tech stack from v1.3 §2 |
| ADR-0002 | adopt-schema-per-app-multi-tenancy | accepted | The schema-per-app pattern from v1.3 §6.5 |
| ADR-0003 | locked-tier-vocabulary-free-pro-business-enterprise | accepted | Tier names from v1.3 §0 |
| ADR-0004 | template-only-page-creation-enforcement | accepted | The 22-template catalog + 4-layer enforcement from v1.3 §11.5 |
| ADR-0005 | sandboxed-skill-governance-three-tier | accepted | Quarantine/Vendored/Platform-owned from v1.3 §11.8 |
| ADR-0006 | crisis-escalation-as-load-bearing-v1 | accepted | The CrisisEvent slice mandatory for v1 from v1.3 §13 |
| ADR-0007 | postgres-trigger-based-audit | accepted | Audit-by-trigger over app-middleware from v1.3 §8 |
| ADR-0008 | one-mastra-agent-many-personas | accepted | Persona-orthogonal-to-agent from v1.3 §12 |
| ADR-0009 | hybrid-persona-memory | accepted | User.preferences + PersonaMemory from v1.3 §12 |
| ADR-0010 | reuse-first-principle-load-bearing | accepted | The principle from this v1.4 round |
| ADR-0011 | pillar-architecture-six-plus-meta | accepted | The 6+1 pillar structure from this v1.4 round |
| ADR-0012 | csps-name-and-coresights-umbrella | accepted | The naming decision from earlier in conversation |
| ADR-0013 | rename-cool-names-to-industry-standard | accepted | The 8 vocab renames from this v1.4 round |
| ADR-0014 | adopt-madr-for-adr-format | accepted | This document's format choice |
| ADR-0015 | rule-registry-as-fitness-function-binder | accepted | The rule registry from [rule-registry.md](./rule-registry.md) |

These are written progressively as the v1.3 migration proceeds.

## ADR ↔ rule registry binding

Every accepted ADR with enforceable consequences gets at least one rule in `docs/rules/RULE-NNNN.yaml` (per [rule-registry.md](./rule-registry.md)). The ADR's "Enforcement" section lists the rule IDs; the rule's `adr` field references back. The audit checks both directions.

ADRs without enforceable consequences (e.g., "we considered options A and B and picked A") may have no rule — but the audit warns if ≥80% of accepted ADRs have no rule (signals decisions are being recorded but not enforced).

## Tooling

- **Log4brains** ([thomvaill/log4brains](https://github.com/thomvaill/log4brains)) — static-site generator that publishes the ADR tree as a browsable knowledge base; integrate at month 2.
- **Custom validator** `validate-adr-numbering.mjs` — sequential numbering, no gaps.
- **Mastra agent tool** `proposeAdr({ title, decision, options, justification })` — automates the chat → ADR workflow.

## Open questions

- **Granularity.** When does a small decision deserve an ADR vs. a code comment? Heuristic: if reversal would require touching ≥3 files OR an existing ADR, write an ADR.
- **Lifespan.** ADRs are immutable once accepted (only superseded). But the "Open questions" section can be appended to. Is appending an edit? Consensus: yes, appending to "Open questions" is allowed; everything else requires a new ADR.
- **AI vs human authorship.** AI-drafted ADRs require human acceptance before status moves from `proposed` to `accepted`. Add `drafted_by: ai|human` field.

## Sources

- Michael Nygard — [Documenting Architecture Decisions (2011)](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- Martin Fowler — [Architecture Decision Record](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html)
- [adr.github.io](https://adr.github.io/) — the umbrella org
- [MADR template](https://adr.github.io/madr/) — the format used here
- [Log4brains](https://github.com/thomvaill/log4brains) — ADR site generator
- [Microsoft Azure Well-Architected ADR guidance](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record)
