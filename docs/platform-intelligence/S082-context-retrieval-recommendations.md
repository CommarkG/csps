---
id: csps.platform-intelligence.s082-context-retrieval-recommendations
name: S082-context-retrieval-recommendations
description: >
  Opus-targeted report: how CSPS should apply Gemini + GPT-5.5 research on
  hierarchical context management, dependency-aware retrieval, and gradual
  swap patterns. Maps research to what CSPS already has; identifies 8 gaps;
  produces ranked action plan. Governor-directed S082.
version: "1.0"
status: draft
lifecycle: production
lifecycle_state: active
owner: group:finky
core_spine: AI
schema_anchor: pillar_0_governance_leaves
diataxis_type: reference
impl_status: swift-implemented
session: S082
links:
  - { rel: research-vault, href: ../plan/_handoff/VAULT/research/S082-context-management-retrieval-research.md }
  - { rel: token-budget, href: ../plan/pillar-0-governance/behavioral-contracts/B_TOKEN_BUDGET.md }
  - { rel: cognitive-context-architecture, href: ../plan/pillar-0-governance/cognitive-context-architecture.md }
  - { rel: platform-intelligence-index, href: ./README.md }
---

# Context Management & Retrieval — Recommendations for Opus

**From:** Sonnet S082 analysis of Gemini + GPT-5.5 external research
**To:** Opus-19 (director) + Governor
**Date:** 2026-06-09
**Purpose:** How CSPS makes the most of these research insights as a top-expert platform

---

## Executive Summary

Both research sources are describing a problem CSPS already partially solved — then proposing infrastructure CSPS needs to finish building. The mapping is striking:

| Research proposes | CSPS already has |
|-------------------|-----------------|
| Tier 3/2/1 zoom ladder | L1 summaries → shard files → principle slices |
| Intent fingerprint | CONCEPT_LOAD + 5 Guard Questions |
| Registry-first retrieval | behavioral-contracts-index.yaml + shard/slice architecture |
| Prompt caching | B_TOKEN_BUDGET R8 "cache-stable static context" |
| Reuse gate | B_NO_INVENTION + pre-tool-use-check-existing + inventory-scan hooks |
| Context orchestrator | `user-prompt-submit-context-orchestrator.sh` (exists, advisory) |

**The honest assessment:** CSPS got 60% of this right intuitively. The remaining 40% — dependency graph, entity cards, context-orchestrator activation, negative retrieval, shadow-mode lifecycle, retrieval budgets — is the build agenda this research is pointing at.

---

## What the Research Actually Says

### Gemini: Hierarchical Context Management

The core insight is the **Zoom Ladder**: don't load raw code — build a 3-tier abstraction:
- **Tier 3 (Forest):** High-level architecture maps, layout schemas. Cheap. Always query this first.
- **Tier 2 (Trees):** Class/method signatures with no body (`def calculate_yield(...) -> float: ...`). Medium cost. Load when Tier 3 gives a match.
- **Tier 1 (Leaves):** Raw implementation. Expensive. Load ONLY for the specific files being modified.

Result: a 100K-line codebase in 2,000 tokens instead of 500,000.

The second insight is **Shadow/Intercept/Deprecate** — never replace something wholesale. Route 1% traffic to the new engine, compare outcomes, expand if no regressions, deprecate old only after zero calls in a stabilization window.

### GPT-5.5: CoreExistenceRadar / CoreReuseGate / CoreSwapProtocol

The key insight is the **trigger mesh** — "see what exists" should not be ONE checkpoint. It should fire at 10 lifecycle points (before create, name, add-field, add-rule, add-validator, template-update, how-to creation, feature addition, migration, and final output).

The retrieval should be a **7-level cascade** — not "read everything," but: intent fingerprint → registry → metadata filter → summary scan → candidate → rerank → exact fragment → escalate only if needed.

The **dependency-neighborhood** is the efficient version of "don't miss things" — before modifying X, load only its direct parents/children/validators/templates/decision-log, not the whole platform.

---

## What CSPS Already Has (Verified This Session)

### ✅ Confirmed Strong

**1. Shard/Slice Architecture = Tier 2/Tier 1 already built.**
CSPS uses shard files (behavioral-contracts-GVRN.md etc.) as Tier 2, and individual slice files (B_COUNCIL_PEER.md etc.) as Tier 1. Loading one slice instead of the full monolith IS the research's token-efficient pattern. This is a genuine CSPS advantage — the platform discovered this independently.

**2. `.csps/threshold/L1-summaries/` = Tier 3 already built.**
Five per-spine YAML summaries (GVRN/AI/ARCH/VALD/OPER) at `.csps/threshold/L1-summaries/` ARE the "architecture map" layer. This is the Forest tier. The problem: these summaries are currently almost empty (`top_patterns: [], session_count: 0`). The infrastructure exists; the content doesn't.

**3. B_TOKEN_BUDGET R1 = Default Tier 3 policy already ratified.**
"Every response defaults to L1. L2/L3 require explicit trigger." This is the zoom ladder policy. It's ratified. It's just not implemented as a mechanical protocol — it's advisory.

**4. CONCEPT_LOAD = Intent Fingerprint already built.**
Per-input spine classification before any processing fires on every turn. This is Gemini's "Stage 1: Zoom Out" (query high-level architecture map). The implementation is in the UserPromptSubmit injection.

**5. Context-Orchestrator Hook = Level 0-3 cascade already built but ADVISORY.**
`user-prompt-submit-context-orchestrator.sh` detects task-class from the user prompt and suggests context-loading templates. This IS the intent fingerprint → registry lookup → metadata filter chain. The problem: it's advisory (suggests, doesn't enforce). The research calls for enforced retrieval gates.

**6. ReUse Gate = Multiple overlapping hooks.**
`pre-tool-use-check-existing.sh` + `pre-tool-use-inventory-scan-required.sh` + B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK fire before creates. The GPT-5.5 "CoreReuseGate" is essentially these hooks unified.

### ⚠️ Partial / Advisory

**7. Hot/Warm/Cold** — `.csps/threshold/L1-summaries/` is the hot set. `VAULT/archive/` is the cold archive. But there's no formal "warm set" (recently-used decisions, prior swaps, active dependencies loaded preferentially). Retrieval doesn't prioritize hot over cold.

**8. Prompt Caching** — R8 "Cache-stable static context" is the policy. The shard architecture promotes cache stability (static prefix). But there's no measurement of actual cache hit rate.

---

## The 8 Gaps — Ranked by Impact

### Gap 1 — CONTEXT-ORCHESTRATOR ACTIVATION (HIGHEST IMPACT, LOWEST EFFORT)

**Research says:** Enforced retrieval gates, not advisory suggestions.
**CSPS state:** `user-prompt-submit-context-orchestrator.sh` exists, detects task-class, logs suggestions — but never ENFORCES. The hook was designed as advisory (Phase 9) with active enforcement deferred (Phase 10).
**Impact if fixed:** This is the single highest-leverage action. Activating this hook makes the existing Tier 3→2→1 zoom ladder mechanical instead of dependent on AI cooperation.
**Recommendation:** Promote context-orchestrator to BLOCKING for high-cost operations (full-system reads, multi-file edits). For low-cost operations, keep advisory.

---

### Gap 2 — MACHINE-READABLE DEPENDENCY GRAPH (HIGH IMPACT, MEDIUM EFFORT)

**Research says:** Before modifying X, build a dependency DAG: upstream providers + downstream consumers. Only load these two zones.
**CSPS state:** Every artifact has `links:` frontmatter fields (relationship declarations). But they're not aggregated into a traversable graph. There's no `dependency-graph.yaml` or generation script.
**Impact if fixed:** Enables "neighborhood retrieval" instead of full-system scans. Before modifying B_COUNCIL_PEER, load only: ai-collaboration-charter (parent) + D2/D10/D17 (dependents). Before touching a validator, load only: the principle it enforces + the contracts that cite it.
**Recommendation:** Script that walks all `links:` frontmatter fields → emits `tools/data/dependency-graph.yaml` as a directed graph. One session to build; massive ongoing value.

---

### Gap 3 — ENTITY CARDS AT L2 (HIGH IMPACT, MEDIUM EFFORT)

**Research says:** Tier 2 = method signatures with no body. 100-250 word summaries per component that act as the retrieval intermediary — query these BEFORE loading full files.
**CSPS state:** `.csps/threshold/L1-summaries/` has per-spine summaries (5 YAMLs). But they're currently almost empty (top_patterns: [], session_count: 0). No per-component cards at L2.
**Impact if fixed:** A developer or AI looking for "what handles session governance" can query the GVRN-summary.yaml, find the candidate components, then load only those slices. Currently: must know file names or search broadly.
**Recommendation:**
1. Populate `.csps/threshold/L1-summaries/` per-spine YAMLs with active content
2. Create L2 entity cards (100-250 words each) for the ~30 highest-traffic components. Candidates: each behavioral contract shard, each planning-spine stage, each major validator, each skill.
3. Consider a `generate-entity-cards.mjs` script that extracts frontmatter `description:` + `links:` from all files > 1KB as an auto-generated L2 layer.

---

### Gap 4 — NEGATIVE RETRIEVAL LOG (MEDIUM IMPACT, LOW EFFORT)

**Research says:** "Reason irrelevant items were excluded" — record WHY something was not loaded, not just what was loaded. Prevents repeated re-checking and closes the nominal "I checked" failure mode.
**CSPS state:** The context-orchestrator hook logs what was suggested for loading. It doesn't log what was considered and excluded + the reason.
**Impact if fixed:** Closes a specific nominal failure mode: "I checked for X and found nothing" without citing what was searched, in what registries, with what metadata filter. The negative retrieval log IS the evidence-paste requirement (P-META-032) applied to context selection.
**Recommendation:** Add a `negative_retrieval` section to the context-orchestrator output JSON: `{"excluded": [{"id": "...", "reason": "different domain", "confidence": "high"}]}`. Low implementation cost; high epistemic value.

---

### Gap 5 — SHADOW/HYBRID LIFECYCLE STATES FOR GOVERNANCE MIGRATIONS (HIGH IMPACT, MEDIUM EFFORT)

**Research says:** Strangler Fig pattern. States: Legacy Active → Hybrid/Shadow → New Primary + Legacy Fallback → Legacy Retired.
**CSPS state:** Current lifecycle for governance artifacts is DRAFT → SANDBOX → RATIFIED → IMPLEMENTING → DONE. When a principle or contract is REPLACED (e.g., P-META-035 extends P-META-034, B_COUNCIL_PEER adds to ai-collaboration-charter §2.5), the old content is modified or superseded without explicit shadow-mode tracking.
**Impact if fixed:** Safer governance migrations. The current session built B_COUNCIL_PEER by extending ai-collaboration-charter §2.5 (correct Strangler Fig approach). But there's no formal record that "the old §2.5 governing_intent is now deprecated in favor of the Ben Zoma text." If the migration had caused a regression, there'd be no shadow-mode fallback.
**Recommendation:** Add `lifecycle_states` for governance artifacts: `active | shadow | hybrid | primary | deprecated | retired`. The `status:` field is currently used loosely — formalize it with the Strangler Fig states for contract/principle migrations.

---

### Gap 6 — RETRIEVAL BUDGET TIERS (MEDIUM IMPACT, LOW EFFORT)

**Research says:** Every task should have a retrieval budget. Small=500-1500 tokens; Medium=2000-5000; Large=5000-15000; Full audit=explicit approval only.
**CSPS state:** B_TOKEN_BUDGET R1-R8 give behavioral rules (L1 default, L2 on trigger, etc.) but no token numbers per task type.
**Impact if fixed:** Mechanical enforcement of context size. Right now "L1 only by default" is a behavioral instruction. Adding token numbers makes it measurable (validate: context loaded < budget for task type).
**Recommendation:** Add B_TOKEN_BUDGET R9 "Retrieval Budget Tiers" with these specific numbers from the research as a starting point. Note that R6 already tracks `/cost measurement` — R9 adds a pre-task budget as a constraint, not just post-task measurement.

---

### Gap 7 — PROGRESSIVE ZOOM PROTOCOL AS EXPLICIT DOCTRINE (LOW IMPACT, LOW EFFORT)

**Research says:** Progressive zoom ladder: Zoom 0 (exact component) → Zoom 1 (same workflow) → ... → Zoom 6 (whole system). Only go wider if no candidates found, conflict detected, or governance risk requires it.
**CSPS state:** The zoom ladder exists implicitly as L1→L2→L3 doctrine + B_TOKEN_BUDGET R1. But it's not a single retrievable protocol document.
**Impact if fixed:** Developer/AI clarity on when to widen context. The rule exists; the explanation is fragmented across B_TOKEN_BUDGET + P-META-009 + threshold/L1-summaries documentation.
**Recommendation:** One-page "Context Zoom Protocol (CZP)" in `docs/plan/pillar-0-governance/` formalizing the 6 zoom levels mapped to CSPS artifacts. Low effort, valuable as a reference.

---

### Gap 8 — UNIFIED EXISTENCE RADAR OUTPUT FORMAT (MEDIUM IMPACT, MEDIUM EFFORT)

**Research says:** CoreExistenceRadar returns a compact result with: detected action type, detected domain, candidates-found, recommended-action (reuse/extend/create/merge/retire), and — critically — excluded items with reason.
**CSPS state:** Multiple separate hooks return different output formats (pre-tool-use-check-existing.sh, pre-tool-use-inventory-scan-required.sh, consolidation-expert skill). No unified output format.
**Impact if fixed:** A single ExistenceRadar output that any hook, skill, or validator can produce and any hook, session gate, or closing summary can consume. Enables the "recommended-action" discipline at platform level.
**Recommendation:** Define `ExistenceRadarResult` schema in frontmatter-closed-enums.md. Migrate consolidation-expert skill output to match. Emit from context-orchestrator hook.

---

## Prioritized Action Plan for Opus

### TIER 1: Highest value, CSPS-ready now

**Action 1:** Activate context-orchestrator hook for high-cost operations (PHASEB).
- Already built: `user-prompt-submit-context-orchestrator.sh`
- Gate: After cycle-counter reconciliation (gap_CYCLE_COUNTER_DISCREPANCY closed)
- Session estimate: 1 session to promote advisory → BLOCKING for specific operations

**Action 2:** Populate `.csps/threshold/L1-summaries/` per-spine YAMLs with real content.
- Infrastructure exists; content is empty (`top_patterns: [], session_count: 0`)
- Can be done NOW — no gating dependencies
- High immediate value: enables L1 Forest queries

**Action 3:** Script to generate dependency-graph.yaml from frontmatter `links:` fields.
- 1 script (generate-dependency-graph.mjs), 1 data file, 1 validator
- Unlocks neighborhood retrieval for all future modifications
- No architecture changes needed

### TIER 2: Important, moderate effort

**Action 4:** Entity cards at L2 for top-30 components.
- Extend L1-summaries pattern to per-component cards
- Or: extract from frontmatter `description:` fields via script
- Prerequisite: Gap 1 + Gap 3 done first

**Action 5:** Add B_TOKEN_BUDGET R9 "Retrieval Budget Tiers" with token numbers.
- Extend existing B_TOKEN_BUDGET; Opus ratification required
- Maps research numbers to CSPS task types (concept-work / validator-build / full-audit)

**Action 6:** Negative retrieval log in context-orchestrator output.
- Small JSON extension; immediate value for ZF evidence discipline

### TIER 3: Strategic, later sessions

**Action 7:** Formalize Shadow/Hybrid lifecycle states for governance migrations.
- Requires frontmatter-closed-enums.md update + Opus ratification
- Relevant for any future principle/contract replacement (e.g., B_COUNCIL_PEER patterns)

**Action 8:** Context Zoom Protocol (CZP) document — 1-page reference.
- Low effort; consolidates existing rules into one retrievable doc

---

## The CSPS-Specific Insight That Research Missed

Both sources are writing for generic large-scale systems. CSPS has a structural advantage neither paper models: **the council (Opus + Sonnet) IS the retrieval layer.**

The research assumes an autonomous agent that must self-determine relevance. CSPS externalizes that judgment to Opus (director) who issues targeted PROTOs, and to the hook system that filters at the boundary. The real CSPS implication is:

> **The dependency graph + entity cards aren't for the AI to self-retrieve — they're for Opus to issue better PROTOs.**

When Opus writes "PROTO-S082-ITEM-4 — threshold weave," Opus currently has to know from memory which threshold files exist. If `dependency-graph.yaml` and entity cards existed, Opus could query the graph and say "threshold-gate.md has 8 dependents — all of which must be updated in the same PROTO." That's the CSPS-specific value of Gaps 2 and 3.

---

## Confidence Assessment

| Claim | Confidence | Evidence |
|-------|-----------|---------|
| Context-orchestrator hook exists but is advisory | HIGH | Read hook file this session; "Advisory → Active" comment confirmed |
| L1-summaries exist but are empty | HIGH | `ls` confirmed 5 files; `head -8` confirmed empty content |
| Shard/slice pattern = Tier 2/1 analogue | HIGH | Direct mapping verified this session |
| No dependency-graph.yaml | HIGH | `find` confirmed no such file exists |
| B_TOKEN_BUDGET R1-R8 exist, no token numbers | HIGH | Read B_TOKEN_BUDGET this session |
| CONCEPT_LOAD fires per-turn | HIGH | Verified via UserPromptSubmit hook injection |
| 67-76% token waste from file-reading | UNCERTAIN | Research claims — not measured in CSPS; R6 cost measurement is the right next step |

*This is Sonnet-quality analysis. For deeper architectural synthesis on any specific gap, prepare a compact version and escalate to Opus.*
