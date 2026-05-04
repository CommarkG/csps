---
id: csps.handoff.vault.quick-context-s006-l1
name: quick-context-S006-L1
description: Token-optimal entry-point for understanding CSPS platform state at S006 L1 close. Single file; BLUF-formatted; self-contained; clickable links to canonical sources. Read this in ~3 minutes for full picture. Per user S006 turn 8 directive "the best optimization of token consumption you have and its alignment with the way Csps is built". Aligned with CSPS DNA (Diataxis-typed reference + frontmatter + Core Spines + clickable links + no-narration).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: registry-canonical
template_status: novel-pending-pattern-evaluation
core_spines: [GVRN, ARCH, AI, OPER, VALD]
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: handoff, href: ../HANDOFF-S005-to-S006.md }
  - { rel: active-topic-plan, href: ./topic-plans/s006-governance-foundation.md }
  - { rel: core-manifest, href: ../../pillar-0-governance/csps-core-manifest.md }
  - { rel: master-plan, href: ../../../../MASTER_PLAN.md }
session: S006
generated_at: 2026-05-04T16:30:00Z
---

# CSPS Quick-Context — S006 L1 Close

> **Read this file (~3 min) for full platform picture.** All references clickable. Self-contained.

---

## What CSPS is (BLUF — 30 seconds)

**Core Sights Platform Solutions (CSPS)** is a meta-platform for building 30 multi-tenant SaaS apps from a shared customer-kit + slice-based architecture. AI-native: every artifact passes governance gates (5/5 surface engraving, zero-findings discipline, audit-runner validators). Built solo + AI-pair-programmed via Claude Code; runtime is Vercel + Cloudflare hybrid + Supabase backend.

**Cardinal directive:** *"What is not mechanically enforced is just a temp fix."* (S005 turn 23)

---

## Architecture in 3 layers

### 1. CORE — 5 Core Spines (universal undebatable)

| Spine | Domain | CORE rules |
|---|---|---|
| **GVRN** | Governance | Principles registry / 5/5 FSE / atomic validator registration / ZF cycle / MUV / Governor Prompts / HPFA / 4 CCA Quality Gates |
| **ARCH** | Architecture | Slice contract / ZModel + RLS + tenant_id ubiquity / monorepo + Nx + Hygen / template-first / customer-kit primitives |
| **AI** | AI Systems | Mastra BaseAgent / AAP 9-check / CCA 4 QGs / skill-eval-Worker / persona prompts / CSPS-alignment-over-inner-defaults / PE_ALIGNMENT_GUARDIAN |
| **OPER** | Operations | Build-order weeks 1-12 / Vercel+Cloudflare hybrid / observability / dependency mgmt / Governor Prompts / HPFA / Zero-Laptop-Dependency |
| **VALD** | Validation | ZF discipline / audit-runner / `pnpm verify` orchestrator / RZF + CEC + HPFA / validate-before-assume |

→ Full manifest: [csps-core-manifest.md](../../pillar-0-governance/csps-core-manifest.md)

### 2. PILLARS — 7 domain-organized navigation surfaces

| Pillar | Primary spine | Purpose |
|---|---|---|
| [pillar-0-governance](../../pillar-0-governance/README.md) | GVRN | Principles + contracts + audits + AI behavior |
| [pillar-1-architecture-and-stack](../../pillar-1-architecture-and-stack/README.md) | ARCH | Monorepo + slice patterns |
| [pillar-2-data-and-schema](../../pillar-2-data-and-schema/README.md) | ARCH (data) | ZModel + RLS + audit triggers |
| [pillar-3-platform-services](../../pillar-3-platform-services/README.md) | ARCH (services) | 22-template UI catalog + customer-kit |
| [pillar-4-developer-experience](../../pillar-4-developer-experience/README.md) | OPER | DX tooling + AI behavior instructions |
| [pillar-5-ai-systems](../../pillar-5-ai-systems/README.md) | AI | Agents + skills + personas + evals |
| [pillar-6-operations-and-delivery](../../pillar-6-operations-and-delivery/README.md) | OPER | Build-order + deploy + open-frontiers |

### 3. SCHEMA — single source of truth

- Principle registry: [packages/principles/principles.yaml](../../../../packages/principles/principles.yaml) (47+ principles after S006 L2)
- Audit registry: [audit-runner.md](../../pillar-0-governance/audit-runner.md) (~129+ audits across 9 pipelines)
- Frontmatter schema: [ADR-0023](../../../adr/0023-hybrid-frontmatter-schema-universal-core-plus-per-file-type.md) (universal core + per-file-type extensions)
- Template registry: [template-registry.md](./template-registry.md) (NEW S006 L1)
- Inner-AI-defaults registry: [inner-ai-defaults/](./inner-ai-defaults/) (NEW S006 L1)

---

## Active S006 work — governance foundation topic-plan

**Topic:** [s006-governance-foundation.md](./topic-plans/s006-governance-foundation.md) (depth-5)

**Disciplines being engraved (this topic-plan):**

| # | Discipline | Status | Composition |
|---|---|---|---|
| 1 | P-META-015 / B_TEMPLATE_FIRST_CREATION | L1 ✅ / L2 pending | Template-first for ALL outputs |
| 2 | P-META-016 / B_GRADUAL_BUILD_BY_FOUNDATIONS | L1 ✅ / L2 pending | Depth 3/4/5 + priority engine |
| 3 | P-META-017 / B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS | L1 ✅ / L2 pending | Inner-AI-defaults registry + override |
| 4 | P-META-018 / B_PE_ALIGNMENT_GUARDIAN | L1 ✅ / L2 pending | Anti-sycophancy structured deflection (CONSTITUTIONAL) |
| 5 | P-META-019 / B_STRUCTURAL_PREVENTION_DISCIPLINE | L1 ✅ / L2 pending | NEW S006 turn 8 — skipped enforcement → mandatory enhancement |
| 6 | P-ARCH-028 / B_CORE_SPINE_DISCIPLINE | L1 ✅ / L2 pending | 5 Core Spines + outward layering |
| 7 | P-OPER-001 / B_ZERO_LAPTOP_DEPENDENCY | L1 ✅ / L2 pending | Git canonical + auto-push-at-close + multi-machine + Android |

**L1 artifacts created (S006 turns 7-8):**

- [csps-core-manifest.md](../../pillar-0-governance/csps-core-manifest.md) — 5 Core Spines architectural manifest
- [template-registry.md](./template-registry.md) — Universal Template-First discovery mechanism
- [inner-ai-defaults/](./inner-ai-defaults/) — Inner-AI-defaults registry (README + 5 category files + drift-log)
- [tools/templates/priority-engine.schema.yaml](../../../../tools/templates/priority-engine.schema.yaml) — PE schema with 6 CSP absorptions (PE_ALIGNMENT_GUARDIAN / TRAJECTORY / Bands / QUICK-vs-FULL / BUILD-ORDER / history)
- [tools/templates/gradual-build-plan.template.md](../../../../tools/templates/gradual-build-plan.template.md) — Canonical topic-plan template
- [element-reviews/](./element-reviews/) — Place for deeper review and research on platform elements
- [pe-history.jsonl](./pe-history.jsonl) — Append-only PE fire log
- [closing-summary-template.md §10.0h/i/j](./closing-summary-template.md) — Inner-default leak report + Alignment-citation summary + Enhancement proposals (Q-2 tweak)
- [topic-plans/](./topic-plans/) — Topic-plans directory + 2 instances (governance-foundation + zero-laptop-dependency-setup)

**Sibling topic-plan (opens after governance-foundation L2):**
- [zero-laptop-dependency-setup.md](./topic-plans/zero-laptop-dependency-setup.md) — Hybrid C setup (Git canonical + Codespaces + Android)

---

## State metrics (S006 L1 close)

| Metric | Value | vs S005 close |
|---|---|---|
| P-META principles | 14 (008-014) | unchanged this session |
| ARCH principles | 27 | +0 |
| OPER principles | 0 (P-OPER-001 lands L2) | will be +1 |
| Total principles | 45 | +0 (additions in L2) |
| Core Spines (NEW concept) | 5 (GVRN/ARCH/AI/OPER/VALD) | NEW S006 |
| Pillars | 7 | unchanged |
| ADRs | 24 | unchanged |
| B_* contracts | 18 | will be +5 in L2 |
| AGENTS.md hard NOs | 36+ | will be +12 in L2 |
| Topic-plans | 2 (governance-foundation + zero-laptop-dep) | +2 NEW |
| Template registry entries | ~30 across 5 categories | +30 NEW |
| Inner-AI-defaults entries | 19 across 5 categories | +19 NEW |
| Audit-hub Pipeline 10 (csps-alignment) | NEW (registered atomically per FSE) | NEW |
| Active-mechanical `pnpm verify` cycles | 5 (carry from S005) | unchanged |
| `pnpm verify` exit_code | 0 (verified S005 close) | unchanged at L1 close |

---

## Current cardinal directives (most load-bearing — verbatim)

> *"What is not mechanically enforced is just a temp fix."* (S005 turn 23)
>
> *"Foundations first; rest of system benefits."* (S006 turn 5 paraphrased)
>
> *"AI-human communication must include validation that what was provided as output was received and understood."* (S005 turn 28)
>
> *"The CORE is the universal fundamental undebatable things of each core spine."* (S006 turn 7)
>
> *"Enhance the system constantly; never settle for low standards + manual recovery."* (S006 turn 8)

→ Full registry: [user-intents.md](./user-intents.md)

---

## How to use this file

| Audience | Read order |
|---|---|
| New AI session opening cold | This file → [HANDOFF-S005-to-S006.md](../HANDOFF-S005-to-S006.md) §0 → [active topic-plan](./topic-plans/s006-governance-foundation.md) → start §3 work |
| New human contributor | This file → [csps-core-manifest.md](../../pillar-0-governance/csps-core-manifest.md) → pillar READMEs of interest |
| Auditor / vendor-risk reviewer | This file → [audit-hub.md](../../pillar-0-governance/audit-hub.md) → [csps-core-manifest.md](../../pillar-0-governance/csps-core-manifest.md) §"Mechanical enforcement" |
| Returning developer | This file → [active topic-plan](./topic-plans/s006-governance-foundation.md) §9 (subsequent-turn execution sequence) |

---

## What's next (S006 remaining + S007)

| Turn | Work | Type |
|---|---|---|
| S006 next | L1 ZF cycle + L1-exit attestation + commit + push | mechanical |
| S006 next-after | L2 engraving (5 P-META + 7 B_* contracts + 12 AGENTS NOs + 7 spine rows + 7 memory entries) | substantive |
| S006 then | L3-L5 of governance-foundation | substantive |
| S007 | zero-laptop-dependency-setup topic-plan opens (Hybrid C setup) | operational |
| S007+ | foundation-slice topic-plan opens (User/Tenant/AuditEvent ZModel + RLS + audit triggers) | substantive primary |

---

## Token-optimization rationale

This file is the **token-optimal entry point** for any AI/human consuming CSPS state. Achieved by:

1. **Single-file fetch** — no chained references needed for "what is CSPS now"
2. **BLUF format** — answer first, structure second, details linked
3. **Tables over prose** — structured info compressed
4. **Clickable links** — readers fetch only what they need
5. **Diataxis-typed reference** — predictable shape for repeat readers
6. **Aligned with CSPS DNA:**
   - Frontmatter (id / lifecycle / core_spines / template_used)
   - Core Spines explicit (vs implicit)
   - No-narration (BLUF; no "let me explain...")
   - PCR not needed (this is reference, not decision)
   - No sycophancy

For absolute-shortest-context: read just §"What CSPS is" (30 seconds) + §"State metrics" → know enough to ask informed questions.

---

**Quick-context signature:** `S006-AI-quick-context-2026-05-04T16:30:00Z-S006-L1-close`
