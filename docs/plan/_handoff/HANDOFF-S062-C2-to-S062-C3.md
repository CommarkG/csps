---
id: csps.handoff.S062-C2-to-C3
name: HANDOFF-S062-C2-to-S062-C3
description: "Intra-session tab transfer. Session S062 continues as C3. C2 context exhausted mid-PROTO-S062-A STEP 2 Phase 2."
type: handoff_files
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: handoff_files
session: S062
version: "1.0"
links:
  - docs/plan/protos/PROTO-S062-A.md
  - docs/plan/protos/PROTO-S062-K.md
  - tools/council/sonnet-turn.md
  - tools/scripts/migrate-enforcement-trio.mjs
  - tools/data/improvement-register.yaml
---

# HANDOFF S062-C2 → S062-C3

**Transfer type:** intra-session chat-jump (same logical session S062, new physical tab C3)
**Outgoing tab:** S062-C2 | **Incoming tab:** S062-C3
**Last commit:** `2a0f25c` | **verify:** exit_code=0

---

## Zone A — Identity + State

**YOU ARE:** Sonnet-10, the builder (CSPS exec role).
**SESSION:** S062, continuation tab C3. C2 context exhausted.
**GOVERNOR:** Yariv Fink. Relay protocol active (Opus tab separate).

**Platform state (verified this C2):**
- PROTO-S062-K: PHASE 1 RATIFIED ✅ (commit 3294f2b). 50% milestone written (commit 0619256).
- PROTO-S062-A STEP 2: Phase 1 complete. Phase 2 BLOCKED on Opus glance (awaiting Governor relay).
- PROTO-S062-DEPLOY: Issued by Opus-10 this C2. Queued. Not started.
- verify: exit_code=0 throughout C2.

---

## Zone B — Active Work Queue

### 1. PROTO-S062-A STEP 2 — AWAITING OPUS GLANCE (highest priority)

**State:** Opus glance request committed at `2a0f25c`. Full detail in
`tools/council/sonnet-turn.md` (first block, top of file).

**What Opus needs to glance:** Two `--supply-*` value pairs for the 2 no-tier B_*.md contracts:

| Contract | Supply values |
|---|---|
| `B_DEFINITION_BEFORE_ENFORCEMENT.md` | t1: `user-prompt-submit-ai-profiler.sh` (active), t2: `validate-rule-has-enforcement.mjs` (active), t3: memory |
| `B_EXISTS_NOT_EQUALS_ACTIVE.md` | t1: `post-stop-exists-not-equals-active.sh` (stub), t2: `validate-activation-coverage.mjs` (active), t3: memory |

**What Sonnet does IMMEDIATELY after Opus ADVANCE arrives:**

```bash
# Step 4a: Apply all 64 auto-parseable contracts
node tools/scripts/migrate-enforcement-trio.mjs --apply

# Step 4b: Apply 2 no-tier contracts with supply flags
node tools/scripts/migrate-enforcement-trio.mjs --apply --file B_DEFINITION_BEFORE_ENFORCEMENT.md \
  --supply-t1 "tier=hook,path=.claude/hooks/user-prompt-submit-ai-profiler.sh,status=active" \
  --supply-t2 "tier=validator,path=tools/validators/validate-rule-has-enforcement.mjs,status=active" \
  --supply-t3 "tier=memory,path=session-open injection + this entry,status=active"

node tools/scripts/migrate-enforcement-trio.mjs --apply --file B_EXISTS_NOT_EQUALS_ACTIVE.md \
  --supply-t1 "tier=hook,path=.claude/hooks/post-stop-exists-not-equals-active.sh,status=stub" \
  --supply-t2 "tier=validator,path=tools/validators/validate-activation-coverage.mjs,status=active" \
  --supply-t3 "tier=memory,path=session-open.sh + anti-patterns.md always_include,status=active"
```

Then commit → update `validate-permanence-coverage.mjs` (frontmatter-first + body-scan fallback)
→ re-run validator → STEP 2 COMPLETE report to sonnet-turn.md → AWAIT Opus ADVANCE → STEP 4.

### 2. PROTO-S062-DEPLOY — 3 steps, QUEUED

Issued by Opus-10 in C2. File domain: tools/validators/ + apps/template/ + apps/debt-collection/.csps/.
Start AFTER PROTO-S062-A STEP 2 Phase 2 completes (Opus instruction).

3 steps:
- STEP 1: `tools/validators/validate-app-deploy-readiness.mjs` (Component B, platform-wide)
- STEP 2: `apps/template/.env.example` — comprehensive env var template
- STEP 3: `apps/debt-collection/.csps/deploy-checklist.md` — 7-step Vercel UI sequence for Governor

### 3. FINDING-S062-PERMANENCE-DRIFT — engraved

Already committed at `2a0f25c` to `tools/data/improvement-register.yaml`.
Propagation targets listed there. No C3 action needed except STEP 2 completion fills `commit_fix`.

---

## Zone C — Key Files for C3

| File | Purpose |
|---|---|
| `tools/council/sonnet-turn.md` | Top block = Opus glance request with full --supply-* values |
| `tools/scripts/migrate-enforcement-trio.mjs` | v2.0 migrator (commit 3be1a60) |
| `tools/validators/validate-permanence-coverage.mjs` | Will be updated in Phase 2 |
| `docs/plan/protos/PROTO-S062-A.md` | Full STEP 2 spec (STEP 4 and STEP 6 also defined there) |
| `docs/plan/protos/PROTO-S062-DEPLOY.md` | NOT YET WRITTEN — Opus issued via sonnet-turn relay |
| `tools/data/improvement-register.yaml` | FINDING-S062-PERMANENCE-DRIFT entry |

**Note:** PROTO-S062-DEPLOY was issued as a relay block in the Governor's chat, NOT yet committed
as a .md file. Sonnet should write `docs/plan/protos/PROTO-S062-DEPLOY.md` at start of STEP 1.

---

## ALIGNMENT QUESTIONS

Q1: Has Governor relayed the Opus ADVANCE/COURSE-CORRECT for the `--supply-*` glance? (If yes: proceed to --apply per Zone B Step 4a/4b. If no: wait — do NOT run --apply without Opus glance confirmation.)
Q2: Are the `--supply-*` values in Zone B still accurate? (Verify B_DEFINITION_BEFORE_ENFORCEMENT and B_EXISTS_NOT_EQUALS_ACTIVE enforcement hooks/validators haven't changed since 2a0f25c.)
Q3: Is PROTO-S062-DEPLOY confirmed as the next parallel track after STEP 2 Phase 2 completes? (Confirm before starting any deploy work.)
Q4: Has verify exit_code=0 been confirmed on this handoff file before C3 begins any work?

---

## SONNET STARTUP BLOCK (C3)

```
═══════════════════════════════════════════════════
NEW SONNET TAB — SESSION S062 (Continuation C3)
Context budget exhausted in C2. Same logical session.
═══════════════════════════════════════════════════

INTENT ABSORBED: Session S062-C3 continuation.

Current state:
- PROTO-S062-K: PHASE 1 RATIFIED (commit 3294f2b). 50% milestone written.
- PROTO-S062-A STEP 2: Phase 1 done (migrator v2.0, commit 3be1a60).
  Phase 2 BLOCKED on Opus glance for 2 --supply-* contracts (commit 2a0f25c).
- PROTO-S062-DEPLOY: Queued. Not started. Starts after STEP 2 Phase 2.
- verify: exit_code=0 (commit 2a0f25c).

Key files:
- tools/council/sonnet-turn.md — top block = Opus glance request
- tools/scripts/migrate-enforcement-trio.mjs — v2.0 migrator
- docs/plan/protos/PROTO-S062-A.md — STEP 2 spec (STEP 4, STEP 6 also defined)
- HANDOFF-S062-C2-to-S062-C3.md — this file (Zone B has exact --apply commands)

Relay protocol: Governor pastes Opus ADVANCE here.
If ADVANCE for --supply-* glance: execute Zone B Step 4a/4b immediately.
If new Opus directive: read it fully, confirm scope, execute.

Awaiting Governor directive.
```

---

*Authored by Sonnet-10 | Session S062-C2 | 2026-05-26*
*Last commit: 2a0f25c | verify: exit_code=0*
