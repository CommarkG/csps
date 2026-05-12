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
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
---

# Model Routing Dashboard — CSPS

> **Canonical USER-FACING dashboard for "which model runs which work" + adjustable templates + decision rationale.** Authored S009 per Governor directive: *"add a dashboard showing exactly the mechanism of dynamic model changes so I could see and create templates and adjust the reasoning."* Composes with [cognitive-context-architecture.md](./cognitive-context-architecture.md) (P-META-009 parent) — this dashboard is the operational/visual surface; CCA is the principle.

## §1 — Current routing state (point-in-time S009)

| Layer / Surface | Current model | Why this tier | Mechanism |
|---|---|---|---|
| Main thread — default | **Sonnet 4.6[1m]** | Lever 1 active — balanced cost/quality; ~80% CSPS work is Sonnet-appropriate | `settings.json "model": "claude-sonnet-4-6[1m]"` — set S010 per Governor approval |
| Main thread — engraving moments | **Opus 4.7[1m]** | QG1 IMMUTABLE — hard reasoning never downgrades | Manual `/model default` at IMPL_BATCH boundary; max 2 switches per session (development-balanced profile) |
| Class A skills (CSPS-built; 16 with AAP) | inherit from main OR per-skill `model:` in SKILL.md frontmatter | Right-tool-for-job per work-class | Frontmatter declaration; runtime consumption Phase 9 (S012) |
| Class B subagents (Explore / Plan / general-purpose) | **Haiku 4.5** | Cheapest-tool-for-job; T2.x contracts declare model explicitly | `Agent(model="haiku", ...)` in every T2.x spawn per [class-b-agent-spawn-preamble.template.md](../../tools/templates/class-b-agent-spawn-preamble.template.md) — Phase 6 SHIPPED S010 |
| Mastra BaseAgent (Class C runtime) | not built (week-6+) | Runtime authoring deferred per build-order.md | AAP runtime enforcement at agent construction |
| Third-party imported skills (Class D) | not yet integrated | Quarantine→Vendored→Platform-owned ladder | Tier-gated; future |

**S010 routing state:** Lever 1 active (Sonnet default). Haiku subagents mechanical (T2.1/2/3 shipped). Opus on-demand at engraving boundary. Active profile: `development-balanced` (see §10). ~80% sessions need 0-2 `/model` commands.

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

## §5 — Phase 6 COMPLETE (S010) — auto-tiering mechanism shipped

> **Delivered S010 turn 6a/6b/6c/6d. This section updates from "preview" to "complete" per B_VALIDATE_BEFORE_ASSUME.**

Model-routing is now **mechanical** via the following delivered surfaces:

1. ✅ **Spawn templates declare model** — [class-b-agent-spawn-preamble.template.md](../../tools/templates/class-b-agent-spawn-preamble.template.md) has explicit `model: haiku` in every T2.x contract (T2.1 ZF cycle / T2.2 validator full-pass / T2.3 file scan)
2. ✅ **Per-skill `model:` field in SKILL.md** — [skill.template.md](../../tools/templates/skill.template.md) updated; field available for population; runtime consumption Phase 9 (S012)
3. ✅ **AAP 9-field preamble** — every Class B spawn declares `principle_compliance` + `consolidation_cross_refs` (S010 6c engraving; [behavioral-contracts.md § B_AGENT_ALIGNMENT_PROTOCOL S010 amendment](./behavioral-contracts.md))
4. ✅ **Auto-tier decision logic** — work-class → model mapping deterministic per §2 decision tree; T2.x contracts pre-wire Haiku for all file/verify/scan ops
5. ✅ **Validators enforce** — `model-routing-on-ratification` (S005 turn 24 atomic; QG1 enforcer) flags any Sonnet/Haiku ratification attempt; `aap-9-field-coverage` (S010 atomic; Phase 1 warn → Phase 2 S012 error)
6. ✅ **Lever 1 active** — `settings.json "model": "claude-sonnet-4-6[1m]"` sets Sonnet as session default (S010 Governor-approved); Opus requested at IMPL_BATCH engraving boundary only

**Remaining path to full mechanical auto-tiering:**

| Phase | What ships | Status |
|---|---|---|
| Phase 7 (S010) | File splits → L1-only reads become real; per-file depth markers backfilled | ✅ COMPLETE S010 — 130 slices |
| Phase 8 (S011) | principles-mcp slice-reading + 4 query tools (get/list/find_by_layer/find_by_spine) + depth-aware L1/L2/L3 | ✅ COMPLETE S011 — L1 ~200 tokens/principle vs 85K monolith |
| Phase 9 (S012) | Bundling orchestrator (PE.read_budget; EXT-004-C) + validate-token-budget.mjs 5-mode + context-loading templates × 8 | Carry-forward |
| Phase 10 (S013) | Measurement validator — empirical savings vs projected; continuous validation active | Carry-forward |
| S012 Lever 2 promotion | validator `model-routing-profile-consistency` checks settings.json model matches active profile default | Registered |

## §10 — Configuration Profiles (Template Groups)

> **Per Governor S010 directive** — *"create it as another option or template of token optimization — each template with a 'group of settings'. Include in the dashboard the option to set one of the templates as default. Next to each parameter there must be a reasoning place for developer to place inputs."*
>
> Each profile is a named group of routing settings that work together. Set one profile as `is_default: true`. The active profile drives your T4 per-session model-budget plan and [settings.json](../../../.claude/settings.json) `"model"` field. Developer adds reasoning to each `developer_notes:` field — WHY these settings suit their context + project phase.

### Active profile: `development-balanced` ← DEFAULT

```yaml
# HOW TO SWITCH PROFILES:
# 1. Set is_default: true on your chosen profile (false on all others)
# 2. Update settings.json "model" field to match main_session_default.value
# 3. Open next session with that profile's T4 model-budget template
# 4. Validator model-routing-profile-consistency (week-4 S012) will enforce consistency

profile_id: development-balanced
group: cost-quality-balanced
description: Sonnet 1M main; Haiku all spawns; Opus only at engraving IMPL_BATCH boundaries. Max 2 /model commands per session.
is_default: true   # ← active profile; change to false to deactivate

settings:

  main_session_default:
    value: claude-sonnet-4-6[1m]
    developer_notes: ""
    # Guidance: Sonnet handles ~80% of CSPS work (templates, YAML, file authoring, hook edits).
    # ~5× cheaper than Opus per token. 1M context holds full governance layer without /compact pressure.

  engraving_model:
    value: claude-opus-4-7[1m]
    developer_notes: ""
    # Guidance: QG1 IMMUTABLE — never change this. Engraving is B_* contract / principle amendment /
    # ZF synthesis / PCR-non-trivial. Occurs ~20% of sessions. One /model switch at IMPL_BATCH boundary.

  spawn_default:
    value: claude-haiku-4-5-20251001
    developer_notes: ""
    # Guidance: All Class B subagent spawns per T2.1/T2.2/T2.3 in
    # class-b-agent-spawn-preamble.template.md. Haiku for file-existence-checks / log-scans /
    # grep / pnpm verify analysis. ~40-60% context savings vs Opus spawns.

  boundary_signal:
    value: IMPL_BATCH
    developer_notes: ""
    # Guidance: Switch at IMPL_BATCH boundary only — never mid-task (R2 caveat: mid-task
    # switch invalidates Anthropic prompt cache; full re-read cost). IMPL_BATCH = natural
    # break between independent work units.

  compact_threshold:
    value: 0.75
    developer_notes: ""
    # Guidance: /compact <focus> when context >75% — before pressure hits. With 1M context
    # this rarely fires; with 200K would fire frequently. Focus arg: preserve governance state
    # + active scope + carry-forwards.

  haiku_triggers:
    value: [file-existence-check, log-scan, structured-fetch, grep-heavy, verify-analysis, git-status-read]
    developer_notes: ""
    # Guidance: Any T2.x spawn from class-b-agent-spawn-preamble.template.md. If task is
    # "find X" or "check if Y exists" or "run verify and return results" → Haiku.

  opus_triggers:
    value: [engraving, pcr-non-trivial, zf-synthesis, adr-authoring, architectural-decision, honest-self-audit, new-b-star-contract]
    developer_notes: ""
    # Guidance: Per §2 decision tree QG1. If you find yourself on Sonnet attempting to write
    # a new behavioral contract or ratify a decision → stop + switch to Opus first.

  session_switch_budget:
    value: max-2-per-session
    developer_notes: ""
    # Guidance: 1 switch to Opus (engraving) + 1 switch back = 2 /model commands maximum.
    # If you're switching more than twice, consolidate Opus work into one IMPL_BATCH.
    # Batching is better than interleaving (cache rebuild is costly).

  pe_alignment:
    value: band-1-opus, band-2-sonnet, band-3-sonnet-or-haiku, band-4-haiku
    developer_notes: ""
    # Guidance: PE bands map to model tiers. Band 1 critical/engraving → Opus. Band 2
    # high-priority build → Sonnet. Band 3 medium → Sonnet (or Haiku if purely mechanical).
    # Band 4 deferred → Haiku acceptable. Full PE-routing integration → S011 topic-plan.
```

---

```yaml
profile_id: quality-first
group: maximum-quality
description: Opus throughout — zero model switching. Use for constitutional sessions / major governance ratifications.
is_default: false

settings:

  main_session_default:
    value: claude-opus-4-7[1m]
    developer_notes: ""
    # Guidance: Use when the ENTIRE session is high-stakes reasoning — e.g., major ADR
    # authoring, core-spine amendments, platform DNA changes. Accepts higher cost for
    # zero risk of inadvertent Sonnet reasoning on load-bearing decisions.

  engraving_model:
    value: claude-opus-4-7[1m]
    developer_notes: ""
    # Same as main — no switch needed. Cache stays warm throughout session.

  spawn_default:
    value: claude-sonnet-4-6
    developer_notes: ""
    # Guidance: Even in quality-first, spawns for file checks can be Sonnet (not Opus).
    # Haiku acceptable for pure read-only ops. QG2 still applies — spawns return findings,
    # main synthesizes.

  boundary_signal:
    value: none
    developer_notes: ""
    # No switching — session opens and closes on Opus. Simplest session pattern.

  compact_threshold:
    value: 0.80
    developer_notes: ""
    # Slightly higher threshold — Opus 1M has more working room before pressure.

  haiku_triggers:
    value: [file-existence-check, log-scan, structured-fetch]
    developer_notes: ""
    # Only true mechanical read-only ops use Haiku even in quality-first profile.

  opus_triggers:
    value: [everything-in-main]
    developer_notes: ""

  session_switch_budget:
    value: 0
    developer_notes: ""
    # Zero /model commands — opens on Opus, closes on Opus. Maximum session simplicity.

  pe_alignment:
    value: all-bands-opus
    developer_notes: ""
    # Quality-first ignores cost-based PE tier routing — quality over cost for all bands.
    # Use sparingly; reserve for ADR-class decisions.
```

---

```yaml
profile_id: cost-optimized
group: maximum-savings
description: Sonnet main; Haiku for all possible spawns; Opus absolutely minimized. For exploration / research sessions with no engraving.
is_default: false

settings:

  main_session_default:
    value: claude-sonnet-4-6[1m]
    developer_notes: ""
    # Guidance: Same as development-balanced — the difference is Opus is avoided entirely.
    # Use only when you know the session will NOT have engraving moments.

  engraving_model:
    value: claude-opus-4-7[1m]
    developer_notes: ""
    # Guidance: Even cost-optimized CANNOT skip Opus for engraving (QG1 IMMUTABLE).
    # If engraving is needed mid-session → switch + accept the cost.

  spawn_default:
    value: claude-haiku-4-5-20251001
    developer_notes: ""

  boundary_signal:
    value: IMPL_BATCH
    developer_notes: ""

  compact_threshold:
    value: 0.65
    developer_notes: ""
    # More aggressive compaction — stay lean to avoid any overhead.

  haiku_triggers:
    value: [file-existence-check, log-scan, structured-fetch, grep-heavy, verify-analysis, git-status-read, simple-reads, cross-ref-resolution]
    developer_notes: ""
    # Broader haiku trigger set than development-balanced — delegate more aggressively.

  opus_triggers:
    value: [engraving-only]
    developer_notes: ""
    # Sonnet handles PCR / ZF-interpretation / architectural discussion in this profile.
    # Accepts slightly lower quality on reasoning-adjacent (non-canonical) outputs.

  session_switch_budget:
    value: 0-or-1
    developer_notes: ""
    # 0 if no engraving; 1 switch if engraving unavoidable.

  pe_alignment:
    value: band-1-opus-only, bands-2-3-4-sonnet-or-haiku
    developer_notes: ""
```

---

### How to set a profile as default

1. Set `is_default: true` on your chosen profile; `false` on all others in this section
2. Update [settings.json](../../../.claude/settings.json) `"model"` field to match `main_session_default.value`
3. Author your T4 per-session model-budget plan citing the active `profile_id`
4. Validator `model-routing-profile-consistency` (week-4 S012) will verify settings.json `model` matches active profile's `main_session_default`

### PE engine alignment (Phase 1 — documented; Phase 2 — S011 topic-plan)

Per Governor S010 directive — Priority Engine (5-dim formula + 4 bands) should incorporate model-routing as a planning dimension:

| PE Band | Work type | Model tier (development-balanced profile) |
|---|---|---|
| Band 1 — Critical / Engraving | B_* amendments / ADRs / constitutional decisions | Opus 4.7 |
| Band 2 — High-priority build | Template authoring / YAML edits / hook scripts | Sonnet 4.6 |
| Band 3 — Medium / Enhancement | File reorganization / cleanup / cross-ref updates | Sonnet or Haiku |
| Band 4 — Deferred / Future | Research / exploration / scan-only passes | Haiku |

**Full PE-model-routing integration** (connecting the 5-dim formula to model-tier selection) is a carry-forward to S011 as a dedicated topic-plan. Phase 1 (this section) documents the intent; Phase 2 will engrave the formula extension + validator enforcement.

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
- [depth-discipline.md](./depth-discipline.md) — depth markers consumed by PE.read_budget (Phase 9 / S012)
- [audit-runner.md](./audit-runner.md) — 8 validators registered atomic (S005 + S007 + S009)
- [Anthropic prompt caching docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — 5-min TTL + cache breakpoint mechanics (referenced; not refetched this session)
- EXT-20260505-005-A — CSP file #5 unified principle (savings + SSoT)

**Dashboard signature:** `S009-AI-model-routing-dashboard-v1.0-2026-05-05`
