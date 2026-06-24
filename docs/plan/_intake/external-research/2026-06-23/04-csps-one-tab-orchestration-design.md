# [EXT-2026-06-23-04] One-Tab Orchestration Design

**Source:** CSPS internal — OPUS-S088 design document  
**Date:** 2026-06-23  
**Pipeline entry:** `tools/data/external-research-pipeline.yaml → ext-2026-06-23-04`  
**Status:** P4-parked | PARK-043 (journey orchestrator) + pending Governor greenlight for loop-engine pilot  
**Canonical repo file:** docs/plan/_handoff/OPUS-S088-ONE-TAB-ORCHESTRATION-DESIGN.md

---

## Key sections and their implementation status

| Section | What it specifies | Status |
|---------|-------------------|--------|
| §1 THE SHIFT | One-tab orchestrated loop concept | DESIGN RATIFIED |
| §2 THREE MODELS | Model tier routing (Haiku/Sonnet/Opus) | IMPLEMENTED (model-tier-registry) |
| §3 ORCHESTRATOR CORE | Loop engine architecture | GATED — awaiting Governor pilot greenlight |
| §4 CONTEXT BUNDLE | Spawn inheritance primitive | IMPLEMENTED (S088 BOUNDARY-CONTRACT) |
| §5 INTERNAL CORE COUNCIL | In-process council prompts | DESIGN RATIFIED |
| §6 EVOLVE+PARK VIA THRESHOLD | Mid-loop input routing | IMPLEMENTED (threshold-chain live) |
| §7 SKILLS+AGENTS ARRANGEMENT | Dispatch routing | PARTIAL (DNA-Guardian wired) |
| §8 APPS/SAAS/EXTERNAL USERS | Outward-facing loop | DESIGN RATIFIED |
| §9 INHERITANCE BETWEEN TABS | Loop-state checkpoint | DESIGN RATIFIED |
| §10 EDGE CASES | IZFC sweep | DOCUMENTED in AI-COUNCIL-EDGE-CASE-PROTOCOLS.md |
| §11 WHAT EXISTS vs MISSING | Gap map | PARTIALLY CLOSED (see below) |
| §12 EXTERNAL-AI REVIEW PACKAGE | Questions for external AI | ANSWERED (ERC-001..008) |
| §13 PCR SUMMARY | Build recommendation | RATIFIED |
| §14 COMPACTING+CONTINUITY | Edge-case protocols | IMPLEMENTED (AI-COUNCIL-EDGE-CASE-PROTOCOLS.md) |
| §15 INTERNAL CORE-COUNCIL FINDINGS | 6 specific mechanisms | MOSTLY IMPLEMENTED |
| §16 AGENT-FILE-ACCESS RULE | No navigation refs in bundles | IMPLEMENTED (context-bundle.schema.json) |
| §17 MULTI-TAB PRESERVED | Both modes coexist | RATIFIED |

## §15 Implementation status detail

| §15.N | What it specifies | Status |
|--------|-------------------|--------|
| §15.1 | Gate loop-start on PARK-039 | TODO — register in loop-engine build |
| §15.2 | Typed context-bundle + validator | IMPLEMENTED (S088 BOUNDARY-CONTRACT: validate-context-bundle.mjs 4/4) |
| §15.3 | Externalize director_seal (C5) | IMPLEMENTED (validate-director-seal-packet.mjs 4/4) |
| §15.4 | Per-cycle SWIFT-absorption audit | TODO — part of loop-engine build |
| §15.5 | loop-contract.yaml at loop-init | TODO — part of loop-engine build |
| §15.6 | C6 in the loop | IMPLEMENTED (CS6 renders-in-production, S088) |

## SWIFT items from this document

**Already absorbed (no action needed):**
- §4 context-bundle → BOUNDARY-CONTRACT built S088
- §15.2 typed bundle → validate-context-bundle.mjs built S088
- §15.3 director_seal → validate-director-seal-packet.mjs built S088
- §15.6 C6 in loop → CS6 http-smoke built S088

**Parked (not SWIFT — need loop engine):**
- §3 orchestrator core → PARK-S088-LOOP-ENGINE
- §15.1 PARK-039 gate → part of loop-engine init
- §15.4 per-cycle SWIFT audit → part of loop-engine
- §15.5 loop-contract.yaml → part of loop-engine

**Disposition:** PARKED — loop-engine build gated on Governor greenlight (per ERC-003/004/007 + one-tab §18)
