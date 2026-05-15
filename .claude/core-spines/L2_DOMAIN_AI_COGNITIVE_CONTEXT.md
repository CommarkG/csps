---
id: csps.core-spines.l2-domain-ai-cognitive-context
name: L2_DOMAIN_AI_COGNITIVE_CONTEXT
description: AI spine domain governing the 5-layer cognitive architecture + 4 immutable Quality Gates. Layers (Constitution / Session Contract / Active Work / MCP queries / Subagent-delegated). QGs (no-Opus-downgrade-on-hard-reasoning / synthesis-stays-in-main / mid-session-edited-files-re-read / cache-content-hash-fresh).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: normal review (PCR + amendment) — but QGs themselves are CONSTITUTIONAL (immutable; ADR-0025+ required)
template_used: l2-domain-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: AI
schema_anchor: core_spines_l2_domain
parent_l1_doctrine: ./L1_CORE_AI.md
domain: COGNITIVE_CONTEXT
tags:
  - domain:ai
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
scope_level: S1
---

# L2_DOMAIN_AI_COGNITIVE_CONTEXT

Operational decomposition of AI spine — the domain governing **the layered cognitive architecture + immutable Quality Gates**.

## What this domain governs

Every AI session uses 5 cognitive layers. Layer 1 (Permanent Constitution) is stable across sessions — AGENTS.md + principles.yaml + behavioral-contracts; 1-hour cache eligible. Layer 2 (Session Contract) is stable within session — HANDOFF §0 + active §3; 1-hour cache eligible. Layer 3 (Active Work) changes per turn — edited files + tool outputs; NOT 1h-cached (volatile). Layer 4 (MCP queries) on-demand fetches — **`csps-principles-mcp` is now ACTIVE (Phase 8 S011): get_principle(id, depth=L1) returns ~200 tokens vs 85K monolith; use for principle lookups in AI sessions.** Layer 5 (Subagent-delegated) bounded scope.

The 4 Quality Gates are immutable — change requires CONSTITUTIONAL amendment (ADR + ratification). QG1: hard reasoning never downgrades from Opus (engraving / PCR / ZF synthesis / architectural decisions / cross-pillar synthesis stay on top model). QG2: synthesis stays in main context (subagents do focused work only — search/grep/log/parallel-independent reads; never delegate ratification or PCR rendering). QG3: mid-session edited files re-read mandatorily (memory of last-write is the worst-case quality regression). QG4: cache only stable content with content-hash invalidation (Layer 1+2 yes; Layer 3+ no).

The right-tool-for-job model routing applies to OTHER work (mechanical edits → Sonnet; file-existence checks → Haiku); the immutable scope is ratification work.

## Operational governance surfaces

- **5-layer cognitive architecture** (cognitive-context-architecture.md dashboard leaf)
- **4 Quality Gates** (CONSTITUTIONAL; engraved P-META-009 + B_COGNITIVE_CONTEXT_DISCIPLINE + 4 AGENTS.md hard NOs)
- **Right-tool-for-job model routing** (Opus / Sonnet / Haiku per work-type)
- **Cache invalidation on content change** (Anthropic content-hash mechanism)

## Per-domain validators

- `cognitive-context-discipline-coverage` (QGs respected across session)
- `model-routing-on-ratification` (QG1 — hard reasoning on top model)
- `cache-content-hash-fresh` (QG4 — Layer 3+ not 1h-cached)

## Composition

Composes with L2_DOMAIN_AI_ALIGNMENT_PROTOCOL (every agent respects QGs as part of alignment) + L2_DOMAIN_AI_INNER_DEFAULTS_OVERRIDE (CCA's QG2-stay-in-main is the boundary protecting synthesis from inner-defaults drift) + the OPER Spine's PACE_DISCIPLINE domain (QG3 re-read invalidates assumptions about prior reads).

**Domain signature:** S006-AI-l2-domain-ai-cognitive-context-2026-05-04T20:00:00Z
