---
name: proto-relay
description: Generates a formalized PROTO relay block per PROTO-AND-TAB-TRANSFER-PROTOCOL §3. Includes protocol header, FROM/TO roles, core seeds, DONE criteria, and ZF gate at the end (via /zf-cycle). Triggers on "proto-relay", "write relay", "generate relay", "relay block", "PROTO relay for", "write the relay message".
allowed_tools: [Read, Bash]
allowed_subagents: []
allowed_outbound_hosts: []
sensitive_data_access: false
backed_by_principle: P-META-012
backed_by_contract: B_GOVERNOR_PROMPTS
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_GOVERNOR_PROMPTS
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured PROTO relay block
  max_tokens: 800
  no_synthesis_outside_main: true
trust_tier: platform-owned
preflight_check_required: false
principle_compliance:
  - P-META-010
  - P-META-012
  - P-META-002
consolidation_cross_refs: []
scope_level: S1
batch: BATCH-L
template_grade: A
parent_template: skill-base
links:
  - { rel: proto-transfer-protocol, href: ../../../../docs/plan/pillar-0-governance/PROTO-AND-TAB-TRANSFER-PROTOCOL.md }
---

# /proto-relay — PROTO Relay Block Generator

## When to invoke

- Writing a Sonnet→Opus relay (reporting STEP complete, asking for ADVANCE)
- Writing an Opus→Sonnet relay (Governor is passing Opus's directive to Sonnet)
- Any cross-role communication about a PROTO step
- When /step-accept results in ADVANCE and a relay is needed to propagate

## Required inputs

1. PROTO ID (e.g., PROTO-S063-A)
2. Current STEP and its status
3. Role of sender (Opus / Sonnet)
4. Role of receiver
5. Core seeds for the relay body (what was done / what to do next)

## Output format (exact structure required)

```
[PROTOCOL: <PROTO-ID> | STEP: <N> <description> | MODE: exec-session]
FROM: <role>
TO:   <role>
RE:   <one-line summary>

<body with core seeds>

DONE CRITERIA (for receiver):
  - <specific criterion 1>
  - <specific criterion 2>

ZF GATE:
  <ZF block via /zf-cycle>
```

## Rules

1. PROTOCOL line must be verbatim format — `[PROTOCOL: X | STEP: Y | MODE: Z]`
2. FROM and TO are always explicit role labels (Opus-10, Sonnet-10, Governor, etc.)
3. Body must include core seeds — the minimum viable context for the receiver to start
4. DONE CRITERIA must be specific and verifiable (not "do a good job")
5. ZF GATE is required for every Sonnet→Opus relay (not optional)
6. If writing Opus→Sonnet: use ADVANCE directive format from consolidated-mandate pattern

## Composability

- Uses /zf-cycle for the ZF block at the end
- Composes with /verify-quick if THIS-HEAD verify evidence is needed
- Output saved to tools/council/sonnet-turn.md (Sonnet→Opus) or as relay file (Opus→Sonnet)
