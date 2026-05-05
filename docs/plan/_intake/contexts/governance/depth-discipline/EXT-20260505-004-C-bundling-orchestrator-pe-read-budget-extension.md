---
extraction_id: EXT-20260505-004-C
parent_input_id: EXT-20260505-004
section_label: "§7 Bundling orchestrator wiring (PE.read_budget extension; CD-098 candidate)"
source_type: AI_OTHER
confidence: 0.95
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T05:05:00Z
pipeline_state: routed
routed_to: tools/pe-compute.mjs (CSPS analog; per EXT-001-C deep-dive schedule) + topic-plan §6 priority_engine extension + tools/pe-context-cache.json (NEW; cross-session L1 cache)
next_review_at: 2026-05-06T05:05:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - domain:ops
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_layer: L1+L2+L3 (essence + 5-step process + estimated savings preserved verbatim)
deep_dive_schedule: S010-S011 Phase 9 — measurement validator authoring includes PE.read_budget compute logic; depends on Extract A (depth-discipline canonical leaf) + Extract B (mechanical creation gate) populating data
priority_for_10_phase_completion: 🔥 EXCEPTIONAL — direct energy-optimization mechanism for Phase 6-10 work itself; estimated 60-75% reduction on reference-read cost per CSP empirical data
consolidation_cross_refs:
  - EXT-20260505-001-A (PE formula) — this extract EXTENDS PE output with read_budget field
  - EXT-20260505-001-C (7 PE invocation points + mechanical layer) — read_budget consumption integrates at invocation point #5 session start
  - EXT-20260505-001-E (SWIFT/CC/Vault routing) — IntakeEvent envelope `route_to` field composes (route to L1-only OR L2-detail OR L3-deep-dive read paths)
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T05:05:00Z
---

# Extract C — Bundling orchestrator wiring (PE.read_budget extension)

## Essence (DIRECT ENERGY-OPTIMIZATION MECHANISM)

CSP file #4 §7 wires PE (Priority Engine) into a **read-budget orchestrator** in addition to its work-priority role. PE consumes file_depth_markers from referenced artifacts; computes `read_budget` per work item; recommends L1-only / L2 / L3 strategy based on blast level + bundles co-located reads + caches L1 across sessions. **CSP empirical estimate: 60-75% reduction on reference-read cost per chat = ~150-300K tokens saved per chat at Opus pricing.**

## Verbatim source quotes

**PE.read_budget extension (§7):**
> "Current PE state: outputs `{ id, score, blast, dep, idle, bundle, pas, band }` per work item.
> Proposed extension: PE outputs additionally:
> ```yaml
> read_budget:
>   required_artifacts:
>     - path: PLATFORM_DNA_INDEX.md
>       depth: L1
>       estimated_tokens: 500     # from file_depth_markers
>     - path: 02_AUDIT_FRAMEWORK.md
>       depth: L2
>       estimated_tokens: 8000
>   total_estimated_tokens: 8500
>   bundle_opportunities:
>     - 'PLATFORM_DNA_INDEX.md L1 + 07_BC_GOVERNANCE.md L1 cacheable across sessions'
>   recommended_strategy: 'L1-first; escalate to L2 only if validator fails'
> ```"

**Strategy recommendation per blast (§7):**
> "If task is BLAST≤3 (LOW) + cross-spine ≤1 → L1-only is sufficient
> If task is BLAST 4-6 (MEDIUM) + active work in element → L1 + L2 of touched element
> If task is BLAST≥7 (HIGH) OR new CC composition → L1 + L2 + L3 (full read)"

**Empirical estimate (§7):**
> "Current: average chat reads 15-25 large files at full size = ~200-400K tokens just for reference reads
> With bundling orchestrator + depth markers: average chat reads same 15-25 files at appropriate depth = ~50-100K tokens
> Saving: 60-75% on reference-read cost = ~150-300K tokens per chat
> At Opus pricing ($15/M input), ~$2-5/chat saved on reference reads alone
> Marked ESTIMATED per cruel-critic amendment 1 (sealed plan). Real measurement obligation at S345 P-GOV-24 reassessment after CD-098 implemented."

## CSPS current state

- **CSPS PE** (per EXT-001-A formula + EXT-001-C invocation points) — exists at template-embedded level (gradual-build-plan template §6); NO mechanical compute layer; NO read_budget concept
- **`tools/pe-compute.mjs` candidate** (per EXT-001-C deep-dive schedule) — author S010-S011; would naturally include read_budget computation
- **`tools/pe-context-cache.json` candidate** (per EXT-001-C) — would naturally include L1 cache across sessions
- **CSPS has measure-token-cost.mjs** (S007 turn 2) — measures TOTAL tokens; no per-depth breakdown; could extend with depth-aware measurement
- **NO bundling orchestrator** — work items in CSPS topic-plans don't currently bundle reads

## Recommended downstream action

**Per save+schedule directive — schedule S010-S011 Phase 9 deep-dive:**

1. **NEW TOOL (S010-S011):** `tools/pe-compute.mjs` — CSPS Node.js analog of CSP `pe_compute.ps1`; INCLUDES read_budget computation reading file_depth_markers from `references_artifacts` field
2. **NEW SCHEMA (S010-S011):** `tools/pe-context-cache.json` — cross-session cache; includes L1 reads (low-churn; cacheable)
3. **EXTEND topic-plan §6 priority_engine** with `read_budget:` subsection per work item — same shape as CSP §7
4. **EXTEND measure-token-cost.mjs** with depth-aware measurement — measures L1 / L2 / L3 separately per artifact for empirical baseline (CRUEL-CRITIC AMENDMENT REQUIRED: 60-75% claim is ESTIMATED until measured in CSPS)
5. **NEW PE invocation point #6 in CSPS** (per EXT-001-C 5-CSPS-adapted invocations + EXT-003-B 6th = Consolidation Pass; this becomes #7 = read_budget refresh) — fires at session start AND per task
6. **CACHE L1 reads** — new convention: L1 reads of stable artifacts cached in `pe-context-cache.json` between sessions; invalidated on artifact mtime change

## Open questions

- 60-75% empirical estimate is CSP-specific — measure in CSPS at Phase 9 close before claiming any number
- L1 cache invalidation strategy — mtime-based OR content-hash-based?
- BLAST→read-strategy mapping — adopt CSP's verbatim OR CSPS-calibrate (CSPS uses Breadth/Depth not Blast per EXT-001-A divergence)
- Depth-aware Read tool wrapper — feasible to instrument Claude Code's Read tool to honor depth markers, OR depth-markers are advisory only (AI follows by judgment)?

## Engraving readiness

🔥 **EXCEPTIONAL — schedule for S010-S011 Phase 9.** Cannot be authored before Extract A (canonical leaf) + Extract B (mechanical creation gate populates data). Foundation order: A (semantics) → B (creation gate) → DATA ACCUMULATES → C (orchestrator consumes). **THIS IS WHY USER DIRECTIVE "completion of 10 phases" matters — Phase 9 measurement validator + Phase 10 continuous validation are exactly where read_budget orchestrator lives.**
