---
id: csps.know-how.error-patterns.ep-011
name: build-without-plan
description: Implementation code created in libs/apps/packages without a corresponding active topic-plan — violates P-OP-002 FWWS and B_GRADUAL_BUILD_BY_FOUNDATIONS
severity: CRITICAL
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: know_how_error_patterns
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
first_seen: S011
recurrence_count: 1
source_sessions: [S011]
applies_to: [plan-creation, implement]
prevention_checklist_item: "Before touching libs/ apps/ packages/ (except EXEMPT platform infra), confirm an active topic-plan exists. AGENTS.md hard NO 77: Never start multi-session topic without gradual-build-plan."
mechanical_prevention: validate-no-implementation-without-plan.mjs (ACTIVE advisory in pnpm verify; promotes to error when Ring 3 construction begins)
domain_path: platform
---

# EP-011 — Build Without Plan

**Pattern:** Implementation files appear in libs/apps/packages without a corresponding active topic-plan. The code exists but there's no governed arc, no ZF gate per layer, no backtrack register, no foundation stability check.

**Why it happens:** The AI is asked to "build X." Building feels like the right action. The plan requirement is in AGENTS.md as a hard NO but there's no mechanical gate — the Write tool fires without checking if a plan exists.

**Example caught (S011):** libs/policies/ has base.zmodel + external-input.zmodel + learning-loop-item.zmodel + audit-triggers.sql with NO matching active topic-plan. The code was building toward the foundation slices but skipped the plan.

**Prevention checklist item:**
> Before any Write to libs/ apps/ packages/ src/ (except platform infra: principles/principles-mcp/schemas/glossary): verify an active topic-plan exists for this work area. If not: STOP. Create the topic-plan first. The code CANNOT come before the plan.

**What the plan unlocks:** L<N+1> work blocked until L<N> ZF passes. Foundation stability. Backtrack register. PE inputs. §KH consultation. These protections DON'T EXIST for unplanned code.
