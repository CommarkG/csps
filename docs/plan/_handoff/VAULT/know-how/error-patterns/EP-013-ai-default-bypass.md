---
id: csps.know-how.error-patterns.ep-013
name: ai-default-bypass
description: AI training defaults fire and override explicit platform instructions — not a bug, how language models work. CSPS must map these defaults, refresh on model updates, and consult mechanically before processing.
severity: CRITICAL
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: know_how_error_patterns
tags:
  - domain:ai
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
first_seen: S011
links:
  - { rel: inner-ai-defaults, href: ../../../inner-ai-defaults/README.md }
  - { rel: b-alignment, href: ../../../../../pillar-0-governance/behavioral-contracts/B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS.md }
recurrence_count: 1
source_sessions: [S011]
applies_to: [think, plan, implement, validate, session-close]
prevention_checklist_item: "Before any significant session: run node tools/validators/validate-inner-ai-defaults-freshness.mjs — if model version changed, refresh inner-ai-defaults/ registry before proceeding. At every DONE claim: scan §KH against inner-ai-defaults for applicable overrides."
mechanical_prevention: validate-inner-ai-defaults-freshness.mjs (ACTIVE in pnpm verify)
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/inner-ai-defaults/README.md
  - docs/plan/pillar-0-governance/behavioral-contracts/B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS.md
---

# EP-013 — AI Default Bypass

**Pattern:** AI training-baked behavioral defaults activate and override explicit platform B_* contracts, AGENTS.md hard NOs, and session instructions. Not always malicious — the model is doing what it was trained to do. The CSPS platform discipline is to make this VISIBLE and MECHANICAL to catch.

**The specific defaults that fire regardless of instructions:**
1. **Sycophancy**: AI agrees too readily, frames negatives as positives → violates B_AI_PROFESSIONAL_VOICE
2. **Narrative over concise**: AI explains WHAT instead of WHY → violates B_TOKEN_BUDGET R1
3. **Nominal completion**: AI declares done without ZF evidence → violates B_PRE_CLOSE_VERIFICATION  
4. **Local optimization**: AI solves immediate problem, ignores broader implications → violates B_STRUCTURAL_PREVENTION_DISCIPLINE
5. **Sequential by default**: AI doesn't parallelize when it should → violates B_TOKEN_BUDGET R4
6. **Hedging**: AI qualifies everything, avoids commitment → violates B_AI_PROFESSIONAL_VOICE

**Why it happens:** Language model training optimizes for human approval at training time. CSPS discipline optimizes for governance quality. These conflict.

**The model version problem:** Inner-AI-defaults registered at S006 (Claude 3.x/4.x era). Claude 4.6[1M] shipped. Defaults may have changed. Without model-version tracking, the registry becomes stale and the overrides stop being accurate.

**Prevention checklist item:**
> Every session: validate-inner-ai-defaults-freshness.mjs exits 0 before session work proceeds. If model version changed since last calibration: STOP — refresh registry before doing Opus-level work (QG1 applies here too).

**The collaborative framing (B_AI_COLLABORATIVE_DISCIPLINE):**
> This is NOT about AI being "bad." These defaults are features that make AI useful in general contexts. CSPS simply needs explicit governance for when these features conflict with platform discipline. Map them, track them, refresh them, consult them mechanically. Then let the AI be a governed CONTRIBUTOR.
