---
id: csps.core-spines.l2-domain-ai-alignment-protocol
name: L2_DOMAIN_AI_ALIGNMENT_PROTOCOL
description: AI spine domain governing how every agent passes alignment before invocation. AAP 9-check (identity + schema + B_* acks + QGs + capability + trust tier + output contract + eval baseline + preflight). 4 agent classes (A built / B subagent / C runtime / D imported); class-specific alignment paths.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: normal review (PCR + amendment)
template_used: l2-domain-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: AI
schema_anchor: core_spines_l2_domain
parent_l1_doctrine: ./L1_CORE_AI.md
domain: ALIGNMENT_PROTOCOL
tags:
  - domain:ai
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
---

# L2_DOMAIN_AI_ALIGNMENT_PROTOCOL

Operational decomposition of AI spine — the domain governing **how every agent passes alignment before invocation**.

## What this domain governs

Every agent in CSPS — Class A (CSPS-built skill), Class B (Claude Code built-in subagent like Explore/Plan/general-purpose), Class C (Mastra runtime agent), Class D (third-party imported skill) — passes the 9-check Agent Alignment Protocol (AAP) before invocation. Wildcards are not permitted.

The 9 checks: identity declaration / schema compliance / B_* contract acknowledgments / Quality Gate respect / capability boundary / trust tier / output contract / evaluation baseline / preflight + alignment preamble. Universal-required B_* acknowledgments minimum: B_AI_PROFESSIONAL_VOICE + B_VALIDATE_BEFORE_ASSUME.

Class-specific alignment paths: Class A via SKILL.md frontmatter (csps_aligned + aap_version + acknowledged_contracts + respects_quality_gates + output_contract + trust_tier + eval_baseline). Class B via spawn-prompt alignment preamble (FIRST CONTENT BLOCK before task description). Class C via Mastra BaseAgent runtime enforcement (week-6+). Class D via tier-gated quarantine → vendored → platform-owned protocol.

## Operational governance surfaces

- **AAP 9-check spec** (pillar-0-governance/agent-alignment-protocol.md)
- **SKILL.md AAP frontmatter** (Class A; 7/7 retrofitted S005 turn 26)
- **AAP Class B preamble template** (Class B; carry-forward S006 → L4)
- **Mastra BaseAgent runtime** (Class C; week-6+)
- **Sandboxed-skill-governance** (Class D; pillar-3)

## Per-domain validators

- `agent-alignment-coverage` (Class A SKILL.md AAP frontmatter complete)
- `subagent-spawn-preamble-required` (Class B spawn-prompt has preamble)
- `aap_frontmatter_coverage` (LIVE; 7/7 SKILL.md aligned)
- `mastra-agent-count` (per ADR-0008; exactly ONE Mastra runtime)

## Composition

Composes with L2_DOMAIN_AI_COGNITIVE_CONTEXT (Quality Gates respected by every agent invocation) + L2_DOMAIN_AI_INNER_DEFAULTS_OVERRIDE (alignment includes inner-defaults registry compliance) + the GVRN Spine's DECISION_RIGHTS_CLARITY domain (agents operate within capability boundary which is decision-rights at the AI layer).

**Domain signature:** S006-AI-l2-domain-ai-alignment-protocol-2026-05-04T20:00:00Z
