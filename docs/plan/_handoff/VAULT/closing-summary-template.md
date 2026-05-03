---
id: csps.handoff.vault.closing-summary-template
name: closing-summary-template
description: Required-header closing-summary template per protocols.md v1.7 §10. Every chat-close emits a closing summary using THIS template — every section is mandatory; empty section = audit fail post-runtime + AGENTS.md hard NO violation pre-runtime. Closes the protocol-compression-is-skipping gap surfaced S002 turn 14 (5 of 14 §10 items skipped).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
diataxis_type: how-to
links:
  - { rel: parent, href: ./README.md }
  - { rel: protocols, href: ./protocols.md }
  - { rel: feedback, href: ../../../../.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/feedback_protocol_compression_is_skipping.md }
---

# Closing Summary — required-header template

> **The handoff describes what SHOULD happen. The AI does what it REMEMBERS. The gap between them IS the failure mode.** — S002 turn 14 essence

## How to use this template

1. At session-open: AI runs TodoWrite, transcribing each section header below into a `pending` task referencing the protocol step.
2. During session: tasks become `completed` only with paired tool-call evidence.
3. At session-close: AI emits the closing summary using EVERY header below. Each section is mandatory. Empty section is forbidden. If item not applicable: state `NOT_APPLICABLE_WITH_REASON` explicitly.
4. Audit `closing-summary-checklist-completeness` (planned week 4) scans the emitted summary against this template + fails PR on missing or empty sections.

## The required headers

```markdown
## Closing summary — Session S<NNN>

### §10.1 Stewardship review (P-META-004)

**Run `/stewardship-review`:**
- [evidence: tool-call output OR "skill not yet implemented; manual scan walked X artifacts"]
- Pending-protocol items surfaced: <count + IDs>
- Pending-review items surfaced: <count + IDs>
- Active-stale items surfaced: <count + IDs>
- Items advanced this session: <list>
- Items extended (next_review_at): <list with reasons>

### §10.2 Learning Loop extract (P-META-005)

**Run `/learning-loop-extract`:**
- [evidence: tool-call output OR "skill stub fired; manual extraction walked session log"]
- Items extracted this session: <count + EXT-IDs>
- Confidence-band distribution: auto-accept N / human-review M / discard P
- K=2 recurrence-check fires: <count + topics>
- Auto-ADRs proposed: <count + IDs>
- "No insights, reason: <X>" — required when 0 items extracted

### §10.3 Handoff §0-§22 sections completion

For each handoff section in the new handoff being written:
- §0 paste-target: ✓ [path]
- §1 priority-zero: ✓
- §2 user-intent verbatim quotes: ✓
- §3 FWWS-pending: ✓
- §4 state-snapshot: ✓
- §5 approved-deferred-batch: ✓
- §6 insights synthesized: ✓
- §7 research index: ✓
- §8 vault-tree paths: ✓
- §9 tagging guidance: ✓
- §10 closing-protocol link: ✓
- §11 fresh-chat protocol link: ✓
- §12 naming protocol link: ✓
- §13 validation passes (3 perspectives + limits-line): ✓
- §14 LearningLoopItem extracts: ✓
- §15 Stewardship Protocol report: ✓
- §16 Intent-to-Impact validation: ✓
- §17 Two-sided handshake attestation (4-section payload): ✓
- §18 Blocker registry: ✓
- §19 RZF evidence block: ✓
- §20 CEC walk-trails: ✓
- §21 Grandfather backfill report: ✓
- §22 Detailed paste-prompt: ✓

Each ✓ requires evidence path. Each missing = explicit `DEFERRED: <reason>`.

### §10.4 MASTER_PLAN.md update

- Session-significant changes that warrant trunk update: <list OR "none">
- Migration tracker rows updated: <list>
- New artifact entries added: <list>

### §10.5 VAULT file appends

- `insights.md` — new insights appended: <count + summary>
- `research-index.md` — new research streams: <count>
- `open-questions-ledger.md` — new OQ-* items: <count>
- `blockers-S<NNN>.md` — new blockers: <count + IDs>
- `validation-pass-S<NNN>.md` — emitted: ✓ [path]
- `gaps-and-duplications-S<NNN>.md` — emitted: ✓ [path]

### §10.6 Prior session lifecycle_state

- HANDOFF-S<NNN-1>-to-S<NNN>.md: state transitioned `active → resolved` ✓ + `superseded_by:` field set

### §10.7 Final user message

- [verbatim text of the final user message — must include both paste-targets per v1.6 §22]
- Minimal paste: `Read docs/plan/_handoff/HANDOFF-S<NNN>-to-S<NNN+1>.md §0 and execute.`
- Detailed paste-prompt saved at: `_handoff/VAULT/chat-jump-prompt-S<NNN>-to-S<NNN+1>.md`

### §10.8 EXT-IDs surfaced (P-META-005)

For each EXT-ID processed this session:
- EXT-<ID>: source-type / state / contexts-routed-to / recommended-action

### §10.9 Blocker registry final state

- Open blockers: <count + IDs>  (must be 0 to write next-session handoff)
- Answered this session: <list with answers>
- Carry-forward to next session: <list>

### §10.10 RZF evidence block (P-META-006)

[per zero-findings-discipline.md format — cycles_run + findings_per_cycle + final_status + coverage + signature]

### §10.11 CEC walk-trail (P-META-006)

[per zero-findings-discipline.md format — extracted_essence + cycles_walked + walk_scope + applications_made + signature]

### §10.12 Grandfather backfill report (P-META-006 Component 5)

- Opportunistic-touch backfills (Layer 1): <count + artifact list>
- Recurrence-driven backfills (Layer 2): <count + artifact list>
- Floor evaluation (Layer 3): triggered? Y/N + reason
- Ceiling-deferrals: <count carried to next session>
- Oldest-grandfather-age: <days> + alert level (none / warn at >30d / error at >180d)

### §10.13 Self-audit (B_AI_PROFESSIONAL_VOICE check)

- Did AI assume without validating? <list with examples + remedies>
- Did AI guess without proof? <list>
- Did AI invent without precedent check? <list>
- Did AI fill gaps without asking? <list>
- Did AI create without checking existing decisions? <list>
- Engraved as memory entries / blockers / ADR drafts: <list>

### §10.13b Catches engraved this session (B_CATCH_TO_ENGRAVING — turn 15)

For each catch (gap / trap / anti-pattern / missing-execution / failure-mode) noticed this session:

| Catch (1-line) | Detected at | Classification | Engraved-to (artifact paths) | Surfaces hit (X/5) |
|---|---|---|---|---|
| <description> | turn N | pattern / composition / one-off / new-discipline | memory:... + contract:... + agents-md:... + schema:... + hook:... + validator:... | N/5 |

If 0 catches: state `NO_CATCHES_THIS_SESSION` explicitly. Empty section is forbidden. Every row's surfaces_count < 2 is a B_FIVE_SURFACE_ENGRAVING violation surfaced in §10.13c.

### §10.13c FSE evidence block (B_FIVE_SURFACE_ENGRAVING — turn 17)

For each new behavioral discipline engraved this session, emit one block:

```yaml
fse_evidence:
  discipline: <B_NAME or P-META-NNN>
  surfaces_targeted: [schema, validator, hook, memory, contract]
  surfaces_status:
    schema: { active | declared | deferred-week-N | n/a-with-reason, ref: <path> }
    validator: { active | declared | deferred-week-N | n/a-with-reason, ref: <path> }
    hook: { active | declared | deferred-week-N | n/a-with-reason, ref: <path> }
    memory: { active | declared | deferred-week-N | n/a-with-reason, ref: <path> }
    contract: { active | declared | deferred-week-N | n/a-with-reason, ref: <path> }
  surfaces_count_active: <N>
  surfaces_count_declared: <N>
  classify_decision: pattern | composition | one-off | new-discipline
  atomic_flag: <true | false-with-reason>
  meta_rzf_cycles: <N>
  meta_rzf_final: ZF-0-ACHIEVED-CYCLE-N | open-findings:<list>
  signature: <ai-id>@<iso-timestamp>
```

If 0 new disciplines engraved: state `NO_NEW_DISCIPLINES_THIS_SESSION` explicitly. Surfaces_count_active < 2 surfaces a B_FIVE_SURFACE_ENGRAVING anti-pattern; cannot close session without either reaching 2/5 minimum OR explicit deferral with rationale carried to next-session blocker registry.

### §10.14 TodoWrite final state

[paste full TodoWrite list — every task with state + evidence reference]
```

## Why every section is mandatory

Per `feedback_protocol_compression_is_skipping`: when ANY section is omitted, the omission is invisible to user without manual audit. The required-header template makes omissions impossible-to-hide:
- Empty section = AI explicitly states "NOT_APPLICABLE: <reason>"
- Missing section = closing summary is INCOMPLETE = AGENTS.md hard NO violation
- Audit `closing-summary-checklist-completeness` (planned week 4) catches both

## Pre-runtime enforcement

The closing AI walks this template literally as the closing summary skeleton. Tasks correspond 1:1 with sections. No shortcuts.

## Post-runtime enforcement (week 4+)

Audit `closing-summary-checklist-completeness` parses the closing summary; matches sections against this template; fails PR if any required header missing.

## Cross-references

- `_handoff/VAULT/protocols.md` v1.7 §10 — references this template as the canonical shape
- `pillar-0-governance/behavioral-contracts.md` § B_PROTOCOL_LITERAL_EXECUTION — the binding contract
- `~/.claude/.../memory/feedback_protocol_compression_is_skipping.md` — the cognitive layer
