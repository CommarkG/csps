---
id: csps.platform-audit.spine.gvrn
name: spine-GVRN
description: >
  Domain card for the GVRN (Governance) Core Spine. GVRN governs how the platform
  governs itself — decision rights, ZF discipline, behavioral contracts, the Threshold,
  and session protocols. Highest precedence spine: GVRN wins when in conflict with any other.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: platform_audit
enforcement_stage: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ../README.md }
  - { rel: implementation, href: ../../../plan/pillar-0-governance/ }
  - { rel: contracts, href: ../../../plan/pillar-0-governance/behavioral-contracts.md }
  - { rel: principles, href: ../../../packages/principles/principles.yaml }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/csps-core-manifest.md
  - docs/plan/pillar-0-governance/behavioral-contracts.md
  - docs/plan/pillar-0-governance/audit-hub.md
---

# GVRN — Governance Spine

## §1 Identity

**What I am:** The governance layer of CSPS. I define how the platform makes decisions, enforces constraints, and improves itself. I am the meta-layer — I govern how everything else is governed.

**Core spine position:** GVRN (highest precedence). When GVRN conflicts with any other spine, GVRN wins.

**Who I am part of:** Platform-level (Layer 0/1 boundary — GVRN is both a spine and the meta-framework for all spines).

**My sub-parts:**
- Decision Rights (who can decide what)
- ZF Discipline (Zero-Findings — the evidence mandate)
- Behavioral Contracts (50 B_* contracts enforcing AI behavior)
- The Threshold (session-open governance gate)
- Session Protocols (S<NNN> governance lifecycle)
- Engraving Discipline (5-surface canonical persistence)
- Learning Loop (catch → engrave → validate → prevent)

---

## §2 The Problem I Solve

**Without GVRN:** Decisions are made without records. AI behavior drifts without correction. Session knowledge evaporates at session close. The same mistakes recur session after session. Governance is retrofitted after the fact — at 3× the cost.

**What breaks specifically:**
- Platform-wide architectural decisions are made twice (nobody remembers the first one)
- AI declares work complete without verification — ZF is nominal
- Session-to-session context is lost — each session re-establishes context from scratch
- Governance is documentation, not enforcement — it can be ignored without consequence

---

## §3 My Principles

**Foundation principles:**
- `P-META-006` — Zero-Findings (RZF): no DONE claim without THIS-SESSION evidence
- `P-META-019` — Structural Prevention: fix structure, not instances (K=2 trigger)
- `P-META-020` — Concept-First Governance: context is the compass; CONCEPT_LOAD mandatory
- `P-META-021` — Triad Governance: context + principle + mechanical = minimum viable
- `P-META-016` — Gradual-Build-By-Foundations: gates before phases

**Key behavioral contracts:**
- `B_HUMBLE_EXECUTOR` — closed-circle milestone protocol; no phase advance without extraction
- `B_AUTONOMOUS_BATCH_WITH_PREFLIGHT` — pre-flight Q-GATE required before any batch
- `B_COMPLETION_OVER_SHINY` — in-progress work scores 1.5× before new items
- `B_CONCEPT_LOAD` — CONCEPT_LOAD mandatory before any substantive response
- `B_CATCH_TO_ENGRAVING` — no gap may decay at session-end without persistent artifact
- `B_POSITIVE_VALUE_EXTRACTION` — CEC cycle mandatory when positive event occurs

---

## §4 How I Work

**Depth 1 — Executive view:**
Every session opens through the Threshold (governance gate). Work is sequenced by the Priority Engine. ZF gates validate each phase. Session closes with extraction + handoff + HPFA audit. The governance loop is: plan → execute → validate → extract → engrave.

**Depth 2 — Operational view:**
The Threshold fires on session-open: session-state.json is read, pnpm verify confirms 41 validators pass, VLT-blocking confirms 0 PENDING, CONCEPT_LOAD fires. The PE sequences work by formula: breadth × depth × impact ÷ dep_satisfied ÷ multi_session_cost. ZF runs in 3 levels: Level 1 (advisory), Level 2 (phase gate), Level 3 (session close — deep, required). Behavioral contracts (50) are the mechanical layer that makes governance non-optional for AI instances.

**Depth 3 — Implementation view:**
- `session-open.sh` hook fires Q1-Q15 checks at session start
- `validate-phase-exit-criteria.mjs` is the FOUNDATION_EXIT_GATE
- `zf-orchestrator.mjs --level 3` runs 5 cycles, requires 0 BLOCKING
- `closing-summary-template.md` §10.0a-m are the 13 mandatory closing checks
- `HPFA` (Handoff Pre-Flight Audit) runs 7-check walk before handoff write
- Governor Prompts: every substantive prompt logged with verbatim + tags

---

## §5 Dependencies & Blast Radiuses

**What I depend on:**
- VALD (validation evidence — every ZF claim routes through VALD validators)
- AI (context management — the Threshold needs CONCEPT_LOAD which is AI spine)
- Platform Services: Vocabulary (terms used in contracts), QC/Audits (the validators I require)

**Blast Radiuses:**
- **BR1 (element-level):** A change to a single behavioral contract — affects one enforcement surface
- **BR2 (domain-level):** A change to session protocols — affects every session open/close (all sessions)
- **BR3 (platform-wide / Constitutional):** A change to L1_CORE sealed doctrine or a meta-principle — affects all 5 spines simultaneously. Requires multi-session arc + ADR.

---

## §6 Personas

**Default persona — Governor:**
Makes architectural decisions. Ratifies principles and behavioral contracts. Provides explicit direction. Never asks "would you like me to?" — decides and acts.

**Sub-personas:**
- **Session Auditor:** Reviews HPFA + closing-summary §10.0 completeness before sign-off
- **Contract Reviewer:** Reviews proposed behavioral contracts before ratification
- **Platform Historian:** Reads extraction notes + handoffs to maintain institutional memory

**AI behavior in GVRN domain:**
- *Spine-level:* All decisions are traceable; every claim cites this-session evidence
- *Platform-level:* GVRN governs all other spines; never override a GVRN constraint from a lower spine
- *GVRN-unique:* Push-back is mandatory when a Governor assertion contradicts a ratified principle; silence = tacit endorsement of error

---

## §7 Human Journeys

**Governor (developer + decision-maker) journey:**
1. Open session → Threshold fires (session-open.sh)
2. Review priority queue (PE output)
3. Ratify or direct work
4. Review ZF evidence before sign-off
5. Session closes: extraction + handoff + push

**External advisor journey:**
1. Read README (3 min) → 01-problems → 02-principles → 03-overview
2. Read this GVRN artifact for governance domain context
3. Query via MCP: `get_principle("P-META-006")`, `find_by_spine("GVRN")`
4. Advise on the specific governance question with full context

---

## §8 Vocabulary

**Terms I own:**
- `ZF (Zero-Findings)` — the evidence mandate; no DONE without proof
- `RZF (Re-Zero Findings)` — re-run IS the proof; memory is not evidence
- `CEC (Complete Extraction Cycle)` — positive harvest: walk all surfaces until 0 new opportunities
- `Threshold` — the governance entry point for every session and every input
- `HPFA (Handoff Pre-Flight Audit)` — 7-check whole-session gate before handoff write
- `Triad Governance` — context + principle + mechanical = minimum viable governance

**Terms I use from other elements:**
- `PE (Priority Engine)` — from Platform Services
- `CONCEPT_LOAD` — from AI spine (but I mandate it via B_CONCEPT_LOAD)
- `validate-*` validators — from VALD spine

---

## §9 MCP Surface

**What I expose:**
```
get_principle("P-META-*")           → meta-governance principles
get_behavioral_contract("B_*")      → contract body + enforcement details
get_session_protocol("section")     → §10.0 closing steps, §11 closure
get_zf_level("1|2|3")              → ZF level requirements
find_by_spine("GVRN")              → all GVRN-governed elements
```

**Query examples:**
- "What does triad governance require?" → `get_principle("P-META-021")`
- "What are the ZF Level 3 requirements?" → `get_zf_level("3")`
- "What behavioral contracts enforce GVRN discipline?" → `find_by_spine("GVRN")`

---

## §10 Current State & Evolution

**Implemented today (enforcement_stage: active):**
- 50 behavioral contracts (50 ACTIVE)
- 41 validators in pnpm verify
- ZF orchestrator (3 levels)
- Session protocols (protocols.md)
- HPFA (7-check gate)
- Governor Prompts logging (stub → week-4)
- Closing-summary template §10.0a-m

**Planned (enforcement_stage: week-4 / planned):**
- `concept-load-declared` validator (week-4) — detects missing CONCEPT_LOAD
- `push-back-on-conflict` audit (future) — detects missed push-back opportunities
- `threshold-completeness` validator (week-4) — session-open sequence verification

---

## §11 Connection Map

| Connected to | How |
|---|---|
| VALD | GVRN mandates ZF; VALD provides the validators that prove it |
| AI | GVRN mandates CONCEPT_LOAD; AI provides the orchestration that executes it |
| ARCH | GVRN ratifies ADRs for architectural decisions; ARCH implements them |
| OPER | GVRN session protocols govern OPER delivery; OPER closes sessions |
| Vocabulary | GVRN uses terms defined by Vocabulary; naming policy is GVRN-enforced |
| QC/Audits | GVRN mandates ZF; QC/Audits are the mechanical ZF proof layer |
| Priority Engine | GVRN sequences work via PE; PE composition is selected based on GVRN signals |
