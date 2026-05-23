---
id: csps.adr.0027-unified-scope-model
name: 0027-unified-scope-model
description: ADR-0027 — Unified Scope Model (USM). Ratified S028 Opus Turn 21. Defines S0-S5 vocabulary as L1 GVRN CORE.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S032
status: accepted
impl_status: swift-implemented
links:
  - { rel: ratified-by, href: ../plan/pillar-0-governance/core-spines/L1_CORE_GVRN.md }
  - { rel: validator, href: ../../tools/validators/validate-scope-conflict.mjs }
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0027 — Unified Scope Model (USM)

**Status:** Accepted | **Ratified:** Opus Turn 21, S028 | **Implemented:** S032

---

## Decision

The CSPS platform adopts the Unified Scope Model (USM) as the canonical vocabulary for describing the blast radius and authority level of every platform artifact, rule, and decision.

## The USM Vocabulary (L1 GVRN CORE — sealed)

| Level | Name | Definition | Example |
|---|---|---|---|
| **S0** | Constitutional | Cannot change without platform re-grounding. Sealed. Violating = wrong foundation. | Core Spines L1 files, sealed principles |
| **S1** | Platform-wide | Applies to ALL apps on CSPS. One change → 30 apps affected. | libs/*, schema.zmodel, governance procedures |
| **S2** | App-scope | Applies to ONE specific app. Change is isolated. | apps/budget-planner/*, app-specific routes |
| **S3** | Tenant-scope | Applies to ONE tenant within an app. | Tenant config, tenant-specific data |
| **S4** | User-scope | Applies to ONE user. | User preferences, personal settings |
| **S5** | Session-scope | Applies to ONE session. Ephemeral. | session-state.json, session context |

## Governing Rule

**Every governed artifact MUST declare `scope_level: S[0-5]` in its frontmatter.**

The scope_level field answers: "If this artifact changes, what is the blast radius?"

Violations caught by: `validate-scope-conflict.mjs` (advisory) → BLOCKING after naming backfill.

## Enforcement at Decision Time

When the AI proposes a change, it MUST state the scope level:
- "This is an S1 change — affects all 30 apps"
- "This is an S2 change — isolated to budget-planner"

Proposing an S1 solution for an S2 problem = scope violation.
Proposing an S2 solution for an S1 requirement = scope debt.

## What This Resolves

S028 had repeated scope violations:
- `gate-3-procedure.md` placed in `apps/budget-planner/` (S2) when it was an S1 procedure
- Universal credentials scoped to budget-planner instead of platform
- Vercel Root Directory scoped to app instead of platform

ADR-0027 makes these violations machine-detectable via `scope_level:` frontmatter.

## Implementation Phases

1. **Phase 1 (S032):** Vocabulary declared (this ADR). `validate-scope-level-declared.mjs` ADVISORY.
2. **Phase 2 (S033+):** Backfill `scope_level:` on all governed artifacts via script.
3. **Phase 3 (S034+):** `validate-scope-conflict.mjs` → BLOCKING. `pre-tool-use-scope-guardian.sh` hook.

## Authority

Ratified: Opus Turn 21 S028 — "ADR-0027 is the required artifact. S0-S5 definitions are L1 GVRN CORE."
Sealed: These definitions cannot change without a new ADR + Governor ratification + Opus council review.
