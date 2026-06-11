---
id: csps.vault.research.s082-context-management-retrieval
name: S082-context-management-retrieval-research
description: >
  Absorbed research from Gemini (HCM + token efficiency) and GPT-5.5 (CoreExistenceRadar /
  CoreReuseGate / CoreSwapProtocol) on hierarchical context management, dependency-aware
  retrieval, and gradual professional swap patterns. Mapped to CSPS existing infrastructure
  and gaps. Input to Opus recommendation report.
version: "1.0"
status: absorbed
lifecycle: production
lifecycle_state: active
owner: group:finky
core_spine: AI
schema_anchor: vault_files
session: S082
sources:
  - provider: Gemini
    topic: "Hierarchical Context Management (HCM) + token-efficiency patterns"
  - provider: "GPT-5.5"
    topic: "CoreExistenceRadar / CoreReuseGate / CoreSwapProtocol"
links:
  - { rel: recommendation-report, href: ../../platform-intelligence/S082-context-retrieval-recommendations.md }
  - { rel: token-budget, href: ../../plan/pillar-0-governance/behavioral-contracts/B_TOKEN_BUDGET.md }
  - { rel: cca, href: ../../plan/pillar-0-governance/cognitive-context-architecture.md }
---

# Context Management + Retrieval Research — S082 Absorption

## Core Concepts Absorbed

### From Gemini: Hierarchical Context Management (HCM)
1. **Tier 3/2/1 Architecture (Zoom Ladder):** Forest (architecture map) → Trees (method signatures, no body) → Leaves (raw code). Default = Tier 3; only descend when match found.
2. **Topological Inverted Index:** Build a dependency DAG before any modification. Only load upstream providers + downstream consumers. Everything else is hard-blocked from context.
3. **Token stats:** 67-76% of coding agent tokens consumed just reading files. Denoising saves ~30%. Pruning must be at line/function level (Tree-sitter), never character-level.
4. **Shadow/Intercept/Deprecate pipeline:** Silent run (new shadows old) → Intercept (% routing) → Deprecate (strip old after zero calls in stabilization window).

### From GPT-5.5: CoreExistenceRadar + CoreReuseGate + CoreSwapProtocol
1. **Strangler Fig pattern:** Gradual replacement. States: Legacy Active → Hybrid/Shadow → New Primary + Legacy Fallback → Legacy Retired. No big-bang replacement.
2. **Multi-trigger existence check:** Fires at 10 lifecycle points (before create, name, add-field, add-rule, add-validator, update-template, create-how-to, add-feature, migrate/swap, final-output).
3. **7-level retrieval cascade:** Level 0 (intent fingerprint) → 1 (registry) → 2 (metadata filter) → 3 (summary scan) → 4 (candidate retrieval) → 5 (rerank) → 6 (exact fragment) → 7 (escalation).
4. **8 relevance gates:** Domain / Layer / Object-type / Lifecycle-stage / Dependency / Authority / Recency / Risk.
5. **Hot/Warm/Cold archive:** Hot = active components + current rules; Warm = recent decisions; Cold = retired/deprecated. Default search = hot first.
6. **Negative retrieval:** Record WHY items were excluded, not just what was included. Prevents "I checked" nominal claims.
7. **Dependency-neighborhood retrieval:** Before modifying X, load: component card + direct parents + direct children + validators + templates + how-to + decision log + open risks + exposed user flows. NOT the full system.
8. **Retrieval budget tiers:** Small=500-1500 tokens; Medium=2000-5000; Large=5000-15000; Full audit=explicit approval only.

## CSPS Mapping

| Research Concept | CSPS Equivalent | Gap? |
|-----------------|----------------|------|
| Tier 3 Forest (architecture map) | `.csps/threshold/L1-summaries/` (5 per-spine YAMLs) | **Partial** — exists but lightweight |
| Tier 2 Trees (signatures, no body) | Shard files (GVRN/AI/ARCH/VALD/OPER) + principle slices | **Good** — shard pattern works |
| Tier 1 Leaves (raw implementation) | Full principle/contract/validator files | **Good** |
| Zoom Ladder protocol | B_TOKEN_BUDGET R1 "L1 default, L2/L3 explicit trigger" | **Partial** — rule exists, not a formal zoom protocol |
| Intent fingerprint | CONCEPT_LOAD (per-input spine classification) + 5 Guard Questions | **Good** |
| Registry-first retrieval | behavioral-contracts-index.yaml + audit-runner-index.yaml + slice architecture | **Good** |
| Dependency DAG | `links:` frontmatter fields (manual, not aggregated) | **Missing** — no machine-readable graph |
| Entity cards at L2 | None per-component (only per-spine L1 summaries exist) | **Missing** |
| Prompt caching | B_TOKEN_BUDGET R8 "Cache-stable static context" | **Good** |
| Context orchestrator | `user-prompt-submit-context-orchestrator.sh` (ADVISORY mode) | **Partial** — built, not active |
| Reuse gate | B_NO_INVENTION + check-existing + inventory-scan hooks | **Good** |
| Hot/Warm/Cold | `.csps/threshold/L1-summaries/` (hot) + VAULT archive (cold) | **Partial** — not formally tiered |
| Shadow/Strangler Fig | B_APPS_ARE_TRIALS + sandbox lifecycle (DRAFT→RATIFIED) | **Partial** — no shadow-mode states |
| Negative retrieval | Nothing | **Missing** |
| Dependency-neighborhood | No mechanism to load "everything that depends on X" | **Missing** |
| Retrieval budget tiers | B_TOKEN_BUDGET R1-R8 (rules exist, no token numbers) | **Partial** |
| CoreExistenceRadar unified output | Multiple separate hooks (not unified output format) | **Partial** |

## Top Gaps (Priority Order)
1. **Machine-Readable Dependency Graph** — no `dependency-graph.yaml` or generation script
2. **Entity Cards at L2** — no per-component 100-250 word summary layer
3. **Context-Orchestrator Activation** — advisory mode only; never auto-activates
4. **Negative Retrieval Log** — context-orchestrator logs what was loaded, not what was excluded + why
5. **Shadow/Hybrid lifecycle states** — no Strangler Fig states for governance concept migrations
6. **Retrieval Budget with token numbers** — R1-R8 rules, no formal budget tiers
