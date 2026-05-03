---
id: csps.handoff.vault.protocols
name: handoff-vault-protocols
description: Canonical closing/fresh-chat/session-naming protocols for CSPS. Every per-session handoff (HANDOFF-S<NNN>-to-S<NNN+1>.md) references THIS file rather than re-stating the protocols inline. v1.2 adds intent-to-impact validation (§10/§16) + two-sided handshake attestation (§11b) + blocker registry surfacing (§11 step 7) — all per user directive S002 turn 6. Source of truth — handoff files are the per-session derivative.
version: 1.8                   # S003 §3.5.e: §11b.1 signature + §11b.2 receipt + continuity-manifest fields formalized (closes EXT-20260502-003-C CSP carry-forward)
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
diataxis_type: how-to
links:
  - { rel: parent, href: ./README.md }
  - { rel: stewardship, href: ../../pillar-0-governance/stewardship-protocol.md }
  - { rel: learning-loop, href: ../../pillar-0-governance/learning-loop.md }
  - { rel: source-handoff, href: ../HANDOFF-S001-to-S002.md }
---

# CSPS Session Protocols (canonical)

> **Chat "jumps" are where golden coins fall off pockets and never retrieved. This document is the pocket-seal.**

## What this file holds

The canonical closing protocol, fresh-chat protocol, and session-naming/numbering protocol — referenced by every `HANDOFF-S<NNN>-to-S<NNN+1>.md`. When the protocols change (e.g., a new meta-principle adds a checkpoint), update HERE; the per-session handoff just links.

This file's `version: 1.1` reflects the addition of P-META-004 Stewardship + P-META-005 Learning Loop checkpoints in the closing protocol §10 and fresh-chat protocol §11 (added in S002). Version 1.0 was the S001-shipped baseline.

## §10 Chat-closing protocol (mandatory checklist for every chat close)

Run this exact sequence when context budget drops below 15%:

- [ ] **Stop new substantive work; switch to closing mode.**
- [ ] **Run `/stewardship-review`** (P-META-004 enforcer) — surface every `pending-protocol`, `pending-review`, and `active`-stale item. Either advance state OR extend `next_review_at` with a stated reason. Never silent-park.
- [ ] **Run `/learning-loop-extract`** (P-META-005 enforcer) — capture insights, errors, gaps, decisions, near-misses from the session. Verify ≥1 item routed OR explicitly mark "no insights, reason: <X>" in the closing summary. The PostStop hook (`.claude/hooks/post-stop-learning-loop.sh`) auto-fires this; the AI must reference its output in the closing summary.
- [ ] Write `docs/plan/_handoff/HANDOFF-S<NNN>-to-S<NNN+1>.md` (use the latest existing handoff as template). Required sections:
  - [ ] §0 — Paste-target block: "You are S<NNN+1>. S<NNN> is complete." + What was accomplished + What S<NNN+1> must do (numbered list, in order) + Hard rules + Cardinal directives (verbatim quotes preserved). **The §0 block must be self-contained** — a fresh AI reading ONLY §0 should know exactly what to do.
  - [ ] §0.5 — Protocol contract for ALL future handoffs (this canonical shape, by reference)
  - [ ] §1 Priority-zero actions for next chat (in execution order)
  - [ ] §2 User intent verbatim quotes (ALL load-bearing intents from this session)
  - [ ] §3 FWWS-pending work (in order, with acceptance criteria each)
  - [ ] §4 State snapshot (what's complete; the diff from previous session)
  - [ ] §5 Approved-but-deferred batch (with acceptance criteria)
  - [ ] §6 Insights synthesized this session (preserve mental model — these flow into VAULT/insights.md)
  - [ ] §7 Research index (topic + outcome destination — these flow into VAULT/research-index.md)
  - [ ] §8 Schema-aligned vault tree (paths)
  - [ ] §9 Tagging guidance for retrieval
  - [ ] §10 Chat-closing protocol (link to THIS file; don't duplicate)
  - [ ] §11 Fresh-chat protocol (link to THIS file; don't duplicate)
  - [ ] §12 Session naming + numbering protocol (link to THIS file; don't duplicate)
  - [ ] §13 Validation passes (3 perspectives; extract enhancements)
  - [ ] **§14 LearningLoopItem extracts from this session** (P-META-005 — list new items routed)
  - [ ] **§15 Stewardship Protocol report** (P-META-004 — list state transitions made + items extended)
  - [ ] **§16 Intent-to-Impact validation** (added v1.2) — prior session's stated-intent (verbatim from its §0) + this session's actual-impact (delivery diff) + drift assessment (in-scope / out-of-scope additions / scope cuts). If drift exceeds threshold (≥3 substantial out-of-scope items OR ≥1 critical out-of-scope), trigger ADR.
  - [ ] **§17 Two-sided handshake attestation** (added v1.2) — prior session pre-attests what next session needs in context (checklist of facts, files, decisions, blockers); next session's first reply MUST check each box OR raise question. The handoff is not consumed until next chat acknowledges.
  - [ ] **§18 Blocker registry** (added v1.2) — list every BLK-S<NNN>-* in `_handoff/VAULT/blockers-S<NNN>.md` with state. AI cannot write the handoff if any blocker is in `state: open`. Carry over open blockers to S<NNN+1>'s registry.
  - [ ] **§19 RZF evidence block** (added v1.4 — P-META-006 RZF) — every artifact transitioned to lifecycle_state ∈ {validated, closed} this session has its evidence block recorded. Format: `cycles_run + findings_per_cycle + final_status (ZF-0 ACHIEVED Cycle N) + coverage (mechanical/semantic/propagation/user-visible-outcome) + validators_run + signature`. AGENTS.md hard NO blocks DONE/COMPLETE/RATIFIED/VALIDATED/CLOSED claims without this.
  - [ ] **§20 CEC walk-trails** (added v1.4 — P-META-006 CEC) — every new principle / leaf / ADR / behavioral contract / pattern / insight ratified this session has its walk-trail recorded. Format: `extracted_essence (1 sentence) + cycles_walked + opportunities_per_cycle + walk_scope (each category) + applications_made + not_applicable + needs_human_judgment + signature`. AGENTS.md hard NO blocks ratification claims without this.
  - [ ] **§21 Grandfather backfill report** (added v1.5 — P-META-006 Component 5) — list grandfather artifacts touched this session via opportunistic-touch (Layer 1) + recurrence-driven (Layer 2). Compute oldest-grandfather-age. If 0 backfills + oldest > 30 days → MUST pick top-priority grandfather artifact + apply RZF + CEC before close (Layer 3 floor). Report ceiling-deferrals (>3 = next session). Hard error if oldest > 180 days. AGENTS.md hard NO covers; audit `grandfather-list-age` PR-blocks post-runtime.
- [ ] Update `MASTER_PLAN.md` if session-significant changes occurred (especially the migration tracker).
- [ ] Update VAULT files: append to `insights.md` if new insights; append to `research-index.md` if new streams; append to `open-questions-ledger.md` if new open questions; append to `blockers-S<NNN>.md` if new asks.
- [ ] Update prior session's handoff `lifecycle_state`: change from `active` to `resolved` since this S<NNN+1> handoff supersedes it.
- [ ] Final message to user — say literally:
      *"Handoff written to `docs/plan/_handoff/HANDOFF-S<NNN>-to-S<NNN+1>.md`. Open new chat with title `S<NNN+1> [continues S<NNN>]` and paste: 'Read `docs/plan/_handoff/HANDOFF-S<NNN>-to-S<NNN+1>.md` §0 and execute.'"*
- [ ] **§22 Detailed paste-prompt for new chat** (added v1.6 — closes the gap user identified S002 turn 13: AI auto-generated only minimal Read-§0 paste, not detailed standalone prompt). The closing AI MUST generate a self-contained ~150-300 word detailed prompt the user can paste directly. Format: chat title + scope summary + handoff path + first-actions checklist + first-response expectations. Goes alongside the minimal paste-target. The minimal paste targets the AI; the detailed prompt targets the user (so they understand what they're triggering). Stored at `_handoff/VAULT/chat-jump-prompt-S<NNN>-to-S<NNN+1>.md` for re-use if user opens chat in different IDE/context.

### Why these specific checkpoints

The §10 checklist is the **mechanical guarantor** that no session ends without:
1. Saved-without-trigger artifacts being addressed (P-META-004)
2. Session insights being captured (P-META-005)
3. The next session having a self-contained paste-target (the §0 block)

Without all three, the next session's continuity erodes — and that erosion compounds across sessions until the chat-jump problem returns.

## §11 Fresh-chat protocol (what S<NNN+1> does on open)

Paste this as the opening message in a fresh chat:

```
Read `docs/plan/_handoff/HANDOFF-S<NNN>-to-S<NNN+1>.md` §0 and execute.
```

The fresh chat then runs:

0. **🆕 v1.3 — STEP 0: Ask user about prior-platform precedent.** Before reading ANY other doc, the AI's FIRST action is: *"Do you have prior-platform precedent (CSP carry-forwards, prior planning systems, prior architecture decisions, prior memory/feedback files, etc.) that should inform CSPS design before I build new structures? For the work I'm about to do (per §3 / §0 paste-target), please share if yes."* Wait for explicit user response (yes-with-pointer / no / not-this-session). This step EXISTS because S002 turn 7 surfaced the biggest failure pattern: AI built parallel structures from research before the user's CSP carry-forward docs (treasures #1+#2) arrived. Asking step-0 mechanically prevents this. Per B_CHECK_EXISTING_DECISIONS_FIRST + B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK. Resolved as BLK-S002-008 turn 9 → option A.

1. **Read the handoff §0 paste-target block** (self-contained instructions).
2. **Read MASTER_PLAN.md** (trunk index).
3. **Read AGENTS.md** (AI contract).
4. **Read principles.yaml** (single source of truth — 4 operating + 27 architecture + 5 meta principles).
5. **Read pillar-0/operating-principles.md** (FWWS, PCR, reuse-first, batched-execution definitions).
6. **Read pillar-0/mechanical-enforcement.md** (the 4-layer enforcement spine).
7. **Read `_handoff/VAULT/blockers-S<NNN>.md`** (added v1.2) — list every `state: open` blocker; surface in fresh-chat's first response. Re-ask for resolution OR carry to new session's blocker file.
8. **Run `/stewardship-review`** (P-META-004) — surface every `pending-protocol`, `pending-review`, and `active`-stale item. For each, either advance state or extend `next_review_at` with a reason.
9. **Read inbox `LearningLoopItem` table** (P-META-005) — items in `observed` or `triaged` may need attention this session. Items in `routed` matching the session's scope auto-considered for the work plan.
10. **Read `_handoff/VAULT/blockers-S<NNN>.md` schema-gap entries** + the schema-gap registry — surface any K=2-reached schema-gaps for ADR consideration this session.
10b. **Check grandfather list age** (added v1.5) — if any grandfathered artifact is >90 days in list, surface in opening response as aged-warning. If >180 days, raise as BLK-S<NNN+1>-* blocker. Per `qc-audit-system.md` Component 5 Layer 3.
11. **Verify state matches §4 of the handoff.** If anything differs, surface it before proceeding.
12. **Execute §17 two-sided handshake attestation** (added v1.2): for each line in the prior handoff's §17 checklist, either ✅ (acknowledged + verified) OR ❓ (raise as question). The new chat's FIRST REPLY to the user contains this checklist. Work cannot proceed until every line has a ✅ or ❓.
13. **Validate intent-to-impact** (added v1.2): read the prior handoff's §16. Confirm the prior session's stated-intent matches what was actually delivered. Surface any gap to the user before proceeding.
14. **Execute §3 FWWS-pending in order.** Do not start §5-approved batch work until §3 is complete.
15. **Then proceed with the §5-approved batch** (if applicable).
16. **Maintain FWWS / PCR / reuse-first / batched-execution discipline throughout.**
17. **At end of every batch**, run §10 closing protocol when context drops below 15%.

The fresh-chat protocol is the dual of the closing protocol — every checkpoint at close has a complementary checkpoint at open.

### §11b Two-sided handshake — the attestation contract (v1.2)

The user's S002 turn-6 directive: *"two sided check list to be confirmed on the new site... presented to previous chat with clarifications and new chat continues only when: previous chat approves new chat has complete context AND new chat confirm it has no more questions."*

The mechanical answer:

**Side 1 — Previous session pre-attests** (in §17 of the handoff). Per S002-turn-6 research (validated against SBAR clinical handover, OpenAI Agents SDK handoffs, military command handover, Toyota shift-change kata, Amazon working-backwards), use the **4-section structured briefing** payload:

```yaml
handoff_attestation:
  prior_session: S<NNN>
  next_session: S<NNN+1>
  attested_by: prior_session_AI
  attested_at: <ISO timestamp>

  # Section 1 of 4 — INTENT (one-sentence verifiable goal of prior session)
  intent: "Complete §3 FWWS-pending (Stewardship Protocol + Learning Loop + Vault + ADRs + Pillar-3 migration) and produce HANDOFF-S<NNN>-to-S<NNN+1>.md"

  # Section 2 of 4 — CONSTRAINTS / DECISIONS MADE (closed-enum or list)
  constraints_decisions:
    - "ADRs filed: <list of ADR-NNNN IDs accepted this session>"
    - "Schema changes proposed: <list of schema-gap registry entries>"
    - "Items routed: <count of EXT-IDs entered + their pipeline_state distribution>"
    - "Hard NOs added to AGENTS.md: <list>"
    - "Protocols.md version: 1.X (changes: ...)"

  # Section 3 of 4 — OPEN ITEMS (every unresolved thing the next session must address)
  open_items:
    - id: BLK-S<NNN>-NNN
      type: blocker
      summary: "<verbatim question awaiting user reply>"
      awaiting_from: user
      severity: <warn|error|critical>
    - id: schema-gap-<topic>
      type: schema-gap
      k_count_90d: <N>
      proposed_leaf: <pillar/leaf>
    - id: EXT-<ID>
      type: extraction-pending
      pipeline_state: <current state>
      sla_breach: <true|false>
    # ... etc — every TODO crosses into next session

  # Section 4 of 4 — EVIDENCE (links the next session can verify each claim against)
  evidence:
    - claim: "lifecycle_state vs lifecycle distinction is documented and applied"
      evidenced_in: "pillar-1-architecture-and-stack/frontmatter-standard.md L74-89 + 33 backfilled artifacts"
    - claim: "P-META-004 + P-META-005 are active in principles.yaml"
      evidenced_in: "packages/principles/principles.yaml#P-META-004, #P-META-005"
    - claim: "Manual-intake-protocol IS the bridge until runtime ships"
      evidenced_in: "AGENTS.md (5 hard NOs added in S002) + _intake/manual-protocol.md"
    - claim: "Treasure #3 was processed through pipeline as proof"
      evidenced_in: "extractions-ledger.md rows EXT-20260502-001 + sub-IDs A/B/C/D"
    # ... etc — every section-1 + section-2 claim has section-4 evidence
```

**Side 2 — Next session acknowledges** (in its first reply):

The new chat's FIRST REPLY to the user is the attestation acknowledgement:

```
## Handoff acknowledgement — S<NNN+1> attestation

Read S<NNN>'s §17 checklist. Per-line:

✅ S<NNN+1> understands the lifecycle_state vs lifecycle distinction. Verified in frontmatter-standard.md lines XX-YY.
✅ S<NNN+1> knows P-META-004 and P-META-005 are S002 additions; both reviewed.
✅ S<NNN+1> reviewed AGENTS.md hard NOs + manual-intake-protocol.
❓ Question: BLK-S002-002 (AIBehavior slice introduce/extend/defer) — is the user's preference still to defer until they review treasures? Asking before proceeding.
✅ All other §17 lines acknowledged.

Status: 4 ✅ + 1 ❓. Awaiting user resolution of the ❓ before resuming §3 work.
```

**The contract:** work cannot proceed until **every line is ✅ or ❓ raised**. ❓ items become BLK-S<NNN+1>-* blockers automatically. The fresh-chat protocol step 12 enforces this.

### §11b.1 Continuity-manifest signature/receipt (added v1.8 — S003 §3.5.e — extends EXT-20260502-003-C CSP carry-forward)

The `signature` field above is mechanically verifiable when it follows the canonical format:

```
<session-id>-AI-attest-<iso8601-utc>[-<discriminator>]
```

Where:
- `<session-id>` = `S<NNN>` (the prior session number)
- `iso8601-utc` = `YYYY-MM-DDTHH:MM:SSZ`
- `<discriminator>` (optional) = e.g., `autonomous-overnight` or `intra-session-chat-jump`

Examples:
- `S002-AI-attest-2026-05-02T19:00:00Z`
- `S003-AI-attest-2026-05-03T08:00:00Z-autonomous-overnight`

When the next session executes the §17 attestation in its first reply, it emits a paired **receipt** signature:

```
<receiving-session-id>-AI-receipt-<iso8601-utc>-against-<original-signature>
```

Example:
- `S004-AI-receipt-2026-05-04T08:00:00Z-against-S003-AI-attest-2026-05-03T08:00:00Z-autonomous-overnight`

Audit `handshake-receipt-presence` (planned week 4) verifies every handoff has a paired receipt within 7 days OR explicit `unreceived-with-reason` declaration in the next-session blockers file.

### §11b.2 Continuity-manifest fields (the structural inventory)

Beyond the per-line attestation, the closing AI emits a manifest summarizing the structural inventory delta this session produced:

```yaml
continuity_manifest:
  session: S<NNN>
  pillar_leaves_added: <count + paths>
  pillar_leaves_modified: <count + paths>
  vault_files_added: <count + paths>
  adr_added: <count + IDs>
  principles_added: <count + IDs>
  contracts_added: <count + IDs>
  agents_md_hard_nos_added: <count>
  ext_ids_processed: <count>
  blockers_opened: <count>
  blockers_resolved: <count>
  signature: <as §11b.1>
```

The next session's first reply re-counts (via Glob + Grep) and asserts match-or-mismatch against the manifest. Mismatch = automatic BLK-S<NNN+1>-* blocker; match = continuity verified.

This closes the EXT-20260502-003-C carry-forward (CSP "continuity manifest" formalized in CSPS as the triplet: signature + receipt + manifest-fields).

### §11c Intent-to-impact validation — what the new session checks (v1.2)

The user's S002 turn-6 directive: *"what do you say if handoff will include a validation of 'intent to impact'?"*

The mechanical structure (in §16 of the handoff):

```yaml
intent_to_impact:
  prior_session_stated_intent:
    verbatim: "<from S<NNN>'s §0 paste-target block — the 'what S<NNN+1> must do, in order' list>"
    word_count: <N>
    items: <count>
  prior_session_actual_impact:
    items_completed: [<list of section IDs>]
    items_partial: [<list>]
    items_deferred: [<list>]
    items_added_out_of_scope: [<list with rationale>]
    items_dropped_in_scope: [<list with rationale>]
  drift_assessment:
    in_scope_completion_rate: <percent>
    out_of_scope_additions: <count>
    out_of_scope_total_effort_estimate: <hours>
    drift_severity: "minimal | moderate | substantial | critical"
    triggers_adr: <true|false>
    adr_draft_path: <path or null>
  prior_session_self_assessment: |
    "<honest narrative of what went vs the plan>"
```

The new session validates this on open:
- Reads §16 of the handoff
- Compares prior intent vs actual impact
- If drift_severity ≥ substantial AND no ADR was filed, raises BLK-S<NNN+1>-* blocker for ADR creation
- If drift_severity ≥ critical, work cannot proceed without user explicit acknowledgement

**Why this matters:** it surfaces silent scope-creep BEFORE it compounds across sessions. If S001 said "do A, B, C" and S002 did "A, B, D, E, F" (where D, E, F were out-of-scope), the S003 fresh-chat catches this and the user explicitly accepts/rejects D/E/F as legitimate growth vs drift.

## §12 Session + chat naming / numbering protocol

### Session numbering

`S001`, `S002`, `S003`, … (sequential, no gaps, never reused).

### Chat tab title convention

- **Single-session chat:** `S<NNN> <topic>` — e.g., `S002 pillar-3-migration`
- **Continuation chat** (when one session spans multiple conversations): `S<NNN> [continues] <topic>` — e.g., `S002 [continues] pillar-3-migration`
- **Fresh-session chat (first message):** `S<NNN> [continues S<NNN-1>]` — e.g., `S002 [continues S001]`

### Why session number, not chat number

Sessions are the meaningful unit (a logical work-stream); chats are the technical container. Multiple chats may belong to one session. The session number is what links them and what the handoff filename references.

### When to start a new session vs. continue

- **New session:** significant scope shift (e.g., S001 → S002 = pillar 2 done → pillar 3 starting)
- **Continuation chat (same session):** same scope, context exhausted mid-batch (e.g., S002 chat 1 → S002 chat 2 [same pillar 3 batch])

### Per-session handoff is mandatory

Every session has a `HANDOFF-S<NNN>-to-S<NNN+1>.md` even if it's a continuation chat. For intra-session continuations: `HANDOFF-S<NNN>-chat<N>-to-chat<N+1>.md` is acceptable, but the session-level handoff (S<NNN>-to-S<NNN+1>) is the canonical end-of-session record.

## Where the protocols come from (provenance)

This file consolidates §10, §11, §12 of `HANDOFF-S001-to-S002.md`. From S002 onward, future handoffs reference THIS file rather than re-stating the protocols inline.

Changes to the protocols: edit this file, bump `version`, link the change to the originating principle (e.g., S002's v1.1 added the §10/§11 stewardship-review and learning-loop-extract checkpoints, both required by P-META-004 and P-META-005 respectively).

## Hard rules a session may not violate

(Repeated verbatim from the handoff — these survive across sessions.)

- ❌ Never start new substantive work until the handoff's §3 FWWS-pending items are complete.
- ❌ Never request per-item approval inside an approved batch (P-OP-004 batched-execution principle).
- ❌ Never invent CSPS-specific names where industry-standard ones exist (vocabulary-audit principle, P-ARCH-016).
- ❌ Never close a chat without writing the next handoff (the chat-jump information loss is the highest-cost failure mode).
- ❌ Never modify `packages/principles/principles.yaml` without running `pnpm principles:codegen` and committing both source + generated together (P-META-001).
- ❌ Never create files outside the schema-aligned tree (per "nothing stands alone" / P-ARCH-001).
- ❌ Never silently adjust scope mid-batch — pause and re-confirm with user (P-OP-004 escape hatch).
- ❌ Never save an artifact without `lifecycle_state` declared (P-META-004).
- ❌ Never close a chat without running `/learning-loop-extract` (P-META-005).
