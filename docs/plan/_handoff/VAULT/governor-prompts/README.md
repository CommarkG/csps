---
id: csps.handoff.vault.governor-prompts
name: governor-prompts-vault
description: Per-session Governor Prompts vault. Every user prompt is governance-tracked with GP-S<NNN>-<NN> ID, verbatim content, chat/session/date/hour timestamp, schema-aligned tags, distribution targets (principle / contract / leaf / audit / ADR / decision / drop). Re-reviewed at every session close. Composes with HANDOFF §2 user-intents (verbatim cardinal directives) but is COMPREHENSIVE — every prompt, not just cardinal. Per P-META-012 + B_GOVERNOR_PROMPTS.
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
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: principle, href: ../../../../../packages/principles/principles.yaml }
  - { rel: contract, href: ../../../pillar-0-governance/behavioral-contracts.md }
  - { rel: dashboard, href: ../../../pillar-0-governance/governor-prompts.md }
  - { rel: user-intents, href: ../user-intents.md }
session_index:
  - S001 (TBD — retro-fillable from S001 chat log if needed)
  - S002 (TBD — retro-fillable)
  - S003 (TBD — retro-fillable)
  - S004 (TBD — retro-fillable)
  - S005 (NEW — first comprehensive log; created S005 turn 27)
domain_path: platform
---

# Governor Prompts Vault

> **Every user prompt is a load-bearing input. Tracked, tagged, distributed, re-reviewed.**

## What this vault holds

Per-session structured logs of every substantive user prompt. Each prompt gets:

- **GP ID:** `GP-S<NNN>-<NN>` (zero-padded; sequential per session)
- **Timestamp:** chat / session / date (ISO 8601 UTC) / hour
- **Verbatim content:** the user's exact words preserved (paraphrasing loses meaning)
- **Tags:** schema-aligned per [pillar-1/frontmatter-standard.md](../../../pillar-1-architecture-and-stack/frontmatter-standard.md) closed dimensions (`domain:` / `type:` / `audience:` / etc.)
- **Cardinal flag:** is this a load-bearing user-intent worth preserving in [user-intents.md](../user-intents.md)?
- **Distribution targets:** what was engraved/amended/registered/dropped:
  - `principle:` — engraved as P-* row
  - `contract:` — engraved as B_* contract
  - `leaf:` — pillar leaf amended/created
  - `audit:` — audit registered
  - `adr:` — ADR filed
  - `decision:` — non-trivial decision (with PCR rendered)
  - `drop:` — explicit user dismissal (still logged for completeness)
- **Implementation status:** `completed` | `in-progress` | `carry-forward` | `dropped`
- **Engravings produced:** list of artifact paths created/modified in response

## Why this exists

User S005 turn 27 directive: *"I want all I write each time to be reviewed each time a session is closing and saved in a specific place... Each content must be deeply understood and distributed according to the SCHEMA structure! Even if content is addressing UX and token optimization it must be saved and tagged and mention the chat and the session and the date and the hour."*

Without comprehensive prompt governance:
- Cardinal directives get captured in user-intents.md (✓ exists)
- Substantive engravings get captured in handoff §2 (✓ exists)
- BUT every prompt — including UX feedback / token-optimization questions / "drop it" dismissals / "proceed" ratifications — gets lost mid-session unless explicitly recalled
- Schema-aligned distribution (which leaf / which audit / which principle) is implicit in AI memory, not mechanically captured

With comprehensive prompt governance:
- Every prompt logged with timestamp + verbatim + distribution
- Mid-session pattern detection becomes possible (e.g., 3 prompts about caching → caching is a recurring concern → engrave)
- Future-session re-derivation is mechanical (read S<NNN>.md → rebuild context)
- Recurring audit catches missing entries pre-handoff

## Schema-aligned distribution rules

| Tag pattern | Distribution target |
|---|---|
| `domain:dx` (UX / DX feedback) | pillar-4-developer-experience leaves; cite in HANDOFF §2 if cardinal |
| `domain:ai-native` (token / model / cognitive context) | pillar-0-governance/cognitive-context-architecture.md; pillar-0/agent-alignment-protocol.md |
| `domain:governance` | pillar-0-governance leaves; principles.yaml row if engraved as P-* |
| `cardinal:true` | user-intents.md verbatim quote preserved |
| `engraving:<discipline>` | FSE 5-surface cycle fired; B_* contract added; spine matrix row; AGENTS.md hard NO |
| `audit:<scope>` | audit-runner.md registered atomically per FSE amendment |
| `decision:<topic>` | PCR rendered + ADR if architectural |
| `drop:<reason>` | logged for completeness; no further action |
| `question:<topic>` | open-questions-ledger.md OR answered inline |
| `confirmation:<scope>` | scope ratification logged |

## How to use this vault

**During a session (continuous; NOT batch-at-close):**

When a user prompt arrives that is substantive (not a single-word like "ok" or "thanks"), the AI emits inline acknowledgment + creates/updates the GP entry in the active session log.

**At session close (mandatory per B_GOVERNOR_PROMPTS):**

1. Walk the session chronologically; verify every substantive prompt has a GP entry
2. Verify each entry has all required fields populated (no nulls except for explicit drops)
3. Verify distribution targets are real (referenced principle/leaf/audit exists)
4. Aggregate to closing-summary §10.0e (NEW header — mandatory per B_GOVERNOR_PROMPTS)
5. Cross-link cardinal-flagged GPs into [user-intents.md](../user-intents.md) (preserves verbatim across sessions)

**At fresh session open:**

The new session reads the latest S<NNN>.md to understand prior-session prompt context — what the user asked, decided, dropped — beyond what user-intents.md captures.

## Format per S<NNN>.md

See [S005.md](./S005.md) — the first comprehensive log; structured table with aggregate metrics + per-prompt entries.

## Audit composition

- `governor-prompt-coverage` — per-session: every substantive prompt has a GP entry; missing entries fail PR
- `governor-prompt-distribution-complete` — per-PR: every GP entry has distribution targets populated; null targets only allowed for explicit drops
- Both registered atomically S005 turn 27 per FSE amendment; build deferred week-4

## Cross-references

- [user-intents.md](../user-intents.md) — the cardinal-only verbatim vault (Governor Prompts is comprehensive; user-intents.md is curated subset)
- [pillar-0-governance/governor-prompts.md](../../../pillar-0-governance/governor-prompts.md) — the dashboard / spec leaf
- [behavioral-contracts.md § B_GOVERNOR_PROMPTS](../../../pillar-0-governance/behavioral-contracts.md) — the contract
- [principles.yaml#P-META-012](../../../../packages/principles/principles.yaml) — the principle
- [_intake/manual-protocol.md](../../../_intake/manual-protocol.md) — for EXT-IDs (uploads/pastes/URLs); Governor Prompts is for chat-channel directives (different surface)
