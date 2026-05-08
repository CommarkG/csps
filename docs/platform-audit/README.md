---
id: csps.platform-audit.readme
name: platform-audit-readme
description: >
  Navigation and orientation entry point for the CSPS Platform Audit — the semantic
  layer that explains what CSPS is, why it exists, how its parts relate, and how its
  qualities emerge. Serves three audiences simultaneously: Governor (strategic oversight),
  AI instances (context loading for new sessions), and external AI advisors (full
  platform context for meaningful consultation).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, VALD, OPER]
schema_anchor: platform_audit
enforcement_stage: active
tags:
  - domain:governance
  - domain:platform
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S018
links:
  - { rel: problems, href: ./01-problems.md }
  - { rel: principles, href: ./02-csps-principles.md }
  - { rel: overview, href: ./03-platform-overview.md }
  - { rel: spine-gvrn, href: ./spines/GVRN.md }
  - { rel: spine-arch, href: ./spines/ARCH.md }
  - { rel: spine-ai, href: ./spines/AI.md }
  - { rel: spine-vald, href: ./spines/VALD.md }
  - { rel: spine-oper, href: ./spines/OPER.md }
  - { rel: service-vocabulary, href: ./platform-services/vocabulary.md }
  - { rel: service-ai-behavior, href: ./platform-services/ai-behavior.md }
  - { rel: service-qc-audits, href: ./platform-services/qc-audits.md }
  - { rel: service-priority-engine, href: ./platform-services/priority-engine.md }
  - { rel: service-context-orchestrator, href: ./platform-services/context-orchestrator.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/csps-core-manifest.md
  - docs/plan/pillar-0-governance/csps-bedrock.md
---

# CSPS Platform Audit — Navigation

> **What is this?** The semantic layer of the Core Sights Platform. Not implementation detail — the *why*, *what*, and *how things relate*. Implementation detail lives in `docs/plan/pillar-*/` and links here.
>
> **Who reads this?** Governor (strategic review), AI instances (load before any governance work), external AI advisors (full platform context for consultation), new developers (orientation).
>
> **Time to orient:** 15 minutes for full read. 3 minutes for overview only.

---

## The One-Paragraph Platform Summary

CSPS (Core Sights Platform Services) is a governed multi-tenant SaaS foundry. It is not a product — it is the infrastructure that makes building 30+ SaaS products systematically possible, each inheriting security, billing, auth, schema isolation, and AI governance automatically. The platform is governed by 5 Core Spines (GVRN/ARCH/AI/VALD/OPER), enforced by 41+ validators, orchestrated by a Graduated Resolution Architecture (GRACE), and sequenced by a continuous Priority Engine. Everything declared is mechanically enforced. Everything built is tested. Nothing ships without a ZF (Zero-Findings) gate. **ZF ACHIEVED = THE LAST RUN PRODUCING ZERO BLOCKING FINDINGS. No other definition. (INST-VALD-001)**

---

## Navigation Map

### Start Here
| Artifact | Purpose | Time |
|---|---|---|
| [01-problems.md](./01-problems.md) | What fails on existing platforms — the problems CSPS solves | 5 min |
| [02-csps-principles.md](./02-csps-principles.md) | The principle-based solution approach | 5 min |
| [03-platform-overview.md](./03-platform-overview.md) | Main parts + how qualities emerge from their interaction | 5 min |

### Core Spines (precedence order: GVRN > VALD > ARCH > AI > OPER)
| Spine | Domain | What it governs |
|---|---|---|
| [GVRN](./spines/GVRN.md) | Governance | Decision rights, ZF discipline, behavioral contracts, session protocols |
| [ARCH](./spines/ARCH.md) | Architecture | Schema, multi-tenancy, ZenStack RLS, foundation slices |
| [AI](./spines/AI.md) | AI Behavior | CDAB, context management, GRACE tiers, dual-audience design |
| [VALD](./spines/VALD.md) | Validation | 41+ validators, ZF levels, audit pipelines, evidence discipline |
| [OPER](./spines/OPER.md) | Operations | Build order, graduation, cost management, zero-laptop |

### Platform Services (cross-cutting — serve all 5 spines)
| Service | What it provides |
|---|---|
| [Vocabulary](./platform-services/vocabulary.md) | Canonical language — every term defined before use |
| [AI Behavior](./platform-services/ai-behavior.md) | CDAB 6 layers, inner-defaults calibration, dual-audience |
| [QC & Audits](./platform-services/qc-audits.md) | 41+ audit slugs, 13 pipelines, escalation ladders |
| [Priority Engine](./platform-services/priority-engine.md) | Work sequencing, PE compositions, continuous scoring |
| [Context Orchestrator](./platform-services/context-orchestrator.md) | GRACE 5-tier architecture, monitors, triggers |

---

## How to Use This Audit

**As a Governor:** Read 03-platform-overview.md first. Then navigate to the spine or service relevant to the current decision. Each artifact answers: what's the current state, what's the plan, and what constraints apply.

**As a new AI instance:** Load README (this file) + the overview + the spine relevant to your current task. Do NOT bulk-load all artifacts. Use MCP queries to access specific sub-topics on demand.

**As an external AI advisor:** Read 01-problems.md → 02-csps-principles.md → 03-platform-overview.md in sequence. This gives you full platform context in 15 minutes. Then consult the relevant spine artifact for the specific domain you're advising on.

**As a developer:** Start with the spine of your work domain. Each spine links to its implementation docs in `docs/plan/pillar-*/`.

---

## Key Platform Numbers (S018 baseline)

| Metric | Value |
|---|---|
| Active validators | 41 |
| Behavioral contracts | 50 |
| Behavioral contracts | 50 |
| Core principles | 55 |
| Active hooks | 19 |
| Bedrock completion | 95% (21/22) |
| Apps built | 1 (apps/task-mgmt, ZenStack-active) |
| ZenStack enforcement | Active (@@allow wired in 4 routes) |
| Context window | 1M tokens |
| Platform target | 30 SaaS apps |
