---
id: csps.handoff.S062-C4-to-C5
name: HANDOFF-S062-C4-to-S062-C5
description: "Intra-session tab transfer. Session S062 continues as C5. C4 context approaching limit post-PROTO-S062-A sealing."
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
  - tools/config/unified-plan.yaml
  - tools/data/permanence-partial-triage.yaml
---

# HANDOFF S062-C4 → S062-C5

**Transfer type:** intra-session chat-jump (same logical session S062, new physical tab C5)
**Outgoing tab:** S062-C4 | **Incoming tab:** S062-C5
**Last commit:** `80c8f28` | **verify:** run in C5 before any work

---

## Zone A — Identity + State

**Session:** S062 (intra-session continuation)
**Tab:** C4 → C5
**Role:** Sonnet-10 (builder + executor)
**Governor:** Yariv (relay between Sonnet tab + Opus tab)

### What C4 completed — ALL SEALED

| Work | Status | Key commits |
|---|---|---|
| STEP 5b APPLY — 10 5b-(a) contracts declared | ✅ DONE | `681c4af` |
| STEP 5b APPLY — 18 5b-(c) exempt canonical reasons | ✅ DONE | `faa8fff` |
| STEP 5b APPLY — 6 PROTO-S063 buildables filed (BATCH-K) | ✅ DONE | `0c2d29c` |
| STEP 5b COMPLETE report → sonnet-turn.md | ✅ DONE | `40e4dc5` |
| STEP 6 — ratchet BASELINE_FRONTMATTER_FULL_TRIO 32→38 | ✅ DONE | `9a7bfbd` |
| audit-runner.md + slices synced | ✅ DONE | `0be431b` + `004d17b` |
| PROTO-S062-A SEALED 🔒 — 3 closing actions | ✅ DONE | `f6c82ee` |
| Frontmatter fix (archived→closed + evidence_block_ref) | ✅ DONE | `80c8f28` |
| Token budget warnings at 70/80/90% context | ✅ BONUS | `739c47b` |
| All commits pushed to origin/main | ✅ PUSHED | `f6c82ee` → `80c8f28` |

### Permanence score (locked)
- `full_trio_canonical` = **38/66 = 58%** — regression floor LOCKED as BLOCKING
- `has_frontmatter` = 66/66 = 100%
- `partial` = 28 (intrinsic-exempt 18 + declared-partial 10)
- Baseline in `validate-permanence-coverage.mjs` = 38

### PROTO status
- **PROTO-S062-K** ✅ SEALED (earlier this session)
- **PROTO-S062-A** ✅ SEALED (C4 — lifecycle_state: closed)
- **PROTO-S062-DEPLOY** 🟡 NEXT — not yet started

### 6 PROTO-S063 buildables queued (BATCH-K, unified-plan.yaml)
1. PROTO-S063-FIVE-SURFACE-VALIDATOR (B_FIVE_SURFACE_ENGRAVING)
2. PROTO-S063-STRUCTURAL-FIX-VALIDATOR (B_STRUCTURAL_PREVENTION_DISCIPLINE)
3. PROTO-S063-CORESPINE-T1-HOOK (B_CORE_SPINE_DISCIPLINE)
4. PROTO-S063-GOVERNOR-PROMPTS-VALIDATOR (B_GOVERNOR_PROMPTS)
5. PROTO-S063-GRADUAL-BUILD-ENFORCEMENT (B_GRADUAL_BUILD_BY_FOUNDATIONS)
6. PROTO-S063-TEMPLATE-CITATION-VALIDATOR (B_TEMPLATE_FIRST_CREATION)

---

## Zone B — Active Work Queue

### IMMEDIATE: Verify + baseline check

```
cd "c:\Users\finky\Desktop\Claude Code\Csps"
node tools/verify.mjs 2>&1 | tail -30
```
Must confirm: exit_code=0 before any work.

### PRIMARY TRACK: PROTO-S062-DEPLOY

**Governor-approved parallel track.** Opus confirmed this is the next active work.

**Write the PROTO file first:**
`docs/plan/protos/PROTO-S062-DEPLOY.md`

Then execute 3 steps:

**STEP 1 — validate-app-deploy-readiness.mjs (Component B platform-wide)**
- New validator in `tools/validators/`
- Checks that apps have: .env.example, .csps/deploy-checklist.md, package.json deploy scripts
- Registers in `pnpm verify` (tools/verify.mjs)
- Goal: Component B permanence — survives `rm -rf apps/debt-collection/`

**STEP 2 — apps/template/.env.example (comprehensive)**
- ANTHROPIC_API_KEY is missing (E2E-BLOCKER-2 from PROTO-S062-K)
- All required env vars with comments explaining each
- Canonical template that all apps inherit from
- See `tools/config/unified-plan.yaml` item `PROTO-S063-TEMPLATE-ENV-EXAMPLE` for context

**STEP 3 — apps/debt-collection/.csps/deploy-checklist.md (7-step Vercel UI)**
- Converts Vercel connect from 30-min debugging → 5-min paste-and-click
- Root Dir=apps/debt-collection, framework=nextjs, include-outside-root=enabled
- See `C:\Users\finky\.claude\projects\c--Users-finky-Desktop-Claude-Code-Csps\memory\project_gate3_vercel_config.md` for full 10 rules

**Single commit per step. Verify exit_code=0 after STEP 3.**

### Context consumption discipline (CRITICAL for C5)

- `node tools/verify.mjs` → pipe to `2>&1 | tail -30`
- `git add` → use directory-level not per-file
- MAX 2 verify runs per session (already used 0 going into C5)
- Do NOT read full contract bodies — frontmatter-only when needed

---

## ALIGNMENT QUESTIONS

Q1: Has PROTO-S062-DEPLOY.md already been written by Opus, or does C5 author it fresh?
    (Opus referenced "RELAY 10" — check if the proto file already exists on disk)

Q2: Is the token budget warning system considered DONE (no Opus review needed), or
    should C5 write a brief report to sonnet-turn.md about it?

Q3: Any new Governor directives from C4 not captured here?

---

## SONNET STARTUP BLOCK — paste this into C5 as first message

```
SESSION S062, continuation tab C5. C4 context full after PROTO-S062-A sealing + PROTO-S062-K + token budget warnings shipped.

WHAT C4 FINISHED:
- PROTO-S062-A: ALL 6 STEPS COMPLETE, SEALED 🔒 by Opus (commits 681c4af → 80c8f28)
  Permanence canonical: 38/66=58%, baseline ratcheted, 6 PROTO-S063 buildables queued
- PROTO-S062-K: SEALED (earlier this session)
- Token budget warnings at 70/80/90% context: LIVE (post-stop-token-tracker.sh + user-prompt-submit-token-budget-warning.sh)
- All commits pushed to origin/main. Last commit: 80c8f28

CURRENT STATE:
- verify: exit_code=0 confirmed (iter 14 fix: lifecycle_state archived→closed + evidence_block_ref)
- 2 protos SEALED this session. PROTO-S062-DEPLOY is the remaining active track.
- 23 hooks active (total_declared=23, all critical present)

WHAT C5 MUST DO:
1. Run: node tools/verify.mjs 2>&1 | tail -30 → confirm exit_code=0
2. Check if docs/plan/protos/PROTO-S062-DEPLOY.md exists (Opus may have written it)
3. If not: author PROTO-S062-DEPLOY.md + execute 3 STEPS:
   STEP 1: validate-app-deploy-readiness.mjs (Component B validator)
   STEP 2: apps/template/.env.example (add ANTHROPIC_API_KEY + all required vars)
   STEP 3: apps/debt-collection/.csps/deploy-checklist.md (7-step Vercel UI)
4. Single commit per step. Verify exit_code=0 after STEP 3.

CONTEXT BURN DISCIPLINE:
- verify: | tail -30
- git add: directory-level
- MAX 2 verify runs per session

Handoff file: docs/plan/_handoff/HANDOFF-S062-C4-to-S062-C5.md
Role: Sonnet-10 | Governor: Yariv | Protocol: RELAY (Opus reviews, Governor relays)
```
