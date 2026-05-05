---
id: csps.pillar-0-governance.model-routing-dashboard
name: model-routing-dashboard
description: Canonical USER-FACING dashboard for dynamic model-routing decisions in CSPS. Shows current routing state (per-layer model assignments) + decision tree (when to switch / when to stay) + 4 validated routing patterns extracted from S006 token-optimization research + S008 CSP file #5 absorption + Anthropic Claude API training knowledge + 4 adjustable templates user can copy/tune + Phase 6 (S010) auto-tiering preview + anti-patterns. Composes with cognitive-context-architecture.md (P-META-009 parent) + B_TOKEN_BUDGET (operating rules R1-R5) + B_COGNITIVE_CONTEXT_DISCIPLINE + B_SAVINGS_AND_SSOT_UNIFIED (S009 L1.4). Authored S009 per Governor directive "add a dashboard showing exactly the mechanism of dynamic model changes so I could see and create templates and adjust the reasoning."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: governed-artifact-frontmatter
template_status: novel-pending-pattern-evaluation
core_spine: AI
core_spines: [AI, GVRN, OPER, VALD]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:ai
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
session: S009
file_depth_markers:
  l1_lines: "1-90"
  l2_lines: "91-220"
  l3_lines: "221-end"
  read_protocol: "L1 = current state + decision tree + 4 validated patterns. L2 = adjustable templates + Phase 6 preview. L3 = anti-patterns + mechanical enforcement + references."
depth_levels_invoked: [L1, L2]
depth_tier_authored: l1_essence
context_loss_prevention:
  consulted: docs/plan/pillar-0-governance/context-loss-pains.md
  applies_to_this_plan:
    - PAIN-MODEL-SWITCH: "dashboard surfaces when mid-task switching invalidates Anthropic prompt cache (R2 caveat)"
    - PAIN-OVERREAD: "dashboard shows L1-default routing per B_TOKEN_BUDGET R1"
    - PAIN-TOKEN-R-VIOLATION: "dashboard surfaces R1-R5 violations + remediation"
  not_applicable:
    - PAIN-N-TO-1-CHAT: "leaf authoring; no chat-vs-session boundary"
links:
  - { rel: parent, href: ./README.md }
  - { rel: cca, href: ./cognitive-context-architecture.md }
  - { rel: token-optimization, href: ./token-optimization.md }
  - { rel: behavioral-contracts, href: ./behavioral-contracts.md }
  - { rel: depth-discipline, href: ./depth-discipline.md }
  - { rel: csps-dna, href: ./csps-platform-dna.md }
  - { rel: source-cca-research, href: ./token-optimization.md }
  - { rel: source-csp-file-5, href: ../_intake/contexts/governance/savings-ssot/EXT-20260505-005-A-unified-principle-savings-and-ssot-same-discipline.md }
---

# Model Routing Dashboard — CSPS

> **Canonical USER-FACING dashboard for "which model runs which work" + adjustable templates + decision rationale.** Authored S009 per Governor directive: *"add a dashboard showing exactly the mechanism of dynamic model changes so I could see and create templates and adjust the reasoning."* Composes with [cognitive-context-architecture.md](./cognitive-context-architecture.md) (P-META-009 parent) — this dashboard is the operational/visual surface; CCA is the principle.

## §1 — Current routing state (point-in-time S009)

| Layer / Surface | Current model | Why this tier | Mechanism |
|---|---|---|---|
| Main thread (this conversation) | **Opus 4.7** | QG1 — hard reasoning never downgrades | Manually selected via `/model` OR Claude Code default |
| Class A skills (CSPS-built; 16 with AAP) | inherit from main OR per-skill `model:` in SKILL.md frontmatter | Right-tool-for-job per work-class | Frontmatter declaration; runtime not yet consuming (Phase 6 build) |
| Class B subagents (Explore / Plan / general-purpose / claude-code-guide / statusline-setup) | inherit from main (default) | AAP preamble template not yet authored | Phase 6 (S010) — Class B preamble specifies model |
| Mastra BaseAgent (Class C runtime) | not built (week-6+) | Runtime authoring deferred per build-order.md | AAP runtime enforcement at agent construction |
| Third-party imported skills (Class D) | not yet integrated | Quarantine→Vendored→Platform-owned ladder | Tier-gated; future |

**Plain reading:** today everything runs on whatever the main thread is set to. There's no auto-routing yet. Phase 6 (S010) ships the auto-routing mechanism via spawn-template `model:` declarations.

## §2 — Decision tree: when to switch / when to stay

```
┌─ ARE YOU MID-TASK?
│  YES → STAY on current model (R2 caveat: mid-task switch invalidates prompt cache)
│  NO  → continue ↓
│
├─ WHAT WORK-CLASS?
│  Hard reasoning (engraving / PCR / ZF synthesis / ADR / arch decisions / honest self-audit)
│    → Opus 4.7 (QG1 IMMUTABLE — never downgrade)
│  Mechanical edits (typo fix / single-line refactor / file moves / yaml renames)
│    → Sonnet 4.6 acceptable
│  File-existence checks / log scans / structured fetches / git status / glob
│    → Haiku 4.5 acceptable
│  Synthesis (PCR rendering / cross-pillar reasoning / ZF cycle interpretation)
│    → STAYS IN MAIN (QG2 — subagents can't see full context)
│
└─ ARE YOU AT A SESSION BOUNDARY?
   YES → safe to /clear + switch model (R4 — clean cache rebuild)
   NO  → /compact <focus> at IMPL_BATCH boundary (R3 — preserve governance state)
```

**The 4 immutable Quality Gates** (per P-META-009 cognitive-context-architecture.md):

- **QG1** — Hard reasoning never downgrades from Opus
- **QG2** — Synthesis stays in main context (no subagent delegation of synthesis)
- **QG3** — Mid-session edited file content re-read mandatory (don't rely on memory of last-write)
- **QG4** — Cache invalidates on content change (Layer 1+2 stable only; Layer 3 active never)

## §3 — 4 validated routing patterns (extracted from research)

**Source provenance:** S006 turn 26 token-optimization.md authored from 4-council research (Perplexity backbone + GPT B_TOKEN_BUDGET architecture + Gemini prompt-caching + Claude AI hooks-replacing-injection per CSP S335 standard). S008 turn 11 CSP file #5 absorbed unification synthesis. Patterns below are the cross-validated subset.

### Pattern 1 — Right-tool-for-job per work-class (Anthropic + 4-council convergence)

| Work-class | Required model | Why |
|---|---|---|
| Engraving / PCR / ZF synthesis / ADR / architectural decisions / honest self-audit | **Opus 4.7** | Hold 5+ files in coherent context; cross-reference precedent; compose load-bearing canonical wording |
| New B_* contract authoring | **Opus 4.7** | Anti-pattern to invent parallel structures (D5 continuity-bias risk) |
| Mechanical edits with pattern (typo / refactor / yaml rename) | **Sonnet 4.6** | Pattern-following without synthesis; quality holds |
| File-existence checks / log scans / structured fetches | **Haiku 4.5** | Cheapest-tool-for-job; no reasoning needed |
| Spawn-template authoring (mechanical-with-precedent-check) | **Sonnet 4.6** | Mostly pattern + small Opus moments for novel decisions |

### Pattern 2 — No mid-task switch (Anthropic prompt cache; R2)

Anthropic prompt cache is **model-specific** — switching model mid-task invalidates cache + costs full re-read. The R2 rule:

- Switch ONLY at task boundary (after `/compact` OR `/clear`)
- Mid-task `/model` toggle = anti-pattern (cache rebuild waste)
- Cache TTL: ~5 minutes between requests; persists across requests within window

### Pattern 3 — Cache breakpoint placement (Gemini council; QG4)

Cache breakpoints (in Claude Code session config) align with **stable-content boundaries**:

| Layer | Stability | Cacheable? | TTL |
|---|---|---|---|
| Layer 1 — Permanent Constitution (principles.yaml + AGENTS.md + memory) | stable across session | YES | session-length OR until content edit |
| Layer 2 — Session Contract (handoff + closing-summary + topic-plan) | stable within session | YES | session-length |
| Layer 3 — Active Work (current files being edited) | volatile | **NEVER** | n/a |
| Layer 4 — MCP queries | volatile (per-query) | NO | n/a |
| Layer 5 — Subagent-delegated work | bounded (subagent scope) | partial | per-spawn |

### Pattern 4 — Hook-replacing-injection (Claude AI council)

For mechanical disciplines that fire deterministically: **author a hook script** (`.claude/hooks/*.sh`) instead of relying on AI memory/injection. Hooks fire at PreToolUse / PostToolUse / Stop / SessionStart. The pre-runtime stub authoring (S009 L1.6 example: 3 hook stubs) gates the active enforcement until week-4 build.

**Why this beats injection:** AI memory of injected reminders decays under load (D2 + D6 from D1-D10 catalog); hooks fire mechanically regardless of AI state.

## §4 — Adjustable templates (copy + tune to your task)

### Template T1 — Per-skill model declaration (Class A SKILL.md frontmatter)

```yaml
# In packages/skills/<name>/SKILL.md OR .claude/skills/<name>/SKILL.md frontmatter:
csps_aligned: true
aap_version: 1.0
agent_class: A
model: claude-sonnet-4-6              # OR claude-opus-4-7 OR claude-haiku-4-5
model_routing_rationale: "Mechanical pattern-matching; no cross-pillar synthesis"
acknowledged_contracts: [B_AI_PROFESSIONAL_VOICE, B_VALIDATE_BEFORE_ASSUME, B_TOKEN_BUDGET]
respects_quality_gates: [QG1, QG2, QG3, QG4]
```

**Tune by:** changing `model:` value + `model_routing_rationale:` reason. Runtime consumption Phase 6 (S010).

### Template T2 — Class B subagent spawn dispatch (Phase 6 build)

```yaml
# Spawn-prompt frontmatter (planned Phase 6 / S010):
spawned_at: <iso8601>
parent_session: S<NNN>
agent_class: B
model: claude-haiku-4-5                # explicit declaration; no inherit
work_class: file-existence-check       # closed enum: file-existence-check | log-scan | structured-fetch | grep-heavy
output_contract: |
  Returns: {found: bool, paths: [string], evidence: string}
  Max tokens: 200
  No synthesis claims; no ratification claims.
preamble_acknowledged_contracts: [B_AI_PROFESSIONAL_VOICE, B_VALIDATE_BEFORE_ASSUME]
```

**Tune by:** matching `work_class:` to actual task → `model:` follows pattern table. Auto-derivable Phase 6.

### Template T3 — Per-task-class routing decision (cognitive-layer reference)

```markdown
## Pre-task model decision

Task: <one-sentence what>
Work-class: <hard-reasoning | mechanical-edit | file-check | synthesis>
Routing: <model> (per Pattern 1 table above)
At-boundary?: <yes/no — if no, stay on current to preserve cache>
Cache state: <Layer 1+2 cached / re-read needed / n/a>

Decision: <execute on chosen model>
```

**Tune by:** Use as pre-task checklist for ANY substantive work. Forces explicit routing decision before token-spend.

### Template T4 — Per-session model-budget plan (cognitive-layer reference)

```markdown
## S<NNN> opening — model budget

Primary: <model> for <work-class>
Secondary: <model> for <work-class>
Boundary signal: <when to switch>
Estimated proportion: <X% on primary + Y% on secondary>

Anti-pattern guards:
- No mid-task switches (R2)
- No subagent delegation of synthesis (QG2)
- Re-read mid-session edited files (QG3)
```

**Tune by:** Author at session-open BEFORE Step 0 ASK; informs which model handles which sub-batch. S010 example: primary=Sonnet 4.6 (Phase 6 mechanical work) / secondary=Opus 4.7 (engraving moments only ~20%).

## §5 — Phase 6 (S010) auto-tiering preview

After Phase 6 ships, model-routing becomes **mechanical** via:

1. **Spawn templates declare model** in frontmatter — Class B subagents auto-route
2. **Per-skill `model:` field** — runtime reads SKILL.md frontmatter at invocation
3. **AAP preamble template** — every Class B spawn has model + work-class + output-contract injected
4. **Auto-tier decision logic** — work-class → model mapping is deterministic (per Pattern 1 table)
5. **Validators enforce** — `model-routing-on-ratification` (S005 turn 24 atomic; QG1 enforcer) flags any Sonnet/Haiku ratification attempt

**S010 work to ship Phase 6** (per token-optimization.md §9.7):

- 6a. Class B subagent spawn templates use [governed-artifact-frontmatter.template.md](../../tools/templates/governed-artifact-frontmatter.template.md) (S009 L1.2)
- 6b. Spawn templates declare depth-discipline fields per [depth-discipline.md](./depth-discipline.md) (S009 L1.1)
- 6c. AAP frontmatter extended 7→9 fields per EXT-20260505-002-B (CSPS-adapted)
- 6d. 3 heavy ops delegated to Haiku per token-optimization.md §9.7 + measure mid-session context growth

**Distance to mechanical auto-tiering:** ~1 session of work (S010). After S010 closes, this dashboard becomes a **read-only reference + adjustment surface** rather than the manual-decision lookup it is today.

## §6 — Anti-patterns

| Pattern | Detection | Mitigation |
|---|---|---|
| **Mid-task model switch** | Session log shows `/model` mid-IMPL_BATCH | Switch only at task boundary; `validator token-budget-cache-continuity` catches |
| **Subagent delegation of synthesis** | Agent tool spawn for engraving / PCR / ZF / ADR work | QG2 — synthesis stays in main; spawn only for grep / log / fetch |
| **Sonnet/Haiku for engraving** | Ratification commit on non-Opus | QG1 — `model-routing-on-ratification` audit (PR-blocking error) |
| **Cache-volatile content cached** | Layer 3 active work cached beyond turn | QG4 — `cache-content-hash-fresh` audit (nightly) |
| **Token-saving > quality** | Routing decision based on cost not work-class | P-META-009 cardinal: *"I prioritize quality and holistic context and solutions serving me for the long run over immediate saving"* |
| **No-tier-declaration on spawn** | Class B subagent spawned without `model:` field | Phase 6 spawn templates require declaration |

## §7 — Mechanical enforcement (validators)

Per [audit-runner.md](./audit-runner.md). All registered atomic; impl tracked:

| Validator | Cadence | Status |
|---|---|---|
| `model-routing-on-ratification` (QG1) | PR | atomic S005 turn 24; week-4 |
| `cognitive-context-discipline-coverage` | per-session | atomic S005 turn 24; week-4 |
| `cache-content-hash-fresh` (QG4) | nightly | atomic S005 turn 24; week-4 |
| `token-budget-cache-continuity` (R2) | per-session | atomic S007 turn 4; week-4 |
| `token-budget-claude-md-size` (R1) | PR | atomic S007 turn 4; week-4 |
| `token-budget-skills-completeness` (R1) | PR | atomic S007 turn 4; week-4 |
| `token-budget-hook-presence` (R5) | PR | atomic S007 turn 4; week-4 |
| `token-budget-compact-frequency` (R3) | per-session | atomic S007 turn 4; week-4 |

**Pre-runtime:** AI manually applies via this dashboard + B_TOKEN_BUDGET memory entry 40. **Post-runtime (week-4+):** mechanical via audit-runner Pipeline 3 (cognitive-context-discipline pipeline) + audit-hub.md.

## §8 — Open questions (carry-forward register)

1. **Per-skill `model:` field syntax** — Phase 6 ratifies; current SKILL.md AAP frontmatter doesn't have it. Decision: Phase 6 spawn templates extend frontmatter atomically per FSE.
2. **Class D third-party skill model declaration** — defer to Class D quarantine ladder build (week-6+).
3. **Mastra BaseAgent (Class C) model selection at construction** — defer to runtime build (week-6+); composes with this dashboard via runtime config consumption.
4. **Auto-tier decision logic for mixed work-class tasks** — when a task mixes synthesis + mechanical, current rule is "stay on Opus for the synthesis portion + spawn for the mechanical portion". Phase 6 may refine.
5. **Empirical token-cost validation** — current routing recommendations are research-derived; Phase 9 measurement validator (S013) measures empirical CSPS savings vs CSP claims (60-75% per CSP file #4 ESTIMATED).

## §9 — References

- [cognitive-context-architecture.md](./cognitive-context-architecture.md) — P-META-009 parent principle (5-layer model + 4 QGs)
- [token-optimization.md](./token-optimization.md) §3 + §9.7 — model selection criteria + Phase 7 auto-tiering spec
- [behavioral-contracts.md](./behavioral-contracts.md) — B_TOKEN_BUDGET (5 operating rules R1-R5) + B_COGNITIVE_CONTEXT_DISCIPLINE + B_SAVINGS_AND_SSOT_UNIFIED (S009 L1.4)
- [csps-platform-dna.md](./csps-platform-dna.md) — DNA Element 7 (Quality Gates immutable)
- [depth-discipline.md](./depth-discipline.md) — depth markers consumed by PE.read_budget (Phase 8 / S012)
- [audit-runner.md](./audit-runner.md) — 8 validators registered atomic (S005 + S007 + S009)
- [Anthropic prompt caching docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — 5-min TTL + cache breakpoint mechanics (referenced; not refetched this session)
- EXT-20260505-005-A — CSP file #5 unified principle (savings + SSoT)

**Dashboard signature:** `S009-AI-model-routing-dashboard-v1.0-2026-05-05`
