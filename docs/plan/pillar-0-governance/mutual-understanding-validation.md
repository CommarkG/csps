---
id: csps.governance.mutual-understanding-validation
name: mutual-understanding-validation
description: Dashboard / spec leaf for Mutual Understanding Validation (MUV) discipline — closed-loop two-sided handshake at every AI communication boundary. 5 boundary types (chat-to-chat / AI-to-AI subagent / AI-to-human / AI-to-persona / context-batches-within-session). Per-boundary handshake protocols + chat-jump-prompt mechanical-audit checklist + alignment-question template. Per P-META-014 + B_MUTUAL_UNDERSTANDING_VALIDATION.
version: 1.1
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
  - { rel: principle, href: ../../../packages/principles/principles.yaml }
  - { rel: contract, href: ./behavioral-contracts.md }
  - { rel: protocols, href: ../_handoff/VAULT/protocols.md }
  - { rel: aap, href: ./agent-alignment-protocol.md }
  - { rel: hpfa, href: ./behavioral-contracts.md }
  - { rel: governor-prompts, href: ./governor-prompts.md }
created-new-because: |
  Two-sided handshake existed at protocols.md §17 + B_TWO_SIDED_HANDSHAKE (S002 turn 6-7) but
  was scoped to session-handoff attestation only. User S005 turn 28 directive: this is a
  universal communication-boundary principle — applies to chat-to-chat / AI-to-AI subagent /
  AI-to-human / AI-to-persona / context-batches. The CHAT-JUMP-PROMPT specifically had no
  mechanical audit; the cross-chat ITERATION was implicit not mandatory; subagent returns
  weren't output-contract-verified. This leaf locks the universal discipline + per-boundary
  protocols + chat-jump-prompt mechanical-audit checklist.
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
---

# Mutual Understanding Validation (MUV)

> **Intent → Impact requires explicit handshake at every boundary. One-shot output without receiver acknowledgment is gap propagation in disguise.**

## Why this exists

Pre-S005-turn-28, AI communication boundaries leaked intent silently:

- **Chat-jump prompts** were generated "good enough" without mechanical audit. New session AI received them; if ambiguous, the gap was discovered 3 sessions later — or never.
- **Subagent returns** were accepted at face value. If the subagent's output didn't match the declared `output_contract`, main wouldn't notice.
- **AI-to-human substantive outputs** had no validation-hook. User might catch misalignment in their next prompt; the AI didn't proactively check.
- **Context-batch boundaries** within sessions had no intent-to-impact drift check before the next batch began.

These are the failure modes MUV is engraved to cure. Every boundary now has a mandatory handshake protocol.

## The 5 boundary types

### Boundary 1 — Chat-to-chat handoff

The user defined this exactly: chat-jump-prompt-prep + cross-chat iteration. Detailed protocol below.

### Boundary 2 — AI-to-AI subagent

Composes with [agent-alignment-protocol.md](./agent-alignment-protocol.md). The Class B subagent receives AAP preamble (mandatory) including its `output_contract`; on return, main verifies the returned summary matches the contract; on mismatch, main re-spawns with clarification.

### Boundary 3 — AI-to-human (this conversation thread)

Every substantive AI output (engraving / PCR / synthesis / multi-file change) emits an implicit or explicit "did this land?" check. High-stakes outputs include an explicit alignment-question at the end (e.g., "if you wanted me to interpret X differently, flag it now"). User feedback feeds next-turn refinement.

### Boundary 4 — AI-to-persona (week-7+ when persona-composition ships)

Per [pillar-5/persona-composition.md](../pillar-5-ai-systems/persona-composition.md). Persona-composition output validated against expected persona-shape (declared persona-domain overlay + GUARDRAIL_BUNDLES + traits). Fail-closed on mismatch — persona-dispatch refused if shape doesn't match expectation.

### Boundary 5 — Context batches within session (composes with P-OP-004)

Per [P-OP-004 batched-execution](../../../packages/principles/principles.yaml). Batch closes with intent-to-impact drift check — if the executed batch differs substantially from acceptance criteria upfront, AI pauses + reconfirms before next batch begins. The drift threshold is judgment-based but biased toward pause.

## The chat-to-chat handshake (boundary type 1) — the load-bearing case

```
                ┌──────────────────────────────────────────────────────┐
                │  Current chat (S<NNN>; ending)                      │
                │  ─────────────────────────────────────────          │
                │  Step 1: AI generates chat-jump-prompt with         │
                │          mechanical audit (8 mandatory sections)    │
                │          + EXPLICIT ALIGNMENT-QUESTIONS section      │
                └────────────────────┬─────────────────────────────────┘
                                     │
                                     ▼ (USER PASTES)
                ┌──────────────────────────────────────────────────────┐
                │  New chat (S<NNN+1>; opening)                        │
                │  ─────────────────────────────────────────          │
                │  Step 2: New AI receives prompt; reads + reasons    │
                │  Step 3: New AI responds with §17 attestation        │
                │          (per-line ✓ or ❓→BLK-S<NNN+1>-*) +       │
                │          ALIGNMENT-QUESTIONS answers                 │
                └────────────────────┬─────────────────────────────────┘
                                     │
                                     ▼ (USER BRINGS RESPONSE BACK)
                ┌──────────────────────────────────────────────────────┐
                │  Current chat (S<NNN>; iteration loop)              │
                │  ─────────────────────────────────────────          │
                │  Step 4: AI audits new-chat response against        │
                │          original intent:                            │
                │            - Does new AI's understanding match?      │
                │            - Alignment-questions answered correctly? │
                │            - Gaps in prompt template surfaced?       │
                │  Step 5: IF gaps → REFINE prompt template            │
                │          MECHANICALLY (audit feedback → template)    │
                │  Step 6: AI generates response-to-new-chat with      │
                │          clarifications OR alignment-confirmed       │
                └────────────────────┬─────────────────────────────────┘
                                     │
                                     ▼ (USER PASTES TO NEW CHAT)
                ┌──────────────────────────────────────────────────────┐
                │  New chat (S<NNN+1>)                                 │
                │  ─────────────────────────────────────────          │
                │  Step 7: ITERATE Steps 2-6 until alignment-          │
                │          confirmed-explicit by user OR new-chat     │
                │  Once confirmed: new AI proceeds with §3 work        │
                └──────────────────────────────────────────────────────┘
```

**The user is the bridge** between the two AIs. The user pastes prompts and brings responses back. **The AIs cannot communicate directly** — but the loop closes via the user as the medium.

**This is what makes I→I (Intent-to-Impact) actually verifiable:** without the iteration loop, "intent" gets emitted by current AI, "impact" is whatever new AI reads it as, and the gap between them is invisible until much later. With the loop, every gap surfaces as an alignment-question that gets answered before §3 work begins.

## Chat-jump-prompt mechanical-audit checklist

Every `chat-jump-prompt-S<NNN>-to-S<NNN+1>-detailed.md` MUST contain:

| # | Section | Source | Verification |
|---|---|---|---|
| 0 | **🎯 IDENTITY BANNER (mandatory first line)** — `# 🎯 YOU ARE S<NNN+1> — Session <NNN+1> of the CSPS planning project.` New AI must confirm: "✅ I am S<NNN+1>, picking up from S<NNN>-close at <iso8601-utc>". Added v1.1 per S005 turn 29. | protocols.md §10 §0 banner rule | grep `^# 🎯 YOU ARE S<NNN+1>` is the very first H1 in paste-target block |
| 1 | **HANDOFF §0 paste-target** | self-contained per protocols.md §11 | grep `Read docs/plan/_handoff/HANDOFF-S<NNN>-to-S<NNN+1>.md §0` present |
| 2 | **Post-close addenda references** | §24-§N (every amendment after original close cited) | grep `§<N>` for each post-close addendum |
| 3 | **Governor-prompts log pointer** | `_handoff/VAULT/governor-prompts/S<NNN>.md` | path resolves; file exists |
| 4 | **HPFA evidence block pointer** | closing-summary §10.0f | reference present |
| 5 | **All carry-forwards with explicit reasons** | from HANDOFF §C | enumerated; each has `reason:` field |
| 6 | **All cardinal directives verbatim** | from user-intents.md S<NNN> section | cross-linked verbatim quotes preserved |
| 7 | **`pnpm verify` orchestrator state** | from §10.0 | exit_code summary + cycle results |
| 8 | **EXPLICIT ALIGNMENT-QUESTIONS section** | NEW per MUV | non-empty list of questions for new AI to answer |

The `muv-chat-jump-prompt-completeness` audit verifies the identity banner + all 8 sections present + populated (9 checks total).

## Alignment-question template (for chat-jump-prompts)

The current AI generates 5-10 alignment-questions per chat-jump-prompt. Examples per type:

**Scope-confirmation questions:**
- "Confirm: §3 scope this session is [X/Y/Z]; the carry-forwards are [A/B/C]; is this still your intent?"
- "Are there any items from §C carry-forward you want to deprioritize for S<NNN+1>?"

**Interpretation-of-cardinals questions:**
- "Cardinal directive [verbatim from user-intents.md] — confirm your current understanding aligns with the engraved discipline at [B_*/P-META-*]?"

**Verification-state questions:**
- "Final `pnpm verify` exit_code was [N] with [X] cycles passing + [Y] DEFERRED-WITH-REASON. Is this ZF state acceptable for S<NNN+1> start, or do you want any cycle un-deferred?"

**Engraving-confirmation questions:**
- "S<NNN> engraved [N] new B_* contracts + [M] new P-META principles. Confirm these are ratified going forward, OR flag any you want re-litigated?"

**Open-question questions:**
- "Open questions in [open-questions-ledger.md]: [list]. Any to resolve in S<NNN+1> turn 1, or do they remain open?"

## Boundary 2 protocol — AI-to-AI subagent

```
Step 1: Main AI spawns subagent with AAP alignment-preamble + declared output_contract
Step 2: Subagent executes within scope (focused work — search/grep/log/fetch only per QG2)
Step 3: Subagent returns summary
Step 4: Main verifies returned summary matches output_contract:
  - max_tokens within declared limit?
  - shape matches `returns:` field?
  - no synthesis claims (per QG2)?
  - no ratification claims (per QG1)?
Step 5: IF mismatch → main re-spawns with clarification (e.g., "your previous output was N tokens but contract was M; re-run with stricter scope")
Step 6: Once contract-matched, main proceeds
```

Audit: `muv-subagent-output-contract-verification`. Hooks: `pre-subagent-spawn-aap-preamble.sh` + `post-subagent-return-verify.sh` (planned week-4).

## Boundary 3 protocol — AI-to-human

Substantive outputs (engraving / PCR / synthesis / multi-file change) end with an implicit or explicit "did this land?" check.

**Implicit:** the structure of the output makes misalignment obvious to the user (visible diff / clear PCR recommendation / explicit decision).

**Explicit (high-stakes):** the AI ends with a brief "if you wanted X interpreted differently, flag it; otherwise I proceed with Y next." This invites the user to surface ambiguity before committing.

The next user turn IS the validation. If user says "proceed", alignment confirmed. If user corrects, AI refines and re-emits.

## Boundary 4 protocol — AI-to-persona (week-7+)

Persona-composition function output validated against expected persona-shape:
- PLATFORM_CONSTITUTION present (per P-ARCH-013)
- DOMAIN_OVERLAYS matched to persona's domain (per `persona-overlay-completeness` audit)
- GUARDRAIL_BUNDLES include crisis-bundles per riskClass (per `crisis-escalation-removal` audit)
- traits + persona.systemPrompt + postHistoryInstructions in correct assembly order

**Fail-closed:** persona-dispatch refused if shape doesn't match. Per [pillar-5/persona-composition.md](../pillar-5-ai-systems/persona-composition.md) week-7+.

## Boundary 5 protocol — Context batches within session

Composes with P-OP-004 batched-execution:
- Batch proposed with acceptance criteria upfront (per P-OP-004 step 1-3)
- User approves once (per P-OP-004 step 4)
- Batch executes (per P-OP-004 step 5)
- **Batch close: validate intent-to-impact drift** (NEW per MUV):
  - Did all N items complete as proposed?
  - Did any item differ substantially from acceptance criteria?
  - If drift > threshold (judgment-based), pause + reconfirm with user before next batch

Composes with HANDOFF §16 intent-to-impact (which is per-session); MUV §5 boundary is per-batch.

## Audit composition

| Audit slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `muv-chat-jump-prompt-completeness` | PR | error | Every `chat-jump-prompt-S<NNN>-to-S<NNN+1>-detailed.md` has 8 mandatory sections + non-empty alignment-questions |
| `muv-subagent-output-contract-verification` | per-session | warn | Every Agent tool invocation has paired output verification logged |
| `muv-cross-chat-handshake-completion` | per-session | warn | Tracks chat-jump prompts; flags handshakes without iteration-to-alignment-confirmed within 7 sessions |

All registered atomically S005 turn 28 per FSE amendment. Build deferred week-4.

## Composition with existing CSPS principles

| MUV element | Composes with |
|---|---|
| Boundary 1 chat-to-chat | B_TWO_SIDED_HANDSHAKE (S002 turn 6-7 origin) + protocols.md §17 + B_GOVERNOR_PROMPTS + B_HANDOFF_PRE_FLIGHT_AUDIT |
| Boundary 2 AI-to-AI | B_AGENT_ALIGNMENT_PROTOCOL (S005 turn 25) — AAP IS the subagent handshake; MUV adds output_contract verification on return |
| Boundary 3 AI-to-human | B_AI_PROFESSIONAL_VOICE + B_VALIDATE_BEFORE_ASSUME (every state-claim paired with tool-call evidence) |
| Boundary 4 AI-to-persona | pillar-5/persona-composition.md + crisis-escalation slice (week-7+) |
| Boundary 5 context-batches | P-OP-004 batched-execution + B_INTENT_TO_IMPACT (HANDOFF §16) |
| Whole principle | P-META-006 RZF (re-run IS the proof; here re-run is the receiver-side validation) |
| Cross-chat iteration | HPFA + Governor Prompts (HPFA verifies handoff complete; MUV verifies handoff understood) |

## Sources

- [protocols.md §17](../_handoff/VAULT/protocols.md) — original two-sided handshake (S002 turn 6-7)
- [behavioral-contracts.md § B_TWO_SIDED_HANDSHAKE](./behavioral-contracts.md) — origin contract
- [agent-alignment-protocol.md](./agent-alignment-protocol.md) — boundary type 2 detailed spec
- [governor-prompts.md](./governor-prompts.md) — composes with chat-jump-prompt audit
- [closing-summary-template.md](../_handoff/VAULT/closing-summary-template.md) §10.0g — MUV evidence header
- TCP RFC 793 — three-way handshake formalization (industry precedent)
- WHO surgical safety checklist — closed-loop verbal protocol industry validation
- User S005 turn 28 directive — engraving source
