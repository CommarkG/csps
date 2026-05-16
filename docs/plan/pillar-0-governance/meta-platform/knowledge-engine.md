---
id: csps.governance.meta-platform.knowledge-engine
name: knowledge-engine
description: "How external research enters the platform DNA — EXT-KNOW capture → confrontation → absorption/ADR/feedback loop. Prevents tribal knowledge decay."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S037
depth_level: 2
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: vault, href: ../../_intake/external-knowledge/ }
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# Knowledge Engine

The Knowledge Engine is the mechanism by which external research, industry patterns, and advisor synthesis enter the CSPS platform DNA permanently — rather than being read once, acted on, and forgotten.

## The Problem It Solves

External knowledge (Lovable analysis, SaaS architecture reviews, AI governance research) has a half-life of one session in AI-only memory. Without mechanical absorption, the same research is re-commissioned in every session, and the same insights are re-discovered instead of compounding.

## The 3-Stage Pipeline

```
Stage 1: CAPTURE
  └─ EXT-KNOW-NNN file created in docs/plan/_intake/external-knowledge/
     Fields: source / date_accessed / raw_findings / confidence_level

Stage 2: CONFRONT
  └─ AI confronts raw findings with CSPS DNA:
     Q1: Does this contradict an existing sealed principle?
     Q2: Does this validate something we already do?
     Q3: Is this a gap — something CSPS should do but doesn't?
     Output: confrontation_verdict (ABSORB / ADR / FEEDBACK / REJECT)

Stage 3: ABSORB (or route)
  ├─ ABSORB: new principle / contract / validator created → 5-surface FSE
  ├─ ADR: architectural decision recorded → docs/plan/pillar-0-governance/adr-process.md
  ├─ FEEDBACK: inner-AI-defaults entry updated → continuous-drift-log.md
  └─ REJECT: documented with reason (prevents re-commissioning same research)
```

## Vault Location

External knowledge artifacts live at `docs/plan/_intake/external-knowledge/`.

Each `EXT-KNOW-NNN` file uses the schema in `docs/plan/_intake/external-knowledge/README.md`.

## What Prevents Decay

- `validate-research-reuse.mjs` — surfaces stale research registry entries
- HANDOFF Zone A includes "open absorption candidates" so new sessions inherit the pipeline
- HPFA (Handoff Pre-Flight Audit) checks for unabsorbed high-confidence findings

*Source: OPUS-2 Turn 72 knowledge-engine spec | S037-D*
