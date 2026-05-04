---
id: csps.handoff.vault.topic-plan.token-optimization
name: token-optimization
description: Topic-plan instance for token consumption optimization in CSPS. Depth-5 (sophisticated narrow). Opened S007 turn 2; Phase 1 measurement complete. Implements the 10-phase optimal-order plan specified in `pillar-0-governance/token-optimization.md` v0.3 §9. Composes with B_GRADUAL_BUILD_BY_FOUNDATIONS + P-META-009 CCA + extends B_COGNITIVE_CONTEXT_DISCIPLINE via new B_TOKEN_BUDGET contract (Phase 3). Phase 1 (measurement) MUST run before any optimization claims per RZF discipline — DONE.
version: 0.2
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_version: 1.0
template_status: novel-pending-pattern-evaluation
core_spine: AI
core_spines: [AI, GVRN, OPER, VALD]
schema_anchor: topic_plan_instance
tags:
  - domain:ai
  - domain:governance
  - type:how-to
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: how-to
session: S007
opened_at_session: S007
opened_at_turn: 2
topic_id: token-optimization
priority_score: 80
priority_band: 2
multi_session_arc: [S007, S008, S009, S010, S011, S012]
depth_chosen: 5
depth_rationale: |
  Sophisticated narrow because:
  (a) high leverage — affects every CSPS session forever (foundation reads + recurring cycles);
      Phase 1 baseline confirms: handoff-write 117K / engraving 110K / architectural-decision 90K
      tokens per cycle — multipliers across 100s of sessions
  (b) cross-spine — touches all 5 Core Spines (GVRN context discipline / ARCH file structure /
      AI cognitive context / OPER session lifecycle / VALD measurement validators)
  (c) reversibility — moderate (file splits reversible but disruptive; hooks reversible easily;
      subagent routing reversible)
  (d) multi-tenant scaling impact — direct (every app graduating from CSPS inherits the discipline)
  (e) enterprise-alignment lens — load-bearing (token-cost-per-session is auditable + trackable)
  (f) pattern absorbed from CSP after 4-council synthesis (Perplexity + GPT + Gemini + Claude AI
      converged in CSP_STANDARD_TOKEN_BUDGET_GOVERNANCE; absorbed v0.2/v0.3)
backtrack_register:
  - trigger-id: phase-1-measurement-shows-different-priorities
    action: Phase 2 element-review re-prioritizes 7 strategies via priority-engine 5-dim formula
  - trigger-id: hook-self-test-fails-at-session-start
    action: cruel-critic Critique 2 mitigation; surface offending hook + repair before Phase 5 close
  - trigger-id: skill-trigger-collision-detected
    action: cruel-critic Critique 3 mitigation; rewrite skill descriptions; ≥30% keyword overlap = anti-pattern
  - trigger-id: file-split-breaks-codegen
    action: rollback split + restore monolithic; surface as enhancement candidate
  - trigger-id: claudeignore-excludes-critical-file
    action: Phase 4 test scenario coverage catches; remove offending pattern
  - trigger-id: anthropic-tokenizer-claude-ratio-significant
    action: re-measure with @anthropic-ai/tokenizer once mature; recalibrate baseline; surface ratio in Phase 2
links:
  - { rel: parent, href: ./README.md }
  - { rel: source-analysis, href: ../../../pillar-0-governance/token-optimization.md }
  - { rel: composes-cca, href: ../../../pillar-0-governance/cognitive-context-architecture.md }
  - { rel: phase-1-baseline, href: ../token-cost-baseline-S007.json }
  - { rel: element-review, href: ../element-reviews/token-optimization-S007.md }
  - { rel: governor-prompts, href: ../governor-prompts/S007.md }
muv_audit:
  required_sections_present: PASS (§1-§10 populated)
  alignment_questions_count: 0 (internal sequencing; cross-chat handshake at session close)
---

# Topic Plan — Token Optimization (ACTIVE; opened S007 turn 2)

> **STATUS:** Phase 1 measurement baseline COMPLETE (S007 turn 2). Phase 2 element-review next. Full v0.3 plan in [`pillar-0-governance/token-optimization.md`](../../../pillar-0-governance/token-optimization.md) §9 (10-phase optimal order); this instance executes that plan per gradual-build-plan template.

## Phase summary (per token-optimization.md v0.3 §9)

| Phase | Focus | Depends on | Est. session cost | Status |
|---|---|---|---|---|
| 1 | Baseline measurement | nothing | 0.3-0.5 | ✅ DONE S007 turn 2 |
| 2 | Element-review (gap analysis + priority placement) | Phase 1 | 0.3 | ⏳ NEXT |
| 3 | B_TOKEN_BUDGET 5/5 atomic engraving (CONTRACT-FIRST) | Phase 2 | 0.5-0.7 | pending |
| 4 | AGENTS.md slim + 10 skills + .claudeignore | Phase 3 | 1-2 | pending |
| 5 | Hook migration (7 hooks per migration table) | Phase 4 | 1 | pending |
| 6 | Subagent + Haiku tiering | Phase 5 | 0.5-1 | pending |
| 7 | File splitting (principles.yaml + behavioral-contracts + audit-runner + ai-behavior-spine) | Phase 4 + 6 | 4-8 | pending |
| 8 | principles-mcp build (CCA Layer 4 activation) | Phase 7 | 1-2 | pending |
| 9 | Context-loading templates + orchestrator hook | Phase 8 | 0.5-1 | pending |
| 10 | Compaction discipline + MCP audit + measurement validator + continuous validation | Phase 9 | 0.5-1 | pending |

**Total arc: 5-8 sessions (S007 → S012 typical; per CSP cruel-critic Critique 5 absorbed).**

---

## §1 Foundation primitives (Level 1) — depends on: nothing

**Maps to v0.3 Phases 1+2 (measurement baseline + element-review).**

| Path | Purpose | Core Spine | Status |
|---|---|---|---|
| [tools/measure-token-cost.mjs](../../../../tools/measure-token-cost.mjs) | Tokenization + per-scenario aggregation script | VALD | ✅ S007 turn 2 |
| [tools/scenarios/](../../../../tools/scenarios/) | 8 scenario JSONs declaring per-task-class loaded artifacts | VALD | ✅ S007 turn 2 |
| [token-cost-baseline-S007.json](../token-cost-baseline-S007.json) | Phase 1 baseline output (53 artifacts × 8 scenarios = 565K aggregate tokens) | VALD | ✅ S007 turn 2 |
| `package.json#scripts.tokens:measure` | `pnpm tokens:measure` orchestrator | OPER | ✅ S007 turn 2 |
| `package.json#devDependencies.gpt-tokenizer` | Tokenizer dep (cl100k_base; Claude approximation ±5-10%) | OPER | ✅ S007 turn 2 |
| [token-optimization-S007.md](../element-reviews/token-optimization-S007.md) | Phase 2 element-review (depth-3) — §1 state-of-art populated; §2/§3 next turn | GVRN | ⏳ §1 done; §2/§3 next turn |

**Exit criteria (L1 → L2 gate):**
- [x] Measurement script runs cleanly (`pnpm tokens:measure` exit 0)
- [x] Baseline JSON committed; values measured (not estimated)
- [x] All 8 scenarios captured (0 missing artifacts of 52 declared)
- [x] Per-scenario totals documented in element-review §1 state-of-art
- [ ] Phase 2 §2/§3 (gap analysis + priority placement) authored — next turn
- [x] `pnpm verify` exit_code 0

**L1 ZF status:** Phase 1 portion ZF-clean; Phase 2 §1 ingestion clean. §2-§3 author next turn before L1→L2 transition.

---

## §2 Foundation composition (Level 2) — depends on: L1

**Maps to v0.3 Phase 3 (B_TOKEN_BUDGET 5/5 atomic engraving — CONTRACT-FIRST DISCIPLINE).**

| Surface | Artifact | Action | Atomic-mandatory |
|---|---|---|---|
| Schema | `packages/principles/principles.yaml#P-META-009.config` | AMEND — extend with §13 token_budget_operating_rules subsection (5 rules verbatim) | yes |
| Validator (atomic registration) | `docs/plan/pillar-0-governance/audit-runner.md` | ADD — 5 audit slugs (token-budget-claude-md-size / token-budget-skills-completeness / token-budget-hook-presence / token-budget-compact-frequency / token-budget-cache-continuity) | yes (impl deferred week-4) |
| Hook stub | `.claude/hooks/verify-hooks-functional.sh` | ADD — SessionStart self-test stub (cruel-critic Critique 2) | yes |
| Memory | `feedback_token_budget.md` + MEMORY.md index | ADD | yes |
| Contract | `docs/plan/pillar-0-governance/behavioral-contracts.md § B_TOKEN_BUDGET` + `AGENTS.md` hard NO + `ai-behavior-spine.md` row | ADD (extends B_COGNITIVE_CONTEXT_DISCIPLINE) | yes |

**Why phase 3 (not later):** subsequent work needs the contract ratified to be governance-anchored. CSPS DNA: "foundations first; rest of system benefits."

**Exit criteria (L2 → L3 gate):**
- [ ] `pnpm verify` exit_code 0 (53 → 53 principles; P-META-009 extended; behavioral contracts 25 → 26)
- [ ] All 5 audits atomic-registered per FSE (impl deferred week-4)
- [ ] AGENTS.md hard NO present + cross-referenced
- [ ] Spine matrix row added
- [ ] User ratification of B_TOKEN_BUDGET contract content (5 operating rules)

---

## §3 Core (Level 3) — depends on: L2

**Maps to v0.3 Phases 4+5 (AGENTS.md slim + skills + .claudeignore + hooks migration).**

| Surface | Artifact | Action |
|---|---|---|
| Backup | `AGENTS.md.original` | ADD (preserve current 193-line state) |
| Slim | `AGENTS.md` (target <200 lines / ~500 tokens) | REWRITE per CSP standard (project identity / build commands / absolute prohibitions / skill pointers / compact instructions only) |
| Skills | `.claude/skills/<10-skills>/SKILL.md` | ADD (existing 7 + 3 new per Phase 4 list) |
| Ignore | `.claudeignore` | ADD (exclude `_intake/processed/` / `governor-prompts/S001-S005.md` / `closing-summary-S001-S005.md`) |
| Hooks | `.claude/hooks/*.sh` (7 scripts per §14.4 migration) | ADD per UserPromptSubmit / PreToolUse / PostToolUse / PostStop |
| Test | 10-scenario over-compression test (§14.5) | RUN (≥9/10 PASS) |

**Exit criteria (L3 → L4 gate):**
- [ ] AGENTS.md word count <500 (mechanical: `wc -w AGENTS.md`)
- [ ] 10 skills present + valid AAP frontmatter (`aap_frontmatter_coverage` PASS)
- [ ] `.claudeignore` syntactically valid; tested (no critical files excluded)
- [ ] 10-scenario test ≥9/10 PASS
- [ ] 7 hooks executable + tested via test commit
- [ ] SessionStart self-test fires + reports all-hooks-functional
- [ ] Token reduction measured >40% vs Phase 1 baseline (via re-running `pnpm tokens:measure`)

---

## §4 Integration + cross-layer audits (Level 4) — depends on: L3

**Maps to v0.3 Phases 6+7+8 (subagents + file-splitting + principles-mcp).**

| Surface | Artifact | Action |
|---|---|---|
| Subagent | `.claude/settings.json#CLAUDE_CODE_SUBAGENT_MODEL` | SET haiku |
| Subagent | 3 heavy ops (ZF cycle / validator suite / file scan) | DELEGATE to Haiku subagents |
| Splits | `principles.yaml` → `packages/principles/principles/<P-XXX-NNN>.md` | SPLIT (highest leverage; 85K → 5K) |
| Splits | `behavioral-contracts.md` → per-contract files | SPLIT (48K → 3K) |
| Splits | `audit-runner.md` → per-pipeline files | SPLIT (30K → 5K) |
| Splits | `ai-behavior-spine.md` → per-discipline files | SPLIT (10K → 1K) |
| MCP | `packages/principles-mcp/src/index.ts` | IMPLEMENT (replace skeleton) |
| MCP | Query API (get / list / find_by_enforcer / find_by_spine) | ADD |

**Exit criteria (L4 → L5 gate):**
- [ ] All 4 splits with cross-ref-resolution PASS + codegen emits identical AGENTS.md
- [ ] AAP Class B preamble injected at every subagent spawn
- [ ] Mid-session context growth reduced >40% measured
- [ ] `pnpm --filter @csps/principles-mcp build` succeeds
- [ ] Per-MCP-query token cost <5K (vs ~85K full load) — measured

---

## §5 Polish + observability + drift detection (Level 5) — depends on: L4

**Maps to v0.3 Phases 9+10 (context-loading templates + orchestrator + compaction + measurement validator + continuous validation).**

| Surface | Artifact | Action |
|---|---|---|
| Templates | `tools/templates/context-loading/<task-class>.json` × 8+ | ADD |
| Registry | `template-registry.md` §6 (NEW section) | ADD |
| Hook | `.claude/hooks/user-prompt-submit-context-orchestrator.sh` | ADD (detects task-class + injects slices) |
| Telemetry | `_handoff/VAULT/token-cost-history.jsonl` (append-only) | INIT |
| Validator | `tools/validators/validate-token-budget.mjs` (5-mode per §14.6) | IMPLEMENT |
| Audit | `token-consumption-budget-respected` registered atomic in audit-hub Pipeline 10 | REGISTER |
| Recurring | weekly `/usage` audit + per-quarter alignment-drift-over-time | SCHEDULE |

**Exit criteria (L5 → topic-plan close):**
- [ ] Cumulative savings >50% vs Phase 1 baseline (cruel-critic Critique 1 — measurement-driven not claimed)
- [ ] `validate-token-budget.mjs` 5 modes all PASS
- [ ] Audit registered + cross-referenced bidirectionally
- [ ] Recurring task active + first run completed
- [ ] §10 attestation block signed

---

## §6 Priority Engine — inputs for level placement

```yaml
priority_engine:
  topic_id: token-optimization
  depth_chosen: 5
  depth_rationale: see frontmatter depth_rationale
  inputs_per_level:
    L1_foundation:
      leverage: 9
      dependency_satisfied: 1 (governance-foundation closed S006)
      reversibility: 10 (script + JSONs trivially removable)
      risk_of_rework: 2 (low; baseline deltas re-measurable)
      multi_session_cost: 0.5
      priority_score: 80
    L2_composition:
      leverage: 9
      dependency_satisfied: 1 (after L1 ZF)
      reversibility: 7 (B_TOKEN_BUDGET amendable; engraving harder to retract)
      risk_of_rework: 4
      multi_session_cost: 0.5-0.7
      priority_score: 78
    L3_core:
      leverage: 10 (the dominant lever — 60-80% baseline savings claim)
      dependency_satisfied: 1 (after L2 contract ratified)
      reversibility: 6 (AGENTS.md slim is reversible via backup)
      risk_of_rework: 5 (10-scenario test may flag skill-trigger collisions)
      multi_session_cost: 2-3
      priority_score: 85
    L4_integration:
      leverage: 8
      dependency_satisfied: 1 (after L3)
      reversibility: 4 (file splits disruptive but reversible)
      risk_of_rework: 6 (codegen aggregation logic edge cases)
      multi_session_cost: 4-8
      priority_score: 70
    L5_polish:
      leverage: 7
      dependency_satisfied: 1
      reversibility: 8
      risk_of_rework: 3
      multi_session_cost: 1-2
      priority_score: 65
  ranked_next_layers:
    1: L1 (DONE; Phase 1+2 in flight)
    2: L2 (after L1 ZF; B_TOKEN_BUDGET CONTRACT-FIRST)
    3: L3 (after L2 ratification; biggest lever per cruel-critic)
    4: L4 (after L3 measured success ≥40%)
    5: L5 (after L4 cumulative ≥50%)
  push_back_log:
    - rejected_attempt: "Skip Phase 1 measurement; estimate from CSP standard"
      reason: cruel-critic Critique 1 — "60-80% claim is unverified"; B_VALIDATE_BEFORE_ASSUME requires measurement
    - rejected_attempt: "Open Phase 3 contract before Phase 2 element-review"
      reason: Foundation-stability discipline (P-META-016); contract must be informed by gap analysis
    - rejected_attempt: "Author B_TOKEN_BUDGET as new principle"
      reason: extends P-META-009 CCA per v0.3 §14.4 — no parallel structures
```

---

## §7 Cross-layer audits (mandatory)

| Audit slug | What it catches | Pipeline |
|---|---|---|
| `token-budget-claude-md-size` | AGENTS.md > 500 tokens / 200 lines | 10 csps-alignment |
| `token-budget-skills-completeness` | Governance domain without backing skill | 10 csps-alignment |
| `token-budget-hook-presence` | Declared rule without backing hook script | 10 csps-alignment |
| `token-budget-compact-frequency` | Session lacking /compact at IMPL_BATCH boundary | 10 csps-alignment |
| `token-budget-cache-continuity` | Mid-session model switch detected | 10 csps-alignment |
| `cross-ref-resolution` | Broken inbound references after file split | 1 governance |
| `principles_validate-aggregation` | Codegen produces non-identical AGENTS.md before/after split | 1 governance |
| `aap_frontmatter_coverage` | New skill missing AAP frontmatter | 1 governance |
| `subagent-spawn-preamble-required` | Class B subagent invocation without alignment preamble | 4 agent-alignment |
| `token-consumption-budget-respected` | Session loading exceeds N% of token budget | 3 cognitive-context-discipline |

---

## §8 Backtrack triggers register

(See frontmatter `backtrack_register:` — same content; redundant for human-readable.)

| Trigger | What surfaces it | Action |
|---|---|---|
| phase-1-measurement-shows-different-priorities | Phase 2 element-review ranking | Re-prioritize 7 strategies via PE 5-dim |
| hook-self-test-fails-at-session-start | Phase 5 SessionStart self-test | Surface offending hook + repair |
| skill-trigger-collision-detected | 10-scenario over-compression test | Rewrite skill descriptions; ≥30% keyword overlap = anti-pattern |
| file-split-breaks-codegen | `principles_validate` after Phase 7 split | Rollback split; restore monolithic |
| claudeignore-excludes-critical-file | Phase 4 test scenario coverage | Remove offending pattern |
| anthropic-tokenizer-claude-ratio-significant | v0.2 script comparison run | Recalibrate baseline |

---

## §9 Subsequent-turn engraving execution sequence

| Turn | Level | Phase(s) | Work | Files touched (est.) |
|---|---|---|---|---|
| S007 turn 2 | L1 | 1 | Measurement infra: script + 8 scenarios + baseline JSON + topic-plan opening + element-review §1 | 13 (incl. this file) |
| S007 turn 3+ OR S008 | L1 | 2 | Element-review §2 (gap analysis) + §3 (priority placement) + L1 ZF gate | ~3 |
| S008 OR S009 | L2 | 3 | B_TOKEN_BUDGET 5/5 atomic engraving (extends P-META-009) | ~7 |
| S009-S010 | L3 | 4 | AGENTS.md slim + 3 new skills + .claudeignore + 10-scenario test | ~15 |
| S010 | L3 | 5 | 7 hook scripts + SessionStart self-test | ~8 |
| S010-S011 | L4 | 6 | Subagent + Haiku tiering | ~3 |
| S011-S012 | L4 | 7 | 4 file splits (principles / contracts / audit-runner / ai-behavior-spine) | ~50+ (split outputs) |
| S012 | L4 | 8 | principles-mcp build + AAP frontmatter | ~5 |
| S012 OR S013 | L5 | 9+10 | Context-loading templates + orchestrator hook + 5-mode validator + audit registration + history.jsonl | ~12 |

**Discipline:** if a turn cannot complete a phase, split phase across turns; never start L+1 before L ZF passes.

---

## §10 Topic-plan attestation (L0)

```yaml
topic_plan_zf:
  ran_at: 2026-05-04T18:40:00Z
  cycles_run: 1 (Phase 1 measurement baseline)
  findings:
    - finding: "All 8 scenarios captured + 0 missing artifacts of 52 declared (clean)"
    - finding: "handoff-write 117K tokens — most expensive recurring scenario"
    - finding: "engraving 110K tokens — second highest; B_* engraving cost dominated by principles.yaml + behavioral-contracts.md + audit-runner.md inclusion"
    - finding: "Aggregate 565K tokens across 8 scenarios — strongly motivates Phase 7 file-splitting (principles.yaml + behavioral-contracts.md + audit-runner.md are the dominant cost contributors)"
    - finding: "Tokenizer caveat: gpt-tokenizer cl100k_base ±5-10% vs Claude native; v0.2 script can switch to @anthropic-ai/tokenizer when 0.0.4 matures"
  status: ZF-0-ACHIEVED-CYCLE-1 (Phase 1)
  signature: S007-AI-topic-plan-attest-2026-05-04T18:40:00Z-token-optimization-L1-Phase-1
```

**Phase 2 attestation will append at next turn after element-review §2-§3 + L1→L2 gate ZF.**

---

**Topic-plan signature:** `S007-AI-token-optimization-active-2026-05-04T18:40:00Z (OPENED; Phase 1 DONE; Phase 2 next)`
