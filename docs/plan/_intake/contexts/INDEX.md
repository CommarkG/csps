---
id: csps.intake.contexts.index
name: extraction-notes-index
description: Index of all CSPS extraction notes — makes external inputs tagged + organized + AVAILABLE FOR USAGE per user directive S008 GP-S008-09. Entry point for any AI/Governor session to discover what CSP/external inputs have been absorbed + where they route + what their deep_dive_schedule is. Composes with extractions-ledger.md (chronological log) — this index is by-leaf organization.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: novel-pending-pattern-evaluation
core_spine: GVRN
core_spines: [GVRN, ARCH, OPER, VALD]
schema_anchor: intake_contexts_index
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
session: S008
links:
  - { rel: parent, href: ./README.md }
  - { rel: ledger, href: ../extractions-ledger.md }
  - { rel: protocol, href: ../manual-protocol.md }
  - { rel: tag-status, href: ../tag-status-contract.md }
file_depth_markers:
  l1_lines: "1-50"
  l2_lines: "51-150"
  l3_lines: "151-end"
  read_protocol: "L1 = aggregate counts + fastest path to extract by topic. L2 = per-leaf inventory with cross-refs. L3 = per-extract value tier + deep_dive_schedule."
domain_path: platform
---

# Extraction Notes Index — Available For Usage

> **Per user S008 GP-S008-09 directive:** *"make it so external input are tagged and organized and available for usage."* Extraction notes already use full tag-status-contract.md frontmatter + Consolidation-Pass cross-references. This index is the entry point — start here when you need to consume what's been absorbed.

## §1 — Aggregate counts (L1 essence)

| Series | EXT IDs | Sub-IDs | Status | Top value |
|---|---|---|---|---|
| **S002 (legacy CSP)** | 5 | ~30 | mostly validated | RZF/CEC + autonomy 4-conditions + checkpoint 8-categories |
| **S008 CSP DNA series #1-5 + ops note** | 6 | 25 | triaged + scheduled | D1-D10 catalog + SWIFT/CC/Vault + IMPL_IN_PROGRESS_boost + depth-discipline + savings-SSoT unified |
| **TOTAL** | **11** | **~55** | | |

## §2 — S008 batch (most actionable; per-leaf inventory)

### 🔥 governance/priority-engine/ (4 extracts)
- [EXT-20260505-001-A](contexts/governance/priority-engine/EXT-20260505-001-A-pe-formula-validation-and-divergence.md) — PE formula validation + dimension-name divergence (CSPS Breadth/Depth/Impact/Blockers/PAS vs CSP Blast/Dependency/Idle/Bundle/PAS) — **PCR-required reconciliation**
- [EXT-20260505-001-B](contexts/governance/priority-engine/EXT-20260505-001-B-impl-in-progress-boost.md) — IMPL_IN_PROGRESS_boost (+1.5/+2.0/+3.0) — **HIGH-LEVERAGE; mechanically enforces FWWS**
- [EXT-20260505-001-C](contexts/governance/priority-engine/EXT-20260505-001-C-7-mandatory-invocation-points.md) — 7 mandatory PE invocation points + mechanical layer (CSPS-adapted to 5)
- [EXT-20260505-001-D](contexts/governance/priority-engine/EXT-20260505-001-D-7-reassessment-triggers.md) — 7 reassessment triggers (CSPS-adapted to 5)

### 🔥 governance/intake/ (1 extract — DIRECT L2 IMPACT)
- [EXT-20260505-001-E](contexts/governance/intake/EXT-20260505-001-E-swift-cc-vault-routing-and-cross-cc-bundling.md) — SWIFT/CC/Vault routing + Cross-CC PART-LEVEL bundling — **DIRECT L2 unified-intake envelope `route_to` design**

### governance/token-optimization/ (1 extract)
- [EXT-20260505-001-F](contexts/governance/token-optimization/EXT-20260505-001-F-80-10-10-session-rule-and-pillar-balance.md) — 80/10/10 session phase rule + 4-pillar balance metric

### governance/validators/ (1 extract)
- [EXT-20260505-002-A](contexts/governance/validators/EXT-20260505-002-A-validator-class-structure-smoke-test-severity-taxonomy.md) — Validator class structure 6-commitments + smoke test + severity taxonomy

### governance/agent-discipline/ (1 extract)
- [EXT-20260505-002-B](contexts/governance/agent-discipline/EXT-20260505-002-B-9-element-dna-gate-triple-check-frontmatter-rigidity.md) — 9-element DNA gate + Triple-check protocol — **extends B_AGENT_ALIGNMENT_PROTOCOL 7→9 fields**

### governance/audit-orchestration/ (1 extract)
- [EXT-20260505-002-C](contexts/governance/audit-orchestration/EXT-20260505-002-C-quality-audit-framework-AID-system-standing-authorizations.md) — Quality Audit Framework AID-NNN + 14 audit kinds + standing authorizations

### 🔥 governance/mechanical-completion/ (1 extract — HIGHEST VALUE)
- [EXT-20260505-002-D](contexts/governance/mechanical-completion/EXT-20260505-002-D-mechanical-completion-directive-D1-D10-false-lexicon.md) — **D1-D10 counter-default catalog + MECHANICAL_COMPLETION_DIRECTIVE + "false" lexicon + 5 known FP classes** — RECOMMEND S009 PCR ENGRAVING

### governance/review-discipline/ (1 extract)
- [EXT-20260505-002-E](contexts/governance/review-discipline/EXT-20260505-002-E-ivp-l3-expert-panel-cruel-critic.md) — IVP 5+1 + L3 Expert Panel 6 voices + Cruel-critic

### governance/operational-discipline/ (1 extract)
- [EXT-20260505-002-F](contexts/governance/operational-discipline/EXT-20260505-002-F-4-batch-close-file-depth-rigid-flex-5-prevention-10-scenario.md) — 4-batch close + file_depth_markers + rigid-vs-flex + 5-prevention + 10-scenario test

### 🔥 governance/anti-duplication/ (4 extracts — DISCIPLINE ALREADY ADOPTED)
- [EXT-20260505-003-A](contexts/governance/anti-duplication/EXT-20260505-003-A-single-rule-6-duplication-patterns-5-step-consolidation-pass.md) — Single rule + 6 duplication patterns + 5-step Consolidation Pass — **B_CONSOLIDATION_PASS S009 PCR**
- [EXT-20260505-003-B](contexts/governance/anti-duplication/EXT-20260505-003-B-4-invocation-triggers-pe-composition-reassessment.md) — 4 invocation triggers + PE composition
- [EXT-20260505-003-C](contexts/governance/anti-duplication/EXT-20260505-003-C-schema-and-core-spines-as-canonical-home-architecture.md) — SCHEMA + Core Spines as canonical home (CSPS L1_CORE files = HUB equivalent)
- [EXT-20260505-003-D](contexts/governance/anti-duplication/EXT-20260505-003-D-when-NOT-to-consolidate-counter-cases.md) — 6 counter-cases (when NOT to consolidate) — anti-overcorrection guidance

### 🔥 governance/depth-discipline/ (4 extracts — Phase 6 PREREQUISITES)
- [EXT-20260505-004-A](contexts/governance/depth-discipline/EXT-20260505-004-A-four-distinct-depth-level-semantics-and-unified-principle.md) — 4 distinct depth-level semantics + CSPS native 5th = 5 semantics needing disambiguation
- [EXT-20260505-004-B](contexts/governance/depth-discipline/EXT-20260505-004-B-mechanical-creation-discipline-with-placeholders.md) — Mechanical-creation discipline 5-step process with placeholders
- [EXT-20260505-004-C](contexts/governance/depth-discipline/EXT-20260505-004-C-bundling-orchestrator-pe-read-budget-extension.md) — PE.read_budget extension (60-75% reference-read reduction ESTIMATED)
- [EXT-20260505-004-D](contexts/governance/depth-discipline/EXT-20260505-004-D-composition-with-schema-corespines-and-9-improvements.md) — 9 improvements ranked by leverage × effort = direct Phase 6-10 roadmap

### governance/savings-ssot/ (3 extracts — synthesis of all CSP files)
- [EXT-20260505-005-A](contexts/governance/savings-ssot/EXT-20260505-005-A-unified-principle-savings-and-ssot-same-discipline.md) — Unified principle: savings + SSoT same discipline at different scales
- [EXT-20260505-005-B](contexts/governance/savings-ssot/EXT-20260505-005-B-7-disciplines-and-4-architectural-elements.md) — 7 disciplines + 4 cross-cutting architectural elements (CSPS architecture validation checklist)
- [EXT-20260505-005-C](contexts/governance/savings-ssot/EXT-20260505-005-C-schema-of-schemas-and-hub-per-spine-composition.md) — Schema-of-schemas index + HUB-per-spine reinforcement

### governance/edge-case-handling/ (2 extracts — Pattern A engraved this batch)
- [EXT-20260505-006-A](contexts/governance/edge-case-handling/EXT-20260505-006-A-5-edge-cases-encountered-and-resolutions.md) — 5 specific edge cases + CSPS-applicable resolutions
- [EXT-20260505-006-B](contexts/governance/edge-case-handling/EXT-20260505-006-B-7-forward-going-patterns-edge-cases-as-signals.md) — 7 forward-going patterns + single rule (Pattern A IMMEDIATELY engraved per user directive)

## §3 — How to consume extracts (usage protocol)

**For AI agents:**
1. **Need to do Phase X work?** Check token-optimization.md §9.X "CSP cross-references" block first — direct extract paths cited
2. **Don't know where a concept lives?** Search this index by topic; cross-refs in extracts point to canonical homes
3. **Authoring new artifact?** Consult depth-discipline.md (S009+) + governed-artifact-frontmatter.template.md (S009+) first
4. **Surface drift?** Run weekly tag-status-deep-audit + Consolidation Pass discipline (S009+ active)

**For Governor:**
1. **What's been absorbed?** This index — aggregate counts + per-leaf inventory
2. **What's pending engraving?** Search extracts for `🔥` markers + `S009 PCR` deep_dive_schedule
3. **What's already done?** Memory entries (MEMORY.md) + behavioral-contracts.md + extractions-ledger state column

## §4 — Tag/status compliance (governance)

Every extract carries:
- Closed-enum `lifecycle: production` + `lifecycle_state: pending-review` + `pipeline_state: routed`
- `mini_tree_layer:` (L1 essence | L2 detail | L3 deep-dive)
- `deep_dive_schedule:` (target session/phase)
- `priority_for_10_phase_completion:` (HIGH/MEDIUM/LOW)
- `consolidation_cross_refs:` (links to prior extracts; per CSP file #3 discipline)

**Audited weekly** by [tag-status-deep-audit](../../pillar-0-governance/audit-runner.md) (registered S008 turn 8 5/5 atomic per FSE; STUB → active week-4 pending settings.json registration).

## §5 — Forward-going maintenance

- **Every new EXT-ID** appended to this index same-batch as authoring
- **Every status transition** (routed → fixing → validated → closed) updates ledger; index updated at quarterly close
- **Every consolidation pass** re-validates cross-refs in this index resolve
