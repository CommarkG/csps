---
id: csps.know-how.error-patterns.ep-012
name: reuse-skip
description: Building a new implementation without running check_reuse first — violates P-OP-001 (reuse-first) and creates duplicate structures that could have enhanced existing ones
severity: HIGH
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
recurrence_count: 2
source_sessions: [S011]
applies_to: [plan-creation, implement]
prevention_checklist_item: "Before any new implementation: run check_reuse in principles-mcp or search existing platform for similar patterns. Cite results in §KH item 0 ('reuse check: <result>'). If nothing found: document why creation is justified."
mechanical_prevention: "pre-tool-use-reuse-check.sh (to be built; pre-tool-use hook on Write to implementation paths)"
domain_path: platform
scope_level: S1
---

# EP-012 — Reuse-Skip

**Pattern:** A new validator, skill, hook, contract, or artifact is created without searching for existing similar functionality. The AI defaults to creating rather than extending.

**Why recurrence_count=2 already:** Multiple times in S001-S011, parallel structures were created when existing ones could have been extended (e.g., new intake systems without checking B_INTAKE_DISCIPLINE, new validators without checking existing audit slugs). The K=2 criterion is met — this needs mechanical enforcement.

**Why it happens:** P-OP-001 (reuse-first) is a principle. Principles are behavioral. The `check_reuse` MCP tool exists but it's not in any workflow step that BLOCKS creation. The AI is optimistic about novelty.

**The fix:**
> Before any Write to implementation directories, a pre-tool-use hook checks if `check_reuse` was recently called for the concept being implemented. If not: emit warning. The hook can't PREVENT the Write (that's the user's prerogative) but it SURFACES the miss.

**Compounding value:** P-OP-001 says "Enhance the ratified thing." Every time reuse-first is skipped, the platform accumulates technical debt in the form of parallel structures that do similar things. At 300 platform elements, uncontrolled parallel structures become the dominant complexity driver.
