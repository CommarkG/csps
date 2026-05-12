---
name: governance-session
description: When opening a new session OR closing one OR running session-protocol steps (chat-jump intake, §17 attestation, handoff write, closing-summary §10.0/0e/0f/0g/0h/0i/0j blocks, HPFA whole-session walk, governor-prompts log) — full session-protocol reference + checklist + step-list per protocols.md §10/§11. Triggers on "starting session", "session open", "close session", "handoff", "session protocols", "governance protocols", "S007", "S008", "open chat", "fresh chat".
allowed_tools: [Read, Write, Edit, Bash, Glob, Grep]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-META-008
backed_by_contract: B_PROTOCOL_LITERAL_EXECUTION
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_PROTOCOL_LITERAL_EXECUTION
  - B_PRE_CLOSE_VERIFICATION
  - B_HANDOFF_PRE_FLIGHT_AUDIT
  - B_GOVERNOR_PROMPTS
  - B_MUTUAL_UNDERSTANDING_VALIDATION
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-protocol-step-list-or-attestation-block
  max_tokens: 3000
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: true
principle_compliance:
  - P-META-010    # AAP — operates under agent-alignment-protocol
  - P-META-002    # principles-travel-with-artifacts
consolidation_cross_refs: []    # empty = genuinely-novel skill per B_CONSOLIDATION_PASS

template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
---

# /governance-session — CSPS Session Protocols Reference

## When to invoke

- Opening a fresh chat (S<NNN+1>) → load §17 attestation checklist + receipt-signature format + Step 0 ASK
- Mid-session protocol step (HPFA / governor-prompts log entry / §10.0 verify gate)
- Closing a session → load §10.0/0e/0f/0g/0h/0i/0j/10/11/13 + §17 attestation block requirements + chat-transfer 12-item register

## When to skip (counterweight)

Trivial conversational turns ("proceed" / "ok" / "thanks") don't trigger this skill — abbreviated GP entry suffices.

## Quick reference

### Session-open protocol (per protocols.md §11)
1. Verify workspace via Glob (parent CLAUDE.md "Wrong workspace" warning is known false-positive)
2. Read HANDOFF-S<prev>-to-S<curr>.md §0 + execute step list literally per B_PROTOCOL_LITERAL_EXECUTION
3. Read priority-zero files (OVERVIEW + manifests + protocols + naming-policy + closing-summary §17)
4. Read governor-prompts/S<prev>.md for cardinals
5. Run §1.1 verification command
6. Emit FIRST REPLY: identity banner + §17 attestation per-line ✅/❓ + receipt signature + 12 alignment-question answers + Step 0 ASK USER

### Session-close protocol (per protocols.md §10)
- §10.0 pre-close verification (`pnpm verify` exit_code 0)
- §10.0e governor-prompts session log (B_GOVERNOR_PROMPTS)
- §10.0f Handoff Pre-Flight Audit (9 mandatory checks)
- §10.0g Mutual Understanding Validation (5 boundary types)
- §10.0h inner-default leak report
- §10.0i alignment-citation summary
- §10.0j enhancement-proposals (B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2)
- §10.10 RZF aggregate
- §10.11 + §10.11b CEC + positive value extraction
- §10.13 + §10.13b/c/d FSE aggregate + catches + PCR-decisions
- §17 two-sided handshake attestation

### Chat-transfer 12-item register (per token-optimization.md §15)
HANDOFF + minimal chat-jump-prompt + detailed chat-jump-prompt + HPFA + closing-summary + governor-prompts log + user-intents.md cardinals + topic-plan stub + OVERVIEW update + commit + push + verify exit_code 0.

## Backed by

P-META-008 cycle-mandatory-in-plan + B_PROTOCOL_LITERAL_EXECUTION (S002 turn 14) + B_PRE_CLOSE_VERIFICATION (P-META-008 / S005 turn 19) + B_HANDOFF_PRE_FLIGHT_AUDIT (P-META-013 / S005 turn 27) + B_GOVERNOR_PROMPTS (P-META-012 / S005 turn 27) + B_MUTUAL_UNDERSTANDING_VALIDATION (P-META-014 / S005 turn 28). Full canonical: [protocols.md](../../../docs/plan/_handoff/VAULT/protocols.md).
