---
id: csps.governance.platform-genome
name: PLATFORM-GENOME
description: "Authoritative index of all CSPS behavioral invariants. Links to canonical permanent files. Every CSPS tab — Opus or Sonnet — loads from this index. HANDOFF is the delta. Platform Genome is the permanent state."
version: "1.0"
type: architecture
protection_level: sacred
diataxis_type: reference
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spines: [GVRN, AI, ARCH]
core_spine: GVRN
schema_anchor: vault_files
session: S053
context_question: "Before any tab starts work, what permanent nodes in this genome are relevant to the task at hand — and have they been loaded?"
context_quote: "Think about it like a huge grid taking care of things, not one brain with many soldiers."
---

# PLATFORM GENOME
## The Authoritative Index of CSPS Behavioral Invariants

> This file is a MAP, not the territory. Every link below points to where content LIVES.
> Do not add content here. Add links with one human-readable sentence per link.
> Updated when: a new behavioral invariant is ratified and needs inheritance across all tabs.
> Loaded by: session-open.sh (compact version injected) + every HANDOFF Zone A links here.

---

## 0. THE NORTH STAR (governing principle — topmost element)

→ [CSPS-NORTH-STAR.md](CSPS-NORTH-STAR.md)
  What it contains: Version C of the North Star + 6 NS Qualities + 3 NSPP gates.
  The NSPP gates are mandatory at every session: Gate 1 (open), Gate 2 (close), Gate 3 (every 10 sessions).

**The North Star in one sentence:**
"Turn intention into reality — not approximately, but precisely."

**NSPP Gate 1 (required at EVERY session open):**
"What part of the North Star does today's work serve?" — no answer = no mandate.

**Session close classification (Gate 2):** ADVANCE / HOLD / DRIFT

---

## 1. BEHAVIORAL CONTRACTS (AI Conception Vault)

How to use: load the entry relevant to your current task. Not all at once.

→ [B_ZF_TERMINATION_DISCIPLINE.md](../../tools/vault/ai-conception/B_ZF_TERMINATION_DISCIPLINE.md)
  What it contains: The exact ZF cycle template + proof that "no new findings" is a nominal violation.

→ [B_TAB_TRANSITION_PROTOCOL.md](../../tools/vault/ai-conception/B_TAB_TRANSITION_PROTOCOL.md)
  What it contains: Why Opus closes first, how Sonnet continues, what the new Opus needs on arrival.

→ [B_FALSE_ASSUMPTION_CHECK.md](../../tools/vault/ai-conception/B_FALSE_ASSUMPTION_CHECK.md)
  What it contains: 4 categories of false assumptions to audit before any cross-boundary communication.

→ [B_AI_BEHAVIOR_IN_PLANS.md](../../tools/vault/ai-conception/B_AI_BEHAVIOR_IN_PLANS.md)
  What it contains: Every plan ratification must include ai_behavior_analysis — defaults, triggers, satisfaction points.

→ [B_SIMULATION_COMPARISON.md](../../tools/vault/ai-conception/B_SIMULATION_COMPARISON.md)
  What it contains: Every improvement proposal must show BEFORE/AFTER/DELTA to make it concrete and testable.

→ [tools/vault/ai-conception/](../../tools/vault/ai-conception/) (remaining 7 entries)
  What it contains: B_ARCHITECTURE_REDIRECT_AWARENESS, B_IDENTITY_BEFORE_CONTEXT, B_HUMBLE_FIRST_STEP, B_VERIFY_UNCLEAR_INPUT, B_POLARITY_AS_COMPLEMENT, B_VAULT_FIRST_ATTITUDE, B_PE_GATEKEEPER_MANDATE.

Enforcement status (honest): all 12 are T3-only (session injection). T1+T2 not yet built. K=5 recurrence.

---

## 2. COMMUNICATION PROTOCOL

→ [communication-protocol-shared.md](../../tools/council/communication-protocol-shared.md)
  What it contains: The exact format for every Sonnet-to-Opus message, including the mandatory "Opus, this is Sonnet." opening.

→ [sonnet-startup.template.md](../../tools/templates/sonnet-startup.template.md)
  What it contains: The paste-ready startup block that every HANDOFF must include for the new Sonnet tab.

ZF TEMPLATE (verbatim — loaded from session-open.sh injection):
  Cycle 1: [FINDING — name it specifically, cite a file or claim]
  Cycle 2: re-examined [SPECIFIC FILE 1] and [SPECIFIC FILE 2] — 0 new findings.
  ZF ACHIEVED.
  VIOLATION: "Cycle N: no new findings" without file names = nominal. Never write this.

---

## 3. PRIORITY ENGINE

→ [MDPE-FORMULA.md](../../tools/vault/concepts/MDPE-FORMULA.md)
  What it contains: The Multi-Dimensional PE formula with blast_radius, future_enablement, readiness, simplicity_bonus — plus worked examples.

Current MDPE top 5 (from last pnpm verify run — see validate-pe-dashboard.mjs output):
  DOCUMENTATION-IN-SCHEMA: 253 | THRESHOLD-CODE: 236 | VOCABULARY-SERVICE: ~220 | INFRA-FLOW-VALIDATION: 221 | BEHAVIOR-HUB: 204

---

## 4. TAB TRANSITION PROTOCOL

→ [B_TAB_TRANSITION_PROTOCOL.md](../../tools/vault/ai-conception/B_TAB_TRANSITION_PROTOCOL.md)
  What it contains: Opus closes first (most degraded), Sonnet continues PROTO, new Opus reads HANDOFF + Sonnet report.

→ [sonnet-startup.template.md](../../tools/templates/sonnet-startup.template.md)
  What it contains: Template for the startup block every HANDOFF must include (fill variables from Zone B mandate).

---

## 5. PLATFORM ARCHITECTURE (permanent ratified decisions)

→ [PROFILING-HUB-SCHEMA.md](../SIA/PROFILING-HUB-SCHEMA.md)
  What it contains: BEHAVIOR-HUB schema + 3 Governor-ratified decisions: YAML Phase 1 (no DB), two-layer vocabulary, first-visit profile creation.

→ [R1-04-THRESHOLD.md](../SIA/R1-04-THRESHOLD.md)
  What it contains: Complete Threshold design — 10 input types, 7 routing pipelines, session harvest spec. Ready for Phase 1 code.

→ [INFRA-FLOW-VALIDATION.md](../SIA/INFRA-FLOW-VALIDATION.md)
  What it contains: The 9-step end-to-end test spec — what must pass before any app build is called CSPS-correct.

---

## 6. CORE SEEDS (Founding Principles)

→ [GRID-CONSCIOUSNESS.md](../../tools/vault/concepts/GRID-CONSCIOUSNESS.md)
  What it contains: Why CSPS is a distributed grid (not one brain with many soldiers) + what inheritance means in a grid.

→ [DEFAULT-STORAGE-IS-EPHEMERAL.md](../../tools/vault/concepts/DEFAULT-STORAGE-IS-EPHEMERAL.md)
  What it contains: Why AI defaults produce ephemeral storage + the 3-level saving standard + what structural forcing looks like.

---

## 7. PHASE BUILD ORDER

→ [OPTIMAL-BUILD-ORDER-S050.md](../../tools/vault/concepts/OPTIMAL-BUILD-ORDER-S050.md)
  What it contains: 6-phase build sequence where Phase N's output is Phase N+1's specification.

Current phase: Phase 2→3 transition. VOCABULARY-SERVICE Phase 1 built (S053-A). THRESHOLD Phase 1 built (S053-A). BEHAVIOR-HUB schema ratified (S052-D). Phase 3 items: Human Psychology Hub, STT Correction V1.

---

## 8. SETTINGS INVARIANTS

settings.local.json MUST have: defaultMode: bypassPermissions (explicit, not inherited — CONFIG HIERARCHY WARNING)
skipDangerousModePermissionPrompt: true (root level, explicit)
NEVER edit settings.json or settings.local.json mid-session (causes permission prompt interruption)

---

## 9. CREATION REQUIREMENTS

Every new governed .md file: context_question field (T1 hook enforces)
Every new vault entry: context_quote field (T2 validator pending — in PROTO-S053-B)
Every new B_* contract: enforcement_tier with T1+T2+T3 declared at creation
Every new plan item reaching ratification: ai_behavior_analysis section
Every new artifact: inherits_from field declaring what Platform Genome nodes it builds on

---

## 10. GAP RECURRENCE REGISTER

→ [gap-recurrence-register.yaml](../../tools/data/gap-recurrence-register.yaml)
  What it contains: K counts for recurring governance gaps. K>=2 = structural fix required. K>=3 = session close blocked.

Current critical gaps:
  gap_T1_AI_CONCEPTION_VAULT: K=5 (T3-only, no T1 or T2 for any of the 12 entries)
  gap_ZF_NOMINAL_CYCLES: K=6 (validate-zf-cycle-format.mjs built S053-B Step 1 — status: structural_fix_proposed)
  gap_CONCEPTUAL_CLOSURE_NO_TEST: K=1 (behavioral test suite being built this PROTO)
