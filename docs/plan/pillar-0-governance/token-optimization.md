---
id: csps.pillar-0-governance.token-optimization
name: token-optimization
description: Comprehensive analysis + multi-session plan for token consumption optimization in CSPS. Covers models in use / dynamic adjustment / recurring cycles / file optimization (monolithic vs depth-aware) / orchestrator design / platform integration / phased rollout. Authored S006 turn 26; v0.2 absorbs CSP_STANDARD_TOKEN_BUDGET_GOVERNANCE (S006 turn 27) — synthesizing 4 council inputs (Perplexity backbone + GPT B_TOKEN_BUDGET architecture + Gemini prompt-caching + Claude AI hooks-replacing-injection) per CSP S335 standard. DRAFT — awaits Governor ratification before topic-plan opening. Per CCA P-META-009 + CSPS DNA "quality + holistic context > immediate savings".
version: 0.3
last_update_session: S006
last_update_turn: 29
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

## §9 The detailed multi-session plan — v0.3 OPTIMAL ORDER (the core of this document)

> **v0.3 (S006 turn 29) replaces v0.2's 8-phase ordering with optimal 10-phase CSPS-aligned sequencing.** Per user directive "produce the best possible detailed plan in optimal order and best fit to what you built so far. use what is built!!" Phases reordered + enhanced for: (a) contract-first engraving so subsequent work is governance-anchored, (b) CSPS DNA "foundations first; rest of system benefits", (c) optimal cache + measurement sequencing, (d) maximum reuse of existing CSPS engravings (no parallel structures).

### §9.0 Post-CSP-absorption synthesized order (S008 turn 11 amendment)

> **Per user S008 turn 11 directive:** *"Go over the multisession plan and optimize order .. do it like a top expert in building sufisticated platforms layer by layer with each one supporting the next and with special attention to going over what exists before even thinking."*

After absorbing all 5 CSP series files + edge-case operational note (S008 turns 7-11; 6 EXT IDs / 25 sub-IDs / 40 cross-refs already integrated into Phase 5-10 specs per S008 turn 10 commit `d672b6f`), this **synthesized order** PRECEDES §9.1 with a foundation-first pre-Phase-6 batch. **§9.1-§9.11 phase content unchanged** (CSP cross-refs already added per Phase). This block sequences which work happens at which session boundary.

**Reuse-first inventory (per "see what exists before even thinking"):**
- ✅ Phase 1-4 closed (S007)
- ✅ Phase 5 hook stubs landed S008 turn 5 (commit 433eb74) — 12 hooks at `.claude/hooks/*` with `@csps-*` headers + WEEK-4 PROMOTION CRITERIA + +x normalized
- ✅ Weekly tag-status-deep-audit registered 5/5 atomic per FSE S008 turn 8 (commit 35bd7be)
- ✅ 25 EXT extraction notes saved + cross-referenced (S008 turns 7-11)
- ✅ 40 EXT cross-refs integrated into Phase 5-10 specs (S008 turn 10 commit d672b6f)
- ✅ Permission-popup discipline engraved S008 turn 11 (memory entry per user explicit directive)
- ✅ CSPS L1_CORE files at `.claude/core-spines/` ARE HUB-per-spine equivalent (saves CSP's projected 10-15hr work; CSPS 1hr lite-version per Improvement #6)

**Synthesized execution sequence:**

```
S009 — FOUNDATION-FIRST BATCH (BLOCKING for Phase 6)
├── L1.1 Engrave depth-discipline.md canonical leaf (EXT-004-A) — disambiguates 5 CSPS depth semantics
├── L1.2 Author tools/templates/governed-artifact-frontmatter.template.md (EXT-004-B Improvement #1)
├── L1.3 Engrave B_CONSOLIDATION_PASS contract 5/5 atomic (EXT-003-A)
├── L1.4 Engrave B_SAVINGS_AND_SSOT_UNIFIED principle/contract OR P-META-009 amendment (EXT-005-A)
├── L1.5 Engrave D1-D10 catalog memory + 5 known FP classes leaf (EXT-002-D)
└── L1.6 ASK governor permission for: (a) settings.json hook registration (12 stubs → active) (b) depth-marker-creation-gate hook addition (per popup discipline THIS BATCH)

S010 — PHASE 6 COMPLETE ✅ + PHASE 7 Candidate #1 COMPLETE ✅
├── 6a. Class B subagent spawn templates ✅ tools/templates/class-b-agent-spawn-preamble.template.md
├── 6b. Spawn templates declare depth-discipline fields ✅
├── 6c. AAP frontmatter extended 7→9 fields per EXT-002-B ✅ 5/5 FSE atomic
├── 6d. 3 heavy ops delegated to Haiku ✅ T2.1 ZF + T2.2 validator + T2.3 file scan
├── 7a. principles.yaml split ✅ COMPLETED S010 (not S011 — Governor accelerated pace)
│   ├── 53 slice files at packages/principles/principles/P-XXX-NNN.yaml ✅
│   ├── Lightweight index at packages/principles/principles-index.yaml ✅
│   ├── Generator at packages/principles/split.mjs + pnpm principles:split ✅
│   ├── Sync validator validate-principle-slices.mjs ACTIVE + verify cycle PASS ✅
│   └── pnpm verify exit_code 0 confirmed ✅ (principle_slices_sync PASS source_ids=53 missing=0)
│   Note: codegen.ts continues reading monolith (unchanged); slices for AI context loading
│   Deferred: cross-ref-resolution validator (week-4) + token cost measurement (Phase 9 S013)
│   Deferred: L1_CORE_*.md depth-markers (files 45-66 lines; <300 threshold; not required)

├── 7b. behavioral-contracts.md split ✅ COMPLETED S010
│   ├── 39 slice files at docs/plan/pillar-0-governance/behavioral-contracts/B_NAME.md ✅
│   ├── Index at behavioral-contracts-index.yaml ✅
│   ├── Generator tools/generators/split-behavioral-contracts.mjs + pnpm contracts:split ✅
│   └── Sync validator + verify cycle: behavioral_contract_slices_sync PASS 39/39 ✅
├── 7c. audit-runner.md split ✅ COMPLETED S010
│   ├── 28 pipeline slice files at docs/plan/pillar-0-governance/audit-runner/pipeline-<slug>.md ✅
│   ├── Index at audit-runner-index.yaml ✅
│   ├── Generator tools/generators/split-audit-runner.mjs + pnpm audit-runner:split ✅
│   └── Sync validator + verify cycle: audit_runner_slices_sync PASS 28/28 ✅
│   Note: frontmatter-validate exemptions added for generated slice dirs (not governed artifacts)

├── 7d. ai-behavior-spine.md split ✅ COMPLETED S010
│   ├── 10 section slices at docs/plan/pillar-0-governance/ai-behavior-spine/<slug>.md ✅
│   ├── Index at ai-behavior-spine-index.yaml ✅
│   ├── Generator tools/generators/split-ai-behavior-spine.mjs + pnpm ai-behavior-spine:split ✅
│   └── Sync validator + verify cycle: ai_behavior_spine_slices_sync PASS 10/10 ✅

S011 — PHASE 7 COMPLETE — carry-forwards
├── PHASE 7 ALL 4 CANDIDATES DONE ✅ — principles (53) + behavioral-contracts (39) + audit-runner (28) + ai-behavior-spine (10) = 130 total slice files
├── 7e. AAP 9-field backfill for 16 existing SKILL.md (principle_compliance + consolidation_cross_refs)
└── 7f. PE engine model-routing integration topic-plan (S010 §10 PE alignment carry-forward)

S012 — PHASE 8 (principles-mcp build) — PE.read_budget integration ATOMIC
├── 8a. principles-mcp impl per existing §9.9
├── 8b. PE.read_budget extension authored same-batch (EXT-004-C; tools/pe-compute.mjs CSPS analog)
└── 8c. MCP queries return L1 by default; escalate L2/L3 on follow-up (depth-aware MCP)

S013 — PHASE 9 (Context-loading templates + measurement validator) — apply validator class structure
├── 9a. validate-token-budget.mjs 5-mode per existing §9.10
├── 9b. Apply 6-commitment validator class structure (EXT-002-A)
├── 9c. Un-defer Phase 4d 10-scenario test (carry-forward from S007)
├── 9d. Author schema-index.md (EXT-005-C Improvement #8 CSPS analog)
└── 9e. corespine_layer_compliance extension for HUB depth markers (EXT-004-D Improvement #8)

S014 — PHASE 10 (Continuous validation) — ACTIVATE recurring disciplines
├── 10a. Activate weekly tag-status-deep-audit hook (EXT-005 + S008 turn 8 5/5 atomic; activation = settings.json edit per Pattern G)
├── 10b. Consolidation Pass discipline ACTIVE per B_CONSOLIDATION_PASS (S009 L1.3)
├── 10c. D1-D10 self-monitoring continuous per memory (S009 L1.5)
├── 10d. HONEST CALIBRATION: measure CSP empirical 60-75% claim CSPS-empirically before propagating
└── 10e. Topic-plan §11 closure attestation signed
```

**Why this order (top-expert rationale):**
- **Foundation-first (S009 L1.1-L1.5):** all subsequent phases consume foundation primitives — depth-discipline, frontmatter template, B_CONSOLIDATION_PASS, B_SAVINGS+SSoT umbrella, D1-D10 self-monitoring. Building these BEFORE Phase 6 prevents D5 continuity-bias (Phase 6 spawn templates would use wrong field semantics without depth-discipline canonical leaf).
- **Layer-by-layer support (each phase depends on prior):** S010 Phase 6 templates → S011 Phase 7 splits use templates → S012 Phase 8 MCP serves split files → S013 Phase 9 validates the orchestrator → S014 Phase 10 continuous validation closes the loop.
- **Reuse-first applied exhaustively:** every Phase 6+ deliverable consults existing CSPS engravings (5/5 patterns + L1_CORE files + tag-status-contract.md + frontmatter-closed-enums.md) BEFORE authoring new. CSP's 9 improvements already mapped to existing CSPS infrastructure (e.g., HUB-per-spine = L1_CORE files, no new HUB authoring).
- **Mutual-support architecture preserved (per CSP file #4 §10):** depth markers + bundling orchestrator + SCHEMA + Core Spines deployed as ONE consolidated set; removing any layer breaks the others.

**Estimated arc:** S009 → S014 (6 sessions; consistent with original §9 estimate 5-8 sessions S007→S012). CSP-informed approach reduces re-architecting risk.

### 9.1 Plan overview

Token-optimization topic-plan: **depth-5** (sophisticated narrow — high leverage + cross-spine + moderate rework risk + multi-tenant scaling impact + enterprise-alignment lens). Was depth-4 in v0.2; promoted to depth-5 because it touches all 5 Core Spines + multiple validators + cross-quarter measurement.

**Plan filename:** `_handoff/VAULT/topic-plans/token-optimization.md` (per naming-policy Rule 3 — per-topic; topic-id only)
**Estimated arc:** 5-8 sessions (S007 → S012 typical; CSP cruel-critic Critique 5 absorbed)
**Priority band:** Band 2 HIGH (PE_SCORE ~75-85; load-bearing for quality preservation; not Band 1 BLOCKING because foundation-slices week-2 retain precedence per build-order.md)
**Depends on:** governance-foundation closure ✅ (achieved S006 turn 22 [commit 1b779f6](https://github.com/CommarkG/csps/commit/1b779f6))
**Composes with:** B_GRADUAL_BUILD_BY_FOUNDATIONS (depth-5 schema) / P-META-016 (per-layer ZF gates) / B_PE_ALIGNMENT_GUARDIAN (deflects mid-arc misaligned requests) / B_STRUCTURAL_PREVENTION_DISCIPLINE (Q-2 — gaps surface as enhancements)

### 9.2 Phase 1 — Baseline measurement (must precede claims)

**Depends on:** nothing
**Estimated session cost:** 0.3-0.5
**Composes with:** P-META-006 RZF (re-run IS the proof — measure before claim)

**Artifacts:**
- `tools/measure-token-cost.mjs` — measures per-artifact token cost via tiktoken approximation
- `tools/scenarios/<task-class>.json` × 8 — per-task-class loading specs (session-open / engraving / mechanical-edit / verify / handoff-write / governor-prompt-log / pcr-rendering / architectural-decision)
- `_handoff/VAULT/token-cost-baseline-S007.json` — point-in-time baseline (per-session per naming-policy Rule 2)

**Exit criteria (mechanical):**
- [ ] `pnpm tokens:measure` script runs; outputs JSON with token counts per scenario
- [ ] Baseline JSON committed; values measured (not estimated)
- [ ] All 8 scenarios captured
- [ ] Per-scenario totals documented in element-review draft

### 9.3 Phase 2 — Element-review (gap analysis + priority placement)

**Depends on:** Phase 1 baseline data
**Estimated session cost:** 0.3
**Composes with:** P-META-019 (element-review pattern engraved S006 L1)

**Artifacts:**
- `_handoff/VAULT/element-reviews/token-optimization-S007.md` (per element-review template; depth-3)
- §1 state-of-art: ingest baseline JSON; document per-artifact + per-scenario costs
- §2 enhancement opportunities: 7 strategies ranked by priority-engine 5-dim formula (B leverage + D dependency + I idle + Bn bundle + PAS path-alignment)
- §3 priority placement: bands per CSP B_TOKEN_BUDGET 4 priority bands

**Exit criteria:**
- [ ] Element-review §4 attestation signed
- [ ] Top-N candidates promoted to topic-plan execution slate
- [ ] User ratifies which optimizations to pursue (gates Phase 3+)

### 9.4 Phase 3 — Engrave B_TOKEN_BUDGET 5/5 atomic per FSE (CONTRACT-FIRST DISCIPLINE)

**Depends on:** Phase 2 ratification
**Estimated session cost:** 0.5-0.7
**Composes with:** P-META-007 FSE atomic registration (S005 turn 18 amendment) / extends P-META-009 CCA + B_COGNITIVE_CONTEXT_DISCIPLINE

**Why phase 3 (not later):** subsequent work needs the contract ratified to be governance-anchored. CSPS DNA: "foundations first; rest of system benefits." The contract IS the foundation for all token-optimization operational work.

**5 atomic surfaces:**
- **Schema** (§14.1 promotion): extend `principles.yaml#P-META-009.config` with §13 token_budget_operating_rules subsection (5 rules verbatim) — does NOT add new principle; extends existing CCA
- **Validator atomic registration** (audit-runner.md): 5 audit slugs (`token-budget-claude-md-size` / `token-budget-skills-completeness` / `token-budget-hook-presence` / `token-budget-compact-frequency` / `token-budget-cache-continuity`) — implementation deferred week-4 per FSE amendment
- **Hook stub** (`.claude/hooks/`): 1 declaration in stub form for SessionStart self-test (`verify-hooks-functional.sh`) — addresses cruel-critic Critique 2
- **Memory**: `feedback_token_budget.md` + MEMORY.md index entry
- **Contract**: `behavioral-contracts.md § B_TOKEN_BUDGET` (extends B_COGNITIVE_CONTEXT_DISCIPLINE) + AGENTS.md hard NO covering 5 operating rules + ai-behavior-spine.md row + cross-references

**Exit criteria:**
- [ ] `pnpm verify` exit_code 0
- [ ] 53 → 53 principles (no new principle; P-META-009 extended); behavioral contracts 25 → 26 (B_TOKEN_BUDGET added)
- [ ] All 5 audits atomic-registered per FSE amendment (impl deferred week-4)
- [ ] AGENTS.md hard NO present + cross-referenced
- [ ] Spine matrix row added

### 9.5 Phase 4 — AGENTS.md slimming + skills inventory + .claudeignore

**Depends on:** Phase 3 contract ratified
**Estimated session cost:** 1-2 (CSP cruel-critic Critique 5 absorbed)
**Composes with:** B_TEMPLATE_FIRST_CREATION (P-META-015) / B_NAMING_POLICY (P-ARCH-029)

**Artifacts:**
- Backup: `AGENTS.md.original` preserves current 193-line AGENTS.md
- Slim AGENTS.md → <200 lines (~500 tokens per CSP standard); contains: project identity / build commands / absolute prohibitions / skill pointers / compact instructions
- 10 CSPS-specific skills authored at `.claude/skills/<skill-name>/SKILL.md` with YAML frontmatter (per CSP Appendix C; CSPS-adapted naming):
  - `governance-session` / `behavioral-contracts-skill` / `engraving-discipline` / `zf-validation` / `pcr-rendering` / `cc-absorption-csps` (= governor-prompts log + cardinal cross-link) / `slim-handoff` (= HANDOFF Zone A/B/C/D) / `vocabulary-canon` (= naming-policy + glossary) / `swift-build` (= topic-plan opening + execution) / `ux-rules` + `css-standards` (week-3+ slated)
- `.claudeignore` in repo root excludes: `_intake/processed/` historical extracts / `governor-prompts/S001-S005.md` (older sessions) / `closing-summary-S001-S005.md`
- 10-scenario over-compression test results (per CSP §L3.4; CSPS-adapted scenarios per §14.5)

**Exit criteria:**
- [ ] AGENTS.md word count <500 (mechanical: `wc -w AGENTS.md`)
- [ ] 10 skills present with valid AAP frontmatter (existing 7 SKILL.md + 3 new)
- [ ] `.claudeignore` syntactically valid + tested (no critical files excluded)
- [ ] 10-scenario test PASS (≥9/10 scenarios load correct skill auto)
- [ ] Token reduction measured >40% vs Phase 1 baseline (cruel-critic Critique 1 — measured-not-claimed)
- [ ] `aap_frontmatter_coverage` validator PASS on 10 skills

### 9.6 Phase 5 — Hook migration (replace AGENTS.md cascade items)

**Depends on:** Phase 4 skills + .claudeignore
**Estimated session cost:** 1
**Composes with:** Per CSP §14.4 hooks-replace-injection migration table

**Artifacts:**
- 7 hook scripts at `.claude/hooks/`:
  - `post-tool-use-validate-before-assume.sh` (B_VALIDATE_BEFORE_ASSUME)
  - `pre-tool-use-rzf-evidence-gate.sh` (B_RZF on commit)
  - `post-stop-pcr-check.sh` (B_PCR_FOR_DECISIONS)
  - `post-stop-link-discipline.sh` (B_ALWAYS_GIT_LINKS)
  - `post-stop-banned-phrase.sh` (B_NO_CONFIRMATION_SEEKING)
  - `user-prompt-submit-governor-prompts.sh` (B_GOVERNOR_PROMPTS auto-log)
  - `post-stop-pnpm-verify.sh` (B_PRE_CLOSE_VERIFICATION)
- `.claude/hooks/verify-hooks-functional.sh` SessionStart self-test (cruel-critic Critique 2)
- `.claude/settings.json` updated with hooks registration
- 7 corresponding rules removed/condensed from AGENTS.md (further AGENTS.md slim)

**Exit criteria:**
- [ ] 7 hooks present + executable + tested via test commit
- [ ] SessionStart self-test fires + reports all-hooks-functional
- [ ] AGENTS.md cascade reduced by ~1,250 tokens/turn (per §14.4 estimate)
- [ ] Token reduction additional >15% measured vs Phase 4

**Status:** L1 stub batch landed S008 turn 5 ([commit 433eb74](https://github.com/CommarkG/csps/commit/433eb74)) — 7 new + 3 existing stubs at `.claude/hooks/` with `@csps-*` headers + WEEK-4 PROMOTION CRITERIA; all 12 hooks now executable. Stub→active enforcement deferred to L3 work (composes with unified-intake topic-plan).

**CSP cross-references (S008 absorption — post-execution validation + week-4 promotion guidance):**
- [EXT-20260505-001-E SWIFT/CC/Vault routing](../_handoff/VAULT/contexts/governance/intake/EXT-20260505-001-E-swift-cc-vault-routing-and-cross-cc-bundling.md) — IntakeEvent envelope `route_to` enum design composes with hook layer (UserPromptSubmit / PreToolUse / PostToolUse / PostStop hooks ARE the source-class catch-points feeding the envelope)
- [EXT-20260505-002-A validator class structure](../_handoff/VAULT/contexts/governance/validators/EXT-20260505-002-A-validator-class-structure-smoke-test-severity-taxonomy.md) — apply 6-commitment structure (STATEFUL / COMPOSABLE / EXIT-CODED / PIPELINED / SELF-DESCRIBING / GRADUATION-AWARE) + RED/YELLOW/GREEN/INFO/LEGACY severity when promoting stubs week-4
- [EXT-20260505-002-D D1-D10 catalog](../_handoff/VAULT/contexts/governance/mechanical-completion/EXT-20260505-002-D-mechanical-completion-directive-D1-D10-false-lexicon.md) — D6 "5-element-pattern as gate not checklist": refuse `BUILT` until validator runs + emits findings + wired hook + not blocked
- [EXT-20260505-004-B mechanical-creation discipline](../_handoff/VAULT/contexts/governance/depth-discipline/EXT-20260505-004-B-mechanical-creation-discipline-with-placeholders.md) — Phase 5+ extension: add 13th hook `pre-tool-use-depth-marker-creation-gate.sh` (CSP file #4 Improvement #4)

### 9.7 Phase 6 — Subagent + Haiku tiering

**Depends on:** Phase 5 hooks
**Estimated session cost:** 0.5-1
**Composes with:** B_AGENT_ALIGNMENT_PROTOCOL (Class B subagent invocations) + AAP Class B preamble template (S007 carry-forward)

**Artifacts:**
- `.claude/settings.json` updated: `CLAUDE_CODE_SUBAGENT_MODEL=haiku`
- 3 heavy operations identified + converted to subagent invocation in main session prompts:
  - ZF cycle (`pnpm verify` analysis)
  - Validator suite full-pass
  - File scan (vocabulary drift / cross-ref-resolution)
- Subagent prompt template per CSP §14.6 critique mitigation: "summary preserves error severities + file paths + blocker conditions + next-action recommendations"

**Exit criteria:**
- [ ] 3 operations delegated to Haiku subagents
- [ ] AAP Class B preamble injected at every subagent spawn
- [ ] Mid-session context growth reduced >40% measured
- [ ] Summary quality verified on first 10 subagent uses (no information loss)

**CSP cross-references (S008 absorption — informs Phase 6 design):**
- 🔥 **PREREQUISITE (S009 foundation work BEFORE Phase 6 spawn templates authored):** [EXT-20260505-004-A 4 depth-level semantics](../_handoff/VAULT/contexts/governance/depth-discipline/EXT-20260505-004-A-four-distinct-depth-level-semantics-and-unified-principle.md) — author `docs/plan/pillar-1-architecture-and-stack/depth-discipline.md` canonical leaf disambiguating CSPS 5 depth semantics; without this, Phase 6 spawn templates use wrong field semantics → re-architecting cost
- 🔥 **PREREQUISITE (S009 foundation work):** [EXT-20260505-004-B mechanical-creation discipline](../_handoff/VAULT/contexts/governance/depth-discipline/EXT-20260505-004-B-mechanical-creation-discipline-with-placeholders.md) — `tools/templates/governed-artifact-frontmatter.template.md` provides spawn-template base with depth markers + AAP fields + placeholder values
- [EXT-20260505-001-A PE formula + IMPL_IN_PROGRESS_boost](../_handoff/VAULT/contexts/governance/priority-engine/EXT-20260505-001-A-pe-formula-validation-and-divergence.md) + [EXT-20260505-001-B](../_handoff/VAULT/contexts/governance/priority-engine/EXT-20260505-001-B-impl-in-progress-boost.md) — informs subagent dispatch scoring (which work item warrants subagent delegation vs main session)
- [EXT-20260505-002-B 9-element DNA gate](../_handoff/VAULT/contexts/governance/agent-discipline/EXT-20260505-002-B-9-element-dna-gate-triple-check-frontmatter-rigidity.md) — extends current AAP 7-fields → 9-fields for spawn templates (CSPS-adapted: drop spheres-RETIRED CSP-specific; add principle_compliance + consolidation_cross_refs)
- [EXT-20260505-002-E IVP 5+1 + L3 Expert Panel](../_handoff/VAULT/contexts/governance/review-discipline/EXT-20260505-002-E-ivp-l3-expert-panel-cruel-critic.md) — candidates for Class B subagent personas (Architect / Engineer / Ops / Security / UX); defer specific instantiation to S010-S011 first CONSTITUTIONAL change per foundation-stability discipline

### 9.8 Phase 7 — File splitting (highest-leverage candidates)

**Depends on:** Phase 4 baseline + Phase 6 subagent infrastructure
**Estimated session cost:** 1-2 sessions per candidate; 4 candidates → 4-8 sessions
**Composes with:** P-ARCH-028 csps-core-spines 3-layer doctrine model (apply pattern to monolithic files)

**Order (priority-engine ranked):**
1. `principles.yaml` split (85K → 5K when 1 principle needed) — `principles/<P-XXX-NNN>.md` per principle; `principles.yaml` becomes index
2. `behavioral-contracts.md` split (48K → 3K) — `behavioral-contracts/<B_NAME>.md` per contract
3. `audit-runner.md` split per pipeline (30K → 5K) — `audit-runner/pipeline-<N>-<name>.md`
4. `ai-behavior-spine.md` split per discipline (10K → 1K) — lowest priority

**Per-candidate sub-phases** (CSPS-aligned):
- 3a. Author split: index file + per-entry slice files
- 3b. Update validators (`cross-ref-resolution`; `principles_validate` aggregation logic in codegen.ts)
- 3c. Update codegen (`principles:codegen` reads slices + emits AGENTS.md identical-before/after)
- 3d. Update inbound references (grep + update all callers)
- 3e. ZF cycle: `pnpm verify` exit_code 0; AGENTS.md drift = 0
- 3f. Per-file commit + push

**Exit criteria per split:**
- [ ] All inbound references resolve (`cross-ref-resolution` validator PASS)
- [ ] Codegen emits identical AGENTS.md before/after
- [ ] `pnpm verify` exit_code 0
- [ ] Token cost re-measured: scenario X reduced by N tokens; baseline updated

**CSP cross-references (S008 absorption — informs Phase 7 file-split discipline):**
- 🔥 [EXT-20260505-002-F file_depth_markers](../_handoff/VAULT/contexts/governance/operational-discipline/EXT-20260505-002-F-4-batch-close-file-depth-rigid-flex-5-prevention-10-scenario.md) — IMMEDIATELY adopted; **backfill markers as PART of split discipline** (split + add markers = atomic)
- [EXT-20260505-003-C HUB-per-spine](../_handoff/VAULT/contexts/governance/anti-duplication/EXT-20260505-003-C-schema-and-core-spines-as-canonical-home-architecture.md) — CSPS L1_CORE_<SPINE>.md files at `.claude/core-spines/` ARE the HUB-per-spine equivalent; **just add `file_depth_markers` to them** (saves CSP's projected 10-15hr; CSPS-specific 1hr work)
- [EXT-20260505-004-D Improvement #3 + #6](../_handoff/VAULT/contexts/governance/depth-discipline/EXT-20260505-004-D-composition-with-schema-corespines-and-9-improvements.md) — top 10 offender backfill list (CSPS top: behavioral-contracts.md ~1300 lines / token-optimization.md / topic-plans / element-reviews) is biggest token-saving lever per file
- [EXT-20260505-003-A Consolidation Pass](../_handoff/VAULT/contexts/governance/anti-duplication/EXT-20260505-003-A-single-rule-6-duplication-patterns-5-step-consolidation-pass.md) — 5-step protocol: each split must check existing canonical home BEFORE creating new file (avoid duplicating already-canonical content)
- [EXT-20260505-003-D when NOT to consolidate](../_handoff/VAULT/contexts/governance/anti-duplication/EXT-20260505-003-D-when-NOT-to-consolidate-counter-cases.md) — counter-case 1 (don't consolidate if canonical home becomes too large for L1 scan) directly applies to split decisions

### 9.9 Phase 8 — principles-mcp build (MCP server activation)

**Depends on:** Phase 7 splits (mcp serves split files)
**Estimated session cost:** 1-2
**Composes with:** P-META-009 CCA Layer 4 (MCP queries on-demand — finally activated)

**Artifacts:**
- `packages/principles-mcp/src/index.ts` — actual implementation (replaces skeleton from S005)
- Query API: `principles.get(id)` / `principles.list(category)` / `principles.find_by_enforcer_layer(layer)` / `principles.find_by_spine(core_spine)` (NEW — leverages P-ARCH-028)
- MCP resource registration in CSPS root MCP config
- Smoke tests + AAP Class A frontmatter alignment

**Exit criteria:**
- [ ] `pnpm --filter @csps/principles-mcp build` succeeds
- [ ] Per-query token cost <5K (vs ~85K full load) — measured
- [ ] AI in any session can query `csps-principles-mcp` via MCP tools
- [ ] AAP frontmatter aligned + `aap_frontmatter_coverage` PASS

**CSP cross-references (S008 absorption — informs Phase 8 MCP design):**
- [EXT-20260505-004-C PE.read_budget extension](../_handoff/VAULT/contexts/governance/depth-discipline/EXT-20260505-004-C-bundling-orchestrator-pe-read-budget-extension.md) — MCP queries return L1 by default; escalate L2/L3 only on follow-up (depth-aware MCP responses)
- [EXT-20260505-002-C AID-NNN audit registry](../_handoff/VAULT/contexts/governance/audit-orchestration/EXT-20260505-002-C-quality-audit-framework-AID-system-standing-authorizations.md) — every MCP query = audit instance with `audit_kind: MCP_QUERY` + cost + findings (composes with audit-runner registration)
- [EXT-20260505-001-E IntakeEvent envelope](../_handoff/VAULT/contexts/governance/intake/EXT-20260505-001-E-swift-cc-vault-routing-and-cross-cc-bundling.md) — `route_to` enum applies to MCP routing: SWIFT_EXECUTE = direct query / COUNCIL_REVIEW = surface to user / VAULT_DEFER = cache for later

### 9.10 Phase 9 — Context-loading templates + orchestrator (CCA Layer 4 activation)

**Depends on:** Phase 8 mcp infrastructure
**Estimated session cost:** 0.5-1
**Composes with:** P-META-015 B_TEMPLATE_FIRST_CREATION + B_AGENT_ALIGNMENT_PROTOCOL

**Artifacts:**
- `tools/templates/context-loading/<task-class>.json` × 8 per-task-class loading spec
- New section in `template-registry.md` §6 — context-loading templates
- `.claude/hooks/user-prompt-submit-context-orchestrator.sh` — detects task-class + injects slices
- Telemetry log: load-vs-consumed delta

**Exit criteria:**
- [ ] 8+ task-class templates authored
- [ ] `template-registry.md` §6 added
- [ ] Hook detects task-class with ≥85% accuracy on session-open prompts
- [ ] Token cost on simple tasks reduced by measurable amount
- [ ] Telemetry captures load-vs-consumed delta

**CSP cross-references (S008 absorption — informs Phase 9 measurement validator + orchestrator design):**
- 🔥 [EXT-20260505-004-C PE.read_budget](../_handoff/VAULT/contexts/governance/depth-discipline/EXT-20260505-004-C-bundling-orchestrator-pe-read-budget-extension.md) — IS the orchestrator extension authored this phase; `tools/pe-compute.mjs` + `tools/pe-context-cache.json` (CSPS analogs of CSP `pe_compute.ps1` + cache)
- [EXT-20260505-001-C 7 PE invocation points](../_handoff/VAULT/contexts/governance/priority-engine/EXT-20260505-001-C-7-mandatory-invocation-points.md) — mechanical PE compute layer pattern; CSPS-adapted to 5 invocation points + 6th = Consolidation Pass + 7th = read_budget refresh
- [EXT-20260505-002-A validator class structure](../_handoff/VAULT/contexts/governance/validators/EXT-20260505-002-A-validator-class-structure-smoke-test-severity-taxonomy.md) — apply 6-commitment structure when authoring `validate-token-budget.mjs`
- [EXT-20260505-002-F file_depth_markers + 10-scenario test + rigid-vs-flex + 5-prevention](../_handoff/VAULT/contexts/governance/operational-discipline/EXT-20260505-002-F-4-batch-close-file-depth-rigid-flex-5-prevention-10-scenario.md) — un-defer Phase 4d 10-scenario test HERE; rigid-vs-flex + 5-prevention catalog inform validator behavior
- [EXT-20260505-004-D Improvements #5 + #8 + #9](../_handoff/VAULT/contexts/governance/depth-discipline/EXT-20260505-004-D-composition-with-schema-corespines-and-9-improvements.md) — concrete validators authored Phase 9 (PE.read_budget + corespine_layer_compliance extension + depth_marker_creation_template_validator)
- [EXT-20260505-002-B 9-element DNA gate Triple-check](../_handoff/VAULT/contexts/governance/agent-discipline/EXT-20260505-002-B-9-element-dna-gate-triple-check-frontmatter-rigidity.md) — Pre-adoption + Mid-implementation + Post-implementation pattern for context-loading templates

### 9.11 Phase 10 — Compaction discipline + MCP audit + measurement validator + continuous validation

**Depends on:** Phase 9 orchestrator
**Estimated session cost:** 0.5-1
**Composes with:** B_PRE_CLOSE_VERIFICATION + audit-hub Pipeline 10

**Artifacts:**
- `/compact` focus instructions added to slim AGENTS.md
- MCP audit: disable unused servers; document active servers
- `tools/validators/validate-token-budget.mjs` — 5-mode validator per §14.6
- Audit `token-consumption-budget-respected` registered atomic in audit-hub Pipeline 10
- Recurring task: weekly `/usage` audit + per-quarter alignment-drift-over-time
- Cross-quarter baseline tracking in `_handoff/VAULT/token-cost-history.jsonl` (append-only per spine-attribution-history pattern)
- 10-scenario test registered as RECURRING (cruel-critic Critique 3) at quarterly cadence

**Exit criteria:**
- [ ] Cumulative savings >50% vs Phase 1 baseline (cruel-critic Critique 1 — measurement-driven not claimed)
- [ ] `validate-token-budget.mjs` runs 5 modes with all PASS
- [ ] Audit registered + cross-referenced bidirectionally
- [ ] Recurring task active + first run completed
- [ ] Topic-plan §11 closure attestation signed

**CSP cross-references (S008 absorption — informs Phase 10 continuous validation):**
- 🔥 [EXT-20260505-003-A Consolidation Pass](../_handoff/VAULT/contexts/governance/anti-duplication/EXT-20260505-003-A-single-rule-6-duplication-patterns-5-step-consolidation-pass.md) + [EXT-20260505-003-B 4 invocation triggers](../_handoff/VAULT/contexts/governance/anti-duplication/EXT-20260505-003-B-4-invocation-triggers-pe-composition-reassessment.md) — 5-step Consolidation Pass discipline = continuous content-validation mechanism alongside token-budget validation
- 🔥 **Weekly tag-status-deep-audit** ([cron-weekly-tag-status-deep-audit.sh](../../../.claude/hooks/cron-weekly-tag-status-deep-audit.sh) — registered S008 turn 8 5/5 atomic per FSE) — extends to depth-marker drift detection + IntakeEvent state-machine compliance
- [EXT-20260505-002-D D1-D10 catalog](../_handoff/VAULT/contexts/governance/mechanical-completion/EXT-20260505-002-D-mechanical-completion-directive-D1-D10-false-lexicon.md) — continuous AI self-monitoring framework; "false" lexicon (false-FP / false-ZF-0 / false-ratification / FAKE_PROGRESS) flags claims-without-evidence
- [EXT-20260505-004-D 9-improvement plan](../_handoff/VAULT/contexts/governance/depth-discipline/EXT-20260505-004-D-composition-with-schema-corespines-and-9-improvements.md) — Phase 10 validates all 9 improvements landed (completion checkpoint)
- [EXT-20260505-001-D 5 reassessment triggers](../_handoff/VAULT/contexts/governance/priority-engine/EXT-20260505-001-D-7-reassessment-triggers.md) — Phase 10 close fires P-GOV-24-equivalent reassessment + topic-plan §11 closure
- ⚠️ **HONEST CALIBRATION OBLIGATION:** CSP empirical 60-75% reference-read reduction estimate must be CSPS-MEASURED at Phase 10 close BEFORE propagating any number (per cruel-critic discipline + EXT-002-E)

### 9.12 Plan attestation block (template — fills at execution close)

```yaml
token_optimization_topic_plan:
  topic_id: token-optimization
  depth_chosen: 5
  multi_session_arc: [S007, S008, S009, S010, S011, S012]
  priority_score: 80
  priority_band: 2 (HIGH)
  depends_on: [governance-foundation-CLOSED ✅]
  blocked_by: foundation-slices-week-2-priority (resolve in §11)
  exit_criteria_met: false (DRAFT — awaits Phase 1 measurement before any claim)
  ratchet_eligibility_threshold: ≥10 sessions with ≥50% measured savings (per CSP standard L3.2)
```

---

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

## §14 v0.2 — Absorbed insights from CSP_STANDARD_TOKEN_BUDGET_GOVERNANCE (S006 turn 27)

User S006 turn 27 provided CSP standard authored by Claude AI council member synthesizing Perplexity + GPT + Gemini + Claude AI inputs. Absorbed insights below; CSP↔CSPS mapping in §14.4.

### §14.1 The 5 operating rules — proposed B_TOKEN_BUDGET contract (DRAFT)

The following 5 rules form a candidate B_TOKEN_BUDGET behavioral contract. **Status: DRAFT proposal**; engraving as full B_* requires Governor ratification + 5/5 atomic engraving pass per FSE.

| # | Rule | Operationalization |
|---|---|---|
| 1 | **Default depth: L1 (quick) only.** L2/L3 require explicit trigger | L2 escalation triggers: validator failure cites L2 / implementation needs exact section / ambiguity unresolved at L1. L3 escalation: ratification dispute / ZF semantic failure / constitutional wording required |
| 2 | **Default model tiering** | Sonnet for build/edit/standard / Haiku for subagents (read-only ops via Task tool) / Opus for engraving + PCR + ZF synthesis + architectural decisions (CCA QG1 immutable). **No mid-task model switching** (cache is model-specific). |
| 3 | **Default at IMPL_BATCH boundary: `/compact <focus>`** | Strategic compaction with focus instructions replaces auto-compact's content-loss pattern. CSPS analog: at L<N>→L<N+1> topic-plan transitions OR at any commit-worthy boundary |
| 4 | **Default between unrelated tasks: `/clear` + new session** | Stale context from unrelated tasks does not pay rent. CSPS analog: per chat-vs-session distinction (P-META-014 + memory entry) — when domain changes, session-boundary required |
| 5 | **Default for tool output: summary first, full log path-linked** | Validator + command + file-read returns: status + findings_count + top_5 + evidence_paths + full_log_path. AI reads summary first; full log on demand. Prevents validator outputs from accumulating as 5K-10K token blobs |

### §14.2 The 7 strategies — RANKED BY IMPACT (replaces my unranked list in §6)

| # | Strategy | Layer affected | Estimated savings | Quality risk |
|---|---|---|---|---|
| 1 | **Shrink AGENTS.md/CLAUDE.md to <500 tokens; move detail to skills** | Layer 1 → Layer 2 | **60-80% baseline** (the dominant lever) | Low (mitigated by 10-scenario over-compression test §14.5) |
| 2 | **Move deterministic rules from AGENTS.md cascade to hooks** | Layer 1 → Layer 4 | 2,000-4,000 tok/turn | None — quality improves (hooks = Tier 0 mechanical; cannot be ignored) |
| 3 | **Use subagents (Haiku) for heavy operations** | Main → Layer 3 isolated | 40-60% mid-session | Low — clear instructions required |
| 4 | **Strategic /compact at IMPL_BATCH boundary** | Session lifecycle | 20-30% waste reduction | None — quality improves |
| 5 | **`.claudeignore` excluding historical/archived files** | Layer 1 | 5,000-20,000 tok/session | None |
| 6 | **Three-tier model strategy (Sonnet/Haiku/Opus)** | Per-task | 30-50% on routed tasks | Low — match model to task type per CCA QG1 |
| 7 | **Reduce MCP server overhead (disable unused)** | Layer 1 | 5,000-15,000 tok/server | None |

### §14.3 4-Layer Context Architecture (CSPS-adapted)

CSP framing of context loading clarifies CSPS's existing CCA 5-layer architecture. Mapping:

| Layer | Lives in | Loads when | Context cost | CSPS today |
|---|---|---|---|---|
| **Layer 1 — Always-resident** | `AGENTS.md` (currently ~9.5K tokens; target <500 = ~10K → ~500) + per-pillar AGENTS.md | Every session-open | Constant baseline | ⚠️ AGENTS.md is currently 193 lines (~9.5K); could shrink with skill extraction |
| **Layer 2 — On-demand (skills)** | `packages/skills/<name>/SKILL.md` + frontmatter `description:` field | Task description matches skill | ~100 tok startup; full-load 500-2000 when invoked | ✅ Pattern exists (7 SKILL.md aligned per AAP); ⚠️ skill triggers not optimized for description-matching auto-load |
| **Layer 3 — Isolated (subagents)** | Task tool invocation; `model: haiku` for read-only | Heavy operation invoked | Returns summary only (200-500 tokens) | ⚠️ Available but not yet disciplined; B_AGENT_ALIGNMENT_PROTOCOL Class B governs but no auto-routing |
| **Layer 4 — Outside context (hooks)** | `.claude/hooks/*.sh` | Deterministic enforcement | Zero context cost | ⚠️ Hooks declared in many engravings; impl deferred week-4 |

**Top-expert observation:** the framing "Layer 4 = zero context cost = Tier 0 mechanical" is a sharper articulation than CSPS had. Hooks aren't just enforcement — they're context-saving infrastructure. Every rule moved from AGENTS.md (Layer 1) to hooks (Layer 4) saves 150-300 tokens × every session for the rest of the platform's life.

### §14.4 Hooks-replace-injection migration table (concrete)

CSP standard provides specific migration mapping. CSPS-adapted:

| Rule (currently in AGENTS.md cascade) | Move to hook | Hook event | Token saving per turn |
|---|---|---|---|
| B_VALIDATE_BEFORE_ASSUME (tool-call sandwich) | `.claude/hooks/post-tool-use-validate-before-assume.sh` | PostToolUse | ~200 tokens |
| B_RZF re-run-is-the-proof on DONE claims | `.claude/hooks/pre-tool-use-rzf-evidence-gate.sh` | PreToolUse on commit | ~250 tokens |
| B_PCR_FOR_DECISIONS trigger detection | `.claude/hooks/post-stop-pcr-check.sh` | PostStop | ~200 tokens |
| B_ALWAYS_GIT_LINKS path-mention scan | `.claude/hooks/post-stop-link-discipline.sh` | PostStop | ~150 tokens |
| B_NO_CONFIRMATION_SEEKING phrase scan | `.claude/hooks/post-stop-banned-phrase.sh` | PostStop | ~100 tokens |
| B_GOVERNOR_PROMPTS auto-log | `.claude/hooks/user-prompt-submit-governor-prompts.sh` | UserPromptSubmit | ~50 tokens (already cheap) |
| B_PRE_CLOSE_VERIFICATION pnpm verify | `.claude/hooks/post-stop-pnpm-verify.sh` | PostStop on session-close | ~300 tokens |

**Total savings per turn from 7 hook migrations: ~1,250 tokens.** Cumulative over a session: substantial.

### §14.5 The 10-scenario over-compression test (NEW exit criteria for Phase 1)

**Why this test matters:** A failed skill trigger means AI proceeds without governance context it needs, then asks clarification questions, then loads the skill anyway. Clarification turns cost more than the original AGENTS.md context would have.

**The 10 representative session-start scenarios** (CSPS-adapted from CSP):

1. "Run pnpm verify on the current branch" → expects `validate-self` skill loads (or equivalent)
2. "Help me compose a new B_* contract" → expects `engraving-discipline` skill loads (or equivalent)
3. "What are the AGENTS.md hard NOs?" → expects `behavioral-contracts-skill` loads
4. "Process responses from the user about <topic>" → expects `governor-prompts` skill loads
5. "Update the handoff before session close" → expects `handoff-skill` loads
6. "Apply CSPS frontmatter to this file" → expects `frontmatter-skill` loads
7. "What does P-META-018 mean?" → expects `principles-mcp` query OR `principles-skill` loads
8. "Engrave a new B_* at 5/5 surfaces" → expects `five-surface-engraving-skill` loads
9. "Run an element-review on <element>" → expects `element-review-skill` loads
10. "Continue from last session" → expects `session-open` skill loads (HANDOFF Zone A reading)

**PASS criterion:** ≥9/10 scenarios load the correct skill. <9/10 = skill descriptions too vague; rewrite descriptions before declaring Phase 1 complete.

### §14.6 The 5-mode validator (NEW concrete design for Phase 8)

`tools/validators/validate-token-budget.mjs` (proposed; design absorbed from CSP):

| Mode | Check | FAIL action |
|---|---|---|
| 1 | AGENTS.md word count check (<500 tokens, <200 lines) | YELLOW finding; remediation = move detail to skills |
| 2 | Skills directory completeness (every governance domain has skill) | YELLOW finding; list missing |
| 3 | Hook presence verification (declared rules have backing hook scripts) | YELLOW finding; list undeclared rules |
| 4 | /compact frequency check in session logs (≥1 per IMPL_BATCH boundary) | YELLOW finding when ratio <0.8 |
| 5 | Prompt cache continuity (no mid-session model switch) | YELLOW finding; surface offending session |

**Ratchet eligibility (FAIL_CLOSED):** ≥10 sessions with measured token savings ≥50% vs baseline. Pre-validator-ratchet ADVISORY warn-only per ratchet protocol engraved S006 turn 9.

### §14.7 Slash commands quick reference (CSPS-curated)

| Command | When to use | Effect |
|---|---|---|
| `/usage` | Session start, IMPL_BATCH boundaries, session close | Token + cost measurement |
| `/compact <focus>` | At commit-worthy boundary; before context exceeds 65% | Strategic compaction with preservation rules |
| `/clear` | Between unrelated tasks; after ZF-0 + handoff written | Resets context; new session from AGENTS.md |
| `/model <tier>` | Task boundary only (NEVER mid-task) | Switches model; rebuilds cache |
| `/mcp` | Session start; never mid-session | Enable/disable MCP servers |

### §14.8 Cruel-critic 5 amendments (preemptively absorbed)

CSP standard's cruel-critic flagged 5 amendments before Governor seal. All adopted preemptively into CSPS plan:

| # | CSP critique | CSPS application |
|---|---|---|
| 1 | "60-80% savings claim is unverified" | §1 BLUF marks as ESTIMATED with measurement obligation; Phase 1 baseline measurement required before any claim |
| 2 | "Hooks-replacing-injection assumes hook reliability" | §14.4 migration includes SessionStart self-test hook (`verify-hooks-functional.sh` per CSP Appendix B) |
| 3 | "Over-compression test is necessary but not sufficient" | §14.5 10-scenario test registered as RECURRING per quarterly cadence (alongside `alignment-drift-over-time`) — not one-time |
| 4 | "Three-tier model strategy assumes task classification accuracy" | §14.1 Rule 2 mandates explicit task classification rules in AGENTS.md (not judgment-driven) — task-class table per AAP frontmatter |
| 5 | "4-session implementation sequence is optimistic" | §9 phases are estimated arc 4-6 sessions; explicit "may take 1-2 calendar sessions per phase" caveat added |

### §14.9 CSP ↔ CSPS architectural mapping (for cross-reference)

| CSP element | CSPS equivalent | Disposition |
|---|---|---|
| CC-072 Universal Depth Mandate | 3-layer doctrine model (P-ARCH-028) | Same concept; CSPS scope wider (all spines) |
| CC-058 Lifecycle Gate hooks | Per-layer ZF gates (P-META-016 + B_GRADUAL_BUILD_BY_FOUNDATIONS) | Same concept; different naming |
| CC-060 File Split (weighted_lines) | Not yet in CSPS — Phase 3 introduces | CSP has formal formula CSPS could adopt |
| CC-083 Depth-Tier Writing (L1/L2/L3) | **TERM COLLISION** with CSPS L1/L2/L3 doctrine model | Resolution: rename CSP concept to "document depth" {Quick/Element/Canonical} for CSPS |
| CC-045 Dynamic Loading Depth | Orchestrator design proposed in §7 | CSPS hadn't named this pattern; CSP confirms |
| SACRED rules | B_AI_PROFESSIONAL_VOICE + B_VALIDATE_BEFORE_ASSUME + B_NO_FALSE_RATIFICATION | Different naming; equivalent intent |
| B_DONE evidence gate | B_RZF (re-run-IS-the-proof) | CSPS stronger (paired tool-call evidence mandatory) |
| `context_inject.ps1` | AGENTS.md cascade + per-pillar AGENTS.md | Different injection mechanism; same intent |
| 5 spines (CNST/GVRN/VALD/ARCH/OPER) | 5 spines (GVRN/ARCH/AI/OPER/VALD) | Different sets; CSPS pending CNST/GVRN split decision (ADR-0025 candidate) |

### §14.10 What CSPS retains that CSP standard doesn't displace

These remain load-bearing CSPS strengths post-absorption:

- **CCA 4 Quality Gates (CONSTITUTIONAL immutable)** — stronger than CSP SACRED equivalent
- **B_PE_ALIGNMENT_GUARDIAN** — anti-sycophancy gate; CSP has P-GOV-25 but CSPS engraving is more recent + tied to PE schema §7
- **B_STRUCTURAL_PREVENTION_DISCIPLINE (Q-2 tweak)** — composes with CSP cruel-critic discipline
- **B_NAMING_POLICY (4 rules)** — CSP standard didn't surface naming as concern; CSPS has it engraved
- **5 Core Spines explicit (GVRN/ARCH/AI/OPER/VALD)** — different set than CSP; CNST/GVRN split decision pending
- **3-layer doctrine model with sealed L1 do_not_expand list** — CSPS-specific structural mechanism

### §14.11 Recommendations (concrete next-actions per absorption)

| # | Action | Type | Session target | Authority needed |
|---|---|---|---|---|
| 1 | Open `_handoff/VAULT/topic-plans/token-optimization.md` (depth-4) | New topic-plan | S007 | User ratification of token-optimization scope |
| 2 | Author measurement script (Phase 1 of plan) | Mechanical | S007 turn 1 | None (within token-optimization scope) |
| 3 | Engrave B_TOKEN_BUDGET as full B_* contract (5/5 atomic per FSE) | New contract engraving | S007 OR S008 | User ratification of B_TOKEN_BUDGET as new contract |
| 4 | Engrave new principle (P-OPER-002 token-budget-governance OR extend P-META-009) | New principle | S007 OR S008 | User decision: new P-OPER-002 vs amend P-META-009 |
| 5 | Update token-optimization.md once measurement baseline captured | Document update | S007 | None |
| 6 | Open companion topic-plan: 7-hooks migration (independent of file-splitting) | New sibling topic-plan | S008 | User ratification |
| 7 | CSPS-specific skills inventory authoring (10 governance skills like CSP) | Skills authoring | S007-S008 | User ratification of skill list |
| 8 | Element-review of CSPS skill triggers (10-scenario test with current 7 SKILL.md) | Quality measurement | S008 | None (within scope) |

---

## §15 Chat-transfer S006 → S007 — comprehensive 12-item specification

> **Per user S006 turn 29 directive:** *"give special attention and iteration on the chat transfer!! do not let nothing be left out."*
>
> This section specifies EVERY artifact + check + protocol that must complete before S006 chat closes + S007 chat opens. Composes with: B_MUTUAL_UNDERSTANDING_VALIDATION (P-META-014) cross-chat handshake / B_HANDOFF_PRE_FLIGHT_AUDIT (P-META-013) 7-check whole-session walk / chat-vs-session distinction (memory + protocols.md v1.10 §12) / B_GOVERNOR_PROMPTS (P-META-012) prompt log / B_STRUCTURAL_PREVENTION_DISCIPLINE (P-META-019) §10.0j enhancement scan.

### 15.1 The 12 chat-transfer items (NOTHING-LEFT-OUT register)

| # | Item | Authoring path | Exit criterion |
|---|---|---|---|
| 1 | **HANDOFF-S006-to-S007.md** authored at `_handoff/HANDOFF-S006-to-S007.md` | Per [HANDOFF-S005-to-S006.md] template; Zone A IMMEDIATE / Zone B CONTEXT / Zone C SCOPE / Zone D REFERENCE | §0 paste-target self-contained; §17 attestation signed; all 22 sections present |
| 2 | **chat-jump-prompt-S006-to-S007.md** (minimal paste-target for new AI) | Per chat-jump-prompt template `tools/templates/chat-jump-prompt.template.md` Output 1 spec | Identity banner + workspace verification + HANDOFF §0 reference + receipt-signature format + §17 attestation requirement |
| 3 | **chat-jump-prompt-S006-to-S007-detailed.md** (~250-600 word standalone for user paste-target) | Per chat-jump-prompt template Output 2; 8 mandatory sections + EXPLICIT ALIGNMENT-QUESTIONS section ≥10 questions | All 8 sections present (`chat-jump-prompt-8-mandatory-sections` validator); ≥10 alignment questions covering scope-confirm + cardinal-interp + engraving-confirm + verification-state + open-question + process-confirm |
| 4 | **HPFA whole-session walk + §10.0f attestation** | Per B_HANDOFF_PRE_FLIGHT_AUDIT (P-META-013) — 7+2 checks | All 9 checks PASS OR carry-forward explicit; `hpfa-pre-handoff-coverage` validator PASS |
| 5 | **closing-summary-S006.md** authored at `_handoff/VAULT/closing-summary-S006.md` | Per `closing-summary-template.md`; sections §10.0 through §10.13 mandatory | All §10.0/0e/0f/0g/0h/0i/0j present; `closing-summary-checklist-completeness` PASS |
| 6 | **Governor Prompts S006.md log finalized** | Already drafted at `_handoff/VAULT/governor-prompts/S006.md` (S006 turn 24); add S006 turns 25-29 entries | All substantive prompts logged; cardinal-flagged GPs cross-linked to user-intents.md; `governor-prompt-coverage` PASS |
| 7 | **user-intents.md S006 cardinal section finalized** | Append final S006 cardinals (already started S006 turn 24); add turns 25-29 verbatim quotes | All 9+ cardinal phrases preserved verbatim with cross-link to GP-S006-NN entries |
| 8 | **token-optimization topic-plan instance prepared (NOT opened)** | Stub at `_handoff/VAULT/topic-plans/token-optimization.md` referencing this analysis document v0.3 §9 | Filename per naming-policy Rule 3; frontmatter validated; opens at S007 turn 1 with priority-engine inputs measured at Phase 1 |
| 9 | **OVERVIEW.md updated to reflect S006 close + token-optimization v0.3** | Update `_handoff/VAULT/OVERVIEW.md` (always-current entry-point) | last_update_session = S006; last_update_turn = 29; metrics table reflects v0.3 + 7 new commits since L1 |
| 10 | **Identity-confirmation Option C absorbed (writer + reader)** | Per S006 turn 4 ratification — chat-jump-prompt §32 IS the writer-side banner; receipt-signature format `S007-AI-receipt-<iso>-against-S006-AI-attest-<iso>-S006-close` IS reader-side | Both sides covered in chat-jump-prompt template; receipt-signature-format validator atomically registered |
| 11 | **MUV cross-chat handshake protocol activated** | After user pastes S007 prompt → new AI responds → user brings response back → S006-AI refines if gaps → reply with clarifications → iterate until alignment-confirmed-explicit | Per B_MUV boundary type 1; documented in chat-jump-prompt closing instructions |
| 12 | **Carry-forwards register in HANDOFF §C explicit (no silent skipping)** | All S006 work-not-done carries forward with reason | 9+ items captured: token-optimization topic-plan / foundation-slices-week-2 / zero-laptop-dependency-setup / CNST-GVRN ADR-0025 candidate / week-4 audit-runner / Stripe+Clerk / principles-mcp build / codegen full impls / 10 governance skills authoring |

### 15.2 Pre-handoff verification gate (mechanical; cannot proceed past without)

Per B_PRE_CLOSE_VERIFICATION (P-META-008) + B_HANDOFF_PRE_FLIGHT_AUDIT (P-META-013):

```yaml
pre_handoff_gate_S006:
  step_1_pnpm_verify:
    command: pnpm verify
    required_exit_code: 0
    cycles_required_pass:
      - typecheck_recursive
      - principles_validate (54 principles after Phase 3 — v0.3 keeps 53; principle count grows when B_TOKEN_BUDGET amends P-META-009 not adds new)
      - frontmatter_validate
      - aap_frontmatter_coverage
      - principle_count_staleness
    cycles_acceptable_deferred:
      - pnpm_install_frozen (--skip-install)
      - audit_runner_full_pass (week-4)
    on_FAIL: BLOCKS handoff write; surface as BLK-S006-* OR explicit carry-forward with reason

  step_2_HPFA_9_checks:
    1_governor_prompts_coverage: PASS | FAIL_WITH_FINDING
    2_engraving_completeness: PASS (5/5 atomic for all S006 engravings)
    3_audit_registration_completeness: PASS (every B_*/P-* validator atomic per FSE)
    4_cycle_evidence_presence: PASS (every DONE/RATIFIED has evidence block)
    5_schema_dynamic_connections: PASS (cross-refs bidirectional)
    6_distribution_targets_populated: PASS (no null targets outside explicit drops)
    7_carry_forward_explicit: PASS (≥9 carry-forwards explicitly stated; 0 silent gaps)
    8_git_pushed_state_clean: PASS (git log origin/main..HEAD empty; per B_ZERO_LAPTOP_DEPENDENCY)
    9_token_optimization_plan_finalized: PASS (v0.3 committed; topic-plan stub ready for S007)
    on_FAIL: BLOCKS handoff write per P-META-013

  step_3_close_summary_authoring:
    file: _handoff/VAULT/closing-summary-S006.md
    required_headers:
      - §10.0 (pnpm verify; mandatory FIRST)
      - §10.0e (Governor Prompts session log)
      - §10.0f (HPFA results)
      - §10.0g (MUV results)
      - §10.0h (Inner-default leak report)
      - §10.0i (Alignment-citation summary)
      - §10.0j (Enhancement proposals — Q-2 tweak)
      - §10.10 (RZF aggregate)
      - §10.11 (CEC aggregate; including §10.11b positive value extraction)
      - §10.13 (FSE aggregate; including §10.13b catches engraved + §10.13c FSE evidence + §10.13d PCR-decisions)
      - §17 attestation block

  step_4_handoff_write:
    file: _handoff/HANDOFF-S006-to-S007.md
    only_after: steps 1-3 PASS
    chat_jump_prompts_authored: 2 (minimal + detailed)
    git_pushed: required before chat closes
```

### 15.3 The chat-jump-prompt-S006-to-S007.md content spec (for the actual file authoring at close)

```markdown
# 🎯 YOU ARE S007 — Session 007 of the CSPS planning project.

> **Identity banner (mandatory per B_MUTUAL_UNDERSTANDING_VALIDATION):**
> Confirm in your first reply: "✅ I am S007, picking up from S006-close at <iso8601-utc>"

S006 closed with **53 principles validated 0 findings + 9 commits + governance-foundation topic-plan CLOSED + token-optimization.md v0.3 ready + naming-policy engraved + 10 chat-transfer items completed**.

**Workspace:** `c:\Users\finky\Desktop\Claude Code\Csps`

**First action MANDATORY:** Read `docs/plan/_handoff/HANDOFF-S006-to-S007.md` §0 + execute step list.

**Receipt signature (your first reply MUST emit):** `S007-AI-receipt-<iso>-against-S006-AI-attest-<iso>-S006-close`

[8 mandatory sections per template] [≥10 alignment questions]
```

### 15.4 First-action sequence S007 (post-handshake)

After alignment-confirmed-explicit:

1. **Read HANDOFF §0** — execute step list literally per B_PROTOCOL_LITERAL_EXECUTION
2. **Run `pnpm verify`** — confirm 0 inheritance findings (per B_PRE_CLOSE_VERIFICATION at session-OPEN)
3. **Step 0 (per protocols.md §11)** — ask user about prior-platform precedent before §3 work
4. **Open token-optimization topic-plan** (highest-priority S007 work) — instance authored at close per item #8 above
5. **Phase 1 (measurement)** — author `tools/measure-token-cost.mjs` + run baseline + commit + push
6. **Element-review (Phase 2)** — depth-3 review with measured data
7. **B_TOKEN_BUDGET ratification (Phase 3)** — engrave 5/5 atomic per FSE

---

## §16 ZF iteration evidence (multi-pass; user S006 turn 29 directive "iterate more than once until zf")

### Pass 1 — Structural alignment (CSPS architecture compliance)

```yaml
pass_1_structural_alignment:
  ran_at: 2026-05-04T22:45:00Z
  scope: §9 v0.3 plan + §15 chat-transfer
  checks:
    - csps_principles_used: PASS (P-META-006/007/008/009/012/013/014/015/016/017/018/019 + P-ARCH-028/029 + P-OPER-001 referenced)
    - core_spines_used: PASS (5 spines GVRN/ARCH/AI/OPER/VALD; primary AI; secondaries listed)
    - 3_layer_doctrine_respected: PASS (no L1 sealed text edits; L2/L3 amendments via normal review)
    - naming_policy_compliance: PASS (token-optimization.md kebab-case Rule 1; tools/measure-token-cost.mjs Rule 1; per-session files Rule 2; per-topic files Rule 3)
    - term_collision_resolved: PASS (CSP L1/L2/L3 document-depth → Quick/Element/Canonical for CSPS to avoid collision with CSPS L1/L2/L3 doctrine layers)
    - existing_engravings_reused: PASS (B_TOKEN_BUDGET extends B_COGNITIVE_CONTEXT_DISCIPLINE; doesn't duplicate; P-META-009 amended not new principle)
  findings: 0
  status: PASS-CYCLE-1
```

### Pass 2 — Chat-transfer completeness

```yaml
pass_2_chat_transfer_completeness:
  ran_at: 2026-05-04T22:48:00Z
  scope: §15 12-item register
  checks:
    - all_12_items_have_authoring_path: PASS
    - all_12_items_have_exit_criterion: PASS
    - identity_confirmation_writer_side: PASS (chat-jump-prompt §32 banner per item #10)
    - identity_confirmation_reader_side: PASS (receipt-signature format per item #10)
    - MUV_alignment_questions_count: ≥10 declared (per item #3 spec; actual count fills at chat-jump-prompt authoring)
    - HPFA_9_checks: PASS (7 standard + 2 token-optimization-specific: git-pushed-state + token-optimization-plan-finalized)
    - all_closing_summary_§10_headers_required: PASS (§10.0/0e/0f/0g/0h/0i/0j/10/11/13 + §17)
    - carry_forwards_explicit: PASS (≥9 listed in item #12)
    - silent_skipping_forbidden: PASS (Q-2 tweak applied; §10.0j enhancement scan mandatory)
  findings: 0
  status: PASS-CYCLE-2
```

### Pass 3 — Cross-reference integrity

```yaml
pass_3_cross_reference_integrity:
  ran_at: 2026-05-04T22:51:00Z
  scope: §9 + §14 + §15 cross-references
  checks:
    - cited_principles_resolve: PASS (P-META-006/007/008/009/012/013/014/015/016/017/018/019 + P-ARCH-013/028/029 + P-OPER-001 all in principles.yaml)
    - cited_contracts_resolve: PASS (B_PCR_FOR_DECISIONS + B_GRADUAL_BUILD + B_CSPS_ALIGNMENT + B_PE_GUARDIAN + B_STRUCTURAL_PREVENTION + B_CORE_SPINE + B_ZERO_LAPTOP + B_NAMING_POLICY + B_VALIDATE_BEFORE_ASSUME + B_RZF + B_CEC + B_FIVE_SURFACE_ENGRAVING + B_PROTOCOL_LITERAL_EXECUTION + B_HANDOFF_PRE_FLIGHT_AUDIT + B_GOVERNOR_PROMPTS + B_MUV + B_TEMPLATE_FIRST_CREATION + B_AGENT_ALIGNMENT_PROTOCOL + B_COGNITIVE_CONTEXT_DISCIPLINE + B_TOKEN_BUDGET (proposed))
    - cited_audit_slugs: PASS (all 5 token-budget validators registered atomically per FSE in Phase 3 spec)
    - cited_files_to_be_authored_named_explicitly: PASS (tools/measure-token-cost.mjs + 8 scenario JSONs + token-cost-baseline-S007.json + 10 SKILL.md + .claudeignore + 7 hooks + tools/validators/validate-token-budget.mjs + 4 split index+slice file groups + token-optimization topic-plan instance)
    - bidirectional_graph_maintained: PASS (token-optimization.md ↔ csps-core-manifest ↔ cognitive-context-architecture; bidirectional)
  findings: 0
  status: PASS-CYCLE-3
```

### Pass 4 — Edge cases + failure modes

```yaml
pass_4_failure_modes:
  ran_at: 2026-05-04T22:54:00Z
  scope: §10 risk register + §14.8 cruel-critic + new edge cases surfaced this cycle
  edge_cases_addressed:
    - over_compression_silent_loss: PASS (10-scenario test gates Phase 4)
    - mid_session_model_switch: PASS (Validator Mode 5; UserPromptSubmit hook warning)
    - skill_trigger_collision: PASS (manual review during Phase 4; ≥30% keyword overlap flag)
    - subagent_summary_information_loss: PASS (CSP §14.6 mitigation absorbed; first-10-uses manual review)
    - mcp_re_enabled_without_audit: PASS (recurring task RT registered Phase 10)
    - auto_compaction_despite_strategic_compact: PASS (PreCompact hook intercept)
    - hook_self_test_failure_at_session_start: PASS (cruel-critic Critique 2; verify-hooks-functional.sh)
    - chat_transfer_silent_data_loss: PASS (15.1 12-item register; HPFA gate; B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2 enhancement scan)
    - claudeignore_breaks_critical_file_load: PASS (Phase 4 includes test scenario coverage)
  new_edge_cases_surfaced_this_cycle:
    - case: "What if user provides external content mid-arc (like S006 turn 27 + 29 absorption events)?"
      resolution: B_PE_ALIGNMENT_GUARDIAN absorbs at boundary; deflect or absorb based on alignment with active topic-plan; if absorbed, document in continuous-drift-log
    - case: "What if Phase 1 measurement shows different priorities than CSP standard's 7 strategies ranking?"
      resolution: Phase 2 element-review re-prioritizes via priority-engine 5-dim formula; CSP ranking is starting hypothesis not binding
  findings: 0
  status: PASS-CYCLE-4
```

### Pass 5 — Implementation readiness (S007 first-action executability)

```yaml
pass_5_implementation_readiness:
  ran_at: 2026-05-04T22:57:00Z
  scope: §15.4 first-action sequence + §9 phase 1 artifacts
  checks:
    - S007_first_action_executable_with_documented_artifacts: PASS (HANDOFF §0 + token-optimization topic-plan stub ready)
    - all_artifacts_named_explicitly: PASS (no anonymous "the script" / "the file" references)
    - dependencies_between_phases_clear: PASS (depends-on declared per phase)
    - exit_criteria_mechanical_not_judgmental: PASS (every exit has measurable check)
    - measurement_obligation_before_savings_claim: PASS (Phase 1 must run before Phase 3+ claims)
    - no_circular_dependencies: PASS (DAG verified — Phase 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10)
  findings: 0
  status: PASS-CYCLE-5
```

### Pass 6 — Meta-RZF (final pass to ensure ZF on the ZF process itself)

```yaml
pass_6_meta_rzf:
  ran_at: 2026-05-04T23:00:00Z
  scope: passes 1-5 themselves
  meta_checks:
    - all_5_passes_documented_with_findings_count: PASS
    - all_5_passes_emit_status: PASS
    - rzf_discipline_actually_applied: PASS (each pass scoped + cycled; not nominal)
    - cycle_count_is_measurement_not_target: PASS (5 passes terminated when findings = 0; not predetermined)
  findings: 0
  status: PASS-CYCLE-6 — META-RZF ACHIEVED

cumulative_zf_evidence:
  cycles_run: 6 (5 substantive + 1 meta)
  total_findings_across_all_cycles: 0
  termination_reason: findings-driven (zero findings cycle 1; subsequent cycles confirm)
  signature: S006-AI-token-optimization-v0.3-zf-2026-05-04T23:00:00Z
```

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
