---
name: slim-handoff
description: When authoring HANDOFF-S<NNN>-to-S<NNN+1>.md OR closing-summary-S<NNN>.md OR chat-jump-prompt detailed/minimal — load Zone A/B/C/D structure + 22 sections schema + 8 mandatory MUV sections + chat-transfer 12-item register + HPFA evidence block + receipt-signature format. Triggers on "handoff", "HANDOFF", "session close", "chat-jump", "chat transfer", "Zone A", "closing summary", "§17 attestation", "carry-forward".
allowed_tools: [Read, Write, Edit, Grep, Glob, Bash]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-META-013
backed_by_contract: B_HANDOFF_PRE_FLIGHT_AUDIT
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_HANDOFF_PRE_FLIGHT_AUDIT
  - B_MUTUAL_UNDERSTANDING_VALIDATION
  - B_PROTOCOL_LITERAL_EXECUTION
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-handoff-or-chat-jump-prompt
  max_tokens: 4000
  no_synthesis_outside_main: true
  no_ratification_claims: true
  zone_a_requirements:
    core_pillars_required: true
    # §CORE-PILLARS in Zone A is MANDATORY — AGENTS.md hard NO enforces this.
    # Every HANDOFF must include a §CORE-PILLARS table showing:
    #   5 Core Spine statuses (GVRN/ARCH/AI/OPER/VALD) + FOUNDATION_EXIT_GATE result.
    # Confirmed missing by Opus Turn 11 grep (S025 D1+D2 resolution).
    format: |
      ### §CORE-PILLARS (Zone A — mandatory)
      | Spine | Status | Notes |
      |---|---|---|
      | GVRN | [active/pending] | [key governance state] |
      | ARCH | [active/pending] | [schema/code state] |
      | AI | [active/pending] | [behavioral contracts/validators] |
      | OPER | [active/pending] | [deployment/hooks state] |
      | VALD | [active/pending] | [ZF/validator state] |
      FOUNDATION_EXIT_GATE: [CLEAN/BLOCKING — validate-phase-exit-criteria.mjs result]
trust_tier: platform-owned
preflight_check_required: true
principle_compliance:
  - P-META-010    # AAP — operates under agent-alignment-protocol
  - P-META-002    # principles-travel-with-artifacts
consolidation_cross_refs: []    # empty = genuinely-novel skill per B_CONSOLIDATION_PASS

---

# /slim-handoff — Handoff + Chat-Jump Authoring

## When to invoke

- Session-close authoring (HANDOFF + closing-summary + chat-jump-prompt minimal + detailed)
- Mid-session HPFA whole-session walk
- Chat-transfer 12-item register population

## Zone A/B/C/D structure (HANDOFF-S<NNN>-to-S<NNN+1>.md)

| Zone | Purpose | Read time |
|---|---|---|
| **A — IMMEDIATE** | §0 paste-target self-contained; everything to start | ~2 min |
| **B — CONTEXT** | What this session did; intent-to-impact | ~5 min |
| **C — SCOPE** | What next session might do (FWWS-pending) | ~10 min |
| **D — REFERENCE** | Full §0-§22 details | ~30 min |

## §0 paste-target requirements (Zone A)

- Identity banner ("You are S<NNN+1>")
- What S<NNN> accomplished (bullet list)
- Hard rules (extends from prior + new)
- Cardinal directives verbatim
- Verification command (§1.1)
- Step list literal per B_PROTOCOL_LITERAL_EXECUTION

## 22 sections schema

§0 paste-target / §1 priority-zero / §2 user-intent vault / §3 FWWS-pending / §4 state snapshot / §10 chat-closing protocol / §11 fresh-chat protocol / §13 validation passes / §14 LearningLoop / §15 Stewardship / §16 intent-to-impact / §17 two-sided handshake attestation / §18 blocker registry / §22 detailed paste-prompt + §23 last-words.

## Chat-jump-prompt 8 mandatory sections (per B_MUV)

1. HANDOFF §0 paste-target reference
2. Post-close addenda references
3. Governor Prompts log pointer
4. HPFA evidence block pointer
5. All carry-forwards with explicit reasons (table)
6. All cardinal directives verbatim
7. `pnpm verify` orchestrator state
8. **EXPLICIT ALIGNMENT-QUESTIONS section** (≥10 questions covering scope-confirm + cardinal-interp + engraving-confirm + verification-state + open-question + process-confirm)

## Chat-transfer 12-item register (per token-optimization.md §15)

1. HANDOFF authored
2. chat-jump-prompt minimal authored
3. chat-jump-prompt detailed authored (8 mandatory sections + alignment-questions)
4. HPFA whole-session walk + §10.0f attestation
5. closing-summary-S<NNN>.md authored
6. Governor Prompts S<NNN>.md log finalized
7. user-intents.md cardinal section finalized
8. topic-plan stub or active update
9. OVERVIEW.md updated
10. final commits with conventional messages
11. `pnpm verify` exit_code 0 (post-close)
12. `git push` confirming origin/main clean (per Q-2 B)

## §17 attestation (two-sided handshake)

```yaml
handoff_attestation:
  prior_session: S<NNN>
  next_session: S<NNN+1>
  attested_by: prior_session_AI
  attested_at: <ISO>
  intent: <stated intent>
  constraints_decisions: <list>
  open_items: []
  open_items_deferred: <list with sla>
  evidence: <list of claim/evidenced_in pairs>
  signature: S<NNN>-AI-attest-<iso>-<scope>
```

Receipt format (next session): `S<NNN+1>-AI-receipt-<iso>-against-S<NNN>-AI-attest-<iso>-<scope>`.

## Backed by

P-META-013 + B_HANDOFF_PRE_FLIGHT_AUDIT (S005 turn 27) + B_MUTUAL_UNDERSTANDING_VALIDATION (S005 turn 28). Full canonical: [protocols.md](../../../docs/plan/_handoff/VAULT/protocols.md) §10/§11/§17/§22 + [mutual-understanding-validation.md](../../../docs/plan/pillar-0-governance/mutual-understanding-validation.md).
