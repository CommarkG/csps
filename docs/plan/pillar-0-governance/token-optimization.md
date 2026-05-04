---
id: csps.pillar-0-governance.token-optimization
name: token-optimization
description: Comprehensive analysis + multi-session plan for token consumption optimization in CSPS. Covers models in use / dynamic adjustment / recurring cycles / file optimization (monolithic vs depth-aware) / orchestrator design / platform integration / phased rollout. Authored S006 turn 26 user directive. DRAFT — awaits external content + insights before ratification + topic-plan opening. Per CCA P-META-009 (Cognitive Context Architecture) + CSPS DNA "quality + holistic context > immediate savings" framing.
version: 0.1
last_update_session: S006
last_update_turn: 26
owner: group:finky
authored_by: AI (Claude Opus 4.7 main thread) at user direction S006 turn 26
creator: Yariv Fink (platform owner; CSPS architect)
lifecycle: production
lifecycle_state: pending-review
next_review_at: 2026-08-01
template_used: pillar-leaf
template_status: novel-pending-pattern-evaluation
core_spine: AI
core_spines: [AI, GVRN, OPER, VALD]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:ai
  - domain:governance
  - type:explanation
  - type:how-to
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: explanation
session: S006
links:
  - { rel: parent, href: ./README.md }
  - { rel: cognitive-context-architecture, href: ./cognitive-context-architecture.md }
  - { rel: csps-build-dna, href: ./csps-build-dna.md }
  - { rel: principles, href: ../../../packages/principles/principles.yaml }
  - { rel: priority-engine-schema, href: ../../../tools/templates/priority-engine.schema.yaml }
  - { rel: trigger-source, href: ../_handoff/VAULT/governor-prompts/S006.md }
---

# Token Optimization — CSPS Comprehensive Analysis + Plan

> **Authored by AI (Claude Opus 4.7) at user direction S006 turn 26.**
> **Creator + Platform Owner:** Yariv Fink ([@CommarkG](https://github.com/CommarkG)).
>
> **Status:** DRAFT — captures the as-of-S006-close analysis. Awaits external content + insights before ratification + topic-plan opening for execution. Per user directive *"prepare a comprehensive md draft file on this matter and optimization in this platform"* (S006 turn 26) + prior directive *"do not implement anything yet — wait for external additional content and insights"* (S006 turn 25).

---

## §1 Executive summary

CSPS today: **single-model main thread (Opus 4.7), undifferentiated context loading, monolithic governance files, no orchestrator, 0 mechanical enforcement on declared CCA + model-routing disciplines.**

**Estimated foundational read cost per fresh session: ~258K tokens** when loading all governance artifacts (principles.yaml ~85K + behavioral-contracts ~48K + audit-runner ~30K + memory ~42K + HANDOFF ~32K + ai-behavior-spine ~10K + AGENTS ~9.5K + MEMORY.md ~1.5K). This dwarfs the per-turn working budget.

**Single highest-leverage opportunity:** the platform has the building blocks (3-layer doctrine model + principles-mcp skeleton + CCA 5-layer architecture + templates registry + audit-hub Pipeline 3) but they are **declared, not running**. The orchestrator that connects them is what's missing.

**Cardinal directive guiding this work** (per [user-intents.md](../../_handoff/VAULT/user-intents.md) S005 turn 21):

> *"There are some who value savings... I am not. I prioritize quality and holistic context and solutions serving me for the long run over immediate saving."* — engraved as P-META-009 + B_COGNITIVE_CONTEXT_DISCIPLINE + 4 immutable Quality Gates.

**Implication:** token optimization here is NOT cost minimization. It is **quality preservation** — when monolithic loads consume the budget, working-context for actual reasoning shrinks. The optimization is about **investing tokens where reasoning quality compounds** + **not paying for slices that aren't load-bearing for the current task**.

---

## §2 Why this matters (motivation + context)

### 2.1 The compounding cost

Foundation reads happen **every session**, often **multiple times per session** (cache invalidation on content edits per QG4). A 50K-token reduction in foundational load saves:
- ~50K tokens × N sessions = N × 50K total
- Plus: smaller foundation = larger working context = better reasoning per-turn
- Plus: faster responses (less to process before generating)

### 2.2 The quality dimension (load-bearing for CSPS DNA)

When foundation load + recurring cycles consume too much budget:
- Working context for actual reasoning shrinks
- AI may compress synthesis to fit (anti-pattern per QG2 — synthesis stays in main)
- Subagent delegation tempts (anti-pattern when synthesis is needed)
- Quality gates are violated NOT because of malice, but because the budget forces it

**The optimization protects quality, not just cost.**

### 2.3 The architectural opportunity

CSPS S006 closed governance-foundation with substantial engravings (45 → 53 principles; 18 → 25 B_* contracts; 9 → 10 audit-hub pipelines; 0 → 5 sealed L1_CORE files; 0 → 5 LIVE templates). The platform's **expressive capacity is high; its loading discipline is low**. This is the right moment to address loading — before week-2+ build expands the monolithic files further.

### 2.4 What this document is + isn't

| Is | Isn't |
|---|---|
| Analysis of current state with measurements + gaps | Implementation plan ready to execute |
| Strategic design for the orchestrator + slice-loading | Validator/hook/skill code |
| Multi-session phased plan for execution | Single-turn engraving directive |
| Reference for future topic-plan(s) | Replacement for principles-mcp build (which proceeds week-2 per build-order) |
| Composes with CCA / model-routing / template-first / gradual-build engravings | New CSPS principle (no new P-META until this analysis ratifies) |

---

## §3 Models in use (current state inventory)

### 3.1 Per-surface mapping

| Surface | Current model | Engraved discipline | Mechanical enforcement |
|---|---|---|---|
| Main thread (this turn) | **Opus 4.7** | CCA QG1 — hard reasoning never downgrades from Opus | ❌ Declared (P-META-009); validator deferred week-4 |
| Subagents — Class B (Explore / Plan / general-purpose / claude-code-guide / statusline-setup) | Inherit from main OR specify in subagent-definition | AAP Class B preamble (S006 carry-forward to S007) | ⚠️ Preamble template not authored yet; spawn happens without alignment-preamble injection |
| Skills — Class A (CSPS-built; 7 retrofitted) | Inherit OR per-skill `model:` in SKILL.md frontmatter | AAP frontmatter (`csps_aligned` + `model_routing` per skill) | ✅ Frontmatter validates (`aap_frontmatter_coverage` LIVE); ❌ no runtime consumes the routing field |
| Mastra BaseAgent — Class C (runtime agents) | Not built yet (week-6+) | AAP runtime enforcement at construction | ❌ Runtime week-6+ |
| Third-party imported skills — Class D | Not yet integrated | Tier-gated quarantine → vendored → platform-owned | ❌ Future |

### 3.2 Model selection criteria (declared by P-META-009; not yet automated)

Per cognitive-context-architecture.md:

| Work-class | Required model | Rationale |
|---|---|---|
| **Hard reasoning** (engraving / PCR / ZF synthesis / architectural decisions / cross-pillar synthesis / honest self-audit) | Opus 4.7 (immutable per QG1) | Routing down produces nominal-quality decisions that compound into platform debt |
| **Mechanical edits** (typo fix / single-line refactor / file moves / yaml field renames) | Sonnet 4.6 acceptable | Right-tool-for-job; quality holds |
| **File-existence checks / log scans / structured fetches** | Haiku 4.5 acceptable | Cheapest-tool-for-job |
| **Synthesis** (PCR rendering / ratification / engraving / cross-pillar reasoning / ZF cycle interpretation) | STAYS IN MAIN context (QG2) | Subagents can't see full context; can't synthesize correctly |

### 3.3 Gap (the recurring pattern)

The discipline is **engraved at 5 surfaces** (memory + contract + AGENTS NO + spine row + audit registration) but **0 active mechanical enforcement layers**. Same pattern as most S005-S006 engravings — the validator/hook implementations are deferred to week-4 when audit-runner ships. Until then:

- Main thread model: user-set (per Claude Code `/model` command)
- Subagent model: AI-judgment-driven choice
- No automatic routing
- No measurement of quality regression when wrong model is used

---

## §4 Dynamic model adjustment — current state + gap analysis

### 4.1 Three layers of dynamism (potential vs actual)

| Layer | Potential mechanism | Today |
|---|---|---|
| **Per-session** | `/model` at session-open; CCA-aware default selection per session-class | Manual user choice |
| **Per-task-class** | Routing table by work-type triggers model switch | AI-judgment-driven |
| **Per-tool-call** | PreToolUse hook detects task-class + recommends/enforces model | Not implemented |

### 4.2 The connector blocker

The pieces exist as separate engravings:
- **Hooks layer** can detect (PreToolUse / UserPromptSubmit triggers ready)
- **CCA** defines what routing should look like (per-class table)
- **AAP frontmatter** declares per-agent model (Class A SKILL.md fields)
- **principles.yaml#P-META-009.config** declares routing in YAML

**They don't connect.** No runtime reads CCA's routing table + applies it via Hooks. Mastra BaseAgent (week-6+) is designed to be that connector for Class C agents — but for Class A/B (currently 100% of CSPS work), nothing on the roadmap closes this gap.

### 4.3 Cost of the gap

| Failure mode | Probability | Cost when it happens |
|---|---|---|
| AI (or user) routes hard reasoning to Sonnet/Haiku for cost | Low (CCA discipline known) | HIGH — nominal-quality engraving compounds; hard to detect in-session |
| AI delegates synthesis to subagent (QG2 violation) | Medium (training default) | HIGH — subagent can't see full context; produces partial synthesis |
| Wrong model selection unmeasured | High (no validator) | LOW per-incident; HIGH cumulative |

**Top-expert observation:** the cost is asymmetric. Wrong-model decisions on engraving land permanently in the platform's foundation — they're the worst possible thing to optimize-cost on. Wrong-model decisions on mechanical edits cost almost nothing. The discipline + measurement is what tells the difference.

---

## §5 Recurring token consumption cycles (with measurements + essentiality)

### 5.1 Per-session foundational reads

Approximate token costs (50 tokens/line heuristic; real measurement is Phase 1 work):

| Artifact | Lines | Tokens (est.) | Loaded when | Truly essential? |
|---|---|---|---|---|
| AGENTS.md | ~190 | ~9,500 | Every session-open | ✅ YES — foundational rules; cannot lazy-load |
| principles.yaml | ~1,700 | **~85,000** | Auto-loaded by `principles_validate` cycle + AI references | ⚠️ MOSTLY — but rarely all 53 needed at once |
| behavioral-contracts.md | ~970 | ~48,500 | AI references during engraving / PCR / decisions | ⚠️ Selective use; full load not always needed |
| audit-runner.md | ~590 | ~29,500 | AI references during FSE atomic registration | ⚠️ Index needed; per-row rarely |
| ai-behavior-spine.md | ~205 | ~10,250 | Reference; rarely whole | ❌ MOSTLY NOT — usually 1-2 rows needed |
| Memory files (~29 entries) | ~840 total | ~42,000 | Auto-loaded by Claude Code at session-open | ✅ YES (cognitive layer); ⚠️ could be relevance-ranked + lazy-loaded |
| HANDOFF current | ~700-1,500 | ~32,000 | Session-open Zone A/B/C/D | ✅ Zone A/B essential; ⚠️ Zone D rarely needed in-session |
| MEMORY.md (index) | ~30 | ~1,500 | Session-open | ✅ YES |
| **TOTAL FOUNDATIONAL** | **~4,500 lines** | **~258,250** | — | **Mixed essentiality** |

### 5.2 Mid-session recurring cycles

| Cycle | Trigger | Token cost | Essential? |
|---|---|---|---|
| QG3 mid-session edited file re-read | Per Edit/Write tool call | 200-2,000 tokens × N edits | ✅ YES — per memory feedback_validate_before_assume.md; QG3 is immutable |
| `pnpm verify` output | Per closing-summary §10.0 + per-level ZF gate | ~500-1,500 tokens per run | ✅ YES — re-run IS the proof per RZF |
| Tool call results | Per Read/Grep/Bash | 50-5,000 tokens per call | ✅ Mostly — but Read of monolithic files is wasteful (loading 1,700 lines to find P-META-018) |
| MEMORY.md re-load | Mid-session reminders trigger | ~1,500 tokens | ⚠️ Loaded at start; mid-session reload sometimes redundant |
| TodoWrite reminders | System reminder appears every N tool calls | ~50-200 tokens each | ❌ NOT essential — stale-todo detection could be smarter |

### 5.3 Per-event cycles

| Cycle | When | Essential? | Avg tokens |
|---|---|---|---|
| FSE 5-surface walk | New B_*/P-* engraving | ✅ ESSENTIAL | ~3-8K |
| RZF cycle | DONE/RATIFIED claim | ✅ ESSENTIAL | ~2-5K |
| CEC walk | Ratification | ✅ ESSENTIAL | ~5-15K |
| HPFA whole-session walk | Pre-handoff | ✅ ESSENTIAL | ~10-25K |
| Inner-defaults leak detection | Closing-summary §10.0h | ✅ ESSENTIAL | ~3-8K |
| Element-review depth-3 walk | Ad-hoc (when elemental review triggered) | ✅ ESSENTIAL | ~10-30K |
| MUV cross-chat handshake | Session boundary | ✅ ESSENTIAL | ~5-15K |

### 5.4 The pattern

**Expensive cycles are essential.** They produce ratification, evidence, drift detection — load-bearing platform output.

**Expensive READS are mostly NOT essential.** They pull entire monolithic files when the AI needs only a slice. This is the fixable waste.

Net: the optimization target is the **read pattern**, not the **cycle pattern**.

---

## §6 File optimization — monolithic anti-pattern + slice-loading potential

### 6.1 Current monolithic files (the anti-pattern)

| File | Current shape | Problem | Token saving on slice-load |
|---|---|---|---|
| `principles.yaml` | 53 principles in single ~1,700-line yaml | Need P-META-018? Load all 53. | ~85K → ~5K (94% saving when 1 principle needed) |
| `behavioral-contracts.md` | 25+ B_* sections in ~970-line markdown | Need B_PE_GUARDIAN? Load all 25+. | ~48K → ~3K (94% saving) |
| `audit-runner.md` | ~140 audits in ~590-line table | Need 1 audit slug? Load 140. | ~30K → ~5K (83% saving) |
| `ai-behavior-spine.md` | All disciplines in single table | Need 1 row? Load all rows. | ~10K → ~1K (90% saving) |
| HANDOFFs | Zone A/B/C/D | ✅ Already depth-aware | (already optimized) |

### 6.2 The 3-layer doctrine model precedent

CSPS already proved depth-awareness works:
- **L0 root** (csps-core-manifest.md) — small overview
- **L1 sealed × 5** (one per spine) — sealed essence
- **L2 domain × 16** (3-4 per spine) — operational decomposition
- **L3 instances × 5** (one per spine) — current artifacts

This pattern can apply to ALL monolithic files:

| File | Index level | Slice files |
|---|---|---|
| `principles.yaml` | `principles.yaml` (index of IDs + names + categories) | `principles/<P-XXX-NNN>.md` (full content per principle) |
| `behavioral-contracts.md` | `behavioral-contracts.md` (index of B_* names + 1-line descriptions) | `behavioral-contracts/<B_NAME>.md` (full section per contract) |
| `audit-runner.md` | `audit-runner.md` (index of pipelines + audit counts) | `audit-runner/pipeline-<N>-<name>.md` (full audit list per pipeline) |
| `ai-behavior-spine.md` | `ai-behavior-spine.md` (index of disciplines + status) | `ai-behavior-spine/<discipline>.md` (full row + composition notes) |

### 6.3 Cost of split (real)

Splitting monolithic files has migration cost:
- Every existing inbound reference must update path
- Validators (`cross-ref-resolution`) must scan all references
- Codegen (`principles:codegen`) must aggregate from slice files
- AI must learn new index-then-fetch pattern

**This is multi-session work.** Open as own topic-plan; depth-4; per-week build phase per build-order.md.

---

## §7 Orchestrator design — connecting existing engravings

### 7.1 Concept

```
User prompt arrives
    ↓
UserPromptSubmit hook detects task-class (engraving / PCR / verify / build / docs / ratification)
    ↓
Orchestrator consults context-loading-template registry (NEW; in template-registry §6)
    ↓
Template specifies: for task-class X, load artifacts {A, B, C} at depth-level {1, 2, 3}
    ↓
Hook injects ONLY those slices into AI context (via session-context messages OR system prompt)
    ↓
Other slices remain on disk; lazy-loaded if AI explicitly requests via Read/Grep
    ↓
PostToolUse hook tracks what was actually consumed; updates orchestrator heuristics
```

### 7.2 Building blocks (already in CSPS)

| Block | Status | What's missing for orchestrator integration |
|---|---|---|
| **principles-mcp** (MCP server serving principles) | Skeleton in `packages/principles-mcp/` (week-2 build) | Implementation; expose query API: `principles.get(id)` / `principles.list(category)` / `principles.find(by_enforcer_layer)` |
| **CCA 5-layer architecture** | Engraved as P-META-009 dashboard | No runtime that respects layering (Layer 4 MCP queries on-demand isn't activated) |
| **Templates registry** | LIVE (5 templates) | Doesn't yet include "context-loading templates" — new §6 needed |
| **Audit-hub Pipeline 3 `cognitive-context-discipline`** | Declared atomic in audit-hub | impl week-4 |
| **AAP Class B preamble** | Carry-forward S007 | Template not authored yet |
| **Hooks layer** (PreToolUse / PostToolUse / UserPromptSubmit / Stop / PostStop) | Available in Claude Code | Not yet wired to orchestrator |
| **Frontmatter schema** | LIVE (per-file-type per ADR-0023) | Could include `consumed_by_task_classes:` field for relevance tagging |

### 7.3 Context-loading templates (proposed; new template-registry §6)

| Task-class | Required artifacts | Depth | Tokens (est.) |
|---|---|---|---|
| **engraving-new-discipline** | principles.yaml index + behavioral-contracts.md index + audit-runner.md index + AGENTS.md + relevant memory files | L0 + index-only | ~30K |
| **PCR-rendering** | priority-engine.schema.yaml + behavioral-contracts/B_PCR_FOR_DECISIONS.md + memory feedback_pcr_for_decisions.md | full slice | ~5K |
| **ZF-cycle-on-artifact** | tools/verify.mjs output + relevant validators + closing-summary-template §10.0 | small slice | ~10K |
| **mechanical-edit** | AGENTS.md only | L0 | ~10K |
| **session-open** | OVERVIEW.md + HANDOFF Zone A + AGENTS.md + MEMORY.md index | minimal | ~20K |
| **handoff-write** | All governance artifacts (HPFA whole-session) | full | ~258K |
| **architectural-decision** | csps-core-manifest + relevant L1_CORE + ADR template + relevant ADRs | scoped | ~40K |

### 7.4 Phased rollout

| Phase | What | Reversible? | Mechanical? | Cross-actor? | Recommended path |
|---|---|---|---|---|---|
| **1 — Measure** | Author `tools/measure-token-cost.mjs` — counts tokens per artifact + per loading scenario | ✅ | ✅ | ❌ | Single-turn |
| **2 — Element-review** | Author `_handoff/VAULT/element-reviews/token-optimization-S007.md` (depth-3) using actual measurements | ✅ | ✅ | ❌ | Single-turn after Phase 1 |
| **3 — Split** | Refactor monolithic files into index + per-entry files | ⚠️ Reversible but disruptive | ✅ | ❌ | New topic-plan (depth-4); multi-session arc |
| **4 — Extend principles-mcp** | Build MCP server actually serving query API | ✅ | ✅ | ❌ | Per build-order week-2 (already on roadmap) |
| **5 — Context-loading templates** | New template-registry §6: per-task-type → artifact-set + depth-level | ✅ | ✅ | ❌ | Single-turn engraving once template designed |
| **6 — Hook integration** | UserPromptSubmit hook detects task-class + injects slices | ✅ | ✅ | ❌ | Single-turn after templates ready |
| **7 — Model routing automation** | PreToolUse hook recommends model based on task-class | ✅ | ⚠️ Cross-cutting | ✅ Affects user experience | Multi-session topic-plan; PCR + ratification |
| **8 — Continuous validation** | New audit `token-consumption-budget-respected` registered atomic per FSE | ✅ | ✅ | ❌ | Single-turn engraving |

---

## §8 Composition with existing CSPS principles

This work composes — does NOT replace — existing engravings:

| Existing principle / contract | Composition |
|---|---|
| **P-META-009 / B_COGNITIVE_CONTEXT_DISCIPLINE** | This work activates Layer 4 (MCP queries on-demand) which CCA declares but doesn't run |
| **P-META-015 / B_TEMPLATE_FIRST_CREATION** | Context-loading templates ARE templates per the universal-template-first discipline |
| **P-META-016 / B_GRADUAL_BUILD_BY_FOUNDATIONS** | Phased rollout uses depth-3/4/5 schema; per-phase ZF gates |
| **P-META-019 / B_STRUCTURAL_PREVENTION_DISCIPLINE** | When token-budget exceeded → fix loading structure, not patch the instance |
| **P-ARCH-028 / B_CORE_SPINE_DISCIPLINE** | Slice-loading respects spine attribution (load by core_spine query) |
| **P-ARCH-029 / B_NAMING_POLICY** | Slice files follow naming rules (per-entry artifact = per-topic Rule 3) |
| **P-OPER-001 / B_ZERO_LAPTOP_DEPENDENCY** | Token efficiency improves multi-machine perf (smaller cache to sync) |
| **P-META-006 RZF** | Re-run IS the proof — measurement before optimization |
| **P-META-007 FSE** | Each new discipline (orchestrator / loading templates / measurement validator) hits 5/5 atomic |
| **PE_ALIGNMENT_GUARDIAN (P-META-018)** | Token optimization is a GVRN+AI-spine concern; PE Guardian protects in-flight foundation-slice work from this becoming an immediate distraction |

---

## §9 The detailed multi-session plan (the core of this document)

### 9.1 Plan overview

Token optimization is multi-session work. Per gradual-build-by-foundations (P-META-016), it requires its own topic-plan. **This plan proposes that topic-plan's structure** — depth-4 (multi-domain + moderate cross-actor + moderate rework risk).

**Plan name (proposed):** `topic-plans/token-optimization.md`
**Depth:** 4
**Estimated arc:** 4-6 sessions (S007 → S010 typical)
**Priority band:** HIGH (PE_SCORE 70-80; load-bearing for quality preservation; not BLOCKING because foundation-slices week-2 take precedence per build-order)
**Blocked by:** governance-foundation closure ✅ (achieved S006); foundation-slices week-2 should run in parallel OR before (decision-pending in §11)

### 9.2 Phase 1 — Measurement baseline (foundation primitives)

**Depends on:** nothing
**Estimated session cost:** 0.5 (single-turn-ish)

**Artifacts to author:**
- `tools/measure-token-cost.mjs` — counts tokens per artifact via tiktoken / approximated tokenizer; outputs per-artifact + per-loading-scenario JSON
- `tools/scenarios/session-open-load.json` — declares what gets loaded at session-open
- `tools/scenarios/engraving-load.json` — declares what gets loaded for new B_* engraving
- `tools/scenarios/handoff-write-load.json` — declares full-load for handoff
- `_handoff/VAULT/token-cost-baseline-S007.json` — first measurement output (per-session-coded since point-in-time)

**Exit criteria:**
- Script runs: `pnpm tokens:measure` outputs JSON with token counts per scenario
- Baseline JSON committed
- Per-scenario totals documented; scenarios with cost > 100K flagged for §9.3 prioritization

### 9.3 Phase 2 — Element-review (gap analysis + priority placement)

**Depends on:** Phase 1 baseline data
**Estimated session cost:** 0.5

**Artifacts to author:**
- `_handoff/VAULT/element-reviews/token-optimization-S007.md` — depth-3 review per element-review pattern engraved S006 L1
- §1 state-of-art: ingest baseline JSON; document per-artifact + per-scenario costs
- §2 enhancement opportunities: gap analysis vs CSPS-aligned-ideal (target tokens per scenario); ranked candidates
- §3 priority placement: priority-engine.schema.yaml 5-dim formula scores per candidate

**Exit criteria:**
- Element-review §4 attestation signed
- Top-N candidates promoted to topic-plan list (next phase)
- §3 includes recommended scope for token-optimization topic-plan

### 9.4 Phase 3 — File splitting (highest-leverage candidates)

**Depends on:** Phase 2 element-review ratification
**Estimated session cost:** 1-2 sessions per candidate; 4-8 candidates likely

**Per-candidate sub-phases:**
- 3a. Author split: index file + per-entry slice files
- 3b. Update validators (`cross-ref-resolution`; `principles_validate` aggregation logic)
- 3c. Update codegen (`principles:codegen` reads slices + emits AGENTS.md)
- 3d. Update inbound references (grep + update all callers)
- 3e. ZF cycle: pnpm verify exit_code 0
- 3f. Per-file commit + push

**Order (proposed by leverage):**
1. **principles.yaml split** (highest leverage; 85K → 5K when 1 principle needed; affects every session)
2. **behavioral-contracts.md split** (48K → 3K)
3. **audit-runner.md split per pipeline** (30K → 5K)
4. **ai-behavior-spine.md split per discipline** (10K → 1K) — lowest priority (smallest savings)

**Exit criteria per split:**
- All inbound references resolve
- Codegen emits identical AGENTS.md before/after split
- pnpm verify exit_code 0
- Token cost re-measured: scenario X cost reduced by N tokens

### 9.5 Phase 4 — principles-mcp build (MCP server activation)

**Depends on:** Phase 3 splits OR runs in parallel (build-order.md week-2)
**Estimated session cost:** 1-2 sessions

**Artifacts:**
- `packages/principles-mcp/src/index.ts` — actual implementation
- Query API: `principles.get(id)`, `principles.list(category)`, `principles.find_by_enforcer(layer)`
- MCP resource registration in CSPS root MCP config
- Smoke tests

**Exit criteria:**
- AI in any session can query `csps-principles-mcp` via MCP tools
- Per-query token cost < 5K (vs ~85K full load)
- Server boots cleanly via `pnpm --filter @csps/principles-mcp build && start`

### 9.6 Phase 5 — Context-loading templates (orchestrator config)

**Depends on:** Phase 3 splits
**Estimated session cost:** 0.5-1

**Artifacts:**
- `tools/templates/context-loading/<task-class>.json` — per-task-class loading spec (artifact list + depth)
- Updates to `template-registry.md` §6 (NEW section listing context-loading templates)
- Documentation in token-optimization.md §7.3 made canonical (not just proposed)

**Exit criteria:**
- 8+ task-class templates authored
- Each declares artifact-set + depth + estimated token cost
- Validator `context-loading-template-coverage` registered atomic per FSE

### 9.7 Phase 6 — Hook integration (UserPromptSubmit orchestrator)

**Depends on:** Phase 5 templates
**Estimated session cost:** 1

**Artifacts:**
- `.claude/hooks/user-prompt-submit-context-orchestrator.sh` — detects task-class via prompt patterns + injects slices
- Per-task-class detection regex/heuristics
- Telemetry: log what was loaded vs what was actually consumed
- Documentation in cognitive-context-architecture.md (Layer 4 activation evidence)

**Exit criteria:**
- Hook detects task-class on session-open prompts with N% accuracy
- Token cost on simple tasks reduced by measurable amount
- Telemetry captures load-vs-consumed delta

### 9.8 Phase 7 — Model routing automation (cross-actor; requires PCR + ratification)

**Depends on:** Phases 1-6 + user ratification (cross-actor: affects user experience)
**Estimated session cost:** 2-3

**Artifacts:**
- `.claude/hooks/pre-tool-use-model-routing.sh` — detects task-class on tool call + recommends/enforces model
- Telemetry: model-class distribution + quality-regression detection
- Updates to AAP frontmatter schema (model_routing field becomes consumed)

**Exit criteria:**
- Hook recommends model on PR-blocking warn (not error initially per ratchet protocol)
- Telemetry shows model-class distribution
- ADVISORY → FAIL_CLOSED ratchet after K=5 fires per validator-ratchet protocol

### 9.9 Phase 8 — Continuous validation (audit registration)

**Depends on:** Phases 1-7 substantially complete
**Estimated session cost:** 0.5

**Artifacts:**
- New audit `token-consumption-budget-respected` registered atomic in audit-runner.md
- Per-session-close measurement: did loading cost exceed N% of session budget?
- Drift detection: cross-quarter comparison

**Exit criteria:**
- Audit registered + cross-referenced in audit-hub Pipeline 3
- First baseline measurement post-Phase-7 captured
- Drift detection runs per closing-summary §10.0

### 9.10 Plan attestation block (template — to be filled at execution)

```yaml
token_optimization_topic_plan:
  topic_id: token-optimization
  depth_chosen: 4
  multi_session_arc: [S007, S008, S009, S010]
  priority_score: 75
  priority_band: 2 (HIGH)
  depends_on: [governance-foundation-CLOSED, foundation-slices-decision]
  blocked_by: foundation-slices-week-2-priority (resolve in §11)
  exit_criteria_met: false (DRAFT — awaits ratification)
```

---

## §10 Risk register

| Risk | Probability | Cost | Mitigation |
|---|---|---|---|
| Splits break inbound references | Medium | Medium | `cross-ref-resolution` validator runs every commit; `git mv` preserves history |
| Orchestrator over-fits to detected task-classes | Medium | Medium | Telemetry captures load-vs-consumed delta; tune templates per measurement |
| Phase 7 model routing breaks user expectation | Low | High | PCR + ratification mandatory; ratchet to FAIL_CLOSED only after 5+ ADVISORY fires |
| Measurement script underestimates real costs | High | Low | Use real Anthropic tokenizer (not heuristic); validate against actual session telemetry |
| Foundation-slices week-2 priority pre-empts this work | High | Low | Schedule in parallel; orchestrator improvements protect foundation-slices session quality |
| External insights change priorities | Medium | Low | Plan is DRAFT; revisit after user provides external content |

---

## §11 Open questions (require user input or external content)

1. **Priority vs foundation-slices.** Should token-optimization run before / parallel-to / after foundation-slices week-2? (Quality argument: parallel — orchestrator helps foundation-slice sessions; priority argument: foundation-slices is build-order week-2 and shouldn't slip.)
2. **CNST/GVRN split decision** (per element-reviews/csps-core-spines-S006.md gap_id `cnst-gvrn-split-decision`) — if split is approved, principles.yaml split (§9.4 Phase 3a) might want to wait until cardinality settles.
3. **External content the user mentioned** — may contain specific orchestrator pattern from another platform OR specific MCP tool worth absorbing.
4. **Tokenizer choice for measurement** — Anthropic tiktoken? Approximation? Real session log analysis?
5. **Which task-classes to detect first** in Phase 6 — depends on real session telemetry showing what AI actually does.
6. **Mastra BaseAgent integration timing** — Phase 7 model routing for Class A/B vs Class C runtime (week-6+) — should they unify?

---

## §12 References + canonical sources

### Existing CSPS engravings

- [P-META-009 cognitive-context-architecture](../../../packages/principles/principles.yaml) — 5-layer architecture + 4 Quality Gates immutable
- [P-META-015 universal-template-first](../../../packages/principles/principles.yaml) — context-loading templates compose
- [P-META-016 gradual-build-by-foundations](../../../packages/principles/principles.yaml) — depth-4 schema + priority engine
- [P-META-019 structural-prevention-discipline](../../../packages/principles/principles.yaml) — fix the structure when budget exceeded
- [P-ARCH-028 csps-core-spines](../../../packages/principles/principles.yaml) — slice-loading respects spine attribution
- [cognitive-context-architecture.md](./cognitive-context-architecture.md) — dashboard leaf
- [audit-hub.md Pipeline 3](./audit-hub.md) — cognitive-context-discipline pipeline
- [csps-build-dna.md](./csps-build-dna.md) — synthesis: rigid spine + flexible adaptation

### CSP precedent (absorbed from)

- CSP PLTF_32_PE_COMPREHENSIVE_GUIDE_S335.md — Priority Engine schema + bands + push-back rules
- CSP PLTF_CORE_SPINE_COMPREHENSIVE_GUIDE_S335.md — 3-layer doctrine model + sealed L1 discipline

### External standards

- Anthropic prompt caching (1-hour TTL; content-hash invalidation)
- tiktoken / Anthropic tokenizer
- Model Context Protocol (MCP) specification
- POSIX filesystem conventions (per naming-policy)

### Trigger source (this document)

- Governor Prompts S006 — [GP-S006-25 token-optimization-analysis-directive](../_handoff/VAULT/governor-prompts/S006.md)
- User S006 turn 26 directive: *"prepare a comprehensive md draft file on this matter and optimization in this platform"* + *"include detailed plan !! with all content and context covering all aspects and with optimal order"*

---

## §13 Status + next steps

**Status:** DRAFT (lifecycle_state: draft); v0.1; awaits external content + insights.

**What needs to happen before Phase 1 can start:**
1. User provides external content + insights
2. User ratifies (or amends) the proposed phased plan in §9
3. User answers §11 open questions OR explicitly defers them
4. Token-optimization topic-plan opens at `_handoff/VAULT/topic-plans/token-optimization.md` (new file; not yet created)
5. Phase 1 measurement script authored + baseline captured

**No engraving happens from this document alone.** Per user directive: *"do not implement anything yet"*. This document is the prepared analysis + plan template.

---

**Document signature:** `S006-AI-token-optimization-DRAFT-v0.1-2026-05-04T22:30:00Z`

**Author attestation:** Authored by AI (Claude Opus 4.7) at user direction S006 turn 26. Owner + Creator: Yariv Fink (group:finky / [@CommarkG](https://github.com/CommarkG)). DRAFT status — represents AI analysis at point-in-time; awaits user ratification.
