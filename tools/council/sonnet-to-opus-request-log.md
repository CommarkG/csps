---
id: csps.council.sonnet-to-opus-request-log
name: sonnet-to-opus-request-log
description: >
  Permanent log of all Sonnet→Opus consultation requests. Every request uses the
  standardized SROF (Sonnet Request to Opus Format) defined in §1.
  Mechanically enforced: before any Opus turn is triggered, the request must have
  a complete SROF entry here. Opus reads this log before responding to see full
  history and avoid re-doing work Sonnet already completed.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
domain_path: platform
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:draft
session: S025
links:
  - { rel: protocol, href: ./PROTOCOL.md }
  - { rel: opus-turn, href: ./opus-turn.md }
  - { rel: sonnet-turn, href: ./sonnet-turn.md }
---

# Sonnet→Opus Request Log

> **Every Sonnet→Opus consultation request is logged here — permanently.**
> Format: SROF (Sonnet Request to Opus Format) defined in §1.
> Before triggering an Opus turn: complete the SROF entry below, then paste §REQUEST to Opus.
> Opus reads this log to understand full history and not re-do completed work.

---

## §1 — SROF: Sonnet Request to Opus Format

> **MECHANICAL RULE (Governor directive S025):**
> Every time Sonnet offers to send something to Opus — in ANY chat response — it MUST:
> 1. Present the REQUEST paragraph (the "one sentence" paste-target)
> 2. Include git_links_since_last_turn (commits since previous SROF ACTED ON sha)
> 3. Include previous_srofs_ref (links to prior SROFs so Opus can see the chain)
> 4. The alignment delta MUST be within the SROF document — not just in chat
>
> Enforced by: validate-opus-review-flagging.mjs (detects when Opus triggers exist)
> Log: THIS FILE — permanent record. Every SROF gets a numbered entry here.

**Required sections (no hidden assumptions — Opus reads this cold):**

```
═══════════════════════════════════════════════════════════════════
SROF — Sonnet Request to Opus Format
Turn: [N] | Session: S[NNN] | Date: [YYYY-MM-DD]
Status: PENDING | RESPONDED: [date] | ACTED ON: [commit sha]
═══════════════════════════════════════════════════════════════════

GIT LINKS SINCE LAST OPUS TURN (what Opus has NOT seen yet — concrete evidence):
  Previous SROF ACTED ON: [sha from previous SROF]
  Commits since then:
    [sha] [message] → [what this means for platform state]
    [sha] [message] → [what this means for platform state]
  GitHub link pattern: https://github.com/CommarkG/csps/compare/[prev_sha]...[current_sha]

PREVIOUS SROFS (so Opus can see the chain of requests — no hidden history):
  SROF-001: [brief topic] | RESPONDED | ACTED ON: [sha]
  SROF-002: [brief topic] | RESPONDED | ACTED ON: [sha]
  [current SROF is SROF-N]

PLATFORM STATE (what Opus needs to know — assume zero memory of prior session):
  Validators: [N active] | Health: [N/17 YES] | Last commit: [sha]
  pnpm verify: exit_code=[N] | ZF: [ACHIEVED / not run]
  Budget Planner (App #2): [Layer N complete / in-progress]
  Key artifacts: [list of files Opus should read before responding]

SINCE LAST OPUS TURN (what changed — so Opus doesn't re-analyze completed work):
  - [item 1]: [commit + what it does]
  - [item 2]: [commit + what it does]
  [max 8 items — full list in key artifacts above]

WHAT SONNET HAS ALREADY DECIDED (Opus must not override these without Governor directive):
  - [decision 1]: [brief rationale]
  - [decision 2]: [brief rationale]

WHAT SONNET CANNOT DECIDE ALONE (specific gaps requiring Opus architectural judgment):
  1. [question 1 — specific, bounded, answerable YES/NO/PARTIAL or with enumerated options]
  2. [question 2]
  [max 5 questions per turn]

THE REQUEST (paste this to Opus):
  [2-4 sentence paragraph — no jargon, no assumed context, no run-on sentences]
  Written for Opus reading cold with only this SROF as context.
  Ends with: "Specific questions: [numbered list]"

BRIEFING FILE (full context if Opus wants depth):
  [path to detailed briefing file]
═══════════════════════════════════════════════════════════════════
```

**Mechanical enforcement:**
- Before creating any new Opus turn in opus-turn.md: add SROF entry here
- validate-sonnet-report.mjs checks that sonnet-turn.md references this log
- Every SROF entry has `Status: PENDING` until Opus responds → then `RESPONDED: [date]`
- ACTED ON commits are tracked so Opus can see what was implemented from prior responses

---

## §2 — Request History

---

### SROF-001 — Turn 1 (S021-S022)
**Status:** RESPONDED: S022 | ACTED ON: consensus-reached (see council-state.json)

**Request:** Implementation sequence for Sessions 1-4 (App #1 task-mgmt build order).
**Opus decision:** AppendOnlyBase before db:push; credential-conditional ordering; 3/7 persona_target defer.
**Sonnet accepted:** Yes (all corrections accepted per council-state.json).

---

### SROF-002 — Turn 5-6 (S022-S023)
**Status:** RESPONDED: S023 | ACTED ON: commit 5c86e61

**Request:** P-META-022 architectural design + alignment plan.
**Opus decision:** P-META-022 ratified; 16-item alignment plan authored; Tier 1 for S024; Tier 2 for S025.
**Sonnet implemented Tier 1:** Items 1-8+11 complete S024 (principles.yaml, plan-creation-protocol Step 0a, §10.0r, B_CONSENSUS cross-ref, B_HUMBLE_EXECUTOR INTENT DRIFT CHECK, DNA Element 15, OD-007, AI-to-AI section).

---

### SROF-003 — Turn 7 (S023)
**Status:** RESPONDED: S023 | ACTED ON: commit 5c86e61 (libs/ gate v1.2.0)

**Request:** Q1 council routing / Q2 libs/ gate / Q3 INTENT ABSORBED protocol.
**Opus decision:** Option A (council routing now); libs/ BLOCKING for new files (ratified); INTENT ABSORBED to sonnet-turn.md before any edit.
**Sonnet implemented:** libs/ gate v1.2.0, validate-sonnet-report.mjs, council-state.json fields.

---

### SROF-004 — Turn 8 (S024)
**Status:** RESPONDED: S024 | ACTED ON: commits 5c86e61, 8359d69, c4c7ff1

**What Opus reviewed:** P-META-023 proposal from Sonnet S024.
**Opus verdict:** APPROVED direction. CONDITIONAL SEAL — pending full 26+42 review.
**5 Refinements:** (1) P-META-023 is child of P-META-022 ✓ done; (2) send full 26+42 → pending this turn; (3) failure_signal to P-META-022 ✓ done S025; (4) Layer mapping → pending; (5) Surface activation gate → pending.
**What Sonnet has since done:** threshold-intake-protocol.md SSoT created (S024+); Budget Planner Layers 1-3 built; 80 validators; Platform Health 76% (10/17 YES).

---

### SROF-005 — Turn 9 (S025)
**Status:** RESPONDED: 2026-05-12 | ACTED ON: see commits below

**Opus verdicts:**
1. P-META-023: SEALED ✅ (registered in principles.yaml)
2. Template Grades A/B/C/D: APPROVED — template_status 5-value enum implemented
3. Intake Interrupt: ×1.5 vault/plan, ×2.0 interrupt, L1=always stop — intake-interrupt-protocol.md created
4. Consultation Pipeline L0-L3: APPROVED — EXPRESS format added to PROTOCOL.md
5. Virtual Opus Audit 5 questions: APPROVED — already in question-protocol.md, keep as-is

**Commits:** see pnpm verify log for sha reference

*See §3 below for full SROF-005 entry.*

---

### SROF-006 — Turn 10 (S025)
**Status:** RESPONDED: 2026-05-12 | ACTED ON: see commits below

```
═══════════════════════════════════════════════════════════════════
SROF-006 — Turn 10 | Session: S025 | Date: 2026-05-12
Status: PENDING
═══════════════════════════════════════════════════════════════════

PLATFORM STATE (assume Opus has not seen anything since Turn 9):
  Validators: 84 active | Health: 76% (10/17 YES) | Last commit: 404253c
  pnpm verify: exit_code=0 | ZF: ACHIEVED
  Budget Planner App #2: Layers 1+2+3+4 complete (Gate 3 pending live validation)
  DNA elements: 17 (Element 17 = PACP, added S025)
  Principles: 57 (P-META-023 SEALED per Turn 9 — registered in principles.yaml)
  Key new files Opus should read:
    - docs/plan/pillar-0-governance/participant-protocol.md (PACP — the brief)
    - tools/templates/priority-engine.schema.yaml §1b-§1c (pe_context + moat_score)
    - docs/plan/pillar-0-governance/csps-platform-dna.md §Element 17

SINCE TURN 9 (Sonnet implemented all 5 immediate items — do not re-review):
  - P-META-023 registered in principles.yaml (total_count=57) ✓
  - template_status 5-value enum (experimental/draft/provisional/standard/sealed) ✓
  - intake-interrupt-protocol.md: ×1.5 vault/plan, ×2.0 interrupt, L1=always ✓
  - PROTOCOL.md: L0-L3 consultation levels + EXPRESS format ✓
  - HANDOFF frontmatter: needs_opus_review + opus_review_type ✓
  NEW (not in Turn 9):
  - PACP: participant-protocol.md (14 types, 5 categories) — DNA Element 17 — advisory
  - PE moat-first: pe_context (platform/customer/user) + moat_score (0-10 bonus)
  - validate-open-questions.mjs: 12 PENDING S015 items surfaced in raw-thoughts-queue.md

WHAT SONNET HAS ALREADY DECIDED (Opus must not override):
  - 14 participant types across 5 categories (governor/developer/user/platform-AI/external-AI)
  - moat_score is ADDITIVE to base PE (not a replacement dimension)
  - pe_context adjusts dimension weights — keeps all items in one comparable PE queue
  - PACP is advisory Phase 1 (BLOCKING needs Governor ratification for S026)
  - raw-thoughts-queue items without PE+trigger surfaced as advisory (not blocked yet)

WHAT SONNET CANNOT DECIDE ALONE:
  1. PACP taxonomy completeness: Are 14 types sufficient? What's missing?
     Specifically: should "developer.platform" split into "developer.governance" vs
     "developer.schema" vs "developer.product"? Or is one type sufficient?
  2. L1 vs L2 for PACP: Should participant-protocol.md be L1 SEALED (constitutional,
     governs all apps) or L2 DOMAIN (can evolve as more apps validate it)?
     Sonnet's take: L2 for now (14 types may grow), but Opus knows better.
  3. PE moat_score formula: Is `final_PE = base_PE + (moat_score * 0.5)` the right
     multiplier? Or should moat contribution use a different formula (e.g., multiplicative)?
  4. raw-thoughts-queue S015 PENDING items: 12 items from S015 without PE+trigger.
     Most appear superseded by S015-S025 work. Should Sonnet audit+close them, or
     should Opus review before closing?

THE REQUEST (paste to Opus):

  You are OPUS-1, Turn 10. Since Turn 9, Sonnet implemented all 5 immediate items
  (P-META-023 registered, template grade system, intake-interrupt-protocol, L0-L3
  consultation levels, HANDOFF frontmatter fields). Three new items need your review:

  (1) PARTICIPANT-AWARE COMMUNICATION PROTOCOL (PACP) — the Governor identified a
  hidden gap: CSPS has been treating all communication as binary (AI↔human) when
  there are actually 14 distinct participant types (governor.primary, developer.platform,
  developer.app, developer.api, user.solo, user.team.member, user.team.admin,
  user.enterprise, user.trial, ai.sonnet, ai.opus, ai.haiku, ai.agent, ai.external)
  each requiring different trust levels, context depth, communication protocols, and
  Threshold variants. This is now DNA Element 17. The question: is the taxonomy
  complete, and should participant-protocol.md be L1 SEALED (constitutional) or L2
  DOMAIN (evolving)?

  (2) PE MOAT-FIRST EXTENSION — PE now has pe_context (platform/customer/user, adjusts
  dimension weights) and moat_score (0-10 additive bonus: constitutional=10, compounding=8,
  structural=6). This makes moat contribution explicit in every priority decision.
  Is `final_PE = base_PE + (moat_score × 0.5)` the right formula, or should the
  moat be multiplicative?

  (3) S015 RAW-THOUGHTS-QUEUE — 12 PENDING items from S015 have no PE score or trigger
  condition. Most appear superseded by S015-S025 work. Should Sonnet audit and close them,
  or does Opus need to review first?

  Full briefing: docs/plan/pillar-0-governance/participant-protocol.md.

BRIEFING FILE: docs/plan/pillar-0-governance/participant-protocol.md
═══════════════════════════════════════════════════════════════════
```

---

### SROF-007 — Turn 11 (S025) ← CURRENT REQUEST
**Status:** PENDING

```
═══════════════════════════════════════════════════════════════════
SROF-007 — Turn 11 | Session: S025 | Date: 2026-05-12
Status: PENDING
═══════════════════════════════════════════════════════════════════

GIT LINKS SINCE LAST OPUS TURN (Turn 10, commit ffdb494):
  Previous SROF ACTED ON: ffdb494 (Opus Turn 10 implementation)
  Commits since then:
    [this session] SROF-007 + opus-review-flagging.mjs + SROF format update
  GitHub compare: https://github.com/CommarkG/csps/compare/ffdb494...HEAD
  Note: Opus Turn 10 was committed same session as this request (S025).
  The gap between Turn 10 (PACP L1-L2-hybrid + moat guardrails + S015) and Turn 11
  (C+D item reviews) is the same session — all work visible in commit history above.

PREVIOUS SROFS (chain of consultation history):
  SROF-001: Implementation sequence S021-S022 | RESPONDED | ACTED ON: consensus (council-state.json)
  SROF-002/003: P-META-022 alignment + Q1/Q2/Q3 | RESPONDED | ACTED ON: commit 5c86e61
  SROF-004: P-META-023 direction review | RESPONDED | ACTED ON: commits 5c86e61, 8359d69
  SROF-005: Turn 9 — P-META-023 SEALED + 4 systems | RESPONDED | ACTED ON: commit 7384ad4
  SROF-006: Turn 10 — PACP + PE moat + S015 audit | RESPONDED | ACTED ON: commit ffdb494
  SROF-007: Turn 11 — S015 C+D items + slim-handoff verification ← CURRENT

PLATFORM STATE (Turn 10 to 11 same session — state unchanged):
  Validators: 84 active | Health: 76% (10/17 YES) | Last commit: [see above]
  pnpm verify: exit_code=0 | ZF: ACHIEVED
  Key new since Turn 10 (same session):
    - validate-opus-review-flagging.mjs: BUILT (the mechanism is now in action)
    - SROF format: updated with Git links + previous SROF refs (Governor directive)
    - PE > 90 calibration: needs attention (false positive on old strategic plans)

PREVIOUS SROF CHAIN (condensed for Opus):
  9 Turns total. 7 SROFs. Full log: tools/council/sonnet-to-opus-request-log.md

WHAT SONNET HAS ALREADY DECIDED:
  - S015 A items (4) closed with citation: PE-dashboard, B_HUMBLE_EXECUTOR, B_AUTONOMOUS_BATCH, Chat-State-Snapshot
  - S015 B items (3) assigned to arc plan: alignment-gate-phase2(S027), assumption-block(S026), validators(S027)
  - D items flagged for Governor clarification (not Opus — ambiguous original intent)

WHAT SONNET CANNOT DECIDE ALONE:
  1. S015-C1 (Orchestrator mode-selection, pe:65): Foundation ready (S025). Design approach?
     Options: (A) Extend context-orchestrator.sh with mode signals, (B) New validator that
     reads plan_type+phase+execution_mode and suggests model routing, (C) AI-layer rule only.
  2. S015-C2 (CDAB formalization, pe:60): MCP get_context NOT built. Three investments needed.
     Question: should CDAB be formally registered as P-META-024 (new principle), or absorbed
     into existing P-META-017 + B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS?
  3. S015-D1+D2 (slim-handoff SKILL.md §CORE-PILLARS): Unclear if ever addressed.
     Question for Opus: Was slim-handoff Zone A updated with spine status table in S016-S021?
     Or should Sonnet verify the SKILL.md directly and classify accordingly?

THE REQUEST (paste to Opus — the "one sentence"):

  You are OPUS-1, Turn 11. Same session as Turn 10. The SROF format now includes Git links
  and previous SROF chain (Governor directive — no more hidden assumptions). Since Turn 10,
  Sonnet built the mechanical Opus-flagging detector (validate-opus-review-flagging.mjs) and
  updated the SROF format protocol. Three items need your express review:

  (C1) Orchestrator mode-selection (pe:65) — the foundation (B_HUMBLE_EXECUTOR,
  B_AUTONOMOUS_BATCH) is complete. Should mode-selection extend the existing
  context-orchestrator.sh with plan_type signals, or become a new validator that reads
  execution_mode/depth_chosen and suggests Sonnet/Opus/Haiku routing?

  (C2) CDAB formalization (pe:60) — the existing P-META-017 and B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS
  cover behavioral alignment, but the MCP get_context extension is not built. Should CDAB
  become a new P-META-024 principle or absorb into existing principles?

  (D1+D2) slim-handoff SKILL.md §CORE-PILLARS — was this section ever added to
  .claude/skills/slim-handoff/SKILL.md? If Opus does not know, Sonnet will verify directly
  and reclassify A or C accordingly.

  GitHub compare link: https://github.com/CommarkG/csps/compare/ffdb494...HEAD
  Full SROF chain: tools/council/sonnet-to-opus-request-log.md

BRIEFING FILE: docs/plan/_intake/raw-thoughts-queue.md (S025 AUDIT section)
═══════════════════════════════════════════════════════════════════
```

---

## §3 — SROF-005: Turn 9 Full Entry

```
═══════════════════════════════════════════════════════════════════
SROF-005 — Turn 9 | Session: S025 | Date: 2026-05-12
Status: PENDING
═══════════════════════════════════════════════════════════════════

PLATFORM STATE (assume Opus has not seen anything since Turn 8):
  Validators: 80 active | Health: 76% (10/17 YES) | Last commit: f69e357
  pnpm verify: exit_code=0 | ZF: ACHIEVED (5 cycles, 1 advisory)
  Budget Planner App #2:
    Layer 1: personal.finance WizardTemplate + template fork ✓
    Layer 2: BudgetCategory + Transaction schema + API routes ✓
    Layer 3: Threshold Wizard UI (3-question, non-skippable gate) ✓
    Layer 4: GDPR erasure + webhook (partial; full Gate 3 proof pending S026)
  DNA elements: 16 (Question Protocol added as Element 16)
  Key files Opus should read:
    - docs/plan/pillar-0-governance/threshold-intake-protocol.md (SSoT for I→VI, 26+42)
    - tools/council/opus-briefing-s025-four-topics.md (full context for this request)
    - docs/plan/pillar-0-governance/platform-health-questions.md (30 platform health questions)
    - docs/plan/_handoff/VAULT/csps-master-plan-s025-plus.md (full PE-ordered work queue)

SINCE TURN 8 (what Sonnet did — Opus does not re-analyze these):
  - threshold-intake-protocol.md: P-META-023 SSoT file created, parent_principle: P-META-022 declared (Refinement 1 ✓)
  - failure_signal field: added to frontmatter-closed-enums + validate-intent-crystallized.mjs (Refinement 3 ✓)
  - B_BOUNDARY_ALIGNMENT_PROTOCOL: Types E+B implemented (pre-tool-use-agent-alignment.sh advisory)
  - Budget Planner: Layers 1+2+3+4partial built (schema + 3 APIs + Threshold Wizard + GDPR)
  - 15 floating elements identified and resolved/planned (dna-protocol-making-sure-that.md)
  - Platform health questions: 30 questions in 6 batteries (platform-health-questions.md)
  - PE dashboard: validate-pe-dashboard.mjs runs at every session open (80 validators, 10/17 YES)
  - completeness-module.md: SSoT for 6 B_* completeness contracts
  - question-protocol.md: 8-type taxonomy (C/A/G/R/B/Z/P/X) + Virtual Opus Audit draft

WHAT SONNET HAS ALREADY DECIDED (Opus must not override without Governor directive):
  - Budget Planner domain: Personal, Budget Planner app (Governor ratified S024)
  - Threshold Wizard in Budget Planner: Option B (Governor ratified S024)
  - P-META-023 is CHILD of P-META-022, not parent (Opus Refinement 1)
  - 9-step coaching protocol IS Step 0a (not a new layer before it)
  - validate-dead-links.mjs: advisory for 67 pre-existing broken links

WHAT SONNET CANNOT DECIDE ALONE:
  1. Template Ratification Grades: Should CSPS formalize Grade A/B/C/D based on L1/L2/L3
     layer doctrine? Grade A = full council before sealing; Grade D = experimental K=1.
     Current: only K=2 promotion to "stable" exists.
  2. Idea Routing with Active Implementation: What is the correct PE multiplier threshold
     for interrupting active work? (Sonnet proposes ×1.5 from B_COMPLETION_OVER_SHINY.)
     Is ×1.5 right, or should architectural ideas use a lower threshold?
  3. Opus Consultation Pipeline: What are the mechanical triggers for required Opus
     consultation? Sonnet proposes: depth-5 OR L1 change OR PE > 85 new items OR
     contradicts ratified principle. Does Opus agree, and what's missing?
  4. Virtual Opus Audit: Are these the right 5 self-check questions (R/Z/R/B/G)?
     What would Opus add or remove?
  5. P-META-023 CONDITIONAL SEAL: Opus Turn 8 said "conditional on seeing full 26+42."
     The full 26-item checklist + 42-surface map is in threshold-intake-protocol.md
     (canonical file). Does Opus now give SEALED ratification?

THE REQUEST (paste to Opus):

  You are OPUS-1, S025 advisory turn. Since Turn 8 (S024), Sonnet has:
  (1) completed P-META-022 Tier 1 + Tier 2 alignment items including failure_signal field
  and 9-step coaching protocol as Step 0a; (2) built Budget Planner App #2 through
  Layers 1-3 (schema + API + Threshold Wizard gate — users cannot reach dashboard without
  completing the 3 crystallization questions, proving P-META-022 in user-facing code);
  (3) created threshold-intake-protocol.md as SSoT for the I→VI discipline (26-item
  checklist, 42 communication surfaces, coaching philosophy, platform hierarchy).

  Four architectural questions need your guidance before Sonnet implements them:
  (1) Should CSPS formalize Template Ratification Grades A/B/C/D based on L1/L2/L3 layer
  doctrine — with Grade A requiring research + external AI + Opus council, and Grade D
  being experimental K=1 (no review)?
  (2) Is the ×1.5 PE multiplier from B_COMPLETION_OVER_SHINY the right threshold for
  interrupting active implementation when a new high-PE idea arrives, or should
  architectural interrupts use a lower threshold?
  (3) What are the minimum mechanical triggers for required Opus consultation — does
  Sonnet's proposed set (depth-5, L1 change, PE > 85 new items, contradicts ratified
  principle) cover the critical cases?
  (4) The full 26-item intake checklist and 42-surface map are now in
  threshold-intake-protocol.md — does this satisfy the Turn 8 conditional for P-META-023
  SEALED ratification?

  Full briefing: tools/council/opus-briefing-s025-four-topics.md.

BRIEFING FILE: tools/council/opus-briefing-s025-four-topics.md
═══════════════════════════════════════════════════════════════════
```
