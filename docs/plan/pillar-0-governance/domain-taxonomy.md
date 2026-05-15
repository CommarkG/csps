---
id: csps.pillar-0-governance.domain-taxonomy
name: domain-taxonomy
description: >
  3-tier domain taxonomy for CSPS. Canonical reference for domain_path field values.
  Tier 1 is closed and Governor-ratified (VLT-S022-DOMAIN-PATH). Tier 2 and Tier 3
  are open — proposed by Sonnet, ratified by Governor before use.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
core_spines: [ARCH, GVRN]
schema_anchor: pillar_0_governance_leaves
domain_path: platform
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S022
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: closed-enums, href: ./frontmatter-closed-enums.md }
  - { rel: vlt, href: ../../../tools/session-state.json }
diataxis_type: reference
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# CSPS Domain Taxonomy

> **Canonical reference for `domain_path:` frontmatter field.**
> Tier 1 is Governor-ratified (VLT-S022-DOMAIN-PATH). Tier 2+ are open pending ratification.
> Format: `domain_path: "business"` or `domain_path: "business.operations"` or `domain_path: "business.operations.projects"`

---

## Tier 1 — Closed Enum (Governor-ratified S021-05-09)

| Value | Meaning | Example apps |
|---|---|---|
| `business` | Professional and organizational activities | Task management, CRM, invoicing, project tracking |
| `personal` | Individual life management and growth | Health tracking, journaling, habits, goals |
| `social` | Community, relationships, connection | Community platform, messaging, events |
| `knowledge` | Learning, research, and accumulated wisdom | Note-taking, research, WisdomVault |
| `platform` | CSPS infrastructure and governance (internal use) | Governance docs, validators, CSPS meta-tools |
| `crosscut` | Cross-domain concerns | Accountability, decisions, reflection, reporting |

---

## Tier 2 — Open (propose via Sonnet, ratify via Governor)

### business.*

| Value | Meaning |
|---|---|
| `business.operations` | Day-to-day business ops (tasks, projects, scheduling) |
| `business.finance` | Invoicing, expense tracking, budgeting, payroll |
| `business.sales` | CRM, pipeline, lead management |
| `business.hr` | People, hiring, onboarding, performance |
| `business.marketing` | Campaigns, content, growth |
| `business.support` | Customer support, ticketing, help desk |

### personal.*

| Value | Meaning |
|---|---|
| `personal.health` | Physical and mental health tracking |
| `personal.finance` | Personal budgeting, savings, expenses |
| `personal.goals` | Goal setting and progress tracking |
| `personal.journal` | Journaling, reflection, gratitude |
| `personal.habits` | Habit tracking and behavior change |
| `personal.time` | Time management, calendaring |

### social.*

| Value | Meaning |
|---|---|
| `social.community` | Forum, discussion, community platform |
| `social.events` | Event planning and management |
| `social.family` | Family coordination, shared calendars |

### knowledge.*

| Value | Meaning |
|---|---|
| `knowledge.notes` | Note-taking, second brain |
| `knowledge.research` | Research, references, citations |
| `knowledge.learning` | Courses, skills, education |

### platform.*

| Value | Meaning |
|---|---|
| `platform.governance` | CSPS governance artifacts (validators, contracts, protocols) |
| `platform.schema` | Data models and ZenStack policies |
| `platform.ai` | AI behavior, inner-defaults, agent alignment |
| `platform.infra` | Build, deploy, infrastructure config |

---

## Usage examples

```yaml
# CSPS governance artifact
domain_path: platform.governance

# Task management app
domain_path: business.operations

# Health tracking app
domain_path: personal.health

# Multi-domain (use crosscut)
domain_path: crosscut
```

---

## How Tier 2/3 values are ratified

1. Sonnet proposes a new Tier 2/3 value with a use case
2. Governor ratifies verbally ("I ratify `business.legal`")
3. Sonnet records in this file + updates frontmatter-closed-enums.md
4. pnpm verify confirms 0 errors

Tier 1 changes require a VLT (Value-Level Threshold) — same process as VLT-S022-DOMAIN-PATH.

---

*Domain taxonomy v1.0 | Schema Phase A | S022 | 2026-05-10*
