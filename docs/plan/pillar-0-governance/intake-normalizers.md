---
id: csps.pillar-0-governance.intake-normalizers
name: intake-normalizers
description: 4 source-class normalizer specs for the unified-intake architecture. Each spec defines how a raw input from a source class transforms into an IntakeEvent envelope per packages/schemas/intake-event.ts. Per unified-intake topic-plan L2 (S011 §24++) + Option C ratification (S008 GP-S008-05 cardinal).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, OPER, AI]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:ops
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S011
file_depth_markers:
  l1_lines: "1-70"
  l2_lines: "71-end"
  read_protocol: "L1 = 4 normalizer summary table. L2 = per-normalizer transformation rules."
links:
  - { rel: schema, href: ../../../packages/schemas/intake-event.ts }
  - { rel: router, href: ../../../tools/intake-router.mjs }
  - { rel: topic-plan, href: ../_handoff/VAULT/topic-plans/unified-intake.md }
domain_path: platform
---

# Intake Normalizers — CSPS

> **4 normalizers** — one per source class. Each transforms raw input → `IntakeEvent` envelope. The universal router reads envelopes; never source-class-specific logic.

## Summary table

| Source class | Input | classified_type examples | Default route_to |
|---|---|---|---|
| `chat-channel` | User prompt text | session-open-mandate / user-directive / question / ratification / post-close-addendum | SWIFT_EXECUTE (if 4-condition gate passes) or COUNCIL_REVIEW |
| `external-content` | File upload / URL / paste / EXT-ID | document / codebase / research / data | VAULT_DEFER (always review before executing) |
| `agent-output` | Subagent result / tool output | tool-result / explore-result / plan-output / error | SWIFT_EXECUTE (mechanical) or COUNCIL_REVIEW (synthesis) |
| `inner-default-leak` | AI training default surfacing | sycophancy / over-compression / invention-without-check / nominal-claim | COUNCIL_REVIEW (always surface; never auto-execute) |

---

## Normalizer 1 — chat-channel

**Input:** CLAUDE_USER_PROMPT environment variable (UserPromptSubmit hook)

**Transformation rules:**

```
raw           = prompt text verbatim
source_class  = 'chat-channel'
id            = GP-S<NNN>-<NN> (sequential per governor-prompts log)
classified_type =
  IF contains §17 receipt OR "You are S<N>" → 'session-open-mandate'
  IF contains "close session" OR "update the handoff" → 'session-close-directive'
  IF contains "engrave" OR "5/5 atomic" → 'engraving-directive'
  IF contains "?" → 'question'
  IF contains "I approve" OR "proceed" OR "confirmed" → 'ratification'
  IF contains "§24+" → 'post-close-addendum'
  ELSE → 'user-directive'
tags          = [domain:governance, type:directive, audience:ai-agent]
route_to      = SWIFT_EXECUTE if 4-condition gate passes (ratified ✓ reversible ✓ mechanical ✓ no-cross-actor ✓)
                COUNCIL_REVIEW otherwise
dialog_thread_id = session ID (S<NNN>)
```

---

## Normalizer 2 — external-content

**Input:** File upload / URL / EXT-ID paste (detected by user-prompt-submit-intake.sh)

**Transformation rules:**

```
raw           = content verbatim (file text OR URL OR EXT-ID)
source_class  = 'external-content'
id            = EXT-YYYYMMDD-NNN-X (per extractions-ledger.md convention)
classified_type =
  IF markdown/yaml → 'document'
  IF URL → 'url-reference'
  IF code → 'codebase'
  IF data/json → 'data'
tags          = [domain:governance] + inferred domain tags
route_to      = VAULT_DEFER (review before executing; never auto-execute external content)
mini_tree_layer = inferred from file size (< 5K → L1; < 30K → L1+L2; > 30K → L1+L2+L3)
deep_dive_schedule = next session (mandatory manual review before processing)
```

---

## Normalizer 3 — agent-output

**Input:** Agent() tool return value / Bash tool output / MCP tool result

**Transformation rules:**

```
raw           = tool output text verbatim
source_class  = 'agent-output'
id            = AGENT-<uuid>
classified_type =
  IF Explore agent result → 'explore-result'
  IF Plan agent result → 'plan-output'
  IF Bash exit 0 → 'tool-result'
  IF Bash exit non-0 → 'error'
  IF MCP result → 'mcp-result'
tags          = [domain:ops, type:tool-output]
route_to      = SWIFT_EXECUTE if result is mechanical (file list, verify output, compile result)
                COUNCIL_REVIEW if result requires synthesis (error diagnosis, design decision)
parent_id     = the chat-channel GP that spawned the agent
```

---

## Normalizer 4 — inner-default-leak

**Input:** AI training-default behavior detected (post-stop hooks, D1-D10 catalog)

**Transformation rules:**

```
raw           = detected AI output text that triggered the leak
source_class  = 'inner-default-leak'
id            = LEAK-S<NNN>-<NN>
classified_type =
  IF sycophancy detected → 'sycophancy'
  IF over-compression → 'over-compression'
  IF invention-without-check → 'invention-without-precedent'
  IF nominal ZF claim → 'nominal-claim'
  IF confirmation-seeking → 'confirmation-seeking'
tags          = [domain:governance, type:inner-default-violation]
route_to      = COUNCIL_REVIEW (always surface to user; inner-default leaks NEVER auto-execute)
evidence_refs = [behavioral-contracts.md § B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS]
```
