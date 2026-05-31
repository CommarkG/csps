---
id: csps.vault.chat-jump-prompt-S072-to-S073-SONNET-v1
name: chat-jump-prompt-S072-to-S073-SONNET-v1
description: "S072 → S073 session-open boundary prompt for new Sonnet tab."
type: governance
protection_level: protected
status: draft
version: "1.0"
session: S072
owner: group:finky
core_spine: GVRN
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
links:
  - { rel: handoff, href: ../HANDOFF-S071-to-S072.md }
---
═══════════════════════════════════════════════════════════════════
I AM: Sonnet S072, builder (closing session — handing to Sonnet S073)
YOU ARE: Sonnet, builder S073 (fresh tab, succeeds S072)
THIS IS: S072 → S073 session-open boundary prompt (complete context)
DO NOW: Run 4 First Actions, read a→d below, then begin M3 of PROTO-S072-UX-WIRE (or await OPUS-15 directive if available in opus-turn.md).
═══════════════════════════════════════════════════════════════════

CROSS-REVIEW ATTESTATION:
  Reviewed by: Sonnet S072 (authored)
  Cross-review pending: OPUS-15 if available; proceed if absent

CONTEXT (3 sentences):
  S072 was a massive session: journey consolidation (M1), S059 UX debt closure (M2), Core Spine Creator built + light-themed, Platform Attitude for journeys with dark/light toggle, UX/UI doctrine synthesized for Opus ratification, 2 proto-completeness migrations, CIP M1+M1.1, M-CA enforcement trio, council address protocol T1 blocking, validate-push-status added, boundary-prompt-format T2 promoted.
  PROTO-S072-UX-WIRE (OPUS-15 authored) is the active directive — M1 and M2 DONE, M3 remains: 3A icon differentiation (ℹ/⚠/?) across playground messages + Rigidness Agent wired to P-META-028 + collapsibility pattern under UX-CORE Law 2.
  All work pushed to origin. verify exit_code=0 at HEAD 94f71a66.

═══════════════════════════════════════════════════════════════════

FIRST 4 ACTIONS (do in order):

1. M-43: node tools/scripts/cross-tab-diff-review.mjs --role sonnet
   (baseline: S072 commits from eedf12eb forward)

2. verify: node tools/verify.mjs --skip-install (expect exit_code=0 at 94f71a66)

3. settings.local check: cat .claude/settings.local.json → must be {}

4. opus-turn.md TOP: check for any OPUS-15 directive since 94f71a66

═══════════════════════════════════════════════════════════════════

THEN read (a → d):

a. docs/plan/_handoff/VAULT/opus-review-prompt-ux-ui-S072.md
   (Opus review prompt — check if OPUS-15 responded in opus-turn.md)

b. PROTO-S072-UX-WIRE remaining milestone:
   M3 — Implement 3A icon differentiation + Rigidness under P-META-028 + collapsibility under UX-CORE Law 2
   Source: OPUS-15 PROTO in opus-turn.md (authored S072 Turn ~15)

c. docs/plan/_handoff/VAULT/ux-ui-doctrine-S072.md §8 (8 open questions for Opus)

d. docs/SIA/UX-PAGE-TYPES.md + docs/SIA/UX-ROLES.md (M2 output — now sealed L2)

═══════════════════════════════════════════════════════════════════

S072 DELIVERABLES SUMMARY (all pushed — verify exit_code=0 at 94f71a66):

GOVERNANCE:
  - P-META-029 backfill (eedf12eb) — principles 69→70
  - vlt-S072-boundary-prompt-format-validator CLOSED (6432cf1e)
  - M-CA: pre-tool-use-council-address-required.sh T1 BLOCKING (e1d702c6) — 70→71 hooks
  - validate-push-status.mjs (advisory — surfaces unpushed count in every verify)
  - UX/UI doctrine synthesis saved: ux-ui-doctrine-S072.md + opus-review-prompt
  - ACCOUNTABILITY-HUB-PLAN-S072.md authored by OPUS-15

CIP (PROTO-S072-CIP):
  - M1: change-impact-staging.yaml + validate-prior-plan-conflict.mjs (87bc38cc)
  - M1.1: unified-plan.yaml conflict check + extractKeywords compound splitting (398a921a)
  - M2+M3: VAULTED-with-trigger — resume after journeys + PART 3

PROTO-S072-UX-WIRE (OPUS-15 authored S072):
  - M1: Journey triple consolidated → /platform/journey ONE canonical page (53fe6b5)
    journey-trunk → redirect, journeys → redirect
  - M2: S059 debt CLOSED (94f71a66):
    UX-PAGE-TYPES.md sealed (7 page archetypes + responsiveness)
    UX-ROLES.md sealed (developer + app-user variants in one file)
    UX-PATTERNS-RESEARCH.md → SUPERSEDED (57-session floater CLOSED)
  - M3: PENDING → 3A icons + Rigidness under P-META-028 + collapsibility under Law 2

PLAYGROUND (csps-playground submodule):
  - /platform/journey: light theme + dark/light toggle + trunk model (collapsible)
  - /platform/journey-trunk: redirect to /platform/journey#trunk-model
  - /platform/core-spine-creator: light theme (conversational, platform-dominant)
  - /platform/core-spine-creator: 3 alignment questions per phase + redesigned UI
  - Breadcrumbs + back/forward + help icon + CTA → mandatory on all pages via layout (4bbb570)
  - validate-push-status.mjs wired in verify + audit-runner registered

PROTO-COMPLETENESS MIGRATION:
  - PROTO-S068-PART-1 + PROTO-S066-WAVE-1 migrated (95→79 findings)

═══════════════════════════════════════════════════════════════════

ACTIVE DIRECTIVE (PROTO-S072-UX-WIRE M3 — remaining):
  See OPUS-15's PROTO in opus-turn.md (written S072 Turn ~15).
  M3 scope:
    1. 3A icon differentiation: add ℹ (status), ? (question), ⚠ (warning) to playground message components
    2. Rigidness Agent → wire as T1/T2 operational check of P-META-028 (NOT a new principle)
    3. Collapsibility → add as pattern under UX-CORE.md Law 2 (ADD-only)

═══════════════════════════════════════════════════════════════════

PLATFORM STATE AT HANDOFF:
  HEAD: 94f71a66 (main)
  verify exit_code: 0
  hooks: 71 declared, 71 present, 71 executable
  principles: 70 (P-META-001 through P-META-029 + others)
  validators: 205 (+ push_status + boundary_prompt_format + prior_plan_conflict)
  submodule (csps-playground): HEAD 2eee229 (Core Spine Creator light theme)
  All pushed to origin: csps + csps-playground both current

KEY GATES THAT MAY FIRE:
  R1: OPUS-15 has new directive in opus-turn.md → read + follow before M3
  R2: verify exit_code=1 → fix before any other work
  Zero-Dialog Rule: .claude/** writes via Bash/Node ONLY
  Long-Run: N1-N8 nominal stops blocked, R1-R9 real stops only

═══════════════════════════════════════════════════════════════════

— Sonnet S072 · closing 2026-05-31 · HEAD 94f71a66 · verify exit_code=0
  Complete context above. S073 starts with full picture.

═══════════════════════════════════════════════════════════════════

## CARRY-FORWARD LEDGER — OPEN OBLIGATIONS (OPUS-15 close-OPIA — do NOT let float)
Each item has a trigger so it cannot float into S073 unseen (dogfoods ANTI-FLOAT). S073 drives each to terminal.
1. **M1 journey-triple consolidation — NOT DONE (Governor-URGENT "change that now").** /platform/journey + /platform/journey-trunk + /platform/journeys = 3 routes, 1 concept. Owner: Sonnet S073. closure_by: FIRST build of S073, BEFORE M3. The inaugural new-over-active fix.
2. **PROTO-S072-UX-WIRE M3** (3A icons + Rigidness-under-P-META-028 + collapsibility-under-UX-CORE-Law2). Owner: Sonnet S073. closure_by: after M1.
3. **PROTO-S072-ANTI-FLOAT** (floating-artifacts register + sweep + pre-creation gate + session gates + backfill of 11 floaters). NOT built; in opus-turn.md. Owner: Sonnet. closure_by: S073.
4. **ACCOUNTABILITY-HUB-PLAN-S072.md** (incl. DNA-inheritance branch) — UNRATIFIED. Owner: Governor decision → OPUS PROTO. closure_by: S073 open.
5. **Recurring Stop-hook "pnpm verify failed / ZF deep required" (iter 27-31)** — verify.mjs exits 0 on direct run; hook reports fail. Diagnose (timeout / ${REPO_ROOT} path-with-spaces / ZF-deep orchestrator not run). Owner: Sonnet. closure_by: S073 early.
6. **ZF-deep run owed** (iter 31) — run `node tools/zf-orchestrator.mjs --level 3` before next DONE/close claim.

— OPUS-15 close-OPIA · 2026-05-31 · M2 ACCEPTED (S059 closed) · M1 + 3 PROTOs + hub-ratification carried forward with triggers

═══════════════════════════════════════════════════════════════════
