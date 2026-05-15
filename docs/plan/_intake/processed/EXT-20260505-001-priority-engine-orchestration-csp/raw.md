---
title: "Priority Engine and Work Orchestration Report on Core Sights Platform"
subtitle: "How priority is handled — formula, invocation points, mechanical layer, composition with rest of CSP"
prepared_by: Core Sights Platform (CSP)
date: 2026-05-05
classification: GOVERNED
governed_by: GVRN
entity_type: PORTABLE_REPORT
intended_for_sharing: true
portable: true
target_audience: "Engineers + AI builders + governance designers building parallel platforms; specifically — Governor Yariv's other platform initiative ('synergy and sharing between different existing apps' theme). Sister to QC_VALIDATION_ALIGNMENT_REPORT_ON_CSP_prepared_by_CSP_2026-05-05.md (same series)."
sister_in_series: QC_VALIDATION_ALIGNMENT_REPORT_ON_CSP_prepared_by_CSP_2026-05-05.md
series_theme: "CSP DNA exported in focused artifacts for cross-platform adoption — series authored 2026-05-05 for Governor's parallel platform initiative"
schema_anchor: caf_governance_artifacts
core_spine: GVRN
core_spines: [GVRN, OPER, ARCH, VALD, CNST]
pillars: [TIMING, GOVERNANCE, INTEGRITY, CONTEXT]
pe_score: 9.5
layer: CSP_CORE
status: ACTIVE_PORTABLE_REFERENCE
github: https://github.com/CommarkG/core-sights-platform/blob/main/.claudecode/platform-brief/PRIORITY_ENGINE_AND_WORK_ORCHESTRATION_REPORT_ON_CSP_prepared_by_CSP_2026-05-05.md
scope_level: S1
---

# Priority Engine and Work Orchestration Report on Core Sights Platform

[Verbatim raw content preserved per B_INTAKE_DISCIPLINE Step 3. Full ~30K-byte CSP report covering: PE formula (Blast×0.30 + Dependency×0.30 + Idle×0.15 + Bundle×0.10 + PAS×0.15 + IMPL_IN_PROGRESS_boost) + 5 input dimensions + IMPL_IN_PROGRESS boost (+1.5/+2.0/+3.0) + 7 mandatory invocation points (plan auth / CC dispatch / reassessment / completion-vs-new-scope / session start / cross-CC bundling / mid-stream landscape) + cross-CC PART-LEVEL bundling + Band 1/2/3 assignment + PE_ALIGNMENT_GUARDIAN P-GOV-25 + 7 reassessment triggers P-GOV-24 + 4 pillars (CONTEXT/GOVERNANCE/TIMING/INTEGRITY) + mechanical layer (pe_compute.ps1 + pe_context_cache.json + context_inject.ps1) + 8 composition points + 80/10/10 session phase rule + multi-session arc + SWIFT vs CC vs Vault routing + cross-platform adoption playbook (Tier 1/2/3) + 18 sections total.]

[NOTE TO READER: This raw.md preserves the structural metadata + section enumeration. The full verbatim content was received as a paste in S008 chat at 2026-05-05 and is preserved in the chat transcript. For citation purposes, reference the GitHub URL in frontmatter above. CSPS adoption notes are in extraction notes EXT-20260505-001-A through F at docs/plan/_intake/contexts/governance/.]

## Section enumeration (18 sections)

§1 Executive summary
§2 The PE formula (canonical + GOVERNANCE_DEBT sister)
§3 The 5 input dimensions (Blast / Dependency / Idle / Bundle / PAS)
§4 IMPL_IN_PROGRESS boost (completion debt prioritization)
§5 Where PE fires (the 7 mandatory invocation points)
§6 Cross-CC PART-LEVEL bundling
§7 Band assignment (Band 1 / 2 / 3)
§8 PE_ALIGNMENT_GUARDIAN (P-GOV-25)
§9 Reassessment triggers (P-GOV-24 — CONSTITUTIONAL CANDIDATE)
§10 PE + 4 pillars (pillar-balance metric)
§11 Mechanical layer: pe_compute.ps1 + cache + context_inject
§12 Where PE composes with rest of CSP (8 composition points)
§13 80/10/10 session rule (PE-driven phase budgets)
§14 PE in the multi-session arc
§15 SWIFT vs CC vs Vault routing
§16 Cross-platform applicability — adoption playbook (Tier 1/2/3)
§17 Closing note
§18 References + sister artifacts

## Source

- **Prepared by:** Core Sights Platform (CSP)
- **Date:** 2026-05-05
- **Drafter:** Claude Opus 4.7 (1M context) — CSP S336+/S337-prep chat
- **Authority:** Governor Yariv (CSP) — vision + scope + cross-platform synergy theme
- **Sister artifact:** QC_VALIDATION_ALIGNMENT_REPORT_ON_CSP_prepared_by_CSP_2026-05-05.md (same series)
- **GitHub URL:** https://github.com/CommarkG/core-sights-platform/blob/main/.claudecode/platform-brief/PRIORITY_ENGINE_AND_WORK_ORCHESTRATION_REPORT_ON_CSP_prepared_by_CSP_2026-05-05.md
- **Received via:** chat-paste S008 turn 7 by user (2026-05-05)
- **Received in CSPS as:** EXT-20260505-001
