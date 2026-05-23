---
id: csps.governance.cognitive-context-architecture
name: cognitive-context-architecture
description: The 5-layer cognitive context architecture (CCA) every CSPS AI session uses. Quality-first design — tokens are an investment in reasoning quality, not a budget to minimize. Each layer has a defined purpose, lifecycle, and invalidation pattern. Quality gates protect against optimization-induced regression on ratification / engraving / ZF synthesis. Composes with P-META-006 (RZF + CEC), P-META-007 (FSE), P-META-008 (cycle-mandatory-in-plan); engraved as P-META-009 + B_COGNITIVE_CONTEXT_DISCIPLINE.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
  - ai-native
diataxis_type: explanation
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../../../packages/principles/principles.yaml }
  - { rel: spine, href: ./ai-behavior-spine.md }
  - { rel: contracts, href: ./behavioral-contracts.md }
  - { rel: zero-findings, href: ./zero-findings-discipline.md }
  - { rel: enforcement, href: ./mechanical-enforcement.md }
  - { rel: principles-mcp, href: ../../../packages/principles-mcp/README.md }
created-new-because: |
  No prior leaf documented how AI uses context across cognitive layers. The 5-layer model is novel
  to CSPS — it composes industry-validated primitives (Anthropic prompt caching + MCP queries +
  subagent isolation + targeted reads) into a quality-first architecture rather than a
  cost-optimization trick. User S005 turn 24 directive: "I prioritize quality and holistic context
  and solutions serving me for the long run over immediate saving — create the solution accordingly
  with a dedicated dashboard showing exactly how it is arranged + how it is schema aligned +
  reasoning next to each part + general philosophy of how it works."
domain_path: platform
core_spine: AI
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Cognitive Context Architecture (CCA)

> **Tokens are not the budget; quality of reasoning is the budget.**
>
> **Holistic context > narrow context.** Even when broader context costs more tokens, it produces decisions that don't have to be re-litigated.
>
> **Long-run > immediate cost reduction.** Engraving a robust pattern is cheaper across N sessions than re-deriving the right thing every session.

## Philosophy

CSPS treats AI as a **strategic reasoning partner**, not a function-call to minimize. Token spend is an investment with three returns: (1) decision quality at the moment, (2) decision robustness when re-encountered, (3) compounding platform integrity as engravings accumulate. **Optimization happens only when it doesn't compromise any of the three.**

The five-layer architecture below is **not a cost-saving stack** — it's a **cognitive load distribution** stack. Each layer has a different purpose, a different volatility, and a different role in the AI's reasoning. Caching, subagent delegation, MCP queries, and model routing are tools to **keep the right content available at the right cost-quality point** — not to shave tokens for their own sake.

The architecture has four invariants that protect quality:

1. **Hard reasoning never gets downgraded.** Ratification decisions / engraving / ZF synthesis / cross-pillar architecture / PCR for non-trivial — these run on Opus 4.7. Always. (Quality Gate #1)
2. **Synthesis stays in main context.** Subagents do focused work (search / fetch / log-process); the main session synthesizes. (Quality Gate #2)
3. **Mid-session edited files are re-read, not assumed cached.** Stale-context-after-edit is the worst-case quality regression. (Quality Gate #3)
4. **Cache invalidates on content change.** No nominal-RZF from stale cached principles.yaml. (Quality Gate #4)

These four invariants are the engraved hard NOs in [AGENTS.md](../../../AGENTS.md) S005 turn 24.

## The dashboard — visual arrangement

```
                    ╔════════════════════════════════════════════════════╗
                    ║   CSPS COGNITIVE CONTEXT ARCHITECTURE (CCA)        ║
                    ║   Quality-first; tokens-as-investment-not-budget   ║
                    ╚════════════════════════════════════════════════════╝

  Layer 5 ─ SUBAGENT-DELEGATED ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
            │  Isolated context; never enters main                       ┃
            │  CONTENT: search/grep walks · log processing · web research ┃
            │  PURPOSE: keep main context PURE for reasoning              ┃ ← Context-purity
            │  RETURNS: summary only (≤500 tokens typical)                ┃
            │  MODEL: Sonnet 4.6 default; Haiku 4.5 for trivial fetches   ┃
            │  QUALITY GATE: never delegate SYNTHESIS                     ┃
            ▼                                                              ┃
  Layer 4 ─ ON-DEMAND STRUCTURAL QUERIES (MCP) ━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
            │  Pre-indexed knowledge graphs                               ┃
            │  CONTENT: principles-mcp · catalog-mcp · codebase-memory    ┃
            │  PURPOSE: precise answers, not file-dump noise              ┃ ← Quality
            │  COST: ~3k tokens for structural query (vs ~50k file read)  ┃
            │  MODEL: query is data; AI reasons on result                 ┃
            │  QUALITY GATE: query result is verified-actual, not nominal ┃
            ▼                                                              ┃
  Layer 3 ─ ACTIVE WORK CONTEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
            │  Rolling working memory (5-min cache OR no-cache)           ┃
            │  CONTENT: current edits · tool outputs · reasoning thread   ┃
            │  PURPOSE: high-fidelity in-flight state                     ┃ ← Volatility
            │  STRATEGY: re-read after edits ALWAYS (no nominal-cache)    ┃
            │  MODEL: matches the work-type (Opus for hard / Sonnet for…) ┃
            │  QUALITY GATE: post-edit re-read is mandatory               ┃
            ▼                                                              ┃
  Layer 2 ─ SESSION CONTRACT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
            │  This-session boundary commitments (1-hour cache)           ┃
            │  CONTENT: HANDOFF §0 · active §3 scope · open BLK-* registry┃
            │  PURPOSE: define this-session intent + drift detection      ┃ ← Stability
            │  INVALIDATION: session-end OR explicit scope ratification   ┃
            │  MODEL: read once; reference throughout                     ┃
            │  QUALITY GATE: handoff §17 receipt signed = contract sealed ┃
            ▼                                                              ┃
  Layer 1 ─ PERMANENT CONSTITUTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
            │  Platform's ambient governance (1-hour cache)
            │  CONTENT: AGENTS.md (32+ NOs) · principles.yaml summary
            │  ·   behavioral-contracts.md TOC · spine matrix index
            │  PURPOSE: ambient context that shapes EVERY decision
            │  INVALIDATION: only on yaml/principle/contract change
            │  MODEL: load once at session-start; cache 1-hour
            │  QUALITY GATE: cache invalidates on content change (not nominal)
            ▼
        ┌───────────────────────────────────────────────────────────┐
        │ MAIN AI REASONING (Opus 4.7 default for ratification)     │
        │                                                           │
        │  Hard reasoning ─── Opus 4.7  (engraving / ZF / PCR / ADR)│
        │  Mechanical work ── Sonnet 4.6 (edits / drafts / known)   │
        │  Verifications ──── Haiku 4.5  (lookups / file existence) │
        │  Subagent default── Sonnet 4.6                            │
        │                                                           │
        │  Quality Gate (HARD): NEVER downgrade for ratification.   │
        └───────────────────────────────────────────────────────────┘
```

## Per-layer specification

### Layer 1 — Permanent Constitution

**Content (cached 1-hour breakpoint at top of context):**

| Artifact | Why this layer | Why cached |
|---|---|---|
| [AGENTS.md](../../../AGENTS.md) (~10k tokens) | The platform's hard NOs ambient on every decision | Stable across session; only changes via principles:codegen |
| [principles.yaml](../../../packages/principles/principles.yaml) summary block (top metadata + categories + counts) | Ambient awareness of all 39 principles by category | Source-of-truth file; full content via Layer 4 MCP query |
| [behavioral-contracts.md](./behavioral-contracts.md) table-of-contents (B_* names) | Ambient awareness of all 17+ contracts | TOC stable; full text via Layer 4 query when needed |
| [ai-behavior-spine.md](./ai-behavior-spine.md) discipline matrix index | Cross-reference lookup: discipline → which surfaces | Stable per-session |

**Reasoning:** Layer 1 is **ambient governance** — content that shapes every reasoning step but doesn't get re-read mid-session. Caching it (1-hour TTL) means every cycle, PCR, engraving, ZF synthesis happens with the platform's full ruleset present in working context. **The cost of NOT caching this is far higher than the cost of caching it** — without cache, Opus pays 100% input price (~$5/1M) to re-read 65k tokens 5-10× per session = $1.50-3 per session of redundant cost AND each re-read is a chance for AI to drift on what's loaded. **Caching here is a quality intervention, not a savings trick.**

**Invalidation:** Cache invalidates ONLY when source content changes. Adding a new principle to yaml → cache rebuilds. Editing AGENTS.md → cache rebuilds. Mid-session reads where content didn't change → cache hits (10% cost; same content guaranteed).

**Quality Gate #4:** Cache must invalidate on content change. Verified by `pnpm verify` running validators on actual files (not cached AI context). Anti-pattern: nominal-cache where cached snapshot drifts from disk.

### Layer 2 — Session Contract

**Content (cached 1-hour breakpoint mid-context):**

| Artifact | Why this layer | Why cached |
|---|---|---|
| Active HANDOFF §0 (paste-target block; ~5k tokens) | Defines THIS session's intent + first-actions | Stable per-session; rare in-session edit |
| Active §3 scope (ratified work for this session) | Defines what's in/out of scope for autonomous execution | Stable per-session unless explicit re-ratification |
| Open `BLK-S<NNN>-*` registry (zero or open blockers) | Live awareness of must-resolve items | Updates per turn but small (~1-3 entries typically) |
| Active session's user-intents (verbatim quotes) | Preserves user's load-bearing wording across turns | Append-only per session |

**Reasoning:** Layer 2 is **session boundary commitments**. Caching keeps the contract present without re-paste each turn. Without cache, every turn re-reads the handoff (~5-10k tokens) → ~$0.50 wasted per session AND drift risk on what's "in scope". **Caching enforces session-coherence.**

**Invalidation:** session-end OR explicit scope-change ratification (which IS a Layer 1 event — ratification triggers FSE engraving + cache rebuild).

**Quality Gate:** §17 receipt signed = contract sealed; cache loaded with the ratified state. Re-ratification mid-session (rare) explicitly invalidates.

### Layer 3 — Active Work Context

**Content (NOT cached or 5-min rolling cache):**

| Artifact | Why this layer | Why NOT 1-hour cached |
|---|---|---|
| Currently-edited files (mid-session Read/Write/Edit targets) | High volatility — content changes turn-to-turn | 1-hour cache would serve stale content; 5-min cache survives only if file unchanged in 5 min |
| Recent tool-call outputs (grep / verify / pnpm runs) | Reasoning evidence for current decision | One-shot use; cache not useful |
| Current PCR / engraving / cycle reasoning thread | The active thinking | Linear; future turns build on it |
| Recent edits' before/after diffs | RZF cycle inputs | One-shot per cycle |

**Reasoning:** Layer 3 is **volatile working memory**. Caching this is dangerous — stale content breaks RZF cycles, makes nominal-not-actual claims possible. Strategy: 5-min cache OR no-cache. **Quality Gate #3:** mid-session edited files are RE-READ, never trusted from prior reads. After every Edit/Write, the file changed; AI reads fresh state for any subsequent reasoning that depends on it.

**Anti-pattern:** "I edited X turn 3; now turn 7 I'll reason about X from memory of what I wrote." This is the failure mode that produced nominal-RZF in S005 pre-turn-18. **The discipline: re-read or grep + read offset/limit before reasoning about edited content.**

### Layer 4 — On-Demand Structural Queries (MCP)

**Content (no traditional cache; query-result shape):**

| MCP Server | What it answers | Why structural query > file read |
|---|---|---|
| [principles-mcp](../../../packages/principles-mcp/README.md) | `principles://<id>` — full principle JSON; `principles://reuse-first` alias; `check_reuse <description>` tool | Returns one principle (~500 tokens) vs whole yaml (~50k); answer is precise + indexed |
| catalog-mcp (week-3 ship per build-order.md) | `catalog://<artifact>` — frontmatter + tags + bundles; `search <terms>` | Returns matching entries (~1k) vs scanning all artifacts |
| codebase-memory-mcp pattern (week-8+ for foundation slices) | Function signatures / call chains / type definitions | Returns structural answer (~3k) vs file-by-file read (~400k measured 120× reduction) |

**Reasoning:** Layer 4 is **knowledge-graph access**. Each query is a focused information retrieval, not a file dump. The query-pattern produces **structurally-correct answers** (not just compact ones) — the AI gets exactly what it asked for, not noise around it. **This is a quality improvement, not just a cost reduction.**

**Schema alignment:** principles-mcp's URI scheme (`principles://<id>`) IS the catalog identifier per [pillar-1/frontmatter-standard.md](../pillar-1-architecture-and-stack/frontmatter-standard.md) `id:` field. Layer 4 queries map 1:1 to CSPS schema IDs. **No new schema; existing IDs queried via new transport.**

**Quality Gate:** query results are verified-actual (returned from live data store), not nominal (cached snapshot). principles-mcp re-reads `principles.yaml` at MCP-server-boot; resource queries return current state.

### Layer 5 — Subagent-Delegated

**Content (isolated context; never returns to main):**

| Delegation type | Why subagent | What returns to main |
|---|---|---|
| Search/grep walks (e.g., audit-runner registry cross-check; cited-vs-registered diff) | Output volume (~30k tokens of grep results) would pollute main context | Summary (~500 tokens): "found 30 dangling refs; here's the list" |
| Log processing (e.g., parsing `pnpm verify` JSON output for §10.0) | Verbose output stays isolated | Structured findings only |
| Web research (e.g., this Cognitive Context Architecture research turn) | External content + synthesis stays focused | Synthesis result (~5k tokens) |
| Parallel-independent reads (rare — only when wall-clock matters) | Cost is N× sequential; only use when speed dominates | Per-agent summary returned to main coordinator |
| Test runs / large file fetches | Output volume contained | Pass/fail + relevant excerpt |

**Reasoning:** Layer 5 is **context-purity protection**. Without subagent isolation, every grep walk pollutes main with noise; every log-fetch buries reasoning. Subagent isolation is **how main context stays focused on synthesis**. The cost trade-off (a subagent invocation costs Sonnet+small-overhead) is dwarfed by the quality trade-off (main context stays clean).

**Quality Gate #2:** subagents do focused work; main does synthesis. Anti-pattern: delegating PCR reasoning or ratification to subagents. The subagent doesn't see your full context; can't render PCR with the platform's full ruleset. **Synthesis stays in main.**

**When to fork vs spawn:** fork (continue parent's prompt cache) for tasks identical to parent context; spawn (fresh subagent) when independent context. Fork is cheaper on token cost AND makes the subagent more aligned (same Layer 1 + Layer 2 cache).

## Dynamic Model Routing — decision matrix

| Work-type | Model | Reasoning | Quality Gate |
|---|---|---|---|
| **Engraving (B_*, P-META-*, ADR)** | **Opus 4.7** | Cross-pillar synthesis; long-tail consequences; needs deepest reasoning | NEVER downgrade |
| **PCR rendering for non-trivial decisions** | **Opus 4.7** | Trade-space analysis; load-bearing factor identification; what-would-flip clause | NEVER downgrade |
| **ZF synthesis (RZF + CEC + FSE evidence blocks)** | **Opus 4.7** | Pattern recognition across artifacts; un-extracted-value detection | NEVER downgrade |
| **Architectural decisions / handoff drafting** | **Opus 4.7** | Long-run platform shape | NEVER downgrade |
| **Honest self-audit / catch-to-engraving cycle** | **Opus 4.7** | Meta-reasoning on own outputs | NEVER downgrade |
| **Mechanical edits (find-replace; lifecycle bumps; frontmatter adds)** | Sonnet 4.6 | Pattern application; no novel reasoning needed | OK to use |
| **Routine validation analysis (read pnpm verify output and report status)** | Sonnet 4.6 | Pattern matching on structured output | OK to use |
| **Drafting from established templates (handoff sections from prior pattern)** | Sonnet 4.6 | Template-following; not novel structure | OK to use |
| **File existence checks ("does this file exist?")** | Haiku 4.5 | Single-fact retrieval | OK to use |
| **Simple greps ("find this string")** | Haiku 4.5 | Single-shot retrieval | OK to use |
| **"Did this change since last read?"** | Haiku 4.5 | Diff check | OK to use |
| **Subagent for grep/log/fetch** | Sonnet 4.6 default | Focused scope; doesn't need Opus depth | Synthesis stays in main |

**Quality Gate #1 (HARD):** Never downgrade for any row marked "NEVER downgrade". Anti-pattern: routing PCR or engraving to Sonnet to save cost — produces nominal-quality decisions that compound into platform debt. The user's S005 turn 24 directive made this explicit: quality + holistic + long-run > savings.

## Cache Strategy

| Layer | TTL | Breakpoint placement | Why |
|---|---|---|---|
| 1 — Permanent Constitution | 1 hour | Top of system prompt + after AGENTS.md + after principles.yaml summary | Stable; high re-read; long sessions span 1 hour |
| 2 — Session Contract | 1 hour | After Layer 1 + handoff §0 + active §3 | Stable per session; rare in-session change |
| 3 — Active Work | 5-min OR no-cache | After Layer 2 (rolling) | Volatile; 5-min handles 2-3 turn-cycle within window; no-cache after edits |
| 4 — MCP Queries | n/a (server-side caching is MCP's concern) | n/a | Each query is fresh; MCP server may cache its own indices |
| 5 — Subagent Context | inherits parent cache | Fork pattern | Subagent reuses Layer 1 + 2 cache from parent |

**Anthropic constraints:**
- Up to **4 cache breakpoints per request**
- Min cache size: Opus 4.7 = 4096 tokens; Sonnet 4.6 = 2048 tokens (below = silently full price)
- Cache writes: 1.25× input price (5-min) or 2× input price (1-hour)
- Cache reads: 0.1× input price
- Break-even: 1 cache hit (5-min) or 2 hits (1-hour)
- Workspace-level isolation since Feb 2026

**CSPS placement:**
- Breakpoint 1: end of Layer 1 (after AGENTS.md + principles.yaml summary)
- Breakpoint 2: end of Layer 2 (after handoff §0 + active §3)
- Breakpoint 3: rolling 5-min cache on Layer 3 (re-rotates as session progresses)
- Breakpoint 4: reserved (e.g., for very-long Layer 3 conversation tail at 70%+ context)

**Total cache invalidation triggers:**
- Layer 1: principles.yaml change / AGENTS.md change / behavioral-contracts.md change / spine matrix change
- Layer 2: session-end / explicit ratification of new scope
- Layer 3: file edit (any Edit/Write tool call)
- Layer 4: MCP server reboot (rare; resource queries always fresh)

## Schema Alignment Table

| Layer | CSPS schema element | Cross-reference |
|---|---|---|
| 1 | AGENTS.md hard NOs | Generated from principles.yaml via codegen (week-2) |
| 1 | principles.yaml#P-* | Single source of truth for principles |
| 1 | behavioral-contracts.md § B_* | Per-discipline canonical wording |
| 1 | ai-behavior-spine.md discipline matrix | Index of disciplines × 5 surfaces |
| 2 | HANDOFF §0 frontmatter | id: csps.handoff.S<NNN>-to-S<NNN+1> |
| 2 | §3 scope per pending-work.md | Ratified work-items |
| 2 | blockers-S<NNN>.md | open / answered / carry-forward |
| 3 | Tool-call outputs (Bash/Read/Edit/Grep/Write results) | Tool result schema per Anthropic API |
| 3 | TodoWrite state | Active tasks per session |
| 4 | principles-mcp resources (`principles://<id>`) | URI = principles.yaml#<id> |
| 4 | catalog-mcp resources (week-3) | URI = catalog.json#<entry-id> |
| 4 | codebase-memory-mcp (week-8+) | Knowledge-graph nodes per Tree-sitter parse |
| 5 | Subagent context (isolated) | Agent SDK frame; doesn't leak to parent |

## Quality Gates (immutable)

These are the four invariants that protect quality across the architecture. They CANNOT be optimized away:

### QG1 — Hard reasoning never gets downgraded

Engraving / PCR-rendering / ZF synthesis / architectural decisions / honest-self-audit run on **Opus 4.7 always**. Routing these to Sonnet/Haiku produces nominal-quality outputs that compound into platform debt. Mechanically enforced via AGENTS.md hard NO + audit `model-routing-on-ratification` (planned week-4).

### QG2 — Synthesis stays in main context

Subagents do focused work (search / fetch / log / parallel-independent-reads). Main context does synthesis (PCR / engraving / cross-pillar reasoning). Subagents don't have the full context; can't synthesize correctly. Mechanically enforced via AGENTS.md hard NO + the spawn pattern (subagent prompt explicitly scopes "report findings; do not synthesize").

### QG3 — Mid-session edited files re-read mandatorily

After every Edit/Write tool call, any subsequent reasoning that depends on the edited content **re-reads** (Read with offset/limit OR Grep targeted). Memory of "what I just wrote" is the worst-case quality regression — produces nominal-RZF, drift-from-disk, post-fix breaks invisible. Mechanically enforced via Stop-hook (planned week-4) that scans for "after edit X, reasoning Y about X without re-read".

### QG4 — Cache invalidates on content change

Cache breakpoints are defined on stable content. Any change to source (yaml / md / contract) invalidates the cache. Anti-pattern: nominal-cache where AI's cached snapshot drifts from disk. Mechanically enforced by Anthropic's cache implementation (content-hash based; identical content guaranteed) + CSPS audit `cache-content-hash-fresh` (planned week-4) verifies cache breakpoint placements correspond to stable-content boundaries.

## Composes with existing CSPS principles

| CCA element | Composes with | How |
|---|---|---|
| Layer 1 ambient governance | P-META-001 defense-in-depth | Layer 1 IS the AI-cooperation layer of defense; mechanical layers (audits / hooks / ZModel) are the non-AI layers |
| Layer 1 cache invalidation | P-META-003 codegen-source-of-truth | When yaml changes → cache invalidates → AI sees fresh state |
| Layer 2 session contract | P-META-008 cycle-mandatory-in-plan | Session contract IS the plan; cycles run against the contract |
| Layer 3 re-read discipline | P-META-006 RZF | Re-run IS the proof; mid-session edits = re-read for ZF cycle |
| Layer 4 MCP queries | P-META-002 principles-travel-with-artifacts | MCP IS the inheritance bridge — graduated apps query the same URIs |
| Layer 5 subagent isolation | P-OP-001 reuse-first | Subagent forks reuse parent's cache; not parallel-spawn unless justified |
| Quality Gates | P-META-006 zero-findings-discipline | QG3 + QG4 prevent nominal-RZF; QG1 + QG2 protect synthesis quality |
| Model routing | P-OP-003 PCR + P-OP-004 batched-execution | PCR for routing decisions; batched-execution within model tier |
| Whole architecture | P-META-008 cycle-mandatory-in-plan | This leaf IS the plan-mechanical document for context discipline |

## Long-run scaling — how this architecture handles 100× growth

| Growth dimension | S005 state | 100× growth | CCA response |
|---|---|---|---|
| Principles count | 39 | 200+ (P-OP / P-ARCH / P-META combined) | Layer 1 caches yaml summary block (counts + categories); full principle text via Layer 4 MCP query — same architecture; no rewrite |
| Pillar leaves | 38 | 300+ as platform pillars expand | Layer 1 caches pillar README index; full leaf text via Layer 4 query when relevant |
| Session length | 30-90 min | 4-hour autonomous runs (week-6+ Mastra agents) | Cache TTL extends across multiple 1-hour windows via cache-rotation pattern; Layer 2 contracts get periodic re-ratification |
| Codebase size | ~50 files (skeletons) | 5000+ files (30 apps × ~150 files each) | Layer 4 codebase-memory-mcp (codebase-memory-mcp pattern) — 120× reduction measured; structural queries scale linearly with question complexity, not codebase size |
| Concurrent AI agents | 1-2 (main + occasional subagent) | 10+ (Mastra BaseAgent + persona agents) | Layer 5 subagent isolation per agent; Layer 1 + 2 shared via prompt cache (forking) |
| Audit registry | ~126 audits | 500+ as platform matures | Layer 1 caches audit-runner.md index; full audit details via Layer 4 query |

**The architecture's growth invariant:** cost grows with QUESTION complexity (Layer 4 query depth), not platform size. Adding 200 more principles doesn't make sessions 200× more expensive; it makes Layer 1's index slightly larger and Layer 4 queries equally precise.

## Operational dashboard — current S005 state

| Layer | What's loaded today | Status | Path to full implementation |
|---|---|---|---|
| 1 | AGENTS.md + principles.yaml + behavioral-contracts (no cache yet — caching is API-side, not in CSPS code) | **Active in CSPS** but NOT cached in current claude-code session unless harness configured | Configure cache breakpoints in claude-code session config; no CSPS-side change needed |
| 2 | HANDOFF + active §3 + open blockers | **Active** | Same as Layer 1 |
| 3 | Tool outputs + edited files | **Active**; quality gate QG3 enforced via discipline (need hook week-4) | Hook ship week-4 |
| 4 | principles-mcp scaffolded S005; not yet built (`pnpm install` works; build is week-2) | **Scaffolded; not running** | Week-2 per build-order.md; principles-mcp ships then |
| 5 | Subagent delegation **active** in claude-code (Agent / Explore tools) | **Active** | Already operational |

**Engraving work this session (S005 turn 24+):**
- This leaf — **DONE** (the dashboard you're reading)
- P-META-009 — Cognitive Context Architecture principle — **engraving in this session**
- B_COGNITIVE_CONTEXT_DISCIPLINE contract — **engraving in this session**
- 4 quality-gate AGENTS.md hard NOs — **engraving in this session**
- spine matrix row — **engraving in this session**
- audit registration (atomic per FSE amendment) — **engraving in this session**
- memory file + MEMORY.md index — **engraving in this session**

## Sources

- [Anthropic Prompt Caching docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) — pricing structure + breakpoints
- [Claude Code Sub-Agents docs](https://code.claude.com/docs/en/sub-agents) — context isolation pattern
- [Anthropic Adaptive Thinking](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking) — extended-thinking interaction with caching
- [codebase-memory-mcp (DEV.to)](https://dev.to/deusdata/how-i-cut-my-ai-coding-agents-token-usage-by-120x-with-a-code-knowledge-graph-4a3d) — 120× structural query measurement
- [agents.md spec](https://agents.md/) — cross-vendor AGENTS.md convention (Layer 1 source)
- [Model Context Protocol](https://modelcontextprotocol.io/) — Layer 4 transport
- User S005 turn 24 directive — quality-first framing; long-run > savings
- CSPS internal: [principles.yaml](../../../packages/principles/principles.yaml) (P-META-006 + P-META-007 + P-META-008 — the disciplines this architecture composes)

## Cross-references

- [behavioral-contracts.md § B_COGNITIVE_CONTEXT_DISCIPLINE](./behavioral-contracts.md) — the binding contract
- [ai-behavior-spine.md](./ai-behavior-spine.md) — discipline matrix row
- [zero-findings-discipline.md](./zero-findings-discipline.md) — composes for QG3/QG4
- [mechanical-enforcement.md](./mechanical-enforcement.md) — defense-in-depth model the layers compose
- [audit-runner.md](./audit-runner.md) — `cognitive-context-discipline-coverage` audit registration
- [packages/principles-mcp/README.md](../../../packages/principles-mcp/README.md) — Layer 4 implementation
