---
id: csps.governance.ai-behavior-spine
name: ai-behavior-spine
description: The single consolidated AI-behavior contract for CSPS. Maps every behavioral discipline through 5 surfaces (schema + validator + hook + memory + contract) — the engraving pattern from CSP-platform's AI_BEHAVIOR_AUTONOMY_AUDIT, validated at hundreds of Claude Code sessions. Single audit point: "is THIS discipline mechanically enforced at all 5 surfaces, or only declared?" Every gap surfaced here triggers the discipline-completion forcing function. Lives in pillar-0-governance because it's meta-governance about how AI behavior is made durable.
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
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ./reuse-first-principle.md }
  - { rel: enforcement-architecture, href: ./mechanical-enforcement.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: agents-md, href: ../../../AGENTS.md }
  - { rel: stewardship, href: ./stewardship-protocol.md }
  - { rel: learning-loop, href: ./learning-loop.md }
  - { rel: operating-principles, href: ./operating-principles.md }
  - { rel: source-csp-autonomy-audit, href: ../_intake/processed/EXT-20260502-002-ai-behavior-autonomy-audit/raw.md }
  - { rel: source-csp-session-lifecycle, href: ../_intake/processed/EXT-20260502-003-session-lifecycle-protocol/raw.md }
---

# AI Behavior Spine — the consolidated contract

> **The 5-element pattern repeats: schema + validator + hook + memory + contract. Each new class-level discipline gets engraved across all 5. Single-surface engravings demonstrably fail to change behavior.** — CSP AI_BEHAVIOR_AUTONOMY_AUDIT (treasure #1, S002 turn 7)

## What this document holds

The single audit-point for every AI behavioral discipline in CSPS. Each row maps a discipline through 5 surfaces:

1. **schema** — frontmatter / ZModel / closed-enum where the discipline is structurally encoded
2. **validator** — CI / linter / audit-runner check that catches violations
3. **hook** — Claude Code hook (PreToolUse / PostToolUse / Stop / PostStop / UserPromptSubmit) that fires at point-of-action
4. **memory** — `~/.claude/projects/.../memory/feedback_*.md` entries the AI internalizes at session-open
5. **contract** — behavioral-contract section in AGENTS.md / pillar docs that bind the discipline as standing rule

A discipline with all 5 surfaces is **mechanically engraved** — it survives session loss, AI absence, vendor swap. A discipline with fewer than 5 surfaces is **declared** — exposed to drift.

The audit `discipline-engraving-completeness` (planned week 4) iterates this table and flags any row with fewer than 4 surfaces (severity: warn) or fewer than 2 surfaces (severity: error).

## The 5-element pattern (provenance)

Borrowed verbatim from CSP-platform's `AI_BEHAVIOR_AUTONOMY_AUDIT` (treasure #1 EXT-20260502-002), section "How 'ask less' is engraved (the mechanism)". CSP validated this pattern across hundreds of Claude Code sessions; CSPS adopts it as the consolidation framework. Reuse-first principle (P-OP-001) applied: existing CSP pattern is enhanced (with CSPS-specific surface counts + audit), not reinvented.

## The discipline matrix

The disciplines below cover both **operating principles** (P-OP-*) and **architectural behaviors** (anti-sycophancy, no-naked-questions, etc.). Each row is one canonical discipline.

| Discipline | schema | validator | hook | memory | contract | engraving status |
|---|---|---|---|---|---|---|
| **P-OP-001 Reuse-first** | frontmatter `enhances:` / `created-new-because:` | jscpd duplicate-detection + `frontmatter-completeness` | PreToolUse Write/Edit catalog grep | `feedback_check_existing_decisions_first.md` (S002 turn 7) | AGENTS.md cardinal #1 | 5/5 declared; 1/5 mechanical (AGENTS.md only — others week 1+) |
| **P-OP-002 FWWS** | frontmatter `wip_count` per app | `wip-limit` audit (PR + nightly) | PreToolUse new-slice block | `feedback_no_close_offer_early` (carry from CSP) | AGENTS.md cardinal #2 | 5/5 declared; 1/5 mechanical |
| **P-OP-003 PCR** | n/a (presentation format) | n/a | n/a | `feedback_obvious_answer_execute.md` (carry from CSP — execute when path converges) | AGENTS.md cardinal #3 | 2/5 declared; 1/5 mechanical |
| **P-OP-004 Batched-execution** | frontmatter `batch_id` for multi-item batches | n/a | PreToolUse batch-detect | `feedback_correction_not_reconfirmation` (carry from CSP — own-recommendation corrections don't need re-ask) | AGENTS.md cardinal #4 | 4/5 declared; 1/5 mechanical |
| **P-META-001 Defense-in-depth** | n/a (meta) | `principle-coverage` audit | n/a | n/a | `principles.yaml` severity_enforcer_minimums | 3/5 declared; 0/5 mechanical (audit pending week 4) |
| **P-META-002 Principles travel** | extraction-readiness in slice contract | `principles-version-known` audit | n/a | n/a | `extract-app` generator | 3/5 declared; 0/5 mechanical |
| **P-META-003 Inheritance via runtime** | n/a | `inheritance-coverage` audit | n/a | n/a | AGENTS.md cascade pattern | 3/5 declared; 0/5 mechanical |
| **P-META-004 Stewardship** | frontmatter `lifecycle_state` + `next_review_at` | 4 stewardship audits | n/a (review skill instead) | `feedback_no_silent_drop` (CSP) | `stewardship-protocol.md` | 5/5 declared; 1/5 mechanical |
| **P-META-005 Learning Loop** | LearningLoopItem ZModel + ExternalInput ZModel | 6 learning-loop audits | PostStop hook (stub) + UserPromptSubmit hook (S002 turn 7) | `feedback_capture_in_flow` (S002) | `learning-loop.md` + AGENTS.md hard NO | 5/5 declared; ~2/5 mechanical (hooks are stubs; runtime week 4-6) |
| **B_AI_PROFESSIONAL_VOICE** (no sycophancy / no naked questions / state-results-not-deliberation / **no confirmation-seeking** — turn 19 strengthening) | n/a | `vale-prose` linter against sycophancy patterns + `confirmation-seeking-phrase` Stop-hook scan against banned-phrase list (turn 19) | UserPromptSubmit reminder + Stop hook scan | `feedback_top_expert_colleague_voice.md` (S002 turn 7) + `feedback_no_confirmation_seeking.md` (NEW turn 19) | `behavioral-contracts.md` § B_AI_PROFESSIONAL_VOICE (strengthened turn 19 with banned-phrase list) + AGENTS.md hard NO (NEW turn 19) | 5/5 declared; 2/5 mechanical (memory + contract + AGENTS.md NO active turn 19; validator + hook week 4) |
| **B_PE_ALIGNMENT_GUARDIAN** (AI confronts misalignment instead of mirroring) | n/a | n/a | UserPromptSubmit reminder | `feedback_pe_alignment_guardian` | `behavioral-contracts.md` | 3/5 declared; 1/5 mechanical |
| **B_DONE** (no false DONE — claims cite evidence) | n/a | `validator-claim-without-rerun` audit (planned) | Stop hook scans for DONE-without-evidence | `feedback_re_run_is_proof` | `behavioral-contracts.md` | 4/5 declared; 1/5 mechanical |
| **B_NO_INVENTION_WITHOUT_PRECEDENT** (S002 turn 7) | frontmatter `precedent_checked: <evidence>` field on new artifacts | `precedent-check-coverage` audit | UserPromptSubmit reminder | `feedback_no_invention_without_precedent.md` | `behavioral-contracts.md` | 5/5 declared; 0/5 mechanical (S002 added; mechanical pending week 1-4) |
| **B_VALIDATE_BEFORE_ASSUME** (S002 turn 7) | n/a | `assumption-without-evidence` audit | UserPromptSubmit reminder | `feedback_validate_before_assume.md` | `behavioral-contracts.md` | 4/5 declared; 0/5 mechanical |
| **B_ASK_WHEN_FILLING_GAPS** (S002 turn 7) | n/a | n/a | UserPromptSubmit reminder | `feedback_ask_when_filling_gaps.md` | `behavioral-contracts.md` | 3/5 declared; 0/5 mechanical |
| **B_AUTONOMY_4_CONDITIONS** (CSP autonomy audit) | n/a | n/a | UserPromptSubmit reminder | `feedback_autonomy_4_conditions.md` (S002 turn 7) | `behavioral-contracts.md` (this turn) | 3/5 declared; 0/5 mechanical |
| **B_CHECKPOINT_8_CATEGORIES** (CSP autonomy audit) | n/a | n/a | UserPromptSubmit + Stop hooks | `feedback_checkpoint_8_categories.md` | `behavioral-contracts.md` | 3/5 declared; 0/5 mechanical |
| **B_INTAKE_DISCIPLINE** (S002 turn 4-7 manual-protocol) | ExternalInput ZModel + extraction-note frontmatter | manual-protocol-skipped audit | UserPromptSubmit-intake hook (built S002 turn 7) | `feedback_intake_discipline.md` | AGENTS.md hard NOs (4 added) + `manual-protocol.md` | 5/5 declared; 2/5 mechanical (hook + AGENTS.md) |
| **B_BLOCKER_REGISTRY** (S002 turn 6-7 user directive) | `blockers-S<NNN>.md` schema | `unanswered-questions-blocker` audit | n/a | `feedback_blocker_no_silent_drop.md` | AGENTS.md hard NO | 4/5 declared; 1/5 mechanical |
| **B_TWO_SIDED_HANDSHAKE** (S002 turn 6-7 + CSP session-lifecycle) | continuity_manifest + opening_receipt schema | `handshake-completion` audit | n/a (manual user-mediation step) | `feedback_two_sided_handshake.md` | `protocols.md` §17 + §11b + AGENTS.md hard NO | 5/5 declared; 1/5 mechanical |
| **B_INTENT_TO_IMPACT** (S002 turn 6-7 + CSP session-lifecycle step 5b) | handoff §16 schema (intent + impact + drift) | `intent-to-impact-validation` audit | n/a | `feedback_intent_to_impact.md` | `protocols.md` §16 + §11c + AGENTS.md hard NO | 5/5 declared; 1/5 mechanical |
| **B_ATOMIC_DUAL_REGISTRATION** (CSP autonomy audit) | every "I built X" lands in TWO surfaces | `single-surface-registration` audit | n/a | `feedback_atomic_dual_registration.md` | `behavioral-contracts.md` | 4/5 declared; 0/5 mechanical |
| **B_ALWAYS_GIT_LINKS** (CSP session-lifecycle step 6 — hardened S002 turn 19) | n/a (presentational) | `path-mention-without-link` Stop-hook scan + pre-PR linter (planned week 4) | Stop hook scans output for path-shaped strings without link wrapping; UserPromptSubmit reminder | `feedback_always_git_links.md` (NEW turn 19) | `behavioral-contracts.md` § B_ALWAYS_GIT_LINKS (NEW canonical text turn 19) + AGENTS.md hard NO (NEW turn 19) | 4/5 declared; 2/5 mechanical (memory + contract + AGENTS.md NO active turn 19; validator + hook week 4) |
| **B_TARGETED_READ** (CSP session-lifecycle session-open step 2) | handoff Zone A/B/C/D structure | `read-pass-completed` receipt requirement | n/a | `feedback_targeted_read.md` | `protocols.md` §11 step 2 | 4/5 declared; 1/5 mechanical |
| **B_STATE_DECLARATION_AT_OPEN** (CSP session-lifecycle session-open step 4) | fixed-format state block (token budget / validator state / pending count / open findings / scope confidence) | `state-declaration-format` audit | UserPromptSubmit reminder | `feedback_state_declaration_at_open.md` | `protocols.md` §11 step 4 | 4/5 declared; 1/5 mechanical |
| **B_AUTO_EXECUTE_AT_OPEN** (CSP session-lifecycle session-open step 5) | n/a | n/a | UserPromptSubmit reminder | `feedback_auto_execute_no_re_ask.md` | `protocols.md` §11 step 14 | 3/5 declared; 1/5 mechanical |
| **B_CHECKPOINT_8_CATEGORIES_HARD_STOP** | n/a | scope-creep flag at close | UserPromptSubmit reminder | `feedback_checkpoint_8_categories.md` | `behavioral-contracts.md` (this turn) | 3/5 declared; 0/5 mechanical |
| **B_NO_FORCE_FIT** (S002 turn 7 + research stream R21) | extraction-note `discovery_origin: true` flag | `force-fit-detection` audit | n/a | `feedback_no_force_fit.md` | `unknown-path-protocol.md` + AGENTS.md hard NO | 4/5 declared; 1/5 mechanical |
| **B_RZF — Real Zero Findings** (CSP carry-forward S333, S002 turn 10) | every-artifact frontmatter `evidence_block_ref:` required at lifecycle_state ∈ {validated, closed} | `rzf-coverage` audit + `cycle-count-as-target-detection` audit | PostStop + UserPromptSubmit RZF banner | `feedback_re_run_is_proof.md` + `feedback_zero_findings_cycle_count_is_measurement.md` | `behavioral-contracts.md` § B_RZF + `zero-findings-discipline.md` + AGENTS.md hard NO | 5/5 declared; 1/5 mechanical (AGENTS.md only) |
| **B_CEC — Complete Extraction Cycle** (CSPS extension S002 turn 10) | ratified-artifact frontmatter `cec_walk_trail_ref:` required | `cec-walk-trail-completeness` audit | PostStop CEC walk auto-fire | `feedback_complete_extraction_required.md` | `behavioral-contracts.md` § B_CEC + `zero-findings-discipline.md` + AGENTS.md hard NO | 5/5 declared; 1/5 mechanical |
| **B_QC_AUDIT** (S002 turn 11 — operational layer for P-META-006) | every-artifact frontmatter `qc_audit:` block | 4 zero-findings audits + frontmatter-completeness | PostStop scan summary + UserPromptSubmit aged-findings banner | (composes with re-run-is-proof + complete-extraction-required + cycle-count-is-measurement) | `behavioral-contracts.md` § B_QC_AUDIT + `qc-audit-system.md` (canonical) | 5/5 declared; 1/5 mechanical (qc-audit-results-S002.md is FIRST RUN evidence) |
| **B_PROTOCOL_LITERAL_EXECUTION** (S002 turn 14 — closes protocol-compression gap) | TodoWrite tasks transcribed at session-open; closing-summary required-header template | `closing-summary-checklist-completeness` audit (PR-blocking error) | PostStop emits skeleton from template | `feedback_protocol_compression_is_skipping.md` | `behavioral-contracts.md` § B_PROTOCOL_LITERAL_EXECUTION + `_handoff/VAULT/closing-summary-template.md` + AGENTS.md hard NO | 5/5 declared; 1/5 mechanical (template + memory + AGENTS.md NO active; TodoWrite discipline AI-driven; runtime audit week 4) |
| **B_CATCH_TO_ENGRAVING** (S002 turn 15 — closes catch-without-engraving gap) | closing-summary-template §10.13b mandatory header; per-catch row schema | `catch-engraving-coverage` audit (PR-blocking warn) | PostStop scans session log for catch-language + flags un-engraved | `feedback_catch_to_engraving.md` | `behavioral-contracts.md` § B_CATCH_TO_ENGRAVING + AGENTS.md hard NO + closing-summary-template.md §10.13b | 5/5 declared; 1/5 mechanical (memory + contract + AGENTS.md active; PostStop hook + audit week 4) |
| **B_VALIDATE_BEFORE_ASSUME (turn 15 strengthened — tool-call sandwich)** | tool-call → output → assertion structure visible in every response | `assertion-without-preceding-tool-call` audit (PR-blocking error) | PostStop scans for assertion-without-tool-call patterns | `feedback_validate_before_assume.md` (re-engraved) + `feedback_parent_claude_md_wrong_workspace_trap.md` | `behavioral-contracts.md` § B_VALIDATE_BEFORE_ASSUME (turn 15 amendment) + AGENTS.md hard NO | 5/5 declared; 1/5 mechanical |
| **B_FIVE_SURFACE_ENGRAVING** (S002 turn 17 — formalizes the 5-surface pattern as standalone meta-discipline) | closing-summary-template.md §10.13c FSE evidence block (surfaces_count + per-surface-status + classify + atomic-flag + meta-RZF-result) | `catch-engraving-completeness` audit (PR-blocking warn — flags surfaces_count < 2) + `single-surface-engraving-anti-pattern` audit (PR-blocking error) + `audit-of-audits` meta-RZF on registry | PostStop scans session log for catch-language + verifies 5-surface artifacts; UserPromptSubmit reminder for 7-stage cycle | `feedback_five_surface_engraving.md` | `behavioral-contracts.md` § B_FIVE_SURFACE_ENGRAVING + `pillar-0-governance/five-surface-engraving.md` (canonical spec) + `principles.yaml#P-META-007` + AGENTS.md hard NO | 5/5 declared; 2/5 mechanical (memory + contract + AGENTS.md NO + canonical spec + closing-template header active; PostStop hook + 3 audits week 4) |

## Honest engraving-status summary (S002 close — updated turn 17)

- **34 disciplines tracked** (was 27 at S002 turn 9; +B_RZF + B_CEC turn 10; +B_QC_AUDIT turn 11; +B_PROTOCOL_LITERAL_EXECUTION turn 14; +B_CATCH_TO_ENGRAVING + B_VALIDATE_BEFORE_ASSUME-strengthened turn 15; +B_FIVE_SURFACE_ENGRAVING turn 17).
- **0 disciplines fully mechanical** (5/5 surfaces actually running) — runtime ships week 1-6.
- **~6 disciplines partially mechanical** (1-2/5 surfaces — typically AGENTS.md + S002 hook stubs).
- **23 disciplines declared-only** (4-5/5 declared but 0/5 mechanical pending runtime).

This matches the gap surfaced in `gaps-and-duplications-S002.md` Part A — the runtime layers are week-1-6 work; until they ship, the AI's compliance + the manual protocols + the AGENTS.md hard NOs ARE the system.

**The spine's value:** without this matrix, behavior gaps were invisible. With it, every behavioral discipline has a row + a per-surface engraving target + a single audit point.

## AIBehavior schema slice — deferral decision (BLK-S002-002 → option C, S002 turn 9)

User decision S002 turn 9 (per `_handoff/VAULT/blockers-S002.md` + decision-alternatives archive at `_intake/contexts/governance/adr-process/EXT-20260502-004-decision-alternatives-S002.md`): **defer the AIBehavior schema slice to week 6+**.

**Rationale:** the ai-behavior-spine.md (this file) + behavioral-contracts.md serve as MARKDOWN source-of-truth (per P-ARCH-003 files-are-truth-DB-is-index, applied recursively to AI-behavior tracking). Premature DB consolidation costs week 4 scope without evidence the markdown discipline fails to scale.

**Promotion path** (week 6 review):
- IF (a) the spine has 5+ disciplines fully mechanical, AND
- (b) admin needs a dashboard for AI behavior coverage (real, not anticipated), AND
- (c) markdown-query has measurable performance issue
- THEN promote to `AIBehavior` ZModel slice + Postgres table + admin page
- ELSE stay deferred indefinitely (option D — acceptable if discipline holds)

**Audit hook:** at week 6 close, the AI runs an explicit promotion-review against the 3 conditions; surfaces decision in closing summary; carries to next session if undecided.

## CSP carry-forward (treasure #1 + #2 absorbed)

Disciplines from the CSP platform docs that are NEW to CSPS in S002 turn 7:

- **B_AUTONOMY_4_CONDITIONS** — the 4 conditions for autonomous execution (ratified scope + reversible + mechanical + no cross-actor impact). Folded as the implicit framework operating principles already use; explicit doc form added below.
- **B_CHECKPOINT_8_CATEGORIES** — the 8 categories that REQUIRE explicit human approval (constitutional / cross-tier authority / external-dispatched / editing-circulated / irreversible / scope-expansion / strategy-pivots / high-stakes-one-shot). NEW to CSPS as an explicit framework.
- **B_ATOMIC_DUAL_REGISTRATION** — every artifact lands in TWO surfaces in same commit. NEW to CSPS — the manual-protocol's "ledger entry + extraction note" is a partial implementation.
- **B_ALWAYS_GIT_LINKS** — every file mention paired with GitHub URL. NEW to CSPS (deferred until git ships week 1).
- **B_TARGETED_READ** — handoff Zone A/B/C/D structure with explicit pass-protocol. CSP has explicit zones; CSPS doesn't yet — deferred to next handoff (S002→S003) which will use Zones explicitly per CSP convention.
- **B_STATE_DECLARATION_AT_OPEN** — fixed-format state block at session-open. NEW to CSPS as explicit format; existing fresh-chat protocol §11 has steps but not the canonical state-block emission.

These all become full rows in the discipline matrix. Their memory entries + behavioral contracts get written next; mechanical surfaces ship through the build-order.

## The 4 conditions for autonomous execution (CSP carry-forward, full text)

The AI proceeds without asking when ALL of the following hold:

1. **Within ratified scope** — the work is part of an authorized plan or directive
2. **Reversible** — git revert, registry rollback, or simple re-run can undo it
3. **Mechanical** — outcome is observable + verifiable via tool call, not judgment
4. **No cross-actor impact** — doesn't change someone else's contract / data / authority

Source: CSP `AI_BEHAVIOR_AUTONOMY_AUDIT` section "What the AI now executes autonomously". Adopted verbatim.

## The 8 checkpoint categories (CSP carry-forward, full text)

The AI stops and asks before:

1. **Constitutional-tier changes** — affects ALL future plans / sessions / actors
2. **Cross-tier authority changes** — affects who can decide what
3. **External / dispatched work** — outside the immediate AI-user pair
4. **Editing circulated artifacts** — content already shared with others
5. **Irreversible operations** — destroys or overrides
6. **Scope expansion beyond authorization** — work exceeds what was ratified
7. **Strategy pivots** — changes what we're building or who it's for
8. **High-stakes one-shot decisions** — low rollback value

The AI surfaces these with **PCR (Pros / Cons / Recommendation)** and waits.

Source: CSP `AI_BEHAVIOR_AUTONOMY_AUDIT` section "What still requires explicit human approval". Adopted verbatim.

## How disciplines get added to the spine

When a new behavioral discipline is identified (corrections in chat, gap audit, research finding, principle addition):

1. Add a row to the matrix above with discipline name + 5 surfaces + engraving status.
2. For each surface that doesn't exist, schedule its build:
   - **schema** — extend ZModel / frontmatter validator
   - **validator** — write `libs/audits/checks/<slug>.ts`
   - **hook** — write `.claude/hooks/<surface>-<slug>.sh`
   - **memory** — write `~/.claude/projects/.../memory/feedback_<slug>.md`
   - **contract** — extend `behavioral-contracts.md` or AGENTS.md
3. Cross-reference with `principles.yaml` if the discipline corresponds to a P-* principle.
4. The audit `discipline-engraving-completeness` will start tracking the new row from next PR.

This is the recursive application of P-META-004 (stewardship) + P-META-005 (learning-loop) to AI behavior itself — every discipline gets a place + process + recurring trigger.

## Cross-references

- `_intake/processed/EXT-20260502-002-ai-behavior-autonomy-audit/` — treasure #1 raw + extraction notes
- `_intake/processed/EXT-20260502-003-session-lifecycle-protocol/` — treasure #2 raw + extraction notes
- `behavioral-contracts.md` (sibling, this turn) — the full text of every B_* contract
- `principles.yaml` — registry of principles; this spine adds the operationalization layer
- `mechanical-enforcement.md` — the per-surface architecture this spine instantiates
- `learning-loop.md` — the closed-loop pipeline this spine feeds when discipline gaps emerge
- `stewardship-protocol.md` — the lifecycle every spine row obeys
