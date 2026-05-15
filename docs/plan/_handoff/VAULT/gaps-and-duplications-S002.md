---
id: csps.handoff.vault.gaps-and-duplications-S002
name: handoff-vault-gaps-and-duplications-S002
description: S002 honest audit of gaps (declared-but-not-built), duplications (same content in multiple places), and mechanical-enforcement coverage (declared vs actually-running). Surfaces the wide gap between "the plan describes 47 audit checks + 35 enforcer maps" and "almost none of them are running yet, since the entire CSPS runtime is week-1+ work." User-requested audit per the directive "review all we discussed and identify gaps in general, duplications, and especially focus on mechanical enforcements all over what we do."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-06-01
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
diataxis_type: explanation
links:
  - { rel: parent, href: ./README.md }
  - { rel: source-handoff, href: ../HANDOFF-S001-to-S002.md }
  - { rel: principles, href: ../../../packages/principles/principles.yaml }
domain_path: platform
scope_level: S1
---

# Gaps + Duplications Audit — S002

> **The test is "does it survive me being absent?" If the answer is no, it's not mechanical enough.** — User cardinal directive on mechanical enforcement

## What this file holds

Honest audit of what was declared in S001 + S002 vs what actually runs. The user's specific question:

> *"Review all we discussed and identify gaps in general, duplications, and especially focus on mechanical enforcements all over what we do."*

Answer organized in three parts: **(A) Mechanical enforcement reality check**, **(B) Gaps**, **(C) Duplications**. Each with explicit remediation actions tracked back to the open-questions ledger or future ADRs.

---

## Part A — Mechanical enforcement reality check

The plan describes a deeply layered defense-in-depth enforcement architecture. The honest reality at S002 close:

### Per-principle enforcement coverage (declared vs actually-running)

| Principle | Severity | Declared enforcers | Actually mechanical now |
|---|---|---|---|
| P-OP-001 reuse-first | critical | 10 | **1/10** — AGENTS.md only |
| P-OP-002 FWWS | critical | 8 | **1/8** — AGENTS.md only |
| P-OP-003 PCR | warn | 4 | **1/4** — AGENTS.md only |
| P-OP-004 batched-execution | warn | 4 | **1/4** — AGENTS.md only |
| P-ARCH-001 nothing-stands-alone | critical | (stub) | 0 — not yet defined |
| P-ARCH-002 mechanical-over-procedural | critical | (stub) | 0 |
| P-ARCH-003 files-are-truth-db-is-index | critical | (stub) | 0 |
| P-ARCH-004 one-source-of-truth-per-concern | critical | (stub) | 0 |
| P-ARCH-005 three-layer-composition-only | error | 3 | 0 — files referenced don't exist |
| P-ARCH-006 to P-ARCH-027 | various | various | 0 — runtime work |
| P-META-001 defense-in-depth | critical | 3 | 0 — meta-audit not yet implemented |
| P-META-002 principles-travel | error | 3 | 0 — extract-app generator not built |
| P-META-003 inheritance-via-shared-runtime | error | 4 | 0 — MCP server doesn't exist |
| P-META-004 stewardship-protocol | critical | 8 | **1/8** — AGENTS.md only |
| P-META-005 learning-loop | critical | 11 | **1.5/11** — AGENTS.md + PostStop hook stub (logs but doesn't actually extract) |

**Aggregate honest reality:**
- 36 principles declared
- ~150 enforcer entries declared
- **~6 actually mechanical right now (all the AGENTS.md entries + the PostStop hook stub).**
- ~96% declared but not built. This is week-1+ work explicitly mapped in `pillar-6/build-order.md`, but until then the gap is real.

### What IS mechanical right now

1. **AGENTS.md cascade.** Claude reads it on every session. Hard NOs are honored when AI follows them. The recent updates (S002) added the meta-principles + intake-manual-protocol enforcement.
2. **The Stewardship Protocol's `lifecycle_state` field.** Now applied to 33 existing artifacts. If a new artifact is added without this field, AGENTS.md hard NO catches; `validate-frontmatter.mjs` (when built) blocks PR.
3. **The extractions-ledger.md as the manual mechanical guarantor for uploads.** Created in this turn. AGENTS.md hard NO bans bypass.
4. **The git history (when bootstrapped).** Provenance for every change.

### What is NOT mechanical right now (the honest gap)

1. **The codegen pipeline.** `packages/principles/codegen.ts` is a skeleton. It does not yet emit AGENTS.md from principles.yaml; AGENTS.md is hand-edited (with discipline). Once codegen ships (week 2), drift between the two is mechanically blocked.
2. **All 47 audit checks.** Defined in `audit-runner.md`; none implemented (`libs/audits/checks/*.ts` doesn't exist).
3. **All hooks beyond PostStop.** PreToolUse hooks for capability enforcement, batch detection, WIP limits, write-catalog-check, etc. — referenced in 15+ places, none exist as files.
4. **All Mastra runtime integration.** BaseAgent + persona compose function + dispatcher middleware — all referenced, not built.
5. **All ZenStack policies.** Schema slices defined; no Postgres + no ZenStack codegen yet.
6. **All Cloudflare Workers.** Sandbox runner, intake gate, eval-Worker — all referenced, not deployed.
7. **All MCP servers.** `packages/principles-mcp/` is the planned single MCP for cross-vendor enforcement; it's a planned package; not built.
8. **All Stripe + Clerk wiring.** Pillar 3 leaf pending migration; runtime integration is week 1–3 work.

### What this means in practice

**During S002 → week 6** (~2 months):
- The AI's session-by-session compliance with AGENTS.md is the dominant enforcement
- The manual intake protocol is the dominant ingest enforcement
- Markdown ledgers are the dominant data layer
- The user's review of closing summaries is the dominant subscriber-acknowledgement layer

**This is fragile.** It works because the user is paying attention. It will break the moment the user is absent for a week, the AI hallucinates, or a session-end protocol is silently skipped.

**The build-order priority should weight the runtime layers heavily.** Specifically:
- Week 1: bootstrap so DB exists + git is initialized
- Week 2: principles codegen (so AGENTS.md drift is blocked)
- Week 3: first skill (`/reuse-check`) + PreToolUse hook (so reuse-first becomes mechanical)
- Week 4: audit-runner + meta-audit (so principle-coverage starts firing)

Until week 4, the AI + the user are the enforcers. Honest.

### Remediation actions

| ID | Action | Tracking |
|---|---|---|
| GAP-001 | Build `packages/principles/codegen.ts` to actually emit AGENTS.md from principles.yaml | Week 2 build-order |
| GAP-002 | Implement `validate-frontmatter.mjs` validator | Week 1 build-order |
| GAP-003 | Implement first skills: `/reuse-check`, `/wip-check`, `/pcr`, `/batched-plan`, `/learning-loop-extract`, `/stewardship-review` | Week 3–4 build-order |
| GAP-004 | Implement audit-runner with the 47 checks | Week 4 build-order |
| GAP-005 | Implement PreToolUse hook for write-catalog-check | Week 3 build-order |
| GAP-006 | Implement PostStop hook to actually call extractor (not just log) | Week 4 build-order (ships with audit-runner) |
| GAP-007 | Mark every "WIP enforcer" in principles.yaml with `status: stub` until implemented; meta-audit asserts `not(stub)` only at scheduled milestones | New audit `wip-enforcer-tracking` |

---

## Part B — Gaps

### B.1 — Vault gaps

Per `HANDOFF-S001-to-S002.md` §8, the canonical vault tree includes 8 files:

| File | Status |
|---|---|
| `VAULT/README.md` | ✅ created in S002 |
| `VAULT/insights.md` | ✅ created |
| `VAULT/research-index.md` | ✅ created |
| `VAULT/protocols.md` | ✅ created |
| `VAULT/open-questions-ledger.md` | ✅ created (22 OQ items tracked) |
| `VAULT/validation-pass-S002.md` | ✅ created |
| `VAULT/principles-snapshot.md` | ❌ not yet — defer to S003 close |
| `VAULT/decisions-snapshot.md` | ❌ not yet — defer to S003 close |
| `VAULT/pending-work.md` | ❌ not yet — defer to S003 close |
| `VAULT/user-intents.md` | ❌ not yet — quotes are inline in HANDOFF-S001-to-S002.md §2 instead |

**Gap:** 4 vault files deferred. Acceptable per S002 scope (the 4 deferred are snapshot-class + intent-vault — they're per-session derivatives that can accumulate from S003 onward). Tracked: GAP-008 (S003 closing-protocol creates snapshots).

### B.2 — Pillar migration gaps

| Pillar | Leaves planned | Leaves migrated in S002 | Gap |
|---|---|---|---|
| Pillar 0 — Governance | 8 + 2 NEW (stewardship + learning-loop) = 10 | 10 (incl. 2 new) | ✅ none |
| Pillar 1 — Architecture | 9 | 9 | ✅ none |
| Pillar 2 — Data | 4 | 4 | ✅ none |
| Pillar 3 — Platform Services | 5 | **0 — pending §3.4** | GAP-009 (carry to S003) |
| Pillar 4 — DX | 4 | **0 — pending §3.5** | GAP-010 (carry to S003) |
| Pillar 5 — AI Systems | 3 | **0 — pending §3.5** | GAP-011 (carry to S003) |
| Pillar 6 — Operations | 5 | **0 — pending §3.5** | GAP-012 (carry to S003) |

**Gap aggregate:** 17 leaves still 🟡 to migrate. The user's chat-level pivot to external-input intake meant §3.4 and §3.5 didn't ship in S002. Carry to S003.

### B.3 — ADR gaps

| ADRs planned | Written in S002 | Gap |
|---|---|---|
| 18 seed ADRs (0001-0018) | 12 (0001-0012) | 6 remaining: 0013-0018 |
| 3 enhancement ADRs (0019-0021) from validation pass | 0 | 3 remaining |

**Gap:** 9 ADRs remaining. Carry to S003. Tracked: GAP-013 (S003 priority-zero).

### B.4 — Intake architecture gaps

| Component | State |
|---|---|
| `_intake/README.md` | ✅ |
| `_intake/source-types.md` | ✅ |
| `_intake/manual-protocol.md` | ✅ created this turn |
| `_intake/extractions-ledger.md` | ✅ created this turn |
| `_intake/contexts/README.md` | ✅ created this turn |
| `_intake/external-inputs-plan.md` | ✅ |
| `libs/policies/slices/public/external-input.zmodel` | ✅ schema |
| Per-context folders (9) | ⚠ lazy-created on first use; `_intake/contexts/<context>/` empty until content lands |
| `tools/connectors/*` | ❌ not built (week 5+) |
| `apps/intake-gate/` (Cloudflare Worker) | ❌ not built (week 4) |
| Pub/sub bus | ❌ not deployed |
| Subscribers | ❌ not registered |
| Migration script `tools/intake/migrate-manual-ledger.ts` | ❌ not built (week 6) |

**Gap aggregate:** Schema + protocol + place are ready (✅). Runtime is week 4–6 work (❌). The manual protocol is the bridge.

### B.5 — `AIBehavior` slice gap (the user's "+" question)

Currently distributed across:
- `Persona` slice (DB-defined; pillar-2)
- Skills (file-based; `packages/skills/`)
- AGENTS.md (markdown)
- principles.yaml (YAML config)
- Mastra agents (TypeScript runtime)
- Hooks (`.claude/hooks/`)

**Gap:** No unified schema entity; no admin dashboard; no per-domain behavior coverage audit. The plan in `external-inputs-plan.md` recommends introducing `AIBehavior` slice in week 4. **Decision pending user review.**

Tracked: OQ-INTAKE-006 (open-questions-ledger.md).

### B.6 — Mechanical-enforcement-coverage gap (the meta-gap)

There is no explicit audit that tracks "of the declared enforcers per principle, what fraction are actually implemented." The `principle-coverage` meta-audit (P-META-001) checks the declared count meets the severity minimum, but doesn't check whether the declared enforcers' file paths resolve to real files.

**Recommendation:** Add new meta-audit `enforcer-implementation-status` that resolves every enforcer's `location` field to a file existence check. Output: per-principle "X of Y enforcers actually exist" report. Severity: warn (informational; doesn't block PR; surfaces honesty).

Tracked: GAP-014 (new audit; week 4).

---

## Part C — Duplications

### C.1 — Open Questions duplicated between leaf docs and ledger

Pillar-0 leaf docs each have an "Open questions" section. The questions are ALSO in `open-questions-ledger.md` (extracted by S002 backfill). Right now both contain the questions — risks drift.

**Files affected:**
- `pillar-0/operating-principles.md` §"Open questions" (4 questions)
- `pillar-0/reuse-first-principle.md` §"Open questions / honest limits" (4 questions)
- `pillar-0/rule-registry.md` §"Open questions" (4 questions)
- `pillar-0/adr-process.md` two §"Open questions" sections (3 questions one of them is empty template)
- `pillar-0/stewardship-protocol.md` §"Open questions" (4 questions; explicitly says "tracked separately")
- `pillar-0/learning-loop.md` §"Open questions" (4 questions; explicitly says "tracked separately")

**Resolution:** S003 task — replace the inline "Open questions" in each leaf with a brief "see open-questions-ledger.md by OQ-ID" link. The two newest docs (stewardship-protocol, learning-loop) already do this; older docs need the same edit.

Tracked: DUP-001 (S003 task).

### C.2 — Learning Loop pipeline state machine documented in 4 places

The state machine `observed → triaged → routed → fixing → validated → closed` appears in:
1. `principles.yaml#P-META-005.pipeline_transitions` (canonical source)
2. `pillar-0/learning-loop.md` (full table + ASCII diagram)
3. `libs/policies/slices/public/learning-loop-item.zmodel` (state column + comment-block)
4. `libs/policies/slices/public/external-input.zmodel` (referenced in connector handoff comment)
5. `_intake/external-inputs-plan.md` (multiple references)

**Resolution:** Per P-ARCH-004 (one-source-of-truth-per-concern), `principles.yaml` is canonical. The leaf doc + zmodel + plan should reference, not restate. The ASCII diagram in learning-loop.md is acceptable as visual aid; the precise transition rules MUST live in principles.yaml only.

S003 task: audit each non-canonical mention to ensure it's a reference, not a restatement that could drift.

Tracked: DUP-002 (S003 task).

### C.3 — Confidence thresholds in 3 places (different meanings)

Confidence thresholds appear in:
1. `principles.yaml#P-META-005.config.ai_confidence_thresholds` — Learning Loop AI-extraction bands (0.75 / 0.90)
2. `_intake/external-inputs-plan.md` — gate prompt-injection scan threshold (0.85)
3. `libs/policies/slices/public/external-input.zmodel` — `scan_score` field (0..1, no threshold encoded)

**These are DIFFERENT thresholds for DIFFERENT purposes**: Learning Loop bands govern how AI-extracted insights enter the pipeline; the scan threshold governs whether content passes the prompt-injection gate. Easy to confuse.

**Resolution:** Add a clarifying note in both places that distinguishes Learning Loop confidence (extraction quality) from Gate scan confidence (injection-risk score). Add to principles.yaml as separate config entries.

Tracked: DUP-003 (next principles.yaml edit).

### C.4 — Closing protocol duplicated between handoff and protocols.md

`HANDOFF-S001-to-S002.md` §10 and `VAULT/protocols.md` §10 both contain the closing protocol. The handoff version is **frozen** (S001 history); the protocols.md version is the canonical going-forward source. Acceptable transitional duplication.

**Resolution:** S003 task — when writing HANDOFF-S002-to-S003.md, §10 should be a link to protocols.md, NOT a restatement. The S001 handoff stays as-is for provenance.

Tracked: DUP-004 (S003 closing-protocol step).

### C.5 — "5 / 6 design principles" in 3 places (different lists, similar shape)

- `pillar-0/learning-loop.md` "5 design principles" (synthesized from research)
- `_intake/external-inputs-plan.md` "6 design principles for CSPS external-input intake" (different 6, but similar voice)
- `VAULT/insights.md` references the 5 from learning-loop

These are **different lists for different purposes** but the shape is similar enough to risk confusion.

**Resolution:** Add cross-references making clear which list is which. Each list's purpose lives in its parent doc.

Tracked: DUP-005 (S003 task; minor).

### C.6 — Source-type taxonomy in 2 places

- `_intake/source-types.md` (full taxonomy with risk profiles + extraction confidence)
- `libs/policies/slices/public/external-input.zmodel` (enum values)

These should never drift. The .zmodel enum is the runtime source of truth (once codegen runs); the .md is the human-readable expansion.

**Resolution:** Add a generation note to source-types.md: "the enum values below mirror `external-input.zmodel`; if these drift, .zmodel wins (P-ARCH-003 files-are-truth-db-is-index, applied recursively)."

Tracked: DUP-006 (small edit to source-types.md; low priority).

### C.7 — The 4 operating principles in 4 places (intentional, must not drift)

`principles.yaml`, `MASTER_PLAN.md`, `AGENTS.md`, `pillar-0/operating-principles.md` all state the 4 operating principles + counterweight clauses.

**This duplication is INTENTIONAL** per P-OP-001's "single canonical phrasing prevents principle dilution" insight (S001 distilled in `insights.md`). The phrasing must be byte-identical across all four. Currently it is.

**Resolution:** None needed. But add a meta-audit `canonical-phrasing-drift` that diffs the 4 locations on every PR; fails if non-identical. (Already implied by the codegen-fresh check, but worth making explicit.)

Tracked: DUP-007 (informational; codegen-fresh covers this implicitly).

---

## Summary table — actions extracted

| ID | Type | Action | Priority | Where tracked |
|---|---|---|---|---|
| GAP-001 | Build | codegen.ts emits AGENTS.md | High (week 2) | build-order |
| GAP-002 | Build | validate-frontmatter.mjs | High (week 1) | build-order |
| GAP-003 | Build | First 6 skills | High (week 3-4) | build-order |
| GAP-004 | Build | audit-runner with 47 checks | High (week 4) | build-order |
| GAP-005 | Build | PreToolUse hook | High (week 3) | build-order |
| GAP-006 | Build | PostStop hook does real extraction | Medium (week 4) | build-order |
| GAP-007 | Audit | Mark stub enforcers; track implementation rate | Medium | new audit |
| GAP-008 | Vault | 4 deferred vault snapshot files | Low (S003 close) | S003 task |
| GAP-009-012 | Migrate | Pillars 3, 4, 5, 6 (17 leaves) | High | S003 priority-zero |
| GAP-013 | ADRs | 9 remaining ADRs (0013-0021) | High | S003 priority-zero |
| GAP-014 | Audit | enforcer-implementation-status meta-audit | Medium | new audit week 4 |
| DUP-001 | Refactor | Open Questions inline → ledger references | Medium | S003 task |
| DUP-002 | Refactor | Pipeline state machine canonical-only | Low | S003 task |
| DUP-003 | Clarify | Confidence threshold disambiguation | Low | next principles.yaml edit |
| DUP-004 | Refactor | HANDOFF-S002-to-S003 §10 references protocols.md | High | S003 closing |
| DUP-005 | Cross-ref | "design principles" list disambiguation | Low | S003 task |
| DUP-006 | Note | source-types.md generation note | Low | small edit |
| DUP-007 | Audit | canonical-phrasing-drift meta-check | Low | informational |

**Total actions:** 14 (7 gaps + 7 duplications). Of these, **5 are S003 priority-zero** (GAP-009-013 + DUP-004). The rest fold into the build-order or S003 follow-on tasks.

---

## Honest closing

The plan is well-designed. The architecture choices are research-validated. The principles are sharp.

The execution gap — between **declared** and **mechanical-now** — is real and unavoidable for a pre-runtime project. The remediation is the build-order itself; CSPS's first 6 weeks ARE the construction of the enforcement layer the plan describes.

**Until that runtime ships:**
1. AGENTS.md compliance is the dominant enforcement
2. The manual intake protocol is the dominant ingest enforcement
3. Markdown ledgers are the dominant data layer
4. The user's review of closing summaries is the dominant subscriber-acknowledgement layer
5. Each session's discipline carries the load

This is fragile but legible. **Honesty about the fragility is itself an enforcement layer** — it prevents the "we documented it so it must be working" failure mode.

The user's directive *"the test is does it survive me being absent?"* is the right test. By that test, today's CSPS is mostly NOT mechanical yet. By week 6, it should be.

This audit becomes a `LearningLoopItem` after S003 close (per P-META-005) and is re-checked at the 90-day recurrence-check window (2026-08-01) to verify the GAPs and DUPs above were resolved.
