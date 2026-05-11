---
id: csps.docs.index
name: docs-index
description: CSPS Documentation Hub — the entry point for all platform documentation. Tiered by reading priority. Every canonical file is linked here. Use this to extract specific portions or navigate the full documentation system.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: platform_governance
domain_path: platform
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S022
impl_status: swift-implemented
ai_defaults_influence: none
links:
  - { rel: bedrock, href: plan/pillar-0-governance/csps-bedrock.md }
  - { rel: dna, href: plan/pillar-0-governance/csps-platform-dna.md }
  - { rel: governance-cycle, href: plan/_handoff/VAULT/topic-plans/csps-platform-governance-cycle.md }
---

# CSPS Documentation Hub

> **Entry point for all CSPS documentation.** Tier 1 = always read at session open.
> Tier 2 = read for specific activities. Tier 3-5 = read when relevant.

---

## TIER 1 — Platform Foundation (read at every session open)

| File | What it covers | When to read |
|---|---|---|
| [csps-platform-dna.md](plan/pillar-0-governance/csps-platform-dna.md) | 14 DNA elements — the platform's structural identity | Every plan creation |
| [csps-bedrock.md](plan/pillar-0-governance/csps-bedrock.md) | 22 bedrock items — what every app inherits | When building new apps |
| [pe-situation-registry.md](plan/pillar-0-governance/pe-situation-registry.md) | Active PE situation (APP_BUILD_MODE) | Session open |
| [behavioral-contracts.md](plan/pillar-0-governance/behavioral-contracts.md) | 52 B_* contracts — how the AI behaves | Before any implementation |

---

## TIER 2 — Process Protocols (read for specific activities)

| File | What it covers | When to read |
|---|---|---|
| [plan-creation-protocol.md](plan/pillar-0-governance/plan-creation-protocol.md) | 5-step plan creation including DNA gate | Before writing any plan |
| [protocols.md](plan/_handoff/VAULT/protocols.md) | Session open/close protocols §10-§17 | Before closing a session |
| [csps-platform-governance-cycle.md](plan/_handoff/VAULT/topic-plans/csps-platform-governance-cycle.md) | Complete governance cycle + ZF map + pipelines | Strategic planning |
| [csps-continuous-intelligence-architecture.md](plan/_handoff/VAULT/topic-plans/csps-continuous-intelligence-architecture.md) | 3 consolidated processes (PIL/PWP/EIA) | Monitoring + architecture |
| [csps-core-primitives-architecture.md](plan/_handoff/VAULT/topic-plans/csps-core-primitives-architecture.md) | DNA Element 14 + CCG + Calendar design | Before building shared capabilities |

---

## TIER 3 — Domain Reference

| File | What it covers | When to read |
|---|---|---|
| [domain-taxonomy.md](plan/pillar-0-governance/domain-taxonomy.md) | 3-tier domain taxonomy (business/personal/social/knowledge) | When assigning domain_path |
| [frontmatter-closed-enums.md](plan/pillar-0-governance/frontmatter-closed-enums.md) | All closed enum values | Before writing frontmatter |
| [core-primitives-registry.md](plan/pillar-0-governance/core-primitives-registry.md) | Platform primitives (CP-001, CP-002, ...) | Before adding new shared capabilities |
| [priority-engine.schema.yaml](../tools/templates/priority-engine.schema.yaml) | PE formula + bands + firing modes | When scoring work items |

---

## TIER 4 — Active Plans + Extractions

| File | Status | What it covers |
|---|---|---|
| [platform-excellence-completion-S023.md](plan/_handoff/VAULT/topic-plans/platform-excellence-completion-S023.md) | ACTIVE (Session 0→D) | Close all gaps, process hardening |
| [enterprise-core-completion-plan.md](plan/_handoff/VAULT/topic-plans/enterprise-core-completion-plan.md) | RATIFIED/COMPLETE | Sessions 3-6 done |
| [platform-flow-audit-S022.md](plan/_handoff/VAULT/platform-flow-audit-S022.md) | FINDINGS | 12 gaps + solutions |
| [over-the-system-audit-S022.md](plan/_handoff/VAULT/over-the-system-audit-S022.md) | REFERENCE | 49 planned-week-4 items classified |
| [session-S022-extraction.md](plan/_handoff/VAULT/session-S022-extraction.md) | COMPLETE | S022 wisdom (8 insights, 5 CEC cycles) |

---

## TIER 5 — Know-How (read before implementing)

| Directory/File | What it covers |
|---|---|
| [know-how/INDEX.md](plan/_handoff/VAULT/know-how/) | Error patterns, solution patterns, anti-patterns |
| [inner-ai-defaults/](plan/_handoff/VAULT/inner-ai-defaults/) | AI behavior registry — overrides + keep dispositions |
| [inner-ai-defaults/continuous-drift-log.md](plan/_handoff/VAULT/inner-ai-defaults/continuous-drift-log.md) | Running log of AI behavioral observations |

---

## DOCUMENTATION TEMPLATE SYSTEM

All governed documentation follows templates. Quick reference:

| Artifact Type | Template |
|---|---|
| Multi-session plan | tools/templates/gradual-build-plan.template.md |
| Session extraction | tools/templates/session-extraction.template.md (TO BUILD Session A) |
| Closing summary | docs/plan/_handoff/VAULT/closing-summary-template.md |
| ADR | tools/templates/docs/architecture/adr.template.md (TO BUILD Session C) |
| Behavioral contract | tools/templates/docs/governance/behavioral-contract.template.md (TO BUILD Session C) |

---

## HOW TO EXTRACT DOCUMENTATION

**Get all governance docs:**
```bash
ls docs/plan/pillar-0-governance/*.md
```

**Get session wisdom:**
```bash
ls docs/plan/_handoff/VAULT/session-S*.md
```

**Get active plans:**
```bash
grep -l "lifecycle_state: active" docs/plan/_handoff/VAULT/topic-plans/*.md
```

**Get all plans with PE scores:**
```bash
grep -l "priority_score:" docs/plan/_handoff/VAULT/topic-plans/*.md
```

**Full documentation export (all governed files):**
```bash
find docs/ -name "*.md" | xargs grep -l "^id:" | sort
```

---

*CSPS Documentation Hub v1.0 | S022 | 2026-05-11*
*59 validators | Bedrock 22/22 | APP_BUILD_MODE active*
