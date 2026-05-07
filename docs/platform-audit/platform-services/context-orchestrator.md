---
id: csps.platform-audit.service.context-orchestrator
name: service-context-orchestrator
description: >
  Domain card for the Context Orchestrator platform service. Implements GRACE
  (Graduated Resolution Architecture for Context Efficiency) — the 5-tier system
  for allocating computational resources proportionally to task complexity.
  Cross-cutting: serves all spines. 70% built in S007-S011, full activation in progress.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: platform_audit
enforcement_stage: active
template_used: domain-card
template_version: "1.0"
tags:
  - domain:ai
  - domain:platform
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ../README.md }
  - { rel: grace-hook, href: ../../../../../.claude/hooks/user-prompt-submit-context-orchestrator.sh }
  - { rel: templates, href: ../../../../../tools/templates/context-loading/ }
  - { rel: last-run, href: ../../../../../tools/context-orchestrator-last-run.json }
consolidation_cross_refs:
  - .claude/hooks/user-prompt-submit-context-orchestrator.sh
  - tools/templates/context-loading/
  - tools/model-tier-registry.yaml
  - docs/plan/_handoff/VAULT/topic-plans/token-optimization.md
---

# Context Orchestrator — Platform Service

## §1 Identity

**What I am:** The resource allocation layer of CSPS. I determine how computational resources are distributed across tasks — which tier handles each task, what context gets loaded, which AI model is used, and how the session adapts to changing complexity.

**Service type:** Cross-cutting — serves all 5 spines. AI spine owns me; every spine benefits from efficient context management.

**My sub-parts:**
- GRACE Architecture (5 tiers: cache → MCP → skill → subagent → main)
- Task-Class Detector (hook: fires on every UserPromptSubmit)
- Context-Loading Templates (8 task-class JSON bundles)
- Anatomy Check (classifies task → tier before execution)
- 4 Real-Time Monitor Layers (turn / tool / boundary / background)
- 4 Escalation Ladders (context pressure / blocking / complexity / blast radius)

---

## §2 The GRACE 5 Tiers

```
TIER 0 — Pre-computed cache    $0        Build-time, zero runtime cost
  What: session-state.json, pe-last-run.json, verify-last-run.md
  When: always available; read-only at runtime
  Model: none — deterministic reads

TIER 1 — MCP query             ~50 tok   Targeted knowledge retrieval
  What: principle lookups, domain card queries, vocabulary definitions
  When: task needs specific knowledge that's in the graph
  Model: none — structured retrieval

TIER 2 — Skill injection       ~500 tok  Reasoning structure
  What: PCR framework, cruel-critic amendments, schema invariants
  When: task needs a specific output pattern or reasoning framework
  Model: Sonnet (skills enhance main context)

TIER 3 — Subagent isolation    separate  Heavy isolated work
  What: file scanning, validator runs, log analysis, codebase exploration
  When: task is self-contained and expensive (>5 files, >50 lines output)
  Model: Haiku (CLAUDE_CODE_SUBAGENT_MODEL=haiku)
  Returns: 200-500 token summary to main context

TIER 4 — Main synthesis        full      Cross-domain reasoning
  What: Governor interaction, multi-source synthesis, constitutional decisions
  When: only after lower tiers are demonstrably insufficient
  Model: Sonnet (default) → Opus (high-blast, constitutional)
```

---

## §3 The 8 Context-Loading Templates

Each template defines: required_artifacts, optional_artifacts, model_tier, mcp_queries, estimated_token_cost_L1/L2.

| Task Class | L1 Cost | L2 Cost | Triggers |
|---|---|---|---|
| session-open | 2,500 tok | 8,000 tok | "starting session", "§17 receipt", "S0" |
| session-close | ~3,000 tok | ~9,000 tok | "session close", "HPFA", "§10" |
| engraving | ~1,500 tok | ~5,000 tok | "engrave", "5-surface", "FSE", "B_*" |
| qc-validation | 800 tok | 3,000 tok | "pnpm verify", "ZF", "exit_code 0" |
| pcr | ~600 tok | ~2,000 tok | "PCR", "pros cons", "should we" |
| mcp-query | ~200 tok | ~800 tok | "get_principle", "look up P-" |
| agent-spawn | ~400 tok | ~1,200 tok | "spawn agent", "subagent", "delegate" |
| frontmatter-authoring | ~500 tok | ~1,500 tok | "frontmatter", "lifecycle_state" |

**Currently: advisory mode** — hook detects task class, writes to `context-orchestrator-last-run.json`, AI reads and loads suggested artifacts.

**Phase 10 activation:** Hook injects artifacts automatically into conversation. Full GRACE mechanical.

---

## §4 The Anatomy Check

Before any task executes, classify it:

```
Is answer in pre-computed cache?            → Tier 0 (zero cost)
Does task need targeted knowledge retrieval? → Tier 1 (MCP, ~50 tok)
Does task need a reasoning structure?        → Tier 2 (skill, ~500 tok)
Is task self-contained and heavy?           → Tier 3 (Haiku subagent, isolated)
Does task require cross-domain synthesis?   → Tier 4 (Sonnet/Opus main)
```

Same task type = same tier routing. The anatomy check eliminates AI judgment drift in resource allocation.

---

## §5 The 4 Monitor Layers

**Turn-level:** context_utilization%, task_class, cost_delta
**Tool-level:** exit_code, domain_failure, output_volume
**Boundary-level:** pe_delta, vlt_status, bedrock_gate
**Background:** cache_warmth, mcp_hit_rate, blast_radius_current

Monitor signals fire escalation ladders. Escalation ladders select PE compositions. PE compositions weight domain cards. Domain card weights drive tier selection.

---

## §6 Vocabulary

**Terms I own:**
- `GRACE (Graduated Resolution Architecture for Context Efficiency)` — the 5-tier system
- `Anatomy Check` — the mechanical task classification that determines tier before execution
- `Context Bundle` — the minimum viable set of artifacts for a given task class
- `Task Class` — semantic category of a user prompt (one of 8+ defined classes)

---

## §7 MCP Surface

```
get_context_bundle("task-class")     → required_artifacts + model_tier + L1 cost
get_orchestrator_last_run()          → last task class detected + recommendation
get_anatomy_result("task-desc")      → which tier this task should use
find_template("task-class")          → full JSON template for that class
```

---

## §8 Current State & Evolution

**Active (enforcement_stage: active
template_used: domain-card
template_version: "1.0"):**
- `user-prompt-submit-context-orchestrator.sh` hook fires on every prompt
- 8 context-loading JSON templates in `tools/templates/context-loading/`
- `context-orchestrator-last-run.json` — current task class + recommendation
- Model-tier-registry.yaml — task_class_to_tier mapping

**Planned (enforcement_stage: week-4 / planned):**
- Phase 10: automatic context injection (not just suggestion)
- Parallel subagent fan-out template (Composition C — ZF in parallel)
- Domain card MCP surface (get_domain_card() via principles-mcp)
- `task_class_unknown` reduction (expand regex → semantic classification)
- Feedback loop: PostStop analyzes which artifacts were referenced → refines templates

---

## §9 Connection Map

| Connected to | How |
|---|---|
| AI spine | GRACE is the AI spine's operational execution layer |
| Priority Engine | PE composition selected by orchestrator based on escalation ladder rungs |
| QC/Audits | Escalation ladders fire on audit signals (exit_code 1, BLOCKING finding) |
| GVRN | Tier 4 (main context) is where GVRN decisions happen; orchestrator protects it |
| VALD | Subagent fan-out for validator runs (Tier 3 isolation) reduces VALD cost in main |
| AI Behavior | Inner-AI-Defaults calibration is loaded via orchestrator context bundles |
