---
id: csps.governance.governor-prompts
name: governor-prompts-dashboard
description: Dashboard / spec leaf for Governor Prompts discipline. Defines per-prompt schema-aligned distribution rules + storage convention + session-close review process + audit composition + cross-links to user-intents.md (cardinal-only). Per P-META-012 + B_GOVERNOR_PROMPTS — every user prompt is governance-tracked with timestamp + verbatim + tags + distribution targets + implementation status.
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
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../../../packages/principles/principles.yaml }
  - { rel: contract, href: ./behavioral-contracts.md }
  - { rel: vault, href: ../_handoff/VAULT/governor-prompts/README.md }
  - { rel: user-intents, href: ../_handoff/VAULT/user-intents.md }
  - { rel: aap, href: ./agent-alignment-protocol.md }
  - { rel: cca, href: ./cognitive-context-architecture.md }
  - { rel: hpfa-leaf, href: ./behavioral-contracts.md }
created-new-because: |
  Governor Prompts discipline (P-META-012 + B_GOVERNOR_PROMPTS engraved S005 turn 27) needs a
  dashboard leaf at the schema's "proper place" — pillar-0-governance — to hold the per-prompt
  spec + distribution rules + session-close review process. Storage of the actual logs lives
  at _handoff/VAULT/governor-prompts/ (point-in-time per-session); this leaf is the canonical
  HOW (the spec) vs the logs which are the WHAT (instances).
domain_path: platform
---

# Governor Prompts — dashboard

> **Every user prompt is a load-bearing input. Tracked, tagged, distributed, re-reviewed.**

## What this leaf locks

The canonical SPEC for Governor Prompts (the discipline). The per-session LOGS live at [`_handoff/VAULT/governor-prompts/S<NNN>.md`](../_handoff/VAULT/governor-prompts/) — see [README.md](../_handoff/VAULT/governor-prompts/README.md) for the storage convention.

## The discipline

Every substantive user prompt in CSPS chat sessions:

1. **Gets a `GP-S<NNN>-<NN>` ID** (zero-padded; sequential per session)
2. **Captured verbatim** (paraphrasing loses load-bearing wording)
3. **Timestamped** with chat session ID + turn number + ISO 8601 UTC date+hour
4. **Tagged** with schema-aligned closed-enum dimensions
5. **Cardinal-flagged** if load-bearing for cross-session preservation
6. **Distributed per SCHEMA** — every prompt routes to relevant pillar leaves / behavioral contracts / principles / cognitive-context-architecture / audits / ADRs
7. **Status-tracked** — completed | in-progress | carry-forward | dropped
8. **Re-reviewed at session-close** (mandatory per B_GOVERNOR_PROMPTS + HPFA)
9. **Cardinal cross-linked** to [user-intents.md](../_handoff/VAULT/user-intents.md) — verbatim preserved across sessions

## Schema-aligned distribution rules

| Tag pattern | Routes to |
|---|---|
| `domain:dx` (UX / DX feedback) | pillar-4-developer-experience leaves; HANDOFF §2 if cardinal |
| `domain:ai-native` (token / model / cognitive context / agent behavior) | pillar-0-governance/cognitive-context-architecture.md; pillar-0/agent-alignment-protocol.md |
| `domain:governance` (rules / disciplines / contracts / principles) | pillar-0-governance leaves; principles.yaml row if engraved as P-* |
| `domain:architecture` (slice / app / generator / module-folder) | pillar-1 leaves; ADR if architectural |
| `domain:data` (schema / RLS / audit triggers) | pillar-2 leaves; ZModel files |
| `domain:platform` (Stripe / Clerk / catalog / templates) | pillar-3 leaves |
| `domain:ai` (persona / mastra / crisis) | pillar-5 leaves |
| `domain:ops` (deployment / build-order / dashboards) | pillar-6 leaves; ADR if deployment-class |
| `cardinal:true` | user-intents.md verbatim quote preserved |
| `engraving:<discipline>` | FSE 5-surface cycle fired; B_* contract added; spine matrix row; AGENTS.md hard NO |
| `audit:<scope>` | audit-runner.md registered atomically per FSE amendment |
| `decision:<topic>` | PCR rendered + ADR if architectural |
| `drop:<reason>` | logged for completeness; no further action; status: dropped |
| `question:<topic>` | open-questions-ledger.md OR answered inline |
| `confirmation:<scope>` | scope ratification logged |
| `typo:<source>` | logged + decoded if recoverable; status: dropped or completed |

## Per-session storage convention

```
docs/plan/_handoff/VAULT/governor-prompts/
  README.md              ── vault-level documentation
  S001.md                ── (retro-fillable from S001 chat log; pending)
  S002.md                ── (retro-fillable; pending)
  S003.md                ── (retro-fillable; pending)
  S004.md                ── (retro-fillable; pending)
  S005.md                ── FIRST COMPREHENSIVE LOG (S005 turn 27 — 23 substantive prompts)
  S006.md                ── (will be created live during S006)
  ...
```

Each session log:
- Frontmatter: `id` / `session_date` / `chat_session_id` / `total_substantive_prompts` / `tags` / `links`
- Aggregate metrics block (counts by category)
- Per-prompt entries (GP-S<NNN>-<NN> with full structured fields)
- Cardinal cross-link summary
- Distribution audit (HPFA cycle 6 input)

## Session-close review process

Per B_GOVERNOR_PROMPTS + B_HANDOFF_PRE_FLIGHT_AUDIT:

1. **Continuous during session** — substantive prompts get GP entries created as they arrive (NOT batched at close)
2. **Pre-close walk** — verify every prompt has GP entry; populate distribution targets for any that drifted
3. **Cardinal cross-link propagation** — verbatim cardinal phrases propagated to [user-intents.md](../_handoff/VAULT/user-intents.md)
4. **Aggregate to closing-summary §10.0e** — required header per closing-summary-template.md (NEW S005 turn 27)
5. **HPFA cycle 3** — audit verifies governor-prompts coverage is complete (no missing entries; no null distribution targets except explicit drops)
6. **Carry-forward gaps** — if any GP entries have status `carry-forward`, surface in HANDOFF §C explicitly

## Composition with other disciplines

| GP discipline element | Composes with |
|---|---|
| Continuous tracking | B_PROTOCOL_LITERAL_EXECUTION (real-time documentation pattern) |
| Cardinal cross-link | user-intents.md vault (preserves verbatim across sessions) |
| Distribution targets | every CSPS schema element (principle / contract / leaf / audit / ADR) |
| Session-close review | B_PRE_CLOSE_VERIFICATION (review runs after verify orchestrator) |
| HPFA integration | B_HANDOFF_PRE_FLIGHT_AUDIT (one of the 7 mandatory HPFA checks) |
| Tags closed-enum | pillar-1/frontmatter-standard.md (same closed dimensions) |
| EXT-ID complement | B_INTAKE_DISCIPLINE (EXT-IDs are external-content; GPs are chat-channel directives — different surfaces) |

## Audit composition

| Audit slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `governor-prompt-coverage` | per-session | error | Every substantive prompt in session log has GP-S<NNN>-<NN> entry; missing entries fail PR |
| `governor-prompt-distribution-complete` | PR | warn | Every GP entry has `distribution_targets` populated; null only for explicit drops |
| `cardinal-cross-link-propagated` | per-session | error | Every cardinal-flagged GP has corresponding entry in user-intents.md (cycle through 7+ cardinal GPs per session) |

All registered atomically S005 turn 27 per FSE amendment. Build deferred week-4.

## Anti-patterns

- **cardinal-prompt-without-user-intents-cross-link** — cardinal flag set but verbatim not propagated to user-intents.md
- **prompt-without-gp-entry** — substantive prompt skipped session log
- **distribution-targets-null-without-explicit-drop** — lazy entry; not real governance
- **gp-entries-batch-at-close-only** — should be continuous; close is review-not-creation
- **verbatim-paraphrased** — paraphrase loses load-bearing wording; verbatim is mandatory for cardinal
- **tags-arbitrary-not-schema-aligned** — must use closed-enum dimensions per frontmatter-standard
- **storage-not-in-vault** — GP entries logged in chat output but not in `_handoff/VAULT/governor-prompts/S<NNN>.md`

## Sources

- [`_handoff/VAULT/governor-prompts/README.md`](../_handoff/VAULT/governor-prompts/README.md) — vault-level convention
- [`_handoff/VAULT/user-intents.md`](../_handoff/VAULT/user-intents.md) — cardinal cross-link target
- [`pillar-1/frontmatter-standard.md`](../pillar-1-architecture-and-stack/frontmatter-standard.md) — closed-enum dimensions
- [`behavioral-contracts.md § B_GOVERNOR_PROMPTS`](./behavioral-contracts.md) — canonical contract
- [`principles.yaml#P-META-012`](../../../packages/principles/principles.yaml) — registry entry
- User S005 turn 27 directive — engraving source
